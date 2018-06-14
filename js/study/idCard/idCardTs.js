/**
 * 河南郑州公安-对应页面：登录页
 */

var postZjhm=null;
app.controller("idCardTsController", ["$scope", "$state", "$location","$stateParams","$rootScope",
function($scope, $state, $location,$stateParams,$rootScope) {
	

	$scope.type=$stateParams.type || '1004';
	$scope.idCard=$stateParams.idCard || '123';
    $scope.submitText="确认并提交";
    $scope.submit=true;
	$scope.type=$stateParams.type;
	$scope.idCard=$stateParams.idCard;
	$scope.name=$stateParams.name;
	$scope.carType=$stateParams.carType;
	$scope.archNo=$stateParams.archNo;
	$scope.score=$stateParams.score;
	$scope.idType=$stateParams.idType;
	$scope.regDate=$stateParams.regDate;
    $scope.areaCode=$stateParams.areaCode;
    $scope.phone=$stateParams.phone;
    $scope.needAddress=$stateParams.needAddress;
    $scope.pwd=$stateParams.pwd;
    $scope.address=$stateParams.postAddress;
    $scope.goBackLast=function(){
		history.go(-1)
	}
	var theUrl=decodeURIComponent(window.location.href);
    if(theUrl.indexOf("app=ios")!=-1||theUrl.indexOf("app=android")!=-1){
    	$(".nextBtn").hide();
    	$(".header").hide();
    };
	$scope.goIdCard=function(){
		$state.go("h5.idCard",{
    		"idCard":$scope.idCard,"name":$scope.name,
    		"carType":$scope.carType,"score":$scope.score,
    		"archNo":$scope.archNo,"phone":$scope.phone,
    		"pwd":$scope.pwd,"idType":$scope.idType,
	        "idCard":$scope.idCard,"regDate":$scope.regDate,
    	    "type": $scope.type,
    	    "areaCode": $scope.areaCode,
    	    "needAddress":$scope.needAddress,
    	    "address":$scope.address
    	})
	}
}]);

	
