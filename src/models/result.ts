enum Status {
  SUCCESS,
  FAIL,
}

class Result {
  status: Status | undefined;
  message: string | undefined;
  constructor(status: Status, message?: string | undefined) {
    this.status = status;
    this.message = message;
  }
}

export { Result, Status };
