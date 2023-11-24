"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.BarePullRequestCheckoutController = exports.checkoutStates = void 0;

var _react = _interopRequireDefault(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _reactRelay = require("react-relay");

var _enableableOperation = _interopRequireDefault(require("../models/enableable-operation"));

var _gitShellOutStrategy = require("../git-shell-out-strategy");

var _propTypes2 = require("../prop-types");

var _reporterProxy = require("../reporter-proxy");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class CheckoutState {
  constructor(name) {
    this.name = name;
  }

  when(cases) {
    return cases[this.name] || cases.default;
  }

}

const checkoutStates = {
  HIDDEN: new CheckoutState('hidden'),
  DISABLED: new CheckoutState('disabled'),
  BUSY: new CheckoutState('busy'),
  CURRENT: new CheckoutState('current')
};
exports.checkoutStates = checkoutStates;

class BarePullRequestCheckoutController extends _react.default.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkoutInProgress: false
    };
    this.checkoutOp = new _enableableOperation.default(() => this.checkout().catch(e => {
      if (!(e instanceof _gitShellOutStrategy.GitError)) {
        throw e;
      }
    }));
    this.checkoutOp.toggleState(this, 'checkoutInProgress');
  }

  render() {
    return this.props.children(this.nextCheckoutOp());
  }

  nextCheckoutOp() {
    const {
      repository,
      pullRequest
    } = this.props;

    if (this.props.isAbsent) {
      return this.checkoutOp.disable(checkoutStates.HIDDEN, 'No repository found');
    }

    if (this.props.isLoading) {
      return this.checkoutOp.disable(checkoutStates.DISABLED, 'Loading');
    }

    if (!this.props.isPresent) {
      return this.checkoutOp.disable(checkoutStates.DISABLED, 'No repository found');
    }

    if (this.props.isMerging) {
      return this.checkoutOp.disable(checkoutStates.DISABLED, 'Merge in progress');
    }

    if (this.props.isRebasing) {
      return this.checkoutOp.disable(checkoutStates.DISABLED, 'Rebase in progress');
    }

    if (this.state.checkoutInProgress) {
      return this.checkoutOp.disable(checkoutStates.DISABLED, 'Checking out...');
    } // determine if pullRequest.headRepository is null
    // this can happen if a repository has been deleted.


    if (!pullRequest.headRepository) {
      return this.checkoutOp.disable(checkoutStates.DISABLED, 'Pull request head repository does not exist');
    } // Determine if we already have this PR checked out.


    const headPush = this.props.branches.getHeadBranch().getPush();
    const headRemote = this.props.remotes.withName(headPush.getRemoteName()); // (detect checkout from pull/### refspec)

    const fromPullRefspec = headRemote.getOwner() === repository.owner.login && headRemote.getRepo() === repository.name && headPush.getShortRemoteRef() === `pull/${pullRequest.number}/head`; // (detect checkout from head repository)

    const fromHeadRepo = headRemote.getOwner() === pullRequest.headRepository.owner.login && headRemote.getRepo() === pullRequest.headRepository.name && headPush.getShortRemoteRef() === pullRequest.headRefName;

    if (fromPullRefspec || fromHeadRepo) {
      return this.checkoutOp.disable(checkoutStates.CURRENT, 'Current');
    }

    return this.checkoutOp.enable();
  }

  async checkout() {
    const {
      pullRequest
    } = this.props;
    const {
      headRepository
    } = pullRequest;
    const fullHeadRef = `refs/heads/${pullRequest.headRefName}`;
    let sourceRemoteName, localRefName; // Discover or create a remote pointing to the repo containing the pull request's head ref.
    // If the local repository already has the head repository specified as a remote, that remote will be used, so
    // that any related configuration is picked up for the fetch. Otherwise, the head repository fetch URL is used
    // directly.

    const headRemotes = this.props.remotes.matchingGitHubRepository(headRepository.owner.login, headRepository.name);

    if (headRemotes.length > 0) {
      sourceRemoteName = headRemotes[0].getName();
    } else {
      const url = {
        https: headRepository.url + '.git',
        ssh: headRepository.sshUrl
      }[this.props.remotes.mostUsedProtocol(['https', 'ssh'])]; // This will throw if a remote with this name already exists (and points somewhere else, or we would have found
      // it above). ¯\_(ツ)_/¯

      const remote = await this.props.localRepository.addRemote(headRepository.owner.login, url);
      sourceRemoteName = remote.getName();
    } // Identify an existing local ref that already corresponds to the pull request, if one exists. Otherwise, generate
    // a new local ref name.


    const pullTargets = this.props.branches.getPullTargets(sourceRemoteName, fullHeadRef);

    if (pullTargets.length > 0) {
      localRefName = pullTargets[0].getName(); // Check out the existing local ref.

      await this.props.localRepository.checkout(localRefName);

      try {
        await this.props.localRepository.pull(fullHeadRef, {
          remoteName: sourceRemoteName,
          ffOnly: true
        });
      } finally {
        (0, _reporterProxy.incrementCounter)('checkout-pr');
      }

      return;
    }

    await this.props.localRepository.fetch(fullHeadRef, {
      remoteName: sourceRemoteName
    }); // Check out the local ref and set it up to track the head ref.

    await this.props.localRepository.checkout(`pr-${pullRequest.number}/${headRepository.owner.login}/${pullRequest.headRefName}`, {
      createNew: true,
      track: true,
      startPoint: `refs/remotes/${sourceRemoteName}/${pullRequest.headRefName}`
    });
    (0, _reporterProxy.incrementCounter)('checkout-pr');
  }

}

