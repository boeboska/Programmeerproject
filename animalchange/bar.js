soorten = ["kip", "mensen", "varken", "overig", "kalkoen"]

var currentdata;
var currentyear;

var total = 0
var y;
var height;
var yAxis

var nl_on

var current_province = "leeg";

function barChart() {

	
	var margin = {top: 25, right: 30, bottom: 60, left: 60}
	width = 1100 - margin.left - margin.right
	height = 1000 - margin.top - margin.bottom;



	// var superscript = "0123456789"
		// formatPower = function(d) { return (d + "").split("").map(function(c) { return superscript[c]; }).join(""); };
	var x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);

	// y = d3.scale.linear()
	y = d3.scale.log()
		// .base(Math.E)
		.range([height, 0]);


	var xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		// .tickFormat(function(d) { return "e" + formatPower(Math.round(Math.log(d))); });

	barchart = d3.select(".barchart")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
	
	queue()
		.defer(d3.json, "datah.json")
		.await(make_bar);

	function make_bar(error, bardata) {

		// console.log(bardata)

		currentdata = bardata
		currentyear = 2000;

		numbers_array = []

		for (var i = 0; i < soorten.length; i++){
			rijtje = parseInt(bardata[currentyear]["Nederland"][soorten[i]])
			numbers_array.push(rijtje)
		}

		console.log(numbers_array)

		if (error) throw error

		// introduct d3.tooltip
		var tip = d3.tip()
			.attr('class', 'd3-tipbar')
			.offset([-10, 0])
			.html(function(d) {

				return "<strong> Amount: </strong> <span style='color:red'>" + currentdata["2000"]["Nederland"] + "</span>";
		});

		d3.select(".barchart")
		.call(tip);

		x.domain(soorten)
		// y.domain([Math.exp(9), Math.exp(18.5)])

		y.domain([d3.min(numbers_array) - 1000000, d3.max(numbers_array)])

		// y.domain([500000, 110000000])
		// y.domain([500000, d3.max(numbers_array) + 50000000])

		// TEXT OP X AS
		barchart.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height +")")
			.call(xAxis)
			.append("text")
			.attr("x", width - 40)
			.attr("y", .75 * margin.bottom - 15)
		
			.text("soort")

		// TEXT OP Y AS
		barchart.append("g")
			.attr("class", "y axis")
			.call(yAxis)
			.append("text")
			.attr("transform", "rotate(90)")
			.selectAll(".tick text")
				.text(null)
				.filter(powerOfTen)
				.text(10)
				.append("tspan")
				.attr("dy", "-.7em")
				.text(function (d) { console.log(Math.round(Math.log(d) / Math.LN10)); return Math.round(Math.log(d) / Math.LN10); });

		barchart.selectAll(".bar")
			.data(numbers_array)
			.enter()
			.append("rect")
			.attr("class", "bar")
			.attr("id", function(d, i) { return soorten[i]})

			// BEPAAL DE X COORDINATEN WAAR DE BARS BEGINNEN
			.attr("x", function(d, i) { return x(soorten[i]); })
			.attr("width", x.rangeBand())

			.attr("y", function(d, i) { return y(numbers_array[i]); })
			.attr("height", function(d, i) { return height - y(numbers_array[i]); })

			.on("mouseover", tip.show)
			.on("mouseout", tip.hide)
	}
}

function powerOfTen(d) {
	console.log(d)
	return d / Math.pow(10, Math.ceil(Math.log(d) / Math.LN10 - 1e-12)) === 1;
}


function change_year_bar(value){

	currentyear = value
	console.log(current_province)

	if (current_province == "leeg" || nl_on == "yes") {
		numbers_array = []
		for (var i = 0; i < soorten.length; i++){
			rijtje = parseInt(currentdata[currentyear]["Nederland"][soorten[i]])
			numbers_array.push(rijtje)
		}
	}

	else { 
		console.log(current_province)
		numbers_array = []
		for (var i = 0; i < soorten.length; i++){
			rijtje = parseInt(currentdata[currentyear][current_province][soorten[i]])
			numbers_array.push(rijtje)

		}
	}

	new_bar_height = barchart.selectAll(".bar")
	new_bar_height.attr("y", function(d, i ) { return y(numbers_array[i]); })
	new_bar_height.attr("height", function(d, i) { return height - y(numbers_array[i]); })
}

function click_province_bar(province) {

	current_province = province

	nl_on = "no"

	numbers_array = []
	for (var i = 0; i < soorten.length; i++){
		rijtje = parseInt(currentdata[currentyear][province][soorten[i]])
		numbers_array.push(rijtje)
	}

	console.log(numbers_array)


	// y = d3.scale.log()
	// 	// .base(Math.E)
	// 	.range([height, 0]);

	// yAxis = d3.svg.axis()
	// 	.scale(y)
	// 	.orient("left")

	// y.domain([d3.min(numbers_array) - 1000000, d3.max(numbers_array)])


	// barchart.append("g")
	// 	.attr("class", "y axis")
	// 	.call(yAxis)
	// 	.append("text")
	// 	.attr("transform", "rotate(90)")
	// 	.selectAll(".tick text")
	// 	.text(null)
	// 	.filter(powerOfTen)
	// 	.text(10)
	// 	.append("tspan")
	// 	.attr("dy", "-.7em")
	// 	.text(function (d) { return Math.round(Math.log(d) / Math.LN10); });


	new_bar_height = barchart.selectAll(".bar")
	new_bar_height.attr("y", function(d, i ) { return y(numbers_array[i]); })
	new_bar_height.attr("height", function(d, i) { return height - y(numbers_array[i]); })




}

function back_to_nl () {

	console.log("IK BEN GEKLIKT")
	console.log(currentyear)

	nl_on = "yes"

	 
	numbers_array = []
	for (var i = 0; i < soorten.length; i++){
		rijtje = parseInt(currentdata[currentyear]["Nederland"][soorten[i]])
		numbers_array.push(rijtje)
	}
	
	console.log(numbers_array)

	new_bar_height = barchart.selectAll(".bar")
	new_bar_height.attr("y", function(d, i ) { return y(numbers_array[i]); })
	new_bar_height.attr("height", function(d, i) { return height - y(numbers_array[i]); })
}





















