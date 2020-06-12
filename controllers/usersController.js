const router = require('express').Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');

//////////////////////////
// Models
//////////////////////////

const User = require('../models/userSchema.js')

//////////////////////////
// Middleware
//////////////////////////
// Auth Check
const authCheck = (req, res, next) => {
    try {
        const token = req.header("x-auth-token")
        if (!token)
            return res.status(401).json({msg: "No auth token"})
        
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        if (!verified)
            return res.status(401).json({msg: "Authorization failed"})  

        req.user = verified.id
        next()
    } catch (error) {
        res.status(500).json({error: error.message})
    }
}

//////////////////////////
// Signup
//////////////////////////

router.post('/signup', async (req, res) => {
    try {
        // Destructuring the request body
        const { username, password, passwordCheck, email, firstName, lastName } = req.body
        // Validations        
        if (!email || !password || !passwordCheck || !username)
            return res.status(400).json({msg: "not all fields have been entered"})
        if (password.length < 5)
            return res.status(400).json({msg: "Password needs to be atleast five characters long!"})
        if (password !== passwordCheck)
            return res.status(400).json({msg: 'Passwords do not match'})

        const existingUser = await User.findOne({email: email, username: username},
            (err, foundUser) => {
                res.status(400).json({msg: "A user with this email or password already exists"})
                console.log('hey2',foundUser);
        })
        if (existingUser)
            return res.status(400).json({msg: "Account with this email already exists"})
        // End Validations
        // Hashing
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(password, salt)


        // User Create 
        const newUser = await User.create({
            email: email,
            password: passwordHash,
            username: username,
            firstName: firstName,
            lastName: lastName,
        }, (err, createdUser) => {
            if (err){
                console.log(err);
                res.status(500).json(err)
            } else {
                console.log('hey',createdUser)
                res.status(200).json(createdUser)
            }
        })
    } catch (error) {
        res.status(500).json(error)    
    }
})
//////////////////////////
// Login
//////////////////////////

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!password || !username) 
            return res.status(400).json({msg: "Not all fiels have been entered"})
        const user = await User.findOne({username: username})
        if (!user)
            return res.status(400).json({msg: 'Account does not exist'})
        const comparePasswords = await bcrypt.compare(password, user.password)
        if (!comparePasswords)
            return res.status(400).json({msg: "Wrong Password"})
        
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            },
        })
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
})

router.delete('/delete', authCheck, async (req, res) => {
    // Deletes a user
    try {
        const deletedUser = await User.findByIdAndDelete(req.user)
        res.status(200).json(deletedUser)
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
})

router.post('/tokenisvalid', async (req, res) => {
    // used on front end: checks if token is valid
    try {
        const token = req.header('x-auth-token')     
        if (!token) return res.json(false)
        
        const verified = jwt.verify(token, process.env.JWT_SECRET)
        if (!verified) return res.json(false)

        const user = await User.findById(verified.id)
        if (!user) return res.json(false)

        return res.json(true)
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
})

module.exports = router

