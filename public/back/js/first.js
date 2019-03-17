

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
});