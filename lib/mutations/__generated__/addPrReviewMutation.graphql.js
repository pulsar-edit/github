/**
 * @flow
 * @relayHash 3e6e96a7019beb78d44c78c7a23ad85d
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type emojiReactionsController_reactable$ref = any;
export type DiffSide = "LEFT" | "RIGHT" | "%future added value";
export type PullRequestReviewEvent = "APPROVE" | "COMMENT" | "DISMISS" | "REQUEST_CHANGES" | "%future added value";
export type PullRequestReviewState = "APPROVED" | "CHANGES_REQUESTED" | "COMMENTED" | "DISMISSED" | "PENDING" | "%future added value";
export type AddPullRequestReviewInput = {|
  pullRequestId: string,
  commitOID?: ?any,
  body?: ?string,
  event?: ?PullRequestReviewEvent,
  comments?: ?$ReadOnlyArray<?DraftPullRequestReviewComment>,
  threads?: ?$ReadOnlyArray<?DraftPullRequestReviewThread>,
  clientMutationId?: ?string,
|};
export type DraftPullRequestReviewComment = {|
  path: string,
  position: number,
  body: string,
|};
export type DraftPullRequestReviewThread = {|
  path: string,
  line: number,
  side?: ?DiffSide,
  startLine?: ?number,
  startSide?: ?DiffSide,
  body: string,
|};
export type addPrReviewMutationVariables = {|
  input: AddPullRequestReviewInput
|};
export type addPrReviewMutationResponse = {|
  +addPullRequestReview: ?{|
    +reviewEdge: ?{|
      +node: ?{|
        +id: string,
        +body: string,
        +bodyHTML: any,
        +state: PullRequestReviewState,
        +submittedAt: ?any,
        +viewerCanReact: boolean,
        +viewerCanUpdate: boolean,
        +author: ?{|
          +login: string,
          +avatarUrl: any,
        |},
        +$fragmentRefs: emojiReactionsController_reactable$ref,
      |}
    |}
  |}
|};
export type addPrReviewMutation = {|
  variables: addPrReviewMutationVariables,
  response: addPrReviewMutationResponse,
|};
*/

/*
mutation addPrReviewMutation(
  $input: AddPullRequestReviewInput!
) {
  addPullRequestReview(input: $input) {
    reviewEdge {
      node {
        id
        body
        bodyHTML
        state
        submittedAt
        viewerCanReact
        viewerCanUpdate
        author {
          __typename
          login
          avatarUrl
          ... on Node {
            id
          }
        }
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
const node /*: ConcreteRequest*/ = function () {
  var v0 = [{
      "kind": "LocalArgument",
      "name": "input",
      "type": "AddPullRequestReviewInput!",
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
      "name": "body",
      "args": null,
      "storageKey": null
    },
    v4 = {
      "kind": "ScalarField",
      "alias": null,
      "name": "bodyHTML",
      "args": null,
      "storageKey": null
    },
    v5 = {
      "kind": "ScalarField",
      "alias": null,
      "name": "state",
      "args": null,
      "storageKey": null
    },
    v6 = {
      "kind": "ScalarField",
      "alias": null,
      "name": "submittedAt",
      "args": null,
      "storageKey": null
    },
    v7 = {
      "kind": "ScalarField",
      "alias": null,
      "name": "viewerCanReact",
      "args": null,
      "storageKey": null
    },
    v8 = {
      "kind": "ScalarField",
      "alias": null,
      "name": "viewerCanUpdate",
      "args": null,
      "storageKey": null
    },
    v9 = {
      "kind": "ScalarField",
      "alias": null,
      "name": "login",
      "args": null,
      "storageKey": null
    },
    v10 = {
      "kind": "ScalarField",
      "alias": null,
      "name": "avatarUrl",
      "args": null,
      "storageKey": null
    };
  return {
    "kind": "Request",
    "fragment": {
      "kind": "Fragment",
      "name": "addPrReviewMutation",
      "type": "Mutation",
      "metadata": null,
      "argumentDefinitions": v0 /*: any*/,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "addPullRequestReview",
        "storageKey": null,
        "args": v1 /*: any*/,
        "concreteType": "AddPullRequestReviewPayload",
        "plural": false,
        "selections": [{
          "kind": "LinkedField",
          "alias": null,
          "name": "reviewEdge",
          "storageKey": null,
          "args": null,
          "concreteType": "PullRequestReviewEdge",
          "plural": false,
          "selections": [{
            "kind": "LinkedField",
            "alias": null,
            "name": "node",
            "storageKey": null,
            "args": null,
            "concreteType": "PullRequestReview",
            "plural": false,
            "selections": [v2 /*: any*/, v3 /*: any*/, v4 /*: any*/, v5 /*: any*/, v6 /*: any*/, v7 /*: any*/, v8 /*: any*/, {
              "kind": "LinkedField",
              "alias": null,
              "name": "author",
              "storageKey": null,
              "args": null,
              "concreteType": null,
              "plural": false,
              "selections": [v9 /*: any*/, v10 /*: any*/]
            }, {
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
      "name": "addPrReviewMutation",
      "argumentDefinitions": v0 /*: any*/,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "addPullRequestReview",
        "storageKey": null,
        "args": v1 /*: any*/,
        "concreteType": "AddPullRequestReviewPayload",
        "plural": false,
        "selections": [{
          "kind": "LinkedField",
          "alias": null,
          "name": "reviewEdge",
          "storageKey": null,
          "args": null,
          "concreteType": "PullRequestReviewEdge",
          "plural": false,
          "selections": [{
            "kind": "LinkedField",
            "alias": null,
            "name": "node",
            "storageKey": null,
            "args": null,
            "concreteType": "PullRequestReview",
            "plural": false,
            "selections": [v2 /*: any*/, v3 /*: any*/, v4 /*: any*/, v5 /*: any*/, v6 /*: any*/, v7 /*: any*/, v8 /*: any*/, {
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
              }, v9 /*: any*/, v10 /*: any*/, v2 /*: any*/]
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
            }]
          }]
        }]
      }]
    },
    "params": {
      "operationKind": "mutation",
      "name": "addPrReviewMutation",
      "id": null,
      "text": "mutation addPrReviewMutation(\n  $input: AddPullRequestReviewInput!\n) {\n  addPullRequestReview(input: $input) {\n    reviewEdge {\n      node {\n        id\n        body\n        bodyHTML\n        state\n        submittedAt\n        viewerCanReact\n        viewerCanUpdate\n        author {\n          __typename\n          login\n          avatarUrl\n          ... on Node {\n            id\n          }\n        }\n        ...emojiReactionsController_reactable\n      }\n    }\n  }\n}\n\nfragment emojiReactionsController_reactable on Reactable {\n  id\n  ...emojiReactionsView_reactable\n}\n\nfragment emojiReactionsView_reactable on Reactable {\n  id\n  reactionGroups {\n    content\n    viewerHasReacted\n    users {\n      totalCount\n    }\n  }\n  viewerCanReact\n}\n",
      "metadata": {}
    }
  };
}();
// prettier-ignore
node /*: any*/.hash = 'd2960bba4729b6c3e91e249ea582fec1';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJub2RlIiwidjAiLCJ2MSIsInYyIiwidjMiLCJ2NCIsInY1IiwidjYiLCJ2NyIsInY4IiwidjkiLCJ2MTAiLCJoYXNoIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJzb3VyY2VzIjpbImFkZFByUmV2aWV3TXV0YXRpb24uZ3JhcGhxbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmbG93XG4gKiBAcmVsYXlIYXNoIDNlNmU5NmE3MDE5YmViNzhkNDRjNzhjN2EyM2FkODVkXG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKjo6XG5pbXBvcnQgdHlwZSB7IENvbmNyZXRlUmVxdWVzdCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xudHlwZSBlbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXJfcmVhY3RhYmxlJHJlZiA9IGFueTtcbmV4cG9ydCB0eXBlIERpZmZTaWRlID0gXCJMRUZUXCIgfCBcIlJJR0hUXCIgfCBcIiVmdXR1cmUgYWRkZWQgdmFsdWVcIjtcbmV4cG9ydCB0eXBlIFB1bGxSZXF1ZXN0UmV2aWV3RXZlbnQgPSBcIkFQUFJPVkVcIiB8IFwiQ09NTUVOVFwiIHwgXCJESVNNSVNTXCIgfCBcIlJFUVVFU1RfQ0hBTkdFU1wiIHwgXCIlZnV0dXJlIGFkZGVkIHZhbHVlXCI7XG5leHBvcnQgdHlwZSBQdWxsUmVxdWVzdFJldmlld1N0YXRlID0gXCJBUFBST1ZFRFwiIHwgXCJDSEFOR0VTX1JFUVVFU1RFRFwiIHwgXCJDT01NRU5URURcIiB8IFwiRElTTUlTU0VEXCIgfCBcIlBFTkRJTkdcIiB8IFwiJWZ1dHVyZSBhZGRlZCB2YWx1ZVwiO1xuZXhwb3J0IHR5cGUgQWRkUHVsbFJlcXVlc3RSZXZpZXdJbnB1dCA9IHt8XG4gIHB1bGxSZXF1ZXN0SWQ6IHN0cmluZyxcbiAgY29tbWl0T0lEPzogP2FueSxcbiAgYm9keT86ID9zdHJpbmcsXG4gIGV2ZW50PzogP1B1bGxSZXF1ZXN0UmV2aWV3RXZlbnQsXG4gIGNvbW1lbnRzPzogPyRSZWFkT25seUFycmF5PD9EcmFmdFB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudD4sXG4gIHRocmVhZHM/OiA/JFJlYWRPbmx5QXJyYXk8P0RyYWZ0UHVsbFJlcXVlc3RSZXZpZXdUaHJlYWQ+LFxuICBjbGllbnRNdXRhdGlvbklkPzogP3N0cmluZyxcbnx9O1xuZXhwb3J0IHR5cGUgRHJhZnRQdWxsUmVxdWVzdFJldmlld0NvbW1lbnQgPSB7fFxuICBwYXRoOiBzdHJpbmcsXG4gIHBvc2l0aW9uOiBudW1iZXIsXG4gIGJvZHk6IHN0cmluZyxcbnx9O1xuZXhwb3J0IHR5cGUgRHJhZnRQdWxsUmVxdWVzdFJldmlld1RocmVhZCA9IHt8XG4gIHBhdGg6IHN0cmluZyxcbiAgbGluZTogbnVtYmVyLFxuICBzaWRlPzogP0RpZmZTaWRlLFxuICBzdGFydExpbmU/OiA/bnVtYmVyLFxuICBzdGFydFNpZGU/OiA/RGlmZlNpZGUsXG4gIGJvZHk6IHN0cmluZyxcbnx9O1xuZXhwb3J0IHR5cGUgYWRkUHJSZXZpZXdNdXRhdGlvblZhcmlhYmxlcyA9IHt8XG4gIGlucHV0OiBBZGRQdWxsUmVxdWVzdFJldmlld0lucHV0XG58fTtcbmV4cG9ydCB0eXBlIGFkZFByUmV2aWV3TXV0YXRpb25SZXNwb25zZSA9IHt8XG4gICthZGRQdWxsUmVxdWVzdFJldmlldzogP3t8XG4gICAgK3Jldmlld0VkZ2U6ID97fFxuICAgICAgK25vZGU6ID97fFxuICAgICAgICAraWQ6IHN0cmluZyxcbiAgICAgICAgK2JvZHk6IHN0cmluZyxcbiAgICAgICAgK2JvZHlIVE1MOiBhbnksXG4gICAgICAgICtzdGF0ZTogUHVsbFJlcXVlc3RSZXZpZXdTdGF0ZSxcbiAgICAgICAgK3N1Ym1pdHRlZEF0OiA/YW55LFxuICAgICAgICArdmlld2VyQ2FuUmVhY3Q6IGJvb2xlYW4sXG4gICAgICAgICt2aWV3ZXJDYW5VcGRhdGU6IGJvb2xlYW4sXG4gICAgICAgICthdXRob3I6ID97fFxuICAgICAgICAgICtsb2dpbjogc3RyaW5nLFxuICAgICAgICAgICthdmF0YXJVcmw6IGFueSxcbiAgICAgICAgfH0sXG4gICAgICAgICskZnJhZ21lbnRSZWZzOiBlbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXJfcmVhY3RhYmxlJHJlZixcbiAgICAgIHx9XG4gICAgfH1cbiAgfH1cbnx9O1xuZXhwb3J0IHR5cGUgYWRkUHJSZXZpZXdNdXRhdGlvbiA9IHt8XG4gIHZhcmlhYmxlczogYWRkUHJSZXZpZXdNdXRhdGlvblZhcmlhYmxlcyxcbiAgcmVzcG9uc2U6IGFkZFByUmV2aWV3TXV0YXRpb25SZXNwb25zZSxcbnx9O1xuKi9cblxuXG4vKlxubXV0YXRpb24gYWRkUHJSZXZpZXdNdXRhdGlvbihcbiAgJGlucHV0OiBBZGRQdWxsUmVxdWVzdFJldmlld0lucHV0IVxuKSB7XG4gIGFkZFB1bGxSZXF1ZXN0UmV2aWV3KGlucHV0OiAkaW5wdXQpIHtcbiAgICByZXZpZXdFZGdlIHtcbiAgICAgIG5vZGUge1xuICAgICAgICBpZFxuICAgICAgICBib2R5XG4gICAgICAgIGJvZHlIVE1MXG4gICAgICAgIHN0YXRlXG4gICAgICAgIHN1Ym1pdHRlZEF0XG4gICAgICAgIHZpZXdlckNhblJlYWN0XG4gICAgICAgIHZpZXdlckNhblVwZGF0ZVxuICAgICAgICBhdXRob3Ige1xuICAgICAgICAgIF9fdHlwZW5hbWVcbiAgICAgICAgICBsb2dpblxuICAgICAgICAgIGF2YXRhclVybFxuICAgICAgICAgIC4uLiBvbiBOb2RlIHtcbiAgICAgICAgICAgIGlkXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC4uLmVtb2ppUmVhY3Rpb25zQ29udHJvbGxlcl9yZWFjdGFibGVcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cblxuZnJhZ21lbnQgZW1vamlSZWFjdGlvbnNDb250cm9sbGVyX3JlYWN0YWJsZSBvbiBSZWFjdGFibGUge1xuICBpZFxuICAuLi5lbW9qaVJlYWN0aW9uc1ZpZXdfcmVhY3RhYmxlXG59XG5cbmZyYWdtZW50IGVtb2ppUmVhY3Rpb25zVmlld19yZWFjdGFibGUgb24gUmVhY3RhYmxlIHtcbiAgaWRcbiAgcmVhY3Rpb25Hcm91cHMge1xuICAgIGNvbnRlbnRcbiAgICB2aWV3ZXJIYXNSZWFjdGVkXG4gICAgdXNlcnMge1xuICAgICAgdG90YWxDb3VudFxuICAgIH1cbiAgfVxuICB2aWV3ZXJDYW5SZWFjdFxufVxuKi9cblxuY29uc3Qgbm9kZS8qOiBDb25jcmV0ZVJlcXVlc3QqLyA9IChmdW5jdGlvbigpe1xudmFyIHYwID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgIFwibmFtZVwiOiBcImlucHV0XCIsXG4gICAgXCJ0eXBlXCI6IFwiQWRkUHVsbFJlcXVlc3RSZXZpZXdJbnB1dCFcIixcbiAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gIH1cbl0sXG52MSA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgXCJuYW1lXCI6IFwiaW5wdXRcIixcbiAgICBcInZhcmlhYmxlTmFtZVwiOiBcImlucHV0XCJcbiAgfVxuXSxcbnYyID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcImlkXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnYzID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcImJvZHlcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjQgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiYm9keUhUTUxcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjUgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwic3RhdGVcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjYgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwic3VibWl0dGVkQXRcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjcgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwidmlld2VyQ2FuUmVhY3RcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjggPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwidmlld2VyQ2FuVXBkYXRlXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnY5ID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcImxvZ2luXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnYxMCA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJhdmF0YXJVcmxcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59O1xucmV0dXJuIHtcbiAgXCJraW5kXCI6IFwiUmVxdWVzdFwiLFxuICBcImZyYWdtZW50XCI6IHtcbiAgICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICAgIFwibmFtZVwiOiBcImFkZFByUmV2aWV3TXV0YXRpb25cIixcbiAgICBcInR5cGVcIjogXCJNdXRhdGlvblwiLFxuICAgIFwibWV0YWRhdGFcIjogbnVsbCxcbiAgICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogKHYwLyo6IGFueSovKSxcbiAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAge1xuICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgIFwibmFtZVwiOiBcImFkZFB1bGxSZXF1ZXN0UmV2aWV3XCIsXG4gICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICBcImFyZ3NcIjogKHYxLyo6IGFueSovKSxcbiAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJBZGRQdWxsUmVxdWVzdFJldmlld1BheWxvYWRcIixcbiAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgIFwibmFtZVwiOiBcInJldmlld0VkZ2VcIixcbiAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlB1bGxSZXF1ZXN0UmV2aWV3RWRnZVwiLFxuICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibm9kZVwiLFxuICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUHVsbFJlcXVlc3RSZXZpZXdcIixcbiAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgKHYyLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICh2My8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAodjQvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgKHY1Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICh2Ni8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAodjcvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgKHY4Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJhdXRob3JcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAodjkvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICh2MTAvKjogYW55Ki8pXG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkZyYWdtZW50U3ByZWFkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImVtb2ppUmVhY3Rpb25zQ29udHJvbGxlcl9yZWFjdGFibGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGxcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIFwib3BlcmF0aW9uXCI6IHtcbiAgICBcImtpbmRcIjogXCJPcGVyYXRpb25cIixcbiAgICBcIm5hbWVcIjogXCJhZGRQclJldmlld011dGF0aW9uXCIsXG4gICAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6ICh2MC8qOiBhbnkqLyksXG4gICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICBcIm5hbWVcIjogXCJhZGRQdWxsUmVxdWVzdFJldmlld1wiLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgXCJhcmdzXCI6ICh2MS8qOiBhbnkqLyksXG4gICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiQWRkUHVsbFJlcXVlc3RSZXZpZXdQYXlsb2FkXCIsXG4gICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJyZXZpZXdFZGdlXCIsXG4gICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJQdWxsUmVxdWVzdFJldmlld0VkZ2VcIixcbiAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm5vZGVcIixcbiAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlB1bGxSZXF1ZXN0UmV2aWV3XCIsXG4gICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICh2Mi8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAodjMvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgKHY0Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICh2NS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAodjYvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgKHY3Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICh2OC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiYXV0aG9yXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIl9fdHlwZW5hbWVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICh2OS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgKHYxMC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgKHYyLyo6IGFueSovKVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInJlYWN0aW9uR3JvdXBzXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJSZWFjdGlvbkdyb3VwXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbnRlbnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ2aWV3ZXJIYXNSZWFjdGVkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwidXNlcnNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlJlYWN0aW5nVXNlckNvbm5lY3Rpb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInRvdGFsQ291bnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9LFxuICBcInBhcmFtc1wiOiB7XG4gICAgXCJvcGVyYXRpb25LaW5kXCI6IFwibXV0YXRpb25cIixcbiAgICBcIm5hbWVcIjogXCJhZGRQclJldmlld011dGF0aW9uXCIsXG4gICAgXCJpZFwiOiBudWxsLFxuICAgIFwidGV4dFwiOiBcIm11dGF0aW9uIGFkZFByUmV2aWV3TXV0YXRpb24oXFxuICAkaW5wdXQ6IEFkZFB1bGxSZXF1ZXN0UmV2aWV3SW5wdXQhXFxuKSB7XFxuICBhZGRQdWxsUmVxdWVzdFJldmlldyhpbnB1dDogJGlucHV0KSB7XFxuICAgIHJldmlld0VkZ2Uge1xcbiAgICAgIG5vZGUge1xcbiAgICAgICAgaWRcXG4gICAgICAgIGJvZHlcXG4gICAgICAgIGJvZHlIVE1MXFxuICAgICAgICBzdGF0ZVxcbiAgICAgICAgc3VibWl0dGVkQXRcXG4gICAgICAgIHZpZXdlckNhblJlYWN0XFxuICAgICAgICB2aWV3ZXJDYW5VcGRhdGVcXG4gICAgICAgIGF1dGhvciB7XFxuICAgICAgICAgIF9fdHlwZW5hbWVcXG4gICAgICAgICAgbG9naW5cXG4gICAgICAgICAgYXZhdGFyVXJsXFxuICAgICAgICAgIC4uLiBvbiBOb2RlIHtcXG4gICAgICAgICAgICBpZFxcbiAgICAgICAgICB9XFxuICAgICAgICB9XFxuICAgICAgICAuLi5lbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXJfcmVhY3RhYmxlXFxuICAgICAgfVxcbiAgICB9XFxuICB9XFxufVxcblxcbmZyYWdtZW50IGVtb2ppUmVhY3Rpb25zQ29udHJvbGxlcl9yZWFjdGFibGUgb24gUmVhY3RhYmxlIHtcXG4gIGlkXFxuICAuLi5lbW9qaVJlYWN0aW9uc1ZpZXdfcmVhY3RhYmxlXFxufVxcblxcbmZyYWdtZW50IGVtb2ppUmVhY3Rpb25zVmlld19yZWFjdGFibGUgb24gUmVhY3RhYmxlIHtcXG4gIGlkXFxuICByZWFjdGlvbkdyb3VwcyB7XFxuICAgIGNvbnRlbnRcXG4gICAgdmlld2VySGFzUmVhY3RlZFxcbiAgICB1c2VycyB7XFxuICAgICAgdG90YWxDb3VudFxcbiAgICB9XFxuICB9XFxuICB2aWV3ZXJDYW5SZWFjdFxcbn1cXG5cIixcbiAgICBcIm1ldGFkYXRhXCI6IHt9XG4gIH1cbn07XG59KSgpO1xuLy8gcHJldHRpZXItaWdub3JlXG4obm9kZS8qOiBhbnkqLykuaGFzaCA9ICdkMjk2MGJiYTQ3MjliNmMzZTkxZTI0OWVhNTgyZmVjMSc7XG5tb2R1bGUuZXhwb3J0cyA9IG5vZGU7XG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLFlBQVk7O0FBRVo7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