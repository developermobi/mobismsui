altairApp
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        '$httpProvider',
        function ($stateProvider, $urlRouterProvider, $httpProvider) {
           
            // Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
            $urlRouterProvider
                .when('/', '/login')
                .otherwise('/');

            $stateProvider
                // -- ERROR PAGES --
                .state("error", {
                    url: "/error",
                    templateUrl: 'app/views/error.html'
                })
                .state("error.404", {
                    url: "/404",
                    templateUrl: 'app/components/pages/error_404View.html'
                })
                .state("error.500", {
                    url: "/500",
                    templateUrl: 'app/components/pages/error_500View.html'
                })
                // -- LOGIN PAGE --
                .state("login", {
                    url: "/login",
                    templateUrl: 'app/components/login/login.html',
                    controller: 'loginCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_iCheck',
                                'app/components/login/loginController.js'
                            ]);
                        }]
                    }
                })
                //LOGOUT
                .state('restricted.logout', {
                    url: "/logout",
                    resolve: {
                        logout: ['AuthenticationService', function(AuthenticationService) {
                            AuthenticationService.logout();
                        }]
                    }
                })
                // -- RESTRICTED --
                .state("restricted", {
                    abstract: true,
                    url: "",
                    views: {
                        'main_header': {
                            templateUrl: 'app/shared/header/headerView.html',
                            controller: 'main_headerCtrl'
                        },
                        'main_sidebar': {
                            templateUrl: 'app/shared/main_sidebar/main_sidebarView.html',
                            controller: 'main_sidebarCtrl'
                        },
                        '': {
                            templateUrl: 'app/views/restricted.html'
                        }
                    },
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_selectizeJS',
                                'lazy_switchery',
                                'lazy_prismJS',
                                'lazy_autosize',
                                'lazy_iCheck',
                                'lazy_style_switcher'
                            ],{ serie: true });
                        }]
                    }
                })
            // -- DASHBOARD --
                .state("restricted.dashboard", {
                    url: "/dashboard",
                    templateUrl: 'app/components/dashboard/dashboardView.html',
                    controller: 'dashboardCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                // ocLazyLoad config (app/app.js)
                                'lazy_countUp',
                                'lazy_charts_easypiechart',
                                'lazy_charts_metricsgraphics',
                                'lazy_charts_chartist',
                                'lazy_clndr',
                                'app/components/dashboard/dashboardController.js'
                            ], {serie: true} );
                        }]
                    },
                    data: {
                        pageTitle: 'Dashboard'
                    }
                })
                .state("restricted.bulk_sms", {
                    url: "/bulk_sms",
                    templateUrl: 'app/components/sms/bulk_sms.html',
                    controller: 'bulkSmsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_ionRangeSlider',
                                'lazy_masked_inputs',
                                'lazy_character_counter',
                                'lazy_parsleyjs',
                                'app/components/sms/bulkSmsCtrl.js',
                                'app/components/sms/bulkSmsDirective.js',
                                'app/components/sms/bulkSmsUnicodeCtrl.js'
                            ], {serie:true} );
                        }]
                    },
                    data: {
                        pageTitle: 'Send Bulk SMS'
                    }
                })
                .state("restricted.personalised", {
                    url: "/personalised_sms",
                    templateUrl: 'app/components/forms/advancedView.html',
                    controller: 'advancedCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_ionRangeSlider',
                                'lazy_masked_inputs',
                                'lazy_character_counter',
                                'app/components/forms/advancedController.js'
                            ], {serie:true} );
                        }]
                    },
                    data: {
                        pageTitle: 'Advanced Elements'
                    }
                })

                .state("restricted.profile", {
                    url: "/profile",
                    templateUrl: 'app/components/profile/profile.html',
                    controller: 'profileCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_ionRangeSlider',
                                'lazy_masked_inputs',
                                'lazy_character_counter',
                                'app/components/profile/profileController.js'
                                ], {serie:true} );
                        }]
                    },
                    data: {
                        pageTitle: 'Profile'
                    }
                })

                .state("restricted.transactions", {
                    url: "/transactions",
                    templateUrl: 'app/components/profile/transaction.html',
                    controller: 'transactionCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_ionRangeSlider',
                                'lazy_masked_inputs',
                                'lazy_character_counter',
                                'app/components/profile/transactionController.js'
                                ], {serie:true} );
                        }]
                    },
                    data: {
                        pageTitle: 'Profile'
                    }
                })

                .state("restricted.addUser", {
                    url: "/addUser",
                    templateUrl: 'app/components/user/addUser.html',
                    controller: 'addUserController',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_ionRangeSlider',
                                'lazy_masked_inputs',
                                'lazy_character_counter',
                                'lazy_parsleyjs',
                                'app/modules/angular-selectize.js',
                                'app/components/user/addUserController.js'
                                

                                ], {serie:true} );
                        }]
                    },
                    data: {
                        pageTitle: 'User'
                    }
                })
                .state("restricted.addgroup", {
                    url: "/group/add",
                    templateUrl: 'app/components/contacts/add_group.html',
                    controller: 'addGroupCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_ionRangeSlider',
                                'lazy_masked_inputs',
                                'lazy_character_counter',
                                'app/components/contacts/addGroupCtrl.js'
                            ], {serie:true} );
                        }]
                    },
                    data: {
                        pageTitle: 'Add Group'
                    }
                })

                .state("restricted.managegroup", {
                    url: "/group/manage",
                    templateUrl: 'app/components/contacts/manage_group.html',
                    controller: 'manageGroupCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_ionRangeSlider',
                                'lazy_masked_inputs',
                                'lazy_character_counter',
                                'app/components/contacts/manageGroupCtrl.js',
                                'app/components/contacts/manageGroupDirective.js'
                            ], {serie:true} );
                        }],
                        // groupData: function (groupFactory, $stateParams) {
                        //     return groupFactory.getGroupData();
                        // }
                    },
                    data: {
                        pageTitle: 'Manage Group'
                    }
                })

                .state("restricted.groupcontact", {
                    url: "/group/contacts/:groupId",
                    templateUrl: 'app/components/contacts/group_contact.html',
                    controller: 'groupContactCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_ionRangeSlider',
                                'lazy_masked_inputs',
                                'lazy_character_counter',
                                'app/components/contacts/groupContactCtrl.js'
                            ], {serie:true} );
                        }]
                    },
                    data: {
                        pageTitle: 'Group Contacts'
                    }
                })

                .state("restricted.addcontact", {
                    url: "/contact/add",
                    templateUrl: 'app/components/contacts/add_contact.html',
                    controller: 'addContactCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_ionRangeSlider',
                                'lazy_masked_inputs',
                                'lazy_character_counter',
                                'app/components/contacts/addContactCtrl.js'
                            ], {serie:true} );
                        }]
                    },
                    data: {
                        pageTitle: 'Add Contact'
                    }
                })

                .state("restricted.managecontacts", {
                    url: "/contact/manage",
                    templateUrl: 'app/components/contacts/manage_contacts.html',
                    controller: 'manageContactsCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_ionRangeSlider',
                                'lazy_masked_inputs',
                                'lazy_character_counter',
                                'app/components/contacts/manageContactsCtrl.js',
                                'app/components/contacts/manageContactsDirective.js'
                            ], {serie:true} );
                        }]
                    },
                    data: {
                        pageTitle: 'Manage Contacts'
                    }
                })

                .state("restricted.addtemplate", {
                    url: "/template/add",
                    templateUrl: 'app/components/template/add_template.html',
                    controller: 'addTemplateCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_ionRangeSlider',
                                'lazy_masked_inputs',
                                'lazy_character_counter',
                                'app/components/template/addTemplateCtrl.js'
                            ], {serie:true} );
                        }]
                    },
                    data: {
                        pageTitle: 'Add Template'
                    }
                })

                .state("restricted.managetemplate", {
                    url: "/template/manage",
                    templateUrl: 'app/components/template/manage_template.html',
                    controller: 'manageTemplateCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_ionRangeSlider',
                                'lazy_masked_inputs',
                                'lazy_character_counter',
                                'app/components/template/manageTemplateCtrl.js',
                                'app/components/template/manageTemplateDirective.js'
                            ], {serie:true} );
                        }]
                    },
                    data: {
                        pageTitle: 'Add Template'
                    }
                })

                .state("restricted.senderid", {
                    url: "/senderid",
                    templateUrl: 'app/components/senderid/senderid.html',
                    controller: 'senderIdCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_ionRangeSlider',
                                'lazy_masked_inputs',
                                'lazy_character_counter',
                                'app/components/senderid/senderIdCtrl.js',
                                'app/components/senderid/senderIdDirective.js'
                            ], {serie:true} );
                        }]
                    },
                    data: {
                        pageTitle: 'Sender ID'
                    }
                })
        }
    ])
    .run(['$rootScope', '$location', '$cookieStore', '$http',
    function ($rootScope, $location, $cookieStore, $http) {
        // keep user logged in after page refresh
        $rootScope.globals = $cookieStore.get('globals') || {};
        if ($rootScope.globals.currentUser) {
            $http.defaults.headers.common['Authorization'] = $rootScope.globals.currentUser.auth_key; // jshint ignore:line
        }
  
        $rootScope.$on('$locationChangeStart', function (event, next, current) {
            // redirect to login page if not logged in
            if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
                $location.path('/login');
            }
        });
    }]);