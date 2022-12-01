/**
 * @flow
 */

/* eslint-disable */
'use strict';
/*::
import type { ReaderFragment } from 'relay-runtime';
type prCommitView_item$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type prCommitsView_pullRequest$ref: FragmentReference;
declare export opaque type prCommitsView_pullRequest$fragmentType: prCommitsView_pullRequest$ref;
export type prCommitsView_pullRequest = {|
  +url: any,
  +commits: {|
    +pageInfo: {|
      +endCursor: ?string,
      +hasNextPage: boolean,
    |},
    +edges: ?$ReadOnlyArray<?{|
      +cursor: string,
      +node: ?{|
        +commit: {|
          +id: string,
          +$fragmentRefs: prCommitView_item$ref,
        |}
      |},
    |}>,
  |},
  +$refType: prCommitsView_pullRequest$ref,
|};
export type prCommitsView_pullRequest$data = prCommitsView_pullRequest;
export type prCommitsView_pullRequest$key = {
  +$data?: prCommitsView_pullRequest$data,
  +$fragmentRefs: prCommitsView_pullRequest$ref,
};
*/

const node
/*: ReaderFragment*/
= {
  "kind": "Fragment",
  "name": "prCommitsView_pullRequest",
  "type": "PullRequest",
  "metadata": {
    "connection": [{
      "count": "commitCount",
      "cursor": "commitCursor",
      "direction": "forward",
      "path": ["commits"]
    }]
  },
  "argumentDefinitions": [{
    "kind": "LocalArgument",
    "name": "commitCount",
    "type": "Int!",
    "defaultValue": 100
  }, {
    "kind": "LocalArgument",
    "name": "commitCursor",
    "type": "String",
    "defaultValue": null
  }],
  "selections": [{
    "kind": "ScalarField",
    "alias": null,
    "name": "url",
    "args": null,
    "storageKey": null
  }, {
    "kind": "LinkedField",
    "alias": "commits",
    "name": "__prCommitsView_commits_connection",
    "storageKey": null,
    "args": null,
    "concreteType": "PullRequestCommitConnection",
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
        "name": "endCursor",
        "args": null,
        "storageKey": null
      }, {
        "kind": "ScalarField",
        "alias": null,
        "name": "hasNextPage",
        "args": null,
        "storageKey": null
      }]
    }, {
      "kind": "LinkedField",
      "alias": null,
      "name": "edges",
      "storageKey": null,
      "args": null,
      "concreteType": "PullRequestCommitEdge",
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
            "kind": "ScalarField",
            "alias": null,
            "name": "id",
            "args": null,
            "storageKey": null
          }, {
            "kind": "FragmentSpread",
            "name": "prCommitView_item",
            "args": null
          }]
        }, {
          "kind": "ScalarField",
          "alias": null,
          "name": "__typename",
          "args": null,
          "storageKey": null
        }]
      }]
    }]
  }]
}; // prettier-ignore

