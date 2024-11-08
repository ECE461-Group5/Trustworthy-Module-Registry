import { Request, Response } from "express";

// /package
export const uploadPackage = async (req: Request, res: Response) => {
  res.json({ message: "NOT IMPLEMENTED: upload package" });
};

// /package/:id
export const getPackage = async (req: Request, res: Response) => {
  res.json({message: "NOT IMPLEMENTED: get package"});
};

// /package/:id
export const updatePackage = async (req: Request, res: Response) => {
  res.json({message: "NOT IMPLEMENTED: update package"});
};

// /package/:id
export const deletePackage = async (req: Request, res: Response) => {
  res.json({message: "NOT IMPLEMENTED: delete package"});
};

// /package/:id/rate
export const getPackageRating = async (req: Request, res: Response) => {
  res.json({message: "NOT IMPLEMENTED: get package rating"});
};

// /package/:id/cost
export const getPackageCost = async (req: Request, res: Response) => {
  res.json({message: "NOT IMPLEMENTED: get package cost"});
};

// /package/byRegEx
export const getPackageByRegEx = async (req: Request, res: Response) => {
  res.json({message: "NOT IMPLEMENTED: get package by regex"});
};

