//开启进度条
// NProgress.start();
//
// setTimeout(function () {
//
//     NProgress.done();
// },2000);


//实现在第一个ajax请求发送的时候，开启进度条
//在所有的ajax请求都完成的时候，关闭进度条

//1.ajaxComplete    每个ajax 请求完成的时候调用，（不管成功失败）
//2.ajaxError       ajax请求失败的时候，调用
//3.ajaxSend        在每个ajax请求之前发送请求，调用
//4.ajaxSuccess     ajax请求成功后，调用
//5.ajaxStart       在第一个 ajax 发送时。调用
//6.ajaxStop        在所有的ajax请求完成时，调用


$(document).ajaxStart(function () {
    NProgress.start();
});

$(document).ajaxStop(function () {
    NProgress.done();
});

//登录拦截功能,登录页面不需要校验
//因为前后分离，前端不知道该用户是否登录了，但是后台不知道
//发送ajax请求，查询用户状态即可
//用户已登录，啥都不用做，让用户继续访问
//用户未登录，拦截到登录页

if( location.href.indexOf("login.html")=== -1){
    $.ajax({
        type:"get",
        url:"/employee/checkRootLogin",
        dataType: "json",
        success:function (info) {
            console.log(info);
            if(info.success){
                console.log("用户已登录");
            }
            if(info.error === 400){
                console.log("用户未登录");
                location.href="login.html";
            }

        }
    });
}





$(function () {
    //分类管理切换功能
    $('.nav .category').click(function () {
        $('.nav .child').stop().slideToggle();
    });



    //左边侧边栏切换功能
    $('.icon_menu').click(function () {
        $(".lt_aside").toggleClass("hidemenu");
        $(".lt_topbar").toggleClass("hidemenu");
        $(".lt_main").toggleClass("hidemenu");
    });

    //点击退出，弹出模态框
    $('.icon_logout').click(function () {
        $('#logoutModal').modal('show');
    });

    //点击模态框的退出按钮
    $('#logoutBtn').click(function () {
        $.ajax({
            type:"GET",
            url:"/employee/employeeLogout",
            dataType:"json",
            success:function (info) {
                console.log(info);
                if( info.success ){
                    //退出成功，跳转登录界面
                    location.href="login.html";
                }
            }
        })
    })


});

















