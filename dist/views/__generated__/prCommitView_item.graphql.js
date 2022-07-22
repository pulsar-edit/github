/**
 * @flow
 */

/* eslint-disable */
'use strict';
/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type prCommitView_item$ref: FragmentReference;
declare export opaque type prCommitView_item$fragmentType: prCommitView_item$ref;
export type prCommitView_item = {|
  +committer: ?{|
    +avatarUrl: any,
    +name: ?string,
    +date: ?any,
  |},
  +messageHeadline: string,
  +messageBody: string,
  +shortSha: string,
  +sha: any,
  +url: any,
  +$refType: prCommitView_item$ref,
|};
export type prCommitView_item$data = prCommitView_item;
export type prCommitView_item$key = {
  +$data?: prCommitView_item$data,
  +$fragmentRefs: prCommitView_item$ref,
};
*/

const node
/*: ReaderFragment*/
= {
  "kind": "Fragment",
  "name": "prCommitView_item",
  "type": "Commit",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [{
    "kind": "LinkedField",
    "alias": null,
    "name": "committer",
    "storageKey": null,
    "args": null,
    "concreteType": "GitActor",
    "plural": false,
    "selections": [{
      "kind": "ScalarField",
      "alias": null,
      "name": "avatarUrl",
      "args": null,
      "storageKey": null
    }, {
      "kind": "ScalarField",
      "alias": null,
      "name": "name",
      "args": null,
      "storageKey": null
    }, {
      "kind": "ScalarField",
      "alias": null,
      "name": "date",
      "args": null,
      "storageKey": null
    }]
  }, {
    "kind": "ScalarField",
    "alias": null,
    "name": "messageHeadline",
    "args": null,
    "storageKey": null
  }, {
    "kind": "ScalarField",
    "alias": null,
    "name": "messageBody",
    "args": null,
    "storageKey": null
  }, {
    "kind": "ScalarField",
    "alias": "shortSha",
    "name": "abbreviatedOid",
    "args": null,
    "storageKey": null
  }, {
    "kind": "ScalarField",
    "alias": "sha",
    "name": "oid",
    "args": null,
    "storageKey": null
  }, {
    "kind": "ScalarField",
    "alias": null,
    "name": "url",
    "args": null,
    "storageKey": null
  }]
}; // prettier-ignore

