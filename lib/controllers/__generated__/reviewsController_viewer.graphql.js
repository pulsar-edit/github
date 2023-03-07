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
const node /*: ReaderFragment*/ = {
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
};
// prettier-ignore
node /*: any*/.hash = 'e9e4cf88f2d8a809620a0f225d502896';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJub2RlIiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwic291cmNlcyI6WyJyZXZpZXdzQ29udHJvbGxlcl92aWV3ZXIuZ3JhcGhxbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmbG93XG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKjo6XG5pbXBvcnQgdHlwZSB7IFJlYWRlckZyYWdtZW50IH0gZnJvbSAncmVsYXktcnVudGltZSc7XG5pbXBvcnQgdHlwZSB7IEZyYWdtZW50UmVmZXJlbmNlIH0gZnJvbSBcInJlbGF5LXJ1bnRpbWVcIjtcbmRlY2xhcmUgZXhwb3J0IG9wYXF1ZSB0eXBlIHJldmlld3NDb250cm9sbGVyX3ZpZXdlciRyZWY6IEZyYWdtZW50UmVmZXJlbmNlO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgcmV2aWV3c0NvbnRyb2xsZXJfdmlld2VyJGZyYWdtZW50VHlwZTogcmV2aWV3c0NvbnRyb2xsZXJfdmlld2VyJHJlZjtcbmV4cG9ydCB0eXBlIHJldmlld3NDb250cm9sbGVyX3ZpZXdlciA9IHt8XG4gICtpZDogc3RyaW5nLFxuICArbG9naW46IHN0cmluZyxcbiAgK2F2YXRhclVybDogYW55LFxuICArJHJlZlR5cGU6IHJldmlld3NDb250cm9sbGVyX3ZpZXdlciRyZWYsXG58fTtcbmV4cG9ydCB0eXBlIHJldmlld3NDb250cm9sbGVyX3ZpZXdlciRkYXRhID0gcmV2aWV3c0NvbnRyb2xsZXJfdmlld2VyO1xuZXhwb3J0IHR5cGUgcmV2aWV3c0NvbnRyb2xsZXJfdmlld2VyJGtleSA9IHtcbiAgKyRkYXRhPzogcmV2aWV3c0NvbnRyb2xsZXJfdmlld2VyJGRhdGEsXG4gICskZnJhZ21lbnRSZWZzOiByZXZpZXdzQ29udHJvbGxlcl92aWV3ZXIkcmVmLFxufTtcbiovXG5cblxuY29uc3Qgbm9kZS8qOiBSZWFkZXJGcmFnbWVudCovID0ge1xuICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICBcIm5hbWVcIjogXCJyZXZpZXdzQ29udHJvbGxlcl92aWV3ZXJcIixcbiAgXCJ0eXBlXCI6IFwiVXNlclwiLFxuICBcIm1ldGFkYXRhXCI6IG51bGwsXG4gIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiBbXSxcbiAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwiaWRcIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJsb2dpblwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcImF2YXRhclVybFwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH1cbiAgXVxufTtcbi8vIHByZXR0aWVyLWlnbm9yZVxuKG5vZGUvKjogYW55Ki8pLmhhc2ggPSAnZTllNGNmODhmMmQ4YTgwOTYyMGEwZjIyNWQ1MDI4OTYnO1xubW9kdWxlLmV4cG9ydHMgPSBub2RlO1xuIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsWUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0EsTUFBTUEsSUFBSSx3QkFBdUI7RUFDL0IsTUFBTSxFQUFFLFVBQVU7RUFDbEIsTUFBTSxFQUFFLDBCQUEwQjtFQUNsQyxNQUFNLEVBQUUsTUFBTTtFQUNkLFVBQVUsRUFBRSxJQUFJO0VBQ2hCLHFCQUFxQixFQUFFLEVBQUU7RUFDekIsWUFBWSxFQUFFLENBQ1o7SUFDRSxNQUFNLEVBQUUsYUFBYTtJQUNyQixPQUFPLEVBQUUsSUFBSTtJQUNiLE1BQU0sRUFBRSxJQUFJO0lBQ1osTUFBTSxFQUFFLElBQUk7SUFDWixZQUFZLEVBQUU7RUFDaEIsQ0FBQyxFQUNEO0lBQ0UsTUFBTSxFQUFFLGFBQWE7SUFDckIsT0FBTyxFQUFFLElBQUk7SUFDYixNQUFNLEVBQUUsT0FBTztJQUNmLE1BQU0sRUFBRSxJQUFJO0lBQ1osWUFBWSxFQUFFO0VBQ2hCLENBQUMsRUFDRDtJQUNFLE1BQU0sRUFBRSxhQUFhO0lBQ3JCLE9BQU8sRUFBRSxJQUFJO0lBQ2IsTUFBTSxFQUFFLFdBQVc7SUFDbkIsTUFBTSxFQUFFLElBQUk7SUFDWixZQUFZLEVBQUU7RUFDaEIsQ0FBQztBQUVMLENBQUM7QUFDRDtBQUNDQSxJQUFJLFdBQVdDLElBQUksR0FBRyxrQ0FBa0M7QUFDekRDLE1BQU0sQ0FBQ0MsT0FBTyxHQUFHSCxJQUFJIn0=