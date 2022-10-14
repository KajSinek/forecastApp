require("dotenv").config(); // Secures variables
const app = require("./utils/app"); // Backend App (server)
const mongo = require("./utils/mongo"); // MongoDB (database)
const { PORT } = require("./constants");
const authRoutes = require("./routes/auth");
global.bodyParser = require("body-parser");

async function bootstrap() {
  await mongo.connect();

  app.get("/", (req, res) => res.status(200).json({ message: "Hello World!" }));
  app.get("/healthz", (req, res) => res.status(200).send());
  app.use("/auth", authRoutes);

  app.use(
    bodyParser.urlencoded({
      extended: true,
      limit: "50mb",
      parameterLimit: 100000,
    })
  );
  app.use(
    bodyParser.json({
      limit: "50mb",
      parameterLimit: 100000,
    })
  );
  app.post("/record", function (req, res) {
    console.log(req.body);
    /*res.send("Hello");*/
    /*db.collection("quotes").insertOne(req.body, (err, data) => {
      if (err) return console.log(err);
      res.send("saved to db: " + data);
    });*/
  });

  app.listen(PORT, () => {
    console.log(`✅ Server is listening on port: ${PORT}`);
  });
}

bootstrap();
