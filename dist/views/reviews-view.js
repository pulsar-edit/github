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

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
      } = reviewTypes(review.state); // filter non actionable empty summary comments from this view

      if (review.state === 'PENDING' || review.state === 'COMMENTED' && review.bodyHTML === '') {
        return null;
      }

      const author = review.author || _helpers.GHOST_USER;
      return /*#__PURE__*/_react.default.createElement("div", {
        className: "github-ReviewSummary",
        key: review.id
      }, /*#__PURE__*/_react.default.createElement(_actionableReviewView.default, {
        originalContent: review,
        confirm: this.props.confirm,
        commands: this.props.commands,
        contentUpdater: this.props.updateSummary,
        render: showActionsMenu => {
          return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement("header", {
            className: "github-Review-header"
          }, /*#__PURE__*/_react.default.createElement("div", {
            className: "github-Review-header-authorData"
          }, /*#__PURE__*/_react.default.createElement("span", {
            className: `github-ReviewSummary-icon icon ${icon}`
          }), /*#__PURE__*/_react.default.createElement("img", {
            className: "github-ReviewSummary-avatar",
            src: author.avatarUrl,
            alt: author.login
          }), /*#__PURE__*/_react.default.createElement("a", {
            className: "github-ReviewSummary-username",
            href: author.url
          }, author.login), /*#__PURE__*/_react.default.createElement("span", {
            className: "github-ReviewSummary-type"
          }, copy), this.renderEditedLink(review), this.renderAuthorAssociation(review)), /*#__PURE__*/_react.default.createElement(_timeago.default, {
            className: "github-ReviewSummary-timeAgo",
            time: review.submittedAt,
            displayStyle: "short"
          }), /*#__PURE__*/_react.default.createElement(_octicon.default, {
            icon: "ellipses",
            className: "github-Review-actionsMenu",
            onClick: event => showActionsMenu(event, review, author)
          })), /*#__PURE__*/_react.default.createElement("main", {
            className: "github-ReviewSummary-comment"
          }, /*#__PURE__*/_react.default.createElement(_githubDotcomMarkdown.default, {
            html: review.bodyHTML,
            switchToIssueish: this.props.openIssueish,
            openIssueishLinkInNewTab: this.openIssueishLinkInNewTab
          }), /*#__PURE__*/_react.default.createElement(_emojiReactionsController.default, {
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
      return /*#__PURE__*/_react.default.createElement("details", {
        ref: threadHolder.setter,
        className: (0, _classnames.default)('github-Review', {
          'resolved': thread.isResolved,
          'github-Review--highlight': isHighlighted
        }),
        key: elementId,
        id: elementId,
        open: isOpen
      }, /*#__PURE__*/_react.default.createElement("summary", {
        className: "github-Review-reference",
        onClick: toggle
      }, dir && /*#__PURE__*/_react.default.createElement("span", {
        className: "github-Review-path"
      }, dir), /*#__PURE__*/_react.default.createElement("span", {
        className: "github-Review-file"
      }, dir ? _path.default.sep : '', base), /*#__PURE__*/_react.default.createElement("span", {
        className: "github-Review-lineNr"
      }, positionText), /*#__PURE__*/_react.default.createElement("img", {
        className: "github-Review-referenceAvatar",
        src: author.avatarUrl,
        alt: author.login
      }), /*#__PURE__*/_react.default.createElement(_timeago.default, {
        className: "github-Review-referenceTimeAgo",
        time: rootComment.createdAt,
        displayStyle: "short"
      })), /*#__PURE__*/_react.default.createElement("nav", {
        className: "github-Review-nav"
      }, /*#__PURE__*/_react.default.createElement("button", {
        className: openFileClasses,
        "data-path": nativePath,
        "data-line": lineNumber,
        onClick: this.openFile,
        disabled: this.props.checkoutOp.isEnabled(),
        ref: refJumpToFileButton.setter
      }, "Jump To File"), /*#__PURE__*/_react.default.createElement("button", {
        className: openDiffClasses,
        "data-path": nativePath,
        "data-line": rootComment.position,
        onClick: this.openDiff
      }, "Open Diff"), this.props.checkoutOp.isEnabled() && /*#__PURE__*/_react.default.createElement(_tooltip.default, {
        manager: this.props.tooltips,
        target: refJumpToFileButton,
        title: jumpToFileDisabledLabel,
        showDelay: 200
      })), rootComment.position !== null && /*#__PURE__*/_react.default.createElement(_patchPreviewView.default, {
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
      return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement("main", {
        className: "github-Review-comments"
      }, comments.map(comment => {
        return /*#__PURE__*/_react.default.createElement(_reviewCommentView.default, {
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
      }), /*#__PURE__*/_react.default.createElement("div", {
        className: (0, _classnames.default)('github-Review-reply', {
          'github-Review-reply--disabled': isPosting
        }),
        "data-thread-id": thread.id
      }, /*#__PURE__*/_react.default.createElement(_atomTextEditor.default, {
        placeholderText: "Reply...",
        lineNumberGutterVisible: false,
        softWrapped: true,
        autoHeight: true,
        readOnly: isPosting,
        refModel: replyHolder
      }))), thread.isResolved && /*#__PURE__*/_react.default.createElement("div", {
        className: "github-Review-resolvedText"
      }, "This conversation was marked as resolved by @", thread.resolvedBy.login), /*#__PURE__*/_react.default.createElement("footer", {
        className: "github-Review-footer"
      }, /*#__PURE__*/_react.default.createElement("button", {
        className: "github-Review-replyButton btn btn-primary",
        title: "Add your comment",
        disabled: isPosting,
        onClick: () => this.submitReply(replyHolder, thread, lastComment)
      }, "Comment"), this.renderResolveButton(thread)));
    });

    _defineProperty(this, "renderResolveButton", thread => {
      if (thread.isResolved) {
        return /*#__PURE__*/_react.default.createElement("button", {
          className: "github-Review-resolveButton btn icon icon-check",
          title: "Unresolve conversation",
          onClick: () => this.resolveUnresolveThread(thread)
        }, "Unresolve conversation");
      } else {
        return /*#__PURE__*/_react.default.createElement("button", {
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
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "github-Reviews",
      ref: this.rootHolder.setter
    }, this.renderCommands(), this.renderHeader(), /*#__PURE__*/_react.default.createElement("div", {
      className: "github-Reviews-list"
    }, this.renderReviewSummaries(), this.renderReviewCommentThreads()));
  }

  renderCommands() {
    return /*#__PURE__*/_react.default.createElement(_react.Fragment, null, /*#__PURE__*/_react.default.createElement(_commands.default, {
      registry: this.props.commands,
      target: this.rootHolder
    }, /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:more-context",
      callback: this.props.moreContext
    }), /*#__PURE__*/_react.default.createElement(_commands.Command, {
      command: "github:less-context",
      callback: this.props.lessContext
    })), /*#__PURE__*/_react.default.createElement(_commands.default, {
      registry: this.props.commands,
      target: ".github-Review-reply"
    }, /*#__PURE__*/_react.default.createElement(_commands.Command, {
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

    return /*#__PURE__*/_react.default.createElement("header", {
      className: "github-Reviews-topHeader"
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: "icon icon-comment-discussion"
    }), /*#__PURE__*/_react.default.createElement("span", {
      className: "github-Reviews-headerTitle"
    }, "Reviews for\xA0", /*#__PURE__*/_react.default.createElement("span", {
      className: "github-Reviews-clickable",
      onClick: this.props.openPR
    }, this.props.owner, "/", this.props.repo, "#", this.props.number)), /*#__PURE__*/_react.default.createElement("button", {
      className: (0, _classnames.default)('github-Reviews-headerButton github-Reviews-clickable icon icon-repo-sync', {
        refreshing: this.state.isRefreshing
      }),
      onClick: refresh
    }), /*#__PURE__*/_react.default.createElement(_checkoutButton.default, {
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
    } = this.props; // todo: make this open the review flow in Atom instead of dotcom

    const pullRequestURL = `https://www.github.com/${owner}/${repo}/pull/${number}/files/`;
    return /*#__PURE__*/_react.default.createElement("div", {
      className: "github-Reviews-emptyState"
    }, /*#__PURE__*/_react.default.createElement("img", {
      src: "atom://github/img/mona.svg",
      alt: "Mona the octocat in spaaaccee",
      className: "github-Reviews-emptyImg"
    }), /*#__PURE__*/_react.default.createElement("div", {
      className: "github-Reviews-emptyText"
    }, "This pull request has no reviews"), /*#__PURE__*/_react.default.createElement("button", {
      className: "github-Reviews-emptyCallToActionButton btn"
    }, /*#__PURE__*/_react.default.createElement("a", {
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

    return /*#__PURE__*/_react.default.createElement("details", {
      className: "github-Reviews-section summaries",
      open: this.props.summarySectionOpen
    }, /*#__PURE__*/_react.default.createElement("summary", {
      className: "github-Reviews-header",
      onClick: toggle
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: "github-Reviews-title"
    }, "Summaries")), /*#__PURE__*/_react.default.createElement("main", {
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

    return /*#__PURE__*/_react.default.createElement("details", {
      className: "github-Reviews-section comments",
      open: this.props.commentSectionOpen
    }, /*#__PURE__*/_react.default.createElement("summary", {
      className: "github-Reviews-header",
      onClick: toggleComments
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: "github-Reviews-title"
    }, "Comments"), /*#__PURE__*/_react.default.createElement("span", {
      className: "github-Reviews-progress"
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: "github-Reviews-count"
    }, "Resolved", ' ', /*#__PURE__*/_react.default.createElement("span", {
      className: "github-Reviews-countNr"
    }, resolvedThreads.length), ' ', "of", ' ', /*#__PURE__*/_react.default.createElement("span", {
      className: "github-Reviews-countNr"
    }, resolvedThreads.length + unresolvedThreads.length)), /*#__PURE__*/_react.default.createElement("progress", {
      className: "github-Reviews-progessBar",
      value: resolvedThreads.length,
      max: resolvedThreads.length + unresolvedThreads.length
    }))), unresolvedThreads.length > 0 && /*#__PURE__*/_react.default.createElement("main", {
      className: "github-Reviews-container"
    }, unresolvedThreads.map(this.renderReviewCommentThread)), resolvedThreads.length > 0 && /*#__PURE__*/_react.default.createElement("details", {
      className: "github-Reviews-section resolved-comments",
      open: true
    }, /*#__PURE__*/_react.default.createElement("summary", {
      className: "github-Reviews-header"
    }, /*#__PURE__*/_react.default.createElement("span", {
      className: "github-Reviews-title"
    }, "Resolved")), /*#__PURE__*/_react.default.createElement("main", {
      className: "github-Reviews-container"
    }, resolvedThreads.map(this.renderReviewCommentThread))));
  }

  renderEditedLink(entity) {
    if (!entity.lastEditedAt) {
      return null;
    } else {
      return /*#__PURE__*/_react.default.createElement("span", {
        className: "github-Review-edited"
      }, "\xA0\u2022\xA0", /*#__PURE__*/_react.default.createElement("a", {
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

    return /*#__PURE__*/_react.default.createElement("span", {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9yZXZpZXdzLXZpZXcuanMiXSwibmFtZXMiOlsiYXV0aG9yQXNzb2NpYXRpb25UZXh0IiwiTUVNQkVSIiwiT1dORVIiLCJDT0xMQUJPUkFUT1IiLCJDT05UUklCVVRPUiIsIkZJUlNUX1RJTUVfQ09OVFJJQlVUT1IiLCJGSVJTVF9USU1FUiIsIk5PTkUiLCJSZXZpZXdzVmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsInBhY2thZ2UiLCJjb21wb25lbnQiLCJuYW1lIiwicmV2aWV3IiwicmV2aWV3VHlwZXMiLCJ0eXBlIiwiQVBQUk9WRUQiLCJpY29uIiwiY29weSIsIkNPTU1FTlRFRCIsIkNIQU5HRVNfUkVRVUVTVEVEIiwic3RhdGUiLCJib2R5SFRNTCIsImF1dGhvciIsIkdIT1NUX1VTRVIiLCJpZCIsImNvbmZpcm0iLCJjb21tYW5kcyIsInVwZGF0ZVN1bW1hcnkiLCJzaG93QWN0aW9uc01lbnUiLCJhdmF0YXJVcmwiLCJsb2dpbiIsInVybCIsInJlbmRlckVkaXRlZExpbmsiLCJyZW5kZXJBdXRob3JBc3NvY2lhdGlvbiIsInN1Ym1pdHRlZEF0IiwiZXZlbnQiLCJvcGVuSXNzdWVpc2giLCJvcGVuSXNzdWVpc2hMaW5rSW5OZXdUYWIiLCJ0b29sdGlwcyIsInJlcG9ydFJlbGF5RXJyb3IiLCJjb21tZW50VGhyZWFkIiwiY29tbWVudHMiLCJ0aHJlYWQiLCJyb290Q29tbWVudCIsInRocmVhZEhvbGRlciIsInRocmVhZEhvbGRlcnMiLCJnZXQiLCJSZWZIb2xkZXIiLCJzZXQiLCJuYXRpdmVQYXRoIiwicGF0aCIsImRpciIsImJhc2UiLCJwYXJzZSIsImxpbmVOdW1iZXIiLCJwb3NpdGlvblRleHQiLCJnZXRUcmFuc2xhdGVkUG9zaXRpb24iLCJyZWZKdW1wVG9GaWxlQnV0dG9uIiwianVtcFRvRmlsZURpc2FibGVkTGFiZWwiLCJlbGVtZW50SWQiLCJuYXZCdXR0b25DbGFzc2VzIiwib3V0ZGF0ZWQiLCJvcGVuRmlsZUNsYXNzZXMiLCJvcGVuRGlmZkNsYXNzZXMiLCJpc09wZW4iLCJ0aHJlYWRJRHNPcGVuIiwiaGFzIiwiaXNIaWdobGlnaHRlZCIsImhpZ2hsaWdodGVkVGhyZWFkSURzIiwidG9nZ2xlIiwiZXZ0IiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJoaWRlVGhyZWFkSUQiLCJzaG93VGhyZWFkSUQiLCJzZXR0ZXIiLCJpc1Jlc29sdmVkIiwic2VwIiwiY3JlYXRlZEF0Iiwib3BlbkZpbGUiLCJjaGVja291dE9wIiwiaXNFbmFibGVkIiwicG9zaXRpb24iLCJvcGVuRGlmZiIsIm11bHRpRmlsZVBhdGNoIiwiY29udGV4dExpbmVzIiwiY29uZmlnIiwicmVuZGVyVGhyZWFkIiwicmVwbHlIb2xkZXIiLCJyZXBseUhvbGRlcnMiLCJsYXN0Q29tbWVudCIsImxlbmd0aCIsImlzUG9zdGluZyIsInBvc3RpbmdUb1RocmVhZElEIiwibWFwIiwiY29tbWVudCIsInVwZGF0ZUNvbW1lbnQiLCJyZXNvbHZlZEJ5Iiwic3VibWl0UmVwbHkiLCJyZW5kZXJSZXNvbHZlQnV0dG9uIiwicmVzb2x2ZVVucmVzb2x2ZVRocmVhZCIsInRhcmdldCIsImN1cnJlbnRUYXJnZXQiLCJkYXRhc2V0IiwibGluZSIsInBhcnNlSW50IiwicmVwb093bmVyIiwicmVwb05hbWUiLCJpc3N1ZWlzaE51bWJlciIsInRocmVhZElEIiwidGhyZWFkSWQiLCJjb21tZW50VGhyZWFkcyIsImZpbmQiLCJlYWNoIiwicm9vdEhvbGRlciIsIk1hcCIsImlzUmVmcmVzaGluZyIsInN1YnMiLCJDb21wb3NpdGVEaXNwb3NhYmxlIiwiY29tcG9uZW50RGlkTW91bnQiLCJzY3JvbGxUb1RocmVhZElEIiwic2Nyb2xsVG9UaHJlYWQiLCJjb21wb25lbnREaWRVcGRhdGUiLCJwcmV2UHJvcHMiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsImRpc3Bvc2UiLCJyZW5kZXIiLCJyZW5kZXJDb21tYW5kcyIsInJlbmRlckhlYWRlciIsInJlbmRlclJldmlld1N1bW1hcmllcyIsInJlbmRlclJldmlld0NvbW1lbnRUaHJlYWRzIiwibW9yZUNvbnRleHQiLCJsZXNzQ29udGV4dCIsInN1Ym1pdEN1cnJlbnRDb21tZW50IiwicmVmcmVzaCIsInNldFN0YXRlIiwic3ViIiwicmVmZXRjaCIsInJlbW92ZSIsImFkZCIsIm9wZW5QUiIsIm93bmVyIiwicmVwbyIsIm51bWJlciIsInJlZnJlc2hpbmciLCJyZW5kZXJFbXB0eVN0YXRlIiwicHVsbFJlcXVlc3RVUkwiLCJsb2dTdGFydFJldmlld0NsaWNrIiwic3VtbWFyaWVzIiwic3VtbWFyeVNlY3Rpb25PcGVuIiwiaGlkZVN1bW1hcmllcyIsInNob3dTdW1tYXJpZXMiLCJyZW5kZXJSZXZpZXdTdW1tYXJ5IiwicmVzb2x2ZWRUaHJlYWRzIiwiZmlsdGVyIiwicGFpciIsInVucmVzb2x2ZWRUaHJlYWRzIiwidG9nZ2xlQ29tbWVudHMiLCJjb21tZW50U2VjdGlvbk9wZW4iLCJoaWRlQ29tbWVudHMiLCJzaG93Q29tbWVudHMiLCJyZW5kZXJSZXZpZXdDb21tZW50VGhyZWFkIiwiZW50aXR5IiwibGFzdEVkaXRlZEF0IiwidGV4dCIsImF1dGhvckFzc29jaWF0aW9uIiwiYm9keSIsImVkaXRvciIsImdldFRleHQiLCJnZXRPciIsImRpZFN1Ym1pdENvbW1lbnQiLCJzZXRUZXh0IiwiYnlwYXNzUmVhZE9ubHkiLCJkaWRGYWlsQ29tbWVudCIsImFkZFNpbmdsZUNvbW1lbnQiLCJ0cmFuc2xhdGlvbnMiLCJjb21tZW50VHJhbnNsYXRpb25zIiwiaXNDaGVja2VkT3V0UHVsbFJlcXVlc3QiLCJ3aHkiLCJjaGVja291dFN0YXRlcyIsIkNVUlJFTlQiLCJ0cmFuc2xhdGlvbnNGb3JGaWxlIiwibm9ybWFsaXplIiwiZGlmZlRvRmlsZVBvc2l0aW9uIiwiZmlsZVRyYW5zbGF0aW9ucyIsIm5ld1Bvc2l0aW9uIiwiZWxlbWVudCIsInNjcm9sbEludG9WaWV3SWZOZWVkZWQiLCJ1bnJlc29sdmVUaHJlYWQiLCJyZXNvbHZlVGhyZWFkIiwicmVsYXkiLCJQcm9wVHlwZXMiLCJzaGFwZSIsImVudmlyb25tZW50Iiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsInJlcG9zaXRvcnkiLCJwdWxsUmVxdWVzdCIsImFycmF5IiwiYXJyYXlPZiIsImZ1bmMiLCJFbmFibGVhYmxlT3BlcmF0aW9uUHJvcFR5cGUiLCJib29sIiwic3RyaW5nIiwid29ya2RpciIsIndvcmtzcGFjZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBRUEsTUFBTUEscUJBQXFCLEdBQUc7QUFDNUJDLEVBQUFBLE1BQU0sRUFBRSxRQURvQjtBQUU1QkMsRUFBQUEsS0FBSyxFQUFFLE9BRnFCO0FBRzVCQyxFQUFBQSxZQUFZLEVBQUUsY0FIYztBQUk1QkMsRUFBQUEsV0FBVyxFQUFFLGFBSmU7QUFLNUJDLEVBQUFBLHNCQUFzQixFQUFFLHdCQUxJO0FBTTVCQyxFQUFBQSxXQUFXLEVBQUUsYUFOZTtBQU81QkMsRUFBQUEsSUFBSSxFQUFFO0FBUHNCLENBQTlCOztBQVVlLE1BQU1DLFdBQU4sU0FBMEJDLGVBQU1DLFNBQWhDLENBQTBDO0FBdUV2REMsRUFBQUEsV0FBVyxDQUFDQyxLQUFELEVBQVE7QUFDakIsVUFBTUEsS0FBTjs7QUFEaUIsaURBOEZHLE1BQU07QUFDMUIsbUNBQVMsaUJBQVQsRUFBNEI7QUFBQ0MsUUFBQUEsT0FBTyxFQUFFLFFBQVY7QUFBb0JDLFFBQUFBLFNBQVMsRUFBRSxLQUFLSCxXQUFMLENBQWlCSTtBQUFoRCxPQUE1QjtBQUNELEtBaEdrQjs7QUFBQSxpREFtSkdDLE1BQU0sSUFBSTtBQUM5QixZQUFNQyxXQUFXLEdBQUdDLElBQUksSUFBSTtBQUMxQixlQUFP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ZUFBZSxFQUFFRyxtQkFBVVMsSUFBVixDQUFlTCxVQS9EZjtBQWdFakJyQixFQUFBQSxnQkFBZ0IsRUFBRWlCLG1CQUFVUyxJQUFWLENBQWVMLFVBaEVoQjtBQWlFakJuRyxFQUFBQSxhQUFhLEVBQUUrRixtQkFBVVMsSUFBVixDQUFlTCxVQWpFYjtBQWtFakJ4SyxFQUFBQSxhQUFhLEVBQUVvSyxtQkFBVVMsSUFBVixDQUFlTCxVQWxFYjtBQW1FakI1SixFQUFBQSxnQkFBZ0IsRUFBRXdKLG1CQUFVUyxJQUFWLENBQWVMO0FBbkVoQixDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgUmVhY3QsIHtGcmFnbWVudH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IFByb3BUeXBlcyBmcm9tICdwcm9wLXR5cGVzJztcbmltcG9ydCBjeCBmcm9tICdjbGFzc25hbWVzJztcbmltcG9ydCB7Q29tcG9zaXRlRGlzcG9zYWJsZX0gZnJvbSAnZXZlbnQta2l0JztcblxuaW1wb3J0IHtFbmFibGVhYmxlT3BlcmF0aW9uUHJvcFR5cGV9IGZyb20gJy4uL3Byb3AtdHlwZXMnO1xuaW1wb3J0IFRvb2x0aXAgZnJvbSAnLi4vYXRvbS90b29sdGlwJztcbmltcG9ydCBDb21tYW5kcywge0NvbW1hbmR9IGZyb20gJy4uL2F0b20vY29tbWFuZHMnO1xuaW1wb3J0IEF0b21UZXh0RWRpdG9yIGZyb20gJy4uL2F0b20vYXRvbS10ZXh0LWVkaXRvcic7XG5pbXBvcnQge2dldERhdGFGcm9tR2l0aHViVXJsfSBmcm9tICcuL2lzc3VlaXNoLWxpbmsnO1xuaW1wb3J0IEVtb2ppUmVhY3Rpb25zQ29udHJvbGxlciBmcm9tICcuLi9jb250cm9sbGVycy9lbW9qaS1yZWFjdGlvbnMtY29udHJvbGxlcic7XG5pbXBvcnQge2NoZWNrb3V0U3RhdGVzfSBmcm9tICcuLi9jb250cm9sbGVycy9wci1jaGVja291dC1jb250cm9sbGVyJztcbmltcG9ydCBHaXRodWJEb3Rjb21NYXJrZG93biBmcm9tICcuL2dpdGh1Yi1kb3Rjb20tbWFya2Rvd24nO1xuaW1wb3J0IFBhdGNoUHJldmlld1ZpZXcgZnJvbSAnLi9wYXRjaC1wcmV2aWV3LXZpZXcnO1xuaW1wb3J0IFJldmlld0NvbW1lbnRWaWV3IGZyb20gJy4vcmV2aWV3LWNvbW1lbnQtdmlldyc7XG5pbXBvcnQgQWN0aW9uYWJsZVJldmlld1ZpZXcgZnJvbSAnLi9hY3Rpb25hYmxlLXJldmlldy12aWV3JztcbmltcG9ydCBDaGVja291dEJ1dHRvbiBmcm9tICcuL2NoZWNrb3V0LWJ1dHRvbic7XG5pbXBvcnQgT2N0aWNvbiBmcm9tICcuLi9hdG9tL29jdGljb24nO1xuaW1wb3J0IFRpbWVhZ28gZnJvbSAnLi90aW1lYWdvJztcbmltcG9ydCBSZWZIb2xkZXIgZnJvbSAnLi4vbW9kZWxzL3JlZi1ob2xkZXInO1xuaW1wb3J0IHt0b05hdGl2ZVBhdGhTZXAsIEdIT1NUX1VTRVJ9IGZyb20gJy4uL2hlbHBlcnMnO1xuaW1wb3J0IHthZGRFdmVudH0gZnJvbSAnLi4vcmVwb3J0ZXItcHJveHknO1xuXG5jb25zdCBhdXRob3JBc3NvY2lhdGlvblRleHQgPSB7XG4gIE1FTUJFUjogJ01lbWJlcicsXG4gIE9XTkVSOiAnT3duZXInLFxuICBDT0xMQUJPUkFUT1I6ICdDb2xsYWJvcmF0b3InLFxuICBDT05UUklCVVRPUjogJ0NvbnRyaWJ1dG9yJyxcbiAgRklSU1RfVElNRV9DT05UUklCVVRPUjogJ0ZpcnN0LXRpbWUgY29udHJpYnV0b3InLFxuICBGSVJTVF9USU1FUjogJ0ZpcnN0LXRpbWVyJyxcbiAgTk9ORTogbnVsbCxcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJldmlld3NWaWV3IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbiAgc3RhdGljIHByb3BUeXBlcyA9IHtcbiAgICAvLyBSZWxheSByZXN1bHRzXG4gICAgcmVsYXk6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBlbnZpcm9ubWVudDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIH0pLmlzUmVxdWlyZWQsXG4gICAgcmVwb3NpdG9yeTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIHB1bGxSZXF1ZXN0OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgc3VtbWFyaWVzOiBQcm9wVHlwZXMuYXJyYXkuaXNSZXF1aXJlZCxcbiAgICBjb21tZW50VGhyZWFkczogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIHRocmVhZDogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgICAgY29tbWVudHM6IFByb3BUeXBlcy5hcnJheU9mKFByb3BUeXBlcy5vYmplY3QpLmlzUmVxdWlyZWQsXG4gICAgfSkpLFxuICAgIHJlZmV0Y2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBQYWNrYWdlIG1vZGVsc1xuICAgIG11bHRpRmlsZVBhdGNoOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29udGV4dExpbmVzOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgY2hlY2tvdXRPcDogRW5hYmxlYWJsZU9wZXJhdGlvblByb3BUeXBlLmlzUmVxdWlyZWQsXG4gICAgc3VtbWFyeVNlY3Rpb25PcGVuOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIGNvbW1lbnRTZWN0aW9uT3BlbjogUHJvcFR5cGVzLmJvb2wuaXNSZXF1aXJlZCxcbiAgICB0aHJlYWRJRHNPcGVuOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgaGFzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIH0pLFxuICAgIGhpZ2hsaWdodGVkVGhyZWFkSURzOiBQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgaGFzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIH0pLFxuICAgIHBvc3RpbmdUb1RocmVhZElEOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgIHNjcm9sbFRvVGhyZWFkSUQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgLy8gU3RydWN0dXJlOiBNYXA8IHJlbGF0aXZlUGF0aDogU3RyaW5nLCB7XG4gICAgLy8gICByYXdQb3NpdGlvbnM6IFNldDxsaW5lTnVtYmVyczogTnVtYmVyPixcbiAgICAvLyAgIGRpZmZUb0ZpbGVQb3NpdGlvbjogTWFwPHJhd1Bvc2l0aW9uOiBOdW1iZXIsIGFkanVzdGVkUG9zaXRpb246IE51bWJlcj4sXG4gICAgLy8gICBmaWxlVHJhbnNsYXRpb25zOiBudWxsIHwgTWFwPGFkanVzdGVkUG9zaXRpb246IE51bWJlciwge25ld1Bvc2l0aW9uOiBOdW1iZXJ9PixcbiAgICAvLyAgIGRpZ2VzdDogU3RyaW5nLFxuICAgIC8vIH0+XG4gICAgY29tbWVudFRyYW5zbGF0aW9uczogUHJvcFR5cGVzLm9iamVjdCxcblxuICAgIC8vIGZvciB0aGUgZG90Y29tIGxpbmsgaW4gdGhlIGVtcHR5IHN0YXRlXG4gICAgbnVtYmVyOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgcmVwbzogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuICAgIG93bmVyOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgd29ya2RpcjogUHJvcFR5cGVzLnN0cmluZy5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQXRvbSBlbnZpcm9ubWVudFxuICAgIHdvcmtzcGFjZTogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpZzogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbW1hbmRzOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgdG9vbHRpcHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb25maXJtOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuXG4gICAgLy8gQWN0aW9uIG1ldGhvZHNcbiAgICBvcGVuRmlsZTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvcGVuRGlmZjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvcGVuUFI6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgbW9yZUNvbnRleHQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgbGVzc0NvbnRleHQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgb3Blbklzc3VlaXNoOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHNob3dTdW1tYXJpZXM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgaGlkZVN1bW1hcmllczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBzaG93Q29tbWVudHM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgaGlkZUNvbW1lbnRzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHNob3dUaHJlYWRJRDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBoaWRlVGhyZWFkSUQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgcmVzb2x2ZVRocmVhZDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB1bnJlc29sdmVUaHJlYWQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgYWRkU2luZ2xlQ29tbWVudDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICB1cGRhdGVDb21tZW50OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHVwZGF0ZVN1bW1hcnk6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgcmVwb3J0UmVsYXlFcnJvcjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgc3VwZXIocHJvcHMpO1xuXG4gICAgdGhpcy5yb290SG9sZGVyID0gbmV3IFJlZkhvbGRlcigpO1xuICAgIHRoaXMucmVwbHlIb2xkZXJzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMudGhyZWFkSG9sZGVycyA9IG5ldyBNYXAoKTtcbiAgICB0aGlzLnN0YXRlID0ge1xuICAgICAgaXNSZWZyZXNoaW5nOiBmYWxzZSxcbiAgICB9O1xuICAgIHRoaXMuc3VicyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gIH1cblxuICBjb21wb25lbnREaWRNb3VudCgpIHtcbiAgICBjb25zdCB7c2Nyb2xsVG9UaHJlYWRJRH0gPSB0aGlzLnByb3BzO1xuICAgIGlmIChzY3JvbGxUb1RocmVhZElEKSB7XG4gICAgICB0aGlzLnNjcm9sbFRvVGhyZWFkKHNjcm9sbFRvVGhyZWFkSUQpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudERpZFVwZGF0ZShwcmV2UHJvcHMpIHtcbiAgICBjb25zdCB7c2Nyb2xsVG9UaHJlYWRJRH0gPSB0aGlzLnByb3BzO1xuICAgIGlmIChzY3JvbGxUb1RocmVhZElEICYmIHNjcm9sbFRvVGhyZWFkSUQgIT09IHByZXZQcm9wcy5zY3JvbGxUb1RocmVhZElEKSB7XG4gICAgICB0aGlzLnNjcm9sbFRvVGhyZWFkKHNjcm9sbFRvVGhyZWFkSUQpO1xuICAgIH1cbiAgfVxuXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50KCkge1xuICAgIHRoaXMuc3Vicy5kaXNwb3NlKCk7XG4gIH1cblxuICByZW5kZXIoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3NcIiByZWY9e3RoaXMucm9vdEhvbGRlci5zZXR0ZXJ9PlxuICAgICAgICB7dGhpcy5yZW5kZXJDb21tYW5kcygpfVxuICAgICAgICB7dGhpcy5yZW5kZXJIZWFkZXIoKX1cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1saXN0XCI+XG4gICAgICAgICAge3RoaXMucmVuZGVyUmV2aWV3U3VtbWFyaWVzKCl9XG4gICAgICAgICAge3RoaXMucmVuZGVyUmV2aWV3Q29tbWVudFRocmVhZHMoKX1cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyQ29tbWFuZHMoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgPENvbW1hbmRzIHJlZ2lzdHJ5PXt0aGlzLnByb3BzLmNvbW1hbmRzfSB0YXJnZXQ9e3RoaXMucm9vdEhvbGRlcn0+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1Yjptb3JlLWNvbnRleHRcIiBjYWxsYmFjaz17dGhpcy5wcm9wcy5tb3JlQ29udGV4dH0gLz5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOmxlc3MtY29udGV4dFwiIGNhbGxiYWNrPXt0aGlzLnByb3BzLmxlc3NDb250ZXh0fSAvPlxuICAgICAgICA8L0NvbW1hbmRzPlxuICAgICAgICA8Q29tbWFuZHMgcmVnaXN0cnk9e3RoaXMucHJvcHMuY29tbWFuZHN9IHRhcmdldD1cIi5naXRodWItUmV2aWV3LXJlcGx5XCI+XG4gICAgICAgICAgPENvbW1hbmQgY29tbWFuZD1cImdpdGh1YjpzdWJtaXQtY29tbWVudFwiIGNhbGxiYWNrPXt0aGlzLnN1Ym1pdEN1cnJlbnRDb21tZW50fSAvPlxuICAgICAgICA8L0NvbW1hbmRzPlxuICAgICAgPC9GcmFnbWVudD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVySGVhZGVyKCkge1xuICAgIGNvbnN0IHJlZnJlc2ggPSAoKSA9PiB7XG4gICAgICBpZiAodGhpcy5zdGF0ZS5pc1JlZnJlc2hpbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5zZXRTdGF0ZSh7aXNSZWZyZXNoaW5nOiB0cnVlfSk7XG4gICAgICBjb25zdCBzdWIgPSB0aGlzLnByb3BzLnJlZmV0Y2goKCkgPT4ge1xuICAgICAgICB0aGlzLnN1YnMucmVtb3ZlKHN1Yik7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2lzUmVmcmVzaGluZzogZmFsc2V9KTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5zdWJzLmFkZChzdWIpO1xuICAgIH07XG4gICAgcmV0dXJuIChcbiAgICAgIDxoZWFkZXIgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtdG9wSGVhZGVyXCI+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImljb24gaWNvbi1jb21tZW50LWRpc2N1c3Npb25cIiAvPlxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1oZWFkZXJUaXRsZVwiPlxuICAgICAgICAgIFJldmlld3MgZm9yJm5ic3A7XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtY2xpY2thYmxlXCIgb25DbGljaz17dGhpcy5wcm9wcy5vcGVuUFJ9PlxuICAgICAgICAgICAge3RoaXMucHJvcHMub3duZXJ9L3t0aGlzLnByb3BzLnJlcG99I3t0aGlzLnByb3BzLm51bWJlcn1cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGNsYXNzTmFtZT17Y3goXG4gICAgICAgICAgICAnZ2l0aHViLVJldmlld3MtaGVhZGVyQnV0dG9uIGdpdGh1Yi1SZXZpZXdzLWNsaWNrYWJsZSBpY29uIGljb24tcmVwby1zeW5jJyxcbiAgICAgICAgICAgIHtyZWZyZXNoaW5nOiB0aGlzLnN0YXRlLmlzUmVmcmVzaGluZ30sXG4gICAgICAgICAgKX1cbiAgICAgICAgICBvbkNsaWNrPXtyZWZyZXNofVxuICAgICAgICAvPlxuICAgICAgICA8Q2hlY2tvdXRCdXR0b25cbiAgICAgICAgICBjaGVja291dE9wPXt0aGlzLnByb3BzLmNoZWNrb3V0T3B9XG4gICAgICAgICAgY2xhc3NOYW1lUHJlZml4PVwiZ2l0aHViLVJldmlld3MtY2hlY2tvdXRCdXR0b24tLVwiXG4gICAgICAgICAgY2xhc3NOYW1lcz17WydnaXRodWItUmV2aWV3cy1oZWFkZXJCdXR0b24nXX1cbiAgICAgICAgLz5cbiAgICAgIDwvaGVhZGVyPlxuICAgICk7XG4gIH1cblxuICBsb2dTdGFydFJldmlld0NsaWNrID0gKCkgPT4ge1xuICAgIGFkZEV2ZW50KCdzdGFydC1wci1yZXZpZXcnLCB7cGFja2FnZTogJ2dpdGh1YicsIGNvbXBvbmVudDogdGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSk7XG4gIH1cblxuICByZW5kZXJFbXB0eVN0YXRlKCkge1xuICAgIGNvbnN0IHtudW1iZXIsIHJlcG8sIG93bmVyfSA9IHRoaXMucHJvcHM7XG4gICAgLy8gdG9kbzogbWFrZSB0aGlzIG9wZW4gdGhlIHJldmlldyBmbG93IGluIEF0b20gaW5zdGVhZCBvZiBkb3Rjb21cbiAgICBjb25zdCBwdWxsUmVxdWVzdFVSTCA9IGBodHRwczovL3d3dy5naXRodWIuY29tLyR7b3duZXJ9LyR7cmVwb30vcHVsbC8ke251bWJlcn0vZmlsZXMvYDtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1lbXB0eVN0YXRlXCI+XG4gICAgICAgIDxpbWcgc3JjPVwiYXRvbTovL2dpdGh1Yi9pbWcvbW9uYS5zdmdcIiBhbHQ9XCJNb25hIHRoZSBvY3RvY2F0IGluIHNwYWFhY2NlZVwiIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLWVtcHR5SW1nXCIgLz5cbiAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1lbXB0eVRleHRcIj5cbiAgICAgICAgICBUaGlzIHB1bGwgcmVxdWVzdCBoYXMgbm8gcmV2aWV3c1xuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGJ1dHRvbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1lbXB0eUNhbGxUb0FjdGlvbkJ1dHRvbiBidG5cIj5cbiAgICAgICAgICA8YSBocmVmPXtwdWxsUmVxdWVzdFVSTH0gb25DbGljaz17dGhpcy5sb2dTdGFydFJldmlld0NsaWNrfT5cbiAgICAgICAgICAgIFN0YXJ0IGEgbmV3IHJldmlld1xuICAgICAgICAgIDwvYT5cbiAgICAgICAgPC9idXR0b24+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyUmV2aWV3U3VtbWFyaWVzKCkge1xuICAgIGlmICh0aGlzLnByb3BzLnN1bW1hcmllcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiB0aGlzLnJlbmRlckVtcHR5U3RhdGUoKTtcbiAgICB9XG5cbiAgICBjb25zdCB0b2dnbGUgPSBldnQgPT4ge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAodGhpcy5wcm9wcy5zdW1tYXJ5U2VjdGlvbk9wZW4pIHtcbiAgICAgICAgdGhpcy5wcm9wcy5oaWRlU3VtbWFyaWVzKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnByb3BzLnNob3dTdW1tYXJpZXMoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkZXRhaWxzXG4gICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLXNlY3Rpb24gc3VtbWFyaWVzXCJcbiAgICAgICAgb3Blbj17dGhpcy5wcm9wcy5zdW1tYXJ5U2VjdGlvbk9wZW59PlxuXG4gICAgICAgIDxzdW1tYXJ5IGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLWhlYWRlclwiIG9uQ2xpY2s9e3RvZ2dsZX0+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtdGl0bGVcIj5TdW1tYXJpZXM8L3NwYW4+XG4gICAgICAgIDwvc3VtbWFyeT5cbiAgICAgICAgPG1haW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtY29udGFpbmVyXCI+XG4gICAgICAgICAge3RoaXMucHJvcHMuc3VtbWFyaWVzLm1hcCh0aGlzLnJlbmRlclJldmlld1N1bW1hcnkpfVxuICAgICAgICA8L21haW4+XG5cbiAgICAgIDwvZGV0YWlscz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyUmV2aWV3U3VtbWFyeSA9IHJldmlldyA9PiB7XG4gICAgY29uc3QgcmV2aWV3VHlwZXMgPSB0eXBlID0+IHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIEFQUFJPVkVEOiB7aWNvbjogJ2ljb24tY2hlY2snLCBjb3B5OiAnYXBwcm92ZWQgdGhlc2UgY2hhbmdlcyd9LFxuICAgICAgICBDT01NRU5URUQ6IHtpY29uOiAnaWNvbi1jb21tZW50JywgY29weTogJ2NvbW1lbnRlZCd9LFxuICAgICAgICBDSEFOR0VTX1JFUVVFU1RFRDoge2ljb246ICdpY29uLWFsZXJ0JywgY29weTogJ3JlcXVlc3RlZCBjaGFuZ2VzJ30sXG4gICAgICB9W3R5cGVdIHx8IHtpY29uOiAnJywgY29weTogJyd9O1xuICAgIH07XG5cbiAgICBjb25zdCB7aWNvbiwgY29weX0gPSByZXZpZXdUeXBlcyhyZXZpZXcuc3RhdGUpO1xuXG4gICAgLy8gZmlsdGVyIG5vbiBhY3Rpb25hYmxlIGVtcHR5IHN1bW1hcnkgY29tbWVudHMgZnJvbSB0aGlzIHZpZXdcbiAgICBpZiAocmV2aWV3LnN0YXRlID09PSAnUEVORElORycgfHwgKHJldmlldy5zdGF0ZSA9PT0gJ0NPTU1FTlRFRCcgJiYgcmV2aWV3LmJvZHlIVE1MID09PSAnJykpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IGF1dGhvciA9IHJldmlldy5hdXRob3IgfHwgR0hPU1RfVVNFUjtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdTdW1tYXJ5XCIga2V5PXtyZXZpZXcuaWR9PlxuICAgICAgICA8QWN0aW9uYWJsZVJldmlld1ZpZXdcbiAgICAgICAgICBvcmlnaW5hbENvbnRlbnQ9e3Jldmlld31cbiAgICAgICAgICBjb25maXJtPXt0aGlzLnByb3BzLmNvbmZpcm19XG4gICAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgICAgY29udGVudFVwZGF0ZXI9e3RoaXMucHJvcHMudXBkYXRlU3VtbWFyeX1cbiAgICAgICAgICByZW5kZXI9e3Nob3dBY3Rpb25zTWVudSA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8RnJhZ21lbnQ+XG4gICAgICAgICAgICAgICAgPGhlYWRlciBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LWhlYWRlclwiPlxuICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LWhlYWRlci1hdXRob3JEYXRhXCI+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT17YGdpdGh1Yi1SZXZpZXdTdW1tYXJ5LWljb24gaWNvbiAke2ljb259YH0gLz5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3U3VtbWFyeS1hdmF0YXJcIlxuICAgICAgICAgICAgICAgICAgICAgIHNyYz17YXV0aG9yLmF2YXRhclVybH0gYWx0PXthdXRob3IubG9naW59XG4gICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgIDxhIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdTdW1tYXJ5LXVzZXJuYW1lXCIgaHJlZj17YXV0aG9yLnVybH0+e2F1dGhvci5sb2dpbn08L2E+XG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdTdW1tYXJ5LXR5cGVcIj57Y29weX08L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLnJlbmRlckVkaXRlZExpbmsocmV2aWV3KX1cbiAgICAgICAgICAgICAgICAgICAge3RoaXMucmVuZGVyQXV0aG9yQXNzb2NpYXRpb24ocmV2aWV3KX1cbiAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgICAgPFRpbWVhZ28gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld1N1bW1hcnktdGltZUFnb1wiIHRpbWU9e3Jldmlldy5zdWJtaXR0ZWRBdH0gZGlzcGxheVN0eWxlPVwic2hvcnRcIiAvPlxuICAgICAgICAgICAgICAgICAgPE9jdGljb25cbiAgICAgICAgICAgICAgICAgICAgaWNvbj1cImVsbGlwc2VzXCJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1hY3Rpb25zTWVudVwiXG4gICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2V2ZW50ID0+IHNob3dBY3Rpb25zTWVudShldmVudCwgcmV2aWV3LCBhdXRob3IpfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L2hlYWRlcj5cbiAgICAgICAgICAgICAgICA8bWFpbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3U3VtbWFyeS1jb21tZW50XCI+XG4gICAgICAgICAgICAgICAgICA8R2l0aHViRG90Y29tTWFya2Rvd25cbiAgICAgICAgICAgICAgICAgICAgaHRtbD17cmV2aWV3LmJvZHlIVE1MfVxuICAgICAgICAgICAgICAgICAgICBzd2l0Y2hUb0lzc3VlaXNoPXt0aGlzLnByb3BzLm9wZW5Jc3N1ZWlzaH1cbiAgICAgICAgICAgICAgICAgICAgb3Blbklzc3VlaXNoTGlua0luTmV3VGFiPXt0aGlzLm9wZW5Jc3N1ZWlzaExpbmtJbk5ld1RhYn1cbiAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICA8RW1vamlSZWFjdGlvbnNDb250cm9sbGVyXG4gICAgICAgICAgICAgICAgICAgIHJlYWN0YWJsZT17cmV2aWV3fVxuICAgICAgICAgICAgICAgICAgICB0b29sdGlwcz17dGhpcy5wcm9wcy50b29sdGlwc31cbiAgICAgICAgICAgICAgICAgICAgcmVwb3J0UmVsYXlFcnJvcj17dGhpcy5wcm9wcy5yZXBvcnRSZWxheUVycm9yfVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICA8L21haW4+XG4gICAgICAgICAgICAgIDwvRnJhZ21lbnQ+XG4gICAgICAgICAgICApO1xuICAgICAgICAgIH19XG4gICAgICAgIC8+XG4gICAgICA8L2Rpdj5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyUmV2aWV3Q29tbWVudFRocmVhZHMoKSB7XG4gICAgY29uc3QgY29tbWVudFRocmVhZHMgPSB0aGlzLnByb3BzLmNvbW1lbnRUaHJlYWRzO1xuICAgIGlmIChjb21tZW50VGhyZWFkcy5sZW5ndGggPT09IDApIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHJlc29sdmVkVGhyZWFkcyA9IGNvbW1lbnRUaHJlYWRzLmZpbHRlcihwYWlyID0+IHBhaXIudGhyZWFkLmlzUmVzb2x2ZWQpO1xuICAgIGNvbnN0IHVucmVzb2x2ZWRUaHJlYWRzID0gY29tbWVudFRocmVhZHMuZmlsdGVyKHBhaXIgPT4gIXBhaXIudGhyZWFkLmlzUmVzb2x2ZWQpO1xuXG4gICAgY29uc3QgdG9nZ2xlQ29tbWVudHMgPSBldnQgPT4ge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBpZiAodGhpcy5wcm9wcy5jb21tZW50U2VjdGlvbk9wZW4pIHtcbiAgICAgICAgdGhpcy5wcm9wcy5oaWRlQ29tbWVudHMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucHJvcHMuc2hvd0NvbW1lbnRzKCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiAoXG4gICAgICA8ZGV0YWlsc1xuICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1zZWN0aW9uIGNvbW1lbnRzXCJcbiAgICAgICAgb3Blbj17dGhpcy5wcm9wcy5jb21tZW50U2VjdGlvbk9wZW59PlxuXG4gICAgICAgIDxzdW1tYXJ5IGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLWhlYWRlclwiIG9uQ2xpY2s9e3RvZ2dsZUNvbW1lbnRzfT5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy10aXRsZVwiPkNvbW1lbnRzPC9zcGFuPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLXByb2dyZXNzXCI+XG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1jb3VudFwiPlxuICAgICAgICAgICAgICBSZXNvbHZlZFxuICAgICAgICAgICAgICB7JyAnfTxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLWNvdW50TnJcIj57cmVzb2x2ZWRUaHJlYWRzLmxlbmd0aH08L3NwYW4+eycgJ31cbiAgICAgICAgICAgICAgb2ZcbiAgICAgICAgICAgICAgeycgJ308c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1jb3VudE5yXCI+e3Jlc29sdmVkVGhyZWFkcy5sZW5ndGggKyB1bnJlc29sdmVkVGhyZWFkcy5sZW5ndGh9PC9zcGFuPlxuICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgPHByb2dyZXNzXG4gICAgICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLXByb2dlc3NCYXJcIiB2YWx1ZT17cmVzb2x2ZWRUaHJlYWRzLmxlbmd0aH1cbiAgICAgICAgICAgICAgbWF4PXtyZXNvbHZlZFRocmVhZHMubGVuZ3RoICsgdW5yZXNvbHZlZFRocmVhZHMubGVuZ3RofVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICA8L3NwYW4+XG4gICAgICAgIDwvc3VtbWFyeT5cblxuICAgICAgICB7dW5yZXNvbHZlZFRocmVhZHMubGVuZ3RoID4gMCAmJiA8bWFpbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1jb250YWluZXJcIj5cbiAgICAgICAgICB7dW5yZXNvbHZlZFRocmVhZHMubWFwKHRoaXMucmVuZGVyUmV2aWV3Q29tbWVudFRocmVhZCl9XG4gICAgICAgIDwvbWFpbj59XG4gICAgICAgIHtyZXNvbHZlZFRocmVhZHMubGVuZ3RoID4gMCAmJiA8ZGV0YWlscyBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1zZWN0aW9uIHJlc29sdmVkLWNvbW1lbnRzXCIgb3Blbj5cbiAgICAgICAgICA8c3VtbWFyeSBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1oZWFkZXJcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLXRpdGxlXCI+UmVzb2x2ZWQ8L3NwYW4+XG4gICAgICAgICAgPC9zdW1tYXJ5PlxuICAgICAgICAgIDxtYWluIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLWNvbnRhaW5lclwiPlxuICAgICAgICAgICAge3Jlc29sdmVkVGhyZWFkcy5tYXAodGhpcy5yZW5kZXJSZXZpZXdDb21tZW50VGhyZWFkKX1cbiAgICAgICAgICA8L21haW4+XG4gICAgICAgIDwvZGV0YWlscz59XG5cbiAgICAgIDwvZGV0YWlscz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyUmV2aWV3Q29tbWVudFRocmVhZCA9IGNvbW1lbnRUaHJlYWQgPT4ge1xuICAgIGNvbnN0IHtjb21tZW50cywgdGhyZWFkfSA9IGNvbW1lbnRUaHJlYWQ7XG4gICAgY29uc3Qgcm9vdENvbW1lbnQgPSBjb21tZW50c1swXTtcbiAgICBpZiAoIXJvb3RDb21tZW50KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBsZXQgdGhyZWFkSG9sZGVyID0gdGhpcy50aHJlYWRIb2xkZXJzLmdldCh0aHJlYWQuaWQpO1xuICAgIGlmICghdGhyZWFkSG9sZGVyKSB7XG4gICAgICB0aHJlYWRIb2xkZXIgPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgICB0aGlzLnRocmVhZEhvbGRlcnMuc2V0KHRocmVhZC5pZCwgdGhyZWFkSG9sZGVyKTtcbiAgICB9XG5cbiAgICBjb25zdCBuYXRpdmVQYXRoID0gdG9OYXRpdmVQYXRoU2VwKHJvb3RDb21tZW50LnBhdGgpO1xuICAgIGNvbnN0IHtkaXIsIGJhc2V9ID0gcGF0aC5wYXJzZShuYXRpdmVQYXRoKTtcbiAgICBjb25zdCB7bGluZU51bWJlciwgcG9zaXRpb25UZXh0fSA9IHRoaXMuZ2V0VHJhbnNsYXRlZFBvc2l0aW9uKHJvb3RDb21tZW50KTtcblxuICAgIGNvbnN0IHJlZkp1bXBUb0ZpbGVCdXR0b24gPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgY29uc3QganVtcFRvRmlsZURpc2FibGVkTGFiZWwgPSAnQ2hlY2tvdXQgdGhpcyBwdWxsIHJlcXVlc3QgdG8gZW5hYmxlIEp1bXAgVG8gRmlsZS4nO1xuXG4gICAgY29uc3QgZWxlbWVudElkID0gYHJldmlldy10aHJlYWQtJHt0aHJlYWQuaWR9YDtcblxuICAgIGNvbnN0IG5hdkJ1dHRvbkNsYXNzZXMgPSBbJ2dpdGh1Yi1SZXZpZXctbmF2QnV0dG9uJywgJ2ljb24nLCB7b3V0ZGF0ZWQ6ICFsaW5lTnVtYmVyfV07XG4gICAgY29uc3Qgb3BlbkZpbGVDbGFzc2VzID0gY3goJ2ljb24tY29kZScsIC4uLm5hdkJ1dHRvbkNsYXNzZXMpO1xuICAgIGNvbnN0IG9wZW5EaWZmQ2xhc3NlcyA9IGN4KCdpY29uLWRpZmYnLCAuLi5uYXZCdXR0b25DbGFzc2VzKTtcblxuICAgIGNvbnN0IGlzT3BlbiA9IHRoaXMucHJvcHMudGhyZWFkSURzT3Blbi5oYXModGhyZWFkLmlkKTtcbiAgICBjb25zdCBpc0hpZ2hsaWdodGVkID0gdGhpcy5wcm9wcy5oaWdobGlnaHRlZFRocmVhZElEcy5oYXModGhyZWFkLmlkKTtcbiAgICBjb25zdCB0b2dnbGUgPSBldnQgPT4ge1xuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIGlmIChpc09wZW4pIHtcbiAgICAgICAgdGhpcy5wcm9wcy5oaWRlVGhyZWFkSUQodGhyZWFkLmlkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucHJvcHMuc2hvd1RocmVhZElEKHRocmVhZC5pZCk7XG4gICAgICB9XG4gICAgfTtcblxuICAgIGNvbnN0IGF1dGhvciA9IHJvb3RDb21tZW50LmF1dGhvciB8fCBHSE9TVF9VU0VSO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkZXRhaWxzXG4gICAgICAgIHJlZj17dGhyZWFkSG9sZGVyLnNldHRlcn1cbiAgICAgICAgY2xhc3NOYW1lPXtjeCgnZ2l0aHViLVJldmlldycsIHsncmVzb2x2ZWQnOiB0aHJlYWQuaXNSZXNvbHZlZCwgJ2dpdGh1Yi1SZXZpZXctLWhpZ2hsaWdodCc6IGlzSGlnaGxpZ2h0ZWR9KX1cbiAgICAgICAga2V5PXtlbGVtZW50SWR9XG4gICAgICAgIGlkPXtlbGVtZW50SWR9XG4gICAgICAgIG9wZW49e2lzT3Blbn0+XG5cbiAgICAgICAgPHN1bW1hcnkgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1yZWZlcmVuY2VcIiBvbkNsaWNrPXt0b2dnbGV9PlxuICAgICAgICAgIHtkaXIgJiYgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1wYXRoXCI+e2Rpcn08L3NwYW4+fVxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctZmlsZVwiPntkaXIgPyBwYXRoLnNlcCA6ICcnfXtiYXNlfTwvc3Bhbj5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LWxpbmVOclwiPntwb3NpdGlvblRleHR9PC9zcGFuPlxuICAgICAgICAgIDxpbWcgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1yZWZlcmVuY2VBdmF0YXJcIlxuICAgICAgICAgICAgc3JjPXthdXRob3IuYXZhdGFyVXJsfSBhbHQ9e2F1dGhvci5sb2dpbn1cbiAgICAgICAgICAvPlxuICAgICAgICAgIDxUaW1lYWdvIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctcmVmZXJlbmNlVGltZUFnb1wiIHRpbWU9e3Jvb3RDb21tZW50LmNyZWF0ZWRBdH0gZGlzcGxheVN0eWxlPVwic2hvcnRcIiAvPlxuICAgICAgICA8L3N1bW1hcnk+XG4gICAgICAgIDxuYXYgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1uYXZcIj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT17b3BlbkZpbGVDbGFzc2VzfVxuICAgICAgICAgICAgZGF0YS1wYXRoPXtuYXRpdmVQYXRofSBkYXRhLWxpbmU9e2xpbmVOdW1iZXJ9XG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLm9wZW5GaWxlfSBkaXNhYmxlZD17dGhpcy5wcm9wcy5jaGVja291dE9wLmlzRW5hYmxlZCgpfVxuICAgICAgICAgICAgcmVmPXtyZWZKdW1wVG9GaWxlQnV0dG9uLnNldHRlcn0+XG4gICAgICAgICAgICBKdW1wIFRvIEZpbGVcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT17b3BlbkRpZmZDbGFzc2VzfVxuICAgICAgICAgICAgZGF0YS1wYXRoPXtuYXRpdmVQYXRofSBkYXRhLWxpbmU9e3Jvb3RDb21tZW50LnBvc2l0aW9ufVxuICAgICAgICAgICAgb25DbGljaz17dGhpcy5vcGVuRGlmZn0+XG4gICAgICAgICAgICBPcGVuIERpZmZcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5jaGVja291dE9wLmlzRW5hYmxlZCgpICYmXG4gICAgICAgICAgICA8VG9vbHRpcFxuICAgICAgICAgICAgICBtYW5hZ2VyPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICAgICAgICB0YXJnZXQ9e3JlZkp1bXBUb0ZpbGVCdXR0b259XG4gICAgICAgICAgICAgIHRpdGxlPXtqdW1wVG9GaWxlRGlzYWJsZWRMYWJlbH1cbiAgICAgICAgICAgICAgc2hvd0RlbGF5PXsyMDB9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIH1cbiAgICAgICAgPC9uYXY+XG5cbiAgICAgICAge3Jvb3RDb21tZW50LnBvc2l0aW9uICE9PSBudWxsICYmIChcbiAgICAgICAgICA8UGF0Y2hQcmV2aWV3Vmlld1xuICAgICAgICAgICAgbXVsdGlGaWxlUGF0Y2g9e3RoaXMucHJvcHMubXVsdGlGaWxlUGF0Y2h9XG4gICAgICAgICAgICBmaWxlTmFtZT17bmF0aXZlUGF0aH1cbiAgICAgICAgICAgIGRpZmZSb3c9e3Jvb3RDb21tZW50LnBvc2l0aW9ufVxuICAgICAgICAgICAgbWF4Um93Q291bnQ9e3RoaXMucHJvcHMuY29udGV4dExpbmVzfVxuICAgICAgICAgICAgY29uZmlnPXt0aGlzLnByb3BzLmNvbmZpZ31cbiAgICAgICAgICAvPlxuICAgICAgICApfVxuXG4gICAgICAgIHt0aGlzLnJlbmRlclRocmVhZCh7dGhyZWFkLCBjb21tZW50c30pfVxuXG4gICAgICA8L2RldGFpbHM+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclRocmVhZCA9ICh7dGhyZWFkLCBjb21tZW50c30pID0+IHtcbiAgICBsZXQgcmVwbHlIb2xkZXIgPSB0aGlzLnJlcGx5SG9sZGVycy5nZXQodGhyZWFkLmlkKTtcbiAgICBpZiAoIXJlcGx5SG9sZGVyKSB7XG4gICAgICByZXBseUhvbGRlciA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICAgIHRoaXMucmVwbHlIb2xkZXJzLnNldCh0aHJlYWQuaWQsIHJlcGx5SG9sZGVyKTtcbiAgICB9XG5cbiAgICBjb25zdCBsYXN0Q29tbWVudCA9IGNvbW1lbnRzW2NvbW1lbnRzLmxlbmd0aCAtIDFdO1xuICAgIGNvbnN0IGlzUG9zdGluZyA9IHRoaXMucHJvcHMucG9zdGluZ1RvVGhyZWFkSUQgIT09IG51bGw7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPEZyYWdtZW50PlxuICAgICAgICA8bWFpbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LWNvbW1lbnRzXCI+XG5cbiAgICAgICAgICB7Y29tbWVudHMubWFwKGNvbW1lbnQgPT4ge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgPFJldmlld0NvbW1lbnRWaWV3XG4gICAgICAgICAgICAgICAga2V5PXtjb21tZW50LmlkfVxuICAgICAgICAgICAgICAgIGNvbW1lbnQ9e2NvbW1lbnR9XG4gICAgICAgICAgICAgICAgb3Blbklzc3VlaXNoPXt0aGlzLnByb3BzLm9wZW5Jc3N1ZWlzaH1cbiAgICAgICAgICAgICAgICBvcGVuSXNzdWVpc2hMaW5rSW5OZXdUYWI9e3RoaXMub3Blbklzc3VlaXNoTGlua0luTmV3VGFifVxuICAgICAgICAgICAgICAgIHRvb2x0aXBzPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICAgICAgICAgIHJlcG9ydFJlbGF5RXJyb3I9e3RoaXMucHJvcHMucmVwb3J0UmVsYXlFcnJvcn1cbiAgICAgICAgICAgICAgICByZW5kZXJFZGl0ZWRMaW5rPXt0aGlzLnJlbmRlckVkaXRlZExpbmt9XG4gICAgICAgICAgICAgICAgcmVuZGVyQXV0aG9yQXNzb2NpYXRpb249e3RoaXMucmVuZGVyQXV0aG9yQXNzb2NpYXRpb259XG4gICAgICAgICAgICAgICAgaXNQb3N0aW5nPXtpc1Bvc3Rpbmd9XG4gICAgICAgICAgICAgICAgY29uZmlybT17dGhpcy5wcm9wcy5jb25maXJtfVxuICAgICAgICAgICAgICAgIGNvbW1hbmRzPXt0aGlzLnByb3BzLmNvbW1hbmRzfVxuICAgICAgICAgICAgICAgIHVwZGF0ZUNvbW1lbnQ9e3RoaXMucHJvcHMudXBkYXRlQ29tbWVudH1cbiAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfSl9XG5cbiAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICBjbGFzc05hbWU9e2N4KCdnaXRodWItUmV2aWV3LXJlcGx5JywgeydnaXRodWItUmV2aWV3LXJlcGx5LS1kaXNhYmxlZCc6IGlzUG9zdGluZ30pfVxuICAgICAgICAgICAgZGF0YS10aHJlYWQtaWQ9e3RocmVhZC5pZH0+XG5cbiAgICAgICAgICAgIDxBdG9tVGV4dEVkaXRvclxuICAgICAgICAgICAgICBwbGFjZWhvbGRlclRleHQ9XCJSZXBseS4uLlwiXG4gICAgICAgICAgICAgIGxpbmVOdW1iZXJHdXR0ZXJWaXNpYmxlPXtmYWxzZX1cbiAgICAgICAgICAgICAgc29mdFdyYXBwZWQ9e3RydWV9XG4gICAgICAgICAgICAgIGF1dG9IZWlnaHQ9e3RydWV9XG4gICAgICAgICAgICAgIHJlYWRPbmx5PXtpc1Bvc3Rpbmd9XG4gICAgICAgICAgICAgIHJlZk1vZGVsPXtyZXBseUhvbGRlcn1cbiAgICAgICAgICAgIC8+XG5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9tYWluPlxuICAgICAgICB7dGhyZWFkLmlzUmVzb2x2ZWQgJiYgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LXJlc29sdmVkVGV4dFwiPlxuICAgICAgICAgIFRoaXMgY29udmVyc2F0aW9uIHdhcyBtYXJrZWQgYXMgcmVzb2x2ZWQgYnkgQHt0aHJlYWQucmVzb2x2ZWRCeS5sb2dpbn1cbiAgICAgICAgPC9kaXY+fVxuICAgICAgICA8Zm9vdGVyIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctZm9vdGVyXCI+XG4gICAgICAgICAgPGJ1dHRvblxuICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1yZXBseUJ1dHRvbiBidG4gYnRuLXByaW1hcnlcIlxuICAgICAgICAgICAgdGl0bGU9XCJBZGQgeW91ciBjb21tZW50XCJcbiAgICAgICAgICAgIGRpc2FibGVkPXtpc1Bvc3Rpbmd9XG4gICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLnN1Ym1pdFJlcGx5KHJlcGx5SG9sZGVyLCB0aHJlYWQsIGxhc3RDb21tZW50KX0+XG4gICAgICAgICAgICBDb21tZW50XG4gICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAge3RoaXMucmVuZGVyUmVzb2x2ZUJ1dHRvbih0aHJlYWQpfVxuICAgICAgICA8L2Zvb3Rlcj5cbiAgICAgIDwvRnJhZ21lbnQ+XG4gICAgKTtcbiAgfVxuXG4gIHJlbmRlclJlc29sdmVCdXR0b24gPSB0aHJlYWQgPT4ge1xuICAgIGlmICh0aHJlYWQuaXNSZXNvbHZlZCkge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctcmVzb2x2ZUJ1dHRvbiBidG4gaWNvbiBpY29uLWNoZWNrXCJcbiAgICAgICAgICB0aXRsZT1cIlVucmVzb2x2ZSBjb252ZXJzYXRpb25cIlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMucmVzb2x2ZVVucmVzb2x2ZVRocmVhZCh0aHJlYWQpfT5cbiAgICAgICAgICBVbnJlc29sdmUgY29udmVyc2F0aW9uXG4gICAgICAgIDwvYnV0dG9uPlxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPGJ1dHRvblxuICAgICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctcmVzb2x2ZUJ1dHRvbiBidG4gaWNvbiBpY29uLWNoZWNrXCJcbiAgICAgICAgICB0aXRsZT1cIlJlc29sdmUgY29udmVyc2F0aW9uXCJcbiAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB0aGlzLnJlc29sdmVVbnJlc29sdmVUaHJlYWQodGhyZWFkKX0+XG4gICAgICAgICAgUmVzb2x2ZSBjb252ZXJzYXRpb25cbiAgICAgICAgPC9idXR0b24+XG4gICAgICApO1xuICAgIH1cbiAgfVxuXG4gIHJlbmRlckVkaXRlZExpbmsoZW50aXR5KSB7XG4gICAgaWYgKCFlbnRpdHkubGFzdEVkaXRlZEF0KSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIChcbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1lZGl0ZWRcIj5cbiAgICAgICAgJm5ic3A74oCiJm5ic3A7XG4gICAgICAgICAgPGEgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1lZGl0ZWRcIiBocmVmPXtlbnRpdHkudXJsfT5lZGl0ZWQ8L2E+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyQXV0aG9yQXNzb2NpYXRpb24oZW50aXR5KSB7XG4gICAgY29uc3QgdGV4dCA9IGF1dGhvckFzc29jaWF0aW9uVGV4dFtlbnRpdHkuYXV0aG9yQXNzb2NpYXRpb25dO1xuICAgIGlmICghdGV4dCkgeyByZXR1cm4gbnVsbDsgfVxuICAgIHJldHVybiAoXG4gICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LWF1dGhvckFzc29jaWF0aW9uQmFkZ2UgYmFkZ2VcIj57dGV4dH08L3NwYW4+XG4gICAgKTtcbiAgfVxuXG4gIG9wZW5GaWxlID0gZXZ0ID0+IHtcbiAgICBpZiAoIXRoaXMucHJvcHMuY2hlY2tvdXRPcC5pc0VuYWJsZWQoKSkge1xuICAgICAgY29uc3QgdGFyZ2V0ID0gZXZ0LmN1cnJlbnRUYXJnZXQ7XG4gICAgICB0aGlzLnByb3BzLm9wZW5GaWxlKHRhcmdldC5kYXRhc2V0LnBhdGgsIHRhcmdldC5kYXRhc2V0LmxpbmUpO1xuICAgIH1cbiAgfVxuXG4gIG9wZW5EaWZmID0gZXZ0ID0+IHtcbiAgICBjb25zdCB0YXJnZXQgPSBldnQuY3VycmVudFRhcmdldDtcbiAgICB0aGlzLnByb3BzLm9wZW5EaWZmKHRhcmdldC5kYXRhc2V0LnBhdGgsIHBhcnNlSW50KHRhcmdldC5kYXRhc2V0LmxpbmUsIDEwKSk7XG4gIH1cblxuICBvcGVuSXNzdWVpc2hMaW5rSW5OZXdUYWIgPSBldnQgPT4ge1xuICAgIGNvbnN0IHtyZXBvT3duZXIsIHJlcG9OYW1lLCBpc3N1ZWlzaE51bWJlcn0gPSBnZXREYXRhRnJvbUdpdGh1YlVybChldnQudGFyZ2V0LmRhdGFzZXQudXJsKTtcbiAgICByZXR1cm4gdGhpcy5wcm9wcy5vcGVuSXNzdWVpc2gocmVwb093bmVyLCByZXBvTmFtZSwgaXNzdWVpc2hOdW1iZXIpO1xuICB9XG5cbiAgc3VibWl0UmVwbHkocmVwbHlIb2xkZXIsIHRocmVhZCwgbGFzdENvbW1lbnQpIHtcbiAgICBjb25zdCBib2R5ID0gcmVwbHlIb2xkZXIubWFwKGVkaXRvciA9PiBlZGl0b3IuZ2V0VGV4dCgpKS5nZXRPcignJyk7XG4gICAgY29uc3QgZGlkU3VibWl0Q29tbWVudCA9ICgpID0+IHJlcGx5SG9sZGVyLm1hcChlZGl0b3IgPT4gZWRpdG9yLnNldFRleHQoJycsIHtieXBhc3NSZWFkT25seTogdHJ1ZX0pKTtcbiAgICBjb25zdCBkaWRGYWlsQ29tbWVudCA9ICgpID0+IHJlcGx5SG9sZGVyLm1hcChlZGl0b3IgPT4gZWRpdG9yLnNldFRleHQoYm9keSwge2J5cGFzc1JlYWRPbmx5OiB0cnVlfSkpO1xuXG4gICAgcmV0dXJuIHRoaXMucHJvcHMuYWRkU2luZ2xlQ29tbWVudChcbiAgICAgIGJvZHksIHRocmVhZC5pZCwgbGFzdENvbW1lbnQuaWQsIGxhc3RDb21tZW50LnBhdGgsIGxhc3RDb21tZW50LnBvc2l0aW9uLCB7ZGlkU3VibWl0Q29tbWVudCwgZGlkRmFpbENvbW1lbnR9LFxuICAgICk7XG4gIH1cblxuICBzdWJtaXRDdXJyZW50Q29tbWVudCA9IGV2dCA9PiB7XG4gICAgY29uc3QgdGhyZWFkSUQgPSBldnQuY3VycmVudFRhcmdldC5kYXRhc2V0LnRocmVhZElkO1xuICAgIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAqL1xuICAgIGlmICghdGhyZWFkSUQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGNvbnN0IHt0aHJlYWQsIGNvbW1lbnRzfSA9IHRoaXMucHJvcHMuY29tbWVudFRocmVhZHMuZmluZChlYWNoID0+IGVhY2gudGhyZWFkLmlkID09PSB0aHJlYWRJRCk7XG4gICAgY29uc3QgcmVwbHlIb2xkZXIgPSB0aGlzLnJlcGx5SG9sZGVycy5nZXQodGhyZWFkSUQpO1xuXG4gICAgcmV0dXJuIHRoaXMuc3VibWl0UmVwbHkocmVwbHlIb2xkZXIsIHRocmVhZCwgY29tbWVudHNbY29tbWVudHMubGVuZ3RoIC0gMV0pO1xuICB9XG5cbiAgZ2V0VHJhbnNsYXRlZFBvc2l0aW9uKHJvb3RDb21tZW50KSB7XG4gICAgbGV0IGxpbmVOdW1iZXIsIHBvc2l0aW9uVGV4dDtcbiAgICBjb25zdCB0cmFuc2xhdGlvbnMgPSB0aGlzLnByb3BzLmNvbW1lbnRUcmFuc2xhdGlvbnM7XG5cbiAgICBjb25zdCBpc0NoZWNrZWRPdXRQdWxsUmVxdWVzdCA9IHRoaXMucHJvcHMuY2hlY2tvdXRPcC53aHkoKSA9PT0gY2hlY2tvdXRTdGF0ZXMuQ1VSUkVOVDtcbiAgICBpZiAodHJhbnNsYXRpb25zID09PSBudWxsKSB7XG4gICAgICBsaW5lTnVtYmVyID0gbnVsbDtcbiAgICAgIHBvc2l0aW9uVGV4dCA9ICcnO1xuICAgIH0gZWxzZSBpZiAocm9vdENvbW1lbnQucG9zaXRpb24gPT09IG51bGwpIHtcbiAgICAgIGxpbmVOdW1iZXIgPSBudWxsO1xuICAgICAgcG9zaXRpb25UZXh0ID0gJ291dGRhdGVkJztcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgdHJhbnNsYXRpb25zRm9yRmlsZSA9IHRyYW5zbGF0aW9ucy5nZXQocGF0aC5ub3JtYWxpemUocm9vdENvbW1lbnQucGF0aCkpO1xuICAgICAgbGluZU51bWJlciA9IHRyYW5zbGF0aW9uc0ZvckZpbGUuZGlmZlRvRmlsZVBvc2l0aW9uLmdldChwYXJzZUludChyb290Q29tbWVudC5wb3NpdGlvbiwgMTApKTtcbiAgICAgIGlmICh0cmFuc2xhdGlvbnNGb3JGaWxlLmZpbGVUcmFuc2xhdGlvbnMgJiYgaXNDaGVja2VkT3V0UHVsbFJlcXVlc3QpIHtcbiAgICAgICAgbGluZU51bWJlciA9IHRyYW5zbGF0aW9uc0ZvckZpbGUuZmlsZVRyYW5zbGF0aW9ucy5nZXQobGluZU51bWJlcikubmV3UG9zaXRpb247XG4gICAgICB9XG4gICAgICBwb3NpdGlvblRleHQgPSBsaW5lTnVtYmVyO1xuICAgIH1cblxuICAgIHJldHVybiB7bGluZU51bWJlciwgcG9zaXRpb25UZXh0fTtcbiAgfVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIHNjcm9sbFRvVGhyZWFkKHRocmVhZElEKSB7XG4gICAgY29uc3QgdGhyZWFkSG9sZGVyID0gdGhpcy50aHJlYWRIb2xkZXJzLmdldCh0aHJlYWRJRCk7XG4gICAgaWYgKHRocmVhZEhvbGRlcikge1xuICAgICAgdGhyZWFkSG9sZGVyLm1hcChlbGVtZW50ID0+IHtcbiAgICAgICAgZWxlbWVudC5zY3JvbGxJbnRvVmlld0lmTmVlZGVkKCk7XG4gICAgICAgIHJldHVybiBudWxsOyAvLyBzaGgsIGVzbGludFxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgcmVzb2x2ZVVucmVzb2x2ZVRocmVhZCh0aHJlYWQpIHtcbiAgICBpZiAodGhyZWFkLmlzUmVzb2x2ZWQpIHtcbiAgICAgIGF3YWl0IHRoaXMucHJvcHMudW5yZXNvbHZlVGhyZWFkKHRocmVhZCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGF3YWl0IHRoaXMucHJvcHMucmVzb2x2ZVRocmVhZCh0aHJlYWQpO1xuICAgIH1cbiAgfVxufVxuIl19