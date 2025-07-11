/* eslint-disable @typescript-eslint/no-explicit-any*/
type BulkUpdateInput<T, K extends keyof T, ID extends keyof T> = {
  table: string;
  updates: (Pick<T, ID> & Pick<T, K>)[];
  fields: K[];
  idField?: ID;
};

export function buildMultiFieldBulkUpdateSQL<
  T extends Record<string, any>,
  K extends keyof T,
  ID extends keyof T = "id" extends keyof T ? "id" : never,
>({
  table,
  updates,
  fields,
  idField,
}: BulkUpdateInput<T, K, ID>): { sql: string; params: any[] } {
  if (updates.length === 0) throw new Error("No updates provided");

  const idKey = (idField ?? "id") as ID;
  const params: any[] = [];
  const ids: string[] = [];
  const fieldCases: Record<string, string[]> = {};

  for (const field of fields) {
    fieldCases[field as string] = [];
  }

  updates.forEach((row) => {
    const rowIdParam = `$${params.length + 1}`;
    params.push(row[idKey]);
    ids.push(rowIdParam);

    for (const field of fields) {
      const valueParam = `$${params.length + 1}`;
      params.push(row[field]);
      fieldCases[field as string]?.push(
        `WHEN "${String(idKey)}" = ${rowIdParam} THEN ${valueParam}`,
      );
    }
  });

  const setClauses = fields
    .map((field) => {
      const fieldName = field as string;
      return `"${fieldName}" = CASE
  ${fieldCases[fieldName]?.join("\n  ")}
  ELSE "${fieldName}"
END`;
    })
    .join(",\n  ");

  const sql = `
    UPDATE "${table}"
    SET
      ${setClauses}
    WHERE "${String(idKey)}" IN (${ids.join(", ")});
  `;

  return { sql, params };
}
