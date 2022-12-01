/**
 * @flow
 */

/* eslint-disable */
'use strict';
/*::
import type { ReaderFragment } from 'relay-runtime';
type crossReferencedEventView_item$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type crossReferencedEventsView_nodes$ref: FragmentReference;
declare export opaque type crossReferencedEventsView_nodes$fragmentType: crossReferencedEventsView_nodes$ref;
export type crossReferencedEventsView_nodes = $ReadOnlyArray<{|
  +id: string,
  +referencedAt: any,
  +isCrossRepository: boolean,
  +actor: ?{|
    +login: string,
    +avatarUrl: any,
  |},
  +source: {|
    +__typename: string,
    +repository?: {|
      +name: string,
      +owner: {|
        +login: string
      |},
    |},
  |},
  +$fragmentRefs: crossReferencedEventView_item$ref,
  +$refType: crossReferencedEventsView_nodes$ref,
|}>;
export type crossReferencedEventsView_nodes$data = crossReferencedEventsView_nodes;
export type crossReferencedEventsView_nodes$key = $ReadOnlyArray<{
  +$data?: crossReferencedEventsView_nodes$data,
  +$fragmentRefs: crossReferencedEventsView_nodes$ref,
}>;
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
  };
  return {
    "kind": "Fragment",
    "name": "crossReferencedEventsView_nodes",
    "type": "CrossReferencedEvent",
    "metadata": {
      "plural": true
    },
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
      "name": "referencedAt",
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
      "name": "actor",
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
      }]
    }, {
      "kind": "FragmentSpread",
      "name": "crossReferencedEventView_item",
      "args": null
    }]
  };
}(); // prettier-ignore


node
/*: any*/
.hash = '5bbb7b39e10559bac4af2d6f9ff7a9e2';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi92aWV3cy90aW1lbGluZS1pdGVtcy9fX2dlbmVyYXRlZF9fL2Nyb3NzUmVmZXJlbmNlZEV2ZW50c1ZpZXdfbm9kZXMuZ3JhcGhxbC5qcyJdLCJuYW1lcyI6WyJub2RlIiwidjAiLCJoYXNoIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOztBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUdBLE1BQU1BO0FBQUk7QUFBQSxFQUF3QixZQUFVO0FBQzVDLE1BQUlDLEVBQUUsR0FBRztBQUNQLFlBQVEsYUFERDtBQUVQLGFBQVMsSUFGRjtBQUdQLFlBQVEsT0FIRDtBQUlQLFlBQVEsSUFKRDtBQUtQLGtCQUFjO0FBTFAsR0FBVDtBQU9BLFNBQU87QUFDTCxZQUFRLFVBREg7QUFFTCxZQUFRLGlDQUZIO0FBR0wsWUFBUSxzQkFISDtBQUlMLGdCQUFZO0FBQ1YsZ0JBQVU7QUFEQSxLQUpQO0FBT0wsMkJBQXVCLEVBUGxCO0FBUUwsa0JBQWMsQ0FDWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsSUFGWDtBQUdFLGNBQVEsSUFIVjtBQUlFLGNBQVEsSUFKVjtBQUtFLG9CQUFjO0FBTGhCLEtBRFksRUFRWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsSUFGWDtBQUdFLGNBQVEsY0FIVjtBQUlFLGNBQVEsSUFKVjtBQUtFLG9CQUFjO0FBTGhCLEtBUlksRUFlWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsSUFGWDtBQUdFLGNBQVEsbUJBSFY7QUFJRSxjQUFRLElBSlY7QUFLRSxvQkFBYztBQUxoQixLQWZZLEVBc0JaO0FBQ0UsY0FBUSxhQURWO0FBRUUsZUFBUyxJQUZYO0FBR0UsY0FBUSxPQUhWO0FBSUUsb0JBQWMsSUFKaEI7QUFLRSxjQUFRLElBTFY7QUFNRSxzQkFBZ0IsSUFObEI7QUFPRSxnQkFBVSxLQVBaO0FBUUUsb0JBQWMsQ0FDWEE7QUFBRTtBQURTLFFBRVo7QUFDRSxnQkFBUSxhQURWO0FBRUUsaUJBQVMsSUFGWDtBQUdFLGdCQUFRLFdBSFY7QUFJRSxnQkFBUSxJQUpWO0FBS0Usc0JBQWM7QUFMaEIsT0FGWTtBQVJoQixLQXRCWSxFQXlDWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsSUFGWDtBQUdFLGNBQVEsUUFIVjtBQUlFLG9CQUFjLElBSmhCO0FBS0UsY0FBUSxJQUxWO0FBTUUsc0JBQWdCLElBTmxCO0FBT0UsZ0JBQVUsS0FQWjtBQVFFLG9CQUFjLENBQ1o7QUFDRSxnQkFBUSxhQURWO0FBRUUsaUJBQVMsSUFGWDtBQUdFLGdCQUFRLFlBSFY7QUFJRSxnQkFBUSxJQUpWO0FBS0Usc0JBQWM7QUFMaEIsT0FEWSxFQVFaO0FBQ0UsZ0JBQVEsYUFEVjtBQUVFLGlCQUFTLElBRlg7QUFHRSxnQkFBUSxZQUhWO0FBSUUsc0JBQWMsSUFKaEI7QUFLRSxnQkFBUSxJQUxWO0FBTUUsd0JBQWdCLFlBTmxCO0FBT0Usa0JBQVUsS0FQWjtBQVFFLHNCQUFjLENBQ1o7QUFDRSxrQkFBUSxhQURWO0FBRUUsbUJBQVMsSUFGWDtBQUdFLGtCQUFRLE1BSFY7QUFJRSxrQkFBUSxJQUpWO0FBS0Usd0JBQWM7QUFMaEIsU0FEWSxFQVFaO0FBQ0Usa0JBQVEsYUFEVjtBQUVFLG1CQUFTLElBRlg7QUFHRSxrQkFBUSxPQUhWO0FBSUUsd0JBQWMsSUFKaEI7QUFLRSxrQkFBUSxJQUxWO0FBTUUsMEJBQWdCLElBTmxCO0FBT0Usb0JBQVUsS0FQWjtBQVFFLHdCQUFjLENBQ1hBO0FBQUU7QUFEUztBQVJoQixTQVJZO0FBUmhCLE9BUlk7QUFSaEIsS0F6Q1ksRUF5Rlo7QUFDRSxjQUFRLGdCQURWO0FBRUUsY0FBUSwrQkFGVjtBQUdFLGNBQVE7QUFIVixLQXpGWTtBQVJULEdBQVA7QUF3R0MsQ0FoSGdDLEVBQWpDLEMsQ0FpSEE7OztBQUNDRDtBQUFJO0FBQUwsQ0FBZ0JFLElBQWhCLEdBQXVCLGtDQUF2QjtBQUNBQyxNQUFNLENBQUNDLE9BQVAsR0FBaUJKLElBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmxvd1xuICovXG5cbi8qIGVzbGludC1kaXNhYmxlICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyo6OlxuaW1wb3J0IHR5cGUgeyBSZWFkZXJGcmFnbWVudCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xudHlwZSBjcm9zc1JlZmVyZW5jZWRFdmVudFZpZXdfaXRlbSRyZWYgPSBhbnk7XG5pbXBvcnQgdHlwZSB7IEZyYWdtZW50UmVmZXJlbmNlIH0gZnJvbSBcInJlbGF5LXJ1bnRpbWVcIjtcbmRlY2xhcmUgZXhwb3J0IG9wYXF1ZSB0eXBlIGNyb3NzUmVmZXJlbmNlZEV2ZW50c1ZpZXdfbm9kZXMkcmVmOiBGcmFnbWVudFJlZmVyZW5jZTtcbmRlY2xhcmUgZXhwb3J0IG9wYXF1ZSB0eXBlIGNyb3NzUmVmZXJlbmNlZEV2ZW50c1ZpZXdfbm9kZXMkZnJhZ21lbnRUeXBlOiBjcm9zc1JlZmVyZW5jZWRFdmVudHNWaWV3X25vZGVzJHJlZjtcbmV4cG9ydCB0eXBlIGNyb3NzUmVmZXJlbmNlZEV2ZW50c1ZpZXdfbm9kZXMgPSAkUmVhZE9ubHlBcnJheTx7fFxuICAraWQ6IHN0cmluZyxcbiAgK3JlZmVyZW5jZWRBdDogYW55LFxuICAraXNDcm9zc1JlcG9zaXRvcnk6IGJvb2xlYW4sXG4gICthY3RvcjogP3t8XG4gICAgK2xvZ2luOiBzdHJpbmcsXG4gICAgK2F2YXRhclVybDogYW55LFxuICB8fSxcbiAgK3NvdXJjZToge3xcbiAgICArX190eXBlbmFtZTogc3RyaW5nLFxuICAgICtyZXBvc2l0b3J5Pzoge3xcbiAgICAgICtuYW1lOiBzdHJpbmcsXG4gICAgICArb3duZXI6IHt8XG4gICAgICAgICtsb2dpbjogc3RyaW5nXG4gICAgICB8fSxcbiAgICB8fSxcbiAgfH0sXG4gICskZnJhZ21lbnRSZWZzOiBjcm9zc1JlZmVyZW5jZWRFdmVudFZpZXdfaXRlbSRyZWYsXG4gICskcmVmVHlwZTogY3Jvc3NSZWZlcmVuY2VkRXZlbnRzVmlld19ub2RlcyRyZWYsXG58fT47XG5leHBvcnQgdHlwZSBjcm9zc1JlZmVyZW5jZWRFdmVudHNWaWV3X25vZGVzJGRhdGEgPSBjcm9zc1JlZmVyZW5jZWRFdmVudHNWaWV3X25vZGVzO1xuZXhwb3J0IHR5cGUgY3Jvc3NSZWZlcmVuY2VkRXZlbnRzVmlld19ub2RlcyRrZXkgPSAkUmVhZE9ubHlBcnJheTx7XG4gICskZGF0YT86IGNyb3NzUmVmZXJlbmNlZEV2ZW50c1ZpZXdfbm9kZXMkZGF0YSxcbiAgKyRmcmFnbWVudFJlZnM6IGNyb3NzUmVmZXJlbmNlZEV2ZW50c1ZpZXdfbm9kZXMkcmVmLFxufT47XG4qL1xuXG5cbmNvbnN0IG5vZGUvKjogUmVhZGVyRnJhZ21lbnQqLyA9IChmdW5jdGlvbigpe1xudmFyIHYwID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcImxvZ2luXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufTtcbnJldHVybiB7XG4gIFwia2luZFwiOiBcIkZyYWdtZW50XCIsXG4gIFwibmFtZVwiOiBcImNyb3NzUmVmZXJlbmNlZEV2ZW50c1ZpZXdfbm9kZXNcIixcbiAgXCJ0eXBlXCI6IFwiQ3Jvc3NSZWZlcmVuY2VkRXZlbnRcIixcbiAgXCJtZXRhZGF0YVwiOiB7XG4gICAgXCJwbHVyYWxcIjogdHJ1ZVxuICB9LFxuICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogW10sXG4gIFwic2VsZWN0aW9uc1wiOiBbXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcImlkXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwicmVmZXJlbmNlZEF0XCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwiaXNDcm9zc1JlcG9zaXRvcnlcIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJhY3RvclwiLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICh2MC8qOiBhbnkqLyksXG4gICAgICAgIHtcbiAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICBcIm5hbWVcIjogXCJhdmF0YXJVcmxcIixcbiAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwic291cmNlXCIsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgIFwibmFtZVwiOiBcIl9fdHlwZW5hbWVcIixcbiAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgXCJuYW1lXCI6IFwicmVwb3NpdG9yeVwiLFxuICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUmVwb3NpdG9yeVwiLFxuICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibmFtZVwiLFxuICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwib3duZXJcIixcbiAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBudWxsLFxuICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAodjAvKjogYW55Ki8pXG4gICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkZyYWdtZW50U3ByZWFkXCIsXG4gICAgICBcIm5hbWVcIjogXCJjcm9zc1JlZmVyZW5jZWRFdmVudFZpZXdfaXRlbVwiLFxuICAgICAgXCJhcmdzXCI6IG51bGxcbiAgICB9XG4gIF1cbn07XG59KSgpO1xuLy8gcHJldHRpZXItaWdub3JlXG4obm9kZS8qOiBhbnkqLykuaGFzaCA9ICc1YmJiN2IzOWUxMDU1OWJhYzRhZjJkNmY5ZmY3YTllMic7XG5tb2R1bGUuZXhwb3J0cyA9IG5vZGU7XG4iXX0=