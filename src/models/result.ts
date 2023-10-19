enum Status {
  SUCCESS,
  FAIL,
  DUPLICATE_TX,
}

interface Result {
  status: Status;
}

export { Result, Status };
