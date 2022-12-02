/**
 * @flow
 */

/* eslint-disable */
'use strict';
/*::
import type { ReaderFragment } from 'relay-runtime';
type checkRunsAccumulator_checkSuite$ref = any;
type checkSuiteView_checkSuite$ref = any;
export type CheckConclusionState = "ACTION_REQUIRED" | "CANCELLED" | "FAILURE" | "NEUTRAL" | "SKIPPED" | "STALE" | "STARTUP_FAILURE" | "SUCCESS" | "TIMED_OUT" | "%future added value";
export type CheckStatusState = "COMPLETED" | "IN_PROGRESS" | "QUEUED" | "REQUESTED" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type checkSuitesAccumulator_commit$ref: FragmentReference;
declare export opaque type checkSuitesAccumulator_commit$fragmentType: checkSuitesAccumulator_commit$ref;
export type checkSuitesAccumulator_commit = {|
  +id: string,
  +checkSuites: ?{|
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
        +$fragmentRefs: checkSuiteView_checkSuite$ref & checkRunsAccumulator_checkSuite$ref,
      |},
    |}>,
  |},
  +$refType: checkSuitesAccumulator_commit$ref,
|};
export type checkSuitesAccumulator_commit$data = checkSuitesAccumulator_commit;
export type checkSuitesAccumulator_commit$key = {
  +$data?: checkSuitesAccumulator_commit$data,
  +$fragmentRefs: checkSuitesAccumulator_commit$ref,
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
    "name": "checkSuitesAccumulator_commit",
    "type": "Commit",
    "metadata": {
      "connection": [{
        "count": "checkSuiteCount",
        "cursor": "checkSuiteCursor",
        "direction": "forward",
        "path": ["checkSuites"]
      }]
    },
    "argumentDefinitions": [{
      "kind": "LocalArgument",
      "name": "checkSuiteCount",
      "type": "Int!",
      "defaultValue": null
    }, {
      "kind": "LocalArgument",
      "name": "checkSuiteCursor",
      "type": "String",
      "defaultValue": null
    }, {
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
      "alias": "checkSuites",
      "name": "__CheckSuiteAccumulator_checkSuites_connection",
      "storageKey": null,
      "args": null,
      "concreteType": "CheckSuiteConnection",
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
        "concreteType": "CheckSuiteEdge",
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
          "concreteType": "CheckSuite",
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
            "name": "checkSuiteView_checkSuite",
            "args": null
          }, {
            "kind": "FragmentSpread",
            "name": "checkRunsAccumulator_checkSuite",
            "args": [{
              "kind": "Variable",
              "name": "checkRunCount",
              "variableName": "checkRunCount"
            }, {
              "kind": "Variable",
              "name": "checkRunCursor",
              "variableName": "checkRunCursor"
            }]
          }]
        }]
      }]
    }]
  };
}(); // prettier-ignore


node
/*: any*/
.hash = '582abc8127f0f2f19fb0a6a531af5e06';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9jb250YWluZXJzL2FjY3VtdWxhdG9ycy9fX2dlbmVyYXRlZF9fL2NoZWNrU3VpdGVzQWNjdW11bGF0b3JfY29tbWl0LmdyYXBocWwuanMiXSwibmFtZXMiOlsibm9kZSIsInYwIiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0EsTUFBTUE7QUFBSTtBQUFBLEVBQXdCLFlBQVU7QUFDNUMsTUFBSUMsRUFBRSxHQUFHO0FBQ1AsWUFBUSxhQUREO0FBRVAsYUFBUyxJQUZGO0FBR1AsWUFBUSxJQUhEO0FBSVAsWUFBUSxJQUpEO0FBS1Asa0JBQWM7QUFMUCxHQUFUO0FBT0EsU0FBTztBQUNMLFlBQVEsVUFESDtBQUVMLFlBQVEsK0JBRkg7QUFHTCxZQUFRLFFBSEg7QUFJTCxnQkFBWTtBQUNWLG9CQUFjLENBQ1o7QUFDRSxpQkFBUyxpQkFEWDtBQUVFLGtCQUFVLGtCQUZaO0FBR0UscUJBQWEsU0FIZjtBQUlFLGdCQUFRLENBQ04sYUFETTtBQUpWLE9BRFk7QUFESixLQUpQO0FBZ0JMLDJCQUF1QixDQUNyQjtBQUNFLGNBQVEsZUFEVjtBQUVFLGNBQVEsaUJBRlY7QUFHRSxjQUFRLE1BSFY7QUFJRSxzQkFBZ0I7QUFKbEIsS0FEcUIsRUFPckI7QUFDRSxjQUFRLGVBRFY7QUFFRSxjQUFRLGtCQUZWO0FBR0UsY0FBUSxRQUhWO0FBSUUsc0JBQWdCO0FBSmxCLEtBUHFCLEVBYXJCO0FBQ0UsY0FBUSxlQURWO0FBRUUsY0FBUSxlQUZWO0FBR0UsY0FBUSxNQUhWO0FBSUUsc0JBQWdCO0FBSmxCLEtBYnFCLEVBbUJyQjtBQUNFLGNBQVEsZUFEVjtBQUVFLGNBQVEsZ0JBRlY7QUFHRSxjQUFRLFFBSFY7QUFJRSxzQkFBZ0I7QUFKbEIsS0FuQnFCLENBaEJsQjtBQTBDTCxrQkFBYyxDQUNYQTtBQUFFO0FBRFMsTUFFWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsYUFGWDtBQUdFLGNBQVEsZ0RBSFY7QUFJRSxvQkFBYyxJQUpoQjtBQUtFLGNBQVEsSUFMVjtBQU1FLHNCQUFnQixzQkFObEI7QUFPRSxnQkFBVSxLQVBaO0FBUUUsb0JBQWMsQ0FDWjtBQUNFLGdCQUFRLGFBRFY7QUFFRSxpQkFBUyxJQUZYO0FBR0UsZ0JBQVEsVUFIVjtBQUlFLHNCQUFjLElBSmhCO0FBS0UsZ0JBQVEsSUFMVjtBQU1FLHdCQUFnQixVQU5sQjtBQU9FLGtCQUFVLEtBUFo7QUFRRSxzQkFBYyxDQUNaO0FBQ0Usa0JBQVEsYUFEVjtBQUVFLG1CQUFTLElBRlg7QUFHRSxrQkFBUSxhQUhWO0FBSUUsa0JBQVEsSUFKVjtBQUtFLHdCQUFjO0FBTGhCLFNBRFksRUFRWjtBQUNFLGtCQUFRLGFBRFY7QUFFRSxtQkFBUyxJQUZYO0FBR0Usa0JBQVEsV0FIVjtBQUlFLGtCQUFRLElBSlY7QUFLRSx3QkFBYztBQUxoQixTQVJZO0FBUmhCLE9BRFksRUEwQlo7QUFDRSxnQkFBUSxhQURWO0FBRUUsaUJBQVMsSUFGWDtBQUdFLGdCQUFRLE9BSFY7QUFJRSxzQkFBYyxJQUpoQjtBQUtFLGdCQUFRLElBTFY7QUFNRSx3QkFBZ0IsZ0JBTmxCO0FBT0Usa0JBQVUsSUFQWjtBQVFFLHNCQUFjLENBQ1o7QUFDRSxrQkFBUSxhQURWO0FBRUUsbUJBQVMsSUFGWDtBQUdFLGtCQUFRLFFBSFY7QUFJRSxrQkFBUSxJQUpWO0FBS0Usd0JBQWM7QUFMaEIsU0FEWSxFQVFaO0FBQ0Usa0JBQVEsYUFEVjtBQUVFLG1CQUFTLElBRlg7QUFHRSxrQkFBUSxNQUhWO0FBSUUsd0JBQWMsSUFKaEI7QUFLRSxrQkFBUSxJQUxWO0FBTUUsMEJBQWdCLFlBTmxCO0FBT0Usb0JBQVUsS0FQWjtBQVFFLHdCQUFjLENBQ1hBO0FBQUU7QUFEUyxZQUVaO0FBQ0Usb0JBQVEsYUFEVjtBQUVFLHFCQUFTLElBRlg7QUFHRSxvQkFBUSxRQUhWO0FBSUUsb0JBQVEsSUFKVjtBQUtFLDBCQUFjO0FBTGhCLFdBRlksRUFTWjtBQUNFLG9CQUFRLGFBRFY7QUFFRSxxQkFBUyxJQUZYO0FBR0Usb0JBQVEsWUFIVjtBQUlFLG9CQUFRLElBSlY7QUFLRSwwQkFBYztBQUxoQixXQVRZLEVBZ0JaO0FBQ0Usb0JBQVEsYUFEVjtBQUVFLHFCQUFTLElBRlg7QUFHRSxvQkFBUSxZQUhWO0FBSUUsb0JBQVEsSUFKVjtBQUtFLDBCQUFjO0FBTGhCLFdBaEJZLEVBdUJaO0FBQ0Usb0JBQVEsZ0JBRFY7QUFFRSxvQkFBUSwyQkFGVjtBQUdFLG9CQUFRO0FBSFYsV0F2QlksRUE0Qlo7QUFDRSxvQkFBUSxnQkFEVjtBQUVFLG9CQUFRLGlDQUZWO0FBR0Usb0JBQVEsQ0FDTjtBQUNFLHNCQUFRLFVBRFY7QUFFRSxzQkFBUSxlQUZWO0FBR0UsOEJBQWdCO0FBSGxCLGFBRE0sRUFNTjtBQUNFLHNCQUFRLFVBRFY7QUFFRSxzQkFBUSxnQkFGVjtBQUdFLDhCQUFnQjtBQUhsQixhQU5NO0FBSFYsV0E1Qlk7QUFSaEIsU0FSWTtBQVJoQixPQTFCWTtBQVJoQixLQUZZO0FBMUNULEdBQVA7QUEwSkMsQ0FsS2dDLEVBQWpDLEMsQ0FtS0E7OztBQUNDRDtBQUFJO0FBQUwsQ0FBZ0JFLElBQWhCLEdBQXVCLGtDQUF2QjtBQUNBQyxNQUFNLENBQUNDLE9BQVAsR0FBaUJKLElBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmxvd1xuICovXG5cbi8qIGVzbGludC1kaXNhYmxlICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyo6OlxuaW1wb3J0IHR5cGUgeyBSZWFkZXJGcmFnbWVudCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xudHlwZSBjaGVja1J1bnNBY2N1bXVsYXRvcl9jaGVja1N1aXRlJHJlZiA9IGFueTtcbnR5cGUgY2hlY2tTdWl0ZVZpZXdfY2hlY2tTdWl0ZSRyZWYgPSBhbnk7XG5leHBvcnQgdHlwZSBDaGVja0NvbmNsdXNpb25TdGF0ZSA9IFwiQUNUSU9OX1JFUVVJUkVEXCIgfCBcIkNBTkNFTExFRFwiIHwgXCJGQUlMVVJFXCIgfCBcIk5FVVRSQUxcIiB8IFwiU0tJUFBFRFwiIHwgXCJTVEFMRVwiIHwgXCJTVEFSVFVQX0ZBSUxVUkVcIiB8IFwiU1VDQ0VTU1wiIHwgXCJUSU1FRF9PVVRcIiB8IFwiJWZ1dHVyZSBhZGRlZCB2YWx1ZVwiO1xuZXhwb3J0IHR5cGUgQ2hlY2tTdGF0dXNTdGF0ZSA9IFwiQ09NUExFVEVEXCIgfCBcIklOX1BST0dSRVNTXCIgfCBcIlFVRVVFRFwiIHwgXCJSRVFVRVNURURcIiB8IFwiJWZ1dHVyZSBhZGRlZCB2YWx1ZVwiO1xuaW1wb3J0IHR5cGUgeyBGcmFnbWVudFJlZmVyZW5jZSB9IGZyb20gXCJyZWxheS1ydW50aW1lXCI7XG5kZWNsYXJlIGV4cG9ydCBvcGFxdWUgdHlwZSBjaGVja1N1aXRlc0FjY3VtdWxhdG9yX2NvbW1pdCRyZWY6IEZyYWdtZW50UmVmZXJlbmNlO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgY2hlY2tTdWl0ZXNBY2N1bXVsYXRvcl9jb21taXQkZnJhZ21lbnRUeXBlOiBjaGVja1N1aXRlc0FjY3VtdWxhdG9yX2NvbW1pdCRyZWY7XG5leHBvcnQgdHlwZSBjaGVja1N1aXRlc0FjY3VtdWxhdG9yX2NvbW1pdCA9IHt8XG4gICtpZDogc3RyaW5nLFxuICArY2hlY2tTdWl0ZXM6ID97fFxuICAgICtwYWdlSW5mbzoge3xcbiAgICAgICtoYXNOZXh0UGFnZTogYm9vbGVhbixcbiAgICAgICtlbmRDdXJzb3I6ID9zdHJpbmcsXG4gICAgfH0sXG4gICAgK2VkZ2VzOiA/JFJlYWRPbmx5QXJyYXk8P3t8XG4gICAgICArY3Vyc29yOiBzdHJpbmcsXG4gICAgICArbm9kZTogP3t8XG4gICAgICAgICtpZDogc3RyaW5nLFxuICAgICAgICArc3RhdHVzOiBDaGVja1N0YXR1c1N0YXRlLFxuICAgICAgICArY29uY2x1c2lvbjogP0NoZWNrQ29uY2x1c2lvblN0YXRlLFxuICAgICAgICArJGZyYWdtZW50UmVmczogY2hlY2tTdWl0ZVZpZXdfY2hlY2tTdWl0ZSRyZWYgJiBjaGVja1J1bnNBY2N1bXVsYXRvcl9jaGVja1N1aXRlJHJlZixcbiAgICAgIHx9LFxuICAgIHx9PixcbiAgfH0sXG4gICskcmVmVHlwZTogY2hlY2tTdWl0ZXNBY2N1bXVsYXRvcl9jb21taXQkcmVmLFxufH07XG5leHBvcnQgdHlwZSBjaGVja1N1aXRlc0FjY3VtdWxhdG9yX2NvbW1pdCRkYXRhID0gY2hlY2tTdWl0ZXNBY2N1bXVsYXRvcl9jb21taXQ7XG5leHBvcnQgdHlwZSBjaGVja1N1aXRlc0FjY3VtdWxhdG9yX2NvbW1pdCRrZXkgPSB7XG4gICskZGF0YT86IGNoZWNrU3VpdGVzQWNjdW11bGF0b3JfY29tbWl0JGRhdGEsXG4gICskZnJhZ21lbnRSZWZzOiBjaGVja1N1aXRlc0FjY3VtdWxhdG9yX2NvbW1pdCRyZWYsXG59O1xuKi9cblxuXG5jb25zdCBub2RlLyo6IFJlYWRlckZyYWdtZW50Ki8gPSAoZnVuY3Rpb24oKXtcbnZhciB2MCA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJpZFwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn07XG5yZXR1cm4ge1xuICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICBcIm5hbWVcIjogXCJjaGVja1N1aXRlc0FjY3VtdWxhdG9yX2NvbW1pdFwiLFxuICBcInR5cGVcIjogXCJDb21taXRcIixcbiAgXCJtZXRhZGF0YVwiOiB7XG4gICAgXCJjb25uZWN0aW9uXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJjb3VudFwiOiBcImNoZWNrU3VpdGVDb3VudFwiLFxuICAgICAgICBcImN1cnNvclwiOiBcImNoZWNrU3VpdGVDdXJzb3JcIixcbiAgICAgICAgXCJkaXJlY3Rpb25cIjogXCJmb3J3YXJkXCIsXG4gICAgICAgIFwicGF0aFwiOiBbXG4gICAgICAgICAgXCJjaGVja1N1aXRlc1wiXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiBbXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgICAgXCJuYW1lXCI6IFwiY2hlY2tTdWl0ZUNvdW50XCIsXG4gICAgICBcInR5cGVcIjogXCJJbnQhXCIsXG4gICAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgICBcIm5hbWVcIjogXCJjaGVja1N1aXRlQ3Vyc29yXCIsXG4gICAgICBcInR5cGVcIjogXCJTdHJpbmdcIixcbiAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICAgIFwibmFtZVwiOiBcImNoZWNrUnVuQ291bnRcIixcbiAgICAgIFwidHlwZVwiOiBcIkludCFcIixcbiAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICAgIFwibmFtZVwiOiBcImNoZWNrUnVuQ3Vyc29yXCIsXG4gICAgICBcInR5cGVcIjogXCJTdHJpbmdcIixcbiAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgICB9XG4gIF0sXG4gIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgKHYwLyo6IGFueSovKSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBcImNoZWNrU3VpdGVzXCIsXG4gICAgICBcIm5hbWVcIjogXCJfX0NoZWNrU3VpdGVBY2N1bXVsYXRvcl9jaGVja1N1aXRlc19jb25uZWN0aW9uXCIsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJDaGVja1N1aXRlQ29ubmVjdGlvblwiLFxuICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgXCJuYW1lXCI6IFwicGFnZUluZm9cIixcbiAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlBhZ2VJbmZvXCIsXG4gICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJoYXNOZXh0UGFnZVwiLFxuICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZW5kQ3Vyc29yXCIsXG4gICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgIFwibmFtZVwiOiBcImVkZ2VzXCIsXG4gICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJDaGVja1N1aXRlRWRnZVwiLFxuICAgICAgICAgIFwicGx1cmFsXCI6IHRydWUsXG4gICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjdXJzb3JcIixcbiAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcIm5vZGVcIixcbiAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIkNoZWNrU3VpdGVcIixcbiAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgKHYwLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwic3RhdHVzXCIsXG4gICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY29uY2x1c2lvblwiLFxuICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIl9fdHlwZW5hbWVcIixcbiAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkZyYWdtZW50U3ByZWFkXCIsXG4gICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjaGVja1N1aXRlVmlld19jaGVja1N1aXRlXCIsXG4gICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiRnJhZ21lbnRTcHJlYWRcIixcbiAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNoZWNrUnVuc0FjY3VtdWxhdG9yX2NoZWNrU3VpdGVcIixcbiAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNoZWNrUnVuQ291bnRcIixcbiAgICAgICAgICAgICAgICAgICAgICBcInZhcmlhYmxlTmFtZVwiOiBcImNoZWNrUnVuQ291bnRcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjaGVja1J1bkN1cnNvclwiLFxuICAgICAgICAgICAgICAgICAgICAgIFwidmFyaWFibGVOYW1lXCI6IFwiY2hlY2tSdW5DdXJzb3JcIlxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICBdXG59O1xufSkoKTtcbi8vIHByZXR0aWVyLWlnbm9yZVxuKG5vZGUvKjogYW55Ki8pLmhhc2ggPSAnNTgyYWJjODEyN2YwZjJmMTlmYjBhNmE1MzFhZjVlMDYnO1xubW9kdWxlLmV4cG9ydHMgPSBub2RlO1xuIl19