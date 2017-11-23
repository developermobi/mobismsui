angular
    .module('altairApp')
    .controller('addGroupCtrl', [
        '$scope',
        '$rootScope',
        'apiPostData',
        '$cookieStore',
        function ($scope,$rootScope,apiPostData,$cookieStore) {

        	$scope.group_status = {
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

            $scope.group_status_config = {
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

            $scope.group = {};
            $scope.clearGroupFields = function(){
                $scope.group = {
                    name:"",
                    status:"",
                    groupDescription:"",
                };
            };
            $scope.saveGroup = function(group) {                
                var groupData = group;
                var validatedFlag = validateData(groupData);  

                if(!validatedFlag){
                    //console.log("validatedFlag: ",validatedFlag);
                    return false;
                }
                groupData.userId = $rootScope.u_id;
                groupData = JSON.stringify(groupData);
                 
                console.log(groupData);

                var addGroup = "saveGroupDetails";
                apiPostData.async(addGroup, groupData).then(function(d) {
                    $scope.responseData = d.data;
                    if($scope.responseData.code == 201){
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Group successfully added ');
                        modal.show();
                        $scope.group.name = '';
                        $scope.group.groupDescription = '';
                        setTimeout(function(){
                            modal.hide();
                        },3000);

                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.responseData.message);
                        modal.show();
                    }
                });              
            }; 
            $scope.reset = function(){
               $scope.clearGroupFields();
            }

        }

    ]);

    function validateData(requestData){
                var data = [
                    {
                        title : "Name",
                        value : requestData.name == undefined ? "" : requestData.name,
                        validation : {
                            required : true,
                            spl_char : false,
                        }
                    }, 
                    {
                        title : "Status",
                        value : requestData.status == undefined ? "" : requestData.status,
                        validation : {
                            required : true,
                            spl_char : false,
                        }           
                    },                   
                    {
                        title : "GroupDescription",
                        value : requestData.groupDescription == undefined ? "" : requestData.groupDescription,
                        validation : {
                            required : true,
                            spl_char : false,
                            
                        }           
                    },
                    
                ];

                var validationResponse = customValidation(data);

                console.log("validationResponse",validationResponse);

                if(validationResponse.status == 0){
                    var modal = UIkit.modal.alert('<div class=\'parsley-errors-list\'>'+validationResponse.message);
                    modal.show();
                    return false;
                }else{
                    return true;
                }
            }