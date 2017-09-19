angular
    .module('altairApp')
    .controller('loginCtrl', [
        '$scope',
        '$rootScope',
        'utils',
        'apiLogin',
        '$location', 
        'AuthenticationService',
        '$cookieStore',
        '$window',
        function ($scope,$rootScope,utils,apiLogin,$location,AuthenticationService,$cookieStore,$window) {

            // reset login status
            //AuthenticationService.ClearCredentials();
            if(AuthenticationService.isLoggedIn() == true){                
                $location.path('dashboard');
                return false;  
            }

            AuthenticationService.ClearCredentials();

            $scope.registerFormActive = false;

            var $login_card = $('#login_card'),
                $login_form = $('#login_form'),
                $login_help = $('#login_help'),
                $register_form = $('#register_form'),
                $login_password_reset = $('#login_password_reset');

            // show login form (hide other forms)
            var login_form_show = function() {
                $login_form
                    .show()
                    .siblings()
                    .hide();
            };

            // show register form (hide other forms)
            var register_form_show = function() {
                $register_form
                    .show()
                    .siblings()
                    .hide();
            };

            // show login help (hide other forms)
            var login_help_show = function() {
                $login_help
                    .show()
                    .siblings()
                    .hide();
            };

            // show password reset form (hide other forms)
            var password_reset_show = function() {
                $login_password_reset
                    .show()
                    .siblings()
                    .hide();
            };

            $scope.loginHelp = function($event) {
                $event.preventDefault();
                utils.card_show_hide($login_card,undefined,login_help_show,undefined);
            };

            $scope.backToLogin = function($event) {
                $event.preventDefault();
                $scope.registerFormActive = false;
                utils.card_show_hide($login_card,undefined,login_form_show,undefined);
            };

            $scope.registerForm = function($event) {
                $event.preventDefault();
                $scope.registerFormActive = true;
                utils.card_show_hide($login_card,undefined,register_form_show,undefined);
            };

            $scope.passwordReset = function($event) {
                $event.preventDefault();
                utils.card_show_hide($login_card,undefined,password_reset_show,undefined);
            };

            $scope.submitSignIn = function(login){  
            
                var loginData = JSON.stringify(login);
                //console.log(loginData);
                var loginApi = "user/login";
                apiLogin.async(loginApi, loginData).then(function(d) {
                    //console.log(d);
                    //return false;
                    $scope.responseData = d.data;
                    if($scope.responseData.status == 302){
                        // console.log($scope.responseData);
                        // return false;
                        AuthenticationService.SetCredentials($scope.responseData.data);
                        //window.location.reload();
                        $location.path('dashboard');                        
                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                        modal.show();
                    }
                    //console.log($scope.responseData);
                }); 
            }

        }
    ]);