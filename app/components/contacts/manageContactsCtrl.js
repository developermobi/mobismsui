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
        '$timeout',
        '$q',
        function ($scope,$rootScope,apiGetData,apiPostData,$cookieStore,$stateParams,pagerService,$timeout,$q) {

            $scope.contact = {
                groupId:"",
                name:"",
                designation:"",
                mobile:"",
                emailId:""
            };
            
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

            $scope.contact_status = {
                options: [
                    {
                        id: 1,
                        title: "Active",
                        value: "1",
                        parent_id: 1
                    },
                    {
                        id: 2,
                        title: "Deactive",
                        value: "0",
                        parent_id: 1
                    }
                ]
            };

            $scope.contact_status_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select...',
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

            $scope.defer = null;

            $scope.getData = function(page){
                $scope.defer = null;
                $scope.defer = $q.defer();

                $scope.page = page;

                $scope.start = pagerService.setPage($scope.page,$scope.data_per_page);

                var getContact = "getAllContact/"+$rootScope.u_id+"/"+$scope.start+"/"+$scope.data_per_page; 

                $scope.userContactData = {};

                apiGetData.async(getContact).then(function(d) {
                    $scope.responseData = d;
                    //alert("hello data");
                    //console.log('d data',d);
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                        $scope.contactData = $scope.data.data.contactData;
                        //console.log('getAllContact data',$scope.contactData);
                        
                        $scope.pagination = pagerService.GetPager($scope.data.data.total,$scope.page,$scope.data_per_page);
                        //console.log($scope.pagination);
                        
                    }else{
                        $scope.clearData();
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                        modal.show();
                    }

                    $scope.defer.resolve();
                });           
            }  

            $scope.getData($scope.page); 

            var groups_data = $scope.user_group_data = [];

            $scope.getGroupData = function(){
               
                var getGroupName = "getActiveGroupByUserId/"+$rootScope.u_id;
                $scope.groupNameData = {};

                apiGetData.async(getGroupName).then(function(d) {
                    $scope.responseData = d;
                    $scope.data = $scope.responseData.data;

                    if($scope.data.code == 302){
                        $scope.userGroupData = $scope.data.data;
                        
                        //console.log("userGroupData",$scope.userGroupData);

                        var response_group = $scope.userGroupData;                         

                        var increment = 1;
                        $.each(response_group,function(i){

                            //console.log(response_group[i]['name']);

                            var array_group = Array();
                            array_group['title'] = response_group[i]['name'];
                            array_group['id'] = response_group[i]['groupId'];

                            //console.log("array_group",Object.assign({}, array_group));

                            $scope.user_group_data[i]= Object.assign({}, array_group);

                        });

                        //console.log("user_group_data",$scope.user_group_data);
                        
                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                        modal.show();
                    }
                });              
            } 

            $scope.defer.promise.then(function(){
                $scope.getGroupData();
            });   
            
            $scope.group_name_config = {
                plugins: {
                    'remove_button': {
                        label     : ''
                    }
                },
                placeholder: 'Select Group',
                maxItems: 1,
                valueField: 'id',
                labelField: 'title',
                searchField: 'title',
                create: false,
                hideSelected: false,
                highlight: true,
                render: {
                    option: function(groups_data, escape) {
                        return  '<div class="option">' +
                            '<span class="title">' + escape(groups_data.title) + '</span>' +
                            '</div>';
                    },
                    item: function(groups_data, escape) {
                        return '<div class="item">' + escape(groups_data.title) + '</div>';
                    }
                }
            };

            $scope.contact = {};
            $scope.getContactDetails = function(id){                
                var getContactData = "getContactById/"+id;
                $scope.contactDetails = {};
                apiGetData.async(getContactData).then(function(d) {                    
                    $scope.responseData = d.data;
                    //console.log('responseData',$scope.responseData);   
                    if($scope.responseData.code == 302){
                        $scope.contactDetails = $scope.responseData.data;
                        $scope.contact.groupId =  $scope.contactDetails[0].groupId.groupId;
                        $scope.contact.mobile =  $scope.contactDetails[0].mobile;
                        $scope.contact.name =  $scope.contactDetails[0].name;
                        $scope.contact.emailId =  $scope.contactDetails[0].emailId;
                        $scope.contact.designation =  $scope.contactDetails[0].designation;
                        $scope.contact.status =  $scope.contactDetails[0].status;

                        //console.log("resp: ",$scope.contact);                        
                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.responseData.message);
                        modal.show();
                    }
                }); 
            };

            $scope.updateContact = function(contact,id){

                $scope.defer = null;

                $scope.defer = $q.defer();

                var validatedFlag = validateData(contact);  

                if(!validatedFlag){
                    //console.log("validatedFlag: ",validatedFlag);
                    return false;
                }

                var contactData = JSON.stringify(contact);               
                var updateContact = "updateContactById/"+id;

                console.log('contactData',contactData);

                apiPostData.async(updateContact, contactData).then(function(d) {
                    $scope.responseData = d.data;
                    //console.log('responseData',$scope.responseData);
                    if($scope.responseData.code == 200){     
                        $scope.triggerClick('#edit_contact .uk-modal-close');
                          
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Data Updated Successfully');
                        modal.show();
                        
                        setTimeout(function(){
                            modal.hide();
                        },3000);
                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                        modal.show();
                    } 

                    $scope.defer.resolve(); 

                });

                $scope.defer.promise.then(function(){
                    setTimeout(function(){
                        $scope.getData($scope.page);
                    },3000);
                    
                });
            };

            $scope.changeStatus = function(status,id){
                
                var updateStatus = "updateContactStatus/"+id+"/"+status;
                //console.log(updateStatus);
                apiGetData.async(updateStatus).then(function(d) {
                    $scope.responseData = d.data;
                    //console.log($scope.responseData);

                    if($scope.responseData.code == 200){
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Data updated successfully');
                        modal.show();
                        $scope.getData($scope.page);
                        setTimeout(function(){
                            modal.hide();
                        },3000);

                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.responseData.message);
                        modal.show();
                    }                
                });
            };

            $scope.deleteContact = function(id){   

                UIkit.modal.confirm('Are you sure want to delete this contact?', function(){                     
                    var deleteContactData = "deleteContact/"+id;

                    apiGetData.async(deleteContactData).then(function(d) {
                        $scope.responseData = d.data;
                        
                        if($scope.responseData.code == 200){
                            var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Data deleted successfully');
                            modal.show();
                            $scope.getData($scope.page);
                            setTimeout(function(){
                                modal.hide();
                            },3000);

                        }else{
                            var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.responseData.message);
                            modal.show();
                        } 
                    });
                });                
            };

            $scope.$watch(function() {
                return $scope.data_per_page;
            }, function(n, o) {
                if(n != o){
                    $scope.getData(1);
                }     
            }, true)

            $scope.triggerClick = function (className) {
                $timeout(function() {
                    angular.element(className).trigger('click');
                }, 100);
            };

            function validateData(requestData){
                var data = [
                    {
                        title : "Group",
                        value : requestData.groupId == undefined ? "" : requestData.groupId,
                        validation : {
                            required : true,
                            spl_char : false,
                            mobile : false,
                            email : false
                        }           
                    }, 
                    {
                        title : "Mobile",
                        value : requestData.mobile == undefined ? "" : requestData.mobile,
                        validation : {
                            required : true,
                            spl_char : true,
                            mobile : true,
                            email : false
                        }           
                    },
                    {
                        title : "Name",
                        value : requestData.name == undefined ? "" : requestData.name,
                        validation : {
                            required : false,
                            spl_char : true,
                            mobile : false,
                            email : false
                        }           
                    },
                    {
                        title : "Email Id",
                        value : requestData.emailId == undefined ? "" : requestData.emailId,
                        validation : {
                            required : false,
                            spl_char : false,
                            mobile : false,
                            email : true
                        }           
                    },                   
                    {
                        title : "Designation",
                        value : requestData.designation == undefined ? "" : requestData.designation,
                        validation : {
                            required : false,
                            spl_char : true,
                            mobile : false,
                            email : false
                        }           
                    },
                ];

                var validationResponse = customValidation(data);

                if(validationResponse.status == 0){
                    var modal = UIkit.modal.alert('<div class=\'parsley-errors-list\'>'+validationResponse.message);
                    modal.show();
                    return false;
                }else{
                    return true;
                }
            }
        }
    ]);