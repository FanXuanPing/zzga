'use strict';

/**
 * Config for the router - 河南 - 郑州公安
 */
angular.module('app')
    .run(
        ['$rootScope', '$state', '$stateParams',
            function($rootScope, $state, $stateParams) {
                $rootScope.$state = $state;
                $rootScope.$stateParams = $stateParams;
            }
        ]
    )
    .config(
        ['$stateProvider', '$urlRouterProvider',
            function($stateProvider, $urlRouterProvider) {

                var first = "/h5/typeLogin";
                $urlRouterProvider.otherwise(first);

                // -1) 手机端页面
                $stateProvider
                    .state('h5', {
                    url: '/h5',
                    template: '<div ui-view class="fade-in-right-big smooth" ></div>'
                })
                
                // 0. 登录审验首页 [http://ip:port/jpv2H2/hnzz.html#/h5/login]
                .state("h5.login", {
                    url: "/login",
                    templateUrl: "tpl/study/login/hnzzLogin.html",
                    resolve: {
                        deps: ["uiLoad", "$ocLazyLoad",
                            function(uiLoad, $ocLazyLoad) {
                                var loadedJsModule = [
                                    "css/public.css",
                                    "js/study/login/loginService.js",
                                    "js/study/login/hnzzLoginController.js"
                                ];
                                return $ocLazyLoad.load(loadedJsModule);
                            }
                        ]
                    }
                })
                
                // 身份验证
                .state("h5.auth", {
                    url: "/auth",
                    templateUrl: "tpl/study/login/hnzzAuth.html",
                    resolve: {
                        deps: ["uiLoad", "$ocLazyLoad",
                            function(uiLoad, $ocLazyLoad) {
                                var loadedJsModule = [
                                    "js/study/login/loginService.js",
                                    "js/study/login/hnzzAuthController.js"
                                ];
                                return $ocLazyLoad.load(loadedJsModule);
                            }
                        ]
                    }
                })
                
                // 1. 课程  [http://ip:port/jpv2H2/index.html#/h5/cource]
                .state("h5.cource", {
                    url: "/cource",
                    templateUrl: "tpl/study/cource/cource.html?r=" + Math.random(),
                    resolve: {
                        deps: ["uiLoad", "$ocLazyLoad",
                            function(uiLoad, $ocLazyLoad) {
                                var loadedJsModule = [
                                    "css/public.css",
                                    "js/study/cource/courceController.js",
                                    "js/study/confirmOrder/orderService.js"
                                ];
                                return $ocLazyLoad.load(loadedJsModule);
                            }
                        ]
                    }
                })

                // 2. 学习 [http://ip:port/jpv2H2/index.html#/h5/study]
                .state("h5.study", {
                    url: "/study",
                    templateUrl: "tpl/study/study/study.html?r=" + Math.random(),
                    resolve: {
                        deps: ["uiLoad", "$ocLazyLoad",
                            function(uiLoad, $ocLazyLoad) {
                                var loadedJsModule = [
                                    "css/public.css",
                                    "http://static.polyv.net/file/polyvplayer_v2.0.min.js",
                                    "js/study/study/studyController.js",
                                    "js/study/test/courceTestService.js"
                                ];
                                return $ocLazyLoad.load(loadedJsModule);
                            }
                        ]
                    }
                })

                // 3. 习题练习 [http://ip:port/jpv2H2/index.html#/h5/test]
                .state("h5.test", {
                    url: "/test",
                    templateUrl: "tpl/study/test/courceTest.html?r=" + Math.random(),
                    resolve: {
                        deps: ["uiLoad", "$ocLazyLoad",
                            function(uiLoad, $ocLazyLoad) {
                                var loadedJsModule = [
                                    "css/public.css",
                                    "js/study/test/courceTestController.js",
                                    "js/study/test/courceTestService.js"
                                ];
                                return $ocLazyLoad.load(loadedJsModule);
                            }
                        ]
                    }
                })

                // 4. 订单确认推送学时 [http://ip:port/jpv2H2/index.html#/h5/confirm]
                .state("h5.confirm", {
                    url: "/confirm",
                    templateUrl: "tpl/study/confirm/confirm.html?r=" + Math.random(),
                    resolve: {
                        deps: ["uiLoad", "$ocLazyLoad",
                            function(uiLoad, $ocLazyLoad) {
                                var loadedJsModule = [
                                    "css/public.css",
                                    "js/study/confirm/confirmController.js"
                                ];
                                return $ocLazyLoad.load(loadedJsModule);
                            }
                        ]
                    }
                })
                // 5. 人脸识别 [http://ip:port/jpv2H2/index.html#/h5/photograph]
                    .state("h5.photograph", {
                        url: "/photograph",
                        templateUrl: "tpl/study/photograph/photograph.html?r=" + Math.random(),
                        resolve: {
                            deps: ["uiLoad", "$ocLazyLoad",
                                function(uiLoad, $ocLazyLoad) {
                                    var loadedJsModule = [
                                        "css/public.css",
                                        "js/study/photograph/photographController.js"
                                    ];
                                    return $ocLazyLoad.load(loadedJsModule);
                                }
                            ]
                        }
                    })
                    // 5. 人脸识别IOS版 [http://ip:port/jpv2H2/index.html#/h5/photographios]
                    .state("h5.photographios", {
                        url: "/photographios:next",
                        templateUrl: "tpl/study/photograph/photogaraphIOS.html?r=" + Math.random(),
                        resolve: {
                            deps: ["uiLoad", "$ocLazyLoad",
                                function(uiLoad, $ocLazyLoad) {
                                    var loadedJsModule = [
                                        "css/public.css",
                                        "js/study/photograph/photographController.js"
                                    ];
                                    return $ocLazyLoad.load(loadedJsModule);
                                }
                            ]
                        }
                    })
                    // 6. 推送成功 [http://ip:port/jpv2H2/index.html#/h5/confirmsucess]
                    .state("h5.confirmsucess", {
                        url: "/confirmsucess",
                        templateUrl: "tpl/study/confirm/confirmSucess.html?r=" + Math.random(),
                        resolve: {
                            deps: ["uiLoad", "$ocLazyLoad",
                                function(uiLoad, $ocLazyLoad) {
                                    var loadedJsModule = [
                                        "css/public.css",
                                        "js/common/rems.js",
                                        "js/study/confirm/confimSuccess.js"
                                    ];
                                    return $ocLazyLoad.load(loadedJsModule);
                                }
                            ]
                        }
                    })
                    
                    // 8. 模拟考试页 [http://ip:port/jpv2H2/index.html#/h5/exam]
                    .state("h5.exam", {
                        url: "/exam/:score/:count/:testPaperId/:pageType",
                        //url: "/exam/:pageType",
                        templateUrl: "tpl/study/exam/exam.html",
                        resolve: {
                            deps: ["uiLoad", "$ocLazyLoad",
                                function(uiLoad, $ocLazyLoad) {
                                    var loadedJsModule = [
                                        "css/public.css",
                                        "js/study/exam/examController.js",
                                        "js/study/exam/examService.js"
                                    ];
                                    return $ocLazyLoad.load(loadedJsModule);
                                }
                            ]
                        }
                    })
                    // 9. 模拟考试结果页 [http://ip:port/jpv2H2/index.html#/h5/examResult]
                    .state("h5.examResult", {
                        url: "/examResult",
                        templateUrl: "tpl/study/exam/examResult.html",
                        resolve: {
                            deps: ["uiLoad", "$ocLazyLoad",
                                function(uiLoad, $ocLazyLoad) {
                                    var loadedJsModule = [
                                        "css/public.css",
                                        "js/study/exam/examResultController.js",
                                        "js/study/exam/examService.js"
                                    ];
                                    return $ocLazyLoad.load(loadedJsModule);
                                }
                            ]
                        }
                    })
                    // 10. 模拟考试选择页 [http://ip:port/jpv2H2/index.html#/h5/modelTestChoose]
                    .state("h5.modelTestChoose", {
                        url: "/modelTestChoose",
                        templateUrl: "tpl/study/modelTest/modelTestChoose.html",
                        resolve: {
                            deps: ["uiLoad", "$ocLazyLoad",
                                function(uiLoad, $ocLazyLoad) {
                                    var loadedJsModule = [
                                        "css/public.css",
                                        "js/study/modelTest/modelTestChooseController.js",
                                        "js/study/modelTest/modelTestService.js"
                                    ];
                                    return $ocLazyLoad.load(loadedJsModule);
                                }
                            ]
                        }
                    })
                    //examPlanCalendarController
                    // 11.  [http://ip:port/jpv2H2/index.html#/h5/examPlanCalendar]
                    .state("h5.examPlan", {
                        url: "/examPlan",
                        templateUrl: "tpl/apntmtstu/plan/examPlanCalendar.html",
                        resolve: {
                            deps: ["uiLoad", "$ocLazyLoad",
                                function(uiLoad, $ocLazyLoad) {
                                    var loadedJsModule = [
                                        "css/public.css",
                                        "css/calendar.css",
                                        "js/study/plan/examPlanCalendarController.js",
                                        "js/common/calender_new.js"
                                    ];
                                    return $ocLazyLoad.load(loadedJsModule);
                                }
                            ]
                        }
                    })
                    // 12. 模拟考试操作页_非登录 [http://ip:port/jpv2H2/index.html#/h5/modelTest]
                    .state("h5.modelTest", {
                        url: "/modelTest",
                        templateUrl: "tpl/study/modelTest/modelTest.html",
                        resolve: {
                            deps: ["uiLoad", "$ocLazyLoad",
                                function(uiLoad, $ocLazyLoad) {
                                    var loadedJsModule = [
                                        "css/public.css",
                                        "js/study/modelTest/modelTestController.js",
                                        "js/study/modelTest/modelTestService.js"
                                    ];
                                    return $ocLazyLoad.load(loadedJsModule);
                                }
                            ]
                        }
                    })
                    // 13. 模拟考试结果页_非登录 [http://ip:port/jpv2H2/index.html#/h5/modelTestResult]
                    .state("h5.modelTestResult", {
                        url: "/modelTestResult",
                        templateUrl: "tpl/study/modelTest/modelTestResult.html",
                        resolve: {
                            deps: ["uiLoad", "$ocLazyLoad",
                                function(uiLoad, $ocLazyLoad) {
                                    var loadedJsModule = [
                                        "css/public.css",
                                        "js/study/modelTest/modelTestResultController.js",
                                        "js/study/modelTest/modelTestService.js"
                                    ];
                                    return $ocLazyLoad.load(loadedJsModule);
                                }
                            ]
                        }
                    })
                    .state("h5.photo", {
                        url: "/photo",
                        templateUrl: "tpl/study/demo/photo.html",
                        resolve: {
                            deps: ["uiLoad", "$ocLazyLoad",
                                function(uiLoad, $ocLazyLoad) {
                                    var loadedJsModule = [
                                        "css/public.css",
                                        "js/study/demo/photoController.js"
                                      /*  "vendor/angular/angular-cordova/cordova.js"*/
                                    ];
                                    return $ocLazyLoad.load(loadedJsModule);
                                }
                            ]
                        }
                    })
                    
                    // 14订单确定页面[http://ip:port/jpv2H5wyh/index.html#/h5/confirmOrder]
                    .state("h5.confirmOrder", {
                        url: "/confirmOrder",
                        templateUrl: "tpl/study/confirmOrder/confirmOrder.html",
                        resolve: {
                            deps: ["uiLoad", "$ocLazyLoad",
                                function(uiLoad, $ocLazyLoad) {
                                    var loadedJsModule = [
                                        "js/fw/jquery/swiper.jquery.min.js",
                                        "js/study/confirmOrder/confirmOrder.js",
                                        "js/study/confirmOrder/orderService.js"
                                    ];
                                    return $ocLazyLoad.load(loadedJsModule);
                                }
                            ]
                        }
                    })
                    // 15支付成功界面[http://ip:port/jpv2H5wyh/index.html#/h5/paySuccess]
                    .state("h5.paySuccess", {
                        url: "/paySuccess",
                        templateUrl: "tpl/study/confirmOrder/paySuccess.html",
                        resolve: {
                            deps: ["uiLoad", "$ocLazyLoad",
                                function(uiLoad, $ocLazyLoad) {
                                    var loadedJsModule = [
                                        "js/study/confirmOrder/paySuccess.js"
                                    ];
                                    return $ocLazyLoad.load(loadedJsModule);
                                }
                            ]
                        }
                    })
                    // 16支付宝支付回跳界面[http://ip:port/jpv2H5wyh/index.html#/h5/aliPayReturn]
                    .state("h5.aliPayReturn", {
                        url: "/aliPayReturn",
                        templateUrl: "tpl/study/confirmOrder/aliPayReturn.html",
                        resolve: {
                            deps: ["uiLoad", "$ocLazyLoad",
                                function(uiLoad, $ocLazyLoad) {
                                    var loadedJsModule = [
                                        "js/study/confirmOrder/aliPayReturn.js"
                                    ];
                                    return $ocLazyLoad.load(loadedJsModule);
                                }
                            ]
                        }
                    })
//                  机动车审验教育登录页
                  .state("h5.syLogin", {
                        url: "/syLogin",
                        templateUrl: "tpl/study/login/zzLogin.html",
                        params:{"title":null,"nation":null,"type":null,"pwd":null,"areaCode":null,"regDate":null,"idType":null},
                        resolve: {
                            deps: ["uiLoad", "$ocLazyLoad",
                                function(uiLoad, $ocLazyLoad) {
                                    var loadedJsModule = [
                                        "js/study/login/zzLoginController.js",
                                        "js/study/login/loginService.js"
                                    ];
                                    return $ocLazyLoad.load(loadedJsModule);
                                }
                            ]
                        }
                    })  
                    
 //                 类型选择主页面
                  .state("h5.typeLogin", {
                        url: "/typeLogin",
                        templateUrl: "tpl/study/login/typeLogin.html",
                        resolve: {
                            deps: ["uiLoad", "$ocLazyLoad",
                                function(uiLoad, $ocLazyLoad) {
                                    var loadedJsModule = [
                                        "js/study/login/typeLoginController.js"
                                    ];
                                    return $ocLazyLoad.load(loadedJsModule);
                                }
                            ]
                        }
                    })  
                  
                  .state("h5.registerHnZz", {
                        url: "/registerHnZz",
                        templateUrl: "tpl/study/register/registerHnZz.html",
                        params:{"learnType":null,"areaName":null,"title":"审验注册"},
                        resolve: {
                            deps: ["uiLoad", "$ocLazyLoad",
                                function(uiLoad, $ocLazyLoad) {
                                    var loadedJsModule = [  
                                    	"js/common/rems.js",
                                        "js/study/register/registerHnZzController.js"
                                    ];
                                    return $ocLazyLoad.load(loadedJsModule);
                                }
                            ]
                        }
                    })
                    // 选择是否邮递
                  .state("h5.addressBf", {
                        url: "/addressBf",
                        templateUrl: "tpl/study/address/addressBf.html",
                        params:{
                        "name":null,"carType":null,
                        "score":null,"archNo":null,
                        "idCard":null,"regDate":null,
                        "nation":null,"phone":null,
                        "areaCode":null,"pwd":null,
                        "idType":null,"address":null,
                        "type":null,
                        "postAddress":null
                        },
                        resolve: {
                            deps: ["uiLoad", "$ocLazyLoad",
                                function(uiLoad, $ocLazyLoad) {
                                    var loadedJsModule = [  
                                    	"js/common/rems.js",
                                        "js/study/address/addressBf.js"
                                    ];
                                    return $ocLazyLoad.load(loadedJsModule);
                                }
                            ]
                        }
                    }) 
                    
                    //  选择邮递地址页面
                  .state("h5.address", {
                        url: "/address",
                        templateUrl: "tpl/study/address/address.html",
                        params:{"address":null,"phone":null,"type":null},
                        resolve: {
                            deps: ["uiLoad", "$ocLazyLoad",
                                function(uiLoad, $ocLazyLoad) {
                                    var loadedJsModule = [  
                                    	"js/common/rems.js",
                                        "js/study/address/address.js"
                                    ];
                                    return $ocLazyLoad.load(loadedJsModule);
                                }
                            ]
                        }
                    }) 
                    
                    
                  //  审验学习承诺书
                  .state("h5.letterOfCom", {
                        url: "/letterOfCom",
                        templateUrl: "tpl/study/explain/letterOfCom.html",
                        params:{
                        "name":null,"carType":null,
                        "score":null,"archNo":null,
                        "idCard":null,"regDate":null,
                        "nation":null,"phone":null,
                        "areaCode":null,"pwd":null,
                        "idType":null,"address":null,
                        "type":null,
                        "postAddress":null
                        },
                        resolve: {
                            deps: ["uiLoad", "$ocLazyLoad",
                                function(uiLoad, $ocLazyLoad) {
                                    var loadedJsModule = [  
                                    	"js/common/rems.js",
                                        "js/study/explain/letterOfCom.js"
                                    ];
                                    return $ocLazyLoad.load(loadedJsModule);
                                }
                            ]
                        }
                    })   
                    //  身份证验证页面
                    .state("h5.idCard", {
                        url: "/idCard",
                        templateUrl: "tpl/study/idCard/idCard.html",
                        params:{
	                        "name":null,"carType":null,
	                        "score":null,"archNo":null,
	                        "idCard":null,"regDate":null,
	                        "nation":null,"phone":null,
	                        "areaCode":null,"pwd":null,
	                        "idType":null,"address":null,
	                         "type":null,
	                         "postAddress":null,
	                          "needAddress":null
	                       },
                        resolve: {
                            deps: ["uiLoad", "$ocLazyLoad",
                                function(uiLoad, $ocLazyLoad) {
                                    var loadedJsModule = [                                   
                                        "js/common/rems.js",
                                        "js/study/idCard/idCard.js"
                                    ];
                                    return $ocLazyLoad.load(loadedJsModule);
                                }
                            ]
                        }
                    }) 
                    
                    
                       //  身份证验证页面
                    .state("h5.idCardcs", {
                        url: "/idCardcs",
                        templateUrl: "tpl/study/idCard/idCardcs.html",
                        params:{
	                        "name":null,"carType":null,
	                        "score":null,"archNo":null,
	                        "idCard":null,"regDate":null,
	                        "nation":null,"phone":null,
	                        "areaCode":null,"pwd":null,
	                        "idType":null,"address":null,
	                         "type":null,
	                         "postAddress":null,
	                          "needAddress":null
	                       },
                        resolve: {
                            deps: ["uiLoad", "$ocLazyLoad",
                                function(uiLoad, $ocLazyLoad) {
                                    var loadedJsModule = [                                   
                                        "js/common/rems.js",
                                        "js/study/idCard/idCardcs.js"
                                    ];
                                    return $ocLazyLoad.load(loadedJsModule);
                                }
                            ]
                        }
                    }) 
                    
                    
                    
                    
                    
                      //  身份证验证提示页面
                    .state("h5.idCardTs", {
                        url: "/idCardTs",
                        templateUrl: "tpl/study/idCard/idCardTs.html",
                        params:{
                        "name":null,"carType":null,
                        "score":null,"archNo":null,
                        "idCard":null,"regDate":null,
                        "nation":null,"phone":null,
                        "areaCode":null,"pwd":null,
                        "idType":null,"address":null,
                        "type":null,
                        "postAddress":null,
                        "needAddress":null
                        },
                        resolve: {
                            deps: ["uiLoad", "$ocLazyLoad",
                                function(uiLoad, $ocLazyLoad) {
                                    var loadedJsModule = [                                   
                                        "js/common/rems.js",
                                        "js/study/idCard/idCardTs.js"
                                    ];
                                    return $ocLazyLoad.load(loadedJsModule);
                                }
                            ]
                        }
                    }) 
                    .state("h5.idCardTsApp", {
                        url: "/idCardTsApp",
                        templateUrl: "tpl/study/idCard/idCardTsApp.html",
                        resolve: {
                            deps: ["uiLoad", "$ocLazyLoad",
                                function(uiLoad, $ocLazyLoad) {
                                    var loadedJsModule = [                                   
                                        "js/common/rems.js",
                                        "js/study/idCard/idCardTsApp.js"
                                    ];
                                    return $ocLazyLoad.load(loadedJsModule);
                                }
                            ]
                        }
                    }) 
                    //机动车驾驶人身体情况申报表 H5
                  .state("h5.declaration", {
                        url: "/declaration",
                        templateUrl: "tpl/study/explain/declaration.html",
                         params:{
                            "name":null,"carType":null,
	                        "score":null,"archNo":null,
	                        "idCard":null,"regDate":null,
	                        "nation":null,"phone":null,
	                        "areaCode":null,"pwd":null,
	                        "idType":null,"address":null,
                            "sex":null,"birthday":null,
                            "isLogin":false, "type":null,
                            "postAddress":null,
                            "needAddress":null
                        },
                        resolve: {
                            deps: ["uiLoad", "$ocLazyLoad",
                                function(uiLoad, $ocLazyLoad) {
                                    var loadedJsModule = [  
                                    	"js/common/rems.js",
                                        "js/study/explain/declaration.js"
                                    ];
                                    return $ocLazyLoad.load(loadedJsModule);
                                }
                            ]
                        }
                    })   
                    
                    
//                    //机动车驾驶人身体情况申报表 移动端
//                .state("h5.mobdeclaration", {
//                      url: "/mobdeclaration",
//                      templateUrl: "tpl/study/mobplain/mobdeclaration.html",
//                      resolve: {
//                          deps: ["uiLoad", "$ocLazyLoad",
//                              function(uiLoad, $ocLazyLoad) {
//                                  var loadedJsModule = [  
//                                  	"js/common/rems.js",
//                                      "js/study/mobplain/mobdeclaration.js"
//                                  ];
//                                  return $ocLazyLoad.load(loadedJsModule);
//                              }
//                          ]
//                      }
//                  })   
                    
                    
                   //微信授权页面
                    .state("h5.wxOAuth", {
                        url: "/wxOAuth",
                        templateUrl: "tpl/study/wxOAuth/wxOAuth.html",
                        resolve: {
                            deps: ["uiLoad", "$ocLazyLoad",
                                function(uiLoad, $ocLazyLoad) {
                                    var loadedJsModule = [
                                        "js/study/wxOAuth/wxOAuth.js",
                                        "js/study/login/loginService.js"
                                    ];
                                    return $ocLazyLoad.load(loadedJsModule);
                                }
                            ]
                        }
                    })  
                    .state("h5.testSubmit", {
                        url: "/testSubmit",
                        templateUrl: "tpl/test/test.html",
                        resolve: {
                            deps: ["uiLoad", "$ocLazyLoad",
                                function(uiLoad, $ocLazyLoad) {
                                    var loadedJsModule = [
                                        "js/test/TestController.js"
                                    ];
                                    return $ocLazyLoad.load(loadedJsModule);
                                }
                            ]
                        }
                    })
                    
            }
        ]
    );