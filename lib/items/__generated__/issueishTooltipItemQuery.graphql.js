/**
 * @flow
 * @relayHash f4ea156db8d2e5b7488028bf9c4607dd
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type issueishTooltipContainer_resource$ref = any;
export type issueishTooltipItemQueryVariables = {|
  issueishUrl: any
|};
export type issueishTooltipItemQueryResponse = {|
  +resource: ?{|
    +$fragmentRefs: issueishTooltipContainer_resource$ref
  |}
|};
export type issueishTooltipItemQuery = {|
  variables: issueishTooltipItemQueryVariables,
  response: issueishTooltipItemQueryResponse,
|};
*/

/*
query issueishTooltipItemQuery(
  $issueishUrl: URI!
) {
  resource(url: $issueishUrl) {
    __typename
    ...issueishTooltipContainer_resource
    ... on Node {
      id
    }
  }
}

fragment issueishTooltipContainer_resource on UniformResourceLocatable {
  __typename
  ... on Issue {
    state
    number
    title
    repository {
      name
      owner {
        __typename
        login
        id
      }
      id
    }
    author {
      __typename
      login
      avatarUrl
      ... on Node {
        id
      }
    }
  }
  ... on PullRequest {
    state
    number
    title
    repository {
      name
      owner {
        __typename
        login
        id
      }
      id
    }
    author {
      __typename
      login
      avatarUrl
      ... on Node {
        id
      }
    }
  }
}
*/
const node /*: ConcreteRequest*/ = function () {
  var v0 = [{
      "kind": "LocalArgument",
      "name": "issueishUrl",
      "type": "URI!",
      "defaultValue": null
    }],
    v1 = [{
      "kind": "Variable",
      "name": "url",
      "variableName": "issueishUrl"
    }],
    v2 = {
      "kind": "ScalarField",
      "alias": null,
      "name": "__typename",
      "args": null,
      "storageKey": null
    },
    v3 = {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    },
    v4 = {
      "kind": "ScalarField",
      "alias": null,
      "name": "login",
      "args": null,
      "storageKey": null
    },
    v5 = [{
      "kind": "ScalarField",
      "alias": null,
      "name": "state",
      "args": null,
      "storageKey": null
    }, {
      "kind": "ScalarField",
      "alias": null,
      "name": "number",
      "args": null,
      "storageKey": null
    }, {
      "kind": "ScalarField",
      "alias": null,
      "name": "title",
      "args": null,
      "storageKey": null
    }, {
      "kind": "LinkedField",
      "alias": null,
      "name": "repository",
      "storageKey": null,
      "args": null,
      "concreteType": "Repository",
      "plural": false,
      "selections": [{
        "kind": "ScalarField",
        "alias": null,
        "name": "name",
        "args": null,
        "storageKey": null
      }, {
        "kind": "LinkedField",
        "alias": null,
        "name": "owner",
        "storageKey": null,
        "args": null,
        "concreteType": null,
        "plural": false,
        "selections": [v2 /*: any*/, v4 /*: any*/, v3 /*: any*/]
      }, v3 /*: any*/]
    }, {
      "kind": "LinkedField",
      "alias": null,
      "name": "author",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": false,
      "selections": [v2 /*: any*/, v4 /*: any*/, {
        "kind": "ScalarField",
        "alias": null,
        "name": "avatarUrl",
        "args": null,
        "storageKey": null
      }, v3 /*: any*/]
    }];

  return {
    "kind": "Request",
    "fragment": {
      "kind": "Fragment",
      "name": "issueishTooltipItemQuery",
      "type": "Query",
      "metadata": null,
      "argumentDefinitions": v0 /*: any*/,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "resource",
        "storageKey": null,
        "args": v1 /*: any*/,
        "concreteType": null,
        "plural": false,
        "selections": [{
          "kind": "FragmentSpread",
          "name": "issueishTooltipContainer_resource",
          "args": null
        }]
      }]
    },
    "operation": {
      "kind": "Operation",
      "name": "issueishTooltipItemQuery",
      "argumentDefinitions": v0 /*: any*/,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "resource",
        "storageKey": null,
        "args": v1 /*: any*/,
        "concreteType": null,
        "plural": false,
        "selections": [v2 /*: any*/, v3 /*: any*/, {
          "kind": "InlineFragment",
          "type": "Issue",
          "selections": v5 /*: any*/
        }, {
          "kind": "InlineFragment",
          "type": "PullRequest",
          "selections": v5 /*: any*/
        }]
      }]
    },

    "params": {
      "operationKind": "query",
      "name": "issueishTooltipItemQuery",
      "id": null,
      "text": "query issueishTooltipItemQuery(\n  $issueishUrl: URI!\n) {\n  resource(url: $issueishUrl) {\n    __typename\n    ...issueishTooltipContainer_resource\n    ... on Node {\n      id\n    }\n  }\n}\n\nfragment issueishTooltipContainer_resource on UniformResourceLocatable {\n  __typename\n  ... on Issue {\n    state\n    number\n    title\n    repository {\n      name\n      owner {\n        __typename\n        login\n        id\n      }\n      id\n    }\n    author {\n      __typename\n      login\n      avatarUrl\n      ... on Node {\n        id\n      }\n    }\n  }\n  ... on PullRequest {\n    state\n    number\n    title\n    repository {\n      name\n      owner {\n        __typename\n        login\n        id\n      }\n      id\n    }\n    author {\n      __typename\n      login\n      avatarUrl\n      ... on Node {\n        id\n      }\n    }\n  }\n}\n",
      "metadata": {}
    }
  };
}();
// prettier-ignore
node /*: any*/.hash = '8e6b32b5cdcdd3debccc7adaa2b4e82c';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJub2RlIiwidjAiLCJ2MSIsInYyIiwidjMiLCJ2NCIsInY1IiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwic291cmNlcyI6WyJpc3N1ZWlzaFRvb2x0aXBJdGVtUXVlcnkuZ3JhcGhxbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmbG93XG4gKiBAcmVsYXlIYXNoIGY0ZWExNTZkYjhkMmU1Yjc0ODgwMjhiZjljNDYwN2RkXG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKjo6XG5pbXBvcnQgdHlwZSB7IENvbmNyZXRlUmVxdWVzdCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xudHlwZSBpc3N1ZWlzaFRvb2x0aXBDb250YWluZXJfcmVzb3VyY2UkcmVmID0gYW55O1xuZXhwb3J0IHR5cGUgaXNzdWVpc2hUb29sdGlwSXRlbVF1ZXJ5VmFyaWFibGVzID0ge3xcbiAgaXNzdWVpc2hVcmw6IGFueVxufH07XG5leHBvcnQgdHlwZSBpc3N1ZWlzaFRvb2x0aXBJdGVtUXVlcnlSZXNwb25zZSA9IHt8XG4gICtyZXNvdXJjZTogP3t8XG4gICAgKyRmcmFnbWVudFJlZnM6IGlzc3VlaXNoVG9vbHRpcENvbnRhaW5lcl9yZXNvdXJjZSRyZWZcbiAgfH1cbnx9O1xuZXhwb3J0IHR5cGUgaXNzdWVpc2hUb29sdGlwSXRlbVF1ZXJ5ID0ge3xcbiAgdmFyaWFibGVzOiBpc3N1ZWlzaFRvb2x0aXBJdGVtUXVlcnlWYXJpYWJsZXMsXG4gIHJlc3BvbnNlOiBpc3N1ZWlzaFRvb2x0aXBJdGVtUXVlcnlSZXNwb25zZSxcbnx9O1xuKi9cblxuXG4vKlxucXVlcnkgaXNzdWVpc2hUb29sdGlwSXRlbVF1ZXJ5KFxuICAkaXNzdWVpc2hVcmw6IFVSSSFcbikge1xuICByZXNvdXJjZSh1cmw6ICRpc3N1ZWlzaFVybCkge1xuICAgIF9fdHlwZW5hbWVcbiAgICAuLi5pc3N1ZWlzaFRvb2x0aXBDb250YWluZXJfcmVzb3VyY2VcbiAgICAuLi4gb24gTm9kZSB7XG4gICAgICBpZFxuICAgIH1cbiAgfVxufVxuXG5mcmFnbWVudCBpc3N1ZWlzaFRvb2x0aXBDb250YWluZXJfcmVzb3VyY2Ugb24gVW5pZm9ybVJlc291cmNlTG9jYXRhYmxlIHtcbiAgX190eXBlbmFtZVxuICAuLi4gb24gSXNzdWUge1xuICAgIHN0YXRlXG4gICAgbnVtYmVyXG4gICAgdGl0bGVcbiAgICByZXBvc2l0b3J5IHtcbiAgICAgIG5hbWVcbiAgICAgIG93bmVyIHtcbiAgICAgICAgX190eXBlbmFtZVxuICAgICAgICBsb2dpblxuICAgICAgICBpZFxuICAgICAgfVxuICAgICAgaWRcbiAgICB9XG4gICAgYXV0aG9yIHtcbiAgICAgIF9fdHlwZW5hbWVcbiAgICAgIGxvZ2luXG4gICAgICBhdmF0YXJVcmxcbiAgICAgIC4uLiBvbiBOb2RlIHtcbiAgICAgICAgaWRcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLi4uIG9uIFB1bGxSZXF1ZXN0IHtcbiAgICBzdGF0ZVxuICAgIG51bWJlclxuICAgIHRpdGxlXG4gICAgcmVwb3NpdG9yeSB7XG4gICAgICBuYW1lXG4gICAgICBvd25lciB7XG4gICAgICAgIF9fdHlwZW5hbWVcbiAgICAgICAgbG9naW5cbiAgICAgICAgaWRcbiAgICAgIH1cbiAgICAgIGlkXG4gICAgfVxuICAgIGF1dGhvciB7XG4gICAgICBfX3R5cGVuYW1lXG4gICAgICBsb2dpblxuICAgICAgYXZhdGFyVXJsXG4gICAgICAuLi4gb24gTm9kZSB7XG4gICAgICAgIGlkXG4gICAgICB9XG4gICAgfVxuICB9XG59XG4qL1xuXG5jb25zdCBub2RlLyo6IENvbmNyZXRlUmVxdWVzdCovID0gKGZ1bmN0aW9uKCl7XG52YXIgdjAgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwiaXNzdWVpc2hVcmxcIixcbiAgICBcInR5cGVcIjogXCJVUkkhXCIsXG4gICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICB9XG5dLFxudjEgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgIFwibmFtZVwiOiBcInVybFwiLFxuICAgIFwidmFyaWFibGVOYW1lXCI6IFwiaXNzdWVpc2hVcmxcIlxuICB9XG5dLFxudjIgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiX190eXBlbmFtZVwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52MyA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJpZFwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52NCA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJsb2dpblwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52NSA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgXCJhbGlhc1wiOiBudWxsLFxuICAgIFwibmFtZVwiOiBcInN0YXRlXCIsXG4gICAgXCJhcmdzXCI6IG51bGwsXG4gICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgfSxcbiAge1xuICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgXCJhbGlhc1wiOiBudWxsLFxuICAgIFwibmFtZVwiOiBcIm51bWJlclwiLFxuICAgIFwiYXJnc1wiOiBudWxsLFxuICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gIH0sXG4gIHtcbiAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICBcIm5hbWVcIjogXCJ0aXRsZVwiLFxuICAgIFwiYXJnc1wiOiBudWxsLFxuICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gIH0sXG4gIHtcbiAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICBcIm5hbWVcIjogXCJyZXBvc2l0b3J5XCIsXG4gICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgXCJhcmdzXCI6IG51bGwsXG4gICAgXCJjb25jcmV0ZVR5cGVcIjogXCJSZXBvc2l0b3J5XCIsXG4gICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICBcIm5hbWVcIjogXCJuYW1lXCIsXG4gICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICBcIm5hbWVcIjogXCJvd25lclwiLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICh2Mi8qOiBhbnkqLyksXG4gICAgICAgICAgKHY0Lyo6IGFueSovKSxcbiAgICAgICAgICAodjMvKjogYW55Ki8pXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICAodjMvKjogYW55Ki8pXG4gICAgXVxuICB9LFxuICB7XG4gICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgXCJuYW1lXCI6IFwiYXV0aG9yXCIsXG4gICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgXCJhcmdzXCI6IG51bGwsXG4gICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgKHYyLyo6IGFueSovKSxcbiAgICAgICh2NC8qOiBhbnkqLyksXG4gICAgICB7XG4gICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgXCJuYW1lXCI6IFwiYXZhdGFyVXJsXCIsXG4gICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgfSxcbiAgICAgICh2My8qOiBhbnkqLylcbiAgICBdXG4gIH1cbl07XG5yZXR1cm4ge1xuICBcImtpbmRcIjogXCJSZXF1ZXN0XCIsXG4gIFwiZnJhZ21lbnRcIjoge1xuICAgIFwia2luZFwiOiBcIkZyYWdtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwiaXNzdWVpc2hUb29sdGlwSXRlbVF1ZXJ5XCIsXG4gICAgXCJ0eXBlXCI6IFwiUXVlcnlcIixcbiAgICBcIm1ldGFkYXRhXCI6IG51bGwsXG4gICAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6ICh2MC8qOiBhbnkqLyksXG4gICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICBcIm5hbWVcIjogXCJyZXNvdXJjZVwiLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgXCJhcmdzXCI6ICh2MS8qOiBhbnkqLyksXG4gICAgICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIkZyYWdtZW50U3ByZWFkXCIsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJpc3N1ZWlzaFRvb2x0aXBDb250YWluZXJfcmVzb3VyY2VcIixcbiAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9LFxuICBcIm9wZXJhdGlvblwiOiB7XG4gICAgXCJraW5kXCI6IFwiT3BlcmF0aW9uXCIsXG4gICAgXCJuYW1lXCI6IFwiaXNzdWVpc2hUb29sdGlwSXRlbVF1ZXJ5XCIsXG4gICAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6ICh2MC8qOiBhbnkqLyksXG4gICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICBcIm5hbWVcIjogXCJyZXNvdXJjZVwiLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgXCJhcmdzXCI6ICh2MS8qOiBhbnkqLyksXG4gICAgICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICh2Mi8qOiBhbnkqLyksXG4gICAgICAgICAgKHYzLyo6IGFueSovKSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJJbmxpbmVGcmFnbWVudFwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiSXNzdWVcIixcbiAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiAodjUvKjogYW55Ki8pXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJJbmxpbmVGcmFnbWVudFwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiUHVsbFJlcXVlc3RcIixcbiAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiAodjUvKjogYW55Ki8pXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9LFxuICBcInBhcmFtc1wiOiB7XG4gICAgXCJvcGVyYXRpb25LaW5kXCI6IFwicXVlcnlcIixcbiAgICBcIm5hbWVcIjogXCJpc3N1ZWlzaFRvb2x0aXBJdGVtUXVlcnlcIixcbiAgICBcImlkXCI6IG51bGwsXG4gICAgXCJ0ZXh0XCI6IFwicXVlcnkgaXNzdWVpc2hUb29sdGlwSXRlbVF1ZXJ5KFxcbiAgJGlzc3VlaXNoVXJsOiBVUkkhXFxuKSB7XFxuICByZXNvdXJjZSh1cmw6ICRpc3N1ZWlzaFVybCkge1xcbiAgICBfX3R5cGVuYW1lXFxuICAgIC4uLmlzc3VlaXNoVG9vbHRpcENvbnRhaW5lcl9yZXNvdXJjZVxcbiAgICAuLi4gb24gTm9kZSB7XFxuICAgICAgaWRcXG4gICAgfVxcbiAgfVxcbn1cXG5cXG5mcmFnbWVudCBpc3N1ZWlzaFRvb2x0aXBDb250YWluZXJfcmVzb3VyY2Ugb24gVW5pZm9ybVJlc291cmNlTG9jYXRhYmxlIHtcXG4gIF9fdHlwZW5hbWVcXG4gIC4uLiBvbiBJc3N1ZSB7XFxuICAgIHN0YXRlXFxuICAgIG51bWJlclxcbiAgICB0aXRsZVxcbiAgICByZXBvc2l0b3J5IHtcXG4gICAgICBuYW1lXFxuICAgICAgb3duZXIge1xcbiAgICAgICAgX190eXBlbmFtZVxcbiAgICAgICAgbG9naW5cXG4gICAgICAgIGlkXFxuICAgICAgfVxcbiAgICAgIGlkXFxuICAgIH1cXG4gICAgYXV0aG9yIHtcXG4gICAgICBfX3R5cGVuYW1lXFxuICAgICAgbG9naW5cXG4gICAgICBhdmF0YXJVcmxcXG4gICAgICAuLi4gb24gTm9kZSB7XFxuICAgICAgICBpZFxcbiAgICAgIH1cXG4gICAgfVxcbiAgfVxcbiAgLi4uIG9uIFB1bGxSZXF1ZXN0IHtcXG4gICAgc3RhdGVcXG4gICAgbnVtYmVyXFxuICAgIHRpdGxlXFxuICAgIHJlcG9zaXRvcnkge1xcbiAgICAgIG5hbWVcXG4gICAgICBvd25lciB7XFxuICAgICAgICBfX3R5cGVuYW1lXFxuICAgICAgICBsb2dpblxcbiAgICAgICAgaWRcXG4gICAgICB9XFxuICAgICAgaWRcXG4gICAgfVxcbiAgICBhdXRob3Ige1xcbiAgICAgIF9fdHlwZW5hbWVcXG4gICAgICBsb2dpblxcbiAgICAgIGF2YXRhclVybFxcbiAgICAgIC4uLiBvbiBOb2RlIHtcXG4gICAgICAgIGlkXFxuICAgICAgfVxcbiAgICB9XFxuICB9XFxufVxcblwiLFxuICAgIFwibWV0YWRhdGFcIjoge31cbiAgfVxufTtcbn0pKCk7XG4vLyBwcmV0dGllci1pZ25vcmVcbihub2RlLyo6IGFueSovKS5oYXNoID0gJzhlNmIzMmI1Y2RjZGQzZGViY2NjN2FkYWEyYjRlODJjJztcbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsWUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBLE1BQU1BLElBQUkseUJBQXlCLFlBQVU7RUFDN0MsSUFBSUMsRUFBRSxHQUFHLENBQ1A7TUFDRSxNQUFNLEVBQUUsZUFBZTtNQUN2QixNQUFNLEVB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