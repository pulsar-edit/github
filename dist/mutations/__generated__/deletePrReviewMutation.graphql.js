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

const node
/*: ConcreteRequest*/
= function () {
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
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": v1
      /*: any*/

    },
    "operation": {
      "kind": "Operation",
      "name": "deletePrReviewMutation",
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": v1
      /*: any*/

    },
    "params": {
      "operationKind": "mutation",
      "name": "deletePrReviewMutation",
      "id": null,
      "text": "mutation deletePrReviewMutation(\n  $input: DeletePullRequestReviewInput!\n) {\n  deletePullRequestReview(input: $input) {\n    pullRequestReview {\n      id\n    }\n  }\n}\n",
      "metadata": {}
    }
  };
}(); // prettier-ignore


node
/*: any*/
.hash = '768b81334e225cb5d15c0508d2bd4b1f';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9tdXRhdGlvbnMvX19nZW5lcmF0ZWRfXy9kZWxldGVQclJldmlld011dGF0aW9uLmdyYXBocWwuanMiXSwibmFtZXMiOlsibm9kZSIsInYwIiwidjEiLCJoYXNoIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQU1BO0FBQUk7QUFBQSxFQUF5QixZQUFVO0FBQzdDLE1BQUlDLEVBQUUsR0FBRyxDQUNQO0FBQ0UsWUFBUSxlQURWO0FBRUUsWUFBUSxPQUZWO0FBR0UsWUFBUSwrQkFIVjtBQUlFLG9CQUFnQjtBQUpsQixHQURPLENBQVQ7QUFBQSxNQVFBQyxFQUFFLEdBQUcsQ0FDSDtBQUNFLFlBQVEsYUFEVjtBQUVFLGFBQVMsSUFGWDtBQUdFLFlBQVEseUJBSFY7QUFJRSxrQkFBYyxJQUpoQjtBQUtFLFlBQVEsQ0FDTjtBQUNFLGNBQVEsVUFEVjtBQUVFLGNBQVEsT0FGVjtBQUdFLHNCQUFnQjtBQUhsQixLQURNLENBTFY7QUFZRSxvQkFBZ0IsZ0NBWmxCO0FBYUUsY0FBVSxLQWJaO0FBY0Usa0JBQWMsQ0FDWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsSUFGWDtBQUdFLGNBQVEsbUJBSFY7QUFJRSxvQkFBYyxJQUpoQjtBQUtFLGNBQVEsSUFMVjtBQU1FLHNCQUFnQixtQkFObEI7QUFPRSxnQkFBVSxLQVBaO0FBUUUsb0JBQWMsQ0FDWjtBQUNFLGdCQUFRLGFBRFY7QUFFRSxpQkFBUyxJQUZYO0FBR0UsZ0JBQVEsSUFIVjtBQUlFLGdCQUFRLElBSlY7QUFLRSxzQkFBYztBQUxoQixPQURZO0FBUmhCLEtBRFk7QUFkaEIsR0FERyxDQVJMO0FBNkNBLFNBQU87QUFDTCxZQUFRLFNBREg7QUFFTCxnQkFBWTtBQUNWLGNBQVEsVUFERTtBQUVWLGNBQVEsd0JBRkU7QUFHVixjQUFRLFVBSEU7QUFJVixrQkFBWSxJQUpGO0FBS1YsNkJBQXdCRDtBQUFFO0FBTGhCO0FBTVYsb0JBQWVDO0FBQUU7O0FBTlAsS0FGUDtBQVVMLGlCQUFhO0FBQ1gsY0FBUSxXQURHO0FBRVgsY0FBUSx3QkFGRztBQUdYLDZCQUF3QkQ7QUFBRTtBQUhmO0FBSVgsb0JBQWVDO0FBQUU7O0FBSk4sS0FWUjtBQWdCTCxjQUFVO0FBQ1IsdUJBQWlCLFVBRFQ7QUFFUixjQUFRLHdCQUZBO0FBR1IsWUFBTSxJQUhFO0FBSVIsY0FBUSxnTEFKQTtBQUtSLGtCQUFZO0FBTEo7QUFoQkwsR0FBUDtBQXdCQyxDQXRFaUMsRUFBbEMsQyxDQXVFQTs7O0FBQ0NGO0FBQUk7QUFBTCxDQUFnQkcsSUFBaEIsR0FBdUIsa0NBQXZCO0FBQ0FDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQkwsSUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmbG93XG4gKiBAcmVsYXlIYXNoIGI3OGY1MmYzMGU2NDRmNjdhMzVlZmQxM2ExNjI0NjlkXG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKjo6XG5pbXBvcnQgdHlwZSB7IENvbmNyZXRlUmVxdWVzdCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xuZXhwb3J0IHR5cGUgRGVsZXRlUHVsbFJlcXVlc3RSZXZpZXdJbnB1dCA9IHt8XG4gIHB1bGxSZXF1ZXN0UmV2aWV3SWQ6IHN0cmluZyxcbiAgY2xpZW50TXV0YXRpb25JZD86ID9zdHJpbmcsXG58fTtcbmV4cG9ydCB0eXBlIGRlbGV0ZVByUmV2aWV3TXV0YXRpb25WYXJpYWJsZXMgPSB7fFxuICBpbnB1dDogRGVsZXRlUHVsbFJlcXVlc3RSZXZpZXdJbnB1dFxufH07XG5leHBvcnQgdHlwZSBkZWxldGVQclJldmlld011dGF0aW9uUmVzcG9uc2UgPSB7fFxuICArZGVsZXRlUHVsbFJlcXVlc3RSZXZpZXc6ID97fFxuICAgICtwdWxsUmVxdWVzdFJldmlldzogP3t8XG4gICAgICAraWQ6IHN0cmluZ1xuICAgIHx9XG4gIHx9XG58fTtcbmV4cG9ydCB0eXBlIGRlbGV0ZVByUmV2aWV3TXV0YXRpb24gPSB7fFxuICB2YXJpYWJsZXM6IGRlbGV0ZVByUmV2aWV3TXV0YXRpb25WYXJpYWJsZXMsXG4gIHJlc3BvbnNlOiBkZWxldGVQclJldmlld011dGF0aW9uUmVzcG9uc2UsXG58fTtcbiovXG5cblxuLypcbm11dGF0aW9uIGRlbGV0ZVByUmV2aWV3TXV0YXRpb24oXG4gICRpbnB1dDogRGVsZXRlUHVsbFJlcXVlc3RSZXZpZXdJbnB1dCFcbikge1xuICBkZWxldGVQdWxsUmVxdWVzdFJldmlldyhpbnB1dDogJGlucHV0KSB7XG4gICAgcHVsbFJlcXVlc3RSZXZpZXcge1xuICAgICAgaWRcbiAgICB9XG4gIH1cbn1cbiovXG5cbmNvbnN0IG5vZGUvKjogQ29uY3JldGVSZXF1ZXN0Ki8gPSAoZnVuY3Rpb24oKXtcbnZhciB2MCA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICBcIm5hbWVcIjogXCJpbnB1dFwiLFxuICAgIFwidHlwZVwiOiBcIkRlbGV0ZVB1bGxSZXF1ZXN0UmV2aWV3SW5wdXQhXCIsXG4gICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICB9XG5dLFxudjEgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICBcIm5hbWVcIjogXCJkZWxldGVQdWxsUmVxdWVzdFJldmlld1wiLFxuICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgIFwiYXJnc1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgICAgIFwibmFtZVwiOiBcImlucHV0XCIsXG4gICAgICAgIFwidmFyaWFibGVOYW1lXCI6IFwiaW5wdXRcIlxuICAgICAgfVxuICAgIF0sXG4gICAgXCJjb25jcmV0ZVR5cGVcIjogXCJEZWxldGVQdWxsUmVxdWVzdFJldmlld1BheWxvYWRcIixcbiAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAge1xuICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgIFwibmFtZVwiOiBcInB1bGxSZXF1ZXN0UmV2aWV3XCIsXG4gICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJQdWxsUmVxdWVzdFJldmlld1wiLFxuICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiaWRcIixcbiAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH1cbl07XG5yZXR1cm4ge1xuICBcImtpbmRcIjogXCJSZXF1ZXN0XCIsXG4gIFwiZnJhZ21lbnRcIjoge1xuICAgIFwia2luZFwiOiBcIkZyYWdtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwiZGVsZXRlUHJSZXZpZXdNdXRhdGlvblwiLFxuICAgIFwidHlwZVwiOiBcIk11dGF0aW9uXCIsXG4gICAgXCJtZXRhZGF0YVwiOiBudWxsLFxuICAgIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiAodjAvKjogYW55Ki8pLFxuICAgIFwic2VsZWN0aW9uc1wiOiAodjEvKjogYW55Ki8pXG4gIH0sXG4gIFwib3BlcmF0aW9uXCI6IHtcbiAgICBcImtpbmRcIjogXCJPcGVyYXRpb25cIixcbiAgICBcIm5hbWVcIjogXCJkZWxldGVQclJldmlld011dGF0aW9uXCIsXG4gICAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6ICh2MC8qOiBhbnkqLyksXG4gICAgXCJzZWxlY3Rpb25zXCI6ICh2MS8qOiBhbnkqLylcbiAgfSxcbiAgXCJwYXJhbXNcIjoge1xuICAgIFwib3BlcmF0aW9uS2luZFwiOiBcIm11dGF0aW9uXCIsXG4gICAgXCJuYW1lXCI6IFwiZGVsZXRlUHJSZXZpZXdNdXRhdGlvblwiLFxuICAgIFwiaWRcIjogbnVsbCxcbiAgICBcInRleHRcIjogXCJtdXRhdGlvbiBkZWxldGVQclJldmlld011dGF0aW9uKFxcbiAgJGlucHV0OiBEZWxldGVQdWxsUmVxdWVzdFJldmlld0lucHV0IVxcbikge1xcbiAgZGVsZXRlUHVsbFJlcXVlc3RSZXZpZXcoaW5wdXQ6ICRpbnB1dCkge1xcbiAgICBwdWxsUmVxdWVzdFJldmlldyB7XFxuICAgICAgaWRcXG4gICAgfVxcbiAgfVxcbn1cXG5cIixcbiAgICBcIm1ldGFkYXRhXCI6IHt9XG4gIH1cbn07XG59KSgpO1xuLy8gcHJldHRpZXItaWdub3JlXG4obm9kZS8qOiBhbnkqLykuaGFzaCA9ICc3NjhiODEzMzRlMjI1Y2I1ZDE1YzA1MDhkMmJkNGIxZic7XG5tb2R1bGUuZXhwb3J0cyA9IG5vZGU7XG4iXX0=