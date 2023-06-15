/**
 * @flow
 * @relayHash 82a4dc1cfbeddf93b9ee378148cff9ce
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type checkSuitesAccumulator_commit$ref = any;
export type checkSuitesAccumulatorQueryVariables = {|
  id: string,
  checkSuiteCount: number,
  checkSuiteCursor?: ?string,
  checkRunCount: number,
|};
export type checkSuitesAccumulatorQueryResponse = {|
  +node: ?{|
    +$fragmentRefs: checkSuitesAccumulator_commit$ref
  |}
|};
export type checkSuitesAccumulatorQuery = {|
  variables: checkSuitesAccumulatorQueryVariables,
  response: checkSuitesAccumulatorQueryResponse,
|};
*/

/*
query checkSuitesAccumulatorQuery(
  $id: ID!
  $checkSuiteCount: Int!
  $checkSuiteCursor: String
  $checkRunCount: Int!
) {
  node(id: $id) {
    __typename
    ... on Commit {
      ...checkSuitesAccumulator_commit_4ncEVO
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

fragment checkRunsAccumulator_checkSuite_2YXw6r on CheckSuite {
  id
  checkRuns(first: $checkRunCount) {
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

fragment checkSuiteView_checkSuite on CheckSuite {
  app {
    name
    id
  }
  status
  conclusion
}

fragment checkSuitesAccumulator_commit_4ncEVO on Commit {
  id
  checkSuites(first: $checkSuiteCount, after: $checkSuiteCursor) {
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
        ...checkSuiteView_checkSuite
        ...checkRunsAccumulator_checkSuite_2YXw6r
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
      "name": "checkSuiteCount",
      "type": "Int!",
      "defaultValue": null
    }, {
      "kind": "LocalArgument",
      "name": "checkSuiteCursor",
      "type": "String",
      "defaultValue": null
    }, {
      "kind": "LocalArgument",
      "name": "checkRunCount",
      "type": "Int!",
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
      "variableName": "checkSuiteCursor"
    }, {
      "kind": "Variable",
      "name": "first",
      "variableName": "checkSuiteCount"
    }],
    v5 = {
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
    },
    v6 = {
      "kind": "ScalarField",
      "alias": null,
      "name": "cursor",
      "args": null,
      "storageKey": null
    },
    v7 = {
      "kind": "ScalarField",
      "alias": null,
      "name": "status",
      "args": null,
      "storageKey": null
    },
    v8 = {
      "kind": "ScalarField",
      "alias": null,
      "name": "conclusion",
      "args": null,
      "storageKey": null
    },
    v9 = {
      "kind": "ScalarField",
      "alias": null,
      "name": "name",
      "args": null,
      "storageKey": null
    },
    v10 = [{
      "kind": "Variable",
      "name": "first",
      "variableName": "checkRunCount"
    }];
  return {
    "kind": "Request",
    "fragment": {
      "kind": "Fragment",
      "name": "checkSuitesAccumulatorQuery",
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
          "type": "Commit",
          "selections": [{
            "kind": "FragmentSpread",
            "name": "checkSuitesAccumulator_commit",
            "args": [{
              "kind": "Variable",
              "name": "checkRunCount",
              "variableName": "checkRunCount"
            }, {
              "kind": "Variable",
              "name": "checkSuiteCount",
              "variableName": "checkSuiteCount"
            }, {
              "kind": "Variable",
              "name": "checkSuiteCursor",
              "variableName": "checkSuiteCursor"
            }]
          }]
        }]
      }]
    },
    "operation": {
      "kind": "Operation",
      "name": "checkSuitesAccumulatorQuery",
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
          "type": "Commit",
          "selections": [{
            "kind": "LinkedField",
            "alias": null,
            "name": "checkSuites",
            "storageKey": null,
            "args": v4 /*: any*/,
            "concreteType": "CheckSuiteConnection",
            "plural": false,
            "selections": [v5 /*: any*/, {
              "kind": "LinkedField",
              "alias": null,
              "name": "edges",
              "storageKey": null,
              "args": null,
              "concreteType": "CheckSuiteEdge",
              "plural": true,
              "selections": [v6 /*: any*/, {
                "kind": "LinkedField",
                "alias": null,
                "name": "node",
                "storageKey": null,
                "args": null,
                "concreteType": "CheckSuite",
                "plural": false,
                "selections": [v3 /*: any*/, v7 /*: any*/, v8 /*: any*/, {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "app",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "App",
                  "plural": false,
                  "selections": [v9 /*: any*/, v3 /*: any*/]
                }, {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "checkRuns",
                  "storageKey": null,
                  "args": v10 /*: any*/,
                  "concreteType": "CheckRunConnection",
                  "plural": false,
                  "selections": [v5 /*: any*/, {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "edges",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "CheckRunEdge",
                    "plural": true,
                    "selections": [v6 /*: any*/, {
                      "kind": "LinkedField",
                      "alias": null,
                      "name": "node",
                      "storageKey": null,
                      "args": null,
                      "concreteType": "CheckRun",
                      "plural": false,
                      "selections": [v3 /*: any*/, v7 /*: any*/, v8 /*: any*/, v9 /*: any*/, {
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
                  "args": v10 /*: any*/,
                  "handle": "connection",
                  "key": "CheckRunsAccumulator_checkRuns",
                  "filters": null
                }, v2 /*: any*/]
              }]
            }]
          }, {
            "kind": "LinkedHandle",
            "alias": null,
            "name": "checkSuites",
            "args": v4 /*: any*/,
            "handle": "connection",
            "key": "CheckSuiteAccumulator_checkSuites",
            "filters": null
          }]
        }]
      }]
    },
    "params": {
      "operationKind": "query",
      "name": "checkSuitesAccumulatorQuery",
      "id": null,
      "text": "query checkSuitesAccumulatorQuery(\n  $id: ID!\n  $checkSuiteCount: Int!\n  $checkSuiteCursor: String\n  $checkRunCount: Int!\n) {\n  node(id: $id) {\n    __typename\n    ... on Commit {\n      ...checkSuitesAccumulator_commit_4ncEVO\n    }\n    id\n  }\n}\n\nfragment checkRunView_checkRun on CheckRun {\n  name\n  status\n  conclusion\n  title\n  summary\n  permalink\n  detailsUrl\n}\n\nfragment checkRunsAccumulator_checkSuite_2YXw6r on CheckSuite {\n  id\n  checkRuns(first: $checkRunCount) {\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n    edges {\n      cursor\n      node {\n        id\n        status\n        conclusion\n        ...checkRunView_checkRun\n        __typename\n      }\n    }\n  }\n}\n\nfragment checkSuiteView_checkSuite on CheckSuite {\n  app {\n    name\n    id\n  }\n  status\n  conclusion\n}\n\nfragment checkSuitesAccumulator_commit_4ncEVO on Commit {\n  id\n  checkSuites(first: $checkSuiteCount, after: $checkSuiteCursor) {\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n    edges {\n      cursor\n      node {\n        id\n        status\n        conclusion\n        ...checkSuiteView_checkSuite\n        ...checkRunsAccumulator_checkSuite_2YXw6r\n        __typename\n      }\n    }\n  }\n}\n",
      "metadata": {}
    }
  };
}();
// prettier-ignore
node /*: any*/.hash = 'b27827b6adb558a64ae6da715a8e438e';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJub2RlIiwidjAiLCJ2MSIsInYyIiwidjMiLCJ2NCIsInY1IiwidjYiLCJ2NyIsInY4IiwidjkiLCJ2MTAiLCJoYXNoIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJzb3VyY2VzIjpbImNoZWNrU3VpdGVzQWNjdW11bGF0b3JRdWVyeS5ncmFwaHFsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZsb3dcbiAqIEByZWxheUhhc2ggODJhNGRjMWNmYmVkZGY5M2I5ZWUzNzgxNDhjZmY5Y2VcbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qOjpcbmltcG9ydCB0eXBlIHsgQ29uY3JldGVSZXF1ZXN0IH0gZnJvbSAncmVsYXktcnVudGltZSc7XG50eXBlIGNoZWNrU3VpdGVzQWNjdW11bGF0b3JfY29tbWl0JHJlZiA9IGFueTtcbmV4cG9ydCB0eXBlIGNoZWNrU3VpdGVzQWNjdW11bGF0b3JRdWVyeVZhcmlhYmxlcyA9IHt8XG4gIGlkOiBzdHJpbmcsXG4gIGNoZWNrU3VpdGVDb3VudDogbnVtYmVyLFxuICBjaGVja1N1aXRlQ3Vyc29yPzogP3N0cmluZyxcbiAgY2hlY2tSdW5Db3VudDogbnVtYmVyLFxufH07XG5leHBvcnQgdHlwZSBjaGVja1N1aXRlc0FjY3VtdWxhdG9yUXVlcnlSZXNwb25zZSA9IHt8XG4gICtub2RlOiA/e3xcbiAgICArJGZyYWdtZW50UmVmczogY2hlY2tTdWl0ZXNBY2N1bXVsYXRvcl9jb21taXQkcmVmXG4gIHx9XG58fTtcbmV4cG9ydCB0eXBlIGNoZWNrU3VpdGVzQWNjdW11bGF0b3JRdWVyeSA9IHt8XG4gIHZhcmlhYmxlczogY2hlY2tTdWl0ZXNBY2N1bXVsYXRvclF1ZXJ5VmFyaWFibGVzLFxuICByZXNwb25zZTogY2hlY2tTdWl0ZXNBY2N1bXVsYXRvclF1ZXJ5UmVzcG9uc2UsXG58fTtcbiovXG5cblxuLypcbnF1ZXJ5IGNoZWNrU3VpdGVzQWNjdW11bGF0b3JRdWVyeShcbiAgJGlkOiBJRCFcbiAgJGNoZWNrU3VpdGVDb3VudDogSW50IVxuICAkY2hlY2tTdWl0ZUN1cnNvcjogU3RyaW5nXG4gICRjaGVja1J1bkNvdW50OiBJbnQhXG4pIHtcbiAgbm9kZShpZDogJGlkKSB7XG4gICAgX190eXBlbmFtZVxuICAgIC4uLiBvbiBDb21taXQge1xuICAgICAgLi4uY2hlY2tTdWl0ZXNBY2N1bXVsYXRvcl9jb21taXRfNG5jRVZPXG4gICAgfVxuICAgIGlkXG4gIH1cbn1cblxuZnJhZ21lbnQgY2hlY2tSdW5WaWV3X2NoZWNrUnVuIG9uIENoZWNrUnVuIHtcbiAgbmFtZVxuICBzdGF0dXNcbiAgY29uY2x1c2lvblxuICB0aXRsZVxuICBzdW1tYXJ5XG4gIHBlcm1hbGlua1xuICBkZXRhaWxzVXJsXG59XG5cbmZyYWdtZW50IGNoZWNrUnVuc0FjY3VtdWxhdG9yX2NoZWNrU3VpdGVfMllYdzZyIG9uIENoZWNrU3VpdGUge1xuICBpZFxuICBjaGVja1J1bnMoZmlyc3Q6ICRjaGVja1J1bkNvdW50KSB7XG4gICAgcGFnZUluZm8ge1xuICAgICAgaGFzTmV4dFBhZ2VcbiAgICAgIGVuZEN1cnNvclxuICAgIH1cbiAgICBlZGdlcyB7XG4gICAgICBjdXJzb3JcbiAgICAgIG5vZGUge1xuICAgICAgICBpZFxuICAgICAgICBzdGF0dXNcbiAgICAgICAgY29uY2x1c2lvblxuICAgICAgICAuLi5jaGVja1J1blZpZXdfY2hlY2tSdW5cbiAgICAgICAgX190eXBlbmFtZVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mcmFnbWVudCBjaGVja1N1aXRlVmlld19jaGVja1N1aXRlIG9uIENoZWNrU3VpdGUge1xuICBhcHAge1xuICAgIG5hbWVcbiAgICBpZFxuICB9XG4gIHN0YXR1c1xuICBjb25jbHVzaW9uXG59XG5cbmZyYWdtZW50IGNoZWNrU3VpdGVzQWNjdW11bGF0b3JfY29tbWl0XzRuY0VWTyBvbiBDb21taXQge1xuICBpZFxuICBjaGVja1N1aXRlcyhmaXJzdDogJGNoZWNrU3VpdGVDb3VudCwgYWZ0ZXI6ICRjaGVja1N1aXRlQ3Vyc29yKSB7XG4gICAgcGFnZUluZm8ge1xuICAgICAgaGFzTmV4dFBhZ2VcbiAgICAgIGVuZEN1cnNvclxuICAgIH1cbiAgICBlZGdlcyB7XG4gICAgICBjdXJzb3JcbiAgICAgIG5vZGUge1xuICAgICAgICBpZFxuICAgICAgICBzdGF0dXNcbiAgICAgICAgY29uY2x1c2lvblxuICAgICAgICAuLi5jaGVja1N1aXRlVmlld19jaGVja1N1aXRlXG4gICAgICAgIC4uLmNoZWNrUnVuc0FjY3VtdWxhdG9yX2NoZWNrU3VpdGVfMllYdzZyXG4gICAgICAgIF9fdHlwZW5hbWVcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiovXG5cbmNvbnN0IG5vZGUvKjogQ29uY3JldGVSZXF1ZXN0Ki8gPSAoZnVuY3Rpb24oKXtcbnZhciB2MCA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICBcIm5hbWVcIjogXCJpZFwiLFxuICAgIFwidHlwZVwiOiBcIklEIVwiLFxuICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgfSxcbiAge1xuICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICBcIm5hbWVcIjogXCJjaGVja1N1aXRlQ291bnRcIixcbiAgICBcInR5cGVcIjogXCJJbnQhXCIsXG4gICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICB9LFxuICB7XG4gICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgIFwibmFtZVwiOiBcImNoZWNrU3VpdGVDdXJzb3JcIixcbiAgICBcInR5cGVcIjogXCJTdHJpbmdcIixcbiAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gIH0sXG4gIHtcbiAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwiY2hlY2tSdW5Db3VudFwiLFxuICAgIFwidHlwZVwiOiBcIkludCFcIixcbiAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gIH1cbl0sXG52MSA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgXCJuYW1lXCI6IFwiaWRcIixcbiAgICBcInZhcmlhYmxlTmFtZVwiOiBcImlkXCJcbiAgfVxuXSxcbnYyID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcIl9fdHlwZW5hbWVcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjMgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiaWRcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjQgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgIFwibmFtZVwiOiBcImFmdGVyXCIsXG4gICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJjaGVja1N1aXRlQ3Vyc29yXCJcbiAgfSxcbiAge1xuICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgXCJuYW1lXCI6IFwiZmlyc3RcIixcbiAgICBcInZhcmlhYmxlTmFtZVwiOiBcImNoZWNrU3VpdGVDb3VudFwiXG4gIH1cbl0sXG52NSA9IHtcbiAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJwYWdlSW5mb1wiLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwiY29uY3JldGVUeXBlXCI6IFwiUGFnZUluZm9cIixcbiAgXCJwbHVyYWxcIjogZmFsc2UsXG4gIFwic2VsZWN0aW9uc1wiOiBbXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcImhhc05leHRQYWdlXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwiZW5kQ3Vyc29yXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfVxuICBdXG59LFxudjYgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiY3Vyc29yXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnY3ID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcInN0YXR1c1wiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52OCA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJjb25jbHVzaW9uXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnY5ID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcIm5hbWVcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjEwID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICBcIm5hbWVcIjogXCJmaXJzdFwiLFxuICAgIFwidmFyaWFibGVOYW1lXCI6IFwiY2hlY2tSdW5Db3VudFwiXG4gIH1cbl07XG5yZXR1cm4ge1xuICBcImtpbmRcIjogXCJSZXF1ZXN0XCIsXG4gIFwiZnJhZ21lbnRcIjoge1xuICAgIFwia2luZFwiOiBcIkZyYWdtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwiY2hlY2tTdWl0ZXNBY2N1bXVsYXRvclF1ZXJ5XCIsXG4gICAgXCJ0eXBlXCI6IFwiUXVlcnlcIixcbiAgICBcIm1ldGFkYXRhXCI6IG51bGwsXG4gICAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6ICh2MC8qOiBhbnkqLyksXG4gICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICBcIm5hbWVcIjogXCJub2RlXCIsXG4gICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICBcImFyZ3NcIjogKHYxLyo6IGFueSovKSxcbiAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiSW5saW5lRnJhZ21lbnRcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIkNvbW1pdFwiLFxuICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkZyYWdtZW50U3ByZWFkXCIsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY2hlY2tTdWl0ZXNBY2N1bXVsYXRvcl9jb21taXRcIixcbiAgICAgICAgICAgICAgICBcImFyZ3NcIjogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjaGVja1J1bkNvdW50XCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFyaWFibGVOYW1lXCI6IFwiY2hlY2tSdW5Db3VudFwiXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjaGVja1N1aXRlQ291bnRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJjaGVja1N1aXRlQ291bnRcIlxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY2hlY2tTdWl0ZUN1cnNvclwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhcmlhYmxlTmFtZVwiOiBcImNoZWNrU3VpdGVDdXJzb3JcIlxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAgXCJvcGVyYXRpb25cIjoge1xuICAgIFwia2luZFwiOiBcIk9wZXJhdGlvblwiLFxuICAgIFwibmFtZVwiOiBcImNoZWNrU3VpdGVzQWNjdW11bGF0b3JRdWVyeVwiLFxuICAgIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiAodjAvKjogYW55Ki8pLFxuICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgXCJuYW1lXCI6IFwibm9kZVwiLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgXCJhcmdzXCI6ICh2MS8qOiBhbnkqLyksXG4gICAgICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICh2Mi8qOiBhbnkqLyksXG4gICAgICAgICAgKHYzLyo6IGFueSovKSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJJbmxpbmVGcmFnbWVudFwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiQ29tbWl0XCIsXG4gICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY2hlY2tTdWl0ZXNcIixcbiAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcImFyZ3NcIjogKHY0Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIkNoZWNrU3VpdGVDb25uZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICh2NS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZWRnZXNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIkNoZWNrU3VpdGVFZGdlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgKHY2Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibm9kZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiQ2hlY2tTdWl0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAodjMvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAodjcvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAodjgvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiYXBwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJBcHBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY5Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2My8qOiBhbnkqLylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjaGVja1J1bnNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogKHYxMC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJDaGVja1J1bkNvbm5lY3Rpb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY1Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJlZGdlc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiQ2hlY2tSdW5FZGdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY2Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibm9kZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiQ2hlY2tSdW5cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYzLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY3Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY4Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY5Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInRpdGxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInN1bW1hcnlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicGVybWFsaW5rXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImRldGFpbHNVcmxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjIvKjogYW55Ki8pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkSGFuZGxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNoZWNrUnVuc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiAodjEwLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImhhbmRsZVwiOiBcImNvbm5lY3Rpb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtleVwiOiBcIkNoZWNrUnVuc0FjY3VtdWxhdG9yX2NoZWNrUnVuc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZmlsdGVyc1wiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh2Mi8qOiBhbnkqLylcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRIYW5kbGVcIixcbiAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY2hlY2tTdWl0ZXNcIixcbiAgICAgICAgICAgICAgICBcImFyZ3NcIjogKHY0Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICBcImhhbmRsZVwiOiBcImNvbm5lY3Rpb25cIixcbiAgICAgICAgICAgICAgICBcImtleVwiOiBcIkNoZWNrU3VpdGVBY2N1bXVsYXRvcl9jaGVja1N1aXRlc1wiLFxuICAgICAgICAgICAgICAgIFwiZmlsdGVyc1wiOiBudWxsXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIFwicGFyYW1zXCI6IHtcbiAgICBcIm9wZXJhdGlvbktpbmRcIjogXCJxdWVyeVwiLFxuICAgIFwibmFtZVwiOiBcImNoZWNrU3VpdGVzQWNjdW11bGF0b3JRdWVyeVwiLFxuICAgIFwiaWRcIjogbnVsbCxcbiAgICBcInRleHRcIjogXCJxdWVyeSBjaGVja1N1aXRlc0FjY3VtdWxhdG9yUXVlcnkoXFxuICAkaWQ6IElEIVxcbiAgJGNoZWNrU3VpdGVDb3VudDogSW50IVxcbiAgJGNoZWNrU3VpdGVDdXJzb3I6IFN0cmluZ1xcbiAgJGNoZWNrUnVuQ291bnQ6IEludCFcXG4pIHtcXG4gIG5vZGUoaWQ6ICRpZCkge1xcbiAgICBfX3R5cGVuYW1lXFxuICAgIC4uLiBvbiBDb21taXQge1xcbiAgICAgIC4uLmNoZWNrU3VpdGVzQWNjdW11bGF0b3JfY29tbWl0XzRuY0VWT1xcbiAgICB9XFxuICAgIGlkXFxuICB9XFxufVxcblxcbmZyYWdtZW50IGNoZWNrUnVuVmlld19jaGVja1J1biBvbiBDaGVja1J1biB7XFxuICBuYW1lXFxuICBzdGF0dXNcXG4gIGNvbmNsdXNpb25cXG4gIHRpdGxlXFxuICBzdW1tYXJ5XFxuICBwZXJtYWxpbmtcXG4gIGRldGFpbHNVcmxcXG59XFxuXFxuZnJhZ21lbnQgY2hlY2tSdW5zQWNjdW11bGF0b3JfY2hlY2tTdWl0ZV8yWVh3NnIgb24gQ2hlY2tTdWl0ZSB7XFxuICBpZFxcbiAgY2hlY2tSdW5zKGZpcnN0OiAkY2hlY2tSdW5Db3VudCkge1xcbiAgICBwYWdlSW5mbyB7XFxuICAgICAgaGFzTmV4dFBhZ2VcXG4gICAgICBlbmRDdXJzb3JcXG4gICAgfVxcbiAgICBlZGdlcyB7XFxuICAgICAgY3Vyc29yXFxuICAgICAgbm9kZSB7XFxuICAgICAgICBpZFxcbiAgICAgICAgc3RhdHVzXFxuICAgICAgICBjb25jbHVzaW9uXFxuICAgICAgICAuLi5jaGVja1J1blZpZXdfY2hlY2tSdW5cXG4gICAgICAgIF9fdHlwZW5hbWVcXG4gICAgICB9XFxuICAgIH1cXG4gIH1cXG59XFxuXFxuZnJhZ21lbnQgY2hlY2tTdWl0ZVZpZXdfY2hlY2tTdWl0ZSBvbiBDaGVja1N1aXRlIHtcXG4gIGFwcCB7XFxuICAgIG5hbWVcXG4gICAgaWRcXG4gIH1cXG4gIHN0YXR1c1xcbiAgY29uY2x1c2lvblxcbn1cXG5cXG5mcmFnbWVudCBjaGVja1N1aXRlc0FjY3VtdWxhdG9yX2NvbW1pdF80bmNFVk8gb24gQ29tbWl0IHtcXG4gIGlkXFxuICBjaGVja1N1aXRlcyhmaXJzdDogJGNoZWNrU3VpdGVDb3VudCwgYWZ0ZXI6ICRjaGVja1N1aXRlQ3Vyc29yKSB7XFxuICAgIHBhZ2VJbmZvIHtcXG4gICAgICBoYXNOZXh0UGFnZVxcbiAgICAgIGVuZEN1cnNvclxcbiAgICB9XFxuICAgIGVkZ2VzIHtcXG4gICAgICBjdXJzb3JcXG4gICAgICBub2RlIHtcXG4gICAgICAgIGlkXFxuICAgICAgICBzdGF0dXNcXG4gICAgICAgIGNvbmNsdXNpb25cXG4gICAgICAgIC4uLmNoZWNrU3VpdGVWaWV3X2NoZWNrU3VpdGVcXG4gICAgICAgIC4uLmNoZWNrUnVuc0FjY3VtdWxhdG9yX2NoZWNrU3VpdGVfMllYdzZyXFxuICAgICAgICBfX3R5cGVuYW1lXFxuICAgICAgfVxcbiAgICB9XFxuICB9XFxufVxcblwiLFxuICAgIFwibWV0YWRhdGFcIjoge31cbiAgfVxufTtcbn0pKCk7XG4vLyBwcmV0dGllci1pZ25vcmVcbihub2RlLyo6IGFueSovKS5oYXNoID0gJ2IyNzgyN2I2YWRiNTU4YTY0YWU2ZGE3MTVhOGU0MzhlJztcbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsWUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLE1BQU1BLElBQUkseUJBQXlCLFlBQVU7RUFDN0MsSUFBSUMsRUFBRSxHQUFHLENBQ1A7TUFDRSxNQUFNLEVBQUUsZUFBZTtNQUN2QixNQUFNLEVBQUUsSUFBSTtNQUNaLE1BQU0sRUFBRSxLQUFLO01BQ2IsY0FBYyxFQUFF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