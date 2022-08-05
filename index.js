require('dotenv').config();
const config = require('config')

const app = require('./app');

const port = config.get('port');

app.listen(port, () => {
    console.log(`Server is runnning successfully at http://localhost:${port}/dashboard`);
})