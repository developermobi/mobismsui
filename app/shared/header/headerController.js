angular
    .module('altairApp')
    .controller('loginCtrl', [
        '$scope',
        '$rootScope',
        '$location', 
        'AuthenticationService',
        '$cookieStore',
        function ($scope,$rootScope,$location,AuthenticationService,$cookieStore) {

            // reset login status
            //AuthenticationService.ClearCredentials();
            if(AuthenticationService.isLoggedIn() == false){                
                $location.path('/');
                return false;  
            }

            $scope.submitSignOut = function(){                
                AuthenticationService.ClearCredentials();
                $location.path('/');
            }

        }
    ]);