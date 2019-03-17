$(function () {

    var currentPage = 1;
    var pageSize = 5;


    //一进入页面发送ajax请求，渲染页面
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
});