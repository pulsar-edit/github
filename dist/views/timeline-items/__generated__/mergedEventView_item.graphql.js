/**
 * @flow
 */

/* eslint-disable */
'use strict';
/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type mergedEventView_item$ref: FragmentReference;
declare export opaque type mergedEventView_item$fragmentType: mergedEventView_item$ref;
export type mergedEventView_item = {|
  +actor: ?{|
    +avatarUrl: any,
    +login: string,
  |},
  +commit: ?{|
    +oid: any
  |},
  +mergeRefName: string,
  +createdAt: any,
  +$refType: mergedEventView_item$ref,
|};
export type mergedEventView_item$data = mergedEventView_item;
export type mergedEventView_item$key = {
  +$data?: mergedEventView_item$data,
  +$fragmentRefs: mergedEventView_item$ref,
};
*/

const node
/*: ReaderFragment*/
= {
  "kind": "Fragment",
  "name": "mergedEventView_item",
  "type": "MergedEvent",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [{
    "kind": "LinkedField",
    "alias": null,
    "name": "actor",
    "storageKey": null,
    "args": null,
    "concreteType": null,
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
      "name": "login",
      "args": null,
      "storageKey": null
    }]
  }, {
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
    "kind": "ScalarField",
    "alias": null,
    "name": "mergeRefName",
    "args": null,
    "storageKey": null
  }, {
    "kind": "ScalarField",
    "alias": null,
    "name": "createdAt",
    "args": null,
    "storageKey": null
  }]
}; // prettier-ignore

