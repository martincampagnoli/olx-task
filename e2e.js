var patternLockAppDev = angular.module('patternLockAppE2E', ['patternLockApp', 'ngMockE2E']);

patternLockAppDev.run(function($httpBackend) {
	var defaultPattern = "41863";
	var customizedPattern = '';

	// returns the current default pattern if it has not been changed
	// changes the return number to 500+ to throw an error
	$httpBackend.whenPOST('/validatePattern').respond(function(method, url, data){
		if(customizedPattern == '') {
			var response = data == defaultPattern;
			return [200, response , {}];
		}
		var response = data == customizedPattern;
		return [200, response , {}];	
	});

	// updates the pattern for the app
	$httpBackend.whenPOST('/storePattern').respond(function(method, url, data) {
		if (data.length >= common.constants.common.minLength){
			customizedPattern = angular.fromJson(data);
			return [200, customizedPattern, {}];
		}
		return [501, customizedPattern, {}];
	});
});
