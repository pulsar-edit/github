/**
 * @flow
 * @relayHash f294a17e7a12256bf4437f6cb9f06f80
 */

/* eslint-disable */
'use strict';
/*::
import type { ConcreteRequest } from 'relay-runtime';
type aggregatedReviewsContainer_pullRequest$ref = any;
type prCheckoutController_pullRequest$ref = any;
export type aggregatedReviewsContainerRefetchQueryVariables = {|
  prId: string,
  reviewCount: number,
  reviewCursor?: ?string,
  threadCount: number,
  threadCursor?: ?string,
  commentCount: number,
  commentCursor?: ?string,
|};
export type aggregatedReviewsContainerRefetchQueryResponse = {|
  +pullRequest: ?{|
    +$fragmentRefs: prCheckoutController_pullRequest$ref & aggregatedReviewsContainer_pullRequest$ref
  |}
|};
export type aggregatedReviewsContainerRefetchQuery = {|
  variables: aggregatedReviewsContainerRefetchQueryVariables,
  response: aggregatedReviewsContainerRefetchQueryResponse,
|};
*/

/*
query aggregatedReviewsContainerRefetchQuery(
  $prId: ID!
  $reviewCount: Int!
  $reviewCursor: String
  $threadCount: Int!
  $threadCursor: String
  $commentCount: Int!
  $commentCursor: String
) {
  pullRequest: node(id: $prId) {
    __typename
    ...prCheckoutController_pullRequest
    ...aggregatedReviewsContainer_pullRequest_qdneZ
    id
  }
}

fragment aggregatedReviewsContainer_pullRequest_qdneZ on PullRequest {
  id
  ...reviewSummariesAccumulator_pullRequest_2zzc96
  ...reviewThreadsAccumulator_pullRequest_CKDvj
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

fragment prCheckoutController_pullRequest on PullRequest {
  number
  headRefName
  headRepository {
    name
    url
    sshUrl
    owner {
      __typename
      login
      id
    }
    id
  }
}

fragment reviewCommentsAccumulator_reviewThread_1VbUmL on PullRequestReviewThread {
  id
  comments(first: $commentCount, after: $commentCursor) {
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

fragment reviewSummariesAccumulator_pullRequest_2zzc96 on PullRequest {
  url
  reviews(first: $reviewCount, after: $reviewCursor) {
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      cursor
      node {
        id
        body
        bodyHTML
        state
        submittedAt
        lastEditedAt
        url
        author {
          __typename
          login
          avatarUrl
          url
          ... on Node {
            id
          }
        }
        viewerCanUpdate
        authorAssociation
        ...emojiReactionsController_reactable
        __typename
      }
    }
  }
}

fragment reviewThreadsAccumulator_pullRequest_CKDvj on PullRequest {
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
        ...reviewCommentsAccumulator_reviewThread_1VbUmL
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
    "name": "prId",
    "type": "ID!",
    "defaultValue": null
  }, {
    "kind": "LocalArgument",
    "name": "reviewCount",
    "type": "Int!",
    "defaultValue": null
  }, {
    "kind": "LocalArgument",
    "name": "reviewCursor",
    "type": "String",
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
  }, {
    "kind": "LocalArgument",
    "name": "commentCursor",
    "type": "String",
    "defaultValue": null
  }],
      v1 = [{
    "kind": "Variable",
    "name": "id",
    "variableName": "prId"
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
      v5 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "login",
    "args": null,
    "storageKey": null
  },
      v6 = [{
    "kind": "Variable",
    "name": "after",
    "variableName": "reviewCursor"
  }, {
    "kind": "Variable",
    "name": "first",
    "variableName": "reviewCount"
  }],
      v7 = {
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
      v8 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "cursor",
    "args": null,
    "storageKey": null
  },
      v9 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "body",
    "args": null,
    "storageKey": null
  },
      v10 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "bodyHTML",
    "args": null,
    "storageKey": null
  },
      v11 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "state",
    "args": null,
    "storageKey": null
  },
      v12 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "lastEditedAt",
    "args": null,
    "storageKey": null
  },
      v13 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "avatarUrl",
    "args": null,
    "storageKey": null
  },
      v14 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "viewerCanUpdate",
    "args": null,
    "storageKey": null
  },
      v15 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "authorAssociation",
    "args": null,
    "storageKey": null
  },
      v16 = {
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
  },
      v17 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "viewerCanReact",
    "args": null,
    "storageKey": null
  },
      v18 = [{
    "kind": "Variable",
    "name": "after",
    "variableName": "threadCursor"
  }, {
    "kind": "Variable",
    "name": "first",
    "variableName": "threadCount"
  }],
      v19 = [{
    "kind": "Variable",
    "name": "after",
    "variableName": "commentCursor"
  }, {
    "kind": "Variable",
    "name": "first",
    "variableName": "commentCount"
  }];
  return {
    "kind": "Request",
    "fragment": {
      "kind": "Fragment",
      "name": "aggregatedReviewsContainerRefetchQuery",
      "type": "Query",
      "metadata": null,
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": [{
        "kind": "LinkedField",
        "alias": "pullRequest",
        "name": "node",
        "storageKey": null,
        "args": v1
        /*: any*/
        ,
        "concreteType": null,
        "plural": false,
        "selections": [{
          "kind": "FragmentSpread",
          "name": "prCheckoutController_pullRequest",
          "args": null
        }, {
          "kind": "FragmentSpread",
          "name": "aggregatedReviewsContainer_pullRequest",
          "args": [{
            "kind": "Variable",
            "name": "commentCount",
            "variableName": "commentCount"
          }, {
            "kind": "Variable",
            "name": "commentCursor",
            "variableName": "commentCursor"
          }, {
            "kind": "Variable",
            "name": "reviewCount",
            "variableName": "reviewCount"
          }, {
            "kind": "Variable",
            "name": "reviewCursor",
            "variableName": "reviewCursor"
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
    },
    "operation": {
      "kind": "Operation",
      "name": "aggregatedReviewsContainerRefetchQuery",
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": [{
        "kind": "LinkedField",
        "alias": "pullRequest",
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
            "kind": "ScalarField",
            "alias": null,
            "name": "number",
            "args": null,
            "storageKey": null
          }, {
            "kind": "ScalarField",
            "alias": null,
            "name": "headRefName",
            "args": null,
            "storageKey": null
          }, {
            "kind": "LinkedField",
            "alias": null,
            "name": "headRepository",
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
            }, v4
            /*: any*/
            , {
              "kind": "ScalarField",
              "alias": null,
              "name": "sshUrl",
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
              , v5
              /*: any*/
              , v3
              /*: any*/
              ]
            }, v3
            /*: any*/
            ]
          }, v4
          /*: any*/
          , {
            "kind": "LinkedField",
            "alias": null,
            "name": "reviews",
            "storageKey": null,
            "args": v6
            /*: any*/
            ,
            "concreteType": "PullRequestReviewConnection",
            "plural": false,
            "selections": [v7
            /*: any*/
            , {
              "kind": "LinkedField",
              "alias": null,
              "name": "edges",
              "storageKey": null,
              "args": null,
              "concreteType": "PullRequestReviewEdge",
              "plural": true,
              "selections": [v8
              /*: any*/
              , {
                "kind": "LinkedField",
                "alias": null,
                "name": "node",
                "storageKey": null,
                "args": null,
                "concreteType": "PullRequestReview",
                "plural": false,
                "selections": [v3
                /*: any*/
                , v9
                /*: any*/
                , v10
                /*: any*/
                , v11
                /*: any*/
                , {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "submittedAt",
                  "args": null,
                  "storageKey": null
                }, v12
                /*: any*/
                , v4
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
                  , v5
                  /*: any*/
                  , v13
                  /*: any*/
                  , v4
                  /*: any*/
                  , v3
                  /*: any*/
                  ]
                }, v14
                /*: any*/
                , v15
                /*: any*/
                , v16
                /*: any*/
                , v17
                /*: any*/
                , v2
                /*: any*/
                ]
              }]
            }]
          }, {
            "kind": "LinkedHandle",
            "alias": null,
            "name": "reviews",
            "args": v6
            /*: any*/
            ,
            "handle": "connection",
            "key": "ReviewSummariesAccumulator_reviews",
            "filters": null
          }, {
            "kind": "LinkedField",
            "alias": null,
            "name": "reviewThreads",
            "storageKey": null,
            "args": v18
            /*: any*/
            ,
            "concreteType": "PullRequestReviewThreadConnection",
            "plural": false,
            "selections": [v7
            /*: any*/
            , {
              "kind": "LinkedField",
              "alias": null,
              "name": "edges",
              "storageKey": null,
              "args": null,
              "concreteType": "PullRequestReviewThreadEdge",
              "plural": true,
              "selections": [v8
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
                  "selections": [v5
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
                  "args": v19
                  /*: any*/
                  ,
                  "concreteType": "PullRequestReviewCommentConnection",
                  "plural": false,
                  "selections": [v7
                  /*: any*/
                  , {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "edges",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "PullRequestReviewCommentEdge",
                    "plural": true,
                    "selections": [v8
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
                        , v13
                        /*: any*/
                        , v5
                        /*: any*/
                        , v4
                        /*: any*/
                        , v3
                        /*: any*/
                        ]
                      }, v10
                      /*: any*/
                      , v9
                      /*: any*/
                      , {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "isMinimized",
                        "args": null,
                        "storageKey": null
                      }, v11
                      /*: any*/
                      , v17
                      /*: any*/
                      , v14
                      /*: any*/
                      , {
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
                      }, v12
                      /*: any*/
                      , v4
                      /*: any*/
                      , v15
                      /*: any*/
                      , v16
                      /*: any*/
                      , v2
                      /*: any*/
                      ]
                    }]
                  }]
                }, {
                  "kind": "LinkedHandle",
                  "alias": null,
                  "name": "comments",
                  "args": v19
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
            "args": v18
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
      "name": "aggregatedReviewsContainerRefetchQuery",
      "id": null,
      "text": "query aggregatedReviewsContainerRefetchQuery(\n  $prId: ID!\n  $reviewCount: Int!\n  $reviewCursor: String\n  $threadCount: Int!\n  $threadCursor: String\n  $commentCount: Int!\n  $commentCursor: String\n) {\n  pullRequest: node(id: $prId) {\n    __typename\n    ...prCheckoutController_pullRequest\n    ...aggregatedReviewsContainer_pullRequest_qdneZ\n    id\n  }\n}\n\nfragment aggregatedReviewsContainer_pullRequest_qdneZ on PullRequest {\n  id\n  ...reviewSummariesAccumulator_pullRequest_2zzc96\n  ...reviewThreadsAccumulator_pullRequest_CKDvj\n}\n\nfragment emojiReactionsController_reactable on Reactable {\n  id\n  ...emojiReactionsView_reactable\n}\n\nfragment emojiReactionsView_reactable on Reactable {\n  id\n  reactionGroups {\n    content\n    viewerHasReacted\n    users {\n      totalCount\n    }\n  }\n  viewerCanReact\n}\n\nfragment prCheckoutController_pullRequest on PullRequest {\n  number\n  headRefName\n  headRepository {\n    name\n    url\n    sshUrl\n    owner {\n      __typename\n      login\n      id\n    }\n    id\n  }\n}\n\nfragment reviewCommentsAccumulator_reviewThread_1VbUmL on PullRequestReviewThread {\n  id\n  comments(first: $commentCount, after: $commentCursor) {\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n    edges {\n      cursor\n      node {\n        id\n        author {\n          __typename\n          avatarUrl\n          login\n          url\n          ... on Node {\n            id\n          }\n        }\n        bodyHTML\n        body\n        isMinimized\n        state\n        viewerCanReact\n        viewerCanUpdate\n        path\n        position\n        createdAt\n        lastEditedAt\n        url\n        authorAssociation\n        ...emojiReactionsController_reactable\n        __typename\n      }\n    }\n  }\n}\n\nfragment reviewSummariesAccumulator_pullRequest_2zzc96 on PullRequest {\n  url\n  reviews(first: $reviewCount, after: $reviewCursor) {\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n    edges {\n      cursor\n      node {\n        id\n        body\n        bodyHTML\n        state\n        submittedAt\n        lastEditedAt\n        url\n        author {\n          __typename\n          login\n          avatarUrl\n          url\n          ... on Node {\n            id\n          }\n        }\n        viewerCanUpdate\n        authorAssociation\n        ...emojiReactionsController_reactable\n        __typename\n      }\n    }\n  }\n}\n\nfragment reviewThreadsAccumulator_pullRequest_CKDvj on PullRequest {\n  url\n  reviewThreads(first: $threadCount, after: $threadCursor) {\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n    edges {\n      cursor\n      node {\n        id\n        isResolved\n        resolvedBy {\n          login\n          id\n        }\n        viewerCanResolve\n        viewerCanUnresolve\n        ...reviewCommentsAccumulator_reviewThread_1VbUmL\n        __typename\n      }\n    }\n  }\n}\n",
      "metadata": {}
    }
  };
}(); // prettier-ignore


