"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _path = _interopRequireDefault(require("path"));
var _react = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _classnames = _interopRequireDefault(require("classnames"));
var _eventKit = require("event-kit");
var _propTypes2 = require("../prop-types");
var _tooltip = _interopRequireDefault(require("../atom/tooltip"));
var _commands = _interopRequireWildcard(require("../atom/commands"));
var _atomTextEditor = _interopRequireDefault(require("../atom/atom-text-editor"));
var _issueishLink = require("./issueish-link");
var _emojiReactionsController = _interopRequireDefault(require("../controllers/emoji-reactions-controller"));
var _prCheckoutController = require("../controllers/pr-checkout-controller");
var _githubDotcomMarkdown = _interopRequireDefault(require("./github-dotcom-markdown"));
var _patchPreviewView = _interopRequireDefault(require("./patch-preview-view"));
var _reviewCommentView = _interopRequireDefault(require("./review-comment-view"));
var _actionableReviewView = _interopRequireDefault(require("./actionable-review-view"));
var _checkoutButton = _interopRequireDefault(require("./checkout-button"));
var _octicon = _interopRequireDefault(require("../atom/octicon"));
var _timeago = _interopRequireDefault(require("./timeago"));
var _refHolder = _interopRequireDefault(require("../models/ref-holder"));
var _helpers = require("../helpers");
var _reporterProxy = require("../reporter-proxy");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const authorAssociationText = {
  MEMBER: 'Member',
  OWNER: 'Owner',
  COLLABORATOR: 'Collaborator',
  CONTRIBUTOR: 'Contributor',
  FIRST_TIME_CONTRIBUTOR: 'First-time contributor',
  FIRST_TIMER: 'First-timer',
  NONE: null
};
class ReviewsView extends _react.default.Component {
  constructor(props) {
    super(props);
    _defineProperty(this, "logStartReviewClick", () => {
      (0, _reporterProxy.addEvent)('start-pr-review', {
        package: 'github',
        component: this.constructor.name
      });
    });
    _defineProperty(this, "renderReviewSummary", review => {
      const reviewTypes = type => {
        return {
          APPROVED: {
            icon: 'icon-check',
            copy: 'approved these changes'
          },
          COMMENTED: {
            icon: 'icon-comment',
            copy: 'commented'
          },
          CHANGES_REQUESTED: {
            icon: 'icon-alert',
            copy: 'requested changes'
          }
        }[type] || {
          icon: '',
          copy: ''
        };
      };
      const {
        icon,
        copy
      } = reviewTypes(review.state);

      // filter non actionable empty summary comments from this view
      if (review.state === 'PENDING' || review.state === 'COMMENTED' && review.bodyHTML === '') {
        return null;
      }
      const author = review.author || _helpers.GHOST_USER;
      return _react.default.createElement("div", {
        className: "github-ReviewSummary",
        key: review.id
      }, _react.default.createElement(_actionableReviewView.default, {
        originalContent: review,
        confirm: this.props.confirm,
        commands: this.props.commands,
        contentUpdater: this.props.updateSummary,
        render: showActionsMenu => {
          return _react.default.createElement(_react.Fragment, null, _react.default.createElement("header", {
            className: "github-Review-header"
          }, _react.default.createElement("div", {
            className: "github-Review-header-authorData"
          }, _react.default.createElement("span", {
            className: `github-ReviewSummary-icon icon ${icon}`
          }), _react.default.createElement("img", {
            className: "github-ReviewSummary-avatar",
            src: author.avatarUrl,
            alt: author.login
          }), _react.default.createElement("a", {
            className: "github-ReviewSummary-username",
            href: author.url
          }, author.login), _react.default.createElement("span", {
            className: "github-ReviewSummary-type"
          }, copy), this.renderEditedLink(review), this.renderAuthorAssociation(review)), _react.default.createElement(_timeago.default, {
            className: "github-ReviewSummary-timeAgo",
            time: review.submittedAt,
            displayStyle: "short"
          }), _react.default.createElement(_octicon.default, {
            icon: "ellipses",
            className: "github-Review-actionsMenu",
            onClick: event => showActionsMenu(event, review, author)
          })), _react.default.createElement("main", {
            className: "github-ReviewSummary-comment"
          }, _react.default.createElement(_githubDotcomMarkdown.default, {
            html: review.bodyHTML,
            switchToIssueish: this.props.openIssueish,
            openIssueishLinkInNewTab: this.openIssueishLinkInNewTab
          }), _react.default.createElement(_emojiReactionsController.default, {
            reactable: review,
            tooltips: this.props.tooltips,
            reportRelayError: this.props.reportRelayError
          })));
        }
      }));
    });
    _defineProperty(this, "renderReviewCommentThread", commentThread => {
      const {
        comments,
        thread
      } = commentThread;
      const rootComment = comments[0];
      if (!rootComment) {
        return null;
      }
      let threadHolder = this.threadHolders.get(thread.id);
      if (!threadHolder) {
        threadHolder = new _refHolder.default();
        this.threadHolders.set(thread.id, threadHolder);
      }
      const nativePath = (0, _helpers.toNativePathSep)(rootComment.path);
      const {
        dir,
        base
      } = _path.default.parse(nativePath);
      const {
        lineNumber,
        positionText
      } = this.getTranslatedPosition(rootComment);
      const refJumpToFileButton = new _refHolder.default();
      const jumpToFileDisabledLabel = 'Checkout this pull request to enable Jump To File.';
      const elementId = `review-thread-${thread.id}`;
      const navButtonClasses = ['github-Review-navButton', 'icon', {
        outdated: !lineNumber
      }];
      const openFileClasses = (0, _classnames.default)('icon-code', ...navButtonClasses);
      const openDiffClasses = (0, _classnames.default)('icon-diff', ...navButtonClasses);
      const isOpen = this.props.threadIDsOpen.has(thread.id);
      const isHighlighted = this.props.highlightedThreadIDs.has(thread.id);
      const toggle = evt => {
        evt.preventDefault();
        evt.stopPropagation();
        if (isOpen) {
          this.props.hideThreadID(thread.id);
        } else {
          this.props.showThreadID(thread.id);
        }
      };
      const author = rootComment.author || _helpers.GHOST_USER;
      return _react.default.createElement("details", {
        ref: threadHolder.setter,
        className: (0, _classnames.default)('github-Review', {
          'resolved': thread.isResolved,
          'github-Review--highlight': isHighlighted
        }),
        key: elementId,
        id: elementId,
        open: isOpen
      }, _react.default.createElement("summary", {
        className: "github-Review-reference",
        onClick: toggle
      }, dir && _react.default.createElement("span", {
        className: "github-Review-path"
      }, dir), _react.default.createElement("span", {
        className: "github-Review-file"
      }, dir ? _path.default.sep : '', base), _react.default.createElement("span", {
        className: "github-Review-lineNr"
      }, positionText), _react.default.createElement("img", {
        className: "github-Review-referenceAvatar",
        src: author.avatarUrl,
        alt: author.login
      }), _react.default.createElement(_timeago.default, {
        className: "github-Review-referenceTimeAgo",
        time: rootComment.createdAt,
        displayStyle: "short"
      })), _react.default.createElement("nav", {
        className: "github-Review-nav"
      }, _react.default.createElement("button", {
        className: openFileClasses,
        "data-path": nativePath,
        "data-line": lineNumber,
        onClick: this.openFile,
        disabled: this.props.checkoutOp.isEnabled(),
        ref: refJumpToFileButton.setter
      }, "Jump To File"), _react.default.createElement("button", {
        className: openDiffClasses,
        "data-path": nativePath,
        "data-line": rootComment.position,
        onClick: this.openDiff
      }, "Open Diff"), this.props.checkoutOp.isEnabled() && _react.default.createElement(_tooltip.default, {
        manager: this.props.tooltips,
        target: refJumpToFileButton,
        title: jumpToFileDisabledLabel,
        showDelay: 200
      })), rootComment.position !== null && _react.default.createElement(_patchPreviewView.default, {
        multiFilePatch: this.props.multiFilePatch,
        fileName: nativePath,
        diffRow: rootComment.position,
        maxRowCount: this.props.contextLines,
        config: this.props.config
      }), this.renderThread({
        thread,
        comments
      }));
    });
    _defineProperty(this, "renderThread", ({
      thread,
      comments
    }) => {
      let replyHolder = this.replyHolders.get(thread.id);
      if (!replyHolder) {
        replyHolder = new _refHolder.default();
        this.replyHolders.set(thread.id, replyHolder);
      }
      const lastComment = comments[comments.length - 1];
      const isPosting = this.props.postingToThreadID !== null;
      return _react.default.createElement(_react.Fragment, null, _react.default.createElement("main", {
        className: "github-Review-comments"
      }, comments.map(comment => {
        return _react.default.createElement(_reviewCommentView.default, {
          key: comment.id,
          comment: comment,
          openIssueish: this.props.openIssueish,
          openIssueishLinkInNewTab: this.openIssueishLinkInNewTab,
          tooltips: this.props.tooltips,
          reportRelayError: this.props.reportRelayError,
          renderEditedLink: this.renderEditedLink,
          renderAuthorAssociation: this.renderAuthorAssociation,
          isPosting: isPosting,
          confirm: this.props.confirm,
          commands: this.props.commands,
          updateComment: this.props.updateComment
        });
      }), _react.default.createElement("div", {
        className: (0, _classnames.default)('github-Review-reply', {
          'github-Review-reply--disabled': isPosting
        }),
        "data-thread-id": thread.id
      }, _react.default.createElement(_atomTextEditor.default, {
        placeholderText: "Reply...",
        lineNumberGutterVisible: false,
        softWrapped: true,
        autoHeight: true,
        readOnly: isPosting,
        refModel: replyHolder
      }))), thread.isResolved && _react.default.createElement("div", {
        className: "github-Review-resolvedText"
      }, "This conversation was marked as resolved by @", thread.resolvedBy.login), _react.default.createElement("footer", {
        className: "github-Review-footer"
      }, _react.default.createElement("button", {
        className: "github-Review-replyButton btn btn-primary",
        title: "Add your comment",
        disabled: isPosting,
        onClick: () => this.submitReply(replyHolder, thread, lastComment)
      }, "Comment"), this.renderResolveButton(thread)));
    });
    _defineProperty(this, "renderResolveButton", thread => {
      if (thread.isResolved) {
        return _react.default.createElement("button", {
          className: "github-Review-resolveButton btn icon icon-check",
          title: "Unresolve conversation",
          onClick: () => this.resolveUnresolveThread(thread)
        }, "Unresolve conversation");
      } else {
        return _react.default.createElement("button", {
          className: "github-Review-resolveButton btn icon icon-check",
          title: "Resolve conversation",
          onClick: () => this.resolveUnresolveThread(thread)
        }, "Resolve conversation");
      }
    });
    _defineProperty(this, "openFile", evt => {
      if (!this.props.checkoutOp.isEnabled()) {
        const target = evt.currentTarget;
        this.props.openFile(target.dataset.path, target.dataset.line);
      }
    });
    _defineProperty(this, "openDiff", evt => {
      const target = evt.currentTarget;
      this.props.openDiff(target.dataset.path, parseInt(target.dataset.line, 10));
    });
    _defineProperty(this, "openIssueishLinkInNewTab", evt => {
      const {
        repoOwner,
        repoName,
        issueishNumber
      } = (0, _issueishLink.getDataFromGithubUrl)(evt.target.dataset.url);
      return this.props.openIssueish(repoOwner, repoName, issueishNumber);
    });
    _defineProperty(this, "submitCurrentComment", evt => {
      const threadID = evt.currentTarget.dataset.threadId;
      /* istanbul ignore if */
      if (!threadID) {
        return null;
      }
      const {
        thread,
        comments
      } = this.props.commentThreads.find(each => each.thread.id === threadID);
      const replyHolder = this.replyHolders.get(threadID);
      return this.submitReply(replyHolder, thread, comments[comments.length - 1]);
    });
    this.rootHolder = new _refHolder.default();
    this.replyHolders = new Map();
    this.threadHolders = new Map();
    this.state = {
      isRefreshing: false
    };
    this.subs = new _eventKit.CompositeDisposable();
  }
  componentDidMount() {
    const {
      scrollToThreadID
    } = this.props;
    if (scrollToThreadID) {
      this.scrollToThread(scrollToThreadID);
    }
  }
  componentDidUpdate(prevProps) {
    const {
      scrollToThreadID
    } = this.props;
    if (scrollToThreadID && scrollToThreadID !== prevProps.scrollToThreadID) {
      this.scrollToThread(scrollToThreadID);
    }
  }
  componentWillUnmount() {
    this.subs.dispose();
  }
  render() {
    return _react.default.createElement("div", {
      className: "github-Reviews",
      ref: this.rootHolder.setter
    }, this.renderCommands(), this.renderHeader(), _react.default.createElement("div", {
      className: "github-Reviews-list"
    }, this.renderReviewSummaries(), this.renderReviewCommentThreads()));
  }
  renderCommands() {
    return _react.default.createElement(_react.Fragment, null, _react.default.createElement(_commands.default, {
      registry: this.props.commands,
      target: this.rootHolder
    }, _react.default.createElement(_commands.Command, {
      command: "github:more-context",
      callback: this.props.moreContext
    }), _react.default.createElement(_commands.Command, {
      command: "github:less-context",
      callback: this.props.lessContext
    })), _react.default.createElement(_commands.default, {
      registry: this.props.commands,
      target: ".github-Review-reply"
    }, _react.default.createElement(_commands.Command, {
      command: "github:submit-comment",
      callback: this.submitCurrentComment
    })));
  }
  renderHeader() {
    const refresh = () => {
      if (this.state.isRefreshing) {
        return;
      }
      this.setState({
        isRefreshing: true
      });
      const sub = this.props.refetch(() => {
        this.subs.remove(sub);
        this.setState({
          isRefreshing: false
        });
      });
      this.subs.add(sub);
    };
    return _react.default.createElement("header", {
      className: "github-Reviews-topHeader"
    }, _react.default.createElement("span", {
      className: "icon icon-comment-discussion"
    }), _react.default.createElement("span", {
      className: "github-Reviews-headerTitle"
    }, "Reviews for\xA0", _react.default.createElement("span", {
      className: "github-Reviews-clickable",
      onClick: this.props.openPR
    }, this.props.owner, "/", this.props.repo, "#", this.props.number)), _react.default.createElement("button", {
      className: (0, _classnames.default)('github-Reviews-headerButton github-Reviews-clickable icon icon-repo-sync', {
        refreshing: this.state.isRefreshing
      }),
      onClick: refresh
    }), _react.default.createElement(_checkoutButton.default, {
      checkoutOp: this.props.checkoutOp,
      classNamePrefix: "github-Reviews-checkoutButton--",
      classNames: ['github-Reviews-headerButton']
    }));
  }
  renderEmptyState() {
    const {
      number,
      repo,
      owner
    } = this.props;
    // todo: make this open the review flow in Atom instead of dotcom
    const pullRequestURL = `https://www.github.com/${owner}/${repo}/pull/${number}/files/`;
    return _react.default.createElement("div", {
      className: "github-Reviews-emptyState"
    }, _react.default.createElement("img", {
      src: "atom://github/img/mona.svg",
      alt: "Mona the octocat in spaaaccee",
      className: "github-Reviews-emptyImg"
    }), _react.default.createElement("div", {
      className: "github-Reviews-emptyText"
    }, "This pull request has no reviews"), _react.default.createElement("button", {
      className: "github-Reviews-emptyCallToActionButton btn"
    }, _react.default.createElement("a", {
      href: pullRequestURL,
      onClick: this.logStartReviewClick
    }, "Start a new review")));
  }
  renderReviewSummaries() {
    if (this.props.summaries.length === 0) {
      return this.renderEmptyState();
    }
    const toggle = evt => {
      evt.preventDefault();
      if (this.props.summarySectionOpen) {
        this.props.hideSummaries();
      } else {
        this.props.showSummaries();
      }
    };
    return _react.default.createElement("details", {
      className: "github-Reviews-section summaries",
      open: this.props.summarySectionOpen
    }, _react.default.createElement("summary", {
      className: "github-Reviews-header",
      onClick: toggle
    }, _react.default.createElement("span", {
      className: "github-Reviews-title"
    }, "Summaries")), _react.default.createElement("main", {
      className: "github-Reviews-container"
    }, this.props.summaries.map(this.renderReviewSummary)));
  }
  renderReviewCommentThreads() {
    const commentThreads = this.props.commentThreads;
    if (commentThreads.length === 0) {
      return null;
    }
    const resolvedThreads = commentThreads.filter(pair => pair.thread.isResolved);
    const unresolvedThreads = commentThreads.filter(pair => !pair.thread.isResolved);
    const toggleComments = evt => {
      evt.preventDefault();
      if (this.props.commentSectionOpen) {
        this.props.hideComments();
      } else {
        this.props.showComments();
      }
    };
    return _react.default.createElement("details", {
      className: "github-Reviews-section comments",
      open: this.props.commentSectionOpen
    }, _react.default.createElement("summary", {
      className: "github-Reviews-header",
      onClick: toggleComments
    }, _react.default.createElement("span", {
      className: "github-Reviews-title"
    }, "Comments"), _react.default.createElement("span", {
      className: "github-Reviews-progress"
    }, _react.default.createElement("span", {
      className: "github-Reviews-count"
    }, "Resolved", ' ', _react.default.createElement("span", {
      className: "github-Reviews-countNr"
    }, resolvedThreads.length), ' ', "of", ' ', _react.default.createElement("span", {
      className: "github-Reviews-countNr"
    }, resolvedThreads.length + unresolvedThreads.length)), _react.default.createElement("progress", {
      className: "github-Reviews-progessBar",
      value: resolvedThreads.length,
      max: resolvedThreads.length + unresolvedThreads.length
    }))), unresolvedThreads.length > 0 && _react.default.createElement("main", {
      className: "github-Reviews-container"
    }, unresolvedThreads.map(this.renderReviewCommentThread)), resolvedThreads.length > 0 && _react.default.createElement("details", {
      className: "github-Reviews-section resolved-comments",
      open: true
    }, _react.default.createElement("summary", {
      className: "github-Reviews-header"
    }, _react.default.createElement("span", {
      className: "github-Reviews-title"
    }, "Resolved")), _react.default.createElement("main", {
      className: "github-Reviews-container"
    }, resolvedThreads.map(this.renderReviewCommentThread))));
  }
  renderEditedLink(entity) {
    if (!entity.lastEditedAt) {
      return null;
    } else {
      return _react.default.createElement("span", {
        className: "github-Review-edited"
      }, "\xA0\u2022\xA0", _react.default.createElement("a", {
        className: "github-Review-edited",
        href: entity.url
      }, "edited"));
    }
  }
  renderAuthorAssociation(entity) {
    const text = authorAssociationText[entity.authorAssociation];
    if (!text) {
      return null;
    }
    return _react.default.createElement("span", {
      className: "github-Review-authorAssociationBadge badge"
    }, text);
  }
  submitReply(replyHolder, thread, lastComment) {
    const body = replyHolder.map(editor => editor.getText()).getOr('');
    const didSubmitComment = () => replyHolder.map(editor => editor.setText('', {
      bypassReadOnly: true
    }));
    const didFailComment = () => replyHolder.map(editor => editor.setText(body, {
      bypassReadOnly: true
    }));
    return this.props.addSingleComment(body, thread.id, lastComment.id, lastComment.path, lastComment.position, {
      didSubmitComment,
      didFailComment
    });
  }
  getTranslatedPosition(rootComment) {
    let lineNumber, positionText;
    const translations = this.props.commentTranslations;
    const isCheckedOutPullRequest = this.props.checkoutOp.why() === _prCheckoutController.checkoutStates.CURRENT;
    if (translations === null) {
      lineNumber = null;
      positionText = '';
    } else if (rootComment.position === null) {
      lineNumber = null;
      positionText = 'outdated';
    } else {
      const translationsForFile = translations.get(_path.default.normalize(rootComment.path));
      lineNumber = translationsForFile.diffToFilePosition.get(parseInt(rootComment.position, 10));
      if (translationsForFile.fileTranslations && isCheckedOutPullRequest) {
        lineNumber = translationsForFile.fileTranslations.get(lineNumber).newPosition;
      }
      positionText = lineNumber;
    }
    return {
      lineNumber,
      positionText
    };
  }

