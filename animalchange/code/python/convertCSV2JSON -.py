import json
import csv

temp = {}
dieren = []
j = 0;
i = 0;
hoeveel = 0;

# Open the csv file
file = open('m_data.txt', 'r') 
text = file.readlines()

# 17 years and 13 places
for jaar in range (17):
	for elke_kolom in range (13):
		for kolom in text:
			kolom = kolom.strip("\n").split("\t")
			getal = kolom[2 + (elke_kolom * 17) + jaar]
			if getal is not (""):
				dieren.append(getal)
				hoeveel = hoeveel + 1

for row in text:

	row = row.strip("\n").split("\t")
	year = row[0]

	temp[year] = {}

	for line in text:

		line = line.strip("\n").split("\t")
		provincie = line[1]

		if provincie is not ("") and j != len(dieren):
			temp[year][provincie] = {}

			temp[year][provincie]["varken"] = dieren[j]

			temp[year][provincie]["kip"] = dieren[j+1]
			temp[year][provincie]["kalkoen"] = dieren[j+2]
			temp[year][provincie]["overig"] = dieren[j+3]
			temp[year][provincie]["bedrijven"] = dieren[j+4]
			temp[year][provincie]["mensen"] = dieren[j+5]

			temp[year][provincie]["varkenmens"] = dieren[j+6]
			temp[year][provincie]["kipmens"] = dieren[j+7]
			temp[year][provincie]["kalkoenmens"] = dieren[j+8]
			temp[year][provincie]["overigmens"] = dieren[j+9]

			temp[year][provincie]["varkenbedrijf"] = dieren[j+10]
			temp[year][provincie]["kipbedrijf"] = dieren[j+11]
			temp[year][provincie]["kalkoenbedrijf"] = dieren[j+12]
			temp[year][provincie]["overigbedrijf"] = dieren[j+13]

			j = j + 14

# store all the data in the json
with open("cbs_data.json", "w") as outfile:
	json.dump(temp, outfile)