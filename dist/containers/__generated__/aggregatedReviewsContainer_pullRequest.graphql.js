/**
 * @flow
 */

/* eslint-disable */
'use strict';
/*::
import type { ReaderFragment } from 'relay-runtime';
type reviewSummariesAccumulator_pullRequest$ref = any;
type reviewThreadsAccumulator_pullRequest$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type aggregatedReviewsContainer_pullRequest$ref: FragmentReference;
declare export opaque type aggregatedReviewsContainer_pullRequest$fragmentType: aggregatedReviewsContainer_pullRequest$ref;
export type aggregatedReviewsContainer_pullRequest = {|
  +id: string,
  +$fragmentRefs: reviewSummariesAccumulator_pullRequest$ref & reviewThreadsAccumulator_pullRequest$ref,
  +$refType: aggregatedReviewsContainer_pullRequest$ref,
|};
export type aggregatedReviewsContainer_pullRequest$data = aggregatedReviewsContainer_pullRequest;
export type aggregatedReviewsContainer_pullRequest$key = {
  +$data?: aggregatedReviewsContainer_pullRequest$data,
  +$fragmentRefs: aggregatedReviewsContainer_pullRequest$ref,
};
*/

const node
/*: ReaderFragment*/
= {
  "kind": "Fragment",
  "name": "aggregatedReviewsContainer_pullRequest",
  "type": "PullRequest",
  "metadata": null,
  "argumentDefinitions": [{
    "kind": "LocalArgument",
    "name": "reviewCount",
    "type": "Int!",
    "defaultValue": null
  }, {
    "kind": "LocalArgument",
    "name": "reviewCursor",
    "type": "String",
    "defaultValue": null
  }, {
    "kind": "LocalArgument",
    "name": "threadCount",
    "type": "Int!",
    "defaultValue": null
  }, {
    "kind": "LocalArgument",
    "name": "threadCursor",
    "type": "String",
    "defaultValue": null
  }, {
    "kind": "LocalArgument",
    "name": "commentCount",
    "type": "Int!",
    "defaultValue": null
  }, {
    "kind": "LocalArgument",
    "name": "commentCursor",
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
    "name": "reviewSummariesAccumulator_pullRequest",
    "args": [{
      "kind": "Variable",
      "name": "reviewCount",
      "variableName": "reviewCount"
    }, {
      "kind": "Variable",
      "name": "reviewCursor",
      "variableName": "reviewCursor"
    }]
  }, {
    "kind": "FragmentSpread",
    "name": "reviewThreadsAccumulator_pullRequest",
    "args": [{
      "kind": "Variable",
      "name": "commentCount",
      "variableName": "commentCount"
    }, {
      "kind": "Variable",
      "name": "commentCursor",
      "variableName": "commentCursor"
    }, {
      "kind": "Variable",
      "name": "threadCount",
      "variableName": "threadCount"
    }, {
      "kind": "Variable",
      "name": "threadCursor",
      "variableName": "threadCursor"
    }]
  }]
}; // prettier-ignore

