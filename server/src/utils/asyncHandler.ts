import type { NextFunction, Request, Response } from "express";

type RouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Promise<any>;

export function asyncHandler(routeHandler: RouteHandler) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await routeHandler(req, res, next);
    } catch (error) {
      next(error); // forward to your global error handler
    }
  };
}
