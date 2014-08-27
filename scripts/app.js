'use strict';

angular
    .module('groceryListApp', [
        'ngCookies',
        'ngResource',
        'ngSanitize',
        'ui.router',
        'ApplicationSettings',
        'ngTouch',
        'utilities.module',
        'ui.keypress'
    ])
    .config([
        '$stateProvider',
        '$urlRouterProvider',
        '$locationProvider',
        function ($stateProvider, $urlRouterProvider, $locationProvider) {
            $locationProvider.html5Mode(false);
            $urlRouterProvider.otherwise('/');
            $stateProvider
                .state('main', {
                    url: '/main',
                    views: {
                        'Menu@': {
                            templateUrl: '/views/menu-panel.html',
                            controller: 'MenuPanelCtrl'
                        }
                    }
                })
                .state('main.list', {
                    url: '/list',
                    views: {
                        'Header@': {
                            templateUrl: '/views/header.html',
                            controller: 'HeaderCtrl'
                        },
                        'Home@': {
                            templateUrl: '/views/list-board.html',
                            controller: 'ListBoardCtrl',
                            resolve: {
                                'ShoppingListService': 'ShoppingListService'
                            }
                        }
                    }
                })
                .state('main.list.items', {
                    url: '/:id',
                    views: {
                        'Home@': {
                            templateUrl: '/views/item-list.html',
                            controller: 'ItemListCtrl'
                        }
                    }
                })
                .state('main.create', {
                    url: '/create',
                    views: {
                        'Header@': {
                            templateUrl: '/views/header.html',
                            controller: 'HeaderCtrl'
                        },
                        'Home@': {
                            templateUrl: '/views/add-shopping-items.html',
                            controller: 'AddShoppingItemsCtrl'
                        }
                    }
                })
                .state('main.register', {
                    url: '/create',
                    views: {
                        'Header@': {
                            templateUrl: '/views/header.html',
                            controller: 'HeaderCtrl'
                        },
                        'Home@': {
                            templateUrl: '/views/register-online.html',
                            controller: 'RegisterOnlineCtrl'
                        }
                    }
                });
        }
    ])
    .run([
        '$rootScope',
        '$state',
        function ($rootScope, $state) {
            FastClick.attach(document.body);
            $rootScope.$state = $state;

            $state.go('main');
        }
    ]);