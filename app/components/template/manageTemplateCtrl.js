angular
    .module('altairApp')
    .controller('manageTemplateCtrl', [
        '$scope',
        '$rootScope',
        'apiGetData',
        'apiPostData',
        '$cookieStore',
        'pagerService',
        '$timeout',
        function ($scope,$rootScope,apiGetData,apiPostData,$cookieStore,pagerService,$timeout) {

            $scope.template = {
                name: "",
                description: ""
            };
            
            $scope.pagination = {};
            $scope.page = 1;
            //$scope.no_of_data = 5;
            $scope.sr_no = 0;

            $scope.no_of_data = {
                options: [
                    {
                        id: 1,
                        title: "5",
                        value: "5",
                        parent_id: 1
                    },
                    {
                        id: 2,
                        title: "10",
                        value: "10",
                        parent_id: 1
                    },
                    {
                        id: 3,
                        title: "25",
                        value: "25",
                        parent_id: 1
                    },
                    {
                        id: 4,
                        title: "50",
                        value: "50",
                        parent_id: 1
                    },
                    {
                        id: 5,
                        title: "100",
                        value: "100",
                        parent_id: 1
                    }
                ]
            };

            $scope.no_of_data_config = {
                create: false,
                maxItems: 1,
                placeholder: 'No of data per page',
                optgroupField: 'parent_id',
                optgroupLabelField: 'title',
                optgroupValueField: 'ogid',
                valueField: 'value',
                labelField: 'title',
                searchField: 'title',
                hideSelected: false,
                highlight: true
            };

            $scope.data_per_page = $scope.no_of_data.options[0].value;
           
            $scope.clearData = function(){
                $scope.pagination = {};
                $scope.page = 1;
            }                                   
           
            $scope.getData = function(page){   
                //alert(page);             
                $scope.page = page;

                $scope.start = pagerService.setPage($scope.page,$scope.data_per_page);
                
                var getSender = "getAllTemplate/"+$rootScope.u_id+"/"+$scope.start+"/"+$scope.data_per_page; 

                //console.log(getSender);               

                apiGetData.async(getSender).then(function(d) {
                    $scope.responseData = d;
                    /*alert("hello data");
                    console.log('d data',d);*/
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                        $scope.userTemplateData = $scope.data.data.template_data;
                        //console.log($scope.data.data);
                        $scope.pagination = pagerService.GetPager($scope.data.data.total,$scope.page,$scope.data_per_page);
                        console.log($scope.pagination);

                        
                    }else{
                        $scope.clearData();
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                        modal.show();
                    }
                });
            }

            $scope.getData($scope.page);


            $scope.deleteTemplate = function(id){   
                
                UIkit.modal.confirm('Are you sure want to delete this template?', function(){                     
                    var deleteSenderData = "deleteTemplate/"+id;

                    apiGetData.async(deleteSenderData).then(function(d) {
                        $scope.responseData = d;
                        $scope.data = $scope.responseData.data;
                        if($scope.data.code == 200){
                            var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Data Deleted Successfully');
                            modal.show();
                            $scope.getData($scope.page);
                            setTimeout(function(){
                                modal.hide();  
                            },3000);
                        }else{
                            var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                            modal.show();
                        }
                    });
                });                
            };
            $scope.template = {};
            $scope.getTemplateDetails = function(id){  
                $scope.part1Count = 160
                var getTemplateData = "getTemplateById/"+id;
                $scope.templateData = {};
                apiGetData.async(getTemplateData).then(function(d) {                    
                    $scope.responseData = d;
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                        $scope.templateData = $scope.data.data;
                        $scope.template.id =  $scope.templateData[0].id;                  
                        $scope.template.name =  $scope.templateData[0].name;
                        $scope.template.description =  $scope.templateData[0].description;

                        $scope.part1Count = 160;
                        $scope.part2Count = 146;
                        $scope.part3Count = 153;
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

                        console.log($scope.templateData);                        
                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                        modal.show();
                    }
                });
            };
            $scope.updateTemplate = function(template,id){

                var validatedFlag = validateData(template);  

                if(!validatedFlag){
                    //console.log("validatedFlag: ",validatedFlag);
                    return false;
                }

                var templateData = JSON.stringify(template);               
                var updateTemplate = "updateTemplateById/"+id;

                apiPostData.async(updateTemplate, templateData).then(function(d) {
                    $scope.data = d.data;
                    if($scope.data.code == 200){
                        $scope.triggerClick('#edit_template .uk-modal-close');
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Data Updated Successfully');
                        modal.show();
                        $scope.getData($scope.page); 
                       // getData();
                        setTimeout(function(){
                            modal.hide();                                                        
                        },3000);
                        
                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                        modal.show();
                    }
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
                       
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Counts of message not more than 10.');
                        modal.show();                   
                        return false;                        
                    }
                }
                $scope.totalCount = chars;
            }

            $scope.$watch(function() {
                return $scope.data_per_page;
            }, function(n, o) {
                if(n != o){
                    $scope.getData(1);
                }     
            }, true)

            $scope.triggerClick = function (className) {
                $timeout(function() {
                    angular.element(className).trigger('click');
                }, 100);
            };

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