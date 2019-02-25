import React, { Component } from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import util from "./util";

export default class SubDisplay extends Component {
  static propTypes = {
    result: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired
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
    } else if (hero[type]) {
      sum = hero[type].reduce((sum, val) => sum + val);
    }

    return sum;
  };

  render() {
    const { result, type, prefix } = this.props;
    return (
      <div style={{ marginLeft: 12 }}>
        <Typography variant="body1">
          <u>{type}</u> ({util.getSums(result, type)})
        </Typography>
        <ul style={{ marginTop: 2, paddingLeft: 18 }}>
          {result[type] &&
            result[type].map((item, index) => {
              if (item > 0) {
                return (
                  <li key={index}>
                    <Typography variant="body1">
                      {item} for {prefix}
                      {index + 1}
                    </Typography>
                  </li>
                );
              } else {
                return <span key={index} />;
              }
            })}
        </ul>
      </div>
    );
  }
}
