/**
 * @flow
 */

/* eslint-disable */
'use strict';
/*::
import type { ReaderFragment } from 'relay-runtime';
type commitCommentView_item$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type commitCommentThreadView_item$ref: FragmentReference;
declare export opaque type commitCommentThreadView_item$fragmentType: commitCommentThreadView_item$ref;
export type commitCommentThreadView_item = {|
  +commit: {|
    +oid: any
  |},
  +comments: {|
    +edges: ?$ReadOnlyArray<?{|
      +node: ?{|
        +id: string,
        +$fragmentRefs: commitCommentView_item$ref,
      |}
    |}>
  |},
  +$refType: commitCommentThreadView_item$ref,
|};
export type commitCommentThreadView_item$data = commitCommentThreadView_item;
export type commitCommentThreadView_item$key = {
  +$data?: commitCommentThreadView_item$data,
  +$fragmentRefs: commitCommentThreadView_item$ref,
};
*/

const node
/*: ReaderFragment*/
= {
  "kind": "Fragment",
  "name": "commitCommentThreadView_item",
  "type": "PullRequestCommitCommentThread",
  "metadata": null,
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
      "name": "oid",
      "args": null,
      "storageKey": null
    }]
  }, {
    "kind": "LinkedField",
    "alias": null,
    "name": "comments",
    "storageKey": "comments(first:100)",
    "args": [{
      "kind": "Literal",
      "name": "first",
      "value": 100
    }],
    "concreteType": "CommitCommentConnection",
    "plural": false,
    "selections": [{
      "kind": "LinkedField",
      "alias": null,
      "name": "edges",
      "storageKey": null,
      "args": null,
      "concreteType": "CommitCommentEdge",
      "plural": true,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "node",
        "storageKey": null,
        "args": null,
        "concreteType": "CommitComment",
        "plural": false,
        "selections": [{
          "kind": "ScalarField",
          "alias": null,
          "name": "id",
          "args": null,
          "storageKey": null
        }, {
          "kind": "FragmentSpread",
          "name": "commitCommentView_item",
          "args": null
        }]
      }]
    }]
  }]
}; // prettier-ignore

