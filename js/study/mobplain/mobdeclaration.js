/**
 * 对应页面：模拟考试选择页面
 */
app.controller("mobdeclarationController", ["$scope", "$state","$stateParams","$location",function($scope, $state,$stateParams,$location) {
    
    console.log("mobdeclarationController call. init.");
	$scope.idType=getIDTypeName($stateParams.idType);
	$scope.name=$stateParams.name||"";
    $scope.carType=$stateParams.carType||""
    $scope.score=$stateParams.score||""
    var pramas={};
    
    var theUrl=decodeURIComponent(window.location.href);
    var arr=theUrl.substr(theUrl.indexOf("?")+1);
    var arrs=arr.split("&");
    for (var i = 0; i < arrs.length; i++) {
    	var a =arrs[i].split("=");
    	var keys=a[0];
    	var values=a[1];
    	pramas[keys]=values;

    }
    
   console.log(pramas)
    $scope.birthday=pramas.birthday;
    $scope.address=pramas.address;
    $scope.archNo=pramas.archNo;
    $scope.idCard=pramas.idCard;
    $scope.name=pramas.name;
    $scope.nation=pramas.nation;
    $scope.sex=pramas.sex;
    $scope.areaCode=$rootScope.areaCode;
    console.log($scope.sex+"111")
     $scope.confirm=function(){
        //再次调用登陆接口 进行登陆
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
	        myLandAjax(ITFC_ADDR.JP_LOGIN, paramData,
		            function(postDataObj, resDataObj) {
		                console.log(ITFC_ADDR.JP_LOGIN + " call sucess. postDataObj :", postDataObj);
		                console.log(ITFC_ADDR.JP_LOGIN + " call sucess. resDataObj :", resDataObj);
		                // 已经注册过
		                $scope.imgBaseUrl = SERVER_IMG_URL;
		                $scope.plan = resDataObj.plan;
		                if('1001'=== $scope.type){
		                	var address=resDataObj.address;
		                	var phone=resDataObj.phone;
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
	                    if(resDataObj.code){
		                	if(resDataObj.code=="09"){
		                	  $state.go("h5.idCard", {"type":$scope.type,"pwd":$scope.pwd,"idCard":$scope.idCard});
		                      return ;
		                	}
		                }
		                if(resDataObj.type == 51 || resDataObj.message.type == 51) {
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
		        return ;
    }
    
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
