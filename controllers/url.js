const shortid = require("shortid");
const URL = require("../models/url");



async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "url is required" });

  const shortID = shortid();
  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
  });

  // Instead of res.json, we now render the home page and pass the new ID back
  return res.render("home", {
    id: shortID,
  });
}

// ... analytics function remains the same ...



// This syntax is used to fetch visit history and click counts
async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  const result = await URL.findOne({ shortId });
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};


/**
 * Job 1: Creating a Link (handleGenerateNewShortURL)
When you send a long URL to the server, this function kicks in.

The Check: The manager looks at the "order form" (req.body). If there is no URL written on it, he throws it away and sends an error message.

The Generation: He uses a tool called shortid to stamp a random "Nickname" (like abc-123) on the order.

The Filing (Database): He opens a new folder in the cabinet (MongoDB) and puts in:

The Nickname (shortId).

The Original Address (redirectURL).

An Empty Notebook (visitHistory: []) because nobody has visited yet.

The Reply: He tells you, "Your short ID is abc-123!"

Job 2: Checking the Stats (handleGetAnalytics)
When you want to know how many people clicked your link, this function runs.

The Request: You tell the manager, "I want the stats for nickname abc-123."

The Search: He goes to the filing cabinet and pulls out the folder for abc-123.

The Counting: He looks at that Notebook (the visitHistory list) we made earlier. He counts how many pages (timestamps) are in it.

The Report: He sends you a message saying: "You have 5 clicks (total length of the list) and here are the exact times they happened."
 */

/**
 * "The Controller is the Brain.

When you Shorten, the Brain says: 'Make a random ID, save the original link, and start a blank list for tracking.'

When you Check Stats, the Brain says: 'Find the link, count how many items are in the tracking list, and tell the user the total.'"
 */