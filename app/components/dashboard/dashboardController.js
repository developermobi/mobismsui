angular
    .module('altairApp')
    .controller('dashboardCtrl', [
        '$rootScope',
        '$scope',
        '$interval',
        '$timeout',
        function ($rootScope,$scope,$interval,$timeout) {

            if($rootScope.u_id == undefined)
            {
                window.location.reload();
            }
                 
        }
    ])   
;