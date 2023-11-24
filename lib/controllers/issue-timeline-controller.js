"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _reactRelay = require("react-relay");

var _issueishTimelineView = _interopRequireDefault(require("../views/issueish-timeline-view"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _default = (0, _reactRelay.createPaginationContainer)(_issueishTimelineView.default, {
  issue: function () {
    const node = require("./__generated__/issueTimelineController_issue.graphql");

    if (node.hash && node.hash !== "d8cfa7a752ac7094c36e60da5e1ff895") {
      console.error("The definition of 'issueTimelineController_issue' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/issueTimelineController_issue.graphql");
  }
}, {
  direction: 'forward',

  getConnectionFromProps(props) {
    return props.issue.timeline;
  },

  getFragmentVariables(prevVars, totalCount) {
    return _objectSpread({}, prevVars, {
      timelineCount: totalCount
    });
  },

  getVariables(props, {
    count,
    cursor
  }, fragmentVariables) {
    return {
      url: props.issue.url,
      timelineCount: count,
      timelineCursor: cursor
    };
  },

  query: function () {
    const node = require("./__generated__/issueTimelineControllerQuery.graphql");

    if (node.hash && node.hash !== "5a04d82da4187ed75fb5e133f79b4ab4") {
      console.error("The definition of 'issueTimelineControllerQuery' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/issueTimelineControllerQuery.graphql");
  }
});

exports.default = _default;