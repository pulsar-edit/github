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

const node
/*: ConcreteRequest*/
= function () {
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
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "repositoryOwner",
        "storageKey": null,
        "args": v1
        /*: any*/
        ,
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
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "repositoryOwner",
        "storageKey": null,
        "args": v1
        /*: any*/
        ,
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
          "selections": v2
          /*: any*/

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
            "selections": v2
            /*: any*/

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
}(); // prettier-ignore


node
/*: any*/
.hash = 'c0e8b6f6d3028f3f2679ce9e1486981e';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9pdGVtcy9fX2dlbmVyYXRlZF9fL3VzZXJNZW50aW9uVG9vbHRpcEl0ZW1RdWVyeS5ncmFwaHFsLmpzIl0sIm5hbWVzIjpbIm5vZGUiLCJ2MCIsInYxIiwidjIiLCJoYXNoIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxNQUFNQTtBQUFJO0FBQUEsRUFBeUIsWUFBVTtBQUM3QyxNQUFJQyxFQUFFLEdBQUcsQ0FDUDtBQUNFLFlBQVEsZUFEVjtBQUVFLFlBQVEsVUFGVjtBQUdFLFlBQVEsU0FIVjtBQUlFLG9CQUFnQjtBQUpsQixHQURPLENBQVQ7QUFBQSxNQVFBQyxFQUFFLEdBQUcsQ0FDSDtBQUNFLFlBQVEsVUFEVjtBQUVFLFlBQVEsT0FGVjtBQUdFLG9CQUFnQjtBQUhsQixHQURHLENBUkw7QUFBQSxNQWVBQyxFQUFFLEdBQUcsQ0FDSDtBQUNFLFlBQVEsYUFEVjtBQUVFLGFBQVMsSUFGWDtBQUdFLFlBQVEsWUFIVjtBQUlFLFlBQVEsSUFKVjtBQUtFLGtCQUFjO0FBTGhCLEdBREcsQ0FmTDtBQXdCQSxTQUFPO0FBQ0wsWUFBUSxTQURIO0FBRUwsZ0JBQVk7QUFDVixjQUFRLFVBREU7QUFFVixjQUFRLDZCQUZFO0FBR1YsY0FBUSxPQUhFO0FBSVYsa0JBQVksSUFKRjtBQUtWLDZCQUF3QkY7QUFBRTtBQUxoQjtBQU1WLG9CQUFjLENBQ1o7QUFDRSxnQkFBUSxhQURWO0FBRUUsaUJBQVMsSUFGWDtBQUdFLGdCQUFRLGlCQUhWO0FBSUUsc0JBQWMsSUFKaEI7QUFLRSxnQkFBU0M7QUFBRTtBQUxiO0FBTUUsd0JBQWdCLElBTmxCO0FBT0Usa0JBQVUsS0FQWjtBQVFFLHNCQUFjLENBQ1o7QUFDRSxrQkFBUSxnQkFEVjtBQUVFLGtCQUFRLDZDQUZWO0FBR0Usa0JBQVE7QUFIVixTQURZO0FBUmhCLE9BRFk7QUFOSixLQUZQO0FBMkJMLGlCQUFhO0FBQ1gsY0FBUSxXQURHO0FBRVgsY0FBUSw2QkFGRztBQUdYLDZCQUF3QkQ7QUFBRTtBQUhmO0FBSVgsb0JBQWMsQ0FDWjtBQUNFLGdCQUFRLGFBRFY7QUFFRSxpQkFBUyxJQUZYO0FBR0UsZ0JBQVEsaUJBSFY7QUFJRSxzQkFBYyxJQUpoQjtBQUtFLGdCQUFTQztBQUFFO0FBTGI7QUFNRSx3QkFBZ0IsSUFObEI7QUFPRSxrQkFBVSxLQVBaO0FBUUUsc0JBQWMsQ0FDWjtBQUNFLGtCQUFRLGFBRFY7QUFFRSxtQkFBUyxJQUZYO0FBR0Usa0JBQVEsWUFIVjtBQUlFLGtCQUFRLElBSlY7QUFLRSx3QkFBYztBQUxoQixTQURZLEVBUVo7QUFDRSxrQkFBUSxhQURWO0FBRUUsbUJBQVMsSUFGWDtBQUdFLGtCQUFRLE9BSFY7QUFJRSxrQkFBUSxJQUpWO0FBS0Usd0JBQWM7QUFMaEIsU0FSWSxFQWVaO0FBQ0Usa0JBQVEsYUFEVjtBQUVFLG1CQUFTLElBRlg7QUFHRSxrQkFBUSxXQUhWO0FBSUUsa0JBQVEsSUFKVjtBQUtFLHdCQUFjO0FBTGhCLFNBZlksRUFzQlo7QUFDRSxrQkFBUSxhQURWO0FBRUUsbUJBQVMsSUFGWDtBQUdFLGtCQUFRLGNBSFY7QUFJRSx3QkFBYyxJQUpoQjtBQUtFLGtCQUFRLElBTFY7QUFNRSwwQkFBZ0Isc0JBTmxCO0FBT0Usb0JBQVUsS0FQWjtBQVFFLHdCQUFlQztBQUFFOztBQVJuQixTQXRCWSxFQWdDWjtBQUNFLGtCQUFRLGFBRFY7QUFFRSxtQkFBUyxJQUZYO0FBR0Usa0JBQVEsSUFIVjtBQUlFLGtCQUFRLElBSlY7QUFLRSx3QkFBYztBQUxoQixTQWhDWSxFQXVDWjtBQUNFLGtCQUFRLGdCQURWO0FBRUUsa0JBQVEsTUFGVjtBQUdFLHdCQUFjLENBQ1o7QUFDRSxvQkFBUSxhQURWO0FBRUUscUJBQVMsSUFGWDtBQUdFLG9CQUFRLFNBSFY7QUFJRSxvQkFBUSxJQUpWO0FBS0UsMEJBQWM7QUFMaEIsV0FEWTtBQUhoQixTQXZDWSxFQW9EWjtBQUNFLGtCQUFRLGdCQURWO0FBRUUsa0JBQVEsY0FGVjtBQUdFLHdCQUFjLENBQ1o7QUFDRSxvQkFBUSxhQURWO0FBRUUscUJBQVMsSUFGWDtBQUdFLG9CQUFRLGlCQUhWO0FBSUUsMEJBQWMsSUFKaEI7QUFLRSxvQkFBUSxJQUxWO0FBTUUsNEJBQWdCLDhCQU5sQjtBQU9FLHNCQUFVLEtBUFo7QUFRRSwwQkFBZUE7QUFBRTs7QUFSbkIsV0FEWTtBQUhoQixTQXBEWTtBQVJoQixPQURZO0FBSkgsS0EzQlI7QUFnSEwsY0FBVTtBQUNSLHVCQUFpQixPQURUO0FBRVIsY0FBUSw2QkFGQTtBQUdSLFlBQU0sSUFIRTtBQUlSLGNBQVEsMGJBSkE7QUFLUixrQkFBWTtBQUxKO0FBaEhMLEdBQVA7QUF3SEMsQ0FqSmlDLEVBQWxDLEMsQ0FrSkE7OztBQUNDSDtBQUFJO0FBQUwsQ0FBZ0JJLElBQWhCLEdBQXVCLGtDQUF2QjtBQUNBQyxNQUFNLENBQUNDLE9BQVAsR0FBaUJOLElBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmxvd1xuICogQHJlbGF5SGFzaCBhNjFlODE3YjZkNWUxOWRhZTlhOGE3ZjRmNGUxNTZmYVxuICovXG5cbi8qIGVzbGludC1kaXNhYmxlICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyo6OlxuaW1wb3J0IHR5cGUgeyBDb25jcmV0ZVJlcXVlc3QgfSBmcm9tICdyZWxheS1ydW50aW1lJztcbnR5cGUgdXNlck1lbnRpb25Ub29sdGlwQ29udGFpbmVyX3JlcG9zaXRvcnlPd25lciRyZWYgPSBhbnk7XG5leHBvcnQgdHlwZSB1c2VyTWVudGlvblRvb2x0aXBJdGVtUXVlcnlWYXJpYWJsZXMgPSB7fFxuICB1c2VybmFtZTogc3RyaW5nXG58fTtcbmV4cG9ydCB0eXBlIHVzZXJNZW50aW9uVG9vbHRpcEl0ZW1RdWVyeVJlc3BvbnNlID0ge3xcbiAgK3JlcG9zaXRvcnlPd25lcjogP3t8XG4gICAgKyRmcmFnbWVudFJlZnM6IHVzZXJNZW50aW9uVG9vbHRpcENvbnRhaW5lcl9yZXBvc2l0b3J5T3duZXIkcmVmXG4gIHx9XG58fTtcbmV4cG9ydCB0eXBlIHVzZXJNZW50aW9uVG9vbHRpcEl0ZW1RdWVyeSA9IHt8XG4gIHZhcmlhYmxlczogdXNlck1lbnRpb25Ub29sdGlwSXRlbVF1ZXJ5VmFyaWFibGVzLFxuICByZXNwb25zZTogdXNlck1lbnRpb25Ub29sdGlwSXRlbVF1ZXJ5UmVzcG9uc2UsXG58fTtcbiovXG5cblxuLypcbnF1ZXJ5IHVzZXJNZW50aW9uVG9vbHRpcEl0ZW1RdWVyeShcbiAgJHVzZXJuYW1lOiBTdHJpbmchXG4pIHtcbiAgcmVwb3NpdG9yeU93bmVyKGxvZ2luOiAkdXNlcm5hbWUpIHtcbiAgICBfX3R5cGVuYW1lXG4gICAgLi4udXNlck1lbnRpb25Ub29sdGlwQ29udGFpbmVyX3JlcG9zaXRvcnlPd25lclxuICAgIGlkXG4gIH1cbn1cblxuZnJhZ21lbnQgdXNlck1lbnRpb25Ub29sdGlwQ29udGFpbmVyX3JlcG9zaXRvcnlPd25lciBvbiBSZXBvc2l0b3J5T3duZXIge1xuICBsb2dpblxuICBhdmF0YXJVcmxcbiAgcmVwb3NpdG9yaWVzIHtcbiAgICB0b3RhbENvdW50XG4gIH1cbiAgLi4uIG9uIFVzZXIge1xuICAgIGNvbXBhbnlcbiAgfVxuICAuLi4gb24gT3JnYW5pemF0aW9uIHtcbiAgICBtZW1iZXJzV2l0aFJvbGUge1xuICAgICAgdG90YWxDb3VudFxuICAgIH1cbiAgfVxufVxuKi9cblxuY29uc3Qgbm9kZS8qOiBDb25jcmV0ZVJlcXVlc3QqLyA9IChmdW5jdGlvbigpe1xudmFyIHYwID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgIFwibmFtZVwiOiBcInVzZXJuYW1lXCIsXG4gICAgXCJ0eXBlXCI6IFwiU3RyaW5nIVwiLFxuICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgfVxuXSxcbnYxID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICBcIm5hbWVcIjogXCJsb2dpblwiLFxuICAgIFwidmFyaWFibGVOYW1lXCI6IFwidXNlcm5hbWVcIlxuICB9XG5dLFxudjIgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICBcIm5hbWVcIjogXCJ0b3RhbENvdW50XCIsXG4gICAgXCJhcmdzXCI6IG51bGwsXG4gICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgfVxuXTtcbnJldHVybiB7XG4gIFwia2luZFwiOiBcIlJlcXVlc3RcIixcbiAgXCJmcmFnbWVudFwiOiB7XG4gICAgXCJraW5kXCI6IFwiRnJhZ21lbnRcIixcbiAgICBcIm5hbWVcIjogXCJ1c2VyTWVudGlvblRvb2x0aXBJdGVtUXVlcnlcIixcbiAgICBcInR5cGVcIjogXCJRdWVyeVwiLFxuICAgIFwibWV0YWRhdGFcIjogbnVsbCxcbiAgICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogKHYwLyo6IGFueSovKSxcbiAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAge1xuICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgIFwibmFtZVwiOiBcInJlcG9zaXRvcnlPd25lclwiLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgXCJhcmdzXCI6ICh2MS8qOiBhbnkqLyksXG4gICAgICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIkZyYWdtZW50U3ByZWFkXCIsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJ1c2VyTWVudGlvblRvb2x0aXBDb250YWluZXJfcmVwb3NpdG9yeU93bmVyXCIsXG4gICAgICAgICAgICBcImFyZ3NcIjogbnVsbFxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAgXCJvcGVyYXRpb25cIjoge1xuICAgIFwia2luZFwiOiBcIk9wZXJhdGlvblwiLFxuICAgIFwibmFtZVwiOiBcInVzZXJNZW50aW9uVG9vbHRpcEl0ZW1RdWVyeVwiLFxuICAgIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiAodjAvKjogYW55Ki8pLFxuICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgXCJuYW1lXCI6IFwicmVwb3NpdG9yeU93bmVyXCIsXG4gICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICBcImFyZ3NcIjogKHYxLyo6IGFueSovKSxcbiAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgIFwibmFtZVwiOiBcIl9fdHlwZW5hbWVcIixcbiAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJsb2dpblwiLFxuICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgIFwibmFtZVwiOiBcImF2YXRhclVybFwiLFxuICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgIFwibmFtZVwiOiBcInJlcG9zaXRvcmllc1wiLFxuICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUmVwb3NpdG9yeUNvbm5lY3Rpb25cIixcbiAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6ICh2Mi8qOiBhbnkqLylcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJpZFwiLFxuICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiSW5saW5lRnJhZ21lbnRcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIlVzZXJcIixcbiAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjb21wYW55XCIsXG4gICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiSW5saW5lRnJhZ21lbnRcIixcbiAgICAgICAgICAgIFwidHlwZVwiOiBcIk9yZ2FuaXphdGlvblwiLFxuICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm1lbWJlcnNXaXRoUm9sZVwiLFxuICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiT3JnYW5pemF0aW9uTWVtYmVyQ29ubmVjdGlvblwiLFxuICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiAodjIvKjogYW55Ki8pXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIFwicGFyYW1zXCI6IHtcbiAgICBcIm9wZXJhdGlvbktpbmRcIjogXCJxdWVyeVwiLFxuICAgIFwibmFtZVwiOiBcInVzZXJNZW50aW9uVG9vbHRpcEl0ZW1RdWVyeVwiLFxuICAgIFwiaWRcIjogbnVsbCxcbiAgICBcInRleHRcIjogXCJxdWVyeSB1c2VyTWVudGlvblRvb2x0aXBJdGVtUXVlcnkoXFxuICAkdXNlcm5hbWU6IFN0cmluZyFcXG4pIHtcXG4gIHJlcG9zaXRvcnlPd25lcihsb2dpbjogJHVzZXJuYW1lKSB7XFxuICAgIF9fdHlwZW5hbWVcXG4gICAgLi4udXNlck1lbnRpb25Ub29sdGlwQ29udGFpbmVyX3JlcG9zaXRvcnlPd25lclxcbiAgICBpZFxcbiAgfVxcbn1cXG5cXG5mcmFnbWVudCB1c2VyTWVudGlvblRvb2x0aXBDb250YWluZXJfcmVwb3NpdG9yeU93bmVyIG9uIFJlcG9zaXRvcnlPd25lciB7XFxuICBsb2dpblxcbiAgYXZhdGFyVXJsXFxuICByZXBvc2l0b3JpZXMge1xcbiAgICB0b3RhbENvdW50XFxuICB9XFxuICAuLi4gb24gVXNlciB7XFxuICAgIGNvbXBhbnlcXG4gIH1cXG4gIC4uLiBvbiBPcmdhbml6YXRpb24ge1xcbiAgICBtZW1iZXJzV2l0aFJvbGUge1xcbiAgICAgIHRvdGFsQ291bnRcXG4gICAgfVxcbiAgfVxcbn1cXG5cIixcbiAgICBcIm1ldGFkYXRhXCI6IHt9XG4gIH1cbn07XG59KSgpO1xuLy8gcHJldHRpZXItaWdub3JlXG4obm9kZS8qOiBhbnkqLykuaGFzaCA9ICdjMGU4YjZmNmQzMDI4ZjNmMjY3OWNlOWUxNDg2OTgxZSc7XG5tb2R1bGUuZXhwb3J0cyA9IG5vZGU7XG4iXX0=