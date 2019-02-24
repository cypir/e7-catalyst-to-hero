Python script to create catalyst mappings: `scrape_e7x.py`.

### Usage
```python
import json
from scrape_e7x import get_maps, update_maps, create_catalyst_map, cache_maps

hero_catalyst_map, sha_map = update_maps(*get_maps(cached=False))
catalyst_map = create_catalyst_map(hero_catalyst_map)
print(json.dumps(catalyst_map['demon-blood-gem'], indent=4))
```
Creates three mappings:
#### SHA Map
This map is used to identify which heroes have had their data updated
```
hero JSON filename:
  SHA
```
e.g.
```
tieria.json:
  c76681c5d32c984c71a8d656db850b184e9ca01c
```
#### Hero -> Catalyst Map
This map 
```
hero name:
  catalyst name:
    skill/awakening:
      quantity needed
```
e.g.
```
Zeno:
  {
    "shiny-enchantment": {
        "s1": 12,
        "s2": 12,
        "s3": 12
    },
    "horn-of-desire": {
        "s1": 2,
        "s2": 2,
        "s3": 2,
        "awakening_6": 10
    },
    "blazing-rage": {
        "awakening_5": 15
    }
}
```

#### Catalyst -> Usage Map
This is the goal - to map catalysts to their usages.
```
catalyst name:
  hero name:
    skill/awakening:
      quantity needed
```
e.g.
```
demon-blood-gem
  {
    "Dingo": {
        "s1": 2,
        "s2": 2,
        "s3": 1,
        "awakening_6": 8
    },
    "Judge Kise": {
        "s1": 2,
        "s2": 2,
        "s3": 3,
        "awakening_6": 10
    },
    ...
  }
```
