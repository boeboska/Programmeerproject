jaren = ["2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016"]
lijnsoorten = ["kipmens", "varkenmens", "kalkoenmens", "overigmens"]
update_knoppen= []

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

lijnvalue = "leeg"

var aap

y_as_numbers = []

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
		.defer(d3.json, "/json/mdata.json")
		.await(make_line);

	function make_line(error, linedata) {
		
		console.log(linedata)

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

		var line_colors = ["#5C6BC0", "#FFCA28", "#D4E157", "#8D6E63"];
        var legenda_animal = ["kip (x10)", "varken", "kalkoen", "overig"];

		var line_legend = linegraph.selectAll(".line_legend")
            .data(line_colors)
            .enter()
            .append("g")
            .attr("class", "line_legend")
            .attr("transform", function(d, i ) { return "translate (0," + i * 30  + ")"; });

		// positie van de blokjes van de legenda
        line_legend.append("rect")
            .attr("id", function(d, i) { return d })
            .attr("x", width - 20)
            .attr("y", 80)
            .attr("width", 30)
            .attr("height", 25)
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


        // zet het getal onder de slider standaart op 2000
        var slider = d3.selectAll(".slidecontainer")
			slider.append("text")
			.text(2000)
			.style("font-size", "30px")
	}
}

function calculate_line (value) {
	 
	waardes = []
	for (var i = 0; i < jaren.length; i++) {

		number = line_gegevens[jaren[i]]["Nederland"][value]

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
		.attr("stroke-width", 7)
		.attr("d", line(waardes))
		.style("fill", "none")
}

function create_line_2 (line, waardes, value) {

	console.log(value)
	console.log(waardes)

	linegraph.append("path")
		.attr("class", value)
		.attr("stroke", color_line(value))
		.attr("stroke-width", 7)
		.attr("d", line(waardes))
		.style("fill", "none")
}

function color_line (value) {
	console.log("HIER@@@@@@@@@@@@@")
	console.log(value)

	var line_colors = ["#5C6BC0", "#FFCA28", "#D4E157", "#8D6E63"];
        var legenda_animal = ["kip (x10)", "varken", "kalkoen", "overig"];

	

	if (value == "kipmens") {
		return "#5C6BC0"	
	}
	else if (value == "varkenmens") {
		return "#FFCA28"
		
	}
	else if (value == "kalkoenmens") {
		return "#D4E157"
	}
	else if (value == "overigmens") {
		return "#8D6E63"
	}
}

function update_linegraph (animal_line) {

	// verwijder oude lijnen
	linegraph.selectAll(".lijn").remove()

	// verwijder provincie lijnen
	if (current_province == "leeg") {
		remove_lines()
	}

	// console.log(update_knoppen)

	waardes, now_animal = calculate_line_values()



	// console.log(waardes)
	// console.log(now_animal)

		if (now_animal == "kipmens") {
			valueline = kip_line
		}
		else if (now_animal == "varkenmens") {
			valueline = varken_line
		}
		else if (now_animal == "kalkoenmens") {
			valueline = kalkoen_line
		}
		else if (now_animal == "overigmens") {
			valueline = overig_line
		}

		valueline = d3.svg.line()
		.x(function(d) { return x_line(d.year); })
		.y(function(d) { return y_line(d[now_animal]); })

		create_line_2(valueline, waardes, now_animal)
		y_as_numbers = []
}

function calculate_line_values () {

	var now_animal

	// console.log(update_knoppen)

	// kijk of knoppen uit staan
	if (nl_on == "no" && update_knoppen.length == 0) {
		update_knoppen = lijnsoorten
	}
	// console.log(nl_on)

	console.log(update_knoppen)
			
	// set new y_axis
	update_y_axis()



	for (var j = 0; j < update_knoppen.length; j++) {

		waardes = []
		for (var i = 0; i < jaren.length; i++) {

			// console.log(current_province)

			// kijk of het voor heel NL moet of een provincie
			if (current_province != "leeg") {
				number = line_gegevens[jaren[i]][current_province][update_knoppen[j]]
			}
			else {
				number = line_gegevens[jaren[i]]["Nederland"][update_knoppen[j]]
			}
			
			waardes[i] = {}
			waardes[i]["year"] = jaren[i]
			waardes[i][update_knoppen[j]] = number

		}

		

		// verwijder alle huidige lijnen
		if (update_knoppen.length > 1 && aap != "jan"){
			remove_lines()
			aap = "jan"
			// console.log("JAAHAA")
		}
		

		if (update_knoppen.length == 4 || update_knoppen.length == 2 || update_knoppen.length == 3) {

			now_animal = update_knoppen[j]

			// console.log(waardes)
			valueline = update_knoppen[j]

			valueline = d3.svg.line()
			.x(function(d) { return x_line(d.year); })
			.y(function(d) { return y_line(d[now_animal]); })

			create_line_2(valueline, waardes, now_animal)
		}

		// console.log(update_knoppen[j])
		now_animal = update_knoppen[j]

	}
		// als alle knoppeen aan staan of onclick provincie
		if (update_knoppen.length == 4) {
			update_knoppen = []
		}
	
		return waardes, now_animal
	
}


function remove_lines () {
	// console.log("OESS")

	linegraph.selectAll(".varkenmens").remove()
	linegraph.selectAll(".kipmens").remove()
	linegraph.selectAll(".overigmens").remove()
	linegraph.selectAll(".kalkoenmens").remove()
}

function update_y_axis () {

	for (var j = 0; j < update_knoppen.length; j++) {
		waardes = []
		for (var i = 0; i < jaren.length; i++) {
			if (current_province != "leeg") {
				number = line_gegevens[jaren[i]][current_province][update_knoppen[j]]
			}
			else {
				number = line_gegevens[jaren[i]]["Nederland"][update_knoppen[j]]
			}
			y_as_numbers.push(number)
		}
	}

	y_as_numbers.sort(function(a, b) { return b-a });

	// console.log(y_as_numbers)

	// update y as
	y_line.domain([0, y_as_numbers[0]]).nice()
	linegraph.select(".y.axis").transition().duration(300).call(y_lineAxis)

	

}