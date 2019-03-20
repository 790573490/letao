$(function () {
    /*
    * 1。进入页面发送ajax请求，获取购物车数据
    *
    *   用户未登录，拦截到登录页
    *   用户已登录。返回购物车数据，渲染页面
    * */
    render();
    function render(){
        setTimeout(function () {
            $.ajax({
                type:"get",
                url:"/cart/queryCart",
                dataType:"json",
                success:function (info) {
                    console.log(info);
                    if(info.error === 400){
                        //未登录
                        location.href = "login.html";
                        return;
                    }
                    //已登录。通过末班渲染
                    var htmlStr = template("cartTpl",{arr:info});
                    $(".lt_main .mui-table-view").html(htmlStr);

                    //渲染完成需要关闭下拉刷新
                    mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
                }
            });
        },500)

    }

    //2.配置下拉刷新
    mui.init({
        pullRefresh : {
            container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down : {
                height:50,//可选,默认50.触发下拉刷新拖动距离,
                auto: true,//可选,默认false.首次加载自动下拉刷新一次
                contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                callback :function(){
                    console.log("下拉刷新了");
                    //发送ajax请求渲染页面;
                    render();



                } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            }
        }
    });


    /*
    * 3.删除功能
    *       事件委托注册事件，
    *       同时通过tap事件注册，a标签的click事件被下拉刷新功能禁止了
    *       存储id
    *       发送ajax
    *       页面渲染
    * */
    var arr = [];
    $(".lt_main").on("tap",".btn_del",function () {
        var id = $(this).data("id");
        arr.push(id);
        // console.log(arr);
        $.ajax({
            type:"get",
            url:"/cart/deleteCart",
            data:{
                id:arr,
            },
            dataType: "json",
            success:function (info) {
                if(info.success){
                    //渲染页面
                    //调用一次下拉刷新
                    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
                }
            }
        })
    })


});