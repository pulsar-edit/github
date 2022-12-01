/**
 * @flow
 */

/* eslint-disable */
'use strict';
/*::
import type { ReaderFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type userMentionTooltipContainer_repositoryOwner$ref: FragmentReference;
declare export opaque type userMentionTooltipContainer_repositoryOwner$fragmentType: userMentionTooltipContainer_repositoryOwner$ref;
export type userMentionTooltipContainer_repositoryOwner = {|
  +login: string,
  +avatarUrl: any,
  +repositories: {|
    +totalCount: number
  |},
  +company?: ?string,
  +membersWithRole?: {|
    +totalCount: number
  |},
  +$refType: userMentionTooltipContainer_repositoryOwner$ref,
|};
export type userMentionTooltipContainer_repositoryOwner$data = userMentionTooltipContainer_repositoryOwner;
export type userMentionTooltipContainer_repositoryOwner$key = {
  +$data?: userMentionTooltipContainer_repositoryOwner$data,
  +$fragmentRefs: userMentionTooltipContainer_repositoryOwner$ref,
};
*/

const node
/*: ReaderFragment*/
= function () {
  var v0 = [{
    "kind": "ScalarField",
    "alias": null,
    "name": "totalCount",
    "args": null,
    "storageKey": null
  }];
  return {
    "kind": "Fragment",
    "name": "userMentionTooltipContainer_repositoryOwner",
    "type": "RepositoryOwner",
    "metadata": null,
    "argumentDefinitions": [],
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
    }, {
      "kind": "LinkedField",
      "alias": null,
      "name": "repositories",
      "storageKey": null,
      "args": null,
      "concreteType": "RepositoryConnection",
      "plural": false,
      "selections": v0
      /*: any*/

    }, {
      "kind": "InlineFragment",
      "type": "User",
      "selections": [{
        "kind": "ScalarField",
        "alias": null,
        "name": "company",
        "args": null,
        "storageKey": null
      }]
    }, {
      "kind": "InlineFragment",
      "type": "Organization",
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "membersWithRole",
        "storageKey": null,
        "args": null,
        "concreteType": "OrganizationMemberConnection",
        "plural": false,
        "selections": v0
        /*: any*/

      }]
    }]
  };
}(); // prettier-ignore


