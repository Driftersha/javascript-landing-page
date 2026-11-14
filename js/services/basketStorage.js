import { brand } from '../config/brand.js';

const SCHEMA_VERSION = 1;
const LEGACY_BRIATON_KEY = 'basketItems';

function readEntries(raw, legacy) {
  const data = JSON.parse(raw);
  const entries = legacy
    ? data
    : data?.version === SCHEMA_VERSION
      ? data.items
      : null;
  if (!Array.isArray(entries)) return [];

  const validEntries = new Map();
  for (const entry of entries) {
    const { id, quantity } = entry ?? {};
    const validId =
      (Number.isSafeInteger(id) && id > 0) ||
      (typeof id === 'string' && id.trim().length > 0);

    if (
      validId &&
      Number.isSafeInteger(quantity) &&
      quantity > 0 &&
      !validEntries.has(id)
    ) {
      validEntries.set(id, { id, quantity });
    }
  }

  return [...validEntries.values()];
}

export function createBasketStorage(brandId = brand.id) {
  const key = `${brandId}:basket`;
  let sessionEntries;

  return {
    read() {
      if (sessionEntries) return sessionEntries;
      try {
        const raw = localStorage.getItem(key);
        if (raw !== null) return readEntries(raw, false);
        if (brandId === 'briaton') {
          return readEntries(localStorage.getItem(LEGACY_BRIATON_KEY), true);
        }
        return [];
      } catch {
        return [];
      }
    },

    write(items) {
      try {
        localStorage.setItem(
          key,
          JSON.stringify({ version: SCHEMA_VERSION, items })
        );
        sessionEntries = undefined;
      } catch {
        sessionEntries = items;
      }
    },
  };
}
