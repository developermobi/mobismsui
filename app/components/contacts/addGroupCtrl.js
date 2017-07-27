angular
    .module('altairApp')
    .controller('addGroupCtrl', [
        '$scope',
        '$rootScope',
        'apiPostData',
        function ($scope,$rootScope,apiPostData) {
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
                        title: "In-Active",
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
                var groupData = JSON.stringify(group);
                var addGroup = "addGroup";
                apiPostData.async(addGroup, groupData).then(function(d) {
                    $scope.data = d;
                    console.log($scope.data);
                });              
            }; 
        }

    ]);