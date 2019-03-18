
$(function () {
    var currentPage = 1;//当前页数
    var pageSize =5;//每页条数
    var picArr = [];//存储图片的数组

    var timer =setTimeout(function () {
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
    });

    //3给dropdown-menu设置点击事件
    $(".dropdown-menu").on("click","a",function () {
        var txt = $(this).text();
        $("#dropdownText").text(txt);
        //设置隐藏于
        var id =$(this).data("id");
        $('[name="brandId"]').val(id);

        $("#form").data("bootstrapValidator").updateStatus("brandId","VALID")

    });

    //4文件上传初始化

    /*
    * 如果是多张图片上传，那么插件会分多次请求接口上传，返回多个对象
    * */
    $("#fileupload").fileupload({
        dataType:"json",
        //e：事件对象
        //data：图片上传后的对象，通过data.result.picAddr可以获取上传后的图片地址
        done:function (e, data) {
            // console.log(data.result);
            picArr.unshift(data.result);
            console.log(picArr);

            $("#imgBox").prepend('<img src="'+ data.result.picAddr +'" height="100" alt="" style="margin-right: 10px; border: 2px solid #e7e7e7; border-radius:5px;">');

            if(picArr.length > 3){
                //超过三张图片，移除最后一张
                picArr.pop();
                /*移除imgBox中的最后一张图片*/
                $("#imgBox img").eq(-1).remove();
            }

            //如果处理后，图片数组的长度为3，那么就通过校验，手动将picStatus支撑VALID
            if( picArr.length === 3){
                $("#form").data("bootstrapValidator").updateStatus("picStatus","VALID");
            }


        }
    });


    //进行表单校验初始化
    $("#form").bootstrapValidator({
        //1. 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
        excluded: [],

        //2. 指定校验时的图标显示，默认是bootstrap风格
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',            //校验成功
            invalid: 'glyphicon glyphicon-remove',      //校验失败
            validating: 'glyphicon glyphicon-refresh'   //校验中
        },

        fields:{
            brandId:{
                validators:{
                    notEmpty:{
                        message:"请选择分类类别",
                    }
                }
            },
            proName:{
                validators:{
                    notEmpty:{
                        message:"请输入商品名称",
                    }
                }
            },
            proDesc:{
                validators:{
                    notEmpty:{
                        message:"请输入商品描述",
                    }
                }
            },
            num :{
                validators:{
                    notEmpty:{
                        message:"请输入商品库存",
                    },
                    //出了非空之外，要求必须为非零开头的数字
                    //正则校验
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: '商品库存格式，必须是非零开头的数字'
                    }
                }
            },
            size:{
                validators:{
                    notEmpty:{
                        message:"请输入商品尺码",
                    },
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: '商品尺码格式必须是 xx-xx的格式，例如 32-35'
                    }
                }
            },
            oldPrice:{
                validators:{
                    notEmpty:{
                        message:"请输入商品原价",
                    }
                }
            },
            price:{
                validators:{
                    notEmpty:{
                        message:"请输入商品现价",
                    }
                }
            },
            picStatus:{
                validators:{
                    notEmpty:{
                        message:"请选择三张图片",
                    }
                }
            }
        }

    })


    //阻止默提交，通过ajax事件提交
    $("#form").on("success.form.bv",function (e) {
        e.preventDefault();
        var paramsStr = $("#form").serialize();
        //&picAddr1=xx&picName1=xx  拼接图片信息
        paramsStr += "&picName1="+picArr[0].picName+"&picAddr1="+picArr[0].picAddr;
        paramsStr += "&picName2="+picArr[1].picName+"&picAddr2="+picArr[1].picAddr;
        paramsStr += "&picName3="+picArr[2].picName+"&picAddr3="+picArr[2].picAddr;

        // console.log(paramsStr);
        $.ajax({
            type:"post",
            url:"/product/addProduct",
            data:paramsStr,
            dataType:"json",
            success:function (info) {
                console.log(info);
                if(info.success){
                    $("#addModal").modal("hide");
                    currentPage = 1;
                    render();
                    /*重置表单状态和表单内容*/
                    $("#form").data("bootstrapValidator").resetForm(true);
                    /*重置下拉按钮*/
                    $("#dropdownText").text("请选择二级分类");
                    /*重置图片区域*/
                    $("#imgBox img").remove();
                }
            }
        })

    })





});