function requiredValidation(data){
	
	var returnData = {
		"status":0,
		"data":""
	};

	for(var propt in data){
	    console.log(propt + ': ' + data[propt]);
	    if(data[propt] == ''){
	    	returnData.status = 0;
	    	returnData.data = propt+" is required.";
	    	break;
	    }
	}

	return returnData;
}

// $(function(){
// 	var responseData = requiredValidation();

// 	console.log("responseData",responseData);

// 	for(var responsePropt in responseData){
// 		console.log(responsePropt + ': ' + responseData[responsePropt]);
// 	}
// });