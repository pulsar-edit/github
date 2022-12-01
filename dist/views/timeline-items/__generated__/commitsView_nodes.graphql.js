/**
 * @flow
 */

/* eslint-disable */
'use strict';
/*::
import type { ReaderFragment } from 'relay-runtime';
type commitView_commit$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type commitsView_nodes$ref: FragmentReference;
declare export opaque type commitsView_nodes$fragmentType: commitsView_nodes$ref;
export type commitsView_nodes = $ReadOnlyArray<{|
  +commit: {|
    +id: string,
    +author: ?{|
      +name: ?string,
      +user: ?{|
        +login: string
      |},
    |},
    +$fragmentRefs: commitView_commit$ref,
  |},
  +$refType: commitsView_nodes$ref,
|}>;
export type commitsView_nodes$data = commitsView_nodes;
export type commitsView_nodes$key = $ReadOnlyArray<{
  +$data?: commitsView_nodes$data,
  +$fragmentRefs: commitsView_nodes$ref,
}>;
*/

const node
/*: ReaderFragment*/
= {
  "kind": "Fragment",
  "name": "commitsView_nodes",
  "type": "PullRequestCommit",
  "metadata": {
    "plural": true
  },
  "argumentDefinitions": [],
  "selections": [{
    "kind": "LinkedField",
    "alias": null,
    "name": "commit",
    "storageKey": null,
    "args": null,
    "concreteType": "Commit",
    "plural": false,
    "selections": [{
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    }, {
      "kind": "LinkedField",
      "alias": null,
      "name": "author",
      "storageKey": null,
      "args": null,
      "concreteType": "GitActor",
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
        "name": "user",
        "storageKey": null,
        "args": null,
        "concreteType": "User",
        "plural": false,
        "selections": [{
          "kind": "ScalarField",
          "alias": null,
          "name": "login",
          "args": null,
          "storageKey": null
        }]
      }]
    }, {
      "kind": "FragmentSpread",
      "name": "commitView_commit",
      "args": null
    }]
  }]
}; // prettier-ignore

