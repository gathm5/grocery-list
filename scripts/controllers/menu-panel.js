'use strict';

angular.module('groceryListApp')
    .controller('MenuPanelCtrl', [
        '$scope',
        '$rootScope',
        '$state',
        function ($scope, $rootScope, $state) {
            $rootScope.menuActive = true;
            $scope.menu = {
                'create': {},
                'view': {},
                'online': {},
                'exit': {}
            };
            $scope.goState = function (id) {
                $rootScope.menuActive = false;
                switch (id) {
                    case 0:
                        $state.go('main.create');
                        break;
                    case 1:
                        $state.go('main.list');
                        break;
                    case 2:
                        break;
                    case 3:
                        break;
                }
            };
            $scope.$on('$stateChangeSuccess', function (toState, toName) {
                if (toName.name === 'main') {
                    $rootScope.menuActive = true;
                }
            });
        }
    ]);
