/**
 * @flow
 */

/* eslint-disable */
'use strict';
/*::
import type { ReaderFragment } from 'relay-runtime';
type crossReferencedEventsView_nodes$ref = any;
type issueCommentView_item$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type issueTimelineController_issue$ref: FragmentReference;
declare export opaque type issueTimelineController_issue$fragmentType: issueTimelineController_issue$ref;
export type issueTimelineController_issue = {|
  +url: any,
  +timelineItems: {|
    +pageInfo: {|
      +endCursor: ?string,
      +hasNextPage: boolean,
    |},
    +edges: ?$ReadOnlyArray<?{|
      +cursor: string,
      +node: ?{|
        +__typename: string,
        +$fragmentRefs: issueCommentView_item$ref & crossReferencedEventsView_nodes$ref,
      |},
    |}>,
  |},
  +$refType: issueTimelineController_issue$ref,
|};
export type issueTimelineController_issue$data = issueTimelineController_issue;
export type issueTimelineController_issue$key = {
  +$data?: issueTimelineController_issue$data,
  +$fragmentRefs: issueTimelineController_issue$ref,
};
*/

const node
/*: ReaderFragment*/
= {
  "kind": "Fragment",
  "name": "issueTimelineController_issue",
  "type": "Issue",
  "metadata": {
    "connection": [{
      "count": "timelineCount",
      "cursor": "timelineCursor",
      "direction": "forward",
      "path": ["timelineItems"]
    }]
  },
  "argumentDefinitions": [{
    "kind": "LocalArgument",
    "name": "timelineCount",
    "type": "Int!",
    "defaultValue": null
  }, {
    "kind": "LocalArgument",
    "name": "timelineCursor",
    "type": "String",
    "defaultValue": null
  }],
  "selections": [{
    "kind": "ScalarField",
    "alias": null,
    "name": "url",
    "args": null,
    "storageKey": null
  }, {
    "kind": "LinkedField",
    "alias": "timelineItems",
    "name": "__IssueTimelineController_timelineItems_connection",
    "storageKey": null,
    "args": null,
    "concreteType": "IssueTimelineItemsConnection",
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
        "name": "endCursor",
        "args": null,
        "storageKey": null
      }, {
        "kind": "ScalarField",
        "alias": null,
        "name": "hasNextPage",
        "args": null,
        "storageKey": null
      }]
    }, {
      "kind": "LinkedField",
      "alias": null,
      "name": "edges",
      "storageKey": null,
      "args": null,
      "concreteType": "IssueTimelineItemsEdge",
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
        "concreteType": null,
        "plural": false,
        "selections": [{
          "kind": "ScalarField",
          "alias": null,
          "name": "__typename",
          "args": null,
          "storageKey": null
        }, {
          "kind": "FragmentSpread",
          "name": "issueCommentView_item",
          "args": null
        }, {
          "kind": "FragmentSpread",
          "name": "crossReferencedEventsView_nodes",
          "args": null
        }]
      }]
    }]
  }]
}; // prettier-ignore

