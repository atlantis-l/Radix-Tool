declare enum Status {
    SUCCESS = 0,
    FAIL = 1
}
declare class Result {
    status: Status | undefined;
    message: string | undefined;
    constructor(status: Status, message?: string | undefined);
}
export { Result, Status };
