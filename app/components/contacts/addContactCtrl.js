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
        	$rootScope.globals = $cookieStore.get('globals') || {};
            $rootScope.u_id = $rootScope.globals.currentUser.u_id;
            
            $scope.contact = {};

            $scope.fileName = '';

            var planets_data = $scope.user_group_data = [];

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

            // $scope.group_name_config = {
            //     plugins: {
            //         'remove_button': {
            //             label     : ''
            //         }
            //     },
            //     placeholder: 'Select Group',
            //     maxItems: null,
            //     valueField: 'id',
            //     labelField: 'title',
            //     searchField: 'title',
            //     create: false,
            //     render: {
            //         option: function(planets_data, escape) {
            //             return  '<div class="option">' +
            //                 '<span class="title">' + escape(planets_data.title) + '</span>' +
            //                 '</div>';
            //         }
            //     }
            // };

            
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
                    option: function(planets_data, escape) {
                        return  '<div class="option">' +
                            '<span class="title">' + escape(planets_data.title) + '</span>' +
                            '</div>';
                    },
                    item: function(planets_data, escape) {
                        return '<div class="item">' + escape(planets_data.title) + '</div>';
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
                        $scope.contact = null;
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
                var uploadContact = "uploadContact";

                var formData = new FormData();
                formData.append('file', file);
                formData.append('g_id', $scope.contact.g_id);
                formData.append('u_id', $rootScope.u_id);

                apiFileUpload.async(uploadContact, formData).then(function(d) {
                    $scope.data = d.data;
                    if($scope.data.code == 201){
                        $scope.contact = null;
                        UIkit.modal.alert('Data Inserted Successfully');
                    }                    
                });          
            }; 
        }
    ]);

function FileNameController($scope) {
    $scope.fileName = '';
  }