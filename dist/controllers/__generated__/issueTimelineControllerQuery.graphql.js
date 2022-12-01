/**
 * @flow
 * @relayHash 7bd37c78149a65bc2e28051101c02b84
 */

/* eslint-disable */
'use strict';
/*::
import type { ConcreteRequest } from 'relay-runtime';
type issueTimelineController_issue$ref = any;
export type issueTimelineControllerQueryVariables = {|
  timelineCount: number,
  timelineCursor?: ?string,
  url: any,
|};
export type issueTimelineControllerQueryResponse = {|
  +resource: ?{|
    +$fragmentRefs: issueTimelineController_issue$ref
  |}
|};
export type issueTimelineControllerQuery = {|
  variables: issueTimelineControllerQueryVariables,
  response: issueTimelineControllerQueryResponse,
|};
*/

/*
query issueTimelineControllerQuery(
  $timelineCount: Int!
  $timelineCursor: String
  $url: URI!
) {
  resource(url: $url) {
    __typename
    ... on Issue {
      ...issueTimelineController_issue_3D8CP9
    }
    ... on Node {
      id
    }
  }
}

fragment crossReferencedEventView_item on CrossReferencedEvent {
  id
  isCrossRepository
  source {
    __typename
    ... on Issue {
      number
      title
      url
      issueState: state
    }
    ... on PullRequest {
      number
      title
      url
      prState: state
    }
    ... on RepositoryNode {
      repository {
        name
        isPrivate
        owner {
          __typename
          login
          id
        }
        id
      }
    }
    ... on Node {
      id
    }
  }
}

fragment crossReferencedEventsView_nodes on CrossReferencedEvent {
  id
  referencedAt
  isCrossRepository
  actor {
    __typename
    login
    avatarUrl
    ... on Node {
      id
    }
  }
  source {
    __typename
    ... on RepositoryNode {
      repository {
        name
        owner {
          __typename
          login
          id
        }
        id
      }
    }
    ... on Node {
      id
    }
  }
  ...crossReferencedEventView_item
}

fragment issueCommentView_item on IssueComment {
  author {
    __typename
    avatarUrl
    login
    ... on Node {
      id
    }
  }
  bodyHTML
  createdAt
  url
}

fragment issueTimelineController_issue_3D8CP9 on Issue {
  url
  timelineItems(first: $timelineCount, after: $timelineCursor) {
    pageInfo {
      endCursor
      hasNextPage
    }
    edges {
      cursor
      node {
        __typename
        ...issueCommentView_item
        ...crossReferencedEventsView_nodes
        ... on Node {
          id
        }
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
    "name": "timelineCount",
    "type": "Int!",
    "defaultValue": null
  }, {
    "kind": "LocalArgument",
    "name": "timelineCursor",
    "type": "String",
    "defaultValue": null
  }, {
    "kind": "LocalArgument",
    "name": "url",
    "type": "URI!",
    "defaultValue": null
  }],
      v1 = [{
    "kind": "Variable",
    "name": "url",
    "variableName": "url"
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
    "name": "url",
    "args": null,
    "storageKey": null
  },
      v5 = [{
    "kind": "Variable",
    "name": "after",
    "variableName": "timelineCursor"
  }, {
    "kind": "Variable",
    "name": "first",
    "variableName": "timelineCount"
  }],
      v6 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "avatarUrl",
    "args": null,
    "storageKey": null
  },
      v7 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "login",
    "args": null,
    "storageKey": null
  },
      v8 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "number",
    "args": null,
    "storageKey": null
  },
      v9 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "title",
    "args": null,
    "storageKey": null
  };
  return {
    "kind": "Request",
    "fragment": {
      "kind": "Fragment",
      "name": "issueTimelineControllerQuery",
      "type": "Query",
      "metadata": null,
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "resource",
        "storageKey": null,
        "args": v1
        /*: any*/
        ,
        "concreteType": null,
        "plural": false,
        "selections": [{
          "kind": "InlineFragment",
          "type": "Issue",
          "selections": [{
            "kind": "FragmentSpread",
            "name": "issueTimelineController_issue",
            "args": [{
              "kind": "Variable",
              "name": "timelineCount",
              "variableName": "timelineCount"
            }, {
              "kind": "Variable",
              "name": "timelineCursor",
              "variableName": "timelineCursor"
            }]
          }]
        }]
      }]
    },
    "operation": {
      "kind": "Operation",
      "name": "issueTimelineControllerQuery",
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "resource",
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
          "type": "Issue",
          "selections": [v4
          /*: any*/
          , {
            "kind": "LinkedField",
            "alias": null,
            "name": "timelineItems",
            "storageKey": null,
            "args": v5
            /*: any*/
            ,
            "concreteType": "IssueTimelineItemsConnection",
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
                "name": "endCursor",
                "args": null,
                "storageKey": null
              }, {
                "kind": "ScalarField",
                "alias": null,
                "name": "hasNextPage",
                "args": null,
                "storageKey": null
              }]
            }, {
              "kind": "LinkedField",
              "alias": null,
              "name": "edges",
              "storageKey": null,
              "args": null,
              "concreteType": "IssueTimelineItemsEdge",
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
                "concreteType": null,
                "plural": false,
                "selections": [v2
                /*: any*/
                , v3
                /*: any*/
                , {
                  "kind": "InlineFragment",
                  "type": "IssueComment",
                  "selections": [{
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "author",
                    "storageKey": null,
                    "args": null,
                    "concreteType": null,
                    "plural": false,
                    "selections": [v2
                    /*: any*/
                    , v6
                    /*: any*/
                    , v7
                    /*: any*/
                    , v3
                    /*: any*/
                    ]
                  }, {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "bodyHTML",
                    "args": null,
                    "storageKey": null
                  }, {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "createdAt",
                    "args": null,
                    "storageKey": null
                  }, v4
                  /*: any*/
                  ]
                }, {
                  "kind": "InlineFragment",
                  "type": "CrossReferencedEvent",
                  "selections": [{
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "referencedAt",
                    "args": null,
                    "storageKey": null
                  }, {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "isCrossRepository",
                    "args": null,
                    "storageKey": null
                  }, {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "actor",
                    "storageKey": null,
                    "args": null,
                    "concreteType": null,
                    "plural": false,
                    "selections": [v2
                    /*: any*/
                    , v7
                    /*: any*/
                    , v6
                    /*: any*/
                    , v3
                    /*: any*/
                    ]
                  }, {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "source",
                    "storageKey": null,
                    "args": null,
                    "concreteType": null,
                    "plural": false,
                    "selections": [v2
                    /*: any*/
                    , {
                      "kind": "LinkedField",
                      "alias": null,
                      "name": "repository",
                      "storageKey": null,
                      "args": null,
                      "concreteType": "Repository",
                      "plural": false,
                      "selections": [{
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "name",
                        "args": null,
                        "storageKey": null
                      }, {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "owner",
                        "storageKey": null,
                        "args": null,
                        "concreteType": null,
                        "plural": false,
                        "selections": [v2
                        /*: any*/
                        , v7
                        /*: any*/
                        , v3
                        /*: any*/
                        ]
                      }, v3
                      /*: any*/
                      , {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "isPrivate",
                        "args": null,
                        "storageKey": null
                      }]
                    }, v3
                    /*: any*/
                    , {
                      "kind": "InlineFragment",
                      "type": "Issue",
                      "selections": [v8
                      /*: any*/
                      , v9
                      /*: any*/
                      , v4
                      /*: any*/
                      , {
                        "kind": "ScalarField",
                        "alias": "issueState",
                        "name": "state",
                        "args": null,
                        "storageKey": null
                      }]
                    }, {
                      "kind": "InlineFragment",
                      "type": "PullRequest",
                      "selections": [v8
                      /*: any*/
                      , v9
                      /*: any*/
                      , v4
                      /*: any*/
                      , {
                        "kind": "ScalarField",
                        "alias": "prState",
                        "name": "state",
                        "args": null,
                        "storageKey": null
                      }]
                    }]
                  }]
                }]
              }]
            }]
          }, {
            "kind": "LinkedHandle",
            "alias": null,
            "name": "timelineItems",
            "args": v5
            /*: any*/
            ,
            "handle": "connection",
            "key": "IssueTimelineController_timelineItems",
            "filters": null
          }]
        }]
      }]
    },
    "params": {
      "operationKind": "query",
      "name": "issueTimelineControllerQuery",
      "id": null,
      "text": "query issueTimelineControllerQuery(\n  $timelineCount: Int!\n  $timelineCursor: String\n  $url: URI!\n) {\n  resource(url: $url) {\n    __typename\n    ... on Issue {\n      ...issueTimelineController_issue_3D8CP9\n    }\n    ... on Node {\n      id\n    }\n  }\n}\n\nfragment crossReferencedEventView_item on CrossReferencedEvent {\n  id\n  isCrossRepository\n  source {\n    __typename\n    ... on Issue {\n      number\n      title\n      url\n      issueState: state\n    }\n    ... on PullRequest {\n      number\n      title\n      url\n      prState: state\n    }\n    ... on RepositoryNode {\n      repository {\n        name\n        isPrivate\n        owner {\n          __typename\n          login\n          id\n        }\n        id\n      }\n    }\n    ... on Node {\n      id\n    }\n  }\n}\n\nfragment crossReferencedEventsView_nodes on CrossReferencedEvent {\n  id\n  referencedAt\n  isCrossRepository\n  actor {\n    __typename\n    login\n    avatarUrl\n    ... on Node {\n      id\n    }\n  }\n  source {\n    __typename\n    ... on RepositoryNode {\n      repository {\n        name\n        owner {\n          __typename\n          login\n          id\n        }\n        id\n      }\n    }\n    ... on Node {\n      id\n    }\n  }\n  ...crossReferencedEventView_item\n}\n\nfragment issueCommentView_item on IssueComment {\n  author {\n    __typename\n    avatarUrl\n    login\n    ... on Node {\n      id\n    }\n  }\n  bodyHTML\n  createdAt\n  url\n}\n\nfragment issueTimelineController_issue_3D8CP9 on Issue {\n  url\n  timelineItems(first: $timelineCount, after: $timelineCursor) {\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n    edges {\n      cursor\n      node {\n        __typename\n        ...issueCommentView_item\n        ...crossReferencedEventsView_nodes\n        ... on Node {\n          id\n        }\n      }\n    }\n  }\n}\n",
      "metadata": {}
    }
  };
}(); // prettier-ignore


