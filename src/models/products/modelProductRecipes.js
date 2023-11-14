const db = require("../../config/db");

const modelProductRecipes= {
  allRecipe: () => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT recipe.id, recipe.title, recipe.ingredients, recipe.videolink, recipe.image, category.name AS category, users.name AS author FROM recipe JOIN category ON recipe.category_id = category.id JOIN users ON users_id = users.id`,
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  },

  myRecipeCount: async (data) => {
    const { search, searchBy, id } = data;
    return new Promise((resolve, reject) =>
      db.query(
        `SELECT COUNT(*) FROM recipe JOIN category ON recipe.category_id = category.id WHERE users_id = ${id} AND ${searchBy} ILIKE '%${search}%'`,
        (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(err);
          }
        }
      )
    );
  },
  
  getMyRecipe: async (data) => {
    const { search, searchBy, offset, limit, id, sort } = data;
    return new Promise((resolve, reject) =>
      db.query(
        `SELECT recipe.id, recipe.title, recipe.ingredients, recipe.videolink, recipe.image, category.name AS category FROM recipe JOIN category ON recipe.category_id = category.id WHERE users_id = ${id} AND ${searchBy} ILIKE '%${search}%' ORDER BY title ${sort} OFFSET ${offset} LIMIT ${limit}`,
        (err, result) => {
          if (!err) {
            resolve(result);
          } else {
            reject(err);
          }
        }
      )
    );
  },

  getDetail: async (id) => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT recipe.id, recipe.title, recipe.ingredients, recipe.videolink, recipe.image,recipe.create_at, category.name AS category, users.name AS author 
        FROM recipe 
        JOIN category ON recipe.category_id = category.id 
        JOIN users ON recipe.users_id = users.id
        WHERE recipe.id = ${id}`,

        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  },

  selectAllRecipe: async (
    limit,
    offset,
    searchParam,
    sortBY,
    sort,
    searchBY
  ) => {
    let query = `SELECT recipe.id, recipe.title,recipe.create_at, recipe.ingredients, recipe.image, category.name AS category, users.name AS author FROM recipe JOIN category ON recipe.category_id = category.id JOIN users ON users_id = users.id WHERE ${searchBY} ILIKE '%${searchParam}%' ORDER BY ${sortBY} ${sort} LIMIT ${limit} OFFSET ${offset}`;
    return new Promise((resolve, reject) => {
      db.query(query, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  },

  coutData: async () => {
    return db.query("SELECT COUNT(*) FROM recipe");
  },

  createRecipe: ({ title, ingredients, videolink, image, category_id, users_id }) => {
    return new Promise((resolve, reject) => {
      db.query(
        `INSERT INTO recipe (title, ingredients, videolink, image, category_id, users_id) VALUES ($1, $2, $3, $4, $5, $6)`,
        [title, ingredients, videolink, image, category_id, users_id],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  },

  findById: (id) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM recipe WHERE id = ${id}`, (err, result) => {
        if (!err) {
          resolve(result);
        } else {
          reject(err);
        }
      });
    });
  },

  update: async ({ id, title, ingredients, videolink, image, category_id }) => {
    const query =
      "UPDATE recipe SET title = $1, ingredients = $2, videoLink = $3, image = $4, category_id = $5 WHERE id = $6 RETURNING *";
    const values = [title, ingredients, videolink, image, category_id, id];

    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  },

  destroy: async (id) => {
    const query = "DELETE FROM recipe WHERE id = $1 RETURNING image";
    const values = [id];

    try {
      const result = await db.query(query, values);
      return result.rows[0];
    } catch (err) {
      throw err;
    }
  },


};

module.exports = modelProductRecipes;
