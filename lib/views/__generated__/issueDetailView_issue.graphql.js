/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
type emojiReactionsView_reactable$ref = any;
type issueTimelineController_issue$ref = any;
export type IssueState = "CLOSED" | "OPEN" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type issueDetailView_issue$ref: FragmentReference;
declare export opaque type issueDetailView_issue$fragmentType: issueDetailView_issue$ref;
export type issueDetailView_issue = {|
  +id: string,
  +url: any,
  +state: IssueState,
  +number: number,
  +title: string,
  +bodyHTML: any,
  +author: ?{|
    +login: string,
    +avatarUrl: any,
    +url: any,
  |},
  +__typename: "Issue",
  +$fragmentRefs: issueTimelineController_issue$ref & emojiReactionsView_reactable$ref,
  +$refType: issueDetailView_issue$ref,
|};
export type issueDetailView_issue$data = issueDetailView_issue;
export type issueDetailView_issue$key = {
  +$data?: issueDetailView_issue$data,
  +$fragmentRefs: issueDetailView_issue$ref,
};
*/
const node /*: ReaderFragment*/ = function () {
  var v0 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "url",
    "args": null,
    "storageKey": null
  };
  return {
    "kind": "Fragment",
    "name": "issueDetailView_issue",
    "type": "Issue",
    "metadata": null,
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
      "name": "id",
      "args": null,
      "storageKey": null
    }, {
      "kind": "ScalarField",
      "alias": null,
      "name": "__typename",
      "args": null,
      "storageKey": null
    }, v0 /*: any*/, {
      "kind": "ScalarField",
      "alias": null,
      "name": "state",
      "args": null,
      "storageKey": null
    }, {
      "kind": "ScalarField",
      "alias": null,
      "name": "number",
      "args": null,
      "storageKey": null
    }, {
      "kind": "ScalarField",
      "alias": null,
      "name": "title",
      "args": null,
      "storageKey": null
    }, {
      "kind": "ScalarField",
      "alias": null,
      "name": "bodyHTML",
      "args": null,
      "storageKey": null
    }, {
      "kind": "LinkedField",
      "alias": null,
      "name": "author",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": false,
      "selections": [{
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
      }, v0 /*: any*/]
    }, {
      "kind": "FragmentSpread",
      "name": "issueTimelineController_issue",
      "args": [{
        "kind": "Variable",
        "name": "timelineCount",
        "variableName": "timelineCount"
      }, {
        "kind": "Variable",
        "name": "timelineCursor",
        "variableName": "timelineCursor"
      }]
    }, {
      "kind": "FragmentSpread",
      "name": "emojiReactionsView_reactable",
      "args": null
    }]
  };
}();
// prettier-ignore
node /*: any*/.hash = 'f7adc2e75c1d55df78481fd359bf7180';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJub2RlIiwidjAiLCJoYXNoIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJzb3VyY2VzIjpbImlzc3VlRGV0YWlsVmlld19pc3N1ZS5ncmFwaHFsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZsb3dcbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qOjpcbmltcG9ydCB0eXBlIHsgUmVhZGVyRnJhZ21lbnQgfSBmcm9tICdyZWxheS1ydW50aW1lJztcbnR5cGUgZW1vamlSZWFjdGlvbnNWaWV3X3JlYWN0YWJsZSRyZWYgPSBhbnk7XG50eXBlIGlzc3VlVGltZWxpbmVDb250cm9sbGVyX2lzc3VlJHJlZiA9IGFueTtcbmV4cG9ydCB0eXBlIElzc3VlU3RhdGUgPSBcIkNMT1NFRFwiIHwgXCJPUEVOXCIgfCBcIiVmdXR1cmUgYWRkZWQgdmFsdWVcIjtcbmltcG9ydCB0eXBlIHsgRnJhZ21lbnRSZWZlcmVuY2UgfSBmcm9tIFwicmVsYXktcnVudGltZVwiO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgaXNzdWVEZXRhaWxWaWV3X2lzc3VlJHJlZjogRnJhZ21lbnRSZWZlcmVuY2U7XG5kZWNsYXJlIGV4cG9ydCBvcGFxdWUgdHlwZSBpc3N1ZURldGFpbFZpZXdfaXNzdWUkZnJhZ21lbnRUeXBlOiBpc3N1ZURldGFpbFZpZXdfaXNzdWUkcmVmO1xuZXhwb3J0IHR5cGUgaXNzdWVEZXRhaWxWaWV3X2lzc3VlID0ge3xcbiAgK2lkOiBzdHJpbmcsXG4gICt1cmw6IGFueSxcbiAgK3N0YXRlOiBJc3N1ZVN0YXRlLFxuICArbnVtYmVyOiBudW1iZXIsXG4gICt0aXRsZTogc3RyaW5nLFxuICArYm9keUhUTUw6IGFueSxcbiAgK2F1dGhvcjogP3t8XG4gICAgK2xvZ2luOiBzdHJpbmcsXG4gICAgK2F2YXRhclVybDogYW55LFxuICAgICt1cmw6IGFueSxcbiAgfH0sXG4gICtfX3R5cGVuYW1lOiBcIklzc3VlXCIsXG4gICskZnJhZ21lbnRSZWZzOiBpc3N1ZVRpbWVsaW5lQ29udHJvbGxlcl9pc3N1ZSRyZWYgJiBlbW9qaVJlYWN0aW9uc1ZpZXdfcmVhY3RhYmxlJHJlZixcbiAgKyRyZWZUeXBlOiBpc3N1ZURldGFpbFZpZXdfaXNzdWUkcmVmLFxufH07XG5leHBvcnQgdHlwZSBpc3N1ZURldGFpbFZpZXdfaXNzdWUkZGF0YSA9IGlzc3VlRGV0YWlsVmlld19pc3N1ZTtcbmV4cG9ydCB0eXBlIGlzc3VlRGV0YWlsVmlld19pc3N1ZSRrZXkgPSB7XG4gICskZGF0YT86IGlzc3VlRGV0YWlsVmlld19pc3N1ZSRkYXRhLFxuICArJGZyYWdtZW50UmVmczogaXNzdWVEZXRhaWxWaWV3X2lzc3VlJHJlZixcbn07XG4qL1xuXG5cbmNvbnN0IG5vZGUvKjogUmVhZGVyRnJhZ21lbnQqLyA9IChmdW5jdGlvbigpe1xudmFyIHYwID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcInVybFwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn07XG5yZXR1cm4ge1xuICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICBcIm5hbWVcIjogXCJpc3N1ZURldGFpbFZpZXdfaXNzdWVcIixcbiAgXCJ0eXBlXCI6IFwiSXNzdWVcIixcbiAgXCJtZXRhZGF0YVwiOiBudWxsLFxuICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogW1xuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICAgIFwibmFtZVwiOiBcInRpbWVsaW5lQ291bnRcIixcbiAgICAgIFwidHlwZVwiOiBcIkludCFcIixcbiAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICAgIFwibmFtZVwiOiBcInRpbWVsaW5lQ3Vyc29yXCIsXG4gICAgICBcInR5cGVcIjogXCJTdHJpbmdcIixcbiAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgICB9XG4gIF0sXG4gIFwic2VsZWN0aW9uc1wiOiBbXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcImlkXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwiX190eXBlbmFtZVwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH0sXG4gICAgKHYwLyo6IGFueSovKSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwic3RhdGVcIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJudW1iZXJcIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJ0aXRsZVwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcImJvZHlIVE1MXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwiYXV0aG9yXCIsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgIFwibmFtZVwiOiBcImxvZ2luXCIsXG4gICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgIFwibmFtZVwiOiBcImF2YXRhclVybFwiLFxuICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgIH0sXG4gICAgICAgICh2MC8qOiBhbnkqLylcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkZyYWdtZW50U3ByZWFkXCIsXG4gICAgICBcIm5hbWVcIjogXCJpc3N1ZVRpbWVsaW5lQ29udHJvbGxlcl9pc3N1ZVwiLFxuICAgICAgXCJhcmdzXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgICAgICAgXCJuYW1lXCI6IFwidGltZWxpbmVDb3VudFwiLFxuICAgICAgICAgIFwidmFyaWFibGVOYW1lXCI6IFwidGltZWxpbmVDb3VudFwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgICAgICAgIFwibmFtZVwiOiBcInRpbWVsaW5lQ3Vyc29yXCIsXG4gICAgICAgICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJ0aW1lbGluZUN1cnNvclwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkZyYWdtZW50U3ByZWFkXCIsXG4gICAgICBcIm5hbWVcIjogXCJlbW9qaVJlYWN0aW9uc1ZpZXdfcmVhY3RhYmxlXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbFxuICAgIH1cbiAgXVxufTtcbn0pKCk7XG4vLyBwcmV0dGllci1pZ25vcmVcbihub2RlLyo6IGFueSovKS5oYXNoID0gJ2Y3YWRjMmU3NWMxZDU1ZGY3ODQ4MWZkMzU5YmY3MTgwJztcbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOztBQUVBOztBQUVBLFlBQVk7O0FBRVo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0EsTUFBTUEsSUFBSSx3QkFBd0IsWUFBVTtFQUM1QyxJQUFJQyxFQUFFLEdBQUc7SUFDUCxNQUFNLEVBQUUsYUFBYTtJQUNyQixPQUFPLEVBQUUsSUFBSTtJQUNiLE1BQU0sRUFBRSxLQUFLO0lBQ2IsTUFBTSxFQUFFLElBQUk7SUFDWixZQUFZLEVBQUU7RUFDaEIsQ0FBQztFQUNELE9BQU87SUFDTCxN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