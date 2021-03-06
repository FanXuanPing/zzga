/**
 * 对应页面：视频学习、课程树显示页面
 */
// 保利威视对应的视频id
var polyvId;
var checkPlanNodeFun = null;
var $scopeCopy = null;
var itemNodeShow = null;
/**
 * 取得课程树，生成层级数据
 */
var nodeTrees = []; //转换后的树节点
var itemNodes = [];//转换前的节点
var islocked = false; //锁定标志
var lockId = 115054; //锁定值
var playVidoArr = {};
var parentNodeA = [];
var showNodes = null;
var isOver = false; //是否学习完成

app.controller("StudyController", ["$scope", "$state","CourceTestService", function($scope, $state, CourceTestService) {
    
    console.log("StudyController call. init.");
    $scopeCopy = $scope;

    var paramData = {
        "key1" : "value1"
    };
    var url = CTX + "/json/demo/demo.json";

    //var url = "json/demo/demo.json";



    $scope.widthV = "100%";
    $scope.heightV = "200" ;
    $scope.parentNodeA = [];

    var url =  ITFC_ADDR.JP_COURSETREE;

    myLandAjax(url, {},
        function(postDataObj, resDataObj) {
            //console.log("这里是成功的回调函数 . postDataObj, resDataObj :", postDataObj, resDataObj);
            itemNodes = resDataObj;

            //先调用查询当前播放的节点
            checkPlanNode(0,function(){
                //取得课程树的节点层级
                createTreeNode();
                nodeTrees = findNode(itemNodes,"pId",0); //查找根节点
                //当前显示节点
                $scope.parentNodeA = parentNodeA;
                $scope.showNodes = showNodes || nodeTrees[0];
                $scope.heightVal = "height:"+nodeTrees[0].childs.length * 100+"px";
            });

        },
        function(postDataObj, resErrMsg) {
            console.log("这里是失败的回调函数 . postDataObj, resErrMsg :", postDataObj, resErrMsg);
        }
    );

    /**
     * 跟据节点情况，加载下一级
     * @param item
     */
    $scope.showNextLayer = function(item){
        //判断是否有下一级
        if ( item.islocked == true ) {
            alert("没有解锁！");
        } else {
            //是否有下一级
            if ( item.childs &&  item.childs.length > 0) {
                item.isSelected = 1;
                $scope.parentNodeA.push($scope.showNodes);
                $scope.showNodes = item;
            } else {
                //取得课程视频列表
                //console.log("===",item);
               // alert(item.courseId+"2"+item.id);
                treePlayHandle(item.id,parseInt(item.courseId,10),0,0);
            }
        }
    }

    /**
     * 关闭节点
     */
    $scope.closeLayer = function(){
        $scope.showNodes = $scope.parentNodeA.pop();
    }


    //返回课程列表
    $scope.close = function(){
        // $state.go("h5.cource", {"id" : ""});
        window.location = BACKURL
    }
    /**
     * 跟据节点内容和当前编号来确定是否播放
     * @param item
     * @param n
     */
    $scope.playNodeClick = function(item,n,width,height){
        //播放视频
        //treePlayHandleSave();
        /**
         * 播放节点
         */
        console.log(item);
        if ( !item.polyvId ) {
            treePlayHandle(item.id,parseInt(item.courseId,10),null,true,width,height,item.playStatus);
        }
      //  playVido(item.polyvId,width,height,item.playStatus);
        item.isSelected = n;
    }

    /**
     * 做习题
     * @param item
     * @param n
     */
    $scope.goTestPage = function(item){
        //播放视频
        //treePlayHandleSave();
        /**
         * 播放节点
         */
        CourceTestService.setChapterId(item.chapterIds);
        CourceTestService.setExamIds(item.examIds);
        $state.go("h5.test", {"id" : ""});
    }
    /**
     * 返回首页
     */
    $scope.goBack = function(){
        $state.go("h5.cource", {"id" : ""});
    }

    /**
     * 跟据是否初次学习来判断当前状态
     * @param isModify //0：查询；1跳到下个节点
     * @param classBack 调取checkPlanNode回调函数
     * @param isNoPlay 是否立即播放：true不播放，false播放
     */
    function checkPlanNode(isModify ,classBack,isNoPlay) {
        var url = ITFC_ADDR.JP_CHECKPLANNODE;

        myLandAjax(url, {isModify:isModify},
            function(postDataObj, resDataObj) {
                /**
                 "courseId":"9004", -- 课件Id
                 "code":"10",
                 "lastWareId": "0",-- 视频Id
                 "lastChapterId":"115115"  -- 章节Id
                 */
               // console.log("-----------------00--",resDataObj);
                //课程学习节点
                //alert( resDataObj.code);
                if ( resDataObj.code == "10" && !isNoPlay ){
                    lockId = resDataObj.lastChapterId;//锁定之后的章节
                    //调用视频
                    treePlayHandle(lockId,resDataObj.courseId,resDataObj.lastWareId);
                }  //alert节点
                else if ( resDataObj.code == "11" && resDataObj.code == "20") {
                    alert(resDataObj.text);
                } else if(resDataObj.code=="12"&&resDataObj.jsMethod=="showCurUserPhoto()"){
                    //继续推送学时
                    $state.go("h5.confirm", {});
                }else if(resDataObj.code=="12"&&resDataObj.jsMethod=="showAfterLearn()"){
                    //alert节点
                    alert(resDataObj.url);
                    //课程学习完成，调用下一个
                    checkPlanNode(1,function(){},true);
                }else if(resDataObj.code=="14"){
                    //推送学时成功
                    alert(resDataObj.message);
                }else if(resDataObj.code=="15"){
                    //转向考试节点
                    $state.go("h5.exam", {score:resDataObj.score,count:resDataObj.count,testPaperId:resDataObj.testPaperId,pageType:0});
                }


                //向下调用获取播放的视频信息
                classBack.call();
            },
            function(postDataObj, resErrMsg) {
               // console.log("这里是失败的回调函数 . postDataObj, resErrMsg :", postDataObj, resErrMsg);
            }
        );
    }

    checkPlanNodeFun = checkPlanNode;

    /**
     * 获取播放的视频信息，当前播放到的节点查看
     * @param chapterIds
     * @param courseId
     * @param handleType
     */
    function treePlayHandle(chapterIds,courseId,lastWareId,handleType,width, height,isWare) {
        var url = ITFC_ADDR.JP_TREEPLAYHANDLE;
        lastWareId = lastWareId || 0;

        var obj = {chapterIds:chapterIds,courseId:courseId,chapterWareId:lastWareId,handleType:0};
        if ( lastWareId == "null" ) delete obj.chapterWareId;
        myLandAjax(url,obj ,
            function(postDataObj, resDataObj) {
                //得到下级数据
                playVidoArr = resDataObj.message;
                if ( resDataObj.isFace == true ) {
                    //if (navigator.userAgent.match(/iphone/i)) {
                    //    $state.go("h5.photographios", {next:"3"}); //转入人脸验证页面
                   // } else
                     //   $state.go("h5.photograph", {next:"3"}); //转入人脸验证页面
					
					 $state.go("h5.photographios", {next:"3"}); //转入人脸验证页面
                }
                var ware = playVidoArr.ware; //视频地址
                /**
                 * test不为-1时是习题学习页面
                 */
                if ( ware.indexOf("test|") == -1 ) {
                    //视频播放
                    var vidoSum = playVidoArr.sum; //视频总数
                    var sumStudyTime = playVidoArr.sumStudyTime; //当前播放节点
                    polyvId = playVidoArr.polyvId;
                    //查找节点，将内容放入节点之下
                    var items = findNode(itemNodes,"id",chapterIds);
                    //items[0].vidoSum = vidoSum;
                    itemNodeShow = items;
                    items[0].sumStudyTime = sumStudyTime + 1; //从0开始记显示为1
                    items[0].isPlayNode = true; //视频播放节点
                    items[0].isShowNode = true;//视频播放节点展示
                    items[0].isSelected = 1; //当前播放节点
                    items[0].vidoNode = []; //显示1，2，3，4节点的名称数组
                    items[0].playStatus = playVidoArr.playStatus;//是否已经学习过 0未学习 1已学习
                   // alert(items[0].sumStudyTime);
                    if ( lastWareId == 0 ) {
                       // items[0].sumStudyTime = 1;
                    }
                    //循环生成数字节点
                    for (var i = 0;i < vidoSum;i++)
                        items[0].vidoNode.push(i+1);

                    if (handleType == true)
                    playVido(items[0].fileNameCc,width,height,isWare);
                } else {
                /**
                 *  习题节点
                 */

                var items = findNode(itemNodes,"id",chapterIds);
                var examIds = ware.substring(5,ware.length);
                    items[0].isShowNode = true;//测试课展开节点展示
                    items[0].isTest = true; //测试课节点
                    items[0].chapterIds = chapterIds; //节点号
                    items[0].examIds = examIds; //课程内容
                    items[0].text = "习题练习";

                }
            },
            function(postDataObj, resErrMsg) {
                // console.log("这里是失败的回调函数 . postDataObj, resErrMsg :", postDataObj, resErrMsg);
            }
        )
    }





}]);
//已经保存的学时
var savePlayed = [];

