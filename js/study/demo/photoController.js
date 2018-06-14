app.controller("photoController", ["$scope", "$state", "$stateParams", 
 "$http", function($scope, $state, $stateParams, $http,$cordovaCamera) {

     $scope.go_back = function(){
            $location.path('/additional/add');
        }
        $scope.takephoto =  function () {
            console.log(44);
            var options = {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 100,
                targetHeight: 100,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: true

            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                var image = document.getElementById('myImage');
                image.src = "data:image/jpeg;base64," + imageData;
            }, function(err) {
                // error
            });

        };

}]);
/*
var file_url;
var timestamp;
var dataBase64;
mui.init();
mui.plusReady(function() {
    // 扩展API加载完毕后调用onPlusReady回调函数 
document.getElementById('faceVali').addEventListener('tap', function() {
        openCamera();
    },false);
});
//打开手机摄像头
function openCamera() {
    var cmr = plus.camera.getCamera();
    cmr.captureImage(function(p) {
        plus.io.resolveLocalFileSystemURL(p, function(entry) {
            plus.nativeUI.showWaiting("人脸识别中", ""); //显示系统loading框
        plus.zip.compressImage({
            src: entry.toLocalURL(),
            dst: '_doc/camera/' + p,
            overwrite: true,
            format: "jpg",
            width: "30%"
        }, function(zip) {
            if(zip.size > (1 * 1024 * 1024)) {
                return mui.toast('文件超大,请调整相机重新拍照');
            }
            file_url = zip.target;
            //转为base64
//                          getBase64(file_url);
            uploadToServer(file_url);
        }, function(zipe) {
            plus.nativeUI.closeWaiting();
            mui.toast('压缩失败！')
        });
    }, function(e) {
        plus.nativeUI.closeWaiting(); //获取图片失败,loading框取消
        mui.toast('失败：' + e.message); //打印失败原因,或给出错误提示
    });
}, function(e) {
    plus.nativeUI.closeWaiting(); //开启照相机失败,关闭loading框
    mui.toast('失败：' + e.message); //打印错误原因,给出错提示
}, {
    filename: '_doc/camera/', //图片名字
    index: 1 //摄像头id
    });
}
*/

mui.init({

swipeBack: true //启用右滑关闭功能

});

// 扩展API加载完毕后调用onPlusReady回调函数 

document.addEventListener( "plusready", onPlusReady, false );

// 扩展API加载完毕，现在可以正常调用扩展API 

function onPlusReady() {
alert("plusready");
console.log("plusready");

}

// 拍照

function captureImage(){
alert("1")
var cmr = plus.camera.getCamera();

var res = cmr.supportedImageResolutions[0];

var fmt = cmr.supportedImageFormats[0];
alert("Resolution: "+res+", Format: "+fmt);
console.log("Resolution: "+res+", Format: "+fmt);

cmr.captureImage( function( path ){
alert("Capture image success: " + path);
alert( "Capture image success: " + path );
},
function( error ) {
alert( "Capture image failed: " + error.message );
},
{resolution:res,format:fmt}

);

}

