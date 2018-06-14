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
/**
 * 当前播放视频节点信息
 * 在调用treePlayHandle 函数后赋值
 */
var curNode={
	//标记当前事件   只能有一个为true
	isClick         :false,//当前节点是点击播放
	isGoSave        :true,//当前节点是自动播放节点
	isClickHeader   :false,//是否点击章节标题
	//节点信息
	nextChapterId   :'',  //下一个章节名称
	preChaterId     :'',   //前一个章节名称
	chapterId       :'',    //当前视频所属章节
	courseId        :'',      //当前视频所属课程
    chapterWareId   :'',   //当前视频课件id
    nextWare        :'',      //下一个视频id
    num             :0,           //当前视频序号   从0开始
    sum             :0,            //当前章节总共视频数
    playStatus      :'0' ,  //0未学习过，1学习过
    showNextLayer   : false ,  //是否展开下一个章节列表
    isLast          : false,     //是否为最后一个课件
    resetAct        : function(){
    	this.isClick=false;
    	this.isGoSave=true;
    	this.isClickHeader=false;
    },
    setClickEvent   : function(event){
    	this.isClick       =(event=='isClick'?true:false);
    	this.isGoSave      =(event=='isGoSave'?true:false);
    	this.isClickHeader =(event=='isClickHeader'?true:false);
    }
};

