declare enum Status {
    SUCCESS = 0,
    FAIL = 1,
    DUPLICATE_TX = 2
}
declare class Result {
    status: Status;
    constructor(status: Status);
}
export { Result, Status };
