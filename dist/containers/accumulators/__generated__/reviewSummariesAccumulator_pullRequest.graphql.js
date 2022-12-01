/**
 * @flow
 */

/* eslint-disable */
'use strict';
/*::
import type { ReaderFragment } from 'relay-runtime';
type emojiReactionsController_reactable$ref = any;
export type CommentAuthorAssociation = "COLLABORATOR" | "CONTRIBUTOR" | "FIRST_TIMER" | "FIRST_TIME_CONTRIBUTOR" | "MANNEQUIN" | "MEMBER" | "NONE" | "OWNER" | "%future added value";
export type PullRequestReviewState = "APPROVED" | "CHANGES_REQUESTED" | "COMMENTED" | "DISMISSED" | "PENDING" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type reviewSummariesAccumulator_pullRequest$ref: FragmentReference;
declare export opaque type reviewSummariesAccumulator_pullRequest$fragmentType: reviewSummariesAccumulator_pullRequest$ref;
export type reviewSummariesAccumulator_pullRequest = {|
  +url: any,
  +reviews: ?{|
    +pageInfo: {|
      +hasNextPage: boolean,
      +endCursor: ?string,
    |},
    +edges: ?$ReadOnlyArray<?{|
      +cursor: string,
      +node: ?{|
        +id: string,
        +body: string,
        +bodyHTML: any,
        +state: PullRequestReviewState,
        +submittedAt: ?any,
        +lastEditedAt: ?any,
        +url: any,
        +author: ?{|
          +login: string,
          +avatarUrl: any,
          +url: any,
        |},
        +viewerCanUpdate: boolean,
        +authorAssociation: CommentAuthorAssociation,
        +$fragmentRefs: emojiReactionsController_reactable$ref,
      |},
    |}>,
  |},
  +$refType: reviewSummariesAccumulator_pullRequest$ref,
|};
export type reviewSummariesAccumulator_pullRequest$data = reviewSummariesAccumulator_pullRequest;
export type reviewSummariesAccumulator_pullRequest$key = {
  +$data?: reviewSummariesAccumulator_pullRequest$data,
  +$fragmentRefs: reviewSummariesAccumulator_pullRequest$ref,
};
*/

const node
/*: ReaderFragment*/
= function () {
  var v0 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "url",
    "args": null,
    "storageKey": null
  };
  return {
    "kind": "Fragment",
    "name": "reviewSummariesAccumulator_pullRequest",
    "type": "PullRequest",
    "metadata": {
      "connection": [{
        "count": "reviewCount",
        "cursor": "reviewCursor",
        "direction": "forward",
        "path": ["reviews"]
      }]
    },
    "argumentDefinitions": [{
      "kind": "LocalArgument",
      "name": "reviewCount",
      "type": "Int!",
      "defaultValue": null
    }, {
      "kind": "LocalArgument",
      "name": "reviewCursor",
      "type": "String",
      "defaultValue": null
    }],
    "selections": [v0
    /*: any*/
    , {
      "kind": "LinkedField",
      "alias": "reviews",
      "name": "__ReviewSummariesAccumulator_reviews_connection",
      "storageKey": null,
      "args": null,
      "concreteType": "PullRequestReviewConnection",
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
        "concreteType": "PullRequestReviewEdge",
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
          "concreteType": "PullRequestReview",
          "plural": false,
          "selections": [{
            "kind": "ScalarField",
            "alias": null,
            "name": "id",
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
            "name": "bodyHTML",
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
            "name": "submittedAt",
            "args": null,
            "storageKey": null
          }, {
            "kind": "ScalarField",
            "alias": null,
            "name": "lastEditedAt",
            "args": null,
            "storageKey": null
          }, v0
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
              "name": "login",
              "args": null,
              "storageKey": null
            }, {
              "kind": "ScalarField",
              "alias": null,
              "name": "avatarUrl",
              "args": null,
              "storageKey": null
            }, v0
            /*: any*/
            ]
          }, {
            "kind": "ScalarField",
            "alias": null,
            "name": "viewerCanUpdate",
            "args": null,
            "storageKey": null
          }, {
            "kind": "ScalarField",
            "alias": null,
            "name": "authorAssociation",
            "args": null,
            "storageKey": null
          }, {
            "kind": "ScalarField",
            "alias": null,
            "name": "__typename",
            "args": null,
            "storageKey": null
          }, {
            "kind": "FragmentSpread",
            "name": "emojiReactionsController_reactable",
            "args": null
          }]
        }]
      }]
    }]
  };
}(); // prettier-ignore


