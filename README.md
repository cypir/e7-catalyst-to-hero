## Underlying Data Format
This application relies on data from [EpicSevenDB](https://github.com/EpicSevenDB/gamedatabase).

#### SHA Map

This map is used to identify which heroes have had their data updated:

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

Mapping of catalyst usage by hero:

```
hero name:
  catalyst name:
    Skills/Awakening:
      quantity needed by level
```

e.g.

```
Zeno:
  {
    "shiny-enchantment": {
        "Skills":
          [12, 12, 12]
    },
    "horn-of-desire": {
        "Skills":
          [2, 2, 2],
        "Awakening":
          [0, 0, 0, 0, 0, 10]
    },
    ...
```

#### Catalyst -> Usage Map

This is the goal - to map catalysts to their usages.

```
catalyst name:
  hero name:
    Skills/Awakening:
      quantity needed by level
```

e.g.

```
demon-blood-gem
  {
    "Dingo": {
        "Skills":
          [2, 2, 1],
        "Awakening":
          [0, 0, 0, 0, 0, 8]
    },
    "Judge Kise": {
        "Skills":
          [2, 2, 3],
        "Awakening":
          [0, 0, 0, 0, 0, 10]
    },
    ...
  }
```
