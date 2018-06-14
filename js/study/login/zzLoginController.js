/**
 * 河南郑州公安-对应页面：登录页
 */
app.controller("zzLoginController", ["$scope","$rootScope", "$state", "$location","$stateParams","loginService",
function($scope, $rootScope,$state, $location,$stateParams,loginService) {
	
	$scope.title  =  $stateParams.title;
	$scope.type   =  $stateParams.type;
	
	if('1001'=== $scope.type   || "1006" === $scope.type){
		$("#infoConfimRegbtn").show();
	}
	/**
	 * 赋值到rootScope
	 */
	$rootScope.type= $stateParams.type;
	$rootScope.areaCode="320500";
	
	console.log($scope.type)
	//$scope.pwd= $stateParams.pwd;
	
	// 显示登录按钮
	$("#infoConfirmBtn").show();
	
	
	checkWxOAuth();
	
	// 对当前的所属浏览器、学习类型、是否授权进行判断，微信内置浏览器审验学习用户未进行微信授权
	function checkWxOAuth(){
	    if ($scope.type == '1001' && loginService.getIsWxOAuth() != 1 && isWeiXin()) {
	    	// 调用后台接口保存参数并进行后台验证
            var paramData = {};//传参的json对象
            paramData.loginType = $scope.type;//登录类型
            paramData.loginTitle = $scope.title;//登录类型描述
            myLandAjax(ITFC_ADDR.JPV2_CHECKOPENID , paramData, 
                function(postDataObj, resDataObj) {
                    console.log("这里是成功的回调函数 . postDataObj, resDataObj :", postDataObj, resDataObj);
                    // 判断是否已经授权，已授权不做操作，未授权的跳转到微信授权页面
                    if (resDataObj.checkCode == "1") {
                    	loginService.setIsWxOAuth(1);
                    } else if (resDataObj.checkCode == "0"){
                        $state.go("h5.wxOAuth", {});
                    }
                }, 
                function(postDataObj, resErrMsg) {
                    console.log("这里是失败的回调函数 . postDataObj, resErrMsg :", postDataObj, resErrMsg);
                    
                }
            );
	    }
	};
	
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
	            "params.type" : $scope.type,
	            "params.loginType":'h5',
	            "data" : "",
	            "firstFlag" : "",
	            "r" : "",
	            "p" : "",
	            "v" : "",
	            "n" : 0,
	            "opt":'Android',
	            "times":"1"
	        };
	        $rootScope.pwd=$scope.pwd;
//	        idCard  = $scope.idCard;
	        loginService.setParamData(paramData);
	        $scope.isShowMask = true;
	        myLandAjax(ITFC_ADDR.JP_LOGIN, paramData,
	            function(postDataObj, resDataObj) {
	                console.log(ITFC_ADDR.JP_LOGIN + " call sucess. postDataObj :", postDataObj);
	                console.log(ITFC_ADDR.JP_LOGIN + " call sucess. resDataObj :", resDataObj);
	                $scope.imgBaseUrl = SERVER_IMG_URL;
	                $scope.plan = resDataObj.plan;
	                // 已经注册过
	                var address=resDataObj.address;
	                var phone=resDataObj.phone;
	                var needAddress=resDataObj.needAddress;
	                if('1001'=== $scope.type   || "1006" === $scope.type){
	                	var declare=resDataObj.declare;
	                	if(declare !="1"){
	                	    $state.go("h5.declaration", {"isLogin":true,"type":$scope.type,
	                	    "idCard":$scope.idCard,"phone":phone,
	                	    "address":address,
	                	    "postAddress":address,
	                	    "needAddress":needAddress});
	                		return ;
	                	}
	                }
	                if('1001'=== $scope.type && needAddress){
		                $state.go("h5.address", {"address":address,"phone":phone});
	                	return ;
	                }
	                $state.go("h5.cource", {});
	                return ;
	            },
	            function(postDataObj, resDataObj) {
	                console.log(ITFC_ADDR.JP_LOGIN + " call fail. postDataObj :", postDataObj);
	                console.log(ITFC_ADDR.JP_LOGIN + " call fail. resDataObj :", resDataObj);
	                // 未注册过的用户
	                $scope.isShowMask = false;
		                if(resDataObj.code){
		                	  //05 注册审核未通过   08 学时审核未通过
					           if(resDataObj.code=="05" || resDataObj.code=="08"){
					           	 var msg=typeof(resDataObj.message)=="object"?resDataObj.message.msg:resDataObj.message;
//			           	   	   	 var msg=resDataObj.message.msg;
			           	   	   	 if(msg.indexOf("您的注册信息审核未通过")>-1 || msg.indexOf("您的学时审核未通过")>-1){
			            		          	alert(msg);
//			            		          	if('1001'=== $scope.type || '1006'=== $scope.type){
//							           	    	 var title='1001'=== $scope.type?"审验注册":"校车驾驶员审验注册";
//							             	     $state.go("h5.registerHnZz",{"learnType":$scope.type,"areaName":"郑州市","title":title});
//							             	     return;
//						           	         }
		            		 				cofimBtn();
			            		          	return ;
			            		 }
					           }
		                	   if(resDataObj.code==="1"){
					           	//跳转到注册页面
					           	    if('1001'=== $scope.type || '1006'=== $scope.type){
					           	    	 alert("无驾驶员信息,请注册!");
					           	    	 var title='1001'=== $scope.type?"审验注册":"校车驾驶员审验注册";
					             	     $state.go("h5.registerHnZz",{"learnType":$scope.type,"areaName":"郑州市","title":title});
//										cofimBtn();
					             	     return;
					           	    }
					           	    alert("无驾驶员信息!");
					           	    return ;
					            }
		                	    if(resDataObj.code=="02"||resDataObj.code=="03"||resDataObj.code=="04"||resDataObj.code=="06"||resDataObj.code=="07"||resDataObj.code=="98"||resDataObj.code=="99"){
					           		 var msg=typeof(resDataObj.message)=="object"?resDataObj.message.msg:resDataObj.message;
					           	 	 return alert(msg);
					            }
			                	if(resDataObj.code=="09"){
		//	                		$rootScope.idType= resDataObj.message.idType
			                		var date=resDataObj.message.regDate;
			                		var dateStr=date.substr(0,4)+" 年 "+date.substr(4,2)+" 月 "+date.substr(6)+" 日"
			                		$state.go("h5.letterOfCom",
			                		{"name":resDataObj.message.name,
				                		"carType":resDataObj.message.drivingType,
				                		"score":resDataObj.message.points,
				                		"archNo":resDataObj.message.archNo,
				                		"idCard":resDataObj.message.idCard,
				                		"phone":resDataObj.message.phone,
				                		"idType":resDataObj.message.idType,
				                		"nation":resDataObj.message.nation,
				                		"regDate":dateStr,"pwd":$scope.pwd,
				                		"type":$scope.type,"areaCode":$scope.areaCode
			                		})
			                	  //$state.go("h5.idCard", {"type":$scope.type,"pwd":$scope.pwd,"idCard":$scope.idCard});
			                      return ;
			                	}
		                }
		            if(resDataObj.type == 51 || resDataObj.message.type == 51){
		                    // 学员信息验证
		                    postDataObj.v =resDataObj.message.v;
		                    postDataObj.n =resDataObj.message.n;
		                    loginService.setParamData(postDataObj);
		                    $state.go("h5.auth", {});
		                    return ;
	                }
		           if(resDataObj.message || resDataObj.m){
		           	     var message=resDataObj.m || resDataObj.message;
		           	     alert(message);
		           	     return ;
	                }else{
	                	 alert(resDataObj);
	                }
	                
	            }
	        );
	    };

	
	

	
	
	
	
	
	$scope.confimReg=function(){
			 $state.go("h5.registerHnZz",{"learnType":$scope.type,"areaName":"郑州市","title":$scope.title});
		}
	
	
	
	
//	返回上一级
	$scope.goBackLast=function(){
		history.go(-1)
	};
	
	//setTimeout("detectBrowser('"+$scope.type+"');",1000);
	
	//判断当前打开网页的是否是微信浏览器
    function isWeiXin(){
        var ua = window.navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            return true;
        }else{
            return false;
        }
    };
	
}]);


function detectBrowser(type){
    /*  $("#infoConfirmBtn").show();*/
	   /*if("1001"===type){
	   	 if(navigator.userAgent.indexOf('UCBrowser')<0) {
		   //不是UC浏览器
		   alert("请使用UC手机浏览器完成注册与支付学习\n"
			+"1、点击微信右上角（三个小点）\n"
			+"2、选择在浏览器中打开\n"
			+"  安卓系统选择“在浏览器中打开”\n"
			+"3、选择UC浏览器打开后，继续完成注册支付与课程学习\n")
		   window.open("http://android.myapp.com/myapp/detail.htm?apkName=com.UCMobile","_blank");
		   $("#infoConfirmBtn").hide();
		   return ;
		 }
		   $("#infoConfirmBtn").show();
	   }else{
	   	   alert("请使用UC手机浏览器完成注册与支付学习\n"
			+"1、点击微信右上角（三个小点）\n"
			+"2、选择在浏览器中打开\n"
			+"  安卓系统选择“在浏览器中打开”\n"
			+"3、选择UC浏览器打开后，继续完成注册支付与课程学习\n")
	   	   $("#infoConfirmBtn").show();
	   }*/
	   $("#infoConfirmBtn").show();
}
	


function cofimBtn(){
	$("#infoConfimRegbtn").css("background-color","#00a8f3");
	$("#infoConfimRegbtn").removeAttr("disabled");
	
}












