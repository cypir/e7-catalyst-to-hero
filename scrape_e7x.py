import requests
import pickle
import json
import re
import string
import numpy as np
from datetime import datetime
from collections import defaultdict

_CACHE_MAP_LOC = 'e7_catamap.json'
_SHA_MAP_LOC = 'e7_shamap.json'

# I hate myself
def hacky_dd_to_dict(d):
    if isinstance(d, defaultdict):
        d = {k: hacky_dd_to_dict(v) for k, v in d.items()}
    return d

# Get cached versions of the maps
def get_maps(cached=True):
    start = datetime.now()

    # Initialize maps
    hero_catalyst_map = dict()
    sha_map = dict()

    # Retrieve cached versions
    if cached:
        # Hero catalyst mapping
        try:
            with open(_CACHE_MAP_LOC, 'r+') as map_cache:
                hero_catalyst_map = json.load(map_cache)
        except Exception as e:
            print('Error loading cached hero->catalyst map, reconstructing:\n{}'.format(e))

        # SHA mapping
        try:
            with open(_SHA_MAP_LOC, 'r+') as sha_cache:
                sha_map = json.load(sha_cache)
        except Exception as e:
            print('Error loading cached SHA map, reconstructing:\n{}'.format(e))

        print('{} - Retrieved cached maps'.format(datetime.now() - start))

    return hero_catalyst_map, sha_map

# Update the cached maps
def cache_maps(hero_catalyst_map, sha_map):
    start = datetime.now()

    # Store hero->catalyst map
    with open(_CACHE_MAP_LOC, 'w+') as map_cache:
        json.dump(hero_catalyst_map, map_cache)

    # Store SHA map
    with open(_SHA_MAP_LOC, 'w+') as sha_cache:
        json.dump(sha_map, sha_cache)

    print('{} - Serialized cached maps to disk'.format(datetime.now() - start))

NON_CATALYST_RESOURCES = {'molagora', 'molagorago', 'gold'}

def dict_dd():
    return defaultdict(dict)

def int_arr_len(max_len):
    return list(map(int, np.zeros(max_len)))

def int_arr_dd(max_len):
    return defaultdict(lambda: int_arr_len(max_len))

def dict_int_arr_dd(max_len):
    return defaultdict(lambda: int_arr_dd(max_len))

# Get catalyst usages for a single hero
def catalyst_usage_for_hero(hero_json):
    # catalyst -> usage list
    hero_map = dict_int_arr_dd(10)

    # Crawl skills
    skills = hero_json['skills']
    for skill_level, skill_dict in enumerate(skills):
        enhancement_levels = skill_dict['enhancement']

        # Crawl each enhancement level
        for e_lvl in enhancement_levels:
            for resource_dict in e_lvl['resources']:
                resource = resource_dict['item']
                # if it's a catalyst, update with the skill level and quantity needed
                if resource not in NON_CATALYST_RESOURCES:
                    hero_map[resource]['Skills'][skill_level] += resource_dict['qty']

    # Crawl awakenings
    for awakening_dict in hero_json['awakening']:
        for resource_dict in awakening_dict['resources']:
            resource = resource_dict['item']

            # If it's a catalyst, update with awakening level and quantity needed
            if 'rune' not in resource:
                hero_map[resource]['Awakening'][awakening_dict['rank'] - 1] += resource_dict['qty']

    return hacky_dd_to_dict(hero_map)

# Update hero->catalyst mapping and SHA mapping
def update_maps(hero_catalyst_map, sha_map):
    # Find all heroes
    start = datetime.now()
    r = requests.get('https://api.github.com/repos/EpicSevenDB/gamedatabase/contents/src/hero')
    heroes = r.json()
    heroes = [h for h in heroes if h['name'].endswith('.json')]
    print('{} - Retrieved hero index'.format(datetime.now() - start))

    # Create/update hero->catalyst map
    for hero in heroes:
        # Check if hash has changed. If so, update!
        sha = hero['sha']
        hero_fname = hero['name']
        if sha != sha_map.get(hero_fname):
            # Retrieve data
            r = requests.get(hero['download_url'])
            hero_json = r.json()

            # Get catalysts for the hero & update hero -> catalyst map
            hero_name = hero_json['name']
            hero_map = catalyst_usage_for_hero(hero_json)
            hero_catalyst_map[hero_name] = hero_map

            # Update SHA
            sha_map[hero_fname] = sha
            print('{} - Updated map for {}'.format(datetime.now() - start, hero_name))

    cache_maps(hero_catalyst_map, sha_map)
    print('{} - Updated hero->catalyst map!'.format(datetime.now() - start))
    return hero_catalyst_map, sha_map

def create_catalyst_map(hero_catalyst_map):
    '''
    Remap into catalyst -> hero -> usage dict with format:

    catalyst:
        hero:
            Skill/Awakening:
                list of quantities

    e.g.
    demon-blood-gem:
        Rin:
            Skills:
                [2, 2, 1]
            Awakening:
                [0, 0, 0, 0, 0, 8]
    '''
    start = datetime.now()

    # Initialize
    catalyst_hero_map = defaultdict(dict_dd)

    # Remap
    for hero_name, hero_catalysts in hero_catalyst_map.items():
        for catalyst, usages_dict in hero_catalysts.items():
            catalyst_hero_map[catalyst][hero_name] = usages_dict

    # convert to dict
    catalyst_hero_map = hacky_dd_to_dict(catalyst_hero_map)
    print('{} - Generated catalyst -> hero map!'.format(datetime.now() - start))

    return catalyst_hero_map

'''
USAGE:

import json
from scrape_e7x import get_maps, update_maps, create_catalyst_map, cache_maps

hero_catalyst_map, sha_map = update_maps(*get_maps())
catalyst_map = create_catalyst_map(hero_catalyst_map)
print(json.dumps(catalyst_map['demon-blood-gem'], indent=4))
'''
