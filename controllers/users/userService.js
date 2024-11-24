const Users = require('../../models/UsersDB')


const  fetchAddUser = async (newUser ) => {
    return newUser.save()
}

const fetchFindUser = (email) => {
        return Users.findOne({ email: email })
}
const fetchFindCurrentUser = (token) => {
    return Users.findOne({ token: token })
}
module.exports = { fetchAddUser,
                   fetchFindUser,
                   fetchFindCurrentUser,
                };