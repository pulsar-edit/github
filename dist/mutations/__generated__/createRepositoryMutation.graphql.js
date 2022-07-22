/**
 * @flow
 * @relayHash f8963f231e08ebd4d2cffd1223e19770
 */

/* eslint-disable */
'use strict';
/*::
import type { ConcreteRequest } from 'relay-runtime';
export type RepositoryVisibility = "INTERNAL" | "PRIVATE" | "PUBLIC" | "%future added value";
export type CreateRepositoryInput = {|
  name: string,
  ownerId?: ?string,
  description?: ?string,
  visibility: RepositoryVisibility,
  template?: ?boolean,
  homepageUrl?: ?any,
  hasWikiEnabled?: ?boolean,
  hasIssuesEnabled?: ?boolean,
  teamId?: ?string,
  clientMutationId?: ?string,
|};
export type createRepositoryMutationVariables = {|
  input: CreateRepositoryInput
|};
export type createRepositoryMutationResponse = {|
  +createRepository: ?{|
    +repository: ?{|
      +sshUrl: any,
      +url: any,
    |}
  |}
|};
export type createRepositoryMutation = {|
  variables: createRepositoryMutationVariables,
  response: createRepositoryMutationResponse,
|};
*/

/*
mutation createRepositoryMutation(
  $input: CreateRepositoryInput!
) {
  createRepository(input: $input) {
    repository {
      sshUrl
      url
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
    "name": "input",
    "type": "CreateRepositoryInput!",
    "defaultValue": null
  }],
      v1 = [{
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }],
      v2 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "sshUrl",
    "args": null,
    "storageKey": null
  },
      v3 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "url",
    "args": null,
    "storageKey": null
  };
  return {
    "kind": "Request",
    "fragment": {
      "kind": "Fragment",
      "name": "createRepositoryMutation",
      "type": "Mutation",
      "metadata": null,
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "createRepository",
        "storageKey": null,
        "args": v1
        /*: any*/
        ,
        "concreteType": "CreateRepositoryPayload",
        "plural": false,
        "selections": [{
          "kind": "LinkedField",
          "alias": null,
          "name": "repository",
          "storageKey": null,
          "args": null,
          "concreteType": "Repository",
          "plural": false,
          "selections": [v2
          /*: any*/
          , v3
          /*: any*/
          ]
        }]
      }]
    },
    "operation": {
      "kind": "Operation",
      "name": "createRepositoryMutation",
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "createRepository",
        "storageKey": null,
        "args": v1
        /*: any*/
        ,
        "concreteType": "CreateRepositoryPayload",
        "plural": false,
        "selections": [{
          "kind": "LinkedField",
          "alias": null,
          "name": "repository",
          "storageKey": null,
          "args": null,
          "concreteType": "Repository",
          "plural": false,
          "selections": [v2
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
      }]
    },
    "params": {
      "operationKind": "mutation",
      "name": "createRepositoryMutation",
      "id": null,
      "text": "mutation createRepositoryMutation(\n  $input: CreateRepositoryInput!\n) {\n  createRepository(input: $input) {\n    repository {\n      sshUrl\n      url\n      id\n    }\n  }\n}\n",
      "metadata": {}
    }
  };
}(); // prettier-ignore


