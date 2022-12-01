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

const node
/*: ConcreteRequest*/
= function () {
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
      "selections": [v2
      /*: any*/
      , v4
      /*: any*/
      , v3
      /*: any*/
      ]
    }, v3
    /*: any*/
    ]
  }, {
    "kind": "LinkedField",
    "alias": null,
    "name": "author",
    "storageKey": null,
    "args": null,
    "concreteType": null,
    "plural": false,
    "selections": [v2
    /*: any*/
    , v4
    /*: any*/
    , {
      "kind": "ScalarField",
      "alias": null,
      "name": "avatarUrl",
      "args": null,
      "storageKey": null
    }, v3
    /*: any*/
    ]
  }];
  return {
    "kind": "Request",
    "fragment": {
      "kind": "Fragment",
      "name": "issueishTooltipItemQuery",
      "type": "Query",
      "metadata": null,
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "resource",
        "storageKey": null,
        "args": v1
        /*: any*/
        ,
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
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "resource",
        "storageKey": null,
        "args": v1
        /*: any*/
        ,
        "concreteType": null,
        "plural": false,
        "selections": [v2
        /*: any*/
        , v3
        /*: any*/
        , {
          "kind": "InlineFragment",
          "type": "Issue",
          "selections": v5
          /*: any*/

        }, {
          "kind": "InlineFragment",
          "type": "PullRequest",
          "selections": v5
          /*: any*/

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
}(); // prettier-ignore


node
/*: any*/
.hash = '8e6b32b5cdcdd3debccc7adaa2b4e82c';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9pdGVtcy9fX2dlbmVyYXRlZF9fL2lzc3VlaXNoVG9vbHRpcEl0ZW1RdWVyeS5ncmFwaHFsLmpzIl0sIm5hbWVzIjpbIm5vZGUiLCJ2MCIsInYxIiwidjIiLCJ2MyIsInY0IiwidjUiLCJoYXNoIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQU1BO0FBQUk7QUFBQSxFQUF5QixZQUFVO0FBQzdDLE1BQUlDLEVBQUUsR0FBRyxDQUNQO0FBQ0UsWUFBUSxlQURWO0FBRUUsWUFBUSxhQUZWO0FBR0UsWUFBUSxNQUhWO0FBSUUsb0JBQWdCO0FBSmxCLEdBRE8sQ0FBVDtBQUFBLE1BUUFDLEVBQUUsR0FBRyxDQUNIO0FBQ0UsWUFBUSxVQURWO0FBRUUsWUFBUSxLQUZWO0FBR0Usb0JBQWdCO0FBSGxCLEdBREcsQ0FSTDtBQUFBLE1BZUFDLEVBQUUsR0FBRztBQUNILFlBQVEsYUFETDtBQUVILGFBQVMsSUFGTjtBQUdILFlBQVEsWUFITDtBQUlILFlBQVEsSUFKTDtBQUtI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VUFFWEM7QUFBRTtBQUZTLFVBR1o7QUFDRSxrQkFBUSxnQkFEVjtBQUVFLGtCQUFRLE9BRlY7QUFHRSx3QkFBZUU7QUFBRTs7QUFIbkIsU0FIWSxFQVFaO0FBQ0Usa0JBQVEsZ0JBRFY7QUFFRSxrQkFBUSxhQUZWO0FBR0Usd0JBQWVBO0FBQUU7O0FBSG5CLFNBUlk7QUFSaEIsT0FEWTtBQUpILEtBM0JSO0FBeURMLGNBQVU7QUFDUix1QkFBaUIsT0FEVDtBQUVSLGNBQVEsMEJBRkE7QUFHUixZQUFNLElBSEU7QUFJUixjQUFRLG8yQkFKQTtBQUtSLGtCQUFZO0FBTEo7QUF6REwsR0FBUDtBQWlFQyxDQW5MaUMsRUFBbEMsQyxDQW9MQTs7O0FBQ0NOO0FBQUk7QUFBTCxDQUFnQk8sSUFBaEIsR0FBdUIsa0NBQXZCO0FBQ0FDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQlQsSUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmbG93XG4gKiBAcmVsYXlIYXNoIGY0ZWExNTZkYjhkMmU1Yjc0ODgwMjhiZjljNDYwN2RkXG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKjo6XG5pbXBvcnQgdHlwZSB7IENvbmNyZXRlUmVxdWVzdCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xudHlwZSBpc3N1ZWlzaFRvb2x0aXBDb250YWluZXJfcmVzb3VyY2UkcmVmID0gYW55O1xuZXhwb3J0IHR5cGUgaXNzdWVpc2hUb29sdGlwSXRlbVF1ZXJ5VmFyaWFibGVzID0ge3xcbiAgaXNzdWVpc2hVcmw6IGFueVxufH07XG5leHBvcnQgdHlwZSBpc3N1ZWlzaFRvb2x0aXBJdGVtUXVlcnlSZXNwb25zZSA9IHt8XG4gICtyZXNvdXJjZTogP3t8XG4gICAgKyRmcmFnbWVudFJlZnM6IGlzc3VlaXNoVG9vbHRpcENvbnRhaW5lcl9yZXNvdXJjZSRyZWZcbiAgfH1cbnx9O1xuZXhwb3J0IHR5cGUgaXNzdWVpc2hUb29sdGlwSXRlbVF1ZXJ5ID0ge3xcbiAgdmFyaWFibGVzOiBpc3N1ZWlzaFRvb2x0aXBJdGVtUXVlcnlWYXJpYWJsZXMsXG4gIHJlc3BvbnNlOiBpc3N1ZWlzaFRvb2x0aXBJdGVtUXVlcnlSZXNwb25zZSxcbnx9O1xuKi9cblxuXG4vKlxucXVlcnkgaXNzdWVpc2hUb29sdGlwSXRlbVF1ZXJ5KFxuICAkaXNzdWVpc2hVcmw6IFVSSSFcbikge1xuICByZXNvdXJjZSh1cmw6ICRpc3N1ZWlzaFVybCkge1xuICAgIF9fdHlwZW5hbWVcbiAgICAuLi5pc3N1ZWlzaFRvb2x0aXBDb250YWluZXJfcmVzb3VyY2VcbiAgICAuLi4gb24gTm9kZSB7XG4gICAgICBpZFxuICAgIH1cbiAgfVxufVxuXG5mcmFnbWVudCBpc3N1ZWlzaFRvb2x0aXBDb250YWluZXJfcmVzb3VyY2Ugb24gVW5pZm9ybVJlc291cmNlTG9jYXRhYmxlIHtcbiAgX190eXBlbmFtZVxuICAuLi4gb24gSXNzdWUge1xuICAgIHN0YXRlXG4gICAgbnVtYmVyXG4gICAgdGl0bGVcbiAgICByZXBvc2l0b3J5IHtcbiAgICAgIG5hbWVcbiAgICAgIG93bmVyIHtcbiAgICAgICAgX190eXBlbmFtZVxuICAgICAgICBsb2dpblxuICAgICAgICBpZFxuICAgICAgfVxuICAgICAgaWRcbiAgICB9XG4gICAgYXV0aG9yIHtcbiAgICAgIF9fdHlwZW5hbWVcbiAgICAgIGxvZ2luXG4gICAgICBhdmF0YXJVcmxcbiAgICAgIC4uLiBvbiBOb2RlIHtcbiAgICAgICAgaWRcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgLi4uIG9uIFB1bGxSZXF1ZXN0IHtcbiAgICBzdGF0ZVxuICAgIG51bWJlclxuICAgIHRpdGxlXG4gICAgcmVwb3NpdG9yeSB7XG4gICAgICBuYW1lXG4gICAgICBvd25lciB7XG4gICAgICAgIF9fdHlwZW5hbWVcbiAgICAgICAgbG9naW5cbiAgICAgICAgaWRcbiAgICAgIH1cbiAgICAgIGlkXG4gICAgfVxuICAgIGF1dGhvciB7XG4gICAgICBfX3R5cGVuYW1lXG4gICAgICBsb2dpblxuICAgICAgYXZhdGFyVXJsXG4gICAgICAuLi4gb24gTm9kZSB7XG4gICAgICAgIGlkXG4gICAgICB9XG4gICAgfVxuICB9XG59XG4qL1xuXG5jb25zdCBub2RlLyo6IENvbmNyZXRlUmVxdWVzdCovID0gKGZ1bmN0aW9uKCl7XG52YXIgdjAgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwiaXNzdWVpc2hVcmxcIixcbiAgICBcInR5cGVcIjogXCJVUkkhXCIsXG4gICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICB9XG5dLFxudjEgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgIFwibmFtZVwiOiBcInVybFwiLFxuICAgIFwidmFyaWFibGVOYW1lXCI6IFwiaXNzdWVpc2hVcmxcIlxuICB9XG5dLFxudjIgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiX190eXBlbmFtZVwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52MyA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJpZFwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52NCA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJsb2dpblwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52NSA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgXCJhbGlhc1wiOiBudWxsLFxuICAgIFwibmFtZVwiOiBcInN0YXRlXCIsXG4gICAgXCJhcmdzXCI6IG51bGwsXG4gICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgfSxcbiAge1xuICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgXCJhbGlhc1wiOiBudWxsLFxuICAgIFwibmFtZVwiOiBcIm51bWJlclwiLFxuICAgIFwiYXJnc1wiOiBudWxsLFxuICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gIH0sXG4gIHtcbiAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICBcIm5hbWVcIjogXCJ0aXRsZVwiLFxuICAgIFwiYXJnc1wiOiBudWxsLFxuICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gIH0sXG4gIHtcbiAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICBcIm5hbWVcIjogXCJyZXBvc2l0b3J5XCIsXG4gICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgXCJhcmdzXCI6IG51bGwsXG4gICAgXCJjb25jcmV0ZVR5cGVcIjogXCJSZXBvc2l0b3J5XCIsXG4gICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICBcIm5hbWVcIjogXCJuYW1lXCIsXG4gICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICBcIm5hbWVcIjogXCJvd25lclwiLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICh2Mi8qOiBhbnkqLyksXG4gICAgICAgICAgKHY0Lyo6IGFueSovKSxcbiAgICAgICAgICAodjMvKjogYW55Ki8pXG4gICAgICAgIF1cbiAgICAgIH0sXG4gICAgICAodjMvKjogYW55Ki8pXG4gICAgXVxuICB9LFxuICB7XG4gICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgXCJuYW1lXCI6IFwiYXV0aG9yXCIsXG4gICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgXCJhcmdzXCI6IG51bGwsXG4gICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgKHYyLyo6IGFueSovKSxcbiAgICAgICh2NC8qOiBhbnkqLyksXG4gICAgICB7XG4gICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgXCJuYW1lXCI6IFwiYXZhdGFyVXJsXCIsXG4gICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgfSxcbiAgICAgICh2My8qOiBhbnkqLylcbiAgICBdXG4gIH1cbl07XG5yZXR1cm4ge1xuICBcImtpbmRcIjogXCJSZXF1ZXN0XCIsXG4gIFwiZnJhZ21lbnRcIjoge1xuICAgIFwia2luZFwiOiBcIkZyYWdtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwiaXNzdWVpc2hUb29sdGlwSXRlbVF1ZXJ5XCIsXG4gICAgXCJ0eXBlXCI6IFwiUXVlcnlcIixcbiAgICBcIm1ldGFkYXRhXCI6IG51bGwsXG4gICAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6ICh2MC8qOiBhbnkqLyksXG4gICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICBcIm5hbWVcIjogXCJyZXNvdXJjZVwiLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgXCJhcmdzXCI6ICh2MS8qOiBhbnkqLyksXG4gICAgICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIkZyYWdtZW50U3ByZWFkXCIsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJpc3N1ZWlzaFRvb2x0aXBDb250YWluZXJfcmVzb3VyY2VcIixcbiAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9LFxuICBcIm9wZXJhdGlvblwiOiB7XG4gICAgXCJraW5kXCI6IFwiT3BlcmF0aW9uXCIsXG4gICAgXCJuYW1lXCI6IFwiaXNzdWVpc2hUb29sdGlwSXRlbVF1ZXJ5XCIsXG4gICAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6ICh2MC8qOiBhbnkqLyksXG4gICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICBcIm5hbWVcIjogXCJyZXNvdXJjZVwiLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgXCJhcmdzXCI6ICh2MS8qOiBhbnkqLyksXG4gICAgICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICh2Mi8qOiBhbnkqLyksXG4gICAgICAgICAgKHYzLyo6IGFueSovKSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJJbmxpbmVGcmFnbWVudFwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiSXNzdWVcIixcbiAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiAodjUvKjogYW55Ki8pXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJJbmxpbmVGcmFnbWVudFwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiUHVsbFJlcXVlc3RcIixcbiAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiAodjUvKjogYW55Ki8pXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9LFxuICBcInBhcmFtc1wiOiB7XG4gICAgXCJvcGVyYXRpb25LaW5kXCI6IFwicXVlcnlcIixcbiAgICBcIm5hbWVcIjogXCJpc3N1ZWlzaFRvb2x0aXBJdGVtUXVlcnlcIixcbiAgICBcImlkXCI6IG51bGwsXG4gICAgXCJ0ZXh0XCI6IFwicXVlcnkgaXNzdWVpc2hUb29sdGlwSXRlbVF1ZXJ5KFxcbiAgJGlzc3VlaXNoVXJsOiBVUkkhXFxuKSB7XFxuICByZXNvdXJjZSh1cmw6ICRpc3N1ZWlzaFVybCkge1xcbiAgICBfX3R5cGVuYW1lXFxuICAgIC4uLmlzc3VlaXNoVG9vbHRpcENvbnRhaW5lcl9yZXNvdXJjZVxcbiAgICAuLi4gb24gTm9kZSB7XFxuICAgICAgaWRcXG4gICAgfVxcbiAgfVxcbn1cXG5cXG5mcmFnbWVudCBpc3N1ZWlzaFRvb2x0aXBDb250YWluZXJfcmVzb3VyY2Ugb24gVW5pZm9ybVJlc291cmNlTG9jYXRhYmxlIHtcXG4gIF9fdHlwZW5hbWVcXG4gIC4uLiBvbiBJc3N1ZSB7XFxuICAgIHN0YXRlXFxuICAgIG51bWJlclxcbiAgICB0aXRsZVxcbiAgICByZXBvc2l0b3J5IHtcXG4gICAgICBuYW1lXFxuICAgICAgb3duZXIge1xcbiAgICAgICAgX190eXBlbmFtZVxcbiAgICAgICAgbG9naW5cXG4gICAgICAgIGlkXFxuICAgICAgfVxcbiAgICAgIGlkXFxuICAgIH1cXG4gICAgYXV0aG9yIHtcXG4gICAgICBfX3R5cGVuYW1lXFxuICAgICAgbG9naW5cXG4gICAgICBhdmF0YXJVcmxcXG4gICAgICAuLi4gb24gTm9kZSB7XFxuICAgICAgICBpZFxcbiAgICAgIH1cXG4gICAgfVxcbiAgfVxcbiAgLi4uIG9uIFB1bGxSZXF1ZXN0IHtcXG4gICAgc3RhdGVcXG4gICAgbnVtYmVyXFxuICAgIHRpdGxlXFxuICAgIHJlcG9zaXRvcnkge1xcbiAgICAgIG5hbWVcXG4gICAgICBvd25lciB7XFxuICAgICAgICBfX3R5cGVuYW1lXFxuICAgICAgICBsb2dpblxcbiAgICAgICAgaWRcXG4gICAgICB9XFxuICAgICAgaWRcXG4gICAgfVxcbiAgICBhdXRob3Ige1xcbiAgICAgIF9fdHlwZW5hbWVcXG4gICAgICBsb2dpblxcbiAgICAgIGF2YXRhclVybFxcbiAgICAgIC4uLiBvbiBOb2RlIHtcXG4gICAgICAgIGlkXFxuICAgICAgfVxcbiAgICB9XFxuICB9XFxufVxcblwiLFxuICAgIFwibWV0YWRhdGFcIjoge31cbiAgfVxufTtcbn0pKCk7XG4vLyBwcmV0dGllci1pZ25vcmVcbihub2RlLyo6IGFueSovKS5oYXNoID0gJzhlNmIzMmI1Y2RjZGQzZGViY2NjN2FkYWEyYjRlODJjJztcbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcbiJdfQ==