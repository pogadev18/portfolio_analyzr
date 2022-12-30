import { Investment } from '.prisma/client';

export function checkDuplicatedETFs(arr: string[]) {
  // A temporary mapping that stores "true" for a key found to exist in arr
  const map: { [key: string]: boolean } = {};

  for (const item of arr) {
    if (map[item]) {
      /*
        If mapping contains key/value for item, then current item has
        appeared at least twice in arr
      */
      return true;
    }

    map[item] = true;
  }
  console.log('MAP!!', map);
  return false;
}
