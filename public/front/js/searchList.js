$(function () {
    var currentPage = 1;//当前页
    var pageSize = 2;//每页多少条




    function render( callback ){
        //准备请求数据，渲染时，显示加载中的效果
        // $('.lt_product').html('<div class="spinner"></div>');
        var params={};
        //三个必穿参数
        params.proName = $('.search_input').val();
        params.page = currentPage;
        params.pageSize = pageSize;
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
                    callback && callback(info);
                }
            })
        },1500)
    }

    //功能1：获取地址栏传递过来的搜索关键字，设置给 input
    var key = getSearch("key");
    console.log(key);
    //设置给input
    $('.search_input').val(key);
    //一进入页面。根据搜索关键字发送请求，进行页面渲染
    // render();


    //配置下拉刷新，上拉加载的注意点
    // 下拉刷新是对原有数据的覆盖，执行的是html方法
    // 上啦加载是在原有结构的基础上进行追加，追加到后面，执行的是append方法
    mui.init({
        // 配置pullRefresh
        pullRefresh : {
            container:".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            //配置下拉刷新
            down : {
                height:50,//可选,默认50.触发下拉刷新拖动距离,
                auto: true,//可选,默认false.首次加载自动下拉刷新一次
                contentdown : "下拉可以刷新",//可选，在下拉可刷新状态时，下拉刷新控件上显示的标题内容
                contentover : "释放立即刷新",//可选，在释放可刷新状态时，下拉刷新控件上显示的标题内容
                contentrefresh : "正在刷新...",//可选，正在刷新状态时，下拉刷新控件上显示的标题内容
                callback :function(){
                    currentPage = 1;
                    console.log("下拉刷新了");
                    //拿到数据后，需要执行的方法不一样，所以动过回调函数的方式，传进去执行
                    render(function (info) {
                        console.log(info);
                        var htmlStr = template("productTpl",info);
                        $(".lt_product").html(htmlStr);

                        //ajax 回来之后，需要结束下拉刷新，让内容回滚顶部
                        // console.log(mui('.mui-scroll-wrapper').pullRefresh());
                        mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
                        //启用上拉加载
                        mui('.mui-scroll-wrapper').pullRefresh().enablePullupToRefresh();
                    });
                },//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            },
            //配置上拉加载
            up : {
                height:50,//可选.默认50.触发上拉加载拖动距离
                auto:false,//可选,默认false.自动上拉加载一次
                contentrefresh : "正在加载...",//可选，正在加载状态时，上拉加载控件上显示的标题内容
                contentnomore:'没有更多数据了',//可选，请求完毕若没有更多数据时显示的提醒内容；
                callback :function(){
                    console.log("上啦刷新执行了");
                    //需要加载下一页数据，更新当前页
                    currentPage ++;
                    render(function ( info ) {
                        console.log(info);
                        var htmlStr = template("productTpl",info);
                        $(".lt_product").append(htmlStr);

                        //当数据回来之后，需要结束上啦加载；
                        //endPullupToRefresh(boolean)
                        //ture 没有更多数据，不在加载
                        if(info.data.length === 0){
                            mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);

                        }else{
                            mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(false);
                        }

                    })
                }, //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            }
        }
    });



    //功能2：按钮点击搜索功能
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


        //按钮搜索可以执行下拉刷新，下拉刷新中有页面重新渲染 ,其实可以改为 loading 转圈加载的效果
        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
        // render();
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
    });



    //功能3：排序功能
    //1.如果自己有，current类 切换箭头方向
    //2.如果自己没有current，给自己加上current，并且移除兄弟元素的current

    //注意：在使用上拉刷新下拉加载的页面中，mui框架会默认禁止a标签的点击事件，使用click会影响性能，所以官方推荐使用click
    $('.lt_sort a[data-type]').on("tap",function () {
        if($(this).hasClass("current")){
            $(this).find("i").toggleClass("fa-angle-up").toggleClass("fa-angle-down");
        }
        else{
            //没有current，自己加上current类，移除兄弟元素的current
            $(this).addClass("current").siblings().removeClass("current");
        }

        // 页面重新渲染
        //执行一次下拉刷新即可
        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
        // render();
    });





});