function customValidation(data){
	
	var returnData = {
		"status":1,
		"message":""
	};

	var splCharacterReg = /^\s*[a-zA-Z0-9,\s]+\s*$/;

	var mobileReg1 = /^(\+\d{1,3}[- ]?)?\d{10,12}$/;

	var mobileReg2 = /0{5,}/;

	var emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

	$.each(data,function(i){
		//console.log(data[i].title + ': ' + data[i].value);
		if(data[i].validation.required == true){
			if(data[i].value == ''){
				returnData.status = 0;
				returnData.message = data[i].title + " is required.";
				return false;
			}
		}

		if(data[i].validation.spl_char == true){	
			if(data[i].value == ""){
			}		
			else if(!splCharacterReg.test(data[i].value)){
				returnData.status = 0;
				returnData.message = "Special Characters are not allowed in "+data[i].title+".";
				return false;
			}

		}

		if(data[i].validation.mobile == true){
			if((data[i].value.match(mobileReg1)) && !(data[i].value.match(/0{5,}/)) ){
				
			}else{
				returnData.status = 0;
				returnData.message = "Mobile Number is invalid.";
				return false;
			}
			
		}

		if(data[i].validation.email == true){
			if(!emailReg.test(data[i].value)){
				returnData.status = 0;
				returnData.message = "Email Id is invalid.";
				return false;
			}
			
		}
	});

	return returnData;
}