/**
 * @flow
 * @relayHash 72a9fbd2efed6312f034405f54084c6f
 */

/* eslint-disable */
'use strict';
/*::
import type { ConcreteRequest } from 'relay-runtime';
type createDialogController_user$ref = any;
export type createDialogContainerQueryVariables = {|
  organizationCount: number,
  organizationCursor?: ?string,
|};
export type createDialogContainerQueryResponse = {|
  +viewer: {|
    +$fragmentRefs: createDialogController_user$ref
  |}
|};
export type createDialogContainerQuery = {|
  variables: createDialogContainerQueryVariables,
  response: createDialogContainerQueryResponse,
|};
*/

/*
query createDialogContainerQuery(
  $organizationCount: Int!
  $organizationCursor: String
) {
  viewer {
    ...createDialogController_user_12CDS5
    id
  }
}

fragment createDialogController_user_12CDS5 on User {
  id
  ...repositoryHomeSelectionView_user_12CDS5
}

fragment repositoryHomeSelectionView_user_12CDS5 on User {
  id
  login
  avatarUrl(size: 24)
  organizations(first: $organizationCount, after: $organizationCursor) {
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      cursor
      node {
        id
        login
        avatarUrl(size: 24)
        viewerCanCreateRepositories
        __typename
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
    "name": "organizationCount",
    "type": "Int!",
    "defaultValue": null
  }, {
    "kind": "LocalArgument",
    "name": "organizationCursor",
    "type": "String",
    "defaultValue": null
  }],
      v1 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "id",
    "args": null,
    "storageKey": null
  },
      v2 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "login",
    "args": null,
    "storageKey": null
  },
      v3 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "avatarUrl",
    "args": [{
      "kind": "Literal",
      "name": "size",
      "value": 24
    }],
    "storageKey": "avatarUrl(size:24)"
  },
      v4 = [{
    "kind": "Variable",
    "name": "after",
    "variableName": "organizationCursor"
  }, {
    "kind": "Variable",
    "name": "first",
    "variableName": "organizationCount"
  }];
  return {
    "kind": "Request",
    "fragment": {
      "kind": "Fragment",
      "name": "createDialogContainerQuery",
      "type": "Query",
      "metadata": null,
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "User",
        "plural": false,
        "selections": [{
          "kind": "FragmentSpread",
          "name": "createDialogController_user",
          "args": [{
            "kind": "Variable",
            "name": "organizationCount",
            "variableName": "organizationCount"
          }, {
            "kind": "Variable",
            "name": "organizationCursor",
            "variableName": "organizationCursor"
          }]
        }]
      }]
    },
    "operation": {
      "kind": "Operation",
      "name": "createDialogContainerQuery",
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "User",
        "plural": false,
        "selections": [v1
        /*: any*/
        , v2
        /*: any*/
        , v3
        /*: any*/
        , {
          "kind": "LinkedField",
          "alias": null,
          "name": "organizations",
          "storageKey": null,
          "args": v4
          /*: any*/
          ,
          "concreteType": "OrganizationConnection",
          "plural": false,
          "selections": [{
            "kind": "LinkedField",
            "alias": null,
            "name": "pageInfo",
            "storageKey": null,
            "args": null,
            "concreteType": "PageInfo",
            "plural": false,
            "selections": [{
              "kind": "ScalarField",
              "alias": null,
              "name": "hasNextPage",
              "args": null,
              "storageKey": null
            }, {
              "kind": "ScalarField",
              "alias": null,
              "name": "endCursor",
              "args": null,
              "storageKey": null
            }]
          }, {
            "kind": "LinkedField",
            "alias": null,
            "name": "edges",
            "storageKey": null,
            "args": null,
            "concreteType": "OrganizationEdge",
            "plural": true,
            "selections": [{
              "kind": "ScalarField",
              "alias": null,
              "name": "cursor",
              "args": null,
              "storageKey": null
            }, {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "Organization",
              "plural": false,
              "selections": [v1
              /*: any*/
              , v2
              /*: any*/
              , v3
              /*: any*/
              , {
                "kind": "ScalarField",
                "alias": null,
                "name": "viewerCanCreateRepositories",
                "args": null,
                "storageKey": null
              }, {
                "kind": "ScalarField",
                "alias": null,
                "name": "__typename",
                "args": null,
                "storageKey": null
              }]
            }]
          }]
        }, {
          "kind": "LinkedHandle",
          "alias": null,
          "name": "organizations",
          "args": v4
          /*: any*/
          ,
          "handle": "connection",
          "key": "RepositoryHomeSelectionView_organizations",
          "filters": null
        }]
      }]
    },
    "params": {
      "operationKind": "query",
      "name": "createDialogContainerQuery",
      "id": null,
      "text": "query createDialogContainerQuery(\n  $organizationCount: Int!\n  $organizationCursor: String\n) {\n  viewer {\n    ...createDialogController_user_12CDS5\n    id\n  }\n}\n\nfragment createDialogController_user_12CDS5 on User {\n  id\n  ...repositoryHomeSelectionView_user_12CDS5\n}\n\nfragment repositoryHomeSelectionView_user_12CDS5 on User {\n  id\n  login\n  avatarUrl(size: 24)\n  organizations(first: $organizationCount, after: $organizationCursor) {\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n    edges {\n      cursor\n      node {\n        id\n        login\n        avatarUrl(size: 24)\n        viewerCanCreateRepositories\n        __typename\n      }\n    }\n  }\n}\n",
      "metadata": {}
    }
  };
}(); // prettier-ignore