node
/*: any*/
.hash = '4945c525c20aac5e24befbe8b217c2c9';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi92aWV3cy9fX2dlbmVyYXRlZF9fL3ByQ29tbWl0c1ZpZXdfcHVsbFJlcXVlc3QuZ3JhcGhxbC5qcyJdLCJuYW1lcyI6WyJub2RlIiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0EsTUFBTUE7QUFBSTtBQUFBLEVBQXVCO0FBQy9CLFVBQVEsVUFEdUI7QUFFL0IsVUFBUSwyQkFGdUI7QUFHL0IsVUFBUSxhQUh1QjtBQUkvQixjQUFZO0FBQ1Ysa0JBQWMsQ0FDWjtBQUNFLGVBQVMsYUFEWDtBQUVFLGdCQUFVLGNBRlo7QUFHRSxtQkFBYSxTQUhmO0FBSUUsY0FBUSxDQUNOLFNBRE07QUFKVixLQURZO0FBREosR0FKbUI7QUFnQi9CLHlCQUF1QixDQUNyQjtBQUNFLFlBQVEsZUFEVjtBQUVFLFlBQVEsYUFGVjtBQUdFLFlBQVEsTUFIVjtBQUlFLG9CQUFnQjtBQUpsQixHQURxQixFQU9yQjtBQUNFLFlBQVEsZUFEVjtBQUVFLFlBQVEsY0FGVjtBQUdFLFlBQVEsUUFIVjtBQUlFLG9CQUFnQjtBQUpsQixHQVBxQixDQWhCUTtBQThCL0IsZ0JBQWMsQ0FDWjtBQUNFLFlBQVEsYUFEVjtBQUVFLGFBQVMsSUFGWDtBQUdFLFlBQVEsS0FIVjtBQUlFLFlBQVEsSUFKVjtBQUtFLGtCQUFjO0FBTGhCLEdBRFksRUFRWjtBQUNFLFlBQVEsYUFEVjtBQUVFLGFBQVMsU0FGWDtBQUdFLFlBQVEsb0NBSFY7QUFJRSxrQkFBYyxJQUpoQjtBQUtFLFlBQVEsSUFMVjtBQU1FLG9CQUFnQiw2QkFObEI7QUFPRSxjQUFVLEtBUFo7QUFRRSxrQkFBYyxDQUNaO0FBQ0UsY0FBUSxhQURWO0FBRUUsZUFBUyxJQUZYO0FBR0UsY0FBUSxVQUhWO0FBSUUsb0JBQWMsSUFKaEI7QUFLRSxjQUFRLElBTFY7QUFNRSxzQkFBZ0IsVUFObEI7QUFPRSxnQkFBVSxLQVBaO0FBUUUsb0JBQWMsQ0FDWjtBQUNFLGdCQUFRLGFBRFY7QUFFRSxpQkFBUyxJQUZYO0FBR0UsZ0JBQVEsV0FIVjtBQUlFLGdCQUFRLElBSlY7QUFLRSxzQkFBYztBQUxoQixPQURZLEVBUVo7QUFDRSxnQkFBUSxhQURWO0FBRUUsaUJBQVMsSUFGWDtBQUdFLGdCQUFRLGFBSFY7QUFJRSxnQkFBUSxJQUpWO0FBS0Usc0JBQWM7QUFMaEIsT0FSWTtBQVJoQixLQURZLEVBMEJaO0FBQ0UsY0FBUSxhQURWO0FBRUUsZUFBUyxJQUZYO0FBR0UsY0FBUSxPQUhWO0FBSUUsb0JBQWMsSUFKaEI7QUFLRSxjQUFRLElBTFY7QUFNRSxzQkFBZ0IsdUJBTmxCO0FBT0UsZ0JBQVUsSUFQWjtBQVFFLG9CQUFjLENBQ1o7QUFDRSxnQkFBUSxhQURWO0FBRUUsaUJBQVMsSUFGWDtBQUdFLGdCQUFRLFFBSFY7QUFJRSxnQkFBUSxJQUpWO0FBS0Usc0JBQWM7QUFMaEIsT0FEWSxFQVFaO0FBQ0UsZ0JBQVEsYUFEVjtBQUVFLGlCQUFTLElBRlg7QUFHRSxnQkFBUSxNQUhWO0FBSUUsc0JBQWMsSUFKaEI7QUFLRSxnQkFBUSxJQUxWO0FBTUUsd0JBQWdCLG1CQU5sQjtBQU9FLGtCQUFVLEtBUFo7QUFRRSxzQkFBYyxDQUNaO0FBQ0Usa0JBQVEsYUFEVjtBQUVFLG1CQUFTLElBRlg7QUFHRSxrQkFBUSxRQUhWO0FBSUUsd0JBQWMsSUFKaEI7QUFLRSxrQkFBUSxJQUxWO0FBTUUsMEJBQWdCLFFBTmxCO0FBT0Usb0JBQVUsS0FQWjtBQVFFLHdCQUFjLENBQ1o7QUFDRSxvQkFBUSxhQURWO0FBRUUscUJBQVMsSUFGWDtBQUdFLG9CQUFRLElBSFY7QUFJRSxvQkFBUSxJQUpWO0FBS0UsMEJBQWM7QUFMaEIsV0FEWSxFQVFaO0FBQ0Usb0JBQVEsZ0JBRFY7QUFFRSxvQkFBUSxtQkFGVjtBQUdFLG9CQUFRO0FBSFYsV0FSWTtBQVJoQixTQURZLEVBd0JaO0FBQ0Usa0JBQVEsYUFEVjtBQUVFLG1CQUFTLElBRlg7QUFHRSxrQkFBUSxZQUhWO0FBSUUsa0JBQVEsSUFKVjtBQUtFLHdCQUFjO0FBTGhCLFNBeEJZO0FBUmhCLE9BUlk7QUFSaEIsS0ExQlk7QUFSaEIsR0FSWTtBQTlCaUIsQ0FBakMsQyxDQXVJQTs7QUFDQ0E7QUFBSTtBQUFMLENBQWdCQyxJQUFoQixHQUF1QixrQ0FBdkI7QUFDQUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCSCxJQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZsb3dcbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qOjpcbmltcG9ydCB0eXBlIHsgUmVhZGVyRnJhZ21lbnQgfSBmcm9tICdyZWxheS1ydW50aW1lJztcbnR5cGUgcHJDb21taXRWaWV3X2l0ZW0kcmVmID0gYW55O1xuaW1wb3J0IHR5cGUgeyBGcmFnbWVudFJlZmVyZW5jZSB9IGZyb20gXCJyZWxheS1ydW50aW1lXCI7XG5kZWNsYXJlIGV4cG9ydCBvcGFxdWUgdHlwZSBwckNvbW1pdHNWaWV3X3B1bGxSZXF1ZXN0JHJlZjogRnJhZ21lbnRSZWZlcmVuY2U7XG5kZWNsYXJlIGV4cG9ydCBvcGFxdWUgdHlwZSBwckNvbW1pdHNWaWV3X3B1bGxSZXF1ZXN0JGZyYWdtZW50VHlwZTogcHJDb21taXRzVmlld19wdWxsUmVxdWVzdCRyZWY7XG5leHBvcnQgdHlwZSBwckNvbW1pdHNWaWV3X3B1bGxSZXF1ZXN0ID0ge3xcbiAgK3VybDogYW55LFxuICArY29tbWl0czoge3xcbiAgICArcGFnZUluZm86IHt8XG4gICAgICArZW5kQ3Vyc29yOiA/c3RyaW5nLFxuICAgICAgK2hhc05leHRQYWdlOiBib29sZWFuLFxuICAgIHx9LFxuICAgICtlZGdlczogPyRSZWFkT25seUFycmF5PD97fFxuICAgICAgK2N1cnNvcjogc3RyaW5nLFxuICAgICAgK25vZGU6ID97fFxuICAgICAgICArY29tbWl0OiB7fFxuICAgICAgICAgICtpZDogc3RyaW5nLFxuICAgICAgICAgICskZnJhZ21lbnRSZWZzOiBwckNvbW1pdFZpZXdfaXRlbSRyZWYsXG4gICAgICAgIHx9XG4gICAgICB8fSxcbiAgICB8fT4sXG4gIHx9LFxuICArJHJlZlR5cGU6IHByQ29tbWl0c1ZpZXdfcHVsbFJlcXVlc3QkcmVmLFxufH07XG5leHBvcnQgdHlwZSBwckNvbW1pdHNWaWV3X3B1bGxSZXF1ZXN0JGRhdGEgPSBwckNvbW1pdHNWaWV3X3B1bGxSZXF1ZXN0O1xuZXhwb3J0IHR5cGUgcHJDb21taXRzVmlld19wdWxsUmVxdWVzdCRrZXkgPSB7XG4gICskZGF0YT86IHByQ29tbWl0c1ZpZXdfcHVsbFJlcXVlc3QkZGF0YSxcbiAgKyRmcmFnbWVudFJlZnM6IHByQ29tbWl0c1ZpZXdfcHVsbFJlcXVlc3QkcmVmLFxufTtcbiovXG5cblxuY29uc3Qgbm9kZS8qOiBSZWFkZXJGcmFnbWVudCovID0ge1xuICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICBcIm5hbWVcIjogXCJwckNvbW1pdHNWaWV3X3B1bGxSZXF1ZXN0XCIsXG4gIFwidHlwZVwiOiBcIlB1bGxSZXF1ZXN0XCIsXG4gIFwibWV0YWRhdGFcIjoge1xuICAgIFwiY29ubmVjdGlvblwiOiBbXG4gICAgICB7XG4gICAgICAgIFwiY291bnRcIjogXCJjb21taXRDb3VudFwiLFxuICAgICAgICBcImN1cnNvclwiOiBcImNvbW1pdEN1cnNvclwiLFxuICAgICAgICBcImRpcmVjdGlvblwiOiBcImZvcndhcmRcIixcbiAgICAgICAgXCJwYXRoXCI6IFtcbiAgICAgICAgICBcImNvbW1pdHNcIlxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9LFxuICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogW1xuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICAgIFwibmFtZVwiOiBcImNvbW1pdENvdW50XCIsXG4gICAgICBcInR5cGVcIjogXCJJbnQhXCIsXG4gICAgICBcImRlZmF1bHRWYWx1ZVwiOiAxMDBcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICAgIFwibmFtZVwiOiBcImNvbW1pdEN1cnNvclwiLFxuICAgICAgXCJ0eXBlXCI6IFwiU3RyaW5nXCIsXG4gICAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gICAgfVxuICBdLFxuICBcInNlbGVjdGlvbnNcIjogW1xuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJ1cmxcIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IFwiY29tbWl0c1wiLFxuICAgICAgXCJuYW1lXCI6IFwiX19wckNvbW1pdHNWaWV3X2NvbW1pdHNfY29ubmVjdGlvblwiLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUHVsbFJlcXVlc3RDb21taXRDb25uZWN0aW9uXCIsXG4gICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICBcIm5hbWVcIjogXCJwYWdlSW5mb1wiLFxuICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUGFnZUluZm9cIixcbiAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImVuZEN1cnNvclwiLFxuICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaGFzTmV4dFBhZ2VcIixcbiAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgXCJuYW1lXCI6IFwiZWRnZXNcIixcbiAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlB1bGxSZXF1ZXN0Q29tbWl0RWRnZVwiLFxuICAgICAgICAgIFwicGx1cmFsXCI6IHRydWUsXG4gICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjdXJzb3JcIixcbiAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcIm5vZGVcIixcbiAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlB1bGxSZXF1ZXN0Q29tbWl0XCIsXG4gICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjb21taXRcIixcbiAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIkNvbW1pdFwiLFxuICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaWRcIixcbiAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiRnJhZ21lbnRTcHJlYWRcIixcbiAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJwckNvbW1pdFZpZXdfaXRlbVwiLFxuICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJfX3R5cGVuYW1lXCIsXG4gICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICBdXG59O1xuLy8gcHJldHRpZXItaWdub3JlXG4obm9kZS8qOiBhbnkqLykuaGFzaCA9ICc0OTQ1YzUyNWMyMGFhYzVlMjRiZWZiZThiMjE3YzJjOSc7XG5tb2R1bGUuZXhwb3J0cyA9IG5vZGU7XG4iXX0=