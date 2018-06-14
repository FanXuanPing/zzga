/**
 * 河南郑州公安-对应页面：登录页
 */
app.controller("HnzzLoginController", ["$scope", "$state", "$location", "loginService", function($scope, $state, $location, loginService) {
    
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
        
        if(!$scope.idCard) {
            alert("请输入身份证号");
            return;
        }
        
        if(!$scope.pwd) {
            alert("请输入密码");
            return;
        }
        
        /* 
         * 410100 : 河南省郑州市
         * 320500 : 江苏省苏州市
         * 
         * firstFlag：第一次登录的标记，默认为空，点击验证后变为1
         * r:档案编号
         * p:手机号
         * v:接口返回json数据的一个参数（档案号和手机号经MD5加密后值）
         * n:验证次数
         */
        var paramData = {
            "userName" : $scope.idCard,
            "area" : "320500",
            "pwd" : $scope.pwd,
            "params.type" : "zz_h5",
            "params.loginType":'h5',
            "data" : "",
            "firstFlag" : "",
            "r" : "",
            "p" : "",
            "v" : "",
            "n" : 0
        };

        idCard  = $scope.idCard;
        
        loginService.setParamData(paramData);
        
        $scope.isShowMask = true;
        
        myLandAjax(ITFC_ADDR.JP_LOGIN, paramData,
            function(postDataObj, resDataObj) {
                console.log(ITFC_ADDR.JP_LOGIN + " call sucess. postDataObj :", postDataObj);
                console.log(ITFC_ADDR.JP_LOGIN + " call sucess. resDataObj :", resDataObj);
                
                // 已经注册过
                $state.go("h5.cource", {});
                $scope.imgBaseUrl = SERVER_IMG_URL;
                $scope.plan = resDataObj.plan;

                //$state.go("h5.auth", {a:'1',b:'2'});
            },
            function(postDataObj, resDataObj) {
                console.log(ITFC_ADDR.JP_LOGIN + " call fail. postDataObj :", postDataObj);
                console.log(ITFC_ADDR.JP_LOGIN + " call fail. resDataObj :", resDataObj);
                
                // 未注册过的用户
                $scope.isShowMask = false;
                 if(resDataObj.type == 51 || resDataObj.message.type == 51) {
                //if(resDataObj.message.type == 51) {
                    // 学员信息验证
                    postDataObj.v =resDataObj.message.v;
                    postDataObj.n =resDataObj.message.n;
                    loginService.setParamData(postDataObj);
                    $state.go("h5.auth", {});
                } else {
                    // resDataObj.code : 06 : 您已学习完成，请等待审核
                    if(resDataObj.message) {
                        alert(resDataObj.message);
                    }else{
                    	alert(resDataObj.m);
                    }
                }
            }
        );
    };

}]);
