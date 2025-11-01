import { parseStringPromise } from "xml2js";
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { Item } from "../types/types";

const DIR_NAME = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = path.join(DIR_NAME, "../data/items.json");

const getItems = async () => {
  let items = readItemsDataFile().map((item) => ({
    ...item,
    pricePerDay: item.price / diffInDays(new Date(item.buyDate), new Date()),
  }));

  console.log(`WRITTEN ${items.length} ITEMS`);

  writeItemsDataFile(items);
};

const writeItemsDataFile = (items: Item[]) => {
  const currentDate = new Date().toUTCString();
  const jsonList = JSON.stringify(
    { updated: currentDate, items: items },
    undefined,
    4,
  );

  fs.writeFileSync(DATA_PATH, jsonList);
};

const diffInDays = (dateA: Date, dateB: Date) => {
  const MILLI_PER_DAY = 1000 * 60 * 60 * 24;
  return Math.round(dateB.getTime() - dateA.getTime()) / MILLI_PER_DAY;
};

const readItemsDataFile = (): Item[] => {
  console.log(DATA_PATH);
  const dataFileExists = fs.existsSync(DATA_PATH);
  if (!dataFileExists) {
    return [];
  }

  try {
    const itemsJson = fs.readFileSync(DATA_PATH).toString();
    const items = JSON.parse(itemsJson).items as Item[];
    return items;
  } catch {
    return [];
  }
};

getItems();
