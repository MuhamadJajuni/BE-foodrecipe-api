const modelRecipesCategory = require("../../models/products/modelProductRecipes");
const removeFile = require("../../helper/removeFile");

const productRecipes = {

    // menampilkan semua resep
  getRecipes: async (req, res) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 2;
      const offset = (page - 1) * limit;
      const sortBY = req.query.sortBY || "id";
      const searchBY = req.query.searchBY || "title";
      const sort = req.query.sort || "";
      const searchParam = req.query.search ? req.query.search : "";
      const result = await modelRecipesCategory.selectAllRecipe(
        limit,
        offset,
        searchParam,
        sortBY,
        sort,
        searchBY
      );

      const dataRecipeCount = await modelRecipesCategory.coutData();

      const pagination = {
        totalPage: Math.ceil(dataRecipeCount.rows[0].count / limit),
        totalData: parseInt(dataRecipeCount.rows[0].count),
        pageNow: parseInt(page),
      };

      if (result.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Result not found", pagination });
      }

      res.status(200).json({
        message: "Get recipes sucessfully",
        data: result.rows,
        pagination,
      });
    } catch (error) {
      res.status(500).json({ message: "Get recipes pagination failed", error });
    }
  },

  // Mendapatkan data resep berdasarkan ID
  getMyRecipe: async (req, res) => {
    try {
      const { search, searchBy, limit, sort } = req.query;
      const { id } = req.payload;

      let page = req.query.page || 1;
      let limiter = limit || 5;

      data = {
        search: search || "",
        searchBy: searchBy || "title",
        offset: (page - 1) * limiter,
        limit: limit || 5,
        sort: sort || "ASC",
        id: parseInt(id),
      };
      let dataRecipe = await modelRecipesCategory.getMyRecipe(data);
      let dataRecipeCount = await modelRecipesCategory.myRecipeCount(data);

      const pagination = {
        totalPage: Math.ceil(dataRecipeCount.rows[0].count / limiter),
        totalData: parseInt(dataRecipeCount.rows[0].count),
        pageNow: parseInt(page),
      };

      if (dataRecipe.rows.length === 0) {
        return res
          .status(404)
          .json({ message: "Result not found", pagination });
      }

      res.status(200).json({
        message: "Get My recipes Berhasil",
        data: dataRecipe.rows,
        pagination,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Get recipes pagination failed", error });
    }
  },

  // Mendapatkan semua resep
  selectRecipes: async (req, res) => {
    try {
      const data = await modelRecipesCategory.allRecipe();
      res
        .status(200)
        .json({ message: "Get all recipe succesfully", data: data.rows });
    } catch (error) {
      res.status(500).json({ server_error: error });
    }
  },

  // Mendapatkan data resep berdasarkan ID
  getById: async (req, res) => {
    const id = req.params.id;
    try {
      const detail = await modelRecipesCategory.getDetail(id);
      if (detail && detail.rows.length > 0) {
        res.status(200).json({
          message: "Berhasil mendapatkan detail resep",
          data: detail.rows[0],
        });
      } else {
        res.status(404).json({ error: "Data not found" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Get recipes failed" });
    }
  },

  // Menambahkan data resep
  postRecipe: async (req, res) => {
    const { title, ingredients, videolink, category_id } = req.body;
    const users_id = req.payload.id;

    try {
      const imageUrl = req.file ? req.file.path : null;

      await modelRecipesCategory.createRecipe({
        title,
        ingredients,
        videolink,
        image: imageUrl,
        category_id,
        users_id,
      });

      return res.status(200).json({
        message: "Create recipe success",
        data: {
          title,
          ingredients,
          videolink,
          image: imageUrl,
          category_id,
          users_id,
        },
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to create Recipe" });
    }
  },
  // Menghapus data resep
  deleteRecipe: async (req, res) => {
    const { id } = req.params;
    try {
      const dataRecipe = await modelRecipesCategory.findById(id);

      if (dataRecipe.rows.length === 0) {
        return res.status(404).json({ message: "ID not found" });
      }

      if (req.payload.id != dataRecipe.rows[0].users_id) {
        return res.status(403).json({ message: "Recipe is not owned by you" });
      }

      if (dataRecipe.rows[0].image) {
        const file = dataRecipe.rows[0].image.slice(62);
        console.log(file);
        const deletedFile = file.slice(0, -4);
        console.log(deletedFile);
        removeFile(deletedFile);
      }

      await modelRecipesCategory.destroy(id);

      res.status(200).json({
        message: "Delete recipe successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Failed to delete Recipe" });
    }
  },

    // Mengubah data resep
updateRecipe: async (req, res) => {
  const { id } = req.params;
  const { title, ingredients, videolink, category_id } = req.body;
  let image;

  try {
    image = req.file ? req.file.path : null;
    console.log(req.file);

    if (!image) {
      return res.status(404).json({ message: "Image Path Undefined" });
    }

    const dataRecipe = await modelRecipesCategory.findById(id);
    if (dataRecipe.rows.length === 0) {
      return res.status(404).json({ message: "ID not found" });
    }

    if (req.payload.id != dataRecipe.rows[0].users_id) {
      return res.status(403).json({ message: "Recipe is not owned by you" });
    }

    if (dataRecipe.rows[0].image) {
      const file = dataRecipe.rows[0].image.slice(62);
      console.log(file);
      const deletedFile = file.slice(0, -4);
      console.log(deletedFile);
      removeFile(deletedFile);
    }

    await modelRecipesCategory.update({
      id,
      title,
      ingredients,
      videolink,
      image,
      category_id,
    });

    res.status(200).json({
      message: "Update recipe successfully",
      data: {
        title,
        ingredients,
        videolink,
        image,
        category_id,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Failed to update Recipe" });
  }
},
};

module.exports = productRecipes;
