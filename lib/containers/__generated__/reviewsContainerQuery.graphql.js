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
const node /*: ConcreteRequest*/ = function () {
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
      "selections": [v5 /*: any*/, v6 /*: any*/, v7 /*: any*/]
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
      "argumentDefinitions": v0 /*: any*/,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "repository",
        "storageKey": null,
        "args": v1 /*: any*/,
        "concreteType": "Repository",
        "plural": false,
        "selections": [{
          "kind": "LinkedField",
          "alias": null,
          "name": "pullRequest",
          "storageKey": null,
          "args": v2 /*: any*/,
          "concreteType": "PullRequest",
          "plural": false,
          "selections": [v3 /*: any*/, {
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
      "argumentDefinitions": v0 /*: any*/,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "repository",
        "storageKey": null,
        "args": v1 /*: any*/,
        "concreteType": "Repository",
        "plural": false,
        "selections": [v4 /*: any*/, v8 /*: any*/, {
          "kind": "LinkedField",
          "alias": null,
          "name": "pullRequest",
          "storageKey": null,
          "args": v2 /*: any*/,
          "concreteType": "PullRequest",
          "plural": false,
          "selections": [v3 /*: any*/, v7 /*: any*/, v9 /*: any*/, {
            "kind": "LinkedField",
            "alias": null,
            "name": "reviews",
            "storageKey": null,
            "args": v10 /*: any*/,
            "concreteType": "PullRequestReviewConnection",
            "plural": false,
            "selections": [v11 /*: any*/, {
              "kind": "LinkedField",
              "alias": null,
              "name": "edges",
              "storageKey": null,
              "args": null,
              "concreteType": "PullRequestReviewEdge",
              "plural": true,
              "selections": [v12 /*: any*/, {
                "kind": "LinkedField",
                "alias": null,
                "name": "node",
                "storageKey": null,
                "args": null,
                "concreteType": "PullRequestReview",
                "plural": false,
                "selections": [v7 /*: any*/, v13 /*: any*/, v14 /*: any*/, v15 /*: any*/, {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "submittedAt",
                  "args": null,
                  "storageKey": null
                }, v16 /*: any*/, v9 /*: any*/, {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "author",
                  "storageKey": null,
                  "args": null,
                  "concreteType": null,
                  "plural": false,
                  "selections": [v5 /*: any*/, v6 /*: any*/, v17 /*: any*/, v9 /*: any*/, v7 /*: any*/]
                }, v18 /*: any*/, v19 /*: any*/, v20 /*: any*/, v21 /*: any*/, v5 /*: any*/]
              }]
            }]
          }, {
            "kind": "LinkedHandle",
            "alias": null,
            "name": "reviews",
            "args": v10 /*: any*/,
            "handle": "connection",
            "key": "ReviewSummariesAccumulator_reviews",
            "filters": null
          }, {
            "kind": "LinkedField",
            "alias": null,
            "name": "reviewThreads",
            "storageKey": null,
            "args": v22 /*: any*/,
            "concreteType": "PullRequestReviewThreadConnection",
            "plural": false,
            "selections": [v11 /*: any*/, {
              "kind": "LinkedField",
              "alias": null,
              "name": "edges",
              "storageKey": null,
              "args": null,
              "concreteType": "PullRequestReviewThreadEdge",
              "plural": true,
              "selections": [v12 /*: any*/, {
                "kind": "LinkedField",
                "alias": null,
                "name": "node",
                "storageKey": null,
                "args": null,
                "concreteType": "PullRequestReviewThread",
                "plural": false,
                "selections": [v7 /*: any*/, {
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
                  "selections": [v6 /*: any*/, v7 /*: any*/]
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
                  "args": v23 /*: any*/,
                  "concreteType": "PullRequestReviewCommentConnection",
                  "plural": false,
                  "selections": [v11 /*: any*/, {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "edges",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "PullRequestReviewCommentEdge",
                    "plural": true,
                    "selections": [v12 /*: any*/, {
                      "kind": "LinkedField",
                      "alias": null,
                      "name": "node",
                      "storageKey": null,
                      "args": null,
                      "concreteType": "PullRequestReviewComment",
                      "plural": false,
                      "selections": [v7 /*: any*/, {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "author",
                        "storageKey": null,
                        "args": null,
                        "concreteType": null,
                        "plural": false,
                        "selections": [v5 /*: any*/, v17 /*: any*/, v6 /*: any*/, v9 /*: any*/, v7 /*: any*/]
                      }, v14 /*: any*/, v13 /*: any*/, {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "isMinimized",
                        "args": null,
                        "storageKey": null
                      }, v15 /*: any*/, v21 /*: any*/, v18 /*: any*/, {
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
                      }, v16 /*: any*/, v9 /*: any*/, v19 /*: any*/, v20 /*: any*/, v5 /*: any*/]
                    }]
                  }]
                }, {
                  "kind": "LinkedHandle",
                  "alias": null,
                  "name": "comments",
                  "args": v23 /*: any*/,
                  "handle": "connection",
                  "key": "ReviewCommentsAccumulator_comments",
                  "filters": null
                }, v5 /*: any*/]
              }]
            }]
          }, {
            "kind": "LinkedHandle",
            "alias": null,
            "name": "reviewThreads",
            "args": v22 /*: any*/,
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
            "selections": [v4 /*: any*/, v9 /*: any*/, {
              "kind": "ScalarField",
              "alias": null,
              "name": "sshUrl",
              "args": null,
              "storageKey": null
            }, v8 /*: any*/, v7 /*: any*/]
          }]
        }, v7 /*: any*/]
      }, {
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "User",
        "plural": false,
        "selections": [v7 /*: any*/, v6 /*: any*/, v17 /*: any*/]
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
}();
// prettier-ignore
node /*: any*/.hash = 'b05cc30cb078003afba9bd8c2de989fa';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJub2RlIiwidjAiLCJ2MSIsInYyIiwidjMiLCJ2NCIsInY1IiwidjYiLCJ2NyIsInY4IiwidjkiLCJ2MTAiLCJ2MTEiLCJ2MTIiLCJ2MTMiLCJ2MTQiLCJ2MTUiLCJ2MTYiLCJ2MTciLCJ2MTgiLCJ2MTkiLCJ2MjAiLCJ2MjEiLCJ2MjIiLCJ2MjMiLCJoYXNoIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJzb3VyY2VzIjpbInJldmlld3NDb250YWluZXJRdWVyeS5ncmFwaHFsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZsb3dcbiAqIEByZWxheUhhc2ggMWYyZGQxYjEzMDEwZGZlYjM0MDc1OTlmZjFiN2U4M2FcbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qOjpcbmltcG9ydCB0eXBlIHsgQ29uY3JldGVSZXF1ZXN0IH0gZnJvbSAncmVsYXktcnVudGltZSc7XG50eXBlIGFnZ3JlZ2F0ZWRSZXZpZXdzQ29udGFpbmVyX3B1bGxSZXF1ZXN0JHJlZiA9IGFueTtcbnR5cGUgcmV2aWV3c0NvbnRyb2xsZXJfcHVsbFJlcXVlc3QkcmVmID0gYW55O1xudHlwZSByZXZpZXdzQ29udHJvbGxlcl9yZXBvc2l0b3J5JHJlZiA9IGFueTtcbnR5cGUgcmV2aWV3c0NvbnRyb2xsZXJfdmlld2VyJHJlZiA9IGFueTtcbmV4cG9ydCB0eXBlIHJldmlld3NDb250YWluZXJRdWVyeVZhcmlhYmxlcyA9IHt8XG4gIHJlcG9Pd25lcjogc3RyaW5nLFxuICByZXBvTmFtZTogc3RyaW5nLFxuICBwck51bWJlcjogbnVtYmVyLFxuICByZXZpZXdDb3VudDogbnVtYmVyLFxuICByZXZpZXdDdXJzb3I/OiA/c3RyaW5nLFxuICB0aHJlYWRDb3VudDogbnVtYmVyLFxuICB0aHJlYWRDdXJzb3I/OiA/c3RyaW5nLFxuICBjb21tZW50Q291bnQ6IG51bWJlcixcbiAgY29tbWVudEN1cnNvcj86ID9zdHJpbmcsXG58fTtcbmV4cG9ydCB0eXBlIHJldmlld3NDb250YWluZXJRdWVyeVJlc3BvbnNlID0ge3xcbiAgK3JlcG9zaXRvcnk6ID97fFxuICAgICtwdWxsUmVxdWVzdDogP3t8XG4gICAgICAraGVhZFJlZk9pZDogYW55LFxuICAgICAgKyRmcmFnbWVudFJlZnM6IGFnZ3JlZ2F0ZWRSZXZpZXdzQ29udGFpbmVyX3B1bGxSZXF1ZXN0JHJlZiAmIHJldmlld3NDb250cm9sbGVyX3B1bGxSZXF1ZXN0JHJlZixcbiAgICB8fSxcbiAgICArJGZyYWdtZW50UmVmczogcmV2aWV3c0NvbnRyb2xsZXJfcmVwb3NpdG9yeSRyZWYsXG4gIHx9LFxuICArdmlld2VyOiB7fFxuICAgICskZnJhZ21lbnRSZWZzOiByZXZpZXdzQ29udHJvbGxlcl92aWV3ZXIkcmVmXG4gIHx9LFxufH07XG5leHBvcnQgdHlwZSByZXZpZXdzQ29udGFpbmVyUXVlcnkgPSB7fFxuICB2YXJpYWJsZXM6IHJldmlld3NDb250YWluZXJRdWVyeVZhcmlhYmxlcyxcbiAgcmVzcG9uc2U6IHJldmlld3NDb250YWluZXJRdWVyeVJlc3BvbnNlLFxufH07XG4qL1xuXG5cbi8qXG5xdWVyeSByZXZpZXdzQ29udGFpbmVyUXVlcnkoXG4gICRyZXBvT3duZXI6IFN0cmluZyFcbiAgJHJlcG9OYW1lOiBTdHJpbmchXG4gICRwck51bWJlcjogSW50IVxuICAkcmV2aWV3Q291bnQ6IEludCFcbiAgJHJldmlld0N1cnNvcjogU3RyaW5nXG4gICR0aHJlYWRDb3VudDogSW50IVxuICAkdGhyZWFkQ3Vyc29yOiBTdHJpbmdcbiAgJGNvbW1lbnRDb3VudDogSW50IVxuICAkY29tbWVudEN1cnNvcjogU3RyaW5nXG4pIHtcbiAgcmVwb3NpdG9yeShvd25lcjogJHJlcG9Pd25lciwgbmFtZTogJHJlcG9OYW1lKSB7XG4gICAgLi4ucmV2aWV3c0NvbnRyb2xsZXJfcmVwb3NpdG9yeVxuICAgIHB1bGxSZXF1ZXN0KG51bWJlcjogJHByTnVtYmVyKSB7XG4gICAgICBoZWFkUmVmT2lkXG4gICAgICAuLi5hZ2dyZWdhdGVkUmV2aWV3c0NvbnRhaW5lcl9wdWxsUmVxdWVzdF9xZG5lWlxuICAgICAgLi4ucmV2aWV3c0NvbnRyb2xsZXJfcHVsbFJlcXVlc3RcbiAgICAgIGlkXG4gICAgfVxuICAgIGlkXG4gIH1cbiAgdmlld2VyIHtcbiAgICAuLi5yZXZpZXdzQ29udHJvbGxlcl92aWV3ZXJcbiAgICBpZFxuICB9XG59XG5cbmZyYWdtZW50IGFnZ3JlZ2F0ZWRSZXZpZXdzQ29udGFpbmVyX3B1bGxSZXF1ZXN0X3FkbmVaIG9uIFB1bGxSZXF1ZXN0IHtcbiAgaWRcbiAgLi4ucmV2aWV3U3VtbWFyaWVzQWNjdW11bGF0b3JfcHVsbFJlcXVlc3RfMnp6Yzk2XG4gIC4uLnJldmlld1RocmVhZHNBY2N1bXVsYXRvcl9wdWxsUmVxdWVzdF9DS0R2alxufVxuXG5mcmFnbWVudCBlbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXJfcmVhY3RhYmxlIG9uIFJlYWN0YWJsZSB7XG4gIGlkXG4gIC4uLmVtb2ppUmVhY3Rpb25zVmlld19yZWFjdGFibGVcbn1cblxuZnJhZ21lbnQgZW1vamlSZWFjdGlvbnNWaWV3X3JlYWN0YWJsZSBvbiBSZWFjdGFibGUge1xuICBpZFxuICByZWFjdGlvbkdyb3VwcyB7XG4gICAgY29udGVudFxuICAgIHZpZXdlckhhc1JlYWN0ZWRcbiAgICB1c2VycyB7XG4gICAgICB0b3RhbENvdW50XG4gICAgfVxuICB9XG4gIHZpZXdlckNhblJlYWN0XG59XG5cbmZyYWdtZW50IHByQ2hlY2tvdXRDb250cm9sbGVyX3B1bGxSZXF1ZXN0IG9uIFB1bGxSZXF1ZXN0IHtcbiAgbnVtYmVyXG4gIGhlYWRSZWZOYW1lXG4gIGhlYWRSZXBvc2l0b3J5IHtcbiAgICBuYW1lXG4gICAgdXJsXG4gICAgc3NoVXJsXG4gICAgb3duZXIge1xuICAgICAgX190eXBlbmFtZVxuICAgICAgbG9naW5cbiAgICAgIGlkXG4gICAgfVxuICAgIGlkXG4gIH1cbn1cblxuZnJhZ21lbnQgcHJDaGVja291dENvbnRyb2xsZXJfcmVwb3NpdG9yeSBvbiBSZXBvc2l0b3J5IHtcbiAgbmFtZVxuICBvd25lciB7XG4gICAgX190eXBlbmFtZVxuICAgIGxvZ2luXG4gICAgaWRcbiAgfVxufVxuXG5mcmFnbWVudCByZXZpZXdDb21tZW50c0FjY3VtdWxhdG9yX3Jldmlld1RocmVhZF8xVmJVbUwgb24gUHVsbFJlcXVlc3RSZXZpZXdUaHJlYWQge1xuICBpZFxuICBjb21tZW50cyhmaXJzdDogJGNvbW1lbnRDb3VudCwgYWZ0ZXI6ICRjb21tZW50Q3Vyc29yKSB7XG4gICAgcGFnZUluZm8ge1xuICAgICAgaGFzTmV4dFBhZ2VcbiAgICAgIGVuZEN1cnNvclxuICAgIH1cbiAgICBlZGdlcyB7XG4gICAgICBjdXJzb3JcbiAgICAgIG5vZGUge1xuICAgICAgICBpZFxuICAgICAgICBhdXRob3Ige1xuICAgICAgICAgIF9fdHlwZW5hbWVcbiAgICAgICAgICBhdmF0YXJVcmxcbiAgICAgICAgICBsb2dpblxuICAgICAgICAgIHVybFxuICAgICAgICAgIC4uLiBvbiBOb2RlIHtcbiAgICAgICAgICAgIGlkXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGJvZHlIVE1MXG4gICAgICAgIGJvZHlcbiAgICAgICAgaXNNaW5pbWl6ZWRcbiAgICAgICAgc3RhdGVcbiAgICAgICAgdmlld2VyQ2FuUmVhY3RcbiAgICAgICAgdmlld2VyQ2FuVXBkYXRlXG4gICAgICAgIHBhdGhcbiAgICAgICAgcG9zaXRpb25cbiAgICAgICAgY3JlYXRlZEF0XG4gICAgICAgIGxhc3RFZGl0ZWRBdFxuICAgICAgICB1cmxcbiAgICAgICAgYXV0aG9yQXNzb2NpYXRpb25cbiAgICAgICAgLi4uZW1vamlSZWFjdGlvbnNDb250cm9sbGVyX3JlYWN0YWJsZVxuICAgICAgICBfX3R5cGVuYW1lXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZyYWdtZW50IHJldmlld1N1bW1hcmllc0FjY3VtdWxhdG9yX3B1bGxSZXF1ZXN0XzJ6emM5NiBvbiBQdWxsUmVxdWVzdCB7XG4gIHVybFxuICByZXZpZXdzKGZpcnN0OiAkcmV2aWV3Q291bnQsIGFmdGVyOiAkcmV2aWV3Q3Vyc29yKSB7XG4gICAgcGFnZUluZm8ge1xuICAgICAgaGFzTmV4dFBhZ2VcbiAgICAgIGVuZEN1cnNvclxuICAgIH1cbiAgICBlZGdlcyB7XG4gICAgICBjdXJzb3JcbiAgICAgIG5vZGUge1xuICAgICAgICBpZFxuICAgICAgICBib2R5XG4gICAgICAgIGJvZHlIVE1MXG4gICAgICAgIHN0YXRlXG4gICAgICAgIHN1Ym1pdHRlZEF0XG4gICAgICAgIGxhc3RFZGl0ZWRBdFxuICAgICAgICB1cmxcbiAgICAgICAgYXV0aG9yIHtcbiAgICAgICAgICBfX3R5cGVuYW1lXG4gICAgICAgICAgbG9naW5cbiAgICAgICAgICBhdmF0YXJVcmxcbiAgICAgICAgICB1cmxcbiAgICAgICAgICAuLi4gb24gTm9kZSB7XG4gICAgICAgICAgICBpZFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB2aWV3ZXJDYW5VcGRhdGVcbiAgICAgICAgYXV0aG9yQXNzb2NpYXRpb25cbiAgICAgICAgLi4uZW1vamlSZWFjdGlvbnNDb250cm9sbGVyX3JlYWN0YWJsZVxuICAgICAgICBfX3R5cGVuYW1lXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZyYWdtZW50IHJldmlld1RocmVhZHNBY2N1bXVsYXRvcl9wdWxsUmVxdWVzdF9DS0R2aiBvbiBQdWxsUmVxdWVzdCB7XG4gIHVybFxuICByZXZpZXdUaHJlYWRzKGZpcnN0OiAkdGhyZWFkQ291bnQsIGFmdGVyOiAkdGhyZWFkQ3Vyc29yKSB7XG4gICAgcGFnZUluZm8ge1xuICAgICAgaGFzTmV4dFBhZ2VcbiAgICAgIGVuZEN1cnNvclxuICAgIH1cbiAgICBlZGdlcyB7XG4gICAgICBjdXJzb3JcbiAgICAgIG5vZGUge1xuICAgICAgICBpZFxuICAgICAgICBpc1Jlc29sdmVkXG4gICAgICAgIHJlc29sdmVkQnkge1xuICAgICAgICAgIGxvZ2luXG4gICAgICAgICAgaWRcbiAgICAgICAgfVxuICAgICAgICB2aWV3ZXJDYW5SZXNvbHZlXG4gICAgICAgIHZpZXdlckNhblVucmVzb2x2ZVxuICAgICAgICAuLi5yZXZpZXdDb21tZW50c0FjY3VtdWxhdG9yX3Jldmlld1RocmVhZF8xVmJVbUxcbiAgICAgICAgX190eXBlbmFtZVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mcmFnbWVudCByZXZpZXdzQ29udHJvbGxlcl9wdWxsUmVxdWVzdCBvbiBQdWxsUmVxdWVzdCB7XG4gIGlkXG4gIC4uLnByQ2hlY2tvdXRDb250cm9sbGVyX3B1bGxSZXF1ZXN0XG59XG5cbmZyYWdtZW50IHJldmlld3NDb250cm9sbGVyX3JlcG9zaXRvcnkgb24gUmVwb3NpdG9yeSB7XG4gIC4uLnByQ2hlY2tvdXRDb250cm9sbGVyX3JlcG9zaXRvcnlcbn1cblxuZnJhZ21lbnQgcmV2aWV3c0NvbnRyb2xsZXJfdmlld2VyIG9uIFVzZXIge1xuICBpZFxuICBsb2dpblxuICBhdmF0YXJVcmxcbn1cbiovXG5cbmNvbnN0IG5vZGUvKjogQ29uY3JldGVSZXF1ZXN0Ki8gPSAoZnVuY3Rpb24oKXtcbnZhciB2MCA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICBcIm5hbWVcIjogXCJyZXBvT3duZXJcIixcbiAgICBcInR5cGVcIjogXCJTdHJpbmchXCIsXG4gICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICB9LFxuICB7XG4gICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgIFwibmFtZVwiOiBcInJlcG9OYW1lXCIsXG4gICAgXCJ0eXBlXCI6IFwiU3RyaW5nIVwiLFxuICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgfSxcbiAge1xuICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICBcIm5hbWVcIjogXCJwck51bWJlclwiLFxuICAgIFwidHlwZVwiOiBcIkludCFcIixcbiAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gIH0sXG4gIHtcbiAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwicmV2aWV3Q291bnRcIixcbiAgICBcInR5cGVcIjogXCJJbnQhXCIsXG4gICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICB9LFxuICB7XG4gICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgIFwibmFtZVwiOiBcInJldmlld0N1cnNvclwiLFxuICAgIFwidHlwZVwiOiBcIlN0cmluZ1wiLFxuICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgfSxcbiAge1xuICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICBcIm5hbWVcIjogXCJ0aHJlYWRDb3VudFwiLFxuICAgIFwidHlwZVwiOiBcIkludCFcIixcbiAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gIH0sXG4gIHtcbiAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwidGhyZWFkQ3Vyc29yXCIsXG4gICAgXCJ0eXBlXCI6IFwiU3RyaW5nXCIsXG4gICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICB9LFxuICB7XG4gICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgIFwibmFtZVwiOiBcImNvbW1lbnRDb3VudFwiLFxuICAgIFwidHlwZVwiOiBcIkludCFcIixcbiAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gIH0sXG4gIHtcbiAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwiY29tbWVudEN1cnNvclwiLFxuICAgIFwidHlwZVwiOiBcIlN0cmluZ1wiLFxuICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgfVxuXSxcbnYxID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICBcIm5hbWVcIjogXCJuYW1lXCIsXG4gICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJyZXBvTmFtZVwiXG4gIH0sXG4gIHtcbiAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgIFwibmFtZVwiOiBcIm93bmVyXCIsXG4gICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJyZXBvT3duZXJcIlxuICB9XG5dLFxudjIgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgIFwibmFtZVwiOiBcIm51bWJlclwiLFxuICAgIFwidmFyaWFibGVOYW1lXCI6IFwicHJOdW1iZXJcIlxuICB9XG5dLFxudjMgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiaGVhZFJlZk9pZFwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52NCA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJuYW1lXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnY1ID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcIl9fdHlwZW5hbWVcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjYgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwibG9naW5cIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjcgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiaWRcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjggPSB7XG4gIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwib3duZXJcIixcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcImNvbmNyZXRlVHlwZVwiOiBudWxsLFxuICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAodjUvKjogYW55Ki8pLFxuICAgICh2Ni8qOiBhbnkqLyksXG4gICAgKHY3Lyo6IGFueSovKVxuICBdXG59LFxudjkgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwidXJsXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnYxMCA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgXCJuYW1lXCI6IFwiYWZ0ZXJcIixcbiAgICBcInZhcmlhYmxlTmFtZVwiOiBcInJldmlld0N1cnNvclwiXG4gIH0sXG4gIHtcbiAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgIFwibmFtZVwiOiBcImZpcnN0XCIsXG4gICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJyZXZpZXdDb3VudFwiXG4gIH1cbl0sXG52MTEgPSB7XG4gIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwicGFnZUluZm9cIixcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcImNvbmNyZXRlVHlwZVwiOiBcIlBhZ2VJbmZvXCIsXG4gIFwicGx1cmFsXCI6IGZhbHNlLFxuICBcInNlbGVjdGlvbnNcIjogW1xuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJoYXNOZXh0UGFnZVwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcImVuZEN1cnNvclwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH1cbiAgXVxufSxcbnYxMiA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJjdXJzb3JcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjEzID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcImJvZHlcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjE0ID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcImJvZHlIVE1MXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnYxNSA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJzdGF0ZVwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52MTYgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwibGFzdEVkaXRlZEF0XCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnYxNyA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJhdmF0YXJVcmxcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjE4ID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcInZpZXdlckNhblVwZGF0ZVwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52MTkgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiYXV0aG9yQXNzb2NpYXRpb25cIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjIwID0ge1xuICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcInJlYWN0aW9uR3JvdXBzXCIsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJjb25jcmV0ZVR5cGVcIjogXCJSZWFjdGlvbkdyb3VwXCIsXG4gIFwicGx1cmFsXCI6IHRydWUsXG4gIFwic2VsZWN0aW9uc1wiOiBbXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcImNvbnRlbnRcIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJ2aWV3ZXJIYXNSZWFjdGVkXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwidXNlcnNcIixcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlJlYWN0aW5nVXNlckNvbm5lY3Rpb25cIixcbiAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgIFwibmFtZVwiOiBcInRvdGFsQ291bnRcIixcbiAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICBdXG59LFxudjIxID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcInZpZXdlckNhblJlYWN0XCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnYyMiA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgXCJuYW1lXCI6IFwiYWZ0ZXJcIixcbiAgICBcInZhcmlhYmxlTmFtZVwiOiBcInRocmVhZEN1cnNvclwiXG4gIH0sXG4gIHtcbiAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgIFwibmFtZVwiOiBcImZpcnN0XCIsXG4gICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJ0aHJlYWRDb3VudFwiXG4gIH1cbl0sXG52MjMgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgIFwibmFtZVwiOiBcImFmdGVyXCIsXG4gICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJjb21tZW50Q3Vyc29yXCJcbiAgfSxcbiAge1xuICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgXCJuYW1lXCI6IFwiZmlyc3RcIixcbiAgICBcInZhcmlhYmxlTmFtZVwiOiBcImNvbW1lbnRDb3VudFwiXG4gIH1cbl07XG5yZXR1cm4ge1xuICBcImtpbmRcIjogXCJSZXF1ZXN0XCIsXG4gIFwiZnJhZ21lbnRcIjoge1xuICAgIFwia2luZFwiOiBcIkZyYWdtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwicmV2aWV3c0NvbnRhaW5lclF1ZXJ5XCIsXG4gICAgXCJ0eXBlXCI6IFwiUXVlcnlcIixcbiAgICBcIm1ldGFkYXRhXCI6IG51bGwsXG4gICAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6ICh2MC8qOiBhbnkqLyksXG4gICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICBcIm5hbWVcIjogXCJyZXBvc2l0b3J5XCIsXG4gICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICBcImFyZ3NcIjogKHYxLyo6IGFueSovKSxcbiAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJSZXBvc2l0b3J5XCIsXG4gICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJwdWxsUmVxdWVzdFwiLFxuICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICBcImFyZ3NcIjogKHYyLyo6IGFueSovKSxcbiAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUHVsbFJlcXVlc3RcIixcbiAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgKHYzLyo6IGFueSovKSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkZyYWdtZW50U3ByZWFkXCIsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiYWdncmVnYXRlZFJldmlld3NDb250YWluZXJfcHVsbFJlcXVlc3RcIixcbiAgICAgICAgICAgICAgICBcImFyZ3NcIjogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjb21tZW50Q291bnRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJjb21tZW50Q291bnRcIlxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY29tbWVudEN1cnNvclwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhcmlhYmxlTmFtZVwiOiBcImNvbW1lbnRDdXJzb3JcIlxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicmV2aWV3Q291bnRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJyZXZpZXdDb3VudFwiXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJyZXZpZXdDdXJzb3JcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJyZXZpZXdDdXJzb3JcIlxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwidGhyZWFkQ291bnRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJ0aHJlYWRDb3VudFwiXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ0aHJlYWRDdXJzb3JcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJ0aHJlYWRDdXJzb3JcIlxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkZyYWdtZW50U3ByZWFkXCIsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicmV2aWV3c0NvbnRyb2xsZXJfcHVsbFJlcXVlc3RcIixcbiAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJGcmFnbWVudFNwcmVhZFwiLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwicmV2aWV3c0NvbnRyb2xsZXJfcmVwb3NpdG9yeVwiLFxuICAgICAgICAgICAgXCJhcmdzXCI6IG51bGxcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgXCJuYW1lXCI6IFwidmlld2VyXCIsXG4gICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJVc2VyXCIsXG4gICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIkZyYWdtZW50U3ByZWFkXCIsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJyZXZpZXdzQ29udHJvbGxlcl92aWV3ZXJcIixcbiAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9LFxuICBcIm9wZXJhdGlvblwiOiB7XG4gICAgXCJraW5kXCI6IFwiT3BlcmF0aW9uXCIsXG4gICAgXCJuYW1lXCI6IFwicmV2aWV3c0NvbnRhaW5lclF1ZXJ5XCIsXG4gICAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6ICh2MC8qOiBhbnkqLyksXG4gICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICBcIm5hbWVcIjogXCJyZXBvc2l0b3J5XCIsXG4gICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICBcImFyZ3NcIjogKHYxLyo6IGFueSovKSxcbiAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJSZXBvc2l0b3J5XCIsXG4gICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICh2NC8qOiBhbnkqLyksXG4gICAgICAgICAgKHY4Lyo6IGFueSovKSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwicHVsbFJlcXVlc3RcIixcbiAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgXCJhcmdzXCI6ICh2Mi8qOiBhbnkqLyksXG4gICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlB1bGxSZXF1ZXN0XCIsXG4gICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICh2My8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICh2Ny8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICh2OS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJyZXZpZXdzXCIsXG4gICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJhcmdzXCI6ICh2MTAvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUHVsbFJlcXVlc3RSZXZpZXdDb25uZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICh2MTEvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImVkZ2VzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJQdWxsUmVxdWVzdFJldmlld0VkZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAodjEyLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibm9kZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUHVsbFJlcXVlc3RSZXZpZXdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHY3Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHYxMy8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh2MTQvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAodjE1Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInN1Ym1pdHRlZEF0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHYxNi8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh2OS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJhdXRob3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjUvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY2Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2MTcvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY5Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2Ny8qOiBhbnkqLylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh2MTgvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAodjE5Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHYyMC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh2MjEvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAodjUvKjogYW55Ki8pXG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkSGFuZGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInJldmlld3NcIixcbiAgICAgICAgICAgICAgICBcImFyZ3NcIjogKHYxMC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgXCJoYW5kbGVcIjogXCJjb25uZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJrZXlcIjogXCJSZXZpZXdTdW1tYXJpZXNBY2N1bXVsYXRvcl9yZXZpZXdzXCIsXG4gICAgICAgICAgICAgICAgXCJmaWx0ZXJzXCI6IG51bGxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInJldmlld1RocmVhZHNcIixcbiAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcImFyZ3NcIjogKHYyMi8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJQdWxsUmVxdWVzdFJldmlld1RocmVhZENvbm5lY3Rpb25cIixcbiAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgKHYxMS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZWRnZXNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlB1bGxSZXF1ZXN0UmV2aWV3VGhyZWFkRWRnZVwiLFxuICAgICAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICh2MTIvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJub2RlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJQdWxsUmVxdWVzdFJldmlld1RocmVhZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAodjcvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaXNSZXNvbHZlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJyZXNvbHZlZEJ5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJVc2VyXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2Ni8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjcvKjogYW55Ki8pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwidmlld2VyQ2FuUmVzb2x2ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ2aWV3ZXJDYW5VbnJlc29sdmVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY29tbWVudHNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogKHYyMy8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJQdWxsUmVxdWVzdFJldmlld0NvbW1lbnRDb25uZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2MTEvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImVkZ2VzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJQdWxsUmVxdWVzdFJldmlld0NvbW1lbnRFZGdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYxMi8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm5vZGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjcvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiYXV0aG9yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY1Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2MTcvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY2Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2OS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjcvKjogYW55Ki8pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjE0Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYxMy8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJpc01pbmltaXplZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2MTUvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjIxLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYxOC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJwYXRoXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInBvc2l0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNyZWF0ZWRBdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2MTYvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjkvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjE5Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYyMC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2NS8qOiBhbnkqLylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRIYW5kbGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY29tbWVudHNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogKHYyMy8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJoYW5kbGVcIjogXCJjb25uZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJrZXlcIjogXCJSZXZpZXdDb21tZW50c0FjY3VtdWxhdG9yX2NvbW1lbnRzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJmaWx0ZXJzXCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHY1Lyo6IGFueSovKVxuICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEhhbmRsZVwiLFxuICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJyZXZpZXdUaHJlYWRzXCIsXG4gICAgICAgICAgICAgICAgXCJhcmdzXCI6ICh2MjIvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgIFwiaGFuZGxlXCI6IFwiY29ubmVjdGlvblwiLFxuICAgICAgICAgICAgICAgIFwia2V5XCI6IFwiUmV2aWV3VGhyZWFkc0FjY3VtdWxhdG9yX3Jldmlld1RocmVhZHNcIixcbiAgICAgICAgICAgICAgICBcImZpbHRlcnNcIjogbnVsbFxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibnVtYmVyXCIsXG4gICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImhlYWRSZWZOYW1lXCIsXG4gICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImhlYWRSZXBvc2l0b3J5XCIsXG4gICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJSZXBvc2l0b3J5XCIsXG4gICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICh2NC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAodjkvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInNzaFVybFwiLFxuICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAodjgvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgKHY3Lyo6IGFueSovKVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgICAgKHY3Lyo6IGFueSovKVxuICAgICAgICBdXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgIFwibmFtZVwiOiBcInZpZXdlclwiLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiVXNlclwiLFxuICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAodjcvKjogYW55Ki8pLFxuICAgICAgICAgICh2Ni8qOiBhbnkqLyksXG4gICAgICAgICAgKHYxNy8qOiBhbnkqLylcbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAgXCJwYXJhbXNcIjoge1xuICAgIFwib3BlcmF0aW9uS2luZFwiOiBcInF1ZXJ5XCIsXG4gICAgXCJuYW1lXCI6IFwicmV2aWV3c0NvbnRhaW5lclF1ZXJ5XCIsXG4gICAgXCJpZFwiOiBudWxsLFxuICAgIFwidGV4dFwiOiBcInF1ZXJ5IHJldmlld3NDb250YWluZXJRdWVyeShcXG4gICRyZXBvT3duZXI6IFN0cmluZyFcXG4gICRyZXBvTmFtZTogU3RyaW5nIVxcbiAgJHByTnVtYmVyOiBJbnQhXFxuICAkcmV2aWV3Q291bnQ6IEludCFcXG4gICRyZXZpZXdDdXJzb3I6IFN0cmluZ1xcbiAgJHRocmVhZENvdW50OiBJbnQhXFxuICAkdGhyZWFkQ3Vyc29yOiBTdHJpbmdcXG4gICRjb21tZW50Q291bnQ6IEludCFcXG4gICRjb21tZW50Q3Vyc29yOiBTdHJpbmdcXG4pIHtcXG4gIHJlcG9zaXRvcnkob3duZXI6ICRyZXBvT3duZXIsIG5hbWU6ICRyZXBvTmFtZSkge1xcbiAgICAuLi5yZXZpZXdzQ29udHJvbGxlcl9yZXBvc2l0b3J5XFxuICAgIHB1bGxSZXF1ZXN0KG51bWJlcjogJHByTnVtYmVyKSB7XFxuICAgICAgaGVhZFJlZk9pZFxcbiAgICAgIC4uLmFnZ3JlZ2F0ZWRSZXZpZXdzQ29udGFpbmVyX3B1bGxSZXF1ZXN0X3FkbmVaXFxuICAgICAgLi4ucmV2aWV3c0NvbnRyb2xsZXJfcHVsbFJlcXVlc3RcXG4gICAgICBpZFxcbiAgICB9XFxuICAgIGlkXFxuICB9XFxuICB2aWV3ZXIge1xcbiAgICAuLi5yZXZpZXdzQ29udHJvbGxlcl92aWV3ZXJcXG4gICAgaWRcXG4gIH1cXG59XFxuXFxuZnJhZ21lbnQgYWdncmVnYXRlZFJldmlld3NDb250YWluZXJfcHVsbFJlcXVlc3RfcWRuZVogb24gUHVsbFJlcXVlc3Qge1xcbiAgaWRcXG4gIC4uLnJldmlld1N1bW1hcmllc0FjY3VtdWxhdG9yX3B1bGxSZXF1ZXN0XzJ6emM5NlxcbiAgLi4ucmV2aWV3VGhyZWFkc0FjY3VtdWxhdG9yX3B1bGxSZXF1ZXN0X0NLRHZqXFxufVxcblxcbmZyYWdtZW50IGVtb2ppUmVhY3Rpb25zQ29udHJvbGxlcl9yZWFjdGFibGUgb24gUmVhY3RhYmxlIHtcXG4gIGlkXFxuICAuLi5lbW9qaVJlYWN0aW9uc1ZpZXdfcmVhY3RhYmxlXFxufVxcblxcbmZyYWdtZW50IGVtb2ppUmVhY3Rpb25zVmlld19yZWFjdGFibGUgb24gUmVhY3RhYmxlIHtcXG4gIGlkXFxuICByZWFjdGlvbkdyb3VwcyB7XFxuICAgIGNvbnRlbnRcXG4gICAgdmlld2VySGFzUmVhY3RlZFxcbiAgICB1c2VycyB7XFxuICAgICAgdG90YWxDb3VudFxcbiAgICB9XFxuICB9XFxuICB2aWV3ZXJDYW5SZWFjdFxcbn1cXG5cXG5mcmFnbWVudCBwckNoZWNrb3V0Q29udHJvbGxlcl9wdWxsUmVxdWVzdCBvbiBQdWxsUmVxdWVzdCB7XFxuICBudW1iZXJcXG4gIGhlYWRSZWZOYW1lXFxuICBoZWFkUmVwb3NpdG9yeSB7XFxuICAgIG5hbWVcXG4gICAgdXJsXFxuICAgIHNzaFVybFxcbiAgICBvd25lciB7XFxuICAgICAgX190eXBlbmFtZVxcbiAgICAgIGxvZ2luXFxuICAgICAgaWRcXG4gICAgfVxcbiAgICBpZFxcbiAgfVxcbn1cXG5cXG5mcmFnbWVudCBwckNoZWNrb3V0Q29udHJvbGxlcl9yZXBvc2l0b3J5IG9uIFJlcG9zaXRvcnkge1xcbiAgbmFtZVxcbiAgb3duZXIge1xcbiAgICBfX3R5cGVuYW1lXFxuICAgIGxvZ2luXFxuICAgIGlkXFxuICB9XFxufVxcblxcbmZyYWdtZW50IHJldmlld0NvbW1lbnRzQWNjdW11bGF0b3JfcmV2aWV3VGhyZWFkXzFWYlVtTCBvbiBQdWxsUmVxdWVzdFJldmlld1RocmVhZCB7XFxuICBpZFxcbiAgY29tbWVudHMoZmlyc3Q6ICRjb21tZW50Q291bnQsIGFmdGVyOiAkY29tbWVudEN1cnNvcikge1xcbiAgICBwYWdlSW5mbyB7XFxuICAgICAgaGFzTmV4dFBhZ2VcXG4gICAgICBlbmRDdXJzb3JcXG4gICAgfVxcbiAgICBlZGdlcyB7XFxuICAgICAgY3Vyc29yXFxuICAgICAgbm9kZSB7XFxuICAgICAgICBpZFxcbiAgICAgICAgYXV0aG9yIHtcXG4gICAgICAgICAgX190eXBlbmFtZVxcbiAgICAgICAgICBhdmF0YXJVcmxcXG4gICAgICAgICAgbG9naW5cXG4gICAgICAgICAgdXJsXFxuICAgICAgICAgIC4uLiBvbiBOb2RlIHtcXG4gICAgICAgICAgICBpZFxcbiAgICAgICAgICB9XFxuICAgICAgICB9XFxuICAgICAgICBib2R5SFRNTFxcbiAgICAgICAgYm9keVxcbiAgICAgICAgaXNNaW5pbWl6ZWRcXG4gICAgICAgIHN0YXRlXFxuICAgICAgICB2aWV3ZXJDYW5SZWFjdFxcbiAgICAgICAgdmlld2VyQ2FuVXBkYXRlXFxuICAgICAgICBwYXRoXFxuICAgICAgICBwb3NpdGlvblxcbiAgICAgICAgY3JlYXRlZEF0XFxuICAgICAgICBsYXN0RWRpdGVkQXRcXG4gICAgICAgIHVybFxcbiAgICAgICAgYXV0aG9yQXNzb2NpYXRpb25cXG4gICAgICAgIC4uLmVtb2ppUmVhY3Rpb25zQ29udHJvbGxlcl9yZWFjdGFibGVcXG4gICAgICAgIF9fdHlwZW5hbWVcXG4gICAgICB9XFxuICAgIH1cXG4gIH1cXG59XFxuXFxuZnJhZ21lbnQgcmV2aWV3U3VtbWFyaWVzQWNjdW11bGF0b3JfcHVsbFJlcXVlc3RfMnp6Yzk2IG9uIFB1bGxSZXF1ZXN0IHtcXG4gIHVybFxcbiAgcmV2aWV3cyhmaXJzdDogJHJldmlld0NvdW50LCBhZnRlcjogJHJldmlld0N1cnNvcikge1xcbiAgICBwYWdlSW5mbyB7XFxuICAgICAgaGFzTmV4dFBhZ2VcXG4gICAgICBlbmRDdXJzb3JcXG4gICAgfVxcbiAgICBlZGdlcyB7XFxuICAgICAgY3Vyc29yXFxuICAgICAgbm9kZSB7XFxuICAgICAgICBpZFxcbiAgICAgICAgYm9keVxcbiAgICAgICAgYm9keUhUTUxcXG4gICAgICAgIHN0YXRlXFxuICAgICAgICBzdWJtaXR0ZWRBdFxcbiAgICAgICAgbGFzdEVkaXRlZEF0XFxuICAgICAgICB1cmxcXG4gICAgICAgIGF1dGhvciB7XFxuICAgICAgICAgIF9fdHlwZW5hbWVcXG4gICAgICAgICAgbG9naW5cXG4gICAgICAgICAgYXZhdGFyVXJsXFxuICAgICAgICAgIHVybFxcbiAgICAgICAgICAuLi4gb24gTm9kZSB7XFxuICAgICAgICAgICAgaWRcXG4gICAgICAgICAgfVxcbiAgICAgICAgfVxcbiAgICAgICAgdmlld2VyQ2FuVXBkYXRlXFxuICAgICAgICBhdXRob3JBc3NvY2lhdGlvblxcbiAgICAgICAgLi4uZW1vamlSZWFjdGlvbnNDb250cm9sbGVyX3JlYWN0YWJsZVxcbiAgICAgICAgX190eXBlbmFtZVxcbiAgICAgIH1cXG4gICAgfVxcbiAgfVxcbn1cXG5cXG5mcmFnbWVudCByZXZpZXdUaHJlYWRzQWNjdW11bGF0b3JfcHVsbFJlcXVlc3RfQ0tEdmogb24gUHVsbFJlcXVlc3Qge1xcbiAgdXJsXFxuICByZXZpZXdUaHJlYWRzKGZpcnN0OiAkdGhyZWFkQ291bnQsIGFmdGVyOiAkdGhyZWFkQ3Vyc29yKSB7XFxuICAgIHBhZ2VJbmZvIHtcXG4gICAgICBoYXNOZXh0UGFnZVxcbiAgICAgIGVuZEN1cnNvclxcbiAgICB9XFxuICAgIGVkZ2VzIHtcXG4gICAgICBjdXJzb3JcXG4gICAgICBub2RlIHtcXG4gICAgICAgIGlkXFxuICAgICAgICBpc1Jlc29sdmVkXFxuICAgICAgICByZXNvbHZlZEJ5IHtcXG4gICAgICAgICAgbG9naW5cXG4gICAgICAgICAgaWRcXG4gICAgICAgIH1cXG4gICAgICAgIHZpZXdlckNhblJlc29sdmVcXG4gICAgICAgIHZpZXdlckNhblVucmVzb2x2ZVxcbiAgICAgICAgLi4ucmV2aWV3Q29tbWVudHNBY2N1bXVsYXRvcl9yZXZpZXdUaHJlYWRfMVZiVW1MXFxuICAgICAgICBfX3R5cGVuYW1lXFxuICAgICAgfVxcbiAgICB9XFxuICB9XFxufVxcblxcbmZyYWdtZW50IHJldmlld3NDb250cm9sbGVyX3B1bGxSZXF1ZXN0IG9uIFB1bGxSZXF1ZXN0IHtcXG4gIGlkXFxuICAuLi5wckNoZWNrb3V0Q29udHJvbGxlcl9wdWxsUmVxdWVzdFxcbn1cXG5cXG5mcmFnbWVudCByZXZpZXdzQ29udHJvbGxlcl9yZXBvc2l0b3J5IG9uIFJlcG9zaXRvcnkge1xcbiAgLi4ucHJDaGVja291dENvbnRyb2xsZXJfcmVwb3NpdG9yeVxcbn1cXG5cXG5mcmFnbWVudCByZXZpZXdzQ29udHJvbGxlcl92aWV3ZXIgb24gVXNlciB7XFxuICBpZFxcbiAgbG9naW5cXG4gIGF2YXRhclVybFxcbn1cXG5cIixcbiAgICBcIm1ldGFkYXRhXCI6IHt9XG4gIH1cbn07XG59KSgpO1xuLy8gcHJldHRpZXItaWdub3JlXG4obm9kZS8qOiBhbnkqLykuaGFzaCA9ICdiMDVjYzMwY2IwNzgwMDNhZmJhOWJkOGMyZGU5ODlmYSc7XG5tb2R1bGUuZXhwb3J0cyA9IG5vZGU7XG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLFlBQVk7O0FBRVo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7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