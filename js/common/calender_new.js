/**
 * Created by HP on 2015/1/26.
 */
var CalendarSelectTime = $.fn.CalendarSelectTime = function(domId,config){
    //alert(domId);
    var dom = this.dom = $(domId);
    if ( dom.length == 0 )
    {
        alert("没有"+domId+"的对象在document.body中");
    }

    this.el = dom.get(0);
    this.config = config || {
        width:dom.width(),
        height:dom.height(),
        css:"",
        style:"",
        columns:[],
        dataPro:[]  //数据源
    };

    this.width = this.config.width || 684;
    this.height = this.config.height || 387;
    this.defValue = config.defValue || new Date();
    this.clickFun = config.selectFun || null;

    dom.width(this.width).height(this.height).addClass("calendarST-body");
    var titleTpl = this.titleTpl = ['<div class="calendarST-toolbar"  >',
        '<div class="calender-title" align="center">',
        '<ul>',
//        '<li></li>',
        '<li>一</li>',
        '<li>二</li>',
        '<li>三</li>',
        '<li>四</li>',
        '<li>五</li>',
        '<li class="green" >六</li>',
        '<li class="green" >日</li>',
        '</ul>',
        '</div>',
        '<div class="calender-content">',
//        '<div class="calender-leftC"  align="center">',
//        '<span class="calender-dateSet">',
//        '<span class="glyphicon glyphicon-chevron-up "></span>',
//        '</span>',
//        '<div class="calender-dateSet">',
//        '<span class="calender-text" ></span>',
//        '</div>',
//        '<span class="calender-dateSet">',
//        '<span class="glyphicon glyphicon-chevron-down" ></span>',
//        '</span>',
//        '</div>',
        '<div class="calender-rightC floatLeft">',
        '<div class="calender-body Month"> ',
        '</div>',
//        '<div class="calender-body downMonth"> ',
//        '</div>',
//        '<div class="calender-body upMonth"> ',
//        '</div>',
        '</div>',
        '<div class="background-Text ">',
        '</div>',
        '</div>',
        '</div>'
    ].join("\n");

    dom.append(titleTpl);
    this.init();
}

