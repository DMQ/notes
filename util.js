/* 
 * 通用工具集
 * @author muqin_deng
 * @time 2015/03/16
 */
(function(window, undefined) {
    var util = {
        data: {
            ONE_DATE: 24 * 60 * 60 * 1000
        },

        userAgent: navigator.userAgent,

        loading: function(show) {
            var $loading = $('.loading');

            if (show === false) {
                $loading.hide();
                return;
            }

            $loading.show();
        },

        //时间补0
        timeAddZero: function(time) {
            if (time < 10) {
                return '0' + time;
            } else {
                return '' + time;
            }
        },

        //显示消息提示
        showTips: function(tips, time) {
            var me = this,
                $userinfoPs = $("#tips-msg"),
                closeTime = time || 1000;

            if (tips == 'HIDE') {
                $userinfoPs.fadeOut();
                return;
            }

            $userinfoPs.html(tips).fadeIn(function() {
                if (closeTime == 'NOHIDE') {
                    return;
                }

                me.delay(closeTime).done(function() {
                    $userinfoPs.fadeOut();
                });
            });
        },

        //延时函数
        delay: function(t) {
            var deferred = $.Deferred();

            setTimeout(function() {
                deferred.resolve();
            }, t);

            return deferred.promise();
        },

        //转义特殊字符<,>,",'
        escapeHtml: function(html) {
            var div = document.createElement('div');

            if (div.innerText) {
                div.innerText = html;
            } else {
                div.textContent = html;
            }

            return div.innerHTML;
        },

        //根据连接符取驼峰式单词
        getCamelWord: function(str, connector) {
            var strArr, i, len;

            connector = connector || '-';

            strArr = str.split(connector);

            str = strArr[0];

            for (i = 1, len = strArr.length; i < len; i++) {
                str += strArr[i].slice(0, 1).toLocaleUpperCase() + strArr[i].slice(1);
            }
            return str;
        },

        //获取根路径（可含项目路径）
        getRootPath: function(needProjectPath) {
            var href = window.location.href, //完整路径
                pathName = window.location.pathname, //主机后面的路径
                pos = href.indexOf(pathName),
                localhostPath = href.substring(0, pos), //主机路径
                projectName = /\/[^\/]+\//.exec(pathName)[0];

            if (needProjectPath) {
                return (localhostPath + projectName);
            }

            return localhostPath;
        },

        //获取字节长度
        getRealLength: function(str) {
            return str.replace(/[^\x00-\xff]/g, "**").length;
        },

        //判断移动端系统
        checkMobileSystem: function(type) {
            var regObj = {
                'ios': /\(i[^;]+;( U;)? CPU.+Mac OS X/,
                'android': /Android/i
            };

            if (!regObj[type]) {
                return;
            }

            return regObj[type].test(this.userAgent);
        },

        //获取url键值对
        getUrlKeyValObj: function() {
            var url = window.location.href,
                arr, i, len,
                paramsObj = {};

            if (this.urlKeyValObj) {
                return this.urlKeyValObj;
            }

            arr = url.substring(url.indexOf('?') + 1).split('&');

            for (i = 0, len = arr.length; i < len; i++) {
                var reg = /(.*)\=(.*)/g,
                    match = reg.exec(arr[i]);

                if (match && match[1]) {
                    paramsObj[decodeURIComponent(match[1])] = decodeURIComponent(match[2]);
                }
            }

            this.urlKeyValObj = paramsObj;

            return paramsObj;
        },

        //获取url的对应参数的值
        getUrlValue: function(param) {
            if (!param) {
                return '';
            }

            var paramsObj = this.getUrlKeyValObj();

            if (paramsObj.hasOwnProperty(param)) {
                return paramsObj[param];
            } else {
                return '';
            }
        },

        /*
         * 函数节流
         * @param {function} method 要进行节流的函数
         * @param {number} delay 延时时间(ms)
         * @param {number} duration 经过duration时间(ms)必须执行函数method
         */
        throttle: function(method, delay, duration) {
            var timer = null,
                begin = null;
            return function() {
                var context = this,
                    args = arguments,
                    current = new Date();
                if (!begin) {
                    begin = current;
                }
                if (timer) {
                    window.clearTimeout(timer);
                }
                if (duration && current - begin >= duration) {
                    method.apply(context, args);
                    begin = null;
                } else {
                    timer = window.setTimeout(function() {
                        method.apply(context, args);
                        begin = null;
                    }, delay);
                }
            };
        },

        /*
         * 页面模板引擎解析
         * @param {string} html 要进行解析的html字符串（在<##>里面的转换成js来执行）
         * @param {object} data html中解析传入的数据对象
         * @param {object} scope 作用域
         * @return {string} 返回解析后的html字符串
         */
        templateEngine = function(html, data, scope) {
            var re = /<#(.*?)#>/g,
                reExp = /(^(\s|\t|\n|\r)*((var|if|for|else|switch|case|break)\b|{|}))(.*)?/g,
                code = 'var r=[];\n',
                cursor = 0;

            html = html.replace(/\n|\r|\t/g, '');

            var add = function(line, js) {
                js ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
                    (code += line !== '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
                return add;
            };

            while (match = re.exec(html)) {
                var noJsStr = html.slice(cursor, match.index);
                add(/[^\s]/g.test(noJsStr) ? noJsStr : '')(match[1], true);
                cursor = match.index + match[0].length;
            }
            add(html.substr(cursor, html.length - cursor));
            code += 'return r.join("");';

            var variable = [],
                value = [];
            for (var key in data) {
                variable.push(key);
                value.push(data[key]);
            }

            return new Function(variable, code.replace(/[\r\t\n]/g, '')).apply(scope ? scope : data, value);
        }

        //元素滚动到可见区域
        scrollIntoView: function(elem, always) {
            if (always === true) {
                elem.scrollIntoView();
                return;
            }
            elem.scrollIntoViewIfNeeded();
        },

        //获取用户当前经纬度，使用HTML5 Geolocation API
        getLocation: function(successFn, errorFn) {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    successFn(position.coords.longitude, position.coords.latitude);
                }, errorFn);
            } else {
                this.delay(100, errorFn);
            }
        },

        //获取当前城市，使用百度地图api接口 http://api.map.baidu.com/api?v=2.0&ak=kx7GASe6dXLGpwUsvqKxQdMn
        getCurrentCity: function() {
            var deferred = $.Deferred();
            //获取经纬度
            this.getLocation(function(lng, lat) {
                var point = new BMap.Point(lng, lat),
                    geoc = new BMap.Geocoder();

                geoc.getLocation(point, function(rs) {
                    var addComp = rs.addressComponents;

                    if (!addComp.city) {
                        addComp.city = '海外';
                    }

                    deferred.resolve(addComp.city);
                });
            }, function(error) {
                deferred.reject(error);
            });

            return deferred.promise();
        }

    };

    if (typeof define == 'function') {
        define(['Zepto'], function($) {
            return util;
        });
    }

    window.Util = window.Util || util;

    /*** 时间格式化相关 ***/
    var format = function(formatStr) {
        var year, month, day, hour, minute, second,
            reg, rule, afterFormat;

        if (!formatStr) {
            return this.getTime();
        }

        year = this.getFullYear();
        month = this.getMonth() + 1;
        day = this.getDate();
        hour = this.getHours();
        minute = this.getMinutes();
        second = this.getSeconds();

        rule = {
            'yy': year - 2000,
            'yyyy': year,
            'M': month,
            'MM': util.timeAddZero(month),
            'd': day,
            'dd': util.timeAddZero(day),
            'h': hour,
            'hh': util.timeAddZero(hour),
            'm': minute,
            'mm': util.timeAddZero(minute),
            's': second,
            'ss': util.timeAddZero(second)
        };

        reg = /y{2,4}|M{1,2}|d{1,2}|h{1,2}|m{1,2}|s{1,2}/g;

        afterFormat = formatStr.replace(reg, function($) {
            if ($ in rule) {
                return rule[$];
            } else {
                return $;
            }
        });

        return afterFormat;

    };

    Date.prototype.format = format;

    //天，时，分，秒的毫秒数
    var ONE_SECOND = 1000,
        ONE_MINUTE = ONE_SECOND * 60,
        ONE_HOUR = ONE_MINUTE * 60,
        ONE_DAY = ONE_HOUR * 24;

    var timeGone = function(infoObj) {


        var now = new Date(),
            currYear = now.getFullYear(), //当前年
            currMonDays = new Date(currYear, now.getMonth() + 1, 0).getDate(), //当前月的总天数
            firstDay = new Date(currYear, 0, 1), //当前年的第一天
            lastDay = new Date(currYear, 11, 31), //当前年的最后一天
            oneYearDays = lastDay.getTime() - firstDay.getTime() + ONE_DAY; //当前年的总毫秒数

        var compareArr = [{
                'type': 'year',
                'time': oneYearDays
            }, {
                'type': 'month',
                'time': currMonDays * ONE_DAY
            }, {
                'type': 'day',
                'time': ONE_DAY
            }, {
                'type': 'hour',
                'time': ONE_HOUR
            }, {
                'type': 'minute',
                'time': ONE_MINUTE
            }, {
                'type': 'second',
                'time': ONE_SECOND
            }],
            info = {
                'year': '年',
                'month': '个月',
                'day': '天',
                'hour': '小时',
                'minute': '分钟',
                'second': '秒'
            },
            i = 0,
            differ = Math.abs(now.getTime() - this.getTime()), //传入时间与当前时间的毫秒差值
            result = 0;

        //从年开始算，不满1就继续往下推，大于等于1就结束
        while (result < 1 && i < compareArr.length) {
            result = differ / compareArr[i].time;
            i++;
        }

        var type = compareArr[i - 1].type;

        result = Math.floor(result) === 0 ? 1 : Math.floor(result);

        return result + (infoObj && infoObj[type] ? infoObj[type] : info[type]) + '前';
    };

    Date.prototype.timeGone = timeGone;



    if (window.localStorage) {
        util.ls = {
            set: function(key, value) {
                var oldval = this.get(key);

                //在setItem前先removeItem避免iPhone/ipad上偶尔的QUOTA_EXCEEDED_ERR错误
                if (oldval !== '') {
                    this.remove(key);
                }

                window.localStorage.setItem(key, value);

                return this;
            },

            get: function(key) {
                var value = window.localStorage.getItem(key);
                //如果为空统一返回null
                return !value ? '' : value;
            },

            remove: function(key) {
                window.localStorage.removeItem(key);

                return this;
            }
        };
    } else {
        //操作cookie
        util.ls = {
            //expires传过期月数
            set: function(name, value, expires, path, domain, secure) {
                var cookieText = encodeURIComponent(name) + '=' + encodeURIComponent(value);

                if (!expires) {
                    expires = 12; //默认一年过期
                }

                var today = new Date();
                expires *= 2592000000;
                var expires_date = new Date(today.getTime() + expires);
                cookieText += '; expires=' + expires_date.toGMTString();

                if (path) {
                    cookieText += '; path=' + path;
                }

                if (domain) {
                    cookieText += '; domain=' + domain;
                }

                if (secure) {
                    cookieText += '; secure';
                }

                document.cookie = cookieText;

                return this;
            },

            get: function(name) {
                var reg = new RegExp(name + '\=([^;=]+)');
                var match = reg.exec(document.cookie);

                return match ? match[1] : '';
            },

            remove: function(name, path, domain, secure) {
                this.set(name, '', new Date(0), path, domain, secure);

                return this;
            }
        };
    }

})(window);