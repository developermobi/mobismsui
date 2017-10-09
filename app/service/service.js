altairApp.config(function ($httpProvider) {
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
    $httpProvider.defaults.headers.options = {};
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
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
                // console.log(response);
                // return false;
                return response.data.data;
            })
            .error(function(response){
                modal.hide();
                // console.log(response);
                // return false;
                UIkit.modal.alert(response.message);
                return response.data.data;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return apiLogin; 

}]);

altairApp.service('apiResetPwd', ['$http','$rootScope','$state','globalUrl', function ($http,$rootScope,$state,globalUrl) {

    var config = {
                    async: false,
                    transformRequest: angular.identity,
                    headers : {
                        'Content-Type': 'application/json',
                        'Process-Data': false
                    },
                    dataType: 'JSON'
                }

    var apiResetPwd = {
        async: function(url) {
            var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Please wait...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner.gif\' alt=\'\'>');
            modal.show();   

            url = globalUrl+url;
            var promise = $http.get(url, config)        
            .success(function(response){
                modal.hide();
                // console.log(response);
                // return false;
                return response.data;
            })
            .error(function(response){
                modal.hide();
                // console.log(response);
                // return false;
                UIkit.modal.alert(response.message);
                return response.data.data;
            });
            // Return the promise to the controller
            return promise;
        }
    };
    return apiResetPwd; 

}]);

altairApp.service('apiDownloadData', ['$http','$rootScope','$state','globalUrl','$cookieStore', function ($http,$rootScope,$state,globalUrl,$cookieStore) {

    var apiDownloadData = {
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
                //UIkit.modal.alert(response.message);
                return response.data;
            }); 

            // Return the promise to the controller
            return promise;
            //return window.open(promise, 'neuesDokument');
        }
    };
    return apiDownloadData; 
    
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
                //UIkit.modal.alert(response.message);
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

altairApp.service('pagerService', ['$rootScope','$state','$cookieStore','_', function ($rootScope,$state,$cookieStore,_) {

   
    var service = {};

    service.GetPager = GetPager;
    service.setPage = setPage;

    return service;

    // service implementation
    function GetPager(totalItems, currentPage, pageSize) {

        // default to first page
        currentPage = currentPage || 1;

        // default page size is 10
        pageSize = pageSize || 10;

        // calculate total pages
        var totalPages = Math.ceil(totalItems / pageSize);

        var startPage, endPage;
        if (totalPages <= 10) {
            // less than 10 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 10 total pages so calculate start and end pages
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            } else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            } else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }

        // calculate start and end item indexes
        var startIndex = (currentPage - 1) * pageSize;
        var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        var pages = _.range(startPage, endPage + 1);

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }

    function setPage(page,data_per_page){
        var s = 0;
        if(page > 1){
            s = page - 1;
        }
        return s * data_per_page;
    }

}]);   


altairApp.factory('AuthenticationService',
    ['$http', '$cookieStore', '$rootScope', '$timeout','$location',
    function ($http, $cookieStore, $rootScope, $timeout, $location) {
        var service = {};
   
        service.SetCredentials = function (data) {
            
            var auth_key = data['authorization'];
             
            $rootScope.globals = {
                currentUser: {
                    u_id: data['userId'],
                    u_name: data['userName'],
                    role: data['userRole'],
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

            for (var prop in $rootScope) {
                // Check is not $rootScope default properties, functions
                if (typeof $rootScope[prop] !== 'function' && prop.indexOf('$') == -1 && prop.indexOf('$$') == -1) {
                    delete $rootScope[prop];
                }
            } 
        };

        service.logout = function () {            
            service.ClearCredentials();
            $location.path('/');
        };
  
        return service;
}]);

altairApp.directive('fileModel', ['$parse', function ($parse) {
    return {
    restrict: 'A',
    link: function(scope, element, attrs) {
        var model = $parse(attrs.fileModel);
        var modelSetter = model.assign;

        element.bind('change', function(){
            scope.$apply(function(){
                modelSetter(scope, element[0].files[0]);
                console.log(element[0].files[0].name);

                scope.fileName = element[0].files[0].name;
            });
        });
    }
   };
}]);