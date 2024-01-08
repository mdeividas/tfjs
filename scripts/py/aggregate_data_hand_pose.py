import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import sys
import os
import json
import math
import csv

SOURCE_PATH = sys.argv[1]

json_files = []
csv_file = "{src}/data.csv".format(src=SOURCE_PATH)

def calculate_distance(x1, x2, y1, y2):
    return math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)


f = open(csv_file, 'w')
writer = csv.writer(f)

writer.writerow([
    'name',
    'wrist',
    'wrist_thumb_distance',
    'wrist_index_distance',
    'wrist_middle_distance',
    'wrist_ring_distance',
    'wrist_pinky_distance'
])

for file_name in os.listdir(SOURCE_PATH):
    if '.json' in file_name:
        json_files.append("{src}/{file}".format(src=SOURCE_PATH, file=file_name))

for file in json_files:
    jf = open(file)
    data = json.load(jf)

    for key_pont in data:
        wrist = key_pont['wrist']
        thumb_tip = key_pont['thumb_tip']
        index_tip = key_pont['index_finger_tip']
        middle_tip = key_pont['middle_finger_tip']
        ring_tip = key_pont['ring_finger_tip']
        pinky_tip = key_pont['pinky_finger_tip']

        wrist_thumb_distance = calculate_distance(wrist['x'], thumb_tip['x'], wrist['y'], thumb_tip['y'])
        wrist_pinky_distance = calculate_distance(wrist['x'], pinky_tip['x'], wrist['y'], pinky_tip['y'])
        wrist_ring_distance = calculate_distance(wrist['x'], ring_tip['x'], wrist['y'], ring_tip['y'])
        wrist_middle_distance = calculate_distance(wrist['x'], middle_tip['x'], wrist['y'], middle_tip['y'])
        wrist_index_distance = calculate_distance(wrist['x'], index_tip['x'], wrist['y'], index_tip['y'])

        category = file.split('/')

        row = [
            category[len(category) - 1].replace('.json', ''),
            wrist['x'],
            wrist_thumb_distance,
            wrist_index_distance,
            wrist_middle_distance,
            wrist_ring_distance,
            wrist_pinky_distance
        ]

        writer.writerow(row)

    jf.close()

f.close()

# Plot data
csv_data = pd.read_csv(csv_file)
fig, axes = plt.subplots(nrows=3, ncols=2)

data = csv_data[(csv_data['name'] == 'palm') | (csv_data['name'] == 'fist')]

np_array_data=np.array(data)
colors = {
    'palm': 'red',
    'fist': 'blue',
    'index': 'green',
    'pencil': 'orange',
}

labels = np.array([colors.get(item, 'default') for item in np_array_data[:,0]])

axes[0, 0].scatter(np_array_data[:,1],np_array_data[:,2], color=labels)
axes[0, 0].set_title('wrist_thumb_distance')
axes[0, 1].scatter(np_array_data[:,1],np_array_data[:,3], color=labels)
axes[0, 1].set_title('wrist_index_distance')
axes[1, 0].scatter(np_array_data[:,1],np_array_data[:,4], color=labels)
axes[1, 0].set_title('wrist_middle_distance')
axes[1, 1].scatter(np_array_data[:,1],np_array_data[:,5], color=labels)
axes[1, 1].set_title('wrist_ring_distance')
axes[2, 0].scatter(np_array_data[:,1],np_array_data[:,6], color=labels)
axes[2, 0].set_title('wrist_pinky_distance')

plt.show()
