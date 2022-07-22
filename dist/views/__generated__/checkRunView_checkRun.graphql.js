/**
 * @flow
 */

/* eslint-disable */
'use strict';
/*::
import type { ReaderFragment } from 'relay-runtime';
export type CheckConclusionState = "ACTION_REQUIRED" | "CANCELLED" | "FAILURE" | "NEUTRAL" | "SKIPPED" | "STALE" | "STARTUP_FAILURE" | "SUCCESS" | "TIMED_OUT" | "%future added value";
export type CheckStatusState = "COMPLETED" | "IN_PROGRESS" | "QUEUED" | "REQUESTED" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type checkRunView_checkRun$ref: FragmentReference;
declare export opaque type checkRunView_checkRun$fragmentType: checkRunView_checkRun$ref;
export type checkRunView_checkRun = {|
  +name: string,
  +status: CheckStatusState,
  +conclusion: ?CheckConclusionState,
  +title: ?string,
  +summary: ?string,
  +permalink: any,
  +detailsUrl: ?any,
  +$refType: checkRunView_checkRun$ref,
|};
export type checkRunView_checkRun$data = checkRunView_checkRun;
export type checkRunView_checkRun$key = {
  +$data?: checkRunView_checkRun$data,
  +$fragmentRefs: checkRunView_checkRun$ref,
};
*/

const node
/*: ReaderFragment*/
= {
  "kind": "Fragment",
  "name": "checkRunView_checkRun",
  "type": "CheckRun",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [{
    "kind": "ScalarField",
    "alias": null,
    "name": "name",
    "args": null,
    "storageKey": null
  }, {
    "kind": "ScalarField",
    "alias": null,
    "name": "status",
    "args": null,
    "storageKey": null
  }, {
    "kind": "ScalarField",
    "alias": null,
    "name": "conclusion",
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
    "name": "summary",
    "args": null,
    "storageKey": null
  }, {
    "kind": "ScalarField",
    "alias": null,
    "name": "permalink",
    "args": null,
    "storageKey": null
  }, {
    "kind": "ScalarField",
    "alias": null,
    "name": "detailsUrl",
    "args": null,
    "storageKey": null
  }]
}; // prettier-ignore

