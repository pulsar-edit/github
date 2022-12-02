/**
 * @flow
 * @relayHash 538bae86191b750e560b6ad8e2979c29
 */

/* eslint-disable */
'use strict';
/*::
import type { ConcreteRequest } from 'relay-runtime';
type emojiReactionsController_reactable$ref = any;
export type CommentAuthorAssociation = "COLLABORATOR" | "CONTRIBUTOR" | "FIRST_TIMER" | "FIRST_TIME_CONTRIBUTOR" | "MANNEQUIN" | "MEMBER" | "NONE" | "OWNER" | "%future added value";
export type AddPullRequestReviewCommentInput = {|
  pullRequestId?: ?string,
  pullRequestReviewId?: ?string,
  commitOID?: ?any,
  body: string,
  path?: ?string,
  position?: ?number,
  inReplyTo?: ?string,
  clientMutationId?: ?string,
|};
export type addPrReviewCommentMutationVariables = {|
  input: AddPullRequestReviewCommentInput
|};
export type addPrReviewCommentMutationResponse = {|
  +addPullRequestReviewComment: ?{|
    +commentEdge: ?{|
      +node: ?{|
        +id: string,
        +author: ?{|
          +avatarUrl: any,
          +login: string,
        |},
        +body: string,
        +bodyHTML: any,
        +isMinimized: boolean,
        +viewerCanReact: boolean,
        +viewerCanUpdate: boolean,
        +path: string,
        +position: ?number,
        +createdAt: any,
        +lastEditedAt: ?any,
        +url: any,
        +authorAssociation: CommentAuthorAssociation,
        +$fragmentRefs: emojiReactionsController_reactable$ref,
      |}
    |}
  |}
|};
export type addPrReviewCommentMutation = {|
  variables: addPrReviewCommentMutationVariables,
  response: addPrReviewCommentMutationResponse,
|};
*/

/*
mutation addPrReviewCommentMutation(
  $input: AddPullRequestReviewCommentInput!
) {
  addPullRequestReviewComment(input: $input) {
    commentEdge {
      node {
        id
        author {
          __typename
          avatarUrl
          login
          ... on Node {
            id
          }
        }
        body
        bodyHTML
        isMinimized
        viewerCanReact
        viewerCanUpdate
        path
        position
        createdAt
        lastEditedAt
        url
        authorAssociation
        ...emojiReactionsController_reactable
      }
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
*/

