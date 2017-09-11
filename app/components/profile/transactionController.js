angular
    .module('altairApp')
    .controller('transactionCtrl', [
        '$scope',
        '$rootScope',
         'apiGetData',
         'apiPostData',
         '$cookieStore',
        function($scope, $rootScope,apiGetData,apiPostData,$cookieStore){
        	
            $scope.transction = {};
            $scope.userData ="";
            getDebitData();
            getCreditData();
        	
            

             function getDebitData(){
                var getTransctionDetails = "getDebitByUserId/"+$rootScope.u_id;                

                apiGetData.async(getTransctionDetails).then(function(d) {
                    $scope.responseData = d;
                    /*alert("hello data");
                    console.log('d data',d);*/
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                        $scope.userData = $scope.data.data;
                        
                        console.log('debit data',$scope.userData);
                        //console.log($scope.userProduct);
                    }
                });
             }
            function getCreditData()
             {
               
                var getCreditDetails = "getCreditByUserId/"+$rootScope.u_id;                

                apiGetData.async(getCreditDetails).then(function(d) {
                    $scope.responseData = d;

                    $scope.data = $scope.responseData.data;
                    console.log('credit',$scope.data);

                    if($scope.data.code == 302){
                      
                        $scope.getCreditData = $scope.data.data;  
                        //$scope.userProduct = $scope.userBalanceData[0]['userProduct'];                     
                        console.log('credit data',$scope.getCreditData);
                        //console.log($scope.userProduct);
                    }
                });
                
             }
            
            
        }
    ]);