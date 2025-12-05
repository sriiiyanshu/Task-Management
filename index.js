import bodyParser from "body-parser";
import express from "express";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.listen(port, ()=>{
    console.log(`Server running at http://localhost/${port}`);
})



