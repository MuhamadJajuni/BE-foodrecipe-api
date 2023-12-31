const db = require("../../config/db");

const modelRecipeCategory = {
  getAll: () => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM category`, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },
};

module.exports = modelRecipeCategory;
