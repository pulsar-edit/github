"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _eventKit = require("event-kit");

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _compareSets = _interopRequireDefault(require("compare-sets"));

var _commands = _interopRequireWildcard(require("../atom/commands"));

var _conflict = _interopRequireDefault(require("../models/conflicts/conflict"));

var _conflictController = _interopRequireDefault(require("./conflict-controller"));

var _source = require("../models/conflicts/source");

var _helpers = require("../helpers");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Render a `ConflictController` for each conflict marker within an open TextEditor.
 */
class EditorConflictController extends _react.default.Component {
  constructor(props, context) {
    super(props, context);
    (0, _helpers.autobind)(this, 'resolveAsCurrent', 'revertConflictModifications', 'dismissCurrent'); // this.layer = props.editor.addMarkerLayer({
    //   maintainHistory: true,
    //   persistent: false,
    // });

    this.layer = props.editor.getDefaultMarkerLayer();
    this.state = {
      conflicts: new Set(_conflict.default.allFromEditor(props.editor, this.layer, props.isRebase))
    };
    this.subscriptions = new _eventKit.CompositeDisposable();
    this.updateMarkerCount();
  }

  componentDidMount() {
    const buffer = this.props.editor.getBuffer();
    this.subscriptions.add(this.props.editor.onDidDestroy(() => this.props.refreshResolutionProgress(this.props.editor.getPath())), buffer.onDidReload(() => this.reparseConflicts()));
    this.scrollToFirstConflict();
  }

  render() {
    this.updateMarkerCount();
    return _react.default.createElement("div", null, this.state.conflicts.size > 0 && _react.default.createElement(_commands.default, {
      registry: this.props.commands,
      target: "atom-text-editor"
    }, _react.default.createElement(_commands.Command, {
      command: "github:resolve-as-ours",
      callback: this.getResolverUsing([_source.OURS])
    }), _react.default.createElement(_commands.Command, {
      command: "github:resolve-as-theirs",
      callback: this.getResolverUsing([_source.THEIRS])
    }), _react.default.createElement(_commands.Command, {
      command: "github:resolve-as-base",
      callback: this.getResolverUsing([_source.BASE])
    }), _react.default.createElement(_commands.Command, {
      command: "github:resolve-as-ours-then-theirs",
      callback: this.getResolverUsing([_source.OURS, _source.THEIRS])
    }), _react.default.createElement(_commands.Command, {
      command: "github:resolve-as-theirs-then-ours",
      callback: this.getResolverUsing([_source.THEIRS, _source.OURS])
    }), _react.default.createElement(_commands.Command, {
      command: "github:resolve-as-current",
      callback: this.resolveAsCurrent
    }), _react.default.createElement(_commands.Command, {
      command: "github:revert-conflict-modifications",
      callback: this.revertConflictModifications
    }), _react.default.createElement(_commands.Command, {
      command: "github:dismiss-conflict",
      callback: this.dismissCurrent
    })), Array.from(this.state.conflicts, c => _react.default.createElement(_conflictController.default, {
      key: c.getKey(),
      editor: this.props.editor,
      conflict: c,
      resolveAsSequence: sources => this.resolveAsSequence(c, sources),
      dismiss: () => this.dismissConflicts([c])
    })));
  }

  componentWillUnmount() {
    // this.layer.destroy();
    this.subscriptions.dispose();
  }
  /*
   * Return an Array containing `Conflict` objects whose marked regions include any cursor position in the current
   * `TextEditor` and the `Sides` that contain a cursor within each.
   *
   * This method is written to have linear complexity with respect to the number of cursors and the number of
   * conflicts, to gracefully handle files with large numbers of both.
   */


  getCurrentConflicts() {
    const cursorPositions = this.props.editor.getCursorBufferPositions();
    cursorPositions.sort((a, b) => a.compare(b));
    const cursorIterator = cursorPositions[Symbol.iterator]();
    const conflictIterator = this.state.conflicts.keys();
    let currentCursor = cursorIterator.next();
    let currentConflict = conflictIterator.next();
    const activeConflicts = [];

    while (!currentCursor.done && !currentConflict.done) {
      // Advance currentCursor to the first cursor beyond the earliest conflict.
      const earliestConflictPosition = currentConflict.value.getRange().start;

      while (!currentCursor.done && currentCursor.value.isLessThan(earliestConflictPosition)) {
        currentCursor = cursorIterator.next();
      } // Advance currentConflict until the first conflict that begins at a position after the current cursor.
      // Compare each to the current cursor, and add it to activeConflicts if it contains it.


      while (!currentConflict.done && !currentCursor.done && currentConflict.value.getRange().start.isLessThan(currentCursor.value)) {
        if (currentConflict.value.includesPoint(currentCursor.value)) {
          // Hit; determine which sides of this conflict contain cursors.
          const conflict = currentConflict.value;
          const endPosition = conflict.getRange().end;
          const sides = new Set();

          while (!currentCursor.done && currentCursor.value.isLessThan(endPosition)) {
            const side = conflict.getSideContaining(currentCursor.value);

            if (side) {
              sides.add(side);
            }

            currentCursor = cursorIterator.next();
          }

          activeConflicts.push({
            conflict,
            sides
          });
        }

        currentConflict = conflictIterator.next();
      }
    }

    return activeConflicts;
  }

  getResolverUsing(sequence) {
    return () => {
      this.getCurrentConflicts().forEach(match => this.resolveAsSequence(match.conflict, sequence));
    };
  }

  resolveAsCurrent() {
    this.getCurrentConflicts().forEach(match => {
      if (match.sides.size === 1) {
        const side = match.sides.keys().next().value;
        this.resolveAs(match.conflict, side.getSource());
      }
    });
  }

  revertConflictModifications() {
    this.getCurrentConflicts().forEach(match => {
      match.sides.forEach(side => {
        side.isModified() && side.revert();
        side.isBannerModified() && side.revertBanner();
      });
    });
  }

  dismissCurrent() {
    this.dismissConflicts(this.getCurrentConflicts().map(match => match.conflict));
  }

  dismissConflicts(conflicts) {
    this.setState(prevState => {
      const {
        added
      } = (0, _compareSets.default)(new Set(conflicts), prevState.conflicts);
      return {
        conflicts: added
      };
    });
  }

  resolveAsSequence(conflict, sources) {
    const [firstSide, ...restOfSides] = sources.map(source => conflict.getSide(source)).filter(side => side);
    const textToAppend = restOfSides.map(side => side.getText()).join('');
    this.props.editor.transact(() => {
      // Append text from all but the first Side to the first Side. Adjust the following DisplayMarker so that only that
      // Side's marker includes the appended text, not the next one.
      const appendedRange = firstSide.appendText(textToAppend);
      const nextMarker = conflict.markerAfter(firstSide.getPosition());

      if (nextMarker) {
        nextMarker.setTailBufferPosition(appendedRange.end);
      }

      this.innerResolveAs(conflict, sources[0]);
    });
  }

  resolveAs(conflict, source) {
    this.props.editor.transact(() => {
      this.innerResolveAs(conflict, source);
    });
  }

  innerResolveAs(conflict, source) {
    conflict.resolveAs(source);
    const chosenSide = conflict.getChosenSide();

    if (!chosenSide.isBannerModified()) {
      chosenSide.deleteBanner();
    }

    const separator = conflict.getSeparator();

    if (!separator.isModified()) {
      separator.delete();
    }

    conflict.getUnchosenSides().forEach(side => {
      side.deleteBanner();
      side.delete();
    });
    this.updateMarkerCount();
  }

