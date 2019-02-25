import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import cataMap from "./e7_cata_to_hero_map.json";
import slug from "slug";
import { ListItemText } from "@material-ui/core";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Collapse from "@material-ui/core/Collapse";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";

class App extends Component {
  state = {
    search: "",
    results: []
  };

  onSearchChange = e => {
    this.setState({ search: e.target.value });
  };

  //TODO: enable search for catalyst / fuzzy search
  //TODO: first entry should show list of catalysts

  onSubmit = e => {
    e.preventDefault();

    let searchKey = slug(this.state.search).toLowerCase();
    let results = cataMap[searchKey];

    if (results) {
      let heroesArray = Object.keys(results).map(key => {
        return { hero: key, selected: false, ...results[key] }; //create an array where we put the key into the contents of the array
      });
      this.setState({ results: heroesArray });
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

  getSums = (hero, type) => {
    let sum = 0;

    //get total sum
    if (!type) {
      if (hero.Awakening) {
        sum = hero.Awakening.reduce((sum, val) => sum + val);
      }

      if (hero.Skills) {
        sum += hero.Skills.reduce((sum, val) => sum + val);
      }
    } else {
      sum = hero[type].reduce((sum, val) => sum + val);
    }

    return sum;
  };

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit}>
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
        <List component="nav">
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
                      {result.hero} ({this.getSums(result)})
                    </Typography>
                  </ListItemText>
                  <ListItemSecondaryAction>
                    <div style={{ display: "flex" }}>
                      {result.Awakening ? (
                        <Typography style={{ marginRight: 12 }}>
                          {this.getSums(result, "Awakening")}A
                        </Typography>
                      ) : null}
                      {result.Skills ? (
                        <Typography>
                          {this.getSums(result, "Skills")}S
                        </Typography>
                      ) : null}
                    </div>
                  </ListItemSecondaryAction>
                </ListItem>
                <Collapse in={result.selected} timeout="auto" unmountOnExit>
                  <Grid container spacing={24}>
                    <Grid item xs={6}>
                      <div style={{ marginLeft: 12 }}>
                        <Typography variant="body1">
                          <u>Awakening</u>
                        </Typography>
                        <ul style={{ marginTop: 2, paddingLeft: 18 }}>
                          {result.Awakening &&
                            result.Awakening.map((item, index) => {
                              if (item > 0) {
                                return (
                                  <li>
                                    <Typography variant="body1">
                                      {item} required for level {index}
                                    </Typography>
                                  </li>
                                );
                              } else {
                                return <span />;
                              }
                            })}
                        </ul>
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body1">
                        <u>Skill Enhancement</u>
                      </Typography>
                      <div style={{ marginRight: 12 }}>
                        <ul style={{ marginTop: 2, paddingLeft: 18 }}>
                          {result.Skills &&
                            result.Skills.map((item, index) => {
                              if (item > 0) {
                                return (
                                  <li>
                                    <Typography key={index} variant="body1">
                                      {item} required for level {index + 1}
                                    </Typography>
                                  </li>
                                );
                              } else {
                                return <span key={index} />;
                              }
                            })}
                        </ul>
                      </div>
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
