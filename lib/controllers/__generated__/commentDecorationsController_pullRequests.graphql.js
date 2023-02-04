/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type commentDecorationsController_pullRequests$ref: FragmentReference;
declare export opaque type commentDecorationsController_pullRequests$fragmentType: commentDecorationsController_pullRequests$ref;
export type commentDecorationsController_pullRequests = $ReadOnlyArray<{|
  +number: number,
  +headRefName: string,
  +headRefOid: any,
  +headRepository: ?{|
    +name: string,
    +owner: {|
      +login: string
    |},
  |},
  +repository: {|
    +name: string,
    +owner: {|
      +login: string
    |},
  |},
  +$refType: commentDecorationsController_pullRequests$ref,
|}>;
export type commentDecorationsController_pullRequests$data = commentDecorationsController_pullRequests;
export type commentDecorationsController_pullRequests$key = $ReadOnlyArray<{
  +$data?: commentDecorationsController_pullRequests$data,
  +$fragmentRefs: commentDecorationsController_pullRequests$ref,
}>;
*/
const node /*: ReaderFragment*/ = function () {
  var v0 = [{
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
    "name": "commentDecorationsController_pullRequests",
    "type": "PullRequest",
    "metadata": {
      "plural": true
    },
    "argumentDefinitions": [],
    "selections": [{
      "kind": "ScalarField",
      "alias": null,
      "name": "number",
      "args": null,
      "storageKey": null
    }, {
      "kind": "ScalarField",
      "alias": null,
      "name": "headRefName",
      "args": null,
      "storageKey": null
    }, {
      "kind": "ScalarField",
      "alias": null,
      "name": "headRefOid",
      "args": null,
      "storageKey": null
    }, {
      "kind": "LinkedField",
      "alias": null,
      "name": "headRepository",
      "storageKey": null,
      "args": null,
      "concreteType": "Repository",
      "plural": false,
      "selections": v0 /*: any*/
    }, {
      "kind": "LinkedField",
      "alias": null,
      "name": "repository",
      "storageKey": null,
      "args": null,
      "concreteType": "Repository",
      "plural": false,
      "selections": v0 /*: any*/
    }]
  };
}();
// prettier-ignore
node /*: any*/.hash = '62f96ccd13dfc2649112a7b4afaf4ba2';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJub2RlIiwidjAiLCJoYXNoIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJzb3VyY2VzIjpbImNvbW1lbnREZWNvcmF0aW9uc0NvbnRyb2xsZXJfcHVsbFJlcXVlc3RzLmdyYXBocWwuanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmxvd1xuICovXG5cbi8qIGVzbGludC1kaXNhYmxlICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyo6OlxuaW1wb3J0IHR5cGUgeyBSZWFkZXJGcmFnbWVudCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xuaW1wb3J0IHR5cGUgeyBGcmFnbWVudFJlZmVyZW5jZSB9IGZyb20gXCJyZWxheS1ydW50aW1lXCI7XG5kZWNsYXJlIGV4cG9ydCBvcGFxdWUgdHlwZSBjb21tZW50RGVjb3JhdGlvbnNDb250cm9sbGVyX3B1bGxSZXF1ZXN0cyRyZWY6IEZyYWdtZW50UmVmZXJlbmNlO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgY29tbWVudERlY29yYXRpb25zQ29udHJvbGxlcl9wdWxsUmVxdWVzdHMkZnJhZ21lbnRUeXBlOiBjb21tZW50RGVjb3JhdGlvbnNDb250cm9sbGVyX3B1bGxSZXF1ZXN0cyRyZWY7XG5leHBvcnQgdHlwZSBjb21tZW50RGVjb3JhdGlvbnNDb250cm9sbGVyX3B1bGxSZXF1ZXN0cyA9ICRSZWFkT25seUFycmF5PHt8XG4gICtudW1iZXI6IG51bWJlcixcbiAgK2hlYWRSZWZOYW1lOiBzdHJpbmcsXG4gICtoZWFkUmVmT2lkOiBhbnksXG4gICtoZWFkUmVwb3NpdG9yeTogP3t8XG4gICAgK25hbWU6IHN0cmluZyxcbiAgICArb3duZXI6IHt8XG4gICAgICArbG9naW46IHN0cmluZ1xuICAgIHx9LFxuICB8fSxcbiAgK3JlcG9zaXRvcnk6IHt8XG4gICAgK25hbWU6IHN0cmluZyxcbiAgICArb3duZXI6IHt8XG4gICAgICArbG9naW46IHN0cmluZ1xuICAgIHx9LFxuICB8fSxcbiAgKyRyZWZUeXBlOiBjb21tZW50RGVjb3JhdGlvbnNDb250cm9sbGVyX3B1bGxSZXF1ZXN0cyRyZWYsXG58fT47XG5leHBvcnQgdHlwZSBjb21tZW50RGVjb3JhdGlvbnNDb250cm9sbGVyX3B1bGxSZXF1ZXN0cyRkYXRhID0gY29tbWVudERlY29yYXRpb25zQ29udHJvbGxlcl9wdWxsUmVxdWVzdHM7XG5leHBvcnQgdHlwZSBjb21tZW50RGVjb3JhdGlvbnNDb250cm9sbGVyX3B1bGxSZXF1ZXN0cyRrZXkgPSAkUmVhZE9ubHlBcnJheTx7XG4gICskZGF0YT86IGNvbW1lbnREZWNvcmF0aW9uc0NvbnRyb2xsZXJfcHVsbFJlcXVlc3RzJGRhdGEsXG4gICskZnJhZ21lbnRSZWZzOiBjb21tZW50RGVjb3JhdGlvbnNDb250cm9sbGVyX3B1bGxSZXF1ZXN0cyRyZWYsXG59PjtcbiovXG5cblxuY29uc3Qgbm9kZS8qOiBSZWFkZXJGcmFnbWVudCovID0gKGZ1bmN0aW9uKCl7XG52YXIgdjAgPSBbXG4gIHtcbiAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICBcIm5hbWVcIjogXCJuYW1lXCIsXG4gICAgXCJhcmdzXCI6IG51bGwsXG4gICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgfSxcbiAge1xuICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgXCJhbGlhc1wiOiBudWxsLFxuICAgIFwibmFtZVwiOiBcIm93bmVyXCIsXG4gICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgXCJhcmdzXCI6IG51bGwsXG4gICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAge1xuICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgIFwibmFtZVwiOiBcImxvZ2luXCIsXG4gICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgfVxuICAgIF1cbiAgfVxuXTtcbnJldHVybiB7XG4gIFwia2luZFwiOiBcIkZyYWdtZW50XCIsXG4gIFwibmFtZVwiOiBcImNvbW1lbnREZWNvcmF0aW9uc0NvbnRyb2xsZXJfcHVsbFJlcXVlc3RzXCIsXG4gIFwidHlwZVwiOiBcIlB1bGxSZXF1ZXN0XCIsXG4gIFwibWV0YWRhdGFcIjoge1xuICAgIFwicGx1cmFsXCI6IHRydWVcbiAgfSxcbiAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6IFtdLFxuICBcInNlbGVjdGlvbnNcIjogW1xuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJudW1iZXJcIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJoZWFkUmVmTmFtZVwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcImhlYWRSZWZPaWRcIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJoZWFkUmVwb3NpdG9yeVwiLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUmVwb3NpdG9yeVwiLFxuICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICBcInNlbGVjdGlvbnNcIjogKHYwLyo6IGFueSovKVxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcInJlcG9zaXRvcnlcIixcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlJlcG9zaXRvcnlcIixcbiAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgXCJzZWxlY3Rpb25zXCI6ICh2MC8qOiBhbnkqLylcbiAgICB9XG4gIF1cbn07XG59KSgpO1xuLy8gcHJldHRpZXItaWdub3JlXG4obm9kZS8qOiBhbnkqLykuaGFzaCA9ICc2MmY5NmNjZDEzZGZjMjY0OTExMmE3YjRhZmFmNGJhMic7XG5tb2R1bGUuZXhwb3J0cyA9IG5vZGU7XG4iXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSxZQUFZOztBQUVaO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQSxNQUFNQSxJQUFJLHdCQUF3QixZQUFVO0VBQzVDLElBQUlDLEVBQUUsR0FBRyxDQUNQO0lBQ0UsTUFBTSxFQUFFLGFBQWE7SUFDckIsT0FBTyxFQUFFLElBQUk7SUFDYixNQUFNLEVBQUUsTUFBTTtJQUNkLE1BQU0sRUFBRSxJQUFJO0lBQ1osWUFBWSxFQUFFO0VBQ2hCLENBQUMsRUFDRDtJQUNFLE1BQU0sRUFBRSxhQUFhO0lBQ3JCLE9BQU8sRUFBRSxJQUFJO0lBQ2IsTUFBTSxFQUFFLE9BQU87SUFDZixZQUFZLEVBQUUsSUFBSTtJQUNsQixNQUFNLEVBQUUsSUFBSTtJQUNaLGNBQWMsRUFBRSxJQUFJO0lBQ3BCLFFBQVEsRUFBRSxLQUFLO0lBQ2YsWUFBWSxFQUFFLENBQ1o7TUFDRSxNQUFNLEVBQUUsYUFBYTtNQUNyQixPQUFPLEVBQUUsSUFBSTtNQUNiLE1BQU0sRUFBRSxPQUFPO01BQ2YsTUFBTSxFQUFFLElBQUk7TUFDWixZQUFZLEVBQUU7SUFDaEIsQ0FBQztFQUVMLENBQUMsQ0FDRjtFQUNELE9BQU87SUFDTCxNQUFNLEVBQUUsVUFBVTtJQUNsQixNQUFNLEVBQUUsMkNBQTJDO0lBQ25ELE1BQU0sRUFBRSxhQUFhO0lBQ3JCLFVBQVUsRUFBRTtNQUNWLFFBQVEsRUFBRTtJQUNaLENBQUM7SUFDRCxxQkFBcUIsRUFBRSxFQUFFO0lBQ3pCLFlBQVksRUFBRSxDQUNaO01BQ0UsTUFBTSxFQUFFLGFBQWE7TUFDckIsT0FBTyxFQUFFLElBQUk7TUFDYixNQUFNLEVBQUUsUUFBUTtNQUNoQixNQUFNLEVBQUUsSUFBSTtNQUNaLFlBQVksRUFBRTtJQUNoQixDQUFDLEVBQ0Q7TUFDRSxNQUFNLEVBQUUsYUFBYTtNQUNyQixPQUFPLEVBQUUsSUFBSTtNQUNiLE1BQU0sRUFBRSxhQUFhO01BQ3JCLE1BQU0sRUFBRSxJQUFJO01BQ1osWUFBWSxFQUFFO0lBQ2hCLENBQUMsRUFDRDtNQUNFLE1BQU0sRUFBRSxhQUFhO01BQ3JCLE9BQU8sRUFBRSxJQUFJO01BQ2IsTUFBTSxFQUFFLFlBQVk7TUFDcEIsTUFBTSxFQUFFLElBQUk7TUFDWixZQUFZLEVBQUU7SUFDaEIsQ0FBQyxFQUNEO01BQ0UsTUFBTSxFQUFFLGFBQWE7TUFDckIsT0FBTyxFQUFFLElBQUk7TUFDYixNQUFNLEVBQUUsZ0JBQWdCO01BQ3hCLFlBQVksRUFBRSxJQUFJO01BQ2xCLE1BQU0sRUFBRSxJQUFJO01BQ1osY0FBYyxFQUFFLFlBQVk7TUFDNUIsUUFBUSxFQUFFLEtBQUs7TUFDZixZQUFZLEVBQUdBLEVBQUU7SUFDbkIsQ0FBQyxFQUNEO01BQ0UsTUFBTSxFQUFFLGFBQWE7TUFDckIsT0FBTyxFQUFFLElBQUk7TUFDYixNQUFNLEVBQUUsWUFBWTtNQUNwQixZQUFZLEVBQUUsSUFBSTtNQUNsQixNQUFNLEVBQUUsSUFBSTtNQUNaLGNBQWMsRUFBRSxZQUFZO01BQzVCLFFBQVEsRUFBRSxLQUFLO01BQ2YsWUFBWSxFQUFHQSxFQUFFO0lBQ25CLENBQUM7RUFFTCxDQUFDO0FBQ0QsQ0FBQyxFQUFHO0FBQ0o7QUFDQ0QsSUFBSSxXQUFXRSxJQUFJLEdBQUcsa0NBQWtDO0FBQ3pEQyxNQUFNLENBQUNDLE9BQU8sR0FBR0osSUFBSSJ9