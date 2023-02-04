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
const node /*: ReaderFragment*/ = function () {
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
    "selections": [v0 /*: any*/, v1 /*: any*/, v2 /*: any*/, {
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
          "selections": [v0 /*: any*/, v1 /*: any*/, v2 /*: any*/, {
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
}();
// prettier-ignore
node /*: any*/.hash = '11a1f1d0eac32bff0a3371217c0eede3';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJub2RlIiwidjAiLCJ2MSIsInYyIiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwic291cmNlcyI6WyJyZXBvc2l0b3J5SG9tZVNlbGVjdGlvblZpZXdfdXNlci5ncmFwaHFsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZsb3dcbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qOjpcbmltcG9ydCB0eXBlIHsgUmVhZGVyRnJhZ21lbnQgfSBmcm9tICdyZWxheS1ydW50aW1lJztcbmltcG9ydCB0eXBlIHsgRnJhZ21lbnRSZWZlcmVuY2UgfSBmcm9tIFwicmVsYXktcnVudGltZVwiO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgcmVwb3NpdG9yeUhvbWVTZWxlY3Rpb25WaWV3X3VzZXIkcmVmOiBGcmFnbWVudFJlZmVyZW5jZTtcbmRlY2xhcmUgZXhwb3J0IG9wYXF1ZSB0eXBlIHJlcG9zaXRvcnlIb21lU2VsZWN0aW9uVmlld191c2VyJGZyYWdtZW50VHlwZTogcmVwb3NpdG9yeUhvbWVTZWxlY3Rpb25WaWV3X3VzZXIkcmVmO1xuZXhwb3J0IHR5cGUgcmVwb3NpdG9yeUhvbWVTZWxlY3Rpb25WaWV3X3VzZXIgPSB7fFxuICAraWQ6IHN0cmluZyxcbiAgK2xvZ2luOiBzdHJpbmcsXG4gICthdmF0YXJVcmw6IGFueSxcbiAgK29yZ2FuaXphdGlvbnM6IHt8XG4gICAgK3BhZ2VJbmZvOiB7fFxuICAgICAgK2hhc05leHRQYWdlOiBib29sZWFuLFxuICAgICAgK2VuZEN1cnNvcjogP3N0cmluZyxcbiAgICB8fSxcbiAgICArZWRnZXM6ID8kUmVhZE9ubHlBcnJheTw/e3xcbiAgICAgICtjdXJzb3I6IHN0cmluZyxcbiAgICAgICtub2RlOiA/e3xcbiAgICAgICAgK2lkOiBzdHJpbmcsXG4gICAgICAgICtsb2dpbjogc3RyaW5nLFxuICAgICAgICArYXZhdGFyVXJsOiBhbnksXG4gICAgICAgICt2aWV3ZXJDYW5DcmVhdGVSZXBvc2l0b3JpZXM6IGJvb2xlYW4sXG4gICAgICB8fSxcbiAgICB8fT4sXG4gIHx9LFxuICArJHJlZlR5cGU6IHJlcG9zaXRvcnlIb21lU2VsZWN0aW9uVmlld191c2VyJHJlZixcbnx9O1xuZXhwb3J0IHR5cGUgcmVwb3NpdG9yeUhvbWVTZWxlY3Rpb25WaWV3X3VzZXIkZGF0YSA9IHJlcG9zaXRvcnlIb21lU2VsZWN0aW9uVmlld191c2VyO1xuZXhwb3J0IHR5cGUgcmVwb3NpdG9yeUhvbWVTZWxlY3Rpb25WaWV3X3VzZXIka2V5ID0ge1xuICArJGRhdGE/OiByZXBvc2l0b3J5SG9tZVNlbGVjdGlvblZpZXdfdXNlciRkYXRhLFxuICArJGZyYWdtZW50UmVmczogcmVwb3NpdG9yeUhvbWVTZWxlY3Rpb25WaWV3X3VzZXIkcmVmLFxufTtcbiovXG5cblxuY29uc3Qgbm9kZS8qOiBSZWFkZXJGcmFnbWVudCovID0gKGZ1bmN0aW9uKCl7XG52YXIgdjAgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiaWRcIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjEgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwibG9naW5cIixcbiAgXCJhcmdzXCI6IG51bGwsXG4gIFwic3RvcmFnZUtleVwiOiBudWxsXG59LFxudjIgPSB7XG4gIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gIFwiYWxpYXNcIjogbnVsbCxcbiAgXCJuYW1lXCI6IFwiYXZhdGFyVXJsXCIsXG4gIFwiYXJnc1wiOiBbXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiTGl0ZXJhbFwiLFxuICAgICAgXCJuYW1lXCI6IFwic2l6ZVwiLFxuICAgICAgXCJ2YWx1ZVwiOiAyNFxuICAgIH1cbiAgXSxcbiAgXCJzdG9yYWdlS2V5XCI6IFwiYXZhdGFyVXJsKHNpemU6MjQpXCJcbn07XG5yZXR1cm4ge1xuICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICBcIm5hbWVcIjogXCJyZXBvc2l0b3J5SG9tZVNlbGVjdGlvblZpZXdfdXNlclwiLFxuICBcInR5cGVcIjogXCJVc2VyXCIsXG4gIFwibWV0YWRhdGFcIjoge1xuICAgIFwiY29ubmVjdGlvblwiOiBbXG4gICAgICB7XG4gICAgICAgIFwiY291bnRcIjogXCJvcmdhbml6YXRpb25Db3VudFwiLFxuICAgICAgICBcImN1cnNvclwiOiBcIm9yZ2FuaXphdGlvbkN1cnNvclwiLFxuICAgICAgICBcImRpcmVjdGlvblwiOiBcImZvcndhcmRcIixcbiAgICAgICAgXCJwYXRoXCI6IFtcbiAgICAgICAgICBcIm9yZ2FuaXphdGlvbnNcIlxuICAgICAgICBdXG4gICAgICB9XG4gICAgXVxuICB9LFxuICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogW1xuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICAgIFwibmFtZVwiOiBcIm9yZ2FuaXphdGlvbkNvdW50XCIsXG4gICAgICBcInR5cGVcIjogXCJJbnQhXCIsXG4gICAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgICBcIm5hbWVcIjogXCJvcmdhbml6YXRpb25DdXJzb3JcIixcbiAgICAgIFwidHlwZVwiOiBcIlN0cmluZ1wiLFxuICAgICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICAgIH1cbiAgXSxcbiAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAodjAvKjogYW55Ki8pLFxuICAgICh2MS8qOiBhbnkqLyksXG4gICAgKHYyLyo6IGFueSovKSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBcIm9yZ2FuaXphdGlvbnNcIixcbiAgICAgIFwibmFtZVwiOiBcIl9fUmVwb3NpdG9yeUhvbWVTZWxlY3Rpb25WaWV3X29yZ2FuaXphdGlvbnNfY29ubmVjdGlvblwiLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiT3JnYW5pemF0aW9uQ29ubmVjdGlvblwiLFxuICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgXCJuYW1lXCI6IFwicGFnZUluZm9cIixcbiAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlBhZ2VJbmZvXCIsXG4gICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJoYXNOZXh0UGFnZVwiLFxuICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZW5kQ3Vyc29yXCIsXG4gICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgfVxuICAgICAgICAgIF1cbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgIFwibmFtZVwiOiBcImVkZ2VzXCIsXG4gICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJPcmdhbml6YXRpb25FZGdlXCIsXG4gICAgICAgICAgXCJwbHVyYWxcIjogdHJ1ZSxcbiAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAge1xuICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImN1cnNvclwiLFxuICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibm9kZVwiLFxuICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiT3JnYW5pemF0aW9uXCIsXG4gICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICh2MC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgKHYxLyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAodjIvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ2aWV3ZXJDYW5DcmVhdGVSZXBvc2l0b3JpZXNcIixcbiAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJfX3R5cGVuYW1lXCIsXG4gICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgICAgXVxuICAgICAgICB9XG4gICAgICBdXG4gICAgfVxuICBdXG59O1xufSkoKTtcbi8vIHByZXR0aWVyLWlnbm9yZVxuKG5vZGUvKjogYW55Ki8pLmhhc2ggPSAnMTFhMWYxZDBlYWMzMmJmZjBhMzM3MTIxN2MwZWVkZTMnO1xubW9kdWxlLmV4cG9ydHMgPSBub2RlO1xuIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUEsWUFBWTs7QUFFWjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNB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