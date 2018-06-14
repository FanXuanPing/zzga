/**
 * 对应页面：模拟考试选择页面
 */
app.controller("ExamChooseController", ["$scope", "$state","ExamService",function($scope, $state,ExamService) {
    
    console.log("ExamChooseController call. init.");

    /**
     * 初始加载区
     * */

    //类型
    //7小车c1c2c3；1201客运；1202货运；1002危险品；1003教练员；2201网约车
	$scope.catType = "jsz";

	//科目
	//1科目一；4科目四；20从业资格证；10继续教育
	$scope.subjectType = "";

	//练习方式
	//1顺序练习；2随机联系；0模拟考试
	$scope.examType = "";


  	
    /**
     * js函数区
     * */
    
    //点击修改类型
    $scope.checkCatType = function(catTypeId){
    	$scope.catType = catTypeId;
    };
    
    //点击修改科目
    $scope.checkSubjectType = function(subjectTypeId){
    	$scope.subjectType = subjectTypeId;
    };
    
    //点击考试类型
    $scope.checkExamType = function(examTypeId){
    	
    };
 
}]);
