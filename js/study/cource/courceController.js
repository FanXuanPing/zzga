/**
 * 对应页面：课程
 */
app.controller("CourceController", ["$scope","$rootScope", "$state", "OrderService", function($scope,$rootScope, $state, OrderService) {

    //返回课程列表
    $scope.close = function(){
        window.location = BACKURL;
    }

    $scope.goExam = function(){
    	//审验的需要 其他的不需要
    	if($rootScope.type=="1002"){
    		 $state.go("h5.examPlan", {});   //转入学习页面
    	}else{
    		alert("不需要预约考试!");
    	}
       
    }
    
    //跳转模拟考试页面
    $scope.goModelTest = function(){
    	
        $state.go("h5.modelTestChoose", {});   //转入模拟考试页面
    }
    /**
     * 
     * 页面渲染
     */
    $scope.init =  function (){
    	
    	var paramData = {};
    	myLandAjax(ITFC_ADDR.JP_HOME_PAGE, paramData, 
            function(postDataObj, resDataObj) {
                console.log("这里是成功的回调函数 . postDataObj, resDataObj :", postDataObj, resDataObj);
               // $scope.imgBaseUrl = SERVER_IMG_URL;
               //$scope.imgBaseUrl="http://ha.anjia365.com/";
               var plan=resDataObj.plan;
               plan.forEach(function(t,n,th){
               	 var curWare=t.currentWareCount;
               	 var totalWare=t.totalWareCount;
               	 var percent=curWare*100/totalWare;
               	 if(percent>0){
               	 	 t.percent=Math.floor(percent);
               	 }else{
               	 	 t.percent=0;
               	 }
                });
                $scope.plan = resDataObj.plan;
            }
    	);
    };
    
    /**
     * 继续学习 开始学习 按钮
     * @param {Object} personPlanId
     */
    $scope.startToLearn = function (personPlanId,planStatus,licenseType){
    	//学习前提示
    	if("1" == planStatus && "1403" == licenseType){
    		alert("请您于24小时内完成该课程学习，若有疑问请联系客服：400-661-5511！");
    	}
    	
    	myLandAjax(ITFC_ADDR.JP_PLAYER, {"personPlanId" : personPlanId}, 
        function(postDataObj, resDataObj) {
            console.log("这里是成功的回调函数 . postDataObj, resDataObj :", postDataObj, resDataObj);
        	if(resDataObj.isFace == true){
                if (navigator.userAgent.match(/iphone/i)) {
                    $state.go("h5.photographios", {next:"3"}); //转入人脸验证页面
                } else
        		$state.go("h5.photographios", {next:"3"}); //转入人脸验证页面
        	}else {
        		$state.go("h5.study", {});   //转入学习页面
        	}
        },
        function(postDataObj, resErrMsg) {
            console.log("这里是失败的回调函数 . postDataObj, resErrMsg :", postDataObj, resErrMsg);

        }
    	);
    	
    	
    };
    
    /**
     * 跳转到订单支付页面
     * */
    $scope.toPayOrder = function(personPlanId){
        //选定学习计划先调用player接口
       /* myLandAjax(ITFC_ADDR.JP_PLAYER, {personPlanId:personPlanId}, 
            function(postDataObj, resDataObj) {
                console.log("这里是成功的回调函数 . postDataObj, resDataObj :", postDataObj, resDataObj);
                //跳转支付页面
                OrderService.setIsGetOrder(true);
                OrderService.setPersonPlanId(personPlanId);
                $state.go("h5.confirmOrder", {});
            }, 
            function(postDataObj, resErrMsg) {
                console.log("这里是失败的回调函数 . postDataObj, resErrMsg :", postDataObj, resErrMsg);
                alert("选课接口调用异常，请联系客服：400-661-5511！");
            }
        );*/
       //跳转支付页面
        OrderService.setIsGetOrder(true);
        OrderService.setPersonPlanId(personPlanId);
        $state.go("h5.confirmOrder", {});
    };

    $scope.addHeight = function(){
        if ($(".bodyText").height() < 230) {
            $(".bodyText").height(240);
            $("label.text").height(190).addClass("add");
            $(".btnA > i").addClass("fa-angle-up").removeClass("fa-angle-down");
        } else {
            $(".bodyText").height( 60);
            $("label.text").height(30).removeClass("add");
            $(".btnA > i").removeClass("fa-angle-up").addClass("fa-angle-down");
        }

    }
    
    $scope.init();
    
}]);
