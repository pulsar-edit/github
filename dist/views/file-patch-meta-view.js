"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _classnames = _interopRequireDefault(require("classnames"));

var _commitDetailItem = _interopRequireDefault(require("../items/commit-detail-item"));

var _issueishDetailItem = _interopRequireDefault(require("../items/issueish-detail-item"));

var _propTypes2 = require("../prop-types");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class FilePatchMetaView extends _react.default.Component {
  renderMetaControls() {
    if (this.props.itemType === _commitDetailItem.default || this.props.itemType === _issueishDetailItem.default) {
      return null;
    }

    return _react.default.createElement("div", {
      className: "github-FilePatchView-metaControls"
    }, _react.default.createElement("button", {
      className: (0, _classnames.default)('github-FilePatchView-metaButton', 'icon', this.props.actionIcon),
      onClick: this.props.action
    }, this.props.actionText));
  }

  render() {
    return _react.default.createElement("div", {
      className: "github-FilePatchView-meta"
    }, _react.default.createElement("div", {
      className: "github-FilePatchView-metaContainer"
    }, _react.default.createElement("header", {
      className: "github-FilePatchView-metaHeader"
    }, _react.default.createElement("h3", {
      className: "github-FilePatchView-metaTitle"
    }, this.props.title), this.renderMetaControls()), _react.default.createElement("div", {
      className: "github-FilePatchView-metaDetails"
    }, this.props.children)));
  }

}

exports.default = FilePatchMetaView;

