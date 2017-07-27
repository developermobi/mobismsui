altairApp.config(function ($httpProvider) {
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
  $httpProvider.defaults.headers.options = {};
  $httpProvider.defaults.useXDomain = true;
    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

altairApp.service('apiLogin', ['$http','$rootScope','$state','globalUrl', function ($http,$rootScope,$state,globalUrl) {

    var config = {
                    async: false,
                    transformRequest: angular.identity,
                    headers : {
                        'Content-Type': 'application/json',
                        'Process-Data': false
                    },
                    dataType: 'JSON'
                }

    var apiLogin = {
        async: function(url,data) {
            var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Please wait...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner.gif\' alt=\'\'>');
            modal.show();   

            url = globalUrl+url;
            var promise = $http.post(url, data, config)        
            .success(function(response){
                modal.hide();
                //console.log(response);
                return response.data.data;
            })
            .error(function(response){
                modal.hide();
                //console.log(response);
                UIkit.modal.alert(response.message);
                return response.data.data;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return apiLogin; 

}]);

altairApp.service('apiPostData', ['$http','$rootScope','$state','globalUrl','$cookieStore', function ($http,$rootScope,$state,globalUrl,$cookieStore) {

    var apiPostData = {
        async: function(url,data) {
            var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Please wait...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner.gif\' alt=\'\'>');
            modal.show(); 

            var cookieData = $cookieStore.get('globals');

            var config = {
                            async: false,
                            transformRequest: angular.identity,
                            headers : {
                                'Content-Type': 'application/json',
                                'Process-Data': false,
                                'Authorization': cookieData['currentUser']['auth_key']
                            },
                            dataType: 'JSON'
                        }  

            url = globalUrl+url;
            var promise = $http.post(url, data, config)        
            .success(function(response){
                modal.hide();
                //console.log(response);
                return response.data;
            })
            .error(function(response){
                modal.hide();
                console.log(response);
                UIkit.modal.alert(response.message);
                return response;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return apiPostData; 

}]);

altairApp.service('apiGetData', ['$http','$rootScope','$state','globalUrl','$cookieStore', function ($http,$rootScope,$state,globalUrl,$cookieStore) {

    var apiGetData = {
        async: function(url) {   
            var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Please wait...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner.gif\' alt=\'\'>');
            modal.show();

            var cookieData = $cookieStore.get('globals');

            var config = {
                    async: false,
                    transformRequest: angular.identity,
                    headers : {
                        'Content-Type': 'application/json',
                        'Process-Data': false,
                        'Authorization': cookieData['currentUser']['auth_key']                        
                    }
                }

            url = globalUrl+url;
            var promise = $http.get(url,config)
            .success(function(response){
                modal.hide();
                //console.log(response);
                return response.data;
            })
            .error(function(response){
                modal.hide();
                //console.log(response);
                UIkit.modal.alert(response.message);
                return response.data;
            }); 

            // Return the promise to the controller
            return promise;
        }
    };
    return apiGetData; 
    
}]);

altairApp.service('apiFileUpload', ['$http','$rootScope','$state','globalUrl','$cookieStore', function ($http,$rootScope,$state,globalUrl,$cookieStore) {

    var apiFileUpload = {
        async: function(url,data) {
            var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Please wait...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner.gif\' alt=\'\'>');
            modal.show(); 

            var cookieData = $cookieStore.get('globals');

            var config = {
                            async: false,
                            transformRequest: angular.identity,
                            headers : {
                                'Content-Type': undefined,
                                'Process-Data': false,
                                'Authorization': cookieData['currentUser']['auth_key']
                            },
                            dataType: 'JSON'
                        }  

            url = globalUrl+url;
           
            var promise = $http.post(url, data, config)        
            .success(function(response){
                modal.hide();
                console.log(response);
                return response.data;
            })
            .error(function(response){
                modal.hide();
                console.log(response);
                UIkit.modal.alert(response.message);
                return response;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return apiFileUpload; 

}]);


altairApp.factory('AuthenticationService',
    ['$http', '$cookieStore', '$rootScope', '$timeout','$location',
    function ($http, $cookieStore, $rootScope, $timeout, $location) {
        var service = {};
   
        service.SetCredentials = function (data) {
            
            var auth_key = data['auth_key'];
             
            $rootScope.globals = {
                currentUser: {
                    userId: data['id'],
                    auth_key: auth_key
                }
            };
            
            $cookieStore.put('globals', $rootScope.globals);            
            
        };

        service.isLoggedIn = function () {
            
            if (typeof $cookieStore.get('globals') === 'undefined'){
                return false;
            } else {
                return true;
            }
        };
        
        service.ClearCredentials = function () {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';
        };

        service.logout = function () {            
            service.ClearCredentials();
            $location.path('/');
        };
  
        return service;
    }]);