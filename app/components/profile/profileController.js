angular
.module('altairApp')
.controller('profileCtrl', [
    '$scope',
    '$rootScope',
    'apiGetData',
    'apiPostData',
    '$cookieStore',
    'AuthenticationService',
    function($scope, $rootScope,apiGetData,apiPostData,$cookieStore,AuthenticationService){

        $scope.profile = {};
        $scope.userData ="";
        $scope.passwordFlag = true;        

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
                        $scope.userData = $scope.data.data[0].userId;
                        
                        console.log("getUserById: ",$scope.userData);
                        console.log($scope.userData.name);
                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                        modal.show();
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
                }else{
                    var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                    modal.show();
                }
            });

        }
        $scope.updateUserDetails = function(userdata){
            
            var userDetailsData = userdata; 
            userDetailsData.role = $rootScope.u_role;
            userDetailsData = JSON.stringify(userDetailsData); 
                          
            var updateUserDetails = "updateUserById/"+$rootScope.u_id;

            //alert($scope.profileBtnFlag);

            if($scope.profileBtnFlag == 0){

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
                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                        modal.show();
                    }
                });

            }else if($scope.profileBtnFlag == 1){

                if($scope.passwordFlag == false){
                    return false;
                }                

                var generateOtp = "generateOtp/"+$rootScope.u_id;                

                apiGetData.async(generateOtp).then(function(d) {
                    $scope.responseOtpData = d;

                    $scope.otpData = $scope.responseOtpData.data;

                    if($scope.otpData.code == 201){

                        UIkit.modal.prompt('Please enter otp that sent to registered mobile number', '', function(val){ 
                            var varifyOtp = "verifyOtp/"+val+"/"+$rootScope.u_id;
                            apiGetData.async(varifyOtp).then(function(d) {
                                $scope.responseVerifyData = d;

                                $scope.varifyData = $scope.responseVerifyData.data;

                                if($scope.varifyData.code == 201){

                                    var updatePassword = "updatePassword"; 

                                    var userPasswordData = userdata; 
                                    userPasswordData = JSON.stringify(userPasswordData);  

                                    apiPostData.async(updatePassword, userPasswordData).then(function(d) {
                                        $scope.userPwdData = d.data;
                                        if($scope.userPwdData.code == 201){
                                            var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Password Changed Successfully And Sent To Registered Mobile Number');
                                            modal.show();
                                            AuthenticationService.logout();
                                        }else{
                                            var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.userPwdData.message);
                                            modal.show();
                                        }
                                    });
                                    
                                }else{
                                    var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.varifyData.message);
                                    modal.show();
                                }
                            });
                        });

                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.otpData.message);
                        modal.show();
                    }
                });

                //alert("change pwd");
                console.log("On Change Pwd: ",userdata);
            }

            
        };

        $scope.profileBtnFlag = 0;

        $scope.setProfileBtnFlag = function(flag){
            $scope.profileBtnFlag = flag;
        }

    }
    ])
    .directive('passwordVerify', passwordVerify);
    

function passwordVerify(){
    return{
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, elem, attrs, ngModel){

            if(!ngModel) return;

            scope.$watch(attrs.ngModel, function(){
                validate();
            });

            attrs.$observe('passwordVerify', function(val){
                validate();
            });

            var validate = function(){

                var val1 = ngModel.$viewValue;
                var val2 = attrs.passwordVerify;

                if(val1 != undefined){
                    scope.passwordFlag = val1 === val2;
                }                
            };
        }
    }
}