node
/*: any*/
.hash = '2bf1bb4fa69d264bcecbe81f41621908';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9jb250YWluZXJzL19fZ2VuZXJhdGVkX18vYWdncmVnYXRlZFJldmlld3NDb250YWluZXJSZWZldGNoUXVlcnkuZ3JhcGhxbC5qcyJdLCJuYW1lcyI6WyJub2RlIiwidjAiLCJ2MSIsInYyIiwidjMiLCJ2NCIsInY1IiwidjYiLCJ2NyIsInY4IiwidjkiLCJ2MTAiLCJ2MTEiLCJ2MTIiLCJ2MTMiLCJ2MTQiLCJ2MTUiLCJ2MTYiLCJ2MTciLCJ2MTgiLCJ2MTkiLCJoYXNoIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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SUFGWDtBQUdFLG9CQUFRLGVBSFY7QUFJRSxvQkFBU2dCO0FBQUc7QUFKZDtBQUtFLHNCQUFVLFlBTFo7QUFNRSxtQkFBTyx3Q0FOVDtBQU9FLHVCQUFXO0FBUGIsV0FqVFk7QUFIaEIsU0FIWTtBQVJoQixPQURZO0FBSkgsS0EvRFI7QUFrWkwsY0FBVTtBQUNSLHVCQUFpQixPQURUO0FBRVIsY0FBUSx3Q0FGQTtBQUdSLFlBQU0sSUFIRTtBQUlSLGNBQVEsbTRGQUpBO0FBS1Isa0JBQVk7QUFMSjtBQWxaTCxHQUFQO0FBMFpDLENBanBCaUMsRUFBbEMsQyxDQWtwQkE7OztBQUNDbkI7QUFBSTtBQUFMLENBQWdCcUIsSUFBaEIsR0FBdUIsa0NBQXZCO0FBQ0FDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQnZCLElBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmxvd1xuICogQHJlbGF5SGFzaCBmMjk0YTE3ZTdhMTIyNTZiZjQ0MzdmNmNiOWYwNmY4MFxuICovXG5cbi8qIGVzbGludC1kaXNhYmxlICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyo6OlxuaW1wb3J0IHR5cGUgeyBDb25jcmV0ZVJlcXVlc3QgfSBmcm9tICdyZWxheS1ydW50aW1lJztcbnR5cGUgYWdncmVnYXRlZFJldmlld3NDb250YWluZXJfcHVsbFJlcXVlc3QkcmVmID0gYW55O1xudHlwZSBwckNoZWNrb3V0Q29udHJvbGxlcl9wdWxsUmVxdWVzdCRyZWYgPSBhbnk7XG5leHBvcnQgdHlwZSBhZ2dyZWdhdGVkUmV2aWV3c0NvbnRhaW5lclJlZmV0Y2hRdWVyeVZhcmlhYmxlcyA9IHt8XG4gIHBySWQ6IHN0cmluZyxcbiAgcmV2aWV3Q291bnQ6IG51bWJlcixcbiAgcmV2aWV3Q3Vyc29yPzogP3N0cmluZyxcbiAgdGhyZWFkQ291bnQ6IG51bWJlcixcbiAgdGhyZWFkQ3Vyc29yPzogP3N0cmluZyxcbiAgY29tbWVudENvdW50OiBudW1iZXIsXG4gIGNvbW1lbnRDdXJzb3I/OiA/c3RyaW5nLFxufH07XG5leHBvcnQgdHlwZSBhZ2dyZWdhdGVkUmV2aWV3c0NvbnRhaW5lclJlZmV0Y2hRdWVyeVJlc3BvbnNlID0ge3xcbiAgK3B1bGxSZXF1ZXN0OiA/e3xcbiAgICArJGZyYWdtZW50UmVmczogcHJDaGVja291dENvbnRyb2xsZXJfcHVsbFJlcXVlc3QkcmVmICYgYWdncmVnYXRlZFJldmlld3NDb250YWluZXJfcHVsbFJlcXVlc3QkcmVmXG4gIHx9XG58fTtcbmV4cG9ydCB0eXBlIGFnZ3JlZ2F0ZWRSZXZpZXdzQ29udGFpbmVyUmVmZXRjaFF1ZXJ5ID0ge3xcbiAgdmFyaWFibGVzOiBhZ2dyZWdhdGVkUmV2aWV3c0NvbnRhaW5lclJlZmV0Y2hRdWVyeVZhcmlhYmxlcyxcbiAgcmVzcG9uc2U6IGFnZ3JlZ2F0ZWRSZXZpZXdzQ29udGFpbmVyUmVmZXRjaFF1ZXJ5UmVzcG9uc2UsXG58fTtcbiovXG5cblxuLypcbnF1ZXJ5IGFnZ3JlZ2F0ZWRSZXZpZXdzQ29udGFpbmVyUmVmZXRjaFF1ZXJ5KFxuICAkcHJJZDogSUQhXG4gICRyZXZpZXdDb3VudDogSW50IVxuICAkcmV2aWV3Q3Vyc29yOiBTdHJpbmdcbiAgJHRocmVhZENvdW50OiBJbnQhXG4gICR0aHJlYWRDdXJzb3I6IFN0cmluZ1xuICAkY29tbWVudENvdW50OiBJbnQhXG4gICRjb21tZW50Q3Vyc29yOiBTdHJpbmdcbikge1xuICBwdWxsUmVxdWVzdDogbm9kZShpZDogJHBySWQpIHtcbiAgICBfX3R5cGVuYW1lXG4gICAgLi4ucHJDaGVja291dENvbnRyb2xsZXJfcHVsbFJlcXVlc3RcbiAgICAuLi5hZ2dyZWdhdGVkUmV2aWV3c0NvbnRhaW5lcl9wdWxsUmVxdWVzdF9xZG5lWlxuICAgIGlkXG4gIH1cbn1cblxuZnJhZ21lbnQgYWdncmVnYXRlZFJldmlld3NDb250YWluZXJfcHVsbFJlcXVlc3RfcWRuZVogb24gUHVsbFJlcXVlc3Qge1xuICBpZFxuICAuLi5yZXZpZXdTdW1tYXJpZXNBY2N1bXVsYXRvcl9wdWxsUmVxdWVzdF8yenpjOTZcbiAgLi4ucmV2aWV3VGhyZWFkc0FjY3VtdWxhdG9yX3B1bGxSZXF1ZXN0X0NLRHZqXG59XG5cbmZyYWdtZW50IGVtb2ppUmVhY3Rpb25zQ29udHJvbGxlcl9yZWFjdGFibGUgb24gUmVhY3RhYmxlIHtcbiAgaWRcbiAgLi4uZW1vamlSZWFjdGlvbnNWaWV3X3JlYWN0YWJsZVxufVxuXG5mcmFnbWVudCBlbW9qaVJlYWN0aW9uc1ZpZXdfcmVhY3RhYmxlIG9uIFJlYWN0YWJsZSB7XG4gIGlkXG4gIHJlYWN0aW9uR3JvdXBzIHtcbiAgICBjb250ZW50XG4gICAgdmlld2VySGFzUmVhY3RlZFxuICAgIHVzZXJzIHtcbiAgICAgIHRvdGFsQ291bnRcbiAgICB9XG4gIH1cbiAgdmlld2VyQ2FuUmVhY3Rcbn1cblxuZnJhZ21lbnQgcHJDaGVja291dENvbnRyb2xsZXJfcHVsbFJlcXVlc3Qgb24gUHVsbFJlcXVlc3Qge1xuICBudW1iZXJcbiAgaGVhZFJlZk5hbWVcbiAgaGVhZFJlcG9zaXRvcnkge1xuICAgIG5hbWVcbiAgICB1cmxcbiAgICBzc2hVcmxcbiAgICBvd25lciB7XG4gICAgICBfX3R5cGVuYW1lXG4gICAgICBsb2dpblxuICAgICAgaWRcbiAgICB9XG4gICAgaWRcbiAgfVxufVxuXG5mcmFnbWVudCByZXZpZXdDb21tZW50c0FjY3VtdWxhdG9yX3Jldmlld1RocmVhZF8xVmJVbUwgb24gUHVsbFJlcXVlc3RSZXZpZXdUaHJlYWQge1xuICBpZFxuICBjb21tZW50cyhmaXJzdDogJGNvbW1lbnRDb3VudCwgYWZ0ZXI6ICRjb21tZW50Q3Vyc29yKSB7XG4gICAgcGFnZUluZm8ge1xuICAgICAgaGFzTmV4dFBhZ2VcbiAgICAgIGVuZEN1cnNvclxuICAgIH1cbiAgICBlZGdlcyB7XG4gICAgICBjdXJzb3JcbiAgICAgIG5vZGUge1xuICAgICAgICBpZFxuICAgICAgICBhdXRob3Ige1xuICAgICAgICAgIF9fdHlwZW5hbWVcbiAgICAgICAgICBhdmF0YXJVcmxcbiAgICAgICAgICBsb2dpblxuICAgICAgICAgIHVybFxuICAgICAgICAgIC4uLiBvbiBOb2RlIHtcbiAgICAgICAgICAgIGlkXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJvZHlIVE1MXG4gICAgICAgIGJvZHlcbiAgICAgICAgaXNNaW5pbWl6ZWRcbiAgICAgICAgc3RhdGVcbiAgICAgICAgdmlld2VyQ2FuUmVhY3RcbiAgICAgICAgdmlld2VyQ2FuVXBkYXRlXG4gICAgICAgIHBhdGhcbiAgICAgICAgcG9zaXRpb25cbiAgICAgICAgY3JlYXRlZEF0XG4gICAgICAgIGxhc3RFZGl0ZWRBdFxuICAgICAgICB1cmxcbiAgICAgICAgYXV0aG9yQXNzb2NpYXRpb25cbiAgICAgICAgLi4uZW1vamlSZWFjdGlvbnNDb250cm9sbGVyX3JlYWN0YWJsZVxuICAgICAgICBfX3R5cGVuYW1lXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZyYWdtZW50IHJldmlld1N1bW1hcmllc0FjY3VtdWxhdG9yX3B1bGxSZXF1ZXN0XzJ6emM5NiBvbiBQdWxsUmVxdWVzdCB7XG4gIHVybFxuICByZXZpZXdzKGZpcnN0OiAkcmV2aWV3Q291bnQsIGFmdGVyOiAkcmV2aWV3Q3Vyc29yKSB7XG4gICAgcGFnZUluZm8ge1xuICAgICAgaGFzTmV4dFBhZ2VcbiAgICAgIGVuZEN1cnNvclxuICAgIH1cbiAgICBlZGdlcyB7XG4gICAgICBjdXJzb3JcbiAgICAgIG5vZGUge1xuICAgICAgICBpZFxuICAgICAgICBib2R5XG4gICAgICAgIGJvZHlIVE1MXG4gICAgICAgIHN0YXRlXG4gICAgICAgIHN1Ym1pdHRlZEF0XG4gICAgICAgIGxhc3RFZGl0ZWRBdFxuICAgICAgICB1cmxcbiAgICAgICAgYXV0aG9yIHtcbiAgICAgICAgICBfX3R5cGVuYW1lXG4gICAgICAgICAgbG9naW5cbiAgICAgICAgICBhdmF0YXJVcmxcbiAgICAgICAgICB1cmxcbiAgICAgICAgICAuLi4gb24gTm9kZSB7XG4gICAgICAgICAgICBpZFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2aWV3ZXJDYW5VcGRhdGVcbiAgICAgICAgYXV0aG9yQXNzb2NpYXRpb25cbiAgICAgICAgLi4uZW1vamlSZWFjdGlvbnNDb250cm9sbGVyX3JlYWN0YWJsZVxuICAgICAgICBfX3R5cGVuYW1lXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZyYWdtZW50IHJldmlld1RocmVhZHNBY2N1bXVsYXRvcl9wdWxsUmVxdWVzdF9DS0R2aiBvbiBQdWxsUmVxdWVzdCB7XG4gIHVybFxuICByZXZpZXdUaHJlYWRzKGZpcnN0OiAkdGhyZWFkQ291bnQsIGFmdGVyOiAkdGhyZWFkQ3Vyc29yKSB7XG4gICAgcGFnZUluZm8ge1xuICAgICAgaGFzTmV4dFBhZ2VcbiAgICAgIGVuZEN1cnNvclxuICAgIH1cbiAgICBlZGdlcyB7XG4gICAgICBjdXJzb3JcbiAgICAgIG5vZGUge1xuICAgICAgICBpZFxuICAgICAgICBpc1Jlc29sdmVkXG4gICAgICAgIHJlc29sdmVkQnkge1xuICAgICAgICAgIGxvZ2luXG4gICAgICAgICAgaWRcbiAgICAgICAgfVxuICAgICAgICB2aWV3ZXJDYW5SZXNvbHZlXG4gICAgICAgIHZpZXdlckNhblVucmVzb2x2ZVxuICAgICAgICAuLi5yZXZpZXdDb21tZW50c0FjY3VtdWxhdG9yX3Jldmlld1RocmVhZF8xVmJVbUxcbiAgICAgICAgX190eXBlbmFtZVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuKi9cblxuY29uc3Qgbm9kZS8qOiBDb25jcmV0ZVJlcXVlc3QqLyA9IChmdW5jdGlvbigpe1xudmFyIHYwID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgIFwibmFtZVwiOiBcInBySWRcIixcbiAgICBcInR5cGVcIjogXCJJRCFcIixcbiAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gIH0sXG4gIHtcbiAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwicmV2aWV3Q291bnRcIixcbiAgICBcInR5cGVcIjogXCJJbnQhXCIsXG4gICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICB9LFxuICB7XG4gICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgIFwibmFtZVwiOiBcInJldmlld0N1cnNvclwiLFxuICAgIFwidHlwZVwiOiBcIlN0cmluZ1wiLFxuICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgfSxcbiAge1xuICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICBcIm5hbWVcIjogXCJ0aHJlYWRDb3VudFwiLFxuICAgIFwidHlwZVwiOiBcIkludCFcIixcbiAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gIH0sXG4gIHtcbiAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwidGhyZWFkQ3Vyc29yXCIsXG4gICAgXCJ0eXBlXCI6IFwiU3RyaW5nXCIsXG4gICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICB9LFxuICB7XG4gICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgIFwibmFtZVwiOiBcImNvbW1lbnRDb3VudFwiLFxuICAgIFwidHlwZVwiOiBcIkludCFcIixcbiAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gIH0sXG4gIHtcbiAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwiY29tbWVudEN1cnNvclwiLFxuICAgIFwidHlwZVwiOiBcIlN0cmluZ1wiLFxuICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgfVxuXSxcbnYxID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICBcIm5hbWVcIjogXCJpZFwiLFxuICAgIFwidmFyaWFibGVOYW1lXCI6IFwicHJJZFwiXG4gIH1cbl0sXG52MiA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJfX3R5cGVuYW1lXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnYzID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcImlkXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnY0ID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcInVybFwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52NSA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJsb2dpblwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52NiA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgXCJuYW1lXCI6IFwiYWZ0ZXJcIixcbiAgICBcInZhcmlhYmxlTmFtZVwiOiBcInJldmlld0N1cnNvclwiXG4gIH0sXG4gIHtcbiAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgIFwibmFtZVwiOiBcImZpcnN0XCIsXG4gICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJyZXZpZXdDb3VudFwiXG4gIH1cbl0sXG52NyA9IHtcbiAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJwYWdlSW5mb1wiLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwiY29uY3JldGVUeXBlXCI6IFwiUGFnZUluZm9cIixcbiAgXCJwbHVyYWxcIjogZmFsc2UsXG4gIFwic2VsZWN0aW9uc1wiOiBbXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcImhhc05leHRQYWdlXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwiZW5kQ3Vyc29yXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfVxuICBdXG59LFxudjggPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiY3Vyc29yXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnY5ID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcImJvZHlcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjEwID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcImJvZHlIVE1MXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnYxMSA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJzdGF0ZVwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52MTIgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwibGFzdEVkaXRlZEF0XCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnYxMyA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJhdmF0YXJVcmxcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjE0ID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcInZpZXdlckNhblVwZGF0ZVwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52MTUgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiYXV0aG9yQXNzb2NpYXRpb25cIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjE2ID0ge1xuICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcInJlYWN0aW9uR3JvdXBzXCIsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJjb25jcmV0ZVR5cGVcIjogXCJSZWFjdGlvbkdyb3VwXCIsXG4gIFwicGx1cmFsXCI6IHRydWUsXG4gIFwic2VsZWN0aW9uc1wiOiBbXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcImNvbnRlbnRcIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJ2aWV3ZXJIYXNSZWFjdGVkXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwidXNlcnNcIixcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlJlYWN0aW5nVXNlckNvbm5lY3Rpb25cIixcbiAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgIFwibmFtZVwiOiBcInRvdGFsQ291bnRcIixcbiAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICBdXG59LFxudjE3ID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcInZpZXdlckNhblJlYWN0XCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnYxOCA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgXCJuYW1lXCI6IFwiYWZ0ZXJcIixcbiAgICBcInZhcmlhYmxlTmFtZVwiOiBcInRocmVhZEN1cnNvclwiXG4gIH0sXG4gIHtcbiAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgIFwibmFtZVwiOiBcImZpcnN0XCIsXG4gICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJ0aHJlYWRDb3VudFwiXG4gIH1cbl0sXG52MTkgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgIFwibmFtZVwiOiBcImFmdGVyXCIsXG4gICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJjb21tZW50Q3Vyc29yXCJcbiAgfSxcbiAge1xuICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgXCJuYW1lXCI6IFwiZmlyc3RcIixcbiAgICBcInZhcmlhYmxlTmFtZVwiOiBcImNvbW1lbnRDb3VudFwiXG4gIH1cbl07XG5yZXR1cm4ge1xuICBcImtpbmRcIjogXCJSZXF1ZXN0XCIsXG4gIFwiZnJhZ21lbnRcIjoge1xuICAgIFwia2luZFwiOiBcIkZyYWdtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwiYWdncmVnYXRlZFJldmlld3NDb250YWluZXJSZWZldGNoUXVlcnlcIixcbiAgICBcInR5cGVcIjogXCJRdWVyeVwiLFxuICAgIFwibWV0YWRhdGFcIjogbnVsbCxcbiAgICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogKHYwLyo6IGFueSovKSxcbiAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAge1xuICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICBcImFsaWFzXCI6IFwicHVsbFJlcXVlc3RcIixcbiAgICAgICAgXCJuYW1lXCI6IFwibm9kZVwiLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgXCJhcmdzXCI6ICh2MS8qOiBhbnkqLyksXG4gICAgICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIkZyYWdtZW50U3ByZWFkXCIsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJwckNoZWNrb3V0Q29udHJvbGxlcl9wdWxsUmVxdWVzdFwiLFxuICAgICAgICAgICAgXCJhcmdzXCI6IG51bGxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIkZyYWdtZW50U3ByZWFkXCIsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJhZ2dyZWdhdGVkUmV2aWV3c0NvbnRhaW5lcl9wdWxsUmVxdWVzdFwiLFxuICAgICAgICAgICAgXCJhcmdzXCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY29tbWVudENvdW50XCIsXG4gICAgICAgICAgICAgICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJjb21tZW50Q291bnRcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjb21tZW50Q3Vyc29yXCIsXG4gICAgICAgICAgICAgICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJjb21tZW50Q3Vyc29yXCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicmV2aWV3Q291bnRcIixcbiAgICAgICAgICAgICAgICBcInZhcmlhYmxlTmFtZVwiOiBcInJldmlld0NvdW50XCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicmV2aWV3Q3Vyc29yXCIsXG4gICAgICAgICAgICAgICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJyZXZpZXdDdXJzb3JcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ0aHJlYWRDb3VudFwiLFxuICAgICAgICAgICAgICAgIFwidmFyaWFibGVOYW1lXCI6IFwidGhyZWFkQ291bnRcIlxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ0aHJlYWRDdXJzb3JcIixcbiAgICAgICAgICAgICAgICBcInZhcmlhYmxlTmFtZVwiOiBcInRocmVhZEN1cnNvclwiXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIFwib3BlcmF0aW9uXCI6IHtcbiAgICBcImtpbmRcIjogXCJPcGVyYXRpb25cIixcbiAgICBcIm5hbWVcIjogXCJhZ2dyZWdhdGVkUmV2aWV3c0NvbnRhaW5lclJlZmV0Y2hRdWVyeVwiLFxuICAgIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiAodjAvKjogYW55Ki8pLFxuICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgIFwiYWxpYXNcIjogXCJwdWxsUmVxdWVzdFwiLFxuICAgICAgICBcIm5hbWVcIjogXCJub2RlXCIsXG4gICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICBcImFyZ3NcIjogKHYxLyo6IGFueSovKSxcbiAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgKHYyLyo6IGFueSovKSxcbiAgICAgICAgICAodjMvKjogYW55Ki8pLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIklubGluZUZyYWdtZW50XCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJQdWxsUmVxdWVzdFwiLFxuICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm51bWJlclwiLFxuICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJoZWFkUmVmTmFtZVwiLFxuICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJoZWFkUmVwb3NpdG9yeVwiLFxuICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUmVwb3NpdG9yeVwiLFxuICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAodjQvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInNzaFVybFwiLFxuICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwib3duZXJcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAodjIvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICh2NS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgKHYzLyo6IGFueSovKVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgKHYzLyo6IGFueSovKVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgKHY0Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInJldmlld3NcIixcbiAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcImFyZ3NcIjogKHY2Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlB1bGxSZXF1ZXN0UmV2aWV3Q29ubmVjdGlvblwiLFxuICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAodjcvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImVkZ2VzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJQdWxsUmVxdWVzdFJldmlld0VkZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAodjgvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJub2RlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJQdWxsUmVxdWVzdFJldmlld1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAodjMvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAodjkvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAodjEwLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHYxMS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJzdWJtaXR0ZWRBdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh2MTIvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAodjQvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiYXV0aG9yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYyLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2NS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjEzLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2NC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjMvKjogYW55Ki8pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAodjE0Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHYxNS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh2MTYvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAodjE3Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHYyLyo6IGFueSovKVxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEhhbmRsZVwiLFxuICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJyZXZpZXdzXCIsXG4gICAgICAgICAgICAgICAgXCJhcmdzXCI6ICh2Ni8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgXCJoYW5kbGVcIjogXCJjb25uZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJrZXlcIjogXCJSZXZpZXdTdW1tYXJpZXNBY2N1bXVsYXRvcl9yZXZpZXdzXCIsXG4gICAgICAgICAgICAgICAgXCJmaWx0ZXJzXCI6IG51bGxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInJldmlld1RocmVhZHNcIixcbiAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcImFyZ3NcIjogKHYxOC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJQdWxsUmVxdWVzdFJldmlld1RocmVhZENvbm5lY3Rpb25cIixcbiAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgKHY3Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJlZGdlc1wiLFxuICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUHVsbFJlcXVlc3RSZXZpZXdUaHJlYWRFZGdlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgKHY4Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibm9kZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUHVsbFJlcXVlc3RSZXZpZXdUaHJlYWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHYzLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImlzUmVzb2x2ZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicmVzb2x2ZWRCeVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiVXNlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjUvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYzLyo6IGFueSovKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInZpZXdlckNhblJlc29sdmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwidmlld2VyQ2FuVW5yZXNvbHZlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbW1lbnRzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6ICh2MTkvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUHVsbFJlcXVlc3RSZXZpZXdDb21tZW50Q29ubmVjdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjcvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImVkZ2VzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJQdWxsUmVxdWVzdFJldmlld0NvbW1lbnRFZGdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY4Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibm9kZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUHVsbFJlcXVlc3RSZXZpZXdDb21tZW50XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2My8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJhdXRob3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjIvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYxMy8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjUvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY0Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2My8qOiBhbnkqLylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2MTAvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjkvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaXNNaW5pbWl6ZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjExLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYxNy8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2MTQvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicGF0aFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJwb3NpdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjcmVhdGVkQXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjEyLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY0Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYxNS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2MTYvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjIvKjogYW55Ki8pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkSGFuZGxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbW1lbnRzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6ICh2MTkvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaGFuZGxlXCI6IFwiY29ubmVjdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2V5XCI6IFwiUmV2aWV3Q29tbWVudHNBY2N1bXVsYXRvcl9jb21tZW50c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZmlsdGVyc1wiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh2Mi8qOiBhbnkqLylcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRIYW5kbGVcIixcbiAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicmV2aWV3VGhyZWFkc1wiLFxuICAgICAgICAgICAgICAgIFwiYXJnc1wiOiAodjE4Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICBcImhhbmRsZVwiOiBcImNvbm5lY3Rpb25cIixcbiAgICAgICAgICAgICAgICBcImtleVwiOiBcIlJldmlld1RocmVhZHNBY2N1bXVsYXRvcl9yZXZpZXdUaHJlYWRzXCIsXG4gICAgICAgICAgICAgICAgXCJmaWx0ZXJzXCI6IG51bGxcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAgXCJwYXJhbXNcIjoge1xuICAgIFwib3BlcmF0aW9uS2luZFwiOiBcInF1ZXJ5XCIsXG4gICAgXCJuYW1lXCI6IFwiYWdncmVnYXRlZFJldmlld3NDb250YWluZXJSZWZldGNoUXVlcnlcIixcbiAgICBcImlkXCI6IG51bGwsXG4gICAgXCJ0ZXh0XCI6IFwicXVlcnkgYWdncmVnYXRlZFJldmlld3NDb250YWluZXJSZWZldGNoUXVlcnkoXFxuICAkcHJJZDogSUQhXFxuICAkcmV2aWV3Q291bnQ6IEludCFcXG4gICRyZXZpZXdDdXJzb3I6IFN0cmluZ1xcbiAgJHRocmVhZENvdW50OiBJbnQhXFxuICAkdGhyZWFkQ3Vyc29yOiBTdHJpbmdcXG4gICRjb21tZW50Q291bnQ6IEludCFcXG4gICRjb21tZW50Q3Vyc29yOiBTdHJpbmdcXG4pIHtcXG4gIHB1bGxSZXF1ZXN0OiBub2RlKGlkOiAkcHJJZCkge1xcbiAgICBfX3R5cGVuYW1lXFxuICAgIC4uLnByQ2hlY2tvdXRDb250cm9sbGVyX3B1bGxSZXF1ZXN0XFxuICAgIC4uLmFnZ3JlZ2F0ZWRSZXZpZXdzQ29udGFpbmVyX3B1bGxSZXF1ZXN0X3FkbmVaXFxuICAgIGlkXFxuICB9XFxufVxcblxcbmZyYWdtZW50IGFnZ3JlZ2F0ZWRSZXZpZXdzQ29udGFpbmVyX3B1bGxSZXF1ZXN0X3FkbmVaIG9uIFB1bGxSZXF1ZXN0IHtcXG4gIGlkXFxuICAuLi5yZXZpZXdTdW1tYXJpZXNBY2N1bXVsYXRvcl9wdWxsUmVxdWVzdF8yenpjOTZcXG4gIC4uLnJldmlld1RocmVhZHNBY2N1bXVsYXRvcl9wdWxsUmVxdWVzdF9DS0R2alxcbn1cXG5cXG5mcmFnbWVudCBlbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXJfcmVhY3RhYmxlIG9uIFJlYWN0YWJsZSB7XFxuICBpZFxcbiAgLi4uZW1vamlSZWFjdGlvbnNWaWV3X3JlYWN0YWJsZVxcbn1cXG5cXG5mcmFnbWVudCBlbW9qaVJlYWN0aW9uc1ZpZXdfcmVhY3RhYmxlIG9uIFJlYWN0YWJsZSB7XFxuICBpZFxcbiAgcmVhY3Rpb25Hcm91cHMge1xcbiAgICBjb250ZW50XFxuICAgIHZpZXdlckhhc1JlYWN0ZWRcXG4gICAgdXNlcnMge1xcbiAgICAgIHRvdGFsQ291bnRcXG4gICAgfVxcbiAgfVxcbiAgdmlld2VyQ2FuUmVhY3RcXG59XFxuXFxuZnJhZ21lbnQgcHJDaGVja291dENvbnRyb2xsZXJfcHVsbFJlcXVlc3Qgb24gUHVsbFJlcXVlc3Qge1xcbiAgbnVtYmVyXFxuICBoZWFkUmVmTmFtZVxcbiAgaGVhZFJlcG9zaXRvcnkge1xcbiAgICBuYW1lXFxuICAgIHVybFxcbiAgICBzc2hVcmxcXG4gICAgb3duZXIge1xcbiAgICAgIF9fdHlwZW5hbWVcXG4gICAgICBsb2dpblxcbiAgICAgIGlkXFxuICAgIH1cXG4gICAgaWRcXG4gIH1cXG59XFxuXFxuZnJhZ21lbnQgcmV2aWV3Q29tbWVudHNBY2N1bXVsYXRvcl9yZXZpZXdUaHJlYWRfMVZiVW1MIG9uIFB1bGxSZXF1ZXN0UmV2aWV3VGhyZWFkIHtcXG4gIGlkXFxuICBjb21tZW50cyhmaXJzdDogJGNvbW1lbnRDb3VudCwgYWZ0ZXI6ICRjb21tZW50Q3Vyc29yKSB7XFxuICAgIHBhZ2VJbmZvIHtcXG4gICAgICBoYXNOZXh0UGFnZVxcbiAgICAgIGVuZEN1cnNvclxcbiAgICB9XFxuICAgIGVkZ2VzIHtcXG4gICAgICBjdXJzb3JcXG4gICAgICBub2RlIHtcXG4gICAgICAgIGlkXFxuICAgICAgICBhdXRob3Ige1xcbiAgICAgICAgICBfX3R5cGVuYW1lXFxuICAgICAgICAgIGF2YXRhclVybFxcbiAgICAgICAgICBsb2dpblxcbiAgICAgICAgICB1cmxcXG4gICAgICAgICAgLi4uIG9uIE5vZGUge1xcbiAgICAgICAgICAgIGlkXFxuICAgICAgICAgIH1cXG4gICAgICAgIH1cXG4gICAgICAgIGJvZHlIVE1MXFxuICAgICAgICBib2R5XFxuICAgICAgICBpc01pbmltaXplZFxcbiAgICAgICAgc3RhdGVcXG4gICAgICAgIHZpZXdlckNhblJlYWN0XFxuICAgICAgICB2aWV3ZXJDYW5VcGRhdGVcXG4gICAgICAgIHBhdGhcXG4gICAgICAgIHBvc2l0aW9uXFxuICAgICAgICBjcmVhdGVkQXRcXG4gICAgICAgIGxhc3RFZGl0ZWRBdFxcbiAgICAgICAgdXJsXFxuICAgICAgICBhdXRob3JBc3NvY2lhdGlvblxcbiAgICAgICAgLi4uZW1vamlSZWFjdGlvbnNDb250cm9sbGVyX3JlYWN0YWJsZVxcbiAgICAgICAgX190eXBlbmFtZVxcbiAgICAgIH1cXG4gICAgfVxcbiAgfVxcbn1cXG5cXG5mcmFnbWVudCByZXZpZXdTdW1tYXJpZXNBY2N1bXVsYXRvcl9wdWxsUmVxdWVzdF8yenpjOTYgb24gUHVsbFJlcXVlc3Qge1xcbiAgdXJsXFxuICByZXZpZXdzKGZpcnN0OiAkcmV2aWV3Q291bnQsIGFmdGVyOiAkcmV2aWV3Q3Vyc29yKSB7XFxuICAgIHBhZ2VJbmZvIHtcXG4gICAgICBoYXNOZXh0UGFnZVxcbiAgICAgIGVuZEN1cnNvclxcbiAgICB9XFxuICAgIGVkZ2VzIHtcXG4gICAgICBjdXJzb3JcXG4gICAgICBub2RlIHtcXG4gICAgICAgIGlkXFxuICAgICAgICBib2R5XFxuICAgICAgICBib2R5SFRNTFxcbiAgICAgICAgc3RhdGVcXG4gICAgICAgIHN1Ym1pdHRlZEF0XFxuICAgICAgICBsYXN0RWRpdGVkQXRcXG4gICAgICAgIHVybFxcbiAgICAgICAgYXV0aG9yIHtcXG4gICAgICAgICAgX190eXBlbmFtZVxcbiAgICAgICAgICBsb2dpblxcbiAgICAgICAgICBhdmF0YXJVcmxcXG4gICAgICAgICAgdXJsXFxuICAgICAgICAgIC4uLiBvbiBOb2RlIHtcXG4gICAgICAgICAgICBpZFxcbiAgICAgICAgICB9XFxuICAgICAgICB9XFxuICAgICAgICB2aWV3ZXJDYW5VcGRhdGVcXG4gICAgICAgIGF1dGhvckFzc29jaWF0aW9uXFxuICAgICAgICAuLi5lbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXJfcmVhY3RhYmxlXFxuICAgICAgICBfX3R5cGVuYW1lXFxuICAgICAgfVxcbiAgICB9XFxuICB9XFxufVxcblxcbmZyYWdtZW50IHJldmlld1RocmVhZHNBY2N1bXVsYXRvcl9wdWxsUmVxdWVzdF9DS0R2aiBvbiBQdWxsUmVxdWVzdCB7XFxuICB1cmxcXG4gIHJldmlld1RocmVhZHMoZmlyc3Q6ICR0aHJlYWRDb3VudCwgYWZ0ZXI6ICR0aHJlYWRDdXJzb3IpIHtcXG4gICAgcGFnZUluZm8ge1xcbiAgICAgIGhhc05leHRQYWdlXFxuICAgICAgZW5kQ3Vyc29yXFxuICAgIH1cXG4gICAgZWRnZXMge1xcbiAgICAgIGN1cnNvclxcbiAgICAgIG5vZGUge1xcbiAgICAgICAgaWRcXG4gICAgICAgIGlzUmVzb2x2ZWRcXG4gICAgICAgIHJlc29sdmVkQnkge1xcbiAgICAgICAgICBsb2dpblxcbiAgICAgICAgICBpZFxcbiAgICAgICAgfVxcbiAgICAgICAgdmlld2VyQ2FuUmVzb2x2ZVxcbiAgICAgICAgdmlld2VyQ2FuVW5yZXNvbHZlXFxuICAgICAgICAuLi5yZXZpZXdDb21tZW50c0FjY3VtdWxhdG9yX3Jldmlld1RocmVhZF8xVmJVbUxcXG4gICAgICAgIF9fdHlwZW5hbWVcXG4gICAgICB9XFxuICAgIH1cXG4gIH1cXG59XFxuXCIsXG4gICAgXCJtZXRhZGF0YVwiOiB7fVxuICB9XG59O1xufSkoKTtcbi8vIHByZXR0aWVyLWlnbm9yZVxuKG5vZGUvKjogYW55Ki8pLmhhc2ggPSAnMmJmMWJiNGZhNjlkMjY0YmNlY2JlODFmNDE2MjE5MDgnO1xubW9kdWxlLmV4cG9ydHMgPSBub2RlO1xuIl19