$(function () {
    //注意：要进行本地存储localStorage的操作，尽心管历史记录管理
    //需要约定搞一个建名， search_list
    //通过 search_list 进行读取或者设置属性


    // var arr=['耐克','阿迪王','耐克王','新百伦'];
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
        //清空记录
        localStorage.removeItem("search_list");
        //渲染界面
        render();
    })



});