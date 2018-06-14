/**
 * Ajax调用后台功能
 * 
 * @param {String} url 调后台的链接
 * @param {String} formId 要提交的form表单的id
 * @param {Function} callBackFun 回调函数(返回) 参数(code,responseText) code如--》91: 404错误\92：500错误\99：未知异常\00:成功
 * @param {Object} extSettings 可选参数，用于设置扩展的ajax的setting参数
 */
function myLandAjaxHtml(url, formId, callBackFun, extSettings) {
    var parObj = {
        "type" : 1,
        "value" : formId
    };

    var settings = {};
    if(extSettings) {
        for (var item in extSettings) {
            settings[item] = extSettings[item];
        }
    }
    settings.url = url;
    settings.dataType = "html";

    myLandAjaxBase(settings, parObj, callBackFun);
}

/**
 * Ajax调用后台功能
 * example:
 * myLandAjaxDataHtml(
 *     "xxx.do",
 *     { "key" : "value" },
 *     callBackFun
 * );
 * 
 * @param {String} url 调后台的链接
 * @param {Object} dataObj 要提交的数据对象
 * @param {Function} callBackFun
 * @param {Object} extSettings 可选参数，用于设置扩展的ajax的setting参数
 */
function myLandAjaxDataHtml(url, dataObj, callBackFun, extSettings) {
    var parObj = {
        "type" : 2,
        "value" : dataObj
    };

    var settings = {};
    if(extSettings) {
        for (var item in extSettings) {
            settings[item] = extSettings[item];
        }
    }
    settings.url = url;
    settings.dataType = "html";

    myLandAjaxBase(settings, parObj, callBackFun);
}

/**
 * Ajax调用后台功能Json方式
 * 
 * @param {String} url 调后台的链接
 * @param {String} formId 要提交的form表单的id
 * @param {Function} callBackFun 回调函数(返回) 参数(code,responseText) code如--》91: 404错误\92：500错误\99：未知异常\00:成功
 * @param {Object} extSettings 可选参数，用于设置扩展的ajax的setting参数
 */
function myLandAjaxJson(url, formId, callBackFun, extSettings) {
    var parObj = {
        "type" : 1,
        "value" : formId
    };

    var settings = {};
    if(extSettings) {
        for (var item in extSettings) {
            settings[item] = extSettings[item];
        }
    }
    settings.url = url;
    settings.dataType = "json";

    myLandAjaxBase(settings, parObj, callBackFun);
}

/**
 * Ajax调用后台功能Json方式.
 * example:
 * myLandAjaxDataJson(
 *     "xxx.do",
 *     { "key" : "value" },
 *     callBackFun
 * );
 * 
 * @param {String} url 调后台的链接
 * @param {Object} dataObj 要提交的数据对象
 * @param {Function} callBackFun
 * @param {Object} extSettings 可选参数，用于设置扩展的ajax的setting参数
 */
function myLandAjaxDataJson(url, dataObj, callBackFun, extSettings) {
    var parObj = {
        "type" : 2,
        "value" : dataObj
    };

    var settings = {};
    if(extSettings) {
        for (var item in extSettings) {
            settings[item] = extSettings[item];
        }
    }
    settings.url = url;
    settings.dataType = "json";

    myLandAjaxBase(settings, parObj, callBackFun);
}

/**
 * Ajax调用后台功能Json方式.
 * example:
 * myLandAjax(
 *     "xxx.do",
 *     { "key" : "value" },
 *     successCallBackFunc,
 *     failCallBackFunc
 * );
 * 
 * @param {String} url 调后台的链接
 * @param {Object} postDataObj 要提交的数据对象
 * @param {Function} successCallBackFunc 调用正常，返回数据正常时的回调函数。
 *        - 在这个回调函数里实现具体的业务逻辑处理。
 *        successCallBackFunc参数列表：
 *        successCallBackFunc(postDataObj, resDataObj):
 *        1) postDataObj {Object} ：请求数据对象
 *        2) resDataObj {Object} : 响应数据中解析出来的数据对象，对应 message字段的数据对象
 * 
 * @param {Function} failCallBackFunc 参数可选。调用非正常，用于设置扩展的ajax的setting参数。
 *        - 在这个回调函数中实现请求失败后的业务逻辑
 *        failCallBackFunc参数列表：
 *        failCallBackFunc(postDataObj, errMsg):
 *        1) postDataObj {Object} ：请求数据对象
 *        2) errMsg {String} : 错误消息内容
 */