node
/*: any*/
.hash = '5a04d82da4187ed75fb5e133f79b4ab4';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9jb250cm9sbGVycy9fX2dlbmVyYXRlZF9fL2lzc3VlVGltZWxpbmVDb250cm9sbGVyUXVlcnkuZ3JhcGhxbC5qcyJdLCJuYW1lcyI6WyJub2RlIiwidjAiLCJ2MSIsInYyIiwidjMiLCJ2NCIsInY1IiwidjYiLCJ2NyIsInY4IiwidjkiLCJoYXNoIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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dkI7QUFDQUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCYixJQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZsb3dcbiAqIEByZWxheUhhc2ggN2JkMzdjNzgxNDlhNjViYzJlMjgwNTExMDFjMDJiODRcbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qOjpcbmltcG9ydCB0eXBlIHsgQ29uY3JldGVSZXF1ZXN0IH0gZnJvbSAncmVsYXktcnVudGltZSc7XG50eXBlIGlzc3VlVGltZWxpbmVDb250cm9sbGVyX2lzc3VlJHJlZiA9IGFueTtcbmV4cG9ydCB0eXBlIGlzc3VlVGltZWxpbmVDb250cm9sbGVyUXVlcnlWYXJpYWJsZXMgPSB7fFxuICB0aW1lbGluZUNvdW50OiBudW1iZXIsXG4gIHRpbWVsaW5lQ3Vyc29yPzogP3N0cmluZyxcbiAgdXJsOiBhbnksXG58fTtcbmV4cG9ydCB0eXBlIGlzc3VlVGltZWxpbmVDb250cm9sbGVyUXVlcnlSZXNwb25zZSA9IHt8XG4gICtyZXNvdXJjZTogP3t8XG4gICAgKyRmcmFnbWVudFJlZnM6IGlzc3VlVGltZWxpbmVDb250cm9sbGVyX2lzc3VlJHJlZlxuICB8fVxufH07XG5leHBvcnQgdHlwZSBpc3N1ZVRpbWVsaW5lQ29udHJvbGxlclF1ZXJ5ID0ge3xcbiAgdmFyaWFibGVzOiBpc3N1ZVRpbWVsaW5lQ29udHJvbGxlclF1ZXJ5VmFyaWFibGVzLFxuICByZXNwb25zZTogaXNzdWVUaW1lbGluZUNvbnRyb2xsZXJRdWVyeVJlc3BvbnNlLFxufH07XG4qL1xuXG5cbi8qXG5xdWVyeSBpc3N1ZVRpbWVsaW5lQ29udHJvbGxlclF1ZXJ5KFxuICAkdGltZWxpbmVDb3VudDogSW50IVxuICAkdGltZWxpbmVDdXJzb3I6IFN0cmluZ1xuICAkdXJsOiBVUkkhXG4pIHtcbiAgcmVzb3VyY2UodXJsOiAkdXJsKSB7XG4gICAgX190eXBlbmFtZVxuICAgIC4uLiBvbiBJc3N1ZSB7XG4gICAgICAuLi5pc3N1ZVRpbWVsaW5lQ29udHJvbGxlcl9pc3N1ZV8zRDhDUDlcbiAgICB9XG4gICAgLi4uIG9uIE5vZGUge1xuICAgICAgaWRcbiAgICB9XG4gIH1cbn1cblxuZnJhZ21lbnQgY3Jvc3NSZWZlcmVuY2VkRXZlbnRWaWV3X2l0ZW0gb24gQ3Jvc3NSZWZlcmVuY2VkRXZlbnQge1xuICBpZFxuICBpc0Nyb3NzUmVwb3NpdG9yeVxuICBzb3VyY2Uge1xuICAgIF9fdHlwZW5hbWVcbiAgICAuLi4gb24gSXNzdWUge1xuICAgICAgbnVtYmVyXG4gICAgICB0aXRsZVxuICAgICAgdXJsXG4gICAgICBpc3N1ZVN0YXRlOiBzdGF0ZVxuICAgIH1cbiAgICAuLi4gb24gUHVsbFJlcXVlc3Qge1xuICAgICAgbnVtYmVyXG4gICAgICB0aXRsZVxuICAgICAgdXJsXG4gICAgICBwclN0YXRlOiBzdGF0ZVxuICAgIH1cbiAgICAuLi4gb24gUmVwb3NpdG9yeU5vZGUge1xuICAgICAgcmVwb3NpdG9yeSB7XG4gICAgICAgIG5hbWVcbiAgICAgICAgaXNQcml2YXRlXG4gICAgICAgIG93bmVyIHtcbiAgICAgICAgICBfX3R5cGVuYW1lXG4gICAgICAgICAgbG9naW5cbiAgICAgICAgICBpZFxuICAgICAgICB9XG4gICAgICAgIGlkXG4gICAgICB9XG4gICAgfVxuICAgIC4uLiBvbiBOb2RlIHtcbiAgICAgIGlkXG4gICAgfVxuICB9XG59XG5cbmZyYWdtZW50IGNyb3NzUmVmZXJlbmNlZEV2ZW50c1ZpZXdfbm9kZXMgb24gQ3Jvc3NSZWZlcmVuY2VkRXZlbnQge1xuICBpZFxuICByZWZlcmVuY2VkQXRcbiAgaXNDcm9zc1JlcG9zaXRvcnlcbiAgYWN0b3Ige1xuICAgIF9fdHlwZW5hbWVcbiAgICBsb2dpblxuICAgIGF2YXRhclVybFxuICAgIC4uLiBvbiBOb2RlIHtcbiAgICAgIGlkXG4gICAgfVxuICB9XG4gIHNvdXJjZSB7XG4gICAgX190eXBlbmFtZVxuICAgIC4uLiBvbiBSZXBvc2l0b3J5Tm9kZSB7XG4gICAgICByZXBvc2l0b3J5IHtcbiAgICAgICAgbmFtZVxuICAgICAgICBvd25lciB7XG4gICAgICAgICAgX190eXBlbmFtZVxuICAgICAgICAgIGxvZ2luXG4gICAgICAgICAgaWRcbiAgICAgICAgfVxuICAgICAgICBpZFxuICAgICAgfVxuICAgIH1cbiAgICAuLi4gb24gTm9kZSB7XG4gICAgICBpZFxuICAgIH1cbiAgfVxuICAuLi5jcm9zc1JlZmVyZW5jZWRFdmVudFZpZXdfaXRlbVxufVxuXG5mcmFnbWVudCBpc3N1ZUNvbW1lbnRWaWV3X2l0ZW0gb24gSXNzdWVDb21tZW50IHtcbiAgYXV0aG9yIHtcbiAgICBfX3R5cGVuYW1lXG4gICAgYXZhdGFyVXJsXG4gICAgbG9naW5cbiAgICAuLi4gb24gTm9kZSB7XG4gICAgICBpZFxuICAgIH1cbiAgfVxuICBib2R5SFRNTFxuICBjcmVhdGVkQXRcbiAgdXJsXG59XG5cbmZyYWdtZW50IGlzc3VlVGltZWxpbmVDb250cm9sbGVyX2lzc3VlXzNEOENQOSBvbiBJc3N1ZSB7XG4gIHVybFxuICB0aW1lbGluZUl0ZW1zKGZpcnN0OiAkdGltZWxpbmVDb3VudCwgYWZ0ZXI6ICR0aW1lbGluZUN1cnNvcikge1xuICAgIHBhZ2VJbmZvIHtcbiAgICAgIGVuZEN1cnNvclxuICAgICAgaGFzTmV4dFBhZ2VcbiAgICB9XG4gICAgZWRnZXMge1xuICAgICAgY3Vyc29yXG4gICAgICBub2RlIHtcbiAgICAgICAgX190eXBlbmFtZVxuICAgICAgICAuLi5pc3N1ZUNvbW1lbnRWaWV3X2l0ZW1cbiAgICAgICAgLi4uY3Jvc3NSZWZlcmVuY2VkRXZlbnRzVmlld19ub2Rlc1xuICAgICAgICAuLi4gb24gTm9kZSB7XG4gICAgICAgICAgaWRcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuKi9cblxuY29uc3Qgbm9kZS8qOiBDb25jcmV0ZVJlcXVlc3QqLyA9IChmdW5jdGlvbigpe1xudmFyIHYwID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgIFwibmFtZVwiOiBcInRpbWVsaW5lQ291bnRcIixcbiAgICBcInR5cGVcIjogXCJJbnQhXCIsXG4gICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICB9LFxuICB7XG4gICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgIFwibmFtZVwiOiBcInRpbWVsaW5lQ3Vyc29yXCIsXG4gICAgXCJ0eXBlXCI6IFwiU3RyaW5nXCIsXG4gICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICB9LFxuICB7XG4gICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgIFwibmFtZVwiOiBcInVybFwiLFxuICAgIFwidHlwZVwiOiBcIlVSSSFcIixcbiAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gIH1cbl0sXG52MSA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgXCJuYW1lXCI6IFwidXJsXCIsXG4gICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJ1cmxcIlxuICB9XG5dLFxudjIgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiX190eXBlbmFtZVwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52MyA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJpZFwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52NCA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJ1cmxcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjUgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgIFwibmFtZVwiOiBcImFmdGVyXCIsXG4gICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJ0aW1lbGluZUN1cnNvclwiXG4gIH0sXG4gIHtcbiAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgIFwibmFtZVwiOiBcImZpcnN0XCIsXG4gICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJ0aW1lbGluZUNvdW50XCJcbiAgfVxuXSxcbnY2ID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcImF2YXRhclVybFwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52NyA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJsb2dpblwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52OCA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJudW1iZXJcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjkgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwidGl0bGVcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59O1xucmV0dXJuIHtcbiAgXCJraW5kXCI6IFwiUmVxdWVzdFwiLFxuICBcImZyYWdtZW50XCI6IHtcbiAgICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICAgIFwibmFtZVwiOiBcImlzc3VlVGltZWxpbmVDb250cm9sbGVyUXVlcnlcIixcbiAgICBcInR5cGVcIjogXCJRdWVyeVwiLFxuICAgIFwibWV0YWRhdGFcIjogbnVsbCxcbiAgICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogKHYwLyo6IGFueSovKSxcbiAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAge1xuICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgIFwibmFtZVwiOiBcInJlc291cmNlXCIsXG4gICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICBcImFyZ3NcIjogKHYxLyo6IGFueSovKSxcbiAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiSW5saW5lRnJhZ21lbnRcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIklzc3VlXCIsXG4gICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiRnJhZ21lbnRTcHJlYWRcIixcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJpc3N1ZVRpbWVsaW5lQ29udHJvbGxlcl9pc3N1ZVwiLFxuICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInRpbWVsaW5lQ291bnRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJ0aW1lbGluZUNvdW50XCJcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInRpbWVsaW5lQ3Vyc29yXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFyaWFibGVOYW1lXCI6IFwidGltZWxpbmVDdXJzb3JcIlxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAgXCJvcGVyYXRpb25cIjoge1xuICAgIFwia2luZFwiOiBcIk9wZXJhdGlvblwiLFxuICAgIFwibmFtZVwiOiBcImlzc3VlVGltZWxpbmVDb250cm9sbGVyUXVlcnlcIixcbiAgICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogKHYwLyo6IGFueSovKSxcbiAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAge1xuICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgIFwibmFtZVwiOiBcInJlc291cmNlXCIsXG4gICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICBcImFyZ3NcIjogKHYxLyo6IGFueSovKSxcbiAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgKHYyLyo6IGFueSovKSxcbiAgICAgICAgICAodjMvKjogYW55Ki8pLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIklubGluZUZyYWdtZW50XCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJJc3N1ZVwiLFxuICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgKHY0Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInRpbWVsaW5lSXRlbXNcIixcbiAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcImFyZ3NcIjogKHY1Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIklzc3VlVGltZWxpbmVJdGVtc0Nvbm5lY3Rpb25cIixcbiAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInBhZ2VJbmZvXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJQYWdlSW5mb1wiLFxuICAgICAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZW5kQ3Vyc29yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaGFzTmV4dFBhZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZWRnZXNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIklzc3VlVGltZWxpbmVJdGVtc0VkZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY3Vyc29yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibm9kZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh2Mi8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh2My8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJJbmxpbmVGcmFnbWVudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIklzc3VlQ29tbWVudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiYXV0aG9yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYyLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjYvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2Ny8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYzLyo6IGFueSovKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImJvZHlIVE1MXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjcmVhdGVkQXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY0Lyo6IGFueSovKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIklubGluZUZyYWdtZW50XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiQ3Jvc3NSZWZlcmVuY2VkRXZlbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInJlZmVyZW5jZWRBdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaXNDcm9zc1JlcG9zaXRvcnlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImFjdG9yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYyLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjcvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2Ni8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYzLyo6IGFueSovKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInNvdXJjZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2Mi8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInJlcG9zaXRvcnlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlJlcG9zaXRvcnlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwib3duZXJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjIvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY3Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2My8qOiBhbnkqLylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2My8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJpc1ByaXZhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjMvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIklubGluZUZyYWdtZW50XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJJc3N1ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY4Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY5Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY0Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBcImlzc3VlU3RhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJzdGF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIklubGluZUZyYWdtZW50XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJQdWxsUmVxdWVzdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY4Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY5Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY0Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBcInByU3RhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJzdGF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRIYW5kbGVcIixcbiAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwidGltZWxpbmVJdGVtc1wiLFxuICAgICAgICAgICAgICAgIFwiYXJnc1wiOiAodjUvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgIFwiaGFuZGxlXCI6IFwiY29ubmVjdGlvblwiLFxuICAgICAgICAgICAgICAgIFwia2V5XCI6IFwiSXNzdWVUaW1lbGluZUNvbnRyb2xsZXJfdGltZWxpbmVJdGVtc1wiLFxuICAgICAgICAgICAgICAgIFwiZmlsdGVyc1wiOiBudWxsXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIFwicGFyYW1zXCI6IHtcbiAgICBcIm9wZXJhdGlvbktpbmRcIjogXCJxdWVyeVwiLFxuICAgIFwibmFtZVwiOiBcImlzc3VlVGltZWxpbmVDb250cm9sbGVyUXVlcnlcIixcbiAgICBcImlkXCI6IG51bGwsXG4gICAgXCJ0ZXh0XCI6IFwicXVlcnkgaXNzdWVUaW1lbGluZUNvbnRyb2xsZXJRdWVyeShcXG4gICR0aW1lbGluZUNvdW50OiBJbnQhXFxuICAkdGltZWxpbmVDdXJzb3I6IFN0cmluZ1xcbiAgJHVybDogVVJJIVxcbikge1xcbiAgcmVzb3VyY2UodXJsOiAkdXJsKSB7XFxuICAgIF9fdHlwZW5hbWVcXG4gICAgLi4uIG9uIElzc3VlIHtcXG4gICAgICAuLi5pc3N1ZVRpbWVsaW5lQ29udHJvbGxlcl9pc3N1ZV8zRDhDUDlcXG4gICAgfVxcbiAgICAuLi4gb24gTm9kZSB7XFxuICAgICAgaWRcXG4gICAgfVxcbiAgfVxcbn1cXG5cXG5mcmFnbWVudCBjcm9zc1JlZmVyZW5jZWRFdmVudFZpZXdfaXRlbSBvbiBDcm9zc1JlZmVyZW5jZWRFdmVudCB7XFxuICBpZFxcbiAgaXNDcm9zc1JlcG9zaXRvcnlcXG4gIHNvdXJjZSB7XFxuICAgIF9fdHlwZW5hbWVcXG4gICAgLi4uIG9uIElzc3VlIHtcXG4gICAgICBudW1iZXJcXG4gICAgICB0aXRsZVxcbiAgICAgIHVybFxcbiAgICAgIGlzc3VlU3RhdGU6IHN0YXRlXFxuICAgIH1cXG4gICAgLi4uIG9uIFB1bGxSZXF1ZXN0IHtcXG4gICAgICBudW1iZXJcXG4gICAgICB0aXRsZVxcbiAgICAgIHVybFxcbiAgICAgIHByU3RhdGU6IHN0YXRlXFxuICAgIH1cXG4gICAgLi4uIG9uIFJlcG9zaXRvcnlOb2RlIHtcXG4gICAgICByZXBvc2l0b3J5IHtcXG4gICAgICAgIG5hbWVcXG4gICAgICAgIGlzUHJpdmF0ZVxcbiAgICAgICAgb3duZXIge1xcbiAgICAgICAgICBfX3R5cGVuYW1lXFxuICAgICAgICAgIGxvZ2luXFxuICAgICAgICAgIGlkXFxuICAgICAgICB9XFxuICAgICAgICBpZFxcbiAgICAgIH1cXG4gICAgfVxcbiAgICAuLi4gb24gTm9kZSB7XFxuICAgICAgaWRcXG4gICAgfVxcbiAgfVxcbn1cXG5cXG5mcmFnbWVudCBjcm9zc1JlZmVyZW5jZWRFdmVudHNWaWV3X25vZGVzIG9uIENyb3NzUmVmZXJlbmNlZEV2ZW50IHtcXG4gIGlkXFxuICByZWZlcmVuY2VkQXRcXG4gIGlzQ3Jvc3NSZXBvc2l0b3J5XFxuICBhY3RvciB7XFxuICAgIF9fdHlwZW5hbWVcXG4gICAgbG9naW5cXG4gICAgYXZhdGFyVXJsXFxuICAgIC4uLiBvbiBOb2RlIHtcXG4gICAgICBpZFxcbiAgICB9XFxuICB9XFxuICBzb3VyY2Uge1xcbiAgICBfX3R5cGVuYW1lXFxuICAgIC4uLiBvbiBSZXBvc2l0b3J5Tm9kZSB7XFxuICAgICAgcmVwb3NpdG9yeSB7XFxuICAgICAgICBuYW1lXFxuICAgICAgICBvd25lciB7XFxuICAgICAgICAgIF9fdHlwZW5hbWVcXG4gICAgICAgICAgbG9naW5cXG4gICAgICAgICAgaWRcXG4gICAgICAgIH1cXG4gICAgICAgIGlkXFxuICAgICAgfVxcbiAgICB9XFxuICAgIC4uLiBvbiBOb2RlIHtcXG4gICAgICBpZFxcbiAgICB9XFxuICB9XFxuICAuLi5jcm9zc1JlZmVyZW5jZWRFdmVudFZpZXdfaXRlbVxcbn1cXG5cXG5mcmFnbWVudCBpc3N1ZUNvbW1lbnRWaWV3X2l0ZW0gb24gSXNzdWVDb21tZW50IHtcXG4gIGF1dGhvciB7XFxuICAgIF9fdHlwZW5hbWVcXG4gICAgYXZhdGFyVXJsXFxuICAgIGxvZ2luXFxuICAgIC4uLiBvbiBOb2RlIHtcXG4gICAgICBpZFxcbiAgICB9XFxuICB9XFxuICBib2R5SFRNTFxcbiAgY3JlYXRlZEF0XFxuICB1cmxcXG59XFxuXFxuZnJhZ21lbnQgaXNzdWVUaW1lbGluZUNvbnRyb2xsZXJfaXNzdWVfM0Q4Q1A5IG9uIElzc3VlIHtcXG4gIHVybFxcbiAgdGltZWxpbmVJdGVtcyhmaXJzdDogJHRpbWVsaW5lQ291bnQsIGFmdGVyOiAkdGltZWxpbmVDdXJzb3IpIHtcXG4gICAgcGFnZUluZm8ge1xcbiAgICAgIGVuZEN1cnNvclxcbiAgICAgIGhhc05leHRQYWdlXFxuICAgIH1cXG4gICAgZWRnZXMge1xcbiAgICAgIGN1cnNvclxcbiAgICAgIG5vZGUge1xcbiAgICAgICAgX190eXBlbmFtZVxcbiAgICAgICAgLi4uaXNzdWVDb21tZW50Vmlld19pdGVtXFxuICAgICAgICAuLi5jcm9zc1JlZmVyZW5jZWRFdmVudHNWaWV3X25vZGVzXFxuICAgICAgICAuLi4gb24gTm9kZSB7XFxuICAgICAgICAgIGlkXFxuICAgICAgICB9XFxuICAgICAgfVxcbiAgICB9XFxuICB9XFxufVxcblwiLFxuICAgIFwibWV0YWRhdGFcIjoge31cbiAgfVxufTtcbn0pKCk7XG4vLyBwcmV0dGllci1pZ25vcmVcbihub2RlLyo6IGFueSovKS5oYXNoID0gJzVhMDRkODJkYTQxODdlZDc1ZmI1ZTEzM2Y3OWI0YWI0Jztcbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcbiJdfQ==