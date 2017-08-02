altairApp
    .controller('profileCtrl', [
        '$scope',
        '$rootScope',
         'apiGetData',
         '$cookieStore',
        function($scope, $rootScope,apiGetData,$cookieStore){
        	$rootScope.globals = $cookieStore.get('globals') || {};
            $rootScope.u_id = $rootScope.globals.currentUser.u_id;


        	getData();
            $scope.profile = {};
            $scope.userData;
             function getData(){
                var getUserDetails = "getUserById/"+$rootScope.u_id;                

                apiGetData.async(getUserDetails).then(function(d) {
                    $scope.responseData = d;
                    /*alert("hello data");
                    console.log('d data',d);*/
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                        $scope.userData = $scope.data.data;
                       $scope.userProduct = $scope.userData[0]['userProduct'];
                        console.log($scope.userData[0]['userProduct']);
                        //console.log($scope.userProduct);
                    }
                });
             }
        }
    ]);