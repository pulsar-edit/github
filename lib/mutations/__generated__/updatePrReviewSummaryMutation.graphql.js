/**
 * @flow
 * @relayHash 9f4a505afe3e790f464c47612add4de4
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type UpdatePullRequestReviewInput = {|
  pullRequestReviewId: string,
  body: string,
  clientMutationId?: ?string,
|};
export type updatePrReviewSummaryMutationVariables = {|
  input: UpdatePullRequestReviewInput
|};
export type updatePrReviewSummaryMutationResponse = {|
  +updatePullRequestReview: ?{|
    +pullRequestReview: ?{|
      +id: string,
      +lastEditedAt: ?any,
      +body: string,
      +bodyHTML: any,
    |}
  |}
|};
export type updatePrReviewSummaryMutation = {|
  variables: updatePrReviewSummaryMutationVariables,
  response: updatePrReviewSummaryMutationResponse,
|};
*/

/*
mutation updatePrReviewSummaryMutation(
  $input: UpdatePullRequestReviewInput!
) {
  updatePullRequestReview(input: $input) {
    pullRequestReview {
      id
      lastEditedAt
      body
      bodyHTML
    }
  }
}
*/
const node /*: ConcreteRequest*/ = function () {
  var v0 = [{
      "kind": "LocalArgument",
      "name": "input",
      "type": "UpdatePullRequestReviewInput!",
      "defaultValue": null
    }],
    v1 = [{
      "kind": "LinkedField",
      "alias": null,
      "name": "updatePullRequestReview",
      "storageKey": null,
      "args": [{
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }],
      "concreteType": "UpdatePullRequestReviewPayload",
      "plural": false,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "pullRequestReview",
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
          "name": "lastEditedAt",
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
        }]
      }]
    }];
  return {
    "kind": "Request",
    "fragment": {
      "kind": "Fragment",
      "name": "updatePrReviewSummaryMutation",
      "type": "Mutation",
      "metadata": null,
      "argumentDefinitions": v0 /*: any*/,
      "selections": v1 /*: any*/
    },
    "operation": {
      "kind": "Operation",
      "name": "updatePrReviewSummaryMutation",
      "argumentDefinitions": v0 /*: any*/,
      "selections": v1 /*: any*/
    },
    "params": {
      "operationKind": "mutation",
      "name": "updatePrReviewSummaryMutation",
      "id": null,
      "text": "mutation updatePrReviewSummaryMutation(\n  $input: UpdatePullRequestReviewInput!\n) {\n  updatePullRequestReview(input: $input) {\n    pullRequestReview {\n      id\n      lastEditedAt\n      body\n      bodyHTML\n    }\n  }\n}\n",
      "metadata": {}
    }
  };
}();
// prettier-ignore
node /*: any*/.hash = 'ce6fa7b9b5a5709f8cc8001aa7ba8a15';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJub2RlIiwidjAiLCJ2MSIsImhhc2giLCJtb2R1bGUiLCJleHBvcnRzIl0sInNvdXJjZXMiOlsidXBkYXRlUHJSZXZpZXdTdW1tYXJ5TXV0YXRpb24uZ3JhcGhxbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmbG93XG4gKiBAcmVsYXlIYXNoIDlmNGE1MDVhZmUzZTc5MGY0NjRjNDc2MTJhZGQ0ZGU0XG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKjo6XG5pbXBvcnQgdHlwZSB7IENvbmNyZXRlUmVxdWVzdCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xuZXhwb3J0IHR5cGUgVXBkYXRlUHVsbFJlcXVlc3RSZXZpZXdJbnB1dCA9IHt8XG4gIHB1bGxSZXF1ZXN0UmV2aWV3SWQ6IHN0cmluZyxcbiAgYm9keTogc3RyaW5nLFxuICBjbGllbnRNdXRhdGlvbklkPzogP3N0cmluZyxcbnx9O1xuZXhwb3J0IHR5cGUgdXBkYXRlUHJSZXZpZXdTdW1tYXJ5TXV0YXRpb25WYXJpYWJsZXMgPSB7fFxuICBpbnB1dDogVXBkYXRlUHVsbFJlcXVlc3RSZXZpZXdJbnB1dFxufH07XG5leHBvcnQgdHlwZSB1cGRhdGVQclJldmlld1N1bW1hcnlNdXRhdGlvblJlc3BvbnNlID0ge3xcbiAgK3VwZGF0ZVB1bGxSZXF1ZXN0UmV2aWV3OiA/e3xcbiAgICArcHVsbFJlcXVlc3RSZXZpZXc6ID97fFxuICAgICAgK2lkOiBzdHJpbmcsXG4gICAgICArbGFzdEVkaXRlZEF0OiA/YW55LFxuICAgICAgK2JvZHk6IHN0cmluZyxcbiAgICAgICtib2R5SFRNTDogYW55LFxuICAgIHx9XG4gIHx9XG58fTtcbmV4cG9ydCB0eXBlIHVwZGF0ZVByUmV2aWV3U3VtbWFyeU11dGF0aW9uID0ge3xcbiAgdmFyaWFibGVzOiB1cGRhdGVQclJldmlld1N1bW1hcnlNdXRhdGlvblZhcmlhYmxlcyxcbiAgcmVzcG9uc2U6IHVwZGF0ZVByUmV2aWV3U3VtbWFyeU11dGF0aW9uUmVzcG9uc2UsXG58fTtcbiovXG5cblxuLypcbm11dGF0aW9uIHVwZGF0ZVByUmV2aWV3U3VtbWFyeU11dGF0aW9uKFxuICAkaW5wdXQ6IFVwZGF0ZVB1bGxSZXF1ZXN0UmV2aWV3SW5wdXQhXG4pIHtcbiAgdXBkYXRlUHVsbFJlcXVlc3RSZXZpZXcoaW5wdXQ6ICRpbnB1dCkge1xuICAgIHB1bGxSZXF1ZXN0UmV2aWV3IHtcbiAgICAgIGlkXG4gICAgICBsYXN0RWRpdGVkQXRcbiAgICAgIGJvZHlcbiAgICAgIGJvZHlIVE1MXG4gICAgfVxuICB9XG59XG4qL1xuXG5jb25zdCBub2RlLyo6IENvbmNyZXRlUmVxdWVzdCovID0gKGZ1bmN0aW9uKCl7XG52YXIgdjAgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwiaW5wdXRcIixcbiAgICBcInR5cGVcIjogXCJVcGRhdGVQdWxsUmVxdWVzdFJldmlld0lucHV0IVwiLFxuICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgfVxuXSxcbnYxID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgXCJuYW1lXCI6IFwidXBkYXRlUHVsbFJlcXVlc3RSZXZpZXdcIixcbiAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICBcImFyZ3NcIjogW1xuICAgICAge1xuICAgICAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgICAgICBcIm5hbWVcIjogXCJpbnB1dFwiLFxuICAgICAgICBcInZhcmlhYmxlTmFtZVwiOiBcImlucHV0XCJcbiAgICAgIH1cbiAgICBdLFxuICAgIFwiY29uY3JldGVUeXBlXCI6IFwiVXBkYXRlUHVsbFJlcXVlc3RSZXZpZXdQYXlsb2FkXCIsXG4gICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICBcIm5hbWVcIjogXCJwdWxsUmVxdWVzdFJldmlld1wiLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUHVsbFJlcXVlc3RSZXZpZXdcIixcbiAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImlkXCIsXG4gICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwibGFzdEVkaXRlZEF0XCIsXG4gICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiYm9keVwiLFxuICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImJvZHlIVE1MXCIsXG4gICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9XG5dO1xucmV0dXJuIHtcbiAgXCJraW5kXCI6IFwiUmVxdWVzdFwiLFxuICBcImZyYWdtZW50XCI6IHtcbiAgICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICAgIFwibmFtZVwiOiBcInVwZGF0ZVByUmV2aWV3U3VtbWFyeU11dGF0aW9uXCIsXG4gICAgXCJ0eXBlXCI6IFwiTXV0YXRpb25cIixcbiAgICBcIm1ldGFkYXRhXCI6IG51bGwsXG4gICAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6ICh2MC8qOiBhbnkqLyksXG4gICAgXCJzZWxlY3Rpb25zXCI6ICh2MS8qOiBhbnkqLylcbiAgfSxcbiAgXCJvcGVyYXRpb25cIjoge1xuICAgIFwia2luZFwiOiBcIk9wZXJhdGlvblwiLFxuICAgIFwibmFtZVwiOiBcInVwZGF0ZVByUmV2aWV3U3VtbWFyeU11dGF0aW9uXCIsXG4gICAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6ICh2MC8qOiBhbnkqLyksXG4gICAgXCJzZWxlY3Rpb25zXCI6ICh2MS8qOiBhbnkqLylcbiAgfSxcbiAgXCJwYXJhbXNcIjoge1xuICAgIFwib3BlcmF0aW9uS2luZFwiOiBcIm11dGF0aW9uXCIsXG4gICAgXCJuYW1lXCI6IFwidXBkYXRlUHJSZXZpZXdTdW1tYXJ5TXV0YXRpb25cIixcbiAgICBcImlkXCI6IG51bGwsXG4gICAgXCJ0ZXh0XCI6IFwibXV0YXRpb24gdXBkYXRlUHJSZXZpZXdTdW1tYXJ5TXV0YXRpb24oXFxuICAkaW5wdXQ6IFVwZGF0ZVB1bGxSZXF1ZXN0UmV2aWV3SW5wdXQhXFxuKSB7XFxuICB1cGRhdGVQdWxsUmVxdWVzdFJldmlldyhpbnB1dDogJGlucHV0KSB7XFxuICAgIHB1bGxSZXF1ZXN0UmV2aWV3IHtcXG4gICAgICBpZFxcbiAgICAgIGxhc3RFZGl0ZWRBdFxcbiAgICAgIGJvZHlcXG4gICAgICBib2R5SFRNTFxcbiAgICB9XFxuICB9XFxufVxcblwiLFxuICAgIFwibWV0YWRhdGFcIjoge31cbiAgfVxufTtcbn0pKCk7XG4vLyBwcmV0dGllci1pZ25vcmVcbihub2RlLyo6IGFueSovKS5oYXNoID0gJ2NlNmZhN2I5YjVhNTcwOWY4Y2M4MDAxYWE3YmE4YTE1Jztcbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsWUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsTUFBTUEsSUFBSSx5QkFBeUIsWUFBVTtFQUM3QyxJQUFJQyxFQUFFLEdBQUcsQ0FDUDtNQUNFLE1BQU0sRUFBRSxlQUFlO01BQ3ZCLE1BQU0sRUFBRSxPQUFPO01BQ2YsTUFBTSxFQUFFLCtCQUErQjtNQUN2QyxjQUFjLEVBQUU7SUFDbEIsQ0FBQyxDQUNGO0lBQ0RDLEVBQUUsR0FBRyxDQUNIO01BQ0UsTUFBTSxFQUFFLGFBQWE7TUFDckIsT0FBTyxFQUFFLElBQUk7TUFDYixNQUFNLEVBQUUseUJBQXlCO01BQ2pDLFlBQVksRUFBRSxJQUFJO01BQ2xCLE1BQU0sRUFBRSxDQUNOO1FBQ0UsTUFBTSxFQUFFLFVBQVU7UUFDbEIsTUFBTSxFQUFFLE9BQU87UUFDZixjQUFjLEVBQUU7TUFDbEIsQ0FBQyxDQUNGO01BQ0QsY0FBYyxFQUFFLGdDQUFnQztNQUNoRCxRQUFRLEVBQUUsS0FBSztNQUNmLFlBQVksRUFBRSxDQUNaO1FBQ0UsTUFBTSxFQUFFLGFBQWE7UUFDckIsT0FBTyxFQUFFLElBQUk7UUFDYixNQUFNLEVBQUUsbUJBQW1CO1FBQzNCLFlBQVksRUFBRSxJQUFJO1FBQ2xCLE1BQU0sRUFBRSxJQUFJO1FBQ1osY0FBYyxFQUFFLG1CQUFtQjtRQUNuQyxRQUFRLEVBQUUsS0FBSztRQUNmLFlBQVksRUFBRSxDQUNaO1VBQ0UsTUFBTSxFQUFFLGFBQWE7VUFDckIsT0FBTyxFQUFFLElBQUk7VUFDYixNQUFNLEVBQUUsSUFBSTtVQUNaLE1BQU0sRUFBRSxJQUFJO1VBQ1osWUFBWSxFQUFFO1FBQ2hCLENBQUMsRUFDRDtVQUNFLE1BQU0sRUFBRSxhQUFhO1VBQ3JCLE9BQU8sRUFBRSxJQUFJO1VBQ2IsTUFBTSxFQUFFLGNBQWM7VUFDdEIsTUFBTSxFQUFFLElBQUk7VUFDWixZQUFZLEVBQUU7UUFDaEIsQ0FBQyxFQUNEO1VBQ0UsTUFBTSxFQUFFLGFBQWE7VUFDckIsT0FBTyxFQUFFLElBQUk7VUFDYixNQUFNLEVBQUUsTUFBTTtVQUNkLE1BQU0sRUFBRSxJQUFJO1VBQ1osWUFBWSxFQUFFO1FBQ2hCLENBQUMsRUFDRDtVQUNFLE1BQU0sRUFBRSxhQUFhO1VBQ3JCLE9BQU8sRUFBRSxJQUFJO1VBQ2IsTUFBTSxFQUFFLFVBQVU7VUFDbEIsTUFBTSxFQUFFLElBQUk7VUFDWixZQUFZLEVBQUU7UUFDaEIsQ0FBQztNQUVMLENBQUM7SUFFTCxDQUFDLENBQ0Y7RUFDRCxPQUFPO0lBQ0wsTUFBTSxFQUFFLFNBQVM7SUFDakIsVUFBVSxFQUFFO01BQ1YsTUFBTSxFQUFFLFVBQVU7TUFDbEIsTUFBTSxFQUFFLCtCQUErQjtNQUN2QyxNQUFNLEVBQUUsVUFBVTtNQUNsQixVQUFVLEVBQUUsSUFBSTtNQUNoQixxQkFBcUIsRUFBR0QsRUFBRSxVQUFVO01BQ3BDLFlBQVksRUFBR0MsRUFBRTtJQUNuQixDQUFDO0lBQ0QsV0FBVyxFQUFFO01BQ1gsTUFBTSxFQUFFLFdBQVc7TUFDbkIsTUFBTSxFQUFFLCtCQUErQjtNQUN2QyxxQkFBcUIsRUFBR0QsRUFBRSxVQUFVO01BQ3BDLFlBQVksRUFBR0MsRUFBRTtJQUNuQixDQUFDO0lBQ0QsUUFBUSxFQUFFO01BQ1IsZUFBZSxFQUFFLFVBQVU7TUFDM0IsTUFBTSxFQUFFLCtCQUErQjtNQUN2QyxJQUFJLEVBQUUsSUFBSTtNQUNWLE1BQU0sRUFBRSx1T0FBdU87TUFDL08sVUFBVSxFQUFFLENBQUM7SUFDZjtFQUNGLENBQUM7QUFDRCxDQUFDLENBQUUsQ0FBQztBQUNKO0FBQ0NGLElBQUksV0FBV0csSUFBSSxHQUFHLGtDQUFrQztBQUN6REMsTUFBTSxDQUFDQyxPQUFPLEdBQUdMLElBQUkifQ==