/**
 * 获取播放的视频信息，当前播放到的节点查看
 * @param chapterIds
 * @param courseId
 * @param handleType
 */
function treePlayHandleSave() {
    var url = ITFC_ADDR.JP_TREEPLAYHANDLE;

    myLandAjax(url, {handleType:1},
        function(postDataObj, resDataObj) {
            var res = resDataObj.message;

          //  alert(res.code);
            if ( res &&  typeof res !== "string" ){
                if (  res.code == 11){
                    //是否已经存过
                   // alert(savePlayed.indexOf(itemNodeShow[0].fileNameCc));

                    //正常返回
                    //播放同级下一级点
                    if ( itemNodeShow[0].sumStudyTime <= itemNodeShow[0].vidoNode.length) {
                        itemNodeShow[0].sumStudyTime++; //下一个
                    }
                    //播放下一层节点
                    else {
                        //itemNodeShow[0].isShowNode = false;
                       // itemNodeShow[0].isPlayNode = false;
                        itemNodeShow[0].sumStudyTime = 1000; //设置最大数
                    }



                    checkPlanNodeFun(0,function(){
                        //取得课程树的节点层级
                        nodeTrees = [];
                        islocked = false; //放开锁定
                        lockId = playVidoArr.nxtChapter; //下一节点
                        var items = findNode(itemNodes,"id",lockId);
                        items[0].islocked = false;
                        //createTreeNode()
                      /*  if(confirm("是否播放下一节点？")) {
                            //playVido(itemNodeShow[0].fileNameCc,$scopeCopy.widthV,$scopeCopy.heightV);
                        } else {

                        }
                        */
                        //playVido(itemNodeShow[0].fileNameCc,$scopeCopy.widthV,$scopeCopy.heightV);
                    },true)
                } else if ( res.code == 10){
                    //课程学习完成，调用下一个
                    checkPlanNodeFun(0,function(){
                        //取得课程树的节点层级

                        //playVido(itemNodeShow[0].fileNameCc,$scopeCopy.widthV,$scopeCopy.heightV);
                    },true)
                }
            } else if ( resDataObj.isFace == true){
                //需要人脸验证（人脸验证过后重新调用此接口）
                alert(resDataObj.message);
            }
        },
        function(postDataObj, resErrMsg) {
            // console.log("这里是失败的回调函数 . postDataObj, resErrMsg :", postDataObj, resErrMsg);
            alert(resErrMsg);
        }
    )
}

