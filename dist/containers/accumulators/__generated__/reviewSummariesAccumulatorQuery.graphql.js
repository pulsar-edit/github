/**
 * @flow
 * @relayHash ca680104e44962e2e537a87c1d3b80cc
 */

/* eslint-disable */
'use strict';
/*::
import type { ConcreteRequest } from 'relay-runtime';
type reviewSummariesAccumulator_pullRequest$ref = any;
export type reviewSummariesAccumulatorQueryVariables = {|
  url: any,
  reviewCount: number,
  reviewCursor?: ?string,
|};
export type reviewSummariesAccumulatorQueryResponse = {|
  +resource: ?{|
    +$fragmentRefs: reviewSummariesAccumulator_pullRequest$ref
  |}
|};
export type reviewSummariesAccumulatorQuery = {|
  variables: reviewSummariesAccumulatorQueryVariables,
  response: reviewSummariesAccumulatorQueryResponse,
|};
*/

/*
query reviewSummariesAccumulatorQuery(
  $url: URI!
  $reviewCount: Int!
  $reviewCursor: String
) {
  resource(url: $url) {
    __typename
    ... on PullRequest {
      ...reviewSummariesAccumulator_pullRequest_2zzc96
    }
    ... on Node {
      id
    }
  }
}

fragment emojiReactionsController_reactable on Reactable {
  id
  ...emojiReactionsView_reactable
}

fragment emojiReactionsView_reactable on Reactable {
  id
  reactionGroups {
    content
    viewerHasReacted
    users {
      totalCount
    }
  }
  viewerCanReact
}

fragment reviewSummariesAccumulator_pullRequest_2zzc96 on PullRequest {
  url
  reviews(first: $reviewCount, after: $reviewCursor) {
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      cursor
      node {
        id
        body
        bodyHTML
        state
        submittedAt
        lastEditedAt
        url
        author {
          __typename
          login
          avatarUrl
          url
          ... on Node {
            id
          }
        }
        viewerCanUpdate
        authorAssociation
        ...emojiReactionsController_reactable
        __typename
      }
    }
  }
}
*/

