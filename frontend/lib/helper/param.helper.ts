import { InvalidSearchParam } from "../error/param.error";

export type NextSearchParam = Promise<{
  [key: string]: string | string[] | undefined;
}>;

export class SearchParamHelper {
  static async getString(
    searchParam: NextSearchParam,
    key: string
  ): Promise<string | undefined> {
    const params = await searchParam;
    if (Array.isArray(params[key])) {
      throw new InvalidSearchParam(
        `search param for ${key} should not be array`
      );
    }

    return params[key] ?? undefined;
  }

  static async getArray(
    searchParam: NextSearchParam,
    key: string
  ): Promise<(string | undefined)[] | undefined> {
    const params = await searchParam;
    return Array.isArray(params[key]) ? params[key] : [params[key]];
  }
}
