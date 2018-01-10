Design document animal change
===============================

#### In this document you could read the technical parts for the programming project about the animal change in The Netherlands between 2000-2016. Including the technical user disicion diagram, data source AND ??

Name: Bob Borsboom

Studentnumber: 10802975

Course: Programming project


Technical user disicion diagram:
-----------------------
![](doc/tech.png)



#### components description:
##### Slider: For the slider I need data from multiple years. Next to that I need three main update functions. 1 for the map, 1 for the barchart and 1 for the linegraph. These main functions are also usefull for the other two user interactions (Onclick map and Onclick checkbox > see below). 
##### Onclick map: For the onclick map I need data per province. Next to that I can use 2/3 main update functions. 1 for the barchart and 1 for the linegraph
##### Onclick checkbox: For the Onclick checkbox I need data of the amount of breeding farms per animal per province. Next to that I can use 3/3 main update functions. 1 for the map, 1 for the barchart and 1 for the linegraph.

#### The three main update functions are javascript functions. These functions retreive information from HTML. When the user gives input by clicking on map/slider/checkbox the HTML code will be activated.

#### Data:
For the line graph the data should be transformed. The amount of animals per 1.000 people will be showed. 
Therefor the amount of animals must be divided by the population amount.

Data from CBS about the amount of breeding farms per province and the amount of animals per province
http://statline.cbs.nl/Statweb/publication/?DM=SLNL&PA=80780ned&D1=542,560,572-575,578-579&D2=0,5-16&D3=a&HDR=G1,G2&STB=T&VW=T

Data from CBS about the amount of people in The Netherlands:
http://statline.cbs.nl/Statweb/publication/?DM=SLNL&PA=37556&D1=0&D2=101-118&HDR=G1&STB=T&VW=T

#### External components:
The external components needed for the project are:
- D3 v3: d3js.org/d3.v3.min.js
- D3 tooltip: http://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js
- D3 queue: http://d3js.org/queue.v1.min.js
- D3 topoJson: http://d3js.org/topojson.v1.min.js