const node
/*: ConcreteRequest*/
= function () {
  var v0 = [{
    "kind": "LocalArgument",
    "name": "url",
    "type": "URI!",
    "defaultValue": null
  }, {
    "kind": "LocalArgument",
    "name": "reviewCount",
    "type": "Int!",
    "defaultValue": null
  }, {
    "kind": "LocalArgument",
    "name": "reviewCursor",
    "type": "String",
    "defaultValue": null
  }],
      v1 = [{
    "kind": "Variable",
    "name": "url",
    "variableName": "url"
  }],
      v2 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "__typename",
    "args": null,
    "storageKey": null
  },
      v3 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "id",
    "args": null,
    "storageKey": null
  },
      v4 = {
    "kind": "ScalarField",
    "alias": null,
    "name": "url",
    "args": null,
    "storageKey": null
  },
      v5 = [{
    "kind": "Variable",
    "name": "after",
    "variableName": "reviewCursor"
  }, {
    "kind": "Variable",
    "name": "first",
    "variableName": "reviewCount"
  }];
  return {
    "kind": "Request",
    "fragment": {
      "kind": "Fragment",
      "name": "reviewSummariesAccumulatorQuery",
      "type": "Query",
      "metadata": null,
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "resource",
        "storageKey": null,
        "args": v1
        /*: any*/
        ,
        "concreteType": null,
        "plural": false,
        "selections": [{
          "kind": "InlineFragment",
          "type": "PullRequest",
          "selections": [{
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
          }]
        }]
      }]
    },
    "operation": {
      "kind": "Operation",
      "name": "reviewSummariesAccumulatorQuery",
      "argumentDefinitions": v0
      /*: any*/
      ,
      "selections": [{
        "kind": "LinkedField",
        "alias": null,
        "name": "resource",
        "storageKey": null,
        "args": v1
        /*: any*/
        ,
        "concreteType": null,
        "plural": false,
        "selections": [v2
        /*: any*/
        , v3
        /*: any*/
        , {
          "kind": "InlineFragment",
          "type": "PullRequest",
          "selections": [v4
          /*: any*/
          , {
            "kind": "LinkedField",
            "alias": null,
            "name": "reviews",
            "storageKey": null,
            "args": v5
            /*: any*/
            ,
            "concreteType": "PullRequestReviewConnection",
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
              "concreteType": "PullRequestReviewEdge",
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
                "concreteType": "PullRequestReview",
                "plural": false,
                "selections": [v3
                /*: any*/
                , {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "body",
                  "args": null,
                  "storageKey": null
                }, {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "bodyHTML",
                  "args": null,
                  "storageKey": null
                }, {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "state",
                  "args": null,
                  "storageKey": null
                }, {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "submittedAt",
                  "args": null,
                  "storageKey": null
                }, {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "lastEditedAt",
                  "args": null,
                  "storageKey": null
                }, v4
                /*: any*/
                , {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "author",
                  "storageKey": null,
                  "args": null,
                  "concreteType": null,
                  "plural": false,
                  "selections": [v2
                  /*: any*/
                  , {
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
                  }, v4
                  /*: any*/
                  , v3
                  /*: any*/
                  ]
                }, {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "viewerCanUpdate",
                  "args": null,
                  "storageKey": null
                }, {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "authorAssociation",
                  "args": null,
                  "storageKey": null
                }, {
                  "kind": "LinkedField",
                  "alias": null,
                  "name": "reactionGroups",
                  "storageKey": null,
                  "args": null,
                  "concreteType": "ReactionGroup",
                  "plural": true,
                  "selections": [{
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "content",
                    "args": null,
                    "storageKey": null
                  }, {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "viewerHasReacted",
                    "args": null,
                    "storageKey": null
                  }, {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "users",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "ReactingUserConnection",
                    "plural": false,
                    "selections": [{
                      "kind": "ScalarField",
                      "alias": null,
                      "name": "totalCount",
                      "args": null,
                      "storageKey": null
                    }]
                  }]
                }, {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "viewerCanReact",
                  "args": null,
                  "storageKey": null
                }, v2
                /*: any*/
                ]
              }]
            }]
          }, {
            "kind": "LinkedHandle",
            "alias": null,
            "name": "reviews",
            "args": v5
            /*: any*/
            ,
            "handle": "connection",
            "key": "ReviewSummariesAccumulator_reviews",
            "filters": null
          }]
        }]
      }]
    },
    "params": {
      "operationKind": "query",
      "name": "reviewSummariesAccumulatorQuery",
      "id": null,
      "text": "query reviewSummariesAccumulatorQuery(\n  $url: URI!\n  $reviewCount: Int!\n  $reviewCursor: String\n) {\n  resource(url: $url) {\n    __typename\n    ... on PullRequest {\n      ...reviewSummariesAccumulator_pullRequest_2zzc96\n    }\n    ... on Node {\n      id\n    }\n  }\n}\n\nfragment emojiReactionsController_reactable on Reactable {\n  id\n  ...emojiReactionsView_reactable\n}\n\nfragment emojiReactionsView_reactable on Reactable {\n  id\n  reactionGroups {\n    content\n    viewerHasReacted\n    users {\n      totalCount\n    }\n  }\n  viewerCanReact\n}\n\nfragment reviewSummariesAccumulator_pullRequest_2zzc96 on PullRequest {\n  url\n  reviews(first: $reviewCount, after: $reviewCursor) {\n    pageInfo {\n      hasNextPage\n      endCursor\n    }\n    edges {\n      cursor\n      node {\n        id\n        body\n        bodyHTML\n        state\n        submittedAt\n        lastEditedAt\n        url\n        author {\n          __typename\n          login\n          avatarUrl\n          url\n          ... on Node {\n            id\n          }\n        }\n        viewerCanUpdate\n        authorAssociation\n        ...emojiReactionsController_reactable\n        __typename\n      }\n    }\n  }\n}\n",
      "metadata": {}
    }
  };
}(); // prettier-ignore


node
/*: any*/
.hash = '74bb2a56369e3c54b76c4ce7c17f328e';
module.exports = node;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9jb250YWluZXJzL2FjY3VtdWxhdG9ycy9fX2dlbmVyYXRlZF9fL3Jldmlld1N1bW1hcmllc0FjY3VtdWxhdG9yUXVlcnkuZ3JhcGhxbC5qcyJdLCJuYW1lcyI6WyJub2RlIiwidjAiLCJ2MSIsInYyIiwidjMiLCJ2NCIsInY1IiwiaGFzaCIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBRUE7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLE1BQU1BO0FBQUk7QUFBQSxFQUF5QixZQUFVO0FBQzdDLE1BQUlDLEVBQUUsR0FBRyxDQUNQO0FBQ0UsWUFBUSxlQURWO0FBRUUsWUFBUSxLQUZWO0FBR0UsWUFBUSxNQUhWO0FBSUUsb0JBQWdCO0FBSmxCLEdBRE8sRUFPUDtBQUNFLFlBQVEsZUFEVjtBQUVFLFlBQVEsYUFGVjtBQUdFLFlBQVEsTUFIVjtBQUlFLG9CQUFnQjtBQUpsQixHQVBPLEVBYVA7QUFDRSxZQUFRLGVBRFY7QUFF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NEJBQVEsa0JBSFY7QUFJRSw0QkFBUSxJQUpWO0FBS0Usa0NBQWM7QUFMaEIsbUJBUlksRUFlWjtBQUNFLDRCQUFRLGFBRFY7QUFFRSw2QkFBUyxJQUZYO0FBR0UsNEJBQVEsT0FIVjtBQUlFLGtDQUFjLElBSmhCO0FBS0UsNEJBQVEsSUFMVjtBQU1FLG9DQUFnQix3QkFObEI7QUFPRSw4QkFBVSxLQVBaO0FBUUUsa0NBQWMsQ0FDWjtBQUNFLDhCQUFRLGFBRFY7QUFFRSwrQkFBUyxJQUZYO0FBR0UsOEJBQVEsWUFIVjtBQUlFLDhCQUFRLElBSlY7QUFLRSxvQ0FBYztBQUxoQixxQkFEWTtBQVJoQixtQkFmWTtBQVJoQixpQkFoRlksRUEySFo7QUFDRSwwQkFBUSxhQURWO0FBRUUsMkJBQVMsSUFGWDtBQUdFLDBCQUFRLGdCQUhWO0FBSUUsMEJBQVEsSUFKVjtBQUtFLGdDQUFjO0FBTGhCLGlCQTNIWSxFQWtJWEQ7QUFBRTtBQWxJUztBQVJoQixlQVJZO0FBUmhCLGFBMUJZO0FBUmhCLFdBRlksRUFxTVo7QUFDRSxvQkFBUSxjQURWO0FBRUUscUJBQVMsSUFGWDtBQUdFLG9CQUFRLFNBSFY7QUFJRSxvQkFBU0c7QUFBRTtBQUpiO0FBS0Usc0JBQVUsWUFMWjtBQU1FLG1CQUFPLG9DQU5UO0FBT0UsdUJBQVc7QUFQYixXQXJNWTtBQUhoQixTQUhZO0FBUmhCLE9BRFk7QUFKSCxLQTVDUjtBQW1STCxjQUFVO0FBQ1IsdUJBQWlCLE9BRFQ7QUFFUixjQUFRLGlDQUZBO0FBR1IsWUFBTSxJQUhFO0FBSVIsY0FBUSx1c0NBSkE7QUFLUixrQkFBWTtBQUxKO0FBblJMLEdBQVA7QUEyUkMsQ0F4VmlDLEVBQWxDLEMsQ0F5VkE7OztBQUNDTjtBQUFJO0FBQUwsQ0FBZ0JPLElBQWhCLEdBQXVCLGtDQUF2QjtBQUNBQyxNQUFNLENBQUNDLE9BQVAsR0FBaUJULElBQWpCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAZmxvd1xuICogQHJlbGF5SGFzaCBjYTY4MDEwNGU0NDk2MmUyZTUzN2E4N2MxZDNiODBjY1xuICovXG5cbi8qIGVzbGludC1kaXNhYmxlICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyo6OlxuaW1wb3J0IHR5cGUgeyBDb25jcmV0ZVJlcXVlc3QgfSBmcm9tICdyZWxheS1ydW50aW1lJztcbnR5cGUgcmV2aWV3U3VtbWFyaWVzQWNjdW11bGF0b3JfcHVsbFJlcXVlc3QkcmVmID0gYW55O1xuZXhwb3J0IHR5cGUgcmV2aWV3U3VtbWFyaWVzQWNjdW11bGF0b3JRdWVyeVZhcmlhYmxlcyA9IHt8XG4gIHVybDogYW55LFxuICByZXZpZXdDb3VudDogbnVtYmVyLFxuICByZXZpZXdDdXJzb3I/OiA/c3RyaW5nLFxufH07XG5leHBvcnQgdHlwZSByZXZpZXdTdW1tYXJpZXNBY2N1bXVsYXRvclF1ZXJ5UmVzcG9uc2UgPSB7fFxuICArcmVzb3VyY2U6ID97fFxuICAgICskZnJhZ21lbnRSZWZzOiByZXZpZXdTdW1tYXJpZXNBY2N1bXVsYXRvcl9wdWxsUmVxdWVzdCRyZWZcbiAgfH1cbnx9O1xuZXhwb3J0IHR5cGUgcmV2aWV3U3VtbWFyaWVzQWNjdW11bGF0b3JRdWVyeSA9IHt8XG4gIHZhcmlhYmxlczogcmV2aWV3U3VtbWFyaWVzQWNjdW11bGF0b3JRdWVyeVZhcmlhYmxlcyxcbiAgcmVzcG9uc2U6IHJldmlld1N1bW1hcmllc0FjY3VtdWxhdG9yUXVlcnlSZXNwb25zZSxcbnx9O1xuKi9cblxuXG4vKlxucXVlcnkgcmV2aWV3U3VtbWFyaWVzQWNjdW11bGF0b3JRdWVyeShcbiAgJHVybDogVVJJIVxuICAkcmV2aWV3Q291bnQ6IEludCFcbiAgJHJldmlld0N1cnNvcjogU3RyaW5nXG4pIHtcbiAgcmVzb3VyY2UodXJsOiAkdXJsKSB7XG4gICAgX190eXBlbmFtZVxuICAgIC4uLiBvbiBQdWxsUmVxdWVzdCB7XG4gICAgICAuLi5yZXZpZXdTdW1tYXJpZXNBY2N1bXVsYXRvcl9wdWxsUmVxdWVzdF8yenpjOTZcbiAgICB9XG4gICAgLi4uIG9uIE5vZGUge1xuICAgICAgaWRcbiAgICB9XG4gIH1cbn1cblxuZnJhZ21lbnQgZW1vamlSZWFjdGlvbnNDb250cm9sbGVyX3JlYWN0YWJsZSBvbiBSZWFjdGFibGUge1xuICBpZFxuICAuLi5lbW9qaVJlYWN0aW9uc1ZpZXdfcmVhY3RhYmxlXG59XG5cbmZyYWdtZW50IGVtb2ppUmVhY3Rpb25zVmlld19yZWFjdGFibGUgb24gUmVhY3RhYmxlIHtcbiAgaWRcbiAgcmVhY3Rpb25Hcm91cHMge1xuICAgIGNvbnRlbnRcbiAgICB2aWV3ZXJIYXNSZWFjdGVkXG4gICAgdXNlcnMge1xuICAgICAgdG90YWxDb3VudFxuICAgIH1cbiAgfVxuICB2aWV3ZXJDYW5SZWFjdFxufVxuXG5mcmFnbWVudCByZXZpZXdTdW1tYXJpZXNBY2N1bXVsYXRvcl9wdWxsUmVxdWVzdF8yenpjOTYgb24gUHVsbFJlcXVlc3Qge1xuICB1cmxcbiAgcmV2aWV3cyhmaXJzdDogJHJldmlld0NvdW50LCBhZnRlcjogJHJldmlld0N1cnNvcikge1xuICAgIHBhZ2VJbmZvIHtcbiAgICAgIGhhc05leHRQYWdlXG4gICAgICBlbmRDdXJzb3JcbiAgICB9XG4gICAgZWRnZXMge1xuICAgICAgY3Vyc29yXG4gICAgICBub2RlIHtcbiAgICAgICAgaWRcbiAgICAgICAgYm9keVxuICAgICAgICBib2R5SFRNTFxuICAgICAgICBzdGF0ZVxuICAgICAgICBzdWJtaXR0ZWRBdFxuICAgICAgICBsYXN0RWRpdGVkQXRcbiAgICAgICAgdXJsXG4gICAgICAgIGF1dGhvciB7XG4gICAgICAgICAgX190eXBlbmFtZVxuICAgICAgICAgIGxvZ2luXG4gICAgICAgICAgYXZhdGFyVXJsXG4gICAgICAgICAgdXJsXG4gICAgICAgICAgLi4uIG9uIE5vZGUge1xuICAgICAgICAgICAgaWRcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdmlld2VyQ2FuVXBkYXRlXG4gICAgICAgIGF1dGhvckFzc29jaWF0aW9uXG4gICAgICAgIC4uLmVtb2ppUmVhY3Rpb25zQ29udHJvbGxlcl9yZWFjdGFibGVcbiAgICAgICAgX190eXBlbmFtZVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuKi9cblxuY29uc3Qgbm9kZS8qOiBDb25jcmV0ZVJlcXVlc3QqLyA9IChmdW5jdGlvbigpe1xudmFyIHYwID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgIFwibmFtZVwiOiBcInVybFwiLFxuICAgIFwidHlwZVwiOiBcIlVSSSFcIixcbiAgICBcImRlZmF1bHRWYWx1ZVwiOiBudWxsXG4gIH0sXG4gIHtcbiAgICBcImtpbmRcIjogXCJMb2NhbEFyZ3VtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwicmV2aWV3Q291bnRcIixcbiAgICBcInR5cGVcIjogXCJJbnQhXCIsXG4gICAgXCJkZWZhdWx0VmFsdWVcIjogbnVsbFxuICB9LFxuICB7XG4gICAgXCJraW5kXCI6IFwiTG9jYWxBcmd1bWVudFwiLFxuICAgIFwibmFtZVwiOiBcInJldmlld0N1cnNvclwiLFxuICAgIFwidHlwZVwiOiBcIlN0cmluZ1wiLFxuICAgIFwiZGVmYXVsdFZhbHVlXCI6IG51bGxcbiAgfVxuXSxcbnYxID0gW1xuICB7XG4gICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICBcIm5hbWVcIjogXCJ1cmxcIixcbiAgICBcInZhcmlhYmxlTmFtZVwiOiBcInVybFwiXG4gIH1cbl0sXG52MiA9IHtcbiAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgXCJhbGlhc1wiOiBudWxsLFxuICBcIm5hbWVcIjogXCJfX3R5cGVuYW1lXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnYzID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcImlkXCIsXG4gIFwiYXJnc1wiOiBudWxsLFxuICBcInN0b3JhZ2VLZXlcIjogbnVsbFxufSxcbnY0ID0ge1xuICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICBcImFsaWFzXCI6IG51bGwsXG4gIFwibmFtZVwiOiBcInVybFwiLFxuICBcImFyZ3NcIjogbnVsbCxcbiAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbn0sXG52NSA9IFtcbiAge1xuICAgIFwia2luZFwiOiBcIlZhcmlhYmxlXCIsXG4gICAgXCJuYW1lXCI6IFwiYWZ0ZXJcIixcbiAgICBcInZhcmlhYmxlTmFtZVwiOiBcInJldmlld0N1cnNvclwiXG4gIH0sXG4gIHtcbiAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgIFwibmFtZVwiOiBcImZpcnN0XCIsXG4gICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJyZXZpZXdDb3VudFwiXG4gIH1cbl07XG5yZXR1cm4ge1xuICBcImtpbmRcIjogXCJSZXF1ZXN0XCIsXG4gIFwiZnJhZ21lbnRcIjoge1xuICAgIFwia2luZFwiOiBcIkZyYWdtZW50XCIsXG4gICAgXCJuYW1lXCI6IFwicmV2aWV3U3VtbWFyaWVzQWNjdW11bGF0b3JRdWVyeVwiLFxuICAgIFwidHlwZVwiOiBcIlF1ZXJ5XCIsXG4gICAgXCJtZXRhZGF0YVwiOiBudWxsLFxuICAgIFwiYXJndW1lbnREZWZpbml0aW9uc1wiOiAodjAvKjogYW55Ki8pLFxuICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICB7XG4gICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgXCJuYW1lXCI6IFwicmVzb3VyY2VcIixcbiAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgIFwiYXJnc1wiOiAodjEvKjogYW55Ki8pLFxuICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBudWxsLFxuICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICBcImtpbmRcIjogXCJJbmxpbmVGcmFnbWVudFwiLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IFwiUHVsbFJlcXVlc3RcIixcbiAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJGcmFnbWVudFNwcmVhZFwiLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInJldmlld1N1bW1hcmllc0FjY3VtdWxhdG9yX3B1bGxSZXF1ZXN0XCIsXG4gICAgICAgICAgICAgICAgXCJhcmdzXCI6IFtcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiVmFyaWFibGVcIixcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicmV2aWV3Q291bnRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJyZXZpZXdDb3VudFwiXG4gICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJWYXJpYWJsZVwiLFxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJyZXZpZXdDdXJzb3JcIixcbiAgICAgICAgICAgICAgICAgICAgXCJ2YXJpYWJsZU5hbWVcIjogXCJyZXZpZXdDdXJzb3JcIlxuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICAgIH1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIF1cbiAgfSxcbiAgXCJvcGVyYXRpb25cIjoge1xuICAgIFwia2luZFwiOiBcIk9wZXJhdGlvblwiLFxuICAgIFwibmFtZVwiOiBcInJldmlld1N1bW1hcmllc0FjY3VtdWxhdG9yUXVlcnlcIixcbiAgICBcImFyZ3VtZW50RGVmaW5pdGlvbnNcIjogKHYwLyo6IGFueSovKSxcbiAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAge1xuICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgIFwibmFtZVwiOiBcInJlc291cmNlXCIsXG4gICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICBcImFyZ3NcIjogKHYxLyo6IGFueSovKSxcbiAgICAgICAgXCJjb25jcmV0ZVR5cGVcIjogbnVsbCxcbiAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgKHYyLyo6IGFueSovKSxcbiAgICAgICAgICAodjMvKjogYW55Ki8pLFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIFwia2luZFwiOiBcIklubGluZUZyYWdtZW50XCIsXG4gICAgICAgICAgICBcInR5cGVcIjogXCJQdWxsUmVxdWVzdFwiLFxuICAgICAgICAgICAgXCJzZWxlY3Rpb25zXCI6IFtcbiAgICAgICAgICAgICAgKHY0Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInJldmlld3NcIixcbiAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICBcImFyZ3NcIjogKHY1Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlB1bGxSZXF1ZXN0UmV2aWV3Q29ubmVjdGlvblwiLFxuICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicGFnZUluZm9cIixcbiAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlBhZ2VJbmZvXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBcInNlbGVjdGlvbnNcIjogW1xuICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJoYXNOZXh0UGFnZVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImVuZEN1cnNvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJlZGdlc1wiLFxuICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgIFwiY29uY3JldGVUeXBlXCI6IFwiUHVsbFJlcXVlc3RSZXZpZXdFZGdlXCIsXG4gICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImN1cnNvclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcIm5vZGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlB1bGxSZXF1ZXN0UmV2aWV3XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh2My8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJib2R5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImJvZHlIVE1MXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInN0YXRlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInN1Ym1pdHRlZEF0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImxhc3RFZGl0ZWRBdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh2NC8qOiBhbnkqLyksXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJhdXRob3JcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwicGx1cmFsXCI6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAodjIvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcImxvZ2luXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhbGlhc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJhdmF0YXJVcmxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJhcmdzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKHY0Lyo6IGFueSovKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICh2My8qOiBhbnkqLylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ2aWV3ZXJDYW5VcGRhdGVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiYXV0aG9yQXNzb2NpYXRpb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbFxuICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiTGlua2VkRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicmVhY3Rpb25Hcm91cHNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInN0b3JhZ2VLZXlcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlJlYWN0aW9uR3JvdXBcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInBsdXJhbFwiOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY29udGVudFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIlNjYWxhckZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwidmlld2VySGFzUmVhY3RlZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImFyZ3NcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwia2luZFwiOiBcIkxpbmtlZEZpZWxkXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwidXNlcnNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImNvbmNyZXRlVHlwZVwiOiBcIlJlYWN0aW5nVXNlckNvbm5lY3Rpb25cIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJwbHVyYWxcIjogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic2VsZWN0aW9uc1wiOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJraW5kXCI6IFwiU2NhbGFyRmllbGRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibmFtZVwiOiBcInRvdGFsQ291bnRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yYWdlS2V5XCI6IG51bGxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJTY2FsYXJGaWVsZFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYWxpYXNcIjogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ2aWV3ZXJDYW5SZWFjdFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiYXJnc1wiOiBudWxsLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwic3RvcmFnZUtleVwiOiBudWxsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICh2Mi8qOiBhbnkqLylcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBcImtpbmRcIjogXCJMaW5rZWRIYW5kbGVcIixcbiAgICAgICAgICAgICAgICBcImFsaWFzXCI6IG51bGwsXG4gICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicmV2aWV3c1wiLFxuICAgICAgICAgICAgICAgIFwiYXJnc1wiOiAodjUvKjogYW55Ki8pLFxuICAgICAgICAgICAgICAgIFwiaGFuZGxlXCI6IFwiY29ubmVjdGlvblwiLFxuICAgICAgICAgICAgICAgIFwia2V5XCI6IFwiUmV2aWV3U3VtbWFyaWVzQWNjdW11bGF0b3JfcmV2aWV3c1wiLFxuICAgICAgICAgICAgICAgIFwiZmlsdGVyc1wiOiBudWxsXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICBdXG4gIH0sXG4gIFwicGFyYW1zXCI6IHtcbiAgICBcIm9wZXJhdGlvbktpbmRcIjogXCJxdWVyeVwiLFxuICAgIFwibmFtZVwiOiBcInJldmlld1N1bW1hcmllc0FjY3VtdWxhdG9yUXVlcnlcIixcbiAgICBcImlkXCI6IG51bGwsXG4gICAgXCJ0ZXh0XCI6IFwicXVlcnkgcmV2aWV3U3VtbWFyaWVzQWNjdW11bGF0b3JRdWVyeShcXG4gICR1cmw6IFVSSSFcXG4gICRyZXZpZXdDb3VudDogSW50IVxcbiAgJHJldmlld0N1cnNvcjogU3RyaW5nXFxuKSB7XFxuICByZXNvdXJjZSh1cmw6ICR1cmwpIHtcXG4gICAgX190eXBlbmFtZVxcbiAgICAuLi4gb24gUHVsbFJlcXVlc3Qge1xcbiAgICAgIC4uLnJldmlld1N1bW1hcmllc0FjY3VtdWxhdG9yX3B1bGxSZXF1ZXN0XzJ6emM5NlxcbiAgICB9XFxuICAgIC4uLiBvbiBOb2RlIHtcXG4gICAgICBpZFxcbiAgICB9XFxuICB9XFxufVxcblxcbmZyYWdtZW50IGVtb2ppUmVhY3Rpb25zQ29udHJvbGxlcl9yZWFjdGFibGUgb24gUmVhY3RhYmxlIHtcXG4gIGlkXFxuICAuLi5lbW9qaVJlYWN0aW9uc1ZpZXdfcmVhY3RhYmxlXFxufVxcblxcbmZyYWdtZW50IGVtb2ppUmVhY3Rpb25zVmlld19yZWFjdGFibGUgb24gUmVhY3RhYmxlIHtcXG4gIGlkXFxuICByZWFjdGlvbkdyb3VwcyB7XFxuICAgIGNvbnRlbnRcXG4gICAgdmlld2VySGFzUmVhY3RlZFxcbiAgICB1c2VycyB7XFxuICAgICAgdG90YWxDb3VudFxcbiAgICB9XFxuICB9XFxuICB2aWV3ZXJDYW5SZWFjdFxcbn1cXG5cXG5mcmFnbWVudCByZXZpZXdTdW1tYXJpZXNBY2N1bXVsYXRvcl9wdWxsUmVxdWVzdF8yenpjOTYgb24gUHVsbFJlcXVlc3Qge1xcbiAgdXJsXFxuICByZXZpZXdzKGZpcnN0OiAkcmV2aWV3Q291bnQsIGFmdGVyOiAkcmV2aWV3Q3Vyc29yKSB7XFxuICAgIHBhZ2VJbmZvIHtcXG4gICAgICBoYXNOZXh0UGFnZVxcbiAgICAgIGVuZEN1cnNvclxcbiAgICB9XFxuICAgIGVkZ2VzIHtcXG4gICAgICBjdXJzb3JcXG4gICAgICBub2RlIHtcXG4gICAgICAgIGlkXFxuICAgICAgICBib2R5XFxuICAgICAgICBib2R5SFRNTFxcbiAgICAgICAgc3RhdGVcXG4gICAgICAgIHN1Ym1pdHRlZEF0XFxuICAgICAgICBsYXN0RWRpdGVkQXRcXG4gICAgICAgIHVybFxcbiAgICAgICAgYXV0aG9yIHtcXG4gICAgICAgICAgX190eXBlbmFtZVxcbiAgICAgICAgICBsb2dpblxcbiAgICAgICAgICBhdmF0YXJVcmxcXG4gICAgICAgICAgdXJsXFxuICAgICAgICAgIC4uLiBvbiBOb2RlIHtcXG4gICAgICAgICAgICBpZFxcbiAgICAgICAgICB9XFxuICAgICAgICB9XFxuICAgICAgICB2aWV3ZXJDYW5VcGRhdGVcXG4gICAgICAgIGF1dGhvckFzc29jaWF0aW9uXFxuICAgICAgICAuLi5lbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXJfcmVhY3RhYmxlXFxuICAgICAgICBfX3R5cGVuYW1lXFxuICAgICAgfVxcbiAgICB9XFxuICB9XFxufVxcblwiLFxuICAgIFwibWV0YWRhdGFcIjoge31cbiAgfVxufTtcbn0pKCk7XG4vLyBwcmV0dGllci1pZ25vcmVcbihub2RlLyo6IGFueSovKS5oYXNoID0gJzc0YmIyYTU2MzY5ZTNjNTRiNzZjNGNlN2MxN2YzMjhlJztcbm1vZHVsZS5leHBvcnRzID0gbm9kZTtcbiJdfQ==