/**
 * @flow
 */

/* eslint-disable */
'use strict';
/*::
import type { ReaderFragment } from 'relay-runtime';
type checkSuitesAccumulator_commit$ref = any;
type prStatusContextView_context$ref = any;
export type StatusState = "ERROR" | "EXPECTED" | "FAILURE" | "PENDING" | "SUCCESS" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type prStatusesView_pullRequest$ref: FragmentReference;
declare export opaque type prStatusesView_pullRequest$fragmentType: prStatusesView_pullRequest$ref;
export type prStatusesView_pullRequest = {|
  +id: string,
  +recentCommits: {|
    +edges: ?$ReadOnlyArray<?{|
      +node: ?{|
        +commit: {|
          +status: ?{|
            +state: StatusState,
            +contexts: $ReadOnlyArray<{|
              +id: string,
              +state: StatusState,
              +$fragmentRefs: prStatusContextView_context$ref,
            |}>,
          |},
          +$fragmentRefs: checkSuitesAccumulator_commit$ref,
        |}
      |}
    |}>
  |},
  +$refType: prStatusesView_pullRequest$ref,
|};
export type prStatusesView_pullRequest$data = prStatusesView_pullRequest;
export type prStatusesView_pullRequest$key = {
  +$data?: prStatusesView_pullRequest$data,
  +$fragmentRefs: prStatusesView_pullRequest$ref,
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
  },
      v1 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "state",
    "args": null,
    "storageKey": null
  };
  return {
    "kind": "Fragment",
    "name": "prStatusesView_pullRequest",
    "type": "PullRequest",
    "metadata": null,
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
      "alias": "recentCommits",
      "name": "commits",
      "storageKey": "commits(last:1)",
      "args": [{
        "kind": "Literal",
        "name": "last",
        "value": 1
      }],
      "concreteType": "PullRequestCommitConnection",
      "plural": false,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "edges",
        "storageKey": null,
        "args": null,
        "concreteType": "PullRequestCommitEdge",
        "plural": true,
        "selections": [{
          "kind": "LinkedField",
          "alias": null,
          "name": "node",
          "storageKey": null,
          "args": null,
          "concreteType": "PullRequestCommit",
          "plural": false,
          "selections": [{
            "kind": "LinkedField",
            "alias": null,
            "name": "commit",
            "storageKey": null,
            "args": null,
            "concreteType": "Commit",
            "plural": false,
            "selections": [{
              "kind": "LinkedField",
              "alias": null,
              "name": "status",
              "storageKey": null,
              "args": null,
              "concreteType": "Status",
              "plural": false,
              "selections": [v1
              /*: any*/
              , {
                "kind": "LinkedField",
                "alias": null,
                "name": "contexts",
                "storageKey": null,
                "args": null,
                "concreteType": "StatusContext",
                "plural": true,
                "selections": [v0
                /*: any*/
                , v1
                /*: any*/
                , {
                  "kind": "FragmentSpread",
                  "name": "prStatusContextView_context",
                  "args": null
                }]
              }]
            }, {
              "kind": "FragmentSpread",
              "name": "checkSuitesAccumulator_commit",
              "args": [{
                "kind": "Variable",
                "name": "checkRunCount",
                "variableName": "checkRunCount"
              }, {
                "kind": "Variable",
                "name": "checkRunCursor",
                "variableName": "checkRunCursor"
              }, {
                "kind": "Variable",
                "name": "checkSuiteCount",
                "variableName": "checkSuiteCount"
              }, {
                "kind": "Variable",
                "name": "checkSuiteCursor",
                "variableName": "checkSuiteCursor"
              }]
            }]
          }]
        }]
      }]
    }]
  };
}(); // prettier-ignore


