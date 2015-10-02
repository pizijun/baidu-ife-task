(function($) {
    var pieValue = getPieValue();
    if(pieValue.transportValue ==0 && pieValue.clothValue==0 && pieValue.accommodaValue==0 
        && pieValue.dietValue==0 && pieValue.shopValue==0 && pieValue.otherValue==0){
        pieValue.clothValue =100;
    }    
    var pieData = [{
        value: pieValue.clothValue,
        color: "#F39F61",
        highlight: "#F08E48",
        label: "衣服"
    }, {
        value: pieValue.transportValue,
        color: "#6FB2DE",
        highlight: "#408EC1",
        label: "交通"
    }, {
        value: pieValue.dietValue,
        color: "#FE8988",
        highlight: "#F56767",
        label: "饮食"
    }, {
        value: pieValue.shopValue,
        color: "#DA5A4C",
        highlight: "#ED3121",
        label: "购物"
    }, {
        value: pieValue.otherValue,
        color: "#FDC403",
        highlight: "#F7C627",
        label: "其它"
    }, {
        value: pieValue.accommodaValue,
        color: "#C6B29C",
        highlight: "#BFAA95",
        label: "住宿"
    }];

    var pieOption = {
        segmentShowStroke: true,
        segmentStrokeColor: "#fff",
        segmentStrokeWidth: 2,
        percentageInnerCutout: 50, // This is 0 for Pie charts
        animationSteps: 100,
        animationEasing: "easeOutBounce",
        animateRotate: true,
        animateScale: false,
        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for" +
            "(var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\">" +
            "</span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
    }

    var ctxPie = $("#pie").get(0).getContext("2d");
    chatPie = new Chart(ctxPie).Pie(pieData, pieOption);
    var pieLegend = chatPie.generateLegend();
    $(".pie-wrap").append(pieLegend);

    var lineObj = getLineData();
    console.log(lineObj);
    var lineData = {
        labels: lineObj.monthData,
        datasets: [{
            label: "Expense dataset",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(212,61,49,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: lineObj.expenseData
            
        }, {
            label: "Income dataset",
            fillColor: "rgba(151,187,205,0.2)",
            strokeColor: "rgba(151,187,205,1)",
            pointColor: "rgba(90,199,148,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(151,187,205,1)",
            data: lineObj.incomeData
        }]
    };

    var lineOption = {
        scaleShowGridLines: true,
        scaleGridLineColor: "rgba(0,0,0,.05)",
        scaleGridLineWidth: 1,
        scaleShowHorizontalLines: false,
        scaleShowVerticalLines: true,
        bezierCurve: false,
        bezierCurveTension: 0.4,
        pointDot: true,
        pointDotRadius: 4,
        pointDotStrokeWidth: 1,
        pointHitDetectionRadius: 20,
        datasetStroke: true,
        datasetStrokeWidth: 2,
        datasetFill: false,
        legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for(var i=0; i<datasets.length; i++)" +
            "{%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\">" +
            "</span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>"
    };

    var ctxLine = $("#line").get(0).getContext("2d");
    chartLine = new Chart(ctxLine).Line(lineData, lineOption);
    // chartLine.datasets[0].points[2].value = 50;
    // chartLine.update();
    // chartLine.addData([40, 60], "八月");
    // chartLine.removeData();

})(Zepto)
