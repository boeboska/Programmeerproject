gegevens = 
// provincies = ["Groningen", "Friesland", "Drenthe", "Overijssel", "Flevoland", "Gelderland", "Utrecht", "Noord-Holland", "Zuid-Holland", "Zeeland", "Noord-Brabant", "Limburg"]
provincies2 = ["Noord-Brabant", "Utrecht", "Zuid-Holland", "Noord-Holland"]
provincies3 = ["Drenthe", "Friesland", "Gelderland", "Groningen", "Limburg", "Overijssel", "Flevoland", "Zeeland"]
company_data = []
var map;
var tip;
var current_year;
array = [];

window.onload = function() {

    var width = 900;
    var height = 800;

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
        .defer(d3.json, "data.json")
        .await(data_loader);



    function data_loader (error, nld, data){
   
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

        var colorss = ["#ffe6e6", "#ffb3b3", "#ff6666", "#ff1a1a", "#b30000"];
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

    };
};



function change_year(value){

    current_year = value

    kaartje = map.selectAll("path")
    kaartje.attr("fill", function(d, i) { if (d.properties.name != undefined) 
        { return map_color(gegevens[value][d.properties.name]["bedrijven"])}
        });

    legendah = legend
    legendah.attr("x", width - 30)
    .attr("y", 90)
    .attr("dy", ".35em")
    .style("text-anchor", "end")
    .text("value")
}

function map_color(number){
    // console.log(number)
    if (number < 250 || number == 250) {
        return "#ffe6e6"
    } else if (number > 250 && number < 500 || number == 500 ) {
        return "#ffb3b3"
    } else if (number > 500 && number < 1000 || number == 1000) {
        return "#ff6666"
    } else if (number > 1000 && number < 2000 || number == 2000) {
        return "#ff1a1a"
    } else if (number > 2000) {
        return "#b30000"
    }
}