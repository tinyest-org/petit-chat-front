import { FormatOption, QueryDataPreparator } from "./apiUtils";

function isString(x: unknown): x is string {
  return typeof x === "string";
}
function isFile(x: unknown): x is File {
  return x instanceof File;
}

export class QueryBodyPreparator implements QueryDataPreparator {
  async prepareHeaders(headers: Headers, formatOption: FormatOption): Promise<void> {
    if (formatOption === "json") {
      headers.append("Content-Type", "application/json");
      headers.append("Accept", "text/plain, application/json");
    }

    if (formatOption === "multipart") {
      // headers.append("Content-Type", "multipart/form-data");
      // headers.append("Accept", "text/plain, application/json");
    }
  }
  async serialyze(data: any, formatOption: FormatOption): Promise<string | FormData | undefined> {
    if (!data) {
      return undefined;
    }
    if (formatOption === "json") {
      return JSON.stringify(data);
    } else {
      const form = new FormData();
      Object.keys(data).forEach(k => {
        const v = data[k];
        if (isString(v) || isFile(v)) {
          form.append(k, v);
        }
      });
      return form;
    }
  }
}