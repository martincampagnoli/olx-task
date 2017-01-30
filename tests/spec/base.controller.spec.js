
describe("Base Controller specs", function() {
	var mockBaseService, errorModeService, callback, errorCallback;

    beforeEach(module('patternLockApp'));
  
    var scope;
    beforeEach(inject(function($rootScope, $controller,_$timeout_) {
        scope = $rootScope.$new();
		$timeout =  _$timeout_;
		mockBaseService = jasmine.createSpy('baseService');
        $controller("baseController", {
            $scope: scope,
			$timeout: $timeout,
			baseService: mockBaseService
        });
    }));
 
    it("should change the state to 'confirm' and save first pattern after calling saveFirstPattern method", function() {
        spyOn(scope, 'changeState');
		spyOn(UIHelper, 'blockUI');
		spyOn(UIHelper, 'unblockUI');
		scope.inputPattern = '1234';
	
		scope.saveFirstPattern();
		$timeout.flush();
	
		expect(scope.changeState).toHaveBeenCalled();
		expect(scope.changeState).toHaveBeenCalledWith(common.constants.states.confirm);
		expect(scope.firstPattern).toEqual(scope.inputPattern);
    });
	
	it("should change the state back to 'locked' after a refresh", function() {
        spyOn(scope, 'changeState');
		spyOn(UIHelper, 'blockUI');
		spyOn(UIHelper, 'unblockUI');
	
		scope.refreshDisplay();
		$timeout.flush();
	
		expect(scope.changeState).toHaveBeenCalled();
		expect(scope.changeState).toHaveBeenCalledWith(common.constants.states.locked);
    });
	
	it("should change the state to 'change' after executing changePattern method", function() {
        spyOn(scope, 'changeState');
		spyOn(UIHelper, 'blockUI');
		spyOn(UIHelper, 'unblockUI');
	
		scope.changePattern();
		$timeout.flush();
	
		expect(scope.changeState).toHaveBeenCalled();
		expect(scope.changeState).toHaveBeenCalledWith(common.constants.states.change);
    });
	
	it("should display a valid pattern message when unlocking the app", function() {
        spyOn(UIHelper, 'blockUI');
		spyOn(UIHelper, 'unblockUI');
	
		scope.changeState(common.constants.states.unlocked);

		expect(scope.currentMessage).toEqual(common.constants.messages.validPattern);
    });
	
	it("should display a change pattern message when changing the pattern", function() {
        spyOn(UIHelper, 'blockUI');
		spyOn(UIHelper, 'unblockUI');
	
		scope.changeState(common.constants.states.change);

		expect(scope.currentMessage).toEqual(common.constants.messages.changePattern);
    });
	
	it("should display a confirm pattern message when confirming the new pattern", function() {
        spyOn(UIHelper, 'blockUI');
		spyOn(UIHelper, 'unblockUI');
	
		scope.changeState(common.constants.states.confirm);

		expect(scope.currentMessage).toEqual(common.constants.messages.confirmPattern);
    });
	
	it("should display a default pattern message when the app is locked", function() {
        spyOn(UIHelper, 'blockUI');
		spyOn(UIHelper, 'unblockUI');
	
		scope.changeState(common.constants.states.locked);

		expect(scope.currentMessage).toEqual(common.constants.messages.defaultMessage);
    });
	
	it("should display a default pattern message when the app is loaded for the first time", function() {
		expect(scope.currentMessage).toEqual(common.constants.messages.defaultMessage);
    });
	
	it("should not display debug info by default ", function() {
		expect(scope.debug).toBe(false);
    });
	
	it("should return false if the patterns are different", function() {
		var pattern1 = '111', pattern2 = '234', result;
	
		result = scope.comparePattern(pattern1,pattern2);

		expect(result).toBe(false);
    });
	
	it("should return true if the patterns are equals", function() {
		var pattern1 = '111', pattern2 = '111', result;
	
		result = scope.comparePattern(pattern1,pattern2);

		expect(result).toBe(true);
    });
	
	it("should unlock the app if the pattern entered is equal to default or stored", function() {
		mockBaseService.validatePattern = jasmine.createSpy('validatePattern').and.returnValue({ then: function (callback) { callback(true); } });

		spyOn(UIHelper, 'blockUI');
		spyOn(UIHelper, 'unblockUI');
		spyOn(scope, 'changeState');
		scope.inputPattern = '1234';
	
		scope.submitPattern();
		$timeout.flush();
		scope.$digest;
		
		expect(scope.changeState).toHaveBeenCalled();
		expect(scope.changeState).toHaveBeenCalledWith(common.constants.states.unlocked);
    });
	
	it("should disable the pattern keyboard is the app is unlocked", function() {
		mockBaseService.validatePattern = jasmine.createSpy('validatePattern').and.returnValue({ then: function (callback) { callback(true); } });

		spyOn(UIHelper, 'blockUI');
		spyOn(UIHelper, 'unblockUI');
		spyOn(scope, '$broadcast');
		scope.inputPattern = '1234';
	
		scope.submitPattern();
		$timeout.flush();
		scope.$digest;
		
		expect(scope.$broadcast).toHaveBeenCalled();
		expect(scope.$broadcast).toHaveBeenCalledWith(common.constants.broadcastMessages.disable);
    });
	
	it("should enable the pattern keyboard again is the app is unlocked and the user choose to change pattern", function() {
		spyOn(UIHelper, 'blockUI');
		spyOn(UIHelper, 'unblockUI');
		spyOn(scope, '$broadcast');
		scope.inputPattern = '1234';
	
		scope.changePattern();
		$timeout.flush();
		
		expect(scope.$broadcast).toHaveBeenCalled();
		expect(scope.$broadcast).toHaveBeenCalledWith(common.constants.broadcastMessages.enable);
    });
	
	it("should keep the app locked if the pattern entered is not equal to default or stored", function() {
		mockBaseService.validatePattern = jasmine.createSpy('validatePattern').and.returnValue({ then: function (callback) { callback(false); } });

		spyOn(UIHelper, 'blockUI');
		spyOn(UIHelper, 'unblockUI');
		spyOn(scope, 'changeState');
		spyOn(scope, '$broadcast');
		scope.inputPattern = '1234';
		errorModeService = false;
	
		scope.submitPattern();
		$timeout.flush();
		scope.$digest;
		
		expect(scope.changeState).not.toHaveBeenCalled();
		expect(scope.$broadcast).toHaveBeenCalled();
		expect(scope.$broadcast).toHaveBeenCalledWith(common.constants.broadcastMessages.error);
    });
	
	it("should keep the app locked and display an error if the 'backend' fails", function() {
		mockBaseService.validatePattern = jasmine.createSpy('validatePattern').and.returnValue({ then: function (callback, errorCallback) { errorCallback({ status: 501 }); } });
		
		spyOn(UIHelper, 'blockUI');
		spyOn(UIHelper, 'unblockUI');
		spyOn(scope, 'changeState');
		spyOn(scope, '$broadcast');
		scope.inputPattern = '1234';
	
		scope.submitPattern();
		$timeout.flush();
		scope.$digest;
		
		expect(scope.changeState).not.toHaveBeenCalled();
		expect(scope.$broadcast).toHaveBeenCalled();
		expect(scope.$broadcast).toHaveBeenCalledWith(common.constants.broadcastMessages.error);
    });
	
	it("should store the new pattern when it is entered twice the same and meet the criteria", function() {
		mockBaseService.storePattern = jasmine.createSpy('storePattern').and.returnValue({ then: function (callback) { callback(true); } });
		
		spyOn(UIHelper, 'blockUI');
		spyOn(UIHelper, 'unblockUI');
		scope.firstPattern = '1234';
		scope.inputPattern = '1234';
	
		scope.confirmPattern();
		$timeout.flush();
		scope.$digest;
		
		expect(scope.currentMessage).toEqual(common.constants.messages.rightPattern);
    });
	
	it("should not store the new pattern when it is entered twice but they are not the same and display an error in keyboard", function() {
		mockBaseService.storePattern = jasmine.createSpy('storePattern').and.returnValue({ then: function (callback) { callback(true); } });
		
		spyOn(UIHelper, 'blockUI');
		spyOn(UIHelper, 'unblockUI');
		spyOn(scope, '$broadcast');
		scope.firstPattern = '1111';
		scope.inputPattern = '1234';
	
		scope.confirmPattern();
		$timeout.flush();
		scope.$digest;
		
		expect(scope.currentMessage).toEqual(common.constants.messages.mismatchPattern);
		expect(scope.$broadcast).toHaveBeenCalled();
		expect(scope.$broadcast).toHaveBeenCalledWith(common.constants.broadcastMessages.error);
    });
	
	it("should not store the new pattern when it is entered twice but its lenght is less than 3, and display an error in keyboard", function() {
		mockBaseService.storePattern = jasmine.createSpy('storePattern').and.returnValue({ then: function (callback, errorCallback) { errorCallback({ status: 501 }); } });
		
		spyOn(UIHelper, 'blockUI');
		spyOn(UIHelper, 'unblockUI');
		spyOn(scope, '$broadcast');
		scope.firstPattern = '11';
		scope.inputPattern = '11';
	
		scope.confirmPattern();
		$timeout.flush();
		scope.$digest;
		
		expect(scope.currentMessage).toEqual(common.constants.messages.patternTooShort);
		expect(scope.$broadcast).toHaveBeenCalled();
		expect(scope.$broadcast).toHaveBeenCalledWith(common.constants.broadcastMessages.error);
    });
	
	it("should not store the new pattern when the 'backend' fails, and display an error in keyboard", function() {
		mockBaseService.storePattern = jasmine.createSpy('storePattern').and.returnValue({ then: function (callback, errorCallback) { errorCallback({ status: 500 }); } });
		
		spyOn(UIHelper, 'blockUI');
		spyOn(UIHelper, 'unblockUI');
		spyOn(scope, '$broadcast');
		scope.firstPattern = '1111';
		scope.inputPattern = '1111';
	
		scope.confirmPattern();
		$timeout.flush();
		scope.$digest;
		
		expect(scope.currentMessage).toEqual(common.constants.messages.errorSavingNewPattern);
		expect(scope.$broadcast).toHaveBeenCalled();
		expect(scope.$broadcast).toHaveBeenCalledWith(common.constants.broadcastMessages.error);
    });

});