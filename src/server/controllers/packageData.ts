export interface PackageData {
  Content?: string;
  URL?: string;
  debloat?: boolean;
  JSProgram?: string;
}

export function checkPackageData (packageData: PackageData): boolean {
  // All fields need to be present
  if (!("Content" in packageData)) {
    return false;
  }
  if (!("URL" in packageData)) {
    return false;
  }
  if (!("debloat" in packageData)) {
    return false;
  }
  if (!("JSProgram" in packageData)) {
    return false;
  }

  // Only one of URL or content can be set
  console.log(packageData.Content);

  return true;
}
