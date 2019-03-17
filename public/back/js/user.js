$(function () {
    var currentPage = 1;//当前页数
    var pageSize = 5;//每页多少条
    var currentId;//当前选中的用户ID
    var isDelete;


    //1.进入页面，发送ajax请求，获取用户列表数据，渲染页面和分页插件
    render();
    function render() {
        $.ajax({
            type:"get",
            url:"/user/queryUser",
            dataType:"json",
            data:{
                page:currentPage,
                pageSize:pageSize
            },
            success:function (info) {
                console.log(info);
                // template(模板id,数据对象)
                //在模板中可以任意使用数据对象中的属性
                var htmlStr = template( 'tpl',info);
                $('tbody').html(htmlStr);

                /*分页初始化*/
                $('#paginator').bootstrapPaginator({
                    /*配置是bootstrap版本*/
                    bootstrapMajorVersion:3,
                    /*指定总页数*/
                    totalPages:Math.ceil(info.total / info .size ),
                    /*当前页*/
                    currentPage:info.page,
                    //为按钮绑定点击事件，回调函数
                    onPageClicked:function(event, originalEvent, type,page){
                        /*通过page获取页码*/
                        console.log(page);
                        currentPage = page;
                        /*更新当前页*/
                        render();
                    }
                })
            }
        });

    }





    //2.点击急用按钮，显示模态框，通过事件委托绑定事件
    $("tbody").on("click",".btn",function () {
        //显示模态框
        $('#userModal').modal('show');
        //获取自定义属性值的方法，  .data()
        currentId = $(this).parent().data("id");

        //如果是禁用按钮，说明需要将该用户设置为禁用状态，穿 0
        isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
    });




    //3.点击确认按钮，自改对应用户状态
    $("#submitBtn").click(function () {
        //需要两个参数，用户ID ， 用户需要被改成的状态
        console.log("用户"+currentId);
        console.log("用户状态"+isDelete);
        /*发送ajax*/
        $.ajax({
            type:"post",
            url:"/user/updateUser",
            data:{
                id:currentId,
                isDelete:isDelete,
            },
            dataType:"json",
            success: function (info) {
                /*关闭模态框*/
                /*重新渲染页面*/
                console.log(info);
                $("#userModal").modal("hide");
                render();

            }
        })

    })



});