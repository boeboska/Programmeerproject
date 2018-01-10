function barChart(){
	var margin = {top: 25, right: 30, bottom: 60, left: 60}
	width = 1000 - margin.left - margin.right
	height = 600 - margin.top - margin.bottom;

	x = d3.scale.ordinal()
		.rangeBoundBands([0, width], .1);

	y = d3.scale.linaer()
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient("left");

	barchart = d3.select(".barchart")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");


	queue()
		.defer(d3.json, "data.json")
		.await(data_loader);

	function data_loader(error, data) {

		if (error) throw error

		kip = parseInt(data["2016"]["Drenthe"]["bedrijven"])

		console.log(kip)
	
		






	}
}