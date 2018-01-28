gegevens = 
provincies = ["Noord-Brabant", "Utrecht", "Zuid-Holland", "Noord-Holland", "Drenthe", "Friesland", "Gelderland", "Groningen", "Limburg", "Overijssel", "Flevoland", "Zeeland"]
provincies2 = ["Noord-Brabant", "Utrecht", "Zuid-Holland", "Noord-Holland"]
provincies3 = ["Drenthe", "Friesland", "Gelderland", "Groningen", "Limburg", "Overijssel", "Flevoland", "Zeeland"]
company_data = []
var map;
var tip;
var current_year;
array = [];

kip_button = 0;
chicken_button = "off"

varken_button = 0;
pig_button = "off"

overig_button = 0;
other_button = "off"

kalkoen_button = 0;
turkey_button = "off"

buttons_on = []

window.onload = function() {

    barChart();
    lineGraph();

    var width = 1000;
    var height = 1000;

    var projection = d3.geo.mercator()
        .scale(1)
        .translate([0, 0]);

    var path = d3.geo.path()
        .projection(projection);

    map = d3.select(".map")
        .attr("width", width)
        .attr("height", height);
 

    queue()
        .defer(d3.json, "nld.json")
        .defer(d3.json, "mdata.json")
        .await(data_loader);

    function data_loader (error, nld, data){
        
        // console.log(data)

        if (error) throw error;

        gegevens = data
        current_year = 2000;
   

        tip = d3.tip()
            .attr('class', 'd3-tip')
            .offset([-10, 0])
            .html(function(d) {
                return  "<strong> Capital: </strong> <span style='color:red'>" + d.properties.name + "</span>" +
                        "<div> <strong> Breeding Farms: </strong> <span style='color:red'>" + data[current_year][d.properties.name]["bedrijven"] + "</div>"

        });
        map.call(tip);

        var l = topojson.feature(nld, nld.objects.subunits).features[3],
            b = path.bounds(l),
            s = .2 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
            t = [(width - 200 - s * (b[1][0] + b[0][0])) / 2, (height - 100 - s * (b[1][1] + b[0][1])) / 2];

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

                if (d.properties.name != undefined) 
                { return map_color(gegevens["2000"][d.properties.name]["bedrijven"])}
            })
            .attr("class", function(d, i) { return d.properties.name; })

            .on("mouseover", tip.show)
            .on("mouseout", tip.hide)

            .on("click", function(d) { 
            change_year(current_year), click_province_bar(d.properties.name) })
            
        var colorss = ["#B3E5FC", "#4FC3F7", "#03A9F4", "#0288D1", "#01579B"];
        var legenda_numbers = ["0 - 250", "250 - 500", "500 - 1000", "1000 - 2000", "2000 +"];

        var legend = map.selectAll(".legend")
            .data(colorss)
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", function(d, i ) { return "translate (0," + i * 20 + ")"; });

            // positie van de blokjes van de legenda
        legend.append("rect")
            .attr("id", function(d, i) { return d })
            .attr("x", width - 20)
            .attr("y", 80)
            .attr("width", 18)
            .attr("height", 18)
            .attr("stroke", "black")
            .style("fill", function(d) { return d });

            // positie van de tekst van de legenda 
        legend.append("text")
            .data(legenda_numbers)
            .attr("x", width - 30)
            .attr("y", 90)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; })

        // var click_provincie = d3.selectAll(".legend")
        //     click_provincie.append("text")
        //     .text("Nederland")
        //     .style("font-size", "30px")
    };
};

function change_year(value) {

    console.log(value)

    current_year = value

    // als er knoppen aan staan, update dan de kaart met die knoppen
    if (buttons_on.length > 0) {
        make_map(buttons_on)
    }
    else {
        kaartje = map.selectAll("path")
        kaartje.attr("fill", function(d, i) { 
            if (d.properties.name != undefined) { 
                // console.log(map_color(gegevens[value][d.properties.name]["bedrijven"]))
                return map_color(gegevens[value][d.properties.name]["bedrijven"])
            }
        });
    }
}


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

function animal_button_map (value) {
    // console.log(value)

    if (value == "kip") {

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
        console.log(turkey_button)

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

function check_button_on_2 (value) {
    if (value % 2 == 1) {
        return "on"
    }
    else {
        return "off"
    }
}

// als er een button uit gaat
function remove_animal_from_array_map (animal) {
    for (var i = buttons_on.length - 1; i >= 0; i--) {
        if (buttons_on[i] == animal) {
            buttons_on.splice(i, 1)
        }
    }       
}

function make_map (aantal_buttons_aan) {

  // als alle knoppen uit staan of allemaal aan staan
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


function create_part_map (value) {

    new_map = map.selectAll("path")
    new_map.attr("fill", function(d,i) {
        if (d.properties.name != undefined) {
            // alleen kip of varken
            if (value.length == 1) {
                // console.log(value)
                return map_color(gegevens[current_year][d.properties.name][value])
            }
            // als alles uit staat
            else {
                return map_color(gegevens[current_year][d.properties.name]["bedrijven"])
            }  
        }
    })
}

// als er meedere buttons aan staan
function multiple_buttons_map (animal_rij) {

    rijtje_nummers = []
    eind_rijtje = []

    for (var i = 0; i < animal_rij.length; i++) {
        for (var j = 0; j < provincies.length; j++) {
            rijtje_nummers.push(parseInt(gegevens[current_year][provincies[j]][animal_rij[i]]))
        }
    }

    for (var i = 0; i < rijtje_nummers.length / animal_rij.length; i++) {
        // als er 2 dieren zijn
        if (animal_rij.length == 2) {
            eind_rijtje.push(rijtje_nummers[i] + rijtje_nummers[i + 12])
        }
        // als er 3 dieren zijn
        else if (animal_rij.length == 3) {
            eind_rijtje.push(rijtje_nummers[i] + rijtje_nummers[i + provincies.length] + rijtje_nummers[i + (provincies.length * 2)])
        }   
    }

    new_map = map.selectAll("path")
    new_map.attr("fill", function(d,i) {
        if (d.properties.name != undefined) {
            return  map_color(eind_rijtje[i - 1])
        }
    })
}

