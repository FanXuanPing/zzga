/**
 * 对应页面：模拟考试页面
 */
app.controller("ExamController", ["$scope", "$state", "$stateParams","$interval","$timeout","ExamService",function($scope, $state,$stateParams,$interval,$timeout,ExamService) {
    
    console.log("ExamController call. init.");
    
    /**
     * 初始加载区
     * */
    
//  alert("及格分"+$stateParams.score);
//  alert("考试次数"+$stateParams.count);
//  alert("试卷id"+$stateParams.testPaperId);
//	var examData = {}; 
		
    //页面类型，0表示考试页面，1表是错题集页面
    $scope.pageType = $stateParams.pageType
    
    //试题列表
    $scope.testList = {};
    
    //考试时间
    $scope.testTime = {};
    
    //倒计时显示的分钟
    $scope.mm = "00";
    
    //倒计时显示的秒数
    $scope.ss = "00";
    
    //考试开始时间
    $scope.examStartTime = {};
    
    //试题Id列表
    var examIdList = {};
    
    //personPlanId
    var personPlanId = "";
    
    //总测试题数量
    $scope.totalCount = {};
    
    //正确答案统计
    $scope.rightCount = 0;
    
    //错误答案数统计
    $scope.errorCount = 0;
    
    //错题集展示标志
    $scope.isShowErrorList = false;
    

	/**
	 * 根据页面类型加载页面数据
	 * */
	if ($scope.pageType == 1) {
		$scope.testList = ExamService.getTestList();
		$scope.isShowErrorList = true;//是否展示错题列表
	    $scope.rightCount = ExamService.getRightCount();
	    $scope.errorCount = ExamService.getErrorCount();
	    $scope.totalCount = $scope.testList.length;//总测试题数量
	} else{
		/*var dataroot="js/study/exam/exam.json"; 
		$.getJSON(dataroot, function(data){ 
			examData=data.message; 
			$scope.testList = examData.examList;
	    	$scope.testTime = new Date(new Date().getTime() + (examData.testTime)*60*1000);
	    	$scope.examStartTime = new Date().getTime();//时间戳
	    	examIdList = examData.examIdList;
	    	$scope.totalCount = $scope.testList.length;//总测试题数量
	    	$scope.isShowErrorList = false;//是否展示错题列表
	    	refreshTest();
		});*/
		
		//调取接口拿取试题数据
	    var url = ITFC_ADDR.JP_STARTTESTPAPER;//接口url
	    var paramData = {};//传参的json对象
	    paramData.examScore = $stateParams.score;//及格分
	    paramData.examCount = $stateParams.count;//
	    paramData.testPaperId = $stateParams.testPaperId;//试卷id
	    myLandAjax(url, paramData, 
	        function(postDataObj, resDataObj) {
	            console.log("这里是成功的回调函数 . postDataObj, resDataObj :", postDataObj, resDataObj);
	            //对该学员是否做过考试进行判断
	            if (resDataObj.passExam == '1') {//已经考试通过了
	            	//给与提示并跳回学习页面
	            	alert(resDataObj.examResult);
	            	$state.go("h5.study", {});
	            } else if(resDataObj.passExam == '0'){//没有做过考试
	            	$scope.testList = resDataObj.examList;
	            	$scope.testTime = new Date(new Date().getTime() + (resDataObj.testTime)*60*1000);
	            	$scope.examStartTime = new Date().getTime();//时间戳
	            	examIdList = resDataObj.examIdList;
	            	$scope.totalCount = $scope.testList.length;//总测试题数量
	            	$scope.isShowErrorList = false;//是否展示错题列表
	            	personPlanId = resDataObj.personPlanId;
	            }
	        }, 
	        function(postDataObj, resErrMsg) {
	            console.log("这里是失败的回调函数 . postDataObj, resErrMsg :", postDataObj, resErrMsg);
	            $state.go("h5.study", {});
	        }
	    );
	}
    
    //当前第几题
    $scope.nowTestNumber = 0;
    
    //选项前面的字母标记
    $scope.optionLetter = ['A','B','C','D','E','F'];
    
    //是否显示答案
    $scope.isShowAnswer = false;
    
    //答案展示的正确答案列表
    $scope.rightAnswer = "";
    
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
    	if ($scope.pageType == 0) {
	    	//计算预计的考试时间到当前时间之间的时间差
		  	this.timeDiffer = $scope.testTime - new Date();
		  	//如果时间差为负数表示考试已经结束强制交卷
		  	if (this.timeDiffer < 0) {
		  		alert("考试时间到!");
	      		saveTestPaper();
	      	}
	      	//计算剩余的分钟数 
			$scope.mm = parseInt(this.timeDiffer / 1000 / 60 % 60, 10);
			//位数不足两位的前面加0
			$scope.mm = $scope.mm+"";
			if($scope.mm.length == 1){
				$scope.mm = "0"+$scope.mm;
			}
			//计算剩余的秒数  
			$scope.ss = parseInt(this.timeDiffer / 1000 % 60, 10);
			//位数不足两位的前面加0
			$scope.ss = $scope.ss+"";
			if($scope.ss.length == 1){
				$scope.ss = "0"+$scope.ss;
			}
    	}else if($scope.pageType == 1){
    		
    	}
  	}, 1000);
    
    /**
     * 点击上一题按钮事件
     * */
    $scope.toLastTest = function(){
    	//当前题数减一
    	$scope.nowTestNumber = $scope.nowTestNumber-1;
    	//初始化试题
    	refreshTest();
    }
    
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
    	if ($scope.testList[$scope.nowTestNumber].examType == '1') {//多选的逻辑
    		//拿取选项
    		var e = $("#"+answerOptionId);
    		
    		if ($(e).hasClass('selectLi')) {//如果该选项已经选中则移除选中标记
    			$(e).removeClass('selectLi');
    			//删除选项行为记录
    			$scope.testList[$scope.nowTestNumber].detail[idNum].selectLi = false;
    		} else{//未选中则添加选中标记
    			$(e).addClass('selectLi');
    			//添加选项行为记录
    			$scope.testList[$scope.nowTestNumber].detail[idNum].selectLi = true;
    		}
    		//多选专用，每次点击选项后用于判断提交按钮是否可用
    		isShowSubmitButton();
    	} else{//单选和判断题的逻辑
    		//单选和判断提题直接验证选中的是否是正确答案
    		//添加选项行为记录
    		$scope.testList[$scope.nowTestNumber].detail[idNum].selectLi = true;
    		$scope.testList[$scope.nowTestNumber].isShowAnswer = true;
    		
    		if ($("#"+answerOptionId).attr("isAnswer") == "1") {//如果是正确答案则条到下一题
    			//正确记录
    			$scope.rightCount = $scope.rightCount+1;
    			$scope.isShowAnswer = true;
    			//记录是否回答正确
    			$scope.testList[$scope.nowTestNumber].isRight = true;
    		} else{//错误答案这显示答案区
    			//错误记录
    			$scope.errorCount = $scope.errorCount+1;
    			//答案错误则显示答案区
    			$scope.isShowAnswer = true;
    			//记录是否回答正确
    			$scope.testList[$scope.nowTestNumber].isRight = false;
    		}
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
    					$scope.testList[$scope.nowTestNumber].isRight = false;
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
    					$scope.testList[$scope.nowTestNumber].isRight = false;
	    				return false;
	    			}
	    		}
	    	});
	    	//将提交按钮置于不可用
	    	$("#submitButton").removeClass("sure");
	    	//行为记录
	    	$scope.testList[$scope.nowTestNumber].isShowAnswer = true;
	    	//验证无误则跳转下一题
	    	if (!$scope.isShowAnswer) {
	    		//正确记录
    			$scope.rightCount = $scope.rightCount+1;
    			//记录是否回答正确
    			$scope.testList[$scope.nowTestNumber].isRight = true;
    			$scope.isShowAnswer = true;
	    	}
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
    		$state.go("h5.examResult", {});
    	} else{
    		//非错题集状态下跳回学习页面
    		$state.go("h5.cource", {});
    	}
    	
    }
    
    /**
     * 点击交卷按钮的事件
     * */
    $scope.handExam = function(){
    	//计算当前有几道题没有做，有未做题给与提示
    	var noAnswerCount = 0;
    	$($scope.testList).each(function(){
    		if (this.isShowAnswer) {
    			
    		} else{
    			noAnswerCount = noAnswerCount + 1;
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
    }
    
    /**
     * 跳转到下一题(没了跟点击下一题事件合并了)
     * */
    /*function jumpNextTest(){
    	//答案区隐藏
    	$scope.isShowAnswer = false;
    	//当前题数加一
    	$scope.nowTestNumber = $scope.nowTestNumber+1;
    	//如果当前题号等于总题数表示联系完成跳转
    	if ($scope.nowTestNumber < $scope.totalCount){
    		//刷新试题
    		refreshTest();
    	} else{
    		//保存学时
    		treePlayHandle();
    	}
    }*/
    
    /**
     * 初始化试题的函数
     * */
    function refreshTest(){
    	//对题面里的特殊符号进行处理
    	$scope.testList[$scope.nowTestNumber].content = $scope.testList[$scope.nowTestNumber].content.replace("<br/>","");
    	
    	//是否显示答案
    	if ($scope.testList[$scope.nowTestNumber].isShowAnswer) {
    		$scope.isShowAnswer = $scope.testList[$scope.nowTestNumber].isShowAnswer;
    	} else{
    		$scope.isShowAnswer = false;
    	}
    	
    	//拿取正确答案
    	//给正确答案集合赋空值
    	$scope.rightAnswer = "";
    	//拿取选项列表
    	var detail = $scope.testList[$scope.nowTestNumber].detail;
    	//对选项列表进行遍历获取正确答案的英文标号并拼入正确答案变量
    	for(var i=0;i<detail.length;i++){
    		if (detail[i].isAnswer == "1") {
    			$scope.rightAnswer = $scope.rightAnswer+$scope.optionLetter[i]+"，";
    		}
    	}
    	//将正确答案最后的逗号切掉
    	$scope.rightAnswer = $scope.rightAnswer.substr(0,$scope.rightAnswer.length-1);
    }
    
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
    }
    
    /**
     * 保存考试成绩接口
     * */
    function saveTestPaper(){
    	//计算考试用时
    	var examEndTime = new Date().getTime();//时间戳
    	var elapsedTime = examEndTime - $scope.examStartTime;//经过时间（毫秒）
    	ExamService.setExamTime(elapsedTime);//毫秒数传入
    	elapsedTime = parseInt(elapsedTime/1000);//经过时间（秒），仅保留整数丢弃小数部分
    	
    	//拼接examIdList字符串
    	var examIds = "";
    	for (var i=0;i<examIdList.length;i++) {
    		examIds = examIds+examIdList[i]+",";
    	};
    	examIds = examIds.substr(0,examIds.length-1);//切掉最后的逗号
    	
    	//遍历获取答案全部选项
    	var answers = "{";
    	var selectIds = "";//定义存放选中选项的id
    	//对试题列表进行遍历
    	$($scope.testList).each(function(){
    		selectIds = "";//初始化存放选中选项的id
    		//对试题中的选项进行过滤
    		$(this.detail).each(function(){
    			if (this.selectLi) {
    				//将选中的选项提取出来
    				selectIds = selectIds+this.detailId+"#";
    			}
    		});
    		answers = answers+this.examId+":'"+selectIds+"',";
    	});
    	//将最后的逗号切掉
    	answers = answers.substr(0,answers.length-1);
    	answers = answers+"}";
    	
    	//拼接发往后台的数据信息
    	var url = ITFC_ADDR.JP_SAVETESTPAPER;//接口url
    	var paramData = {};//传参的json对象
    	paramData.testPaperId = $stateParams.testPaperId;//试卷id
    	paramData.testTime = elapsedTime;//经过时间
    	paramData.examIdList = examIds;//
    	paramData.answers = answers;//考试答案
    	paramData.personPlanId = personPlanId;
    	
    	//保存错题集用的数据
    	ExamService.setTestList($scope.testList);
    	ExamService.setRightCount($scope.rightCount);
    	ExamService.setErrorCount($scope.errorCount);
    	
    	//关闭定时任务
    	$interval.cancel(stop);
    	
    	
    	
    	
    	//将考试信息发往后台相关接口
    	myLandAjax(url,paramData,
            function(postDataObj, resDataObj) {
            	console.log("这里是成功的回调函数 . postDataObj, resDataObj :", postDataObj, resDataObj);
                //跳回学习页面
                ExamService.setScore(resDataObj.score);
    			ExamService.setPassScore(resDataObj.passScore);
    			ExamService.setExamScore($stateParams.score);//及格分
	    		ExamService.setExamCount($stateParams.count);//
	    		ExamService.setTestPaperId($stateParams.testPaperId);//试卷id
    			$state.go("h5.examResult", {});
            },
            function(postDataObj, resErrMsg) {
                console.log("这里是失败的回调函数 . postDataObj, resErrMsg :", postDataObj, resErrMsg);
                $state.go("h5.study", {});
            }
        );
    }
    

    

}]);
