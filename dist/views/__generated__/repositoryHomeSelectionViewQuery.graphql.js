/**
 * @flow
 * @relayHash 7b497054797ead3f15d4ce610e26e24c
 */

/* eslint-disable */
'use strict';
/*::
import type { ConcreteRequest } from 'relay-runtime';
type repositoryHomeSelectionView_user$ref = any;
export type repositoryHomeSelectionViewQueryVariables = {|
  id: string,
  organizationCount: number,
  organizationCursor?: ?string,
|};
export type repositoryHomeSelectionViewQueryResponse = {|
  +node: ?{|
    +$fragmentRefs: repositoryHomeSelectionView_user$ref
  |}
|};
export type repositoryHomeSelectionViewQuery = {|
  variables: repositoryHomeSelectionViewQueryVariables,
  response: repositoryHomeSelectionViewQueryResponse,
|};
*/

/*
query repositoryHomeSelectionViewQuery(
  $id: ID!
  $organizationCount: Int!
  $organizationCursor: String
) {
  node(id: $id) {
    __typename
    ... on User {
      ...repositoryHomeSelectionView_user_12CDS5
    }
    id
  }
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
    "name": "id",
    "type": "ID!",
    "defaultValue": null
  }, {
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
      v1 = [{
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
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
      v5 = {
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
      v6 = [{
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
      "name": "repositoryHomeSelectionViewQuery",
      "type": "Query",
      "metadata": null,
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "node",
        "storageKey": null,
        "args": v1
        /*: any*/
        ,
        "concreteType": null,
        "plural": false,
        "selections": [{
          "kind": "InlineFragment",
          "type": "User",
          "selections": [{
            "kind": "FragmentSpread",
            "name": "repositoryHomeSelectionView_user",
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
      }]
    },
    "operation": {
      "kind": "Operation",
      "name": "repositoryHomeSelectionViewQuery",
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "node",
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
          "type": "User",
          "selections": [v4
          /*: any*/
          , v5
          /*: any*/
          , {
            "kind": "LinkedField",
            "alias": null,
            "name": "organizations",
            "storageKey": null,
            "args": v6
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
                "selections": [v3
                /*: any*/
                , v4
                /*: any*/
                , v5
                /*: any*/
                , {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "viewerCanCreateRepositories",
                  "args": null,
                  "storageKey": null
                }, v2
                /*: any*/
                ]
              }]
            }]
          }, {
            "kind": "LinkedHandle",
            "alias": null,
            "name": "organizations",
            "args": v6
            /*: any*/
            ,
            "handle": "connection",
            "key": "RepositoryHomeSelectionView_organizations",
            "filters": null
          }]
        }]
      }]
    },
    "params": {
      "operationKind": "query",
      "name": "repositoryHomeSelectionViewQuery",
      "id": null,
      "text": "query repositoryHomeSelectionViewQuery(\n  $id: ID!\n  $organizationCount: Int!\n  $organizationCursor: String\n) {\n  node(id: $id) {\n    __typename\n    ... on User {\n      ...repositoryHomeSelectionView_user_12CDS5\n    }\n    id\n  }\n}\n\nfragment repositoryHomeSelectionView_user_12CDS5 on User {\n  id\n  login\n  avatarUrl(size: 24)\n  organizations(first: $organizationCount, after: $organizationCursor) {\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n    edges {\n      cursor\n      node {\n        id\n        login\n        avatarUrl(size: 24)\n        viewerCanCreateRepositories\n        __typename\n      }\n    }\n  }\n}\n",
      "metadata": {}
    }
  };
}(); // prettier-ignore


