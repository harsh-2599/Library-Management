const { check } = require('express-validator');

exports.signupValidation = [
    check('username', 'Name is requied').not().isEmpty(),
    check('password', 'Please include a valid user_type').isEmpty(),
    check('user_type', 'Password must be 6 or more characters').isLength({ min: 6 })
]

exports.loginValidation = [
    check('username', 'Please include a valid username').isEmpty(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 })

]