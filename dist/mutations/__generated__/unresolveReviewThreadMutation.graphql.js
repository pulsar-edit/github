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

const node
/*: ConcreteRequest*/
= function () {
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
      "name": "unresolveReviewThreadMutation",
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
      "name": "unresolveReviewThreadMutation",
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": v2
      /*: any*/

    },
    "params": {
      "operationKind": "mutation",
      "name": "unresolveReviewThreadMutation",
      "id": null,
      "text": "mutation unresolveReviewThreadMutation(\n  $input: UnresolveReviewThreadInput!\n) {\n  unresolveReviewThread(input: $input) {\n    thread {\n      id\n      isResolved\n      viewerCanResolve\n      viewerCanUnresolve\n      resolvedBy {\n        id\n        login\n      }\n    }\n  }\n}\n",
      "metadata": {}
    }
  };
}(); // prettier-ignore


node
/*: any*/
.hash = '8b1105e1a3db0455c522c7e5dc69b436';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9tdXRhdGlvbnMvX19nZW5lcmF0ZWRfXy91bnJlc29sdmVSZXZpZXdUaHJlYWRNdXRhdGlvbi5ncmFwaHFsLmpzIl0sIm5hbWVzIjpbIm5vZGUiLCJ2MCIsInYxIiwidjIiLCJoYXNoIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxNQUFNQTtBQUFJO0FBQUEsRUFBeUIsWUFBVTtBQUM3QyxNQUFJQyxFQUFFLEdBQUcsQ0FDUDtBQUNFLFlBQVEsZUFEVjtBQUVFLFlBQVEsT0FGVjtBQUdFLFlBQVEsNkJBSFY7QUFJRSxvQkFBZ0I7QUFKbEIsR0FETyxDQUFUO0FBQUEsTUFRQUMsRUFBRSxHQUFHO0FBQ0gsWUFBUSxhQURMO0FBRUgsYUFBUyxJQUZOO0FBR0gsWUFBUSxJQUhMO0FBSUgsWUFBUSxJQUpMO0FBS0gsa0JBQWM7QUFMWCxHQVJMO0FBQUEsTUFlQUMsRUFBRSxHQUFHLENBQ0g7QUFDRSxZQUFRLGFBRFY7QUFFRSxhQUFTLElBRlg7QUFHRSxZQUFRLHVCQUhWO0FBSUUsa0JBQWMsSUFKaEI7QUFLRSxZQUFRLENBQ047QUFDRSxjQUFRLFVBRFY7QUFFRSxjQUFRLE9BRlY7QUFHRSxzQkFBZ0I7QUFIbEIsS0FETSxDQUxWO0FBWUUsb0JBQWdCLDhCQVpsQjtBQWFFLGNBQVUsS0FiWjtBQWNFLGtCQUFjLENBQ1o7QUFDRSxjQUFRLGFBRFY7QUFFRSxlQUFTLElBRlg7QUFHRSxjQUFRLFFBSFY7QUFJRSxvQkFBYyxJQUpoQjtBQUtFLGNBQVEsSUFMVjtBQU1FLHNCQUFnQix5QkFObEI7QUFPRSxnQkFBVSxLQVBaO0FBUUUsb0JBQWMsQ0FDWEQ7QUFBRTtBQURTLFFBRVo7QUFDRSxnQkFBUSxhQURWO0FBRUUsaUJBQVMsSUFGWDtBQUdFLGdCQUFRLFlBSFY7QUFJRSxnQkFBUSxJQUpWO0FBS0Usc0JBQWM7QUFMaEIsT0FGWSxFQVNaO0FBQ0UsZ0JBQVEsYUFEVjtBQUVFLGlCQUFTLElBRlg7QUFHRSxnQkFBUSxrQkFIVjtBQUlFLGdCQUFRLElBSlY7QUFLRSxzQkFBYztBQUxoQixPQVRZLEVBZ0JaO0FBQ0UsZ0JBQVEsYUFEVjtBQUVFLGlCQUFTLElBRlg7QUFHRSxnQkFBUSxvQkFIVjtBQUlFLGdCQUFRLElBSlY7QUFLRSxzQkFBYztBQUxoQixPQWhCWSxFQXVCWjtBQUNFLGdCQUFRLGFBRFY7QUFFRSxpQkFBUyxJQUZYO0FBR0UsZ0JBQVEsWUFIVjtBQUlFLHNCQUFjLElBSmhCO0FBS0UsZ0JBQVEsSUFMVjtBQU1FLHdCQUFnQixNQU5sQjtBQU9FLGtCQUFVLEtBUFo7QUFRRSxzQkFBYyxDQUNYQTtBQUFFO0FBRFMsVUFFWjtBQUNFLGtCQUFRLGFBRFY7QUFFRSxtQkFBUyxJQUZYO0FBR0Usa0JBQVEsT0FIVjtBQUlFLGtCQUFRLElBSlY7QUFLRSx3QkFBYztBQUxoQixTQUZZO0FBUmhCLE9BdkJZO0FBUmhCLEtBRFk7QUFkaEIsR0FERyxDQWZMO0FBc0ZBLFNBQU87QUFDTCxZQUFRLFNBREg7QUFFTCxnQkFBWTtBQUNWLGNBQVEsVUFERTtBQUVWLGNBQVEsK0JBRkU7QUFHVixjQUFRLFVBSEU7QUFJVixrQkFBWSxJQUpGO0FBS1YsNkJBQXdCRDtBQUFFO0FBTGhCO0FBTVYsb0JBQWVFO0FBQUU7O0FBTlAsS0FGUDtBQVVMLGlCQUFhO0FBQ1gsY0FBUSxXQURHO0FBRVgsY0FBUSwrQkFGRztBQUdYLDZCQUF3QkY7QUFBRTtBQUhmO0FBSVgsb0JBQWVFO0FBQUU7O0FBSk4sS0FWUjtBQWdCTCxjQUFVO0FBQ1IsdUJBQWlCLFVBRFQ7QUFFUixjQUFRLCtCQUZBO0FBR1IsWUFBTSxJQUhFO0FBSVIsY0FBUSxvU0FKQTtBQUtSLGtCQUFZO0FBTEo7QUFoQkwsR0FBUDtBQXdCQyxDQS9HaUMsRUFBbEMsQyxDQWdIQTs7O0FBQ0NIO0FBQUk7QUFBTCxDQUFnQkksSUFBaEIsR0FBdUIsa0NBQXZCO0FBQ0FDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQk4sSUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmbG93XG4gKiBAcmVsYXlIYXNoIDdiOTk0YWI3NWFlYWE3MTQ1ZGM4YWIxZGFmMGJmNWI5XG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKjo6XG5pbXBvcnQgdHlwZSB7IENvbmNyZXRlUmVxdWVzdCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xuZXhwb3J0IHR5cGUgVW5yZXNvbHZlUmV2aWV3VGhyZWFkSW5wdXQgPSB7fFxuICB0aHJlYWRJZDogc3RyaW5nLFxuICBjbGllbnRNdXRhdGlvbklkPzogP3N0cmluZyxcbnx9O1xuZXhwb3J0IHR5cGUgdW5yZXNvbHZlUmV2aWV3VGhyZWFkTXV0YXRpb25WYXJpYWJsZXMgPSB7fFxuICBpbnB1dDogVW5yZXNvbHZlUmV2aWV3VGhyZWFkSW5wdXRcbnx9O1xuZXhwb3J0IHR5cGUgdW5yZXNvbHZlUmV2aWV3VGhyZWFkTXV0YXRpb25SZXNwb25zZSA9IHt8XG4gICt1bnJlc29sdmVSZXZpZXdUaHJlYWQ6ID97fFxuICAgICt0aHJlYWQ6ID97fFxuICAgICAgK2lkOiBzdHJpbmcsXG4gICAgICAraXNSZXNvbHZlZDogYm9vbGVhbixcbiAgICAgICt2aWV3ZXJDYW5SZXNvbHZlOiBib29sZWFuLFxuICAgICAgK3ZpZXdlckNhblVucmVzb2x2ZTogYm9vbGVhbixcbiAgICAgICtyZXNvbHZlZEJ5OiA/e3xcbiAgICAgICAgK2lkOiBzdHJpbmcsXG4gICAgICAgICtsb2dpbjogc3RyaW5nLFxuICAgICAgfH0sXG4gICAgfH1cbiAgfH1cbnx9O1xuZXhwb3J0IHR5cGUgdW5yZXNvbHZlUmV2aWV3VGhyZWFkTXV0YXRpb24gPSB7fFxuICB2YXJpYWJsZXM6IHVucmVzb2x2ZVJldmlld1RocmVhZE11dGF0aW9uVmFyaWFibGVzLFxuICByZXNwb25zZTogdW5yZXNvbHZlUmV2aWV3VGhyZWFkTXV0YXRpb25SZXNwb25zZSxcbnx9O1xuKi9cblxuXG4vKlxubXV0YXRpb24gdW5yZXNvbHZlUmV2aWV3VGhyZWFkTXV0YXRpb24oXG4gICRpbnB1dDogVW5yZXNvbHZlUmV2aWV3VGhyZWFkSW5wdXQhXG4pIHtcbiAgdW5yZXNvbHZlUmV2aWV3VGhyZWFkKGlucHV0OiAkaW5wdXQpIHtcbiAgICB0aHJlYWQge1xuICAgICAgaWRcbiAgICAgIGlzUmVzb2x2ZWRcbiAgICAgIHZpZXdlckNhblJlc29sdmVcbiAgICAgIHZpZXdlckNhblVucmVzb2x2ZVxuICAgICAgcmVzb2x2ZWRCeSB7XG4gICAgICAgIGlkXG4gICAgICAgIGxvZ2luXG4gICAgICB9XG4gICAgfVxuICB9XG59XG4qL1xuXG5jb25zdCBub2RlLyo6IENvbmNyZXRlUmVxdWVzdCovID0gKGZ1bmN0aW9uKCl7XG52YXIgdjAgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwiaW5wdXRcIixcbiAgICBcInR5cGVcIjogXCJVbnJlc29sdmVSZXZpZXdUaHJlYWRJbnB1dCFcIixcbiAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gIH1cbl0sXG52MSA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJpZFwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52MiA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgXCJhbGlhc1wiOiBudWxsLFxuICAgIFwibmFtZVwiOiBcInVucmVzb2x2ZVJldmlld1RocmVhZFwiLFxuICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgIFwiYXJnc1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgICAgIFwibmFtZVwiOiBcImlucHV0XCIsXG4gICAgICAgIFwidmFyaWFibGVOYW1lXCI6IFwiaW5wdXRcIlxuICAgICAgfVxuICAgIF0sXG4gICAgXCJjb25jcmV0ZVR5cGVcIjogXCJVbnJlc29sdmVSZXZpZXdUaHJlYWRQYXlsb2FkXCIsXG4gICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICBcIm5hbWVcIjogXCJ0aHJlYWRcIixcbiAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlB1bGxSZXF1ZXN0UmV2aWV3VGhyZWFkXCIsXG4gICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICh2MS8qOiBhbnkqLyksXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImlzUmVzb2x2ZWRcIixcbiAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJ2aWV3ZXJDYW5SZXNvbHZlXCIsXG4gICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwidmlld2VyQ2FuVW5yZXNvbHZlXCIsXG4gICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwicmVzb2x2ZWRCeVwiLFxuICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiVXNlclwiLFxuICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAodjEvKjogYW55Ki8pLFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibG9naW5cIixcbiAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9XG5dO1xucmV0dXJuIHtcbiAgXCJraW5kXCI6IFwiUmVxdWVzdFwiLFxuICBcImZyYWdtZW50XCI6IHtcbiAgICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICAgIFwibmFtZVwiOiBcInVucmVzb2x2ZVJldmlld1RocmVhZE11dGF0aW9uXCIsXG4gICAgXCJ0eXBlXCI6IFwiTXV0YXRpb25cIixcbiAgICBcIm1ldGFkYXRhXCI6IG51bGwsXG4gICAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6ICh2MC8qOiBhbnkqLyksXG4gICAgXCJzZWxlY3Rpb25zXCI6ICh2Mi8qOiBhbnkqLylcbiAgfSxcbiAgXCJvcGVyYXRpb25cIjoge1xuICAgIFwia2luZFwiOiBcIk9wZXJhdGlvblwiLFxuICAgIFwibmFtZVwiOiBcInVucmVzb2x2ZVJldmlld1RocmVhZE11dGF0aW9uXCIsXG4gICAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6ICh2MC8qOiBhbnkqLyksXG4gICAgXCJzZWxlY3Rpb25zXCI6ICh2Mi8qOiBhbnkqLylcbiAgfSxcbiAgXCJwYXJhbXNcIjoge1xuICAgIFwib3BlcmF0aW9uS2luZFwiOiBcIm11dGF0aW9uXCIsXG4gICAgXCJuYW1lXCI6IFwidW5yZXNvbHZlUmV2aWV3VGhyZWFkTXV0YXRpb25cIixcbiAgICBcImlkXCI6IG51bGwsXG4gICAgXCJ0ZXh0XCI6IFwibXV0YXRpb24gdW5yZXNvbHZlUmV2aWV3VGhyZWFkTXV0YXRpb24oXFxuICAkaW5wdXQ6IFVucmVzb2x2ZVJldmlld1RocmVhZElucHV0IVxcbikge1xcbiAgdW5yZXNvbHZlUmV2aWV3VGhyZWFkKGlucHV0OiAkaW5wdXQpIHtcXG4gICAgdGhyZWFkIHtcXG4gICAgICBpZFxcbiAgICAgIGlzUmVzb2x2ZWRcXG4gICAgICB2aWV3ZXJDYW5SZXNvbHZlXFxuICAgICAgdmlld2VyQ2FuVW5yZXNvbHZlXFxuICAgICAgcmVzb2x2ZWRCeSB7XFxuICAgICAgICBpZFxcbiAgICAgICAgbG9naW5cXG4gICAgICB9XFxuICAgIH1cXG4gIH1cXG59XFxuXCIsXG4gICAgXCJtZXRhZGF0YVwiOiB7fVxuICB9XG59O1xufSkoKTtcbi8vIHByZXR0aWVyLWlnbm9yZVxuKG5vZGUvKjogYW55Ki8pLmhhc2ggPSAnOGIxMTA1ZTFhM2RiMDQ1NWM1MjJjN2U1ZGM2OWI0MzYnO1xubW9kdWxlLmV4cG9ydHMgPSBub2RlO1xuIl19