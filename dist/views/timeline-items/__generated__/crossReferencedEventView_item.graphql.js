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
declare export opaque type crossReferencedEventView_item$ref: FragmentReference;
declare export opaque type crossReferencedEventView_item$fragmentType: crossReferencedEventView_item$ref;
export type crossReferencedEventView_item = {|
  +id: string,
  +isCrossRepository: boolean,
  +source: {|
    +__typename: string,
    +repository?: {|
      +name: string,
      +isPrivate: boolean,
      +owner: {|
        +login: string
      |},
    |},
    +number?: number,
    +title?: string,
    +url?: any,
    +issueState?: IssueState,
    +prState?: PullRequestState,
  |},
  +$refType: crossReferencedEventView_item$ref,
|};
export type crossReferencedEventView_item$data = crossReferencedEventView_item;
export type crossReferencedEventView_item$key = {
  +$data?: crossReferencedEventView_item$data,
  +$fragmentRefs: crossReferencedEventView_item$ref,
};
*/

const node
/*: ReaderFragment*/
= function () {
  var v0 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "number",
    "args": null,
    "storageKey": null
  },
      v1 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "title",
    "args": null,
    "storageKey": null
  },
      v2 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "url",
    "args": null,
    "storageKey": null
  };
  return {
    "kind": "Fragment",
    "name": "crossReferencedEventView_item",
    "type": "CrossReferencedEvent",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [{
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    }, {
      "kind": "ScalarField",
      "alias": null,
      "name": "isCrossRepository",
      "args": null,
      "storageKey": null
    }, {
      "kind": "LinkedField",
      "alias": null,
      "name": "source",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": false,
      "selections": [{
        "kind": "ScalarField",
        "alias": null,
        "name": "__typename",
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
          "kind": "ScalarField",
          "alias": null,
          "name": "isPrivate",
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
          "selections": [{
            "kind": "ScalarField",
            "alias": null,
            "name": "login",
            "args": null,
            "storageKey": null
          }]
        }]
      }, {
        "kind": "InlineFragment",
        "type": "Issue",
        "selections": [v0
        /*: any*/
        , v1
        /*: any*/
        , v2
        /*: any*/
        , {
          "kind": "ScalarField",
          "alias": "issueState",
          "name": "state",
          "args": null,
          "storageKey": null
        }]
      }, {
        "kind": "InlineFragment",
        "type": "PullRequest",
        "selections": [v0
        /*: any*/
        , v1
        /*: any*/
        , v2
        /*: any*/
        , {
          "kind": "ScalarField",
          "alias": "prState",
          "name": "state",
          "args": null,
          "storageKey": null
        }]
      }]
    }]
  };
}(); // prettier-ignore


