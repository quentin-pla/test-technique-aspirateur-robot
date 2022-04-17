let _longPressTimeout: NodeJS.Timeout | undefined = undefined;
let _actionInterval: NodeJS.Timer | undefined = undefined;

/**
 * Start long press timeout (for plus/minus buttons)
 * @param action action to execute in a loop
 * @param actionExecutionInterval action execution interval
 */
export const startLongPressTimeout = (action: () => void, actionExecutionInterval: number = 100) => {
	if (!!_longPressTimeout) clearTimeout(_longPressTimeout);
	_longPressTimeout = setTimeout(() => {
		if (!!_longPressTimeout) clearTimeout(_longPressTimeout);
		_longPressTimeout = undefined;
		_actionInterval = setInterval(action, actionExecutionInterval);
	}, 300)
}

/**
 * Reset long press timeout
 */
export const resetLongPressTimeout = () => {
	if (!!_longPressTimeout) {
		clearTimeout(_longPressTimeout);
		_longPressTimeout = undefined;
	}
	if (!!_actionInterval) {
		clearInterval(_actionInterval);
		_actionInterval = undefined;
	}
}