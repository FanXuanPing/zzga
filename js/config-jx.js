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

// 服务端的图片访问基本地址
// var SERVER_IMG_URL = "http://192.168.0.2:8106/";
//var SERVER_IMG_URL = "http://192.168.0.4:8082";
var SERVER_IMG_URL = "http://ha.anjia365.com";
//返回页面
var BACKURL = "http://police.luopan88.com:8099/v001/zscg/index.html";
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
    var CTMS_BASE_URL = MYLAND_LOCATION_ORIGIN + "/ctms2";
    
    // 服务端接口访问基础地址
    var SERVER_BASE_URL = MYLAND_LOCATION_ORIGIN + "/zhzmf";
    ITFC_ADDR.EXAM_QUERY = CTMS_BASE_URL+ "/apntmtstu/query.do"; //预约
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
           
         ITFC_ADDR.GETSURVERY = SERVER_BASE_URL + "/h5/getSurvery.do"; //获取所有调查问卷
		 ITFC_ADDR.SUBMITSURVERY = SERVER_BASE_URL + "/h5/submitSurvery.do"; //获取所有调查问卷
	
        ITFC_ADDR.JP_PLAYEREXAMINFO = SERVER_BASE_URL + "/h5/playerExamInfo.do";		//获取练习题
        ITFC_ADDR.JP_STARTTESTPAPER = SERVER_BASE_URL + "/h5/startTestPaper.do";		//考试节点获得试题
        ITFC_ADDR.JP_SAVETESTPAPER = SERVER_BASE_URL + "/h5/saveTestPaper.do";			//保存考试成绩
        
        ITFC_ADDR.CTMS_REGISTER = CTMS_BASE_URL + "/adminx/wechatRegister.do";		//注册
        ITFC_ADDR.EXAM_QUERY = CTMS_BASE_URL+ "/apntmtstu/query.do"; //预约
        
        ITFC_ADDR.SEQUENCEPRACTICE = SERVER_BASE_URL + "/h5/sequencePractice.do";//顺序练习
        ITFC_ADDR.RANDOMPRACTICE = SERVER_BASE_URL + "/h5/randomPractice.do";//随机练习
        ITFC_ADDR.PRACTICETEST = SERVER_BASE_URL + "/h5/practiceTest.do";//模拟考试
        ITFC_ADDR.GETEXAMINFOBYID = SERVER_BASE_URL + "/h5/getExamInfoById.do";//根据id获取试题信息
    }
}

initContentConfigVariable();
