import { Request, Response } from "express";

interface RequestQuery {
  offset?: string;
}

export const getPackages = /*async*/ (req: Request<unknown, unknown, unknown, RequestQuery>, res: Response): void => {
  const offset = req.query.offset;
  res.json({ message: "NOT IMPLEMENTED: get packages", offset: `${offset}` });
};
