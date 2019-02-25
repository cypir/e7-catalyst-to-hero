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

    console.log(results);

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
                <ListItem button onClick={() => this.handleSelect(index)}>
                  <ListItemText>{result.hero}</ListItemText>
                  <ListItemSecondaryAction>
                    <div style={{ display: "flex" }}>
                      {result.Awakening ? (
                        <Typography style={{ marginRight: 12 }}>A</Typography>
                      ) : null}
                      {result.Skills ? <Typography>E</Typography> : null}
                    </div>
                  </ListItemSecondaryAction>
                </ListItem>
                <Collapse in={result.selected} timeout="auto" unmountOnExit>
                  That content though
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
