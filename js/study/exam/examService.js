app.factory("ExamService", ["$http", function ($http) {
    
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
    
    //试卷分数
    var examScore = {};
    
    //考试次数
    var examCount = {};
    
    //试卷id
    var testPaperId = {};
    
    /**
     * 获取试题列表
     */
    factory.getTestList = function() {
        return this.testList;
    };
    
    /**
     * 保存从后台获取到的试题列表信息
     * 
     * @param newTestIds{JSONList} 新的id列表
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
     * 获得参数用考试分数
     * */
    factory.getExamScore = function(){
    	return this.examScore;
    };
    
    /**
     * 存放参数用考试分数
     * @param newExamScore{Object} 考试分数，重新考试用
     * */
    factory.setExamScore = function(newExamScore){
    	this.examScore = newExamScore;
    };
    
    /**
     * 获取考试次数
     * */
    factory.getExamCount = function(){
    	return this.examCount;
    };
    
    /**
     * 存放调取接口用的考试次数
     * @param newExamCount{Object} 考试次数，重新考试用
     * */
    factory.setExamCount = function(newExamCount){
    	this.examCount = newExamCount;
    };
    
    /**
     * 获取试卷id
     * */
    factory.getTestPaperId = function(){
    	return this.testPaperId;
    };
    
    /**
     * 保存试卷id
     * @param newTestPaperId{Object} 试卷id，重新考试用
     * */
    factory.setTestPaperId = function(newTestPaperId){
    	this.testPaperId = newTestPaperId;
    };
        
    return factory;
}]);
