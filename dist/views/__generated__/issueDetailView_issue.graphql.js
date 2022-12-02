/**
 * @flow
 */

/* eslint-disable */
'use strict';
/*::
import type { ReaderFragment } from 'relay-runtime';
type emojiReactionsView_reactable$ref = any;
type issueTimelineController_issue$ref = any;
export type IssueState = "CLOSED" | "OPEN" | "%future added value";
import type { FragmentReference } from "relay-runtime";
declare export opaque type issueDetailView_issue$ref: FragmentReference;
declare export opaque type issueDetailView_issue$fragmentType: issueDetailView_issue$ref;
export type issueDetailView_issue = {|
  +id: string,
  +url: any,
  +state: IssueState,
  +number: number,
  +title: string,
  +bodyHTML: any,
  +author: ?{|
    +login: string,
    +avatarUrl: any,
    +url: any,
  |},
  +__typename: "Issue",
  +$fragmentRefs: issueTimelineController_issue$ref & emojiReactionsView_reactable$ref,
  +$refType: issueDetailView_issue$ref,
|};
export type issueDetailView_issue$data = issueDetailView_issue;
export type issueDetailView_issue$key = {
  +$data?: issueDetailView_issue$data,
  +$fragmentRefs: issueDetailView_issue$ref,
};
*/

const node
/*: ReaderFragment*/
= function () {
  var v0 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "url",
    "args": null,
    "storageKey": null
  };
  return {
    "kind": "Fragment",
    "name": "issueDetailView_issue",
    "type": "Issue",
    "metadata": null,
    "argumentDefinitions": [{
      "kind": "LocalArgument",
      "name": "timelineCount",
      "type": "Int!",
      "defaultValue": null
    }, {
      "kind": "LocalArgument",
      "name": "timelineCursor",
      "type": "String",
      "defaultValue": null
    }],
    "selections": [{
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    }, {
      "kind": "ScalarField",
      "alias": null,
      "name": "__typename",
      "args": null,
      "storageKey": null
    }, v0
    /*: any*/
    , {
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
      "kind": "ScalarField",
      "alias": null,
      "name": "bodyHTML",
      "args": null,
      "storageKey": null
    }, {
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
        "name": "login",
        "args": null,
        "storageKey": null
      }, {
        "kind": "ScalarField",
        "alias": null,
        "name": "avatarUrl",
        "args": null,
        "storageKey": null
      }, v0
      /*: any*/
      ]
    }, {
      "kind": "FragmentSpread",
      "name": "issueTimelineController_issue",
      "args": [{
        "kind": "Variable",
        "name": "timelineCount",
        "variableName": "timelineCount"
      }, {
        "kind": "Variable",
        "name": "timelineCursor",
        "variableName": "timelineCursor"
      }]
    }, {
      "kind": "FragmentSpread",
      "name": "emojiReactionsView_reactable",
      "args": null
    }]
  };
}(); // prettier-ignore


