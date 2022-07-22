/**
 * @flow
 */

/* eslint-disable */
'use strict';
/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type headRefForcePushedEventView_item$ref: FragmentReference;
declare export opaque type headRefForcePushedEventView_item$fragmentType: headRefForcePushedEventView_item$ref;
export type headRefForcePushedEventView_item = {|
  +actor: ?{|
    +avatarUrl: any,
    +login: string,
  |},
  +beforeCommit: ?{|
    +oid: any
  |},
  +afterCommit: ?{|
    +oid: any
  |},
  +createdAt: any,
  +$refType: headRefForcePushedEventView_item$ref,
|};
export type headRefForcePushedEventView_item$data = headRefForcePushedEventView_item;
export type headRefForcePushedEventView_item$key = {
  +$data?: headRefForcePushedEventView_item$data,
  +$fragmentRefs: headRefForcePushedEventView_item$ref,
};
*/

const node
/*: ReaderFragment*/
= function () {
  var v0 = [{
    "kind": "ScalarField",
    "alias": null,
    "name": "oid",
    "args": null,
    "storageKey": null
  }];
  return {
    "kind": "Fragment",
    "name": "headRefForcePushedEventView_item",
    "type": "HeadRefForcePushedEvent",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [{
      "kind": "LinkedField",
      "alias": null,
      "name": "actor",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": false,
      "selections": [{
        "kind": "ScalarField",
        "alias": null,
        "name": "avatarUrl",
        "args": null,
        "storageKey": null
      }, {
        "kind": "ScalarField",
        "alias": null,
        "name": "login",
        "args": null,
        "storageKey": null
      }]
    }, {
      "kind": "LinkedField",
      "alias": null,
      "name": "beforeCommit",
      "storageKey": null,
      "args": null,
      "concreteType": "Commit",
      "plural": false,
      "selections": v0
      /*: any*/

    }, {
      "kind": "LinkedField",
      "alias": null,
      "name": "afterCommit",
      "storageKey": null,
      "args": null,
      "concreteType": "Commit",
      "plural": false,
      "selections": v0
      /*: any*/

    }, {
      "kind": "ScalarField",
      "alias": null,
      "name": "createdAt",
      "args": null,
      "storageKey": null
    }]
  };
}(); // prettier-ignore


