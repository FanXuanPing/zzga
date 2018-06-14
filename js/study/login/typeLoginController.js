/**
 * 河南郑州公安-对应页面：登录页
 */
app.controller("typeLoginController", ["$scope", "$state", "$location", 
function($scope, $state, $location) {
	
//	alert("用户代理"+ navigator.userAgent);
	$scope.goLogin=function(title,type){
		$state.go("h5.syLogin",{"title":title,"type":type});
	}
	
	
}]);
