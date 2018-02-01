#### Introduction:

In this report you can read wich important desicions I've made during this project,
why the end result is a bit different than the proposal and what the difficult things were.

#### Description of the visualisation: 

In the visualisation there are three main graphs. A map where the user can see the distribution of the breeding farms in the Netherlands,
a barchart where they can see the exact amount of animals (chicken, pigs, turkeys and other) and a linegraph where 
they can see the change over time. Next to the three main graphs the user can slide between years,
click on different provinces and filter on animals.

#### Technical design:
There are three javascript files. One for the map, one for the barchart and one for the linegraph. Within these files there are update
functions. An update function for the barchart, one for the linegraph and one for the map.

Update function barchart: This function is called when the user changed the year, on clicks a province of filter on an animal. 
The update function updates the data based on the input it receives. Within this new data it calculates the new x and y positions of 
the new bars. With a duration the new bars fly in the visualisation.

Update function linegraph: This function is called when the user on clicks a province of filter on an animal. 
If the update function is called, all the current lines will be removed. The update function updates the data based on the input it 
receives and draw the new lines.

Update function map: This function is called when the user changed the year or filter on an animal. 
The update function updates the data based on the input it receives. Within these data it calculates the new province color.

Around the javascript files there are sereval css files for styling. For each visualisation there is a css file. Next to that there are
css files for the frontpage, titles, buttons and slider.

#### challenges:
- Create 1 big JSON file. This took me 2-3 days in total to create one JSON file where all the data is good structured 
for all the visualisations.
- Update the barchart. Mainly updating the y-axis of the barchart. There is a lot of difference between the values of the bars. 
Therefore I had to make a logaritmic axis. Next to that I had to make a good readable axis notation. This was also a challenge.
- Update linegraph: It was hard to transform my data from the JSON in javascript to a good format. Next to that it was
really hard to update the linegraph based on the user input (via the buttons or on click the map). It took me about 4 days to debug
all the bugs and they are still there sometimes.

#### Decision changes:
- Based on the sketch I swaped the map and the barchart. Because the map feels more like the first visualisation. When a user clicks
on the map the barchart updates.
- Linegraph data: First when a user clicks a province I divided for example the amount of chicken in that province by the amount
of people in that province. But the lines were so different in each province so I changed the division. Now, when a users clicks
a provinces I divide the amount of chicken by the amount of people in The Netherlands. This is better I think because the chicks 
who lives in Noord-Holland for example are eated not only there but also in other provinces.
- Drop down: In my visualisation there are 17 years to chose. A dropdown menu is to big therefor and ugly. There I made a sliders.
It looks a lot better, it is better user experience because the user can now chose different years faster.


Defend your decisions by writing an argument of a most a single paragraph. Why was it good to do it different than you thought before?
Are there trade-offs for your current solution? In an ideal world, given much more time, would you choose another solution?






