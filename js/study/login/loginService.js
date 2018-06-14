/**
 * 用户登录Service，记录登录后的一些通用数据信息
 */
app.factory("loginService", ["$http", function ($http) {
    var factory = {};
    
    /**
     * 由微信公众号传入的Data参数对象
     */
    var paramData = null;
    
    /**
     * 用户信息
     * {
     *     "icon": "",         --用户头像
     *     "userId": 291969,   --用户ID
     *     "userName": "刘猛"  -- 用户名称
     * }
     */
    var userInfo = {};
    
    /**
     * 是否已经过微信授权标志位，1表示已授权其他表示未授权
     * */
    var isWxOAuth = null;
    
    /**
     * 设置用户信息
     * @param {Object} puserInfo 用户信息
     */
    factory.setUserInfo = function(puserInfo) {
        this.userInfo = puserInfo;
    };
    
    /**
     * 获取用户信息
     * @return {Object} puserInfo 用户信息
     */
    factory.getUserInfo = function() {
        return this.userInfo;
    };
    
    /**
     * 设置微信公众号传入的Data参数对象
     * @param {Object} paramData 微信公众号传入的Data参数对象
     */
    factory.setParamData = function(paramData) {
        this.paramData = paramData;
    };
    
    /**
     * 获取微信公众号传入的Data参数对象
     * @return {Object} paramData 微信公众号传入的Data参数对象
     */
    factory.getParamData = function() {
        return this.paramData;
    };
    
    /**
     * 存放是否已经授授权标志位的函数
     * @param {number} newIsWxOAuth 要保存的是否已经过微信授权标志位
     * */
    factory.setIsWxOAuth = function(newIsWxOAuth){
        this.isWxOAuth = newIsWxOAuth;
    };
    
    /**
     * 获取是否已经过微信授权标志位
     * */
    factory.getIsWxOAuth = function(){
        return this.isWxOAuth;
    };
    
    return factory;
}]);
