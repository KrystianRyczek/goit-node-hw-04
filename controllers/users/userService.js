const Users = require('../../models/UsersDB')


const  fetchAddUser = async (newUser ) => {
    console.log(newUser)
    newUser.save()
}

const fetchFind = (filter) => {
    return Users.findOne(filter)
}

const fetchFindAndUpdate= (filter, update) => {
    return Users.findOneAndUpdate(filter, update, {new:true})
}

module.exports = { fetchAddUser,
                   fetchFind,
                   fetchFindAndUpdate,
                };