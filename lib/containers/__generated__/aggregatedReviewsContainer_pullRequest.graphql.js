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
const node /*: ReaderFragment*/ = {
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
};
// prettier-ignore
node /*: any*/.hash = '830225d5b83d6c320e16cf824fe0cca6';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJub2RlIiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwic291cmNlcyI6WyJhZ2dyZWdhdGVkUmV2aWV3c0NvbnRhaW5lcl9wdWxsUmVxdWVzdC5ncmFwaHFsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGZsb3dcbiAqL1xuXG4vKiBlc2xpbnQtZGlzYWJsZSAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qOjpcbmltcG9ydCB0eXBlIHsgUmVhZGVyRnJhZ21lbnQgfSBmcm9tICdyZWxheS1ydW50aW1lJztcbnR5cGUgcmV2aWV3U3VtbWFyaWVzQWNjdW11bGF0b3JfcHVsbFJlcXVlc3QkcmVmID0gYW55O1xudHlwZSByZXZpZXdUaHJlYWRzQWNjdW11bGF0b3JfcHVsbFJlcXVlc3QkcmVmID0gYW55O1xuaW1wb3J0IHR5cGUgeyBGcmFnbWVudFJlZmVyZW5jZSB9IGZyb20gXCJyZWxheS1ydW50aW1lXCI7XG5kZWNsYXJlIGV4cG9ydCBvcGFxdWUgdHlwZSBhZ2dyZWdhdGVkUmV2aWV3c0NvbnRhaW5lcl9wdWxsUmVxdWVzdCRyZWY6IEZyYWdtZW50UmVmZXJlbmNlO1xuZGVjbGFyZSBleHBvcnQgb3BhcXVlIHR5cGUgYWdncmVnYXRlZFJldmlld3NDb250YWluZXJfcHVsbFJlcXVlc3QkZnJhZ21lbnRUeXBlOiBhZ2dyZWdhdGVkUmV2aWV3c0NvbnRhaW5lcl9wdWxsUmVxdWVzdCRyZWY7XG5leHBvcnQgdHlwZSBhZ2dyZWdhdGVkUmV2aWV3c0NvbnRhaW5lcl9wdWxsUmVxdWVzdCA9IHt8XG4gICtpZDogc3RyaW5nLFxuICArJGZyYWdtZW50UmVmczogcmV2aWV3U3VtbWFyaWVzQWNjdW11bGF0b3JfcHVsbFJlcXVlc3QkcmVmICYgcmV2aWV3VGhyZWFkc0FjY3VtdWxhdG9yX3B1bGxSZXF1ZXN0JHJlZixcbiAgKyRyZWZUeXBlOiBhZ2dyZWdhdGVkUmV2aWV3c0NvbnRhaW5lcl9wdWxsUmVxdWVzdCRyZWYsXG58fTtcbmV4cG9ydCB0eXBlIGFnZ3JlZ2F0ZWRSZXZpZXdzQ29udGFpbmVyX3B1bGxSZXF1ZXN0JGRhdGEgPSBhZ2dyZWdhdGVkUmV2aWV3c0NvbnRhaW5lcl9wdWxsUmVxdWVzdDtcbmV4cG9ydCB0eXBlIGFnZ3JlZ2F0ZWRSZXZpZXdzQ29udGFpbmVyX3B1bGxSZXF1ZXN0JGtleSA9IHtcbiAgKyRkYXRhPzogYWdncmVnYXRlZFJldmlld3NDb250YWluZXJfcHVsbFJlcXVlc3QkZGF0YSxcbiAgKyRmcmFnbWVudFJlZnM6IGFnZ3JlZ2F0ZWRSZXZpZXdzQ29udGFpbmVyX3B1bGxSZXF1ZXN0JHJlZixcbn07XG4qL1xuXG5cbmNvbnN0IG5vZGUvKjogUmVhZGVyRnJhZ21lbnQqLyA9IHtcbiAgXCJraW5kXCI6IFwiRnJhZ21lbnRcIixcbiAgXCJuYW1lXCI6IFwiYWdncmVnYXRlZFJldmlld3NDb250YWluZXJfcHVsbFJlcXVlc3RcIixcbiAgXCJ0eXBlXCI6IFwiUHVsbFJlcXVlc3RcIixcbiAgXCJtZXRhZGF0YVwiOiBudWxsLFxuICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogW1xuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICAgIFwibmFtZVwiOiBcInJldmlld0NvdW50XCIsXG4gICAgICBcInR5cGVcIjogXCJJbnQhXCIsXG4gICAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgICBcIm5hbWVcIjogXCJyZXZpZXdDdXJzb3JcIixcbiAgICAgIFwidHlwZVwiOiBcIlN0cmluZ1wiLFxuICAgICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICAgIH0sXG4gICAge1xuICAgICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgICAgXCJuYW1lXCI6IFwidGhyZWFkQ291bnRcIixcbiAgICAgIFwidHlwZVwiOiBcIkludCFcIixcbiAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICAgIFwibmFtZVwiOiBcInRocmVhZEN1cnNvclwiLFxuICAgICAgXCJ0eXBlXCI6IFwiU3RyaW5nXCIsXG4gICAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgICBcIm5hbWVcIjogXCJjb21tZW50Q291bnRcIixcbiAgICAgIFwidHlwZVwiOiBcIkludCFcIixcbiAgICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkxvY2FsQXJndW1lbnRcIixcbiAgICAgIFwibmFtZVwiOiBcImNvbW1lbnRDdXJzb3JcIixcbiAgICAgIFwidHlwZVwiOiBcIlN0cmluZ1wiLFxuICAgICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICAgIH1cbiAgXSxcbiAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgXCJuYW1lXCI6IFwiaWRcIixcbiAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICB9LFxuICAgIHtcbiAgICAgIFwia2luZFwiOiBcIkZyYWdtZW50U3ByZWFkXCIsXG4gICAgICBcIm5hbWVcIjogXCJyZXZpZXdTdW1tYXJpZXNBY2N1bXVsYXRvcl9wdWxsUmVxdWVzdFwiLFxuICAgICAgXCJhcmdzXCI6IFtcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgICAgICAgXCJuYW1lXCI6IFwicmV2aWV3Q291bnRcIixcbiAgICAgICAgICBcInZhcmlhYmxlTmFtZVwiOiBcInJldmlld0NvdW50XCJcbiAgICAgICAgfSxcbiAgICAgICAge1xuICAgICAgICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgICAgICAgXCJuYW1lXCI6IFwicmV2aWV3Q3Vyc29yXCIsXG4gICAgICAgICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJyZXZpZXdDdXJzb3JcIlxuICAgICAgICB9XG4gICAgICBdXG4gICAgfSxcbiAgICB7XG4gICAgICBcImtpbmRcIjogXCJGcmFnbWVudFNwcmVhZFwiLFxuICAgICAgXCJuYW1lXCI6IFwicmV2aWV3VGhyZWFkc0FjY3VtdWxhdG9yX3B1bGxSZXF1ZXN0XCIsXG4gICAgICBcImFyZ3NcIjogW1xuICAgICAgICB7XG4gICAgICAgICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICAgICAgICBcIm5hbWVcIjogXCJjb21tZW50Q291bnRcIixcbiAgICAgICAgICBcInZhcmlhYmxlTmFtZVwiOiBcImNvbW1lbnRDb3VudFwiXG4gICAgICAgIH0sXG4gICAgICAgIHtcbiAgICAgICAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgICAgICAgIFwibmFtZVwiOiBcImNvbW1lbnRDdXJzb3JcIixcbiAgICAgICAgICBcInZhcmlhYmxlTmFtZVwiOiBcImNvbW1lbnRDdXJzb3JcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICAgICAgICBcIm5hbWVcIjogXCJ0aHJlYWRDb3VudFwiLFxuICAgICAgICAgIFwidmFyaWFibGVOYW1lXCI6IFwidGhyZWFkQ291bnRcIlxuICAgICAgICB9LFxuICAgICAgICB7XG4gICAgICAgICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICAgICAgICBcIm5hbWVcIjogXCJ0aHJlYWRDdXJzb3JcIixcbiAgICAgICAgICBcInZhcmlhYmxlTmFtZVwiOiBcInRocmVhZEN1cnNvclwiXG4gICAgICAgIH1cbiAgICAgIF1cbiAgICB9XG4gIF1cbn07XG4vLyBwcmV0dGllci1pZ25vcmVcbihub2RlLyo6IGFueSovKS5oYXNoID0gJzgzMDIyNWQ1YjgzZDZjMzIwZTE2Y2Y4MjRmZTBjY2E2Jztcbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcbiJdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBOztBQUVBOztBQUVBLFlBQVk7O0FBRVo7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBR0EsTUFBTUEsSUFBSSx3QkFBdUI7RUFDL0IsTUFBTSxFQUFFLFVBQVU7RUFDbEIsTUFBTSxFQUFFLHdDQUF3QztFQUNoRCxNQUFNLEVBQUUsYUFBYTtFQUNyQixVQUFVLEVBQUUsSUFBSTtFQUNoQixxQkFBcUIsRUFBRSxDQUNyQjtJQUNFLE1BQU0sRUFBRSxlQUFlO0lBQ3ZCLE1BQU0sRUFBRSxhQUFhO0lBQ3JCLE1BQU0sRUFBRSxNQUFNO0lBQ2QsY0FBYyxFQUFFO0VBQ2xCLENBQUMsRUFDRDtJQUNFLE1BQU0sRUFBRSxlQUFlO0lBQ3ZCLE1BQU0sRUFBRSxjQUFjO0lBQ3RCLE1BQU0sRUFBRSxRQUFRO0lBQ2hCLGNBQWMsRUFBRTtFQUNsQixDQUFDLEVBQ0Q7SUFDRSxNQUFNLEVBQUUsZUFBZTtJQUN2QixNQUFNLEVBQUUsYUFBYTtJQUNyQixNQUFNLEVBQUUsTUFBTTtJQUNkLGNBQWMsRUFBRTtFQUNsQixDQUFDLEVBQ0Q7SUFDRSxNQUFNLEVBQUUsZUFBZTtJQUN2QixNQUFNLEVBQUUsY0FBYztJQUN0QixNQUFNLEVBQUUsUUFBUTtJQUNoQixjQUFjLEVBQUU7RUFDbEIsQ0FBQyxFQUNEO0lBQ0UsTUFBTSxFQUFFLGVBQWU7SUFDdkIsTUFBTSxFQUFFLGNBQWM7SUFDdEIsTUFBTSxFQUFFLE1BQU07SUFDZCxjQUFjLEVBQUU7RUFDbEIsQ0FBQyxFQUNEO0lBQ0UsTUFBTSxFQUFFLGVBQWU7SUFDdkIsTUFBTSxFQUFFLGVBQWU7SUFDdkIsTUFBTSxFQUFFLFFBQVE7SUFDaEIsY0FBYyxFQUFFO0VBQ2xCLENBQUMsQ0FDRjtFQUNELFlBQVksRUFBRSxDQUNaO0lBQ0UsTUFBTSxFQUFFLGFBQWE7SUFDckIsT0FBTyxFQUFFLElBQUk7SUFDYixNQUFNLEVBQUUsSUFBSTtJQUNaLE1BQU0sRUFBRSxJQUFJO0lBQ1osWUFBWSxFQUFFO0VBQ2hCLENBQUMsRUFDRDtJQUNFLE1BQU0sRUFBRSxnQkFBZ0I7SUFDeEIsTUFBTSxFQUFFLHdDQUF3QztJQUNoRCxNQUFNLEVBQUUsQ0FDTjtNQUNFLE1BQU0sRUFBRSxVQUFVO01BQ2xCLE1BQU0sRUFBRSxhQUFhO01BQ3JCLGNBQWMsRUFBRTtJQUNsQixDQUFDLEVBQ0Q7TUFDRSxNQUFNLEVBQUUsVUFBVTtNQUNsQixNQUFNLEVBQUUsY0FBYztNQUN0QixjQUFjLEVBQUU7SUFDbEIsQ0FBQztFQUVMLENBQUMsRUFDRDtJQUNFLE1BQU0sRUFBRSxnQkFBZ0I7SUFDeEIsTUFBTSxFQUFFLHNDQUFzQztJQUM5QyxNQUFNLEVBQUUsQ0FDTjtNQUNFLE1BQU0sRUFBRSxVQUFVO01BQ2xCLE1BQU0sRUFBRSxjQUFjO01BQ3RCLGNBQWMsRUFBRTtJQUNsQixDQUFDLEVBQ0Q7TUFDRSxNQUFNLEVBQUUsVUFBVTtNQUNsQixNQUFNLEVBQUUsZUFBZTtNQUN2QixjQUFjLEVBQUU7SUFDbEIsQ0FBQyxFQUNEO01BQ0UsTUFBTSxFQUFFLFVBQVU7TUFDbEIsTUFBTSxFQUFFLGFBQWE7TUFDckIsY0FBYyxFQUFFO0lBQ2xCLENBQUMsRUFDRDtNQUNFLE1BQU0sRUFBRSxVQUFVO01BQ2xCLE1BQU0sRUFBRSxjQUFjO01BQ3RCLGNBQWMsRUFBRTtJQUNsQixDQUFDO0VBRUwsQ0FBQztBQUVMLENBQUM7QUFDRDtBQUNDQSxJQUFJLFdBQVdDLElBQUksR0FBRyxrQ0FBa0M7QUFDekRDLE1BQU0sQ0FBQ0MsT0FBTyxHQUFHSCxJQUFJIn0=