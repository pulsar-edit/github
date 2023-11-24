"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _atom = require("atom");

var _author = require("../models/author");

var _gitTabHeaderView = _interopRequireDefault(require("../views/git-tab-header-view"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class GitTabHeaderController extends _react.default.Component {
  constructor(props) {
    super(props);

    _defineProperty(this, "handleLockToggle", async () => {
      if (this.state.changingLock !== null) {
        return;
      }

      const nextLock = !this.props.contextLocked;

      try {
        this.setState({
          changingLock: nextLock
        });
        await this.props.setContextLock(this.getWorkDir(), nextLock);
      } finally {
        await new Promise(resolve => this.setState({
          changingLock: null
        }, resolve));
      }
    });

    _defineProperty(this, "handleWorkDirSelect", async e => {
      if (this.state.changingWorkDir !== null) {
        return;
      }

      const nextWorkDir = e.target.value;

      try {
        this.setState({
          changingWorkDir: nextWorkDir
        });
        await this.props.changeWorkingDirectory(nextWorkDir);
      } finally {
        await new Promise(resolve => this.setState({
          changingWorkDir: null
        }, resolve));
      }
    });

    _defineProperty(this, "resetWorkDirs", () => {
      this.setState(() => ({
        currentWorkDirs: []
      }));
    });

    _defineProperty(this, "updateCommitter", async () => {
      const committer = (await this.props.getCommitter()) || _author.nullAuthor;

      if (this._isMounted) {
        this.setState({
          committer
        });
      }
    });

    this._isMounted = false;
    this.state = {
      currentWorkDirs: [],
      committer: _author.nullAuthor,
      changingLock: null,
      changingWorkDir: null
    };
    this.disposable = new _atom.CompositeDisposable();
  }

  static getDerivedStateFromProps(props) {
    return {
      currentWorkDirs: props.getCurrentWorkDirs()
    };
  }

  componentDidMount() {
    this._isMounted = true;
    this.disposable.add(this.props.onDidChangeWorkDirs(this.resetWorkDirs));
    this.disposable.add(this.props.onDidUpdateRepo(this.updateCommitter));
    this.updateCommitter();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.onDidChangeWorkDirs !== this.props.onDidChangeWorkDirs || prevProps.onDidUpdateRepo !== this.props.onDidUpdateRepo) {
      this.disposable.dispose();
      this.disposable = new _atom.CompositeDisposable();
      this.disposable.add(this.props.onDidChangeWorkDirs(this.resetWorkDirs));
      this.disposable.add(this.props.onDidUpdateRepo(this.updateCommitter));
    }

    if (prevProps.getCommitter !== this.props.getCommitter) {
      this.updateCommitter();
    }
  }

  render() {
    return _react.default.createElement(_gitTabHeaderView.default, {
      committer: this.state.committer // Workspace
      ,
      workdir: this.getWorkDir(),
      workdirs: this.state.currentWorkDirs,
      contextLocked: this.getLocked(),
      changingWorkDir: this.state.changingWorkDir !== null,
      changingLock: this.state.changingLock !== null // Event Handlers
      ,
      handleAvatarClick: this.props.onDidClickAvatar,
      handleWorkDirSelect: this.handleWorkDirSelect,
      handleLockToggle: this.handleLockToggle
    });
  }

  getWorkDir() {
    return this.state.changingWorkDir !== null ? this.state.changingWorkDir : this.props.currentWorkDir;
  }

  getLocked() {
    return this.state.changingLock !== null ? this.state.changingLock : this.props.contextLocked;
  }

  componentWillUnmount() {
    this._isMounted = false;
    this.disposable.dispose();
  }

}

exports.default = GitTabHeaderController;

_defineProperty(GitTabHeaderController, "propTypes", {
  getCommitter: _propTypes.default.func.isRequired,
  // Workspace
  currentWorkDir: _propTypes.default.string,
  getCurrentWorkDirs: _propTypes.default.func.isRequired,
  changeWorkingDirectory: _propTypes.default.func.isRequired,
  contextLocked: _propTypes.default.bool.isRequired,
  setContextLock: _propTypes.default.func.isRequired,
  // Event Handlers
  onDidClickAvatar: _propTypes.default.func.isRequired,
  onDidChangeWorkDirs: _propTypes.default.func.isRequired,
  onDidUpdateRepo: _propTypes.default.func.isRequired
});