const node
/*: ConcreteRequest*/
= function () {
  var v0 = [{
    "kind": "LocalArgument",
    "name": "input",
    "type": "AddPullRequestReviewCommentInput!",
    "defaultValue": null
  }],
      v1 = [{
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }],
      v2 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "id",
    "args": null,
    "storageKey": null
  },
      v3 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "avatarUrl",
    "args": null,
    "storageKey": null
  },
      v4 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "login",
    "args": null,
    "storageKey": null
  },
      v5 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "body",
    "args": null,
    "storageKey": null
  },
      v6 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "bodyHTML",
    "args": null,
    "storageKey": null
  },
      v7 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "isMinimized",
    "args": null,
    "storageKey": null
  },
      v8 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "viewerCanReact",
    "args": null,
    "storageKey": null
  },
      v9 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "viewerCanUpdate",
    "args": null,
    "storageKey": null
  },
      v10 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "path",
    "args": null,
    "storageKey": null
  },
      v11 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "position",
    "args": null,
    "storageKey": null
  },
      v12 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "createdAt",
    "args": null,
    "storageKey": null
  },
      v13 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "lastEditedAt",
    "args": null,
    "storageKey": null
  },
      v14 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "url",
    "args": null,
    "storageKey": null
  },
      v15 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "authorAssociation",
    "args": null,
    "storageKey": null
  };
  return {
    "kind": "Request",
    "fragment": {
      "kind": "Fragment",
      "name": "addPrReviewCommentMutation",
      "type": "Mutation",
      "metadata": null,
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "addPullRequestReviewComment",
        "storageKey": null,
        "args": v1
        /*: any*/
        ,
        "concreteType": "AddPullRequestReviewCommentPayload",
        "plural": false,
        "selections": [{
          "kind": "LinkedField",
          "alias": null,
          "name": "commentEdge",
          "storageKey": null,
          "args": null,
          "concreteType": "PullRequestReviewCommentEdge",
          "plural": false,
          "selections": [{
            "kind": "LinkedField",
            "alias": null,
            "name": "node",
            "storageKey": null,
            "args": null,
            "concreteType": "PullRequestReviewComment",
            "plural": false,
            "selections": [v2
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
              , v4
              /*: any*/
              ]
            }, v5
            /*: any*/
            , v6
            /*: any*/
            , v7
            /*: any*/
            , v8
            /*: any*/
            , v9
            /*: any*/
            , v10
            /*: any*/
            , v11
            /*: any*/
            , v12
            /*: any*/
            , v13
            /*: any*/
            , v14
            /*: any*/
            , v15
            /*: any*/
            , {
              "kind": "FragmentSpread",
              "name": "emojiReactionsController_reactable",
              "args": null
            }]
          }]
        }]
      }]
    },
    "operation": {
      "kind": "Operation",
      "name": "addPrReviewCommentMutation",
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "addPullRequestReviewComment",
        "storageKey": null,
        "args": v1
        /*: any*/
        ,
        "concreteType": "AddPullRequestReviewCommentPayload",
        "plural": false,
        "selections": [{
          "kind": "LinkedField",
          "alias": null,
          "name": "commentEdge",
          "storageKey": null,
          "args": null,
          "concreteType": "PullRequestReviewCommentEdge",
          "plural": false,
          "selections": [{
            "kind": "LinkedField",
            "alias": null,
            "name": "node",
            "storageKey": null,
            "args": null,
            "concreteType": "PullRequestReviewComment",
            "plural": false,
            "selections": [v2
            /*: any*/
            , {
              "kind": "LinkedField",
              "alias": null,
              "name": "author",
              "storageKey": null,
              "args": null,
              "concreteType": null,
              "plural": false,
              "selections": [{
                "kind": "ScalarField",
                "alias": null,
                "name": "__typename",
                "args": null,
                "storageKey": null
              }, v3
              /*: any*/
              , v4
              /*: any*/
              , v2
              /*: any*/
              ]
            }, v5
            /*: any*/
            , v6
            /*: any*/
            , v7
            /*: any*/
            , v8
            /*: any*/
            , v9
            /*: any*/
            , v10
            /*: any*/
            , v11
            /*: any*/
            , v12
            /*: any*/
            , v13
            /*: any*/
            , v14
            /*: any*/
            , v15
            /*: any*/
            , {
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
            }]
          }]
        }]
      }]
    },
    "params": {
      "operationKind": "mutation",
      "name": "addPrReviewCommentMutation",
      "id": null,
      "text": "mutation addPrReviewCommentMutation(\n  $input: AddPullRequestReviewCommentInput!\n) {\n  addPullRequestReviewComment(input: $input) {\n    commentEdge {\n      node {\n        id\n        author {\n          __typename\n          avatarUrl\n          login\n          ... on Node {\n            id\n          }\n        }\n        body\n        bodyHTML\n        isMinimized\n        viewerCanReact\n        viewerCanUpdate\n        path\n        position\n        createdAt\n        lastEditedAt\n        url\n        authorAssociation\n        ...emojiReactionsController_reactable\n      }\n    }\n  }\n}\n\nfragment emojiReactionsController_reactable on Reactable {\n  id\n  ...emojiReactionsView_reactable\n}\n\nfragment emojiReactionsView_reactable on Reactable {\n  id\n  reactionGroups {\n    content\n    viewerHasReacted\n    users {\n      totalCount\n    }\n  }\n  viewerCanReact\n}\n",
      "metadata": {}
    }
  };
}(); // prettier-ignore


