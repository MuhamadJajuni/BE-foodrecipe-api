const jwt = require("jsonwebtoken");
require("dotenv").config();

const AuthJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        status: 401,
        message: "Login gagal, server memerlukan token",
      });
    }

    const decoded = await jwt.verify(token, process.env.API_KEY_PRIVATE);
    console.log(decoded);

    // Jika diperlukan, tambahkan pengecekan untuk data tambahan di sini
    // Contoh: if (!decoded.userId) throw new Error('Invalid token');

    req.payload = decoded;
    next();
  } catch (error) {
    console.error("Error:", error);

    // Periksa jenis kesalahan untuk menentukan respons yang sesuai
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: 401,
        message: "Invalid token. Harap login kembali.",
      });
    } else if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: 401,
        message: "Token telah kadaluarsa. Harap login kembali.",
      });
    } else {
      return res.status(500).json({
        status: 500,
        message: "Internal Server Error",
      });
    }
  }
};

module.exports = { AuthJWT };
