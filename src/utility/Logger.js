export const WLog = {
    info: (message, funcName, data = {}) => {
        data.functionName = funcName
        console.info(message, data)
        // winstonLog.info(message, data)
    },
    warn: (message, funcName, data = {}) => {
        data.functionName = funcName
        console.warn(message, data)
        // winstonLog.warn(message, data)
    },
    error: (message, funcName, data = {}) => {
        data.functionName = funcName
        console.error(message, data)
        // winstonLog.error(message, data)
    },
}
