const expess = require("express");
const app = expess();
const users = require("./routes/user.js");
const posts = require("./routes/posts.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
  secret: "secretcode",
  resave: false,
  saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());
app.use(cookieParser());


app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/register", (req, res) => {
  let {name="anonymous"} = req.query;
  req.session.name = name;
  if(name==="anonymous"){
    req.flash("error", "user not registered");
  }else{
    req.flash("success", "user successfully registered");
  }
  res.redirect("/hello");
});

app.get("/hello", (req, res) => {
  console.log(req.cookies);
  res.render("page.ejs", {name: req.session.name});
});

// app.get("/reqcounter", (req, res) => {
//   if (req.session.counter) {
//     req.session.counter += 1;
//   } else {
//     req.session.counter = 1;
//   }
//   res.send(`Request counter: ${req.session.counter}`);
// });

app.get("/test", (req, res) => {
  res.send("test successful");
});

// app.use(cookieParser("secretcode"));

// app.get("/getsignedcookies", (req, res) => {
//   res.cookie("fruit", "grape", {signed: true});
//   res.send("Signed cookies have been set");
// });

// app.get("/verify", (req, res) => {
//   console.dir(req.signedCookies);
//   res.send("Signed cookies verified");
// });

// app.get("/getcookies", (req, res) => {
//   res.cookie("greeting", "Hello");
//   res.send("Cookies have been set");
// });

// app.get("/", (req, res) => {
//   console.dir(req.cookies);
//   res.send("Hi i am root");
// });

// app.use("/users", users);
// app.use("/posts", posts);       

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});