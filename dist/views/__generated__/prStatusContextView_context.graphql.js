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

const node
/*: ReaderFragment*/
= {
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
}; // prettier-ignore

node
/*: any*/
.hash = 'e729074e494e07b59b4a177416eb7a3c';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi92aWV3cy9fX2dlbmVyYXRlZF9fL3ByU3RhdHVzQ29udGV4dFZpZXdfY29udGV4dC5ncmFwaHFsLmpzIl0sIm5hbWVzIjpbIm5vZGUiLCJoYXNoIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOztBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQSxNQUFNQTtBQUFJO0FBQUEsRUFBdUI7QUFDL0IsVUFBUSxVQUR1QjtBQUUvQixVQUFRLDZCQUZ1QjtBQUcvQixVQUFRLGVBSHVCO0FBSS9CLGNBQVksSUFKbUI7QUFLL0IseUJBQXVCLEVBTFE7QUFNL0IsZ0JBQWMsQ0FDWjtBQUNFLFlBQVEsYUFEVjtBQUVFLGFBQVMsSUFGWDtBQUdFLFlBQVEsU0FIVjtBQUlFLFlBQVEsSUFKVjtBQUtFLGtCQUFjO0FBTGhCLEdBRFksRUFRWjtBQUNFLFlBQVEsYUFEVjtBQUVFLGFBQVMsSUFGWDtBQUdFLFlBQVEsYUFIVjtBQUlFLFlBQVEsSUFKVjtBQUtFLGtCQUFjO0FBTGhCLEdBUlksRUFlWjtBQUNFLFlBQVEsYUFEVjtBQUVFLGFBQVMsSUFGWDtBQUdFLFlBQVEsT0FIVjtBQUlFLFlBQVEsSUFKVjtBQUtFLGtCQUFjO0FBTGhCLEdBZlksRUFzQlo7QUFDRSxZQUFRLGFBRFY7QUFFRSxhQUFTLElBRlg7QUFHRSxZQUFRLFdBSFY7QUFJRSxZQUFRLElBSlY7QUFLRSxrQkFBYztBQUxoQixHQXRCWTtBQU5pQixDQUFqQyxDLENBcUNBOztBQUNDQTtBQUFJO0FBQUwsQ0FBZ0JDLElBQWhCLEdBQXVCLGtDQUF2QjtBQUNBQyxNQUFNLENBQUNDLE9BQVAsR0FBaUJILElBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmxvd1xuICovXG5cbi8qIGVzbGludC1kaXNhYmxlICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyo6OlxuaW1wb3J0IHR5cGUgeyBSZWFkZXJGcmFnbWVudCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xuZXhwb3J0IHR5cGUgU3RhdHVzU3RhdGUgPSBcIkVSUk9SXCIgfCBcIkVYUEVDVEVEXCIgfCBcIkZBSUxVUkVcIiB8IFwiUEVORElOR1wiIHwgXCJTVUNDRVNTXCIgfCBcIiVmdXR1cmUgYWRkZWQgdmFsdWVcIjtcbmltcG9ydCB0eXBlIHsgRnJhZ21lbnRSZWZlcmVuY2UgfSBmcm9tIFwicmVsYXktcnVudGltZVwiO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgcHJTdGF0dXNDb250ZXh0Vmlld19jb250ZXh0JHJlZjogRnJhZ21lbnRSZWZlcmVuY2U7XG5kZWNsYXJlIGV4cG9ydCBvcGFxdWUgdHlwZSBwclN0YXR1c0NvbnRleHRWaWV3X2NvbnRleHQkZnJhZ21lbnRUeXBlOiBwclN0YXR1c0NvbnRleHRWaWV3X2NvbnRleHQkcmVmO1xuZXhwb3J0IHR5cGUgcHJTdGF0dXNDb250ZXh0Vmlld19jb250ZXh0ID0ge3xcbiAgK2NvbnRleHQ6IHN0cmluZyxcbiAgK2Rlc2NyaXB0aW9uOiA/c3RyaW5nLFxuICArc3RhdGU6IFN0YXR1c1N0YXRlLFxuICArdGFyZ2V0VXJsOiA/YW55LFxuICArJHJlZlR5cGU6IHByU3RhdHVzQ29udGV4dFZpZXdfY29udGV4dCRyZWYsXG58fTtcbmV4cG9ydCB0eXBlIHByU3RhdHVzQ29udGV4dFZpZXdfY29udGV4dCRkYXRhID0gcHJTdGF0dXNDb250ZXh0Vmlld19jb250ZXh0O1xuZXhwb3J0IHR5cGUgcHJTdGF0dXNDb250ZXh0Vmlld19jb250ZXh0JGtleSA9IHtcbiAgKyRkYXRhPzogcHJTdGF0dXNDb250ZXh0Vmlld19jb250ZXh0JGRhdGEsXG4gICskZnJhZ21lbnRSZWZzOiBwclN0YXR1c0NvbnRleHRWaWV3X2NvbnRleHQkcmVmLFxufTtcbiovXG5cblxuY29uc3Qgbm9kZS8qOiBSZWFkZXJGcmFnbWVudCovID0ge1xuICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICBcIm5hbWVcIjogXCJwclN0YXR1c0NvbnRleHRWaWV3X2NvbnRleHRcIixcbiAgXCJ0eXBlXCI6IFwiU3RhdHVzQ29udGV4dFwiLFxuICBcIm1ldGFkYXRhXCI6IG51bGwsXG4gIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiBbXSxcbiAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwiY29udGV4dFwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcImRlc2NyaXB0aW9uXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwic3RhdGVcIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJ0YXJnZXRVcmxcIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9XG4gIF1cbn07XG4vLyBwcmV0dGllci1pZ25vcmVcbihub2RlLyo6IGFueSovKS5oYXNoID0gJ2U3MjkwNzRlNDk0ZTA3YjU5YjRhMTc3NDE2ZWI3YTNjJztcbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcbiJdfQ==