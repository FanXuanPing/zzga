/**
 * 对应页面：视频学习、课程树显示页面
 */
var statePro;
//调取后台接口验证并保存图片
var postImg;
app.controller("photographController", ["$scope", "$state","$stateParams",
function($scope, $state,  $stateParams) {
	
	//某个限制页面元素是否显示的标志位
    $scope.isShowMask = false;
    //是否第一次拍照
    $scope.isFristPhoto = false;
    //IOS跳转使用
    statePro = $state; 
    //是否显示人脸注册按钮的标志位
    $scope.isFirst =  $stateParams.next;
    //是否第一次进入,注册还是验证
    var url = ITFC_ADDR.JP_FACETYPE;
    //返回课程列表
    $scope.close = function(){
        window.location = BACKURL
    }
    //返回课程列表
    $scope.back = function(){
         $state.go("h5.cource", {"id" : ""});
    }
    //开始拍照，安卓用
    $scope.startPat = function(w,h){
        $scope.isShowMask = true;
        $(".maskBg").show();
        setTimeout(function(){//防止调用过快
            if(context)
            {
                context.drawImage(video,0,0,widthV,heightV);
                CatchCode(widthV,heightV);
            }
        },200);
    }
    //抓屏获取图像流，并上传到服务器
    function CatchCode(w,h) {
        if(canvas!=null)
        {
            //以下开始编 数据
            var imgData  ;
            var cs = document.getElementById("canvas");    
            var ct = cs.getContext('2d');
                imgData = cs.toDataURL('image/jpeg',1);
            console.log(imgData);
            //将图像转换为base64数据
            //var base64Data = imgData.substr(22); //在前端截取22位之后的字符串作为图像数据
            var base64Data=imgData.substr(imgData.indexOf("base64,")+7)
           //开始异步上传
            //取得图像数据
            submitImageData(base64Data,imgData);
            
        }
    }
    
     function submitImageData(base64Data,imgData){
     	    var url = ITFC_ADDR.JP_FACEVERIFY+"?d="+(new Date());
            myLandAjax(url, {imageBase64Str:base64Data},
                function(postDataObj, resDataObj) {
                   //上传成功
                    console.log(resDataObj);
                    $scope.isShowMask = false;
                    $(".maskBg").hide();
                    //上传成功
                    if (resDataObj.code == "00" ){
                        //跳转
                        alert(resDataObj.message);
                        $state.go("h5.study", {"id" : ""});
                    } else {
                        //失败
                        isPosting = false;
                        $(".caputerImage").hide();
                        $(".modifyImage").show();
                        showModifyImage(imgData);
                    }
                },
                function(postDataObj, resErrMsg) {
                    // 上传失败
                    isPosting = false;
                    $scope.isShowMask = false;
                    $(".maskBg").hide();
                    alert("人脸识别失败，请重新采集！");
                }
            );
     }
    postImg = CatchCode;

   $scope.backPhoto=function(){
   	$(".modifyImage").hide();
   	$(".caputerImage").show();
   }
   var submitFlag=false;
   $scope.submitImage=function(){
   	$scope.isShowMask = true;
    $(".maskBg").show();
   	 if(submitFlag){
   	 	alert("正在识别!");
   	 	return ;
   	 }
   	 submitFlag=true;
   	 $(".maskBg").show(); 
   	 var cMyimg=document.getElementById("canvas_myimg");  
   	 var  imgData = cMyimg.toDataURL('image/jpeg',1);
   	  //将图像转换为base64数据
     //var base64Data = imgData.substr(imgData.indexOf("base64,")+7); //在前端截取22位之后的字符串作为图像数据
       var image=document.getElementById("myimg");
       var image2=document.getElementById("myimg2");
       var base64Data="";
       if(image2.src.indexOf("base64")>0){
       	  base64Data=image2.src.substr(image2.src.indexOf("base64,")+7);
       }else{
       	 if(image.src.indexOf("base64")<0){
	       	return alert("照片数据错误，请重新拍照!")
	     }
       	 base64Data=image.src.substr(image.src.indexOf("base64,")+7);
       }
    //开始异步上传
     //取得图像数据
     var url = ITFC_ADDR.JP_FACEVERIFY+"?d="+(new Date());
     myLandAjax(url, {imageBase64Str:base64Data},
            function(postDataObj, resDataObj) {
            	$scope.isShowMask = false;
                $(".maskBg").hide();
            	submitFlag=false;
               //上传成功
                console.log(resDataObj);
                $scope.isShowMask = false;
                $(".maskBg").hide();
                //上传成功
                if (resDataObj.code == "00" ){
                    //跳转
                    alert(resDataObj.message);
                    $state.go("h5.study", {"id" : ""});
                } else {
                    //失败
                    alert("人脸识别失败，请重新采集或旋转照片！");
                }
            },
            function(postDataObj, resErrMsg) {
            	$scope.isShowMask = false;
                $(".maskBg").hide();
            	submitFlag=false;
                // 上传失败
                isPosting = false;
                $scope.isShowMask = false;
                $(".maskBg").hide();
                alert("人脸识别失败，请重新采集！");
            }
        );
   }
   
   $scope.rotate=function(obj,arr){ 
   	//隐藏图片
   	  $("#myimg").hide();
	  var img = document.getElementById(obj); 
	  if(!img || !arr) return false; 
	  var n = img.getAttribute('step'); 
	  if(n== null) n=0; 
	  if(arr=='left'){ 
	    (n==0)? n=3:n--; 
	  }else if(arr=='right'){ 
	    (n==3)? n=0:n++; 
	  } 
	  img.setAttribute('step',n); 
	  var c = document.getElementById('canvas_'+obj); 
	    if(c== null){ 
	      img.style.visibility = 'hidden'; 
	      //img.style.position = 'absolute'; 
	      c = document.createElement('canvas'); 
	      c.setAttribute("id",'canvas_'+obj); 
	      img.parentNode.appendChild(c); 
	    } 
	    var canvasContext = c.getContext('2d'); 
	    switch(n) { 
	      default : 
	      case 0 : 
	        c.setAttribute('width', img.width); 
	        c.setAttribute('height', img.height); 
	        canvasContext.rotate(0 * Math.PI / 180); 
	        canvasContext.drawImage(img, 0, 0); 
	        break; 
	      case 1 : 
	        c.setAttribute('width', img.height); 
	        c.setAttribute('height', img.width); 
	        canvasContext.rotate(90 * Math.PI / 180); 
	        canvasContext.drawImage(img, 0, -img.height); 
	        break; 
	      case 2 : 
	        c.setAttribute('width', img.width); 
	        c.setAttribute('height', img.height); 
	        canvasContext.rotate(180 * Math.PI / 180); 
	        canvasContext.drawImage(img, -img.width, -img.height); 
	       //canvasContext.drawImage(img, 0, -img.height); 
	        break; 
	      case 3 : 
	        c.setAttribute('width', img.height); 
	        c.setAttribute('height', img.width); 
	        canvasContext.rotate(270 * Math.PI / 180); 
	        canvasContext.drawImage(img, -img.width, 0); 
	        break; 
	    }; 
	    $("#imageContainer").css("height",(c.height+20)+'px');
	     var  imgData = canvasMyimg.toDataURL('image/jpeg',1);
	     var image=document.getElementById("myimg2");
	     var flag=false;
	    if(canvasMyimg.height===0 || canvasMyimg.width===0){
	    	image.src="./img/profile.jpg";
	    	flag=true;
	    }else{
	        image.src=imgData;
	    }
        $("#myimg2").show();
        if(flag){
        	return alert("照片处理错误，请继续旋转!");
	     } 
	}
      
}]);
function showModifyImage(data){
       var image=document.getElementById("myimg");
       image.src="";
       image.src=data;
}
function photoImg(){
	
	if(count>1){
		if(document.getElementById("cameraInput").files){
			if(document.getElementById("cameraInput").files.length<1){
			 alert("当前浏览器不支持拍照，请点击微信右上角在浏览器中打开或是在UC浏览器中打开！");
		    }
		}else{
			alert("当前浏览器不支持拍照，请点击微信右上角在浏览器中打开或是在UC浏览器中打开！");
		}
		
		//将照片img置空
		/*$("#cameraInput").val("");*/
		emptyFile("#cameraInput");
	}
	var re=confirm("请务必本人使用摄像头实时进行拍照验证。如他人替学，或使用已有相册相片，会影响您的审核结果。");
	if(re){
    		//状态标志位验证，true表示有图片正在处理中，此事不用再次拍照
        if ( isPosting == false ){
        	//开启摄像头获取照片
            $("#cameraInput").click();
        }else
           alert("人脸识别中");
	}
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
  
function imgFileChange(){
        var file = this.files[0];
        count++;
        drawOnCanvas(file);
}
        
/**
 * 读取图片，机形判断，旋转图片调用上传
 * @param file
 */
function drawOnCanvas(file) {
	//让遮罩层显示
    $(".maskBg").show(); 
    //H5读文件内容的类
    var reader = new FileReader();
    
    reader.onload = function (e) {
        isPosting = true;
         var dataURL = e.target.result, //取得读到的文件内容
                img = new Image(),
                maxH = 160;
       
        img.onload = function() {
        	 //计算压缩比例
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
            /*var newImageData = canvas.toDataURL(fileType, 1); //重新生成图片      
            img.src=newImageData;  */
          /*  $("#canvas").hide();*/
            emptyFile("#cameraInput");
        	/*//等比压缩
	        if(img.height > maxH) {
	            img.width *= maxH / img.height;
	            img.height = maxH;
	        }
	        canvas.width = img.width;
	        canvas.height = img.height;
	        ctx.clearRect(0, 0, canvas.width, canvas.height);
	        ctx.drawImage(img, 0, 0, img.width, img.height);*/
	       // var dataUrl = cvs.toDataURL('image/jpeg', 0.6);
	        readExif();
        };
        //传入图片文件地址开始执行预设在onload里面的逻辑
        img.src = dataURL;
       
    };
    //传入base64位图片数据，开始执行预设在onload里面的逻辑
    reader.readAsDataURL(file);
    vFile=file;
}

var vImg=null;
var vFile=null;
//获取照片次数
   
function readExif(){
	EXIF.getData(vFile, function(){
		var exif=EXIF.getAllTags(this);
		var ptime=exif.DateTime;
		var pdate=toDate(ptime);
		var date=new Date().getTime();
		if(Math.abs(date-pdate.getTime())<5*60*1000){
	            postImg(); //提交检测人脸
		}else{
			 $(".maskBg").hide(); 
			 isPosting=false;
	         return alert("请用摄像头头拍照，然后提交验证");
	     }
	});
	
}
function toDate(time){
	if(time){
		if(time.length>12){
			var day=time.substring(0,10);
			day=day.substring(0,10).replace(":","-").replace(":","-");
			return new Date(day+time.substring(10));
		}
	}
	//默认返回当前时间
	return new Date();
}


