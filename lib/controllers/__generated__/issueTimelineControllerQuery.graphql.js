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
const node /*: ConcreteRequest*/ = function () {
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
      "argumentDefinitions": v0 /*: any*/,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "resource",
        "storageKey": null,
        "args": v1 /*: any*/,
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
      "argumentDefinitions": v0 /*: any*/,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "resource",
        "storageKey": null,
        "args": v1 /*: any*/,
        "concreteType": null,
        "plural": false,
        "selections": [v2 /*: any*/, v3 /*: any*/, {
          "kind": "InlineFragment",
          "type": "Issue",
          "selections": [v4 /*: any*/, {
            "kind": "LinkedField",
            "alias": null,
            "name": "timelineItems",
            "storageKey": null,
            "args": v5 /*: any*/,
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
                "selections": [v2 /*: any*/, v3 /*: any*/, {
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
                    "selections": [v2 /*: any*/, v6 /*: any*/, v7 /*: any*/, v3 /*: any*/]
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
                  }, v4 /*: any*/]
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
                    "selections": [v2 /*: any*/, v7 /*: any*/, v6 /*: any*/, v3 /*: any*/]
                  }, {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "source",
                    "storageKey": null,
                    "args": null,
                    "concreteType": null,
                    "plural": false,
                    "selections": [v2 /*: any*/, {
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
                        "selections": [v2 /*: any*/, v7 /*: any*/, v3 /*: any*/]
                      }, v3 /*: any*/, {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "isPrivate",
                        "args": null,
                        "storageKey": null
                      }]
                    }, v3 /*: any*/, {
                      "kind": "InlineFragment",
                      "type": "Issue",
                      "selections": [v8 /*: any*/, v9 /*: any*/, v4 /*: any*/, {
                        "kind": "ScalarField",
                        "alias": "issueState",
                        "name": "state",
                        "args": null,
                        "storageKey": null
                      }]
                    }, {
                      "kind": "InlineFragment",
                      "type": "PullRequest",
                      "selections": [v8 /*: any*/, v9 /*: any*/, v4 /*: any*/, {
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
            "args": v5 /*: any*/,
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
}();
// prettier-ignore
node /*: any*/.hash = '5a04d82da4187ed75fb5e133f79b4ab4';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJub2RlIiwidjAiLCJ2MSIsInYyIiwidjMiLCJ2NCIsInY1IiwidjYiLCJ2NyIsInY4IiwidjkiLCJoYXNoIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJzb3VyY2VzIjpbImlzc3VlVGltZWxpbmVDb250cm9sbGVyUXVlcnkuZ3JhcGhxbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmbG93XG4gKiBAcmVsYXlIYXNoIDdiZDM3Yzc4MTQ5YTY1YmMyZTI4MDUxMTAxYzAyYjg0XG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKjo6XG5pbXBvcnQgdHlwZSB7IENvbmNyZXRlUmVxdWVzdCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xudHlwZSBpc3N1ZVRpbWVsaW5lQ29udHJvbGxlcl9pc3N1ZSRyZWYgPSBhbnk7XG5leHBvcnQgdHlwZSBpc3N1ZVRpbWVsaW5lQ29udHJvbGxlclF1ZXJ5VmFyaWFibGVzID0ge3xcbiAgdGltZWxpbmVDb3VudDogbnVtYmVyLFxuICB0aW1lbGluZUN1cnNvcj86ID9zdHJpbmcsXG4gIHVybDogYW55LFxufH07XG5leHBvcnQgdHlwZSBpc3N1ZVRpbWVsaW5lQ29udHJvbGxlclF1ZXJ5UmVzcG9uc2UgPSB7fFxuICArcmVzb3VyY2U6ID97fFxuICAgICskZnJhZ21lbnRSZWZzOiBpc3N1ZVRpbWVsaW5lQ29udHJvbGxlcl9pc3N1ZSRyZWZcbiAgfH1cbnx9O1xuZXhwb3J0IHR5cGUgaXNzdWVUaW1lbGluZUNvbnRyb2xsZXJRdWVyeSA9IHt8XG4gIHZhcmlhYmxlczogaXNzdWVUaW1lbGluZUNvbnRyb2xsZXJRdWVyeVZhcmlhYmxlcyxcbiAgcmVzcG9uc2U6IGlzc3VlVGltZWxpbmVDb250cm9sbGVyUXVlcnlSZXNwb25zZSxcbnx9O1xuKi9cblxuXG4vKlxucXVlcnkgaXNzdWVUaW1lbGluZUNvbnRyb2xsZXJRdWVyeShcbiAgJHRpbWVsaW5lQ291bnQ6IEludCFcbiAgJHRpbWVsaW5lQ3Vyc29yOiBTdHJpbmdcbiAgJHVybDogVVJJIVxuKSB7XG4gIHJlc291cmNlKHVybDogJHVybCkge1xuICAgIF9fdHlwZW5hbWVcbiAgICAuLi4gb24gSXNzdWUge1xuICAgICAgLi4uaXNzdWVUaW1lbGluZUNvbnRyb2xsZXJfaXNzdWVfM0Q4Q1A5XG4gICAgfVxuICAgIC4uLiBvbiBOb2RlIHtcbiAgICAgIGlkXG4gICAgfVxuICB9XG59XG5cbmZyYWdtZW50IGNyb3NzUmVmZXJlbmNlZEV2ZW50Vmlld19pdGVtIG9uIENyb3NzUmVmZXJlbmNlZEV2ZW50IHtcbiAgaWRcbiAgaXNDcm9zc1JlcG9zaXRvcnlcbiAgc291cmNlIHtcbiAgICBfX3R5cGVuYW1lXG4gICAgLi4uIG9uIElzc3VlIHtcbiAgICAgIG51bWJlclxuICAgICAgdGl0bGVcbiAgICAgIHVybFxuICAgICAgaXNzdWVTdGF0ZTogc3RhdGVcbiAgICB9XG4gICAgLi4uIG9uIFB1bGxSZXF1ZXN0IHtcbiAgICAgIG51bWJlclxuICAgICAgdGl0bGVcbiAgICAgIHVybFxuICAgICAgcHJTdGF0ZTogc3RhdGVcbiAgICB9XG4gICAgLi4uIG9uIFJlcG9zaXRvcnlOb2RlIHtcbiAgICAgIHJlcG9zaXRvcnkge1xuICAgICAgICBuYW1lXG4gICAgICAgIGlzUHJpdmF0ZVxuICAgICAgICBvd25lciB7XG4gICAgICAgICAgX190eXBlbmFtZVxuICAgICAgICAgIGxvZ2luXG4gICAgICAgICAgaWRcbiAgICAgICAgfVxuICAgICAgICBpZFxuICAgICAgfVxuICAgIH1cbiAgICAuLi4gb24gTm9kZSB7XG4gICAgICBpZFxuICAgIH1cbiAgfVxufVxuXG5mcmFnbWVudCBjcm9zc1JlZmVyZW5jZWRFdmVudHNWaWV3X25vZGVzIG9uIENyb3NzUmVmZXJlbmNlZEV2ZW50IHtcbiAgaWRcbiAgcmVmZXJlbmNlZEF0XG4gIGlzQ3Jvc3NSZXBvc2l0b3J5XG4gIGFjdG9yIHtcbiAgICBfX3R5cGVuYW1lXG4gICAgbG9naW5cbiAgICBhdmF0YXJVcmxcbiAgICAuLi4gb24gTm9kZSB7XG4gICAgICBpZFxuICAgIH1cbiAgfVxuICBzb3VyY2Uge1xuICAgIF9fdHlwZW5hbWVcbiAgICAuLi4gb24gUmVwb3NpdG9yeU5vZGUge1xuICAgICAgcmVwb3NpdG9yeSB7XG4gICAgICAgIG5hbWVcbiAgICAgICAgb3duZXIge1xuICAgICAgICAgIF9fdHlwZW5hbWVcbiAgICAgICAgICBsb2dpblxuICAgICAgICAgIGlkXG4gICAgICAgIH1cbiAgICAgICAgaWRcbiAgICAgIH1cbiAgICB9XG4gICAgLi4uIG9uIE5vZGUge1xuICAgICAgaWRcbiAgICB9XG4gIH1cbiAgLi4uY3Jvc3NSZWZlcmVuY2VkRXZlbnRWaWV3X2l0ZW1cbn1cblxuZnJhZ21lbnQgaXNzdWVDb21tZW50Vmlld19pdGVtIG9uIElzc3VlQ29tbWVudCB7XG4gIGF1dGhvciB7XG4gICAgX190eXBlbmFtZVxuICAgIGF2YXRhclVybFxuICAgIGxvZ2luXG4gICAgLi4uIG9uIE5vZGUge1xuICAgICAgaWRcbiAgICB9XG4gIH1cbiAgYm9keUhUTUxcbiAgY3JlYXRlZEF0XG4gIHVybFxufVxuXG5mcmFnbWVudCBpc3N1ZVRpbWVsaW5lQ29udHJvbGxlcl9pc3N1ZV8zRDhDUDkgb24gSXNzdWUge1xuICB1cmxcbiAgdGltZWxpbmVJdGVtcyhmaXJzdDogJHRpbWVsaW5lQ291bnQsIGFmdGVyOiAkdGltZWxpbmVDdXJzb3IpIHtcbiAgICBwYWdlSW5mbyB7XG4gICAgICBlbmRDdXJzb3JcbiAgICAgIGhhc05leHRQYWdlXG4gICAgfVxuICAgIGVkZ2VzIHtcbiAgICAgIGN1cnNvclxuICAgICAgbm9kZSB7XG4gICAgICAgIF9fdHlwZW5hbWVcbiAgICAgICAgLi4uaXNzdWVDb21tZW50Vmlld19pdGVtXG4gICAgICAgIC4uLmNyb3NzUmVmZXJlbmNlZEV2ZW50c1ZpZXdfbm9kZXNcbiAgICAgICAgLi4uIG9uIE5vZGUge1xuICAgICAgICAgIGlkXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiovXG5cbmNvbnN0IG5vZGUvKjogQ29uY3JldGVSZXF1ZXN0Ki8gPSAoZnVuY3Rpb24oKXtcbnZhciB2MCA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICBcIm5hbWVcIjogXCJ0aW1lbGluZUNvdW50XCIsXG4gICAgXCJ0eXBlXCI6IFwiSW50IVwiLFxuICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgfSxcbiAge1xuICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICBcIm5hbWVcIjogXCJ0aW1lbGluZUN1cnNvclwiLFxuICAgIFwidHlwZVwiOiBcIlN0cmluZ1wiLFxuICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgfSxcbiAge1xuICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICBcIm5hbWVcIjogXCJ1cmxcIixcbiAgICBcInR5cGVcIjogXCJVUkkhXCIsXG4gICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICB9XG5dLFxudjEgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgIFwibmFtZVwiOiBcInVybFwiLFxuICAgIFwidmFyaWFibGVOYW1lXCI6IFwidXJsXCJcbiAgfVxuXSxcbnYyID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcIl9fdHlwZW5hbWVcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjMgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiaWRcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjQgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwidXJsXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnY1ID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICBcIm5hbWVcIjogXCJhZnRlclwiLFxuICAgIFwidmFyaWFibGVOYW1lXCI6IFwidGltZWxpbmVDdXJzb3JcIlxuICB9LFxuICB7XG4gICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICBcIm5hbWVcIjogXCJmaXJzdFwiLFxuICAgIFwidmFyaWFibGVOYW1lXCI6IFwidGltZWxpbmVDb3VudFwiXG4gIH1cbl0sXG52NiA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJhdmF0YXJVcmxcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjcgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwibG9naW5cIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjggPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwibnVtYmVyXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnY5ID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcInRpdGxlXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufTtcbnJldHVybiB7XG4gIFwia2luZFwiOiBcIlJlcXVlc3RcIixcbiAgXCJmcmFnbWVudFwiOiB7XG4gICAgXCJraW5kXCI6IFwiRnJhZ21lbnRcIixcbiAgICBcIm5hbWVcIjogXCJpc3N1ZVRpbWVsaW5lQ29udHJvbGxlclF1ZXJ5XCIsXG4gICAgXCJ0eXBlXCI6IFwiUXVlcnlcIixcbiAgICBcIm1ldGFkYXRhXCI6IG51bGwsXG4gICAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6ICh2MC8qOiBhbnkqLyksXG4gICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICBcIm5hbWVcIjogXCJyZXNvdXJjZVwiLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgXCJhcmdzXCI6ICh2MS8qOiBhbnkqLyksXG4gICAgICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIklubGluZUZyYWdtZW50XCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJJc3N1ZVwiLFxuICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkZyYWdtZW50U3ByZWFkXCIsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaXNzdWVUaW1lbGluZUNvbnRyb2xsZXJfaXNzdWVcIixcbiAgICAgICAgICAgICAgICBcImFyZ3NcIjogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ0aW1lbGluZUNvdW50XCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFyaWFibGVOYW1lXCI6IFwidGltZWxpbmVDb3VudFwiXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ0aW1lbGluZUN1cnNvclwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhcmlhYmxlTmFtZVwiOiBcInRpbWVsaW5lQ3Vyc29yXCJcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIFwib3BlcmF0aW9uXCI6IHtcbiAgICBcImtpbmRcIjogXCJPcGVyYXRpb25cIixcbiAgICBcIm5hbWVcIjogXCJpc3N1ZVRpbWVsaW5lQ29udHJvbGxlclF1ZXJ5XCIsXG4gICAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6ICh2MC8qOiBhbnkqLyksXG4gICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICBcIm5hbWVcIjogXCJyZXNvdXJjZVwiLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgXCJhcmdzXCI6ICh2MS8qOiBhbnkqLyksXG4gICAgICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICh2Mi8qOiBhbnkqLyksXG4gICAgICAgICAgKHYzLyo6IGFueSovKSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJJbmxpbmVGcmFnbWVudFwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiSXNzdWVcIixcbiAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICh2NC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ0aW1lbGluZUl0ZW1zXCIsXG4gICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJhcmdzXCI6ICh2NS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJJc3N1ZVRpbWVsaW5lSXRlbXNDb25uZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJwYWdlSW5mb1wiLFxuICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUGFnZUluZm9cIixcbiAgICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImVuZEN1cnNvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImhhc05leHRQYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImVkZ2VzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJJc3N1ZVRpbWVsaW5lSXRlbXNFZGdlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImN1cnNvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm5vZGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAodjIvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAodjMvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiSW5saW5lRnJhZ21lbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJJc3N1ZUNvbW1lbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImF1dGhvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2Mi8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY2Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjcvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2My8qOiBhbnkqLylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJib2R5SFRNTFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY3JlYXRlZEF0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2NC8qOiBhbnkqLylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJJbmxpbmVGcmFnbWVudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIkNyb3NzUmVmZXJlbmNlZEV2ZW50XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJyZWZlcmVuY2VkQXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImlzQ3Jvc3NSZXBvc2l0b3J5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJhY3RvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2Mi8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY3Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjYvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2My8qOiBhbnkqLylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJzb3VyY2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjIvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJyZXBvc2l0b3J5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJSZXBvc2l0b3J5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJuYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm93bmVyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYyLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2Ny8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjMvKjogYW55Ki8pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjMvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaXNQcml2YXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYzLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJJbmxpbmVGcmFnbWVudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiSXNzdWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2OC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2OS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2NC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogXCJpc3N1ZVN0YXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwic3RhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJJbmxpbmVGcmFnbWVudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiUHVsbFJlcXVlc3RcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2OC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2OS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2NC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogXCJwclN0YXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwic3RhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkSGFuZGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInRpbWVsaW5lSXRlbXNcIixcbiAgICAgICAgICAgICAgICBcImFyZ3NcIjogKHY1Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICBcImhhbmRsZVwiOiBcImNvbm5lY3Rpb25cIixcbiAgICAgICAgICAgICAgICBcImtleVwiOiBcIklzc3VlVGltZWxpbmVDb250cm9sbGVyX3RpbWVsaW5lSXRlbXNcIixcbiAgICAgICAgICAgICAgICBcImZpbHRlcnNcIjogbnVsbFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9LFxuICBcInBhcmFtc1wiOiB7XG4gICAgXCJvcGVyYXRpb25LaW5kXCI6IFwicXVlcnlcIixcbiAgICBcIm5hbWVcIjogXCJpc3N1ZVRpbWVsaW5lQ29udHJvbGxlclF1ZXJ5XCIsXG4gICAgXCJpZFwiOiBudWxsLFxuICAgIFwidGV4dFwiOiBcInF1ZXJ5IGlzc3VlVGltZWxpbmVDb250cm9sbGVyUXVlcnkoXFxuICAkdGltZWxpbmVDb3VudDogSW50IVxcbiAgJHRpbWVsaW5lQ3Vyc29yOiBTdHJpbmdcXG4gICR1cmw6IFVSSSFcXG4pIHtcXG4gIHJlc291cmNlKHVybDogJHVybCkge1xcbiAgICBfX3R5cGVuYW1lXFxuICAgIC4uLiBvbiBJc3N1ZSB7XFxuICAgICAgLi4uaXNzdWVUaW1lbGluZUNvbnRyb2xsZXJfaXNzdWVfM0Q4Q1A5XFxuICAgIH1cXG4gICAgLi4uIG9uIE5vZGUge1xcbiAgICAgIGlkXFxuICAgIH1cXG4gIH1cXG59XFxuXFxuZnJhZ21lbnQgY3Jvc3NSZWZlcmVuY2VkRXZlbnRWaWV3X2l0ZW0gb24gQ3Jvc3NSZWZlcmVuY2VkRXZlbnQge1xcbiAgaWRcXG4gIGlzQ3Jvc3NSZXBvc2l0b3J5XFxuICBzb3VyY2Uge1xcbiAgICBfX3R5cGVuYW1lXFxuICAgIC4uLiBvbiBJc3N1ZSB7XFxuICAgICAgbnVtYmVyXFxuICAgICAgdGl0bGVcXG4gICAgICB1cmxcXG4gICAgICBpc3N1ZVN0YXRlOiBzdGF0ZVxcbiAgICB9XFxuICAgIC4uLiBvbiBQdWxsUmVxdWVzdCB7XFxuICAgICAgbnVtYmVyXFxuICAgICAgdGl0bGVcXG4gICAgICB1cmxcXG4gICAgICBwclN0YXRlOiBzdGF0ZVxcbiAgICB9XFxuICAgIC4uLiBvbiBSZXBvc2l0b3J5Tm9kZSB7XFxuICAgICAgcmVwb3NpdG9yeSB7XFxuICAgICAgICBuYW1lXFxuICAgICAgICBpc1ByaXZhdGVcXG4gICAgICAgIG93bmVyIHtcXG4gICAgICAgICAgX190eXBlbmFtZVxcbiAgICAgICAgICBsb2dpblxcbiAgICAgICAgICBpZFxcbiAgICAgICAgfVxcbiAgICAgICAgaWRcXG4gICAgICB9XFxuICAgIH1cXG4gICAgLi4uIG9uIE5vZGUge1xcbiAgICAgIGlkXFxuICAgIH1cXG4gIH1cXG59XFxuXFxuZnJhZ21lbnQgY3Jvc3NSZWZlcmVuY2VkRXZlbnRzVmlld19ub2RlcyBvbiBDcm9zc1JlZmVyZW5jZWRFdmVudCB7XFxuICBpZFxcbiAgcmVmZXJlbmNlZEF0XFxuICBpc0Nyb3NzUmVwb3NpdG9yeVxcbiAgYWN0b3Ige1xcbiAgICBfX3R5cGVuYW1lXFxuICAgIGxvZ2luXFxuICAgIGF2YXRhclVybFxcbiAgICAuLi4gb24gTm9kZSB7XFxuICAgICAgaWRcXG4gICAgfVxcbiAgfVxcbiAgc291cmNlIHtcXG4gICAgX190eXBlbmFtZVxcbiAgICAuLi4gb24gUmVwb3NpdG9yeU5vZGUge1xcbiAgICAgIHJlcG9zaXRvcnkge1xcbiAgICAgICAgbmFtZVxcbiAgICAgICAgb3duZXIge1xcbiAgICAgICAgICBfX3R5cGVuYW1lXFxuICAgICAgICAgIGxvZ2luXFxuICAgICAgICAgIGlkXFxuICAgICAgICB9XFxuICAgICAgICBpZFxcbiAgICAgIH1cXG4gICAgfVxcbiAgICAuLi4gb24gTm9kZSB7XFxuICAgICAgaWRcXG4gICAgfVxcbiAgfVxcbiAgLi4uY3Jvc3NSZWZlcmVuY2VkRXZlbnRWaWV3X2l0ZW1cXG59XFxuXFxuZnJhZ21lbnQgaXNzdWVDb21tZW50Vmlld19pdGVtIG9uIElzc3VlQ29tbWVudCB7XFxuICBhdXRob3Ige1xcbiAgICBfX3R5cGVuYW1lXFxuICAgIGF2YXRhclVybFxcbiAgICBsb2dpblxcbiAgICAuLi4gb24gTm9kZSB7XFxuICAgICAgaWRcXG4gICAgfVxcbiAgfVxcbiAgYm9keUhUTUxcXG4gIGNyZWF0ZWRBdFxcbiAgdXJsXFxufVxcblxcbmZyYWdtZW50IGlzc3VlVGltZWxpbmVDb250cm9sbGVyX2lzc3VlXzNEOENQOSBvbiBJc3N1ZSB7XFxuICB1cmxcXG4gIHRpbWVsaW5lSXRlbXMoZmlyc3Q6ICR0aW1lbGluZUNvdW50LCBhZnRlcjogJHRpbWVsaW5lQ3Vyc29yKSB7XFxuICAgIHBhZ2VJbmZvIHtcXG4gICAgICBlbmRDdXJzb3JcXG4gICAgICBoYXNOZXh0UGFnZVxcbiAgICB9XFxuICAgIGVkZ2VzIHtcXG4gICAgICBjdXJzb3JcXG4gICAgICBub2RlIHtcXG4gICAgICAgIF9fdHlwZW5hbWVcXG4gICAgICAgIC4uLmlzc3VlQ29tbWVudFZpZXdfaXRlbVxcbiAgICAgICAgLi4uY3Jvc3NSZWZlcmVuY2VkRXZlbnRzVmlld19ub2Rlc1xcbiAgICAgICAgLi4uIG9uIE5vZGUge1xcbiAgICAgICAgICBpZFxcbiAgICAgICAgfVxcbiAgICAgIH1cXG4gICAgfVxcbiAgfVxcbn1cXG5cIixcbiAgICBcIm1ldGFkYXRhXCI6IHt9XG4gIH1cbn07XG59KSgpO1xuLy8gcHJldHRpZXItaWdub3JlXG4obm9kZS8qOiBhbnkqLykuaGFzaCA9ICc1YTA0ZDgyZGE0MTg3ZWQ3NWZiNWUxMzNmNzliNGFiNCc7XG5tb2R1bGUuZXhwb3J0cyA9IG5vZGU7XG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLFlBQVk7O0FBRVo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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