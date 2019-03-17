$(function () {
    // 基于准备好的dom，初始化echarts实例
    var echarts_1 = echarts.init(document.querySelector('.echarts_1'));

    // 指定图表的配置项和数据
    var option1 = {
        title: {//标题
            text: '2017年成功变异人数'
        },
        tooltip: {},
        legend: {//图例
            data:['人数']
        },
        xAxis: {
            data: ["1月","2月","3月","4月","5月","6月"]
        },
        //Y轴刻度
        yAxis: {},
        series: [{
            name: '人数',
            type: 'bar',
            data: [1500, 2000, 1800, 1200, 1600, 1500 ]
        }]
    };

    // 使用刚指定的配置项和数据显示图表。
    echarts_1.setOption(option1);


    // 基于准备好的dom，初始化echarts实例
    var echarts_2 = echarts.init(document.querySelector('.echarts_2'));

    // 指定图表的配置项和数据
    option2 = {
        title : {
            text: '热门变异类型',
            subtext: '2019年10月',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['直接变异','吃药变异','后天自行变异','先天变异','超级变异']
        },
        series : [
            {
                name: '变异类型',
                type: 'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data:[
                    {value:335, name:'直接变异'},
                    {value:3100, name:'吃药变异'},
                    {value:2340, name:'后天自行变异'},
                    {value:135, name:'先天变异'},
                    {value:18, name:'超级变异'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };


    // 使用刚指定的配置项和数据显示图表。
    echarts_2.setOption(option2);



});