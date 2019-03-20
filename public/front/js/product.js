


$(function () {
    // 1.获取地址栏的productId，发送ajax，进行渲染
    var productId = getSearch("productId");
    console.log(productId);
    $.ajax({
        type:"get",
        url:"/product/queryProductDetail",
        data:{
            id:productId,
        },
        dataType:"json",
        success:function (info) {
            console.log(info);
            var htmlStr = template("productTpl",info);
            $(".lt_main .mui-scroll").html(htmlStr);
            //手动更尽心管轮播初始化
            //获得slider插件对象
            var gallery = mui('.mui-slider');
            gallery.slider({
                interval: 5000//自动轮播周期，若为0则不自动播放，默认为0；
            });

            //手动初始化数字框
            mui(".mui-numbox").numbox()
        }
    });


    //功能2：让尺码可以选中
    $(".lt_main").on("click",".lt_size span",function () {
        $( this ).addClass("current").siblings().removeClass("current")
    });
    //功能3：加入购物车
    //      1.添加点击事件
    //      2、收集尺码，数量，产品id，发送ajax请求
    $("#addCart").click(function () {
        var size = $('.lt_size span.current').text();
        var num = $(".mui-numbox-input").val();
        if( !size ){
            mui.toast("请选择尺码");
            return;
        }

        //发送ajax
        $.ajax({
            type:"post",
            url:"/cart/addCart",
            data:{
                productId:productId,
                num:num,
                size:size,
            },
            dataType: "json",
            success:function (info) {
                console.log(info);
                if( info.error === 400){
                    //跳转到登录页
                    location.href = "login.html?retUrl="+location.href;
                }
                if( info.success ){
                    mui.confirm("添加成功","温馨提示",["去购物车","继续浏览"],function (e) {
                        if(e.index === 0){
                            //去购物车
                            location.href = "cart.html";
                        }
                    })
                }
            }
        })
    })
});