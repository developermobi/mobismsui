angular
    .module('altairApp')
    .controller('senderIdCtrl', [
        '$scope',
        '$rootScope',
        'apiPostData',
        '$cookieStore',
        function ($scope,$rootScope,apiPostData,$cookieStore) {
            $rootScope.globals = $cookieStore.get('globals') || {};
            $rootScope.u_id = $rootScope.globals.currentUser.u_id;

            alert($rootScope.u_id);
            $scope.sender = {};
            $scope.saveSenderId = function(sender) {   
                var addSender = "saveSenderId";  
                var senderData = sender;
                senderData.userId = $rootScope.u_id;
                senderData.status = 1;
                senderData = JSON.stringify(senderData);

                console.log(senderData);
                
                apiPostData.async(addSender, senderData).then(function(d) {
                    console.log(d);
                    
                    //console.log($scope.responseData);
                });            
            }; 


        }
    ]);