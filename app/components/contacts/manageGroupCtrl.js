angular
    .module('altairApp')
    .controller('manageGroupCtrl', [
        '$scope',
        '$rootScope',
        'apiGetData',
        'apiPostData',
        '$cookieStore',
        'pagerService',
        function ($scope,$rootScope,apiGetData,apiPostData,$cookieStore,pagerService) {
           
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

            $scope.group = {};
            
            $scope.getData = function(page){

                $scope.page = page;

                $scope.start = pagerService.setPage($scope.page,$scope.data_per_page);
                
                var getGroup = "getAllGroupPaginate/"+$rootScope.u_id+"/"+$scope.start+"/"+$scope.data_per_page;                
                
                apiGetData.async(getGroup).then(function(d) {
                    $scope.responseData = d;
                    //alert("hello data");
                    console.log('d data',d);
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                        $scope.groupData = $scope.data.data.groupDetailsData;
                        console.log('getAllGroup data',$scope.groupData);
                        
                        $scope.pagination = pagerService.GetPager($scope.data.data.total,$scope.page,$scope.data_per_page);
                        console.log($scope.pagination);
                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                        modal.show();
                    }
                });
            };    

            $scope.getData($scope.page);          

            $scope.groupDetailsData = {};
            $scope.getGroupDetails = function(id){ 
                $scope.group = {};               
                var getGroupDetails = "getGroupById/"+id;

                apiGetData.async(getGroupDetails).then(function(d) {
                    $scope.responseData = d;
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                        $scope.groupDetailsData = $scope.data.data;
                        console.log('groupDetailsData data',$scope.groupDetailsData);
                        $scope.group.name = $scope.groupDetailsData[0].name;
                        $scope.group.groupDescription = $scope.groupDetailsData[0].groupDescription;
                        $scope.group.status = $scope.groupDetailsData[0].status;
                        //console.log($scope.group.group_name);
                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                        modal.show();
                    }
                });
            };

            $scope.updateGroup = function(group,id){
                var groupData = JSON.stringify(group);
               
                var updateGroup = "updateGroupById/"+id;
                console.log(updateGroup);
                apiPostData.async(updateGroup, groupData).then(function(d) {
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

                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.responseData.message);
                        modal.show();
                    }                  
                });
            };
           
            $scope.changeStatus = function(status,g_name,g_desc,id){
                if(status == 1){
                    status = 0;
                }else if(status == 0){
                    status = 1;
                }


                $scope.g_data = 
                    {
                        'name': g_name,
                        'groupDescription': g_desc,
                        'status': status
                    };
               
                $scope.updateGroup($scope.g_data,id);
            };

            $scope.deleteGroup = function(id){   

                UIkit.modal.confirm('Are you sure want to delete this group?', function(){                     
                    var deleteGroupData = "deleteGroup/"+id;

                    apiGetData.async(deleteGroupData).then(function(d) {
                        $scope.responseData = d.data;
                        if($scope.responseData.code == 200){
                            var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Data Deleted successfully');
                            modal.show();
                            $scope.getData($scope.page);
                            setTimeout(function(){
                                $('.uk-modal-close').trigger('click');
                                modal.hide();
                            },3000);

                        }else{
                            var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.responseData.message);
                            modal.show();
                        }
                    });
                });                
            };

            $scope.openAddContact = function(id,g_name){
                $scope.grp_data = 
                    {
                        'name': g_name,
                        'id': id
                    };
            };

            $scope.addGroupContact = function(contact,id){
                
                var contactData = contact;
                contactData.groupId = id;
                contactData.userId = $rootScope.u_id;
                contactData = JSON.stringify(contactData);

                var addContact = "saveContact";
                //console.log(updateGroup);
                apiPostData.async(addContact, contactData).then(function(d) {
                    $scope.responseData = d.data;
                    if($scope.responseData.code == 201){                       
                        $scope.contact = null;
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Data Inserted Successfully');
                        $scope.getData($scope.page);
                        setTimeout(function(){
                            $('.uk-modal-close').trigger('click');
                            modal.hide();
                        },3000);
                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.responseData.message);
                        modal.show();
                    }               
                });
            };
        }
    ]);