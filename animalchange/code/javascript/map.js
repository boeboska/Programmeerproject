// Name: Bob Borsboom
// Student number: 10802975
// Programming project

// an interactive map using D3
// shows the amount of breeding farms per province per year


gegevens = 
provincies = ["Noord-Brabant", "Utrecht", "Zuid-Holland", "Noord-Holland", "Drenthe", "Friesland", "Gelderland", "Groningen", "Limburg", "Overijssel", "Flevoland", "Zeeland"]
provincies2 = ["Noord-Brabant", "Utrecht", "Zuid-Holland", "Noord-Holland"]
provincies3 = ["Drenthe", "Friesland", "Gelderland", "Groningen", "Limburg", "Overijssel", "Flevoland", "Zeeland"]
company_data = []
array = []
buttons_on = []

var map;
var tip;
var current_year;
var huidige_province

// initialize buttons
kip_button = 0;
chicken_button = "off"

varken_button = 0;
pig_button = "off"

overig_button = 0;
other_button = "off"

kalkoen_button = 0;
turkey_button = "off"

window.onload = function() {

    barChart();
    lineGraph();

    var width = 1160;
    var height = 1300;

    var projection = d3.geo.mercator()
        .scale(1)
        .translate([0, 0]);

    var path = d3.geo.path()
        .projection(projection);

    map = d3.select(".map")
        .attr("width", width + 300)
        .attr("height", height);

    queue()
        .defer(d3.json, "/json/nld.json")
        .defer(d3.json, "/json/mdata.json")
        .await(data_loader);

    function data_loader (error, nld, data){

        if (error) throw error;

        // visualisation starts in 2000
        gegevens = data
        current_year = 2000;
   
        tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return  "<strong> Hoofdstad: </strong> <span style='color:red'>" + d.properties.name + "</span>" +
                        "<div> <strong> Aantal boerderijen: </strong> <span style='color:red'>" + data[current_year][d.properties.name]["bedrijven"] + "</div>"

        });
        map.call(tip);

        // map position
        var l = topojson.feature(nld, nld.objects.subunits).features[3],
            b = path.bounds(l),
            s = .2 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
            t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - 100 - s * (b[1][1] + b[0][1])) / 2];

        projection
            .scale(s)
            .translate(t);

        map.selectAll("path")
            .data(topojson.feature(nld, nld.objects.subunits).features)
            .enter()
            .append("path")
            .attr("d", path)
            .attr("stroke", "black")
            .attr("id", "provincie")
            .attr("fill", function(d, i) {

                // only the 12 provinces in The Neterlands
                if (d.properties.name != undefined) 

                // fill the map based on the data per province
                { return map_color(gegevens["2000"][d.properties.name]["bedrijven"])}
            })
            .attr("class", function(d, i) { return d.properties.name; })

            .on("mouseover", tip.show)
            .on("mouseout", tip.hide)

            .on("click", function(d) { 
                huidige_province = d.properties.name, 

            // change year if slider changes and update barchart
            change_year(current_year), click_province_bar(d.properties.name), make_black(huidige_province) })
            
        var colorss = ["#B3E5FC", "#4FC3F7", "#03A9F4", "#0288D1", "#01579B"];
        var legenda_numbers = ["0 - 250", "250 - 500", "500 - 1000", "1000 - 2000", "2000 +"];

        var legend = map.selectAll(".legend")
            .data(colorss)
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i ) { return "translate (0," + i * 30 + ")"; });

        // position blocks on the legenda
        legend.append("rect")
            .attr("id", function(d, i) { return d })
            .attr("x", width + 10)
            .attr("y", 200)
            .attr("width", 30)
            .attr("height", 30)
            .attr("stroke", "black")
            .style("fill", function(d) { return d });

        // positie text legenda
        legend.append("text")
            .data(legenda_numbers)
            .attr("x", width)
            .attr("y", 210)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .style("font-size", "20px")
            .text(function(d) { return d; })

        // log the Netherlands in user's screen
        var click_provincie = d3.selectAll(".nl_button")
            click_provincie.selectAll("text").remove()
            click_provincie.append("text")
            .text("Nederland")
            .style("font-size", "30px")
            .attr("class", "log_province")
    };
};

function make_black(provincie) {

    // log the current province
    var click_provincie = d3.selectAll(".nl_button")
        click_provincie.selectAll("text").remove()
            click_provincie.append("text")
            .text(provincie)
            .style("font-size", "30px")
            .attr("class", "log_province")
    

    // first color everthing normale
    for (var i = 0; i < provincies.length; i++){
        normal_color = d3.selectAll("." + provincies[i])
        normal_color.style("fill",function(d, i) {

                // only the 12 provinces in The Neterlands
                if (d.properties.name != undefined) 

                // fill the map based on the data per province
                { return map_color(gegevens[current_year][d.properties.name]["bedrijven"])}
            })
    }

    // fill the clicked province black
    mapje = d3.selectAll("." + huidige_province)
    mapje.style("fill", "black")
}

