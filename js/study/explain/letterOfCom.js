/**
 * 对应页面：模拟考试选择页面
 */
app.controller("letterOfComController", ["$scope","$rootScope", "$state","$stateParams",function($scope,$rootScope, $state,$stateParams) {
    
    console.log("letterOfComController call. init.");
	
	$scope.name=$stateParams.name||"";
    $scope.carType=$stateParams.carType||"";
    $scope.score=$stateParams.score||"";
    $scope.archNo=$stateParams.archNo||"";
    $scope.idCard=$stateParams.idCard||"";
    $scope.regDate=$stateParams.regDate||"年     月     日";
    $scope.type=$stateParams.type||"";
    $scope.dateStr=$stateParams.dateStr||"";
    $scope.pwd=$stateParams.pwd;
    $scope.idType=$stateParams.idType;
    $scope.areaCode=$stateParams.areaCode;
    $scope.phone=$stateParams.phone;
    $scope.type = $stateParams.type;
    console.log($scope.type)
    $scope.confim=function(){
    	var type = $stateParams.type;
    	if(type == "1006"){
    		$state.go("h5.idCardTs",{
	    		"idCard":$scope.idCard,"name":$scope.name,
	    		"carType":$scope.carType,"score":$scope.score,
	    		"archNo":$scope.archNo,"phone":$scope.phone,
	    		"pwd":$scope.pwd,"idType":$scope.idType,
		        "idCard":$scope.idCard,"regDate":$scope.regDate,
	    	    "type": $scope.type,
	    	    "areaCode": $scope.areaCode
    		});
    		return;
    	}
    	
    	$state.go("h5.addressBf",{
    		"idCard":$scope.idCard,"name":$scope.name,
    		"carType":$scope.carType,"score":$scope.score,
    		"archNo":$scope.archNo,"phone":$scope.phone,
    		"pwd":$scope.pwd,"idType":$scope.idType,
	        "idCard":$scope.idCard,"regDate":$scope.regDate,
    	    "type": $scope.type,
    	    "areaCode": $scope.areaCode
    	});
    }
    
    
    var pramas={};
    var theUrl=decodeURIComponent(window.location.href);
    if(theUrl.indexOf("app=ios")!=-1||theUrl.indexOf("app=android")!=-1){
    	$(".letterCim").hide();
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
	    $scope.name=pramas.name;
	    $scope.score=pramas.score;
	    $scope.archNo=pramas.archNo;
	    $scope.idCard=pramas.idCard;
	    $scope.carType=pramas.carType;
	    $scope.regDate=pramas.regDate;
    }
}]);
