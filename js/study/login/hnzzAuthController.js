/**
 * 河南郑州公安-对应页面：身份验证页
 */
app.controller("HnzzAuthController", ["$scope", "$state", "loginService", function($scope, $state, loginService) {
    
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
        
        if(!$scope.fileNum) {
            alert("请输入驾驶证档案编号");
            return;
        }
        
        if(!$scope.phoneNum) {
            alert("请输入手机号");
            return;
        }
        
        var cacheParam = loginService.getParamData();
        
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
            "userName" : cacheParam.userName,
            "area" : cacheParam.area,
            "pwd" : cacheParam.pwd,
            "params.type" : "1002",
           /*  "params.type" : "",*/
            "params.loginType":'h5',
            "data" : "",
            "firstFlag" : "1",
            "r" : $scope.fileNum,
            "p" : $scope.phoneNum,
            "v" : cacheParam.v,
            "n" : cacheParam.n,
            "opt":'Android'
        };
        
        $scope.isShowMask = true;
        
        myLandAjax(ITFC_ADDR.JP_LOGIN, paramData,
            function(postDataObj, resDataObj) {
                console.log(ITFC_ADDR.JP_LOGIN + " call sucess. postDataObj :", postDataObj);
                console.log(ITFC_ADDR.JP_LOGIN + " call sucess. resDataObj :", resDataObj);
                
                // 已经注册过
                $state.go("h5.cource", {});
                $scope.imgBaseUrl = SERVER_IMG_URL;
                $scope.plan = resDataObj.plan;
            },
            function(postDataObj, resDataObj) {
                console.log(ITFC_ADDR.JP_LOGIN + " call fail. postDataObj :", postDataObj);
                console.log(ITFC_ADDR.JP_LOGIN + " call fail. resDataObj :", resDataObj);
                
                // 未注册过的用户
                $scope.isShowMask = false;
                
                if(resDataObj.code == '09') {
                    // 请选择业务受理地
                    $scope.doInfoConfirm();
                } else {
                    // resDataObj.code : 06 : 您已学习完成，请等待审核
                    if(resDataObj.m) {
                        alert(resDataObj.m);
                    }
                }
            }
        );
    };

}]);
