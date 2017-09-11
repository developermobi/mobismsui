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

            $scope.saveGroup = function(group) {                
                var groupData = group;
                groupData.userId = $rootScope.u_id;
                groupData = JSON.stringify(groupData);

                console.log(groupData);

                var addGroup = "saveGroupDetails";
                apiPostData.async(addGroup, groupData).then(function(d) {
                    $scope.responseData = d.data;
                    if($scope.responseData.code == 201){
                        var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Group successfully added ');
                        modal.show();
                        $scope.group.name = '';
                        $scope.group.groupDescription = '';
                        setTimeout(function(){
                            modal.hide();
                        },3000);

                    }
                    else if($scope.responseData.code == 403){
                        var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Group not inserted');
                        modal.show();
                        setTimeout(function(){
                            modal.hide();
                        },3000);
                    }
                    else if($scope.responseData.code == 400){
                        var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Somethig going worng');
                        modal.show();
                        setTimeout(function(){
                            modal.hide();
                        },3000);
                    }
                    else{
                        var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Invalid  Token Credentials');
                        modal.show();
                        setTimeout(function(){
                            modal.hide();
                        },3000);
                    }
                });              
            }; 
        }

    ]);