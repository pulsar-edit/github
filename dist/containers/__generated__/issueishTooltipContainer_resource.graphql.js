/**
 * @flow
 */

/* eslint-disable */
'use strict';
/*::
import type { ReaderFragment } from 'relay-runtime';
export type IssueState = "CLOSED" | "OPEN" | "%future added value";
export type PullRequestState = "CLOSED" | "MERGED" | "OPEN" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type issueishTooltipContainer_resource$ref: FragmentReference;
declare export opaque type issueishTooltipContainer_resource$fragmentType: issueishTooltipContainer_resource$ref;
export type issueishTooltipContainer_resource = {|
  +__typename: "Issue",
  +state: IssueState,
  +number: number,
  +title: string,
  +repository: {|
    +name: string,
    +owner: {|
      +login: string
    |},
  |},
  +author: ?{|
    +login: string,
    +avatarUrl: any,
  |},
  +$refType: issueishTooltipContainer_resource$ref,
|} | {|
  +__typename: "PullRequest",
  +state: PullRequestState,
  +number: number,
  +title: string,
  +repository: {|
    +name: string,
    +owner: {|
      +login: string
    |},
  |},
  +author: ?{|
    +login: string,
    +avatarUrl: any,
  |},
  +$refType: issueishTooltipContainer_resource$ref,
|} | {|
  // This will never be '%other', but we need some
  // value in case none of the concrete values match.
  +__typename: "%other",
  +$refType: issueishTooltipContainer_resource$ref,
|};
export type issueishTooltipContainer_resource$data = issueishTooltipContainer_resource;
export type issueishTooltipContainer_resource$key = {
  +$data?: issueishTooltipContainer_resource$data,
  +$fragmentRefs: issueishTooltipContainer_resource$ref,
};
*/

const node
/*: ReaderFragment*/
= function () {
  var v0 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "login",
    "args": null,
    "storageKey": null
  },
      v1 = [{
    "kind": "ScalarField",
    "alias": null,
    "name": "state",
    "args": null,
    "storageKey": null
  }, {
    "kind": "ScalarField",
    "alias": null,
    "name": "number",
    "args": null,
    "storageKey": null
  }, {
    "kind": "ScalarField",
    "alias": null,
    "name": "title",
    "args": null,
    "storageKey": null
  }, {
    "kind": "LinkedField",
    "alias": null,
    "name": "repository",
    "storageKey": null,
    "args": null,
    "concreteType": "Repository",
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
      "name": "owner",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": false,
      "selections": [v0
      /*: any*/
      ]
    }]
  }, {
    "kind": "LinkedField",
    "alias": null,
    "name": "author",
    "storageKey": null,
    "args": null,
    "concreteType": null,
    "plural": false,
    "selections": [v0
    /*: any*/
    , {
      "kind": "ScalarField",
      "alias": null,
      "name": "avatarUrl",
      "args": null,
      "storageKey": null
    }]
  }];
  return {
    "kind": "Fragment",
    "name": "issueishTooltipContainer_resource",
    "type": "UniformResourceLocatable",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [{
      "kind": "ScalarField",
      "alias": null,
      "name": "__typename",
      "args": null,
      "storageKey": null
    }, {
      "kind": "InlineFragment",
      "type": "Issue",
      "selections": v1
      /*: any*/

    }, {
      "kind": "InlineFragment",
      "type": "PullRequest",
      "selections": v1
      /*: any*/

    }]
  };
}(); // prettier-ignore