//播放器
var player;
/**
 * 跟据提供的视频编号播放视频
 * @param vId
 */
function customFullScreen(){
    //
}

function playVido(vId,widthV,heightV,isWare){
    // 视频进度是否可拖动标志
    var wareProgressDragFlg = isWare || 0;
    polyvId = vId || polyvId;



    var flashvars = {"autoplay":"true"};

    if(wareProgressDragFlg == 0 ) {	// 不可拖动
        flashvars.watch_start_time = "0";
        flashvars.ban_seek_by_limit_time = "on";
    }
        flashvars.onPlayOver = s2j_onPlayOver;
       flashvars.onPlayStart = s2j_onPlayStart;
    flashvars.fullscreen_enable = 1; //启用自定义全屏
    flashvars.fullscreen_function = "customFullScreen"; //设置自定义全屏函数的名称

    //回收内存
    if ( player ) {
        $('#plvDiv').html("");
        player = null;
    }
    //建立播放组件
    try {
        player = polyvObject('#plvDiv').videoPlayer({
            'width' : widthV,
            'height' : heightV,
            'vid' : polyvId,
            'flashvars':flashvars
        });
        setTimeout(function(){
            //$("#playbutton").css({left:$(window).width()/2 -$("#playbutton").width()/2,top:$(".container .img").height()/2 - $("#playbutton").height()/2  });
        },220)


    } catch(e){

    }



}