node
/*: any*/
.hash = '2f881b33df634a755a5d66b192c2791b';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi92aWV3cy90aW1lbGluZS1pdGVtcy9fX2dlbmVyYXRlZF9fL2NvbW1pdENvbW1lbnRUaHJlYWRWaWV3X2l0ZW0uZ3JhcGhxbC5qcyJdLCJuYW1lcyI6WyJub2RlIiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQSxNQUFNQTtBQUFJO0FBQUEsRUFBdUI7QUFDL0IsVUFBUSxVQUR1QjtBQUUvQixVQUFRLDhCQUZ1QjtBQUcvQixVQUFRLGdDQUh1QjtBQUkvQixjQUFZLElBSm1CO0FBSy9CLHlCQUF1QixFQUxRO0FBTS9CLGdCQUFjLENBQ1o7QUFDRSxZQUFRLGFBRFY7QUFFRSxhQUFTLElBRlg7QUFHRSxZQUFRLFFBSFY7QUFJRSxrQkFBYyxJQUpoQjtBQUtFLFlBQVEsSUFMVjtBQU1FLG9CQUFnQixRQU5sQjtBQU9FLGNBQVUsS0FQWjtBQVFFLGtCQUFjLENBQ1o7QUFDRSxjQUFRLGFBRFY7QUFFRSxlQUFTLElBRlg7QUFHRSxjQUFRLEtBSFY7QUFJRSxjQUFRLElBSlY7QUFLRSxvQkFBYztBQUxoQixLQURZO0FBUmhCLEdBRFksRUFtQlo7QUFDRSxZQUFRLGFBRFY7QUFFRSxhQUFTLElBRlg7QUFHRSxZQUFRLFVBSFY7QUFJRSxrQkFBYyxxQkFKaEI7QUFLRSxZQUFRLENBQ047QUFDRSxjQUFRLFNBRFY7QUFFRSxjQUFRLE9BRlY7QUFHRSxlQUFTO0FBSFgsS0FETSxDQUxWO0FBWUUsb0JBQWdCLHlCQVpsQjtBQWFFLGNBQVUsS0FiWjtBQWNFLGtCQUFjLENBQ1o7QUFDRSxjQUFRLGFBRFY7QUFFRSxlQUFTLElBRlg7QUFHRSxjQUFRLE9BSFY7QUFJRSxvQkFBYyxJQUpoQjtBQUtFLGNBQVEsSUFMVjtBQU1FLHNCQUFnQixtQkFObEI7QUFPRSxnQkFBVSxJQVBaO0FBUUUsb0JBQWMsQ0FDWjtBQUNFLGdCQUFRLGFBRFY7QUFFRSxpQkFBUyxJQUZYO0FBR0UsZ0JBQVEsTUFIVjtBQUlFLHNCQUFjLElBSmhCO0FBS0UsZ0JBQVEsSUFMVjtBQU1FLHdCQUFnQixlQU5sQjtBQU9FLGtCQUFVLEtBUFo7QUFRRSxzQkFBYyxDQUNaO0FBQ0Usa0JBQVEsYUFEVjtBQUVFLG1CQUFTLElBRlg7QUFHRSxrQkFBUSxJQUhWO0FBSUUsa0JBQVEsSUFKVjtBQUtFLHdCQUFjO0FBTGhCLFNBRFksRUFRWjtBQUNFLGtCQUFRLGdCQURWO0FBRUUsa0JBQVEsd0JBRlY7QUFHRSxrQkFBUTtBQUhWLFNBUlk7QUFSaEIsT0FEWTtBQVJoQixLQURZO0FBZGhCLEdBbkJZO0FBTmlCLENBQWpDLEMsQ0E4RUE7O0FBQ0NBO0FBQUk7QUFBTCxDQUFnQkMsSUFBaEIsR0FBdUIsa0NBQXZCO0FBQ0FDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQkgsSUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmbG93XG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKjo6XG5pbXBvcnQgdHlwZSB7IFJlYWRlckZyYWdtZW50IH0gZnJvbSAncmVsYXktcnVudGltZSc7XG50eXBlIGNvbW1pdENvbW1lbnRWaWV3X2l0ZW0kcmVmID0gYW55O1xuaW1wb3J0IHR5cGUgeyBGcmFnbWVudFJlZmVyZW5jZSB9IGZyb20gXCJyZWxheS1ydW50aW1lXCI7XG5kZWNsYXJlIGV4cG9ydCBvcGFxdWUgdHlwZSBjb21taXRDb21tZW50VGhyZWFkVmlld19pdGVtJHJlZjogRnJhZ21lbnRSZWZlcmVuY2U7XG5kZWNsYXJlIGV4cG9ydCBvcGFxdWUgdHlwZSBjb21taXRDb21tZW50VGhyZWFkVmlld19pdGVtJGZyYWdtZW50VHlwZTogY29tbWl0Q29tbWVudFRocmVhZFZpZXdfaXRlbSRyZWY7XG5leHBvcnQgdHlwZSBjb21taXRDb21tZW50VGhyZWFkVmlld19pdGVtID0ge3xcbiAgK2NvbW1pdDoge3xcbiAgICArb2lkOiBhbnlcbiAgfH0sXG4gICtjb21tZW50czoge3xcbiAgICArZWRnZXM6ID8kUmVhZE9ubHlBcnJheTw/e3xcbiAgICAgICtub2RlOiA/e3xcbiAgICAgICAgK2lkOiBzdHJpbmcsXG4gICAgICAgICskZnJhZ21lbnRSZWZzOiBjb21taXRDb21tZW50Vmlld19pdGVtJHJlZixcbiAgICAgIHx9XG4gICAgfH0+XG4gIHx9LFxuICArJHJlZlR5cGU6IGNvbW1pdENvbW1lbnRUaHJlYWRWaWV3X2l0ZW0kcmVmLFxufH07XG5leHBvcnQgdHlwZSBjb21taXRDb21tZW50VGhyZWFkVmlld19pdGVtJGRhdGEgPSBjb21taXRDb21tZW50VGhyZWFkVmlld19pdGVtO1xuZXhwb3J0IHR5cGUgY29tbWl0Q29tbWVudFRocmVhZFZpZXdfaXRlbSRrZXkgPSB7XG4gICskZGF0YT86IGNvbW1pdENvbW1lbnRUaHJlYWRWaWV3X2l0ZW0kZGF0YSxcbiAgKyRmcmFnbWVudFJlZnM6IGNvbW1pdENvbW1lbnRUaHJlYWRWaWV3X2l0ZW0kcmVmLFxufTtcbiovXG5cblxuY29uc3Qgbm9kZS8qOiBSZWFkZXJGcmFnbWVudCovID0ge1xuICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICBcIm5hbWVcIjogXCJjb21taXRDb21tZW50VGhyZWFkVmlld19pdGVtXCIsXG4gIFwidHlwZVwiOiBcIlB1bGxSZXF1ZXN0Q29tbWl0Q29tbWVudFRocmVhZFwiLFxuICBcIm1ldGFkYXRhXCI6IG51bGwsXG4gIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiBbXSxcbiAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwiY29tbWl0XCIsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJDb21taXRcIixcbiAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgIFwibmFtZVwiOiBcIm9pZFwiLFxuICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJjb21tZW50c1wiLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IFwiY29tbWVudHMoZmlyc3Q6MTAwKVwiLFxuICAgICAgXCJhcmdzXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIkxpdGVyYWxcIixcbiAgICAgICAgICBcIm5hbWVcIjogXCJmaXJzdFwiLFxuICAgICAgICAgIFwidmFsdWVcIjogMTAwXG4gICAgICAgIH1cbiAgICAgIF0sXG4gICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIkNvbW1pdENvbW1lbnRDb25uZWN0aW9uXCIsXG4gICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICBcIm5hbWVcIjogXCJlZGdlc1wiLFxuICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiQ29tbWl0Q29tbWVudEVkZ2VcIixcbiAgICAgICAgICBcInBsdXJhbFwiOiB0cnVlLFxuICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibm9kZVwiLFxuICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiQ29tbWl0Q29tbWVudFwiLFxuICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaWRcIixcbiAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkZyYWdtZW50U3ByZWFkXCIsXG4gICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjb21taXRDb21tZW50Vmlld19pdGVtXCIsXG4gICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgXVxufTtcbi8vIHByZXR0aWVyLWlnbm9yZVxuKG5vZGUvKjogYW55Ki8pLmhhc2ggPSAnMmY4ODFiMzNkZjYzNGE3NTVhNWQ2NmIxOTJjMjc5MWInO1xubW9kdWxlLmV4cG9ydHMgPSBub2RlO1xuIl19