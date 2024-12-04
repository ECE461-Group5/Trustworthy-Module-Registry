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
