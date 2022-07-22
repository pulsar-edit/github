"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _atom = require("atom");

var _propTypes = _interopRequireDefault(require("prop-types"));

var _propTypes2 = require("../prop-types");

var _decoration = _interopRequireDefault(require("../atom/decoration"));

var _marker = _interopRequireDefault(require("../atom/marker"));

var _reviewsItem = _interopRequireDefault(require("../items/reviews-item"));

var _reporterProxy = require("../reporter-proxy");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CommentGutterDecorationController extends _react.default.Component {
  render() {
    const range = _atom.Range.fromObject([[this.props.commentRow, 0], [this.props.commentRow, Infinity]]);

    return /*#__PURE__*/_react.default.createElement(_marker.default, {
      key: `github-comment-gutter-decoration-${this.props.threadId}`,
      editor: this.props.editor,
      exclusive: true,
      invalidate: "surround",
      bufferRange: range
    }, /*#__PURE__*/_react.default.createElement(_decoration.default, {
      editor: this.props.editor,
      type: "gutter",
      gutterName: "github-comment-icon",
      className: `github-editorCommentGutterIcon ${this.props.extraClasses.join(' ')}`,
      omitEmptyLastRow: false
    }, /*#__PURE__*/_react.default.createElement("button", {
      className: "icon icon-comment",
      onClick: () => this.openReviewThread(this.props.threadId)
    })));
  }

  async openReviewThread(threadId) {
    const uri = _reviewsItem.default.buildURI({
      host: this.props.endpoint.getHost(),
      owner: this.props.owner,
      repo: this.props.repo,
      number: this.props.number,
      workdir: this.props.workdir
    });

    const reviewsItem = await this.props.workspace.open(uri, {
      searchAllPanes: true
    });
    reviewsItem.jumpToThread(threadId);
    (0, _reporterProxy.addEvent)('open-review-thread', {
      package: 'github',
      from: this.props.parent
    });
  }

}

exports.default = CommentGutterDecorationController;

_defineProperty(CommentGutterDecorationController, "propTypes", {
  commentRow: _propTypes.default.number.isRequired,
  threadId: _propTypes.default.string.isRequired,
  extraClasses: _propTypes.default.array,
  workspace: _propTypes.default.object.isRequired,
  endpoint: _propTypes2.EndpointPropType.isRequired,
  owner: _propTypes.default.string.isRequired,
  repo: _propTypes.default.string.isRequired,
  number: _propTypes.default.number.isRequired,
  workdir: _propTypes.default.string.isRequired,
  editor: _propTypes.default.object,
  // For metric reporting
  parent: _propTypes.default.string.isRequired
});

