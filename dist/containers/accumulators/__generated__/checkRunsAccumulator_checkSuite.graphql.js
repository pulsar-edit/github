/**
 * @flow
 */

/* eslint-disable */
'use strict';
/*::
import type { ReaderFragment } from 'relay-runtime';
type checkRunView_checkRun$ref = any;
export type CheckConclusionState = "ACTION_REQUIRED" | "CANCELLED" | "FAILURE" | "NEUTRAL" | "SKIPPED" | "STALE" | "STARTUP_FAILURE" | "SUCCESS" | "TIMED_OUT" | "%future added value";
export type CheckStatusState = "COMPLETED" | "IN_PROGRESS" | "QUEUED" | "REQUESTED" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type checkRunsAccumulator_checkSuite$ref: FragmentReference;
declare export opaque type checkRunsAccumulator_checkSuite$fragmentType: checkRunsAccumulator_checkSuite$ref;
export type checkRunsAccumulator_checkSuite = {|
  +id: string,
  +checkRuns: ?{|
    +pageInfo: {|
      +hasNextPage: boolean,
      +endCursor: ?string,
    |},
    +edges: ?$ReadOnlyArray<?{|
      +cursor: string,
      +node: ?{|
        +id: string,
        +status: CheckStatusState,
        +conclusion: ?CheckConclusionState,
        +$fragmentRefs: checkRunView_checkRun$ref,
      |},
    |}>,
  |},
  +$refType: checkRunsAccumulator_checkSuite$ref,
|};
export type checkRunsAccumulator_checkSuite$data = checkRunsAccumulator_checkSuite;
export type checkRunsAccumulator_checkSuite$key = {
  +$data?: checkRunsAccumulator_checkSuite$data,
  +$fragmentRefs: checkRunsAccumulator_checkSuite$ref,
};
*/

const node
/*: ReaderFragment*/
= function () {
  var v0 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "id",
    "args": null,
    "storageKey": null
  };
  return {
    "kind": "Fragment",
    "name": "checkRunsAccumulator_checkSuite",
    "type": "CheckSuite",
    "metadata": {
      "connection": [{
        "count": "checkRunCount",
        "cursor": "checkRunCursor",
        "direction": "forward",
        "path": ["checkRuns"]
      }]
    },
    "argumentDefinitions": [{
      "kind": "LocalArgument",
      "name": "checkRunCount",
      "type": "Int!",
      "defaultValue": null
    }, {
      "kind": "LocalArgument",
      "name": "checkRunCursor",
      "type": "String",
      "defaultValue": null
    }],
    "selections": [v0
    /*: any*/
    , {
      "kind": "LinkedField",
      "alias": "checkRuns",
      "name": "__CheckRunsAccumulator_checkRuns_connection",
      "storageKey": null,
      "args": null,
      "concreteType": "CheckRunConnection",
      "plural": false,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "pageInfo",
        "storageKey": null,
        "args": null,
        "concreteType": "PageInfo",
        "plural": false,
        "selections": [{
          "kind": "ScalarField",
          "alias": null,
          "name": "hasNextPage",
          "args": null,
          "storageKey": null
        }, {
          "kind": "ScalarField",
          "alias": null,
          "name": "endCursor",
          "args": null,
          "storageKey": null
        }]
      }, {
        "kind": "LinkedField",
        "alias": null,
        "name": "edges",
        "storageKey": null,
        "args": null,
        "concreteType": "CheckRunEdge",
        "plural": true,
        "selections": [{
          "kind": "ScalarField",
          "alias": null,
          "name": "cursor",
          "args": null,
          "storageKey": null
        }, {
          "kind": "LinkedField",
          "alias": null,
          "name": "node",
          "storageKey": null,
          "args": null,
          "concreteType": "CheckRun",
          "plural": false,
          "selections": [v0
          /*: any*/
          , {
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
            "name": "__typename",
            "args": null,
            "storageKey": null
          }, {
            "kind": "FragmentSpread",
            "name": "checkRunView_checkRun",
            "args": null
          }]
        }]
      }]
    }]
  };
}(); // prettier-ignore


node
/*: any*/
.hash = '4a47da672423daae903769141008d468';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9jb250YWluZXJzL2FjY3VtdWxhdG9ycy9fX2dlbmVyYXRlZF9fL2NoZWNrUnVuc0FjY3VtdWxhdG9yX2NoZWNrU3VpdGUuZ3JhcGhxbC5qcyJdLCJuYW1lcyI6WyJub2RlIiwidjAiLCJoYXNoIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOztBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0EsTUFBTUE7QUFBSTtBQUFBLEVBQXdCLFlBQVU7QUFDNUMsTUFBSUMsRUFBRSxHQUFHO0FBQ1AsWUFBUSxhQUREO0FBRVAsYUFBUyxJQUZGO0FBR1AsWUFBUSxJQUhEO0FBSVAsWUFBUSxJQUpEO0FBS1Asa0JBQWM7QUFMUCxHQUFUO0FBT0EsU0FBTztBQUNMLFlBQVEsVUFESDtBQUVMLFlBQVEsaUNBRkg7QUFHTCxZQUFRLFlBSEg7QUFJTCxnQkFBWTtBQUNWLG9CQUFjLENBQ1o7QUFDRSxpQkFBUyxlQURYO0FBRUUsa0JBQVUsZ0JBRlo7QUFHRSxxQkFBYSxTQUhmO0FBSUUsZ0JBQVEsQ0FDTixXQURNO0FBSlYsT0FEWTtBQURKLEtBSlA7QUFnQkwsMkJBQXVCLENBQ3JCO0FBQ0UsY0FBUSxlQURWO0FBRUUsY0FBUSxlQUZWO0FBR0UsY0FBUSxNQUhWO0FBSUUsc0JBQWdCO0FBSmxCLEtBRHFCLEVBT3JCO0FBQ0UsY0FBUSxlQURWO0FBRUUsY0FBUSxnQkFGVjtBQUdFLGNBQVEsUUFIVjtBQUlFLHNCQUFnQjtBQUpsQixLQVBxQixDQWhCbEI7QUE4Qkwsa0JBQWMsQ0FDWEE7QUFBRTtBQURTLE1BRVo7QUFDRSxjQUFRLGFBRFY7QUFFRSxlQUFTLFdBRlg7QUFHRSxjQUFRLDZDQUhWO0FBSUUsb0JBQWMsSUFKaEI7QUFLRSxjQUFRLElBTFY7QUFNRSxzQkFBZ0Isb0JBTmxCO0FBT0UsZ0JBQVUsS0FQWjtBQVFFLG9CQUFjLENBQ1o7QUFDRSxnQkFBUSxhQURWO0FBRUUsaUJBQVMsSUFGWDtBQUdFLGdCQUFRLFVBSFY7QUFJRSxzQkFBYyxJQUpoQjtBQUtFLGdCQUFRLElBTFY7QUFNRSx3QkFBZ0IsVUFObEI7QUFPRSxrQkFBVSxLQVBaO0FBUUUsc0JBQWMsQ0FDWjtBQUNFLGtCQUFRLGFBRFY7QUFFRSxtQkFBUyxJQUZYO0FBR0Usa0JBQVEsYUFIVjtBQUlFLGtCQUFRLElBSlY7QUFLRSx3QkFBYztBQUxoQixTQURZLEVBUVo7QUFDRSxrQkFBUSxhQURWO0FBRUUsbUJBQVMsSUFGWDtBQUdFLGtCQUFRLFdBSFY7QUFJRSxrQkFBUSxJQUpWO0FBS0Usd0JBQWM7QUFMaEIsU0FSWTtBQVJoQixPQURZLEVBMEJaO0FBQ0UsZ0JBQVEsYUFEVjtBQUVFLGlCQUFTLElBRlg7QUFHRSxnQkFBUSxPQUhWO0FBSUUsc0JBQWMsSUFKaEI7QUFLRSxnQkFBUSxJQUxWO0FBTUUsd0JBQWdCLGNBTmxCO0FBT0Usa0JBQVUsSUFQWjtBQVFFLHNCQUFjLENBQ1o7QUFDRSxrQkFBUSxhQURWO0FBRUUsbUJBQVMsSUFGWDtBQUdFLGtCQUFRLFFBSFY7QUFJRSxrQkFBUSxJQUpWO0FBS0Usd0JBQWM7QUFMaEIsU0FEWSxFQVFaO0FBQ0Usa0JBQVEsYUFEVjtBQUVFLG1CQUFTLElBRlg7QUFHRSxrQkFBUSxNQUhWO0FBSUUsd0JBQWMsSUFKaEI7QUFLRSxrQkFBUSxJQUxWO0FBTUUsMEJBQWdCLFVBTmxCO0FBT0Usb0JBQVUsS0FQWjtBQVFFLHdCQUFjLENBQ1hBO0FBQUU7QUFEUyxZQUVaO0FBQ0Usb0JBQVEsYUFEVjtBQUVFLHFCQUFTLElBRlg7QUFHRSxvQkFBUSxRQUhWO0FBSUUsb0JBQVEsSUFKVjtBQUtFLDBCQUFjO0FBTGhCLFdBRlksRUFTWjtBQUNFLG9CQUFRLGFBRFY7QUFFRSxxQkFBUyxJQUZYO0FBR0Usb0JBQVEsWUFIVjtBQUlFLG9CQUFRLElBSlY7QUFLRSwwQkFBYztBQUxoQixXQVRZLEVBZ0JaO0FBQ0Usb0JBQVEsYUFEVjtBQUVFLHFCQUFTLElBRlg7QUFHRSxvQkFBUSxZQUhWO0FBSUUsb0JBQVEsSUFKVjtBQUtFLDBCQUFjO0FBTGhCLFdBaEJZLEVBdUJaO0FBQ0Usb0JBQVEsZ0JBRFY7QUFFRSxvQkFBUSx1QkFGVjtBQUdFLG9CQUFRO0FBSFYsV0F2Qlk7QUFSaEIsU0FSWTtBQVJoQixPQTFCWTtBQVJoQixLQUZZO0FBOUJULEdBQVA7QUE4SEMsQ0F0SWdDLEVBQWpDLEMsQ0F1SUE7OztBQUNDRDtBQUFJO0FBQUwsQ0FBZ0JFLElBQWhCLEdBQXVCLGtDQUF2QjtBQUNBQyxNQUFNLENBQUNDLE9BQVAsR0FBaUJKLElBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmxvd1xuICovXG5cbi8qIGVzbGludC1kaXNhYmxlICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyo6OlxuaW1wb3J0IHR5cGUgeyBSZWFkZXJGcmFnbWVudCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xudHlwZSBjaGVja1J1blZpZXdfY2hlY2tSdW4kcmVmID0gYW55O1xuZXhwb3J0IHR5cGUgQ2hlY2tDb25jbHVzaW9uU3RhdGUgPSBcIkFDVElPTl9SRVFVSVJFRFwiIHwgXCJDQU5DRUxMRURcIiB8IFwiRkFJTFVSRVwiIHwgXCJORVVUUkFMXCIgfCBcIlNLSVBQRURcIiB8IFwiU1RBTEVcIiB8IFwiU1RBUlRVUF9GQUlMVVJFXCIgfCBcIlNVQ0NFU1NcIiB8IFwiVElNRURfT1VUXCIgfCBcIiVmdXR1cmUgYWRkZWQgdmFsdWVcIjtcbmV4cG9ydCB0eXBlIENoZWNrU3RhdHVzU3RhdGUgPSBcIkNPTVBMRVRFRFwiIHwgXCJJTl9QUk9HUkVTU1wiIHwgXCJRVUVVRURcIiB8IFwiUkVRVUVTVEVEXCIgfCBcIiVmdXR1cmUgYWRkZWQgdmFsdWVcIjtcbmltcG9ydCB0eXBlIHsgRnJhZ21lbnRSZWZlcmVuY2UgfSBmcm9tIFwicmVsYXktcnVudGltZVwiO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgY2hlY2tSdW5zQWNjdW11bGF0b3JfY2hlY2tTdWl0ZSRyZWY6IEZyYWdtZW50UmVmZXJlbmNlO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgY2hlY2tSdW5zQWNjdW11bGF0b3JfY2hlY2tTdWl0ZSRmcmFnbWVudFR5cGU6IGNoZWNrUnVuc0FjY3VtdWxhdG9yX2NoZWNrU3VpdGUkcmVmO1xuZXhwb3J0IHR5cGUgY2hlY2tSdW5zQWNjdW11bGF0b3JfY2hlY2tTdWl0ZSA9IHt8XG4gICtpZDogc3RyaW5nLFxuICArY2hlY2tSdW5zOiA/e3xcbiAgICArcGFnZUluZm86IHt8XG4gICAgICAraGFzTmV4dFBhZ2U6IGJvb2xlYW4sXG4gICAgICArZW5kQ3Vyc29yOiA/c3RyaW5nLFxuICAgIHx9LFxuICAgICtlZGdlczogPyRSZWFkT25seUFycmF5PD97fFxuICAgICAgK2N1cnNvcjogc3RyaW5nLFxuICAgICAgK25vZGU6ID97fFxuICAgICAgICAraWQ6IHN0cmluZyxcbiAgICAgICAgK3N0YXR1czogQ2hlY2tTdGF0dXNTdGF0ZSxcbiAgICAgICAgK2NvbmNsdXNpb246ID9DaGVja0NvbmNsdXNpb25TdGF0ZSxcbiAgICAgICAgKyRmcmFnbWVudFJlZnM6IGNoZWNrUnVuVmlld19jaGVja1J1biRyZWYsXG4gICAgICB8fSxcbiAgICB8fT4sXG4gIHx9LFxuICArJHJlZlR5cGU6IGNoZWNrUnVuc0FjY3VtdWxhdG9yX2NoZWNrU3VpdGUkcmVmLFxufH07XG5leHBvcnQgdHlwZSBjaGVja1J1bnNBY2N1bXVsYXRvcl9jaGVja1N1aXRlJGRhdGEgPSBjaGVja1J1bnNBY2N1bXVsYXRvcl9jaGVja1N1aXRlO1xuZXhwb3J0IHR5cGUgY2hlY2tSdW5zQWNjdW11bGF0b3JfY2hlY2tTdWl0ZSRrZXkgPSB7XG4gICskZGF0YT86IGNoZWNrUnVuc0FjY3VtdWxhdG9yX2NoZWNrU3VpdGUkZGF0YSxcbiAgKyRmcmFnbWVudFJlZnM6IGNoZWNrUnVuc0FjY3VtdWxhdG9yX2NoZWNrU3VpdGUkcmVmLFxufTtcbiovXG5cblxuY29uc3Qgbm9kZS8qOiBSZWFkZXJGcmFnbWVudCovID0gKGZ1bmN0aW9uKCl7XG52YXIgdjAgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiaWRcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59O1xucmV0dXJuIHtcbiAgXCJraW5kXCI6IFwiRnJhZ21lbnRcIixcbiAgXCJuYW1lXCI6IFwiY2hlY2tSdW5zQWNjdW11bGF0b3JfY2hlY2tTdWl0ZVwiLFxuICBcInR5cGVcIjogXCJDaGVja1N1aXRlXCIsXG4gIFwibWV0YWRhdGFcIjoge1xuICAgIFwiY29ubmVjdGlvblwiOiBbXG4gICAgICB7XG4gICAgICAgIFwiY291bnRcIjogXCJjaGVja1J1bkNvdW50XCIsXG4gICAgICAgIFwiY3Vyc29yXCI6IFwiY2hlY2tSdW5DdXJzb3JcIixcbiAgICAgICAgXCJkaXJlY3Rpb25cIjogXCJmb3J3YXJkXCIsXG4gICAgICAgIFwicGF0aFwiOiBbXG4gICAgICAgICAgXCJjaGVja1J1bnNcIlxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9LFxuICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogW1xuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICAgIFwibmFtZVwiOiBcImNoZWNrUnVuQ291bnRcIixcbiAgICAgIFwidHlwZVwiOiBcIkludCFcIixcbiAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICAgIFwibmFtZVwiOiBcImNoZWNrUnVuQ3Vyc29yXCIsXG4gICAgICBcInR5cGVcIjogXCJTdHJpbmdcIixcbiAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgICB9XG4gIF0sXG4gIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgKHYwLyo6IGFueSovKSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBcImNoZWNrUnVuc1wiLFxuICAgICAgXCJuYW1lXCI6IFwiX19DaGVja1J1bnNBY2N1bXVsYXRvcl9jaGVja1J1bnNfY29ubmVjdGlvblwiLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiQ2hlY2tSdW5Db25uZWN0aW9uXCIsXG4gICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICBcIm5hbWVcIjogXCJwYWdlSW5mb1wiLFxuICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUGFnZUluZm9cIixcbiAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImhhc05leHRQYWdlXCIsXG4gICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJlbmRDdXJzb3JcIixcbiAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgXCJuYW1lXCI6IFwiZWRnZXNcIixcbiAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIkNoZWNrUnVuRWRnZVwiLFxuICAgICAgICAgIFwicGx1cmFsXCI6IHRydWUsXG4gICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjdXJzb3JcIixcbiAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcIm5vZGVcIixcbiAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIkNoZWNrUnVuXCIsXG4gICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICh2MC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInN0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbmNsdXNpb25cIixcbiAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJfX3R5cGVuYW1lXCIsXG4gICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJGcmFnbWVudFNwcmVhZFwiLFxuICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY2hlY2tSdW5WaWV3X2NoZWNrUnVuXCIsXG4gICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgXVxufTtcbn0pKCk7XG4vLyBwcmV0dGllci1pZ25vcmVcbihub2RlLyo6IGFueSovKS5oYXNoID0gJzRhNDdkYTY3MjQyM2RhYWU5MDM3NjkxNDEwMDhkNDY4Jztcbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcbiJdfQ==