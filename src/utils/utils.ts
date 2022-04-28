let _longPressTimeout: NodeJS.Timeout | undefined = undefined;
let _actionInterval: NodeJS.Timer | undefined = undefined;

export const isOnMobile = (): boolean => {
    return document.body.offsetWidth < 768;
}

export const handleLongPress = (action: () => void, actionExecutionInterval: number = 100) => {
    if (!!_longPressTimeout) clearTimeout(_longPressTimeout);
    _longPressTimeout = setTimeout(() => {
        if (!!_longPressTimeout) clearTimeout(_longPressTimeout);
        _longPressTimeout = undefined;
        _actionInterval = setInterval(action, actionExecutionInterval);
    }, 300)
}

export const clearLongPress = () => {
    if (!!_longPressTimeout) {
        clearTimeout(_longPressTimeout);
        _longPressTimeout = undefined;
    }
    if (!!_actionInterval) {
        clearInterval(_actionInterval);
        _actionInterval = undefined;
    }
}