function myLandAjax(url, postDataObj, successCallBackFunc, failCallBackFunc) {
    myLandAjaxDataJson(url, postDataObj, function(code, data) {
        console.log("myLandAjax.1. url : ", url);
        console.log("myLandAjax.2. postDataObj : ", postDataObj);
        console.log("myLandAjax.3. code : ", code);
        console.log("myLandAjax.4. responseData : ", data);
        
        if ("00" == code) {
            var jsonData = $.parseJSON(data);
            if (jsonData.flag) {
                var resDataObj = jsonData.message;
                successCallBackFunc(postDataObj, resDataObj);
            } else {
                
                var resMsgObj = jsonData.errorMessage;
                console.log("type of resMsgObj = " + typeof(resMsgObj));
                
                if(typeof(resMsgObj) == "string") {
                    var msg = funcGlobal.getResMsg(resMsgObj);
                    alert(msg);
                    if("用户未登录！" == msg) {
                        console.log("before failCallBackFunc msg : " + msg);
                        // 清除Cookie
                        document.cookie = "hasLogin=0;"
                    }
                    resMsgObj = msg;
                }
                if(failCallBackFunc) {
                    failCallBackFunc(postDataObj, resMsgObj);
                }
            }
        } else {
            alert(data);
            
            if(failCallBackFunc) {
                failCallBackFunc(postDataObj, data);
            }
        }
    });
}

/**
 * Ajax调用后台功能
 * 
 * @param {String} mySettings 设置参数对象
 * @param {Object} dataObject 要提交的数据参数对象。数据格式：{ "type" : [1|2], "value":[String | Object] }
 *        有两种场景:
 *        1) 基于form表单进行的提交，此时该参数形式为 {"type":1, "value":"xxx"}, 1表示走的form表单提交，value对应的是表单的ID
 *        2) 基于数据对象的提交，不通过form表单形式。
 *           此时参数的形式为 {"type":2, "value": object} 其中object是一个数据对象
 * 
 * @param {Function} callBackFun 回调函数(返回) 参数(code,responseText) function
 */
