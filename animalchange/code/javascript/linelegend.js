function linelegend() {

    linelegend = d3.select(".linelegend")
    var line_colors = ["#A1887F", "#F48FB1", "#D4E157", "#FF8A65"];
    var legenda_animal = ["kip (x10)", "varken", "kalkoen", "overig"];

        var line_legend = linegraph.selectAll(".linelegend")
            .attr("class", "linelegenda")
            .data(line_colors)
            .enter()
            .append("g")
            .attr("class", "line_legend")
            .attr("transform", function(d, i ) { return "translate (0," + i * 30  + ")"; });

        // positie van de blokjes van de legenda
        line_legend.append("rect")
            .attr("class", "linelegenda")
            .attr("id", function(d, i) { return d })
            .attr("x", width - 20)
            .attr("y", 80)
            .attr("width", 30)
            .attr("height", 25)
            .attr("stroke", "black")
            .style("fill", function(d) { return d });

        // positie van de tekst van de legenda 
        line_legend.append("text")
            .attr("class", "linelegenda")
            .data(legenda_animal)
            .attr("x", width - 30)
            .attr("y", 90)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) { return d; })
}

