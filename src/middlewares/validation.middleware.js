import { StatusCodes } from "http-status-codes";
import { z } from "zod";

const validate = (schema) => (req, res, next) => {
  try {
    const parsedBody = schema.parse(req.body);
    req.body = parsedBody;
    next();
  } catch (error) {
    if (error instanceof z.ZodError)
      return res.status(StatusCodes.BAD_REQUEST).json({ errors: error.errors });
    next(error);
  }
};

export default validate;
