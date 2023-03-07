/**
 * @flow
 * @relayHash 75200195d76356be6d31a71143dcd6a8
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type ResolveReviewThreadInput = {|
  threadId: string,
  clientMutationId?: ?string,
|};
export type resolveReviewThreadMutationVariables = {|
  input: ResolveReviewThreadInput
|};
export type resolveReviewThreadMutationResponse = {|
  +resolveReviewThread: ?{|
    +thread: ?{|
      +id: string,
      +isResolved: boolean,
      +viewerCanResolve: boolean,
      +viewerCanUnresolve: boolean,
      +resolvedBy: ?{|
        +id: string,
        +login: string,
      |},
    |}
  |}
|};
export type resolveReviewThreadMutation = {|
  variables: resolveReviewThreadMutationVariables,
  response: resolveReviewThreadMutationResponse,
|};
*/

/*
mutation resolveReviewThreadMutation(
  $input: ResolveReviewThreadInput!
) {
  resolveReviewThread(input: $input) {
    thread {
      id
      isResolved
      viewerCanResolve
      viewerCanUnresolve
      resolvedBy {
        id
        login
      }
    }
  }
}
*/
const node /*: ConcreteRequest*/ = function () {
  var v0 = [{
      "kind": "LocalArgument",
      "name": "input",
      "type": "ResolveReviewThreadInput!",
      "defaultValue": null
    }],
    v1 = {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    },
    v2 = [{
      "kind": "LinkedField",
      "alias": null,
      "name": "resolveReviewThread",
      "storageKey": null,
      "args": [{
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }],
      "concreteType": "ResolveReviewThreadPayload",
      "plural": false,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "thread",
        "storageKey": null,
        "args": null,
        "concreteType": "PullRequestReviewThread",
        "plural": false,
        "selections": [v1 /*: any*/, {
          "kind": "ScalarField",
          "alias": null,
          "name": "isResolved",
          "args": null,
          "storageKey": null
        }, {
          "kind": "ScalarField",
          "alias": null,
          "name": "viewerCanResolve",
          "args": null,
          "storageKey": null
        }, {
          "kind": "ScalarField",
          "alias": null,
          "name": "viewerCanUnresolve",
          "args": null,
          "storageKey": null
        }, {
          "kind": "LinkedField",
          "alias": null,
          "name": "resolvedBy",
          "storageKey": null,
          "args": null,
          "concreteType": "User",
          "plural": false,
          "selections": [v1 /*: any*/, {
            "kind": "ScalarField",
            "alias": null,
            "name": "login",
            "args": null,
            "storageKey": null
          }]
        }]
      }]
    }];
  return {
    "kind": "Request",
    "fragment": {
      "kind": "Fragment",
      "name": "resolveReviewThreadMutation",
      "type": "Mutation",
      "metadata": null,
      "argumentDefinitions": v0 /*: any*/,
      "selections": v2 /*: any*/
    },

    "operation": {
      "kind": "Operation",
      "name": "resolveReviewThreadMutation",
      "argumentDefinitions": v0 /*: any*/,
      "selections": v2 /*: any*/
    },

    "params": {
      "operationKind": "mutation",
      "name": "resolveReviewThreadMutation",
      "id": null,
      "text": "mutation resolveReviewThreadMutation(\n  $input: ResolveReviewThreadInput!\n) {\n  resolveReviewThread(input: $input) {\n    thread {\n      id\n      isResolved\n      viewerCanResolve\n      viewerCanUnresolve\n      resolvedBy {\n        id\n        login\n      }\n    }\n  }\n}\n",
      "metadata": {}
    }
  };
}();
// prettier-ignore
node /*: any*/.hash = '6947ef6710d494dc52fba1a5b532cd76';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJub2RlIiwidjAiLCJ2MSIsInYyIiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwic291cmNlcyI6WyJyZXNvbHZlUmV2aWV3VGhyZWFkTXV0YXRpb24uZ3JhcGhxbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmbG93XG4gKiBAcmVsYXlIYXNoIDc1MjAwMTk1ZDc2MzU2YmU2ZDMxYTcxMTQzZGNkNmE4XG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKjo6XG5pbXBvcnQgdHlwZSB7IENvbmNyZXRlUmVxdWVzdCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xuZXhwb3J0IHR5cGUgUmVzb2x2ZVJldmlld1RocmVhZElucHV0ID0ge3xcbiAgdGhyZWFkSWQ6IHN0cmluZyxcbiAgY2xpZW50TXV0YXRpb25JZD86ID9zdHJpbmcsXG58fTtcbmV4cG9ydCB0eXBlIHJlc29sdmVSZXZpZXdUaHJlYWRNdXRhdGlvblZhcmlhYmxlcyA9IHt8XG4gIGlucHV0OiBSZXNvbHZlUmV2aWV3VGhyZWFkSW5wdXRcbnx9O1xuZXhwb3J0IHR5cGUgcmVzb2x2ZVJldmlld1RocmVhZE11dGF0aW9uUmVzcG9uc2UgPSB7fFxuICArcmVzb2x2ZVJldmlld1RocmVhZDogP3t8XG4gICAgK3RocmVhZDogP3t8XG4gICAgICAraWQ6IHN0cmluZyxcbiAgICAgICtpc1Jlc29sdmVkOiBib29sZWFuLFxuICAgICAgK3ZpZXdlckNhblJlc29sdmU6IGJvb2xlYW4sXG4gICAgICArdmlld2VyQ2FuVW5yZXNvbHZlOiBib29sZWFuLFxuICAgICAgK3Jlc29sdmVkQnk6ID97fFxuICAgICAgICAraWQ6IHN0cmluZyxcbiAgICAgICAgK2xvZ2luOiBzdHJpbmcsXG4gICAgICB8fSxcbiAgICB8fVxuICB8fVxufH07XG5leHBvcnQgdHlwZSByZXNvbHZlUmV2aWV3VGhyZWFkTXV0YXRpb24gPSB7fFxuICB2YXJpYWJsZXM6IHJlc29sdmVSZXZpZXdUaHJlYWRNdXRhdGlvblZhcmlhYmxlcyxcbiAgcmVzcG9uc2U6IHJlc29sdmVSZXZpZXdUaHJlYWRNdXRhdGlvblJlc3BvbnNlLFxufH07XG4qL1xuXG5cbi8qXG5tdXRhdGlvbiByZXNvbHZlUmV2aWV3VGhyZWFkTXV0YXRpb24oXG4gICRpbnB1dDogUmVzb2x2ZVJldmlld1RocmVhZElucHV0IVxuKSB7XG4gIHJlc29sdmVSZXZpZXdUaHJlYWQoaW5wdXQ6ICRpbnB1dCkge1xuICAgIHRocmVhZCB7XG4gICAgICBpZFxuICAgICAgaXNSZXNvbHZlZFxuICAgICAgdmlld2VyQ2FuUmVzb2x2ZVxuICAgICAgdmlld2VyQ2FuVW5yZXNvbHZlXG4gICAgICByZXNvbHZlZEJ5IHtcbiAgICAgICAgaWRcbiAgICAgICAgbG9naW5cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiovXG5cbmNvbnN0IG5vZGUvKjogQ29uY3JldGVSZXF1ZXN0Ki8gPSAoZnVuY3Rpb24oKXtcbnZhciB2MCA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICBcIm5hbWVcIjogXCJpbnB1dFwiLFxuICAgIFwidHlwZVwiOiBcIlJlc29sdmVSZXZpZXdUaHJlYWRJbnB1dCFcIixcbiAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gIH1cbl0sXG52MSA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJpZFwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52MiA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgXCJhbGlhc1wiOiBudWxsLFxuICAgIFwibmFtZVwiOiBcInJlc29sdmVSZXZpZXdUaHJlYWRcIixcbiAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICBcImFyZ3NcIjogW1xuICAgICAge1xuICAgICAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgICAgICBcIm5hbWVcIjogXCJpbnB1dFwiLFxuICAgICAgICBcInZhcmlhYmxlTmFtZVwiOiBcImlucHV0XCJcbiAgICAgIH1cbiAgICBdLFxuICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUmVzb2x2ZVJldmlld1RocmVhZFBheWxvYWRcIixcbiAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAge1xuICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgIFwibmFtZVwiOiBcInRocmVhZFwiLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUHVsbFJlcXVlc3RSZXZpZXdUaHJlYWRcIixcbiAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgKHYxLyo6IGFueSovKSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiaXNSZXNvbHZlZFwiLFxuICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgIFwibmFtZVwiOiBcInZpZXdlckNhblJlc29sdmVcIixcbiAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJ2aWV3ZXJDYW5VbnJlc29sdmVcIixcbiAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJyZXNvbHZlZEJ5XCIsXG4gICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJVc2VyXCIsXG4gICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICh2MS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJsb2dpblwiLFxuICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH1cbl07XG5yZXR1cm4ge1xuICBcImtpbmRcIjogXCJSZXF1ZXN0XCIsXG4gIFwiZnJhZ21lbnRcIjoge1xuICAgIFwia2luZFwiOiBcIkZyYWdtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwicmVzb2x2ZVJldmlld1RocmVhZE11dGF0aW9uXCIsXG4gICAgXCJ0eXBlXCI6IFwiTXV0YXRpb25cIixcbiAgICBcIm1ldGFkYXRhXCI6IG51bGwsXG4gICAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6ICh2MC8qOiBhbnkqLyksXG4gICAgXCJzZWxlY3Rpb25zXCI6ICh2Mi8qOiBhbnkqLylcbiAgfSxcbiAgXCJvcGVyYXRpb25cIjoge1xuICAgIFwia2luZFwiOiBcIk9wZXJhdGlvblwiLFxuICAgIFwibmFtZVwiOiBcInJlc29sdmVSZXZpZXdUaHJlYWRNdXRhdGlvblwiLFxuICAgIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiAodjAvKjogYW55Ki8pLFxuICAgIFwic2VsZWN0aW9uc1wiOiAodjIvKjogYW55Ki8pXG4gIH0sXG4gIFwicGFyYW1zXCI6IHtcbiAgICBcIm9wZXJhdGlvbktpbmRcIjogXCJtdXRhdGlvblwiLFxuICAgIFwibmFtZVwiOiBcInJlc29sdmVSZXZpZXdUaHJlYWRNdXRhdGlvblwiLFxuICAgIFwiaWRcIjogbnVsbCxcbiAgICBcInRleHRcIjogXCJtdXRhdGlvbiByZXNvbHZlUmV2aWV3VGhyZWFkTXV0YXRpb24oXFxuICAkaW5wdXQ6IFJlc29sdmVSZXZpZXdUaHJlYWRJbnB1dCFcXG4pIHtcXG4gIHJlc29sdmVSZXZpZXdUaHJlYWQoaW5wdXQ6ICRpbnB1dCkge1xcbiAgICB0aHJlYWQge1xcbiAgICAgIGlkXFxuICAgICAgaXNSZXNvbHZlZFxcbiAgICAgIHZpZXdlckNhblJlc29sdmVcXG4gICAgICB2aWV3ZXJDYW5VbnJlc29sdmVcXG4gICAgICByZXNvbHZlZEJ5IHtcXG4gICAgICAgIGlkXFxuICAgICAgICBsb2dpblxcbiAgICAgIH1cXG4gICAgfVxcbiAgfVxcbn1cXG5cIixcbiAgICBcIm1ldGFkYXRhXCI6IHt9XG4gIH1cbn07XG59KSgpO1xuLy8gcHJldHRpZXItaWdub3JlXG4obm9kZS8qOiBhbnkqLykuaGFzaCA9ICc2OTQ3ZWY2NzEwZDQ5NGRjNTJmYmExYTViNTMyY2Q3Nic7XG5tb2R1bGUuZXhwb3J0cyA9IG5vZGU7XG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLFlBQVk7O0FBRVo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsTUFBTUEsSUFBSSx5QkFBeUIsWUFBVTtFQUM3QyxJQUFJQyxFQUFFLEdBQUcsQ0FDUDtNQUNFLE1BQU0sRUFBRSxlQUFlO01BQ3ZCLE1BQU0sRUFBRSxPQUFPO01BQ2YsTUFBTSxFQUFFLDJCQUEyQjtNQUNuQyxjQUFjLEVBQUU7SUFDbEIsQ0FBQyxDQUNGO0lBQ0RDLEVBQUUsR0FBRztNQUNILE1BQU0sRUFBRSxhQUFhO01BQ3JCLE9BQU8sRUFBRSxJQUFJO01BQ2IsTUFBTSxFQUFFLElBQUk7TUFDWixNQUFNLEVBQUUsSUFBSTtNQUNaLFlBQVksRUFBRTtJQUNoQixDQUFDO0lBQ0RDLEVBQUUsR0FBRyxDQUNIO01BQ0UsTUFBTSxFQUFFLGFBQWE7TUFDckIsT0FBTyxFQUFFLElBQUk7TUFDYixNQUFNLEVBQUUscUJBQXFCO01BQzdCLFlBQVksRUFBRSxJQUFJO01BQ2xCLE1BQU0sRUFBRSxDQUNOO1FBQ0UsTUFBTSxFQUFFLFVBQVU7UUFDbEIsTUFBTSxFQUFFLE9BQU87UUFDZixjQUFjLEVBQUU7TUFDbEIsQ0FBQyxDQUNGO01BQ0QsY0FBYyxFQUFFLDRCQUE0QjtNQUM1QyxRQUFRLEVBQUUsS0FBSztNQUNmLFlBQVksRUFBRSxDQUNaO1FBQ0UsTUFBTSxFQUFFLGFBQWE7UUFDckIsT0FBTyxFQUFFLElBQUk7UUFDYixNQUFNLEVBQUUsUUFBUTtRQUNoQixZQUFZLEVBQUUsSUFBSTtRQUNsQixNQUFNLEVBQUUsSUFBSTtRQUNaLGNBQWMsRUFBRSx5QkFBeUI7UUFDekMsUUFBUSxFQUFFLEtBQUs7UUFDZixZQUFZLEVBQUUsQ0FDWEQsRUFBRSxZQUNIO1VBQ0UsTUFBTSxFQUFFLGFBQWE7VUFDckIsT0FBTyxFQUFFLElBQUk7VUFDYixNQUFNLEVBQUUsWUFBWTtVQUNwQixNQUFNLEVBQUUsSUFBSTtVQUNaLFlBQVksRUFBRTtRQUNoQixDQUFDLEVBQ0Q7VUFDRSxNQUFNLEVBQUUsYUFBYTtVQUNyQixPQUFPLEVBQUUsSUFBSTtVQUNiLE1BQU0sRUFBRSxrQkFBa0I7VUFDMUIsTUFBTSxFQUFFLElBQUk7VUFDWixZQUFZLEVBQUU7UUFDaEIsQ0FBQyxFQUNEO1VBQ0UsTUFBTSxFQUFFLGFBQWE7VUFDckIsT0FBTyxFQUFFLElBQUk7VUFDYixNQUFNLEVBQUUsb0JBQW9CO1VBQzVCLE1BQU0sRUFBRSxJQUFJO1VBQ1osWUFBWSxFQUFFO1FBQ2hCLENBQUMsRUFDRDtVQUNFLE1BQU0sRUFBRSxhQUFhO1VBQ3JCLE9BQU8sRUFBRSxJQUFJO1VBQ2IsTUFBTSxFQUFFLFlBQVk7VUFDcEIsWUFBWSxFQUFFLElBQUk7VUFDbEIsTUFBTSxFQUFFLElBQUk7VUFDWixjQUFjLEVBQUUsTUFBTTtVQUN0QixRQUFRLEVBQUUsS0FBSztVQUNmLFlBQVksRUFBRSxDQUNYQSxFQUFFLFlBQ0g7WUFDRSxNQUFNLEVBQUUsYUFBYTtZQUNyQixPQUFPLEVBQUUsSUFBSTtZQUNiLE1BQU0sRUFBRSxPQUFPO1lBQ2YsTUFBTSxFQUFFLElBQUk7WUFDWixZQUFZLEVBQUU7VUFDaEIsQ0FBQztRQUVMLENBQUM7TUFFTCxDQUFDO0lBRUwsQ0FBQyxDQUNGO0VBQ0QsT0FBTztJQUNMLE1BQU0sRUFBRSxTQUFTO0lBQ2pCLFVBQVUsRUFBRTtNQUNWLE1BQU0sRUFBRSxVQUFVO01BQ2xCLE1BQU0sRUFBRSw2QkFBNkI7TUFDckMsTUFBTSxFQUFFLFVBQVU7TUFDbEIsVUFBVSxFQUFFLElBQUk7TUFDaEIscUJBQXFCLEVBQUdELEVBQUUsVUFBVTtNQUNwQyxZQUFZLEVBQUdFLEVBQUU7SUFDbkIsQ0FBQzs7SUFDRCxXQUFXLEVBQUU7TUFDWCxNQUFNLEVBQUUsV0FBVztNQUNuQixNQUFNLEVBQUUsNkJBQTZCO01BQ3JDLHFCQUFxQixFQUFHRixFQUFFLFVBQVU7TUFDcEMsWUFBWSxFQUFHRSxFQUFFO0lBQ25CLENBQUM7O0lBQ0QsUUFBUSxFQUFFO01BQ1IsZUFBZSxFQUFFLFVBQVU7TUFDM0IsTUFBTSxFQUFFLDZCQUE2QjtNQUNyQyxJQUFJLEVBQUUsSUFBSTtNQUNWLE1BQU0sRUFBRSw4UkFBOFI7TUFDdFMsVUFBVSxFQUFFLENBQUM7SUFDZjtFQUNGLENBQUM7QUFDRCxDQUFDLEVBQUc7QUFDSjtBQUNDSCxJQUFJLFdBQVdJLElBQUksR0FBRyxrQ0FBa0M7QUFDekRDLE1BQU0sQ0FBQ0MsT0FBTyxHQUFHTixJQUFJIn0=