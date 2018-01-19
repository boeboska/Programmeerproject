jaren = ["2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016"]
lijnsoorten = ["kipmens", "varkenmens", "kalkoenmens", "overigmens"]


var line_gegevens
var valueline
var kip_line, varken_line, overig_line, kalkoen_line
var kipmens, varkensmens, overigmens, kalkoenmens
var value, new_value
var x 
var y_line

function lineGraph() {

	var margin = {top: 20, right: 20, bottom: 30, left: 60}
	var width = 2500 - margin.left - margin.right;
	var height = 480 - margin.top - margin.bottom;

	linegraph = d3.select(".linegraph")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

	x = d3.scale.linear()
		.range([0, width]);

	y_line = d3.scale.linear()
		.range([height, 0]);

	var xAxis = d3.svg.axis()
		.tickFormat(function(d) { return d })
		.scale(x)
		.orient("bottom");

	var yAxis = d3.svg.axis()
		.scale(y_line)
		.orient("left")

	var color = d3.scale.category10();

	queue()
		.defer(d3.json, "datah.json")
		.await(make_line);

	function make_line(error, linedata) {
		

		line_gegevens = linedata

		x.domain([2000, 2016])
		y_line.domain([0, 900])

		// add the Xaxis
		linegraph.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(xAxis);

		// add the Y Axis
		linegraph.append("g")
			.attr("class", "y axis")
			.call(yAxis);

		calculate_line("kipmens")
		calculate_line("varkenmens")
		calculate_line("kalkoenmens")
		calculate_line("overigmens")

		var line_colors = ["red", "green", "yellow", "blue"];
        var legenda_animal = ["kip", "varken", "kalkoen", "overig"];

		var line_legend = map.selectAll(".line_legend")
            .data(line_colors)
            .enter()
            .append("g")
            .attr("class", "line_legend")
            .attr("transform", function(d, i ) { return "translate (0," + i * 20 + ")"; });

		// positie van de blokjes van de legenda
        line_legend.append("rect")
            .attr("id", function(d, i) { return d })
            .attr("x", width - 20)
            .attr("y", 80)
            .attr("width", 18)
            .attr("height", 18)
            .attr("stroke", "black")
            .style("fill", function(d) { return d });

            // positie van de tekst van de legenda 
        line_legend.append("text")
            .data(legenda_animal)
            .attr("x", width - 30)
            .attr("y", 90)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; })
	}
}

function calculate_line (value) {
	 
	waardes = []
	for (var i = 0; i < jaren.length; i++) {

		number = line_gegevens[jaren[i]]["Nederland"][value]
		if (number > 4000){
			number = number / 10
		}

		waardes[i] = {}
		waardes[i]["year"] = jaren[i]
		waardes[i][value] = number
	}
	

	valueline = d3.svg.line()
	.x(function(d) { return x(d.year); })
	.y(function(d) { return y_line(d[value]); })

	create_line(valueline, waardes, value)
}

function create_line (line, waardes, value) {

	// linegraph = d3.select(".linegraph")
	linegraph.append("path")
		.attr("stroke", color_line(value))
		.attr("stroke-width", 4)
		.attr("d", line(waardes))
		.style("fill", "none")
}

function color_line (value) {

	if (value == "kipmens") {
		return "red"	
	}
	else if (value == "varkenmens") {
		return "green"
	}
	else if (value == "kalkoenmens") {
		return "yellow"
	}
	else if (value == "overigmens") {
		return "blue"
	}
}

function click_province_line (province){
	
	for (var j = 0; j < lijnsoorten.length; j++) {

		waardes = []
		for (var i = 0; i < jaren.length; i++) {

			number = line_gegevens[jaren[i]][province][lijnsoorten[j]]

			waardes[i] = {}
			waardes[i]["year"] = jaren[i]
			waardes[i][lijnsoorten[j]] = number
		}

		if (lijnsoorten[j] == "kipmens"){
			valueline = kip_line
		}
		else if (lijnsoorten[j] == "varkenmens"){
			valueline = varken_line
		}
		else if (lijnsoorten[j] == "kalkoenmens"){
			valueline = kalkoen_line
		}
		else if (lijnsoorten[j] == "overigmens"){
			valueline = overig_line
		}

		valueline = d3.svg.line()
		.x(function(d) { return x(d.year); })
		.y(function(d) { return y_line(d[lijnsoorten[j]]); })

		create_line(valueline, waardes, lijnsoorten[j])
	}

}