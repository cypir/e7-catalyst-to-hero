export default {
  getSums: (hero, type) => {
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
  }
};
