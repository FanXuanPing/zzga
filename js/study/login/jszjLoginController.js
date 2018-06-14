/**
 * 江苏公安-对应页面：江苏镇江登录页
 * 
 * 
http://ip:port/jpv2H5/index.html#/h5/jszjLogin?l=341222198407082453&t=1001/1002&r=0.234566422311&s=FCF551BC591BF1B9ECA72045F9EC7AFD
l：身份证号
t：学习类别
r；随机数
s：Md5加密，加密规则：Md5(l+t+r+"E057F20F883E")


http://ip:port/jpv2/h5/personLogin.do?userName=341222198407082453&area=321100&pwd=123456&params.type=1001/1002&params.r=0.234566422311&params.s=FCF551BC591BF1B9ECA72045F9EC7AFD

解析跳转的url传参将解析出的参数发往jpv2后台
 */
app.controller("jszjLoginController", ["$scope", "$state", "$location", "loginService", function($scope, $state, $location, loginService) {
    
    $scope.isShowMask = true;
    
    /**
     *后退
     */
    $scope.close = function(){
        history.go(-1);
    };
    
    //执行登录的函数
    login();
    
    /**
     * 江苏镇江登录参数
     */
    function login() {
        
        //提取url中的参数
        var RequestParm = new UrlSearch(); //实例化
        var userName = RequestParm.l;//身份证号
        var type = RequestParm.t;//学习类别
        var r = RequestParm.r;//随机数
        var s = RequestParm.s;//Md5加密
        
        //对传入参数进行非空验证
        if (userName == null) {
        	alert("未传递身份证号！");
        	$scope.close();
        }
        if (type == null) {
        	alert("未传递学习类别！");
        	$scope.close();
        }
        if (r == null) {
        	alert("未传递效验码！");
        	$scope.close();
        }
        if (s == null) {
        	alert("未传递Md5校检码！");
        	$scope.close();
        }
        
        /* 
         * 410100 : 河南省郑州市
         * 320500 : 江苏省苏州市
         * 321100 : 江苏省镇江市
         * 
         * firstFlag：第一次登录的标记，默认为空，点击验证后变为1
         * l：身份证号
		 * t：学习类别
		 * r；随机数
		 * s：Md5加密，加密规则：Md5(l+t+r+"E057F20F883E")
         */
        
        var paramData = {
            "userName" : userName,
            "area" : "321100",
            "pwd" : "123456",
            "params.type" : type,
            "params.r" : r,
            "params.s" : s
        };

        idCard = userName;
        
        loginService.setParamData(paramData);
        
        myLandAjax(ITFC_ADDR.JP_LOGIN, paramData,
            function(postDataObj, resDataObj) {
                console.log(ITFC_ADDR.JP_LOGIN + " call sucess. postDataObj :", postDataObj);
                console.log(ITFC_ADDR.JP_LOGIN + " call sucess. resDataObj :", resDataObj);
                
                // 已经注册过
                $state.go("h5.cource", {});

            },
            function(postDataObj, resDataObj) {
                console.log(ITFC_ADDR.JP_LOGIN + " call fail. postDataObj :", postDataObj);
                console.log(ITFC_ADDR.JP_LOGIN + " call fail. resDataObj :", resDataObj);
                
                // 未注册过的用户
                alert(resDataObj);
                $scope.close();
            }
        );
    };
    
    /**
	 * 自动获取参数值的方法
	 * @param 要获取的参数名称
	 * @return 获取到的参数值
	 * */
	function UrlSearch() 
	{
	   var name,value; 
	   var str=location.href; //取得整个地址栏
	   var num=str.indexOf("?") 
	   str=str.substr(num+1); //取得所有参数   stringvar.substr(start [, length ]
	
	   var arr=str.split("&"); //各个参数放到数组里
	   for(var i=0;i < arr.length;i++){ 
	    num=arr[i].indexOf("="); 
	    if(num>0){ 
	     name=arr[i].substring(0,num);
	     value=arr[i].substr(num+1);
	     this[name]=value;
	     } 
	    } 
	};

}]);
