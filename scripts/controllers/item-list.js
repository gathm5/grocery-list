'use strict';

angular.module('groceryListApp')
    .controller('ItemListCtrl', [
        '$scope',
        'ShoppingListService',
        '$stateParams',
        function ($scope, ShoppingListService, $stateParams) {
            var content = ShoppingListService.getAList(parseInt($stateParams.id));
            $scope.lists = content.list.items;
        }
    ]);