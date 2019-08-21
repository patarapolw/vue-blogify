export function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');  // $& means the whole matched string
}

export function normalizeArray(it: any): any {
  if (Array.isArray(it)) {
    return it[0];
  }

  return it;
}