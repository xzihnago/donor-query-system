import type { WorkSheet, CellObject } from "xlsx";

export enum SheetResultType {
  PENDING,
  INVALID_HEADER,
  INVALID_DATA,
}

export const parseFile = async (file: File) => {
  const buffer = await file.arrayBuffer();
  const book = XLSX.read(buffer);
  const sheet = book.Sheets[book.SheetNames[0]];

  return {
    file: file.name,
    ...parseSheet(sheet),
  };
};

const parseSheet = (sheet: WorkSheet) => {
  // Check if required headers are present
  const headers = getHeader(sheet);
  const missing = ["供養者", "金額"].filter((header) => !headers.includes(header));
  if (missing.length > 0) {
    return {
      type: SheetResultType.INVALID_HEADER,
      error: missing,
    } as const;
  }

  // Check if required fields are present
  const error: { line: number; missing: string[] }[] = [];
  const data = XLSX.utils
    .sheet_to_json<{ __rowNum__: number } & Record<string, string | number | undefined>>(sheet)
    .flatMap((record) => {
      const donor = record["供養者"] ? String(record["供養者"]).trim() : null;
      const amount = record["金額"] ? Number(record["金額"]) : NaN;

      const missing = [!donor && "供養者", isNaN(amount) && "金額"].filter((v): v is string => !!v);
      if (missing.length === 1) {
        error.push({
          line: record.__rowNum__ + 1,
          missing,
        });
        return [];
      }

      return [[donor, amount]];
    });
  if (error.length > 0) {
    return {
      type: SheetResultType.INVALID_DATA,
      error,
    } as const;
  }

  return {
    type: SheetResultType.PENDING,
    count: data.length,
    data,
  } as const;
};

const getHeader = (sheet: WorkSheet) => {
  const range = XLSX.utils.decode_range(sheet["!ref"] ?? "");
  const headers = Array.from(
    {
      length: range.e.c - range.s.c + 1,
    },
    (_, i) => {
      const cell = XLSX.utils.encode_cell({ r: range.s.r, c: range.s.c + i });
      return sheet[cell]?.v as CellObject["v"];
    },
  );

  return headers;
};
