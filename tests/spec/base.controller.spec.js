
describe("Base Controller specs", function() {
 
    beforeEach(module('patternLockApp'));
  
    var scope;
    beforeEach(inject(function($rootScope, $controller,_$timeout_) {
        scope = $rootScope.$new();
		$timeout =  _$timeout_;
        $controller("baseController", {
            $scope: scope,
			$timeout: $timeout
        });
    }));
 
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

});