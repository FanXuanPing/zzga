app.controller("DemoController", ["$scope", "$state", "$stateParams", "demoService", "$http", function($scope, $state, $stateParams, demoService, $http) {

	console.log("DemoController call. init.");
	
	var inParamNameValue = $stateParams.paramName;

	$scope.dataArr = [{
		"adsImg": "test-adsImg",
		"adsTitle": "test-adsTitle",
		"locationType": "test-1",
		"addTime": "2015-02-01"
	}, {
		"adsImg": "test-adsImg22",
		"adsTitle": "test-adsTitle22",
		"locationType": "test-22",
		"addTime": "2015-02-02"
	}, {
		"adsImg": "test-adsImg22",
		"adsTitle": "test-adsTitle22",
		"locationType": "test-22",
		"addTime": "2015-02-02"
	}, {
		"adsImg": "test-adsImg22",
		"adsTitle": "test-adsTitle22",
		"locationType": "test-22",
		"addTime": "2015-02-02"
	}];

	var paramData = {
		"key1": "value1"
	};
	
	//var url = CTX + "/json/demo/demoErr.json";
	//var url = "json/demo/demo.json";
	//var url = "json/demo/demo2.json";
	var url = CTX + "/json/demo/demo3.json";

	myLandAjax(url, paramData,
		function(postDataObj, resDataObj) {
			console.log("这里是成功的回调函数 . postDataObj, resDataObj :", postDataObj, resDataObj);
		},
		function(postDataObj, resErrMsg) {
			console.log("这里是失败的回调函数 . postDataObj, resErrMsg :", postDataObj, resErrMsg);
		}
	);

//	myLandAjax(url, paramData,
//		function(postDataObj, resDataObj) {
//			console.log("这里是成功的回调函数 . postDataObj, resDataObj :", postDataObj, resDataObj);
//
//			$scope.adsTitle = resDataObj.key11;
//		}
//	);

//	// Angularjs的Ajax请求调用demo
//	var req = {
//		method: 'POST',
//		url: url,
//		headers: {
//			"isAJAXRequest": "yes"
//		},
//		data: paramData
//	};
//	$http(req).success(function(data, status, headers, config) {
//		console.log("$http.success.data :", data);
//		console.log("$http.success.status :", status);
//		console.log("$http.success.headers :", headers);
//		console.log("$http.success.config :", config);
//	}).error(function(data, status, headers, config) {
//		console.log("$http.error.data :", data);
//		console.log("$http.error.status :", status);
//		console.log("$http.error.headers :", headers);
//		console.log("$http.error.config :", config);
//	});

	//  myLandAjaxDataJson(url, paramData, function(code, data) {
	//      console.log("myLandAjaxDataJson data : " + data);
	//      
	//      if ("00" == code) {
	//          var jsonData = $.parseJSON(data);
	//          if (jsonData.flag) {
	//              // 
	//              var dataObj =jsonData.message;
	//              
	//          } else {
	//              var msg = funcGlobal.getResMsg(jsonData.message);
	//              alert(msg);
	//          }
	//      } else {
	//          alert(data);
	//      }
	//  });

	//  /**
	//   * 查看详情
	//   * @param vId {Number} 广告ID
	//   */
	//  $scope.toDetail = function(vId) {
	//      $state.go("app.xbAreaVideoDtl", {"paramName" : 11233});
	//  };

}]);