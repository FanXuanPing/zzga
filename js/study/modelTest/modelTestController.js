/**
 * 对应页面：模拟考试页面
 */
app.controller("modelTestController", ["$scope", "$state","$interval","$timeout","modelTestService",function($scope, $state ,$interval,$timeout,modelTestService) {
    
    console.log("modelTestController call. init.");
    
    /**
     * 初始加载区
     * */
		
    //页面类型，0表示考试页面，1表是错题集页面
    $scope.pageType = modelTestService.getPageType();
    
    //练习方式//1顺序练习；2随机联系；0模拟考试
    $scope.examType = modelTestService.getExamType();
    
    //试题Id列表
    var examIdList = modelTestService.getExamIdList();
    
    //判断题分值 
    var decideScore = 0;
    
    //复选题分值
    var checkboxScore = 0;
    
    //单选题分值
    var radioScore = 0;
    
    //考试时间test
    var testTime = {};
    
    //试题列表
    $scope.testList = {};
    
    //倒计时显示的分钟
    $scope.mm = "00";
    
    //倒计时显示的秒数
    $scope.ss = "00";
    
    //考试开始时间
    var examStartTime = {};
    
    //总测试题数量
    $scope.totalCount = {};
    
    //正确答案统计
    $scope.rightCount = 0;
    
    //错误答案数统计
    $scope.errorCount = 0;
    
    //错题集展示标志
    $scope.isShowErrorList = false;
    

	/**
	 * 根据练习方式/页面类型加载页面数据
	 * */
	if ($scope.examType == 0) {//模拟考试初始化数据
		if ($scope.pageType == 0) {//考试页面
			decideScore = modelTestService.getDecideScore();//拿取判断题分值
			checkboxScore = modelTestService.getCheckboxScore();//拿取多选题分值
			radioScore = modelTestService.getRadioScore();//拿取单选题分值
			testTime = new Date(new Date().getTime() + modelTestService.getTestTime()*60*1000);//提取考试限制时间
			createTestList();//初始化试题列表
			examStartTime = new Date().getTime();//考试开始时间
			$scope.totalCount = $scope.testList.length;//总测试题数量
			$scope.isShowErrorList = false;//是否展示错题列表
			score = 0;//重置分数
		} else{//错题集页面
			$scope.testList = modelTestService.getTestList();
			$scope.isShowErrorList = true;//是否展示错题列表
		    $scope.rightCount = modelTestService.getRightCount();
		    $scope.errorCount = modelTestService.getErrorCount();
		    $scope.totalCount = $scope.testList.length;//总测试题数量
		}
	} else{//顺序练习和随机练习初始化数据
		decideScore = modelTestService.getDecideScore();//拿取判断题分值
		createTestList();//初始化试题列表
		$scope.totalCount = $scope.testList.length;//总测试题数量
		$scope.isShowErrorList = false;//是否展示错题列表
	}
    
    //当前第几题
    $scope.nowTestNumber = 0;
        
    //当前题目
    $scope.nowTest = {};
    
    //选项前面的字母标记
    $scope.optionLetter = ['A','B','C','D','E','F'];
    
    //是否显示答案
    $scope.isShowAnswer = false;
    
    //答案展示的正确答案列表
    $scope.rightAnswer = "";
    
    //分数
    var score = 0;
    
    //初始化试题
    refreshTest();
    
  	
    /**
     * js函数区
     * */
    
    /**
     * 计算考试倒计时的函数
     * */
    var timeDiffer = 0;//当前时间到考试结束时间的时间差变量
    var stop = $interval(function () {
    	if ($scope.examType == 0 && $scope.pageType == 0) {
	    	//计算预计的考试时间到当前时间之间的时间差
		  	timeDiffer = testTime - new Date();
		  	//如果时间差为负数表示考试已经结束强制交卷
		  	if (timeDiffer < 0) {
		  		alert("考试时间到!");
	      		saveTestPaper();
	      	}
	      	//计算剩余的分钟数 
			$scope.mm = parseInt(timeDiffer / 1000 / 60 % 60, 10);
			//位数不足两位的前面加0
			$scope.mm = $scope.mm+"";
			if($scope.mm.length == 1){
				$scope.mm = "0"+$scope.mm;
			}
			//计算剩余的秒数  
			$scope.ss = parseInt(timeDiffer / 1000 % 60, 10);
			//位数不足两位的前面加0
			$scope.ss = $scope.ss+"";
			if($scope.ss.length == 1){
				$scope.ss = "0"+$scope.ss;
			}
    	}else if($scope.pageType == 1){
    		
    	}
  	}, 1000);
    
    /**
     * 点击下一题按钮事件
     * */
    $scope.toNextTest = function(){
    	//当前试题号+1后也要小于总试题号，等于表示已经是最后一题了没有下一题了
    	if ($scope.nowTestNumber+1 < $scope.totalCount) {
    		//当前题数加一
    		$scope.nowTestNumber = $scope.nowTestNumber+1;
    		//初始化试题
    		refreshTest();
    	} else{//最后一题时执行的事件
    		
    	}
    }
    
    /**
     * 点击选项的事件
     * */
    $scope.clickAnswerOption = function(answerOptionId){
    	//pageType等于1表示当前错题集状态不能做题
    	if ($scope.pageType == 1) {
    		return ;
    	}
    	//算出当前选项的id以便进行行为记录
    	var idNum = answerOptionId.substr(answerOptionId.length-1,answerOptionId.length);
    	
    	//先判断当前试题是是单选还是多选
    	if ($scope.nowTest.examType == '1') {//多选的逻辑
    		//拿取选项
    		var e = $("#"+answerOptionId);
    		
    		if ($(e).hasClass('selectLi')) {//如果该选项已经选中则移除选中标记
    			$(e).removeClass('selectLi');
    			//删除选项行为记录
    			$scope.nowTest.detail[idNum].selectLi = false;
    		} else{//未选中则添加选中标记
    			$(e).addClass('selectLi');
    			//添加选项行为记录
    			$scope.nowTest.detail[idNum].selectLi = true;
    		}
    		//多选专用，每次点击选项后用于判断提交按钮是否可用
    		isShowSubmitButton();
    	} else{//单选和判断题的逻辑
    		//单选和判断提题直接验证选中的是否是正确答案
    		//添加选项行为记录
    		$scope.nowTest.detail[idNum].selectLi = true;
    		$scope.nowTest.isShowAnswer = true;
    		
    		if ($("#"+answerOptionId).attr("isAnswer") == "1") {//如果是正确答案则跳到下一题
    			//正确记录
    			$scope.rightCount = $scope.rightCount+1;
    			$scope.isShowAnswer = true;
    			//记录是否回答正确
    			$scope.nowTest.isRight = true;
    			//计算得分
    			countScore();
    		} else{//错误答案这显示答案区
    			//错误记录
    			$scope.errorCount = $scope.errorCount+1;
    			//答案错误则显示答案区
    			$scope.isShowAnswer = true;
    			//记录是否回答正确
    			$scope.nowTest.isRight = false;
    		}
    		
    		//将题目保存入试题列表
    		$scope.testList[$scope.nowTestNumber].examInfo = $scope.nowTest;
    		
    		//停留三秒后跳转下一题
			$timeout(function () {
				$scope.toNextTest();
			}, 3000);
    	}
    	
    }
    
    /**
     * 多选题点击提交按钮的事件
     * */
    $scope.clickSubmitButton = function(){
    	//判断当前按钮是否可点状态，不可点状态无视点击操作
    	if ($("#submitButton").hasClass("sure")) {
    		//拿取全部的选项并遍历
    		$("[name='answerOptions']").each(function(){
	    		if ($(this).hasClass('selectLi')) {//当前已经选中的选项
	    			//判断当前选项是否正确答案
	    			if ($(this).attr("isAnswer") == "0") {
	    				//已选中的选项不是正确答案，显示答案区，函数停止执行
	    				$scope.isShowAnswer = true;
	    				//错误记录
    					$scope.errorCount = $scope.errorCount+1;
    					//记录是否回答正确
    					$scope.nowTest.isRight = false;
	    				return false;
	    			}
	    		}else{//未选中的选项
	    			//判断当前选项是否正确答案
	    			if ($(this).attr("isAnswer") == "1") {
	    				//未选中的选项是正确答案，显示答案区，函数停止执行
	    				$scope.isShowAnswer = true;
	    				//错误记录
    					$scope.errorCount = $scope.errorCount+1;
    					//记录是否回答正确
    					$scope.nowTest.isRight = false;
	    				return false;
	    			}
	    		}
	    	});
	    	//将提交按钮置于不可用
	    	$("#submitButton").removeClass("sure");
	    	
	    	//行为记录
	    	$scope.nowTest.isShowAnswer = true;
	    	
	    	//验证无误则跳转下一题
	    	if (!$scope.isShowAnswer) {
	    		//正确记录
    			$scope.rightCount = $scope.rightCount+1;
    			//记录是否回答正确
    			$scope.nowTest.isRight = true;
    			$scope.isShowAnswer = true;
    			//计算得分
    			countScore();
	    	}
	    	
	    	//将题目保存入试题列表
    		$scope.testList[$scope.nowTestNumber].examInfo = $scope.nowTest;
    		
	    	//停留三秒后跳转下一题
			$timeout(function () {
				$scope.toNextTest();
			}, 3000);
    	}
    }
    
    /**
     * 点击题号跳转试题
     * */
    $scope.jumpTest = function(jumpNum){
    	$scope.nowTestNumber = jumpNum;
    	refreshTest();
    }
    
    /**
     * 点击“全部试题”和“全部错题”按钮的事件
     * */
    $scope.showErrorList = function(flag){
    	$scope.isShowErrorList = flag;
    }
    
    /**
     * 点击返回箭头的事件
     * */
    $scope.goBack = function(){
    	//关闭定时任务
    	$interval.cancel(stop);
    	//错题集状态下事件逻辑不同
    	if ($scope.pageType == 1) {
    		//错题集状态下逻辑
    		$state.go("h5.modelTestResult", {});
    	} else{
    		//非错题集状态下跳回学习页面
    		$state.go("h5.modelTestChoose", {});
    	}
    	
    }
    
    /**
     * 点击交卷按钮的事件
     * */
    $scope.handExam = function(){
    	//计算当前有几道题没有做，有未做题给与提示
    	var noAnswerCount = 0;
    	//对试题列表进行遍历判断每个题是否做过
    	$($scope.testList).each(function(){
    		if (this.examInfo == null) {//没有试题信息肯定没做
    			noAnswerCount = noAnswerCount + 1;
    		} else{
    			if (this.examInfo.isShowAnswer) {
	    			
	    		} else{//没有已做题的行为记录表示该题没有做
	    			noAnswerCount = noAnswerCount + 1;
	    		}
    		}
    	});
    	
    	//有未做题题给与提示
    	if (noAnswerCount == 0) {//没有未做题就交卷
    		saveTestPaper();
    	} else{
    		//弹出选择对话框
    		if (confirm("还有"+noAnswerCount+"题没做，您确定要交卷？")) {
    			//点击确定
    			saveTestPaper();
    		} else{
    			//点击取消
    		}
    	}
    };
    
    /**
     * 创建试题列表
     * */
    function createTestList(){
    	//顺序练习和随机练习过来的是字符串不是数组要先变换为数组
    	if($scope.examType == 1 || $scope.examType == 2){
    		examIdList = "["+examIdList+"]";
    		examIdList = eval(examIdList);
    	}
    	//遍历examIdList初始化生成testList
    	var testListStr = "[";
    	//对examIdList进行遍历并拼接数据
    	$(examIdList).each(function(){
    		testListStr = testListStr+"{examId:'"+this+"',examInfo:'null'},";
    	});
    	//截取最后的逗号
    	testListStr = testListStr.substr(0,testListStr.length-1);
    	testListStr = testListStr+"]";
    	//将拼接好的字符串转换为json数组
    	$scope.testList = eval(testListStr);
    };
    
    /**
     * 初始化试题的函数
     * */
    function refreshTest(){
    	//提取数据
    	if($scope.testList[$scope.nowTestNumber].examInfo == "null"){
    		//调取接口拿取数据详情
    		var url = ITFC_ADDR.GETEXAMINFOBYID;//接口url
	    	var paramData = {};//传参的json对象
	    	paramData.examId = $scope.testList[$scope.nowTestNumber].examId;//类别体系
	    	myLandAjax(url, paramData, 
		        function(postDataObj, resDataObj) {
		            console.log("这里是成功的回调函数 . postDataObj, resDataObj :", postDataObj, resDataObj);
		            $scope.nowTest = resDataObj;
		        }, 
		        function(postDataObj, resErrMsg) {
		            console.log("这里是失败的回调函数 . postDataObj, resErrMsg :", postDataObj, resErrMsg);
		            return ;//函数停止执行
		        }
		    );
    	}else{
    		$scope.nowTest = $scope.testList[$scope.nowTestNumber].examInfo;
    	};
    	
    	//对题面里的特殊符号进行处理
    	$scope.nowTest.content = $scope.nowTest.content.replace("<br/>","");
    	
    	//是否显示答案
    	if ($scope.nowTest.isShowAnswer) {
    		$scope.isShowAnswer = $scope.nowTest.isShowAnswer;
    	} else{
    		$scope.isShowAnswer = false;
    	}
    	
    	//拿取正确答案
    	//给正确答案集合赋空值
    	$scope.rightAnswer = "";
    	//拿取选项列表
    	var detail = $scope.nowTest.detail;
    	//对选项列表进行遍历获取正确答案的英文标号并拼入正确答案变量
    	for(var i=0;i<detail.length;i++){
    		if (detail[i].isAnswer == "1") {
    			$scope.rightAnswer = $scope.rightAnswer+$scope.optionLetter[i]+"，";
    		}
    	}
    	//将正确答案最后的逗号切掉
    	$scope.rightAnswer = $scope.rightAnswer.substr(0,$scope.rightAnswer.length-1);
    };
    
    /**
     * 多选题检查提交按钮是否可用
     * */
    function isShowSubmitButton(){
    	//选中选项数量遍历
    	var selectCount = 0;
    	//拿取全部的选项判断有几个选中的
    	$("[name='answerOptions']").each(function(){
    		if ($(this).hasClass('selectLi')) {
    			selectCount++;
    		}
    	});
    	//如果选中的数量大于等于2则提交按钮可选，否则不可选
    	if (selectCount > 1) {
    		$("#submitButton").addClass("sure");
    	} else{
    		$("#submitButton").removeClass("sure");
    	}
    };
    
    /**
     * 计算得分的方法
     * */
    function countScore(){
    	if ($scope.nowTest.examType == "0") {//单选
    		score = score + radioScore;
    	} else if ($scope.nowTest.examType == "1") {//多选
    		score = score + checkboxScore;
    	} else if ($scope.nowTest.examType == "3"){//判断
    		score = score + decideScore;
    	}
    };
    
    /**
     * 保存考试成绩接口
     * */
    function saveTestPaper(){
    	//计算考试用时
    	var elapsedTime = new Date().getTime() - examStartTime;//经过时间（毫秒）
    	modelTestService.setExamTime(elapsedTime);//毫秒数传入

    	
    	//保存错题集用的数据
    	modelTestService.setTestList($scope.testList);
    	modelTestService.setRightCount($scope.rightCount);
    	modelTestService.setErrorCount($scope.errorCount);
    	modelTestService.setScore(score);
    	
    	//关闭定时任务
    	$interval.cancel(stop);
    	
    	//跳转结果页面
    	$state.go("h5.modelTestResult", {});
    };	
    	
	
}]);
