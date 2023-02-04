"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactDom = _interopRequireDefault(require("react-dom"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _eventKit = require("event-kit");
var _helpers = require("../helpers");
var _propTypes2 = require("../prop-types");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * `Panel` renders a React component into an Atom panel. Specify the location via the `location` prop, and any
 * additional options to the `addXPanel` method in the `options` prop.
 *
 * You can get the underlying Atom panel via `getPanel()`, but you should consider controlling the panel via React and
 * the Panel component instead.
 */
class Panel extends _react.default.Component {
  constructor(props) {
    super(props);
    this.subscriptions = new _eventKit.CompositeDisposable();
    this.panel = null;
    this.didCloseItem = false;
    this.domNode = document.createElement('div');
    this.domNode.className = 'react-atom-panel';
  }
  componentDidMount() {
    this.setupPanel();
  }
  render() {
    return _reactDom.default.createPortal(this.props.children, this.domNode);
  }
  setupPanel() {
    if (this.panel) {
      return;
    }

    // "left" => "Left"
    const location = this.props.location.substr(0, 1).toUpperCase() + this.props.location.substr(1);
    const methodName = `add${location}Panel`;
    const item = (0, _helpers.createItem)(this.domNode, this.props.itemHolder);
    const options = _objectSpread({}, this.props.options, {
      item
    });
    this.panel = this.props.workspace[methodName](options);
    this.subscriptions.add(this.panel.onDidDestroy(() => {
      this.didCloseItem = true;
      this.props.onDidClosePanel(this.panel);
    }));
  }
  componentWillUnmount() {
    this.subscriptions.dispose();
    if (this.panel) {
      this.panel.destroy();
    }
  }
  getPanel() {
    return this.panel;
  }
}
exports.default = Panel;
_defineProperty(Panel, "propTypes", {
  workspace: _propTypes.default.object.isRequired,
  location: _propTypes.default.oneOf(['top', 'bottom', 'left', 'right', 'header', 'footer', 'modal']).isRequired,
  children: _propTypes.default.element.isRequired,
  options: _propTypes.default.object,
  onDidClosePanel: _propTypes.default.func,
  itemHolder: _propTypes2.RefHolderPropType
});
_defineProperty(Panel, "defaultProps", {
  options: {},
  onDidClosePanel: panel => {}
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJQYW5lbCIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsInN1YnNjcmlwdGlvbnMiLCJDb21wb3NpdGVEaXNwb3NhYmxlIiwicGFuZWwiLCJkaWRDbG9zZUl0ZW0iLCJkb21Ob2RlIiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwiY29tcG9uZW50RGlkTW91bnQiLCJzZXR1cFBhbmVsIiwicmVuZGVyIiwiUmVhY3RET00iLCJjcmVhdGVQb3J0YWwiLCJjaGlsZHJlbiIsImxvY2F0aW9uIiwic3Vic3RyIiwidG9VcHBlckNhc2UiLCJtZXRob2ROYW1lIiwiaXRlbSIsImNyZWF0ZUl0ZW0iLCJpdGVtSG9sZGVyIiwib3B0aW9ucyIsIndvcmtzcGFjZSIsImFkZCIsIm9uRGlkRGVzdHJveSIsIm9uRGlkQ2xvc2VQYW5lbCIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwiZGlzcG9zZSIsImRlc3Ryb3kiLCJnZXRQYW5lbCIsIlByb3BUeXBlcyIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJvbmVPZiIsImVsZW1lbnQiLCJmdW5jIiwiUmVmSG9sZGVyUHJvcFR5cGUiXSwic291cmNlcyI6WyJwYW5lbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnO1xuaW1wb3J0IFJlYWN0RE9NIGZyb20gJ3JlYWN0LWRvbSc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuXG5pbXBvcnQge2NyZWF0ZUl0ZW19IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IHtSZWZIb2xkZXJQcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5cbi8qKlxuICogYFBhbmVsYCByZW5kZXJzIGEgUmVhY3QgY29tcG9uZW50IGludG8gYW4gQXRvbSBwYW5lbC4gU3BlY2lmeSB0aGUgbG9jYXRpb24gdmlhIHRoZSBgbG9jYXRpb25gIHByb3AsIGFuZCBhbnlcbiAqIGFkZGl0aW9uYWwgb3B0aW9ucyB0byB0aGUgYGFkZFhQYW5lbGAgbWV0aG9kIGluIHRoZSBgb3B0aW9uc2AgcHJvcC5cbiAqXG4gKiBZb3UgY2FuIGdldCB0aGUgdW5kZXJseWluZyBBdG9tIHBhbmVsIHZpYSBgZ2V0UGFuZWwoKWAsIGJ1dCB5b3Ugc2hvdWxkIGNvbnNpZGVyIGNvbnRyb2xsaW5nIHRoZSBwYW5lbCB2aWEgUmVhY3QgYW5kXG4gKiB0aGUgUGFuZWwgY29tcG9uZW50IGluc3RlYWQuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFBhbmVsIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBsb2NhdGlvbjogUHJvcFR5cGVzLm9uZU9mKFtcbiAgICAgICd0b3AnLCAnYm90dG9tJywgJ2xlZnQnLCAncmlnaHQnLCAnaGVhZGVyJywgJ2Zvb3RlcicsICdtb2RhbCcsXG4gICAgXSkuaXNSZXF1aXJlZCxcbiAgICBjaGlsZHJlbjogUHJvcFR5cGVzLmVsZW1lbnQuaXNSZXF1aXJlZCxcbiAgICBvcHRpb25zOiBQcm9wVHlwZXMub2JqZWN0LFxuICAgIG9uRGlkQ2xvc2VQYW5lbDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgaXRlbUhvbGRlcjogUmVmSG9sZGVyUHJvcFR5cGUsXG4gIH1cblxuICBzdGF0aWMgZGVmYXVsdFByb3BzID0ge1xuICAgIG9wdGlvbnM6IHt9LFxuICAgIG9uRGlkQ2xvc2VQYW5lbDogcGFuZWwgPT4ge30sXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgdGhpcy5wYW5lbCA9IG51bGw7XG4gICAgdGhpcy5kaWRDbG9zZUl0ZW0gPSBmYWxzZTtcbiAgICB0aGlzLmRvbU5vZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLmRvbU5vZGUuY2xhc3NOYW1lID0gJ3JlYWN0LWF0b20tcGFuZWwnO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgdGhpcy5zZXR1cFBhbmVsKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIFJlYWN0RE9NLmNyZWF0ZVBvcnRhbChcbiAgICAgIHRoaXMucHJvcHMuY2hpbGRyZW4sXG4gICAgICB0aGlzLmRvbU5vZGUsXG4gICAgKTtcbiAgfVxuXG4gIHNldHVwUGFuZWwoKSB7XG4gICAgaWYgKHRoaXMucGFuZWwpIHsgcmV0dXJuOyB9XG5cbiAgICAvLyBcImxlZnRcIiA9PiBcIkxlZnRcIlxuICAgIGNvbnN0IGxvY2F0aW9uID0gdGhpcy5wcm9wcy5sb2NhdGlvbi5zdWJzdHIoMCwgMSkudG9VcHBlckNhc2UoKSArIHRoaXMucHJvcHMubG9jYXRpb24uc3Vic3RyKDEpO1xuICAgIGNvbnN0IG1ldGhvZE5hbWUgPSBgYWRkJHtsb2NhdGlvbn1QYW5lbGA7XG5cbiAgICBjb25zdCBpdGVtID0gY3JlYXRlSXRlbSh0aGlzLmRvbU5vZGUsIHRoaXMucHJvcHMuaXRlbUhvbGRlcik7XG4gICAgY29uc3Qgb3B0aW9ucyA9IHsuLi50aGlzLnByb3BzLm9wdGlvbnMsIGl0ZW19O1xuICAgIHRoaXMucGFuZWwgPSB0aGlzLnByb3BzLndvcmtzcGFjZVttZXRob2ROYW1lXShvcHRpb25zKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgdGhpcy5wYW5lbC5vbkRpZERlc3Ryb3koKCkgPT4ge1xuICAgICAgICB0aGlzLmRpZENsb3NlSXRlbSA9IHRydWU7XG4gICAgICAgIHRoaXMucHJvcHMub25EaWRDbG9zZVBhbmVsKHRoaXMucGFuZWwpO1xuICAgICAgfSksXG4gICAgKTtcbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gICAgaWYgKHRoaXMucGFuZWwpIHtcbiAgICAgIHRoaXMucGFuZWwuZGVzdHJveSgpO1xuICAgIH1cbiAgfVxuXG4gIGdldFBhbmVsKCkge1xuICAgIHJldHVybiB0aGlzLnBhbmVsO1xuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFnRDtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFaEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDZSxNQUFNQSxLQUFLLFNBQVNDLGNBQUssQ0FBQ0MsU0FBUyxDQUFDO0VBaUJqREMsV0FBVyxDQUFDQyxLQUFLLEVBQUU7SUFDakIsS0FBSyxDQUFDQSxLQUFLLENBQUM7SUFFWixJQUFJLENBQUNDLGFBQWEsR0FBRyxJQUFJQyw2QkFBbUIsRUFBRTtJQUM5QyxJQUFJLENBQUNDLEtBQUssR0FBRyxJQUFJO0lBQ2pCLElBQUksQ0FBQ0MsWUFBWSxHQUFHLEtBQUs7SUFDekIsSUFBSSxDQUFDQyxPQUFPLEdBQUdDLFFBQVEsQ0FBQ0MsYUFBYSxDQUFDLEtBQUssQ0FBQztJQUM1QyxJQUFJLENBQUNGLE9BQU8sQ0FBQ0csU0FBUyxHQUFHLGtCQUFrQjtFQUM3QztFQUVBQyxpQkFBaUIsR0FBRztJQUNsQixJQUFJLENBQUNDLFVBQVUsRUFBRTtFQUNuQjtFQUVBQyxNQUFNLEdBQUc7SUFDUCxPQUFPQyxpQkFBUSxDQUFDQyxZQUFZLENBQzFCLElBQUksQ0FBQ2IsS0FBSyxDQUFDYyxRQUFRLEVBQ25CLElBQUksQ0FBQ1QsT0FBTyxDQUNiO0VBQ0g7RUFFQUssVUFBVSxHQUFHO0lBQ1gsSUFBSSxJQUFJLENBQUNQLEtBQUssRUFBRTtNQUFFO0lBQVE7O0lBRTFCO0lBQ0EsTUFBTVksUUFBUSxHQUFHLElBQUksQ0FBQ2YsS0FBSyxDQUFDZSxRQUFRLENBQUNDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUNDLFdBQVcsRUFBRSxHQUFHLElBQUksQ0FBQ2pCLEtBQUssQ0FBQ2UsUUFBUSxDQUFDQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQy9GLE1BQU1FLFVBQVUsR0FBSSxNQUFLSCxRQUFTLE9BQU07SUFFeEMsTUFBTUksSUFBSSxHQUFHLElBQUFDLG1CQUFVLEVBQUMsSUFBSSxDQUFDZixPQUFPLEVBQUUsSUFBSSxDQUFDTCxLQUFLLENBQUNxQixVQUFVLENBQUM7SUFDNUQsTUFBTUMsT0FBTyxxQkFBTyxJQUFJLENBQUN0QixLQUFLLENBQUNzQixPQUFPO01BQUVIO0lBQUksRUFBQztJQUM3QyxJQUFJLENBQUNoQixLQUFLLEdBQUcsSUFBSSxDQUFDSCxLQUFLLENBQUN1QixTQUFTLENBQUNMLFVBQVUsQ0FBQyxDQUFDSSxPQUFPLENBQUM7SUFDdEQsSUFBSSxDQUFDckIsYUFBYSxDQUFDdUIsR0FBRyxDQUNwQixJQUFJLENBQUNyQixLQUFLLENBQUNzQixZQUFZLENBQUMsTUFBTTtNQUM1QixJQUFJLENBQUNyQixZQUFZLEdBQUcsSUFBSTtNQUN4QixJQUFJLENBQUNKLEtBQUssQ0FBQzBCLGVBQWUsQ0FBQyxJQUFJLENBQUN2QixLQUFLLENBQUM7SUFDeEMsQ0FBQyxDQUFDLENBQ0g7RUFDSDtFQUVBd0Isb0JBQW9CLEdBQUc7SUFDckIsSUFBSSxDQUFDMUIsYUFBYSxDQUFDMkIsT0FBTyxFQUFFO0lBQzVCLElBQUksSUFBSSxDQUFDekIsS0FBSyxFQUFFO01BQ2QsSUFBSSxDQUFDQSxLQUFLLENBQUMwQixPQUFPLEVBQUU7SUFDdEI7RUFDRjtFQUVBQyxRQUFRLEdBQUc7SUFDVCxPQUFPLElBQUksQ0FBQzNCLEtBQUs7RUFDbkI7QUFDRjtBQUFDO0FBQUEsZ0JBbEVvQlAsS0FBSyxlQUNMO0VBQ2pCMkIsU0FBUyxFQUFFUSxrQkFBUyxDQUFDQyxNQUFNLENBQUNDLFVBQVU7RUFDdENsQixRQUFRLEVBQUVnQixrQkFBUyxDQUFDRyxLQUFLLENBQUMsQ0FDeEIsS0FBSyxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUM5RCxDQUFDLENBQUNELFVBQVU7RUFDYm5CLFFBQVEsRUFBRWlCLGtCQUFTLENBQUNJLE9BQU8sQ0FBQ0YsVUFBVTtFQUN0Q1gsT0FBTyxFQUFFUyxrQkFBUyxDQUFDQyxNQUFNO0VBQ3pCTixlQUFlLEVBQUVLLGtCQUFTLENBQUNLLElBQUk7RUFDL0JmLFVBQVUsRUFBRWdCO0FBQ2QsQ0FBQztBQUFBLGdCQVZrQnpDLEtBQUssa0JBWUY7RUFDcEIwQixPQUFPLEVBQUUsQ0FBQyxDQUFDO0VBQ1hJLGVBQWUsRUFBRXZCLEtBQUssSUFBSSxDQUFDO0FBQzdCLENBQUMifQ==