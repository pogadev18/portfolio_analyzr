export function checkDuplicatedETFs(arr: string[]) {
  const toFindDuplicates = (arr: string[]) =>
    arr.filter((item, index) => arr.indexOf(item) === index);

  return toFindDuplicates(arr);
}
