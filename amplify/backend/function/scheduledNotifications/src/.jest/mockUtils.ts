jest.mock('../utils', () => {
    return {
        logDebug: jest.fn(),
        logWarning: jest.fn(),
        logException: jest.fn(),
        parseNumber: jest.fn(),
        dateToDayString: jest.fn(),
        getHaffaFirstName: jest.fn(),
        getHaffaFullName: jest.fn(),
        getReservedByUser: jest.fn(),
        subtractDays: jest.fn(),
    };
});