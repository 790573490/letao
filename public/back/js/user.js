$(function () {
    var currentPage = 1;
    var pageSize = 5;

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


});