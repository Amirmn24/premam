import type { HttpMethod } from "@/types/request";

export const HTTP_METHODS: HttpMethod[] = [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
];

export const METHOD_COLORS: Record<HttpMethod, string> = {
  GET: "text-method-get",
  POST: "text-method-post",
  PUT: "text-method-put",
  PATCH: "text-method-patch",
  DELETE: "text-method-delete",
};

export const METHOD_BG_COLORS: Record<HttpMethod, string> = {
  GET: "bg-method-get/15 border-method-get/40",
  POST: "bg-method-post/15 border-method-post/40",
  PUT: "bg-method-put/15 border-method-put/40",
  PATCH: "bg-method-patch/15 border-method-patch/40",
  DELETE: "bg-method-delete/15 border-method-delete/40",
};

export const APP_NAME = "Premam";
