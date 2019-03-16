$(function () {
    /*
    *
    * 进行表单校验配置
    * 检验要求：
    *       1.用户名不能为空，长度为2-6位
    *       2.密码不能为空，长度为6-12位
    * */
    $("#form").bootstrapValidator({
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
                    }
                }

            }

        }
    })
});