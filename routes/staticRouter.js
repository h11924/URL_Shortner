const express = require("express");
const URL = require("../models/url");
const router = express.Router();

// This syntax is used to render the home page and pass all URLs from the DB to it
router.get("/", async (req, res) => {
  const allUrls = await URL.find({});
  return res.render("home", {
    urls: allUrls,
  });
});

module.exports = router;