node
/*: any*/
.hash = 'f7adc2e75c1d55df78481fd359bf7180';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi92aWV3cy9fX2dlbmVyYXRlZF9fL2lzc3VlRGV0YWlsVmlld19pc3N1ZS5ncmFwaHFsLmpzIl0sIm5hbWVzIjpbIm5vZGUiLCJ2MCIsImhhc2giLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQSxNQUFNQTtBQUFJO0FBQUEsRUFBd0IsWUFBVTtBQUM1QyxNQUFJQyxFQUFFLEdBQUc7QUFDUCxZQUFRLGFBREQ7QUFFUCxhQUFTLElBRkY7QUFHUCxZQUFRLEtBSEQ7QUFJUCxZQUFRLElBSkQ7QUFLUCxrQkFBYztBQUxQLEdBQVQ7QUFPQSxTQUFPO0FBQ0wsWUFBUSxVQURIO0FBRUwsWUFBUSx1QkFGSDtBQUdMLFlBQVEsT0FISDtBQUlMLGdCQUFZLElBSlA7QUFLTCwyQkFBdUIsQ0FDckI7QUFDRSxjQUFRLGVBRFY7QUFFRSxjQUFRLGVBRlY7QUFHRSxjQUFRLE1BSFY7QUFJRSxzQkFBZ0I7QUFKbEIsS0FEcUIsRUFPckI7QUFDRSxjQUFRLGVBRFY7QUFFRSxjQUFRLGdCQUZWO0FBR0UsY0FBUSxRQUhWO0FBSUUsc0JBQWdCO0FBSmxCLEtBUHFCLENBTGxCO0FBbUJMLGtCQUFjLENBQ1o7QUFDRSxjQUFRLGFBRFY7QUFFRSxlQUFTLElBRlg7QUFHRSxjQUFRLElBSFY7QUFJRSxjQUFRLElBSlY7QUFLRSxvQkFBYztBQUxoQixLQURZLEVBUVo7QUFDRSxjQUFRLGFBRFY7QUFFRSxlQUFTLElBRlg7QUFHRSxjQUFRLFlBSFY7QUFJRSxjQUFRLElBSlY7QUFLRSxvQkFBYztBQUxoQixLQVJZLEVBZVhBO0FBQUU7QUFmUyxNQWdCWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsSUFGWDtBQUdFLGNBQVEsT0FIVjtBQUlFLGNBQVEsSUFKVjtBQUtFLG9CQUFjO0FBTGhCLEtBaEJZLEVBdUJaO0FBQ0UsY0FBUSxhQURWO0FBRUUsZUFBUyxJQUZYO0FBR0UsY0FBUSxRQUhWO0FBSUUsY0FBUSxJQUpWO0FBS0Usb0JBQWM7QUFMaEIsS0F2QlksRUE4Qlo7QUFDRSxjQUFRLGFBRFY7QUFFRSxlQUFTLElBRlg7QUFHRSxjQUFRLE9BSFY7QUFJRSxjQUFRLElBSlY7QUFLRSxvQkFBYztBQUxoQixLQTlCWSxFQXFDWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsSUFGWDtBQUdFLGNBQVEsVUFIVjtBQUlFLGNBQVEsSUFKVjtBQUtFLG9CQUFjO0FBTGhCLEtBckNZLEVBNENaO0FBQ0UsY0FBUSxhQURWO0FBRUUsZUFBUyxJQUZYO0FBR0UsY0FBUSxRQUhWO0FBSUUsb0JBQWMsSUFKaEI7QUFLRSxjQUFRLElBTFY7QUFNRSxzQkFBZ0IsSUFObEI7QUFPRSxnQkFBVSxLQVBaO0FBUUUsb0JBQWMsQ0FDWjtBQUNFLGdCQUFRLGFBRFY7QUFFRSxpQkFBUyxJQUZYO0FBR0UsZ0JBQVEsT0FIVjtBQUlFLGdCQUFRLElBSlY7QUFLRSxzQkFBYztBQUxoQixPQURZLEVBUVo7QUFDRSxnQkFBUSxhQURWO0FBRUUsaUJBQVMsSUFGWDtBQUdFLGdCQUFRLFdBSFY7QUFJRSxnQkFBUSxJQUpWO0FBS0Usc0JBQWM7QUFMaEIsT0FSWSxFQWVYQTtBQUFFO0FBZlM7QUFSaEIsS0E1Q1ksRUFzRVo7QUFDRSxjQUFRLGdCQURWO0FBRUUsY0FBUSwrQkFGVjtBQUdFLGNBQVEsQ0FDTjtBQUNFLGdCQUFRLFVBRFY7QUFFRSxnQkFBUSxlQUZWO0FBR0Usd0JBQWdCO0FBSGxCLE9BRE0sRUFNTjtBQUNFLGdCQUFRLFVBRFY7QUFFRSxnQkFBUSxnQkFGVjtBQUdFLHdCQUFnQjtBQUhsQixPQU5NO0FBSFYsS0F0RVksRUFzRlo7QUFDRSxjQUFRLGdCQURWO0FBRUUsY0FBUSw4QkFGVjtBQUdFLGNBQVE7QUFIVixLQXRGWTtBQW5CVCxHQUFQO0FBZ0hDLENBeEhnQyxFQUFqQyxDLENBeUhBOzs7QUFDQ0Q7QUFBSTtBQUFMLENBQWdCRSxJQUFoQixHQUF1QixrQ0FBdkI7QUFDQUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCSixJQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZsb3dcbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qOjpcbmltcG9ydCB0eXBlIHsgUmVhZGVyRnJhZ21lbnQgfSBmcm9tICdyZWxheS1ydW50aW1lJztcbnR5cGUgZW1vamlSZWFjdGlvbnNWaWV3X3JlYWN0YWJsZSRyZWYgPSBhbnk7XG50eXBlIGlzc3VlVGltZWxpbmVDb250cm9sbGVyX2lzc3VlJHJlZiA9IGFueTtcbmV4cG9ydCB0eXBlIElzc3VlU3RhdGUgPSBcIkNMT1NFRFwiIHwgXCJPUEVOXCIgfCBcIiVmdXR1cmUgYWRkZWQgdmFsdWVcIjtcbmltcG9ydCB0eXBlIHsgRnJhZ21lbnRSZWZlcmVuY2UgfSBmcm9tIFwicmVsYXktcnVudGltZVwiO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgaXNzdWVEZXRhaWxWaWV3X2lzc3VlJHJlZjogRnJhZ21lbnRSZWZlcmVuY2U7XG5kZWNsYXJlIGV4cG9ydCBvcGFxdWUgdHlwZSBpc3N1ZURldGFpbFZpZXdfaXNzdWUkZnJhZ21lbnRUeXBlOiBpc3N1ZURldGFpbFZpZXdfaXNzdWUkcmVmO1xuZXhwb3J0IHR5cGUgaXNzdWVEZXRhaWxWaWV3X2lzc3VlID0ge3xcbiAgK2lkOiBzdHJpbmcsXG4gICt1cmw6IGFueSxcbiAgK3N0YXRlOiBJc3N1ZVN0YXRlLFxuICArbnVtYmVyOiBudW1iZXIsXG4gICt0aXRsZTogc3RyaW5nLFxuICArYm9keUhUTUw6IGFueSxcbiAgK2F1dGhvcjogP3t8XG4gICAgK2xvZ2luOiBzdHJpbmcsXG4gICAgK2F2YXRhclVybDogYW55LFxuICAgICt1cmw6IGFueSxcbiAgfH0sXG4gICtfX3R5cGVuYW1lOiBcIklzc3VlXCIsXG4gICskZnJhZ21lbnRSZWZzOiBpc3N1ZVRpbWVsaW5lQ29udHJvbGxlcl9pc3N1ZSRyZWYgJiBlbW9qaVJlYWN0aW9uc1ZpZXdfcmVhY3RhYmxlJHJlZixcbiAgKyRyZWZUeXBlOiBpc3N1ZURldGFpbFZpZXdfaXNzdWUkcmVmLFxufH07XG5leHBvcnQgdHlwZSBpc3N1ZURldGFpbFZpZXdfaXNzdWUkZGF0YSA9IGlzc3VlRGV0YWlsVmlld19pc3N1ZTtcbmV4cG9ydCB0eXBlIGlzc3VlRGV0YWlsVmlld19pc3N1ZSRrZXkgPSB7XG4gICskZGF0YT86IGlzc3VlRGV0YWlsVmlld19pc3N1ZSRkYXRhLFxuICArJGZyYWdtZW50UmVmczogaXNzdWVEZXRhaWxWaWV3X2lzc3VlJHJlZixcbn07XG4qL1xuXG5cbmNvbnN0IG5vZGUvKjogUmVhZGVyRnJhZ21lbnQqLyA9IChmdW5jdGlvbigpe1xudmFyIHYwID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcInVybFwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn07XG5yZXR1cm4ge1xuICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICBcIm5hbWVcIjogXCJpc3N1ZURldGFpbFZpZXdfaXNzdWVcIixcbiAgXCJ0eXBlXCI6IFwiSXNzdWVcIixcbiAgXCJtZXRhZGF0YVwiOiBudWxsLFxuICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogW1xuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICAgIFwibmFtZVwiOiBcInRpbWVsaW5lQ291bnRcIixcbiAgICAgIFwidHlwZVwiOiBcIkludCFcIixcbiAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICAgIFwibmFtZVwiOiBcInRpbWVsaW5lQ3Vyc29yXCIsXG4gICAgICBcInR5cGVcIjogXCJTdHJpbmdcIixcbiAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgICB9XG4gIF0sXG4gIFwic2VsZWN0aW9uc1wiOiBbXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcImlkXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwiX190eXBlbmFtZVwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH0sXG4gICAgKHYwLyo6IGFueSovKSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwic3RhdGVcIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJudW1iZXJcIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJ0aXRsZVwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcImJvZHlIVE1MXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwiYXV0aG9yXCIsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgIFwibmFtZVwiOiBcImxvZ2luXCIsXG4gICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgIFwibmFtZVwiOiBcImF2YXRhclVybFwiLFxuICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgIH0sXG4gICAgICAgICh2MC8qOiBhbnkqLylcbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkZyYWdtZW50U3ByZWFkXCIsXG4gICAgICBcIm5hbWVcIjogXCJpc3N1ZVRpbWVsaW5lQ29udHJvbGxlcl9pc3N1ZVwiLFxuICAgICAgXCJhcmdzXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgICAgICAgXCJuYW1lXCI6IFwidGltZWxpbmVDb3VudFwiLFxuICAgICAgICAgIFwidmFyaWFibGVOYW1lXCI6IFwidGltZWxpbmVDb3VudFwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgICAgICAgIFwibmFtZVwiOiBcInRpbWVsaW5lQ3Vyc29yXCIsXG4gICAgICAgICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJ0aW1lbGluZUN1cnNvclwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkZyYWdtZW50U3ByZWFkXCIsXG4gICAgICBcIm5hbWVcIjogXCJlbW9qaVJlYWN0aW9uc1ZpZXdfcmVhY3RhYmxlXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbFxuICAgIH1cbiAgXVxufTtcbn0pKCk7XG4vLyBwcmV0dGllci1pZ25vcmVcbihub2RlLyo6IGFueSovKS5oYXNoID0gJ2Y3YWRjMmU3NWMxZDU1ZGY3ODQ4MWZkMzU5YmY3MTgwJztcbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcbiJdfQ==