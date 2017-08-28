angular
    .module('altairApp')
    .config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    }])
    .controller('bulkSmsCtrl', [
        '$scope',
        '$rootScope',
        '$http',
        'apiGetData',
        'apiPostData',
        'apiFileUpload',
        '$cookieStore',
        'pagerService',
        function ($scope,$rootScope,$http,apiGetData,apiPostData,apiFileUpload,$cookieStore,pagerService) {

            $rootScope.globals = $cookieStore.get('globals') || {};
            $rootScope.u_id = $rootScope.globals.currentUser.u_id;

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
           
        	$scope.smsTypes = [];

            //Sender Id
            $scope.sender_id_data = {
                options: [ ]
            };
        	

            $scope.selectedProductId = {};
            $scope.selectedProductName = {};
        	//$scope.smsTypeTitle

        	$scope.select= function(id,title) {
				$scope.selectedProductId = id;
                $scope.selectedProductName = title; 
			};

            $rootScope.sms_quick_flag = false;
            $rootScope.sms_group_flag = true;

            $scope.getAllSenderId = function(){  
                
                var getSender = "getAllSenderId/"+$rootScope.u_id;               

                apiGetData.async(getSender).then(function(d) {
                    $scope.responseData = d;
                    /*alert("hello data");
                    console.log('d data',d);*/
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                        $scope.userSenderData = $scope.data.data;
                        
                        //console.log($scope.userSenderData);

                        var response_sender = $scope.userSenderData;                         

                        var increment = 1;
                        $.each(response_sender,function(i){

                            //console.log(response_sender[i]['sender_id']);

                            var array_sender = Array();
                            array_sender['id'] = increment;
                            array_sender['title'] = response_sender[i]['sender_id'];
                            array_sender['value'] = response_sender[i]['sender_id'];
                            array_sender['parent_id'] = 1;
                            increment++;

                            $scope.sender_id_data.options[i]= Object.assign({}, array_sender);

                        });

                        console.log($scope.sender_id_data);
                        
                    }
                });
            };

            $scope.getAllSenderId();
            $scope.sender_id_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select Sender Id',
                optgroupField: 'parent_id',
                optgroupLabelField: 'title',
                optgroupValueField: 'ogid',
                valueField: 'value',
                labelField: 'title',
                searchField: 'title',
                hideSelected: false,
                highlight: true
            };
            
            $scope.getUserData = function(){  

                var getSender = "getUserById/"+$rootScope.u_id;               

                apiGetData.async(getSender).then(function(d) {
                    $scope.responseData = d;
                    /*alert("hello data");
                    console.log('d data',d);*/
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                        $scope.userData = $scope.data.data;
                        
                        console.log($scope.userData.length);

                        var response_data = $scope.userData;                         

                        var increment = 1;
                        $.each(response_data,function(i){

                            console.log(response_data[i].product['id']);



                            var array_product = Array();
                            array_product['id'] = response_data[i].product['id'];
                            array_product['title'] = response_data[i].product['name'];
                            increment++;

                            $scope.smsTypes[i]= Object.assign({}, array_product);

                            if(i == 0){
                                $scope.selectedProductId = response_data[i].product['id'];
                                $scope.selectedProductName = response_data[i].product['name']; 
                            }
                            
                        });

                        console.log($scope.smsTypes);
                        
                    }
                });
            }

             $scope.getUserData();

            //SMS Type
            $scope.sms_type_data = {
                options: [
                    {
                        id: 1,
                        title: "TEXT",
                        value: 1,
                        parent_id: 1
                    },
                    {
                        id: 2,
                        title: "FLASH",
                        value: 2,
                        parent_id: 1
                    },
                    {
                        id: 3,
                        title: "UNICODE",
                        value: 3,
                        parent_id: 1
                    }
                ]
            };

            $scope.sms_type_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select SMS Type',
                optgroupField: 'parent_id',
                optgroupLabelField: 'title',
                optgroupValueField: 'ogid',
                valueField: 'value',
                labelField: 'title',
                searchField: 'title',
                hideSelected: false,
                highlight: true
            };

            //SMS Method
            $scope.sms_method_data = {
                options: [
                    {
                        id: 1,
                        title: "Quick SMS",
                        value: "1",
                        parent_id: 1
                    },
                    {
                        id: 2,
                        title: "Group SMS",
                        value: "2",
                        parent_id: 1
                    },
                    {
                        id: 3,
                        title: "Bulk Push Notepad",
                        value: "3",
                        parent_id: 1
                    },
                    {
                        id: 4,
                        title: "Bulk Push Excel",
                        value: "4",
                        parent_id: 1
                    }
                ]
            };


            $scope.sms_method_config = {
                create: false,
                maxItems: 1,
                placeholder: 'Select SMS Method',
                optgroupField: 'parent_id',
                optgroupLabelField: 'title',
                optgroupValueField: 'ogid',
                valueField: 'value',
                labelField: 'title',
                searchField: 'title',
                hideSelected: false,
                highlight: true
            };

            //Group
            var groups_data = $scope.select_group_options = [
                {id: 1, title: 'Mercury', url: 'http://en.wikipedia.org/wiki/Mercury_(planet)'},
                {id: 2, title: 'Venus', url: 'http://en.wikipedia.org/wiki/Venus'},
                {id: 3, title: 'Earth', url: 'http://en.wikipedia.org/wiki/Earth'},
                {id: 4, title: 'Mars', url: 'http://en.wikipedia.org/wiki/Mars'},
                {id: 5, title: 'Jupiter', url: 'http://en.wikipedia.org/wiki/Jupiter'},
                {id: 6, title: 'Saturn', url: 'http://en.wikipedia.org/wiki/Saturn'},
                {id: 7, title: 'Uranus', url: 'http://en.wikipedia.org/wiki/Uranus'},
                {id: 8, title: 'Neptune', url: 'http://en.wikipedia.org/wiki/Neptune'}
            ];

            $scope.select_group_config = {
                plugins: {
                    'remove_button': {
                        label     : ''
                    }
                },
                maxItems: null,
                valueField: 'id',
                labelField: 'title',
                searchField: 'title',
                create: false,
                render: {
                    option: function(groups_data, escape) {
                        return  '<div class="option">' +
                            '<span class="title">' + escape(groups_data.title) + '</span>' +
                            '</div>';
                    }
                }
            };

            $scope.sms_type = $scope.sms_type_data.options[0].value;
            $scope.sms_method = $scope.sms_method_data.options[0].value;            
            $scope.mobile_count = 0;

            $scope.toShow = 1;            
            $scope.mobCount = false;
            
            $scope.changeMethod = function() {
                $scope.toShow = $scope.sms_method;  
                if($scope.sms_method != 1){
                    $scope.mobCount = true;
                }else{
                    $scope.mobCount = false;
                }    

            };
            
            $scope.mobileCount = function(){                
                $scope.mobile_count = 0;
                var mobile = $scope.sms_mobile;
                //alert($scope.sms_mobile);
                mobile = mobile.trim();
                mobile = mobile.replace(/(^[ \t]*\n)/gm, "");
                var mob_array = mobile.split(/\r\n|\r|\n/);
                if($scope.sms.duplicate == true){
                    var mob_array = unique(mob_array);
                    $scope.sms_mobile = mob_array.toString().replace(/\,/g,'\n');
                }
                $scope.mobile_count = mob_array.length;
            }

            var str_lang = ['am','ar','bn','zh','el','gu','hi','kn','ml','mr','ne','or','fa','pa','ru','sa','si','sr','ta','te','ti','ur'];
            $scope.changeSMSType = function(){
                $scope.toShowUnicode = $scope.sms_type; 
                $scope.message = '';

                $scope.messagesCount = 0;
                $scope.remainingCount = 0;
                $scope.totalCount = 0; 

                if($scope.toShowUnicode == '3'){
                    loadApi(str_lang);                    
                }              
            }

            //Load Unicode Language
            function loadApi(str_lang){

                $("#google_translate_element").html('');

                google.load("elements", "1", {
                    packages: "transliteration",
                    callback: function(){
                        onLoad();
                    }
                });                

                function onLoad() {
                    var options = {
                        sourceLanguage: 'en',
                        destinationLanguage: str_lang,
                        shortcutKey: 'ctrl+g',
                        transliterationEnabled: true
                    };

                    var control = new google.elements.transliteration.TransliterationControl(options);

                    // Enable transliteration in the textfields with the given ids.
                    var ids = [ "message" ];
                    control.makeTransliteratable(ids);

                    // Show the transliteration control which can be used to toggle between
                    // English and Hindi and also choose other destination language.
                    control.showControl('google_translate_element');
                }
            }

            function unique(list) {
                var result = [];
                $.each(list, function(i, e) {
                    if ($.inArray(e, result) == -1) result.push(e);
                });
                return result;
            }

            $scope.autoDetectLanguage = function(){
                setTimeout(function () { 
                    var message = $scope.message;
                    //alert(message);
                    var key = '7e0c770b9281c752894d3803f3a9c629';

                    var url = "http://ws.detectlanguage.com/0.2/detect?q=" + message +"&key="+key;

                    var config = {
                        async: false,
                        transformRequest: angular.identity,
                        headers : {
                            'Content-Type': 'application/json',
                            'Process-Data': false              
                        }
                    }

                    // var xmlHttp = new XMLHttpRequest();
                    // xmlHttp.open( "GET", url, false ); // false for synchronous request
                    // xmlHttp.send( null );

                    // console.log(xmlHttp.responseText);
                    //return xmlHttp.responseText;

                    // $.ajax({
                    //     url:url,
                    //     type: 'GET',
                    //     'Process-Data': false,
                    //     dataType: 'JSON',
                    //     success: function(response){
                    //         console.log(response);
                    //     }
                    // });

                    // var data = $http.post(url,config)        
                    // .success(function(response){
                    //     //modal.hide();
                    //     //console.log(response);
                    //     return response;
                    // })
                    // .error(function(response){
                    //     //modal.hide();
                    //     console.log(response);
                    //     //UIkit.modal.alert(response.message);
                    //     return response;
                    // });

                    // console.log(data);

                    //var url = "http://ws.detectlanguage.com/0.2/detect";

                }, 100);
               
            }

            //======== Message Count ============            

            $scope.messagesCount = 0;
            $scope.remainingCount = 0;
            $scope.totalCount = 0;

            $scope.messageCount = function(){
                if($scope.toShowUnicode == '3'){
                    $scope.unicodeMessageCount();                    
                }else{
                    $scope.textMessageCount();
                }
            }

            $scope.textMessageCount = function(){
                $scope.part1Count = 160;
                $scope.part2Count = 146;
                $scope.part3Count = 153;
                
                if($scope.message == undefined){
                    $scope.messagesCount = 0;
                    $scope.remainingCount = 0;
                    $scope.totalCount = 0;
                    return false;
                }

                var chars = $scope.message.length;
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

            $scope.unicodeMessageCount = function(){
                $scope.part1Count = 70;
                $scope.part2Count = 64;
                $scope.part3Count = 67;

                if($scope.message == undefined){
                    $scope.messagesCount = 0;
                    $scope.remainingCount = 0;
                    $scope.totalCount = 0;
                    return false;
                }

                var chars = $scope.message.length; 
                if (chars <= $scope.part1Count) {
                    $scope.messagesCount = 1;
                    $scope.remainingCount = $scope.part1Count - chars;
                } else if (chars <= ($scope.part1Count + $scope.part2Count)) { 
                    $scope.messagesCount = 2;
                    $scope.remainingCount = $scope.part1Count + $scope.part2Count - chars;
                } else if (chars > ($scope.part1Count + $scope.part2Count)) { 
                    moreM = Math.ceil((chars - upart1Count - $scope.part2Count) / $scope.part3Count) ;
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

            $scope.keepNumericsAndCountMobile = function(){
                setTimeout(function () { 
                    var mobile = $scope.sms_mobile;
                    mobile = mobile.replace(/[^0-9\n]/g, '');
                    $scope.sms_mobile = mobile;
                    $scope.mobileCount();
                }, 100);
            }

            $scope.sendSMS = function(){
                var fd = new FormData();
                fd.append('file', $scope.smsFile);
                fd.append('userId', $rootScope.u_id);
                fd.append('message', $scope.message);
                fd.append('sender', $scope.sender_id);
                fd.append('scheduledAt', '2017-08-12 00:00:00');
                fd.append('jobStatus', 0);
                fd.append('jobType', $scope.sms_method);
                fd.append('columns', 23);
                fd.append('sendNow', 'SV');
                fd.append('sendRatio', 100);
                fd.append('route', 'netcore');
                fd.append('messageType', $scope.sms_type);
                fd.append('productId', $scope.selectedProductId);
               

                for (var pair of fd.entries()) {
                    console.log(pair[0]+ ', ' + pair[1]); 
                }

                var sendSMS = "saveUserJobs";               

                apiFileUpload.async(sendSMS,fd).then(function(d) {
                    $scope.responseData = d;
                    /*alert("hello data");
                    console.log('d data',d);*/
                    $scope.data = $scope.responseData.data;
                    
                    if($scope.data.code == 201){
                        var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Message Successfully Sent');
                        modal.show();  
                        $scope.clearFields();                      
                       // getData();
                        setTimeout(function(){
                            modal.hide();
                            //window.location.href="/mobismsui/#/template/manage";
                        },3000);

                    }else if($scope.data.code == 401){
                        var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Invalid Token Credentials');
                        modal.show();
                        setTimeout(function(){
                            modal.hide();
                        },3000);
                    }
                    else if($scope.data.code == 403){
                        var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Somethig going worng. File not uploaded');
                        modal.show();
                        setTimeout(function(){
                            modal.hide();
                        },3000);
                    }
                    else if($scope.data.code == 413){
                        var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Maximum message sending count is 10');
                        modal.show();
                        setTimeout(function(){
                            modal.hide();
                        },3000);
                    }
                    else if($scope.data.code == 414){
                        var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>File is too large');
                        modal.show();
                        setTimeout(function(){
                            modal.hide();
                        },3000);
                    }
                    else if($scope.data.code == 404){
                        var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>File not found');
                        modal.show();
                        setTimeout(function(){
                            modal.hide();
                        },3000);
                    }
                    else{
                        var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Bad request');
                        modal.show();
                        setTimeout(function(){
                            modal.hide();
                        },3000);
                    }
                });
            }

            $scope.clearFields = function(){
                $scope.message = '';
                $scope.messageCount();
                $scope.messagesCount = 0;
                $scope.remainingCount = 0;
                $scope.totalCount = 0;
            }

            $scope.getTemplateData = function(page){   
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

                        
                    }
                });
            }

            
            $scope.getTemplateDetails = function(id){ 
                $scope.clearFields(); 
                $scope.part1Count = 160
                var getTemplateData = "getTemplateById/"+id;
                $scope.templateData = {};
                apiGetData.async(getTemplateData).then(function(d) {                    
                    $scope.responseData = d;
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                        $scope.templateData = $scope.data.data;
                        $scope.message =  $scope.templateData[0].description;

                        $scope.part1Count = 160;
                        $scope.part2Count = 146;
                        $scope.part3Count = 153;
                        var chars = $scope.message.length;

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
                                var modal = UIkit.modal.blockUI('<div class=\'uk-text-center\'>Counts of message not more than 10.');
                                modal.show();
                                setTimeout(function(){
                                    modal.hide();
                                },3000);

                                //alert("Counts of message not more than 10.");
                                return false;                        
                            }
                        }
                        $scope.totalCount = chars;

                        //$("#view_template").hide();

                        console.log($scope.templateData);                        
                    }
                });
            };

            //$scope.getTemplateData($scope.page);
            

        }

    ]);
