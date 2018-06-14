/**
 * Created by HP on 2017/2/23.
 *  订单确认页面js
 * @author 赵洋
 */
app.controller("confirmOrderController", ["$scope", "$state","OrderService","$timeout","$cookieStore", function($scope, $state,OrderService,$timeout,$cookieStore) {

    console.log("confirmOrderController call. init.");
    
    //订单详情
    $scope.orderInfo = {};
    
    //课程价格
    $scope.price = {};
    
    //发票的价格 
    $scope.invoiceAmt = {};
    
    //总价格
    $scope.totalAmt = {};
    
    //登录方式，wx微信授权入口，wap手机网页入口
    //$scope.loginType = IndexService.getLoginType();
    $scope.loginType = "";
    if (isWeiXin()) {
        $scope.loginType = "wx";
    } else{
        $scope.loginType = "wap";
    }
    
    //系统设置是否提供发票的标志位；0不支持发票，1支持发票
    $scope.invoiceFlag = 0;
    
    //是否需要发票,0不需要，1需要
    $scope.isNeedInvoice = 0;
	
	//发票地址的省名称
	$scope.invoiceProvinceName = null;
	
	//发票上填写的地市名称
	$scope.invoiceCityName = null;
	
	//发票抬头
	$scope.invoiceHead = null;
	
	//发票收件人
	$scope.invoiceReceiver = null;
	
	//发票收货详细地址
	$scope.invoiceAddress = null;
	
	//发票邮编
	$scope.invoicePostCode = null;
	
	//发票联系方式
	$scope.invoicePostMobile = null;
	
	//发票纳税人识别码
	$scope.invoiceNsrsbh = null;
	
	//发票类型0个人1单位，默认个人
	$scope.invoicType = "0";
	
	//personPlan的结束时间
	//$scope.endDate = OrderService.getEndDate();
	
	//支付按钮状态，true表示可以点击，false表示点击无效
	$scope.isPayBtn = true;
	
	//调取微信支付相关的数据
	//微信公众号id
	$scope.appId = null;
	
	//时间戳
	$scope.timeStamp = null;
	
	//随机字符串
	$scope.nonceStr = null;
	
	//订单详情扩展字符串
	$scope.package = null;
	
	//签名方式
	$scope.signType = null;
	
	//签名
	$scope.paySign = null;
	//调取微信支付相关的数据
    
    /**
     * 根据转入标志位判断从何处提取数据
     * isGetOrder=true表示从接口获取数据，isGetOrder=false表示从service中获取数据
     * @author 赵洋
     * @create 2017-2-24
     * */
    if (OrderService.getIsGetOrder()) {
    	//调用后台接口拿取订单数据
	    myLandAjax(ITFC_ADDR.OPENCOURSE, {"personPlanId" : OrderService.getPersonPlanId()}, 
	        function(postDataObj, resDataObj) {
	            console.log("这里是成功的回调函数 . postDataObj, resDataObj :", postDataObj, resDataObj);
	            $scope.orderInfo = resDataObj;
	            /*if (resDataObj.invoice_flag == "1") {//判断是否提供发票
	            	$scope.invoiceFlag = 1;
	            	if (resDataObj.invoiceSelected == "1") {//判断是否勾选发票
	            		//需要发票
	            		$scope.isNeedInvoice = 1;//是否需要发票的标志位
	            		$scope.invoiceHead = resDataObj.invoice.name;//发票抬头
	            		$scope.invoiceReceiver = resDataObj.invoice.receiver;//发票收件人
	            		$scope.invoiceAddress = resDataObj.invoice.address;//发票详细地址
	            		$scope.invoicePostCode = resDataObj.invoice.post_code;//发票邮编
	            		$scope.invoicePostMobile = resDataObj.invoice.post_mobile;//发票练习方式
	            		$scope.invoiceNsrsbh = resDataObj.invoice.nsrsbh;//纳税人识别码
	            		if (resDataObj.invoice.nsrsbh!=null && resDataObj.invoice.nsrsbh!="") {
	            			//有纳税人识别号表示单位发票
	            			$scope.invoicType = "1";
	            		}
	            	}
	            }*/
	            computePrice();//计算价格
	        }, 
	        function(postDataObj, resErrMsg) {
	            console.log("这里是失败的回调函数 . postDataObj, resErrMsg :", postDataObj, resErrMsg);
	        }
	    );
    } else{
    	//从service总获取数据
    	/*$scope.orderInfo = OrderService.getOrderInfo();//拿取订单详情
    	$scope.invoiceFlag = OrderService.getInvoiceFlag();//拿取是否支持发票的标志位
    	$scope.isNeedInvoice = OrderService.getIsNeedInvoice();//拿取是否需要发票标志
    	computePrice();//计算价格
	    
	    $scope.invoiceProvinceName = OrderService.getInvoiceProvinceName();//发票地址的省名称
	    $scope.invoiceCityName = OrderService.getInvoiceCityName();//发票上填写的地市名称
	    
	    $scope.invoiceHead = OrderService.getInvoiceHead();//发票抬头
	    $scope.invoiceReceiver = OrderService.getInvoiceReceiver();//发票收件人
	    $scope.invoiceAddress = OrderService.getInvoiceAddress();//发票收货详细地址
	    $scope.invoicePostCode = OrderService.getInvoicePostCode();//邮寄发票的邮政编码
	    $scope.invoicePostMobile = OrderService.getInvoicePostMobile();//发票收件人联系方式
	    $scope.invoiceNsrsbh = OrderService.getInvoiceNsrsbh();//发票纳税人识别码
	    $scope.invoicType = OrderService.getInvoicType();//发票类型*/
    };
    
	//返回首页
    $scope.goBack = function(){
        if (confirm("我要去现场学习\n"
            +"请到郑州市车管所紫荆山服务站\n"
            +"学习咨询电话55129609\n"
            )) 
        {
            window.location.href = "http://j.map.baidu.com/_diGF";
        } else{
            window.location.href = "http://j.map.baidu.com/_diGF";
        }
        //$state.go("h5.cource", {});
    };
    
    /**
     * 调用支付订单的接口
     * @author 赵洋
     * @create 2017-2-23
     */
    $scope.payment = function(){
   		
    	//判断当前按钮是否可以点击
    	if (!$scope.isPayBtn) {
    		return;
    	}
    	
    	//在选择发票之后对发票相关信息进行确认
    	/*if ($scope.isNeedInvoice == 1) {
    		if ($scope.invoiceProvinceName == null) {
	    		alert("请选择您的地址");
	    		return;
	    	}
    		if ($scope.invoiceHead == null) {
	    		alert("请输入发票的抬头");
	    		return;
	    	}
    		if ($scope.invoiceReceiver == null) {
	    		alert("请填写收件人");
	    		return;
	    	}
    		if ($scope.invoiceAddress == null) {
	    		alert("请完善您的地址");
	    		return;
	    	}
    		if ($scope.invoicePostCode == null) {
	    		alert("请填写邮编");
	    		return;
	    	}
    		if(!(/^[1-9][0-9]{5}$/.test($scope.invoicePostCode))){
				alert("请填写正确的邮编");
				return ;
			}
    		if ($scope.invoicePostMobile == null) {
	    		alert("请填写联系方式");
	    		return;
	    	}
    		if(!(/^1[34578]\d{9}$/.test($scope.invoicePostMobile))){
				alert("请填写正确的联系方式");
				return ;
			}
    		//对纳税人识别号的验证
    		if ($scope.invoicType == "1") {
    			if ($scope.invoiceNsrsbh == null) {
    				alert("请填写纳税人识别号");
					return ;
    			}
    		}
    		
    	}*/
    	
    	//将按钮设置为不可点
    	$scope.isPayBtn = false;
   		
   		//根据登录入口的不同选择不同调用方式
   		if ($scope.loginType == "wx") {//微信公众号发起支付
   			//调用后台支付接口
	        var paramData = {};//传参的json对象
	        paramData.personPlanId = OrderService.getPersonPlanId();//personPlanId
	    	paramData.orderId = $scope.orderInfo.orderId;//订单id
	    	paramData.invoiceFlag = $scope.isNeedInvoice;//是否需要发票
	    	//如果需要发票参数中加入发票相关信息
	    	if ($scope.isNeedInvoice == 1) {
	    		paramData.name = $scope.invoiceHead;//发票抬头
	    		paramData.receiver = $scope.invoiceReceiver;//发票收件人
	    		paramData.city = $scope.invoiceProvinceName+$scope.invoiceCityName;//发票地市
	    		paramData.address = $scope.invoiceAddress;//发票详细地址
	    		paramData.postCode = $scope.invoicePostCode;//发票邮编
	    		paramData.postMobile = $scope.invoicePostMobile;//发票联系方式
	    		if($scope.invoicType == "1"){
	    			paramData.nsrsbh = $scope.invoiceNsrsbh;//发票纳税人识别码
	    		}
	    	}
		    myLandAjax(ITFC_ADDR.PAYMENT, paramData, 
		        function(postDataObj, resDataObj) {
		            console.log("这里是成功的回调函数 . postDataObj, resDataObj :", postDataObj, resDataObj);
	   				
		          	//alert("发起支付接口返回数据=="+JSON.stringify(resDataObj));
		          	$scope.appId = resDataObj.appId;
		          	$scope.timeStamp = resDataObj.timeStamp;
		          	$scope.nonceStr = resDataObj.nonceStr;
		          	$scope.package = resDataObj.package;
		          	$scope.signType = resDataObj.signType;
		          	$scope.paySign = resDataObj.paySign;
		          	
		          	//调用微信支付
		          	if (typeof WeixinJSBridge == "undefined"){
					   if( document.addEventListener ){
					       document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
					   }else if (document.attachEvent){
					       document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
					       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
					   }
					}else{
					   onBridgeReady();
					}
					
		        }, 
		        function(postDataObj, resErrMsg) {
		            console.log("这里是失败的回调函数 . postDataObj, resErrMsg :", postDataObj, resErrMsg);
		            $scope.isPayBtn = true;
		        }
		    );
   		} else{//支付宝发起支付
			
   			//拼接跳转的url
   			var url = ITFC_ADDR.PAYMENT+"?invoiceFlag="+$scope.isNeedInvoice;
   			//如果需要发票参数中加入发票相关信息
	    	if ($scope.isNeedInvoice == 1) {
	    		//拼接跳转的url
	    		url = url+"&name="+$scope.invoiceHead+"&receiver="+$scope.invoiceReceiver
	    			+"&city="+$scope.invoiceProvinceName+$scope.invoiceCityName+"&address="+$scope.invoiceAddress
	    			+"&postCode="+$scope.invoicePostCode+"&postMobile="+$scope.invoicePostMobile;
	    		//判断并拼接纳税人识别码
	    		if($scope.invoicType == "1"){
	    			url = url+"&nsrsbh="+$scope.invoiceNsrsbh;
	    		}
	    		//两次编码解决乱码问题
	    		url = encodeURI(encodeURI(url));
	    	}
   			location.href = url;
   		}
        
    };
    
    
    /**
     * 点击选择发票邮寄地市的时间
     * @author 赵洋
     * @create 2017-2-27
     * */
    $scope.selectInvoiceCity = function(){
    	OrderService.setIsGetOrder(false);
    	OrderService.setAddressSelectType(1);//设置跳转参数
    	saveDataToService();//保存已有信息
    	$state.go("h5.addressselect", {});
    };
    
	
    //返回课程列表
    $scope.close = function(){
        $state.go("h5.cource", {});
    };
    
    /**
     * 保存参数到service
     * @author
     * @create 2017-2-24
     * */
    function saveDataToService(){
    	OrderService.setIsGetOrder(false);//设置数据状态无需调用接口获取订单信息
    	OrderService.setOrderInfo($scope.orderInfo);//保存订单信息
    	OrderService.setInvoiceFlag($scope.invoiceFlag);//保证是否提供发票的信息
    	OrderService.setIsNeedInvoice($scope.isNeedInvoice);//保存是否需要发票标志位
    	//发票相关信息
    	OrderService.setInvoiceHead($scope.invoiceHead);//发票抬头
    	OrderService.setInvoiceReceiver($scope.invoiceReceiver);//发票收件人
    	OrderService.setInvoiceAddress($scope.invoiceAddress);//发票详细地址
    	OrderService.setInvoicePostCode($scope.invoicePostCode);//发票收件邮编
    	OrderService.setInvoicePostMobile($scope.invoicePostMobile);//发票收件人联系方式
    	OrderService.setInvoiceNsrsbh($scope.invoiceNsrsbh);//发票纳税人识别号
    	OrderService.setInvoicType($scope.invoicType);//发票类型
    };
    
    /**
     * 调用微信的公众号支付功能
     * */
    function onBridgeReady(){
    	paramData = {};
    	paramData.appId = $scope.appId;			//公众号名称，由商户传入   
    	paramData.timeStamp = $scope.timeStamp;	//时间戳，自1970年以来的秒数   
    	paramData.nonceStr = $scope.nonceStr;	//随机串
    	paramData.package = $scope.package;		//订单详情扩展字符串
    	paramData.signType = $scope.signType;	//微信签名方式
    	paramData.paySign = $scope.paySign;		//微信签名 
    	//alert("调用微信支付方法传递参数==="+JSON.stringify(paramData));
	   WeixinJSBridge.invoke(
	       'getBrandWCPayRequest', paramData,
	       function(res){
	       		//alert("微信支付回调信息==="+JSON.stringify(res));
	           /*if(res.err_msg == "get_brand_wcpay_request:ok" ) {	// 使用以上方式判断前端返回,微信团队郑重提示：res.err_msg将在用户支付成功后返回    ok，但并不保证它绝对可靠。
	           	//支付成功
	           } else if(res.err_msg == "get_brand_wcpay_request:cancel" ){
	           	//支付中断
	           } else if(res.err_msg =
	                = "get_brand_wcpay_request:fail" ){
	           	//支付失败
	           }*/
	           	//无论微信返回什么参数均调用后台的支付确认的接口进行支付确认
	           	/*$timeout(function () {
					orderquery();
				}, 3000);*/
				
				// 对微信返回数据进行判断，支付失败弹出错误提示，支付成功跳转payReturn页面查询订单支付情况
				if (res.err_msg == "get_brand_wcpay_request:fail") {
					alert("微信支付发起失败，请将失败原因截图后联系客服人员处理！\n"
					+ "失败代码：" + res.err_code
					+ "\n失败原因：" + res.err_desc);
					// 隐藏支付按钮防止点起来没完
					$(".paybtn").hide();
				} else{
				    // 跳转支付查询页面
					$state.go("h5.aliPayReturn", {});
				}
				
	       }
	   );
	};
	  /**
     * 点击是否需要发票的事件
     * @author 赵洋
     * @create 2017-2-24
     * */
    $scope.clickInvoice = function(){
    	if ($scope.isNeedInvoice == 0) {
    		$scope.isNeedInvoice = 1;
    	} else if($scope.isNeedInvoice == 1){
    		$scope.isNeedInvoice = 0
    	}
    	computePrice();
    };

	
	/**
	 * 计算价格的方法
	 * @author 范宣萍
	 * @create 2017-3-2
	 * */
	function computePrice(){
		$scope.price = returnFloat($scope.orderInfo.price/100);//拿取格式化后的价格
	    $scope.invoiceAmt = returnFloat($scope.orderInfo.invoice_amt/100);//拿取格式化后的发票价格
	    //根据是否需要发票计算总价格
	    if ($scope.isNeedInvoice == 0) {
	    	$scope.totalAmt = $scope.price;
	    	if ($scope.isNeedCoupon == 0) {
	    		 $scope.totalAmt=$scope.price;
	    	} else if($scope.isNeedCoupon == 1){
	    		$scope.totalAmt=$scope.price-5;
	    	}
	    } else if($scope.isNeedInvoice == 1){
	    	$scope.totalAmt = returnFloat((parseInt($scope.orderInfo.price)+parseInt($scope.orderInfo.invoice_amt))/100);
	    	if ($scope.isNeedCoupon == 0) {
	    		$scope.totalAmt = returnFloat((parseInt($scope.orderInfo.price)+parseInt($scope.orderInfo.invoice_amt))/100)
	   		} else if($scope.isNeedCoupon == 1){
	    		$scope.totalAmt = returnFloat((parseInt($scope.orderInfo.price)+parseInt($scope.orderInfo.invoice_amt))/100)-5;
	    	}
	    }
	};
	
	/**
     * 支付后回调函数
     * */
	function orderquery(){
		paramData = {};
		//paramData.flowNum = "";
		//paramData.payType = "weixinJSAPI";			//支付类型，默认为weixinJSAPI
		//调取用户状态和计划详情
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
	            $scope.isPayBtn = true;
	        }
	    );
	};
	
	//限定只能输入数字
    $scope.phoneOnlyNumber = function(){
    	//对输入的电话号码的最后一位进行正则验证限定必须是数组
    	if(/^[0-9]$/.test($scope.invoicePostMobile.substr($scope.invoicePostMobile.length-1,1))){
    		
    	}else{//删掉最后一个字符
    		$scope.invoicePostMobile = $scope.invoicePostMobile.substr(0,$scope.invoicePostMobile.length-1);
    	}
    	//去空格
    	$scope.invoicePostMobile = $scope.invoicePostMobile.replace(/\s+/g,"");
    	//限定输入不能大于11个字符
    	if ($scope.invoicePostMobile.length > 11) {
    		$scope.invoicePostMobile = $scope.invoicePostMobile.substr(0,$scope.invoicePostMobile.length-1);
    	}
    };
    
    //格式化价格,结尾保留两位小数,不足的补0
    function returnFloat(value){
	 var value=Math.round(parseFloat(value)*100)/100;
	 var xsd=value.toString().split(".");
	 if(xsd.length==1){
	 value=value.toString()+".00";
	 return value;
	 }
	 if(xsd.length>1){
	 if(xsd[1].length<2){
	  value=value.toString()+"0";
	 }
	 return value;
	 }
	};
	
	//判断当前打开网页的是否是微信浏览器
    function isWeiXin(){
        var ua = window.navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
            return true;
        }else{
            return false;
        }
    }

}]);
