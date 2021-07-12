const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;

//express middlewares

app.use(express.json());

//custom routers 
const projectRouter = require('./src/routers/projectRouter');

app.use('/api/project',projectRouter);
//listen

app.listen(PORT,() => console.log(`[PROJECT SERVER] running on port ${PORT}`))
