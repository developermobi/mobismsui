angular
    .module('altairApp')
    .controller('main_headerCtrl', [
        '$scope',
        '$rootScope',
        '$location', 
        'AuthenticationService',
        '$cookieStore',
        'apiGetData',
        function ($scope,$rootScope,$location,AuthenticationService,$cookieStore,apiGetData) {

            // reset login status
            //AuthenticationService.ClearCredentials();
            if(AuthenticationService.isLoggedIn() == false){                
                $location.path('/');
                return false;  
            }

            $scope.userBalance = {
                promotional : 0,
                transactional: 0
            };

            var balance_url = 'getBalanceByUserId/'+$rootScope.u_id;

            apiGetData.async(balance_url).then(function(d) {
                $scope.responseBalanceData = d.data;
                console.log('responseBalanceData: ',$scope.responseBalanceData);

                if($scope.responseBalanceData.code == 302){
                    var index = 0;
                    $.each($scope.responseBalanceData,function(i){
                        
                        //alert(i);
                        console.log('responseBalanceData[i]: ',$scope.responseBalanceData.data[index]);
                        if($scope.responseBalanceData.data[index].productId.id == 1){
                            $scope.userBalance.transactional = $scope.responseBalanceData.data[index].balance;
                        }else if($scope.responseBalanceData.data[index].productId.id == 2){
                            $scope.userBalance.promotional = $scope.responseBalanceData.data[index].balance;
                        }

                        index++;
                    });
                }
                else{
                    var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.responseBalanceData.message);
                    modal.show();
                }
            });

            $scope.submitSignOut = function(){                
                AuthenticationService.ClearCredentials();
                $location.path('/');
            }

        }
    ]);