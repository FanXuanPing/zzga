/**
 * 保存订单和发票信息的service
 * @author 赵洋
 * @create 2017-2-23
 * */
app.factory("OrderService", ["$http", function ($http) {
	
	var factory = {};
	
	//是否通过后台接口拿取订单信息。true表示调用后台接口拿取订单信息，false表示从本service中获取订单信息
	var isGetOrder = true;
	
	//personPlanId
	var personPlanId = {};
	
	//订单详情
	var orderInfo = {};
	
	//是否需要发票标志位，0不需要，1需要
	var isNeedInvoice = {};
	
	//地市选择类型：0区域科目考试选择地市，1发票地市选择
	var addressSelectType = {};
	
	//发票地址的省名称
	var invoiceProvinceName = null;
	
	//发票上填写的地市名称
	var invoiceCityName = null;
	
	//发票抬头
	var invoiceHead = null;
	
	//发票收件人
	var invoiceReceiver = null;
	
	//发票收货详细地址
	var invoiceAddress = null;
	
	//发票邮寄邮政编码
	var invoicePostCode = null;
	
	//发票联系方式
	var invoicePostMobile = null;
	
	//personPlan结束时间
	var endDate = null;
	
	//系统设置是否提供发票状态位；0不支持发票，1支持发票
	var invoiceFlag = null;
	
	//纳税人识别码
	var invoiceNsrsbh = null;
	
	//发票类型0个人1单位，默认个人
	var invoicType = "0";
	
	/**
     * 获取调取数据的标志位
     */
    factory.getIsGetOrder= function() {
        return this.isGetOrder;
    };
    
    /**
     * 保存是否通过后台接口拿取订单信息的标志位
     * 
     * @param newIsGetOrder{boolean} 新的标志位
     */
    factory.setIsGetOrder = function(newIsGetOrder) {
        this.isGetOrder = newIsGetOrder;
    };
    
    /**
     * 获取personPlanId
     * */
    factory.getPersonPlanId = function(){
    	return this.personPlanId;
    };
    
    /**
     * 保存personPlanId
     * @param newPersonPlanId{Object} 学员学习计划的personPlanId
     * */
    factory.setPersonPlanId = function(newPersonPlanId){
    	this.personPlanId = newPersonPlanId;
    };
    
    /**
     * 获取订单详情
     * */
    factory.getOrderInfo = function(){
    	return this.orderInfo;
    };
    
    /**
     * 保存订单详情
     * @param newOrderInfo{jsonObject} 要保存的订单详情
     * */
    factory.setOrderInfo = function(newOrderInfo){
    	this.orderInfo = newOrderInfo;
    };
    
    /**
     * 获取是否需要发票标志位
     * */
    factory.getIsNeedInvoice = function(){
    	return this.isNeedInvoice;
    };
    
    /**
     * 保存是否需要发票标志位
     * @param newIsNeedInvoice{number} 要保存的是否需要发票标志位
     * */
    factory.setIsNeedInvoice = function(newIsNeedInvoice){
    	this.isNeedInvoice = newIsNeedInvoice;
    };
    
    /**
     * 获取地市选择类型
     * */
   	factory.getAddressSelectType = function(){
   		return this.addressSelectType;
   	};
   	
   	/**
   	 * 保存地市选择类型
   	 * @param newAddressSelectType{number} 要保存的地市选择类型
   	 * */
   	factory.setAddressSelectType = function(newAddressSelectType){
   		this.addressSelectType = newAddressSelectType;
   	};
    
    /**
     * 获取发票地址的省名称
     * */
    factory.getInvoiceProvinceName = function(){
    	return this.invoiceProvinceName;
    };
    
    /**
     * 保存发票地址的省名称
     * @param newInvoiceProvinceName{String} 要保存的newInvoiceProvinceName
     * */
    factory.setInvoiceProvinceName = function(newInvoiceProvinceName){
    	this.invoiceProvinceName = newInvoiceProvinceName;
    };
    
    /**
     * 获取发票上填写的地市名称
     * */
    factory.getInvoiceCityName = function(){
    	return this.invoiceCityName;
    };
    
    /**
     * 保存发票上填写的地市名称
     * @param newInvoiceCityName{String} 要保存的发票上填写的地市名称
     * */
    factory.setInvoiceCityName = function(newInvoiceCityName){
    	this.invoiceCityName = newInvoiceCityName;
    };
    
    /**
     * 获取发票抬头
     * */
    factory.getInvoiceHead = function(){
    	return this.invoiceHead;
    };
    
    /**
     * 保存发票抬头
     * @param newInvoiceHead{String} 要保存的发票抬头
     * */
    factory.setInvoiceHead = function(newInvoiceHead){
    	this.invoiceHead = newInvoiceHead;
    };
    
    /**
     * 获取发票收件人
     * */
    factory.getInvoiceReceiver = function(){
    	return this.invoiceReceiver;
    };
    
    /**
     * 保存发票收件人
     * @param newInvoiceReceiver{String} 要保存的发票收件人
     * */
    factory.setInvoiceReceiver = function(newInvoiceReceiver){
    	this.invoiceReceiver = newInvoiceReceiver;
    };
    
    /**
     * 获取发票收货详细地址
     * */
    factory.getInvoiceAddress = function(){
    	return this.invoiceAddress;
    };
    
    /**
     * 保存发票收货详细地址
     * @param newInvoiceAddress{String} 要保存的发票收货详细地址
     * */
    factory.setInvoiceAddress = function(newInvoiceAddress){
    	this.invoiceAddress = newInvoiceAddress;
    };
    
    /**
     * 获取发票邮寄邮政编码
     * */
    factory.getInvoicePostCode = function(){
    	return this.invoicePostCode;
    };
    
    /**
     * 保存发票邮寄邮政编码
     * @param newInvoicePostCode{String} 要保存的发票邮寄邮政编码
     * */
    factory.setInvoicePostCode = function(newInvoicePostCode){
    	this.invoicePostCode = newInvoicePostCode;
    };
    
    /**
     * 获取发票联系方式
     * */
    factory.getInvoicePostMobile = function(){
    	return this.invoicePostMobile;
    };
    
    /**
     * 保存发票联系方式
     * @param newInvoicePostMobile{String} 要保存的发票联系方式
     * */
    factory.setInvoicePostMobile = function(newInvoicePostMobile){
    	this.invoicePostMobile = newInvoicePostMobile;
    };
    
    /**
     * 获取personPlan结束时间
     * */
    factory.getEndDate = function(){
    	return this.endDate;
    };
    
    /**
     * 保存personPlan结束时间
     * @param newEndDate{String} 要保存的personPlan结束时间
     * */
    factory.setEndDate = function(newEndDate){
    	this.endDate = newEndDate;
    };
    
    /**
     * 获取系统设置是否提供发票的状态位
     * */
    factory.getInvoiceFlag = function(){
    	return this.invoiceFlag;
    };
    
    /**
     * 保存系统设置是否提供发票的状态位
     * @param newInvoiceFlag{number} 要保存的系统是否提供发票状态位
     * */
    factory.setInvoiceFlag = function(newInvoiceFlag){
    	this.invoiceFlag = newInvoiceFlag;
    };
    
    /**
     * 获取存入的发票纳税人识别码
     * */
    factory.getInvoiceNsrsbh = function(){
    	return this.invoiceNsrsbh;
    };
    
    /**
     * 保存纳税人识别码
     * @param newInvoiceNsrsbh{String} 要保存的纳税人识别码
     * */
    factory.setInvoiceNsrsbh = function(newInvoiceNsrsbh){
    	this.invoiceNsrsbh = newInvoiceNsrsbh;
    };
    
    /**
     * 获取存入的发票类型0个人1单位
     * */
    factory.getInvoicType = function(){
    	return this.invoicType;
    };
    
    /**
     * 保存发票类型0个人1单位
     * @param newInvoicType{String} 要保存的发票类型0
     * */
    factory.setInvoicType = function(newInvoicType){
    	this.invoicType = newInvoicType;
    };
	
	return factory;
}]);