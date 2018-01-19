import json
import csv

temp = {}
dieren = []
j = 0
i = 0
hoeveel = 0

# Open the csv file and delete the first rows.
file = open('datah.txt', 'r') 
text = file.readlines()


for jaar in range (17):
	for elke_kolom in range (13):
		for kolom in text:
			kolom = kolom.strip("\n").split("\t")
			getal = kolom[2 + (elke_kolom * 17) + jaar]
			if getal is not (""):
				dieren.append(getal)
				hoeveel = hoeveel + 1


print(hoeveel)


for row in text:

	
	row = row.strip("\n").split("\t")
	year = row[0]

	temp[year] = {}

	# DOET DIT OOK 17 KEER
	for line in text:

		line = line.strip("\n").split("\t")
		provincie = line[1]

		if provincie is not ("") and j != len(dieren):
			temp[year][provincie] = {}
			# if j == 1326:

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
			j = j + 10
			# print(j)

with open("datah.json", "w") as outfile:
	json.dump(temp, outfile)