//动态控制章节显示
var openChildNodeOut=null;

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
              console.log("这里是成功的回调函数 . postDataObj, resDataObj :", postDataObj, resDataObj);
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
            alert("当前课程还没有学完，请按顺序学习！");
        } else {
        	curNode.setClickEvent('isClickHeader');
            //是否有下一级
            if ( item.childs &&  item.childs.length > 0) {
                item.isSelected = 1;
                $scope.parentNodeA.push($scope.showNodes);
                $scope.showNodes = item;
            } else {
            	//关闭其他
            	for(var i=0;i<itemNodes.length;i++){
            		var node=itemNodes[i];
            		if(item.id!=node.id){
            				node.isShowNode=false;
            		}
            	}
            	var show=item.isShowNode==true?false:true;
            	item.isShowNode=show;
            	
            	
                //取得课程视频列表
                treePlayHandle(item.id,parseInt(item.courseId,10),0,0);
            	if(item.id==curNode.chapterId){
            		item.isSelected=curNode.wareId;
            		if(curNode.num<1){
						item.isSelected="1";
					}else{
						item.isSelected=lastWareId;
					}
            	}else{
            		item.isSelected=null;
            	}
                
                
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
        
        curNode.setClickEvent('isClick');
        var nn=item.name;
        var index=n;
        /*$(".fa").each(function(){
           if(this.hasAttribute("clicked")){
           	var top_parent=$(this).parent().parent()[0];
           	var lable=$(top_parent).children()[0];
           	var text=$(lable).text();
           	if($.trim(nn)==$.trim(text) && $.trim($(this).text())==index){
           		 	$(this).attr("clicked",true);
           	}else{
           		 	$(this).attr("clicked",false);
           	}
          
           }
          
        });
        $(this).attr("clicked",true);*/
        console.log(item);
        if ( !item.polyvId ) {
            treePlayHandle(item.id,parseInt(item.courseId,10),null,true,width,height,item.playStatus,index);
        }
      //  playVido(item.polyvId,width,height,item.playStatus);
      /*  item.isSelected = n;*/
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
                //课程学习节点
                if ( resDataObj.code == "10" && !isNoPlay ){
                    lockId = resDataObj.lastChapterId;//锁定之后的章节
                    //调用视频
                    treePlayHandle(lockId,resDataObj.courseId,resDataObj.lastWareId);
                    showLastSeeWare(lockId,resDataObj.courseId,resDataObj.lastWareId);
                }  //alert节点
                else if ( resDataObj.code == "11" || resDataObj.code == "20") {
                    alert(resDataObj.text);
                    if("学习完成!"!= resDataObj.text){
                    	checkPlanNode(1,function(){},true);
                    }
                } else if(resDataObj.code=="12" && resDataObj.jsMethod=="showCurUserPhoto()"){
                    //继续推送学时
                    $state.go("h5.confirm", {});
                }else if(resDataObj.code=="12" && resDataObj.jsMethod=="showAfterLearn()"){
                    //alert节点
                    
                    alert(resDataObj.url);
                    //课程学习完成，调用下一个
                    checkPlanNode(1,function(){},true);
                }else if(resDataObj.code=="12"&&resDataObj.jsMethod=="showSurvery()"){
                	 $state.go("h5.survery",{});
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
    function treePlayHandle(chapterIds,courseId,lastWareId,handleType,width, height,isWare,wareIndex) {
        var url = ITFC_ADDR.JP_TREEPLAYHANDLE;
        lastWareId = lastWareId || 0;

          var chapterWareId = lastWareId;
//      if(lastWareId == null && wareIndex != null && wareIndex>0){
//      	chapterWareId = getWareId(courseId,chapterIds,wareIndex);
//      }
//      
        // 只用点击 下面视频课件按钮后,采取调用 getWareId方法去取chapterWareId;否则用curNode对象中保存的数据
            if(curNode.isClickHeader){
            	//加载传入数据
            	
            }else if(curNode.isClick){
            	//点击 节点  播放视频
        		 var index=wareIndex || 0;
        		 if(index>0){
        		 	index--;
        		 }
        		 chapterWareId = getWareId(courseId,chapterIds,index);
        	}else{
        		//curNode 中取数据
        		 if(curNode.isUsed){
	        		 	 if(curNode.isLast){
	        		 	 //当前chapter id 与下一个chapterid不同 说明到了最后一个节点，chapter设置下一个chapterID,ware 设置为0
		        		 	 chapterIds=curNode.nextChapterId;
		        		 	 chapterWareId =0;
		        		 	 curNode.showNextLayer=true;
		        		 	 curNode.chapterId=curNode.nextChapterId;
		        		 }else{
		        		 	chapterIds=curNode.chapterId;
		        		 	chapterWareId = curNode.num==0?0:curNode.nextWare;
		        		 	curNode.showNextLayer=false;
		        		 }
		        		 courseId=curNode.courseId || courseId;
        		 }else{
        		 	//使用默认数据
        		 }
        	}
         //恢复初始状态   点击一次后，又按自动播放方式进行
         curNode.resetAct();
        if (chapterWareId == null || chapterWareId=="") {
        	chapterWareId = lastWareId || 0;
        }


        var obj = {chapterIds:chapterIds,courseId:courseId,chapterWareId:chapterWareId,handleType:0};
          //如果点击视频下标则调取接口拿取wereid
     
        
        if ( lastWareId == "null" ) delete obj.chapterWareId;
        myLandAjax(url,obj ,
            function(postDataObj, resDataObj) {
                //得到下级数据
                playVidoArr = resDataObj.message;
                if ( resDataObj.isFace == true ) {
                	  $state.go("h5.photographios", {next:"3"}); //转入人脸验证页面
                }
                var ware = playVidoArr.ware; //视频地址
                /**
                 * test不为-1时是习题学习页面
                 */
                if ( ware.indexOf("test|") == -1 ) {
                	var isOpenNextLayer=false;
                	if(curNode.isLast){
                		isOpenNextLayer=true;
                	}
                	//更新视频对象信息    
                	if(!curNode.isClickHeader){
	                		//只有当前动作为点击课件按钮或是保存学时 时，采取更新数据
	                		curNode.isUsed=true;
	                		curNode.nextChapterId=resDataObj.message.nxtChapter;
	                		curNode.preChaterId=resDataObj.message.preChapter;
	                		if(resDataObj.message.nxtChapter!=resDataObj.message.preChapter && resDataObj.message.num>0){
		                		curNode.isLast=true;
		                	}else{
		                		curNode.isLast=false;
		                	}
	                		curNode.nextWare=resDataObj.message.nxtWare;
		                	curNode.num=resDataObj.message.num;
		                	curNode.sum=resDataObj.message.sum;
		                	curNode.playStatus=resDataObj.message.playStatus;
		                	if(resDataObj.message.playStatus && resDataObj.message.playStatus=="0"){
		                		//未播放
		                		curNode.isStudy=false;
		                		if(!curNode.isLast){
		                		   //当前取回的节点  非最后一个节点
		                		   if(curNode.num<2){
		                		     	curNode.chapterId=resDataObj.message.nxtChapter;
		                		   }else{
		                		   	    curNode.chapterId=resDataObj.message.preChapter;
		                		   }
			                	}else{
			                		//把当前节点修改为下一个章节id
			                		curNode.chapterId=resDataObj.message.preChapter;
			                	}
		                	}else{
		                		//该课件已经学习过   在视频播放完成后，将视频chapterid 修改为nxtChapter
		                		if(curNode.isLast){
		                			  curNode.chapterId=resDataObj.message.preChapter;
		                		}else{
		                		   if(curNode.num<2){
		                		     	curNode.chapterId=resDataObj.message.nxtChapter;
		                		   }else{
		                		   	    curNode.chapterId=resDataObj.message.preChapter;
		                		   }
		                		}
		                		 curNode.isStudy=true;
		                	}
                	}
                	
                    //视频播放
                    var vidoSum = playVidoArr.sum; //视频总数
                    var sumStudyTime = playVidoArr.sumStudyTime; //当前播放节点
                    polyvId = playVidoArr.polyvId;
                    //查找节点，将内容放入节点之下
                    var items = findNode(itemNodes,"id",chapterIds);
                    itemNodeShow = items;
                    items[0].sumStudyTime = sumStudyTime + 1; //从0开始记显示为1
                    items[0].isPlayNode = true; //视频播放节点
                   // items[0].isShowNode = true;//视频播放节点展示
                  //  items[0].isSelected = 1; //当前播放节点
                     items[0].isSelected =  items[0].sn;
                    items[0].vidoNode = []; //显示1，2，3，4节点的名称数组
                    items[0].playStatus = playVidoArr.playStatus;//是否已经学习过 0未学习 1已学习
                    if ( lastWareId == 0 ) {
                       // items[0].sumStudyTime = 1;
                    }
                    //循环生成数字节点
                    for (var i = 0;i < vidoSum;i++)
                        items[0].vidoNode.push(i+1);
                        
                    var resize=false;
//                  if(curNode.playNext){
                    	handleType=true;
                    	items[0].fileNameCc=resDataObj.message.polyvId;
                    	resize=true;
                    	width=$(window).width();
                    	height=$(".container .img").height();
//                  }
                    if (handleType == true)
                    playVido(items[0].fileNameCc,width,height,isWare,resize,isOpenNextLayer);
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
	/**
	 * 显示上次看到的最后一个视频
	 * "lastChapterId":"118255","lastWareId":"0","courseId":"9204"
	 */
	function showLastSeeWare(lastChapterId,courseId,lastWareId){
		var items = findNode(itemNodes,"id",lastChapterId);
		items[0].isShowNode = true;
		items[0].isSelected=curNode.num+1;
	}
	
		
	
	/**
	 * 显示对应节点
	 * @param {Object} item
	 */
	function openChildNode(openItem,closeItem){
//		var show=openItem.isShowNode==true?false:true;
		 $scope.$apply(function(){
		 	  /*  openItem.vidoNode=[];
		 	    for (var i = 0;i < openItem.sum;i++)
		                        openItem.vidoNode.push(i+1);*/
		        openItem.islocked=false;
		        openItem.isPlayNode=true;
		        openItem.isShowNode=true;
		        
		        closeItem.isShowNode=false;
		        closeItem.isPlayNode=false;
		 });
       
//      $rootScope.$digest();
	}
	openChildNodeOut=openChildNode;
	
}]);
//已经保存的学时
var savePlayed = [];


 /**
     * 点击数字，获取播放课件的信息
     * @auther 赵洋
     * @create 2017-3-7
     * @param curCourseId 当前课程Id
     * @param chapterId 章节
     * @param num 第几个课件
     * */
    function getWareId(curCourseId,chapterId,num){
    	var res = 0;
    	paramData = {};
    	paramData.curCourseId = curCourseId;
    	paramData.chapterId = chapterId;
    	paramData.num = num;
    	myLandAjax(ITFC_ADDR.GETWAREID, paramData, 
	        function(postDataObj, resDataObj) {
	            console.log("这里是成功的回调函数 . postDataObj, resDataObj :", postDataObj, resDataObj);
	            res = resDataObj;
	        }, 
	        function(postDataObj, resErrMsg) {
	            console.log("这里是失败的回调函数 . postDataObj, resErrMsg :", postDataObj, resErrMsg);
	            res = 0;
	        }
	    );
	    return res;
    }

//播放器
var player;

console.log(polyvId)
/**
 * 跟据提供的视频编号播放视频
 * @param vId
 */
function customFullScreen(){
    //
}
/**
 * 
 * @param {Object} vId
 * @param {Object} widthV
 * @param {Object} heightV
 * @param {Object} isWare
 * @param {Object} isResize   自动触发下一个课件时，要resize视频div
 * showNextLayer 关闭当前章节，展开下一个章节
 */
function playVido(vId,widthV,heightV,isWare,isResize,showNextLayer){
    // 视频进度是否可拖动标志
    var wareProgressDragFlg = isWare || 0;
    polyvId = vId || polyvId;



    var flashvars = {"autoplay":"true"};
    if(wareProgressDragFlg == 0 ) {	// 不可拖动
    	
        flashvars.watchStartTime = "0";
        flashvars.ban_seek_by_limit_time = "on";
        flashvars.ban_ui="on";
        flashvars.ban_control="on";
		
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
            'forceH5': true,
            'flashvars':flashvars
        });
        setTimeout(function(){
            //$("#playbutton").css({left:$(window).width()/2 -$("#playbutton").width()/2,top:$(".container .img").height()/2 - $("#playbutton").height()/2  });
        },220)
       //视频准备完毕后  关闭当前节点  展开下一个章节
        if(showNextLayer){
        	autoShowNextLayer();
        	markBtn();
        }
        if(isResize){
        	resizeVideo();
        	if(!showNextLayer){
        		  markBtn();
        	}
        }
        

    } catch(e){

    }



}


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
            if ( res &&  typeof res !== "string" ){
                if (  res.code == 11){
                    //播放同级下一级点
                    if ( itemNodeShow[0].sumStudyTime <= itemNodeShow[0].vidoNode.length) {
                        itemNodeShow[0].sumStudyTime++; //下一个
                    }
                    //播放下一层节点
                    else {
                        itemNodeShow[0].sumStudyTime = 1000; //设置最大数
                    }
                    curNode.setClickEvent('isGoSave');
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
                    },false)
                } else if ( res.code == 10){
                	curNode.setClickEvent('isGoSave');
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
	//播放下一个
	
	
    //视频播放完成  恢复部分数据
	curNode.playNext=true;
	curNode.num=curNode.num+1;
	curNode.resetAct();
    
    if(curNode.isStudy){
    	//当前 课件是已经学完的，视频播放完成时认为 视频保存学时
    	curNode.isGoSave=true;
    	//如果 该视频已经学过，回看,并且是最后一个视频
    	if(curNode.isLast){
    		curNode.chapterId=curNode.nextChapterId;
    	}
    }
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



function resizeVideo(){
	$(".container").height($(window).height());
    $(".container .body").height($(window).height() - $(".container .img").height());
    $("video,#plv_container").width($(this).width());
    $("#playbutton").css({left:$(window).width()/2 -$("#playbutton").width()/2,
    top:$(".container .img").height()/2 - $("#playbutton").height()/2 });
}

//当视频自动播放下一个时，对应的标记下面对应的btn
function markBtn(chapterId,num){
		//如果当前节点被点击，则不用下面功能
		var cid=chapterId || curNode.chapterId;
		var index=num     || (curNode.num+1);
		$("[clicked='true']").attr("clicked",false);
		var selecter="#"+cid+" > div:last-of-type i";
		$(selecter).each(function(){
			//遍历每一个i标签找到   需要变蓝的按钮
			var text=$(this).text();
			if(text.trim()==(index+"")){
				$(this).attr("clicked",true);
			}
		});
}

function autoShowNextLayer(){
	var chapterId_old=curNode.preChaterId;
	var chapterId=curNode.chapterId;
	var openItem=null,closeItem=null;
    if(showNodes.childs){
    	for(var i=0;i<showNodes.childs.length;i++){
    		var item=showNodes.childs[i];
    		if(item.id==chapterId){
    		    openItem=item;
    		}
    		if(item.id==chapterId_old){
    			closeItem=item;
    		}
    	}
    	openChildNodeOut(openItem,closeItem);
    }
}

function createChildNode(item){
	         if ( item.childs &&  item.childs.length > 0) {
                item.isSelected = 1;
                $scope.parentNodeA.push($scope.showNodes);
                $scope.showNodes = item;
            } else {
            	var show=item.isShowNode==true?false:true;
            	item.isShowNode=show;
//              treePlayHandle(item.id,parseInt(item.courseId,10),0,0);
            }
}







