// Name: Bob Borsboom
// Student number: 10802975
// Programming project

// an interactive barchart using D3
// shows the amount of animals per province (or for the Neterlands) per year

soorten = ["kip", "varken", "overig", "kalkoen"]
update_soorten = []

var currentdata;
var currentyear;

var total = 0
var y;
var height;
var yAxis;
var xAxis;
var x;

var nl_on = "yes"
var barchart;
var current_province = "leeg";

// initialize the buttons
kip_on = "off"
varken_on = "off"
overig_on = "off"
kalkoen_on = "off"

var tip_bar

current_animals = soorten


function barChart() {

	
	var margin = {top: 25, right: 30, bottom: 60, left: 60}
	width = 1100 - margin.left - margin.right
	height = 850 - margin.top - margin.bottom;



		x = d3.scale.ordinal()
		.rangeRoundBands([0, width], .1);

	// y = d3.scale.linear()
	y = d3.scale.log()
		// .base(Math.E)
		.range([height, 0]);


	xAxis = d3.svg.axis()
		.scale(x)
		.orient("bottom");

	yAxis = d3.svg.axis()
		.scale(y)
		.orient("left")
		.ticks(5)
	
	barchart = d3.select(".barchart")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + ", " + margin.top + ")");
	
	queue()
		.defer(d3.json, "/json/mdata.json")
		.await(make_bar);

	function make_bar(error, bardata) {
		// console.log(bardata)

		// console.log(bardata)

		currentdata = bardata
		currentyear = 2000;

		numbers_array = []

		// calculate data for begin visualisation in NL in 2000 for all animals
		for (var i = 0; i < soorten.length; i++){
			rijtje = parseInt(bardata[currentyear]["Nederland"][soorten[i]])
			numbers_array.push(rijtje)
		}

		if (error) throw error

		tip_bar = d3.tip()
			.attr('class', 'd3-tipbar')
			.offset([-10, 0])
			.html(function(d, i) {

				// if on hover bar show the connected line with the bar
				show_conntected_line(i)
				return "<strong> Aantal: </strong> <span style='color:red'>" + current_hover_data(i) + "</span>";
		});

		d3.select(".barchart")
		.call(tip_bar);

		// for all the animals
		x.domain(soorten)
		// y.domain([Math.exp(9), Math.exp(18.5)])

		y.domain([d3.min(numbers_array), d3.max(numbers_array)]).nice()

		// y.domain([, d3.max(numbers_array)])

		// y.domain([500000, 110000000])
		// y.domain([500000, d3.max(numbers_array) + 50000000])

		// TEXT OP X AS
		barchart.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + height +")")
			.call(xAxis)
			.append("text")
			.attr("x", width - 80)
			.attr("y", .75 * margin.bottom)
			.style("font-size", "30px")
			.text("soort")

		// TEXT OP Y AS
		barchart.append("g")
			.attr("class", "y axis")
			.call(yAxis 
				.tickFormat(d3.format("s") ))
			.append("text")
			.attr("x", - 750)
			.attr("y", -40)
			.attr("transform", function(d) {
                return "rotate(-90)" 
                })
			.style("font-size", "30px")
			.text("aantal")


		barchart.selectAll(".bar")
			.data(numbers_array)
			.enter()
			.append("rect")
			.attr("class", "bar")
			.attr("id", function(d, i) { return soorten[i]})

			// calculation the x and y position of the bars
			.attr("x", function(d, i) {  return x(soorten[i]); })
			.attr("width", x.rangeBand())

			.attr("y", function(d, i) { return y(numbers_array[i]); })
			.attr("height", function(d, i) { return height - y(numbers_array[i]); })

			.on("mouseover", tip_bar.show)
			.on("mouseout", function() {
				tip_bar.hide();
				out_line()
				
				
			})

	}
}

// if on hover bar show the connected line with the bar
function show_conntected_line (i) {

	var jani= x.domain()
	var current_line = (jani[i] + "mens")

	// draw all lines with the normal colors and stroke-width
	for (var i = 0; i < lijnsoorten.length; i++) {

		// when the lines are drawed again
		if (new_lines == "yes") {
			var show_line_return = d3.selectAll("." + lijnsoorten[i])
		}
		else {
			var show_line_return = d3.selectAll("#" + lijnsoorten[i])
		}

		show_line_return.attr("stroke", (color_line(lijnsoorten[i])))
		show_line_return.attr("stroke-width", 7)
	}

	if (new_lines == "yes") {
		var show_line = d3.selectAll("." + current_line)
	}
	else {
		var show_line = d3.selectAll("#" + current_line)
	}

	// draw the line in black wich is connected with the bar
	show_line.attr("stroke", "black")
	show_line.attr("stroke-width", 10)
}          

