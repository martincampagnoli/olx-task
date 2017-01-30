var patternLockAppDev = angular.module('patternLockAppE2E', ['patternLockApp', 'ngMockE2E']);

patternLockAppDev.run(function($httpBackend) {
	var defaultPattern = "41863";
	var customizedPattern = '';

	// returns the current default pattern if it has not been changed
	$httpBackend.whenGET('/pattern').respond(function(){
		if(customizedPattern == '') return [200, defaultPattern, {}];
		return [200, customizedPattern, {}];
	});

	// update the pattern for the app
	$httpBackend.whenPOST('/storePattern').respond(function(method, url, data) {
		if (data.length >= common.constants.common.minLength){
			customizedPattern = angular.fromJson(data);
			return [200, customizedPattern, {}];
		}
		return [501, customizedPattern, {}];
	});
});