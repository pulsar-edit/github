/**
 * @flow
 * @relayHash 7b994ab75aeaa7145dc8ab1daf0bf5b9
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type UnresolveReviewThreadInput = {|
  threadId: string,
  clientMutationId?: ?string,
|};
export type unresolveReviewThreadMutationVariables = {|
  input: UnresolveReviewThreadInput
|};
export type unresolveReviewThreadMutationResponse = {|
  +unresolveReviewThread: ?{|
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
export type unresolveReviewThreadMutation = {|
  variables: unresolveReviewThreadMutationVariables,
  response: unresolveReviewThreadMutationResponse,
|};
*/

/*
mutation unresolveReviewThreadMutation(
  $input: UnresolveReviewThreadInput!
) {
  unresolveReviewThread(input: $input) {
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
      "type": "UnresolveReviewThreadInput!",
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
      "name": "unresolveReviewThread",
      "storageKey": null,
      "args": [{
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }],
      "concreteType": "UnresolveReviewThreadPayload",
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
      "name": "unresolveReviewThreadMutation",
      "type": "Mutation",
      "metadata": null,
      "argumentDefinitions": v0 /*: any*/,
      "selections": v2 /*: any*/
    },

    "operation": {
      "kind": "Operation",
      "name": "unresolveReviewThreadMutation",
      "argumentDefinitions": v0 /*: any*/,
      "selections": v2 /*: any*/
    },

    "params": {
      "operationKind": "mutation",
      "name": "unresolveReviewThreadMutation",
      "id": null,
      "text": "mutation unresolveReviewThreadMutation(\n  $input: UnresolveReviewThreadInput!\n) {\n  unresolveReviewThread(input: $input) {\n    thread {\n      id\n      isResolved\n      viewerCanResolve\n      viewerCanUnresolve\n      resolvedBy {\n        id\n        login\n      }\n    }\n  }\n}\n",
      "metadata": {}
    }
  };
}();
// prettier-ignore
node /*: any*/.hash = '8b1105e1a3db0455c522c7e5dc69b436';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJub2RlIiwidjAiLCJ2MSIsInYyIiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwic291cmNlcyI6WyJ1bnJlc29sdmVSZXZpZXdUaHJlYWRNdXRhdGlvbi5ncmFwaHFsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZsb3dcbiAqIEByZWxheUhhc2ggN2I5OTRhYjc1YWVhYTcxNDVkYzhhYjFkYWYwYmY1YjlcbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qOjpcbmltcG9ydCB0eXBlIHsgQ29uY3JldGVSZXF1ZXN0IH0gZnJvbSAncmVsYXktcnVudGltZSc7XG5leHBvcnQgdHlwZSBVbnJlc29sdmVSZXZpZXdUaHJlYWRJbnB1dCA9IHt8XG4gIHRocmVhZElkOiBzdHJpbmcsXG4gIGNsaWVudE11dGF0aW9uSWQ/OiA/c3RyaW5nLFxufH07XG5leHBvcnQgdHlwZSB1bnJlc29sdmVSZXZpZXdUaHJlYWRNdXRhdGlvblZhcmlhYmxlcyA9IHt8XG4gIGlucHV0OiBVbnJlc29sdmVSZXZpZXdUaHJlYWRJbnB1dFxufH07XG5leHBvcnQgdHlwZSB1bnJlc29sdmVSZXZpZXdUaHJlYWRNdXRhdGlvblJlc3BvbnNlID0ge3xcbiAgK3VucmVzb2x2ZVJldmlld1RocmVhZDogP3t8XG4gICAgK3RocmVhZDogP3t8XG4gICAgICAraWQ6IHN0cmluZyxcbiAgICAgICtpc1Jlc29sdmVkOiBib29sZWFuLFxuICAgICAgK3ZpZXdlckNhblJlc29sdmU6IGJvb2xlYW4sXG4gICAgICArdmlld2VyQ2FuVW5yZXNvbHZlOiBib29sZWFuLFxuICAgICAgK3Jlc29sdmVkQnk6ID97fFxuICAgICAgICAraWQ6IHN0cmluZyxcbiAgICAgICAgK2xvZ2luOiBzdHJpbmcsXG4gICAgICB8fSxcbiAgICB8fVxuICB8fVxufH07XG5leHBvcnQgdHlwZSB1bnJlc29sdmVSZXZpZXdUaHJlYWRNdXRhdGlvbiA9IHt8XG4gIHZhcmlhYmxlczogdW5yZXNvbHZlUmV2aWV3VGhyZWFkTXV0YXRpb25WYXJpYWJsZXMsXG4gIHJlc3BvbnNlOiB1bnJlc29sdmVSZXZpZXdUaHJlYWRNdXRhdGlvblJlc3BvbnNlLFxufH07XG4qL1xuXG5cbi8qXG5tdXRhdGlvbiB1bnJlc29sdmVSZXZpZXdUaHJlYWRNdXRhdGlvbihcbiAgJGlucHV0OiBVbnJlc29sdmVSZXZpZXdUaHJlYWRJbnB1dCFcbikge1xuICB1bnJlc29sdmVSZXZpZXdUaHJlYWQoaW5wdXQ6ICRpbnB1dCkge1xuICAgIHRocmVhZCB7XG4gICAgICBpZFxuICAgICAgaXNSZXNvbHZlZFxuICAgICAgdmlld2VyQ2FuUmVzb2x2ZVxuICAgICAgdmlld2VyQ2FuVW5yZXNvbHZlXG4gICAgICByZXNvbHZlZEJ5IHtcbiAgICAgICAgaWRcbiAgICAgICAgbG9naW5cbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbiovXG5cbmNvbnN0IG5vZGUvKjogQ29uY3JldGVSZXF1ZXN0Ki8gPSAoZnVuY3Rpb24oKXtcbnZhciB2MCA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICBcIm5hbWVcIjogXCJpbnB1dFwiLFxuICAgIFwidHlwZVwiOiBcIlVucmVzb2x2ZVJldmlld1RocmVhZElucHV0IVwiLFxuICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgfVxuXSxcbnYxID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcImlkXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnYyID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgXCJuYW1lXCI6IFwidW5yZXNvbHZlUmV2aWV3VGhyZWFkXCIsXG4gICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgXCJhcmdzXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICAgICAgXCJuYW1lXCI6IFwiaW5wdXRcIixcbiAgICAgICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJpbnB1dFwiXG4gICAgICB9XG4gICAgXSxcbiAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlVucmVzb2x2ZVJldmlld1RocmVhZFBheWxvYWRcIixcbiAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAge1xuICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgIFwibmFtZVwiOiBcInRocmVhZFwiLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUHVsbFJlcXVlc3RSZXZpZXdUaHJlYWRcIixcbiAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgKHYxLyo6IGFueSovKSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiaXNSZXNvbHZlZFwiLFxuICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgIFwibmFtZVwiOiBcInZpZXdlckNhblJlc29sdmVcIixcbiAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJ2aWV3ZXJDYW5VbnJlc29sdmVcIixcbiAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJyZXNvbHZlZEJ5XCIsXG4gICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJVc2VyXCIsXG4gICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICh2MS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJsb2dpblwiLFxuICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH1cbl07XG5yZXR1cm4ge1xuICBcImtpbmRcIjogXCJSZXF1ZXN0XCIsXG4gIFwiZnJhZ21lbnRcIjoge1xuICAgIFwia2luZFwiOiBcIkZyYWdtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwidW5yZXNvbHZlUmV2aWV3VGhyZWFkTXV0YXRpb25cIixcbiAgICBcInR5cGVcIjogXCJNdXRhdGlvblwiLFxuICAgIFwibWV0YWRhdGFcIjogbnVsbCxcbiAgICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogKHYwLyo6IGFueSovKSxcbiAgICBcInNlbGVjdGlvbnNcIjogKHYyLyo6IGFueSovKVxuICB9LFxuICBcIm9wZXJhdGlvblwiOiB7XG4gICAgXCJraW5kXCI6IFwiT3BlcmF0aW9uXCIsXG4gICAgXCJuYW1lXCI6IFwidW5yZXNvbHZlUmV2aWV3VGhyZWFkTXV0YXRpb25cIixcbiAgICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogKHYwLyo6IGFueSovKSxcbiAgICBcInNlbGVjdGlvbnNcIjogKHYyLyo6IGFueSovKVxuICB9LFxuICBcInBhcmFtc1wiOiB7XG4gICAgXCJvcGVyYXRpb25LaW5kXCI6IFwibXV0YXRpb25cIixcbiAgICBcIm5hbWVcIjogXCJ1bnJlc29sdmVSZXZpZXdUaHJlYWRNdXRhdGlvblwiLFxuICAgIFwiaWRcIjogbnVsbCxcbiAgICBcInRleHRcIjogXCJtdXRhdGlvbiB1bnJlc29sdmVSZXZpZXdUaHJlYWRNdXRhdGlvbihcXG4gICRpbnB1dDogVW5yZXNvbHZlUmV2aWV3VGhyZWFkSW5wdXQhXFxuKSB7XFxuICB1bnJlc29sdmVSZXZpZXdUaHJlYWQoaW5wdXQ6ICRpbnB1dCkge1xcbiAgICB0aHJlYWQge1xcbiAgICAgIGlkXFxuICAgICAgaXNSZXNvbHZlZFxcbiAgICAgIHZpZXdlckNhblJlc29sdmVcXG4gICAgICB2aWV3ZXJDYW5VbnJlc29sdmVcXG4gICAgICByZXNvbHZlZEJ5IHtcXG4gICAgICAgIGlkXFxuICAgICAgICBsb2dpblxcbiAgICAgIH1cXG4gICAgfVxcbiAgfVxcbn1cXG5cIixcbiAgICBcIm1ldGFkYXRhXCI6IHt9XG4gIH1cbn07XG59KSgpO1xuLy8gcHJldHRpZXItaWdub3JlXG4obm9kZS8qOiBhbnkqLykuaGFzaCA9ICc4YjExMDVlMWEzZGIwNDU1YzUyMmM3ZTVkYzY5YjQzNic7XG5tb2R1bGUuZXhwb3J0cyA9IG5vZGU7XG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLFlBQVk7O0FBRVo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsTUFBTUEsSUFBSSx5QkFBeUIsWUFBVTtFQUM3QyxJQUFJQyxFQUFFLEdBQUcsQ0FDUDtNQUNFLE1BQU0sRUFBRSxlQUFlO01BQ3ZCLE1BQU0sRUFBRSxPQUFPO01BQ2YsTUFBTSxFQUFFLDZCQUE2QjtNQUNyQyxjQUFjLEVBQUU7SUFDbEIsQ0FBQyxDQUNGO0lBQ0RDLEVBQUUsR0FBRztNQUNILE1BQU0sRUFBRSxhQUFhO01BQ3JCLE9BQU8sRUFBRSxJQUFJO01BQ2IsTUFBTSxFQUFFLElBQUk7TUFDWixNQUFNLEVBQUUsSUFBSTtNQUNaLFlBQVksRUFBRTtJQUNoQixDQUFDO0lBQ0RDLEVBQUUsR0FBRyxDQUNIO01BQ0UsTUFBTSxFQUFFLGFBQWE7TUFDckIsT0FBTyxFQUFFLElBQUk7TUFDYixNQUFNLEVBQUUsdUJBQXVCO01BQy9CLFlBQVksRUFBRSxJQUFJO01BQ2xCLE1BQU0sRUFBRSxDQUNOO1FBQ0UsTUFBTSxFQUFFLFVBQVU7UUFDbEIsTUFBTSxFQUFFLE9BQU87UUFDZixjQUFjLEVBQUU7TUFDbEIsQ0FBQyxDQUNGO01BQ0QsY0FBYyxFQUFFLDhCQUE4QjtNQUM5QyxRQUFRLEVBQUUsS0FBSztNQUNmLFlBQVksRUFBRSxDQUNaO1FBQ0UsTUFBTSxFQUFFLGFBQWE7UUFDckIsT0FBTyxFQUFFLElBQUk7UUFDYixNQUFNLEVBQUUsUUFBUTtRQUNoQixZQUFZLEVBQUUsSUFBSTtRQUNsQixNQUFNLEVBQUUsSUFBSTtRQUNaLGNBQWMsRUFBRSx5QkFBeUI7UUFDekMsUUFBUSxFQUFFLEtBQUs7UUFDZixZQUFZLEVBQUUsQ0FDWEQsRUFBRSxZQUNIO1VBQ0UsTUFBTSxFQUFFLGFBQWE7VUFDckIsT0FBTyxFQUFFLElBQUk7VUFDYixNQUFNLEVBQUUsWUFBWTtVQUNwQixNQUFNLEVBQUUsSUFBSTtVQUNaLFlBQVksRUFBRTtRQUNoQixDQUFDLEVBQ0Q7VUFDRSxNQUFNLEVBQUUsYUFBYTtVQUNyQixPQUFPLEVBQUUsSUFBSTtVQUNiLE1BQU0sRUFBRSxrQkFBa0I7VUFDMUIsTUFBTSxFQUFFLElBQUk7VUFDWixZQUFZLEVBQUU7UUFDaEIsQ0FBQyxFQUNEO1VBQ0UsTUFBTSxFQUFFLGFBQWE7VUFDckIsT0FBTyxFQUFFLElBQUk7VUFDYixNQUFNLEVBQUUsb0JBQW9CO1VBQzVCLE1BQU0sRUFBRSxJQUFJO1VBQ1osWUFBWSxFQUFFO1FBQ2hCLENBQUMsRUFDRDtVQUNFLE1BQU0sRUFBRSxhQUFhO1VBQ3JCLE9BQU8sRUFBRSxJQUFJO1VBQ2IsTUFBTSxFQUFFLFlBQVk7VUFDcEIsWUFBWSxFQUFFLElBQUk7VUFDbEIsTUFBTSxFQUFFLElBQUk7VUFDWixjQUFjLEVBQUUsTUFBTTtVQUN0QixRQUFRLEVBQUUsS0FBSztVQUNmLFlBQVksRUFBRSxDQUNYQSxFQUFFLFlBQ0g7WUFDRSxNQUFNLEVBQUUsYUFBYTtZQUNyQixPQUFPLEVBQUUsSUFBSTtZQUNiLE1BQU0sRUFBRSxPQUFPO1lBQ2YsTUFBTSxFQUFFLElBQUk7WUFDWixZQUFZLEVBQUU7VUFDaEIsQ0FBQztRQUVMLENBQUM7TUFFTCxDQUFDO0lBRUwsQ0FBQyxDQUNGO0VBQ0QsT0FBTztJQUNMLE1BQU0sRUFBRSxTQUFTO0lBQ2pCLFVBQVUsRUFBRTtNQUNWLE1BQU0sRUFBRSxVQUFVO01BQ2xCLE1BQU0sRUFBRSwrQkFBK0I7TUFDdkMsTUFBTSxFQUFFLFVBQVU7TUFDbEIsVUFBVSxFQUFFLElBQUk7TUFDaEIscUJBQXFCLEVBQUdELEVBQUUsVUFBVTtNQUNwQyxZQUFZLEVBQUdFLEVBQUU7SUFDbkIsQ0FBQzs7SUFDRCxXQUFXLEVBQUU7TUFDWCxNQUFNLEVBQUUsV0FBVztNQUNuQixNQUFNLEVBQUUsK0JBQStCO01BQ3ZDLHFCQUFxQixFQUFHRixFQUFFLFVBQVU7TUFDcEMsWUFBWSxFQUFHRSxFQUFFO0lBQ25CLENBQUM7O0lBQ0QsUUFBUSxFQUFFO01BQ1IsZUFBZSxFQUFFLFVBQVU7TUFDM0IsTUFBTSxFQUFFLCtCQUErQjtNQUN2QyxJQUFJLEVBQUUsSUFBSTtNQUNWLE1BQU0sRUFBRSxvU0FBb1M7TUFDNVMsVUFBVSxFQUFFLENBQUM7SUFDZjtFQUNGLENBQUM7QUFDRCxDQUFDLEVBQUc7QUFDSjtBQUNDSCxJQUFJLFdBQVdJLElBQUksR0FBRyxrQ0FBa0M7QUFDekRDLE1BQU0sQ0FBQ0MsT0FBTyxHQUFHTixJQUFJIn0=