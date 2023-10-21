declare enum Status {
    SUCCESS = 0,
    FAIL = 1,
    DUPLICATE_TX = 2
}
interface Result {
    status: Status;
    transactionId?: string;
}
export { Result, Status };
