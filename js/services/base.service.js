patternLockApp.service('baseService', ['$q', '$http',
    function ($q, $http) {

        return {
			getPattern: function () {
					var url = "/pattern",
					
					deferred = $q.defer();

					$http.get(url)
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