'use strict';

angular.module('utilities.module', ['ApplicationSettings']);

angular.module('utilities.module')
    .service('$localStorage', [
        function LocalStorageService() {
            // AngularJS will instantiate a singleton by calling "new" on this function
            var storage = window.localStorage;

            if (!storage) {
                storage = {};
            }

            return {
                get: function (key) {
                    var returnObj;
                    try {
                        returnObj = JSON.parse(storage[key]);
                    }
                    catch (e) {
                        returnObj = storage[key];
                    }
                    return returnObj;
                },
                set: function (key, value) {
                    var save = function () {
                        if (typeof value === 'object') {
                            storage[key] = JSON.stringify(value);
                            return;
                        }
                        storage[key] = value;
                    };
                    save();
                }
            };
        }
    ])
    .service('$localDatabase', [
        '$q',
        '$localStorage',
        'ApplicationSettings',
        function LocalDatabase($q, $localStorage, ApplicationSettings) {
            // AngularJS will instantiate a singleton by calling "new" on this function

            var isAvailable = false;
            var deferred;
            if (!window.openDatabase || !ApplicationSettings.LocalDatabase.enabled) {
                return {
                    isAvailable: isAvailable,
                    get: function (key) {
                        deferred = $q.defer();
                        deferred.resolve($localStorage.get(key));
                        return deferred.promise;
                    },
                    set: function (key, value) {
                        deferred = $q.defer();
                        deferred.resolve($localStorage.set(key, value));
                        return deferred.promise;
                    }
                };
            }
            isAvailable = true;

            /*
             * Database Access Methods
             * 1) openDatabase
             * 2) transaction
             * 3) executeSql
             */

            /*
             * Bootstrap
             */
            var DbInstance = {
                    name: 'StorageData',
                    version: '1.0',
                    description: 'Stores the key and value data',
                    size: 2 * 1024 * 1024
                }, dbAccessor,
                tableInstance = {
                    name: 'StorageTable',
                    columns: {
                        '1': 'key',
                        '2': 'value'
                    }
                };

            function bootstrap() {
                dbAccessor = openDatabase(DbInstance.name, DbInstance.version, DbInstance.description, DbInstance.size);
            }

            /*
             * Creates Data Access Object
             */
            function createDAO() {
                deferred = $q.defer();
                dbAccessor.transaction(function (tx) {
                    tx.executeSql('CREATE TABLE IF NOT EXISTS ' +
                        tableInstance.name +
                        ' (' + tableInstance.columns[1] + ' VARCHAR UNIQUE,' +
                        tableInstance.columns[2] + ' TEXT)', [], function () {
                        deferred.resolve(true);
                    });
                });
                return deferred.promise;
            }

            function insertDAO(key, value) {
                deferred = $q.defer();
                dbAccessor.transaction(function (tx) {
                    tx.executeSql('INSERT OR REPLACE INTO ' +
                        tableInstance.name +
                        ' (' + tableInstance.columns[1] + ',' +
                        tableInstance.columns[2] +
                        ') VALUES (?, ?)', [key, value], function () {
                        deferred.resolve(true);
                    });
                });
                return deferred.promise;
            }

            function returnDAO(key) {
                deferred = $q.defer();
                dbAccessor.transaction(function (tx) {
                    tx.executeSql('SELECT * FROM ' +
                            tableInstance.name +
                            ' WHERE key = ?',
                        [key], function (tx, results) {
                            var len = results.rows.length, i;
                            for (i = 0; i < len; i++) {
                                deferred.resolve(results.rows.item(i).value);
                            }
                        });
                });
                return deferred.promise;
            }

            /*
             * Identify and define Data Access Objects
             */
            bootstrap();
            createDAO();

            /*
             * Returns the database service
             */
            return {
                isAvailable: isAvailable,
                get: function (key) {
                    return returnDAO(key);
                },
                set: function (key, value) {
                    return insertDAO(key, value);
                }
            };
        }
    ]);