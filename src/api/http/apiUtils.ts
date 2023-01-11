export type CacheEntry = {
  content: any;
  fetchedAt: string;
};

export interface Cache {
  handleResponse(path: string, r: Response): Promise<string>;
  getItem(path: string): Promise<CacheEntry | undefined>;
}

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type FetchOptions = {
  cache: boolean;
  formatOption: FormatOption,
};

const defaultFetchOptions: FetchOptions = {
  cache: false,
  formatOption: 'json',
};

export class HTTPRequestError extends Error {
  code: number;
  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.name = "HTTP request error";
  }
}

export interface QueryDataPreparator {
  prepareHeaders(headers: Headers, formatOption: FormatOption): Promise<void>;
  serialyze(data: any, formatOption: FormatOption): Promise<string | FormData | undefined>;
}

export type FormatOption = "json" | "text" | "blob" | "multipart";

export interface SecurityProvider {
  makeHeaderFields(): Promise<{ [key: string]: string }>;
  prepareHeaders(headers: Headers): Promise<void>;
  refresh(): Promise<boolean>;
  login(): void;
}

export class HttpAPI {
  public readonly baseUrl: string;

  public readonly securityProvider: SecurityProvider;
  public readonly cache: Cache;
  public readonly queryPreparator: QueryDataPreparator;

  constructor(baseUrl: string, securityProvider: SecurityProvider, cache: Cache, queryPreparator: QueryDataPreparator) {
    this.baseUrl = baseUrl;
    this.securityProvider = securityProvider;
    this.cache = cache;
    this.queryPreparator = queryPreparator;
  }

  httpQuery = async <T>(
    path: string,
    method: Method,
    body?: any,
    empty = false,
    json: boolean = true,
    options: FetchOptions = defaultFetchOptions,
  ): Promise<T> => {
    const headers = new Headers();
    await this.securityProvider.prepareHeaders(headers);

    if (options.cache) {
      const cached = await this.cache.getItem(path);
      if (cached) {
        headers.append("If-Modified-Since", cached.fetchedAt);
      }
    }

    await this.queryPreparator.prepareHeaders(headers, options.formatOption); // TODO: handle more generic context

    const res = await fetch(this.baseUrl + path, {
      method,
      headers,
      body: await this.queryPreparator.serialyze(body, options.formatOption),
    });

    if (res.status >= 400) {
      try {
        if (res.status === 401) {
          this.securityProvider.login();
        } else {
          throw new HTTPRequestError(res.status, await res.json());
        }
      } catch {
        throw new HTTPRequestError(res.status, "Unknown error");
      }
    }
    // handling void result

    const text = await (options.cache ? this.cache.handleResponse(path, res) : res.text());

    if (res.headers.get("content-length") === "0" || res.status === 204 || empty || text.length == 0) {
      return null as unknown as T;
    }
    if (json) {
      return JSON.parse(text);
    }
    return res.blob() as unknown as T;
  };

  get = <T>(path: string, json: boolean = true, options?: FetchOptions) => {
    return this.httpQuery<T>(path, "GET", undefined, false, json, options);
  };

  del = <T = void>(path: string, empty = false) => {
    return this.httpQuery<T>(path, "DELETE", undefined, empty); //TODO verify this
  };

  post = <T>(path: string, body: any, json: boolean = true, option?: FetchOptions) => {
    return this.httpQuery<T>(path, "POST", body, undefined, json, option);
  };

  put = <T>(path: string, body?: any) => {
    return this.httpQuery<T>(path, "PUT", body);
  };

  patch = <T>(path: string, body?: any) => {
    return this.httpQuery<T>(path, "PATCH", body);
  };
}

