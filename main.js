const express = require('express');
const mongoose = require('mongoose');

// load config in .env
require('dotenv').config();
const DB_STRING = process.env.DB_STRING;
const PORT = process.env.PORT || 3000;

const app = express();

// middleware
app.use(express.json());

// routers
const userRouter = require('./routers/users');
app.use('/users', userRouter);

// DB config
mongoose.connect(DB_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
const conn = mongoose.connection;

// log connection established
conn.on('open', () => console.log('Connected to DB'));

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
