/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
type commitCommentThreadView_item$ref = any;
type commitsView_nodes$ref = any;
type crossReferencedEventsView_nodes$ref = any;
type headRefForcePushedEventView_issueish$ref = any;
type headRefForcePushedEventView_item$ref = any;
type issueCommentView_item$ref = any;
type mergedEventView_item$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type prTimelineController_pullRequest$ref: FragmentReference;
declare export opaque type prTimelineController_pullRequest$fragmentType: prTimelineController_pullRequest$ref;
export type prTimelineController_pullRequest = {|
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
        +$fragmentRefs: commitsView_nodes$ref & issueCommentView_item$ref & mergedEventView_item$ref & headRefForcePushedEventView_item$ref & commitCommentThreadView_item$ref & crossReferencedEventsView_nodes$ref,
      |},
    |}>,
  |},
  +$fragmentRefs: headRefForcePushedEventView_issueish$ref,
  +$refType: prTimelineController_pullRequest$ref,
|};
export type prTimelineController_pullRequest$data = prTimelineController_pullRequest;
export type prTimelineController_pullRequest$key = {
  +$data?: prTimelineController_pullRequest$data,
  +$fragmentRefs: prTimelineController_pullRequest$ref,
};
*/
const node /*: ReaderFragment*/ = {
  "kind": "Fragment",
  "name": "prTimelineController_pullRequest",
  "type": "PullRequest",
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
    "name": "__prTimelineContainer_timelineItems_connection",
    "storageKey": null,
    "args": null,
    "concreteType": "PullRequestTimelineItemsConnection",
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
      "concreteType": "PullRequestTimelineItemsEdge",
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
          "name": "commitsView_nodes",
          "args": null
        }, {
          "kind": "FragmentSpread",
          "name": "issueCommentView_item",
          "args": null
        }, {
          "kind": "FragmentSpread",
          "name": "mergedEventView_item",
          "args": null
        }, {
          "kind": "FragmentSpread",
          "name": "headRefForcePushedEventView_item",
          "args": null
        }, {
          "kind": "FragmentSpread",
          "name": "commitCommentThreadView_item",
          "args": null
        }, {
          "kind": "FragmentSpread",
          "name": "crossReferencedEventsView_nodes",
          "args": null
        }]
      }]
    }]
  }, {
    "kind": "FragmentSpread",
    "name": "headRefForcePushedEventView_issueish",
    "args": null
  }]
};
// prettier-ignore
node /*: any*/.hash = '048c72a9c157a3d7c9fdc301905a1eeb';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJub2RlIiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwic291cmNlcyI6WyJwclRpbWVsaW5lQ29udHJvbGxlcl9wdWxsUmVxdWVzdC5ncmFwaHFsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZsb3dcbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qOjpcbmltcG9ydCB0eXBlIHsgUmVhZGVyRnJhZ21lbnQgfSBmcm9tICdyZWxheS1ydW50aW1lJztcbnR5cGUgY29tbWl0Q29tbWVudFRocmVhZFZpZXdfaXRlbSRyZWYgPSBhbnk7XG50eXBlIGNvbW1pdHNWaWV3X25vZGVzJHJlZiA9IGFueTtcbnR5cGUgY3Jvc3NSZWZlcmVuY2VkRXZlbnRzVmlld19ub2RlcyRyZWYgPSBhbnk7XG50eXBlIGhlYWRSZWZGb3JjZVB1c2hlZEV2ZW50Vmlld19pc3N1ZWlzaCRyZWYgPSBhbnk7XG50eXBlIGhlYWRSZWZGb3JjZVB1c2hlZEV2ZW50Vmlld19pdGVtJHJlZiA9IGFueTtcbnR5cGUgaXNzdWVDb21tZW50Vmlld19pdGVtJHJlZiA9IGFueTtcbnR5cGUgbWVyZ2VkRXZlbnRWaWV3X2l0ZW0kcmVmID0gYW55O1xuaW1wb3J0IHR5cGUgeyBGcmFnbWVudFJlZmVyZW5jZSB9IGZyb20gXCJyZWxheS1ydW50aW1lXCI7XG5kZWNsYXJlIGV4cG9ydCBvcGFxdWUgdHlwZSBwclRpbWVsaW5lQ29udHJvbGxlcl9wdWxsUmVxdWVzdCRyZWY6IEZyYWdtZW50UmVmZXJlbmNlO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgcHJUaW1lbGluZUNvbnRyb2xsZXJfcHVsbFJlcXVlc3QkZnJhZ21lbnRUeXBlOiBwclRpbWVsaW5lQ29udHJvbGxlcl9wdWxsUmVxdWVzdCRyZWY7XG5leHBvcnQgdHlwZSBwclRpbWVsaW5lQ29udHJvbGxlcl9wdWxsUmVxdWVzdCA9IHt8XG4gICt1cmw6IGFueSxcbiAgK3RpbWVsaW5lSXRlbXM6IHt8XG4gICAgK3BhZ2VJbmZvOiB7fFxuICAgICAgK2VuZEN1cnNvcjogP3N0cmluZyxcbiAgICAgICtoYXNOZXh0UGFnZTogYm9vbGVhbixcbiAgICB8fSxcbiAgICArZWRnZXM6ID8kUmVhZE9ubHlBcnJheTw/e3xcbiAgICAgICtjdXJzb3I6IHN0cmluZyxcbiAgICAgICtub2RlOiA/e3xcbiAgICAgICAgK19fdHlwZW5hbWU6IHN0cmluZyxcbiAgICAgICAgKyRmcmFnbWVudFJlZnM6IGNvbW1pdHNWaWV3X25vZGVzJHJlZiAmIGlzc3VlQ29tbWVudFZpZXdfaXRlbSRyZWYgJiBtZXJnZWRFdmVudFZpZXdfaXRlbSRyZWYgJiBoZWFkUmVmRm9yY2VQdXNoZWRFdmVudFZpZXdfaXRlbSRyZWYgJiBjb21taXRDb21tZW50VGhyZWFkVmlld19pdGVtJHJlZiAmIGNyb3NzUmVmZXJlbmNlZEV2ZW50c1ZpZXdfbm9kZXMkcmVmLFxuICAgICAgfH0sXG4gICAgfH0+LFxuICB8fSxcbiAgKyRmcmFnbWVudFJlZnM6IGhlYWRSZWZGb3JjZVB1c2hlZEV2ZW50Vmlld19pc3N1ZWlzaCRyZWYsXG4gICskcmVmVHlwZTogcHJUaW1lbGluZUNvbnRyb2xsZXJfcHVsbFJlcXVlc3QkcmVmLFxufH07XG5leHBvcnQgdHlwZSBwclRpbWVsaW5lQ29udHJvbGxlcl9wdWxsUmVxdWVzdCRkYXRhID0gcHJUaW1lbGluZUNvbnRyb2xsZXJfcHVsbFJlcXVlc3Q7XG5leHBvcnQgdHlwZSBwclRpbWVsaW5lQ29udHJvbGxlcl9wdWxsUmVxdWVzdCRrZXkgPSB7XG4gICskZGF0YT86IHByVGltZWxpbmVDb250cm9sbGVyX3B1bGxSZXF1ZXN0JGRhdGEsXG4gICskZnJhZ21lbnRSZWZzOiBwclRpbWVsaW5lQ29udHJvbGxlcl9wdWxsUmVxdWVzdCRyZWYsXG59O1xuKi9cblxuXG5jb25zdCBub2RlLyo6IFJlYWRlckZyYWdtZW50Ki8gPSB7XG4gIFwia2luZFwiOiBcIkZyYWdtZW50XCIsXG4gIFwibmFtZVwiOiBcInByVGltZWxpbmVDb250cm9sbGVyX3B1bGxSZXF1ZXN0XCIsXG4gIFwidHlwZVwiOiBcIlB1bGxSZXF1ZXN0XCIsXG4gIFwibWV0YWRhdGFcIjoge1xuICAgIFwiY29ubmVjdGlvblwiOiBbXG4gICAgICB7XG4gICAgICAgIFwiY291bnRcIjogXCJ0aW1lbGluZUNvdW50XCIsXG4gICAgICAgIFwiY3Vyc29yXCI6IFwidGltZWxpbmVDdXJzb3JcIixcbiAgICAgICAgXCJkaXJlY3Rpb25cIjogXCJmb3J3YXJkXCIsXG4gICAgICAgIFwicGF0aFwiOiBbXG4gICAgICAgICAgXCJ0aW1lbGluZUl0ZW1zXCJcbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6IFtcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgICBcIm5hbWVcIjogXCJ0aW1lbGluZUNvdW50XCIsXG4gICAgICBcInR5cGVcIjogXCJJbnQhXCIsXG4gICAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgICBcIm5hbWVcIjogXCJ0aW1lbGluZUN1cnNvclwiLFxuICAgICAgXCJ0eXBlXCI6IFwiU3RyaW5nXCIsXG4gICAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gICAgfVxuICBdLFxuICBcInNlbGVjdGlvbnNcIjogW1xuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJ1cmxcIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IFwidGltZWxpbmVJdGVtc1wiLFxuICAgICAgXCJuYW1lXCI6IFwiX19wclRpbWVsaW5lQ29udGFpbmVyX3RpbWVsaW5lSXRlbXNfY29ubmVjdGlvblwiLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUHVsbFJlcXVlc3RUaW1lbGluZUl0ZW1zQ29ubmVjdGlvblwiLFxuICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgXCJuYW1lXCI6IFwicGFnZUluZm9cIixcbiAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlBhZ2VJbmZvXCIsXG4gICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJlbmRDdXJzb3JcIixcbiAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImhhc05leHRQYWdlXCIsXG4gICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgIFwibmFtZVwiOiBcImVkZ2VzXCIsXG4gICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJQdWxsUmVxdWVzdFRpbWVsaW5lSXRlbXNFZGdlXCIsXG4gICAgICAgICAgXCJwbHVyYWxcIjogdHJ1ZSxcbiAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImN1cnNvclwiLFxuICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibm9kZVwiLFxuICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJfX3R5cGVuYW1lXCIsXG4gICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJGcmFnbWVudFNwcmVhZFwiLFxuICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY29tbWl0c1ZpZXdfbm9kZXNcIixcbiAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJGcmFnbWVudFNwcmVhZFwiLFxuICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaXNzdWVDb21tZW50Vmlld19pdGVtXCIsXG4gICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiRnJhZ21lbnRTcHJlYWRcIixcbiAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm1lcmdlZEV2ZW50Vmlld19pdGVtXCIsXG4gICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiRnJhZ21lbnRTcHJlYWRcIixcbiAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImhlYWRSZWZGb3JjZVB1c2hlZEV2ZW50Vmlld19pdGVtXCIsXG4gICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiRnJhZ21lbnRTcHJlYWRcIixcbiAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbW1pdENvbW1lbnRUaHJlYWRWaWV3X2l0ZW1cIixcbiAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJGcmFnbWVudFNwcmVhZFwiLFxuICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY3Jvc3NSZWZlcmVuY2VkRXZlbnRzVmlld19ub2Rlc1wiLFxuICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkZyYWdtZW50U3ByZWFkXCIsXG4gICAgICBcIm5hbWVcIjogXCJoZWFkUmVmRm9yY2VQdXNoZWRFdmVudFZpZXdfaXNzdWVpc2hcIixcbiAgICAgIFwiYXJnc1wiOiBudWxsXG4gICAgfVxuICBdXG59O1xuLy8gcHJldHRpZXItaWdub3JlXG4obm9kZS8qOiBhbnkqLykuaGFzaCA9ICcwNDhjNzJhOWMxNTdhM2Q3YzlmZGMzMDE5MDVhMWVlYic7XG5tb2R1bGUuZXhwb3J0cyA9IG5vZGU7XG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxZQUFZOztBQUVaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBLE1BQU1BLElBQUksd0JBQXVCO0VBQy9CLE1BQU0sRUFBRSxVQUFVO0VBQ2xCLE1BQU0sRUFBRSxrQ0FBa0M7RUFDMUMsTUFBTSxFQUFFLGFBQWE7RUFDckIsVUFBVSxFQUFFO0lBQ1YsWUFBWSxFQUFFLENBQ1o7TUFDRSxPQUFPLEVBQUUsZUFBZTtNQUN4QixRQUFRLEVBQUUsZ0JBQWdCO01BQzFCLFdBQVcsRUFBRSxTQUFTO01BQ3RCLE1BQU0sRUFBRSxDQUNOLGVBQWU7SUFFbkIsQ0FBQztFQUVMLENBQUM7RUFDRCxxQkFBcUIsRUFBRSxDQUNyQjtJQUNFLE1BQU0sRUFBRSxlQUFlO0lBQ3ZCLE1BQU0sRUFBRSxlQUFlO0lBQ3ZCLE1BQU0sRUFBRSxNQUFNO0lBQ2QsY0FBYyxFQUFFO0VBQ2xCLENBQUMsRUFDRDtJQUNFLE1BQU0sRUFBRSxlQUFlO0lBQ3ZCLE1BQU0sRUFBRSxnQkFBZ0I7SUFDeEIsTUFBTSxFQUFFLFFBQVE7SUFDaEIsY0FBYyxFQUFFO0VBQ2xCLENBQUMsQ0FDRjtFQUNELFlBQVksRUFBRSxDQUNaO0lBQ0UsTUFBTSxFQUFFLGFBQWE7SUFDckIsT0FBTyxFQUFFLElBQUk7SUFDYixNQUFNLEVBQUUsS0FBSztJQUNiLE1BQU0sRUFBRSxJQUFJO0lBQ1osWUFBWSxFQUFFO0VBQ2hCLENBQUMsRUFDRDtJQUNFLE1BQU0sRUFBRSxhQUFhO0lBQ3JCLE9BQU8sRUFBRSxlQUFlO0lBQ3hCLE1BQU0sRUFBRSxnREFBZ0Q7SUFDeEQsWUFBWSxFQUFFLElBQUk7SUFDbEIsTUFBTSxFQUFFLElBQUk7SUFDWixjQUFjLEVBQUUsb0NBQW9DO0lBQ3BELFFBQVEsRUFBRSxLQUFLO0lBQ2YsWUFBWSxFQUFFLENBQ1o7TUFDRSxNQUFNLEVBQUUsYUFBYTtNQUNyQixPQUFPLEVBQUUsSUFBSTtNQUNiLE1BQU0sRUFBRSxVQUFVO01BQ2xCLFlBQVksRUFBRSxJQUFJO01BQ2xCLE1BQU0sRUFBRSxJQUFJO01BQ1osY0FBYyxFQUFFLFVBQVU7TUFDMUIsUUFBUSxFQUFFLEtBQUs7TUFDZixZQUFZLEVBQUUsQ0FDWjtRQUNFLE1BQU0sRUFBRSxhQUFhO1FBQ3JCLE9BQU8sRUFBRSxJQUFJO1FBQ2IsTUFBTSxFQUFFLFdBQVc7UUFDbkIsTUFBTSxFQUFFLElBQUk7UUFDWixZQUFZLEVBQUU7TUFDaEIsQ0FBQyxFQUNEO1FBQ0UsTUFBTSxFQUFFLGFBQWE7UUFDckIsT0FBTyxFQUFFLElBQUk7UUFDYixNQUFNLEVBQUUsYUFBYTtRQUNyQixNQUFNLEVBQUUsSUFBSTtRQUNaLFlBQVksRUFBRTtNQUNoQixDQUFDO0lBRUwsQ0FBQyxFQUNEO01BQ0UsTUFBTSxFQUFFLGFBQWE7TUFDckIsT0FBTyxFQUFFLElBQUk7TUFDYixNQUFNLEVBQUUsT0FBTztNQUNmLFlBQVksRUFBRSxJQUFJO01BQ2xCLE1BQU0sRUFBRSxJQUFJO01BQ1osY0FBYyxFQUFFLDhCQUE4QjtNQUM5QyxRQUFRLEVBQUUsSUFBSTtNQUNkLFlBQVksRUFBRSxDQUNaO1FBQ0UsTUFBTSxFQUFFLGFBQWE7UUFDckIsT0FBTyxFQUFFLElBQUk7UUFDYixNQUFNLEVBQUUsUUFBUTtRQUNoQixNQUFNLEVBQUUsSUFBSTtRQUNaLFlBQVksRUFBRTtNQUNoQixDQUFDLEVBQ0Q7UUFDRSxNQUFNLEVBQUUsYUFBYTtRQUNyQixPQUFPLEVBQUUsSUFBSTtRQUNiLE1BQU0sRUFBRSxNQUFNO1FBQ2QsWUFBWSxFQUFFLElBQUk7UUFDbEIsTUFBTSxFQUFFLElBQUk7UUFDWixjQUFjLEVBQUUsSUFBSTtRQUNwQixRQUFRLEVBQUUsS0FBSztRQUNmLFlBQVksRUFBRSxDQUNaO1VBQ0UsTUFBTSxFQUFFLGFBQWE7VUFDckIsT0FBTyxFQUFFLElBQUk7VUFDYixNQUFNLEVBQUUsWUFBWTtVQUNwQixNQUFNLEVBQUUsSUFBSTtVQUNaLFlBQVksRUFBRTtRQUNoQixDQUFDLEVBQ0Q7VUFDRSxNQUFNLEVBQUUsZ0JBQWdCO1VBQ3hCLE1BQU0sRUFBRSxtQkFBbUI7VUFDM0IsTUFBTSxFQUFFO1FBQ1YsQ0FBQyxFQUNEO1VBQ0UsTUFBTSxFQUFFLGdCQUFnQjtVQUN4QixNQUFNLEVBQUUsdUJBQXVCO1VBQy9CLE1BQU0sRUFBRTtRQUNWLENBQUMsRUFDRDtVQUNFLE1BQU0sRUFBRSxnQkFBZ0I7VUFDeEIsTUFBTSxFQUFFLHNCQUFzQjtVQUM5QixNQUFNLEVBQUU7UUFDVixDQUFDLEVBQ0Q7VUFDRSxNQUFNLEVBQUUsZ0JBQWdCO1VBQ3hCLE1BQU0sRUFBRSxrQ0FBa0M7VUFDMUMsTUFBTSxFQUFFO1FBQ1YsQ0FBQyxFQUNEO1VBQ0UsTUFBTSxFQUFFLGdCQUFnQjtVQUN4QixNQUFNLEVBQUUsOEJBQThCO1VBQ3RDLE1BQU0sRUFBRTtRQUNWLENBQUMsRUFDRDtVQUNFLE1BQU0sRUFBRSxnQkFBZ0I7VUFDeEIsTUFBTSxFQUFFLGlDQUFpQztVQUN6QyxNQUFNLEVBQUU7UUFDVixDQUFDO01BRUwsQ0FBQztJQUVMLENBQUM7RUFFTCxDQUFDLEVBQ0Q7SUFDRSxNQUFNLEVBQUUsZ0JBQWdCO0lBQ3hCLE1BQU0sRUFBRSxzQ0FBc0M7SUFDOUMsTUFBTSxFQUFFO0VBQ1YsQ0FBQztBQUVMLENBQUM7QUFDRDtBQUNDQSxJQUFJLFdBQVdDLElBQUksR0FBRyxrQ0FBa0M7QUFDekRDLE1BQU0sQ0FBQ0MsT0FBTyxHQUFHSCxJQUFJIn0=