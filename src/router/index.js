const express = require("express");

const controllerUsers = require("../controller/Auth/controllerUsers");
const productCategory = require("../controller/product/productCategory");
const productRecipes = require("../controller/product/productRecipes");
const controllerAuth = require("../controller/Auth/controllerAuth");
const { AuthJWT } = require("../helper/AuthJWT");
const uploadFile = require("../middleware/uploadFile");
const productComment = require("../controller/product/productComment");
const { getAll, postUser, updateUser, deleteUser, getDetail } = controllerUsers;
const { getData } = productCategory;
const {
  getRecipes,
  postRecipe,
  selectRecipes,
  getById,
  deleteRecipe,
  updateRecipe,
  getMyRecipe,
} = productRecipes;

const { login, register } = controllerAuth;
const { getDataById, postData } = productComment;
const router = express.Router();

//AUTH
router.post("/register", register);
router.post("/login", login);

// CRUD USER

router.put("/update/:id", uploadFile("photo"), AuthJWT, updateUser);
router.delete("/delete/:id", deleteUser);
router.get("/detail/:id", AuthJWT, getDetail);
router.get("/allData", getAll);
router.post("/postUsers", postUser);

// GET CATEGORY

router.get("/category", getData);

//CRUD RECIPES
router.put("/updateRecipe/:id", AuthJWT, uploadFile("image"), updateRecipe);
router.get("/recipe/:id", AuthJWT, getById);
router.post("/postRecipe", uploadFile("image"), AuthJWT, postRecipe);
router.get("/recipes", AuthJWT, getRecipes);
router.get("/allRecipe", AuthJWT, selectRecipes);
router.delete("/deleteRecipe/:id", AuthJWT, deleteRecipe);

router.get("/myRecipe", AuthJWT, getMyRecipe);

//CRUD COMENTS

router.get("/coment/:id", getDataById);
router.post("/postComent", postData);

module.exports = router;
