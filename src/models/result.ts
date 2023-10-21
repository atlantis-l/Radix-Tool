enum Status {
  SUCCESS,
  FAIL,
  DUPLICATE_TX,
}

interface Result {
  status: Status;
  transactionId?: string;
}

export { Result, Status };
