app.factory("CourceTestService", ["$http", function ($http) {
    
    var factory = {};
    
    //试题id列表
    var examIds = {};
    
    //chapterId
    var chapterId = {};
    
    /**
     * 获取试题id列表
     */
    factory.getExamIds = function() {
        return this.examIds;
    };
    
    /**
     * 保存从后台获取到的试题id列表信息
     * 
     * @param newTestIds{Object} 新的id列表
     */
    factory.setExamIds = function(newExamIds) {
        this.examIds = newExamIds;
    };
    
    /**
     * 获取chapterId
     * */
    factory.getChapterId = function(){
    	return this.chapterId;
    };
    
    /**
     * 保存chapterid
     * 
     * @param newChapterId 放入的chapterId
     * */
    factory.setChapterId = function(newChapterId){
    	this.chapterId = newChapterId;
    }
    
    return factory;
}]);