  /* istanbul ignore next */
  scrollToThread(threadID) {
    const threadHolder = this.threadHolders.get(threadID);
    if (threadHolder) {
      threadHolder.map(element => {
        element.scrollIntoViewIfNeeded();
        return null; // shh, eslint
      });
    }
  }

  async resolveUnresolveThread(thread) {
    if (thread.isResolved) {
      await this.props.unresolveThread(thread);
    } else {
      await this.props.resolveThread(thread);
    }
  }
}
exports.default = ReviewsView;
_defineProperty(ReviewsView, "propTypes", {
  // Relay results
  relay: _propTypes.default.shape({
    environment: _propTypes.default.object.isRequired
  }).isRequired,
  repository: _propTypes.default.object.isRequired,
  pullRequest: _propTypes.default.object.isRequired,
  summaries: _propTypes.default.array.isRequired,
  commentThreads: _propTypes.default.arrayOf(_propTypes.default.shape({
    thread: _propTypes.default.object.isRequired,
    comments: _propTypes.default.arrayOf(_propTypes.default.object).isRequired
  })),
  refetch: _propTypes.default.func.isRequired,
  // Package models
  multiFilePatch: _propTypes.default.object.isRequired,
  contextLines: _propTypes.default.number.isRequired,
  checkoutOp: _propTypes2.EnableableOperationPropType.isRequired,
  summarySectionOpen: _propTypes.default.bool.isRequired,
  commentSectionOpen: _propTypes.default.bool.isRequired,
  threadIDsOpen: _propTypes.default.shape({
    has: _propTypes.default.func.isRequired
  }),
  highlightedThreadIDs: _propTypes.default.shape({
    has: _propTypes.default.func.isRequired
  }),
  postingToThreadID: _propTypes.default.string,
  scrollToThreadID: _propTypes.default.string,
  // Structure: Map< relativePath: String, {
  //   rawPositions: Set<lineNumbers: Number>,
  //   diffToFilePosition: Map<rawPosition: Number, adjustedPosition: Number>,
  //   fileTranslations: null | Map<adjustedPosition: Number, {newPosition: Number}>,
  //   digest: String,
  // }>
  commentTranslations: _propTypes.default.object,
  // for the dotcom link in the empty state
  number: _propTypes.default.number.isRequired,
  repo: _propTypes.default.string.isRequired,
  owner: _propTypes.default.string.isRequired,
  workdir: _propTypes.default.string.isRequired,
  // Atom environment
  workspace: _propTypes.default.object.isRequired,
  config: _propTypes.default.object.isRequired,
  commands: _propTypes.default.object.isRequired,
  tooltips: _propTypes.default.object.isRequired,
  confirm: _propTypes.default.func.isRequired,
  // Action methods
  openFile: _propTypes.default.func.isRequired,
  openDiff: _propTypes.default.func.isRequired,
  openPR: _propTypes.default.func.isRequired,
  moreContext: _propTypes.default.func.isRequired,
  lessContext: _propTypes.default.func.isRequired,
  openIssueish: _propTypes.default.func.isRequired,
  showSummaries: _propTypes.default.func.isRequired,
  hideSummaries: _propTypes.default.func.isRequired,
  showComments: _propTypes.default.func.isRequired,
  hideComments: _propTypes.default.func.isRequired,
  showThreadID: _propTypes.default.func.isRequired,
  hideThreadID: _propTypes.default.func.isRequired,
  resolveThread: _propTypes.default.func.isRequired,
  unresolveThread: _propTypes.default.func.isRequired,
  addSingleComment: _propTypes.default.func.isRequired,
  updateComment: _propTypes.default.func.isRequired,
  updateSummary: _propTypes.default.func.isRequired,
  reportRelayError: _propTypes.default.func.isRequired
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcGF0aCIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX3JlYWN0IiwiX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQiLCJfcHJvcFR5cGVzIiwiX2NsYXNzbmFtZXMiLCJfZXZlbnRLaXQiLCJfcHJvcFR5cGVzMiIsIl90b29sdGlwIiwiX2NvbW1hbmRzIiwiX2F0b21UZXh0RWRpdG9yIiwiX2lzc3VlaXNoTGluayIsIl9lbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXIiLCJfcHJDaGVja291dENvbnRyb2xsZXIiLCJfZ2l0aHViRG90Y29tTWFya2Rvd24iLCJfcGF0Y2hQcmV2aWV3VmlldyIsIl9yZXZpZXdDb21tZW50VmlldyIsIl9hY3Rpb25hYmxlUmV2aWV3VmlldyIsIl9jaGVja291dEJ1dHRvbiIsIl9vY3RpY29uIiwiX3RpbWVhZ28iLCJfcmVmSG9sZGVyIiwiX2hlbHBlcnMiLCJfcmVwb3J0ZXJQcm94eSIsIl9nZXRSZXF1aXJlV2lsZGNhcmRDYWNoZSIsImUiLCJXZWFrTWFwIiwiciIsInQiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsImhhcyIsImdldCIsIm4iLCJfX3Byb3RvX18iLCJhIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJ1IiwicHJvdG90eXBlIiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiaSIsInNldCIsIm9iaiIsIl9kZWZpbmVQcm9wZXJ0eSIsImtleSIsInZhbHVlIiwiX3RvUHJvcGVydHlLZXkiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJhcmciLCJfdG9QcmltaXRpdmUiLCJTdHJpbmciLCJpbnB1dCIsImhpbnQiLCJwcmltIiwiU3ltYm9sIiwidG9QcmltaXRpdmUiLCJ1bmRlZmluZWQiLCJyZXMiLCJUeXBlRXJyb3IiLCJOdW1iZXIiLCJhdXRob3JBc3NvY2lhdGlvblRleHQiLCJNRU1CRVIiLCJPV05FUiIsIkNPTExBQk9SQVRPUiIsIkNPTlRSSUJVVE9SIiwiRklSU1RfVElNRV9DT05UUklCVVRPUiIsIkZJUlNUX1RJTUVSIiwiTk9ORSIsIlJldmlld3NWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiYWRkRXZlbnQiLCJwYWNrYWdlIiwiY29tcG9uZW50IiwibmFtZSIsInJldmlldyIsInJldmlld1R5cGVzIiwidHlwZSIsIkFQUFJPVkVEIiwiaWNvbiIsImNvcHkiLCJDT01NRU5URUQiLCJDSEFOR0VTX1JFUVVFU1RFRCIsInN0YXRlIiwiYm9keUhUTUwiLCJhdXRob3IiLCJHSE9TVF9VU0VSIiwiY3JlYXRlRWxlbWVudCIsImNsYXNzTmFtZSIsImlkIiwib3JpZ2luYWxDb250ZW50IiwiY29uZmlybSIsImNvbW1hbmRzIiwiY29udGVudFVwZGF0ZXIiLCJ1cGRhdGVTdW1tYXJ5IiwicmVuZGVyIiwic2hvd0FjdGlvbnNNZW51IiwiRnJhZ21lbnQiLCJzcmMiLCJhdmF0YXJVcmwiLCJhbHQiLCJsb2dpbiIsImhyZWYiLCJ1cmwiLCJyZW5kZXJFZGl0ZWRMaW5rIiwicmVuZGVyQXV0aG9yQXNzb2NpYXRpb24iLCJ0aW1lIiwic3VibWl0dGVkQXQiLCJkaXNwbGF5U3R5bGUiLCJvbkNsaWNrIiwiZXZlbnQiLCJodG1sIiwic3dpdGNoVG9Jc3N1ZWlzaCIsIm9wZW5Jc3N1ZWlzaCIsIm9wZW5Jc3N1ZWlzaExpbmtJbk5ld1RhYiIsInJlYWN0YWJsZSIsInRvb2x0aXBzIiwicmVwb3J0UmVsYXlFcnJvciIsImNvbW1lbnRUaHJlYWQiLCJjb21tZW50cyIsInRocmVhZCIsInJvb3RDb21tZW50IiwidGhyZWFkSG9sZGVyIiwidGhyZWFkSG9sZGVycyIsIlJlZkhvbGRlciIsIm5hdGl2ZVBhdGgiLCJ0b05hdGl2ZVBhdGhTZXAiLCJwYXRoIiwiZGlyIiwiYmFzZSIsInBhcnNlIiwibGluZU51bWJlciIsInBvc2l0aW9uVGV4dCIsImdldFRyYW5zbGF0ZWRQb3NpdGlvbiIsInJlZkp1bXBUb0ZpbGVCdXR0b24iLCJqdW1wVG9GaWxlRGlzYWJsZWRMYWJlbCIsImVsZW1lbnRJZCIsIm5hdkJ1dHRvbkNsYXNzZXMiLCJvdXRkYXRlZCIsIm9wZW5GaWxlQ2xhc3NlcyIsImN4Iiwib3BlbkRpZmZDbGFzc2VzIiwiaXNPcGVuIiwidGhyZWFkSURzT3BlbiIsImlzSGlnaGxpZ2h0ZWQiLCJoaWdobGlnaHRlZFRocmVhZElEcyIsInRvZ2dsZSIsImV2dCIsInByZXZlbnREZWZhdWx0Iiwic3RvcFByb3BhZ2F0aW9uIiwiaGlkZVRocmVhZElEIiwic2hvd1RocmVhZElEIiwicmVmIiwic2V0dGVyIiwiaXNSZXNvbHZlZCIsIm9wZW4iLCJzZXAiLCJjcmVhdGVkQXQiLCJvcGVuRmlsZSIsImRpc2FibGVkIiwiY2hlY2tvdXRPcCIsImlzRW5hYmxlZCIsInBvc2l0aW9uIiwib3BlbkRpZmYiLCJtYW5hZ2VyIiwidGFyZ2V0IiwidGl0bGUiLCJzaG93RGVsYXkiLCJtdWx0aUZpbGVQYXRjaCIsImZpbGVOYW1lIiwiZGlmZlJvdyIsIm1heFJvd0NvdW50IiwiY29udGV4dExpbmVzIiwiY29uZmlnIiwicmVuZGVyVGhyZWFkIiwicmVwbHlIb2xkZXIiLCJyZXBseUhvbGRlcnMiLCJsYXN0Q29tbWVudCIsImxlbmd0aCIsImlzUG9zdGluZyIsInBvc3RpbmdUb1RocmVhZElEIiwibWFwIiwiY29tbWVudCIsInVwZGF0ZUNvbW1lbnQiLCJwbGFjZWhvbGRlclRleHQiLCJsaW5lTnVtYmVyR3V0dGVyVmlzaWJsZSIsInNvZnRXcmFwcGVkIiwiYXV0b0hlaWdodCIsInJlYWRPbmx5IiwicmVmTW9kZWwiLCJyZXNvbHZlZEJ5Iiwic3VibWl0UmVwbHkiLCJyZW5kZXJSZXNvbHZlQnV0dG9uIiwicmVzb2x2ZVVucmVzb2x2ZVRocmVhZCIsImN1cnJlbnRUYXJnZXQiLCJkYXRhc2V0IiwibGluZSIsInBhcnNlSW50IiwicmVwb093bmVyIiwicmVwb05hbWUiLCJpc3N1ZWlzaE51bWJlciIsImdldERhdGFGcm9tR2l0aHViVXJsIiwidGhyZWFkSUQiLCJ0aHJlYWRJZCIsImNvbW1lbnRUaHJlYWRzIiwiZmluZCIsImVhY2giLCJyb290SG9sZGVyIiwiTWFwIiwiaXNSZWZyZXNoaW5nIiwic3VicyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJjb21wb25lbnREaWRNb3VudCIsInNjcm9sbFRvVGhyZWFkSUQiLCJzY3JvbGxUb1RocmVhZCIsImNvbXBvbmVudERpZFVwZGF0ZSIsInByZXZQcm9wcyIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwiZGlzcG9zZSIsInJlbmRlckNvbW1hbmRzIiwicmVuZGVySGVhZGVyIiwicmVuZGVyUmV2aWV3U3VtbWFyaWVzIiwicmVuZGVyUmV2aWV3Q29tbWVudFRocmVhZHMiLCJyZWdpc3RyeSIsIkNvbW1hbmQiLCJjb21tYW5kIiwiY2FsbGJhY2siLCJtb3JlQ29udGV4dCIsImxlc3NDb250ZXh0Iiwic3VibWl0Q3VycmVudENvbW1lbnQiLCJyZWZyZXNoIiwic2V0U3RhdGUiLCJzdWIiLCJyZWZldGNoIiwicmVtb3ZlIiwiYWRkIiwib3BlblBSIiwib3duZXIiLCJyZXBvIiwibnVtYmVyIiwicmVmcmVzaGluZyIsImNsYXNzTmFtZVByZWZpeCIsImNsYXNzTmFtZXMiLCJyZW5kZXJFbXB0eVN0YXRlIiwicHVsbFJlcXVlc3RVUkwiLCJsb2dTdGFydFJldmlld0NsaWNrIiwic3VtbWFyaWVzIiwic3VtbWFyeVNlY3Rpb25PcGVuIiwiaGlkZVN1bW1hcmllcyIsInNob3dTdW1tYXJpZXMiLCJyZW5kZXJSZXZpZXdTdW1tYXJ5IiwicmVzb2x2ZWRUaHJlYWRzIiwiZmlsdGVyIiwicGFpciIsInVucmVzb2x2ZWRUaHJlYWRzIiwidG9nZ2xlQ29tbWVudHMiLCJjb21tZW50U2VjdGlvbk9wZW4iLCJoaWRlQ29tbWVudHMiLCJzaG93Q29tbWVudHMiLCJtYXgiLCJyZW5kZXJSZXZpZXdDb21tZW50VGhyZWFkIiwiZW50aXR5IiwibGFzdEVkaXRlZEF0IiwidGV4dCIsImF1dGhvckFzc29jaWF0aW9uIiwiYm9keSIsImVkaXRvciIsImdldFRleHQiLCJnZXRPciIsImRpZFN1Ym1pdENvbW1lbnQiLCJzZXRUZXh0IiwiYnlwYXNzUmVhZE9ubHkiLCJkaWRGYWlsQ29tbWVudCIsImFkZFNpbmdsZUNvbW1lbnQiLCJ0cmFuc2xhdGlvbnMiLCJjb21tZW50VHJhbnNsYXRpb25zIiwiaXNDaGVja2VkT3V0UHVsbFJlcXVlc3QiLCJ3aHkiLCJjaGVja291dFN0YXRlcyIsIkNVUlJFTlQiLCJ0cmFuc2xhdGlvbnNGb3JGaWxlIiwibm9ybWFsaXplIiwiZGlmZlRvRmlsZVBvc2l0aW9uIiwiZmlsZVRyYW5zbGF0aW9ucyIsIm5ld1Bvc2l0aW9uIiwiZWxlbWVudCIsInNjcm9sbEludG9WaWV3SWZOZWVkZWQiLCJ1bnJlc29sdmVUaHJlYWQiLCJyZXNvbHZlVGhyZWFkIiwiZXhwb3J0cyIsInJlbGF5IiwiUHJvcFR5cGVzIiwic2hhcGUiLCJlbnZpcm9ubWVudCIsIm9iamVjdCIsImlzUmVxdWlyZWQiLCJyZXBvc2l0b3J5IiwicHVsbFJlcXVlc3QiLCJhcnJheSIsImFycmF5T2YiLCJmdW5jIiwiRW5hYmxlYWJsZU9wZXJhdGlvblByb3BUeXBlIiwiYm9vbCIsInN0cmluZyIsIndvcmtkaXIiLCJ3b3Jrc3BhY2UiXSwic291cmNlcyI6WyJyZXZpZXdzLXZpZXcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgUmVhY3QsIHtGcmFnbWVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjeCBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnZXZlbnQta2l0JztcblxuaW1wb3J0IHtFbmFibGVhYmxlT3BlcmF0aW9uUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IFRvb2x0aXAgZnJvbSAnLi4vYXRvbS90b29sdGlwJztcbmltcG9ydCBDb21tYW5kcywge0NvbW1hbmR9IGZyb20gJy4uL2F0b20vY29tbWFuZHMnO1xuaW1wb3J0IEF0b21UZXh0RWRpdG9yIGZyb20gJy4uL2F0b20vYXRvbS10ZXh0LWVkaXRvcic7XG5pbXBvcnQge2dldERhdGFGcm9tR2l0aHViVXJsfSBmcm9tICcuL2lzc3VlaXNoLWxpbmsnO1xuaW1wb3J0IEVtb2ppUmVhY3Rpb25zQ29udHJvbGxlciBmcm9tICcuLi9jb250cm9sbGVycy9lbW9qaS1yZWFjdGlvbnMtY29udHJvbGxlcic7XG5pbXBvcnQge2NoZWNrb3V0U3RhdGVzfSBmcm9tICcuLi9jb250cm9sbGVycy9wci1jaGVja291dC1jb250cm9sbGVyJztcbmltcG9ydCBHaXRodWJEb3Rjb21NYXJrZG93biBmcm9tICcuL2dpdGh1Yi1kb3Rjb20tbWFya2Rvd24nO1xuaW1wb3J0IFBhdGNoUHJldmlld1ZpZXcgZnJvbSAnLi9wYXRjaC1wcmV2aWV3LXZpZXcnO1xuaW1wb3J0IFJldmlld0NvbW1lbnRWaWV3IGZyb20gJy4vcmV2aWV3LWNvbW1lbnQtdmlldyc7XG5pbXBvcnQgQWN0aW9uYWJsZVJldmlld1ZpZXcgZnJvbSAnLi9hY3Rpb25hYmxlLXJldmlldy12aWV3JztcbmltcG9ydCBDaGVja291dEJ1dHRvbiBmcm9tICcuL2NoZWNrb3V0LWJ1dHRvbic7XG5pbXBvcnQgT2N0aWNvbiBmcm9tICcuLi9hdG9tL29jdGljb24nO1xuaW1wb3J0IFRpbWVhZ28gZnJvbSAnLi90aW1lYWdvJztcbmltcG9ydCBSZWZIb2xkZXIgZnJvbSAnLi4vbW9kZWxzL3JlZi1ob2xkZXInO1xuaW1wb3J0IHt0b05hdGl2ZVBhdGhTZXAsIEdIT1NUX1VTRVJ9IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IHthZGRFdmVudH0gZnJvbSAnLi4vcmVwb3J0ZXItcHJveHknO1xuXG5jb25zdCBhdXRob3JBc3NvY2lhdGlvblRleHQgPSB7XG4gIE1FTUJFUjogJ01lbWJlcicsXG4gIE9XTkVSOiAnT3duZXInLFxuICBDT0xMQUJPUkFUT1I6ICdDb2xsYWJvcmF0b3InLFxuICBDT05UUklCVVRPUjogJ0NvbnRyaWJ1dG9yJyxcbiAgRklSU1RfVElNRV9DT05UUklCVVRPUjogJ0ZpcnN0LXRpbWUgY29udHJpYnV0b3InLFxuICBGSVJTVF9USU1FUjogJ0ZpcnN0LXRpbWVyJyxcbiAgTk9ORTogbnVsbCxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJldmlld3NWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvLyBSZWxheSByZXN1bHRzXG4gICAgcmVsYXk6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBlbnZpcm9ubWVudDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgcmVwb3NpdG9yeTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHB1bGxSZXF1ZXN0OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgc3VtbWFyaWVzOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgICBjb21tZW50VGhyZWFkczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIHRocmVhZDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgY29tbWVudHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gICAgfSkpLFxuICAgIHJlZmV0Y2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBQYWNrYWdlIG1vZGVsc1xuICAgIG11bHRpRmlsZVBhdGNoOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29udGV4dExpbmVzOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgY2hlY2tvdXRPcDogRW5hYmxlYWJsZU9wZXJhdGlvblByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgc3VtbWFyeVNlY3Rpb25PcGVuOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGNvbW1lbnRTZWN0aW9uT3BlbjogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICB0aHJlYWRJRHNPcGVuOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgaGFzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIH0pLFxuICAgIGhpZ2hsaWdodGVkVGhyZWFkSURzOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgaGFzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIH0pLFxuICAgIHBvc3RpbmdUb1RocmVhZElEOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHNjcm9sbFRvVGhyZWFkSUQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgLy8gU3RydWN0dXJlOiBNYXA8IHJlbGF0aXZlUGF0aDogU3RyaW5nLCB7XG4gICAgLy8gICByYXdQb3NpdGlvbnM6IFNldDxsaW5lTnVtYmVyczogTnVtYmVyPixcbiAgICAvLyAgIGRpZmZUb0ZpbGVQb3NpdGlvbjogTWFwPHJhd1Bvc2l0aW9uOiBOdW1iZXIsIGFkanVzdGVkUG9zaXRpb246IE51bWJlcj4sXG4gICAgLy8gICBmaWxlVHJhbnNsYXRpb25zOiBudWxsIHwgTWFwPGFkanVzdGVkUG9zaXRpb246IE51bWJlciwge25ld1Bvc2l0aW9uOiBOdW1iZXJ9PixcbiAgICAvLyAgIGRpZ2VzdDogU3RyaW5nLFxuICAgIC8vIH0+XG4gICAgY29tbWVudFRyYW5zbGF0aW9uczogUHJvcFR5cGVzLm9iamVjdCxcblxuICAgIC8vIGZvciB0aGUgZG90Y29tIGxpbmsgaW4gdGhlIGVtcHR5IHN0YXRlXG4gICAgbnVtYmVyOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgcmVwbzogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIG93bmVyOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgd29ya2RpcjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQXRvbSBlbnZpcm9ubWVudFxuICAgIHdvcmtzcGFjZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbW1hbmRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgdG9vbHRpcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb25maXJtOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQWN0aW9uIG1ldGhvZHNcbiAgICBvcGVuRmlsZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvcGVuRGlmZjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvcGVuUFI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgbW9yZUNvbnRleHQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgbGVzc0NvbnRleHQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb3Blbklzc3VlaXNoOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHNob3dTdW1tYXJpZXM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgaGlkZVN1bW1hcmllczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBzaG93Q29tbWVudHM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgaGlkZUNvbW1lbnRzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHNob3dUaHJlYWRJRDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBoaWRlVGhyZWFkSUQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgcmVzb2x2ZVRocmVhZDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB1bnJlc29sdmVUaHJlYWQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgYWRkU2luZ2xlQ29tbWVudDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB1cGRhdGVDb21tZW50OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHVwZGF0ZVN1bW1hcnk6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgcmVwb3J0UmVsYXlFcnJvcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5yb290SG9sZGVyID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMucmVwbHlIb2xkZXJzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMudGhyZWFkSG9sZGVycyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaXNSZWZyZXNoaW5nOiBmYWxzZSxcbiAgICB9O1xuICAgIHRoaXMuc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBjb25zdCB7c2Nyb2xsVG9UaHJlYWRJRH0gPSB0aGlzLnByb3BzO1xuICAgIGlmIChzY3JvbGxUb1RocmVhZElEKSB7XG4gICAgICB0aGlzLnNjcm9sbFRvVGhyZWFkKHNjcm9sbFRvVGhyZWFkSUQpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMpIHtcbiAgICBjb25zdCB7c2Nyb2xsVG9UaHJlYWRJRH0gPSB0aGlzLnByb3BzO1xuICAgIGlmIChzY3JvbGxUb1RocmVhZElEICYmIHNjcm9sbFRvVGhyZWFkSUQgIT09IHByZXZQcm9wcy5zY3JvbGxUb1RocmVhZElEKSB7XG4gICAgICB0aGlzLnNjcm9sbFRvVGhyZWFkKHNjcm9sbFRvVGhyZWFkSUQpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuc3Vicy5kaXNwb3NlKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3NcIiByZWY9e3RoaXMucm9vdEhvbGRlci5zZXR0ZXJ9PlxuICAgICAgICB7dGhpcy5yZW5kZXJDb21tYW5kcygpfVxuICAgICAgICB7dGhpcy5yZW5kZXJIZWFkZXIoKX1cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1saXN0XCI+XG4gICAgICAgICAge3RoaXMucmVuZGVyUmV2aWV3U3VtbWFyaWVzKCl9XG4gICAgICAgICAge3RoaXMucmVuZGVyUmV2aWV3Q29tbWVudFRocmVhZHMoKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyQ29tbWFuZHMoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgPENvbW1hbmRzIHJlZ2lzdHJ5PXt0aGlzLnByb3BzLmNvbW1hbmRzfSB0YXJnZXQ9e3RoaXMucm9vdEhvbGRlcn0+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1Yjptb3JlLWNvbnRleHRcIiBjYWxsYmFjaz17dGhpcy5wcm9wcy5tb3JlQ29udGV4dH0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmxlc3MtY29udGV4dFwiIGNhbGxiYWNrPXt0aGlzLnByb3BzLmxlc3NDb250ZXh0fSAvPlxuICAgICAgICA8L0NvbW1hbmRzPlxuICAgICAgICA8Q29tbWFuZHMgcmVnaXN0cnk9e3RoaXMucHJvcHMuY29tbWFuZHN9IHRhcmdldD1cIi5naXRodWItUmV2aWV3LXJlcGx5XCI+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzdWJtaXQtY29tbWVudFwiIGNhbGxiYWNrPXt0aGlzLnN1Ym1pdEN1cnJlbnRDb21tZW50fSAvPlxuICAgICAgICA8L0NvbW1hbmRzPlxuICAgICAgPC9GcmFnbWVudD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVySGVhZGVyKCkge1xuICAgIGNvbnN0IHJlZnJlc2ggPSAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5pc1JlZnJlc2hpbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7aXNSZWZyZXNoaW5nOiB0cnVlfSk7XG4gICAgICBjb25zdCBzdWIgPSB0aGlzLnByb3BzLnJlZmV0Y2goKCkgPT4ge1xuICAgICAgICB0aGlzLnN1YnMucmVtb3ZlKHN1Yik7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2lzUmVmcmVzaGluZzogZmFsc2V9KTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5zdWJzLmFkZChzdWIpO1xuICAgIH07XG4gICAgcmV0dXJuIChcbiAgICAgIDxoZWFkZXIgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtdG9wSGVhZGVyXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi1jb21tZW50LWRpc2N1c3Npb25cIiAvPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1oZWFkZXJUaXRsZVwiPlxuICAgICAgICAgIFJldmlld3MgZm9yJm5ic3A7XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtY2xpY2thYmxlXCIgb25DbGljaz17dGhpcy5wcm9wcy5vcGVuUFJ9PlxuICAgICAgICAgICAge3RoaXMucHJvcHMub3duZXJ9L3t0aGlzLnByb3BzLnJlcG99I3t0aGlzLnByb3BzLm51bWJlcn1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGNsYXNzTmFtZT17Y3goXG4gICAgICAgICAgICAnZ2l0aHViLVJldmlld3MtaGVhZGVyQnV0dG9uIGdpdGh1Yi1SZXZpZXdzLWNsaWNrYWJsZSBpY29uIGljb24tcmVwby1zeW5jJyxcbiAgICAgICAgICAgIHtyZWZyZXNoaW5nOiB0aGlzLnN0YXRlLmlzUmVmcmVzaGluZ30sXG4gICAgICAgICAgKX1cbiAgICAgICAgICBvbkNsaWNrPXtyZWZyZXNofVxuICAgICAgICAvPlxuICAgICAgICA8Q2hlY2tvdXRCdXR0b25cbiAgICAgICAgICBjaGVja291dE9wPXt0aGlzLnByb3BzLmNoZWNrb3V0T3B9XG4gICAgICAgICAgY2xhc3NOYW1lUHJlZml4PVwiZ2l0aHViLVJldmlld3MtY2hlY2tvdXRCdXR0b24tLVwiXG4gICAgICAgICAgY2xhc3NOYW1lcz17WydnaXRodWItUmV2aWV3cy1oZWFkZXJCdXR0b24nXX1cbiAgICAgICAgLz5cbiAgICAgIDwvaGVhZGVyPlxuICAgICk7XG4gIH1cblxuICBsb2dTdGFydFJldmlld0NsaWNrID0gKCkgPT4ge1xuICAgIGFkZEV2ZW50KCdzdGFydC1wci1yZXZpZXcnLCB7cGFja2FnZTogJ2dpdGh1YicsIGNvbXBvbmVudDogdGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSk7XG4gIH1cblxuICByZW5kZXJFbXB0eVN0YXRlKCkge1xuICAgIGNvbnN0IHtudW1iZXIsIHJlcG8sIG93bmVyfSA9IHRoaXMucHJvcHM7XG4gICAgLy8gdG9kbzogbWFrZSB0aGlzIG9wZW4gdGhlIHJldmlldyBmbG93IGluIEF0b20gaW5zdGVhZCBvZiBkb3Rjb21cbiAgICBjb25zdCBwdWxsUmVxdWVzdFVSTCA9IGBodHRwczovL3d3dy5naXRodWIuY29tLyR7b3duZXJ9LyR7cmVwb30vcHVsbC8ke251bWJlcn0vZmlsZXMvYDtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1lbXB0eVN0YXRlXCI+XG4gICAgICAgIDxpbWcgc3JjPVwiYXRvbTovL2dpdGh1Yi9pbWcvbW9uYS5zdmdcIiBhbHQ9XCJNb25hIHRoZSBvY3RvY2F0IGluIHNwYWFhY2NlZVwiIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLWVtcHR5SW1nXCIgLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1lbXB0eVRleHRcIj5cbiAgICAgICAgICBUaGlzIHB1bGwgcmVxdWVzdCBoYXMgbm8gcmV2aWV3c1xuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1lbXB0eUNhbGxUb0FjdGlvbkJ1dHRvbiBidG5cIj5cbiAgICAgICAgICA8YSBocmVmPXtwdWxsUmVxdWVzdFVSTH0gb25DbGljaz17dGhpcy5sb2dTdGFydFJldmlld0NsaWNrfT5cbiAgICAgICAgICAgIFN0YXJ0IGEgbmV3IHJldmlld1xuICAgICAgICAgIDwvYT5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyUmV2aWV3U3VtbWFyaWVzKCkge1xuICAgIGlmICh0aGlzLnByb3BzLnN1bW1hcmllcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlckVtcHR5U3RhdGUoKTtcbiAgICB9XG5cbiAgICBjb25zdCB0b2dnbGUgPSBldnQgPT4ge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAodGhpcy5wcm9wcy5zdW1tYXJ5U2VjdGlvbk9wZW4pIHtcbiAgICAgICAgdGhpcy5wcm9wcy5oaWRlU3VtbWFyaWVzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnByb3BzLnNob3dTdW1tYXJpZXMoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkZXRhaWxzXG4gICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLXNlY3Rpb24gc3VtbWFyaWVzXCJcbiAgICAgICAgb3Blbj17dGhpcy5wcm9wcy5zdW1tYXJ5U2VjdGlvbk9wZW59PlxuXG4gICAgICAgIDxzdW1tYXJ5IGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLWhlYWRlclwiIG9uQ2xpY2s9e3RvZ2dsZX0+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtdGl0bGVcIj5TdW1tYXJpZXM8L3NwYW4+XG4gICAgICAgIDwvc3VtbWFyeT5cbiAgICAgICAgPG1haW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtY29udGFpbmVyXCI+XG4gICAgICAgICAge3RoaXMucHJvcHMuc3VtbWFyaWVzLm1hcCh0aGlzLnJlbmRlclJldmlld1N1bW1hcnkpfVxuICAgICAgICA8L21haW4+XG5cbiAgICAgIDwvZGV0YWlscz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyUmV2aWV3U3VtbWFyeSA9IHJldmlldyA9PiB7XG4gICAgY29uc3QgcmV2aWV3VHlwZXMgPSB0eXBlID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIEFQUFJPVkVEOiB7aWNvbjogJ2ljb24tY2hlY2snLCBjb3B5OiAnYXBwcm92ZWQgdGhlc2UgY2hhbmdlcyd9LFxuICAgICAgICBDT01NRU5URUQ6IHtpY29uOiAnaWNvbi1jb21tZW50JywgY29weTogJ2NvbW1lbnRlZCd9LFxuICAgICAgICBDSEFOR0VTX1JFUVVFU1RFRDoge2ljb246ICdpY29uLWFsZXJ0JywgY29weTogJ3JlcXVlc3RlZCBjaGFuZ2VzJ30sXG4gICAgICB9W3R5cGVdIHx8IHtpY29uOiAnJywgY29weTogJyd9O1xuICAgIH07XG5cbiAgICBjb25zdCB7aWNvbiwgY29weX0gPSByZXZpZXdUeXBlcyhyZXZpZXcuc3RhdGUpO1xuXG4gICAgLy8gZmlsdGVyIG5vbiBhY3Rpb25hYmxlIGVtcHR5IHN1bW1hcnkgY29tbWVudHMgZnJvbSB0aGlzIHZpZXdcbiAgICBpZiAocmV2aWV3LnN0YXRlID09PSAnUEVORElORycgfHwgKHJldmlldy5zdGF0ZSA9PT0gJ0NPTU1FTlRFRCcgJiYgcmV2aWV3LmJvZHlIVE1MID09PSAnJykpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGF1dGhvciA9IHJldmlldy5hdXRob3IgfHwgR0hPU1RfVVNFUjtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdTdW1tYXJ5XCIga2V5PXtyZXZpZXcuaWR9PlxuICAgICAgICA8QWN0aW9uYWJsZVJldmlld1ZpZXdcbiAgICAgICAgICBvcmlnaW5hbENvbnRlbnQ9e3Jldmlld31cbiAgICAgICAgICBjb25maXJtPXt0aGlzLnByb3BzLmNvbmZpcm19XG4gICAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgICAgY29udGVudFVwZGF0ZXI9e3RoaXMucHJvcHMudXBkYXRlU3VtbWFyeX1cbiAgICAgICAgICByZW5kZXI9e3Nob3dBY3Rpb25zTWVudSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8RnJhZ21lbnQ+XG4gICAgICAgICAgICAgICAgPGhlYWRlciBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LWhlYWRlclwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LWhlYWRlci1hdXRob3JEYXRhXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17YGdpdGh1Yi1SZXZpZXdTdW1tYXJ5LWljb24gaWNvbiAke2ljb259YH0gLz5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3U3VtbWFyeS1hdmF0YXJcIlxuICAgICAgICAgICAgICAgICAgICAgIHNyYz17YXV0aG9yLmF2YXRhclVybH0gYWx0PXthdXRob3IubG9naW59XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdTdW1tYXJ5LXVzZXJuYW1lXCIgaHJlZj17YXV0aG9yLnVybH0+e2F1dGhvci5sb2dpbn08L2E+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdTdW1tYXJ5LXR5cGVcIj57Y29weX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnJlbmRlckVkaXRlZExpbmsocmV2aWV3KX1cbiAgICAgICAgICAgICAgICAgICAge3RoaXMucmVuZGVyQXV0aG9yQXNzb2NpYXRpb24ocmV2aWV3KX1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPFRpbWVhZ28gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld1N1bW1hcnktdGltZUFnb1wiIHRpbWU9e3Jldmlldy5zdWJtaXR0ZWRBdH0gZGlzcGxheVN0eWxlPVwic2hvcnRcIiAvPlxuICAgICAgICAgICAgICAgICAgPE9jdGljb25cbiAgICAgICAgICAgICAgICAgICAgaWNvbj1cImVsbGlwc2VzXCJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1hY3Rpb25zTWVudVwiXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2V2ZW50ID0+IHNob3dBY3Rpb25zTWVudShldmVudCwgcmV2aWV3LCBhdXRob3IpfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L2hlYWRlcj5cbiAgICAgICAgICAgICAgICA8bWFpbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3U3VtbWFyeS1jb21tZW50XCI+XG4gICAgICAgICAgICAgICAgICA8R2l0aHViRG90Y29tTWFya2Rvd25cbiAgICAgICAgICAgICAgICAgICAgaHRtbD17cmV2aWV3LmJvZHlIVE1MfVxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2hUb0lzc3VlaXNoPXt0aGlzLnByb3BzLm9wZW5Jc3N1ZWlzaH1cbiAgICAgICAgICAgICAgICAgICAgb3Blbklzc3VlaXNoTGlua0luTmV3VGFiPXt0aGlzLm9wZW5Jc3N1ZWlzaExpbmtJbk5ld1RhYn1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICA8RW1vamlSZWFjdGlvbnNDb250cm9sbGVyXG4gICAgICAgICAgICAgICAgICAgIHJlYWN0YWJsZT17cmV2aWV3fVxuICAgICAgICAgICAgICAgICAgICB0b29sdGlwcz17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICAgICAgICAgICAgcmVwb3J0UmVsYXlFcnJvcj17dGhpcy5wcm9wcy5yZXBvcnRSZWxheUVycm9yfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L21haW4+XG4gICAgICAgICAgICAgIDwvRnJhZ21lbnQ+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH19XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyUmV2aWV3Q29tbWVudFRocmVhZHMoKSB7XG4gICAgY29uc3QgY29tbWVudFRocmVhZHMgPSB0aGlzLnByb3BzLmNvbW1lbnRUaHJlYWRzO1xuICAgIGlmIChjb21tZW50VGhyZWFkcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc29sdmVkVGhyZWFkcyA9IGNvbW1lbnRUaHJlYWRzLmZpbHRlcihwYWlyID0+IHBhaXIudGhyZWFkLmlzUmVzb2x2ZWQpO1xuICAgIGNvbnN0IHVucmVzb2x2ZWRUaHJlYWRzID0gY29tbWVudFRocmVhZHMuZmlsdGVyKHBhaXIgPT4gIXBhaXIudGhyZWFkLmlzUmVzb2x2ZWQpO1xuXG4gICAgY29uc3QgdG9nZ2xlQ29tbWVudHMgPSBldnQgPT4ge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAodGhpcy5wcm9wcy5jb21tZW50U2VjdGlvbk9wZW4pIHtcbiAgICAgICAgdGhpcy5wcm9wcy5oaWRlQ29tbWVudHMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucHJvcHMuc2hvd0NvbW1lbnRzKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGV0YWlsc1xuICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1zZWN0aW9uIGNvbW1lbnRzXCJcbiAgICAgICAgb3Blbj17dGhpcy5wcm9wcy5jb21tZW50U2VjdGlvbk9wZW59PlxuXG4gICAgICAgIDxzdW1tYXJ5IGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLWhlYWRlclwiIG9uQ2xpY2s9e3RvZ2dsZUNvbW1lbnRzfT5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy10aXRsZVwiPkNvbW1lbnRzPC9zcGFuPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLXByb2dyZXNzXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1jb3VudFwiPlxuICAgICAgICAgICAgICBSZXNvbHZlZFxuICAgICAgICAgICAgICB7JyAnfTxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLWNvdW50TnJcIj57cmVzb2x2ZWRUaHJlYWRzLmxlbmd0aH08L3NwYW4+eycgJ31cbiAgICAgICAgICAgICAgb2ZcbiAgICAgICAgICAgICAgeycgJ308c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1jb3VudE5yXCI+e3Jlc29sdmVkVGhyZWFkcy5sZW5ndGggKyB1bnJlc29sdmVkVGhyZWFkcy5sZW5ndGh9PC9zcGFuPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPHByb2dyZXNzXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLXByb2dlc3NCYXJcIiB2YWx1ZT17cmVzb2x2ZWRUaHJlYWRzLmxlbmd0aH1cbiAgICAgICAgICAgICAgbWF4PXtyZXNvbHZlZFRocmVhZHMubGVuZ3RoICsgdW5yZXNvbHZlZFRocmVhZHMubGVuZ3RofVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvc3VtbWFyeT5cblxuICAgICAgICB7dW5yZXNvbHZlZFRocmVhZHMubGVuZ3RoID4gMCAmJiA8bWFpbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1jb250YWluZXJcIj5cbiAgICAgICAgICB7dW5yZXNvbHZlZFRocmVhZHMubWFwKHRoaXMucmVuZGVyUmV2aWV3Q29tbWVudFRocmVhZCl9XG4gICAgICAgIDwvbWFpbj59XG4gICAgICAgIHtyZXNvbHZlZFRocmVhZHMubGVuZ3RoID4gMCAmJiA8ZGV0YWlscyBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1zZWN0aW9uIHJlc29sdmVkLWNvbW1lbnRzXCIgb3Blbj5cbiAgICAgICAgICA8c3VtbWFyeSBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLXRpdGxlXCI+UmVzb2x2ZWQ8L3NwYW4+XG4gICAgICAgICAgPC9zdW1tYXJ5PlxuICAgICAgICAgIDxtYWluIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAge3Jlc29sdmVkVGhyZWFkcy5tYXAodGhpcy5yZW5kZXJSZXZpZXdDb21tZW50VGhyZWFkKX1cbiAgICAgICAgICA8L21haW4+XG4gICAgICAgIDwvZGV0YWlscz59XG5cbiAgICAgIDwvZGV0YWlscz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyUmV2aWV3Q29tbWVudFRocmVhZCA9IGNvbW1lbnRUaHJlYWQgPT4ge1xuICAgIGNvbnN0IHtjb21tZW50cywgdGhyZWFkfSA9IGNvbW1lbnRUaHJlYWQ7XG4gICAgY29uc3Qgcm9vdENvbW1lbnQgPSBjb21tZW50c1swXTtcbiAgICBpZiAoIXJvb3RDb21tZW50KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgdGhyZWFkSG9sZGVyID0gdGhpcy50aHJlYWRIb2xkZXJzLmdldCh0aHJlYWQuaWQpO1xuICAgIGlmICghdGhyZWFkSG9sZGVyKSB7XG4gICAgICB0aHJlYWRIb2xkZXIgPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgICB0aGlzLnRocmVhZEhvbGRlcnMuc2V0KHRocmVhZC5pZCwgdGhyZWFkSG9sZGVyKTtcbiAgICB9XG5cbiAgICBjb25zdCBuYXRpdmVQYXRoID0gdG9OYXRpdmVQYXRoU2VwKHJvb3RDb21tZW50LnBhdGgpO1xuICAgIGNvbnN0IHtkaXIsIGJhc2V9ID0gcGF0aC5wYXJzZShuYXRpdmVQYXRoKTtcbiAgICBjb25zdCB7bGluZU51bWJlciwgcG9zaXRpb25UZXh0fSA9IHRoaXMuZ2V0VHJhbnNsYXRlZFBvc2l0aW9uKHJvb3RDb21tZW50KTtcblxuICAgIGNvbnN0IHJlZkp1bXBUb0ZpbGVCdXR0b24gPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgY29uc3QganVtcFRvRmlsZURpc2FibGVkTGFiZWwgPSAnQ2hlY2tvdXQgdGhpcyBwdWxsIHJlcXVlc3QgdG8gZW5hYmxlIEp1bXAgVG8gRmlsZS4nO1xuXG4gICAgY29uc3QgZWxlbWVudElkID0gYHJldmlldy10aHJlYWQtJHt0aHJlYWQuaWR9YDtcblxuICAgIGNvbnN0IG5hdkJ1dHRvbkNsYXNzZXMgPSBbJ2dpdGh1Yi1SZXZpZXctbmF2QnV0dG9uJywgJ2ljb24nLCB7b3V0ZGF0ZWQ6ICFsaW5lTnVtYmVyfV07XG4gICAgY29uc3Qgb3BlbkZpbGVDbGFzc2VzID0gY3goJ2ljb24tY29kZScsIC4uLm5hdkJ1dHRvbkNsYXNzZXMpO1xuICAgIGNvbnN0IG9wZW5EaWZmQ2xhc3NlcyA9IGN4KCdpY29uLWRpZmYnLCAuLi5uYXZCdXR0b25DbGFzc2VzKTtcblxuICAgIGNvbnN0IGlzT3BlbiA9IHRoaXMucHJvcHMudGhyZWFkSURzT3Blbi5oYXModGhyZWFkLmlkKTtcbiAgICBjb25zdCBpc0hpZ2hsaWdodGVkID0gdGhpcy5wcm9wcy5oaWdobGlnaHRlZFRocmVhZElEcy5oYXModGhyZWFkLmlkKTtcbiAgICBjb25zdCB0b2dnbGUgPSBldnQgPT4ge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIGlmIChpc09wZW4pIHtcbiAgICAgICAgdGhpcy5wcm9wcy5oaWRlVGhyZWFkSUQodGhyZWFkLmlkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucHJvcHMuc2hvd1RocmVhZElEKHRocmVhZC5pZCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IGF1dGhvciA9IHJvb3RDb21tZW50LmF1dGhvciB8fCBHSE9TVF9VU0VSO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkZXRhaWxzXG4gICAgICAgIHJlZj17dGhyZWFkSG9sZGVyLnNldHRlcn1cbiAgICAgICAgY2xhc3NOYW1lPXtjeCgnZ2l0aHViLVJldmlldycsIHsncmVzb2x2ZWQnOiB0aHJlYWQuaXNSZXNvbHZlZCwgJ2dpdGh1Yi1SZXZpZXctLWhpZ2hsaWdodCc6IGlzSGlnaGxpZ2h0ZWR9KX1cbiAgICAgICAga2V5PXtlbGVtZW50SWR9XG4gICAgICAgIGlkPXtlbGVtZW50SWR9XG4gICAgICAgIG9wZW49e2lzT3Blbn0+XG5cbiAgICAgICAgPHN1bW1hcnkgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1yZWZlcmVuY2VcIiBvbkNsaWNrPXt0b2dnbGV9PlxuICAgICAgICAgIHtkaXIgJiYgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1wYXRoXCI+e2Rpcn08L3NwYW4+fVxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctZmlsZVwiPntkaXIgPyBwYXRoLnNlcCA6ICcnfXtiYXNlfTwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LWxpbmVOclwiPntwb3NpdGlvblRleHR9PC9zcGFuPlxuICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1yZWZlcmVuY2VBdmF0YXJcIlxuICAgICAgICAgICAgc3JjPXthdXRob3IuYXZhdGFyVXJsfSBhbHQ9e2F1dGhvci5sb2dpbn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxUaW1lYWdvIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctcmVmZXJlbmNlVGltZUFnb1wiIHRpbWU9e3Jvb3RDb21tZW50LmNyZWF0ZWRBdH0gZGlzcGxheVN0eWxlPVwic2hvcnRcIiAvPlxuICAgICAgICA8L3N1bW1hcnk+XG4gICAgICAgIDxuYXYgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1uYXZcIj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT17b3BlbkZpbGVDbGFzc2VzfVxuICAgICAgICAgICAgZGF0YS1wYXRoPXtuYXRpdmVQYXRofSBkYXRhLWxpbmU9e2xpbmVOdW1iZXJ9XG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLm9wZW5GaWxlfSBkaXNhYmxlZD17dGhpcy5wcm9wcy5jaGVja291dE9wLmlzRW5hYmxlZCgpfVxuICAgICAgICAgICAgcmVmPXtyZWZKdW1wVG9GaWxlQnV0dG9uLnNldHRlcn0+XG4gICAgICAgICAgICBKdW1wIFRvIEZpbGVcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT17b3BlbkRpZmZDbGFzc2VzfVxuICAgICAgICAgICAgZGF0YS1wYXRoPXtuYXRpdmVQYXRofSBkYXRhLWxpbmU9e3Jvb3RDb21tZW50LnBvc2l0aW9ufVxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5vcGVuRGlmZn0+XG4gICAgICAgICAgICBPcGVuIERpZmZcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5jaGVja291dE9wLmlzRW5hYmxlZCgpICYmXG4gICAgICAgICAgICA8VG9vbHRpcFxuICAgICAgICAgICAgICBtYW5hZ2VyPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICAgICAgICB0YXJnZXQ9e3JlZkp1bXBUb0ZpbGVCdXR0b259XG4gICAgICAgICAgICAgIHRpdGxlPXtqdW1wVG9GaWxlRGlzYWJsZWRMYWJlbH1cbiAgICAgICAgICAgICAgc2hvd0RlbGF5PXsyMDB9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIH1cbiAgICAgICAgPC9uYXY+XG5cbiAgICAgICAge3Jvb3RDb21tZW50LnBvc2l0aW9uICE9PSBudWxsICYmIChcbiAgICAgICAgICA8UGF0Y2hQcmV2aWV3Vmlld1xuICAgICAgICAgICAgbXVsdGlGaWxlUGF0Y2g9e3RoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2h9XG4gICAgICAgICAgICBmaWxlTmFtZT17bmF0aXZlUGF0aH1cbiAgICAgICAgICAgIGRpZmZSb3c9e3Jvb3RDb21tZW50LnBvc2l0aW9ufVxuICAgICAgICAgICAgbWF4Um93Q291bnQ9e3RoaXMucHJvcHMuY29udGV4dExpbmVzfVxuICAgICAgICAgICAgY29uZmlnPXt0aGlzLnByb3BzLmNvbmZpZ31cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuXG4gICAgICAgIHt0aGlzLnJlbmRlclRocmVhZCh7dGhyZWFkLCBjb21tZW50c30pfVxuXG4gICAgICA8L2RldGFpbHM+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclRocmVhZCA9ICh7dGhyZWFkLCBjb21tZW50c30pID0+IHtcbiAgICBsZXQgcmVwbHlIb2xkZXIgPSB0aGlzLnJlcGx5SG9sZGVycy5nZXQodGhyZWFkLmlkKTtcbiAgICBpZiAoIXJlcGx5SG9sZGVyKSB7XG4gICAgICByZXBseUhvbGRlciA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICAgIHRoaXMucmVwbHlIb2xkZXJzLnNldCh0aHJlYWQuaWQsIHJlcGx5SG9sZGVyKTtcbiAgICB9XG5cbiAgICBjb25zdCBsYXN0Q29tbWVudCA9IGNvbW1lbnRzW2NvbW1lbnRzLmxlbmd0aCAtIDFdO1xuICAgIGNvbnN0IGlzUG9zdGluZyA9IHRoaXMucHJvcHMucG9zdGluZ1RvVGhyZWFkSUQgIT09IG51bGw7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEZyYWdtZW50PlxuICAgICAgICA8bWFpbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LWNvbW1lbnRzXCI+XG5cbiAgICAgICAgICB7Y29tbWVudHMubWFwKGNvbW1lbnQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPFJldmlld0NvbW1lbnRWaWV3XG4gICAgICAgICAgICAgICAga2V5PXtjb21tZW50LmlkfVxuICAgICAgICAgICAgICAgIGNvbW1lbnQ9e2NvbW1lbnR9XG4gICAgICAgICAgICAgICAgb3Blbklzc3VlaXNoPXt0aGlzLnByb3BzLm9wZW5Jc3N1ZWlzaH1cbiAgICAgICAgICAgICAgICBvcGVuSXNzdWVpc2hMaW5rSW5OZXdUYWI9e3RoaXMub3Blbklzc3VlaXNoTGlua0luTmV3VGFifVxuICAgICAgICAgICAgICAgIHRvb2x0aXBzPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICAgICAgICAgIHJlcG9ydFJlbGF5RXJyb3I9e3RoaXMucHJvcHMucmVwb3J0UmVsYXlFcnJvcn1cbiAgICAgICAgICAgICAgICByZW5kZXJFZGl0ZWRMaW5rPXt0aGlzLnJlbmRlckVkaXRlZExpbmt9XG4gICAgICAgICAgICAgICAgcmVuZGVyQXV0aG9yQXNzb2NpYXRpb249e3RoaXMucmVuZGVyQXV0aG9yQXNzb2NpYXRpb259XG4gICAgICAgICAgICAgICAgaXNQb3N0aW5nPXtpc1Bvc3Rpbmd9XG4gICAgICAgICAgICAgICAgY29uZmlybT17dGhpcy5wcm9wcy5jb25maXJtfVxuICAgICAgICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgICAgICAgIHVwZGF0ZUNvbW1lbnQ9e3RoaXMucHJvcHMudXBkYXRlQ29tbWVudH1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSl9XG5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9e2N4KCdnaXRodWItUmV2aWV3LXJlcGx5JywgeydnaXRodWItUmV2aWV3LXJlcGx5LS1kaXNhYmxlZCc6IGlzUG9zdGluZ30pfVxuICAgICAgICAgICAgZGF0YS10aHJlYWQtaWQ9e3RocmVhZC5pZH0+XG5cbiAgICAgICAgICAgIDxBdG9tVGV4dEVkaXRvclxuICAgICAgICAgICAgICBwbGFjZWhvbGRlclRleHQ9XCJSZXBseS4uLlwiXG4gICAgICAgICAgICAgIGxpbmVOdW1iZXJHdXR0ZXJWaXNpYmxlPXtmYWxzZX1cbiAgICAgICAgICAgICAgc29mdFdyYXBwZWQ9e3RydWV9XG4gICAgICAgICAgICAgIGF1dG9IZWlnaHQ9e3RydWV9XG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtpc1Bvc3Rpbmd9XG4gICAgICAgICAgICAgIHJlZk1vZGVsPXtyZXBseUhvbGRlcn1cbiAgICAgICAgICAgIC8+XG5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9tYWluPlxuICAgICAgICB7dGhyZWFkLmlzUmVzb2x2ZWQgJiYgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LXJlc29sdmVkVGV4dFwiPlxuICAgICAgICAgIFRoaXMgY29udmVyc2F0aW9uIHdhcyBtYXJrZWQgYXMgcmVzb2x2ZWQgYnkgQHt0aHJlYWQucmVzb2x2ZWRCeS5sb2dpbn1cbiAgICAgICAgPC9kaXY+fVxuICAgICAgICA8Zm9vdGVyIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctZm9vdGVyXCI+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1yZXBseUJ1dHRvbiBidG4gYnRuLXByaW1hcnlcIlxuICAgICAgICAgICAgdGl0bGU9XCJBZGQgeW91ciBjb21tZW50XCJcbiAgICAgICAgICAgIGRpc2FibGVkPXtpc1Bvc3Rpbmd9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLnN1Ym1pdFJlcGx5KHJlcGx5SG9sZGVyLCB0aHJlYWQsIGxhc3RDb21tZW50KX0+XG4gICAgICAgICAgICBDb21tZW50XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAge3RoaXMucmVuZGVyUmVzb2x2ZUJ1dHRvbih0aHJlYWQpfVxuICAgICAgICA8L2Zvb3Rlcj5cbiAgICAgIDwvRnJhZ21lbnQ+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclJlc29sdmVCdXR0b24gPSB0aHJlYWQgPT4ge1xuICAgIGlmICh0aHJlYWQuaXNSZXNvbHZlZCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctcmVzb2x2ZUJ1dHRvbiBidG4gaWNvbiBpY29uLWNoZWNrXCJcbiAgICAgICAgICB0aXRsZT1cIlVucmVzb2x2ZSBjb252ZXJzYXRpb25cIlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMucmVzb2x2ZVVucmVzb2x2ZVRocmVhZCh0aHJlYWQpfT5cbiAgICAgICAgICBVbnJlc29sdmUgY29udmVyc2F0aW9uXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctcmVzb2x2ZUJ1dHRvbiBidG4gaWNvbiBpY29uLWNoZWNrXCJcbiAgICAgICAgICB0aXRsZT1cIlJlc29sdmUgY29udmVyc2F0aW9uXCJcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLnJlc29sdmVVbnJlc29sdmVUaHJlYWQodGhyZWFkKX0+XG4gICAgICAgICAgUmVzb2x2ZSBjb252ZXJzYXRpb25cbiAgICAgICAgPC9idXR0b24+XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlckVkaXRlZExpbmsoZW50aXR5KSB7XG4gICAgaWYgKCFlbnRpdHkubGFzdEVkaXRlZEF0KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1lZGl0ZWRcIj5cbiAgICAgICAgJm5ic3A74oCiJm5ic3A7XG4gICAgICAgICAgPGEgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1lZGl0ZWRcIiBocmVmPXtlbnRpdHkudXJsfT5lZGl0ZWQ8L2E+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyQXV0aG9yQXNzb2NpYXRpb24oZW50aXR5KSB7XG4gICAgY29uc3QgdGV4dCA9IGF1dGhvckFzc29jaWF0aW9uVGV4dFtlbnRpdHkuYXV0aG9yQXNzb2NpYXRpb25dO1xuICAgIGlmICghdGV4dCkgeyByZXR1cm4gbnVsbDsgfVxuICAgIHJldHVybiAoXG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LWF1dGhvckFzc29jaWF0aW9uQmFkZ2UgYmFkZ2VcIj57dGV4dH08L3NwYW4+XG4gICAgKTtcbiAgfVxuXG4gIG9wZW5GaWxlID0gZXZ0ID0+IHtcbiAgICBpZiAoIXRoaXMucHJvcHMuY2hlY2tvdXRPcC5pc0VuYWJsZWQoKSkge1xuICAgICAgY29uc3QgdGFyZ2V0ID0gZXZ0LmN1cnJlbnRUYXJnZXQ7XG4gICAgICB0aGlzLnByb3BzLm9wZW5GaWxlKHRhcmdldC5kYXRhc2V0LnBhdGgsIHRhcmdldC5kYXRhc2V0LmxpbmUpO1xuICAgIH1cbiAgfVxuXG4gIG9wZW5EaWZmID0gZXZ0ID0+IHtcbiAgICBjb25zdCB0YXJnZXQgPSBldnQuY3VycmVudFRhcmdldDtcbiAgICB0aGlzLnByb3BzLm9wZW5EaWZmKHRhcmdldC5kYXRhc2V0LnBhdGgsIHBhcnNlSW50KHRhcmdldC5kYXRhc2V0LmxpbmUsIDEwKSk7XG4gIH1cblxuICBvcGVuSXNzdWVpc2hMaW5rSW5OZXdUYWIgPSBldnQgPT4ge1xuICAgIGNvbnN0IHtyZXBvT3duZXIsIHJlcG9OYW1lLCBpc3N1ZWlzaE51bWJlcn0gPSBnZXREYXRhRnJvbUdpdGh1YlVybChldnQudGFyZ2V0LmRhdGFzZXQudXJsKTtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5vcGVuSXNzdWVpc2gocmVwb093bmVyLCByZXBvTmFtZSwgaXNzdWVpc2hOdW1iZXIpO1xuICB9XG5cbiAgc3VibWl0UmVwbHkocmVwbHlIb2xkZXIsIHRocmVhZCwgbGFzdENvbW1lbnQpIHtcbiAgICBjb25zdCBib2R5ID0gcmVwbHlIb2xkZXIubWFwKGVkaXRvciA9PiBlZGl0b3IuZ2V0VGV4dCgpKS5nZXRPcignJyk7XG4gICAgY29uc3QgZGlkU3VibWl0Q29tbWVudCA9ICgpID0+IHJlcGx5SG9sZGVyLm1hcChlZGl0b3IgPT4gZWRpdG9yLnNldFRleHQoJycsIHtieXBhc3NSZWFkT25seTogdHJ1ZX0pKTtcbiAgICBjb25zdCBkaWRGYWlsQ29tbWVudCA9ICgpID0+IHJlcGx5SG9sZGVyLm1hcChlZGl0b3IgPT4gZWRpdG9yLnNldFRleHQoYm9keSwge2J5cGFzc1JlYWRPbmx5OiB0cnVlfSkpO1xuXG4gICAgcmV0dXJuIHRoaXMucHJvcHMuYWRkU2luZ2xlQ29tbWVudChcbiAgICAgIGJvZHksIHRocmVhZC5pZCwgbGFzdENvbW1lbnQuaWQsIGxhc3RDb21tZW50LnBhdGgsIGxhc3RDb21tZW50LnBvc2l0aW9uLCB7ZGlkU3VibWl0Q29tbWVudCwgZGlkRmFpbENvbW1lbnR9LFxuICAgICk7XG4gIH1cblxuICBzdWJtaXRDdXJyZW50Q29tbWVudCA9IGV2dCA9PiB7XG4gICAgY29uc3QgdGhyZWFkSUQgPSBldnQuY3VycmVudFRhcmdldC5kYXRhc2V0LnRocmVhZElkO1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmICghdGhyZWFkSUQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHt0aHJlYWQsIGNvbW1lbnRzfSA9IHRoaXMucHJvcHMuY29tbWVudFRocmVhZHMuZmluZChlYWNoID0+IGVhY2gudGhyZWFkLmlkID09PSB0aHJlYWRJRCk7XG4gICAgY29uc3QgcmVwbHlIb2xkZXIgPSB0aGlzLnJlcGx5SG9sZGVycy5nZXQodGhyZWFkSUQpO1xuXG4gICAgcmV0dXJuIHRoaXMuc3VibWl0UmVwbHkocmVwbHlIb2xkZXIsIHRocmVhZCwgY29tbWVudHNbY29tbWVudHMubGVuZ3RoIC0gMV0pO1xuICB9XG5cbiAgZ2V0VHJhbnNsYXRlZFBvc2l0aW9uKHJvb3RDb21tZW50KSB7XG4gICAgbGV0IGxpbmVOdW1iZXIsIHBvc2l0aW9uVGV4dDtcbiAgICBjb25zdCB0cmFuc2xhdGlvbnMgPSB0aGlzLnByb3BzLmNvbW1lbnRUcmFuc2xhdGlvbnM7XG5cbiAgICBjb25zdCBpc0NoZWNrZWRPdXRQdWxsUmVxdWVzdCA9IHRoaXMucHJvcHMuY2hlY2tvdXRPcC53aHkoKSA9PT0gY2hlY2tvdXRTdGF0ZXMuQ1VSUkVOVDtcbiAgICBpZiAodHJhbnNsYXRpb25zID09PSBudWxsKSB7XG4gICAgICBsaW5lTnVtYmVyID0gbnVsbDtcbiAgICAgIHBvc2l0aW9uVGV4dCA9ICcnO1xuICAgIH0gZWxzZSBpZiAocm9vdENvbW1lbnQucG9zaXRpb24gPT09IG51bGwpIHtcbiAgICAgIGxpbmVOdW1iZXIgPSBudWxsO1xuICAgICAgcG9zaXRpb25UZXh0ID0gJ291dGRhdGVkJztcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgdHJhbnNsYXRpb25zRm9yRmlsZSA9IHRyYW5zbGF0aW9ucy5nZXQocGF0aC5ub3JtYWxpemUocm9vdENvbW1lbnQucGF0aCkpO1xuICAgICAgbGluZU51bWJlciA9IHRyYW5zbGF0aW9uc0ZvckZpbGUuZGlmZlRvRmlsZVBvc2l0aW9uLmdldChwYXJzZUludChyb290Q29tbWVudC5wb3NpdGlvbiwgMTApKTtcbiAgICAgIGlmICh0cmFuc2xhdGlvbnNGb3JGaWxlLmZpbGVUcmFuc2xhdGlvbnMgJiYgaXNDaGVja2VkT3V0UHVsbFJlcXVlc3QpIHtcbiAgICAgICAgbGluZU51bWJlciA9IHRyYW5zbGF0aW9uc0ZvckZpbGUuZmlsZVRyYW5zbGF0aW9ucy5nZXQobGluZU51bWJlcikubmV3UG9zaXRpb247XG4gICAgICB9XG4gICAgICBwb3NpdGlvblRleHQgPSBsaW5lTnVtYmVyO1xuICAgIH1cblxuICAgIHJldHVybiB7bGluZU51bWJlciwgcG9zaXRpb25UZXh0fTtcbiAgfVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIHNjcm9sbFRvVGhyZWFkKHRocmVhZElEKSB7XG4gICAgY29uc3QgdGhyZWFkSG9sZGVyID0gdGhpcy50aHJlYWRIb2xkZXJzLmdldCh0aHJlYWRJRCk7XG4gICAgaWYgKHRocmVhZEhvbGRlcikge1xuICAgICAgdGhyZWFkSG9sZGVyLm1hcChlbGVtZW50ID0+IHtcbiAgICAgICAgZWxlbWVudC5zY3JvbGxJbnRvVmlld0lmTmVlZGVkKCk7XG4gICAgICAgIHJldHVybiBudWxsOyAvLyBzaGgsIGVzbGludFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgcmVzb2x2ZVVucmVzb2x2ZVRocmVhZCh0aHJlYWQpIHtcbiAgICBpZiAodGhyZWFkLmlzUmVzb2x2ZWQpIHtcbiAgICAgIGF3YWl0IHRoaXMucHJvcHMudW5yZXNvbHZlVGhyZWFkKHRocmVhZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF3YWl0IHRoaXMucHJvcHMucmVzb2x2ZVRocmVhZCh0aHJlYWQpO1xuICAgIH1cbiAgfVxufVxuIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSxJQUFBQSxLQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBQyxNQUFBLEdBQUFDLHVCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBRyxVQUFBLEdBQUFKLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBSSxXQUFBLEdBQUFMLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBSyxTQUFBLEdBQUFMLE9BQUE7QUFFQSxJQUFBTSxXQUFBLEdBQUFOLE9BQUE7QUFDQSxJQUFBTyxRQUFBLEdBQUFSLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBUSxTQUFBLEdBQUFOLHVCQUFBLENBQUFGLE9BQUE7QUFDQSxJQUFBUyxlQUFBLEdBQUFWLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBVSxhQUFBLEdBQUFWLE9BQUE7QUFDQSxJQUFBVyx5QkFBQSxHQUFBWixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQVkscUJBQUEsR0FBQVosT0FBQTtBQUNBLElBQUFhLHFCQUFBLEdBQUFkLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBYyxpQkFBQSxHQUFBZixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQWUsa0JBQUEsR0FBQWhCLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBZ0IscUJBQUEsR0FBQWpCLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBaUIsZUFBQSxHQUFBbEIsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFrQixRQUFBLEdBQUFuQixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQW1CLFFBQUEsR0FBQXBCLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBb0IsVUFBQSxHQUFBckIsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFxQixRQUFBLEdBQUFyQixPQUFBO0FBQ0EsSUFBQXNCLGNBQUEsR0FBQXRCLE9BQUE7QUFBMkMsU0FBQXVCLHlCQUFBQyxDQUFBLDZCQUFBQyxPQUFBLG1CQUFBQyxDQUFBLE9BQUFELE9BQUEsSUFBQUUsQ0FBQSxPQUFBRixPQUFBLFlBQUFGLHdCQUFBLFlBQUFBLENBQUFDLENBQUEsV0FBQUEsQ0FBQSxHQUFBRyxDQUFBLEdBQUFELENBQUEsS0FBQUYsQ0FBQTtBQUFBLFNBQUF0Qix3QkFBQXNCLENBQUEsRUFBQUUsQ0FBQSxTQUFBQSxDQUFBLElBQUFGLENBQUEsSUFBQUEsQ0FBQSxDQUFBSSxVQUFBLFNBQUFKLENBQUEsZUFBQUEsQ0FBQSx1QkFBQUEsQ0FBQSx5QkFBQUEsQ0FBQSxXQUFBSyxPQUFBLEVBQUFMLENBQUEsUUFBQUcsQ0FBQSxHQUFBSix3QkFBQSxDQUFBRyxDQUFBLE9BQUFDLENBQUEsSUFBQUEsQ0FBQSxDQUFBRyxHQUFBLENBQUFOLENBQUEsVUFBQUcsQ0FBQSxDQUFBSSxHQUFBLENBQUFQLENBQUEsT0FBQVEsQ0FBQSxLQUFBQyxTQUFBLFVBQUFDLENBQUEsR0FBQUMsTUFBQSxDQUFBQyxjQUFBLElBQUFELE1BQUEsQ0FBQUUsd0JBQUEsV0FBQUMsQ0FBQSxJQUFBZCxDQUFBLG9CQUFBYyxDQUFBLElBQUFILE1BQUEsQ0FBQUksU0FBQSxDQUFBQyxjQUFBLENBQUFDLElBQUEsQ0FBQWpCLENBQUEsRUFBQWMsQ0FBQSxTQUFBSSxDQUFBLEdBQUFSLENBQUEsR0FBQUMsTUFBQSxDQUFBRSx3QkFBQSxDQUFBYixDQUFBLEVBQUFjLENBQUEsVUFBQUksQ0FBQSxLQUFBQSxDQUFBLENBQUFYLEdBQUEsSUFBQVcsQ0FBQSxDQUFBQyxHQUFBLElBQUFSLE1BQUEsQ0FBQUMsY0FBQSxDQUFBSixDQUFBLEVBQUFNLENBQUEsRUFBQUksQ0FBQSxJQUFBVixDQUFBLENBQUFNLENBQUEsSUFBQWQsQ0FBQSxDQUFBYyxDQUFBLFlBQUFOLENBQUEsQ0FBQUgsT0FBQSxHQUFBTCxDQUFBLEVBQUFHLENBQUEsSUFBQUEsQ0FBQSxDQUFBZ0IsR0FBQSxDQUFBbkIsQ0FBQSxFQUFBUSxDQUFBLEdBQUFBLENBQUE7QUFBQSxTQUFBakMsdUJBQUE2QyxHQUFBLFdBQUFBLEdBQUEsSUFBQUEsR0FBQSxDQUFBaEIsVUFBQSxHQUFBZ0IsR0FBQSxLQUFBZixPQUFBLEVBQUFlLEdBQUE7QUFBQSxTQUFBQyxnQkFBQUQsR0FBQSxFQUFBRSxHQUFBLEVBQUFDLEtBQUEsSUFBQUQsR0FBQSxHQUFBRSxjQUFBLENBQUFGLEdBQUEsT0FBQUEsR0FBQSxJQUFBRixHQUFBLElBQUFULE1BQUEsQ0FBQUMsY0FBQSxDQUFBUSxHQUFBLEVBQUFFLEdBQUEsSUFBQUMsS0FBQSxFQUFBQSxLQUFBLEVBQUFFLFVBQUEsUUFBQUMsWUFBQSxRQUFBQyxRQUFBLG9CQUFBUCxHQUFBLENBQUFFLEdBQUEsSUFBQUMsS0FBQSxXQUFBSCxHQUFBO0FBQUEsU0FBQUksZUFBQUksR0FBQSxRQUFBTixHQUFBLEdBQUFPLFlBQUEsQ0FBQUQsR0FBQSwyQkFBQU4sR0FBQSxnQkFBQUEsR0FBQSxHQUFBUSxNQUFBLENBQUFSLEdBQUE7QUFBQSxTQUFBTyxhQUFBRSxLQUFBLEVBQUFDLElBQUEsZUFBQUQsS0FBQSxpQkFBQUEsS0FBQSxrQkFBQUEsS0FBQSxNQUFBRSxJQUFBLEdBQUFGLEtBQUEsQ0FBQUcsTUFBQSxDQUFBQyxXQUFBLE9BQUFGLElBQUEsS0FBQUcsU0FBQSxRQUFBQyxHQUFBLEdBQUFKLElBQUEsQ0FBQWhCLElBQUEsQ0FBQWMsS0FBQSxFQUFBQyxJQUFBLDJCQUFBSyxHQUFBLHNCQUFBQSxHQUFBLFlBQUFDLFNBQUEsNERBQUFOLElBQUEsZ0JBQUFGLE1BQUEsR0FBQVMsTUFBQSxFQUFBUixLQUFBO0FBRTNDLE1BQU1TLHFCQUFxQixHQUFHO0VBQzVCQyxNQUFNLEVBQUUsUUFBUTtFQUNoQkMsS0FBSyxFQUFFLE9BQU87RUFDZEMsWUFBWSxFQUFFLGNBQWM7RUFDNUJDLFdBQVcsRUFBRSxhQUFhO0VBQzFCQyxzQkFBc0IsRUFBRSx3QkFBd0I7RUFDaERDLFdBQVcsRUFBRSxhQUFhO0VBQzFCQyxJQUFJLEVBQUU7QUFDUixDQUFDO0FBRWMsTUFBTUMsV0FBVyxTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQXVFdkRDLFdBQVdBLENBQUNDLEtBQUssRUFBRTtJQUNqQixLQUFLLENBQUNBLEtBQUssQ0FBQztJQUFDL0IsZUFBQSw4QkE2Rk8sTUFBTTtNQUMxQixJQUFBZ0MsdUJBQVEsRUFBQyxpQkFBaUIsRUFBRTtRQUFDQyxPQUFPLEVBQUUsUUFBUTtRQUFFQyxTQUFTLEVBQUUsSUFBSSxDQUFDSixXQUFXLENBQUNLO01BQUksQ0FBQyxDQUFDO0lBQ3BGLENBQUM7SUFBQW5DLGVBQUEsOEJBbURxQm9DLE1BQU0sSUFBSTtNQUM5QixNQUFNQyxXQUFXLEdBQUdDLElBQUksSUFBSTtRQUMxQixPQUFPO1VBQ0xDLFFBQVEsRUFBRTtZQUFDQyxJQUFJLEVBQUUsWUFBWTtZQUFFQyxJQUFJLEVBQUU7VUFBd0IsQ0FBQztVQUM5REMsU0FBUyxFQUFFO1lBQUNGLElBQUksRUFBRSxjQUFjO1lBQUVDLElBQUksRUFBRTtVQUFXLENBQUM7VUFDcERFLGlCQUFpQixFQUFFO1lBQUNILElBQUksRUFBRSxZQUFZO1lBQUVDLElBQUksRUFBRTtVQUFtQjtRQUNuRSxDQUFDLENBQUNILElBQUksQ0FBQyxJQUFJO1VBQUNFLElBQUksRUFBRSxFQUFFO1VBQUVDLElBQUksRUFBRTtRQUFFLENBQUM7TUFDakMsQ0FBQztNQUVELE1BQU07UUFBQ0QsSUFBSTtRQUFFQztNQUFJLENBQUMsR0FBR0osV0FBVyxDQUFDRCxNQUFNLENBQUNRLEtBQUssQ0FBQzs7TUFFOUM7TUFDQSxJQUFJUixNQUFNLENBQUNRLEtBQUssS0FBSyxTQUFTLElBQUtSLE1BQU0sQ0FBQ1EsS0FBSyxLQUFLLFdBQVcsSUFBSVIsTUFBTSxDQUFDUyxRQUFRLEtBQUssRUFBRyxFQUFFO1FBQzFGLE9BQU8sSUFBSTtNQUNiO01BRUEsTUFBTUMsTUFBTSxHQUFHVixNQUFNLENBQUNVLE1BQU0sSUFBSUMsbUJBQVU7TUFFMUMsT0FDRTNGLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQWdFLGFBQUE7UUFBS0MsU0FBUyxFQUFDLHNCQUFzQjtRQUFDaEQsR0FBRyxFQUFFbUMsTUFBTSxDQUFDYztNQUFHLEdBQ25EOUYsTUFBQSxDQUFBNEIsT0FBQSxDQUFBZ0UsYUFBQSxDQUFDN0UscUJBQUEsQ0FBQWEsT0FBb0I7UUFDbkJtRSxlQUFlLEVBQUVmLE1BQU87UUFDeEJnQixPQUFPLEVBQUUsSUFBSSxDQUFDckIsS0FBSyxDQUFDcUIsT0FBUTtRQUM1QkMsUUFBUSxFQUFFLElBQUksQ0FBQ3RCLEtBQUssQ0FBQ3NCLFFBQVM7UUFDOUJDLGNBQWMsRUFBRSxJQUFJLENBQUN2QixLQUFLLENBQUN3QixhQUFjO1FBQ3pDQyxNQUFNLEVBQUVDLGVBQWUsSUFBSTtVQUN6QixPQUNFckcsTUFBQSxDQUFBNEIsT0FBQSxDQUFBZ0UsYUFBQSxDQUFDNUYsTUFBQSxDQUFBc0csUUFBUSxRQUNQdEcsTUFBQSxDQUFBNEIsT0FBQSxDQUFBZ0UsYUFBQTtZQUFRQyxTQUFTLEVBQUM7VUFBc0IsR0FDdEM3RixNQUFBLENBQUE0QixPQUFBLENBQUFnRSxhQUFBO1lBQUtDLFNBQVMsRUFBQztVQUFpQyxHQUM5QzdGLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQWdFLGFBQUE7WUFBTUMsU0FBUyxFQUFHLGtDQUFpQ1QsSUFBSztVQUFFLENBQUUsQ0FBQyxFQUM3RHBGLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQWdFLGFBQUE7WUFBS0MsU0FBUyxFQUFDLDZCQUE2QjtZQUMxQ1UsR0FBRyxFQUFFYixNQUFNLENBQUNjLFNBQVU7WUFBQ0MsR0FBRyxFQUFFZixNQUFNLENBQUNnQjtVQUFNLENBQzFDLENBQUMsRUFDRjFHLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQWdFLGFBQUE7WUFBR0MsU0FBUyxFQUFDLCtCQUErQjtZQUFDYyxJQUFJLEVBQUVqQixNQUFNLENBQUNrQjtVQUFJLEdBQUVsQixNQUFNLENBQUNnQixLQUFTLENBQUMsRUFDakYxRyxNQUFBLENBQUE0QixPQUFBLENBQUFnRSxhQUFBO1lBQU1DLFNBQVMsRUFBQztVQUEyQixHQUFFUixJQUFXLENBQUMsRUFDeEQsSUFBSSxDQUFDd0IsZ0JBQWdCLENBQUM3QixNQUFNLENBQUMsRUFDN0IsSUFBSSxDQUFDOEIsdUJBQXVCLENBQUM5QixNQUFNLENBQ2pDLENBQUMsRUFDTmhGLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQWdFLGFBQUEsQ0FBQzFFLFFBQUEsQ0FBQVUsT0FBTztZQUFDaUUsU0FBUyxFQUFDLDhCQUE4QjtZQUFDa0IsSUFBSSxFQUFFL0IsTUFBTSxDQUFDZ0MsV0FBWTtZQUFDQyxZQUFZLEVBQUM7VUFBTyxDQUFFLENBQUMsRUFDbkdqSCxNQUFBLENBQUE0QixPQUFBLENBQUFnRSxhQUFBLENBQUMzRSxRQUFBLENBQUFXLE9BQU87WUFDTndELElBQUksRUFBQyxVQUFVO1lBQ2ZTLFNBQVMsRUFBQywyQkFBMkI7WUFDckNxQixPQUFPLEVBQUVDLEtBQUssSUFBSWQsZUFBZSxDQUFDYyxLQUFLLEVBQUVuQyxNQUFNLEVBQUVVLE1BQU07VUFBRSxDQUMxRCxDQUNLLENBQUMsRUFDVDFGLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQWdFLGFBQUE7WUFBTUMsU0FBUyxFQUFDO1VBQThCLEdBQzVDN0YsTUFBQSxDQUFBNEIsT0FBQSxDQUFBZ0UsYUFBQSxDQUFDaEYscUJBQUEsQ0FBQWdCLE9BQW9CO1lBQ25Cd0YsSUFBSSxFQUFFcEMsTUFBTSxDQUFDUyxRQUFTO1lBQ3RCNEIsZ0JBQWdCLEVBQUUsSUFBSSxDQUFDMUMsS0FBSyxDQUFDMkMsWUFBYTtZQUMxQ0Msd0JBQXdCLEVBQUUsSUFBSSxDQUFDQTtVQUF5QixDQUN6RCxDQUFDLEVBQ0Z2SCxNQUFBLENBQUE0QixPQUFBLENBQUFnRSxhQUFBLENBQUNsRix5QkFBQSxDQUFBa0IsT0FBd0I7WUFDdkI0RixTQUFTLEVBQUV4QyxNQUFPO1lBQ2xCeUMsUUFBUSxFQUFFLElBQUksQ0FBQzlDLEtBQUssQ0FBQzhDLFFBQVM7WUFDOUJDLGdCQUFnQixFQUFFLElBQUksQ0FBQy9DLEtBQUssQ0FBQytDO1VBQWlCLENBQy9DLENBQ0csQ0FDRSxDQUFDO1FBRWY7TUFBRSxDQUNILENBQ0UsQ0FBQztJQUVWLENBQUM7SUFBQTlFLGVBQUEsb0NBeUQyQitFLGFBQWEsSUFBSTtNQUMzQyxNQUFNO1FBQUNDLFFBQVE7UUFBRUM7TUFBTSxDQUFDLEdBQUdGLGFBQWE7TUFDeEMsTUFBTUcsV0FBVyxHQUFHRixRQUFRLENBQUMsQ0FBQyxDQUFDO01BQy9CLElBQUksQ0FBQ0UsV0FBVyxFQUFFO1FBQ2hCLE9BQU8sSUFBSTtNQUNiO01BRUEsSUFBSUMsWUFBWSxHQUFHLElBQUksQ0FBQ0MsYUFBYSxDQUFDbEcsR0FBRyxDQUFDK0YsTUFBTSxDQUFDL0IsRUFBRSxDQUFDO01BQ3BELElBQUksQ0FBQ2lDLFlBQVksRUFBRTtRQUNqQkEsWUFBWSxHQUFHLElBQUlFLGtCQUFTLENBQUMsQ0FBQztRQUM5QixJQUFJLENBQUNELGFBQWEsQ0FBQ3RGLEdBQUcsQ0FBQ21GLE1BQU0sQ0FBQy9CLEVBQUUsRUFBRWlDLFlBQVksQ0FBQztNQUNqRDtNQUVBLE1BQU1HLFVBQVUsR0FBRyxJQUFBQyx3QkFBZSxFQUFDTCxXQUFXLENBQUNNLElBQUksQ0FBQztNQUNwRCxNQUFNO1FBQUNDLEdBQUc7UUFBRUM7TUFBSSxDQUFDLEdBQUdGLGFBQUksQ0FBQ0csS0FBSyxDQUFDTCxVQUFVLENBQUM7TUFDMUMsTUFBTTtRQUFDTSxVQUFVO1FBQUVDO01BQVksQ0FBQyxHQUFHLElBQUksQ0FBQ0MscUJBQXFCLENBQUNaLFdBQVcsQ0FBQztNQUUxRSxNQUFNYSxtQkFBbUIsR0FBRyxJQUFJVixrQkFBUyxDQUFDLENBQUM7TUFDM0MsTUFBTVcsdUJBQXVCLEdBQUcsb0RBQW9EO01BRXBGLE1BQU1DLFNBQVMsR0FBSSxpQkFBZ0JoQixNQUFNLENBQUMvQixFQUFHLEVBQUM7TUFFOUMsTUFBTWdELGdCQUFnQixHQUFHLENBQUMseUJBQXlCLEVBQUUsTUFBTSxFQUFFO1FBQUNDLFFBQVEsRUFBRSxDQUFDUDtNQUFVLENBQUMsQ0FBQztNQUNyRixNQUFNUSxlQUFlLEdBQUcsSUFBQUMsbUJBQUUsRUFBQyxXQUFXLEVBQUUsR0FBR0gsZ0JBQWdCLENBQUM7TUFDNUQsTUFBTUksZUFBZSxHQUFHLElBQUFELG1CQUFFLEVBQUMsV0FBVyxFQUFFLEdBQUdILGdCQUFnQixDQUFDO01BRTVELE1BQU1LLE1BQU0sR0FBRyxJQUFJLENBQUN4RSxLQUFLLENBQUN5RSxhQUFhLENBQUN2SCxHQUFHLENBQUNnRyxNQUFNLENBQUMvQixFQUFFLENBQUM7TUFDdEQsTUFBTXVELGFBQWEsR0FBRyxJQUFJLENBQUMxRSxLQUFLLENBQUMyRSxvQkFBb0IsQ0FBQ3pILEdBQUcsQ0FBQ2dHLE1BQU0sQ0FBQy9CLEVBQUUsQ0FBQztNQUNwRSxNQUFNeUQsTUFBTSxHQUFHQyxHQUFHLElBQUk7UUFDcEJBLEdBQUcsQ0FBQ0MsY0FBYyxDQUFDLENBQUM7UUFDcEJELEdBQUcsQ0FBQ0UsZUFBZSxDQUFDLENBQUM7UUFFckIsSUFBSVAsTUFBTSxFQUFFO1VBQ1YsSUFBSSxDQUFDeEUsS0FBSyxDQUFDZ0YsWUFBWSxDQUFDOUIsTUFBTSxDQUFDL0IsRUFBRSxDQUFDO1FBQ3BDLENBQUMsTUFBTTtVQUNMLElBQUksQ0FBQ25CLEtBQUssQ0FBQ2lGLFlBQVksQ0FBQy9CLE1BQU0sQ0FBQy9CLEVBQUUsQ0FBQztRQUNwQztNQUNGLENBQUM7TUFFRCxNQUFNSixNQUFNLEdBQUdvQyxXQUFXLENBQUNwQyxNQUFNLElBQUlDLG1CQUFVO01BRS9DLE9BQ0UzRixNQUFBLENBQUE0QixPQUFBLENBQUFnRSxhQUFBO1FBQ0VpRSxHQUFHLEVBQUU5QixZQUFZLENBQUMrQixNQUFPO1FBQ3pCakUsU0FBUyxFQUFFLElBQUFvRCxtQkFBRSxFQUFDLGVBQWUsRUFBRTtVQUFDLFVBQVUsRUFBRXBCLE1BQU0sQ0FBQ2tDLFVBQVU7VUFBRSwwQkFBMEIsRUFBRVY7UUFBYSxDQUFDLENBQUU7UUFDM0d4RyxHQUFHLEVBQUVnRyxTQUFVO1FBQ2YvQyxFQUFFLEVBQUUrQyxTQUFVO1FBQ2RtQixJQUFJLEVBQUViO01BQU8sR0FFYm5KLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQWdFLGFBQUE7UUFBU0MsU0FBUyxFQUFDLHlCQUF5QjtRQUFDcUIsT0FBTyxFQUFFcUM7TUFBTyxHQUMxRGxCLEdBQUcsSUFBSXJJLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQWdFLGFBQUE7UUFBTUMsU0FBUyxFQUFDO01BQW9CLEdBQUV3QyxHQUFVLENBQUMsRUFDekRySSxNQUFBLENBQUE0QixPQUFBLENBQUFnRSxhQUFBO1FBQU1DLFNBQVMsRUFBQztNQUFvQixHQUFFd0MsR0FBRyxHQUFHRCxhQUFJLENBQUM2QixHQUFHLEdBQUcsRUFBRSxFQUFFM0IsSUFBVyxDQUFDLEVBQ3ZFdEksTUFBQSxDQUFBNEIsT0FBQSxDQUFBZ0UsYUFBQTtRQUFNQyxTQUFTLEVBQUM7TUFBc0IsR0FBRTRDLFlBQW1CLENBQUMsRUFDNUR6SSxNQUFBLENBQUE0QixPQUFBLENBQUFnRSxhQUFBO1FBQUtDLFNBQVMsRUFBQywrQkFBK0I7UUFDNUNVLEdBQUcsRUFBRWIsTUFBTSxDQUFDYyxTQUFVO1FBQUNDLEdBQUcsRUFBRWYsTUFBTSxDQUFDZ0I7TUFBTSxDQUMxQyxDQUFDLEVBQ0YxRyxNQUFBLENBQUE0QixPQUFBLENBQUFnRSxhQUFBLENBQUMxRSxRQUFBLENBQUFVLE9BQU87UUFBQ2lFLFNBQVMsRUFBQyxnQ0FBZ0M7UUFBQ2tCLElBQUksRUFBRWUsV0FBVyxDQUFDb0MsU0FBVTtRQUFDakQsWUFBWSxFQUFDO01BQU8sQ0FBRSxDQUNoRyxDQUFDLEVBQ1ZqSCxNQUFBLENBQUE0QixPQUFBLENBQUFnRSxhQUFBO1FBQUtDLFNBQVMsRUFBQztNQUFtQixHQUNoQzdGLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQWdFLGFBQUE7UUFBUUMsU0FBUyxFQUFFbUQsZUFBZ0I7UUFDakMsYUFBV2QsVUFBVztRQUFDLGFBQVdNLFVBQVc7UUFDN0N0QixPQUFPLEVBQUUsSUFBSSxDQUFDaUQsUUFBUztRQUFDQyxRQUFRLEVBQUUsSUFBSSxDQUFDekYsS0FBSyxDQUFDMEYsVUFBVSxDQUFDQyxTQUFTLENBQUMsQ0FBRTtRQUNwRVQsR0FBRyxFQUFFbEIsbUJBQW1CLENBQUNtQjtNQUFPLGlCQUUxQixDQUFDLEVBQ1Q5SixNQUFBLENBQUE0QixPQUFBLENBQUFnRSxhQUFBO1FBQVFDLFNBQVMsRUFBRXFELGVBQWdCO1FBQ2pDLGFBQVdoQixVQUFXO1FBQUMsYUFBV0osV0FBVyxDQUFDeUMsUUFBUztRQUN2RHJELE9BQU8sRUFBRSxJQUFJLENBQUNzRDtNQUFTLGNBRWpCLENBQUMsRUFDUixJQUFJLENBQUM3RixLQUFLLENBQUMwRixVQUFVLENBQUNDLFNBQVMsQ0FBQyxDQUFDLElBQ2hDdEssTUFBQSxDQUFBNEIsT0FBQSxDQUFBZ0UsYUFBQSxDQUFDdEYsUUFBQSxDQUFBc0IsT0FBTztRQUNONkksT0FBTyxFQUFFLElBQUksQ0FBQzlGLEtBQUssQ0FBQzhDLFFBQVM7UUFDN0JpRCxNQUFNLEVBQUUvQixtQkFBb0I7UUFDNUJnQyxLQUFLLEVBQUUvQix1QkFBd0I7UUFDL0JnQyxTQUFTLEVBQUU7TUFBSSxDQUNoQixDQUVBLENBQUMsRUFFTDlDLFdBQVcsQ0FBQ3lDLFFBQVEsS0FBSyxJQUFJLElBQzVCdkssTUFBQSxDQUFBNEIsT0FBQSxDQUFBZ0UsYUFBQSxDQUFDL0UsaUJBQUEsQ0FBQWUsT0FBZ0I7UUFDZmlKLGNBQWMsRUFBRSxJQUFJLENBQUNsRyxLQUFLLENBQUNrRyxjQUFlO1FBQzFDQyxRQUFRLEVBQUU1QyxVQUFXO1FBQ3JCNkMsT0FBTyxFQUFFakQsV0FBVyxDQUFDeUMsUUFBUztRQUM5QlMsV0FBVyxFQUFFLElBQUksQ0FBQ3JHLEtBQUssQ0FBQ3NHLFlBQWE7UUFDckNDLE1BQU0sRUFBRSxJQUFJLENBQUN2RyxLQUFLLENBQUN1RztNQUFPLENBQzNCLENBQ0YsRUFFQSxJQUFJLENBQUNDLFlBQVksQ0FBQztRQUFDdEQsTUFBTTtRQUFFRDtNQUFRLENBQUMsQ0FFOUIsQ0FBQztJQUVkLENBQUM7SUFBQWhGLGVBQUEsdUJBRWMsQ0FBQztNQUFDaUYsTUFBTTtNQUFFRDtJQUFRLENBQUMsS0FBSztNQUNyQyxJQUFJd0QsV0FBVyxHQUFHLElBQUksQ0FBQ0MsWUFBWSxDQUFDdkosR0FBRyxDQUFDK0YsTUFBTSxDQUFDL0IsRUFBRSxDQUFDO01BQ2xELElBQUksQ0FBQ3NGLFdBQVcsRUFBRTtRQUNoQkEsV0FBVyxHQUFHLElBQUluRCxrQkFBUyxDQUFDLENBQUM7UUFDN0IsSUFBSSxDQUFDb0QsWUFBWSxDQUFDM0ksR0FBRyxDQUFDbUYsTUFBTSxDQUFDL0IsRUFBRSxFQUFFc0YsV0FBVyxDQUFDO01BQy9DO01BRUEsTUFBTUUsV0FBVyxHQUFHMUQsUUFBUSxDQUFDQSxRQUFRLENBQUMyRCxNQUFNLEdBQUcsQ0FBQyxDQUFDO01BQ2pELE1BQU1DLFNBQVMsR0FBRyxJQUFJLENBQUM3RyxLQUFLLENBQUM4RyxpQkFBaUIsS0FBSyxJQUFJO01BRXZELE9BQ0V6TCxNQUFBLENBQUE0QixPQUFBLENBQUFnRSxhQUFBLENBQUM1RixNQUFBLENBQUFzRyxRQUFRLFFBQ1B0RyxNQUFBLENBQUE0QixPQUFBLENBQUFnRSxhQUFBO1FBQU1DLFNBQVMsRUFBQztNQUF3QixHQUVyQytCLFFBQVEsQ0FBQzhELEdBQUcsQ0FBQ0MsT0FBTyxJQUFJO1FBQ3ZCLE9BQ0UzTCxNQUFBLENBQUE0QixPQUFBLENBQUFnRSxhQUFBLENBQUM5RSxrQkFBQSxDQUFBYyxPQUFpQjtVQUNoQmlCLEdBQUcsRUFBRThJLE9BQU8sQ0FBQzdGLEVBQUc7VUFDaEI2RixPQUFPLEVBQUVBLE9BQVE7VUFDakJyRSxZQUFZLEVBQUUsSUFBSSxDQUFDM0MsS0FBSyxDQUFDMkMsWUFBYTtVQUN0Q0Msd0JBQXdCLEVBQUUsSUFBSSxDQUFDQSx3QkFBeUI7VUFDeERFLFFBQVEsRUFBRSxJQUFJLENBQUM5QyxLQUFLLENBQUM4QyxRQUFTO1VBQzlCQyxnQkFBZ0IsRUFBRSxJQUFJLENBQUMvQyxLQUFLLENBQUMrQyxnQkFBaUI7VUFDOUNiLGdCQUFnQixFQUFFLElBQUksQ0FBQ0EsZ0JBQWlCO1VBQ3hDQyx1QkFBdUIsRUFBRSxJQUFJLENBQUNBLHVCQUF3QjtVQUN0RDBFLFNBQVMsRUFBRUEsU0FBVTtVQUNyQnhGLE9BQU8sRUFBRSxJQUFJLENBQUNyQixLQUFLLENBQUNxQixPQUFRO1VBQzVCQyxRQUFRLEVBQUUsSUFBSSxDQUFDdEIsS0FBSyxDQUFDc0IsUUFBUztVQUM5QjJGLGFBQWEsRUFBRSxJQUFJLENBQUNqSCxLQUFLLENBQUNpSDtRQUFjLENBQ3pDLENBQUM7TUFFTixDQUFDLENBQUMsRUFFRjVMLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQWdFLGFBQUE7UUFDRUMsU0FBUyxFQUFFLElBQUFvRCxtQkFBRSxFQUFDLHFCQUFxQixFQUFFO1VBQUMsK0JBQStCLEVBQUV1QztRQUFTLENBQUMsQ0FBRTtRQUNuRixrQkFBZ0IzRCxNQUFNLENBQUMvQjtNQUFHLEdBRTFCOUYsTUFBQSxDQUFBNEIsT0FBQSxDQUFBZ0UsYUFBQSxDQUFDcEYsZUFBQSxDQUFBb0IsT0FBYztRQUNiaUssZUFBZSxFQUFDLFVBQVU7UUFDMUJDLHVCQUF1QixFQUFFLEtBQU07UUFDL0JDLFdBQVcsRUFBRSxJQUFLO1FBQ2xCQyxVQUFVLEVBQUUsSUFBSztRQUNqQkMsUUFBUSxFQUFFVCxTQUFVO1FBQ3BCVSxRQUFRLEVBQUVkO01BQVksQ0FDdkIsQ0FFRSxDQUNELENBQUMsRUFDTnZELE1BQU0sQ0FBQ2tDLFVBQVUsSUFBSS9KLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQWdFLGFBQUE7UUFBS0MsU0FBUyxFQUFDO01BQTRCLG9EQUNqQmdDLE1BQU0sQ0FBQ3NFLFVBQVUsQ0FBQ3pGLEtBQzdELENBQUMsRUFDTjFHLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQWdFLGFBQUE7UUFBUUMsU0FBUyxFQUFDO01BQXNCLEdBQ3RDN0YsTUFBQSxDQUFBNEIsT0FBQSxDQUFBZ0UsYUFBQTtRQUNFQyxTQUFTLEVBQUMsMkNBQTJDO1FBQ3JEOEUsS0FBSyxFQUFDLGtCQUFrQjtRQUN4QlAsUUFBUSxFQUFFb0IsU0FBVTtRQUNwQnRFLE9BQU8sRUFBRUEsQ0FBQSxLQUFNLElBQUksQ0FBQ2tGLFdBQVcsQ0FBQ2hCLFdBQVcsRUFBRXZELE1BQU0sRUFBRXlELFdBQVc7TUFBRSxZQUU1RCxDQUFDLEVBQ1IsSUFBSSxDQUFDZSxtQkFBbUIsQ0FBQ3hFLE1BQU0sQ0FDMUIsQ0FDQSxDQUFDO0lBRWYsQ0FBQztJQUFBakYsZUFBQSw4QkFFcUJpRixNQUFNLElBQUk7TUFDOUIsSUFBSUEsTUFBTSxDQUFDa0MsVUFBVSxFQUFFO1FBQ3JCLE9BQ0UvSixNQUFBLENBQUE0QixPQUFBLENBQUFnRSxhQUFBO1VBQ0VDLFNBQVMsRUFBQyxpREFBaUQ7VUFDM0Q4RSxLQUFLLEVBQUMsd0JBQXdCO1VBQzlCekQsT0FBTyxFQUFFQSxDQUFBLEtBQU0sSUFBSSxDQUFDb0Ysc0JBQXNCLENBQUN6RSxNQUFNO1FBQUUsMkJBRTdDLENBQUM7TUFFYixDQUFDLE1BQU07UUFDTCxPQUNFN0gsTUFBQSxDQUFBNEIsT0FBQSxDQUFBZ0UsYUFBQTtVQUNFQyxTQUFTLEVBQUMsaURBQWlEO1VBQzNEOEUsS0FBSyxFQUFDLHNCQUFzQjtVQUM1QnpELE9BQU8sRUFBRUEsQ0FBQSxLQUFNLElBQUksQ0FBQ29GLHNCQUFzQixDQUFDekUsTUFBTTtRQUFFLHlCQUU3QyxDQUFDO01BRWI7SUFDRixDQUFDO0lBQUFqRixlQUFBLG1CQXVCVTRHLEdBQUcsSUFBSTtNQUNoQixJQUFJLENBQUMsSUFBSSxDQUFDN0UsS0FBSyxDQUFDMEYsVUFBVSxDQUFDQyxTQUFTLENBQUMsQ0FBQyxFQUFFO1FBQ3RDLE1BQU1JLE1BQU0sR0FBR2xCLEdBQUcsQ0FBQytDLGFBQWE7UUFDaEMsSUFBSSxDQUFDNUgsS0FBSyxDQUFDd0YsUUFBUSxDQUFDTyxNQUFNLENBQUM4QixPQUFPLENBQUNwRSxJQUFJLEVBQUVzQyxNQUFNLENBQUM4QixPQUFPLENBQUNDLElBQUksQ0FBQztNQUMvRDtJQUNGLENBQUM7SUFBQTdKLGVBQUEsbUJBRVU0RyxHQUFHLElBQUk7TUFDaEIsTUFBTWtCLE1BQU0sR0FBR2xCLEdBQUcsQ0FBQytDLGFBQWE7TUFDaEMsSUFBSSxDQUFDNUgsS0FBSyxDQUFDNkYsUUFBUSxDQUFDRSxNQUFNLENBQUM4QixPQUFPLENBQUNwRSxJQUFJLEVBQUVzRSxRQUFRLENBQUNoQyxNQUFNLENBQUM4QixPQUFPLENBQUNDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQztJQUM3RSxDQUFDO0lBQUE3SixlQUFBLG1DQUUwQjRHLEdBQUcsSUFBSTtNQUNoQyxNQUFNO1FBQUNtRCxTQUFTO1FBQUVDLFFBQVE7UUFBRUM7TUFBYyxDQUFDLEdBQUcsSUFBQUMsa0NBQW9CLEVBQUN0RCxHQUFHLENBQUNrQixNQUFNLENBQUM4QixPQUFPLENBQUM1RixHQUFHLENBQUM7TUFDMUYsT0FBTyxJQUFJLENBQUNqQyxLQUFLLENBQUMyQyxZQUFZLENBQUNxRixTQUFTLEVBQUVDLFFBQVEsRUFBRUMsY0FBYyxDQUFDO0lBQ3JFLENBQUM7SUFBQWpLLGVBQUEsK0JBWXNCNEcsR0FBRyxJQUFJO01BQzVCLE1BQU11RCxRQUFRLEdBQUd2RCxHQUFHLENBQUMrQyxhQUFhLENBQUNDLE9BQU8sQ0FBQ1EsUUFBUTtNQUNuRDtNQUNBLElBQUksQ0FBQ0QsUUFBUSxFQUFFO1FBQ2IsT0FBTyxJQUFJO01BQ2I7TUFFQSxNQUFNO1FBQUNsRixNQUFNO1FBQUVEO01BQVEsQ0FBQyxHQUFHLElBQUksQ0FBQ2pELEtBQUssQ0FBQ3NJLGNBQWMsQ0FBQ0MsSUFBSSxDQUFDQyxJQUFJLElBQUlBLElBQUksQ0FBQ3RGLE1BQU0sQ0FBQy9CLEVBQUUsS0FBS2lILFFBQVEsQ0FBQztNQUM5RixNQUFNM0IsV0FBVyxHQUFHLElBQUksQ0FBQ0MsWUFBWSxDQUFDdkosR0FBRyxDQUFDaUwsUUFBUSxDQUFDO01BRW5ELE9BQU8sSUFBSSxDQUFDWCxXQUFXLENBQUNoQixXQUFXLEVBQUV2RCxNQUFNLEVBQUVELFFBQVEsQ0FBQ0EsUUFBUSxDQUFDMkQsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO0lBQzdFLENBQUM7SUEzZkMsSUFBSSxDQUFDNkIsVUFBVSxHQUFHLElBQUluRixrQkFBUyxDQUFDLENBQUM7SUFDakMsSUFBSSxDQUFDb0QsWUFBWSxHQUFHLElBQUlnQyxHQUFHLENBQUMsQ0FBQztJQUM3QixJQUFJLENBQUNyRixhQUFhLEdBQUcsSUFBSXFGLEdBQUcsQ0FBQyxDQUFDO0lBQzlCLElBQUksQ0FBQzdILEtBQUssR0FBRztNQUNYOEgsWUFBWSxFQUFFO0lBQ2hCLENBQUM7SUFDRCxJQUFJLENBQUNDLElBQUksR0FBRyxJQUFJQyw2QkFBbUIsQ0FBQyxDQUFDO0VBQ3ZDO0VBRUFDLGlCQUFpQkEsQ0FBQSxFQUFHO0lBQ2xCLE1BQU07TUFBQ0M7SUFBZ0IsQ0FBQyxHQUFHLElBQUksQ0FBQy9JLEtBQUs7SUFDckMsSUFBSStJLGdCQUFnQixFQUFFO01BQ3BCLElBQUksQ0FBQ0MsY0FBYyxDQUFDRCxnQkFBZ0IsQ0FBQztJQUN2QztFQUNGO0VBRUFFLGtCQUFrQkEsQ0FBQ0MsU0FBUyxFQUFFO0lBQzVCLE1BQU07TUFBQ0g7SUFBZ0IsQ0FBQyxHQUFHLElBQUksQ0FBQy9JLEtBQUs7SUFDckMsSUFBSStJLGdCQUFnQixJQUFJQSxnQkFBZ0IsS0FBS0csU0FBUyxDQUFDSCxnQkFBZ0IsRUFBRTtNQUN2RSxJQUFJLENBQUNDLGNBQWMsQ0FBQ0QsZ0JBQWdCLENBQUM7SUFDdkM7RUFDRjtFQUVBSSxvQkFBb0JBLENBQUEsRUFBRztJQUNyQixJQUFJLENBQUNQLElBQUksQ0FBQ1EsT0FBTyxDQUFDLENBQUM7RUFDckI7RUFFQTNILE1BQU1BLENBQUEsRUFBRztJQUNQLE9BQ0VwRyxNQUFBLENBQUE0QixPQUFBLENBQUFnRSxhQUFBO01BQUtDLFNBQVMsRUFBQyxnQkFBZ0I7TUFBQ2dFLEdBQUcsRUFBRSxJQUFJLENBQUN1RCxVQUFVLENBQUN0RDtJQUFPLEdBQ3pELElBQUksQ0FBQ2tFLGNBQWMsQ0FBQyxDQUFDLEVBQ3JCLElBQUksQ0FBQ0MsWUFBWSxDQUFDLENBQUMsRUFDcEJqTyxNQUFBLENBQUE0QixPQUFBLENBQUFnRSxhQUFBO01BQUtDLFNBQVMsRUFBQztJQUFxQixHQUNqQyxJQUFJLENBQUNxSSxxQkFBcUIsQ0FBQyxDQUFDLEVBQzVCLElBQUksQ0FBQ0MsMEJBQTBCLENBQUMsQ0FDOUIsQ0FDRixDQUFDO0VBRVY7RUFFQUgsY0FBY0EsQ0FBQSxFQUFHO0lBQ2YsT0FDRWhPLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQWdFLGFBQUEsQ0FBQzVGLE1BQUEsQ0FBQXNHLFFBQVEsUUFDUHRHLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQWdFLGFBQUEsQ0FBQ3JGLFNBQUEsQ0FBQXFCLE9BQVE7TUFBQ3dNLFFBQVEsRUFBRSxJQUFJLENBQUN6SixLQUFLLENBQUNzQixRQUFTO01BQUN5RSxNQUFNLEVBQUUsSUFBSSxDQUFDMEM7SUFBVyxHQUMvRHBOLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQWdFLGFBQUEsQ0FBQ3JGLFNBQUEsQ0FBQThOLE9BQU87TUFBQ0MsT0FBTyxFQUFDLHFCQUFxQjtNQUFDQyxRQUFRLEVBQUUsSUFBSSxDQUFDNUosS0FBSyxDQUFDNko7SUFBWSxDQUFFLENBQUMsRUFDM0V4TyxNQUFBLENBQUE0QixPQUFBLENBQUFnRSxhQUFBLENBQUNyRixTQUFBLENBQUE4TixPQUFPO01BQUNDLE9BQU8sRUFBQyxxQkFBcUI7TUFBQ0MsUUFBUSxFQUFFLElBQUksQ0FBQzVKLEtBQUssQ0FBQzhKO0lBQVksQ0FBRSxDQUNsRSxDQUFDLEVBQ1h6TyxNQUFBLENBQUE0QixPQUFBLENBQUFnRSxhQUFBLENBQUNyRixTQUFBLENBQUFxQixPQUFRO01BQUN3TSxRQUFRLEVBQUUsSUFBSSxDQUFDekosS0FBSyxDQUFDc0IsUUFBUztNQUFDeUUsTUFBTSxFQUFDO0lBQXNCLEdBQ3BFMUssTUFBQSxDQUFBNEIsT0FBQSxDQUFBZ0UsYUFBQSxDQUFDckYsU0FBQSxDQUFBOE4sT0FBTztNQUFDQyxPQUFPLEVBQUMsdUJBQXVCO01BQUNDLFFBQVEsRUFBRSxJQUFJLENBQUNHO0lBQXFCLENBQUUsQ0FDdkUsQ0FDRixDQUFDO0VBRWY7RUFFQVQsWUFBWUEsQ0FBQSxFQUFHO0lBQ2IsTUFBTVUsT0FBTyxHQUFHQSxDQUFBLEtBQU07TUFDcEIsSUFBSSxJQUFJLENBQUNuSixLQUFLLENBQUM4SCxZQUFZLEVBQUU7UUFDM0I7TUFDRjtNQUNBLElBQUksQ0FBQ3NCLFFBQVEsQ0FBQztRQUFDdEIsWUFBWSxFQUFFO01BQUksQ0FBQyxDQUFDO01BQ25DLE1BQU11QixHQUFHLEdBQUcsSUFBSSxDQUFDbEssS0FBSyxDQUFDbUssT0FBTyxDQUFDLE1BQU07UUFDbkMsSUFBSSxDQUFDdkIsSUFBSSxDQUFDd0IsTUFBTSxDQUFDRixHQUFHLENBQUM7UUFDckIsSUFBSSxDQUFDRCxRQUFRLENBQUM7VUFBQ3RCLFlBQVksRUFBRTtRQUFLLENBQUMsQ0FBQztNQUN0QyxDQUFDLENBQUM7TUFDRixJQUFJLENBQUNDLElBQUksQ0FBQ3lCLEdBQUcsQ0FBQ0gsR0FBRyxDQUFDO0lBQ3BCLENBQUM7SUFDRCxPQUNFN08sTUFBQSxDQUFBNEIsT0FBQSxDQUFBZ0UsYUFBQTtNQUFRQyxTQUFTLEVBQUM7SUFBMEIsR0FDMUM3RixNQUFBLENBQUE0QixPQUFBLENBQUFnRSxhQUFBO01BQU1DLFNBQVMsRUFBQztJQUE4QixDQUFFLENBQUMsRUFDakQ3RixNQUFBLENBQUE0QixPQUFBLENBQUFnRSxhQUFBO01BQU1DLFNBQVMsRUFBQztJQUE0QixzQkFFMUM3RixNQUFBLENBQUE0QixPQUFBLENBQUFnRSxhQUFBO01BQU1DLFNBQVMsRUFBQywwQkFBMEI7TUFBQ3FCLE9BQU8sRUFBRSxJQUFJLENBQUN2QyxLQUFLLENBQUNzSztJQUFPLEdBQ25FLElBQUksQ0FBQ3RLLEtBQUssQ0FBQ3VLLEtBQUssT0FBRyxJQUFJLENBQUN2SyxLQUFLLENBQUN3SyxJQUFJLE9BQUcsSUFBSSxDQUFDeEssS0FBSyxDQUFDeUssTUFDN0MsQ0FDRixDQUFDLEVBQ1BwUCxNQUFBLENBQUE0QixPQUFBLENBQUFnRSxhQUFBO01BQ0VDLFNBQVMsRUFBRSxJQUFBb0QsbUJBQUUsRUFDWCwwRUFBMEUsRUFDMUU7UUFBQ29HLFVBQVUsRUFBRSxJQUFJLENBQUM3SixLQUFLLENBQUM4SDtNQUFZLENBQ3RDLENBQUU7TUFDRnBHLE9BQU8sRUFBRXlIO0lBQVEsQ0FDbEIsQ0FBQyxFQUNGM08sTUFBQSxDQUFBNEIsT0FBQSxDQUFBZ0UsYUFBQSxDQUFDNUUsZUFBQSxDQUFBWSxPQUFjO01BQ2J5SSxVQUFVLEVBQUUsSUFBSSxDQUFDMUYsS0FBSyxDQUFDMEYsVUFBVztNQUNsQ2lGLGVBQWUsRUFBQyxpQ0FBaUM7TUFDakRDLFVBQVUsRUFBRSxDQUFDLDZCQUE2QjtJQUFFLENBQzdDLENBQ0ssQ0FBQztFQUViO0VBTUFDLGdCQUFnQkEsQ0FBQSxFQUFHO0lBQ2pCLE1BQU07TUFBQ0osTUFBTTtNQUFFRCxJQUFJO01BQUVEO0lBQUssQ0FBQyxHQUFHLElBQUksQ0FBQ3ZLLEtBQUs7SUFDeEM7SUFDQSxNQUFNOEssY0FBYyxHQUFJLDBCQUF5QlAsS0FBTSxJQUFHQyxJQUFLLFNBQVFDLE1BQU8sU0FBUTtJQUN0RixPQUNFcFAsTUFBQSxDQUFBNEIsT0FBQSxDQUFBZ0UsYUFBQTtNQUFLQyxTQUFTLEVBQUM7SUFBMkIsR0FDeEM3RixNQUFBLENBQUE0QixPQUFBLENBQUFnRSxhQUFBO01BQUtXLEdBQUcsRUFBQyw0QkFBNEI7TUFBQ0UsR0FBRyxFQUFDLCtCQUErQjtNQUFDWixTQUFTLEVBQUM7SUFBeUIsQ0FBRSxDQUFDLEVBQ2hIN0YsTUFBQSxDQUFBNEIsT0FBQSxDQUFBZ0UsYUFBQTtNQUFLQyxTQUFTLEVBQUM7SUFBMEIscUNBRXBDLENBQUMsRUFDTjdGLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQWdFLGFBQUE7TUFBUUMsU0FBUyxFQUFDO0lBQTRDLEdBQzVEN0YsTUFBQSxDQUFBNEIsT0FBQSxDQUFBZ0UsYUFBQTtNQUFHZSxJQUFJLEVBQUU4SSxjQUFlO01BQUN2SSxPQUFPLEVBQUUsSUFBSSxDQUFDd0k7SUFBb0IsdUJBRXhELENBQ0csQ0FDTCxDQUFDO0VBRVY7RUFFQXhCLHFCQUFxQkEsQ0FBQSxFQUFHO0lBQ3RCLElBQUksSUFBSSxDQUFDdkosS0FBSyxDQUFDZ0wsU0FBUyxDQUFDcEUsTUFBTSxLQUFLLENBQUMsRUFBRTtNQUNyQyxPQUFPLElBQUksQ0FBQ2lFLGdCQUFnQixDQUFDLENBQUM7SUFDaEM7SUFFQSxNQUFNakcsTUFBTSxHQUFHQyxHQUFHLElBQUk7TUFDcEJBLEdBQUcsQ0FBQ0MsY0FBYyxDQUFDLENBQUM7TUFDcEIsSUFBSSxJQUFJLENBQUM5RSxLQUFLLENBQUNpTCxrQkFBa0IsRUFBRTtRQUNqQyxJQUFJLENBQUNqTCxLQUFLLENBQUNrTCxhQUFhLENBQUMsQ0FBQztNQUM1QixDQUFDLE1BQU07UUFDTCxJQUFJLENBQUNsTCxLQUFLLENBQUNtTCxhQUFhLENBQUMsQ0FBQztNQUM1QjtJQUNGLENBQUM7SUFFRCxPQUNFOVAsTUFBQSxDQUFBNEIsT0FBQSxDQUFBZ0UsYUFBQTtNQUNFQyxTQUFTLEVBQUMsa0NBQWtDO01BQzVDbUUsSUFBSSxFQUFFLElBQUksQ0FBQ3JGLEtBQUssQ0FBQ2lMO0lBQW1CLEdBRXBDNVAsTUFBQSxDQUFBNEIsT0FBQSxDQUFBZ0UsYUFBQTtNQUFTQyxTQUFTLEVBQUMsdUJBQXVCO01BQUNxQixPQUFPLEVBQUVxQztJQUFPLEdBQ3pEdkosTUFBQSxDQUFBNEIsT0FBQSxDQUFBZ0UsYUFBQTtNQUFNQyxTQUFTLEVBQUM7SUFBc0IsY0FBZ0IsQ0FDL0MsQ0FBQyxFQUNWN0YsTUFBQSxDQUFBNEIsT0FBQSxDQUFBZ0UsYUFBQTtNQUFNQyxTQUFTLEVBQUM7SUFBMEIsR0FDdkMsSUFBSSxDQUFDbEIsS0FBSyxDQUFDZ0wsU0FBUyxDQUFDakUsR0FBRyxDQUFDLElBQUksQ0FBQ3FFLG1CQUFtQixDQUM5QyxDQUVDLENBQUM7RUFFZDtFQW9FQTVCLDBCQUEwQkEsQ0FBQSxFQUFHO0lBQzNCLE1BQU1sQixjQUFjLEdBQUcsSUFBSSxDQUFDdEksS0FBSyxDQUFDc0ksY0FBYztJQUNoRCxJQUFJQSxjQUFjLENBQUMxQixNQUFNLEtBQUssQ0FBQyxFQUFFO01BQy9CLE9BQU8sSUFBSTtJQUNiO0lBRUEsTUFBTXlFLGVBQWUsR0FBRy9DLGNBQWMsQ0FBQ2dELE1BQU0sQ0FBQ0MsSUFBSSxJQUFJQSxJQUFJLENBQUNySSxNQUFNLENBQUNrQyxVQUFVLENBQUM7SUFDN0UsTUFBTW9HLGlCQUFpQixHQUFHbEQsY0FBYyxDQUFDZ0QsTUFBTSxDQUFDQyxJQUFJLElBQUksQ0FBQ0EsSUFBSSxDQUFDckksTUFBTSxDQUFDa0MsVUFBVSxDQUFDO0lBRWhGLE1BQU1xRyxjQUFjLEdBQUc1RyxHQUFHLElBQUk7TUFDNUJBLEdBQUcsQ0FBQ0MsY0FBYyxDQUFDLENBQUM7TUFDcEIsSUFBSSxJQUFJLENBQUM5RSxLQUFLLENBQUMwTCxrQkFBa0IsRUFBRTtRQUNqQyxJQUFJLENBQUMxTCxLQUFLLENBQUMyTCxZQUFZLENBQUMsQ0FBQztNQUMzQixDQUFDLE1BQU07UUFDTCxJQUFJLENBQUMzTCxLQUFLLENBQUM0TCxZQUFZLENBQUMsQ0FBQztNQUMzQjtJQUNGLENBQUM7SUFFRCxPQUNFdlEsTUFBQSxDQUFBNEIsT0FBQSxDQUFBZ0UsYUFBQTtNQUNFQyxTQUFTLEVBQUMsaUNBQWlDO01BQzNDbUUsSUFBSSxFQUFFLElBQUksQ0FBQ3JGLEtBQUssQ0FBQzBMO0lBQW1CLEdBRXBDclEsTUFBQSxDQUFBNEIsT0FBQSxDQUFBZ0UsYUFBQTtNQUFTQyxTQUFTLEVBQUMsdUJBQXVCO01BQUNxQixPQUFPLEVBQUVrSjtJQUFlLEdBQ2pFcFEsTUFBQSxDQUFBNEIsT0FBQSxDQUFBZ0UsYUFBQTtNQUFNQyxTQUFTLEVBQUM7SUFBc0IsYUFBZSxDQUFDLEVBQ3REN0YsTUFBQSxDQUFBNEIsT0FBQSxDQUFBZ0UsYUFBQTtNQUFNQyxTQUFTLEVBQUM7SUFBeUIsR0FDdkM3RixNQUFBLENBQUE0QixPQUFBLENBQUFnRSxhQUFBO01BQU1DLFNBQVMsRUFBQztJQUFzQixlQUVuQyxHQUFHLEVBQUM3RixNQUFBLENBQUE0QixPQUFBLENBQUFnRSxhQUFBO01BQU1DLFNBQVMsRUFBQztJQUF3QixHQUFFbUssZUFBZSxDQUFDekUsTUFBYSxDQUFDLEVBQUMsR0FBRyxRQUVoRixHQUFHLEVBQUN2TCxNQUFBLENBQUE0QixPQUFBLENBQUFnRSxhQUFBO01BQU1DLFNBQVMsRUFBQztJQUF3QixHQUFFbUssZUFBZSxDQUFDekUsTUFBTSxHQUFHNEUsaUJBQWlCLENBQUM1RSxNQUFhLENBQ25HLENBQUMsRUFDUHZMLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQWdFLGFBQUE7TUFDRUMsU0FBUyxFQUFDLDJCQUEyQjtNQUFDL0MsS0FBSyxFQUFFa04sZUFBZSxDQUFDekUsTUFBTztNQUNwRWlGLEdBQUcsRUFBRVIsZUFBZSxDQUFDekUsTUFBTSxHQUFHNEUsaUJBQWlCLENBQUM1RTtJQUFPLENBQ3hELENBQ0csQ0FDQyxDQUFDLEVBRVQ0RSxpQkFBaUIsQ0FBQzVFLE1BQU0sR0FBRyxDQUFDLElBQUl2TCxNQUFBLENBQUE0QixPQUFBLENBQUFnRSxhQUFBO01BQU1DLFNBQVMsRUFBQztJQUEwQixHQUN4RXNLLGlCQUFpQixDQUFDekUsR0FBRyxDQUFDLElBQUksQ0FBQytFLHlCQUF5QixDQUNqRCxDQUFDLEVBQ05ULGVBQWUsQ0FBQ3pFLE1BQU0sR0FBRyxDQUFDLElBQUl2TCxNQUFBLENBQUE0QixPQUFBLENBQUFnRSxhQUFBO01BQVNDLFNBQVMsRUFBQywwQ0FBMEM7TUFBQ21FLElBQUk7SUFBQSxHQUMvRmhLLE1BQUEsQ0FBQTRCLE9BQUEsQ0FBQWdFLGFBQUE7TUFBU0MsU0FBUyxFQUFDO0lBQXVCLEdBQ3hDN0YsTUFBQSxDQUFBNEIsT0FBQSxDQUFBZ0UsYUFBQTtNQUFNQyxTQUFTLEVBQUM7SUFBc0IsYUFBZSxDQUM5QyxDQUFDLEVBQ1Y3RixNQUFBLENBQUE0QixPQUFBLENBQUFnRSxhQUFBO01BQU1DLFNBQVMsRUFBQztJQUEwQixHQUN2Q21LLGVBQWUsQ0FBQ3RFLEdBQUcsQ0FBQyxJQUFJLENBQUMrRSx5QkFBeUIsQ0FDL0MsQ0FDQyxDQUVGLENBQUM7RUFFZDtFQXlMQTVKLGdCQUFnQkEsQ0FBQzZKLE1BQU0sRUFBRTtJQUN2QixJQUFJLENBQUNBLE1BQU0sQ0FBQ0MsWUFBWSxFQUFFO01BQ3hCLE9BQU8sSUFBSTtJQUNiLENBQUMsTUFBTTtNQUNMLE9BQ0UzUSxNQUFBLENBQUE0QixPQUFBLENBQUFnRSxhQUFBO1FBQU1DLFNBQVMsRUFBQztNQUFzQixxQkFFcEM3RixNQUFBLENBQUE0QixPQUFBLENBQUFnRSxhQUFBO1FBQUdDLFNBQVMsRUFBQyxzQkFBc0I7UUFBQ2MsSUFBSSxFQUFFK0osTUFBTSxDQUFDOUo7TUFBSSxXQUFVLENBQzNELENBQUM7SUFFWDtFQUNGO0VBRUFFLHVCQUF1QkEsQ0FBQzRKLE1BQU0sRUFBRTtJQUM5QixNQUFNRSxJQUFJLEdBQUc3TSxxQkFBcUIsQ0FBQzJNLE1BQU0sQ0FBQ0csaUJBQWlCLENBQUM7SUFDNUQsSUFBSSxDQUFDRCxJQUFJLEVBQUU7TUFBRSxPQUFPLElBQUk7SUFBRTtJQUMxQixPQUNFNVEsTUFBQSxDQUFBNEIsT0FBQSxDQUFBZ0UsYUFBQTtNQUFNQyxTQUFTLEVBQUM7SUFBNEMsR0FBRStLLElBQVcsQ0FBQztFQUU5RTtFQW1CQXhFLFdBQVdBLENBQUNoQixXQUFXLEVBQUV2RCxNQUFNLEVBQUV5RCxXQUFXLEVBQUU7SUFDNUMsTUFBTXdGLElBQUksR0FBRzFGLFdBQVcsQ0FBQ00sR0FBRyxDQUFDcUYsTUFBTSxJQUFJQSxNQUFNLENBQUNDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQ0MsS0FBSyxDQUFDLEVBQUUsQ0FBQztJQUNsRSxNQUFNQyxnQkFBZ0IsR0FBR0EsQ0FBQSxLQUFNOUYsV0FBVyxDQUFDTSxHQUFHLENBQUNxRixNQUFNLElBQUlBLE1BQU0sQ0FBQ0ksT0FBTyxDQUFDLEVBQUUsRUFBRTtNQUFDQyxjQUFjLEVBQUU7SUFBSSxDQUFDLENBQUMsQ0FBQztJQUNwRyxNQUFNQyxjQUFjLEdBQUdBLENBQUEsS0FBTWpHLFdBQVcsQ0FBQ00sR0FBRyxDQUFDcUYsTUFBTSxJQUFJQSxNQUFNLENBQUNJLE9BQU8sQ0FBQ0wsSUFBSSxFQUFFO01BQUNNLGNBQWMsRUFBRTtJQUFJLENBQUMsQ0FBQyxDQUFDO0lBRXBHLE9BQU8sSUFBSSxDQUFDek0sS0FBSyxDQUFDMk0sZ0JBQWdCLENBQ2hDUixJQUFJLEVBQUVqSixNQUFNLENBQUMvQixFQUFFLEVBQUV3RixXQUFXLENBQUN4RixFQUFFLEVBQUV3RixXQUFXLENBQUNsRCxJQUFJLEVBQUVrRCxXQUFXLENBQUNmLFFBQVEsRUFBRTtNQUFDMkcsZ0JBQWdCO01BQUVHO0lBQWMsQ0FDNUcsQ0FBQztFQUNIO0VBZUEzSSxxQkFBcUJBLENBQUNaLFdBQVcsRUFBRTtJQUNqQyxJQUFJVSxVQUFVLEVBQUVDLFlBQVk7SUFDNUIsTUFBTThJLFlBQVksR0FBRyxJQUFJLENBQUM1TSxLQUFLLENBQUM2TSxtQkFBbUI7SUFFbkQsTUFBTUMsdUJBQXVCLEdBQUcsSUFBSSxDQUFDOU0sS0FBSyxDQUFDMEYsVUFBVSxDQUFDcUgsR0FBRyxDQUFDLENBQUMsS0FBS0Msb0NBQWMsQ0FBQ0MsT0FBTztJQUN0RixJQUFJTCxZQUFZLEtBQUssSUFBSSxFQUFFO01BQ3pCL0ksVUFBVSxHQUFHLElBQUk7TUFDakJDLFlBQVksR0FBRyxFQUFFO0lBQ25CLENBQUMsTUFBTSxJQUFJWCxXQUFXLENBQUN5QyxRQUFRLEtBQUssSUFBSSxFQUFFO01BQ3hDL0IsVUFBVSxHQUFHLElBQUk7TUFDakJDLFlBQVksR0FBRyxVQUFVO0lBQzNCLENBQUMsTUFBTTtNQUNMLE1BQU1vSixtQkFBbUIsR0FBR04sWUFBWSxDQUFDelAsR0FBRyxDQUFDc0csYUFBSSxDQUFDMEosU0FBUyxDQUFDaEssV0FBVyxDQUFDTSxJQUFJLENBQUMsQ0FBQztNQUM5RUksVUFBVSxHQUFHcUosbUJBQW1CLENBQUNFLGtCQUFrQixDQUFDalEsR0FBRyxDQUFDNEssUUFBUSxDQUFDNUUsV0FBVyxDQUFDeUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO01BQzNGLElBQUlzSCxtQkFBbUIsQ0FBQ0csZ0JBQWdCLElBQUlQLHVCQUF1QixFQUFFO1FBQ25FakosVUFBVSxHQUFHcUosbUJBQW1CLENBQUNHLGdCQUFnQixDQUFDbFEsR0FBRyxDQUFDMEcsVUFBVSxDQUFDLENBQUN5SixXQUFXO01BQy9FO01BQ0F4SixZQUFZLEdBQUdELFVBQVU7SUFDM0I7SUFFQSxPQUFPO01BQUNBLFVBQVU7TUFBRUM7SUFBWSxDQUFDO0VBQ25DOztFQUVBO0VBQ0FrRixjQUFjQSxDQUFDWixRQUFRLEVBQUU7SUFDdkIsTUFBTWhGLFlBQVksR0FBRyxJQUFJLENBQUNDLGFBQWEsQ0FBQ2xHLEdBQUcsQ0FBQ2lMLFFBQVEsQ0FBQztJQUNyRCxJQUFJaEYsWUFBWSxFQUFFO01BQ2hCQSxZQUFZLENBQUMyRCxHQUFHLENBQUN3RyxPQUFPLElBQUk7UUFDMUJBLE9BQU8sQ0FBQ0Msc0JBQXNCLENBQUMsQ0FBQztRQUNoQyxPQUFPLElBQUksQ0FBQyxDQUFDO01BQ2YsQ0FBQyxDQUFDO0lBQ0o7RUFDRjs7RUFFQSxNQUFNN0Ysc0JBQXNCQSxDQUFDekUsTUFBTSxFQUFFO0lBQ25DLElBQUlBLE1BQU0sQ0FBQ2tDLFVBQVUsRUFBRTtNQUNyQixNQUFNLElBQUksQ0FBQ3BGLEtBQUssQ0FBQ3lOLGVBQWUsQ0FBQ3ZLLE1BQU0sQ0FBQztJQUMxQyxDQUFDLE1BQU07TUFDTCxNQUFNLElBQUksQ0FBQ2xELEtBQUssQ0FBQzBOLGFBQWEsQ0FBQ3hLLE1BQU0sQ0FBQztJQUN4QztFQUNGO0FBQ0Y7QUFBQ3lLLE9BQUEsQ0FBQTFRLE9BQUEsR0FBQTJDLFdBQUE7QUFBQTNCLGVBQUEsQ0FobkJvQjJCLFdBQVcsZUFDWDtFQUNqQjtFQUNBZ08sS0FBSyxFQUFFQyxrQkFBUyxDQUFDQyxLQUFLLENBQUM7SUFDckJDLFdBQVcsRUFBRUYsa0JBQVMsQ0FBQ0csTUFBTSxDQUFDQztFQUNoQyxDQUFDLENBQUMsQ0FBQ0EsVUFBVTtFQUNiQyxVQUFVLEVBQUVMLGtCQUFTLENBQUNHLE1BQU0sQ0FBQ0MsVUFBVTtFQUN2Q0UsV0FBVyxFQUFFTixrQkFBUyxDQUFDRyxNQUFNLENBQUNDLFVBQVU7RUFDeENqRCxTQUFTLEVBQUU2QyxrQkFBUyxDQUFDTyxLQUFLLENBQUNILFVBQVU7RUFDckMzRixjQUFjLEVBQUV1RixrQkFBUyxDQUFDUSxPQUFPLENBQUNSLGtCQUFTLENBQUNDLEtBQUssQ0FBQztJQUNoRDVLLE1BQU0sRUFBRTJLLGtCQUFTLENBQUNHLE1BQU0sQ0FBQ0MsVUFBVTtJQUNuQ2hMLFFBQVEsRUFBRTRLLGtCQUFTLENBQUNRLE9BQU8sQ0FBQ1Isa0JBQVMsQ0FBQ0csTUFBTSxDQUFDLENBQUNDO0VBQ2hELENBQUMsQ0FBQyxDQUFDO0VBQ0g5RCxPQUFPLEVBQUUwRCxrQkFBUyxDQUFDUyxJQUFJLENBQUNMLFVBQVU7RUFFbEM7RUFDQS9ILGNBQWMsRUFBRTJILGtCQUFTLENBQUNHLE1BQU0sQ0FBQ0MsVUFBVTtFQUMzQzNILFlBQVksRUFBRXVILGtCQUFTLENBQUNwRCxNQUFNLENBQUN3RCxVQUFVO0VBQ3pDdkksVUFBVSxFQUFFNkksdUNBQTJCLENBQUNOLFVBQVU7RUFDbERoRCxrQkFBa0IsRUFBRTRDLGtCQUFTLENBQUNXLElBQUksQ0FBQ1AsVUFBVTtFQUM3Q3ZDLGtCQUFrQixFQUFFbUMsa0JBQVMsQ0FBQ1csSUFBSSxDQUFDUCxVQUFVO0VBQzdDeEosYUFBYSxFQUFFb0osa0JBQVMsQ0FBQ0MsS0FBSyxDQUFDO0lBQzdCNVEsR0FBRyxFQUFFMlEsa0JBQVMsQ0FBQ1MsSUFBSSxDQUFDTDtFQUN0QixDQUFDLENBQUM7RUFDRnRKLG9CQUFvQixFQUFFa0osa0JBQVMsQ0FBQ0MsS0FBSyxDQUFDO0lBQ3BDNVEsR0FBRyxFQUFFMlEsa0JBQVMsQ0FBQ1MsSUFBSSxDQUFDTDtFQUN0QixDQUFDLENBQUM7RUFDRm5ILGlCQUFpQixFQUFFK0csa0JBQVMsQ0FBQ1ksTUFBTTtFQUNuQzFGLGdCQUFnQixFQUFFOEUsa0JBQVMsQ0FBQ1ksTUFBTTtFQUNsQztFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTVCLG1CQUFtQixFQUFFZ0Isa0JBQVMsQ0FBQ0csTUFBTTtFQUVyQztFQUNBdkQsTUFBTSxFQUFFb0Qsa0JBQVMsQ0FBQ3BELE1BQU0sQ0FBQ3dELFVBQVU7RUFDbkN6RCxJQUFJLEVBQUVxRCxrQkFBUyxDQUFDWSxNQUFNLENBQUNSLFVBQVU7RUFDakMxRCxLQUFLLEVBQUVzRCxrQkFBUyxDQUFDWSxNQUFNLENBQUNSLFVBQVU7RUFDbENTLE9BQU8sRUFBRWIsa0JBQVMsQ0FBQ1ksTUFBTSxDQUFDUixVQUFVO0VBRXBDO0VBQ0FVLFNBQVMsRUFBRWQsa0JBQVMsQ0FBQ0csTUFBTSxDQUFDQyxVQUFVO0VBQ3RDMUgsTUFBTSxFQUFFc0gsa0JBQVMsQ0FBQ0csTUFBTSxDQUFDQyxVQUFVO0VBQ25DM00sUUFBUSxFQUFFdU0sa0JBQVMsQ0FBQ0csTUFBTSxDQUFDQyxVQUFVO0VBQ3JDbkwsUUFBUSxFQUFFK0ssa0JBQVMsQ0FBQ0csTUFBTSxDQUFDQyxVQUFVO0VBQ3JDNU0sT0FBTyxFQUFFd00sa0JBQVMsQ0FBQ1MsSUFBSSxDQUFDTCxVQUFVO0VBRWxDO0VBQ0F6SSxRQUFRLEVBQUVxSSxrQkFBUyxDQUFDUyxJQUFJLENBQUNMLFVBQVU7RUFDbkNwSSxRQUFRLEVBQUVnSSxrQkFBUyxDQUFDUyxJQUFJLENBQUNMLFVBQVU7RUFDbkMzRCxNQUFNLEVBQUV1RCxrQkFBUyxDQUFDUyxJQUFJLENBQUNMLFVBQVU7RUFDakNwRSxXQUFXLEVBQUVnRSxrQkFBUyxDQUFDUyxJQUFJLENBQUNMLFVBQVU7RUFDdENuRSxXQUFXLEVBQUUrRCxrQkFBUyxDQUFDUyxJQUFJLENBQUNMLFVBQVU7RUFDdEN0TCxZQUFZLEVBQUVrTCxrQkFBUyxDQUFDUyxJQUFJLENBQUNMLFVBQVU7RUFDdkM5QyxhQUFhLEVBQUUwQyxrQkFBUyxDQUFDUyxJQUFJLENBQUNMLFVBQVU7RUFDeEMvQyxhQUFhLEVBQUUyQyxrQkFBUyxDQUFDUyxJQUFJLENBQUNMLFVBQVU7RUFDeENyQyxZQUFZLEVBQUVpQyxrQkFBUyxDQUFDUyxJQUFJLENBQUNMLFVBQVU7RUFDdkN0QyxZQUFZLEVBQUVrQyxrQkFBUyxDQUFDUyxJQUFJLENBQUNMLFVBQVU7RUFDdkNoSixZQUFZLEVBQUU0SSxrQkFBUyxDQUFDUyxJQUFJLENBQUNMLFVBQVU7RUFDdkNqSixZQUFZLEVBQUU2SSxrQkFBUyxDQUFDUyxJQUFJLENBQUNMLFVBQVU7RUFDdkNQLGFBQWEsRUFBRUcsa0JBQVMsQ0FBQ1MsSUFBSSxDQUFDTCxVQUFVO0VBQ3hDUixlQUFlLEVBQUVJLGtCQUFTLENBQUNTLElBQUksQ0FBQ0wsVUFBVTtFQUMxQ3RCLGdCQUFnQixFQUFFa0Isa0JBQVMsQ0FBQ1MsSUFBSSxDQUFDTCxVQUFVO0VBQzNDaEgsYUFBYSxFQUFFNEcsa0JBQVMsQ0FBQ1MsSUFBSSxDQUFDTCxVQUFVO0VBQ3hDek0sYUFBYSxFQUFFcU0sa0JBQVMsQ0FBQ1MsSUFBSSxDQUFDTCxVQUFVO0VBQ3hDbEwsZ0JBQWdCLEVBQUU4SyxrQkFBUyxDQUFDUyxJQUFJLENBQUNMO0FBQ25DLENBQUMifQ==