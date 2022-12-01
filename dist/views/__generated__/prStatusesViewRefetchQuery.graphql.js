/**
 * @flow
 * @relayHash 0464a2c670f74f89527619b5422aff65
 */

/* eslint-disable */
'use strict';
/*::
import type { ConcreteRequest } from 'relay-runtime';
type prStatusesView_pullRequest$ref = any;
export type prStatusesViewRefetchQueryVariables = {|
  id: string,
  checkSuiteCount: number,
  checkSuiteCursor?: ?string,
  checkRunCount: number,
  checkRunCursor?: ?string,
|};
export type prStatusesViewRefetchQueryResponse = {|
  +node: ?{|
    +$fragmentRefs: prStatusesView_pullRequest$ref
  |}
|};
export type prStatusesViewRefetchQuery = {|
  variables: prStatusesViewRefetchQueryVariables,
  response: prStatusesViewRefetchQueryResponse,
|};
*/

/*
query prStatusesViewRefetchQuery(
  $id: ID!
  $checkSuiteCount: Int!
  $checkSuiteCursor: String
  $checkRunCount: Int!
  $checkRunCursor: String
) {
  node(id: $id) {
    __typename
    ... on PullRequest {
      ...prStatusesView_pullRequest_1oGSNs
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

fragment checkSuiteView_checkSuite on CheckSuite {
  app {
    name
    id
  }
  status
  conclusion
}

fragment checkSuitesAccumulator_commit_1oGSNs on Commit {
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
        ...checkRunsAccumulator_checkSuite_Rvfr1
        __typename
      }
    }
  }
}

fragment prStatusContextView_context on StatusContext {
  context
  description
  state
  targetUrl
}

fragment prStatusesView_pullRequest_1oGSNs on PullRequest {
  id
  recentCommits: commits(last: 1) {
    edges {
      node {
        commit {
          status {
            state
            contexts {
              id
              state
              ...prStatusContextView_context
            }
            id
          }
          ...checkSuitesAccumulator_commit_1oGSNs
          id
        }
        id
      }
    }
  }
}
*/

