/**
 * @flow
 * @relayHash be25db19c5f00a90f96d8749bda8f67d
 */

/* eslint-disable */
'use strict';
/*::
import type { ConcreteRequest } from 'relay-runtime';
type reviewThreadsAccumulator_pullRequest$ref = any;
export type reviewThreadsAccumulatorQueryVariables = {|
  url: any,
  threadCount: number,
  threadCursor?: ?string,
  commentCount: number,
|};
export type reviewThreadsAccumulatorQueryResponse = {|
  +resource: ?{|
    +$fragmentRefs: reviewThreadsAccumulator_pullRequest$ref
  |}
|};
export type reviewThreadsAccumulatorQuery = {|
  variables: reviewThreadsAccumulatorQueryVariables,
  response: reviewThreadsAccumulatorQueryResponse,
|};
*/

/*
query reviewThreadsAccumulatorQuery(
  $url: URI!
  $threadCount: Int!
  $threadCursor: String
  $commentCount: Int!
) {
  resource(url: $url) {
    __typename
    ... on PullRequest {
      ...reviewThreadsAccumulator_pullRequest_3dVVow
    }
    ... on Node {
      id
    }
  }
}

fragment emojiReactionsController_reactable on Reactable {
  id
  ...emojiReactionsView_reactable
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

fragment reviewCommentsAccumulator_reviewThread_1UlnwR on PullRequestReviewThread {
  id
  comments(first: $commentCount) {
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      cursor
      node {
        id
        author {
          __typename
          avatarUrl
          login
          url
          ... on Node {
            id
          }
        }
        bodyHTML
        body
        isMinimized
        state
        viewerCanReact
        viewerCanUpdate
        path
        position
        createdAt
        lastEditedAt
        url
        authorAssociation
        ...emojiReactionsController_reactable
        __typename
      }
    }
  }
}

fragment reviewThreadsAccumulator_pullRequest_3dVVow on PullRequest {
  url
  reviewThreads(first: $threadCount, after: $threadCursor) {
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      cursor
      node {
        id
        isResolved
        resolvedBy {
          login
          id
        }
        viewerCanResolve
        viewerCanUnresolve
        ...reviewCommentsAccumulator_reviewThread_1UlnwR
        __typename
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
    "name": "url",
    "type": "URI!",
    "defaultValue": null
  }, {
    "kind": "LocalArgument",
    "name": "threadCount",
    "type": "Int!",
    "defaultValue": null
  }, {
    "kind": "LocalArgument",
    "name": "threadCursor",
    "type": "String",
    "defaultValue": null
  }, {
    "kind": "LocalArgument",
    "name": "commentCount",
    "type": "Int!",
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
    "variableName": "threadCursor"
  }, {
    "kind": "Variable",
    "name": "first",
    "variableName": "threadCount"
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
    "name": "login",
    "args": null,
    "storageKey": null
  },
      v9 = [{
    "kind": "Variable",
    "name": "first",
    "variableName": "commentCount"
  }];
  return {
    "kind": "Request",
    "fragment": {
      "kind": "Fragment",
      "name": "reviewThreadsAccumulatorQuery",
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
          "type": "PullRequest",
          "selections": [{
            "kind": "FragmentSpread",
            "name": "reviewThreadsAccumulator_pullRequest",
            "args": [{
              "kind": "Variable",
              "name": "commentCount",
              "variableName": "commentCount"
            }, {
              "kind": "Variable",
              "name": "threadCount",
              "variableName": "threadCount"
            }, {
              "kind": "Variable",
              "name": "threadCursor",
              "variableName": "threadCursor"
            }]
          }]
        }]
      }]
    },
    "operation": {
      "kind": "Operation",
      "name": "reviewThreadsAccumulatorQuery",
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
          "type": "PullRequest",
          "selections": [v4
          /*: any*/
          , {
            "kind": "LinkedField",
            "alias": null,
            "name": "reviewThreads",
            "storageKey": null,
            "args": v5
            /*: any*/
            ,
            "concreteType": "PullRequestReviewThreadConnection",
            "plural": false,
            "selections": [v6
            /*: any*/
            , {
              "kind": "LinkedField",
              "alias": null,
              "name": "edges",
              "storageKey": null,
              "args": null,
              "concreteType": "PullRequestReviewThreadEdge",
              "plural": true,
              "selections": [v7
              /*: any*/
              , {
                "kind": "LinkedField",
                "alias": null,
                "name": "node",
                "storageKey": null,
                "args": null,
                "concreteType": "PullRequestReviewThread",
                "plural": false,
                "selections": [v3
                /*: any*/
                , {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "isResolved",
                  "args": null,
                  "storageKey": null
                }, {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "resolvedBy",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "User",
                  "plural": false,
                  "selections": [v8
                  /*: any*/
                  , v3
                  /*: any*/
                  ]
                }, {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "viewerCanResolve",
                  "args": null,
                  "storageKey": null
                }, {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "viewerCanUnresolve",
                  "args": null,
                  "storageKey": null
                }, {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "comments",
                  "storageKey": null,
                  "args": v9
                  /*: any*/
                  ,
                  "concreteType": "PullRequestReviewCommentConnection",
                  "plural": false,
                  "selections": [v6
                  /*: any*/
                  , {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "edges",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "PullRequestReviewCommentEdge",
                    "plural": true,
                    "selections": [v7
                    /*: any*/
                    , {
                      "kind": "LinkedField",
                      "alias": null,
                      "name": "node",
                      "storageKey": null,
                      "args": null,
                      "concreteType": "PullRequestReviewComment",
                      "plural": false,
                      "selections": [v3
                      /*: any*/
                      , {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "author",
                        "storageKey": null,
                        "args": null,
                        "concreteType": null,
                        "plural": false,
                        "selections": [v2
                        /*: any*/
                        , {
                          "kind": "ScalarField",
                          "alias": null,
                          "name": "avatarUrl",
                          "args": null,
                          "storageKey": null
                        }, v8
                        /*: any*/
                        , v4
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
                        "name": "body",
                        "args": null,
                        "storageKey": null
                      }, {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "isMinimized",
                        "args": null,
                        "storageKey": null
                      }, {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "state",
                        "args": null,
                        "storageKey": null
                      }, {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "viewerCanReact",
                        "args": null,
                        "storageKey": null
                      }, {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "viewerCanUpdate",
                        "args": null,
                        "storageKey": null
                      }, {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "path",
                        "args": null,
                        "storageKey": null
                      }, {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "position",
                        "args": null,
                        "storageKey": null
                      }, {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "createdAt",
                        "args": null,
                        "storageKey": null
                      }, {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "lastEditedAt",
                        "args": null,
                        "storageKey": null
                      }, v4
                      /*: any*/
                      , {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "authorAssociation",
                        "args": null,
                        "storageKey": null
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
                      }, v2
                      /*: any*/
                      ]
                    }]
                  }]
                }, {
                  "kind": "LinkedHandle",
                  "alias": null,
                  "name": "comments",
                  "args": v9
                  /*: any*/
                  ,
                  "handle": "connection",
                  "key": "ReviewCommentsAccumulator_comments",
                  "filters": null
                }, v2
                /*: any*/
                ]
              }]
            }]
          }, {
            "kind": "LinkedHandle",
            "alias": null,
            "name": "reviewThreads",
            "args": v5
            /*: any*/
            ,
            "handle": "connection",
            "key": "ReviewThreadsAccumulator_reviewThreads",
            "filters": null
          }]
        }]
      }]
    },
    "params": {
      "operationKind": "query",
      "name": "reviewThreadsAccumulatorQuery",
      "id": null,
      "text": "query reviewThreadsAccumulatorQuery(\n  $url: URI!\n  $threadCount: Int!\n  $threadCursor: String\n  $commentCount: Int!\n) {\n  resource(url: $url) {\n    __typename\n    ... on PullRequest {\n      ...reviewThreadsAccumulator_pullRequest_3dVVow\n    }\n    ... on Node {\n      id\n    }\n  }\n}\n\nfragment emojiReactionsController_reactable on Reactable {\n  id\n  ...emojiReactionsView_reactable\n}\n\nfragment emojiReactionsView_reactable on Reactable {\n  id\n  reactionGroups {\n    content\n    viewerHasReacted\n    users {\n      totalCount\n    }\n  }\n  viewerCanReact\n}\n\nfragment reviewCommentsAccumulator_reviewThread_1UlnwR on PullRequestReviewThread {\n  id\n  comments(first: $commentCount) {\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n    edges {\n      cursor\n      node {\n        id\n        author {\n          __typename\n          avatarUrl\n          login\n          url\n          ... on Node {\n            id\n          }\n        }\n        bodyHTML\n        body\n        isMinimized\n        state\n        viewerCanReact\n        viewerCanUpdate\n        path\n        position\n        createdAt\n        lastEditedAt\n        url\n        authorAssociation\n        ...emojiReactionsController_reactable\n        __typename\n      }\n    }\n  }\n}\n\nfragment reviewThreadsAccumulator_pullRequest_3dVVow on PullRequest {\n  url\n  reviewThreads(first: $threadCount, after: $threadCursor) {\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n    edges {\n      cursor\n      node {\n        id\n        isResolved\n        resolvedBy {\n          login\n          id\n        }\n        viewerCanResolve\n        viewerCanUnresolve\n        ...reviewCommentsAccumulator_reviewThread_1UlnwR\n        __typename\n      }\n    }\n  }\n}\n",
      "metadata": {}
    }
  };
}(); // prettier-ignore


