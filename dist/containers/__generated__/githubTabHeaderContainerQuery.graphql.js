/**
 * @flow
 * @relayHash 180d6bab8f919e61ddfec71b206e25a5
 */

/* eslint-disable */
'use strict';
/*::
import type { ConcreteRequest } from 'relay-runtime';
export type githubTabHeaderContainerQueryVariables = {||};
export type githubTabHeaderContainerQueryResponse = {|
  +viewer: {|
    +name: ?string,
    +email: string,
    +avatarUrl: any,
    +login: string,
  |}
|};
export type githubTabHeaderContainerQuery = {|
  variables: githubTabHeaderContainerQueryVariables,
  response: githubTabHeaderContainerQueryResponse,
|};
*/

/*
query githubTabHeaderContainerQuery {
  viewer {
    name
    email
    avatarUrl
    login
    id
  }
}
*/

const node
/*: ConcreteRequest*/
= function () {
  var v0 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "name",
    "args": null,
    "storageKey": null
  },
      v1 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "email",
    "args": null,
    "storageKey": null
  },
      v2 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "avatarUrl",
    "args": null,
    "storageKey": null
  },
      v3 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "login",
    "args": null,
    "storageKey": null
  };
  return {
    "kind": "Request",
    "fragment": {
      "kind": "Fragment",
      "name": "githubTabHeaderContainerQuery",
      "type": "Query",
      "metadata": null,
      "argumentDefinitions": [],
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "User",
        "plural": false,
        "selections": [v0
        /*: any*/
        , v1
        /*: any*/
        , v2
        /*: any*/
        , v3
        /*: any*/
        ]
      }]
    },
    "operation": {
      "kind": "Operation",
      "name": "githubTabHeaderContainerQuery",
      "argumentDefinitions": [],
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "viewer",
        "storageKey": null,
        "args": null,
        "concreteType": "User",
        "plural": false,
        "selections": [v0
        /*: any*/
        , v1
        /*: any*/
        , v2
        /*: any*/
        , v3
        /*: any*/
        , {
          "kind": "ScalarField",
          "alias": null,
          "name": "id",
          "args": null,
          "storageKey": null
        }]
      }]
    },
    "params": {
      "operationKind": "query",
      "name": "githubTabHeaderContainerQuery",
      "id": null,
      "text": "query githubTabHeaderContainerQuery {\n  viewer {\n    name\n    email\n    avatarUrl\n    login\n    id\n  }\n}\n",
      "metadata": {}
    }
  };
}(); // prettier-ignore


node
/*: any*/
.hash = '003bcc6b15469f788437eba2b4ce780b';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9jb250YWluZXJzL19fZ2VuZXJhdGVkX18vZ2l0aHViVGFiSGVhZGVyQ29udGFpbmVyUXVlcnkuZ3JhcGhxbC5qcyJdLCJuYW1lcyI6WyJub2RlIiwidjAiLCJ2MSIsInYyIiwidjMiLCJoYXNoIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsTUFBTUE7QUFBSTtBQUFBLEVBQXlCLFlBQVU7QUFDN0MsTUFBSUMsRUFBRSxHQUFHO0FBQ1AsWUFBUSxhQUREO0FBRVAsYUFBUyxJQUZGO0FBR1AsWUFBUSxNQUhEO0FBSVAsWUFBUSxJQUpEO0FBS1Asa0JBQWM7QUFMUCxHQUFUO0FBQUEsTUFPQUMsRUFBRSxHQUFHO0FBQ0gsWUFBUSxhQURMO0FBRUgsYUFBUyxJQUZOO0FBR0gsWUFBUSxPQUhMO0FBSUgsWUFBUSxJQUpMO0FBS0gsa0JBQWM7QUFMWCxHQVBMO0FBQUEsTUFjQUMsRUFBRSxHQUFHO0FBQ0gsWUFBUSxhQURMO0FBRUgsYUFBUyxJQUZOO0FBR0gsWUFBUSxXQUhMO0FBSUgsWUFBUSxJQUpMO0FBS0gsa0JBQWM7QUFMWCxHQWRMO0FBQUEsTUFxQkFDLEVBQUUsR0FBRztBQUNILFlBQVEsYUFETDtBQUVILGFBQVMsSUFGTjtBQUdILFlBQVEsT0FITDtBQUlILFlBQVEsSUFKTDtBQUtILGtCQUFjO0FBTFgsR0FyQkw7QUE0QkEsU0FBTztBQUNMLFlBQVEsU0FESDtBQUVMLGdCQUFZO0FBQ1YsY0FBUSxVQURFO0FBRVYsY0FBUSwrQkFGRTtBQUdWLGNBQVEsT0FIRTtBQUlWLGtCQUFZLElBSkY7QUFLViw2QkFBdUIsRUFMYjtBQU1WLG9CQUFjLENBQ1o7QUFDRSxnQkFBUSxhQURWO0FBRUUsaUJBQVMsSUFGWDtBQUdFLGdCQUFRLFFBSFY7QUFJRSxzQkFBYyxJQUpoQjtBQUtFLGdCQUFRLElBTFY7QUFNRSx3QkFBZ0IsTUFObEI7QUFPRSxrQkFBVSxLQVBaO0FBUUUsc0JBQWMsQ0FDWEg7QUFBRTtBQURTLFVBRVhDO0FBQUU7QUFGUyxVQUdYQztBQUFFO0FBSFMsVUFJWEM7QUFBRTtBQUpTO0FBUmhCLE9BRFk7QUFOSixLQUZQO0FBMEJMLGlCQUFhO0FBQ1gsY0FBUSxXQURHO0FBRVgsY0FBUSwrQkFGRztBQUdYLDZCQUF1QixFQUhaO0FBSVgsb0JBQWMsQ0FDWjtBQUNFLGdCQUFRLGFBRFY7QUFFRSxpQkFBUyxJQUZYO0FBR0UsZ0JBQVEsUUFIVjtBQUlFLHNCQUFjLElBSmhCO0FBS0UsZ0JBQVEsSUFMVjtBQU1FLHdCQUFnQixNQU5sQjtBQU9FLGtCQUFVLEtBUFo7QUFRRSxzQkFBYyxDQUNYSDtBQUFFO0FBRFMsVUFFWEM7QUFBRTtBQUZTLFVBR1hDO0FBQUU7QUFIUyxVQUlYQztBQUFFO0FBSlMsVUFLWjtBQUNFLGtCQUFRLGFBRFY7QUFFRSxtQkFBUyxJQUZYO0FBR0Usa0JBQVEsSUFIVjtBQUlFLGtCQUFRLElBSlY7QUFLRSx3QkFBYztBQUxoQixTQUxZO0FBUmhCLE9BRFk7QUFKSCxLQTFCUjtBQXVETCxjQUFVO0FBQ1IsdUJBQWlCLE9BRFQ7QUFFUixjQUFRLCtCQUZBO0FBR1IsWUFBTSxJQUhFO0FBSVIsY0FBUSxvSEFKQTtBQUtSLGtCQUFZO0FBTEo7QUF2REwsR0FBUDtBQStEQyxDQTVGaUMsRUFBbEMsQyxDQTZGQTs7O0FBQ0NKO0FBQUk7QUFBTCxDQUFnQkssSUFBaEIsR0FBdUIsa0NBQXZCO0FBQ0FDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQlAsSUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmbG93XG4gKiBAcmVsYXlIYXNoIDE4MGQ2YmFiOGY5MTllNjFkZGZlYzcxYjIwNmUyNWE1XG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKjo6XG5pbXBvcnQgdHlwZSB7IENvbmNyZXRlUmVxdWVzdCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xuZXhwb3J0IHR5cGUgZ2l0aHViVGFiSGVhZGVyQ29udGFpbmVyUXVlcnlWYXJpYWJsZXMgPSB7fHx9O1xuZXhwb3J0IHR5cGUgZ2l0aHViVGFiSGVhZGVyQ29udGFpbmVyUXVlcnlSZXNwb25zZSA9IHt8XG4gICt2aWV3ZXI6IHt8XG4gICAgK25hbWU6ID9zdHJpbmcsXG4gICAgK2VtYWlsOiBzdHJpbmcsXG4gICAgK2F2YXRhclVybDogYW55LFxuICAgICtsb2dpbjogc3RyaW5nLFxuICB8fVxufH07XG5leHBvcnQgdHlwZSBnaXRodWJUYWJIZWFkZXJDb250YWluZXJRdWVyeSA9IHt8XG4gIHZhcmlhYmxlczogZ2l0aHViVGFiSGVhZGVyQ29udGFpbmVyUXVlcnlWYXJpYWJsZXMsXG4gIHJlc3BvbnNlOiBnaXRodWJUYWJIZWFkZXJDb250YWluZXJRdWVyeVJlc3BvbnNlLFxufH07XG4qL1xuXG5cbi8qXG5xdWVyeSBnaXRodWJUYWJIZWFkZXJDb250YWluZXJRdWVyeSB7XG4gIHZpZXdlciB7XG4gICAgbmFtZVxuICAgIGVtYWlsXG4gICAgYXZhdGFyVXJsXG4gICAgbG9naW5cbiAgICBpZFxuICB9XG59XG4qL1xuXG5jb25zdCBub2RlLyo6IENvbmNyZXRlUmVxdWVzdCovID0gKGZ1bmN0aW9uKCl7XG52YXIgdjAgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwibmFtZVwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52MSA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJlbWFpbFwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52MiA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJhdmF0YXJVcmxcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjMgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwibG9naW5cIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59O1xucmV0dXJuIHtcbiAgXCJraW5kXCI6IFwiUmVxdWVzdFwiLFxuICBcImZyYWdtZW50XCI6IHtcbiAgICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICAgIFwibmFtZVwiOiBcImdpdGh1YlRhYkhlYWRlckNvbnRhaW5lclF1ZXJ5XCIsXG4gICAgXCJ0eXBlXCI6IFwiUXVlcnlcIixcbiAgICBcIm1ldGFkYXRhXCI6IG51bGwsXG4gICAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6IFtdLFxuICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgXCJuYW1lXCI6IFwidmlld2VyXCIsXG4gICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJVc2VyXCIsXG4gICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICh2MC8qOiBhbnkqLyksXG4gICAgICAgICAgKHYxLyo6IGFueSovKSxcbiAgICAgICAgICAodjIvKjogYW55Ki8pLFxuICAgICAgICAgICh2My8qOiBhbnkqLylcbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAgXCJvcGVyYXRpb25cIjoge1xuICAgIFwia2luZFwiOiBcIk9wZXJhdGlvblwiLFxuICAgIFwibmFtZVwiOiBcImdpdGh1YlRhYkhlYWRlckNvbnRhaW5lclF1ZXJ5XCIsXG4gICAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6IFtdLFxuICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgXCJuYW1lXCI6IFwidmlld2VyXCIsXG4gICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJVc2VyXCIsXG4gICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICh2MC8qOiBhbnkqLyksXG4gICAgICAgICAgKHYxLyo6IGFueSovKSxcbiAgICAgICAgICAodjIvKjogYW55Ki8pLFxuICAgICAgICAgICh2My8qOiBhbnkqLyksXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImlkXCIsXG4gICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9LFxuICBcInBhcmFtc1wiOiB7XG4gICAgXCJvcGVyYXRpb25LaW5kXCI6IFwicXVlcnlcIixcbiAgICBcIm5hbWVcIjogXCJnaXRodWJUYWJIZWFkZXJDb250YWluZXJRdWVyeVwiLFxuICAgIFwiaWRcIjogbnVsbCxcbiAgICBcInRleHRcIjogXCJxdWVyeSBnaXRodWJUYWJIZWFkZXJDb250YWluZXJRdWVyeSB7XFxuICB2aWV3ZXIge1xcbiAgICBuYW1lXFxuICAgIGVtYWlsXFxuICAgIGF2YXRhclVybFxcbiAgICBsb2dpblxcbiAgICBpZFxcbiAgfVxcbn1cXG5cIixcbiAgICBcIm1ldGFkYXRhXCI6IHt9XG4gIH1cbn07XG59KSgpO1xuLy8gcHJldHRpZXItaWdub3JlXG4obm9kZS8qOiBhbnkqLykuaGFzaCA9ICcwMDNiY2M2YjE1NDY5Zjc4ODQzN2ViYTJiNGNlNzgwYic7XG5tb2R1bGUuZXhwb3J0cyA9IG5vZGU7XG4iXX0=