//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
const { name } = require("ejs");

const homeStartingContent = "Its your own World ❤️ out Here! Play with your thoughts, share them, recreate Old Memories, plan Out and just engross yourself with your imaginations and creative feelings into it....So what are You waiting for, Just start off with your first Post!";
const aboutContent = "Ever wondered how it feels to you if you could keep a note of your all day to day activities, important events and tasks, scribble down your thoughts, expressions and feelings, your own small clicks from your mind, secrets, your own creations, plan for your future and also about our favourite and everlasting memories in just ONE SINGLE CLICK! Yes you can very easily. This is a Virtual Personal Journal or a Daily Dairy and it is the perfect place in which you can do everything as that stuff.Very handy in nature, you can access it by just a click on your Device with no extra need of paper,pen and pencil and carry eveywhere too. So what are you waiting for... THINK, PLAN, START & ENJOY!!";
const contactContent = "Hey!! I'm Ayantik, a very Passionate Developer and an Enthusiastic Coder.";

let userName="";
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://ayantik-admin:Ayantik789@clusterblog.zz9i9.mongodb.net/blog2",{ useNewUrlParser:true });
const userSchema =
{
  name:
  { type: String,
    required:true,
    unique:true

}};
const postSchema = {
  title: String,
  content: String,
  date: {
    type: Date,
    default: Date.now
}
};

const Post = mongoose.model("Post",postSchema);
const User = mongoose.model("User",userSchema);

app.get("/", function(req, res){
  res.render("cover");
});

app.post("/",async(req,res)=>
{
  try{
    const name=req.body.userTitle;
    let user=await User.findOne({name:name});
   
    userName=name;
   
    if(user)
    {
      
      res.redirect("/home");
    }
    else{
     await User.create({
        name:name
      })
      
      res.redirect("/home");
    }
    

  }
  catch(err)
  {
    console.log(err);
  }

  

});

app.get("/home", function(req, res){
 
  Post.find({},function(err, posts){
    res.render('home',{
      startingContent: homeStartingContent,
      userName: userName,
      posts: posts});
  });
});


app.get("/compose", function(req, res){
  res.render('compose');
});

app.post("/compose", function(req, res){
  // if (req.body.postTitle == "Home"){
  //   homeStartingContent = req.body.postBody;
  //   res.redirect("/");
  // }else if(req.body.postTitle == "About") {
  //   aboutContent = req.body.postBody;
  //   res.redirect("/");
  // }else if(req.body.postTitle == "Contact"){
  //   contactContent = req.body.postBody;
  //   res.redirect("/");
  // }else{
    // const post = {
      //   title: req.body.postTitle,
      //   content: req.body.postBody
      // };
      // posts.push(post);
      const post = new Post({
        title: req.body.postTitle,
        content: req.body.postBody
      });
      
      post.save(function (err) {
        if (!err) {
          res.redirect("/home");
        }
      });
    }
  );
  
  app.get("/posts/:postId", function(req, res){
    const requestedPostId = req.params.postId;
    
    Post.findOne({_id: requestedPostId},function (err,post) { 
    res.render('post',{
      title: post.title,
      content: post.content,
      date: post.date
    });
  });
});
  
app.post("/delete",function(req,res)
{
const Id=req.body.erase;
console.log(Id);

  Post.findByIdAndRemove(Id,function(err)
{
  if(!err)
  {
    console.log("Successfully deleted");
    res.redirect("/home");
  }
});
});
app.get("/update/:postId", function(req, res){
  const updateId = req.params.postId;
  
  Post.findOne({_id: updateId},function (err,post) {
  
  res.render('update',{
    key: post._id,
    title: post.title,
    body: post.content
  });
 
  });
});
app.post("/update/:postId",function(req, res){
  const editId = req.params.postId;

  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  
  Post.findByIdAndUpdate({_id: editId},{title:post.title, content:post.content} ,function(err, result){
  
  if(!err)
  {
    console.log("Successfully updated");
    res.redirect("/home");
  }
  
});
});
  // posts.forEach(function(post){
  //   const storedTitle = _.lowerCase(post.title);

  //   if (storedTitle == requestedTitle){
  //     res.render('post',{
  //       title: post.title,
  //       content: post.content
  //     });
  //   }
  // });

app.get("/about", function(req, res){
  res.render('about',{aboutContent: aboutContent});
});
  
app.get("/contact", function(req, res){
  res.render('contact',{contactContent: contactContent});
});
app.get("/exit", function(req, res){
  res.render('exit');
  });

let port = process.env.PORT;
if(port == null || port == ""){
  port = 3000;
}

app.listen(port, function() {
  console.log("Server is running on " + port);
});
