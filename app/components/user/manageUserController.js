angular
    .module('altairApp')
    .controller('manageUserController', [
        '$scope',
        '$rootScope',
        'apiGetData',
        'apiPostData',
        '$cookieStore', 
        '$compile',
        function ($scope,$rootScope,apiGetData,apiPostData,$cookieStore,$compile) {
            
            $scope.resellerData = {};
            $scope.userBalanceData={};

            getResellerData();
            getResellerProdcutData();
            function getResellerData(){
                
                var getResellerData = "getUserByResellerId/"+$rootScope.u_id; 
                apiGetData.async(getResellerData).then(function(d) {
                    $scope.responseData = d;
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                        $scope.resellerData = $scope.data.data;                        
                        //console.log($scope.resellerData);
                    }
                });
            }
            function getResellerProdcutData(){
                var getUserProduct = "getUserById/"+$rootScope.u_id; 
                apiGetData.async(getUserProduct).then(function(d) {
                    $scope.responseData = d;
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                         $scope.prodcutArray = new Array();
                        $scope.userProductData = $scope.data.data; 
                       
                        for (var i = $scope.userProductData.length - 1; i >= 0; i--) {
                             $scope.prodcutArray[i] = $scope.userProductData[i].product;
                        }
                        
                    }
                });
            }
            $scope.getUserProdcut = function(id) { 
                var getUserProduct = "getBalanceByUserId/"+id; 
                apiGetData.async(getUserProduct).then(function(d) {
                    $scope.responseData = d;
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                        $scope.userBalanceData = $scope.data.data; 
                        $scope.userId = $scope.userBalanceData[0].userId['userId'];
                        console.log($scope.userId);
                       
                    }
                });
            };
            $scope.addProdcut = function(product)
            {
                var addUser = "addProduct";  
                var productData = product;
                userData.userId = $rootScope.u_id;
                userData.status = 1;
                userData = JSON.stringify(userData);
            };

            $scope.deleteUser = function(id){
               
                UIkit.modal.confirm('Are you sure want to delete this group?', function(){                     
                    var deleteSenderData = "deleteUser/"+id+"/"+$rootScope.u_id;
                    apiGetData.async(deleteSenderData).then(function(d) {
                        $scope.responseData = d;
                        $scope.data = $scope.responseData.data;
                        if($scope.data.code == 200){
                            var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Data Deleted Successfully');
                            modal.show();
                           // getData();
                            setTimeout(function(){
                                modal.hide();

                            },3000);
                        }
                        else if($scope.data.code == 404){
                            var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Not found User');
                            modal.show();
                           // getData();
                            setTimeout(function(){
                                modal.hide();
                               
                               
                            },3000);
                        }
                        else{
                            var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>error occured during detetion');
                            modal.show();
                           // getData();
                            setTimeout(function(){
                                modal.hide();
                               
                               
                            },3000);
                        }
                    });
                });                
            };
        }
    ]);
/*altairApp.directive('myDirective',function(){
     return function(scope, element, attrs){
          element.click(function(){
               element.parent().find('.main').append('<div>Some text xfvdssd</div>');
               return false;
           })
      }
})*/