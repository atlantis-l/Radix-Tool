import { Result, Status } from "../models";

const SUCCESS_RESULT: Result = { status: Status.SUCCESS };

const FAIL_RESULT: Result = { status: Status.FAIL };

const DUPLICATE_RESULT: Result = { status: Status.DUPLICATE_TX };

export { SUCCESS_RESULT, FAIL_RESULT, DUPLICATE_RESULT };