node
/*: any*/
.hash = 'd265decf08c14d96c2ec47fd5852a956';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi92aWV3cy90aW1lbGluZS1pdGVtcy9fX2dlbmVyYXRlZF9fL21lcmdlZEV2ZW50Vmlld19pdGVtLmdyYXBocWwuanMiXSwibmFtZXMiOlsibm9kZSIsImhhc2giLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0EsTUFBTUE7QUFBSTtBQUFBLEVBQXVCO0FBQy9CLFVBQVEsVUFEdUI7QUFFL0IsVUFBUSxzQkFGdUI7QUFHL0IsVUFBUSxhQUh1QjtBQUkvQixjQUFZLElBSm1CO0FBSy9CLHlCQUF1QixFQUxRO0FBTS9CLGdCQUFjLENBQ1o7QUFDRSxZQUFRLGFBRFY7QUFFRSxhQUFTLElBRlg7QUFHRSxZQUFRLE9BSFY7QUFJRSxrQkFBYyxJQUpoQjtBQUtFLFlBQVEsSUFMVjtBQU1FLG9CQUFnQixJQU5sQjtBQU9FLGNBQVUsS0FQWjtBQVFFLGtCQUFjLENBQ1o7QUFDRSxjQUFRLGFBRFY7QUFFRSxlQUFTLElBRlg7QUFHRSxjQUFRLFdBSFY7QUFJRSxjQUFRLElBSlY7QUFLRSxvQkFBYztBQUxoQixLQURZLEVBUVo7QUFDRSxjQUFRLGFBRFY7QUFFRSxlQUFTLElBRlg7QUFHRSxjQUFRLE9BSFY7QUFJRSxjQUFRLElBSlY7QUFLRSxvQkFBYztBQUxoQixLQVJZO0FBUmhCLEdBRFksRUEwQlo7QUFDRSxZQUFRLGFBRFY7QUFFRSxhQUFTLElBRlg7QUFHRSxZQUFRLFFBSFY7QUFJRSxrQkFBYyxJQUpoQjtBQUtFLFlBQVEsSUFMVjtBQU1FLG9CQUFnQixRQU5sQjtBQU9FLGNBQVUsS0FQWjtBQVFFLGtCQUFjLENBQ1o7QUFDRSxjQUFRLGFBRFY7QUFFRSxlQUFTLElBRlg7QUFHRSxjQUFRLEtBSFY7QUFJRSxjQUFRLElBSlY7QUFLRSxvQkFBYztBQUxoQixLQURZO0FBUmhCLEdBMUJZLEVBNENaO0FBQ0UsWUFBUSxhQURWO0FBRUUsYUFBUyxJQUZYO0FBR0UsWUFBUSxjQUhWO0FBSUUsWUFBUSxJQUpWO0FBS0Usa0JBQWM7QUFMaEIsR0E1Q1ksRUFtRFo7QUFDRSxZQUFRLGFBRFY7QUFFRSxhQUFTLElBRlg7QUFHRSxZQUFRLFdBSFY7QUFJRSxZQUFRLElBSlY7QUFLRSxrQkFBYztBQUxoQixHQW5EWTtBQU5pQixDQUFqQyxDLENBa0VBOztBQUNDQTtBQUFJO0FBQUwsQ0FBZ0JDLElBQWhCLEdBQXVCLGtDQUF2QjtBQUNBQyxNQUFNLENBQUNDLE9BQVAsR0FBaUJILElBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmxvd1xuICovXG5cbi8qIGVzbGludC1kaXNhYmxlICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyo6OlxuaW1wb3J0IHR5cGUgeyBSZWFkZXJGcmFnbWVudCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xuaW1wb3J0IHR5cGUgeyBGcmFnbWVudFJlZmVyZW5jZSB9IGZyb20gXCJyZWxheS1ydW50aW1lXCI7XG5kZWNsYXJlIGV4cG9ydCBvcGFxdWUgdHlwZSBtZXJnZWRFdmVudFZpZXdfaXRlbSRyZWY6IEZyYWdtZW50UmVmZXJlbmNlO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgbWVyZ2VkRXZlbnRWaWV3X2l0ZW0kZnJhZ21lbnRUeXBlOiBtZXJnZWRFdmVudFZpZXdfaXRlbSRyZWY7XG5leHBvcnQgdHlwZSBtZXJnZWRFdmVudFZpZXdfaXRlbSA9IHt8XG4gICthY3RvcjogP3t8XG4gICAgK2F2YXRhclVybDogYW55LFxuICAgICtsb2dpbjogc3RyaW5nLFxuICB8fSxcbiAgK2NvbW1pdDogP3t8XG4gICAgK29pZDogYW55XG4gIHx9LFxuICArbWVyZ2VSZWZOYW1lOiBzdHJpbmcsXG4gICtjcmVhdGVkQXQ6IGFueSxcbiAgKyRyZWZUeXBlOiBtZXJnZWRFdmVudFZpZXdfaXRlbSRyZWYsXG58fTtcbmV4cG9ydCB0eXBlIG1lcmdlZEV2ZW50Vmlld19pdGVtJGRhdGEgPSBtZXJnZWRFdmVudFZpZXdfaXRlbTtcbmV4cG9ydCB0eXBlIG1lcmdlZEV2ZW50Vmlld19pdGVtJGtleSA9IHtcbiAgKyRkYXRhPzogbWVyZ2VkRXZlbnRWaWV3X2l0ZW0kZGF0YSxcbiAgKyRmcmFnbWVudFJlZnM6IG1lcmdlZEV2ZW50Vmlld19pdGVtJHJlZixcbn07XG4qL1xuXG5cbmNvbnN0IG5vZGUvKjogUmVhZGVyRnJhZ21lbnQqLyA9IHtcbiAgXCJraW5kXCI6IFwiRnJhZ21lbnRcIixcbiAgXCJuYW1lXCI6IFwibWVyZ2VkRXZlbnRWaWV3X2l0ZW1cIixcbiAgXCJ0eXBlXCI6IFwiTWVyZ2VkRXZlbnRcIixcbiAgXCJtZXRhZGF0YVwiOiBudWxsLFxuICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogW10sXG4gIFwic2VsZWN0aW9uc1wiOiBbXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcImFjdG9yXCIsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgIFwibmFtZVwiOiBcImF2YXRhclVybFwiLFxuICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICBcIm5hbWVcIjogXCJsb2dpblwiLFxuICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJjb21taXRcIixcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIkNvbW1pdFwiLFxuICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgXCJuYW1lXCI6IFwib2lkXCIsXG4gICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcIm1lcmdlUmVmTmFtZVwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcImNyZWF0ZWRBdFwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH1cbiAgXVxufTtcbi8vIHByZXR0aWVyLWlnbm9yZVxuKG5vZGUvKjogYW55Ki8pLmhhc2ggPSAnZDI2NWRlY2YwOGMxNGQ5NmMyZWM0N2ZkNTg1MmE5NTYnO1xubW9kdWxlLmV4cG9ydHMgPSBub2RlO1xuIl19