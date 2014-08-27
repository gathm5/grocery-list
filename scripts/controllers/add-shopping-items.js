'use strict';

angular.module('groceryListApp')
    .controller('AddShoppingItemsCtrl', [
        '$scope',
        'ShoppingListService',
        '$state',
        function ($scope, ShoppingListService, $state) {
            var shopping = {}, dataStore = {};
            shopping.itemsEnabled = false;
            shopping.list = {
                title: null,
                added: null
            };
            shopping.itemTitle = null;
            shopping.quantity = null;
            shopping.items = [];
            shopping.createList = function () {
                if (shopping.list.title) {
                    shopping.list.added = new Date();
                    shopping.itemsEnabled = true;
                    dataStore.list = {
                        title: shopping.list.title,
                        added: shopping.list.added
                    };
                }
            };
            shopping.addItems = function () {
                if (shopping.itemTitle && shopping.quantity && shopping.measure) {
                    shopping.items.push({
                        item: angular.copy(shopping.itemTitle),
                        quantity: angular.copy(shopping.quantity),
                        measure: angular.copy(shopping.measure)
                    });
                    shopping.itemTitle = null;
                    shopping.quantity = null;
                    shopping.measure = null;
                }
            };
            shopping.saveList = function () {
                dataStore.list.items = shopping.items;
                ShoppingListService.addShoppingList(dataStore);
                $state.go('main.list');
            };
            $scope.shopping = shopping;
        }
    ]);