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
const node /*: ConcreteRequest*/ = function () {
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
      "argumentDefinitions": v0 /*: any*/,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "repository",
        "storageKey": null,
        "args": v1 /*: any*/,
        "concreteType": "Repository",
        "plural": false,
        "selections": [v2 /*: any*/, {
          "kind": "LinkedField",
          "alias": null,
          "name": "defaultBranchRef",
          "storageKey": null,
          "args": null,
          "concreteType": "Ref",
          "plural": false,
          "selections": [v3 /*: any*/, v4 /*: any*/]
        }]
      }]
    },
    "operation": {
      "kind": "Operation",
      "name": "remoteContainerQuery",
      "argumentDefinitions": v0 /*: any*/,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "repository",
        "storageKey": null,
        "args": v1 /*: any*/,
        "concreteType": "Repository",
        "plural": false,
        "selections": [v2 /*: any*/, {
          "kind": "LinkedField",
          "alias": null,
          "name": "defaultBranchRef",
          "storageKey": null,
          "args": null,
          "concreteType": "Ref",
          "plural": false,
          "selections": [v3 /*: any*/, v4 /*: any*/, v2 /*: any*/]
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
}();
// prettier-ignore
node /*: any*/.hash = 'b83aa6c27c5d7e1c499badf2e6bfab6b';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJub2RlIiwidjAiLCJ2MSIsInYyIiwidjMiLCJ2NCIsImhhc2giLCJtb2R1bGUiLCJleHBvcnRzIl0sInNvdXJjZXMiOlsicmVtb3RlQ29udGFpbmVyUXVlcnkuZ3JhcGhxbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmbG93XG4gKiBAcmVsYXlIYXNoIGViNGVjMTI5OTUyNmYzMmFlNmE4OThlZmYyNjFhMzAxXG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKjo6XG5pbXBvcnQgdHlwZSB7IENvbmNyZXRlUmVxdWVzdCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xuZXhwb3J0IHR5cGUgcmVtb3RlQ29udGFpbmVyUXVlcnlWYXJpYWJsZXMgPSB7fFxuICBvd25lcjogc3RyaW5nLFxuICBuYW1lOiBzdHJpbmcsXG58fTtcbmV4cG9ydCB0eXBlIHJlbW90ZUNvbnRhaW5lclF1ZXJ5UmVzcG9uc2UgPSB7fFxuICArcmVwb3NpdG9yeTogP3t8XG4gICAgK2lkOiBzdHJpbmcsXG4gICAgK2RlZmF1bHRCcmFuY2hSZWY6ID97fFxuICAgICAgK3ByZWZpeDogc3RyaW5nLFxuICAgICAgK25hbWU6IHN0cmluZyxcbiAgICB8fSxcbiAgfH1cbnx9O1xuZXhwb3J0IHR5cGUgcmVtb3RlQ29udGFpbmVyUXVlcnkgPSB7fFxuICB2YXJpYWJsZXM6IHJlbW90ZUNvbnRhaW5lclF1ZXJ5VmFyaWFibGVzLFxuICByZXNwb25zZTogcmVtb3RlQ29udGFpbmVyUXVlcnlSZXNwb25zZSxcbnx9O1xuKi9cblxuXG4vKlxucXVlcnkgcmVtb3RlQ29udGFpbmVyUXVlcnkoXG4gICRvd25lcjogU3RyaW5nIVxuICAkbmFtZTogU3RyaW5nIVxuKSB7XG4gIHJlcG9zaXRvcnkob3duZXI6ICRvd25lciwgbmFtZTogJG5hbWUpIHtcbiAgICBpZFxuICAgIGRlZmF1bHRCcmFuY2hSZWYge1xuICAgICAgcHJlZml4XG4gICAgICBuYW1lXG4gICAgICBpZFxuICAgIH1cbiAgfVxufVxuKi9cblxuY29uc3Qgbm9kZS8qOiBDb25jcmV0ZVJlcXVlc3QqLyA9IChmdW5jdGlvbigpe1xudmFyIHYwID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgIFwibmFtZVwiOiBcIm93bmVyXCIsXG4gICAgXCJ0eXBlXCI6IFwiU3RyaW5nIVwiLFxuICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgfSxcbiAge1xuICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICBcIm5hbWVcIjogXCJuYW1lXCIsXG4gICAgXCJ0eXBlXCI6IFwiU3RyaW5nIVwiLFxuICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgfVxuXSxcbnYxID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICBcIm5hbWVcIjogXCJuYW1lXCIsXG4gICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJuYW1lXCJcbiAgfSxcbiAge1xuICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgXCJuYW1lXCI6IFwib3duZXJcIixcbiAgICBcInZhcmlhYmxlTmFtZVwiOiBcIm93bmVyXCJcbiAgfVxuXSxcbnYyID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcImlkXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnYzID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcInByZWZpeFwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52NCA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJuYW1lXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufTtcbnJldHVybiB7XG4gIFwia2luZFwiOiBcIlJlcXVlc3RcIixcbiAgXCJmcmFnbWVudFwiOiB7XG4gICAgXCJraW5kXCI6IFwiRnJhZ21lbnRcIixcbiAgICBcIm5hbWVcIjogXCJyZW1vdGVDb250YWluZXJRdWVyeVwiLFxuICAgIFwidHlwZVwiOiBcIlF1ZXJ5XCIsXG4gICAgXCJtZXRhZGF0YVwiOiBudWxsLFxuICAgIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiAodjAvKjogYW55Ki8pLFxuICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgXCJuYW1lXCI6IFwicmVwb3NpdG9yeVwiLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgXCJhcmdzXCI6ICh2MS8qOiBhbnkqLyksXG4gICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUmVwb3NpdG9yeVwiLFxuICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAodjIvKjogYW55Ki8pLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJkZWZhdWx0QnJhbmNoUmVmXCIsXG4gICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJSZWZcIixcbiAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgKHYzLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgKHY0Lyo6IGFueSovKVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAgXCJvcGVyYXRpb25cIjoge1xuICAgIFwia2luZFwiOiBcIk9wZXJhdGlvblwiLFxuICAgIFwibmFtZVwiOiBcInJlbW90ZUNvbnRhaW5lclF1ZXJ5XCIsXG4gICAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6ICh2MC8qOiBhbnkqLyksXG4gICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICBcIm5hbWVcIjogXCJyZXBvc2l0b3J5XCIsXG4gICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICBcImFyZ3NcIjogKHYxLyo6IGFueSovKSxcbiAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJSZXBvc2l0b3J5XCIsXG4gICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICh2Mi8qOiBhbnkqLyksXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImRlZmF1bHRCcmFuY2hSZWZcIixcbiAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlJlZlwiLFxuICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAodjMvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAodjQvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAodjIvKjogYW55Ki8pXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9LFxuICBcInBhcmFtc1wiOiB7XG4gICAgXCJvcGVyYXRpb25LaW5kXCI6IFwicXVlcnlcIixcbiAgICBcIm5hbWVcIjogXCJyZW1vdGVDb250YWluZXJRdWVyeVwiLFxuICAgIFwiaWRcIjogbnVsbCxcbiAgICBcInRleHRcIjogXCJxdWVyeSByZW1vdGVDb250YWluZXJRdWVyeShcXG4gICRvd25lcjogU3RyaW5nIVxcbiAgJG5hbWU6IFN0cmluZyFcXG4pIHtcXG4gIHJlcG9zaXRvcnkob3duZXI6ICRvd25lciwgbmFtZTogJG5hbWUpIHtcXG4gICAgaWRcXG4gICAgZGVmYXVsdEJyYW5jaFJlZiB7XFxuICAgICAgcHJlZml4XFxuICAgICAgbmFtZVxcbiAgICAgIGlkXFxuICAgIH1cXG4gIH1cXG59XFxuXCIsXG4gICAgXCJtZXRhZGF0YVwiOiB7fVxuICB9XG59O1xufSkoKTtcbi8vIHByZXR0aWVyLWlnbm9yZVxuKG5vZGUvKjogYW55Ki8pLmhhc2ggPSAnYjgzYWE2YzI3YzVkN2UxYzQ5OWJhZGYyZTZiZmFiNmInO1xubW9kdWxlLmV4cG9ydHMgPSBub2RlO1xuIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxZQUFZOztBQUVaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUEsTUFBTUEsSUFBSSx5QkFBeUIsWUFBVTtFQUM3QyxJQUFJQyxFQUFFLEdBQUcsQ0FDUDtNQUNFLE1BQU0sRUFBRSxlQUFlO01BQ3ZCLE1BQU0sRUFBRSxP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