node
/*: any*/
.hash = '0485900371928de8c6b843560dfe441c';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9tdXRhdGlvbnMvX19nZW5lcmF0ZWRfXy9hZGRQclJldmlld0NvbW1lbnRNdXRhdGlvbi5ncmFwaHFsLmpzIl0sIm5hbWVzIjpbIm5vZGUiLCJ2MCIsInYxIiwidjIiLCJ2MyIsInY0IiwidjUiLCJ2NiIsInY3IiwidjgiLCJ2OSIsInYxMCIsInYxMSIsInYxMiIsInYxMyIsInYxNCIsInYxNSIsImhhc2giLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQU1BO0FBQUk7QUFBQSxFQUF5QixZQUFVO0FBQzdDLE1BQUlDLEVBQUUsR0FBRyxDQUNQO0FBQ0UsWUFBUSxlQURWO0FBRUUsWUFBUSxPQUZWO0FBR0UsWUFBUSxtQ0FIVjtBQUlFLG9CQUFnQjtBQUpsQixHQURPLENBQVQ7QUFBQSxN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LDRCQUFjLElBSmhCO0FBS0Usc0JBQVEsSUFMVjtBQU1FLDhCQUFnQixlQU5sQjtBQU9FLHdCQUFVLElBUFo7QUFRRSw0QkFBYyxDQUNaO0FBQ0Usd0JBQVEsYUFEVjtBQUVFLHlCQUFTLElBRlg7QUFHRSx3QkFBUSxTQUhWO0FBSUUsd0JBQVEsSUFKVjtBQUtFLDhCQUFjO0FBTGhCLGVBRFksRUFRWjtBQUNFLHdCQUFRLGFBRFY7QUFFRSx5QkFBUyxJQUZYO0FBR0Usd0JBQVEsa0JBSFY7QUFJRSx3QkFBUSxJQUpWO0FBS0UsOEJBQWM7QUFMaEIsZUFSWSxFQWVaO0FBQ0Usd0JBQVEsYUFEVjtBQUVFLHlCQUFTLElBRlg7QUFHRSx3QkFBUSxPQUhWO0FBSUUsOEJBQWMsSUFKaEI7QUFLRSx3QkFBUSxJQUxWO0FBTUUsZ0NBQWdCLHdCQU5sQjtBQU9FLDBCQUFVLEtBUFo7QUFRRSw4QkFBYyxDQUNaO0FBQ0UsMEJBQVEsYUFEVjtBQUVFLDJCQUFTLElBRlg7QUFHRSwwQkFBUSxZQUhWO0FBSUUsMEJBQVEsSUFKVjtBQUtFLGdDQUFjO0FBTGhCLGlCQURZO0FBUmhCLGVBZlk7QUFSaEIsYUFsQ1k7QUFSaEIsV0FEWTtBQVJoQixTQURZO0FBUmhCLE9BRFk7QUFKSCxLQTFFUjtBQThMTCxjQUFVO0FBQ1IsdUJBQWlCLFVBRFQ7QUFFUixjQUFRLDRCQUZBO0FBR1IsWUFBTSxJQUhFO0FBSVIsY0FBUSxtNEJBSkE7QUFLUixrQkFBWTtBQUxKO0FBOUxMLEdBQVA7QUFzTUMsQ0F4VGlDLEVBQWxDLEMsQ0F5VEE7OztBQUNDaEI7QUFBSTtBQUFMLENBQWdCaUIsSUFBaEIsR0FBdUIsa0NBQXZCO0FBQ0FDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQm5CLElBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmxvd1xuICogQHJlbGF5SGFzaCA1MzhiYWU4NjE5MWI3NTBlNTYwYjZhZDhlMjk3OWMyOVxuICovXG5cbi8qIGVzbGludC1kaXNhYmxlICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyo6OlxuaW1wb3J0IHR5cGUgeyBDb25jcmV0ZVJlcXVlc3QgfSBmcm9tICdyZWxheS1ydW50aW1lJztcbnR5cGUgZW1vamlSZWFjdGlvbnNDb250cm9sbGVyX3JlYWN0YWJsZSRyZWYgPSBhbnk7XG5leHBvcnQgdHlwZSBDb21tZW50QXV0aG9yQXNzb2NpYXRpb24gPSBcIkNPTExBQk9SQVRPUlwiIHwgXCJDT05UUklCVVRPUlwiIHwgXCJGSVJTVF9USU1FUlwiIHwgXCJGSVJTVF9USU1FX0NPTlRSSUJVVE9SXCIgfCBcIk1BTk5FUVVJTlwiIHwgXCJNRU1CRVJcIiB8IFwiTk9ORVwiIHwgXCJPV05FUlwiIHwgXCIlZnV0dXJlIGFkZGVkIHZhbHVlXCI7XG5leHBvcnQgdHlwZSBBZGRQdWxsUmVxdWVzdFJldmlld0NvbW1lbnRJbnB1dCA9IHt8XG4gIHB1bGxSZXF1ZXN0SWQ/OiA/c3RyaW5nLFxuICBwdWxsUmVxdWVzdFJldmlld0lkPzogP3N0cmluZyxcbiAgY29tbWl0T0lEPzogP2FueSxcbiAgYm9keTogc3RyaW5nLFxuICBwYXRoPzogP3N0cmluZyxcbiAgcG9zaXRpb24/OiA/bnVtYmVyLFxuICBpblJlcGx5VG8/OiA/c3RyaW5nLFxuICBjbGllbnRNdXRhdGlvbklkPzogP3N0cmluZyxcbnx9O1xuZXhwb3J0IHR5cGUgYWRkUHJSZXZpZXdDb21tZW50TXV0YXRpb25WYXJpYWJsZXMgPSB7fFxuICBpbnB1dDogQWRkUHVsbFJlcXVlc3RSZXZpZXdDb21tZW50SW5wdXRcbnx9O1xuZXhwb3J0IHR5cGUgYWRkUHJSZXZpZXdDb21tZW50TXV0YXRpb25SZXNwb25zZSA9IHt8XG4gICthZGRQdWxsUmVxdWVzdFJldmlld0NvbW1lbnQ6ID97fFxuICAgICtjb21tZW50RWRnZTogP3t8XG4gICAgICArbm9kZTogP3t8XG4gICAgICAgICtpZDogc3RyaW5nLFxuICAgICAgICArYXV0aG9yOiA/e3xcbiAgICAgICAgICArYXZhdGFyVXJsOiBhbnksXG4gICAgICAgICAgK2xvZ2luOiBzdHJpbmcsXG4gICAgICAgIHx9LFxuICAgICAgICArYm9keTogc3RyaW5nLFxuICAgICAgICArYm9keUhUTUw6IGFueSxcbiAgICAgICAgK2lzTWluaW1pemVkOiBib29sZWFuLFxuICAgICAgICArdmlld2VyQ2FuUmVhY3Q6IGJvb2xlYW4sXG4gICAgICAgICt2aWV3ZXJDYW5VcGRhdGU6IGJvb2xlYW4sXG4gICAgICAgICtwYXRoOiBzdHJpbmcsXG4gICAgICAgICtwb3NpdGlvbjogP251bWJlcixcbiAgICAgICAgK2NyZWF0ZWRBdDogYW55LFxuICAgICAgICArbGFzdEVkaXRlZEF0OiA/YW55LFxuICAgICAgICArdXJsOiBhbnksXG4gICAgICAgICthdXRob3JBc3NvY2lhdGlvbjogQ29tbWVudEF1dGhvckFzc29jaWF0aW9uLFxuICAgICAgICArJGZyYWdtZW50UmVmczogZW1vamlSZWFjdGlvbnNDb250cm9sbGVyX3JlYWN0YWJsZSRyZWYsXG4gICAgICB8fVxuICAgIHx9XG4gIHx9XG58fTtcbmV4cG9ydCB0eXBlIGFkZFByUmV2aWV3Q29tbWVudE11dGF0aW9uID0ge3xcbiAgdmFyaWFibGVzOiBhZGRQclJldmlld0NvbW1lbnRNdXRhdGlvblZhcmlhYmxlcyxcbiAgcmVzcG9uc2U6IGFkZFByUmV2aWV3Q29tbWVudE11dGF0aW9uUmVzcG9uc2UsXG58fTtcbiovXG5cblxuLypcbm11dGF0aW9uIGFkZFByUmV2aWV3Q29tbWVudE11dGF0aW9uKFxuICAkaW5wdXQ6IEFkZFB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudElucHV0IVxuKSB7XG4gIGFkZFB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudChpbnB1dDogJGlucHV0KSB7XG4gICAgY29tbWVudEVkZ2Uge1xuICAgICAgbm9kZSB7XG4gICAgICAgIGlkXG4gICAgICAgIGF1dGhvciB7XG4gICAgICAgICAgX190eXBlbmFtZVxuICAgICAgICAgIGF2YXRhclVybFxuICAgICAgICAgIGxvZ2luXG4gICAgICAgICAgLi4uIG9uIE5vZGUge1xuICAgICAgICAgICAgaWRcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYm9keVxuICAgICAgICBib2R5SFRNTFxuICAgICAgICBpc01pbmltaXplZFxuICAgICAgICB2aWV3ZXJDYW5SZWFjdFxuICAgICAgICB2aWV3ZXJDYW5VcGRhdGVcbiAgICAgICAgcGF0aFxuICAgICAgICBwb3NpdGlvblxuICAgICAgICBjcmVhdGVkQXRcbiAgICAgICAgbGFzdEVkaXRlZEF0XG4gICAgICAgIHVybFxuICAgICAgICBhdXRob3JBc3NvY2lhdGlvblxuICAgICAgICAuLi5lbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXJfcmVhY3RhYmxlXG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbmZyYWdtZW50IGVtb2ppUmVhY3Rpb25zQ29udHJvbGxlcl9yZWFjdGFibGUgb24gUmVhY3RhYmxlIHtcbiAgaWRcbiAgLi4uZW1vamlSZWFjdGlvbnNWaWV3X3JlYWN0YWJsZVxufVxuXG5mcmFnbWVudCBlbW9qaVJlYWN0aW9uc1ZpZXdfcmVhY3RhYmxlIG9uIFJlYWN0YWJsZSB7XG4gIGlkXG4gIHJlYWN0aW9uR3JvdXBzIHtcbiAgICBjb250ZW50XG4gICAgdmlld2VySGFzUmVhY3RlZFxuICAgIHVzZXJzIHtcbiAgICAgIHRvdGFsQ291bnRcbiAgICB9XG4gIH1cbiAgdmlld2VyQ2FuUmVhY3Rcbn1cbiovXG5cbmNvbnN0IG5vZGUvKjogQ29uY3JldGVSZXF1ZXN0Ki8gPSAoZnVuY3Rpb24oKXtcbnZhciB2MCA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICBcIm5hbWVcIjogXCJpbnB1dFwiLFxuICAgIFwidHlwZVwiOiBcIkFkZFB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudElucHV0IVwiLFxuICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgfVxuXSxcbnYxID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICBcIm5hbWVcIjogXCJpbnB1dFwiLFxuICAgIFwidmFyaWFibGVOYW1lXCI6IFwiaW5wdXRcIlxuICB9XG5dLFxudjIgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiaWRcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjMgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiYXZhdGFyVXJsXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnY0ID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcImxvZ2luXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnY1ID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcImJvZHlcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjYgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiYm9keUhUTUxcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjcgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiaXNNaW5pbWl6ZWRcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjggPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwidmlld2VyQ2FuUmVhY3RcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjkgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwidmlld2VyQ2FuVXBkYXRlXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnYxMCA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJwYXRoXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnYxMSA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJwb3NpdGlvblwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52MTIgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiY3JlYXRlZEF0XCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnYxMyA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJsYXN0RWRpdGVkQXRcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjE0ID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcInVybFwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52MTUgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiYXV0aG9yQXNzb2NpYXRpb25cIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59O1xucmV0dXJuIHtcbiAgXCJraW5kXCI6IFwiUmVxdWVzdFwiLFxuICBcImZyYWdtZW50XCI6IHtcbiAgICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICAgIFwibmFtZVwiOiBcImFkZFByUmV2aWV3Q29tbWVudE11dGF0aW9uXCIsXG4gICAgXCJ0eXBlXCI6IFwiTXV0YXRpb25cIixcbiAgICBcIm1ldGFkYXRhXCI6IG51bGwsXG4gICAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6ICh2MC8qOiBhbnkqLyksXG4gICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICBcIm5hbWVcIjogXCJhZGRQdWxsUmVxdWVzdFJldmlld0NvbW1lbnRcIixcbiAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgIFwiYXJnc1wiOiAodjEvKjogYW55Ki8pLFxuICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIkFkZFB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudFBheWxvYWRcIixcbiAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbW1lbnRFZGdlXCIsXG4gICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJQdWxsUmVxdWVzdFJldmlld0NvbW1lbnRFZGdlXCIsXG4gICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJub2RlXCIsXG4gICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJQdWxsUmVxdWVzdFJldmlld0NvbW1lbnRcIixcbiAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgKHYyLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJhdXRob3JcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAodjMvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICh2NC8qOiBhbnkqLylcbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICh2NS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAodjYvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgKHY3Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICh2OC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAodjkvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgKHYxMC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAodjExLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICh2MTIvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgKHYxMy8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAodjE0Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICh2MTUvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJGcmFnbWVudFNwcmVhZFwiLFxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJlbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXJfcmVhY3RhYmxlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9LFxuICBcIm9wZXJhdGlvblwiOiB7XG4gICAgXCJraW5kXCI6IFwiT3BlcmF0aW9uXCIsXG4gICAgXCJuYW1lXCI6IFwiYWRkUHJSZXZpZXdDb21tZW50TXV0YXRpb25cIixcbiAgICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogKHYwLyo6IGFueSovKSxcbiAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAge1xuICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgIFwibmFtZVwiOiBcImFkZFB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudFwiLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgXCJhcmdzXCI6ICh2MS8qOiBhbnkqLyksXG4gICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiQWRkUHVsbFJlcXVlc3RSZXZpZXdDb21tZW50UGF5bG9hZFwiLFxuICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiY29tbWVudEVkZ2VcIixcbiAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudEVkZ2VcIixcbiAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm5vZGVcIixcbiAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudFwiLFxuICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAodjIvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImF1dGhvclwiLFxuICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJfX3R5cGVuYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAodjMvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICh2NC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgKHYyLyo6IGFueSovKVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgKHY1Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICh2Ni8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAodjcvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgKHY4Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICh2OS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAodjEwLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICh2MTEvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgKHYxMi8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAodjEzLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICh2MTQvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgKHYxNS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicmVhY3Rpb25Hcm91cHNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlJlYWN0aW9uR3JvdXBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY29udGVudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInZpZXdlckhhc1JlYWN0ZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ1c2Vyc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUmVhY3RpbmdVc2VyQ29ubmVjdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwidG90YWxDb3VudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIFwicGFyYW1zXCI6IHtcbiAgICBcIm9wZXJhdGlvbktpbmRcIjogXCJtdXRhdGlvblwiLFxuICAgIFwibmFtZVwiOiBcImFkZFByUmV2aWV3Q29tbWVudE11dGF0aW9uXCIsXG4gICAgXCJpZFwiOiBudWxsLFxuICAgIFwidGV4dFwiOiBcIm11dGF0aW9uIGFkZFByUmV2aWV3Q29tbWVudE11dGF0aW9uKFxcbiAgJGlucHV0OiBBZGRQdWxsUmVxdWVzdFJldmlld0NvbW1lbnRJbnB1dCFcXG4pIHtcXG4gIGFkZFB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudChpbnB1dDogJGlucHV0KSB7XFxuICAgIGNvbW1lbnRFZGdlIHtcXG4gICAgICBub2RlIHtcXG4gICAgICAgIGlkXFxuICAgICAgICBhdXRob3Ige1xcbiAgICAgICAgICBfX3R5cGVuYW1lXFxuICAgICAgICAgIGF2YXRhclVybFxcbiAgICAgICAgICBsb2dpblxcbiAgICAgICAgICAuLi4gb24gTm9kZSB7XFxuICAgICAgICAgICAgaWRcXG4gICAgICAgICAgfVxcbiAgICAgICAgfVxcbiAgICAgICAgYm9keVxcbiAgICAgICAgYm9keUhUTUxcXG4gICAgICAgIGlzTWluaW1pemVkXFxuICAgICAgICB2aWV3ZXJDYW5SZWFjdFxcbiAgICAgICAgdmlld2VyQ2FuVXBkYXRlXFxuICAgICAgICBwYXRoXFxuICAgICAgICBwb3NpdGlvblxcbiAgICAgICAgY3JlYXRlZEF0XFxuICAgICAgICBsYXN0RWRpdGVkQXRcXG4gICAgICAgIHVybFxcbiAgICAgICAgYXV0aG9yQXNzb2NpYXRpb25cXG4gICAgICAgIC4uLmVtb2ppUmVhY3Rpb25zQ29udHJvbGxlcl9yZWFjdGFibGVcXG4gICAgICB9XFxuICAgIH1cXG4gIH1cXG59XFxuXFxuZnJhZ21lbnQgZW1vamlSZWFjdGlvbnNDb250cm9sbGVyX3JlYWN0YWJsZSBvbiBSZWFjdGFibGUge1xcbiAgaWRcXG4gIC4uLmVtb2ppUmVhY3Rpb25zVmlld19yZWFjdGFibGVcXG59XFxuXFxuZnJhZ21lbnQgZW1vamlSZWFjdGlvbnNWaWV3X3JlYWN0YWJsZSBvbiBSZWFjdGFibGUge1xcbiAgaWRcXG4gIHJlYWN0aW9uR3JvdXBzIHtcXG4gICAgY29udGVudFxcbiAgICB2aWV3ZXJIYXNSZWFjdGVkXFxuICAgIHVzZXJzIHtcXG4gICAgICB0b3RhbENvdW50XFxuICAgIH1cXG4gIH1cXG4gIHZpZXdlckNhblJlYWN0XFxufVxcblwiLFxuICAgIFwibWV0YWRhdGFcIjoge31cbiAgfVxufTtcbn0pKCk7XG4vLyBwcmV0dGllci1pZ25vcmVcbihub2RlLyo6IGFueSovKS5oYXNoID0gJzA0ODU5MDAzNzE5MjhkZThjNmI4NDM1NjBkZmU0NDFjJztcbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcbiJdfQ==