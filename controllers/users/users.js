const Joi = require('joi');
const { joiPasswordExtendCore } = require('joi-password');
const JoiPassword = Joi.extend(joiPasswordExtendCore);
const Users = require('../../models/UsersDB')
const jwt = require('jsonwebtoken')


const { fetchAddUser,
        fetchFind,
        fetchFindAndUpdate,
      } =require("./userService");
      
const signUpSchema = Joi.object({ 
  userName: Joi.string().pattern(/[a-zA-Z]{2,}[/ /]{0,1}[a-zA-Z]{2,}/).required(),

  email: Joi.string().pattern(/^[a-zA-Z0-9]{2,}[/@/][a-zA-Z]{2,}[/./][a-zA-Z]{2,}/).required(),

  password: JoiPassword.string().minOfSpecialCharacters(2).minOfLowercase(2).minOfUppercase(2).minOfNumeric(2).noWhiteSpaces().onlyLatinCharacters().doesNotInclude(['password']).required(),
})


const signUpUser = async (req, res, next) => {
  const { error } = signUpSchema.validate(req.body);
  if (error){
    return next(error)
  }
  try{
    const user = await fetchFind({email: req.body.email})
    if(user){
      throw new Error('Email is taken!')
    }
  }catch(error){
    error.name = "OcupatedEmail"
      return next(error)
  }

  try{
    const newUser = new Users({...req.body})
    await newUser.setPassword(req.body.password)
    await fetchAddUser(newUser)
    res.status(201).json(newUser)
  }catch(error){
    next(error)
  }
}

const signIpUser = async (req, res, next)  => {

  try{
    const user = await fetchFind({email: req.body.email})

    if(user){
      const isPassCorrect = await user.validatePassword(req.body.password)
      if (isPassCorrect){
        const payload = {
                         id: user._id,
                         user: user.email  //wstawić username?
                        }
        const token = jwt.sign(payload, 
                               process.env.SECRET,
                               {expiresIn:'12h'}
        )

        await fetchFindAndUpdate({email: user.email}, {token: token})
        return res.status(201).json(token)
      }
    }
    throw new Error('Incorrect user credentials!')

  }catch(error){
    error.name = "IncorrectCredentials"
      return next(error)  
  }
}

const signOutUser = async (req, res, next)  => {
try{
  await fetchFindAndUpdate({token: res.locals.user.token}, {token: null})
  return res.status(200).json({ message: "Successfully signed out" });
}catch(err){
  return next(err) 
}
}

const currentUser = async (req, res, next)  => {
  const user = await fetchFind({token: res.locals.user.token}) 
  res.status(200).json(user)
}


module.exports = {
  signUpUser,
  signIpUser,
  signOutUser,
  currentUser,
}
