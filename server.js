const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const app = express();
//!middlewares
//JSON
app.use(express.json());
//images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
//cookie-parser
app.use(cookieParser());
//CORS
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      try {
        const host = new URL(origin).hostname;
        if (host.endsWith("netlify.app")) return callback(null, true);
      } catch (e) {}

      return callback(new Error("Not allowed by CORS: " + origin));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
//connect to DB
const connectDB = require("./config/connectDB");
const seedRoles = require("./config/seed/seedRoles");
const seedAdmin = require("./config/seed/seedAdmin");
connectDB().then(async () => {
  //seed roles
  try {
    await seedRoles();
    await seedAdmin();
  } catch (error) {
    console.error("❌ Error during seeding roles:", error.message);
  }
});

//Routes
//Route test
// app.get("/", (req, res) => {
//   res.end("Hello World!");
// });
//route qui va prendre en charge toutes les routes d'authentification
app.use("/api/auth", require("./routes/auth.route"));
//users
app.use("/api/user", require("./routes/user.route"))
//role
app.use("/api/role", require("./routes/role.route"))

app.use((req, res) => {
  res.json("api is running!!!");
});

//Server Listening
const PORT = process.env.PORT || 1800;
app.listen(PORT, (err) => {
  err
    ? console.error(`❌ Server not running`, err.message)
    : console.log(`✅ Server running on http://localhost:${PORT}`);
});
