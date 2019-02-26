import requests
import json
from datetime import datetime

# Get item index
start = datetime.now()
r = requests.get('https://api.github.com/repos/EpicSevenDB/gamedatabase/contents/src/item')
print('{} - Retrieved item list from e7db'.format(datetime.now() - start))
item_jsons = r.json()

# Map of form:
#   db name
#       catalyst full name
#       list of tuples (location/stage, num_mobs), sorted descending by num mobs
INFO_LOC = 'e7_catalyst_info.json'
loc_map = dict()

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

    # Best location to farm each catalyst
    best_locations = []
    for loc in item_json.get('locations', []):
        try:
            mobcount = int(loc.get('mobcount', 0))
        except Exception as e:
            mobcount = 0
        best_locations.append({'stage': loc['node'], 'mobs': mobcount})
    best_locations = sorted(best_locations, key=lambda x: x['mobs'], reverse=True)

    # Map names and location info
    loc_map[item_db_name] = {
        'name': item_json['name'],
        'locations': best_locations
    }

    print('{} - Processed catalyst info for {}'.format(datetime.now() - start, item_json['name']))

print('{} - Created catalyst information map.'.format(datetime.now() - start))

# Serialize
with open(INFO_LOC, 'w+') as loc_map_file:
    json.dump(loc_map, loc_map_file)

print('{} - Serialized catalyst info map to disk at {}'.format(datetime.now() - start, INFO_LOC))
