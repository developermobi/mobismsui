angular
    .module('altairApp')
    .controller('groupContactCtrl', [
        '$scope',
        '$rootScope',
        'apiGetData',
        'apiPostData',
        '$cookieStore',
        '$stateParams',
        function ($scope,$rootScope,apiGetData,apiPostData,$cookieStore,$stateParams) {

            $rootScope.globals = $cookieStore.get('globals') || {};
            $rootScope.u_id = $rootScope.globals.currentUser.userId;

            getData();

            function getData(){
                var getContact = "getContactByGroupId/"+$stateParams.groupId;
                $scope.groupContactData = {};

                apiGetData.async(getContact).then(function(d) {
                    $scope.responseData = d;
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                        $scope.groupContactData = $scope.data.data;
                        //console.log($scope.groupContactData);
                    }
                });  

                var getGroupName = "getGroupByUserId/"+$rootScope.u_id;
                $scope.groupNameData = {};

                apiGetData.async(getGroupName).then(function(d) {
                    $scope.responseData = d;
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                        $scope.groupNameData = $scope.data.data;
                        planets_data = $scope.group_name_data = $scope.groupNameData;
                    }
                });              
            }  

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
                    $scope.responseData = d;
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                        $scope.contactData = $scope.data.data;
                        $scope.contact.g_id =  $scope.contactData[0].g_id;
                        $scope.contact.mobile =  $scope.contactData[0].mobile;
                        $scope.contact.name =  $scope.contactData[0].name;
                        $scope.contact.email =  $scope.contactData[0].email;
                        $scope.contact.id =  $scope.contactData[0].id;

                        console.log($scope.contactData);                        
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

            $scope.changeStatus = function(status,mob,id){
                if(status == 1){
                    status = 0;
                }else if(status == 0){
                    status = 1;
                }

                $scope.contact_data = 
                    {
                        'mobile': mob,
                        'status': status
                    };
               
                $scope.updateContact($scope.contact_data,id);
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