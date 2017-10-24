angular
    .module('altairApp')
    .controller('transactionCtrl', [
        '$scope',
        '$rootScope',
         'apiGetData',
         'apiPostData',
         '$cookieStore',
         'pagerService',
         '$timeout',
        function($scope, $rootScope,apiGetData,apiPostData,$cookieStore,pagerService,$timeout){

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
        	
            $scope.transction = {};
            $scope.userData ="";
            $scope.userTransactionData ="";           

            $scope.smsTypes = [];

            $scope.selectedProductId = {};
            $scope.selectedProductName = {};

            $scope.postData = {};            

            $scope.data_per_page = $scope.no_of_data.options[0].value;  
            //$scope.smsTypeTitle

            $scope.select= function(id,title) {
                $scope.selectedProductId = id;
                $scope.selectedProductName = title; 
                //$('#user_edit_tabs .debit_li').trigger('click');
                //$scope.getDebitData(1);
                 $scope.triggerClick();
            };

            $scope.getDebitData = function(page){
                $scope.transType = 2;
                $scope.page = page;
                $scope.start = pagerService.setPage($scope.page,$scope.data_per_page);  
                getTransactionDetails();              
            }

            $scope.getCreditData = function(page){
                $scope.transType = 1;
                $scope.page = page;
                $scope.start = pagerService.setPage($scope.page,$scope.data_per_page);  
                getTransactionDetails();              
            }

            $scope.getUserData = function(){  

                var getUserById = "getUserById/"+$rootScope.u_id;               

                apiGetData.async(getUserById).then(function(d) {
                    $scope.responseData = d;
                    /*alert("hello data");
                    console.log('d data',d);*/
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                        $scope.userData = $scope.data.data;
                        
                        console.log($scope.userData);

                        var response_data = $scope.userData;                         

                        var increment = 1;
                        $.each(response_data,function(i){

                            console.log(response_data[i].productId['id']);

                            var array_product = Array();
                            array_product['id'] = response_data[i].productId['id'];
                            array_product['title'] = response_data[i].productId['name'];
                            increment++;

                            $scope.smsTypes[i]= Object.assign({}, array_product);

                            if(i == 0){
                                $scope.selectedProductId = response_data[i].productId['id'];
                                $scope.selectedProductName = response_data[i].productId['name']; 
                            }
                            
                        });

                        console.log("selectedProductId",$scope.selectedProductId);
                        $scope.getDebitData($scope.page);
                        
                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                        modal.show();
                    }
                });
            }

             $scope.getUserData();
        	
            function getTransactionDetails(){   
                //alert($scope.page);
                $scope.start = pagerService.setPage($scope.page,$scope.data_per_page);

                $scope.postData.userId = $rootScope.u_id;
                $scope.postData.productId = $scope.selectedProductId;
                $scope.postData.type = $scope.transType;
                $scope.postData.start = $scope.start;
                $scope.postData.limit =  $scope.data_per_page;

                var postTransData = JSON.stringify($scope.postData);

                console.log("postTransData",postTransData);


                var getTransctionDetails = "getTransactionDetails";                

                apiPostData.async(getTransctionDetails,postTransData).then(function(d) {
                    $scope.responseTransData = d;
                    console.log('responseTransData: ',$scope.responseTransData);
                    /*alert("hello data");
                    console.log('d data',d);*/
                    $scope.dataTrans = $scope.responseTransData.data;
                    console.log('dataTrans: ',$scope.dataTrans);
                    if($scope.dataTrans.code == 302){
                        $scope.userTransactionData = $scope.dataTrans.data;
                        
                        console.log('userTransactionData: ',$scope.userTransactionData);
                        //$scope.pagination = {};
                        $scope.pagination = pagerService.GetPager($scope.dataTrans.total,$scope.page,$scope.data_per_page);
                        console.log("pagination length: ",$scope.pagination.totalPages);
                    }else{
                        $scope.userTransactionData = {};
                        $scope.pagination = {};
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.dataTrans.message);
                        modal.show();
                    }
                });
            }

            $scope.triggerClick = function () {
                $timeout(function() {
                    angular.element('#user_edit_tabs .debit_li').trigger('click');
                }, 100);
            };

            $scope.$watch(function() {
                return $scope.data_per_page;
            }, function(n, o) {
                if(n != o){
                    if($scope.transType == 1){
                        $scope.getCreditData(1);
                    }else if($scope.transType == 2){
                        $scope.getDebitData(1);
                    }
                }     
            }, true)
            
        }
    ]);