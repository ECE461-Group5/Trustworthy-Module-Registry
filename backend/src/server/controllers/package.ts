/**
 * @filename - package.ts
 * @author(s) - Joe Dahms
 * @purpose - Interface for a package. Helps ensure that each field of a package is of an expected type.
 */

export interface Package {
  metadata: {
    Name: string | null;
    Version: string | null;
    ID: number | string | null;
  };
  data: {
    Content: Buffer | null;
    URL: string | null;
    debloat: boolean | null;
    JSProgram: string | null;
  };
}

export interface PackageResponse {
    Name: string;
    Version: string;
    ID: string;
}