node
/*: any*/
.hash = '2bd193bec5d758f465d9428ff3cd8a09';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi92aWV3cy9fX2dlbmVyYXRlZF9fL3ByQ29tbWl0Vmlld19pdGVtLmdyYXBocWwuanMiXSwibmFtZXMiOlsibm9kZSIsImhhc2giLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQSxNQUFNQTtBQUFJO0FBQUEsRUFBdUI7QUFDL0IsVUFBUSxVQUR1QjtBQUUvQixVQUFRLG1CQUZ1QjtBQUcvQixVQUFRLFFBSHVCO0FBSS9CLGNBQVksSUFKbUI7QUFLL0IseUJBQXVCLEVBTFE7QUFNL0IsZ0JBQWMsQ0FDWjtBQUNFLFlBQVEsYUFEVjtBQUVFLGFBQVMsSUFGWDtBQUdFLFlBQVEsV0FIVjtBQUlFLGtCQUFjLElBSmhCO0FBS0UsWUFBUSxJQUxWO0FBTUUsb0JBQWdCLFVBTmxCO0FBT0UsY0FBVSxLQVBaO0FBUUUsa0JBQWMsQ0FDWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsSUFGWDtBQUdFLGNBQVEsV0FIVjtBQUlFLGNBQVEsSUFKVjtBQUtFLG9CQUFjO0FBTGhCLEtBRFksRUFRWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsSUFGWDtBQUdFLGNBQVEsTUFIVjtBQUlFLGNBQVEsSUFKVjtBQUtFLG9CQUFjO0FBTGhCLEtBUlksRUFlWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsSUFGWDtBQUdFLGNBQVEsTUFIVjtBQUlFLGNBQVEsSUFKVjtBQUtFLG9CQUFjO0FBTGhCLEtBZlk7QUFSaEIsR0FEWSxFQWlDWjtBQUNFLFlBQVEsYUFEVjtBQUVFLGFBQVMsSUFGWDtBQUdFLFlBQVEsaUJBSFY7QUFJRSxZQUFRLElBSlY7QUFLRSxrQkFBYztBQUxoQixHQWpDWSxFQXdDWjtBQUNFLFlBQVEsYUFEVjtBQUVFLGFBQVMsSUFGWDtBQUdFLFlBQVEsYUFIVjtBQUlFLFlBQVEsSUFKVjtBQUtFLGtCQUFjO0FBTGhCLEdBeENZLEVBK0NaO0FBQ0UsWUFBUSxhQURWO0FBRUUsYUFBUyxVQUZYO0FBR0UsWUFBUSxnQkFIVjtBQUlFLFlBQVEsSUFKVjtBQUtFLGtCQUFjO0FBTGhCLEdBL0NZLEVBc0RaO0FBQ0UsWUFBUSxhQURWO0FBRUUsYUFBUyxLQUZYO0FBR0UsWUFBUSxLQUhWO0FBSUUsWUFBUSxJQUpWO0FBS0Usa0JBQWM7QUFMaEIsR0F0RFksRUE2RFo7QUFDRSxZQUFRLGFBRFY7QUFFRSxhQUFTLElBRlg7QUFHRSxZQUFRLEtBSFY7QUFJRSxZQUFRLElBSlY7QUFLRSxrQkFBYztBQUxoQixHQTdEWTtBQU5pQixDQUFqQyxDLENBNEVBOztBQUNDQTtBQUFJO0FBQUwsQ0FBZ0JDLElBQWhCLEdBQXVCLGtDQUF2QjtBQUNBQyxNQUFNLENBQUNDLE9BQVAsR0FBaUJILElBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmxvd1xuICovXG5cbi8qIGVzbGludC1kaXNhYmxlICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyo6OlxuaW1wb3J0IHR5cGUgeyBSZWFkZXJGcmFnbWVudCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xuaW1wb3J0IHR5cGUgeyBGcmFnbWVudFJlZmVyZW5jZSB9IGZyb20gXCJyZWxheS1ydW50aW1lXCI7XG5kZWNsYXJlIGV4cG9ydCBvcGFxdWUgdHlwZSBwckNvbW1pdFZpZXdfaXRlbSRyZWY6IEZyYWdtZW50UmVmZXJlbmNlO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgcHJDb21taXRWaWV3X2l0ZW0kZnJhZ21lbnRUeXBlOiBwckNvbW1pdFZpZXdfaXRlbSRyZWY7XG5leHBvcnQgdHlwZSBwckNvbW1pdFZpZXdfaXRlbSA9IHt8XG4gICtjb21taXR0ZXI6ID97fFxuICAgICthdmF0YXJVcmw6IGFueSxcbiAgICArbmFtZTogP3N0cmluZyxcbiAgICArZGF0ZTogP2FueSxcbiAgfH0sXG4gICttZXNzYWdlSGVhZGxpbmU6IHN0cmluZyxcbiAgK21lc3NhZ2VCb2R5OiBzdHJpbmcsXG4gICtzaG9ydFNoYTogc3RyaW5nLFxuICArc2hhOiBhbnksXG4gICt1cmw6IGFueSxcbiAgKyRyZWZUeXBlOiBwckNvbW1pdFZpZXdfaXRlbSRyZWYsXG58fTtcbmV4cG9ydCB0eXBlIHByQ29tbWl0Vmlld19pdGVtJGRhdGEgPSBwckNvbW1pdFZpZXdfaXRlbTtcbmV4cG9ydCB0eXBlIHByQ29tbWl0Vmlld19pdGVtJGtleSA9IHtcbiAgKyRkYXRhPzogcHJDb21taXRWaWV3X2l0ZW0kZGF0YSxcbiAgKyRmcmFnbWVudFJlZnM6IHByQ29tbWl0Vmlld19pdGVtJHJlZixcbn07XG4qL1xuXG5cbmNvbnN0IG5vZGUvKjogUmVhZGVyRnJhZ21lbnQqLyA9IHtcbiAgXCJraW5kXCI6IFwiRnJhZ21lbnRcIixcbiAgXCJuYW1lXCI6IFwicHJDb21taXRWaWV3X2l0ZW1cIixcbiAgXCJ0eXBlXCI6IFwiQ29tbWl0XCIsXG4gIFwibWV0YWRhdGFcIjogbnVsbCxcbiAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6IFtdLFxuICBcInNlbGVjdGlvbnNcIjogW1xuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJjb21taXR0ZXJcIixcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIkdpdEFjdG9yXCIsXG4gICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICBcIm5hbWVcIjogXCJhdmF0YXJVcmxcIixcbiAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgXCJuYW1lXCI6IFwibmFtZVwiLFxuICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICBcIm5hbWVcIjogXCJkYXRlXCIsXG4gICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcIm1lc3NhZ2VIZWFkbGluZVwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcIm1lc3NhZ2VCb2R5XCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBcInNob3J0U2hhXCIsXG4gICAgICBcIm5hbWVcIjogXCJhYmJyZXZpYXRlZE9pZFwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogXCJzaGFcIixcbiAgICAgIFwibmFtZVwiOiBcIm9pZFwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcInVybFwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH1cbiAgXVxufTtcbi8vIHByZXR0aWVyLWlnbm9yZVxuKG5vZGUvKjogYW55Ki8pLmhhc2ggPSAnMmJkMTkzYmVjNWQ3NThmNDY1ZDk0MjhmZjNjZDhhMDknO1xubW9kdWxlLmV4cG9ydHMgPSBub2RlO1xuIl19