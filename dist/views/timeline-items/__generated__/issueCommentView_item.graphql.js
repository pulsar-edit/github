/**
 * @flow
 */

/* eslint-disable */
'use strict';
/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type issueCommentView_item$ref: FragmentReference;
declare export opaque type issueCommentView_item$fragmentType: issueCommentView_item$ref;
export type issueCommentView_item = {|
  +author: ?{|
    +avatarUrl: any,
    +login: string,
  |},
  +bodyHTML: any,
  +createdAt: any,
  +url: any,
  +$refType: issueCommentView_item$ref,
|};
export type issueCommentView_item$data = issueCommentView_item;
export type issueCommentView_item$key = {
  +$data?: issueCommentView_item$data,
  +$fragmentRefs: issueCommentView_item$ref,
};
*/

const node
/*: ReaderFragment*/
= {
  "kind": "Fragment",
  "name": "issueCommentView_item",
  "type": "IssueComment",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [{
    "kind": "LinkedField",
    "alias": null,
    "name": "author",
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
    "kind": "ScalarField",
    "alias": null,
    "name": "bodyHTML",
    "args": null,
    "storageKey": null
  }, {
    "kind": "ScalarField",
    "alias": null,
    "name": "createdAt",
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
.hash = 'adc36c52f51de14256693ab9e4eb84bb';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi92aWV3cy90aW1lbGluZS1pdGVtcy9fX2dlbmVyYXRlZF9fL2lzc3VlQ29tbWVudFZpZXdfaXRlbS5ncmFwaHFsLmpzIl0sIm5hbWVzIjpbIm5vZGUiLCJoYXNoIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOztBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0EsTUFBTUE7QUFBSTtBQUFBLEVBQXVCO0FBQy9CLFVBQVEsVUFEdUI7QUFFL0IsVUFBUSx1QkFGdUI7QUFHL0IsVUFBUSxjQUh1QjtBQUkvQixjQUFZLElBSm1CO0FBSy9CLHlCQUF1QixFQUxRO0FBTS9CLGdCQUFjLENBQ1o7QUFDRSxZQUFRLGFBRFY7QUFFRSxhQUFTLElBRlg7QUFHRSxZQUFRLFFBSFY7QUFJRSxrQkFBYyxJQUpoQjtBQUtFLFlBQVEsSUFMVjtBQU1FLG9CQUFnQixJQU5sQjtBQU9FLGNBQVUsS0FQWjtBQVFFLGtCQUFjLENBQ1o7QUFDRSxjQUFRLGFBRFY7QUFFRSxlQUFTLElBRlg7QUFHRSxjQUFRLFdBSFY7QUFJRSxjQUFRLElBSlY7QUFLRSxvQkFBYztBQUxoQixLQURZLEVBUVo7QUFDRSxjQUFRLGFBRFY7QUFFRSxlQUFTLElBRlg7QUFHRSxjQUFRLE9BSFY7QUFJRSxjQUFRLElBSlY7QUFLRSxvQkFBYztBQUxoQixLQVJZO0FBUmhCLEdBRFksRUEwQlo7QUFDRSxZQUFRLGFBRFY7QUFFRSxhQUFTLElBRlg7QUFHRSxZQUFRLFVBSFY7QUFJRSxZQUFRLElBSlY7QUFLRSxrQkFBYztBQUxoQixHQTFCWSxFQWlDWjtBQUNFLFlBQVEsYUFEVjtBQUVFLGFBQVMsSUFGWDtBQUdFLFlBQVEsV0FIVjtBQUlFLFlBQVEsSUFKVjtBQUtFLGtCQUFjO0FBTGhCLEdBakNZLEVBd0NaO0FBQ0UsWUFBUSxhQURWO0FBRUUsYUFBUyxJQUZYO0FBR0UsWUFBUSxLQUhWO0FBSUUsWUFBUSxJQUpWO0FBS0Usa0JBQWM7QUFMaEIsR0F4Q1k7QUFOaUIsQ0FBakMsQyxDQXVEQTs7QUFDQ0E7QUFBSTtBQUFMLENBQWdCQyxJQUFoQixHQUF1QixrQ0FBdkI7QUFDQUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCSCxJQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZsb3dcbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qOjpcbmltcG9ydCB0eXBlIHsgUmVhZGVyRnJhZ21lbnQgfSBmcm9tICdyZWxheS1ydW50aW1lJztcbmltcG9ydCB0eXBlIHsgRnJhZ21lbnRSZWZlcmVuY2UgfSBmcm9tIFwicmVsYXktcnVudGltZVwiO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgaXNzdWVDb21tZW50Vmlld19pdGVtJHJlZjogRnJhZ21lbnRSZWZlcmVuY2U7XG5kZWNsYXJlIGV4cG9ydCBvcGFxdWUgdHlwZSBpc3N1ZUNvbW1lbnRWaWV3X2l0ZW0kZnJhZ21lbnRUeXBlOiBpc3N1ZUNvbW1lbnRWaWV3X2l0ZW0kcmVmO1xuZXhwb3J0IHR5cGUgaXNzdWVDb21tZW50Vmlld19pdGVtID0ge3xcbiAgK2F1dGhvcjogP3t8XG4gICAgK2F2YXRhclVybDogYW55LFxuICAgICtsb2dpbjogc3RyaW5nLFxuICB8fSxcbiAgK2JvZHlIVE1MOiBhbnksXG4gICtjcmVhdGVkQXQ6IGFueSxcbiAgK3VybDogYW55LFxuICArJHJlZlR5cGU6IGlzc3VlQ29tbWVudFZpZXdfaXRlbSRyZWYsXG58fTtcbmV4cG9ydCB0eXBlIGlzc3VlQ29tbWVudFZpZXdfaXRlbSRkYXRhID0gaXNzdWVDb21tZW50Vmlld19pdGVtO1xuZXhwb3J0IHR5cGUgaXNzdWVDb21tZW50Vmlld19pdGVtJGtleSA9IHtcbiAgKyRkYXRhPzogaXNzdWVDb21tZW50Vmlld19pdGVtJGRhdGEsXG4gICskZnJhZ21lbnRSZWZzOiBpc3N1ZUNvbW1lbnRWaWV3X2l0ZW0kcmVmLFxufTtcbiovXG5cblxuY29uc3Qgbm9kZS8qOiBSZWFkZXJGcmFnbWVudCovID0ge1xuICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICBcIm5hbWVcIjogXCJpc3N1ZUNvbW1lbnRWaWV3X2l0ZW1cIixcbiAgXCJ0eXBlXCI6IFwiSXNzdWVDb21tZW50XCIsXG4gIFwibWV0YWRhdGFcIjogbnVsbCxcbiAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6IFtdLFxuICBcInNlbGVjdGlvbnNcIjogW1xuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJhdXRob3JcIixcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcImNvbmNyZXRlVHlwZVwiOiBudWxsLFxuICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgXCJuYW1lXCI6IFwiYXZhdGFyVXJsXCIsXG4gICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgIFwibmFtZVwiOiBcImxvZ2luXCIsXG4gICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcImJvZHlIVE1MXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwiY3JlYXRlZEF0XCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwidXJsXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfVxuICBdXG59O1xuLy8gcHJldHRpZXItaWdub3JlXG4obm9kZS8qOiBhbnkqLykuaGFzaCA9ICdhZGMzNmM1MmY1MWRlMTQyNTY2OTNhYjllNGViODRiYic7XG5tb2R1bGUuZXhwb3J0cyA9IG5vZGU7XG4iXX0=