node
/*: any*/
.hash = 'fc403545674c57c1997c870805101ffb';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi92aWV3cy90aW1lbGluZS1pdGVtcy9fX2dlbmVyYXRlZF9fL2hlYWRSZWZGb3JjZVB1c2hlZEV2ZW50Vmlld19pdGVtLmdyYXBocWwuanMiXSwibmFtZXMiOlsibm9kZSIsInYwIiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0EsTUFBTUE7QUFBSTtBQUFBLEVBQXdCLFlBQVU7QUFDNUMsTUFBSUMsRUFBRSxHQUFHLENBQ1A7QUFDRSxZQUFRLGFBRFY7QUFFRSxhQUFTLElBRlg7QUFHRSxZQUFRLEtBSFY7QUFJRSxZQUFRLElBSlY7QUFLRSxrQkFBYztBQUxoQixHQURPLENBQVQ7QUFTQSxTQUFPO0FBQ0wsWUFBUSxVQURIO0FBRUwsWUFBUSxrQ0FGSDtBQUdMLFlBQVEseUJBSEg7QUFJTCxnQkFBWSxJQUpQO0FBS0wsMkJBQXVCLEVBTGxCO0FBTUwsa0JBQWMsQ0FDWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsSUFGWDtBQUdFLGNBQVEsT0FIVjtBQUlFLG9CQUFjLElBSmhCO0FBS0UsY0FBUSxJQUxWO0FBTUUsc0JBQWdCLElBTmxCO0FBT0UsZ0JBQVUsS0FQWjtBQVFFLG9CQUFjLENBQ1o7QUFDRSxnQkFBUSxhQURWO0FBRUUsaUJBQVMsSUFGWDtBQUdFLGdCQUFRLFdBSFY7QUFJRSxnQkFBUSxJQUpWO0FBS0Usc0JBQWM7QUFMaEIsT0FEWSxFQVFaO0FBQ0UsZ0JBQVEsYUFEVjtBQUVFLGlCQUFTLElBRlg7QUFHRSxnQkFBUSxPQUhWO0FBSUUsZ0JBQVEsSUFKVjtBQUtFLHNCQUFjO0FBTGhCLE9BUlk7QUFSaEIsS0FEWSxFQTBCWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsSUFGWDtBQUdFLGNBQVEsY0FIVjtBQUlFLG9CQUFjLElBSmhCO0FBS0UsY0FBUSxJQUxWO0FBTUUsc0JBQWdCLFFBTmxCO0FBT0UsZ0JBQVUsS0FQWjtBQVFFLG9CQUFlQTtBQUFFOztBQVJuQixLQTFCWSxFQW9DWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsSUFGWDtBQUdFLGNBQVEsYUFIVjtBQUlFLG9CQUFjLElBSmhCO0FBS0UsY0FBUSxJQUxWO0FBTUUsc0JBQWdCLFFBTmxCO0FBT0UsZ0JBQVUsS0FQWjtBQVFFLG9CQUFlQTtBQUFFOztBQVJuQixLQXBDWSxFQThDWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsSUFGWDtBQUdFLGNBQVEsV0FIVjtBQUlFLGNBQVEsSUFKVjtBQUtFLG9CQUFjO0FBTGhCLEtBOUNZO0FBTlQsR0FBUDtBQTZEQyxDQXZFZ0MsRUFBakMsQyxDQXdFQTs7O0FBQ0NEO0FBQUk7QUFBTCxDQUFnQkUsSUFBaEIsR0FBdUIsa0NBQXZCO0FBQ0FDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQkosSUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmbG93XG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKjo6XG5pbXBvcnQgdHlwZSB7IFJlYWRlckZyYWdtZW50IH0gZnJvbSAncmVsYXktcnVudGltZSc7XG5pbXBvcnQgdHlwZSB7IEZyYWdtZW50UmVmZXJlbmNlIH0gZnJvbSBcInJlbGF5LXJ1bnRpbWVcIjtcbmRlY2xhcmUgZXhwb3J0IG9wYXF1ZSB0eXBlIGhlYWRSZWZGb3JjZVB1c2hlZEV2ZW50Vmlld19pdGVtJHJlZjogRnJhZ21lbnRSZWZlcmVuY2U7XG5kZWNsYXJlIGV4cG9ydCBvcGFxdWUgdHlwZSBoZWFkUmVmRm9yY2VQdXNoZWRFdmVudFZpZXdfaXRlbSRmcmFnbWVudFR5cGU6IGhlYWRSZWZGb3JjZVB1c2hlZEV2ZW50Vmlld19pdGVtJHJlZjtcbmV4cG9ydCB0eXBlIGhlYWRSZWZGb3JjZVB1c2hlZEV2ZW50Vmlld19pdGVtID0ge3xcbiAgK2FjdG9yOiA/e3xcbiAgICArYXZhdGFyVXJsOiBhbnksXG4gICAgK2xvZ2luOiBzdHJpbmcsXG4gIHx9LFxuICArYmVmb3JlQ29tbWl0OiA/e3xcbiAgICArb2lkOiBhbnlcbiAgfH0sXG4gICthZnRlckNvbW1pdDogP3t8XG4gICAgK29pZDogYW55XG4gIHx9LFxuICArY3JlYXRlZEF0OiBhbnksXG4gICskcmVmVHlwZTogaGVhZFJlZkZvcmNlUHVzaGVkRXZlbnRWaWV3X2l0ZW0kcmVmLFxufH07XG5leHBvcnQgdHlwZSBoZWFkUmVmRm9yY2VQdXNoZWRFdmVudFZpZXdfaXRlbSRkYXRhID0gaGVhZFJlZkZvcmNlUHVzaGVkRXZlbnRWaWV3X2l0ZW07XG5leHBvcnQgdHlwZSBoZWFkUmVmRm9yY2VQdXNoZWRFdmVudFZpZXdfaXRlbSRrZXkgPSB7XG4gICskZGF0YT86IGhlYWRSZWZGb3JjZVB1c2hlZEV2ZW50Vmlld19pdGVtJGRhdGEsXG4gICskZnJhZ21lbnRSZWZzOiBoZWFkUmVmRm9yY2VQdXNoZWRFdmVudFZpZXdfaXRlbSRyZWYsXG59O1xuKi9cblxuXG5jb25zdCBub2RlLyo6IFJlYWRlckZyYWdtZW50Ki8gPSAoZnVuY3Rpb24oKXtcbnZhciB2MCA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgXCJhbGlhc1wiOiBudWxsLFxuICAgIFwibmFtZVwiOiBcIm9pZFwiLFxuICAgIFwiYXJnc1wiOiBudWxsLFxuICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gIH1cbl07XG5yZXR1cm4ge1xuICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICBcIm5hbWVcIjogXCJoZWFkUmVmRm9yY2VQdXNoZWRFdmVudFZpZXdfaXRlbVwiLFxuICBcInR5cGVcIjogXCJIZWFkUmVmRm9yY2VQdXNoZWRFdmVudFwiLFxuICBcIm1ldGFkYXRhXCI6IG51bGwsXG4gIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiBbXSxcbiAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwiYWN0b3JcIixcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcImNvbmNyZXRlVHlwZVwiOiBudWxsLFxuICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgXCJuYW1lXCI6IFwiYXZhdGFyVXJsXCIsXG4gICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgIFwibmFtZVwiOiBcImxvZ2luXCIsXG4gICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcImJlZm9yZUNvbW1pdFwiLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiQ29tbWl0XCIsXG4gICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgIFwic2VsZWN0aW9uc1wiOiAodjAvKjogYW55Ki8pXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwiYWZ0ZXJDb21taXRcIixcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIkNvbW1pdFwiLFxuICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICBcInNlbGVjdGlvbnNcIjogKHYwLyo6IGFueSovKVxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcImNyZWF0ZWRBdFwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH1cbiAgXVxufTtcbn0pKCk7XG4vLyBwcmV0dGllci1pZ25vcmVcbihub2RlLyo6IGFueSovKS5oYXNoID0gJ2ZjNDAzNTQ1Njc0YzU3YzE5OTdjODcwODA1MTAxZmZiJztcbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcbiJdfQ==