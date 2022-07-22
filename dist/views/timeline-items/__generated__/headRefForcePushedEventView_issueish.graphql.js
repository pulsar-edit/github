/**
 * @flow
 */

/* eslint-disable */
'use strict';
/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type headRefForcePushedEventView_issueish$ref: FragmentReference;
declare export opaque type headRefForcePushedEventView_issueish$fragmentType: headRefForcePushedEventView_issueish$ref;
export type headRefForcePushedEventView_issueish = {|
  +headRefName: string,
  +headRepositoryOwner: ?{|
    +login: string
  |},
  +repository: {|
    +owner: {|
      +login: string
    |}
  |},
  +$refType: headRefForcePushedEventView_issueish$ref,
|};
export type headRefForcePushedEventView_issueish$data = headRefForcePushedEventView_issueish;
export type headRefForcePushedEventView_issueish$key = {
  +$data?: headRefForcePushedEventView_issueish$data,
  +$fragmentRefs: headRefForcePushedEventView_issueish$ref,
};
*/

const node
/*: ReaderFragment*/
= function () {
  var v0 = [{
    "kind": "ScalarField",
    "alias": null,
    "name": "login",
    "args": null,
    "storageKey": null
  }];
  return {
    "kind": "Fragment",
    "name": "headRefForcePushedEventView_issueish",
    "type": "PullRequest",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [{
      "kind": "ScalarField",
      "alias": null,
      "name": "headRefName",
      "args": null,
      "storageKey": null
    }, {
      "kind": "LinkedField",
      "alias": null,
      "name": "headRepositoryOwner",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": false,
      "selections": v0
      /*: any*/

    }, {
      "kind": "LinkedField",
      "alias": null,
      "name": "repository",
      "storageKey": null,
      "args": null,
      "concreteType": "Repository",
      "plural": false,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "owner",
        "storageKey": null,
        "args": null,
        "concreteType": null,
        "plural": false,
        "selections": v0
        /*: any*/

      }]
    }]
  };
}(); // prettier-ignore


