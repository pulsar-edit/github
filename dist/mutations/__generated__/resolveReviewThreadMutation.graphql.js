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

const node
/*: ConcreteRequest*/
= function () {
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
      "selections": [v1
      /*: any*/
      , {
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
        "selections": [v1
        /*: any*/
        , {
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
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": v2
      /*: any*/

    },
    "operation": {
      "kind": "Operation",
      "name": "resolveReviewThreadMutation",
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": v2
      /*: any*/

    },
    "params": {
      "operationKind": "mutation",
      "name": "resolveReviewThreadMutation",
      "id": null,
      "text": "mutation resolveReviewThreadMutation(\n  $input: ResolveReviewThreadInput!\n) {\n  resolveReviewThread(input: $input) {\n    thread {\n      id\n      isResolved\n      viewerCanResolve\n      viewerCanUnresolve\n      resolvedBy {\n        id\n        login\n      }\n    }\n  }\n}\n",
      "metadata": {}
    }
  };
}(); // prettier-ignore


node
/*: any*/
.hash = '6947ef6710d494dc52fba1a5b532cd76';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9tdXRhdGlvbnMvX19nZW5lcmF0ZWRfXy9yZXNvbHZlUmV2aWV3VGhyZWFkTXV0YXRpb24uZ3JhcGhxbC5qcyJdLCJuYW1lcyI6WyJub2RlIiwidjAiLCJ2MSIsInYyIiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsTUFBTUE7QUFBSTtBQUFBLEVBQXlCLFlBQVU7QUFDN0MsTUFBSUMsRUFBRSxHQUFHLENBQ1A7QUFDRSxZQUFRLGVBRFY7QUFFRSxZQUFRLE9BRlY7QUFHRSxZQUFRLDJCQUhWO0FBSUUsb0JBQWdCO0FBSmxCLEdBRE8sQ0FBVDtBQUFBLE1BUUFDLEVBQUUsR0FBRztBQUNILFlBQVEsYUFETDtBQUVILGFBQVMsSUFGTjtBQUdILFlBQVEsSUFITDtBQUlILFlBQVEsSUFKTDtBQUtILGtCQUFjO0FBTFgsR0FSTDtBQUFBLE1BZUFDLEVBQUUsR0FBRyxDQUNIO0FBQ0UsWUFBUSxhQURWO0FBRUUsYUFBUyxJQUZYO0FBR0UsWUFBUSxxQkFIVjtBQUlFLGtCQUFjLElBSmhCO0FBS0UsWUFBUSxDQUNOO0FBQ0UsY0FBUSxVQURWO0FBRUUsY0FBUSxPQUZWO0FBR0Usc0JBQWdCO0FBSGxCLEtBRE0sQ0FMVjtBQVlFLG9CQUFnQiw0QkFabEI7QUFhRSxjQUFVLEtBYlo7QUFjRSxrQkFBYyxDQUNaO0FBQ0UsY0FBUSxhQURWO0FBRUUsZUFBUyxJQUZYO0FBR0UsY0FBUSxRQUhWO0FBSUUsb0JBQWMsSUFKaEI7QUFLRSxjQUFRLElBTFY7QUFNRSxzQkFBZ0IseUJBTmxCO0FBT0UsZ0JBQVUsS0FQWjtBQVFFLG9CQUFjLENBQ1hEO0FBQUU7QUFEUyxRQUVaO0FBQ0UsZ0JBQVEsYUFEVjtBQUVFLGlCQUFTLElBRlg7QUFHRSxnQkFBUSxZQUhWO0FBSUUsZ0JBQVEsSUFKVjtBQUtFLHNCQUFjO0FBTGhCLE9BRlksRUFTWjtBQUNFLGdCQUFRLGFBRFY7QUFFRSxpQkFBUyxJQUZYO0FBR0UsZ0JBQVEsa0JBSFY7QUFJRSxnQkFBUSxJQUpWO0FBS0Usc0JBQWM7QUFMaEIsT0FUWSxFQWdCWjtBQUNFLGdCQUFRLGFBRFY7QUFFRSxpQkFBUyxJQUZYO0FBR0UsZ0JBQVEsb0JBSFY7QUFJRSxnQkFBUSxJQUpWO0FBS0Usc0JBQWM7QUFMaEIsT0FoQlksRUF1Qlo7QUFDRSxnQkFBUSxhQURWO0FBRUUsaUJBQVMsSUFGWDtBQUdFLGdCQUFRLFlBSFY7QUFJRSxzQkFBYyxJQUpoQjtBQUtFLGdCQUFRLElBTFY7QUFNRSx3QkFBZ0IsTUFObEI7QUFPRSxrQkFBVSxLQVBaO0FBUUUsc0JBQWMsQ0FDWEE7QUFBRTtBQURTLFVBRVo7QUFDRSxrQkFBUSxhQURWO0FBRUUsbUJBQVMsSUFGWDtBQUdFLGtCQUFRLE9BSFY7QUFJRSxrQkFBUSxJQUpWO0FBS0Usd0JBQWM7QUFMaEIsU0FGWTtBQVJoQixPQXZCWTtBQVJoQixLQURZO0FBZGhCLEdBREcsQ0FmTDtBQXNGQSxTQUFPO0FBQ0wsWUFBUSxTQURIO0FBRUwsZ0JBQVk7QUFDVixjQUFRLFVBREU7QUFFVixjQUFRLDZCQUZFO0FBR1YsY0FBUSxVQUhFO0FBSVYsa0JBQVksSUFKRjtBQUtWLDZCQUF3QkQ7QUFBRTtBQUxoQjtBQU1WLG9CQUFlRTtBQUFFOztBQU5QLEtBRlA7QUFVTCxpQkFBYTtBQUNYLGNBQVEsV0FERztBQUVYLGNBQVEsNkJBRkc7QUFHWCw2QkFBd0JGO0FBQUU7QUFIZjtBQUlYLG9CQUFlRTtBQUFFOztBQUpOLEtBVlI7QUFnQkwsY0FBVTtBQUNSLHVCQUFpQixVQURUO0FBRVIsY0FBUSw2QkFGQTtBQUdSLFlBQU0sSUFIRTtBQUlSLGNBQVEsOFJBSkE7QUFLUixrQkFBWTtBQUxKO0FBaEJMLEdBQVA7QUF3QkMsQ0EvR2lDLEVBQWxDLEMsQ0FnSEE7OztBQUNDSDtBQUFJO0FBQUwsQ0FBZ0JJLElBQWhCLEdBQXVCLGtDQUF2QjtBQUNBQyxNQUFNLENBQUNDLE9BQVAsR0FBaUJOLElBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmxvd1xuICogQHJlbGF5SGFzaCA3NTIwMDE5NWQ3NjM1NmJlNmQzMWE3MTE0M2RjZDZhOFxuICovXG5cbi8qIGVzbGludC1kaXNhYmxlICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyo6OlxuaW1wb3J0IHR5cGUgeyBDb25jcmV0ZVJlcXVlc3QgfSBmcm9tICdyZWxheS1ydW50aW1lJztcbmV4cG9ydCB0eXBlIFJlc29sdmVSZXZpZXdUaHJlYWRJbnB1dCA9IHt8XG4gIHRocmVhZElkOiBzdHJpbmcsXG4gIGNsaWVudE11dGF0aW9uSWQ/OiA/c3RyaW5nLFxufH07XG5leHBvcnQgdHlwZSByZXNvbHZlUmV2aWV3VGhyZWFkTXV0YXRpb25WYXJpYWJsZXMgPSB7fFxuICBpbnB1dDogUmVzb2x2ZVJldmlld1RocmVhZElucHV0XG58fTtcbmV4cG9ydCB0eXBlIHJlc29sdmVSZXZpZXdUaHJlYWRNdXRhdGlvblJlc3BvbnNlID0ge3xcbiAgK3Jlc29sdmVSZXZpZXdUaHJlYWQ6ID97fFxuICAgICt0aHJlYWQ6ID97fFxuICAgICAgK2lkOiBzdHJpbmcsXG4gICAgICAraXNSZXNvbHZlZDogYm9vbGVhbixcbiAgICAgICt2aWV3ZXJDYW5SZXNvbHZlOiBib29sZWFuLFxuICAgICAgK3ZpZXdlckNhblVucmVzb2x2ZTogYm9vbGVhbixcbiAgICAgICtyZXNvbHZlZEJ5OiA/e3xcbiAgICAgICAgK2lkOiBzdHJpbmcsXG4gICAgICAgICtsb2dpbjogc3RyaW5nLFxuICAgICAgfH0sXG4gICAgfH1cbiAgfH1cbnx9O1xuZXhwb3J0IHR5cGUgcmVzb2x2ZVJldmlld1RocmVhZE11dGF0aW9uID0ge3xcbiAgdmFyaWFibGVzOiByZXNvbHZlUmV2aWV3VGhyZWFkTXV0YXRpb25WYXJpYWJsZXMsXG4gIHJlc3BvbnNlOiByZXNvbHZlUmV2aWV3VGhyZWFkTXV0YXRpb25SZXNwb25zZSxcbnx9O1xuKi9cblxuXG4vKlxubXV0YXRpb24gcmVzb2x2ZVJldmlld1RocmVhZE11dGF0aW9uKFxuICAkaW5wdXQ6IFJlc29sdmVSZXZpZXdUaHJlYWRJbnB1dCFcbikge1xuICByZXNvbHZlUmV2aWV3VGhyZWFkKGlucHV0OiAkaW5wdXQpIHtcbiAgICB0aHJlYWQge1xuICAgICAgaWRcbiAgICAgIGlzUmVzb2x2ZWRcbiAgICAgIHZpZXdlckNhblJlc29sdmVcbiAgICAgIHZpZXdlckNhblVucmVzb2x2ZVxuICAgICAgcmVzb2x2ZWRCeSB7XG4gICAgICAgIGlkXG4gICAgICAgIGxvZ2luXG4gICAgICB9XG4gICAgfVxuICB9XG59XG4qL1xuXG5jb25zdCBub2RlLyo6IENvbmNyZXRlUmVxdWVzdCovID0gKGZ1bmN0aW9uKCl7XG52YXIgdjAgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwiaW5wdXRcIixcbiAgICBcInR5cGVcIjogXCJSZXNvbHZlUmV2aWV3VGhyZWFkSW5wdXQhXCIsXG4gICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICB9XG5dLFxudjEgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiaWRcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjIgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICBcIm5hbWVcIjogXCJyZXNvbHZlUmV2aWV3VGhyZWFkXCIsXG4gICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgXCJhcmdzXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICAgICAgXCJuYW1lXCI6IFwiaW5wdXRcIixcbiAgICAgICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJpbnB1dFwiXG4gICAgICB9XG4gICAgXSxcbiAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlJlc29sdmVSZXZpZXdUaHJlYWRQYXlsb2FkXCIsXG4gICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICBcIm5hbWVcIjogXCJ0aHJlYWRcIixcbiAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlB1bGxSZXF1ZXN0UmV2aWV3VGhyZWFkXCIsXG4gICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICh2MS8qOiBhbnkqLyksXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImlzUmVzb2x2ZWRcIixcbiAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJ2aWV3ZXJDYW5SZXNvbHZlXCIsXG4gICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwidmlld2VyQ2FuVW5yZXNvbHZlXCIsXG4gICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwicmVzb2x2ZWRCeVwiLFxuICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiVXNlclwiLFxuICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAodjEvKjogYW55Ki8pLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibG9naW5cIixcbiAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9XG5dO1xucmV0dXJuIHtcbiAgXCJraW5kXCI6IFwiUmVxdWVzdFwiLFxuICBcImZyYWdtZW50XCI6IHtcbiAgICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICAgIFwibmFtZVwiOiBcInJlc29sdmVSZXZpZXdUaHJlYWRNdXRhdGlvblwiLFxuICAgIFwidHlwZVwiOiBcIk11dGF0aW9uXCIsXG4gICAgXCJtZXRhZGF0YVwiOiBudWxsLFxuICAgIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiAodjAvKjogYW55Ki8pLFxuICAgIFwic2VsZWN0aW9uc1wiOiAodjIvKjogYW55Ki8pXG4gIH0sXG4gIFwib3BlcmF0aW9uXCI6IHtcbiAgICBcImtpbmRcIjogXCJPcGVyYXRpb25cIixcbiAgICBcIm5hbWVcIjogXCJyZXNvbHZlUmV2aWV3VGhyZWFkTXV0YXRpb25cIixcbiAgICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogKHYwLyo6IGFueSovKSxcbiAgICBcInNlbGVjdGlvbnNcIjogKHYyLyo6IGFueSovKVxuICB9LFxuICBcInBhcmFtc1wiOiB7XG4gICAgXCJvcGVyYXRpb25LaW5kXCI6IFwibXV0YXRpb25cIixcbiAgICBcIm5hbWVcIjogXCJyZXNvbHZlUmV2aWV3VGhyZWFkTXV0YXRpb25cIixcbiAgICBcImlkXCI6IG51bGwsXG4gICAgXCJ0ZXh0XCI6IFwibXV0YXRpb24gcmVzb2x2ZVJldmlld1RocmVhZE11dGF0aW9uKFxcbiAgJGlucHV0OiBSZXNvbHZlUmV2aWV3VGhyZWFkSW5wdXQhXFxuKSB7XFxuICByZXNvbHZlUmV2aWV3VGhyZWFkKGlucHV0OiAkaW5wdXQpIHtcXG4gICAgdGhyZWFkIHtcXG4gICAgICBpZFxcbiAgICAgIGlzUmVzb2x2ZWRcXG4gICAgICB2aWV3ZXJDYW5SZXNvbHZlXFxuICAgICAgdmlld2VyQ2FuVW5yZXNvbHZlXFxuICAgICAgcmVzb2x2ZWRCeSB7XFxuICAgICAgICBpZFxcbiAgICAgICAgbG9naW5cXG4gICAgICB9XFxuICAgIH1cXG4gIH1cXG59XFxuXCIsXG4gICAgXCJtZXRhZGF0YVwiOiB7fVxuICB9XG59O1xufSkoKTtcbi8vIHByZXR0aWVyLWlnbm9yZVxuKG5vZGUvKjogYW55Ki8pLmhhc2ggPSAnNjk0N2VmNjcxMGQ0OTRkYzUyZmJhMWE1YjUzMmNkNzYnO1xubW9kdWxlLmV4cG9ydHMgPSBub2RlO1xuIl19