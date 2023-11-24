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