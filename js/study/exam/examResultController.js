/**
 * 对应页面：模拟考试结果页面
 */
app.controller("ExamResultController", ["$scope", "$state","ExamService",function($scope, $state, ExamService) {
    
    console.log("ExamResultController call. init.");
    
    /**
     * 初始加载区
     * */
    
	//分数
	$scope.score = ExamService.getScore();
	
	//分数线
	$scope.passScore = ExamService.getPassScore();
	
	//考试时间分钟
    $scope.mm = {};
   
   //计算考试时间的分钟数
	$scope.mm = parseInt(ExamService.getExamTime() / 1000 / 60 % 60, 10);
	//位数不足两位的前面加0
	$scope.mm = $scope.mm+"";
	if($scope.mm.length == 1){
		$scope.mm = "0"+$scope.mm;
	};
    
    //考试时间秒数
    $scope.ss = {};
    //计算考试时间的秒数  
	$scope.ss = parseInt(ExamService.getExamTime() / 1000 % 60, 10);
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
    	//不合格的情况下直接返回学习页面
    	if ($scope.score<$scope.passScore) {
    		$state.go("h5.cource", {});
    	} else{
    		//合格的情况下先跳转学习节点再返回
    		$scope.successReturn();
    	}
    };
    
	/**
	 * 点击参看错题按钮事件
	 * */
	$scope.showErrorList = function(){
		$state.go("h5.exam", {score:ExamService.getExamScore(),count:ExamService.getExamCount(),testPaperId:ExamService.getTestPaperId(),pageType:1});
	};
	
	/**
	 * 点击重新考试的按钮事件
	 * */
	$scope.reExam = function(){
		//不合格的情况下才能重新考试
		if ($scope.score<$scope.passScore) {
			$state.go("h5.exam", {score:ExamService.getExamScore(),count:ExamService.getExamCount(),testPaperId:ExamService.getTestPaperId(),pageType:0});
		} else{
			alert("考试已通过，请返回");
		}
		
	};
	
	/**
	 * 合格后点击返回按钮的事件
	 * */
	$scope.successReturn = function(){
		//调取跳转节点的接口后返回学习页面
		var url = ITFC_ADDR.JP_CHECKPLANNODE;
    	myLandAjax(url,{isModify:1},
            function(postDataObj, resDataObj) {
            	console.log("这里是成功的回调函数 . postDataObj, resDataObj :", postDataObj, resDataObj);
            	$state.go("h5.study", {});
            },
            function(postDataObj, resErrMsg) {
                console.log("这里是失败的回调函数 . postDataObj, resErrMsg :", postDataObj, resErrMsg);
            }
        );
	};
    

}]);
