const express = require('express');
const app = express();
const path = require('path');
const userRoute = require('./routes/user');
const blogRoute = require('./routes/blog');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { checkforAuthcookie } = require('./middleware/auth');
const Blog =  require('./models/blog')

//Port to be added later
const PORT = 8000;
mongoose.connect('mongodb://localhost:27017/bloggy')
.then(() => console.log('Connected to MongoDB...'))
.catch((err) => console.log("Database connection failed", err));


app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));
app.use(express.static(path.join(__dirname,'/assets')));
app.use(express.static(path.resolve('./public')));
app.use(express.static(path.resolve('./public/images')));
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(checkforAuthcookie("token"));

app.get("/",async (req,res)=>{
    const allBlogs = await Blog.find({});
    res.render("Home",{
        user: req.user,
        blogs: allBlogs,
    });
})

app.use("/blog", blogRoute);
app.use("/user", userRoute);
app.listen(PORT,() => {console.log(`Server Started at: ${PORT}`)});