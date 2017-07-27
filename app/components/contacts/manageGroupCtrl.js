angular
    .module('altairApp')
    .controller('manageGroupCtrl', [
        '$scope',
        '$rootScope',
        'apiGetData',
        'apiPostData',
        '$cookieStore',
        function ($scope,$rootScope,apiGetData,apiPostData,$cookieStore) {

            $rootScope.globals = $cookieStore.get('globals') || {};
            $rootScope.u_id = $rootScope.globals.currentUser.userId;

            //console.log(groupData);
            getData();
            // $scope.groupData = {};
            // $scope.responseData = groupData;
            // $scope.data = $scope.responseData.data;
            // if($scope.data.code == 302){
            //     $scope.groupData = $scope.data.data;
            //     console.log($scope.groupData);
            // }

            function getData(){
                
                var getGroup = "getGroupByUserId/"+$rootScope.u_id;
                $scope.groupData = {};

                apiGetData.async(getGroup).then(function(d) {
                    $scope.responseData = d;
                    console.log('d data',d);
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                        $scope.groupData = $scope.data.data;
                        //console.log($scope.groupData);
                    }
                });
            };            

            $scope.group = {};

            $scope.groupDetailsData = {};
            $scope.getGroupDetails = function(id){                
                var getGroupDetails = "getGroupById/"+id;

                apiGetData.async(getGroupDetails).then(function(d) {
                    $scope.responseData = d;
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                        $scope.groupDetailsData = $scope.data.data;
                        //console.log($scope.groupDetailsData);
                        $scope.group.group_name = $scope.groupDetailsData[0].group_name;
                        $scope.group.description = $scope.groupDetailsData[0].description;
                        //console.log($scope.group.group_name);
                    }
                });
            };

            $scope.updateGroup = function(group,id){
                var groupData = JSON.stringify(group);
               
                var updateGroup = "updateGroup/"+id;
                console.log(updateGroup);
                apiPostData.async(updateGroup, groupData).then(function(d) {
                    $scope.data = d.data;
                    //console.log($scope.data);
                    if($scope.data.code == 200){
                        getData();
                        UIkit.modal.alert('Data Updated Successfully');
                    }                    
                });
            };
           
            $scope.changeStatus = function(status,g_name,id){
                if(status == 1){
                    status = 0;
                }else if(status == 0){
                    status = 1;
                }

                $scope.g_data = 
                    {
                        'group_name': g_name,
                        'status': status
                    };
               
                $scope.updateGroup($scope.g_data,id);
            };

            $scope.deleteGroup = function(id){   

                UIkit.modal.confirm('Are you sure want to delete this group?', function(){                     
                    var deleteGroupData = "deleteGroup/"+id;

                    apiGetData.async(deleteGroupData).then(function(d) {
                        $scope.responseData = d;
                        $scope.data = $scope.responseData.data;
                        if($scope.data.code == 200){
                            getData();
                            UIkit.modal.alert('Data Deleted Successfully');
                        }
                    });
                });                
            };

            $scope.openAddContact = function(id,g_name){
                $scope.grp_data = 
                    {
                        'group_name': g_name,
                        'id': id
                    };
            };

            $scope.addGroupContact = function(contact,id){
                
                var contactData = contact;
                contactData.g_id = id;
                contactData.u_id = $rootScope.u_id;
                contactData = JSON.stringify(contactData);

                var addContact = "addContact";
                //console.log(updateGroup);
                apiPostData.async(addContact, contactData).then(function(d) {
                    $scope.data = d.data;
                    console.log($scope.data);
                    if($scope.data.code == 201){
                        getData();
                        UIkit.modal.alert('Contact Addedd Successfully');
                    }else if($scope.data.code == 400){
                        UIkit.modal.alert($scope.data.data);
                    }                   
                });
            };
        }
    ]);