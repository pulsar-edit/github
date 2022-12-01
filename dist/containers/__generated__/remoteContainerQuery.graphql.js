/**
 * @flow
 * @relayHash eb4ec1299526f32ae6a898eff261a301
 */

/* eslint-disable */
'use strict';
/*::
import type { ConcreteRequest } from 'relay-runtime';
export type remoteContainerQueryVariables = {|
  owner: string,
  name: string,
|};
export type remoteContainerQueryResponse = {|
  +repository: ?{|
    +id: string,
    +defaultBranchRef: ?{|
      +prefix: string,
      +name: string,
    |},
  |}
|};
export type remoteContainerQuery = {|
  variables: remoteContainerQueryVariables,
  response: remoteContainerQueryResponse,
|};
*/

/*
query remoteContainerQuery(
  $owner: String!
  $name: String!
) {
  repository(owner: $owner, name: $name) {
    id
    defaultBranchRef {
      prefix
      name
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
    "name": "owner",
    "type": "String!",
    "defaultValue": null
  }, {
    "kind": "LocalArgument",
    "name": "name",
    "type": "String!",
    "defaultValue": null
  }],
      v1 = [{
    "kind": "Variable",
    "name": "name",
    "variableName": "name"
  }, {
    "kind": "Variable",
    "name": "owner",
    "variableName": "owner"
  }],
      v2 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "id",
    "args": null,
    "storageKey": null
  },
      v3 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "prefix",
    "args": null,
    "storageKey": null
  },
      v4 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "name",
    "args": null,
    "storageKey": null
  };
  return {
    "kind": "Request",
    "fragment": {
      "kind": "Fragment",
      "name": "remoteContainerQuery",
      "type": "Query",
      "metadata": null,
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "repository",
        "storageKey": null,
        "args": v1
        /*: any*/
        ,
        "concreteType": "Repository",
        "plural": false,
        "selections": [v2
        /*: any*/
        , {
          "kind": "LinkedField",
          "alias": null,
          "name": "defaultBranchRef",
          "storageKey": null,
          "args": null,
          "concreteType": "Ref",
          "plural": false,
          "selections": [v3
          /*: any*/
          , v4
          /*: any*/
          ]
        }]
      }]
    },
    "operation": {
      "kind": "Operation",
      "name": "remoteContainerQuery",
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "repository",
        "storageKey": null,
        "args": v1
        /*: any*/
        ,
        "concreteType": "Repository",
        "plural": false,
        "selections": [v2
        /*: any*/
        , {
          "kind": "LinkedField",
          "alias": null,
          "name": "defaultBranchRef",
          "storageKey": null,
          "args": null,
          "concreteType": "Ref",
          "plural": false,
          "selections": [v3
          /*: any*/
          , v4
          /*: any*/
          , v2
          /*: any*/
          ]
        }]
      }]
    },
    "params": {
      "operationKind": "query",
      "name": "remoteContainerQuery",
      "id": null,
      "text": "query remoteContainerQuery(\n  $owner: String!\n  $name: String!\n) {\n  repository(owner: $owner, name: $name) {\n    id\n    defaultBranchRef {\n      prefix\n      name\n      id\n    }\n  }\n}\n",
      "metadata": {}
    }
  };
}(); // prettier-ignore


node
/*: any*/
.hash = 'b83aa6c27c5d7e1c499badf2e6bfab6b';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9jb250YWluZXJzL19fZ2VuZXJhdGVkX18vcmVtb3RlQ29udGFpbmVyUXVlcnkuZ3JhcGhxbC5qcyJdLCJuYW1lcyI6WyJub2RlIiwidjAiLCJ2MSIsInYyIiwidjMiLCJ2NCIsImhhc2giLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsTUFBTUE7QUFBSTtBQUFBLEVBQXlCLFlBQVU7QUFDN0MsTUFBSUMsRUFBRSxHQUFHLENBQ1A7QUFDRSxZQUFRLGVBRFY7QUFFRSxZQUFRLE9BRlY7QUFHRSxZQUFRLFNBSFY7QUFJRSxvQkFBZ0I7QUFKbEIsR0FETyxFQU9QO0FBQ0UsWUFBUSxlQURWO0FBRUUsWUFBUSxNQUZWO0FBR0UsWUFBUSxTQUhWO0FBSUUsb0JBQWdCO0FBSmxCLEdBUE8sQ0FBVDtBQUFBLE1BY0FDLEVBQUUsR0FBRyxDQUNIO0FBQ0UsWUFBUSxVQURWO0FBRUUsWUFBUSxNQUZWO0FBR0Usb0JBQWdCO0FBSGxCLEdBREcsRUFNSDtBQUNFLFlBQVEsVUFEVjtBQUVFLFlBQVEsT0FGVjtBQUdFLG9CQUFnQjtBQUhsQixHQU5HLENBZEw7QUFBQSxNQTBCQUMsRUFBRSxHQUFHO0FBQ0gsWUFBUSxhQURMO0FBRUgsYUFBUyxJQUZOO0FBR0gsWUFBUSxJQUhMO0FBSUgsWUFBUSxJQUpMO0FBS0gsa0JBQWM7QUFMWCxHQTFCTDtBQUFBLE1BaUNBQyxFQUFFLEdBQUc7QUFDSCxZQUFRLGFBREw7QUFFSCxhQUFTLElBRk47QUFHSCxZQUFRLFFBSEw7QUFJSCxZQUFRLElBSkw7QUFLSCxrQkFBYztBQUxYLEdBakNMO0FBQUEsTUF3Q0FDLEVBQUUsR0FBRztBQUNILFlBQVEsYUFETDtBQUVILGFBQVMsSUFGTjtBQUdILFlBQVEsTUFITDtBQUlILFlBQVEsSUFKTDtBQUtILGtCQUFjO0FBTFgsR0F4Q0w7QUErQ0EsU0FBTztBQUNMLFlBQVEsU0FESDtBQUVMLGdCQUFZO0FBQ1YsY0FBUSxVQURFO0FBRVYsY0FBUSxzQkFGRTtBQUdWLGNBQVEsT0FIRTtBQUlWLGtCQUFZLElBSkY7QUFLViw2QkFBd0JKO0FBQUU7QUFMaEI7QUFNVixvQkFBYyxDQUNaO0FBQ0UsZ0JBQVEsYUFEVjtBQUVFLGlCQUFTLElBRlg7QUFHRSxnQkFBUSxZQUhWO0FBSUUsc0JBQWMsSUFKaEI7QUFLRSxnQkFBU0M7QUFBRTtBQUxiO0FBTUUsd0JBQWdCLFlBTmxCO0FBT0Usa0JBQVUsS0FQWjtBQVFFLHNCQUFjLENBQ1hDO0FBQUU7QUFEUyxVQUVaO0FBQ0Usa0JBQVEsYUFEVjtBQUVFLG1CQUFTLElBRlg7QUFHRSxrQkFBUSxrQkFIVjtBQUlFLHdCQUFjLElBSmhCO0FBS0Usa0JBQVEsSUFMVjtBQU1FLDBCQUFnQixLQU5sQjtBQU9FLG9CQUFVLEtBUFo7QUFRRSx3QkFBYyxDQUNYQztBQUFFO0FBRFMsWUFFWEM7QUFBRTtBQUZTO0FBUmhCLFNBRlk7QUFSaEIsT0FEWTtBQU5KLEtBRlA7QUFvQ0wsaUJBQWE7QUFDWCxjQUFRLFdBREc7QUFFWCxjQUFRLHNCQUZHO0FBR1gsNkJBQXdCSjtBQUFFO0FBSGY7QUFJWCxvQkFBYyxDQUNaO0FBQ0UsZ0JBQVEsYUFEVjtBQUVFLGlCQUFTLElBRlg7QUFHRSxnQkFBUSxZQUhWO0FBSUUsc0JBQWMsSUFKaEI7QUFLRSxnQkFBU0M7QUFBRTtBQUxiO0FBTUUsd0JBQWdCLFlBTmxCO0FBT0Usa0JBQVUsS0FQWjtBQVFFLHNCQUFjLENBQ1hDO0FBQUU7QUFEUyxVQUVaO0FBQ0Usa0JBQVEsYUFEVjtBQUVFLG1CQUFTLElBRlg7QUFHRSxrQkFBUSxrQkFIVjtBQUlFLHdCQUFjLElBSmhCO0FBS0Usa0JBQVEsSUFMVjtBQU1FLDBCQUFnQixLQU5sQjtBQU9FLG9CQUFVLEtBUFo7QUFRRSx3QkFBYyxDQUNYQztBQUFFO0FBRFMsWUFFWEM7QUFBRTtBQUZTLFlBR1hGO0FBQUU7QUFIUztBQVJoQixTQUZZO0FBUmhCLE9BRFk7QUFKSCxLQXBDUjtBQXFFTCxjQUFVO0FBQ1IsdUJBQWlCLE9BRFQ7QUFFUixjQUFRLHNCQUZBO0FBR1IsWUFBTSxJQUhFO0FBSVIsY0FBUSx3TUFKQTtBQUtSLGtCQUFZO0FBTEo7QUFyRUwsR0FBUDtBQTZFQyxDQTdIaUMsRUFBbEMsQyxDQThIQTs7O0FBQ0NIO0FBQUk7QUFBTCxDQUFnQk0sSUFBaEIsR0FBdUIsa0NBQXZCO0FBQ0FDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQlIsSUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmbG93XG4gKiBAcmVsYXlIYXNoIGViNGVjMTI5OTUyNmYzMmFlNmE4OThlZmYyNjFhMzAxXG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKjo6XG5pbXBvcnQgdHlwZSB7IENvbmNyZXRlUmVxdWVzdCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xuZXhwb3J0IHR5cGUgcmVtb3RlQ29udGFpbmVyUXVlcnlWYXJpYWJsZXMgPSB7fFxuICBvd25lcjogc3RyaW5nLFxuICBuYW1lOiBzdHJpbmcsXG58fTtcbmV4cG9ydCB0eXBlIHJlbW90ZUNvbnRhaW5lclF1ZXJ5UmVzcG9uc2UgPSB7fFxuICArcmVwb3NpdG9yeTogP3t8XG4gICAgK2lkOiBzdHJpbmcsXG4gICAgK2RlZmF1bHRCcmFuY2hSZWY6ID97fFxuICAgICAgK3ByZWZpeDogc3RyaW5nLFxuICAgICAgK25hbWU6IHN0cmluZyxcbiAgICB8fSxcbiAgfH1cbnx9O1xuZXhwb3J0IHR5cGUgcmVtb3RlQ29udGFpbmVyUXVlcnkgPSB7fFxuICB2YXJpYWJsZXM6IHJlbW90ZUNvbnRhaW5lclF1ZXJ5VmFyaWFibGVzLFxuICByZXNwb25zZTogcmVtb3RlQ29udGFpbmVyUXVlcnlSZXNwb25zZSxcbnx9O1xuKi9cblxuXG4vKlxucXVlcnkgcmVtb3RlQ29udGFpbmVyUXVlcnkoXG4gICRvd25lcjogU3RyaW5nIVxuICAkbmFtZTogU3RyaW5nIVxuKSB7XG4gIHJlcG9zaXRvcnkob3duZXI6ICRvd25lciwgbmFtZTogJG5hbWUpIHtcbiAgICBpZFxuICAgIGRlZmF1bHRCcmFuY2hSZWYge1xuICAgICAgcHJlZml4XG4gICAgICBuYW1lXG4gICAgICBpZFxuICAgIH1cbiAgfVxufVxuKi9cblxuY29uc3Qgbm9kZS8qOiBDb25jcmV0ZVJlcXVlc3QqLyA9IChmdW5jdGlvbigpe1xudmFyIHYwID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgIFwibmFtZVwiOiBcIm93bmVyXCIsXG4gICAgXCJ0eXBlXCI6IFwiU3RyaW5nIVwiLFxuICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgfSxcbiAge1xuICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICBcIm5hbWVcIjogXCJuYW1lXCIsXG4gICAgXCJ0eXBlXCI6IFwiU3RyaW5nIVwiLFxuICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgfVxuXSxcbnYxID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICBcIm5hbWVcIjogXCJuYW1lXCIsXG4gICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJuYW1lXCJcbiAgfSxcbiAge1xuICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgXCJuYW1lXCI6IFwib3duZXJcIixcbiAgICBcInZhcmlhYmxlTmFtZVwiOiBcIm93bmVyXCJcbiAgfVxuXSxcbnYyID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcImlkXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnYzID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcInByZWZpeFwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52NCA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJuYW1lXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufTtcbnJldHVybiB7XG4gIFwia2luZFwiOiBcIlJlcXVlc3RcIixcbiAgXCJmcmFnbWVudFwiOiB7XG4gICAgXCJraW5kXCI6IFwiRnJhZ21lbnRcIixcbiAgICBcIm5hbWVcIjogXCJyZW1vdGVDb250YWluZXJRdWVyeVwiLFxuICAgIFwidHlwZVwiOiBcIlF1ZXJ5XCIsXG4gICAgXCJtZXRhZGF0YVwiOiBudWxsLFxuICAgIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiAodjAvKjogYW55Ki8pLFxuICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgXCJuYW1lXCI6IFwicmVwb3NpdG9yeVwiLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgXCJhcmdzXCI6ICh2MS8qOiBhbnkqLyksXG4gICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUmVwb3NpdG9yeVwiLFxuICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAodjIvKjogYW55Ki8pLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJkZWZhdWx0QnJhbmNoUmVmXCIsXG4gICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJSZWZcIixcbiAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgKHYzLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgKHY0Lyo6IGFueSovKVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAgXCJvcGVyYXRpb25cIjoge1xuICAgIFwia2luZFwiOiBcIk9wZXJhdGlvblwiLFxuICAgIFwibmFtZVwiOiBcInJlbW90ZUNvbnRhaW5lclF1ZXJ5XCIsXG4gICAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6ICh2MC8qOiBhbnkqLyksXG4gICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICBcIm5hbWVcIjogXCJyZXBvc2l0b3J5XCIsXG4gICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICBcImFyZ3NcIjogKHYxLyo6IGFueSovKSxcbiAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJSZXBvc2l0b3J5XCIsXG4gICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICh2Mi8qOiBhbnkqLyksXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImRlZmF1bHRCcmFuY2hSZWZcIixcbiAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlJlZlwiLFxuICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAodjMvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAodjQvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAodjIvKjogYW55Ki8pXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9LFxuICBcInBhcmFtc1wiOiB7XG4gICAgXCJvcGVyYXRpb25LaW5kXCI6IFwicXVlcnlcIixcbiAgICBcIm5hbWVcIjogXCJyZW1vdGVDb250YWluZXJRdWVyeVwiLFxuICAgIFwiaWRcIjogbnVsbCxcbiAgICBcInRleHRcIjogXCJxdWVyeSByZW1vdGVDb250YWluZXJRdWVyeShcXG4gICRvd25lcjogU3RyaW5nIVxcbiAgJG5hbWU6IFN0cmluZyFcXG4pIHtcXG4gIHJlcG9zaXRvcnkob3duZXI6ICRvd25lciwgbmFtZTogJG5hbWUpIHtcXG4gICAgaWRcXG4gICAgZGVmYXVsdEJyYW5jaFJlZiB7XFxuICAgICAgcHJlZml4XFxuICAgICAgbmFtZVxcbiAgICAgIGlkXFxuICAgIH1cXG4gIH1cXG59XFxuXCIsXG4gICAgXCJtZXRhZGF0YVwiOiB7fVxuICB9XG59O1xufSkoKTtcbi8vIHByZXR0aWVyLWlnbm9yZVxuKG5vZGUvKjogYW55Ki8pLmhhc2ggPSAnYjgzYWE2YzI3YzVkN2UxYzQ5OWJhZGYyZTZiZmFiNmInO1xubW9kdWxlLmV4cG9ydHMgPSBub2RlO1xuIl19