node
/*: any*/
.hash = 'd8cfa7a752ac7094c36e60da5e1ff895';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9jb250cm9sbGVycy9fX2dlbmVyYXRlZF9fL2lzc3VlVGltZWxpbmVDb250cm9sbGVyX2lzc3VlLmdyYXBocWwuanMiXSwibmFtZXMiOlsibm9kZSIsImhhc2giLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQSxNQUFNQTtBQUFJO0FBQUEsRUFBdUI7QUFDL0IsVUFBUSxVQUR1QjtBQUUvQixVQUFRLCtCQUZ1QjtBQUcvQixVQUFRLE9BSHVCO0FBSS9CLGNBQVk7QUFDVixrQkFBYyxDQUNaO0FBQ0UsZUFBUyxlQURYO0FBRUUsZ0JBQVUsZ0JBRlo7QUFHRSxtQkFBYSxTQUhmO0FBSUUsY0FBUSxDQUNOLGVBRE07QUFKVixLQURZO0FBREosR0FKbUI7QUFnQi9CLHlCQUF1QixDQUNyQjtBQUNFLFlBQVEsZUFEVjtBQUVFLFlBQVEsZUFGVjtBQUdFLFlBQVEsTUFIVjtBQUlFLG9CQUFnQjtBQUpsQixHQURxQixFQU9yQjtBQUNFLFlBQVEsZUFEVjtBQUVFLFlBQVEsZ0JBRlY7QUFHRSxZQUFRLFFBSFY7QUFJRSxvQkFBZ0I7QUFKbEIsR0FQcUIsQ0FoQlE7QUE4Qi9CLGdCQUFjLENBQ1o7QUFDRSxZQUFRLGFBRFY7QUFFRSxhQUFTLElBRlg7QUFHRSxZQUFRLEtBSFY7QUFJRSxZQUFRLElBSlY7QUFLRSxrQkFBYztBQUxoQixHQURZLEVBUVo7QUFDRSxZQUFRLGFBRFY7QUFFRSxhQUFTLGVBRlg7QUFHRSxZQUFRLG9EQUhWO0FBSUUsa0JBQWMsSUFKaEI7QUFLRSxZQUFRLElBTFY7QUFNRSxvQkFBZ0IsOEJBTmxCO0FBT0UsY0FBVSxLQVBaO0FBUUUsa0JBQWMsQ0FDWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsSUFGWDtBQUdFLGNBQVEsVUFIVjtBQUlFLG9CQUFjLElBSmhCO0FBS0UsY0FBUSxJQUxWO0FBTUUsc0JBQWdCLFVBTmxCO0FBT0UsZ0JBQVUsS0FQWjtBQVFFLG9CQUFjLENBQ1o7QUFDRSxnQkFBUSxhQURWO0FBRUUsaUJBQVMsSUFGWDtBQUdFLGdCQUFRLFdBSFY7QUFJRSxnQkFBUSxJQUpWO0FBS0Usc0JBQWM7QUFMaEIsT0FEWSxFQVFaO0FBQ0UsZ0JBQVEsYUFEVjtBQUVFLGlCQUFTLElBRlg7QUFHRSxnQkFBUSxhQUhWO0FBSUUsZ0JBQVEsSUFKVjtBQUtFLHNCQUFjO0FBTGhCLE9BUlk7QUFSaEIsS0FEWSxFQTBCWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsSUFGWDtBQUdFLGNBQVEsT0FIVjtBQUlFLG9CQUFjLElBSmhCO0FBS0UsY0FBUSxJQUxWO0FBTUUsc0JBQWdCLHdCQU5sQjtBQU9FLGdCQUFVLElBUFo7QUFRRSxvQkFBYyxDQUNaO0FBQ0UsZ0JBQVEsYUFEVjtBQUVFLGlCQUFTLElBRlg7QUFHRSxnQkFBUSxRQUhWO0FBSUUsZ0JBQVEsSUFKVjtBQUtFLHNCQUFjO0FBTGhCLE9BRFksRUFRWjtBQUNFLGdCQUFRLGFBRFY7QUFFRSxpQkFBUyxJQUZYO0FBR0UsZ0JBQVEsTUFIVjtBQUlFLHNCQUFjLElBSmhCO0FBS0UsZ0JBQVEsSUFMVjtBQU1FLHdCQUFnQixJQU5sQjtBQU9FLGtCQUFVLEtBUFo7QUFRRSxzQkFBYyxDQUNaO0FBQ0Usa0JBQVEsYUFEVjtBQUVFLG1CQUFTLElBRlg7QUFHRSxrQkFBUSxZQUhWO0FBSUUsa0JBQVEsSUFKVjtBQUtFLHdCQUFjO0FBTGhCLFNBRFksRUFRWjtBQUNFLGtCQUFRLGdCQURWO0FBRUUsa0JBQVEsdUJBRlY7QUFHRSxrQkFBUTtBQUhWLFNBUlksRUFhWjtBQUNFLGtCQUFRLGdCQURWO0FBRUUsa0JBQVEsaUNBRlY7QUFHRSxrQkFBUTtBQUhWLFNBYlk7QUFSaEIsT0FSWTtBQVJoQixLQTFCWTtBQVJoQixHQVJZO0FBOUJpQixDQUFqQyxDLENBMEhBOztBQUNDQTtBQUFJO0FBQUwsQ0FBZ0JDLElBQWhCLEdBQXVCLGtDQUF2QjtBQUNBQyxNQUFNLENBQUNDLE9BQVAsR0FBaUJILElBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmxvd1xuICovXG5cbi8qIGVzbGludC1kaXNhYmxlICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyo6OlxuaW1wb3J0IHR5cGUgeyBSZWFkZXJGcmFnbWVudCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xudHlwZSBjcm9zc1JlZmVyZW5jZWRFdmVudHNWaWV3X25vZGVzJHJlZiA9IGFueTtcbnR5cGUgaXNzdWVDb21tZW50Vmlld19pdGVtJHJlZiA9IGFueTtcbmltcG9ydCB0eXBlIHsgRnJhZ21lbnRSZWZlcmVuY2UgfSBmcm9tIFwicmVsYXktcnVudGltZVwiO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgaXNzdWVUaW1lbGluZUNvbnRyb2xsZXJfaXNzdWUkcmVmOiBGcmFnbWVudFJlZmVyZW5jZTtcbmRlY2xhcmUgZXhwb3J0IG9wYXF1ZSB0eXBlIGlzc3VlVGltZWxpbmVDb250cm9sbGVyX2lzc3VlJGZyYWdtZW50VHlwZTogaXNzdWVUaW1lbGluZUNvbnRyb2xsZXJfaXNzdWUkcmVmO1xuZXhwb3J0IHR5cGUgaXNzdWVUaW1lbGluZUNvbnRyb2xsZXJfaXNzdWUgPSB7fFxuICArdXJsOiBhbnksXG4gICt0aW1lbGluZUl0ZW1zOiB7fFxuICAgICtwYWdlSW5mbzoge3xcbiAgICAgICtlbmRDdXJzb3I6ID9zdHJpbmcsXG4gICAgICAraGFzTmV4dFBhZ2U6IGJvb2xlYW4sXG4gICAgfH0sXG4gICAgK2VkZ2VzOiA/JFJlYWRPbmx5QXJyYXk8P3t8XG4gICAgICArY3Vyc29yOiBzdHJpbmcsXG4gICAgICArbm9kZTogP3t8XG4gICAgICAgICtfX3R5cGVuYW1lOiBzdHJpbmcsXG4gICAgICAgICskZnJhZ21lbnRSZWZzOiBpc3N1ZUNvbW1lbnRWaWV3X2l0ZW0kcmVmICYgY3Jvc3NSZWZlcmVuY2VkRXZlbnRzVmlld19ub2RlcyRyZWYsXG4gICAgICB8fSxcbiAgICB8fT4sXG4gIHx9LFxuICArJHJlZlR5cGU6IGlzc3VlVGltZWxpbmVDb250cm9sbGVyX2lzc3VlJHJlZixcbnx9O1xuZXhwb3J0IHR5cGUgaXNzdWVUaW1lbGluZUNvbnRyb2xsZXJfaXNzdWUkZGF0YSA9IGlzc3VlVGltZWxpbmVDb250cm9sbGVyX2lzc3VlO1xuZXhwb3J0IHR5cGUgaXNzdWVUaW1lbGluZUNvbnRyb2xsZXJfaXNzdWUka2V5ID0ge1xuICArJGRhdGE/OiBpc3N1ZVRpbWVsaW5lQ29udHJvbGxlcl9pc3N1ZSRkYXRhLFxuICArJGZyYWdtZW50UmVmczogaXNzdWVUaW1lbGluZUNvbnRyb2xsZXJfaXNzdWUkcmVmLFxufTtcbiovXG5cblxuY29uc3Qgbm9kZS8qOiBSZWFkZXJGcmFnbWVudCovID0ge1xuICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICBcIm5hbWVcIjogXCJpc3N1ZVRpbWVsaW5lQ29udHJvbGxlcl9pc3N1ZVwiLFxuICBcInR5cGVcIjogXCJJc3N1ZVwiLFxuICBcIm1ldGFkYXRhXCI6IHtcbiAgICBcImNvbm5lY3Rpb25cIjogW1xuICAgICAge1xuICAgICAgICBcImNvdW50XCI6IFwidGltZWxpbmVDb3VudFwiLFxuICAgICAgICBcImN1cnNvclwiOiBcInRpbWVsaW5lQ3Vyc29yXCIsXG4gICAgICAgIFwiZGlyZWN0aW9uXCI6IFwiZm9yd2FyZFwiLFxuICAgICAgICBcInBhdGhcIjogW1xuICAgICAgICAgIFwidGltZWxpbmVJdGVtc1wiXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiBbXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgICAgXCJuYW1lXCI6IFwidGltZWxpbmVDb3VudFwiLFxuICAgICAgXCJ0eXBlXCI6IFwiSW50IVwiLFxuICAgICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgICAgXCJuYW1lXCI6IFwidGltZWxpbmVDdXJzb3JcIixcbiAgICAgIFwidHlwZVwiOiBcIlN0cmluZ1wiLFxuICAgICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICAgIH1cbiAgXSxcbiAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwidXJsXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBcInRpbWVsaW5lSXRlbXNcIixcbiAgICAgIFwibmFtZVwiOiBcIl9fSXNzdWVUaW1lbGluZUNvbnRyb2xsZXJfdGltZWxpbmVJdGVtc19jb25uZWN0aW9uXCIsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJJc3N1ZVRpbWVsaW5lSXRlbXNDb25uZWN0aW9uXCIsXG4gICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICBcIm5hbWVcIjogXCJwYWdlSW5mb1wiLFxuICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUGFnZUluZm9cIixcbiAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImVuZEN1cnNvclwiLFxuICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaGFzTmV4dFBhZ2VcIixcbiAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgXCJuYW1lXCI6IFwiZWRnZXNcIixcbiAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIklzc3VlVGltZWxpbmVJdGVtc0VkZ2VcIixcbiAgICAgICAgICBcInBsdXJhbFwiOiB0cnVlLFxuICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY3Vyc29yXCIsXG4gICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJub2RlXCIsXG4gICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIl9fdHlwZW5hbWVcIixcbiAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkZyYWdtZW50U3ByZWFkXCIsXG4gICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJpc3N1ZUNvbW1lbnRWaWV3X2l0ZW1cIixcbiAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJGcmFnbWVudFNwcmVhZFwiLFxuICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY3Jvc3NSZWZlcmVuY2VkRXZlbnRzVmlld19ub2Rlc1wiLFxuICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIF1cbn07XG4vLyBwcmV0dGllci1pZ25vcmVcbihub2RlLyo6IGFueSovKS5oYXNoID0gJ2Q4Y2ZhN2E3NTJhYzcwOTRjMzZlNjBkYTVlMWZmODk1Jztcbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcbiJdfQ==