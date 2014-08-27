'use strict';

angular.module('groceryListApp')
    .service('ShoppingListService', [
        '$localDatabase',
        function ShoppingListService($localDatabase) {
            // AngularJS will instantiate a singleton by calling "new" on this function
            var lists= [],
                DbName = 'shopping-list';

            function nameExists(name) {
                for (var i in lists) {
                    if (lists[i].title === name) {
                        return true;
                    }
                }
                return false;
            }

            function storeInDb() {
                $localDatabase.set(DbName, lists);
                getFromDb();
            }

            function getFromDb() {
                $localDatabase.get(DbName).then(function (results) {
                    lists = results || [];
                });
            }

            // Get from local storage on load
            getFromDb();

            return {
                // getters
                getShoppingList: function () {
                    return lists;
                },
                getShoppingListCount: function () {
                    return lists.length;
                },
                getAList: function (id) {
                    return lists[id];
                },

                // setters
                addShoppingList: function (item, defaulter) {
                    if (!defaulter) {
                        defaulter = false;
                    }
                    if (item.list.title && !nameExists(item.list.title)) {
                        getFromDb();
                        item.list.default = defaulter;
                        if (!lists) {
                            lists = [];
                        }
                        lists.push(item);
                        storeInDb();
                    }
                }
            };
        }
    ]);
