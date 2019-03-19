$(function () {
    //获取地址栏传递过来的搜索关键字，设置给 input
    var key = getSearch("key");
    console.log(key);
    //设置给input
    $('.search_input').val(key);
    //一进入页面。根据搜索关键字发送请求，进行页面渲染
    render();
    function render(){
        $.ajax({
            type:"get",
            url:"/product/queryProduct",
            dataType:"json",
            data:{
                proName:$('.search_input').val(),
                page:1,
                pageSize:100,
            },
            success:function (info) {
                console.log(info);
                var htmlStr = template("productTpl",info);
                $(".lt_product").html(htmlStr);
            }
        })
    }


    //功能2：
    $(".search_btn").click(function () {



        //需要将搜索的关键字追加到本地存储中
        var key = $(".search_input").val();
        if( key.trim() === ''){
            alert("请输入关键字");
            return;
        }
        render();
        //获取数组
        var history = localStorage.getItem("search_list") || "[]";
        var arr = JSON.parse( history );

        //1.删除重复项
        var index = arr.indexOf( key );
        if(index != -1){
            arr.splice(index,1);
        }
        //2.不能超过10个
        if( arr.length >= 10){
            arr.pop();
        }

        // 将关键字追加到arr中
        arr.unshift( key );
        localStorage.setItem("search_list",JSON.stringify(arr));
    })

});