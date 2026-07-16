import { stringify } from "query-string";
import { fetchUtils, DataProvider } from "ra-core";

const apiUrl = import.meta.env.VITE_NAC_API_URL;
const httpClient = fetchUtils.fetchJson;

export const createHeader = (): Headers => {
  const access_token = localStorage.getItem("access_token");

  if (!access_token) {
    return new Headers();
  }

  return new Headers({ Authorization: `Bearer ${access_token}` });
};

const mapId = (
  data: object[] | object,
  resource: string,
): object[] | object => {
  let mapField: string = "";
  if (resource === "vlan") {
    mapField = "vlan";
  }
  if (!mapField) return data;

  if (Array.isArray(data)) {
    return data.map((d) => ({
      ...d,
      id: d[mapField],
    }));
  }
  return { ...data, id: data[mapField] };
};

const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination || {};
    const { field, order } = params.sort || {};

    // If there are lists in params filter, we need to convert them to comma separated strings
    // to be compatible with the API
    let flattenParamFilters = fetchUtils.flattenObject(params.filter);
    flattenParamFilters = Object.fromEntries(
      Object.entries(flattenParamFilters).map(([key, value]) => {
        if (Array.isArray(value)) {
          return [key, value.join(",")];
        }
        return [key, value];
      }),
    );

    const query = {
      ...flattenParamFilters,
      order_by: (order == "ASC" ? "+" : "-") + field,
      page: page ?? undefined,
      size: perPage ?? undefined,
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    const { json, headers } = await httpClient(url, {
      signal: params?.signal,
      headers: createHeader(),
    });

    return { data: mapId(json, resource), total: headers.get("x-total-count") };
  },

  getOne: async (resource, params) => {
    let url = `${apiUrl}/${resource}/${params.id}`;
    if (params?.meta?.embed) {
      url += `?_embed=${params.meta.embed}`;
    }
    const { json } = await httpClient(url, {
      signal: params?.signal,
      headers: createHeader(),
    });

    return { data: mapId(json, resource) };
  },

  getMany: async (resource, params) => {
    const query = {
      id__in: params.ids.join(","),
      _embed: params?.meta?.embed,
    };

    const url = `${apiUrl}/${resource}?${stringify(query)}`;
    const { json } = await httpClient(url, {
      signal: params?.signal,
      headers: createHeader(),
    });
    return { data: mapId(json, resource) };
  },

  getManyReference: async (resource, params) => {
    const { page, perPage } = params.pagination;
    const { field, order } = params.sort;
    let flattenParamFilters = fetchUtils.flattenObject(params.filter);

    flattenParamFilters = Object.fromEntries(
      Object.entries(flattenParamFilters).map(([key, value]) => {
        if (Array.isArray(value)) {
          return [key, value.join(",")];
        }

        return [key, value];
      }),
    );

    const query = {
      [params.target]: params.id,
      ...flattenParamFilters,

      order_by: (order == "ASC" ? "+" : "-") + field,
      page: page ? page : undefined,
      size: perPage ? perPage : undefined,
      _embed: params?.meta?.embed,
    };
    const url = `${apiUrl}/${resource}?${stringify(query)}`;

    const { json, headers } = await httpClient(url, {
      signal: params?.signal,
      headers: createHeader(),
    });

    return { data: mapId(json, resource), total: headers.get("x-total-count") };
  },

  update: async (resource, params) => {
    const { json } = await httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "PUT",
      body: JSON.stringify(params.data),
      headers: createHeader(),
    });
    return { data: mapId(json, resource) };
  },

  // json-server doesn't handle filters on UPDATE route, so we fallback to calling UPDATE n times instead
  updateMany: async (resource, params) => {
    const responses = await Promise.all(
      params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}`, {
          method: "PUT",
          body: JSON.stringify(params.data),
          headers: createHeader(),
        }),
      ),
    );
    return { data: responses.map(({ json }) => json.id) };
  },

  create: async (resource, params) => {
    const { json } = await httpClient(`${apiUrl}/${resource}`, {
      method: "POST",
      body: JSON.stringify(params.data),
      headers: createHeader(),
    });
    return { data: { ...params.data, ...mapId(json, resource) } as any };
  },

  delete: async (resource, params) => {
    await httpClient(`${apiUrl}/${resource}/${params.id}`, {
      method: "DELETE",
      headers: createHeader(),
    });
    return { data: { id: params.id } };
  },

  // json-server doesn't handle filters on DELETE route, so we fallback to calling DELETE n times instead
  deleteMany: async (resource, params) => {
    await Promise.all(
      params.ids.map((id) =>
        httpClient(`${apiUrl}/${resource}/${id}`, {
          method: "DELETE",
          headers: createHeader(),
        }),
      ),
    );
    return {
      data: params.ids.map((id) => {
        id;
      }),
    };
  },
};

export default dataProvider;
