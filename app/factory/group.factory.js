angular
    .module('altairApp')
    .config(function ($httpProvider) {
	  $httpProvider.defaults.headers.common = {};
	  $httpProvider.defaults.headers.post = {};
	  $httpProvider.defaults.headers.put = {};
	  $httpProvider.defaults.headers.patch = {};
	  $httpProvider.defaults.headers.options = {};
	  $httpProvider.defaults.useXDomain = true;
	    //delete $httpProvider.defaults.headers.common['X-Requested-With'];
	});

angular
    .module('altairApp')
    .factory('groupFactory', ['$http','$rootScope','$state','globalUrl','$cookieStore', function($http,$rootScope,$state,globalUrl,$cookieStore){

	$rootScope.globals = $cookieStore.get('globals') || {};
    $rootScope.u_id = $rootScope.globals.currentUser.userId;

	return {
		getGroupData: function() {
			var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Please wait...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner.gif\' alt=\'\'>');
            modal.show();

            var cookieData = $cookieStore.get('globals');
            var getGroup = "getGroupByUserId/"+$rootScope.u_id;
            var config = {
                    async: false,
                    transformRequest: angular.identity,
                    headers : {
                        'Content-Type': 'application/json',
                        'Process-Data': false,
                        'Authorization': cookieData['currentUser']['auth_key']                        
                    }
                }

            url = globalUrl+getGroup;
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

            // Return the promise
            return promise;
		}
	}

}]);