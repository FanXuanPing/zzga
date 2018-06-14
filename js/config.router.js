'use strict';

/**
 * Config for the router.  江苏-苏州公安
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

                var first = "/h5/courceindex";
                $urlRouterProvider.otherwise(first);

                // -1) 手机端页面
                $stateProvider
                    .state('h5', {
                    url: '/h5',
                    template: '<div ui-view class="fade-in-right-big smooth" ></div>'
                })
                // demo
                .state("demo", {
                    url: "/demo",
                    templateUrl: "tpl/study/demo/demo.html",
                    resolve: {
                        deps: ["uiLoad", "$ocLazyLoad",
                            function(uiLoad, $ocLazyLoad) {
                                var loadedJsModule = [
                                    "js/study/demo/demoService.js",
                                    "js/study/demo/demoController.js"
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
                                    "js/study/cource/courceController.js"
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
                                        "js/study/confirm/confirmController.js"
                                    ];
                                    return $ocLazyLoad.load(loadedJsModule);
                                }
                            ]
                        }
                    })
                    // 5. 登录审验首页 [http://ip:port/jpv2H2/index.html#/h5/photographios]
                    .state("h5.courceindex", {
                        url: "/courceindex",
                        templateUrl: "tpl/study/cource/courceIndex.html",
                        resolve: {
                            deps: ["uiLoad", "$ocLazyLoad",
                                function(uiLoad, $ocLazyLoad) {
                                    var loadedJsModule = [
                                        "css/public.css",
                                        "js/study/cource/courceIndexController.js"
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
                    // 11. 模拟考试操作页_非登录 [http://ip:port/jpv2H2/index.html#/h5/modelTest]
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
                    // 12. 模拟考试结果页_非登录 [http://ip:port/jpv2H2/index.html#/h5/modelTestResult]
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
                    // 13. 湖南长沙登录页面 [http://ip:port/jpv2H2/index.html#/h5/csLogin]
                    .state("h5.jszjLogin", {
                        url: "/csLogin",
                        templateUrl: "tpl/study/login/csLogin.html",
                        resolve: {
                            deps: ["uiLoad", "$ocLazyLoad",
                                function(uiLoad, $ocLazyLoad) {
                                    var loadedJsModule = [
                                        "css/public.css",
                                        "js/study/login/csLoginController.js",
                                        "js/study/login/loginService.js"
                                    ];
                                    return $ocLazyLoad.load(loadedJsModule);
                                }
                            ]
                        }
                    })
            }
        ]
    );