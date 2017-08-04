/*
 *  Altair Admin angularjs
 *  controller
 */

angular
    .module('altairApp')
    .controller('mainCtrl', [
        '$scope',
        '$rootScope',
        function ($scope,$rootScope) {}
    ])
    .controller('main_headerCtrl', [
        '$timeout',
        '$scope',
        '$window',
        '$location', 
        'AuthenticationService',
        function ($timeout,$scope,$window,$location,AuthenticationService) {

            $scope.submitSignOut = function(){                
                AuthenticationService.logout();
            }

            $scope.user_data = {
                name: "Lue Feest",
                avatar: "assets/img/avatars/avatar_11_tn.png",
                alerts: [
                    {
                        "title": "Hic expedita eaque.",
                        "content": "Nemo nemo voluptatem officia voluptatum minus.",
                        "type": "warning"
                    },
                    {
                        "title": "Voluptatibus sed eveniet.",
                        "content": "Tempora magnam aut ea.",
                        "type": "success"
                    },
                    {
                        "title": "Perferendis voluptatem explicabo.",
                        "content": "Enim et voluptatem maiores ab fugiat commodi aut repellendus.",
                        "type": "danger"
                    },
                    {
                        "title": "Quod minima ipsa.",
                        "content": "Vel dignissimos neque enim ad praesentium optio.",
                        "type": "primary"
                    }
                ],
                messages: [
                    {
                        "title": "Reiciendis aut rerum.",
                        "content": "In adipisci amet nostrum natus recusandae animi fugit consequatur.",
                        "sender": "Korbin Doyle",
                        "color": "cyan"
                    },
                    {
                        "title": "Tenetur commodi animi.",
                        "content": "Voluptate aut quis rerum laborum expedita qui eaque doloremque a corporis.",
                        "sender": "Alia Walter",
                        "color": "indigo",
                        "avatar": "assets/img/avatars/avatar_07_tn.png"
                    },
                    {
                        "title": "At quia quis.",
                        "content": "Fugiat rerum aperiam et deleniti fugiat corporis incidunt aut enim et distinctio.",
                        "sender": "William Block",
                        "color": "light-green"
                    },
                    {
                        "title": "Incidunt sunt.",
                        "content": "Accusamus necessitatibus officia porro nisi consectetur dolorem.",
                        "sender": "Delilah Littel",
                        "color": "blue",
                        "avatar": "assets/img/avatars/avatar_02_tn.png"
                    },
                    {
                        "title": "Porro ut.",
                        "content": "Est vitae magni eum expedita odit quisquam natus vel maiores.",
                        "sender": "Amira Hagenes",
                        "color": "amber",
                        "avatar": "assets/img/avatars/avatar_09_tn.png"
                    }
                ]
            };

            $scope.alerts_length = $scope.user_data.alerts.length;
            $scope.messages_length = $scope.user_data.messages.length;


            $('#menu_top').children('[data-uk-dropdown]').on('show.uk.dropdown', function(){
                $timeout(function() {
                    $($window).resize();
                },280)
            });


        }
    ])
    .controller('main_sidebarCtrl', [
        '$timeout',
        '$scope',
        '$rootScope',
        function ($timeout,$scope,$rootScope) {

            $scope.$on('onLastRepeat', function (scope, element, attrs) {
                $timeout(function() {
                    if(!$rootScope.miniSidebarActive) {
                        // activate current section
                        $('#sidebar_main').find('.current_section > a').trigger('click');
                    } else {
                        // add tooltips to mini sidebar
                        var tooltip_elem = $('#sidebar_main').find('.menu_tooltip');
                        tooltip_elem.each(function() {
                            var $this = $(this);

                            $this.attr('title',$this.find('.menu_title').text());
                            UIkit.tooltip($this, {});
                        });
                    }
                })
            });

            $scope.logo = "assets/img/MKM.png";

            // menu entries
            $scope.sections = [
                {
                    id: 0,
                    title: 'Dashboard',
                    icon: '&#xE871;',
                    link: 'restricted.dashboard'
                },      
                {
                    id: 1,
                    title: 'Mobile Messages',
                    icon: '&#xE158;',
                    link: 'restricted.bulk_sms'
                },
                {
                    id: 2,
                    title: 'Personalised Msg',
                    icon: '&#xE158;',
                    link: 'restricted.personalised'
                },                
                {            

                    id: 3,
                    title: 'Address Book',
                    icon: '&#xE0CD;',
                    submenu: [
                        {
                            title: 'Add Group',
                            icon: '&#xE0CD;',
                            link: 'restricted.addgroup'
                        },
                        {
                            title: 'Manage Group',
                            icon: '&#xE0CD;',
                            link: 'restricted.managegroup'
                        },
                        {
                            title: 'Add Contact',
                            icon: '&#xE0CD;',
                            link: 'restricted.addcontact'
                        },
                        {
                            title: 'Manage Contacts',
                            icon: '&#xE0CD;',
                            link: 'restricted.managecontacts'
                        }
                    ]
                },
                {
                    id: 4,
                    title: 'Templates',
                    icon: '&#xE0B9;',
                    submenu: [
                        {
                            title: 'Add Template',
                            icon: '&#xE0CD;',
                            link: 'restricted.addtemplate'
                        },
                        {
                            title: 'Manage Template',
                            icon: '&#xE0CD;',
                            link: 'restricted.managetemplate'
                        }
                    ]
                },
                {
                    id: 5,
                    title: 'Sender Id',
                    icon: '&#xE871;',
                    link: 'restricted.senderid'
                },
                {
                    id: 6,
                    title: 'My Account',
                    icon: '&#xE7FD;',
                     submenu: [
                        {
                            title: 'Profile',
                            link: 'restricted.profile'
                        },
                        {
                            title: 'Transactions',
                            link: 'restricted.transactions'
                        }
                        
                    ]
                },
                {
                    id: 7,
                    title: 'User',
                    icon: '&#xE7FD;',
                     submenu: [
                        {
                            title: 'Add User',
                            link: 'restricted.addUser'
                        },
                        {
                            title: 'Manage User',
                            link: 'restricted.manageUser'
                        }
                        
                    ]
                },
                {
                    id: 8,
                    title: 'LogOut',
                    icon: '&#xE5C4;',
                    link: 'restricted.logout'
                }
                               
            ]

        }
    ])
;
