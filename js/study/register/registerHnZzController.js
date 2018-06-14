var flag=true;
var registerSuc=null;
var postRegist=null;
app.controller("RegisterController", ["$scope", "$state", "$location","$stateParams",
function($scope, $state, $location,$stateParams) {
	$scope.submit=true;
	$scope.areaName=$stateParams.areaName;
	$scope.learnType=$stateParams.learnType;
	$scope.title=$stateParams.title || "注册页面";
	$scope.flagSubmit=0;
	$scope.idType="A";
	$scope.drivingType="A1";
	$scope.areaCode="410101";
	$scope.learnType=$stateParams.learnType;
	console.log($scope.learnType);
	$scope.goBack=function(){
		$state.go("h5.typeLogin");
	}
	registerSuc=$scope.goBack;
	/**
	 * 确认信息
	 * 显示提示然后提交
	 */
	$scope.doInfoConfirm=function(){
		if(!$scope.submit){
			return;
		}
		disabledSubmit();
	     /* if($scope.flagSubmit==1){
	        return alert("请勿重复注册！");
	      }*/
		  //校验
		  if(!$scope.checkRegisterOptions()){
		  	enabledSubmit();
		  	return ;
		  	
		  }
		 
		  
		  setTimeout("postRegist()",500);
		
	
	
	}
	
	$scope.registerAjax=function(){
		var paramData={
			areaCode:$scope.areaCode,
			ac:$scope.areaCode,
			area:$scope.areaCode,
			idType:$scope.idType,
			idCard:$scope.idCard,
			name:$scope.name,
			drivingType:$scope.drivingType,
			points:$scope.points,
			tel:$scope.tel,
			archNo:$scope.archNo,
			learnType:$scope.learnType,
			psw:$scope.psw 
		};
		var parObj = {
		        "type" : 2,
		        "value" : paramData
		};
		flag=true;
       // myLandAjaxCommonCrossDomain(ITFC_ADDR.RegisterToCMTS, parObj, removeWebox,"removeWebox");	
	   myLandAjax(ITFC_ADDR.REGISTERURL,paramData,function(postDataObj, resDataObj){
	   		enabledSubmit();
	   	   if(resDataObj.code=="00"){
	   	    	alert("您已完成注册，系统将对您的信息进行审核，请耐心等待");
	   	   	   registerSuc();
	   	   	   return ;
	   	   }else if(resDataObj.code=="01"){
	   	   	//重复
	   	   	 return alert("学员信息已存在，无需重复注册");
	   	   }else if(resDataObj.code=="02"){
	   	   	//未知
	   	   	 return alert(resDataObj.msg);
	   	   }else if(resDataObj.code=="03"){
	   	   	//未知
	   	   	 return alert(resDataObj.msg);
	   	   }else if(resDataObj.code=="04"){
	   	   	  //未配置注册地址
	   	   	 return alert(resDataObj.msg);
	   	   }else if(resDataObj.code=="05"){
	   	   	  //异常
	   	   	return  alert(resDataObj.msg);
	   	   }else{
	   	   	 return alert(resDataObj.msg);
	   	   }
	   },function(postDataObj, resDataObj){
	   	   alert(resDataObj);
	   	   enabledSubmit();
	   });
	}
	
	postRegist=$scope.registerAjax;
	
	$scope.checkRegisterOptions=function(){
		    var idCard=$scope.idCard;
		    if(idCard=="" || typeof(idCard)=="undefined"){
		    	alert("请填写身份证件号码!");
		    	return false;
		    }
			
			if ( !(/(^\d{15}$)|(^\d{17}([0-9]|X|x)$)/.test(idCard)) ){
				alert("您输入的身份证号码不正确");
		    	return false;
			}
			
			
	    var name=$scope.name;
		    if(name=="" || typeof(name)=="undefined"){
		    	alert("请填写姓名!");
		    	return false;
		    }
		    if(!( /^[\u4e00-\u9fa5]+$/.test(name))){
		    	alert("您输入的姓名不符合规范");
		    	return false;
		    }
		    var tel=$scope.tel;
		    if(tel=="" || typeof(tel)=="undefined"){
		    	alert("请填写手机号码!");
		    	return false;
		    }
		    if(!(/^1[3|4|5|8][0-9]\d{4,8}$/.test(tel))){
		    	alert("您输入的手机号格式不正确");
		    	return false;
		    }
	        //1、A1、A2、A3、B1、B2 通过 ，2、分数1-8通过
			var driverType=$scope.drivingType;
			if("A1A2A3B1B2C1C2C3C4C5".indexOf(driverType, 0)<0){
				alert("根据您所持有驾驶证的准驾车型，无须参加审验，如有疑问，请咨询当地交警大队!");
				return false;
			}
			var archNo=$scope.archNo;
			if(archNo=="" || typeof(archNo)=="undefined"){
		    	alert("请填写驾驶证档案编号！");
		    	return false;
		    }
			if(!(/\b\d{12}\b/.test(archNo))){
				alert("您输入的驾驶证档案编号不正确!");
				return false;
			}
//			var license=$scope.license;
//			if($scope.learnType=="1001"){
//				if(license==""||typeof(license)=="undefined"){
//					alert("请输入驾驶证状态！");
//					return false;
//				};
//				
//			}
//			
			
			var points=$scope.points;
			if(points=="" || typeof(points)=="undefined"){
		    	alert("请选择上周期记分！");
		    	return false;
		    }
			if($scope.learnType=="1006"&&points>0){
				return true;
				}else if(points <=0){
					alert("您的驾驶证记分必须大于0！");
				return false;
				}else{
					return true;
				}
			
      }
	
	
	
	
	
	//显示告知
	$scope.showNoticeDiv=function(){
		$("#modalNoticeDiv").modal("show");
	}
	$scope.hideNoticeDiv=function(){
		$("#modalNoticeDiv").modal("hide");
	}
	//$scope.showNoticeDiv();
}]);
function removeWebox(code,ajaxPara){
	if(!flag){
		return ;
	}
	enabledSubmit();
	flag=false;
	if(code.mes){
		var	msg=code.mes;
		if(msg=="registerOK"){
			alert("您已完成注册，系统将对您的信息进行审核，请耐心等待");
			registerSuc();
		}else if(msg=="idCardEmpty"){
			alert("身份证为空");
		}else if(msg=="authCodeError"){
			alert("验证码错误");
			$("#authCode").val("");
		}else if(msg=="isRegister"){
			alert("学员信息已存在，无需重复注册");
		}
	}else if("00"==code){
		var jsonObj = eval("("+ajaxPara+")");
		if(jsonObj.mes=="registerOK"){
			alert("您已完成注册，系统将对您的信息进行审核，请耐心等待");
			registerSuc();
		}else if(jsonObj.mes=="idCardEmpty"){
			alert("身份证为空");
		}else if(jsonObj.mes=="authCodeError"){
			alert("验证码错误");
			$("#authCode").val("");
		}else if(jsonObj.mes=="isRegister"){
			alert("学员信息已存在，无需重复注册");
		}
	}else{
		alert("注册出错，请联系客服!");
	}
}


function disabledSubmit(){
	    $(".btn_submit").attr("disabled","disabled");
		$(".btn_submit").css("background-color","#C0C0C0");
		$(".btn_submit").text("注册中");

}
function enabledSubmit(){
	    $(".btn_submit").attr("disabled","false");
		$(".btn_submit").css("background-color","#00a8f3");
		$(".btn_submit").text("注册");
}
