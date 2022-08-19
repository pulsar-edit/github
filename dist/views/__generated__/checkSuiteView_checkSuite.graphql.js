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
declare export opaque type checkSuiteView_checkSuite$ref: FragmentReference;
declare export opaque type checkSuiteView_checkSuite$fragmentType: checkSuiteView_checkSuite$ref;
export type checkSuiteView_checkSuite = {|
  +app: ?{|
    +name: string
  |},
  +status: CheckStatusState,
  +conclusion: ?CheckConclusionState,
  +$refType: checkSuiteView_checkSuite$ref,
|};
export type checkSuiteView_checkSuite$data = checkSuiteView_checkSuite;
export type checkSuiteView_checkSuite$key = {
  +$data?: checkSuiteView_checkSuite$data,
  +$fragmentRefs: checkSuiteView_checkSuite$ref,
};
*/

const node
/*: ReaderFragment*/
= {
  "kind": "Fragment",
  "name": "checkSuiteView_checkSuite",
  "type": "CheckSuite",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [{
    "kind": "LinkedField",
    "alias": null,
    "name": "app",
    "storageKey": null,
    "args": null,
    "concreteType": "App",
    "plural": false,
    "selections": [{
      "kind": "ScalarField",
      "alias": null,
      "name": "name",
      "args": null,
      "storageKey": null
    }]
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
  }]
}; // prettier-ignore

node
/*: any*/
.hash = 'ab1475671a1bc4196d67bfa75ad41446';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi92aWV3cy9fX2dlbmVyYXRlZF9fL2NoZWNrU3VpdGVWaWV3X2NoZWNrU3VpdGUuZ3JhcGhxbC5qcyJdLCJuYW1lcyI6WyJub2RlIiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUdBLE1BQU1BO0FBQUk7QUFBQSxFQUF1QjtBQUMvQixVQUFRLFVBRHVCO0FBRS9CLFVBQVEsMkJBRnVCO0FBRy9CLFVBQVEsWUFIdUI7QUFJL0IsY0FBWSxJQUptQjtBQUsvQix5QkFBdUIsRUFMUTtBQU0vQixnQkFBYyxDQUNaO0FBQ0UsWUFBUSxhQURWO0FBRUUsYUFBUyxJQUZYO0FBR0UsWUFBUSxLQUhWO0FBSUUsa0JBQWMsSUFKaEI7QUFLRSxZQUFRLElBTFY7QUFNRSxvQkFBZ0IsS0FObEI7QUFPRSxjQUFVLEtBUFo7QUFRRSxrQkFBYyxDQUNaO0FBQ0UsY0FBUSxhQURWO0FBRUUsZUFBUyxJQUZYO0FBR0UsY0FBUSxNQUhWO0FBSUUsY0FBUSxJQUpWO0FBS0Usb0JBQWM7QUFMaEIsS0FEWTtBQVJoQixHQURZLEVBbUJaO0FBQ0UsWUFBUSxhQURWO0FBRUUsYUFBUyxJQUZYO0FBR0UsWUFBUSxRQUhWO0FBSUUsWUFBUSxJQUpWO0FBS0Usa0JBQWM7QUFMaEIsR0FuQlksRUEwQlo7QUFDRSxZQUFRLGFBRFY7QUFFRSxhQUFTLElBRlg7QUFHRSxZQUFRLFlBSFY7QUFJRSxZQUFRLElBSlY7QUFLRSxrQkFBYztBQUxoQixHQTFCWTtBQU5pQixDQUFqQyxDLENBeUNBOztBQUNDQTtBQUFJO0FBQUwsQ0FBZ0JDLElBQWhCLEdBQXVCLGtDQUF2QjtBQUNBQyxNQUFNLENBQUNDLE9BQVAsR0FBaUJILElBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmxvd1xuICovXG5cbi8qIGVzbGludC1kaXNhYmxlICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyo6OlxuaW1wb3J0IHR5cGUgeyBSZWFkZXJGcmFnbWVudCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xuZXhwb3J0IHR5cGUgQ2hlY2tDb25jbHVzaW9uU3RhdGUgPSBcIkFDVElPTl9SRVFVSVJFRFwiIHwgXCJDQU5DRUxMRURcIiB8IFwiRkFJTFVSRVwiIHwgXCJORVVUUkFMXCIgfCBcIlNLSVBQRURcIiB8IFwiU1RBTEVcIiB8IFwiU1RBUlRVUF9GQUlMVVJFXCIgfCBcIlNVQ0NFU1NcIiB8IFwiVElNRURfT1VUXCIgfCBcIiVmdXR1cmUgYWRkZWQgdmFsdWVcIjtcbmV4cG9ydCB0eXBlIENoZWNrU3RhdHVzU3RhdGUgPSBcIkNPTVBMRVRFRFwiIHwgXCJJTl9QUk9HUkVTU1wiIHwgXCJRVUVVRURcIiB8IFwiUkVRVUVTVEVEXCIgfCBcIiVmdXR1cmUgYWRkZWQgdmFsdWVcIjtcbmltcG9ydCB0eXBlIHsgRnJhZ21lbnRSZWZlcmVuY2UgfSBmcm9tIFwicmVsYXktcnVudGltZVwiO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgY2hlY2tTdWl0ZVZpZXdfY2hlY2tTdWl0ZSRyZWY6IEZyYWdtZW50UmVmZXJlbmNlO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgY2hlY2tTdWl0ZVZpZXdfY2hlY2tTdWl0ZSRmcmFnbWVudFR5cGU6IGNoZWNrU3VpdGVWaWV3X2NoZWNrU3VpdGUkcmVmO1xuZXhwb3J0IHR5cGUgY2hlY2tTdWl0ZVZpZXdfY2hlY2tTdWl0ZSA9IHt8XG4gICthcHA6ID97fFxuICAgICtuYW1lOiBzdHJpbmdcbiAgfH0sXG4gICtzdGF0dXM6IENoZWNrU3RhdHVzU3RhdGUsXG4gICtjb25jbHVzaW9uOiA/Q2hlY2tDb25jbHVzaW9uU3RhdGUsXG4gICskcmVmVHlwZTogY2hlY2tTdWl0ZVZpZXdfY2hlY2tTdWl0ZSRyZWYsXG58fTtcbmV4cG9ydCB0eXBlIGNoZWNrU3VpdGVWaWV3X2NoZWNrU3VpdGUkZGF0YSA9IGNoZWNrU3VpdGVWaWV3X2NoZWNrU3VpdGU7XG5leHBvcnQgdHlwZSBjaGVja1N1aXRlVmlld19jaGVja1N1aXRlJGtleSA9IHtcbiAgKyRkYXRhPzogY2hlY2tTdWl0ZVZpZXdfY2hlY2tTdWl0ZSRkYXRhLFxuICArJGZyYWdtZW50UmVmczogY2hlY2tTdWl0ZVZpZXdfY2hlY2tTdWl0ZSRyZWYsXG59O1xuKi9cblxuXG5jb25zdCBub2RlLyo6IFJlYWRlckZyYWdtZW50Ki8gPSB7XG4gIFwia2luZFwiOiBcIkZyYWdtZW50XCIsXG4gIFwibmFtZVwiOiBcImNoZWNrU3VpdGVWaWV3X2NoZWNrU3VpdGVcIixcbiAgXCJ0eXBlXCI6IFwiQ2hlY2tTdWl0ZVwiLFxuICBcIm1ldGFkYXRhXCI6IG51bGwsXG4gIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiBbXSxcbiAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwiYXBwXCIsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJBcHBcIixcbiAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgIFwibmFtZVwiOiBcIm5hbWVcIixcbiAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwic3RhdHVzXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwiY29uY2x1c2lvblwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH1cbiAgXVxufTtcbi8vIHByZXR0aWVyLWlnbm9yZVxuKG5vZGUvKjogYW55Ki8pLmhhc2ggPSAnYWIxNDc1NjcxYTFiYzQxOTZkNjdiZmE3NWFkNDE0NDYnO1xubW9kdWxlLmV4cG9ydHMgPSBub2RlO1xuIl19