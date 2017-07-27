angular
    .module('altairApp')
    .directive('fileModel', ['$parse', function ($parse) {
        return {
        restrict: 'A',
        // scope: {
        //     fileName: '='
        // },
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                    console.log(element[0].files[0].name);
                    //scope.fileName = files[0].name;
                    //scope.$apply();
                });
            });
        }
       };
    }])
    .controller('addContactCtrl', [
        '$scope',
        '$rootScope',
        'apiGetData',
        'apiPostData',
        'apiFileUpload',
        '$cookieStore',
        function ($scope,$rootScope,apiGetData,apiPostData,apiFileUpload,$cookieStore) {
        	$rootScope.globals = $cookieStore.get('globals') || {};
            $rootScope.u_id = $rootScope.globals.currentUser.userId;
            $scope.contact = {};

            $scope.fileName = '';

            getData();

            function getData(){               
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
                placeholder: 'Select Group',
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

            $scope.addContact = function(contact){
                var contactData = contact;
                contactData.u_id = $rootScope.u_id;
                contactData = JSON.stringify(contactData);

                var addContact = "addContact";

                apiPostData.async(addContact, contactData).then(function(d) {
                    $scope.data = d.data;
                    if($scope.data.code == 201){
                        $scope.contact = null;
                        UIkit.modal.alert('Data Inserted Successfully');
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