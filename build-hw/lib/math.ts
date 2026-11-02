export function add(first: number, second: number) {
  return first + second;
}

export function multiply(first: number, second: number) {
  return first * second;
}

export function average(values: number[]) {
  return values.reduce((total, value) => total + value, 0) / values.length;
}
