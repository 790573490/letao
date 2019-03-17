$(function () {

    var currentPage = 1;
    var pageSize = 5;


    //1一进入页面发送ajax请求，渲染页面
    render();
    function render() {
        $.ajax({
            type:"get",
            url:"/category/querySecondCategoryPaging",
            data:{
                page:currentPage,
                pageSize:pageSize,
            },
            dataType:"json",
            success:function (info) {
                console.log(info);
                var htmlStr = template( "tpl",info );
                $('tbody').html(htmlStr);

                /*进行分页初始化*/
                $('#paginator').bootstrapPaginator({
                    bootstrapMajorVersion:3,
                    currentPage:info.page,
                    totalPages: Math.ceil(info.total / info.size),
                //    添加页码点击事件
                    onPageClicked:function (a, b, c,page) {
                        currentPage=page;
                        render();
                    }

                })
            }
        })
    }


    /*2点击添加按钮，显示添加模态框*/
    $("#addBtn").click(function () {
        $("#addModal").modal("show");
        /*发送ajax请求 获取一级分类全部数据，通过模板渲染*/
        $.ajax({
            type:"get",
            url:"/category/queryTopCategoryPaging",
            data:{
                page:1,
                pageSize:100
            },
            dataType:"json",
            success:function (info) {
                console.log(info);
                var htnlStr = template( "dropdownTpl",info );
                $(".dropdown-menu").html(htnlStr);
            }
        })
    });


    /*3通过事件委托，给dropdown-menu 下所有的a 绑定点击事件*/
    $(".dropdown-menu").on("click","a",function () {
        var txt = $(this).text();

        $("#dropdownText").text(txt);
        /*获取选中的id*/
        var id =$(this).data("id");
        //id设置给input
        $('[name="categoryId"]').val(id);
        //将隐藏域设置成校验成功状态
        /*updateStatus (字段名，校验状态。检验规则)*/
        $("#form").data("bootstrapValidator").updateStatus("categoryId","VALID");
    });

    /*4利用文件上传插件，进行文件上传初始化*/
    $("#fileupload").fileupload({
        //返回数据格式
        dataType:"json",
        //图片上传后，回调函数，
        done:function (e, data) {
            console.log(data.result.picAddr);

            var imgUrl=data.result.picAddr;
            $('#imgBox img').attr("src",imgUrl);
            /*将图片地址设置给隐藏的input*/
            $('[name="brandLogo"]').val(imgUrl);


            $("#form").data("bootstrapValidator").updateStatus("brandLogo","VALID");
        }
    });


    /*5.实现表单校验*/
    $("#form").bootstrapValidator({
        //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
        excluded: [],

        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',            //校验成功
            invalid: 'glyphicon glyphicon-remove',      //校验失败
            validating: 'glyphicon glyphicon-refresh'   //校验中
        },
        fields:{
            categoryId:{
                validators:{
                    notEmpty:{
                        message:"把一级分类给我选上，傻子",
                    }
                }
            },
            brandName:{
                validators:{
                    notEmpty:{
                        message:"给我吧二级分类写上，智障",
                    }
                }
            },
            brandLogo:{
                validators:{
                    notEmpty:{
                        message:"给我吧美女图片选上，白痴",
                    }
                }
            },
        }
    });


    /*6注册表单校验成功实践，阻止默认表单调教，通过ajax提交*/
    $('#form').on("success.form.bv",function (e) {
        e.preventDefault();
        /*通过ajax提交*/
        $.ajax({
            type:"post",
            url:"/category/addSecondCategory",
            data:$("#form").serialize(),
            dataType:"json",
            success:function (info) {
                console.log(info);
                if(info.success){
                    $("#addModal").modal("hide");
                    /*重新渲染第一页*/
                    currentPage = 1;
                    render();
                    /*重置表单，不仅状态要重置*/
                    $('#form').data("bootstrapValidator").resetForm(true);
                    /*手动重置文本内容*/
                    $("#dropdownText").text("请选择一级分类");
                    $("#imgBox img").attr("src","images/none.png")
                }
            }

        })
    })


});