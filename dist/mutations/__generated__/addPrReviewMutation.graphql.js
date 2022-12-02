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

const node
/*: ConcreteRequest*/
= function () {
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
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "addPullRequestReview",
        "storageKey": null,
        "args": v1
        /*: any*/
        ,
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
            "selections": [v2
            /*: any*/
            , v3
            /*: any*/
            , v4
            /*: any*/
            , v5
            /*: any*/
            , v6
            /*: any*/
            , v7
            /*: any*/
            , v8
            /*: any*/
            , {
              "kind": "LinkedField",
              "alias": null,
              "name": "author",
              "storageKey": null,
              "args": null,
              "concreteType": null,
              "plural": false,
              "selections": [v9
              /*: any*/
              , v10
              /*: any*/
              ]
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
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "addPullRequestReview",
        "storageKey": null,
        "args": v1
        /*: any*/
        ,
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
            "selections": [v2
            /*: any*/
            , v3
            /*: any*/
            , v4
            /*: any*/
            , v5
            /*: any*/
            , v6
            /*: any*/
            , v7
            /*: any*/
            , v8
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
              }, v9
              /*: any*/
              , v10
              /*: any*/
              , v2
              /*: any*/
              ]
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
}(); // prettier-ignore


node
/*: any*/
.hash = 'd2960bba4729b6c3e91e249ea582fec1';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9tdXRhdGlvbnMvX19nZW5lcmF0ZWRfXy9hZGRQclJldmlld011dGF0aW9uLmdyYXBocWwuanMiXSwibmFtZXMiOlsibm9kZSIsInYwIiwidjEiLCJ2MiIsInYzIiwidjQiLCJ2NSIsInY2IiwidjciLCJ2OCIsInY5IiwidjEwIiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxNQUFNQTtBQUFJO0FBQUEsRUFBeUIsWUFBVTtBQUM3QyxNQUFJQyxFQUFFLEdBQUcsQ0FDUDtBQUNFLFlBQVEsZUFEVjtBQUVFLFlBQVEsT0FGVjtBQUdFLFlBQVEsNEJBSFY7QUFJRSxvQkFBZ0I7QUFKbEIsR0FETyxDQUFUO0FBQUEsTUFRQUMsRUFBRSxHQUFHLENB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QUFQLEdBQWlCZCxJQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZsb3dcbiAqIEByZWxheUhhc2ggM2U2ZTk2YTcwMTliZWI3OGQ0NGM3OGM3YTIzYWQ4NWRcbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qOjpcbmltcG9ydCB0eXBlIHsgQ29uY3JldGVSZXF1ZXN0IH0gZnJvbSAncmVsYXktcnVudGltZSc7XG50eXBlIGVtb2ppUmVhY3Rpb25zQ29udHJvbGxlcl9yZWFjdGFibGUkcmVmID0gYW55O1xuZXhwb3J0IHR5cGUgRGlmZlNpZGUgPSBcIkxFRlRcIiB8IFwiUklHSFRcIiB8IFwiJWZ1dHVyZSBhZGRlZCB2YWx1ZVwiO1xuZXhwb3J0IHR5cGUgUHVsbFJlcXVlc3RSZXZpZXdFdmVudCA9IFwiQVBQUk9WRVwiIHwgXCJDT01NRU5UXCIgfCBcIkRJU01JU1NcIiB8IFwiUkVRVUVTVF9DSEFOR0VTXCIgfCBcIiVmdXR1cmUgYWRkZWQgdmFsdWVcIjtcbmV4cG9ydCB0eXBlIFB1bGxSZXF1ZXN0UmV2aWV3U3RhdGUgPSBcIkFQUFJPVkVEXCIgfCBcIkNIQU5HRVNfUkVRVUVTVEVEXCIgfCBcIkNPTU1FTlRFRFwiIHwgXCJESVNNSVNTRURcIiB8IFwiUEVORElOR1wiIHwgXCIlZnV0dXJlIGFkZGVkIHZhbHVlXCI7XG5leHBvcnQgdHlwZSBBZGRQdWxsUmVxdWVzdFJldmlld0lucHV0ID0ge3xcbiAgcHVsbFJlcXVlc3RJZDogc3RyaW5nLFxuICBjb21taXRPSUQ/OiA/YW55LFxuICBib2R5PzogP3N0cmluZyxcbiAgZXZlbnQ/OiA/UHVsbFJlcXVlc3RSZXZpZXdFdmVudCxcbiAgY29tbWVudHM/OiA/JFJlYWRPbmx5QXJyYXk8P0RyYWZ0UHVsbFJlcXVlc3RSZXZpZXdDb21tZW50PixcbiAgdGhyZWFkcz86ID8kUmVhZE9ubHlBcnJheTw/RHJhZnRQdWxsUmVxdWVzdFJldmlld1RocmVhZD4sXG4gIGNsaWVudE11dGF0aW9uSWQ/OiA/c3RyaW5nLFxufH07XG5leHBvcnQgdHlwZSBEcmFmdFB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudCA9IHt8XG4gIHBhdGg6IHN0cmluZyxcbiAgcG9zaXRpb246IG51bWJlcixcbiAgYm9keTogc3RyaW5nLFxufH07XG5leHBvcnQgdHlwZSBEcmFmdFB1bGxSZXF1ZXN0UmV2aWV3VGhyZWFkID0ge3xcbiAgcGF0aDogc3RyaW5nLFxuICBsaW5lOiBudW1iZXIsXG4gIHNpZGU/OiA/RGlmZlNpZGUsXG4gIHN0YXJ0TGluZT86ID9udW1iZXIsXG4gIHN0YXJ0U2lkZT86ID9EaWZmU2lkZSxcbiAgYm9keTogc3RyaW5nLFxufH07XG5leHBvcnQgdHlwZSBhZGRQclJldmlld011dGF0aW9uVmFyaWFibGVzID0ge3xcbiAgaW5wdXQ6IEFkZFB1bGxSZXF1ZXN0UmV2aWV3SW5wdXRcbnx9O1xuZXhwb3J0IHR5cGUgYWRkUHJSZXZpZXdNdXRhdGlvblJlc3BvbnNlID0ge3xcbiAgK2FkZFB1bGxSZXF1ZXN0UmV2aWV3OiA/e3xcbiAgICArcmV2aWV3RWRnZTogP3t8XG4gICAgICArbm9kZTogP3t8XG4gICAgICAgICtpZDogc3RyaW5nLFxuICAgICAgICArYm9keTogc3RyaW5nLFxuICAgICAgICArYm9keUhUTUw6IGFueSxcbiAgICAgICAgK3N0YXRlOiBQdWxsUmVxdWVzdFJldmlld1N0YXRlLFxuICAgICAgICArc3VibWl0dGVkQXQ6ID9hbnksXG4gICAgICAgICt2aWV3ZXJDYW5SZWFjdDogYm9vbGVhbixcbiAgICAgICAgK3ZpZXdlckNhblVwZGF0ZTogYm9vbGVhbixcbiAgICAgICAgK2F1dGhvcjogP3t8XG4gICAgICAgICAgK2xvZ2luOiBzdHJpbmcsXG4gICAgICAgICAgK2F2YXRhclVybDogYW55LFxuICAgICAgICB8fSxcbiAgICAgICAgKyRmcmFnbWVudFJlZnM6IGVtb2ppUmVhY3Rpb25zQ29udHJvbGxlcl9yZWFjdGFibGUkcmVmLFxuICAgICAgfH1cbiAgICB8fVxuICB8fVxufH07XG5leHBvcnQgdHlwZSBhZGRQclJldmlld011dGF0aW9uID0ge3xcbiAgdmFyaWFibGVzOiBhZGRQclJldmlld011dGF0aW9uVmFyaWFibGVzLFxuICByZXNwb25zZTogYWRkUHJSZXZpZXdNdXRhdGlvblJlc3BvbnNlLFxufH07XG4qL1xuXG5cbi8qXG5tdXRhdGlvbiBhZGRQclJldmlld011dGF0aW9uKFxuICAkaW5wdXQ6IEFkZFB1bGxSZXF1ZXN0UmV2aWV3SW5wdXQhXG4pIHtcbiAgYWRkUHVsbFJlcXVlc3RSZXZpZXcoaW5wdXQ6ICRpbnB1dCkge1xuICAgIHJldmlld0VkZ2Uge1xuICAgICAgbm9kZSB7XG4gICAgICAgIGlkXG4gICAgICAgIGJvZHlcbiAgICAgICAgYm9keUhUTUxcbiAgICAgICAgc3RhdGVcbiAgICAgICAgc3VibWl0dGVkQXRcbiAgICAgICAgdmlld2VyQ2FuUmVhY3RcbiAgICAgICAgdmlld2VyQ2FuVXBkYXRlXG4gICAgICAgIGF1dGhvciB7XG4gICAgICAgICAgX190eXBlbmFtZVxuICAgICAgICAgIGxvZ2luXG4gICAgICAgICAgYXZhdGFyVXJsXG4gICAgICAgICAgLi4uIG9uIE5vZGUge1xuICAgICAgICAgICAgaWRcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLi4uZW1vamlSZWFjdGlvbnNDb250cm9sbGVyX3JlYWN0YWJsZVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mcmFnbWVudCBlbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXJfcmVhY3RhYmxlIG9uIFJlYWN0YWJsZSB7XG4gIGlkXG4gIC4uLmVtb2ppUmVhY3Rpb25zVmlld19yZWFjdGFibGVcbn1cblxuZnJhZ21lbnQgZW1vamlSZWFjdGlvbnNWaWV3X3JlYWN0YWJsZSBvbiBSZWFjdGFibGUge1xuICBpZFxuICByZWFjdGlvbkdyb3VwcyB7XG4gICAgY29udGVudFxuICAgIHZpZXdlckhhc1JlYWN0ZWRcbiAgICB1c2VycyB7XG4gICAgICB0b3RhbENvdW50XG4gICAgfVxuICB9XG4gIHZpZXdlckNhblJlYWN0XG59XG4qL1xuXG5jb25zdCBub2RlLyo6IENvbmNyZXRlUmVxdWVzdCovID0gKGZ1bmN0aW9uKCl7XG52YXIgdjAgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwiaW5wdXRcIixcbiAgICBcInR5cGVcIjogXCJBZGRQdWxsUmVxdWVzdFJldmlld0lucHV0IVwiLFxuICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgfVxuXSxcbnYxID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICBcIm5hbWVcIjogXCJpbnB1dFwiLFxuICAgIFwidmFyaWFibGVOYW1lXCI6IFwiaW5wdXRcIlxuICB9XG5dLFxudjIgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiaWRcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjMgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiYm9keVwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52NCA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJib2R5SFRNTFwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52NSA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJzdGF0ZVwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52NiA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJzdWJtaXR0ZWRBdFwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52NyA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJ2aWV3ZXJDYW5SZWFjdFwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52OCA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJ2aWV3ZXJDYW5VcGRhdGVcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjkgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwibG9naW5cIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjEwID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcImF2YXRhclVybFwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn07XG5yZXR1cm4ge1xuICBcImtpbmRcIjogXCJSZXF1ZXN0XCIsXG4gIFwiZnJhZ21lbnRcIjoge1xuICAgIFwia2luZFwiOiBcIkZyYWdtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwiYWRkUHJSZXZpZXdNdXRhdGlvblwiLFxuICAgIFwidHlwZVwiOiBcIk11dGF0aW9uXCIsXG4gICAgXCJtZXRhZGF0YVwiOiBudWxsLFxuICAgIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiAodjAvKjogYW55Ki8pLFxuICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgXCJuYW1lXCI6IFwiYWRkUHVsbFJlcXVlc3RSZXZpZXdcIixcbiAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgIFwiYXJnc1wiOiAodjEvKjogYW55Ki8pLFxuICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIkFkZFB1bGxSZXF1ZXN0UmV2aWV3UGF5bG9hZFwiLFxuICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwicmV2aWV3RWRnZVwiLFxuICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUHVsbFJlcXVlc3RSZXZpZXdFZGdlXCIsXG4gICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJub2RlXCIsXG4gICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJQdWxsUmVxdWVzdFJldmlld1wiLFxuICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAodjIvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgKHYzLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICh2NC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAodjUvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgKHY2Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICh2Ny8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAodjgvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImF1dGhvclwiLFxuICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICh2OS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgKHYxMC8qOiBhbnkqLylcbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiRnJhZ21lbnRTcHJlYWRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZW1vamlSZWFjdGlvbnNDb250cm9sbGVyX3JlYWN0YWJsZVwiLFxuICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAgXCJvcGVyYXRpb25cIjoge1xuICAgIFwia2luZFwiOiBcIk9wZXJhdGlvblwiLFxuICAgIFwibmFtZVwiOiBcImFkZFByUmV2aWV3TXV0YXRpb25cIixcbiAgICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogKHYwLyo6IGFueSovKSxcbiAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAge1xuICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgIFwibmFtZVwiOiBcImFkZFB1bGxSZXF1ZXN0UmV2aWV3XCIsXG4gICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICBcImFyZ3NcIjogKHYxLyo6IGFueSovKSxcbiAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJBZGRQdWxsUmVxdWVzdFJldmlld1BheWxvYWRcIixcbiAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgIFwibmFtZVwiOiBcInJldmlld0VkZ2VcIixcbiAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlB1bGxSZXF1ZXN0UmV2aWV3RWRnZVwiLFxuICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibm9kZVwiLFxuICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUHVsbFJlcXVlc3RSZXZpZXdcIixcbiAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgKHYyLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICh2My8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAodjQvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgKHY1Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICh2Ni8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAodjcvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgKHY4Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJhdXRob3JcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiX190eXBlbmFtZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgKHY5Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAodjEwLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAodjIvKjogYW55Ki8pXG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicmVhY3Rpb25Hcm91cHNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlJlYWN0aW9uR3JvdXBcIixcbiAgICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY29udGVudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInZpZXdlckhhc1JlYWN0ZWRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ1c2Vyc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUmVhY3RpbmdVc2VyQ29ubmVjdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwidG90YWxDb3VudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIFwicGFyYW1zXCI6IHtcbiAgICBcIm9wZXJhdGlvbktpbmRcIjogXCJtdXRhdGlvblwiLFxuICAgIFwibmFtZVwiOiBcImFkZFByUmV2aWV3TXV0YXRpb25cIixcbiAgICBcImlkXCI6IG51bGwsXG4gICAgXCJ0ZXh0XCI6IFwibXV0YXRpb24gYWRkUHJSZXZpZXdNdXRhdGlvbihcXG4gICRpbnB1dDogQWRkUHVsbFJlcXVlc3RSZXZpZXdJbnB1dCFcXG4pIHtcXG4gIGFkZFB1bGxSZXF1ZXN0UmV2aWV3KGlucHV0OiAkaW5wdXQpIHtcXG4gICAgcmV2aWV3RWRnZSB7XFxuICAgICAgbm9kZSB7XFxuICAgICAgICBpZFxcbiAgICAgICAgYm9keVxcbiAgICAgICAgYm9keUhUTUxcXG4gICAgICAgIHN0YXRlXFxuICAgICAgICBzdWJtaXR0ZWRBdFxcbiAgICAgICAgdmlld2VyQ2FuUmVhY3RcXG4gICAgICAgIHZpZXdlckNhblVwZGF0ZVxcbiAgICAgICAgYXV0aG9yIHtcXG4gICAgICAgICAgX190eXBlbmFtZVxcbiAgICAgICAgICBsb2dpblxcbiAgICAgICAgICBhdmF0YXJVcmxcXG4gICAgICAgICAgLi4uIG9uIE5vZGUge1xcbiAgICAgICAgICAgIGlkXFxuICAgICAgICAgIH1cXG4gICAgICAgIH1cXG4gICAgICAgIC4uLmVtb2ppUmVhY3Rpb25zQ29udHJvbGxlcl9yZWFjdGFibGVcXG4gICAgICB9XFxuICAgIH1cXG4gIH1cXG59XFxuXFxuZnJhZ21lbnQgZW1vamlSZWFjdGlvbnNDb250cm9sbGVyX3JlYWN0YWJsZSBvbiBSZWFjdGFibGUge1xcbiAgaWRcXG4gIC4uLmVtb2ppUmVhY3Rpb25zVmlld19yZWFjdGFibGVcXG59XFxuXFxuZnJhZ21lbnQgZW1vamlSZWFjdGlvbnNWaWV3X3JlYWN0YWJsZSBvbiBSZWFjdGFibGUge1xcbiAgaWRcXG4gIHJlYWN0aW9uR3JvdXBzIHtcXG4gICAgY29udGVudFxcbiAgICB2aWV3ZXJIYXNSZWFjdGVkXFxuICAgIHVzZXJzIHtcXG4gICAgICB0b3RhbENvdW50XFxuICAgIH1cXG4gIH1cXG4gIHZpZXdlckNhblJlYWN0XFxufVxcblwiLFxuICAgIFwibWV0YWRhdGFcIjoge31cbiAgfVxufTtcbn0pKCk7XG4vLyBwcmV0dGllci1pZ25vcmVcbihub2RlLyo6IGFueSovKS5oYXNoID0gJ2QyOTYwYmJhNDcyOWI2YzNlOTFlMjQ5ZWE1ODJmZWMxJztcbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcbiJdfQ==