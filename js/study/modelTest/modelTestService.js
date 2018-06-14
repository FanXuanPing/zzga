app.factory("modelTestService", ["$http", function ($http) {
    
    var factory = {};
    
    //试题列表
    var testList = {};
    
    //正确答案统计
    var rightCount = {};
    
    //错误答案数统计
    var errorCount = {};
    
    //分数
    var score = {};
    
    //分数线
    var passScore = {};
    
    //考试时间
    var examTime = {};
    
    //练习方式
	//1顺序练习；2随机联系；0模拟考试
    var examType = {};
    
    //考试试题id列表
    var examIdList = {};
    
    //考试限制时间，单位分钟
    var testTime = {};
    
    //判断题分值 
    var decideScore = {};
    
    //复选题分值
    var checkboxScore = {};
    
    //单选题分值
    var radioScore = {};
    
    //页面类型，0表示考试页面，1表是错题集页面
    var pageType = {};
    
    /**
     * 获取试题列表
     */
    factory.getTestList = function() {
        return this.testList;
    };
    
    /**
     * 保存从后台获取到的试题列表信息
     * 
     * @param newTestList{JSONList} 新的id列表
     */
    factory.setTestList = function(newTestList) {
        this.testList = newTestList;
    };
    
    /**
     * 获取正确答案统计
     * */
    factory.getRightCount = function(){
    	return this.rightCount;
    };
    
    /**
     * 保存考试中统计的正确答案统计数据
     * @param newRightCount{number} 新的正确答案统计
     * */
    factory.setRightCount = function(newRightCount){
    	this.rightCount = newRightCount;
    };
    
    /**
     * 获取错误答案统计
     * */
    factory.getErrorCount = function(){
    	return this.errorCount;
    };
    
    /**
     * 保存考试中统计的错误答案统计数据
     * @param newErrorCount{number} 新的错误答案统计
     * */
    factory.setErrorCount = function(newErrorCount){
    	this.errorCount = newErrorCount;
    };
    
    /**
     * 获取分数
     * */
    factory.getScore = function(){
    	return this.score;
    };
    
    /**
     * 保存考试分数
     * @param newScore{number} 要保存的考试分数
     * */
    factory.setScore = function(newScore){
    	this.score = newScore;
    };
    
    /**
     * 获取分数线
     * */
    factory.getPassScore = function(){
    	return this.passScore;
    };
    
    /**
     * 保存分数线
     * @param newPassScore{number} 要保存的分数线
     * */
    factory.setPassScore = function(newPassScore){
    	this.passScore = newPassScore;
    };
    
    /**
     * 获取考试时间
     * */
    factory.getExamTime = function(){
    	return this.examTime;
    };
    
    /**
     * 保存考试时间
     * @param newExamTime{number} 考试时长，单位毫秒
     * */
    factory.setExamTime = function(newExamTime){
    	this.examTime = newExamTime;
    };
    
    /**
     * 获取练习方式
     * */
    factory.getExamType = function(){
    	return this.examType;
    };
    
    /**
     * 保存练习方式
     * @param newExamType{number} 练习方式
     * */
    factory.setExamType = function(newExamType){
    	this.examType = newExamType;
    };
    
    /**
     * 获取考试试题id列表
     * */
    factory.getExamIdList = function(){
    	return this.examIdList;
    };
    
    /**
     * 保存考试试题id列表
     * @param newExamIdList{Array} 要保存的考试试题id列表
     * */
    factory.setExamIdList = function(newExamIdList){
    	this.examIdList = newExamIdList;
    };
    
    /**
     * 获取考试限制时间
     * */
    factory.getTestTime = function(){
    	return this.testTime;
    };
    
    /**
     * 保存考试限制时间
     * @param newTestTime{Number} 要保存的考试限制时间，单位分钟
     * */
    factory.setTestTime = function(newTestTime){
    	this.testTime = newTestTime;
    };
    
    /**
     * 获取判断题分值 
     * */
    factory.getDecideScore = function(){
    	return this.decideScore;
    };
    
    /**
     * 保存判断题分值 
     * @param newDecideScore{Number} 要保存的判断题分值 
     * */
    factory.setDecideScore = function(newDecideScore){
    	this.decideScore = newDecideScore;
    };
    
    /**
     * 获取复选题分值
     * */
    factory.getCheckboxScore = function(){
    	return this.checkboxScore;
    };
    
    /**
     * 保存复选题分值
     * @param newCheckboxScore{Number} 要保存的复选题分值
     * */
    factory.setCheckboxScore = function(newCheckboxScore){
    	this.checkboxScore = newCheckboxScore;
    };
    
    /**
     * 获取单选题分值
     * */
    factory.getRadioScore = function(){
    	return this.radioScore;
    };
    
    /**
     * 保存单选题分值
     * @param newRadioScore{Number} 要保存的单选题分值
     * */
    factory.setRadioScore = function(newRadioScore){
    	this.radioScore = newRadioScore;
    };
    
    /**
     * 获取页面类型
     * */
    factory.getPageType = function(){
    	return this.pageType;
    };
    
    /**
     * 保存页面类型
     * @param {Number} newPageType 要保存的页面类型
     * */
    factory.setPageType = function(newPageType){
    	this.pageType = newPageType;
    };
     
    return factory;
}]);
