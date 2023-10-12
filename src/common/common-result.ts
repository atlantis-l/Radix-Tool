import { Result, Status } from "../models";

const SUCCESS_RESULT = new Result(Status.SUCCESS);
const DUPLICATE_RESULT = new Result(Status.FAIL, "Duplicate transaction");
const FAIL_RESULT = new Result(Status.FAIL);

export { SUCCESS_RESULT, FAIL_RESULT, DUPLICATE_RESULT };
