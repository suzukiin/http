const express = require('express');
const handlebars = require('express-handlebars');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.set('partials', './views/partials');

const getLogsRoute = require('./routes/getLogs-route');

app.use('/logs', getLogsRoute);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});