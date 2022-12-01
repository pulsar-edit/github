/**
 * @flow
 */

/* eslint-disable */
'use strict';
/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type commitView_commit$ref: FragmentReference;
declare export opaque type commitView_commit$fragmentType: commitView_commit$ref;
export type commitView_commit = {|
  +author: ?{|
    +name: ?string,
    +avatarUrl: any,
    +user: ?{|
      +login: string
    |},
  |},
  +committer: ?{|
    +name: ?string,
    +avatarUrl: any,
    +user: ?{|
      +login: string
    |},
  |},
  +authoredByCommitter: boolean,
  +sha: any,
  +message: string,
  +messageHeadlineHTML: any,
  +commitUrl: any,
  +$refType: commitView_commit$ref,
|};
export type commitView_commit$data = commitView_commit;
export type commitView_commit$key = {
  +$data?: commitView_commit$data,
  +$fragmentRefs: commitView_commit$ref,
};
*/

const node
/*: ReaderFragment*/
= function () {
  var v0 = [{
    "kind": "ScalarField",
    "alias": null,
    "name": "name",
    "args": null,
    "storageKey": null
  }, {
    "kind": "ScalarField",
    "alias": null,
    "name": "avatarUrl",
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
  }];
  return {
    "kind": "Fragment",
    "name": "commitView_commit",
    "type": "Commit",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [{
      "kind": "LinkedField",
      "alias": null,
      "name": "author",
      "storageKey": null,
      "args": null,
      "concreteType": "GitActor",
      "plural": false,
      "selections": v0
      /*: any*/

    }, {
      "kind": "LinkedField",
      "alias": null,
      "name": "committer",
      "storageKey": null,
      "args": null,
      "concreteType": "GitActor",
      "plural": false,
      "selections": v0
      /*: any*/

    }, {
      "kind": "ScalarField",
      "alias": null,
      "name": "authoredByCommitter",
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
      "name": "message",
      "args": null,
      "storageKey": null
    }, {
      "kind": "ScalarField",
      "alias": null,
      "name": "messageHeadlineHTML",
      "args": null,
      "storageKey": null
    }, {
      "kind": "ScalarField",
      "alias": null,
      "name": "commitUrl",
      "args": null,
      "storageKey": null
    }]
  };
}(); // prettier-ignore


