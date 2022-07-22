/**
 * @flow
 */

/* eslint-disable */
'use strict';
/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type prCheckoutController_repository$ref: FragmentReference;
declare export opaque type prCheckoutController_repository$fragmentType: prCheckoutController_repository$ref;
export type prCheckoutController_repository = {|
  +name: string,
  +owner: {|
    +login: string
  |},
  +$refType: prCheckoutController_repository$ref,
|};
export type prCheckoutController_repository$data = prCheckoutController_repository;
export type prCheckoutController_repository$key = {
  +$data?: prCheckoutController_repository$data,
  +$fragmentRefs: prCheckoutController_repository$ref,
};
*/

const node
/*: ReaderFragment*/
= {
  "kind": "Fragment",
  "name": "prCheckoutController_repository",
  "type": "Repository",
  "metadata": null,
  "argumentDefinitions": [],
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
    "selections": [{
      "kind": "ScalarField",
      "alias": null,
      "name": "login",
      "args": null,
      "storageKey": null
    }]
  }]
}; // prettier-ignore

node
/*: any*/
.hash = 'b2212745240c03ff8fc7cb13dfc63183';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9jb250cm9sbGVycy9fX2dlbmVyYXRlZF9fL3ByQ2hlY2tvdXRDb250cm9sbGVyX3JlcG9zaXRvcnkuZ3JhcGhxbC5qcyJdLCJuYW1lcyI6WyJub2RlIiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUdBLE1BQU1BO0FBQUk7QUFBQSxFQUF1QjtBQUMvQixVQUFRLFVBRHVCO0FBRS9CLFVBQVEsaUNBRnVCO0FBRy9CLFVBQVEsWUFIdUI7QUFJL0IsY0FBWSxJQUptQjtBQUsvQix5QkFBdUIsRUFMUTtBQU0vQixnQkFBYyxDQUNaO0FBQ0UsWUFBUSxhQURWO0FBRUUsYUFBUyxJQUZYO0FBR0UsWUFBUSxNQUhWO0FBSUUsWUFBUSxJQUpWO0FBS0Usa0JBQWM7QUFMaEIsR0FEWSxFQVFaO0FBQ0UsWUFBUSxhQURWO0FBRUUsYUFBUyxJQUZYO0FBR0UsWUFBUSxPQUhWO0FBSUUsa0JBQWMsSUFKaEI7QUFLRSxZQUFRLElBTFY7QUFNRSxvQkFBZ0IsSUFObEI7QUFPRSxjQUFVLEtBUFo7QUFRRSxrQkFBYyxDQUNaO0FBQ0UsY0FBUSxhQURWO0FBRUUsZUFBUyxJQUZYO0FBR0UsY0FBUSxPQUhWO0FBSUUsY0FBUSxJQUpWO0FBS0Usb0JBQWM7QUFMaEIsS0FEWTtBQVJoQixHQVJZO0FBTmlCLENBQWpDLEMsQ0FrQ0E7O0FBQ0NBO0FBQUk7QUFBTCxDQUFnQkMsSUFBaEIsR0FBdUIsa0NBQXZCO0FBQ0FDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQkgsSUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmbG93XG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKjo6XG5pbXBvcnQgdHlwZSB7IFJlYWRlckZyYWdtZW50IH0gZnJvbSAncmVsYXktcnVudGltZSc7XG5pbXBvcnQgdHlwZSB7IEZyYWdtZW50UmVmZXJlbmNlIH0gZnJvbSBcInJlbGF5LXJ1bnRpbWVcIjtcbmRlY2xhcmUgZXhwb3J0IG9wYXF1ZSB0eXBlIHByQ2hlY2tvdXRDb250cm9sbGVyX3JlcG9zaXRvcnkkcmVmOiBGcmFnbWVudFJlZmVyZW5jZTtcbmRlY2xhcmUgZXhwb3J0IG9wYXF1ZSB0eXBlIHByQ2hlY2tvdXRDb250cm9sbGVyX3JlcG9zaXRvcnkkZnJhZ21lbnRUeXBlOiBwckNoZWNrb3V0Q29udHJvbGxlcl9yZXBvc2l0b3J5JHJlZjtcbmV4cG9ydCB0eXBlIHByQ2hlY2tvdXRDb250cm9sbGVyX3JlcG9zaXRvcnkgPSB7fFxuICArbmFtZTogc3RyaW5nLFxuICArb3duZXI6IHt8XG4gICAgK2xvZ2luOiBzdHJpbmdcbiAgfH0sXG4gICskcmVmVHlwZTogcHJDaGVja291dENvbnRyb2xsZXJfcmVwb3NpdG9yeSRyZWYsXG58fTtcbmV4cG9ydCB0eXBlIHByQ2hlY2tvdXRDb250cm9sbGVyX3JlcG9zaXRvcnkkZGF0YSA9IHByQ2hlY2tvdXRDb250cm9sbGVyX3JlcG9zaXRvcnk7XG5leHBvcnQgdHlwZSBwckNoZWNrb3V0Q29udHJvbGxlcl9yZXBvc2l0b3J5JGtleSA9IHtcbiAgKyRkYXRhPzogcHJDaGVja291dENvbnRyb2xsZXJfcmVwb3NpdG9yeSRkYXRhLFxuICArJGZyYWdtZW50UmVmczogcHJDaGVja291dENvbnRyb2xsZXJfcmVwb3NpdG9yeSRyZWYsXG59O1xuKi9cblxuXG5jb25zdCBub2RlLyo6IFJlYWRlckZyYWdtZW50Ki8gPSB7XG4gIFwia2luZFwiOiBcIkZyYWdtZW50XCIsXG4gIFwibmFtZVwiOiBcInByQ2hlY2tvdXRDb250cm9sbGVyX3JlcG9zaXRvcnlcIixcbiAgXCJ0eXBlXCI6IFwiUmVwb3NpdG9yeVwiLFxuICBcIm1ldGFkYXRhXCI6IG51bGwsXG4gIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiBbXSxcbiAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwibmFtZVwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcIm93bmVyXCIsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgIFwibmFtZVwiOiBcImxvZ2luXCIsXG4gICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgXVxufTtcbi8vIHByZXR0aWVyLWlnbm9yZVxuKG5vZGUvKjogYW55Ki8pLmhhc2ggPSAnYjIyMTI3NDUyNDBjMDNmZjhmYzdjYjEzZGZjNjMxODMnO1xubW9kdWxlLmV4cG9ydHMgPSBub2RlO1xuIl19