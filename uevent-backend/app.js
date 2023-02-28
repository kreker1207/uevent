const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const authRouter = require('./routes/authRouter')
const userRouter = require('./routes/userRouter')
const cors = require('cors')


const PORT = process.env.PORT || 8080
const app = express()

const errorHandler = async (err, req, res, next) => {
  if(err) console.log(err);
  next();
};

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors({origin: 'http://localhost:3000', credentials: true }))
app.use(cookieParser())

app.use('/api',userRouter,errorHandler)
app.use('/api',authRouter,errorHandler)

app.listen(PORT, () => console.log(`Server up at http://localhost:${PORT}`))
