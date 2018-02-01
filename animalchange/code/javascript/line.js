// Name: Bob Borsboom
// Student number: 10802975
// Programming project

// an interactive linegraph using D3
// shows the amount of animals per province (or for the Neterlands) in the 
// period 2000-2016


jaren = ["2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016"]
lijnsoorten = ["kipmens", "varkenmens", "kalkoenmens", "overigmens"]

alle_dieren = ["kipmens", "varkenmens", "kalkoenmens", "overigmens"]
// for current buttons on

update_knoppen= []
y_as_numbers = []

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

var line_height
var linegraph
var line_values = 0;

lijnvalue = "leeg"

var lines_are_removed = "no"
var new_lines = "no"

function lineGraph() {

	var margin = {top: 20, right: 20, bottom: 50, left: 60}
	var width = 1250 - margin.left - margin.right;
	line_height = 480 - margin.top - margin.bottom;

	linegraph = d3.select(".linegraph")
		.attr("width", width + margin.left + margin.right)
		.attr("height", line_height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

	x_line = d3.scale.linear()
		.range([0, width]);

	y_line = d3.scale.linear()
		.range([line_height, 0]);

	x_lineAxis = d3.svg.axis()
		.tickFormat(function(d) { return d })
		.scale(x_line)
		.orient("bottom");

	y_lineAxis = d3.svg.axis()
		.scale(y_line)
		.orient("left")

	var color = d3.scale.category10();

	queue()
		.defer(d3.json, "json/mdata.json")
		.await(make_line);

	function make_line(error, linedata) {

		line_gegevens = linedata

		x_line.domain([2000, 2016])
		y_line.domain([0, 900])

		linegraph.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + line_height + ")")
			.call(x_lineAxis);

		linegraph.append("g")
			.attr("class", "y axis")
			.call(y_lineAxis);

		// draw lines
		calculate_line("kipmens")
		calculate_line("varkenmens")
		calculate_line("kalkoenmens")
		calculate_line("overigmens")

		var line_colors = ["#A1887F", "#F48FB1", "#D4E157", "#FF8A65"];
        var legenda_animal = ["kip (x10)", "varken", "kalkoen", "overig"];

		var line_legend = linegraph.selectAll(".line_legend")
			.attr("class", "linelegenda")
            .data(line_colors)
            .enter()
            .append("g")
            .attr("class", "line_legend")
            .attr("transform", function(d, i ) { return "translate (0," + i * 30  + ")"; });

		// position legenda blocks
        line_legend.append("rect")
       		.attr("class", "linelegenda")
            .attr("id", function(d, i) { return d })
            .attr("x", width - 20)
            .attr("y", 80)
            .attr("width", 30)
            .attr("height", 25)
            .attr("stroke", "black")
            .style("fill", function(d) { return d });

        // position legenda text 
        line_legend.append("text")
        	.attr("class", "linelegenda")
            .data(legenda_animal)
            .attr("x", width - 30)
            .attr("y", 90)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
             .style("font-size", "20px")
            .text(function(d) { return d; })

        // titel on x axis
        linegraph.append("g")
        	.append("text")
			.attr("x", 1060)
			.attr("y", 440)

			.style("font-size", "30px")
			.text("jaren")

		// titel on y axis
		linegraph.append("g")
        	.append("text")
			.attr("x", -410)
			.attr("y", -40)
			.attr("transform", function(d) {
                return "rotate(-90)" 
                })
			.style("font-size", "25px")
			.text("Aantal per 1000 mensen")

        // logs the number 2000 below the slider
        var slider = d3.selectAll(".slidecontainer")
			slider.append("text")
			.text(2000)
			.style("font-size", "30px")


		line_values = calculate_mouseover_values()
		mouseover()
	}
}

