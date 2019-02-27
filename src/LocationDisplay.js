import React, { Component } from "react";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";

export default class LocationDisplay extends Component {
  static propTypes = {
    locations: PropTypes.arrayOf(PropTypes.object)
  };

  render() {
    const { locations } = this.props;
    return (
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {locations.map(location => {
          return (
            <div key={location.stage} style={{ marginRight: 4, marginTop: 4 }}>
              <Chip
                avatar={<Avatar>{location.mobs}</Avatar>}
                label={location.stage}
              />
            </div>
          );
        })}
      </div>
    );
  }
}
