/*
 * Author(s): Joe Dahms
 * Purpose: Data type representing Package Metadata. Improve transfer of data between Express server and database
 */

interface PackageMetadata {
  Name: string;
  Version: string;
  ID: string;
}