node
/*: any*/
.hash = 'e8f154d9f35411a15f77583bb44f7ed5';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9tdXRhdGlvbnMvX19nZW5lcmF0ZWRfXy9jcmVhdGVSZXBvc2l0b3J5TXV0YXRpb24uZ3JhcGhxbC5qcyJdLCJuYW1lcyI6WyJub2RlIiwidjAiLCJ2MSIsInYyIiwidjMiLCJoYXNoIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQU1BO0FBQUk7QUFBQSxFQUF5QixZQUFVO0FBQzdDLE1BQUlDLEVBQUUsR0FBRyxDQUNQO0FBQ0UsWUFBUSxlQURWO0FBRUUsWUFBUSxPQUZWO0FBR0UsWUFBUSx3QkFIVjtBQUlFLG9CQUFnQjtBQUpsQixHQURPLENBQVQ7QUFBQSxNQVFBQyxFQUFFLEdBQUcsQ0FDSDtBQUNFLFlBQVEsVUFEVjtBQUVFLFlBQVEsT0FGVjtBQUdFLG9CQUFnQjtBQUhsQixHQURHLENBUkw7QUFBQSxNQWVBQyxFQUFFLEdBQUc7QUFDSCxZQUFRLGFBREw7QUFFSCxhQUFTLElBRk47QUFHSCxZQUFRLFFBSEw7QUFJSCxZQUFRLElBSkw7QUFLSCxrQkFBYztBQUxYLEdBZkw7QUFBQSxNQXNCQUMsRUFBRSxHQUFHO0FBQ0gsWUFBUSxhQURMO0FBRUgsYUFBUyxJQUZOO0FBR0gsWUFBUSxLQUhMO0FBSUgsWUFBUSxJQUpMO0FBS0gsa0JBQWM7QUFMWCxHQXRCTDtBQTZCQSxTQUFPO0FBQ0wsWUFBUSxTQURIO0FBRUwsZ0JBQVk7QUFDVixjQUFRLFVBREU7QUFFVixjQUFRLDBCQUZFO0FBR1YsY0FBUSxVQUhFO0FBSVYsa0JBQVksSUFKRjtBQUtWLDZCQUF3Qkg7QUFBRTtBQUxoQjtBQU1WLG9CQUFjLENBQ1o7QUFDRSxnQkFBUSxhQURWO0FBRUUsaUJBQVMsSUFGWDtBQUdFLGdCQUFRLGtCQUhWO0FBSUUsc0JBQWMsSUFKaEI7QUFLRSxnQkFBU0M7QUFBRTtBQUxiO0FBTUUsd0JBQWdCLHlCQU5sQjtBQU9FLGtCQUFVLEtBUFo7QUFRRSxzQkFBYyxDQUNaO0FBQ0Usa0JBQVEsYUFEVjtBQUVFLG1CQUFTLElBRlg7QUFHRSxrQkFBUSxZQUhWO0FBSUUsd0JBQWMsSUFKaEI7QUFLRSxrQkFBUSxJQUxWO0FBTUUsMEJBQWdCLFlBTmxCO0FBT0Usb0JBQVUsS0FQWjtBQVFFLHdCQUFjLENBQ1hDO0FBQUU7QUFEUyxZQUVYQztBQUFFO0FBRlM7QUFSaEIsU0FEWTtBQVJoQixPQURZO0FBTkosS0FGUDtBQW1DTCxpQkFBYTtBQUNYLGNBQVEsV0FERztBQUVYLGNBQVEsMEJBRkc7QUFHWCw2QkFBd0JIO0FBQUU7QUFIZjtBQUlYLG9CQUFjLENBQ1o7QUFDRSxnQkFBUSxhQURWO0FBRUUsaUJBQVMsSUFGWDtBQUdFLGdCQUFRLGtCQUhWO0FBSUUsc0JBQWMsSUFKaEI7QUFLRSxnQkFBU0M7QUFBRTtBQUxiO0FBTUUsd0JBQWdCLHlCQU5sQjtBQU9FLGtCQUFVLEtBUFo7QUFRRSxzQkFBYyxDQUNaO0FBQ0Usa0JBQVEsYUFEVjtBQUVFLG1CQUFTLElBRlg7QUFHRSxrQkFBUSxZQUhWO0FBSUUsd0JBQWMsSUFKaEI7QUFLRSxrQkFBUSxJQUxWO0FBTUUsMEJBQWdCLFlBTmxCO0FBT0Usb0JBQVUsS0FQWjtBQVFFLHdCQUFjLENBQ1hDO0FBQUU7QUFEUyxZQUVYQztBQUFFO0FBRlMsWUFHWjtBQUNFLG9CQUFRLGFBRFY7QUFFRSxxQkFBUyxJQUZYO0FBR0Usb0JBQVEsSUFIVjtBQUlFLG9CQUFRLElBSlY7QUFLRSwwQkFBYztBQUxoQixXQUhZO0FBUmhCLFNBRFk7QUFSaEIsT0FEWTtBQUpILEtBbkNSO0FBeUVMLGNBQVU7QUFDUix1QkFBaUIsVUFEVDtBQUVSLGNBQVEsMEJBRkE7QUFHUixZQUFNLElBSEU7QUFJUixjQUFRLHNMQUpBO0FBS1Isa0JBQVk7QUFMSjtBQXpFTCxHQUFQO0FBaUZDLENBL0dpQyxFQUFsQyxDLENBZ0hBOzs7QUFDQ0o7QUFBSTtBQUFMLENBQWdCSyxJQUFoQixHQUF1QixrQ0FBdkI7QUFDQUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCUCxJQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZsb3dcbiAqIEByZWxheUhhc2ggZjg5NjNmMjMxZTA4ZWJkNGQyY2ZmZDEyMjNlMTk3NzBcbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qOjpcbmltcG9ydCB0eXBlIHsgQ29uY3JldGVSZXF1ZXN0IH0gZnJvbSAncmVsYXktcnVudGltZSc7XG5leHBvcnQgdHlwZSBSZXBvc2l0b3J5VmlzaWJpbGl0eSA9IFwiSU5URVJOQUxcIiB8IFwiUFJJVkFURVwiIHwgXCJQVUJMSUNcIiB8IFwiJWZ1dHVyZSBhZGRlZCB2YWx1ZVwiO1xuZXhwb3J0IHR5cGUgQ3JlYXRlUmVwb3NpdG9yeUlucHV0ID0ge3xcbiAgbmFtZTogc3RyaW5nLFxuICBvd25lcklkPzogP3N0cmluZyxcbiAgZGVzY3JpcHRpb24/OiA/c3RyaW5nLFxuICB2aXNpYmlsaXR5OiBSZXBvc2l0b3J5VmlzaWJpbGl0eSxcbiAgdGVtcGxhdGU/OiA/Ym9vbGVhbixcbiAgaG9tZXBhZ2VVcmw/OiA/YW55LFxuICBoYXNXaWtpRW5hYmxlZD86ID9ib29sZWFuLFxuICBoYXNJc3N1ZXNFbmFibGVkPzogP2Jvb2xlYW4sXG4gIHRlYW1JZD86ID9zdHJpbmcsXG4gIGNsaWVudE11dGF0aW9uSWQ/OiA/c3RyaW5nLFxufH07XG5leHBvcnQgdHlwZSBjcmVhdGVSZXBvc2l0b3J5TXV0YXRpb25WYXJpYWJsZXMgPSB7fFxuICBpbnB1dDogQ3JlYXRlUmVwb3NpdG9yeUlucHV0XG58fTtcbmV4cG9ydCB0eXBlIGNyZWF0ZVJlcG9zaXRvcnlNdXRhdGlvblJlc3BvbnNlID0ge3xcbiAgK2NyZWF0ZVJlcG9zaXRvcnk6ID97fFxuICAgICtyZXBvc2l0b3J5OiA/e3xcbiAgICAgICtzc2hVcmw6IGFueSxcbiAgICAgICt1cmw6IGFueSxcbiAgICB8fVxuICB8fVxufH07XG5leHBvcnQgdHlwZSBjcmVhdGVSZXBvc2l0b3J5TXV0YXRpb24gPSB7fFxuICB2YXJpYWJsZXM6IGNyZWF0ZVJlcG9zaXRvcnlNdXRhdGlvblZhcmlhYmxlcyxcbiAgcmVzcG9uc2U6IGNyZWF0ZVJlcG9zaXRvcnlNdXRhdGlvblJlc3BvbnNlLFxufH07XG4qL1xuXG5cbi8qXG5tdXRhdGlvbiBjcmVhdGVSZXBvc2l0b3J5TXV0YXRpb24oXG4gICRpbnB1dDogQ3JlYXRlUmVwb3NpdG9yeUlucHV0IVxuKSB7XG4gIGNyZWF0ZVJlcG9zaXRvcnkoaW5wdXQ6ICRpbnB1dCkge1xuICAgIHJlcG9zaXRvcnkge1xuICAgICAgc3NoVXJsXG4gICAgICB1cmxcbiAgICAgIGlkXG4gICAgfVxuICB9XG59XG4qL1xuXG5jb25zdCBub2RlLyo6IENvbmNyZXRlUmVxdWVzdCovID0gKGZ1bmN0aW9uKCl7XG52YXIgdjAgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwiaW5wdXRcIixcbiAgICBcInR5cGVcIjogXCJDcmVhdGVSZXBvc2l0b3J5SW5wdXQhXCIsXG4gICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICB9XG5dLFxudjEgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgIFwibmFtZVwiOiBcImlucHV0XCIsXG4gICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJpbnB1dFwiXG4gIH1cbl0sXG52MiA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJzc2hVcmxcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjMgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwidXJsXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufTtcbnJldHVybiB7XG4gIFwia2luZFwiOiBcIlJlcXVlc3RcIixcbiAgXCJmcmFnbWVudFwiOiB7XG4gICAgXCJraW5kXCI6IFwiRnJhZ21lbnRcIixcbiAgICBcIm5hbWVcIjogXCJjcmVhdGVSZXBvc2l0b3J5TXV0YXRpb25cIixcbiAgICBcInR5cGVcIjogXCJNdXRhdGlvblwiLFxuICAgIFwibWV0YWRhdGFcIjogbnVsbCxcbiAgICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogKHYwLyo6IGFueSovKSxcbiAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAge1xuICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgIFwibmFtZVwiOiBcImNyZWF0ZVJlcG9zaXRvcnlcIixcbiAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgIFwiYXJnc1wiOiAodjEvKjogYW55Ki8pLFxuICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIkNyZWF0ZVJlcG9zaXRvcnlQYXlsb2FkXCIsXG4gICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJyZXBvc2l0b3J5XCIsXG4gICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJSZXBvc2l0b3J5XCIsXG4gICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICh2Mi8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICh2My8qOiBhbnkqLylcbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIFwib3BlcmF0aW9uXCI6IHtcbiAgICBcImtpbmRcIjogXCJPcGVyYXRpb25cIixcbiAgICBcIm5hbWVcIjogXCJjcmVhdGVSZXBvc2l0b3J5TXV0YXRpb25cIixcbiAgICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogKHYwLyo6IGFueSovKSxcbiAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAge1xuICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgIFwibmFtZVwiOiBcImNyZWF0ZVJlcG9zaXRvcnlcIixcbiAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgIFwiYXJnc1wiOiAodjEvKjogYW55Ki8pLFxuICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIkNyZWF0ZVJlcG9zaXRvcnlQYXlsb2FkXCIsXG4gICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJyZXBvc2l0b3J5XCIsXG4gICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJSZXBvc2l0b3J5XCIsXG4gICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICh2Mi8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICh2My8qOiBhbnkqLyksXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJpZFwiLFxuICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIFwicGFyYW1zXCI6IHtcbiAgICBcIm9wZXJhdGlvbktpbmRcIjogXCJtdXRhdGlvblwiLFxuICAgIFwibmFtZVwiOiBcImNyZWF0ZVJlcG9zaXRvcnlNdXRhdGlvblwiLFxuICAgIFwiaWRcIjogbnVsbCxcbiAgICBcInRleHRcIjogXCJtdXRhdGlvbiBjcmVhdGVSZXBvc2l0b3J5TXV0YXRpb24oXFxuICAkaW5wdXQ6IENyZWF0ZVJlcG9zaXRvcnlJbnB1dCFcXG4pIHtcXG4gIGNyZWF0ZVJlcG9zaXRvcnkoaW5wdXQ6ICRpbnB1dCkge1xcbiAgICByZXBvc2l0b3J5IHtcXG4gICAgICBzc2hVcmxcXG4gICAgICB1cmxcXG4gICAgICBpZFxcbiAgICB9XFxuICB9XFxufVxcblwiLFxuICAgIFwibWV0YWRhdGFcIjoge31cbiAgfVxufTtcbn0pKCk7XG4vLyBwcmV0dGllci1pZ25vcmVcbihub2RlLyo6IGFueSovKS5oYXNoID0gJ2U4ZjE1NGQ5ZjM1NDExYTE1Zjc3NTgzYmI0NGY3ZWQ1Jztcbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcbiJdfQ==