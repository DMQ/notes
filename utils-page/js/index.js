;!function (window, $, undefined) {
	var module = {
		//二维码相关
		qrCode: {
			init: function () {
				$('.link').on('keyup', function () {
					var link = $(this).val().trim();

					$('#qrcode-pic').html('').qrcode({
						render: 'canvas',
						width: 250,
						height: 250,
						text: link
					});
				});
			}
		},

		//base64相关
		base64: {
			init: function () {
				this.picPreview();
				this.compressCtrl();
			},

			picPreview: function () {
				var me = this,
					$dropArea = $('.drop-area'),
					$file = $('file');
				
				$('#file').picPreview({
					'dropTarget': $dropArea,
					'compress': false,
					'onBefore': function (e) {
						me.onPreviewBefore(this, e);
					},
					'onSuccess': function (base64Url) {
						var file = this.get('file'),
							$content = $('.result-wrap .content');

						$dropArea.val(file.name);


						$content.find('span').first().html(this.fileSizeText(file.size) + '<br><br>' + file.originalWidth + ' x ' + file.originalHeight);
						

						$content.find('span').eq(2).html(this.fileSizeText(base64Url.length) + '<br><br>' + file.compressWidth + ' x ' + file.compressHeight);

						$content.find('textarea').val(base64Url);
						$content.find('img').attr('src', base64Url);
					},
					'onError': function (errorMsg) {
						alert(errorMsg);
					}
				});
			},

			onPreviewBefore: function (previewObj, e) {
				var compress = $('.need-compress').prop('checked');

				if (compress) {
					var width = $('.width-input').val(),
						height = $('.height-input').val();

					previewObj.set({
						'compress': true,
						'compressWidth': width,
						'compressHeight': height
					});
				} else {
					previewObj.set({
						'compress': false
					});
				}
			},

			compressCtrl: function () {
				$('.settings').on('change', '.need-compress', function () {
					var checked = $(this).prop('checked');
					$('.width-input').prop('disabled', !checked);
					$('.height-input').prop('disabled', !checked);

					$('#file').data('picPreview').preview();
				}).on('change', '.width-input, .height-input', function () {
					$('#file').data('picPreview').preview();
				});
			}
		}
	};
	

	$(function () {
		module.qrCode.init();
		module.base64.init();
	});
}(window, jQuery);