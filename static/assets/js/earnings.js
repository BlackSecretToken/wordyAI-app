$(function() {
	"use strict";
	
	// chart 1
	var options = {
		series: [{
			name: 'Daily earnings',
			data: [14, 3, 10, 9, 29, 19, 22, 9, 12, 7, 19, 5]
		}],
		chart: {
			foreColor: '#9ba7b2',
			type: 'area',
			zoom: {
				enabled: false
			},
			toolbar: {
				show: !1
			},
			height: 340
		},
		dataLabels: {
			enabled: false
		},
		stroke: {
			show: true,
			width: 4,
			curve: 'smooth'
		},
		xaxis: {
			categories: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
		},
		fill: {
			type: 'gradient',
			gradient: {
				shade: 'dark',
				gradientToColors: ['#17a00e'],
				//shadeIntensity: 1,
				type: 'vertical',
				opacityFrom: 0.7,
				opacityTo: 0.1,
				stops: [0, 100, 100, 100]
			},
		},
		markers: {
			size: 4,
			colors: ["#17a00e"],
			strokeColors: "#fff",
			strokeWidth: 2,
			hover: {
				size: 7,
			}
		},
		colors: ["#17a00e"],
		tooltip: {
			y: {
				formatter: function (val) {
					return "$ " + val + " thousands"
				}
			}
		}
	};
	var chart = new ApexCharts(document.querySelector("#chart1"), options);
	chart.render();
	
	
	
	new PerfectScrollbar('.dashboard-top-countries');
	
	
	
});