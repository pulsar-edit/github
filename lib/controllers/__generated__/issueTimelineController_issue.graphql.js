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
const node /*: ReaderFragment*/ = {
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
};
// prettier-ignore
node /*: any*/.hash = 'd8cfa7a752ac7094c36e60da5e1ff895';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJub2RlIiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwic291cmNlcyI6WyJpc3N1ZVRpbWVsaW5lQ29udHJvbGxlcl9pc3N1ZS5ncmFwaHFsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZsb3dcbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qOjpcbmltcG9ydCB0eXBlIHsgUmVhZGVyRnJhZ21lbnQgfSBmcm9tICdyZWxheS1ydW50aW1lJztcbnR5cGUgY3Jvc3NSZWZlcmVuY2VkRXZlbnRzVmlld19ub2RlcyRyZWYgPSBhbnk7XG50eXBlIGlzc3VlQ29tbWVudFZpZXdfaXRlbSRyZWYgPSBhbnk7XG5pbXBvcnQgdHlwZSB7IEZyYWdtZW50UmVmZXJlbmNlIH0gZnJvbSBcInJlbGF5LXJ1bnRpbWVcIjtcbmRlY2xhcmUgZXhwb3J0IG9wYXF1ZSB0eXBlIGlzc3VlVGltZWxpbmVDb250cm9sbGVyX2lzc3VlJHJlZjogRnJhZ21lbnRSZWZlcmVuY2U7XG5kZWNsYXJlIGV4cG9ydCBvcGFxdWUgdHlwZSBpc3N1ZVRpbWVsaW5lQ29udHJvbGxlcl9pc3N1ZSRmcmFnbWVudFR5cGU6IGlzc3VlVGltZWxpbmVDb250cm9sbGVyX2lzc3VlJHJlZjtcbmV4cG9ydCB0eXBlIGlzc3VlVGltZWxpbmVDb250cm9sbGVyX2lzc3VlID0ge3xcbiAgK3VybDogYW55LFxuICArdGltZWxpbmVJdGVtczoge3xcbiAgICArcGFnZUluZm86IHt8XG4gICAgICArZW5kQ3Vyc29yOiA/c3RyaW5nLFxuICAgICAgK2hhc05leHRQYWdlOiBib29sZWFuLFxuICAgIHx9LFxuICAgICtlZGdlczogPyRSZWFkT25seUFycmF5PD97fFxuICAgICAgK2N1cnNvcjogc3RyaW5nLFxuICAgICAgK25vZGU6ID97fFxuICAgICAgICArX190eXBlbmFtZTogc3RyaW5nLFxuICAgICAgICArJGZyYWdtZW50UmVmczogaXNzdWVDb21tZW50Vmlld19pdGVtJHJlZiAmIGNyb3NzUmVmZXJlbmNlZEV2ZW50c1ZpZXdfbm9kZXMkcmVmLFxuICAgICAgfH0sXG4gICAgfH0+LFxuICB8fSxcbiAgKyRyZWZUeXBlOiBpc3N1ZVRpbWVsaW5lQ29udHJvbGxlcl9pc3N1ZSRyZWYsXG58fTtcbmV4cG9ydCB0eXBlIGlzc3VlVGltZWxpbmVDb250cm9sbGVyX2lzc3VlJGRhdGEgPSBpc3N1ZVRpbWVsaW5lQ29udHJvbGxlcl9pc3N1ZTtcbmV4cG9ydCB0eXBlIGlzc3VlVGltZWxpbmVDb250cm9sbGVyX2lzc3VlJGtleSA9IHtcbiAgKyRkYXRhPzogaXNzdWVUaW1lbGluZUNvbnRyb2xsZXJfaXNzdWUkZGF0YSxcbiAgKyRmcmFnbWVudFJlZnM6IGlzc3VlVGltZWxpbmVDb250cm9sbGVyX2lzc3VlJHJlZixcbn07XG4qL1xuXG5cbmNvbnN0IG5vZGUvKjogUmVhZGVyRnJhZ21lbnQqLyA9IHtcbiAgXCJraW5kXCI6IFwiRnJhZ21lbnRcIixcbiAgXCJuYW1lXCI6IFwiaXNzdWVUaW1lbGluZUNvbnRyb2xsZXJfaXNzdWVcIixcbiAgXCJ0eXBlXCI6IFwiSXNzdWVcIixcbiAgXCJtZXRhZGF0YVwiOiB7XG4gICAgXCJjb25uZWN0aW9uXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJjb3VudFwiOiBcInRpbWVsaW5lQ291bnRcIixcbiAgICAgICAgXCJjdXJzb3JcIjogXCJ0aW1lbGluZUN1cnNvclwiLFxuICAgICAgICBcImRpcmVjdGlvblwiOiBcImZvcndhcmRcIixcbiAgICAgICAgXCJwYXRoXCI6IFtcbiAgICAgICAgICBcInRpbWVsaW5lSXRlbXNcIlxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9LFxuICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogW1xuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICAgIFwibmFtZVwiOiBcInRpbWVsaW5lQ291bnRcIixcbiAgICAgIFwidHlwZVwiOiBcIkludCFcIixcbiAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICAgIFwibmFtZVwiOiBcInRpbWVsaW5lQ3Vyc29yXCIsXG4gICAgICBcInR5cGVcIjogXCJTdHJpbmdcIixcbiAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgICB9XG4gIF0sXG4gIFwic2VsZWN0aW9uc1wiOiBbXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcInVybFwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogXCJ0aW1lbGluZUl0ZW1zXCIsXG4gICAgICBcIm5hbWVcIjogXCJfX0lzc3VlVGltZWxpbmVDb250cm9sbGVyX3RpbWVsaW5lSXRlbXNfY29ubmVjdGlvblwiLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiSXNzdWVUaW1lbGluZUl0ZW1zQ29ubmVjdGlvblwiLFxuICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgXCJuYW1lXCI6IFwicGFnZUluZm9cIixcbiAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlBhZ2VJbmZvXCIsXG4gICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJlbmRDdXJzb3JcIixcbiAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImhhc05leHRQYWdlXCIsXG4gICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgIFwibmFtZVwiOiBcImVkZ2VzXCIsXG4gICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJJc3N1ZVRpbWVsaW5lSXRlbXNFZGdlXCIsXG4gICAgICAgICAgXCJwbHVyYWxcIjogdHJ1ZSxcbiAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImN1cnNvclwiLFxuICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibm9kZVwiLFxuICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJfX3R5cGVuYW1lXCIsXG4gICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJGcmFnbWVudFNwcmVhZFwiLFxuICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaXNzdWVDb21tZW50Vmlld19pdGVtXCIsXG4gICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiRnJhZ21lbnRTcHJlYWRcIixcbiAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNyb3NzUmVmZXJlbmNlZEV2ZW50c1ZpZXdfbm9kZXNcIixcbiAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICBdXG59O1xuLy8gcHJldHRpZXItaWdub3JlXG4obm9kZS8qOiBhbnkqLykuaGFzaCA9ICdkOGNmYTdhNzUyYWM3MDk0YzM2ZTYwZGE1ZTFmZjg5NSc7XG5tb2R1bGUuZXhwb3J0cyA9IG5vZGU7XG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxZQUFZOztBQUVaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBLE1BQU1BLElBQUksd0JBQXVCO0VBQy9CLE1BQU0sRUFBRSxVQUFVO0VBQ2xCLE1BQU0sRUFBRSwrQkFBK0I7RUFDdkMsTUFBTSxFQUFFLE9BQU87RUFDZixVQUFVLEVBQUU7SUFDVixZQUFZLEVBQUUsQ0FDWjtNQUNFLE9BQU8sRUFBRSxlQUFlO01BQ3hCLFFBQVEsRUFBRSxnQkFBZ0I7TUFDMUIsV0FBVyxFQUFFLFNBQVM7TUFDdEIsTUFBTSxFQUFFLENBQ04sZUFBZTtJQUVuQixDQUFDO0VBRUwsQ0FBQztFQUNELHFCQUFxQixFQUFFLENBQ3JCO0lBQ0UsTUFBTSxFQUFFLGVBQWU7SUFDdkIsTUFBTSxFQUFFLGVBQWU7SUFDdkIsTUFBTSxFQUFFLE1BQU07SUFDZCxjQUFjLEVBQUU7RUFDbEIsQ0FBQyxFQUNEO0lBQ0UsTUFBTSxFQUFFLGVBQWU7SUFDdkIsTUFBTSxFQUFFLGdCQUFnQjtJQUN4QixNQUFNLEVBQUUsUUFBUTtJQUNo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