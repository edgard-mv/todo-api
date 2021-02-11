const express = require('express');
const mongoose = require('mongoose');
const expressJWT = require('express-jwt');

// load config in .env
require('dotenv').config();
const DB_STRING = process.env.DB_STRING;
const PORT = process.env.PORT || 3000;
const TOKEN_SECRET = process.env.TOKEN_SECRET;

const app = express();

// middleware
app.use(express.json());
app.use(expressJWT({
    secret: Buffer.from(TOKEN_SECRET, 'base64'),
    algorithms: ['HS256'],
    requestProperty: 'auth',
    getToken: function fromHeaderOrQuerystring (req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
          return req.query.token;
        }
        return null;
    }
}).unless({
    path: [
        '/auth/signup',
        '/auth/login'
    ]
}));

// routers
const userRouter = require('./routers/users');
app.use('/users', userRouter);
const authRouter = require('./routers/auth');
app.use('/auth', authRouter);

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
