import sys
import os

SOURCE_PATH = sys.argv[1]

categories = ['rock', 'paper', 'scissors']
datasets = ['train', 'test', 'validation']

data = {
    'rock': os.listdir("{src}/rock".format(src=SOURCE_PATH)),
    'paper': os.listdir("{src}/paper".format(src=SOURCE_PATH)),
    'scissors': os.listdir("{src}/scissors".format(src=SOURCE_PATH)),
}

for dataset in datasets:
    dataset_dir = "{src}/{dataset}".format(src=SOURCE_PATH, dataset=dataset)

    exist_dir = os.path.exists(dataset_dir)

    if not exist_dir:
        os.makedirs(dataset_dir)

    for category in categories:
        category_dir = "{dir}/{category}".format(dir=dataset_dir, category=category)

        exist_category_dir = os.path.exists(category_dir)

        if not exist_category_dir:
            os.makedirs(category_dir)

        samples = data[category]
        category_samples = samples[0:int(len(samples) * 0.8)]

        if dataset == 'test':
            category_samples = samples[int(len(samples) * 0.8):int(len(samples) * 0.95)]

        if dataset == 'validation':
            category_samples = samples[int(len(samples) * 0.95):]

        for sample in category_samples:
            source = "{src}/{category}/{name}".format(src=SOURCE_PATH, category=category, name=sample)
            target = "{src}/{name}".format(src=category_dir, name=sample)
            os.rename(source, target)