CalendarSelectTime.prototype = {
    /*
     初始化操作
     */
    init: function(){
        this.MonHead = [31,28,31,30,31,30,31,31,30,31,30,31];
        window["week"] = this.week = ["日","一","二","三","四","五","六"];
        this.Month = ["一","二","三","四","五","六","七","八","九","十","十一","十二"];
        this.upOrDown = "";

        var timeD  = this.defValue || new Date();
        var timeU = this.defValue || new Date();
        $(".calender-text").text(timeD.getFullYear()+"年"+ (timeD.getMonth() +1)+"月");
        $(".background-Text",this.dom).text((timeD.getMonth() +1)+"  月");

        // var timeD = new Date(timeD.getFullYear(),timeD.getMonth() + 1,1);
        if (  timeD.getMonth() == 11 ) {
            timeD = new Date(timeD.getFullYear() + 1,0,1);
        }  else {
            timeD =   new Date(timeD.getFullYear(),timeD.getMonth() + 1,1);
        }

        if (  timeU.getMonth() == 0 ) {
            timeU = new Date(timeU.getFullYear() - 1,0,1);
        }  else {
            timeU =   new Date(timeD.getFullYear(),timeU.getMonth() - 1,1);
        }

        this.createDateC();
       //this.createDateC(timeD,this.dom.find(".calender-body.downMonth",this.dom));
        //this.createDateC(timeU,this.dom.find(".calender-body.upMonth",this.dom));
       // $(".calender-body.upMonth",this.dom).css({"position":"relative",top:this.dom.find(".calender-body.upMonth",this.dom).height() * -3+"px"}).get(0);

        this.timeSelected =  new Date(this.defValue) || new Date();
        var that = this;
        //对上下按钮注册事件
        $(".rightCBut").click(function(){

//            var height = $(el).height();
//            var el2 =  $(".calender-body.downMonth",that.dom).css({"position":"relative",top:0+"px"}).get(0);
//            TweenMax.to(el,1,{top:0 - height});
//            TweenMax.to(el2,1,{top:0 - height ,onComplete:function(){
//                var el =  $(".calender-body.Month",that.dom);
//                var el2 = $(".calender-body.downMonth",that.dom);
                //当前时间修改
                that.timeSelected.setMonth(that.timeSelected.getMonth() + 1);
               // that.defValue = that.timeSelected;
                timeD =  new Date(that.timeSelected);
                var dateNew = new Date();

            var monthC = (timeD - dateNew)/1000/60/60/24;
            if ( monthC > 60 ) {
                that.timeSelected.setMonth(that.timeSelected.getMonth() - 1);
                return;
            }
            var el = $(".calender-body.Month",that.dom).html('');
//                if ( that.upOrDown == "down" || that.upOrDown.length == 0 )
//                    el.html(el2.html()).css({"position":"relative",top:0+"px"});
//                else {
//                    // alert(that.timeSelected.getMonth+1);
//                    el.html("").css({"position":"relative",top:0+"px"});
//                    that.createDateC(that.timeSelected,el);
//                }
//                el2.html("").css({"position":"relative",top:0+"px"});

                that.createDateC(timeD);

                $(".calender-text").text(that.timeSelected.getFullYear()+"年"+ (that.timeSelected.getMonth() + 1 )+"月");
                $(".background-Text",that.dom).text((that.timeSelected.getMonth() + 1)+"  月");

                $("a",that.dom).click(function(){return false});
                that.upOrDown = "down"; //方向
//            }});
        });
        //向上一月
        $(".leftCBut").click(function(){

//            var height = $(el).height();
//            var el2 =  $(".calender-body.upMonth",that.dom).css({"position":"relative",top:height * -3+"px"}).get(0);
//
//            TweenMax.to(el,1,{top:height});
//            TweenMax.to(el2,1,{top:height * -2 ,onComplete:function(){
//                var el =  $(".calender-body.Month",that.dom);
//                var el2 = $(".calender-body.upMonth",that.dom);
                //当前时间修改
                that.timeSelected.setMonth(that.timeSelected.getMonth() - 1);
                //that.defValue = that.timeSelected;
                timeU =  new Date(that.timeSelected);
                var dateNew = new Date();

            var monthC = (timeU - dateNew)/1000/60/60/24;
           // alert(monthC);
            if ( monthC <= -30 ) {
                that.timeSelected.setMonth(that.timeSelected.getMonth()+ 1);
                return;
            }
            var el = $(".calender-body.Month",that.dom).html('');

//                if ( that.upOrDown == "down"  )
//                    el.html(el2.html()).css({"position":"relative",top:0+"px"});
//                else  {
//                    // alert(that.timeSelected.getMonth+1);
//                    el.html("").css({"position":"relative",top:0+"px"});
//                    that.createDateC(that.timeSelected,el);
//                }
//                el2.html("").css({"position":"relative",top:that.dom.find(".calender-body.upMonth").height() * -3+"px"});

                that.createDateC(timeU);

                $(".calender-text").text(that.timeSelected.getFullYear()+"年"+ (that.timeSelected.getMonth() + 1  )+"月");
                $(".background-Text",that.dom).text((that.timeSelected.getMonth() - 1 )+"  月");

                $("a",that.dom).click(function(){return false});
                that.upOrDown = "up";//方向
//            }});
        });
        $("a",this.dom).click(function(){return false});
    },/* 日历 */
    createDateC:function(dateTime,body){
        var childDom =  body || this.dom.find(".calender-body.Month");
        childDom.html('');
        dateTime =  dateTime || this.defValue || new Date();
        $(".background-Text",this.dom).text((dateTime.getMonth() +1)+"  月");
        this.setMonth(dateTime.getFullYear(), dateTime.getMonth() +1,childDom);
    },
    createSpan:function(inText, background, isData) {

        var html = [
            //'<span>'+
                '<a class="enabled" target="_blank" data-date="" href="javaScript:void(0)">'+
                '<span class="date textV">'+inText+'</span>'+
//                '<span class="data val">'+
//                '<span>¥<strong>660</strong>'+
//                '</span>'+
//                '<i class="fenN">仅剩1份</i>'+
                '</span>' +
                '</a>'
            //  '</span>'
        ].join("\n");
        var that = this;
        var spanDom = $(html).appendTo(document.body);
        spanDom.click(function(){
            if ( that.clickFun )
            that.clickFun($(this));
            return false;
        })
        return spanDom;
    },
    setMonth:function(yy, mm,childDom) {

        // this.dateContainer.dateTitle.innerText = yy + " 年 " + this.Month[mm - 1] + " 月";
        // this.dateContainer.style.display = "none";
        var firstday = new Date(yy, mm - 1, 1).getDay();
        var upmonth = 0;

        var dayNum = 0; //天数记录

        if (mm == 1 ) {
            upmonth = 31;
        } else if ( mm == 2) {
            upmonth = 31;
        }
        else {
            upmonth = this.MonHead[mm - 2];
        }
        if (upmonth == 28 && this.IsPinYear(yy)) upmonth = 29; //闰年的计算
        var enddata = this.MonHead[mm - 1] ;
        if (enddata == 28 && this.IsPinYear(yy)) upmonth = 29;
        var endday =  7- new Date(yy, mm - 1, enddata).getDay();

        var upday =  7 - (7 - firstday + 1)  ;//从6开始算星期，0为星期天，当前星期3应为3 ,这里算的是差值 用周6减去今天周几，然后减去今天
        upday = upday < 0 ? 6 :upday; //如果小于0，则第1天是星期天，前面有6天，然后去掉自己的这天。

        var begM = upmonth + 1  - upday; //当前日期加上它自己的1天

        // if (firstday != 0) {
        for (var i = begM; i <= upmonth; i++) {
            dayNum +=1;
            var dateweek = this.createSpan(i, "#AAAAAA", true);
            var dd = i ;
            if (i < 10) dd = "0" + i;
            if (mm == 1) {
                dateweek.data("date",yy - 1 + "" + 12 + "-" + dd);
                dateweek.data("dateVal",new Date(yy - 1,11,dd));
            } else {
                dateweek.data("date", yy + "-" + (mm - 1) + "-" + dd);
                dateweek.data("dateVal",new Date(yy ,mm - 2,dd));
            }
            childDom.append(dateweek);
            dateweek.unbind("click").find(".val,i").hide();
            dateweek.addClass("fristMonth");


            var dateNowDay = this.defValue || new Date();
            if ( yy == dateNowDay.getYear() && mm  == dateNowDay.getMonth() + 1 && dd == dateNowDay.getDate() ){
                dateweek.parent().addClass("active");
            }
        }
        //       }
        for (var i = 1; i <= this.MonHead[mm - 1]; i++) {
            var dateweek = this.createSpan(i, "#DDDDDD", true);
            dayNum +=1;
            var dd = i ;
            if (i < 10) dd = "0" + i;
            dateweek.data("date", yy + "-" + mm + "-" + dd);
            dateweek.data("isThisMonth", true);
            childDom.append(dateweek);
            dateweek.addClass("thisMonth");
            var dateNowDay = new Date();
            dateweek.data("dateVal",new Date(yy,mm - 1,dd));
            // alert(mm+" "+dateNowDay.getMonth()+" "+dd+" "+dateNowDay.getDate());
            //    this.dateMandiv.appendChild(dateweek);
            if ( yy == dateNowDay.getFullYear() && mm  == dateNowDay.getMonth() + 1 &&  dd < dateNowDay.getDate() ) {
                dateweek.unbind("click").find(".val,i").hide();
                dateweek.addClass("fristMonth");
            }
            var dateNowDay = this.defValue || new Date();
           //

            if ( yy == dateNowDay.getFullYear() && mm  == dateNowDay.getMonth() + 1 && dd == dateNowDay.getDate() ){
                dateweek.addClass("active");
            }
        }
        for (var i = 1; i <= endday; i++) {
            var dateweek = this.createSpan(i, "#AAAAAA", true);
            dayNum +=1;
            var dd = i ;
            if (i < 10) dd = "0" + i;
            var dateT = new Date();
            if (mm == 12) {
                dateweek.data("date", yy + 1 + "-01-" + dd);
                dateT = new Date(yy + 1,0,dd);
                dateweek.data("dateVal",dateT);
            } else {
                dateweek.data("date", yy + "-" + (mm + 1) + "-" + dd);
                dateweek.data("dateVal", new Date(yy, mm, dd));
            }
            dateweek.isThisMonth = false;

            childDom.append(dateweek);
            dateweek.addClass("endMonth");
            var dateNowDay = new Date()
            var dateNowDay = this.defValue || new Date();
            if ( yy == dateNowDay.getYear() && mm  == dateNowDay.getMonth() + 1 && dd == dateNowDay.getDate() ){
                dateweek.parent().addClass("active");
            }
            dateweek.unbind("click").find(".val,i").hide();
            dateweek.addClass("fristMonth");
        }

        var row = dayNum/7;
        if ( row < 6 ) {
            for ( var i = 0; i < 7;i++) {
                var dayT = endday + 1+ i;
                var dateweek = this.createSpan(dayT, "#AAAAAA", true);
                dateweek.data("dateVal", new Date(yy, mm , dayT));
                childDom.append(dateweek);
                dateweek.addClass("endMonth");
                dateweek.unbind("click").find(".val,i").hide();
                dateweek.addClass("fristMonth");
            }

        }
    },
    IsPinYear:function(year) //判断是否闰平年
    {
        if (0 == year % 4 && ((year % 100 != 0) || (year % 400 == 0))) return true; else return false;
    }
}