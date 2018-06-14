/**
 * Created by HP on 2017/2/23.
 *  订单确认页面js
 * @author 赵洋
 */
app.controller("paySuccessController", ["$scope", "$state", function($scope, $state) {

    console.log("paySuccessController call. init.");
    
    $scope.cancel = function(){
    	$state.go("h5.cource", {});
    };

}]);
