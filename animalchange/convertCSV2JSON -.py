import json
import csv

temp = {}
dieren = []
j = 0
i = 0

# Open the csv file and delete the first rows.
file = open('data.txt', 'r') 
text = file.readlines()


for jaar in range (17):
	for elke_kolom in range (13):
		for kolom in text:
			kolom = kolom.strip("\n").split("\t")
			getal = kolom[2 + (elke_kolom * 17) + jaar]
			if getal is not (""):
				dieren.append(getal)

print(dieren)

for row in text:
	
	row = row.strip("\n").split("\t")
	year = row[0]
	temp[year] = {}
	
	for line in text:

		line = line.strip("\n").split("\t")
		provincie = line[1]
		if provincie is not (""):
			temp[year][provincie] = {}

			temp[year][provincie]["varken"] = dieren[j]
			temp[year][provincie]["kip"] = dieren[j+1]
			temp[year][provincie]["kalkoen"] = dieren[j+2]
			temp[year][provincie]["konijn"] = dieren[j+3]
			temp[year][provincie]["bedrijven"] = dieren[j+4]
			temp[year][provincie]["mensen"] = dieren[j+5]
			j = j + 6

with open("data.json", "w") as outfile:
	json.dump(temp, outfile)