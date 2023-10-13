enum Status {
  SUCCESS,
  FAIL,
  DUPLICATE_TX,
}

class Result {
  status: Status;
  constructor(status: Status) {
    this.status = status;
  }
}

export { Result, Status };
