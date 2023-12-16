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
const node /*: ReaderFragment*/ = {
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
};
// prettier-ignore
node /*: any*/.hash = 'adc36c52f51de14256693ab9e4eb84bb';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJub2RlIiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwic291cmNlcyI6WyJpc3N1ZUNvbW1lbnRWaWV3X2l0ZW0uZ3JhcGhxbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmbG93XG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKjo6XG5pbXBvcnQgdHlwZSB7IFJlYWRlckZyYWdtZW50IH0gZnJvbSAncmVsYXktcnVudGltZSc7XG5pbXBvcnQgdHlwZSB7IEZyYWdtZW50UmVmZXJlbmNlIH0gZnJvbSBcInJlbGF5LXJ1bnRpbWVcIjtcbmRlY2xhcmUgZXhwb3J0IG9wYXF1ZSB0eXBlIGlzc3VlQ29tbWVudFZpZXdfaXRlbSRyZWY6IEZyYWdtZW50UmVmZXJlbmNlO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgaXNzdWVDb21tZW50Vmlld19pdGVtJGZyYWdtZW50VHlwZTogaXNzdWVDb21tZW50Vmlld19pdGVtJHJlZjtcbmV4cG9ydCB0eXBlIGlzc3VlQ29tbWVudFZpZXdfaXRlbSA9IHt8XG4gICthdXRob3I6ID97fFxuICAgICthdmF0YXJVcmw6IGFueSxcbiAgICArbG9naW46IHN0cmluZyxcbiAgfH0sXG4gICtib2R5SFRNTDogYW55LFxuICArY3JlYXRlZEF0OiBhbnksXG4gICt1cmw6IGFueSxcbiAgKyRyZWZUeXBlOiBpc3N1ZUNvbW1lbnRWaWV3X2l0ZW0kcmVmLFxufH07XG5leHBvcnQgdHlwZSBpc3N1ZUNvbW1lbnRWaWV3X2l0ZW0kZGF0YSA9IGlzc3VlQ29tbWVudFZpZXdfaXRlbTtcbmV4cG9ydCB0eXBlIGlzc3VlQ29tbWVudFZpZXdfaXRlbSRrZXkgPSB7XG4gICskZGF0YT86IGlzc3VlQ29tbWVudFZpZXdfaXRlbSRkYXRhLFxuICArJGZyYWdtZW50UmVmczogaXNzdWVDb21tZW50Vmlld19pdGVtJHJlZixcbn07XG4qL1xuXG5cbmNvbnN0IG5vZGUvKjogUmVhZGVyRnJhZ21lbnQqLyA9IHtcbiAgXCJraW5kXCI6IFwiRnJhZ21lbnRcIixcbiAgXCJuYW1lXCI6IFwiaXNzdWVDb21tZW50Vmlld19pdGVtXCIsXG4gIFwidHlwZVwiOiBcIklzc3VlQ29tbWVudFwiLFxuICBcIm1ldGFkYXRhXCI6IG51bGwsXG4gIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiBbXSxcbiAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwiYXV0aG9yXCIsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgIFwibmFtZVwiOiBcImF2YXRhclVybFwiLFxuICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICBcIm5hbWVcIjogXCJsb2dpblwiLFxuICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJib2R5SFRNTFwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcImNyZWF0ZWRBdFwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcInVybFwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH1cbiAgXVxufTtcbi8vIHByZXR0aWVyLWlnbm9yZVxuKG5vZGUvKjogYW55Ki8pLmhhc2ggPSAnYWRjMzZjNTJmNTFkZTE0MjU2NjkzYWI5ZTRlYjg0YmInO1xubW9kdWxlLmV4cG9ydHMgPSBub2RlO1xuIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsWUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQSxNQUFNQSxJQUFJLHdCQUF1QjtFQUMvQixNQUFNLEVBQUUsVUFBVTtFQUNsQixNQUFNLEVBQUUsdUJBQXVCO0VBQy9CLE1BQU0sRUFBRSxjQUFjO0VBQ3RCLFVBQVUsRUFBRSxJQUFJO0VBQ2hCLHFCQUFxQixFQUFFLEVBQUU7RUFDekIsWUFBWSxFQUFFLENBQ1o7SUFDRSxNQUFNLEVBQUUsYUFBYTtJQUNyQixPQUFPLEVBQUUsSUFBSTtJQUNiLE1BQU0sRUFBRSxRQUFRO0lBQ2hCLFlBQVksRUFBRSxJQUFJO0lBQ2xCLE1BQU0sRUFBRSxJQUFJO0lBQ1osY0FBYyxFQUFFLElBQUk7SUFDcEIsUUFBUSxFQUFFLEtBQUs7SUFDZixZQUFZLEVBQUUsQ0FDWjtNQUNFLE1BQU0sRUFBRSxhQUFhO01BQ3JCLE9BQU8sRUFBRSxJQUFJO01BQ2IsTUFBTSxFQUFFLFdBQVc7TUFDbkIsTUFBTSxFQUFFLElBQUk7TUFDWixZQUFZLEVBQUU7SUFDaEIsQ0FBQyxFQUNEO01BQ0UsTUFBTSxFQUFFLGFBQWE7TUFDckIsT0FBTyxFQUFFLElBQUk7TUFDYixNQUFNLEVBQUUsT0FBTztNQUNmLE1BQU0sRUFBRSxJQUFJO01BQ1osWUFBWSxFQUFFO0lBQ2hCLENBQUM7RUFFTCxDQUFDLEVBQ0Q7SUFDRSxNQUFNLEVBQUUsYUFBYTtJQUNyQixPQUFPLEVBQUUsSUFBSTtJQUNiLE1BQU0sRUFBRSxVQUFVO0lBQ2xCLE1BQU0sRUFBRSxJQUFJO0lBQ1osWUFBWSxFQUFFO0VBQ2hCLENBQUMsRUFDRDtJQUNFLE1BQU0sRUFBRSxhQUFhO0lBQ3JCLE9BQU8sRUFBRSxJQUFJO0lBQ2IsTUFBTSxFQUFFLFdBQVc7SUFDbkIsTUFBTSxFQUFFLElBQUk7SUFDWixZQUFZLEVBQUU7RUFDaEIsQ0FBQyxFQUNEO0lBQ0UsTUFBTSxFQUFFLGFBQWE7SUFDckIsT0FBTyxFQUFFLElBQUk7SUFDYixNQUFNLEVBQUUsS0FBSztJQUNiLE1BQU0sRUFBRSxJQUFJO0lBQ1osWUFBWSxFQUFFO0VBQ2hCLENBQUM7QUFFTCxDQUFDO0FBQ0Q7QUFDQ0EsSUFBSSxXQUFXQyxJQUFJLEdBQUcsa0NBQWtDO0FBQ3pEQyxNQUFNLENBQUNDLE9BQU8sR0FBR0gsSUFBSSJ9