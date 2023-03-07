/**
 * @flow
 * @relayHash 80f1ab174b7e397d863eaebebf19d297
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type PullRequestReviewEvent = "APPROVE" | "COMMENT" | "DISMISS" | "REQUEST_CHANGES" | "%future added value";
export type SubmitPullRequestReviewInput = {|
  pullRequestId?: ?string,
  pullRequestReviewId?: ?string,
  event: PullRequestReviewEvent,
  body?: ?string,
  clientMutationId?: ?string,
|};
export type submitPrReviewMutationVariables = {|
  input: SubmitPullRequestReviewInput
|};
export type submitPrReviewMutationResponse = {|
  +submitPullRequestReview: ?{|
    +pullRequestReview: ?{|
      +id: string
    |}
  |}
|};
export type submitPrReviewMutation = {|
  variables: submitPrReviewMutationVariables,
  response: submitPrReviewMutationResponse,
|};
*/

/*
mutation submitPrReviewMutation(
  $input: SubmitPullRequestReviewInput!
) {
  submitPullRequestReview(input: $input) {
    pullRequestReview {
      id
    }
  }
}
*/
const node /*: ConcreteRequest*/ = function () {
  var v0 = [{
      "kind": "LocalArgument",
      "name": "input",
      "type": "SubmitPullRequestReviewInput!",
      "defaultValue": null
    }],
    v1 = [{
      "kind": "LinkedField",
      "alias": null,
      "name": "submitPullRequestReview",
      "storageKey": null,
      "args": [{
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }],
      "concreteType": "SubmitPullRequestReviewPayload",
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
        }]
      }]
    }];
  return {
    "kind": "Request",
    "fragment": {
      "kind": "Fragment",
      "name": "submitPrReviewMutation",
      "type": "Mutation",
      "metadata": null,
      "argumentDefinitions": v0 /*: any*/,
      "selections": v1 /*: any*/
    },

    "operation": {
      "kind": "Operation",
      "name": "submitPrReviewMutation",
      "argumentDefinitions": v0 /*: any*/,
      "selections": v1 /*: any*/
    },

    "params": {
      "operationKind": "mutation",
      "name": "submitPrReviewMutation",
      "id": null,
      "text": "mutation submitPrReviewMutation(\n  $input: SubmitPullRequestReviewInput!\n) {\n  submitPullRequestReview(input: $input) {\n    pullRequestReview {\n      id\n    }\n  }\n}\n",
      "metadata": {}
    }
  };
}();
// prettier-ignore
node /*: any*/.hash = 'c52752b3b2cde11e6c86d574ffa967a0';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJub2RlIiwidjAiLCJ2MSIsImhhc2giLCJtb2R1bGUiLCJleHBvcnRzIl0sInNvdXJjZXMiOlsic3VibWl0UHJSZXZpZXdNdXRhdGlvbi5ncmFwaHFsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZsb3dcbiAqIEByZWxheUhhc2ggODBmMWFiMTc0YjdlMzk3ZDg2M2VhZWJlYmYxOWQyOTdcbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qOjpcbmltcG9ydCB0eXBlIHsgQ29uY3JldGVSZXF1ZXN0IH0gZnJvbSAncmVsYXktcnVudGltZSc7XG5leHBvcnQgdHlwZSBQdWxsUmVxdWVzdFJldmlld0V2ZW50ID0gXCJBUFBST1ZFXCIgfCBcIkNPTU1FTlRcIiB8IFwiRElTTUlTU1wiIHwgXCJSRVFVRVNUX0NIQU5HRVNcIiB8IFwiJWZ1dHVyZSBhZGRlZCB2YWx1ZVwiO1xuZXhwb3J0IHR5cGUgU3VibWl0UHVsbFJlcXVlc3RSZXZpZXdJbnB1dCA9IHt8XG4gIHB1bGxSZXF1ZXN0SWQ/OiA/c3RyaW5nLFxuICBwdWxsUmVxdWVzdFJldmlld0lkPzogP3N0cmluZyxcbiAgZXZlbnQ6IFB1bGxSZXF1ZXN0UmV2aWV3RXZlbnQsXG4gIGJvZHk/OiA/c3RyaW5nLFxuICBjbGllbnRNdXRhdGlvbklkPzogP3N0cmluZyxcbnx9O1xuZXhwb3J0IHR5cGUgc3VibWl0UHJSZXZpZXdNdXRhdGlvblZhcmlhYmxlcyA9IHt8XG4gIGlucHV0OiBTdWJtaXRQdWxsUmVxdWVzdFJldmlld0lucHV0XG58fTtcbmV4cG9ydCB0eXBlIHN1Ym1pdFByUmV2aWV3TXV0YXRpb25SZXNwb25zZSA9IHt8XG4gICtzdWJtaXRQdWxsUmVxdWVzdFJldmlldzogP3t8XG4gICAgK3B1bGxSZXF1ZXN0UmV2aWV3OiA/e3xcbiAgICAgICtpZDogc3RyaW5nXG4gICAgfH1cbiAgfH1cbnx9O1xuZXhwb3J0IHR5cGUgc3VibWl0UHJSZXZpZXdNdXRhdGlvbiA9IHt8XG4gIHZhcmlhYmxlczogc3VibWl0UHJSZXZpZXdNdXRhdGlvblZhcmlhYmxlcyxcbiAgcmVzcG9uc2U6IHN1Ym1pdFByUmV2aWV3TXV0YXRpb25SZXNwb25zZSxcbnx9O1xuKi9cblxuXG4vKlxubXV0YXRpb24gc3VibWl0UHJSZXZpZXdNdXRhdGlvbihcbiAgJGlucHV0OiBTdWJtaXRQdWxsUmVxdWVzdFJldmlld0lucHV0IVxuKSB7XG4gIHN1Ym1pdFB1bGxSZXF1ZXN0UmV2aWV3KGlucHV0OiAkaW5wdXQpIHtcbiAgICBwdWxsUmVxdWVzdFJldmlldyB7XG4gICAgICBpZFxuICAgIH1cbiAgfVxufVxuKi9cblxuY29uc3Qgbm9kZS8qOiBDb25jcmV0ZVJlcXVlc3QqLyA9IChmdW5jdGlvbigpe1xudmFyIHYwID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgIFwibmFtZVwiOiBcImlucHV0XCIsXG4gICAgXCJ0eXBlXCI6IFwiU3VibWl0UHVsbFJlcXVlc3RSZXZpZXdJbnB1dCFcIixcbiAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gIH1cbl0sXG52MSA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgXCJhbGlhc1wiOiBudWxsLFxuICAgIFwibmFtZVwiOiBcInN1Ym1pdFB1bGxSZXF1ZXN0UmV2aWV3XCIsXG4gICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgXCJhcmdzXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICAgICAgXCJuYW1lXCI6IFwiaW5wdXRcIixcbiAgICAgICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJpbnB1dFwiXG4gICAgICB9XG4gICAgXSxcbiAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlN1Ym1pdFB1bGxSZXF1ZXN0UmV2aWV3UGF5bG9hZFwiLFxuICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgXCJuYW1lXCI6IFwicHVsbFJlcXVlc3RSZXZpZXdcIixcbiAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlB1bGxSZXF1ZXN0UmV2aWV3XCIsXG4gICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJpZFwiLFxuICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfVxuXTtcbnJldHVybiB7XG4gIFwia2luZFwiOiBcIlJlcXVlc3RcIixcbiAgXCJmcmFnbWVudFwiOiB7XG4gICAgXCJraW5kXCI6IFwiRnJhZ21lbnRcIixcbiAgICBcIm5hbWVcIjogXCJzdWJtaXRQclJldmlld011dGF0aW9uXCIsXG4gICAgXCJ0eXBlXCI6IFwiTXV0YXRpb25cIixcbiAgICBcIm1ldGFkYXRhXCI6IG51bGwsXG4gICAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6ICh2MC8qOiBhbnkqLyksXG4gICAgXCJzZWxlY3Rpb25zXCI6ICh2MS8qOiBhbnkqLylcbiAgfSxcbiAgXCJvcGVyYXRpb25cIjoge1xuICAgIFwia2luZFwiOiBcIk9wZXJhdGlvblwiLFxuICAgIFwibmFtZVwiOiBcInN1Ym1pdFByUmV2aWV3TXV0YXRpb25cIixcbiAgICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogKHYwLyo6IGFueSovKSxcbiAgICBcInNlbGVjdGlvbnNcIjogKHYxLyo6IGFueSovKVxuICB9LFxuICBcInBhcmFtc1wiOiB7XG4gICAgXCJvcGVyYXRpb25LaW5kXCI6IFwibXV0YXRpb25cIixcbiAgICBcIm5hbWVcIjogXCJzdWJtaXRQclJldmlld011dGF0aW9uXCIsXG4gICAgXCJpZFwiOiBudWxsLFxuICAgIFwidGV4dFwiOiBcIm11dGF0aW9uIHN1Ym1pdFByUmV2aWV3TXV0YXRpb24oXFxuICAkaW5wdXQ6IFN1Ym1pdFB1bGxSZXF1ZXN0UmV2aWV3SW5wdXQhXFxuKSB7XFxuICBzdWJtaXRQdWxsUmVxdWVzdFJldmlldyhpbnB1dDogJGlucHV0KSB7XFxuICAgIHB1bGxSZXF1ZXN0UmV2aWV3IHtcXG4gICAgICBpZFxcbiAgICB9XFxuICB9XFxufVxcblwiLFxuICAgIFwibWV0YWRhdGFcIjoge31cbiAgfVxufTtcbn0pKCk7XG4vLyBwcmV0dGllci1pZ25vcmVcbihub2RlLyo6IGFueSovKS5oYXNoID0gJ2M1Mjc1MmIzYjJjZGUxMWU2Yzg2ZDU3NGZmYTk2N2EwJztcbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsWUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsTUFBTUEsSUFBSSx5QkFBeUIsWUFBVTtFQUM3QyxJQUFJQyxFQUFFLEdBQUcsQ0FDUDtNQUNFLE1BQU0sRUFBRSxlQUFlO01BQ3ZCLE1BQU0sRUFBRSxPQUFPO01BQ2YsTUFBTSxFQUFFLCtCQUErQjtNQUN2QyxjQUFjLEVBQUU7SUFDbEIsQ0FBQyxDQUNGO0lBQ0RDLEVBQUUsR0FBRyxDQUNIO01BQ0UsTUFBTSxFQUFFLGFBQWE7TUFDckIsT0FBTyxFQUFFLElBQUk7TUFDYixNQUFNLEVBQUUseUJBQXlCO01BQ2pDLFlBQVksRUFBRSxJQUFJO01BQ2xCLE1BQU0sRUFBRSxDQUNOO1FBQ0UsTUFBTSxFQUFFLFVBQVU7UUFDbEIsTUFBTSxFQUFFLE9BQU87UUFDZixjQUFjLEVBQUU7TUFDbEIsQ0FBQyxDQUNGO01BQ0QsY0FBYyxFQUFFLGdDQUFnQztNQUNoRCxRQUFRLEVBQUUsS0FBSztNQUNmLFlBQVksRUFBRSxDQUNaO1FBQ0UsTUFBTSxFQUFFLGFBQWE7UUFDckIsT0FBTyxFQUFFLElBQUk7UUFDYixNQUFNLEVBQUUsbUJBQW1CO1FBQzNCLFlBQVksRUFBRSxJQUFJO1FBQ2xCLE1BQU0sRUFBRSxJQUFJO1FBQ1osY0FBYyxFQUFFLG1CQUFtQjtRQUNuQyxRQUFRLEVBQUUsS0FBSztRQUNmLFlBQVksRUFBRSxDQUNaO1VBQ0UsTUFBTSxFQUFFLGFBQWE7VUFDckIsT0FBTyxFQUFFLElBQUk7VUFDYixNQUFNLEVBQUUsSUFBSTtVQUNaLE1BQU0sRUFBRSxJQUFJO1VBQ1osWUFBWSxFQUFFO1FBQ2hCLENBQUM7TUFFTCxDQUFDO0lBRUwsQ0FBQyxDQUNGO0VBQ0QsT0FBTztJQUNMLE1BQU0sRUFBRSxTQUFTO0lBQ2pCLFVBQVUsRUFBRTtNQUNWLE1BQU0sRUFBRSxVQUFVO01BQ2xCLE1BQU0sRUFBRSx3QkFBd0I7TUFDaEMsTUFBTSxFQUFFLFVBQVU7TUFDbEIsVUFBVSxFQUFFLElBQUk7TUFDaEIscUJBQXFCLEVBQUdELEVBQUUsVUFBVTtNQUNwQyxZQUFZLEVBQUdDLEVBQUU7SUFDbkIsQ0FBQzs7SUFDRCxXQUFXLEVBQUU7TUFDWCxNQUFNLEVBQUUsV0FBVztNQUNuQixNQUFNLEVBQUUsd0JBQXdCO01BQ2hDLHFCQUFxQixFQUFHRCxFQUFFLFVBQVU7TUFDcEMsWUFBWSxFQUFHQyxFQUFFO0lBQ25CLENBQUM7O0lBQ0QsUUFBUSxFQUFFO01BQ1IsZUFBZSxFQUFFLFVBQVU7TUFDM0IsTUFBTSxFQUFFLHdCQUF3QjtNQUNoQyxJQUFJLEVBQUUsSUFBSTtNQUNWLE1BQU0sRUFBRSxnTEFBZ0w7TUFDeEwsVUFBVSxFQUFFLENBQUM7SUFDZjtFQUNGLENBQUM7QUFDRCxDQUFDLEVBQUc7QUFDSjtBQUNDRixJQUFJLFdBQVdHLElBQUksR0FBRyxrQ0FBa0M7QUFDekRDLE1BQU0sQ0FBQ0MsT0FBTyxHQUFHTCxJQUFJIn0=