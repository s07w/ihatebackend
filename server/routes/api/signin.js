const User = require("../../models/User");
const UserSession = require("../../models/UserSession");

module.exports = (app) => {
  
    app.post('/api/account/signup', (req, res, next) => {
        const { body } = req;
        const {
            username,
            password
        } = body;
        let {
            email 
        } = body;

        if(!username) {
            return res.send({
                success: false,
                message: "error: Username cannot be blank"
            });
        }
        if(!email) {
          return res.send({
                success: false,
                message: "error: Email cannot be blank"
            });
        }
        if(!password) {
            return res.send({
                success: false,
                message: "error: Password cannot be blank"
            });
        }

        console.log("HERE")

        email = email.toLowerCase();

        // Steps: 
        // 1. Verify email doesn't exist
        // 2. Save 

        User.find({
            email: email
        }, (err, previousUsers) => {
            if (err) {
                return res.send({
                    success: false,
                    message: "Error: server error"
                });
            } else if  (previousUsers.length > 0) {
               return res.send({
                    success: false,
                    message: "Error: account already exists"
                });
            }

            // Save new user
            const newUser = new User();

            newUser.email = email;
            newUser.username = username;
            newUser.password = newUser.generateHash(password);
            newUser.save((err, user) => {
                if (err) {
                   return res.send({
                        success: false,
                        message: "Error: server error"
                    });
                }

               return res.send({
                    success: true,
                    message: "Signed up"
                });
            });
        });
    });

    app.post('/api/account/signin', (req, res, next) => {
        const { body } = req;
        const {
            password
        } = body;
        let {
            email 
        } = body;

        if(!email) {
            return res.send({
                  success: false,
                  message: "error: Email cannot be blank"
              });
          }
          if(!password) {
              return res.send({
                  success: false,
                  message: "error: Password cannot be blank"
              });
          }


        email = email.toLowerCase();

        User.find({
            email: email
        }, (err, users) => {
            if (err) {
                console.log("err 2:", err)
                return res.send({
                    success: false,
                    message: "Error: server error"
                });
            }

            if (users.length !== 1) {
                return res.send({
                    success: false,
                    message: "Error: Invalid1"
                });
            }

            const user = users[0];
            if (!user.validPassword(password)) {
                return res.send({
                    success: false,
                    message: "Error: invalid2"
                });
            }

            // Otherwise, correct user

            const userSession = new UserSession(); 
            userSession.userId = user._id;
            userSession.save((err, doc) => {
                if (err) {
                    console.log(err);
                    return res.send({
                        success: false,
                        message: "Error: server error"
                    });
                }

                return res.send({
                    success: true,
                    message: "Valid sign in",
                    //doc._id points to the unique user id made in db
                    token: doc._id
                });
            });
        });
    });

    app.get('/api/account/verify', (req, res, next) => {
        //Get the token

        const { query } = req;
        const { token } = query;

        // ?token=test
        //Verify that the token is unique and not deleted

        UserSession.find({
            _id: token,
            isDeleted: false
        }, (err, sessions) => {
            if (err) {
                console.log(err);
                return res.send({
                    success: false,
                    message: "Error: server error"
                });
            }

            if (sessions.length !== 1) {
                return res.send({
                    success: false,
                    message: "Error: invalid 3"
                });
            } else {
                return res.send ({
                    success: true,
                    message: "Worked"
                });
            }
        });
    });

    app.get('/api/account/logout', (req, res, next) => {
         //Get the token

         const { query } = req;
         const { token } = query;
 
         // ?token=test
         //Verify that the token is unique and not deleted
 
         UserSession.findOneAndUpdate({
             _id: token,
             isDeleted: false
         }, {
            $set:{
                isDeleted: true
            }
         }, null, (err, sessions) => {
             if (err) {
                 console.log(err);
                 return res.send({
                     success: false,
                     message: "Error: server error"
                 });
             }
 
                 return res.send ({
                     success: true,
                     message: "Worked"
                 });
         });
    });


};