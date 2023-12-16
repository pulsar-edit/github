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
const node /*: ReaderFragment*/ = {
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
};
// prettier-ignore
node /*: any*/.hash = '2f881b33df634a755a5d66b192c2791b';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJub2RlIiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwic291cmNlcyI6WyJjb21taXRDb21tZW50VGhyZWFkVmlld19pdGVtLmdyYXBocWwuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmxvd1xuICovXG5cbi8qIGVzbGludC1kaXNhYmxlICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyo6OlxuaW1wb3J0IHR5cGUgeyBSZWFkZXJGcmFnbWVudCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xudHlwZSBjb21taXRDb21tZW50Vmlld19pdGVtJHJlZiA9IGFueTtcbmltcG9ydCB0eXBlIHsgRnJhZ21lbnRSZWZlcmVuY2UgfSBmcm9tIFwicmVsYXktcnVudGltZVwiO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgY29tbWl0Q29tbWVudFRocmVhZFZpZXdfaXRlbSRyZWY6IEZyYWdtZW50UmVmZXJlbmNlO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgY29tbWl0Q29tbWVudFRocmVhZFZpZXdfaXRlbSRmcmFnbWVudFR5cGU6IGNvbW1pdENvbW1lbnRUaHJlYWRWaWV3X2l0ZW0kcmVmO1xuZXhwb3J0IHR5cGUgY29tbWl0Q29tbWVudFRocmVhZFZpZXdfaXRlbSA9IHt8XG4gICtjb21taXQ6IHt8XG4gICAgK29pZDogYW55XG4gIHx9LFxuICArY29tbWVudHM6IHt8XG4gICAgK2VkZ2VzOiA/JFJlYWRPbmx5QXJyYXk8P3t8XG4gICAgICArbm9kZTogP3t8XG4gICAgICAgICtpZDogc3RyaW5nLFxuICAgICAgICArJGZyYWdtZW50UmVmczogY29tbWl0Q29tbWVudFZpZXdfaXRlbSRyZWYsXG4gICAgICB8fVxuICAgIHx9PlxuICB8fSxcbiAgKyRyZWZUeXBlOiBjb21taXRDb21tZW50VGhyZWFkVmlld19pdGVtJHJlZixcbnx9O1xuZXhwb3J0IHR5cGUgY29tbWl0Q29tbWVudFRocmVhZFZpZXdfaXRlbSRkYXRhID0gY29tbWl0Q29tbWVudFRocmVhZFZpZXdfaXRlbTtcbmV4cG9ydCB0eXBlIGNvbW1pdENvbW1lbnRUaHJlYWRWaWV3X2l0ZW0ka2V5ID0ge1xuICArJGRhdGE/OiBjb21taXRDb21tZW50VGhyZWFkVmlld19pdGVtJGRhdGEsXG4gICskZnJhZ21lbnRSZWZzOiBjb21taXRDb21tZW50VGhyZWFkVmlld19pdGVtJHJlZixcbn07XG4qL1xuXG5cbmNvbnN0IG5vZGUvKjogUmVhZGVyRnJhZ21lbnQqLyA9IHtcbiAgXCJraW5kXCI6IFwiRnJhZ21lbnRcIixcbiAgXCJuYW1lXCI6IFwiY29tbWl0Q29tbWVudFRocmVhZFZpZXdfaXRlbVwiLFxuICBcInR5cGVcIjogXCJQdWxsUmVxdWVzdENvbW1pdENvbW1lbnRUaHJlYWRcIixcbiAgXCJtZXRhZGF0YVwiOiBudWxsLFxuICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogW10sXG4gIFwic2VsZWN0aW9uc1wiOiBbXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcImNvbW1pdFwiLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiQ29tbWl0XCIsXG4gICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICBcIm5hbWVcIjogXCJvaWRcIixcbiAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwiY29tbWVudHNcIixcbiAgICAgIFwic3RvcmFnZUtleVwiOiBcImNvbW1lbnRzKGZpcnN0OjEwMClcIixcbiAgICAgIFwiYXJnc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImtpbmRcIjogXCJMaXRlcmFsXCIsXG4gICAgICAgICAgXCJuYW1lXCI6IFwiZmlyc3RcIixcbiAgICAgICAgICBcInZhbHVlXCI6IDEwMFxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJDb21taXRDb21tZW50Q29ubmVjdGlvblwiLFxuICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgXCJuYW1lXCI6IFwiZWRnZXNcIixcbiAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIkNvbW1pdENvbW1lbnRFZGdlXCIsXG4gICAgICAgICAgXCJwbHVyYWxcIjogdHJ1ZSxcbiAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcIm5vZGVcIixcbiAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIkNvbW1pdENvbW1lbnRcIixcbiAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImlkXCIsXG4gICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJGcmFnbWVudFNwcmVhZFwiLFxuICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY29tbWl0Q29tbWVudFZpZXdfaXRlbVwiLFxuICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIF1cbn07XG4vLyBwcmV0dGllci1pZ25vcmVcbihub2RlLyo6IGFueSovKS5oYXNoID0gJzJmODgxYjMzZGY2MzRhNzU1YTVkNjZiMTkyYzI3OTFiJztcbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOztBQUVBOztBQUVBLFlBQVk7O0FBRVo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBLE1BQU1BLElBQUksd0JBQXVCO0VBQy9CLE1BQU0sRUFBRSxVQUFVO0VBQ2xCLE1BQU0sRUFBRSw4QkFBOEI7RUFDdEMsTUFBTSxFQUFFLGdDQUFnQztFQUN4QyxVQUFVLEVBQUUsSUFBSTtFQUNoQixxQkFBcUIsRUFBRSxFQUFFO0VBQ3pCLFlBQVksRUFBRSxDQUNaO0lBQ0UsTUFBTSxFQUFFLGFBQWE7SUFDckIsT0FBTyxFQUFFLElBQUk7SUFDYixNQUFNLEVBQUUsUUFBUTtJQUNoQixZQUFZLEVBQUUsSUFBSTtJQUNsQixNQUFNLEVBQUUsSUFBSTtJQUNaLGNBQWMsRUFBRSxRQUFRO0lBQ3hCLFFBQVEsRUFBRSxLQUFLO0lBQ2YsWUFBWSxFQUFFLENBQ1o7TUFDRSxNQUFNLEVBQUUsYUFBYTtNQUNyQixPQUFPLEVBQUUsSUFBSTtNQUNiLE1BQU0sRUFBRSxLQUFLO01BQ2IsTUFBTSxFQUFFLElBQUk7TUFDWixZQUFZLEVBQUU7SUFDaEIsQ0FBQztFQUVMLENBQUMsRUFDRDtJQUNFLE1BQU0sRUFBRSxhQUFhO0lBQ3JCLE9BQU8sRUFBRSxJQUFJO0lBQ2IsTUFBTSxFQUFFLFVBQVU7SUFDbEIsWUFBWSxFQUFFLHFCQUFxQjtJQUNuQyxNQUFNLEVBQUUsQ0FDTjtNQUNFLE1BQU0sRUFBRSxTQUFTO01BQ2pCLE1BQU0sRUFBRSxPQUFPO01BQ2YsT0FBTyxFQUFFO0lBQ1gsQ0FBQyxDQUNGO0lBQ0QsY0FBYyxFQUFFLHlCQUF5QjtJQUN6QyxRQUFRLEVBQUUsS0FBSztJQUNmLFlBQVksRUFBRSxDQUNaO01BQ0UsTUFBTSxFQUFFLGFBQWE7TUFDckIsT0FBTyxFQUFFLElBQUk7TUFDYixNQUFNLEVBQUUsT0FBTztNQUNmLFlBQVksRUFBRSxJQUFJO01BQ2xCLE1BQU0sRUFBRSxJQUFJO01BQ1osY0FBYyxFQUFFLG1CQUFtQjtNQUNuQyxRQUFRLEVBQUUsSUFBSTtNQUNkLFlBQVksRUFBRSxDQUNaO1FBQ0UsTUFBTSxFQUFFLGFBQWE7UUFDckIsT0FBTyxFQUFFLElBQUk7UUFDYixNQUFNLEVBQUUsTUFBTTtRQUNkLFlBQVksRUFBRSxJQUFJO1FBQ2xCLE1BQU0sRUFBRSxJQUFJO1FBQ1osY0FBYyxFQUFFLGVBQWU7UUFDL0IsUUFBUSxFQUFFLEtBQUs7UUFDZixZQUFZLEVBQUUsQ0FDWjtVQUNFLE1BQU0sRUFBRSxhQUFhO1VBQ3JCLE9BQU8sRUFBRSxJQUFJO1VBQ2IsTUFBTSxFQUFFLElBQUk7VUFDWixNQUFNLEVBQUUsSUFBSTtVQUNaLFlBQVksRUFBRTtRQUNoQixDQUFDLEVBQ0Q7VUFDRSxNQUFNLEVBQUUsZ0JBQWdCO1VBQ3hCLE1BQU0sRUFBRSx3QkFBd0I7VUFDaEMsTUFBTSxFQUFFO1FBQ1YsQ0FBQztNQUVMLENBQUM7SUFFTCxDQUFDO0VBRUwsQ0FBQztBQUVMLENBQUM7QUFDRDtBQUNDQSxJQUFJLFdBQVdDLElBQUksR0FBRyxrQ0FBa0M7QUFDekRDLE1BQU0sQ0FBQ0MsT0FBTyxHQUFHSCxJQUFJIn0=