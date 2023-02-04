/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
type crossReferencedEventView_item$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type crossReferencedEventsView_nodes$ref: FragmentReference;
declare export opaque type crossReferencedEventsView_nodes$fragmentType: crossReferencedEventsView_nodes$ref;
export type crossReferencedEventsView_nodes = $ReadOnlyArray<{|
  +id: string,
  +referencedAt: any,
  +isCrossRepository: boolean,
  +actor: ?{|
    +login: string,
    +avatarUrl: any,
  |},
  +source: {|
    +__typename: string,
    +repository?: {|
      +name: string,
      +owner: {|
        +login: string
      |},
    |},
  |},
  +$fragmentRefs: crossReferencedEventView_item$ref,
  +$refType: crossReferencedEventsView_nodes$ref,
|}>;
export type crossReferencedEventsView_nodes$data = crossReferencedEventsView_nodes;
export type crossReferencedEventsView_nodes$key = $ReadOnlyArray<{
  +$data?: crossReferencedEventsView_nodes$data,
  +$fragmentRefs: crossReferencedEventsView_nodes$ref,
}>;
*/
const node /*: ReaderFragment*/ = function () {
  var v0 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "login",
    "args": null,
    "storageKey": null
  };
  return {
    "kind": "Fragment",
    "name": "crossReferencedEventsView_nodes",
    "type": "CrossReferencedEvent",
    "metadata": {
      "plural": true
    },
    "argumentDefinitions": [],
    "selections": [{
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    }, {
      "kind": "ScalarField",
      "alias": null,
      "name": "referencedAt",
      "args": null,
      "storageKey": null
    }, {
      "kind": "ScalarField",
      "alias": null,
      "name": "isCrossRepository",
      "args": null,
      "storageKey": null
    }, {
      "kind": "LinkedField",
      "alias": null,
      "name": "actor",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": false,
      "selections": [v0 /*: any*/, {
        "kind": "ScalarField",
        "alias": null,
        "name": "avatarUrl",
        "args": null,
        "storageKey": null
      }]
    }, {
      "kind": "LinkedField",
      "alias": null,
      "name": "source",
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
        "kind": "LinkedField",
        "alias": null,
        "name": "repository",
        "storageKey": null,
        "args": null,
        "concreteType": "Repository",
        "plural": false,
        "selections": [{
          "kind": "ScalarField",
          "alias": null,
          "name": "name",
          "args": null,
          "storageKey": null
        }, {
          "kind": "LinkedField",
          "alias": null,
          "name": "owner",
          "storageKey": null,
          "args": null,
          "concreteType": null,
          "plural": false,
          "selections": [v0 /*: any*/]
        }]
      }]
    }, {
      "kind": "FragmentSpread",
      "name": "crossReferencedEventView_item",
      "args": null
    }]
  };
}();
// prettier-ignore
node /*: any*/.hash = '5bbb7b39e10559bac4af2d6f9ff7a9e2';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJub2RlIiwidjAiLCJoYXNoIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJzb3VyY2VzIjpbImNyb3NzUmVmZXJlbmNlZEV2ZW50c1ZpZXdfbm9kZXMuZ3JhcGhxbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmbG93XG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKjo6XG5pbXBvcnQgdHlwZSB7IFJlYWRlckZyYWdtZW50IH0gZnJvbSAncmVsYXktcnVudGltZSc7XG50eXBlIGNyb3NzUmVmZXJlbmNlZEV2ZW50Vmlld19pdGVtJHJlZiA9IGFueTtcbmltcG9ydCB0eXBlIHsgRnJhZ21lbnRSZWZlcmVuY2UgfSBmcm9tIFwicmVsYXktcnVudGltZVwiO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgY3Jvc3NSZWZlcmVuY2VkRXZlbnRzVmlld19ub2RlcyRyZWY6IEZyYWdtZW50UmVmZXJlbmNlO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgY3Jvc3NSZWZlcmVuY2VkRXZlbnRzVmlld19ub2RlcyRmcmFnbWVudFR5cGU6IGNyb3NzUmVmZXJlbmNlZEV2ZW50c1ZpZXdfbm9kZXMkcmVmO1xuZXhwb3J0IHR5cGUgY3Jvc3NSZWZlcmVuY2VkRXZlbnRzVmlld19ub2RlcyA9ICRSZWFkT25seUFycmF5PHt8XG4gICtpZDogc3RyaW5nLFxuICArcmVmZXJlbmNlZEF0OiBhbnksXG4gICtpc0Nyb3NzUmVwb3NpdG9yeTogYm9vbGVhbixcbiAgK2FjdG9yOiA/e3xcbiAgICArbG9naW46IHN0cmluZyxcbiAgICArYXZhdGFyVXJsOiBhbnksXG4gIHx9LFxuICArc291cmNlOiB7fFxuICAgICtfX3R5cGVuYW1lOiBzdHJpbmcsXG4gICAgK3JlcG9zaXRvcnk/OiB7fFxuICAgICAgK25hbWU6IHN0cmluZyxcbiAgICAgICtvd25lcjoge3xcbiAgICAgICAgK2xvZ2luOiBzdHJpbmdcbiAgICAgIHx9LFxuICAgIHx9LFxuICB8fSxcbiAgKyRmcmFnbWVudFJlZnM6IGNyb3NzUmVmZXJlbmNlZEV2ZW50Vmlld19pdGVtJHJlZixcbiAgKyRyZWZUeXBlOiBjcm9zc1JlZmVyZW5jZWRFdmVudHNWaWV3X25vZGVzJHJlZixcbnx9PjtcbmV4cG9ydCB0eXBlIGNyb3NzUmVmZXJlbmNlZEV2ZW50c1ZpZXdfbm9kZXMkZGF0YSA9IGNyb3NzUmVmZXJlbmNlZEV2ZW50c1ZpZXdfbm9kZXM7XG5leHBvcnQgdHlwZSBjcm9zc1JlZmVyZW5jZWRFdmVudHNWaWV3X25vZGVzJGtleSA9ICRSZWFkT25seUFycmF5PHtcbiAgKyRkYXRhPzogY3Jvc3NSZWZlcmVuY2VkRXZlbnRzVmlld19ub2RlcyRkYXRhLFxuICArJGZyYWdtZW50UmVmczogY3Jvc3NSZWZlcmVuY2VkRXZlbnRzVmlld19ub2RlcyRyZWYsXG59PjtcbiovXG5cblxuY29uc3Qgbm9kZS8qOiBSZWFkZXJGcmFnbWVudCovID0gKGZ1bmN0aW9uKCl7XG52YXIgdjAgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwibG9naW5cIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59O1xucmV0dXJuIHtcbiAgXCJraW5kXCI6IFwiRnJhZ21lbnRcIixcbiAgXCJuYW1lXCI6IFwiY3Jvc3NSZWZlcmVuY2VkRXZlbnRzVmlld19ub2Rlc1wiLFxuICBcInR5cGVcIjogXCJDcm9zc1JlZmVyZW5jZWRFdmVudFwiLFxuICBcIm1ldGFkYXRhXCI6IHtcbiAgICBcInBsdXJhbFwiOiB0cnVlXG4gIH0sXG4gIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiBbXSxcbiAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwiaWRcIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJyZWZlcmVuY2VkQXRcIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJpc0Nyb3NzUmVwb3NpdG9yeVwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcImFjdG9yXCIsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgKHYwLyo6IGFueSovKSxcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgIFwibmFtZVwiOiBcImF2YXRhclVybFwiLFxuICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJzb3VyY2VcIixcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcImNvbmNyZXRlVHlwZVwiOiBudWxsLFxuICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgXCJuYW1lXCI6IFwiX190eXBlbmFtZVwiLFxuICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICBcIm5hbWVcIjogXCJyZXBvc2l0b3J5XCIsXG4gICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJSZXBvc2l0b3J5XCIsXG4gICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJuYW1lXCIsXG4gICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJvd25lclwiLFxuICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICh2MC8qOiBhbnkqLylcbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiRnJhZ21lbnRTcHJlYWRcIixcbiAgICAgIFwibmFtZVwiOiBcImNyb3NzUmVmZXJlbmNlZEV2ZW50Vmlld19pdGVtXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbFxuICAgIH1cbiAgXVxufTtcbn0pKCk7XG4vLyBwcmV0dGllci1pZ25vcmVcbihub2RlLyo6IGFueSovKS5oYXNoID0gJzViYmI3YjM5ZTEwNTU5YmFjNGFmMmQ2ZjlmZjdhOWUyJztcbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOztBQUVBOztBQUVBLFlBQVk7O0FBRVo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBLE1BQU1BLElBQUksd0JBQXdCLFlBQVU7RUFDNUMsSUFBSUMsRUFBRSxHQUFHO0lBQ1AsTUFBTSxFQUFFLGFBQWE7SUFDckIsT0FBTyxFQUFFLElBQUk7SUFDYixNQUFNLEVBQUUsT0FBTztJQUNmLE1B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