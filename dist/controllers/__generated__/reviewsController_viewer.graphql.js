/**
 * @flow
 */

/* eslint-disable */
'use strict';
/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type reviewsController_viewer$ref: FragmentReference;
declare export opaque type reviewsController_viewer$fragmentType: reviewsController_viewer$ref;
export type reviewsController_viewer = {|
  +id: string,
  +login: string,
  +avatarUrl: any,
  +$refType: reviewsController_viewer$ref,
|};
export type reviewsController_viewer$data = reviewsController_viewer;
export type reviewsController_viewer$key = {
  +$data?: reviewsController_viewer$data,
  +$fragmentRefs: reviewsController_viewer$ref,
};
*/

const node
/*: ReaderFragment*/
= {
  "kind": "Fragment",
  "name": "reviewsController_viewer",
  "type": "User",
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
    "name": "login",
    "args": null,
    "storageKey": null
  }, {
    "kind": "ScalarField",
    "alias": null,
    "name": "avatarUrl",
    "args": null,
    "storageKey": null
  }]
}; // prettier-ignore

node
/*: any*/
.hash = 'e9e4cf88f2d8a809620a0f225d502896';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9jb250cm9sbGVycy9fX2dlbmVyYXRlZF9fL3Jldmlld3NDb250cm9sbGVyX3ZpZXdlci5ncmFwaHFsLmpzIl0sIm5hbWVzIjpbIm5vZGUiLCJoYXNoIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOztBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUdBLE1BQU1BO0FBQUk7QUFBQSxFQUF1QjtBQUMvQixVQUFRLFVBRHVCO0FBRS9CLFVBQVEsMEJBRnVCO0FBRy9CLFVBQVEsTUFIdUI7QUFJL0IsY0FBWSxJQUptQjtBQUsvQix5QkFBdUIsRUFMUTtBQU0vQixnQkFBYyxDQUNaO0FBQ0UsWUFBUSxhQURWO0FBRUUsYUFBUyxJQUZYO0FBR0UsWUFBUSxJQUhWO0FBSUUsWUFBUSxJQUpWO0FBS0Usa0JBQWM7QUFMaEIsR0FEWSxFQVFaO0FBQ0UsWUFBUSxhQURWO0FBRUUsYUFBUyxJQUZYO0FBR0UsWUFBUSxPQUhWO0FBSUUsWUFBUSxJQUpWO0FBS0Usa0JBQWM7QUFMaEIsR0FSWSxFQWVaO0FBQ0UsWUFBUSxhQURWO0FBRUUsYUFBUyxJQUZYO0FBR0UsWUFBUSxXQUhWO0FBSUUsWUFBUSxJQUpWO0FBS0Usa0JBQWM7QUFMaEIsR0FmWTtBQU5pQixDQUFqQyxDLENBOEJBOztBQUNDQTtBQUFJO0FBQUwsQ0FBZ0JDLElBQWhCLEdBQXVCLGtDQUF2QjtBQUNBQyxNQUFNLENBQUNDLE9BQVAsR0FBaUJILElBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmxvd1xuICovXG5cbi8qIGVzbGludC1kaXNhYmxlICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyo6OlxuaW1wb3J0IHR5cGUgeyBSZWFkZXJGcmFnbWVudCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xuaW1wb3J0IHR5cGUgeyBGcmFnbWVudFJlZmVyZW5jZSB9IGZyb20gXCJyZWxheS1ydW50aW1lXCI7XG5kZWNsYXJlIGV4cG9ydCBvcGFxdWUgdHlwZSByZXZpZXdzQ29udHJvbGxlcl92aWV3ZXIkcmVmOiBGcmFnbWVudFJlZmVyZW5jZTtcbmRlY2xhcmUgZXhwb3J0IG9wYXF1ZSB0eXBlIHJldmlld3NDb250cm9sbGVyX3ZpZXdlciRmcmFnbWVudFR5cGU6IHJldmlld3NDb250cm9sbGVyX3ZpZXdlciRyZWY7XG5leHBvcnQgdHlwZSByZXZpZXdzQ29udHJvbGxlcl92aWV3ZXIgPSB7fFxuICAraWQ6IHN0cmluZyxcbiAgK2xvZ2luOiBzdHJpbmcsXG4gICthdmF0YXJVcmw6IGFueSxcbiAgKyRyZWZUeXBlOiByZXZpZXdzQ29udHJvbGxlcl92aWV3ZXIkcmVmLFxufH07XG5leHBvcnQgdHlwZSByZXZpZXdzQ29udHJvbGxlcl92aWV3ZXIkZGF0YSA9IHJldmlld3NDb250cm9sbGVyX3ZpZXdlcjtcbmV4cG9ydCB0eXBlIHJldmlld3NDb250cm9sbGVyX3ZpZXdlciRrZXkgPSB7XG4gICskZGF0YT86IHJldmlld3NDb250cm9sbGVyX3ZpZXdlciRkYXRhLFxuICArJGZyYWdtZW50UmVmczogcmV2aWV3c0NvbnRyb2xsZXJfdmlld2VyJHJlZixcbn07XG4qL1xuXG5cbmNvbnN0IG5vZGUvKjogUmVhZGVyRnJhZ21lbnQqLyA9IHtcbiAgXCJraW5kXCI6IFwiRnJhZ21lbnRcIixcbiAgXCJuYW1lXCI6IFwicmV2aWV3c0NvbnRyb2xsZXJfdmlld2VyXCIsXG4gIFwidHlwZVwiOiBcIlVzZXJcIixcbiAgXCJtZXRhZGF0YVwiOiBudWxsLFxuICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogW10sXG4gIFwic2VsZWN0aW9uc1wiOiBbXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcImlkXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwibG9naW5cIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJhdmF0YXJVcmxcIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9XG4gIF1cbn07XG4vLyBwcmV0dGllci1pZ25vcmVcbihub2RlLyo6IGFueSovKS5oYXNoID0gJ2U5ZTRjZjg4ZjJkOGE4MDk2MjBhMGYyMjVkNTAyODk2Jztcbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcbiJdfQ==