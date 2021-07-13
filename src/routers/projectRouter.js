const projectRouter = require('express').Router();
const {tokenChecker,find,create,checkProject} = require('../controllers/projectController.js');

//find and return list of projects of authorizated users
projectRouter.get('/find',tokenChecker,find,(req,res) => {

	
	if(res.list) {
	
		return res.status(200).json({
	
			message:res.list
		
		})
	}
	
	return res.status(500).json({message:'[SERVER ERROR]'})
	
})


//create project for authenticated user

projectRouter.post('/create',tokenChecker,create,(req,res) => {
	
	if(res.proj_pub_id) {
		
		let {proj_pub_id} = res;
		
		return res.status(200).json({
	
			message:'proj_pub_id
		
		})
	
	}
	else {
	
		return res.status(500).json({ message : '[SERVER_ERROR] Unknown'});
	}


})

//check project 

projectRouter.post('/checkProject',tokenChecker,checkProject,(req,res) => {
	
	if(res.result){
	
		return res.status(200).json({
	
			message:res.result
		
		})
	}
	
	return res.status(500).json({message:'[SERVER ERROR]'})
	

})
//exporting project router

module.exports = projectRouter
