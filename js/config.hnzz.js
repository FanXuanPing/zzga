// config

var app =  
angular.module('app')
  .config(
    [        '$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
    function ($controllerProvider,   $compileProvider,   $filterProvider,   $provide) {
        
        // lazy controller, directive and service
        app.controller = $controllerProvider.register;
        app.directive  = $compileProvider.directive;
        app.filter     = $filterProvider.register;
        app.factory    = $provide.factory;
        app.service    = $provide.service;
        app.constant   = $provide.constant;
        app.value      = $provide.value;
    }
  ])
  .config(['$translateProvider', function($translateProvider){
    // Register a loader for the static files
    // So, the module will search missing translation tables under the specified urls.
    // Those urls are [prefix][langKey][suffix].
    $translateProvider.useStaticFilesLoader({
      prefix: 'l10n/',
      suffix: '.js'
    });
    // Tell the module what language to use by default
    $translateProvider.preferredLanguage('en');
    // Tell the module to store the language in the local storage
    $translateProvider.useLocalStorage();
  }]);

/**
 * 全局函数
 */
var funcGlobal = {
    
    /**
     * getResMsg:
     * @param {String} resMsg 
     */
    "getResMsg" : function(resMsg) {
        if(resMsg == "[NO_AUTHORITY]") {
            return "操作权限不足，请联系管理员";
        }
        if(resMsg == "[NO_LOGIN]") {
            return "未登录系统或已下线，请重新登录";
        }
        if(resMsg == "[OUT_OF_CTRL]") {
            return "鉴别到不受控资源，请联系管理员";
        }
        
        if(null == resMsg || undefined == resMsg || "" == resMsg) {
            resMsg = "服务器异常，请联系管理员";
        }
        return resMsg;
    }
};

var CTX = "";
var ENV = "product";
//登录时存的id号
var idCard = "";

