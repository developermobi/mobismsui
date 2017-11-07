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

            

            $scope.getBalance = function(){
                var balance_url = 'getBalanceByUserId/'+$rootScope.u_id;

                apiGetData.async(balance_url).then(function(d) {
                    $scope.responseBalanceData = d.data;
                    console.log('responseBalanceData: ',$scope.responseBalanceData);

                    if($scope.responseBalanceData.code == 302){
                        
                        //console.log('responseBalanceData length',$scope.responseBalanceData.data.length);
                        $scope.balanceData = $scope.responseBalanceData.data;
                        $.each($scope.balanceData,function(i){
                            
                            //console.log('balanceData[i]: ',$scope.balanceData[i]);
                            if($scope.balanceData[i].productId.id == 1){
                                $rootScope.userBalance.transactional = $scope.balanceData[i].balance;
                            }else if($scope.balanceData[i].productId.id == 2){
                                $rootScope.userBalance.promotional = $scope.balanceData[i].balance;
                            }

                        });
                    }
                    else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.responseBalanceData.message);
                        modal.show();
                    }

                    // console.log('transactional bal: ',$rootScope.userBalance.transactional);
                    // console.log('promotional bal: ',$rootScope.userBalance.transactional);
                });
            }

            $scope.getBalance();
            

            $scope.submitSignOut = function(){                
                AuthenticationService.ClearCredentials();
                $location.path('/');
            }

        }
    ]);