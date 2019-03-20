
$(function () {
    /*
    * 1.一进入页面，请求当前用户数据，进行页面渲染
    *       用户已经登录，宏泰返回用户数据，进行模板渲染
    *       用户没有登录，后台返回error，当前用户未登录，拦截到登录页
    * 2.退出功能
    * */
    $.ajax({
        type:"get",
        url:"/user/queryUserMessage",
        dataType:"json",
        success:function (info) {
            console.log(info);
            if(info.error === 400){
                location.href="login.html";
                return;
            }
            //用户已登录，渲染页面
            var htmlStr = template("userTpl",info);
            $("#userInfo").html(htmlStr);
        }
    })


    //2.退出功能个
    $(".logoutBtn").click(function () {
        //发送请求，进行退出操作
        $.ajax({
            type:"get",
            url: "/user/logout",
            dataType:"json",
            success:function (info) {
                console.log(info);
                if( info.success ){
                    location.href = "login.html";
                }
            }
        })
    })

});