_defineProperty(FilePatchMetaView, "propTypes", {
  title: _propTypes.default.string.isRequired,
  actionIcon: _propTypes.default.string.isRequired,
  actionText: _propTypes.default.string.isRequired,
  action: _propTypes.default.func.isRequired,
  children: _propTypes.default.element.isRequired,
  itemType: _propTypes2.ItemTypePropType.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9maWxlLXBhdGNoLW1ldGEtdmlldy5qcyJdLCJuYW1lcyI6WyJGaWxlUGF0Y2hNZXRhVmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwicmVuZGVyTWV0YUNvbnRyb2xzIiwicHJvcHMiLCJpdGVtVHlwZSIsIkNvbW1pdERldGFpbEl0ZW0iLCJJc3N1ZWlzaERldGFpbEl0ZW0iLCJhY3Rpb25JY29uIiwiYWN0aW9uIiwiYWN0aW9uVGV4dCIsInJlbmRlciIsInRpdGxlIiwiY2hpbGRyZW4iLCJQcm9wVHlwZXMiLCJzdHJpbmciLCJpc1JlcXVpcmVkIiwiZnVuYyIsImVsZW1lbnQiLCJJdGVtVHlwZVByb3BUeXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBRUE7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVlLE1BQU1BLGlCQUFOLFNBQWdDQyxlQUFNQyxTQUF0QyxDQUFnRDtBQVk3REMsRUFBQUEsa0JBQWtCLEdBQUc7QUFDbkIsUUFBSSxLQUFLQyxLQUFMLENBQVdDLFFBQVgsS0FBd0JDLHlCQUF4QixJQUE0QyxLQUFLRixLQUFMLENBQVdDLFFBQVgsS0FBd0JFLDJCQUF4RSxFQUE0RjtBQUMxRixhQUFPLElBQVA7QUFDRDs7QUFDRCxXQUNFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixPQUNFO0FBQ0UsTUFBQSxTQUFTLEVBQUUseUJBQUcsaUNBQUgsRUFBc0MsTUFBdEMsRUFBOEMsS0FBS0gsS0FBTCxDQUFXSSxVQUF6RCxDQURiO0FBRUUsTUFBQSxPQUFPLEVBQUUsS0FBS0osS0FBTCxDQUFXSztBQUZ0QixPQUdHLEtBQUtMLEtBQUwsQ0FBV00sVUFIZCxDQURGLENBREY7QUFTRDs7QUFFREMsRUFBQUEsTUFBTSxHQUFHO0FBQ1AsV0FDRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsT0FDRTtBQUFLLE1BQUEsU0FBUyxFQUFDO0FBQWYsT0FDRTtBQUFRLE1BQUEsU0FBUyxFQUFDO0FBQWxCLE9BQ0U7QUFBSSxNQUFBLFNBQVMsRUFBQztBQUFkLE9BQWdELEtBQUtQLEtBQUwsQ0FBV1EsS0FBM0QsQ0FERixFQUVHLEtBQUtULGtCQUFMLEVBRkgsQ0FERixFQUtFO0FBQUssTUFBQSxTQUFTLEVBQUM7QUFBZixPQUNHLEtBQUtDLEtBQUwsQ0FBV1MsUUFEZCxDQUxGLENBREYsQ0FERjtBQWFEOztBQXpDNEQ7Ozs7Z0JBQTFDYixpQixlQUNBO0FBQ2pCWSxFQUFBQSxLQUFLLEVBQUVFLG1CQUFVQyxNQUFWLENBQWlCQyxVQURQO0FBRWpCUixFQUFBQSxVQUFVLEVBQUVNLG1CQUFVQyxNQUFWLENBQWlCQyxVQUZaO0FBR2pCTixFQUFBQSxVQUFVLEVBQUVJLG1CQUFVQyxNQUFWLENBQWlCQyxVQUhaO0FBS2pCUCxFQUFBQSxNQUFNLEVBQUVLLG1CQUFVRyxJQUFWLENBQWVELFVBTE47QUFPakJILEVBQUFBLFFBQVEsRUFBRUMsbUJBQVVJLE9BQVYsQ0FBa0JGLFVBUFg7QUFRakJYLEVBQUFBLFFBQVEsRUFBRWMsNkJBQWlCSDtBQVJWLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjeCBmcm9tICdjbGFzc25hbWVzJztcblxuaW1wb3J0IENvbW1pdERldGFpbEl0ZW0gZnJvbSAnLi4vaXRlbXMvY29tbWl0LWRldGFpbC1pdGVtJztcbmltcG9ydCBJc3N1ZWlzaERldGFpbEl0ZW0gZnJvbSAnLi4vaXRlbXMvaXNzdWVpc2gtZGV0YWlsLWl0ZW0nO1xuaW1wb3J0IHtJdGVtVHlwZVByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmlsZVBhdGNoTWV0YVZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIHRpdGxlOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgYWN0aW9uSWNvbjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGFjdGlvblRleHQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcblxuICAgIGFjdGlvbjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgIGNoaWxkcmVuOiBQcm9wVHlwZXMuZWxlbWVudC5pc1JlcXVpcmVkLFxuICAgIGl0ZW1UeXBlOiBJdGVtVHlwZVByb3BUeXBlLmlzUmVxdWlyZWQsXG4gIH07XG5cbiAgcmVuZGVyTWV0YUNvbnRyb2xzKCkge1xuICAgIGlmICh0aGlzLnByb3BzLml0ZW1UeXBlID09PSBDb21taXREZXRhaWxJdGVtIHx8IHRoaXMucHJvcHMuaXRlbVR5cGUgPT09IElzc3VlaXNoRGV0YWlsSXRlbSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1ldGFDb250cm9sc1wiPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgY2xhc3NOYW1lPXtjeCgnZ2l0aHViLUZpbGVQYXRjaFZpZXctbWV0YUJ1dHRvbicsICdpY29uJywgdGhpcy5wcm9wcy5hY3Rpb25JY29uKX1cbiAgICAgICAgICBvbkNsaWNrPXt0aGlzLnByb3BzLmFjdGlvbn0+XG4gICAgICAgICAge3RoaXMucHJvcHMuYWN0aW9uVGV4dH1cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1GaWxlUGF0Y2hWaWV3LW1ldGFcIj5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItRmlsZVBhdGNoVmlldy1tZXRhQ29udGFpbmVyXCI+XG4gICAgICAgICAgPGhlYWRlciBjbGFzc05hbWU9XCJnaXRodWItRmlsZVBhdGNoVmlldy1tZXRhSGVhZGVyXCI+XG4gICAgICAgICAgICA8aDMgY2xhc3NOYW1lPVwiZ2l0aHViLUZpbGVQYXRjaFZpZXctbWV0YVRpdGxlXCI+e3RoaXMucHJvcHMudGl0bGV9PC9oMz5cbiAgICAgICAgICAgIHt0aGlzLnJlbmRlck1ldGFDb250cm9scygpfVxuICAgICAgICAgIDwvaGVhZGVyPlxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLUZpbGVQYXRjaFZpZXctbWV0YURldGFpbHNcIj5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLmNoaWxkcmVufVxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cbn1cbiJdfQ==