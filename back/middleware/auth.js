//import
const jwt = require('jsonwebtoken');
const JWT_SING_SECRET = 'lskfj354fdlkgrin26ffchilk13g4g6d';
//export fuction
module.exports = {
    makeTokenForUser: function(userData){
        return jwt.substring({
            userId: userData.id,
            admin: userData.admin
        },
        JWT_SING_SECRET,
        {
        expiresIn: '2h'
        })
    },
    parseAuth: function(authorization) {
        return (authorization!= null) ? authorization.replace('Bearer ', '') : null;
      },
      getUserId: function(authorization) {
        const userId = -1;
        const token = module.exports.parseAuth(authorization);
        if(token != null) {
          try {
            const jwtToken = jwt.verify(token, JWT_SIGN_SECRET);
            if(jwtToken != null)
              userId = jwtToken.userId;
          } catch(err) { }
        }
        return userId;
      }
    }
