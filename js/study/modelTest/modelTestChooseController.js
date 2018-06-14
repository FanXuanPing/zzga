/**
 * 对应页面：模拟考试选择页面
 */
app.controller("modelTestChooseController", ["$scope", "$state","modelTestService",function($scope, $state,modelTestService) {
    
    console.log("modelTestChooseController call. init.");

    /**
     * 初始加载区
     * */

    //类型
    //7小车c1c2c3；1201客运；1202货运；1002危险品；1003教练员；2201网约车
	$scope.catType = 7;

	//科目
	//1科目一；4科目四；20从业资格证；10继续教育
	$scope.subjectType = 1;

	//练习方式
	//1顺序练习；2随机联系；0模拟考试
	$scope.examType = "";
	
	//标签页面
	$scope.labelType = "jsz";


  	
    /**
     * js函数区
     * */
    
    /**
     * 点击返回箭头的事件
     * */
    $scope.goBack = function(){
    	//返回学习页面
    	$state.go("h5.cource", {});
    };
    
    //点击驾驶标签页切换页面修改默认值
    $scope.checkLabelType = function(labelTypeVal){
    	$scope.labelType = labelTypeVal;
    	//标签页面变换的时候修改默认值
    	if (labelTypeVal == 'jsz') {
    		$scope.catType = 7;
    		$scope.subjectType = 1;
    	} else if(labelTypeVal == 'zgz') {
    		$scope.catType = 1201;
    		$scope.subjectType = 20;
    	}
    }
    
    
    //点击修改类型
    $scope.checkCatType = function(catTypeId){
    	$scope.catType = catTypeId;
    };
    
    //点击修改科目
    $scope.checkSubjectType = function(subjectTypeId){
    	$scope.subjectType = subjectTypeId;
    };
    
    //点击考试类型
    $scope.checkExamType = function(examTypeId){
    	$scope.examType = examTypeId;
    	//保存考试类型和页面类型
    	modelTestService.setExamType(examTypeId);
    	modelTestService.setPageType(0);
    	//判断选得是什么+
    	if (examTypeId == 1) {//顺序练习
    		sequencePractice();
    	} else if (examTypeId == 2) {//随机练习
    		randomPractice();
    	} else if (examTypeId == 0) {//模拟考试
    		practiceTest();
    	}
    };
    
    //调取顺序练习接口拿取数据
    function sequencePractice(){
    	var url = ITFC_ADDR.SEQUENCEPRACTICE;//接口url
    	var paramData = {};//传参的json对象
    	paramData.catType = $scope.catType;//类别体系
    	paramData.subjectType = $scope.subjectType;//科目类别
    	myLandAjax(url, paramData, 
	        function(postDataObj, resDataObj) {
	            console.log("这里是成功的回调函数 . postDataObj, resDataObj :", postDataObj, resDataObj);
	            if (resDataObj.examIdList == "") {
	            	alert("未获取到考题信息！");
	            } else{
	            	modelTestService.setExamIdList(resDataObj.examIdList);//保存试题id列表
	            	$state.go("h5.modelTest", {});
	            }
	            
	        }, 
	        function(postDataObj, resErrMsg) {
	            console.log("这里是失败的回调函数 . postDataObj, resErrMsg :", postDataObj, resErrMsg);
	            //alert("顺序练习接口调用失败");
	        }
	    );
    };
    
    //调取随机练习接口拿取数据
    function randomPractice(){
    	var url = ITFC_ADDR.RANDOMPRACTICE;//接口url
    	var paramData = {};//传参的json对象
    	paramData.catType = $scope.catType;//类别体系
    	paramData.subjectType = $scope.subjectType;//科目类别
    	myLandAjax(url, paramData, 
	        function(postDataObj, resDataObj) {
	            console.log("这里是成功的回调函数 . postDataObj, resDataObj :", postDataObj, resDataObj);
	            if (resDataObj.examIdList == "") {
	            	alert("未获取到考题信息！");
	            } else{
	            	modelTestService.setExamIdList(resDataObj.examIdList);//保存试题id列表
	            	$state.go("h5.modelTest", {});
	            }
	            
	        }, 
	        function(postDataObj, resErrMsg) {
	            console.log("这里是失败的回调函数 . postDataObj, resErrMsg :", postDataObj, resErrMsg);
	            //alert("顺序练习接口调用失败");
	        }
	    );
    };
    
    //调取模拟考试接口拿取数据
    function practiceTest(){
    	var url = ITFC_ADDR.PRACTICETEST;//接口url
    	var paramData = {};//传参的json对象
    	paramData.catType = $scope.catType;//类别体系
    	paramData.subjectType = $scope.subjectType;//科目类别
    	myLandAjax(url, paramData, 
	        function(postDataObj, resDataObj) {
	            console.log("这里是成功的回调函数 . postDataObj, resDataObj :", postDataObj, resDataObj);
	            if (resDataObj.examIdList.length == 0) {
	            	alert("未获取到考题信息！");
	            } else{
	            	modelTestService.setExamIdList(resDataObj.examIdList);//保存试题id列表
		            modelTestService.setPassScore(resDataObj.passScore);//保存及格分
		            modelTestService.setTestTime(resDataObj.testTime);//保存考试限制时长，单位分钟
		            modelTestService.setDecideScore(resDataObj.decideScore);//保存判断题分值
		            modelTestService.setCheckboxScore(resDataObj.checkboxScore);//保存多选题分值
		            modelTestService.setRadioScore(resDataObj.radioScore);//保存单选题分值
		            $state.go("h5.modelTest", {});
	            }
	            
	        }, 
	        function(postDataObj, resErrMsg) {
	            console.log("这里是失败的回调函数 . postDataObj, resErrMsg :", postDataObj, resErrMsg);
	            //alert("顺序练习接口调用失败");
	        }
	    );
    };
 
}]);
