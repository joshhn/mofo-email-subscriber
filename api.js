const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
require("dotenv").config();

const app = express();
const router = express.Router();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

router.get("/", (req, res) => {
  res.sendFile(__dirname + "/subscribe.html")
});

router.post("/", (req,res) =>{
  var email = req.body.email
  var firstName = req.body.firstName
  var lastName = req.body.lastName
  // const classYear = req.body.classYear
  // const isMofo = req.body.mofo
  // const isStaff = req.body.staff 

  email = email.trim();
  firstName = firstName.trim().toLowerCase();
  firstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
  lastName = lastName.trim().toLowerCase();
  lastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);

  if(!email.endsWith("@depauw.edu")){
    res.sendFile(__dirname + "/failure.html");
  }else{
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
  
    const url = process.env.URL
    console.log(process.env.API_KEY + " " + process.env.URL)
  
    const options = {
      method: "POST",
      auth: `duy24:${process.env.API_KEY}` 
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
  }  
});

router.post("/failure", (req,res) =>{
  res.redirect("/");
});

app.use("/",router);


const port = process.env.PORT || 3000;

app.listen(port,() => {
  console.log(`Server is running on port ${port}`);
});
