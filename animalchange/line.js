jaren = ["2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016"]
lijnsoorten = ["kipmens", "varkenmens", "kalkoenmens", "overigmens"]


var line_gegevens
var valueline
var kip_line, varken_line, overig_line, kalkoen_line
var kipmens, varkensmens, overigmens, kalkoenmens
var value, new_value
var x_line
var y_line

var kip_click = 0;
var varken_click = 0;
var overig_click = 0;
var kalkoen_click = 0;

var y_lineAxis
var x_lineAxis

function lineGraph() {

	var margin = {top: 20, right: 20, bottom: 30, left: 60}
	var width = 1250 - margin.left - margin.right;
	var height = 480 - margin.top - margin.bottom;

	linegraph = d3.select(".linegraph")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

	x_line = d3.scale.linear()
		.range([0, width]);

	y_line = d3.scale.linear()
		.range([height, 0]);

	x_lineAxis = d3.svg.axis()
		.tickFormat(function(d) { return d })
		.scale(x_line)
		.orient("bottom");

	y_lineAxis = d3.svg.axis()
		.scale(y_line)
		.orient("left")

	var color = d3.scale.category10();

	queue()
		.defer(d3.json, "final_data.json")
		.await(make_line);

	function make_line(error, linedata) {
		

		line_gegevens = linedata

		x_line.domain([2000, 2016])
		y_line.domain([0, 900])

		// add the Xaxis
		linegraph.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height + ")")
			.call(x_lineAxis);

		// add the Y Axis
		linegraph.append("g")
			.attr("class", "y axis")
			.call(y_lineAxis);

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
	.x(function(d) { return x_line(d.year); })
	.y(function(d) { return y_line(d[value]); })

	create_line(valueline, waardes, value)
}

function create_line (line, waardes, value) {

	linegraph.append("path")
		.attr("class", "lijn")
		.attr("stroke", color_line(value))
		.attr("stroke-width", 4)
		.attr("d", line(waardes))
		.style("fill", "none")
}

function create_line_2 (line, waardes, value) {

	console.log(waardes)
	console.log(value)
	// update y as
	// y_line.domain([0, 600])
	// linegraph.select(".y.axis").transition().duration(300).call(y_lineAxis)

	linegraph.append("path")
		.attr("class", "lijn")
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


function update_linegraph () {

	// verwijder oude lijnen
	linegraph.selectAll(".lijn").remove()
	
	// kijk of er knoppen aan staan
	if (update_soorten.length != 0) {
		lijnsoorten.length = update_soorten.length
	}


	for (var j = 0; j < lijnsoorten.length; j++) {

		waardes = []
		for (var i = 0; i < jaren.length; i++) {

			// kijk of het voor heel NL moet of een provincie
			if (current_province != "leeg") {
				number = line_gegevens[jaren[i]][current_province][lijnsoorten[j]]
			}
			else {
				number = line_gegevens[jaren[i]]["Nederland"][lijnsoorten[j]]
			}
			
			waardes[i] = {}
			waardes[i]["year"] = jaren[i]
			waardes[i][lijnsoorten[j]] = number
		}

		if (lijnsoorten[j] == "kipmens") {
			valueline = kip_line
		}
		else if (lijnsoorten[j] == "varkenmens") {
			valueline = varken_line
		}
		else if (lijnsoorten[j] == "kalkoenmens") {
			valueline = kalkoen_line
		}
		else if (lijnsoorten[j] == "overigmens") {
			valueline = overig_line
		}

		valueline = d3.svg.line()
		.x(function(d) { return x_line(d.year); })
		.y(function(d) { return y_line(d[lijnsoorten[j]]); })

		create_line_2(valueline, waardes, lijnsoorten[j])
	}

}