node
/*: any*/
.hash = 'e21e2ef5e505a4a8e895bf13cb4202ab';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi92aWV3cy9fX2dlbmVyYXRlZF9fL3ByU3RhdHVzZXNWaWV3X3B1bGxSZXF1ZXN0LmdyYXBocWwuanMiXSwibmFtZXMiOlsibm9kZSIsInYwIiwidjEiLCJoYXNoIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOztBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUdBLE1BQU1BO0FBQUk7QUFBQSxFQUF3QixZQUFVO0FBQzVDLE1BQUlDLEVBQUUsR0FBRztBQUNQLFlBQVEsYUFERDtBQUVQLGFBQVMsSUFGRjtBQUdQLFlBQVEsSUFIRDtBQUlQLFlBQVEsSUFKRDtBQUtQLGtCQUFjO0FBTFAsR0FBVDtBQUFBLE1BT0FDLEVBQUUsR0FBRztBQUNILFlBQVEsYUFETDtBQUVILGFBQVMsSUFGTjtBQUdILFlBQVEsT0FITDtBQUlILFlBQVEsSUFKTDtBQUtILGtCQUFjO0FBTFgsR0FQTDtBQWNBLFNBQU87QUFDTCxZQUFRLFVBREg7QUFFTCxZQUFRLDRCQUZIO0FBR0wsWUFBUSxhQUhIO0FBSUwsZ0JBQVksSUFKUDtBQUtMLDJCQUF1QixDQUNyQjtBQUNFLGNBQVEsZUFEVjtBQUVFLGNBQVEsaUJBRlY7QUFHRSxjQUFRLE1BSFY7QUFJRSxzQkFBZ0I7QUFKbEIsS0FEcUIsRUFPckI7QUFDRSxjQUFRLGVBRFY7QUFFRSxjQUFRLGtCQUZWO0FBR0UsY0FBUSxRQUhWO0FBSUUsc0JBQWdCO0FBSmxCLEtBUHFCLEVBYXJCO0FBQ0UsY0FBUSxlQURWO0FBRUUsY0FBUSxlQUZWO0FBR0UsY0FBUSxNQUhWO0FBSUUsc0JBQWdCO0FBSmxCLEtBYnFCLEVBbUJyQjtBQUNFLGNBQVEsZUFEVjtBQUVFLGNBQVEsZ0JBRlY7QUFHRSxjQUFRLFFBSFY7QUFJRSxzQkFBZ0I7QUFKbEIsS0FuQnFCLENBTGxCO0FBK0JMLGtCQUFjLENBQ1hEO0FBQUU7QUFEUyxNQUVaO0FBQ0UsY0FBUSxhQURWO0FBRUUsZUFBUyxlQUZYO0FBR0UsY0FBUSxTQUhWO0FBSUUsb0JBQWMsaUJBSmhCO0FBS0UsY0FBUSxDQUNOO0FBQ0UsZ0JBQVEsU0FEVjtBQUVFLGdCQUFRLE1BRlY7QUFHRSxpQkFBUztBQUhYLE9BRE0sQ0FMVjtBQVlFLHNCQUFnQiw2QkFabEI7QUFhRSxnQkFBVSxLQWJaO0FBY0Usb0JBQWMsQ0FDWjtBQUNFLGdCQUFRLGFBRFY7QUFFRSxpQkFBUyxJQUZYO0FBR0UsZ0JBQVEsT0FIVjtBQUlFLHNCQUFjLElBSmhCO0FBS0UsZ0JBQVEsSUFMVjtBQU1FLHdCQUFnQix1QkFObEI7QUFPRSxrQkFBVSxJQVBaO0FBUUUsc0JBQWMsQ0FDWjtBQUNFLGtCQUFRLGFBRFY7QUFFRSxtQkFBUyxJQUZYO0FBR0Usa0JBQVEsTUFIVjtBQUlFLHdCQUFjLElBSmhCO0FBS0Usa0JBQVEsSUFMVjtBQU1FLDBCQUFnQixtQkFObEI7QUFPRSxvQkFBVSxLQVBaO0FBUUUsd0JBQWMsQ0FDWjtBQUNFLG9CQUFRLGFBRFY7QUFFRSxxQkFBUyxJQUZYO0FBR0Usb0JBQVEsUUFIVjtBQUlFLDBCQUFjLElBSmhCO0FBS0Usb0JBQVEsSUFMVjtBQU1FLDRCQUFnQixRQU5sQjtBQU9FLHNCQUFVLEtBUFo7QUFRRSwwQkFBYyxDQUNaO0FBQ0Usc0JBQVEsYUFEVjtBQUVFLHVCQUFTLElBRlg7QUFHRSxzQkFBUSxRQUhWO0FBSUUsNEJBQWMsSUFKaEI7QUFLRSxzQkFBUSxJQUxWO0FBTUUsOEJBQWdCLFFBTmxCO0FBT0Usd0JBQVUsS0FQWjtBQVFFLDRCQUFjLENBQ1hDO0FBQUU7QUFEUyxnQkFFWjtBQUNFLHdCQUFRLGFBRFY7QUFFRSx5QkFBUyxJQUZYO0FBR0Usd0JBQVEsVUFIVjtBQUlFLDhCQUFjLElBSmhCO0FBS0Usd0JBQVEsSUFMVjtBQU1FLGdDQUFnQixlQU5sQjtBQU9FLDBCQUFVLElBUFo7QUFRRSw4QkFBYyxDQUNYRDtBQUFFO0FBRFMsa0JBRVhDO0FBQUU7QUFGUyxrQkFHWjtBQUNFLDBCQUFRLGdCQURWO0FBRUUsMEJBQVEsNkJBRlY7QUFHRSwwQkFBUTtBQUhWLGlCQUhZO0FBUmhCLGVBRlk7QUFSaEIsYUFEWSxFQStCWjtBQUNFLHNCQUFRLGdCQURWO0FBRUUsc0JBQVEsK0JBRlY7QUFHRSxzQkFBUSxDQUNOO0FBQ0Usd0JBQVEsVUFEVjtBQUVFLHdCQUFRLGVBRlY7QUFHRSxnQ0FBZ0I7QUFIbEIsZUFETSxFQU1OO0FBQ0Usd0JBQVEsVUFEVjtBQUVFLHdCQUFRLGdCQUZWO0FBR0UsZ0NBQWdCO0FBSGxCLGVBTk0sRUFXTjtBQUNFLHdCQUFRLFVBRFY7QUFFRSx3QkFBUSxpQkFGVjtBQUdFLGdDQUFnQjtBQUhsQixlQVhNLEVBZ0JOO0FBQ0Usd0JBQVEsVUFEVjtBQUVFLHdCQUFRLGtCQUZWO0FBR0UsZ0NBQWdCO0FBSGxCLGVBaEJNO0FBSFYsYUEvQlk7QUFSaEIsV0FEWTtBQVJoQixTQURZO0FBUmhCLE9BRFk7QUFkaEIsS0FGWTtBQS9CVCxHQUFQO0FBNklDLENBNUpnQyxFQUFqQyxDLENBNkpBOzs7QUFDQ0Y7QUFBSTtBQUFMLENBQWdCRyxJQUFoQixHQUF1QixrQ0FBdkI7QUFDQUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCTCxJQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZsb3dcbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qOjpcbmltcG9ydCB0eXBlIHsgUmVhZGVyRnJhZ21lbnQgfSBmcm9tICdyZWxheS1ydW50aW1lJztcbnR5cGUgY2hlY2tTdWl0ZXNBY2N1bXVsYXRvcl9jb21taXQkcmVmID0gYW55O1xudHlwZSBwclN0YXR1c0NvbnRleHRWaWV3X2NvbnRleHQkcmVmID0gYW55O1xuZXhwb3J0IHR5cGUgU3RhdHVzU3RhdGUgPSBcIkVSUk9SXCIgfCBcIkVYUEVDVEVEXCIgfCBcIkZBSUxVUkVcIiB8IFwiUEVORElOR1wiIHwgXCJTVUNDRVNTXCIgfCBcIiVmdXR1cmUgYWRkZWQgdmFsdWVcIjtcbmltcG9ydCB0eXBlIHsgRnJhZ21lbnRSZWZlcmVuY2UgfSBmcm9tIFwicmVsYXktcnVudGltZVwiO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgcHJTdGF0dXNlc1ZpZXdfcHVsbFJlcXVlc3QkcmVmOiBGcmFnbWVudFJlZmVyZW5jZTtcbmRlY2xhcmUgZXhwb3J0IG9wYXF1ZSB0eXBlIHByU3RhdHVzZXNWaWV3X3B1bGxSZXF1ZXN0JGZyYWdtZW50VHlwZTogcHJTdGF0dXNlc1ZpZXdfcHVsbFJlcXVlc3QkcmVmO1xuZXhwb3J0IHR5cGUgcHJTdGF0dXNlc1ZpZXdfcHVsbFJlcXVlc3QgPSB7fFxuICAraWQ6IHN0cmluZyxcbiAgK3JlY2VudENvbW1pdHM6IHt8XG4gICAgK2VkZ2VzOiA/JFJlYWRPbmx5QXJyYXk8P3t8XG4gICAgICArbm9kZTogP3t8XG4gICAgICAgICtjb21taXQ6IHt8XG4gICAgICAgICAgK3N0YXR1czogP3t8XG4gICAgICAgICAgICArc3RhdGU6IFN0YXR1c1N0YXRlLFxuICAgICAgICAgICAgK2NvbnRleHRzOiAkUmVhZE9ubHlBcnJheTx7fFxuICAgICAgICAgICAgICAraWQ6IHN0cmluZyxcbiAgICAgICAgICAgICAgK3N0YXRlOiBTdGF0dXNTdGF0ZSxcbiAgICAgICAgICAgICAgKyRmcmFnbWVudFJlZnM6IHByU3RhdHVzQ29udGV4dFZpZXdfY29udGV4dCRyZWYsXG4gICAgICAgICAgICB8fT4sXG4gICAgICAgICAgfH0sXG4gICAgICAgICAgKyRmcmFnbWVudFJlZnM6IGNoZWNrU3VpdGVzQWNjdW11bGF0b3JfY29tbWl0JHJlZixcbiAgICAgICAgfH1cbiAgICAgIHx9XG4gICAgfH0+XG4gIHx9LFxuICArJHJlZlR5cGU6IHByU3RhdHVzZXNWaWV3X3B1bGxSZXF1ZXN0JHJlZixcbnx9O1xuZXhwb3J0IHR5cGUgcHJTdGF0dXNlc1ZpZXdfcHVsbFJlcXVlc3QkZGF0YSA9IHByU3RhdHVzZXNWaWV3X3B1bGxSZXF1ZXN0O1xuZXhwb3J0IHR5cGUgcHJTdGF0dXNlc1ZpZXdfcHVsbFJlcXVlc3Qka2V5ID0ge1xuICArJGRhdGE/OiBwclN0YXR1c2VzVmlld19wdWxsUmVxdWVzdCRkYXRhLFxuICArJGZyYWdtZW50UmVmczogcHJTdGF0dXNlc1ZpZXdfcHVsbFJlcXVlc3QkcmVmLFxufTtcbiovXG5cblxuY29uc3Qgbm9kZS8qOiBSZWFkZXJGcmFnbWVudCovID0gKGZ1bmN0aW9uKCl7XG52YXIgdjAgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiaWRcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjEgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwic3RhdGVcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59O1xucmV0dXJuIHtcbiAgXCJraW5kXCI6IFwiRnJhZ21lbnRcIixcbiAgXCJuYW1lXCI6IFwicHJTdGF0dXNlc1ZpZXdfcHVsbFJlcXVlc3RcIixcbiAgXCJ0eXBlXCI6IFwiUHVsbFJlcXVlc3RcIixcbiAgXCJtZXRhZGF0YVwiOiBudWxsLFxuICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogW1xuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICAgIFwibmFtZVwiOiBcImNoZWNrU3VpdGVDb3VudFwiLFxuICAgICAgXCJ0eXBlXCI6IFwiSW50IVwiLFxuICAgICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgICAgXCJuYW1lXCI6IFwiY2hlY2tTdWl0ZUN1cnNvclwiLFxuICAgICAgXCJ0eXBlXCI6IFwiU3RyaW5nXCIsXG4gICAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgICBcIm5hbWVcIjogXCJjaGVja1J1bkNvdW50XCIsXG4gICAgICBcInR5cGVcIjogXCJJbnQhXCIsXG4gICAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgICBcIm5hbWVcIjogXCJjaGVja1J1bkN1cnNvclwiLFxuICAgICAgXCJ0eXBlXCI6IFwiU3RyaW5nXCIsXG4gICAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gICAgfVxuICBdLFxuICBcInNlbGVjdGlvbnNcIjogW1xuICAgICh2MC8qOiBhbnkqLyksXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogXCJyZWNlbnRDb21taXRzXCIsXG4gICAgICBcIm5hbWVcIjogXCJjb21taXRzXCIsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogXCJjb21taXRzKGxhc3Q6MSlcIixcbiAgICAgIFwiYXJnc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImtpbmRcIjogXCJMaXRlcmFsXCIsXG4gICAgICAgICAgXCJuYW1lXCI6IFwibGFzdFwiLFxuICAgICAgICAgIFwidmFsdWVcIjogMVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJQdWxsUmVxdWVzdENvbW1pdENvbm5lY3Rpb25cIixcbiAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgIFwibmFtZVwiOiBcImVkZ2VzXCIsXG4gICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJQdWxsUmVxdWVzdENvbW1pdEVkZ2VcIixcbiAgICAgICAgICBcInBsdXJhbFwiOiB0cnVlLFxuICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibm9kZVwiLFxuICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUHVsbFJlcXVlc3RDb21taXRcIixcbiAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbW1pdFwiLFxuICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiQ29tbWl0XCIsXG4gICAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJzdGF0dXNcIixcbiAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlN0YXR1c1wiLFxuICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAodjEvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbnRleHRzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJTdGF0dXNDb250ZXh0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKHYwLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjEvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkZyYWdtZW50U3ByZWFkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJwclN0YXR1c0NvbnRleHRWaWV3X2NvbnRleHRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiRnJhZ21lbnRTcHJlYWRcIixcbiAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjaGVja1N1aXRlc0FjY3VtdWxhdG9yX2NvbW1pdFwiLFxuICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNoZWNrUnVuQ291bnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJjaGVja1J1bkNvdW50XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNoZWNrUnVuQ3Vyc29yXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwidmFyaWFibGVOYW1lXCI6IFwiY2hlY2tSdW5DdXJzb3JcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY2hlY2tTdWl0ZUNvdW50XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwidmFyaWFibGVOYW1lXCI6IFwiY2hlY2tTdWl0ZUNvdW50XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImNoZWNrU3VpdGVDdXJzb3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJjaGVja1N1aXRlQ3Vyc29yXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIF1cbn07XG59KSgpO1xuLy8gcHJldHRpZXItaWdub3JlXG4obm9kZS8qOiBhbnkqLykuaGFzaCA9ICdlMjFlMmVmNWU1MDVhNGE4ZTg5NWJmMTNjYjQyMDJhYic7XG5tb2R1bGUuZXhwb3J0cyA9IG5vZGU7XG4iXX0=