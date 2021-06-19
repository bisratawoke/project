const Pool = require('pg').Pool;

const config = {
	
	host:process.env.PHOST,
	
	port:process.env.PPORT,
	
	user:process.env.PUSER,
	
	password:process.env.PPASSWORD,
	
	database:process.env.PDATABASE


}

const pool = new Pool(config);



//genericSelect query

const genericSelect = (query,value) => {

	return new Promise(async(resolve,reject) => {
	
		try{
		
			const response = await pool.query(query,value)
			
			if(response.rows.length < 1) reject({
				
				type:process.env.USER_ERR,
				
				message:'[NO RECORD FOUND]'
				
			})
			
			resolve(response.rows);
		
		}catch(err) {
		
			reject({
				
				type:process.env.OFF_ERR,
					
				message:err.message
				
			})
			
		}
	
	
	
	})

}

//generic insert

const genericInsert = (query,value) => {

	return new Promise(async(resolve,reject) => {
	
		try{
		
			const response = await pool.query(query,value);
		
			resolve(response);
			
		}catch(err) {
		
			reject({type:process.env.OFF_ERR,message:err.message});
		}
	
	});
	

}

module.exports = {
	
	genericSelect,
	
	genericInsert

}
