$(function () {
    //获取地址栏传递过来的搜索关键字，设置给 input
    var key = getSearch("key");
    console.log(key);
    //设置给input
    $('.search_input').val(key);
    //一进入页面。根据搜索关键字发送请求，进行页面渲染
    render();
    function render(){
        //准备请求数据，渲染时，显示加载中的效果
        $('.lt_product').html('<div class="spinner"></div>');
        var params={};
        //三个必穿参数
        params.proName = $('.search_input').val();
        params.page = 1;
        params.pageSize = 100;
        //两个可选择的参数  价格，库存
        //价格 price 库存 num

        var $current = $(".lt_sort a.current");
        if($current.length > 0){
            //有高亮的a，需要进行排序
            //获取传给后台的键
            var sortName = $current.data("type");
            console.log(sortName);
            // 通过箭头方向拿到值
            var sortValue = $current.find("i").hasClass("fa-angle-down")?2:1;
            //添加到params
            params[sortName] = sortValue;
        }

        // 加延时主要是为了看延时动画
        setTimeout(function () {
            $.ajax({
                type:"get",
                url:"/product/queryProduct",
                dataType:"json",
                data:params,
                success:function (info) {
                    console.log(info);
                    var htmlStr = template("productTpl",info);
                    $(".lt_product").html(htmlStr);
                }
            })
        },1500)
    }


    //功能2：
    $(".search_btn").click(function () {



        //需要将搜索的关键字追加到本地存储中
        var key = $(".search_input").val();
        if( key.trim() === ''){
            mui.toast("请输入搜索关键字",{
                duration:'short',
                type:"div",
            });
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

    //功能3：排序功能
    //1.如果自己有，current类 切换箭头方向
    //2.如果自己没有current，给自己加上current，并且移除兄弟元素的current
    $('.lt_sort a[data-type]').on("click",function () {
        if($(this).hasClass("current")){
            $(this).find("i").toggleClass("fa-angle-up").toggleClass("fa-angle-down");
        }
        else{
            //没有current，自己加上current类，移除兄弟元素的current
            $(this).addClass("current").siblings().removeClass("current");
        }

        // 页面重新渲染
        render();
    })

});