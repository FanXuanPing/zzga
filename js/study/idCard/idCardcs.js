/**
 * 河南郑州公安-对应页面：登录页
 */

var postZjhm=null;
app.controller("idCardcsController", ["$scope", "$state", "$location","$stateParams","$rootScope",
function($scope, $state, $location,$stateParams,$rootScope) {
	

	$scope.type=$stateParams.type || '1004';
	$scope.idCard=$stateParams.idCard || '123';
    $scope.submitText="确认并提交";
    $scope.submit=true;
	$scope.type=$stateParams.type;
	$scope.name=$stateParams.name;
	$scope.carType=$stateParams.carType;
	$scope.archNo=$stateParams.archNo;
	$scope.score=$stateParams.score;
	$scope.idType=$stateParams.idType;
	$scope.regDate=$stateParams.regDate;
    $scope.areaCode=$stateParams.areaCode;
    $scope.phone=$stateParams.phone;
    $scope.address=$stateParams.address ||"";
    $scope.needAddress=$stateParams.needAddress;
$scope.goBackLast=function(){
		history.go(-1)
}

	$scope.pwd=$stateParams.pwd;
	
    $scope.postZjhmImage=function(){
    	setSubmit();
    	if(!$scope.submit){
    		return ;
    	}
    	setTimeout("postZjhm()",500);
	}
    
    $scope.postZjhmScope=function(){
    	var imgFont=document.getElementById("fontImage");
     	var imgBack=document.getElementById("backImage");
     	if(!(imgFont.src && imgBack.src && imgFont.src.length>24 
     	   && imgBack.src.length>24
	       && imgFont.src.startsWith("data:image") 
	       && imgBack.src.startsWith("data:image"))){
	       	return alert("拍摄身份证照片有误，请重新拍摄!");
	    }
        var fontdata= imgFont.src.substr(imgFont.src.indexOf("base64,")+7);
        var backdata= imgBack.src.substr(imgBack.src.indexOf("base64,")+7);
	    var url = ITFC_ADDR.FACECARDDETECTED+"?d="+(new Date());
	    var param={
	    	"needAddress":$scope.needAddress,
	    	"address":$scope.address,
	    	"phone":$scope.phone,
	    	"imageFontBase64Str":fontdata,
	    	"imageBackBase64Str":backdata,
	    	"zjhm":$scope.idCard,
	    	"type":$scope.type
	    }
	    myLandAjax(url, param,
	            function(postDataObj, resDataObj) {
	            	$scope.isShowMask = false;
	            	submitFlag=false;
	                console.log(resDataObj);
	                //上传成功
	                if (resDataObj.code == "00" ){
                		var birthday=resDataObj.message.birthday;
	                	var idCard=resDataObj.message.idCard;
	                	var sex=resDataObj.message.sex;
	                	var address=resDataObj.message.address;
	                	var mz=resDataObj.message.nation;
	                	$state.go("h5.declaration",{"birthday":birthday,
	                	"idCard":idCard,"name":$scope.name,
	                	"carType":$scope.carType,
	                		"score":$scope.points,"archNo":$scope.archNo,
	                		"phone":$scope.phone,"pwd":$scope.pwd,"idType":$scope.idType,
	                		"idCard":$scope.idCard,"regDate":$scope.regDate,
	                	"sex":sex,
	                	"address":address,
	                	"areaCode":$scope.areaCode,
	                	"type":$scope.type,
	                	"mz":mz,});
	                	return ;
	                }
	                $("#maskBg").hide();
	                resetSubmit();
	                if(resDataObj.code == "11") {
	                	return alert("证件号码与证件照片中号码不一致！");
	                }else if(resDataObj.code == "10") {
	                	return alert("未检测到照片中身份证信息!");
	                }else if(resDataObj.code == "12") {
	                	return alert("保存照片失败，请重新上传!");
	                }else if(resDataObj.code == "13") {
	                	if(resDataObj.message.message){
	                		return alert(resDataObj.message.message);
	                	}
	                	return alert("保存照片失败，请重新上传!");
	                }else{
	                	return alert("采集照片失败，请重新采集!");
	                }
	            },
	            function(postDataObj, resErrMsg) {
//	            	$scope.resetSubmit();
	            	submitFlag=false;
	                // 上传失败
	                isPosting = false;
	                $scope.isShowMask = false;
	                resetSubmit();
	            }
	        );
    }
	postZjhm=$scope.postZjhmScope;
	
}]);



