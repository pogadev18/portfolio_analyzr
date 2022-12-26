export function generateArrayOfYears() {
  const max = new Date().getFullYear() + 1;
  const min = max - 20;
  const years: string[] = [];

  for (let i = max; i >= min; i--) {
    years.push(String(i));
  }

  return years;
}
