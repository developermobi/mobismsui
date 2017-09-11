angular
    .module('altairApp')
    .controller('addContactCtrl', [
        '$scope',
        '$rootScope',
        'apiGetData',
        'apiPostData',
        'apiFileUpload',
        '$cookieStore',
        function ($scope,$rootScope,apiGetData,apiPostData,apiFileUpload,$cookieStore) {
        	
            $scope.contact = {};

            $scope.fileName = '';

            $scope.clearFields = function(){
                $scope.contact = '';
                $scope.fileName = '';
                $scope.contactFile = '';
            };

            var groups_data = $scope.user_group_data = [];

            $scope.getGroupData = function(){
               
                var getGroupName = "getActiveGroupByUserId/"+$rootScope.u_id;
                $scope.groupNameData = {};

                apiGetData.async(getGroupName).then(function(d) {
                    $scope.responseData = d;
                    $scope.data = $scope.responseData.data;

                    if($scope.data.code == 302){
                        $scope.userGroupData = $scope.data.data;
                        
                        console.log("userGroupData",$scope.userGroupData);

                        var response_group = $scope.userGroupData;                         

                        var increment = 1;
                        $.each(response_group,function(i){

                            console.log(response_group[i]['name']);

                            var array_group = Array();
                            array_group['title'] = response_group[i]['name'];
                            array_group['id'] = response_group[i]['groupId'];

                            console.log("array_group",Object.assign({}, array_group));

                            $scope.user_group_data[i]= Object.assign({}, array_group);

                        });

                        console.log("user_group_data",$scope.user_group_data);
                        
                    }
                });              
            }  

            $scope.getGroupData();
            
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

            $scope.addContact = function(contact){
                var contactData = contact;
                contactData.userId = $rootScope.u_id;
                contactData = JSON.stringify(contactData);

                var addContact = "saveContact";

                apiPostData.async(addContact, contactData).then(function(d) {
                    $scope.responseData = d.data;
                    if($scope.responseData.code == 201){
                        //$scope.contact = null;
                        $scope.clearFields();
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Data Inserted Successfully');
                        setTimeout(function(){
                            modal.hide();
                        },3000);
                    } 
                    else if($scope.responseData.code == 403){
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Error occured during insertion');
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

            $scope.uploadContactFile = function() {
                
                var file = $scope.contactFile;
                var uploadContact = "saveMultipleContact";

                var formData = new FormData();
                formData.append('contactFile', file);
                formData.append('groupId', $scope.contact.groupId);
                formData.append('userId', $rootScope.u_id);

                for (var pair of formData.entries()) {
                    console.log(pair[0]+ ', ' + pair[1]); 
                }

                apiFileUpload.async(uploadContact, formData).then(function(d) {
                    $scope.responseData = d.data;
                    console.log('Upload Contact Response: ',$scope.data);
                    if($scope.responseData.code == 200){
                        //$scope.contact = null;
                        $scope.clearFields();
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Data Inserted Successfully');
                        setTimeout(function(){
                            modal.hide();
                        },3000);
                    } 
                    else if($scope.responseData.code == 403){
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Error occured during insertion');
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
                    else if($scope.responseData.code == 401){
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Invalid token credentials');
                        modal.show();
                        setTimeout(function(){
                            modal.hide();
                        },3000);
                    }else if($scope.responseData.code == 413){
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Request File Too Large');
                        modal.show();
                        setTimeout(function(){
                            modal.hide();
                        },3000);
                    }
                    else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.responseData.message);
                        modal.show();
                        // setTimeout(function(){
                        //     modal.hide();
                        // },3000);
                    }                   
                });          
            }; 
        }
    ]);
