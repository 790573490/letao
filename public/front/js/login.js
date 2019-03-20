$(function () {
    /*登录功能
        1.给登录按钮注册点击事件
        2.获取用户名，和密码
        2、发送ajax请求，进行登录验证
             1. 登录成功，
                    如果是别的页面拦截过来的。返回拦截的页面
                    如果是直接访问login。html。返回个人中心
             2、登录失败，提示用户
    */
    $("#loginBtn").click(function () {
        //
        var username = $("#username").val().trim();
        var password = $("#password").val().trim();
        if( username === ''){
            mui.toast("请输入用户名");
            return;
        }
        if( password === ''){
            mui.toast("请输入密码");
            return;
        }


        $.ajax({
            type:"post",
            url:"/user/login",
            data:{
                username:username,
                password:password,
            },
            dataType:"json",
            success:function (info) {
                console.log(info);
                if(info.error === 403 ){
                    mui.toast("用户名或者密码错误");
                }
                if(location.search.indexOf("retUrl") > -1){
                    //说明是从其他页面拦截过来的，
                    var retUrl= location.search.replace("?retUrl=","");
                    location.href = retUrl;
                }
                else{
                    //直接访问的，跳回个人中心也
                    location.href = "user.html";
                }
            }

        })

    })

});