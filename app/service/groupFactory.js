altairApp.config(function ($httpProvider) {
	$httpProvider.defaults.headers.common = {};
	$httpProvider.defaults.headers.post = {};
	$httpProvider.defaults.headers.put = {};
	$httpProvider.defaults.headers.patch = {};
	$httpProvider.defaults.headers.options = {};
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

var config = {
                async: false,
                transformRequest: angular.identity,
                headers : {
                    'Content-Type': 'application/json',
                    'Process-Data': false
                },
                dataType: 'JSON'
            }

altairApp
	.factory('group', [
        '$http','$rootScope','$state','globalUrl',
        function($http,$rootScope,$state,globalUrl) {

		    var group = {};

		    group.all = function () {

		        var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Please wait...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner.gif\' alt=\'\'>');
	            modal.show();   

	            var url = globalUrl+"getActiveGroupByUserId/"+$rootScope.u_id;

	            return {
	            	
	            }
	            
		    };

		    group.paginate = function (stud) {
		        return $http.post(urlBase + '/AddStudent', stud);
		    };
		    return group;
        }
    ]);