node
/*: any*/
.hash = 'b90b8c9f0acee56516e7413263cf7f51';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi92aWV3cy90aW1lbGluZS1pdGVtcy9fX2dlbmVyYXRlZF9fL2Nyb3NzUmVmZXJlbmNlZEV2ZW50Vmlld19pdGVtLmdyYXBocWwuanMiXSwibmFtZXMiOlsibm9kZSIsInYwIiwidjEiLCJ2MiIsImhhc2giLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQSxNQUFNQTtBQUFJO0FBQUEsRUFBd0IsWUFBVTtBQUM1QyxNQUFJQyxFQUFFLEdBQUc7QUFDUCxZQUFRLGFBREQ7QUFFUCxhQUFTLElBRkY7QUFHUCxZQUFRLFFBSEQ7QUFJUCxZQUFRLElBSkQ7QUFLUCxrQkFBYztBQUxQLEdBQVQ7QUFBQSxNQU9BQyxFQUFFLEdBQUc7QUFDSCxZQUFRLGFBREw7QUFFSCxhQUFTLElBRk47QUFHSCxZQUFRLE9BSEw7QUFJSCxZQUFRLElBSkw7QUFLSCxrQkFBYztBQUxYLEdBUEw7QUFBQSxNQWNBQyxFQUFFLEdBQUc7QUFDSCxZQUFRLGFBREw7QUFFSCxhQUFTLElBRk47QUFHSCxZQUFRLEtBSEw7QUFJSCxZQUFRLElBSkw7QUFLSCxrQkFBYztBQUxYLEdBZEw7QUFxQkEsU0FBTztBQUNMLFlBQVEsVUFESDtBQUVMLFlBQVEsK0JBRkg7QUFHTCxZQUFRLHNCQUhIO0FBSUwsZ0JBQVksSUFKUDtBQUtMLDJCQUF1QixFQUxsQjtBQU1MLGtCQUFjLENBQ1o7QUFDRSxjQUFRLGFBRFY7QUFFRSxlQUFTLElBRlg7QUFHRSxjQUFRLElBSFY7QUFJRSxjQUFRLElBSlY7QUFLRSxvQkFBYztBQUxoQixLQURZLEVBUVo7QUFDRSxjQUFRLGFBRFY7QUFFRSxlQUFTLElBRlg7QUFHRSxjQUFRLG1CQUhWO0FBSUUsY0FBUSxJQUpWO0FBS0Usb0JBQWM7QUFMaEIsS0FSWSxFQWVaO0FBQ0UsY0FBUSxhQURWO0FBRUUsZUFBUyxJQUZYO0FBR0UsY0FBUSxRQUhWO0FBSUUsb0JBQWMsSUFKaEI7QUFLRSxjQUFRLElBTFY7QUFNRSxzQkFBZ0IsSUFObEI7QUFPRSxnQkFBVSxLQVBaO0FBUUUsb0JBQWMsQ0FDWjtBQUNFLGdCQUFRLGFBRFY7QUFFRSxpQkFBUyxJQUZYO0FBR0UsZ0JBQVEsWUFIVjtBQUlFLGdCQUFRLElBSlY7QUFLRSxzQkFBYztBQUxoQixPQURZLEVBUVo7QUFDRSxnQkFBUSxhQURWO0FBRUUsaUJBQVMsSUFGWDtBQUdFLGdCQUFRLFlBSFY7QUFJRSxzQkFBYyxJQUpoQjtBQUtFLGdCQUFRLElBTFY7QUFNRSx3QkFBZ0IsWUFObEI7QUFPRSxrQkFBVSxLQVBaO0FBUUUsc0JBQWMsQ0FDWjtBQUNFLGtCQUFRLGFBRFY7QUFFRSxtQkFBUyxJQUZYO0FBR0Usa0JBQVEsTUFIVjtBQUlFLGtCQUFRLElBSlY7QUFLRSx3QkFBYztBQUxoQixTQURZLEVBUVo7QUFDRSxrQkFBUSxhQURWO0FBRUUsbUJBQVMsSUFGWDtBQUdFLGtCQUFRLFdBSFY7QUFJRSxrQkFBUSxJQUpWO0FBS0Usd0JBQWM7QUFMaEIsU0FSWSxFQWVaO0FBQ0Usa0JBQVEsYUFEVjtBQUVFLG1CQUFTLElBRlg7QUFHRSxrQkFBUSxPQUhWO0FBSUUsd0JBQWMsSUFKaEI7QUFLRSxrQkFBUSxJQUxWO0FBTUUsMEJBQWdCLElBTmxCO0FBT0Usb0JBQVUsS0FQWjtBQVFFLHdCQUFjLENBQ1o7QUFDRSxvQkFBUSxhQURWO0FBRUUscUJBQVMsSUFGWDtBQUdFLG9CQUFRLE9BSFY7QUFJRSxvQkFBUSxJQUpWO0FBS0UsMEJBQWM7QUFMaEIsV0FEWTtBQVJoQixTQWZZO0FBUmhCLE9BUlksRUFtRFo7QUFDRSxnQkFBUSxnQkFEVjtBQUVFLGdCQUFRLE9BRlY7QUFHRSxzQkFBYyxDQUNYRjtBQUFFO0FBRFMsVUFFWEM7QUFBRTtBQUZTLFVBR1hDO0FBQUU7QUFIUyxVQUlaO0FBQ0Usa0JBQVEsYUFEVjtBQUVFLG1CQUFTLFlBRlg7QUFHRSxrQkFBUSxPQUhWO0FBSUUsa0JBQVEsSUFKVjtBQUtFLHdCQUFjO0FBTGhCLFNBSlk7QUFIaEIsT0FuRFksRUFtRVo7QUFDRSxnQkFBUSxnQkFEVjtBQUVFLGdCQUFRLGFBRlY7QUFHRSxzQkFBYyxDQUNYRjtBQUFFO0FBRFMsVUFFWEM7QUFBRTtBQUZTLFVBR1hDO0FBQUU7QUFIUyxVQUlaO0FBQ0Usa0JBQVEsYUFEVjtBQUVFLG1CQUFTLFNBRlg7QUFHRSxrQkFBUSxPQUhWO0FBSUUsa0JBQVEsSUFKVjtBQUtFLHdCQUFjO0FBTGhCLFNBSlk7QUFIaEIsT0FuRVk7QUFSaEIsS0FmWTtBQU5ULEdBQVA7QUFvSEMsQ0ExSWdDLEVBQWpDLEMsQ0EySUE7OztBQUNDSDtBQUFJO0FBQUwsQ0FBZ0JJLElBQWhCLEdBQXVCLGtDQUF2QjtBQUNBQyxNQUFNLENBQUNDLE9BQVAsR0FBaUJOLElBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmxvd1xuICovXG5cbi8qIGVzbGludC1kaXNhYmxlICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyo6OlxuaW1wb3J0IHR5cGUgeyBSZWFkZXJGcmFnbWVudCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xuZXhwb3J0IHR5cGUgSXNzdWVTdGF0ZSA9IFwiQ0xPU0VEXCIgfCBcIk9QRU5cIiB8IFwiJWZ1dHVyZSBhZGRlZCB2YWx1ZVwiO1xuZXhwb3J0IHR5cGUgUHVsbFJlcXVlc3RTdGF0ZSA9IFwiQ0xPU0VEXCIgfCBcIk1FUkdFRFwiIHwgXCJPUEVOXCIgfCBcIiVmdXR1cmUgYWRkZWQgdmFsdWVcIjtcbmltcG9ydCB0eXBlIHsgRnJhZ21lbnRSZWZlcmVuY2UgfSBmcm9tIFwicmVsYXktcnVudGltZVwiO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgY3Jvc3NSZWZlcmVuY2VkRXZlbnRWaWV3X2l0ZW0kcmVmOiBGcmFnbWVudFJlZmVyZW5jZTtcbmRlY2xhcmUgZXhwb3J0IG9wYXF1ZSB0eXBlIGNyb3NzUmVmZXJlbmNlZEV2ZW50Vmlld19pdGVtJGZyYWdtZW50VHlwZTogY3Jvc3NSZWZlcmVuY2VkRXZlbnRWaWV3X2l0ZW0kcmVmO1xuZXhwb3J0IHR5cGUgY3Jvc3NSZWZlcmVuY2VkRXZlbnRWaWV3X2l0ZW0gPSB7fFxuICAraWQ6IHN0cmluZyxcbiAgK2lzQ3Jvc3NSZXBvc2l0b3J5OiBib29sZWFuLFxuICArc291cmNlOiB7fFxuICAgICtfX3R5cGVuYW1lOiBzdHJpbmcsXG4gICAgK3JlcG9zaXRvcnk/OiB7fFxuICAgICAgK25hbWU6IHN0cmluZyxcbiAgICAgICtpc1ByaXZhdGU6IGJvb2xlYW4sXG4gICAgICArb3duZXI6IHt8XG4gICAgICAgICtsb2dpbjogc3RyaW5nXG4gICAgICB8fSxcbiAgICB8fSxcbiAgICArbnVtYmVyPzogbnVtYmVyLFxuICAgICt0aXRsZT86IHN0cmluZyxcbiAgICArdXJsPzogYW55LFxuICAgICtpc3N1ZVN0YXRlPzogSXNzdWVTdGF0ZSxcbiAgICArcHJTdGF0ZT86IFB1bGxSZXF1ZXN0U3RhdGUsXG4gIHx9LFxuICArJHJlZlR5cGU6IGNyb3NzUmVmZXJlbmNlZEV2ZW50Vmlld19pdGVtJHJlZixcbnx9O1xuZXhwb3J0IHR5cGUgY3Jvc3NSZWZlcmVuY2VkRXZlbnRWaWV3X2l0ZW0kZGF0YSA9IGNyb3NzUmVmZXJlbmNlZEV2ZW50Vmlld19pdGVtO1xuZXhwb3J0IHR5cGUgY3Jvc3NSZWZlcmVuY2VkRXZlbnRWaWV3X2l0ZW0ka2V5ID0ge1xuICArJGRhdGE/OiBjcm9zc1JlZmVyZW5jZWRFdmVudFZpZXdfaXRlbSRkYXRhLFxuICArJGZyYWdtZW50UmVmczogY3Jvc3NSZWZlcmVuY2VkRXZlbnRWaWV3X2l0ZW0kcmVmLFxufTtcbiovXG5cblxuY29uc3Qgbm9kZS8qOiBSZWFkZXJGcmFnbWVudCovID0gKGZ1bmN0aW9uKCl7XG52YXIgdjAgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwibnVtYmVyXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnYxID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcInRpdGxlXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnYyID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcInVybFwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn07XG5yZXR1cm4ge1xuICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICBcIm5hbWVcIjogXCJjcm9zc1JlZmVyZW5jZWRFdmVudFZpZXdfaXRlbVwiLFxuICBcInR5cGVcIjogXCJDcm9zc1JlZmVyZW5jZWRFdmVudFwiLFxuICBcIm1ldGFkYXRhXCI6IG51bGwsXG4gIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiBbXSxcbiAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwiaWRcIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJpc0Nyb3NzUmVwb3NpdG9yeVwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcInNvdXJjZVwiLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICBcIm5hbWVcIjogXCJfX3R5cGVuYW1lXCIsXG4gICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgIFwibmFtZVwiOiBcInJlcG9zaXRvcnlcIixcbiAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlJlcG9zaXRvcnlcIixcbiAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcIm5hbWVcIixcbiAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImlzUHJpdmF0ZVwiLFxuICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwib3duZXJcIixcbiAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBudWxsLFxuICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibG9naW5cIixcbiAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcImtpbmRcIjogXCJJbmxpbmVGcmFnbWVudFwiLFxuICAgICAgICAgIFwidHlwZVwiOiBcIklzc3VlXCIsXG4gICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICh2MC8qOiBhbnkqLyksXG4gICAgICAgICAgICAodjEvKjogYW55Ki8pLFxuICAgICAgICAgICAgKHYyLyo6IGFueSovKSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgXCJhbGlhc1wiOiBcImlzc3VlU3RhdGVcIixcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwic3RhdGVcIixcbiAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJraW5kXCI6IFwiSW5saW5lRnJhZ21lbnRcIixcbiAgICAgICAgICBcInR5cGVcIjogXCJQdWxsUmVxdWVzdFwiLFxuICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAodjAvKjogYW55Ki8pLFxuICAgICAgICAgICAgKHYxLyo6IGFueSovKSxcbiAgICAgICAgICAgICh2Mi8qOiBhbnkqLyksXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgIFwiYWxpYXNcIjogXCJwclN0YXRlXCIsXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcInN0YXRlXCIsXG4gICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgXVxufTtcbn0pKCk7XG4vLyBwcmV0dGllci1pZ25vcmVcbihub2RlLyo6IGFueSovKS5oYXNoID0gJ2I5MGI4YzlmMGFjZWU1NjUxNmU3NDEzMjYzY2Y3ZjUxJztcbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcbiJdfQ==