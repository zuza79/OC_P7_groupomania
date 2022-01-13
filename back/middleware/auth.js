//import
const jwt = ('jsonwebtoken');
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
    }
}