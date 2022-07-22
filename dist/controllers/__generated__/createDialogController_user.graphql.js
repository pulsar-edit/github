/**
 * @flow
 */

/* eslint-disable */
'use strict';
/*::
import type { ReaderFragment } from 'relay-runtime';
type repositoryHomeSelectionView_user$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type createDialogController_user$ref: FragmentReference;
declare export opaque type createDialogController_user$fragmentType: createDialogController_user$ref;
export type createDialogController_user = {|
  +id: string,
  +$fragmentRefs: repositoryHomeSelectionView_user$ref,
  +$refType: createDialogController_user$ref,
|};
export type createDialogController_user$data = createDialogController_user;
export type createDialogController_user$key = {
  +$data?: createDialogController_user$data,
  +$fragmentRefs: createDialogController_user$ref,
};
*/

const node
/*: ReaderFragment*/
= {
  "kind": "Fragment",
  "name": "createDialogController_user",
  "type": "User",
  "metadata": null,
  "argumentDefinitions": [{
    "kind": "LocalArgument",
    "name": "organizationCount",
    "type": "Int!",
    "defaultValue": null
  }, {
    "kind": "LocalArgument",
    "name": "organizationCursor",
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
    "kind": "FragmentSpread",
    "name": "repositoryHomeSelectionView_user",
    "args": [{
      "kind": "Variable",
      "name": "organizationCount",
      "variableName": "organizationCount"
    }, {
      "kind": "Variable",
      "name": "organizationCursor",
      "variableName": "organizationCursor"
    }]
  }]
}; // prettier-ignore

