

$(function () {
    // 进入页面发送ajax请求获取数据，通过模板引擎渲染
    var currentPage = 1;
    var pageSize = 5;

    render();
    function render() {
        $.ajax({
            type:"get",
            url:"/category/queryTopCategoryPaging",
            data:{
                page:currentPage,
                pageSize:pageSize,
            },
            dataType:"json",
            success:function (info) {
                console.log(info);
                var htmlStr = template( "tpl",info );
                $('tbody').html(htmlStr);

                //进行分页初始化
                $("#paginator").bootstrapPaginator({
                    //指定版本
                    bootstrapMajorVersion:3,
                    //总页数
                    totalPages:Math.ceil(info.total /info.size),
                    //当前页数
                    currentPage:info.page,
                    onPageClicked:function (a, b, c, page) {
                        //更新当前页
                        currentPage = page;
                        render();
                    }

                })

            }
        })
    }


    $("#addBtn").click(function () {
        $('#addModal').modal("show");
    });


    //3.使用表单校验插件，校验数据
    $('#form').bootstrapValidator({
        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',            //校验成功
            invalid: 'glyphicon glyphicon-remove',      //校验失败
            validating: 'glyphicon glyphicon-refresh'   //校验中
        },
        //配置字段
        fields:{
            categoryName:{
                validators:{
                    notEmpty:{
                        message:"一级分类不能为空",
                    }
                }
            }
        }
    });

    //4.阻止默认的成功提交，通过ajax进行提交
    $('#form').on("success.form.bv",function (e) {
        e.preventDefault();
        $.ajax({
            type:'post',
            url:"/category/addTopCategory",
            data:$('#form').serialize(),
            dataType: "json",
            success:function (info) {
                console.log(info);
                if(info.success){
                    /*关闭模态框*/
                    $('#addModal').modal("hide");
                    /*重新渲染第一页*/
                    currentPage = 1;
                    render();
                    /*重置表单， 传 true 不仅重置表单校验状态，同时重置表单内容 */
                    $("#form").data("bootstrapValidator").resetForm(true);
                }
            }

        })
    })

});