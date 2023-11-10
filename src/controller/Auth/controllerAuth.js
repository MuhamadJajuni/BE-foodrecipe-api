const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const secretKey = process.env.API_KEY_PRIVATE || "your-secret-key";
const modelUsers = require("../../models/Auth/modelUsers");

const controllerAuth = {
  // Auth register
  register: async (req, res) => {
    const { name, email, password } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({ message: "Silahkan isi semua form" });
    }

    try {
      const user = await modelUsers.findByEmail(email);
      if (user.rows[0]) {
        return res.status(409).json({
          status: 409,
          message: "Email already registered, please login",
        });
      }

      const hashPassword = await bcrypt.hash(password, 10);

      await modelUsers.create({
        email,
        password: hashPassword,
        name,
      });
      res.status(201).json({
        message: "Register Successfully",
        data: { name, email },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to register user" });
    }
  },

  // Auth login
  login: async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        status: 400,
        message: "Email dan password harus diisi dengan benar",
      });
    }

    try {
      const user = await modelUsers.findByEmail(email);
      const dataUser = user.rows[0];
      if (!user.rows[0]) {
        return res.status(404).json({
          status: 404,
          message: "Email is not registered, please register first",
        });
      }
      const verifyPassword = await bcrypt.compare(password, user.rows[0].password);

      if (!verifyPassword) {
        return res.status(401).json({
          status: 401,
          message: "The password you entered is incorrect",
        });
      }

      const token = jwt.sign(
        {
          id: user.rows[0].id,
          email: user.rows[0].email,
          name: user.rows[0].name,
          photo: user.rows[0].photo,
        },
        secretKey,
        { expiresIn: "365d" }
      );
      return res
        .status(200)
        .json({ status: 200, message: "Login Successfully", token, dataUser });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: 500, message: "Failed to login user" });
    }
  },
};

module.exports = controllerAuth;
