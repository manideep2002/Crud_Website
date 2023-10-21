const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/user');

const app = express();

const port=process.env.PORT || 3000;
mongoose.connect("mongodb+srv://manideep:manideep@cluster0.skjcugx.mongodb.net/?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true }) 
  .then((result) =>{ console.log("Database-connected"); app.listen(port)})
  .catch(err => console.log(err)); //else errors will be shown


// register view engine
app.set('view engine', 'ejs');
 
// middleware & static files
app.use(express.static('public')); //this will helps to use style.css file
app.use(express.urlencoded({ extended: true })); //this will helps to get submitted data of form in req.body obj



// home routes
app.get('/', (req, res) => {
  res.redirect('/users');
});

//users i.e index route
app.get('/users',(req,res)=>{
  console.log("req made on"+req.url);
   User.find().sort({createdAt:-1})//it will find all data and show it in descending order
    .then(result => { 
      res.render('index', { users: result ,title: 'Home' }); //it will then render index page along with users
    })
    .catch(err => {
      console.log(err);
    });
})

//about route
app.get('/about',(req,res)=>{
  console.log("req made on"+req.url);
  res.render('about',{title:'About'});
})

//route for user create
app.get('/user/create',(req,res)=>{
  console.log("GET req made on"+req.url);
  res.render('adduser',{title:'Add-User'});
})

//route for users/withvar
app.get('/users/:id', (req, res) => {
  const id = req.params.id;
  User.findById(id)
    .then(result => {
      res.render('details', { user: result, action:'edit',title: 'User Details' });
    })
    .catch(err => {
      console.log(err);
    });
});

//route for edit/name/action variable that will display current value to input field
app.get('/edit/:name/:action',(req,res)=>{
  const name = req.params.name;
  console.log("req made on"+req.url);
  User.findOne({name:name})
    .then(result => {
      res.render('edit', { user: result ,title: 'Edit-User' });
    })
    .catch(err => {
      console.log(err);
    });
})

app.post('/user/create',(req,res)=>{
  console.log("POST req made on"+req.url);
  console.log("Form submitted to server");
  const user = new User(req.body); 
  user.save() 
    .then(result => {
      res.redirect('/users');//is success save this will redirect to home page
    })
    .catch(err => { 
      console.log(err);
    });

})

//route for updating users data
app.post('/edit/:id',(req,res)=>{
  console.log("POST req made on"+req.url);
  User.updateOne({_id:req.params.id},req.body) //then updating that user whose id is get from url 
                                               //first passing id which user is to be updated than passing update info
    .then(result => {
      res.redirect('/users');
      console.log("Users profile Updated");
    })
    .catch(err => { 
      console.log(err);
    });

})


app.post('/users/:name',(req,res)=>{ //form action of details.ejs pass name of user that later is assume as name
  const name = req.params.name;
  console.log(name);
  User.deleteOne({name:name})
  .then(result => {
    res.redirect('/users');
  })
  .catch(err => {
    console.log(err);
  });
})


app.use((req,res)=>{
  console.log("req made on"+req.url);
  res.render('404',{title:'NotFound'});
})






