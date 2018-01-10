window.onload = function() {

    var width = 750;
    var height = 600;

    var projection = d3.geo.mercator()
        .scale(1)
        .translate([0, 0]);

    var path = d3.geo.path()
        .projection(projection);

    var map = d3.select(".map")
        .attr("width", width)
        .attr("height", height);
 

    queue()
        .defer(d3.json, "nld.json")
        .defer(d3.json, "data.json")
        .await(data_loader);

    function data_loader (error, nld, data){
   
        if (error) throw error;

        
        provincies = ["Groningen", "Friesland", "Drenthe", "Overijssel", "Flevoland", "Gelderland", "Utrecht", "Noord-Holland", "Zuid-Holland", "Zeeland", "Noord-Brabant", "Limburg"]
        company_data = []
        for (i = 0; i < provincies.length; i++){
            company_data.push(data["2016"][provincies[i]]["bedrijven"])
        }
        company_data.push("0", "0", "0", "0")
        
        

        console.log(company_data)
        var tip = d3.tip()
            .attr('class', 'd3-tip')

        // calculate position
            .offset([-10, 0])


        // set data within the display function
            .html(function(d) {
            
                return  "<strong> Capital: </strong> <span style='color:red'>" + d.properties.name + "</span>" +
                        "<div> <strong> Breeding Farms: </strong> <span style='color:red'>" + data["2016"][d.properties.name]["bedrijven"] + "</div>"


        });
        map.call(tip);


        var l = topojson.feature(nld, nld.objects.subunits).features[3],
            b = path.bounds(l),
            s = .2 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
            t = [(width - 100 - s * (b[1][0] + b[0][0])) / 2, (height + 100 - s * (b[1][1] + b[0][1])) / 2];

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

            .attr("fill", function(d, i) { return map_color(company_data[i]); })


            // .attr("fill", function(d) { return map_color(data["2016"][d.properties.name]["bedrijven"]); })


            .attr("class", function(d, i) { return d.properties.name; })

            .on("mouseover", tip.show)
            .on("mouseout", tip.hide)

        var colorss = ["pink", "HotPink", "DeepPink", "red"];
        var legenda_numbers = ["0 - 500", "500 - 1000", "1000 - 2000", "2000 +"];

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


function map_color(number){
    console.log(number)
    if (number < 500 || number == 500 ) {
        return "pink"
    } else if (number > 500 && number < 1000 || number == 1000) {
        return "HotPink"
    } else if (number > 1000 && number < 2000 || number == 2000) {
        return "DeepPink"
    } else if (number > 2000) {
        return "red"
    }
}