// calculates the mouseover values
function calculate_mouseover_values () {
	
	lijn_waardes1 = []
	lijn_waardes2 = []
	lijn_waardes3 = []
	lijn_waardes4 = []

	alle_dieren = ["kipmens", "varkenmens", "kalkoenmens", "overigmens"]

	for (var j = 0; j < alle_dieren.lenth; j++) { 

		for (var i = 0; i < jaren.length; i++) {

			if (current_province == "leeg") {
				number = line_gegevens[jaren[i]]["Nederland"][alle_dieren[j]]	
			}
			else {
				number = line_gegevens[jaren[i]][current_province][alle_dieren[j]]
			}

			if (j == 0) {
				lijn_waardes1[i] = {}
				lijn_waardes1[i]["date"] = dateFromDay((jaren[i]), 1)
				lijn_waardes1[i]["value"] = number
			}
			else if (j == 1) {
				lijn_waardes2[i] = {}
				lijn_waardes2[i]["date"] = dateFromDay((jaren[i]), 1)
				lijn_waardes2[i]["value"] = number
			}
			else if (j == 2) {
				lijn_waardes3[i] = {}
				lijn_waardes3[i]["date"] = dateFromDay((jaren[i]), 1)
				lijn_waardes3[i]["value"] = number
			}
			else if (j == 3) {
				lijn_waardes4[i] = {}
				lijn_waardes4[i]["date"] = dateFromDay((jaren[i]), 1)
				lijn_waardes4[i]["value"] = number
			}
			
		}
	}

	return {
		lijn_waardes1,
		lijn_waardes2,
		lijn_waardes3,
		lijn_waardes4,

	}
}

// calculate the line values
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

// draws the line
function create_line (line, waardes, value) {
	

	linegraph.append("path")
		.attr("class", "lijn")
		.attr("id", value)
		.attr("stroke", color_line(value))
		.attr("stroke-width", 7)
		.attr("d", line(waardes))
		.style("fill", "none")
}

// draws the line for update
function create_line_2 (line, waardes, value) {

	new_lines = "yes"

	linegraph.append("path")
		.attr("class", value + " lijn")
		.attr("stroke", color_line(value))
		.attr("stroke-width", 7)
		.attr("d", line(waardes))
		.style("fill", "none")

	line_values = calculate_mouseover_values()
	mouseover()
	
}

// returns a color based on the input
function color_line (value) {	

	var line_colors = ["#A1887F", "#F48FB1", "#D4E157", "#FF8A65"];
    var legenda_animal = ["kip (x10)", "varken", "kalkoen", "overig"];

	if (value == "kipmens") {
		return "#A1887F"	
	}
	else if (value == "varkenmens") {
		return "#F48FB1"
		
	}
	else if (value == "kalkoenmens") {
		return "#D4E157"
	}
	else if (value == "overigmens") {
		return "#FF8A65"
	}
}

function update_linegraph (animal_line) {

	// remove old lines
	linegraph.selectAll(".lijn").remove()

	// remove lines if user clicked on a province
	if (current_province == "leeg") {
		remove_lines()
	}

	// set new y_axis
	update_y_axis()
	waardes, now_animal = calculate_line_values()

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

	// check if buttons are off
	if (nl_on == "no" && update_knoppen.length == 0) {
		update_knoppen = ["kipmens", "varkenmens", "kalkoenmens", "overigmens"]
	}
	
	if (nl_on == "yes" && update_knoppen.length == 0) {
		update_knoppen = lijnsoorten
	}

	// remove the first four elements in the array
	else if (nl_on == "no" && update_knoppen.length > 4) {
		for (var i = 0; i < 4; i++){
			update_knoppen.shift()
		}
		
	}
			
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
		if (update_knoppen.length > 1 && lines_are_removed != "yes"){
			remove_lines()
			lines_are_removed = "yes"
		}

		if (update_knoppen.length == 4 || update_knoppen.length == 2 || update_knoppen.length == 3) {

			now_animal = update_knoppen[j]
			valueline = update_knoppen[j]

			valueline = d3.svg.line()
			.x(function(d) { return x_line(d.year); })
			.y(function(d) { return y_line(d[now_animal]); })

			create_line_2(valueline, waardes, now_animal)
			
		}

		now_animal = update_knoppen[j]

	}
		return waardes, now_animal
	
}

