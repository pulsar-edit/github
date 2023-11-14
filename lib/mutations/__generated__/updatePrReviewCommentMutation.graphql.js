/**
 * @flow
 * @relayHash 887a4669e3d39128b391814ca67df4d0
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type UpdatePullRequestReviewCommentInput = {|
  pullRequestReviewCommentId: string,
  body: string,
  clientMutationId?: ?string,
|};
export type updatePrReviewCommentMutationVariables = {|
  input: UpdatePullRequestReviewCommentInput
|};
export type updatePrReviewCommentMutationResponse = {|
  +updatePullRequestReviewComment: ?{|
    +pullRequestReviewComment: ?{|
      +id: string,
      +lastEditedAt: ?any,
      +body: string,
      +bodyHTML: any,
    |}
  |}
|};
export type updatePrReviewCommentMutation = {|
  variables: updatePrReviewCommentMutationVariables,
  response: updatePrReviewCommentMutationResponse,
|};
*/

/*
mutation updatePrReviewCommentMutation(
  $input: UpdatePullRequestReviewCommentInput!
) {
  updatePullRequestReviewComment(input: $input) {
    pullRequestReviewComment {
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
      "type": "UpdatePullRequestReviewCommentInput!",
      "defaultValue": null
    }],
    v1 = [{
      "kind": "LinkedField",
      "alias": null,
      "name": "updatePullRequestReviewComment",
      "storageKey": null,
      "args": [{
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }],
      "concreteType": "UpdatePullRequestReviewCommentPayload",
      "plural": false,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "pullRequestReviewComment",
        "storageKey": null,
        "args": null,
        "concreteType": "PullRequestReviewComment",
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
      "name": "updatePrReviewCommentMutation",
      "type": "Mutation",
      "metadata": null,
      "argumentDefinitions": v0 /*: any*/,
      "selections": v1 /*: any*/
    },

    "operation": {
      "kind": "Operation",
      "name": "updatePrReviewCommentMutation",
      "argumentDefinitions": v0 /*: any*/,
      "selections": v1 /*: any*/
    },

    "params": {
      "operationKind": "mutation",
      "name": "updatePrReviewCommentMutation",
      "id": null,
      "text": "mutation updatePrReviewCommentMutation(\n  $input: UpdatePullRequestReviewCommentInput!\n) {\n  updatePullRequestReviewComment(input: $input) {\n    pullRequestReviewComment {\n      id\n      lastEditedAt\n      body\n      bodyHTML\n    }\n  }\n}\n",
      "metadata": {}
    }
  };
}();
// prettier-ignore
node /*: any*/.hash = 'd7b4e823f4604a2b193a1faceb3fcfca';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJub2RlIiwidjAiLCJ2MSIsImhhc2giLCJtb2R1bGUiLCJleHBvcnRzIl0sInNvdXJjZXMiOlsidXBkYXRlUHJSZXZpZXdDb21tZW50TXV0YXRpb24uZ3JhcGhxbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmbG93XG4gKiBAcmVsYXlIYXNoIDg4N2E0NjY5ZTNkMzkxMjhiMzkxODE0Y2E2N2RmNGQwXG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKjo6XG5pbXBvcnQgdHlwZSB7IENvbmNyZXRlUmVxdWVzdCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xuZXhwb3J0IHR5cGUgVXBkYXRlUHVsbFJlcXVlc3RSZXZpZXdDb21tZW50SW5wdXQgPSB7fFxuICBwdWxsUmVxdWVzdFJldmlld0NvbW1lbnRJZDogc3RyaW5nLFxuICBib2R5OiBzdHJpbmcsXG4gIGNsaWVudE11dGF0aW9uSWQ/OiA/c3RyaW5nLFxufH07XG5leHBvcnQgdHlwZSB1cGRhdGVQclJldmlld0NvbW1lbnRNdXRhdGlvblZhcmlhYmxlcyA9IHt8XG4gIGlucHV0OiBVcGRhdGVQdWxsUmVxdWVzdFJldmlld0NvbW1lbnRJbnB1dFxufH07XG5leHBvcnQgdHlwZSB1cGRhdGVQclJldmlld0NvbW1lbnRNdXRhdGlvblJlc3BvbnNlID0ge3xcbiAgK3VwZGF0ZVB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudDogP3t8XG4gICAgK3B1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudDogP3t8XG4gICAgICAraWQ6IHN0cmluZyxcbiAgICAgICtsYXN0RWRpdGVkQXQ6ID9hbnksXG4gICAgICArYm9keTogc3RyaW5nLFxuICAgICAgK2JvZHlIVE1MOiBhbnksXG4gICAgfH1cbiAgfH1cbnx9O1xuZXhwb3J0IHR5cGUgdXBkYXRlUHJSZXZpZXdDb21tZW50TXV0YXRpb24gPSB7fFxuICB2YXJpYWJsZXM6IHVwZGF0ZVByUmV2aWV3Q29tbWVudE11dGF0aW9uVmFyaWFibGVzLFxuICByZXNwb25zZTogdXBkYXRlUHJSZXZpZXdDb21tZW50TXV0YXRpb25SZXNwb25zZSxcbnx9O1xuKi9cblxuXG4vKlxubXV0YXRpb24gdXBkYXRlUHJSZXZpZXdDb21tZW50TXV0YXRpb24oXG4gICRpbnB1dDogVXBkYXRlUHVsbFJlcXVlc3RSZXZpZXdDb21tZW50SW5wdXQhXG4pIHtcbiAgdXBkYXRlUHVsbFJlcXVlc3RSZXZpZXdDb21tZW50KGlucHV0OiAkaW5wdXQpIHtcbiAgICBwdWxsUmVxdWVzdFJldmlld0NvbW1lbnQge1xuICAgICAgaWRcbiAgICAgIGxhc3RFZGl0ZWRBdFxuICAgICAgYm9keVxuICAgICAgYm9keUhUTUxcbiAgICB9XG4gIH1cbn1cbiovXG5cbmNvbnN0IG5vZGUvKjogQ29uY3JldGVSZXF1ZXN0Ki8gPSAoZnVuY3Rpb24oKXtcbnZhciB2MCA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICBcIm5hbWVcIjogXCJpbnB1dFwiLFxuICAgIFwidHlwZVwiOiBcIlVwZGF0ZVB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudElucHV0IVwiLFxuICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgfVxuXSxcbnYxID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgXCJuYW1lXCI6IFwidXBkYXRlUHVsbFJlcXVlc3RSZXZpZXdDb21tZW50XCIsXG4gICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgXCJhcmdzXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICAgICAgXCJuYW1lXCI6IFwiaW5wdXRcIixcbiAgICAgICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJpbnB1dFwiXG4gICAgICB9XG4gICAgXSxcbiAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlVwZGF0ZVB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudFBheWxvYWRcIixcbiAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAge1xuICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgIFwibmFtZVwiOiBcInB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudFwiLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUHVsbFJlcXVlc3RSZXZpZXdDb21tZW50XCIsXG4gICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJpZFwiLFxuICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImxhc3RFZGl0ZWRBdFwiLFxuICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImJvZHlcIixcbiAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJib2R5SFRNTFwiLFxuICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfVxuXTtcbnJldHVybiB7XG4gIFwia2luZFwiOiBcIlJlcXVlc3RcIixcbiAgXCJmcmFnbWVudFwiOiB7XG4gICAgXCJraW5kXCI6IFwiRnJhZ21lbnRcIixcbiAgICBcIm5hbWVcIjogXCJ1cGRhdGVQclJldmlld0NvbW1lbnRNdXRhdGlvblwiLFxuICAgIFwidHlwZVwiOiBcIk11dGF0aW9uXCIsXG4gICAgXCJtZXRhZGF0YVwiOiBudWxsLFxuICAgIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiAodjAvKjogYW55Ki8pLFxuICAgIFwic2VsZWN0aW9uc1wiOiAodjEvKjogYW55Ki8pXG4gIH0sXG4gIFwib3BlcmF0aW9uXCI6IHtcbiAgICBcImtpbmRcIjogXCJPcGVyYXRpb25cIixcbiAgICBcIm5hbWVcIjogXCJ1cGRhdGVQclJldmlld0NvbW1lbnRNdXRhdGlvblwiLFxuICAgIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiAodjAvKjogYW55Ki8pLFxuICAgIFwic2VsZWN0aW9uc1wiOiAodjEvKjogYW55Ki8pXG4gIH0sXG4gIFwicGFyYW1zXCI6IHtcbiAgICBcIm9wZXJhdGlvbktpbmRcIjogXCJtdXRhdGlvblwiLFxuICAgIFwibmFtZVwiOiBcInVwZGF0ZVByUmV2aWV3Q29tbWVudE11dGF0aW9uXCIsXG4gICAgXCJpZFwiOiBudWxsLFxuICAgIFwidGV4dFwiOiBcIm11dGF0aW9uIHVwZGF0ZVByUmV2aWV3Q29tbWVudE11dGF0aW9uKFxcbiAgJGlucHV0OiBVcGRhdGVQdWxsUmVxdWVzdFJldmlld0NvbW1lbnRJbnB1dCFcXG4pIHtcXG4gIHVwZGF0ZVB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudChpbnB1dDogJGlucHV0KSB7XFxuICAgIHB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudCB7XFxuICAgICAgaWRcXG4gICAgICBsYXN0RWRpdGVkQXRcXG4gICAgICBib2R5XFxuICAgICAgYm9keUhUTUxcXG4gICAgfVxcbiAgfVxcbn1cXG5cIixcbiAgICBcIm1ldGFkYXRhXCI6IHt9XG4gIH1cbn07XG59KSgpO1xuLy8gcHJldHRpZXItaWdub3JlXG4obm9kZS8qOiBhbnkqLykuaGFzaCA9ICdkN2I0ZTgyM2Y0NjA0YTJiMTkzYTFmYWNlYjNmY2ZjYSc7XG5tb2R1bGUuZXhwb3J0cyA9IG5vZGU7XG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLFlBQVk7O0FBRVo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLE1BQU1BLElBQUkseUJBQXlCLFlBQVU7RUFDN0MsSUFBSUMsRUFBRSxHQUFHLENBQ1A7TUFDRSxNQUFNLEVBQUUsZUFBZTtNQUN2QixNQUFNLEVBQUUsT0FBTztNQUNmLE1BQU0sRUFBRSxzQ0FBc0M7TUFDOUMsY0FBYyxFQUFFO0lBQ2xCLENBQUMsQ0FDRjtJQUNEQyxFQUFFLEdBQUcsQ0FDSDtNQUNFLE1BQU0sRUFBRSxhQUFhO01BQ3JCLE9BQU8sRUFBRSxJQUFJO01BQ2IsTUFBTSxFQUFFLGdDQUFnQztNQUN4QyxZQUFZLEVBQUUsSUFBSTtNQUNsQixNQUFNLEVBQUUsQ0FDTjtRQUNFLE1BQU0sRUFBRSxVQUFVO1FBQ2xCLE1BQU0sRUFBRSxPQUFPO1FBQ2YsY0FBYyxFQUFFO01BQ2xCLENBQUMsQ0FDRjtNQUNELGNBQWMsRUFBRSx1Q0FBdUM7TUFDdkQsUUFBUSxFQUFFLEtBQUs7TUFDZixZQUFZLEVBQUUsQ0FDWjtRQUNFLE1BQU0sRUFBRSxhQUFhO1FBQ3JCLE9BQU8sRUFBRSxJQUFJO1FBQ2IsTUFBTSxFQUFFLDBCQUEwQjtRQUNsQyxZQUFZLEVBQUUsSUFBSTtRQUNsQixNQUFNLEVBQUUsSUFBSTtRQUNaLGNBQWMsRUFBRSwwQkFBMEI7UUFDMUMsUUFBUSxFQUFFLEtBQUs7UUFDZixZQUFZLEVBQUUsQ0FDWjtVQUNFLE1BQU0sRUFBRSxhQUFhO1VBQ3JCLE9BQU8sRUFBRSxJQUFJO1VBQ2IsTUFBTSxFQUFFLElBQUk7VUFDWixNQUFNLEVBQUUsSUFBSTtVQUNaLFlBQVksRUFBRTtRQUNoQixDQUFDLEVBQ0Q7VUFDRSxNQUFNLEVBQUUsYUFBYTtVQUNyQixPQUFPLEVBQUUsSUFBSTtVQUNiLE1BQU0sRUFBRSxjQUFjO1VBQ3RCLE1BQU0sRUFBRSxJQUFJO1VBQ1osWUFBWSxFQUFFO1FBQ2hCLENBQUMsRUFDRDtVQUNFLE1BQU0sRUFBRSxhQUFhO1VBQ3JCLE9BQU8sRUFBRSxJQUFJO1VBQ2IsTUFBTSxFQUFFLE1BQU07VUFDZCxNQUFNLEVBQUUsSUFBSTtVQUNaLFlBQVksRUFBRTtRQUNoQixDQUFDLEVBQ0Q7VUFDRSxNQUFNLEVBQUUsYUFBYTtVQUNyQixPQUFPLEVBQUUsSUFBSTtVQUNiLE1BQU0sRUFBRSxVQUFVO1VBQ2xCLE1BQU0sRUFBRSxJQUFJO1VBQ1osWUFBWSxFQUFFO1FBQ2hCLENBQUM7TUFFTCxDQUFDO0lBRUwsQ0FBQyxDQUNGO0VBQ0QsT0FBTztJQUNMLE1BQU0sRUFBRSxTQUFTO0lBQ2pCLFVBQVUsRUFBRTtNQUNWLE1BQU0sRUFBRSxVQUFVO01BQ2xCLE1BQU0sRUFBRSwrQkFBK0I7TUFDdkMsTUFBTSxFQUFFLFVBQVU7TUFDbEIsVUFBVSxFQUFFLElBQUk7TUFDaEIscUJBQXFCLEVBQUdELEVBQUUsVUFBVTtNQUNwQyxZQUFZLEVBQUdDLEVBQUU7SUFDbkIsQ0FBQzs7SUFDRCxXQUFXLEVBQUU7TUFDWCxNQUFNLEVBQUUsV0FBVztNQUNuQixNQUFNLEVBQUUsK0JBQStCO01BQ3ZDLHFCQUFxQixFQUFHRCxFQUFFLFVBQVU7TUFDcEMsWUFBWSxFQUFHQyxFQUFFO0lBQ25CLENBQUM7O0lBQ0QsUUFBUSxFQUFFO01BQ1IsZUFBZSxFQUFFLFVBQVU7TUFDM0IsTUFBTSxFQUFFLCtCQUErQjtNQUN2QyxJQUFJLEVBQUUsSUFBSTtNQUNWLE1BQU0sRUFBRSw0UEFBNFA7TUFDcFEsVUFBVSxFQUFFLENBQUM7SUFDZjtFQUNGLENBQUM7QUFDRCxDQUFDLENBQUUsQ0FBQztBQUNKO0FBQ0NGLElBQUksV0FBV0csSUFBSSxHQUFHLGtDQUFrQztBQUN6REMsTUFBTSxDQUFDQyxPQUFPLEdBQUdMLElBQUkifQ==