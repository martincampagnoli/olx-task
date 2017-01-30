patternLockApp.controller('baseController',['$scope','$timeout', 'baseService', function ($scope, $timeout, baseService){
			
			$scope.debug = false;		
			$scope.currentMessage = common.constants.messages.defaultMessage;	
			$scope.currentState = common.constants.states.locked;
			$scope.stateUnlocked = common.constants.states.unlocked;
			
			$scope.comparePattern = function(inputPattern, savedPattern){
				if(inputPattern == savedPattern) return true;
				return false;
			 }
			//submits the entered pattern to validate it against backend
			$scope.submitPattern = function(){
				$scope.$broadcast(common.constants.broadcastMessages.getPattern);
				$scope.currentPattern = $scope.inputPattern;
				UIHelper.blockUI();
				$timeout(function(){
					baseService.validatePattern($scope.currentPattern).then(
						function(response){
							if (response){
								$scope.changeState(common.constants.states.unlocked);
							}
							else{
								$scope.currentMessage = common.constants.messages.wrongPattern;
								$scope.$broadcast(common.constants.broadcastMessages.error);
							}
						UIHelper.unblockUI();
						},
						function(error){
							$scope.currentMessage = common.constants.messages.errorValidatingPattern;
							$scope.$broadcast(common.constants.broadcastMessages.error);
							$timeout(function(){$scope.changeState(common.constants.states.locked);},3000);
							UIHelper.unblockUI();
						}
					);
				},500);
				$timeout(function(){
					if($scope.currentState !== common.constants.states.unlocked) 
						$scope.currentMessage = common.constants.messages.defaultMessage;
					$scope.$broadcast(common.constants.broadcastMessages.reset);
				},1000);
			};
					
			$scope.changeState = function(str){
				$scope.currentState = str;
				switch (str){
					case common.constants.states.unlocked:
							$scope.currentMessage = common.constants.messages.validPattern;
							$scope.$broadcast(common.constants.broadcastMessages.disable);
							break;
					case common.constants.states.change:
							$scope.currentMessage = common.constants.messages.changePattern;
							$scope.$broadcast(common.constants.broadcastMessages.enable);
							break;
					case common.constants.states.confirm:
							$scope.currentMessage = common.constants.messages.confirmPattern;
							break;
					case common.constants.states.end:
							$timeout(function(){$scope.$broadcast(common.constants.broadcastMessages.reset);},1000);
							$scope.$broadcast(common.constants.broadcastMessages.disable);	
							break;					
					default:
							$scope.currentMessage = common.constants.messages.defaultMessage;	
							$scope.firstPattern = '';
							$scope.secondPattern = '';
							$scope.$broadcast(common.constants.broadcastMessages.enable);					
				}
			};
				
			$scope.changePattern = function(){
				UIHelper.blockUI();
				$timeout(function(){
					$scope.changeState(common.constants.states.change);
					UIHelper.unblockUI();
				},250);	
			};
			
			$scope.saveFirstPattern = function(){
				UIHelper.blockUI();
				$timeout(function(){
					$scope.changeState(common.constants.states.confirm);
					$scope.$broadcast(common.constants.broadcastMessages.getPattern);
					$scope.firstPattern = $scope.inputPattern;
					$scope.$broadcast(common.constants.broadcastMessages.reset);
					UIHelper.unblockUI();
				},250);	
			};
			
			$scope.confirmPattern = function(){
				UIHelper.blockUI();
				$timeout(function(){
					$scope.$broadcast(common.constants.broadcastMessages.getPattern);
					$scope.secondPattern = $scope.inputPattern;
					if ($scope.comparePattern($scope.firstPattern, $scope.secondPattern)){
						baseService.storePattern($scope.secondPattern).then(function(){
								$scope.currentMessage = common.constants.messages.rightPattern;
							},
							function(error){
								if (error.status == common.constants.common.patternTooShortErrorCode) {
									$scope.currentMessage = common.constants.messages.patternTooShort;
								}
								else{
									$scope.currentMessage = common.constants.messages.errorSavingNewPattern;
								}
								$scope.$broadcast(common.constants.broadcastMessages.error);
								$timeout(function(){},5000);
							}
						);							
								
						$scope.changeState(common.constants.states.end);
					}
					else{
						$scope.currentMessage = common.constants.messages.mismatchPattern;
						$scope.$broadcast(common.constants.broadcastMessages.error);
						$scope.changeState(common.constants.states.end);
					}
					$scope.$broadcast(common.constants.broadcastMessages.enable);
					UIHelper.unblockUI();
					$timeout(function(){
						$scope.changeState(common.constants.states.unlocked);
					},1000);	
				},250);	
			};
					
			$scope.refreshDisplay = function(){
				UIHelper.blockUI();
				$timeout(function(){
					$scope.changeState(common.constants.states.locked);
					UIHelper.unblockUI();
				},250);	
			};
}]);