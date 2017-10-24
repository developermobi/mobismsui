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
                    templateUrl: 'app/views/error.html',
                    authorize : true,
                })
                .state("error.404", {
                    url: "/404",
                    templateUrl: 'app/components/pages/error_404View.html',
                    authorize : true,
                })
                .state("error.500", {
                    url: "/500",
                    templateUrl: 'app/components/pages/error_500View.html',
                    authorize : true,
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
                    },
                    authorize : true,
                })
                //LOGOUT
                .state('restricted.logout', {
                    url: "/logout",
                    resolve: {
                        logout: ['AuthenticationService', function(AuthenticationService) {
                            AuthenticationService.logout();
                        }]
                    },
                    authorize : true,
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
                                //'app/components/header/headerController.js'
                            ],{ serie: true });
                        }]
                    },
                    authorize : true,
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
                                'lazy_charts_c3',
                                'lazy_clndr',
                                'app/components/dashboard/dashboardController.js'
                            ], {serie: true} );
                        }]
                    },
                    data: {
                        pageTitle: 'Dashboard'
                    },
                    authorize : true,
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
                    },
                    authorize : true,
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
                    },
                    authorize : true,
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
                    },
                    authorize : true,
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
                    },
                    authorize : true,
                })

                .state("restricted.addUser", {
                    url: "/user/add",
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
                    },
                    authorize : false,
                })

                .state("restricted.manageUser", {
                    url: "/user/manage",
                    templateUrl: 'app/components/user/manageUser.html',
                    controller: 'manageUserController',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_ionRangeSlider',
                                'lazy_masked_inputs',
                                'lazy_character_counter',
                                'lazy_parsleyjs',
                                'app/modules/angular-selectize.js',
                                'app/components/user/manageUserController.js'
                                

                                ], {serie:true} );
                        }]
                    },
                    data: {
                        pageTitle: 'User'
                    },
                    authorize : false,
                })
                .state("restricted.editUser", {
                    url: "/user/edit/:userId",
                    templateUrl: 'app/components/user/editUser.html',
                    controller: 'editUserController',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_ionRangeSlider',
                                'lazy_masked_inputs',
                                'lazy_character_counter',
                                'lazy_parsleyjs',
                                'app/modules/angular-selectize.js',
                                'app/components/user/editUserController.js'
                                

                                ], {serie:true} );
                        }]
                    },
                    data: {
                        pageTitle: 'User'
                    },
                    authorize : false,
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
                    },
                    authorize : true,
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
                    },
                    authorize : true,
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
                    },
                    authorize : true,
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
                    },
                    authorize : true,
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
                    },
                    authorize : true,
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
                    },
                    authorize : true,
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
                    },
                    authorize : true,
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
                    },
                    authorize : true,
                })

                .state("restricted.dailyReport", {
                    url: "/report/daily",
                    templateUrl: 'app/components/report/dailyReport.html',
                    controller: 'dailyReportCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_ionRangeSlider',
                                'lazy_masked_inputs',
                                'lazy_character_counter',
                                'app/components/report/dailyReportCtrl.js'
                            ], {serie:true} );
                        }]
                    },
                    data: {
                        pageTitle: 'Daliy Report'
                    },
                    authorize : true,
                })

                .state("restricted.customReport", {
                    url: "/report/custom",
                    templateUrl: 'app/components/report/customReport.html',
                    controller: 'customReportCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_ionRangeSlider',
                                'lazy_masked_inputs',
                                'lazy_character_counter',
                                'app/components/report/customReportCtrl.js'
                            ], {serie:true} );
                        }]
                    },
                    data: {
                        pageTitle: 'Custom Report'
                    },
                    authorize : true,
                })

                .state("restricted.detailReport", {
                    url: "/report/custom/:jobId/:status",
                    templateUrl: 'app/components/report/detailReport.html',
                    controller: 'detailReportCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_ionRangeSlider',
                                'lazy_masked_inputs',
                                'lazy_character_counter',
                                'app/components/report/detailReportCtrl.js'
                            ], {serie:true} );
                        }]
                    },
                    data: {
                        pageTitle: 'Detail Report'
                    },
                    authorize : true,
                })

                .state("restricted.scheduleReport", {
                    url: "/report/schedule",
                    templateUrl: 'app/components/report/scheduleReport.html',
                    controller: 'scheduleReportCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_ionRangeSlider',
                                'lazy_masked_inputs',
                                'lazy_character_counter',
                                'app/components/report/scheduleReportCtrl.js'
                            ], {serie:true} );
                        }]
                    },
                    data: {
                        pageTitle: 'Schedule Report'
                    },
                    authorize : true,
                })
                .state("restricted.exportReport", {
                    url: "/report/export",
                    templateUrl: 'app/components/report/exportReport.html',
                    controller: 'exportReportCtrl',
                    resolve: {
                        deps: ['$ocLazyLoad', function($ocLazyLoad) {
                            return $ocLazyLoad.load([
                                'lazy_ionRangeSlider',
                                'lazy_masked_inputs',
                                'lazy_character_counter',
                                'app/components/report/exportReportCtrl.js'
                            ], {serie:true} );
                        }]
                    },
                    data: {
                        pageTitle: 'Export Report'
                    },
                    authorize : true,
                })
                
        }
    ])
    .run(['$rootScope', '$location', '$cookieStore', '$http','$state',
    function ($rootScope, $location, $cookieStore, $http, $state) {
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