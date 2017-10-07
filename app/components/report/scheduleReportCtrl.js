angular
    .module('altairApp')    
    .controller('scheduleReportCtrl', [
        '$scope',
        '$rootScope',
        'apiGetData',
        'apiPostData',
        '$cookieStore',
        '$stateParams',
        'pagerService',
        function ($scope,$rootScope,apiGetData,apiPostData,$cookieStore,$stateParams,pagerService) {

           
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

            $scope.getData = function(page){

                $scope.page = page;

                $scope.start = pagerService.setPage($scope.page,$scope.data_per_page);

                var getScheduleReport = "scheduleReportByUserId/"+$rootScope.u_id+"/"+$scope.start+"/"+$scope.data_per_page; 

                $scope.scheduleReportData = {};

                apiGetData.async(getScheduleReport).then(function(d) {
                    $scope.responseData = d;
                    //alert("hello data");
                    console.log('d data',d);
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                        $scope.scheduleReportData = $scope.data.data;
                        console.log('scheduleReportByUserId data',$scope.scheduleReportData);
                        
                        $scope.pagination = pagerService.GetPager($scope.data.total,$scope.page,$scope.data_per_page);
                        console.log($scope.pagination);
                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                        modal.show();
                    }
                });           
            }  

            $scope.getData($scope.page);   

            $scope.$watch(function() {
                return $scope.data_per_page;
            }, function(n, o) {
                if(n != o){
                    $scope.getData(1);
                }     
            }, true)
            
        }
    ]);