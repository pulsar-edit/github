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
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcGF0aCIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX3JlYWN0IiwiX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQiLCJfcHJvcFR5cGVzIiwiX2NsYXNzbmFtZXMiLCJfZXZlbnRLaXQiLCJfcHJvcFR5cGVzMiIsIl90b29sdGlwIiwiX2NvbW1hbmRzIiwiX2F0b21UZXh0RWRpdG9yIiwiX2lzc3VlaXNoTGluayIsIl9lbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXIiLCJfcHJDaGVja291dENvbnRyb2xsZXIiLCJfZ2l0aHViRG90Y29tTWFya2Rvd24iLCJfcGF0Y2hQcmV2aWV3VmlldyIsIl9yZXZpZXdDb21tZW50VmlldyIsIl9hY3Rpb25hYmxlUmV2aWV3VmlldyIsIl9jaGVja291dEJ1dHRvbiIsIl9vY3RpY29uIiwiX3RpbWVhZ28iLCJfcmVmSG9sZGVyIiwiX2hlbHBlcnMiLCJfcmVwb3J0ZXJQcm94eSIsIl9nZXRSZXF1aXJlV2lsZGNhcmRDYWNoZSIsImUiLCJXZWFrTWFwIiwiciIsInQiLCJfX2VzTW9kdWxlIiwiZGVmYXVsdCIsImhhcyIsImdldCIsIm4iLCJfX3Byb3RvX18iLCJhIiwiT2JqZWN0IiwiZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJ1IiwiaGFzT3duUHJvcGVydHkiLCJjYWxsIiwiaSIsInNldCIsIl9kZWZpbmVQcm9wZXJ0eSIsIl90b1Byb3BlcnR5S2V5IiwidmFsdWUiLCJlbnVtZXJhYmxlIiwiY29uZmlndXJhYmxlIiwid3JpdGFibGUiLCJfdG9QcmltaXRpdmUiLCJTeW1ib2wiLCJ0b1ByaW1pdGl2ZSIsIlR5cGVFcnJvciIsIlN0cmluZyIsIk51bWJlciIsImF1dGhvckFzc29jaWF0aW9uVGV4dCIsIk1FTUJFUiIsIk9XTkVSIiwiQ09MTEFCT1JBVE9SIiwiQ09OVFJJQlVUT1IiLCJGSVJTVF9USU1FX0NPTlRSSUJVVE9SIiwiRklSU1RfVElNRVIiLCJOT05FIiwiUmV2aWV3c1ZpZXciLCJSZWFjdCIsIkNvbXBvbmVudCIsImNvbnN0cnVjdG9yIiwicHJvcHMiLCJhZGRFdmVudCIsInBhY2thZ2UiLCJjb21wb25lbnQiLCJuYW1lIiwicmV2aWV3IiwicmV2aWV3VHlwZXMiLCJ0eXBlIiwiQVBQUk9WRUQiLCJpY29uIiwiY29weSIsIkNPTU1FTlRFRCIsIkNIQU5HRVNfUkVRVUVTVEVEIiwic3RhdGUiLCJib2R5SFRNTCIsImF1dGhvciIsIkdIT1NUX1VTRVIiLCJjcmVhdGVFbGVtZW50IiwiY2xhc3NOYW1lIiwia2V5IiwiaWQiLCJvcmlnaW5hbENvbnRlbnQiLCJjb25maXJtIiwiY29tbWFuZHMiLCJjb250ZW50VXBkYXRlciIsInVwZGF0ZVN1bW1hcnkiLCJyZW5kZXIiLCJzaG93QWN0aW9uc01lbnUiLCJGcmFnbWVudCIsInNyYyIsImF2YXRhclVybCIsImFsdCIsImxvZ2luIiwiaHJlZiIsInVybCIsInJlbmRlckVkaXRlZExpbmsiLCJyZW5kZXJBdXRob3JBc3NvY2lhdGlvbiIsInRpbWUiLCJzdWJtaXR0ZWRBdCIsImRpc3BsYXlTdHlsZSIsIm9uQ2xpY2siLCJldmVudCIsImh0bWwiLCJzd2l0Y2hUb0lzc3VlaXNoIiwib3Blbklzc3VlaXNoIiwib3Blbklzc3VlaXNoTGlua0luTmV3VGFiIiwicmVhY3RhYmxlIiwidG9vbHRpcHMiLCJyZXBvcnRSZWxheUVycm9yIiwiY29tbWVudFRocmVhZCIsImNvbW1lbnRzIiwidGhyZWFkIiwicm9vdENvbW1lbnQiLCJ0aHJlYWRIb2xkZXIiLCJ0aHJlYWRIb2xkZXJzIiwiUmVmSG9sZGVyIiwibmF0aXZlUGF0aCIsInRvTmF0aXZlUGF0aFNlcCIsInBhdGgiLCJkaXIiLCJiYXNlIiwicGFyc2UiLCJsaW5lTnVtYmVyIiwicG9zaXRpb25UZXh0IiwiZ2V0VHJhbnNsYXRlZFBvc2l0aW9uIiwicmVmSnVtcFRvRmlsZUJ1dHRvbiIsImp1bXBUb0ZpbGVEaXNhYmxlZExhYmVsIiwiZWxlbWVudElkIiwibmF2QnV0dG9uQ2xhc3NlcyIsIm91dGRhdGVkIiwib3BlbkZpbGVDbGFzc2VzIiwiY3giLCJvcGVuRGlmZkNsYXNzZXMiLCJpc09wZW4iLCJ0aHJlYWRJRHNPcGVuIiwiaXNIaWdobGlnaHRlZCIsImhpZ2hsaWdodGVkVGhyZWFkSURzIiwidG9nZ2xlIiwiZXZ0IiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJoaWRlVGhyZWFkSUQiLCJzaG93VGhyZWFkSUQiLCJyZWYiLCJzZXR0ZXIiLCJpc1Jlc29sdmVkIiwib3BlbiIsInNlcCIsImNyZWF0ZWRBdCIsIm9wZW5GaWxlIiwiZGlzYWJsZWQiLCJjaGVja291dE9wIiwiaXNFbmFibGVkIiwicG9zaXRpb24iLCJvcGVuRGlmZiIsIm1hbmFnZXIiLCJ0YXJnZXQiLCJ0aXRsZSIsInNob3dEZWxheSIsIm11bHRpRmlsZVBhdGNoIiwiZmlsZU5hbWUiLCJkaWZmUm93IiwibWF4Um93Q291bnQiLCJjb250ZXh0TGluZXMiLCJjb25maWciLCJyZW5kZXJUaHJlYWQiLCJyZXBseUhvbGRlciIsInJlcGx5SG9sZGVycyIsImxhc3RDb21tZW50IiwibGVuZ3RoIiwiaXNQb3N0aW5nIiwicG9zdGluZ1RvVGhyZWFkSUQiLCJtYXAiLCJjb21tZW50IiwidXBkYXRlQ29tbWVudCIsInBsYWNlaG9sZGVyVGV4dCIsImxpbmVOdW1iZXJHdXR0ZXJWaXNpYmxlIiwic29mdFdyYXBwZWQiLCJhdXRvSGVpZ2h0IiwicmVhZE9ubHkiLCJyZWZNb2RlbCIsInJlc29sdmVkQnkiLCJzdWJtaXRSZXBseSIsInJlbmRlclJlc29sdmVCdXR0b24iLCJyZXNvbHZlVW5yZXNvbHZlVGhyZWFkIiwiY3VycmVudFRhcmdldCIsImRhdGFzZXQiLCJsaW5lIiwicGFyc2VJbnQiLCJyZXBvT3duZXIiLCJyZXBvTmFtZSIsImlzc3VlaXNoTnVtYmVyIiwiZ2V0RGF0YUZyb21HaXRodWJVcmwiLCJ0aHJlYWRJRCIsInRocmVhZElkIiwiY29tbWVudFRocmVhZHMiLCJmaW5kIiwiZWFjaCIsInJvb3RIb2xkZXIiLCJNYXAiLCJpc1JlZnJlc2hpbmciLCJzdWJzIiwiQ29tcG9zaXRlRGlzcG9zYWJsZSIsImNvbXBvbmVudERpZE1vdW50Iiwic2Nyb2xsVG9UaHJlYWRJRCIsInNjcm9sbFRvVGhyZWFkIiwiY29tcG9uZW50RGlkVXBkYXRlIiwicHJldlByb3BzIiwiY29tcG9uZW50V2lsbFVubW91bnQiLCJkaXNwb3NlIiwicmVuZGVyQ29tbWFuZHMiLCJyZW5kZXJIZWFkZXIiLCJyZW5kZXJSZXZpZXdTdW1tYXJpZXMiLCJyZW5kZXJSZXZpZXdDb21tZW50VGhyZWFkcyIsInJlZ2lzdHJ5IiwiQ29tbWFuZCIsImNvbW1hbmQiLCJjYWxsYmFjayIsIm1vcmVDb250ZXh0IiwibGVzc0NvbnRleHQiLCJzdWJtaXRDdXJyZW50Q29tbWVudCIsInJlZnJlc2giLCJzZXRTdGF0ZSIsInN1YiIsInJlZmV0Y2giLCJyZW1vdmUiLCJhZGQiLCJvcGVuUFIiLCJvd25lciIsInJlcG8iLCJudW1iZXIiLCJyZWZyZXNoaW5nIiwiY2xhc3NOYW1lUHJlZml4IiwiY2xhc3NOYW1lcyIsInJlbmRlckVtcHR5U3RhdGUiLCJwdWxsUmVxdWVzdFVSTCIsImxvZ1N0YXJ0UmV2aWV3Q2xpY2siLCJzdW1tYXJpZXMiLCJzdW1tYXJ5U2VjdGlvbk9wZW4iLCJoaWRlU3VtbWFyaWVzIiwic2hvd1N1bW1hcmllcyIsInJlbmRlclJldmlld1N1bW1hcnkiLCJyZXNvbHZlZFRocmVhZHMiLCJmaWx0ZXIiLCJwYWlyIiwidW5yZXNvbHZlZFRocmVhZHMiLCJ0b2dnbGVDb21tZW50cyIsImNvbW1lbnRTZWN0aW9uT3BlbiIsImhpZGVDb21tZW50cyIsInNob3dDb21tZW50cyIsIm1heCIsInJlbmRlclJldmlld0NvbW1lbnRUaHJlYWQiLCJlbnRpdHkiLCJsYXN0RWRpdGVkQXQiLCJ0ZXh0IiwiYXV0aG9yQXNzb2NpYXRpb24iLCJib2R5IiwiZWRpdG9yIiwiZ2V0VGV4dCIsImdldE9yIiwiZGlkU3VibWl0Q29tbWVudCIsInNldFRleHQiLCJieXBhc3NSZWFkT25seSIsImRpZEZhaWxDb21tZW50IiwiYWRkU2luZ2xlQ29tbWVudCIsInRyYW5zbGF0aW9ucyIsImNvbW1lbnRUcmFuc2xhdGlvbnMiLCJpc0NoZWNrZWRPdXRQdWxsUmVxdWVzdCIsIndoeSIsImNoZWNrb3V0U3RhdGVzIiwiQ1VSUkVOVCIsInRyYW5zbGF0aW9uc0ZvckZpbGUiLCJub3JtYWxpemUiLCJkaWZmVG9GaWxlUG9zaXRpb24iLCJmaWxlVHJhbnNsYXRpb25zIiwibmV3UG9zaXRpb24iLCJlbGVtZW50Iiwic2Nyb2xsSW50b1ZpZXdJZk5lZWRlZCIsInVucmVzb2x2ZVRocmVhZCIsInJlc29sdmVUaHJlYWQiLCJleHBvcnRzIiwicmVsYXkiLCJQcm9wVHlwZXMiLCJzaGFwZSIsImVudmlyb25tZW50Iiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsInJlcG9zaXRvcnkiLCJwdWxsUmVxdWVzdCIsImFycmF5IiwiYXJyYXlPZiIsImZ1bmMiLCJFbmFibGVhYmxlT3BlcmF0aW9uUHJvcFR5cGUiLCJib29sIiwic3RyaW5nIiwid29ya2RpciIsIndvcmtzcGFjZSJdLCJzb3VyY2VzIjpbInJldmlld3Mtdmlldy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBSZWFjdCwge0ZyYWdtZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGN4IGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuXG5pbXBvcnQge0VuYWJsZWFibGVPcGVyYXRpb25Qcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQgVG9vbHRpcCBmcm9tICcuLi9hdG9tL3Rvb2x0aXAnO1xuaW1wb3J0IENvbW1hbmRzLCB7Q29tbWFuZH0gZnJvbSAnLi4vYXRvbS9jb21tYW5kcyc7XG5pbXBvcnQgQXRvbVRleHRFZGl0b3IgZnJvbSAnLi4vYXRvbS9hdG9tLXRleHQtZWRpdG9yJztcbmltcG9ydCB7Z2V0RGF0YUZyb21HaXRodWJVcmx9IGZyb20gJy4vaXNzdWVpc2gtbGluayc7XG5pbXBvcnQgRW1vamlSZWFjdGlvbnNDb250cm9sbGVyIGZyb20gJy4uL2NvbnRyb2xsZXJzL2Vtb2ppLXJlYWN0aW9ucy1jb250cm9sbGVyJztcbmltcG9ydCB7Y2hlY2tvdXRTdGF0ZXN9IGZyb20gJy4uL2NvbnRyb2xsZXJzL3ByLWNoZWNrb3V0LWNvbnRyb2xsZXInO1xuaW1wb3J0IEdpdGh1YkRvdGNvbU1hcmtkb3duIGZyb20gJy4vZ2l0aHViLWRvdGNvbS1tYXJrZG93bic7XG5pbXBvcnQgUGF0Y2hQcmV2aWV3VmlldyBmcm9tICcuL3BhdGNoLXByZXZpZXctdmlldyc7XG5pbXBvcnQgUmV2aWV3Q29tbWVudFZpZXcgZnJvbSAnLi9yZXZpZXctY29tbWVudC12aWV3JztcbmltcG9ydCBBY3Rpb25hYmxlUmV2aWV3VmlldyBmcm9tICcuL2FjdGlvbmFibGUtcmV2aWV3LXZpZXcnO1xuaW1wb3J0IENoZWNrb3V0QnV0dG9uIGZyb20gJy4vY2hlY2tvdXQtYnV0dG9uJztcbmltcG9ydCBPY3RpY29uIGZyb20gJy4uL2F0b20vb2N0aWNvbic7XG5pbXBvcnQgVGltZWFnbyBmcm9tICcuL3RpbWVhZ28nO1xuaW1wb3J0IFJlZkhvbGRlciBmcm9tICcuLi9tb2RlbHMvcmVmLWhvbGRlcic7XG5pbXBvcnQge3RvTmF0aXZlUGF0aFNlcCwgR0hPU1RfVVNFUn0gZnJvbSAnLi4vaGVscGVycyc7XG5pbXBvcnQge2FkZEV2ZW50fSBmcm9tICcuLi9yZXBvcnRlci1wcm94eSc7XG5cbmNvbnN0IGF1dGhvckFzc29jaWF0aW9uVGV4dCA9IHtcbiAgTUVNQkVSOiAnTWVtYmVyJyxcbiAgT1dORVI6ICdPd25lcicsXG4gIENPTExBQk9SQVRPUjogJ0NvbGxhYm9yYXRvcicsXG4gIENPTlRSSUJVVE9SOiAnQ29udHJpYnV0b3InLFxuICBGSVJTVF9USU1FX0NPTlRSSUJVVE9SOiAnRmlyc3QtdGltZSBjb250cmlidXRvcicsXG4gIEZJUlNUX1RJTUVSOiAnRmlyc3QtdGltZXInLFxuICBOT05FOiBudWxsLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmV2aWV3c1ZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIFJlbGF5IHJlc3VsdHNcbiAgICByZWxheTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGVudmlyb25tZW50OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgICByZXBvc2l0b3J5OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgcHVsbFJlcXVlc3Q6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBzdW1tYXJpZXM6IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICAgIGNvbW1lbnRUaHJlYWRzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgdGhyZWFkOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgICBjb21tZW50czogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCkuaXNSZXF1aXJlZCxcbiAgICB9KSksXG4gICAgcmVmZXRjaDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgIC8vIFBhY2thZ2UgbW9kZWxzXG4gICAgbXVsdGlGaWxlUGF0Y2g6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb250ZXh0TGluZXM6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBjaGVja291dE9wOiBFbmFibGVhYmxlT3BlcmF0aW9uUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICBzdW1tYXJ5U2VjdGlvbk9wZW46IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgY29tbWVudFNlY3Rpb25PcGVuOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIHRocmVhZElEc09wZW46IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBoYXM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgfSksXG4gICAgaGlnaGxpZ2h0ZWRUaHJlYWRJRHM6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBoYXM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgfSksXG4gICAgcG9zdGluZ1RvVGhyZWFkSUQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgc2Nyb2xsVG9UaHJlYWRJRDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAvLyBTdHJ1Y3R1cmU6IE1hcDwgcmVsYXRpdmVQYXRoOiBTdHJpbmcsIHtcbiAgICAvLyAgIHJhd1Bvc2l0aW9uczogU2V0PGxpbmVOdW1iZXJzOiBOdW1iZXI+LFxuICAgIC8vICAgZGlmZlRvRmlsZVBvc2l0aW9uOiBNYXA8cmF3UG9zaXRpb246IE51bWJlciwgYWRqdXN0ZWRQb3NpdGlvbjogTnVtYmVyPixcbiAgICAvLyAgIGZpbGVUcmFuc2xhdGlvbnM6IG51bGwgfCBNYXA8YWRqdXN0ZWRQb3NpdGlvbjogTnVtYmVyLCB7bmV3UG9zaXRpb246IE51bWJlcn0+LFxuICAgIC8vICAgZGlnZXN0OiBTdHJpbmcsXG4gICAgLy8gfT5cbiAgICBjb21tZW50VHJhbnNsYXRpb25zOiBQcm9wVHlwZXMub2JqZWN0LFxuXG4gICAgLy8gZm9yIHRoZSBkb3Rjb20gbGluayBpbiB0aGUgZW1wdHkgc3RhdGVcbiAgICBudW1iZXI6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICByZXBvOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgb3duZXI6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICB3b3JrZGlyOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBBdG9tIGVudmlyb25tZW50XG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29uZmlnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB0b29sdGlwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpcm06IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBBY3Rpb24gbWV0aG9kc1xuICAgIG9wZW5GaWxlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9wZW5EaWZmOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9wZW5QUjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBtb3JlQ29udGV4dDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBsZXNzQ29udGV4dDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvcGVuSXNzdWVpc2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgc2hvd1N1bW1hcmllczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBoaWRlU3VtbWFyaWVzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHNob3dDb21tZW50czogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBoaWRlQ29tbWVudHM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgc2hvd1RocmVhZElEOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGhpZGVUaHJlYWRJRDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICByZXNvbHZlVGhyZWFkOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHVucmVzb2x2ZVRocmVhZDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBhZGRTaW5nbGVDb21tZW50OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHVwZGF0ZUNvbW1lbnQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgdXBkYXRlU3VtbWFyeTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICByZXBvcnRSZWxheUVycm9yOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnJvb3RIb2xkZXIgPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5yZXBseUhvbGRlcnMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy50aHJlYWRIb2xkZXJzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBpc1JlZnJlc2hpbmc6IGZhbHNlLFxuICAgIH07XG4gICAgdGhpcy5zdWJzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGNvbnN0IHtzY3JvbGxUb1RocmVhZElEfSA9IHRoaXMucHJvcHM7XG4gICAgaWYgKHNjcm9sbFRvVGhyZWFkSUQpIHtcbiAgICAgIHRoaXMuc2Nyb2xsVG9UaHJlYWQoc2Nyb2xsVG9UaHJlYWRJRCk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcykge1xuICAgIGNvbnN0IHtzY3JvbGxUb1RocmVhZElEfSA9IHRoaXMucHJvcHM7XG4gICAgaWYgKHNjcm9sbFRvVGhyZWFkSUQgJiYgc2Nyb2xsVG9UaHJlYWRJRCAhPT0gcHJldlByb3BzLnNjcm9sbFRvVGhyZWFkSUQpIHtcbiAgICAgIHRoaXMuc2Nyb2xsVG9UaHJlYWQoc2Nyb2xsVG9UaHJlYWRJRCk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5zdWJzLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3c1wiIHJlZj17dGhpcy5yb290SG9sZGVyLnNldHRlcn0+XG4gICAgICAgIHt0aGlzLnJlbmRlckNvbW1hbmRzKCl9XG4gICAgICAgIHt0aGlzLnJlbmRlckhlYWRlcigpfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLWxpc3RcIj5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJSZXZpZXdTdW1tYXJpZXMoKX1cbiAgICAgICAgICB7dGhpcy5yZW5kZXJSZXZpZXdDb21tZW50VGhyZWFkcygpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJDb21tYW5kcygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEZyYWdtZW50PlxuICAgICAgICA8Q29tbWFuZHMgcmVnaXN0cnk9e3RoaXMucHJvcHMuY29tbWFuZHN9IHRhcmdldD17dGhpcy5yb290SG9sZGVyfT5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOm1vcmUtY29udGV4dFwiIGNhbGxiYWNrPXt0aGlzLnByb3BzLm1vcmVDb250ZXh0fSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6bGVzcy1jb250ZXh0XCIgY2FsbGJhY2s9e3RoaXMucHJvcHMubGVzc0NvbnRleHR9IC8+XG4gICAgICAgIDwvQ29tbWFuZHM+XG4gICAgICAgIDxDb21tYW5kcyByZWdpc3RyeT17dGhpcy5wcm9wcy5jb21tYW5kc30gdGFyZ2V0PVwiLmdpdGh1Yi1SZXZpZXctcmVwbHlcIj5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnN1Ym1pdC1jb21tZW50XCIgY2FsbGJhY2s9e3RoaXMuc3VibWl0Q3VycmVudENvbW1lbnR9IC8+XG4gICAgICAgIDwvQ29tbWFuZHM+XG4gICAgICA8L0ZyYWdtZW50PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJIZWFkZXIoKSB7XG4gICAgY29uc3QgcmVmcmVzaCA9ICgpID0+IHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLmlzUmVmcmVzaGluZykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLnNldFN0YXRlKHtpc1JlZnJlc2hpbmc6IHRydWV9KTtcbiAgICAgIGNvbnN0IHN1YiA9IHRoaXMucHJvcHMucmVmZXRjaCgoKSA9PiB7XG4gICAgICAgIHRoaXMuc3Vicy5yZW1vdmUoc3ViKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7aXNSZWZyZXNoaW5nOiBmYWxzZX0pO1xuICAgICAgfSk7XG4gICAgICB0aGlzLnN1YnMuYWRkKHN1Yik7XG4gICAgfTtcbiAgICByZXR1cm4gKFxuICAgICAgPGhlYWRlciBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy10b3BIZWFkZXJcIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLWNvbW1lbnQtZGlzY3Vzc2lvblwiIC8+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLWhlYWRlclRpdGxlXCI+XG4gICAgICAgICAgUmV2aWV3cyBmb3ImbmJzcDtcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1jbGlja2FibGVcIiBvbkNsaWNrPXt0aGlzLnByb3BzLm9wZW5QUn0+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5vd25lcn0ve3RoaXMucHJvcHMucmVwb30je3RoaXMucHJvcHMubnVtYmVyfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgY2xhc3NOYW1lPXtjeChcbiAgICAgICAgICAgICdnaXRodWItUmV2aWV3cy1oZWFkZXJCdXR0b24gZ2l0aHViLVJldmlld3MtY2xpY2thYmxlIGljb24gaWNvbi1yZXBvLXN5bmMnLFxuICAgICAgICAgICAge3JlZnJlc2hpbmc6IHRoaXMuc3RhdGUuaXNSZWZyZXNoaW5nfSxcbiAgICAgICAgICApfVxuICAgICAgICAgIG9uQ2xpY2s9e3JlZnJlc2h9XG4gICAgICAgIC8+XG4gICAgICAgIDxDaGVja291dEJ1dHRvblxuICAgICAgICAgIGNoZWNrb3V0T3A9e3RoaXMucHJvcHMuY2hlY2tvdXRPcH1cbiAgICAgICAgICBjbGFzc05hbWVQcmVmaXg9XCJnaXRodWItUmV2aWV3cy1jaGVja291dEJ1dHRvbi0tXCJcbiAgICAgICAgICBjbGFzc05hbWVzPXtbJ2dpdGh1Yi1SZXZpZXdzLWhlYWRlckJ1dHRvbiddfVxuICAgICAgICAvPlxuICAgICAgPC9oZWFkZXI+XG4gICAgKTtcbiAgfVxuXG4gIGxvZ1N0YXJ0UmV2aWV3Q2xpY2sgPSAoKSA9PiB7XG4gICAgYWRkRXZlbnQoJ3N0YXJ0LXByLXJldmlldycsIHtwYWNrYWdlOiAnZ2l0aHViJywgY29tcG9uZW50OiB0aGlzLmNvbnN0cnVjdG9yLm5hbWV9KTtcbiAgfVxuXG4gIHJlbmRlckVtcHR5U3RhdGUoKSB7XG4gICAgY29uc3Qge251bWJlciwgcmVwbywgb3duZXJ9ID0gdGhpcy5wcm9wcztcbiAgICAvLyB0b2RvOiBtYWtlIHRoaXMgb3BlbiB0aGUgcmV2aWV3IGZsb3cgaW4gQXRvbSBpbnN0ZWFkIG9mIGRvdGNvbVxuICAgIGNvbnN0IHB1bGxSZXF1ZXN0VVJMID0gYGh0dHBzOi8vd3d3LmdpdGh1Yi5jb20vJHtvd25lcn0vJHtyZXBvfS9wdWxsLyR7bnVtYmVyfS9maWxlcy9gO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLWVtcHR5U3RhdGVcIj5cbiAgICAgICAgPGltZyBzcmM9XCJhdG9tOi8vZ2l0aHViL2ltZy9tb25hLnN2Z1wiIGFsdD1cIk1vbmEgdGhlIG9jdG9jYXQgaW4gc3BhYWFjY2VlXCIgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtZW1wdHlJbWdcIiAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLWVtcHR5VGV4dFwiPlxuICAgICAgICAgIFRoaXMgcHVsbCByZXF1ZXN0IGhhcyBubyByZXZpZXdzXG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLWVtcHR5Q2FsbFRvQWN0aW9uQnV0dG9uIGJ0blwiPlxuICAgICAgICAgIDxhIGhyZWY9e3B1bGxSZXF1ZXN0VVJMfSBvbkNsaWNrPXt0aGlzLmxvZ1N0YXJ0UmV2aWV3Q2xpY2t9PlxuICAgICAgICAgICAgU3RhcnQgYSBuZXcgcmV2aWV3XG4gICAgICAgICAgPC9hPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJSZXZpZXdTdW1tYXJpZXMoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuc3VtbWFyaWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyRW1wdHlTdGF0ZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IHRvZ2dsZSA9IGV2dCA9PiB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmICh0aGlzLnByb3BzLnN1bW1hcnlTZWN0aW9uT3Blbikge1xuICAgICAgICB0aGlzLnByb3BzLmhpZGVTdW1tYXJpZXMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucHJvcHMuc2hvd1N1bW1hcmllcygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRldGFpbHNcbiAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3Mtc2VjdGlvbiBzdW1tYXJpZXNcIlxuICAgICAgICBvcGVuPXt0aGlzLnByb3BzLnN1bW1hcnlTZWN0aW9uT3Blbn0+XG5cbiAgICAgICAgPHN1bW1hcnkgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtaGVhZGVyXCIgb25DbGljaz17dG9nZ2xlfT5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy10aXRsZVwiPlN1bW1hcmllczwvc3Bhbj5cbiAgICAgICAgPC9zdW1tYXJ5PlxuICAgICAgICA8bWFpbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1jb250YWluZXJcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5zdW1tYXJpZXMubWFwKHRoaXMucmVuZGVyUmV2aWV3U3VtbWFyeSl9XG4gICAgICAgIDwvbWFpbj5cblxuICAgICAgPC9kZXRhaWxzPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJSZXZpZXdTdW1tYXJ5ID0gcmV2aWV3ID0+IHtcbiAgICBjb25zdCByZXZpZXdUeXBlcyA9IHR5cGUgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgQVBQUk9WRUQ6IHtpY29uOiAnaWNvbi1jaGVjaycsIGNvcHk6ICdhcHByb3ZlZCB0aGVzZSBjaGFuZ2VzJ30sXG4gICAgICAgIENPTU1FTlRFRDoge2ljb246ICdpY29uLWNvbW1lbnQnLCBjb3B5OiAnY29tbWVudGVkJ30sXG4gICAgICAgIENIQU5HRVNfUkVRVUVTVEVEOiB7aWNvbjogJ2ljb24tYWxlcnQnLCBjb3B5OiAncmVxdWVzdGVkIGNoYW5nZXMnfSxcbiAgICAgIH1bdHlwZV0gfHwge2ljb246ICcnLCBjb3B5OiAnJ307XG4gICAgfTtcblxuICAgIGNvbnN0IHtpY29uLCBjb3B5fSA9IHJldmlld1R5cGVzKHJldmlldy5zdGF0ZSk7XG5cbiAgICAvLyBmaWx0ZXIgbm9uIGFjdGlvbmFibGUgZW1wdHkgc3VtbWFyeSBjb21tZW50cyBmcm9tIHRoaXMgdmlld1xuICAgIGlmIChyZXZpZXcuc3RhdGUgPT09ICdQRU5ESU5HJyB8fCAocmV2aWV3LnN0YXRlID09PSAnQ09NTUVOVEVEJyAmJiByZXZpZXcuYm9keUhUTUwgPT09ICcnKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgYXV0aG9yID0gcmV2aWV3LmF1dGhvciB8fCBHSE9TVF9VU0VSO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld1N1bW1hcnlcIiBrZXk9e3Jldmlldy5pZH0+XG4gICAgICAgIDxBY3Rpb25hYmxlUmV2aWV3Vmlld1xuICAgICAgICAgIG9yaWdpbmFsQ29udGVudD17cmV2aWV3fVxuICAgICAgICAgIGNvbmZpcm09e3RoaXMucHJvcHMuY29uZmlybX1cbiAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICBjb250ZW50VXBkYXRlcj17dGhpcy5wcm9wcy51cGRhdGVTdW1tYXJ5fVxuICAgICAgICAgIHJlbmRlcj17c2hvd0FjdGlvbnNNZW51ID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgICAgICAgICA8aGVhZGVyIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctaGVhZGVyLWF1dGhvckRhdGFcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgZ2l0aHViLVJldmlld1N1bW1hcnktaWNvbiBpY29uICR7aWNvbn1gfSAvPlxuICAgICAgICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdTdW1tYXJ5LWF2YXRhclwiXG4gICAgICAgICAgICAgICAgICAgICAgc3JjPXthdXRob3IuYXZhdGFyVXJsfSBhbHQ9e2F1dGhvci5sb2dpbn1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld1N1bW1hcnktdXNlcm5hbWVcIiBocmVmPXthdXRob3IudXJsfT57YXV0aG9yLmxvZ2lufTwvYT5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld1N1bW1hcnktdHlwZVwiPntjb3B5fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAge3RoaXMucmVuZGVyRWRpdGVkTGluayhyZXZpZXcpfVxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJBdXRob3JBc3NvY2lhdGlvbihyZXZpZXcpfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8VGltZWFnbyBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3U3VtbWFyeS10aW1lQWdvXCIgdGltZT17cmV2aWV3LnN1Ym1pdHRlZEF0fSBkaXNwbGF5U3R5bGU9XCJzaG9ydFwiIC8+XG4gICAgICAgICAgICAgICAgICA8T2N0aWNvblxuICAgICAgICAgICAgICAgICAgICBpY29uPVwiZWxsaXBzZXNcIlxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LWFjdGlvbnNNZW51XCJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17ZXZlbnQgPT4gc2hvd0FjdGlvbnNNZW51KGV2ZW50LCByZXZpZXcsIGF1dGhvcil9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvaGVhZGVyPlxuICAgICAgICAgICAgICAgIDxtYWluIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdTdW1tYXJ5LWNvbW1lbnRcIj5cbiAgICAgICAgICAgICAgICAgIDxHaXRodWJEb3Rjb21NYXJrZG93blxuICAgICAgICAgICAgICAgICAgICBodG1sPXtyZXZpZXcuYm9keUhUTUx9XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaFRvSXNzdWVpc2g9e3RoaXMucHJvcHMub3Blbklzc3VlaXNofVxuICAgICAgICAgICAgICAgICAgICBvcGVuSXNzdWVpc2hMaW5rSW5OZXdUYWI9e3RoaXMub3Blbklzc3VlaXNoTGlua0luTmV3VGFifVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDxFbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXJcbiAgICAgICAgICAgICAgICAgICAgcmVhY3RhYmxlPXtyZXZpZXd9XG4gICAgICAgICAgICAgICAgICAgIHRvb2x0aXBzPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICAgICAgICAgICAgICByZXBvcnRSZWxheUVycm9yPXt0aGlzLnByb3BzLnJlcG9ydFJlbGF5RXJyb3J9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvbWFpbj5cbiAgICAgICAgICAgICAgPC9GcmFnbWVudD5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJSZXZpZXdDb21tZW50VGhyZWFkcygpIHtcbiAgICBjb25zdCBjb21tZW50VGhyZWFkcyA9IHRoaXMucHJvcHMuY29tbWVudFRocmVhZHM7XG4gICAgaWYgKGNvbW1lbnRUaHJlYWRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzb2x2ZWRUaHJlYWRzID0gY29tbWVudFRocmVhZHMuZmlsdGVyKHBhaXIgPT4gcGFpci50aHJlYWQuaXNSZXNvbHZlZCk7XG4gICAgY29uc3QgdW5yZXNvbHZlZFRocmVhZHMgPSBjb21tZW50VGhyZWFkcy5maWx0ZXIocGFpciA9PiAhcGFpci50aHJlYWQuaXNSZXNvbHZlZCk7XG5cbiAgICBjb25zdCB0b2dnbGVDb21tZW50cyA9IGV2dCA9PiB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmICh0aGlzLnByb3BzLmNvbW1lbnRTZWN0aW9uT3Blbikge1xuICAgICAgICB0aGlzLnByb3BzLmhpZGVDb21tZW50cygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5wcm9wcy5zaG93Q29tbWVudHMoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkZXRhaWxzXG4gICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLXNlY3Rpb24gY29tbWVudHNcIlxuICAgICAgICBvcGVuPXt0aGlzLnByb3BzLmNvbW1lbnRTZWN0aW9uT3Blbn0+XG5cbiAgICAgICAgPHN1bW1hcnkgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtaGVhZGVyXCIgb25DbGljaz17dG9nZ2xlQ29tbWVudHN9PlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLXRpdGxlXCI+Q29tbWVudHM8L3NwYW4+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtcHJvZ3Jlc3NcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLWNvdW50XCI+XG4gICAgICAgICAgICAgIFJlc29sdmVkXG4gICAgICAgICAgICAgIHsnICd9PHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtY291bnROclwiPntyZXNvbHZlZFRocmVhZHMubGVuZ3RofTwvc3Bhbj57JyAnfVxuICAgICAgICAgICAgICBvZlxuICAgICAgICAgICAgICB7JyAnfTxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLWNvdW50TnJcIj57cmVzb2x2ZWRUaHJlYWRzLmxlbmd0aCArIHVucmVzb2x2ZWRUaHJlYWRzLmxlbmd0aH08L3NwYW4+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8cHJvZ3Jlc3NcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtcHJvZ2Vzc0JhclwiIHZhbHVlPXtyZXNvbHZlZFRocmVhZHMubGVuZ3RofVxuICAgICAgICAgICAgICBtYXg9e3Jlc29sdmVkVGhyZWFkcy5sZW5ndGggKyB1bnJlc29sdmVkVGhyZWFkcy5sZW5ndGh9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9zdW1tYXJ5PlxuXG4gICAgICAgIHt1bnJlc29sdmVkVGhyZWFkcy5sZW5ndGggPiAwICYmIDxtYWluIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLWNvbnRhaW5lclwiPlxuICAgICAgICAgIHt1bnJlc29sdmVkVGhyZWFkcy5tYXAodGhpcy5yZW5kZXJSZXZpZXdDb21tZW50VGhyZWFkKX1cbiAgICAgICAgPC9tYWluPn1cbiAgICAgICAge3Jlc29sdmVkVGhyZWFkcy5sZW5ndGggPiAwICYmIDxkZXRhaWxzIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLXNlY3Rpb24gcmVzb2x2ZWQtY29tbWVudHNcIiBvcGVuPlxuICAgICAgICAgIDxzdW1tYXJ5IGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLWhlYWRlclwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtdGl0bGVcIj5SZXNvbHZlZDwvc3Bhbj5cbiAgICAgICAgICA8L3N1bW1hcnk+XG4gICAgICAgICAgPG1haW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtY29udGFpbmVyXCI+XG4gICAgICAgICAgICB7cmVzb2x2ZWRUaHJlYWRzLm1hcCh0aGlzLnJlbmRlclJldmlld0NvbW1lbnRUaHJlYWQpfVxuICAgICAgICAgIDwvbWFpbj5cbiAgICAgICAgPC9kZXRhaWxzPn1cblxuICAgICAgPC9kZXRhaWxzPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJSZXZpZXdDb21tZW50VGhyZWFkID0gY29tbWVudFRocmVhZCA9PiB7XG4gICAgY29uc3Qge2NvbW1lbnRzLCB0aHJlYWR9ID0gY29tbWVudFRocmVhZDtcbiAgICBjb25zdCByb290Q29tbWVudCA9IGNvbW1lbnRzWzBdO1xuICAgIGlmICghcm9vdENvbW1lbnQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxldCB0aHJlYWRIb2xkZXIgPSB0aGlzLnRocmVhZEhvbGRlcnMuZ2V0KHRocmVhZC5pZCk7XG4gICAgaWYgKCF0aHJlYWRIb2xkZXIpIHtcbiAgICAgIHRocmVhZEhvbGRlciA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICAgIHRoaXMudGhyZWFkSG9sZGVycy5zZXQodGhyZWFkLmlkLCB0aHJlYWRIb2xkZXIpO1xuICAgIH1cblxuICAgIGNvbnN0IG5hdGl2ZVBhdGggPSB0b05hdGl2ZVBhdGhTZXAocm9vdENvbW1lbnQucGF0aCk7XG4gICAgY29uc3Qge2RpciwgYmFzZX0gPSBwYXRoLnBhcnNlKG5hdGl2ZVBhdGgpO1xuICAgIGNvbnN0IHtsaW5lTnVtYmVyLCBwb3NpdGlvblRleHR9ID0gdGhpcy5nZXRUcmFuc2xhdGVkUG9zaXRpb24ocm9vdENvbW1lbnQpO1xuXG4gICAgY29uc3QgcmVmSnVtcFRvRmlsZUJ1dHRvbiA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICBjb25zdCBqdW1wVG9GaWxlRGlzYWJsZWRMYWJlbCA9ICdDaGVja291dCB0aGlzIHB1bGwgcmVxdWVzdCB0byBlbmFibGUgSnVtcCBUbyBGaWxlLic7XG5cbiAgICBjb25zdCBlbGVtZW50SWQgPSBgcmV2aWV3LXRocmVhZC0ke3RocmVhZC5pZH1gO1xuXG4gICAgY29uc3QgbmF2QnV0dG9uQ2xhc3NlcyA9IFsnZ2l0aHViLVJldmlldy1uYXZCdXR0b24nLCAnaWNvbicsIHtvdXRkYXRlZDogIWxpbmVOdW1iZXJ9XTtcbiAgICBjb25zdCBvcGVuRmlsZUNsYXNzZXMgPSBjeCgnaWNvbi1jb2RlJywgLi4ubmF2QnV0dG9uQ2xhc3Nlcyk7XG4gICAgY29uc3Qgb3BlbkRpZmZDbGFzc2VzID0gY3goJ2ljb24tZGlmZicsIC4uLm5hdkJ1dHRvbkNsYXNzZXMpO1xuXG4gICAgY29uc3QgaXNPcGVuID0gdGhpcy5wcm9wcy50aHJlYWRJRHNPcGVuLmhhcyh0aHJlYWQuaWQpO1xuICAgIGNvbnN0IGlzSGlnaGxpZ2h0ZWQgPSB0aGlzLnByb3BzLmhpZ2hsaWdodGVkVGhyZWFkSURzLmhhcyh0aHJlYWQuaWQpO1xuICAgIGNvbnN0IHRvZ2dsZSA9IGV2dCA9PiB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgaWYgKGlzT3Blbikge1xuICAgICAgICB0aGlzLnByb3BzLmhpZGVUaHJlYWRJRCh0aHJlYWQuaWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5wcm9wcy5zaG93VGhyZWFkSUQodGhyZWFkLmlkKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgYXV0aG9yID0gcm9vdENvbW1lbnQuYXV0aG9yIHx8IEdIT1NUX1VTRVI7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRldGFpbHNcbiAgICAgICAgcmVmPXt0aHJlYWRIb2xkZXIuc2V0dGVyfVxuICAgICAgICBjbGFzc05hbWU9e2N4KCdnaXRodWItUmV2aWV3JywgeydyZXNvbHZlZCc6IHRocmVhZC5pc1Jlc29sdmVkLCAnZ2l0aHViLVJldmlldy0taGlnaGxpZ2h0JzogaXNIaWdobGlnaHRlZH0pfVxuICAgICAgICBrZXk9e2VsZW1lbnRJZH1cbiAgICAgICAgaWQ9e2VsZW1lbnRJZH1cbiAgICAgICAgb3Blbj17aXNPcGVufT5cblxuICAgICAgICA8c3VtbWFyeSBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LXJlZmVyZW5jZVwiIG9uQ2xpY2s9e3RvZ2dsZX0+XG4gICAgICAgICAge2RpciAmJiA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LXBhdGhcIj57ZGlyfTwvc3Bhbj59XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1maWxlXCI+e2RpciA/IHBhdGguc2VwIDogJyd9e2Jhc2V9PC9zcGFuPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctbGluZU5yXCI+e3Bvc2l0aW9uVGV4dH08L3NwYW4+XG4gICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LXJlZmVyZW5jZUF2YXRhclwiXG4gICAgICAgICAgICBzcmM9e2F1dGhvci5hdmF0YXJVcmx9IGFsdD17YXV0aG9yLmxvZ2lufVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFRpbWVhZ28gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1yZWZlcmVuY2VUaW1lQWdvXCIgdGltZT17cm9vdENvbW1lbnQuY3JlYXRlZEF0fSBkaXNwbGF5U3R5bGU9XCJzaG9ydFwiIC8+XG4gICAgICAgIDwvc3VtbWFyeT5cbiAgICAgICAgPG5hdiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LW5hdlwiPlxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPXtvcGVuRmlsZUNsYXNzZXN9XG4gICAgICAgICAgICBkYXRhLXBhdGg9e25hdGl2ZVBhdGh9IGRhdGEtbGluZT17bGluZU51bWJlcn1cbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMub3BlbkZpbGV9IGRpc2FibGVkPXt0aGlzLnByb3BzLmNoZWNrb3V0T3AuaXNFbmFibGVkKCl9XG4gICAgICAgICAgICByZWY9e3JlZkp1bXBUb0ZpbGVCdXR0b24uc2V0dGVyfT5cbiAgICAgICAgICAgIEp1bXAgVG8gRmlsZVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPXtvcGVuRGlmZkNsYXNzZXN9XG4gICAgICAgICAgICBkYXRhLXBhdGg9e25hdGl2ZVBhdGh9IGRhdGEtbGluZT17cm9vdENvbW1lbnQucG9zaXRpb259XG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLm9wZW5EaWZmfT5cbiAgICAgICAgICAgIE9wZW4gRGlmZlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIHt0aGlzLnByb3BzLmNoZWNrb3V0T3AuaXNFbmFibGVkKCkgJiZcbiAgICAgICAgICAgIDxUb29sdGlwXG4gICAgICAgICAgICAgIG1hbmFnZXI9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgICAgIHRhcmdldD17cmVmSnVtcFRvRmlsZUJ1dHRvbn1cbiAgICAgICAgICAgICAgdGl0bGU9e2p1bXBUb0ZpbGVEaXNhYmxlZExhYmVsfVxuICAgICAgICAgICAgICBzaG93RGVsYXk9ezIwMH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgfVxuICAgICAgICA8L25hdj5cblxuICAgICAgICB7cm9vdENvbW1lbnQucG9zaXRpb24gIT09IG51bGwgJiYgKFxuICAgICAgICAgIDxQYXRjaFByZXZpZXdWaWV3XG4gICAgICAgICAgICBtdWx0aUZpbGVQYXRjaD17dGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaH1cbiAgICAgICAgICAgIGZpbGVOYW1lPXtuYXRpdmVQYXRofVxuICAgICAgICAgICAgZGlmZlJvdz17cm9vdENvbW1lbnQucG9zaXRpb259XG4gICAgICAgICAgICBtYXhSb3dDb3VudD17dGhpcy5wcm9wcy5jb250ZXh0TGluZXN9XG4gICAgICAgICAgICBjb25maWc9e3RoaXMucHJvcHMuY29uZmlnfVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG5cbiAgICAgICAge3RoaXMucmVuZGVyVGhyZWFkKHt0aHJlYWQsIGNvbW1lbnRzfSl9XG5cbiAgICAgIDwvZGV0YWlscz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyVGhyZWFkID0gKHt0aHJlYWQsIGNvbW1lbnRzfSkgPT4ge1xuICAgIGxldCByZXBseUhvbGRlciA9IHRoaXMucmVwbHlIb2xkZXJzLmdldCh0aHJlYWQuaWQpO1xuICAgIGlmICghcmVwbHlIb2xkZXIpIHtcbiAgICAgIHJlcGx5SG9sZGVyID0gbmV3IFJlZkhvbGRlcigpO1xuICAgICAgdGhpcy5yZXBseUhvbGRlcnMuc2V0KHRocmVhZC5pZCwgcmVwbHlIb2xkZXIpO1xuICAgIH1cblxuICAgIGNvbnN0IGxhc3RDb21tZW50ID0gY29tbWVudHNbY29tbWVudHMubGVuZ3RoIC0gMV07XG4gICAgY29uc3QgaXNQb3N0aW5nID0gdGhpcy5wcm9wcy5wb3N0aW5nVG9UaHJlYWRJRCAhPT0gbnVsbDtcblxuICAgIHJldHVybiAoXG4gICAgICA8RnJhZ21lbnQ+XG4gICAgICAgIDxtYWluIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctY29tbWVudHNcIj5cblxuICAgICAgICAgIHtjb21tZW50cy5tYXAoY29tbWVudCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8UmV2aWV3Q29tbWVudFZpZXdcbiAgICAgICAgICAgICAgICBrZXk9e2NvbW1lbnQuaWR9XG4gICAgICAgICAgICAgICAgY29tbWVudD17Y29tbWVudH1cbiAgICAgICAgICAgICAgICBvcGVuSXNzdWVpc2g9e3RoaXMucHJvcHMub3Blbklzc3VlaXNofVxuICAgICAgICAgICAgICAgIG9wZW5Jc3N1ZWlzaExpbmtJbk5ld1RhYj17dGhpcy5vcGVuSXNzdWVpc2hMaW5rSW5OZXdUYWJ9XG4gICAgICAgICAgICAgICAgdG9vbHRpcHM9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgICAgICAgcmVwb3J0UmVsYXlFcnJvcj17dGhpcy5wcm9wcy5yZXBvcnRSZWxheUVycm9yfVxuICAgICAgICAgICAgICAgIHJlbmRlckVkaXRlZExpbms9e3RoaXMucmVuZGVyRWRpdGVkTGlua31cbiAgICAgICAgICAgICAgICByZW5kZXJBdXRob3JBc3NvY2lhdGlvbj17dGhpcy5yZW5kZXJBdXRob3JBc3NvY2lhdGlvbn1cbiAgICAgICAgICAgICAgICBpc1Bvc3Rpbmc9e2lzUG9zdGluZ31cbiAgICAgICAgICAgICAgICBjb25maXJtPXt0aGlzLnByb3BzLmNvbmZpcm19XG4gICAgICAgICAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgICAgICAgICAgdXBkYXRlQ29tbWVudD17dGhpcy5wcm9wcy51cGRhdGVDb21tZW50fVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KX1cblxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y3goJ2dpdGh1Yi1SZXZpZXctcmVwbHknLCB7J2dpdGh1Yi1SZXZpZXctcmVwbHktLWRpc2FibGVkJzogaXNQb3N0aW5nfSl9XG4gICAgICAgICAgICBkYXRhLXRocmVhZC1pZD17dGhyZWFkLmlkfT5cblxuICAgICAgICAgICAgPEF0b21UZXh0RWRpdG9yXG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyVGV4dD1cIlJlcGx5Li4uXCJcbiAgICAgICAgICAgICAgbGluZU51bWJlckd1dHRlclZpc2libGU9e2ZhbHNlfVxuICAgICAgICAgICAgICBzb2Z0V3JhcHBlZD17dHJ1ZX1cbiAgICAgICAgICAgICAgYXV0b0hlaWdodD17dHJ1ZX1cbiAgICAgICAgICAgICAgcmVhZE9ubHk9e2lzUG9zdGluZ31cbiAgICAgICAgICAgICAgcmVmTW9kZWw9e3JlcGx5SG9sZGVyfVxuICAgICAgICAgICAgLz5cblxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L21haW4+XG4gICAgICAgIHt0aHJlYWQuaXNSZXNvbHZlZCAmJiA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctcmVzb2x2ZWRUZXh0XCI+XG4gICAgICAgICAgVGhpcyBjb252ZXJzYXRpb24gd2FzIG1hcmtlZCBhcyByZXNvbHZlZCBieSBAe3RocmVhZC5yZXNvbHZlZEJ5LmxvZ2lufVxuICAgICAgICA8L2Rpdj59XG4gICAgICAgIDxmb290ZXIgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1mb290ZXJcIj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LXJlcGx5QnV0dG9uIGJ0biBidG4tcHJpbWFyeVwiXG4gICAgICAgICAgICB0aXRsZT1cIkFkZCB5b3VyIGNvbW1lbnRcIlxuICAgICAgICAgICAgZGlzYWJsZWQ9e2lzUG9zdGluZ31cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMuc3VibWl0UmVwbHkocmVwbHlIb2xkZXIsIHRocmVhZCwgbGFzdENvbW1lbnQpfT5cbiAgICAgICAgICAgIENvbW1lbnRcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJSZXNvbHZlQnV0dG9uKHRocmVhZCl9XG4gICAgICAgIDwvZm9vdGVyPlxuICAgICAgPC9GcmFnbWVudD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyUmVzb2x2ZUJ1dHRvbiA9IHRocmVhZCA9PiB7XG4gICAgaWYgKHRocmVhZC5pc1Jlc29sdmVkKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1yZXNvbHZlQnV0dG9uIGJ0biBpY29uIGljb24tY2hlY2tcIlxuICAgICAgICAgIHRpdGxlPVwiVW5yZXNvbHZlIGNvbnZlcnNhdGlvblwiXG4gICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5yZXNvbHZlVW5yZXNvbHZlVGhyZWFkKHRocmVhZCl9PlxuICAgICAgICAgIFVucmVzb2x2ZSBjb252ZXJzYXRpb25cbiAgICAgICAgPC9idXR0b24+XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1yZXNvbHZlQnV0dG9uIGJ0biBpY29uIGljb24tY2hlY2tcIlxuICAgICAgICAgIHRpdGxlPVwiUmVzb2x2ZSBjb252ZXJzYXRpb25cIlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMucmVzb2x2ZVVucmVzb2x2ZVRocmVhZCh0aHJlYWQpfT5cbiAgICAgICAgICBSZXNvbHZlIGNvbnZlcnNhdGlvblxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyRWRpdGVkTGluayhlbnRpdHkpIHtcbiAgICBpZiAoIWVudGl0eS5sYXN0RWRpdGVkQXQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LWVkaXRlZFwiPlxuICAgICAgICAmbmJzcDvigKImbmJzcDtcbiAgICAgICAgICA8YSBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LWVkaXRlZFwiIGhyZWY9e2VudGl0eS51cmx9PmVkaXRlZDwvYT5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXJBdXRob3JBc3NvY2lhdGlvbihlbnRpdHkpIHtcbiAgICBjb25zdCB0ZXh0ID0gYXV0aG9yQXNzb2NpYXRpb25UZXh0W2VudGl0eS5hdXRob3JBc3NvY2lhdGlvbl07XG4gICAgaWYgKCF0ZXh0KSB7IHJldHVybiBudWxsOyB9XG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctYXV0aG9yQXNzb2NpYXRpb25CYWRnZSBiYWRnZVwiPnt0ZXh0fTwvc3Bhbj5cbiAgICApO1xuICB9XG5cbiAgb3BlbkZpbGUgPSBldnQgPT4ge1xuICAgIGlmICghdGhpcy5wcm9wcy5jaGVja291dE9wLmlzRW5hYmxlZCgpKSB7XG4gICAgICBjb25zdCB0YXJnZXQgPSBldnQuY3VycmVudFRhcmdldDtcbiAgICAgIHRoaXMucHJvcHMub3BlbkZpbGUodGFyZ2V0LmRhdGFzZXQucGF0aCwgdGFyZ2V0LmRhdGFzZXQubGluZSk7XG4gICAgfVxuICB9XG5cbiAgb3BlbkRpZmYgPSBldnQgPT4ge1xuICAgIGNvbnN0IHRhcmdldCA9IGV2dC5jdXJyZW50VGFyZ2V0O1xuICAgIHRoaXMucHJvcHMub3BlbkRpZmYodGFyZ2V0LmRhdGFzZXQucGF0aCwgcGFyc2VJbnQodGFyZ2V0LmRhdGFzZXQubGluZSwgMTApKTtcbiAgfVxuXG4gIG9wZW5Jc3N1ZWlzaExpbmtJbk5ld1RhYiA9IGV2dCA9PiB7XG4gICAgY29uc3Qge3JlcG9Pd25lciwgcmVwb05hbWUsIGlzc3VlaXNoTnVtYmVyfSA9IGdldERhdGFGcm9tR2l0aHViVXJsKGV2dC50YXJnZXQuZGF0YXNldC51cmwpO1xuICAgIHJldHVybiB0aGlzLnByb3BzLm9wZW5Jc3N1ZWlzaChyZXBvT3duZXIsIHJlcG9OYW1lLCBpc3N1ZWlzaE51bWJlcik7XG4gIH1cblxuICBzdWJtaXRSZXBseShyZXBseUhvbGRlciwgdGhyZWFkLCBsYXN0Q29tbWVudCkge1xuICAgIGNvbnN0IGJvZHkgPSByZXBseUhvbGRlci5tYXAoZWRpdG9yID0+IGVkaXRvci5nZXRUZXh0KCkpLmdldE9yKCcnKTtcbiAgICBjb25zdCBkaWRTdWJtaXRDb21tZW50ID0gKCkgPT4gcmVwbHlIb2xkZXIubWFwKGVkaXRvciA9PiBlZGl0b3Iuc2V0VGV4dCgnJywge2J5cGFzc1JlYWRPbmx5OiB0cnVlfSkpO1xuICAgIGNvbnN0IGRpZEZhaWxDb21tZW50ID0gKCkgPT4gcmVwbHlIb2xkZXIubWFwKGVkaXRvciA9PiBlZGl0b3Iuc2V0VGV4dChib2R5LCB7YnlwYXNzUmVhZE9ubHk6IHRydWV9KSk7XG5cbiAgICByZXR1cm4gdGhpcy5wcm9wcy5hZGRTaW5nbGVDb21tZW50KFxuICAgICAgYm9keSwgdGhyZWFkLmlkLCBsYXN0Q29tbWVudC5pZCwgbGFzdENvbW1lbnQucGF0aCwgbGFzdENvbW1lbnQucG9zaXRpb24sIHtkaWRTdWJtaXRDb21tZW50LCBkaWRGYWlsQ29tbWVudH0sXG4gICAgKTtcbiAgfVxuXG4gIHN1Ym1pdEN1cnJlbnRDb21tZW50ID0gZXZ0ID0+IHtcbiAgICBjb25zdCB0aHJlYWRJRCA9IGV2dC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQudGhyZWFkSWQ7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKCF0aHJlYWRJRCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3Qge3RocmVhZCwgY29tbWVudHN9ID0gdGhpcy5wcm9wcy5jb21tZW50VGhyZWFkcy5maW5kKGVhY2ggPT4gZWFjaC50aHJlYWQuaWQgPT09IHRocmVhZElEKTtcbiAgICBjb25zdCByZXBseUhvbGRlciA9IHRoaXMucmVwbHlIb2xkZXJzLmdldCh0aHJlYWRJRCk7XG5cbiAgICByZXR1cm4gdGhpcy5zdWJtaXRSZXBseShyZXBseUhvbGRlciwgdGhyZWFkLCBjb21tZW50c1tjb21tZW50cy5sZW5ndGggLSAxXSk7XG4gIH1cblxuICBnZXRUcmFuc2xhdGVkUG9zaXRpb24ocm9vdENvbW1lbnQpIHtcbiAgICBsZXQgbGluZU51bWJlciwgcG9zaXRpb25UZXh0O1xuICAgIGNvbnN0IHRyYW5zbGF0aW9ucyA9IHRoaXMucHJvcHMuY29tbWVudFRyYW5zbGF0aW9ucztcblxuICAgIGNvbnN0IGlzQ2hlY2tlZE91dFB1bGxSZXF1ZXN0ID0gdGhpcy5wcm9wcy5jaGVja291dE9wLndoeSgpID09PSBjaGVja291dFN0YXRlcy5DVVJSRU5UO1xuICAgIGlmICh0cmFuc2xhdGlvbnMgPT09IG51bGwpIHtcbiAgICAgIGxpbmVOdW1iZXIgPSBudWxsO1xuICAgICAgcG9zaXRpb25UZXh0ID0gJyc7XG4gICAgfSBlbHNlIGlmIChyb290Q29tbWVudC5wb3NpdGlvbiA9PT0gbnVsbCkge1xuICAgICAgbGluZU51bWJlciA9IG51bGw7XG4gICAgICBwb3NpdGlvblRleHQgPSAnb3V0ZGF0ZWQnO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB0cmFuc2xhdGlvbnNGb3JGaWxlID0gdHJhbnNsYXRpb25zLmdldChwYXRoLm5vcm1hbGl6ZShyb290Q29tbWVudC5wYXRoKSk7XG4gICAgICBsaW5lTnVtYmVyID0gdHJhbnNsYXRpb25zRm9yRmlsZS5kaWZmVG9GaWxlUG9zaXRpb24uZ2V0KHBhcnNlSW50KHJvb3RDb21tZW50LnBvc2l0aW9uLCAxMCkpO1xuICAgICAgaWYgKHRyYW5zbGF0aW9uc0ZvckZpbGUuZmlsZVRyYW5zbGF0aW9ucyAmJiBpc0NoZWNrZWRPdXRQdWxsUmVxdWVzdCkge1xuICAgICAgICBsaW5lTnVtYmVyID0gdHJhbnNsYXRpb25zRm9yRmlsZS5maWxlVHJhbnNsYXRpb25zLmdldChsaW5lTnVtYmVyKS5uZXdQb3NpdGlvbjtcbiAgICAgIH1cbiAgICAgIHBvc2l0aW9uVGV4dCA9IGxpbmVOdW1iZXI7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtsaW5lTnVtYmVyLCBwb3NpdGlvblRleHR9O1xuICB9XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgc2Nyb2xsVG9UaHJlYWQodGhyZWFkSUQpIHtcbiAgICBjb25zdCB0aHJlYWRIb2xkZXIgPSB0aGlzLnRocmVhZEhvbGRlcnMuZ2V0KHRocmVhZElEKTtcbiAgICBpZiAodGhyZWFkSG9sZGVyKSB7XG4gICAgICB0aHJlYWRIb2xkZXIubWFwKGVsZW1lbnQgPT4ge1xuICAgICAgICBlbGVtZW50LnNjcm9sbEludG9WaWV3SWZOZWVkZWQoKTtcbiAgICAgICAgcmV0dXJuIG51bGw7IC8vIHNoaCwgZXNsaW50XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBhc3luYyByZXNvbHZlVW5yZXNvbHZlVGhyZWFkKHRocmVhZCkge1xuICAgIGlmICh0aHJlYWQuaXNSZXNvbHZlZCkge1xuICAgICAgYXdhaXQgdGhpcy5wcm9wcy51bnJlc29sdmVUaHJlYWQodGhyZWFkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgdGhpcy5wcm9wcy5yZXNvbHZlVGhyZWFkKHRocmVhZCk7XG4gICAgfVxuICB9XG59XG4iXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLElBQUFBLEtBQUEsR0FBQUMsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFDLE1BQUEsR0FBQUMsdUJBQUEsQ0FBQUYsT0FBQTtBQUNBLElBQUFHLFVBQUEsR0FBQUosc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFJLFdBQUEsR0FBQUwsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFLLFNBQUEsR0FBQUwsT0FBQTtBQUVBLElBQUFNLFdBQUEsR0FBQU4sT0FBQTtBQUNBLElBQUFPLFFBQUEsR0FBQVIsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFRLFNBQUEsR0FBQU4sdUJBQUEsQ0FBQUYsT0FBQTtBQUNBLElBQUFTLGVBQUEsR0FBQVYsc0JBQUEsQ0FBQUMsT0FBQTtBQUNBLElBQUFVLGFBQUEsR0FBQVYsT0FBQTtBQUNBLElBQUFX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