node
/*: any*/
.hash = '8980fc73c7ed3f632f0612ce14f2f0d1';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9jb250YWluZXJzL19fZ2VuZXJhdGVkX18vaXNzdWVpc2hUb29sdGlwQ29udGFpbmVyX3Jlc291cmNlLmdyYXBocWwuanMiXSwibmFtZXMiOlsibm9kZSIsInYwIiwidjEiLCJoYXNoIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOztBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0EsTUFBTUE7QUFBSTtBQUFBLEVBQXdCLFlBQVU7QUFDNUMsTUFBSUMsRUFBRSxHQUFHO0FBQ1AsWUFBUSxhQUREO0FBRVAsYUFBUyxJQUZGO0FBR1AsWUFBUSxPQUhEO0FBSVAsWUFBUSxJQUpEO0FBS1Asa0JBQWM7QUFMUCxHQUFUO0FBQUEsTUFPQUMsRUFBRSxHQUFHLENBQ0g7QUFDRSxZQUFRLGFBRFY7QUFFRSxhQUFTLElBRlg7QUFHRSxZQUFRLE9BSFY7QUFJRSxZQUFRLElBSlY7QUFLRSxrQkFBYztBQUxoQixHQURHLEVBUUg7QUFDRSxZQUFRLGFBRFY7QUFFRSxhQUFTLElBRlg7QUFHRSxZQUFRLFFBSFY7QUFJRSxZQUFRLElBSlY7QUFLRSxrQkFBYztBQUxoQixHQVJHLEVBZUg7QUFDRSxZQUFRLGFBRFY7QUFFRSxhQUFTLElBRlg7QUFHRSxZQUFRLE9BSFY7QUFJRSxZQUFRLElBSlY7QUFLRSxrQkFBYztBQUxoQixHQWZHLEVBc0JIO0FBQ0UsWUFBUSxhQURWO0FBRUUsYUFBUyxJQUZYO0FBR0UsWUFBUSxZQUhWO0FBSUUsa0JBQWMsSUFKaEI7QUFLRSxZQUFRLElBTFY7QUFNRSxvQkFBZ0IsWUFObEI7QUFPRSxjQUFVLEtBUFo7QUFRRSxrQkFBYyxDQUNaO0FBQ0UsY0FBUSxhQURWO0FBRUUsZUFBUyxJQUZYO0FBR0UsY0FBUSxNQUhWO0FBSUUsY0FBUSxJQUpWO0FBS0Usb0JBQWM7QUFMaEIsS0FEWSxFQVFaO0FBQ0UsY0FBUSxhQURWO0FBRUUsZUFBUyxJQUZYO0FBR0UsY0FBUSxPQUhWO0FBSUUsb0JBQWMsSUFKaEI7QUFLRSxjQUFRLElBTFY7QUFNRSxzQkFBZ0IsSUFObEI7QUFPRSxnQkFBVSxLQVBaO0FBUUUsb0JBQWMsQ0FDWEQ7QUFBRTtBQURTO0FBUmhCLEtBUlk7QUFSaEIsR0F0QkcsRUFvREg7QUFDRSxZQUFRLGFBRFY7QUFFRSxhQUFTLElBRlg7QUFHRSxZQUFRLFFBSFY7QUFJRSxrQkFBYyxJQUpoQjtBQUtFLFlBQVEsSUFMVjtBQU1FLG9CQUFnQixJQU5sQjtBQU9FLGNBQVUsS0FQWjtBQVFFLGtCQUFjLENBQ1hBO0FBQUU7QUFEUyxNQUVaO0FBQ0UsY0FBUSxhQURWO0FBRUUsZUFBUyxJQUZYO0FBR0UsY0FBUSxXQUhWO0FBSUUsY0FBUSxJQUpWO0FBS0Usb0JBQWM7QUFMaEIsS0FGWTtBQVJoQixHQXBERyxDQVBMO0FBK0VBLFNBQU87QUFDTCxZQUFRLFVBREg7QUFFTCxZQUFRLG1DQUZIO0FBR0wsWUFBUSwwQkFISDtBQUlMLGdCQUFZLElBSlA7QUFLTCwyQkFBdUIsRUFMbEI7QUFNTCxrQkFBYyxDQUNaO0FBQ0UsY0FBUSxhQURWO0FBRUUsZUFBUyxJQUZYO0FBR0UsY0FBUSxZQUhWO0FBSUUsY0FBUSxJQUpWO0FBS0Usb0JBQWM7QUFMaEIsS0FEWSxFQVFaO0FBQ0UsY0FBUSxnQkFEVjtBQUVFLGNBQVEsT0FGVjtBQUdFLG9CQUFlQztBQUFFOztBQUhuQixLQVJZLEVBYVo7QUFDRSxjQUFRLGdCQURWO0FBRUUsY0FBUSxhQUZWO0FBR0Usb0JBQWVBO0FBQUU7O0FBSG5CLEtBYlk7QUFOVCxHQUFQO0FBMEJDLENBMUdnQyxFQUFqQyxDLENBMkdBOzs7QUFDQ0Y7QUFBSTtBQUFMLENBQWdCRyxJQUFoQixHQUF1QixrQ0FBdkI7QUFDQUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCTCxJQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZsb3dcbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qOjpcbmltcG9ydCB0eXBlIHsgUmVhZGVyRnJhZ21lbnQgfSBmcm9tICdyZWxheS1ydW50aW1lJztcbmV4cG9ydCB0eXBlIElzc3VlU3RhdGUgPSBcIkNMT1NFRFwiIHwgXCJPUEVOXCIgfCBcIiVmdXR1cmUgYWRkZWQgdmFsdWVcIjtcbmV4cG9ydCB0eXBlIFB1bGxSZXF1ZXN0U3RhdGUgPSBcIkNMT1NFRFwiIHwgXCJNRVJHRURcIiB8IFwiT1BFTlwiIHwgXCIlZnV0dXJlIGFkZGVkIHZhbHVlXCI7XG5pbXBvcnQgdHlwZSB7IEZyYWdtZW50UmVmZXJlbmNlIH0gZnJvbSBcInJlbGF5LXJ1bnRpbWVcIjtcbmRlY2xhcmUgZXhwb3J0IG9wYXF1ZSB0eXBlIGlzc3VlaXNoVG9vbHRpcENvbnRhaW5lcl9yZXNvdXJjZSRyZWY6IEZyYWdtZW50UmVmZXJlbmNlO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgaXNzdWVpc2hUb29sdGlwQ29udGFpbmVyX3Jlc291cmNlJGZyYWdtZW50VHlwZTogaXNzdWVpc2hUb29sdGlwQ29udGFpbmVyX3Jlc291cmNlJHJlZjtcbmV4cG9ydCB0eXBlIGlzc3VlaXNoVG9vbHRpcENvbnRhaW5lcl9yZXNvdXJjZSA9IHt8XG4gICtfX3R5cGVuYW1lOiBcIklzc3VlXCIsXG4gICtzdGF0ZTogSXNzdWVTdGF0ZSxcbiAgK251bWJlcjogbnVtYmVyLFxuICArdGl0bGU6IHN0cmluZyxcbiAgK3JlcG9zaXRvcnk6IHt8XG4gICAgK25hbWU6IHN0cmluZyxcbiAgICArb3duZXI6IHt8XG4gICAgICArbG9naW46IHN0cmluZ1xuICAgIHx9LFxuICB8fSxcbiAgK2F1dGhvcjogP3t8XG4gICAgK2xvZ2luOiBzdHJpbmcsXG4gICAgK2F2YXRhclVybDogYW55LFxuICB8fSxcbiAgKyRyZWZUeXBlOiBpc3N1ZWlzaFRvb2x0aXBDb250YWluZXJfcmVzb3VyY2UkcmVmLFxufH0gfCB7fFxuICArX190eXBlbmFtZTogXCJQdWxsUmVxdWVzdFwiLFxuICArc3RhdGU6IFB1bGxSZXF1ZXN0U3RhdGUsXG4gICtudW1iZXI6IG51bWJlcixcbiAgK3RpdGxlOiBzdHJpbmcsXG4gICtyZXBvc2l0b3J5OiB7fFxuICAgICtuYW1lOiBzdHJpbmcsXG4gICAgK293bmVyOiB7fFxuICAgICAgK2xvZ2luOiBzdHJpbmdcbiAgICB8fSxcbiAgfH0sXG4gICthdXRob3I6ID97fFxuICAgICtsb2dpbjogc3RyaW5nLFxuICAgICthdmF0YXJVcmw6IGFueSxcbiAgfH0sXG4gICskcmVmVHlwZTogaXNzdWVpc2hUb29sdGlwQ29udGFpbmVyX3Jlc291cmNlJHJlZixcbnx9IHwge3xcbiAgLy8gVGhpcyB3aWxsIG5ldmVyIGJlICclb3RoZXInLCBidXQgd2UgbmVlZCBzb21lXG4gIC8vIHZhbHVlIGluIGNhc2Ugbm9uZSBvZiB0aGUgY29uY3JldGUgdmFsdWVzIG1hdGNoLlxuICArX190eXBlbmFtZTogXCIlb3RoZXJcIixcbiAgKyRyZWZUeXBlOiBpc3N1ZWlzaFRvb2x0aXBDb250YWluZXJfcmVzb3VyY2UkcmVmLFxufH07XG5leHBvcnQgdHlwZSBpc3N1ZWlzaFRvb2x0aXBDb250YWluZXJfcmVzb3VyY2UkZGF0YSA9IGlzc3VlaXNoVG9vbHRpcENvbnRhaW5lcl9yZXNvdXJjZTtcbmV4cG9ydCB0eXBlIGlzc3VlaXNoVG9vbHRpcENvbnRhaW5lcl9yZXNvdXJjZSRrZXkgPSB7XG4gICskZGF0YT86IGlzc3VlaXNoVG9vbHRpcENvbnRhaW5lcl9yZXNvdXJjZSRkYXRhLFxuICArJGZyYWdtZW50UmVmczogaXNzdWVpc2hUb29sdGlwQ29udGFpbmVyX3Jlc291cmNlJHJlZixcbn07XG4qL1xuXG5cbmNvbnN0IG5vZGUvKjogUmVhZGVyRnJhZ21lbnQqLyA9IChmdW5jdGlvbigpe1xudmFyIHYwID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcImxvZ2luXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnYxID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgXCJuYW1lXCI6IFwic3RhdGVcIixcbiAgICBcImFyZ3NcIjogbnVsbCxcbiAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICB9LFxuICB7XG4gICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgXCJuYW1lXCI6IFwibnVtYmVyXCIsXG4gICAgXCJhcmdzXCI6IG51bGwsXG4gICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgfSxcbiAge1xuICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgXCJhbGlhc1wiOiBudWxsLFxuICAgIFwibmFtZVwiOiBcInRpdGxlXCIsXG4gICAgXCJhcmdzXCI6IG51bGwsXG4gICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgfSxcbiAge1xuICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgXCJhbGlhc1wiOiBudWxsLFxuICAgIFwibmFtZVwiOiBcInJlcG9zaXRvcnlcIixcbiAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICBcImFyZ3NcIjogbnVsbCxcbiAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlJlcG9zaXRvcnlcIixcbiAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAge1xuICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgIFwibmFtZVwiOiBcIm5hbWVcIixcbiAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgIFwibmFtZVwiOiBcIm93bmVyXCIsXG4gICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgKHYwLyo6IGFueSovKVxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9LFxuICB7XG4gICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgXCJuYW1lXCI6IFwiYXV0aG9yXCIsXG4gICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgXCJhcmdzXCI6IG51bGwsXG4gICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgKHYwLyo6IGFueSovKSxcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICBcIm5hbWVcIjogXCJhdmF0YXJVcmxcIixcbiAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICB9XG4gICAgXVxuICB9XG5dO1xucmV0dXJuIHtcbiAgXCJraW5kXCI6IFwiRnJhZ21lbnRcIixcbiAgXCJuYW1lXCI6IFwiaXNzdWVpc2hUb29sdGlwQ29udGFpbmVyX3Jlc291cmNlXCIsXG4gIFwidHlwZVwiOiBcIlVuaWZvcm1SZXNvdXJjZUxvY2F0YWJsZVwiLFxuICBcIm1ldGFkYXRhXCI6IG51bGwsXG4gIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiBbXSxcbiAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwiX190eXBlbmFtZVwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiSW5saW5lRnJhZ21lbnRcIixcbiAgICAgIFwidHlwZVwiOiBcIklzc3VlXCIsXG4gICAgICBcInNlbGVjdGlvbnNcIjogKHYxLyo6IGFueSovKVxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiSW5saW5lRnJhZ21lbnRcIixcbiAgICAgIFwidHlwZVwiOiBcIlB1bGxSZXF1ZXN0XCIsXG4gICAgICBcInNlbGVjdGlvbnNcIjogKHYxLyo6IGFueSovKVxuICAgIH1cbiAgXVxufTtcbn0pKCk7XG4vLyBwcmV0dGllci1pZ25vcmVcbihub2RlLyo6IGFueSovKS5oYXNoID0gJzg5ODBmYzczYzdlZDNmNjMyZjA2MTJjZTE0ZjJmMGQxJztcbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcbiJdfQ==