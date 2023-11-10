const modelRecipesCategory = require("../../models/products/modelRecipeCategory");

const productCategory = {
  getData: async (req, res) => {
    try {
      const category = await modelRecipesCategory.getAll();
      res.status(200).json({ data: category.rows });
    } catch (error) {
      res.status(500).json({ server_error: error });
    }
  },
};

module.exports = productCategory;
