angular
    .module('altairApp')
    .controller('senderIdCtrl', [
        '$scope',
        '$rootScope',
        'apiGetData',
        'apiPostData',
        '$cookieStore', 
        '$compile',
        function ($scope,$rootScope,apiGetData,apiPostData,$cookieStore,$compile) {
            $rootScope.globals = $cookieStore.get('globals') || {};
            $rootScope.u_id = $rootScope.globals.currentUser.u_id;

            /*alert($rootScope.u_id);*/
            $scope.sender = {};
            $scope.senderEdited = {};

            getData();
            function getData(){
                
                var getSender = "getAllSenderId/"+$rootScope.u_id;                

                apiGetData.async(getSender).then(function(d) {
                    $scope.responseData = d;
                    /*alert("hello data");
                    console.log('d data',d);*/
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                        $scope.userSenderData = $scope.data.data;
                        console.log($scope.userSenderData[0]);
                    }
                });
            };     

            $scope.saveSenderId = function(sender) {   
                var addSender = "saveSenderId";  
                var senderData = sender;
                senderData.userId = $rootScope.u_id;
                senderData.status = 1;
                senderData = JSON.stringify(senderData);

                //console.log(senderData);
                
                apiPostData.async(addSender, senderData).then(function(d) {
                   // console.log(d);
                    $scope.responseData = d.data;
                    if($scope.responseData.code == 201){
                        var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Successfully Add Sender Id');
                        modal.show();
                        getData();
                        setTimeout(function(){
                            modal.hide();
                        },3000);

                    }else if($scope.responseData.code == 406){
                        var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Please Enter valid sender id');
                        modal.show();
                        setTimeout(function(){
                            modal.hide();
                        },3000);
                    }
                    else if($scope.responseData.code == 400){
                        var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Somethig going worng');
                        modal.show();
                        setTimeout(function(){
                            modal.hide();
                        },3000);
                    }
                    else{
                        var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Invalid  Token Credentials');
                        modal.show();
                        setTimeout(function(){
                            modal.hide();
                        },3000);
                    }
                    //console.log($scope.responseData);
                });            
            }; 

            $scope.deleteSenderId = function(id){   
                alert(id);
                UIkit.modal.confirm('Are you sure want to delete this group?', function(){                     
                    var deleteSenderData = "deleteSenderId/"+id;

                    apiGetData.async(deleteSenderData).then(function(d) {
                        $scope.responseData = d;
                        $scope.data = $scope.responseData.data;
                        if($scope.data.code == 200){
                            getData();
                            UIkit.modal.alert('Data Deleted Successfully');
                        }
                    });
                });                
            };

            $scope.editFlag = true;

            $scope.editSender = function(id){
                
                if($scope.editFlag == true){
                    var element = $(".senderIdtd"+id).text();
                    var html = '<input type="text" class="md-input" ng-modal="senderEdited.senderId" value="'+element+'" md-input>'+
                                '<div class="md-card-toolbar-actions">'+
                                    '<i ng-click="removeTexBox()" data-uk-tooltip={pos:"bottom"} title="Click to cancel" class="removeTexBox md-icon material-icons md-color-blue-grey-500">&#xE14C;</i>'+
                                    '<i data-uk-tooltip={pos:"bottom"} title="Click to save" class="saveSenderId md-icon material-icons md-color-light-blue-500">&#xE161;</i>'+
                                '</div>';

                    $compile(html)($scope);           
                    $(".senderIdtd"+id).html(html);
                    
                    console.log(element);
                }
                
                $scope.editFlag = false;
                
            };
          

            $scope.removeTexBox = function(){
                alert();
                // if($scope.editFlag == false){                   
                //     var data = $scope.senderEdited.senderId;
                //     $(".senderIdtd"+id).html('');
                //     $(".senderIdtd"+id).html(data);
                //     console.log(data);
                // }
                
                // $scope.editFlag = true;
                
            };

            // $scope.removeTextBox = function(){                
            //     alert("sdsadklj");
            //     // $(".senderIdtd"+id).html("");
            //     // $(".senderIdtd"+id).html(element);
            // };

           


        }
    ]);