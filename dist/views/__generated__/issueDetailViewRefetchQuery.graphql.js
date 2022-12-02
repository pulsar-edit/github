/**
 * @flow
 * @relayHash 30fb0866995510475e94c3079069bf0e
 */

/* eslint-disable */
'use strict';
/*::
import type { ConcreteRequest } from 'relay-runtime';
type issueDetailView_issue$ref = any;
type issueDetailView_repository$ref = any;
export type issueDetailViewRefetchQueryVariables = {|
  repoId: string,
  issueishId: string,
  timelineCount: number,
  timelineCursor?: ?string,
|};
export type issueDetailViewRefetchQueryResponse = {|
  +repository: ?{|
    +$fragmentRefs: issueDetailView_repository$ref
  |},
  +issue: ?{|
    +$fragmentRefs: issueDetailView_issue$ref
  |},
|};
export type issueDetailViewRefetchQuery = {|
  variables: issueDetailViewRefetchQueryVariables,
  response: issueDetailViewRefetchQueryResponse,
|};
*/

/*
query issueDetailViewRefetchQuery(
  $repoId: ID!
  $issueishId: ID!
  $timelineCount: Int!
  $timelineCursor: String
) {
  repository: node(id: $repoId) {
    __typename
    ...issueDetailView_repository
    id
  }
  issue: node(id: $issueishId) {
    __typename
    ...issueDetailView_issue_3D8CP9
    id
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

fragment emojiReactionsView_reactable on Reactable {
  id
  reactionGroups {
    content
    viewerHasReacted
    users {
      totalCount
    }
  }
  viewerCanReact
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

fragment issueDetailView_issue_3D8CP9 on Issue {
  id
  __typename
  url
  state
  number
  title
  bodyHTML
  author {
    __typename
    login
    avatarUrl
    url
    ... on Node {
      id
    }
  }
  ...issueTimelineController_issue_3D8CP9
  ...emojiReactionsView_reactable
}

fragment issueDetailView_repository on Repository {
  id
  name
  owner {
    __typename
    login
    id
  }
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
    "name": "repoId",
    "type": "ID!",
    "defaultValue": null
  }, {
    "kind": "LocalArgument",
    "name": "issueishId",
    "type": "ID!",
    "defaultValue": null
  }, {
    "kind": "LocalArgument",
    "name": "timelineCount",
    "type": "Int!",
    "defaultValue": null
  }, {
    "kind": "LocalArgument",
    "name": "timelineCursor",
    "type": "String",
    "defaultValue": null
  }],
      v1 = [{
    "kind": "Variable",
    "name": "id",
    "variableName": "repoId"
  }],
      v2 = [{
    "kind": "Variable",
    "name": "id",
    "variableName": "issueishId"
  }],
      v3 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "__typename",
    "args": null,
    "storageKey": null
  },
      v4 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "id",
    "args": null,
    "storageKey": null
  },
      v5 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "name",
    "args": null,
    "storageKey": null
  },
      v6 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "login",
    "args": null,
    "storageKey": null
  },
      v7 = {
    "kind": "LinkedField",
    "alias": null,
    "name": "owner",
    "storageKey": null,
    "args": null,
    "concreteType": null,
    "plural": false,
    "selections": [v3
    /*: any*/
    , v6
    /*: any*/
    , v4
    /*: any*/
    ]
  },
      v8 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "url",
    "args": null,
    "storageKey": null
  },
      v9 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "number",
    "args": null,
    "storageKey": null
  },
      v10 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "title",
    "args": null,
    "storageKey": null
  },
      v11 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "bodyHTML",
    "args": null,
    "storageKey": null
  },
      v12 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "avatarUrl",
    "args": null,
    "storageKey": null
  },
      v13 = [{
    "kind": "Variable",
    "name": "after",
    "variableName": "timelineCursor"
  }, {
    "kind": "Variable",
    "name": "first",
    "variableName": "timelineCount"
  }];
  return {
    "kind": "Request",
    "fragment": {
      "kind": "Fragment",
      "name": "issueDetailViewRefetchQuery",
      "type": "Query",
      "metadata": null,
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": [{
        "kind": "LinkedField",
        "alias": "repository",
        "name": "node",
        "storageKey": null,
        "args": v1
        /*: any*/
        ,
        "concreteType": null,
        "plural": false,
        "selections": [{
          "kind": "FragmentSpread",
          "name": "issueDetailView_repository",
          "args": null
        }]
      }, {
        "kind": "LinkedField",
        "alias": "issue",
        "name": "node",
        "storageKey": null,
        "args": v2
        /*: any*/
        ,
        "concreteType": null,
        "plural": false,
        "selections": [{
          "kind": "FragmentSpread",
          "name": "issueDetailView_issue",
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
    },
    "operation": {
      "kind": "Operation",
      "name": "issueDetailViewRefetchQuery",
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": [{
        "kind": "LinkedField",
        "alias": "repository",
        "name": "node",
        "storageKey": null,
        "args": v1
        /*: any*/
        ,
        "concreteType": null,
        "plural": false,
        "selections": [v3
        /*: any*/
        , v4
        /*: any*/
        , {
          "kind": "InlineFragment",
          "type": "Repository",
          "selections": [v5
          /*: any*/
          , v7
          /*: any*/
          ]
        }]
      }, {
        "kind": "LinkedField",
        "alias": "issue",
        "name": "node",
        "storageKey": null,
        "args": v2
        /*: any*/
        ,
        "concreteType": null,
        "plural": false,
        "selections": [v3
        /*: any*/
        , v4
        /*: any*/
        , {
          "kind": "InlineFragment",
          "type": "Issue",
          "selections": [v3
          /*: any*/
          , v8
          /*: any*/
          , {
            "kind": "ScalarField",
            "alias": null,
            "name": "state",
            "args": null,
            "storageKey": null
          }, v9
          /*: any*/
          , v10
          /*: any*/
          , v11
          /*: any*/
          , {
            "kind": "LinkedField",
            "alias": null,
            "name": "author",
            "storageKey": null,
            "args": null,
            "concreteType": null,
            "plural": false,
            "selections": [v3
            /*: any*/
            , v6
            /*: any*/
            , v12
            /*: any*/
            , v8
            /*: any*/
            , v4
            /*: any*/
            ]
          }, {
            "kind": "LinkedField",
            "alias": null,
            "name": "timelineItems",
            "storageKey": null,
            "args": v13
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
                "selections": [v3
                /*: any*/
                , v4
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
                    "selections": [v3
                    /*: any*/
                    , v12
                    /*: any*/
                    , v6
                    /*: any*/
                    , v4
                    /*: any*/
                    ]
                  }, v11
                  /*: any*/
                  , {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "createdAt",
                    "args": null,
                    "storageKey": null
                  }, v8
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
                    "selections": [v3
                    /*: any*/
                    , v6
                    /*: any*/
                    , v12
                    /*: any*/
                    , v4
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
                    "selections": [v3
                    /*: any*/
                    , {
                      "kind": "LinkedField",
                      "alias": null,
                      "name": "repository",
                      "storageKey": null,
                      "args": null,
                      "concreteType": "Repository",
                      "plural": false,
                      "selections": [v5
                      /*: any*/
                      , v7
                      /*: any*/
                      , v4
                      /*: any*/
                      , {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "isPrivate",
                        "args": null,
                        "storageKey": null
                      }]
                    }, v4
                    /*: any*/
                    , {
                      "kind": "InlineFragment",
                      "type": "Issue",
                      "selections": [v9
                      /*: any*/
                      , v10
                      /*: any*/
                      , v8
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
                      "selections": [v9
                      /*: any*/
                      , v10
                      /*: any*/
                      , v8
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
            "args": v13
            /*: any*/
            ,
            "handle": "connection",
            "key": "IssueTimelineController_timelineItems",
            "filters": null
          }, {
            "kind": "LinkedField",
            "alias": null,
            "name": "reactionGroups",
            "storageKey": null,
            "args": null,
            "concreteType": "ReactionGroup",
            "plural": true,
            "selections": [{
              "kind": "ScalarField",
              "alias": null,
              "name": "content",
              "args": null,
              "storageKey": null
            }, {
              "kind": "ScalarField",
              "alias": null,
              "name": "viewerHasReacted",
              "args": null,
              "storageKey": null
            }, {
              "kind": "LinkedField",
              "alias": null,
              "name": "users",
              "storageKey": null,
              "args": null,
              "concreteType": "ReactingUserConnection",
              "plural": false,
              "selections": [{
                "kind": "ScalarField",
                "alias": null,
                "name": "totalCount",
                "args": null,
                "storageKey": null
              }]
            }]
          }, {
            "kind": "ScalarField",
            "alias": null,
            "name": "viewerCanReact",
            "args": null,
            "storageKey": null
          }]
        }]
      }]
    },
    "params": {
      "operationKind": "query",
      "name": "issueDetailViewRefetchQuery",
      "id": null,
      "text": "query issueDetailViewRefetchQuery(\n  $repoId: ID!\n  $issueishId: ID!\n  $timelineCount: Int!\n  $timelineCursor: String\n) {\n  repository: node(id: $repoId) {\n    __typename\n    ...issueDetailView_repository\n    id\n  }\n  issue: node(id: $issueishId) {\n    __typename\n    ...issueDetailView_issue_3D8CP9\n    id\n  }\n}\n\nfragment crossReferencedEventView_item on CrossReferencedEvent {\n  id\n  isCrossRepository\n  source {\n    __typename\n    ... on Issue {\n      number\n      title\n      url\n      issueState: state\n    }\n    ... on PullRequest {\n      number\n      title\n      url\n      prState: state\n    }\n    ... on RepositoryNode {\n      repository {\n        name\n        isPrivate\n        owner {\n          __typename\n          login\n          id\n        }\n        id\n      }\n    }\n    ... on Node {\n      id\n    }\n  }\n}\n\nfragment crossReferencedEventsView_nodes on CrossReferencedEvent {\n  id\n  referencedAt\n  isCrossRepository\n  actor {\n    __typename\n    login\n    avatarUrl\n    ... on Node {\n      id\n    }\n  }\n  source {\n    __typename\n    ... on RepositoryNode {\n      repository {\n        name\n        owner {\n          __typename\n          login\n          id\n        }\n        id\n      }\n    }\n    ... on Node {\n      id\n    }\n  }\n  ...crossReferencedEventView_item\n}\n\nfragment emojiReactionsView_reactable on Reactable {\n  id\n  reactionGroups {\n    content\n    viewerHasReacted\n    users {\n      totalCount\n    }\n  }\n  viewerCanReact\n}\n\nfragment issueCommentView_item on IssueComment {\n  author {\n    __typename\n    avatarUrl\n    login\n    ... on Node {\n      id\n    }\n  }\n  bodyHTML\n  createdAt\n  url\n}\n\nfragment issueDetailView_issue_3D8CP9 on Issue {\n  id\n  __typename\n  url\n  state\n  number\n  title\n  bodyHTML\n  author {\n    __typename\n    login\n    avatarUrl\n    url\n    ... on Node {\n      id\n    }\n  }\n  ...issueTimelineController_issue_3D8CP9\n  ...emojiReactionsView_reactable\n}\n\nfragment issueDetailView_repository on Repository {\n  id\n  name\n  owner {\n    __typename\n    login\n    id\n  }\n}\n\nfragment issueTimelineController_issue_3D8CP9 on Issue {\n  url\n  timelineItems(first: $timelineCount, after: $timelineCursor) {\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n    edges {\n      cursor\n      node {\n        __typename\n        ...issueCommentView_item\n        ...crossReferencedEventsView_nodes\n        ... on Node {\n          id\n        }\n      }\n    }\n  }\n}\n",
      "metadata": {}
    }
  };
}(); // prettier-ignore


node
/*: any*/
.hash = '180dc18124ae95e41044932a2daf88ad';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi92aWV3cy9fX2dlbmVyYXRlZF9fL2lzc3VlRGV0YWlsVmlld1JlZmV0Y2hRdWVyeS5ncmFwaHFsLmpzIl0sIm5hbWVzIjpbIm5vZGUiLCJ2MCIsInYxIiwidjIiLCJ2MyIsInY0IiwidjUiLCJ2NiIsInY3IiwidjgiLCJ2OSIsInYxMCIsInYxMSIsInYxMiIsInYxMyIsImhhc2giLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQU1BO0FBQUk7QUFBQSxFQUF5QixZQUFVO0FBQzdDLE1BQUlDLEVBQUUsR0FBRyxDQUNQO0FBQ0UsWUFBUSxlQURWO0FBRUUsWUFBUSxRQUZWO0FBR0UsWUFBUSxLQUhWO0FBSUUsb0JBQWdCO0FBSmxCLEdBRE8sRUFPUDtBQUNFLFlBQVEsZUFEVjtBQUVFLFlBQVEsWUFGVjtBQUdFLFlBQVEsS0FIVjtBQUlFLG9CQUFnQjtBQUpsQixHQVBPLEVBYVA7QUFDRSxZQUFRLGVBRFY7QUFFRSxZQUFRLGVBRlY7QUFHRSxZQUFRLE1BSFY7QUFJRSxvQkFBZ0I7QUFKbEIsR0FiTyxFQW1CUDtBQUNFLFlBQVEsZUFEVjtBQUVFLFlBQVEsZ0JBRlY7QUFHRSxZQUFRLFFBSFY7QUFJRSxvQkFBZ0I7QUFKbEIsR0FuQk8sQ0FBVDtBQUFBLE1BMEJBQyxFQUFFLEdBQUcsQ0FDSDtBQUNFLFlBQVEsVUFEVjtBQUVFLFlBQVEsSUFGVjtBQUdFLG9CQUFnQjtBQUhsQixHQURHLENBMUJMO0FBQUEsTUFpQ0FDLEVBQUUsR0FBRyxDQUNIO0FBQ0UsWUFBUSxVQURWO0FBRUUsWUFBUSxJQUZWO0FBR0Usb0JBQWdCO0FBSGxCLEdBREcsQ0FqQ0w7QUFBQSxNQXdDQUMsRUFBRSxHQUFHO0FBQ0gsWUFBUSxhQURMO0FBRUgsYUFBUyxJQUZOO0FBR0gsWUFBUSxZQUhMO0FBSUgsWUFBUSxJQUpMO0FBS0gsa0JBQWM7QUFMWCxHQXhDTDtBQUFBLE1BK0NBQyxFQUFFLEdBQUc7QUFDSCxZQUFRLGFBREw7QUFFSCxhQUFTLElBRk47QUFHSCxZQUFRLElBSEw7QUFJSCxZQUFRLElBSkw7QUFLSCxrQkFBYztBQUxYLEdBL0NMO0FBQUEsTUFzREFDLEVBQUUsR0FBRztBQUNILFlBQVEsYUFETDtBQUVILGFBQVMsSUFGTjtBQUdILFlBQVEsTUFITDtBQUlILFlBQVEsSUFKTDtBQUtILGtCQUFjO0FBTFgsR0F0REw7QUFBQSxNQTZEQUMsRUFBRSxHQUFHO0FBQ0gsWUFBUSxhQURMO0FBRUgsYUFBUyxJQUZOO0FBR0gsWUFBUSxPQUhMO0FBSUgsWUFBUSxJQUpMO0FBS0gsa0JBQWM7QUFMWCxHQTdETDtBQUFBLE1Bb0VBQyxFQUFFLEdBQUc7QUFDSCxZQUFRLGFBREw7QUFFSCxhQUFTLElBRk47QUFHSCxZQUFRLE9BSEw7QUFJSCxrQkFBYyxJQUpYO0FBS0gsWUFBUSxJQUxMO0FBTUgsb0JBQWdCLElBTmI7QUFPSCxjQUFVLEtBUFA7QUFRSCxrQkFBYyxDQUNYSjtBQUFFO0FBRFMsTUFFWEc7QUFBRTtBQUZTLE1BR1hGO0FBQUU7QUFIUztBQVJYLEdBcEVMO0FBQUEsTUFrRkFJLEVBQUUsR0FBRztBQUNILFlBQVEsYUFETDtBQUVILGFBQVMsSUFGTjtBQUdILFlBQVEsS0FITDtBQUlILFlBQVEsSUFKTDtBQUtILGtCQUFjO0FBTFgsR0FsRkw7QUFBQSxNQXlGQUMsRUFBRSxHQUFHO0FBQ0gsWUFBUSxhQURMO0FBRUgsYUFBUyxJQUZOO0FBR0gsWUFBUSxRQUhMO0FBSUgsWUFBUSxJQUpMO0FBS0gsa0JBQWM7QUFMWCxHQXpGTDtBQUFBLE1BZ0dBQyxHQUFHLEdBQUc7QUFDSixZQUFRLGFBREo7QUFFSixhQUFTLElBRkw7QUFHSixZQUFRLE9BSEo7QUFJSixZQUFRLElBSko7QUFLSixrQkFBYztBQUxWLEdBaEdOO0FBQUEsTUF1R0FDLEdBQUcsR0FBRztBQUNKLFlBQVEsYUFESjtBQUVKLGFBQVMsSUFGTDtBQUdKLFlBQVEsVUFISjtBQUlKLFlBQVEsSUFKSjtBQUtKLGtCQUFjO0FBTFYsR0F2R047QUFBQSxNQThHQUMsR0FBRyxHQUFHO0FBQ0osWUFBUSxhQURKO0FBRUosYUFBUyxJQUZMO0FBR0osWUFBUSxXQUhKO0FBSUosWUFBUSxJQUpKO0FBS0osa0JBQWM7QUFMVixHQTlHTjtBQUFBLE1BcUhBQyxHQUFHLEdBQUcsQ0FDSjtBQUNFLFlBQVEsVUFEVjtBQUVFLFlBQVEsT0FGVjtBQUdFLG9CQUFnQjtBQUhsQixHQURJLEVBTUo7QUFDRSxZQUFRLFVBRFY7QUFFRSxZQUFRLE9BRlY7QUFHRSxvQkFBZ0I7QUFIbEIsR0FOSSxDQXJITjtBQWlJQSxTQUFPO0FBQ0wsWUFBUSxTQURIO0FBRUwsZ0JBQVk7QUFDVixjQUFRLFVBREU7QUFFVixjQUFRLDZCQUZFO0FBR1YsY0FBUSxPQUhFO0FBSVYsa0JBQVksSUFKRjtBQUtWLDZCQUF3QmI7QUFBRTtBQUxoQjtBQU1WLG9CQUFjLENBQ1o7QUFDRSxnQkFBUSxhQURWO0FBRUUsaUJBQVMsWUFGWDtBQUdFLGdCQUFRLE1BSFY7QUFJRSxzQkFBYyxJQUpoQjtBQUtFLGdCQUFTQztBQUFFO0FBTGI7QUFNRSx3QkFBZ0IsSUFObEI7QUFPRSxrQkFBVSxLQVBaO0FBUUUsc0JBQWMsQ0FDWjtBQUNFLGtCQUFRLGdCQURWO0FBRUUsa0JBQVEsNEJBRlY7QUFHRSxrQkFBUTtBQUhWLFNBRFk7QUFSaEIsT0FEWSxFQWlCWjtBQUNFLGdCQUFRLGFBRFY7QUFFRSxpQkFBUyxPQUZYO0FBR0UsZ0JBQVEsTUFIVjtBQUlFLHNCQUFjLElBSmhCO0FBS0UsZ0JBQVNDO0FBQUU7QUFMYjtBQU1FLHdCQUFnQixJQU5sQjtBQU9FLGtCQUFVLEtBUFo7QUFRRSxzQkFBYyxDQUNaO0FBQ0Usa0JBQVEsZ0JBRFY7QUFFRSxrQkFBUSx1QkFGVjtBQUdFLGtCQUFRLENBQ047QUFDRSxvQkFBUSxVQURWO0FBRUUsb0JBQVEsZUFGVjtBQUdFLDRCQUFnQjtBQUhsQixXQURNLEVBTU47QUFDRSxvQkFBUSxVQURWO0FBRUUsb0JBQVEsZ0JBRlY7QUFHRSw0QkFBZ0I7QUFIbEIsV0FOTTtBQUhWLFNBRFk7QUFSaEIsT0FqQlk7QUFOSixLQUZQO0FBc0RMLGlCQUFhO0FBQ1gsY0FBUSxXQURHO0FBRVgsY0FBUSw2QkFGRztBQUdYLDZCQUF3QkY7QUFBRTtBQUhmO0FBSVgsb0JBQWMsQ0FDWjtBQUNFLGdCQUFRLGFBRFY7QUFFRSxpQkFBUyxZQUZYO0FBR0UsZ0JBQVEsTUFIVjtBQUlFLHNCQUFjLElBSmhCO0FBS0UsZ0JBQVNDO0FBQUU7QUFMYjtBQU1FLHdCQUFnQixJQU5sQjtBQU9FLGtCQUFVLEtBUFo7QUFRRSxzQkFBYyxDQUNYRTtBQUFFO0FBRFMsVUFFWEM7QUFBRTtBQUZTLFVBR1o7QUFDRSxrQkFBUSxnQkFEVjtBQUVFLGtCQUFRLFlBRlY7QUFHRSx3QkFBYyxDQUNYQztBQUFFO0FBRFMsWUFFWEU7QUFBRTtBQUZTO0FBSGhCLFNBSFk7QUFSaEIsT0FEWSxFQXNCWjtBQUNFLGdCQUFRLGFBRFY7QUFFRSxpQkFBUyxPQUZYO0FBR0UsZ0JBQVEsTUFIVjtBQUlFLHNCQUFjLElBSmhCO0FBS0UsZ0JBQVNMO0FBQUU7QUFMYjtBQU1FLHdCQUFnQixJQU5sQjtBQU9FLGtCQUFVLEtBUFo7QUFRRSxzQkFBYyxDQUNYQztBQUFFO0FBRFMsVUFFWEM7QUFBRTtBQUZTLFVBR1o7QUFDRSxrQkFBUSxnQkFEVjtBQUVFLGtCQUFRLE9BRlY7QUFHRSx3QkFBYyxDQUNYRDtBQUFFO0FBRFMsWUFFWEs7QUFBRTtBQUZTLFlBR1o7QUFDRSxvQkFBUSxhQURWO0FBRUUscUJBQVMsSUFGWDtBQUdFLG9CQUFRLE9BSFY7QUFJRSxvQkFBUSxJQUpWO0FBS0UsMEJBQWM7QUFMaEIsV0FIWSxFQVVYQztBQUFFO0FBVlMsWUFXWEM7QUFBRztBQVhRLFlBWVhDO0FBQUc7QUFaUSxZQWFaO0FBQ0Usb0JBQVEsYUFEVjtBQUVFLHFCQUFTLElBRlg7QUFHRSxvQkFBUSxRQUhWO0FBSUUsMEJBQWMsSUFKaEI7QUFLRSxvQkFBUSxJQUxWO0FBTUUsNEJBQWdCLElBTmxCO0FBT0Usc0JBQVUsS0FQWjtBQVFFLDBCQUFjLENBQ1hSO0FBQUU7QUFEUyxjQUVYRztBQUFFO0FBRlMsY0FHWE07QUFBRztBQUhRLGNBSVhKO0FBQUU7QUFKUyxjQUtYSjtBQUFFO0FBTFM7QUFSaEIsV0FiWSxFQTZCWjtBQUNFLG9CQUFRLGFBRFY7QUFFRSxxQkFBUyxJQUZYO0FBR0Usb0JBQVEsZUFIVjtBQUlFLDBCQUFjLElBSmhCO0FBS0Usb0JBQVNTO0FBQUc7QUFMZDtBQU1FLDRCQUFnQiw4QkFObEI7QUFPRSxzQkFBVSxLQVBaO0FBUUUsMEJBQWMsQ0FDWjtBQUNFLHNCQUFRLGFBRFY7QUFFRSx1QkFBUyxJQUZYO0FBR0Usc0JBQVEsVUFIVjtBQUlFLDRCQUFjLElBSmhCO0FBS0Usc0JBQVEsSUFMVjtBQU1FLDhCQUFnQixVQU5sQjtBQU9FLHdCQUFVLEtBUFo7QUFRRSw0QkFBYyxDQUNaO0FBQ0Usd0JBQVEsYUFEVjtBQUVFLHlCQUFTLElBRlg7QUFHRSx3QkFBUSxXQUhWO0FBSUUsd0JBQVEsSUFKVjtBQUtFLDhCQUFjO0FBTGhCLGVBRFksRUFRWjtBQUNFLHdCQUFRLGFBRFY7QUFFRSx5QkFBUyxJQUZYO0FBR0Usd0JBQVEsYUFIVjtBQUlFLHdCQUFRLElBSlY7QUFLRSw4QkFBYztBQUxoQixlQVJZO0FBUmhCLGFBRFksRUEwQlo7QUFDRSxzQkFBUSxhQURWO0FBRUUsdUJBQVMsSUFGWDtBQUdFLHNCQUFRLE9BSFY7QUFJRSw0QkFBYyxJQUpoQjtBQUtFLHNCQUFRLElBTFY7QUFNRSw4QkFBZ0Isd0JBTmxCO0FBT0Usd0JBQVUsSUFQWjtBQVFFLDRCQUFjLENBQ1o7QUFDRSx3QkFBUSxhQURWO0FBRUUseUJBQVMsSUFGWDtBQUdFLHdCQUFRLFFBSFY7QUFJRSx3QkFBUSxJQUpWO0FBS0UsOEJBQWM7QUFMaEIsZUFEWSxFQVFaO0FBQ0Usd0JBQVEsYUFEVjtBQUVFLHlCQUFTLElBRlg7QUFHRSx3QkFBUSxNQUhWO0FBSUUsOEJBQWMsSUFKaEI7QUFLRSx3QkFBUSxJQUxWO0FBTUUsZ0NBQWdCLElBTmxCO0FBT0UsMEJBQVUsS0FQWjtBQVFFLDhCQUFjLENBQ1hWO0FBQUU7QUFEUyxrQkFFWEM7QUFBRTtBQUZTLGtCQUdaO0FBQ0UsMEJBQVEsZ0JBRFY7QUFFRSwwQkFBUSxjQUZWO0FBR0UsZ0NBQWMsQ0FDWjtBQUNFLDRCQUFRLGFBRFY7QUFFRSw2QkFBUyxJQUZYO0FBR0UsNEJBQVEsUUFIVjtBQUlFLGtDQUFjLElBSmhCO0FBS0UsNEJBQVEsSUFMVjtBQU1FLG9DQUFnQixJQU5sQjtBQU9FLDhCQUFVLEtBUFo7QUFRRSxrQ0FBYyxDQUNYRDtBQUFFO0FBRFMsc0JBRVhTO0FBQUc7QUFGUSxzQkFHWE47QUFBRTtBQUhTLHNCQUlYRjtBQUFFO0FBSlM7QUFSaEIsbUJBRFksRUFnQlhPO0FBQUc7QUFoQlEsb0JBaUJaO0FBQ0UsNEJBQVEsYUFEVjtBQUVFLDZCQUFTLElBRlg7QUFHRSw0QkFBUSxXQUhWO0FBSUUsNEJBQVEsSUFKVjtBQUtFLGtDQUFjO0FBTGhCLG1CQWpCWSxFQXdCWEg7QUFBRTtBQXhCUztBQUhoQixpQkFIWSxFQWlDWjtBQUNFLDBCQUFRLGdCQURWO0FBRUUsMEJBQVEsc0JBRlY7QUFHRSxnQ0FBYyxDQUNaO0FBQ0UsNEJBQVEsYUFEVjtBQUVFLDZCQUFTLElBRlg7QUFHRSw0QkFBUSxjQUhWO0FBSUUsNEJBQVEsSUFKVjtBQUtFLGtDQUFjO0FBTGhCLG1CQURZLEVBUVo7QUFDRSw0QkFBUSxhQURWO0FBRUUsNkJBQVMsSUFGWDtBQUdFLDRCQUFRLG1CQUhWO0FBSUUsNEJBQVEsSUFKVjtBQUtFLGtDQUFjO0FBTGhCLG1CQVJZLEVBZVo7QUFDRSw0QkFBUSxhQURWO0FBRUUsNkJBQVMsSUFGWDtBQUdFLDRCQUFRLE9BSFY7QUFJRSxrQ0FBYyxJQUpoQjtBQUtFLDRCQUFRLElBTFY7QUFNRSxvQ0FBZ0IsSUFObEI7QUFPRSw4QkFBVSxLQVBaO0FBUUUsa0NBQWMsQ0FDWEw7QUFBRTtBQURTLHNCQUVYRztBQUFFO0FBRlMsc0JBR1hNO0FBQUc7QUFIUSxzQkFJWFI7QUFBRTtBQUpTO0FBUmhCLG1CQWZZLEVBOEJaO0FBQ0UsNEJBQVEsYUFEVjtBQUVFLDZCQUFTLElBRlg7QUFHRSw0QkFBUSxRQUhWO0FBSUUsa0NBQWMsSUFKaEI7QUFLRSw0QkFBUSxJQUxWO0FBTUUsb0NBQWdCLElBTmxCO0FBT0UsOEJBQVUsS0FQWjtBQVFFLGtDQUFjLENBQ1hEO0FBQUU7QUFEUyxzQkFFWjtBQUNFLDhCQUFRLGFBRFY7QUFFRSwrQkFBUyxJQUZYO0FBR0UsOEJBQVEsWUFIVjtBQUlFLG9DQUFjLElBSmhCO0FBS0UsOEJBQVEsSUFMVjtBQU1FLHNDQUFnQixZQU5sQjtBQU9FLGdDQUFVLEtBUFo7QUFRRSxvQ0FBYyxDQUNYRTtBQUFFO0FBRFMsd0JBRVhFO0FBQUU7QUFGUyx3QkFHWEg7QUFBRTtBQUhTLHdCQUlaO0FBQ0UsZ0NBQVEsYUFEVjtBQUVFLGlDQUFTLElBRlg7QUFHRSxnQ0FBUSxXQUhWO0FBSUUsZ0NBQVEsSUFKVjtBQUtFLHNDQUFjO0FBTGhCLHVCQUpZO0FBUmhCLHFCQUZZLEVBdUJYQTtBQUFFO0FBdkJTLHNCQXdCWjtBQUNFLDhCQUFRLGdCQURWO0FBRUUsOEJBQVEsT0FGVjtBQUdFLG9DQUFjLENBQ1hLO0FBQUU7QUFEUyx3QkFFWEM7QUFBRztBQUZRLHdCQUdYRjtBQUFFO0FBSFMsd0JBSVo7QUFDRSxnQ0FBUSxhQURWO0FBRUUsaUNBQVMsWUFGWDtBQUdFLGdDQUFRLE9BSFY7QUFJRSxnQ0FBUSxJQUpWO0FBS0Usc0NBQWM7QUFMaEIsdUJBSlk7QUFIaEIscUJBeEJZLEVBd0NaO0FBQ0UsOEJBQVEsZ0JBRFY7QUFFRSw4QkFBUSxhQUZWO0FBR0Usb0NBQWMsQ0FDWEM7QUFBRTtBQURTLHdCQUVYQztBQUFHO0FBRlEsd0JBR1hGO0FBQUU7QUFIUyx3QkFJWjtBQUNFLGdDQUFRLGFBRFY7QUFFRSxpQ0FBUyxTQUZYO0FBR0UsZ0NBQVEsT0FIVjtBQUlFLGdDQUFRLElBSlY7QUFLRSxzQ0FBYztBQUxoQix1QkFKWTtBQUhoQixxQkF4Q1k7QUFSaEIsbUJBOUJZO0FBSGhCLGlCQWpDWTtBQVJoQixlQVJZO0FBUmhCLGFBMUJZO0FBUmhCLFdBN0JZLEVBbU9aO0FBQ0Usb0JBQVEsY0FEVjtBQUVFLHFCQUFTLElBRlg7QUFHRSxvQkFBUSxlQUhWO0FBSUUsb0JBQVNLO0FBQUc7QUFKZDtBQUtFLHNCQUFVLFlBTFo7QUFNRSxtQkFBTyx1Q0FOVDtBQU9FLHVCQUFXO0FBUGIsV0FuT1ksRUE0T1o7QUFDRSxvQkFBUSxhQURWO0FBRUUscUJBQVMsSUFGWDtBQUdFLG9CQUFRLGdCQUhWO0FBSUUsMEJBQWMsSUFKaEI7QUFLRSxvQkFBUSxJQUxWO0FBTUUsNEJBQWdCLGVBTmxCO0FBT0Usc0JBQVUsSUFQWjtBQVFFLDBCQUFjLENBQ1o7QUFDRSxzQkFBUSxhQURWO0FBRUUsdUJBQVMsSUFGWDtBQUdFLHNCQUFRLFNBSFY7QUFJRSxzQkFBUSxJQUpWO0FBS0UsNEJBQWM7QUFMaEIsYUFEWSxFQVFaO0FBQ0Usc0JBQVEsYUFEVjtBQUVFLHVCQUFTLElBRlg7QUFHRSxzQkFBUSxrQkFIVjtBQUlFLHNCQUFRLElBSlY7QUFLRSw0QkFBYztBQUxoQixhQVJZLEVBZVo7QUFDRSxzQkFBUSxhQURWO0FBRUUsdUJBQVMsSUFGWDtBQUdFLHNCQUFRLE9BSFY7QUFJRSw0QkFBYyxJQUpoQjtBQUtFLHNCQUFRLElBTFY7QUFNRSw4QkFBZ0Isd0JBTmxCO0FBT0Usd0JBQVUsS0FQWjtBQVFFLDRCQUFjLENBQ1o7QUFDRSx3QkFBUSxhQURWO0FBRUUseUJBQVMsSUFGWDtBQUdFLHdCQUFRLFlBSFY7QUFJRSx3QkFBUSxJQUpWO0FBS0UsOEJBQWM7QUFMaEIsZUFEWTtBQVJoQixhQWZZO0FBUmhCLFdBNU9ZLEVBdVJaO0FBQ0Usb0JBQVEsYUFEVjtBQUVFLHFCQUFTLElBRlg7QUFHRSxvQkFBUSxnQkFIVjtBQUlFLG9CQUFRLElBSlY7QUFLRSwwQkFBYztBQUxoQixXQXZSWTtBQUhoQixTQUhZO0FBUmhCLE9BdEJZO0FBSkgsS0F0RFI7QUFrWUwsY0FBVTtBQUNSLHVCQUFpQixPQURUO0FBRVIsY0FBUSw2QkFGQTtBQUdSLFlBQU0sSUFIRTtBQUlSLGNBQVEseS9FQUpBO0FBS1Isa0JBQVk7QUFMSjtBQWxZTCxHQUFQO0FBMFlDLENBNWdCaUMsRUFBbEMsQyxDQTZnQkE7OztBQUNDZDtBQUFJO0FBQUwsQ0FBZ0JlLElBQWhCLEdBQXVCLGtDQUF2QjtBQUNBQyxNQUFNLENBQUNDLE9BQVAsR0FBaUJqQixJQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZsb3dcbiAqIEByZWxheUhhc2ggMzBmYjA4NjY5OTU1MTA0NzVlOTRjMzA3OTA2OWJmMGVcbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qOjpcbmltcG9ydCB0eXBlIHsgQ29uY3JldGVSZXF1ZXN0IH0gZnJvbSAncmVsYXktcnVudGltZSc7XG50eXBlIGlzc3VlRGV0YWlsVmlld19pc3N1ZSRyZWYgPSBhbnk7XG50eXBlIGlzc3VlRGV0YWlsVmlld19yZXBvc2l0b3J5JHJlZiA9IGFueTtcbmV4cG9ydCB0eXBlIGlzc3VlRGV0YWlsVmlld1JlZmV0Y2hRdWVyeVZhcmlhYmxlcyA9IHt8XG4gIHJlcG9JZDogc3RyaW5nLFxuICBpc3N1ZWlzaElkOiBzdHJpbmcsXG4gIHRpbWVsaW5lQ291bnQ6IG51bWJlcixcbiAgdGltZWxpbmVDdXJzb3I/OiA/c3RyaW5nLFxufH07XG5leHBvcnQgdHlwZSBpc3N1ZURldGFpbFZpZXdSZWZldGNoUXVlcnlSZXNwb25zZSA9IHt8XG4gICtyZXBvc2l0b3J5OiA/e3xcbiAgICArJGZyYWdtZW50UmVmczogaXNzdWVEZXRhaWxWaWV3X3JlcG9zaXRvcnkkcmVmXG4gIHx9LFxuICAraXNzdWU6ID97fFxuICAgICskZnJhZ21lbnRSZWZzOiBpc3N1ZURldGFpbFZpZXdfaXNzdWUkcmVmXG4gIHx9LFxufH07XG5leHBvcnQgdHlwZSBpc3N1ZURldGFpbFZpZXdSZWZldGNoUXVlcnkgPSB7fFxuICB2YXJpYWJsZXM6IGlzc3VlRGV0YWlsVmlld1JlZmV0Y2hRdWVyeVZhcmlhYmxlcyxcbiAgcmVzcG9uc2U6IGlzc3VlRGV0YWlsVmlld1JlZmV0Y2hRdWVyeVJlc3BvbnNlLFxufH07XG4qL1xuXG5cbi8qXG5xdWVyeSBpc3N1ZURldGFpbFZpZXdSZWZldGNoUXVlcnkoXG4gICRyZXBvSWQ6IElEIVxuICAkaXNzdWVpc2hJZDogSUQhXG4gICR0aW1lbGluZUNvdW50OiBJbnQhXG4gICR0aW1lbGluZUN1cnNvcjogU3RyaW5nXG4pIHtcbiAgcmVwb3NpdG9yeTogbm9kZShpZDogJHJlcG9JZCkge1xuICAgIF9fdHlwZW5hbWVcbiAgICAuLi5pc3N1ZURldGFpbFZpZXdfcmVwb3NpdG9yeVxuICAgIGlkXG4gIH1cbiAgaXNzdWU6IG5vZGUoaWQ6ICRpc3N1ZWlzaElkKSB7XG4gICAgX190eXBlbmFtZVxuICAgIC4uLmlzc3VlRGV0YWlsVmlld19pc3N1ZV8zRDhDUDlcbiAgICBpZFxuICB9XG59XG5cbmZyYWdtZW50IGNyb3NzUmVmZXJlbmNlZEV2ZW50Vmlld19pdGVtIG9uIENyb3NzUmVmZXJlbmNlZEV2ZW50IHtcbiAgaWRcbiAgaXNDcm9zc1JlcG9zaXRvcnlcbiAgc291cmNlIHtcbiAgICBfX3R5cGVuYW1lXG4gICAgLi4uIG9uIElzc3VlIHtcbiAgICAgIG51bWJlclxuICAgICAgdGl0bGVcbiAgICAgIHVybFxuICAgICAgaXNzdWVTdGF0ZTogc3RhdGVcbiAgICB9XG4gICAgLi4uIG9uIFB1bGxSZXF1ZXN0IHtcbiAgICAgIG51bWJlclxuICAgICAgdGl0bGVcbiAgICAgIHVybFxuICAgICAgcHJTdGF0ZTogc3RhdGVcbiAgICB9XG4gICAgLi4uIG9uIFJlcG9zaXRvcnlOb2RlIHtcbiAgICAgIHJlcG9zaXRvcnkge1xuICAgICAgICBuYW1lXG4gICAgICAgIGlzUHJpdmF0ZVxuICAgICAgICBvd25lciB7XG4gICAgICAgICAgX190eXBlbmFtZVxuICAgICAgICAgIGxvZ2luXG4gICAgICAgICAgaWRcbiAgICAgICAgfVxuICAgICAgICBpZFxuICAgICAgfVxuICAgIH1cbiAgICAuLi4gb24gTm9kZSB7XG4gICAgICBpZFxuICAgIH1cbiAgfVxufVxuXG5mcmFnbWVudCBjcm9zc1JlZmVyZW5jZWRFdmVudHNWaWV3X25vZGVzIG9uIENyb3NzUmVmZXJlbmNlZEV2ZW50IHtcbiAgaWRcbiAgcmVmZXJlbmNlZEF0XG4gIGlzQ3Jvc3NSZXBvc2l0b3J5XG4gIGFjdG9yIHtcbiAgICBfX3R5cGVuYW1lXG4gICAgbG9naW5cbiAgICBhdmF0YXJVcmxcbiAgICAuLi4gb24gTm9kZSB7XG4gICAgICBpZFxuICAgIH1cbiAgfVxuICBzb3VyY2Uge1xuICAgIF9fdHlwZW5hbWVcbiAgICAuLi4gb24gUmVwb3NpdG9yeU5vZGUge1xuICAgICAgcmVwb3NpdG9yeSB7XG4gICAgICAgIG5hbWVcbiAgICAgICAgb3duZXIge1xuICAgICAgICAgIF9fdHlwZW5hbWVcbiAgICAgICAgICBsb2dpblxuICAgICAgICAgIGlkXG4gICAgICAgIH1cbiAgICAgICAgaWRcbiAgICAgIH1cbiAgICB9XG4gICAgLi4uIG9uIE5vZGUge1xuICAgICAgaWRcbiAgICB9XG4gIH1cbiAgLi4uY3Jvc3NSZWZlcmVuY2VkRXZlbnRWaWV3X2l0ZW1cbn1cblxuZnJhZ21lbnQgZW1vamlSZWFjdGlvbnNWaWV3X3JlYWN0YWJsZSBvbiBSZWFjdGFibGUge1xuICBpZFxuICByZWFjdGlvbkdyb3VwcyB7XG4gICAgY29udGVudFxuICAgIHZpZXdlckhhc1JlYWN0ZWRcbiAgICB1c2VycyB7XG4gICAgICB0b3RhbENvdW50XG4gICAgfVxuICB9XG4gIHZpZXdlckNhblJlYWN0XG59XG5cbmZyYWdtZW50IGlzc3VlQ29tbWVudFZpZXdfaXRlbSBvbiBJc3N1ZUNvbW1lbnQge1xuICBhdXRob3Ige1xuICAgIF9fdHlwZW5hbWVcbiAgICBhdmF0YXJVcmxcbiAgICBsb2dpblxuICAgIC4uLiBvbiBOb2RlIHtcbiAgICAgIGlkXG4gICAgfVxuICB9XG4gIGJvZHlIVE1MXG4gIGNyZWF0ZWRBdFxuICB1cmxcbn1cblxuZnJhZ21lbnQgaXNzdWVEZXRhaWxWaWV3X2lzc3VlXzNEOENQOSBvbiBJc3N1ZSB7XG4gIGlkXG4gIF9fdHlwZW5hbWVcbiAgdXJsXG4gIHN0YXRlXG4gIG51bWJlclxuICB0aXRsZVxuICBib2R5SFRNTFxuICBhdXRob3Ige1xuICAgIF9fdHlwZW5hbWVcbiAgICBsb2dpblxuICAgIGF2YXRhclVybFxuICAgIHVybFxuICAgIC4uLiBvbiBOb2RlIHtcbiAgICAgIGlkXG4gICAgfVxuICB9XG4gIC4uLmlzc3VlVGltZWxpbmVDb250cm9sbGVyX2lzc3VlXzNEOENQOVxuICAuLi5lbW9qaVJlYWN0aW9uc1ZpZXdfcmVhY3RhYmxlXG59XG5cbmZyYWdtZW50IGlzc3VlRGV0YWlsVmlld19yZXBvc2l0b3J5IG9uIFJlcG9zaXRvcnkge1xuICBpZFxuICBuYW1lXG4gIG93bmVyIHtcbiAgICBfX3R5cGVuYW1lXG4gICAgbG9naW5cbiAgICBpZFxuICB9XG59XG5cbmZyYWdtZW50IGlzc3VlVGltZWxpbmVDb250cm9sbGVyX2lzc3VlXzNEOENQOSBvbiBJc3N1ZSB7XG4gIHVybFxuICB0aW1lbGluZUl0ZW1zKGZpcnN0OiAkdGltZWxpbmVDb3VudCwgYWZ0ZXI6ICR0aW1lbGluZUN1cnNvcikge1xuICAgIHBhZ2VJbmZvIHtcbiAgICAgIGVuZEN1cnNvclxuICAgICAgaGFzTmV4dFBhZ2VcbiAgICB9XG4gICAgZWRnZXMge1xuICAgICAgY3Vyc29yXG4gICAgICBub2RlIHtcbiAgICAgICAgX190eXBlbmFtZVxuICAgICAgICAuLi5pc3N1ZUNvbW1lbnRWaWV3X2l0ZW1cbiAgICAgICAgLi4uY3Jvc3NSZWZlcmVuY2VkRXZlbnRzVmlld19ub2Rlc1xuICAgICAgICAuLi4gb24gTm9kZSB7XG4gICAgICAgICAgaWRcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuKi9cblxuY29uc3Qgbm9kZS8qOiBDb25jcmV0ZVJlcXVlc3QqLyA9IChmdW5jdGlvbigpe1xudmFyIHYwID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgIFwibmFtZVwiOiBcInJlcG9JZFwiLFxuICAgIFwidHlwZVwiOiBcIklEIVwiLFxuICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgfSxcbiAge1xuICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICBcIm5hbWVcIjogXCJpc3N1ZWlzaElkXCIsXG4gICAgXCJ0eXBlXCI6IFwiSUQhXCIsXG4gICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICB9LFxuICB7XG4gICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgIFwibmFtZVwiOiBcInRpbWVsaW5lQ291bnRcIixcbiAgICBcInR5cGVcIjogXCJJbnQhXCIsXG4gICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICB9LFxuICB7XG4gICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgIFwibmFtZVwiOiBcInRpbWVsaW5lQ3Vyc29yXCIsXG4gICAgXCJ0eXBlXCI6IFwiU3RyaW5nXCIsXG4gICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICB9XG5dLFxudjEgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgIFwibmFtZVwiOiBcImlkXCIsXG4gICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJyZXBvSWRcIlxuICB9XG5dLFxudjIgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgIFwibmFtZVwiOiBcImlkXCIsXG4gICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJpc3N1ZWlzaElkXCJcbiAgfVxuXSxcbnYzID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcIl9fdHlwZW5hbWVcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjQgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiaWRcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjUgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwibmFtZVwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52NiA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJsb2dpblwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52NyA9IHtcbiAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJvd25lclwiLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gIFwicGx1cmFsXCI6IGZhbHNlLFxuICBcInNlbGVjdGlvbnNcIjogW1xuICAgICh2My8qOiBhbnkqLyksXG4gICAgKHY2Lyo6IGFueSovKSxcbiAgICAodjQvKjogYW55Ki8pXG4gIF1cbn0sXG52OCA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJ1cmxcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjkgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwibnVtYmVyXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnYxMCA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJ0aXRsZVwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52MTEgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiYm9keUhUTUxcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjEyID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcImF2YXRhclVybFwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52MTMgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgIFwibmFtZVwiOiBcImFmdGVyXCIsXG4gICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJ0aW1lbGluZUN1cnNvclwiXG4gIH0sXG4gIHtcbiAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgIFwibmFtZVwiOiBcImZpcnN0XCIsXG4gICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJ0aW1lbGluZUNvdW50XCJcbiAgfVxuXTtcbnJldHVybiB7XG4gIFwia2luZFwiOiBcIlJlcXVlc3RcIixcbiAgXCJmcmFnbWVudFwiOiB7XG4gICAgXCJraW5kXCI6IFwiRnJhZ21lbnRcIixcbiAgICBcIm5hbWVcIjogXCJpc3N1ZURldGFpbFZpZXdSZWZldGNoUXVlcnlcIixcbiAgICBcInR5cGVcIjogXCJRdWVyeVwiLFxuICAgIFwibWV0YWRhdGFcIjogbnVsbCxcbiAgICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogKHYwLyo6IGFueSovKSxcbiAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAge1xuICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICBcImFsaWFzXCI6IFwicmVwb3NpdG9yeVwiLFxuICAgICAgICBcIm5hbWVcIjogXCJub2RlXCIsXG4gICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICBcImFyZ3NcIjogKHYxLyo6IGFueSovKSxcbiAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiRnJhZ21lbnRTcHJlYWRcIixcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImlzc3VlRGV0YWlsVmlld19yZXBvc2l0b3J5XCIsXG4gICAgICAgICAgICBcImFyZ3NcIjogbnVsbFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgXCJhbGlhc1wiOiBcImlzc3VlXCIsXG4gICAgICAgIFwibmFtZVwiOiBcIm5vZGVcIixcbiAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgIFwiYXJnc1wiOiAodjIvKjogYW55Ki8pLFxuICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBudWxsLFxuICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJGcmFnbWVudFNwcmVhZFwiLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiaXNzdWVEZXRhaWxWaWV3X2lzc3VlXCIsXG4gICAgICAgICAgICBcImFyZ3NcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ0aW1lbGluZUNvdW50XCIsXG4gICAgICAgICAgICAgICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJ0aW1lbGluZUNvdW50XCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwidGltZWxpbmVDdXJzb3JcIixcbiAgICAgICAgICAgICAgICBcInZhcmlhYmxlTmFtZVwiOiBcInRpbWVsaW5lQ3Vyc29yXCJcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAgXCJvcGVyYXRpb25cIjoge1xuICAgIFwia2luZFwiOiBcIk9wZXJhdGlvblwiLFxuICAgIFwibmFtZVwiOiBcImlzc3VlRGV0YWlsVmlld1JlZmV0Y2hRdWVyeVwiLFxuICAgIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiAodjAvKjogYW55Ki8pLFxuICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgIFwiYWxpYXNcIjogXCJyZXBvc2l0b3J5XCIsXG4gICAgICAgIFwibmFtZVwiOiBcIm5vZGVcIixcbiAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgIFwiYXJnc1wiOiAodjEvKjogYW55Ki8pLFxuICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBudWxsLFxuICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAodjMvKjogYW55Ki8pLFxuICAgICAgICAgICh2NC8qOiBhbnkqLyksXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiSW5saW5lRnJhZ21lbnRcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIlJlcG9zaXRvcnlcIixcbiAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICh2NS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICh2Ny8qOiBhbnkqLylcbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgIFwiYWxpYXNcIjogXCJpc3N1ZVwiLFxuICAgICAgICBcIm5hbWVcIjogXCJub2RlXCIsXG4gICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICBcImFyZ3NcIjogKHYyLyo6IGFueSovKSxcbiAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgKHYzLyo6IGFueSovKSxcbiAgICAgICAgICAodjQvKjogYW55Ki8pLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIklubGluZUZyYWdtZW50XCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJJc3N1ZVwiLFxuICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgKHYzLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgKHY4Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInN0YXRlXCIsXG4gICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgKHY5Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgKHYxMC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICh2MTEvKjogYW55Ki8pLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiYXV0aG9yXCIsXG4gICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgKHYzLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICh2Ni8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAodjEyLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICh2OC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAodjQvKjogYW55Ki8pXG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwidGltZWxpbmVJdGVtc1wiLFxuICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwiYXJnc1wiOiAodjEzLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIklzc3VlVGltZWxpbmVJdGVtc0Nvbm5lY3Rpb25cIixcbiAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInBhZ2VJbmZvXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJQYWdlSW5mb1wiLFxuICAgICAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZW5kQ3Vyc29yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaGFzTmV4dFBhZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZWRnZXNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIklzc3VlVGltZWxpbmVJdGVtc0VkZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY3Vyc29yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibm9kZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh2My8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh2NC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJJbmxpbmVGcmFnbWVudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIklzc3VlQ29tbWVudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiYXV0aG9yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYzLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjEyLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjYvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2NC8qOiBhbnkqLylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2MTEvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNyZWF0ZWRBdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjgvKjogYW55Ki8pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiSW5saW5lRnJhZ21lbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJDcm9zc1JlZmVyZW5jZWRFdmVudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicmVmZXJlbmNlZEF0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJpc0Nyb3NzUmVwb3NpdG9yeVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiYWN0b3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjMvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2Ni8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYxMi8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY0Lyo6IGFueSovKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInNvdXJjZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2My8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInJlcG9zaXRvcnlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlJlcG9zaXRvcnlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY1Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY3Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY0Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImlzUHJpdmF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2NC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiSW5saW5lRnJhZ21lbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcIklzc3VlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjkvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjEwLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY4Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBcImlzc3VlU3RhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJzdGF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIklubGluZUZyYWdtZW50XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJQdWxsUmVxdWVzdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY5Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYxMC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2OC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogXCJwclN0YXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwic3RhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkSGFuZGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInRpbWVsaW5lSXRlbXNcIixcbiAgICAgICAgICAgICAgICBcImFyZ3NcIjogKHYxMy8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgXCJoYW5kbGVcIjogXCJjb25uZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJrZXlcIjogXCJJc3N1ZVRpbWVsaW5lQ29udHJvbGxlcl90aW1lbGluZUl0ZW1zXCIsXG4gICAgICAgICAgICAgICAgXCJmaWx0ZXJzXCI6IG51bGxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInJlYWN0aW9uR3JvdXBzXCIsXG4gICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJSZWFjdGlvbkdyb3VwXCIsXG4gICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbnRlbnRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInZpZXdlckhhc1JlYWN0ZWRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInVzZXJzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJSZWFjdGluZ1VzZXJDb25uZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ0b3RhbENvdW50XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwidmlld2VyQ2FuUmVhY3RcIixcbiAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9LFxuICBcInBhcmFtc1wiOiB7XG4gICAgXCJvcGVyYXRpb25LaW5kXCI6IFwicXVlcnlcIixcbiAgICBcIm5hbWVcIjogXCJpc3N1ZURldGFpbFZpZXdSZWZldGNoUXVlcnlcIixcbiAgICBcImlkXCI6IG51bGwsXG4gICAgXCJ0ZXh0XCI6IFwicXVlcnkgaXNzdWVEZXRhaWxWaWV3UmVmZXRjaFF1ZXJ5KFxcbiAgJHJlcG9JZDogSUQhXFxuICAkaXNzdWVpc2hJZDogSUQhXFxuICAkdGltZWxpbmVDb3VudDogSW50IVxcbiAgJHRpbWVsaW5lQ3Vyc29yOiBTdHJpbmdcXG4pIHtcXG4gIHJlcG9zaXRvcnk6IG5vZGUoaWQ6ICRyZXBvSWQpIHtcXG4gICAgX190eXBlbmFtZVxcbiAgICAuLi5pc3N1ZURldGFpbFZpZXdfcmVwb3NpdG9yeVxcbiAgICBpZFxcbiAgfVxcbiAgaXNzdWU6IG5vZGUoaWQ6ICRpc3N1ZWlzaElkKSB7XFxuICAgIF9fdHlwZW5hbWVcXG4gICAgLi4uaXNzdWVEZXRhaWxWaWV3X2lzc3VlXzNEOENQOVxcbiAgICBpZFxcbiAgfVxcbn1cXG5cXG5mcmFnbWVudCBjcm9zc1JlZmVyZW5jZWRFdmVudFZpZXdfaXRlbSBvbiBDcm9zc1JlZmVyZW5jZWRFdmVudCB7XFxuICBpZFxcbiAgaXNDcm9zc1JlcG9zaXRvcnlcXG4gIHNvdXJjZSB7XFxuICAgIF9fdHlwZW5hbWVcXG4gICAgLi4uIG9uIElzc3VlIHtcXG4gICAgICBudW1iZXJcXG4gICAgICB0aXRsZVxcbiAgICAgIHVybFxcbiAgICAgIGlzc3VlU3RhdGU6IHN0YXRlXFxuICAgIH1cXG4gICAgLi4uIG9uIFB1bGxSZXF1ZXN0IHtcXG4gICAgICBudW1iZXJcXG4gICAgICB0aXRsZVxcbiAgICAgIHVybFxcbiAgICAgIHByU3RhdGU6IHN0YXRlXFxuICAgIH1cXG4gICAgLi4uIG9uIFJlcG9zaXRvcnlOb2RlIHtcXG4gICAgICByZXBvc2l0b3J5IHtcXG4gICAgICAgIG5hbWVcXG4gICAgICAgIGlzUHJpdmF0ZVxcbiAgICAgICAgb3duZXIge1xcbiAgICAgICAgICBfX3R5cGVuYW1lXFxuICAgICAgICAgIGxvZ2luXFxuICAgICAgICAgIGlkXFxuICAgICAgICB9XFxuICAgICAgICBpZFxcbiAgICAgIH1cXG4gICAgfVxcbiAgICAuLi4gb24gTm9kZSB7XFxuICAgICAgaWRcXG4gICAgfVxcbiAgfVxcbn1cXG5cXG5mcmFnbWVudCBjcm9zc1JlZmVyZW5jZWRFdmVudHNWaWV3X25vZGVzIG9uIENyb3NzUmVmZXJlbmNlZEV2ZW50IHtcXG4gIGlkXFxuICByZWZlcmVuY2VkQXRcXG4gIGlzQ3Jvc3NSZXBvc2l0b3J5XFxuICBhY3RvciB7XFxuICAgIF9fdHlwZW5hbWVcXG4gICAgbG9naW5cXG4gICAgYXZhdGFyVXJsXFxuICAgIC4uLiBvbiBOb2RlIHtcXG4gICAgICBpZFxcbiAgICB9XFxuICB9XFxuICBzb3VyY2Uge1xcbiAgICBfX3R5cGVuYW1lXFxuICAgIC4uLiBvbiBSZXBvc2l0b3J5Tm9kZSB7XFxuICAgICAgcmVwb3NpdG9yeSB7XFxuICAgICAgICBuYW1lXFxuICAgICAgICBvd25lciB7XFxuICAgICAgICAgIF9fdHlwZW5hbWVcXG4gICAgICAgICAgbG9naW5cXG4gICAgICAgICAgaWRcXG4gICAgICAgIH1cXG4gICAgICAgIGlkXFxuICAgICAgfVxcbiAgICB9XFxuICAgIC4uLiBvbiBOb2RlIHtcXG4gICAgICBpZFxcbiAgICB9XFxuICB9XFxuICAuLi5jcm9zc1JlZmVyZW5jZWRFdmVudFZpZXdfaXRlbVxcbn1cXG5cXG5mcmFnbWVudCBlbW9qaVJlYWN0aW9uc1ZpZXdfcmVhY3RhYmxlIG9uIFJlYWN0YWJsZSB7XFxuICBpZFxcbiAgcmVhY3Rpb25Hcm91cHMge1xcbiAgICBjb250ZW50XFxuICAgIHZpZXdlckhhc1JlYWN0ZWRcXG4gICAgdXNlcnMge1xcbiAgICAgIHRvdGFsQ291bnRcXG4gICAgfVxcbiAgfVxcbiAgdmlld2VyQ2FuUmVhY3RcXG59XFxuXFxuZnJhZ21lbnQgaXNzdWVDb21tZW50Vmlld19pdGVtIG9uIElzc3VlQ29tbWVudCB7XFxuICBhdXRob3Ige1xcbiAgICBfX3R5cGVuYW1lXFxuICAgIGF2YXRhclVybFxcbiAgICBsb2dpblxcbiAgICAuLi4gb24gTm9kZSB7XFxuICAgICAgaWRcXG4gICAgfVxcbiAgfVxcbiAgYm9keUhUTUxcXG4gIGNyZWF0ZWRBdFxcbiAgdXJsXFxufVxcblxcbmZyYWdtZW50IGlzc3VlRGV0YWlsVmlld19pc3N1ZV8zRDhDUDkgb24gSXNzdWUge1xcbiAgaWRcXG4gIF9fdHlwZW5hbWVcXG4gIHVybFxcbiAgc3RhdGVcXG4gIG51bWJlclxcbiAgdGl0bGVcXG4gIGJvZHlIVE1MXFxuICBhdXRob3Ige1xcbiAgICBfX3R5cGVuYW1lXFxuICAgIGxvZ2luXFxuICAgIGF2YXRhclVybFxcbiAgICB1cmxcXG4gICAgLi4uIG9uIE5vZGUge1xcbiAgICAgIGlkXFxuICAgIH1cXG4gIH1cXG4gIC4uLmlzc3VlVGltZWxpbmVDb250cm9sbGVyX2lzc3VlXzNEOENQOVxcbiAgLi4uZW1vamlSZWFjdGlvbnNWaWV3X3JlYWN0YWJsZVxcbn1cXG5cXG5mcmFnbWVudCBpc3N1ZURldGFpbFZpZXdfcmVwb3NpdG9yeSBvbiBSZXBvc2l0b3J5IHtcXG4gIGlkXFxuICBuYW1lXFxuICBvd25lciB7XFxuICAgIF9fdHlwZW5hbWVcXG4gICAgbG9naW5cXG4gICAgaWRcXG4gIH1cXG59XFxuXFxuZnJhZ21lbnQgaXNzdWVUaW1lbGluZUNvbnRyb2xsZXJfaXNzdWVfM0Q4Q1A5IG9uIElzc3VlIHtcXG4gIHVybFxcbiAgdGltZWxpbmVJdGVtcyhmaXJzdDogJHRpbWVsaW5lQ291bnQsIGFmdGVyOiAkdGltZWxpbmVDdXJzb3IpIHtcXG4gICAgcGFnZUluZm8ge1xcbiAgICAgIGVuZEN1cnNvclxcbiAgICAgIGhhc05leHRQYWdlXFxuICAgIH1cXG4gICAgZWRnZXMge1xcbiAgICAgIGN1cnNvclxcbiAgICAgIG5vZGUge1xcbiAgICAgICAgX190eXBlbmFtZVxcbiAgICAgICAgLi4uaXNzdWVDb21tZW50Vmlld19pdGVtXFxuICAgICAgICAuLi5jcm9zc1JlZmVyZW5jZWRFdmVudHNWaWV3X25vZGVzXFxuICAgICAgICAuLi4gb24gTm9kZSB7XFxuICAgICAgICAgIGlkXFxuICAgICAgICB9XFxuICAgICAgfVxcbiAgICB9XFxuICB9XFxufVxcblwiLFxuICAgIFwibWV0YWRhdGFcIjoge31cbiAgfVxufTtcbn0pKCk7XG4vLyBwcmV0dGllci1pZ25vcmVcbihub2RlLyo6IGFueSovKS5oYXNoID0gJzE4MGRjMTgxMjRhZTk1ZTQxMDQ0OTMyYTJkYWY4OGFkJztcbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcbiJdfQ==