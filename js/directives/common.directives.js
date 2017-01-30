patternLockApp.directive('patternLock', function() {
    return {
        restrict: "A",
        scope: false,
        link: function (scope, elem) {
				
			//initializes the component 
			var lock = new PatternLock("#patternContainer", {radius:30,margin:21});
	
			//sets the $on for the necessary methods
			scope.$on(common.constants.broadcastMessages.reset, function(){
				lock.reset();
			});
			
			scope.$on(common.constants.broadcastMessages.enable, function(){
				lock.enable();
			});
			
			scope.$on(common.constants.broadcastMessages.disable, function(){
				lock.disable();
			});
			
			scope.$on(common.constants.broadcastMessages.error, function(){
				lock.error();
			});
			
			scope.$on(common.constants.broadcastMessages.getPattern, function(){
				scope.inputPattern = lock.getPattern();
			});
			
			//sets the event handler for the mouse up event
			elem.bind('mouseup touchend', function(){
				switch (scope.currentState){
					case common.constants.states.locked: scope.submitPattern(); break;
					case common.constants.states.change: scope.saveFirstPattern(); break;
					case common.constants.states.confirm: scope.confirmPattern(); break;
				}
			});
        }
    };
});