node
/*: any*/
.hash = '5b2734f1e64af2ad2c9803201a0082f3';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi92aWV3cy90aW1lbGluZS1pdGVtcy9fX2dlbmVyYXRlZF9fL2NvbW1pdHNWaWV3X25vZGVzLmdyYXBocWwuanMiXSwibmFtZXMiOlsibm9kZSIsImhhc2giLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUdBLE1BQU1BO0FBQUk7QUFBQSxFQUF1QjtBQUMvQixVQUFRLFVBRHVCO0FBRS9CLFVBQVEsbUJBRnVCO0FBRy9CLFVBQVEsbUJBSHVCO0FBSS9CLGNBQVk7QUFDVixjQUFVO0FBREEsR0FKbUI7QUFPL0IseUJBQXVCLEVBUFE7QUFRL0IsZ0JBQWMsQ0FDWjtBQUNFLFlBQVEsYUFEVjtBQUVFLGFBQVMsSUFGWDtBQUdFLFlBQVEsUUFIVjtBQUlFLGtCQUFjLElBSmhCO0FBS0UsWUFBUSxJQUxWO0FBTUUsb0JBQWdCLFFBTmxCO0FBT0UsY0FBVSxLQVBaO0FBUUUsa0JBQWMsQ0FDWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsSUFGWDtBQUdFLGNBQVEsSUFIVjtBQUlFLGNBQVEsSUFKVjtBQUtFLG9CQUFjO0FBTGhCLEtBRFksRUFRWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsSUFGWDtBQUdFLGNBQVEsUUFIVjtBQUlFLG9CQUFjLElBSmhCO0FBS0UsY0FBUSxJQUxWO0FBTUUsc0JBQWdCLFVBTmxCO0FBT0UsZ0JBQVUsS0FQWjtBQVFFLG9CQUFjLENBQ1o7QUFDRSxnQkFBUSxhQURWO0FBRUUsaUJBQVMsSUFGWDtBQUdFLGdCQUFRLE1BSFY7QUFJRSxnQkFBUSxJQUpWO0FBS0Usc0JBQWM7QUFMaEIsT0FEWSxFQVFaO0FBQ0UsZ0JBQVEsYUFEVjtBQUVFLGlCQUFTLElBRlg7QUFHRSxnQkFBUSxNQUhWO0FBSUUsc0JBQWMsSUFKaEI7QUFLRSxnQkFBUSxJQUxWO0FBTUUsd0JBQWdCLE1BTmxCO0FBT0Usa0JBQVUsS0FQWjtBQVFFLHNCQUFjLENBQ1o7QUFDRSxrQkFBUSxhQURWO0FBRUUsbUJBQVMsSUFGWDtBQUdFLGtCQUFRLE9BSFY7QUFJRSxrQkFBUSxJQUpWO0FBS0Usd0JBQWM7QUFMaEIsU0FEWTtBQVJoQixPQVJZO0FBUmhCLEtBUlksRUE0Q1o7QUFDRSxjQUFRLGdCQURWO0FBRUUsY0FBUSxtQkFGVjtBQUdFLGNBQVE7QUFIVixLQTVDWTtBQVJoQixHQURZO0FBUmlCLENBQWpDLEMsQ0FzRUE7O0FBQ0NBO0FBQUk7QUFBTCxDQUFnQkMsSUFBaEIsR0FBdUIsa0NBQXZCO0FBQ0FDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQkgsSUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmbG93XG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKjo6XG5pbXBvcnQgdHlwZSB7IFJlYWRlckZyYWdtZW50IH0gZnJvbSAncmVsYXktcnVudGltZSc7XG50eXBlIGNvbW1pdFZpZXdfY29tbWl0JHJlZiA9IGFueTtcbmltcG9ydCB0eXBlIHsgRnJhZ21lbnRSZWZlcmVuY2UgfSBmcm9tIFwicmVsYXktcnVudGltZVwiO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgY29tbWl0c1ZpZXdfbm9kZXMkcmVmOiBGcmFnbWVudFJlZmVyZW5jZTtcbmRlY2xhcmUgZXhwb3J0IG9wYXF1ZSB0eXBlIGNvbW1pdHNWaWV3X25vZGVzJGZyYWdtZW50VHlwZTogY29tbWl0c1ZpZXdfbm9kZXMkcmVmO1xuZXhwb3J0IHR5cGUgY29tbWl0c1ZpZXdfbm9kZXMgPSAkUmVhZE9ubHlBcnJheTx7fFxuICArY29tbWl0OiB7fFxuICAgICtpZDogc3RyaW5nLFxuICAgICthdXRob3I6ID97fFxuICAgICAgK25hbWU6ID9zdHJpbmcsXG4gICAgICArdXNlcjogP3t8XG4gICAgICAgICtsb2dpbjogc3RyaW5nXG4gICAgICB8fSxcbiAgICB8fSxcbiAgICArJGZyYWdtZW50UmVmczogY29tbWl0Vmlld19jb21taXQkcmVmLFxuICB8fSxcbiAgKyRyZWZUeXBlOiBjb21taXRzVmlld19ub2RlcyRyZWYsXG58fT47XG5leHBvcnQgdHlwZSBjb21taXRzVmlld19ub2RlcyRkYXRhID0gY29tbWl0c1ZpZXdfbm9kZXM7XG5leHBvcnQgdHlwZSBjb21taXRzVmlld19ub2RlcyRrZXkgPSAkUmVhZE9ubHlBcnJheTx7XG4gICskZGF0YT86IGNvbW1pdHNWaWV3X25vZGVzJGRhdGEsXG4gICskZnJhZ21lbnRSZWZzOiBjb21taXRzVmlld19ub2RlcyRyZWYsXG59PjtcbiovXG5cblxuY29uc3Qgbm9kZS8qOiBSZWFkZXJGcmFnbWVudCovID0ge1xuICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICBcIm5hbWVcIjogXCJjb21taXRzVmlld19ub2Rlc1wiLFxuICBcInR5cGVcIjogXCJQdWxsUmVxdWVzdENvbW1pdFwiLFxuICBcIm1ldGFkYXRhXCI6IHtcbiAgICBcInBsdXJhbFwiOiB0cnVlXG4gIH0sXG4gIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiBbXSxcbiAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwiY29tbWl0XCIsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJDb21taXRcIixcbiAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgIFwibmFtZVwiOiBcImlkXCIsXG4gICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgIFwibmFtZVwiOiBcImF1dGhvclwiLFxuICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiR2l0QWN0b3JcIixcbiAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcIm5hbWVcIixcbiAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcInVzZXJcIixcbiAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlVzZXJcIixcbiAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImxvZ2luXCIsXG4gICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJraW5kXCI6IFwiRnJhZ21lbnRTcHJlYWRcIixcbiAgICAgICAgICBcIm5hbWVcIjogXCJjb21taXRWaWV3X2NvbW1pdFwiLFxuICAgICAgICAgIFwiYXJnc1wiOiBudWxsXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIF1cbn07XG4vLyBwcmV0dGllci1pZ25vcmVcbihub2RlLyo6IGFueSovKS5oYXNoID0gJzViMjczNGYxZTY0YWYyYWQyYzk4MDMyMDFhMDA4MmYzJztcbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcbiJdfQ==