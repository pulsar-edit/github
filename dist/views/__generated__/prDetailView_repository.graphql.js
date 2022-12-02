/**
 * @flow
 */

/* eslint-disable */
'use strict';
/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type prDetailView_repository$ref: FragmentReference;
declare export opaque type prDetailView_repository$fragmentType: prDetailView_repository$ref;
export type prDetailView_repository = {|
  +id: string,
  +name: string,
  +owner: {|
    +login: string
  |},
  +$refType: prDetailView_repository$ref,
|};
export type prDetailView_repository$data = prDetailView_repository;
export type prDetailView_repository$key = {
  +$data?: prDetailView_repository$data,
  +$fragmentRefs: prDetailView_repository$ref,
};
*/

const node
/*: ReaderFragment*/
= {
  "kind": "Fragment",
  "name": "prDetailView_repository",
  "type": "Repository",
  "metadata": null,
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
.hash = '3f3d61ddd6afa1c9e0811c3b5be51bb0';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi92aWV3cy9fX2dlbmVyYXRlZF9fL3ByRGV0YWlsVmlld19yZXBvc2l0b3J5LmdyYXBocWwuanMiXSwibmFtZXMiOlsibm9kZSIsImhhc2giLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUdBLE1BQU1BO0FBQUk7QUFBQSxFQUF1QjtBQUMvQixVQUFRLFVBRHVCO0FBRS9CLFVBQVEseUJBRnVCO0FBRy9CLFVBQVEsWUFIdUI7QUFJL0IsY0FBWSxJQUptQjtBQUsvQix5QkFBdUIsRUFMUTtBQU0vQixnQkFBYyxDQUNaO0FBQ0UsWUFBUSxhQURWO0FBRUUsYUFBUyxJQUZYO0FBR0UsWUFBUSxJQUhWO0FBSUUsWUFBUSxJQUpWO0FBS0Usa0JBQWM7QUFMaEIsR0FEWSxFQVFaO0FBQ0UsWUFBUSxhQURWO0FBRUUsYUFBUyxJQUZYO0FBR0UsWUFBUSxNQUhWO0FBSUUsWUFBUSxJQUpWO0FBS0Usa0JBQWM7QUFMaEIsR0FSWSxFQWVaO0FBQ0UsWUFBUSxhQURWO0FBRUUsYUFBUyxJQUZYO0FBR0UsWUFBUSxPQUhWO0FBSUUsa0JBQWMsSUFKaEI7QUFLRSxZQUFRLElBTFY7QUFNRSxvQkFBZ0IsSUFObEI7QUFPRSxjQUFVLEtBUFo7QUFRRSxrQkFBYyxDQUNaO0FBQ0UsY0FBUSxhQURWO0FBRUUsZUFBUyxJQUZYO0FBR0UsY0FBUSxPQUhWO0FBSUUsY0FBUSxJQUpWO0FBS0Usb0JBQWM7QUFMaEIsS0FEWTtBQVJoQixHQWZZO0FBTmlCLENBQWpDLEMsQ0F5Q0E7O0FBQ0NBO0FBQUk7QUFBTCxDQUFnQkMsSUFBaEIsR0FBdUIsa0NBQXZCO0FBQ0FDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQkgsSUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmbG93XG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKjo6XG5pbXBvcnQgdHlwZSB7IFJlYWRlckZyYWdtZW50IH0gZnJvbSAncmVsYXktcnVudGltZSc7XG5pbXBvcnQgdHlwZSB7IEZyYWdtZW50UmVmZXJlbmNlIH0gZnJvbSBcInJlbGF5LXJ1bnRpbWVcIjtcbmRlY2xhcmUgZXhwb3J0IG9wYXF1ZSB0eXBlIHByRGV0YWlsVmlld19yZXBvc2l0b3J5JHJlZjogRnJhZ21lbnRSZWZlcmVuY2U7XG5kZWNsYXJlIGV4cG9ydCBvcGFxdWUgdHlwZSBwckRldGFpbFZpZXdfcmVwb3NpdG9yeSRmcmFnbWVudFR5cGU6IHByRGV0YWlsVmlld19yZXBvc2l0b3J5JHJlZjtcbmV4cG9ydCB0eXBlIHByRGV0YWlsVmlld19yZXBvc2l0b3J5ID0ge3xcbiAgK2lkOiBzdHJpbmcsXG4gICtuYW1lOiBzdHJpbmcsXG4gICtvd25lcjoge3xcbiAgICArbG9naW46IHN0cmluZ1xuICB8fSxcbiAgKyRyZWZUeXBlOiBwckRldGFpbFZpZXdfcmVwb3NpdG9yeSRyZWYsXG58fTtcbmV4cG9ydCB0eXBlIHByRGV0YWlsVmlld19yZXBvc2l0b3J5JGRhdGEgPSBwckRldGFpbFZpZXdfcmVwb3NpdG9yeTtcbmV4cG9ydCB0eXBlIHByRGV0YWlsVmlld19yZXBvc2l0b3J5JGtleSA9IHtcbiAgKyRkYXRhPzogcHJEZXRhaWxWaWV3X3JlcG9zaXRvcnkkZGF0YSxcbiAgKyRmcmFnbWVudFJlZnM6IHByRGV0YWlsVmlld19yZXBvc2l0b3J5JHJlZixcbn07XG4qL1xuXG5cbmNvbnN0IG5vZGUvKjogUmVhZGVyRnJhZ21lbnQqLyA9IHtcbiAgXCJraW5kXCI6IFwiRnJhZ21lbnRcIixcbiAgXCJuYW1lXCI6IFwicHJEZXRhaWxWaWV3X3JlcG9zaXRvcnlcIixcbiAgXCJ0eXBlXCI6IFwiUmVwb3NpdG9yeVwiLFxuICBcIm1ldGFkYXRhXCI6IG51bGwsXG4gIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiBbXSxcbiAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwiaWRcIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJuYW1lXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwib3duZXJcIixcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcImNvbmNyZXRlVHlwZVwiOiBudWxsLFxuICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgXCJuYW1lXCI6IFwibG9naW5cIixcbiAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICBdXG59O1xuLy8gcHJldHRpZXItaWdub3JlXG4obm9kZS8qOiBhbnkqLykuaGFzaCA9ICczZjNkNjFkZGQ2YWZhMWM5ZTA4MTFjM2I1YmU1MWJiMCc7XG5tb2R1bGUuZXhwb3J0cyA9IG5vZGU7XG4iXX0=