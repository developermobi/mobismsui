angular
    .module('altairApp')
    .controller('addTemplateCtrl', [
        '$scope',
        '$rootScope',
        'apiPostData',
        '$cookieStore',
        function ($scope,$rootScope,apiPostData,$cookieStore) {
            
           
            /*alert($rootScope.u_id);*/
            $scope.template = {
                name: "",
                description: ""
            };
            // $scope.senderEdited = {};
            $scope.saveTemplate = function(template) {   
                var addTemplate = "saveTemplate";  
                var templateData = template;

                var validatedFlag = validateData(templateData);  

                if(!validatedFlag){
                    //console.log("validatedFlag: ",validatedFlag);
                    return false;
                }

                templateData.userId = $rootScope.u_id;
                
                templateData = JSON.stringify(templateData);

                //console.log(senderData);
                
                apiPostData.async(addTemplate, templateData).then(function(d) {
                   // console.log(d);
                    $scope.responseData = d.data;
                    if($scope.responseData.code == 201){
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Template added successfully');
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
            
            $scope.reset = function(){
                $scope.template = {};
                $scope.messagesCount = 0;
                $scope.remainingCount = 0;
                $scope.totalCount = 0;
            }

            function validateData(requestData){
                var data = [
                    {
                        title : "Template Name",
                        value : requestData.name == undefined ? "" : requestData.name,
                        validation : {
                            required : true,
                            spl_char : true,
                            mobile : false,
                            email : false
                        }           
                    },
                    {
                        title : "Template Description",
                        value : requestData.description == undefined ? "" : requestData.description,
                        validation : {
                            required : true,
                            spl_char : false,
                            mobile : false,
                            email : false
                        }           
                    }, 
                    
                ];

                var validationResponse = customValidation(data);

                console.log("validationResponse",validationResponse);

                if(validationResponse.status == 0){
                    var modal = UIkit.modal.alert('<div class=\'parsley-errors-list\'>'+validationResponse.message);
                    modal.show();
                    return false;
                }else{
                    return true;
                }
            }


        }
    ]);