function myLandAjaxBase(mySettings, dataObject, callBackFun) {
    var timeout = 30000;
    
    var submitData = null;
    if(dataObject.type == 1) {
        submitData = $("#" + dataObject.value).serialize();
    } else if(dataObject.type == 2) {
        submitData = dataObject.value;
    } else {
        callBackFun("81", "请求参数有误");
        return;
    }
    
    var settings = {
        // (默认: "GET") 请求方式 ("POST" 或 "GET")。注意：其它 HTTP 请求方法，如 PUT和 DELETE也可以使用，但仅部分浏览器支持。
        type : "POST",
        
        // 请求的头里面加当前为ajax的请求的标识
        headers : {
            "isAJAXRequest" : "yes"
        },
        // (默认: true) 默认设置下，所有请求均为异步请求。
        // 如果需要发送同步请求，请将此选项设置为 false。注意，同步请求将锁住浏览器，用户其它操作必须等待请求完成才可以执行。
        async : false,
        // 设置请求超时时间（毫秒）
        timeout : timeout,
        // (默认: true)dataType为 script 和jsonp时默认为 false。设置为 false 将不缓存此页面。
        cache : false,
        // 请求成功时触发。
        // function (data,statusText,jqXHR) { }
        // 函数说明：传入返回的数据、描述状态的字符串”success”、jqXHR对象
        success : function(ata, statusText, jqXHR) {
            var data = jqXHR.responseText;
            if(typeof (callBackFun) != "undefined" && callBackFun != null) {
                callBackFun("00", data);
            }
        },
        // 请求失败时调用此函数。
        error : function(jqXHR, textStatus, errorThrown) {
            // 获取失败code
            var _status = jqXHR.status;
            var code;
            var message = "";
            if(_status == "404") {
                code = "91";
                message = "请求地址不存在!";
            } else if(_status == "500") {
                code = "92";
                message = "服务器响应出现异常!";
            } else if(_status == "400") {
                code = "93";
                message = "请求非法或Token缺失！";
            } else {
                // 如果没有操作权限的时候，有可能会返回这个结果(鉴别到不受控资源)
                console.error("ajax error, url=[" + settings.url + "] jqXHR.status : " + _status);
                console.error("ajax error, jqXHR.responseText : ", jqXHR.responseText);
                console.error("ajax error, textStatus : ", textStatus);
                console.error("ajax error, errorThrown : ", errorThrown);
                code = "99";
                message = "服务器未知异常!";
                message += "\rurl : " + settings.url;
                message += "\rstatus : " + _status;
                if(errorThrown) {
                    message += "\rerror: " + errorThrown;
                }
            }
            if(typeof (callBackFun) != "undefined" && callBackFun != null) {
                callBackFun(code, message);
            }
        }
    };

    // (默认: 当前页地址) 要请求的目的URL地址
    settings.url = mySettings.url;

    // 预期服务器返回的数据类型。如果不指定，jQuery将自动根据 HTTP 包 MIME 信息来智能判断，
    // 比如 XML MIME 类型就被识别为 XML。随后服务器端返回的数据会根据这个值解析后，传递给回调函数
    // 服务器返回的数据类型 如：json\xml\mime\html
    settings.dataType = mySettings.dataType;

    // (默认: "application/x-www-form-urlencoded")标明发送或者接收的实体的MIME类型。
    // 当“非GET或HEAD请求”的HTTP请求时，会被设置为HTTP头请求信息
    if (mySettings.contentType) {
        settings.contentType = mySettings.contentType;
    } else {
        settings.contentType = "application/x-www-form-urlencoded";
    }

    // 发送到服务器的数据。可以是一个查询字符串，
    // 比如 key1=value1&amp;key2=value2 ，也可以是一个映射，比如 {key1: 'value1', key2: 'value2'}
    // data : $("#" + formId).serialize(),
    settings.data = submitData;

    $.ajax(settings);
}

/**
 * 判断是否为json对象
 * 
 * @param obj: 对象（可以是jq取到对象）
 * @return isjson: 是否是json对象 true/false
 */
function isJson(obj) {
    var isjson = typeof (obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]"
            && !obj.length;
    return isjson;
}

/**
 * 实现全选 与非全选效果区分
 * @param chkAllId 全选按钮Id
 * @param chkName checkBox name
 */
function selectCheckAllOrNotAll(chkAllId, chkName){
	var checkBoxes = document.getElementsByName(chkName);
	checkAll = document.getElementById(chkAllId);
	for(var i=0; i<checkBoxes.length; i++) {
		checkBoxes[i].onclick = function() {
			var b_name = navigator.appName; 
			if (b_name == "Microsoft Internet Explorer") {
				var b_version = navigator.appVersion; 
				var version = b_version.split(";"); 
				var versionNo = version[1].replace(/[ ]/g, "");
				if (versionNo != "MSIE8.0" && versionNo != "MSIE7.0" && versionNo != "MSIE6.0") {
		            var checkedCount = document.querySelectorAll('input[name="'+chkName+'"]:checked').length;
		            checkAll.checked = checkedCount > 0;
		            checkAll.indeterminate = checkedCount > 0 && checkedCount < checkBoxes.length;
				}
			} else {
				var checkedCount = document.querySelectorAll('input[name="'+chkName+'"]:checked').length;
	            checkAll.checked = checkedCount > 0;
	            checkAll.indeterminate = checkedCount > 0 && checkedCount < checkBoxes.length;
			}
   		};
	}
	checkAll.onclick = function() {
        for(var i=0; i<checkBoxes.length; i++) {
        	checkBoxes[i].checked = this.checked;
        }
	};
}

/**
 * 实现全选
 * @param chkAllId 全选按钮Id
 * @param chkName checkBox name
 */
