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
    } = this.props; // todo: make this open the review flow in Atom instead of dotcom

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi92aWV3cy9yZXZpZXdzLXZpZXcuanMiXSwibmFtZXMiOlsiYXV0aG9yQXNzb2NpYXRpb25UZXh0IiwiTUVNQkVSIiwiT1dORVIiLCJDT0xMQUJPUkFUT1IiLCJDT05UUklCVVRPUiIsIkZJUlNUX1RJTUVfQ09OVFJJQlVUT1IiLCJGSVJTVF9USU1FUiIsIk5PTkUiLCJSZXZpZXdzVmlldyIsIlJlYWN0IiwiQ29tcG9uZW50IiwiY29uc3RydWN0b3IiLCJwcm9wcyIsInBhY2thZ2UiLCJjb21wb25lbnQiLCJuYW1lIiwicmV2aWV3IiwicmV2aWV3VHlwZXMiLCJ0eXBlIiwiQVBQUk9WRUQiLCJpY29uIiwiY29weSIsIkNPTU1FTlRFRCIsIkNIQU5HRVNfUkVRVUVTVEVEIiwic3RhdGUiLCJib2R5SFRNTCIsImF1dGhvciIsIkdIT1NUX1VTRVIiLCJpZCIsImNvbmZpcm0iLCJjb21tYW5kcyIsInVwZGF0ZVN1bW1hcnkiLCJzaG93QWN0aW9uc01lbnUiLCJhdmF0YXJVcmwiLCJsb2dpbiIsInVybCIsInJlbmRlckVkaXRlZExpbmsiLCJyZW5kZXJBdXRob3JBc3NvY2lhdGlvbiIsInN1Ym1pdHRlZEF0IiwiZXZlbnQiLCJvcGVuSXNzdWVpc2giLCJvcGVuSXNzdWVpc2hMaW5rSW5OZXdUYWIiLCJ0b29sdGlwcyIsInJlcG9ydFJlbGF5RXJyb3IiLCJjb21tZW50VGhyZWFkIiwiY29tbWVudHMiLCJ0aHJlYWQiLCJyb290Q29tbWVudCIsInRocmVhZEhvbGRlciIsInRocmVhZEhvbGRlcnMiLCJnZXQiLCJSZWZIb2xkZXIiLCJzZXQiLCJuYXRpdmVQYXRoIiwicGF0aCIsImRpciIsImJhc2UiLCJwYXJzZSIsImxpbmVOdW1iZXIiLCJwb3NpdGlvblRleHQiLCJnZXRUcmFuc2xhdGVkUG9zaXRpb24iLCJyZWZKdW1wVG9GaWxlQnV0dG9uIiwianVtcFRvRmlsZURpc2FibGVkTGFiZWwiLCJlbGVtZW50SWQiLCJuYXZCdXR0b25DbGFzc2VzIiwib3V0ZGF0ZWQiLCJvcGVuRmlsZUNsYXNzZXMiLCJvcGVuRGlmZkNsYXNzZXMiLCJpc09wZW4iLCJ0aHJlYWRJRHNPcGVuIiwiaGFzIiwiaXNIaWdobGlnaHRlZCIsImhpZ2hsaWdodGVkVGhyZWFkSURzIiwidG9nZ2xlIiwiZXZ0IiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJoaWRlVGhyZWFkSUQiLCJzaG93VGhyZWFkSUQiLCJzZXR0ZXIiLCJpc1Jlc29sdmVkIiwic2VwIiwiY3JlYXRlZEF0Iiwib3BlbkZpbGUiLCJjaGVja291dE9wIiwiaXNFbmFibGVkIiwicG9zaXRpb24iLCJvcGVuRGlmZiIsIm11bHRpRmlsZVBhdGNoIiwiY29udGV4dExpbmVzIiwiY29uZmlnIiwicmVuZGVyVGhyZWFkIiwicmVwbHlIb2xkZXIiLCJyZXBseUhvbGRlcnMiLCJsYXN0Q29tbWVudCIsImxlbmd0aCIsImlzUG9zdGluZyIsInBvc3RpbmdUb1RocmVhZElEIiwibWFwIiwiY29tbWVudCIsInVwZGF0ZUNvbW1lbnQiLCJyZXNvbHZlZEJ5Iiwic3VibWl0UmVwbHkiLCJyZW5kZXJSZXNvbHZlQnV0dG9uIiwicmVzb2x2ZVVucmVzb2x2ZVRocmVhZCIsInRhcmdldCIsImN1cnJlbnRUYXJnZXQiLCJkYXRhc2V0IiwibGluZSIsInBhcnNlSW50IiwicmVwb093bmVyIiwicmVwb05hbWUiLCJpc3N1ZWlzaE51bWJlciIsInRocmVhZElEIiwidGhyZWFkSWQiLCJjb21tZW50VGhyZWFkcyIsImZpbmQiLCJlYWNoIiwicm9vdEhvbGRlciIsIk1hcCIsImlzUmVmcmVzaGluZyIsInN1YnMiLCJDb21wb3NpdGVEaXNwb3NhYmxlIiwiY29tcG9uZW50RGlkTW91bnQiLCJzY3JvbGxUb1RocmVhZElEIiwic2Nyb2xsVG9UaHJlYWQiLCJjb21wb25lbnREaWRVcGRhdGUiLCJwcmV2UHJvcHMiLCJjb21wb25lbnRXaWxsVW5tb3VudCIsImRpc3Bvc2UiLCJyZW5kZXIiLCJyZW5kZXJDb21tYW5kcyIsInJlbmRlckhlYWRlciIsInJlbmRlclJldmlld1N1bW1hcmllcyIsInJlbmRlclJldmlld0NvbW1lbnRUaHJlYWRzIiwibW9yZUNvbnRleHQiLCJsZXNzQ29udGV4dCIsInN1Ym1pdEN1cnJlbnRDb21tZW50IiwicmVmcmVzaCIsInNldFN0YXRlIiwic3ViIiwicmVmZXRjaCIsInJlbW92ZSIsImFkZCIsIm9wZW5QUiIsIm93bmVyIiwicmVwbyIsIm51bWJlciIsInJlZnJlc2hpbmciLCJyZW5kZXJFbXB0eVN0YXRlIiwicHVsbFJlcXVlc3RVUkwiLCJsb2dTdGFydFJldmlld0NsaWNrIiwic3VtbWFyaWVzIiwic3VtbWFyeVNlY3Rpb25PcGVuIiwiaGlkZVN1bW1hcmllcyIsInNob3dTdW1tYXJpZXMiLCJyZW5kZXJSZXZpZXdTdW1tYXJ5IiwicmVzb2x2ZWRUaHJlYWRzIiwiZmlsdGVyIiwicGFpciIsInVucmVzb2x2ZWRUaHJlYWRzIiwidG9nZ2xlQ29tbWVudHMiLCJjb21tZW50U2VjdGlvbk9wZW4iLCJoaWRlQ29tbWVudHMiLCJzaG93Q29tbWVudHMiLCJyZW5kZXJSZXZpZXdDb21tZW50VGhyZWFkIiwiZW50aXR5IiwibGFzdEVkaXRlZEF0IiwidGV4dCIsImF1dGhvckFzc29jaWF0aW9uIiwiYm9keSIsImVkaXRvciIsImdldFRleHQiLCJnZXRPciIsImRpZFN1Ym1pdENvbW1lbnQiLCJzZXRUZXh0IiwiYnlwYXNzUmVhZE9ubHkiLCJkaWRGYWlsQ29tbWVudCIsImFkZFNpbmdsZUNvbW1lbnQiLCJ0cmFuc2xhdGlvbnMiLCJjb21tZW50VHJhbnNsYXRpb25zIiwiaXNDaGVja2VkT3V0UHVsbFJlcXVlc3QiLCJ3aHkiLCJjaGVja291dFN0YXRlcyIsIkNVUlJFTlQiLCJ0cmFuc2xhdGlvbnNGb3JGaWxlIiwibm9ybWFsaXplIiwiZGlmZlRvRmlsZVBvc2l0aW9uIiwiZmlsZVRyYW5zbGF0aW9ucyIsIm5ld1Bvc2l0aW9uIiwiZWxlbWVudCIsInNjcm9sbEludG9WaWV3SWZOZWVkZWQiLCJ1bnJlc29sdmVUaHJlYWQiLCJyZXNvbHZlVGhyZWFkIiwicmVsYXkiLCJQcm9wVHlwZXMiLCJzaGFwZSIsImVudmlyb25tZW50Iiwib2JqZWN0IiwiaXNSZXF1aXJlZCIsInJlcG9zaXRvcnkiLCJwdWxsUmVxdWVzdCIsImFycmF5IiwiYXJyYXlPZiIsImZ1bmMiLCJFbmFibGVhYmxlT3BlcmF0aW9uUHJvcFR5cGUiLCJib29sIiwic3RyaW5nIiwid29ya2RpciIsIndvcmtzcGFjZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7O0FBRUEsTUFBTUEscUJBQXFCLEdBQUc7QUFDNUJDLEVBQUFBLE1BQU0sRUFBRSxRQURvQjtBQUU1QkMsRUFBQUEsS0FBSyxFQUFFLE9BRnFCO0FBRzVCQyxFQUFBQSxZQUFZLEVBQUUsY0FIYztBQUk1QkMsRUFBQUEsV0FBVyxFQUFFLGFBSmU7QUFLNUJDLEVBQUFBLHNCQUFzQixFQUFFLHdCQUxJO0FBTTVCQyxFQUFBQSxXQUFXLEVBQUUsYUFOZTtBQU81QkMsRUFBQUEsSUFBSSxFQUFFO0FBUHNCLENBQTlCOztBQVVlLE1BQU1DLFdBQU4sU0FBMEJDLGVBQU1DLFNBQWhDLENBQTBDO0FBdUV2REMsRUFBQUEsV0FBVyxDQUFDQyxLQUFELEVBQVE7QUFDakIsVUFBTUEsS0FBTjs7QUFEaUIsaURBOEZHLE1BQU07QUFDMUIsbUNBQVMsaUJBQVQsRUFBNEI7QUFBQ0MsUUFBQUEsT0FBTyxFQUFFLFFBQVY7QUFBb0JDLFFBQUFBLFNBQVMsRUFBRSxLQUFLSCxXQUFMLENBQWlCSTtBQUFoRCxPQUE1QjtBQUNELEtBaEdrQjs7QUFBQSxpREFtSkdDLE1BQU0sSUFBSTtBQUM5QixZQUFNQyxXQUFXLEdBQUdDLElBQUksSUFBSTtBQUMxQixlQUFP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LEVBQUFBLGdCQUFnQixFQUFFaUIsbUJBQVVTLElBQVYsQ0FBZUwsVUFoRWhCO0FBaUVqQm5HLEVBQUFBLGFBQWEsRUFBRStGLG1CQUFVUyxJQUFWLENBQWVMLFVBakViO0FBa0VqQnhLLEVBQUFBLGFBQWEsRUFBRW9LLG1CQUFVUyxJQUFWLENBQWVMLFVBbEViO0FBbUVqQjVKLEVBQUFBLGdCQUFnQixFQUFFd0osbUJBQVVTLElBQVYsQ0FBZUw7QUFuRWhCLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBSZWFjdCwge0ZyYWdtZW50fSBmcm9tICdyZWFjdCc7XG5pbXBvcnQgUHJvcFR5cGVzIGZyb20gJ3Byb3AtdHlwZXMnO1xuaW1wb3J0IGN4IGZyb20gJ2NsYXNzbmFtZXMnO1xuaW1wb3J0IHtDb21wb3NpdGVEaXNwb3NhYmxlfSBmcm9tICdldmVudC1raXQnO1xuXG5pbXBvcnQge0VuYWJsZWFibGVPcGVyYXRpb25Qcm9wVHlwZX0gZnJvbSAnLi4vcHJvcC10eXBlcyc7XG5pbXBvcnQgVG9vbHRpcCBmcm9tICcuLi9hdG9tL3Rvb2x0aXAnO1xuaW1wb3J0IENvbW1hbmRzLCB7Q29tbWFuZH0gZnJvbSAnLi4vYXRvbS9jb21tYW5kcyc7XG5pbXBvcnQgQXRvbVRleHRFZGl0b3IgZnJvbSAnLi4vYXRvbS9hdG9tLXRleHQtZWRpdG9yJztcbmltcG9ydCB7Z2V0RGF0YUZyb21HaXRodWJVcmx9IGZyb20gJy4vaXNzdWVpc2gtbGluayc7XG5pbXBvcnQgRW1vamlSZWFjdGlvbnNDb250cm9sbGVyIGZyb20gJy4uL2NvbnRyb2xsZXJzL2Vtb2ppLXJlYWN0aW9ucy1jb250cm9sbGVyJztcbmltcG9ydCB7Y2hlY2tvdXRTdGF0ZXN9IGZyb20gJy4uL2NvbnRyb2xsZXJzL3ByLWNoZWNrb3V0LWNvbnRyb2xsZXInO1xuaW1wb3J0IEdpdGh1YkRvdGNvbU1hcmtkb3duIGZyb20gJy4vZ2l0aHViLWRvdGNvbS1tYXJrZG93bic7XG5pbXBvcnQgUGF0Y2hQcmV2aWV3VmlldyBmcm9tICcuL3BhdGNoLXByZXZpZXctdmlldyc7XG5pbXBvcnQgUmV2aWV3Q29tbWVudFZpZXcgZnJvbSAnLi9yZXZpZXctY29tbWVudC12aWV3JztcbmltcG9ydCBBY3Rpb25hYmxlUmV2aWV3VmlldyBmcm9tICcuL2FjdGlvbmFibGUtcmV2aWV3LXZpZXcnO1xuaW1wb3J0IENoZWNrb3V0QnV0dG9uIGZyb20gJy4vY2hlY2tvdXQtYnV0dG9uJztcbmltcG9ydCBPY3RpY29uIGZyb20gJy4uL2F0b20vb2N0aWNvbic7XG5pbXBvcnQgVGltZWFnbyBmcm9tICcuL3RpbWVhZ28nO1xuaW1wb3J0IFJlZkhvbGRlciBmcm9tICcuLi9tb2RlbHMvcmVmLWhvbGRlcic7XG5pbXBvcnQge3RvTmF0aXZlUGF0aFNlcCwgR0hPU1RfVVNFUn0gZnJvbSAnLi4vaGVscGVycyc7XG5pbXBvcnQge2FkZEV2ZW50fSBmcm9tICcuLi9yZXBvcnRlci1wcm94eSc7XG5cbmNvbnN0IGF1dGhvckFzc29jaWF0aW9uVGV4dCA9IHtcbiAgTUVNQkVSOiAnTWVtYmVyJyxcbiAgT1dORVI6ICdPd25lcicsXG4gIENPTExBQk9SQVRPUjogJ0NvbGxhYm9yYXRvcicsXG4gIENPTlRSSUJVVE9SOiAnQ29udHJpYnV0b3InLFxuICBGSVJTVF9USU1FX0NPTlRSSUJVVE9SOiAnRmlyc3QtdGltZSBjb250cmlidXRvcicsXG4gIEZJUlNUX1RJTUVSOiAnRmlyc3QtdGltZXInLFxuICBOT05FOiBudWxsLFxufTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmV2aWV3c1ZpZXcgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuICAgIC8vIFJlbGF5IHJlc3VsdHNcbiAgICByZWxheTogUHJvcFR5cGVzLnNoYXBlKHtcbiAgICAgIGVudmlyb25tZW50OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgfSkuaXNSZXF1aXJlZCxcbiAgICByZXBvc2l0b3J5OiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgcHVsbFJlcXVlc3Q6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBzdW1tYXJpZXM6IFByb3BUeXBlcy5hcnJheS5pc1JlcXVpcmVkLFxuICAgIGNvbW1lbnRUaHJlYWRzOiBQcm9wVHlwZXMuYXJyYXlPZihQcm9wVHlwZXMuc2hhcGUoe1xuICAgICAgdGhyZWFkOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgICBjb21tZW50czogUHJvcFR5cGVzLmFycmF5T2YoUHJvcFR5cGVzLm9iamVjdCkuaXNSZXF1aXJlZCxcbiAgICB9KSksXG4gICAgcmVmZXRjaDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcblxuICAgIC8vIFBhY2thZ2UgbW9kZWxzXG4gICAgbXVsdGlGaWxlUGF0Y2g6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICBjb250ZXh0TGluZXM6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICBjaGVja291dE9wOiBFbmFibGVhYmxlT3BlcmF0aW9uUHJvcFR5cGUuaXNSZXF1aXJlZCxcbiAgICBzdW1tYXJ5U2VjdGlvbk9wZW46IFByb3BUeXBlcy5ib29sLmlzUmVxdWlyZWQsXG4gICAgY29tbWVudFNlY3Rpb25PcGVuOiBQcm9wVHlwZXMuYm9vbC5pc1JlcXVpcmVkLFxuICAgIHRocmVhZElEc09wZW46IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBoYXM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgfSksXG4gICAgaGlnaGxpZ2h0ZWRUaHJlYWRJRHM6IFByb3BUeXBlcy5zaGFwZSh7XG4gICAgICBoYXM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgfSksXG4gICAgcG9zdGluZ1RvVGhyZWFkSUQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgc2Nyb2xsVG9UaHJlYWRJRDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAvLyBTdHJ1Y3R1cmU6IE1hcDwgcmVsYXRpdmVQYXRoOiBTdHJpbmcsIHtcbiAgICAvLyAgIHJhd1Bvc2l0aW9uczogU2V0PGxpbmVOdW1iZXJzOiBOdW1iZXI+LFxuICAgIC8vICAgZGlmZlRvRmlsZVBvc2l0aW9uOiBNYXA8cmF3UG9zaXRpb246IE51bWJlciwgYWRqdXN0ZWRQb3NpdGlvbjogTnVtYmVyPixcbiAgICAvLyAgIGZpbGVUcmFuc2xhdGlvbnM6IG51bGwgfCBNYXA8YWRqdXN0ZWRQb3NpdGlvbjogTnVtYmVyLCB7bmV3UG9zaXRpb246IE51bWJlcn0+LFxuICAgIC8vICAgZGlnZXN0OiBTdHJpbmcsXG4gICAgLy8gfT5cbiAgICBjb21tZW50VHJhbnNsYXRpb25zOiBQcm9wVHlwZXMub2JqZWN0LFxuXG4gICAgLy8gZm9yIHRoZSBkb3Rjb20gbGluayBpbiB0aGUgZW1wdHkgc3RhdGVcbiAgICBudW1iZXI6IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbiAgICByZXBvOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG4gICAgb3duZXI6IFByb3BUeXBlcy5zdHJpbmcuaXNSZXF1aXJlZCxcbiAgICB3b3JrZGlyOiBQcm9wVHlwZXMuc3RyaW5nLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBBdG9tIGVudmlyb25tZW50XG4gICAgd29ya3NwYWNlOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29uZmlnOiBQcm9wVHlwZXMub2JqZWN0LmlzUmVxdWlyZWQsXG4gICAgY29tbWFuZHM6IFByb3BUeXBlcy5vYmplY3QuaXNSZXF1aXJlZCxcbiAgICB0b29sdGlwczogUHJvcFR5cGVzLm9iamVjdC5pc1JlcXVpcmVkLFxuICAgIGNvbmZpcm06IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG5cbiAgICAvLyBBY3Rpb24gbWV0aG9kc1xuICAgIG9wZW5GaWxlOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9wZW5EaWZmOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIG9wZW5QUjogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBtb3JlQ29udGV4dDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBsZXNzQ29udGV4dDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBvcGVuSXNzdWVpc2g6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgc2hvd1N1bW1hcmllczogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBoaWRlU3VtbWFyaWVzOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHNob3dDb21tZW50czogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBoaWRlQ29tbWVudHM6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgc2hvd1RocmVhZElEOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIGhpZGVUaHJlYWRJRDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICByZXNvbHZlVGhyZWFkOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHVucmVzb2x2ZVRocmVhZDogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICBhZGRTaW5nbGVDb21tZW50OiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICAgIHVwZGF0ZUNvbW1lbnQ6IFByb3BUeXBlcy5mdW5jLmlzUmVxdWlyZWQsXG4gICAgdXBkYXRlU3VtbWFyeTogUHJvcFR5cGVzLmZ1bmMuaXNSZXF1aXJlZCxcbiAgICByZXBvcnRSZWxheUVycm9yOiBQcm9wVHlwZXMuZnVuYy5pc1JlcXVpcmVkLFxuICB9XG5cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICBzdXBlcihwcm9wcyk7XG5cbiAgICB0aGlzLnJvb3RIb2xkZXIgPSBuZXcgUmVmSG9sZGVyKCk7XG4gICAgdGhpcy5yZXBseUhvbGRlcnMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy50aHJlYWRIb2xkZXJzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuc3RhdGUgPSB7XG4gICAgICBpc1JlZnJlc2hpbmc6IGZhbHNlLFxuICAgIH07XG4gICAgdGhpcy5zdWJzID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKTtcbiAgfVxuXG4gIGNvbXBvbmVudERpZE1vdW50KCkge1xuICAgIGNvbnN0IHtzY3JvbGxUb1RocmVhZElEfSA9IHRoaXMucHJvcHM7XG4gICAgaWYgKHNjcm9sbFRvVGhyZWFkSUQpIHtcbiAgICAgIHRoaXMuc2Nyb2xsVG9UaHJlYWQoc2Nyb2xsVG9UaHJlYWRJRCk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50RGlkVXBkYXRlKHByZXZQcm9wcykge1xuICAgIGNvbnN0IHtzY3JvbGxUb1RocmVhZElEfSA9IHRoaXMucHJvcHM7XG4gICAgaWYgKHNjcm9sbFRvVGhyZWFkSUQgJiYgc2Nyb2xsVG9UaHJlYWRJRCAhPT0gcHJldlByb3BzLnNjcm9sbFRvVGhyZWFkSUQpIHtcbiAgICAgIHRoaXMuc2Nyb2xsVG9UaHJlYWQoc2Nyb2xsVG9UaHJlYWRJRCk7XG4gICAgfVxuICB9XG5cbiAgY29tcG9uZW50V2lsbFVubW91bnQoKSB7XG4gICAgdGhpcy5zdWJzLmRpc3Bvc2UoKTtcbiAgfVxuXG4gIHJlbmRlcigpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3c1wiIHJlZj17dGhpcy5yb290SG9sZGVyLnNldHRlcn0+XG4gICAgICAgIHt0aGlzLnJlbmRlckNvbW1hbmRzKCl9XG4gICAgICAgIHt0aGlzLnJlbmRlckhlYWRlcigpfVxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLWxpc3RcIj5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJSZXZpZXdTdW1tYXJpZXMoKX1cbiAgICAgICAgICB7dGhpcy5yZW5kZXJSZXZpZXdDb21tZW50VGhyZWFkcygpfVxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJDb21tYW5kcygpIHtcbiAgICByZXR1cm4gKFxuICAgICAgPEZyYWdtZW50PlxuICAgICAgICA8Q29tbWFuZHMgcmVnaXN0cnk9e3RoaXMucHJvcHMuY29tbWFuZHN9IHRhcmdldD17dGhpcy5yb290SG9sZGVyfT5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOm1vcmUtY29udGV4dFwiIGNhbGxiYWNrPXt0aGlzLnByb3BzLm1vcmVDb250ZXh0fSAvPlxuICAgICAgICAgIDxDb21tYW5kIGNvbW1hbmQ9XCJnaXRodWI6bGVzcy1jb250ZXh0XCIgY2FsbGJhY2s9e3RoaXMucHJvcHMubGVzc0NvbnRleHR9IC8+XG4gICAgICAgIDwvQ29tbWFuZHM+XG4gICAgICAgIDxDb21tYW5kcyByZWdpc3RyeT17dGhpcy5wcm9wcy5jb21tYW5kc30gdGFyZ2V0PVwiLmdpdGh1Yi1SZXZpZXctcmVwbHlcIj5cbiAgICAgICAgICA8Q29tbWFuZCBjb21tYW5kPVwiZ2l0aHViOnN1Ym1pdC1jb21tZW50XCIgY2FsbGJhY2s9e3RoaXMuc3VibWl0Q3VycmVudENvbW1lbnR9IC8+XG4gICAgICAgIDwvQ29tbWFuZHM+XG4gICAgICA8L0ZyYWdtZW50PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJIZWFkZXIoKSB7XG4gICAgY29uc3QgcmVmcmVzaCA9ICgpID0+IHtcbiAgICAgIGlmICh0aGlzLnN0YXRlLmlzUmVmcmVzaGluZykge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICB0aGlzLnNldFN0YXRlKHtpc1JlZnJlc2hpbmc6IHRydWV9KTtcbiAgICAgIGNvbnN0IHN1YiA9IHRoaXMucHJvcHMucmVmZXRjaCgoKSA9PiB7XG4gICAgICAgIHRoaXMuc3Vicy5yZW1vdmUoc3ViKTtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7aXNSZWZyZXNoaW5nOiBmYWxzZX0pO1xuICAgICAgfSk7XG4gICAgICB0aGlzLnN1YnMuYWRkKHN1Yik7XG4gICAgfTtcbiAgICByZXR1cm4gKFxuICAgICAgPGhlYWRlciBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy10b3BIZWFkZXJcIj5cbiAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiaWNvbiBpY29uLWNvbW1lbnQtZGlzY3Vzc2lvblwiIC8+XG4gICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLWhlYWRlclRpdGxlXCI+XG4gICAgICAgICAgUmV2aWV3cyBmb3ImbmJzcDtcbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1jbGlja2FibGVcIiBvbkNsaWNrPXt0aGlzLnByb3BzLm9wZW5QUn0+XG4gICAgICAgICAgICB7dGhpcy5wcm9wcy5vd25lcn0ve3RoaXMucHJvcHMucmVwb30je3RoaXMucHJvcHMubnVtYmVyfVxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgY2xhc3NOYW1lPXtjeChcbiAgICAgICAgICAgICdnaXRodWItUmV2aWV3cy1oZWFkZXJCdXR0b24gZ2l0aHViLVJldmlld3MtY2xpY2thYmxlIGljb24gaWNvbi1yZXBvLXN5bmMnLFxuICAgICAgICAgICAge3JlZnJlc2hpbmc6IHRoaXMuc3RhdGUuaXNSZWZyZXNoaW5nfSxcbiAgICAgICAgICApfVxuICAgICAgICAgIG9uQ2xpY2s9e3JlZnJlc2h9XG4gICAgICAgIC8+XG4gICAgICAgIDxDaGVja291dEJ1dHRvblxuICAgICAgICAgIGNoZWNrb3V0T3A9e3RoaXMucHJvcHMuY2hlY2tvdXRPcH1cbiAgICAgICAgICBjbGFzc05hbWVQcmVmaXg9XCJnaXRodWItUmV2aWV3cy1jaGVja291dEJ1dHRvbi0tXCJcbiAgICAgICAgICBjbGFzc05hbWVzPXtbJ2dpdGh1Yi1SZXZpZXdzLWhlYWRlckJ1dHRvbiddfVxuICAgICAgICAvPlxuICAgICAgPC9oZWFkZXI+XG4gICAgKTtcbiAgfVxuXG4gIGxvZ1N0YXJ0UmV2aWV3Q2xpY2sgPSAoKSA9PiB7XG4gICAgYWRkRXZlbnQoJ3N0YXJ0LXByLXJldmlldycsIHtwYWNrYWdlOiAnZ2l0aHViJywgY29tcG9uZW50OiB0aGlzLmNvbnN0cnVjdG9yLm5hbWV9KTtcbiAgfVxuXG4gIHJlbmRlckVtcHR5U3RhdGUoKSB7XG4gICAgY29uc3Qge251bWJlciwgcmVwbywgb3duZXJ9ID0gdGhpcy5wcm9wcztcbiAgICAvLyB0b2RvOiBtYWtlIHRoaXMgb3BlbiB0aGUgcmV2aWV3IGZsb3cgaW4gQXRvbSBpbnN0ZWFkIG9mIGRvdGNvbVxuICAgIGNvbnN0IHB1bGxSZXF1ZXN0VVJMID0gYGh0dHBzOi8vd3d3LmdpdGh1Yi5jb20vJHtvd25lcn0vJHtyZXBvfS9wdWxsLyR7bnVtYmVyfS9maWxlcy9gO1xuICAgIHJldHVybiAoXG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLWVtcHR5U3RhdGVcIj5cbiAgICAgICAgPGltZyBzcmM9XCJhdG9tOi8vZ2l0aHViL2ltZy9tb25hLnN2Z1wiIGFsdD1cIk1vbmEgdGhlIG9jdG9jYXQgaW4gc3BhYWFjY2VlXCIgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtZW1wdHlJbWdcIiAvPlxuICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLWVtcHR5VGV4dFwiPlxuICAgICAgICAgIFRoaXMgcHVsbCByZXF1ZXN0IGhhcyBubyByZXZpZXdzXG4gICAgICAgIDwvZGl2PlxuICAgICAgICA8YnV0dG9uIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLWVtcHR5Q2FsbFRvQWN0aW9uQnV0dG9uIGJ0blwiPlxuICAgICAgICAgIDxhIGhyZWY9e3B1bGxSZXF1ZXN0VVJMfSBvbkNsaWNrPXt0aGlzLmxvZ1N0YXJ0UmV2aWV3Q2xpY2t9PlxuICAgICAgICAgICAgU3RhcnQgYSBuZXcgcmV2aWV3XG4gICAgICAgICAgPC9hPlxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJSZXZpZXdTdW1tYXJpZXMoKSB7XG4gICAgaWYgKHRoaXMucHJvcHMuc3VtbWFyaWVzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIHRoaXMucmVuZGVyRW1wdHlTdGF0ZSgpO1xuICAgIH1cblxuICAgIGNvbnN0IHRvZ2dsZSA9IGV2dCA9PiB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmICh0aGlzLnByb3BzLnN1bW1hcnlTZWN0aW9uT3Blbikge1xuICAgICAgICB0aGlzLnByb3BzLmhpZGVTdW1tYXJpZXMoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMucHJvcHMuc2hvd1N1bW1hcmllcygpO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRldGFpbHNcbiAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3Mtc2VjdGlvbiBzdW1tYXJpZXNcIlxuICAgICAgICBvcGVuPXt0aGlzLnByb3BzLnN1bW1hcnlTZWN0aW9uT3Blbn0+XG5cbiAgICAgICAgPHN1bW1hcnkgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtaGVhZGVyXCIgb25DbGljaz17dG9nZ2xlfT5cbiAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy10aXRsZVwiPlN1bW1hcmllczwvc3Bhbj5cbiAgICAgICAgPC9zdW1tYXJ5PlxuICAgICAgICA8bWFpbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3cy1jb250YWluZXJcIj5cbiAgICAgICAgICB7dGhpcy5wcm9wcy5zdW1tYXJpZXMubWFwKHRoaXMucmVuZGVyUmV2aWV3U3VtbWFyeSl9XG4gICAgICAgIDwvbWFpbj5cblxuICAgICAgPC9kZXRhaWxzPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJSZXZpZXdTdW1tYXJ5ID0gcmV2aWV3ID0+IHtcbiAgICBjb25zdCByZXZpZXdUeXBlcyA9IHR5cGUgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgQVBQUk9WRUQ6IHtpY29uOiAnaWNvbi1jaGVjaycsIGNvcHk6ICdhcHByb3ZlZCB0aGVzZSBjaGFuZ2VzJ30sXG4gICAgICAgIENPTU1FTlRFRDoge2ljb246ICdpY29uLWNvbW1lbnQnLCBjb3B5OiAnY29tbWVudGVkJ30sXG4gICAgICAgIENIQU5HRVNfUkVRVUVTVEVEOiB7aWNvbjogJ2ljb24tYWxlcnQnLCBjb3B5OiAncmVxdWVzdGVkIGNoYW5nZXMnfSxcbiAgICAgIH1bdHlwZV0gfHwge2ljb246ICcnLCBjb3B5OiAnJ307XG4gICAgfTtcblxuICAgIGNvbnN0IHtpY29uLCBjb3B5fSA9IHJldmlld1R5cGVzKHJldmlldy5zdGF0ZSk7XG5cbiAgICAvLyBmaWx0ZXIgbm9uIGFjdGlvbmFibGUgZW1wdHkgc3VtbWFyeSBjb21tZW50cyBmcm9tIHRoaXMgdmlld1xuICAgIGlmIChyZXZpZXcuc3RhdGUgPT09ICdQRU5ESU5HJyB8fCAocmV2aWV3LnN0YXRlID09PSAnQ09NTUVOVEVEJyAmJiByZXZpZXcuYm9keUhUTUwgPT09ICcnKSkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgYXV0aG9yID0gcmV2aWV3LmF1dGhvciB8fCBHSE9TVF9VU0VSO1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld1N1bW1hcnlcIiBrZXk9e3Jldmlldy5pZH0+XG4gICAgICAgIDxBY3Rpb25hYmxlUmV2aWV3Vmlld1xuICAgICAgICAgIG9yaWdpbmFsQ29udGVudD17cmV2aWV3fVxuICAgICAgICAgIGNvbmZpcm09e3RoaXMucHJvcHMuY29uZmlybX1cbiAgICAgICAgICBjb21tYW5kcz17dGhpcy5wcm9wcy5jb21tYW5kc31cbiAgICAgICAgICBjb250ZW50VXBkYXRlcj17dGhpcy5wcm9wcy51cGRhdGVTdW1tYXJ5fVxuICAgICAgICAgIHJlbmRlcj17c2hvd0FjdGlvbnNNZW51ID0+IHtcbiAgICAgICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICAgIDxGcmFnbWVudD5cbiAgICAgICAgICAgICAgICA8aGVhZGVyIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctaGVhZGVyXCI+XG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctaGVhZGVyLWF1dGhvckRhdGFcIj5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtgZ2l0aHViLVJldmlld1N1bW1hcnktaWNvbiBpY29uICR7aWNvbn1gfSAvPlxuICAgICAgICAgICAgICAgICAgICA8aW1nIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdTdW1tYXJ5LWF2YXRhclwiXG4gICAgICAgICAgICAgICAgICAgICAgc3JjPXthdXRob3IuYXZhdGFyVXJsfSBhbHQ9e2F1dGhvci5sb2dpbn1cbiAgICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgICAgPGEgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld1N1bW1hcnktdXNlcm5hbWVcIiBocmVmPXthdXRob3IudXJsfT57YXV0aG9yLmxvZ2lufTwvYT5cbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld1N1bW1hcnktdHlwZVwiPntjb3B5fTwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAge3RoaXMucmVuZGVyRWRpdGVkTGluayhyZXZpZXcpfVxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJBdXRob3JBc3NvY2lhdGlvbihyZXZpZXcpfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgICA8VGltZWFnbyBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3U3VtbWFyeS10aW1lQWdvXCIgdGltZT17cmV2aWV3LnN1Ym1pdHRlZEF0fSBkaXNwbGF5U3R5bGU9XCJzaG9ydFwiIC8+XG4gICAgICAgICAgICAgICAgICA8T2N0aWNvblxuICAgICAgICAgICAgICAgICAgICBpY29uPVwiZWxsaXBzZXNcIlxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LWFjdGlvbnNNZW51XCJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17ZXZlbnQgPT4gc2hvd0FjdGlvbnNNZW51KGV2ZW50LCByZXZpZXcsIGF1dGhvcil9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvaGVhZGVyPlxuICAgICAgICAgICAgICAgIDxtYWluIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdTdW1tYXJ5LWNvbW1lbnRcIj5cbiAgICAgICAgICAgICAgICAgIDxHaXRodWJEb3Rjb21NYXJrZG93blxuICAgICAgICAgICAgICAgICAgICBodG1sPXtyZXZpZXcuYm9keUhUTUx9XG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaFRvSXNzdWVpc2g9e3RoaXMucHJvcHMub3Blbklzc3VlaXNofVxuICAgICAgICAgICAgICAgICAgICBvcGVuSXNzdWVpc2hMaW5rSW5OZXdUYWI9e3RoaXMub3Blbklzc3VlaXNoTGlua0luTmV3VGFifVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDxFbW9qaVJlYWN0aW9uc0NvbnRyb2xsZXJcbiAgICAgICAgICAgICAgICAgICAgcmVhY3RhYmxlPXtyZXZpZXd9XG4gICAgICAgICAgICAgICAgICAgIHRvb2x0aXBzPXt0aGlzLnByb3BzLnRvb2x0aXBzfVxuICAgICAgICAgICAgICAgICAgICByZXBvcnRSZWxheUVycm9yPXt0aGlzLnByb3BzLnJlcG9ydFJlbGF5RXJyb3J9XG4gICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgIDwvbWFpbj5cbiAgICAgICAgICAgICAgPC9GcmFnbWVudD5cbiAgICAgICAgICAgICk7XG4gICAgICAgICAgfX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgICk7XG4gIH1cblxuICByZW5kZXJSZXZpZXdDb21tZW50VGhyZWFkcygpIHtcbiAgICBjb25zdCBjb21tZW50VGhyZWFkcyA9IHRoaXMucHJvcHMuY29tbWVudFRocmVhZHM7XG4gICAgaWYgKGNvbW1lbnRUaHJlYWRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3QgcmVzb2x2ZWRUaHJlYWRzID0gY29tbWVudFRocmVhZHMuZmlsdGVyKHBhaXIgPT4gcGFpci50aHJlYWQuaXNSZXNvbHZlZCk7XG4gICAgY29uc3QgdW5yZXNvbHZlZFRocmVhZHMgPSBjb21tZW50VGhyZWFkcy5maWx0ZXIocGFpciA9PiAhcGFpci50aHJlYWQuaXNSZXNvbHZlZCk7XG5cbiAgICBjb25zdCB0b2dnbGVDb21tZW50cyA9IGV2dCA9PiB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGlmICh0aGlzLnByb3BzLmNvbW1lbnRTZWN0aW9uT3Blbikge1xuICAgICAgICB0aGlzLnByb3BzLmhpZGVDb21tZW50cygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5wcm9wcy5zaG93Q29tbWVudHMoKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgcmV0dXJuIChcbiAgICAgIDxkZXRhaWxzXG4gICAgICAgIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLXNlY3Rpb24gY29tbWVudHNcIlxuICAgICAgICBvcGVuPXt0aGlzLnByb3BzLmNvbW1lbnRTZWN0aW9uT3Blbn0+XG5cbiAgICAgICAgPHN1bW1hcnkgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtaGVhZGVyXCIgb25DbGljaz17dG9nZ2xlQ29tbWVudHN9PlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLXRpdGxlXCI+Q29tbWVudHM8L3NwYW4+XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtcHJvZ3Jlc3NcIj5cbiAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLWNvdW50XCI+XG4gICAgICAgICAgICAgIFJlc29sdmVkXG4gICAgICAgICAgICAgIHsnICd9PHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtY291bnROclwiPntyZXNvbHZlZFRocmVhZHMubGVuZ3RofTwvc3Bhbj57JyAnfVxuICAgICAgICAgICAgICBvZlxuICAgICAgICAgICAgICB7JyAnfTxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLWNvdW50TnJcIj57cmVzb2x2ZWRUaHJlYWRzLmxlbmd0aCArIHVucmVzb2x2ZWRUaHJlYWRzLmxlbmd0aH08L3NwYW4+XG4gICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICA8cHJvZ3Jlc3NcbiAgICAgICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtcHJvZ2Vzc0JhclwiIHZhbHVlPXtyZXNvbHZlZFRocmVhZHMubGVuZ3RofVxuICAgICAgICAgICAgICBtYXg9e3Jlc29sdmVkVGhyZWFkcy5sZW5ndGggKyB1bnJlc29sdmVkVGhyZWFkcy5sZW5ndGh9XG4gICAgICAgICAgICAvPlxuICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgPC9zdW1tYXJ5PlxuXG4gICAgICAgIHt1bnJlc29sdmVkVGhyZWFkcy5sZW5ndGggPiAwICYmIDxtYWluIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLWNvbnRhaW5lclwiPlxuICAgICAgICAgIHt1bnJlc29sdmVkVGhyZWFkcy5tYXAodGhpcy5yZW5kZXJSZXZpZXdDb21tZW50VGhyZWFkKX1cbiAgICAgICAgPC9tYWluPn1cbiAgICAgICAge3Jlc29sdmVkVGhyZWFkcy5sZW5ndGggPiAwICYmIDxkZXRhaWxzIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLXNlY3Rpb24gcmVzb2x2ZWQtY29tbWVudHNcIiBvcGVuPlxuICAgICAgICAgIDxzdW1tYXJ5IGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXdzLWhlYWRlclwiPlxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtdGl0bGVcIj5SZXNvbHZlZDwvc3Bhbj5cbiAgICAgICAgICA8L3N1bW1hcnk+XG4gICAgICAgICAgPG1haW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlld3MtY29udGFpbmVyXCI+XG4gICAgICAgICAgICB7cmVzb2x2ZWRUaHJlYWRzLm1hcCh0aGlzLnJlbmRlclJldmlld0NvbW1lbnRUaHJlYWQpfVxuICAgICAgICAgIDwvbWFpbj5cbiAgICAgICAgPC9kZXRhaWxzPn1cblxuICAgICAgPC9kZXRhaWxzPlxuICAgICk7XG4gIH1cblxuICByZW5kZXJSZXZpZXdDb21tZW50VGhyZWFkID0gY29tbWVudFRocmVhZCA9PiB7XG4gICAgY29uc3Qge2NvbW1lbnRzLCB0aHJlYWR9ID0gY29tbWVudFRocmVhZDtcbiAgICBjb25zdCByb290Q29tbWVudCA9IGNvbW1lbnRzWzBdO1xuICAgIGlmICghcm9vdENvbW1lbnQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIGxldCB0aHJlYWRIb2xkZXIgPSB0aGlzLnRocmVhZEhvbGRlcnMuZ2V0KHRocmVhZC5pZCk7XG4gICAgaWYgKCF0aHJlYWRIb2xkZXIpIHtcbiAgICAgIHRocmVhZEhvbGRlciA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICAgIHRoaXMudGhyZWFkSG9sZGVycy5zZXQodGhyZWFkLmlkLCB0aHJlYWRIb2xkZXIpO1xuICAgIH1cblxuICAgIGNvbnN0IG5hdGl2ZVBhdGggPSB0b05hdGl2ZVBhdGhTZXAocm9vdENvbW1lbnQucGF0aCk7XG4gICAgY29uc3Qge2RpciwgYmFzZX0gPSBwYXRoLnBhcnNlKG5hdGl2ZVBhdGgpO1xuICAgIGNvbnN0IHtsaW5lTnVtYmVyLCBwb3NpdGlvblRleHR9ID0gdGhpcy5nZXRUcmFuc2xhdGVkUG9zaXRpb24ocm9vdENvbW1lbnQpO1xuXG4gICAgY29uc3QgcmVmSnVtcFRvRmlsZUJ1dHRvbiA9IG5ldyBSZWZIb2xkZXIoKTtcbiAgICBjb25zdCBqdW1wVG9GaWxlRGlzYWJsZWRMYWJlbCA9ICdDaGVja291dCB0aGlzIHB1bGwgcmVxdWVzdCB0byBlbmFibGUgSnVtcCBUbyBGaWxlLic7XG5cbiAgICBjb25zdCBlbGVtZW50SWQgPSBgcmV2aWV3LXRocmVhZC0ke3RocmVhZC5pZH1gO1xuXG4gICAgY29uc3QgbmF2QnV0dG9uQ2xhc3NlcyA9IFsnZ2l0aHViLVJldmlldy1uYXZCdXR0b24nLCAnaWNvbicsIHtvdXRkYXRlZDogIWxpbmVOdW1iZXJ9XTtcbiAgICBjb25zdCBvcGVuRmlsZUNsYXNzZXMgPSBjeCgnaWNvbi1jb2RlJywgLi4ubmF2QnV0dG9uQ2xhc3Nlcyk7XG4gICAgY29uc3Qgb3BlbkRpZmZDbGFzc2VzID0gY3goJ2ljb24tZGlmZicsIC4uLm5hdkJ1dHRvbkNsYXNzZXMpO1xuXG4gICAgY29uc3QgaXNPcGVuID0gdGhpcy5wcm9wcy50aHJlYWRJRHNPcGVuLmhhcyh0aHJlYWQuaWQpO1xuICAgIGNvbnN0IGlzSGlnaGxpZ2h0ZWQgPSB0aGlzLnByb3BzLmhpZ2hsaWdodGVkVGhyZWFkSURzLmhhcyh0aHJlYWQuaWQpO1xuICAgIGNvbnN0IHRvZ2dsZSA9IGV2dCA9PiB7XG4gICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgaWYgKGlzT3Blbikge1xuICAgICAgICB0aGlzLnByb3BzLmhpZGVUaHJlYWRJRCh0aHJlYWQuaWQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5wcm9wcy5zaG93VGhyZWFkSUQodGhyZWFkLmlkKTtcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgY29uc3QgYXV0aG9yID0gcm9vdENvbW1lbnQuYXV0aG9yIHx8IEdIT1NUX1VTRVI7XG5cbiAgICByZXR1cm4gKFxuICAgICAgPGRldGFpbHNcbiAgICAgICAgcmVmPXt0aHJlYWRIb2xkZXIuc2V0dGVyfVxuICAgICAgICBjbGFzc05hbWU9e2N4KCdnaXRodWItUmV2aWV3JywgeydyZXNvbHZlZCc6IHRocmVhZC5pc1Jlc29sdmVkLCAnZ2l0aHViLVJldmlldy0taGlnaGxpZ2h0JzogaXNIaWdobGlnaHRlZH0pfVxuICAgICAgICBrZXk9e2VsZW1lbnRJZH1cbiAgICAgICAgaWQ9e2VsZW1lbnRJZH1cbiAgICAgICAgb3Blbj17aXNPcGVufT5cblxuICAgICAgICA8c3VtbWFyeSBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LXJlZmVyZW5jZVwiIG9uQ2xpY2s9e3RvZ2dsZX0+XG4gICAgICAgICAge2RpciAmJiA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LXBhdGhcIj57ZGlyfTwvc3Bhbj59XG4gICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1maWxlXCI+e2RpciA/IHBhdGguc2VwIDogJyd9e2Jhc2V9PC9zcGFuPlxuICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctbGluZU5yXCI+e3Bvc2l0aW9uVGV4dH08L3NwYW4+XG4gICAgICAgICAgPGltZyBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LXJlZmVyZW5jZUF2YXRhclwiXG4gICAgICAgICAgICBzcmM9e2F1dGhvci5hdmF0YXJVcmx9IGFsdD17YXV0aG9yLmxvZ2lufVxuICAgICAgICAgIC8+XG4gICAgICAgICAgPFRpbWVhZ28gY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1yZWZlcmVuY2VUaW1lQWdvXCIgdGltZT17cm9vdENvbW1lbnQuY3JlYXRlZEF0fSBkaXNwbGF5U3R5bGU9XCJzaG9ydFwiIC8+XG4gICAgICAgIDwvc3VtbWFyeT5cbiAgICAgICAgPG5hdiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LW5hdlwiPlxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPXtvcGVuRmlsZUNsYXNzZXN9XG4gICAgICAgICAgICBkYXRhLXBhdGg9e25hdGl2ZVBhdGh9IGRhdGEtbGluZT17bGluZU51bWJlcn1cbiAgICAgICAgICAgIG9uQ2xpY2s9e3RoaXMub3BlbkZpbGV9IGRpc2FibGVkPXt0aGlzLnByb3BzLmNoZWNrb3V0T3AuaXNFbmFibGVkKCl9XG4gICAgICAgICAgICByZWY9e3JlZkp1bXBUb0ZpbGVCdXR0b24uc2V0dGVyfT5cbiAgICAgICAgICAgIEp1bXAgVG8gRmlsZVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIDxidXR0b24gY2xhc3NOYW1lPXtvcGVuRGlmZkNsYXNzZXN9XG4gICAgICAgICAgICBkYXRhLXBhdGg9e25hdGl2ZVBhdGh9IGRhdGEtbGluZT17cm9vdENvbW1lbnQucG9zaXRpb259XG4gICAgICAgICAgICBvbkNsaWNrPXt0aGlzLm9wZW5EaWZmfT5cbiAgICAgICAgICAgIE9wZW4gRGlmZlxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgIHt0aGlzLnByb3BzLmNoZWNrb3V0T3AuaXNFbmFibGVkKCkgJiZcbiAgICAgICAgICAgIDxUb29sdGlwXG4gICAgICAgICAgICAgIG1hbmFnZXI9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgICAgIHRhcmdldD17cmVmSnVtcFRvRmlsZUJ1dHRvbn1cbiAgICAgICAgICAgICAgdGl0bGU9e2p1bXBUb0ZpbGVEaXNhYmxlZExhYmVsfVxuICAgICAgICAgICAgICBzaG93RGVsYXk9ezIwMH1cbiAgICAgICAgICAgIC8+XG4gICAgICAgICAgfVxuICAgICAgICA8L25hdj5cblxuICAgICAgICB7cm9vdENvbW1lbnQucG9zaXRpb24gIT09IG51bGwgJiYgKFxuICAgICAgICAgIDxQYXRjaFByZXZpZXdWaWV3XG4gICAgICAgICAgICBtdWx0aUZpbGVQYXRjaD17dGhpcy5wcm9wcy5tdWx0aUZpbGVQYXRjaH1cbiAgICAgICAgICAgIGZpbGVOYW1lPXtuYXRpdmVQYXRofVxuICAgICAgICAgICAgZGlmZlJvdz17cm9vdENvbW1lbnQucG9zaXRpb259XG4gICAgICAgICAgICBtYXhSb3dDb3VudD17dGhpcy5wcm9wcy5jb250ZXh0TGluZXN9XG4gICAgICAgICAgICBjb25maWc9e3RoaXMucHJvcHMuY29uZmlnfVxuICAgICAgICAgIC8+XG4gICAgICAgICl9XG5cbiAgICAgICAge3RoaXMucmVuZGVyVGhyZWFkKHt0aHJlYWQsIGNvbW1lbnRzfSl9XG5cbiAgICAgIDwvZGV0YWlscz5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyVGhyZWFkID0gKHt0aHJlYWQsIGNvbW1lbnRzfSkgPT4ge1xuICAgIGxldCByZXBseUhvbGRlciA9IHRoaXMucmVwbHlIb2xkZXJzLmdldCh0aHJlYWQuaWQpO1xuICAgIGlmICghcmVwbHlIb2xkZXIpIHtcbiAgICAgIHJlcGx5SG9sZGVyID0gbmV3IFJlZkhvbGRlcigpO1xuICAgICAgdGhpcy5yZXBseUhvbGRlcnMuc2V0KHRocmVhZC5pZCwgcmVwbHlIb2xkZXIpO1xuICAgIH1cblxuICAgIGNvbnN0IGxhc3RDb21tZW50ID0gY29tbWVudHNbY29tbWVudHMubGVuZ3RoIC0gMV07XG4gICAgY29uc3QgaXNQb3N0aW5nID0gdGhpcy5wcm9wcy5wb3N0aW5nVG9UaHJlYWRJRCAhPT0gbnVsbDtcblxuICAgIHJldHVybiAoXG4gICAgICA8RnJhZ21lbnQ+XG4gICAgICAgIDxtYWluIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctY29tbWVudHNcIj5cblxuICAgICAgICAgIHtjb21tZW50cy5tYXAoY29tbWVudCA9PiB7XG4gICAgICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgICA8UmV2aWV3Q29tbWVudFZpZXdcbiAgICAgICAgICAgICAgICBrZXk9e2NvbW1lbnQuaWR9XG4gICAgICAgICAgICAgICAgY29tbWVudD17Y29tbWVudH1cbiAgICAgICAgICAgICAgICBvcGVuSXNzdWVpc2g9e3RoaXMucHJvcHMub3Blbklzc3VlaXNofVxuICAgICAgICAgICAgICAgIG9wZW5Jc3N1ZWlzaExpbmtJbk5ld1RhYj17dGhpcy5vcGVuSXNzdWVpc2hMaW5rSW5OZXdUYWJ9XG4gICAgICAgICAgICAgICAgdG9vbHRpcHM9e3RoaXMucHJvcHMudG9vbHRpcHN9XG4gICAgICAgICAgICAgICAgcmVwb3J0UmVsYXlFcnJvcj17dGhpcy5wcm9wcy5yZXBvcnRSZWxheUVycm9yfVxuICAgICAgICAgICAgICAgIHJlbmRlckVkaXRlZExpbms9e3RoaXMucmVuZGVyRWRpdGVkTGlua31cbiAgICAgICAgICAgICAgICByZW5kZXJBdXRob3JBc3NvY2lhdGlvbj17dGhpcy5yZW5kZXJBdXRob3JBc3NvY2lhdGlvbn1cbiAgICAgICAgICAgICAgICBpc1Bvc3Rpbmc9e2lzUG9zdGluZ31cbiAgICAgICAgICAgICAgICBjb25maXJtPXt0aGlzLnByb3BzLmNvbmZpcm19XG4gICAgICAgICAgICAgICAgY29tbWFuZHM9e3RoaXMucHJvcHMuY29tbWFuZHN9XG4gICAgICAgICAgICAgICAgdXBkYXRlQ29tbWVudD17dGhpcy5wcm9wcy51cGRhdGVDb21tZW50fVxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KX1cblxuICAgICAgICAgIDxkaXZcbiAgICAgICAgICAgIGNsYXNzTmFtZT17Y3goJ2dpdGh1Yi1SZXZpZXctcmVwbHknLCB7J2dpdGh1Yi1SZXZpZXctcmVwbHktLWRpc2FibGVkJzogaXNQb3N0aW5nfSl9XG4gICAgICAgICAgICBkYXRhLXRocmVhZC1pZD17dGhyZWFkLmlkfT5cblxuICAgICAgICAgICAgPEF0b21UZXh0RWRpdG9yXG4gICAgICAgICAgICAgIHBsYWNlaG9sZGVyVGV4dD1cIlJlcGx5Li4uXCJcbiAgICAgICAgICAgICAgbGluZU51bWJlckd1dHRlclZpc2libGU9e2ZhbHNlfVxuICAgICAgICAgICAgICBzb2Z0V3JhcHBlZD17dHJ1ZX1cbiAgICAgICAgICAgICAgYXV0b0hlaWdodD17dHJ1ZX1cbiAgICAgICAgICAgICAgcmVhZE9ubHk9e2lzUG9zdGluZ31cbiAgICAgICAgICAgICAgcmVmTW9kZWw9e3JlcGx5SG9sZGVyfVxuICAgICAgICAgICAgLz5cblxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L21haW4+XG4gICAgICAgIHt0aHJlYWQuaXNSZXNvbHZlZCAmJiA8ZGl2IGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctcmVzb2x2ZWRUZXh0XCI+XG4gICAgICAgICAgVGhpcyBjb252ZXJzYXRpb24gd2FzIG1hcmtlZCBhcyByZXNvbHZlZCBieSBAe3RocmVhZC5yZXNvbHZlZEJ5LmxvZ2lufVxuICAgICAgICA8L2Rpdj59XG4gICAgICAgIDxmb290ZXIgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1mb290ZXJcIj5cbiAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LXJlcGx5QnV0dG9uIGJ0biBidG4tcHJpbWFyeVwiXG4gICAgICAgICAgICB0aXRsZT1cIkFkZCB5b3VyIGNvbW1lbnRcIlxuICAgICAgICAgICAgZGlzYWJsZWQ9e2lzUG9zdGluZ31cbiAgICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMuc3VibWl0UmVwbHkocmVwbHlIb2xkZXIsIHRocmVhZCwgbGFzdENvbW1lbnQpfT5cbiAgICAgICAgICAgIENvbW1lbnRcbiAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICB7dGhpcy5yZW5kZXJSZXNvbHZlQnV0dG9uKHRocmVhZCl9XG4gICAgICAgIDwvZm9vdGVyPlxuICAgICAgPC9GcmFnbWVudD5cbiAgICApO1xuICB9XG5cbiAgcmVuZGVyUmVzb2x2ZUJ1dHRvbiA9IHRocmVhZCA9PiB7XG4gICAgaWYgKHRocmVhZC5pc1Jlc29sdmVkKSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1yZXNvbHZlQnV0dG9uIGJ0biBpY29uIGljb24tY2hlY2tcIlxuICAgICAgICAgIHRpdGxlPVwiVW5yZXNvbHZlIGNvbnZlcnNhdGlvblwiXG4gICAgICAgICAgb25DbGljaz17KCkgPT4gdGhpcy5yZXNvbHZlVW5yZXNvbHZlVGhyZWFkKHRocmVhZCl9PlxuICAgICAgICAgIFVucmVzb2x2ZSBjb252ZXJzYXRpb25cbiAgICAgICAgPC9idXR0b24+XG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgY2xhc3NOYW1lPVwiZ2l0aHViLVJldmlldy1yZXNvbHZlQnV0dG9uIGJ0biBpY29uIGljb24tY2hlY2tcIlxuICAgICAgICAgIHRpdGxlPVwiUmVzb2x2ZSBjb252ZXJzYXRpb25cIlxuICAgICAgICAgIG9uQ2xpY2s9eygpID0+IHRoaXMucmVzb2x2ZVVucmVzb2x2ZVRocmVhZCh0aHJlYWQpfT5cbiAgICAgICAgICBSZXNvbHZlIGNvbnZlcnNhdGlvblxuICAgICAgICA8L2J1dHRvbj5cbiAgICAgICk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyRWRpdGVkTGluayhlbnRpdHkpIHtcbiAgICBpZiAoIWVudGl0eS5sYXN0RWRpdGVkQXQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gKFxuICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LWVkaXRlZFwiPlxuICAgICAgICAmbmJzcDvigKImbmJzcDtcbiAgICAgICAgICA8YSBjbGFzc05hbWU9XCJnaXRodWItUmV2aWV3LWVkaXRlZFwiIGhyZWY9e2VudGl0eS51cmx9PmVkaXRlZDwvYT5cbiAgICAgICAgPC9zcGFuPlxuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICByZW5kZXJBdXRob3JBc3NvY2lhdGlvbihlbnRpdHkpIHtcbiAgICBjb25zdCB0ZXh0ID0gYXV0aG9yQXNzb2NpYXRpb25UZXh0W2VudGl0eS5hdXRob3JBc3NvY2lhdGlvbl07XG4gICAgaWYgKCF0ZXh0KSB7IHJldHVybiBudWxsOyB9XG4gICAgcmV0dXJuIChcbiAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImdpdGh1Yi1SZXZpZXctYXV0aG9yQXNzb2NpYXRpb25CYWRnZSBiYWRnZVwiPnt0ZXh0fTwvc3Bhbj5cbiAgICApO1xuICB9XG5cbiAgb3BlbkZpbGUgPSBldnQgPT4ge1xuICAgIGlmICghdGhpcy5wcm9wcy5jaGVja291dE9wLmlzRW5hYmxlZCgpKSB7XG4gICAgICBjb25zdCB0YXJnZXQgPSBldnQuY3VycmVudFRhcmdldDtcbiAgICAgIHRoaXMucHJvcHMub3BlbkZpbGUodGFyZ2V0LmRhdGFzZXQucGF0aCwgdGFyZ2V0LmRhdGFzZXQubGluZSk7XG4gICAgfVxuICB9XG5cbiAgb3BlbkRpZmYgPSBldnQgPT4ge1xuICAgIGNvbnN0IHRhcmdldCA9IGV2dC5jdXJyZW50VGFyZ2V0O1xuICAgIHRoaXMucHJvcHMub3BlbkRpZmYodGFyZ2V0LmRhdGFzZXQucGF0aCwgcGFyc2VJbnQodGFyZ2V0LmRhdGFzZXQubGluZSwgMTApKTtcbiAgfVxuXG4gIG9wZW5Jc3N1ZWlzaExpbmtJbk5ld1RhYiA9IGV2dCA9PiB7XG4gICAgY29uc3Qge3JlcG9Pd25lciwgcmVwb05hbWUsIGlzc3VlaXNoTnVtYmVyfSA9IGdldERhdGFGcm9tR2l0aHViVXJsKGV2dC50YXJnZXQuZGF0YXNldC51cmwpO1xuICAgIHJldHVybiB0aGlzLnByb3BzLm9wZW5Jc3N1ZWlzaChyZXBvT3duZXIsIHJlcG9OYW1lLCBpc3N1ZWlzaE51bWJlcik7XG4gIH1cblxuICBzdWJtaXRSZXBseShyZXBseUhvbGRlciwgdGhyZWFkLCBsYXN0Q29tbWVudCkge1xuICAgIGNvbnN0IGJvZHkgPSByZXBseUhvbGRlci5tYXAoZWRpdG9yID0+IGVkaXRvci5nZXRUZXh0KCkpLmdldE9yKCcnKTtcbiAgICBjb25zdCBkaWRTdWJtaXRDb21tZW50ID0gKCkgPT4gcmVwbHlIb2xkZXIubWFwKGVkaXRvciA9PiBlZGl0b3Iuc2V0VGV4dCgnJywge2J5cGFzc1JlYWRPbmx5OiB0cnVlfSkpO1xuICAgIGNvbnN0IGRpZEZhaWxDb21tZW50ID0gKCkgPT4gcmVwbHlIb2xkZXIubWFwKGVkaXRvciA9PiBlZGl0b3Iuc2V0VGV4dChib2R5LCB7YnlwYXNzUmVhZE9ubHk6IHRydWV9KSk7XG5cbiAgICByZXR1cm4gdGhpcy5wcm9wcy5hZGRTaW5nbGVDb21tZW50KFxuICAgICAgYm9keSwgdGhyZWFkLmlkLCBsYXN0Q29tbWVudC5pZCwgbGFzdENvbW1lbnQucGF0aCwgbGFzdENvbW1lbnQucG9zaXRpb24sIHtkaWRTdWJtaXRDb21tZW50LCBkaWRGYWlsQ29tbWVudH0sXG4gICAgKTtcbiAgfVxuXG4gIHN1Ym1pdEN1cnJlbnRDb21tZW50ID0gZXZ0ID0+IHtcbiAgICBjb25zdCB0aHJlYWRJRCA9IGV2dC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQudGhyZWFkSWQ7XG4gICAgLyogaXN0YW5idWwgaWdub3JlIGlmICovXG4gICAgaWYgKCF0aHJlYWRJRCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgY29uc3Qge3RocmVhZCwgY29tbWVudHN9ID0gdGhpcy5wcm9wcy5jb21tZW50VGhyZWFkcy5maW5kKGVhY2ggPT4gZWFjaC50aHJlYWQuaWQgPT09IHRocmVhZElEKTtcbiAgICBjb25zdCByZXBseUhvbGRlciA9IHRoaXMucmVwbHlIb2xkZXJzLmdldCh0aHJlYWRJRCk7XG5cbiAgICByZXR1cm4gdGhpcy5zdWJtaXRSZXBseShyZXBseUhvbGRlciwgdGhyZWFkLCBjb21tZW50c1tjb21tZW50cy5sZW5ndGggLSAxXSk7XG4gIH1cblxuICBnZXRUcmFuc2xhdGVkUG9zaXRpb24ocm9vdENvbW1lbnQpIHtcbiAgICBsZXQgbGluZU51bWJlciwgcG9zaXRpb25UZXh0O1xuICAgIGNvbnN0IHRyYW5zbGF0aW9ucyA9IHRoaXMucHJvcHMuY29tbWVudFRyYW5zbGF0aW9ucztcblxuICAgIGNvbnN0IGlzQ2hlY2tlZE91dFB1bGxSZXF1ZXN0ID0gdGhpcy5wcm9wcy5jaGVja291dE9wLndoeSgpID09PSBjaGVja291dFN0YXRlcy5DVVJSRU5UO1xuICAgIGlmICh0cmFuc2xhdGlvbnMgPT09IG51bGwpIHtcbiAgICAgIGxpbmVOdW1iZXIgPSBudWxsO1xuICAgICAgcG9zaXRpb25UZXh0ID0gJyc7XG4gICAgfSBlbHNlIGlmIChyb290Q29tbWVudC5wb3NpdGlvbiA9PT0gbnVsbCkge1xuICAgICAgbGluZU51bWJlciA9IG51bGw7XG4gICAgICBwb3NpdGlvblRleHQgPSAnb3V0ZGF0ZWQnO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb25zdCB0cmFuc2xhdGlvbnNGb3JGaWxlID0gdHJhbnNsYXRpb25zLmdldChwYXRoLm5vcm1hbGl6ZShyb290Q29tbWVudC5wYXRoKSk7XG4gICAgICBsaW5lTnVtYmVyID0gdHJhbnNsYXRpb25zRm9yRmlsZS5kaWZmVG9GaWxlUG9zaXRpb24uZ2V0KHBhcnNlSW50KHJvb3RDb21tZW50LnBvc2l0aW9uLCAxMCkpO1xuICAgICAgaWYgKHRyYW5zbGF0aW9uc0ZvckZpbGUuZmlsZVRyYW5zbGF0aW9ucyAmJiBpc0NoZWNrZWRPdXRQdWxsUmVxdWVzdCkge1xuICAgICAgICBsaW5lTnVtYmVyID0gdHJhbnNsYXRpb25zRm9yRmlsZS5maWxlVHJhbnNsYXRpb25zLmdldChsaW5lTnVtYmVyKS5uZXdQb3NpdGlvbjtcbiAgICAgIH1cbiAgICAgIHBvc2l0aW9uVGV4dCA9IGxpbmVOdW1iZXI7XG4gICAgfVxuXG4gICAgcmV0dXJuIHtsaW5lTnVtYmVyLCBwb3NpdGlvblRleHR9O1xuICB9XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgc2Nyb2xsVG9UaHJlYWQodGhyZWFkSUQpIHtcbiAgICBjb25zdCB0aHJlYWRIb2xkZXIgPSB0aGlzLnRocmVhZEhvbGRlcnMuZ2V0KHRocmVhZElEKTtcbiAgICBpZiAodGhyZWFkSG9sZGVyKSB7XG4gICAgICB0aHJlYWRIb2xkZXIubWFwKGVsZW1lbnQgPT4ge1xuICAgICAgICBlbGVtZW50LnNjcm9sbEludG9WaWV3SWZOZWVkZWQoKTtcbiAgICAgICAgcmV0dXJuIG51bGw7IC8vIHNoaCwgZXNsaW50XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBhc3luYyByZXNvbHZlVW5yZXNvbHZlVGhyZWFkKHRocmVhZCkge1xuICAgIGlmICh0aHJlYWQuaXNSZXNvbHZlZCkge1xuICAgICAgYXdhaXQgdGhpcy5wcm9wcy51bnJlc29sdmVUaHJlYWQodGhyZWFkKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgdGhpcy5wcm9wcy5yZXNvbHZlVGhyZWFkKHRocmVhZCk7XG4gICAgfVxuICB9XG59XG4iXX0=