const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();
const router = express.Router();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

router.get("/", (req, res) => {
  res.sendFile(__dirname + "/subscribe.html")
});

router.post("/", (req,res) =>{
  const email = req.body.email
  const firstName = req.body.firstName
  const lastName = req.body.lastName
  const classYear = req.body.classYear

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ],
    sync_tags: true,
    update_existing: true
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us10.api.mailchimp.com/3.0/lists/c1f29de044"

  const options = {
    method: "POST",
    auth: "duy24:87eade1fef632bd179f6f749e75e38b1-us10"
  }
  const request = https.request(url, options, (response) =>  {

    if(response.statusCode === 200){
      res.sendFile(__dirname + "/success.html")
    }else{
      res.sendFile(__dirname + "/failure.html")
    }

    response.on("data", (data) => {
      console.log(JSON.parse(data));
    })
  })
  
  request.write(jsonData);
  request.end();
  
});

router.post("/failure", (req,res) =>{
  res.redirect("/");
});

app.use("/",router);


const port = process.env.PORT || 3000;

app.listen(port,() => {
  console.log(`Server is running on port ${port}`);
});