const node
/*: ConcreteRequest*/
= function () {
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
      v4 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "state",
    "args": null,
    "storageKey": null
  },
      v5 = [{
    "kind": "Variable",
    "name": "after",
    "variableName": "checkSuiteCursor"
  }, {
    "kind": "Variable",
    "name": "first",
    "variableName": "checkSuiteCount"
  }],
      v6 = {
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
      v7 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "cursor",
    "args": null,
    "storageKey": null
  },
      v8 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "status",
    "args": null,
    "storageKey": null
  },
      v9 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "conclusion",
    "args": null,
    "storageKey": null
  },
      v10 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "name",
    "args": null,
    "storageKey": null
  },
      v11 = [{
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
      "name": "prStatusesViewRefetchQuery",
      "type": "Query",
      "metadata": null,
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "node",
        "storageKey": null,
        "args": v1
        /*: any*/
        ,
        "concreteType": null,
        "plural": false,
        "selections": [{
          "kind": "InlineFragment",
          "type": "PullRequest",
          "selections": [{
            "kind": "FragmentSpread",
            "name": "prStatusesView_pullRequest",
            "args": [{
              "kind": "Variable",
              "name": "checkRunCount",
              "variableName": "checkRunCount"
            }, {
              "kind": "Variable",
              "name": "checkRunCursor",
              "variableName": "checkRunCursor"
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
      "name": "prStatusesViewRefetchQuery",
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "node",
        "storageKey": null,
        "args": v1
        /*: any*/
        ,
        "concreteType": null,
        "plural": false,
        "selections": [v2
        /*: any*/
        , v3
        /*: any*/
        , {
          "kind": "InlineFragment",
          "type": "PullRequest",
          "selections": [{
            "kind": "LinkedField",
            "alias": "recentCommits",
            "name": "commits",
            "storageKey": "commits(last:1)",
            "args": [{
              "kind": "Literal",
              "name": "last",
              "value": 1
            }],
            "concreteType": "PullRequestCommitConnection",
            "plural": false,
            "selections": [{
              "kind": "LinkedField",
              "alias": null,
              "name": "edges",
              "storageKey": null,
              "args": null,
              "concreteType": "PullRequestCommitEdge",
              "plural": true,
              "selections": [{
                "kind": "LinkedField",
                "alias": null,
                "name": "node",
                "storageKey": null,
                "args": null,
                "concreteType": "PullRequestCommit",
                "plural": false,
                "selections": [{
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "commit",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "Commit",
                  "plural": false,
                  "selections": [{
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "status",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Status",
                    "plural": false,
                    "selections": [v4
                    /*: any*/
                    , {
                      "kind": "LinkedField",
                      "alias": null,
                      "name": "contexts",
                      "storageKey": null,
                      "args": null,
                      "concreteType": "StatusContext",
                      "plural": true,
                      "selections": [v3
                      /*: any*/
                      , v4
                      /*: any*/
                      , {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "context",
                        "args": null,
                        "storageKey": null
                      }, {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "description",
                        "args": null,
                        "storageKey": null
                      }, {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "targetUrl",
                        "args": null,
                        "storageKey": null
                      }]
                    }, v3
                    /*: any*/
                    ]
                  }, v3
                  /*: any*/
                  , {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "checkSuites",
                    "storageKey": null,
                    "args": v5
                    /*: any*/
                    ,
                    "concreteType": "CheckSuiteConnection",
                    "plural": false,
                    "selections": [v6
                    /*: any*/
                    , {
                      "kind": "LinkedField",
                      "alias": null,
                      "name": "edges",
                      "storageKey": null,
                      "args": null,
                      "concreteType": "CheckSuiteEdge",
                      "plural": true,
                      "selections": [v7
                      /*: any*/
                      , {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "node",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "CheckSuite",
                        "plural": false,
                        "selections": [v3
                        /*: any*/
                        , v8
                        /*: any*/
                        , v9
                        /*: any*/
                        , {
                          "kind": "LinkedField",
                          "alias": null,
                          "name": "app",
                          "storageKey": null,
                          "args": null,
                          "concreteType": "App",
                          "plural": false,
                          "selections": [v10
                          /*: any*/
                          , v3
                          /*: any*/
                          ]
                        }, {
                          "kind": "LinkedField",
                          "alias": null,
                          "name": "checkRuns",
                          "storageKey": null,
                          "args": v11
                          /*: any*/
                          ,
                          "concreteType": "CheckRunConnection",
                          "plural": false,
                          "selections": [v6
                          /*: any*/
                          , {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "edges",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "CheckRunEdge",
                            "plural": true,
                            "selections": [v7
                            /*: any*/
                            , {
                              "kind": "LinkedField",
                              "alias": null,
                              "name": "node",
                              "storageKey": null,
                              "args": null,
                              "concreteType": "CheckRun",
                              "plural": false,
                              "selections": [v3
                              /*: any*/
                              , v8
                              /*: any*/
                              , v9
                              /*: any*/
                              , v10
                              /*: any*/
                              , {
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
                              }, v2
                              /*: any*/
                              ]
                            }]
                          }]
                        }, {
                          "kind": "LinkedHandle",
                          "alias": null,
                          "name": "checkRuns",
                          "args": v11
                          /*: any*/
                          ,
                          "handle": "connection",
                          "key": "CheckRunsAccumulator_checkRuns",
                          "filters": null
                        }, v2
                        /*: any*/
                        ]
                      }]
                    }]
                  }, {
                    "kind": "LinkedHandle",
                    "alias": null,
                    "name": "checkSuites",
                    "args": v5
                    /*: any*/
                    ,
                    "handle": "connection",
                    "key": "CheckSuiteAccumulator_checkSuites",
                    "filters": null
                  }]
                }, v3
                /*: any*/
                ]
              }]
            }]
          }]
        }]
      }]
    },
    "params": {
      "operationKind": "query",
      "name": "prStatusesViewRefetchQuery",
      "id": null,
      "text": "query prStatusesViewRefetchQuery(\n  $id: ID!\n  $checkSuiteCount: Int!\n  $checkSuiteCursor: String\n  $checkRunCount: Int!\n  $checkRunCursor: String\n) {\n  node(id: $id) {\n    __typename\n    ... on PullRequest {\n      ...prStatusesView_pullRequest_1oGSNs\n    }\n    id\n  }\n}\n\nfragment checkRunView_checkRun on CheckRun {\n  name\n  status\n  conclusion\n  title\n  summary\n  permalink\n  detailsUrl\n}\n\nfragment checkRunsAccumulator_checkSuite_Rvfr1 on CheckSuite {\n  id\n  checkRuns(first: $checkRunCount, after: $checkRunCursor) {\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n    edges {\n      cursor\n      node {\n        id\n        status\n        conclusion\n        ...checkRunView_checkRun\n        __typename\n      }\n    }\n  }\n}\n\nfragment checkSuiteView_checkSuite on CheckSuite {\n  app {\n    name\n    id\n  }\n  status\n  conclusion\n}\n\nfragment checkSuitesAccumulator_commit_1oGSNs on Commit {\n  id\n  checkSuites(first: $checkSuiteCount, after: $checkSuiteCursor) {\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n    edges {\n      cursor\n      node {\n        id\n        status\n        conclusion\n        ...checkSuiteView_checkSuite\n        ...checkRunsAccumulator_checkSuite_Rvfr1\n        __typename\n      }\n    }\n  }\n}\n\nfragment prStatusContextView_context on StatusContext {\n  context\n  description\n  state\n  targetUrl\n}\n\nfragment prStatusesView_pullRequest_1oGSNs on PullRequest {\n  id\n  recentCommits: commits(last: 1) {\n    edges {\n      node {\n        commit {\n          status {\n            state\n            contexts {\n              id\n              state\n              ...prStatusContextView_context\n            }\n            id\n          }\n          ...checkSuitesAccumulator_commit_1oGSNs\n          id\n        }\n        id\n      }\n    }\n  }\n}\n",
      "metadata": {}
    }
  };
}(); // prettier-ignore


node
/*: any*/
.hash = '34c4cfc61df6413f34a5efa61768cd48';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi92aWV3cy9fX2dlbmVyYXRlZF9fL3ByU3RhdHVzZXNWaWV3UmVmZXRjaFF1ZXJ5LmdyYXBocWwuanMiXSwibmFtZXMiOlsibm9kZSIsInYwIiwidjEiLCJ2MiIsInYzIiwidjQiLCJ2NSIsInY2IiwidjciLCJ2OCIsInY5IiwidjEwIiwidjExIiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxNQUFNQTtB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c2ggMDQ2NGEyYzY3MGY3NGY4OTUyNzYxOWI1NDIyYWZmNjVcbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qOjpcbmltcG9ydCB0eXBlIHsgQ29uY3JldGVSZXF1ZXN0IH0gZnJvbSAncmVsYXktcnVudGltZSc7XG50eXBlIHByU3RhdHVzZXNWaWV3X3B1bGxSZXF1ZXN0JHJlZiA9IGFueTtcbmV4cG9ydCB0eXBlIHByU3RhdHVzZXNWaWV3UmVmZXRjaFF1ZXJ5VmFyaWFibGVzID0ge3xcbiAgaWQ6IHN0cmluZyxcbiAgY2hlY2tTdWl0ZUNvdW50OiBudW1iZXIsXG4gIGNoZWNrU3VpdGVDdXJzb3I/OiA/c3RyaW5nLFxuICBjaGVja1J1bkNvdW50OiBudW1iZXIsXG4gIGNoZWNrUnVuQ3Vyc29yPzogP3N0cmluZyxcbnx9O1xuZXhwb3J0IHR5cGUgcHJTdGF0dXNlc1ZpZXdSZWZldGNoUXVlcnlSZXNwb25zZSA9IHt8XG4gICtub2RlOiA/e3xcbiAgICArJGZyYWdtZW50UmVmczogcHJTdGF0dXNlc1ZpZXdfcHVsbFJlcXVlc3QkcmVmXG4gIHx9XG58fTtcbmV4cG9ydCB0eXBlIHByU3RhdHVzZXNWaWV3UmVmZXRjaFF1ZXJ5ID0ge3xcbiAgdmFyaWFibGVzOiBwclN0YXR1c2VzVmlld1JlZmV0Y2hRdWVyeVZhcmlhYmxlcyxcbiAgcmVzcG9uc2U6IHByU3RhdHVzZXNWaWV3UmVmZXRjaFF1ZXJ5UmVzcG9uc2UsXG58fTtcbiovXG5cblxuLypcbnF1ZXJ5IHByU3RhdHVzZXNWaWV3UmVmZXRjaFF1ZXJ5KFxuICAkaWQ6IElEIVxuICAkY2hlY2tTdWl0ZUNvdW50OiBJbnQhXG4gICRjaGVja1N1aXRlQ3Vyc29yOiBTdHJpbmdcbiAgJGNoZWNrUnVuQ291bnQ6IEludCFcbiAgJGNoZWNrUnVuQ3Vyc29yOiBTdHJpbmdcbikge1xuICBub2RlKGlkOiAkaWQpIHtcbiAgICBfX3R5cGVuYW1lXG4gICAgLi4uIG9uIFB1bGxSZXF1ZXN0IHtcbiAgICAgIC4uLnByU3RhdHVzZXNWaWV3X3B1bGxSZXF1ZXN0XzFvR1NOc1xuICAgIH1cbiAgICBpZFxuICB9XG59XG5cbmZyYWdtZW50IGNoZWNrUnVuVmlld19jaGVja1J1biBvbiBDaGVja1J1biB7XG4gIG5hbWVcbiAgc3RhdHVzXG4gIGNvbmNsdXNpb25cbiAgdGl0bGVcbiAgc3VtbWFyeVxuICBwZXJtYWxpbmtcbiAgZGV0YWlsc1VybFxufVxuXG5mcmFnbWVudCBjaGVja1J1bnNBY2N1bXVsYXRvcl9jaGVja1N1aXRlX1J2ZnIxIG9uIENoZWNrU3VpdGUge1xuICBpZFxuICBjaGVja1J1bnMoZmlyc3Q6ICRjaGVja1J1bkNvdW50LCBhZnRlcjogJGNoZWNrUnVuQ3Vyc29yKSB7XG4gICAgcGFnZUluZm8ge1xuICAgICAgaGFzTmV4dFBhZ2VcbiAgICAgIGVuZEN1cnNvclxuICAgIH1cbiAgICBlZGdlcyB7XG4gICAgICBjdXJzb3JcbiAgICAgIG5vZGUge1xuICAgICAgICBpZFxuICAgICAgICBzdGF0dXNcbiAgICAgICAgY29uY2x1c2lvblxuICAgICAgICAuLi5jaGVja1J1blZpZXdfY2hlY2tSdW5cbiAgICAgICAgX190eXBlbmFtZVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mcmFnbWVudCBjaGVja1N1aXRlVmlld19jaGVja1N1aXRlIG9uIENoZWNrU3VpdGUge1xuICBhcHAge1xuICAgIG5hbWVcbiAgICBpZFxuICB9XG4gIHN0YXR1c1xuICBjb25jbHVzaW9uXG59XG5cbmZyYWdtZW50IGNoZWNrU3VpdGVzQWNjdW11bGF0b3JfY29tbWl0XzFvR1NOcyBvbiBDb21taXQge1xuICBpZFxuICBjaGVja1N1aXRlcyhmaXJzdDogJGNoZWNrU3VpdGVDb3VudCwgYWZ0ZXI6ICRjaGVja1N1aXRlQ3Vyc29yKSB7XG4gICAgcGFnZUluZm8ge1xuICAgICAgaGFzTmV4dFBhZ2VcbiAgICAgIGVuZEN1cnNvclxuICAgIH1cbiAgICBlZGdlcyB7XG4gICAgICBjdXJzb3JcbiAgICAgIG5vZGUge1xuICAgICAgICBpZFxuICAgICAgICBzdGF0dXNcbiAgICAgICAgY29uY2x1c2lvblxuICAgICAgICAuLi5jaGVja1N1aXRlVmlld19jaGVja1N1aXRlXG4gICAgICAgIC4uLmNoZWNrUnVuc0FjY3VtdWxhdG9yX2NoZWNrU3VpdGVfUnZmcjFcbiAgICAgICAgX190eXBlbmFtZVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mcmFnbWVudCBwclN0YXR1c0NvbnRleHRWaWV3X2NvbnRleHQgb24gU3RhdHVzQ29udGV4dCB7XG4gIGNvbnRleHRcbiAgZGVzY3JpcHRpb25cbiAgc3RhdGVcbiAgdGFyZ2V0VXJsXG59XG5cbmZyYWdtZW50IHByU3RhdHVzZXNWaWV3X3B1bGxSZXF1ZXN0XzFvR1NOcyBvbiBQdWxsUmVxdWVzdCB7XG4gIGlkXG4gIHJlY2VudENvbW1pdHM6IGNvbW1pdHMobGFzdDogMSkge1xuICAgIGVkZ2VzIHtcbiAgICAgIG5vZGUge1xuICAgICAgICBjb21taXQge1xuICAgICAgICAgIHN0YXR1cyB7XG4gICAgICAgICAgICBzdGF0ZVxuICAgICAgICAgICAgY29udGV4dHMge1xuICAgICAgICAgICAgICBpZFxuICAgICAgICAgICAgICBzdGF0ZVxuICAgICAgICAgICAgICAuLi5wclN0YXR1c0NvbnRleHRWaWV3X2NvbnRleHRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlkXG4gICAgICAgICAgfVxuICAgICAgICAgIC4uLmNoZWNrU3VpdGVzQWNjdW11bGF0b3JfY29tbWl0XzFvR1NOc1xuICAgICAgICAgIGlkXG4gICAgICAgIH1cbiAgICAgICAgaWRcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiovXG5cbmNvbnN0IG5vZGUvKjogQ29uY3JldGVSZXF1ZXN0Ki8gPSAoZnVuY3Rpb24oKXtcbnZhciB2MCA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICBcIm5hbWVcIjogXCJpZFwiLFxuICAgIFwidHlwZVwiOiBcIklEIVwiLFxuICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgfSxcbiAge1xuICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICBcIm5hbWVcIjogXCJjaGVja1N1aXRlQ291bnRcIixcbiAgICBcInR5cGVcIjogXCJJbnQhXCIsXG4gICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICB9LFxuICB7XG4gICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgIFwibmFtZVwiOiBcImNoZWNrU3VpdGVDdXJzb3JcIixcbiAgICBcInR5cGVcIjogXCJTdHJpbmdcIixcbiAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gIH0sXG4gIHtcbiAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwiY2hlY2tSdW5Db3VudFwiLFxuICAgIFwidHlwZVwiOiBcIkludCFcIixcbiAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gIH0sXG4gIHtcbiAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwiY2hlY2tSdW5DdXJzb3JcIixcbiAgICBcInR5cGVcIjogXCJTdHJpbmdcIixcbiAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gIH1cbl0sXG52MSA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgXCJuYW1lXCI6IFwiaWRcIixcbiAgICBcInZhcmlhYmxlTmFtZVwiOiBcImlkXCJcbiAgfVxuXSxcbnYyID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcIl9fdHlwZW5hbWVcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjMgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiaWRcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjQgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwic3RhdGVcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjUgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgIFwibmFtZVwiOiBcImFmdGVyXCIsXG4gICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJjaGVja1N1aXRlQ3Vyc29yXCJcbiAgfSxcbiAge1xuICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgXCJuYW1lXCI6IFwiZmlyc3RcIixcbiAgICBcInZhcmlhYmxlTmFtZVwiOiBcImNoZWNrU3VpdGVDb3VudFwiXG4gIH1cbl0sXG52NiA9IHtcbiAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJwYWdlSW5mb1wiLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwiY29uY3JldGVUeXBlXCI6IFwiUGFnZUluZm9cIixcbiAgXCJwbHVyYWxcIjogZmFsc2UsXG4gIFwic2VsZWN0aW9uc1wiOiBbXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcImhhc05leHRQYWdlXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwiZW5kQ3Vyc29yXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfVxuICBdXG59LFxudjcgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiY3Vyc29yXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnY4ID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcInN0YXR1c1wiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52OSA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJjb25jbHVzaW9uXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnYxMCA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJuYW1lXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnYxMSA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgXCJuYW1lXCI6IFwiYWZ0ZXJcIixcbiAgICBcInZhcmlhYmxlTmFtZVwiOiBcImNoZWNrUnVuQ3Vyc29yXCJcbiAgfSxcbiAge1xuICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgXCJuYW1lXCI6IFwiZmlyc3RcIixcbiAgICBcInZhcmlhYmxlTmFtZVwiOiBcImNoZWNrUnVuQ291bnRcIlxuICB9XG5dO1xucmV0dXJuIHtcbiAgXCJraW5kXCI6IFwiUmVxdWVzdFwiLFxuICBcImZyYWdtZW50XCI6IHtcbiAgICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICAgIFwibmFtZVwiOiBcInByU3RhdHVzZXNWaWV3UmVmZXRjaFF1ZXJ5XCIsXG4gICAgXCJ0eXBlXCI6IFwiUXVlcnlcIixcbiAgICBcIm1ldGFkYXRhXCI6IG51bGwsXG4gICAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6ICh2MC8qOiBhbnkqLyksXG4gICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICBcIm5hbWVcIjogXCJub2RlXCIsXG4gICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICBcImFyZ3NcIjogKHYxLyo6IGFueSovKSxcbiAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiSW5saW5lRnJhZ21lbnRcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIlB1bGxSZXF1ZXN0XCIsXG4gICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiRnJhZ21lbnRTcHJlYWRcIixcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJwclN0YXR1c2VzVmlld19wdWxsUmVxdWVzdFwiLFxuICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNoZWNrUnVuQ291bnRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJjaGVja1J1bkNvdW50XCJcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNoZWNrUnVuQ3Vyc29yXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFyaWFibGVOYW1lXCI6IFwiY2hlY2tSdW5DdXJzb3JcIlxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY2hlY2tTdWl0ZUNvdW50XCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFyaWFibGVOYW1lXCI6IFwiY2hlY2tTdWl0ZUNvdW50XCJcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNoZWNrU3VpdGVDdXJzb3JcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJjaGVja1N1aXRlQ3Vyc29yXCJcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIFwib3BlcmF0aW9uXCI6IHtcbiAgICBcImtpbmRcIjogXCJPcGVyYXRpb25cIixcbiAgICBcIm5hbWVcIjogXCJwclN0YXR1c2VzVmlld1JlZmV0Y2hRdWVyeVwiLFxuICAgIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiAodjAvKjogYW55Ki8pLFxuICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgXCJuYW1lXCI6IFwibm9kZVwiLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgXCJhcmdzXCI6ICh2MS8qOiBhbnkqLyksXG4gICAgICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICh2Mi8qOiBhbnkqLyksXG4gICAgICAgICAgKHYzLyo6IGFueSovKSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJJbmxpbmVGcmFnbWVudFwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiUHVsbFJlcXVlc3RcIixcbiAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogXCJyZWNlbnRDb21taXRzXCIsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY29tbWl0c1wiLFxuICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBcImNvbW1pdHMobGFzdDoxKVwiLFxuICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpdGVyYWxcIixcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibGFzdFwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhbHVlXCI6IDFcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUHVsbFJlcXVlc3RDb21taXRDb25uZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJlZGdlc1wiLFxuICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUHVsbFJlcXVlc3RDb21taXRFZGdlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm5vZGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlB1bGxSZXF1ZXN0Q29tbWl0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjb21taXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIkNvbW1pdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwic3RhdHVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJTdGF0dXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY0Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY29udGV4dHNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlN0YXR1c0NvbnRleHRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjMvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjQvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY29udGV4dFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJkZXNjcmlwdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ0YXJnZXRVcmxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjMvKjogYW55Ki8pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjMvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNoZWNrU3VpdGVzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogKHY1Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJDaGVja1N1aXRlQ29ubmVjdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjYvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJlZGdlc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiQ2hlY2tTdWl0ZUVkZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjcvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibm9kZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiQ2hlY2tTdWl0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjMvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY4Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2OS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiYXBwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJBcHBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYxMC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYzLyo6IGFueSovKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNoZWNrUnVuc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6ICh2MTEvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIkNoZWNrUnVuQ29ubmVjdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjYvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJlZGdlc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiQ2hlY2tSdW5FZGdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY3Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm5vZGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIkNoZWNrUnVuXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2My8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjgvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY5Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2MTAvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInRpdGxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJzdW1tYXJ5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJwZXJtYWxpbmtcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImRldGFpbHNVcmxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYyLyo6IGFueSovKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkSGFuZGxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY2hlY2tSdW5zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiAodjExLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoYW5kbGVcIjogXCJjb25uZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2V5XCI6IFwiQ2hlY2tSdW5zQWNjdW11bGF0b3JfY2hlY2tSdW5zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZmlsdGVyc1wiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYyLyo6IGFueSovKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkSGFuZGxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY2hlY2tTdWl0ZXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6ICh2NS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaGFuZGxlXCI6IFwiY29ubmVjdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtleVwiOiBcIkNoZWNrU3VpdGVBY2N1bXVsYXRvcl9jaGVja1N1aXRlc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImZpbHRlcnNcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHYzLyo6IGFueSovKVxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAgXCJwYXJhbXNcIjoge1xuICAgIFwib3BlcmF0aW9uS2luZFwiOiBcInF1ZXJ5XCIsXG4gICAgXCJuYW1lXCI6IFwicHJTdGF0dXNlc1ZpZXdSZWZldGNoUXVlcnlcIixcbiAgICBcImlkXCI6IG51bGwsXG4gICAgXCJ0ZXh0XCI6IFwicXVlcnkgcHJTdGF0dXNlc1ZpZXdSZWZldGNoUXVlcnkoXFxuICAkaWQ6IElEIVxcbiAgJGNoZWNrU3VpdGVDb3VudDogSW50IVxcbiAgJGNoZWNrU3VpdGVDdXJzb3I6IFN0cmluZ1xcbiAgJGNoZWNrUnVuQ291bnQ6IEludCFcXG4gICRjaGVja1J1bkN1cnNvcjogU3RyaW5nXFxuKSB7XFxuICBub2RlKGlkOiAkaWQpIHtcXG4gICAgX190eXBlbmFtZVxcbiAgICAuLi4gb24gUHVsbFJlcXVlc3Qge1xcbiAgICAgIC4uLnByU3RhdHVzZXNWaWV3X3B1bGxSZXF1ZXN0XzFvR1NOc1xcbiAgICB9XFxuICAgIGlkXFxuICB9XFxufVxcblxcbmZyYWdtZW50IGNoZWNrUnVuVmlld19jaGVja1J1biBvbiBDaGVja1J1biB7XFxuICBuYW1lXFxuICBzdGF0dXNcXG4gIGNvbmNsdXNpb25cXG4gIHRpdGxlXFxuICBzdW1tYXJ5XFxuICBwZXJtYWxpbmtcXG4gIGRldGFpbHNVcmxcXG59XFxuXFxuZnJhZ21lbnQgY2hlY2tSdW5zQWNjdW11bGF0b3JfY2hlY2tTdWl0ZV9SdmZyMSBvbiBDaGVja1N1aXRlIHtcXG4gIGlkXFxuICBjaGVja1J1bnMoZmlyc3Q6ICRjaGVja1J1bkNvdW50LCBhZnRlcjogJGNoZWNrUnVuQ3Vyc29yKSB7XFxuICAgIHBhZ2VJbmZvIHtcXG4gICAgICBoYXNOZXh0UGFnZVxcbiAgICAgIGVuZEN1cnNvclxcbiAgICB9XFxuICAgIGVkZ2VzIHtcXG4gICAgICBjdXJzb3JcXG4gICAgICBub2RlIHtcXG4gICAgICAgIGlkXFxuICAgICAgICBzdGF0dXNcXG4gICAgICAgIGNvbmNsdXNpb25cXG4gICAgICAgIC4uLmNoZWNrUnVuVmlld19jaGVja1J1blxcbiAgICAgICAgX190eXBlbmFtZVxcbiAgICAgIH1cXG4gICAgfVxcbiAgfVxcbn1cXG5cXG5mcmFnbWVudCBjaGVja1N1aXRlVmlld19jaGVja1N1aXRlIG9uIENoZWNrU3VpdGUge1xcbiAgYXBwIHtcXG4gICAgbmFtZVxcbiAgICBpZFxcbiAgfVxcbiAgc3RhdHVzXFxuICBjb25jbHVzaW9uXFxufVxcblxcbmZyYWdtZW50IGNoZWNrU3VpdGVzQWNjdW11bGF0b3JfY29tbWl0XzFvR1NOcyBvbiBDb21taXQge1xcbiAgaWRcXG4gIGNoZWNrU3VpdGVzKGZpcnN0OiAkY2hlY2tTdWl0ZUNvdW50LCBhZnRlcjogJGNoZWNrU3VpdGVDdXJzb3IpIHtcXG4gICAgcGFnZUluZm8ge1xcbiAgICAgIGhhc05leHRQYWdlXFxuICAgICAgZW5kQ3Vyc29yXFxuICAgIH1cXG4gICAgZWRnZXMge1xcbiAgICAgIGN1cnNvclxcbiAgICAgIG5vZGUge1xcbiAgICAgICAgaWRcXG4gICAgICAgIHN0YXR1c1xcbiAgICAgICAgY29uY2x1c2lvblxcbiAgICAgICAgLi4uY2hlY2tTdWl0ZVZpZXdfY2hlY2tTdWl0ZVxcbiAgICAgICAgLi4uY2hlY2tSdW5zQWNjdW11bGF0b3JfY2hlY2tTdWl0ZV9SdmZyMVxcbiAgICAgICAgX190eXBlbmFtZVxcbiAgICAgIH1cXG4gICAgfVxcbiAgfVxcbn1cXG5cXG5mcmFnbWVudCBwclN0YXR1c0NvbnRleHRWaWV3X2NvbnRleHQgb24gU3RhdHVzQ29udGV4dCB7XFxuICBjb250ZXh0XFxuICBkZXNjcmlwdGlvblxcbiAgc3RhdGVcXG4gIHRhcmdldFVybFxcbn1cXG5cXG5mcmFnbWVudCBwclN0YXR1c2VzVmlld19wdWxsUmVxdWVzdF8xb0dTTnMgb24gUHVsbFJlcXVlc3Qge1xcbiAgaWRcXG4gIHJlY2VudENvbW1pdHM6IGNvbW1pdHMobGFzdDogMSkge1xcbiAgICBlZGdlcyB7XFxuICAgICAgbm9kZSB7XFxuICAgICAgICBjb21taXQge1xcbiAgICAgICAgICBzdGF0dXMge1xcbiAgICAgICAgICAgIHN0YXRlXFxuICAgICAgICAgICAgY29udGV4dHMge1xcbiAgICAgICAgICAgICAgaWRcXG4gICAgICAgICAgICAgIHN0YXRlXFxuICAgICAgICAgICAgICAuLi5wclN0YXR1c0NvbnRleHRWaWV3X2NvbnRleHRcXG4gICAgICAgICAgICB9XFxuICAgICAgICAgICAgaWRcXG4gICAgICAgICAgfVxcbiAgICAgICAgICAuLi5jaGVja1N1aXRlc0FjY3VtdWxhdG9yX2NvbW1pdF8xb0dTTnNcXG4gICAgICAgICAgaWRcXG4gICAgICAgIH1cXG4gICAgICAgIGlkXFxuICAgICAgfVxcbiAgICB9XFxuICB9XFxufVxcblwiLFxuICAgIFwibWV0YWRhdGFcIjoge31cbiAgfVxufTtcbn0pKCk7XG4vLyBwcmV0dGllci1pZ25vcmVcbihub2RlLyo6IGFueSovKS5oYXNoID0gJzM0YzRjZmM2MWRmNjQxM2YzNGE1ZWZhNjE3NjhjZDQ4Jztcbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcbiJdfQ==