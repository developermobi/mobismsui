altairApp.config(function ($httpProvider) {
  $httpProvider.defaults.headers.common = {};
  $httpProvider.defaults.headers.post = {};
  $httpProvider.defaults.headers.put = {};
  $httpProvider.defaults.headers.patch = {};
  $httpProvider.defaults.headers.options = {};
  $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
});


altairApp.service('groupService', ['$http','$rootScope','$state','globalUrl', function ($http,$rootScope,$state,globalUrl) {

	var group = {
        async: function(url) {   
            var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Please wait...<br/><img class=\'uk-margin-top\' src=\'assets/img/spinners/spinner.gif\' alt=\'\'>');
            modal.show();
         
            var config = {
                    async: false,
                    transformRequest: angular.identity,
                    headers : {
                        'Content-Type': 'application/json',
                        'Process-Data': false,
                        'Authorization': $rootScope.auth_key                       
                    }
                }

            var url = globalUrl+"getActiveGroupByUserId/"+$rootScope.u_id;
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
    return group; 

}]);    