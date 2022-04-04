const express = require('express');
const router = express.Router();
const { signupValidation, loginValidation } = require('./../validators/validation');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('./../models/user')
const Book = require('./../models/book')
const apiAuth = require('../middleware/apiAuth');
const adminAuth  = require('../middleware/adminAuth');


router.post('/register', signupValidation, async (req, res, next) => {

    const { name , username, password, isAdmin} = req.body
    const user = await User.findOne({username})
        if (user) {
                return res.status(409).send({
                    msg: 'This username is already in use!'
                });
            } else {
                const hash = crypto
                    .createHash('md5')
                    .update(password)
                    .digest('hex');
                    console.log(req.body);
                    const payload = {
                        name,
                        username,
                        password: hash,
                        isAdmin                            
                    }
                    const result = await User.create(payload, (err, res, next)=>{
                        if(err){
                            return err;
                        }})
                    return res.status(201).send({
                        msg: 'User registered',
                    })
            }
        }
);

router.post('/login', loginValidation, async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({username})
    if(!user){
        return res.status(400).send({
            msg: 'User doesnt exist'
        });
    }else{
        const hash = crypto
                    .createHash('md5')
                    .update(password)
                    .digest('hex');
        if(user.password === hash){
            const token = jwt.sign(
                {
                  user: {
                    username: user.username,
                    isAdmin: user.isAdmin,
                    _id: user._id,
                  },
                },
                'secretKEY',
                {expiresIn: '1d'}
              );
            return res.status(200).send({user,token})
        }
        else{
            return res.status(400).send({
            msg: 'Login Unsuccessful'
            })
        }
    }
});

router.post('/book', apiAuth, adminAuth, async (req, res) => {
    const {bookName, authorName, publishedYear, count} = req.body

    const book = await Book.findOne({bookName,authorName})
    if(book){
        return res.status(400).send({
            msg: 'Book already exists'
        })
    }
    const payload = {
        bookName,
        authorName,
        publishedYear,
        count
    }
    const result = await Book.create(payload, (err, res)=>{
        if(err){
            throw err;
        }
    })
    return res.status(201).send({msg: 'Book added successfully'})
});

router.delete('/book/:id',  apiAuth, adminAuth, async (req, res) => {
    const id = req.params.id;
    console.log(id);
    
    const book = await Book.findOne({_id: id})
    if(!book){
        return res.status(400).send({
            msg: 'Book doesnt exist'
        })
    }

    const result = await Book.deleteOne({_id: id},(err,re)=>{
        if(err){
            throw err;
        }
        return res.status(200).send({
            msg: 'Book deleted successfully'
        })
    })

});

router.put('/book/:id', apiAuth, adminAuth, async (req, res) => {
    const id = req.params.id;
    const {bookName, authorName, publishedYear, count} = req.body
    
    const book = await Book.findOne({_id:id})
    if(!book){
        return res.status(400).send({msg: 'Book not found'})
    }
    const book1 = await Book.findOne({bookName,authorName})
    if(book1){
        return res.status(400).send({ msg : ' Same bookname and authorname already exists'})
    }    
        const payload = {
            bookName,
            authorName,
            publishedYear,
            count
        }
        const result = await Book.replaceOne({_id : id}, payload)
        return res.status(200).send({result})
    }
);

router.get('/book',  apiAuth, adminAuth, async (req, res) => {
    const {page= 1, pageLimit = 5, columnName = 'bookName', sortingOrder= "DESC", pagination = "true"} = req.query;
    let paginationInfo = {
        limit: pageLimit,
        offset: (page-1)*pageLimit
    }
    let sort = {
        [columnName] : sortingOrder == 'DESC' ? -1 : 1
    }
    
    if (pagination === 'false') {
        paginationInfo = {}
    }
    // ASC =1 DESC = 0
    const data = await Book.find({}).sort(sort).skip(paginationInfo.offset).limit(paginationInfo.limit)

    return res.status(200).send({data})
})

router.put('/issueBook/:id',apiAuth, async (req, res) => {
    const id = req.params.id;
    const book = await Book.findOne({_id: id})
    let ctr = book.count;

    if(ctr > 0){
        const result = await Book.updateOne(
            {_id : id},
            { $inc: {count : -1 }} )
            const userId = req.user._id;
            const pushBook = await User.updateOne({_id:userId},{$push:{books:id}})
            res.status(200).send({result})
    }
    else{
        res.status(201).send({
            msg : "Book not available"
        })
    }
})

router.put('/returnBook/:id', apiAuth, async (req, res) => {
    const id = req.params.id;
    const result = await Book.updateOne(
        {_id : id},
        { $inc: {count : 1 }} )
    const userId = req.user._id;
    const pullBook = await User.updateOne({_id:userId},{$pull:{books:id}})
        res.status(200).send({result})
})

module.exports = router;


