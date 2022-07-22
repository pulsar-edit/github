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

const node
/*: ConcreteRequest*/
= function () {
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
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": v1
      /*: any*/

    },
    "operation": {
      "kind": "Operation",
      "name": "updatePrReviewCommentMutation",
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": v1
      /*: any*/

    },
    "params": {
      "operationKind": "mutation",
      "name": "updatePrReviewCommentMutation",
      "id": null,
      "text": "mutation updatePrReviewCommentMutation(\n  $input: UpdatePullRequestReviewCommentInput!\n) {\n  updatePullRequestReviewComment(input: $input) {\n    pullRequestReviewComment {\n      id\n      lastEditedAt\n      body\n      bodyHTML\n    }\n  }\n}\n",
      "metadata": {}
    }
  };
}(); // prettier-ignore


node
/*: any*/
.hash = 'd7b4e823f4604a2b193a1faceb3fcfca';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9tdXRhdGlvbnMvX19nZW5lcmF0ZWRfXy91cGRhdGVQclJldmlld0NvbW1lbnRNdXRhdGlvbi5ncmFwaHFsLmpzIl0sIm5hbWVzIjpbIm5vZGUiLCJ2MCIsInYxIiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQU1BO0FBQUk7QUFBQSxFQUF5QixZQUFVO0FBQzdDLE1BQUlDLEVBQUUsR0FBRyxDQUNQO0FBQ0UsWUFBUSxlQURWO0FBRUUsWUFBUSxPQUZWO0FBR0UsWUFBUSxzQ0FIVjtBQUlFLG9CQUFnQjtBQUpsQixHQURPLENBQVQ7QUFBQSxNQVFBQyxFQUFFLEdBQUcsQ0FDSDtBQUNFLFlBQVEsYUFEVjtBQUVFLGFBQVMsSUFGWDtBQUdFLFlBQVEsZ0NBSFY7QUFJRSxrQkFBYyxJQUpoQjtBQUtFLFlBQVEsQ0FDTjtBQUNFLGNBQVEsVUFEVjtBQUVFLGNBQVEsT0FGVjtBQUdFLHNCQUFnQjtBQUhsQixLQURNLENBTFY7QUFZRSxvQkFBZ0IsdUNBWmxCO0FBYUUsY0FBVSxLQWJaO0FBY0Usa0JBQWMsQ0FDWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsSUFGWDtBQUdFLGNBQVEsMEJBSFY7QUFJRSxvQkFBYyxJQUpoQjtBQUtFLGNBQVEsSUFMVjtBQU1FLHNCQUFnQiwwQkFObEI7QUFPRSxnQkFBVSxLQVBaO0FBUUUsb0JBQWMsQ0FDWjtBQUNFLGdCQUFRLGFBRFY7QUFFRSxpQkFBUyxJQUZYO0FBR0UsZ0JBQVEsSUFIVjtBQUlFLGdCQUFRLElBSlY7QUFLRSxzQkFBYztBQUxoQixPQURZLEVBUVo7QUFDRSxnQkFBUSxhQURWO0FBRUUsaUJBQVMsSUFGWDtBQUdFLGdCQUFRLGNBSFY7QUFJRSxnQkFBUSxJQUpWO0FBS0Usc0JBQWM7QUFMaEIsT0FSWSxFQWVaO0FBQ0UsZ0JBQVEsYUFEVjtBQUVFLGlCQUFTLElBRlg7QUFHRSxnQkFBUSxNQUhWO0FBSUUsZ0JBQVEsSUFKVjtBQUtFLHNCQUFjO0FBTGhCLE9BZlksRUFzQlo7QUFDRSxnQkFBUSxhQURWO0FBRUUsaUJBQVMsSUFGWDtBQUdFLGdCQUFRLFVBSFY7QUFJRSxnQkFBUSxJQUpWO0FBS0Usc0JBQWM7QUFMaEIsT0F0Qlk7QUFSaEIsS0FEWTtBQWRoQixHQURHLENBUkw7QUFrRUEsU0FBTztBQUNMLFlBQVEsU0FESDtBQUVMLGdCQUFZO0FBQ1YsY0FBUSxVQURFO0FBRVYsY0FBUSwrQkFGRTtBQUdWLGNBQVEsVUFIRTtBQUlWLGtCQUFZLElBSkY7QUFLViw2QkFBd0JEO0FBQUU7QUFMaEI7QUFNVixvQkFBZUM7QUFBRTs7QUFOUCxLQUZQO0FBVUwsaUJBQWE7QUFDWCxjQUFRLFdBREc7QUFFWCxjQUFRLCtCQUZHO0FBR1gsNkJBQXdCRDtBQUFFO0FBSGY7QUFJWCxvQkFBZUM7QUFBRTs7QUFKTixLQVZSO0FBZ0JMLGNBQVU7QUFDUix1QkFBaUIsVUFEVDtBQUVSLGNBQVEsK0JBRkE7QUFHUixZQUFNLElBSEU7QUFJUixjQUFRLDRQQUpBO0FBS1Isa0JBQVk7QUFMSjtBQWhCTCxHQUFQO0FBd0JDLENBM0ZpQyxFQUFsQyxDLENBNEZBOzs7QUFDQ0Y7QUFBSTtBQUFMLENBQWdCRyxJQUFoQixHQUF1QixrQ0FBdkI7QUFDQUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCTCxJQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZsb3dcbiAqIEByZWxheUhhc2ggODg3YTQ2NjllM2QzOTEyOGIzOTE4MTRjYTY3ZGY0ZDBcbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qOjpcbmltcG9ydCB0eXBlIHsgQ29uY3JldGVSZXF1ZXN0IH0gZnJvbSAncmVsYXktcnVudGltZSc7XG5leHBvcnQgdHlwZSBVcGRhdGVQdWxsUmVxdWVzdFJldmlld0NvbW1lbnRJbnB1dCA9IHt8XG4gIHB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudElkOiBzdHJpbmcsXG4gIGJvZHk6IHN0cmluZyxcbiAgY2xpZW50TXV0YXRpb25JZD86ID9zdHJpbmcsXG58fTtcbmV4cG9ydCB0eXBlIHVwZGF0ZVByUmV2aWV3Q29tbWVudE11dGF0aW9uVmFyaWFibGVzID0ge3xcbiAgaW5wdXQ6IFVwZGF0ZVB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudElucHV0XG58fTtcbmV4cG9ydCB0eXBlIHVwZGF0ZVByUmV2aWV3Q29tbWVudE11dGF0aW9uUmVzcG9uc2UgPSB7fFxuICArdXBkYXRlUHVsbFJlcXVlc3RSZXZpZXdDb21tZW50OiA/e3xcbiAgICArcHVsbFJlcXVlc3RSZXZpZXdDb21tZW50OiA/e3xcbiAgICAgICtpZDogc3RyaW5nLFxuICAgICAgK2xhc3RFZGl0ZWRBdDogP2FueSxcbiAgICAgICtib2R5OiBzdHJpbmcsXG4gICAgICArYm9keUhUTUw6IGFueSxcbiAgICB8fVxuICB8fVxufH07XG5leHBvcnQgdHlwZSB1cGRhdGVQclJldmlld0NvbW1lbnRNdXRhdGlvbiA9IHt8XG4gIHZhcmlhYmxlczogdXBkYXRlUHJSZXZpZXdDb21tZW50TXV0YXRpb25WYXJpYWJsZXMsXG4gIHJlc3BvbnNlOiB1cGRhdGVQclJldmlld0NvbW1lbnRNdXRhdGlvblJlc3BvbnNlLFxufH07XG4qL1xuXG5cbi8qXG5tdXRhdGlvbiB1cGRhdGVQclJldmlld0NvbW1lbnRNdXRhdGlvbihcbiAgJGlucHV0OiBVcGRhdGVQdWxsUmVxdWVzdFJldmlld0NvbW1lbnRJbnB1dCFcbikge1xuICB1cGRhdGVQdWxsUmVxdWVzdFJldmlld0NvbW1lbnQoaW5wdXQ6ICRpbnB1dCkge1xuICAgIHB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudCB7XG4gICAgICBpZFxuICAgICAgbGFzdEVkaXRlZEF0XG4gICAgICBib2R5XG4gICAgICBib2R5SFRNTFxuICAgIH1cbiAgfVxufVxuKi9cblxuY29uc3Qgbm9kZS8qOiBDb25jcmV0ZVJlcXVlc3QqLyA9IChmdW5jdGlvbigpe1xudmFyIHYwID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgIFwibmFtZVwiOiBcImlucHV0XCIsXG4gICAgXCJ0eXBlXCI6IFwiVXBkYXRlUHVsbFJlcXVlc3RSZXZpZXdDb21tZW50SW5wdXQhXCIsXG4gICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICB9XG5dLFxudjEgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICBcIm5hbWVcIjogXCJ1cGRhdGVQdWxsUmVxdWVzdFJldmlld0NvbW1lbnRcIixcbiAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICBcImFyZ3NcIjogW1xuICAgICAge1xuICAgICAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgICAgICBcIm5hbWVcIjogXCJpbnB1dFwiLFxuICAgICAgICBcInZhcmlhYmxlTmFtZVwiOiBcImlucHV0XCJcbiAgICAgIH1cbiAgICBdLFxuICAgIFwiY29uY3JldGVUeXBlXCI6IFwiVXBkYXRlUHVsbFJlcXVlc3RSZXZpZXdDb21tZW50UGF5bG9hZFwiLFxuICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgXCJuYW1lXCI6IFwicHVsbFJlcXVlc3RSZXZpZXdDb21tZW50XCIsXG4gICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJQdWxsUmVxdWVzdFJldmlld0NvbW1lbnRcIixcbiAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImlkXCIsXG4gICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwibGFzdEVkaXRlZEF0XCIsXG4gICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiYm9keVwiLFxuICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImJvZHlIVE1MXCIsXG4gICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9XG5dO1xucmV0dXJuIHtcbiAgXCJraW5kXCI6IFwiUmVxdWVzdFwiLFxuICBcImZyYWdtZW50XCI6IHtcbiAgICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICAgIFwibmFtZVwiOiBcInVwZGF0ZVByUmV2aWV3Q29tbWVudE11dGF0aW9uXCIsXG4gICAgXCJ0eXBlXCI6IFwiTXV0YXRpb25cIixcbiAgICBcIm1ldGFkYXRhXCI6IG51bGwsXG4gICAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6ICh2MC8qOiBhbnkqLyksXG4gICAgXCJzZWxlY3Rpb25zXCI6ICh2MS8qOiBhbnkqLylcbiAgfSxcbiAgXCJvcGVyYXRpb25cIjoge1xuICAgIFwia2luZFwiOiBcIk9wZXJhdGlvblwiLFxuICAgIFwibmFtZVwiOiBcInVwZGF0ZVByUmV2aWV3Q29tbWVudE11dGF0aW9uXCIsXG4gICAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6ICh2MC8qOiBhbnkqLyksXG4gICAgXCJzZWxlY3Rpb25zXCI6ICh2MS8qOiBhbnkqLylcbiAgfSxcbiAgXCJwYXJhbXNcIjoge1xuICAgIFwib3BlcmF0aW9uS2luZFwiOiBcIm11dGF0aW9uXCIsXG4gICAgXCJuYW1lXCI6IFwidXBkYXRlUHJSZXZpZXdDb21tZW50TXV0YXRpb25cIixcbiAgICBcImlkXCI6IG51bGwsXG4gICAgXCJ0ZXh0XCI6IFwibXV0YXRpb24gdXBkYXRlUHJSZXZpZXdDb21tZW50TXV0YXRpb24oXFxuICAkaW5wdXQ6IFVwZGF0ZVB1bGxSZXF1ZXN0UmV2aWV3Q29tbWVudElucHV0IVxcbikge1xcbiAgdXBkYXRlUHVsbFJlcXVlc3RSZXZpZXdDb21tZW50KGlucHV0OiAkaW5wdXQpIHtcXG4gICAgcHVsbFJlcXVlc3RSZXZpZXdDb21tZW50IHtcXG4gICAgICBpZFxcbiAgICAgIGxhc3RFZGl0ZWRBdFxcbiAgICAgIGJvZHlcXG4gICAgICBib2R5SFRNTFxcbiAgICB9XFxuICB9XFxufVxcblwiLFxuICAgIFwibWV0YWRhdGFcIjoge31cbiAgfVxufTtcbn0pKCk7XG4vLyBwcmV0dGllci1pZ25vcmVcbihub2RlLyo6IGFueSovKS5oYXNoID0gJ2Q3YjRlODIzZjQ2MDRhMmIxOTNhMWZhY2ViM2ZjZmNhJztcbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcbiJdfQ==