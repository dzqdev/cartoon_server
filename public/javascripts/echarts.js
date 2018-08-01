$(function(){
    var myChart = echarts.init(document.getElementById('main'),'light');
    // 显示标题，图例和空的坐标轴
    myChart.setOption({
        title: {
            text: '网站漫画分布'
        },
        tooltip: {},
        legend: {
            data:['漫画']
        },
        xAxis: {
            data: []
        },
        yAxis: {},
        series: [{
            name: '漫画',
            type: 'bar',
            data: []
        }]
    });

    // 异步加载数据
    $.get('/api/group').done(function (data) {
        let text_arr = [];
        let data_arr = [];
        for(let i = 0; i < data.msg.length; i++){
            text_arr.push(data.msg[i].category_name);
        }

        for(let j = 0; j < data.msg.length; j++){
            data_arr.push(data.msg[j].count);
        }
         // 填入数据
        myChart.setOption({
            xAxis: {
                data: text_arr
            },
            series: [{
                // 根据名字对应到相应的系列
                name: '漫画',
                data: data_arr
            }]
        });
    });
});