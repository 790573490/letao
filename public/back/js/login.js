$(function () {
    /*
    *
    * 进行表单校验配置
    * 检验要求：
    *       1.用户名不能为空，长度为2-6位
    *       2.密码不能为空，长度为6-12位
    * */
    $("#form").bootstrapValidator({

        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',            //校验成功
            invalid: 'glyphicon glyphicon-remove',      //校验失败
            validating: 'glyphicon glyphicon-refresh'   //校验中
        },
        //配置字段
        fields:{
            username:{//此对象与表单name 关联
                validators:{
                    //非空
                    notEmpty:{
                        //提示信息
                        message:"用户名不能为空"
                    },
                    stringLength:{
                        min:2,
                        max:6,
                        message:"用户名长度必须在2-6位"
                    },
                    callback:{
                        message:"用户名不存在",
                    }
                }
            },
            password:{
                validators:{
                    notEmpty:{
                        message: "密码不能为空"
                    },
                    stringLength:{
                        min:6,
                        max:12,
                        message:"密码长度必须在6-12位"
                    },
                    callback:{
                        message:"密码错误",
                    }
                }

            }

        }
    });

    /*
    * 功能2：登录
    *       表单校验插件会提交表单时进行校验
    *       1.校验成功，默认就提交表单，会发生页面跳转，我们需要注册表单校验成功事件，阻止默认的提交，通过ajax进行发送请求
    *       2.校验失败，不会提交表单，配置插件提示用户即可
    * */
    $("#form").on("success.form.bv",function (e) {
        //阻止默认的表单提交
        e.preventDefault();
        console.log('表单校验成功后，阻止跳转');
        //通过ajax提交
        $.ajax({
            type:"post",
            url:"/employee/employeeLogin",
            data:$('#form').serialize(),
            dataType:'json',
            success:function (info) {
                console.log(info);
                //登陆成功跳转到首页
                if (info.success){
                    location.href="index.html";
                }
                if(info.error === 1000){
                    console.log("当前用户不存在");
                    //更新校验参数
                    $('#form').data('bootstrapValidator').updateStatus("username","INVALID","callback")
                }
                if(info.error === 1001){
                    console.log("密码不正确");
                    $('#form').data("bootstrapValidator").updateStatus("password","INVALID","callback")
                }
            },
            error:function (error) {
                alert('请求错误，请联系管理员，错误代码TY1547');
            }
        })
    });

    //重置功能
    $("[type='reset']").on('click',function () {
        //resetForm(boolean)  进行重置校验状态 传true 重置表单内容额表单状态， 传false，重置表单状态
        $("#form").data('bootstrapValidator').resetForm();
    })
});