node
/*: any*/
.hash = '67e7843e3ff792e86e979cc948929ea3';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi92aWV3cy9fX2dlbmVyYXRlZF9fL3JlcG9zaXRvcnlIb21lU2VsZWN0aW9uVmlld1F1ZXJ5LmdyYXBocWwuanMiXSwibmFtZXMiOlsibm9kZSIsInYwIiwidjEiLCJ2MiIsInYzIiwidjQiLCJ2NSIsInY2IiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsTUFBTUE7QUFBSTtBQUFBLEVBQXlCLFlBQVU7QUFDN0MsTUFBSUMsRUFBRSxHQUFHLENBQ1A7QUFDRSxZQUFRLGVBRFY7QUFFRSxZQUFRLElBRlY7QUFHRSxZQUFRLEtBSFY7QUFJRSxvQkFBZ0I7QUFKbEIsR0FETyxFQU9QO0FBQ0UsWUFBUSxlQURWO0FBRUUsWUFBUSxtQkFGVjtBQUdFLFlBQVEsTUFIVjtBQUlFLG9CQUFnQjtBQUpsQixHQVBPLEVBYVA7QUFDRSxZQUFRLGVBRFY7QUFFRSxZQUFRLG9CQUZWO0FBR0UsWUFBUSxRQUhWO0FBSUUsb0JBQWdCO0FBSmxCLEdBYk8sQ0FBVDtBQUFBLE1Bb0JBQyxFQUFFLEdBQUcsQ0FDSDtBQUNFLFlBQVEsVUFEVjtBQUVFLFlBQVEsSUFGVjtBQUdFLG9CQUFnQjtBQUhsQixHQURHLENBcEJMO0FBQUEsTUEyQkFDLEVBQUUsR0FBRztBQUNILFlBQVEs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a0JBQVk7QUFMSjtBQTdKTCxHQUFQO0FBcUtDLENBL09pQyxFQUFsQyxDLENBZ1BBOzs7QUFDQ1A7QUFBSTtBQUFMLENBQWdCUSxJQUFoQixHQUF1QixrQ0FBdkI7QUFDQUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCVixJQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZsb3dcbiAqIEByZWxheUhhc2ggN2I0OTcwNTQ3OTdlYWQzZjE1ZDRjZTYxMGUyNmUyNGNcbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qOjpcbmltcG9ydCB0eXBlIHsgQ29uY3JldGVSZXF1ZXN0IH0gZnJvbSAncmVsYXktcnVudGltZSc7XG50eXBlIHJlcG9zaXRvcnlIb21lU2VsZWN0aW9uVmlld191c2VyJHJlZiA9IGFueTtcbmV4cG9ydCB0eXBlIHJlcG9zaXRvcnlIb21lU2VsZWN0aW9uVmlld1F1ZXJ5VmFyaWFibGVzID0ge3xcbiAgaWQ6IHN0cmluZyxcbiAgb3JnYW5pemF0aW9uQ291bnQ6IG51bWJlcixcbiAgb3JnYW5pemF0aW9uQ3Vyc29yPzogP3N0cmluZyxcbnx9O1xuZXhwb3J0IHR5cGUgcmVwb3NpdG9yeUhvbWVTZWxlY3Rpb25WaWV3UXVlcnlSZXNwb25zZSA9IHt8XG4gICtub2RlOiA/e3xcbiAgICArJGZyYWdtZW50UmVmczogcmVwb3NpdG9yeUhvbWVTZWxlY3Rpb25WaWV3X3VzZXIkcmVmXG4gIHx9XG58fTtcbmV4cG9ydCB0eXBlIHJlcG9zaXRvcnlIb21lU2VsZWN0aW9uVmlld1F1ZXJ5ID0ge3xcbiAgdmFyaWFibGVzOiByZXBvc2l0b3J5SG9tZVNlbGVjdGlvblZpZXdRdWVyeVZhcmlhYmxlcyxcbiAgcmVzcG9uc2U6IHJlcG9zaXRvcnlIb21lU2VsZWN0aW9uVmlld1F1ZXJ5UmVzcG9uc2UsXG58fTtcbiovXG5cblxuLypcbnF1ZXJ5IHJlcG9zaXRvcnlIb21lU2VsZWN0aW9uVmlld1F1ZXJ5KFxuICAkaWQ6IElEIVxuICAkb3JnYW5pemF0aW9uQ291bnQ6IEludCFcbiAgJG9yZ2FuaXphdGlvbkN1cnNvcjogU3RyaW5nXG4pIHtcbiAgbm9kZShpZDogJGlkKSB7XG4gICAgX190eXBlbmFtZVxuICAgIC4uLiBvbiBVc2VyIHtcbiAgICAgIC4uLnJlcG9zaXRvcnlIb21lU2VsZWN0aW9uVmlld191c2VyXzEyQ0RTNVxuICAgIH1cbiAgICBpZFxuICB9XG59XG5cbmZyYWdtZW50IHJlcG9zaXRvcnlIb21lU2VsZWN0aW9uVmlld191c2VyXzEyQ0RTNSBvbiBVc2VyIHtcbiAgaWRcbiAgbG9naW5cbiAgYXZhdGFyVXJsKHNpemU6IDI0KVxuICBvcmdhbml6YXRpb25zKGZpcnN0OiAkb3JnYW5pemF0aW9uQ291bnQsIGFmdGVyOiAkb3JnYW5pemF0aW9uQ3Vyc29yKSB7XG4gICAgcGFnZUluZm8ge1xuICAgICAgaGFzTmV4dFBhZ2VcbiAgICAgIGVuZEN1cnNvclxuICAgIH1cbiAgICBlZGdlcyB7XG4gICAgICBjdXJzb3JcbiAgICAgIG5vZGUge1xuICAgICAgICBpZFxuICAgICAgICBsb2dpblxuICAgICAgICBhdmF0YXJVcmwoc2l6ZTogMjQpXG4gICAgICAgIHZpZXdlckNhbkNyZWF0ZVJlcG9zaXRvcmllc1xuICAgICAgICBfX3R5cGVuYW1lXG4gICAgICB9XG4gICAgfVxuICB9XG59XG4qL1xuXG5jb25zdCBub2RlLyo6IENvbmNyZXRlUmVxdWVzdCovID0gKGZ1bmN0aW9uKCl7XG52YXIgdjAgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwiaWRcIixcbiAgICBcInR5cGVcIjogXCJJRCFcIixcbiAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gIH0sXG4gIHtcbiAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwib3JnYW5pemF0aW9uQ291bnRcIixcbiAgICBcInR5cGVcIjogXCJJbnQhXCIsXG4gICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICB9LFxuICB7XG4gICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgIFwibmFtZVwiOiBcIm9yZ2FuaXphdGlvbkN1cnNvclwiLFxuICAgIFwidHlwZVwiOiBcIlN0cmluZ1wiLFxuICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgfVxuXSxcbnYxID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICBcIm5hbWVcIjogXCJpZFwiLFxuICAgIFwidmFyaWFibGVOYW1lXCI6IFwiaWRcIlxuICB9XG5dLFxudjIgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiX190eXBlbmFtZVwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52MyA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJpZFwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52NCA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJsb2dpblwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52NSA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJhdmF0YXJVcmxcIixcbiAgXCJhcmdzXCI6IFtcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMaXRlcmFsXCIsXG4gICAgICBcIm5hbWVcIjogXCJzaXplXCIsXG4gICAgICBcInZhbHVlXCI6IDI0XG4gICAgfVxuICBdLFxuICBcInN0b3JhZ2VLZXlcIjogXCJhdmF0YXJVcmwoc2l6ZToyNClcIlxufSxcbnY2ID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICBcIm5hbWVcIjogXCJhZnRlclwiLFxuICAgIFwidmFyaWFibGVOYW1lXCI6IFwib3JnYW5pemF0aW9uQ3Vyc29yXCJcbiAgfSxcbiAge1xuICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgXCJuYW1lXCI6IFwiZmlyc3RcIixcbiAgICBcInZhcmlhYmxlTmFtZVwiOiBcIm9yZ2FuaXphdGlvbkNvdW50XCJcbiAgfVxuXTtcbnJldHVybiB7XG4gIFwia2luZFwiOiBcIlJlcXVlc3RcIixcbiAgXCJmcmFnbWVudFwiOiB7XG4gICAgXCJraW5kXCI6IFwiRnJhZ21lbnRcIixcbiAgICBcIm5hbWVcIjogXCJyZXBvc2l0b3J5SG9tZVNlbGVjdGlvblZpZXdRdWVyeVwiLFxuICAgIFwidHlwZVwiOiBcIlF1ZXJ5XCIsXG4gICAgXCJtZXRhZGF0YVwiOiBudWxsLFxuICAgIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiAodjAvKjogYW55Ki8pLFxuICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgXCJuYW1lXCI6IFwibm9kZVwiLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgXCJhcmdzXCI6ICh2MS8qOiBhbnkqLyksXG4gICAgICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIklubGluZUZyYWdtZW50XCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJVc2VyXCIsXG4gICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiRnJhZ21lbnRTcHJlYWRcIixcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJyZXBvc2l0b3J5SG9tZVNlbGVjdGlvblZpZXdfdXNlclwiLFxuICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm9yZ2FuaXphdGlvbkNvdW50XCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFyaWFibGVOYW1lXCI6IFwib3JnYW5pemF0aW9uQ291bnRcIlxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwib3JnYW5pemF0aW9uQ3Vyc29yXCIsXG4gICAgICAgICAgICAgICAgICAgIFwidmFyaWFibGVOYW1lXCI6IFwib3JnYW5pemF0aW9uQ3Vyc29yXCJcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIFwib3BlcmF0aW9uXCI6IHtcbiAgICBcImtpbmRcIjogXCJPcGVyYXRpb25cIixcbiAgICBcIm5hbWVcIjogXCJyZXBvc2l0b3J5SG9tZVNlbGVjdGlvblZpZXdRdWVyeVwiLFxuICAgIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiAodjAvKjogYW55Ki8pLFxuICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgXCJuYW1lXCI6IFwibm9kZVwiLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgXCJhcmdzXCI6ICh2MS8qOiBhbnkqLyksXG4gICAgICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICh2Mi8qOiBhbnkqLyksXG4gICAgICAgICAgKHYzLyo6IGFueSovKSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJJbmxpbmVGcmFnbWVudFwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiVXNlclwiLFxuICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgKHY0Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgKHY1Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm9yZ2FuaXphdGlvbnNcIixcbiAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcImFyZ3NcIjogKHY2Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIk9yZ2FuaXphdGlvbkNvbm5lY3Rpb25cIixcbiAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInBhZ2VJbmZvXCIsXG4gICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJQYWdlSW5mb1wiLFxuICAgICAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaGFzTmV4dFBhZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJlbmRDdXJzb3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZWRnZXNcIixcbiAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIk9yZ2FuaXphdGlvbkVkZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY3Vyc29yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibm9kZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiT3JnYW5pemF0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh2My8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh2NC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh2NS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ2aWV3ZXJDYW5DcmVhdGVSZXBvc2l0b3JpZXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAodjIvKjogYW55Ki8pXG4gICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkSGFuZGxlXCIsXG4gICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm9yZ2FuaXphdGlvbnNcIixcbiAgICAgICAgICAgICAgICBcImFyZ3NcIjogKHY2Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICBcImhhbmRsZVwiOiBcImNvbm5lY3Rpb25cIixcbiAgICAgICAgICAgICAgICBcImtleVwiOiBcIlJlcG9zaXRvcnlIb21lU2VsZWN0aW9uVmlld19vcmdhbml6YXRpb25zXCIsXG4gICAgICAgICAgICAgICAgXCJmaWx0ZXJzXCI6IG51bGxcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAgXCJwYXJhbXNcIjoge1xuICAgIFwib3BlcmF0aW9uS2luZFwiOiBcInF1ZXJ5XCIsXG4gICAgXCJuYW1lXCI6IFwicmVwb3NpdG9yeUhvbWVTZWxlY3Rpb25WaWV3UXVlcnlcIixcbiAgICBcImlkXCI6IG51bGwsXG4gICAgXCJ0ZXh0XCI6IFwicXVlcnkgcmVwb3NpdG9yeUhvbWVTZWxlY3Rpb25WaWV3UXVlcnkoXFxuICAkaWQ6IElEIVxcbiAgJG9yZ2FuaXphdGlvbkNvdW50OiBJbnQhXFxuICAkb3JnYW5pemF0aW9uQ3Vyc29yOiBTdHJpbmdcXG4pIHtcXG4gIG5vZGUoaWQ6ICRpZCkge1xcbiAgICBfX3R5cGVuYW1lXFxuICAgIC4uLiBvbiBVc2VyIHtcXG4gICAgICAuLi5yZXBvc2l0b3J5SG9tZVNlbGVjdGlvblZpZXdfdXNlcl8xMkNEUzVcXG4gICAgfVxcbiAgICBpZFxcbiAgfVxcbn1cXG5cXG5mcmFnbWVudCByZXBvc2l0b3J5SG9tZVNlbGVjdGlvblZpZXdfdXNlcl8xMkNEUzUgb24gVXNlciB7XFxuICBpZFxcbiAgbG9naW5cXG4gIGF2YXRhclVybChzaXplOiAyNClcXG4gIG9yZ2FuaXphdGlvbnMoZmlyc3Q6ICRvcmdhbml6YXRpb25Db3VudCwgYWZ0ZXI6ICRvcmdhbml6YXRpb25DdXJzb3IpIHtcXG4gICAgcGFnZUluZm8ge1xcbiAgICAgIGhhc05leHRQYWdlXFxuICAgICAgZW5kQ3Vyc29yXFxuICAgIH1cXG4gICAgZWRnZXMge1xcbiAgICAgIGN1cnNvclxcbiAgICAgIG5vZGUge1xcbiAgICAgICAgaWRcXG4gICAgICAgIGxvZ2luXFxuICAgICAgICBhdmF0YXJVcmwoc2l6ZTogMjQpXFxuICAgICAgICB2aWV3ZXJDYW5DcmVhdGVSZXBvc2l0b3JpZXNcXG4gICAgICAgIF9fdHlwZW5hbWVcXG4gICAgICB9XFxuICAgIH1cXG4gIH1cXG59XFxuXCIsXG4gICAgXCJtZXRhZGF0YVwiOiB7fVxuICB9XG59O1xufSkoKTtcbi8vIHByZXR0aWVyLWlnbm9yZVxuKG5vZGUvKjogYW55Ki8pLmhhc2ggPSAnNjdlNzg0M2UzZmY3OTJlODZlOTc5Y2M5NDg5MjllYTMnO1xubW9kdWxlLmV4cG9ydHMgPSBub2RlO1xuIl19