node
/*: any*/
.hash = '3ee858460adcfbee1dfc27cf8dc46332';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9jb250YWluZXJzL19fZ2VuZXJhdGVkX18vdXNlck1lbnRpb25Ub29sdGlwQ29udGFpbmVyX3JlcG9zaXRvcnlPd25lci5ncmFwaHFsLmpzIl0sIm5hbWVzIjpbIm5vZGUiLCJ2MCIsImhhc2giLCJtb2R1bGUiLCJleHBvcnRzIl0sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7O0FBRUE7QUFFQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0EsTUFBTUE7QUFBSTtBQUFBLEVBQXdCLFlBQVU7QUFDNUMsTUFBSUMsRUFBRSxHQUFHLENBQ1A7QUFDRSxZQUFRLGFBRFY7QUFFRSxhQUFTLElBRlg7QUFHRSxZQUFRLFlBSFY7QUFJRSxZQUFRLElBSlY7QUFLRSxrQkFBYztBQUxoQixHQURPLENBQVQ7QUFTQSxTQUFPO0FBQ0wsWUFBUSxVQURIO0FBRUwsWUFBUSw2Q0FGSDtBQUdMLFlBQVEsaUJBSEg7QUFJTCxnQkFBWSxJQUpQO0FBS0wsMkJBQXVCLEVBTGxCO0FBTUwsa0JBQWMsQ0FDWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsSUFGWDtBQUdFLGNBQVEsT0FIVjtBQUlFLGNBQVEsSUFKVjtBQUtFLG9CQUFjO0FBTGhCLEtBRFksRUFRWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsSUFGWDtBQUdFLGNBQVEsV0FIVjtBQUlFLGNBQVEsSUFKVjtBQUtFLG9CQUFjO0FBTGhCLEtBUlksRUFlWjtBQUNFLGNBQVEsYUFEVjtBQUVFLGVBQVMsSUFGWDtBQUdFLGNBQVEsY0FIVjtBQUlFLG9CQUFjLElBSmhCO0FBS0UsY0FBUSxJQUxWO0FBTUUsc0JBQWdCLHNCQU5sQjtBQU9FLGdCQUFVLEtBUFo7QUFRRSxvQkFBZUE7QUFBRTs7QUFSbkIsS0FmWSxFQXlCWjtBQUNFLGNBQVEsZ0JBRFY7QUFFRSxjQUFRLE1BRlY7QUFHRSxvQkFBYyxDQUNaO0FBQ0UsZ0JBQVEsYUFEVjtBQUVFLGlCQUFTLElBRlg7QUFHRSxnQkFBUSxTQUhWO0FBSUUsZ0JBQVEsSUFKVjtBQUtFLHNCQUFjO0FBTGhCLE9BRFk7QUFIaEIsS0F6QlksRUFzQ1o7QUFDRSxjQUFRLGdCQURWO0FBRUUsY0FBUSxjQUZWO0FBR0Usb0JBQWMsQ0FDWjtBQUNFLGdCQUFRLGFBRFY7QUFFRSxpQkFBUyxJQUZYO0FBR0UsZ0JBQVEsaUJBSFY7QUFJRSxzQkFBYyxJQUpoQjtBQUtFLGdCQUFRLElBTFY7QUFNRSx3QkFBZ0IsOEJBTmxCO0FBT0Usa0JBQVUsS0FQWjtBQVFFLHNCQUFlQTtBQUFFOztBQVJuQixPQURZO0FBSGhCLEtBdENZO0FBTlQsR0FBUDtBQThEQyxDQXhFZ0MsRUFBakMsQyxDQXlFQTs7O0FBQ0NEO0FBQUk7QUFBTCxDQUFnQkUsSUFBaEIsR0FBdUIsa0NBQXZCO0FBQ0FDLE1BQU0sQ0FBQ0MsT0FBUCxHQUFpQkosSUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBmbG93XG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKjo6XG5pbXBvcnQgdHlwZSB7IFJlYWRlckZyYWdtZW50IH0gZnJvbSAncmVsYXktcnVudGltZSc7XG5pbXBvcnQgdHlwZSB7IEZyYWdtZW50UmVmZXJlbmNlIH0gZnJvbSBcInJlbGF5LXJ1bnRpbWVcIjtcbmRlY2xhcmUgZXhwb3J0IG9wYXF1ZSB0eXBlIHVzZXJNZW50aW9uVG9vbHRpcENvbnRhaW5lcl9yZXBvc2l0b3J5T3duZXIkcmVmOiBGcmFnbWVudFJlZmVyZW5jZTtcbmRlY2xhcmUgZXhwb3J0IG9wYXF1ZSB0eXBlIHVzZXJNZW50aW9uVG9vbHRpcENvbnRhaW5lcl9yZXBvc2l0b3J5T3duZXIkZnJhZ21lbnRUeXBlOiB1c2VyTWVudGlvblRvb2x0aXBDb250YWluZXJfcmVwb3NpdG9yeU93bmVyJHJlZjtcbmV4cG9ydCB0eXBlIHVzZXJNZW50aW9uVG9vbHRpcENvbnRhaW5lcl9yZXBvc2l0b3J5T3duZXIgPSB7fFxuICArbG9naW46IHN0cmluZyxcbiAgK2F2YXRhclVybDogYW55LFxuICArcmVwb3NpdG9yaWVzOiB7fFxuICAgICt0b3RhbENvdW50OiBudW1iZXJcbiAgfH0sXG4gICtjb21wYW55PzogP3N0cmluZyxcbiAgK21lbWJlcnNXaXRoUm9sZT86IHt8XG4gICAgK3RvdGFsQ291bnQ6IG51bWJlclxuICB8fSxcbiAgKyRyZWZUeXBlOiB1c2VyTWVudGlvblRvb2x0aXBDb250YWluZXJfcmVwb3NpdG9yeU93bmVyJHJlZixcbnx9O1xuZXhwb3J0IHR5cGUgdXNlck1lbnRpb25Ub29sdGlwQ29udGFpbmVyX3JlcG9zaXRvcnlPd25lciRkYXRhID0gdXNlck1lbnRpb25Ub29sdGlwQ29udGFpbmVyX3JlcG9zaXRvcnlPd25lcjtcbmV4cG9ydCB0eXBlIHVzZXJNZW50aW9uVG9vbHRpcENvbnRhaW5lcl9yZXBvc2l0b3J5T3duZXIka2V5ID0ge1xuICArJGRhdGE/OiB1c2VyTWVudGlvblRvb2x0aXBDb250YWluZXJfcmVwb3NpdG9yeU93bmVyJGRhdGEsXG4gICskZnJhZ21lbnRSZWZzOiB1c2VyTWVudGlvblRvb2x0aXBDb250YWluZXJfcmVwb3NpdG9yeU93bmVyJHJlZixcbn07XG4qL1xuXG5cbmNvbnN0IG5vZGUvKjogUmVhZGVyRnJhZ21lbnQqLyA9IChmdW5jdGlvbigpe1xudmFyIHYwID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgXCJuYW1lXCI6IFwidG90YWxDb3VudFwiLFxuICAgIFwiYXJnc1wiOiBudWxsLFxuICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gIH1cbl07XG5yZXR1cm4ge1xuICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICBcIm5hbWVcIjogXCJ1c2VyTWVudGlvblRvb2x0aXBDb250YWluZXJfcmVwb3NpdG9yeU93bmVyXCIsXG4gIFwidHlwZVwiOiBcIlJlcG9zaXRvcnlPd25lclwiLFxuICBcIm1ldGFkYXRhXCI6IG51bGwsXG4gIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiBbXSxcbiAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwibG9naW5cIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJhdmF0YXJVcmxcIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJyZXBvc2l0b3JpZXNcIixcbiAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlJlcG9zaXRvcnlDb25uZWN0aW9uXCIsXG4gICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgIFwic2VsZWN0aW9uc1wiOiAodjAvKjogYW55Ki8pXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJJbmxpbmVGcmFnbWVudFwiLFxuICAgICAgXCJ0eXBlXCI6IFwiVXNlclwiLFxuICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgIFwibmFtZVwiOiBcImNvbXBhbnlcIixcbiAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJJbmxpbmVGcmFnbWVudFwiLFxuICAgICAgXCJ0eXBlXCI6IFwiT3JnYW5pemF0aW9uXCIsXG4gICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgXCJuYW1lXCI6IFwibWVtYmVyc1dpdGhSb2xlXCIsXG4gICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogXCJPcmdhbml6YXRpb25NZW1iZXJDb25uZWN0aW9uXCIsXG4gICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgXCJzZWxlY3Rpb25zXCI6ICh2MC8qOiBhbnkqLylcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgXVxufTtcbn0pKCk7XG4vLyBwcmV0dGllci1pZ25vcmVcbihub2RlLyo6IGFueSovKS5oYXNoID0gJzNlZTg1ODQ2MGFkY2ZiZWUxZGZjMjdjZjhkYzQ2MzMyJztcbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcbiJdfQ==