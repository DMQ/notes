var node_modules = 'C:/Users/mumu/AppData/Roaming/npm/node_modules/';
var fs = require('fs');
var Q = require(node_modules + 'q');
var glob = require(node_modules + 'glob');
// var filePath = './**/*.{html,css}';	// 要处理的文件
// var copyFilePath = './**/*-copy.{html,css}';	// 要删除的备份文件

var filePath = 'E:/dev_tools/git/operate/WebContent/newguys/**/*.{html,css}';	// 要处理的文件
var copyFilePath = 'E:/dev_tools/git/operate/WebContent/newguys/**/*-copy.{html,css}';	// 要删除的备份文件

 doIt();
// reset();

function doIt() {
	deletCopyFiles(copyFilePath).done(function (data) {
		log('删除备份文件共处理',
			data.count,
			'个，成功',
			data.successCount,
			'个，过滤',
			data.filterCount,
			'个，失败',
			data.errCount,
			'个\n'
		);

		glob(filePath, function (err, filesList) {
			var count = 0;
			var errCount = 0;

			if (err) {
				log('读取文件列表失败');
				return ;
			}
			
			filesList.forEach(function (file, index) {
				preadFile(file, 'utf-8')
					.then(function (fileObj) {
						var fileCopyName = file.replace(/(?=\.[^.]+$)/g, '-copy');

						// 备份
						return pwriteFile(fileCopyName, fileObj.fileData);
					}, function () {
						log('读取文件 ' + file + ' 失败');
						count += 1;
						errCount += 1;

						if (count == filesList.length) {
							log('处理完毕：共', count, '个,', count - errCount, '个成功,', errCount, '个失败');
						}
					})
					.then(function (fileObj) {
						log('备份文件: ' + file + ' ==> ' + fileObj.fileName + ' 成功');

						// 添加时间戳
						return timetagHandler(file, fileObj.fileData);
					}, function (fileObj) {
						log('备份文件 ' + file + '失败');
					})
					.then(function () {
						log(file + ' 添加时间戳成功, index: ' + index);
					}, function () {
						log(file + ' 添加时间戳失败');
						errCount += 1;
					})
					.finally(function () {
						count += 1;

						if (count == filesList.length) {
							log('\n处理完毕：共', count, '个, 成功', count - errCount, '个, 失败', errCount, '个');
						}
					});
			});
		});
	});
}

// 从备份文件恢复
function reset() {
	deletCopyFiles(filePath, /-copy/g).done(function (data) {
		log('删除备份文件共处理',
			data.count,
			'个，成功',
			data.successCount,
			'个，过滤',
			data.filterCount,
			'个，失败',
			data.errCount,
			'个\n'
		);

		glob(copyFilePath, function (err, filesList) {
			var count = 0;
			var errCount = 0;

			if (err) {
				log('读取文件列表失败');
				return ;
			}
			
			filesList.forEach(function (file, index) {
				preadFile(file, 'utf-8')
					.then(function (fileObj) {
						var fileCopyName = file.replace(/-copy/g, '');

						// 备份
						return pwriteFile(fileCopyName, fileObj.fileData);
					}, function () {
						log('读取文件 ' + file + ' 失败');
						count += 1;
						errCount += 1;

						if (count == filesList.length) {
							log('处理完毕：共', count, '个,', count - errCount, '个成功,', errCount, '个失败');
						}
					})
					.then(function (fileObj) {
						log('从备份文件恢复: ' + file + ' ==> ' + fileObj.fileName + ' 成功');

					}, function (fileObj) {
						log('从备份文件恢复：' + file + '失败');
					})
					.finally(function () {
						count += 1;

						if (count == filesList.length) {
							log('\n从备份文件恢复处理完毕：共', count, '个, 成功', count - errCount, '个, 失败', errCount, '个');
						}
					});
			});
		});
	});
}

