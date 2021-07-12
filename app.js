const express = require('express');
const app = express();
require('dotenv').config();
const PORT = process.env.PORT;

//express middlewares

app.use(express.json());

//custom routers 
const projectRouter = require('./src/routers/projectRouter');

app.get('/api/project/test',(req,res) => {
  
  return res.json({
   mssg: 'hello world'
  })
})

app.use('/api/project',projectRouter);
//listen

app.listen(PORT,() => console.log(`[PROJECT SERVER] running on port ${PORT}`))