node
/*: any*/
.hash = '4ac732c2325cedd6e8e90bb5c140cc1a';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9jb250YWluZXJzL2FjY3VtdWxhdG9ycy9fX2dlbmVyYXRlZF9fL3Jldmlld1N1bW1hcmllc0FjY3VtdWxhdG9yX3B1bGxSZXF1ZXN0LmdyYXBocWwuanMiXSwibmFtZXMiOlsibm9kZSIsInYwIiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQSxNQUFNQTtBQUFJO0FBQUEsRUFBd0IsWUFBVTtBQUM1QyxNQUFJQyxFQUFFLEdBQUc7QUFDUCxZQUFRLGFBREQ7QUFFUCxhQUFTLElBRkY7QUFHUCxZQUFRLEtBSEQ7QUFJUCxZQUFRLElBSkQ7QUFLUCxrQkFBYztBQUxQLEdBQVQ7QUFPQSxTQUFPO0FBQ0wsWUFBUSxVQURIO0FBRUwsWUFBUSx3Q0FGSDtBQUdMLFlBQVEsYUFISDtBQUlMLGdCQUFZO0FBQ1Ysb0JBQWMsQ0FDWjtBQUNFLGlCQUFTLGFBRFg7QUFFRSxrQkFBVSxjQUZaO0FBR0UscUJBQWEsU0FIZjtBQUlFLGdCQUFRLENBQ04sU0FETTtBQUpWLE9BRFk7QUFESixLQUpQO0FBZ0JMLDJCQUF1QixDQUNyQjtBQUNFLGNBQVEsZUFEVjtBQUVFLGNBQVEsYUFGVjtBQUdFLGNBQVEsTUFIVjtBQUlFLHNCQUFnQjtBQUpsQixLQURxQixFQU9yQjtBQUNFLGNBQVEsZUFEVjtBQUVFLGNBQVEsY0FGVjtBQUdFLGNBQVEsUUFIVjtBQUlFLHNCQUFnQjtBQUps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WDtBQUdFLG9CQUFRLGlCQUhWO0FBSUUsb0JBQVEsSUFKVjtBQUtFLDBCQUFjO0FBTGhCLFdBdEVZLEVBNkVaO0FBQ0Usb0JBQVEsYUFEVjtBQUVFLHFCQUFTLElBRlg7QUFHRSxvQkFBUSxtQkFIVjtBQUlFLG9CQUFRLElBSlY7QUFLRSwwQkFBYztBQUxoQixXQTdFWSxFQW9GWjtBQUNFLG9CQUFRLGFBRFY7QUFFRSxxQkFBUyxJQUZYO0FBR0Usb0JBQVEsWUFIVjtBQUlFLG9CQUFRLElBSlY7QUFLRSwwQkFBYztBQUxoQixXQXBGWSxFQTJGWjtBQUNFLG9CQUFRLGdCQURWO0FBRUUsb0JBQVEsb0NBRlY7QUFHRSxvQkFBUTtBQUhWLFdBM0ZZO0FBUmhCLFNBUlk7QUFSaEIsT0ExQlk7QUFSaEIsS0FGWTtBQTlCVCxHQUFQO0FBa01DLENBMU1nQyxFQUFqQyxDLENBMk1BOzs7QUFDQ0Q7QUFBSTtBQUFMLENBQWdCRSxJQUFoQixHQUF1QixrQ0FBdkI7QUFDQUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCSixJQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZsb3dcbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qOjpcbmltcG9ydCB0eXBlIHsgUmVhZGVyRnJhZ21lbnQgfSBmcm9tICdyZWxheS1ydW50aW1lJztcbnR5cGUgZW1vamlSZWFjdGlvbnNDb250cm9sbGVyX3JlYWN0YWJsZSRyZWYgPSBhbnk7XG5leHBvcnQgdHlwZSBDb21tZW50QXV0aG9yQXNzb2NpYXRpb24gPSBcIkNPTExBQk9SQVRPUlwiIHwgXCJDT05UUklCVVRPUlwiIHwgXCJGSVJTVF9USU1FUlwiIHwgXCJGSVJTVF9USU1FX0NPTlRSSUJVVE9SXCIgfCBcIk1BTk5FUVVJTlwiIHwgXCJNRU1CRVJcIiB8IFwiTk9ORVwiIHwgXCJPV05FUlwiIHwgXCIlZnV0dXJlIGFkZGVkIHZhbHVlXCI7XG5leHBvcnQgdHlwZSBQdWxsUmVxdWVzdFJldmlld1N0YXRlID0gXCJBUFBST1ZFRFwiIHwgXCJDSEFOR0VTX1JFUVVFU1RFRFwiIHwgXCJDT01NRU5URURcIiB8IFwiRElTTUlTU0VEXCIgfCBcIlBFTkRJTkdcIiB8IFwiJWZ1dHVyZSBhZGRlZCB2YWx1ZVwiO1xuaW1wb3J0IHR5cGUgeyBGcmFnbWVudFJlZmVyZW5jZSB9IGZyb20gXCJyZWxheS1ydW50aW1lXCI7XG5kZWNsYXJlIGV4cG9ydCBvcGFxdWUgdHlwZSByZXZpZXdTdW1tYXJpZXNBY2N1bXVsYXRvcl9wdWxsUmVxdWVzdCRyZWY6IEZyYWdtZW50UmVmZXJlbmNlO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgcmV2aWV3U3VtbWFyaWVzQWNjdW11bGF0b3JfcHVsbFJlcXVlc3QkZnJhZ21lbnRUeXBlOiByZXZpZXdTdW1tYXJpZXNBY2N1bXVsYXRvcl9wdWxsUmVxdWVzdCRyZWY7XG5leHBvcnQgdHlwZSByZXZpZXdTdW1tYXJpZXNBY2N1bXVsYXRvcl9wdWxsUmVxdWVzdCA9IHt8XG4gICt1cmw6IGFueSxcbiAgK3Jldmlld3M6ID97fFxuICAgICtwYWdlSW5mbzoge3xcbiAgICAgICtoYXNOZXh0UGFnZTogYm9vbGVhbixcbiAgICAgICtlbmRDdXJzb3I6ID9zdHJpbmcsXG4gICAgfH0sXG4gICAgK2VkZ2VzOiA/JFJlYWRPbmx5QXJyYXk8P3t8XG4gICAgICArY3Vyc29yOiBzdHJpbmcsXG4gICAgICArbm9kZTogP3t8XG4gICAgICAgICtpZDogc3RyaW5nLFxuICAgICAgICArYm9keTogc3RyaW5nLFxuICAgICAgICArYm9keUhUTUw6IGFueSxcbiAgICAgICAgK3N0YXRlOiBQdWxsUmVxdWVzdFJldmlld1N0YXRlLFxuICAgICAgICArc3VibWl0dGVkQXQ6ID9hbnksXG4gICAgICAgICtsYXN0RWRpdGVkQXQ6ID9hbnksXG4gICAgICAgICt1cmw6IGFueSxcbiAgICAgICAgK2F1dGhvcjogP3t8XG4gICAgICAgICAgK2xvZ2luOiBzdHJpbmcsXG4gICAgICAgICAgK2F2YXRhclVybDogYW55LFxuICAgICAgICAgICt1cmw6IGFueSxcbiAgICAgICAgfH0sXG4gICAgICAgICt2aWV3ZXJDYW5VcGRhdGU6IGJvb2xlYW4sXG4gICAgICAgICthdXRob3JBc3NvY2lhdGlvbjogQ29tbWVudEF1dGhvckFzc29jaWF0aW9uLFxuICAgICAgICArJGZyYWdtZW50UmVmczogZW1vamlSZWFjdGlvbnNDb250cm9sbGVyX3JlYWN0YWJsZSRyZWYsXG4gICAgICB8fSxcbiAgICB8fT4sXG4gIHx9LFxuICArJHJlZlR5cGU6IHJldmlld1N1bW1hcmllc0FjY3VtdWxhdG9yX3B1bGxSZXF1ZXN0JHJlZixcbnx9O1xuZXhwb3J0IHR5cGUgcmV2aWV3U3VtbWFyaWVzQWNjdW11bGF0b3JfcHVsbFJlcXVlc3QkZGF0YSA9IHJldmlld1N1bW1hcmllc0FjY3VtdWxhdG9yX3B1bGxSZXF1ZXN0O1xuZXhwb3J0IHR5cGUgcmV2aWV3U3VtbWFyaWVzQWNjdW11bGF0b3JfcHVsbFJlcXVlc3Qka2V5ID0ge1xuICArJGRhdGE/OiByZXZpZXdTdW1tYXJpZXNBY2N1bXVsYXRvcl9wdWxsUmVxdWVzdCRkYXRhLFxuICArJGZyYWdtZW50UmVmczogcmV2aWV3U3VtbWFyaWVzQWNjdW11bGF0b3JfcHVsbFJlcXVlc3QkcmVmLFxufTtcbiovXG5cblxuY29uc3Qgbm9kZS8qOiBSZWFkZXJGcmFnbWVudCovID0gKGZ1bmN0aW9uKCl7XG52YXIgdjAgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwidXJsXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufTtcbnJldHVybiB7XG4gIFwia2luZFwiOiBcIkZyYWdtZW50XCIsXG4gIFwibmFtZVwiOiBcInJldmlld1N1bW1hcmllc0FjY3VtdWxhdG9yX3B1bGxSZXF1ZXN0XCIsXG4gIFwidHlwZVwiOiBcIlB1bGxSZXF1ZXN0XCIsXG4gIFwibWV0YWRhdGFcIjoge1xuICAgIFwiY29ubmVjdGlvblwiOiBbXG4gICAgICB7XG4gICAgICAgIFwiY291bnRcIjogXCJyZXZpZXdDb3VudFwiLFxuICAgICAgICBcImN1cnNvclwiOiBcInJldmlld0N1cnNvclwiLFxuICAgICAgICBcImRpcmVjdGlvblwiOiBcImZvcndhcmRcIixcbiAgICAgICAgXCJwYXRoXCI6IFtcbiAgICAgICAgICBcInJldmlld3NcIlxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9LFxuICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogW1xuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICAgIFwibmFtZVwiOiBcInJldmlld0NvdW50XCIsXG4gICAgICBcInR5cGVcIjogXCJJbnQhXCIsXG4gICAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgICBcIm5hbWVcIjogXCJyZXZpZXdDdXJzb3JcIixcbiAgICAgIFwidHlwZVwiOiBcIlN0cmluZ1wiLFxuICAgICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICAgIH1cbiAgXSxcbiAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAodjAvKjogYW55Ki8pLFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IFwicmV2aWV3c1wiLFxuICAgICAgXCJuYW1lXCI6IFwiX19SZXZpZXdTdW1tYXJpZXNBY2N1bXVsYXRvcl9yZXZpZXdzX2Nvbm5lY3Rpb25cIixcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlB1bGxSZXF1ZXN0UmV2aWV3Q29ubmVjdGlvblwiLFxuICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgXCJuYW1lXCI6IFwicGFnZUluZm9cIixcbiAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlBhZ2VJbmZvXCIsXG4gICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJoYXNOZXh0UGFnZVwiLFxuICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZW5kQ3Vyc29yXCIsXG4gICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgIFwibmFtZVwiOiBcImVkZ2VzXCIsXG4gICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJQdWxsUmVxdWVzdFJldmlld0VkZ2VcIixcbiAgICAgICAgICBcInBsdXJhbFwiOiB0cnVlLFxuICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY3Vyc29yXCIsXG4gICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJub2RlXCIsXG4gICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJQdWxsUmVxdWVzdFJldmlld1wiLFxuICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaWRcIixcbiAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJib2R5XCIsXG4gICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiYm9keUhUTUxcIixcbiAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJzdGF0ZVwiLFxuICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInN1Ym1pdHRlZEF0XCIsXG4gICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibGFzdEVkaXRlZEF0XCIsXG4gICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAodjAvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJhdXRob3JcIixcbiAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibG9naW5cIixcbiAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiYXZhdGFyVXJsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgKHYwLyo6IGFueSovKVxuICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInZpZXdlckNhblVwZGF0ZVwiLFxuICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImF1dGhvckFzc29jaWF0aW9uXCIsXG4gICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiX190eXBlbmFtZVwiLFxuICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiRnJhZ21lbnRTcHJlYWRcIixcbiAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImVtb2ppUmVhY3Rpb25zQ29udHJvbGxlcl9yZWFjdGFibGVcIixcbiAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICBdXG59O1xufSkoKTtcbi8vIHByZXR0aWVyLWlnbm9yZVxuKG5vZGUvKjogYW55Ki8pLmhhc2ggPSAnNGFjNzMyYzIzMjVjZWRkNmU4ZTkwYmI1YzE0MGNjMWEnO1xubW9kdWxlLmV4cG9ydHMgPSBub2RlO1xuIl19