// draw all lines with the normal colors and stroke-width
function out_line () {

	for (var i = 0; i < lijnsoorten.length; i++) {

		// wanneer de lijnen opnieuwe getekend zijn
		if (new_lines == "yes") {
			var show_line_return = d3.selectAll("." + lijnsoorten[i])
		}

		else {
			var show_line_return = d3.selectAll("#" + lijnsoorten[i])
		}

		show_line_return.attr("stroke", (color_line(lijnsoorten[i])))
		show_line_return.attr("stroke-width", 7)
	}
}

function powerOfTen (d) {
	console.log(d)
	return d / Math.pow(10, Math.ceil(Math.log(d) / Math.LN10 - 1e-12)) === 1;
}

// when slider changes, log the current year and update barchart
function change_year_bar(value) {
	
	var slider = d3.selectAll(".slidecontainer")
		slider.selectAll("text").remove()
		slider.append("text")
		.text(value)
		.style("font-size", "30px")

	currentyear = value
	calculate_y_numbers()
}

// calculate the data for the new barchart
function calculate_y_numbers () {

	numbers_array = []
	for (var i = 0; i < current_animals.length; i++) {
		
		// if the user wants The Netherlands
		if (current_province == "leeg" || nl_on == "yes") {	
			rijtje = parseInt(currentdata[currentyear]["Nederland"][current_animals[i]])
		}
		// if the user wants a specific province
		else {
			rijtje = parseInt(currentdata[currentyear][current_province][current_animals[i]])
		}
		numbers_array.push(rijtje)
	}

	update_barchart(numbers_array, current_animals)
}

// when the user clicks a province in the map, update barchart and linegraph
function click_province_bar (province) {

	// logt de huidige provincie
  //   var click_provincie = d3.selectAll(".nl_button")
	 //    click_provincie.selectAll("text").remove()
		// click_provincie.append("text")
		// .attr("class", provincie_locatie)
		// .text(province)
		// .style("font-size", "30px")

	current_province = province
	nl_on = "no"

	// if all buttons are on
	if (update_soorten.length > 0){
		current_animals = update_soorten
	}

	numbers_array = calculate_y_numbers()

	// remove all old lines
	remove_lines()

	// draw the new lines
	update_linegraph()
}

function update_barchart (y_numbers, x_numbers) {

	
	// if all buttons are off
	if (x_numbers.length == 0) {
		x_numbers = soorten
		current_animals = soorten
		calculate_y_numbers()
	}
	else {
		// set all zero values to 1 because of logaritmic scale
		for (var i = 0; i < y_numbers.length; i++) {
			if (y_numbers[i] == 0) {
					y_numbers[i] = 1
			}
		}

		// update the x and y axis
		y.domain([d3.min(y_numbers), d3.max(y_numbers)]).nice()
		x.domain(x_numbers)
		
		barchart.select(".x.axis").transition().duration(1000).call(xAxis)
		barchart.select(".y.axis").transition().duration(1000).call(yAxis)

		var new_bar = barchart.selectAll(".bar").data(y_numbers)
		new_bar.exit()
			// .transition()
			// .duration(1000)
		.remove()

		new_bar.enter().append("rect")
			
			
		new_bar.transition().duration(1000)
			.attr("x", function(d, i) { return x(x_numbers[i]); })
			.attr("width", x.rangeBand())
			.attr("y", function(d, i) { return y(y_numbers[i]); })
			.attr("height", function(d, i) { return height - y(y_numbers[i]); })
			.attr("id", function(d, i) { return x_numbers[i] })
			.attr("class", "bar")

		new_bar
			.on("mouseover", tip_bar.show)
			.on("mouseout", function() {
				out_line(),
				tip_bar.hide ()
				
			})

	}
}

// when user clicks the buttons NL, update barchart and linegraph
function back_to_nl () {

	huidige_province = "Nederland"
	make_black(huidige_province)

	// // zet huidige plek op nederland
	// var click_provincie = d3.selectAll(".legend")
	// 	click_provincie.selectAll("text").remove()
 //        click_provincie.append("text")
 //        .text("Nederland")
 //        .style("font-size", "30px")

	current_province = "leeg"
	nl_on = "yes"
	calculate_y_numbers()

	// remove old lines and draw new 
	remove_lines()
	if (update_knoppen.length == 0) {
		update_knoppen = lijnsoorten
		update_linegraph()
		update_knoppen = []
	}
	else {
		update_linegraph()
	}

}


function animal_button_bar (value) {

	if (value == "kip") {
		kip_click = kip_click + 1
		kip_on = check_button_on(kip_click)

		if (kip_on == "on") {

			update_soorten.push("kip")
			update_knoppen.push("kipmens")
			current_animals = update_soorten
			calculate_y_numbers()

			
			// als er op een provincie is geklikt
			if (current_province != "leeg") {
				remove_lines()
			}
			update_linegraph("kipmens")

			
		}
		else { 
			remove_animal_from_array("kip") 
			remove_animal_from_array_line("kipmens")
			calculate_y_numbers()
			linegraph.selectAll(".kipmens").remove()
			// console.log(update_knoppen)
			remove_lines()
			update_linegraph()

			// voor de mouseover goed te krijgen
			line_values = calculate_mouseover_values()
			mouseover()
			
		}
			
	}

	else if (value == "varken") {
		varken_click = varken_click + 1
		varken_on = check_button_on(varken_click)

		if (varken_on == "on") {
			update_soorten.push("varken")
			update_knoppen.push("varkenmens")
			current_animals = update_soorten
			calculate_y_numbers()

			if (current_province != "leeg") {
				remove_lines()
			}



			update_linegraph("varkenmens")
		}
		else { 
			remove_animal_from_array("varken") 
			remove_animal_from_array_line("varkenmens")
			calculate_y_numbers()
			linegraph.selectAll(".varkenmens").remove()
			remove_lines()
			update_linegraph()

			// voor de mouseover goed te krijgen
			line_values = calculate_mouseover_values()
			mouseover()
			


		}	
	}

	else if (value == "overig") {
		overig_click = overig_click + 1
		overig_on = check_button_on(overig_click)

		if (overig_on == "on") {
			update_soorten.push("overig")
			update_knoppen.push("overigmens")
			current_animals = update_soorten
			calculate_y_numbers()



			if (current_province != "leeg") {
				remove_lines()
			}

			update_linegraph("overigmens")
		}
		else { 
			remove_animal_from_array("overig")
			calculate_y_numbers()
			remove_animal_from_array_line("overigmens")
			linegraph.selectAll(".overigmens").remove()
			remove_lines()
			update_linegraph()


			// voor de mouseover goed te krijgen
			line_values = calculate_mouseover_values()
			mouseover()
			


		}	
	}

	else if (value == "kalkoen") {
			kalkoen_click = kalkoen_click + 1
			kalkoen_on = check_button_on(kalkoen_click)

			if (kalkoen_on == "on") {
				update_soorten.push("kalkoen")
				update_knoppen.push("kalkoenmens")
				current_animals = update_soorten
				calculate_y_numbers()


				if (current_province != "leeg") {
					remove_lines()
				}
				update_linegraph("kalkoenmens")
			}
			else { 
				remove_animal_from_array("kalkoen") 
				calculate_y_numbers()
				remove_animal_from_array_line("kalkoenmens")
				linegraph.selectAll(".kalkoenmens").remove()
				remove_lines()
				update_linegraph()


				// voor de mouseover goed te krijgen
				line_values = calculate_mouseover_values()
				mouseover()
			

			}	
	}
}

function check_button_on (value) {
	if (value % 2 == 1) {
		return "on"
	}
	else {
		return "off"
	}
}

function remove_animal_from_array (animal) {

	for (var i = update_soorten.length - 1; i >= 0; i--) {
		if (update_soorten[i] == animal) {
    		update_soorten.splice(i, 1)
		}
	}		
}

function current_hover_data(hover_anmial) {
	// als een van de knoppen aan staat
	if (update_soorten.length > 0) {
		// NL OF PROVINCIE
		if (nl_on == "yes") {

			return convert_number_to_good_notation(parseInt(currentdata[currentyear]["Nederland"][update_soorten[hover_anmial]]))
		}
		else {
			return convert_number_to_good_notation(parseInt(currentdata[currentyear][current_province][update_soorten[hover_anmial]]))
		}
	}
	// als geneen van de knoppen aan staan
	else {
		if (nl_on == "yes") {
			return convert_number_to_good_notation(parseInt(currentdata[currentyear]["Nederland"][current_animals[hover_anmial]]))	
		}
		else {
			return convert_number_to_good_notation(parseInt(currentdata[currentyear][current_province][current_animals[hover_anmial]]))
		}
	}
}

function convert_number_to_good_notation (number) {

	var number = number.toLocaleString (undefined, { minimumFractionDigits: 0} );
	return number
}

function remove_animal_from_array_line (animal) {
	// console.log(animal)
	// console.log(update_knoppen)

	for (var i = update_knoppen.length - 1; i >= 0; i--) {
		if (update_knoppen[i] == animal) {
    		update_knoppen.splice(i, 1)
		}
	}
	
	// console.log(update_knoppen)
}










