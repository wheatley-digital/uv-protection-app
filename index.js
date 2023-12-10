import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import ejs from "ejs";

// Call Express Fraemwork via the Express Function
const app = express();

// Mount BodyParser Middleware
app.use(bodyParser.urlencoded({extended: true}));

// Serve Static Files
app.use(express.static('public'));

// Declare Variables
const port = 3000;
const API_Key = "openuv-dg5jq9rlpz9zkx8-io";

// Get Home Page
app.get("/", (req, res) => {
    res.render("index.ejs", {content: "Enter data..."});
})

// Get Response to Location
app.post("/advice", async (req, res) => {
    console.log(req.body);

    var myHeaders = new Headers();
    myHeaders.append("x-access-token", "openuv-dg5jq9rlpz9zkx8-io");
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
};

    try {
        let result = await fetch(`https://api.openuv.io/api/v1/uv?lat=${req.body.latitude}&lng=${req.body.longitude}&alt=${req.body.altitude}&dt=`, requestOptions);
        result = await result.text();
        result = JSON.parse(result);
        result = result.result;
        let UV_Index = result.uv;
        console.log(UV_Index);
        let message = "";
        if (UV_Index <= 2) {
            message = `UV Index is less than 2, no need to use suncream today.`;
        } else if (UV_Index > 2 && UV_Index <= 6) {
            message = `UV Index is between 3 and 6, so you should start thinking about finding shade, covering up with clothing and using suncream with at least SPF30 and 4 or 5 stars`;
        } else if (UV_Index > 6 && UV_Index <= 8) {
            message = `UV Index is between 6 and 8. You are advised to find shade, cover up with clothing and use suncream with at least SPF30 and 4 or 5 stars`;
        } else if (UV_Index > 8) {
            message = `Warning! UV Index is greater than 8. You are strongly advised to find shade, cover up with clothing and use suncream with at least SPF30 and 4 or 5 stars`;
        }
        res.render("index.ejs", {content: message});
    }
    catch (error) {
        console.error(error);
        res.render("index.ejs", {content: "Error retrieving data..."})
    }
})

// Listen on Port
app.listen(port, function(err){
    if (err) console.log(err);
    console.log("Server listening on Port", port);
 });