node
/*: any*/
.hash = '862b8ec3127c9a52e9a54020afa47792';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9jb250YWluZXJzL19fZ2VuZXJhdGVkX18vY3JlYXRlRGlhbG9nQ29udGFpbmVyUXVlcnkuZ3JhcGhxbC5qcyJdLCJuYW1lcyI6WyJub2RlIiwidjAiLCJ2MSIsInYyIiwidjMiLCJ2NCIsImhhc2giLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQU1BO0FBQUk7QUFBQSxFQUF5QixZQUFVO0FBQzdDLE1BQUlDLEVBQUUsR0FBRyxDQUNQO0FBQ0UsWUFBUSxlQURWO0FBRUUsWUFBUSxtQkFGVjtBQUdFLFlBQVEsTUFIVjtBQUlFLG9CQUFnQjtBQUpsQixHQURPLEVBT1A7QUFDRSxZQUFRLGVBRFY7QUFFRSxZQUFRLG9CQUZWO0FBR0UsWUFBUSxRQUhWO0FBSUUsb0JBQWdCO0FBSmxCLEdBUE8sQ0FBVDtBQUFBLE1BY0FDLEVBQUUsR0FBRztBQUNILFlBQVEsYUFETDtBQUVILGFBQVMsSUFGTjtBQUdILFlBQVEsSUFITDtBQUlILFlBQVEsSUFKTDtBQUtILGtCQUFjO0FBTFgsR0FkTDtBQUFBLE1BcUJBQyxFQUFFLEdBQUc7QUFDSCxZQUFRLGFBREw7QUFFSCxhQUFTLElBRk47QUFHSCxZQUFRLE9BSEw7QUFJSCxZQUFRLElBSkw7QUFLSCxrQkFBYztBQUxYLEdB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TFY7QUFNRSw4QkFBZ0IsY0FObEI7QUFPRSx3QkFBVSxLQVBaO0FBUUUsNEJBQWMsQ0FDWEg7QUFBRTtBQURTLGdCQUVYQztBQUFFO0FBRlMsZ0JBR1hDO0FBQUU7QUFIUyxnQkFJWjtBQUNFLHdCQUFRLGFBRFY7QUFFRSx5QkFBUyxJQUZYO0FBR0Usd0JBQVEsNkJBSFY7QUFJRSx3QkFBUSxJQUpWO0FBS0UsOEJBQWM7QUFMaEIsZUFKWSxFQVdaO0FBQ0Usd0JBQVEsYUFEVjtBQUVFLHlCQUFTLElBRlg7QUFHRSx3QkFBUSxZQUhWO0FBSUUsd0JBQVEsSUFKVjtBQUtFLDhCQUFjO0FBTGhCLGVBWFk7QUFSaEIsYUFSWTtBQVJoQixXQTFCWTtBQVJoQixTQUpZLEVBc0ZaO0FBQ0Usa0JBQVEsY0FEVjtBQUVFLG1CQUFTLElBRlg7QUFHRSxrQkFBUSxlQUhWO0FBSUUsa0JBQVNDO0FBQUU7QUFKYjtBQUtFLG9CQUFVLFlBTFo7QUFNRSxpQkFBTywyQ0FOVDtBQU9FLHFCQUFXO0FBUGIsU0F0Rlk7QUFSaEIsT0FEWTtBQUpILEtBdENSO0FBc0pMLGNBQVU7QUFDUix1QkFBaUIsT0FEVDtBQUVSLGNBQVEsNEJBRkE7QUFHUixZQUFNLElBSEU7QUFJUixjQUFRLHVyQkFKQTtBQUtSLGtCQUFZO0FBTEo7QUF0SkwsR0FBUDtBQThKQyxDQXBOaUMsRUFBbEMsQyxDQXFOQTs7O0FBQ0NMO0FBQUk7QUFBTCxDQUFnQk0sSUFBaEIsR0FBdUIsa0NBQXZCO0FBQ0FDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQlIsSUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmbG93XG4gKiBAcmVsYXlIYXNoIDcyYTlmYmQyZWZlZDYzMTJmMDM0NDA1ZjU0MDg0YzZmXG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKjo6XG5pbXBvcnQgdHlwZSB7IENvbmNyZXRlUmVxdWVzdCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xudHlwZSBjcmVhdGVEaWFsb2dDb250cm9sbGVyX3VzZXIkcmVmID0gYW55O1xuZXhwb3J0IHR5cGUgY3JlYXRlRGlhbG9nQ29udGFpbmVyUXVlcnlWYXJpYWJsZXMgPSB7fFxuICBvcmdhbml6YXRpb25Db3VudDogbnVtYmVyLFxuICBvcmdhbml6YXRpb25DdXJzb3I/OiA/c3RyaW5nLFxufH07XG5leHBvcnQgdHlwZSBjcmVhdGVEaWFsb2dDb250YWluZXJRdWVyeVJlc3BvbnNlID0ge3xcbiAgK3ZpZXdlcjoge3xcbiAgICArJGZyYWdtZW50UmVmczogY3JlYXRlRGlhbG9nQ29udHJvbGxlcl91c2VyJHJlZlxuICB8fVxufH07XG5leHBvcnQgdHlwZSBjcmVhdGVEaWFsb2dDb250YWluZXJRdWVyeSA9IHt8XG4gIHZhcmlhYmxlczogY3JlYXRlRGlhbG9nQ29udGFpbmVyUXVlcnlWYXJpYWJsZXMsXG4gIHJlc3BvbnNlOiBjcmVhdGVEaWFsb2dDb250YWluZXJRdWVyeVJlc3BvbnNlLFxufH07XG4qL1xuXG5cbi8qXG5xdWVyeSBjcmVhdGVEaWFsb2dDb250YWluZXJRdWVyeShcbiAgJG9yZ2FuaXphdGlvbkNvdW50OiBJbnQhXG4gICRvcmdhbml6YXRpb25DdXJzb3I6IFN0cmluZ1xuKSB7XG4gIHZpZXdlciB7XG4gICAgLi4uY3JlYXRlRGlhbG9nQ29udHJvbGxlcl91c2VyXzEyQ0RTNVxuICAgIGlkXG4gIH1cbn1cblxuZnJhZ21lbnQgY3JlYXRlRGlhbG9nQ29udHJvbGxlcl91c2VyXzEyQ0RTNSBvbiBVc2VyIHtcbiAgaWRcbiAgLi4ucmVwb3NpdG9yeUhvbWVTZWxlY3Rpb25WaWV3X3VzZXJfMTJDRFM1XG59XG5cbmZyYWdtZW50IHJlcG9zaXRvcnlIb21lU2VsZWN0aW9uVmlld191c2VyXzEyQ0RTNSBvbiBVc2VyIHtcbiAgaWRcbiAgbG9naW5cbiAgYXZhdGFyVXJsKHNpemU6IDI0KVxuICBvcmdhbml6YXRpb25zKGZpcnN0OiAkb3JnYW5pemF0aW9uQ291bnQsIGFmdGVyOiAkb3JnYW5pemF0aW9uQ3Vyc29yKSB7XG4gICAgcGFnZUluZm8ge1xuICAgICAgaGFzTmV4dFBhZ2VcbiAgICAgIGVuZEN1cnNvclxuICAgIH1cbiAgICBlZGdlcyB7XG4gICAgICBjdXJzb3JcbiAgICAgIG5vZGUge1xuICAgICAgICBpZFxuICAgICAgICBsb2dpblxuICAgICAgICBhdmF0YXJVcmwoc2l6ZTogMjQpXG4gICAgICAgIHZpZXdlckNhbkNyZWF0ZVJlcG9zaXRvcmllc1xuICAgICAgICBfX3R5cGVuYW1lXG4gICAgICB9XG4gICAgfVxuICB9XG59XG4qL1xuXG5jb25zdCBub2RlLyo6IENvbmNyZXRlUmVxdWVzdCovID0gKGZ1bmN0aW9uKCl7XG52YXIgdjAgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwib3JnYW5pemF0aW9uQ291bnRcIixcbiAgICBcInR5cGVcIjogXCJJbnQhXCIsXG4gICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICB9LFxuICB7XG4gICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgIFwibmFtZVwiOiBcIm9yZ2FuaXphdGlvbkN1cnNvclwiLFxuICAgIFwidHlwZVwiOiBcIlN0cmluZ1wiLFxuICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgfVxuXSxcbnYxID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcImlkXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnYyID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcImxvZ2luXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnYzID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcImF2YXRhclVybFwiLFxuICBcImFyZ3NcIjogW1xuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxpdGVyYWxcIixcbiAgICAgIFwibmFtZVwiOiBcInNpemVcIixcbiAgICAgIFwidmFsdWVcIjogMjRcbiAgICB9XG4gIF0sXG4gIFwic3RvcmFnZUtleVwiOiBcImF2YXRhclVybChzaXplOjI0KVwiXG59LFxudjQgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgIFwibmFtZVwiOiBcImFmdGVyXCIsXG4gICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJvcmdhbml6YXRpb25DdXJzb3JcIlxuICB9LFxuICB7XG4gICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICBcIm5hbWVcIjogXCJmaXJzdFwiLFxuICAgIFwidmFyaWFibGVOYW1lXCI6IFwib3JnYW5pemF0aW9uQ291bnRcIlxuICB9XG5dO1xucmV0dXJuIHtcbiAgXCJraW5kXCI6IFwiUmVxdWVzdFwiLFxuICBcImZyYWdtZW50XCI6IHtcbiAgICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICAgIFwibmFtZVwiOiBcImNyZWF0ZURpYWxvZ0NvbnRhaW5lclF1ZXJ5XCIsXG4gICAgXCJ0eXBlXCI6IFwiUXVlcnlcIixcbiAgICBcIm1ldGFkYXRhXCI6IG51bGwsXG4gICAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6ICh2MC8qOiBhbnkqLyksXG4gICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICBcIm5hbWVcIjogXCJ2aWV3ZXJcIixcbiAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlVzZXJcIixcbiAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiRnJhZ21lbnRTcHJlYWRcIixcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImNyZWF0ZURpYWxvZ0NvbnRyb2xsZXJfdXNlclwiLFxuICAgICAgICAgICAgXCJhcmdzXCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwib3JnYW5pemF0aW9uQ291bnRcIixcbiAgICAgICAgICAgICAgICBcInZhcmlhYmxlTmFtZVwiOiBcIm9yZ2FuaXphdGlvbkNvdW50XCJcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwib3JnYW5pemF0aW9uQ3Vyc29yXCIsXG4gICAgICAgICAgICAgICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJvcmdhbml6YXRpb25DdXJzb3JcIlxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9LFxuICBcIm9wZXJhdGlvblwiOiB7XG4gICAgXCJraW5kXCI6IFwiT3BlcmF0aW9uXCIsXG4gICAgXCJuYW1lXCI6IFwiY3JlYXRlRGlhbG9nQ29udGFpbmVyUXVlcnlcIixcbiAgICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogKHYwLyo6IGFueSovKSxcbiAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAge1xuICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgIFwibmFtZVwiOiBcInZpZXdlclwiLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiVXNlclwiLFxuICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAodjEvKjogYW55Ki8pLFxuICAgICAgICAgICh2Mi8qOiBhbnkqLyksXG4gICAgICAgICAgKHYzLyo6IGFueSovKSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwib3JnYW5pemF0aW9uc1wiLFxuICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICBcImFyZ3NcIjogKHY0Lyo6IGFueSovKSxcbiAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiT3JnYW5pemF0aW9uQ29ubmVjdGlvblwiLFxuICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicGFnZUluZm9cIixcbiAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlBhZ2VJbmZvXCIsXG4gICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJoYXNOZXh0UGFnZVwiLFxuICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZW5kQ3Vyc29yXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImVkZ2VzXCIsXG4gICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJPcmdhbml6YXRpb25FZGdlXCIsXG4gICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImN1cnNvclwiLFxuICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibm9kZVwiLFxuICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiT3JnYW5pemF0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgICh2MS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgKHYyLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAodjMvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ2aWV3ZXJDYW5DcmVhdGVSZXBvc2l0b3JpZXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJfX3R5cGVuYW1lXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRIYW5kbGVcIixcbiAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgIFwibmFtZVwiOiBcIm9yZ2FuaXphdGlvbnNcIixcbiAgICAgICAgICAgIFwiYXJnc1wiOiAodjQvKjogYW55Ki8pLFxuICAgICAgICAgICAgXCJoYW5kbGVcIjogXCJjb25uZWN0aW9uXCIsXG4gICAgICAgICAgICBcImtleVwiOiBcIlJlcG9zaXRvcnlIb21lU2VsZWN0aW9uVmlld19vcmdhbml6YXRpb25zXCIsXG4gICAgICAgICAgICBcImZpbHRlcnNcIjogbnVsbFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAgXCJwYXJhbXNcIjoge1xuICAgIFwib3BlcmF0aW9uS2luZFwiOiBcInF1ZXJ5XCIsXG4gICAgXCJuYW1lXCI6IFwiY3JlYXRlRGlhbG9nQ29udGFpbmVyUXVlcnlcIixcbiAgICBcImlkXCI6IG51bGwsXG4gICAgXCJ0ZXh0XCI6IFwicXVlcnkgY3JlYXRlRGlhbG9nQ29udGFpbmVyUXVlcnkoXFxuICAkb3JnYW5pemF0aW9uQ291bnQ6IEludCFcXG4gICRvcmdhbml6YXRpb25DdXJzb3I6IFN0cmluZ1xcbikge1xcbiAgdmlld2VyIHtcXG4gICAgLi4uY3JlYXRlRGlhbG9nQ29udHJvbGxlcl91c2VyXzEyQ0RTNVxcbiAgICBpZFxcbiAgfVxcbn1cXG5cXG5mcmFnbWVudCBjcmVhdGVEaWFsb2dDb250cm9sbGVyX3VzZXJfMTJDRFM1IG9uIFVzZXIge1xcbiAgaWRcXG4gIC4uLnJlcG9zaXRvcnlIb21lU2VsZWN0aW9uVmlld191c2VyXzEyQ0RTNVxcbn1cXG5cXG5mcmFnbWVudCByZXBvc2l0b3J5SG9tZVNlbGVjdGlvblZpZXdfdXNlcl8xMkNEUzUgb24gVXNlciB7XFxuICBpZFxcbiAgbG9naW5cXG4gIGF2YXRhclVybChzaXplOiAyNClcXG4gIG9yZ2FuaXphdGlvbnMoZmlyc3Q6ICRvcmdhbml6YXRpb25Db3VudCwgYWZ0ZXI6ICRvcmdhbml6YXRpb25DdXJzb3IpIHtcXG4gICAgcGFnZUluZm8ge1xcbiAgICAgIGhhc05leHRQYWdlXFxuICAgICAgZW5kQ3Vyc29yXFxuICAgIH1cXG4gICAgZWRnZXMge1xcbiAgICAgIGN1cnNvclxcbiAgICAgIG5vZGUge1xcbiAgICAgICAgaWRcXG4gICAgICAgIGxvZ2luXFxuICAgICAgICBhdmF0YXJVcmwoc2l6ZTogMjQpXFxuICAgICAgICB2aWV3ZXJDYW5DcmVhdGVSZXBvc2l0b3JpZXNcXG4gICAgICAgIF9fdHlwZW5hbWVcXG4gICAgICB9XFxuICAgIH1cXG4gIH1cXG59XFxuXCIsXG4gICAgXCJtZXRhZGF0YVwiOiB7fVxuICB9XG59O1xufSkoKTtcbi8vIHByZXR0aWVyLWlnbm9yZVxuKG5vZGUvKjogYW55Ki8pLmhhc2ggPSAnODYyYjhlYzMxMjdjOWE1MmU5YTU0MDIwYWZhNDc3OTInO1xubW9kdWxlLmV4cG9ydHMgPSBub2RlO1xuIl19