/**
 * @flow
 */

/* eslint-disable */
'use strict';
/*::
import type { ReaderFragment } from 'relay-runtime';
export type ReactionContent = "CONFUSED" | "EYES" | "HEART" | "HOORAY" | "LAUGH" | "ROCKET" | "THUMBS_DOWN" | "THUMBS_UP" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type emojiReactionsView_reactable$ref: FragmentReference;
declare export opaque type emojiReactionsView_reactable$fragmentType: emojiReactionsView_reactable$ref;
export type emojiReactionsView_reactable = {|
  +id: string,
  +reactionGroups: ?$ReadOnlyArray<{|
    +content: ReactionContent,
    +viewerHasReacted: boolean,
    +users: {|
      +totalCount: number
    |},
  |}>,
  +viewerCanReact: boolean,
  +$refType: emojiReactionsView_reactable$ref,
|};
export type emojiReactionsView_reactable$data = emojiReactionsView_reactable;
export type emojiReactionsView_reactable$key = {
  +$data?: emojiReactionsView_reactable$data,
  +$fragmentRefs: emojiReactionsView_reactable$ref,
};
*/

const node
/*: ReaderFragment*/
= {
  "kind": "Fragment",
  "name": "emojiReactionsView_reactable",
  "type": "Reactable",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [{
    "kind": "ScalarField",
    "alias": null,
    "name": "id",
    "args": null,
    "storageKey": null
  }, {
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
  }, {
    "kind": "ScalarField",
    "alias": null,
    "name": "viewerCanReact",
    "args": null,
    "storageKey": null
  }]
}; // prettier-ignore

