angular
    .module('altairApp')    
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

            var $dp_report = $('#uk_dp_1');

            var dp_report = UIkit.datepicker($dp_report, {
                format:'YYYY-MM-DD',
                maxDate: new Date()
            });

            var date = new Date();

            date.setMonth( date.getMonth() + 1 );

            var defaultDate = (date.getFullYear()) + '-' + (date.getMonth()) + '-' + (date.getDate());

            $scope.custom_report_date = defaultDate;
            
            $scope.data_per_page = $scope.no_of_data.options[0].value;          

            $scope.getData = function(page){

                $scope.page = page;

                $scope.start = pagerService.setPage($scope.page,$scope.data_per_page);

                var getDailyReport = "compaignReportByUserId/"+$rootScope.u_id+"/"+$scope.custom_report_date+"/"+$scope.start+"/"+$scope.data_per_page; 

                $scope.dailyReportData = {};

                apiGetData.async(getDailyReport).then(function(d) {
                    $scope.responseData = d;
                    //alert("hello data");
                    console.log('d data',d);
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                        $scope.dailyReportData = $scope.data.data;
                        console.log('compaignReportByUserId data',$scope.dailyReportData);
                        
                        $scope.pagination = pagerService.GetPager($scope.data.total,$scope.page,$scope.data_per_page);
                        console.log($scope.pagination);
                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                        modal.show();
                    }
                });           
            }  

            $scope.getData($scope.page);

            $scope.reportCount = {
                DELIVERED : 0,
                SUBMITED : 0,
                FAILED : 0,
                TOTAL : 0,
                jobId : 0
            };

            
            $scope.getReportCount = function (id) {

                var url = 'dlrStatusGroupBy/'+$rootScope.u_id+'/'+id;

                apiGetData.async(url).then(function(d) {
                    $scope.responseData = d.data;
                    console.log('responseData: ',$scope.responseData);

                    if($scope.responseData.code == 302){
                        if(isEmpty($scope.responseData.data) == false){
                            $scope.reportCount.DELIVERED = $scope.responseData.data.DELIVERED;
                            $scope.reportCount.SUBMITED = $scope.responseData.data.SUBMITED;
                            $scope.reportCount.FAILED = $scope.responseData.data.FAILED;
                            $scope.reportCount.jobId = id;

                            if($scope.reportCount.DELIVERED == undefined){
                                $scope.reportCount.DELIVERED = 0;
                            }

                            if($scope.reportCount.SUBMITED == undefined){
                                $scope.reportCount.SUBMITED = 0;
                            }

                            if($scope.reportCount.FAILED == undefined){
                                $scope.reportCount.FAILED = 0;
                            }

                            $scope.reportCount.TOTAL = $scope.reportCount.DELIVERED + $scope.reportCount.SUBMITED + $scope.reportCount.FAILED;
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
                    $scope.summary_status = 'SUBMITED';
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
                console.log('custom_report_date',$scope.custom_report_date);
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