export function getAdditionalTag(tag: string, dropId: string | null): string {
  const firstSlashIndex = tag.indexOf("/");
  if (firstSlashIndex === -1) {
    return tag;
  }

  const secondSlashIndex = tag.indexOf("/", firstSlashIndex + 1);
  if (secondSlashIndex === -1) {
    return tag;
  }

  const base = tag.slice(0, firstSlashIndex);
  const tail = tag.slice(secondSlashIndex);

  return `${base}/${dropId}${tail}`;
}
