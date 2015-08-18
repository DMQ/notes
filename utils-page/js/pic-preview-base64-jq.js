/**
 * 图片上传预览组件
 * 依赖jQuery	
 * @author muqin_deng@kingdee.com
 * @time 2014/11/20
 */

;(function (global, doc, factory) {
	factory = factory(global, doc);

	if (typeof define === 'function' && (define.adm || define.cmd)) {
		define(['jQuery'], function ($) {
			$.fn.picPreview = factory;
		});
	} else {
		$.fn.picPreview = factory;
	}

})(window, document, function (global, doc) {

	var isSuppFR = suppFileReader(),
		defaultSettings = {
			target: null, //如果传了target则将target的事件委托到选中元素上

			dropTarget: null,	//拖放目标（如果有，可拖放图片到该元素目标上）

			size: 1024 * 1024 * 200,	//200M

			compress: false,	//是否进行压缩

			imageType: null,	//压缩后的图片格式

			compressWidth: 0,	//压缩后的目标宽度1

			compressHeight: 0,	//压缩后的目标高度

			onSuccess: function (result) {},	//成功回调

			onError: function (msg) {},		//失败回调

			onBefore: function (e, pp) {},	//在上传文件预览前执行

			onAlways: function (e) {}	//在change监听函数里必须执行
		};

	//最终返回的辅助函数
	function picPreview (settings) {
		var cfg = $.extend({}, defaultSettings, settings);

		return this.each(function () {
			var pp = new PicPreview(cfg);

			pp.init();
			
			if (cfg.target) {
				$(this).on('change', cfg.target , function (e) {
					onChange(e, pp);
				});
			} else {
				$(this).on('change', function (e) {
					onChange(e, pp);
				});
			}

			if (cfg.dropTarget) {
				$(cfg.dropTarget).on('dragover', fileDrapOver)
				.on('dragleave', fileDrapOver)
				.on('drop', function (e) {
					e.preventDefault();
					e.stopPropagation();
					onChange(e, pp);
				});
			}

			//将实例存放起来，便于外部访问
			$(this).data("picPreview", pp);

		});
	};

	function onChange(e, pp) {
		var files = e.target.files || e.originalEvent.dataTransfer.files;


		if (!isSuppFR) {
			pp.cfg.onError.call(pp, '您的浏览器不支持FileReader');
		}

		if (files.length > 0) {
			pp.cfg.file = files[0];
			pp.cfg.event = e;
			pp.preview();
		}

		if (pp.cfg.dropTarget) {
			$(pp.cfg.dropTarget).removeClass('drag-over');
		}

		pp.cfg.onAlways.call(pp, e);
		
	}

	function fileDrapOver(e) {
		e.preventDefault();
		e.stopPropagation();
		$(this)[e.type == 'dragover' ? 'addClass' : 'removeClass']('drag-over');
	}

	//预览压缩类
	function PicPreview (settings) {
		this._$elem = $('');	//根节点
		this.cfg = settings;
	}

	PicPreview.prototype = {

		init: function (cfg) {
			var $drawImagePreview = $('#draw-image-preview_');

			if ($drawImagePreview.length) {
				this._$elem = $drawImagePreview;
			} else {
				this._$elem = $('<canvas id="draw-image-preview_" style="display: none"></canvas>').appendTo('body');
			}

			return this;
		},

		//预览
		preview: function () {
			var me = this,
				file = this.cfg.file,
				msg = '';

			this.cfg.onBefore.call(this, this.cfg.event);

			if (!file) {	//文件不存在
				return ;
			}

			if (!/image\/\w+/.test(file.type)) {
				msg = '请选择图像类型文件'

			} else if (file.size > this.cfg.size) {
				msg = '图片不能大于' + this.fileSizeText(this.cfg.size);
			} else {
				var fileReader = new FileReader();
				fileReader.readAsDataURL(file);
				fileReader.onload = function () {
					var img = new Image();

					img.onload = function () {
						file.compressWidth = file.originalWidth = img.width;
						file.compressHeight = file.originalHeight = img.height;
						//是否压缩
						if (!me.cfg.compress) {
							me.cfg.onSuccess.call(me, fileReader.result);
						} else {
							me._compress(fileReader.result, img);
						}
					};

					img.src = this.result;
				};
				return ;
			}

			this.cfg.onError.call(me, msg);
		},

		//压缩(等比缩小图片)
		_compress: function (rs, img) {
			var me = this,
				file = this.cfg.file,
				width = img.width,
				height = img.height,
				canvas = this._$elem[0],
				context = canvas.getContext('2d'),
				compressWidth = this.cfg.compressWidth,
				compressHeight = this.cfg.compressHeight,
				scale;	//源图片高宽比例

			//高跟宽的比例
			scale = height / width;

			//判断是否有设定压缩后的宽跟高
			if (compressWidth && !isNaN(compressWidth) && compressHeight && !isNaN(compressHeight)) {
				width = compressWidth;
				height = compressHeight;
			} else if (compressWidth && !isNaN(compressWidth)) {
				width = compressWidth;
				height = parseInt(width * scale);
			} else if (compressHeight && !isNaN(compressHeight)) {
				height = compressHeight;
				width = parseInt(height / scale);
			}

			file.compressWidth = width;
			file.compressHeight = height;

			me._setWH(width, height);

			context.clearRect(0, 0, width, height);

			context.drawImage(img, 0, 0, width, height);

			var imageType = me.cfg.imageType || file.type;

			me.cfg.onSuccess.call(me, canvas.toDataURL(imageType));
		},

		//设置cavans宽高
		_setWH: function (w, h) {
			this._$elem[0].width = w;
			this._$elem[0].height = h;
		},

		set: function (obj) {
			$.extend(this.cfg, obj);
		},

		get: function (name) {
			return this.cfg[name];
		},

		fileSizeText: function (size) {
			var typeArr = ['B', 'KB', 'M', 'G'];

			if (isNaN(size)) { return '0B'; }

			for (var i = 0, len = typeArr.length; i < len; i++) {
			  if (size < 1024) {
			     break;
			  }
			  size = size / 1024;
			}

			return ('' + size).match(/\d+(\.\d{1,2})?/)[0] + typeArr[i >= len ? len -1 : i];
		}

	};

	//判断是否支持文件转base64
	function suppFileReader() {
		try{	
			FileReader;
			return true;
		}catch(e){
			return false;
		}
	}

	return picPreview;
});
