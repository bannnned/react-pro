export function formatGreeting(name: string) {
  return `Привет, ${name}!`;
}

export function sumNumbers(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

export function createDebugInfo() {
  return `Сборка запущена в ${new Date().toISOString()}`;
}
