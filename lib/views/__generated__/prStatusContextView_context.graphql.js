/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
export type StatusState = "ERROR" | "EXPECTED" | "FAILURE" | "PENDING" | "SUCCESS" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type prStatusContextView_context$ref: FragmentReference;
declare export opaque type prStatusContextView_context$fragmentType: prStatusContextView_context$ref;
export type prStatusContextView_context = {|
  +context: string,
  +description: ?string,
  +state: StatusState,
  +targetUrl: ?any,
  +$refType: prStatusContextView_context$ref,
|};
export type prStatusContextView_context$data = prStatusContextView_context;
export type prStatusContextView_context$key = {
  +$data?: prStatusContextView_context$data,
  +$fragmentRefs: prStatusContextView_context$ref,
};
*/
const node /*: ReaderFragment*/ = {
  "kind": "Fragment",
  "name": "prStatusContextView_context",
  "type": "StatusContext",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [{
    "kind": "ScalarField",
    "alias": null,
    "name": "context",
    "args": null,
    "storageKey": null
  }, {
    "kind": "ScalarField",
    "alias": null,
    "name": "description",
    "args": null,
    "storageKey": null
  }, {
    "kind": "ScalarField",
    "alias": null,
    "name": "state",
    "args": null,
    "storageKey": null
  }, {
    "kind": "ScalarField",
    "alias": null,
    "name": "targetUrl",
    "args": null,
    "storageKey": null
  }]
};
// prettier-ignore
node /*: any*/.hash = 'e729074e494e07b59b4a177416eb7a3c';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJub2RlIiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwic291cmNlcyI6WyJwclN0YXR1c0NvbnRleHRWaWV3X2NvbnRleHQuZ3JhcGhxbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmbG93XG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKjo6XG5pbXBvcnQgdHlwZSB7IFJlYWRlckZyYWdtZW50IH0gZnJvbSAncmVsYXktcnVudGltZSc7XG5leHBvcnQgdHlwZSBTdGF0dXNTdGF0ZSA9IFwiRVJST1JcIiB8IFwiRVhQRUNURURcIiB8IFwiRkFJTFVSRVwiIHwgXCJQRU5ESU5HXCIgfCBcIlNVQ0NFU1NcIiB8IFwiJWZ1dHVyZSBhZGRlZCB2YWx1ZVwiO1xuaW1wb3J0IHR5cGUgeyBGcmFnbWVudFJlZmVyZW5jZSB9IGZyb20gXCJyZWxheS1ydW50aW1lXCI7XG5kZWNsYXJlIGV4cG9ydCBvcGFxdWUgdHlwZSBwclN0YXR1c0NvbnRleHRWaWV3X2NvbnRleHQkcmVmOiBGcmFnbWVudFJlZmVyZW5jZTtcbmRlY2xhcmUgZXhwb3J0IG9wYXF1ZSB0eXBlIHByU3RhdHVzQ29udGV4dFZpZXdfY29udGV4dCRmcmFnbWVudFR5cGU6IHByU3RhdHVzQ29udGV4dFZpZXdfY29udGV4dCRyZWY7XG5leHBvcnQgdHlwZSBwclN0YXR1c0NvbnRleHRWaWV3X2NvbnRleHQgPSB7fFxuICArY29udGV4dDogc3RyaW5nLFxuICArZGVzY3JpcHRpb246ID9zdHJpbmcsXG4gICtzdGF0ZTogU3RhdHVzU3RhdGUsXG4gICt0YXJnZXRVcmw6ID9hbnksXG4gICskcmVmVHlwZTogcHJTdGF0dXNDb250ZXh0Vmlld19jb250ZXh0JHJlZixcbnx9O1xuZXhwb3J0IHR5cGUgcHJTdGF0dXNDb250ZXh0Vmlld19jb250ZXh0JGRhdGEgPSBwclN0YXR1c0NvbnRleHRWaWV3X2NvbnRleHQ7XG5leHBvcnQgdHlwZSBwclN0YXR1c0NvbnRleHRWaWV3X2NvbnRleHQka2V5ID0ge1xuICArJGRhdGE/OiBwclN0YXR1c0NvbnRleHRWaWV3X2NvbnRleHQkZGF0YSxcbiAgKyRmcmFnbWVudFJlZnM6IHByU3RhdHVzQ29udGV4dFZpZXdfY29udGV4dCRyZWYsXG59O1xuKi9cblxuXG5jb25zdCBub2RlLyo6IFJlYWRlckZyYWdtZW50Ki8gPSB7XG4gIFwia2luZFwiOiBcIkZyYWdtZW50XCIsXG4gIFwibmFtZVwiOiBcInByU3RhdHVzQ29udGV4dFZpZXdfY29udGV4dFwiLFxuICBcInR5cGVcIjogXCJTdGF0dXNDb250ZXh0XCIsXG4gIFwibWV0YWRhdGFcIjogbnVsbCxcbiAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6IFtdLFxuICBcInNlbGVjdGlvbnNcIjogW1xuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJjb250ZXh0XCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwiZGVzY3JpcHRpb25cIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJzdGF0ZVwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcInRhcmdldFVybFwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH1cbiAgXVxufTtcbi8vIHByZXR0aWVyLWlnbm9yZVxuKG5vZGUvKjogYW55Ki8pLmhhc2ggPSAnZTcyOTA3NGU0OTRlMDdiNTliNGExNzc0MTZlYjdhM2MnO1xubW9kdWxlLmV4cG9ydHMgPSBub2RlO1xuIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsWUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBLE1BQU1BLElBQUksd0JBQXVCO0VBQy9CLE1BQU0sRUFBRSxVQUFVO0VBQ2xCLE1BQU0sRUFBRSw2QkFBNkI7RUFDckMsTUFBTSxFQUFFLGVBQWU7RUFDdkIsVUFBVSxFQUFFLElBQUk7RUFDaEIscUJBQXFCLEVBQUUsRUFBRTtFQUN6QixZQUFZLEVBQUUsQ0FDWjtJQUNFLE1BQU0sRUFBRSxhQUFhO0lBQ3JCLE9BQU8sRUFBRSxJQUFJO0lBQ2IsTUFBTSxFQUFFLFNBQVM7SUFDakIsTUFBTSxFQUFFLElBQUk7SUFDWixZQUFZLEVBQUU7RUFDaEIsQ0FBQyxFQUNEO0lBQ0UsTUFBTSxFQUFFLGFBQWE7SUFDckIsT0FBTyxFQUFFLElBQUk7SUFDYixNQUFNLEVBQUUsYUFBYTtJQUNyQixNQUFNLEVBQUUsSUFBSTtJQUNaLFlBQVksRUFBRTtFQUNoQixDQUFDLEVBQ0Q7SUFDRSxNQUFNLEVBQUUsYUFBYTtJQUNyQixPQUFPLEVBQUUsSUFBSTtJQUNiLE1BQU0sRUFBRSxPQUFPO0lBQ2YsTUFBTSxFQUFFLElBQUk7SUFDWixZQUFZLEVBQUU7RUFDaEIsQ0FBQyxFQUNEO0lBQ0UsTUFBTSxFQUFFLGFBQWE7SUFDckIsT0FBTyxFQUFFLElBQUk7SUFDYixNQUFNLEVBQUUsV0FBVztJQUNuQixNQUFNLEVBQUUsSUFBSTtJQUNaLFlBQVksRUFBRTtFQUNoQixDQUFDO0FBRUwsQ0FBQztBQUNEO0FBQ0NBLElBQUksV0FBV0MsSUFBSSxHQUFHLGtDQUFrQztBQUN6REMsTUFBTSxDQUFDQyxPQUFPLEdBQUdILElBQUkifQ==