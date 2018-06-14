/**
 * 对应页面：确认订单、推送学时页面
 */
app.controller("ConfirmController", ["$scope", "$state", function($scope, $state) {
    
    
    
    console.log("ConfirmController call. init.");
    $scope.imgBaseUrl = "http://ha.anjia365.com/";
    console.log($scope.imgBaseUrl);
   // var url = CTX + "/json/confirm/faceImags.json";
  	myLandAjax(ITFC_ADDR.JP_FACEPHOTO,{}, 
        function(postDataObj, resDataObj) {
            console.log("这里是成功的回调函数 . postDataObj, resDataObj :", postDataObj, resDataObj);
            console.log(resDataObj);
            $scope.dataArr=resDataObj;
        }, 
        function(postDataObj, resErrMsg) {
            console.log("这里是失败的回调函数 . postDataObj, resErrMsg :", postDataObj, resErrMsg);
            //alert(resErrMsg);
        }
    );
    /**
     * 确认推送学时
     */
    $scope.pushConfirm = function() {
    	//h5/checkPlanNode.do?isModify=1 保存学时
    	//var pushUrl=CTX + "/json/confirm/checkPlanNode1.json";
    	//加上判断若少于六张照片不可以推送
    	if($scope.dataArr.length<6){
    		alert("照片少于六张，不可以推送！");
    		return;
    	}
    	var paramData={"isModify":"1"};
    	myLandAjax(ITFC_ADDR.JP_CHECKPLANNODE, paramData, 
        function(postDataObj, resDataObj) {       	
            console.log("这里是成功的回调函数 . postDataObj, resDataObj :", postDataObj, resDataObj);
            //判断是否是js节点
            if(resDataObj.code=="12" && resDataObj.jsMethod=="showAfterLearn()"){
                  alert(resDataObj.url);
                  $scope.goNextJs();
            }else if( resDataObj.text && resDataObj.text.indexOf("成功")  === -1) {
                alert(resDataObj.text);
                return;
            }else{
                $state.go("h5.confirmsucess", {});
            }
            
        }, 
        function(postDataObj, resErrMsg) {       	
            console.log("这里是失败的回调函数 . postDataObj, resErrMsg :", postDataObj, resErrMsg);
            $state.go("h5.study", {});
        }
    );
    }

    $scope.goNextJs=function(){
       var url = ITFC_ADDR.JP_CHECKPLANNODE;
        myLandAjax(url, {isModify:'1'},
            function(postDataObj, resDataObj) {
                if ( resDataObj.code == "11" && resDataObj.code == "20") {
                    alert(resDataObj.text);
                } else if(resDataObj.code=="12"&&resDataObj.jsMethod=="showCurUserPhoto()"){
                    //继续推送学时
                    $state.go("h5.confirm", {});
                }else if(resDataObj.code=="12"&&resDataObj.jsMethod=="showAfterLearn()"){
                    //alert节点
                }else if(resDataObj.code=="14"){
                    //推送学时成功
                   alert(resDataObj.message);
                   return  $scope.goback();
                }else if(resDataObj.code=="15"){
                    //转向考试节点
                    $state.go("h5.exam", {score:resDataObj.score,count:resDataObj.count,testPaperId:resDataObj.testPaperId,pageType:0});
                }else{
                    alert("节点异常请联系管理员！");
                    $scope.goback();
                }

            },
            function(postDataObj, resErrMsg) {
               // console.log("这里是失败的回调函数 . postDataObj, resErrMsg :", postDataObj, resErrMsg);
            }
        );
}


    $scope.go=function(){
        $state.go("h5.confirm", {});
    }

    $scope.goback=function(){
        $state.go("h5.study", {});
    }
 /**
  * 返回学习
  */
    $scope.reStudy=function(){
    	$state.go("h5.cource", {});
    }


    //返回课程列表
    $scope.close = function(){
        // $state.go("h5.cource", {"id" : ""});
        window.location = BACKURL
    }
}]);

