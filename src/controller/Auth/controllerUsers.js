const modelUsers = require("../../models/Auth/modelUsers");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const controllerUsers = {
  // Mendapatkan semua data user
  getAll: async (req, res) => {
    try {
      const users = await modelUsers.allUsers();
      res.status(200).json({ data: users.rows });
    } catch (error) {
      res.status(500).json({ server_error: error });
    }
  },

  // Mendapatkan data user berdasarkan ID
  getDetail: async (req, res) => {
    const id = req.params.id;

    try {
      const detail = await modelUsers.findById(id);
      res
        .status(200)
        .json({ message: "Get Detail Successfully", data: detail.rows });
    } catch (error) {
      res.status(500).json({ server_error: error });
    }
  },

  // Menambahkan data user
  postUser: async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashPassword = await bcrypt.hash(password, 10); // Salt rounds: 10
        await modelUsers.create({
            name,
            email,
            password: hashPassword,
        });
        res.status(201).json({
            message: "User Created Successfully",
            data: { name, email, password: hashPassword },
        });
    } catch (error) {
        console.log(error); // Tambahkan ini untuk logging error
        res.status(500).json({ error: "Failed to create user" });
    }
},


  // Mengubah data user
  updateUser: async (req, res) => {
    const { name } = req.body;
    const id = req.params.id;

    // Periksa apakah ada file yang diunggah
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const photo = req.file.path;

    try {
      await modelUsers.updateUsers({ id, name, photo });
      res.status(200).json({
        message: "Update data Successfully",
        data: { name, photo },
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to update user" });
    }
  },

  // Menghapus data user
  deleteUser: async (req, res) => {
    const { id } = req.params;
    try {
      await modelUsers.destroy(id);
      res.status(200).json({
        message: "Delete data Successfully",
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete user" });
    }
  },
};

module.exports = controllerUsers;
