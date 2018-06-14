/**
 * 对应页面：首页
 */
app.controller("CourceIndexController", ["$scope", "$state","$location", function($scope, $state ,$location) {
    
    $scope.points = '0';
    
    var paramObj = $location.search();
    console.log("input paramObj : ", paramObj);

    $scope.isShowMask = false;

    if (!paramObj || !paramObj.data) {
        alert("未传递参数");
        return;
    }

    var paramJsonData = null;
    try {
        paramJsonData = $.parseJSON(paramObj.data);
        console.log("input paramJsonData :", paramJsonData);

       // loginService.setParamData(paramJsonData);
    } catch(e) {
        alert("参数格式错误");
        return;
    }
    
    $scope.idCard = "" || paramJsonData.idCard;//身份证号
    $scope.realName = "" || paramJsonData.realName; //姓名
    $scope.cardType = "" || paramJsonData.cardType; //证件类型
    //$scope.points = "" || paramJsonData.points; //累计扣分
    $scope.city = "" || paramJsonData.city; //城市
    $scope.drivingLicense = "" || paramJsonData.drivingLicense; //准驾车形
    $scope.phone = "" || paramJsonData.phone; //手机
    $scope.fileNum = "" || paramJsonData.fileNum; //档案编号
    $scope.checkDate = "" || paramJsonData.checkDate; //审验有效期
    $scope.lllegalRecord = "" || paramJsonData.lllegalRecord; //违法记录
    $scope.message = ""; //说明

    // 请求参数校验
    if(!paramJsonData.cardType) {
        alert("缺少证件类型参数");
        return;
    }
    
    if(!paramJsonData.idCard) {
        alert("缺少证件号码参数");
        return;
    }

    //  // drivingLicense : 不包含A1，B1，A2，B2，A3的，提示：“您的驾驶证不需要审验，如有疑问，请至业务受理地咨询”，不显示开始学习按钮
    var drivingLicense = paramJsonData.drivingLicense;
    if(!drivingLicense) {
        alert("缺少准驾车型参数");
        return;
    }
    
    drivingLicense = drivingLicense.toUpperCase();
    if(drivingLicense.indexOf("A1") < 0
        && drivingLicense.indexOf("B1") < 0
        && drivingLicense.indexOf("A2") < 0
        && drivingLicense.indexOf("B2") < 0
        && drivingLicense.indexOf("A3") < 0) {
        alert("您的驾驶证不需要审验，如有疑问，请至业务受理地咨询");
        return;
    }
    
    // City:苏州的，继续。  苏州以外的，判断分数、准驾车型，提示“请到业务受理地参加现场学习”
    var city = paramJsonData.city;
    if("320500" != city) {
        alert("请到业务受理地参加现场学习");
        return;
    }
    
    // checkDate : 审验有效期. 审验有效期不到不允许学习
    var checkDate = paramJsonData.checkDate;
    if(!checkDate) {
        alert("缺少审验有效期参数");
        return;
    }
    
    var checkDateParse = new Date(checkDate);
    if(isNaN(checkDateParse.getTime())) {
        alert("审验有效期格式有误，正确格式应为yyyy-MM-dd");
        return;
    }
    
    checkDateParse.setHours(0);
    checkDateParse.setMinutes(0);
    checkDateParse.setSeconds(0);
    checkDateParse.setMilliseconds(0);
    
    var currDate = new Date();
    currDate.setHours(0);
    currDate.setMinutes(0);
    currDate.setSeconds(0);
    currDate.setMilliseconds(0);
    
    if(currDate.getTime() < checkDateParse.getTime()) {
        alert("审验有效期未到期，无法进行学习");
        return;
    }

    BACKURL = paramJsonData.backurl || "http://police.luopan88.com:8099/v001/zscg/index.html";

    $scope.paramJsonData = paramJsonData;
    
    /*
     * drivingLicense包含A1，B1，A2，B2，A3的，进入points判断:
     * points：
     * 1) 0分，提示：“您的驾驶证累计记分为0，无需参加审验学习”，不显示开始学习按钮
     * 2) 1-8分，正常
     * 3) 9-11人，提示：“您的驾驶证累计记分xxx，请到业务受理地参加现场学习”，不显示开始学习按钮
     * 4) 12分以上，提示：“您的驾驶证累计记分xxx，请到业务受理地办理满分学习业务申请”，不显示开始学习按钮
     */
    $scope.checkPoints = function() {
        
        var pointsFormVal = $scope.points;
        var points = parseInt(pointsFormVal);
        
        console.log("form param : points : " + points);
        
        if(isNaN(points)) {
            alert("累计扣分值格式有误");
            return false;
        }
        
        if(0 == points) {
            alert("您的驾驶证累计记分为0，无需参加审验学习");
            return false;
        }
        if((points >= 9) && (points <= 11)) {
            alert("您的驾驶证累计记分" + points + "，请到业务受理地参加现场学习");
            return false;
        }
        if(points >= 12) {
            alert("您的驾驶证累计记分" + points + "，请到业务受理地办理满分学习业务申请");
            return false;
        }
        
        return true;
    };
    
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
        
        if(!$scope.checkPoints()) {
            return;
        }
        
        if(!$scope.areaCode) {
            alert("请选择业务受理地");
            return;
        }
        
        $scope.paramJsonData.points = $scope.points;
        $scope.paramJsonData.areaCode = $scope.areaCode;
        
        console.log("$socpe.paramJsonData=", $scope.paramJsonData);
        
        var paramData = {
            "userName" : paramJsonData.idCard,
            "area" : paramJsonData.city,
            "pwd" : "123456",
            "params.type" : "1001",
            "data" : JSON.stringify($scope.paramJsonData)
        };
        
        $scope.isShowMask = true;
        
        myLandAjax(ITFC_ADDR.JP_LOGIN, paramData,
            function(postDataObj, resDataObj) {
                console.log(ITFC_ADDR.JP_LOGIN + " call sucess. postDataObj, resDataObj :", postDataObj, resDataObj);
                // 已经注册过
                $state.go("h5.cource", {});
                $scope.imgBaseUrl = SERVER_IMG_URL;
                $scope.plan = resDataObj.plan;
            },
            function(postDataObj, resDataObj){
                // 未注册过的用户
                $scope.isShowMask = false;
                
                if(resDataObj.code == '09') {
                    // 请选择业务受理地
                    //if(!firstFlag) {
                    //    alert(resDataObj.message);
                    //}
                    $scope.doInfoConfirm();
                } else {
                    // resDataObj.code : 06 : 您已学习完成，请等待审核
                    if(resDataObj.message) {
                        alert(resDataObj.message);
                    }
                }
                
                //$scope.firstInit = false;
            }
        );
    };
    
    /**
     * 提交
     * @deprecated 这个方法暂时不用。业务逻辑变更了
     */
    $scope.postData = function(firstFlag) {
        
        if(!$scope.areaCode) {
            $scope.areaCode = "";
        }
        
        console.log("$socpe.paramJsonData=", $scope.paramJsonData);
        
        if(firstFlag) {
            $scope.paramJsonData.areaCode = "";
        } else {
            $scope.paramJsonData.areaCode = $scope.areaCode;
        }
        
        var paramData = {
            "userName" : paramJsonData.idCard,
            "area" : paramJsonData.city,
            "pwd" : "123456",
            "params.type" : "1001",
            "data" : JSON.stringify($scope.paramJsonData)
        };
        
        $scope.isShowMask = true;
        
        myLandAjax(ITFC_ADDR.JP_LOGIN, paramData,
            function(postDataObj, resDataObj) {
                //已经注册过
                $state.go("h5.cource", {});
                console.log("这里是成功的回调函数 . postDataObj, resDataObj :", postDataObj, resDataObj);
                $scope.imgBaseUrl = SERVER_IMG_URL;
                $scope.plan = resDataObj.plan;
            },
            function(postDataObj, resDataObj){
                //未注册过的用户
                $scope.isShowMask = false;
                
                if(resDataObj.code == '09') {
                    // 请选择业务受理地
                    if(!firstFlag) {
                        alert(resDataObj.message);
                    }
                } else if(resDataObj.code == "0") {
                    if(resDataObj.message) {
                        alert(resDataObj.message);
                    }
                }
                
                $scope.firstInit = false;
            }
        );
    };
    
    /**
     *
     * 页面渲染
     */
    $scope.init =  function (){
        // 显示公告
        $("#modalNoticeDiv").modal("show");
    };
    $scope.init();

}]);
