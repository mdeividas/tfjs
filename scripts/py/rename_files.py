import sys
import os

SOURCE_PATH = sys.argv[1]

categories = ['rock', 'paper', 'scissors']

for category in categories:
    for (index, file) in enumerate(os.listdir("{src}/{category}".format(src=SOURCE_PATH, category=category))):
        file_name = "{category}_{index}.png".format(category=category, index=index)
        current_file = "{src}/{category}/{name}".format(src=SOURCE_PATH, category=category, name=file)
        new_file = "{src}/{category}/{name}".format(src=SOURCE_PATH, category=category, name=file_name)
