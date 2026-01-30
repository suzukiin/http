require('dotenv').config();
const express = require('express');
const handlebars = require('express-handlebars');
const helmet = require('helmet');
const morgan = require('morgan');
const logger = require('./services/logger');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: false,
}));

// Logging Middleware
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine({
    helpers: {
        eq: (a, b) => a === b
    }
}));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));

const homeRoute = require('./routes/home-route');
const configRoute = require('./routes/config-route');
const natRoute = require('./routes/nat-route');

app.use('/', homeRoute);
app.use('/config', configRoute);
app.use('/nat', natRoute);

// Centralized Error Handler
app.use((err, req, res, next) => {
    logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    res.status(err.status || 500).render('error', { 
        layout: false,
        message: 'Ocorreu um erro interno no servidor.',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});