exports.BarePullRequestCheckoutController = BarePullRequestCheckoutController;

_defineProperty(BarePullRequestCheckoutController, "propTypes", {
  // GraphQL response
  repository: _propTypes.default.shape({
    name: _propTypes.default.string.isRequired,
    owner: _propTypes.default.shape({
      login: _propTypes.default.string.isRequired
    }).isRequired
  }).isRequired,
  pullRequest: _propTypes.default.shape({
    number: _propTypes.default.number.isRequired,
    headRefName: _propTypes.default.string.isRequired,
    headRepository: _propTypes.default.shape({
      name: _propTypes.default.string.isRequired,
      url: _propTypes.default.string.isRequired,
      sshUrl: _propTypes.default.string.isRequired,
      owner: _propTypes.default.shape({
        login: _propTypes.default.string.isRequired
      })
    })
  }).isRequired,
  // Repository model and attributes
  localRepository: _propTypes.default.object.isRequired,
  isAbsent: _propTypes.default.bool.isRequired,
  isLoading: _propTypes.default.bool.isRequired,
  isPresent: _propTypes.default.bool.isRequired,
  isMerging: _propTypes.default.bool.isRequired,
  isRebasing: _propTypes.default.bool.isRequired,
  branches: _propTypes2.BranchSetPropType.isRequired,
  remotes: _propTypes2.RemoteSetPropType.isRequired,
  children: _propTypes.default.func.isRequired
});

var _default = (0, _reactRelay.createFragmentContainer)(BarePullRequestCheckoutController, {
  repository: function () {
    const node = require("./__generated__/prCheckoutController_repository.graphql");

    if (node.hash && node.hash !== "b2212745240c03ff8fc7cb13dfc63183") {
      console.error("The definition of 'prCheckoutController_repository' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/prCheckoutController_repository.graphql");
  },
  pullRequest: function () {
    const node = require("./__generated__/prCheckoutController_pullRequest.graphql");

    if (node.hash && node.hash !== "66e001f389a2c4f74c1369cf69b31268") {
      console.error("The definition of 'prCheckoutController_pullRequest' appears to have changed. Run `relay-compiler` to update the generated files to receive the expected data.");
    }

    return require("./__generated__/prCheckoutController_pullRequest.graphql");
  }
});

exports.default = _default;