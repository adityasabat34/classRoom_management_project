// import { SQL, sql } from "drizzle-orm";
// import { PgTable } from "drizzle-orm/pg-core";
// import { eq, ilike, and, desc, asc } from "drizzle-orm";
// import { db } from "../config/db";

// interface QueryOptions<T> {
//   searchableColumns?: (keyof T)[];
//   sortableColumns?: (keyof T)[];
//   defaultLimit?: number;
//   maxLimit?: number;
// }

// interface QueryResult<T> {
//   data: T[];
//   total: number;
//   page: number;
//   totalPages: number;
// }

// export async function buildQuery<T extends PgTable>(
//   table: T,
//   queryParams: any,
//   options: QueryOptions<T["_"]["columns"]> = {},
// ): Promise<QueryResult<any>> {
//   const {
//     searchableColumns = [],
//     sortableColumns = [],
//     defaultLimit = 10,
//     maxLimit = 100,
//   } = options;

//   let {
//     page = "1",
//     limit = defaultLimit.toString(),
//     search,
//     sort,
//     ...filters
//   } = queryParams;

//   const pageNumber = Math.max(1, parseInt(page));
//   const limitNumber = Math.min(maxLimit, parseInt(limit));
//   const offset = (pageNumber - 1) * limitNumber;

//   const conditions: SQL[] = [];

//   // 🔍 SEARCH
//   if (search && searchableColumns.length > 0) {
//     const searchConditions = searchableColumns.map((columnKey) =>
//       ilike((table as any)[columnKey], `%${search}%`),
//     );

//     conditions.push(sql`(${sql.join(searchConditions, sql` OR `)})`);
//   }

//   // 🎯 FILTERS
//   Object.entries(filters).forEach(([key, value]) => {
//     if ((table as any)[key]) {
//       conditions.push(eq((table as any)[key], value as any));
//     }
//   });

//   // 🧠 SORTING
//   let orderBy;
//   if (sort && sortableColumns.includes(sort.replace("-", "") as any)) {
//     const isDesc = sort.startsWith("-");
//     const columnName = sort.replace("-", "");
//     orderBy = isDesc
//       ? desc((table as any)[columnName])
//       : asc((table as any)[columnName]);
//   }

//   const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

//   const [data, totalResult] = await Promise.all([
//     db
//       .select()
//       .from(table)
//       .where(whereClause)
//       .orderBy(orderBy as any)
//       .limit(limitNumber)
//       .offset(offset),

//     db
//       .select({ count: sql<number>`count(*)` })
//       .from(table)
//       .where(whereClause),
//   ]);

//   const total = Number(totalResult[0]?.count || 0);

//   return {
//     data,
//     total,
//     page: pageNumber,
//     totalPages: Math.ceil(total / limitNumber),
//   };
// }
