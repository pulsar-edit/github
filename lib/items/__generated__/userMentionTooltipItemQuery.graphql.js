/**
 * @flow
 * @relayHash a61e817b6d5e19dae9a8a7f4f4e156fa
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type userMentionTooltipContainer_repositoryOwner$ref = any;
export type userMentionTooltipItemQueryVariables = {|
  username: string
|};
export type userMentionTooltipItemQueryResponse = {|
  +repositoryOwner: ?{|
    +$fragmentRefs: userMentionTooltipContainer_repositoryOwner$ref
  |}
|};
export type userMentionTooltipItemQuery = {|
  variables: userMentionTooltipItemQueryVariables,
  response: userMentionTooltipItemQueryResponse,
|};
*/

/*
query userMentionTooltipItemQuery(
  $username: String!
) {
  repositoryOwner(login: $username) {
    __typename
    ...userMentionTooltipContainer_repositoryOwner
    id
  }
}

fragment userMentionTooltipContainer_repositoryOwner on RepositoryOwner {
  login
  avatarUrl
  repositories {
    totalCount
  }
  ... on User {
    company
  }
  ... on Organization {
    membersWithRole {
      totalCount
    }
  }
}
*/
const node /*: ConcreteRequest*/ = function () {
  var v0 = [{
      "kind": "LocalArgument",
      "name": "username",
      "type": "String!",
      "defaultValue": null
    }],
    v1 = [{
      "kind": "Variable",
      "name": "login",
      "variableName": "username"
    }],
    v2 = [{
      "kind": "ScalarField",
      "alias": null,
      "name": "totalCount",
      "args": null,
      "storageKey": null
    }];
  return {
    "kind": "Request",
    "fragment": {
      "kind": "Fragment",
      "name": "userMentionTooltipItemQuery",
      "type": "Query",
      "metadata": null,
      "argumentDefinitions": v0 /*: any*/,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "repositoryOwner",
        "storageKey": null,
        "args": v1 /*: any*/,
        "concreteType": null,
        "plural": false,
        "selections": [{
          "kind": "FragmentSpread",
          "name": "userMentionTooltipContainer_repositoryOwner",
          "args": null
        }]
      }]
    },
    "operation": {
      "kind": "Operation",
      "name": "userMentionTooltipItemQuery",
      "argumentDefinitions": v0 /*: any*/,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "repositoryOwner",
        "storageKey": null,
        "args": v1 /*: any*/,
        "concreteType": null,
        "plural": false,
        "selections": [{
          "kind": "ScalarField",
          "alias": null,
          "name": "__typename",
          "args": null,
          "storageKey": null
        }, {
          "kind": "ScalarField",
          "alias": null,
          "name": "login",
          "args": null,
          "storageKey": null
        }, {
          "kind": "ScalarField",
          "alias": null,
          "name": "avatarUrl",
          "args": null,
          "storageKey": null
        }, {
          "kind": "LinkedField",
          "alias": null,
          "name": "repositories",
          "storageKey": null,
          "args": null,
          "concreteType": "RepositoryConnection",
          "plural": false,
          "selections": v2 /*: any*/
        }, {
          "kind": "ScalarField",
          "alias": null,
          "name": "id",
          "args": null,
          "storageKey": null
        }, {
          "kind": "InlineFragment",
          "type": "User",
          "selections": [{
            "kind": "ScalarField",
            "alias": null,
            "name": "company",
            "args": null,
            "storageKey": null
          }]
        }, {
          "kind": "InlineFragment",
          "type": "Organization",
          "selections": [{
            "kind": "LinkedField",
            "alias": null,
            "name": "membersWithRole",
            "storageKey": null,
            "args": null,
            "concreteType": "OrganizationMemberConnection",
            "plural": false,
            "selections": v2 /*: any*/
          }]
        }]
      }]
    },
    "params": {
      "operationKind": "query",
      "name": "userMentionTooltipItemQuery",
      "id": null,
      "text": "query userMentionTooltipItemQuery(\n  $username: String!\n) {\n  repositoryOwner(login: $username) {\n    __typename\n    ...userMentionTooltipContainer_repositoryOwner\n    id\n  }\n}\n\nfragment userMentionTooltipContainer_repositoryOwner on RepositoryOwner {\n  login\n  avatarUrl\n  repositories {\n    totalCount\n  }\n  ... on User {\n    company\n  }\n  ... on Organization {\n    membersWithRole {\n      totalCount\n    }\n  }\n}\n",
      "metadata": {}
    }
  };
}();
// prettier-ignore
node /*: any*/.hash = 'c0e8b6f6d3028f3f2679ce9e1486981e';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJub2RlIiwidjAiLCJ2MSIsInYyIiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwic291cmNlcyI6WyJ1c2VyTWVudGlvblRvb2x0aXBJdGVtUXVlcnkuZ3JhcGhxbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmbG93XG4gKiBAcmVsYXlIYXNoIGE2MWU4MTdiNmQ1ZTE5ZGFlOWE4YTdmNGY0ZTE1NmZhXG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKjo6XG5pbXBvcnQgdHlwZSB7IENvbmNyZXRlUmVxdWVzdCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xudHlwZSB1c2VyTWVudGlvblRvb2x0aXBDb250YWluZXJfcmVwb3NpdG9yeU93bmVyJHJlZiA9IGFueTtcbmV4cG9ydCB0eXBlIHVzZXJNZW50aW9uVG9vbHRpcEl0ZW1RdWVyeVZhcmlhYmxlcyA9IHt8XG4gIHVzZXJuYW1lOiBzdHJpbmdcbnx9O1xuZXhwb3J0IHR5cGUgdXNlck1lbnRpb25Ub29sdGlwSXRlbVF1ZXJ5UmVzcG9uc2UgPSB7fFxuICArcmVwb3NpdG9yeU93bmVyOiA/e3xcbiAgICArJGZyYWdtZW50UmVmczogdXNlck1lbnRpb25Ub29sdGlwQ29udGFpbmVyX3JlcG9zaXRvcnlPd25lciRyZWZcbiAgfH1cbnx9O1xuZXhwb3J0IHR5cGUgdXNlck1lbnRpb25Ub29sdGlwSXRlbVF1ZXJ5ID0ge3xcbiAgdmFyaWFibGVzOiB1c2VyTWVudGlvblRvb2x0aXBJdGVtUXVlcnlWYXJpYWJsZXMsXG4gIHJlc3BvbnNlOiB1c2VyTWVudGlvblRvb2x0aXBJdGVtUXVlcnlSZXNwb25zZSxcbnx9O1xuKi9cblxuXG4vKlxucXVlcnkgdXNlck1lbnRpb25Ub29sdGlwSXRlbVF1ZXJ5KFxuICAkdXNlcm5hbWU6IFN0cmluZyFcbikge1xuICByZXBvc2l0b3J5T3duZXIobG9naW46ICR1c2VybmFtZSkge1xuICAgIF9fdHlwZW5hbWVcbiAgICAuLi51c2VyTWVudGlvblRvb2x0aXBDb250YWluZXJfcmVwb3NpdG9yeU93bmVyXG4gICAgaWRcbiAgfVxufVxuXG5mcmFnbWVudCB1c2VyTWVudGlvblRvb2x0aXBDb250YWluZXJfcmVwb3NpdG9yeU93bmVyIG9uIFJlcG9zaXRvcnlPd25lciB7XG4gIGxvZ2luXG4gIGF2YXRhclVybFxuICByZXBvc2l0b3JpZXMge1xuICAgIHRvdGFsQ291bnRcbiAgfVxuICAuLi4gb24gVXNlciB7XG4gICAgY29tcGFueVxuICB9XG4gIC4uLiBvbiBPcmdhbml6YXRpb24ge1xuICAgIG1lbWJlcnNXaXRoUm9sZSB7XG4gICAgICB0b3RhbENvdW50XG4gICAgfVxuICB9XG59XG4qL1xuXG5jb25zdCBub2RlLyo6IENvbmNyZXRlUmVxdWVzdCovID0gKGZ1bmN0aW9uKCl7XG52YXIgdjAgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwidXNlcm5hbWVcIixcbiAgICBcInR5cGVcIjogXCJTdHJpbmchXCIsXG4gICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICB9XG5dLFxudjEgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgIFwibmFtZVwiOiBcImxvZ2luXCIsXG4gICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJ1c2VybmFtZVwiXG4gIH1cbl0sXG52MiA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgXCJhbGlhc1wiOiBudWxsLFxuICAgIFwibmFtZVwiOiBcInRvdGFsQ291bnRcIixcbiAgICBcImFyZ3NcIjogbnVsbCxcbiAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICB9XG5dO1xucmV0dXJuIHtcbiAgXCJraW5kXCI6IFwiUmVxdWVzdFwiLFxuICBcImZyYWdtZW50XCI6IHtcbiAgICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICAgIFwibmFtZVwiOiBcInVzZXJNZW50aW9uVG9vbHRpcEl0ZW1RdWVyeVwiLFxuICAgIFwidHlwZVwiOiBcIlF1ZXJ5XCIsXG4gICAgXCJtZXRhZGF0YVwiOiBudWxsLFxuICAgIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiAodjAvKjogYW55Ki8pLFxuICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgXCJuYW1lXCI6IFwicmVwb3NpdG9yeU93bmVyXCIsXG4gICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICBcImFyZ3NcIjogKHYxLyo6IGFueSovKSxcbiAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiRnJhZ21lbnRTcHJlYWRcIixcbiAgICAgICAgICAgIFwibmFtZVwiOiBcInVzZXJNZW50aW9uVG9vbHRpcENvbnRhaW5lcl9yZXBvc2l0b3J5T3duZXJcIixcbiAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9LFxuICBcIm9wZXJhdGlvblwiOiB7XG4gICAgXCJraW5kXCI6IFwiT3BlcmF0aW9uXCIsXG4gICAgXCJuYW1lXCI6IFwidXNlck1lbnRpb25Ub29sdGlwSXRlbVF1ZXJ5XCIsXG4gICAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6ICh2MC8qOiBhbnkqLyksXG4gICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICBcIm5hbWVcIjogXCJyZXBvc2l0b3J5T3duZXJcIixcbiAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgIFwiYXJnc1wiOiAodjEvKjogYW55Ki8pLFxuICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBudWxsLFxuICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiX190eXBlbmFtZVwiLFxuICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImxvZ2luXCIsXG4gICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwiYXZhdGFyVXJsXCIsXG4gICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwicmVwb3NpdG9yaWVzXCIsXG4gICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJSZXBvc2l0b3J5Q29ubmVjdGlvblwiLFxuICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogKHYyLyo6IGFueSovKVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImlkXCIsXG4gICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJJbmxpbmVGcmFnbWVudFwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiVXNlclwiLFxuICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbXBhbnlcIixcbiAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJJbmxpbmVGcmFnbWVudFwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiT3JnYW5pemF0aW9uXCIsXG4gICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibWVtYmVyc1dpdGhSb2xlXCIsXG4gICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJPcmdhbml6YXRpb25NZW1iZXJDb25uZWN0aW9uXCIsXG4gICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6ICh2Mi8qOiBhbnkqLylcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAgXCJwYXJhbXNcIjoge1xuICAgIFwib3BlcmF0aW9uS2luZFwiOiBcInF1ZXJ5XCIsXG4gICAgXCJuYW1lXCI6IFwidXNlck1lbnRpb25Ub29sdGlwSXRlbVF1ZXJ5XCIsXG4gICAgXCJpZFwiOiBudWxsLFxuICAgIFwidGV4dFwiOiBcInF1ZXJ5IHVzZXJNZW50aW9uVG9vbHRpcEl0ZW1RdWVyeShcXG4gICR1c2VybmFtZTogU3RyaW5nIVxcbikge1xcbiAgcmVwb3NpdG9yeU93bmVyKGxvZ2luOiAkdXNlcm5hbWUpIHtcXG4gICAgX190eXBlbmFtZVxcbiAgICAuLi51c2VyTWVudGlvblRvb2x0aXBDb250YWluZXJfcmVwb3NpdG9yeU93bmVyXFxuICAgIGlkXFxuICB9XFxufVxcblxcbmZyYWdtZW50IHVzZXJNZW50aW9uVG9vbHRpcENvbnRhaW5lcl9yZXBvc2l0b3J5T3duZXIgb24gUmVwb3NpdG9yeU93bmVyIHtcXG4gIGxvZ2luXFxuICBhdmF0YXJVcmxcXG4gIHJlcG9zaXRvcmllcyB7XFxuICAgIHRvdGFsQ291bnRcXG4gIH1cXG4gIC4uLiBvbiBVc2VyIHtcXG4gICAgY29tcGFueVxcbiAgfVxcbiAgLi4uIG9uIE9yZ2FuaXphdGlvbiB7XFxuICAgIG1lbWJlcnNXaXRoUm9sZSB7XFxuICAgICAgdG90YWxDb3VudFxcbiAgICB9XFxuICB9XFxufVxcblwiLFxuICAgIFwibWV0YWRhdGFcIjoge31cbiAgfVxufTtcbn0pKCk7XG4vLyBwcmV0dGllci1pZ25vcmVcbihub2RlLyo6IGFueSovKS5oYXNoID0gJ2MwZThiNmY2ZDMwMjhmM2YyNjc5Y2U5ZTE0ODY5ODFlJztcbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsWUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxNQUFNQSxJQUFJLHlCQUF5QixZQUFVO0VBQzdDLElBQUlDLEVBQUUsR0FBRyxDQUNQO01BQ0UsTUFBTSxFQUFFLGVBQWU7TUFDdkIsTUFBTSxFQUFFLFVBQVU7TUFDbEIsTUFBTSxFQUFFLFNBQVM7TUFDakIsY0FBYyxFQUFFO0lBQ2xCLENBQUMsQ0FDRjtJQUNEQyxFQUFFLEdBQUcsQ0FDSDtNQUNFLE1BQU0sRUFBRSxVQUFVO01BQ2xCLE1BQU0sRUFBRSxPQUFPO01BQ2YsY0FBYyxFQUFFO0lBQ2xCLENBQUMsQ0FDRjtJQUNEQyxFQUFFLEdBQUcsQ0FDSDtNQUNFLE1BQU0sRUFBRSxhQUFhO01BQ3JCLE9BQU8sRUFBRSxJQUFJO01BQ2IsTUFBTSxFQUFFLFlBQVk7TUFDcEIsTUFBTSxFQUFFLElBQUk7TUFDWixZQUFZLEVBQUU7SUFDaEIsQ0FBQyxDQUNGO0VBQ0QsT0FBTztJQUNMLE1BQU0sRUFBRSxTQUFTO0lBQ2pCLFVBQVUsRUFBRTtNQUNWLE1BQU0sRUFBRSxVQUFVO01BQ2xCLE1BQU0sRUFBRSw2QkFBNkI7TUFDckMsTUFBTSxFQUFFLE9BQU87TUFDZixVQUFVLEVBQUUsSUFBSTtNQUNoQixxQkFBcUIsRUFBR0YsRUFBRSxVQUFVO01BQ3BDLFlBQVksRUFBRSxDQUNaO1FBQ0UsTUFBTSxFQUFFLGFBQWE7UUFDckIsT0FBTyxFQUFFLElBQUk7UUFDYixNQUFNLEVBQUUsaUJBQWlCO1FBQ3pCLFlBQVksRUFBRSxJQUFJO1FBQ2xCLE1BQU0sRUFBR0MsRUFBRSxVQUFVO1FBQ3JCLGNBQWMsRUFBRSxJQUFJO1FBQ3BCLFFBQVEsRUFBRSxLQUFLO1FBQ2YsWUFBWSxFQUFFLENBQ1o7VUFDRSxNQUFNLEVBQUUsZ0JBQWdCO1VBQ3hCLE1BQU0sRUFBRSw2Q0FBNkM7VUFDckQsTUFBTSxFQUFFO1FBQ1YsQ0FBQztNQUVMLENBQUM7SUFFTCxDQUFDO0lBQ0QsV0FBVyxFQUFFO01BQ1gsTUFBTSxFQUFFLFdBQVc7TUFDbkIsTUFBTSxFQUFFLDZCQUE2QjtNQUNyQyxxQkFBcUIsRUFBR0QsRUFBRSxVQUFVO01BQ3BDLFlBQVksRUFBRSxDQUNaO1FBQ0UsTUFBTSxFQUFFLGFBQWE7UUFDckIsT0FBTyxFQUFFLElBQUk7UUFDYixNQUFNLEVBQUUsaUJBQWlCO1FBQ3pCLFlBQVksRUFBRSxJQUFJO1FBQ2xCLE1BQU0sRUFBR0MsRUFBRSxVQUFVO1FBQ3JCLGNBQWMsRUFBRSxJQUFJO1FBQ3BCLFFBQVEsRUFBRSxLQUFLO1FBQ2YsWUFBWSxFQUFFLENBQ1o7VUFDRSxNQUFNLEVBQUUsYUFBYTtVQUNyQixPQUFPLEVBQUUsSUFBSTtVQUNiLE1BQU0sRUFBRSxZQUFZO1VBQ3BCLE1BQU0sRUFBRSxJQUFJO1VBQ1osWUFBWSxFQUFFO1FBQ2hCLENBQUMsRUFDRDtVQUNFLE1BQU0sRUFBRSxhQUFhO1VBQ3JCLE9BQU8sRUFBRSxJQUFJO1VBQ2IsTUFBTSxFQUFFLE9BQU87VUFDZixNQUFNLEVBQUUsSUFBSTtVQUNaLFlBQVksRUFBRTtRQUNoQixDQUFDLEVBQ0Q7VUFDRSxNQUFNLEVBQUUsYUFBYTtVQUNyQixPQUFPLEVBQUUsSUFBSTtVQUNiLE1BQU0sRUFBRSxXQUFXO1VBQ25CLE1BQU0sRUFBRSxJQUFJO1VBQ1osWUFBWSxFQUFFO1FBQ2hCLENBQUMsRUFDRDtVQUNFLE1BQU0sRUFBRSxhQUFhO1VBQ3JCLE9BQU8sRUFBRSxJQUFJO1VBQ2IsTUFBTSxFQUFFLGNBQWM7VUFDdEIsWUFBWSxFQUFFLElBQUk7VUFDbEIsTUFBTSxFQUFFLElBQUk7VUFDWixjQUFjLEVBQUUsc0JBQXNCO1VBQ3RDLFFBQVEsRUFBRSxLQUFLO1VBQ2YsWUFBWSxFQUFHQyxFQUFFO1FBQ25CLENBQUMsRUFDRDtVQUNFLE1BQU0sRUFBRSxhQUFhO1VBQ3JCLE9BQU8sRUFBRSxJQUFJO1VBQ2IsTUFBTSxFQUFFLElBQUk7VUFDWixNQUFNLEVBQUUsSUFBSTtVQUNaLFlBQVksRUFBRTtRQUNoQixDQUFDLEVBQ0Q7VUFDRSxNQUFNLEVBQUUsZ0JBQWdCO1VBQ3hCLE1BQU0sRUFBRSxNQUFNO1VBQ2QsWUFBWSxFQUFFLENBQ1o7WUFDRSxNQUFNLEVBQUUsYUFBYTtZQUNyQixPQUFPLEVBQUUsSUFBSTtZQUNiLE1BQU0sRUFBRSxTQUFTO1lBQ2pCLE1BQU0sRUFBRSxJQUFJO1lBQ1osWUFBWSxFQUFFO1VBQ2hCLENBQUM7UUFFTCxDQUFDLEVBQ0Q7VUFDRSxNQUFNLEVBQUUsZ0JBQWdCO1VBQ3hCLE1BQU0sRUFBRSxjQUFjO1VBQ3RCLFlBQVksRUFBRSxDQUNaO1lBQ0UsTUFBTSxFQUFFLGFBQWE7WUFDckIsT0FBTyxFQUFFLElBQUk7WUFDYixNQUFNLEVBQUUsaUJBQWlCO1lBQ3pCLFlBQVksRUFBRSxJQUFJO1lBQ2xCLE1BQU0sRUFBRSxJQUFJO1lBQ1osY0FBYyxFQUFFLDhCQUE4QjtZQUM5QyxRQUFRLEVBQUUsS0FBSztZQUNmLFlBQVksRUFBR0EsRUFBRTtVQUNuQixDQUFDO1FBRUwsQ0FBQztNQUVMLENBQUM7SUFFTCxDQUFDO0lBQ0QsUUFBUSxFQUFFO01BQ1IsZUFBZSxFQUFFLE9BQU87TUFDeEIsTUFBTSxFQUFFLDZCQUE2QjtNQUNyQyxJQUFJLEVBQUUsSUFBSTtNQUNWLE1BQU0sRUFBRSwwYkFBMGI7TUFDbGMsVUFBVSxFQUFFLENBQUM7SUFDZjtFQUNGLENBQUM7QUFDRCxDQUFDLENBQUUsQ0FBQztBQUNKO0FBQ0NILElBQUksV0FBV0ksSUFBSSxHQUFHLGtDQUFrQztBQUN6REMsTUFBTSxDQUFDQyxPQUFPLEdBQUdOLElBQUkifQ==