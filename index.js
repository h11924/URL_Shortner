const express = require("express");
const path = require("path");
const { connectToMongoDB } = require("./connect");

const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter"); // New route for UI
const URL = require("./models/url");

const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url").then(() =>
  console.log("Mongodb connected")
);

// This syntax is used to tell Express we are using EJS as our view engine
app.set("view engine", "ejs");
// This syntax tells Express where our EJS files (views) are located
app.set("views", path.resolve("./views"));

app.use(express.json());
// This syntax (Middleware) is used to parse data from HTML forms
app.use(express.urlencoded({ extended: false }));

app.use("/url", urlRoute);
app.use("/", staticRoute); // Using the static router for the home page

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: { timestamp: Date.now() },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => console.log(`Server Started at PORT:${PORT}`));

/**
 * The "Plain English" Summary of index.js
"Hey, bring in the tools": First, we grabbed the Express "manager," the MongoDB "connector," our "signposts" (routes), and the "blueprint" (model) for our data.

"Connect to the database": We told the server to open a connection to our local MongoDB so we can actually store and retrieve things.

"Use a translator": We added a line (express.json) to make sure that if a user sends us a long URL in a JSON format, the server understands it.

"Watch the /url path": We told the server, "If anyone visits any link starting with /url, let the specialist urlRoute file handle the logic."

"The Big Redirection Step": When someone visits a short link like localhost:8001/xyz123, the server follows your exact logic:

Find it: "Find the record for xyz123."

Don't delete: "Don't overwrite anything."

Push: "Just push the current time into the visitHistory list so I can track the click."

Give me the data: "When you're done, give me that record back."

Redirect: "Now that I have the data, I see the original URL is google.com, so teleport the user there!"

"Open the doors": Finally, we told the server to sit at Port 8001 and wait for people to start visiting.
 */


/**
 * const express = require("express");
const path = require("path");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRouter");
const URL = require("./models/url");
express: Imports the framework that handles requests and responses.

path: A built-in Node.js tool used to handle folder paths correctly across different computers.

connectToMongoDB: Imports the function you wrote to link your code to the database.

urlRoute & staticRoute: These import your "receptionists" (routers) that decide where a user goes when they visit /url or the home page.

URL: Imports the database model so we can find and update links.
 */

/**
 * const app = express();
const PORT = 8001;

connectToMongoDB("mongodb://localhost:27017/short-url").then(() => 
  console.log("Mongodb connected")
);
app: Creates your server instance.

PORT: Defines the "address" (8001) where the server will listen.

connectToMongoDB: Connects to your MongoDB database named short-url. Once successful, it prints a confirmation message.
 */

/**
 * app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
view engine: Tells Express, "Hey, we are using EJS to build our web pages".

views: Tells the server that all your EJS files are stored in the folder named ./views.
 */

/**
 * app.use(express.json());
app.use(express.urlencoded({ extended: false }));
express.json(): A translator that allows the server to read data sent in JSON format (like from Postman).

express.urlencoded: A translator that allows the server to read data sent from HTML forms (like when you click "Generate" on your webpage).
 */

/**
 * app.use("/url", urlRoute);
app.use("/", staticRoute);
/url: Any request starting with /url is handed over to the urlRoute (handles generating links and analytics).

/: Any request to the main home page is handed to the staticRoute (renders the HTML page).
 */

/**
 * app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId }, 
    { $push: { visitHistory: { timestamp: Date.now() } } }
  );
  res.redirect(entry.redirectURL);
});
/:shortId: This is a variable route. If you type localhost:8001/abc, shortId becomes abc.

findOneAndUpdate: It finds the link in MongoDB and pushes a new timestamp into the visitHistory array (this is how we track clicks!).

res.redirect: Once the click is recorded, it sends the user to the original long URL.
 */

/**
 * In index.js, we start the server, connect the database, and set up EJS so we can have a visual website. We then tell the server how to read form data and set up the 'Teleportation' logic that records clicks before redirecting the user to their destination."
 */