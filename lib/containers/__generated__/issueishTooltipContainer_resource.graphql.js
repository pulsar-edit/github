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
const node /*: ReaderFragment*/ = function () {
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
        "selections": [v0 /*: any*/]
      }]
    }, {
      "kind": "LinkedField",
      "alias": null,
      "name": "author",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": false,
      "selections": [v0 /*: any*/, {
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
      "selections": v1 /*: any*/
    }, {
      "kind": "InlineFragment",
      "type": "PullRequest",
      "selections": v1 /*: any*/
    }]
  };
}();
// prettier-ignore
node /*: any*/.hash = '8980fc73c7ed3f632f0612ce14f2f0d1';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJub2RlIiwidjAiLCJ2MSIsImhhc2giLCJtb2R1bGUiLCJleHBvcnRzIl0sInNvdXJjZXMiOlsiaXNzdWVpc2hUb29sdGlwQ29udGFpbmVyX3Jlc291cmNlLmdyYXBocWwuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmxvd1xuICovXG5cbi8qIGVzbGludC1kaXNhYmxlICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyo6OlxuaW1wb3J0IHR5cGUgeyBSZWFkZXJGcmFnbWVudCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xuZXhwb3J0IHR5cGUgSXNzdWVTdGF0ZSA9IFwiQ0xPU0VEXCIgfCBcIk9QRU5cIiB8IFwiJWZ1dHVyZSBhZGRlZCB2YWx1ZVwiO1xuZXhwb3J0IHR5cGUgUHVsbFJlcXVlc3RTdGF0ZSA9IFwiQ0xPU0VEXCIgfCBcIk1FUkdFRFwiIHwgXCJPUEVOXCIgfCBcIiVmdXR1cmUgYWRkZWQgdmFsdWVcIjtcbmltcG9ydCB0eXBlIHsgRnJhZ21lbnRSZWZlcmVuY2UgfSBmcm9tIFwicmVsYXktcnVudGltZVwiO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgaXNzdWVpc2hUb29sdGlwQ29udGFpbmVyX3Jlc291cmNlJHJlZjogRnJhZ21lbnRSZWZlcmVuY2U7XG5kZWNsYXJlIGV4cG9ydCBvcGFxdWUgdHlwZSBpc3N1ZWlzaFRvb2x0aXBDb250YWluZXJfcmVzb3VyY2UkZnJhZ21lbnRUeXBlOiBpc3N1ZWlzaFRvb2x0aXBDb250YWluZXJfcmVzb3VyY2UkcmVmO1xuZXhwb3J0IHR5cGUgaXNzdWVpc2hUb29sdGlwQ29udGFpbmVyX3Jlc291cmNlID0ge3xcbiAgK19fdHlwZW5hbWU6IFwiSXNzdWVcIixcbiAgK3N0YXRlOiBJc3N1ZVN0YXRlLFxuICArbnVtYmVyOiBudW1iZXIsXG4gICt0aXRsZTogc3RyaW5nLFxuICArcmVwb3NpdG9yeToge3xcbiAgICArbmFtZTogc3RyaW5nLFxuICAgICtvd25lcjoge3xcbiAgICAgICtsb2dpbjogc3RyaW5nXG4gICAgfH0sXG4gIHx9LFxuICArYXV0aG9yOiA/e3xcbiAgICArbG9naW46IHN0cmluZyxcbiAgICArYXZhdGFyVXJsOiBhbnksXG4gIHx9LFxuICArJHJlZlR5cGU6IGlzc3VlaXNoVG9vbHRpcENvbnRhaW5lcl9yZXNvdXJjZSRyZWYsXG58fSB8IHt8XG4gICtfX3R5cGVuYW1lOiBcIlB1bGxSZXF1ZXN0XCIsXG4gICtzdGF0ZTogUHVsbFJlcXVlc3RTdGF0ZSxcbiAgK251bWJlcjogbnVtYmVyLFxuICArdGl0bGU6IHN0cmluZyxcbiAgK3JlcG9zaXRvcnk6IHt8XG4gICAgK25hbWU6IHN0cmluZyxcbiAgICArb3duZXI6IHt8XG4gICAgICArbG9naW46IHN0cmluZ1xuICAgIHx9LFxuICB8fSxcbiAgK2F1dGhvcjogP3t8XG4gICAgK2xvZ2luOiBzdHJpbmcsXG4gICAgK2F2YXRhclVybDogYW55LFxuICB8fSxcbiAgKyRyZWZUeXBlOiBpc3N1ZWlzaFRvb2x0aXBDb250YWluZXJfcmVzb3VyY2UkcmVmLFxufH0gfCB7fFxuICAvLyBUaGlzIHdpbGwgbmV2ZXIgYmUgJyVvdGhlcicsIGJ1dCB3ZSBuZWVkIHNvbWVcbiAgLy8gdmFsdWUgaW4gY2FzZSBub25lIG9mIHRoZSBjb25jcmV0ZSB2YWx1ZXMgbWF0Y2guXG4gICtfX3R5cGVuYW1lOiBcIiVvdGhlclwiLFxuICArJHJlZlR5cGU6IGlzc3VlaXNoVG9vbHRpcENvbnRhaW5lcl9yZXNvdXJjZSRyZWYsXG58fTtcbmV4cG9ydCB0eXBlIGlzc3VlaXNoVG9vbHRpcENvbnRhaW5lcl9yZXNvdXJjZSRkYXRhID0gaXNzdWVpc2hUb29sdGlwQ29udGFpbmVyX3Jlc291cmNlO1xuZXhwb3J0IHR5cGUgaXNzdWVpc2hUb29sdGlwQ29udGFpbmVyX3Jlc291cmNlJGtleSA9IHtcbiAgKyRkYXRhPzogaXNzdWVpc2hUb29sdGlwQ29udGFpbmVyX3Jlc291cmNlJGRhdGEsXG4gICskZnJhZ21lbnRSZWZzOiBpc3N1ZWlzaFRvb2x0aXBDb250YWluZXJfcmVzb3VyY2UkcmVmLFxufTtcbiovXG5cblxuY29uc3Qgbm9kZS8qOiBSZWFkZXJGcmFnbWVudCovID0gKGZ1bmN0aW9uKCl7XG52YXIgdjAgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwibG9naW5cIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjEgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICBcIm5hbWVcIjogXCJzdGF0ZVwiLFxuICAgIFwiYXJnc1wiOiBudWxsLFxuICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gIH0sXG4gIHtcbiAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICBcIm5hbWVcIjogXCJudW1iZXJcIixcbiAgICBcImFyZ3NcIjogbnVsbCxcbiAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICB9LFxuICB7XG4gICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgXCJuYW1lXCI6IFwidGl0bGVcIixcbiAgICBcImFyZ3NcIjogbnVsbCxcbiAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICB9LFxuICB7XG4gICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgXCJuYW1lXCI6IFwicmVwb3NpdG9yeVwiLFxuICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgIFwiYXJnc1wiOiBudWxsLFxuICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUmVwb3NpdG9yeVwiLFxuICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgXCJuYW1lXCI6IFwibmFtZVwiLFxuICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgXCJuYW1lXCI6IFwib3duZXJcIixcbiAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBudWxsLFxuICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAodjAvKjogYW55Ki8pXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIHtcbiAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICBcIm5hbWVcIjogXCJhdXRob3JcIixcbiAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICBcImFyZ3NcIjogbnVsbCxcbiAgICBcImNvbmNyZXRlVHlwZVwiOiBudWxsLFxuICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAodjAvKjogYW55Ki8pLFxuICAgICAge1xuICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgIFwibmFtZVwiOiBcImF2YXRhclVybFwiLFxuICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgIH1cbiAgICBdXG4gIH1cbl07XG5yZXR1cm4ge1xuICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICBcIm5hbWVcIjogXCJpc3N1ZWlzaFRvb2x0aXBDb250YWluZXJfcmVzb3VyY2VcIixcbiAgXCJ0eXBlXCI6IFwiVW5pZm9ybVJlc291cmNlTG9jYXRhYmxlXCIsXG4gIFwibWV0YWRhdGFcIjogbnVsbCxcbiAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6IFtdLFxuICBcInNlbGVjdGlvbnNcIjogW1xuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJfX3R5cGVuYW1lXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJJbmxpbmVGcmFnbWVudFwiLFxuICAgICAgXCJ0eXBlXCI6IFwiSXNzdWVcIixcbiAgICAgIFwic2VsZWN0aW9uc1wiOiAodjEvKjogYW55Ki8pXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJJbmxpbmVGcmFnbWVudFwiLFxuICAgICAgXCJ0eXBlXCI6IFwiUHVsbFJlcXVlc3RcIixcbiAgICAgIFwic2VsZWN0aW9uc1wiOiAodjEvKjogYW55Ki8pXG4gICAgfVxuICBdXG59O1xufSkoKTtcbi8vIHByZXR0aWVyLWlnbm9yZVxuKG5vZGUvKjogYW55Ki8pLmhhc2ggPSAnODk4MGZjNzNjN2VkM2Y2MzJmMDYxMmNlMTRmMmYwZDEnO1xubW9kdWxlLmV4cG9ydHMgPSBub2RlO1xuIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsWUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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