angular
    .module('altairApp')
    .controller('dashboardCtrl', [
        '$rootScope',
        '$scope',
        '$interval',
        '$timeout',
        'apiGetData',
        '$window',
        function ($rootScope,$scope,$interval,$timeout,apiGetData,$window) {

            if($rootScope.u_id == undefined)
            {
                window.location.reload();
            }

            $scope.dailyCount = {
                DELIVERED : 0,
                SUBMITED : 0,
                FAILED : 0,
                TOTAL : 0
            };
            $scope.weeklyCount = {
                DELIVERED : 0,
                SUBMITED : 0,
                FAILED : 0,
                TOTAL : 0
            };
            $scope.monthlyCount = {
                DELIVERED : 0,
                SUBMITED : 0,
                FAILED : 0,
                TOTAL : 0
            };

            $scope.getDashBoardCount = function(){

                var url = 'getDashboardCount/'+$rootScope.u_id;

                 apiGetData.async(url).then(function(d) {
                    $scope.responseData = d.data;
                    console.log('responseData: ',$scope.responseData);

                    if($scope.responseData.code == 302){
                        if(isEmpty($scope.responseData.todayCount) == false){
                            $scope.dailyCount.DELIVERED = $scope.responseData.todayCount.DELIVERED;
                            $scope.dailyCount.SUBMITED = $scope.responseData.todayCount.SUBMITED;
                            $scope.dailyCount.FAILED = $scope.responseData.todayCount.FAILED;

                            if($scope.dailyCount.DELIVERED == undefined){
                                $scope.dailyCount.DELIVERED = 0;
                            }

                            if($scope.dailyCount.SUBMITED == undefined){
                                $scope.dailyCount.SUBMITED = 0;
                            }

                            if($scope.dailyCount.FAILED == undefined){
                                $scope.dailyCount.FAILED = 0;
                            }

                            $scope.dailyCount.TOTAL = $scope.dailyCount.DELIVERED + $scope.dailyCount.SUBMITED + $scope.dailyCount.FAILED;
                        }

                        if(isEmpty($scope.responseData.weaklyCount) == false){
                            $scope.weeklyCount.DELIVERED = $scope.responseData.weaklyCount.DELIVERED;
                            $scope.weeklyCount.SUBMITED = $scope.responseData.weaklyCount.SUBMITED;
                            $scope.weeklyCount.FAILED = $scope.responseData.weaklyCount.FAILED;

                            if($scope.weeklyCount.DELIVERED == undefined){
                                $scope.weeklyCount.DELIVERED = 0;
                            }

                            if($scope.weeklyCount.SUBMITED == undefined){
                                $scope.weeklyCount.SUBMITED = 0;
                            }

                            if($scope.weeklyCount.FAILED == undefined){
                                $scope.weeklyCount.FAILED = 0;
                            }

                            $scope.weeklyCount.TOTAL = $scope.weeklyCount.DELIVERED + $scope.weeklyCount.SUBMITED + $scope.weeklyCount.FAILED;
                        }

                        console.log('monthlyCount length: ',isEmpty($scope.responseData.monthlyCount));

                        if(isEmpty($scope.responseData.monthlyCount) == false){
                            $scope.monthlyCount.DELIVERED = $scope.responseData.monthlyCount.DELIVERED;
                            $scope.monthlyCount.SUBMITED = $scope.responseData.monthlyCount.SUBMITED;
                            $scope.monthlyCount.FAILED = $scope.responseData.monthlyCount.FAILED;

                            if($scope.monthlyCount.DELIVERED == undefined){
                                $scope.monthlyCount.DELIVERED = 0;
                            }

                            if($scope.monthlyCount.SUBMITED == undefined){
                                $scope.monthlyCount.SUBMITED = 0;
                            }

                            if($scope.monthlyCount.FAILED == undefined){
                                $scope.monthlyCount.FAILED = 0;
                            }

                            $scope.monthlyCount.TOTAL = $scope.monthlyCount.DELIVERED + $scope.monthlyCount.SUBMITED + $scope.monthlyCount.FAILED;
                        }

                        console.log('dailyCount: ',$scope.dailyCount);
                        console.log('weeklyCount: ',$scope.weeklyCount);
                        console.log('monthlyCount: ',$scope.monthlyCount);

                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.responseData.message);
                        modal.show();
                    }
                });

            };

            $scope.getDashBoardCount();

            // donut chart
            var c3chart_donut_id = 'c3_chart_donut';

            if ( $('#'+c3chart_donut_id).length ) {

                var c3chart_donut = c3.generate({
                    bindto: '#'+c3chart_donut_id,
                    data: {
                        columns: [
                            ['data1', 0],
                            ['data2', 0]
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
                        pattern: ['#d62728', '#cfd8dc', '#2ca02c']
                    }
                });

                var c3chart_donut_waypoint = new Waypoint({
                    element: document.getElementById(c3chart_donut_id),
                    handler: function() {
                        setTimeout(function () {
                            var del_percent = (parseInt($scope.dailyCount.DELIVERED) / parseInt($scope.dailyCount.TOTAL)) * 100;
                            var fail_percent = (parseInt($scope.dailyCount.FAILED) / parseInt($scope.dailyCount.TOTAL)) * 100;
                            var sub_percent = (parseInt($scope.dailyCount.SUBMITED) / parseInt($scope.dailyCount.TOTAL)) * 100;
                            c3chart_donut.load({
                                columns: [
                                    ["DELIVERED", del_percent],
                                    ["FAILED", fail_percent],
                                    ["SUBMITED", sub_percent],
                                ]
                            });
                        }, 3000);

                        setTimeout(function () {
                            c3chart_donut.unload({
                                ids: 'data1'
                            });
                            c3chart_donut.unload({
                                ids: 'data2'
                            });
                        }, 2500);
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
                            ['data3', 0],
                            ['data4', 0]
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
                        pattern: ['#d62728', '#cfd8dc', '#2ca02c']
                    }
                });

                var c3chart_donut_waypoint = new Waypoint({
                    element: document.getElementById(c3chart_donut_id2),
                    handler: function() {
                        setTimeout(function () {
                            var del_percent = (parseInt($scope.weeklyCount.DELIVERED) / parseInt($scope.weeklyCount.TOTAL)) * 100;
                            var fail_percent = (parseInt($scope.weeklyCount.FAILED) / parseInt($scope.weeklyCount.TOTAL)) * 100;
                            var sub_percent = (parseInt($scope.weeklyCount.SUBMITED) / parseInt($scope.weeklyCount.TOTAL)) * 100;
                            c3chart_donut2.load({
                                columns: [
                                    ["DELIVERED", del_percent],
                                    ["FAILED", fail_percent],
                                    ["SUBMITED", sub_percent],
                                ]
                            });
                        }, 3000);

                        setTimeout(function () {
                            c3chart_donut2.unload({
                                ids: 'data3'
                            });
                            c3chart_donut2.unload({
                                ids: 'data4'
                            });
                        }, 2500);
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
                            ['data5', 0],
                            ['data6', 0]
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
                        pattern: ['#d62728', '#cfd8dc', '#2ca02c']
                    }
                });

                var c3chart_donut_waypoint = new Waypoint({
                    element: document.getElementById(c3chart_donut_id3),
                    handler: function() {
                        setTimeout(function () {
                            var del_percent = (parseInt($scope.monthlyCount.DELIVERED) / parseInt($scope.monthlyCount.TOTAL)) * 100;
                            var fail_percent = (parseInt($scope.monthlyCount.FAILED) / parseInt($scope.monthlyCount.TOTAL)) * 100;
                            var sub_percent = (parseInt($scope.monthlyCount.SUBMITED) / parseInt($scope.monthlyCount.TOTAL)) * 100;
                            console.log('del_percent:',del_percent);
                            console.log('fail_percent:',fail_percent);
                            console.log('sub_percent:',sub_percent);
                            c3chart_donut3.load({
                                columns: [
                                    ["DELIVERED", del_percent],
                                    ["FAILED", fail_percent],
                                    ["SUBMITED", sub_percent],
                                ]
                            });
                        }, 3000);

                        setTimeout(function () {
                            c3chart_donut3.unload({
                                ids: 'data5'
                            });
                            c3chart_donut3.unload({
                                ids: 'data6'
                            });
                        }, 2500);
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