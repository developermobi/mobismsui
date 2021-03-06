angular
    .module('altairApp')    
    .filter('decodeComponents', function() {
        return function(x) {
            return decodeURIComponent(x);
        };
    })
    .controller('customReportCtrl', [
        '$scope',
        '$rootScope',
        'apiGetData',
        'apiPostData',
        '$cookieStore',
        '$stateParams',
        'pagerService',
        'downloadUrl',
        '$window',
        function ($scope,$rootScope,apiGetData,apiPostData,$cookieStore,$stateParams,pagerService,downloadUrl,$window) {

           
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

                var getDailyReport = "compaignReportByUserId/"+$rootScope.u_id+"/"+$scope.start_date+"/"+$scope.end_date+"/"+$scope.start+"/"+$scope.data_per_page; 

                $scope.dailyReportData = {};

                apiGetData.async(getDailyReport).then(function(d) {
                    $scope.responseData = d;
                    //alert("hello data");
                    console.log('d data',d.data);
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                        angular.forEach(d.data.data, function(value, key) {
                            
                            if(d.data.data[key].messageType == 3){                                
                                var newString = decodeURIComponent(d.data.data[key].message);
                                d.data.data[key].message = newString;
                                console.log("neww message"+d.data.data[key].message);
                            }
                             if(d.data.data[key].jobType == 5){
                                 d.data.data[key].message = "Personalized message will be not show here.";
                             }

                        });
                        $scope.dailyReportData = $scope.data.data;

                        console.log('compaignReportByUserId data',$scope.dailyReportData);
                        
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

            $scope.reportCount = {
                DELIVERED : 0,
                SUBMITTED : 0,
                FAILED : 0,
                TOTAL : 0,
                jobId : 0
            };

            $scope.setReportCount = function(){
               $scope.reportCount = {
                    DELIVERED : 0,
                    SUBMITTED : 0,
                    FAILED : 0,
                    TOTAL : 0,
                    jobId : 0
                }; 
            }

            $scope.setReportCount();

            
            $scope.getReportCount = function (id) {

                $scope.setReportCount();

                var url = 'dlrStatusGroupBy/'+$rootScope.u_id+'/'+id;

                apiGetData.async(url).then(function(d) {
                    $scope.responseData = d.data;
                    console.log('responseData: ',$scope.responseData);

                    if($scope.responseData.code == 302){
                        if(isEmpty($scope.responseData.data) == false){
                            $scope.reportCount.DELIVERED = $scope.responseData.data.DELIVERED;
                            $scope.reportCount.SUBMITTED = $scope.responseData.data.SUBMITTED;
                            $scope.reportCount.FAILED = $scope.responseData.data.FAILED;
                            $scope.reportCount.jobId = id;

                            if($scope.reportCount.DELIVERED == undefined){
                                $scope.reportCount.DELIVERED = 0;
                            }

                            if($scope.reportCount.SUBMITTED == undefined){
                                $scope.reportCount.SUBMITTED = 0;
                            }

                            if($scope.reportCount.FAILED == undefined){
                                $scope.reportCount.FAILED = 0;
                            }

                            $scope.reportCount.TOTAL = $scope.reportCount.DELIVERED + $scope.reportCount.SUBMITTED + $scope.reportCount.FAILED;
                        }

                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.responseData.message);
                        modal.show();
                    }

                });
            };

            $scope.download = function(jobId,status){

                $scope.summary_status = '';

                if(status == 1){
                    $scope.summary_status = 'DELIVERED';
                }else if(status == 2){
                    $scope.summary_status = 'SUBMITTED';
                }else if(status == 3){
                    $scope.summary_status = 'FAILED';
                }

                $scope.requestData = {};
                $scope.requestData.userId = $rootScope.u_id;
                $scope.requestData.jobId = jobId;
                $scope.requestData.status = $scope.summary_status;

                var rdata = JSON.stringify($scope.requestData);

                var downloadReport = "dlrStausRepotExportDetails";               

                apiPostData.async(downloadReport,rdata).then(function(d) {
                    $scope.responseData = d.data; 
                    if($scope.responseData.code == 302){
                        $scope.fileName = $scope.responseData.fileName;
                        var url = downloadUrl + $scope.fileName;                         
                        $window.location.href = url;
                        
                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.responseData.message);
                        modal.show();
                    }
                });
            }

            $scope.searchData = function(){
                $scope.getData($scope.page);
            }

            $scope.resetDate = function(){
                $scope.setDate();
                $scope.getData($scope.page);
            } 

            function isEmpty(obj) {
                for(var prop in obj) {
                    if(obj.hasOwnProperty(prop))
                        return false;
                }
                return JSON.stringify(obj) === JSON.stringify({});
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