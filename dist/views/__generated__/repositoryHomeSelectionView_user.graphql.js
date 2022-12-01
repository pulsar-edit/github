/**
 * @flow
 */

/* eslint-disable */
'use strict';
/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type repositoryHomeSelectionView_user$ref: FragmentReference;
declare export opaque type repositoryHomeSelectionView_user$fragmentType: repositoryHomeSelectionView_user$ref;
export type repositoryHomeSelectionView_user = {|
  +id: string,
  +login: string,
  +avatarUrl: any,
  +organizations: {|
    +pageInfo: {|
      +hasNextPage: boolean,
      +endCursor: ?string,
    |},
    +edges: ?$ReadOnlyArray<?{|
      +cursor: string,
      +node: ?{|
        +id: string,
        +login: string,
        +avatarUrl: any,
        +viewerCanCreateRepositories: boolean,
      |},
    |}>,
  |},
  +$refType: repositoryHomeSelectionView_user$ref,
|};
export type repositoryHomeSelectionView_user$data = repositoryHomeSelectionView_user;
export type repositoryHomeSelectionView_user$key = {
  +$data?: repositoryHomeSelectionView_user$data,
  +$fragmentRefs: repositoryHomeSelectionView_user$ref,
};
*/

const node
/*: ReaderFragment*/
= function () {
  var v0 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "id",
    "args": null,
    "storageKey": null
  },
      v1 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "login",
    "args": null,
    "storageKey": null
  },
      v2 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "avatarUrl",
    "args": [{
      "kind": "Literal",
      "name": "size",
      "value": 24
    }],
    "storageKey": "avatarUrl(size:24)"
  };
  return {
    "kind": "Fragment",
    "name": "repositoryHomeSelectionView_user",
    "type": "User",
    "metadata": {
      "connection": [{
        "count": "organizationCount",
        "cursor": "organizationCursor",
        "direction": "forward",
        "path": ["organizations"]
      }]
    },
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
    "selections": [v0
    /*: any*/
    , v1
    /*: any*/
    , v2
    /*: any*/
    , {
      "kind": "LinkedField",
      "alias": "organizations",
      "name": "__RepositoryHomeSelectionView_organizations_connection",
      "storageKey": null,
      "args": null,
      "concreteType": "OrganizationConnection",
      "plural": false,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "pageInfo",
        "storageKey": null,
        "args": null,
        "concreteType": "PageInfo",
        "plural": false,
        "selections": [{
          "kind": "ScalarField",
          "alias": null,
          "name": "hasNextPage",
          "args": null,
          "storageKey": null
        }, {
          "kind": "ScalarField",
          "alias": null,
          "name": "endCursor",
          "args": null,
          "storageKey": null
        }]
      }, {
        "kind": "LinkedField",
        "alias": null,
        "name": "edges",
        "storageKey": null,
        "args": null,
        "concreteType": "OrganizationEdge",
        "plural": true,
        "selections": [{
          "kind": "ScalarField",
          "alias": null,
          "name": "cursor",
          "args": null,
          "storageKey": null
        }, {
          "kind": "LinkedField",
          "alias": null,
          "name": "node",
          "storageKey": null,
          "args": null,
          "concreteType": "Organization",
          "plural": false,
          "selections": [v0
          /*: any*/
          , v1
          /*: any*/
          , v2
          /*: any*/
          , {
            "kind": "ScalarField",
            "alias": null,
            "name": "viewerCanCreateRepositories",
            "args": null,
            "storageKey": null
          }, {
            "kind": "ScalarField",
            "alias": null,
            "name": "__typename",
            "args": null,
            "storageKey": null
          }]
        }]
      }]
    }]
  };
}(); // prettier-ignore


