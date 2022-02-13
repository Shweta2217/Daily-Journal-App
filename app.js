//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const ejs = require("ejs");
const _ = require('lodash');
require('dotenv').config();


const homeStartingContent = "Hi, Welcome to Daily Journal blog posts. I think this blog posts may very useful or educational for you. ";

const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";

const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));


app.get('/', (req, res) => {
  const url = process.env.URL+"/allBlogs";
  const options = {
    method:"GET"
  }
  const request = https.request(url, options, (response)=>{
    if (response.statusCode == "200") {

      response.on("data", (data) => {
        
        let allPosts = JSON.parse(data).items;
        res.render('home', { homeContent: homeStartingContent, allPosts: allPosts });

      });
    } else {
      res.send("Error While Fetching Blogs")
    }  
  })
  request.end();
});

app.get('/contact', (req, res) => {
  res.render('contact', { contactContent: contactContent });
});

app.get('/about', (req, res) => {
  res.render('about', { aboutContent: aboutContent });
});

app.get('/compose', (req, res) => {
  res.render("compose")
});

app.post('/compose', (req, res) => {

  const url = process.env.URL+"/newBlog"

  let post = JSON.stringify({
    Title: req.body.postTitle,
    Content: req.body.postBody
  });

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  }
  const request = https.request(url, options, (response) => {
    if (response.statusCode == "200") {
      res.redirect('/');
    } else {
      res.send("Error Occured")
    }
    response.on("data", (data) => {
      console.log(JSON.parse(data));
    });
  })
  request.write(post);
  request.end();

});

app.get('/post/:postKey', (req, res) => {

  let Key = req.params.postKey;
   const url = process.env.URL+"/blog/"+Key;
   console.log(url);

   const options = {
     method:"GET"
   } 

   let request = https.request(url, options, (response)=>{
     
    if (response.statusCode == "200") {

      response.on("data", (data) => {
        let _Post = JSON.parse(data);
        console.log(_Post);
        res.render('post', { Title : _Post.Title, Content: _Post.Content });
      });

    } else res.send("Error While Fetching Blogs"); 
   }) 
   request.end();


});

const port = process.env.PORT || 5500
app.listen(port, function () {
  console.log("Server started on port "+port);
});