// remove all lines
function remove_lines () {

	linegraph.selectAll(".varkenmens").remove()
	linegraph.selectAll(".kipmens").remove()
	linegraph.selectAll(".overigmens").remove()
	linegraph.selectAll(".kalkoenmens").remove()
}

// update the y axis based on the current values
function update_y_axis (value) {

	// update y as als alle knoppen uit staan
	if (update_knoppen.length == 0 && value == "draw all lines")
	{
		// TO DO
	}

	// standaart y as update
	else {
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

	// update y as
	y_line.domain([0, y_as_numbers[0]]).nice()
	linegraph.select(".y.axis").transition().duration(1000).call(y_lineAxis)
	}
}


function mouseover () {

	// linegraph.selectAll(".circle").remove()

	var x_data;

	var mouseG = linegraph.append("g")
	.attr("class", "mouse-over-effects")

	mouseG.append("path")
	.attr("class", "mouse-line")
	.style("stroke", "black")
	.style("stroke-width", "1px")
	.style("opacity", "0")

	var lines = document.getElementsByClassName("lijn")
	

	var mousePerLine = mouseG.selectAll(".mouse-per-line")
	.data(gegevens)
	.enter()
	.append("g")
	.attr("class", "mouse-per-line")

	mousePerLine.append("circle")
	.attr("class", "circle")
	.attr("r", 7)
	.style("stroke", "black")
	.style("fill", "none")
	.style("stroke-width", "1px")
	.style("opacity", "0")

	mousePerLine.append("text")
		.attr("transform", "translate(10,3)")

	mouseG.append("svg:rect")
	.attr("width", width)
	.attr("height", line_height)
	.attr("fill", "none")
	.attr("pointer-events", "all")

	.on('mouseout', function() { // on mouse out hide line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "0");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "0");
      })

	.on('mouseover', function() { // on mouse in show line, circles and text
        d3.select(".mouse-line")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line circle")
          .style("opacity", "1");
        d3.selectAll(".mouse-per-line text")
          .style("opacity", "1");
      })

	.on("mousemove", function() {
		var mouse = d3.mouse(this)
		d3.select(".mouse-line")
			.attr("d", function () {
				var d = "M" + mouse[0] + "," + line_height;
				d  += " " + mouse[0] + "," + 0;
				return d;
			});

		d3.selectAll(".mouse-per-line")
			.attr("transform", function(d, i) {

				year = x_line.invert(mouse[0]);
				x_data = dateFromDay(year, 1),
					bisect = d3.bisector(function() 
					{ 
					return x_data
						}).right

				idx = index_number(x_data)

				var beginning = 0,
                	end = lines[i].getTotalLength(),
                	target = null;
                
                while (true){
               		

	              target = Math.floor((beginning + end) / 2);
	              pos = lines[i].getPointAtLength(target);
	              if ((target === end || target === beginning) && pos.x !== mouse[0]) {
	                  break;
	              }
	              if (pos.x > mouse[0])      end = target;
	              else if (pos.x < mouse[0]) beginning = target;
	              else break; //position found
	            }
	            
	            d3.select(this).select('text')
	              .text(y_line.invert(pos.y).toFixed(2));

	              // console.log(y_line.invert(pos.y))
	            return "translate(" + mouse[0] + "," + pos.y +")";


			});


	});

	function index_number (date) {

		var count = 1;

		for (var i = 0; i < line_values["lijn_waardes1"].length; i++) {
			if (date.getTime() == line_values["lijn_waardes1"][i].date.getTime()) {
				count = i				
				return count
			}
		}
	}

}

function dateFromDay(year, day) {
	    var date = new Date(year, 0)
	    return new Date(date.setDate(day));
}

d3.selection.prototype.moveToBack = function() {  
    return this.each(function() { 
        var firstChild = this.parentNode.firstChild; 
        if (firstChild) { 
            this.parentNode.insertBefore(this, firstChild); 
        } 
    });
};