node
/*: any*/
.hash = '830225d5b83d6c320e16cf824fe0cca6';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9jb250YWluZXJzL19fZ2VuZXJhdGVkX18vYWdncmVnYXRlZFJldmlld3NDb250YWluZXJfcHVsbFJlcXVlc3QuZ3JhcGhxbC5qcyJdLCJuYW1lcyI6WyJub2RlIiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTs7QUFFQTtBQUVBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUdBLE1BQU1BO0FBQUk7QUFBQSxFQUF1QjtBQUMvQixVQUFRLFVBRHVCO0FBRS9CLFVBQVEsd0NBRnVCO0FBRy9CLFVBQVEsYUFIdUI7QUFJL0IsY0FBWSxJQUptQjtBQUsvQix5QkFBdUIsQ0FDckI7QUFDRSxZQUFRLGVBRFY7QUFFRSxZQUFRLGFBRlY7QUFHRSxZQUFRLE1BSFY7QUFJRSxvQkFBZ0I7QUFKbEIsR0FEcUIsRUFPckI7QUFDRSxZQUFRLGVBRFY7QUFFRSxZQUFRLGNBRlY7QUFHRSxZQUFRLFFBSFY7QUFJRSxvQkFBZ0I7QUFKbEIsR0FQcUIsRUFhckI7QUFDRSxZQUFRLGVBRFY7QUFFRSxZQUFRLGFBRlY7QUFHRSxZQUFRLE1BSFY7QUFJRSxvQkFBZ0I7QUFKbEIsR0FicUIsRUFtQnJCO0FBQ0UsWUFBUSxlQURWO0FBRUUsWUFBUSxjQUZWO0FBR0UsWUFBUSxRQUhWO0FBSUUsb0JBQWdCO0FBSmxCLEdBbkJxQixFQXlCckI7QUFDRSxZQUFRLGVBRFY7QUFFRSxZQUFRLGNBRlY7QUFHRSxZQUFRLE1BSFY7QUFJRSxvQkFBZ0I7QUFKbEIsR0F6QnFCLEVBK0JyQjtBQUNFLFlBQVEsZUFEVjtBQUVFLFlBQVEsZUFGVjtBQUdFLFlBQVEsUUFIVjtBQUlFLG9CQUFnQjtBQUpsQixHQS9CcUIsQ0FMUTtBQTJDL0IsZ0JBQWMsQ0FDWjtBQUNFLFlBQVEsYUFEVjtBQUVFLGFBQVMsSUFGWDtBQUdFLFlBQVEsSUFIVjtBQUlFLFlBQVEsSUFKVjtBQUtFLGtCQUFjO0FBTGhCLEdBRFksRUFRWjtBQUNFLFlBQVEsZ0JBRFY7QUFFRSxZQUFRLHdDQUZWO0FBR0UsWUFBUSxDQUNOO0FBQ0UsY0FBUSxVQURWO0FBRUUsY0FBUSxhQUZWO0FBR0Usc0JBQWdCO0FBSGxCLEtBRE0sRUFNTjtBQUNFLGNBQVEsVUFEVjtBQUVFLGNBQVEsY0FGVjtBQUdFLHNCQUFnQjtBQUhsQixLQU5NO0FBSFYsR0FSWSxFQXdCWjtBQUNFLFlBQVEsZ0JBRFY7QUFFRSxZQUFRLHNDQUZWO0FBR0UsWUFBUSxDQUNOO0FBQ0UsY0FBUSxVQURWO0FBRUUsY0FBUSxjQUZWO0FBR0Usc0JBQWdCO0FBSGxCLEtBRE0sRUFNTjtBQUNFLGNBQVEsVUFEVjtBQUVFLGNBQVEsZUFGVjtBQUdFLHNCQUFnQjtBQUhsQixLQU5NLEVBV047QUFDRSxjQUFRLFVBRFY7QUFFRSxjQUFRLGFBRlY7QUFHRSxzQkFBZ0I7QUFIbEIsS0FYTSxFQWdCTjtBQUNFLGNBQVEsVUFEVjtBQUVFLGNBQVEsY0FGVjtBQUdFLHNCQUFnQjtBQUhsQixLQWhCTTtBQUhWLEdBeEJZO0FBM0NpQixDQUFqQyxDLENBK0ZBOztBQUNDQTtBQUFJO0FBQUwsQ0FBZ0JDLElBQWhCLEdBQXVCLGtDQUF2QjtBQUNBQyxNQUFNLENBQUNDLE9BQVAsR0FBaUJILElBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmxvd1xuICovXG5cbi8qIGVzbGludC1kaXNhYmxlICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyo6OlxuaW1wb3J0IHR5cGUgeyBSZWFkZXJGcmFnbWVudCB9IGZyb20gJ3JlbGF5LXJ1bnRpbWUnO1xudHlwZSByZXZpZXdTdW1tYXJpZXNBY2N1bXVsYXRvcl9wdWxsUmVxdWVzdCRyZWYgPSBhbnk7XG50eXBlIHJldmlld1RocmVhZHNBY2N1bXVsYXRvcl9wdWxsUmVxdWVzdCRyZWYgPSBhbnk7XG5pbXBvcnQgdHlwZSB7IEZyYWdtZW50UmVmZXJlbmNlIH0gZnJvbSBcInJlbGF5LXJ1bnRpbWVcIjtcbmRlY2xhcmUgZXhwb3J0IG9wYXF1ZSB0eXBlIGFnZ3JlZ2F0ZWRSZXZpZXdzQ29udGFpbmVyX3B1bGxSZXF1ZXN0JHJlZjogRnJhZ21lbnRSZWZlcmVuY2U7XG5kZWNsYXJlIGV4cG9ydCBvcGFxdWUgdHlwZSBhZ2dyZWdhdGVkUmV2aWV3c0NvbnRhaW5lcl9wdWxsUmVxdWVzdCRmcmFnbWVudFR5cGU6IGFnZ3JlZ2F0ZWRSZXZpZXdzQ29udGFpbmVyX3B1bGxSZXF1ZXN0JHJlZjtcbmV4cG9ydCB0eXBlIGFnZ3JlZ2F0ZWRSZXZpZXdzQ29udGFpbmVyX3B1bGxSZXF1ZXN0ID0ge3xcbiAgK2lkOiBzdHJpbmcsXG4gICskZnJhZ21lbnRSZWZzOiByZXZpZXdTdW1tYXJpZXNBY2N1bXVsYXRvcl9wdWxsUmVxdWVzdCRyZWYgJiByZXZpZXdUaHJlYWRzQWNjdW11bGF0b3JfcHVsbFJlcXVlc3QkcmVmLFxuICArJHJlZlR5cGU6IGFnZ3JlZ2F0ZWRSZXZpZXdzQ29udGFpbmVyX3B1bGxSZXF1ZXN0JHJlZixcbnx9O1xuZXhwb3J0IHR5cGUgYWdncmVnYXRlZFJldmlld3NDb250YWluZXJfcHVsbFJlcXVlc3QkZGF0YSA9IGFnZ3JlZ2F0ZWRSZXZpZXdzQ29udGFpbmVyX3B1bGxSZXF1ZXN0O1xuZXhwb3J0IHR5cGUgYWdncmVnYXRlZFJldmlld3NDb250YWluZXJfcHVsbFJlcXVlc3Qka2V5ID0ge1xuICArJGRhdGE/OiBhZ2dyZWdhdGVkUmV2aWV3c0NvbnRhaW5lcl9wdWxsUmVxdWVzdCRkYXRhLFxuICArJGZyYWdtZW50UmVmczogYWdncmVnYXRlZFJldmlld3NDb250YWluZXJfcHVsbFJlcXVlc3QkcmVmLFxufTtcbiovXG5cblxuY29uc3Qgbm9kZS8qOiBSZWFkZXJGcmFnbWVudCovID0ge1xuICBcImtpbmRcIjogXCJGcmFnbWVudFwiLFxuICBcIm5hbWVcIjogXCJhZ2dyZWdhdGVkUmV2aWV3c0NvbnRhaW5lcl9wdWxsUmVxdWVzdFwiLFxuICBcInR5cGVcIjogXCJQdWxsUmVxdWVzdFwiLFxuICBcIm1ldGFkYXRhXCI6IG51bGwsXG4gIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiBbXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgICAgXCJuYW1lXCI6IFwicmV2aWV3Q291bnRcIixcbiAgICAgIFwidHlwZVwiOiBcIkludCFcIixcbiAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICAgIFwibmFtZVwiOiBcInJldmlld0N1cnNvclwiLFxuICAgICAgXCJ0eXBlXCI6IFwiU3RyaW5nXCIsXG4gICAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgICBcIm5hbWVcIjogXCJ0aHJlYWRDb3VudFwiLFxuICAgICAgXCJ0eXBlXCI6IFwiSW50IVwiLFxuICAgICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgICAgXCJuYW1lXCI6IFwidGhyZWFkQ3Vyc29yXCIsXG4gICAgICBcInR5cGVcIjogXCJTdHJpbmdcIixcbiAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICAgIFwibmFtZVwiOiBcImNvbW1lbnRDb3VudFwiLFxuICAgICAgXCJ0eXBlXCI6IFwiSW50IVwiLFxuICAgICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgICAgXCJuYW1lXCI6IFwiY29tbWVudEN1cnNvclwiLFxuICAgICAgXCJ0eXBlXCI6IFwiU3RyaW5nXCIsXG4gICAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gICAgfVxuICBdLFxuICBcInNlbGVjdGlvbnNcIjogW1xuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICBcIm5hbWVcIjogXCJpZFwiLFxuICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiRnJhZ21lbnRTcHJlYWRcIixcbiAgICAgIFwibmFtZVwiOiBcInJldmlld1N1bW1hcmllc0FjY3VtdWxhdG9yX3B1bGxSZXF1ZXN0XCIsXG4gICAgICBcImFyZ3NcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICAgICAgICBcIm5hbWVcIjogXCJyZXZpZXdDb3VudFwiLFxuICAgICAgICAgIFwidmFyaWFibGVOYW1lXCI6IFwicmV2aWV3Q291bnRcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICAgICAgICBcIm5hbWVcIjogXCJyZXZpZXdDdXJzb3JcIixcbiAgICAgICAgICBcInZhcmlhYmxlTmFtZVwiOiBcInJldmlld0N1cnNvclwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkZyYWdtZW50U3ByZWFkXCIsXG4gICAgICBcIm5hbWVcIjogXCJyZXZpZXdUaHJlYWRzQWNjdW11bGF0b3JfcHVsbFJlcXVlc3RcIixcbiAgICAgIFwiYXJnc1wiOiBbXG4gICAgICAgIHtcbiAgICAgICAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgICAgICAgIFwibmFtZVwiOiBcImNvbW1lbnRDb3VudFwiLFxuICAgICAgICAgIFwidmFyaWFibGVOYW1lXCI6IFwiY29tbWVudENvdW50XCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgICAgICAgXCJuYW1lXCI6IFwiY29tbWVudEN1cnNvclwiLFxuICAgICAgICAgIFwidmFyaWFibGVOYW1lXCI6IFwiY29tbWVudEN1cnNvclwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgICAgICAgIFwibmFtZVwiOiBcInRocmVhZENvdW50XCIsXG4gICAgICAgICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJ0aHJlYWRDb3VudFwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgICAgICAgIFwibmFtZVwiOiBcInRocmVhZEN1cnNvclwiLFxuICAgICAgICAgIFwidmFyaWFibGVOYW1lXCI6IFwidGhyZWFkQ3Vyc29yXCJcbiAgICAgICAgfVxuICAgICAgXVxuICAgIH1cbiAgXVxufTtcbi8vIHByZXR0aWVyLWlnbm9yZVxuKG5vZGUvKjogYW55Ki8pLmhhc2ggPSAnODMwMjI1ZDViODNkNmMzMjBlMTZjZjgyNGZlMGNjYTYnO1xubW9kdWxlLmV4cG9ydHMgPSBub2RlO1xuIl19