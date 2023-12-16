/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type headRefForcePushedEventView_item$ref: FragmentReference;
declare export opaque type headRefForcePushedEventView_item$fragmentType: headRefForcePushedEventView_item$ref;
export type headRefForcePushedEventView_item = {|
  +actor: ?{|
    +avatarUrl: any,
    +login: string,
  |},
  +beforeCommit: ?{|
    +oid: any
  |},
  +afterCommit: ?{|
    +oid: any
  |},
  +createdAt: any,
  +$refType: headRefForcePushedEventView_item$ref,
|};
export type headRefForcePushedEventView_item$data = headRefForcePushedEventView_item;
export type headRefForcePushedEventView_item$key = {
  +$data?: headRefForcePushedEventView_item$data,
  +$fragmentRefs: headRefForcePushedEventView_item$ref,
};
*/
const node /*: ReaderFragment*/ = function () {
  var v0 = [{
    "kind": "ScalarField",
    "alias": null,
    "name": "oid",
    "args": null,
    "storageKey": null
  }];
  return {
    "kind": "Fragment",
    "name": "headRefForcePushedEventView_item",
    "type": "HeadRefForcePushedEvent",
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
      "name": "beforeCommit",
      "storageKey": null,
      "args": null,
      "concreteType": "Commit",
      "plural": false,
      "selections": v0 /*: any*/
    }, {
      "kind": "LinkedField",
      "alias": null,
      "name": "afterCommit",
      "storageKey": null,
      "args": null,
      "concreteType": "Commit",
      "plural": false,
      "selections": v0 /*: any*/
    }, {
      "kind": "ScalarField",
      "alias": null,
      "name": "createdAt",
      "args": null,
      "storageKey": null
    }]
  };
}();
// prettier-ignore
node /*: any*/.hash = 'fc403545674c57c1997c870805101ffb';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJub2RlIiwidjAiLCJoYXNoIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJzb3VyY2VzIjpbImhlYWRSZWZGb3JjZVB1c2hlZEV2ZW50Vmlld19pdGVtLmdyYXBocWwuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmxvd1xuICovXG5cbi8qIGVzbGludC1kaXNhYmxlICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyo6OlxuaW1wb3J0IHR5cGUgeyBSZWFkZXJGcmFnbWVudCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xuaW1wb3J0IHR5cGUgeyBGcmFnbWVudFJlZmVyZW5jZSB9IGZyb20gXCJyZWxheS1ydW50aW1lXCI7XG5kZWNsYXJlIGV4cG9ydCBvcGFxdWUgdHlwZSBoZWFkUmVmRm9yY2VQdXNoZWRFdmVudFZpZXdfaXRlbSRyZWY6IEZyYWdtZW50UmVmZXJlbmNlO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgaGVhZFJlZkZvcmNlUHVzaGVkRXZlbnRWaWV3X2l0ZW0kZnJhZ21lbnRUeXBlOiBoZWFkUmVmRm9yY2VQdXNoZWRFdmVudFZpZXdfaXRlbSRyZWY7XG5leHBvcnQgdHlwZSBoZWFkUmVmRm9yY2VQdXNoZWRFdmVudFZpZXdfaXRlbSA9IHt8XG4gICthY3RvcjogP3t8XG4gICAgK2F2YXRhclVybDogYW55LFxuICAgICtsb2dpbjogc3RyaW5nLFxuICB8fSxcbiAgK2JlZm9yZUNvbW1pdDogP3t8XG4gICAgK29pZDogYW55XG4gIHx9LFxuICArYWZ0ZXJDb21taXQ6ID97fFxuICAgICtvaWQ6IGFueVxuICB8fSxcbiAgK2NyZWF0ZWRBdDogYW55LFxuICArJHJlZlR5cGU6IGhlYWRSZWZGb3JjZVB1c2hlZEV2ZW50Vmlld19pdGVtJHJlZixcbnx9O1xuZXhwb3J0IHR5cGUgaGVhZFJlZkZvcmNlUHVzaGVkRXZlbnRWaWV3X2l0ZW0kZGF0YSA9IGhlYWRSZWZGb3JjZVB1c2hlZEV2ZW50Vmlld19pdGVtO1xuZXhwb3J0IHR5cGUgaGVhZFJlZkZvcmNlUHVzaGVkRXZlbnRWaWV3X2l0ZW0ka2V5ID0ge1xuICArJGRhdGE/OiBoZWFkUmVmRm9yY2VQdXNoZWRFdmVudFZpZXdfaXRlbSRkYXRhLFxuICArJGZyYWdtZW50UmVmczogaGVhZFJlZkZvcmNlUHVzaGVkRXZlbnRWaWV3X2l0ZW0kcmVmLFxufTtcbiovXG5cblxuY29uc3Qgbm9kZS8qOiBSZWFkZXJGcmFnbWVudCovID0gKGZ1bmN0aW9uKCl7XG52YXIgdjAgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICBcIm5hbWVcIjogXCJvaWRcIixcbiAgICBcImFyZ3NcIjogbnVsbCxcbiAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICB9XG5dO1xucmV0dXJuIHtcbiAgXCJraW5kXCI6IFwiRnJhZ21lbnRcIixcbiAgXCJuYW1lXCI6IFwiaGVhZFJlZkZvcmNlUHVzaGVkRXZlbnRWaWV3X2l0ZW1cIixcbiAgXCJ0eXBlXCI6IFwiSGVhZFJlZkZvcmNlUHVzaGVkRXZlbnRcIixcbiAgXCJtZXRhZGF0YVwiOiBudWxsLFxuICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogW10sXG4gIFwic2VsZWN0aW9uc1wiOiBbXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcImFjdG9yXCIsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgIFwibmFtZVwiOiBcImF2YXRhclVybFwiLFxuICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICBcIm5hbWVcIjogXCJsb2dpblwiLFxuICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJiZWZvcmVDb21taXRcIixcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIkNvbW1pdFwiLFxuICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICBcInNlbGVjdGlvbnNcIjogKHYwLyo6IGFueSovKVxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcImFmdGVyQ29tbWl0XCIsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJDb21taXRcIixcbiAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgXCJzZWxlY3Rpb25zXCI6ICh2MC8qOiBhbnkqLylcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJjcmVhdGVkQXRcIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9XG4gIF1cbn07XG59KSgpO1xuLy8gcHJldHRpZXItaWdub3JlXG4obm9kZS8qOiBhbnkqLykuaGFzaCA9ICdmYzQwMzU0NTY3NGM1N2MxOTk3Yzg3MDgwNTEwMWZmYic7XG5tb2R1bGUuZXhwb3J0cyA9IG5vZGU7XG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxZQUFZOztBQUVaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0EsTUFBTUEsSUFBSSx3QkFBd0IsWUFBVTtFQUM1QyxJQUFJQyxFQUFFLEdBQUcsQ0FDUDtJQUNFLE1BQU0sRUFBRSxhQUFhO0lBQ3JCLE9BQU8sRUFBRSxJQUFJO0lBQ2IsTUFBTSxFQUFFLEtBQUs7SUFDYixNQUFNLEVBQUUsSUFBSTtJQUNaLFlBQVksRUFBRTtFQUNoQixDQUFDLENBQ0Y7RUFDRCxPQUFPO0lBQ0wsTUFBTSxFQUFFLFVBQVU7SUFDbEIsTUFBTSxFQUFFLGtDQUFrQztJQUMxQyxNQUFNLEVBQUUseUJBQXlCO0lBQ2pDLFVBQVUsRUFBRSxJQUFJO0lBQ2hCLHFCQUFxQixFQUFFLEVBQUU7SUFDekIsWUFBWSxFQUFFLENBQ1o7TUFDRSxNQUFNLEVBQUUsYUFBYTtNQUNyQixPQUFPLEVBQUUsSUFBSTtNQUNiLE1BQU0sRUFBRSxPQUFPO01BQ2YsWUFBWSxFQUFFLElBQUk7TUFDbEIsTUFBTSxFQUFFLElBQUk7TUFDWixjQUFjLEVBQUUsSUFBSTtNQUNwQixRQUFRLEVBQUUsS0FBSztNQUNmLFlBQVksRUFBRSxDQUNaO1FBQ0UsTUFBTSxFQUFFLGFBQWE7UUFDckIsT0FBTyxFQUFFLElBQUk7UUFDYixNQUFNLEVBQUUsV0FBVztRQUNuQixNQUFNLEVBQUUsSUFBSTtRQUNaLFlBQVksRUFBRTtNQUNoQixDQUFDLEVBQ0Q7UUFDRSxNQUFNLEVBQUUsYUFBYTtRQUNyQixPQUFPLEVBQUUsSUFBSTtRQUNiLE1BQU0sRUFBRSxPQUFPO1FBQ2YsTUFBTSxFQUFFLElBQUk7UUFDWixZQUFZLEVBQUU7TUFDaEIsQ0FBQztJQUVMLENBQUMsRUFDRDtNQUNFLE1BQU0sRUFBRSxhQUFhO01BQ3JCLE9BQU8sRUFBRSxJQUFJO01BQ2IsTUFBTSxFQUFFLGNBQWM7TUFDdEIsWUFBWSxFQUFFLElBQUk7TUFDbEIsTUFBTSxFQUFFLElBQUk7TUFDWixjQUFjLEVBQUUsUUFBUTtNQUN4QixRQUFRLEVBQUUsS0FBSztNQUNmLFlBQVksRUFBR0EsRUFBRTtJQUNuQixDQUFDLEVBQ0Q7TUFDRSxNQUFNLEVBQUUsYUFBYTtNQUNyQixPQUFPLEVBQUUsSUFBSTtNQUNiLE1BQU0sRUFBRSxhQUFhO01BQ3JCLFlBQVksRUFBRSxJQUFJO01BQ2xCLE1BQU0sRUFBRSxJQUFJO01BQ1osY0FBYyxFQUFFLFFBQVE7TUFDeEIsUUFBUSxFQUFFLEtBQUs7TUFDZixZQUFZLEVBQUdBLEVBQUU7SUFDbkIsQ0FBQyxFQUNEO01BQ0UsTUFBTSxFQUFFLGFBQWE7TUFDckIsT0FBTyxFQUFFLElBQUk7TUFDYixNQUFNLEVBQUUsV0FBVztNQUNuQixNQUFNLEVBQUUsSUFBSTtNQUNaLFlBQVksRUFBRTtJQUNoQixDQUFDO0VBRUwsQ0FBQztBQUNELENBQUMsQ0FBRSxDQUFDO0FBQ0o7QUFDQ0QsSUFBSSxXQUFXRSxJQUFJLEdBQUcsa0NBQWtDO0FBQ3pEQyxNQUFNLENBQUNDLE9BQU8sR0FBR0osSUFBSSJ9