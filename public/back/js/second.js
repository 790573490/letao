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
        }
    })


});