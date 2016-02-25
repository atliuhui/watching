window.defaultOption = {
    title: { text: '' },
    credits: { enabled: false },
    exporting: { enabled: false },
    legend: {
        align: 'right',
        verticalAlign: 'top'
    },
    tooltip: { enabled: false },
    colors: ["#2f7ed8", "#0d233a", "#8bbc21", "#910000", "#1aadce", "#492970", "#f28f43", "#77a1e5", "#c42525", "#a6c96a"],
    chart: {
        type: 'line',
        margin: [40, 10, 30, 30]
    },
    xAxis: {
        tickWidth: 0,
        startOnTick: true,
        endOnTick: true,
        lineColor: '#eee',
        type: 'datetime',
        tickInterval: 24 * 60 * 60 * 1000,
        labels: {
            padding: 0,
            rotation: 0,
            style: {
                color: '#999',
                fontWeight: 'normal',
                textOverflow: 'none'
            },
            formatter: function () {
                return Highcharts.dateFormat('%a', new Date(this.value));
            }
        }
    },
    yAxis: {
        title: { text: '' },
        type: 'linear',
        gridLineColor: '#eee',
        gridLineWidth: 1,
        min: 0,
        plotLines: [],
        labels : { enabled: true }
    },
    plotOptions: {
        line: {
            enableMouseTracking: false,
            allowPointSelect: false,
            lineWidth: 1,
            marker: { enabled: false }
        }
    }
};