import bodyParser from "body-parser";
import express from "express";
import pg from "pg";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy } from "passport-local";
import env from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";


const port = 3000;
const app = express();
const saltrounds = 10;
env.config();

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const db = new pg.Client({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});
db.connect();

app.use(session({
    secret: "TOPSECRET",
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 1000*60*60
    }
}))

app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(passport.session());

app.get("/", async(req, res)=>{
    if(req.isAuthenticated()){
        res.redirect("dashboard");
    }
    else{
        res.render("index");
    }
    
})

app.get("/login", (req, res)=>{
    app.redirect("/");
})

app.post("/login", passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login"
}))

app.post("/signup", async(req, res)=>{
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    var result = await db.query("select * from users where email = $1", [email]);
    if(result.rows.length>0){
        res.send("Email already registered. Try logging in.");
    }
    else{
        result = await db.query("Select * from users where username = $1", [username]);
        if(result.rows.length>0){
        res.send("Username already registered. Use different username.");
        }
        bcrypt.hash(password, saltrounds, async(err, hash)=>{
            if(err){
                console.log("error hashing password");
            }
            else{
                result = await db.query("insert into users (email, username, password) values($1, $2, $3) returning *;", [email, username, hash]);
                const user = result.rows[0];
                req.login(user, (err)=>{
                    console.log(err);
                    res.redirect("/dashboard");
                });

            }
        })
    }
})

app.get("/auth/google", passport.authenticate("google", {
    scope: ["profile", "email"]
}))

app.get("/auth/google/dashboard", passport.authenticate("google", {
  successRedirect: "/dashbaord",
  failureRedirect: "/login"
}))

app.get("/dashboard", async(req, res)=>{
    if(req.isAuthenticated()){
        res.render("dashboard");
    }
    else{
        res.redirect("/login");
    }
})

app.post("/dashboard", async(req, res)=>{
    
})

app.patch("/dashboard", async(req, res)=>{

})

app.delete("/dashboard", async(req, res)=>{

})

passport.use("local", new Strategy(async function verify(username, password, cb){
    console.log(username);
    try{
        const result = await db.query("Select * from users where username = $1 OR email = $1", [username]);
        if(result.rows.length>0){
            const user = result.rows[0];
            const storedHashedPassword = user.password;
            if(await bcrypt.compare(password, storedHashedPassword)){
                return cb(null, user);
            }
            else{
                return cb(null, false);
            }
        }
    }
    catch(error){
        console.log(error);
    }
}))

passport.use("google", new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/dashboard",
},
async (accessToken, refreshToken, profile, cb)=>{
    try{
        const result = await db.query("Select * from users where email = $1", [profile.emails[0].value]);
        if(result.rows.length === 0){
            const newUser = await db.query("insert into users (email, password) values ($1, $2)", [profile.emails[0].value, "google"]);
            cb(null, newUser.rows[0]);
        }else{
            return cb(null, result.rows[0]);
        }
    }
    catch(err){
        console.log(err);
    }
}
))

passport.serializeUser((user, cb)=>{
    cb(null, user.id);
})

passport.deserializeUser(async (id, cb)=>{
    try{
        const result = await db.query("select * from users where id = $1", [id]);
        cb(null, result.rows[0]);
    }
    catch(err){
        cb(err);
    }
})

app.listen(port, ()=>{
    console.log(`Server running at port ${port}`);
})