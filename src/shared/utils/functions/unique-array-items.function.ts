import { Types } from "mongoose";

export function uniqueArray(arr: String[] | Number[]): (String | Number)[] {
  let uniqueSet = [...new Set([...arr])];

  return uniqueSet;
}
