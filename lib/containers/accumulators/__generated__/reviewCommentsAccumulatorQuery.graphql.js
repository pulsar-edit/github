/**
 * @flow
 * @relayHash 3aaba36cb5f7b9befa6832a08ff9c11f
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type reviewCommentsAccumulator_reviewThread$ref = any;
export type reviewCommentsAccumulatorQueryVariables = {|
  id: string,
  commentCount: number,
  commentCursor?: ?string,
|};
export type reviewCommentsAccumulatorQueryResponse = {|
  +node: ?{|
    +$fragmentRefs: reviewCommentsAccumulator_reviewThread$ref
  |}
|};
export type reviewCommentsAccumulatorQuery = {|
  variables: reviewCommentsAccumulatorQueryVariables,
  response: reviewCommentsAccumulatorQueryResponse,
|};
*/

/*
query reviewCommentsAccumulatorQuery(
  $id: ID!
  $commentCount: Int!
  $commentCursor: String
) {
  node(id: $id) {
    __typename
    ... on PullRequestReviewThread {
      ...reviewCommentsAccumulator_reviewThread_1VbUmL
    }
    id
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
*/
const node /*: ConcreteRequest*/ = function () {
  var v0 = [{
      "kind": "LocalArgument",
      "name": "id",
      "type": "ID!",
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
      "variableName": "commentCursor"
    }, {
      "kind": "Variable",
      "name": "first",
      "variableName": "commentCount"
    }],
    v5 = {
      "kind": "ScalarField",
      "alias": null,
      "name": "url",
      "args": null,
      "storageKey": null
    };
  return {
    "kind": "Request",
    "fragment": {
      "kind": "Fragment",
      "name": "reviewCommentsAccumulatorQuery",
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
          "type": "PullRequestReviewThread",
          "selections": [{
            "kind": "FragmentSpread",
            "name": "reviewCommentsAccumulator_reviewThread",
            "args": [{
              "kind": "Variable",
              "name": "commentCount",
              "variableName": "commentCount"
            }, {
              "kind": "Variable",
              "name": "commentCursor",
              "variableName": "commentCursor"
            }]
          }]
        }]
      }]
    },
    "operation": {
      "kind": "Operation",
      "name": "reviewCommentsAccumulatorQuery",
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
          "type": "PullRequestReviewThread",
          "selections": [{
            "kind": "LinkedField",
            "alias": null,
            "name": "comments",
            "storageKey": null,
            "args": v4 /*: any*/,
            "concreteType": "PullRequestReviewCommentConnection",
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
              "concreteType": "PullRequestReviewCommentEdge",
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
                "concreteType": "PullRequestReviewComment",
                "plural": false,
                "selections": [v3 /*: any*/, {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "author",
                  "storageKey": null,
                  "args": null,
                  "concreteType": null,
                  "plural": false,
                  "selections": [v2 /*: any*/, {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "avatarUrl",
                    "args": null,
                    "storageKey": null
                  }, {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "login",
                    "args": null,
                    "storageKey": null
                  }, v5 /*: any*/, v3 /*: any*/]
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
                }, v5 /*: any*/, {
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
                }, v2 /*: any*/]
              }]
            }]
          }, {
            "kind": "LinkedHandle",
            "alias": null,
            "name": "comments",
            "args": v4 /*: any*/,
            "handle": "connection",
            "key": "ReviewCommentsAccumulator_comments",
            "filters": null
          }]
        }]
      }]
    },
    "params": {
      "operationKind": "query",
      "name": "reviewCommentsAccumulatorQuery",
      "id": null,
      "text": "query reviewCommentsAccumulatorQuery(\n  $id: ID!\n  $commentCount: Int!\n  $commentCursor: String\n) {\n  node(id: $id) {\n    __typename\n    ... on PullRequestReviewThread {\n      ...reviewCommentsAccumulator_reviewThread_1VbUmL\n    }\n    id\n  }\n}\n\nfragment emojiReactionsController_reactable on Reactable {\n  id\n  ...emojiReactionsView_reactable\n}\n\nfragment emojiReactionsView_reactable on Reactable {\n  id\n  reactionGroups {\n    content\n    viewerHasReacted\n    users {\n      totalCount\n    }\n  }\n  viewerCanReact\n}\n\nfragment reviewCommentsAccumulator_reviewThread_1VbUmL on PullRequestReviewThread {\n  id\n  comments(first: $commentCount, after: $commentCursor) {\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n    edges {\n      cursor\n      node {\n        id\n        author {\n          __typename\n          avatarUrl\n          login\n          url\n          ... on Node {\n            id\n          }\n        }\n        bodyHTML\n        body\n        isMinimized\n        state\n        viewerCanReact\n        viewerCanUpdate\n        path\n        position\n        createdAt\n        lastEditedAt\n        url\n        authorAssociation\n        ...emojiReactionsController_reactable\n        __typename\n      }\n    }\n  }\n}\n",
      "metadata": {}
    }
  };
}();
// prettier-ignore
node /*: any*/.hash = '25bc4376239d278025fc1f353900572a';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJub2RlIiwidjAiLCJ2MSIsInYyIiwidjMiLCJ2NCIsInY1IiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwic291cmNlcyI6WyJyZXZpZXdDb21tZW50c0FjY3VtdWxhdG9yUXVlcnkuZ3JhcGhxbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmbG93XG4gKiBAcmVsYXlIYXNoIDNhYWJhMzZjYjVmN2I5YmVmYTY4MzJhMDhmZjljMTFmXG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKjo6XG5pbXBvcnQgdHlwZSB7IENvbmNyZXRlUmVxdWVzdCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xudHlwZSByZXZpZXdDb21tZW50c0FjY3VtdWxhdG9yX3Jldmlld1RocmVhZCRyZWYgPSBhbnk7XG5leHBvcnQgdHlwZSByZXZpZXdDb21tZW50c0FjY3VtdWxhdG9yUXVlcnlWYXJpYWJsZXMgPSB7fFxuICBpZDogc3RyaW5nLFxuICBjb21tZW50Q291bnQ6IG51bWJlcixcbiAgY29tbWVudEN1cnNvcj86ID9zdHJpbmcsXG58fTtcbmV4cG9ydCB0eXBlIHJldmlld0NvbW1lbnRzQWNjdW11bGF0b3JRdWVyeVJlc3BvbnNlID0ge3xcbiAgK25vZGU6ID97fFxuICAgICskZnJhZ21lbnRSZWZzOiByZXZpZXdDb21tZW50c0FjY3VtdWxhdG9yX3Jldmlld1RocmVhZCRyZWZcbiAgfH1cbnx9O1xuZXhwb3J0IHR5cGUgcmV2aWV3Q29tbWVudHNBY2N1bXVsYXRvclF1ZXJ5ID0ge3xcbiAgdmFyaWFibGVzOiByZXZpZXdDb21tZW50c0FjY3VtdWxhdG9yUXVlcnlWYXJpYWJsZXMsXG4gIHJlc3BvbnNlOiByZXZpZXdDb21tZW50c0FjY3VtdWxhdG9yUXVlcnlSZXNwb25zZSxcbnx9O1xuKi9cblxuXG4vKlxucXVlcnkgcmV2aWV3Q29tbWVudHNBY2N1bXVsYXRvclF1ZXJ5KFxuICAkaWQ6IElEIVxuICAkY29tbWVudENvdW50OiBJbnQhXG4gICRjb21tZW50Q3Vyc29yOiBTdHJpbmdcbikge1xuICBub2RlKGlkOiAkaWQpIHtcbiAgICBfX3R5cGVuYW1lXG4gICAgLi4uIG9uIFB1bGxSZXF1ZXN0UmV2aWV3VGhyZWFkIHtcbiAgICAgIC4uLnJldmlld0NvbW1lbnRzQWNjdW11bGF0b3JfcmV2aWV3VGhyZWFkXzFWYlVtTFxuICAgIH1cbiAgICBpZFxuICB9XG59XG5cbmZyYWdtZW50IGVtb2ppUmVhY3Rpb25zQ29udHJvbGxlcl9yZWFjdGFibGUgb24gUmVhY3RhYmxlIHtcbiAgaWRcbiAgLi4uZW1vamlSZWFjdGlvbnNWaWV3X3JlYWN0YWJsZVxufVxuXG5mcmFnbWVudCBlbW9qaVJlYWN0aW9uc1ZpZXdfcmVhY3RhYmxlIG9uIFJlYWN0YWJsZSB7XG4gIGlkXG4gIHJlYWN0aW9uR3JvdXBzIHtcbiAgICBjb250ZW50XG4gICAgdmlld2VySGFzUmVhY3RlZFxuICAgIHVzZXJzIHtcbiAgICAgIHRvdGFsQ291bnRcbiAgICB9XG4gIH1cbiAgdmlld2VyQ2FuUmVhY3Rcbn1cblxuZnJhZ21lbnQgcmV2aWV3Q29tbWVudHNBY2N1bXVsYXRvcl9yZXZpZXdUaHJlYWRfMVZiVW1MIG9uIFB1bGxSZXF1ZXN0UmV2aWV3VGhyZWFkIHtcbiAgaWRcbiAgY29tbWVudHMoZmlyc3Q6ICRjb21tZW50Q291bnQsIGFmdGVyOiAkY29tbWVudEN1cnNvcikge1xuICAgIHBhZ2VJbmZvIHtcbiAgICAgIGhhc05leHRQYWdlXG4gICAgICBlbmRDdXJzb3JcbiAgICB9XG4gICAgZWRnZXMge1xuICAgICAgY3Vyc29yXG4gICAgICBub2RlIHtcbiAgICAgICAgaWRcbiAgICAgICAgYXV0aG9yIHtcbiAgICAgICAgICBfX3R5cGVuYW1lXG4gICAgICAgICAgYXZhdGFyVXJsXG4gICAgICAgICAgbG9naW5cbiAgICAgICAgICB1cmxcbiAgICAgICAgICAuLi4gb24gTm9kZSB7XG4gICAgICAgICAgICBpZFxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBib2R5SFRNTFxuICAgICAgICBib2R5XG4gICAgICAgIGlzTWluaW1pemVkXG4gICAgICAgIHN0YXRlXG4gICAgICAgIHZpZXdlckNhblJlYWN0XG4gICAgICAgIHZpZXdlckNhblVwZGF0ZVxuICAgICAgICBwYXRoXG4gICAgICAgIHBvc2l0aW9uXG4gICAgICAgIGNyZWF0ZWRBdFxuICAgICAgICBsYXN0RWRpdGVkQXRcbiAgICAgICAgdXJsXG4gICAgICAgIGF1dGhvckFzc29jaWF0aW9uXG4gICAgICAgIC4uLmVtb2ppUmVhY3Rpb25zQ29udHJvbGxlcl9yZWFjdGFibGVcbiAgICAgICAgX190eXBlbmFtZVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuKi9cblxuY29uc3Qgbm9kZS8qOiBDb25jcmV0ZVJlcXVlc3QqLyA9IChmdW5jdGlvbigpe1xudmFyIHYwID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgIFwibmFtZVwiOiBcImlkXCIsXG4gICAgXCJ0eXBlXCI6IFwiSUQhXCIsXG4gICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICB9LFxuICB7XG4gICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgIFwibmFtZVwiOiBcImNvbW1lbnRDb3VudFwiLFxuICAgIFwidHlwZVwiOiBcIkludCFcIixcbiAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gIH0sXG4gIHtcbiAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwiY29tbWVudEN1cnNvclwiLFxuICAgIFwidHlwZVwiOiBcIlN0cmluZ1wiLFxuICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgfVxuXSxcbnYxID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICBcIm5hbWVcIjogXCJpZFwiLFxuICAgIFwidmFyaWFibGVOYW1lXCI6IFwiaWRcIlxuICB9XG5dLFxudjIgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiX190eXBlbmFtZVwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52MyA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJpZFwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52NCA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgXCJuYW1lXCI6IFwiYWZ0ZXJcIixcbiAgICBcInZhcmlhYmxlTmFtZVwiOiBcImNvbW1lbnRDdXJzb3JcIlxuICB9LFxuICB7XG4gICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICBcIm5hbWVcIjogXCJmaXJzdFwiLFxuICAgIFwidmFyaWFibGVOYW1lXCI6IFwiY29tbWVudENvdW50XCJcbiAgfVxuXSxcbnY1ID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcInVybFwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn07XG5yZXR1cm4ge1xuICBcImtpbmRcIjogXCJSZXF1ZXN0XCIsXG4gIFwiZnJhZ21lbnRcIjoge1xuICAgIFwia2luZFwiOiBcIkZyYWdtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwicmV2aWV3Q29tbWVudHNBY2N1bXVsYXRvclF1ZXJ5XCIsXG4gICAgXCJ0eXBlXCI6IFwiUXVlcnlcIixcbiAgICBcIm1ldGFkYXRhXCI6IG51bGwsXG4gICAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6ICh2MC8qOiBhbnkqLyksXG4gICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICBcIm5hbWVcIjogXCJub2RlXCIsXG4gICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICBcImFyZ3NcIjogKHYxLyo6IGFueSovKSxcbiAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiSW5saW5lRnJhZ21lbnRcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIlB1bGxSZXF1ZXN0UmV2aWV3VGhyZWFkXCIsXG4gICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiRnJhZ21lbnRTcHJlYWRcIixcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJyZXZpZXdDb21tZW50c0FjY3VtdWxhdG9yX3Jldmlld1RocmVhZFwiLFxuICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbW1lbnRDb3VudFwiLFxuICAgICAgICAgICAgICAgICAgICBcInZhcmlhYmxlTmFtZVwiOiBcImNvbW1lbnRDb3VudFwiXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjb21tZW50Q3Vyc29yXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFyaWFibGVOYW1lXCI6IFwiY29tbWVudEN1cnNvclwiXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9LFxuICBcIm9wZXJhdGlvblwiOiB7XG4gICAgXCJraW5kXCI6IFwiT3BlcmF0aW9uXCIsXG4gICAgXCJuYW1lXCI6IFwicmV2aWV3Q29tbWVudHNBY2N1bXVsYXRvclF1ZXJ5XCIsXG4gICAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6ICh2MC8qOiBhbnkqLyksXG4gICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICBcIm5hbWVcIjogXCJub2RlXCIsXG4gICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICBcImFyZ3NcIjogKHYxLyo6IGFueSovKSxcbiAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgKHYyLyo6IGFueSovKSxcbiAgICAgICAgICAodjMvKjogYW55Ki8pLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIklubGluZUZyYWdtZW50XCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJQdWxsUmVxdWVzdFJldmlld1RocmVhZFwiLFxuICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbW1lbnRzXCIsXG4gICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJhcmdzXCI6ICh2NC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJQdWxsUmVxdWVzdFJldmlld0NvbW1lbnRDb25uZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJwYWdlSW5mb1wiLFxuICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUGFnZUluZm9cIixcbiAgICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImhhc05leHRQYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZW5kQ3Vyc29yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImVkZ2VzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJQdWxsUmVxdWVzdFJldmlld0NvbW1lbnRFZGdlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImN1cnNvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm5vZGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAodjMvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiYXV0aG9yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYyLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJhdmF0YXJVcmxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImxvZ2luXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2NS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjMvKjogYW55Ki8pXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiYm9keUhUTUxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiYm9keVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJpc01pbmltaXplZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJzdGF0ZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ2aWV3ZXJDYW5SZWFjdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ2aWV3ZXJDYW5VcGRhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicGF0aFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJwb3NpdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjcmVhdGVkQXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibGFzdEVkaXRlZEF0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgKHY1Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImF1dGhvckFzc29jaWF0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInJlYWN0aW9uR3JvdXBzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJSZWFjdGlvbkdyb3VwXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbnRlbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInZpZXdlckhhc1JlYWN0ZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInVzZXJzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJSZWFjdGluZ1VzZXJDb25uZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ0b3RhbENvdW50XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAodjIvKjogYW55Ki8pXG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkSGFuZGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbW1lbnRzXCIsXG4gICAgICAgICAgICAgICAgXCJhcmdzXCI6ICh2NC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgXCJoYW5kbGVcIjogXCJjb25uZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJrZXlcIjogXCJSZXZpZXdDb21tZW50c0FjY3VtdWxhdG9yX2NvbW1lbnRzXCIsXG4gICAgICAgICAgICAgICAgXCJmaWx0ZXJzXCI6IG51bGxcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAgXCJwYXJhbXNcIjoge1xuICAgIFwib3BlcmF0aW9uS2luZFwiOiBcInF1ZXJ5XCIsXG4gICAgXCJuYW1lXCI6IFwicmV2aWV3Q29tbWVudHNBY2N1bXVsYXRvclF1ZXJ5XCIsXG4gICAgXCJpZFwiOiBudWxsLFxuICAgIFwidGV4dFwiOiBcInF1ZXJ5IHJldmlld0NvbW1lbnRzQWNjdW11bGF0b3JRdWVyeShcXG4gICRpZDogSUQhXFxuICAkY29tbWVudENvdW50OiBJbnQhXFxuICAkY29tbWVudEN1cnNvcjogU3RyaW5nXFxuKSB7XFxuICBub2RlKGlkOiAkaWQpIHtcXG4gICAgX190eXBlbmFtZVxcbiAgICAuLi4gb24gUHVsbFJlcXVlc3RSZXZpZXdUaHJlYWQge1xcbiAgICAgIC4uLnJldmlld0NvbW1lbnRzQWNjdW11bGF0b3JfcmV2aWV3VGhyZWFkXzFWYlVtTFxcbiAgICB9XFxuICAgIGlkXFxuICB9XFxufVxcblxcbmZyYWdtZW50IGVtb2ppUmVhY3Rpb25zQ29udHJvbGxlcl9yZWFjdGFibGUgb24gUmVhY3RhYmxlIHtcXG4gIGlkXFxuICAuLi5lbW9qaVJlYWN0aW9uc1ZpZXdfcmVhY3RhYmxlXFxufVxcblxcbmZyYWdtZW50IGVtb2ppUmVhY3Rpb25zVmlld19yZWFjdGFibGUgb24gUmVhY3RhYmxlIHtcXG4gIGlkXFxuICByZWFjdGlvbkdyb3VwcyB7XFxuICAgIGNvbnRlbnRcXG4gICAgdmlld2VySGFzUmVhY3RlZFxcbiAgICB1c2VycyB7XFxuICAgICAgdG90YWxDb3VudFxcbiAgICB9XFxuICB9XFxuICB2aWV3ZXJDYW5SZWFjdFxcbn1cXG5cXG5mcmFnbWVudCByZXZpZXdDb21tZW50c0FjY3VtdWxhdG9yX3Jldmlld1RocmVhZF8xVmJVbUwgb24gUHVsbFJlcXVlc3RSZXZpZXdUaHJlYWQge1xcbiAgaWRcXG4gIGNvbW1lbnRzKGZpcnN0OiAkY29tbWVudENvdW50LCBhZnRlcjogJGNvbW1lbnRDdXJzb3IpIHtcXG4gICAgcGFnZUluZm8ge1xcbiAgICAgIGhhc05leHRQYWdlXFxuICAgICAgZW5kQ3Vyc29yXFxuICAgIH1cXG4gICAgZWRnZXMge1xcbiAgICAgIGN1cnNvclxcbiAgICAgIG5vZGUge1xcbiAgICAgICAgaWRcXG4gICAgICAgIGF1dGhvciB7XFxuICAgICAgICAgIF9fdHlwZW5hbWVcXG4gICAgICAgICAgYXZhdGFyVXJsXFxuICAgICAgICAgIGxvZ2luXFxuICAgICAgICAgIHVybFxcbiAgICAgICAgICAuLi4gb24gTm9kZSB7XFxuICAgICAgICAgICAgaWRcXG4gICAgICAgICAgfVxcbiAgICAgICAgfVxcbiAgICAgICAgYm9keUhUTUxcXG4gICAgICAgIGJvZHlcXG4gICAgICAgIGlzTWluaW1pemVkXFxuICAgICAgICBzdGF0ZVxcbiAgICAgICAgdmlld2VyQ2FuUmVhY3RcXG4gICAgICAgIHZpZXdlckNhblVwZGF0ZVxcbiAgICAgICAgcGF0aFxcbiAgICAgICAgcG9zaXRpb25cXG4gICAgICAgIGNyZWF0ZWRBdFxcbiAgICAgICAgbGFzdEVkaXRlZEF0XFxuICAgICAgICB1cmxcXG4gICAgICAgIGF1dGhvckFzc29jaWF0aW9uXFxuICAgICAgICAuLi5lbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXJfcmVhY3RhYmxlXFxuICAgICAgICBfX3R5cGVuYW1lXFxuICAgICAgfVxcbiAgICB9XFxuICB9XFxufVxcblwiLFxuICAgIFwibWV0YWRhdGFcIjoge31cbiAgfVxufTtcbn0pKCk7XG4vLyBwcmV0dGllci1pZ25vcmVcbihub2RlLyo6IGFueSovKS5oYXNoID0gJzI1YmM0Mzc2MjM5ZDI3ODAyNWZjMWYzNTM5MDA1NzJhJztcbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsWUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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