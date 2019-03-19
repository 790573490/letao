$(function () {

    //进入页面发送ajax，渲染一级分类
    $.ajax({
        type:"get",
        url:"/category/queryTopCategory",
        dataType:"json",
        success:function (info) {
            console.log(info);
            var htmlStr = template("leftTpl",info);
            $(".lt_category_left ul").html(htmlStr);
            renderSecondById( info.rows[0].id );
        }
    });


    //点击一级分类，渲染二级分类
    $(".lt_category_left").on("click","a",function () {
        //给当前被点击的li加上current，移除其他的current
        $(this).addClass("current").parent().siblings().find("a").removeClass("current");
        //通过id进行二级分类渲染
        var id = $(this).data("id");
        renderSecondById(id);
    });



    //实现一个方法，专门用于根据一级分类id去渲染二级分类
    function renderSecondById( id ) {
        //发送ajax渲染
        $.ajax({
            type:"get",
            url:"/category/querySecondCategory",
            data:{
                id:id,
            },
            success:function (info) {
                console.log(info);
                var htmlStr = template("rightTpl",info);
                $(".lt_category_right ul").html(htmlStr);
            }
        })
    }

});