_defineProperty(CommentGutterDecorationController, "defaultProps", {
  extraClasses: []
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250cm9sbGVycy9jb21tZW50LWd1dHRlci1kZWNvcmF0aW9uLWNvbnRyb2xsZXIuanMiXSwibmFtZXMiOlsiQ29tbWVudEd1dHRlckRlY29yYXRpb25Db250cm9sbGVyIiwiUmVhY3QiLCJDb21wb25lbnQiLCJyZW5kZXIiLCJyYW5nZSIsIlJhbmdlIiwiZnJvbU9iamVjdCIsInByb3BzIiwiY29tbWVudFJvdyIsIkluZmluaXR5IiwidGhyZWFkSWQiLCJlZGl0b3IiLCJleHRyYUNsYXNzZXMiLCJqb2luIiwib3BlblJldmlld1RocmVhZCIsInVyaSIsIlJldmlld3NJdGVtIiwiYnVpbGRVUkkiLCJob3N0IiwiZW5kcG9pbnQiLCJnZXRIb3N0Iiwib3duZXIiLCJyZXBvIiwibnVtYmVyIiwid29ya2RpciIsInJldmlld3NJdGVtIiwid29ya3NwYWNlIiwib3BlbiIsInNlYXJjaEFsbFBhbmVzIiwianVtcFRvVGhyZWFkIiwicGFja2FnZSIsImZyb20iLCJwYXJlbnQiLCJQcm9wVHlwZXMiLCJpc1JlcXVpcmVkIiwic3RyaW5nIiwiYXJyYXkiLCJvYmplY3QiLCJFbmRwb2ludFByb3BUeXBlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7Ozs7OztBQUVlLE1BQU1BLGlDQUFOLFNBQWdEQyxlQUFNQyxTQUF0RCxDQUFnRTtBQXNCN0VDLEVBQUFBLE1BQU0sR0FBRztBQUNQLFVBQU1DLEtBQUssR0FBR0MsWUFBTUMsVUFBTixDQUFpQixDQUFDLENBQUMsS0FBS0MsS0FBTCxDQUFXQyxVQUFaLEVBQXdCLENBQXhCLENBQUQsRUFBNkIsQ0FBQyxLQUFLRCxLQUFMLENBQVdDLFVBQVosRUFBd0JDLFFBQXhCLENBQTdCLENBQWpCLENBQWQ7O0FBQ0Esd0JBQ0UsNkJBQUMsZUFBRDtBQUNFLE1BQUEsR0FBRyxFQUFHLG9DQUFtQyxLQUFLRixLQUFMLENBQVdHLFFBQVMsRUFEL0Q7QUFFRSxNQUFBLE1BQU0sRUFBRSxLQUFLSCxLQUFMLENBQVdJLE1BRnJCO0FBR0UsTUFBQSxTQUFTLEVBQUUsSUFIYjtBQUlFLE1BQUEsVUFBVSxFQUFDLFVBSmI7QUFLRSxNQUFBLFdBQVcsRUFBRVA7QUFMZixvQkFNRSw2QkFBQyxtQkFBRDtBQUNFLE1BQUEsTUFBTSxFQUFFLEtBQUtHLEtBQUwsQ0FBV0ksTUFEckI7QUFFRSxNQUFBLElBQUksRUFBQyxRQUZQO0FBR0UsTUFBQSxVQUFVLEVBQUMscUJBSGI7QUFJRSxNQUFBLFNBQVMsRUFBRyxrQ0FBaUMsS0FBS0osS0FBTCxDQUFXSyxZQUFYLENBQXdCQyxJQUF4QixDQUE2QixHQUE3QixDQUFrQyxFQUpqRjtBQUtFLE1BQUEsZ0JBQWdCLEVBQUU7QUFMcEIsb0JBTUU7QUFBUSxNQUFBLFNBQVMsRUFBQyxtQkFBbEI7QUFBc0MsTUFBQSxPQUFPLEVBQUUsTUFBTSxLQUFLQyxnQkFBTCxDQUFzQixLQUFLUCxLQUFMLENBQVdHLFFBQWpDO0FBQXJELE1BTkYsQ0FORixDQURGO0FBaUJEOztBQUVxQixRQUFoQkksZ0JBQWdCLENBQUNKLFFBQUQsRUFBVztBQUMvQixVQUFNSyxHQUFHLEdBQUdDLHFCQUFZQyxRQUFaLENBQXFCO0FBQy9CQyxNQUFBQSxJQUFJLEVBQUUsS0FBS1gsS0FBTCxDQUFXWSxRQUFYLENBQW9CQyxPQUFwQixFQUR5QjtBQUUvQkMsTUFBQUEsS0FBSyxFQUFFLEtBQUtkLEtBQUwsQ0FBV2MsS0FGYTtBQUcvQkMsTUFBQUEsSUFBSSxFQUFFLEtBQUtmLEtBQUwsQ0FBV2UsSUFIYztBQUkvQkMsTUFBQUEsTUFBTSxFQUFFLEtBQUtoQixLQUFMLENBQVdnQixNQUpZO0FBSy9CQyxNQUFBQSxPQUFPLEVBQUUsS0FBS2pCLEtBQUwsQ0FBV2lCO0FBTFcsS0FBckIsQ0FBWjs7QUFPQSxVQUFNQyxXQUFXLEdBQUcsTUFBTSxLQUFLbEIsS0FBTCxDQUFXbUIsU0FBWCxDQUFxQkMsSUFBckIsQ0FBMEJaLEdBQTFCLEVBQStCO0FBQUNhLE1BQUFBLGNBQWMsRUFBRTtBQUFqQixLQUEvQixDQUExQjtBQUNBSCxJQUFBQSxXQUFXLENBQUNJLFlBQVosQ0FBeUJuQixRQUF6QjtBQUNBLGlDQUFTLG9CQUFULEVBQStCO0FBQUNvQixNQUFBQSxPQUFPLEVBQUUsUUFBVjtBQUFvQkMsTUFBQUEsSUFBSSxFQUFFLEtBQUt4QixLQUFMLENBQVd5QjtBQUFyQyxLQUEvQjtBQUNEOztBQXRENEU7Ozs7Z0JBQTFEaEMsaUMsZUFDQTtBQUNqQlEsRUFBQUEsVUFBVSxFQUFFeUIsbUJBQVVWLE1BQVYsQ0FBaUJXLFVBRFo7QUFFakJ4QixFQUFBQSxRQUFRLEVBQUV1QixtQkFBVUUsTUFBVixDQUFpQkQsVUFGVjtBQUdqQnRCLEVBQUFBLFlBQVksRUFBRXFCLG1CQUFVRyxLQUhQO0FBS2pCVixFQUFBQSxTQUFTLEVBQUVPLG1CQUFVSSxNQUFWLENBQWlCSCxVQUxYO0FBTWpCZixFQUFBQSxRQUFRLEVBQUVtQiw2QkFBaUJKLFVBTlY7QUFPakJiLEVBQUFBLEtBQUssRUFBRVksbUJBQVVFLE1BQVYsQ0FBaUJELFVBUFA7QUFRakJaLEVBQUFBLElBQUksRUFBRVcsbUJBQVVFLE1BQVYsQ0FBaUJELFVBUk47QUFTakJYLEVBQUFBLE1BQU0sRUFBRVUsbUJBQVVWLE1BQVYsQ0FBaUJXLFVBVFI7QUFVakJWLEVBQUFBLE9BQU8sRUFBRVMsbUJBQVVFLE1BQVYsQ0FBaUJELFVBVlQ7QUFXakJ2QixFQUFBQSxNQUFNLEVBQUVzQixtQkFBVUksTUFYRDtBQWFqQjtBQUNBTCxFQUFBQSxNQUFNLEVBQUVDLG1CQUFVRSxNQUFWLENBQWlCRDtBQWRSLEM7O2dCQURBbEMsaUMsa0JBa0JHO0FBQ3BCWSxFQUFBQSxZQUFZLEVBQUU7QUFETSxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCB7UmFuZ2V9IGZyb20gJ2F0b20nO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCB7RW5kcG9pbnRQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQgRGVjb3JhdGlvbiBmcm9tICcuLi9hdG9tL2RlY29yYXRpb24nO1xuaW1wb3J0IE1hcmtlciBmcm9tICcuLi9hdG9tL21hcmtlcic7XG5pbXBvcnQgUmV2aWV3c0l0ZW0gZnJvbSAnLi4vaXRlbXMvcmV2aWV3cy1pdGVtJztcbmltcG9ydCB7YWRkRXZlbnR9IGZyb20gJy4uL3JlcG9ydGVyLXByb3h5JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29tbWVudEd1dHRlckRlY29yYXRpb25Db250cm9sbGVyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICBjb21tZW50Um93OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgdGhyZWFkSWQ6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBleHRyYUNsYXNzZXM6IFByb3BUeXBlcy5hcnJheSxcblxuICAgIHdvcmtzcGFjZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGVuZHBvaW50OiBFbmRwb2ludFByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgb3duZXI6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICByZXBvOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgbnVtYmVyOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgd29ya2RpcjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIGVkaXRvcjogUHJvcFR5cGVzLm9iamVjdCxcblxuICAgIC8vIEZvciBtZXRyaWMgcmVwb3J0aW5nXG4gICAgcGFyZW50OiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gIH07XG5cbiAgc3RhdGljIGRlZmF1bHRQcm9wcyA9IHtcbiAgICBleHRyYUNsYXNzZXM6IFtdLFxuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIGNvbnN0IHJhbmdlID0gUmFuZ2UuZnJvbU9iamVjdChbW3RoaXMucHJvcHMuY29tbWVudFJvdywgMF0sIFt0aGlzLnByb3BzLmNvbW1lbnRSb3csIEluZmluaXR5XV0pO1xuICAgIHJldHVybiAoXG4gICAgICA8TWFya2VyXG4gICAgICAgIGtleT17YGdpdGh1Yi1jb21tZW50LWd1dHRlci1kZWNvcmF0aW9uLSR7dGhpcy5wcm9wcy50aHJlYWRJZH1gfVxuICAgICAgICBlZGl0b3I9e3RoaXMucHJvcHMuZWRpdG9yfVxuICAgICAgICBleGNsdXNpdmU9e3RydWV9XG4gICAgICAgIGludmFsaWRhdGU9XCJzdXJyb3VuZFwiXG4gICAgICAgIGJ1ZmZlclJhbmdlPXtyYW5nZX0+XG4gICAgICAgIDxEZWNvcmF0aW9uXG4gICAgICAgICAgZWRpdG9yPXt0aGlzLnByb3BzLmVkaXRvcn1cbiAgICAgICAgICB0eXBlPVwiZ3V0dGVyXCJcbiAgICAgICAgICBndXR0ZXJOYW1lPVwiZ2l0aHViLWNvbW1lbnQtaWNvblwiXG4gICAgICAgICAgY2xhc3NOYW1lPXtgZ2l0aHViLWVkaXRvckNvbW1lbnRHdXR0ZXJJY29uICR7dGhpcy5wcm9wcy5leHRyYUNsYXNzZXMuam9pbignICcpfWB9XG4gICAgICAgICAgb21pdEVtcHR5TGFzdFJvdz17ZmFsc2V9PlxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiaWNvbiBpY29uLWNvbW1lbnRcIiBvbkNsaWNrPXsoKSA9PiB0aGlzLm9wZW5SZXZpZXdUaHJlYWQodGhpcy5wcm9wcy50aHJlYWRJZCl9IC8+XG4gICAgICAgIDwvRGVjb3JhdGlvbj5cbiAgICAgIDwvTWFya2VyPlxuICAgICk7XG4gIH1cblxuICBhc3luYyBvcGVuUmV2aWV3VGhyZWFkKHRocmVhZElkKSB7XG4gICAgY29uc3QgdXJpID0gUmV2aWV3c0l0ZW0uYnVpbGRVUkkoe1xuICAgICAgaG9zdDogdGhpcy5wcm9wcy5lbmRwb2ludC5nZXRIb3N0KCksXG4gICAgICBvd25lcjogdGhpcy5wcm9wcy5vd25lcixcbiAgICAgIHJlcG86IHRoaXMucHJvcHMucmVwbyxcbiAgICAgIG51bWJlcjogdGhpcy5wcm9wcy5udW1iZXIsXG4gICAgICB3b3JrZGlyOiB0aGlzLnByb3BzLndvcmtkaXIsXG4gICAgfSk7XG4gICAgY29uc3QgcmV2aWV3c0l0ZW0gPSBhd2FpdCB0aGlzLnByb3BzLndvcmtzcGFjZS5vcGVuKHVyaSwge3NlYXJjaEFsbFBhbmVzOiB0cnVlfSk7XG4gICAgcmV2aWV3c0l0ZW0uanVtcFRvVGhyZWFkKHRocmVhZElkKTtcbiAgICBhZGRFdmVudCgnb3Blbi1yZXZpZXctdGhyZWFkJywge3BhY2thZ2U6ICdnaXRodWInLCBmcm9tOiB0aGlzLnByb3BzLnBhcmVudH0pO1xuICB9XG5cbn1cbiJdfQ==