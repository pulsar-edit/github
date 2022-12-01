/**
 * @flow
 * @relayHash 1f2dd1b13010dfeb3407599ff1b7e83a
 */

/* eslint-disable */
'use strict';
/*::
import type { ConcreteRequest } from 'relay-runtime';
type aggregatedReviewsContainer_pullRequest$ref = any;
type reviewsController_pullRequest$ref = any;
type reviewsController_repository$ref = any;
type reviewsController_viewer$ref = any;
export type reviewsContainerQueryVariables = {|
  repoOwner: string,
  repoName: string,
  prNumber: number,
  reviewCount: number,
  reviewCursor?: ?string,
  threadCount: number,
  threadCursor?: ?string,
  commentCount: number,
  commentCursor?: ?string,
|};
export type reviewsContainerQueryResponse = {|
  +repository: ?{|
    +pullRequest: ?{|
      +headRefOid: any,
      +$fragmentRefs: aggregatedReviewsContainer_pullRequest$ref & reviewsController_pullRequest$ref,
    |},
    +$fragmentRefs: reviewsController_repository$ref,
  |},
  +viewer: {|
    +$fragmentRefs: reviewsController_viewer$ref
  |},
|};
export type reviewsContainerQuery = {|
  variables: reviewsContainerQueryVariables,
  response: reviewsContainerQueryResponse,
|};
*/

/*
query reviewsContainerQuery(
  $repoOwner: String!
  $repoName: String!
  $prNumber: Int!
  $reviewCount: Int!
  $reviewCursor: String
  $threadCount: Int!
  $threadCursor: String
  $commentCount: Int!
  $commentCursor: String
) {
  repository(owner: $repoOwner, name: $repoName) {
    ...reviewsController_repository
    pullRequest(number: $prNumber) {
      headRefOid
      ...aggregatedReviewsContainer_pullRequest_qdneZ
      ...reviewsController_pullRequest
      id
    }
    id
  }
  viewer {
    ...reviewsController_viewer
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

fragment prCheckoutController_repository on Repository {
  name
  owner {
    __typename
    login
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

fragment reviewsController_pullRequest on PullRequest {
  id
  ...prCheckoutController_pullRequest
}

fragment reviewsController_repository on Repository {
  ...prCheckoutController_repository
}

fragment reviewsController_viewer on User {
  id
  login
  avatarUrl
}
*/

const node
/*: ConcreteRequest*/
= function () {
  var v0 = [{
    "kind": "LocalArgument",
    "name": "repoOwner",
    "type": "String!",
    "defaultValue": null
  }, {
    "kind": "LocalArgument",
    "name": "repoName",
    "type": "String!",
    "defaultValue": null
  }, {
    "kind": "LocalArgument",
    "name": "prNumber",
    "type": "Int!",
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
    "name": "name",
    "variableName": "repoName"
  }, {
    "kind": "Variable",
    "name": "owner",
    "variableName": "repoOwner"
  }],
      v2 = [{
    "kind": "Variable",
    "name": "number",
    "variableName": "prNumber"
  }],
      v3 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "headRefOid",
    "args": null,
    "storageKey": null
  },
      v4 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "name",
    "args": null,
    "storageKey": null
  },
      v5 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "__typename",
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
    "kind": "ScalarField",
    "alias": null,
    "name": "id",
    "args": null,
    "storageKey": null
  },
      v8 = {
    "kind": "LinkedField",
    "alias": null,
    "name": "owner",
    "storageKey": null,
    "args": null,
    "concreteType": null,
    "plural": false,
    "selections": [v5
    /*: any*/
    , v6
    /*: any*/
    , v7
    /*: any*/
    ]
  },
      v9 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "url",
    "args": null,
    "storageKey": null
  },
      v10 = [{
    "kind": "Variable",
    "name": "after",
    "variableName": "reviewCursor"
  }, {
    "kind": "Variable",
    "name": "first",
    "variableName": "reviewCount"
  }],
      v11 = {
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
      v12 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "cursor",
    "args": null,
    "storageKey": null
  },
      v13 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "body",
    "args": null,
    "storageKey": null
  },
      v14 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "bodyHTML",
    "args": null,
    "storageKey": null
  },
      v15 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "state",
    "args": null,
    "storageKey": null
  },
      v16 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "lastEditedAt",
    "args": null,
    "storageKey": null
  },
      v17 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "avatarUrl",
    "args": null,
    "storageKey": null
  },
      v18 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "viewerCanUpdate",
    "args": null,
    "storageKey": null
  },
      v19 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "authorAssociation",
    "args": null,
    "storageKey": null
  },
      v20 = {
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
      v21 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "viewerCanReact",
    "args": null,
    "storageKey": null
  },
      v22 = [{
    "kind": "Variable",
    "name": "after",
    "variableName": "threadCursor"
  }, {
    "kind": "Variable",
    "name": "first",
    "variableName": "threadCount"
  }],
      v23 = [{
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
      "name": "reviewsContainerQuery",
      "type": "Query",
      "metadata": null,
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "repository",
        "storageKey": null,
        "args": v1
        /*: any*/
        ,
        "concreteType": "Repository",
        "plural": false,
        "selections": [{
          "kind": "LinkedField",
          "alias": null,
          "name": "pullRequest",
          "storageKey": null,
          "args": v2
          /*: any*/
          ,
          "concreteType": "PullRequest",
          "plural": false,
          "selections": [v3
          /*: any*/
          , {
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
          }, {
            "kind": "FragmentSpread",
            "name": "reviewsController_pullRequest",
            "args": null
          }]
        }, {
          "kind": "FragmentSpread",
          "name": "reviewsController_repository",
          "args": null
        }]
      }, {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "User",
        "plural": false,
        "selections": [{
          "kind": "FragmentSpread",
          "name": "reviewsController_viewer",
          "args": null
        }]
      }]
    },
    "operation": {
      "kind": "Operation",
      "name": "reviewsContainerQuery",
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "repository",
        "storageKey": null,
        "args": v1
        /*: any*/
        ,
        "concreteType": "Repository",
        "plural": false,
        "selections": [v4
        /*: any*/
        , v8
        /*: any*/
        , {
          "kind": "LinkedField",
          "alias": null,
          "name": "pullRequest",
          "storageKey": null,
          "args": v2
          /*: any*/
          ,
          "concreteType": "PullRequest",
          "plural": false,
          "selections": [v3
          /*: any*/
          , v7
          /*: any*/
          , v9
          /*: any*/
          , {
            "kind": "LinkedField",
            "alias": null,
            "name": "reviews",
            "storageKey": null,
            "args": v10
            /*: any*/
            ,
            "concreteType": "PullRequestReviewConnection",
            "plural": false,
            "selections": [v11
            /*: any*/
            , {
              "kind": "LinkedField",
              "alias": null,
              "name": "edges",
              "storageKey": null,
              "args": null,
              "concreteType": "PullRequestReviewEdge",
              "plural": true,
              "selections": [v12
              /*: any*/
              , {
                "kind": "LinkedField",
                "alias": null,
                "name": "node",
                "storageKey": null,
                "args": null,
                "concreteType": "PullRequestReview",
                "plural": false,
                "selections": [v7
                /*: any*/
                , v13
                /*: any*/
                , v14
                /*: any*/
                , v15
                /*: any*/
                , {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "submittedAt",
                  "args": null,
                  "storageKey": null
                }, v16
                /*: any*/
                , v9
                /*: any*/
                , {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "author",
                  "storageKey": null,
                  "args": null,
                  "concreteType": null,
                  "plural": false,
                  "selections": [v5
                  /*: any*/
                  , v6
                  /*: any*/
                  , v17
                  /*: any*/
                  , v9
                  /*: any*/
                  , v7
                  /*: any*/
                  ]
                }, v18
                /*: any*/
                , v19
                /*: any*/
                , v20
                /*: any*/
                , v21
                /*: any*/
                , v5
                /*: any*/
                ]
              }]
            }]
          }, {
            "kind": "LinkedHandle",
            "alias": null,
            "name": "reviews",
            "args": v10
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
            "args": v22
            /*: any*/
            ,
            "concreteType": "PullRequestReviewThreadConnection",
            "plural": false,
            "selections": [v11
            /*: any*/
            , {
              "kind": "LinkedField",
              "alias": null,
              "name": "edges",
              "storageKey": null,
              "args": null,
              "concreteType": "PullRequestReviewThreadEdge",
              "plural": true,
              "selections": [v12
              /*: any*/
              , {
                "kind": "LinkedField",
                "alias": null,
                "name": "node",
                "storageKey": null,
                "args": null,
                "concreteType": "PullRequestReviewThread",
                "plural": false,
                "selections": [v7
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
                  "selections": [v6
                  /*: any*/
                  , v7
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
                  "args": v23
                  /*: any*/
                  ,
                  "concreteType": "PullRequestReviewCommentConnection",
                  "plural": false,
                  "selections": [v11
                  /*: any*/
                  , {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "edges",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "PullRequestReviewCommentEdge",
                    "plural": true,
                    "selections": [v12
                    /*: any*/
                    , {
                      "kind": "LinkedField",
                      "alias": null,
                      "name": "node",
                      "storageKey": null,
                      "args": null,
                      "concreteType": "PullRequestReviewComment",
                      "plural": false,
                      "selections": [v7
                      /*: any*/
                      , {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "author",
                        "storageKey": null,
                        "args": null,
                        "concreteType": null,
                        "plural": false,
                        "selections": [v5
                        /*: any*/
                        , v17
                        /*: any*/
                        , v6
                        /*: any*/
                        , v9
                        /*: any*/
                        , v7
                        /*: any*/
                        ]
                      }, v14
                      /*: any*/
                      , v13
                      /*: any*/
                      , {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "isMinimized",
                        "args": null,
                        "storageKey": null
                      }, v15
                      /*: any*/
                      , v21
                      /*: any*/
                      , v18
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
                      }, v16
                      /*: any*/
                      , v9
                      /*: any*/
                      , v19
                      /*: any*/
                      , v20
                      /*: any*/
                      , v5
                      /*: any*/
                      ]
                    }]
                  }]
                }, {
                  "kind": "LinkedHandle",
                  "alias": null,
                  "name": "comments",
                  "args": v23
                  /*: any*/
                  ,
                  "handle": "connection",
                  "key": "ReviewCommentsAccumulator_comments",
                  "filters": null
                }, v5
                /*: any*/
                ]
              }]
            }]
          }, {
            "kind": "LinkedHandle",
            "alias": null,
            "name": "reviewThreads",
            "args": v22
            /*: any*/
            ,
            "handle": "connection",
            "key": "ReviewThreadsAccumulator_reviewThreads",
            "filters": null
          }, {
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
            "selections": [v4
            /*: any*/
            , v9
            /*: any*/
            , {
              "kind": "ScalarField",
              "alias": null,
              "name": "sshUrl",
              "args": null,
              "storageKey": null
            }, v8
            /*: any*/
            , v7
            /*: any*/
            ]
          }]
        }, v7
        /*: any*/
        ]
      }, {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "User",
        "plural": false,
        "selections": [v7
        /*: any*/
        , v6
        /*: any*/
        , v17
        /*: any*/
        ]
      }]
    },
    "params": {
      "operationKind": "query",
      "name": "reviewsContainerQuery",
      "id": null,
      "text": "query reviewsContainerQuery(\n  $repoOwner: String!\n  $repoName: String!\n  $prNumber: Int!\n  $reviewCount: Int!\n  $reviewCursor: String\n  $threadCount: Int!\n  $threadCursor: String\n  $commentCount: Int!\n  $commentCursor: String\n) {\n  repository(owner: $repoOwner, name: $repoName) {\n    ...reviewsController_repository\n    pullRequest(number: $prNumber) {\n      headRefOid\n      ...aggregatedReviewsContainer_pullRequest_qdneZ\n      ...reviewsController_pullRequest\n      id\n    }\n    id\n  }\n  viewer {\n    ...reviewsController_viewer\n    id\n  }\n}\n\nfragment aggregatedReviewsContainer_pullRequest_qdneZ on PullRequest {\n  id\n  ...reviewSummariesAccumulator_pullRequest_2zzc96\n  ...reviewThreadsAccumulator_pullRequest_CKDvj\n}\n\nfragment emojiReactionsController_reactable on Reactable {\n  id\n  ...emojiReactionsView_reactable\n}\n\nfragment emojiReactionsView_reactable on Reactable {\n  id\n  reactionGroups {\n    content\n    viewerHasReacted\n    users {\n      totalCount\n    }\n  }\n  viewerCanReact\n}\n\nfragment prCheckoutController_pullRequest on PullRequest {\n  number\n  headRefName\n  headRepository {\n    name\n    url\n    sshUrl\n    owner {\n      __typename\n      login\n      id\n    }\n    id\n  }\n}\n\nfragment prCheckoutController_repository on Repository {\n  name\n  owner {\n    __typename\n    login\n    id\n  }\n}\n\nfragment reviewCommentsAccumulator_reviewThread_1VbUmL on PullRequestReviewThread {\n  id\n  comments(first: $commentCount, after: $commentCursor) {\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n    edges {\n      cursor\n      node {\n        id\n        author {\n          __typename\n          avatarUrl\n          login\n          url\n          ... on Node {\n            id\n          }\n        }\n        bodyHTML\n        body\n        isMinimized\n        state\n        viewerCanReact\n        viewerCanUpdate\n        path\n        position\n        createdAt\n        lastEditedAt\n        url\n        authorAssociation\n        ...emojiReactionsController_reactable\n        __typename\n      }\n    }\n  }\n}\n\nfragment reviewSummariesAccumulator_pullRequest_2zzc96 on PullRequest {\n  url\n  reviews(first: $reviewCount, after: $reviewCursor) {\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n    edges {\n      cursor\n      node {\n        id\n        body\n        bodyHTML\n        state\n        submittedAt\n        lastEditedAt\n        url\n        author {\n          __typename\n          login\n          avatarUrl\n          url\n          ... on Node {\n            id\n          }\n        }\n        viewerCanUpdate\n        authorAssociation\n        ...emojiReactionsController_reactable\n        __typename\n      }\n    }\n  }\n}\n\nfragment reviewThreadsAccumulator_pullRequest_CKDvj on PullRequest {\n  url\n  reviewThreads(first: $threadCount, after: $threadCursor) {\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n    edges {\n      cursor\n      node {\n        id\n        isResolved\n        resolvedBy {\n          login\n          id\n        }\n        viewerCanResolve\n        viewerCanUnresolve\n        ...reviewCommentsAccumulator_reviewThread_1VbUmL\n        __typename\n      }\n    }\n  }\n}\n\nfragment reviewsController_pullRequest on PullRequest {\n  id\n  ...prCheckoutController_pullRequest\n}\n\nfragment reviewsController_repository on Repository {\n  ...prCheckoutController_repository\n}\n\nfragment reviewsController_viewer on User {\n  id\n  login\n  avatarUrl\n}\n",
      "metadata": {}
    }
  };
}(); // prettier-ignore