  scrollToFirstConflict() {
    let firstConflict = null;

    for (const conflict of this.state.conflicts) {
      if (firstConflict == null || firstConflict.getRange().compare(conflict.getRange()) > 0) {
        firstConflict = conflict;
      }
    }

    if (firstConflict) {
      this.props.editor.scrollToBufferPosition(firstConflict.getRange().start, {
        center: true
      });
    }
  }

  reparseConflicts() {
    const newConflicts = new Set(_conflict.default.allFromEditor(this.props.editor, this.layer, this.props.isRebase));
    this.setState({
      conflicts: newConflicts
    });
  }

  updateMarkerCount() {
    this.props.resolutionProgress.reportMarkerCount(this.props.editor.getPath(), Array.from(this.state.conflicts, c => !c.isResolved()).filter(b => b).length);
  }

}

exports.default = EditorConflictController;

_defineProperty(EditorConflictController, "propTypes", {
  editor: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  resolutionProgress: _propTypes.default.object.isRequired,
  isRebase: _propTypes.default.bool.isRequired,
  refreshResolutionProgress: _propTypes.default.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9jb250cm9sbGVycy9lZGl0b3ItY29uZmxpY3QtY29udHJvbGxlci5qcyJdLCJuYW1lcyI6WyJFZGl0b3JDb25mbGljdENvbnRyb2xsZXIiLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJjb250ZXh0IiwibGF5ZXIiLCJlZGl0b3IiLCJnZXREZWZhdWx0TWFya2VyTGF5ZXIiLCJzdGF0ZSIsImNvbmZsaWN0cyIsIlNldCIsIkNvbmZsaWN0IiwiYWxsRnJvbUVkaXRvciIsImlzUmViYXNlIiwic3Vic2NyaXB0aW9ucyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJ1cGRhdGVNYXJrZXJDb3VudCIsImNvbXBvbmVudERpZE1vdW50IiwiYnVmZmVyIiwiZ2V0QnVmZmVyIiwiYWRkIiwib25EaWREZXN0cm95IiwicmVmcmVzaFJlc29sdXRpb25Qcm9ncmVzcyIsImdldFBhdGgiLCJvbkRpZFJlbG9hZCIsInJlcGFyc2VDb25mbGljdHMiLCJzY3JvbGxUb0ZpcnN0Q29uZmxpY3QiLCJyZW5kZXIiLCJzaXplIiwiY29tbWFuZHMiLCJnZXRSZXNvbHZlclVzaW5nIiwiT1VSUyIsIlRIRUlSUyIsIkJBU0UiLCJyZXNvbHZlQXNDdXJyZW50IiwicmV2ZXJ0Q29uZmxpY3RNb2RpZmljYXRpb25zIiwiZGlzbWlzc0N1cnJlbnQiLCJBcnJheSIsImZyb20iLCJjIiwiZ2V0S2V5Iiwic291cmNlcyIsInJlc29sdmVBc1NlcXVlbmNlIiwiZGlzbWlzc0NvbmZsaWN0cyIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwiZGlzcG9zZSIsImdldEN1cnJlbnRDb25mbGljdHMiLCJjdXJzb3JQb3NpdGlvbnMiLCJnZXRDdXJzb3JCdWZmZXJQb3NpdGlvbnMiLCJzb3J0IiwiYSIsImIiLCJjb21wYXJlIiwiY3Vyc29ySXRlcmF0b3IiLCJTeW1ib2wiLCJpdGVyYXRvciIsImNvbmZsaWN0SXRlcmF0b3IiLCJrZXlzIiwiY3VycmVudEN1cnNvciIsIm5leHQiLCJjdXJyZW50Q29uZmxpY3QiLCJhY3RpdmVDb25mbGljdHMiLCJkb25lIiwiZWFybGllc3RDb25mbGljdFBvc2l0aW9uIiwidmFsdWUiLCJnZXRSYW5nZSIsInN0YXJ0IiwiaXNMZXNzVGhhbiIsImluY2x1ZGVzUG9pbnQiLCJjb25mbGljdCIsImVuZFBvc2l0aW9uIiwiZW5kIiwic2lkZXMiLCJzaWRlIiwiZ2V0U2lkZUNvbnRhaW5pbmciLCJwdXNoIiwic2VxdWVuY2UiLCJmb3JFYWNoIiwibWF0Y2giLCJyZXNvbHZlQXMiLCJnZXRTb3VyY2UiLCJpc01vZGlmaWVkIiwicmV2ZXJ0IiwiaXNCYW5uZXJNb2RpZmllZCIsInJldmVydEJhbm5lciIsIm1hcCIsInNldFN0YXRlIiwicHJldlN0YXRlIiwiYWRkZWQiLCJmaXJzdFNpZGUiLCJyZXN0T2ZTaWRlcyIsInNvdXJjZSIsImdldFNpZGUiLCJmaWx0ZXIiLCJ0ZXh0VG9BcHBlbmQiLCJnZXRUZXh0Iiwiam9pbiIsInRyYW5zYWN0IiwiYXBwZW5kZWRSYW5nZSIsImFwcGVuZFRleHQiLCJuZXh0TWFya2VyIiwibWFya2VyQWZ0ZXIiLCJnZXRQb3NpdGlvbiIsInNldFRhaWxCdWZmZXJQb3NpdGlvbiIsImlubmVyUmVzb2x2ZUFzIiwiY2hvc2VuU2lkZSIsImdldENob3NlblNpZGUiLCJkZWxldGVCYW5uZXIiLCJzZXBhcmF0b3IiLCJnZXRTZXBhcmF0b3IiLCJkZWxldGUiLCJnZXRVbmNob3NlblNpZGVzIiwiZmlyc3RDb25mbGljdCIsInNjcm9sbFRvQnVmZmVyUG9zaXRpb24iLCJjZW50ZXIiLCJuZXdDb25mbGljdHMiLCJyZXNvbHV0aW9uUHJvZ3Jlc3MiLCJyZXBvcnRNYXJrZXJDb3VudCIsImlzUmVzb2x2ZWQiLCJsZW5ndGgiLCJQcm9wVHlwZXMiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwiYm9vbCIsImZ1bmMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7Ozs7Ozs7OztBQUVBO0FBQ0E7QUFDQTtBQUNlLE1BQU1BLHdCQUFOLFNBQXVDQyxlQUFNQyxTQUE3QyxDQUF1RDtBQVNwRUMsRUFBQUEsV0FBVyxDQUFDQyxLQUFELEVBQVFDLE9BQVIsRUFBaUI7QUFDMUIsVUFBTUQsS0FBTixFQUFhQyxPQUFiO0FBQ0EsMkJBQVMsSUFBVCxFQUFlLGtCQUFmLEVBQW1DLDZCQUFuQyxFQUFrRSxnQkFBbEUsRUFGMEIsQ0FJMUI7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsU0FBS0MsS0FBTCxHQUFhRixLQUFLLENBQUNHLE1BQU4sQ0FBYUMscUJBQWIsRUFBYjtBQUVBLFNBQUtDLEtBQUwsR0FBYTtBQUNYQyxNQUFBQSxTQUFTLEVBQUUsSUFBSUMsR0FBSixDQUFRQyxrQkFBU0MsYUFBVCxDQUF1QlQsS0FBSyxDQUFDRyxNQUE3QixFQUFxQyxLQUFLRCxLQUExQyxFQUFpREYsS0FBSyxDQUFDVSxRQUF2RCxDQUFSO0FBREEsS0FBYjtBQUlBLFNBQUtDLGFBQUwsR0FBcUIsSUFBSUMsNkJBQUosRUFBckI7QUFFQSxTQUFLQyxpQkFBTDtBQUNEOztBQUVEQyxFQUFBQSxpQkFBaUIsR0FBRztBQUNsQixVQUFNQyxNQUFNLEdBQUcsS0FBS2YsS0FBTCxDQUFXRyxNQUFYLENBQWtCYSxTQUFsQixFQUFmO0FBRUEsU0FBS0wsYUFBTCxDQUFtQk0sR0FBbkIsQ0FDRSxLQUFLakIsS0FBTCxDQUFXRyxNQUFYLENBQWtCZSxZQUFsQixDQUErQixNQUFNLEtBQUtsQixLQUFMLENBQVdtQix5QkFBWCxDQUFxQyxLQUFLbkIsS0FBTCxDQUFXRyxNQUFYLENBQWtCaUIsT0FBbEIsRUFBckMsQ0FBckMsQ0FERixFQUVFTCxNQUFNLENBQUNNLFdBQVAsQ0FBbUIsTUFBTSxLQUFLQyxnQkFBTCxFQUF6QixDQUZGO0FBS0EsU0FBS0MscUJBQUw7QUFDRDs7QUFFREMsRUFBQUEsTUFBTSxHQUFHO0FBQ1AsU0FBS1gsaUJBQUw7QUFFQSxXQUNFLDBDQUNHLEtBQUtSLEtBQUwsQ0FBV0MsU0FBWCxDQUFxQm1CLElBQXJCLEdBQTRCLENBQTVCLElBQ0MsNkJBQUMsaUJBQUQ7QUFBVSxNQUFBLFFBQVEsRUFBRSxLQUFLekIsS0FBTCxDQUFXMEIsUUFBL0I7QUFBeUMsTUFBQSxNQUFNLEVBQUM7QUFBaEQsT0FDRSw2QkFBQyxpQkFBRDtBQUFTLE1BQUEsT0FBTyxFQUFDLHdCQUFqQjtBQUEwQyxNQUFBLFFBQVEsRUFBRSxLQUFLQyxnQkFBTCxDQUFzQixDQUFDQyxZQUFELENBQXRCO0FBQXBELE1BREYsRUFFRSw2QkFBQyxpQkFBRDtBQUFTLE1BQUEsT0FBTyxFQUFDLDBCQUFqQjtBQUE0QyxNQUFBLFFBQVEsRUFBRSxLQUFLRCxnQkFBTCxDQUFzQixDQUFDRSxjQUFELENBQXRCO0FBQXRELE1BRkYsRUFHRSw2QkFBQyxpQkFBRDtBQUFTLE1BQUEsT0FBTyxFQUFDLHdCQUFqQjtBQUEwQyxNQUFBLFFBQVEsRUFBRSxLQUFLRixnQkFBTCxDQUFzQixDQUFDRyxZQUFELENBQXRCO0FBQXBELE1BSEYsRUFJRSw2QkFBQyxpQkFBRDtBQUFTLE1BQUEsT0FBTyxFQUFDLG9DQUFqQjtBQUFzRCxNQUFBLFFBQVEsRUFBRSxLQUFLSCxnQkFBTCxDQUFzQixDQUFDQyxZQUFELEVBQU9DLGNBQVAsQ0FBdEI7QUFBaEUsTUFKRixFQUtFLDZCQUFDLGlCQUFEO0FBQVMsTUFBQSxPQUFPLEVBQUMsb0NBQWpCO0FBQXNELE1BQUEsUUFBUSxFQUFFLEtBQUtGLGdCQUFMLENBQXNCLENBQUNFLGNBQUQsRUFBU0QsWUFBVCxDQUF0QjtBQUFoRSxNQUxGLEVBTUUsNkJBQUMsaUJBQUQ7QUFBUyxNQUFBLE9BQU8sRUFBQywyQkFBakI7QUFBNkMsTUFBQSxRQUFRLEVBQUUsS0FBS0c7QUFBNUQsTUFORixFQU9FLDZCQUFDLGlCQUFEO0FBQVMsTUFBQSxPQUFPLEVBQUMsc0NBQWpCO0FBQXdELE1BQUEsUUFBUSxFQUFFLEtBQUtDO0FBQXZFLE1BUEYsRUFRRSw2QkFBQyxpQkFBRDtBQUFTLE1BQUEsT0FBTyxFQUFDLHlCQUFqQjtBQUEyQyxNQUFBLFFBQVEsRUFBRSxLQUFLQztBQUExRCxNQVJGLENBRkosRUFhR0MsS0FBSyxDQUFDQyxJQUFOLENBQVcsS0FBSzlCLEtBQUwsQ0FBV0MsU0FBdEIsRUFBaUM4QixDQUFDLElBQ2pDLDZCQUFDLDJCQUFEO0FBQ0UsTUFBQSxHQUFHLEVBQUVBLENBQUMsQ0FBQ0MsTUFBRixFQURQO0FBRUUsTUFBQSxNQUFNLEVBQUUsS0FBS3JDLEtBQUwsQ0FBV0csTUFGckI7QUFHRSxNQUFBLFFBQVEsRUFBRWlDLENBSFo7QUFJRSxNQUFBLGlCQUFpQixFQUFFRSxPQUFPLElBQUksS0FBS0MsaUJBQUwsQ0FBdUJILENBQXZCLEVBQTBCRSxPQUExQixDQUpoQztBQUtFLE1BQUEsT0FBTyxFQUFFLE1BQU0sS0FBS0UsZ0JBQUwsQ0FBc0IsQ0FBQ0osQ0FBRCxDQUF0QjtBQUxqQixNQURELENBYkgsQ0FERjtBQXlCRDs7QUFFREssRUFBQUEsb0JBQW9CLEdBQUc7QUFDckI7QUFDQSxTQUFLOUIsYUFBTCxDQUFtQitCLE9BQW5CO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ0VDLEVBQUFBLG1CQUFtQixHQUFHO0FBQ3BCLFVBQU1DLGVBQWUsR0FBRyxLQUFLNUMsS0FBTCxDQUFXRyxNQUFYLENBQWtCMEMsd0JBQWxCLEVBQXhCO0FBQ0FELElBQUFBLGVBQWUsQ0FBQ0UsSUFBaEIsQ0FBcUIsQ0FBQ0MsQ0FBRCxFQUFJQyxDQUFKLEtBQVVELENBQUMsQ0FBQ0UsT0FBRixDQUFVRCxDQUFWLENBQS9CO0FBQ0EsVUFBTUUsY0FBYyxHQUFHTixlQUFlLENBQUNPLE1BQU0sQ0FBQ0MsUUFBUixDQUFmLEVBQXZCO0FBRUEsVUFBTUMsZ0JBQWdCLEdBQUcsS0FBS2hELEtBQUwsQ0FBV0MsU0FBWCxDQUFxQmdELElBQXJCLEVBQXpCO0FBRUEsUUFBSUMsYUFBYSxHQUFHTCxjQUFjLENBQUNNLElBQWYsRUFBcEI7QUFDQSxRQUFJQyxlQUFlLEdBQUdKLGdCQUFnQixDQUFDRyxJQUFqQixFQUF0QjtBQUNBLFVBQU1FLGVBQWUsR0FBRyxFQUF4Qjs7QUFFQSxXQUFPLENBQUNILGFBQWEsQ0FBQ0ksSUFBZixJQUF1QixDQUFDRixlQUFlLENBQUNFLElBQS9DLEVBQXFEO0FBQ25EO0FBQ0EsWUFBTUMsd0JBQXdCLEdBQUdILGVBQWUsQ0FBQ0ksS0FBaEIsQ0FBc0JDLFFBQXRCLEdBQWlDQyxLQUFsRTs7QUFDQSxhQUFPLENBQUNSLGFBQWEsQ0FBQ0ksSUFBZixJQUF1QkosYUFBYSxDQUFDTSxLQUFkLENBQW9CRyxVQUFwQixDQUErQkosd0JBQS9CLENBQTlCLEVBQXdGO0FBQ3RGTCxRQUFBQSxhQUFhLEdBQUdMLGNBQWMsQ0FBQ00sSUFBZixFQUFoQjtBQUNELE9BTGtELENBT25EO0FBQ0E7OztBQUNBLGFBQU8sQ0FBQ0MsZUFBZSxDQUFDRSxJQUFqQixJQUF5QixDQUFDSixhQUFhLENBQUNJLElBQXhDLElBQ0hGLGVBQWUsQ0FBQ0ksS0FBaEIsQ0FBc0JDLFFBQXRCLEdBQWlDQyxLQUFqQyxDQUF1Q0MsVUFBdkMsQ0FBa0RULGFBQWEsQ0FBQ00sS0FBaEUsQ0FESixFQUM0RTtBQUMxRSxZQUFJSixlQUFlLENBQUNJLEtBQWhCLENBQXNCSSxhQUF0QixDQUFvQ1YsYUFBYSxDQUFDTSxLQUFsRCxDQUFKLEVBQThEO0FBQzVEO0FBQ0EsZ0JBQU1LLFFBQVEsR0FBR1QsZUFBZSxDQUFDSSxLQUFqQztBQUNBLGdCQUFNTSxXQUFXLEdBQUdELFFBQVEsQ0FBQ0osUUFBVCxHQUFvQk0sR0FBeEM7QUFDQSxnQkFBTUMsS0FBSyxHQUFHLElBQUk5RCxHQUFKLEVBQWQ7O0FBQ0EsaUJBQU8sQ0FBQ2dELGFBQWEsQ0FBQ0ksSUFBZixJQUF1QkosYUFBYSxDQUFDTSxLQUFkLENBQW9CRyxVQUFwQixDQUErQkcsV0FBL0IsQ0FBOUIsRUFBMkU7QUFDekUsa0JBQU1HLElBQUksR0FBR0osUUFBUSxDQUFDSyxpQkFBVCxDQUEyQmhCLGFBQWEsQ0FBQ00sS0FBekMsQ0FBYjs7QUFDQSxnQkFBSVMsSUFBSixFQUFVO0FBQ1JELGNBQUFBLEtBQUssQ0FBQ3BELEdBQU4sQ0FBVXFELElBQVY7QUFDRDs7QUFDRGYsWUFBQUEsYUFBYSxHQUFHTCxjQUFjLENBQUNNLElBQWYsRUFBaEI7QUFDRDs7QUFFREUsVUFBQUEsZUFBZSxDQUFDYyxJQUFoQixDQUFxQjtBQUFDTixZQUFBQSxRQUFEO0FBQVdHLFlBQUFBO0FBQVgsV0FBckI7QUFDRDs7QUFFRFosUUFBQUEsZUFBZSxHQUFHSixnQkFBZ0IsQ0FBQ0csSUFBakIsRUFBbEI7QUFDRDtBQUNGOztBQUVELFdBQU9FLGVBQVA7QUFDRDs7QUFFRC9CLEVBQUFBLGdCQUFnQixDQUFDOEMsUUFBRCxFQUFXO0FBQ3pCLFdBQU8sTUFBTTtBQUNYLFdBQUs5QixtQkFBTCxHQUEyQitCLE9BQTNCLENBQW1DQyxLQUFLLElBQUksS0FBS3BDLGlCQUFMLENBQXVCb0MsS0FBSyxDQUFDVCxRQUE3QixFQUF1Q08sUUFBdkMsQ0FBNUM7QUFDRCxLQUZEO0FBR0Q7O0FBRUQxQyxFQUFBQSxnQkFBZ0IsR0FBRztBQUNqQixTQUFLWSxtQkFBTCxHQUEyQitCLE9BQTNCLENBQW1DQyxLQUFLLElBQUk7QUFDMUMsVUFBSUEsS0FBSyxDQUFDTixLQUFOLENBQVk1QyxJQUFaLEtBQXFCLENBQXpCLEVBQTRCO0FBQzFCLGNBQU02QyxJQUFJLEdBQUdLLEtBQUssQ0FBQ04sS0FBTixDQUFZZixJQUFaLEdBQW1CRSxJQUFuQixHQUEwQkssS0FBdkM7QUFDQSxhQUFLZSxTQUFMLENBQWVELEtBQUssQ0FBQ1QsUUFBckIsRUFBK0JJLElBQUksQ0FBQ08sU0FBTCxFQUEvQjtBQUNEO0FBQ0YsS0FMRDtBQU1EOztBQUVEN0MsRUFBQUEsMkJBQTJCLEdBQUc7QUFDNUIsU0FBS1csbUJBQUwsR0FBMkIrQixPQUEzQixDQUFtQ0MsS0FBSyxJQUFJO0FBQzFDQSxNQUFBQSxLQUFLLENBQUNOLEtBQU4sQ0FBWUssT0FBWixDQUFvQkosSUFBSSxJQUFJO0FBQzFCQSxRQUFBQSxJQUFJLENBQUNRLFVBQUwsTUFBcUJSLElBQUksQ0FBQ1MsTUFBTCxFQUFyQjtBQUNBVCxRQUFBQSxJQUFJLENBQUNVLGdCQUFMLE1BQTJCVixJQUFJLENBQUNXLFlBQUwsRUFBM0I7QUFDRCxPQUhEO0FBSUQsS0FMRDtBQU1EOztBQUVEaEQsRUFBQUEsY0FBYyxHQUFHO0FBQ2YsU0FBS08sZ0JBQUwsQ0FBc0IsS0FBS0csbUJBQUwsR0FBMkJ1QyxHQUEzQixDQUErQlAsS0FBSyxJQUFJQSxLQUFLLENBQUNULFFBQTlDLENBQXRCO0FBQ0Q7O0FBRUQxQixFQUFBQSxnQkFBZ0IsQ0FBQ2xDLFNBQUQsRUFBWTtBQUMxQixTQUFLNkUsUUFBTCxDQUFjQyxTQUFTLElBQUk7QUFDekIsWUFBTTtBQUFDQyxRQUFBQTtBQUFELFVBQVUsMEJBQVksSUFBSTlFLEdBQUosQ0FBUUQsU0FBUixDQUFaLEVBQWdDOEUsU0FBUyxDQUFDOUUsU0FBMUMsQ0FBaEI7QUFDQSxhQUFPO0FBQUNBLFFBQUFBLFNBQVMsRUFBRStFO0FBQVosT0FBUDtBQUNELEtBSEQ7QUFJRDs7QUFFRDlDLEVBQUFBLGlCQUFpQixDQUFDMkIsUUFBRCxFQUFXNUIsT0FBWCxFQUFvQjtBQUNuQyxVQUFNLENBQUNnRCxTQUFELEVBQVksR0FBR0MsV0FBZixJQUE4QmpELE9BQU8sQ0FDeEM0QyxHQURpQyxDQUM3Qk0sTUFBTSxJQUFJdEIsUUFBUSxDQUFDdUIsT0FBVCxDQUFpQkQsTUFBakIsQ0FEbUIsRUFFakNFLE1BRmlDLENBRTFCcEIsSUFBSSxJQUFJQSxJQUZrQixDQUFwQztBQUlBLFVBQU1xQixZQUFZLEdBQUdKLFdBQVcsQ0FBQ0wsR0FBWixDQUFnQlosSUFBSSxJQUFJQSxJQUFJLENBQUNzQixPQUFMLEVBQXhCLEVBQXdDQyxJQUF4QyxDQUE2QyxFQUE3QyxDQUFyQjtBQUVBLFNBQUs3RixLQUFMLENBQVdHLE1BQVgsQ0FBa0IyRixRQUFsQixDQUEyQixNQUFNO0FBQy9CO0FBQ0E7QUFDQSxZQUFNQyxhQUFhLEdBQUdULFNBQVMsQ0FBQ1UsVUFBVixDQUFxQkwsWUFBckIsQ0FBdEI7QUFDQSxZQUFNTSxVQUFVLEdBQUcvQixRQUFRLENBQUNnQyxXQUFULENBQXFCWixTQUFTLENBQUNhLFdBQVYsRUFBckIsQ0FBbkI7O0FBQ0EsVUFBSUYsVUFBSixFQUFnQjtBQUNkQSxRQUFBQSxVQUFVLENBQUNHLHFCQUFYLENBQWlDTCxhQUFhLENBQUMzQixHQUEvQztBQUNEOztBQUVELFdBQUtpQyxjQUFMLENBQW9CbkMsUUFBcEIsRUFBOEI1QixPQUFPLENBQUMsQ0FBRCxDQUFyQztBQUNELEtBVkQ7QUFXRDs7QUFFRHNDLEVBQUFBLFNBQVMsQ0FBQ1YsUUFBRCxFQUFXc0IsTUFBWCxFQUFtQjtBQUMxQixTQUFLeEYsS0FBTCxDQUFXRyxNQUFYLENBQWtCMkYsUUFBbEIsQ0FBMkIsTUFBTTtBQUMvQixXQUFLTyxjQUFMLENBQW9CbkMsUUFBcEIsRUFBOEJzQixNQUE5QjtBQUNELEtBRkQ7QUFHRDs7QUFFRGEsRUFBQUEsY0FBYyxDQUFDbkMsUUFBRCxFQUFXc0IsTUFBWCxFQUFtQjtBQUMvQnRCLElBQUFBLFFBQVEsQ0FBQ1UsU0FBVCxDQUFtQlksTUFBbkI7QUFFQSxVQUFNYyxVQUFVLEdBQUdwQyxRQUFRLENBQUNxQyxhQUFULEVBQW5COztBQUNBLFFBQUksQ0FBQ0QsVUFBVSxDQUFDdEIsZ0JBQVgsRUFBTCxFQUFvQztBQUNsQ3NCLE1BQUFBLFVBQVUsQ0FBQ0UsWUFBWDtBQUNEOztBQUVELFVBQU1DLFNBQVMsR0FBR3ZDLFFBQVEsQ0FBQ3dDLFlBQVQsRUFBbEI7O0FBQ0EsUUFBSSxDQUFDRCxTQUFTLENBQUMzQixVQUFWLEVBQUwsRUFBNkI7QUFDM0IyQixNQUFBQSxTQUFTLENBQUNFLE1BQVY7QUFDRDs7QUFFRHpDLElBQUFBLFFBQVEsQ0FBQzBDLGdCQUFULEdBQTRCbEMsT0FBNUIsQ0FBb0NKLElBQUksSUFBSTtBQUMxQ0EsTUFBQUEsSUFBSSxDQUFDa0MsWUFBTDtBQUNBbEMsTUFBQUEsSUFBSSxDQUFDcUMsTUFBTDtBQUNELEtBSEQ7QUFLQSxTQUFLOUYsaUJBQUw7QUFDRDs7QUFFRFUsRUFBQUEscUJBQXFCLEdBQUc7QUFDdEIsUUFBSXNGLGFBQWEsR0FBRyxJQUFwQjs7QUFDQSxTQUFLLE1BQU0zQyxRQUFYLElBQXVCLEtBQUs3RCxLQUFMLENBQVdDLFNBQWxDLEVBQTZDO0FBQzNDLFVBQUl1RyxhQUFhLElBQUksSUFBakIsSUFBeUJBLGFBQWEsQ0FBQy9DLFFBQWQsR0FBeUJiLE9BQXpCLENBQWlDaUIsUUFBUSxDQUFDSixRQUFULEVBQWpDLElBQXdELENBQXJGLEVBQXdGO0FBQ3RGK0MsUUFBQUEsYUFBYSxHQUFHM0MsUUFBaEI7QUFDRDtBQUNGOztBQUVELFFBQUkyQyxhQUFKLEVBQW1CO0FBQ2pCLFdBQUs3RyxLQUFMLENBQVdHLE1BQVgsQ0FBa0IyRyxzQkFBbEIsQ0FBeUNELGFBQWEsQ0FBQy9DLFFBQWQsR0FBeUJDLEtBQWxFLEVBQXlFO0FBQUNnRCxRQUFBQSxNQUFNLEVBQUU7QUFBVCxPQUF6RTtBQUNEO0FBQ0Y7O0FBRUR6RixFQUFBQSxnQkFBZ0IsR0FBRztBQUNqQixVQUFNMEYsWUFBWSxHQUFHLElBQUl6RyxHQUFKLENBQVFDLGtCQUFTQyxhQUFULENBQXVCLEtBQUtULEtBQUwsQ0FBV0csTUFBbEMsRUFBMEMsS0FBS0QsS0FBL0MsRUFBc0QsS0FBS0YsS0FBTCxDQUFXVSxRQUFqRSxDQUFSLENBQXJCO0FBQ0EsU0FBS3lFLFFBQUwsQ0FBYztBQUFDN0UsTUFBQUEsU0FBUyxFQUFFMEc7QUFBWixLQUFkO0FBQ0Q7O0FBRURuRyxFQUFBQSxpQkFBaUIsR0FBRztBQUNsQixTQUFLYixLQUFMLENBQVdpSCxrQkFBWCxDQUE4QkMsaUJBQTlCLENBQ0UsS0FBS2xILEtBQUwsQ0FBV0csTUFBWCxDQUFrQmlCLE9BQWxCLEVBREYsRUFFRWMsS0FBSyxDQUFDQyxJQUFOLENBQVcsS0FBSzlCLEtBQUwsQ0FBV0MsU0FBdEIsRUFBaUM4QixDQUFDLElBQUksQ0FBQ0EsQ0FBQyxDQUFDK0UsVUFBRixFQUF2QyxFQUF1RHpCLE1BQXZELENBQThEMUMsQ0FBQyxJQUFJQSxDQUFuRSxFQUFzRW9FLE1BRnhFO0FBSUQ7O0FBeE9tRTs7OztnQkFBakR4SCx3QixlQUNBO0FBQ2pCTyxFQUFBQSxNQUFNLEVBQUVrSCxtQkFBVUMsTUFBVixDQUFpQkMsVUFEUjtBQUVqQjdGLEVBQUFBLFFBQVEsRUFBRTJGLG1CQUFVQyxNQUFWLENBQWlCQyxVQUZWO0FBR2pCTixFQUFBQSxrQkFBa0IsRUFBRUksbUJBQVVDLE1BQVYsQ0FBaUJDLFVBSHBCO0FBSWpCN0csRUFBQUEsUUFBUSxFQUFFMkcsbUJBQVVHLElBQVYsQ0FBZUQsVUFKUjtBQUtqQnBHLEVBQUFBLHlCQUF5QixFQUFFa0csbUJBQVVJLElBQVYsQ0FBZUY7QUFMekIsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnZXZlbnQta2l0JztcbmltcG9ydCBSZWFjdCBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGNvbXBhcmVTZXRzIGZyb20gJ2NvbXBhcmUtc2V0cyc7XG5cbmltcG9ydCBDb21tYW5kcywge0NvbW1hbmR9IGZyb20gJy4uL2F0b20vY29tbWFuZHMnO1xuaW1wb3J0IENvbmZsaWN0IGZyb20gJy4uL21vZGVscy9jb25mbGljdHMvY29uZmxpY3QnO1xuaW1wb3J0IENvbmZsaWN0Q29udHJvbGxlciBmcm9tICcuL2NvbmZsaWN0LWNvbnRyb2xsZXInO1xuaW1wb3J0IHtPVVJTLCBUSEVJUlMsIEJBU0V9IGZyb20gJy4uL21vZGVscy9jb25mbGljdHMvc291cmNlJztcbmltcG9ydCB7YXV0b2JpbmR9IGZyb20gJy4uL2hlbHBlcnMnO1xuXG4vKipcbiAqIFJlbmRlciBhIGBDb25mbGljdENvbnRyb2xsZXJgIGZvciBlYWNoIGNvbmZsaWN0IG1hcmtlciB3aXRoaW4gYW4gb3BlbiBUZXh0RWRpdG9yLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFZGl0b3JDb25mbGljdENvbnRyb2xsZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIGVkaXRvcjogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbW1hbmRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgcmVzb2x1dGlvblByb2dyZXNzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgaXNSZWJhc2U6IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgcmVmcmVzaFJlc29sdXRpb25Qcm9ncmVzczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzLCBjb250ZXh0KSB7XG4gICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xuICAgIGF1dG9iaW5kKHRoaXMsICdyZXNvbHZlQXNDdXJyZW50JywgJ3JldmVydENvbmZsaWN0TW9kaWZpY2F0aW9ucycsICdkaXNtaXNzQ3VycmVudCcpO1xuXG4gICAgLy8gdGhpcy5sYXllciA9IHByb3BzLmVkaXRvci5hZGRNYXJrZXJMYXllcih7XG4gICAgLy8gICBtYWludGFpbkhpc3Rvcnk6IHRydWUsXG4gICAgLy8gICBwZXJzaXN0ZW50OiBmYWxzZSxcbiAgICAvLyB9KTtcblxuICAgIHRoaXMubGF5ZXIgPSBwcm9wcy5lZGl0b3IuZ2V0RGVmYXVsdE1hcmtlckxheWVyKCk7XG5cbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgY29uZmxpY3RzOiBuZXcgU2V0KENvbmZsaWN0LmFsbEZyb21FZGl0b3IocHJvcHMuZWRpdG9yLCB0aGlzLmxheWVyLCBwcm9wcy5pc1JlYmFzZSkpLFxuICAgIH07XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuXG4gICAgdGhpcy51cGRhdGVNYXJrZXJDb3VudCgpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgY29uc3QgYnVmZmVyID0gdGhpcy5wcm9wcy5lZGl0b3IuZ2V0QnVmZmVyKCk7XG5cbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuYWRkKFxuICAgICAgdGhpcy5wcm9wcy5lZGl0b3Iub25EaWREZXN0cm95KCgpID0+IHRoaXMucHJvcHMucmVmcmVzaFJlc29sdXRpb25Qcm9ncmVzcyh0aGlzLnByb3BzLmVkaXRvci5nZXRQYXRoKCkpKSxcbiAgICAgIGJ1ZmZlci5vbkRpZFJlbG9hZCgoKSA9PiB0aGlzLnJlcGFyc2VDb25mbGljdHMoKSksXG4gICAgKTtcblxuICAgIHRoaXMuc2Nyb2xsVG9GaXJzdENvbmZsaWN0KCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgdGhpcy51cGRhdGVNYXJrZXJDb3VudCgpO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXY+XG4gICAgICAgIHt0aGlzLnN0YXRlLmNvbmZsaWN0cy5zaXplID4gMCAmJiAoXG4gICAgICAgICAgPENvbW1hbmRzIHJlZ2lzdHJ5PXt0aGlzLnByb3BzLmNvbW1hbmRzfSB0YXJnZXQ9XCJhdG9tLXRleHQtZWRpdG9yXCI+XG4gICAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnJlc29sdmUtYXMtb3Vyc1wiIGNhbGxiYWNrPXt0aGlzLmdldFJlc29sdmVyVXNpbmcoW09VUlNdKX0gLz5cbiAgICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6cmVzb2x2ZS1hcy10aGVpcnNcIiBjYWxsYmFjaz17dGhpcy5nZXRSZXNvbHZlclVzaW5nKFtUSEVJUlNdKX0gLz5cbiAgICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6cmVzb2x2ZS1hcy1iYXNlXCIgY2FsbGJhY2s9e3RoaXMuZ2V0UmVzb2x2ZXJVc2luZyhbQkFTRV0pfSAvPlxuICAgICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpyZXNvbHZlLWFzLW91cnMtdGhlbi10aGVpcnNcIiBjYWxsYmFjaz17dGhpcy5nZXRSZXNvbHZlclVzaW5nKFtPVVJTLCBUSEVJUlNdKX0gLz5cbiAgICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6cmVzb2x2ZS1hcy10aGVpcnMtdGhlbi1vdXJzXCIgY2FsbGJhY2s9e3RoaXMuZ2V0UmVzb2x2ZXJVc2luZyhbVEhFSVJTLCBPVVJTXSl9IC8+XG4gICAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnJlc29sdmUtYXMtY3VycmVudFwiIGNhbGxiYWNrPXt0aGlzLnJlc29sdmVBc0N1cnJlbnR9IC8+XG4gICAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnJldmVydC1jb25mbGljdC1tb2RpZmljYXRpb25zXCIgY2FsbGJhY2s9e3RoaXMucmV2ZXJ0Q29uZmxpY3RNb2RpZmljYXRpb25zfSAvPlxuICAgICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpkaXNtaXNzLWNvbmZsaWN0XCIgY2FsbGJhY2s9e3RoaXMuZGlzbWlzc0N1cnJlbnR9IC8+XG4gICAgICAgICAgPC9Db21tYW5kcz5cbiAgICAgICAgKX1cbiAgICAgICAge0FycmF5LmZyb20odGhpcy5zdGF0ZS5jb25mbGljdHMsIGMgPT4gKFxuICAgICAgICAgIDxDb25mbGljdENvbnRyb2xsZXJcbiAgICAgICAgICAgIGtleT17Yy5nZXRLZXkoKX1cbiAgICAgICAgICAgIGVkaXRvcj17dGhpcy5wcm9wcy5lZGl0b3J9XG4gICAgICAgICAgICBjb25mbGljdD17Y31cbiAgICAgICAgICAgIHJlc29sdmVBc1NlcXVlbmNlPXtzb3VyY2VzID0+IHRoaXMucmVzb2x2ZUFzU2VxdWVuY2UoYywgc291cmNlcyl9XG4gICAgICAgICAgICBkaXNtaXNzPXsoKSA9PiB0aGlzLmRpc21pc3NDb25mbGljdHMoW2NdKX1cbiAgICAgICAgICAvPlxuICAgICAgICApKX1cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICAvLyB0aGlzLmxheWVyLmRlc3Ryb3koKTtcbiAgICB0aGlzLnN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpO1xuICB9XG5cbiAgLypcbiAgICogUmV0dXJuIGFuIEFycmF5IGNvbnRhaW5pbmcgYENvbmZsaWN0YCBvYmplY3RzIHdob3NlIG1hcmtlZCByZWdpb25zIGluY2x1ZGUgYW55IGN1cnNvciBwb3NpdGlvbiBpbiB0aGUgY3VycmVudFxuICAgKiBgVGV4dEVkaXRvcmAgYW5kIHRoZSBgU2lkZXNgIHRoYXQgY29udGFpbiBhIGN1cnNvciB3aXRoaW4gZWFjaC5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgaXMgd3JpdHRlbiB0byBoYXZlIGxpbmVhciBjb21wbGV4aXR5IHdpdGggcmVzcGVjdCB0byB0aGUgbnVtYmVyIG9mIGN1cnNvcnMgYW5kIHRoZSBudW1iZXIgb2ZcbiAgICogY29uZmxpY3RzLCB0byBncmFjZWZ1bGx5IGhhbmRsZSBmaWxlcyB3aXRoIGxhcmdlIG51bWJlcnMgb2YgYm90aC5cbiAgICovXG4gIGdldEN1cnJlbnRDb25mbGljdHMoKSB7XG4gICAgY29uc3QgY3Vyc29yUG9zaXRpb25zID0gdGhpcy5wcm9wcy5lZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb25zKCk7XG4gICAgY3Vyc29yUG9zaXRpb25zLnNvcnQoKGEsIGIpID0+IGEuY29tcGFyZShiKSk7XG4gICAgY29uc3QgY3Vyc29ySXRlcmF0b3IgPSBjdXJzb3JQb3NpdGlvbnNbU3ltYm9sLml0ZXJhdG9yXSgpO1xuXG4gICAgY29uc3QgY29uZmxpY3RJdGVyYXRvciA9IHRoaXMuc3RhdGUuY29uZmxpY3RzLmtleXMoKTtcblxuICAgIGxldCBjdXJyZW50Q3Vyc29yID0gY3Vyc29ySXRlcmF0b3IubmV4dCgpO1xuICAgIGxldCBjdXJyZW50Q29uZmxpY3QgPSBjb25mbGljdEl0ZXJhdG9yLm5leHQoKTtcbiAgICBjb25zdCBhY3RpdmVDb25mbGljdHMgPSBbXTtcblxuICAgIHdoaWxlICghY3VycmVudEN1cnNvci5kb25lICYmICFjdXJyZW50Q29uZmxpY3QuZG9uZSkge1xuICAgICAgLy8gQWR2YW5jZSBjdXJyZW50Q3Vyc29yIHRvIHRoZSBmaXJzdCBjdXJzb3IgYmV5b25kIHRoZSBlYXJsaWVzdCBjb25mbGljdC5cbiAgICAgIGNvbnN0IGVhcmxpZXN0Q29uZmxpY3RQb3NpdGlvbiA9IGN1cnJlbnRDb25mbGljdC52YWx1ZS5nZXRSYW5nZSgpLnN0YXJ0O1xuICAgICAgd2hpbGUgKCFjdXJyZW50Q3Vyc29yLmRvbmUgJiYgY3VycmVudEN1cnNvci52YWx1ZS5pc0xlc3NUaGFuKGVhcmxpZXN0Q29uZmxpY3RQb3NpdGlvbikpIHtcbiAgICAgICAgY3VycmVudEN1cnNvciA9IGN1cnNvckl0ZXJhdG9yLm5leHQoKTtcbiAgICAgIH1cblxuICAgICAgLy8gQWR2YW5jZSBjdXJyZW50Q29uZmxpY3QgdW50aWwgdGhlIGZpcnN0IGNvbmZsaWN0IHRoYXQgYmVnaW5zIGF0IGEgcG9zaXRpb24gYWZ0ZXIgdGhlIGN1cnJlbnQgY3Vyc29yLlxuICAgICAgLy8gQ29tcGFyZSBlYWNoIHRvIHRoZSBjdXJyZW50IGN1cnNvciwgYW5kIGFkZCBpdCB0byBhY3RpdmVDb25mbGljdHMgaWYgaXQgY29udGFpbnMgaXQuXG4gICAgICB3aGlsZSAoIWN1cnJlbnRDb25mbGljdC5kb25lICYmICFjdXJyZW50Q3Vyc29yLmRvbmUgJiZcbiAgICAgICAgICBjdXJyZW50Q29uZmxpY3QudmFsdWUuZ2V0UmFuZ2UoKS5zdGFydC5pc0xlc3NUaGFuKGN1cnJlbnRDdXJzb3IudmFsdWUpKSB7XG4gICAgICAgIGlmIChjdXJyZW50Q29uZmxpY3QudmFsdWUuaW5jbHVkZXNQb2ludChjdXJyZW50Q3Vyc29yLnZhbHVlKSkge1xuICAgICAgICAgIC8vIEhpdDsgZGV0ZXJtaW5lIHdoaWNoIHNpZGVzIG9mIHRoaXMgY29uZmxpY3QgY29udGFpbiBjdXJzb3JzLlxuICAgICAgICAgIGNvbnN0IGNvbmZsaWN0ID0gY3VycmVudENvbmZsaWN0LnZhbHVlO1xuICAgICAgICAgIGNvbnN0IGVuZFBvc2l0aW9uID0gY29uZmxpY3QuZ2V0UmFuZ2UoKS5lbmQ7XG4gICAgICAgICAgY29uc3Qgc2lkZXMgPSBuZXcgU2V0KCk7XG4gICAgICAgICAgd2hpbGUgKCFjdXJyZW50Q3Vyc29yLmRvbmUgJiYgY3VycmVudEN1cnNvci52YWx1ZS5pc0xlc3NUaGFuKGVuZFBvc2l0aW9uKSkge1xuICAgICAgICAgICAgY29uc3Qgc2lkZSA9IGNvbmZsaWN0LmdldFNpZGVDb250YWluaW5nKGN1cnJlbnRDdXJzb3IudmFsdWUpO1xuICAgICAgICAgICAgaWYgKHNpZGUpIHtcbiAgICAgICAgICAgICAgc2lkZXMuYWRkKHNpZGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VycmVudEN1cnNvciA9IGN1cnNvckl0ZXJhdG9yLm5leHQoKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBhY3RpdmVDb25mbGljdHMucHVzaCh7Y29uZmxpY3QsIHNpZGVzfSk7XG4gICAgICAgIH1cblxuICAgICAgICBjdXJyZW50Q29uZmxpY3QgPSBjb25mbGljdEl0ZXJhdG9yLm5leHQoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gYWN0aXZlQ29uZmxpY3RzO1xuICB9XG5cbiAgZ2V0UmVzb2x2ZXJVc2luZyhzZXF1ZW5jZSkge1xuICAgIHJldHVybiAoKSA9PiB7XG4gICAgICB0aGlzLmdldEN1cnJlbnRDb25mbGljdHMoKS5mb3JFYWNoKG1hdGNoID0+IHRoaXMucmVzb2x2ZUFzU2VxdWVuY2UobWF0Y2guY29uZmxpY3QsIHNlcXVlbmNlKSk7XG4gICAgfTtcbiAgfVxuXG4gIHJlc29sdmVBc0N1cnJlbnQoKSB7XG4gICAgdGhpcy5nZXRDdXJyZW50Q29uZmxpY3RzKCkuZm9yRWFjaChtYXRjaCA9PiB7XG4gICAgICBpZiAobWF0Y2guc2lkZXMuc2l6ZSA9PT0gMSkge1xuICAgICAgICBjb25zdCBzaWRlID0gbWF0Y2guc2lkZXMua2V5cygpLm5leHQoKS52YWx1ZTtcbiAgICAgICAgdGhpcy5yZXNvbHZlQXMobWF0Y2guY29uZmxpY3QsIHNpZGUuZ2V0U291cmNlKCkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcmV2ZXJ0Q29uZmxpY3RNb2RpZmljYXRpb25zKCkge1xuICAgIHRoaXMuZ2V0Q3VycmVudENvbmZsaWN0cygpLmZvckVhY2gobWF0Y2ggPT4ge1xuICAgICAgbWF0Y2guc2lkZXMuZm9yRWFjaChzaWRlID0+IHtcbiAgICAgICAgc2lkZS5pc01vZGlmaWVkKCkgJiYgc2lkZS5yZXZlcnQoKTtcbiAgICAgICAgc2lkZS5pc0Jhbm5lck1vZGlmaWVkKCkgJiYgc2lkZS5yZXZlcnRCYW5uZXIoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZGlzbWlzc0N1cnJlbnQoKSB7XG4gICAgdGhpcy5kaXNtaXNzQ29uZmxpY3RzKHRoaXMuZ2V0Q3VycmVudENvbmZsaWN0cygpLm1hcChtYXRjaCA9PiBtYXRjaC5jb25mbGljdCkpO1xuICB9XG5cbiAgZGlzbWlzc0NvbmZsaWN0cyhjb25mbGljdHMpIHtcbiAgICB0aGlzLnNldFN0YXRlKHByZXZTdGF0ZSA9PiB7XG4gICAgICBjb25zdCB7YWRkZWR9ID0gY29tcGFyZVNldHMobmV3IFNldChjb25mbGljdHMpLCBwcmV2U3RhdGUuY29uZmxpY3RzKTtcbiAgICAgIHJldHVybiB7Y29uZmxpY3RzOiBhZGRlZH07XG4gICAgfSk7XG4gIH1cblxuICByZXNvbHZlQXNTZXF1ZW5jZShjb25mbGljdCwgc291cmNlcykge1xuICAgIGNvbnN0IFtmaXJzdFNpZGUsIC4uLnJlc3RPZlNpZGVzXSA9IHNvdXJjZXNcbiAgICAgIC5tYXAoc291cmNlID0+IGNvbmZsaWN0LmdldFNpZGUoc291cmNlKSlcbiAgICAgIC5maWx0ZXIoc2lkZSA9PiBzaWRlKTtcblxuICAgIGNvbnN0IHRleHRUb0FwcGVuZCA9IHJlc3RPZlNpZGVzLm1hcChzaWRlID0+IHNpZGUuZ2V0VGV4dCgpKS5qb2luKCcnKTtcblxuICAgIHRoaXMucHJvcHMuZWRpdG9yLnRyYW5zYWN0KCgpID0+IHtcbiAgICAgIC8vIEFwcGVuZCB0ZXh0IGZyb20gYWxsIGJ1dCB0aGUgZmlyc3QgU2lkZSB0byB0aGUgZmlyc3QgU2lkZS4gQWRqdXN0IHRoZSBmb2xsb3dpbmcgRGlzcGxheU1hcmtlciBzbyB0aGF0IG9ubHkgdGhhdFxuICAgICAgLy8gU2lkZSdzIG1hcmtlciBpbmNsdWRlcyB0aGUgYXBwZW5kZWQgdGV4dCwgbm90IHRoZSBuZXh0IG9uZS5cbiAgICAgIGNvbnN0IGFwcGVuZGVkUmFuZ2UgPSBmaXJzdFNpZGUuYXBwZW5kVGV4dCh0ZXh0VG9BcHBlbmQpO1xuICAgICAgY29uc3QgbmV4dE1hcmtlciA9IGNvbmZsaWN0Lm1hcmtlckFmdGVyKGZpcnN0U2lkZS5nZXRQb3NpdGlvbigpKTtcbiAgICAgIGlmIChuZXh0TWFya2VyKSB7XG4gICAgICAgIG5leHRNYXJrZXIuc2V0VGFpbEJ1ZmZlclBvc2l0aW9uKGFwcGVuZGVkUmFuZ2UuZW5kKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5pbm5lclJlc29sdmVBcyhjb25mbGljdCwgc291cmNlc1swXSk7XG4gICAgfSk7XG4gIH1cblxuICByZXNvbHZlQXMoY29uZmxpY3QsIHNvdXJjZSkge1xuICAgIHRoaXMucHJvcHMuZWRpdG9yLnRyYW5zYWN0KCgpID0+IHtcbiAgICAgIHRoaXMuaW5uZXJSZXNvbHZlQXMoY29uZmxpY3QsIHNvdXJjZSk7XG4gICAgfSk7XG4gIH1cblxuICBpbm5lclJlc29sdmVBcyhjb25mbGljdCwgc291cmNlKSB7XG4gICAgY29uZmxpY3QucmVzb2x2ZUFzKHNvdXJjZSk7XG5cbiAgICBjb25zdCBjaG9zZW5TaWRlID0gY29uZmxpY3QuZ2V0Q2hvc2VuU2lkZSgpO1xuICAgIGlmICghY2hvc2VuU2lkZS5pc0Jhbm5lck1vZGlmaWVkKCkpIHtcbiAgICAgIGNob3NlblNpZGUuZGVsZXRlQmFubmVyKCk7XG4gICAgfVxuXG4gICAgY29uc3Qgc2VwYXJhdG9yID0gY29uZmxpY3QuZ2V0U2VwYXJhdG9yKCk7XG4gICAgaWYgKCFzZXBhcmF0b3IuaXNNb2RpZmllZCgpKSB7XG4gICAgICBzZXBhcmF0b3IuZGVsZXRlKCk7XG4gICAgfVxuXG4gICAgY29uZmxpY3QuZ2V0VW5jaG9zZW5TaWRlcygpLmZvckVhY2goc2lkZSA9PiB7XG4gICAgICBzaWRlLmRlbGV0ZUJhbm5lcigpO1xuICAgICAgc2lkZS5kZWxldGUoKTtcbiAgICB9KTtcblxuICAgIHRoaXMudXBkYXRlTWFya2VyQ291bnQoKTtcbiAgfVxuXG4gIHNjcm9sbFRvRmlyc3RDb25mbGljdCgpIHtcbiAgICBsZXQgZmlyc3RDb25mbGljdCA9IG51bGw7XG4gICAgZm9yIChjb25zdCBjb25mbGljdCBvZiB0aGlzLnN0YXRlLmNvbmZsaWN0cykge1xuICAgICAgaWYgKGZpcnN0Q29uZmxpY3QgPT0gbnVsbCB8fCBmaXJzdENvbmZsaWN0LmdldFJhbmdlKCkuY29tcGFyZShjb25mbGljdC5nZXRSYW5nZSgpKSA+IDApIHtcbiAgICAgICAgZmlyc3RDb25mbGljdCA9IGNvbmZsaWN0O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChmaXJzdENvbmZsaWN0KSB7XG4gICAgICB0aGlzLnByb3BzLmVkaXRvci5zY3JvbGxUb0J1ZmZlclBvc2l0aW9uKGZpcnN0Q29uZmxpY3QuZ2V0UmFuZ2UoKS5zdGFydCwge2NlbnRlcjogdHJ1ZX0pO1xuICAgIH1cbiAgfVxuXG4gIHJlcGFyc2VDb25mbGljdHMoKSB7XG4gICAgY29uc3QgbmV3Q29uZmxpY3RzID0gbmV3IFNldChDb25mbGljdC5hbGxGcm9tRWRpdG9yKHRoaXMucHJvcHMuZWRpdG9yLCB0aGlzLmxheWVyLCB0aGlzLnByb3BzLmlzUmViYXNlKSk7XG4gICAgdGhpcy5zZXRTdGF0ZSh7Y29uZmxpY3RzOiBuZXdDb25mbGljdHN9KTtcbiAgfVxuXG4gIHVwZGF0ZU1hcmtlckNvdW50KCkge1xuICAgIHRoaXMucHJvcHMucmVzb2x1dGlvblByb2dyZXNzLnJlcG9ydE1hcmtlckNvdW50KFxuICAgICAgdGhpcy5wcm9wcy5lZGl0b3IuZ2V0UGF0aCgpLFxuICAgICAgQXJyYXkuZnJvbSh0aGlzLnN0YXRlLmNvbmZsaWN0cywgYyA9PiAhYy5pc1Jlc29sdmVkKCkpLmZpbHRlcihiID0+IGIpLmxlbmd0aCxcbiAgICApO1xuICB9XG59XG4iXX0=