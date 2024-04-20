const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');
const collection = require('./config');

const app = express();

//convert data into json format
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set the view engine to EJS
app.set('view engine', 'ejs');


//staic file
app.use(express.static("public"));


// Set up views directory
//app.set('views', path.join(__dirname, 'views'));


app.get('/', (req, res) => {
    res.render('login');
});

app.get('/signup', (req, res) => {
    res.render('signup');
});

//Register User
app.post('/signup', async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    }

    // check if the user already exist in the database
    const existingUser = await collection.findOne({ name: data.name });
    if (existingUser) {
        res.send('User already exit. Please chose different username.');
    } else {
        //hash the password using bcrypt
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(data.password, saltRounds);
        data.password = hashedPassword; // Replace the hash password with original password

        const userdata = await collection.insertMany(data);
        console.log(userdata);
        res.render('home');
    }
});

//Login User
app.post('/login', async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            res.send('user name cannot found');
        }

        //Compare the hash password from the database with the plain text
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (isPasswordMatch) {
            res.render('home');
        } else {
            res.send('wrong password');
        }
    } catch {
        res.send('wrong details');
    }
});

const port = 5001;

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
