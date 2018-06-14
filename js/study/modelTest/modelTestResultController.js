/**
 * 对应页面：模拟考试结果页面
 */
app.controller("modelTestResultController", ["$scope", "$state","modelTestService",function($scope, $state, modelTestService) {
    
    console.log("modelTestResultController call. init.");
    
    /**
     * 初始加载区
     * */
    
	//分数
	$scope.score = modelTestService.getScore();
	
	//分数线
	$scope.passScore = modelTestService.getPassScore();
	
	//考试时间分钟
    $scope.mm = {};
   
   //计算考试时间的分钟数
	$scope.mm = parseInt(modelTestService.getExamTime() / 1000 / 60 % 60, 10);
	//位数不足两位的前面加0
	$scope.mm = $scope.mm+"";
	if($scope.mm.length == 1){
		$scope.mm = "0"+$scope.mm;
	};
    
    //考试时间秒数
    $scope.ss = {};
    //计算考试时间的秒数  
	$scope.ss = parseInt(modelTestService.getExamTime() / 1000 % 60, 10);
	//位数不足两位的前面加0
	$scope.ss = $scope.ss+"";
	if($scope.ss.length == 1){
		$scope.ss = "0"+$scope.ss;
	};
    
  	
    /**
     * js函数区
     * */
    
    /**
     * 点击返回箭头的事件
     * */
    $scope.goBack = function(){
    	$state.go("h5.modelTestChoose", {});
    };
    
	/**
	 * 点击参看错题按钮事件
	 * */
	$scope.showErrorList = function(){
		modelTestService.setPageType(1);
		$state.go("h5.modelTest", {});
	};
	
	/**
	 * 点击重新考试的按钮事件
	 * */
	$scope.reExam = function(){
		modelTestService.setPageType(0);
		$state.go("h5.modelTest", {});
	};
	
	/**
	 * 合格后点击返回按钮的事件
	 * */
	$scope.successReturn = function(){
		$state.go("h5.modelTestChoose", {});
	};
    

}]);