function checkAll(chkAllId, chkName){
    var chkAll = document.getElementById(chkAllId).checked;
	var checkBoxs = document.getElementsByName(chkName);
	var check_flag = true;
	if(!chkAll){
		check_flag = false;
	}
	for(var i=0;i<checkBoxs.length;i++){
		if(checkBoxs[i].disabled == true){ //只要不能用,都不可选中.
			checkBoxs[i].checked = false;
			continue;
		}
	   checkBoxs[i].checked = check_flag;
	}
}

/**
 * 取得选中元素的数组
 * @param chkName
 * @returns {Array}
 */
function selectedCheckBox(chkName) {
	var chk_value = [];
	$('input[name=' + chkName + ']:checked').each(function(){    
   		chk_value.push($(this).val());    
  	});    
	return chk_value;
}

/**
 * 将毫秒转化为日期格式
 */
function format(time, format) {
	var t = new Date(time);
	var tf = function(i) {
		return (i < 10 ? '0' : '') + i
	};
	return format.replace(/yyyy|MM|dd|HH|mm|ss/g, function(a) {
		switch (a) {
		case 'yyyy':
			return tf(t.getFullYear());
			break;
		case 'MM':
			return tf(t.getMonth() + 1);
			break;
		case 'mm':
			return tf(t.getMinutes());
			break;
		case 'dd':
			return tf(t.getDate());
			break;
		case 'HH':
			return tf(t.getHours());
			break;
		case 'ss':
			return tf(t.getSeconds());
			break;
		}
		;
	});
};

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i < ca.length; i++) {
        var c = ca[i].trim();
        if (c.indexOf(name)==0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}

function myLandAjaxCommonCrossDomain(url, dataObject, callBackFun,funName) {
	var timeout = 6000;
	var submitData = null;
	alert("inner1");
    if(dataObject.type == 1) {
        submitData = $("#" + dataObject.value).serialize();
    } else if(dataObject.type == 2) {
    	alert("inner2");
        submitData = dataObject.value;
    } else {
    	alert("inner3");
        callBackFun("81", "请求参数有误");
        return;
    }
	var settings = {
			type:'post',  
			url : url,
			async:false,
			data: submitData,
			dataType : 'jsonp', 
			timeout:timeout,
			jsonp:"callback",
			jsonpCallback:funName,//指定回调方法的方法名
			success:function(json,statusText){
				alert("success:"+json+",statusText="+statusText)
				if(typeof(callBackFun)!="undefined"&&callBackFun!=null){
					callBackFun("00",JSON.stringify(json));
				}
			},
			//请求失败时调用此函数。
			error:function (jqXHR,textStatus,data) { 
				alert("textStatus:"+json+",data="+data)
				//获取失败code
				var _status = jqXHR.status;
				var code ;
				var message = "";
				if(_status=="404"){
					code = "91";
					message = "请求地址不存在!";
				}else if(_status=="500"){
					code = "92";
					message = "服务器响应出现异常!";
				}else if(_status == "200"){
					code = "99";
					message = "程序中出现错误，请管理员查看！";
				}else{
				    // 如果没有操作权限的时候，有可能会返回这个结果(鉴别到不受控资源)
					code = "99";
					message = "服务器未知异常!";
				}
				if(typeof(callBackFun)!="undefined"&&callBackFun!=null){
					callBackFun(code,message);
				}
			}
	};
	$.ajax(settings);
}


/**
 * 自动获取url中参数值的方法
 * @param 要获取的参数名称
 * @return 获取到的参数值
 * */
function UrlSearch() {
    var name, value;
    var str = location.href; //取得整个地址栏
    var num = str.indexOf("?")
    str = str.substr(num + 1); //取得所有参数   stringvar.substr(start [, length ]

    var arr = str.split("&"); //各个参数放到数组里
    for(var i = 0; i < arr.length; i++) {
        num = arr[i].indexOf("=");
        if(num > 0) {
            name = arr[i].substring(0, num);
            value = arr[i].substr(num + 1);
            this[name] = value;
        }
    }
};