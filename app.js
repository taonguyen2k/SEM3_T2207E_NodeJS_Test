const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const port = 9000;

const dotenv = require ("dotenv");
dotenv.config({path: "./config.env"});

// Kết nối tới MongoDB
mongoose.connect(process.env.DATABASE_LOCAL)
.then(()=>{
    console.log("connect ok");
    
})
.catch((err)=>{
    console.error("connection failed: ", err);
})
.finally(()=>{
    console.log("run...")
})

const publicDirectoryPath = path.join(__dirname,'./public')
app.use(express.static(publicDirectoryPath))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const User = mongoose.model('User', {
  UserId: String,
  Username: String,
  Fullname: String,
  Address: String
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.render('index'); // Render trang index.ejs
  });

// app.get('/', (req, res) =>{
//     res.redirect("index.ejs")
//     console.log('ok')
// });

// Thêm 1 user
app.post('/api/users', async (req, res) => {
  const { UserId, Username, Fullname, Address } = req.body;
  const newUser = new User({
    UserId,
    Username,
    Fullname,
    Address
  });
  
  try {
    await newUser.save();
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Could not create user.' });
  }
});

// Xóa 1 user thông qua UserId
app.delete('/api/users/:userId', async (req, res) => {
  const userId = req.params.userId;
  
  try {
    await User.deleteOne({ UserId: userId });
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Could not delete user.' });
  }
});

// Lấy danh sách user
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: 'Could not fetch users.' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
