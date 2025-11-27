// frontend/src/lib/api.ts
import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosRequestHeaders,
} from "axios";

/**
 * 共通APIクライアント
 * - baseURL は /api（Nginx が /api を Django にプロキシ）
 * - withCredentials で Cookie を送信（SessionAuth を想定）
 * - FormData のときは Content-Type を削除して boundary をブラウザに任せる
 * - それ以外は application/json を付与
 * - CSRF Token を Cookie から拾って送る
 */

export const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  // NOTE: ここで Content-Type を固定しないこと！
});

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()!.split(";").shift() || null;
  }
  return null;
}

function isFormDataBody(data: unknown): data is FormData {
  return typeof FormData !== "undefined" && data instanceof FormData;
}

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // headers を正しく初期化（Axios v1 の型に合わせる）
    const headers: AxiosRequestHeaders = (config.headers ??
      {}) as AxiosRequestHeaders;

    if (isFormDataBody(config.data)) {
      // FormData の場合は Content-Type を外す（boundary 自動付与）
      delete (headers as any)["Content-Type"];
      delete (headers as any)["content-type"];
    } else {
      if (!(headers as any)["Content-Type"]) {
        headers["Content-Type"] = "application/json";
      }
    }

    // CSRF
    const csrftoken = getCookie("csrftoken");
    if (csrftoken) {
      headers["X-CSRFToken"] = csrftoken;
    }

    config.headers = headers;
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);
