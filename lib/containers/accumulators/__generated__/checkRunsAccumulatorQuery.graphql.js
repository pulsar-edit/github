/**
 * @flow
 * @relayHash 0a5804395d7c847efc0a27cdb35910b1
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type checkRunsAccumulator_checkSuite$ref = any;
export type checkRunsAccumulatorQueryVariables = {|
  id: string,
  checkRunCount: number,
  checkRunCursor?: ?string,
|};
export type checkRunsAccumulatorQueryResponse = {|
  +node: ?{|
    +$fragmentRefs: checkRunsAccumulator_checkSuite$ref
  |}
|};
export type checkRunsAccumulatorQuery = {|
  variables: checkRunsAccumulatorQueryVariables,
  response: checkRunsAccumulatorQueryResponse,
|};
*/

/*
query checkRunsAccumulatorQuery(
  $id: ID!
  $checkRunCount: Int!
  $checkRunCursor: String
) {
  node(id: $id) {
    __typename
    ... on CheckSuite {
      ...checkRunsAccumulator_checkSuite_Rvfr1
    }
    id
  }
}

fragment checkRunView_checkRun on CheckRun {
  name
  status
  conclusion
  title
  summary
  permalink
  detailsUrl
}

fragment checkRunsAccumulator_checkSuite_Rvfr1 on CheckSuite {
  id
  checkRuns(first: $checkRunCount, after: $checkRunCursor) {
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      cursor
      node {
        id
        status
        conclusion
        ...checkRunView_checkRun
        __typename
      }
    }
  }
}
*/
const node /*: ConcreteRequest*/ = function () {
  var v0 = [{
      "kind": "LocalArgument",
      "name": "id",
      "type": "ID!",
      "defaultValue": null
    }, {
      "kind": "LocalArgument",
      "name": "checkRunCount",
      "type": "Int!",
      "defaultValue": null
    }, {
      "kind": "LocalArgument",
      "name": "checkRunCursor",
      "type": "String",
      "defaultValue": null
    }],
    v1 = [{
      "kind": "Variable",
      "name": "id",
      "variableName": "id"
    }],
    v2 = {
      "kind": "ScalarField",
      "alias": null,
      "name": "__typename",
      "args": null,
      "storageKey": null
    },
    v3 = {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    },
    v4 = [{
      "kind": "Variable",
      "name": "after",
      "variableName": "checkRunCursor"
    }, {
      "kind": "Variable",
      "name": "first",
      "variableName": "checkRunCount"
    }];
  return {
    "kind": "Request",
    "fragment": {
      "kind": "Fragment",
      "name": "checkRunsAccumulatorQuery",
      "type": "Query",
      "metadata": null,
      "argumentDefinitions": v0 /*: any*/,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "node",
        "storageKey": null,
        "args": v1 /*: any*/,
        "concreteType": null,
        "plural": false,
        "selections": [{
          "kind": "InlineFragment",
          "type": "CheckSuite",
          "selections": [{
            "kind": "FragmentSpread",
            "name": "checkRunsAccumulator_checkSuite",
            "args": [{
              "kind": "Variable",
              "name": "checkRunCount",
              "variableName": "checkRunCount"
            }, {
              "kind": "Variable",
              "name": "checkRunCursor",
              "variableName": "checkRunCursor"
            }]
          }]
        }]
      }]
    },
    "operation": {
      "kind": "Operation",
      "name": "checkRunsAccumulatorQuery",
      "argumentDefinitions": v0 /*: any*/,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "node",
        "storageKey": null,
        "args": v1 /*: any*/,
        "concreteType": null,
        "plural": false,
        "selections": [v2 /*: any*/, v3 /*: any*/, {
          "kind": "InlineFragment",
          "type": "CheckSuite",
          "selections": [{
            "kind": "LinkedField",
            "alias": null,
            "name": "checkRuns",
            "storageKey": null,
            "args": v4 /*: any*/,
            "concreteType": "CheckRunConnection",
            "plural": false,
            "selections": [{
              "kind": "LinkedField",
              "alias": null,
              "name": "pageInfo",
              "storageKey": null,
              "args": null,
              "concreteType": "PageInfo",
              "plural": false,
              "selections": [{
                "kind": "ScalarField",
                "alias": null,
                "name": "hasNextPage",
                "args": null,
                "storageKey": null
              }, {
                "kind": "ScalarField",
                "alias": null,
                "name": "endCursor",
                "args": null,
                "storageKey": null
              }]
            }, {
              "kind": "LinkedField",
              "alias": null,
              "name": "edges",
              "storageKey": null,
              "args": null,
              "concreteType": "CheckRunEdge",
              "plural": true,
              "selections": [{
                "kind": "ScalarField",
                "alias": null,
                "name": "cursor",
                "args": null,
                "storageKey": null
              }, {
                "kind": "LinkedField",
                "alias": null,
                "name": "node",
                "storageKey": null,
                "args": null,
                "concreteType": "CheckRun",
                "plural": false,
                "selections": [v3 /*: any*/, {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "status",
                  "args": null,
                  "storageKey": null
                }, {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "conclusion",
                  "args": null,
                  "storageKey": null
                }, {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "name",
                  "args": null,
                  "storageKey": null
                }, {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "title",
                  "args": null,
                  "storageKey": null
                }, {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "summary",
                  "args": null,
                  "storageKey": null
                }, {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "permalink",
                  "args": null,
                  "storageKey": null
                }, {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "detailsUrl",
                  "args": null,
                  "storageKey": null
                }, v2 /*: any*/]
              }]
            }]
          }, {
            "kind": "LinkedHandle",
            "alias": null,
            "name": "checkRuns",
            "args": v4 /*: any*/,
            "handle": "connection",
            "key": "CheckRunsAccumulator_checkRuns",
            "filters": null
          }]
        }]
      }]
    },
    "params": {
      "operationKind": "query",
      "name": "checkRunsAccumulatorQuery",
      "id": null,
      "text": "query checkRunsAccumulatorQuery(\n  $id: ID!\n  $checkRunCount: Int!\n  $checkRunCursor: String\n) {\n  node(id: $id) {\n    __typename\n    ... on CheckSuite {\n      ...checkRunsAccumulator_checkSuite_Rvfr1\n    }\n    id\n  }\n}\n\nfragment checkRunView_checkRun on CheckRun {\n  name\n  status\n  conclusion\n  title\n  summary\n  permalink\n  detailsUrl\n}\n\nfragment checkRunsAccumulator_checkSuite_Rvfr1 on CheckSuite {\n  id\n  checkRuns(first: $checkRunCount, after: $checkRunCursor) {\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n    edges {\n      cursor\n      node {\n        id\n        status\n        conclusion\n        ...checkRunView_checkRun\n        __typename\n      }\n    }\n  }\n}\n",
      "metadata": {}
    }
  };
}();
// prettier-ignore
node /*: any*/.hash = '1a2443362a842b9643fe51ecc2d1b53f';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJub2RlIiwidjAiLCJ2MSIsInYyIiwidjMiLCJ2NCIsImhhc2giLCJtb2R1bGUiLCJleHBvcnRzIl0sInNvdXJjZXMiOlsiY2hlY2tSdW5zQWNjdW11bGF0b3JRdWVyeS5ncmFwaHFsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZsb3dcbiAqIEByZWxheUhhc2ggMGE1ODA0Mzk1ZDdjODQ3ZWZjMGEyN2NkYjM1OTEwYjFcbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qOjpcbmltcG9ydCB0eXBlIHsgQ29uY3JldGVSZXF1ZXN0IH0gZnJvbSAncmVsYXktcnVudGltZSc7XG50eXBlIGNoZWNrUnVuc0FjY3VtdWxhdG9yX2NoZWNrU3VpdGUkcmVmID0gYW55O1xuZXhwb3J0IHR5cGUgY2hlY2tSdW5zQWNjdW11bGF0b3JRdWVyeVZhcmlhYmxlcyA9IHt8XG4gIGlkOiBzdHJpbmcsXG4gIGNoZWNrUnVuQ291bnQ6IG51bWJlcixcbiAgY2hlY2tSdW5DdXJzb3I/OiA/c3RyaW5nLFxufH07XG5leHBvcnQgdHlwZSBjaGVja1J1bnNBY2N1bXVsYXRvclF1ZXJ5UmVzcG9uc2UgPSB7fFxuICArbm9kZTogP3t8XG4gICAgKyRmcmFnbWVudFJlZnM6IGNoZWNrUnVuc0FjY3VtdWxhdG9yX2NoZWNrU3VpdGUkcmVmXG4gIHx9XG58fTtcbmV4cG9ydCB0eXBlIGNoZWNrUnVuc0FjY3VtdWxhdG9yUXVlcnkgPSB7fFxuICB2YXJpYWJsZXM6IGNoZWNrUnVuc0FjY3VtdWxhdG9yUXVlcnlWYXJpYWJsZXMsXG4gIHJlc3BvbnNlOiBjaGVja1J1bnNBY2N1bXVsYXRvclF1ZXJ5UmVzcG9uc2UsXG58fTtcbiovXG5cblxuLypcbnF1ZXJ5IGNoZWNrUnVuc0FjY3VtdWxhdG9yUXVlcnkoXG4gICRpZDogSUQhXG4gICRjaGVja1J1bkNvdW50OiBJbnQhXG4gICRjaGVja1J1bkN1cnNvcjogU3RyaW5nXG4pIHtcbiAgbm9kZShpZDogJGlkKSB7XG4gICAgX190eXBlbmFtZVxuICAgIC4uLiBvbiBDaGVja1N1aXRlIHtcbiAgICAgIC4uLmNoZWNrUnVuc0FjY3VtdWxhdG9yX2NoZWNrU3VpdGVfUnZmcjFcbiAgICB9XG4gICAgaWRcbiAgfVxufVxuXG5mcmFnbWVudCBjaGVja1J1blZpZXdfY2hlY2tSdW4gb24gQ2hlY2tSdW4ge1xuICBuYW1lXG4gIHN0YXR1c1xuICBjb25jbHVzaW9uXG4gIHRpdGxlXG4gIHN1bW1hcnlcbiAgcGVybWFsaW5rXG4gIGRldGFpbHNVcmxcbn1cblxuZnJhZ21lbnQgY2hlY2tSdW5zQWNjdW11bGF0b3JfY2hlY2tTdWl0ZV9SdmZyMSBvbiBDaGVja1N1aXRlIHtcbiAgaWRcbiAgY2hlY2tSdW5zKGZpcnN0OiAkY2hlY2tSdW5Db3VudCwgYWZ0ZXI6ICRjaGVja1J1bkN1cnNvcikge1xuICAgIHBhZ2VJbmZvIHtcbiAgICAgIGhhc05leHRQYWdlXG4gICAgICBlbmRDdXJzb3JcbiAgICB9XG4gICAgZWRnZXMge1xuICAgICAgY3Vyc29yXG4gICAgICBub2RlIHtcbiAgICAgICAgaWRcbiAgICAgICAgc3RhdHVzXG4gICAgICAgIGNvbmNsdXNpb25cbiAgICAgICAgLi4uY2hlY2tSdW5WaWV3X2NoZWNrUnVuXG4gICAgICAgIF9fdHlwZW5hbWVcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiovXG5cbmNvbnN0IG5vZGUvKjogQ29uY3JldGVSZXF1ZXN0Ki8gPSAoZnVuY3Rpb24oKXtcbnZhciB2MCA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICBcIm5hbWVcIjogXCJpZFwiLFxuICAgIFwidHlwZVwiOiBcIklEIVwiLFxuICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgfSxcbiAge1xuICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICBcIm5hbWVcIjogXCJjaGVja1J1bkNvdW50XCIsXG4gICAgXCJ0eXBlXCI6IFwiSW50IVwiLFxuICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgfSxcbiAge1xuICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICBcIm5hbWVcIjogXCJjaGVja1J1bkN1cnNvclwiLFxuICAgIFwidHlwZVwiOiBcIlN0cmluZ1wiLFxuICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgfVxuXSxcbnYxID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICBcIm5hbWVcIjogXCJpZFwiLFxuICAgIFwidmFyaWFibGVOYW1lXCI6IFwiaWRcIlxuICB9XG5dLFxudjIgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiX190eXBlbmFtZVwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52MyA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJpZFwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52NCA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgXCJuYW1lXCI6IFwiYWZ0ZXJcIixcbiAgICBcInZhcmlhYmxlTmFtZVwiOiBcImNoZWNrUnVuQ3Vyc29yXCJcbiAgfSxcbiAge1xuICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgXCJuYW1lXCI6IFwiZmlyc3RcIixcbiAgICBcInZhcmlhYmxlTmFtZVwiOiBcImNoZWNrUnVuQ291bnRcIlxuICB9XG5dO1xucmV0dXJuIHtcbiAgXCJraW5kXCI6IFwiUmVxdWVzdFwiLFxuICBcImZyYWdtZW50XCI6IHtcbiAgICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICAgIFwibmFtZVwiOiBcImNoZWNrUnVuc0FjY3VtdWxhdG9yUXVlcnlcIixcbiAgICBcInR5cGVcIjogXCJRdWVyeVwiLFxuICAgIFwibWV0YWRhdGFcIjogbnVsbCxcbiAgICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogKHYwLyo6IGFueSovKSxcbiAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAge1xuICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgIFwibmFtZVwiOiBcIm5vZGVcIixcbiAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgIFwiYXJnc1wiOiAodjEvKjogYW55Ki8pLFxuICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBudWxsLFxuICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJJbmxpbmVGcmFnbWVudFwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiQ2hlY2tTdWl0ZVwiLFxuICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkZyYWdtZW50U3ByZWFkXCIsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY2hlY2tSdW5zQWNjdW11bGF0b3JfY2hlY2tTdWl0ZVwiLFxuICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNoZWNrUnVuQ291bnRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJjaGVja1J1bkNvdW50XCJcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNoZWNrUnVuQ3Vyc29yXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFyaWFibGVOYW1lXCI6IFwiY2hlY2tSdW5DdXJzb3JcIlxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAgXCJvcGVyYXRpb25cIjoge1xuICAgIFwia2luZFwiOiBcIk9wZXJhdGlvblwiLFxuICAgIFwibmFtZVwiOiBcImNoZWNrUnVuc0FjY3VtdWxhdG9yUXVlcnlcIixcbiAgICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogKHYwLyo6IGFueSovKSxcbiAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAge1xuICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgIFwibmFtZVwiOiBcIm5vZGVcIixcbiAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgIFwiYXJnc1wiOiAodjEvKjogYW55Ki8pLFxuICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBudWxsLFxuICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAodjIvKjogYW55Ki8pLFxuICAgICAgICAgICh2My8qOiBhbnkqLyksXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiSW5saW5lRnJhZ21lbnRcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIkNoZWNrU3VpdGVcIixcbiAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjaGVja1J1bnNcIixcbiAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcImFyZ3NcIjogKHY0Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIkNoZWNrUnVuQ29ubmVjdGlvblwiLFxuICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicGFnZUluZm9cIixcbiAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlBhZ2VJbmZvXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJoYXNOZXh0UGFnZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImVuZEN1cnNvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJlZGdlc1wiLFxuICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiQ2hlY2tSdW5FZGdlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImN1cnNvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm5vZGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIkNoZWNrUnVuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh2My8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJzdGF0dXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY29uY2x1c2lvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJuYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInRpdGxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInN1bW1hcnlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicGVybWFsaW5rXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImRldGFpbHNVcmxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAodjIvKjogYW55Ki8pXG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkSGFuZGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNoZWNrUnVuc1wiLFxuICAgICAgICAgICAgICAgIFwiYXJnc1wiOiAodjQvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgIFwiaGFuZGxlXCI6IFwiY29ubmVjdGlvblwiLFxuICAgICAgICAgICAgICAgIFwia2V5XCI6IFwiQ2hlY2tSdW5zQWNjdW11bGF0b3JfY2hlY2tSdW5zXCIsXG4gICAgICAgICAgICAgICAgXCJmaWx0ZXJzXCI6IG51bGxcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAgXCJwYXJhbXNcIjoge1xuICAgIFwib3BlcmF0aW9uS2luZFwiOiBcInF1ZXJ5XCIsXG4gICAgXCJuYW1lXCI6IFwiY2hlY2tSdW5zQWNjdW11bGF0b3JRdWVyeVwiLFxuICAgIFwiaWRcIjogbnVsbCxcbiAgICBcInRleHRcIjogXCJxdWVyeSBjaGVja1J1bnNBY2N1bXVsYXRvclF1ZXJ5KFxcbiAgJGlkOiBJRCFcXG4gICRjaGVja1J1bkNvdW50OiBJbnQhXFxuICAkY2hlY2tSdW5DdXJzb3I6IFN0cmluZ1xcbikge1xcbiAgbm9kZShpZDogJGlkKSB7XFxuICAgIF9fdHlwZW5hbWVcXG4gICAgLi4uIG9uIENoZWNrU3VpdGUge1xcbiAgICAgIC4uLmNoZWNrUnVuc0FjY3VtdWxhdG9yX2NoZWNrU3VpdGVfUnZmcjFcXG4gICAgfVxcbiAgICBpZFxcbiAgfVxcbn1cXG5cXG5mcmFnbWVudCBjaGVja1J1blZpZXdfY2hlY2tSdW4gb24gQ2hlY2tSdW4ge1xcbiAgbmFtZVxcbiAgc3RhdHVzXFxuICBjb25jbHVzaW9uXFxuICB0aXRsZVxcbiAgc3VtbWFyeVxcbiAgcGVybWFsaW5rXFxuICBkZXRhaWxzVXJsXFxufVxcblxcbmZyYWdtZW50IGNoZWNrUnVuc0FjY3VtdWxhdG9yX2NoZWNrU3VpdGVfUnZmcjEgb24gQ2hlY2tTdWl0ZSB7XFxuICBpZFxcbiAgY2hlY2tSdW5zKGZpcnN0OiAkY2hlY2tSdW5Db3VudCwgYWZ0ZXI6ICRjaGVja1J1bkN1cnNvcikge1xcbiAgICBwYWdlSW5mbyB7XFxuICAgICAgaGFzTmV4dFBhZ2VcXG4gICAgICBlbmRDdXJzb3JcXG4gICAgfVxcbiAgICBlZGdlcyB7XFxuICAgICAgY3Vyc29yXFxuICAgICAgbm9kZSB7XFxuICAgICAgICBpZFxcbiAgICAgICAgc3RhdHVzXFxuICAgICAgICBjb25jbHVzaW9uXFxuICAgICAgICAuLi5jaGVja1J1blZpZXdfY2hlY2tSdW5cXG4gICAgICAgIF9fdHlwZW5hbWVcXG4gICAgICB9XFxuICAgIH1cXG4gIH1cXG59XFxuXCIsXG4gICAgXCJtZXRhZGF0YVwiOiB7fVxuICB9XG59O1xufSkoKTtcbi8vIHByZXR0aWVyLWlnbm9yZVxuKG5vZGUvKjogYW55Ki8pLmhhc2ggPSAnMWEyNDQzMzYyYTg0MmI5NjQzZmU1MWVjYzJkMWI1M2YnO1xubW9kdWxlLmV4cG9ydHMgPSBub2RlO1xuIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxZQUFZOztBQUVaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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