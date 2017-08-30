angular
    .module('altairApp')    
    .controller('manageContactsCtrl', [
        '$scope',
        '$rootScope',
        'apiGetData',
        'apiPostData',
        '$cookieStore',
        '$stateParams',
        'pagerService',
        function ($scope,$rootScope,apiGetData,apiPostData,$cookieStore,$stateParams,pagerService) {

            $rootScope.globals = $cookieStore.get('globals') || {};
            $rootScope.u_id = $rootScope.globals.currentUser.u_id;

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

            $scope.getData = function(page){

                $scope.page = page;

                $scope.start = pagerService.setPage($scope.page,$scope.data_per_page);

                var getContact = "getAllContact/"+$rootScope.u_id+"/"+$scope.start+"/"+$scope.data_per_page; 

                $scope.userContactData = {};

                apiGetData.async(getContact).then(function(d) {
                    $scope.responseData = d;
                    //alert("hello data");
                    console.log('d data',d);
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                        $scope.contactData = $scope.data.data.contactData;
                        console.log('getAllContact data',$scope.contactData);
                        
                        $scope.pagination = pagerService.GetPager($scope.data.data.total,$scope.page,$scope.data_per_page);
                        console.log($scope.pagination);
                    }
                });           
            }  

            $scope.getData($scope.page);    

            var planets_data = $scope.group_name_data = [];
            $scope.group_name_config = {
                plugins: {
                    'remove_button': {
                        label     : ''
                    }
                },
                maxItems: 1,
                valueField: 'id',
                labelField: 'group_name',
                searchField: 'group_name',
                create: false,
                 hideSelected: false,
                highlight: true,
                render: {
                    option: function(planets_data, escape) {
                        return  '<div class="option">' +
                            '<span class="title">' + escape(planets_data.group_name) + '</span>' +
                            '</div>';
                    },
                    item: function(planets_data, escape) {
                        return '<div class="item">' + escape(planets_data.group_name) + '</div>';
                    }
                }
            };

            $scope.contact = {};
            $scope.getContactDetails = function(id){                
                var getContactData = "getContactById/"+id;
                $scope.contactData = {};
                apiGetData.async(getContactData).then(function(d) {                    
                    $scope.responseData = d.data;
                    console.log('responseData',$scope.responseData);   
                    if($scope.responseData.code == 302){
                        $scope.contactData = $scope.responseData.data;
                        $scope.contact.g_id =  $scope.contactData[0].groupId.groupId;
                        $scope.contact.mobile =  $scope.contactData[0].mobile;
                        $scope.contact.name =  $scope.contactData[0].name;
                        $scope.contact.email =  $scope.contactData[0].emailId;
                        $scope.contact.id =  $scope.contactData[0].contactId;

                        console.log($scope.contact);                        
                    }
                }); 
            };

            $scope.updateContact = function(contact,id){
                var contactData = JSON.stringify(contact);               
                var updateContact = "updateContact/"+id;

                apiPostData.async(updateContact, contactData).then(function(d) {
                    $scope.data = d.data;
                    if($scope.data.code == 200){
                        getData();
                        UIkit.modal.alert('Data Updated Successfully');
                    }                    
                });
            };

            $scope.changeStatus = function(status,id){
                
                var updateStatus = "updateContactStatus/"+id+"/"+status;
                console.log(updateStatus);
                apiGetData.async(updateStatus).then(function(d) {
                    $scope.responseData = d.data;
                    console.log($scope.responseData);

                    if($scope.responseData.code == 200){
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Data updated successfully');
                        modal.show();
                        $scope.getData($scope.page);
                        setTimeout(function(){
                            $('.uk-modal-close').trigger('click');
                            modal.hide();
                        },3000);

                    }
                    else if($scope.responseData.code == 304){
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Error occured during updation');
                        modal.show();
                        setTimeout(function(){
                            modal.hide();
                        },3000);
                    }
                    else if($scope.responseData.code == 400){
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Bad Request');
                        modal.show();
                        setTimeout(function(){
                            modal.hide();
                        },3000);
                    }
                    else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Invalid token credentials');
                        modal.show();
                        setTimeout(function(){
                            modal.hide();
                        },3000);
                    }                   
                });
            };

            $scope.deleteContact = function(id){   

                UIkit.modal.confirm('Are you sure want to delete this contact?', function(){                     
                    var deleteContactData = "deleteContact/"+id;

                    apiGetData.async(deleteContactData).then(function(d) {
                        $scope.responseData = d;
                        $scope.data = $scope.responseData.data;
                        if($scope.data.code == 200){
                            getData();
                            UIkit.modal.alert('Data Deleted Successfully');
                        }
                    });
                });                
            };
        }
    ]);