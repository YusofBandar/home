import React from "preact/compat";

export interface ItemsTableProps {
  items: string[];
}

export function ItemsTable({ items }: ItemsTableProps) {
  return (
    <table>
      <tbody>
        {items.map((item, index) => (
          <tr className="p-2 group text-theme hover:bg-theme hover:text-zinc-800 cursor-pointer transition-all focus:bg-theme focus:text-zinc-800 duration-[0.1s] hover:duration-0">
            <ItemIndexRow index={index} />
            <ItemRow>{item}</ItemRow>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export interface ItemRowProps {
  children?: React.ReactNode;
}

export function ItemRow({ children }: ItemRowProps) {
  return (
    <td className="text-zinc-300 group-hover:text-zinc-800 group-focus:text-zinc-800 text-xs p-2">
      {children}
    </td>
  );
}

export interface ItemIndexRowProps {
  index: number;
}

export function ItemIndexRow({ index }: ItemIndexRowProps) {
  return (
    <td className="text-zinc-400 group-hover:text-zinc-800 group-focus:text-zinc-800 text-xs p-2">
      {`#${index}`}
    </td>
  );
}
