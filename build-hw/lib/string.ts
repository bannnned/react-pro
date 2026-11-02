export function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function toSlug(value: string) {
  return value.trim().toLowerCase().replaceAll(' ', '-');
}
