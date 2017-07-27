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
        function ($scope,$rootScope,$http,apiGetData,apiPostData) {

        	$scope.smsTypes = [
        		{
        			'type':'Promotional'
        		},
        		{
        			'type':'Transactional'
        		}
        	]

        	$scope.selected = 'Promotional';
        	//$scope.smsTypeTitle

        	$scope.select= function(item) {
				$scope.selected = item; 
			};

            $rootScope.sms_quick_flag = false;
            $rootScope.sms_group_flag = true;

            //Sender Id
			$scope.sender_id_data = {
                options: [
                    {
                        id: 1,
                        title: "MOBSFT",
                        value: "MOBSFT",
                        parent_id: 1
                    },
                    {
                        id: 2,
                        title: "TUSHAR",
                        value: "TUSHAR",
                        parent_id: 1
                    },
                    {
                        id: 3,
                        title: "ABIABI",
                        value: "ABIABI",
                        parent_id: 1
                    }
                ]
            };

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

            //SMS Type
            $scope.sms_type_data = {
                options: [
                    {
                        id: 1,
                        title: "TEXT",
                        value: "TEXT",
                        parent_id: 1
                    },
                    {
                        id: 2,
                        title: "FLASH",
                        value: "FLASH",
                        parent_id: 1
                    },
                    {
                        id: 3,
                        title: "UNICODE",
                        value: "UNICODE",
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
                var mobile = $scope.sms.quick_mobile;
                //alert($scope.sms.quick_mobile);
                mobile = mobile.trim();
                mobile = mobile.replace(/(^[ \t]*\n)/gm, "");
                var mob_array = mobile.split(/\r\n|\r|\n/);
                if($scope.sms.duplicate == true){
                    var mob_array = unique(mob_array);
                    $scope.sms.quick_mobile = mob_array.toString().replace(/\,/g,'\n');
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

                if($scope.toShowUnicode == 'UNICODE'){
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

                    //var url = "http://ws.detectlanguage.com/0.2/detect";

                }, 100);
               
            }

            //======== Message Count ============            

            $scope.messagesCount = 0;
            $scope.remainingCount = 0;
            $scope.totalCount = 0;

            $scope.messageCount = function(){
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
                    var mobile = $scope.sms.quick_mobile;
                    mobile = mobile.replace(/[^0-9\n]/g, '');
                    $scope.sms.quick_mobile = mobile;
                    $scope.mobileCount();
                }, 100);
            }
            

        }

    ]);
