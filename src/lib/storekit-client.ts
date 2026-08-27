import { StorekitClient } from "@tachyon-sdk/storekit";
import { FIELD_GRAPHQL_URL, OPERATOR_ID } from "./storekit-config";

export const storekit = new StorekitClient({
  baseUrl: FIELD_GRAPHQL_URL,
  headers: {
    "x-operator-id": OPERATOR_ID,
  },
});
