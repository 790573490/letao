
$(function () {
    var currentPage = 1;//当前页数
    var pageSize =5;//每页条数

    setTimeout(function () {
        $("#paginator a").removeAttr("title");
    },3000);

    //1一进入页面请求商品数据，进行页面渲染
    render();
    function render() {
        $.ajax({
            type:"get",
            url:"/product/queryProductDetailList",
            data:{
                page: currentPage,
                pageSize: pageSize,
            },
            dataType:"json",
            success:function (info) {
                console.log(info);
                var htmlStr = template("productTpl",info);
                $('tbody').html(htmlStr);


                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion:3,//默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage:info.page,//当前页
                    totalPages:Math.ceil(info.total/info.size),//总页数
                    size:"mini",//设置控件的大小，mini, small, normal,large
                    useBootstrapTooltip:true,//使用bootstrap中的title提示框
                    itemTexts: function (type, page, current) {
                        $("#paginator a").removeAttr("title");
                        switch (type) {
                            case "page":
                                return page;
                            case "first":
                                return "首页";
                            case "last":
                                return "尾页";
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";
                        }

                    },//配置按钮文本
                    onPageClicked:function(a, b, c,page){
                        //为按钮绑定点击事件 page:当前点击的按钮值
                        currentPage = page;
                        render();
                    },




                });
            }
        });
    }

    //2点击添加商品按钮，显示添加模态框
    $("#addBtn").click(function () {
        $("#addModal").modal("show");

        //发送ajax请求，渲染下拉框
        $.ajax({
            type:"get",
            url:"/category/querySecondCategoryPaging",
            data:{
                page:1,
                pageSize:100,
            },
            dataType:"json",
            success:function (info) {
                console.log(info);
                var htmlStr = template('dropdownTpl',info);
                $(".dropdown-menu").html(htmlStr);
            }


        })
    })

    //3给dropdown-menu设置点击事件
    $(".dropdown-menu").on("click","a",function () {
        var txt = $(this).text();
        $("#dropdownText").text(txt);
        //设置隐藏于
        var id =$(this).data("id");
        $('[name="brandId"]').val(id);

    })






});