import React, { Component } from "react";
import TextField from "@material-ui/core/TextField";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import cataMap from "./e7_cata_to_hero_map.json";
import slug from "slug";
import { ListItemText } from "@material-ui/core";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import CheckIcon from "@material-ui/icons/CheckCircle";
import CloseIcon from "@material-ui/icons/Close";
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

    if (results) {
      let heroesArray = Object.keys(results).map(key => {
        return { hero: key, ...results[key] }; //create an array where we put the key into the contents of the array
      });
      this.setState({ results: heroesArray });
    }
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
            console.log(result);
            return (
              <ListItem key={index} button>
                <ListItemText>{result.hero}</ListItemText>
                <ListItemSecondaryAction>
                  {result.Awakening ? <CheckIcon /> : <CloseIcon />}
                  Awakening
                  {result.Skills ? <CheckIcon /> : <CloseIcon />}
                  Skill Enhance
                </ListItemSecondaryAction>
              </ListItem>
            );
          })}
        </List>
      </div>
    );
  }
}

export default App;
