const express = require("express");
const mongoose = require("./Database/db");
const userRoutes = require("./routes/userRoutes");

const collegeRoutes = require("./routes/collegeRoutes");

const app = express();
const port = 3000;

app.use(express.json());

app.use("/api/users", userRoutes);

app.use("/api/colleges", collegeRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
