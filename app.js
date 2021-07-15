const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;
const cors = require('cors');
//express middlewares

app.use(express.json());
app.use(cors());
//custom routers 
const projectRouter = require('./src/routers/projectRouter');

//service router

const serviceRouter = require('./src/routers/serviceRouter');

//health check url
app.get('/api/project/test',(req,res) => {
  
  return res.json({
   mssg: 'hello world'
  })
})

app.get('/api/project/sertest',(req,res) => {
	return res.json({
   mssg: 'hello world'
  })
})
//using projectRouter
app.use('/api/project',projectRouter);

//using serviceRouter
app.use('api/project/service',serviceRouter);
//listen

app.listen(PORT,() => console.log(`[PROJECT SERVER] running on port ${PORT}`))
