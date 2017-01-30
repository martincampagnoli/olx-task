function constantDefinition() {

	var COMMON = {
			minLength: 3,
			patternTooShortErrorCode: 501
	},	
	MESSAGES = {
		defaultMessage: 'Enter the correct pattern to unlock.',
		validPattern: 'Application is unlocked.',
		changePattern: 'Enter a new pattern.',
		confirmPattern: 'Enter the same pattern again.',
		wrongPattern: 'Incorrect pattern.',
		mismatchPattern: 'The patterns do not match.',
		rightPattern: 'The pattern has been successfully changed.',
		patternTooShort: 'The pattern is too short.',
		errorSavingNewPattern: 'There was an error saving the new pattern.',
		errorValidatingPattern: 'There was an error validating the entered pattern.',
	},
	BROADCAST = {
		reset: '_reset_',
		enable: '_enable_',
		disable: '_disable_',
		error: '_error_',
		getPattern: '_getPattern_'
	},
	STATES = {
		locked: 'LOCKED',
		unlocked: 'UNLOCKED',
		change: 'CHANGE',
		confirm: 'CONFIRM',
		end: 'END',
	};
		
    return {
		common: COMMON,
        messages: MESSAGES,
		broadcastMessages: BROADCAST,
		states: STATES
    };
}

var common = (common === undefined) ? {} : common;

common.constants = constantDefinition();

