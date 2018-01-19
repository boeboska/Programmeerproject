Name: Bob Borsboom
Studentnummber: 10802975
Course: Programmeerproject

In this document you will find the style rules I've used in my project code.
-------------------------------------------------------------------------------

1. Variables names: using underscore. Example: var line_data;

2. Indentation: using space, not tab

3. Line length: 80 characters maximum

4. Language: english

5. Comments: without capital letter

6. white lines: 1 white line maximal (if needed)

7. Creating function: always use 1 space betweens the different elements. Example: function color_line (value) {

8. Opening and closing functions: always closes the function at the sime place as openen. Example:
      function create_line (line, waardes, value) {
          linegraph.append("path")
              .attr("stroke", color_line(value))
              .attr("stroke-width", 4)
              .attr("d", line(waardes))
              .style("fill", "none")
      }

9. Comments: in 1 line

10. Quotes: Using dubble quotes

      