node
/*: any*/
.hash = '11a1f1d0eac32bff0a3371217c0eede3';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi92aWV3cy9fX2dlbmVyYXRlZF9fL3JlcG9zaXRvcnlIb21lU2VsZWN0aW9uVmlld191c2VyLmdyYXBocWwuanMiXSwibmFtZXMiOlsibm9kZSIsInYwIiwidjEiLCJ2MiIsImhhc2giLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0EsTUFBTUE7QUFBSTtBQUFBLEVBQXdCLFlBQVU7QUFDNUMsTUFBSUMsRUFBRSxHQUFHO0FBQ1AsWUFBUSxhQUREO0FBRVAsYUFBUyxJQUZGO0FBR1AsWUFBUSxJQUhEO0FBSVAsWUFBUSxJQUpEO0FBS1Asa0JBQWM7QUFMUCxHQUFUO0FBQUEsTUFPQUMsRUFBRSxHQUFHO0FBQ0gsWUFBUSxhQURMO0FBRUgsYUFBUyxJQUZOO0FBR0gsWUFBUSxPQUhMO0FBSUgsWUFBUSxJQUpMO0FBS0gsa0JBQWM7QUFMWCxHQVBMO0FBQUEsTUFjQUMsRUFBRSxHQUFHO0FBQ0gsWUFBUSxhQURMO0FBRUgsYUFBUyxJQUZOO0FBR0gsWUFBUSxXQUhMO0FBSUgsWUFBUSxDQUNOO0FBQ0UsY0FBUSxTQURWO0FBRUUsY0FBUSxNQUZWO0FBR0UsZUFBUztBQUhYLEtBRE0sQ0FKTDtBQVdILGtCQUFjO0FBWFgsR0FkTDtBQTJCQSxTQUFPO0FBQ0wsWUFBUSxVQURIO0FBRUwsWUFBUSxrQ0FGSDtBQUdMLFlBQVEsTUFISDtBQUlMLGdCQUFZO0FBQ1Ysb0JBQWMsQ0FDWjtBQUNFLGlCQUFTLG1CQURYO0FBRUUsa0JBQVUsb0JBRlo7QUFHRSxxQkFBYSxTQUhmO0FBSUUsZ0JBQVEsQ0FDTixlQURNO0FBSlYsT0FEWTtBQURKLEtBSlA7QUFnQkwsMkJBQXVCLENBQ3JCO0FBQ0UsY0FBUSxlQURWO0FBRUUsY0FBUSxtQkFGVjtBQUdFLGNBQVEsTUFIVjtBQUlFLHNCQUFnQjtBQUpsQixLQURxQixFQU9yQjtBQUNFLGNBQVEsZUFEVjtBQUVFLGNBQVEsb0JBRlY7QUFHRSxjQUFRLFFBSFY7QUFJRSxzQkFBZ0I7QUFKbEIsS0FQcUIsQ0FoQmxCO0FBOEJMLGtCQUFjLENBQ1hGO0FBQUU7QUFEUyxNQUVYQztBQUFFO0FBRlMsTUFHWEM7QUFBRTtBQUhTLE1BSVo7QUFDRSxjQUFRLGFBRFY7QUFFRSxlQUFTLGVBRlg7QUFHRSxjQUFRLHdEQUhWO0FBSUUsb0JBQWMsSUFKaEI7QUFLRSxjQUFRLElBTFY7QUFNRSxzQkFBZ0Isd0JBTmxCO0FBT0UsZ0JBQVUsS0FQWjtBQVFFLG9CQUFjLENBQ1o7QUFDRSxnQkFBUSxhQURWO0FBRUUsaUJBQVMsSUFGWDtBQUdFLGdCQUFRLFVBSFY7QUFJRSxzQkFBYyxJQUpoQjtBQUtFLGdCQUFRLElBTFY7QUFNRSx3QkFBZ0IsVUFObEI7QUFPRSxrQkFBVSxLQVBaO0FBUUUsc0JBQWMsQ0FDWjtBQUNFLGtCQUFRLGFBRFY7QUFFRSxtQkFBUyxJQUZYO0FBR0Usa0JBQVEsYUFIVjtBQUlFLGtCQUFRLElBSlY7QUFLRSx3QkFBYztBQUxoQixTQURZLEVBUVo7QUFDRSxrQkFBUSxhQURWO0FBRUUsbUJBQVMsSUFGWDtBQUdFLGtCQUFRLFdBSFY7QUFJRSxrQkFBUSxJQUpWO0FBS0Usd0JBQWM7QUFMaEIsU0FSWTtBQVJoQixPQURZLEVBMEJaO0FBQ0UsZ0JBQVEsYUFEVjtBQUVFLGlCQUFTLElBRlg7QUFHRSxnQkFBUSxPQUhWO0FBSUUsc0JBQWMsSUFKaEI7QUFLRSxnQkFBUSxJQUxWO0FBTUUsd0JBQWdCLGtCQU5sQjtBQU9FLGtCQUFVLElBUFo7QUFRRSxzQkFBYyxDQUNaO0FBQ0Usa0JBQVEsYUFEVjtBQUVFLG1CQUFTLElBRlg7QUFHRSxrQkFBUSxRQUhWO0FBSUUsa0JBQVEsSUFKVjtBQUtFLHdCQUFjO0FBTGhCLFNBRFksRUFRWjtBQUNFLGtCQUFRLGFBRFY7QUFFRSxtQkFBUyxJQUZYO0FBR0Usa0JBQVEsTUFIVjtBQUlFLHdCQUFjLElBSmhCO0FBS0Usa0JBQVEsSUFMVjtBQU1FLDBCQUFnQixjQU5sQjtBQU9FLG9CQUFVLEtBUFo7QUFRRSx3QkFBYyxDQUNYRjtBQUFFO0FBRFMsWUFFWEM7QUFBRTtBQUZTLFlBR1hDO0FBQUU7QUFIUyxZQUlaO0FBQ0Usb0JBQVEsYUFEVjtBQUVFLHFCQUFTLElBRlg7QUFHRSxvQkFBUSw2QkFIVjtBQUlFLG9CQUFRLElBSlY7QUFLRSwwQkFBYztBQUxoQixXQUpZLEVBV1o7QUFDRSxvQkFBUSxhQURWO0FBRUUscUJBQVMsSUFGWDtBQUdFLG9CQUFRLFlBSFY7QUFJRSxvQkFBUSxJQUpWO0FBS0UsMEJBQWM7QUFMaEIsV0FYWTtBQVJoQixTQVJZO0FBUmhCLE9BMUJZO0FBUmhCLEtBSlk7QUE5QlQsR0FBUDtBQXNIQyxDQWxKZ0MsRUFBakMsQyxDQW1KQTs7O0FBQ0NIO0FBQUk7QUFBTCxDQUFnQkksSUFBaEIsR0FBdUIsa0NBQXZCO0FBQ0FDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQk4sSUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmbG93XG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKjo6XG5pbXBvcnQgdHlwZSB7IFJlYWRlckZyYWdtZW50IH0gZnJvbSAncmVsYXktcnVudGltZSc7XG5pbXBvcnQgdHlwZSB7IEZyYWdtZW50UmVmZXJlbmNlIH0gZnJvbSBcInJlbGF5LXJ1bnRpbWVcIjtcbmRlY2xhcmUgZXhwb3J0IG9wYXF1ZSB0eXBlIHJlcG9zaXRvcnlIb21lU2VsZWN0aW9uVmlld191c2VyJHJlZjogRnJhZ21lbnRSZWZlcmVuY2U7XG5kZWNsYXJlIGV4cG9ydCBvcGFxdWUgdHlwZSByZXBvc2l0b3J5SG9tZVNlbGVjdGlvblZpZXdfdXNlciRmcmFnbWVudFR5cGU6IHJlcG9zaXRvcnlIb21lU2VsZWN0aW9uVmlld191c2VyJHJlZjtcbmV4cG9ydCB0eXBlIHJlcG9zaXRvcnlIb21lU2VsZWN0aW9uVmlld191c2VyID0ge3xcbiAgK2lkOiBzdHJpbmcsXG4gICtsb2dpbjogc3RyaW5nLFxuICArYXZhdGFyVXJsOiBhbnksXG4gICtvcmdhbml6YXRpb25zOiB7fFxuICAgICtwYWdlSW5mbzoge3xcbiAgICAgICtoYXNOZXh0UGFnZTogYm9vbGVhbixcbiAgICAgICtlbmRDdXJzb3I6ID9zdHJpbmcsXG4gICAgfH0sXG4gICAgK2VkZ2VzOiA/JFJlYWRPbmx5QXJyYXk8P3t8XG4gICAgICArY3Vyc29yOiBzdHJpbmcsXG4gICAgICArbm9kZTogP3t8XG4gICAgICAgICtpZDogc3RyaW5nLFxuICAgICAgICArbG9naW46IHN0cmluZyxcbiAgICAgICAgK2F2YXRhclVybDogYW55LFxuICAgICAgICArdmlld2VyQ2FuQ3JlYXRlUmVwb3NpdG9yaWVzOiBib29sZWFuLFxuICAgICAgfH0sXG4gICAgfH0+LFxuICB8fSxcbiAgKyRyZWZUeXBlOiByZXBvc2l0b3J5SG9tZVNlbGVjdGlvblZpZXdfdXNlciRyZWYsXG58fTtcbmV4cG9ydCB0eXBlIHJlcG9zaXRvcnlIb21lU2VsZWN0aW9uVmlld191c2VyJGRhdGEgPSByZXBvc2l0b3J5SG9tZVNlbGVjdGlvblZpZXdfdXNlcjtcbmV4cG9ydCB0eXBlIHJlcG9zaXRvcnlIb21lU2VsZWN0aW9uVmlld191c2VyJGtleSA9IHtcbiAgKyRkYXRhPzogcmVwb3NpdG9yeUhvbWVTZWxlY3Rpb25WaWV3X3VzZXIkZGF0YSxcbiAgKyRmcmFnbWVudFJlZnM6IHJlcG9zaXRvcnlIb21lU2VsZWN0aW9uVmlld191c2VyJHJlZixcbn07XG4qL1xuXG5cbmNvbnN0IG5vZGUvKjogUmVhZGVyRnJhZ21lbnQqLyA9IChmdW5jdGlvbigpe1xudmFyIHYwID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcImlkXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnYxID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcImxvZ2luXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnYyID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcImF2YXRhclVybFwiLFxuICBcImFyZ3NcIjogW1xuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxpdGVyYWxcIixcbiAgICAgIFwibmFtZVwiOiBcInNpemVcIixcbiAgICAgIFwidmFsdWVcIjogMjRcbiAgICB9XG4gIF0sXG4gIFwic3RvcmFnZUtleVwiOiBcImF2YXRhclVybChzaXplOjI0KVwiXG59O1xucmV0dXJuIHtcbiAgXCJraW5kXCI6IFwiRnJhZ21lbnRcIixcbiAgXCJuYW1lXCI6IFwicmVwb3NpdG9yeUhvbWVTZWxlY3Rpb25WaWV3X3VzZXJcIixcbiAgXCJ0eXBlXCI6IFwiVXNlclwiLFxuICBcIm1ldGFkYXRhXCI6IHtcbiAgICBcImNvbm5lY3Rpb25cIjogW1xuICAgICAge1xuICAgICAgICBcImNvdW50XCI6IFwib3JnYW5pemF0aW9uQ291bnRcIixcbiAgICAgICAgXCJjdXJzb3JcIjogXCJvcmdhbml6YXRpb25DdXJzb3JcIixcbiAgICAgICAgXCJkaXJlY3Rpb25cIjogXCJmb3J3YXJkXCIsXG4gICAgICAgIFwicGF0aFwiOiBbXG4gICAgICAgICAgXCJvcmdhbml6YXRpb25zXCJcbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAgXCJhcmd1bWVudERlZmluaXRpb25zXCI6IFtcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgICBcIm5hbWVcIjogXCJvcmdhbml6YXRpb25Db3VudFwiLFxuICAgICAgXCJ0eXBlXCI6IFwiSW50IVwiLFxuICAgICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgICAgXCJuYW1lXCI6IFwib3JnYW5pemF0aW9uQ3Vyc29yXCIsXG4gICAgICBcInR5cGVcIjogXCJTdHJpbmdcIixcbiAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgICB9XG4gIF0sXG4gIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgKHYwLyo6IGFueSovKSxcbiAgICAodjEvKjogYW55Ki8pLFxuICAgICh2Mi8qOiBhbnkqLyksXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgIFwiYWxpYXNcIjogXCJvcmdhbml6YXRpb25zXCIsXG4gICAgICBcIm5hbWVcIjogXCJfX1JlcG9zaXRvcnlIb21lU2VsZWN0aW9uVmlld19vcmdhbml6YXRpb25zX2Nvbm5lY3Rpb25cIixcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIk9yZ2FuaXphdGlvbkNvbm5lY3Rpb25cIixcbiAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgIFwibmFtZVwiOiBcInBhZ2VJbmZvXCIsXG4gICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJQYWdlSW5mb1wiLFxuICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiaGFzTmV4dFBhZ2VcIixcbiAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImVuZEN1cnNvclwiLFxuICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgIH1cbiAgICAgICAgICBdXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICBcIm5hbWVcIjogXCJlZGdlc1wiLFxuICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiT3JnYW5pemF0aW9uRWRnZVwiLFxuICAgICAgICAgIFwicGx1cmFsXCI6IHRydWUsXG4gICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjdXJzb3JcIixcbiAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcIm5vZGVcIixcbiAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIk9yZ2FuaXphdGlvblwiLFxuICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgICAodjAvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICh2MS8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgKHYyLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwidmlld2VyQ2FuQ3JlYXRlUmVwb3NpdG9yaWVzXCIsXG4gICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiX190eXBlbmFtZVwiLFxuICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgXVxufTtcbn0pKCk7XG4vLyBwcmV0dGllci1pZ25vcmVcbihub2RlLyo6IGFueSovKS5oYXNoID0gJzExYTFmMWQwZWFjMzJiZmYwYTMzNzEyMTdjMGVlZGUzJztcbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcbiJdfQ==