const fetch = require('node-fetch');
const {genericSelect,genericInsert} = require('../database/project.js');
const {fork} = require('child_process');




const find = async(req,res,next) => {
	
	console.log('here');

	try{
		
		let query = 'select proj_name,description,proj_pub_id,owner from projects where owner=$1';
		
		let value = [res.userInfo.pub_id];
		
		const response = await genericSelect(query,value);
		
		console.log(response);
		
		res.list = response;
		
		
		return next();
		
	}catch(err) {
		
		if(err.type === process.env.OFF_ERR) {
				
			return res.status(500).json({message:err.message});
			
		}
			
		return res.status(400).json({message:err.message});
			
	
	}
	
	


}


//create project for authenticated users only

const create = async(req,res,next) => {

	if(res.userInfo){
		
		if(req.body){
			
			try{
			
				const {pub_id} = res.userInfo;
				
				let query = 'insert into project'
				
				let gen_pub_id = fork('./src/database/gen_pub_id.js');
			
				gen_pub_id.on('message',async proj_pub_id => {
				
					try{
						
						let query = 'insert into projects(proj_name,description,proj_pub_id,owner) values($1,$2,$3,$4)';
						
						let value = [req.body.proj_name,req.body.description,proj_pub_id,pub_id];
						
						console.log(value);
						
						const response = await genericInsert(query,value);
						
						console.log(response);
						
						res.proj_pub_id = proj_pub_id;
						
						return next();
				
					}catch(err) {
						
						console.log('here');
						
						console.log(err);
						
						return res.status(500).json({message:'[SERVER ERROR] unknown baby'})
					
					}
			
					
				})
				
			
			}catch(err) {
			
				if(err.type === process.env.OFF_ERR) {
				
					return res.status(500).json({message:err.message});
					
				}
				
				return res.status(500).json({message:err.message});
			}
			
			return ;
		}
		return res.status(400).json({message:'[BAD REQUEST] missing arguments'});
	}
	
	return res.status(500).json({message:'[SERVER ERROR] unknown baby'});



}

//check authenticity of the token
//make api call to account app 
const tokenChecker = async(req,res,next) => {
	
	if(req.headers['authorization']){
		
		try{
		
		
			const token = req.headers['authorization'].split(' ')[1];
				
			console.log(token);
		
			//request options
			const opt = {
			
				headers:{
				
					'authorization':`token ${token}`
					
				},
				
				method:'GET'
				
			}
			
			//making api call
			
			const response = await fetch(`${process.env.AUTH_SERVICE_HOST}/api/account/service/check`,opt)
			
			if(response.status === 200) {
				
				console.log('success')
				
				res.userInfo = await response.json()
				
				console.log(res.userInfo);
				
				return next();
				
			
			}
			
			else if (response.status === 500){
			
				throw {type:process.env.OFF_ERR,message:'server crashed'}
				
			}
			
			else throw {type:process.env.USER_ERR,message:'NOT AUTHENTICATED'}
			
			return next();
		
		}
		catch(err) {
			
			if(err.type === process.env.OFF_ERR){
			
				return res.status(500).json({message:err.message})
			
			}
			
			return res.status(401).json({message:err.message})
		
		}
		
	}
		
		
	
	return res.status(400).json({
	
		message:'[BAD REQUEST]'
	})



}
// check project exists

const checkProject = async(req,res,next) => {
	
	console.log(` this ${JSON.stringify(res.userInfo)}`)
	
	if(res.userInfo){
	
		if(req.query.proj_name){
			
			try{
				
				console.log(res.userInfo);
				
				const {proj_name} = req.query;
				
				let query = 'select * from projects where proj_name=$1 and owner=$2';
				
				let value = [proj_name,res.userInfo.pub_id];
				 
				const response = await genericSelect(query,value);
				
				console.log(response);
				
				res.result = response[0];
				
				return next();
			
			}catch(err) {
				
				console.log(err)
				if(err.type === process.env.OFF_ERR){
				
					return res.status(500).json({message:`[SERVER ERROR] ${err.message}`});
				}
				
				return res.status(404).json({message:`[SERVER ERROR] ${err.message}`});
			}
			
			return;
		}
		
		return res.status(400).json({message:'[BAD REQUEST] missing arguments'});
	}
	

	return res.status(500).json({message:'[SERVER ERROR] unknown baby'})

}
module.exports = {

	find,
	
	tokenChecker,
	
	create,
	
	checkProject
	
}
