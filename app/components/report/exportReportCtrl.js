angular
    .module('altairApp')    
    .controller('exportReportCtrl', [
        '$scope',
        '$rootScope',
        'apiGetData',
        'apiPostData',
        '$cookieStore',
        '$stateParams',
        'pagerService',
        '$window',
        '$timeout',
        'downloadUrl',
        function ($scope,$rootScope,apiGetData,apiPostData,$cookieStore,$stateParams,pagerService,$window,$timeout,downloadUrl) {

            var $dp_start = $('#uk_dp_start'),
                $dp_end = $('#uk_dp_end');

            var minDate1 = new Date();
            minDate1.setMonth(minDate1.getMonth() - 3);

            var date = new Date();
            date.setMonth( date.getMonth() - 2 );
            //alert((date.getMonth() ) + '/' + (date.getDate()) + '/' + (date.getFullYear()));

            minDate1 = (date.getFullYear()) + '-' + (date.getMonth()) + '-' + (date.getDate());

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

            $scope.download = function(download){

                var downloadReport = "archiveRepotMessage/"+$rootScope.u_id+"/"+download.start_date+"/"+download.end_date;               

                apiGetData.async(downloadReport).then(function(d) {
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
        }
    ]);