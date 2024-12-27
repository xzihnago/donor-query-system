interface Student {}
interface Record {}

interface FormData {
  get(key: string): string;
}

interface DB {
  select<T>(query: string, values: any[]): Promise<T>;
}

let formData: FormData;
let db: DB;
let cs: (query: string) => string;

const test = async () => {
  const [qs, qv] =
    formData.get("operator") === "CONTAINS"
      ? [
          cs(`SELECT * FROM $1 WHERE $2 LIKE '%$3%';`),
          [formData.get("type"), formData.get("field"), formData.get("value")],
        ]
      : [
          cs('SELECT * FROM $1 WHERE $2 $3 "$4";'),
          [
            formData.get("type"),
            formData.get("field"),
            formData.get("operator"),
            formData.get("value"),
          ],
        ];

  const result = await db
    .select<Student[] | Record[] | Event[]>(qs, qv)
    .catch((e) => {
      console.log(e);
    });
};
