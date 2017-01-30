patternLockApp.service('baseService', ['$q', '$http',
    function ($q, $http) {

        return {
			validatePattern: function (pattern) {
					var url = "/validatePattern",
					
					deferred = $q.defer();

					$http.post(url, pattern)
						 .success(function (data) { deferred.resolve(data); })
						 .error(function (data, status) { deferred.reject({ data: data, status: status }); });
					return deferred.promise;
			},
			storePattern: function (newPattern) {
					var url = "/storePattern",
					
					deferred = $q.defer();
					$http.post(url, newPattern)
						 .success(function (data) { deferred.resolve(data); })
						 .error(function (data, status) { deferred.reject({ data: data, status: status }); });
					return deferred.promise;
			}
        };
    }
]);