node
/*: any*/
.hash = '729f5d41fc5444c5f12632127f89ed21';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9jb250cm9sbGVycy9fX2dlbmVyYXRlZF9fL2NyZWF0ZURpYWxvZ0NvbnRyb2xsZXJfdXNlci5ncmFwaHFsLmpzIl0sIm5hbWVzIjpbIm5vZGUiLCJoYXNoIiwibW9kdWxlIiwiZXhwb3J0cyJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOztBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUdBLE1BQU1BO0FBQUk7QUFBQSxFQUF1QjtBQUMvQixVQUFRLFVBRHVCO0FBRS9CLFVBQVEsNkJBRnVCO0FBRy9CLFVBQVEsTUFIdUI7QUFJL0IsY0FBWSxJQUptQjtBQUsvQix5QkFBdUIsQ0FDckI7QUFDRSxZQUFRLGVBRFY7QUFFRSxZQUFRLG1CQUZWO0FBR0UsWUFBUSxNQUhWO0FBSUUsb0JBQWdCO0FBSmxCLEdBRHFCLEVBT3JCO0FBQ0UsWUFBUSxlQURWO0FBRUUsWUFBUSxvQkFGVjtBQUdFLFlBQVEsUUFIVjtBQUlFLG9CQUFnQjtBQUpsQixHQVBxQixDQUxRO0FBbUIvQixnQkFBYyxDQUNaO0FBQ0UsWUFBUSxhQURWO0FBRUUsYUFBUyxJQUZYO0FBR0UsWUFBUSxJQUhWO0FBSUUsWUFBUSxJQUpWO0FBS0Usa0JBQWM7QUFMaEIsR0FEWSxFQVFaO0FBQ0UsWUFBUSxnQkFEVjtBQUVFLFlBQVEsa0NBRlY7QUFHRSxZQUFRLENBQ047QUFDRSxjQUFRLFVBRFY7QUFFRSxjQUFRLG1CQUZWO0FBR0Usc0JBQWdCO0FBSGxCLEtBRE0sRUFNTjtBQUNFLGNBQVEsVUFEVjtBQUVFLGNBQVEsb0JBRlY7QUFHRSxzQkFBZ0I7QUFIbEIsS0FOTTtBQUhWLEdBUlk7QUFuQmlCLENBQWpDLEMsQ0E2Q0E7O0FBQ0NBO0FBQUk7QUFBTCxDQUFnQkMsSUFBaEIsR0FBdUIsa0NBQXZCO0FBQ0FDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQkgsSUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmbG93XG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKjo6XG5pbXBvcnQgdHlwZSB7IFJlYWRlckZyYWdtZW50IH0gZnJvbSAncmVsYXktcnVudGltZSc7XG50eXBlIHJlcG9zaXRvcnlIb21lU2VsZWN0aW9uVmlld191c2VyJHJlZiA9IGFueTtcbmltcG9ydCB0eXBlIHsgRnJhZ21lbnRSZWZlcmVuY2UgfSBmcm9tIFwicmVsYXktcnVudGltZVwiO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgY3JlYXRlRGlhbG9nQ29udHJvbGxlcl91c2VyJHJlZjogRnJhZ21lbnRSZWZlcmVuY2U7XG5kZWNsYXJlIGV4cG9ydCBvcGFxdWUgdHlwZSBjcmVhdGVEaWFsb2dDb250cm9sbGVyX3VzZXIkZnJhZ21lbnRUeXBlOiBjcmVhdGVEaWFsb2dDb250cm9sbGVyX3VzZXIkcmVmO1xuZXhwb3J0IHR5cGUgY3JlYXRlRGlhbG9nQ29udHJvbGxlcl91c2VyID0ge3xcbiAgK2lkOiBzdHJpbmcsXG4gICskZnJhZ21lbnRSZWZzOiByZXBvc2l0b3J5SG9tZVNlbGVjdGlvblZpZXdfdXNlciRyZWYsXG4gICskcmVmVHlwZTogY3JlYXRlRGlhbG9nQ29udHJvbGxlcl91c2VyJHJlZixcbnx9O1xuZXhwb3J0IHR5cGUgY3JlYXRlRGlhbG9nQ29udHJvbGxlcl91c2VyJGRhdGEgPSBjcmVhdGVEaWFsb2dDb250cm9sbGVyX3VzZXI7XG5leHBvcnQgdHlwZSBjcmVhdGVEaWFsb2dDb250cm9sbGVyX3VzZXIka2V5ID0ge1xuICArJGRhdGE/OiBjcmVhdGVEaWFsb2dDb250cm9sbGVyX3VzZXIkZGF0YSxcbiAgKyRmcmFnbWVudFJlZnM6IGNyZWF0ZURpYWxvZ0NvbnRyb2xsZXJfdXNlciRyZWYsXG59O1xuKi9cblxuXG5jb25zdCBub2RlLyo6IFJlYWRlckZyYWdtZW50Ki8gPSB7XG4gIFwia2luZFwiOiBcIkZyYWdtZW50XCIsXG4gIFwibmFtZVwiOiBcImNyZWF0ZURpYWxvZ0NvbnRyb2xsZXJfdXNlclwiLFxuICBcInR5cGVcIjogXCJVc2VyXCIsXG4gIFwibWV0YWRhdGFcIjogbnVsbCxcbiAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6IFtcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgICBcIm5hbWVcIjogXCJvcmdhbml6YXRpb25Db3VudFwiLFxuICAgICAgXCJ0eXBlXCI6IFwiSW50IVwiLFxuICAgICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgICAgXCJuYW1lXCI6IFwib3JnYW5pemF0aW9uQ3Vyc29yXCIsXG4gICAgICBcInR5cGVcIjogXCJTdHJpbmdcIixcbiAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgICB9XG4gIF0sXG4gIFwic2VsZWN0aW9uc1wiOiBbXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgIFwibmFtZVwiOiBcImlkXCIsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJGcmFnbWVudFNwcmVhZFwiLFxuICAgICAgXCJuYW1lXCI6IFwicmVwb3NpdG9yeUhvbWVTZWxlY3Rpb25WaWV3X3VzZXJcIixcbiAgICAgIFwiYXJnc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgICAgICAgIFwibmFtZVwiOiBcIm9yZ2FuaXphdGlvbkNvdW50XCIsXG4gICAgICAgICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJvcmdhbml6YXRpb25Db3VudFwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgICAgICAgIFwibmFtZVwiOiBcIm9yZ2FuaXphdGlvbkN1cnNvclwiLFxuICAgICAgICAgIFwidmFyaWFibGVOYW1lXCI6IFwib3JnYW5pemF0aW9uQ3Vyc29yXCJcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgXVxufTtcbi8vIHByZXR0aWVyLWlnbm9yZVxuKG5vZGUvKjogYW55Ki8pLmhhc2ggPSAnNzI5ZjVkNDFmYzU0NDRjNWYxMjYzMjEyN2Y4OWVkMjEnO1xubW9kdWxlLmV4cG9ydHMgPSBub2RlO1xuIl19