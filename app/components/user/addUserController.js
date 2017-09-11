altairApp
    .controller('addUserController', [
        '$scope',
        '$rootScope',
        'apiGetData',
        'apiPostData',
        '$cookieStore',
        function($scope, $rootScope,apiGetData,apiPostData,$cookieStore){
        	
            $scope.userProductData ={};
            $scope.resellerData ={};
            getUserData();
           
            
            function getUserData(){
                var getUserProduct = "getUserById/"+$rootScope.u_id; 
                apiGetData.async(getUserProduct).then(function(d) {
                    $scope.responseData = d;
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                         $scope.prodcutArray = new Array();
                        $scope.userProductData = $scope.data.data; 
                        console.log($scope.userProductData); 
                        for (var i = $scope.userProductData.length - 1; i >= 0; i--) {
                             $scope.prodcutArray[i] = $scope.userProductData[i].product;
                        }
                        console.log($scope.prodcutArray[0]['name']);
                    }
                });
            }
           
             $scope.saveUserDetails = function(user) {   
                var addUser = "saveUser";  
                var userData = user;
                userData.userId = $rootScope.u_id;
                userData.status = 1;
                userData = JSON.stringify(userData);

                //console.log(senderData);
                
                apiPostData.async(addUser, userData).then(function(d) {
                   // console.log(d);
                    $scope.responseData = d.data;
                    if($scope.responseData.code == 201){
                        var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Successfully Add User');
                        modal.show();
                         window.location.href="/mobismsui/#/manageUser";
                        setTimeout(function(){
                            modal.hide();
                        },3000);

                    }else if($scope.responseData.code == 204){
                        var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>InSufficient Balance');
                        modal.show();
                        setTimeout(function(){
                            modal.hide();
                        },3000);
                    }
                    else if($scope.responseData.code == 405){
                        var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Please set positive balance');
                        modal.show();
                        setTimeout(function(){
                            modal.hide();
                        },3000);
                    }
                    else if($scope.responseData.code == 406){
                        var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Please Purchase Selected  Product');
                        modal.show();
                        setTimeout(function(){
                            modal.hide();
                        },3000);
                    }
                    else if($scope.responseData.code == 400){
                        var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Somethig going worng');
                        modal.show();
                        setTimeout(function(){
                            modal.hide();
                        },3000);
                    }
                    else{
                        var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Invalid  Token Credentials');
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

