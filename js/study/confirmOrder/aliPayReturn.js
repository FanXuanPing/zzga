/**
 * Created by HP on 2017/2/23.
 *  订单确认页面js
 * @author 赵洋
 */
app.controller("AliPayReturnController", ["$scope", "$state","$timeout", function($scope, $state,$timeout) {

    console.log("AliPayReturnController call. init.");
    
    try{
    	//单笔交易查询
        $timeout(function () {
            orderquery();
        }, 3000);
    }catch(err){
    	alert(err);
    }
    
    
    /**
     * 支付后回调函数
     * */
	function orderquery(){
		paramData = {};
	    myLandAjax(ITFC_ADDR.ORDERQUERY, paramData, 
	        function(postDataObj, resDataObj) {
	            console.log("这里是成功的回调函数 . postDataObj, resDataObj :", postDataObj, resDataObj);
	            if (resDataObj.code == 1) {
	            	//支付成功
	            	$state.go("h5.paySuccess", {});
	            } else if (resDataObj.code == 2) {
	            	//支付成功，但系统中订单流水信息丢失！
	            	$state.go("h5.paySuccess", {});
	            }
	        }, 
	        function(postDataObj, resErrMsg) {
	           console.log("这里是失败的回调函数 . postDataObj, resErrMsg :", postDataObj, resErrMsg);
	           if (resErrMsg.message == null || resErrMsg.message == "") {
	               alert("交易查询接口调用异常，请联系客服\n错误信息：" + JSON.stringify(resErrMsg));
	           } else{
	           	   alert(resErrMsg.message);
	           }
	           
	           $timeout(function () {
                    $state.go("h5.cource", {});
                }, 3000);
	           
	        }
	    );
	};

}]);
