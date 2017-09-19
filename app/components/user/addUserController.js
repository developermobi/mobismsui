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
                    }
                });
            }
           
             $scope.saveUserDetails = function(user) {   
                var addUser = "saveUser";  
                var userData = user;
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
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Successfully Add User');
                        modal.show();                        
                        setTimeout(function(){
                            modal.hide();
                        },3000);                        

                    }else if($scope.responseData.code == 204){
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>InSufficient Balance');
                        modal.show();
                        setTimeout(function(){
                            modal.hide();
                        },3000);
                    }
                    else if($scope.responseData.code == 405){
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Please set positive balance');
                        modal.show();
                        setTimeout(function(){
                            modal.hide();
                        },3000);
                    }
                    else if($scope.responseData.code == 406){
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Please Purchase Selected  Product');
                        modal.show();
                        setTimeout(function(){
                            modal.hide();
                        },3000);
                    }
                    else if($scope.responseData.code == 400){
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Somethig going worng');
                        modal.show();
                        setTimeout(function(){
                            modal.hide();
                        },3000);
                    }
                    else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Invalid  Token Credentials');
                        modal.show();
                        setTimeout(function(){
                            modal.hide();
                        },3000);
                    }
                    //console.log($scope.responseData);
                });            
            }; 
        }
    ]);

