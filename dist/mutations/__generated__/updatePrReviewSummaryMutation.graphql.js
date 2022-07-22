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

const node
/*: ConcreteRequest*/
= function () {
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
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": v1
      /*: any*/

    },
    "operation": {
      "kind": "Operation",
      "name": "updatePrReviewSummaryMutation",
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": v1
      /*: any*/

    },
    "params": {
      "operationKind": "mutation",
      "name": "updatePrReviewSummaryMutation",
      "id": null,
      "text": "mutation updatePrReviewSummaryMutation(\n  $input: UpdatePullRequestReviewInput!\n) {\n  updatePullRequestReview(input: $input) {\n    pullRequestReview {\n      id\n      lastEditedAt\n      body\n      bodyHTML\n    }\n  }\n}\n",
      "metadata": {}
    }
  };
}(); // prettier-ignore


node
/*: any*/
.hash = 'ce6fa7b9b5a5709f8cc8001aa7ba8a15';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9tdXRhdGlvbnMvX19nZW5lcmF0ZWRfXy91cGRhdGVQclJldmlld1N1bW1hcnlNdXRhdGlvbi5ncmFwaHFsLmpzIl0sIm5hbWVzIjpbIm5vZGUiLCJ2MCIsInYxIiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQU1BO0FBQUk7QUFBQSxFQUF5QixZQUFVO0FBQzdDLE1BQUlDLEVBQUUsR0FBRyxDQUNQO0FBQ0UsWUFBUSxlQURWO0FBRUUsWUFBUSxPQUZWO0FBR0UsWUFBUSwrQkFIVjtBQUlFLG9CQUFnQjtBQUpsQixHQURPLENBQVQ7QUFBQSxNQVFBQyxFQUFFLEdBQUcsQ0FDSDtBQUNFLFlBQVEsYUFEVjtBQUVFLGFBQVMsSUFGWDtBQUdFLFlBQVEseUJBSFY7QUFJRSxrQkFBYyxJQUpoQjtBQUtFLFlBQVEsQ0FDTjtBQUNFLGNBQVEsVUFEVjtBQUVFLGNBQVEsT0FGVjtBQUdFLHNCQUFnQjtBQUhsQixLQURNLENBTFY7QUFZRSxvQkFBZ0IsZ0NBWmxCO0FBYUUsY0FBVSxLQWJaO0FBY0Usa0JBQWMsQ0FDWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsSUFGWDtBQUdFLGNBQVEsbUJBSFY7QUFJRSxvQkFBYyxJQUpoQjtBQUtFLGNBQVEsSUFMVjtBQU1FLHNCQUFnQixtQkFObEI7QUFPRSxnQkFBVSxLQVBaO0FBUUUsb0JBQWMsQ0FDWjtBQUNFLGdCQUFRLGFBRFY7QUFFRSxpQkFBUyxJQUZYO0FBR0UsZ0JBQVEsSUFIVjtBQUlFLGdCQUFRLElBSlY7QUFLRSxzQkFBYztBQUxoQixPQURZLEVBUVo7QUFDRSxnQkFBUSxhQURWO0FBRUUsaUJBQVMsSUFGWDtBQUdFLGdCQUFRLGNBSFY7QUFJRSxnQkFBUSxJQUpWO0FBS0Usc0JBQWM7QUFMaEIsT0FSWSxFQWVaO0FBQ0UsZ0JBQVEsYUFEVjtBQUVFLGlCQUFTLElBRlg7QUFHRSxnQkFBUSxNQUhWO0FBSUUsZ0JBQVEsSUFKVjtBQUtFLHNCQUFjO0FBTGhCLE9BZlksRUFzQlo7QUFDRSxnQkFBUSxhQURWO0FBRUUsaUJBQVMsSUFGWDtBQUdFLGdCQUFRLFVBSFY7QUFJRSxnQkFBUSxJQUpWO0FBS0Usc0JBQWM7QUFMaEIsT0F0Qlk7QUFSaEIsS0FEWTtBQWRoQixHQURHLENBUkw7QUFrRUEsU0FBTztBQUNMLFlBQVEsU0FESDtBQUVMLGdCQUFZO0FBQ1YsY0FBUSxVQURFO0FBRVYsY0FBUSwrQkFGRTtBQUdWLGNBQVEsVUFIRTtBQUlWLGtCQUFZLElBSkY7QUFLViw2QkFBd0JEO0FBQUU7QUFMaEI7QUFNVixvQkFBZUM7QUFBRTs7QUFOUCxLQUZQO0FBVUwsaUJBQWE7QUFDWCxjQUFRLFdBREc7QUFFWCxjQUFRLCtCQUZHO0FBR1gsNkJBQXdCRDtBQUFFO0FBSGY7QUFJWCxvQkFBZUM7QUFBRTs7QUFKTixLQVZSO0FBZ0JMLGNBQVU7QUFDUix1QkFBaUIsVUFEVDtBQUVSLGNBQVEsK0JBRkE7QUFHUixZQUFNLElBSEU7QUFJUixjQUFRLHVPQUpBO0FBS1Isa0JBQVk7QUFMSjtBQWhCTCxHQUFQO0FBd0JDLENBM0ZpQyxFQUFsQyxDLENBNEZBOzs7QUFDQ0Y7QUFBSTtBQUFMLENBQWdCRyxJQUFoQixHQUF1QixrQ0FBdkI7QUFDQUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCTCxJQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZsb3dcbiAqIEByZWxheUhhc2ggOWY0YTUwNWFmZTNlNzkwZjQ2NGM0NzYxMmFkZDRkZTRcbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qOjpcbmltcG9ydCB0eXBlIHsgQ29uY3JldGVSZXF1ZXN0IH0gZnJvbSAncmVsYXktcnVudGltZSc7XG5leHBvcnQgdHlwZSBVcGRhdGVQdWxsUmVxdWVzdFJldmlld0lucHV0ID0ge3xcbiAgcHVsbFJlcXVlc3RSZXZpZXdJZDogc3RyaW5nLFxuICBib2R5OiBzdHJpbmcsXG4gIGNsaWVudE11dGF0aW9uSWQ/OiA/c3RyaW5nLFxufH07XG5leHBvcnQgdHlwZSB1cGRhdGVQclJldmlld1N1bW1hcnlNdXRhdGlvblZhcmlhYmxlcyA9IHt8XG4gIGlucHV0OiBVcGRhdGVQdWxsUmVxdWVzdFJldmlld0lucHV0XG58fTtcbmV4cG9ydCB0eXBlIHVwZGF0ZVByUmV2aWV3U3VtbWFyeU11dGF0aW9uUmVzcG9uc2UgPSB7fFxuICArdXBkYXRlUHVsbFJlcXVlc3RSZXZpZXc6ID97fFxuICAgICtwdWxsUmVxdWVzdFJldmlldzogP3t8XG4gICAgICAraWQ6IHN0cmluZyxcbiAgICAgICtsYXN0RWRpdGVkQXQ6ID9hbnksXG4gICAgICArYm9keTogc3RyaW5nLFxuICAgICAgK2JvZHlIVE1MOiBhbnksXG4gICAgfH1cbiAgfH1cbnx9O1xuZXhwb3J0IHR5cGUgdXBkYXRlUHJSZXZpZXdTdW1tYXJ5TXV0YXRpb24gPSB7fFxuICB2YXJpYWJsZXM6IHVwZGF0ZVByUmV2aWV3U3VtbWFyeU11dGF0aW9uVmFyaWFibGVzLFxuICByZXNwb25zZTogdXBkYXRlUHJSZXZpZXdTdW1tYXJ5TXV0YXRpb25SZXNwb25zZSxcbnx9O1xuKi9cblxuXG4vKlxubXV0YXRpb24gdXBkYXRlUHJSZXZpZXdTdW1tYXJ5TXV0YXRpb24oXG4gICRpbnB1dDogVXBkYXRlUHVsbFJlcXVlc3RSZXZpZXdJbnB1dCFcbikge1xuICB1cGRhdGVQdWxsUmVxdWVzdFJldmlldyhpbnB1dDogJGlucHV0KSB7XG4gICAgcHVsbFJlcXVlc3RSZXZpZXcge1xuICAgICAgaWRcbiAgICAgIGxhc3RFZGl0ZWRBdFxuICAgICAgYm9keVxuICAgICAgYm9keUhUTUxcbiAgICB9XG4gIH1cbn1cbiovXG5cbmNvbnN0IG5vZGUvKjogQ29uY3JldGVSZXF1ZXN0Ki8gPSAoZnVuY3Rpb24oKXtcbnZhciB2MCA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICBcIm5hbWVcIjogXCJpbnB1dFwiLFxuICAgIFwidHlwZVwiOiBcIlVwZGF0ZVB1bGxSZXF1ZXN0UmV2aWV3SW5wdXQhXCIsXG4gICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICB9XG5dLFxudjEgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICBcIm5hbWVcIjogXCJ1cGRhdGVQdWxsUmVxdWVzdFJldmlld1wiLFxuICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgIFwiYXJnc1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgICAgIFwibmFtZVwiOiBcImlucHV0XCIsXG4gICAgICAgIFwidmFyaWFibGVOYW1lXCI6IFwiaW5wdXRcIlxuICAgICAgfVxuICAgIF0sXG4gICAgXCJjb25jcmV0ZVR5cGVcIjogXCJVcGRhdGVQdWxsUmVxdWVzdFJldmlld1BheWxvYWRcIixcbiAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAge1xuICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgIFwibmFtZVwiOiBcInB1bGxSZXF1ZXN0UmV2aWV3XCIsXG4gICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJQdWxsUmVxdWVzdFJldmlld1wiLFxuICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiaWRcIixcbiAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJsYXN0RWRpdGVkQXRcIixcbiAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJib2R5XCIsXG4gICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiYm9keUhUTUxcIixcbiAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH1cbl07XG5yZXR1cm4ge1xuICBcImtpbmRcIjogXCJSZXF1ZXN0XCIsXG4gIFwiZnJhZ21lbnRcIjoge1xuICAgIFwia2luZFwiOiBcIkZyYWdtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwidXBkYXRlUHJSZXZpZXdTdW1tYXJ5TXV0YXRpb25cIixcbiAgICBcInR5cGVcIjogXCJNdXRhdGlvblwiLFxuICAgIFwibWV0YWRhdGFcIjogbnVsbCxcbiAgICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogKHYwLyo6IGFueSovKSxcbiAgICBcInNlbGVjdGlvbnNcIjogKHYxLyo6IGFueSovKVxuICB9LFxuICBcIm9wZXJhdGlvblwiOiB7XG4gICAgXCJraW5kXCI6IFwiT3BlcmF0aW9uXCIsXG4gICAgXCJuYW1lXCI6IFwidXBkYXRlUHJSZXZpZXdTdW1tYXJ5TXV0YXRpb25cIixcbiAgICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogKHYwLyo6IGFueSovKSxcbiAgICBcInNlbGVjdGlvbnNcIjogKHYxLyo6IGFueSovKVxuICB9LFxuICBcInBhcmFtc1wiOiB7XG4gICAgXCJvcGVyYXRpb25LaW5kXCI6IFwibXV0YXRpb25cIixcbiAgICBcIm5hbWVcIjogXCJ1cGRhdGVQclJldmlld1N1bW1hcnlNdXRhdGlvblwiLFxuICAgIFwiaWRcIjogbnVsbCxcbiAgICBcInRleHRcIjogXCJtdXRhdGlvbiB1cGRhdGVQclJldmlld1N1bW1hcnlNdXRhdGlvbihcXG4gICRpbnB1dDogVXBkYXRlUHVsbFJlcXVlc3RSZXZpZXdJbnB1dCFcXG4pIHtcXG4gIHVwZGF0ZVB1bGxSZXF1ZXN0UmV2aWV3KGlucHV0OiAkaW5wdXQpIHtcXG4gICAgcHVsbFJlcXVlc3RSZXZpZXcge1xcbiAgICAgIGlkXFxuICAgICAgbGFzdEVkaXRlZEF0XFxuICAgICAgYm9keVxcbiAgICAgIGJvZHlIVE1MXFxuICAgIH1cXG4gIH1cXG59XFxuXCIsXG4gICAgXCJtZXRhZGF0YVwiOiB7fVxuICB9XG59O1xufSkoKTtcbi8vIHByZXR0aWVyLWlnbm9yZVxuKG5vZGUvKjogYW55Ki8pLmhhc2ggPSAnY2U2ZmE3YjliNWE1NzA5ZjhjYzgwMDFhYTdiYThhMTUnO1xubW9kdWxlLmV4cG9ydHMgPSBub2RlO1xuIl19