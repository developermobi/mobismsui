angular
    .module('altairApp')
    .controller('manageUserController', [
        '$scope',
        '$rootScope',
        'apiGetData',
        'apiPostData',
        '$cookieStore', 
        '$compile',
        'pagerService',
        function ($scope,$rootScope,apiGetData,apiPostData,$cookieStore,$compile,pagerService) {

            $scope.pagination = {};
            $scope.page = 1;
            
            $scope.no_of_data = {
                options: [
                    {
                        id: 1,
                        title: "5",
                        value: "5",
                        parent_id: 1
                    },
                    {
                        id: 2,
                        title: "10",
                        value: "10",
                        parent_id: 1
                    },
                    {
                        id: 3,
                        title: "25",
                        value: "25",
                        parent_id: 1
                    },
                    {
                        id: 4,
                        title: "50",
                        value: "50",
                        parent_id: 1
                    },
                    {
                        id: 5,
                        title: "100",
                        value: "100",
                        parent_id: 1
                    }
                ]
            };

            $scope.no_of_data_config = {
                create: false,
                maxItems: 1,
                placeholder: 'No of data per page',
                optgroupField: 'parent_id',
                optgroupLabelField: 'title',
                optgroupValueField: 'ogid',
                valueField: 'value',
                labelField: 'title',
                searchField: 'title',
                hideSelected: false,
                highlight: true
            };

            $scope.data_per_page = $scope.no_of_data.options[0].value;
            
            $scope.resellerData = {};
            $scope.userBalanceData={};

            $scope.credit = {};
            $scope.debit = {};

            function clearData(){
                $scope.credit = {};
                $scope.debit = {};
            }

            $scope.data_per_page = $scope.no_of_data.options[0].value;

                       
            $scope.getResellerData = function(page){

                $scope.page = page;

                $scope.start = pagerService.setPage($scope.page,$scope.data_per_page);
                
                var getResellerData = "getUserByResellerId/"+$rootScope.u_id+"/"+$scope.start+"/"+$scope.data_per_page;  
                apiGetData.async(getResellerData).then(function(d) {
                    $scope.responseData = d;
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                        $scope.resellerData = $scope.data.data;       

                        $scope.pagination = pagerService.GetPager($scope.data.total,$scope.page,$scope.data_per_page);                 
                        //console.log($scope.data.total);
                        getResellerProdcutData();
                    }else{
                        $scope.pagination = {};
                        $scope.page = 1;
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                        modal.show();
                    }
                });
            }

            $scope.getResellerData($scope.page);

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
                        
                    }else{
                        /*var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                        modal.show();*/
                    }
                });
            }
            $scope.getUserProduct = function(id) { 
                clearData();
                var getUserProduct = "getBalanceByUserId/"+id; 
                apiGetData.async(getUserProduct).then(function(d) {
                    $scope.responseData = d;
                    $scope.data = $scope.responseData.data;
                    console.log($scope.data);
                    if($scope.data.code == 302){
                        $scope.userBalanceData = $scope.data.data; 
                        $scope.userId = $scope.userBalanceData[0].userId['userId'];
                        //console.log($scope.userId);
                       
                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                        modal.show();
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
                        $scope.getUserProduct($scope.userId);                      
                        setTimeout(function(){
                            modal.hide();
                        },3000);                        

                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.responseData.message);
                        modal.show();
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
                        }else{
                            var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                            modal.show();
                        }
                    });
            }

            $scope.deleteUser = function(id){
               
                UIkit.modal.confirm('Are you sure want to delete this user?', function(){                     
                    var deleteSenderData = "deleteUser/"+id+"/"+$rootScope.u_id;
                    apiGetData.async(deleteSenderData).then(function(d) {
                        $scope.responseData = d;
                        $scope.data = $scope.responseData.data;
                        if($scope.data.code == 200){
                            var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>User Deleted Successfully');
                            modal.show();
                            getResellerData();
                            setTimeout(function(){
                                modal.hide();

                            },3000);
                        }else{
                            var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                            modal.show();
                        }
                    });
                });                
            };

            $scope.updateCredit = function(id,credit,index){

                var updateCredit = "addCreditByReseller/"+$scope.userId+"/"+$rootScope.u_id+"/"+id+"/"+$scope.credit.balance[index];
               
                apiGetData.async(updateCredit).then(function(d) {
                    $scope.responseData = d;
                    $scope.data = $scope.responseData.data;
                    console.log("updateCredit response:",$scope.data);
                    if($scope.data.code == 201){
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Credit added successfully');
                        modal.show();
                        $scope.getUserProduct($scope.userId);
                        setTimeout(function(){
                            modal.hide();
                        },3000);
                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                        modal.show();
                    }
                });
            };

            $scope.updateDebit = function(id,debit,index){

                var updateDebit = "deductCreditByReseller/"+$scope.userId+"/"+$rootScope.u_id+"/"+id+"/"+$scope.debit.balance[index];
               
                apiGetData.async(updateDebit).then(function(d) {
                    $scope.responseData = d;
                    $scope.data = $scope.responseData.data;
                    console.log("updateDebit response:",$scope.data);
                    if($scope.data.code == 201){
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>SMS Debited successfully');
                        modal.show();
                        $scope.getUserProduct($scope.userId);
                        setTimeout(function(){
                            modal.hide();
                        },3000);
                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                        modal.show();
                    }
                });
            };

            $scope.$watch(function() {
                return $scope.data_per_page;
            }, function(n, o) {
                if(n != o){
                    $scope.getResellerData(1);
                }     
            }, true)
        }
    ]);