node
/*: any*/
.hash = 'b05cc30cb078003afba9bd8c2de989fa';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9jb250YWluZXJzL19fZ2VuZXJhdGVkX18vcmV2aWV3c0NvbnRhaW5lclF1ZXJ5LmdyYXBocWwuanMiXSwibmFtZXMiOlsibm9kZSIsInYwIiwidjEiLCJ2MiIsInYzIiwidjQiLCJ2NSIsInY2IiwidjciLCJ2OCIsInY5IiwidjEwIiwidjExIiwidjEyIiwidjEzIiwidjE0IiwidjE1IiwidjE2IiwidjE3IiwidjE4IiwidjE5IiwidjIwIiwidjIxIiwidjIyIiwidjIzIiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxNQUFNQTtBQUFJO0FBQUEsRUFBeUIsWUFBVTtBQUM3QyxNQUFJQyxFQUFFLEdBQUcsQ0FDUDtBQUNFLFlBQVEsZUFEVjtBQUVFLFlBQVEsV0FGVjtBQUdFLFlBQVEsU0FIVjtBQUlFLG9CQUFnQjtBQUpsQixHQURPLEVBT1A7QUFDRSxZQUFRLGVBRFY7QUFFRSxZQUFRLFVBRlY7QUFHRSxZQUFRLFNBSFY7QUFJRSxvQkFBZ0I7QUFKbEIsR0FQTyxFQWFQO0FBQ0UsWUFBUSxlQURWO0FBRUUsWUFBUSxVQUZWO0FBR0UsWUFBUSxNQUhWO0FBSUUsb0JBQWdCO0FBSmxCLEdBYk8sRUFtQlA7QUFDRSxZQUFRLGVBRFY7QUFFRSxZQUFRLGFBRlY7QUFHRSxZQUFRLE1BSFY7QUFJRSxvQkFBZ0I7QUFKbEIsR0FuQk8sRUF5QlA7QUFDRSxZQUFRLGVBRFY7QUFFRSxZQUFRLGNBRlY7QUFHRSxZQUFRLFFBSFY7QUFJRSxvQkFBZ0I7QUFKbEIsR0F6Qk8sRUErQlA7QUFDRSxZQUFRLGVBRFY7QUFFRSxZQUFRLGFBRlY7QUFHRSxZQUFRLE1BSFY7QUFJRSxvQkFBZ0I7QUFKbEIsR0EvQk8sRUFxQ1A7QUFDRSxZQUFRLGVBRFY7QUFFRSxZQUFRLGNBRlY7QUFHRSxZQUFRLFFBSFY7QUFJRSxvQkFBZ0I7QUFKbEIsR0FyQ08sRUEyQ1A7QUFDRSxZQUFRLGVBRFY7QUFFRSxZQUFRLGNBRlY7QUFHRSxZQUFRLE1BSFY7QUFJRSxvQkFBZ0I7QUFKbEIsR0EzQ08sRUFpRFA7QUFDRSxZQUFRLGVBRFY7QUFFRSxZQUFRLGVBRlY7QUFHRSxZQUFRLFFBSFY7QUFJRSxvQkFBZ0I7QUFKbEIsR0FqRE8sQ0FBVDtBQUFBLE1Bd0RBQyxFQUFFLEdBQUcsQ0FDSDtBQUNFLFlBQVEsVUFEVjtBQUVFLFlBQVEsTUFGVjtBQUdFLG9CQUFnQjtBQUhsQixHQURHLEVBTUg7QUFDRSxZQUFRLFVBRFY7QUFFRSxZQUFRLE9BRlY7QUFHRSxvQkFBZ0I7QUFIbEIsR0FORyxDQXhETDtBQUFBLE1Bb0VBQyxFQUFFLEdBQUcsQ0FDSDtBQUNFLFlBQVEsVUFEVjtBQUVFLFlBQVEsUUFGVjtBQUdFLG9CQUFnQjtBQUhsQixHQURHLENBcEVMO0FBQUEsTUEyRUFDLEVBQUUsR0FBRztBQUNILFlBQVEsYUFETDtBQUVILGFBQVMsSUFGTjtBQUdILFlBQVEsWUFITDtBQUlILFlBQVEsSUFKTDtBQUtILGtCQUFjO0FBTFgsR0EzRUw7QUFBQSxNQWtGQUMsRUFBRSxHQUFHO0FBQ0gsWUFBUSxhQURMO0FBRUgsYUFBUyxJQUZOO0FBR0gsWUFBUSxNQUhMO0FBSUgsWUFBUSxJQUpMO0FBS0gsa0JBQWM7QUFMWCxHQWxGTDtBQUFBLE1BeUZBQyxFQUFFLEdBQUc7QUFDSCxZQUFRLGFBREw7QUFFSCxhQUFTLElBRk47QUFHSCxZQUFRLFlBSEw7QUFJSCxZQUFRLElBSkw7QUFLSCxrQkFBYztBQUxYLEdBekZMO0FBQUEsTUFnR0FDLEVBQUUsR0FBRztBQUNILFlBQVEsYUFETDtBQUVILGFBQVMsSUFGTjtBQUdILFlBQVEsT0FITDtBQUlILFlBQVEsSUFKTDtBQUtILGtCQUFjO0FBTFgsR0FoR0w7QUFBQSxNQXVHQUMsRUFBRSxHQUFHO0FBQ0gsWUFBUSxhQURMO0FBRUgsYUFBUyxJQUZOO0FBR0gsWUFBUSxJQUhMO0FBSUgsWUFBUSxJQUpMO0FBS0gsa0JBQWM7QUFMWCxHQXZHTDtBQUFBLE1BOEdBQyxFQUFFLEdBQUc7QUFDSCxZQUFRLGFBREw7QUFFSCxhQUFTLElBRk47QUFHSCxZQUFRLE9BSEw7QUFJSCxrQkFBYyxJQUpYO0FBS0gsWUFBUSxJQUxMO0FBTUgsb0JBQWdCLElBTmI7QUFPSCxjQUFVLEtBUFA7QUFRSCxrQkFBYyxDQUNYSDtBQUFFO0FBRFMsTUFFWEM7QUFBRTtBQUZTLE1BR1hDO0FBQUU7QUFIUztBQVJYLEdBOUdMO0FBQUEsTUE0SEFFLEVBQUUsR0FBRztBQUNILFlBQVEsYUFETDtBQUVILGFBQVMsSUFGTjtBQUdILFlBQVEsS0FITDtBQUlILFlBQVEsSUFKTDtBQUtILGtCQUFjO0FBTFgsR0E1SEw7QUFBQSxNQW1JQUMsR0FBRyxHQUFHLENBQ0o7QUFDRSxZQUFRLFVBRFY7QUFFRSxZQUFRLE9BRlY7QUFHRSxvQkFBZ0I7QUFIbEIsR0FESSxFQU1KO0FBQ0UsWUFBUSxVQURWO0FBRUUsWUFBUSxPQUZWO0FBR0Usb0JBQWdCO0FBSGxCLEdBTkksQ0FuSU47QUFBQSxNQStJQUMsR0FBRyxHQUFHO0FBQ0osWUFBUSxhQURKO0FBRUosYUFBUyxJQUZMO0FBR0osWUFBUSxVQUhKO0FBSUosa0JBQWMsSUFKVjtBQUtKLFlBQVEsSUFMSjtBQU1KLG9CQUFnQixVQU5aO0FBT0osY0FBVSxLQVBOO0FBUUosa0JBQWMsQ0FDWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsSUFGWDtBQUdFLGNBQVEsYUFIVjtBQUlFLGNBQVEsSUFKVjtBQUtFLG9CQUFjO0FBTGhCLEtBRFksRUFRWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsSUFGWDtBQUdFLGNBQVEsV0FIVjtBQUlFLGNBQVEsSUFKVjtBQUtFLG9CQUFjO0FBTGhCLEtBUlk7QUFSVixHQS9JTjtBQUFBLE1Bd0tBQyxHQUFHLEdBQUc7QUFDSixZQUFRLGFBREo7QUFFSixhQUFTLElBRkw7QUFHSixZQUFRLFFBSEo7QUFJSixZQUFRLElBSko7QUFLSixrQkFBYztBQUxWLEdBeEtOO0FBQUEsTUErS0FDLEdBQUcsR0FBRztBQUNKLFlBQVEsYUFESjtBQUVKLGFBQVMsSUFGTDtBQUdKLFlBQVEsTUFISjtBQUlKLFlBQVEsSUFKSjtBQUtKLGtCQUFjO0FBTFYsR0EvS047QUFBQSxNQXNMQUMsR0FBRyxHQUFHO0FBQ0osWUFBUSxhQURKO0FBRUosYUFBUyxJQUZMO0FBR0osWUFBUSxVQUhKO0FBSUosWUFBUSxJQUpKO0FBS0osa0JBQWM7QUFMVixHQXRMTjtBQUFBLE1BNkxBQyxHQUFHLEdBQUc7QUFDSixZQUFRLGFBREo7QUFFSixhQUFTLElBRkw7QUFHSixZQUFRLE9BSEo7QUFJSixZQUFRLElBSko7QUFLSixrQkFBYztBQUxWLEdBN0xOO0FBQUEsTUFvTUFDLEdBQUcsR0FBRztBQUNKLFlBQVEsYUFESjtBQUVKLGFBQVMsSUFGTDtBQUdKLFlBQVEsY0FISjtBQUlKLFlBQVEsSUFKSjtBQUtKLGtCQUFjO0FBTFYsR0FwTU47QUFBQSxNQTJNQUMsR0FBRyxHQUFHO0FBQ0osWUFBUSxhQURKO0FBRUosYUFBUyxJQUZMO0FBR0osWUFBUSxXQUhKO0FBSUosWUFBUSxJQUpKO0FBS0osa0JBQWM7QUFMVixHQTNNTjtBQUFBLE1Ba05BQyxHQUFHLEdBQUc7QUFDSixZQUFRLGFBREo7QUFFSixhQUFTLElBRkw7QUFHSixZQUFRLGlCQUhKO0FBSUosWUFBUSxJQUpKO0FBS0osa0JBQWM7QUFMVixHQWxOTjtBQUFBLE1BeU5BQyxHQUFHLEdBQUc7QUFDSixZQUFRLGFBREo7QUFFSixhQUFTLElBRkw7QUFHSixZQUFRLG1CQUhKO0FBSUosWUFBUSxJQUpKO0FBS0osa0JBQWM7QUFMVixHQXpOTjtBQUFBLE1BZ09BQyxHQUFHLEdBQUc7QUFDSixZQUFRLGFBREo7QUFFSixhQUFTLElBRkw7QUFHSixZQUFRLGdCQUhKO0FBSUosa0JBQWMsSUFKVjtBQUtKLFlBQVEsSUFMSjtBQU1KLG9CQUFnQixlQU5aO0FBT0osY0FBVSxJQVBOO0FBUUosa0JBQWMsQ0FDWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsSUFGWDtBQUdFLGNBQVEsU0FIVjtBQUlFLGNBQVEsSUFKVjtBQUtFLG9CQUFjO0FBTGhCLEtBRFksRUFRWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsSUFGWDtBQUdFLGNBQVEsa0JBSFY7QUFJRSxjQUFRLElBSlY7QUFLRSxvQkFBYztBQUxoQixLQVJZLEVBZVo7QUFDRSxjQUFRLGFBRFY7QUFFRSxlQUFTLElBRlg7QUFHRSxjQUFRLE9BSFY7QUFJRSxvQkFBYyxJQUpoQjtBQUtFLGNBQVEsSUFMVjtBQU1FLHNCQUFnQix3QkFObEI7QUFPRSxnQkFBVSxLQVBaO0FBUUUsb0JBQWMsQ0FDWjtBQUNFLGdCQUFRLGFBRFY7QUFFRSxpQkFBUyxJQUZYO0FBR0UsZ0JBQVEsWUFIVjtBQUlFLGdCQUFRLElBSlY7QUFLRSxzQkFBYztBQUxoQixPQURZO0FBUmhCLEtBZlk7QUFSVixHQWhPTjtBQUFBLE1BMlFBQyxHQUFHLEdBQUc7QUFDSixZQUFRLGFBREo7QUFFSixhQUFTLElBRkw7QUFHSixZQUFRLGdCQUhKO0FBSUosWUFBUSxJQUpKO0FBS0osa0JBQWM7QUFMVixHQTNRTjtBQUFBLE1Ba1JBQyxHQUFHLEdBQUcsQ0FDSjtBQUNFLFlBQVEsVUFEVjtBQUVFLFlBQVEsT0FGVjtBQUdFLG9CQUFnQjtBQUhsQixHQURJLEVBTUo7QUFDRSxZQUFRLFVBRFY7QUFFRSxZQUFRLE9BRlY7QUFHRSxvQkFBZ0I7QUFIbEIsR0FOSSxDQWxSTjtBQUFBLE1BOFJBQyxHQUFHLEdBQUcsQ0FDSjtBQUNFLFlBQVEsVUFEVjtBQUVFLFlBQVEsT0FGVjtBQUdFLG9CQUFnQjtBQUhsQixHQURJLEVBTUo7QUFDRSxZQUFRLFVBRFY7QUFFRSxZQUFRLE9BRlY7QUFHRSxvQkFBZ0I7QUFIbEIsR0FOSSxDQTlSTjtBQTBTQSxTQUFPO0FBQ0wsWUFBUSxTQURIO0FBRUwsZ0JBQVk7QUFDVixjQUFRLFVBREU7QUFFVixjQUFRLHVCQUZFO0FBR1YsY0FBUSxPQUhFO0FBSVYsa0JBQVksSUFKRjtBQUtWLDZCQUF3QnZCO0FBQUU7QUFMaEI7QUFNVixvQkFBYyxDQUNaO0FBQ0UsZ0JBQVEsYUFEVjtBQUVFLGlCQUFTLElBRlg7QUFHRSxnQkFBUSxZQUhWO0FBSUUsc0JBQWMsSUFKaEI7QUFLRSxnQkFBU0M7QUFBRTtBQUxiO0FBTUUsd0JBQWdCLFlBTmxCO0FBT0Usa0JBQVUsS0FQWjtBQVFFLHNCQUFjLENBQ1o7QUFDRSxrQkFBUSxhQURWO0FBRUUsbUJBQVMsSUFGWDtBQUdFLGtCQUFRLGFBSFY7QUFJRSx3QkFBYyxJQUpoQjtBQUtFLGtCQUFTQztBQUFFO0FBTGI7QUFNRSwwQkFBZ0IsYUFObEI7QUFPRSxvQkFBVSxLQVBaO0FBUUUsd0JBQWMsQ0FDWEM7QUFBRTtBQURTLFlBRVo7QUFDRSxvQkFBUSxnQkFEVjtBQUVFLG9CQUFRLHdDQUZWO0FBR0Usb0JBQVEsQ0FDTjtBQUNFLHNCQUFRLFVBRFY7QUFFRSxzQkFBUSxjQUZWO0FBR0UsOEJBQWdCO0FBSGxCLGFBRE0sRUFNTjtBQUNFLHNCQUFRLFVBRFY7QUFFRSxzQkFBUSxlQUZWO0FBR0UsOEJBQWdCO0FBSGxCLGFBTk0sRUFXTjtBQUNFLHNCQUFRLFVBRFY7QUFFRSxzQkFBUSxhQUZWO0FBR0UsOEJBQWdCO0FBSGxCLGFBWE0sRUFnQk47QUFDRSxzQkFBUSxVQURWO0FBRUUsc0JBQVEsY0FGVjtBQUdFLDhCQUFnQjtBQUhsQixhQWhCTSxFQXFCTjtBQUNFLHNCQUFRLFVBRFY7QUFFRSxzQkFBUSxhQUZWO0FBR0UsOEJBQWdCO0FBSGxCLGFBckJNLEVBMEJOO0FBQ0Usc0JBQVEsVUFEVjtBQUVFLHNCQUFRLGNBRlY7QUFHRSw4QkFBZ0I7QUFIbEIsYUExQk07QUFIVixXQUZZLEVBc0NaO0FBQ0Usb0JBQVEsZ0JBRFY7QUFFRSxvQkFBUSwrQkFGVjtBQUdFLG9CQUFRO0FBSFYsV0F0Q1k7QUFSaEIsU0FEWSxFQXNEWjtBQUNFLGtCQUFRLGdCQURWO0FBRUUsa0JBQVEsOEJBRlY7QUFHRSxrQkFBUTtBQUhWLFNBdERZO0FBUmhCLE9BRFksRUFzRVo7QUFDRSxnQkFBUSxhQURWO0FBRUUsaUJBQVMsSUFGWDtBQUdFLGdCQUFRLFFBSFY7QUFJRSxzQkFBYyxJQUpoQjtBQUtFLGdCQUFRLElBTFY7QUFNRSx3QkFBZ0IsTUFObEI7QUFPRSxrQkFBVSxLQVBaO0FBUUUsc0JBQWMsQ0FDWjtBQUNFLGtCQUFRLGdCQURWO0FBRUUsa0JBQVEsMEJBRlY7QUFHRSxrQkFBUTtBQUhWLFNBRFk7QUFSaEIsT0F0RVk7QUFOSixLQUZQO0FBZ0dMLGlCQUFhO0FBQ1gsY0FBUSxXQURHO0FBRVgsY0FBUSx1QkFGRztBQUdYLDZCQUF3Qkg7QUFBRTtBQUhmO0FBSVgsb0JBQWMsQ0FDWjtBQUNFLGdCQUFRLGFBRFY7QUFFRSxpQkFBUyxJQUZYO0FBR0UsZ0JBQVEsWUFIVjtBQUlFLHNCQUFjLElBSmhCO0FBS0UsZ0JBQVNDO0FBQUU7QUFMYjtBQU1FLHdCQUFnQixZQU5sQjtBQU9FLGtCQUFVLEtBUFo7QUFRRSxzQkFBYyxDQUNYRztBQUFFO0FBRFMsVUFFWEk7QUFBRTtBQUZTLFVBR1o7QUFDRSxrQkFBUSxhQURWO0FBRUUsbUJBQVMsSUFGWDtBQUdFLGtCQUFRLGFBSFY7QUFJRSx3QkFBYyxJQUpoQjtBQUtFLGtCQUFTTjtBQUFFO0FBTGI7QUFNRSwwQkFBZ0IsYUFObEI7QUFPRSxvQkFBVSxLQVBaO0FBUUUsd0JBQWMsQ0FDWEM7QUFBRTtBQURTLFlBRVhJO0FBQUU7QUFGUyxZQUdYRTtBQUFFO0FBSFMsWUFJWjtBQUNFLG9CQUFRLGFBRFY7QUFFRSxxQkFBUyxJQUZYO0FBR0Usb0JBQVEsU0FIVjtBQUlFLDBCQUFjLElBSmhCO0FBS0Usb0JBQVNDO0FBQUc7QUFMZDtBQU1FLDRCQUFnQiw2QkFObEI7QUFPRSxzQkFBVSxLQVBaO0FBUUUsMEJBQWMsQ0FDWEM7QUFBRztBQURRLGNBRVo7QUFDRSxzQkFBUSxhQURWO0FBRUUsdUJBQVMsSUFGWDtBQUdFLHNCQUFRLE9BSFY7QUFJRSw0QkFBYyxJQUpoQjtBQUtFLHNCQUFRLElBTFY7QUFNRSw4QkFBZ0IsdUJBTmxCO0FBT0Usd0JBQVUsSUFQWjtBQVFFLDRCQUFjLENBQ1hDO0FBQUc7QUFEUSxnQkFFWjtBQUNFLHdCQUFRLGFBRFY7QUFFRSx5QkFBUyxJQUZYO0FBR0Usd0JBQVEsTUFIVjtBQUlFLDhCQUFjLElBSmhCO0FBS0Usd0JBQVEsSUFMVjtBQU1FLGdDQUFnQixtQkFObEI7QUFPRSwwQkFBVSxLQVBaO0FBUUUsOEJBQWMsQ0FDWEw7QUFBRTtBQURTLGtCQUVYTTtBQUFHO0FBRlEsa0JBR1hDO0FBQUc7QUFIUSxrQkFJWEM7QUFBRztBQUpRLGtCQUtaO0FBQ0UsMEJBQVEsYUFEVjtBQUVFLDJCQUFTLElBRlg7QUFHRSwwQkFBUSxhQUhWO0FBSUUsMEJBQVEsSUFKVjtBQUtFLGdDQUFjO0FBTGhCLGlCQUxZLEVBWVhDO0FBQUc7QUFaUSxrQkFhWFA7QUFBRTtBQWJTLGtCQWNaO0FBQ0UsMEJBQVEsYUFEVjtBQUVFLDJCQUFTLElBRlg7QUFHRSwwQkFBUSxRQUhWO0FBSUUsZ0NBQWMsSUFKaEI7QUFLRSwwQkFBUSxJQUxWO0FBTUUsa0NBQWdCLElBTmxCO0FBT0UsNEJBQVUsS0FQWjtBQVFFLGdDQUFjLENBQ1hKO0FBQUU7QUFEUyxvQkFFWEM7QUFBRTtBQUZTLG9CQUdYVztBQUFHO0FBSFEsb0JBSVhSO0FBQUU7QUFKUyxvQkFLWEY7QUFBRTtBQUxTO0FBUmhCLGlCQWRZLEVBOEJYVztBQUFHO0FBOUJRLGtCQStCWEM7QUFBRztBQS9CUSxrQkFnQ1hDO0FBQUc7QUFoQ1Esa0JBaUNYQztBQUFHO0FBakNRLGtCQWtDWGhCO0FBQUU7QUFsQ1M7QUFSaEIsZUFGWTtBQVJoQixhQUZZO0FBUmhCLFdBSlksRUF5RVo7QUFDRSxvQkFBUSxjQURWO0FBRUUscUJBQVMsSUFGWDtBQUdFLG9CQUFRLFNBSFY7QUFJRSxvQkFBU0s7QUFBRztBQUpkO0FBS0Usc0JBQVUsWUFMWjtBQU1FLG1CQUFPLG9DQU5UO0FBT0UsdUJBQVc7QUFQYixXQXpFWSxFQWtGWjtBQUNFLG9CQUFRLGFBRFY7QUFFRSxxQkFBUyxJQUZYO0FBR0Usb0JBQVEsZUFIVjtBQUlFLDBCQUFjLElBSmhCO0FBS0Usb0JBQVNZO0FBQUc7QUFMZDtBQU1FLDRCQUFnQixtQ0FObEI7QUFPRSxzQkFBVSxLQVBaO0FBUUUsMEJBQWMsQ0FDWFg7QUFBRztBQURRLGNBRVo7QUFDRSxzQkFBUSxhQURWO0FBRUUsdUJBQVMsSUFGWDtBQUdFLHNCQUFRLE9BSFY7QUFJRSw0QkFBYyxJQUpoQjtBQUtFLHNCQUFRLElBTFY7QUFNRSw4QkFBZ0IsNkJBTmxCO0FBT0Usd0JBQVUsSUFQWjtBQVFFLDRCQUFjLENBQ1hDO0FBQUc7QUFEUSxnQkFFWjtBQUNFLHdCQUFRLGFBRFY7QUFFRSx5QkFBUyxJQUZYO0FBR0Usd0JBQVEsTUFIVjtBQUlFLDhCQUFjLElBSmhCO0FBS0Usd0JBQVEsSUFMVjtBQU1FLGdDQUFnQix5QkFObEI7QUFPRSwwQkFBVSxLQVBaO0FBUUUsOEJBQWMsQ0FDWEw7QUFBRTtBQURTLGtCQUVaO0FBQ0UsMEJBQVEsYUFEVjtBQUVFLDJCQUFTLElBRlg7QUFHRSwwQkFBUSxZQUhWO0FBSUUsMEJBQVEsSUFKVjtBQUtFLGdDQUFjO0FBTGhCLGlCQUZZLEVBU1o7QUFDRSwwQkFBUSxhQURWO0FBRUUsMkJBQVMsSUFGWDtBQUdFLDBCQUFRLFlBSFY7QUFJRSxnQ0FBYyxJQUpoQjtBQUtFLDBCQUFRLElBTFY7QUFNRSxrQ0FBZ0IsTUFObEI7QUFPRSw0QkFBVSxLQVBaO0FBUUUsZ0NBQWMsQ0FDWEQ7QUFBRTtBQURTLG9CQUVYQztBQUFFO0FBRlM7QUFSaEIsaUJBVFksRUFzQlo7QUFDRSwwQkFBUSxhQURWO0FBRUUsMkJBQVMsSUFGWDtBQUdFLDBCQUFRLGtCQUhWO0FBSUUsMEJBQVEsSUFKVjtBQUtFLGdDQUFjO0FBTGhCLGlCQXRCWSxFQTZCWjtBQUNFLDBCQUFRLGFBRFY7QUFFRSwyQkFBUyxJQUZYO0FBR0UsMEJBQVEsb0JBSFY7QUFJRSwwQkFBUSxJQUpWO0FBS0UsZ0NBQWM7QUFMaEIsaUJBN0JZLEVBb0NaO0FBQ0UsMEJBQVEsYUFEVjtBQUVFLDJCQUFTLElBRlg7QUFHRSwwQkFBUSxVQUhWO0FBSUUsZ0NBQWMsSUFKaEI7QUFLRSwwQkFBU2dCO0FBQUc7QUFMZDtBQU1FLGtDQUFnQixvQ0FObEI7QUFPRSw0QkFBVSxLQVBaO0FBUUUsZ0NBQWMsQ0FDWFo7QUFBRztBQURRLG9CQUVaO0FBQ0UsNEJBQVEsYUFEVjtBQUVFLDZCQUFTLElBRlg7QUFHRSw0QkFBUSxPQUhWO0FBSUUsa0NBQWMsSUFKaEI7QUFLRSw0QkFBUSxJQUxWO0FBTUUsb0NBQWdCLDhCQU5sQjtBQU9FLDhCQUFVLElBUFo7QUFRRSxrQ0FBYyxDQUNYQztBQUFHO0FBRFEsc0JBRVo7QUFDRSw4QkFBUSxhQURWO0FBRUUsK0JBQVMsSUFGWDtBQUdFLDhCQUFRLE1BSFY7QUFJRSxvQ0FBYyxJQUpoQjtBQUtFLDhCQUFRLElBTFY7QUFNRSxzQ0FBZ0IsMEJBTmxCO0FBT0UsZ0NBQVUsS0FQWjtBQVFFLG9DQUFjLENBQ1hMO0FBQUU7QUFEUyx3QkFFWjtBQUNFLGdDQUFRLGFBRFY7QUFFRSxpQ0FBUyxJQUZYO0FBR0UsZ0NBQVEsUUFIVjtBQUlFLHNDQUFjLElBSmhCO0FBS0UsZ0NBQVEsSUFMVjtBQU1FLHdDQUFnQixJQU5sQjtBQU9FLGtDQUFVLEtBUFo7QUFRRSxzQ0FBYyxDQUNYRjtBQUFFO0FBRFMsMEJBRVhZO0FBQUc7QUFGUSwwQkFHWFg7QUFBRTtBQUhTLDBCQUlYRztBQUFFO0FBSlMsMEJBS1hGO0FBQUU7QUFMUztBQVJoQix1QkFGWSxFQWtCWE87QUFBRztBQWxCUSx3QkFtQlhEO0FBQUc7QUFuQlEsd0JBb0JaO0FBQ0UsZ0NBQVEsYUFEVjtBQUVFLGlDQUFTLElBRlg7QUFHRSxnQ0FBUSxhQUhWO0FBSUUsZ0NBQVEsSUFKVjtBQUtFLHNDQUFjO0FBTGhCLHVCQXBCWSxFQTJCWEU7QUFBRztBQTNCUSx3QkE0QlhNO0FBQUc7QUE1QlEsd0JBNkJYSDtBQUFHO0FBN0JRLHdCQThCWjtBQUNFLGdDQUFRLGFBRFY7QUFFRSxpQ0FBUyxJQUZYO0FBR0UsZ0NBQVEsTUFIVjtBQUlFLGdDQUFRLElBSlY7QUFLRSxzQ0FBYztBQUxoQix1QkE5QlksRUFxQ1o7QUFDRSxnQ0FBUSxhQURWO0FBRUUsaUNBQVMsSUFGWDtBQUdFLGdDQUFRLFVBSFY7QUFJRSxnQ0FBUSxJQUpWO0FBS0Usc0NBQWM7QUFMaEIsdUJBckNZLEVBNENaO0FBQ0UsZ0NBQVEsYUFEVjtBQUVFLGlDQUFTLElBRlg7QUFHRSxnQ0FBUSxXQUhWO0FBSUUsZ0NBQVEsSUFKVjtBQUtFLHNDQUFjO0FBTGhCLHVCQTVDWSxFQW1EWEY7QUFBRztBQW5EUSx3QkFvRFhQO0FBQUU7QUFwRFMsd0JBcURYVTtBQUFHO0FBckRRLHdCQXNEWEM7QUFBRztBQXREUSx3QkF1RFhmO0FBQUU7QUF2RFM7QUFSaEIscUJBRlk7QUFSaEIsbUJBRlk7QUFSaEIsaUJBcENZLEVBOEhaO0FBQ0UsMEJBQVEsY0FEVjtBQUVFLDJCQUFTLElBRlg7QUFHRSwwQkFBUSxVQUhWO0FBSUUsMEJBQVNrQjtBQUFHO0FBSmQ7QUFLRSw0QkFBVSxZQUxaO0FBTUUseUJBQU8sb0NBTlQ7QUFPRSw2QkFBVztBQVBiLGlCQTlIWSxFQXVJWGxCO0FBQUU7QUF2SVM7QUFSaEIsZUFGWTtBQVJoQixhQUZZO0FBUmhCLFdBbEZZLEVBNFBaO0FBQ0Usb0JBQVEsY0FEVjtBQUVFLHFCQUFTLElBRlg7QUFHRSxvQkFBUSxlQUhWO0FBSUUsb0JBQVNpQjtBQUFHO0FBSmQ7QUFLRSxzQkFBVSxZQUxaO0FBTUUsbUJBQU8sd0NBTlQ7QUFPRSx1QkFBVztBQVBiLFdBNVBZLEVBcVFaO0FBQ0Usb0JBQVEsYUFEVjtBQUVFLHFCQUFTLElBRlg7QUFHRSxvQkFBUSxRQUhWO0FBSUUsb0JBQVEsSUFKVjtBQUtFLDBCQUFjO0FBTGhCLFdBclFZLEVBNFFaO0FBQ0Usb0JBQVEsYUFEVjtBQUVFLHFCQUFTLElBRlg7QUFHRSxvQkFBUSxhQUhWO0FBSUUsb0JBQVEsSUFKVjtBQUtFLDBCQUFjO0FBTGhCLFdBNVFZLEVBbVJaO0FBQ0Usb0JBQVEsYUFEVjtBQUVFLHFCQUFTLElBRlg7QUFHRSxvQkFBUSxnQkFIVjtBQUlFLDBCQUFjLElBSmhCO0FBS0Usb0JBQVEsSUFMVjtBQU1FLDRCQUFnQixZQU5sQjtBQU9FLHNCQUFVLEtBUFo7QUFRRSwwQkFBYyxDQUNYbEI7QUFBRTtBQURTLGNBRVhLO0FBQUU7QUFGUyxjQUdaO0FBQ0Usc0JBQVEsYUFEVjtBQUVFLHVCQUFTLElBRlg7QUFHRSxzQkFBUSxRQUhWO0FBSUUsc0JBQVEsSUFKVjtBQUtFLDRCQUFjO0FBTGhCLGFBSFksRUFVWEQ7QUFBRTtBQVZTLGNBV1hEO0FBQUU7QUFYUztBQVJoQixXQW5SWTtBQVJoQixTQUhZLEVBc1RYQTtBQUFFO0FBdFRTO0FBUmhCLE9BRFksRUFrVVo7QUFDRSxnQkFBUSxhQURWO0FBRUUsaUJBQVMsSUFGWDtBQUdFLGdCQUFRLFFBSFY7QUFJRSxzQkFBYyxJQUpoQjtBQUtFLGdCQUFRLElBTFY7QUFNRSx3QkFBZ0IsTUFObEI7QUFPRSxrQkFBVSxLQVBaO0FBUUUsc0JBQWMsQ0FDWEE7QUFBRTtBQURTLFVBRVhEO0FBQUU7QUFGUyxVQUdYVztBQUFHO0FBSFE7QUFSaEIsT0FsVVk7QUFKSCxLQWhHUjtBQXNiTCxjQUFVO0FBQ1IsdUJBQWlCLE9BRFQ7QUFFUixjQUFRLHVCQUZBO0FBR1IsWUFBTSxJQUhFO0FBSVIsY0FBUSxvK0dBSkE7QUFLUixrQkFBWTtBQUxKO0FBdGJMLEdBQVA7QUE4YkMsQ0F6dUJpQyxFQUFsQyxDLENBMHVCQTs7O0FBQ0NsQjtBQUFJO0FBQUwsQ0FBZ0J5QixJQUFoQixHQUF1QixrQ0FBdkI7QUFDQUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCM0IsSUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmbG93XG4gKiBAcmVsYXlIYXNoIDFmMmRkMWIxMzAxMGRmZWIzNDA3NTk5ZmYxYjdlODNhXG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKjo6XG5pbXBvcnQgdHlwZSB7IENvbmNyZXRlUmVxdWVzdCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xudHlwZSBhZ2dyZWdhdGVkUmV2aWV3c0NvbnRhaW5lcl9wdWxsUmVxdWVzdCRyZWYgPSBhbnk7XG50eXBlIHJldmlld3NDb250cm9sbGVyX3B1bGxSZXF1ZXN0JHJlZiA9IGFueTtcbnR5cGUgcmV2aWV3c0NvbnRyb2xsZXJfcmVwb3NpdG9yeSRyZWYgPSBhbnk7XG50eXBlIHJldmlld3NDb250cm9sbGVyX3ZpZXdlciRyZWYgPSBhbnk7XG5leHBvcnQgdHlwZSByZXZpZXdzQ29udGFpbmVyUXVlcnlWYXJpYWJsZXMgPSB7fFxuICByZXBvT3duZXI6IHN0cmluZyxcbiAgcmVwb05hbWU6IHN0cmluZyxcbiAgcHJOdW1iZXI6IG51bWJlcixcbiAgcmV2aWV3Q291bnQ6IG51bWJlcixcbiAgcmV2aWV3Q3Vyc29yPzogP3N0cmluZyxcbiAgdGhyZWFkQ291bnQ6IG51bWJlcixcbiAgdGhyZWFkQ3Vyc29yPzogP3N0cmluZyxcbiAgY29tbWVudENvdW50OiBudW1iZXIsXG4gIGNvbW1lbnRDdXJzb3I/OiA/c3RyaW5nLFxufH07XG5leHBvcnQgdHlwZSByZXZpZXdzQ29udGFpbmVyUXVlcnlSZXNwb25zZSA9IHt8XG4gICtyZXBvc2l0b3J5OiA/e3xcbiAgICArcHVsbFJlcXVlc3Q6ID97fFxuICAgICAgK2hlYWRSZWZPaWQ6IGFueSxcbiAgICAgICskZnJhZ21lbnRSZWZzOiBhZ2dyZWdhdGVkUmV2aWV3c0NvbnRhaW5lcl9wdWxsUmVxdWVzdCRyZWYgJiByZXZpZXdzQ29udHJvbGxlcl9wdWxsUmVxdWVzdCRyZWYsXG4gICAgfH0sXG4gICAgKyRmcmFnbWVudFJlZnM6IHJldmlld3NDb250cm9sbGVyX3JlcG9zaXRvcnkkcmVmLFxuICB8fSxcbiAgK3ZpZXdlcjoge3xcbiAgICArJGZyYWdtZW50UmVmczogcmV2aWV3c0NvbnRyb2xsZXJfdmlld2VyJHJlZlxuICB8fSxcbnx9O1xuZXhwb3J0IHR5cGUgcmV2aWV3c0NvbnRhaW5lclF1ZXJ5ID0ge3xcbiAgdmFyaWFibGVzOiByZXZpZXdzQ29udGFpbmVyUXVlcnlWYXJpYWJsZXMsXG4gIHJlc3BvbnNlOiByZXZpZXdzQ29udGFpbmVyUXVlcnlSZXNwb25zZSxcbnx9O1xuKi9cblxuXG4vKlxucXVlcnkgcmV2aWV3c0NvbnRhaW5lclF1ZXJ5KFxuICAkcmVwb093bmVyOiBTdHJpbmchXG4gICRyZXBvTmFtZTogU3RyaW5nIVxuICAkcHJOdW1iZXI6IEludCFcbiAgJHJldmlld0NvdW50OiBJbnQhXG4gICRyZXZpZXdDdXJzb3I6IFN0cmluZ1xuICAkdGhyZWFkQ291bnQ6IEludCFcbiAgJHRocmVhZEN1cnNvcjogU3RyaW5nXG4gICRjb21tZW50Q291bnQ6IEludCFcbiAgJGNvbW1lbnRDdXJzb3I6IFN0cmluZ1xuKSB7XG4gIHJlcG9zaXRvcnkob3duZXI6ICRyZXBvT3duZXIsIG5hbWU6ICRyZXBvTmFtZSkge1xuICAgIC4uLnJldmlld3NDb250cm9sbGVyX3JlcG9zaXRvcnlcbiAgICBwdWxsUmVxdWVzdChudW1iZXI6ICRwck51bWJlcikge1xuICAgICAgaGVhZFJlZk9pZFxuICAgICAgLi4uYWdncmVnYXRlZFJldmlld3NDb250YWluZXJfcHVsbFJlcXVlc3RfcWRuZVpcbiAgICAgIC4uLnJldmlld3NDb250cm9sbGVyX3B1bGxSZXF1ZXN0XG4gICAgICBpZFxuICAgIH1cbiAgICBpZFxuICB9XG4gIHZpZXdlciB7XG4gICAgLi4ucmV2aWV3c0NvbnRyb2xsZXJfdmlld2VyXG4gICAgaWRcbiAgfVxufVxuXG5mcmFnbWVudCBhZ2dyZWdhdGVkUmV2aWV3c0NvbnRhaW5lcl9wdWxsUmVxdWVzdF9xZG5lWiBvbiBQdWxsUmVxdWVzdCB7XG4gIGlkXG4gIC4uLnJldmlld1N1bW1hcmllc0FjY3VtdWxhdG9yX3B1bGxSZXF1ZXN0XzJ6emM5NlxuICAuLi5yZXZpZXdUaHJlYWRzQWNjdW11bGF0b3JfcHVsbFJlcXVlc3RfQ0tEdmpcbn1cblxuZnJhZ21lbnQgZW1vamlSZWFjdGlvbnNDb250cm9sbGVyX3JlYWN0YWJsZSBvbiBSZWFjdGFibGUge1xuICBpZFxuICAuLi5lbW9qaVJlYWN0aW9uc1ZpZXdfcmVhY3RhYmxlXG59XG5cbmZyYWdtZW50IGVtb2ppUmVhY3Rpb25zVmlld19yZWFjdGFibGUgb24gUmVhY3RhYmxlIHtcbiAgaWRcbiAgcmVhY3Rpb25Hcm91cHMge1xuICAgIGNvbnRlbnRcbiAgICB2aWV3ZXJIYXNSZWFjdGVkXG4gICAgdXNlcnMge1xuICAgICAgdG90YWxDb3VudFxuICAgIH1cbiAgfVxuICB2aWV3ZXJDYW5SZWFjdFxufVxuXG5mcmFnbWVudCBwckNoZWNrb3V0Q29udHJvbGxlcl9wdWxsUmVxdWVzdCBvbiBQdWxsUmVxdWVzdCB7XG4gIG51bWJlclxuICBoZWFkUmVmTmFtZVxuICBoZWFkUmVwb3NpdG9yeSB7XG4gICAgbmFtZVxuICAgIHVybFxuICAgIHNzaFVybFxuICAgIG93bmVyIHtcbiAgICAgIF9fdHlwZW5hbWVcbiAgICAgIGxvZ2luXG4gICAgICBpZFxuICAgIH1cbiAgICBpZFxuICB9XG59XG5cbmZyYWdtZW50IHByQ2hlY2tvdXRDb250cm9sbGVyX3JlcG9zaXRvcnkgb24gUmVwb3NpdG9yeSB7XG4gIG5hbWVcbiAgb3duZXIge1xuICAgIF9fdHlwZW5hbWVcbiAgICBsb2dpblxuICAgIGlkXG4gIH1cbn1cblxuZnJhZ21lbnQgcmV2aWV3Q29tbWVudHNBY2N1bXVsYXRvcl9yZXZpZXdUaHJlYWRfMVZiVW1MIG9uIFB1bGxSZXF1ZXN0UmV2aWV3VGhyZWFkIHtcbiAgaWRcbiAgY29tbWVudHMoZmlyc3Q6ICRjb21tZW50Q291bnQsIGFmdGVyOiAkY29tbWVudEN1cnNvcikge1xuICAgIHBhZ2VJbmZvIHtcbiAgICAgIGhhc05leHRQYWdlXG4gICAgICBlbmRDdXJzb3JcbiAgICB9XG4gICAgZWRnZXMge1xuICAgICAgY3Vyc29yXG4gICAgICBub2RlIHtcbiAgICAgICAgaWRcbiAgICAgICAgYXV0aG9yIHtcbiAgICAgICAgICBfX3R5cGVuYW1lXG4gICAgICAgICAgYXZhdGFyVXJsXG4gICAgICAgICAgbG9naW5cbiAgICAgICAgICB1cmxcbiAgICAgICAgICAuLi4gb24gTm9kZSB7XG4gICAgICAgICAgICBpZFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBib2R5SFRNTFxuICAgICAgICBib2R5XG4gICAgICAgIGlzTWluaW1pemVkXG4gICAgICAgIHN0YXRlXG4gICAgICAgIHZpZXdlckNhblJlYWN0XG4gICAgICAgIHZpZXdlckNhblVwZGF0ZVxuICAgICAgICBwYXRoXG4gICAgICAgIHBvc2l0aW9uXG4gICAgICAgIGNyZWF0ZWRBdFxuICAgICAgICBsYXN0RWRpdGVkQXRcbiAgICAgICAgdXJsXG4gICAgICAgIGF1dGhvckFzc29jaWF0aW9uXG4gICAgICAgIC4uLmVtb2ppUmVhY3Rpb25zQ29udHJvbGxlcl9yZWFjdGFibGVcbiAgICAgICAgX190eXBlbmFtZVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mcmFnbWVudCByZXZpZXdTdW1tYXJpZXNBY2N1bXVsYXRvcl9wdWxsUmVxdWVzdF8yenpjOTYgb24gUHVsbFJlcXVlc3Qge1xuICB1cmxcbiAgcmV2aWV3cyhmaXJzdDogJHJldmlld0NvdW50LCBhZnRlcjogJHJldmlld0N1cnNvcikge1xuICAgIHBhZ2VJbmZvIHtcbiAgICAgIGhhc05leHRQYWdlXG4gICAgICBlbmRDdXJzb3JcbiAgICB9XG4gICAgZWRnZXMge1xuICAgICAgY3Vyc29yXG4gICAgICBub2RlIHtcbiAgICAgICAgaWRcbiAgICAgICAgYm9keVxuICAgICAgICBib2R5SFRNTFxuICAgICAgICBzdGF0ZVxuICAgICAgICBzdWJtaXR0ZWRBdFxuICAgICAgICBsYXN0RWRpdGVkQXRcbiAgICAgICAgdXJsXG4gICAgICAgIGF1dGhvciB7XG4gICAgICAgICAgX190eXBlbmFtZVxuICAgICAgICAgIGxvZ2luXG4gICAgICAgICAgYXZhdGFyVXJsXG4gICAgICAgICAgdXJsXG4gICAgICAgICAgLi4uIG9uIE5vZGUge1xuICAgICAgICAgICAgaWRcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmlld2VyQ2FuVXBkYXRlXG4gICAgICAgIGF1dGhvckFzc29jaWF0aW9uXG4gICAgICAgIC4uLmVtb2ppUmVhY3Rpb25zQ29udHJvbGxlcl9yZWFjdGFibGVcbiAgICAgICAgX190eXBlbmFtZVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mcmFnbWVudCByZXZpZXdUaHJlYWRzQWNjdW11bGF0b3JfcHVsbFJlcXVlc3RfQ0tEdmogb24gUHVsbFJlcXVlc3Qge1xuICB1cmxcbiAgcmV2aWV3VGhyZWFkcyhmaXJzdDogJHRocmVhZENvdW50LCBhZnRlcjogJHRocmVhZEN1cnNvcikge1xuICAgIHBhZ2VJbmZvIHtcbiAgICAgIGhhc05leHRQYWdlXG4gICAgICBlbmRDdXJzb3JcbiAgICB9XG4gICAgZWRnZXMge1xuICAgICAgY3Vyc29yXG4gICAgICBub2RlIHtcbiAgICAgICAgaWRcbiAgICAgICAgaXNSZXNvbHZlZFxuICAgICAgICByZXNvbHZlZEJ5IHtcbiAgICAgICAgICBsb2dpblxuICAgICAgICAgIGlkXG4gICAgICAgIH1cbiAgICAgICAgdmlld2VyQ2FuUmVzb2x2ZVxuICAgICAgICB2aWV3ZXJDYW5VbnJlc29sdmVcbiAgICAgICAgLi4ucmV2aWV3Q29tbWVudHNBY2N1bXVsYXRvcl9yZXZpZXdUaHJlYWRfMVZiVW1MXG4gICAgICAgIF9fdHlwZW5hbWVcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnJhZ21lbnQgcmV2aWV3c0NvbnRyb2xsZXJfcHVsbFJlcXVlc3Qgb24gUHVsbFJlcXVlc3Qge1xuICBpZFxuICAuLi5wckNoZWNrb3V0Q29udHJvbGxlcl9wdWxsUmVxdWVzdFxufVxuXG5mcmFnbWVudCByZXZpZXdzQ29udHJvbGxlcl9yZXBvc2l0b3J5IG9uIFJlcG9zaXRvcnkge1xuICAuLi5wckNoZWNrb3V0Q29udHJvbGxlcl9yZXBvc2l0b3J5XG59XG5cbmZyYWdtZW50IHJldmlld3NDb250cm9sbGVyX3ZpZXdlciBvbiBVc2VyIHtcbiAgaWRcbiAgbG9naW5cbiAgYXZhdGFyVXJsXG59XG4qL1xuXG5jb25zdCBub2RlLyo6IENvbmNyZXRlUmVxdWVzdCovID0gKGZ1bmN0aW9uKCl7XG52YXIgdjAgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwicmVwb093bmVyXCIsXG4gICAgXCJ0eXBlXCI6IFwiU3RyaW5nIVwiLFxuICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgfSxcbiAge1xuICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICBcIm5hbWVcIjogXCJyZXBvTmFtZVwiLFxuICAgIFwidHlwZVwiOiBcIlN0cmluZyFcIixcbiAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gIH0sXG4gIHtcbiAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwicHJOdW1iZXJcIixcbiAgICBcInR5cGVcIjogXCJJbnQhXCIsXG4gICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICB9LFxuICB7XG4gICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgIFwibmFtZVwiOiBcInJldmlld0NvdW50XCIsXG4gICAgXCJ0eXBlXCI6IFwiSW50IVwiLFxuICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgfSxcbiAge1xuICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICBcIm5hbWVcIjogXCJyZXZpZXdDdXJzb3JcIixcbiAgICBcInR5cGVcIjogXCJTdHJpbmdcIixcbiAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gIH0sXG4gIHtcbiAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwidGhyZWFkQ291bnRcIixcbiAgICBcInR5cGVcIjogXCJJbnQhXCIsXG4gICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICB9LFxuICB7XG4gICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgIFwibmFtZVwiOiBcInRocmVhZEN1cnNvclwiLFxuICAgIFwidHlwZVwiOiBcIlN0cmluZ1wiLFxuICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgfSxcbiAge1xuICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICBcIm5hbWVcIjogXCJjb21tZW50Q291bnRcIixcbiAgICBcInR5cGVcIjogXCJJbnQhXCIsXG4gICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICB9LFxuICB7XG4gICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgIFwibmFtZVwiOiBcImNvbW1lbnRDdXJzb3JcIixcbiAgICBcInR5cGVcIjogXCJTdHJpbmdcIixcbiAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gIH1cbl0sXG52MSA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgXCJuYW1lXCI6IFwibmFtZVwiLFxuICAgIFwidmFyaWFibGVOYW1lXCI6IFwicmVwb05hbWVcIlxuICB9LFxuICB7XG4gICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICBcIm5hbWVcIjogXCJvd25lclwiLFxuICAgIFwidmFyaWFibGVOYW1lXCI6IFwicmVwb093bmVyXCJcbiAgfVxuXSxcbnYyID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICBcIm5hbWVcIjogXCJudW1iZXJcIixcbiAgICBcInZhcmlhYmxlTmFtZVwiOiBcInByTnVtYmVyXCJcbiAgfVxuXSxcbnYzID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcImhlYWRSZWZPaWRcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjQgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwibmFtZVwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52NSA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJfX3R5cGVuYW1lXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnY2ID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcImxvZ2luXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnY3ID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcImlkXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnY4ID0ge1xuICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcIm93bmVyXCIsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgXCJwbHVyYWxcIjogZmFsc2UsXG4gIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgKHY1Lyo6IGFueSovKSxcbiAgICAodjYvKjogYW55Ki8pLFxuICAgICh2Ny8qOiBhbnkqLylcbiAgXVxufSxcbnY5ID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcInVybFwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52MTAgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgIFwibmFtZVwiOiBcImFmdGVyXCIsXG4gICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJyZXZpZXdDdXJzb3JcIlxuICB9LFxuICB7XG4gICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICBcIm5hbWVcIjogXCJmaXJzdFwiLFxuICAgIFwidmFyaWFibGVOYW1lXCI6IFwicmV2aWV3Q291bnRcIlxuICB9XG5dLFxudjExID0ge1xuICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcInBhZ2VJbmZvXCIsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJjb25jcmV0ZVR5cGVcIjogXCJQYWdlSW5mb1wiLFxuICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwiaGFzTmV4dFBhZ2VcIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJlbmRDdXJzb3JcIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9XG4gIF1cbn0sXG52MTIgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiY3Vyc29yXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnYxMyA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJib2R5XCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnYxNCA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJib2R5SFRNTFwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52MTUgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwic3RhdGVcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjE2ID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcImxhc3RFZGl0ZWRBdFwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52MTcgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiYXZhdGFyVXJsXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnYxOCA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJ2aWV3ZXJDYW5VcGRhdGVcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjE5ID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcImF1dGhvckFzc29jaWF0aW9uXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnYyMCA9IHtcbiAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJyZWFjdGlvbkdyb3Vwc1wiLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwiY29uY3JldGVUeXBlXCI6IFwiUmVhY3Rpb25Hcm91cFwiLFxuICBcInBsdXJhbFwiOiB0cnVlLFxuICBcInNlbGVjdGlvbnNcIjogW1xuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJjb250ZW50XCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwidmlld2VySGFzUmVhY3RlZFwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcInVzZXJzXCIsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJSZWFjdGluZ1VzZXJDb25uZWN0aW9uXCIsXG4gICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICBcIm5hbWVcIjogXCJ0b3RhbENvdW50XCIsXG4gICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgXVxufSxcbnYyMSA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJ2aWV3ZXJDYW5SZWFjdFwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52MjIgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgIFwibmFtZVwiOiBcImFmdGVyXCIsXG4gICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJ0aHJlYWRDdXJzb3JcIlxuICB9LFxuICB7XG4gICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICBcIm5hbWVcIjogXCJmaXJzdFwiLFxuICAgIFwidmFyaWFibGVOYW1lXCI6IFwidGhyZWFkQ291bnRcIlxuICB9XG5dLFxudjIzID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICBcIm5hbWVcIjogXCJhZnRlclwiLFxuICAgIFwidmFyaWFibGVOYW1lXCI6IFwiY29tbWVudEN1cnNvclwiXG4gIH0sXG4gIHtcbiAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgIFwibmFtZVwiOiBcImZpcnN0XCIsXG4gICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJjb21tZW50Q291bnRcIlxuICB9XG5dO1xucmV0dXJuIHtcbiAgXCJraW5kXCI6IFwiUmVxdWVzdFwiLFxuICBcImZyYWdtZW50XCI6IHtcbiAgICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICAgIFwibmFtZVwiOiBcInJldmlld3NDb250YWluZXJRdWVyeVwiLFxuICAgIFwidHlwZVwiOiBcIlF1ZXJ5XCIsXG4gICAgXCJtZXRhZGF0YVwiOiBudWxsLFxuICAgIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiAodjAvKjogYW55Ki8pLFxuICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgXCJuYW1lXCI6IFwicmVwb3NpdG9yeVwiLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgXCJhcmdzXCI6ICh2MS8qOiBhbnkqLyksXG4gICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUmVwb3NpdG9yeVwiLFxuICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwicHVsbFJlcXVlc3RcIixcbiAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgXCJhcmdzXCI6ICh2Mi8qOiBhbnkqLyksXG4gICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlB1bGxSZXF1ZXN0XCIsXG4gICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICh2My8qOiBhbnkqLyksXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJGcmFnbWVudFNwcmVhZFwiLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImFnZ3JlZ2F0ZWRSZXZpZXdzQ29udGFpbmVyX3B1bGxSZXF1ZXN0XCIsXG4gICAgICAgICAgICAgICAgXCJhcmdzXCI6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY29tbWVudENvdW50XCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFyaWFibGVOYW1lXCI6IFwiY29tbWVudENvdW50XCJcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbW1lbnRDdXJzb3JcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJjb21tZW50Q3Vyc29yXCJcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInJldmlld0NvdW50XCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFyaWFibGVOYW1lXCI6IFwicmV2aWV3Q291bnRcIlxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicmV2aWV3Q3Vyc29yXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFyaWFibGVOYW1lXCI6IFwicmV2aWV3Q3Vyc29yXCJcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInRocmVhZENvdW50XCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFyaWFibGVOYW1lXCI6IFwidGhyZWFkQ291bnRcIlxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwidGhyZWFkQ3Vyc29yXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFyaWFibGVOYW1lXCI6IFwidGhyZWFkQ3Vyc29yXCJcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJGcmFnbWVudFNwcmVhZFwiLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInJldmlld3NDb250cm9sbGVyX3B1bGxSZXF1ZXN0XCIsXG4gICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGxcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiRnJhZ21lbnRTcHJlYWRcIixcbiAgICAgICAgICAgIFwibmFtZVwiOiBcInJldmlld3NDb250cm9sbGVyX3JlcG9zaXRvcnlcIixcbiAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgIFwibmFtZVwiOiBcInZpZXdlclwiLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiVXNlclwiLFxuICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJGcmFnbWVudFNwcmVhZFwiLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwicmV2aWV3c0NvbnRyb2xsZXJfdmlld2VyXCIsXG4gICAgICAgICAgICBcImFyZ3NcIjogbnVsbFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAgXCJvcGVyYXRpb25cIjoge1xuICAgIFwia2luZFwiOiBcIk9wZXJhdGlvblwiLFxuICAgIFwibmFtZVwiOiBcInJldmlld3NDb250YWluZXJRdWVyeVwiLFxuICAgIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiAodjAvKjogYW55Ki8pLFxuICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgXCJuYW1lXCI6IFwicmVwb3NpdG9yeVwiLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgXCJhcmdzXCI6ICh2MS8qOiBhbnkqLyksXG4gICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUmVwb3NpdG9yeVwiLFxuICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAodjQvKjogYW55Ki8pLFxuICAgICAgICAgICh2OC8qOiBhbnkqLyksXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgIFwibmFtZVwiOiBcInB1bGxSZXF1ZXN0XCIsXG4gICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgIFwiYXJnc1wiOiAodjIvKjogYW55Ki8pLFxuICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJQdWxsUmVxdWVzdFwiLFxuICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAodjMvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAodjcvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAodjkvKjogYW55Ki8pLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicmV2aWV3c1wiLFxuICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwiYXJnc1wiOiAodjEwLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlB1bGxSZXF1ZXN0UmV2aWV3Q29ubmVjdGlvblwiLFxuICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAodjExLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJlZGdlc1wiLFxuICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUHVsbFJlcXVlc3RSZXZpZXdFZGdlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgKHYxMi8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm5vZGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlB1bGxSZXF1ZXN0UmV2aWV3XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh2Ny8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh2MTMvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAodjE0Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHYxNS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJzdWJtaXR0ZWRBdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh2MTYvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAodjkvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiYXV0aG9yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY1Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2Ni8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjE3Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2OS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjcvKjogYW55Ki8pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAodjE4Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHYxOS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh2MjAvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAodjIxLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHY1Lyo6IGFueSovKVxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEhhbmRsZVwiLFxuICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJyZXZpZXdzXCIsXG4gICAgICAgICAgICAgICAgXCJhcmdzXCI6ICh2MTAvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgIFwiaGFuZGxlXCI6IFwiY29ubmVjdGlvblwiLFxuICAgICAgICAgICAgICAgIFwia2V5XCI6IFwiUmV2aWV3U3VtbWFyaWVzQWNjdW11bGF0b3JfcmV2aWV3c1wiLFxuICAgICAgICAgICAgICAgIFwiZmlsdGVyc1wiOiBudWxsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJyZXZpZXdUaHJlYWRzXCIsXG4gICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJhcmdzXCI6ICh2MjIvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUHVsbFJlcXVlc3RSZXZpZXdUaHJlYWRDb25uZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICh2MTEvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImVkZ2VzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJQdWxsUmVxdWVzdFJldmlld1RocmVhZEVkZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAodjEyLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibm9kZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUHVsbFJlcXVlc3RSZXZpZXdUaHJlYWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHY3Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImlzUmVzb2x2ZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicmVzb2x2ZWRCeVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiVXNlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjYvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY3Lyo6IGFueSovKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInZpZXdlckNhblJlc29sdmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwidmlld2VyQ2FuVW5yZXNvbHZlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbW1lbnRzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6ICh2MjMvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUHVsbFJlcXVlc3RSZXZpZXdDb21tZW50Q29ubmVjdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjExLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJlZGdlc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUHVsbFJlcXVlc3RSZXZpZXdDb21tZW50RWRnZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2MTIvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJub2RlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJQdWxsUmVxdWVzdFJldmlld0NvbW1lbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY3Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImF1dGhvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2NS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjE3Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2Ni8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjkvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY3Lyo6IGFueSovKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYxNC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2MTMvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaXNNaW5pbWl6ZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjE1Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYyMS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2MTgvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicGF0aFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJwb3NpdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjcmVhdGVkQXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjE2Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY5Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYxOS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2MjAvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjUvKjogYW55Ki8pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkSGFuZGxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbW1lbnRzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6ICh2MjMvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiaGFuZGxlXCI6IFwiY29ubmVjdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2V5XCI6IFwiUmV2aWV3Q29tbWVudHNBY2N1bXVsYXRvcl9jb21tZW50c1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZmlsdGVyc1wiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh2NS8qOiBhbnkqLylcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRIYW5kbGVcIixcbiAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicmV2aWV3VGhyZWFkc1wiLFxuICAgICAgICAgICAgICAgIFwiYXJnc1wiOiAodjIyLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICBcImhhbmRsZVwiOiBcImNvbm5lY3Rpb25cIixcbiAgICAgICAgICAgICAgICBcImtleVwiOiBcIlJldmlld1RocmVhZHNBY2N1bXVsYXRvcl9yZXZpZXdUaHJlYWRzXCIsXG4gICAgICAgICAgICAgICAgXCJmaWx0ZXJzXCI6IG51bGxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm51bWJlclwiLFxuICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJoZWFkUmVmTmFtZVwiLFxuICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJoZWFkUmVwb3NpdG9yeVwiLFxuICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUmVwb3NpdG9yeVwiLFxuICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAodjQvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgKHY5Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJzc2hVcmxcIixcbiAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgKHY4Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICh2Ny8qOiBhbnkqLylcbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9LFxuICAgICAgICAgICh2Ny8qOiBhbnkqLylcbiAgICAgICAgXVxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICBcIm5hbWVcIjogXCJ2aWV3ZXJcIixcbiAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlVzZXJcIixcbiAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgKHY3Lyo6IGFueSovKSxcbiAgICAgICAgICAodjYvKjogYW55Ki8pLFxuICAgICAgICAgICh2MTcvKjogYW55Ki8pXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIFwicGFyYW1zXCI6IHtcbiAgICBcIm9wZXJhdGlvbktpbmRcIjogXCJxdWVyeVwiLFxuICAgIFwibmFtZVwiOiBcInJldmlld3NDb250YWluZXJRdWVyeVwiLFxuICAgIFwiaWRcIjogbnVsbCxcbiAgICBcInRleHRcIjogXCJxdWVyeSByZXZpZXdzQ29udGFpbmVyUXVlcnkoXFxuICAkcmVwb093bmVyOiBTdHJpbmchXFxuICAkcmVwb05hbWU6IFN0cmluZyFcXG4gICRwck51bWJlcjogSW50IVxcbiAgJHJldmlld0NvdW50OiBJbnQhXFxuICAkcmV2aWV3Q3Vyc29yOiBTdHJpbmdcXG4gICR0aHJlYWRDb3VudDogSW50IVxcbiAgJHRocmVhZEN1cnNvcjogU3RyaW5nXFxuICAkY29tbWVudENvdW50OiBJbnQhXFxuICAkY29tbWVudEN1cnNvcjogU3RyaW5nXFxuKSB7XFxuICByZXBvc2l0b3J5KG93bmVyOiAkcmVwb093bmVyLCBuYW1lOiAkcmVwb05hbWUpIHtcXG4gICAgLi4ucmV2aWV3c0NvbnRyb2xsZXJfcmVwb3NpdG9yeVxcbiAgICBwdWxsUmVxdWVzdChudW1iZXI6ICRwck51bWJlcikge1xcbiAgICAgIGhlYWRSZWZPaWRcXG4gICAgICAuLi5hZ2dyZWdhdGVkUmV2aWV3c0NvbnRhaW5lcl9wdWxsUmVxdWVzdF9xZG5lWlxcbiAgICAgIC4uLnJldmlld3NDb250cm9sbGVyX3B1bGxSZXF1ZXN0XFxuICAgICAgaWRcXG4gICAgfVxcbiAgICBpZFxcbiAgfVxcbiAgdmlld2VyIHtcXG4gICAgLi4ucmV2aWV3c0NvbnRyb2xsZXJfdmlld2VyXFxuICAgIGlkXFxuICB9XFxufVxcblxcbmZyYWdtZW50IGFnZ3JlZ2F0ZWRSZXZpZXdzQ29udGFpbmVyX3B1bGxSZXF1ZXN0X3FkbmVaIG9uIFB1bGxSZXF1ZXN0IHtcXG4gIGlkXFxuICAuLi5yZXZpZXdTdW1tYXJpZXNBY2N1bXVsYXRvcl9wdWxsUmVxdWVzdF8yenpjOTZcXG4gIC4uLnJldmlld1RocmVhZHNBY2N1bXVsYXRvcl9wdWxsUmVxdWVzdF9DS0R2alxcbn1cXG5cXG5mcmFnbWVudCBlbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXJfcmVhY3RhYmxlIG9uIFJlYWN0YWJsZSB7XFxuICBpZFxcbiAgLi4uZW1vamlSZWFjdGlvbnNWaWV3X3JlYWN0YWJsZVxcbn1cXG5cXG5mcmFnbWVudCBlbW9qaVJlYWN0aW9uc1ZpZXdfcmVhY3RhYmxlIG9uIFJlYWN0YWJsZSB7XFxuICBpZFxcbiAgcmVhY3Rpb25Hcm91cHMge1xcbiAgICBjb250ZW50XFxuICAgIHZpZXdlckhhc1JlYWN0ZWRcXG4gICAgdXNlcnMge1xcbiAgICAgIHRvdGFsQ291bnRcXG4gICAgfVxcbiAgfVxcbiAgdmlld2VyQ2FuUmVhY3RcXG59XFxuXFxuZnJhZ21lbnQgcHJDaGVja291dENvbnRyb2xsZXJfcHVsbFJlcXVlc3Qgb24gUHVsbFJlcXVlc3Qge1xcbiAgbnVtYmVyXFxuICBoZWFkUmVmTmFtZVxcbiAgaGVhZFJlcG9zaXRvcnkge1xcbiAgICBuYW1lXFxuICAgIHVybFxcbiAgICBzc2hVcmxcXG4gICAgb3duZXIge1xcbiAgICAgIF9fdHlwZW5hbWVcXG4gICAgICBsb2dpblxcbiAgICAgIGlkXFxuICAgIH1cXG4gICAgaWRcXG4gIH1cXG59XFxuXFxuZnJhZ21lbnQgcHJDaGVja291dENvbnRyb2xsZXJfcmVwb3NpdG9yeSBvbiBSZXBvc2l0b3J5IHtcXG4gIG5hbWVcXG4gIG93bmVyIHtcXG4gICAgX190eXBlbmFtZVxcbiAgICBsb2dpblxcbiAgICBpZFxcbiAgfVxcbn1cXG5cXG5mcmFnbWVudCByZXZpZXdDb21tZW50c0FjY3VtdWxhdG9yX3Jldmlld1RocmVhZF8xVmJVbUwgb24gUHVsbFJlcXVlc3RSZXZpZXdUaHJlYWQge1xcbiAgaWRcXG4gIGNvbW1lbnRzKGZpcnN0OiAkY29tbWVudENvdW50LCBhZnRlcjogJGNvbW1lbnRDdXJzb3IpIHtcXG4gICAgcGFnZUluZm8ge1xcbiAgICAgIGhhc05leHRQYWdlXFxuICAgICAgZW5kQ3Vyc29yXFxuICAgIH1cXG4gICAgZWRnZXMge1xcbiAgICAgIGN1cnNvclxcbiAgICAgIG5vZGUge1xcbiAgICAgICAgaWRcXG4gICAgICAgIGF1dGhvciB7XFxuICAgICAgICAgIF9fdHlwZW5hbWVcXG4gICAgICAgICAgYXZhdGFyVXJsXFxuICAgICAgICAgIGxvZ2luXFxuICAgICAgICAgIHVybFxcbiAgICAgICAgICAuLi4gb24gTm9kZSB7XFxuICAgICAgICAgICAgaWRcXG4gICAgICAgICAgfVxcbiAgICAgICAgfVxcbiAgICAgICAgYm9keUhUTUxcXG4gICAgICAgIGJvZHlcXG4gICAgICAgIGlzTWluaW1pemVkXFxuICAgICAgICBzdGF0ZVxcbiAgICAgICAgdmlld2VyQ2FuUmVhY3RcXG4gICAgICAgIHZpZXdlckNhblVwZGF0ZVxcbiAgICAgICAgcGF0aFxcbiAgICAgICAgcG9zaXRpb25cXG4gICAgICAgIGNyZWF0ZWRBdFxcbiAgICAgICAgbGFzdEVkaXRlZEF0XFxuICAgICAgICB1cmxcXG4gICAgICAgIGF1dGhvckFzc29jaWF0aW9uXFxuICAgICAgICAuLi5lbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXJfcmVhY3RhYmxlXFxuICAgICAgICBfX3R5cGVuYW1lXFxuICAgICAgfVxcbiAgICB9XFxuICB9XFxufVxcblxcbmZyYWdtZW50IHJldmlld1N1bW1hcmllc0FjY3VtdWxhdG9yX3B1bGxSZXF1ZXN0XzJ6emM5NiBvbiBQdWxsUmVxdWVzdCB7XFxuICB1cmxcXG4gIHJldmlld3MoZmlyc3Q6ICRyZXZpZXdDb3VudCwgYWZ0ZXI6ICRyZXZpZXdDdXJzb3IpIHtcXG4gICAgcGFnZUluZm8ge1xcbiAgICAgIGhhc05leHRQYWdlXFxuICAgICAgZW5kQ3Vyc29yXFxuICAgIH1cXG4gICAgZWRnZXMge1xcbiAgICAgIGN1cnNvclxcbiAgICAgIG5vZGUge1xcbiAgICAgICAgaWRcXG4gICAgICAgIGJvZHlcXG4gICAgICAgIGJvZHlIVE1MXFxuICAgICAgICBzdGF0ZVxcbiAgICAgICAgc3VibWl0dGVkQXRcXG4gICAgICAgIGxhc3RFZGl0ZWRBdFxcbiAgICAgICAgdXJsXFxuICAgICAgICBhdXRob3Ige1xcbiAgICAgICAgICBfX3R5cGVuYW1lXFxuICAgICAgICAgIGxvZ2luXFxuICAgICAgICAgIGF2YXRhclVybFxcbiAgICAgICAgICB1cmxcXG4gICAgICAgICAgLi4uIG9uIE5vZGUge1xcbiAgICAgICAgICAgIGlkXFxuICAgICAgICAgIH1cXG4gICAgICAgIH1cXG4gICAgICAgIHZpZXdlckNhblVwZGF0ZVxcbiAgICAgICAgYXV0aG9yQXNzb2NpYXRpb25cXG4gICAgICAgIC4uLmVtb2ppUmVhY3Rpb25zQ29udHJvbGxlcl9yZWFjdGFibGVcXG4gICAgICAgIF9fdHlwZW5hbWVcXG4gICAgICB9XFxuICAgIH1cXG4gIH1cXG59XFxuXFxuZnJhZ21lbnQgcmV2aWV3VGhyZWFkc0FjY3VtdWxhdG9yX3B1bGxSZXF1ZXN0X0NLRHZqIG9uIFB1bGxSZXF1ZXN0IHtcXG4gIHVybFxcbiAgcmV2aWV3VGhyZWFkcyhmaXJzdDogJHRocmVhZENvdW50LCBhZnRlcjogJHRocmVhZEN1cnNvcikge1xcbiAgICBwYWdlSW5mbyB7XFxuICAgICAgaGFzTmV4dFBhZ2VcXG4gICAgICBlbmRDdXJzb3JcXG4gICAgfVxcbiAgICBlZGdlcyB7XFxuICAgICAgY3Vyc29yXFxuICAgICAgbm9kZSB7XFxuICAgICAgICBpZFxcbiAgICAgICAgaXNSZXNvbHZlZFxcbiAgICAgICAgcmVzb2x2ZWRCeSB7XFxuICAgICAgICAgIGxvZ2luXFxuICAgICAgICAgIGlkXFxuICAgICAgICB9XFxuICAgICAgICB2aWV3ZXJDYW5SZXNvbHZlXFxuICAgICAgICB2aWV3ZXJDYW5VbnJlc29sdmVcXG4gICAgICAgIC4uLnJldmlld0NvbW1lbnRzQWNjdW11bGF0b3JfcmV2aWV3VGhyZWFkXzFWYlVtTFxcbiAgICAgICAgX190eXBlbmFtZVxcbiAgICAgIH1cXG4gICAgfVxcbiAgfVxcbn1cXG5cXG5mcmFnbWVudCByZXZpZXdzQ29udHJvbGxlcl9wdWxsUmVxdWVzdCBvbiBQdWxsUmVxdWVzdCB7XFxuICBpZFxcbiAgLi4ucHJDaGVja291dENvbnRyb2xsZXJfcHVsbFJlcXVlc3RcXG59XFxuXFxuZnJhZ21lbnQgcmV2aWV3c0NvbnRyb2xsZXJfcmVwb3NpdG9yeSBvbiBSZXBvc2l0b3J5IHtcXG4gIC4uLnByQ2hlY2tvdXRDb250cm9sbGVyX3JlcG9zaXRvcnlcXG59XFxuXFxuZnJhZ21lbnQgcmV2aWV3c0NvbnRyb2xsZXJfdmlld2VyIG9uIFVzZXIge1xcbiAgaWRcXG4gIGxvZ2luXFxuICBhdmF0YXJVcmxcXG59XFxuXCIsXG4gICAgXCJtZXRhZGF0YVwiOiB7fVxuICB9XG59O1xufSkoKTtcbi8vIHByZXR0aWVyLWlnbm9yZVxuKG5vZGUvKjogYW55Ki8pLmhhc2ggPSAnYjA1Y2MzMGNiMDc4MDAzYWZiYTliZDhjMmRlOTg5ZmEnO1xubW9kdWxlLmV4cG9ydHMgPSBub2RlO1xuIl19