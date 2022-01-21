// controllers - user
// user - create, login, display, modify, delete
// Imports
const bcrypt = require('bcrypt');
const jwtAuth = require ('../middleware/auth')
const models = require ('../models');
const fs = require('fs')

// Constants REGEX
const EMAIL_REGEX     = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const PASSWORD_REGEX  = /^(?=.*\d).{4,8}$/;

//------controllers---------
//---  SIGNUP - create user
exports.signup = (req, res, next) => {
  console.log(req.body);
  //parametre
  const email = req.body.email;
  const password = req.body.password;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const profile = req.body.profile;
  const image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
         
       if (email == null || firstname == null || lastname == null || password == null){
        return res.status (400).json({'error': 'missing parameters'});
        }
        if (firstname.length > 20 || firstname.length < 2) {
          return res.status(400).json({ 'erreur': 'firstname invalide (doit être entre 2 et 20 caractères)' })
      } 
      if (lastname.length > 20 || lastname.length < 2) {
          return res.status(400).json({ 'erreur': 'nom invalide (doit être entre 2 et 20 caractères)' })
      } 
      
          if (!EMAIL_REGEX.test(email)) {
            return res.status(400).json({ 'error': 'email is not valid' });
          }
      
          if (!PASSWORD_REGEX.test(password)) {
            return res.status(400).json({ 'error': 'password invalid (must length 4 - 8 and include 1 number at least)' });
          }
        models.User.findOne({
            attributes: ['email'],
            where: { email: email }
        })
        .then(user => {
          if(!user) {
  
              bcrypt.hash(password, 10)
                  .then(hash => {
                      const newUser = models.User.create({
                          email: email,
                          password: hash,
                          firstname: firstname,
                          lastname: lastname,
                          profile: profile,
                          image : image,
                          isAdmin: 0
                      })
                      .then((newUser) => {
                          return res.status(201).json({ 'userId': newUser.id })
                      })
                      .catch(err => {
                          return res.status(500).json({ err })
                      })
                  }).catch(err => {
                      return res.status(500).json({ err })
                  })
  
          } else {
              return res.status(409).json({ 'error': 'user already exist' });
          }
      })
      .catch(err => {
          return res.status(500).json({ err });
      })
  };
   
/////login user
exports.login = (req, res, next) => {

  const email = req.body.email;
  const password = req.body.password;
  console.log(req.body);

  if(email == null || password == null) {
      return res.status(400).json({ error: 'Missing parameters !' });
  }

  models.User.findOne({
      where: { email: email }
      })
      .then(user => {
          if(!user) {
              return res.status(401).json({ message: 'User not found !'})
          }
          console.log(user.email);
          console.log(user.password);
          bcrypt.compare(password, user.password)
              .then(valid => {
                  if(!valid) {
                      return res.status(401).json({ message: 'Password non valide !'} )
                  }
                  res.status(200).json({
                      userId: user.id,
                      token: jwtAuth.makeTokenForUser(user)
                  })
              })
              .catch(err => {
                  res.status(500).json({ err })
              });
      })
      .catch(err => {
          res.status(500).json({ err })

      });
}

  //display one user
  exports.getOneUser = (req, res, next) => {
    const userId = req.params.id;
    models.User.findOne({
        attributes: [ 'id', 'email', 'firstname', 'lastname', 'image', 'profile' ],
        where: { id: userId }
    }).then((user) => {
        if(user){
            res.status(200).json(user);
        } else {
            res.status(404).json({ 'erreur': 'Utilisateur non trouvé !'})
        }
    }).catch(err => res.status(500).json({err}))
}

///////modify user
exports.updateUser = (req, res, next) => {
  const headerAuth = req.headers['authorization'];
  const userId = jwtAuth.getUserId(headerAuth);
  const image = req.body.image;
  const email = req.body.email;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const profile = req.body.profile;
   
 // find user and check in DB
 models.User.findOne({
  attributes: ['id', 'email', 'firstname', 'lastname', 'profile', 'image'],
  where: { id: userId }
})
  .then(user => {
      if(user) {

          // delete image
          if(image != null) {
              const imageName = user.image.split('/images/')[1];
              fs.unlink(`images/${imageName}`, (error) => {
                  if(error){
                      console.log("Delete failed : " + error);
                  } else {
                      console.log("Delete image !");
                  };
              });
          };

          // update profile
          user.update({
              email: (email ? email : user.email),
              firstname: (firstname ? firstname : user.firstname),
              lastname: (lastname ? lastname : user.lastname),
              profile: (profile ? profile : user.profile),
              image: (image ? image : user.image),
          })
          .then(userUpdated => {
              if(userUpdated){
                  return res.status(201).json(userUpdated)
              } else {
                  res.status(500).json({ 'erreur': 'Unable to Connect to Update user' })
              }
          })
          .catch(() => {
              res.status(500).json({ 'erreur': 'Unable to Connect to Update user' })
          });
      } else {
          res.status(404).json({ 'erreur': 'User not found !' })
      }
  })
  .catch(() => {
      res.status(500).json({ 'erreur': 'Impossible to verify use. You must contact support@groupomania.com' })
  })

}
/////////// delete user
exports.deleteUser = (req, res, next) => {

  // verify user
  const headerAuth = req.headers['authorization'];
  const userId = jwtAuth.getUserId(headerAuth);

  models.User.findOne({ where: { id: userId } })
      .then(user => {

          // delete image user
          let userImageName = user.image.split('/images/')[1];
          fs.unlink(`images/${userImageName}`, (error) => {
              if(error){
                  console.log("Failed to delete image : " + error);
              } else {
                  console.log("image was deleted successful !");
              };
          });
          // delete post
          models.Post.findAll({
              attributes: ['imageContent'],
              where: { userId: user.id }
          })
              .then((posts) => {

                  // delete image from post
                  for(i = 0; i < posts.length; i++){
                      if(posts[i].dataValues.imageContent){
                          console.log(posts[i].dataValues.imageContent.split('images/')[1]);
                          fs.unlink(`images/${posts[i].dataValues.imageContent.split('images/')[1]}`, (error) => {
                              if(error){
                                  console.log("Failed to delete image : " + error);
                              } else {
                                  console.log("image was deleted successful !");
                              };
                          })
                      }
                  }
                  
                  // delete all post
                  models.Post.destroy({ where: {userId: userId} })
                      .then(() => {

                          // delete user in DB
                          models.User.destroy({ where: { id: userId } })
                              .then(() => res.status(200).json({ message: 'User was deleted successful' }))
                              .catch(() => res.status(500).json({ message: "Failed to delete user !" }))
                      })
                      .catch(() => res.status(500).json({ error: "Les publications n'ont pas pu être supprimées ! " }))
              })
              .catch(() => res.status(500).json({ message: "Les posts n'ont pas pu être supprimés !"}))

      })
}