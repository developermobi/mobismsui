angular
    .module('altairApp')
    .controller('senderIdCtrl', [
        '$scope',
        '$rootScope',
        'apiGetData',
        'apiPostData',
        '$cookieStore', 
        '$compile',
        'pagerService',
        function ($scope,$rootScope,apiGetData,apiPostData,$cookieStore,$compile,pagerService) {
            
            /*alert($rootScope.u_id);*/
            $scope.sender = {};
            $scope.senderEdited = {};

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

            $scope.clearData = function(){
                $scope.pagination = {};
                $scope.page = 1;
            } 
                      
            $scope.getData = function(page){   

                $scope.page = page;

                $scope.start = pagerService.setPage($scope.page,$scope.data_per_page);
                
                var getSender = "getAllSenderIdPaginate/"+$rootScope.u_id+"/"+$scope.start+"/"+$scope.data_per_page;               

                apiGetData.async(getSender).then(function(d) {
                    $scope.responseData = d;
                    /*alert("hello data");
                    console.log('d data',d);*/
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                        $scope.userSenderData = $scope.data.data.sender_id_data;
                        
                        $scope.pagination = pagerService.GetPager($scope.data.data.total,$scope.page,$scope.data_per_page);
                        console.log($scope.pagination);
                    }else{
                        $scope.clearData();
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                        modal.show();
                    }
                });
            };   

            $scope.getData($scope.page);  

            $scope.saveSenderId = function(sender) {  
                
                var addSender = "saveSenderId";  
                var senderData = sender;

                // var validationData = {
                //     "Sender Id": senderData.senderId == undefined ? "" : senderData.senderId
                // };

                // var validationResponse = requiredValidation(validationData);

                // // console.log("validationResponse",validationResponse);
                // // console.log("validationResponse data",validationResponse.data);

                // // for(var responsePropt in validationResponse){
                // //     console.log(responsePropt + ': ' + validationResponse[responsePropt]);
                // // }

                // if(validationResponse.status == 0){
                //     var modal = UIkit.modal.alert('<div class=\'parsley-errors-list\'>'+validationResponse.data);
                //     modal.show();
                //     return false;
                // }

                //console.log(senderData.senderId);
                //return false;

                senderData.userId = $rootScope.u_id;
                senderData.status = 0;
                senderData = JSON.stringify(senderData);

                // console.log(senderData);
                // return false;
                
                apiPostData.async(addSender, senderData).then(function(d) {
                   // console.log(d);
                    $scope.responseData = d.data;
                    if($scope.responseData.code == 201){
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Sender ID added Succesfully.');
                        modal.show();
                        $scope.sender.senderId = '';
                        $scope.getData($scope.page);  
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

            $scope.deleteSenderId = function(id){   
                //alert(id);
                UIkit.modal.confirm('Are you sure want to delete this Sender Id?', function(){                     
                    var deleteSenderData = "deleteSenderId/"+id;

                    apiGetData.async(deleteSenderData).then(function(d) {
                        $scope.responseData = d;
                        $scope.data = $scope.responseData.data;
                        if($scope.data.code == 200){
                            $scope.getData($scope.page);  
                            UIkit.modal.alert('Data Deleted Successfully.');
                        }else{
                            var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                            modal.show();
                        }
                    });
                });                
            };

            $scope.editFlag = true;

            $scope.editSender = function(id){

                //alert($scope.editFlag);
                
                if($scope.editFlag == true){
                    var element = $(".senderIdtd"+id).text();  
                    $(".senderIdtd"+id).html('');                 

                    var $el = $('<input type="text" class="md-input" ng-modal="senderEdited.sender" id="senderEdited'+id+'" value="'+element+'" md-input>'+
                                '<div class="md-card-toolbar-actions">'+
                                    '<i ng-click="removeTexBox('+id+')" data-uk-tooltip={pos:"bottom"} title="Click to cancel" class="removeTexBox md-icon material-icons md-color-blue-grey-500">&#xE14C;</i>'+
                                    '<i ng-click="updateSenderId('+id+')" data-uk-tooltip={pos:"bottom"} title="Click to save" class="updateSenderId md-icon material-icons md-color-light-blue-500">&#xE161;</i>'+
                                '</div>').appendTo(".senderIdtd"+id);
                    $compile($el)($scope);

                    $scope.senderEdited.sender = element;
                    
                    //console.log(element);
                }
                
                $scope.editFlag = false;
                
            };
          

            $scope.removeTexBox = function(id){
                //alert(id);
                $scope.editFlag = true;
                $scope.getData($scope.page);
                
            };

         
            $scope.updateSenderId = function(id) {   
                $scope.editFlag = true;
                var updateSenderId = "updateSenderById/"+id;
                                
                var senderData = {};
                senderData.senderId = $("#senderEdited"+id).val();
                senderData.status = 1;
                senderData = JSON.stringify(senderData);

                // console.log(senderData);
                // return false;
                
                apiPostData.async(updateSenderId, senderData).then(function(d) {
                   // console.log(d);
                    $scope.responseData = d.data;
                    if($scope.responseData.code == 200){
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Sender Id updated successfully');
                        modal.show();
                        $scope.getData($scope.page);
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

            $scope.reset = function(){
                $scope.sender = {};
                $scope.senderEdited = {};
            }

            $scope.$watch(function() {
                return $scope.data_per_page;
            }, function(n, o) {
                if(n != o){
                    $scope.getData(1);
                }     
            }, true)           


        }
    ]);