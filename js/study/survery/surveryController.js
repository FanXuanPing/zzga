


app.controller("surveryController", ["$scope", "$state", 
function($scope, $state) {
	 //选项前面的字母标记
    $scope.optionLetter = ['A','B','C','D','E','F'];
	//当前题目
    $scope.nowSurvery = {};
    /**
     * 所有的调查问卷
     */
    $scope.allSurvery=[];
    //当前题号
    $scope.curNum=0;
    //总共
    $scope.totalNum=0;
    
    /**
     * 存放  每个问卷题目的答案
     * 回答完所有的问卷，提交答案
     * key：题目id
     * value:答案id
     */
    $scope.suveryAnswer={};
    
    $scope.totalNum=$scope.allSurvery.length;
     

     //获取问卷数据
    myLandAjax(ITFC_ADDR.GETSURVERY, null, 
        function(postDataObj, resDataObj) {
            console.log("这里是成功的回调函数 . postDataObj, resDataObj :", postDataObj, resDataObj);
            $scope.allSurvery=JSON.parse(resDataObj.message);
            $scope.nowSurvery=$scope.allSurvery[0];
            $scope.nowSurvery.examType="0";
            $scope.totalNum=$scope.allSurvery.length;
        },
        function(postDataObj, resErrMsg) {
            console.log("这里是失败的回调函数 . postDataObj, resErrMsg :", postDataObj, resErrMsg);
        }
    );
    //点击答案
    $scope.clickAnswer=function(questionId){
    	//单选，多选
    	if($scope.nowSurvery.examType=="0"){
    		//单选
    		$(".selectLi").removeClass("selectLi");
    		$('#'+questionId).addClass("selectLi");
    		$scope.addOption("0","0",$scope.nowSurvery.id,questionId);
    	}else{
    		if($('#'+questionId).hasClass("selectLi")){
    			$('#'+questionId).removeClass("selectLi");
    			$scope.addOption("1","1",$scope.nowSurvery.id,questionId);
    		}else{
    			$('#'+questionId).addClass("selectLi");
    			$scope.addOption("1","0",$scope.nowSurvery.id,questionId);
    		}
    	}
    	//一秒后自动跳往下一题
    	
    }
    
    //点击上一题
    $scope.preSuvery=function(){
    	if($scope.curNum-1>=0){
    		$scope.curNum=$scope.curNum-1;
			$scope.nowSurvery=$scope.allSurvery[$scope.curNum];
    		$scope.nowSurvery.examType="0";
    		//显示  答案
    		var qid=$scope.suveryAnswer["q_"+$scope.nowSurvery.id];
    	    if(qid){
	    			 $scope.answerId=qid;
	    	}
    	}
    }
    //点击下一题
    $scope.nextSuvery=function(){
    	if($scope.curNum+1<=$scope.totalNum){
    		if($scope.suveryAnswer["q_"+$scope.nowSurvery.id]){
    			$scope.nowSurvery=$scope.allSurvery[$scope.curNum+1];
	    		$scope.nowSurvery.examType="0";
	    		$scope.curNum=$scope.curNum+1;
	    		
	    		var qid=$scope.suveryAnswer["q_"+$scope.nowSurvery.id];
	    		if(qid){
	    			 $scope.answerId=qid;
	    		}
    	       
    		}else{
    			alert("请选择答案");
    		}
    	}
    	$scope.showSubmitBtn();  	
    }
    
    $scope.showSubmitBtn=function(){
    	if($scope.curNum==$scope.totalNum){
    		
    	}
    }
    //答完所有问卷  点击提交
    $scope.submitSuvery=function(){
    	/**
    	 * 检查所有的问题是否有答案
    	 */
    	var pro=Object.getOwnPropertyNames($scope.suveryAnswer);
    	if(pro.length<$scope.totalNum){
    		return alert("请回答完所有的问题");
    	}
    	console.log($scope.suveryAnswer);
	    var postData={
	    	answer:JSON.stringify($scope.suveryAnswer)
	    };
	    myLandAjax(ITFC_ADDR.SUBMITSURVERY, postData, 
	        function(postDataObj, resDataObj) {
	            console.log("这里是成功的回调函数 . postDataObj, resDataObj :", postDataObj, resDataObj);
	            var url1 = ITFC_ADDR.JP_CHECKPLANNODE;
		        myLandAjax(url1, {isModify:1},
		            function(postDataObj, resDataObj) {
		                //跳回学习页面
		                $state.go("h5.study", {});
		            },
		            function(postDataObj, resErrMsg) {
		                $state.go("h5.study", {});
		            }
		        )
	        },
	        function(postDataObj, resErrMsg) {
	            console.log("这里是失败的回调函数 . postDataObj, resErrMsg :", postDataObj, resErrMsg);
	            alert(resErrMsg);
	        }
	    );
    }
    /**
     * 将答案存到 suveryAnswer
     * type:0 ,单选，1多选，
     * move:  0 新增，1： 删除
     */
    $scope.addOption=function(type,move,qid,aid){
    	var val=$scope.suveryAnswer["q_"+qid];
    	if(move=="0"){
    		//新增
    		if(type=="0"){
    			$scope.suveryAnswer["q_"+qid]=aid;
    		}else if(type="1"){
    			if(val){
    				val.endsWith(",")?(val=val+aid):(val=val+","+aid);
    				$scope.suveryAnswer["q_"+qid]=val;
    			}else{
    				$scope.suveryAnswer["q_"+qid]=aid;
    			}
    		}
    		
    	}else if(move=="1"){
    		//删除
    		if(type=="0"){
    			$scope.suveryAnswer["q_"+qid]="";
    		}else if(type="1"){
                var i=val.indexOf(aid);
                val=val.substring(0,i)+val.substring(i+aid.length);
                val.replace(",,",",");
                $scope.suveryAnswer["q_"+qid]=val;
    		}
    	}
    }
    
    
     /**
     * 点击返回箭头的事件
     * */
    $scope.goBack = function(){
    	$state.go("h5.study", {});
    }
     //返回课程列表
    $scope.close = function(){
        window.location = BACKURL;
    }
}]);
    
    