function setSubmit(){
	$("#postImagBtn").html("提交中");
    $("#postImagBtn").attr("disabled","disabled").css("background-color",'#C0C0C0');
}

function resetSubmit(){
	$(".maskBg").hide();
    $("#postImagBtn").text("确认并提交");
    $("#postImagBtn").removeAttr("disabled");
    $("#postImagBtn").css("background-color","#0075B0");
}



function photoImg(){
	if(count>1){
		emptyFile("#cameraInput");
	}
	    	//开启摄像头获取照片
	$("#cameraInput").click();
}

/**
 * 清空file
 * 不能直接val("")
 * @param {Object} selector
 */
function emptyFile(selector) {
    var fi;
    var sourceParent;

    if (selector) {
        fi = $(selector);
        sourceParent = fi.parent();
    }
    else {
        return;
    }
    $("<form id='tempForm'></form>").appendTo(document.body);
    var tempForm = $("#tempForm");
    tempForm.append(fi);
    tempForm.get(0).reset();
    sourceParent.append(fi);
    tempForm.remove();
}

/**
 * 点击拍照
 * @param {Object} orention
 */
function takePhoto(oren){
	orention=oren;
	photoImg();
}
function showImg(file){
	// $(".maskBg").show(); 
    //H5读文件内容的类
    var reader = new FileReader();
    reader.onload = function (e) {
        var dataURL = e.target.result; //取得读到的文件内容
        //传入图片文件地址开始执行预设在onload里面的逻辑
        var results=dataURL.split(";");
        var fType=results[0].substr(5);
        
       var img=getImage();
       /* img.src = dataURL;*/
       var fileType=fType;
       var image = new Image();  
       image.src = dataURL; 
       image.onload = function() { //创建一个image对象，给canvas绘制使用  
       	    var rate=0.5;
        	  var maxVal=300;
        	/*
        	 if(maxVal>maxWidth){
        	 	rate= 1-(maxVal-maxWidth)/maxWidth; 
        	 }*/
        	 var canvas = document.getElementById("canvas"); 
        	 var max=this.width>this.height?this.width:this.height;
        	 if(max>maxVal){
        	 	if(this.width>this.height){
	        	 	canvas.width=maxVal;
	        	 	canvas.height=maxVal*this.height/this.width;
	        	 }else{
	        	 	canvas.height=maxVal;
	        	 	canvas.width=maxVal*this.width/this.height;
	        	 }
        	 }else{
        	 	 canvas.width = this.width;
                 canvas.height =this.height;
        	 }
            var ctx = canvas.getContext('2d');  
            ctx.drawImage(this, 0, 0, canvas.width, canvas.height);  
            var newImageData = canvas.toDataURL(fileType, 1); //重新生成图片      
            img.src=newImageData;  
            $("#canvas").hide();
            emptyFile("#cameraInput");
            detectShowSubmitBtn();
        }  

       
        
    };
    //传入base64位图片数据，开始执行预设在onload里面的逻辑
    reader.readAsDataURL(file);
}

/**
 * 获取当前需要显示image
 */
function getImage(){
	 var img=null;
	 if("1"===orention){
	 	img=document.getElementById("fontImage");
	 	$(".firDEl").show();
	 }else{
	    img=document.getElementById("backImage");
	    $(".twoDEl").show();
	 }
	 $(img).prev().hide();
	 $(img).show();
	 return img;
}
/**
 * 檢測是否顯示提交按鈕
 */
function detectShowSubmitBtn(){
	var img1=document.getElementById("fontImage");
	if(img1.src && img1.src.length>24 
	 && img1.src.startsWith("data:image") ){
		showSubmitBtn();
	}else{
		hideSubmitBtn();
	}
}


/**
 * 顯示提交按鈕
 */
function showSubmitBtn(){
//	$("#postImagBtn").show();
	
}
/**
 * 隱藏提交按鈕
 */
function hideSubmitBtn(){
	$("#postImagBtn").hide();
	
}

/**
 * 清除一張照片
 * @param {Object} orent
 */
function clearImge(orent,obj){
	$(".textDiv").html("");
	$(".shifou").html("")
	orention=orent;
	var img=getImage();
	img.src="";
	$(img).hide();
	$(img).prev().show();
	detectShowSubmitBtn();
	$(obj).hide();
}




