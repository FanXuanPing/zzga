/**
 * 在线学习登录Controller。登录成功后才有可能进入到课程页面
 * /h5/personLogin.do?userName=530128198512153628&area=320500&pwd=123456&params.type=1002
 * "area":"320500" : 苏州市
 * http://localhost:8081/jpv2H5/index.html#/h5?data={"idCard":"530128198512153628","drivingLicense":"A1","area":"320500","pwd":"123456"}
 */
app.config(['$locationProvider', function($locationProvider) {  
  $locationProvider.html5Mode(true);
}]);
app.controller("LoginController", ["$scope", "$state", "$location", "$cookieStore", "loginService", function($scope, $state, $location, $cookieStore, loginService) {
    
    var cookieHasLogin = getCookie("hasLogin");
    console.log("cookieHasLogin ： " + cookieHasLogin);
    
    var paramObj = $location.search();
    console.log("input paramObj : ", paramObj);
    
    var cachedParamJsonData = loginService.getParamData();
    console.log("cachedParamJsonData :", cachedParamJsonData);
    
    var localPath = $location.path();
    
    if("/h5" == localPath) {
        console.log("localPath : /h5");
        
        if("1" == cookieHasLogin) {
            if (!paramObj || !paramObj.data) {
                $state.go("h5.cource", {});
                return;
            }
        }
    } else {
        if("1" == cookieHasLogin) {
            $state.go("h5.cource", {});
            return;
        }
    }
    
    document.cookie = "hasLogin=0;"
    
    if (!paramObj || !paramObj.data) {
        alert("未传递参数");
        return;
    }
    
    var paramJsonData = null;
    try {
        paramJsonData = $.parseJSON(paramObj.data);
        console.log("input paramJsonData :", paramJsonData);
        
        loginService.setParamData(paramJsonData);
    } catch(e) {
        alert("参数格式错误");
        return;
    }
    
    // 请求参数校验
    if(!paramJsonData.idCard) {
        alert("缺少证件号码参数");
        return;
    }
    
    // drivingLicense : 不包含A1，B1，A2，B2的，提示：“您的驾驶证不需要审验，如有疑问，请至业务受理地咨询”，不显示开始学习按钮
    var drivingLicense = paramJsonData.drivingLicense;
    if(!drivingLicense) {
        alert("缺少准驾车型参数");
        return;
    }
    
    drivingLicense = drivingLicense.toUpperCase();
    if(drivingLicense.indexOf("A1") < 0
        && drivingLicense.indexOf("B1") < 0
        && drivingLicense.indexOf("A2") < 0
        && drivingLicense.indexOf("B2") < 0) {
        alert("您的驾驶证不需要审验，如有疑问，请至业务受理地咨询");
        return;
    }
    
    /*
     * drivingLicense包含A1，B1，A2，B2的，进入points判断:
     * points：
     * 1) 0分，提示：“您的驾驶证累计记分为0，无需参加审验学习”，不显示开始学习按钮
     * 2) 1-8分，正常
     * 3) 9-11人，提示：“您的驾驶证累计记分xxx，请到业务受理地参加现场学习”，不显示开始学习按钮
     * 4) 12分以上，提示：“您的驾驶证累计记分xxx，请到业务受理地办理满分学习业务申请”，不显示开始学习按钮
     */
    var paramPoints = paramJsonData.points;
    var points = parseInt(paramPoints);
    console.log("input param : points : " + points);
    
    if(isNaN(points)) {
        alert("缺少累计扣分参数或参数格式有误");
        return;
    }
    
    if(0 == points) {
        alert("您的驾驶证累计记分为0，无需参加审验学习");
        return;
    }
    if((points >= 9) && (points <= 11)) {
        alert("您的驾驶证累计记分" + points + "，请到业务受理地参加现场学习");
        return;
    }
    if(points >= 12) {
        alert("您的驾驶证累计记分" + points + "，请到业务受理地办理满分学习业务申请");
        return;
    }
    
    if(points < 0) {
        alert("累计扣分参数范围错误");
        return;
    }
    
    // City:苏州的，继续。  苏州以外的，判断分数、准驾车型，提示“请到业务受理地参加现场学习”
    var city = paramJsonData.city;
    if("320500" != city) {
        alert("请到业务受理地参加现场学习");
        return;
    }
    
    /**
     * 回调函数：调用登录接口正常返回情况下的回调函数
     * 
     * @param {Object} postDataObj 请求参数对象
     * @param {Object} resDataObj 响应数据对象
     */
    var myLandJpCallBackFunc = function(jpPostDataObj, jpResDataObj) {
        console.log(ITFC_ADDR.JP_LOGIN + ", jpResDataObj", jpResDataObj);
        loginService.setUserInfo(jpResDataObj);
        
        //$cookieStore.put("hasLogin", "1", {"domain" : MYLAND_LOCATION_ORIGIN});
        document.cookie = "hasLogin=1;"
        
        $state.go("h5.cource", {});
    };
    
    /**
     * 回调函数：调用管理端接口正常情况下的回调函数
     * 
     * @param {Object} postDataObj 请求参数对象
     * @param {Object} resDataObj 响应数据对象
     */
    var myLandCtmsCallBackFunc = function(postDataObj, resDataObj) {
        
        // 管理端正常返回后，开始调用学习端的登录服务
        // h5/personLogin.do?userName=341222198407082453&area=4001&pwd=123456&params.type=1001
        //alert( paramJsonData.city);
        var paramJpData = {
            "userName" : paramJsonData.idCard,
            "area" : paramJsonData.city,
            "pwd" : "123456",
            "params.type" : "1001"
        };
        myLandAjax(ITFC_ADDR.JP_LOGIN, paramJpData, myLandJpCallBackFunc);
    };
    
    myLandCtmsCallBackFunc({}, {});
    
}]);
