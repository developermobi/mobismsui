angular
    .module('altairApp')  
    .filter('decodeComponents', function() {
        return function(x) {
            return decodeURIComponent(x);
        };
    })
    .controller('dailyReportCtrl', [
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

            var $dp_report = $('#uk_dp_1');

            var dp_report = UIkit.datepicker($dp_report, {
                format:'YYYY-MM-DD',
                maxDate: new Date()
            });

            $scope.report_date = '';

            $scope.setDate = function(){
                var date = new Date();

                date.setMonth( date.getMonth() + 1 );

                var defaultDate = (date.getFullYear()) + '-' + (date.getMonth()) + '-' + (date.getDate() < 10 ? "0"+date.getDate() : date.getDate());

                $scope.report_date = defaultDate;
            }

            $scope.setDate();
            
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

            $scope.clearData = function(){
                $scope.pagination = {};
                $scope.page = 1;
            }        

            $scope.getData = function(page){

                $scope.page = page;

                $scope.start = pagerService.setPage($scope.page,$scope.data_per_page);

                var getDailyReport = "dailyRepotMessage/"+$rootScope.u_id+"/"+$scope.report_date+"/"+$scope.start+"/"+$scope.data_per_page; 

                $scope.dailyReportData = {};

                apiGetData.async(getDailyReport).then(function(d) {
                    $scope.responseData = d;
                    //alert("hello data");
                    console.log('d data',d);
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                        $scope.dailyReportData = $scope.data.data;
                        console.log('dailyRepotMessage data',$scope.dailyReportData);
                        
                        $scope.pagination = pagerService.GetPager($scope.data.total,$scope.page,$scope.data_per_page);
                        console.log($scope.pagination);
                    }else{
                        $scope.clearData();
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                        modal.show();
                    }
                });           
            }  

            $scope.getData($scope.page); 

            $scope.searchData = function(){
                $scope.getData($scope.page);
            }  

            $scope.resetDate = function(){
                $scope.setDate();
                $scope.getData($scope.page);
            } 

            $scope.$watch(function() {
                return $scope.data_per_page;
            }, function(n, o) {
                if(n != o){
                    $scope.getData(1);
                }     
            }, true)
            
        }
    ]);