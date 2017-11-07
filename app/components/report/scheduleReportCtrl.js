angular
    .module('altairApp')    
    .filter('decodeComponents', function() {
        return function(x) {
            return decodeURIComponent(x);
        };
    })
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
            
            $scope.start_date = "";
            $scope.end_date = "";            

            $scope.setDate = function(){

                var $dp_start = $('#uk_dp_start'),
                $dp_end = $('#uk_dp_end');

                var minDate1 = new Date();
                minDate1.setMonth(minDate1.getMonth() - 3);

                var date = new Date();
                date.setMonth( date.getMonth() - 2 );
                //alert((date.getMonth() ) + '/' + (date.getDate()) + '/' + (date.getFullYear()));

                minDate1 = (date.getFullYear()) + '-' + (date.getMonth()) + '-' + (date.getDate() < 10 ? "0"+date.getDate() : date.getDate());

                console.log("minDate1: ",minDate1);

                var start_date = UIkit.datepicker($dp_start, {
                    format:'YYYY-MM-DD',
                    maxDate: new Date(),
                    minDate: minDate1
                });

                var end_date = UIkit.datepicker($dp_end, {
                    format:'YYYY-MM-DD',
                    maxDate: new Date()
                });

                $dp_start.on('change',function() {
                    end_date.options.minDate = $dp_start.val();
                });

                $dp_end.on('change',function() {
                    start_date.options.maxDate = $dp_end.val();
                });

                var date1 = new Date();

                date1.setMonth( date1.getMonth() + 1 );

                var defaultDate = (date1.getFullYear()) + '-' + (date1.getMonth()) + '-' + (date1.getDate() < 10 ? "0"+date1.getDate() : date1.getDate());
                
                $scope.start_date = defaultDate;
                $scope.end_date = defaultDate;
            }

            $scope.setDate();
            
            $scope.data_per_page = $scope.no_of_data.options[0].value; 

            $scope.clearData = function(){
                $scope.pagination = {};
                $scope.page = 1;
            }         

            $scope.getData = function(page){

                $scope.page = page;

                $scope.start = pagerService.setPage($scope.page,$scope.data_per_page);

                var getScheduleReport = "scheduleReportByUserId/"+$rootScope.u_id+"/"+$scope.start_date+"/"+$scope.end_date+"/"+$scope.start+"/"+$scope.data_per_page; 

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