node
/*: any*/
.hash = 'fde156007f42d841401632fce79875d5';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi92aWV3cy9fX2dlbmVyYXRlZF9fL2Vtb2ppUmVhY3Rpb25zVmlld19yZWFjdGFibGUuZ3JhcGhxbC5qcyJdLCJuYW1lcyI6WyJub2RlIiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUdBLE1BQU1BO0FBQUk7QUFBQSxFQUF1QjtBQUMvQixVQUFRLFVBRHVCO0FBRS9CLFVBQVEsOEJBRnVCO0FBRy9CLFVBQVEsV0FIdUI7QUFJL0IsY0FBWSxJQUptQjtBQUsvQix5QkFBdUIsRUFMUTtBQU0vQixnQkFBYyxDQUNaO0FBQ0UsWUFBUSxhQURWO0FBRUUsYUFBUyxJQUZYO0FBR0UsWUFBUSxJQUhWO0FBSUUsWUFBUSxJQUpWO0FBS0Usa0JBQWM7QUFMaEIsR0FEWSxFQVFaO0FBQ0UsWUFBUSxhQURWO0FBRUUsYUFBUyxJQUZYO0FBR0UsWUFBUSxnQkFIVjtBQUlFLGtCQUFjLElBSmhCO0FBS0UsWUFBUSxJQUxWO0FBTUUsb0JBQWdCLGVBTmxCO0FBT0UsY0FBVSxJQVBaO0FBUUUsa0JBQWMsQ0FDWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsSUFGWDtBQUdFLGNBQVEsU0FIVjtBQUlFLGNBQVEsSUFKVjtBQUtFLG9CQUFjO0FBTGhCLEtBRFksRUFRWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsSUFGWDtBQUdFLGNBQVEsa0JBSFY7QUFJRSxjQUFRLElBSlY7QUFLRSxvQkFBYztBQUxoQixLQVJZLEVBZVo7QUFDRSxjQUFRLGFBRFY7QUFFRSxlQUFTLElBRlg7QUFHRSxjQUFRLE9BSFY7QUFJRSxvQkFBYyxJQUpoQjtBQUtFLGNBQVEsSUFMVjtBQU1FLHNCQUFnQix3QkFObEI7QUFPRSxnQkFBVSxLQVBaO0FBUUUsb0JBQWMsQ0FDWjtBQUNFLGdCQUFRLGFBRFY7QUFFRSxpQkFBUyxJQUZYO0FBR0UsZ0JBQVEsWUFIVjtBQUlFLGdCQUFRLElBSlY7QUFLRSxzQkFBYztBQUxoQixPQURZO0FBUmhCLEtBZlk7QUFSaEIsR0FSWSxFQW1EWjtBQUNFLFlBQVEsYUFEVjtBQUVFLGFBQVMsSUFGWDtBQUdFLFlBQVEsZ0JBSFY7QUFJRSxZQUFRLElBSlY7QUFLRSxrQkFBYztBQUxoQixHQW5EWTtBQU5pQixDQUFqQyxDLENBa0VBOztBQUNDQTtBQUFJO0FBQUwsQ0FBZ0JDLElBQWhCLEdBQXVCLGtDQUF2QjtBQUNBQyxNQUFNLENBQUNDLE9BQVAsR0FBaUJILElBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmxvd1xuICovXG5cbi8qIGVzbGludC1kaXNhYmxlICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyo6OlxuaW1wb3J0IHR5cGUgeyBSZWFkZXJGcmFnbWVudCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xuZXhwb3J0IHR5cGUgUmVhY3Rpb25Db250ZW50ID0gXCJDT05GVVNFRFwiIHwgXCJFWUVTXCIgfCBcIkhFQVJUXCIgfCBcIkhPT1JBWVwiIHwgXCJMQVVHSFwiIHwgXCJST0NLRVRcIiB8IFwiVEhVTUJTX0RPV05cIiB8IFwiVEhVTUJTX1VQXCIgfCBcIiVmdXR1cmUgYWRkZWQgdmFsdWVcIjtcbmltcG9ydCB0eXBlIHsgRnJhZ21lbnRSZWZlcmVuY2UgfSBmcm9tIFwicmVsYXktcnVudGltZVwiO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgZW1vamlSZWFjdGlvbnNWaWV3X3JlYWN0YWJsZSRyZWY6IEZyYWdtZW50UmVmZXJlbmNlO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgZW1vamlSZWFjdGlvbnNWaWV3X3JlYWN0YWJsZSRmcmFnbWVudFR5cGU6IGVtb2ppUmVhY3Rpb25zVmlld19yZWFjdGFibGUkcmVmO1xuZXhwb3J0IHR5cGUgZW1vamlSZWFjdGlvbnNWaWV3X3JlYWN0YWJsZSA9IHt8XG4gICtpZDogc3RyaW5nLFxuICArcmVhY3Rpb25Hcm91cHM6ID8kUmVhZE9ubHlBcnJheTx7fFxuICAgICtjb250ZW50OiBSZWFjdGlvbkNvbnRlbnQsXG4gICAgK3ZpZXdlckhhc1JlYWN0ZWQ6IGJvb2xlYW4sXG4gICAgK3VzZXJzOiB7fFxuICAgICAgK3RvdGFsQ291bnQ6IG51bWJlclxuICAgIHx9LFxuICB8fT4sXG4gICt2aWV3ZXJDYW5SZWFjdDogYm9vbGVhbixcbiAgKyRyZWZUeXBlOiBlbW9qaVJlYWN0aW9uc1ZpZXdfcmVhY3RhYmxlJHJlZixcbnx9O1xuZXhwb3J0IHR5cGUgZW1vamlSZWFjdGlvbnNWaWV3X3JlYWN0YWJsZSRkYXRhID0gZW1vamlSZWFjdGlvbnNWaWV3X3JlYWN0YWJsZTtcbmV4cG9ydCB0eXBlIGVtb2ppUmVhY3Rpb25zVmlld19yZWFjdGFibGUka2V5ID0ge1xuICArJGRhdGE/OiBlbW9qaVJlYWN0aW9uc1ZpZXdfcmVhY3RhYmxlJGRhdGEsXG4gICskZnJhZ21lbnRSZWZzOiBlbW9qaVJlYWN0aW9uc1ZpZXdfcmVhY3RhYmxlJHJlZixcbn07XG4qL1xuXG5cbmNvbnN0IG5vZGUvKjogUmVhZGVyRnJhZ21lbnQqLyA9IHtcbiAgXCJraW5kXCI6IFwiRnJhZ21lbnRcIixcbiAgXCJuYW1lXCI6IFwiZW1vamlSZWFjdGlvbnNWaWV3X3JlYWN0YWJsZVwiLFxuICBcInR5cGVcIjogXCJSZWFjdGFibGVcIixcbiAgXCJtZXRhZGF0YVwiOiBudWxsLFxuICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogW10sXG4gIFwic2VsZWN0aW9uc1wiOiBbXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcImlkXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwicmVhY3Rpb25Hcm91cHNcIixcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlJlYWN0aW9uR3JvdXBcIixcbiAgICAgIFwicGx1cmFsXCI6IHRydWUsXG4gICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgXCJuYW1lXCI6IFwiY29udGVudFwiLFxuICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICBcIm5hbWVcIjogXCJ2aWV3ZXJIYXNSZWFjdGVkXCIsXG4gICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgIFwibmFtZVwiOiBcInVzZXJzXCIsXG4gICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJSZWFjdGluZ1VzZXJDb25uZWN0aW9uXCIsXG4gICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ0b3RhbENvdW50XCIsXG4gICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcInZpZXdlckNhblJlYWN0XCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfVxuICBdXG59O1xuLy8gcHJldHRpZXItaWdub3JlXG4obm9kZS8qOiBhbnkqLykuaGFzaCA9ICdmZGUxNTYwMDdmNDJkODQxNDAxNjMyZmNlNzk4NzVkNSc7XG5tb2R1bGUuZXhwb3J0cyA9IG5vZGU7XG4iXX0=