import requests
import json
from datetime import datetime

# Get item index
start = datetime.now()
r = requests.get('https://api.github.com/repos/EpicSevenDB/gamedatabase/contents/src/item')
print('{} - Retrieved item list from e7db'.format(datetime.now() - start))
item_jsons = r.json()

# Map of db name -> formal name
NAME_MAP_LOC = 'e7_name_map.json'
name_map = dict()

for item_file in item_jsons:
    # Skip README.md / extraneous stuff
    if not item_file['name'].endswith('.json'):
        continue

    # Item name in the db (no apostrophes, dashes instead of spaces, yadda yadda)
    item_db_name = item_file['name'].split('.json')[0]

    # Retrieve data for a given catalyst/item
    r = requests.get(item_file['download_url'])
    item_json = r.json()

    # If it's not a catalyst, skip it
    if item_json['type'] != 'catalyst':
        continue

    # Otherwise, map names
    name_map[item_db_name] = item_json['name']

    print('{} - Processed name for {}'.format(datetime.now() - start, item_json['name']))

print('{} - Created name map.'.format(datetime.now() - start))

# Serialize
with open(NAME_MAP_LOC, 'w+') as name_map_file:
    json.dump(name_map, name_map_file)

print('{} - Serialized name map to disk at {}'.format(datetime.now() - start, NAME_MAP_LOC))