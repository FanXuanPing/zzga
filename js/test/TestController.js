app.controller("TestController", ["$scope", "$state", 
function($scope, $state) {
	
	$scope.flag=false;
	$scope.test=function(){
		console.log("1=="+$scope.flag);
		if($scope.flag){
			return ;
		}
		$scope.flag=true;
		console.log("2=="+$scope.flag);
	}
	
	

}]);
    


