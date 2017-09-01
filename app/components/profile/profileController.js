angular
    .module('altairApp')
    .controller('profileCtrl', [
        '$scope',
        '$rootScope',
        'apiGetData',
        'apiPostData',
        '$cookieStore',
        function($scope, $rootScope,apiGetData,apiPostData,$cookieStore){
        	$rootScope.globals = $cookieStore.get('globals') || {};
            $rootScope.u_id = $rootScope.globals.currentUser.u_id;
            $scope.profile = {};
            $scope.userData ="";

        	getData();
            getUserBalance();
            
             function getData(){
                var getUserDetails = "getUserById/"+$rootScope.u_id;                

                apiGetData.async(getUserDetails).then(function(d) {
                    $scope.responseData = d;
                    /*alert("hello data");
                    console.log('d data',d);*/
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                        $scope.userData = $scope.data.data;
                        
                        console.log($scope.userData[0]['userProduct']);
                        //console.log($scope.userProduct);
                    }
                });
             }
            function getUserBalance()
             {
               
                var getUserBalanceDetails = "getBalanceByUserId/"+$rootScope.u_id;                

                apiGetData.async(getUserBalanceDetails).then(function(d) {
                    $scope.responseData = d;

                    $scope.data = $scope.responseData.data;

                    if($scope.data.code == 302){
                      
                        $scope.userBalanceData = $scope.data.data;  
                        //$scope.userProduct = $scope.userBalanceData[0]['userProduct'];                     
                        console.log($scope.userBalanceData);
                        //console.log($scope.userProduct);
                    }
                });
                
             }
             $scope.updateUserDetails = function(userdata){
                alert("kldjlasd");
                var userDetailsData = JSON.stringify(userdata);               
                var updateUserDetails = "updateUserById/"+$rootScope.u_id;

                apiPostData.async(updateUserDetails, userDetailsData).then(function(d) {
                    $scope.data = d.data;
                    if($scope.data.code == 200){
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Data Updated Successfully');
                            modal.show();
                           // getData();
                            setTimeout(function(){
                                modal.hide();
                                getData();
                               
                        },3000);
                        
                    }
                    else if($scope.data.code == 400)
                    {
                        UIkit.modal.alert('Somethig Going Worng........');
                    }
                });
             };
            
        }
    ]);