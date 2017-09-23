angular
    .module('altairApp')
    .controller('editUserController', [
        '$scope',
        '$rootScope',
        'apiGetData',
        'apiPostData',
        '$cookieStore', 
        '$compile',
        '$stateParams',
        function ($scope,$rootScope,apiGetData,apiPostData,$cookieStore,$compile,$stateParams) {
            
            $scope.userData = {};
            $scope.userBalanceData={};
            $scope.dndCheck = {};
            $scope.spamCheck = {};
           
            $scope.getUserData = function(){
                var getUserDetails = "getUserById/"+$stateParams.userId;                

                apiGetData.async(getUserDetails).then(function(d) {
                    $scope.responseData = d;
                        /*alert("hello data");
                        console.log('d data',d);*/
                        $scope.data = $scope.responseData.data;
                        if($scope.data.code == 302){
                            $scope.userData = $scope.data.data[0].userId;
                            //$("#userRole").val($scope.data.data[0].userId.role);
                            //$scope.userData.role = $scope.data.data[0].userId.role;
                            console.log("getUserById: ",$scope.userData);
                            console.log($scope.userData.name);
                        }else{
                            var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                            modal.show();
                        }
                    });
            }

            $scope.getUserData();

            $scope.updateUserDetails = function(userdata){
            
                var userDetailsData = JSON.stringify(userdata);               
                var updateUserDetails = "updateUserById/"+$stateParams.userId;

                //alert($scope.profileBtnFlag);

                apiPostData.async(updateUserDetails, userDetailsData).then(function(d) {
                    $scope.data = d.data;
                    console.log("updateUserDetails: ",$scope.data);
                    if($scope.data.code == 200){
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Data Updated Successfully');
                        modal.show();
                        $scope.getUserData();
                        setTimeout(function(){
                            modal.hide();
                            
                        },3000);
                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                        modal.show();
                    }
                });
                
            };
           
        }
    ]);
