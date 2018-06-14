/**
 * 河南郑州公安-对应页面：登录页
 */
app.controller("addressController", ["$scope", "$state", "$location","$stateParams",
function($scope, $state, $location,$stateParams) {
	
	$scope.address=$stateParams.address || "暂无邮寄地址!";
	$scope.phone=$stateParams.phone || "暂无手机号码!";
	
	$scope.enFocus1=function(){
		$("#addressIpt").val("");
	};
	$scope.enFocus2=function(){
		$("#userPhone").val("");
	};
	//提交修改
	$scope.addressConfirm=function(){
		regiseBtn();
		
		
		var val=$("#addressIpt").val();
		var phone=$("#userPhone").val() || $scope.phone;
		if(val==""|| typeof(val) ==="undefined" || val=="暂无邮寄地址!"){
		  	alert("请填写邮递地址!");
		  	recover();
		  	return false;
		  }
		
		if(phone==""|| typeof(phone) ==="undefined"  || val=="暂无手机号码!"){
		  	alert("请填手机号码！");
		  	recover();
		  	return false;
		  }
		if(!(/^1[34578]\d{9}$/.test(phone))){
			alert("请填写正确的手机号码！");
			recover();
		  	return false;
		}
		  var paramData={
		  	address:$("#addressIpt").val(),
		  	phone:phone
		  };
		  
		  myLandAjax(ITFC_ADDR.UPDATEPERSONADDRESS, paramData,
		  function(postDataObj, resDataObj){
		  	   if(resDataObj=="10"){
		  	   	     alert("长时间未操作，请重新登陆！");
		  	   	     $state.go("h5.typeLogin", {});
		  	   	     return ;
		  	   }else{
		  	    	alert("修改成功");
		  	        $state.go("h5.cource", {});
		  	   }
		  	   
		  },
		  function(postDataObj, resDataObj){
		  	   alert("修改失败");
		  });
	}
	
}]);

function regiseBtn(){
	$(".addressCim").css("background-color","#CCCCCC").text("提交中");
	$(".addressCim").attr("disabled","disabled");
}
 function recover(){
 	$(".addressCim").css("background-color","#3986F5").text("确认");
	$(".addressCim").removeAttr("disabled");
 }
 
 
