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
                       console.log("userProductData",$scope.userProductData);
                        for (var i = $scope.userProductData.length - 1; i >= 0; i--) {
                             $scope.prodcutArray[i] = $scope.userProductData[i].productId;
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
                var addUserProduct = "addProduct/"+$scope.userId+"/"+$rootScope.u_id+"/"+product.productId+"/"+product.balance;  
                
                apiGetData.async(addUserProduct).then(function(d) {
                   // console.log(d);
                    $scope.responseData = d.data;
                    if($scope.responseData.code == 201){
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.responseData.message);
                        modal.show();  
                        $scope.getUserProdcut($scope.userId);                      
                        setTimeout(function(){
                            modal.hide();
                        },3000);                        

                    }
                    else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.responseData.message);
                        modal.show();
                        setTimeout(function(){
                            modal.hide();
                        },3000);
                    }
                    //console.log($scope.responseData);
                });
            };                    

            $scope.getUserData = function(id){
                var getUserDetails = "getUserById/"+id;                

                apiGetData.async(getUserDetails).then(function(d) {
                    $scope.responseData = d;
                        /*alert("hello data");
                        console.log('d data',d);*/
                        $scope.data = $scope.responseData.data;
                        if($scope.data.code == 302){
                            $scope.userData = $scope.data.data[0].userId;
                            
                            console.log("getUserById: ",$scope.userData);
                            console.log($scope.userData.name);
                        }
                    });
            }

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