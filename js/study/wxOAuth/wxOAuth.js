/**
 * 微信公众号主页的js
 * @author 赵洋
 * @create 2017-2-16
 * */
app.controller("wxOAuthController", ["$scope", "$state", "loginService", function($scope, $state, loginService) {

    console.log("wxOAuthController call. init.");
    
    //从微信获取的用户信息
    var user_info_json = {};
   	
   	//提取url中的code参数判断当前是否已经授权
	//授权后URL中带有code参数，未授权没有code参数
	var RequestParm = new UrlSearch(); //实例化
	var code = RequestParm.code;
	var state = RequestParm.state;
	
	if(code == undefined){
		//如果没有code但是有state表示用户禁止授权跳到登录页面
		if(state == undefined){
			//第一步跳转授权页面
			var state = new Date().getTime()+"";
			openWeiXinOAuth(state);
		}else{
			//跳转到登录
			$state.go("h5.typeLogin", {});
		}
	}else{
   	
		//调取后台接口拿取微信用户数据并登录
		var paramData = {};//传参的json对象
    	paramData.code = code;//微信用户授权后返回code
    	myLandAjax(ITFC_ADDR.JPV2_WXOAUTH , paramData, 
	        function(postDataObj, resDataObj) {
	            console.log("这里是成功的回调函数 . postDataObj, resDataObj :", postDataObj, resDataObj);
	            loginService.setIsWxOAuth(1);
	            // 微信授权成功后跳转登录页面
	            $state.go("h5.syLogin",{"title":resDataObj.loginTitle,"type":resDataObj.loginType});
            	
	        }, 
	        function(postDataObj, resErrMsg) {
	            console.log("这里是失败的回调函数 . postDataObj, resErrMsg :", postDataObj, resErrMsg);
   				
	            if (resErrMsg.code == "11") {
					//微信唯一标识openid为空
					mylandAlert("提示信息","微信唯一标识openid为空");
					$state.go("h5.typeLogin", {});
	            } else if (resErrMsg.code == "12") {
	            	//该用户不存在
	            	$state.go("h5.typeLogin", {});
	            } else if (resErrMsg.code == "13") {
	            	//未绑定手机号
	            	$state.go("h5.typeLogin", {});
	            } else {
	            	mylandAlert("提示信息",resErrMsg);
	            }
	        }
	    );
		
	};
	
	/**
     * 跳转微信授权页面
     * @author 赵洋
     * @create 2017-2-15
     * @param state a-zA-Z0-9的参数值，最多128字节，授权完成返回时此参数原样返回
     * */
    function openWeiXinOAuth(state) {
        //拼接跳转的url和参数
        var url = ITFC_ADDR.WEIXIN_CODE_URL + "?appid=" + ITFC_ADDR.WEIXIN_APP_ID + "&redirect_uri=" + encodeURIComponent(ITFC_ADDR.WEIXIN_REDIRECT_URI) + "&response_type=code&scope=snsapi_userinfo&state=" + state + "#wechat_redirect";
        window.location.href = url;
    };
	

}]);
