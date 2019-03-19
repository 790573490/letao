
/*对所有页面区域滚动初始化*/
mui('.mui-scroll-wrapper').scroll({
    deceleration: 0.0005, //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    scrollY: true, //是否竖向滚动
    scrollX: false, //是否横向滚动
    startX: 0, //初始化时滚动至x
    startY: 0, //初始化时滚动至y
    indicators: false, //是否显示滚动条
    bounce: true //是否启用回弹
});


//配置轮播图自动轮播
//获得slider插件对象
var gallery = mui('.mui-slider');
gallery.slider({
    interval:10000,//自动轮播周期，若为0则不自动播放，默认为0；
});


//该方法专门用于解析地址栏参数
function getSearch( k ){
    //获取地址栏参数
    var sezrch =location.search //name=oo&age=18&desc=%E5%B8%85"
    //将其解码为中文
    sezrch = decodeURI(sezrch);
    //去掉问号
    sezrch = sezrch.slice(1);
    //按照 & 截取字符串
    var arr = sezrch.split("&");
    // 将arr转换为对象
    var obj={};
    arr.forEach(function (v ,i) {
        var key = v.split("=")[0];
        var value = v.split("=")[1];
        //中括号语法可以解析变量
        obj[key] = value;
    });
    return obj[ k ];
}