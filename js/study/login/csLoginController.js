/**
 * 长沙市    对应页面：登录页
 * 请求格式
 *  http://localhost:8081/jpv2H5/index.html#/h5?data=
 * {"idCard":"530128198512153628","drivingLicense":"A1","area":"4202","dept":"","pwd":"123456","type":"1001"}
 * 
 */
app.controller("csLoginController", ["$scope", "$state", "$location", "loginService", function($scope, $state, $location, loginService) {
    
    $scope.isShowMask = false;
    
    /**
     *后退
     */
    $scope.close = function(){
        history.go(-1);
    };
   
    /**
     * 信息确认
     */
    $scope.doInfoConfirm = function() {
    	
        //获得  请求参数
        var paramObj = $location.search();
        console.log("input paramObj : ", paramObj);
	     //参数条件  检验
        /* 
         * 430100 长沙
         * firstFlag：第一次登录的标记，默认为空，点击验证后变为1
         * r:档案编号
         * p:手机号
         * v:接口返回json数据的一个参数（档案号和手机号经MD5加密后值）
         * n:验证次数
         */
        var paramData = {
            "userName" : paramObj.idCard,
            "area" : "4202",
            "pwd" : paramObj.pwd,
            "params.type" : paramObj.type,
            "params.drivingLicense":paramObj.drivingLicense,
            "data" : "",
            "firstFlag" : "",
            "r" : "",
            "p" : "",
            "v" : "",
            "n" : 0
        };
       // loginService.setParamData(paramData);
        
        $scope.isShowMask = true;
        
        myLandAjax(ITFC_ADDR.JP_LOGIN, paramData,
            function(postDataObj, resDataObj) {
                console.log(ITFC_ADDR.JP_LOGIN + " call sucess. postDataObj :", postDataObj);
                console.log(ITFC_ADDR.JP_LOGIN + " call sucess. resDataObj :", resDataObj);
                
                // 已经注册过
                $state.go("h5.cource", {});
                $scope.imgBaseUrl = SERVER_IMG_URL;
                $scope.plan = resDataObj.plan;

                //$state.go("h5.auth", {});
            },
            function(postDataObj, resDataObj) {
                console.log(ITFC_ADDR.JP_LOGIN + " call fail. postDataObj :", postDataObj);
                console.log(ITFC_ADDR.JP_LOGIN + " call fail. resDataObj :", resDataObj);
                
                // 未注册过的用户
                $scope.isShowMask = false;
                
                if(resDataObj.message.type == 51) {
                    // 学员信息验证
                    postDataObj.v = resDataObj.message.v;
                    postDataObj.n = resDataObj.message.n;
                    loginService.setParamData(postDataObj);
                    $state.go("h5.auth", {});
                } else {
                    // resDataObj.code : 06 : 您已学习完成，请等待审核
                    if(resDataObj.message) {
                        alert(resDataObj.message);
                    }
                }
            }
        );
    };
     //进入该页面  自动登陆
    $scope.doInfoConfirm();
 

}]);
