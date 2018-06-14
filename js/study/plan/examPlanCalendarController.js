/**
 * Created by HP on 2016/12/20.
 */
/**
 * 对应页面：考试日历
 */
app.controller("examPlanCalendarController", ["$scope", "$state","loginService",function($scope, $state,loginService) {

    console.log("examPlanCalendarController call. init.");

    /**
     * 初始加载区
     * */
    $scope.MonHead = [31,28,31,30,31,30,31,31,30,31,30,31];
    $scope.week = ["日","一","二","三","四","五","六"];
    $scope.Month = ["一","二","三","四","五","六","七","八","九","十","十一","十二"];
    this.upOrDown = "";
    $scope.defValue = new Date();
    $scope.isShowMask = false; //是否显示
    $scope.itSelect = {};
    $scope.isShowBody = false;

    //取日历内容
    createDateC($scope.defValue.getFullYear(), $scope.defValue.getMonth() +1);
    var i = $scope.defValue.getMonth() +1;
    var dd =  i;
    if (i < 10) dd = "0" + i;
    //查询
   // queryDateByData("41010219871204015X",$scope.defValue.getFullYear()+""+ dd);
    /**
     * 判断是否闰平年
     * @param year
     * @returns {boolean}
     * @constructor
     */
    function IsPinYear(year)
    {
        if (0 == year % 4 && ((year % 100 != 0) || (year % 400 == 0))) return true; else return false;
    }
    /**
     * 渲染内容
     * @param dateTime
     * @param body
     */
    function createDateC(yy,mm) {

        $scope.beforeArr = [];
        $scope.selfArr = [];
        $scope.afterArr = [];

        var firstday = new Date(yy, mm - 1, 1).getDay();
        var upmonth = 0;

        var dayNum = 0; //天数记录

        if (mm == 1 ) {
            upmonth = 31;
        } else if ( mm == 2) {
            upmonth = 31;
        }
        else {
            upmonth = $scope.MonHead[mm - 2];
        }
        if (upmonth == 28 && IsPinYear(yy)) upmonth = 29; //闰年的计算
        var enddata = $scope.MonHead[mm - 1] ;
        if (enddata == 28 && IsPinYear(yy)) upmonth = 29;
        var endday =  7- new Date(yy, mm - 1, enddata).getDay();

        var upday =  7 - (7 - firstday + 1)  ;//从6开始算星期，0为星期天，当前星期3应为3 ,这里算的是差值 用周6减去今天周几，然后减去今天
        upday = upday < 0 ? 6 :upday; //如果小于0，则第1天是星期天，前面有6天，然后去掉自己的这天。

        var begM = upmonth + 1  - upday; //当前日期加上它自己的1天

        // if (firstday != 0) {
        for (var i = begM; i <= upmonth; i++) {
            dayNum +=1;
            var dateweek = {};
            var dd = i ;
            if (i < 10) dd = "0" + i;
            if (mm == 1) {
                dateweek.val = dd;
                dateweek.date = yy - 1 + "" + 12 + "-" + dd;
                dateweek.dateVal = new Date(yy - 1,11,dd);
            } else {
                dateweek.val = dd;
                dateweek.date =  yy + "-" + (mm - 1) + "-" + dd;
                dateweek.dateVal = new Date(yy ,mm - 2,dd);
            }
            $scope.beforeArr.push(dateweek);
            //dateweek.unbind("click").find(".val,i").hide();
            dateweek.class = "fristMonth";


            var dateNowDay = $scope.defValue || new Date();
            if ( yy == dateNowDay.getYear() && mm  == dateNowDay.getMonth() + 1 && dd == dateNowDay.getDate() ){
                //dateweek.parent().addClass("active");
            }
        }
        //       }
        for (var i = 1; i <= $scope.MonHead[mm - 1]; i++) {
            var dateweek = {};
            dayNum +=1;
            var dd = i ;
            dateweek.val = dd;
            if (i < 10) dd = "0" + i;
            var ms = mm;
            if (mm < 10) ms = "0" + mm;
            dateweek.date =  yy +"" + ms +""+ dd.toString();
            dateweek.isThisMonth = true;
            $scope.selfArr.push(dateweek);
            dateweek.class = "thisMonth";
            var dateNowDay = new Date();
            dateweek.dateVal = new Date(yy,mm - 1,dd);
            // alert(mm+" "+dateNowDay.getMonth()+" "+dd+" "+dateNowDay.getDate());
            //    this.dateMandiv.appendChild(dateweek);
            if ( yy == dateNowDay.getFullYear() && mm  == dateNowDay.getMonth() + 1 &&  dd < dateNowDay.getDate() ) {
                //dateweek.class = "fristMonth";
                //dateweek.addClass("fristMonth");
            }
            var dateNowDay = $scope.defValue || new Date();
            //

            if ( yy == dateNowDay.getFullYear() && mm  == dateNowDay.getMonth() + 1 && dd == dateNowDay.getDate() ){
               // dateweek.addClass("active");
            }
        }
        for (var i = 1; i <= endday; i++) {
            var dateweek = {};
            dayNum +=1;
            var dd = i ;
            if (i < 10) dd = "0" + i;
            var dateT = new Date();
            if (mm == 12) {
                dateweek.val = dd;
                dateweek.date =  yy + 1 + "-01-" + dd;
                dateT = new Date(yy + 1,0,dd);
                dateweek.dateVal = dateT;
            } else {
                dateweek.val = dd;
                dateweek.date =  yy + "-" + (mm + 1) + "-" + dd;
                dateweek.dateVal = new Date(yy, mm, dd);
            }
            dateweek.isThisMonth = false;
            $scope.afterArr.push(dateweek);

            dateweek.class  = "endMonth";
            var dateNowDay = new Date()
            var dateNowDay = $scope.defValue || new Date();
            if ( yy == dateNowDay.getYear() && mm  == dateNowDay.getMonth() + 1 && dd == dateNowDay.getDate() ){

            }
            //dateweek.addClass("fristMonth");
        }

        var row = dayNum/7;
        if ( row < 6 ) {
            for ( var i = 0; i < 7;i++) {
                var dayT = endday + 1+ i;
                var dateweek = {};
                dateweek.val = dayT;
                dateweek.dateVal = new Date(yy, mm , dayT);
                $scope.afterArr.push(dateweek);
                dateweek.class = "endMonth";
                //dateweek.addClass("fristMonth");
            }

        }


        var i = $scope.defValue.getMonth() +1;
        var dd =  i;
        if (i < 10) dd = "0" + i;
        //"41010219871204015X" 查询
        var idCard=loginService.getParamData().userName;
        queryDateByData(idCard,$scope.defValue.getFullYear()+""+ dd);
        $(".calender-body > a").show();
    }

    /**
     * js函数区
     * */

    $scope.preMonth = function(){
        //取日历内容
        $(".downMonth a").remove();
        var timeD  = $scope.defValue || new Date();

        if (  timeD.getMonth() == 0 ) {
            timeD = new Date(timeD.getFullYear() - 1,11,timeD.getDate());
        }  else {
            timeD =   new Date(timeD.getFullYear() ,timeD.getMonth() - 1,timeD.getDate());
        }
        $scope.defValue = timeD;
        createDateC($scope.defValue.getFullYear(), $scope.defValue.getMonth() +1);

    }

    $scope.nextMonth = function(){
        //取日历内容
        $(".downMonth a").remove();
        var timeD  = $scope.defValue || new Date();

        if (  timeD.getMonth() == 11 ) {
            timeD = new Date(timeD.getFullYear() + 1,0,timeD.getDate());
        }  else {
            timeD =   new Date(timeD.getFullYear(),timeD.getMonth() + 1, timeD.getDate());
        }
        $scope.defValue = timeD;
        createDateC($scope.defValue.getFullYear(), $scope.defValue.getMonth() +1);

    }

    $scope.selectItem = function(item){
        //移动到
        $(".downMonth a.active").removeClass("active");
       $(".thisMonth[n="+item.val+"]").addClass("active");
        $(".body").scrollTop(parseInt(item.val - 1 ,10)* ($(".body li").height() + 2));

    }

    /**
     * 点击返回箭头的事件
     * */
    $scope.goBack = function(){
        $state.go("h5.cource", {});
    }

    /**
     * 点击参看错题按钮事件
     * */
    $scope.showErrorList = function(){
        $state.go("h5.exam", {pageType:1});
    }

    /**
     * 点击重新考试的按钮事件
     * */
    $scope.reExam = function(){
        $state.go("h5.exam", {pageType:0});
    }

    $scope.selectRecord = function(item,isclick){
        if ( isclick == "true" ) {
            $scope.itSelect = item;
            $scope.isShowMask = true;
        }
    }
    /**
     * 预约点击
     */
    $scope.examSelect = function(){
        //ITFC_ADDR.EXAM_DOAPNTMT =  "http://localhost:80/ctms2/apntmtstu/examPlanApntmt_doApntmt.do"; //预约
        var url =  ITFC_ADDR.EXAM_DOAPNTMT;//+"?date="+dateStr+"&idCard="+idCard;
        // console.log(imgData);
        myLandAjax(url, {planId:$scope.itSelect.id},
            function(postDataObj, resDataObj) {
                //取数成功
                alert("预约成功！");
                $scope.isShowMask = false;
                $(".calender-body > a").remove();
                createDateC($scope.defValue.getFullYear(), $scope.defValue.getMonth() +1);
            },
            function(postDataObj, resErrMsg) {
                // 取数失败

            }
        );
    }
    /**
     * 取消预约
     */
    $scope.examNoSelect = function(){
        //ITFC_ADDR.EXAM_DOAPNTMT =  "http://localhost:80/ctms2/apntmtstu/examPlanApntmt_doCancel.do"; //预约
        var url =  ITFC_ADDR.EXAM_DOCANCELAPNTMT;//+"?date="+dateStr+"&idCard="+idCard;
        // console.log(imgData);
        myLandAjax(url, {recordId:$scope.itSelect.rid},
            function(postDataObj, resDataObj) {
                //取数成功
                alert("取消预约成功！");
                $scope.isShowMask = false;
                $(".calender-body > a").remove();
                createDateC($scope.defValue.getFullYear(), $scope.defValue.getMonth() +1);
            },
            function(postDataObj, resErrMsg) {
                // 取数失败

            }
        );
    }

    function queryDateByData(idCard,dateStr){

        //ITFC_ADDR.EXAM_QUERY =  "http://localhost:80/ctms2/apntmtstu/query.do"; //预约
        var url =  ITFC_ADDR.EXAM_QUERY;//+"?date="+dateStr+"&idCard="+idCard;
       myLandAjax(url, {date:dateStr,"idCard":idCard},
            function(postDataObj, resDataObj) {
                //取数成功
                var scheduleDate = resDataObj.schedule;
             //  var scheduleDate=[{"id":615,"examDate":"20180201","examTimeBegin":"08:45:00","planNum":50,"appointmentNum":43,"planName":"20180201考试计划08:45-09:45"},{"id":616,"examDate":"20180201","examTimeBegin":"09:45:00","planNum":50,"appointmentNum":40,"planName":"20180201考试计划09:45-10:45"},{"id":617,"examDate":"20180205","examTimeBegin":"08:45:00","planNum":50,"appointmentNum":45,"planName":"20180205考试计划08:45-09:45"},{"id":618,"examDate":"20180205","examTimeBegin":"09:45:00","planNum":50,"appointmentNum":45,"planName":"20180205考试计划09:45-10:45"},{"id":619,"examDate":"20180206","examTimeBegin":"08:45:00","planNum":50,"appointmentNum":43,"planName":"20180206考试计划08:45-09:45"},{"id":620,"examDate":"20180206","examTimeBegin":"09:45:00","planNum":50,"appointmentNum":39,"planName":"20180206考试计划09:45-10:45"},{"id":621,"examDate":"20180207","examTimeBegin":"08:45:00","planNum":50,"appointmentNum":47,"planName":"20180207考试计划08:45-09:45"},{"id":622,"examDate":"20180207","examTimeBegin":"09:45:00","planNum":50,"appointmentNum":44,"planName":"20180207考试计划09:45-10:45"},{"id":623,"examDate":"20180208","examTimeBegin":"08:45:00","planNum":50,"appointmentNum":48,"planName":"20180208考试计划08:45-09:45"},{"id":624,"examDate":"20180208","examTimeBegin":"09:45:00","planNum":50,"appointmentNum":45,"planName":"20180208考试计划09:45-10:45"},{"id":625,"examDate":"20180211","examTimeBegin":"08:45:00","planNum":50,"appointmentNum":46,"planName":"20180211考试计划08:45-09:45"},{"id":626,"examDate":"20180211","examTimeBegin":"09:45:00","planNum":50,"appointmentNum":40,"planName":"20180211考试计划09:45-10:45"},{"id":627,"examDate":"20180212","examTimeBegin":"08:45:00","planNum":50,"appointmentNum":42,"planName":"20180212考试计划08:45-09:45"},{"id":628,"examDate":"20180212","examTimeBegin":"09:45:00","planNum":50,"appointmentNum":41,"planName":"20180212考试计划09:45-10:45"},{"id":629,"examDate":"20180213","examTimeBegin":"08:45:00","planNum":50,"appointmentNum":42,"planName":"20180213考试计划08:45-09:45"},{"id":630,"examDate":"20180213","examTimeBegin":"09:45:00","planNum":50,"appointmentNum":45,"planName":"20180213考试计划09:45-10:45"},{"id":632,"examDate":"20180222","examTimeBegin":"08:45:00","planNum":50,"appointmentNum":46,"planName":"20180222考试计划08:45-09:45"},{"id":633,"examDate":"20180222","examTimeBegin":"09:45:00","planNum":50,"appointmentNum":50,"planName":"20180222考试计划09:45-10:45"},{"id":634,"examDate":"20180224","examTimeBegin":"08:45:00","planNum":50,"appointmentNum":40,"planName":"20180224考试计划08:45-09:45"},{"id":635,"examDate":"20180224","examTimeBegin":"09:45:00","planNum":50,"appointmentNum":50,"planName":"20180224考试计划09:45-10:45"}];
                var record = resDataObj.record;
              /*  var record=[];*/
                //解析当前月的数据
                scheduleDate.forEach(function(t,n,th){
                    var dateStr = t.examDate;
                    $scope.selfArr.filter(function(e,i,thi){
                        //console.log(e.date," ",dateStr);
                        if  ( e.date == dateStr) {
                            var obj = {};
                            $.extend(obj,t);
                            //过期的
                            var dateT = new Date();
                            dateT.setDate(dateT.getDate() + 2);
                            var yy = e.date.substr(0,4);
                            var mm = e.date.substr(4,2);
                            var dd = e.date.substr(6,2);
                           console.log(e.date,"--",yy,mm,dd);
                            var date = new Date(yy,parseInt(mm,10) - 1,dd);
                            obj.isClick = "true";
                            console.log(dateT," ",date);
                            if ( dateT > date ) obj.isClick = "false";
                             if(t.appointmentNum>=t.planNum)obj.isClick = "false";
                            if ( !e.dataArr ) e.dataArr=[];
                            e.dataArr.push(obj);
                           // console.log(obj);
                        }
                    })
                });
                //分析当月已预约数据
                record.forEach(function(t,n,th){
                    var dateStr = t.examDate;
                    $scope.selfArr.filter(function(e,i,thi){
                        //console.log(e.date," ",dateStr);
                        if  ( e.date == dateStr) {
                            var obj = {};
                            $.extend(obj,t);
                            //过期的
                            var dateT = new Date();
                            dateT.setDate(dateT.getDate() + 5);
                            var yy = e.date.substr(0,4);
                            var mm = e.date.substr(4,2);
                            var dd = e.date.substr(5,2);
                            //  console.log(yy,mm,dd);
                            var date = new Date(yy,parseInt(mm,10) - 1,dd);
                            obj.isClick = "true";

                            if ( dateT > date ) obj.isClick = "false";
                             if(t.appointmentNum>=t.planNum)obj.isClick = "false";
                            if ( !e.dataArr ) e.dataArr=[];

                            if (e.dataArr.length > 0) {
                                for (var i = 0; i < e.dataArr.length ; i++){
                                    var item = e.dataArr[i];
                                    if ( item.id == t.scheduleId ) {
                                        var itemId = item.id;
                                        var rid = t.id;
                                        $.extend(item,t);
                                        item.id = itemId;
                                        item.rid = rid;//记录ID
                                        item.isPlanExam = true;
                                        console.log(item);
                                    }

                                }
                            }
                            //e.dataArr.push(obj);
                            // console.log(obj);
                        }
                    })
                });
                setTimeout(function(){
                    $(".container").show();
                },200);

                $scope.isShowBody = true;
            },
            function(postDataObj, resErrMsg) {
                // 取数失败
                $state.go("h5.cource", {});
            }
        );
    }

}]);