// 服务端的图片访问基本地址
// var SERVER_IMG_URL = "http://192.168.0.2:8106/";
var SERVER_IMG_URL = "http://ha.anjia365.com/";
//返回页面
var BACKURL = "";
// 服务端请求地址
var ITFC_ADDR = {};
var MYLAND_LOCATION_ORIGIN ;
function initContentConfigVariable() {
    var myLandLocation = window.location;
    MYLAND_LOCATION_ORIGIN = myLandLocation.origin;
    console.log("myLandLocation", myLandLocation);
    
    var pathName = myLandLocation.pathname;
    var idx = pathName.lastIndexOf("/");
    var webappName = pathName.substring(0, idx);
    
    CTX = webappName;
    
    // 管理端校验接口访问基础地址
    var CTMS_BASE_URL =MYLAND_LOCATION_ORIGIN +"/ctms2";
    
    // 服务端接口访问基础地址
    var SERVER_BASE_URL = MYLAND_LOCATION_ORIGIN + "/zhzmf";
    
    if(ENV == 'dev') {
        // 开发环境
        ITFC_ADDR.JP_LOGIN = SERVER_BASE_URL + "/json/login/personLogin_Ok.json";     // 用户登录接口 [h5/personLogin.do]
        ITFC_ADDR.JP_HOME_PAGE = SERVER_BASE_URL + "/json/cource/h5_homePage.json";   // 用户课程列表接口 [h5/homePage.do]
        ITFC_ADDR.JP_PLAYER = SERVER_BASE_URL + "/json/cource/h5_player_Ok.json";     // 点击我要学习,验证计划状态 [h5/player.do]
        ITFC_ADDR.JP_FACETYPE = SERVER_BASE_URL + "/json/cource/h5_player_Ok.json";   //获得人脸验证的类别（验证还是注册）[h5/faceType.do]
        ITFC_ADDR.JP_FACEVERIFY = SERVER_BASE_URL + "/json/cource/h5_player_Ok.json"; //验证并保存人脸 [h5/faceVerify.do?imageBase64Str=人脸照片数据]
    	  ITFC_ADDR.JP_FACEPHOTO = SERVER_BASE_URL + "/json/confirm/faceImags.json";    //获取人脸验证图片【/h5/facePhoto.do】
    } else if(ENV == 'product') {
        // 联调环境（生产环境）
        ITFC_ADDR.JP_LOGIN = SERVER_BASE_URL + "/h5/personLogin.do";                // 用户登录接口 [h5/personLogin.do]
        ITFC_ADDR.JP_HOME_PAGE = SERVER_BASE_URL + "/h5/homePage.do";               // 用户课程列表接口 [h5/homePage.do]
        ITFC_ADDR.JP_PLAYER = SERVER_BASE_URL + "/h5/player.do";                    // 点击我要学习,验证计划状态 [h5/player.do]
        ITFC_ADDR.JP_FACETYPE = SERVER_BASE_URL + "/h5/faceType.do";                //获得人脸验证的类别（验证还是注册）[h5/faceType.do]
        ITFC_ADDR.JP_FACEVERIFY = SERVER_BASE_URL + "/h5/faceVerify.do";            //验证并保存人脸 [h5/faceVerify.do?imageBase64Str=人脸照片数据]
        ITFC_ADDR.JP_CHECKPLANNODE = SERVER_BASE_URL + "/h5/checkPlanNode.do";      //获取计划节点接口
        ITFC_ADDR.JP_COURSETREE = SERVER_BASE_URL + "/h5/courseTree.do";            //获得课程树
        ITFC_ADDR.JP_TREEPLAYHANDLE = SERVER_BASE_URL + "/h5/treePlayHandle.do";    //获取播放的视频信息
        
        ITFC_ADDR.JP_FACEPHOTO = SERVER_BASE_URL + "/h5/facePhoto.do";              //获取人脸验证图片【/h5/facePhoto.do】
        ITFC_ADDR.GETWAREID = SERVER_BASE_URL + "/h5/getWareId.do";   //点击数字，获取播放课件的信息
               
        ITFC_ADDR.JP_PLAYEREXAMINFO = SERVER_BASE_URL + "/h5/playerExamInfo.do";		//获取练习题
        ITFC_ADDR.JP_STARTTESTPAPER = SERVER_BASE_URL + "/h5/startTestPaper.do";		//考试节点获得试题
        ITFC_ADDR.JP_SAVETESTPAPER = SERVER_BASE_URL + "/h5/saveTestPaper.do";			//保存考试成绩
        
        ITFC_ADDR.CTMS_REGISTER = CTMS_BASE_URL + "/adminx/wechatRegister.do";		//注册
        
        ITFC_ADDR.SEQUENCEPRACTICE = SERVER_BASE_URL + "/h5/sequencePractice.do";//顺序练习
        ITFC_ADDR.RANDOMPRACTICE = SERVER_BASE_URL + "/h5/randomPractice.do";//随机练习
        ITFC_ADDR.PRACTICETEST = SERVER_BASE_URL + "/h5/practiceTest.do";//模拟考试
        ITFC_ADDR.GETEXAMINFOBYID = SERVER_BASE_URL + "/h5/getExamInfoById.do";//根据id获取试题信息
        
        ITFC_ADDR.EXAM_QUERY = CTMS_BASE_URL + "/apntmtstu/query.do";
        ITFC_ADDR.EXAM_DOCANCELAPNTMT = CTMS_BASE_URL + "/apntmtstu/examPlanApntmt_doCancel.do";
        ITFC_ADDR.EXAM_DOAPNTMT = CTMS_BASE_URL + "/apntmtstu/examPlanApntmt_doApntmt.do";

        // 支付相关信息
        ITFC_ADDR.OPENCOURSE = SERVER_BASE_URL + "/h5/openCourse.do";        //点击我要开通进入订单页面
        ITFC_ADDR.PAYMENT = SERVER_BASE_URL + "/h5/payment.do";              //订单支付
        ITFC_ADDR.ORDERQUERY = SERVER_BASE_URL + "/h5/orderquery.do";        //订单支付状态验证（回调页面调用此接口，修改personPlan信息）
    
        ITFC_ADDR.FACECARDDETECTED = SERVER_BASE_URL + "/h5/faceCardDetected.do";//提交身份证正反面信息
        ITFC_ADDR.RegisterToCMTS="http://192.168.0.6:8105/ctms2/adminx/register.do";
        
        ITFC_ADDR.REGISTERURL=SERVER_BASE_URL + "/h5/register.do";;
        ITFC_ADDR.UPDATEPERSONADDRESS=SERVER_BASE_URL + "/h5/updatePersonAddress.do";
        
        ITFC_ADDR.UPDATESHOWDECLARE=SERVER_BASE_URL + "/h5/updateShowDeclare.do";
        ITFC_ADDR.QUERYDECLAREINFO=SERVER_BASE_URL + "/h5/queryDeclareInfo.do";
        
        //微信相关静态变量
        ITFC_ADDR.WEIXIN_APP_ID = "wx42093cc5e2b3bd86";                                             //微信公众号appid
        ITFC_ADDR.WEIXIN_REDIRECT_URI = "http://www.anjia365.com/zzjpv2H5/hnzz.html#/h5/wxOAuth";   //微信网页授权后返回的url,需在微信公众号里注册
        ITFC_ADDR.WEIXIN_CODE_URL = "https://open.weixin.qq.com/connect/oauth2/authorize";          //微信跳转授权页面的url
        ITFC_ADDR.JPV2_WXOAUTH = SERVER_BASE_URL + "/h5/wxAction!wxOauth.do";                       //后台微信授权接口
        ITFC_ADDR.JPV2_CHECKOPENID = SERVER_BASE_URL + "/h5/wxAction!checkOpenId.do";               //后台检查是否已经通过微信授权接口
        
    }
}

initContentConfigVariable();
