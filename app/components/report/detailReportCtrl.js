angular
    .module('altairApp')    
    .controller('detailReportCtrl', [
        '$scope',
        '$rootScope',
        'apiGetData',
        'apiPostData',
        '$cookieStore',
        '$stateParams',
        'pagerService',
        '$state',
        function ($scope,$rootScope,apiGetData,apiPostData,$cookieStore,$stateParams,pagerService,$state) {

            $scope.summary_status = '';

            if($stateParams.status == 1){
                $scope.summary_status = 'DELIVERED';
            }else if($stateParams.status == 2){
                $scope.summary_status = 'SUBMITED';
            }else if($stateParams.status == 3){
                $scope.summary_status = 'FAILED';
            }else{
                $state.go('restricted.customReport');
                return false;
            }
           
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
               
                if(status == 1){
                    $scope.summary_status = 'DELIVERED';
                }else if(status == 2){
                    $scope.summary_status = 'SUBMITED';
                }else if(status == 3){
                    $scope.summary_status = 'FAILED';
                }

                $scope.page = page;

                $scope.start = pagerService.setPage($scope.page,$scope.data_per_page);

                $scope.requestData = {};
                $scope.requestData.userId = $rootScope.u_id;
                $scope.requestData.jobId = $stateParams.jobId;
                $scope.requestData.status = $scope.summary_status;
                $scope.requestData.start = $scope.start;
                $scope.requestData.max = $scope.data_per_page;

                var rdata = JSON.stringify($scope.requestData);

                console.log('Request data: ',rdata);

                var statusReport = "dlrReportDetails";

                apiPostData.async(statusReport,rdata).then(function(d) {
                    $scope.responseData = d.data; 
                    if($scope.responseData.code == 302){
                        $scope.statusReportData = $scope.responseData.data;
                        console.log('statusReportData data',$scope.statusReportData);
                        
                        $scope.pagination = pagerService.GetPager($scope.responseData.total,$scope.page,$scope.data_per_page);
                        console.log($scope.pagination);
                        
                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.responseData.message);
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