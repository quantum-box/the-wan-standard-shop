// @tachyon-sdk/storekit@0.3.1's root export also evaluates Node-only payment
// adapters. Tachyon's Pages direct-upload step does not apply the repository's
// nodejs_compat flag, so keep this Worker bundle on the SDK's storefront-only
// implementation entrypoints.
import { GraphQLClient } from "../../node_modules/@tachyon-sdk/storekit/dist/graphql-client.js";
import { StorefrontOperations } from "../../node_modules/@tachyon-sdk/storekit/dist/operations/storefront.js";
import { FIELD_GRAPHQL_URL, OPERATOR_ID } from "./storekit-config";

const graphqlClient = new GraphQLClient(FIELD_GRAPHQL_URL, {
  headers: {
    "x-operator-id": OPERATOR_ID,
  },
});

export const storefront = new StorefrontOperations(graphqlClient);
