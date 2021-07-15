const serviceRouter = require('express').Router();
const {tokenChecker} = require('../controllers/projectController.js');
const {isActive,activate} = require('../controllers/frontendServiceController.js');
//check to see if frontend service is active i.e check if it exist


serviceRouter.get('/frontend/isActive',tokenChecker,isActive,(req,res) => {
	
	console.log(`in main ${res.isActive}`);
	
	if(res.isActive) {
		
		return res.status(200).json({
		
			message: true
		});
		
	}
	else {
	
		return res.status(200).json({
		
			message: false
		});
	}
	
});


//activate frontend service

serviceRouter.post('/frontend/Activate',tokenChecker,activate,(req,res) => {

	return res.status(200).json({
	
		message: 'successfully activated service'
		
	});
	
});

//exporting router

module.exports = serviceRouter;