node
/*: any*/
.hash = '7135f882a3513e65b0a52393a0cc8b40';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi92aWV3cy9fX2dlbmVyYXRlZF9fL2NoZWNrUnVuVmlld19jaGVja1J1bi5ncmFwaHFsLmpzIl0sIm5hbWVzIjpbIm5vZGUiLCJoYXNoIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOztBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUdBLE1BQU1BO0FBQUk7QUFBQSxFQUF1QjtBQUMvQixVQUFRLFVBRHVCO0FBRS9CLFVBQVEsdUJBRnVCO0FBRy9CLFVBQVEsVUFIdUI7QUFJL0IsY0FBWSxJQUptQjtBQUsvQix5QkFBdUIsRUFMUTtBQU0vQixnQkFBYyxDQUNaO0FBQ0UsWUFBUSxhQURWO0FBRUUsYUFBUyxJQUZYO0FBR0UsWUFBUSxNQUhWO0FBSUUsWUFBUSxJQUpWO0FBS0Usa0JBQWM7QUFMaEIsR0FEWSxFQVFaO0FBQ0UsWUFBUSxhQURWO0FBRUUsYUFBUyxJQUZYO0FBR0UsWUFBUSxRQUhWO0FBSUUsWUFBUSxJQUpWO0FBS0Usa0JBQWM7QUFMaEIsR0FSWSxFQWVaO0FBQ0UsWUFBUSxhQURWO0FBRUUsYUFBUyxJQUZYO0FBR0UsWUFBUSxZQUhWO0FBSUUsWUFBUSxJQUpWO0FBS0Usa0JBQWM7QUFMaEIsR0FmWSxFQXNCWjtBQUNFLFlBQVEsYUFEVjtBQUVFLGFBQVMsSUFGWDtBQUdFLFlBQVEsT0FIVjtBQUlFLFlBQVEsSUFKVjtBQUtFLGtCQUFjO0FBTGhCLEdBdEJZLEVBNkJaO0FBQ0UsWUFBUSxhQURWO0FBRUUsYUFBUyxJQUZYO0FBR0UsWUFBUSxTQUhWO0FBSUUsWUFBUSxJQUpWO0FBS0Usa0JBQWM7QUFMaEIsR0E3QlksRUFvQ1o7QUFDRSxZQUFRLGFBRFY7QUFFRSxhQUFTLElBRlg7QUFHRSxZQUFRLFdBSFY7QUFJRSxZQUFRLElBSlY7QUFLRSxrQkFBYztBQUxoQixHQXBDWSxFQTJDWjtBQUNFLFlBQVEsYUFEVjtBQUVFLGFBQVMsSUFGWDtBQUdFLFlBQVEsWUFIVjtBQUlFLFlBQVEsSUFKVjtBQUtFLGtCQUFjO0FBTGhCLEdBM0NZO0FBTmlCLENBQWpDLEMsQ0EwREE7O0FBQ0NBO0FBQUk7QUFBTCxDQUFnQkMsSUFBaEIsR0FBdUIsa0NBQXZCO0FBQ0FDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQkgsSUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmbG93XG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKjo6XG5pbXBvcnQgdHlwZSB7IFJlYWRlckZyYWdtZW50IH0gZnJvbSAncmVsYXktcnVudGltZSc7XG5leHBvcnQgdHlwZSBDaGVja0NvbmNsdXNpb25TdGF0ZSA9IFwiQUNUSU9OX1JFUVVJUkVEXCIgfCBcIkNBTkNFTExFRFwiIHwgXCJGQUlMVVJFXCIgfCBcIk5FVVRSQUxcIiB8IFwiU0tJUFBFRFwiIHwgXCJTVEFMRVwiIHwgXCJTVEFSVFVQX0ZBSUxVUkVcIiB8IFwiU1VDQ0VTU1wiIHwgXCJUSU1FRF9PVVRcIiB8IFwiJWZ1dHVyZSBhZGRlZCB2YWx1ZVwiO1xuZXhwb3J0IHR5cGUgQ2hlY2tTdGF0dXNTdGF0ZSA9IFwiQ09NUExFVEVEXCIgfCBcIklOX1BST0dSRVNTXCIgfCBcIlFVRVVFRFwiIHwgXCJSRVFVRVNURURcIiB8IFwiJWZ1dHVyZSBhZGRlZCB2YWx1ZVwiO1xuaW1wb3J0IHR5cGUgeyBGcmFnbWVudFJlZmVyZW5jZSB9IGZyb20gXCJyZWxheS1ydW50aW1lXCI7XG5kZWNsYXJlIGV4cG9ydCBvcGFxdWUgdHlwZSBjaGVja1J1blZpZXdfY2hlY2tSdW4kcmVmOiBGcmFnbWVudFJlZmVyZW5jZTtcbmRlY2xhcmUgZXhwb3J0IG9wYXF1ZSB0eXBlIGNoZWNrUnVuVmlld19jaGVja1J1biRmcmFnbWVudFR5cGU6IGNoZWNrUnVuVmlld19jaGVja1J1biRyZWY7XG5leHBvcnQgdHlwZSBjaGVja1J1blZpZXdfY2hlY2tSdW4gPSB7fFxuICArbmFtZTogc3RyaW5nLFxuICArc3RhdHVzOiBDaGVja1N0YXR1c1N0YXRlLFxuICArY29uY2x1c2lvbjogP0NoZWNrQ29uY2x1c2lvblN0YXRlLFxuICArdGl0bGU6ID9zdHJpbmcsXG4gICtzdW1tYXJ5OiA/c3RyaW5nLFxuICArcGVybWFsaW5rOiBhbnksXG4gICtkZXRhaWxzVXJsOiA/YW55LFxuICArJHJlZlR5cGU6IGNoZWNrUnVuVmlld19jaGVja1J1biRyZWYsXG58fTtcbmV4cG9ydCB0eXBlIGNoZWNrUnVuVmlld19jaGVja1J1biRkYXRhID0gY2hlY2tSdW5WaWV3X2NoZWNrUnVuO1xuZXhwb3J0IHR5cGUgY2hlY2tSdW5WaWV3X2NoZWNrUnVuJGtleSA9IHtcbiAgKyRkYXRhPzogY2hlY2tSdW5WaWV3X2NoZWNrUnVuJGRhdGEsXG4gICskZnJhZ21lbnRSZWZzOiBjaGVja1J1blZpZXdfY2hlY2tSdW4kcmVmLFxufTtcbiovXG5cblxuY29uc3Qgbm9kZS8qOiBSZWFkZXJGcmFnbWVudCovID0ge1xuICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICBcIm5hbWVcIjogXCJjaGVja1J1blZpZXdfY2hlY2tSdW5cIixcbiAgXCJ0eXBlXCI6IFwiQ2hlY2tSdW5cIixcbiAgXCJtZXRhZGF0YVwiOiBudWxsLFxuICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogW10sXG4gIFwic2VsZWN0aW9uc1wiOiBbXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcIm5hbWVcIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJzdGF0dXNcIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJjb25jbHVzaW9uXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwidGl0bGVcIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJzdW1tYXJ5XCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwicGVybWFsaW5rXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwiZGV0YWlsc1VybFwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH1cbiAgXVxufTtcbi8vIHByZXR0aWVyLWlnbm9yZVxuKG5vZGUvKjogYW55Ki8pLmhhc2ggPSAnNzEzNWY4ODJhMzUxM2U2NWIwYTUyMzkzYTBjYzhiNDAnO1xubW9kdWxlLmV4cG9ydHMgPSBub2RlO1xuIl19