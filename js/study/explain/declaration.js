/**
 * 对0应页面：模拟考试选择页面
 */
app.controller("declarationController", ["$scope","$rootScope", "$state","$stateParams","$rootScope",function($scope,$rootScope, $state,$stateParams,$rootScope) {
    
    console.log("declarationController call. init.");
    //接受传递过来的参数
    $scope.name=$stateParams.name||"";
	$scope.birthday=$stateParams.birthday||"";
    $scope.sex=$stateParams.sex||""
    $scope.address=$stateParams.address||""
   // $scope.mz=$stateParams.nation||""
    $scope.idCard=$stateParams.idCard||"";
    $scope.pwd=$stateParams.pwd;
    $scope.type=$stateParams.type;
    $scope.areaCode=$stateParams.areaCode;
    $scope.idType=getIDTypeName($stateParams.idType);
    $scope.phone=$stateParams.phone;
    $scope.archNo=$stateParams.archNo;
    $scope.carType=$stateParams.carType;
    //$scope.score=$stateParams.score||"";
    $scope.regDate=$stateParams.regDate;
    $scope.nation=$stateParams.nation||"中国";
    $scope.isLogin=$stateParams.isLogin|| false;
    $scope.postAddress=$stateParams.postAddress||"";
    $scope.needAddress=$stateParams.needAddress;

    var pramas={};
    var theUrl=decodeURIComponent(window.location.href);
    
    if(theUrl.indexOf("app=ios")!=-1||theUrl.indexOf("app=android")!=-1){
    	$("#cimBtn").hide();
    	var arr=theUrl.substr(theUrl.indexOf("?")+1);
	    var arrs=arr.split("&");
	    for (var i = 0; i < arrs.length; i++) {
	    	var a =arrs[i].split("=");
	    	if(a.length>=2){
	    		var key=a[0];
		    	var val=a[1];
		    	pramas[key]=val;
	    	}
	    }
	    
	    $scope.birthday=pramas.birthday || "";
	    $scope.address=pramas.address || "";
	    $scope.archNo=pramas.archNo  || "";
	    $scope.idCard=pramas.idCard  || "";
	    $scope.name=pramas.name  || "";
	    $scope.mz=pramas.nation  || "";
	    $scope.sex=pramas.sex  || "";
	    $scope.nation=pramas.nation||"中国";
	    $scope.carType=pramas.carType  || "";
	    $scope.areaCode=pramas.areaCode  || "";  
	    $scope.idType=getIDTypeName(pramas.idType);
	    $scope.phone=pramas.phone  || "";
	    $scope.regDate=pramas.regDate  || "";
    }
    
    $scope.confirm=function(){
    	if($scope.isLogin=="true"){
    		var paramData={
	       	      	 "idCard":$scope.idCard
	       	 };
	    	 myLandAjax(ITFC_ADDR.UPDATESHOWDECLARE, 
	   	      	paramData,function(postDataObj, resDataObj){
	   	      		// 1、必须是审验  2、needAddress true
	   	      		if('1001'=== $scope.type && $scope.needAddress){
	   	      			$state.go("h5.address",{"address":$scope.postAddress,
		   	      		"phone":$scope.phone,"needAddress":$scope.needAddress});
	   	                return ;
	   	      		}else{
	   	      			 $state.go("h5.cource", {});
	   	      		}
	   	      		
	   	      		
	   	      		 
	   	      	},function(postDataObj, resDataObj){
	   	      		  $state.go("h5.address",{"address":$scope.postAddress,
	   	      		  "phone":$scope.phone,"needAddress":$scope.needAddress});
   	                   return ;
	   	      	});
    	}else{
    		  var paramData = {
		            "userName" : $scope.idCard,
		            "area" : $scope.areaCode,
		            "pwd" : $scope.pwd,
		            "params.type" : $scope.type,
		            "params.loginType":'h5',
		            "data" : "",
		            "firstFlag" : "",
		            "r" : "",
		            "p" : "",
		            "v" : "",
		            "n" : 0,
		            "opt":'Android'
		        };
		        if("1006"===$scope.type){
		        	paramData.times="1";
		        }
		        //再次调用登陆接口 进行登陆
	        myLandAjax(ITFC_ADDR.JP_LOGIN, paramData,
		            function(postDataObj, resDataObj) {
		            	var address=resDataObj.address;
					    var phone=resDataObj.phone;
					    var needAddress=resDataObj.needAddress;
		            	var paramData={
				       	      	 "idCard":$scope.idCard
				       	 };
				    	 myLandAjax(ITFC_ADDR.UPDATESHOWDECLARE, 
				   	      	paramData,function(postDataObj, resDataObj){
				   	      		   $scope.imgBaseUrl = SERVER_IMG_URL;
					                $scope.plan = resDataObj.plan;
					                if('1001'=== $scope.type && needAddress){
					                	$state.go("h5.address", {"address":address,"phone":phone});
					                	return ;
					                }
					                $state.go("h5.cource", {});
				   	      		 return ;
				   	      	},function(postDataObj, resDataObj){
				   	      		  $scope.login();
				   	      	});
		               
		            },
		            function(postDataObj, resDataObj) {
		                console.log(ITFC_ADDR.JP_LOGIN + " call fail. postDataObj :", postDataObj);
		                console.log(ITFC_ADDR.JP_LOGIN + " call fail. resDataObj :", resDataObj);
		                // 未注册过的用户
	                    if(resDataObj.code){
		                	if(resDataObj.code=="09"){
		                	  $state.go("h5.idCard", {"type":$scope.type,"pwd":$scope.pwd,"idCard":$scope.idCard});
		                      return ;
		                	}
		                }
		                if(resDataObj.type == 51) {
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
		                }else{
		                	 alert(resDataObj);
		                }
		                return ;
		            }
		        );
        
    	}
    }
    $scope.init=function(){
       if($scope.isLogin=="true"){
       	      var paramData={
       	      	 "idCard":$scope.idCard,
       	      	 "type":$scope.type
       	      };
       	      myLandAjax(ITFC_ADDR.QUERYDECLAREINFO, 
       	      	paramData,function(postDataObj, resDataObj){
       	      		console.log(resDataObj)
       	      		$scope.name=resDataObj.name;
       	      		$scope.sex=resDataObj.sex;
					$scope.nation=resDataObj.nation;
					$scope.idType=getIDTypeName(resDataObj.idType);
					$scope.idCard=resDataObj.idCard;
					$scope.address=resDataObj.address;
					$scope.postAddress=resDataObj.postAddress;
					$scope.birthday=resDataObj.birthday;
				    $scope.archNo=resDataObj.archNo;
       	      	    $scope.carType=resDataObj.drivingType;
       	      	   // $scope.regDate=resDataObj.regDate ||resDataObj.birthday;
       	      	    var date=resDataObj.regDate;
			        $scope.regDate=date.substr(0,4)+" 年 "+date.substr(4,2)+" 月 "+date.substr(6)+" 日";
       	      	},function(postDataObj, resDataObj){
       	      			console.log(resDataObj)
       	      	});
       }
    }
     $scope.init();
}]);


function getIDTypeName(type){
	if("A"===type){
		return "居民身份证";
	}else if("C"=== type){
		return "军官证";
	}else if("D"=== type){
		return "士兵证";
	}else if("E"=== type){
		return "军官离退休证";
	}else if("F"=== type){
		return "境外人员身份证明";
	}else if("G"=== type){
		return "外交人员身份证明";
	}else{
		return "其他证件类型";
	}
}
