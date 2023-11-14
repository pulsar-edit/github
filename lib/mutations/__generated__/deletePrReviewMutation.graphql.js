/**
 * @flow
 * @relayHash b78f52f30e644f67a35efd13a162469d
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type DeletePullRequestReviewInput = {|
  pullRequestReviewId: string,
  clientMutationId?: ?string,
|};
export type deletePrReviewMutationVariables = {|
  input: DeletePullRequestReviewInput
|};
export type deletePrReviewMutationResponse = {|
  +deletePullRequestReview: ?{|
    +pullRequestReview: ?{|
      +id: string
    |}
  |}
|};
export type deletePrReviewMutation = {|
  variables: deletePrReviewMutationVariables,
  response: deletePrReviewMutationResponse,
|};
*/

/*
mutation deletePrReviewMutation(
  $input: DeletePullRequestReviewInput!
) {
  deletePullRequestReview(input: $input) {
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
      "type": "DeletePullRequestReviewInput!",
      "defaultValue": null
    }],
    v1 = [{
      "kind": "LinkedField",
      "alias": null,
      "name": "deletePullRequestReview",
      "storageKey": null,
      "args": [{
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }],
      "concreteType": "DeletePullRequestReviewPayload",
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
      "name": "deletePrReviewMutation",
      "type": "Mutation",
      "metadata": null,
      "argumentDefinitions": v0 /*: any*/,
      "selections": v1 /*: any*/
    },

    "operation": {
      "kind": "Operation",
      "name": "deletePrReviewMutation",
      "argumentDefinitions": v0 /*: any*/,
      "selections": v1 /*: any*/
    },

    "params": {
      "operationKind": "mutation",
      "name": "deletePrReviewMutation",
      "id": null,
      "text": "mutation deletePrReviewMutation(\n  $input: DeletePullRequestReviewInput!\n) {\n  deletePullRequestReview(input: $input) {\n    pullRequestReview {\n      id\n    }\n  }\n}\n",
      "metadata": {}
    }
  };
}();
// prettier-ignore
node /*: any*/.hash = '768b81334e225cb5d15c0508d2bd4b1f';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJub2RlIiwidjAiLCJ2MSIsImhhc2giLCJtb2R1bGUiLCJleHBvcnRzIl0sInNvdXJjZXMiOlsiZGVsZXRlUHJSZXZpZXdNdXRhdGlvbi5ncmFwaHFsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZsb3dcbiAqIEByZWxheUhhc2ggYjc4ZjUyZjMwZTY0NGY2N2EzNWVmZDEzYTE2MjQ2OWRcbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qOjpcbmltcG9ydCB0eXBlIHsgQ29uY3JldGVSZXF1ZXN0IH0gZnJvbSAncmVsYXktcnVudGltZSc7XG5leHBvcnQgdHlwZSBEZWxldGVQdWxsUmVxdWVzdFJldmlld0lucHV0ID0ge3xcbiAgcHVsbFJlcXVlc3RSZXZpZXdJZDogc3RyaW5nLFxuICBjbGllbnRNdXRhdGlvbklkPzogP3N0cmluZyxcbnx9O1xuZXhwb3J0IHR5cGUgZGVsZXRlUHJSZXZpZXdNdXRhdGlvblZhcmlhYmxlcyA9IHt8XG4gIGlucHV0OiBEZWxldGVQdWxsUmVxdWVzdFJldmlld0lucHV0XG58fTtcbmV4cG9ydCB0eXBlIGRlbGV0ZVByUmV2aWV3TXV0YXRpb25SZXNwb25zZSA9IHt8XG4gICtkZWxldGVQdWxsUmVxdWVzdFJldmlldzogP3t8XG4gICAgK3B1bGxSZXF1ZXN0UmV2aWV3OiA/e3xcbiAgICAgICtpZDogc3RyaW5nXG4gICAgfH1cbiAgfH1cbnx9O1xuZXhwb3J0IHR5cGUgZGVsZXRlUHJSZXZpZXdNdXRhdGlvbiA9IHt8XG4gIHZhcmlhYmxlczogZGVsZXRlUHJSZXZpZXdNdXRhdGlvblZhcmlhYmxlcyxcbiAgcmVzcG9uc2U6IGRlbGV0ZVByUmV2aWV3TXV0YXRpb25SZXNwb25zZSxcbnx9O1xuKi9cblxuXG4vKlxubXV0YXRpb24gZGVsZXRlUHJSZXZpZXdNdXRhdGlvbihcbiAgJGlucHV0OiBEZWxldGVQdWxsUmVxdWVzdFJldmlld0lucHV0IVxuKSB7XG4gIGRlbGV0ZVB1bGxSZXF1ZXN0UmV2aWV3KGlucHV0OiAkaW5wdXQpIHtcbiAgICBwdWxsUmVxdWVzdFJldmlldyB7XG4gICAgICBpZFxuICAgIH1cbiAgfVxufVxuKi9cblxuY29uc3Qgbm9kZS8qOiBDb25jcmV0ZVJlcXVlc3QqLyA9IChmdW5jdGlvbigpe1xudmFyIHYwID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgIFwibmFtZVwiOiBcImlucHV0XCIsXG4gICAgXCJ0eXBlXCI6IFwiRGVsZXRlUHVsbFJlcXVlc3RSZXZpZXdJbnB1dCFcIixcbiAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gIH1cbl0sXG52MSA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgXCJhbGlhc1wiOiBudWxsLFxuICAgIFwibmFtZVwiOiBcImRlbGV0ZVB1bGxSZXF1ZXN0UmV2aWV3XCIsXG4gICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgXCJhcmdzXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICAgICAgXCJuYW1lXCI6IFwiaW5wdXRcIixcbiAgICAgICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJpbnB1dFwiXG4gICAgICB9XG4gICAgXSxcbiAgICBcImNvbmNyZXRlVHlwZVwiOiBcIkRlbGV0ZVB1bGxSZXF1ZXN0UmV2aWV3UGF5bG9hZFwiLFxuICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgXCJuYW1lXCI6IFwicHVsbFJlcXVlc3RSZXZpZXdcIixcbiAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlB1bGxSZXF1ZXN0UmV2aWV3XCIsXG4gICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJpZFwiLFxuICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfVxuXTtcbnJldHVybiB7XG4gIFwia2luZFwiOiBcIlJlcXVlc3RcIixcbiAgXCJmcmFnbWVudFwiOiB7XG4gICAgXCJraW5kXCI6IFwiRnJhZ21lbnRcIixcbiAgICBcIm5hbWVcIjogXCJkZWxldGVQclJldmlld011dGF0aW9uXCIsXG4gICAgXCJ0eXBlXCI6IFwiTXV0YXRpb25cIixcbiAgICBcIm1ldGFkYXRhXCI6IG51bGwsXG4gICAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6ICh2MC8qOiBhbnkqLyksXG4gICAgXCJzZWxlY3Rpb25zXCI6ICh2MS8qOiBhbnkqLylcbiAgfSxcbiAgXCJvcGVyYXRpb25cIjoge1xuICAgIFwia2luZFwiOiBcIk9wZXJhdGlvblwiLFxuICAgIFwibmFtZVwiOiBcImRlbGV0ZVByUmV2aWV3TXV0YXRpb25cIixcbiAgICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogKHYwLyo6IGFueSovKSxcbiAgICBcInNlbGVjdGlvbnNcIjogKHYxLyo6IGFueSovKVxuICB9LFxuICBcInBhcmFtc1wiOiB7XG4gICAgXCJvcGVyYXRpb25LaW5kXCI6IFwibXV0YXRpb25cIixcbiAgICBcIm5hbWVcIjogXCJkZWxldGVQclJldmlld011dGF0aW9uXCIsXG4gICAgXCJpZFwiOiBudWxsLFxuICAgIFwidGV4dFwiOiBcIm11dGF0aW9uIGRlbGV0ZVByUmV2aWV3TXV0YXRpb24oXFxuICAkaW5wdXQ6IERlbGV0ZVB1bGxSZXF1ZXN0UmV2aWV3SW5wdXQhXFxuKSB7XFxuICBkZWxldGVQdWxsUmVxdWVzdFJldmlldyhpbnB1dDogJGlucHV0KSB7XFxuICAgIHB1bGxSZXF1ZXN0UmV2aWV3IHtcXG4gICAgICBpZFxcbiAgICB9XFxuICB9XFxufVxcblwiLFxuICAgIFwibWV0YWRhdGFcIjoge31cbiAgfVxufTtcbn0pKCk7XG4vLyBwcmV0dGllci1pZ25vcmVcbihub2RlLyo6IGFueSovKS5oYXNoID0gJzc2OGI4MTMzNGUyMjVjYjVkMTVjMDUwOGQyYmQ0YjFmJztcbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsWUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLE1BQU1BLElBQUkseUJBQXlCLFlBQVU7RUFDN0MsSUFBSUMsRUFBRSxHQUFHLENBQ1A7TUFDRSxNQUFNLEVBQUUsZUFBZTtNQUN2QixNQUFNLEVBQUUsT0FBTztNQUNmLE1BQU0sRUFBRSwrQkFBK0I7TUFDdkMsY0FBYyxFQUFFO0lBQ2xCLENBQUMsQ0FDRjtJQUNEQyxFQUFFLEdBQUcsQ0FDSDtNQUNFLE1BQU0sRUFBRSxhQUFhO01BQ3JCLE9BQU8sRUFBRSxJQUFJO01BQ2IsTUFBTSxFQUFFLHlCQUF5QjtNQUNqQyxZQUFZLEVBQUUsSUFBSTtNQUNsQixNQUFNLEVBQUUsQ0FDTjtRQUNFLE1BQU0sRUFBRSxVQUFVO1FBQ2xCLE1BQU0sRUFBRSxPQUFPO1FBQ2YsY0FBYyxFQUFFO01BQ2xCLENBQUMsQ0FDRjtNQUNELGNBQWMsRUFBRSxnQ0FBZ0M7TUFDaEQsUUFBUSxFQUFFLEtBQUs7TUFDZixZQUFZLEVBQUUsQ0FDWjtRQUNFLE1BQU0sRUFBRSxhQUFhO1FBQ3JCLE9BQU8sRUFBRSxJQUFJO1FBQ2IsTUFBTSxFQUFFLG1CQUFtQjtRQUMzQixZQUFZLEVBQUUsSUFBSTtRQUNsQixNQUFNLEVBQUUsSUFBSTtRQUNaLGNBQWMsRUFBRSxtQkFBbUI7UUFDbkMsUUFBUSxFQUFFLEtBQUs7UUFDZixZQUFZLEVBQUUsQ0FDWjtVQUNFLE1BQU0sRUFBRSxhQUFhO1VBQ3JCLE9BQU8sRUFBRSxJQUFJO1VBQ2IsTUFBTSxFQUFFLElBQUk7VUFDWixNQUFNLEVBQUUsSUFBSTtVQUNaLFlBQVksRUFBRTtRQUNoQixDQUFDO01BRUwsQ0FBQztJQUVMLENBQUMsQ0FDRjtFQUNELE9BQU87SUFDTCxNQUFNLEVBQUUsU0FBUztJQUNqQixVQUFVLEVBQUU7TUFDVixNQUFNLEVBQUUsVUFBVTtNQUNsQixNQUFNLEVBQUUsd0JBQXdCO01BQ2hDLE1BQU0sRUFBRSxVQUFVO01BQ2xCLFVBQVUsRUFBRSxJQUFJO01BQ2hCLHFCQUFxQixFQUFHRCxFQUFFLFVBQVU7TUFDcEMsWUFBWSxFQUFHQyxFQUFFO0lBQ25CLENBQUM7O0lBQ0QsV0FBVyxFQUFFO01BQ1gsTUFBTSxFQUFFLFdBQVc7TUFDbkIsTUFBTSxFQUFFLHdCQUF3QjtNQUNoQyxxQkFBcUIsRUFBR0QsRUFBRSxVQUFVO01BQ3BDLFlBQVksRUFBR0MsRUFBRTtJQUNuQixDQUFDOztJQUNELFFBQVEsRUFBRTtNQUNSLGVBQWUsRUFBRSxVQUFVO01BQzNCLE1BQU0sRUFBRSx3QkFBd0I7TUFDaEMsSUFBSSxFQUFFLElBQUk7TUFDVixNQUFNLEVBQUUsZ0xBQWdMO01BQ3hMLFVBQVUsRUFBRSxDQUFDO0lBQ2Y7RUFDRixDQUFDO0FBQ0QsQ0FBQyxDQUFFLENBQUM7QUFDSjtBQUNDRixJQUFJLFdBQVdHLElBQUksR0FBRyxrQ0FBa0M7QUFDekRDLE1BQU0sQ0FBQ0MsT0FBTyxHQUFHTCxJQUFJIn0=