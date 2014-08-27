'use strict';

angular.module('groceryListApp')
    .controller('ListBoardCtrl', [
        '$scope',
        'ShoppingListService',
        function ($scope, ShoppingListService) {
            var lists = ShoppingListService.getShoppingList();
            $scope.lists = lists;
        }
    ]);