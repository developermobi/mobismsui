altairApp
    .controller('addUserController', [
        '$scope',
        '$rootScope',
        'apiGetData',
        'apiPostData',
        '$cookieStore',
        function($scope, $rootScope,apiGetData,apiPostData,$cookieStore){
        	$rootScope.globals = $cookieStore.get('globals') || {};
            $rootScope.u_id = $rootScope.globals.currentUser.u_id;
            
            $scope.userProductData ={};
            getDebitData();
             function getDebitData(){
                var getUserProduct = "getUserById/"+$rootScope.u_id; 
                apiGetData.async(getUserProduct).then(function(d) {
                    $scope.responseData = d;
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                        $scope.userProductData = $scope.data.data;                        
                        console.log($scope.userProductData[0].userProduct);
                    }
                });
             }  
        }
    ]);