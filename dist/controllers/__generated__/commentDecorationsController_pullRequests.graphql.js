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
      "selections": v0
      /*: any*/

    }, {
      "kind": "LinkedField",
      "alias": null,
      "name": "repository",
      "storageKey": null,
      "args": null,
      "concreteType": "Repository",
      "plural": false,
      "selections": v0
      /*: any*/

    }]
  };
}(); // prettier-ignore


node
/*: any*/
.hash = '62f96ccd13dfc2649112a7b4afaf4ba2';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9jb250cm9sbGVycy9fX2dlbmVyYXRlZF9fL2NvbW1lbnREZWNvcmF0aW9uc0NvbnRyb2xsZXJfcHVsbFJlcXVlc3RzLmdyYXBocWwuanMiXSwibmFtZXMiOlsibm9kZSIsInYwIiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFHQSxNQUFNQTtBQUFJO0FBQUEsRUFBd0IsWUFBVTtBQUM1QyxNQUFJQyxFQUFFLEdBQUcsQ0FDUDtBQUNFLFlBQVEsYUFEVjtBQUVFLGFBQVMsSUFGWDtBQUdFLFlBQVEsTUFIVjtBQUlFLFlBQVEsSUFKVjtBQUtFLGtCQUFjO0FBTGhCLEdBRE8sRUFRUDtBQUNFLFlBQVEsYUFEVjtBQUVFLGFBQVMsSUFGWDtBQUdFLFlBQVEsT0FIVjtBQUlFLGtCQUFjLElBSmhCO0FBS0UsWUFBUSxJQUxWO0FBTUUsb0JBQWdCLElBTmxCO0FBT0UsY0FBVSxLQVBaO0FBUUUsa0JBQWMsQ0FDWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsSUFGWDtBQUdFLGNBQVEsT0FIVjtBQUlFLGNBQVEsSUFKVjtBQUtFLG9CQUFjO0FBTGhCLEtBRFk7QUFSaEIsR0FSTyxDQUFUO0FBMkJBLFNBQU87QUFDTCxZQUFRLFVBREg7QUFFTCxZQUFRLDJDQUZIO0FBR0wsWUFBUSxhQUhIO0FBSUwsZ0JBQVk7QUFDVixnQkFBVTtBQURBLEtBSlA7QUFPTCwyQkFBdUIsRUFQbEI7QUFRTCxrQkFBYyxDQUNaO0FBQ0UsY0FBUSxhQURWO0FBRUUsZUFBUyxJQUZYO0FBR0UsY0FBUSxRQUhWO0FBSUUsY0FBUSxJQUpWO0FBS0Usb0JBQWM7QUFMaEIsS0FEWSxFQVFaO0FBQ0UsY0FBUSxhQURWO0FBRUUsZUFBUyxJQUZYO0FBR0UsY0FBUSxhQUhWO0FBSUUsY0FBUSxJQUpWO0FBS0Usb0JBQWM7QUFMaEIsS0FSWSxFQWVaO0FBQ0UsY0FBUSxhQURWO0FBRUUsZUFBUyxJQUZYO0FBR0UsY0FBUSxZQUhWO0FBSUUsY0FBUSxJQUpWO0FBS0Usb0JBQWM7QUFMaEIsS0FmWSxFQXNCWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsSUFGWDtBQUdFLGNBQVEsZ0JBSFY7QUFJRSxvQkFBYyxJQUpoQjtBQUtFLGNBQVEsSUFMVjtBQU1FLHNCQUFnQixZQU5sQjtBQU9FLGdCQUFVLEtBUFo7QUFRRSxvQkFBZUE7QUFBRTs7QUFSbkIsS0F0QlksRUFnQ1o7QUFDRSxjQUFRLGFBRFY7QUFFRSxlQUFTLElBRlg7QUFHRSxjQUFRLFlBSFY7QUFJRSxvQkFBYyxJQUpoQjtBQUtFLGNBQVEsSUFMVjtBQU1FLHNCQUFnQixZQU5sQjtBQU9FLGdCQUFVLEtBUFo7QUFRRSxvQkFBZUE7QUFBRTs7QUFSbkIsS0FoQ1k7QUFSVCxHQUFQO0FBb0RDLENBaEZnQyxFQUFqQyxDLENBaUZBOzs7QUFDQ0Q7QUFBSTtBQUFMLENBQWdCRSxJQUFoQixHQUF1QixrQ0FBdkI7QUFDQUMsTUFBTSxDQUFDQyxPQUFQLEdBQWlCSixJQUFqQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZsb3dcbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qOjpcbmltcG9ydCB0eXBlIHsgUmVhZGVyRnJhZ21lbnQgfSBmcm9tICdyZWxheS1ydW50aW1lJztcbmltcG9ydCB0eXBlIHsgRnJhZ21lbnRSZWZlcmVuY2UgfSBmcm9tIFwicmVsYXktcnVudGltZVwiO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgY29tbWVudERlY29yYXRpb25zQ29udHJvbGxlcl9wdWxsUmVxdWVzdHMkcmVmOiBGcmFnbWVudFJlZmVyZW5jZTtcbmRlY2xhcmUgZXhwb3J0IG9wYXF1ZSB0eXBlIGNvbW1lbnREZWNvcmF0aW9uc0NvbnRyb2xsZXJfcHVsbFJlcXVlc3RzJGZyYWdtZW50VHlwZTogY29tbWVudERlY29yYXRpb25zQ29udHJvbGxlcl9wdWxsUmVxdWVzdHMkcmVmO1xuZXhwb3J0IHR5cGUgY29tbWVudERlY29yYXRpb25zQ29udHJvbGxlcl9wdWxsUmVxdWVzdHMgPSAkUmVhZE9ubHlBcnJheTx7fFxuICArbnVtYmVyOiBudW1iZXIsXG4gICtoZWFkUmVmTmFtZTogc3RyaW5nLFxuICAraGVhZFJlZk9pZDogYW55LFxuICAraGVhZFJlcG9zaXRvcnk6ID97fFxuICAgICtuYW1lOiBzdHJpbmcsXG4gICAgK293bmVyOiB7fFxuICAgICAgK2xvZ2luOiBzdHJpbmdcbiAgICB8fSxcbiAgfH0sXG4gICtyZXBvc2l0b3J5OiB7fFxuICAgICtuYW1lOiBzdHJpbmcsXG4gICAgK293bmVyOiB7fFxuICAgICAgK2xvZ2luOiBzdHJpbmdcbiAgICB8fSxcbiAgfH0sXG4gICskcmVmVHlwZTogY29tbWVudERlY29yYXRpb25zQ29udHJvbGxlcl9wdWxsUmVxdWVzdHMkcmVmLFxufH0+O1xuZXhwb3J0IHR5cGUgY29tbWVudERlY29yYXRpb25zQ29udHJvbGxlcl9wdWxsUmVxdWVzdHMkZGF0YSA9IGNvbW1lbnREZWNvcmF0aW9uc0NvbnRyb2xsZXJfcHVsbFJlcXVlc3RzO1xuZXhwb3J0IHR5cGUgY29tbWVudERlY29yYXRpb25zQ29udHJvbGxlcl9wdWxsUmVxdWVzdHMka2V5ID0gJFJlYWRPbmx5QXJyYXk8e1xuICArJGRhdGE/OiBjb21tZW50RGVjb3JhdGlvbnNDb250cm9sbGVyX3B1bGxSZXF1ZXN0cyRkYXRhLFxuICArJGZyYWdtZW50UmVmczogY29tbWVudERlY29yYXRpb25zQ29udHJvbGxlcl9wdWxsUmVxdWVzdHMkcmVmLFxufT47XG4qL1xuXG5cbmNvbnN0IG5vZGUvKjogUmVhZGVyRnJhZ21lbnQqLyA9IChmdW5jdGlvbigpe1xudmFyIHYwID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgXCJuYW1lXCI6IFwibmFtZVwiLFxuICAgIFwiYXJnc1wiOiBudWxsLFxuICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gIH0sXG4gIHtcbiAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICBcIm5hbWVcIjogXCJvd25lclwiLFxuICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgIFwiYXJnc1wiOiBudWxsLFxuICAgIFwiY29uY3JldGVUeXBlXCI6IG51bGwsXG4gICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgIHtcbiAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICBcIm5hbWVcIjogXCJsb2dpblwiLFxuICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgIH1cbiAgICBdXG4gIH1cbl07XG5yZXR1cm4ge1xuICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICBcIm5hbWVcIjogXCJjb21tZW50RGVjb3JhdGlvbnNDb250cm9sbGVyX3B1bGxSZXF1ZXN0c1wiLFxuICBcInR5cGVcIjogXCJQdWxsUmVxdWVzdFwiLFxuICBcIm1ldGFkYXRhXCI6IHtcbiAgICBcInBsdXJhbFwiOiB0cnVlXG4gIH0sXG4gIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiBbXSxcbiAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwibnVtYmVyXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwiaGVhZFJlZk5hbWVcIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJoZWFkUmVmT2lkXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwiaGVhZFJlcG9zaXRvcnlcIixcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlJlcG9zaXRvcnlcIixcbiAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgXCJzZWxlY3Rpb25zXCI6ICh2MC8qOiBhbnkqLylcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJyZXBvc2l0b3J5XCIsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJSZXBvc2l0b3J5XCIsXG4gICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgIFwic2VsZWN0aW9uc1wiOiAodjAvKjogYW55Ki8pXG4gICAgfVxuICBdXG59O1xufSkoKTtcbi8vIHByZXR0aWVyLWlnbm9yZVxuKG5vZGUvKjogYW55Ki8pLmhhc2ggPSAnNjJmOTZjY2QxM2RmYzI2NDkxMTJhN2I0YWZhZjRiYTInO1xubW9kdWxlLmV4cG9ydHMgPSBub2RlO1xuIl19