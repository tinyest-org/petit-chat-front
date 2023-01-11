import { Cache, CacheEntry } from "../apiUtils";


export interface DataStore<K, V> {
  get(key: K): Promise<V | undefined>;
  put(key: K, value: V): Promise<void>;
}

/**
 * Ultra simple non persisted cache, implemented on top of an object
 */
export class ObjectDataStore implements DataStore<string, CacheEntry> {
  protected readonly cache: { [k: string]: CacheEntry };
  constructor(cache?: { [k: string]: CacheEntry }) {
    this.cache = cache || {};
  }
  async get(key: string): Promise<CacheEntry | undefined> {
    return this.cache[key];
  }
  async put(key: string, value: CacheEntry): Promise<void> {
    this.cache[key] = value;
  }
}

/**
 * Ultra simple persisted cache, implemented on top of an object, persisted on localStorage
 */
export class LocalStoreObjectDataStore extends ObjectDataStore {
  protected readonly name: string;
  /**
   * Ultra simple persisted cache, implemented on top of an object, persisted on localStorage
   */
  public constructor(name: string) {
    super(LocalStoreObjectDataStore.parseForHydration(name)); // restoring from localCache
    this.name = name;
  }

  protected static parseForHydration(name: string) {
    const persisted = localStorage.getItem(name);
    if (persisted) {
      return JSON.parse(persisted); // should retranform dates if necessary
    }
    return undefined;
  }
  protected persist() {
    localStorage.setItem(this.name, JSON.stringify(this.cache));
  }

  async put(key: string, value: CacheEntry): Promise<void> {
    super.put(key, value);
    this.persist();
  }
}

export default class SimpleCache implements Cache {
  private readonly cache: DataStore<string, CacheEntry>;

  constructor(cache: DataStore<string, CacheEntry>) {
    this.cache = cache;
  }

  handleResponse = async (path: string, r: Response) => {
    if (r.status === 304) {
      const res = await this.cache.get(path);
      return res?.content;
    } else {
      const content = await r.text();
      const date = r.headers.get("date");
      if (date) {
        await this.cache.put(path, {
          content,
          fetchedAt: date,
        });
      }
      return content;
    }
  };

  getItem = async (path: string) => {
    return this.cache.get(path);
  };
}

/**
 * Passtrought cache, does nothing
 */
export class NoopCache implements Cache {
  handleResponse = (path: string, r: Response) => {
    return r.text();
  };

  getItem = async (path: string) => {
    return undefined;
  };
}
