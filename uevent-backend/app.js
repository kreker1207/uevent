const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRouter')
const eventRouter = require('./routes/eventRouter')
const searchRouter = require('./routes/searchRouter')
const commentRouter = require('./routes/commentRouter')
const organizationRouter = require('./routes/orgRouter')
const purchaseRouter = require('./routes/purchaseRouter')
const path = require('path');

const cors = require('cors')
const authMid = require('./middleware/authMiddleware')
const purCheck = require('./middleware/purchase_checker')


const PORT = process.env.PORT || 8080
const app = express()

const errorHandler = async (err, req, res, next) => {
  if(err) console.log(err);
  next();
};

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileUpload());

app.use(cors({origin: 'http://localhost:3000', credentials: true }))
app.use(cookieParser())

app.use('/api', authRouter,errorHandler);

app.use(authMid);

app.use('/api', userRouter,errorHandler);
app.use('/api', eventRouter,errorHandler);
app.use('/api', searchRouter,errorHandler);
app.use('/api', organizationRouter,errorHandler);
app.use('/api', commentRouter,errorHandler);
app.use('/api', purchaseRouter,errorHandler);

app.get('/organization_pics/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, '/public/organization_pics', filename);
  res.sendFile(filepath);
});

app.get('/event_pics/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, '/public/event_pics', filename);
  res.sendFile(filepath);
});

app.get('/profile_pics/:filename', (req, res) => {
  const filename = req.params.filename;
  const filepath = path.join(__dirname, '/public/profile_pics', filename);
  res.sendFile(filepath);
});


app.listen(PORT, () => console.log(`Server up at http://localhost:${PORT}`))

//start purchase checker
// purCheck();

//price
//9 elements pagination