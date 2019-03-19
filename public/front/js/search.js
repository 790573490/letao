$(function () {
    //注意：要进行本地存储localStorage的操作，尽心管历史记录管理
    //需要约定搞一个建名， search_list
    //通过 search_list 进行读取或者设置属性


    // var arr=['耐克','阿迪王','耐克王','新百伦','奔驰','宝马','奥迪'];
    // var json = JSON.stringify(arr);
    // localStorage.setItem('search_list',json);

    //
    /*
    * 功能1：列表渲染功能
    * 1.从本地读取历史记录，读取的是 jsonStr
    * 2.转成数组
    * 3.通过模板引擎动态渲染
    *
    * */
    render();


    //从本地存储中读取历史记录，以数组的形式返回
    function getHistory(){
        // 如果没有数据，默认初始化成一个空数组
        var history = localStorage.getItem("search_list") || '[]';
        var arr = JSON.parse(history);
        // console.log(arr);
        return arr;
    }
    //读取数组，进行页面渲染
    function render(){
        var arr = getHistory();
        // template( 模板id，数据对象 )
        var htmlStr = template("historyTpl", {arr:arr});
        $(".lt_history").html(htmlStr);
    }

    /*
    * 功能2：清空历史记录功能
    *       注册委托点击事件
    *       清空历史记录：removeItem()
    * */
    $(".lt_history").on("click",".btn_empty",function () {
        //添加mui确认框
        mui.confirm("你确认要清空历史记录吗？","温馨提示",["取消","确认"],function (e) {
            // e.index 可以获取点击的按钮的索引
            console.log(e);
            if(e.index ===1){
                //清空记录
                localStorage.removeItem("search_list");
                //渲染界面
                render();
            }
        })

    });



    /*
    * 功能3：删除单条历史记录
    * 1.注册委托点击事件，
    * 2.将下角标存在删除按钮上，获取下角标
    * 3.从本地存储中读取数组
    * 4.通过下标，从数组中，将对应项删除 splice
    * 5.将修改后的数组。装成jsonstr，存储到本地中
    * 6页面渲染
    * */
    $(".lt_history").on("click",".btn_del",function () {

        var that = this;
        //添加删除确认框
        mui.confirm("您确认删除该条记录吗？","温馨提示",["取消","确认"],function (e) {
            if(e.index===1){
                //获取下角标
                var index = $(that).data("index");
                //获取数组
                var arr = getHistory();
                //根据下角标。删除对应项
                // arr.splice(从哪儿开始，删除几项，添加的项1，添加的项2)
                arr.splice(index, 1);
                //转成jsonstr，存储到本地去
                localStorage.setItem("search_list",JSON.stringify( arr ));
                //页面重新渲染
                render();
            }
        })

    });



    /*
    * 功能4：添加历史记录功能
    * 1.给搜索按钮，添加点击事件，
    * 2.获取输入框的值
    * 3.获取本地历史中存的数组
    * 3.往数组的最前面追加
    * 5.转成jsonstr。将修改后的存储到本地中
    * 6.页面重新渲染
    * */
    $(".search_btn").click(function () {
        var key = $(".search_input").val().trim();
        if( key === ""){
            mui.toast("请输入搜索关键字",{
                duration:5000,
                type:"div",
            });
            return;
        }
        //获取数组
        var arr = getHistory();
        /*
        * 需求1：如果有重复的，现将重复的删除，将这项添加到最前面
        *       2:超度不能超过十个
        * */
        var index = arr.indexOf(key);
        // console.log(index);
        if( index != -1){
            arr.splice(index,1);
        }
        if(arr.length >=10){
            //删除最后一项
            arr.pop();
        }



        //    往数组最前面添加
        arr.unshift(key);
    //    转成json。存到本地
        localStorage.setItem("search_list",JSON.stringify(arr));
        render();
        $(".search_input").val('');
        location.href = "searchList.html?key="+ key;
    })




});