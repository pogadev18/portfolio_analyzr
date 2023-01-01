export function checkDuplicatedETFs(arr: string[]) {
  const toFindDuplicates = (arr: string[]) =>
    arr.filter((item, index) => arr.indexOf(item) !== index);

  console.log('HELLO!!!', toFindDuplicates(arr));
  return toFindDuplicates(arr);
}
