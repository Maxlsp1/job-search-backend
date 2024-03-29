const db = require('../models/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client("google-api-secret")
const User = db.User

async function signin(req, res, next){

  try {
    const account = req.body
    const user = await User.findOne({where: {email: account.email }})
    console.log('account => ', account)
    if(!user){

      res.status(400).send({error: 'utilisateur non trouvés ! '})

    } else {
      const valid = await bcrypt.compare(account.pwd, user.password)
      console.log('valid ====> ', valid)
      if(valid === false){

        res.status(401).send({error: 'mot de passe incorect !!'})

      } else {
        delete user.dataValues.password
        res.status(200).send({
          user: user,
          token: jwt.sign(
            {userId: user.id},
            'RANDOM_TOKEN_SECRET',
            {expiresIn: '24h'},
          ),
          authSuccess: true
        })
      }
    }
  } catch (error) {
      
    console.log('err : ', error)
  }

}

async function signup(req, res, next){

  try {
    
    const account = req.body

    const hash = await bcrypt.hash(account.pwd, 10)

    const newUser = await User.create({
      firstName: account.first_name,
      lastName: account.last_name,
      email: account.email,
      password: hash
    })

    delete newUser.dataValues.password
    
    res.status(200).send({
      user: newUser,
      token: jwt.sign(
        {userId: newUser.id},
        'RANDOM_TOKEN_SECRET',
        {expiresIn: '24h'},
      ),
      authSuccess: true
    })

  } catch (error) {
      
    console.log('err : ', error)
  }

}

async function googleAuth(req, res, next){

  try {
    
    const token  = req.body

    console.log('token ====> ', token)
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: "685903966367-kt10pac3ameg8rkjvnaqf0bfrqf6smk8.apps.googleusercontent.com"
    });

    const { name, email, picture } = ticket.getPayload();    
    const user = await User.upsert({ 
        where: { email: email },
        
    })
    res.status(201)
    
  } catch (error) {
      
    console.log('err : ', error)
  }

}

module.exports = {
  signin,
  signup,
  googleAuth
};