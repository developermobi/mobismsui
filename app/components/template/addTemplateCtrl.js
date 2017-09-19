angular
    .module('altairApp')
    .controller('addTemplateCtrl', [
        '$scope',
        '$rootScope',
        'apiPostData',
        '$cookieStore',
        function ($scope,$rootScope,apiPostData,$cookieStore) {
            
           
            /*alert($rootScope.u_id);*/
            $scope.template = {};
           // $scope.senderEdited = {};
           $scope.saveTemplate = function(template) {   
                var addTemplate = "saveTemplate";  
                var templateData = template;
                templateData.userId = $rootScope.u_id;
                
                templateData = JSON.stringify(templateData);

                //console.log(senderData);
                
                apiPostData.async(addTemplate, templateData).then(function(d) {
                   // console.log(d);
                    $scope.responseData = d.data;
                    if($scope.responseData.code == 201){
                        var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Successfully Add Template');
                        modal.show();
                       // getData();
                        setTimeout(function(){
                            modal.hide();
                            window.location.href="/mobismsui/#/template/manage";
                        },3000);

                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.responseData.message);
                        modal.show();
                    }
                    //console.log($scope.responseData);
                });            
            }; 
            $scope.messagesCount = 0;
            $scope.remainingCount = 0;
            $scope.totalCount = 0;

            $scope.messageCount = function(){
                $scope.part1Count = 160;
                $scope.part2Count = 146;
                $scope.part3Count = 153;
              // alert($scope.template.description);
                if($scope.template.description == undefined){

                    
                    $scope.messagesCount = 0;
                    $scope.remainingCount = 0;
                    $scope.totalCount = 0;
                    return false;
                }
                
                var chars = $scope.template.description.length;

                if (chars <= $scope.part1Count) {
                    $scope.messagesCount = 1;
                    $scope.remainingCount = $scope.part1Count - chars;
                } else if (chars <= ($scope.part1Count + $scope.part2Count)) { 
                    $scope.messagesCount = 2;
                    $scope.remainingCount = $scope.part1Count + $scope.part2Count - chars;
                } else if (chars > ($scope.part1Count + $scope.part2Count)) { 
                    moreM = Math.ceil((chars - $scope.part1Count - $scope.part2Count) / $scope.part3Count) ;
                    $scope.remainingCount = $scope.part1Count + $scope.part2Count + (moreM * $scope.part3Count) - chars;
                    $scope.messagesCount = 2 + moreM;

                    if($scope.messagesCount > 10)
                    {
                        alert("Counts of message not more than 10.");
                        return false;                        
                    }
                }
                $scope.totalCount = chars;
            }
            /*$scope.deleteSenderId = function(id){   
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
            };*/
        }
    ]);