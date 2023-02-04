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
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function (nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJhdXRob3JBc3NvY2lhdGlvblRleHQiLCJNRU1CRVIiLCJPV05FUiIsIkNPTExBQk9SQVRPUiIsIkNPTlRSSUJVVE9SIiwiRklSU1RfVElNRV9DT05UUklCVVRPUiIsIkZJUlNUX1RJTUVSIiwiTk9ORSIsIlJldmlld3NWaWV3IiwiUmVhY3QiLCJDb21wb25lbnQiLCJjb25zdHJ1Y3RvciIsInByb3BzIiwiYWRkRXZlbnQiLCJwYWNrYWdlIiwiY29tcG9uZW50IiwibmFtZSIsInJldmlldyIsInJldmlld1R5cGVzIiwidHlwZSIsIkFQUFJPVkVEIiwiaWNvbiIsImNvcHkiLCJDT01NRU5URUQiLCJDSEFOR0VTX1JFUVVFU1RFRCIsInN0YXRlIiwiYm9keUhUTUwiLCJhdXRob3IiLCJHSE9TVF9VU0VSIiwiaWQiLCJjb25maXJtIiwiY29tbWFuZHMiLCJ1cGRhdGVTdW1tYXJ5Iiwic2hvd0FjdGlvbnNNZW51IiwiYXZhdGFyVXJsIiwibG9naW4iLCJ1cmwiLCJyZW5kZXJFZGl0ZWRMaW5rIiwicmVuZGVyQXV0aG9yQXNzb2NpYXRpb24iLCJzdWJtaXR0ZWRBdCIsImV2ZW50Iiwib3Blbklzc3VlaXNoIiwib3Blbklzc3VlaXNoTGlua0luTmV3VGFiIiwidG9vbHRpcHMiLCJyZXBvcnRSZWxheUVycm9yIiwiY29tbWVudFRocmVhZCIsImNvbW1lbnRzIiwidGhyZWFkIiwicm9vdENvbW1lbnQiLCJ0aHJlYWRIb2xkZXIiLCJ0aHJlYWRIb2xkZXJzIiwiZ2V0IiwiUmVmSG9sZGVyIiwic2V0IiwibmF0aXZlUGF0aCIsInRvTmF0aXZlUGF0aFNlcCIsInBhdGgiLCJkaXIiLCJiYXNlIiwicGFyc2UiLCJsaW5lTnVtYmVyIiwicG9zaXRpb25UZXh0IiwiZ2V0VHJhbnNsYXRlZFBvc2l0aW9uIiwicmVmSnVtcFRvRmlsZUJ1dHRvbiIsImp1bXBUb0ZpbGVEaXNhYmxlZExhYmVsIiwiZWxlbWVudElkIiwibmF2QnV0dG9uQ2xhc3NlcyIsIm91dGRhdGVkIiwib3BlbkZpbGVDbGFzc2VzIiwiY3giLCJvcGVuRGlmZkNsYXNzZXMiLCJpc09wZW4iLCJ0aHJlYWRJRHNPcGVuIiwiaGFzIiwiaXNIaWdobGlnaHRlZCIsImhpZ2hsaWdodGVkVGhyZWFkSURzIiwidG9nZ2xlIiwiZXZ0IiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJoaWRlVGhyZWFkSUQiLCJzaG93VGhyZWFkSUQiLCJzZXR0ZXIiLCJpc1Jlc29sdmVkIiwic2VwIiwiY3JlYXRlZEF0Iiwib3BlbkZpbGUiLCJjaGVja291dE9wIiwiaXNFbmFibGVkIiwicG9zaXRpb24iLCJvcGVuRGlmZiIsIm11bHRpRmlsZVBhdGNoIiwiY29udGV4dExpbmVzIiwiY29uZmlnIiwicmVuZGVyVGhyZWFkIiwicmVwbHlIb2xkZXIiLCJyZXBseUhvbGRlcnMiLCJsYXN0Q29tbWVudCIsImxlbmd0aCIsImlzUG9zdGluZyIsInBvc3RpbmdUb1RocmVhZElEIiwibWFwIiwiY29tbWVudCIsInVwZGF0ZUNvbW1lbnQiLCJyZXNvbHZlZEJ5Iiwic3VibWl0UmVwbHkiLCJyZW5kZXJSZXNvbHZlQnV0dG9uIiwicmVzb2x2ZVVucmVzb2x2ZVRocmVhZCIsInRhcmdldCIsImN1cnJlbnRUYXJnZXQiLCJkYXRhc2V0IiwibGluZSIsInBhcnNlSW50IiwicmVwb093bmVyIiwicmVwb05hbWUiLCJpc3N1ZWlzaE51bWJlciIsImdldERhdGFGcm9tR2l0aHViVXJsIiwidGhyZWFkSUQiLCJ0aHJlYWRJZCIsImNvbW1lbnRUaHJlYWRzIiwiZmluZCIsImVhY2giLCJyb290SG9sZGVyIiwiTWFwIiwiaXNSZWZyZXNoaW5nIiwic3VicyIsIkNvbXBvc2l0ZURpc3Bvc2FibGUiLCJjb21wb25lbnREaWRNb3VudCIsInNjcm9sbFRvVGhyZWFkSUQiLCJzY3JvbGxUb1RocmVhZCIsImNvbXBvbmVudERpZFVwZGF0ZSIsInByZXZQcm9wcyIsImNvbXBvbmVudFdpbGxVbm1vdW50IiwiZGlzcG9zZSIsInJlbmRlciIsInJlbmRlckNvbW1hbmRzIiwicmVuZGVySGVhZGVyIiwicmVuZGVyUmV2aWV3U3VtbWFyaWVzIiwicmVuZGVyUmV2aWV3Q29tbWVudFRocmVhZHMiLCJtb3JlQ29udGV4dCIsImxlc3NDb250ZXh0Iiwic3VibWl0Q3VycmVudENvbW1lbnQiLCJyZWZyZXNoIiwic2V0U3RhdGUiLCJzdWIiLCJyZWZldGNoIiwicmVtb3ZlIiwiYWRkIiwib3BlblBSIiwib3duZXIiLCJyZXBvIiwibnVtYmVyIiwicmVmcmVzaGluZyIsInJlbmRlckVtcHR5U3RhdGUiLCJwdWxsUmVxdWVzdFVSTCIsImxvZ1N0YXJ0UmV2aWV3Q2xpY2siLCJzdW1tYXJpZXMiLCJzdW1tYXJ5U2VjdGlvbk9wZW4iLCJoaWRlU3VtbWFyaWVzIiwic2hvd1N1bW1hcmllcyIsInJlbmRlclJldmlld1N1bW1hcnkiLCJyZXNvbHZlZFRocmVhZHMiLCJmaWx0ZXIiLCJwYWlyIiwidW5yZXNvbHZlZFRocmVhZHMiLCJ0b2dnbGVDb21tZW50cyIsImNvbW1lbnRTZWN0aW9uT3BlbiIsImhpZGVDb21tZW50cyIsInNob3dDb21tZW50cyIsInJlbmRlclJldmlld0NvbW1lbnRUaHJlYWQiLCJlbnRpdHkiLCJsYXN0RWRpdGVkQXQiLCJ0ZXh0IiwiYXV0aG9yQXNzb2NpYXRpb24iLCJib2R5IiwiZWRpdG9yIiwiZ2V0VGV4dCIsImdldE9yIiwiZGlkU3VibWl0Q29tbWVudCIsInNldFRleHQiLCJieXBhc3NSZWFkT25seSIsImRpZEZhaWxDb21tZW50IiwiYWRkU2luZ2xlQ29tbWVudCIsInRyYW5zbGF0aW9ucyIsImNvbW1lbnRUcmFuc2xhdGlvbnMiLCJpc0NoZWNrZWRPdXRQdWxsUmVxdWVzdCIsIndoeSIsImNoZWNrb3V0U3RhdGVzIiwiQ1VSUkVOVCIsInRyYW5zbGF0aW9uc0ZvckZpbGUiLCJub3JtYWxpemUiLCJkaWZmVG9GaWxlUG9zaXRpb24iLCJmaWxlVHJhbnNsYXRpb25zIiwibmV3UG9zaXRpb24iLCJlbGVtZW50Iiwic2Nyb2xsSW50b1ZpZXdJZk5lZWRlZCIsInVucmVzb2x2ZVRocmVhZCIsInJlc29sdmVUaHJlYWQiLCJyZWxheSIsIlByb3BUeXBlcyIsInNoYXBlIiwiZW52aXJvbm1lbnQiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwicmVwb3NpdG9yeSIsInB1bGxSZXF1ZXN0IiwiYXJyYXkiLCJhcnJheU9mIiwiZnVuYyIsIkVuYWJsZWFibGVPcGVyYXRpb25Qcm9wVHlwZSIsImJvb2wiLCJzdHJpbmciLCJ3b3JrZGlyIiwid29ya3NwYWNlIl0sInNvdXJjZXMiOlsicmV2aWV3cy12aWV3LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IFJlYWN0LCB7RnJhZ21lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY3ggZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2V2ZW50LWtpdCc7XG5cbmltcG9ydCB7RW5hYmxlYWJsZU9wZXJhdGlvblByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCBUb29sdGlwIGZyb20gJy4uL2F0b20vdG9vbHRpcCc7XG5pbXBvcnQgQ29tbWFuZHMsIHtDb21tYW5kfSBmcm9tICcuLi9hdG9tL2NvbW1hbmRzJztcbmltcG9ydCBBdG9tVGV4dEVkaXRvciBmcm9tICcuLi9hdG9tL2F0b20tdGV4dC1lZGl0b3InO1xuaW1wb3J0IHtnZXREYXRhRnJvbUdpdGh1YlVybH0gZnJvbSAnLi9pc3N1ZWlzaC1saW5rJztcbmltcG9ydCBFbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXIgZnJvbSAnLi4vY29udHJvbGxlcnMvZW1vamktcmVhY3Rpb25zLWNvbnRyb2xsZXInO1xuaW1wb3J0IHtjaGVja291dFN0YXRlc30gZnJvbSAnLi4vY29udHJvbGxlcnMvcHItY2hlY2tvdXQtY29udHJvbGxlcic7XG5pbXBvcnQgR2l0aHViRG90Y29tTWFya2Rvd24gZnJvbSAnLi9naXRodWItZG90Y29tLW1hcmtkb3duJztcbmltcG9ydCBQYXRjaFByZXZpZXdWaWV3IGZyb20gJy4vcGF0Y2gtcHJldmlldy12aWV3JztcbmltcG9ydCBSZXZpZXdDb21tZW50VmlldyBmcm9tICcuL3Jldmlldy1jb21tZW50LXZpZXcnO1xuaW1wb3J0IEFjdGlvbmFibGVSZXZpZXdWaWV3IGZyb20gJy4vYWN0aW9uYWJsZS1yZXZpZXctdmlldyc7XG5pbXBvcnQgQ2hlY2tvdXRCdXR0b24gZnJvbSAnLi9jaGVja291dC1idXR0b24nO1xuaW1wb3J0IE9jdGljb24gZnJvbSAnLi4vYXRvbS9vY3RpY29uJztcbmltcG9ydCBUaW1lYWdvIGZyb20gJy4vdGltZWFnbyc7XG5pbXBvcnQgUmVmSG9sZGVyIGZyb20gJy4uL21vZGVscy9yZWYtaG9sZGVyJztcbmltcG9ydCB7dG9OYXRpdmVQYXRoU2VwLCBHSE9TVF9VU0VSfSBmcm9tICcuLi9oZWxwZXJzJztcbmltcG9ydCB7YWRkRXZlbnR9IGZyb20gJy4uL3JlcG9ydGVyLXByb3h5JztcblxuY29uc3QgYXV0aG9yQXNzb2NpYXRpb25UZXh0ID0ge1xuICBNRU1CRVI6ICdNZW1iZXInLFxuICBPV05FUjogJ093bmVyJyxcbiAgQ09MTEFCT1JBVE9SOiAnQ29sbGFib3JhdG9yJyxcbiAgQ09OVFJJQlVUT1I6ICdDb250cmlidXRvcicsXG4gIEZJUlNUX1RJTUVfQ09OVFJJQlVUT1I6ICdGaXJzdC10aW1lIGNvbnRyaWJ1dG9yJyxcbiAgRklSU1RfVElNRVI6ICdGaXJzdC10aW1lcicsXG4gIE5PTkU6IG51bGwsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXZpZXdzVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gUmVsYXkgcmVzdWx0c1xuICAgIHJlbGF5OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgZW52aXJvbm1lbnQ6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICAgIHJlcG9zaXRvcnk6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBwdWxsUmVxdWVzdDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHN1bW1hcmllczogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gICAgY29tbWVudFRocmVhZHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICB0aHJlYWQ6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgIGNvbW1lbnRzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICAgIH0pKSxcbiAgICByZWZldGNoOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gICAgLy8gUGFja2FnZSBtb2RlbHNcbiAgICBtdWx0aUZpbGVQYXRjaDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbnRleHRMaW5lczogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIGNoZWNrb3V0T3A6IEVuYWJsZWFibGVPcGVyYXRpb25Qcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHN1bW1hcnlTZWN0aW9uT3BlbjogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBjb21tZW50U2VjdGlvbk9wZW46IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgdGhyZWFkSURzT3BlbjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGhhczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB9KSxcbiAgICBoaWdobGlnaHRlZFRocmVhZElEczogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGhhczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB9KSxcbiAgICBwb3N0aW5nVG9UaHJlYWRJRDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBzY3JvbGxUb1RocmVhZElEOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIC8vIFN0cnVjdHVyZTogTWFwPCByZWxhdGl2ZVBhdGg6IFN0cmluZywge1xuICAgIC8vICAgcmF3UG9zaXRpb25zOiBTZXQ8bGluZU51bWJlcnM6IE51bWJlcj4sXG4gICAgLy8gICBkaWZmVG9GaWxlUG9zaXRpb246IE1hcDxyYXdQb3NpdGlvbjogTnVtYmVyLCBhZGp1c3RlZFBvc2l0aW9uOiBOdW1iZXI+LFxuICAgIC8vICAgZmlsZVRyYW5zbGF0aW9uczogbnVsbCB8IE1hcDxhZGp1c3RlZFBvc2l0aW9uOiBOdW1iZXIsIHtuZXdQb3NpdGlvbjogTnVtYmVyfT4sXG4gICAgLy8gICBkaWdlc3Q6IFN0cmluZyxcbiAgICAvLyB9PlxuICAgIGNvbW1lbnRUcmFuc2xhdGlvbnM6IFByb3BUeXBlcy5vYmplY3QsXG5cbiAgICAvLyBmb3IgdGhlIGRvdGNvbSBsaW5rIGluIHRoZSBlbXB0eSBzdGF0ZVxuICAgIG51bWJlcjogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIHJlcG86IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBvd25lcjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIHdvcmtkaXI6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcblxuICAgIC8vIEF0b20gZW52aXJvbm1lbnRcbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb25maWc6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHRvb2x0aXBzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29uZmlybTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgIC8vIEFjdGlvbiBtZXRob2RzXG4gICAgb3BlbkZpbGU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb3BlbkRpZmY6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb3BlblBSOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG1vcmVDb250ZXh0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGxlc3NDb250ZXh0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9wZW5Jc3N1ZWlzaDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBzaG93U3VtbWFyaWVzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGhpZGVTdW1tYXJpZXM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgc2hvd0NvbW1lbnRzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGhpZGVDb21tZW50czogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBzaG93VGhyZWFkSUQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgaGlkZVRocmVhZElEOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHJlc29sdmVUaHJlYWQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgdW5yZXNvbHZlVGhyZWFkOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGFkZFNpbmdsZUNvbW1lbnQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgdXBkYXRlQ29tbWVudDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB1cGRhdGVTdW1tYXJ5OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHJlcG9ydFJlbGF5RXJyb3I6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMucm9vdEhvbGRlciA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlcGx5SG9sZGVycyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLnRocmVhZEhvbGRlcnMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGlzUmVmcmVzaGluZzogZmFsc2UsXG4gICAgfTtcbiAgICB0aGlzLnN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgY29uc3Qge3Njcm9sbFRvVGhyZWFkSUR9ID0gdGhpcy5wcm9wcztcbiAgICBpZiAoc2Nyb2xsVG9UaHJlYWRJRCkge1xuICAgICAgdGhpcy5zY3JvbGxUb1RocmVhZChzY3JvbGxUb1RocmVhZElEKTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzKSB7XG4gICAgY29uc3Qge3Njcm9sbFRvVGhyZWFkSUR9ID0gdGhpcy5wcm9wcztcbiAgICBpZiAoc2Nyb2xsVG9UaHJlYWRJRCAmJiBzY3JvbGxUb1RocmVhZElEICE9PSBwcmV2UHJvcHMuc2Nyb2xsVG9UaHJlYWRJRCkge1xuICAgICAgdGhpcy5zY3JvbGxUb1RocmVhZChzY3JvbGxUb1RocmVhZElEKTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLnN1YnMuZGlzcG9zZSgpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzXCIgcmVmPXt0aGlzLnJvb3RIb2xkZXIuc2V0dGVyfT5cbiAgICAgICAge3RoaXMucmVuZGVyQ29tbWFuZHMoKX1cbiAgICAgICAge3RoaXMucmVuZGVySGVhZGVyKCl9XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtbGlzdFwiPlxuICAgICAgICAgIHt0aGlzLnJlbmRlclJldmlld1N1bW1hcmllcygpfVxuICAgICAgICAgIHt0aGlzLnJlbmRlclJldmlld0NvbW1lbnRUaHJlYWRzKCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckNvbW1hbmRzKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RnJhZ21lbnQ+XG4gICAgICAgIDxDb21tYW5kcyByZWdpc3RyeT17dGhpcy5wcm9wcy5jb21tYW5kc30gdGFyZ2V0PXt0aGlzLnJvb3RIb2xkZXJ9PlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6bW9yZS1jb250ZXh0XCIgY2FsbGJhY2s9e3RoaXMucHJvcHMubW9yZUNvbnRleHR9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpsZXNzLWNvbnRleHRcIiBjYWxsYmFjaz17dGhpcy5wcm9wcy5sZXNzQ29udGV4dH0gLz5cbiAgICAgICAgPC9Db21tYW5kcz5cbiAgICAgICAgPENvbW1hbmRzIHJlZ2lzdHJ5PXt0aGlzLnByb3BzLmNvbW1hbmRzfSB0YXJnZXQ9XCIuZ2l0aHViLVJldmlldy1yZXBseVwiPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c3VibWl0LWNvbW1lbnRcIiBjYWxsYmFjaz17dGhpcy5zdWJtaXRDdXJyZW50Q29tbWVudH0gLz5cbiAgICAgICAgPC9Db21tYW5kcz5cbiAgICAgIDwvRnJhZ21lbnQ+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckhlYWRlcigpIHtcbiAgICBjb25zdCByZWZyZXNoID0gKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc3RhdGUuaXNSZWZyZXNoaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0U3RhdGUoe2lzUmVmcmVzaGluZzogdHJ1ZX0pO1xuICAgICAgY29uc3Qgc3ViID0gdGhpcy5wcm9wcy5yZWZldGNoKCgpID0+IHtcbiAgICAgICAgdGhpcy5zdWJzLnJlbW92ZShzdWIpO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtpc1JlZnJlc2hpbmc6IGZhbHNlfSk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuc3Vicy5hZGQoc3ViKTtcbiAgICB9O1xuICAgIHJldHVybiAoXG4gICAgICA8aGVhZGVyIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLXRvcEhlYWRlclwiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGljb24tY29tbWVudC1kaXNjdXNzaW9uXCIgLz5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtaGVhZGVyVGl0bGVcIj5cbiAgICAgICAgICBSZXZpZXdzIGZvciZuYnNwO1xuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLWNsaWNrYWJsZVwiIG9uQ2xpY2s9e3RoaXMucHJvcHMub3BlblBSfT5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLm93bmVyfS97dGhpcy5wcm9wcy5yZXBvfSN7dGhpcy5wcm9wcy5udW1iZXJ9XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L3NwYW4+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBjbGFzc05hbWU9e2N4KFxuICAgICAgICAgICAgJ2dpdGh1Yi1SZXZpZXdzLWhlYWRlckJ1dHRvbiBnaXRodWItUmV2aWV3cy1jbGlja2FibGUgaWNvbiBpY29uLXJlcG8tc3luYycsXG4gICAgICAgICAgICB7cmVmcmVzaGluZzogdGhpcy5zdGF0ZS5pc1JlZnJlc2hpbmd9LFxuICAgICAgICAgICl9XG4gICAgICAgICAgb25DbGljaz17cmVmcmVzaH1cbiAgICAgICAgLz5cbiAgICAgICAgPENoZWNrb3V0QnV0dG9uXG4gICAgICAgICAgY2hlY2tvdXRPcD17dGhpcy5wcm9wcy5jaGVja291dE9wfVxuICAgICAgICAgIGNsYXNzTmFtZVByZWZpeD1cImdpdGh1Yi1SZXZpZXdzLWNoZWNrb3V0QnV0dG9uLS1cIlxuICAgICAgICAgIGNsYXNzTmFtZXM9e1snZ2l0aHViLVJldmlld3MtaGVhZGVyQnV0dG9uJ119XG4gICAgICAgIC8+XG4gICAgICA8L2hlYWRlcj5cbiAgICApO1xuICB9XG5cbiAgbG9nU3RhcnRSZXZpZXdDbGljayA9ICgpID0+IHtcbiAgICBhZGRFdmVudCgnc3RhcnQtcHItcmV2aWV3Jywge3BhY2thZ2U6ICdnaXRodWInLCBjb21wb25lbnQ6IHRoaXMuY29uc3RydWN0b3IubmFtZX0pO1xuICB9XG5cbiAgcmVuZGVyRW1wdHlTdGF0ZSgpIHtcbiAgICBjb25zdCB7bnVtYmVyLCByZXBvLCBvd25lcn0gPSB0aGlzLnByb3BzO1xuICAgIC8vIHRvZG86IG1ha2UgdGhpcyBvcGVuIHRoZSByZXZpZXcgZmxvdyBpbiBBdG9tIGluc3RlYWQgb2YgZG90Y29tXG4gICAgY29uc3QgcHVsbFJlcXVlc3RVUkwgPSBgaHR0cHM6Ly93d3cuZ2l0aHViLmNvbS8ke293bmVyfS8ke3JlcG99L3B1bGwvJHtudW1iZXJ9L2ZpbGVzL2A7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtZW1wdHlTdGF0ZVwiPlxuICAgICAgICA8aW1nIHNyYz1cImF0b206Ly9naXRodWIvaW1nL21vbmEuc3ZnXCIgYWx0PVwiTW9uYSB0aGUgb2N0b2NhdCBpbiBzcGFhYWNjZWVcIiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1lbXB0eUltZ1wiIC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtZW1wdHlUZXh0XCI+XG4gICAgICAgICAgVGhpcyBwdWxsIHJlcXVlc3QgaGFzIG5vIHJldmlld3NcbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtZW1wdHlDYWxsVG9BY3Rpb25CdXR0b24gYnRuXCI+XG4gICAgICAgICAgPGEgaHJlZj17cHVsbFJlcXVlc3RVUkx9IG9uQ2xpY2s9e3RoaXMubG9nU3RhcnRSZXZpZXdDbGlja30+XG4gICAgICAgICAgICBTdGFydCBhIG5ldyByZXZpZXdcbiAgICAgICAgICA8L2E+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclJldmlld1N1bW1hcmllcygpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5zdW1tYXJpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJFbXB0eVN0YXRlKCk7XG4gICAgfVxuXG4gICAgY29uc3QgdG9nZ2xlID0gZXZ0ID0+IHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgaWYgKHRoaXMucHJvcHMuc3VtbWFyeVNlY3Rpb25PcGVuKSB7XG4gICAgICAgIHRoaXMucHJvcHMuaGlkZVN1bW1hcmllcygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5wcm9wcy5zaG93U3VtbWFyaWVzKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGV0YWlsc1xuICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1zZWN0aW9uIHN1bW1hcmllc1wiXG4gICAgICAgIG9wZW49e3RoaXMucHJvcHMuc3VtbWFyeVNlY3Rpb25PcGVufT5cblxuICAgICAgICA8c3VtbWFyeSBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1oZWFkZXJcIiBvbkNsaWNrPXt0b2dnbGV9PlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLXRpdGxlXCI+U3VtbWFyaWVzPC9zcGFuPlxuICAgICAgICA8L3N1bW1hcnk+XG4gICAgICAgIDxtYWluIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLWNvbnRhaW5lclwiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLnN1bW1hcmllcy5tYXAodGhpcy5yZW5kZXJSZXZpZXdTdW1tYXJ5KX1cbiAgICAgICAgPC9tYWluPlxuXG4gICAgICA8L2RldGFpbHM+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclJldmlld1N1bW1hcnkgPSByZXZpZXcgPT4ge1xuICAgIGNvbnN0IHJldmlld1R5cGVzID0gdHlwZSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBBUFBST1ZFRDoge2ljb246ICdpY29uLWNoZWNrJywgY29weTogJ2FwcHJvdmVkIHRoZXNlIGNoYW5nZXMnfSxcbiAgICAgICAgQ09NTUVOVEVEOiB7aWNvbjogJ2ljb24tY29tbWVudCcsIGNvcHk6ICdjb21tZW50ZWQnfSxcbiAgICAgICAgQ0hBTkdFU19SRVFVRVNURUQ6IHtpY29uOiAnaWNvbi1hbGVydCcsIGNvcHk6ICdyZXF1ZXN0ZWQgY2hhbmdlcyd9LFxuICAgICAgfVt0eXBlXSB8fCB7aWNvbjogJycsIGNvcHk6ICcnfTtcbiAgICB9O1xuXG4gICAgY29uc3Qge2ljb24sIGNvcHl9ID0gcmV2aWV3VHlwZXMocmV2aWV3LnN0YXRlKTtcblxuICAgIC8vIGZpbHRlciBub24gYWN0aW9uYWJsZSBlbXB0eSBzdW1tYXJ5IGNvbW1lbnRzIGZyb20gdGhpcyB2aWV3XG4gICAgaWYgKHJldmlldy5zdGF0ZSA9PT0gJ1BFTkRJTkcnIHx8IChyZXZpZXcuc3RhdGUgPT09ICdDT01NRU5URUQnICYmIHJldmlldy5ib2R5SFRNTCA9PT0gJycpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBhdXRob3IgPSByZXZpZXcuYXV0aG9yIHx8IEdIT1NUX1VTRVI7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3U3VtbWFyeVwiIGtleT17cmV2aWV3LmlkfT5cbiAgICAgICAgPEFjdGlvbmFibGVSZXZpZXdWaWV3XG4gICAgICAgICAgb3JpZ2luYWxDb250ZW50PXtyZXZpZXd9XG4gICAgICAgICAgY29uZmlybT17dGhpcy5wcm9wcy5jb25maXJtfVxuICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgIGNvbnRlbnRVcGRhdGVyPXt0aGlzLnByb3BzLnVwZGF0ZVN1bW1hcnl9XG4gICAgICAgICAgcmVuZGVyPXtzaG93QWN0aW9uc01lbnUgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPEZyYWdtZW50PlxuICAgICAgICAgICAgICAgIDxoZWFkZXIgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1oZWFkZXItYXV0aG9yRGF0YVwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2BnaXRodWItUmV2aWV3U3VtbWFyeS1pY29uIGljb24gJHtpY29ufWB9IC8+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld1N1bW1hcnktYXZhdGFyXCJcbiAgICAgICAgICAgICAgICAgICAgICBzcmM9e2F1dGhvci5hdmF0YXJVcmx9IGFsdD17YXV0aG9yLmxvZ2lufVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3U3VtbWFyeS11c2VybmFtZVwiIGhyZWY9e2F1dGhvci51cmx9PnthdXRob3IubG9naW59PC9hPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3U3VtbWFyeS10eXBlXCI+e2NvcHl9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJFZGl0ZWRMaW5rKHJldmlldyl9XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnJlbmRlckF1dGhvckFzc29jaWF0aW9uKHJldmlldyl9XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxUaW1lYWdvIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdTdW1tYXJ5LXRpbWVBZ29cIiB0aW1lPXtyZXZpZXcuc3VibWl0dGVkQXR9IGRpc3BsYXlTdHlsZT1cInNob3J0XCIgLz5cbiAgICAgICAgICAgICAgICAgIDxPY3RpY29uXG4gICAgICAgICAgICAgICAgICAgIGljb249XCJlbGxpcHNlc1wiXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctYWN0aW9uc01lbnVcIlxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtldmVudCA9PiBzaG93QWN0aW9uc01lbnUoZXZlbnQsIHJldmlldywgYXV0aG9yKX1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9oZWFkZXI+XG4gICAgICAgICAgICAgICAgPG1haW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld1N1bW1hcnktY29tbWVudFwiPlxuICAgICAgICAgICAgICAgICAgPEdpdGh1YkRvdGNvbU1hcmtkb3duXG4gICAgICAgICAgICAgICAgICAgIGh0bWw9e3Jldmlldy5ib2R5SFRNTH1cbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoVG9Jc3N1ZWlzaD17dGhpcy5wcm9wcy5vcGVuSXNzdWVpc2h9XG4gICAgICAgICAgICAgICAgICAgIG9wZW5Jc3N1ZWlzaExpbmtJbk5ld1RhYj17dGhpcy5vcGVuSXNzdWVpc2hMaW5rSW5OZXdUYWJ9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPEVtb2ppUmVhY3Rpb25zQ29udHJvbGxlclxuICAgICAgICAgICAgICAgICAgICByZWFjdGFibGU9e3Jldmlld31cbiAgICAgICAgICAgICAgICAgICAgdG9vbHRpcHM9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgICAgICAgICAgIHJlcG9ydFJlbGF5RXJyb3I9e3RoaXMucHJvcHMucmVwb3J0UmVsYXlFcnJvcn1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9tYWluPlxuICAgICAgICAgICAgICA8L0ZyYWdtZW50PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclJldmlld0NvbW1lbnRUaHJlYWRzKCkge1xuICAgIGNvbnN0IGNvbW1lbnRUaHJlYWRzID0gdGhpcy5wcm9wcy5jb21tZW50VGhyZWFkcztcbiAgICBpZiAoY29tbWVudFRocmVhZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCByZXNvbHZlZFRocmVhZHMgPSBjb21tZW50VGhyZWFkcy5maWx0ZXIocGFpciA9PiBwYWlyLnRocmVhZC5pc1Jlc29sdmVkKTtcbiAgICBjb25zdCB1bnJlc29sdmVkVGhyZWFkcyA9IGNvbW1lbnRUaHJlYWRzLmZpbHRlcihwYWlyID0+ICFwYWlyLnRocmVhZC5pc1Jlc29sdmVkKTtcblxuICAgIGNvbnN0IHRvZ2dsZUNvbW1lbnRzID0gZXZ0ID0+IHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgaWYgKHRoaXMucHJvcHMuY29tbWVudFNlY3Rpb25PcGVuKSB7XG4gICAgICAgIHRoaXMucHJvcHMuaGlkZUNvbW1lbnRzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnByb3BzLnNob3dDb21tZW50cygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRldGFpbHNcbiAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3Mtc2VjdGlvbiBjb21tZW50c1wiXG4gICAgICAgIG9wZW49e3RoaXMucHJvcHMuY29tbWVudFNlY3Rpb25PcGVufT5cblxuICAgICAgICA8c3VtbWFyeSBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1oZWFkZXJcIiBvbkNsaWNrPXt0b2dnbGVDb21tZW50c30+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtdGl0bGVcIj5Db21tZW50czwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1wcm9ncmVzc1wiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtY291bnRcIj5cbiAgICAgICAgICAgICAgUmVzb2x2ZWRcbiAgICAgICAgICAgICAgeycgJ308c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1jb3VudE5yXCI+e3Jlc29sdmVkVGhyZWFkcy5sZW5ndGh9PC9zcGFuPnsnICd9XG4gICAgICAgICAgICAgIG9mXG4gICAgICAgICAgICAgIHsnICd9PHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtY291bnROclwiPntyZXNvbHZlZFRocmVhZHMubGVuZ3RoICsgdW5yZXNvbHZlZFRocmVhZHMubGVuZ3RofTwvc3Bhbj5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDxwcm9ncmVzc1xuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1wcm9nZXNzQmFyXCIgdmFsdWU9e3Jlc29sdmVkVGhyZWFkcy5sZW5ndGh9XG4gICAgICAgICAgICAgIG1heD17cmVzb2x2ZWRUaHJlYWRzLmxlbmd0aCArIHVucmVzb2x2ZWRUaHJlYWRzLmxlbmd0aH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L3N1bW1hcnk+XG5cbiAgICAgICAge3VucmVzb2x2ZWRUaHJlYWRzLmxlbmd0aCA+IDAgJiYgPG1haW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtY29udGFpbmVyXCI+XG4gICAgICAgICAge3VucmVzb2x2ZWRUaHJlYWRzLm1hcCh0aGlzLnJlbmRlclJldmlld0NvbW1lbnRUaHJlYWQpfVxuICAgICAgICA8L21haW4+fVxuICAgICAgICB7cmVzb2x2ZWRUaHJlYWRzLmxlbmd0aCA+IDAgJiYgPGRldGFpbHMgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3Mtc2VjdGlvbiByZXNvbHZlZC1jb21tZW50c1wiIG9wZW4+XG4gICAgICAgICAgPHN1bW1hcnkgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtaGVhZGVyXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy10aXRsZVwiPlJlc29sdmVkPC9zcGFuPlxuICAgICAgICAgIDwvc3VtbWFyeT5cbiAgICAgICAgICA8bWFpbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1jb250YWluZXJcIj5cbiAgICAgICAgICAgIHtyZXNvbHZlZFRocmVhZHMubWFwKHRoaXMucmVuZGVyUmV2aWV3Q29tbWVudFRocmVhZCl9XG4gICAgICAgICAgPC9tYWluPlxuICAgICAgICA8L2RldGFpbHM+fVxuXG4gICAgICA8L2RldGFpbHM+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclJldmlld0NvbW1lbnRUaHJlYWQgPSBjb21tZW50VGhyZWFkID0+IHtcbiAgICBjb25zdCB7Y29tbWVudHMsIHRocmVhZH0gPSBjb21tZW50VGhyZWFkO1xuICAgIGNvbnN0IHJvb3RDb21tZW50ID0gY29tbWVudHNbMF07XG4gICAgaWYgKCFyb290Q29tbWVudCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IHRocmVhZEhvbGRlciA9IHRoaXMudGhyZWFkSG9sZGVycy5nZXQodGhyZWFkLmlkKTtcbiAgICBpZiAoIXRocmVhZEhvbGRlcikge1xuICAgICAgdGhyZWFkSG9sZGVyID0gbmV3IFJlZkhvbGRlcigpO1xuICAgICAgdGhpcy50aHJlYWRIb2xkZXJzLnNldCh0aHJlYWQuaWQsIHRocmVhZEhvbGRlcik7XG4gICAgfVxuXG4gICAgY29uc3QgbmF0aXZlUGF0aCA9IHRvTmF0aXZlUGF0aFNlcChyb290Q29tbWVudC5wYXRoKTtcbiAgICBjb25zdCB7ZGlyLCBiYXNlfSA9IHBhdGgucGFyc2UobmF0aXZlUGF0aCk7XG4gICAgY29uc3Qge2xpbmVOdW1iZXIsIHBvc2l0aW9uVGV4dH0gPSB0aGlzLmdldFRyYW5zbGF0ZWRQb3NpdGlvbihyb290Q29tbWVudCk7XG5cbiAgICBjb25zdCByZWZKdW1wVG9GaWxlQnV0dG9uID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIGNvbnN0IGp1bXBUb0ZpbGVEaXNhYmxlZExhYmVsID0gJ0NoZWNrb3V0IHRoaXMgcHVsbCByZXF1ZXN0IHRvIGVuYWJsZSBKdW1wIFRvIEZpbGUuJztcblxuICAgIGNvbnN0IGVsZW1lbnRJZCA9IGByZXZpZXctdGhyZWFkLSR7dGhyZWFkLmlkfWA7XG5cbiAgICBjb25zdCBuYXZCdXR0b25DbGFzc2VzID0gWydnaXRodWItUmV2aWV3LW5hdkJ1dHRvbicsICdpY29uJywge291dGRhdGVkOiAhbGluZU51bWJlcn1dO1xuICAgIGNvbnN0IG9wZW5GaWxlQ2xhc3NlcyA9IGN4KCdpY29uLWNvZGUnLCAuLi5uYXZCdXR0b25DbGFzc2VzKTtcbiAgICBjb25zdCBvcGVuRGlmZkNsYXNzZXMgPSBjeCgnaWNvbi1kaWZmJywgLi4ubmF2QnV0dG9uQ2xhc3Nlcyk7XG5cbiAgICBjb25zdCBpc09wZW4gPSB0aGlzLnByb3BzLnRocmVhZElEc09wZW4uaGFzKHRocmVhZC5pZCk7XG4gICAgY29uc3QgaXNIaWdobGlnaHRlZCA9IHRoaXMucHJvcHMuaGlnaGxpZ2h0ZWRUaHJlYWRJRHMuaGFzKHRocmVhZC5pZCk7XG4gICAgY29uc3QgdG9nZ2xlID0gZXZ0ID0+IHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICBpZiAoaXNPcGVuKSB7XG4gICAgICAgIHRoaXMucHJvcHMuaGlkZVRocmVhZElEKHRocmVhZC5pZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnByb3BzLnNob3dUaHJlYWRJRCh0aHJlYWQuaWQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBhdXRob3IgPSByb290Q29tbWVudC5hdXRob3IgfHwgR0hPU1RfVVNFUjtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGV0YWlsc1xuICAgICAgICByZWY9e3RocmVhZEhvbGRlci5zZXR0ZXJ9XG4gICAgICAgIGNsYXNzTmFtZT17Y3goJ2dpdGh1Yi1SZXZpZXcnLCB7J3Jlc29sdmVkJzogdGhyZWFkLmlzUmVzb2x2ZWQsICdnaXRodWItUmV2aWV3LS1oaWdobGlnaHQnOiBpc0hpZ2hsaWdodGVkfSl9XG4gICAgICAgIGtleT17ZWxlbWVudElkfVxuICAgICAgICBpZD17ZWxlbWVudElkfVxuICAgICAgICBvcGVuPXtpc09wZW59PlxuXG4gICAgICAgIDxzdW1tYXJ5IGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctcmVmZXJlbmNlXCIgb25DbGljaz17dG9nZ2xlfT5cbiAgICAgICAgICB7ZGlyICYmIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctcGF0aFwiPntkaXJ9PC9zcGFuPn1cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LWZpbGVcIj57ZGlyID8gcGF0aC5zZXAgOiAnJ317YmFzZX08L3NwYW4+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1saW5lTnJcIj57cG9zaXRpb25UZXh0fTwvc3Bhbj5cbiAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctcmVmZXJlbmNlQXZhdGFyXCJcbiAgICAgICAgICAgIHNyYz17YXV0aG9yLmF2YXRhclVybH0gYWx0PXthdXRob3IubG9naW59XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8VGltZWFnbyBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LXJlZmVyZW5jZVRpbWVBZ29cIiB0aW1lPXtyb290Q29tbWVudC5jcmVhdGVkQXR9IGRpc3BsYXlTdHlsZT1cInNob3J0XCIgLz5cbiAgICAgICAgPC9zdW1tYXJ5PlxuICAgICAgICA8bmF2IGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctbmF2XCI+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9e29wZW5GaWxlQ2xhc3Nlc31cbiAgICAgICAgICAgIGRhdGEtcGF0aD17bmF0aXZlUGF0aH0gZGF0YS1saW5lPXtsaW5lTnVtYmVyfVxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5vcGVuRmlsZX0gZGlzYWJsZWQ9e3RoaXMucHJvcHMuY2hlY2tvdXRPcC5pc0VuYWJsZWQoKX1cbiAgICAgICAgICAgIHJlZj17cmVmSnVtcFRvRmlsZUJ1dHRvbi5zZXR0ZXJ9PlxuICAgICAgICAgICAgSnVtcCBUbyBGaWxlXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9e29wZW5EaWZmQ2xhc3Nlc31cbiAgICAgICAgICAgIGRhdGEtcGF0aD17bmF0aXZlUGF0aH0gZGF0YS1saW5lPXtyb290Q29tbWVudC5wb3NpdGlvbn1cbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMub3BlbkRpZmZ9PlxuICAgICAgICAgICAgT3BlbiBEaWZmXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAge3RoaXMucHJvcHMuY2hlY2tvdXRPcC5pc0VuYWJsZWQoKSAmJlxuICAgICAgICAgICAgPFRvb2x0aXBcbiAgICAgICAgICAgICAgbWFuYWdlcj17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICAgICAgdGFyZ2V0PXtyZWZKdW1wVG9GaWxlQnV0dG9ufVxuICAgICAgICAgICAgICB0aXRsZT17anVtcFRvRmlsZURpc2FibGVkTGFiZWx9XG4gICAgICAgICAgICAgIHNob3dEZWxheT17MjAwfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICB9XG4gICAgICAgIDwvbmF2PlxuXG4gICAgICAgIHtyb290Q29tbWVudC5wb3NpdGlvbiAhPT0gbnVsbCAmJiAoXG4gICAgICAgICAgPFBhdGNoUHJldmlld1ZpZXdcbiAgICAgICAgICAgIG11bHRpRmlsZVBhdGNoPXt0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNofVxuICAgICAgICAgICAgZmlsZU5hbWU9e25hdGl2ZVBhdGh9XG4gICAgICAgICAgICBkaWZmUm93PXtyb290Q29tbWVudC5wb3NpdGlvbn1cbiAgICAgICAgICAgIG1heFJvd0NvdW50PXt0aGlzLnByb3BzLmNvbnRleHRMaW5lc31cbiAgICAgICAgICAgIGNvbmZpZz17dGhpcy5wcm9wcy5jb25maWd9XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cblxuICAgICAgICB7dGhpcy5yZW5kZXJUaHJlYWQoe3RocmVhZCwgY29tbWVudHN9KX1cblxuICAgICAgPC9kZXRhaWxzPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJUaHJlYWQgPSAoe3RocmVhZCwgY29tbWVudHN9KSA9PiB7XG4gICAgbGV0IHJlcGx5SG9sZGVyID0gdGhpcy5yZXBseUhvbGRlcnMuZ2V0KHRocmVhZC5pZCk7XG4gICAgaWYgKCFyZXBseUhvbGRlcikge1xuICAgICAgcmVwbHlIb2xkZXIgPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgICB0aGlzLnJlcGx5SG9sZGVycy5zZXQodGhyZWFkLmlkLCByZXBseUhvbGRlcik7XG4gICAgfVxuXG4gICAgY29uc3QgbGFzdENvbW1lbnQgPSBjb21tZW50c1tjb21tZW50cy5sZW5ndGggLSAxXTtcbiAgICBjb25zdCBpc1Bvc3RpbmcgPSB0aGlzLnByb3BzLnBvc3RpbmdUb1RocmVhZElEICE9PSBudWxsO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgPG1haW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1jb21tZW50c1wiPlxuXG4gICAgICAgICAge2NvbW1lbnRzLm1hcChjb21tZW50ID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxSZXZpZXdDb21tZW50Vmlld1xuICAgICAgICAgICAgICAgIGtleT17Y29tbWVudC5pZH1cbiAgICAgICAgICAgICAgICBjb21tZW50PXtjb21tZW50fVxuICAgICAgICAgICAgICAgIG9wZW5Jc3N1ZWlzaD17dGhpcy5wcm9wcy5vcGVuSXNzdWVpc2h9XG4gICAgICAgICAgICAgICAgb3Blbklzc3VlaXNoTGlua0luTmV3VGFiPXt0aGlzLm9wZW5Jc3N1ZWlzaExpbmtJbk5ld1RhYn1cbiAgICAgICAgICAgICAgICB0b29sdGlwcz17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICAgICAgICByZXBvcnRSZWxheUVycm9yPXt0aGlzLnByb3BzLnJlcG9ydFJlbGF5RXJyb3J9XG4gICAgICAgICAgICAgICAgcmVuZGVyRWRpdGVkTGluaz17dGhpcy5yZW5kZXJFZGl0ZWRMaW5rfVxuICAgICAgICAgICAgICAgIHJlbmRlckF1dGhvckFzc29jaWF0aW9uPXt0aGlzLnJlbmRlckF1dGhvckFzc29jaWF0aW9ufVxuICAgICAgICAgICAgICAgIGlzUG9zdGluZz17aXNQb3N0aW5nfVxuICAgICAgICAgICAgICAgIGNvbmZpcm09e3RoaXMucHJvcHMuY29uZmlybX1cbiAgICAgICAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICAgICAgICB1cGRhdGVDb21tZW50PXt0aGlzLnByb3BzLnVwZGF0ZUNvbW1lbnR9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pfVxuXG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjeCgnZ2l0aHViLVJldmlldy1yZXBseScsIHsnZ2l0aHViLVJldmlldy1yZXBseS0tZGlzYWJsZWQnOiBpc1Bvc3Rpbmd9KX1cbiAgICAgICAgICAgIGRhdGEtdGhyZWFkLWlkPXt0aHJlYWQuaWR9PlxuXG4gICAgICAgICAgICA8QXRvbVRleHRFZGl0b3JcbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXJUZXh0PVwiUmVwbHkuLi5cIlxuICAgICAgICAgICAgICBsaW5lTnVtYmVyR3V0dGVyVmlzaWJsZT17ZmFsc2V9XG4gICAgICAgICAgICAgIHNvZnRXcmFwcGVkPXt0cnVlfVxuICAgICAgICAgICAgICBhdXRvSGVpZ2h0PXt0cnVlfVxuICAgICAgICAgICAgICByZWFkT25seT17aXNQb3N0aW5nfVxuICAgICAgICAgICAgICByZWZNb2RlbD17cmVwbHlIb2xkZXJ9XG4gICAgICAgICAgICAvPlxuXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvbWFpbj5cbiAgICAgICAge3RocmVhZC5pc1Jlc29sdmVkICYmIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1yZXNvbHZlZFRleHRcIj5cbiAgICAgICAgICBUaGlzIGNvbnZlcnNhdGlvbiB3YXMgbWFya2VkIGFzIHJlc29sdmVkIGJ5IEB7dGhyZWFkLnJlc29sdmVkQnkubG9naW59XG4gICAgICAgIDwvZGl2Pn1cbiAgICAgICAgPGZvb3RlciBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LWZvb3RlclwiPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctcmVwbHlCdXR0b24gYnRuIGJ0bi1wcmltYXJ5XCJcbiAgICAgICAgICAgIHRpdGxlPVwiQWRkIHlvdXIgY29tbWVudFwiXG4gICAgICAgICAgICBkaXNhYmxlZD17aXNQb3N0aW5nfVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5zdWJtaXRSZXBseShyZXBseUhvbGRlciwgdGhyZWFkLCBsYXN0Q29tbWVudCl9PlxuICAgICAgICAgICAgQ29tbWVudFxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIHt0aGlzLnJlbmRlclJlc29sdmVCdXR0b24odGhyZWFkKX1cbiAgICAgICAgPC9mb290ZXI+XG4gICAgICA8L0ZyYWdtZW50PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJSZXNvbHZlQnV0dG9uID0gdGhyZWFkID0+IHtcbiAgICBpZiAodGhyZWFkLmlzUmVzb2x2ZWQpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LXJlc29sdmVCdXR0b24gYnRuIGljb24gaWNvbi1jaGVja1wiXG4gICAgICAgICAgdGl0bGU9XCJVbnJlc29sdmUgY29udmVyc2F0aW9uXCJcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLnJlc29sdmVVbnJlc29sdmVUaHJlYWQodGhyZWFkKX0+XG4gICAgICAgICAgVW5yZXNvbHZlIGNvbnZlcnNhdGlvblxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LXJlc29sdmVCdXR0b24gYnRuIGljb24gaWNvbi1jaGVja1wiXG4gICAgICAgICAgdGl0bGU9XCJSZXNvbHZlIGNvbnZlcnNhdGlvblwiXG4gICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5yZXNvbHZlVW5yZXNvbHZlVGhyZWFkKHRocmVhZCl9PlxuICAgICAgICAgIFJlc29sdmUgY29udmVyc2F0aW9uXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXJFZGl0ZWRMaW5rKGVudGl0eSkge1xuICAgIGlmICghZW50aXR5Lmxhc3RFZGl0ZWRBdCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctZWRpdGVkXCI+XG4gICAgICAgICZuYnNwO+KAoiZuYnNwO1xuICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctZWRpdGVkXCIgaHJlZj17ZW50aXR5LnVybH0+ZWRpdGVkPC9hPlxuICAgICAgICA8L3NwYW4+XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlckF1dGhvckFzc29jaWF0aW9uKGVudGl0eSkge1xuICAgIGNvbnN0IHRleHQgPSBhdXRob3JBc3NvY2lhdGlvblRleHRbZW50aXR5LmF1dGhvckFzc29jaWF0aW9uXTtcbiAgICBpZiAoIXRleHQpIHsgcmV0dXJuIG51bGw7IH1cbiAgICByZXR1cm4gKFxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1hdXRob3JBc3NvY2lhdGlvbkJhZGdlIGJhZGdlXCI+e3RleHR9PC9zcGFuPlxuICAgICk7XG4gIH1cblxuICBvcGVuRmlsZSA9IGV2dCA9PiB7XG4gICAgaWYgKCF0aGlzLnByb3BzLmNoZWNrb3V0T3AuaXNFbmFibGVkKCkpIHtcbiAgICAgIGNvbnN0IHRhcmdldCA9IGV2dC5jdXJyZW50VGFyZ2V0O1xuICAgICAgdGhpcy5wcm9wcy5vcGVuRmlsZSh0YXJnZXQuZGF0YXNldC5wYXRoLCB0YXJnZXQuZGF0YXNldC5saW5lKTtcbiAgICB9XG4gIH1cblxuICBvcGVuRGlmZiA9IGV2dCA9PiB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZXZ0LmN1cnJlbnRUYXJnZXQ7XG4gICAgdGhpcy5wcm9wcy5vcGVuRGlmZih0YXJnZXQuZGF0YXNldC5wYXRoLCBwYXJzZUludCh0YXJnZXQuZGF0YXNldC5saW5lLCAxMCkpO1xuICB9XG5cbiAgb3Blbklzc3VlaXNoTGlua0luTmV3VGFiID0gZXZ0ID0+IHtcbiAgICBjb25zdCB7cmVwb093bmVyLCByZXBvTmFtZSwgaXNzdWVpc2hOdW1iZXJ9ID0gZ2V0RGF0YUZyb21HaXRodWJVcmwoZXZ0LnRhcmdldC5kYXRhc2V0LnVybCk7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMub3Blbklzc3VlaXNoKHJlcG9Pd25lciwgcmVwb05hbWUsIGlzc3VlaXNoTnVtYmVyKTtcbiAgfVxuXG4gIHN1Ym1pdFJlcGx5KHJlcGx5SG9sZGVyLCB0aHJlYWQsIGxhc3RDb21tZW50KSB7XG4gICAgY29uc3QgYm9keSA9IHJlcGx5SG9sZGVyLm1hcChlZGl0b3IgPT4gZWRpdG9yLmdldFRleHQoKSkuZ2V0T3IoJycpO1xuICAgIGNvbnN0IGRpZFN1Ym1pdENvbW1lbnQgPSAoKSA9PiByZXBseUhvbGRlci5tYXAoZWRpdG9yID0+IGVkaXRvci5zZXRUZXh0KCcnLCB7YnlwYXNzUmVhZE9ubHk6IHRydWV9KSk7XG4gICAgY29uc3QgZGlkRmFpbENvbW1lbnQgPSAoKSA9PiByZXBseUhvbGRlci5tYXAoZWRpdG9yID0+IGVkaXRvci5zZXRUZXh0KGJvZHksIHtieXBhc3NSZWFkT25seTogdHJ1ZX0pKTtcblxuICAgIHJldHVybiB0aGlzLnByb3BzLmFkZFNpbmdsZUNvbW1lbnQoXG4gICAgICBib2R5LCB0aHJlYWQuaWQsIGxhc3RDb21tZW50LmlkLCBsYXN0Q29tbWVudC5wYXRoLCBsYXN0Q29tbWVudC5wb3NpdGlvbiwge2RpZFN1Ym1pdENvbW1lbnQsIGRpZEZhaWxDb21tZW50fSxcbiAgICApO1xuICB9XG5cbiAgc3VibWl0Q3VycmVudENvbW1lbnQgPSBldnQgPT4ge1xuICAgIGNvbnN0IHRocmVhZElEID0gZXZ0LmN1cnJlbnRUYXJnZXQuZGF0YXNldC50aHJlYWRJZDtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAoIXRocmVhZElEKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCB7dGhyZWFkLCBjb21tZW50c30gPSB0aGlzLnByb3BzLmNvbW1lbnRUaHJlYWRzLmZpbmQoZWFjaCA9PiBlYWNoLnRocmVhZC5pZCA9PT0gdGhyZWFkSUQpO1xuICAgIGNvbnN0IHJlcGx5SG9sZGVyID0gdGhpcy5yZXBseUhvbGRlcnMuZ2V0KHRocmVhZElEKTtcblxuICAgIHJldHVybiB0aGlzLnN1Ym1pdFJlcGx5KHJlcGx5SG9sZGVyLCB0aHJlYWQsIGNvbW1lbnRzW2NvbW1lbnRzLmxlbmd0aCAtIDFdKTtcbiAgfVxuXG4gIGdldFRyYW5zbGF0ZWRQb3NpdGlvbihyb290Q29tbWVudCkge1xuICAgIGxldCBsaW5lTnVtYmVyLCBwb3NpdGlvblRleHQ7XG4gICAgY29uc3QgdHJhbnNsYXRpb25zID0gdGhpcy5wcm9wcy5jb21tZW50VHJhbnNsYXRpb25zO1xuXG4gICAgY29uc3QgaXNDaGVja2VkT3V0UHVsbFJlcXVlc3QgPSB0aGlzLnByb3BzLmNoZWNrb3V0T3Aud2h5KCkgPT09IGNoZWNrb3V0U3RhdGVzLkNVUlJFTlQ7XG4gICAgaWYgKHRyYW5zbGF0aW9ucyA9PT0gbnVsbCkge1xuICAgICAgbGluZU51bWJlciA9IG51bGw7XG4gICAgICBwb3NpdGlvblRleHQgPSAnJztcbiAgICB9IGVsc2UgaWYgKHJvb3RDb21tZW50LnBvc2l0aW9uID09PSBudWxsKSB7XG4gICAgICBsaW5lTnVtYmVyID0gbnVsbDtcbiAgICAgIHBvc2l0aW9uVGV4dCA9ICdvdXRkYXRlZCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHRyYW5zbGF0aW9uc0ZvckZpbGUgPSB0cmFuc2xhdGlvbnMuZ2V0KHBhdGgubm9ybWFsaXplKHJvb3RDb21tZW50LnBhdGgpKTtcbiAgICAgIGxpbmVOdW1iZXIgPSB0cmFuc2xhdGlvbnNGb3JGaWxlLmRpZmZUb0ZpbGVQb3NpdGlvbi5nZXQocGFyc2VJbnQocm9vdENvbW1lbnQucG9zaXRpb24sIDEwKSk7XG4gICAgICBpZiAodHJhbnNsYXRpb25zRm9yRmlsZS5maWxlVHJhbnNsYXRpb25zICYmIGlzQ2hlY2tlZE91dFB1bGxSZXF1ZXN0KSB7XG4gICAgICAgIGxpbmVOdW1iZXIgPSB0cmFuc2xhdGlvbnNGb3JGaWxlLmZpbGVUcmFuc2xhdGlvbnMuZ2V0KGxpbmVOdW1iZXIpLm5ld1Bvc2l0aW9uO1xuICAgICAgfVxuICAgICAgcG9zaXRpb25UZXh0ID0gbGluZU51bWJlcjtcbiAgICB9XG5cbiAgICByZXR1cm4ge2xpbmVOdW1iZXIsIHBvc2l0aW9uVGV4dH07XG4gIH1cblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBzY3JvbGxUb1RocmVhZCh0aHJlYWRJRCkge1xuICAgIGNvbnN0IHRocmVhZEhvbGRlciA9IHRoaXMudGhyZWFkSG9sZGVycy5nZXQodGhyZWFkSUQpO1xuICAgIGlmICh0aHJlYWRIb2xkZXIpIHtcbiAgICAgIHRocmVhZEhvbGRlci5tYXAoZWxlbWVudCA9PiB7XG4gICAgICAgIGVsZW1lbnQuc2Nyb2xsSW50b1ZpZXdJZk5lZWRlZCgpO1xuICAgICAgICByZXR1cm4gbnVsbDsgLy8gc2hoLCBlc2xpbnRcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHJlc29sdmVVbnJlc29sdmVUaHJlYWQodGhyZWFkKSB7XG4gICAgaWYgKHRocmVhZC5pc1Jlc29sdmVkKSB7XG4gICAgICBhd2FpdCB0aGlzLnByb3BzLnVucmVzb2x2ZVRocmVhZCh0aHJlYWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhd2FpdCB0aGlzLnByb3BzLnJlc29sdmVUaHJlYWQodGhyZWFkKTtcbiAgICB9XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFBMkM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBRTNDLE1BQU1BLHFCQUFxQixHQUFHO0VBQzVCQyxNQUFNLEVBQUUsUUFBUTtFQUNoQkMsS0FBSyxFQUFFLE9BQU87RUFDZEMsWUFBWSxFQUFFLGNBQWM7RUFDNUJDLFdBQVcsRUFBRSxhQUFhO0VBQzFCQyxzQkFBc0IsRUFBRSx3QkFBd0I7RUFDaERDLFdBQVcsRUFBRSxhQUFhO0VBQzFCQyxJQUFJLEVBQUU7QUFDUixDQUFDO0FBRWMsTUFBTUMsV0FBVyxTQUFTQyxjQUFLLENBQUNDLFNBQVMsQ0FBQztFQXVFdkRDLFdBQVcsQ0FBQ0MsS0FBSyxFQUFFO0lBQ2pCLEtBQUssQ0FBQ0EsS0FBSyxDQUFDO0lBQUMsNkNBNkZPLE1BQU07TUFDMUIsSUFBQUMsdUJBQVEsRUFBQyxpQkFBaUIsRUFBRTtRQUFDQyxPQUFPLEVBQUUsUUFBUTtRQUFFQyxTQUFTLEVBQUUsSUFBSSxDQUFDSixXQUFXLENBQUNLO01BQUksQ0FBQyxDQUFDO0lBQ3BGLENBQUM7SUFBQSw2Q0FtRHFCQyxNQUFNLElBQUk7TUFDOUIsTUFBTUMsV0FBVyxHQUFHQyxJQUFJLElBQUk7UUFDMUIsT0FBTztVQUNMQyxRQUFR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