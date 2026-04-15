export function isMissingPrismaTableError(error) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const message =
    typeof error.message === "string" ? error.message : String(error.message ?? "");

  return (
    error.code === "P2021" ||
    error.code === "P2022" ||
    message.includes("does not exist in the current database")
  );
}

export const phase3SchemaMessage =
  "Phase 3 needs the new Business schema in your database before this page can load live data.";

export const authSchemaMessage =
  "Authentication tables are not available in the current database yet.";
