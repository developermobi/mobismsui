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
        '$timeout',
        '$q',
        function ($scope,$rootScope,$http,apiGetData,apiPostData,apiFileUpload,$cookieStore,pagerService,$timeout,$q) {

            //console.log("login cookie: ",$rootScope.globals); 
            $scope.date = new Date();

            $scope.schedule_date = {};
            $scope.schedule_time = {};

            $scope.setTime = function(){
                var date = new Date();

                date.setMonth( date.getMonth() + 1 );

                var defaultDate = (date.getFullYear()) + '-' + (date.getMonth()) + '-' + (date.getDate() < 10 ? "0"+date.getDate() : date.getDate());

                $scope.schedule_date = defaultDate;

                var hours1 = date.getHours()+":"+date.getMinutes();

                $scope.schedule_time = hours1;
            }

            $scope.setTime();

            $scope.fileName = '';

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

            $scope.defer = null;

            $scope.getAllSenderId = function(){  

                $scope.defer = $q.defer();
                
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

                        //console.log($scope.sender_id_data);
                        
                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                        modal.show();
                    }

                    $scope.defer.resolve();
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

                var getUserById = "getUserById/"+$rootScope.u_id;               

                apiGetData.async(getUserById).then(function(d) {
                    $scope.responseData = d;
                    /*alert("hello data");
                    console.log('d data',d);*/
                    $scope.data = $scope.responseData.data;
                    if($scope.data.code == 302){
                        $scope.userData = $scope.data.data;
                        
                        //console.log($scope.userData);

                        var response_data = $scope.userData;                         

                        var increment = 1;
                        $.each(response_data,function(i){

                            //console.log(response_data[i].productId['id']);



                            var array_product = Array();
                            array_product['id'] = response_data[i].productId['id'];
                            array_product['title'] = response_data[i].productId['name'];
                            increment++;

                            $scope.smsTypes[i]= Object.assign({}, array_product);

                            if(i == 0){
                                $scope.selectedProductId = response_data[i].productId['id'];
                                $scope.selectedProductName = response_data[i].productId['name']; 
                            }
                            
                        });

                        //console.log($scope.smsTypes);
                        
                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                        modal.show();
                    }
                });
            }

            $scope.defer.promise.then(function(){
                $scope.getUserData();
            });

             

            //SMS Type
            $scope.sms_type_data = {
                options: [
                    {
                        id: 1,
                        title: "TEXT",
                        value: 1,
                        parent_id: 1
                    },
                    // {
                    //     id: 2,
                    //     title: "FLASH",
                    //     value: 2,
                    //     parent_id: 1
                    // },
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
                        title: "Bulk Push CSV",
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
            var groups_data = $scope.user_group_data = [];

            $scope.getGroupData = function(){
               
                var getGroupName = "getActiveGroupByUserId/"+$rootScope.u_id;
                $scope.groupNameData = {};

                apiGetData.async(getGroupName).then(function(d) {
                    $scope.responseData = d;
                    $scope.data = $scope.responseData.data;

                    if($scope.data.code == 302){
                        $scope.userGroupData = $scope.data.data;
                        
                        //console.log("userGroupData",$scope.userGroupData);

                        var response_group = $scope.userGroupData;                         

                        var increment = 1;
                        $.each(response_group,function(i){

                            //console.log(response_group[i]['name']);

                            var array_group = Array();
                            array_group['title'] = response_group[i]['name'];
                            array_group['id'] = response_group[i]['groupId'];

                            //console.log("array_group",Object.assign({}, array_group));

                            $scope.user_group_data[i]= Object.assign({}, array_group);

                        });

                        console.log("user_group_data",$scope.user_group_data);                        
                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                        modal.show();
                    }
                });              
            }  

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
                $scope.fileName = '';
                $scope.toShow = $scope.sms_method;  
                if($scope.sms_method != 1){
                    $scope.mobCount = true;
                }else{
                    $scope.mobCount = false;
                }

                if ($scope.sms_method == 2) {

                    $scope.getGroupData();                   
                    
                } 

            };
            
            $scope.sms_duplicate = false;
            $scope.mobileCount = function(){                
                $scope.mobile_count = 0;
                var mobile = $scope.sms_mobile;
                //alert($scope.sms_mobile);
                mobile = mobile.trim();
                mobile = mobile.replace(/(^[ \t]*\n)/gm, "");
                var mob_array = mobile.split(/\r\n|\r|\n/);
                if($scope.sms_duplicate == true){
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
                    $("#message").hide();
                    $("#unicode_message").show();
                    loadApi(str_lang);                    
                }else{
                    $("#unicode_message").hide();
                    $("#message").show();
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
                    var ids = [ "unicode_message" ];
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
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Counts of message not more than 10.');
                        modal.show();  
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

            $scope.keepNumericsAndCountMobile = function(){
                setTimeout(function () { 
                    var mobile = $scope.sms_mobile;
                    mobile = mobile.replace(/[^0-9\n]/g, '');
                    $scope.sms_mobile = mobile;
                    $scope.mobileCount();
                }, 100);
            }
           

            $scope.clearFields = function(){
                $scope.message = '';
                $scope.messageCount();
                $scope.messagesCount = 0;
                $scope.remainingCount = 0;
                $scope.totalCount = 0;
                $scope.fileName = '';
                $scope.groupId = '';
                $scope.sms_mobile = '';
                $scope.mobile_count = 0;
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
                        //console.log($scope.pagination);

                        
                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                        modal.show();
                    }
                });
            }

            
            $scope.getTemplateDetails = function(id){ 
                //$scope.clearFields(); 
                $scope.message = '';
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
                                var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Counts of message not more than 10.');
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

                        //console.log($scope.templateData);                        
                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                        modal.show();
                    }
                });
            };

             $scope.sendSMS = function(fd){   
                
                if($scope.sender_id == undefined || $scope.sender_id == ""){
                    var modal = UIkit.modal.alert('<div class=\'parsley-errors-list\'>Sender Id Required');
                    modal.show();
                    return false;
                }
               /* if($scope.sms_method == undefined || $scope.sms_method == ""){
                    var modal = UIkit.modal.alert('<div class=\'parsley-errors-list\'>SMS Method Required ');
                    modal.show();
                    return false;
                }
                if($scope.jobType == undefined || $scope.jobType == ""){
                    var modal = UIkit.modal.alert('<div class=\'parsley-errors-list\'>Required SMS Type');
                    modal.show();
                    return false;
                }*/
                if($scope.message == undefined || $scope.message == ""){
                    var modal = UIkit.modal.alert('<div class=\'parsley-errors-list\'>Required Message');
                    modal.show();
                    return false;
                }
                fd.append('userId', $rootScope.u_id);
                fd.append('sender', $scope.sender_id);
                fd.append('jobType', $scope.sms_method);
                fd.append('messageType', $scope.sms_type);
                fd.append('productId', $scope.selectedProductId);
                fd.append('messageCount', $scope.messagesCount);
                if($scope.sms_type == 3){
                    var msg = encodeURIComponent($scope.message);
                    fd.append('message', msg);
                }else{
                    fd.append('message', $scope.message);
                }
                if( $scope.sms_duplicate == false){
                    fd.append('duplicateStatus', 0);
                }else{
                    fd.append('duplicateStatus', 1);
                }             
               
                if($scope.sms_method == 1 ){     
                    if($scope.sms_mobile == undefined || $scope.sms_mobile == ""){
                    var modal = UIkit.modal.alert('<div class=\'parsley-errors-list\'>Required Mobile Number');
                    modal.show();
                    return false;
                    }
                    if($scope.sms_mobile != ""){
                        var str = $scope.sms_mobile;
                        var n = str.includes("Example");
                        if(n > 0)
                        { 
                            var modal = UIkit.modal.alert('<div class=\'parsley-errors-list\'>Required Mobile Number');
                            modal.show();
                            return false;
                        }
                    }               
                    fd.append('mobileNumber', $scope.sms_mobile.replace(/\r?\n/g, ','));
                    $scope.sendQuickSMS(fd);  

                }else if($scope.sms_method == 2 ){
                  
                    if($scope.groupId == undefined || $scope.groupId == ""){
                        var modal = UIkit.modal.alert('<div class=\'parsley-errors-list\'>Required Group');
                        modal.show();
                        return false;
                    }
                    fd.append('groupId', $scope.groupId);
                    $scope.sendGroupSMS(fd);

                }else if($scope.sms_method == 3 || $scope.sms_method == 4){
                    if($scope.smsFile == undefined || $scope.smsFile == ""){
                        var modal = UIkit.modal.alert('<div class=\'parsley-errors-list\'>Required File');
                        modal.show();
                        return false;
                    }
                    fd.append('file', $scope.smsFile);
                    $scope.sendFileSMS(fd);

                }
                
            }

            $scope.sendQuickSMS = function(fd){
                
                var returnArray = {};
                for (var pair of fd.entries()) {
                    console.log("sendQuickSMS: ",pair[0]+ ', ' + pair[1]); 
                    returnArray[pair[0]] = pair[1];
                }

                //return false;

                var json_data = JSON.stringify(returnArray);

                //console.log("json_data: ",json_data);
                //return false;

                var sendSMS = "sendQuickMessage";

                apiPostData.async(sendSMS,json_data).then(function(d) {
                    $scope.responseData = d;
                    /*alert("hello data");
                    console.log('d data',d);*/
                    $scope.data = $scope.responseData.data;
                    
                    if($scope.data.code == 201){
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                        modal.show();
                        $scope.clearFields();
                       // getData();
                        setTimeout(function(){
                            modal.hide();
                            //window.location.href="/mobismsui/#/template/manage";
                        },3000);

                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                        modal.show();
                    }
                });
            }

            $scope.sendFileSMS = function(fd){
                // for (var pair of fd.entries()) {
                //     console.log("sendFileSMS: ",pair[0]+ ', ' + pair[1]); 
                // }
                //return false;
                var sendSMS = "saveUserJobs";               

                apiFileUpload.async(sendSMS,fd).then(function(d) {
                    $scope.responseData = d;
                    /*alert("hello data");
                    console.log('d data',d);*/
                    $scope.data = $scope.responseData.data;
                    
                    if($scope.data.code == 201){
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                        modal.show();  
                        $scope.clearFields();                      
                       // getData();
                        setTimeout(function(){
                            modal.hide();
                            //window.location.href="/mobismsui/#/template/manage";
                        },3000);

                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                        modal.show();
                    }
                });
            }

            $scope.sendGroupSMS = function(fd){
                var returnArray = {};
                for (var pair of fd.entries()) {
                    returnArray[pair[0]] = pair[1];
                     console.log("sendFileSMS: ",pair[0]+ ', ' + pair[1]); 
                }

                var json_data = JSON.stringify(returnArray);

                //console.log("json_data: ",json_data);
                
                //return false;
                var sendSMS = "saveUserGroupJobs";               

                apiPostData.async(sendSMS,json_data).then(function(d) {
                    $scope.responseData = d;
                    /*alert("hello data");
                    console.log('d data',d);*/
                    $scope.data = $scope.responseData.data;
                    
                    if($scope.data.code == 201){
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                        modal.show();  
                        $scope.clearFields();                      
                       // getData();
                        setTimeout(function(){
                            modal.hide();
                            //window.location.href="/mobismsui/#/template/manage";
                        },3000);

                    }else{
                        var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>'+$scope.data.message);
                        modal.show();
                    }
                });
            }

            $scope.sendNonScheduledSMS = function(){
                var fd = new FormData();
                fd.append('scheduledAt', '0000-00-00 00:00:00');
                fd.append('scheduleStatus', 0);
                $scope.sendSMS(fd);
            };

            $scope.sendScheduledSMS = function(){
                var fd = new FormData();

                var t = $(".timepicker").val();
                $scope.schedule_time = t;

                //alert($scope.schedule_date);

                var flag = validateTime($scope.schedule_time,$scope.schedule_date);

                if(flag == 0){
                    var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Please select time 20 Minutes greater than current time.');
                    modal.show();
                    return false;
                }else if(flag == 2){
                    var modal = UIkit.modal.alert('<div class=\'uk-text-center\'>Scheduling not allowed on previous date.');
                    modal.show();
                    return false;
                }else{
                    // alert(flag);
                    // return false;
                    //$('.uk-modal-close').trigger('click');
                    $scope.triggerClick('.uk-modal-close');
                    //return false;
                }

                var momentObj = moment($scope.schedule_time, ["h:mm A"]);
                // alert(t);
                // return false;
                fd.append('scheduledAt', $scope.schedule_date +" "+ momentObj.format("HH:mm:ss"));
                fd.append('scheduleStatus', 1);

                $scope.sendSMS(fd);
            };


            function objectifyForm(formArray) {//serialize data function

                var returnArray = {};
                for (var i = 0; i < formArray.length; i++){
                    returnArray[formArray[i]['name']] = formArray[i]['value'];
                }
                return returnArray;
            }
            

            function validateTime(scheduleTime,scheduleDate) {
                var date = new Date();
                var hours = date.getHours();
                var minutes = date.getMinutes() + 20;
               
                var currentTime = hours + ':' + minutes;
                //return strTime;

                //return currentTime;

                date.setMonth( date.getMonth() + 1 );

                var currentDate = (date.getFullYear()) + '-' + (date.getMonth()) + '-' + (date.getDate() < 10 ? "0"+date.getDate() : date.getDate());

                // console.log("scheduleDate:",scheduleDate);
                // console.log("scheduleTime:",scheduleTime);

                // console.log("currentDate:",currentDate);
                // console.log("currentTime:",currentTime);
               
                if(scheduleDate > currentDate){
                    return 1;
                }else if(scheduleDate == currentDate){
                    if(scheduleTime >= currentTime){
                        return 1;
                    }else{
                        return 0;
                    }                    
                }else if(scheduleDate < currentDate){
                    return 2;
                }


            }

            $scope.$watch(function() {
                return $scope.sms_duplicate;
            }, function(n, o) {
                if(n != o){
                    $scope.mobileCount();
                }     
            }, true)

            var placeholderContent = 'Example-\n91XXXXXXXXXX\n91XXXXXXXXXX\n91<10 Digit Number>';

            $scope.sms_mobile = placeholderContent;

            $scope.placeholderOnFocusContent = function(){
                if($scope.sms_mobile === placeholderContent){
                    $scope.sms_mobile = '';
                }
            }

            $scope.placeholderOnBlurContent = function(){
                if($scope.sms_mobile ==='' || $scope.sms_mobile ===undefined){
                    $scope.sms_mobile = placeholderContent;
                }
            }

            $scope.triggerClick = function (className) {
                $timeout(function() {
                    angular.element(className).trigger('click');
                }, 100);
            };

        }

    ]);
