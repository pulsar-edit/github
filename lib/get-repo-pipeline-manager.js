"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;
var _fsExtra = _interopRequireDefault(require("fs-extra"));
var _actionPipeline = _interopRequireDefault(require("./action-pipeline"));
var _gitShellOutStrategy = require("./git-shell-out-strategy");
var _helpers = require("./helpers");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// Note: Middleware that catches errors should re-throw the errors so that they propogate
// and other middleware in the pipeline can be made aware of the errors.
// Ultimately, the views are responsible for catching the errors and handling them accordingly

function _default({
  confirm,
  notificationManager,
  workspace
}) {
  const pipelineManager = new _actionPipeline.default({
    actionNames: ['PUSH', 'PULL', 'FETCH', 'COMMIT', 'CHECKOUT', 'ADDREMOTE']
  });
  const pushPipeline = pipelineManager.getPipeline(pipelineManager.actionKeys.PUSH);
  pushPipeline.addMiddleware('confirm-force-push', async (next, repository, branchName, options) => {
    if (options.force) {
      const choice = confirm({
        message: 'Are you sure you want to force push?',
        detailedMessage: 'This operation could result in losing data on the remote.',
        buttons: ['Force Push', 'Cancel']
      });
      if (choice !== 0) {/* do nothing */} else {
        await next();
      }
    } else {
      await next();
    }
  });
  pushPipeline.addMiddleware('set-push-in-progress', async (next, repository, branchName, options) => {
    repository.getOperationStates().setPushInProgress(true);
    try {
      await next();
    } finally {
      repository.getOperationStates().setPushInProgress(false);
    }
  });
  pushPipeline.addMiddleware('failed-to-push-error', async (next, repository, branchName, options) => {
    try {
      const result = await next();
      return result;
    } catch (error) {
      if (error instanceof _gitShellOutStrategy.GitError) {
        if (/rejected[\s\S]*failed to push/.test(error.stdErr)) {
          notificationManager.addError('Push rejected', {
            description: 'The tip of your current branch is behind its remote counterpart.' + ' Try pulling before pushing.<br />To force push, hold `cmd` or `ctrl` while clicking.',
            dismissable: true
          });
        } else {
          notificationManager.addError('Unable to push', {
            detail: error.stdErr,
            dismissable: true
          });
        }
      }
      throw error;
    }
  });
  const pullPipeline = pipelineManager.getPipeline(pipelineManager.actionKeys.PULL);
  pullPipeline.addMiddleware('set-pull-in-progress', async (next, repository, branchName) => {
    repository.getOperationStates().setPullInProgress(true);
    try {
      await next();
    } finally {
      repository.getOperationStates().setPullInProgress(false);
    }
  });
  pullPipeline.addMiddleware('failed-to-pull-error', async (next, repository, branchName) => {
    try {
      const result = await next();
      return result;
    } catch (error) {
      if (error instanceof _gitShellOutStrategy.GitError) {
        repository.didPullError();
        if (/error: Your local changes to the following files would be overwritten by merge/.test(error.stdErr)) {
          const lines = error.stdErr.split('\n');
          const files = lines.slice(3, lines.length - 3).map(l => `\`${l.trim()}\``).join('\n');
          notificationManager.addError('Pull aborted', {
            description: 'Local changes to the following would be overwritten by merge:<br/>' + files + '<br/>Please commit your changes or stash them before you merge.',
            dismissable: true
          });
        } else if (/Automatic merge failed; fix conflicts and then commit the result./.test(error.stdOut)) {
          notificationManager.addWarning('Merge conflicts', {
            description: `Your local changes conflicted with changes made on the remote branch. Resolve the conflicts
              with the Git panel and commit to continue.`,
            dismissable: true
          });
        } else if (/fatal: Not possible to fast-forward, aborting./.test(error.stdErr)) {
          notificationManager.addWarning('Unmerged changes', {
            description: 'Your local branch has diverged from its remote counterpart.<br/>' + 'Merge or rebase your local work to continue.',
            dismissable: true
          });
        } else {
          notificationManager.addError('Unable to pull', {
            detail: error.stdErr,
            dismissable: true
          });
        }
      }
      throw error;
    }
  });
  const fetchPipeline = pipelineManager.getPipeline(pipelineManager.actionKeys.FETCH);
  fetchPipeline.addMiddleware('set-fetch-in-progress', async (next, repository) => {
    repository.getOperationStates().setFetchInProgress(true);
    try {
      await next();
    } finally {
      repository.getOperationStates().setFetchInProgress(false);
    }
  });
  fetchPipeline.addMiddleware('failed-to-fetch-error', async (next, repository) => {
    try {
      const result = await next();
      return result;
    } catch (error) {
      if (error instanceof _gitShellOutStrategy.GitError) {
        notificationManager.addError('Unable to fetch', {
          detail: error.stdErr,
          dismissable: true
        });
      }
      throw error;
    }
  });
  const checkoutPipeline = pipelineManager.getPipeline(pipelineManager.actionKeys.CHECKOUT);
  checkoutPipeline.addMiddleware('set-checkout-in-progress', async (next, repository, branchName) => {
    repository.getOperationStates().setCheckoutInProgress(true);
    try {
      await next();
    } finally {
      repository.getOperationStates().setCheckoutInProgress(false);
    }
  });
  checkoutPipeline.addMiddleware('failed-to-checkout-error', async (next, repository, branchName, options) => {
    try {
      const result = await next();
      return result;
    } catch (error) {
      if (error instanceof _gitShellOutStrategy.GitError) {
        const message = options.createNew ? 'Cannot create branch' : 'Checkout aborted';
        let detail = undefined;
        let description = undefined;
        if (error.stdErr.match(/local changes.*would be overwritten/)) {
          const files = error.stdErr.split(/\r?\n/).filter(l => l.startsWith('\t')).map(l => `\`${l.trim()}\``).join('<br/>');
          description = 'Local changes to the following would be overwritten:<br/>' + files + '<br/>Please commit your changes or stash them.';
        } else if (error.stdErr.match(/branch.*already exists/)) {
          description = `\`${branchName}\` already exists. Choose another branch name.`;
        } else if (error.stdErr.match(/error: you need to resolve your current index first/)) {
          description = 'You must first resolve merge conflicts.';
        }
        if (description === undefined && detail === undefined) {
          detail = error.stdErr;
        }
        notificationManager.addError(message, {
          description,
          detail,
          dismissable: true
        });
      }
      throw error;
    }
  });
  const commitPipeline = pipelineManager.getPipeline(pipelineManager.actionKeys.COMMIT);
  commitPipeline.addMiddleware('confirm-commit', async (next, repository) => {
    function confirmCommit() {
      const choice = confirm({
        message: 'One or more text editors for the commit message are unsaved.',
        detailedMessage: 'Do you want to commit and close all open commit message editors?',
        buttons: ['Commit', 'Cancel']
      });
      return choice === 0;
    }
    const commitMessageEditors = (0, _helpers.getCommitMessageEditors)(repository, workspace);
    if (commitMessageEditors.length > 0) {
      if (!commitMessageEditors.some(e => e.isModified()) || confirmCommit()) {
        await next();
        commitMessageEditors.forEach(editor => editor.destroy());
      }
    } else {
      await next();
    }
  });
  commitPipeline.addMiddleware('clean-up-disk-commit-msg', async (next, repository) => {
    await next();
    try {
      await _fsExtra.default.remove((0, _helpers.getCommitMessagePath)(repository));
    } catch (error) {
      // do nothing
    }
  });
  commitPipeline.addMiddleware('set-commit-in-progress', async (next, repository) => {
    repository.getOperationStates().setCommitInProgress(true);
    try {
      await next();
    } finally {
      repository.getOperationStates().setCommitInProgress(false);
    }
  });
  commitPipeline.addMiddleware('failed-to-commit-error', async (next, repository) => {
    try {
      const result = await next();
      const template = await repository.fetchCommitMessageTemplate();
      repository.setCommitMessage(template || '');
      (0, _helpers.destroyFilePatchPaneItems)({
        onlyStaged: true
      }, workspace);
      return result;
    } catch (error) {
      if (error instanceof _gitShellOutStrategy.GitError) {
        notificationManager.addError('Unable to commit', {
          detail: error.stdErr,
          dismissable: true
        });
      }
      throw error;
    }
  });
  const addRemotePipeline = pipelineManager.getPipeline(pipelineManager.actionKeys.ADDREMOTE);
  addRemotePipeline.addMiddleware('failed-to-add-remote', async (next, repository, remoteName) => {
    try {
      return await next();
    } catch (error) {
      if (error instanceof _gitShellOutStrategy.GitError) {
        let detail = error.stdErr;
        if (error.stdErr.match(/^fatal: remote .* already exists\./)) {
          detail = `The repository already contains a remote named ${remoteName}.`;
        }
        notificationManager.addError('Cannot create remote', {
          detail,
          dismissable: true
        });
      }
      throw error;
    }
  });
  return pipelineManager;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJjb25maXJtIiwibm90aWZpY2F0aW9uTWFuYWdlciIsIndvcmtzcGFjZSIsInBpcGVsaW5lTWFuYWdlciIsIkFjdGlvblBpcGVsaW5lTWFuYWdlciIsImFjdGlvbk5hbWVzIiwicHVzaFBpcGVsaW5lIiwiZ2V0UGlwZWxpbmUiLCJhY3Rpb25LZXlzIiwiUFVTSCIsImFkZE1pZGRsZXdhcmUiLCJuZXh0IiwicmVwb3NpdG9yeSIsImJyYW5jaE5hbWUiLCJvcHRpb25zIiwiZm9yY2UiLCJjaG9pY2UiLCJtZXNzYWdlIiwiZGV0YWlsZWRNZXNzYWdlIiwiYnV0dG9ucyIsImdldE9wZXJhdGlvblN0YXRlcyIsInNldFB1c2hJblByb2dyZXNzIiwicmVzdWx0IiwiZXJyb3IiLCJHaXRFcnJvciIsInRlc3QiLCJzdGRFcnIiLCJhZGRFcnJvciIsImRlc2NyaXB0aW9uIiwiZGlzbWlzc2FibGUiLCJkZXRhaWwiLCJwdWxsUGlwZWxpbmUiLCJQVUxMIiwic2V0UHVsbEluUHJvZ3Jlc3MiLCJkaWRQdWxsRXJyb3IiLCJsaW5lcyIsInNwbGl0IiwiZmlsZXMiLCJzbGljZSIsImxlbmd0aCIsIm1hcCIsImwiLCJ0cmltIiwiam9pbiIsInN0ZE91dCIsImFkZFdhcm5pbmciLCJmZXRjaFBpcGVsaW5lIiwiRkVUQ0giLCJzZXRGZXRjaEluUHJvZ3Jlc3MiLCJjaGVja291dFBpcGVsaW5lIiwiQ0hFQ0tPVVQiLCJzZXRDaGVja291dEluUHJvZ3Jlc3MiLCJjcmVhdGVOZXciLCJ1bmRlZmluZWQiLCJtYXRjaCIsImZpbHRlciIsInN0YXJ0c1dpdGgiLCJjb21taXRQaXBlbGluZSIsIkNPTU1JVCIsImNvbmZpcm1Db21taXQiLCJjb21taXRNZXNzYWdlRWRpdG9ycyIsImdldENvbW1pdE1lc3NhZ2VFZGl0b3JzIiwic29tZSIsImUiLCJpc01vZGlmaWVkIiwiZm9yRWFjaCIsImVkaXRvciIsImRlc3Ryb3kiLCJmcyIsInJlbW92ZSIsImdldENvbW1pdE1lc3NhZ2VQYXRoIiwic2V0Q29tbWl0SW5Qcm9ncmVzcyIsInRlbXBsYXRlIiwiZmV0Y2hDb21taXRNZXNzYWdlVGVtcGxhdGUiLCJzZXRDb21taXRNZXNzYWdlIiwiZGVzdHJveUZpbGVQYXRjaFBhbmVJdGVtcyIsIm9ubHlTdGFnZWQiLCJhZGRSZW1vdGVQaXBlbGluZSIsIkFERFJFTU9URSIsInJlbW90ZU5hbWUiXSwic291cmNlcyI6WyJnZXQtcmVwby1waXBlbGluZS1tYW5hZ2VyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBmcyBmcm9tICdmcy1leHRyYSc7XG5cbmltcG9ydCBBY3Rpb25QaXBlbGluZU1hbmFnZXIgZnJvbSAnLi9hY3Rpb24tcGlwZWxpbmUnO1xuaW1wb3J0IHtHaXRFcnJvcn0gZnJvbSAnLi9naXQtc2hlbGwtb3V0LXN0cmF0ZWd5JztcbmltcG9ydCB7Z2V0Q29tbWl0TWVzc2FnZVBhdGgsIGdldENvbW1pdE1lc3NhZ2VFZGl0b3JzLCBkZXN0cm95RmlsZVBhdGNoUGFuZUl0ZW1zfSBmcm9tICcuL2hlbHBlcnMnO1xuXG4vLyBOb3RlOiBNaWRkbGV3YXJlIHRoYXQgY2F0Y2hlcyBlcnJvcnMgc2hvdWxkIHJlLXRocm93IHRoZSBlcnJvcnMgc28gdGhhdCB0aGV5IHByb3BvZ2F0ZVxuLy8gYW5kIG90aGVyIG1pZGRsZXdhcmUgaW4gdGhlIHBpcGVsaW5lIGNhbiBiZSBtYWRlIGF3YXJlIG9mIHRoZSBlcnJvcnMuXG4vLyBVbHRpbWF0ZWx5LCB0aGUgdmlld3MgYXJlIHJlc3BvbnNpYmxlIGZvciBjYXRjaGluZyB0aGUgZXJyb3JzIGFuZCBoYW5kbGluZyB0aGVtIGFjY29yZGluZ2x5XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKHtjb25maXJtLCBub3RpZmljYXRpb25NYW5hZ2VyLCB3b3Jrc3BhY2V9KSB7XG4gIGNvbnN0IHBpcGVsaW5lTWFuYWdlciA9IG5ldyBBY3Rpb25QaXBlbGluZU1hbmFnZXIoe1xuICAgIGFjdGlvbk5hbWVzOiBbJ1BVU0gnLCAnUFVMTCcsICdGRVRDSCcsICdDT01NSVQnLCAnQ0hFQ0tPVVQnLCAnQUREUkVNT1RFJ10sXG4gIH0pO1xuXG4gIGNvbnN0IHB1c2hQaXBlbGluZSA9IHBpcGVsaW5lTWFuYWdlci5nZXRQaXBlbGluZShwaXBlbGluZU1hbmFnZXIuYWN0aW9uS2V5cy5QVVNIKTtcbiAgcHVzaFBpcGVsaW5lLmFkZE1pZGRsZXdhcmUoJ2NvbmZpcm0tZm9yY2UtcHVzaCcsIGFzeW5jIChuZXh0LCByZXBvc2l0b3J5LCBicmFuY2hOYW1lLCBvcHRpb25zKSA9PiB7XG4gICAgaWYgKG9wdGlvbnMuZm9yY2UpIHtcbiAgICAgIGNvbnN0IGNob2ljZSA9IGNvbmZpcm0oe1xuICAgICAgICBtZXNzYWdlOiAnQXJlIHlvdSBzdXJlIHlvdSB3YW50IHRvIGZvcmNlIHB1c2g/JyxcbiAgICAgICAgZGV0YWlsZWRNZXNzYWdlOiAnVGhpcyBvcGVyYXRpb24gY291bGQgcmVzdWx0IGluIGxvc2luZyBkYXRhIG9uIHRoZSByZW1vdGUuJyxcbiAgICAgICAgYnV0dG9uczogWydGb3JjZSBQdXNoJywgJ0NhbmNlbCddLFxuICAgICAgfSk7XG4gICAgICBpZiAoY2hvaWNlICE9PSAwKSB7IC8qIGRvIG5vdGhpbmcgKi8gfSBlbHNlIHsgYXdhaXQgbmV4dCgpOyB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGF3YWl0IG5leHQoKTtcbiAgICB9XG4gIH0pO1xuICBwdXNoUGlwZWxpbmUuYWRkTWlkZGxld2FyZSgnc2V0LXB1c2gtaW4tcHJvZ3Jlc3MnLCBhc3luYyAobmV4dCwgcmVwb3NpdG9yeSwgYnJhbmNoTmFtZSwgb3B0aW9ucykgPT4ge1xuICAgIHJlcG9zaXRvcnkuZ2V0T3BlcmF0aW9uU3RhdGVzKCkuc2V0UHVzaEluUHJvZ3Jlc3ModHJ1ZSk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IG5leHQoKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgcmVwb3NpdG9yeS5nZXRPcGVyYXRpb25TdGF0ZXMoKS5zZXRQdXNoSW5Qcm9ncmVzcyhmYWxzZSk7XG4gICAgfVxuICB9KTtcbiAgcHVzaFBpcGVsaW5lLmFkZE1pZGRsZXdhcmUoJ2ZhaWxlZC10by1wdXNoLWVycm9yJywgYXN5bmMgKG5leHQsIHJlcG9zaXRvcnksIGJyYW5jaE5hbWUsIG9wdGlvbnMpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgbmV4dCgpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgR2l0RXJyb3IpIHtcbiAgICAgICAgaWYgKC9yZWplY3RlZFtcXHNcXFNdKmZhaWxlZCB0byBwdXNoLy50ZXN0KGVycm9yLnN0ZEVycikpIHtcbiAgICAgICAgICBub3RpZmljYXRpb25NYW5hZ2VyLmFkZEVycm9yKCdQdXNoIHJlamVjdGVkJywge1xuICAgICAgICAgICAgZGVzY3JpcHRpb246ICdUaGUgdGlwIG9mIHlvdXIgY3VycmVudCBicmFuY2ggaXMgYmVoaW5kIGl0cyByZW1vdGUgY291bnRlcnBhcnQuJyArXG4gICAgICAgICAgICAnIFRyeSBwdWxsaW5nIGJlZm9yZSBwdXNoaW5nLjxiciAvPlRvIGZvcmNlIHB1c2gsIGhvbGQgYGNtZGAgb3IgYGN0cmxgIHdoaWxlIGNsaWNraW5nLicsXG4gICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBub3RpZmljYXRpb25NYW5hZ2VyLmFkZEVycm9yKCdVbmFibGUgdG8gcHVzaCcsIHtcbiAgICAgICAgICAgIGRldGFpbDogZXJyb3Iuc3RkRXJyLFxuICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfSk7XG5cbiAgY29uc3QgcHVsbFBpcGVsaW5lID0gcGlwZWxpbmVNYW5hZ2VyLmdldFBpcGVsaW5lKHBpcGVsaW5lTWFuYWdlci5hY3Rpb25LZXlzLlBVTEwpO1xuICBwdWxsUGlwZWxpbmUuYWRkTWlkZGxld2FyZSgnc2V0LXB1bGwtaW4tcHJvZ3Jlc3MnLCBhc3luYyAobmV4dCwgcmVwb3NpdG9yeSwgYnJhbmNoTmFtZSkgPT4ge1xuICAgIHJlcG9zaXRvcnkuZ2V0T3BlcmF0aW9uU3RhdGVzKCkuc2V0UHVsbEluUHJvZ3Jlc3ModHJ1ZSk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IG5leHQoKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgcmVwb3NpdG9yeS5nZXRPcGVyYXRpb25TdGF0ZXMoKS5zZXRQdWxsSW5Qcm9ncmVzcyhmYWxzZSk7XG4gICAgfVxuICB9KTtcbiAgcHVsbFBpcGVsaW5lLmFkZE1pZGRsZXdhcmUoJ2ZhaWxlZC10by1wdWxsLWVycm9yJywgYXN5bmMgKG5leHQsIHJlcG9zaXRvcnksIGJyYW5jaE5hbWUpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgbmV4dCgpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgR2l0RXJyb3IpIHtcbiAgICAgICAgcmVwb3NpdG9yeS5kaWRQdWxsRXJyb3IoKTtcbiAgICAgICAgaWYgKC9lcnJvcjogWW91ciBsb2NhbCBjaGFuZ2VzIHRvIHRoZSBmb2xsb3dpbmcgZmlsZXMgd291bGQgYmUgb3ZlcndyaXR0ZW4gYnkgbWVyZ2UvLnRlc3QoZXJyb3Iuc3RkRXJyKSkge1xuICAgICAgICAgIGNvbnN0IGxpbmVzID0gZXJyb3Iuc3RkRXJyLnNwbGl0KCdcXG4nKTtcbiAgICAgICAgICBjb25zdCBmaWxlcyA9IGxpbmVzLnNsaWNlKDMsIGxpbmVzLmxlbmd0aCAtIDMpLm1hcChsID0+IGBcXGAke2wudHJpbSgpfVxcYGApLmpvaW4oJ1xcbicpO1xuICAgICAgICAgIG5vdGlmaWNhdGlvbk1hbmFnZXIuYWRkRXJyb3IoJ1B1bGwgYWJvcnRlZCcsIHtcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgICAgICAnTG9jYWwgY2hhbmdlcyB0byB0aGUgZm9sbG93aW5nIHdvdWxkIGJlIG92ZXJ3cml0dGVuIGJ5IG1lcmdlOjxici8+JyArIGZpbGVzICtcbiAgICAgICAgICAgICAgJzxici8+UGxlYXNlIGNvbW1pdCB5b3VyIGNoYW5nZXMgb3Igc3Rhc2ggdGhlbSBiZWZvcmUgeW91IG1lcmdlLicsXG4gICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmICgvQXV0b21hdGljIG1lcmdlIGZhaWxlZDsgZml4IGNvbmZsaWN0cyBhbmQgdGhlbiBjb21taXQgdGhlIHJlc3VsdC4vLnRlc3QoZXJyb3Iuc3RkT3V0KSkge1xuICAgICAgICAgIG5vdGlmaWNhdGlvbk1hbmFnZXIuYWRkV2FybmluZygnTWVyZ2UgY29uZmxpY3RzJywge1xuICAgICAgICAgICAgZGVzY3JpcHRpb246IGBZb3VyIGxvY2FsIGNoYW5nZXMgY29uZmxpY3RlZCB3aXRoIGNoYW5nZXMgbWFkZSBvbiB0aGUgcmVtb3RlIGJyYW5jaC4gUmVzb2x2ZSB0aGUgY29uZmxpY3RzXG4gICAgICAgICAgICAgIHdpdGggdGhlIEdpdCBwYW5lbCBhbmQgY29tbWl0IHRvIGNvbnRpbnVlLmAsXG4gICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIGlmICgvZmF0YWw6IE5vdCBwb3NzaWJsZSB0byBmYXN0LWZvcndhcmQsIGFib3J0aW5nLi8udGVzdChlcnJvci5zdGRFcnIpKSB7XG4gICAgICAgICAgbm90aWZpY2F0aW9uTWFuYWdlci5hZGRXYXJuaW5nKCdVbm1lcmdlZCBjaGFuZ2VzJywge1xuICAgICAgICAgICAgZGVzY3JpcHRpb246XG4gICAgICAgICAgICAgICdZb3VyIGxvY2FsIGJyYW5jaCBoYXMgZGl2ZXJnZWQgZnJvbSBpdHMgcmVtb3RlIGNvdW50ZXJwYXJ0Ljxici8+JyArXG4gICAgICAgICAgICAgICdNZXJnZSBvciByZWJhc2UgeW91ciBsb2NhbCB3b3JrIHRvIGNvbnRpbnVlLicsXG4gICAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBub3RpZmljYXRpb25NYW5hZ2VyLmFkZEVycm9yKCdVbmFibGUgdG8gcHVsbCcsIHtcbiAgICAgICAgICAgIGRldGFpbDogZXJyb3Iuc3RkRXJyLFxuICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfSk7XG5cbiAgY29uc3QgZmV0Y2hQaXBlbGluZSA9IHBpcGVsaW5lTWFuYWdlci5nZXRQaXBlbGluZShwaXBlbGluZU1hbmFnZXIuYWN0aW9uS2V5cy5GRVRDSCk7XG4gIGZldGNoUGlwZWxpbmUuYWRkTWlkZGxld2FyZSgnc2V0LWZldGNoLWluLXByb2dyZXNzJywgYXN5bmMgKG5leHQsIHJlcG9zaXRvcnkpID0+IHtcbiAgICByZXBvc2l0b3J5LmdldE9wZXJhdGlvblN0YXRlcygpLnNldEZldGNoSW5Qcm9ncmVzcyh0cnVlKTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgbmV4dCgpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICByZXBvc2l0b3J5LmdldE9wZXJhdGlvblN0YXRlcygpLnNldEZldGNoSW5Qcm9ncmVzcyhmYWxzZSk7XG4gICAgfVxuICB9KTtcbiAgZmV0Y2hQaXBlbGluZS5hZGRNaWRkbGV3YXJlKCdmYWlsZWQtdG8tZmV0Y2gtZXJyb3InLCBhc3luYyAobmV4dCwgcmVwb3NpdG9yeSkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBuZXh0KCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBHaXRFcnJvcikge1xuICAgICAgICBub3RpZmljYXRpb25NYW5hZ2VyLmFkZEVycm9yKCdVbmFibGUgdG8gZmV0Y2gnLCB7XG4gICAgICAgICAgZGV0YWlsOiBlcnJvci5zdGRFcnIsXG4gICAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9KTtcblxuICBjb25zdCBjaGVja291dFBpcGVsaW5lID0gcGlwZWxpbmVNYW5hZ2VyLmdldFBpcGVsaW5lKHBpcGVsaW5lTWFuYWdlci5hY3Rpb25LZXlzLkNIRUNLT1VUKTtcbiAgY2hlY2tvdXRQaXBlbGluZS5hZGRNaWRkbGV3YXJlKCdzZXQtY2hlY2tvdXQtaW4tcHJvZ3Jlc3MnLCBhc3luYyAobmV4dCwgcmVwb3NpdG9yeSwgYnJhbmNoTmFtZSkgPT4ge1xuICAgIHJlcG9zaXRvcnkuZ2V0T3BlcmF0aW9uU3RhdGVzKCkuc2V0Q2hlY2tvdXRJblByb2dyZXNzKHRydWUpO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBuZXh0KCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHJlcG9zaXRvcnkuZ2V0T3BlcmF0aW9uU3RhdGVzKCkuc2V0Q2hlY2tvdXRJblByb2dyZXNzKGZhbHNlKTtcbiAgICB9XG4gIH0pO1xuICBjaGVja291dFBpcGVsaW5lLmFkZE1pZGRsZXdhcmUoJ2ZhaWxlZC10by1jaGVja291dC1lcnJvcicsIGFzeW5jIChuZXh0LCByZXBvc2l0b3J5LCBicmFuY2hOYW1lLCBvcHRpb25zKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG5leHQoKTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEdpdEVycm9yKSB7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2UgPSBvcHRpb25zLmNyZWF0ZU5ldyA/ICdDYW5ub3QgY3JlYXRlIGJyYW5jaCcgOiAnQ2hlY2tvdXQgYWJvcnRlZCc7XG4gICAgICAgIGxldCBkZXRhaWwgPSB1bmRlZmluZWQ7XG4gICAgICAgIGxldCBkZXNjcmlwdGlvbiA9IHVuZGVmaW5lZDtcblxuICAgICAgICBpZiAoZXJyb3Iuc3RkRXJyLm1hdGNoKC9sb2NhbCBjaGFuZ2VzLip3b3VsZCBiZSBvdmVyd3JpdHRlbi8pKSB7XG4gICAgICAgICAgY29uc3QgZmlsZXMgPSBlcnJvci5zdGRFcnIuc3BsaXQoL1xccj9cXG4vKS5maWx0ZXIobCA9PiBsLnN0YXJ0c1dpdGgoJ1xcdCcpKVxuICAgICAgICAgICAgLm1hcChsID0+IGBcXGAke2wudHJpbSgpfVxcYGApLmpvaW4oJzxici8+Jyk7XG4gICAgICAgICAgZGVzY3JpcHRpb24gPVxuICAgICAgICAgICAgICdMb2NhbCBjaGFuZ2VzIHRvIHRoZSBmb2xsb3dpbmcgd291bGQgYmUgb3ZlcndyaXR0ZW46PGJyLz4nICsgZmlsZXMgK1xuICAgICAgICAgICAgICc8YnIvPlBsZWFzZSBjb21taXQgeW91ciBjaGFuZ2VzIG9yIHN0YXNoIHRoZW0uJztcbiAgICAgICAgfSBlbHNlIGlmIChlcnJvci5zdGRFcnIubWF0Y2goL2JyYW5jaC4qYWxyZWFkeSBleGlzdHMvKSkge1xuICAgICAgICAgIGRlc2NyaXB0aW9uID0gYFxcYCR7YnJhbmNoTmFtZX1cXGAgYWxyZWFkeSBleGlzdHMuIENob29zZSBhbm90aGVyIGJyYW5jaCBuYW1lLmA7XG4gICAgICAgIH0gZWxzZSBpZiAoZXJyb3Iuc3RkRXJyLm1hdGNoKC9lcnJvcjogeW91IG5lZWQgdG8gcmVzb2x2ZSB5b3VyIGN1cnJlbnQgaW5kZXggZmlyc3QvKSkge1xuICAgICAgICAgIGRlc2NyaXB0aW9uID0gJ1lvdSBtdXN0IGZpcnN0IHJlc29sdmUgbWVyZ2UgY29uZmxpY3RzLic7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZGVzY3JpcHRpb24gPT09IHVuZGVmaW5lZCAmJiBkZXRhaWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgIGRldGFpbCA9IGVycm9yLnN0ZEVycjtcbiAgICAgICAgfVxuICAgICAgICBub3RpZmljYXRpb25NYW5hZ2VyLmFkZEVycm9yKG1lc3NhZ2UsIHtkZXNjcmlwdGlvbiwgZGV0YWlsLCBkaXNtaXNzYWJsZTogdHJ1ZX0pO1xuICAgICAgfVxuICAgICAgdGhyb3cgZXJyb3I7XG4gICAgfVxuICB9KTtcblxuICBjb25zdCBjb21taXRQaXBlbGluZSA9IHBpcGVsaW5lTWFuYWdlci5nZXRQaXBlbGluZShwaXBlbGluZU1hbmFnZXIuYWN0aW9uS2V5cy5DT01NSVQpO1xuICBjb21taXRQaXBlbGluZS5hZGRNaWRkbGV3YXJlKCdjb25maXJtLWNvbW1pdCcsIGFzeW5jIChuZXh0LCByZXBvc2l0b3J5KSA9PiB7XG4gICAgZnVuY3Rpb24gY29uZmlybUNvbW1pdCgpIHtcbiAgICAgIGNvbnN0IGNob2ljZSA9IGNvbmZpcm0oe1xuICAgICAgICBtZXNzYWdlOiAnT25lIG9yIG1vcmUgdGV4dCBlZGl0b3JzIGZvciB0aGUgY29tbWl0IG1lc3NhZ2UgYXJlIHVuc2F2ZWQuJyxcbiAgICAgICAgZGV0YWlsZWRNZXNzYWdlOiAnRG8geW91IHdhbnQgdG8gY29tbWl0IGFuZCBjbG9zZSBhbGwgb3BlbiBjb21taXQgbWVzc2FnZSBlZGl0b3JzPycsXG4gICAgICAgIGJ1dHRvbnM6IFsnQ29tbWl0JywgJ0NhbmNlbCddLFxuICAgICAgfSk7XG4gICAgICByZXR1cm4gY2hvaWNlID09PSAwO1xuICAgIH1cblxuICAgIGNvbnN0IGNvbW1pdE1lc3NhZ2VFZGl0b3JzID0gZ2V0Q29tbWl0TWVzc2FnZUVkaXRvcnMocmVwb3NpdG9yeSwgd29ya3NwYWNlKTtcbiAgICBpZiAoY29tbWl0TWVzc2FnZUVkaXRvcnMubGVuZ3RoID4gMCkge1xuICAgICAgaWYgKCFjb21taXRNZXNzYWdlRWRpdG9ycy5zb21lKGUgPT4gZS5pc01vZGlmaWVkKCkpIHx8IGNvbmZpcm1Db21taXQoKSkge1xuICAgICAgICBhd2FpdCBuZXh0KCk7XG4gICAgICAgIGNvbW1pdE1lc3NhZ2VFZGl0b3JzLmZvckVhY2goZWRpdG9yID0+IGVkaXRvci5kZXN0cm95KCkpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBhd2FpdCBuZXh0KCk7XG4gICAgfVxuICB9KTtcbiAgY29tbWl0UGlwZWxpbmUuYWRkTWlkZGxld2FyZSgnY2xlYW4tdXAtZGlzay1jb21taXQtbXNnJywgYXN5bmMgKG5leHQsIHJlcG9zaXRvcnkpID0+IHtcbiAgICBhd2FpdCBuZXh0KCk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IGZzLnJlbW92ZShnZXRDb21taXRNZXNzYWdlUGF0aChyZXBvc2l0b3J5KSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIC8vIGRvIG5vdGhpbmdcbiAgICB9XG4gIH0pO1xuICBjb21taXRQaXBlbGluZS5hZGRNaWRkbGV3YXJlKCdzZXQtY29tbWl0LWluLXByb2dyZXNzJywgYXN5bmMgKG5leHQsIHJlcG9zaXRvcnkpID0+IHtcbiAgICByZXBvc2l0b3J5LmdldE9wZXJhdGlvblN0YXRlcygpLnNldENvbW1pdEluUHJvZ3Jlc3ModHJ1ZSk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IG5leHQoKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgcmVwb3NpdG9yeS5nZXRPcGVyYXRpb25TdGF0ZXMoKS5zZXRDb21taXRJblByb2dyZXNzKGZhbHNlKTtcbiAgICB9XG4gIH0pO1xuICBjb21taXRQaXBlbGluZS5hZGRNaWRkbGV3YXJlKCdmYWlsZWQtdG8tY29tbWl0LWVycm9yJywgYXN5bmMgKG5leHQsIHJlcG9zaXRvcnkpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgbmV4dCgpO1xuICAgICAgY29uc3QgdGVtcGxhdGUgPSBhd2FpdCByZXBvc2l0b3J5LmZldGNoQ29tbWl0TWVzc2FnZVRlbXBsYXRlKCk7XG4gICAgICByZXBvc2l0b3J5LnNldENvbW1pdE1lc3NhZ2UodGVtcGxhdGUgfHwgJycpO1xuICAgICAgZGVzdHJveUZpbGVQYXRjaFBhbmVJdGVtcyh7b25seVN0YWdlZDogdHJ1ZX0sIHdvcmtzcGFjZSk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBHaXRFcnJvcikge1xuICAgICAgICBub3RpZmljYXRpb25NYW5hZ2VyLmFkZEVycm9yKCdVbmFibGUgdG8gY29tbWl0Jywge1xuICAgICAgICAgIGRldGFpbDogZXJyb3Iuc3RkRXJyLFxuICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfSk7XG5cbiAgY29uc3QgYWRkUmVtb3RlUGlwZWxpbmUgPSBwaXBlbGluZU1hbmFnZXIuZ2V0UGlwZWxpbmUocGlwZWxpbmVNYW5hZ2VyLmFjdGlvbktleXMuQUREUkVNT1RFKTtcbiAgYWRkUmVtb3RlUGlwZWxpbmUuYWRkTWlkZGxld2FyZSgnZmFpbGVkLXRvLWFkZC1yZW1vdGUnLCBhc3luYyAobmV4dCwgcmVwb3NpdG9yeSwgcmVtb3RlTmFtZSkgPT4ge1xuICAgIHRyeSB7XG4gICAgICByZXR1cm4gYXdhaXQgbmV4dCgpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBHaXRFcnJvcikge1xuICAgICAgICBsZXQgZGV0YWlsID0gZXJyb3Iuc3RkRXJyO1xuICAgICAgICBpZiAoZXJyb3Iuc3RkRXJyLm1hdGNoKC9eZmF0YWw6IHJlbW90ZSAuKiBhbHJlYWR5IGV4aXN0c1xcLi8pKSB7XG4gICAgICAgICAgZGV0YWlsID0gYFRoZSByZXBvc2l0b3J5IGFscmVhZHkgY29udGFpbnMgYSByZW1vdGUgbmFtZWQgJHtyZW1vdGVOYW1lfS5gO1xuICAgICAgICB9XG4gICAgICAgIG5vdGlmaWNhdGlvbk1hbmFnZXIuYWRkRXJyb3IoJ0Nhbm5vdCBjcmVhdGUgcmVtb3RlJywge1xuICAgICAgICAgIGRldGFpbCxcbiAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgICB9XG5cbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfSk7XG5cbiAgcmV0dXJuIHBpcGVsaW5lTWFuYWdlcjtcbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFFQTtBQUNBO0FBQ0E7QUFBbUc7QUFFbkc7QUFDQTtBQUNBOztBQUVlLGtCQUFTO0VBQUNBLE9BQU87RUFBRUMsbUJBQW1CO0VBQUVDO0FBQVMsQ0FBQyxFQUFFO0VBQ2pFLE1BQU1DLGVBQWUsR0FBRyxJQUFJQyx1QkFBcUIsQ0FBQztJQUNoREMsV0FBVyxFQUFFLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxXQUFXO0VBQzFFLENBQUMsQ0FBQztFQUVGLE1BQU1DLFlBQVksR0FBR0gsZUFBZSxDQUFDSSxXQUFXLENBQUNKLGVBQWUsQ0FBQ0ssVUFBVSxDQUFDQyxJQUFJLENBQUM7RUFDakZILFlBQVksQ0FBQ0ksYUFBYSxDQUFDLG9CQUFvQixFQUFFLE9BQU9DLElBQUksRUFBRUMsVUFBVSxFQUFFQyxVQUFVLEVBQUVDLE9BQU8sS0FBSztJQUNoRyxJQUFJQSxPQUFPLENBQUNDLEtBQUssRUFBRTtNQUNqQixNQUFNQyxNQUFNLEdBQUdoQixPQUFPLENBQUM7UUFDckJpQixPQUFPLEVBQUUsc0NBQXNDO1FBQy9DQyxlQUFlLEVBQUUsMkRBQTJEO1FBQzVFQyxPQUFPLEVBQUUsQ0FBQyxZQUFZLEVBQUUsUUFBUTtNQUNsQyxDQUFDLENBQUM7TUFDRixJQUFJSCxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUUsaUJBQWtCLE1BQU07UUFBRSxNQUFNTCxJQUFJLEVBQUU7TUFBRTtJQUM5RCxDQUFDLE1BQU07TUFDTCxNQUFNQSxJQUFJLEVBQUU7SUFDZDtFQUNGLENBQUMsQ0FBQztFQUNGTCxZQUFZLENBQUNJLGFBQWEsQ0FBQyxzQkFBc0IsRUFBRSxPQUFPQyxJQUFJLEVBQUVDLFVBQVUsRUFBRUMsVUFBVSxFQUFFQyxPQUFPLEtBQUs7SUFDbEdGLFVBQVUsQ0FBQ1Esa0JBQWtCLEVBQUUsQ0FBQ0MsaUJBQWlCLENBQUMsSUFBSSxDQUFDO0lBQ3ZELElBQUk7TUFDRixNQUFNVixJQUFJLEVBQUU7SUFDZCxDQUFDLFNBQVM7TUFDUkMsVUFBVSxDQUFDUSxrQkFBa0IsRUFBRSxDQUFDQyxpQkFBaUIsQ0FBQyxLQUFLLENBQUM7SUFDMUQ7RUFDRixDQUFDLENBQUM7RUFDRmYsWUFBWSxDQUFDSSxhQUFhLENBQUMsc0JBQXNCLEVBQUUsT0FBT0MsSUFBSSxFQUFFQyxVQUFVLEVBQUVDLFVBQVUsRUFBRUMsT0FBTyxLQUFLO0lBQ2xHLElBQUk7TUFDRixNQUFNUSxNQUFNLEdBQUcsTUFBTVgsSUFBSSxFQUFFO01BQzNCLE9BQU9XLE1BQU07SUFDZixDQUFDLENBQUMsT0FBT0MsS0FBSyxFQUFFO01BQ2QsSUFBSUEsS0FBSyxZQUFZQyw2QkFBUSxFQUFFO1FBQzdCLElBQUksK0JBQStCLENBQUNDLElBQUksQ0FBQ0YsS0FBSyxDQUFDRyxNQUFNLENBQUMsRUFBRTtVQUN0RHpCLG1CQUFtQixDQUFDMEIsUUFBUSxDQUFDLGVBQWUsRUFBRTtZQUM1Q0MsV0FBVyxFQUFFLGtFQUFrRSxHQUMvRSx1RkFBdUY7WUFDdkZDLFdBQVcsRUFBRTtVQUNmLENBQUMsQ0FBQztRQUNKLENBQUMsTUFBTTtVQUNMNUIsbUJBQW1CLENBQUMwQixRQUFRLENBQUMsZ0JBQWdCLEVBQUU7WUFDN0NHLE1BQU0sRUFBRVAsS0FBSyxDQUFDRyxNQUFNO1lBQ3BCRyxXQUFXLEVBQUU7VUFDZixDQUFDLENBQUM7UUFDSjtNQUNGO01BQ0EsTUFBTU4sS0FBSztJQUNiO0VBQ0YsQ0FBQyxDQUFDO0VBRUYsTUFBTVEsWUFBWSxHQUFHNUIsZUFBZSxDQUFDSSxXQUFXLENBQUNKLGVBQWUsQ0FBQ0ssVUFBVSxDQUFDd0IsSUFBSSxDQUFDO0VBQ2pGRCxZQUFZLENBQUNyQixhQUFhLENBQUMsc0JBQXNCLEVBQUUsT0FBT0MsSUFBSSxFQUFFQyxVQUFVLEVBQUVDLFVBQVUsS0FBSztJQUN6RkQsVUFBVSxDQUFDUSxrQkFBa0IsRUFBRSxDQUFDYSxpQkFBaUIsQ0FBQyxJQUFJLENBQUM7SUFDdkQsSUFBSTtNQUNGLE1BQU10QixJQUFJLEVBQUU7SUFDZCxDQUFDLFNBQVM7TUFDUkMsVUFBVSxDQUFDUSxrQkFBa0IsRUFBRSxDQUFDYSxpQkFBaUIsQ0FBQyxLQUFLLENBQUM7SUFDMUQ7RUFDRixDQUFDLENBQUM7RUFDRkYsWUFBWSxDQUFDckIsYUFBYSxDQUFDLHNCQUFzQixFQUFFLE9BQU9DLElBQUksRUFBRUMsVUFBVSxFQUFFQyxVQUFVLEtBQUs7SUFDekYsSUFBSTtNQUNGLE1BQU1TLE1BQU0sR0FBRyxNQUFNWCxJQUFJLEVBQUU7TUFDM0IsT0FBT1csTUFBTTtJQUNmLENBQUMsQ0FBQyxPQUFPQyxLQUFLLEVBQUU7TUFDZCxJQUFJQSxLQUFLLFlBQVlDLDZCQUFRLEVBQUU7UUFDN0JaLFVBQVUsQ0FBQ3NCLFlBQVksRUFBRTtRQUN6QixJQUFJLGdGQUFnRixDQUFDVCxJQUFJLENBQUNGLEtBQUssQ0FBQ0csTUFBTSxDQUFDLEVBQUU7VUFDdkcsTUFBTVMsS0FBSyxHQUFHWixLQUFLLENBQUNHLE1BQU0sQ0FBQ1UsS0FBSyxDQUFDLElBQUksQ0FBQztVQUN0QyxNQUFNQyxLQUFLLEdBQUdGLEtBQUssQ0FBQ0csS0FBSyxDQUFDLENBQUMsRUFBRUgsS0FBSyxDQUFDSSxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUNDLEdBQUcsQ0FBQ0MsQ0FBQyxJQUFLLEtBQUlBLENBQUMsQ0FBQ0MsSUFBSSxFQUFHLElBQUcsQ0FBQyxDQUFDQyxJQUFJLENBQUMsSUFBSSxDQUFDO1VBQ3JGMUMsbUJBQW1CLENBQUMwQixRQUFRLENBQUMsY0FBYyxFQUFFO1lBQzNDQyxXQUFXLEVBQ1Qsb0VBQW9FLEdBQUdTLEtBQUssR0FDNUUsaUVBQWlFO1lBQ25FUixXQUFXLEVBQUU7VUFDZixDQUFDLENBQUM7UUFDSixDQUFDLE1BQU0sSUFBSSxtRUFBbUUsQ0FBQ0osSUFBSSxDQUFDRixLQUFLLENBQUNxQixNQUFNLENBQUMsRUFBRTtVQUNqRzNDLG1CQUFtQixDQUFDNEMsVUFBVSxDQUFDLGlCQUFpQixFQUFFO1lBQ2hEakIsV0FBVyxFQUFHO0FBQzFCLHlEQUF5RDtZQUM3Q0MsV0FBVyxFQUFFO1VBQ2YsQ0FBQyxDQUFDO1FBQ0osQ0FBQyxNQUFNLElBQUksZ0RBQWdELENBQUNKLElBQUksQ0FBQ0YsS0FBSyxDQUFDRyxNQUFNLENBQUMsRUFBRTtVQUM5RXpCLG1CQUFtQixDQUFDNEMsVUFBVSxDQUFDLGtCQUFrQixFQUFFO1lBQ2pEakIsV0FBVyxFQUNULGtFQUFrRSxHQUNsRSw4Q0FBOEM7WUFDaERDLFdBQVcsRUFBRTtVQUNmLENBQUMsQ0FBQztRQUNKLENBQUMsTUFBTTtVQUNMNUIsbUJBQW1CLENBQUMwQixRQUFRLENBQUMsZ0JBQWdCLEVBQUU7WUFDN0NHLE1BQU0sRUFBRVAsS0FBSyxDQUFDRyxNQUFNO1lBQ3BCRyxXQUFXLEVBQUU7VUFDZixDQUFDLENBQUM7UUFDSjtNQUNGO01BQ0EsTUFBTU4sS0FBSztJQUNiO0VBQ0YsQ0FBQyxDQUFDO0VBRUYsTUFBTXVCLGFBQWEsR0FBRzNDLGVBQWUsQ0FBQ0ksV0FBVyxDQUFDSixlQUFlLENBQUNLLFVBQVUsQ0FBQ3VDLEtBQUssQ0FBQztFQUNuRkQsYUFBYSxDQUFDcEMsYUFBYSxDQUFDLHVCQUF1QixFQUFFLE9BQU9DLElBQUksRUFBRUMsVUFBVSxLQUFLO0lBQy9FQSxVQUFVLENBQUNRLGtCQUFrQixFQUFFLENBQUM0QixrQkFBa0IsQ0FBQyxJQUFJLENBQUM7SUFDeEQsSUFBSTtNQUNGLE1BQU1yQyxJQUFJLEVBQUU7SUFDZCxDQUFDLFNBQVM7TUFDUkMsVUFBVSxDQUFDUSxrQkFBa0IsRUFBRSxDQUFDNEIsa0JBQWtCLENBQUMsS0FBSyxDQUFDO0lBQzNEO0VBQ0YsQ0FBQyxDQUFDO0VBQ0ZGLGFBQWEsQ0FBQ3BDLGFBQWEsQ0FBQyx1QkFBdUIsRUFBRSxPQUFPQyxJQUFJLEVBQUVDLFVBQVUsS0FBSztJQUMvRSxJQUFJO01BQ0YsTUFBTVUsTUFBTSxHQUFHLE1BQU1YLElBQUksRUFBRTtNQUMzQixPQUFPVyxNQUFNO0lBQ2YsQ0FBQyxDQUFDLE9BQU9DLEtBQUssRUFBRTtNQUNkLElBQUlBLEtBQUssWUFBWUMsNkJBQVEsRUFBRTtRQUM3QnZCLG1CQUFtQixDQUFDMEIsUUFBUSxDQUFDLGlCQUFpQixFQUFFO1VBQzlDRyxNQUFNLEVBQUVQLEtBQUssQ0FBQ0csTUFBTTtVQUNwQkcsV0FBVyxFQUFFO1FBQ2YsQ0FBQyxDQUFDO01BQ0o7TUFDQSxNQUFNTixLQUFLO0lBQ2I7RUFDRixDQUFDLENBQUM7RUFFRixNQUFNMEIsZ0JBQWdCLEdBQUc5QyxlQUFlLENBQUNJLFdBQVcsQ0FBQ0osZUFBZSxDQUFDSyxVQUFVLENBQUMwQyxRQUFRLENBQUM7RUFDekZELGdCQUFnQixDQUFDdkMsYUFBYSxDQUFDLDBCQUEwQixFQUFFLE9BQU9DLElBQUksRUFBRUMsVUFBVSxFQUFFQyxVQUFVLEtBQUs7SUFDakdELFVBQVUsQ0FBQ1Esa0JBQWtCLEVBQUUsQ0FBQytCLHFCQUFxQixDQUFDLElBQUksQ0FBQztJQUMzRCxJQUFJO01BQ0YsTUFBTXhDLElBQUksRUFBRTtJQUNkLENBQUMsU0FBUztNQUNSQyxVQUFVLENBQUNRLGtCQUFrQixFQUFFLENBQUMrQixxQkFBcUIsQ0FBQyxLQUFLLENBQUM7SUFDOUQ7RUFDRixDQUFDLENBQUM7RUFDRkYsZ0JBQWdCLENBQUN2QyxhQUFhLENBQUMsMEJBQTBCLEVBQUUsT0FBT0MsSUFBSSxFQUFFQyxVQUFVLEVBQUVDLFVBQVUsRUFBRUMsT0FBTyxLQUFLO0lBQzFHLElBQUk7TUFDRixNQUFNUSxNQUFNLEdBQUcsTUFBTVgsSUFBSSxFQUFFO01BQzNCLE9BQU9XLE1BQU07SUFDZixDQUFDLENBQUMsT0FBT0MsS0FBSyxFQUFFO01BQ2QsSUFBSUEsS0FBSyxZQUFZQyw2QkFBUSxFQUFFO1FBQzdCLE1BQU1QLE9BQU8sR0FBR0gsT0FBTyxDQUFDc0MsU0FBUyxHQUFHLHNCQUFzQixHQUFHLGtCQUFrQjtRQUMvRSxJQUFJdEIsTUFBTSxHQUFHdUIsU0FBUztRQUN0QixJQUFJekIsV0FBVyxHQUFHeUIsU0FBUztRQUUzQixJQUFJOUIsS0FBSyxDQUFDRyxNQUFNLENBQUM0QixLQUFLLENBQUMscUNBQXFDLENBQUMsRUFBRTtVQUM3RCxNQUFNakIsS0FBSyxHQUFHZCxLQUFLLENBQUNHLE1BQU0sQ0FBQ1UsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDbUIsTUFBTSxDQUFDZCxDQUFDLElBQUlBLENBQUMsQ0FBQ2UsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQ3RFaEIsR0FBRyxDQUFDQyxDQUFDLElBQUssS0FBSUEsQ0FBQyxDQUFDQyxJQUFJLEVBQUcsSUFBRyxDQUFDLENBQUNDLElBQUksQ0FBQyxPQUFPLENBQUM7VUFDNUNmLFdBQVcsR0FDUiwyREFBMkQsR0FBR1MsS0FBSyxHQUNuRSxnREFBZ0Q7UUFDckQsQ0FBQyxNQUFNLElBQUlkLEtBQUssQ0FBQ0csTUFBTSxDQUFDNEIsS0FBSyxDQUFDLHdCQUF3QixDQUFDLEVBQUU7VUFDdkQxQixXQUFXLEdBQUksS0FBSWYsVUFBVyxnREFBK0M7UUFDL0UsQ0FBQyxNQUFNLElBQUlVLEtBQUssQ0FBQ0csTUFBTSxDQUFDNEIsS0FBSyxDQUFDLHFEQUFxRCxDQUFDLEVBQUU7VUFDcEYxQixXQUFXLEdBQUcseUNBQXlDO1FBQ3pEO1FBRUEsSUFBSUEsV0FBVyxLQUFLeUIsU0FBUyxJQUFJdkIsTUFBTSxLQUFLdUIsU0FBUyxFQUFFO1VBQ3JEdkIsTUFBTSxHQUFHUCxLQUFLLENBQUNHLE1BQU07UUFDdkI7UUFDQXpCLG1CQUFtQixDQUFDMEIsUUFBUSxDQUFDVixPQUFPLEVBQUU7VUFBQ1csV0FBVztVQUFFRSxNQUFNO1VBQUVELFdBQVcsRUFBRTtRQUFJLENBQUMsQ0FBQztNQUNqRjtNQUNBLE1BQU1OLEtBQUs7SUFDYjtFQUNGLENBQUMsQ0FBQztFQUVGLE1BQU1rQyxjQUFjLEdBQUd0RCxlQUFlLENBQUNJLFdBQVcsQ0FBQ0osZUFBZSxDQUFDSyxVQUFVLENBQUNrRCxNQUFNLENBQUM7RUFDckZELGNBQWMsQ0FBQy9DLGFBQWEsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPQyxJQUFJLEVBQUVDLFVBQVUsS0FBSztJQUN6RSxTQUFTK0MsYUFBYSxHQUFHO01BQ3ZCLE1BQU0zQyxNQUFNLEdBQUdoQixPQUFPLENBQUM7UUFDckJpQixPQUFPLEVBQUUsOERBQThEO1FBQ3ZFQyxlQUFlLEVBQUUsa0VBQWtFO1FBQ25GQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLEVBQUUsUUFBUTtNQUM5QixDQUFDLENBQUM7TUFDRixPQUFPSCxNQUFNLEtBQUssQ0FBQztJQUNyQjtJQUVBLE1BQU00QyxvQkFBb0IsR0FBRyxJQUFBQyxnQ0FBdUIsRUFBQ2pELFVBQVUsRUFBRVYsU0FBUyxDQUFDO0lBQzNFLElBQUkwRCxvQkFBb0IsQ0FBQ3JCLE1BQU0sR0FBRyxDQUFDLEVBQUU7TUFDbkMsSUFBSSxDQUFDcUIsb0JBQW9CLENBQUNFLElBQUksQ0FBQ0MsQ0FBQyxJQUFJQSxDQUFDLENBQUNDLFVBQVUsRUFBRSxDQUFDLElBQUlMLGFBQWEsRUFBRSxFQUFFO1FBQ3RFLE1BQU1oRCxJQUFJLEVBQUU7UUFDWmlELG9CQUFvQixDQUFDSyxPQUFPLENBQUNDLE1BQU0sSUFBSUEsTUFBTSxDQUFDQyxPQUFPLEVBQUUsQ0FBQztNQUMxRDtJQUNGLENBQUMsTUFBTTtNQUNMLE1BQU14RCxJQUFJLEVBQUU7SUFDZDtFQUNGLENBQUMsQ0FBQztFQUNGOEMsY0FBYyxDQUFDL0MsYUFBYSxDQUFDLDBCQUEwQixFQUFFLE9BQU9DLElBQUksRUFBRUMsVUFBVSxLQUFLO0lBQ25GLE1BQU1ELElBQUksRUFBRTtJQUNaLElBQUk7TUFDRixNQUFNeUQsZ0JBQUUsQ0FBQ0MsTUFBTSxDQUFDLElBQUFDLDZCQUFvQixFQUFDMUQsVUFBVSxDQUFDLENBQUM7SUFDbkQsQ0FBQyxDQUFDLE9BQU9XLEtBQUssRUFBRTtNQUNkO0lBQUE7RUFFSixDQUFDLENBQUM7RUFDRmtDLGNBQWMsQ0FBQy9DLGFBQWEsQ0FBQyx3QkFBd0IsRUFBRSxPQUFPQyxJQUFJLEVBQUVDLFVBQVUsS0FBSztJQUNqRkEsVUFBVSxDQUFDUSxrQkFBa0IsRUFBRSxDQUFDbUQsbUJBQW1CLENBQUMsSUFBSSxDQUFDO0lBQ3pELElBQUk7TUFDRixNQUFNNUQsSUFBSSxFQUFFO0lBQ2QsQ0FBQyxTQUFTO01BQ1JDLFVBQVUsQ0FBQ1Esa0JBQWtCLEVBQUUsQ0FBQ21ELG1CQUFtQixDQUFDLEtBQUssQ0FBQztJQUM1RDtFQUNGLENBQUMsQ0FBQztFQUNGZCxjQUFjLENBQUMvQyxhQUFhLENBQUMsd0JBQXdCLEVBQUUsT0FBT0MsSUFBSSxFQUFFQyxVQUFVLEtBQUs7SUFDakYsSUFBSTtNQUNGLE1BQU1VLE1BQU0sR0FBRyxNQUFNWCxJQUFJLEVBQUU7TUFDM0IsTUFBTTZELFFBQVEsR0FBRyxNQUFNNUQsVUFBVSxDQUFDNkQsMEJBQTBCLEVBQUU7TUFDOUQ3RCxVQUFVLENBQUM4RCxnQkFBZ0IsQ0FBQ0YsUUFBUSxJQUFJLEVBQUUsQ0FBQztNQUMzQyxJQUFBRyxrQ0FBeUIsRUFBQztRQUFDQyxVQUFVLEVBQUU7TUFBSSxDQUFDLEVBQUUxRSxTQUFTLENBQUM7TUFDeEQsT0FBT29CLE1BQU07SUFDZixDQUFDLENBQUMsT0FBT0MsS0FBSyxFQUFFO01BQ2QsSUFBSUEsS0FBSyxZQUFZQyw2QkFBUSxFQUFFO1FBQzdCdkIsbUJBQW1CLENBQUMwQixRQUFRLENBQUMsa0JBQWtCLEVBQUU7VUFDL0NHLE1BQU0sRUFBRVAsS0FBSyxDQUFDRyxNQUFNO1VBQ3BCRyxXQUFXLEVBQUU7UUFDZixDQUFDLENBQUM7TUFDSjtNQUNBLE1BQU1OLEtBQUs7SUFDYjtFQUNGLENBQUMsQ0FBQztFQUVGLE1BQU1zRCxpQkFBaUIsR0FBRzFFLGVBQWUsQ0FBQ0ksV0FBVyxDQUFDSixlQUFlLENBQUNLLFVBQVUsQ0FBQ3NFLFNBQVMsQ0FBQztFQUMzRkQsaUJBQWlCLENBQUNuRSxhQUFhLENBQUMsc0JBQXNCLEVBQUUsT0FBT0MsSUFBSSxFQUFFQyxVQUFVLEVBQUVtRSxVQUFVLEtBQUs7SUFDOUYsSUFBSTtNQUNGLE9BQU8sTUFBTXBFLElBQUksRUFBRTtJQUNyQixDQUFDLENBQUMsT0FBT1ksS0FBSyxFQUFFO01BQ2QsSUFBSUEsS0FBSyxZQUFZQyw2QkFBUSxFQUFFO1FBQzdCLElBQUlNLE1BQU0sR0FBR1AsS0FBSyxDQUFDRyxNQUFNO1FBQ3pCLElBQUlILEtBQUssQ0FBQ0csTUFBTSxDQUFDNEIsS0FBSyxDQUFDLG9DQUFvQyxDQUFDLEVBQUU7VUFDNUR4QixNQUFNLEdBQUksa0RBQWlEaUQsVUFBVyxHQUFFO1FBQzFFO1FBQ0E5RSxtQkFBbUIsQ0FBQzBCLFFBQVEsQ0FBQyxzQkFBc0IsRUFBRTtVQUNuREcsTUFBTTtVQUNORCxXQUFXLEVBQUU7UUFDZixDQUFDLENBQUM7TUFDSjtNQUVBLE1BQU1OLEtBQUs7SUFDYjtFQUNGLENBQUMsQ0FBQztFQUVGLE9BQU9wQixlQUFlO0FBQ3hCIn0=