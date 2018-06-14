/**
 * 河南郑州公安-对应页面：登录页
 */
app.controller("addressBfController", ["$scope", "$state", "$location","$stateParams",
function($scope, $state, $location,$stateParams) {
	
	
	
	
	$scope.idCard=$stateParams.idCard;
	$scope.name=$stateParams.name;
	$scope.carType=$stateParams.carType;
	$scope.score=$stateParams.score;
	$scope.archNo=$stateParams.archNo;
	$scope.pwd=$stateParams.pwd;
	$scope.idType=$stateParams.idType;
	$scope.regDate=$stateParams.regDate;
	$scope.type=$stateParams.type;
	$scope.areaCode=$stateParams.areaCode;
	$scope.address=$stateParams.address || "暂无邮寄地址!";
	$scope.phone=$stateParams.phone || "暂无手机号码!";
	$scope.phoneOld=$stateParams.phone || "";
    $scope.addressOld=$stateParams.address || "";
	$scope.needAddress="1";
	console.log($scope.name)
	$scope.enFocus1=function(){
		$("#addressIpt").val("");
	};
	$scope.enFocus2=function(){
		$("#userPhone").val("");
	};
	
	$scope.dxFun=function(){
		    if("1"==$scope.needAddress){
		    	$(".xz").css("color","");
				$(".xz input[type=text]").removeAttr("disabled");
				return ;
		    }else{
		    	$("#userPhone").val("暂无手机号");
				$(".xz").css("color","#CCCCCC");
				$(".bz").css("color","#CCCCCC");
				$(".xz input[type=text]").attr("disabled","disabled");
				return ;
		    }
	}
	//提交修改
	$scope.addressConfirm=function(){
		if($scope.needAddress=="1"){
			//检查输入
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
			
		}else{
			$scope.address=$scope.addressOld;
			$scope.phone=$scope.phoneOld;
		}
		$state.go("h5.idCardTs",{
    		"idCard":$scope.idCard,"name":$scope.name,
    		"carType":$scope.carType,"score":$scope.score,
    		"archNo":$scope.archNo,"phone":$scope.phone,
    		"pwd":$scope.pwd,"idType":$scope.idType,
	        "regDate":$scope.regDate,
    	    "type": $scope.type,
    	    "areaCode": $scope.areaCode,
    	    "needAddress":$scope.needAddress,
    	    "postAddress":$scope.address
           /* "addressInput":$scope.address,
            "phoneInput":$scope.phone*/
    	});
	}
	
}]);

 
 
