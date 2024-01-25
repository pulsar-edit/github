/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type prDetailView_repository$ref: FragmentReference;
declare export opaque type prDetailView_repository$fragmentType: prDetailView_repository$ref;
export type prDetailView_repository = {|
  +id: string,
  +name: string,
  +owner: {|
    +login: string
  |},
  +$refType: prDetailView_repository$ref,
|};
export type prDetailView_repository$data = prDetailView_repository;
export type prDetailView_repository$key = {
  +$data?: prDetailView_repository$data,
  +$fragmentRefs: prDetailView_repository$ref,
};
*/
const node /*: ReaderFragment*/ = {
  "kind": "Fragment",
  "name": "prDetailView_repository",
  "type": "Repository",
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
  }]
};
// prettier-ignore
node /*: any*/.hash = '3f3d61ddd6afa1c9e0811c3b5be51bb0';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJub2RlIiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwic291cmNlcyI6WyJwckRldGFpbFZpZXdfcmVwb3NpdG9yeS5ncmFwaHFsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZsb3dcbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qOjpcbmltcG9ydCB0eXBlIHsgUmVhZGVyRnJhZ21lbnQgfSBmcm9tICdyZWxheS1ydW50aW1lJztcbmltcG9ydCB0eXBlIHsgRnJhZ21lbnRSZWZlcmVuY2UgfSBmcm9tIFwicmVsYXktcnVudGltZVwiO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgcHJEZXRhaWxWaWV3X3JlcG9zaXRvcnkkcmVmOiBGcmFnbWVudFJlZmVyZW5jZTtcbmRlY2xhcmUgZXhwb3J0IG9wYXF1ZSB0eXBlIHByRGV0YWlsVmlld19yZXBvc2l0b3J5JGZyYWdtZW50VHlwZTogcHJEZXRhaWxWaWV3X3JlcG9zaXRvcnkkcmVmO1xuZXhwb3J0IHR5cGUgcHJEZXRhaWxWaWV3X3JlcG9zaXRvcnkgPSB7fFxuICAraWQ6IHN0cmluZyxcbiAgK25hbWU6IHN0cmluZyxcbiAgK293bmVyOiB7fFxuICAgICtsb2dpbjogc3RyaW5nXG4gIHx9LFxuICArJHJlZlR5cGU6IHByRGV0YWlsVmlld19yZXBvc2l0b3J5JHJlZixcbnx9O1xuZXhwb3J0IHR5cGUgcHJEZXRhaWxWaWV3X3JlcG9zaXRvcnkkZGF0YSA9IHByRGV0YWlsVmlld19yZXBvc2l0b3J5O1xuZXhwb3J0IHR5cGUgcHJEZXRhaWxWaWV3X3JlcG9zaXRvcnkka2V5ID0ge1xuICArJGRhdGE/OiBwckRldGFpbFZpZXdfcmVwb3NpdG9yeSRkYXRhLFxuICArJGZyYWdtZW50UmVmczogcHJEZXRhaWxWaWV3X3JlcG9zaXRvcnkkcmVmLFxufTtcbiovXG5cblxuY29uc3Qgbm9kZS8qOiBSZWFkZXJGcmFnbWVudCovID0ge1xuICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICBcIm5hbWVcIjogXCJwckRldGFpbFZpZXdfcmVwb3NpdG9yeVwiLFxuICBcInR5cGVcIjogXCJSZXBvc2l0b3J5XCIsXG4gIFwibWV0YWRhdGFcIjogbnVsbCxcbiAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6IFtdLFxuICBcInNlbGVjdGlvbnNcIjogW1xuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJpZFwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcIm5hbWVcIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJvd25lclwiLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICBcIm5hbWVcIjogXCJsb2dpblwiLFxuICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIF1cbn07XG4vLyBwcmV0dGllci1pZ25vcmVcbihub2RlLyo6IGFueSovKS5oYXNoID0gJzNmM2Q2MWRkZDZhZmExYzllMDgxMWMzYjViZTUxYmIwJztcbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOztBQUVBOztBQUVBLFlBQVk7O0FBRVo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFHQSxNQUFNQSxJQUFJLHdCQUF1QjtFQUMvQixNQUFNLEVBQUUsVUFBVTtFQUNsQixNQUFNLEVBQUUseUJBQXlCO0VBQ2pDLE1BQU0sRUFBRSxZQUFZO0VBQ3BCLFVBQVUsRUFBRSxJQUFJO0VBQ2hCLHFCQUFxQixFQUFFLEVBQUU7RUFDekIsWUFBWSxFQUFFLENBQ1o7SUFDRSxNQUFNLEVBQUUsYUFBYTtJQUNyQixPQUFPLEVBQUUsSUFBSTtJQUNiLE1BQU0sRUFBRSxJQUFJO0lBQ1osTUFBTSxFQUFFLElBQUk7SUFDWixZQUFZLEVBQUU7RUFDaEIsQ0FBQyxFQUNEO0lBQ0UsTUFBTSxFQUFFLGFBQWE7SUFDckIsT0FBTyxFQUFFLElBQUk7SUFDYixNQUFNLEVBQUUsTUFBTTtJQUNkLE1BQU0sRUFBRSxJQUFJO0lBQ1osWUFBWSxFQUFFO0VBQ2hCLENBQUMsRUFDRDtJQUNFLE1BQU0sRUFBRSxhQUFhO0lBQ3JCLE9BQU8sRUFBRSxJQUFJO0lBQ2IsTUFBTSxFQUFFLE9BQU87SUFDZixZQUFZLEVBQUUsSUFBSTtJQUNsQixNQUFNLEVBQUUsSUFBSTtJQUNaLGNBQWMsRUFBRSxJQUFJO0lBQ3BCLFFBQVEsRUFBRSxLQUFLO0lBQ2YsWUFBWSxFQUFFLENBQ1o7TUFDRSxNQUFNLEVBQUUsYUFBYTtNQUNyQixPQUFPLEVBQUUsSUFBSTtNQUNiLE1BQU0sRUFBRSxPQUFPO01BQ2YsTUFBTSxFQUFFLElBQUk7TUFDWixZQUFZLEVBQUU7SUFDaEIsQ0FBQztFQUVMLENBQUM7QUFFTCxDQUFDO0FBQ0Q7QUFDQ0EsSUFBSSxXQUFXQyxJQUFJLEdBQUcsa0NBQWtDO0FBQ3pEQyxNQUFNLENBQUNDLE9BQU8sR0FBR0gsSUFBSSJ9