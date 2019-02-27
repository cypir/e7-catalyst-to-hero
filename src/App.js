import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import cataMap from "./e7_cata_to_hero_map.json";
import cataInfo from "./e7_catalyst_info.json";
import slug from "slug";
import { ListItemText } from "@material-ui/core";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Collapse from "@material-ui/core/Collapse";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import SubDisplay from "./SubDisplay.js";
import util from "./util";
import LocationDisplay from "./LocationDisplay";

const catalysts = Object.keys(cataInfo).map(key => {
  return {
    id: key,
    value: cataInfo[key].name,
    locations: cataInfo[key].locations
  };
});

class App extends Component {
  state = {
    search: "",
    results: [],
    validSearch: false,
    matchingCatalysts: []
  };

  onSearchChange = e => {
    let matchingCatalysts = catalysts.filter(name => {
      return name.value
        .toLowerCase()
        .replace(/\W/g, "")
        .includes(e.target.value.replace(/\W/g, "").toLowerCase());
    });

    //when we have more than 1 matching catalyst, we are doing a new search so we clear
    if (matchingCatalysts.length > 1) {
      this.setState({ search: e.target.value, matchingCatalysts, results: [] });
    } else {
      this.setState({ search: e.target.value, matchingCatalysts });
    }
  };

  onCatalystClicked = value => {
    let matchingCatalysts = catalysts.filter(name => {
      return name.value
        .toLowerCase()
        .replace(/\W/g, "")
        .includes(value.replace(/\W/g, "").toLowerCase());
    });

    this.setState({ search: value, matchingCatalysts }, () =>
      this.getResults()
    );
  };

  //TODO: enable search for catalyst / fuzzy search
  //TODO: first entry should show list of catalysts

  onSubmit = e => {
    e.preventDefault();
    this.getResults();
  };

  getResults = () => {
    let searchKey = slug(this.state.search).toLowerCase();
    let results = cataMap[searchKey];

    if (results) {
      let heroesArray = Object.keys(results).map(key => {
        return { hero: key, selected: false, ...results[key] }; //create an array where we put the key into the contents of the array
      });
      this.setState({ results: heroesArray });
    } else {
      this.setState({ results: [] });
    }
  };

  handleSelect = index => {
    this.setState(state => {
      const results = state.results.map((item, i) => {
        if (index === i) {
          return { ...item, selected: !item.selected };
        } else {
          return item;
        }
      });

      return {
        results
      };
    });
  };

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit} autoComplete="off">
          <TextField
            label="Catalyst"
            name="catalyst"
            value={this.state.search}
            onChange={this.onSearchChange}
          />
          <Button variant="contained" type="submit" color="primary">
            Search
          </Button>
        </form>
        <List>
          {this.state.matchingCatalysts.map(catalyst => {
            return (
              <ListItem
                key={catalyst.id}
                button
                onClick={e => {
                  this.setState({ search: catalyst.value }, () => {
                    this.onCatalystClicked(catalyst.value);
                  });
                }}
                disableGutters
              >
                <ListItemText>
                  <Typography variant="h6">{catalyst.value}</Typography>
                  <Typography variant="body1">
                    Mob count followed by stage
                  </Typography>
                  {this.state.matchingCatalysts.length === 1 ? (
                    <LocationDisplay locations={catalyst.locations} />
                  ) : null}
                </ListItemText>
              </ListItem>
            );
          })}
        </List>
        <List>
          {this.state.results.map((result, index) => {
            return (
              <div key={index}>
                <ListItem
                  button
                  onClick={() => this.handleSelect(index)}
                  disableGutters
                >
                  <ListItemText>
                    <Typography variant="h6">
                      {result.hero} ({util.getSums(result)})
                    </Typography>
                  </ListItemText>
                  <ListItemSecondaryAction>
                    <div style={{ display: "flex" }}>
                      {result.Awakening ? (
                        <Typography style={{ marginRight: 12 }}>
                          {util.getSums(result, "Awakening")}A
                        </Typography>
                      ) : null}
                      {result.Skills ? (
                        <Typography>
                          {util.getSums(result, "Skills")}S
                        </Typography>
                      ) : null}
                    </div>
                  </ListItemSecondaryAction>
                </ListItem>
                <Collapse in={result.selected} timeout="auto" unmountOnExit>
                  <Grid container spacing={24}>
                    <Grid item xs={6}>
                      <SubDisplay
                        result={result}
                        type={"Awakening"}
                        prefix={"level "}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <SubDisplay
                        result={result}
                        type={"Skills"}
                        prefix={"s"}
                      />
                    </Grid>
                  </Grid>
                </Collapse>
              </div>
            );
          })}
        </List>
      </div>
    );
  }
}

export default App;
