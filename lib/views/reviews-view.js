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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcGF0aCIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX3JlYWN0IiwiX2ludGVyb3BSZXF1aXJlV2lsZGNhcmQiLCJfcHJvcFR5cGVzIiwiX2NsYXNzbmFtZXMiLCJfZXZlbnRLaXQiLCJfcHJvcFR5cGVzMiIsIl90b29sdGlwIiwiX2NvbW1hbmRzIiwiX2F0b21UZXh0RWRpdG9yIiwiX2lzc3VlaXNoTGluayIsIl9lbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXIiLCJfcHJDaGVja291dENvbnRyb2xsZXIiLCJfZ2l0aHViRG90Y29tTWFya2Rvd24iLCJfcGF0Y2hQcmV2aWV3VmlldyIsIl9yZXZpZXdDb21tZW50VmlldyIsIl9hY3Rpb25hYmxlUmV2aWV3VmlldyIsIl9jaGVja291dEJ1dHRvbiIsIl9vY3RpY29uIiwiX3RpbWVhZ28iLCJfcmVmSG9sZGVyIiwiX2hlbHBlcnMiLCJfcmVwb3J0ZXJQcm94eSIsIl9nZXRSZXF1aXJlV2lsZGNhcmRDYWNoZSIsIm5vZGVJbnRlcm9wIiwiV2Vha01hcCIsImNhY2hlQmFiZWxJbnRlcm9wIiwiY2FjaGVOb2RlSW50ZXJvcCIsIm9iaiIsIl9fZXNNb2R1bGUiLCJkZWZhdWx0IiwiY2FjaGUiLCJoYXMiLCJnZXQiLCJuZXdPYmoiLCJoYXNQcm9wZXJ0eURlc2NyaXB0b3IiLCJPYmplY3QiLCJkZWZpbmVQcm9wZXJ0eSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImtleSIsInByb3RvdHlwZSIsImhhc093blByb3BlcnR5IiwiY2FsbCIsImRlc2MiLCJzZXQiLCJfZGVmaW5lUHJvcGVydHkiLCJ2YWx1ZSIsIl90b1Byb3BlcnR5S2V5IiwiZW51bWVyYWJsZSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiYXJnIiwiX3RvUHJpbWl0aXZlIiwiU3RyaW5nIiwiaW5wdXQiLCJoaW50IiwicHJpbSIsIlN5bWJvbCIsInRvUHJpbWl0aXZlIiwidW5kZWZpbmVkIiwicmVzIiwiVHlwZUVycm9yIiwiTnVtYmVyIiwiYXV0aG9yQXNzb2NpYXRpb25UZXh0IiwiTUVNQkVSIiwiT1dORVIiLCJDT0xMQUJPUkFUT1IiLCJDT05UUklCVVRPUiIsIkZJUlNUX1RJTUVfQ09OVFJJQlVUT1IiLCJGSVJTVF9USU1FUiIsIk5PTkUiLCJSZXZpZXdzVmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsImFkZEV2ZW50IiwicGFja2FnZSIsImNvbXBvbmVudCIsIm5hbWUiLCJyZXZpZXciLCJyZXZpZXdUeXBlcyIsInR5cGUiLCJBUFBST1ZFRCIsImljb24iLCJjb3B5IiwiQ09NTUVOVEVEIiwiQ0hBTkdFU19SRVFVRVNURUQiLCJzdGF0ZSIsImJvZHlIVE1MIiwiYXV0aG9yIiwiR0hPU1RfVVNFUiIsImNyZWF0ZUVsZW1lbnQiLCJjbGFzc05hbWUiLCJpZCIsIm9yaWdpbmFsQ29udGVudCIsImNvbmZpcm0iLCJjb21tYW5kcyIsImNvbnRlbnRVcGRhdGVyIiwidXBkYXRlU3VtbWFyeSIsInJlbmRlciIsInNob3dBY3Rpb25zTWVudSIsIkZyYWdtZW50Iiwic3JjIiwiYXZhdGFyVXJsIiwiYWx0IiwibG9naW4iLCJocmVmIiwidXJsIiwicmVuZGVyRWRpdGVkTGluayIsInJlbmRlckF1dGhvckFzc29jaWF0aW9uIiwidGltZSIsInN1Ym1pdHRlZEF0IiwiZGlzcGxheVN0eWxlIiwib25DbGljayIsImV2ZW50IiwiaHRtbCIsInN3aXRjaFRvSXNzdWVpc2giLCJvcGVuSXNzdWVpc2giLCJvcGVuSXNzdWVpc2hMaW5rSW5OZXdUYWIiLCJyZWFjdGFibGUiLCJ0b29sdGlwcyIsInJlcG9ydFJlbGF5RXJyb3IiLCJjb21tZW50VGhyZWFkIiwiY29tbWVudHMiLCJ0aHJlYWQiLCJyb290Q29tbWVudCIsInRocmVhZEhvbGRlciIsInRocmVhZEhvbGRlcnMiLCJSZWZIb2xkZXIiLCJuYXRpdmVQYXRoIiwidG9OYXRpdmVQYXRoU2VwIiwicGF0aCIsImRpciIsImJhc2UiLCJwYXJzZSIsImxpbmVOdW1iZXIiLCJwb3NpdGlvblRleHQiLCJnZXRUcmFuc2xhdGVkUG9zaXRpb24iLCJyZWZKdW1wVG9GaWxlQnV0dG9uIiwianVtcFRvRmlsZURpc2FibGVkTGFiZWwiLCJlbGVtZW50SWQiLCJuYXZCdXR0b25DbGFzc2VzIiwib3V0ZGF0ZWQiLCJvcGVuRmlsZUNsYXNzZXMiLCJjeCIsIm9wZW5EaWZmQ2xhc3NlcyIsImlzT3BlbiIsInRocmVhZElEc09wZW4iLCJpc0hpZ2hsaWdodGVkIiwiaGlnaGxpZ2h0ZWRUaHJlYWRJRHMiLCJ0b2dnbGUiLCJldnQiLCJwcmV2ZW50RGVmYXVsdCIsInN0b3BQcm9wYWdhdGlvbiIsImhpZGVUaHJlYWRJRCIsInNob3dUaHJlYWRJRCIsInJlZiIsInNldHRlciIsImlzUmVzb2x2ZWQiLCJvcGVuIiwic2VwIiwiY3JlYXRlZEF0Iiwib3BlbkZpbGUiLCJkaXNhYmxlZCIsImNoZWNrb3V0T3AiLCJpc0VuYWJsZWQiLCJwb3NpdGlvbiIsIm9wZW5EaWZmIiwibWFuYWdlciIsInRhcmdldCIsInRpdGxlIiwic2hvd0RlbGF5IiwibXVsdGlGaWxlUGF0Y2giLCJmaWxlTmFtZSIsImRpZmZSb3ciLCJtYXhSb3dDb3VudCIsImNvbnRleHRMaW5lcyIsImNvbmZpZyIsInJlbmRlclRocmVhZCIsInJlcGx5SG9sZGVyIiwicmVwbHlIb2xkZXJzIiwibGFzdENvbW1lbnQiLCJsZW5ndGgiLCJpc1Bvc3RpbmciLCJwb3N0aW5nVG9UaHJlYWRJRCIsIm1hcCIsImNvbW1lbnQiLCJ1cGRhdGVDb21tZW50IiwicGxhY2Vob2xkZXJUZXh0IiwibGluZU51bWJlckd1dHRlclZpc2libGUiLCJzb2Z0V3JhcHBlZCIsImF1dG9IZWlnaHQiLCJyZWFkT25seSIsInJlZk1vZGVsIiwicmVzb2x2ZWRCeSIsInN1Ym1pdFJlcGx5IiwicmVuZGVyUmVzb2x2ZUJ1dHRvbiIsInJlc29sdmVVbnJlc29sdmVUaHJlYWQiLCJjdXJyZW50VGFyZ2V0IiwiZGF0YXNldCIsImxpbmUiLCJwYXJzZUludCIsInJlcG9Pd25lciIsInJlcG9OYW1lIiwiaXNzdWVpc2hOdW1iZXIiLCJnZXREYXRhRnJvbUdpdGh1YlVybCIsInRocmVhZElEIiwidGhyZWFkSWQiLCJjb21tZW50VGhyZWFkcyIsImZpbmQiLCJlYWNoIiwicm9vdEhvbGRlciIsIk1hcCIsImlzUmVmcmVzaGluZyIsInN1YnMiLCJDb21wb3NpdGVEaXNwb3NhYmxlIiwiY29tcG9uZW50RGlkTW91bnQiLCJzY3JvbGxUb1RocmVhZElEIiwic2Nyb2xsVG9UaHJlYWQiLCJjb21wb25lbnREaWRVcGRhdGUiLCJwcmV2UHJvcHMiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsImRpc3Bvc2UiLCJyZW5kZXJDb21tYW5kcyIsInJlbmRlckhlYWRlciIsInJlbmRlclJldmlld1N1bW1hcmllcyIsInJlbmRlclJldmlld0NvbW1lbnRUaHJlYWRzIiwicmVnaXN0cnkiLCJDb21tYW5kIiwiY29tbWFuZCIsImNhbGxiYWNrIiwibW9yZUNvbnRleHQiLCJsZXNzQ29udGV4dCIsInN1Ym1pdEN1cnJlbnRDb21tZW50IiwicmVmcmVzaCIsInNldFN0YXRlIiwic3ViIiwicmVmZXRjaCIsInJlbW92ZSIsImFkZCIsIm9wZW5QUiIsIm93bmVyIiwicmVwbyIsIm51bWJlciIsInJlZnJlc2hpbmciLCJjbGFzc05hbWVQcmVmaXgiLCJjbGFzc05hbWVzIiwicmVuZGVyRW1wdHlTdGF0ZSIsInB1bGxSZXF1ZXN0VVJMIiwibG9nU3RhcnRSZXZpZXdDbGljayIsInN1bW1hcmllcyIsInN1bW1hcnlTZWN0aW9uT3BlbiIsImhpZGVTdW1tYXJpZXMiLCJzaG93U3VtbWFyaWVzIiwicmVuZGVyUmV2aWV3U3VtbWFyeSIsInJlc29sdmVkVGhyZWFkcyIsImZpbHRlciIsInBhaXIiLCJ1bnJlc29sdmVkVGhyZWFkcyIsInRvZ2dsZUNvbW1lbnRzIiwiY29tbWVudFNlY3Rpb25PcGVuIiwiaGlkZUNvbW1lbnRzIiwic2hvd0NvbW1lbnRzIiwibWF4IiwicmVuZGVyUmV2aWV3Q29tbWVudFRocmVhZCIsImVudGl0eSIsImxhc3RFZGl0ZWRBdCIsInRleHQiLCJhdXRob3JBc3NvY2lhdGlvbiIsImJvZHkiLCJlZGl0b3IiLCJnZXRUZXh0IiwiZ2V0T3IiLCJkaWRTdWJtaXRDb21tZW50Iiwic2V0VGV4dCIsImJ5cGFzc1JlYWRPbmx5IiwiZGlkRmFpbENvbW1lbnQiLCJhZGRTaW5nbGVDb21tZW50IiwidHJhbnNsYXRpb25zIiwiY29tbWVudFRyYW5zbGF0aW9ucyIsImlzQ2hlY2tlZE91dFB1bGxSZXF1ZXN0Iiwid2h5IiwiY2hlY2tvdXRTdGF0ZXMiLCJDVVJSRU5UIiwidHJhbnNsYXRpb25zRm9yRmlsZSIsIm5vcm1hbGl6ZSIsImRpZmZUb0ZpbGVQb3NpdGlvbiIsImZpbGVUcmFuc2xhdGlvbnMiLCJuZXdQb3NpdGlvbiIsImVsZW1lbnQiLCJzY3JvbGxJbnRvVmlld0lmTmVlZGVkIiwidW5yZXNvbHZlVGhyZWFkIiwicmVzb2x2ZVRocmVhZCIsImV4cG9ydHMiLCJyZWxheSIsIlByb3BUeXBlcyIsInNoYXBlIiwiZW52aXJvbm1lbnQiLCJvYmplY3QiLCJpc1JlcXVpcmVkIiwicmVwb3NpdG9yeSIsInB1bGxSZXF1ZXN0IiwiYXJyYXkiLCJhcnJheU9mIiwiZnVuYyIsIkVuYWJsZWFibGVPcGVyYXRpb25Qcm9wVHlwZSIsImJvb2wiLCJzdHJpbmciLCJ3b3JrZGlyIiwid29ya3NwYWNlIl0sInNvdXJjZXMiOlsicmV2aWV3cy12aWV3LmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IFJlYWN0LCB7RnJhZ21lbnR9IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgY3ggZnJvbSAnY2xhc3NuYW1lcyc7XG5pbXBvcnQge0NvbXBvc2l0ZURpc3Bvc2FibGV9IGZyb20gJ2V2ZW50LWtpdCc7XG5cbmltcG9ydCB7RW5hYmxlYWJsZU9wZXJhdGlvblByb3BUeXBlfSBmcm9tICcuLi9wcm9wLXR5cGVzJztcbmltcG9ydCBUb29sdGlwIGZyb20gJy4uL2F0b20vdG9vbHRpcCc7XG5pbXBvcnQgQ29tbWFuZHMsIHtDb21tYW5kfSBmcm9tICcuLi9hdG9tL2NvbW1hbmRzJztcbmltcG9ydCBBdG9tVGV4dEVkaXRvciBmcm9tICcuLi9hdG9tL2F0b20tdGV4dC1lZGl0b3InO1xuaW1wb3J0IHtnZXREYXRhRnJvbUdpdGh1YlVybH0gZnJvbSAnLi9pc3N1ZWlzaC1saW5rJztcbmltcG9ydCBFbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXIgZnJvbSAnLi4vY29udHJvbGxlcnMvZW1vamktcmVhY3Rpb25zLWNvbnRyb2xsZXInO1xuaW1wb3J0IHtjaGVja291dFN0YXRlc30gZnJvbSAnLi4vY29udHJvbGxlcnMvcHItY2hlY2tvdXQtY29udHJvbGxlcic7XG5pbXBvcnQgR2l0aHViRG90Y29tTWFya2Rvd24gZnJvbSAnLi9naXRodWItZG90Y29tLW1hcmtkb3duJztcbmltcG9ydCBQYXRjaFByZXZpZXdWaWV3IGZyb20gJy4vcGF0Y2gtcHJldmlldy12aWV3JztcbmltcG9ydCBSZXZpZXdDb21tZW50VmlldyBmcm9tICcuL3Jldmlldy1jb21tZW50LXZpZXcnO1xuaW1wb3J0IEFjdGlvbmFibGVSZXZpZXdWaWV3IGZyb20gJy4vYWN0aW9uYWJsZS1yZXZpZXctdmlldyc7XG5pbXBvcnQgQ2hlY2tvdXRCdXR0b24gZnJvbSAnLi9jaGVja291dC1idXR0b24nO1xuaW1wb3J0IE9jdGljb24gZnJvbSAnLi4vYXRvbS9vY3RpY29uJztcbmltcG9ydCBUaW1lYWdvIGZyb20gJy4vdGltZWFnbyc7XG5pbXBvcnQgUmVmSG9sZGVyIGZyb20gJy4uL21vZGVscy9yZWYtaG9sZGVyJztcbmltcG9ydCB7dG9OYXRpdmVQYXRoU2VwLCBHSE9TVF9VU0VSfSBmcm9tICcuLi9oZWxwZXJzJztcbmltcG9ydCB7YWRkRXZlbnR9IGZyb20gJy4uL3JlcG9ydGVyLXByb3h5JztcblxuY29uc3QgYXV0aG9yQXNzb2NpYXRpb25UZXh0ID0ge1xuICBNRU1CRVI6ICdNZW1iZXInLFxuICBPV05FUjogJ093bmVyJyxcbiAgQ09MTEFCT1JBVE9SOiAnQ29sbGFib3JhdG9yJyxcbiAgQ09OVFJJQlVUT1I6ICdDb250cmlidXRvcicsXG4gIEZJUlNUX1RJTUVfQ09OVFJJQlVUT1I6ICdGaXJzdC10aW1lIGNvbnRyaWJ1dG9yJyxcbiAgRklSU1RfVElNRVI6ICdGaXJzdC10aW1lcicsXG4gIE5PTkU6IG51bGwsXG59O1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXZpZXdzVmlldyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4gIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4gICAgLy8gUmVsYXkgcmVzdWx0c1xuICAgIHJlbGF5OiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgZW52aXJvbm1lbnQ6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB9KS5pc1JlcXVpcmVkLFxuICAgIHJlcG9zaXRvcnk6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBwdWxsUmVxdWVzdDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHN1bW1hcmllczogUHJvcFR5cGVzLmFycmF5LmlzUmVxdWlyZWQsXG4gICAgY29tbWVudFRocmVhZHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICB0aHJlYWQ6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICAgIGNvbW1lbnRzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMub2JqZWN0KS5pc1JlcXVpcmVkLFxuICAgIH0pKSxcbiAgICByZWZldGNoOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gICAgLy8gUGFja2FnZSBtb2RlbHNcbiAgICBtdWx0aUZpbGVQYXRjaDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbnRleHRMaW5lczogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIGNoZWNrb3V0T3A6IEVuYWJsZWFibGVPcGVyYXRpb25Qcm9wVHlwZS5pc1JlcXVpcmVkLFxuICAgIHN1bW1hcnlTZWN0aW9uT3BlbjogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICBjb21tZW50U2VjdGlvbk9wZW46IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgdGhyZWFkSURzT3BlbjogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGhhczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB9KSxcbiAgICBoaWdobGlnaHRlZFRocmVhZElEczogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGhhczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB9KSxcbiAgICBwb3N0aW5nVG9UaHJlYWRJRDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICBzY3JvbGxUb1RocmVhZElEOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIC8vIFN0cnVjdHVyZTogTWFwPCByZWxhdGl2ZVBhdGg6IFN0cmluZywge1xuICAgIC8vICAgcmF3UG9zaXRpb25zOiBTZXQ8bGluZU51bWJlcnM6IE51bWJlcj4sXG4gICAgLy8gICBkaWZmVG9GaWxlUG9zaXRpb246IE1hcDxyYXdQb3NpdGlvbjogTnVtYmVyLCBhZGp1c3RlZFBvc2l0aW9uOiBOdW1iZXI+LFxuICAgIC8vICAgZmlsZVRyYW5zbGF0aW9uczogbnVsbCB8IE1hcDxhZGp1c3RlZFBvc2l0aW9uOiBOdW1iZXIsIHtuZXdQb3NpdGlvbjogTnVtYmVyfT4sXG4gICAgLy8gICBkaWdlc3Q6IFN0cmluZyxcbiAgICAvLyB9PlxuICAgIGNvbW1lbnRUcmFuc2xhdGlvbnM6IFByb3BUeXBlcy5vYmplY3QsXG5cbiAgICAvLyBmb3IgdGhlIGRvdGNvbSBsaW5rIGluIHRoZSBlbXB0eSBzdGF0ZVxuICAgIG51bWJlcjogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgIHJlcG86IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICBvd25lcjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIHdvcmtkaXI6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcblxuICAgIC8vIEF0b20gZW52aXJvbm1lbnRcbiAgICB3b3Jrc3BhY2U6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb25maWc6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb21tYW5kczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHRvb2x0aXBzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29uZmlybTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgIC8vIEFjdGlvbiBtZXRob2RzXG4gICAgb3BlbkZpbGU6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb3BlbkRpZmY6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb3BlblBSOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG1vcmVDb250ZXh0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGxlc3NDb250ZXh0OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9wZW5Jc3N1ZWlzaDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBzaG93U3VtbWFyaWVzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGhpZGVTdW1tYXJpZXM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgc2hvd0NvbW1lbnRzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGhpZGVDb21tZW50czogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBzaG93VGhyZWFkSUQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgaGlkZVRocmVhZElEOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHJlc29sdmVUaHJlYWQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgdW5yZXNvbHZlVGhyZWFkOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGFkZFNpbmdsZUNvbW1lbnQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgdXBkYXRlQ29tbWVudDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB1cGRhdGVTdW1tYXJ5OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHJlcG9ydFJlbGF5RXJyb3I6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcm9wcykge1xuICAgIHN1cGVyKHByb3BzKTtcblxuICAgIHRoaXMucm9vdEhvbGRlciA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICB0aGlzLnJlcGx5SG9sZGVycyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLnRocmVhZEhvbGRlcnMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5zdGF0ZSA9IHtcbiAgICAgIGlzUmVmcmVzaGluZzogZmFsc2UsXG4gICAgfTtcbiAgICB0aGlzLnN1YnMgPSBuZXcgQ29tcG9zaXRlRGlzcG9zYWJsZSgpO1xuICB9XG5cbiAgY29tcG9uZW50RGlkTW91bnQoKSB7XG4gICAgY29uc3Qge3Njcm9sbFRvVGhyZWFkSUR9ID0gdGhpcy5wcm9wcztcbiAgICBpZiAoc2Nyb2xsVG9UaHJlYWRJRCkge1xuICAgICAgdGhpcy5zY3JvbGxUb1RocmVhZChzY3JvbGxUb1RocmVhZElEKTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnREaWRVcGRhdGUocHJldlByb3BzKSB7XG4gICAgY29uc3Qge3Njcm9sbFRvVGhyZWFkSUR9ID0gdGhpcy5wcm9wcztcbiAgICBpZiAoc2Nyb2xsVG9UaHJlYWRJRCAmJiBzY3JvbGxUb1RocmVhZElEICE9PSBwcmV2UHJvcHMuc2Nyb2xsVG9UaHJlYWRJRCkge1xuICAgICAgdGhpcy5zY3JvbGxUb1RocmVhZChzY3JvbGxUb1RocmVhZElEKTtcbiAgICB9XG4gIH1cblxuICBjb21wb25lbnRXaWxsVW5tb3VudCgpIHtcbiAgICB0aGlzLnN1YnMuZGlzcG9zZSgpO1xuICB9XG5cbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzXCIgcmVmPXt0aGlzLnJvb3RIb2xkZXIuc2V0dGVyfT5cbiAgICAgICAge3RoaXMucmVuZGVyQ29tbWFuZHMoKX1cbiAgICAgICAge3RoaXMucmVuZGVySGVhZGVyKCl9XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtbGlzdFwiPlxuICAgICAgICAgIHt0aGlzLnJlbmRlclJldmlld1N1bW1hcmllcygpfVxuICAgICAgICAgIHt0aGlzLnJlbmRlclJldmlld0NvbW1lbnRUaHJlYWRzKCl9XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckNvbW1hbmRzKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8RnJhZ21lbnQ+XG4gICAgICAgIDxDb21tYW5kcyByZWdpc3RyeT17dGhpcy5wcm9wcy5jb21tYW5kc30gdGFyZ2V0PXt0aGlzLnJvb3RIb2xkZXJ9PlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6bW9yZS1jb250ZXh0XCIgY2FsbGJhY2s9e3RoaXMucHJvcHMubW9yZUNvbnRleHR9IC8+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpsZXNzLWNvbnRleHRcIiBjYWxsYmFjaz17dGhpcy5wcm9wcy5sZXNzQ29udGV4dH0gLz5cbiAgICAgICAgPC9Db21tYW5kcz5cbiAgICAgICAgPENvbW1hbmRzIHJlZ2lzdHJ5PXt0aGlzLnByb3BzLmNvbW1hbmRzfSB0YXJnZXQ9XCIuZ2l0aHViLVJldmlldy1yZXBseVwiPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6c3VibWl0LWNvbW1lbnRcIiBjYWxsYmFjaz17dGhpcy5zdWJtaXRDdXJyZW50Q29tbWVudH0gLz5cbiAgICAgICAgPC9Db21tYW5kcz5cbiAgICAgIDwvRnJhZ21lbnQ+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlckhlYWRlcigpIHtcbiAgICBjb25zdCByZWZyZXNoID0gKCkgPT4ge1xuICAgICAgaWYgKHRoaXMuc3RhdGUuaXNSZWZyZXNoaW5nKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2V0U3RhdGUoe2lzUmVmcmVzaGluZzogdHJ1ZX0pO1xuICAgICAgY29uc3Qgc3ViID0gdGhpcy5wcm9wcy5yZWZldGNoKCgpID0+IHtcbiAgICAgICAgdGhpcy5zdWJzLnJlbW92ZShzdWIpO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtpc1JlZnJlc2hpbmc6IGZhbHNlfSk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuc3Vicy5hZGQoc3ViKTtcbiAgICB9O1xuICAgIHJldHVybiAoXG4gICAgICA8aGVhZGVyIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLXRvcEhlYWRlclwiPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJpY29uIGljb24tY29tbWVudC1kaXNjdXNzaW9uXCIgLz5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtaGVhZGVyVGl0bGVcIj5cbiAgICAgICAgICBSZXZpZXdzIGZvciZuYnNwO1xuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLWNsaWNrYWJsZVwiIG9uQ2xpY2s9e3RoaXMucHJvcHMub3BlblBSfT5cbiAgICAgICAgICAgIHt0aGlzLnByb3BzLm93bmVyfS97dGhpcy5wcm9wcy5yZXBvfSN7dGhpcy5wcm9wcy5udW1iZXJ9XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L3NwYW4+XG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBjbGFzc05hbWU9e2N4KFxuICAgICAgICAgICAgJ2dpdGh1Yi1SZXZpZXdzLWhlYWRlckJ1dHRvbiBnaXRodWItUmV2aWV3cy1jbGlja2FibGUgaWNvbiBpY29uLXJlcG8tc3luYycsXG4gICAgICAgICAgICB7cmVmcmVzaGluZzogdGhpcy5zdGF0ZS5pc1JlZnJlc2hpbmd9LFxuICAgICAgICAgICl9XG4gICAgICAgICAgb25DbGljaz17cmVmcmVzaH1cbiAgICAgICAgLz5cbiAgICAgICAgPENoZWNrb3V0QnV0dG9uXG4gICAgICAgICAgY2hlY2tvdXRPcD17dGhpcy5wcm9wcy5jaGVja291dE9wfVxuICAgICAgICAgIGNsYXNzTmFtZVByZWZpeD1cImdpdGh1Yi1SZXZpZXdzLWNoZWNrb3V0QnV0dG9uLS1cIlxuICAgICAgICAgIGNsYXNzTmFtZXM9e1snZ2l0aHViLVJldmlld3MtaGVhZGVyQnV0dG9uJ119XG4gICAgICAgIC8+XG4gICAgICA8L2hlYWRlcj5cbiAgICApO1xuICB9XG5cbiAgbG9nU3RhcnRSZXZpZXdDbGljayA9ICgpID0+IHtcbiAgICBhZGRFdmVudCgnc3RhcnQtcHItcmV2aWV3Jywge3BhY2thZ2U6ICdnaXRodWInLCBjb21wb25lbnQ6IHRoaXMuY29uc3RydWN0b3IubmFtZX0pO1xuICB9XG5cbiAgcmVuZGVyRW1wdHlTdGF0ZSgpIHtcbiAgICBjb25zdCB7bnVtYmVyLCByZXBvLCBvd25lcn0gPSB0aGlzLnByb3BzO1xuICAgIC8vIHRvZG86IG1ha2UgdGhpcyBvcGVuIHRoZSByZXZpZXcgZmxvdyBpbiBBdG9tIGluc3RlYWQgb2YgZG90Y29tXG4gICAgY29uc3QgcHVsbFJlcXVlc3RVUkwgPSBgaHR0cHM6Ly93d3cuZ2l0aHViLmNvbS8ke293bmVyfS8ke3JlcG99L3B1bGwvJHtudW1iZXJ9L2ZpbGVzL2A7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtZW1wdHlTdGF0ZVwiPlxuICAgICAgICA8aW1nIHNyYz1cImF0b206Ly9naXRodWIvaW1nL21vbmEuc3ZnXCIgYWx0PVwiTW9uYSB0aGUgb2N0b2NhdCBpbiBzcGFhYWNjZWVcIiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1lbXB0eUltZ1wiIC8+XG4gICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtZW1wdHlUZXh0XCI+XG4gICAgICAgICAgVGhpcyBwdWxsIHJlcXVlc3QgaGFzIG5vIHJldmlld3NcbiAgICAgICAgPC9kaXY+XG4gICAgICAgIDxidXR0b24gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtZW1wdHlDYWxsVG9BY3Rpb25CdXR0b24gYnRuXCI+XG4gICAgICAgICAgPGEgaHJlZj17cHVsbFJlcXVlc3RVUkx9IG9uQ2xpY2s9e3RoaXMubG9nU3RhcnRSZXZpZXdDbGlja30+XG4gICAgICAgICAgICBTdGFydCBhIG5ldyByZXZpZXdcbiAgICAgICAgICA8L2E+XG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclJldmlld1N1bW1hcmllcygpIHtcbiAgICBpZiAodGhpcy5wcm9wcy5zdW1tYXJpZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5yZW5kZXJFbXB0eVN0YXRlKCk7XG4gICAgfVxuXG4gICAgY29uc3QgdG9nZ2xlID0gZXZ0ID0+IHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgaWYgKHRoaXMucHJvcHMuc3VtbWFyeVNlY3Rpb25PcGVuKSB7XG4gICAgICAgIHRoaXMucHJvcHMuaGlkZVN1bW1hcmllcygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5wcm9wcy5zaG93U3VtbWFyaWVzKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGV0YWlsc1xuICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1zZWN0aW9uIHN1bW1hcmllc1wiXG4gICAgICAgIG9wZW49e3RoaXMucHJvcHMuc3VtbWFyeVNlY3Rpb25PcGVufT5cblxuICAgICAgICA8c3VtbWFyeSBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1oZWFkZXJcIiBvbkNsaWNrPXt0b2dnbGV9PlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLXRpdGxlXCI+U3VtbWFyaWVzPC9zcGFuPlxuICAgICAgICA8L3N1bW1hcnk+XG4gICAgICAgIDxtYWluIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLWNvbnRhaW5lclwiPlxuICAgICAgICAgIHt0aGlzLnByb3BzLnN1bW1hcmllcy5tYXAodGhpcy5yZW5kZXJSZXZpZXdTdW1tYXJ5KX1cbiAgICAgICAgPC9tYWluPlxuXG4gICAgICA8L2RldGFpbHM+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclJldmlld1N1bW1hcnkgPSByZXZpZXcgPT4ge1xuICAgIGNvbnN0IHJldmlld1R5cGVzID0gdHlwZSA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBBUFBST1ZFRDoge2ljb246ICdpY29uLWNoZWNrJywgY29weTogJ2FwcHJvdmVkIHRoZXNlIGNoYW5nZXMnfSxcbiAgICAgICAgQ09NTUVOVEVEOiB7aWNvbjogJ2ljb24tY29tbWVudCcsIGNvcHk6ICdjb21tZW50ZWQnfSxcbiAgICAgICAgQ0hBTkdFU19SRVFVRVNURUQ6IHtpY29uOiAnaWNvbi1hbGVydCcsIGNvcHk6ICdyZXF1ZXN0ZWQgY2hhbmdlcyd9LFxuICAgICAgfVt0eXBlXSB8fCB7aWNvbjogJycsIGNvcHk6ICcnfTtcbiAgICB9O1xuXG4gICAgY29uc3Qge2ljb24sIGNvcHl9ID0gcmV2aWV3VHlwZXMocmV2aWV3LnN0YXRlKTtcblxuICAgIC8vIGZpbHRlciBub24gYWN0aW9uYWJsZSBlbXB0eSBzdW1tYXJ5IGNvbW1lbnRzIGZyb20gdGhpcyB2aWV3XG4gICAgaWYgKHJldmlldy5zdGF0ZSA9PT0gJ1BFTkRJTkcnIHx8IChyZXZpZXcuc3RhdGUgPT09ICdDT01NRU5URUQnICYmIHJldmlldy5ib2R5SFRNTCA9PT0gJycpKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCBhdXRob3IgPSByZXZpZXcuYXV0aG9yIHx8IEdIT1NUX1VTRVI7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3U3VtbWFyeVwiIGtleT17cmV2aWV3LmlkfT5cbiAgICAgICAgPEFjdGlvbmFibGVSZXZpZXdWaWV3XG4gICAgICAgICAgb3JpZ2luYWxDb250ZW50PXtyZXZpZXd9XG4gICAgICAgICAgY29uZmlybT17dGhpcy5wcm9wcy5jb25maXJtfVxuICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgIGNvbnRlbnRVcGRhdGVyPXt0aGlzLnByb3BzLnVwZGF0ZVN1bW1hcnl9XG4gICAgICAgICAgcmVuZGVyPXtzaG93QWN0aW9uc01lbnUgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPEZyYWdtZW50PlxuICAgICAgICAgICAgICAgIDxoZWFkZXIgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1oZWFkZXJcIj5cbiAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1oZWFkZXItYXV0aG9yRGF0YVwiPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9e2BnaXRodWItUmV2aWV3U3VtbWFyeS1pY29uIGljb24gJHtpY29ufWB9IC8+XG4gICAgICAgICAgICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld1N1bW1hcnktYXZhdGFyXCJcbiAgICAgICAgICAgICAgICAgICAgICBzcmM9e2F1dGhvci5hdmF0YXJVcmx9IGFsdD17YXV0aG9yLmxvZ2lufVxuICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICA8YSBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3U3VtbWFyeS11c2VybmFtZVwiIGhyZWY9e2F1dGhvci51cmx9PnthdXRob3IubG9naW59PC9hPlxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3U3VtbWFyeS10eXBlXCI+e2NvcHl9PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJFZGl0ZWRMaW5rKHJldmlldyl9XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnJlbmRlckF1dGhvckFzc29jaWF0aW9uKHJldmlldyl9XG4gICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDxUaW1lYWdvIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdTdW1tYXJ5LXRpbWVBZ29cIiB0aW1lPXtyZXZpZXcuc3VibWl0dGVkQXR9IGRpc3BsYXlTdHlsZT1cInNob3J0XCIgLz5cbiAgICAgICAgICAgICAgICAgIDxPY3RpY29uXG4gICAgICAgICAgICAgICAgICAgIGljb249XCJlbGxpcHNlc1wiXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctYWN0aW9uc01lbnVcIlxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtldmVudCA9PiBzaG93QWN0aW9uc01lbnUoZXZlbnQsIHJldmlldywgYXV0aG9yKX1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9oZWFkZXI+XG4gICAgICAgICAgICAgICAgPG1haW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld1N1bW1hcnktY29tbWVudFwiPlxuICAgICAgICAgICAgICAgICAgPEdpdGh1YkRvdGNvbU1hcmtkb3duXG4gICAgICAgICAgICAgICAgICAgIGh0bWw9e3Jldmlldy5ib2R5SFRNTH1cbiAgICAgICAgICAgICAgICAgICAgc3dpdGNoVG9Jc3N1ZWlzaD17dGhpcy5wcm9wcy5vcGVuSXNzdWVpc2h9XG4gICAgICAgICAgICAgICAgICAgIG9wZW5Jc3N1ZWlzaExpbmtJbk5ld1RhYj17dGhpcy5vcGVuSXNzdWVpc2hMaW5rSW5OZXdUYWJ9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgPEVtb2ppUmVhY3Rpb25zQ29udHJvbGxlclxuICAgICAgICAgICAgICAgICAgICByZWFjdGFibGU9e3Jldmlld31cbiAgICAgICAgICAgICAgICAgICAgdG9vbHRpcHM9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgICAgICAgICAgIHJlcG9ydFJlbGF5RXJyb3I9e3RoaXMucHJvcHMucmVwb3J0UmVsYXlFcnJvcn1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgPC9tYWluPlxuICAgICAgICAgICAgICA8L0ZyYWdtZW50PlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9fVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclJldmlld0NvbW1lbnRUaHJlYWRzKCkge1xuICAgIGNvbnN0IGNvbW1lbnRUaHJlYWRzID0gdGhpcy5wcm9wcy5jb21tZW50VGhyZWFkcztcbiAgICBpZiAoY29tbWVudFRocmVhZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCByZXNvbHZlZFRocmVhZHMgPSBjb21tZW50VGhyZWFkcy5maWx0ZXIocGFpciA9PiBwYWlyLnRocmVhZC5pc1Jlc29sdmVkKTtcbiAgICBjb25zdCB1bnJlc29sdmVkVGhyZWFkcyA9IGNvbW1lbnRUaHJlYWRzLmZpbHRlcihwYWlyID0+ICFwYWlyLnRocmVhZC5pc1Jlc29sdmVkKTtcblxuICAgIGNvbnN0IHRvZ2dsZUNvbW1lbnRzID0gZXZ0ID0+IHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgaWYgKHRoaXMucHJvcHMuY29tbWVudFNlY3Rpb25PcGVuKSB7XG4gICAgICAgIHRoaXMucHJvcHMuaGlkZUNvbW1lbnRzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnByb3BzLnNob3dDb21tZW50cygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRldGFpbHNcbiAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3Mtc2VjdGlvbiBjb21tZW50c1wiXG4gICAgICAgIG9wZW49e3RoaXMucHJvcHMuY29tbWVudFNlY3Rpb25PcGVufT5cblxuICAgICAgICA8c3VtbWFyeSBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1oZWFkZXJcIiBvbkNsaWNrPXt0b2dnbGVDb21tZW50c30+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtdGl0bGVcIj5Db21tZW50czwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1wcm9ncmVzc1wiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtY291bnRcIj5cbiAgICAgICAgICAgICAgUmVzb2x2ZWRcbiAgICAgICAgICAgICAgeycgJ308c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1jb3VudE5yXCI+e3Jlc29sdmVkVGhyZWFkcy5sZW5ndGh9PC9zcGFuPnsnICd9XG4gICAgICAgICAgICAgIG9mXG4gICAgICAgICAgICAgIHsnICd9PHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtY291bnROclwiPntyZXNvbHZlZFRocmVhZHMubGVuZ3RoICsgdW5yZXNvbHZlZFRocmVhZHMubGVuZ3RofTwvc3Bhbj5cbiAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgIDxwcm9ncmVzc1xuICAgICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1wcm9nZXNzQmFyXCIgdmFsdWU9e3Jlc29sdmVkVGhyZWFkcy5sZW5ndGh9XG4gICAgICAgICAgICAgIG1heD17cmVzb2x2ZWRUaHJlYWRzLmxlbmd0aCArIHVucmVzb2x2ZWRUaHJlYWRzLmxlbmd0aH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgPC9zcGFuPlxuICAgICAgICA8L3N1bW1hcnk+XG5cbiAgICAgICAge3VucmVzb2x2ZWRUaHJlYWRzLmxlbmd0aCA+IDAgJiYgPG1haW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtY29udGFpbmVyXCI+XG4gICAgICAgICAge3VucmVzb2x2ZWRUaHJlYWRzLm1hcCh0aGlzLnJlbmRlclJldmlld0NvbW1lbnRUaHJlYWQpfVxuICAgICAgICA8L21haW4+fVxuICAgICAgICB7cmVzb2x2ZWRUaHJlYWRzLmxlbmd0aCA+IDAgJiYgPGRldGFpbHMgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3Mtc2VjdGlvbiByZXNvbHZlZC1jb21tZW50c1wiIG9wZW4+XG4gICAgICAgICAgPHN1bW1hcnkgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtaGVhZGVyXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy10aXRsZVwiPlJlc29sdmVkPC9zcGFuPlxuICAgICAgICAgIDwvc3VtbWFyeT5cbiAgICAgICAgICA8bWFpbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1jb250YWluZXJcIj5cbiAgICAgICAgICAgIHtyZXNvbHZlZFRocmVhZHMubWFwKHRoaXMucmVuZGVyUmV2aWV3Q29tbWVudFRocmVhZCl9XG4gICAgICAgICAgPC9tYWluPlxuICAgICAgICA8L2RldGFpbHM+fVxuXG4gICAgICA8L2RldGFpbHM+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclJldmlld0NvbW1lbnRUaHJlYWQgPSBjb21tZW50VGhyZWFkID0+IHtcbiAgICBjb25zdCB7Y29tbWVudHMsIHRocmVhZH0gPSBjb21tZW50VGhyZWFkO1xuICAgIGNvbnN0IHJvb3RDb21tZW50ID0gY29tbWVudHNbMF07XG4gICAgaWYgKCFyb290Q29tbWVudCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgbGV0IHRocmVhZEhvbGRlciA9IHRoaXMudGhyZWFkSG9sZGVycy5nZXQodGhyZWFkLmlkKTtcbiAgICBpZiAoIXRocmVhZEhvbGRlcikge1xuICAgICAgdGhyZWFkSG9sZGVyID0gbmV3IFJlZkhvbGRlcigpO1xuICAgICAgdGhpcy50aHJlYWRIb2xkZXJzLnNldCh0aHJlYWQuaWQsIHRocmVhZEhvbGRlcik7XG4gICAgfVxuXG4gICAgY29uc3QgbmF0aXZlUGF0aCA9IHRvTmF0aXZlUGF0aFNlcChyb290Q29tbWVudC5wYXRoKTtcbiAgICBjb25zdCB7ZGlyLCBiYXNlfSA9IHBhdGgucGFyc2UobmF0aXZlUGF0aCk7XG4gICAgY29uc3Qge2xpbmVOdW1iZXIsIHBvc2l0aW9uVGV4dH0gPSB0aGlzLmdldFRyYW5zbGF0ZWRQb3NpdGlvbihyb290Q29tbWVudCk7XG5cbiAgICBjb25zdCByZWZKdW1wVG9GaWxlQnV0dG9uID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIGNvbnN0IGp1bXBUb0ZpbGVEaXNhYmxlZExhYmVsID0gJ0NoZWNrb3V0IHRoaXMgcHVsbCByZXF1ZXN0IHRvIGVuYWJsZSBKdW1wIFRvIEZpbGUuJztcblxuICAgIGNvbnN0IGVsZW1lbnRJZCA9IGByZXZpZXctdGhyZWFkLSR7dGhyZWFkLmlkfWA7XG5cbiAgICBjb25zdCBuYXZCdXR0b25DbGFzc2VzID0gWydnaXRodWItUmV2aWV3LW5hdkJ1dHRvbicsICdpY29uJywge291dGRhdGVkOiAhbGluZU51bWJlcn1dO1xuICAgIGNvbnN0IG9wZW5GaWxlQ2xhc3NlcyA9IGN4KCdpY29uLWNvZGUnLCAuLi5uYXZCdXR0b25DbGFzc2VzKTtcbiAgICBjb25zdCBvcGVuRGlmZkNsYXNzZXMgPSBjeCgnaWNvbi1kaWZmJywgLi4ubmF2QnV0dG9uQ2xhc3Nlcyk7XG5cbiAgICBjb25zdCBpc09wZW4gPSB0aGlzLnByb3BzLnRocmVhZElEc09wZW4uaGFzKHRocmVhZC5pZCk7XG4gICAgY29uc3QgaXNIaWdobGlnaHRlZCA9IHRoaXMucHJvcHMuaGlnaGxpZ2h0ZWRUaHJlYWRJRHMuaGFzKHRocmVhZC5pZCk7XG4gICAgY29uc3QgdG9nZ2xlID0gZXZ0ID0+IHtcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xuXG4gICAgICBpZiAoaXNPcGVuKSB7XG4gICAgICAgIHRoaXMucHJvcHMuaGlkZVRocmVhZElEKHRocmVhZC5pZCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnByb3BzLnNob3dUaHJlYWRJRCh0aHJlYWQuaWQpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICBjb25zdCBhdXRob3IgPSByb290Q29tbWVudC5hdXRob3IgfHwgR0hPU1RfVVNFUjtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGV0YWlsc1xuICAgICAgICByZWY9e3RocmVhZEhvbGRlci5zZXR0ZXJ9XG4gICAgICAgIGNsYXNzTmFtZT17Y3goJ2dpdGh1Yi1SZXZpZXcnLCB7J3Jlc29sdmVkJzogdGhyZWFkLmlzUmVzb2x2ZWQsICdnaXRodWItUmV2aWV3LS1oaWdobGlnaHQnOiBpc0hpZ2hsaWdodGVkfSl9XG4gICAgICAgIGtleT17ZWxlbWVudElkfVxuICAgICAgICBpZD17ZWxlbWVudElkfVxuICAgICAgICBvcGVuPXtpc09wZW59PlxuXG4gICAgICAgIDxzdW1tYXJ5IGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctcmVmZXJlbmNlXCIgb25DbGljaz17dG9nZ2xlfT5cbiAgICAgICAgICB7ZGlyICYmIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctcGF0aFwiPntkaXJ9PC9zcGFuPn1cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LWZpbGVcIj57ZGlyID8gcGF0aC5zZXAgOiAnJ317YmFzZX08L3NwYW4+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1saW5lTnJcIj57cG9zaXRpb25UZXh0fTwvc3Bhbj5cbiAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctcmVmZXJlbmNlQXZhdGFyXCJcbiAgICAgICAgICAgIHNyYz17YXV0aG9yLmF2YXRhclVybH0gYWx0PXthdXRob3IubG9naW59XG4gICAgICAgICAgLz5cbiAgICAgICAgICA8VGltZWFnbyBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LXJlZmVyZW5jZVRpbWVBZ29cIiB0aW1lPXtyb290Q29tbWVudC5jcmVhdGVkQXR9IGRpc3BsYXlTdHlsZT1cInNob3J0XCIgLz5cbiAgICAgICAgPC9zdW1tYXJ5PlxuICAgICAgICA8bmF2IGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctbmF2XCI+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9e29wZW5GaWxlQ2xhc3Nlc31cbiAgICAgICAgICAgIGRhdGEtcGF0aD17bmF0aXZlUGF0aH0gZGF0YS1saW5lPXtsaW5lTnVtYmVyfVxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5vcGVuRmlsZX0gZGlzYWJsZWQ9e3RoaXMucHJvcHMuY2hlY2tvdXRPcC5pc0VuYWJsZWQoKX1cbiAgICAgICAgICAgIHJlZj17cmVmSnVtcFRvRmlsZUJ1dHRvbi5zZXR0ZXJ9PlxuICAgICAgICAgICAgSnVtcCBUbyBGaWxlXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9e29wZW5EaWZmQ2xhc3Nlc31cbiAgICAgICAgICAgIGRhdGEtcGF0aD17bmF0aXZlUGF0aH0gZGF0YS1saW5lPXtyb290Q29tbWVudC5wb3NpdGlvbn1cbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMub3BlbkRpZmZ9PlxuICAgICAgICAgICAgT3BlbiBEaWZmXG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAge3RoaXMucHJvcHMuY2hlY2tvdXRPcC5pc0VuYWJsZWQoKSAmJlxuICAgICAgICAgICAgPFRvb2x0aXBcbiAgICAgICAgICAgICAgbWFuYWdlcj17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICAgICAgdGFyZ2V0PXtyZWZKdW1wVG9GaWxlQnV0dG9ufVxuICAgICAgICAgICAgICB0aXRsZT17anVtcFRvRmlsZURpc2FibGVkTGFiZWx9XG4gICAgICAgICAgICAgIHNob3dEZWxheT17MjAwfVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICB9XG4gICAgICAgIDwvbmF2PlxuXG4gICAgICAgIHtyb290Q29tbWVudC5wb3NpdGlvbiAhPT0gbnVsbCAmJiAoXG4gICAgICAgICAgPFBhdGNoUHJldmlld1ZpZXdcbiAgICAgICAgICAgIG11bHRpRmlsZVBhdGNoPXt0aGlzLnByb3BzLm11bHRpRmlsZVBhdGNofVxuICAgICAgICAgICAgZmlsZU5hbWU9e25hdGl2ZVBhdGh9XG4gICAgICAgICAgICBkaWZmUm93PXtyb290Q29tbWVudC5wb3NpdGlvbn1cbiAgICAgICAgICAgIG1heFJvd0NvdW50PXt0aGlzLnByb3BzLmNvbnRleHRMaW5lc31cbiAgICAgICAgICAgIGNvbmZpZz17dGhpcy5wcm9wcy5jb25maWd9XG4gICAgICAgICAgLz5cbiAgICAgICAgKX1cblxuICAgICAgICB7dGhpcy5yZW5kZXJUaHJlYWQoe3RocmVhZCwgY29tbWVudHN9KX1cblxuICAgICAgPC9kZXRhaWxzPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJUaHJlYWQgPSAoe3RocmVhZCwgY29tbWVudHN9KSA9PiB7XG4gICAgbGV0IHJlcGx5SG9sZGVyID0gdGhpcy5yZXBseUhvbGRlcnMuZ2V0KHRocmVhZC5pZCk7XG4gICAgaWYgKCFyZXBseUhvbGRlcikge1xuICAgICAgcmVwbHlIb2xkZXIgPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgICB0aGlzLnJlcGx5SG9sZGVycy5zZXQodGhyZWFkLmlkLCByZXBseUhvbGRlcik7XG4gICAgfVxuXG4gICAgY29uc3QgbGFzdENvbW1lbnQgPSBjb21tZW50c1tjb21tZW50cy5sZW5ndGggLSAxXTtcbiAgICBjb25zdCBpc1Bvc3RpbmcgPSB0aGlzLnByb3BzLnBvc3RpbmdUb1RocmVhZElEICE9PSBudWxsO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgPG1haW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1jb21tZW50c1wiPlxuXG4gICAgICAgICAge2NvbW1lbnRzLm1hcChjb21tZW50ID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxSZXZpZXdDb21tZW50Vmlld1xuICAgICAgICAgICAgICAgIGtleT17Y29tbWVudC5pZH1cbiAgICAgICAgICAgICAgICBjb21tZW50PXtjb21tZW50fVxuICAgICAgICAgICAgICAgIG9wZW5Jc3N1ZWlzaD17dGhpcy5wcm9wcy5vcGVuSXNzdWVpc2h9XG4gICAgICAgICAgICAgICAgb3Blbklzc3VlaXNoTGlua0luTmV3VGFiPXt0aGlzLm9wZW5Jc3N1ZWlzaExpbmtJbk5ld1RhYn1cbiAgICAgICAgICAgICAgICB0b29sdGlwcz17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICAgICAgICByZXBvcnRSZWxheUVycm9yPXt0aGlzLnByb3BzLnJlcG9ydFJlbGF5RXJyb3J9XG4gICAgICAgICAgICAgICAgcmVuZGVyRWRpdGVkTGluaz17dGhpcy5yZW5kZXJFZGl0ZWRMaW5rfVxuICAgICAgICAgICAgICAgIHJlbmRlckF1dGhvckFzc29jaWF0aW9uPXt0aGlzLnJlbmRlckF1dGhvckFzc29jaWF0aW9ufVxuICAgICAgICAgICAgICAgIGlzUG9zdGluZz17aXNQb3N0aW5nfVxuICAgICAgICAgICAgICAgIGNvbmZpcm09e3RoaXMucHJvcHMuY29uZmlybX1cbiAgICAgICAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICAgICAgICB1cGRhdGVDb21tZW50PXt0aGlzLnByb3BzLnVwZGF0ZUNvbW1lbnR9XG4gICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH0pfVxuXG4gICAgICAgICAgPGRpdlxuICAgICAgICAgICAgY2xhc3NOYW1lPXtjeCgnZ2l0aHViLVJldmlldy1yZXBseScsIHsnZ2l0aHViLVJldmlldy1yZXBseS0tZGlzYWJsZWQnOiBpc1Bvc3Rpbmd9KX1cbiAgICAgICAgICAgIGRhdGEtdGhyZWFkLWlkPXt0aHJlYWQuaWR9PlxuXG4gICAgICAgICAgICA8QXRvbVRleHRFZGl0b3JcbiAgICAgICAgICAgICAgcGxhY2Vob2xkZXJUZXh0PVwiUmVwbHkuLi5cIlxuICAgICAgICAgICAgICBsaW5lTnVtYmVyR3V0dGVyVmlzaWJsZT17ZmFsc2V9XG4gICAgICAgICAgICAgIHNvZnRXcmFwcGVkPXt0cnVlfVxuICAgICAgICAgICAgICBhdXRvSGVpZ2h0PXt0cnVlfVxuICAgICAgICAgICAgICByZWFkT25seT17aXNQb3N0aW5nfVxuICAgICAgICAgICAgICByZWZNb2RlbD17cmVwbHlIb2xkZXJ9XG4gICAgICAgICAgICAvPlxuXG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvbWFpbj5cbiAgICAgICAge3RocmVhZC5pc1Jlc29sdmVkICYmIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1yZXNvbHZlZFRleHRcIj5cbiAgICAgICAgICBUaGlzIGNvbnZlcnNhdGlvbiB3YXMgbWFya2VkIGFzIHJlc29sdmVkIGJ5IEB7dGhyZWFkLnJlc29sdmVkQnkubG9naW59XG4gICAgICAgIDwvZGl2Pn1cbiAgICAgICAgPGZvb3RlciBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LWZvb3RlclwiPlxuICAgICAgICAgIDxidXR0b25cbiAgICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctcmVwbHlCdXR0b24gYnRuIGJ0bi1wcmltYXJ5XCJcbiAgICAgICAgICAgIHRpdGxlPVwiQWRkIHlvdXIgY29tbWVudFwiXG4gICAgICAgICAgICBkaXNhYmxlZD17aXNQb3N0aW5nfVxuICAgICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5zdWJtaXRSZXBseShyZXBseUhvbGRlciwgdGhyZWFkLCBsYXN0Q29tbWVudCl9PlxuICAgICAgICAgICAgQ29tbWVudFxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIHt0aGlzLnJlbmRlclJlc29sdmVCdXR0b24odGhyZWFkKX1cbiAgICAgICAgPC9mb290ZXI+XG4gICAgICA8L0ZyYWdtZW50PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJSZXNvbHZlQnV0dG9uID0gdGhyZWFkID0+IHtcbiAgICBpZiAodGhyZWFkLmlzUmVzb2x2ZWQpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LXJlc29sdmVCdXR0b24gYnRuIGljb24gaWNvbi1jaGVja1wiXG4gICAgICAgICAgdGl0bGU9XCJVbnJlc29sdmUgY29udmVyc2F0aW9uXCJcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLnJlc29sdmVVbnJlc29sdmVUaHJlYWQodGhyZWFkKX0+XG4gICAgICAgICAgVW5yZXNvbHZlIGNvbnZlcnNhdGlvblxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxidXR0b25cbiAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LXJlc29sdmVCdXR0b24gYnRuIGljb24gaWNvbi1jaGVja1wiXG4gICAgICAgICAgdGl0bGU9XCJSZXNvbHZlIGNvbnZlcnNhdGlvblwiXG4gICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5yZXNvbHZlVW5yZXNvbHZlVGhyZWFkKHRocmVhZCl9PlxuICAgICAgICAgIFJlc29sdmUgY29udmVyc2F0aW9uXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXJFZGl0ZWRMaW5rKGVudGl0eSkge1xuICAgIGlmICghZW50aXR5Lmxhc3RFZGl0ZWRBdCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctZWRpdGVkXCI+XG4gICAgICAgICZuYnNwO+KAoiZuYnNwO1xuICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctZWRpdGVkXCIgaHJlZj17ZW50aXR5LnVybH0+ZWRpdGVkPC9hPlxuICAgICAgICA8L3NwYW4+XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlckF1dGhvckFzc29jaWF0aW9uKGVudGl0eSkge1xuICAgIGNvbnN0IHRleHQgPSBhdXRob3JBc3NvY2lhdGlvblRleHRbZW50aXR5LmF1dGhvckFzc29jaWF0aW9uXTtcbiAgICBpZiAoIXRleHQpIHsgcmV0dXJuIG51bGw7IH1cbiAgICByZXR1cm4gKFxuICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1hdXRob3JBc3NvY2lhdGlvbkJhZGdlIGJhZGdlXCI+e3RleHR9PC9zcGFuPlxuICAgICk7XG4gIH1cblxuICBvcGVuRmlsZSA9IGV2dCA9PiB7XG4gICAgaWYgKCF0aGlzLnByb3BzLmNoZWNrb3V0T3AuaXNFbmFibGVkKCkpIHtcbiAgICAgIGNvbnN0IHRhcmdldCA9IGV2dC5jdXJyZW50VGFyZ2V0O1xuICAgICAgdGhpcy5wcm9wcy5vcGVuRmlsZSh0YXJnZXQuZGF0YXNldC5wYXRoLCB0YXJnZXQuZGF0YXNldC5saW5lKTtcbiAgICB9XG4gIH1cblxuICBvcGVuRGlmZiA9IGV2dCA9PiB7XG4gICAgY29uc3QgdGFyZ2V0ID0gZXZ0LmN1cnJlbnRUYXJnZXQ7XG4gICAgdGhpcy5wcm9wcy5vcGVuRGlmZih0YXJnZXQuZGF0YXNldC5wYXRoLCBwYXJzZUludCh0YXJnZXQuZGF0YXNldC5saW5lLCAxMCkpO1xuICB9XG5cbiAgb3Blbklzc3VlaXNoTGlua0luTmV3VGFiID0gZXZ0ID0+IHtcbiAgICBjb25zdCB7cmVwb093bmVyLCByZXBvTmFtZSwgaXNzdWVpc2hOdW1iZXJ9ID0gZ2V0RGF0YUZyb21HaXRodWJVcmwoZXZ0LnRhcmdldC5kYXRhc2V0LnVybCk7XG4gICAgcmV0dXJuIHRoaXMucHJvcHMub3Blbklzc3VlaXNoKHJlcG9Pd25lciwgcmVwb05hbWUsIGlzc3VlaXNoTnVtYmVyKTtcbiAgfVxuXG4gIHN1Ym1pdFJlcGx5KHJlcGx5SG9sZGVyLCB0aHJlYWQsIGxhc3RDb21tZW50KSB7XG4gICAgY29uc3QgYm9keSA9IHJlcGx5SG9sZGVyLm1hcChlZGl0b3IgPT4gZWRpdG9yLmdldFRleHQoKSkuZ2V0T3IoJycpO1xuICAgIGNvbnN0IGRpZFN1Ym1pdENvbW1lbnQgPSAoKSA9PiByZXBseUhvbGRlci5tYXAoZWRpdG9yID0+IGVkaXRvci5zZXRUZXh0KCcnLCB7YnlwYXNzUmVhZE9ubHk6IHRydWV9KSk7XG4gICAgY29uc3QgZGlkRmFpbENvbW1lbnQgPSAoKSA9PiByZXBseUhvbGRlci5tYXAoZWRpdG9yID0+IGVkaXRvci5zZXRUZXh0KGJvZHksIHtieXBhc3NSZWFkT25seTogdHJ1ZX0pKTtcblxuICAgIHJldHVybiB0aGlzLnByb3BzLmFkZFNpbmdsZUNvbW1lbnQoXG4gICAgICBib2R5LCB0aHJlYWQuaWQsIGxhc3RDb21tZW50LmlkLCBsYXN0Q29tbWVudC5wYXRoLCBsYXN0Q29tbWVudC5wb3NpdGlvbiwge2RpZFN1Ym1pdENvbW1lbnQsIGRpZEZhaWxDb21tZW50fSxcbiAgICApO1xuICB9XG5cbiAgc3VibWl0Q3VycmVudENvbW1lbnQgPSBldnQgPT4ge1xuICAgIGNvbnN0IHRocmVhZElEID0gZXZ0LmN1cnJlbnRUYXJnZXQuZGF0YXNldC50aHJlYWRJZDtcbiAgICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgKi9cbiAgICBpZiAoIXRocmVhZElEKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBjb25zdCB7dGhyZWFkLCBjb21tZW50c30gPSB0aGlzLnByb3BzLmNvbW1lbnRUaHJlYWRzLmZpbmQoZWFjaCA9PiBlYWNoLnRocmVhZC5pZCA9PT0gdGhyZWFkSUQpO1xuICAgIGNvbnN0IHJlcGx5SG9sZGVyID0gdGhpcy5yZXBseUhvbGRlcnMuZ2V0KHRocmVhZElEKTtcblxuICAgIHJldHVybiB0aGlzLnN1Ym1pdFJlcGx5KHJlcGx5SG9sZGVyLCB0aHJlYWQsIGNvbW1lbnRzW2NvbW1lbnRzLmxlbmd0aCAtIDFdKTtcbiAgfVxuXG4gIGdldFRyYW5zbGF0ZWRQb3NpdGlvbihyb290Q29tbWVudCkge1xuICAgIGxldCBsaW5lTnVtYmVyLCBwb3NpdGlvblRleHQ7XG4gICAgY29uc3QgdHJhbnNsYXRpb25zID0gdGhpcy5wcm9wcy5jb21tZW50VHJhbnNsYXRpb25zO1xuXG4gICAgY29uc3QgaXNDaGVja2VkT3V0UHVsbFJlcXVlc3QgPSB0aGlzLnByb3BzLmNoZWNrb3V0T3Aud2h5KCkgPT09IGNoZWNrb3V0U3RhdGVzLkNVUlJFTlQ7XG4gICAgaWYgKHRyYW5zbGF0aW9ucyA9PT0gbnVsbCkge1xuICAgICAgbGluZU51bWJlciA9IG51bGw7XG4gICAgICBwb3NpdGlvblRleHQgPSAnJztcbiAgICB9IGVsc2UgaWYgKHJvb3RDb21tZW50LnBvc2l0aW9uID09PSBudWxsKSB7XG4gICAgICBsaW5lTnVtYmVyID0gbnVsbDtcbiAgICAgIHBvc2l0aW9uVGV4dCA9ICdvdXRkYXRlZCc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IHRyYW5zbGF0aW9uc0ZvckZpbGUgPSB0cmFuc2xhdGlvbnMuZ2V0KHBhdGgubm9ybWFsaXplKHJvb3RDb21tZW50LnBhdGgpKTtcbiAgICAgIGxpbmVOdW1iZXIgPSB0cmFuc2xhdGlvbnNGb3JGaWxlLmRpZmZUb0ZpbGVQb3NpdGlvbi5nZXQocGFyc2VJbnQocm9vdENvbW1lbnQucG9zaXRpb24sIDEwKSk7XG4gICAgICBpZiAodHJhbnNsYXRpb25zRm9yRmlsZS5maWxlVHJhbnNsYXRpb25zICYmIGlzQ2hlY2tlZE91dFB1bGxSZXF1ZXN0KSB7XG4gICAgICAgIGxpbmVOdW1iZXIgPSB0cmFuc2xhdGlvbnNGb3JGaWxlLmZpbGVUcmFuc2xhdGlvbnMuZ2V0KGxpbmVOdW1iZXIpLm5ld1Bvc2l0aW9uO1xuICAgICAgfVxuICAgICAgcG9zaXRpb25UZXh0ID0gbGluZU51bWJlcjtcbiAgICB9XG5cbiAgICByZXR1cm4ge2xpbmVOdW1iZXIsIHBvc2l0aW9uVGV4dH07XG4gIH1cblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBzY3JvbGxUb1RocmVhZCh0aHJlYWRJRCkge1xuICAgIGNvbnN0IHRocmVhZEhvbGRlciA9IHRoaXMudGhyZWFkSG9sZGVycy5nZXQodGhyZWFkSUQpO1xuICAgIGlmICh0aHJlYWRIb2xkZXIpIHtcbiAgICAgIHRocmVhZEhvbGRlci5tYXAoZWxlbWVudCA9PiB7XG4gICAgICAgIGVsZW1lbnQuc2Nyb2xsSW50b1ZpZXdJZk5lZWRlZCgpO1xuICAgICAgICByZXR1cm4gbnVsbDsgLy8gc2hoLCBlc2xpbnRcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIHJlc29sdmVVbnJlc29sdmVUaHJlYWQodGhyZWFkKSB7XG4gICAgaWYgKHRocmVhZC5pc1Jlc29sdmVkKSB7XG4gICAgICBhd2FpdCB0aGlzLnByb3BzLnVucmVzb2x2ZVRocmVhZCh0aHJlYWQpO1xuICAgIH0gZWxzZSB7XG4gICAgICBhd2FpdCB0aGlzLnByb3BzLnJlc29sdmVUaHJlYWQodGhyZWFkKTtcbiAgICB9XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsSUFBQUEsS0FBQSxHQUFBQyxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUMsTUFBQSxHQUFBQyx1QkFBQSxDQUFBRixPQUFBO0FBQ0EsSUFBQUcsVUFBQSxHQUFBSixzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUksV0FBQSxHQUFBTCxzQkFBQSxDQUFBQyxPQUFBO0FBQ0EsSUFBQUssU0FBQSxHQUFBTCxPQUFBO0FBRUEsSUFBQU0sV0FBQSxHQUFBTixPQUFBO0FBQ0EsSUFBQU8sUUFBQSxHQUFBUixzQkFBQSxD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