function timetagHandler(file, fileData) {
	var cssReg = /\.css$/;
	var replaceReg;

	// css文件
	if (cssReg.test(file)) {
		// 匹配 url 的值
		replaceReg = /url\([\"\']?(.*?)[\"\']?\)/g;

		fileData = fileData.replace(replaceReg, function ($1, $2) {
			// 排除base64图片
			if (/^data/.test($2)) {
				return $1;
			} else {
				return $1.replace($2, addTimetag($2));
			}
		});
	} else {
		// 匹配标签 href、src 属性的值
		replaceReg = /\<.*(href|src)\s?\=\s?[\"\'](.*?)[\"\'].*\>/g;

		fileData = fileData.replace(replaceReg, function ($1, $2, $3) {
			return $1.replace($3, addTimetag($3));
		});
	}

	// 添加了时间戳的内容重新写入文件
	return pwriteFile(file, fileData);
};

// 读文件
function preadFile(file, encoding) {
	var def = Q.defer();
	encoding = encoding || null;

	fs.readFile(file, encoding, function (err, fileData) {
		if (err) {
			def.reject({
				'fileName': file
			});
		} else {
			def.resolve({
				'fileName': file,
				'fileData': fileData
			});
		}
	});

	return def.promise;
}

// 写入文件
function pwriteFile(file, fileData) {
	var def = Q.defer();

	if (!fileData) {
		def.reject({'errorMsg': '没有传入文件内容'});
	} else {
		fs.writeFile(file, fileData, function (err) {
			if (err) {
				def.reject({
					'fileName': file
				});
			} else {
				def.resolve({
					'fileName': file,
					'fileData': fileData
				});
			}
		});
	}

	return def.promise;
}

// 删除所有备份文件
function deletCopyFiles(filePath, filterReg) {
	var def = Q.defer();
	var count = 0;
	var filterCount = 0;
	var errCount = 0;

	glob(filePath, function (err, filesList) {
		if (err) {
			log('读取备份文件失败');
		}

		if (!filesList.length) {
			checkResolve(0);

			return ;
		}

		filesList.forEach(function (file) {
			if (filterReg && filterReg.test(file)) {
				count += 1;
				filterCount += 1;

				checkResolve(filesList.length);

				return ;
			}

			fs.unlink(file, function (err) {
				count += 1;

				if (err) {
					errCount += 1;
					log('删除备份文件 ' + file + ' 失败');
				}

				checkResolve(filesList.length);
			});
		});
	});

	function checkResolve(listLength) {
		if (count == listLength) {
			def.resolve({
				'count': count,
				'filterCount': filterCount,
				'successCount': count - filterCount - errCount,
				'errCount': errCount
			});
		}
	}

	return def.promise;
}

// 给路径添加时间戳
function addTimetag(str) {
	if (/^(#+|javascript|tel|email)/.test(str)) {
		return str;
	}
	
	var now = new Date();
	var year = now.getFullYear();
	var month = addZero(now.getMonth() + 1);
	var date = addZero(now.getDate());
	var hour = addZero(now.getHours());
	var minute = addZero(now.getMinutes());
	var time = '' + year + month + date + hour + minute;
	var reg = /_t\=[^\"\']*/;

	var strArr = str.split('#');
	var hash = strArr.length > 1 ? ('#' + strArr[1]) : '';
	var returnStr = '';

	str = strArr[0];

	if (str.indexOf('?') > -1) {
		if (reg.test(str)) {
			returnStr = str.replace(reg, '_t=' + time) + hash;
		} else {
			returnStr = str + '&_t=' + time + hash;
		}
	} else {
		returnStr = str + '?_t=' + time + hash;
	}

	if (!/^(http|\/)/.test(returnStr)) {
		returnStr = '/operate/newguys/' + returnStr.replace(/^(\.+\/)+/, '');
	}

	return returnStr;
}

function addZero(num) {
	return num >= 10 ? num : '0' + num;
}

function log () {
	console.log.apply(null, [].slice.call(arguments));
}
