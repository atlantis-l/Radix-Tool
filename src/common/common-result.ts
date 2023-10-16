import { Result, Status } from "../models";

const SUCCESS_RESULT = new Result(Status.SUCCESS);

const FAIL_RESULT = new Result(Status.FAIL);

const DUPLICATE_RESULT = new Result(Status.DUPLICATE_TX);

export { SUCCESS_RESULT, FAIL_RESULT, DUPLICATE_RESULT };
