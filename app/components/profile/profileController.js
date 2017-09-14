angular
.module('altairApp')
.controller('profileCtrl', [
    '$scope',
    '$rootScope',
    'apiGetData',
    'apiPostData',
    '$cookieStore',
    function($scope, $rootScope,apiGetData,apiPostData,$cookieStore){

        $scope.profile = {};
        $scope.userData ="";
        $scope.passwordFlag = true;        

        getData();
        getUserBalance();

        function getData(){
            var getUserDetails = "getUserById/"+$rootScope.u_id;                

            apiGetData.async(getUserDetails).then(function(d) {
                $scope.responseData = d;
                    /*alert("hello data");
                    console.log('d data',d);*/
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                        $scope.userData = $scope.data.data[0].userId;
                        
                        console.log("getUserById: ",$scope.userData);
                        console.log($scope.userData.name);
                    }
                });
        }
        function getUserBalance()
        {

            var getUserBalanceDetails = "getBalanceByUserId/"+$rootScope.u_id;                

            apiGetData.async(getUserBalanceDetails).then(function(d) {
                $scope.responseData = d;

                $scope.data = $scope.responseData.data;

                if($scope.data.code == 302){

                    $scope.userBalanceData = $scope.data.data;  
                        //$scope.userProduct = $scope.userBalanceData[0]['userProduct'];                     
                        console.log($scope.userBalanceData);
                        //console.log($scope.userProduct);
                    }
                });

        }
        $scope.updateUserDetails = function(userdata){
            
            var userDetailsData = JSON.stringify(userdata);               
            var updateUserDetails = "updateUserById/"+$rootScope.u_id;

            //alert($scope.profileBtnFlag);

            if($scope.profileBtnFlag == 0){

                apiPostData.async(updateUserDetails, userDetailsData).then(function(d) {
                    $scope.data = d.data;
                    if($scope.data.code == 200){
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Data Updated Successfully');
                        modal.show();
                           // getData();
                        setTimeout(function(){
                            modal.hide();
                            getData();
                        },3000);
                    }
                    else if($scope.data.code == 400)
                    {
                        UIkit.modal.alert('Somethig Going Worng........');
                    }
                });

            }else if($scope.profileBtnFlag == 1){

                if($scope.passwordFlag == false){
                    return false;
                }
                alert("change pwd");
                console.log("On Change Pwd: ",userdata);
            }

            
        };

        $scope.profileBtnFlag = 0;

        $scope.setProfileBtnFlag = function(flag){
            $scope.profileBtnFlag = flag;
        }

    }
    ])
    .directive('passwordVerify', passwordVerify);
    

function passwordVerify(){
    return{
        restrict: 'A',
        require: '?ngModel',
        link: function(scope, elem, attrs, ngModel){

            if(!ngModel) return;

            scope.$watch(attrs.ngModel, function(){
                validate();
            });

            attrs.$observe('passwordVerify', function(val){
                validate();
            });

            var validate = function(){

                var val1 = ngModel.$viewValue;
                var val2 = attrs.passwordVerify;

                if(val1 != undefined){
                    scope.passwordFlag = val1 === val2;
                }                
            };
        }
    }
}

