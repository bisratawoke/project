
const {genericSelect,genericInsert} = require('../database/project.js');

//check to see if frontend service is active
//requires token as header and proj_pub_id as query param

const isActive = async(req,res,next) => {

	if(req.query.proj_pub_id){
		
		try{
		
			const query = `select * from frontend where proj_pub_id=$1`;
			
			const value = [req.query.proj_pub_id];
			
			const response = await genericSelect(query,value);
			
			console.log(response);
			
			return next(); 
		
		}catch(err) {
		
			if(err.type === process.env.OFF_ERR) {
				
				return res.status(500).json({message:err.message});
			
			}
			
			return res.status(400).json({message:err.message});
		
		}
	}else {
	
		return res.status(400).json({
		
			message: '[BAD REQUEST] missing query param proj_pub_id'
		});
	}
}

//activate frontend service
//requires token as header and proj_pub_id and fqdn as param

const activate = async(req,res,next) => {

	if(req.query.proj_pub_id && req.query.dn) {
	
		try{
		
			let query = 'insert into frontend(proj_pub_id,dn,owner) values($1,$2,$3,$4)';
			
			let value = [req.query.proj_pub_id,req.query.dn,res.userInfo.pub_id];
			
			const response = await genericInsert(query,value);
			
			console.log(response);
			
			return next();
			
		}catch(err) {
		
			if(err.type === process.env.OFF_ERR) {
				
				return res.status(500).json({message:err.message});
			
			}
			
			return res.status(400).json({message:err.message});
		
		}
	}
	else {
	
		return res.status(400).json({
		
			message: '[BAD REQUEST] missing query param proj_pub_id'
		});
	
	}
	

}
module.exports = {

	isActive,
	
	activate
	
}
