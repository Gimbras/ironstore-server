const express = require('express')
const router = express.Router()

//we installed bcrypt.js
const bcrypt = require('bcryptjs');

const UserModel = require('../models/User.model');

router.post('/signup', (req, res) => {
    const {name, email, password } = req.body;
    console.log(name, email, password);
 
    // -----SERVER SIDE VALIDATION ----------
   /*
    if (!name || !email || !password) {
        res.status(500)
          .json({
            errorMessage: 'Please enter username, email and password'
          });
        return;  
    }
    const myRegex = new RegExp(/^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/);
    if (!myRegex.test(email)) {
        res.status(500).json({
          errorMessage: 'Email format not correct'
        });
        return;  
    }
    const myPassRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/);
    if (!myPassRegex.test(password)) {
      res.status(500).json({
        errorMessage: 'Password needs to have 8 characters, a number and an Uppercase alphabet'
      });
      return;  
    }
 */
    // NOTE: We have used the Sync methods here. 
    // creating a salt 
    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    UserModel.create({name: name, email, password: hash})
      .then((user) => {
        // ensuring that we don't share the hash as well with the user
        user.password = "***";
        res.status(200).json(user);
      })
      .catch((err) => {
        if (err.code === 11000) {
          res.status(500).json({
            errorMessage: 'username or email entered already exists!',
            message: err,
          });
        } 
        else {
          res.status(500).json({
            errorMessage: 'Something went wrong! Go to sleep!',
            message: err,
          });
        }
      })
});
 
// will handle all POST requests to http:localhost:5005/api/signin
router.post('/signin', (req, res) => {
    const {email, password } = req.body;

    // -----SERVER SIDE VALIDATION ----------
    
    if ( !email || !password) {
        res.status(500).json({
            error: 'Please enter Username. email and password',
       })
      return;  
    }
    // const myRegex = new RegExp(/^[a-z0-9](?!.*?[^\na-z0-9]{2})[^\s@]+@[^\s@]+\.[^\s@]+[a-z0-9]$/);
    // if (!myRegex.test(email)) {
    //     res.status(500).json({
    //         error: 'Email format not correct',
    //     })
    //     return;  
    // }

    // Find if the user exists in the database 
    UserModel.findOne({email})
      .then((userData) => {
           //check if passwords match
          let doesItMatch = bcrypt.compareSync(password, userData.password)
          //if it matches
          if (doesItMatch) {
            // req.session is the special object that is available to you
            userData.password = "***";
            req.session.loggedInUser = userData;
            res.status(200).json(userData)
          }
          //if passwords do not match
          else {
              res.status(500).json({
                  error: 'Passwords don\'t match',
              })
            return; 
          }
      })
      //throw an error if the user does not exists 
      .catch((err) => {
        res.status(500).json({
            error: 'Email does not exist',
            message: err
        })
        return;  
      });
  
});
 
// will handle all POST requests to http:localhost:5005/api/logout
router.post('/logout', (req, res) => {
    req.session.destroy();
    // Nothing to send back to the user
    res.status(204).json({});
})


// middleware to check if user is loggedIn
const isLoggedIn = (req, res, next) => {  
  if (req.session.loggedInUser) {
      //calls whatever is to be executed after the isLoggedIn function is over
      next()
  }
  else {
      res.status(401).json({
          message: 'Unauthorized user',
          code: 401,
      })
  };
};

//Update/EDIT profile  --> if shiut goes wrong its here!! 

router.patch("/editprofile", isLoggedIn, (req, res) => {

  const id = req.session.loggedInUser._id;

  console.log("is this id working", req.session.loggedInUser)
  const {name, country, age, image } = req.body;
  
  UserModel.findByIdAndUpdate(id, {$set: {name: name, country: country, age:  age, image: image }},{new: true} ) // 3rd parameter to return updated info (new: true)
        .then((response) => { 
           console.log(response)
             res.status(200).json(response)
        })
        .catch((err) => {
             res.status(500).json({
                  error: `Something went wrong`,
                  message: err
             })
        })
})




// THIS IS A PROTECTED ROUTE
// will handle all get requests to http:localhost:5005/api/user
router.get("/user", isLoggedIn, (req, res, next) => {
  UserModel.findById(req.session.loggedInUser._id)
  .then((user)=>{
    res.status(200).json(user)
  })
  .catch((err)=>{
    res.status(500).json({
      error: `Something went wrong`,
      message: err
    
  })
  })
});

module.exports = router;