node
/*: any*/
.hash = '9d2823ee95f39173f656043ddfc8d47c';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi92aWV3cy90aW1lbGluZS1pdGVtcy9fX2dlbmVyYXRlZF9fL2NvbW1pdFZpZXdfY29tbWl0LmdyYXBocWwuanMiXSwibmFtZXMiOlsibm9kZSIsInYwIiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUdBLE1BQU1BO0FBQUk7QUFBQSxFQUF3QixZQUFVO0FBQzVDLE1BQUlDLEVBQUUsR0FBRyxDQUNQO0FBQ0UsWUFBUSxhQURWO0FBRUUsYUFBUyxJQUZYO0FBR0UsWUFBUSxNQUhWO0FBSUUsWUFBUSxJQUpWO0FBS0Usa0JBQWM7QUFMaEIsR0FETyxFQVFQO0FBQ0UsWUFBUSxhQURWO0FBRUUsYUFBUyxJQUZYO0FBR0UsWUFBUSxXQUhWO0FBSUUsWUFBUSxJQUpWO0FBS0Usa0JBQWM7QUFMaEIsR0FSTyxFQWVQO0FBQ0UsWUFBUSxhQURWO0FBRUUsYUFBUyxJQUZYO0FBR0UsWUFBUSxNQUhWO0FBSUUsa0JBQWMsSUFKaEI7QUFLRSxZQUFRLElBTFY7QUFNRSxvQkFBZ0IsTUFObEI7QUFPRSxjQUFVLEtBUFo7QUFRRSxrQkFBYyxDQUNaO0FBQ0UsY0FBUSxhQURWO0FBRUUsZUFBUyxJQUZYO0FBR0UsY0FBUSxPQUhWO0FBSUUsY0FBUSxJQUpWO0FBS0Usb0JBQWM7QUFMaEIsS0FEWTtBQVJoQixHQWZPLENBQVQ7QUFrQ0EsU0FBTztBQUNMLFlBQVEsVUFESDtBQUVMLFlBQVEsbUJBRkg7QUFHTCxZQUFRLFFBSEg7QUFJTCxnQkFBWSxJQUpQO0FBS0wsMkJBQXVCLEVBTGxCO0FBTUwsa0JBQWMsQ0FDWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsSUFGWDtBQUdFLGNBQVEsUUFIVjtBQUlFLG9CQUFjLElBSmhCO0FBS0UsY0FBUSxJQUxWO0FBTUUsc0JBQWdCLFVBTmxCO0FBT0UsZ0JBQVUsS0FQWjtBQVFFLG9CQUFlQTtBQUFFOztBQVJuQixLQURZLEVBV1o7QUFDRSxjQUFRLGFBRFY7QUFFRSxlQUFTLElBRlg7QUFHRSxjQUFRLFdBSFY7QUFJRSxvQkFBYyxJQUpoQjtBQUtFLGNBQVEsSUFMVjtBQU1FLHNCQUFnQixVQU5sQjtBQU9FLGdCQUFVLEtBUFo7QUFRRSxvQkFBZUE7QUFBRTs7QUFSbkIsS0FYWSxFQXFCWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsSUFGWDtBQUdFLGNBQVEscUJBSFY7QUFJRSxjQUFRLElBSlY7QUFLRSxvQkFBYztBQUxoQixLQXJCWSxFQTRCWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsS0FGWDtBQUdFLGNBQVEsS0FIVjtBQUlFLGNBQVEsSUFKVjtBQUtFLG9CQUFjO0FBTGhCLEtBNUJZLEVBbUNaO0FBQ0UsY0FBUSxhQURWO0FBRUUsZUFBUyxJQUZYO0FBR0UsY0FBUSxTQUhWO0FBSUUsY0FBUSxJQUpWO0FBS0Usb0JBQWM7QUFMaEIsS0FuQ1ksRUEwQ1o7QUFDRSxjQUFRLGFBRFY7QUFFRSxlQUFTLElBRlg7QUFHRSxjQUFRLHFCQUhWO0FBSUUsY0FBUSxJQUpWO0FBS0Usb0JBQWM7QUFMaEIsS0ExQ1ksRUFpRFo7QUFDRSxjQUFRLGFBRFY7QUFFRSxlQUFTLElBRlg7QUFHRSxjQUFRLFdBSFY7QUFJRSxjQUFRLElBSlY7QUFLRSxvQkFBYztBQUxoQixLQWpEWTtBQU5ULEdBQVA7QUFnRUMsQ0FuR2dDLEVBQWpDLEMsQ0FvR0E7OztBQUNDRDtBQUFJO0FBQUwsQ0FBZ0JFLElBQWhCLEdBQXVCLGtDQUF2QjtBQUNBQyxNQUFNLENBQUNDLE9BQVAsR0FBaUJKLElBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmxvd1xuICovXG5cbi8qIGVzbGludC1kaXNhYmxlICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyo6OlxuaW1wb3J0IHR5cGUgeyBSZWFkZXJGcmFnbWVudCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xuaW1wb3J0IHR5cGUgeyBGcmFnbWVudFJlZmVyZW5jZSB9IGZyb20gXCJyZWxheS1ydW50aW1lXCI7XG5kZWNsYXJlIGV4cG9ydCBvcGFxdWUgdHlwZSBjb21taXRWaWV3X2NvbW1pdCRyZWY6IEZyYWdtZW50UmVmZXJlbmNlO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgY29tbWl0Vmlld19jb21taXQkZnJhZ21lbnRUeXBlOiBjb21taXRWaWV3X2NvbW1pdCRyZWY7XG5leHBvcnQgdHlwZSBjb21taXRWaWV3X2NvbW1pdCA9IHt8XG4gICthdXRob3I6ID97fFxuICAgICtuYW1lOiA/c3RyaW5nLFxuICAgICthdmF0YXJVcmw6IGFueSxcbiAgICArdXNlcjogP3t8XG4gICAgICArbG9naW46IHN0cmluZ1xuICAgIHx9LFxuICB8fSxcbiAgK2NvbW1pdHRlcjogP3t8XG4gICAgK25hbWU6ID9zdHJpbmcsXG4gICAgK2F2YXRhclVybDogYW55LFxuICAgICt1c2VyOiA/e3xcbiAgICAgICtsb2dpbjogc3RyaW5nXG4gICAgfH0sXG4gIHx9LFxuICArYXV0aG9yZWRCeUNvbW1pdHRlcjogYm9vbGVhbixcbiAgK3NoYTogYW55LFxuICArbWVzc2FnZTogc3RyaW5nLFxuICArbWVzc2FnZUhlYWRsaW5lSFRNTDogYW55LFxuICArY29tbWl0VXJsOiBhbnksXG4gICskcmVmVHlwZTogY29tbWl0Vmlld19jb21taXQkcmVmLFxufH07XG5leHBvcnQgdHlwZSBjb21taXRWaWV3X2NvbW1pdCRkYXRhID0gY29tbWl0Vmlld19jb21taXQ7XG5leHBvcnQgdHlwZSBjb21taXRWaWV3X2NvbW1pdCRrZXkgPSB7XG4gICskZGF0YT86IGNvbW1pdFZpZXdfY29tbWl0JGRhdGEsXG4gICskZnJhZ21lbnRSZWZzOiBjb21taXRWaWV3X2NvbW1pdCRyZWYsXG59O1xuKi9cblxuXG5jb25zdCBub2RlLyo6IFJlYWRlckZyYWdtZW50Ki8gPSAoZnVuY3Rpb24oKXtcbnZhciB2MCA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgXCJhbGlhc1wiOiBudWxsLFxuICAgIFwibmFtZVwiOiBcIm5hbWVcIixcbiAgICBcImFyZ3NcIjogbnVsbCxcbiAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICB9LFxuICB7XG4gICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgXCJuYW1lXCI6IFwiYXZhdGFyVXJsXCIsXG4gICAgXCJhcmdzXCI6IG51bGwsXG4gICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgfSxcbiAge1xuICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgXCJhbGlhc1wiOiBudWxsLFxuICAgIFwibmFtZVwiOiBcInVzZXJcIixcbiAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICBcImFyZ3NcIjogbnVsbCxcbiAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlVzZXJcIixcbiAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAge1xuICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgIFwibmFtZVwiOiBcImxvZ2luXCIsXG4gICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgfVxuICAgIF1cbiAgfVxuXTtcbnJldHVybiB7XG4gIFwia2luZFwiOiBcIkZyYWdtZW50XCIsXG4gIFwibmFtZVwiOiBcImNvbW1pdFZpZXdfY29tbWl0XCIsXG4gIFwidHlwZVwiOiBcIkNvbW1pdFwiLFxuICBcIm1ldGFkYXRhXCI6IG51bGwsXG4gIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiBbXSxcbiAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwiYXV0aG9yXCIsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJHaXRBY3RvclwiLFxuICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICBcInNlbGVjdGlvbnNcIjogKHYwLyo6IGFueSovKVxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcImNvbW1pdHRlclwiLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiR2l0QWN0b3JcIixcbiAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgXCJzZWxlY3Rpb25zXCI6ICh2MC8qOiBhbnkqLylcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJhdXRob3JlZEJ5Q29tbWl0dGVyXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBcInNoYVwiLFxuICAgICAgXCJuYW1lXCI6IFwib2lkXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwibWVzc2FnZVwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcIm1lc3NhZ2VIZWFkbGluZUhUTUxcIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJjb21taXRVcmxcIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9XG4gIF1cbn07XG59KSgpO1xuLy8gcHJldHRpZXItaWdub3JlXG4obm9kZS8qOiBhbnkqLykuaGFzaCA9ICc5ZDI4MjNlZTk1ZjM5MTczZjY1NjA0M2RkZmM4ZDQ3Yyc7XG5tb2R1bGUuZXhwb3J0cyA9IG5vZGU7XG4iXX0=