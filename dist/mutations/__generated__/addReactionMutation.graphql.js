/**
 * @flow
 * @relayHash 7997e8956784138f048c25f7bb894552
 */

/* eslint-disable */
'use strict';
/*::
import type { ConcreteRequest } from 'relay-runtime';
export type ReactionContent = "CONFUSED" | "EYES" | "HEART" | "HOORAY" | "LAUGH" | "ROCKET" | "THUMBS_DOWN" | "THUMBS_UP" | "%future added value";
export type AddReactionInput = {|
  subjectId: string,
  content: ReactionContent,
  clientMutationId?: ?string,
|};
export type addReactionMutationVariables = {|
  input: AddReactionInput
|};
export type addReactionMutationResponse = {|
  +addReaction: ?{|
    +subject: ?{|
      +reactionGroups: ?$ReadOnlyArray<{|
        +content: ReactionContent,
        +viewerHasReacted: boolean,
        +users: {|
          +totalCount: number
        |},
      |}>
    |}
  |}
|};
export type addReactionMutation = {|
  variables: addReactionMutationVariables,
  response: addReactionMutationResponse,
|};
*/

/*
mutation addReactionMutation(
  $input: AddReactionInput!
) {
  addReaction(input: $input) {
    subject {
      __typename
      reactionGroups {
        content
        viewerHasReacted
        users {
          totalCount
        }
      }
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
    "type": "AddReactionInput!",
    "defaultValue": null
  }],
      v1 = [{
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }],
      v2 = {
    "kind": "LinkedField",
    "alias": null,
    "name": "reactionGroups",
    "storageKey": null,
    "args": null,
    "concreteType": "ReactionGroup",
    "plural": true,
    "selections": [{
      "kind": "ScalarField",
      "alias": null,
      "name": "content",
      "args": null,
      "storageKey": null
    }, {
      "kind": "ScalarField",
      "alias": null,
      "name": "viewerHasReacted",
      "args": null,
      "storageKey": null
    }, {
      "kind": "LinkedField",
      "alias": null,
      "name": "users",
      "storageKey": null,
      "args": null,
      "concreteType": "ReactingUserConnection",
      "plural": false,
      "selections": [{
        "kind": "ScalarField",
        "alias": null,
        "name": "totalCount",
        "args": null,
        "storageKey": null
      }]
    }]
  };
  return {
    "kind": "Request",
    "fragment": {
      "kind": "Fragment",
      "name": "addReactionMutation",
      "type": "Mutation",
      "metadata": null,
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "addReaction",
        "storageKey": null,
        "args": v1
        /*: any*/
        ,
        "concreteType": "AddReactionPayload",
        "plural": false,
        "selections": [{
          "kind": "LinkedField",
          "alias": null,
          "name": "subject",
          "storageKey": null,
          "args": null,
          "concreteType": null,
          "plural": false,
          "selections": [v2
          /*: any*/
          ]
        }]
      }]
    },
    "operation": {
      "kind": "Operation",
      "name": "addReactionMutation",
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "addReaction",
        "storageKey": null,
        "args": v1
        /*: any*/
        ,
        "concreteType": "AddReactionPayload",
        "plural": false,
        "selections": [{
          "kind": "LinkedField",
          "alias": null,
          "name": "subject",
          "storageKey": null,
          "args": null,
          "concreteType": null,
          "plural": false,
          "selections": [{
            "kind": "ScalarField",
            "alias": null,
            "name": "__typename",
            "args": null,
            "storageKey": null
          }, v2
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
      "name": "addReactionMutation",
      "id": null,
      "text": "mutation addReactionMutation(\n  $input: AddReactionInput!\n) {\n  addReaction(input: $input) {\n    subject {\n      __typename\n      reactionGroups {\n        content\n        viewerHasReacted\n        users {\n          totalCount\n        }\n      }\n      id\n    }\n  }\n}\n",
      "metadata": {}
    }
  };
}(); // prettier-ignore


node
/*: any*/
.hash = 'fc238aed25f2d7e854162002cb00b57f';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9tdXRhdGlvbnMvX19nZW5lcmF0ZWRfXy9hZGRSZWFjdGlvbk11dGF0aW9uLmdyYXBocWwuanMiXSwibmFtZXMiOlsibm9kZSIsInYwIiwidjEiLCJ2MiIsImhhc2giLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxNQUFNQTtBQUFJO0FBQUEsRUFBeUIsWUFBVTtBQUM3QyxNQUFJQyxFQUFFLEdBQUcsQ0FDUDtBQUNFLFlBQVEsZUFEVjtBQUVFLFlBQVEsT0FGVjtBQUdFLFlBQVEsbUJBSFY7QUFJRSxvQkFBZ0I7QUFKbEIsR0FETyxDQUFUO0FBQUEsTUFRQUMsRUFBRSxHQUFHLENBQ0g7QUFDRSxZQUFRLFVBRFY7QUFFRSxZQUFRLE9BRlY7QUFHRSxvQkFBZ0I7QUFIbEIsR0FERyxDQVJMO0FBQUEsTUFlQUMsRUFBRSxHQUFHO0FBQ0gsWUFBUSxhQURMO0FBRUgsYUFBUyxJQUZOO0FBR0gsWUFBUSxnQkFITDtBQUlILGtCQUFjLElBSlg7QUFLSCxZQUFRLElBTEw7QUFNSCxvQkFBZ0IsZUFOYjtBQU9ILGNBQVUsSUFQUDtBQVFILGtCQUFjLENBQ1o7QUFDRSxjQUFRLGFBRFY7QUFFRSxlQUFTLElBRlg7QUFHRSxjQUFRLFNBSFY7QUFJRSxjQUFRLElBSlY7QUFLRSxvQkFBYztBQUxoQixLQURZLEVBUVo7QUFDRSxjQUFRLGFBRFY7QUFFRSxlQUFTLElBRlg7QUFHRSxjQUFRLGtCQUhWO0FBSUUsY0FBUSxJQUpWO0FBS0Usb0JBQWM7QUFMaEIsS0FSWSxFQWVaO0FBQ0UsY0FBUSxhQURWO0FBRUUsZUFBUyxJQUZYO0FBR0UsY0FBUSxPQUhWO0FBSUUsb0JBQWMsSUFKaEI7QUFLRSxjQUFRLElBTFY7QUFNRSxzQkFBZ0Isd0JBTmxCO0FBT0UsZ0JBQVUsS0FQWjtBQVFFLG9CQUFjLENBQ1o7QUFDRSxnQkFBUSxhQURWO0FBRUUsaUJBQVMsSUFGWDtBQUdFLGdCQUFRLFlBSFY7QUFJRSxnQkFBUSxJQUpWO0FBS0Usc0JBQWM7QUFMaEIsT0FEWTtBQVJoQixLQWZZO0FBUlgsR0FmTDtBQTBEQSxTQUFPO0FBQ0wsWUFBUSxTQURIO0FBRUwsZ0JBQVk7QUFDVixjQUFRLFVBREU7QUFFVixjQUFRLHFCQUZFO0FBR1YsY0FBUSxVQUhFO0FBSVYsa0JBQVksSUFKRjtBQUtWLDZCQUF3QkY7QUFBRTtBQUxoQjtBQU1WLG9CQUFjLENBQ1o7QUFDRSxnQkFBUSxhQURWO0FBRUUsaUJBQVMsSUFGWDtBQUdFLGdCQUFRLGFBSFY7QUFJRSxzQkFBYyxJQUpoQjtBQUtFLGdCQUFTQztBQUFFO0FBTGI7QUFNRSx3QkFBZ0Isb0JBTmxCO0FBT0Usa0JBQVUsS0FQWjtBQVFFLHNCQUFjLENBQ1o7QUFDRSxrQkFBUSxhQURWO0FBRUUsbUJBQVMsSUFGWDtBQUdFLGtCQUFRLFNBSFY7QUFJRSx3QkFBYyxJQUpoQjtBQUtFLGtCQUFRLElBTFY7QUFNRSwwQkFBZ0IsSUFObEI7QUFPRSxvQkFBVSxLQVBaO0FBUUUsd0JBQWMsQ0FDWEM7QUFBRTtBQURTO0FBUmhCLFNBRFk7QUFSaEIsT0FEWTtBQU5KLEtBRlA7QUFrQ0wsaUJBQWE7QUFDWCxjQUFRLFdBREc7QUFFWCxjQUFRLHFCQUZHO0FBR1gsNkJBQXdCRjtBQUFFO0FBSGY7QUFJWCxvQkFBYyxDQUNaO0FBQ0UsZ0JBQVEsYUFEVjtBQUVFLGlCQUFTLElBRlg7QUFHRSxnQkFBUSxhQUhWO0FBSUUsc0JBQWMsSUFKaEI7QUFLRSxnQkFBU0M7QUFBRTtBQUxiO0FBTUUsd0JBQWdCLG9CQU5sQjtBQU9FLGtCQUFVLEtBUFo7QUFRRSxzQkFBYyxDQUNaO0FBQ0Usa0JBQVEsYUFEVjtBQUVFLG1CQUFTLElBRlg7QUFHRSxrQkFBUSxTQUhWO0FBSUUsd0JBQWMsSUFKaEI7QUFLRSxrQkFBUSxJQUxWO0FBTUUsMEJBQWdCLElBTmxCO0FBT0Usb0JBQVUsS0FQWjtBQVFFLHdCQUFjLENBQ1o7QUFDRSxvQkFBUSxhQURWO0FBRUUscUJBQVMsSUFGWDtBQUdFLG9CQUFRLFlBSFY7QUFJRSxvQkFBUSxJQUpWO0FBS0UsMEJBQWM7QUFMaEIsV0FEWSxFQVFYQztBQUFFO0FBUlMsWUFTWjtBQUNFLG9CQUFRLGFBRFY7QUFFRSxxQkFBUyxJQUZYO0FBR0Usb0JBQVEsSUFIVjtBQUlFLG9CQUFRLElBSlY7QUFLRSwwQkFBYztBQUxoQixXQVRZO0FBUmhCLFNBRFk7QUFSaEIsT0FEWTtBQUpILEtBbENSO0FBOEVMLGNBQVU7QUFDUix1QkFBaUIsVUFEVDtBQUVSLGNBQVEscUJBRkE7QUFHUixZQUFNLElBSEU7QUFJUixjQUFRLDJSQUpBO0FBS1Isa0JBQVk7QUFMSjtBQTlFTCxHQUFQO0FBc0ZDLENBakppQyxFQUFsQyxDLENBa0pBOzs7QUFDQ0g7QUFBSTtBQUFMLENBQWdCSSxJQUFoQixHQUF1QixrQ0FBdkI7QUFDQUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCTixJQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZsb3dcbiAqIEByZWxheUhhc2ggNzk5N2U4OTU2Nzg0MTM4ZjA0OGMyNWY3YmI4OTQ1NTJcbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qOjpcbmltcG9ydCB0eXBlIHsgQ29uY3JldGVSZXF1ZXN0IH0gZnJvbSAncmVsYXktcnVudGltZSc7XG5leHBvcnQgdHlwZSBSZWFjdGlvbkNvbnRlbnQgPSBcIkNPTkZVU0VEXCIgfCBcIkVZRVNcIiB8IFwiSEVBUlRcIiB8IFwiSE9PUkFZXCIgfCBcIkxBVUdIXCIgfCBcIlJPQ0tFVFwiIHwgXCJUSFVNQlNfRE9XTlwiIHwgXCJUSFVNQlNfVVBcIiB8IFwiJWZ1dHVyZSBhZGRlZCB2YWx1ZVwiO1xuZXhwb3J0IHR5cGUgQWRkUmVhY3Rpb25JbnB1dCA9IHt8XG4gIHN1YmplY3RJZDogc3RyaW5nLFxuICBjb250ZW50OiBSZWFjdGlvbkNvbnRlbnQsXG4gIGNsaWVudE11dGF0aW9uSWQ/OiA/c3RyaW5nLFxufH07XG5leHBvcnQgdHlwZSBhZGRSZWFjdGlvbk11dGF0aW9uVmFyaWFibGVzID0ge3xcbiAgaW5wdXQ6IEFkZFJlYWN0aW9uSW5wdXRcbnx9O1xuZXhwb3J0IHR5cGUgYWRkUmVhY3Rpb25NdXRhdGlvblJlc3BvbnNlID0ge3xcbiAgK2FkZFJlYWN0aW9uOiA/e3xcbiAgICArc3ViamVjdDogP3t8XG4gICAgICArcmVhY3Rpb25Hcm91cHM6ID8kUmVhZE9ubHlBcnJheTx7fFxuICAgICAgICArY29udGVudDogUmVhY3Rpb25Db250ZW50LFxuICAgICAgICArdmlld2VySGFzUmVhY3RlZDogYm9vbGVhbixcbiAgICAgICAgK3VzZXJzOiB7fFxuICAgICAgICAgICt0b3RhbENvdW50OiBudW1iZXJcbiAgICAgICAgfH0sXG4gICAgICB8fT5cbiAgICB8fVxuICB8fVxufH07XG5leHBvcnQgdHlwZSBhZGRSZWFjdGlvbk11dGF0aW9uID0ge3xcbiAgdmFyaWFibGVzOiBhZGRSZWFjdGlvbk11dGF0aW9uVmFyaWFibGVzLFxuICByZXNwb25zZTogYWRkUmVhY3Rpb25NdXRhdGlvblJlc3BvbnNlLFxufH07XG4qL1xuXG5cbi8qXG5tdXRhdGlvbiBhZGRSZWFjdGlvbk11dGF0aW9uKFxuICAkaW5wdXQ6IEFkZFJlYWN0aW9uSW5wdXQhXG4pIHtcbiAgYWRkUmVhY3Rpb24oaW5wdXQ6ICRpbnB1dCkge1xuICAgIHN1YmplY3Qge1xuICAgICAgX190eXBlbmFtZVxuICAgICAgcmVhY3Rpb25Hcm91cHMge1xuICAgICAgICBjb250ZW50XG4gICAgICAgIHZpZXdlckhhc1JlYWN0ZWRcbiAgICAgICAgdXNlcnMge1xuICAgICAgICAgIHRvdGFsQ291bnRcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWRcbiAgICB9XG4gIH1cbn1cbiovXG5cbmNvbnN0IG5vZGUvKjogQ29uY3JldGVSZXF1ZXN0Ki8gPSAoZnVuY3Rpb24oKXtcbnZhciB2MCA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICBcIm5hbWVcIjogXCJpbnB1dFwiLFxuICAgIFwidHlwZVwiOiBcIkFkZFJlYWN0aW9uSW5wdXQhXCIsXG4gICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICB9XG5dLFxudjEgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgIFwibmFtZVwiOiBcImlucHV0XCIsXG4gICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJpbnB1dFwiXG4gIH1cbl0sXG52MiA9IHtcbiAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJyZWFjdGlvbkdyb3Vwc1wiLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwiY29uY3JldGVUeXBlXCI6IFwiUmVhY3Rpb25Hcm91cFwiLFxuICBcInBsdXJhbFwiOiB0cnVlLFxuICBcInNlbGVjdGlvbnNcIjogW1xuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJjb250ZW50XCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwidmlld2VySGFzUmVhY3RlZFwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcInVzZXJzXCIsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJSZWFjdGluZ1VzZXJDb25uZWN0aW9uXCIsXG4gICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICBcIm5hbWVcIjogXCJ0b3RhbENvdW50XCIsXG4gICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgXVxufTtcbnJldHVybiB7XG4gIFwia2luZFwiOiBcIlJlcXVlc3RcIixcbiAgXCJmcmFnbWVudFwiOiB7XG4gICAgXCJraW5kXCI6IFwiRnJhZ21lbnRcIixcbiAgICBcIm5hbWVcIjogXCJhZGRSZWFjdGlvbk11dGF0aW9uXCIsXG4gICAgXCJ0eXBlXCI6IFwiTXV0YXRpb25cIixcbiAgICBcIm1ldGFkYXRhXCI6IG51bGwsXG4gICAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6ICh2MC8qOiBhbnkqLyksXG4gICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICBcIm5hbWVcIjogXCJhZGRSZWFjdGlvblwiLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgXCJhcmdzXCI6ICh2MS8qOiBhbnkqLyksXG4gICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiQWRkUmVhY3Rpb25QYXlsb2FkXCIsXG4gICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICBcIm5hbWVcIjogXCJzdWJqZWN0XCIsXG4gICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgKHYyLyo6IGFueSovKVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAgXCJvcGVyYXRpb25cIjoge1xuICAgIFwia2luZFwiOiBcIk9wZXJhdGlvblwiLFxuICAgIFwibmFtZVwiOiBcImFkZFJlYWN0aW9uTXV0YXRpb25cIixcbiAgICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogKHYwLyo6IGFueSovKSxcbiAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAge1xuICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgIFwibmFtZVwiOiBcImFkZFJlYWN0aW9uXCIsXG4gICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICBcImFyZ3NcIjogKHYxLyo6IGFueSovKSxcbiAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJBZGRSZWFjdGlvblBheWxvYWRcIixcbiAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgIFwibmFtZVwiOiBcInN1YmplY3RcIixcbiAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBudWxsLFxuICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiX190eXBlbmFtZVwiLFxuICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICh2Mi8qOiBhbnkqLyksXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJpZFwiLFxuICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIFwicGFyYW1zXCI6IHtcbiAgICBcIm9wZXJhdGlvbktpbmRcIjogXCJtdXRhdGlvblwiLFxuICAgIFwibmFtZVwiOiBcImFkZFJlYWN0aW9uTXV0YXRpb25cIixcbiAgICBcImlkXCI6IG51bGwsXG4gICAgXCJ0ZXh0XCI6IFwibXV0YXRpb24gYWRkUmVhY3Rpb25NdXRhdGlvbihcXG4gICRpbnB1dDogQWRkUmVhY3Rpb25JbnB1dCFcXG4pIHtcXG4gIGFkZFJlYWN0aW9uKGlucHV0OiAkaW5wdXQpIHtcXG4gICAgc3ViamVjdCB7XFxuICAgICAgX190eXBlbmFtZVxcbiAgICAgIHJlYWN0aW9uR3JvdXBzIHtcXG4gICAgICAgIGNvbnRlbnRcXG4gICAgICAgIHZpZXdlckhhc1JlYWN0ZWRcXG4gICAgICAgIHVzZXJzIHtcXG4gICAgICAgICAgdG90YWxDb3VudFxcbiAgICAgICAgfVxcbiAgICAgIH1cXG4gICAgICBpZFxcbiAgICB9XFxuICB9XFxufVxcblwiLFxuICAgIFwibWV0YWRhdGFcIjoge31cbiAgfVxufTtcbn0pKCk7XG4vLyBwcmV0dGllci1pZ25vcmVcbihub2RlLyo6IGFueSovKS5oYXNoID0gJ2ZjMjM4YWVkMjVmMmQ3ZTg1NDE2MjAwMmNiMDBiNTdmJztcbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcbiJdfQ==