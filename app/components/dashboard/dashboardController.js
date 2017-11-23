angular
    .module('altairApp')
    .controller('dashboardCtrl', [
        '$rootScope',
        '$scope',
        '$interval',
        '$timeout',
        'apiGetData',
        '$window',
        '$q',
        function ($rootScope,$scope,$interval,$timeout,apiGetData,$window,$q) {

            if($rootScope.u_id == undefined)
            {
                window.location.reload();
            }

            $scope.dailyCount = {
                DELIVERED : 0,
                SUBMITTED : 0,
                FAILED : 0,
                TOTAL : 0
            };
            $scope.weeklyCount = {
                DELIVERED : 0,
                SUBMITTED : 0,
                FAILED : 0,
                TOTAL : 0
            };
            $scope.monthlyCount = {
                DELIVERED : 0,
                SUBMITTED : 0,
                FAILED : 0,
                TOTAL : 0
            };
            
            $scope.defer = null;

            $scope.getDashBoardCount = function(){

                $scope.defer = $q.defer();

                var url = 'getDashboardCount/'+$rootScope.u_id;

                apiGetData.async(url).then(function(d) {
                    $scope.responseData = d.data;
                    console.log('responseData: ',$scope.responseData);
                   
                    if($scope.responseData.code == 302){

                        if(isEmpty($scope.responseData.todayCount) == false){

                            $scope.dailyCount.DELIVERED = $scope.responseData.todayCount.DELIVERED;
                            $scope.dailyCount.SUBMITTED = $scope.responseData.todayCount.SUBMITTED;
                            $scope.dailyCount.FAILED = $scope.responseData.todayCount.FAILED;

                            if($scope.dailyCount.DELIVERED == undefined){
                                $scope.dailyCount.DELIVERED = 0;
                            }

                            if($scope.dailyCount.SUBMITTED == undefined){
                                $scope.dailyCount.SUBMITTED = 0;
                            }

                            if($scope.dailyCount.FAILED == undefined){
                                $scope.dailyCount.FAILED = 0;
                            }

                            $scope.dailyCount.TOTAL = $scope.dailyCount.DELIVERED + $scope.dailyCount.SUBMITTED + $scope.dailyCount.FAILED;

                        }

                        if(isEmpty($scope.responseData.weaklyCount) == false){
                            $scope.weeklyCount.DELIVERED = $scope.responseData.weaklyCount.DELIVERED;
                            $scope.weeklyCount.SUBMITTED = $scope.responseData.weaklyCount.SUBMITTED;
                            $scope.weeklyCount.FAILED = $scope.responseData.weaklyCount.FAILED;

                            if($scope.weeklyCount.DELIVERED == undefined){
                                $scope.weeklyCount.DELIVERED = 0;
                            }

                            if($scope.weeklyCount.SUBMITTED == undefined){
                                $scope.weeklyCount.SUBMITTED = 0;
                            }

                            if($scope.weeklyCount.FAILED == undefined){
                                $scope.weeklyCount.FAILED = 0;
                            }

                            $scope.weeklyCount.TOTAL = $scope.weeklyCount.DELIVERED + $scope.weeklyCount.SUBMITTED + $scope.weeklyCount.FAILED;
                        }

                        //console.log('monthlyCount length: ',isEmpty($scope.responseData.monthlyCount));

                        if(isEmpty($scope.responseData.monthlyCount) == false){
                            $scope.monthlyCount.DELIVERED = $scope.responseData.monthlyCount.DELIVERED;
                            $scope.monthlyCount.SUBMITTED = $scope.responseData.monthlyCount.SUBMITTED;
                            $scope.monthlyCount.FAILED = $scope.responseData.monthlyCount.FAILED;

                            if($scope.monthlyCount.DELIVERED == undefined){
                                $scope.monthlyCount.DELIVERED = 0;
                            }

                            if($scope.monthlyCount.SUBMITTED == undefined){
                                $scope.monthlyCount.SUBMITTED = 0;
                            }

                            if($scope.monthlyCount.FAILED == undefined){
                                $scope.monthlyCount.FAILED = 0;
                            }

                            $scope.monthlyCount.TOTAL = $scope.monthlyCount.DELIVERED + $scope.monthlyCount.SUBMITTED + $scope.monthlyCount.FAILED;
                        }

                        // console.log('dailyCount: ',$scope.dailyCount);
                        // console.log('weeklyCount: ',$scope.weeklyCount);
                        // console.log('monthlyCount: ',$scope.monthlyCount);

                    }else{
                        /*var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.responseData.message);
                        modal.show();*/
                    }

                    // var balance_url = 'getBalanceByUserId/'+$rootScope.u_id;

                    // apiGetData.async(balance_url).then(function(d) {
                    //     $scope.responseBalanceData = d.data;
                    //     console.log('responseBalanceData: ',$scope.responseBalanceData);

                    //     if($scope.responseBalanceData.code == 302){
                            
                    //         console.log('responseBalanceData length',$scope.responseBalanceData.data.length);
                    //         $scope.balanceData = $scope.responseBalanceData.data;
                    //         $.each($scope.balanceData,function(i){
                                
                    //             console.log('balanceData[i]: ',$scope.balanceData[i]);
                    //             if($scope.balanceData[i].productId.id == 1){
                    //                 $rootScope.userBalance.transactional = $scope.balanceData[i].balance;
                    //             }else if($scope.balanceData[i].productId.id == 2){
                    //                 $rootScope.userBalance.promotional = $scope.balanceData[i].balance;
                    //             }

                    //         });
                    //     }
                    //     else{
                    //         var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.responseBalanceData.message);
                    //         modal.show();
                    //     }
                    // });

                    $scope.defer.resolve();
                });

            };

            $scope.getDashBoardCount();

            $scope.defer.promise.then(function(){
                createChart(); 
            });

            function createChart(){

                // donut chart
                var c3chart_donut_id = 'c3_chart_donut';

                if ( $('#'+c3chart_donut_id).length ) {

                    var c3chart_donut = c3.generate({
                        bindto: '#'+c3chart_donut_id,
                        data: {
                            columns: [
                                ['Delivered', 0],
                                ['Submitted', 0]
                            ],
                            type : 'donut',
                            onclick: function (d, i) { console.log("onclick", d, i); },
                            onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                            onmouseout: function (d, i) { console.log("onmouseout", d, i); }
                        },
                        donut: {
                            title: "",
                            width: 40
                        },
                        color: {
                            pattern: ['#ef5350', '#ffd54f', '#66bb6a']
                        }
                    });

                    var c3chart_donut_waypoint = new Waypoint({
                        element: document.getElementById(c3chart_donut_id),
                        handler: function() {
                            setTimeout(function () {
                                var del_percent = (parseInt($scope.dailyCount.DELIVERED) / parseInt($scope.dailyCount.TOTAL)) * 100;
                                var fail_percent = (parseInt($scope.dailyCount.FAILED) / parseInt($scope.dailyCount.TOTAL)) * 100;
                                var sub_percent = (parseInt($scope.dailyCount.SUBMITTED) / parseInt($scope.dailyCount.TOTAL)) * 100;
                                c3chart_donut.load({
                                    columns: [
                                        ["DELIVERED", del_percent],
                                        ["FAILED", fail_percent],
                                        ["SUBMITTED", sub_percent],
                                    ]
                                });
                            }, 1500);

                            setTimeout(function () {
                                c3chart_donut.unload({
                                    ids: 'Delivered'
                                });
                                c3chart_donut.unload({
                                    ids: 'Submitted'
                                });
                            }, 1000);
                            this.destroy();
                        },
                        offset: '80%'
                    });

                    $($window).on('debouncedresize', c3chart_donut.resize());

                    $scope.$on('$destroy', function () {
                        $($window).off('debouncedresize', c3chart_donut.resize());
                        c3chart_donut_waypoint.destroy();
                    });

                }

                var c3chart_donut_id2 = 'c3_chart_donut2';

                if ( $('#'+c3chart_donut_id2).length ) {

                    var c3chart_donut2 = c3.generate({
                        bindto: '#'+c3chart_donut_id2,
                        data: {
                            columns: [
                                ['Delivered', 0],
                                ['Submitted', 0]
                            ],
                            type : 'donut',
                            onclick: function (d, i) { console.log("onclick", d, i); },
                            onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                            onmouseout: function (d, i) { console.log("onmouseout", d, i); }
                        },
                        donut: {
                            title: "",
                            width: 40
                        },
                        color: {
                            pattern: ['#ef5350', '#ffd54f', '#66bb6a']
                        }
                    });

                    var c3chart_donut_waypoint = new Waypoint({
                        element: document.getElementById(c3chart_donut_id2),
                        handler: function() {
                            setTimeout(function () {
                                var del_percent = (parseInt($scope.weeklyCount.DELIVERED) / parseInt($scope.weeklyCount.TOTAL)) * 100;
                                var fail_percent = (parseInt($scope.weeklyCount.FAILED) / parseInt($scope.weeklyCount.TOTAL)) * 100;
                                var sub_percent = (parseInt($scope.weeklyCount.SUBMITTED) / parseInt($scope.weeklyCount.TOTAL)) * 100;
                                c3chart_donut2.load({
                                    columns: [
                                        ["DELIVERED", del_percent],
                                        ["FAILED", fail_percent],
                                        ["SUBMITTED", sub_percent],
                                    ]
                                });
                            }, 1500);

                            setTimeout(function () {
                                c3chart_donut2.unload({
                                    ids: 'Delivered'
                                });
                                c3chart_donut2.unload({
                                    ids: 'Submitted'
                                });
                            }, 1000);
                            this.destroy();
                        },
                        offset: '80%'
                    });

                    $($window).on('debouncedresize', c3chart_donut2.resize());

                    $scope.$on('$destroy', function () {
                        $($window).off('debouncedresize', c3chart_donut2.resize());
                        c3chart_donut_waypoint.destroy();
                    });

                }

                var c3chart_donut_id3 = 'c3_chart_donut3';

                if ( $('#'+c3chart_donut_id3).length ) {

                    var c3chart_donut3 = c3.generate({
                        bindto: '#'+c3chart_donut_id3,
                        data: {
                            columns: [
                                ['Delivered', 0],
                                ['Submitted', 0]
                            ],
                            type : 'donut',
                            onclick: function (d, i) { console.log("onclick", d, i); },
                            onmouseover: function (d, i) { console.log("onmouseover", d, i); },
                            onmouseout: function (d, i) { console.log("onmouseout", d, i); }
                        },
                        donut: {
                            title: "",
                            width: 40
                        },
                        color: {
                            pattern: ['#ef5350', '#ffd54f', '#66bb6a']
                        }
                    });

                    var c3chart_donut_waypoint = new Waypoint({
                        element: document.getElementById(c3chart_donut_id3),
                        handler: function() {
                            setTimeout(function () {
                                var del_percent = (parseInt($scope.monthlyCount.DELIVERED) / parseInt($scope.monthlyCount.TOTAL)) * 100;
                                var fail_percent = (parseInt($scope.monthlyCount.FAILED) / parseInt($scope.monthlyCount.TOTAL)) * 100;
                                var sub_percent = (parseInt($scope.monthlyCount.SUBMITTED) / parseInt($scope.monthlyCount.TOTAL)) * 100;
                                console.log('del_percent:',del_percent);
                                console.log('fail_percent:',fail_percent);
                                console.log('sub_percent:',sub_percent);
                                c3chart_donut3.load({
                                    columns: [
                                        ["DELIVERED", del_percent],
                                        ["FAILED", fail_percent],
                                        ["SUBMITTED", sub_percent],
                                    ]
                                });
                            }, 1500);

                            setTimeout(function () {
                                c3chart_donut3.unload({
                                    ids: 'Delivered'
                                });
                                c3chart_donut3.unload({
                                    ids: 'Submitted'
                                });
                            }, 1000);
                            this.destroy();
                        },
                        offset: '80%'
                    });

                    $($window).on('debouncedresize', c3chart_donut3.resize());

                    $scope.$on('$destroy', function () {
                        $($window).off('debouncedresize', c3chart_donut3.resize());
                        c3chart_donut_waypoint.destroy();
                    });

                }
            }
            

            function isEmpty(obj) {
                for(var prop in obj) {
                    if(obj.hasOwnProperty(prop))
                        return false;
                }

                return JSON.stringify(obj) === JSON.stringify({});
            }
                 
        }
    ])   
;