// when the slider changes, update the map color
function change_year(value) {

    current_year = value

    // if there are buttons on, update the map with these button data
    if (buttons_on.length > 0) {
        make_map(buttons_on)
    }

    // draw the map color 
    make_black(huidige_province)
    
}

// fill the map based on the data per province
function map_color(number) {

    if (number >= 0) {

        if (number < 250 || number == 250) {
            return "#B3E5FC"
        } 
        else if (number > 250 && number < 500 || number == 500 ) {
            return "#4FC3F7"
        } 
        else if (number > 500 && number < 1000 || number == 1000) {
            return "#03A9F4"
        } 
        else if (number > 1000 && number < 2000 || number == 2000) {
            return "#0288D1"
        } 
        else if (number > 2000) {
            return "#01579B"
        }
    }
}

// buttons for updating the map
function animal_button_map (value) {

    if (value == "kip") {

        // set button on/off
        kip_button = kip_button + 1
        chicken_button = check_button_on_2(kip_button)


        if (chicken_button == "on") { 
            buttons_on.push("kipbedrijf")
            make_map(buttons_on)
        }
        else { 
            remove_animal_from_array_map("kipbedrijf")
            make_map(buttons_on)
        }
    }
    else if (value == "varken") {

        varken_button = varken_button + 1
        pig_button = check_button_on_2(varken_button)

        if (pig_button == "on") {
            buttons_on.push("varkenbedrijf")
            make_map(buttons_on)
        }
        else { 
            remove_animal_from_array_map("varkenbedrijf")
            make_map(buttons_on)
             }
    }
    else if (value == "overig") {

        overig_button = overig_button + 1
        other_button = check_button_on_2(overig_button)

        if (other_button == "on") {
            buttons_on.push("overigbedrijf")
            make_map(buttons_on)
        }
        else { 
            remove_animal_from_array_map("overigbedrijf")
            make_map(buttons_on)
             }
    }

    else if (value == "kalkoen") {

        kalkoen_button = kalkoen_button + 1
        turkey_button = check_button_on_2(kalkoen_button)
        // console.log(turkey_button)

        if (turkey_button == "on") {
            buttons_on.push("kalkoenbedrijf")
            make_map(buttons_on)

        }
        else { 
            remove_animal_from_array_map("kalkoenbedrijf")
            make_map(buttons_on)
        }
    }
}

// checks if button is on
function check_button_on_2 (value) {
    if (value % 2 == 1) {
        return "on"
    }
    else {
        return "off"
    }
}

// if a button goes out, remove from array
function remove_animal_from_array_map (animal) {
    for (var i = buttons_on.length - 1; i >= 0; i--) {
        if (buttons_on[i] == animal) {
            buttons_on.splice(i, 1)
        }
    }       
}

function make_map (aantal_buttons_aan) {

    // if all buttons are on or off
    if (aantal_buttons_aan.length == 0 || aantal_buttons_aan.length == 4) {
             create_part_map ("alle_buttons_staan_uit")
    }

    else if (aantal_buttons_aan.length == 1) {
        create_part_map (aantal_buttons_aan)
    }
    else if (aantal_buttons_aan.length > 1) {
        multiple_buttons_map (aantal_buttons_aan)
    }  
}

// update map when 0, 1 or 4 buttons are on
function create_part_map (value) {

    new_map = map.selectAll("path")
    new_map.attr("fill", function(d,i) {
        if (d.properties.name != undefined) {
            // if only 1 button is on
            if (value.length == 1) {
                return map_color(gegevens[current_year][d.properties.name][value])
            }
            // if all buttons are off
            else {
                return map_color(gegevens[current_year][d.properties.name]["bedrijven"])
            }  
        }
    })
}

// update map when 2 or 3 buttons are on
function multiple_buttons_map (animal_rij) {

    rijtje_nummers = []
    eind_rijtje = []

    // calculate all the data
    for (var i = 0; i < animal_rij.length; i++) {
        for (var j = 0; j < provincies.length; j++) {
            rijtje_nummers.push(parseInt(gegevens[current_year][provincies[j]][animal_rij[i]]))
        }
    }

    // sort the data 
    for (var i = 0; i < rijtje_nummers.length / animal_rij.length; i++) {
        // if two buttons are on
        if (animal_rij.length == 2) {
            eind_rijtje.push(rijtje_nummers[i] + rijtje_nummers[i + 12])
        }
        // if three buttons are on
        else if (animal_rij.length == 3) {
            eind_rijtje.push(rijtje_nummers[i] + rijtje_nummers[i + provincies.length] + rijtje_nummers[i + (provincies.length * 2)])
        }   
    }

    // fill the map
    new_map = map.selectAll("path")
    new_map.attr("fill", function(d,i) {
        if (d.properties.name != undefined) {
            return  map_color(eind_rijtje[i - 1])
        }
    })
}