$(document).ready(function() {

});

/*
 观看视频中出现考题操作后的操作
 */
function s2j_onInteractionData(sendText){
    //alert("222222");
}

/*
 当播放完成后执行的方法
 */
function s2j_onPlayOver(){
    // 保存学时
    treePlayHandleSave();
   // alert("学习完工");
}

/*
 加載完成后，播放前執行的js
 */
function s2j_onPlayStart() {
//		alert("bo");
   // alert("学习开始")
}

/*
 点击暂停后执行的js
 */
function s2j_onVideoPause(){
//		alert("pause");
}

/*
 恢復播放
 */
function resume(){
    var player=getPlayer(polyvId);
    if(player!=undefined && player.j2s_resumeVideo!=undefined){
        player.j2s_resumeVideo();
    }
}

/*
 暂停播放
 */
function pauseVideo(){
    var player=getPlayer(polyvId);
    if(player!=undefined && player.j2s_resumeVideo!=undefined){
        player.j2s_pauseVideo();
    }
}

/*
 获取播放器对象
 */
function getPlayer(movieName) {
    if (navigator.appName.indexOf("Microsoft") != -1) {
        var reObj=window[movieName];
        try {
            if(reObj.length>0) {
                return reObj[0];
            } else {
                return reObj;
            }
        }catch(e) {
        }
        return document[movieName];
    }else{
        return document[movieName];
    }
}


/**
 * 建立节点树
 * @param nodeArr
 * @param parentNode
 * @param item
 */
function createTreeNode(parentNode,item) {
    //便利节点
    parentNode = parentNode || nodeTrees;
    //判断是否第一次运行
    if ( item == null) {
        //查找根节点
        var items = findNode(itemNodes,"pId",0);
        parentNode.concat(items);
        items[0].childs = [];
        //递归下一层
        createTreeNode(items[0].childs,items[0]);
    } else {
        var items = findNode(itemNodes,"pId",item.id);
        //循环生成下一级
        for ( var i = 0; i < items.length;i++){
            var itemN = items[i];
            //锁定之后的节点
            if ( islocked == true) {
                itemN.islocked = true;
            } else {
                //console.log(item,items);
                parentNodeA.push(item);
                showNodes = item;
                itemN.islocked = false;
            }

            if ( itemN.id == lockId) {
                //alert(itemN.id+" "+lockId);
                itemN.islocked = false;
                islocked = true;
            }

            if ( itemN.isDir && itemN.isDir == 0 ) {
                parentNode.push(itemN);
            } else {
                itemN.childs = [];
                createTreeNode(itemN.childs,itemN);
                parentNode.push(itemN);
            }
        }

    }

}



/**
 *  查询节点中满足val值的节点
 * @param node
 * @param key
 * @param val
 * @returns {*}
 */
function findNode(node,key,val){
    var arr = [];
    for (var i = 0; i < node.length;i++){
        if ( node[i][key] == val) {
            arr.push(node[i]);
        } else {

        }
    }
    return arr;
}


