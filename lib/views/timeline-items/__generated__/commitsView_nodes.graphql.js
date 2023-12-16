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
const node /*: ReaderFragment*/ = {
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
};
// prettier-ignore
node /*: any*/.hash = '5b2734f1e64af2ad2c9803201a0082f3';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJub2RlIiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwic291cmNlcyI6WyJjb21taXRzVmlld19ub2Rlcy5ncmFwaHFsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZsb3dcbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qOjpcbmltcG9ydCB0eXBlIHsgUmVhZGVyRnJhZ21lbnQgfSBmcm9tICdyZWxheS1ydW50aW1lJztcbnR5cGUgY29tbWl0Vmlld19jb21taXQkcmVmID0gYW55O1xuaW1wb3J0IHR5cGUgeyBGcmFnbWVudFJlZmVyZW5jZSB9IGZyb20gXCJyZWxheS1ydW50aW1lXCI7XG5kZWNsYXJlIGV4cG9ydCBvcGFxdWUgdHlwZSBjb21taXRzVmlld19ub2RlcyRyZWY6IEZyYWdtZW50UmVmZXJlbmNlO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgY29tbWl0c1ZpZXdfbm9kZXMkZnJhZ21lbnRUeXBlOiBjb21taXRzVmlld19ub2RlcyRyZWY7XG5leHBvcnQgdHlwZSBjb21taXRzVmlld19ub2RlcyA9ICRSZWFkT25seUFycmF5PHt8XG4gICtjb21taXQ6IHt8XG4gICAgK2lkOiBzdHJpbmcsXG4gICAgK2F1dGhvcjogP3t8XG4gICAgICArbmFtZTogP3N0cmluZyxcbiAgICAgICt1c2VyOiA/e3xcbiAgICAgICAgK2xvZ2luOiBzdHJpbmdcbiAgICAgIHx9LFxuICAgIHx9LFxuICAgICskZnJhZ21lbnRSZWZzOiBjb21taXRWaWV3X2NvbW1pdCRyZWYsXG4gIHx9LFxuICArJHJlZlR5cGU6IGNvbW1pdHNWaWV3X25vZGVzJHJlZixcbnx9PjtcbmV4cG9ydCB0eXBlIGNvbW1pdHNWaWV3X25vZGVzJGRhdGEgPSBjb21taXRzVmlld19ub2RlcztcbmV4cG9ydCB0eXBlIGNvbW1pdHNWaWV3X25vZGVzJGtleSA9ICRSZWFkT25seUFycmF5PHtcbiAgKyRkYXRhPzogY29tbWl0c1ZpZXdfbm9kZXMkZGF0YSxcbiAgKyRmcmFnbWVudFJlZnM6IGNvbW1pdHNWaWV3X25vZGVzJHJlZixcbn0+O1xuKi9cblxuXG5jb25zdCBub2RlLyo6IFJlYWRlckZyYWdtZW50Ki8gPSB7XG4gIFwia2luZFwiOiBcIkZyYWdtZW50XCIsXG4gIFwibmFtZVwiOiBcImNvbW1pdHNWaWV3X25vZGVzXCIsXG4gIFwidHlwZVwiOiBcIlB1bGxSZXF1ZXN0Q29tbWl0XCIsXG4gIFwibWV0YWRhdGFcIjoge1xuICAgIFwicGx1cmFsXCI6IHRydWVcbiAgfSxcbiAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6IFtdLFxuICBcInNlbGVjdGlvbnNcIjogW1xuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJjb21taXRcIixcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIkNvbW1pdFwiLFxuICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgXCJuYW1lXCI6IFwiaWRcIixcbiAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgXCJuYW1lXCI6IFwiYXV0aG9yXCIsXG4gICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJHaXRBY3RvclwiLFxuICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibmFtZVwiLFxuICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwidXNlclwiLFxuICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiVXNlclwiLFxuICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibG9naW5cIixcbiAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcImtpbmRcIjogXCJGcmFnbWVudFNwcmVhZFwiLFxuICAgICAgICAgIFwibmFtZVwiOiBcImNvbW1pdFZpZXdfY29tbWl0XCIsXG4gICAgICAgICAgXCJhcmdzXCI6IG51bGxcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgXVxufTtcbi8vIHByZXR0aWVyLWlnbm9yZVxuKG5vZGUvKjogYW55Ki8pLmhhc2ggPSAnNWIyNzM0ZjFlNjRhZjJhZDJjOTgwMzIwMWEwMDgyZjMnO1xubW9kdWxlLmV4cG9ydHMgPSBub2RlO1xuIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsWUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUdBLE1BQU1BLElBQUksd0JBQXVCO0VBQy9CLE1BQU0sRUFBRSxVQUFVO0VBQ2xCLE1BQU0sRUFBRSxtQkFBbUI7RUFDM0IsTUFBTSxFQUFFLG1CQUFtQjtFQUMzQixVQUFVLEVBQUU7SUFDVixRQUFRLEVBQUU7RUFDWixDQUFDO0VBQ0QscUJBQXFCLEVBQUUsRUFBRTtFQUN6QixZQUFZLEVBQUUsQ0FDWjtJQUNFLE1BQU0sRUFBRSxhQUFhO0lBQ3JCLE9BQU8sRUFBRSxJQUFJO0lBQ2IsTUFBTSxFQUFFLFFBQVE7SUFDaEIsWUFBWSxFQUFFLElBQUk7SUFDbEIsTUFBTSxFQUFFLElBQUk7SUFDWixjQUFjLEVBQUUsUUFBUTtJQUN4QixRQUFRLEVBQUUsS0FBSztJQUNmLFlBQVksRUFBRSxDQUNaO01BQ0UsTUFBTSxFQUFFLGFBQWE7TUFDckIsT0FBTyxFQUFFLElBQUk7TUFDYixNQUFNLEVBQUUsSUFBSTtNQUNaLE1BQU0sRUFBRSxJQUFJO01BQ1osWUFBWSxFQUFFO0lBQ2hCLENBQUMsRUFDRDtNQUNFLE1BQU0sRUFBRSxhQUFhO01BQ3JCLE9BQU8sRUFBRSxJQUFJO01BQ2IsTUFBTSxFQUFFLFFBQVE7TUFDaEIsWUFBWSxFQUFFLElBQUk7TUFDbEIsTUFBTSxFQUFFLElBQUk7TUFDWixjQUFjLEVBQUUsVUFBVTtNQUMxQixRQUFRLEVBQUUsS0FBSztNQUNmLFlBQVksRUFBRSxDQUNaO1FBQ0UsTUFBTSxFQUFFLGFBQWE7UUFDckIsT0FBTyxFQUFFLElBQUk7UUFDYixNQUFNLEVBQUUsTUFBTTtRQUNkLE1BQU0sRUFBRSxJQUFJO1FBQ1osWUFBWSxFQUFFO01BQ2hCLENBQUMsRUFDRDtRQUNFLE1BQU0sRUFBRSxhQUFhO1FBQ3JCLE9BQU8sRUFBRSxJQUFJO1FBQ2IsTUFBTSxFQUFFLE1BQU07UUFDZCxZQUFZLEVBQUUsSUFBSTtRQUNsQixNQUFNLEVBQUUsSUFBSTtRQUNaLGNBQWMsRUFBRSxNQUFNO1FBQ3RCLFFBQVEsRUFBRSxLQUFLO1FBQ2YsWUFBWSxFQUFFLENBQ1o7VUFDRSxNQUFNLEVBQUUsYUFBYTtVQUNyQixPQUFPLEVBQUUsSUFBSTtVQUNiLE1BQU0sRUFBRSxPQUFPO1VBQ2YsTUFBTSxFQUFFLElBQUk7VUFDWixZQUFZLEVBQUU7UUFDaEIsQ0FBQztNQUVMLENBQUM7SUFFTCxDQUFDLEVBQ0Q7TUFDRSxNQUFNLEVBQUUsZ0JBQWdCO01BQ3hCLE1BQU0sRUFBRSxtQkFBbUI7TUFDM0IsTUFBTSxFQUFFO0lBQ1YsQ0FBQztFQUVMLENBQUM7QUFFTCxDQUFDO0FBQ0Q7QUFDQ0EsSUFBSSxXQUFXQyxJQUFJLEdBQUcsa0NBQWtDO0FBQ3pEQyxNQUFNLENBQUNDLE9BQU8sR0FBR0gsSUFBSSJ9