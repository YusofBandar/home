import { isObject } from "lodash-es";
import { ComponentChild } from "preact";

interface Link {
  type: "link";
  href: string;
  title: string;
}

export type Row = Link;
export interface TableProps<T extends ComponentChild> {
  columns: string[];
  rows: (T | Row)[];
}

function isLink<T>(row: Row | T): row is Link {
  if (isObject(row)) {
    const rowObj = row as object;
    return "type" in rowObj && rowObj.type === "link";
  }

  return false;
}

export function Table<T extends ComponentChild>({
  columns,
  rows,
}: TableProps<T>) {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((col) => (
            <TableHeader>{col}</TableHeader>
          ))}
        </tr>
      </thead>
      <tbody className="border border-zinc-700">
        {rows.map((row) => (
          <TableRow>
            {Object.values(row).map((value: T | Row) => {
              if (isLink(value)) {
                return <TableData href={value.href}>{value.title}</TableData>;
              } else {
                return <TableData>{value}</TableData>;
              }
            })}
          </TableRow>
        ))}
      </tbody>
    </table>
  );
}

interface TableRowProps {
  children?: React.ReactNode;
}

function TableRow({ children }: TableRowProps) {
  return <tr className="border-b-1 border-zinc-700">{children}</tr>;
}

interface TableHeaderProps {
  children: React.ReactNode;
}

function TableHeader({ children }: TableHeaderProps) {
  return (
    <th className="text-left text-xs text-zinc-300 p-4 pl-2 pb-2">
      {children}
    </th>
  );
}

interface TableDataProps {
  children?: React.ReactNode;
  href?: string;
}

function TableData({ children, href }: TableDataProps) {
  if (href) {
    return (
      <td className="text-xs text-zinc-300 border-r-1 border-zinc-700 hover:bg-theme hover:text-zinc-800 cursor-pointer transition-all focus:bg-theme focus:text-zinc-800 duration-[0.1s] hover:duration-0">
        <a className="w-full h-full block p-4" href={href}>
          {children}
        </a>
      </td>
    );
  }

  return (
    <td className={`text-xs text-zinc-300 p-4 border-r-1 border-zinc-700`}>
      {children}
    </td>
  );
}