node
/*: any*/
.hash = 'e79afa42892ad508af3b22ca911cd7c5';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9jb250YWluZXJzL2FjY3VtdWxhdG9ycy9fX2dlbmVyYXRlZF9fL3Jldmlld1RocmVhZHNBY2N1bXVsYXRvclF1ZXJ5LmdyYXBocWwuanMiXSwibmFtZXMiOlsibm9kZSIsInYwIiwidjEiLCJ2MiIsInYzIiwidjQiLCJ2NSIsInY2IiwidjciLCJ2OCIsInY5IiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsTUFBTUE7QUFBSTtBQUFBLEVBQXlCLFlBQVU7QUFDN0MsTUFBSUMsRUFBRSxH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d1xuICogQHJlbGF5SGFzaCBiZTI1ZGIxOWM1ZjAwYTkwZjk2ZDg3NDliZGE4ZjY3ZFxuICovXG5cbi8qIGVzbGludC1kaXNhYmxlICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyo6OlxuaW1wb3J0IHR5cGUgeyBDb25jcmV0ZVJlcXVlc3QgfSBmcm9tICdyZWxheS1ydW50aW1lJztcbnR5cGUgcmV2aWV3VGhyZWFkc0FjY3VtdWxhdG9yX3B1bGxSZXF1ZXN0JHJlZiA9IGFueTtcbmV4cG9ydCB0eXBlIHJldmlld1RocmVhZHNBY2N1bXVsYXRvclF1ZXJ5VmFyaWFibGVzID0ge3xcbiAgdXJsOiBhbnksXG4gIHRocmVhZENvdW50OiBudW1iZXIsXG4gIHRocmVhZEN1cnNvcj86ID9zdHJpbmcsXG4gIGNvbW1lbnRDb3VudDogbnVtYmVyLFxufH07XG5leHBvcnQgdHlwZSByZXZpZXdUaHJlYWRzQWNjdW11bGF0b3JRdWVyeVJlc3BvbnNlID0ge3xcbiAgK3Jlc291cmNlOiA/e3xcbiAgICArJGZyYWdtZW50UmVmczogcmV2aWV3VGhyZWFkc0FjY3VtdWxhdG9yX3B1bGxSZXF1ZXN0JHJlZlxuICB8fVxufH07XG5leHBvcnQgdHlwZSByZXZpZXdUaHJlYWRzQWNjdW11bGF0b3JRdWVyeSA9IHt8XG4gIHZhcmlhYmxlczogcmV2aWV3VGhyZWFkc0FjY3VtdWxhdG9yUXVlcnlWYXJpYWJsZXMsXG4gIHJlc3BvbnNlOiByZXZpZXdUaHJlYWRzQWNjdW11bGF0b3JRdWVyeVJlc3BvbnNlLFxufH07XG4qL1xuXG5cbi8qXG5xdWVyeSByZXZpZXdUaHJlYWRzQWNjdW11bGF0b3JRdWVyeShcbiAgJHVybDogVVJJIVxuICAkdGhyZWFkQ291bnQ6IEludCFcbiAgJHRocmVhZEN1cnNvcjogU3RyaW5nXG4gICRjb21tZW50Q291bnQ6IEludCFcbikge1xuICByZXNvdXJjZSh1cmw6ICR1cmwpIHtcbiAgICBfX3R5cGVuYW1lXG4gICAgLi4uIG9uIFB1bGxSZXF1ZXN0IHtcbiAgICAgIC4uLnJldmlld1RocmVhZHNBY2N1bXVsYXRvcl9wdWxsUmVxdWVzdF8zZFZWb3dcbiAgICB9XG4gICAgLi4uIG9uIE5vZGUge1xuICAgICAgaWRcbiAgICB9XG4gIH1cbn1cblxuZnJhZ21lbnQgZW1vamlSZWFjdGlvbnNDb250cm9sbGVyX3JlYWN0YWJsZSBvbiBSZWFjdGFibGUge1xuICBpZFxuICAuLi5lbW9qaVJlYWN0aW9uc1ZpZXdfcmVhY3RhYmxlXG59XG5cbmZyYWdtZW50IGVtb2ppUmVhY3Rpb25zVmlld19yZWFjdGFibGUgb24gUmVhY3RhYmxlIHtcbiAgaWRcbiAgcmVhY3Rpb25Hcm91cHMge1xuICAgIGNvbnRlbnRcbiAgICB2aWV3ZXJIYXNSZWFjdGVkXG4gICAgdXNlcnMge1xuICAgICAgdG90YWxDb3VudFxuICAgIH1cbiAgfVxuICB2aWV3ZXJDYW5SZWFjdFxufVxuXG5mcmFnbWVudCByZXZpZXdDb21tZW50c0FjY3VtdWxhdG9yX3Jldmlld1RocmVhZF8xVWxud1Igb24gUHVsbFJlcXVlc3RSZXZpZXdUaHJlYWQge1xuICBpZFxuICBjb21tZW50cyhmaXJzdDogJGNvbW1lbnRDb3VudCkge1xuICAgIHBhZ2VJbmZvIHtcbiAgICAgIGhhc05leHRQYWdlXG4gICAgICBlbmRDdXJzb3JcbiAgICB9XG4gICAgZWRnZXMge1xuICAgICAgY3Vyc29yXG4gICAgICBub2RlIHtcbiAgICAgICAgaWRcbiAgICAgICAgYXV0aG9yIHtcbiAgICAgICAgICBfX3R5cGVuYW1lXG4gICAgICAgICAgYXZhdGFyVXJsXG4gICAgICAgICAgbG9naW5cbiAgICAgICAgICB1cmxcbiAgICAgICAgICAuLi4gb24gTm9kZSB7XG4gICAgICAgICAgICBpZFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBib2R5SFRNTFxuICAgICAgICBib2R5XG4gICAgICAgIGlzTWluaW1pemVkXG4gICAgICAgIHN0YXRlXG4gICAgICAgIHZpZXdlckNhblJlYWN0XG4gICAgICAgIHZpZXdlckNhblVwZGF0ZVxuICAgICAgICBwYXRoXG4gICAgICAgIHBvc2l0aW9uXG4gICAgICAgIGNyZWF0ZWRBdFxuICAgICAgICBsYXN0RWRpdGVkQXRcbiAgICAgICAgdXJsXG4gICAgICAgIGF1dGhvckFzc29jaWF0aW9uXG4gICAgICAgIC4uLmVtb2ppUmVhY3Rpb25zQ29udHJvbGxlcl9yZWFjdGFibGVcbiAgICAgICAgX190eXBlbmFtZVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mcmFnbWVudCByZXZpZXdUaHJlYWRzQWNjdW11bGF0b3JfcHVsbFJlcXVlc3RfM2RWVm93IG9uIFB1bGxSZXF1ZXN0IHtcbiAgdXJsXG4gIHJldmlld1RocmVhZHMoZmlyc3Q6ICR0aHJlYWRDb3VudCwgYWZ0ZXI6ICR0aHJlYWRDdXJzb3IpIHtcbiAgICBwYWdlSW5mbyB7XG4gICAgICBoYXNOZXh0UGFnZVxuICAgICAgZW5kQ3Vyc29yXG4gICAgfVxuICAgIGVkZ2VzIHtcbiAgICAgIGN1cnNvclxuICAgICAgbm9kZSB7XG4gICAgICAgIGlkXG4gICAgICAgIGlzUmVzb2x2ZWRcbiAgICAgICAgcmVzb2x2ZWRCeSB7XG4gICAgICAgICAgbG9naW5cbiAgICAgICAgICBpZFxuICAgICAgICB9XG4gICAgICAgIHZpZXdlckNhblJlc29sdmVcbiAgICAgICAgdmlld2VyQ2FuVW5yZXNvbHZlXG4gICAgICAgIC4uLnJldmlld0NvbW1lbnRzQWNjdW11bGF0b3JfcmV2aWV3VGhyZWFkXzFVbG53UlxuICAgICAgICBfX3R5cGVuYW1lXG4gICAgICB9XG4gICAgfVxuICB9XG59XG4qL1xuXG5jb25zdCBub2RlLyo6IENvbmNyZXRlUmVxdWVzdCovID0gKGZ1bmN0aW9uKCl7XG52YXIgdjAgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwidXJsXCIsXG4gICAgXCJ0eXBlXCI6IFwiVVJJIVwiLFxuICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgfSxcbiAge1xuICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICBcIm5hbWVcIjogXCJ0aHJlYWRDb3VudFwiLFxuICAgIFwidHlwZVwiOiBcIkludCFcIixcbiAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gIH0sXG4gIHtcbiAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwidGhyZWFkQ3Vyc29yXCIsXG4gICAgXCJ0eXBlXCI6IFwiU3RyaW5nXCIsXG4gICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICB9LFxuICB7XG4gICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgIFwibmFtZVwiOiBcImNvbW1lbnRDb3VudFwiLFxuICAgIFwidHlwZVwiOiBcIkludCFcIixcbiAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gIH1cbl0sXG52MSA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgXCJuYW1lXCI6IFwidXJsXCIsXG4gICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJ1cmxcIlxuICB9XG5dLFxudjIgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiX190eXBlbmFtZVwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52MyA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJpZFwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52NCA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJ1cmxcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjUgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgIFwibmFtZVwiOiBcImFmdGVyXCIsXG4gICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJ0aHJlYWRDdXJzb3JcIlxuICB9LFxuICB7XG4gICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICBcIm5hbWVcIjogXCJmaXJzdFwiLFxuICAgIFwidmFyaWFibGVOYW1lXCI6IFwidGhyZWFkQ291bnRcIlxuICB9XG5dLFxudjYgPSB7XG4gIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwicGFnZUluZm9cIixcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcImNvbmNyZXRlVHlwZVwiOiBcIlBhZ2VJbmZvXCIsXG4gIFwicGx1cmFsXCI6IGZhbHNlLFxuICBcInNlbGVjdGlvbnNcIjogW1xuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJoYXNOZXh0UGFnZVwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcImVuZEN1cnNvclwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH1cbiAgXVxufSxcbnY3ID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcImN1cnNvclwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52OCA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJsb2dpblwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52OSA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgXCJuYW1lXCI6IFwiZmlyc3RcIixcbiAgICBcInZhcmlhYmxlTmFtZVwiOiBcImNvbW1lbnRDb3VudFwiXG4gIH1cbl07XG5yZXR1cm4ge1xuICBcImtpbmRcIjogXCJSZXF1ZXN0XCIsXG4gIFwiZnJhZ21lbnRcIjoge1xuICAgIFwia2luZFwiOiBcIkZyYWdtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwicmV2aWV3VGhyZWFkc0FjY3VtdWxhdG9yUXVlcnlcIixcbiAgICBcInR5cGVcIjogXCJRdWVyeVwiLFxuICAgIFwibWV0YWRhdGFcIjogbnVsbCxcbiAgICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogKHYwLyo6IGFueSovKSxcbiAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAge1xuICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgIFwibmFtZVwiOiBcInJlc291cmNlXCIsXG4gICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICBcImFyZ3NcIjogKHYxLyo6IGFueSovKSxcbiAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiSW5saW5lRnJhZ21lbnRcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIlB1bGxSZXF1ZXN0XCIsXG4gICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiRnJhZ21lbnRTcHJlYWRcIixcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJyZXZpZXdUaHJlYWRzQWNjdW11bGF0b3JfcHVsbFJlcXVlc3RcIixcbiAgICAgICAgICAgICAgICBcImFyZ3NcIjogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjb21tZW50Q291bnRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJjb21tZW50Q291bnRcIlxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwidGhyZWFkQ291bnRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJ0aHJlYWRDb3VudFwiXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ0aHJlYWRDdXJzb3JcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJ0aHJlYWRDdXJzb3JcIlxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAgXCJvcGVyYXRpb25cIjoge1xuICAgIFwia2luZFwiOiBcIk9wZXJhdGlvblwiLFxuICAgIFwibmFtZVwiOiBcInJldmlld1RocmVhZHNBY2N1bXVsYXRvclF1ZXJ5XCIsXG4gICAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6ICh2MC8qOiBhbnkqLyksXG4gICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICBcIm5hbWVcIjogXCJyZXNvdXJjZVwiLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgXCJhcmdzXCI6ICh2MS8qOiBhbnkqLyksXG4gICAgICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICh2Mi8qOiBhbnkqLyksXG4gICAgICAgICAgKHYzLyo6IGFueSovKSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJJbmxpbmVGcmFnbWVudFwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiUHVsbFJlcXVlc3RcIixcbiAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICh2NC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJyZXZpZXdUaHJlYWRzXCIsXG4gICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJhcmdzXCI6ICh2NS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJQdWxsUmVxdWVzdFJldmlld1RocmVhZENvbm5lY3Rpb25cIixcbiAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgKHY2Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJlZGdlc1wiLFxuICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUHVsbFJlcXVlc3RSZXZpZXdUaHJlYWRFZGdlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgKHY3Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibm9kZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUHVsbFJlcXVlc3RSZXZpZXdUaHJlYWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHYzLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImlzUmVzb2x2ZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicmVzb2x2ZWRCeVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiVXNlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjgvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYzLyo6IGFueSovKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInZpZXdlckNhblJlc29sdmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwidmlld2VyQ2FuVW5yZXNvbHZlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbW1lbnRzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6ICh2OS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJQdWxsUmVxdWVzdFJldmlld0NvbW1lbnRDb25uZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2Ni8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZWRnZXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudEVkZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjcvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJub2RlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJQdWxsUmVxdWVzdFJldmlld0NvbW1lbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYzLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImF1dGhvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2Mi8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiYXZhdGFyVXJsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2OC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjQvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYzLyo6IGFueSovKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImJvZHlIVE1MXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImJvZHlcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaXNNaW5pbWl6ZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwic3RhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwidmlld2VyQ2FuUmVhY3RcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwidmlld2VyQ2FuVXBkYXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInBhdGhcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicG9zaXRpb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY3JlYXRlZEF0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImxhc3RFZGl0ZWRBdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2NC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJhdXRob3JBc3NvY2lhdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJyZWFjdGlvbkdyb3Vwc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUmVhY3Rpb25Hcm91cFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjb250ZW50XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ2aWV3ZXJIYXNSZWFjdGVkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ1c2Vyc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUmVhY3RpbmdVc2VyQ29ubmVjdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwidG90YWxDb3VudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYyLyo6IGFueSovKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEhhbmRsZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjb21tZW50c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiAodjkvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaGFuZGxlXCI6IFwiY29ubmVjdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2V5XCI6IFwiUmV2aWV3Q29tbWVudHNBY2N1bXVsYXRvcl9jb21tZW50c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZmlsdGVyc1wiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh2Mi8qOiBhbnkqLylcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRIYW5kbGVcIixcbiAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicmV2aWV3VGhyZWFkc1wiLFxuICAgICAgICAgICAgICAgIFwiYXJnc1wiOiAodjUvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgIFwiaGFuZGxlXCI6IFwiY29ubmVjdGlvblwiLFxuICAgICAgICAgICAgICAgIFwia2V5XCI6IFwiUmV2aWV3VGhyZWFkc0FjY3VtdWxhdG9yX3Jldmlld1RocmVhZHNcIixcbiAgICAgICAgICAgICAgICBcImZpbHRlcnNcIjogbnVsbFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9LFxuICBcInBhcmFtc1wiOiB7XG4gICAgXCJvcGVyYXRpb25LaW5kXCI6IFwicXVlcnlcIixcbiAgICBcIm5hbWVcIjogXCJyZXZpZXdUaHJlYWRzQWNjdW11bGF0b3JRdWVyeVwiLFxuICAgIFwiaWRcIjogbnVsbCxcbiAgICBcInRleHRcIjogXCJxdWVyeSByZXZpZXdUaHJlYWRzQWNjdW11bGF0b3JRdWVyeShcXG4gICR1cmw6IFVSSSFcXG4gICR0aHJlYWRDb3VudDogSW50IVxcbiAgJHRocmVhZEN1cnNvcjogU3RyaW5nXFxuICAkY29tbWVudENvdW50OiBJbnQhXFxuKSB7XFxuICByZXNvdXJjZSh1cmw6ICR1cmwpIHtcXG4gICAgX190eXBlbmFtZVxcbiAgICAuLi4gb24gUHVsbFJlcXVlc3Qge1xcbiAgICAgIC4uLnJldmlld1RocmVhZHNBY2N1bXVsYXRvcl9wdWxsUmVxdWVzdF8zZFZWb3dcXG4gICAgfVxcbiAgICAuLi4gb24gTm9kZSB7XFxuICAgICAgaWRcXG4gICAgfVxcbiAgfVxcbn1cXG5cXG5mcmFnbWVudCBlbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXJfcmVhY3RhYmxlIG9uIFJlYWN0YWJsZSB7XFxuICBpZFxcbiAgLi4uZW1vamlSZWFjdGlvbnNWaWV3X3JlYWN0YWJsZVxcbn1cXG5cXG5mcmFnbWVudCBlbW9qaVJlYWN0aW9uc1ZpZXdfcmVhY3RhYmxlIG9uIFJlYWN0YWJsZSB7XFxuICBpZFxcbiAgcmVhY3Rpb25Hcm91cHMge1xcbiAgICBjb250ZW50XFxuICAgIHZpZXdlckhhc1JlYWN0ZWRcXG4gICAgdXNlcnMge1xcbiAgICAgIHRvdGFsQ291bnRcXG4gICAgfVxcbiAgfVxcbiAgdmlld2VyQ2FuUmVhY3RcXG59XFxuXFxuZnJhZ21lbnQgcmV2aWV3Q29tbWVudHNBY2N1bXVsYXRvcl9yZXZpZXdUaHJlYWRfMVVsbndSIG9uIFB1bGxSZXF1ZXN0UmV2aWV3VGhyZWFkIHtcXG4gIGlkXFxuICBjb21tZW50cyhmaXJzdDogJGNvbW1lbnRDb3VudCkge1xcbiAgICBwYWdlSW5mbyB7XFxuICAgICAgaGFzTmV4dFBhZ2VcXG4gICAgICBlbmRDdXJzb3JcXG4gICAgfVxcbiAgICBlZGdlcyB7XFxuICAgICAgY3Vyc29yXFxuICAgICAgbm9kZSB7XFxuICAgICAgICBpZFxcbiAgICAgICAgYXV0aG9yIHtcXG4gICAgICAgICAgX190eXBlbmFtZVxcbiAgICAgICAgICBhdmF0YXJVcmxcXG4gICAgICAgICAgbG9naW5cXG4gICAgICAgICAgdXJsXFxuICAgICAgICAgIC4uLiBvbiBOb2RlIHtcXG4gICAgICAgICAgICBpZFxcbiAgICAgICAgICB9XFxuICAgICAgICB9XFxuICAgICAgICBib2R5SFRNTFxcbiAgICAgICAgYm9keVxcbiAgICAgICAgaXNNaW5pbWl6ZWRcXG4gICAgICAgIHN0YXRlXFxuICAgICAgICB2aWV3ZXJDYW5SZWFjdFxcbiAgICAgICAgdmlld2VyQ2FuVXBkYXRlXFxuICAgICAgICBwYXRoXFxuICAgICAgICBwb3NpdGlvblxcbiAgICAgICAgY3JlYXRlZEF0XFxuICAgICAgICBsYXN0RWRpdGVkQXRcXG4gICAgICAgIHVybFxcbiAgICAgICAgYXV0aG9yQXNzb2NpYXRpb25cXG4gICAgICAgIC4uLmVtb2ppUmVhY3Rpb25zQ29udHJvbGxlcl9yZWFjdGFibGVcXG4gICAgICAgIF9fdHlwZW5hbWVcXG4gICAgICB9XFxuICAgIH1cXG4gIH1cXG59XFxuXFxuZnJhZ21lbnQgcmV2aWV3VGhyZWFkc0FjY3VtdWxhdG9yX3B1bGxSZXF1ZXN0XzNkVlZvdyBvbiBQdWxsUmVxdWVzdCB7XFxuICB1cmxcXG4gIHJldmlld1RocmVhZHMoZmlyc3Q6ICR0aHJlYWRDb3VudCwgYWZ0ZXI6ICR0aHJlYWRDdXJzb3IpIHtcXG4gICAgcGFnZUluZm8ge1xcbiAgICAgIGhhc05leHRQYWdlXFxuICAgICAgZW5kQ3Vyc29yXFxuICAgIH1cXG4gICAgZWRnZXMge1xcbiAgICAgIGN1cnNvclxcbiAgICAgIG5vZGUge1xcbiAgICAgICAgaWRcXG4gICAgICAgIGlzUmVzb2x2ZWRcXG4gICAgICAgIHJlc29sdmVkQnkge1xcbiAgICAgICAgICBsb2dpblxcbiAgICAgICAgICBpZFxcbiAgICAgICAgfVxcbiAgICAgICAgdmlld2VyQ2FuUmVzb2x2ZVxcbiAgICAgICAgdmlld2VyQ2FuVW5yZXNvbHZlXFxuICAgICAgICAuLi5yZXZpZXdDb21tZW50c0FjY3VtdWxhdG9yX3Jldmlld1RocmVhZF8xVWxud1JcXG4gICAgICAgIF9fdHlwZW5hbWVcXG4gICAgICB9XFxuICAgIH1cXG4gIH1cXG59XFxuXCIsXG4gICAgXCJtZXRhZGF0YVwiOiB7fVxuICB9XG59O1xufSkoKTtcbi8vIHByZXR0aWVyLWlnbm9yZVxuKG5vZGUvKjogYW55Ki8pLmhhc2ggPSAnZTc5YWZhNDI4OTJhZDUwOGFmM2IyMmNhOTExY2Q3YzUnO1xubW9kdWxlLmV4cG9ydHMgPSBub2RlO1xuIl19