/**
 * @flow
 * @relayHash 9cc5769d725536db18b287ade87404b5
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type ReactionContent = "CONFUSED" | "EYES" | "HEART" | "HOORAY" | "LAUGH" | "ROCKET" | "THUMBS_DOWN" | "THUMBS_UP" | "%future added value";
export type RemoveReactionInput = {|
  subjectId: string,
  content: ReactionContent,
  clientMutationId?: ?string,
|};
export type removeReactionMutationVariables = {|
  input: RemoveReactionInput
|};
export type removeReactionMutationResponse = {|
  +removeReaction: ?{|
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
export type removeReactionMutation = {|
  variables: removeReactionMutationVariables,
  response: removeReactionMutationResponse,
|};
*/

/*
mutation removeReactionMutation(
  $input: RemoveReactionInput!
) {
  removeReaction(input: $input) {
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
const node /*: ConcreteRequest*/ = function () {
  var v0 = [{
      "kind": "LocalArgument",
      "name": "input",
      "type": "RemoveReactionInput!",
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
      "name": "removeReactionMutation",
      "type": "Mutation",
      "metadata": null,
      "argumentDefinitions": v0 /*: any*/,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "removeReaction",
        "storageKey": null,
        "args": v1 /*: any*/,
        "concreteType": "RemoveReactionPayload",
        "plural": false,
        "selections": [{
          "kind": "LinkedField",
          "alias": null,
          "name": "subject",
          "storageKey": null,
          "args": null,
          "concreteType": null,
          "plural": false,
          "selections": [v2 /*: any*/]
        }]
      }]
    },

    "operation": {
      "kind": "Operation",
      "name": "removeReactionMutation",
      "argumentDefinitions": v0 /*: any*/,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "removeReaction",
        "storageKey": null,
        "args": v1 /*: any*/,
        "concreteType": "RemoveReactionPayload",
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
          }, v2 /*: any*/, {
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
      "name": "removeReactionMutation",
      "id": null,
      "text": "mutation removeReactionMutation(\n  $input: RemoveReactionInput!\n) {\n  removeReaction(input: $input) {\n    subject {\n      __typename\n      reactionGroups {\n        content\n        viewerHasReacted\n        users {\n          totalCount\n        }\n      }\n      id\n    }\n  }\n}\n",
      "metadata": {}
    }
  };
}();
// prettier-ignore
node /*: any*/.hash = 'f20b76a0ff63579992f4631894495523';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJub2RlIiwidjAiLCJ2MSIsInYyIiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwic291cmNlcyI6WyJyZW1vdmVSZWFjdGlvbk11dGF0aW9uLmdyYXBocWwuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmxvd1xuICogQHJlbGF5SGFzaCA5Y2M1NzY5ZDcyNTUzNmRiMThiMjg3YWRlODc0MDRiNVxuICovXG5cbi8qIGVzbGludC1kaXNhYmxlICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyo6OlxuaW1wb3J0IHR5cGUgeyBDb25jcmV0ZVJlcXVlc3QgfSBmcm9tICdyZWxheS1ydW50aW1lJztcbmV4cG9ydCB0eXBlIFJlYWN0aW9uQ29udGVudCA9IFwiQ09ORlVTRURcIiB8IFwiRVlFU1wiIHwgXCJIRUFSVFwiIHwgXCJIT09SQVlcIiB8IFwiTEFVR0hcIiB8IFwiUk9DS0VUXCIgfCBcIlRIVU1CU19ET1dOXCIgfCBcIlRIVU1CU19VUFwiIHwgXCIlZnV0dXJlIGFkZGVkIHZhbHVlXCI7XG5leHBvcnQgdHlwZSBSZW1vdmVSZWFjdGlvbklucHV0ID0ge3xcbiAgc3ViamVjdElkOiBzdHJpbmcsXG4gIGNvbnRlbnQ6IFJlYWN0aW9uQ29udGVudCxcbiAgY2xpZW50TXV0YXRpb25JZD86ID9zdHJpbmcsXG58fTtcbmV4cG9ydCB0eXBlIHJlbW92ZVJlYWN0aW9uTXV0YXRpb25WYXJpYWJsZXMgPSB7fFxuICBpbnB1dDogUmVtb3ZlUmVhY3Rpb25JbnB1dFxufH07XG5leHBvcnQgdHlwZSByZW1vdmVSZWFjdGlvbk11dGF0aW9uUmVzcG9uc2UgPSB7fFxuICArcmVtb3ZlUmVhY3Rpb246ID97fFxuICAgICtzdWJqZWN0OiA/e3xcbiAgICAgICtyZWFjdGlvbkdyb3VwczogPyRSZWFkT25seUFycmF5PHt8XG4gICAgICAgICtjb250ZW50OiBSZWFjdGlvbkNvbnRlbnQsXG4gICAgICAgICt2aWV3ZXJIYXNSZWFjdGVkOiBib29sZWFuLFxuICAgICAgICArdXNlcnM6IHt8XG4gICAgICAgICAgK3RvdGFsQ291bnQ6IG51bWJlclxuICAgICAgICB8fSxcbiAgICAgIHx9PlxuICAgIHx9XG4gIHx9XG58fTtcbmV4cG9ydCB0eXBlIHJlbW92ZVJlYWN0aW9uTXV0YXRpb24gPSB7fFxuICB2YXJpYWJsZXM6IHJlbW92ZVJlYWN0aW9uTXV0YXRpb25WYXJpYWJsZXMsXG4gIHJlc3BvbnNlOiByZW1vdmVSZWFjdGlvbk11dGF0aW9uUmVzcG9uc2UsXG58fTtcbiovXG5cblxuLypcbm11dGF0aW9uIHJlbW92ZVJlYWN0aW9uTXV0YXRpb24oXG4gICRpbnB1dDogUmVtb3ZlUmVhY3Rpb25JbnB1dCFcbikge1xuICByZW1vdmVSZWFjdGlvbihpbnB1dDogJGlucHV0KSB7XG4gICAgc3ViamVjdCB7XG4gICAgICBfX3R5cGVuYW1lXG4gICAgICByZWFjdGlvbkdyb3VwcyB7XG4gICAgICAgIGNvbnRlbnRcbiAgICAgICAgdmlld2VySGFzUmVhY3RlZFxuICAgICAgICB1c2VycyB7XG4gICAgICAgICAgdG90YWxDb3VudFxuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZFxuICAgIH1cbiAgfVxufVxuKi9cblxuY29uc3Qgbm9kZS8qOiBDb25jcmV0ZVJlcXVlc3QqLyA9IChmdW5jdGlvbigpe1xudmFyIHYwID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgIFwibmFtZVwiOiBcImlucHV0XCIsXG4gICAgXCJ0eXBlXCI6IFwiUmVtb3ZlUmVhY3Rpb25JbnB1dCFcIixcbiAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gIH1cbl0sXG52MSA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgXCJuYW1lXCI6IFwiaW5wdXRcIixcbiAgICBcInZhcmlhYmxlTmFtZVwiOiBcImlucHV0XCJcbiAgfVxuXSxcbnYyID0ge1xuICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcInJlYWN0aW9uR3JvdXBzXCIsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJjb25jcmV0ZVR5cGVcIjogXCJSZWFjdGlvbkdyb3VwXCIsXG4gIFwicGx1cmFsXCI6IHRydWUsXG4gIFwic2VsZWN0aW9uc1wiOiBbXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcImNvbnRlbnRcIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJ2aWV3ZXJIYXNSZWFjdGVkXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwidXNlcnNcIixcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlJlYWN0aW5nVXNlckNvbm5lY3Rpb25cIixcbiAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgIFwibmFtZVwiOiBcInRvdGFsQ291bnRcIixcbiAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICBdXG59O1xucmV0dXJuIHtcbiAgXCJraW5kXCI6IFwiUmVxdWVzdFwiLFxuICBcImZyYWdtZW50XCI6IHtcbiAgICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICAgIFwibmFtZVwiOiBcInJlbW92ZVJlYWN0aW9uTXV0YXRpb25cIixcbiAgICBcInR5cGVcIjogXCJNdXRhdGlvblwiLFxuICAgIFwibWV0YWRhdGFcIjogbnVsbCxcbiAgICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogKHYwLyo6IGFueSovKSxcbiAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAge1xuICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgIFwibmFtZVwiOiBcInJlbW92ZVJlYWN0aW9uXCIsXG4gICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICBcImFyZ3NcIjogKHYxLyo6IGFueSovKSxcbiAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJSZW1vdmVSZWFjdGlvblBheWxvYWRcIixcbiAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAge1xuICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgIFwibmFtZVwiOiBcInN1YmplY3RcIixcbiAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBudWxsLFxuICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAodjIvKjogYW55Ki8pXG4gICAgICAgICAgICBdXG4gICAgICAgICAgfVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9LFxuICBcIm9wZXJhdGlvblwiOiB7XG4gICAgXCJraW5kXCI6IFwiT3BlcmF0aW9uXCIsXG4gICAgXCJuYW1lXCI6IFwicmVtb3ZlUmVhY3Rpb25NdXRhdGlvblwiLFxuICAgIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiAodjAvKjogYW55Ki8pLFxuICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgXCJuYW1lXCI6IFwicmVtb3ZlUmVhY3Rpb25cIixcbiAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgIFwiYXJnc1wiOiAodjEvKjogYW55Ki8pLFxuICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlJlbW92ZVJlYWN0aW9uUGF5bG9hZFwiLFxuICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgXCJuYW1lXCI6IFwic3ViamVjdFwiLFxuICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJfX3R5cGVuYW1lXCIsXG4gICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgKHYyLyo6IGFueSovKSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImlkXCIsXG4gICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAgXCJwYXJhbXNcIjoge1xuICAgIFwib3BlcmF0aW9uS2luZFwiOiBcIm11dGF0aW9uXCIsXG4gICAgXCJuYW1lXCI6IFwicmVtb3ZlUmVhY3Rpb25NdXRhdGlvblwiLFxuICAgIFwiaWRcIjogbnVsbCxcbiAgICBcInRleHRcIjogXCJtdXRhdGlvbiByZW1vdmVSZWFjdGlvbk11dGF0aW9uKFxcbiAgJGlucHV0OiBSZW1vdmVSZWFjdGlvbklucHV0IVxcbikge1xcbiAgcmVtb3ZlUmVhY3Rpb24oaW5wdXQ6ICRpbnB1dCkge1xcbiAgICBzdWJqZWN0IHtcXG4gICAgICBfX3R5cGVuYW1lXFxuICAgICAgcmVhY3Rpb25Hcm91cHMge1xcbiAgICAgICAgY29udGVudFxcbiAgICAgICAgdmlld2VySGFzUmVhY3RlZFxcbiAgICAgICAgdXNlcnMge1xcbiAgICAgICAgICB0b3RhbENvdW50XFxuICAgICAgICB9XFxuICAgICAgfVxcbiAgICAgIGlkXFxuICAgIH1cXG4gIH1cXG59XFxuXCIsXG4gICAgXCJtZXRhZGF0YVwiOiB7fVxuICB9XG59O1xufSkoKTtcbi8vIHByZXR0aWVyLWlnbm9yZVxuKG5vZGUvKjogYW55Ki8pLmhhc2ggPSAnZjIwYjc2YTBmZjYzNTc5OTkyZjQ2MzE4OTQ0OTU1MjMnO1xubW9kdWxlLmV4cG9ydHMgPSBub2RlO1xuIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxZQUFZOztBQUVaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFFQSxNQUFNQSxJQUFJLHlCQUF5QixZQUFVO0VBQzdDLElBQUlDLEVBQUUsR0FBRyxDQUNQO01BQ0UsTUFBTSxFQUFFLGVBQWU7TUFDdkIsTUFBTSxFQUFFLE9BQU87TUFDZixNQUFNLEVBQUUsc0JBQXNCO01BQzlCLGNBQWMsRUFBRTtJQUNsQixDQUFDLENBQ0Y7SUFDREMsRUFBRSxHQUFHLENBQ0g7TUFDRSxNQUFNLEVBQUUsVUFBVTtNQUNsQixNQUFNLEVBQUUsT0FBTztNQUNmLGNBQWMsRUFBRTtJQUNsQixDQUFDLENBQ0Y7SUFDREMsRUFBRSxHQUFHO01BQ0gsTUFBTSxFQUFFLGFBQWE7TUFDckIsT0FBTyxFQUFFLElBQUk7TUFDYixNQUFNLEVBQUUsZ0JBQWdCO01BQ3hCLFlBQVksRUFBRSxJQUFJO01BQ2xCLE1BQU0sRUFBRSxJQUFJO01BQ1osY0FBYyxFQUFFLGVBQWU7TUFDL0IsUUFBUSxFQUFFLElBQUk7TUFDZCxZQUFZLEVBQUUsQ0FDWjtRQUNFLE1BQU0sRUFBRSxhQUFhO1FBQ3JCLE9BQU8sRUFBRSxJQUFJO1FBQ2IsTUFBTSxFQUFFLFNBQVM7UUFDakIsTUFBTSxFQUFFLElBQUk7UUFD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