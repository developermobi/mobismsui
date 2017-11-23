angular
    .module('altairApp')
    .controller('addUserController', [
        '$scope',
        '$rootScope',
        'apiGetData',
        'apiPostData',
        '$cookieStore',
        'appUrl',
        function($scope, $rootScope,apiGetData,apiPostData,$cookieStore,appUrl){
        	
            $scope.userProductData ={};
            $scope.resellerData ={};
            $scope.dndCheck = '';
            $scope.spamCheck = '';
            getUserData();
           $scope.userData = {
                    userName:"",
                    name:"",
                    companyName:"",
                    mobile:"",
                    email:"",
                    address:"",
                    city:"",
                    state:"",
                    country:"",
                    role:"",
                    productId:"",
                    creditBalnce:""
                };
            
            function getUserData(){
                var getUserProduct = "getUserById/"+$rootScope.u_id; 
                apiGetData.async(getUserProduct).then(function(d) {
                    $scope.responseData = d.data;
                    console.log("responseData",$scope.responseData);
                    if($scope.responseData.code == 302){
                        $scope.prodcutArray = new Array();
                        $scope.userProductData = $scope.responseData.data; 
                        console.log("userProductData",$scope.userProductData); 
                        for (var i = $scope.userProductData.length - 1; i >= 0; i--) {
                             $scope.prodcutArray[i] = $scope.userProductData[i].productId;

                        }
                        console.log("prodcutArray",$scope.prodcutArray[0]['name']);
                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.responseData.message);
                        modal.show();
                    }
                });
            }
             $scope.clearAddUserFields = function(){
                $scope.userData = {
                    userName:"",
                    name:"",
                    companyName:"",
                    mobile:"",
                    email:"",
                    address:"",
                    city:"",
                    state:"",
                    country:"",
                    role:"",
                    productId:"",
                    creditBalnce:""
                };

            };
             $scope.reset = function(){
               $scope.clearAddUserFields();
            }
            $scope.product_id_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Sender Id',
                optgroupField: 'parent_id',
                optgroupLabelField: 'title',
                optgroupValueField: 'ogid',
                valueField: 'value',
                labelField: 'title',
                searchField: 'title',
                hideSelected: false,
                highlight: true
    
            };
             $scope.product_id_data = {
                options: [ ]
            };


             $scope.role_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Role',
                optgroupField: 'parent_id',
                optgroupLabelField: 'title',
                optgroupValueField: 'ogid',
                valueField: 'value',
                labelField: 'title',
                searchField: 'title',
                hideSelected: false,
                highlight: true
            };
            $scope.sms_type_data = {
                options: [
                    {
                        id: 1,
                        title: "Reseller",
                        value: 1,
                        parent_id: 1
                    },
                    {
                        id: 2,
                        title: "User",
                        value: 2,
                        parent_id: 1
                    }
                ]
            };
             $scope.saveUserDetails = function(user) {   
                var addUser = "saveUser";  
                var userData = user;
               // alert(userData.userName);
                if(userData == undefined || userData == "") {                    
                     var modal = UIkit.modal.alert('<div class=\'uk-text-left\' ><span style="color:#e53935">Some field are Required</span>');
                        modal.show();
                }
                /*if(userData.name == undefined || userData.name == "") {                    
                     var modal = UIkit.modal.alert('<div class=\'uk-text-left\' ><span style="color:#e53935">User Name is Required</span>');
                        modal.show();
                }*/
                console.log(userData);
                var validatedFlag = validateData(userData);  

                if(!validatedFlag){
                    //console.log("validatedFlag: ",validatedFlag);
                    return false;
                }
                userData.userId = $rootScope.u_id;
                userData.status = 1;
                userData.creditBy = "Reseller User Id 1";
                userData.percentage = 100;

                if($scope.dndCheck){
                    userData.dndCheck = 'Y';
                }else{
                    userData.dndCheck = 'N';
                }

                if($scope.spamCheck){
                    userData.spamCheck = 'Y';
                }else{
                    userData.spamCheck = 'N';
                }

                userData = JSON.stringify(userData);

                // console.log(userData);
                // return false;
                
                apiPostData.async(addUser, userData).then(function(d) {
                   // console.log(d);
                    $scope.responseData = d.data;
                    if($scope.responseData.code == 201){
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>User added Successfully');
                        modal.show(); 
                        $scope.clearAddUserFields();
                        setTimeout(function(){
                            modal.hide();
                            
                        },3000);                        

                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.responseData.message);
                        modal.show();
                    }
                    //console.log($scope.responseData);
                });            
            }; 
        }
    ]);
    function validateData(requestData){
                var data = [
                    {
                        title : "UserName",
                        value : requestData.userName == undefined ? "" : requestData.userName,
                        validation : {
                            required : true,
                            spl_char : false,
                            mobile : false,
                            email : false
                        }
                    }, 
                    {
                        title : "Name",
                        value : requestData.name == undefined ? "" : requestData.name,
                        validation : {
                            required : true,
                            spl_char : false,
                            mobile : false,
                            email : false
                        }           
                    },                   
                    {
                        title : "companyName",
                        value : requestData.companyName == undefined ? "" : requestData.companyName,
                        validation : {
                            required : true,
                            spl_char : true,
                            mobile : false,
                            email : false
                        }           
                    },
                    {
                        title : "Mobile",
                        value : requestData.mobile == undefined ? "" : requestData.mobile,
                        validation : {
                            required : true,
                            spl_char : true,
                            mobile : true,
                            email : false
                        }           
                    },
                    {
                        title : "EmailId",
                        value : requestData.email == undefined ? "" : requestData.email,
                        validation : {
                            required : true,
                            spl_char : false,
                            mobile : false,
                            email : true
                        }           
                    },
                    {
                        title : "Address",
                        value : requestData.address == undefined ? "" : requestData.address,
                        validation : {
                            required : true,
                            spl_char : false,
                            mobile : false,
                            email : false
                        }           
                    },
                    {
                        title : "City",
                        value : requestData.city == undefined ? "" : requestData.city,
                        validation : {
                            required : true,
                            spl_char : false,
                            mobile : false,
                            email : false
                        }           
                    },
                    {
                        title : "State",
                        value : requestData.state == undefined ? "" : requestData.state,
                        validation : {
                            required : true,
                            spl_char : false,
                            mobile : false,
                            email : false
                        }           
                    },
                    {
                        title : "Country",
                        value : requestData.country == undefined ? "" : requestData.country,
                        validation : {
                            required : true,
                            spl_char : false,
                            mobile : false,
                            email : false
                        }           
                    },
                    {
                        title : "Role",
                        value : requestData.role == undefined ? "" : requestData.role,
                        validation : {
                            required : true,
                            spl_char : false,
                            mobile : false,
                            email : false
                        }           
                    },
                    {
                        title : "productId",
                        value : requestData.productId == undefined ? "" : requestData.productId,
                        validation : {
                            required : true,
                            spl_char : false,
                            mobile : false,
                            email : false
                        }           
                    },
                     {
                        title : "CreditBalnce",
                        value : requestData.creditBalnce == undefined ? "" : requestData.creditBalnce,
                        validation : {
                            required : true,
                            spl_char : true,
                            mobile : false,
                            email : false
                        }           
                    },
                ];

                var validationResponse = customValidation(data);

                console.log("validationResponse",validationResponse);

                if(validationResponse.status == 0){
                    var modal = UIkit.modal.alert('<div class=\'parsley-errors-list\'>'+validationResponse.message);
                    modal.show();
                    return false;
                }else{
                    return true;
                }
            }
