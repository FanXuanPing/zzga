/**
 * 对应页面：测试课习题练习页面
 */
app.controller("CourceTestController", ["$scope", "$state","CourceTestService", function($scope, $state,CourceTestService) {
    
    console.log("CourceTestController call. init.");
    
    /**
     * 初始加载区
     * */
    
    //试题列表
    $scope.testList = {};
    
    /**
     * 调取接口拿取试题数据
     * */
    var url = ITFC_ADDR.JP_PLAYEREXAMINFO;//接口url
    var paramData = {};//传参的json对象
    paramData.chapterId = CourceTestService.getChapterId();
    paramData.cj = new Date().getTime();//时间戳
    paramData.examIds = CourceTestService.getExamIds();
    myLandAjax(url, paramData, 
        function(postDataObj, resDataObj) {
            console.log("这里是成功的回调函数 . postDataObj, resDataObj :", postDataObj, resDataObj);
            $scope.testList=resDataObj.examInfo;
        }, 
        function(postDataObj, resErrMsg) {
            console.log("这里是失败的回调函数 . postDataObj, resErrMsg :", postDataObj, resErrMsg);
            $state.go("h5.study", {});
        }
    );
    
    //总测试题数量
    $scope.totalCount = $scope.testList.length;
    
    //是否主动刷新的标志位
    $scope.isSetTimeCalled = false;
    
    //当前第几题
    $scope.nowTestNumber = 0;
    
    //当前题目
    $scope.nowTest = {};
    
    //选项前面的字母标记
    $scope.optionLetter = ['A','B','C','D','E','F'];
    
    //是否显示答案
    $scope.isShowAnswer = false;
    
    //是否显示重做按钮
    $scope.isShowReButton = false;
    
    //正确答案列表
    $scope.rightAnswer = "";
    
    //加载初始试题
    refreshTest();
    
    /**
     * js函数区
     * */
    
    /**
     * 点击上一题按钮事件
     * */
    $scope.toLastTest = function(){
    	//答案区隐藏
    	$scope.isShowReButton = false;
    	//当前题数减一
    	$scope.nowTestNumber = $scope.nowTestNumber-1;
    	//刷新试题
    	refreshTest();
    }
    
    /**
     * 点击下一题按钮事件
     * */
    $scope.toNextTest = function(){
    	//先判断当前试题状态，答案展示状态下要求重新作答并刷新试题状态
    	if ($scope.isShowReButton) {
    		alert("请重作该题");
    		this.clickResetButton();
    	} else{
    		//不显示重做按钮但是显示答案表示该题已经做过，直接跳下一题
    		if ($scope.isShowAnswer) {
    			$scope.jumpNextTest();
    		} else{
    			//判断当前题是否多选题，单选/判断题要求作答，多选题走提交按钮事件
	    		if ($scope.nowTest.examType == '1') {//多选
	    			this.clickSubmitButton();
	    		} else{//单选/判断
	    			alert("请作答");
	    		}
    		}
    		
    	}
    }
    
    /**
     * 点击选项的事件
     * */
    $scope.clickAnswerOption = function(answerOptionId){
    	//算出当前选项的id以便进行行为记录
    	var idNum = answerOptionId.substr(answerOptionId.length-1,answerOptionId.length);
    	
    	//先判断当前试题是是单选还是多选
    	//多选的逻辑
    	if ($scope.nowTest.examType == '1') {
    		//拿取选项
    		var e = $("#"+answerOptionId);
    		//如果该选项已经选中则移除选中标记
    		if ($(e).hasClass('selectLi')) {
    			$(e).removeClass('selectLi');
    			//选择记录
    			$scope.nowTest.detail[idNum].selectLi = false;
    		} else{//未选中则添加选中标记
    			$(e).addClass('selectLi');
    			//选择记录
    			$scope.nowTest.detail[idNum].selectLi = true;
    		}
    		isShowSubmitButton();
    	} else{//单选和判断题的逻辑
    		//单选和判断提题直接验证选中的是否是正确答案
    		//如果是正确答案则条到下一题
    		if ($("#"+answerOptionId).attr("isAnswer") == "1") {
    			//答题记录
    			$scope.testList[$scope.nowTestNumber].isShowAnswer = true;
    			$scope.isShowAnswer = true;
    			//回答正确显示答案区并且3秒后跳转下一题
    			var nowNum = $scope.nowTestNumber;
    			setTimeout(function(){
    				if (nowNum == $scope.nowTestNumber) {
    					$scope.isSetTimeCalled = true;
    					$scope.jumpNextTest();
    				}
    			},3000);
    		} else{
    			//答案错误则显示答案区
    			$scope.isShowAnswer = true;
    			//显示重做按钮
    			$scope.isShowReButton = true;
    			//选择记录
    			$scope.nowTest.detail[idNum].selectLi = true;
    		}
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
	    				//显示重做按钮
    					$scope.isShowReButton = true;
	    				return false;
	    			}
	    		}else{//未选中的选项
	    			//判断当前选项是否正确答案
	    			if ($(this).attr("isAnswer") == "1") {
	    				//未选中的选项是正确答案，显示答案区，函数停止执行
	    				$scope.isShowAnswer = true;
	    				//显示重做按钮
    					$scope.isShowReButton = true;
	    				return false;
	    			}
	    		}
	    	});
	    	//将提交按钮置于不可用
	    	$("#submitButton").removeClass("sure");
	    	//验证无误则跳转下一题
	    	if (!$scope.isShowAnswer) {
	    		$scope.testList[$scope.nowTestNumber].isShowAnswer = true;
	    		$scope.isShowAnswer = true;
	    		//回答正确显示答案区并且3秒后跳转下一题
    			var nowNum = $scope.nowTestNumber;
    			setTimeout(function(){
    				if (nowNum == $scope.nowTestNumber) {
    					$scope.isSetTimeCalled = true;
    					$scope.jumpNextTest();
    				}
    			},3000);
	    	}
    	}
    }
    
    /**
     * 点击重做按钮的事件
     * */
    $scope.clickResetButton = function(){
    	//隐藏答案区
    	$scope.isShowAnswer = false;
    	//隐藏重做按钮
    	$scope.isShowReButton = false;
    	//移除全部选项的选中标志
    	$("[name='answerOptions']").each(function(){
    		$(this).removeClass("selectLi");
    	});
    	//清除选项记录
    	for (var i=0;i < $scope.nowTest.detail.length;i++) {
    		$scope.nowTest.detail[i].selectLi = false;
    	}
    	//提交按钮不可用
    	$("#submitButton").removeClass("sure");
    }
    
    /**
     * 点击返回箭头的事件
     * */
    $scope.goBack = function(){
    	$state.go("h5.study", {});
    }
    
    /**
     * 跳转到下一题
     * */
    $scope.jumpNextTest = function(){
    	//答案区隐藏
    	$scope.isShowReButton = false;
    	//当前题数加一
    	$scope.nowTestNumber = $scope.nowTestNumber+1;
    	//如果当前题号大于等于总题数表示练习完成跳转
    	if ($scope.nowTestNumber < $scope.totalCount){
    		//刷新试题
    		refreshTest();
    	} else{
    		//保存学时
    		treePlayHandle();
    	}
    	
    }
    
    /**
     * 初始化试题的函数
     * */
    function refreshTest(){
    	//提取当前试题
    	$scope.nowTest = $scope.testList[$scope.nowTestNumber];
    	//数据替换
    	$scope.nowTest.content = $scope.nowTest.content.replace("</br>","");
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
    	
    	//延时调用需强制刷新相关函数
    	if( $scope.isSetTimeCalled) {
    		try {
	    		$scope.$apply("nowTest");
	    		$scope.$apply("rightAnswer");
	    		$scope.$apply("isAnswer");
	    	} catch(e) {
	    		console.info("apply");
	    	}
    		$scope.isSetTimeCalled = false;
    	}
    	
    	
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
     * 保存学时的函数
     * */
    function treePlayHandle() {
        var url = ITFC_ADDR.JP_TREEPLAYHANDLE;
        myLandAjax(url, {handleType:1},
            function(postDataObj, resDataObj) {
                //跳回学习页面
                $state.go("h5.study", {});
                //得到下级数据
                /*playVidoArr = resDataObj.message;
                var code = playVidoArr.code; //节点code
                alert(resDataObj);
                if (code == 11) {
                	alert("code=11");
                } else if(code == 10){
                	//调取checkPlanNode
                	alert("code=10");
                	//checkPlanNode();
                }*/
            },
            function(postDataObj, resErrMsg) {
                // console.log("这里是失败的回调函数 . postDataObj, resErrMsg :", postDataObj, resErrMsg);
                $state.go("h5.study", {});
            }
        )
    }
    
}]);
