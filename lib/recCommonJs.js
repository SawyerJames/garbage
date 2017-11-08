$(function() {
    // 时间插件
    var currYear = (new Date()).getFullYear();
    var opt = {};
    opt.datetime = { preset: 'datetime' };
    opt.default = {
        theme: 'android-ics light',
        display: 'modal', //显示方式 
        mode: 'scroller', //日期选择模式
        dateFormat: 'yyyy-mm-dd',
        lang: 'zh',
        showNow: true,
        nowText: "今天",
        startYear: currYear, //开始年份
        endYear: currYear, //结束年份
        minDate: new Date(),
        setText: '确定',
        cancelText: '取消',
    };
    var optDateTime = $.extend(opt['datetime'], opt['default']);
    var optTime = $.extend(opt['time'], opt['default']);
    // 轮播插件
    $("#appDateTime").mobiscroll(optDateTime).datetime(optDateTime);
    $("#silder").silder({
        data: [{
            "img": "../../img/silder/1-1.jpg",
            "link": "",
            "alt": ""
        }, {
            "img": "../../img/silder/2-1.jpg",
            "link": "",
            "alt": ""
        }, {
            "img": "../../img/silder/3-1.png",
            "link": "",
            "alt": ""
        }],
        auto: true,
        speed: 20,
        sideCtrl: false,
        "defaultView": 0, //默认显示的所引，IE8不能使用default，否则会报错
        interval: 3000,
        activeClass: "active", //小的控制按钮激活的样式，不包括作用两边，默认active
        bottomCtrl: false, //是否显示下边的控制按钮
    });
    // 上传插件
    var imgname = "";
    var imgid = "";
    // 点击上传图片按钮
    $('#imghead').click(function() {
        imgid = $(this).attr('id');
        imgname = $(this).closest('div').find('input[type=hidden]').attr('name');
        console.log(imgid);
        console.log(imgname);
        $('#file').click();
    });

    wx.config({
        debug: false,
        appId: '{$wx_config.appId}',
        timestamp: '{$wx_config.timestamp}',
        nonceStr: '{$wx_config.nonceStr}',
        signature: '{$wx_config.signature}',
        jsApiList: ['chooseImage', 'uploadImage']
    });

    wx.ready(function() {
        $('#file').on('click', function() {
            wx.chooseImage({
                count: 1, // 默认9
                sizeType: ['compressed'],
                sourceType: ['album', 'camera'],
                success: function(res) {
                    var localIds = res.localIds;
                    //upload
                    wx.uploadImage({
                        localId: localIds[0],
                        isShowProgressTips: 1,
                        success: function(res) {
                            var serverId = res.serverId;
                            server__id = serverId;
                            //save server
                            $.post('{:U("upload")}', { 'serverId': serverId },
                                function(ret) {
                                    if (ret['status'] != '00') {
                                        url = serverId;
                                        alert('上传失败，请重试！');
                                    } else {
                                        url = ret['data'];
                                        id = ret['id'];
                                        $('#' + imgid).attr('src', '/uploads' + url);
                                        $('#' + imgid).attr('width', '80%');
                                        /*if(imgid=='imghead'){*/
                                        $('input[name=' + imgname + ']').val(id);
                                        /*}else{*/
                                        //$('input[name='+imgid+']').val(id);
                                        /*}*/
                                    }
                                    //alert(url);
                                }, 'json'
                            );
                        }
                    });
                }
            });
        });
    });
    wx.error(function(res) {
        console.log(res);
        alert('信息调用有误，请重新刷新本页面');
    });
});