node
/*: any*/
.hash = '4c639070afc4a02cedf062d836d0dd7f';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi92aWV3cy90aW1lbGluZS1pdGVtcy9fX2dlbmVyYXRlZF9fL2hlYWRSZWZGb3JjZVB1c2hlZEV2ZW50Vmlld19pc3N1ZWlzaC5ncmFwaHFsLmpzIl0sIm5hbWVzIjpbIm5vZGUiLCJ2MCIsImhhc2giLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0EsTUFBTUE7QUFBSTtBQUFBLEVBQXdCLFlBQVU7QUFDNUMsTUFBSUMsRUFBRSxHQUFHLENBQ1A7QUFDRSxZQUFRLGFBRFY7QUFFRSxhQUFTLElBRlg7QUFHRSxZQUFRLE9BSFY7QUFJRSxZQUFRLElBSlY7QUFLRSxrQkFBYztBQUxoQixHQURPLENBQVQ7QUFTQSxTQUFPO0FBQ0wsWUFBUSxVQURIO0FBRUwsWUFBUSxzQ0FGSDtBQUdMLFlBQVEsYUFISDtBQUlMLGdCQUFZLElBSlA7QUFLTCwyQkFBdUIsRUFMbEI7QUFNTCxrQkFBYyxDQUNaO0FBQ0UsY0FBUSxhQURWO0FBRUUsZUFBUyxJQUZYO0FBR0UsY0FBUSxhQUhWO0FBSUUsY0FBUSxJQUpWO0FBS0Usb0JBQWM7QUFMaEIsS0FEWSxFQVFaO0FBQ0UsY0FBUSxhQURWO0FBRUUsZUFBUyxJQUZYO0FBR0UsY0FBUSxxQkFIVjtBQUlFLG9CQUFjLElBSmhCO0FBS0UsY0FBUSxJQUxWO0FBTUUsc0JBQWdCLElBTmxCO0FBT0UsZ0JBQVUsS0FQWjtBQVFFLG9CQUFlQTtBQUFFOztBQVJuQixLQVJZLEVBa0JaO0FBQ0UsY0FBUSxhQURWO0FBRUUsZUFBUyxJQUZYO0FBR0UsY0FBUSxZQUhWO0FBSUUsb0JBQWMsSUFKaEI7QUFLRSxjQUFRLElBTFY7QUFNRSxzQkFBZ0IsWUFObEI7QUFPRSxnQkFBVSxLQVBaO0FBUUUsb0JBQWMsQ0FDWjtBQUNFLGdCQUFRLGFBRFY7QUFFRSxpQkFBUyxJQUZYO0FBR0UsZ0JBQVEsT0FIVjtBQUlFLHNCQUFjLElBSmhCO0FBS0UsZ0JBQVEsSUFMVjtBQU1FLHdCQUFnQixJQU5sQjtBQU9FLGtCQUFVLEtBUFo7QUFRRSxzQkFBZUE7QUFBRTs7QUFSbkIsT0FEWTtBQVJoQixLQWxCWTtBQU5ULEdBQVA7QUErQ0MsQ0F6RGdDLEVBQWpDLEMsQ0EwREE7OztBQUNDRDtBQUFJO0FBQUwsQ0FBZ0JFLElBQWhCLEdBQXVCLGtDQUF2QjtBQUNBQyxNQUFNLENBQUNDLE9BQVAsR0FBaUJKLElBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmxvd1xuICovXG5cbi8qIGVzbGludC1kaXNhYmxlICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyo6OlxuaW1wb3J0IHR5cGUgeyBSZWFkZXJGcmFnbWVudCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xuaW1wb3J0IHR5cGUgeyBGcmFnbWVudFJlZmVyZW5jZSB9IGZyb20gXCJyZWxheS1ydW50aW1lXCI7XG5kZWNsYXJlIGV4cG9ydCBvcGFxdWUgdHlwZSBoZWFkUmVmRm9yY2VQdXNoZWRFdmVudFZpZXdfaXNzdWVpc2gkcmVmOiBGcmFnbWVudFJlZmVyZW5jZTtcbmRlY2xhcmUgZXhwb3J0IG9wYXF1ZSB0eXBlIGhlYWRSZWZGb3JjZVB1c2hlZEV2ZW50Vmlld19pc3N1ZWlzaCRmcmFnbWVudFR5cGU6IGhlYWRSZWZGb3JjZVB1c2hlZEV2ZW50Vmlld19pc3N1ZWlzaCRyZWY7XG5leHBvcnQgdHlwZSBoZWFkUmVmRm9yY2VQdXNoZWRFdmVudFZpZXdfaXNzdWVpc2ggPSB7fFxuICAraGVhZFJlZk5hbWU6IHN0cmluZyxcbiAgK2hlYWRSZXBvc2l0b3J5T3duZXI6ID97fFxuICAgICtsb2dpbjogc3RyaW5nXG4gIHx9LFxuICArcmVwb3NpdG9yeToge3xcbiAgICArb3duZXI6IHt8XG4gICAgICArbG9naW46IHN0cmluZ1xuICAgIHx9XG4gIHx9LFxuICArJHJlZlR5cGU6IGhlYWRSZWZGb3JjZVB1c2hlZEV2ZW50Vmlld19pc3N1ZWlzaCRyZWYsXG58fTtcbmV4cG9ydCB0eXBlIGhlYWRSZWZGb3JjZVB1c2hlZEV2ZW50Vmlld19pc3N1ZWlzaCRkYXRhID0gaGVhZFJlZkZvcmNlUHVzaGVkRXZlbnRWaWV3X2lzc3VlaXNoO1xuZXhwb3J0IHR5cGUgaGVhZFJlZkZvcmNlUHVzaGVkRXZlbnRWaWV3X2lzc3VlaXNoJGtleSA9IHtcbiAgKyRkYXRhPzogaGVhZFJlZkZvcmNlUHVzaGVkRXZlbnRWaWV3X2lzc3VlaXNoJGRhdGEsXG4gICskZnJhZ21lbnRSZWZzOiBoZWFkUmVmRm9yY2VQdXNoZWRFdmVudFZpZXdfaXNzdWVpc2gkcmVmLFxufTtcbiovXG5cblxuY29uc3Qgbm9kZS8qOiBSZWFkZXJGcmFnbWVudCovID0gKGZ1bmN0aW9uKCl7XG52YXIgdjAgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICBcIm5hbWVcIjogXCJsb2dpblwiLFxuICAgIFwiYXJnc1wiOiBudWxsLFxuICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gIH1cbl07XG5yZXR1cm4ge1xuICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICBcIm5hbWVcIjogXCJoZWFkUmVmRm9yY2VQdXNoZWRFdmVudFZpZXdfaXNzdWVpc2hcIixcbiAgXCJ0eXBlXCI6IFwiUHVsbFJlcXVlc3RcIixcbiAgXCJtZXRhZGF0YVwiOiBudWxsLFxuICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogW10sXG4gIFwic2VsZWN0aW9uc1wiOiBbXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcImhlYWRSZWZOYW1lXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwiaGVhZFJlcG9zaXRvcnlPd25lclwiLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgIFwic2VsZWN0aW9uc1wiOiAodjAvKjogYW55Ki8pXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwicmVwb3NpdG9yeVwiLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUmVwb3NpdG9yeVwiLFxuICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgXCJuYW1lXCI6IFwib3duZXJcIixcbiAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBudWxsLFxuICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiAodjAvKjogYW55Ki8pXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIF1cbn07XG59KSgpO1xuLy8gcHJldHRpZXItaWdub3JlXG4obm9kZS8qOiBhbnkqLykuaGFzaCA9ICc0YzYzOTA3MGFmYzRhMDJjZWRmMDYyZDgzNmQwZGQ3Zic7XG5tb2R1bGUuZXhwb3J0cyA9IG5vZGU7XG4iXX0=