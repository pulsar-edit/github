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

      if (choice !== 0) {
        /* do nothing */
      } else {
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
    } catch (error) {// do nothing
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9nZXQtcmVwby1waXBlbGluZS1tYW5hZ2VyLmpzIl0sIm5hbWVzIjpbImNvbmZpcm0iLCJub3RpZmljYXRpb25NYW5hZ2VyIiwid29ya3NwYWNlIiwicGlwZWxpbmVNYW5hZ2VyIiwiQWN0aW9uUGlwZWxpbmVNYW5hZ2VyIiwiYWN0aW9uTmFtZXMiLCJwdXNoUGlwZWxpbmUiLCJnZXRQaXBlbGluZSIsImFjdGlvbktleXMiLCJQVVNIIiwiYWRkTWlkZGxld2FyZSIsIm5leHQiLCJyZXBvc2l0b3J5IiwiYnJhbmNoTmFtZSIsIm9wdGlvbnMiLCJmb3JjZSIsImNob2ljZSIsIm1lc3NhZ2UiLCJkZXRhaWxlZE1lc3NhZ2UiLCJidXR0b25zIiwiZ2V0T3BlcmF0aW9uU3RhdGVzIiwic2V0UHVzaEluUHJvZ3Jlc3MiLCJyZXN1bHQiLCJlcnJvciIsIkdpdEVycm9yIiwidGVzdCIsInN0ZEVyciIsImFkZEVycm9yIiwiZGVzY3JpcHRpb24iLCJkaXNtaXNzYWJsZSIsImRldGFpbCIsInB1bGxQaXBlbGluZSIsIlBVTEwiLCJzZXRQdWxsSW5Qcm9ncmVzcyIsImRpZFB1bGxFcnJvciIsImxpbmVzIiwic3BsaXQiLCJmaWxlcyIsInNsaWNlIiwibGVuZ3RoIiwibWFwIiwibCIsInRyaW0iLCJqb2luIiwic3RkT3V0IiwiYWRkV2FybmluZyIsImZldGNoUGlwZWxpbmUiLCJGRVRDSCIsInNldEZldGNoSW5Qcm9ncmVzcyIsImNoZWNrb3V0UGlwZWxpbmUiLCJDSEVDS09VVCIsInNldENoZWNrb3V0SW5Qcm9ncmVzcyIsImNyZWF0ZU5ldyIsInVuZGVmaW5lZCIsIm1hdGNoIiwiZmlsdGVyIiwic3RhcnRzV2l0aCIsImNvbW1pdFBpcGVsaW5lIiwiQ09NTUlUIiwiY29uZmlybUNvbW1pdCIsImNvbW1pdE1lc3NhZ2VFZGl0b3JzIiwic29tZSIsImUiLCJpc01vZGlmaWVkIiwiZm9yRWFjaCIsImVkaXRvciIsImRlc3Ryb3kiLCJmcyIsInJlbW92ZSIsInNldENvbW1pdEluUHJvZ3Jlc3MiLCJ0ZW1wbGF0ZSIsImZldGNoQ29tbWl0TWVzc2FnZVRlbXBsYXRlIiwic2V0Q29tbWl0TWVzc2FnZSIsIm9ubHlTdGFnZWQiLCJhZGRSZW1vdGVQaXBlbGluZSIsIkFERFJFTU9URSIsInJlbW90ZU5hbWUiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFFQTs7QUFDQTs7QUFDQTs7OztBQUVBO0FBQ0E7QUFDQTtBQUVlLGtCQUFTO0FBQUNBLEVBQUFBLE9BQUQ7QUFBVUMsRUFBQUEsbUJBQVY7QUFBK0JDLEVBQUFBO0FBQS9CLENBQVQsRUFBb0Q7QUFDakUsUUFBTUMsZUFBZSxHQUFHLElBQUlDLHVCQUFKLENBQTBCO0FBQ2hEQyxJQUFBQSxXQUFXLEVBQUUsQ0FBQyxNQUFELEVBQVMsTUFBVCxFQUFpQixPQUFqQixFQUEwQixRQUExQixFQUFvQyxVQUFwQyxFQUFnRCxXQUFoRDtBQURtQyxHQUExQixDQUF4QjtBQUlBLFFBQU1DLFlBQVksR0FBR0gsZUFBZSxDQUFDSSxXQUFoQixDQUE0QkosZUFBZSxDQUFDSyxVQUFoQixDQUEyQkMsSUFBdkQsQ0FBckI7QUFDQUgsRUFBQUEsWUFBWSxDQUFDSSxhQUFiLENBQTJCLG9CQUEzQixFQUFpRCxPQUFPQyxJQUFQLEVBQWFDLFVBQWIsRUFBeUJDLFVBQXpCLEVBQXFDQyxPQUFyQyxLQUFpRDtBQUNoRyxRQUFJQSxPQUFPLENBQUNDLEtBQVosRUFBbUI7QUFDakIsWUFBTUMsTUFBTSxHQUFHaEIsT0FBTyxDQUFDO0FBQ3JCaUIsUUFBQUEsT0FBTyxFQUFFLHNDQURZO0FBRXJCQyxRQUFBQSxlQUFlLEVBQUUsMkRBRkk7QUFHckJDLFFBQUFBLE9BQU8sRUFBRSxDQUFDLFlBQUQsRUFBZSxRQUFmO0FBSFksT0FBRCxDQUF0Qjs7QUFLQSxVQUFJSCxNQUFNLEtBQUssQ0FBZixFQUFrQjtBQUFFO0FBQWtCLE9BQXRDLE1BQTRDO0FBQUUsY0FBTUwsSUFBSSxFQUFWO0FBQWU7QUFDOUQsS0FQRCxNQU9PO0FBQ0wsWUFBTUEs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UCxFQUFjO0FBQ2QsVUFBSUEsS0FBSyxZQUFZQyw2QkFBckIsRUFBK0I7QUFDN0J2QixRQUFBQSxtQkFBbUIsQ0FBQzBCLFFBQXBCLENBQTZCLGtCQUE3QixFQUFpRDtBQUMvQ0csVUFBQUEsTUFBTSxFQUFFUCxLQUFLLENBQUNHLE1BRGlDO0FBRS9DRyxVQUFBQSxXQUFXLEVBQUU7QUFGa0MsU0FBakQ7QUFJRDs7QUFDRCxZQUFNTixLQUFOO0FBQ0Q7QUFDRixHQWhCRDtBQWtCQSxRQUFNbUQsaUJBQWlCLEdBQUd2RSxlQUFlLENBQUNJLFdBQWhCLENBQTRCSixlQUFlLENBQUNLLFVBQWhCLENBQTJCbUUsU0FBdkQsQ0FBMUI7QUFDQUQsRUFBQUEsaUJBQWlCLENBQUNoRSxhQUFsQixDQUFnQyxzQkFBaEMsRUFBd0QsT0FBT0MsSUFBUCxFQUFhQyxVQUFiLEVBQXlCZ0UsVUFBekIsS0FBd0M7QUFDOUYsUUFBSTtBQUNGLGFBQU8sTUFBTWpFLElBQUksRUFBakI7QUFDRCxLQUZELENBRUUsT0FBT1ksS0FBUCxFQUFjO0FBQ2QsVUFBSUEsS0FBSyxZQUFZQyw2QkFBckIsRUFBK0I7QUFDN0IsWUFBSU0sTUFBTSxHQUFHUCxLQUFLLENBQUNHLE1BQW5COztBQUNBLFlBQUlILEtBQUssQ0FBQ0csTUFBTixDQUFhNEIsS0FBYixDQUFtQixvQ0FBbkIsQ0FBSixFQUE4RDtBQUM1RHhCLFVBQUFBLE1BQU0sR0FBSSxrREFBaUQ4QyxVQUFXLEdBQXRFO0FBQ0Q7O0FBQ0QzRSxRQUFBQSxtQkFBbUIsQ0FBQzBCLFFBQXBCLENBQTZCLHNCQUE3QixFQUFxRDtBQUNuREcsVUFBQUEsTUFEbUQ7QUFFbkRELFVBQUFBLFdBQVcsRUFBRTtBQUZzQyxTQUFyRDtBQUlEOztBQUVELFlBQU1OLEtBQU47QUFDRDtBQUNGLEdBakJEO0FBbUJBLFNBQU9wQixlQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnZnMtZXh0cmEnO1xuXG5pbXBvcnQgQWN0aW9uUGlwZWxpbmVNYW5hZ2VyIGZyb20gJy4vYWN0aW9uLXBpcGVsaW5lJztcbmltcG9ydCB7R2l0RXJyb3J9IGZyb20gJy4vZ2l0LXNoZWxsLW91dC1zdHJhdGVneSc7XG5pbXBvcnQge2dldENvbW1pdE1lc3NhZ2VQYXRoLCBnZXRDb21taXRNZXNzYWdlRWRpdG9ycywgZGVzdHJveUZpbGVQYXRjaFBhbmVJdGVtc30gZnJvbSAnLi9oZWxwZXJzJztcblxuLy8gTm90ZTogTWlkZGxld2FyZSB0aGF0IGNhdGNoZXMgZXJyb3JzIHNob3VsZCByZS10aHJvdyB0aGUgZXJyb3JzIHNvIHRoYXQgdGhleSBwcm9wb2dhdGVcbi8vIGFuZCBvdGhlciBtaWRkbGV3YXJlIGluIHRoZSBwaXBlbGluZSBjYW4gYmUgbWFkZSBhd2FyZSBvZiB0aGUgZXJyb3JzLlxuLy8gVWx0aW1hdGVseSwgdGhlIHZpZXdzIGFyZSByZXNwb25zaWJsZSBmb3IgY2F0Y2hpbmcgdGhlIGVycm9ycyBhbmQgaGFuZGxpbmcgdGhlbSBhY2NvcmRpbmdseVxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbih7Y29uZmlybSwgbm90aWZpY2F0aW9uTWFuYWdlciwgd29ya3NwYWNlfSkge1xuICBjb25zdCBwaXBlbGluZU1hbmFnZXIgPSBuZXcgQWN0aW9uUGlwZWxpbmVNYW5hZ2VyKHtcbiAgICBhY3Rpb25OYW1lczogWydQVVNIJywgJ1BVTEwnLCAnRkVUQ0gnLCAnQ09NTUlUJywgJ0NIRUNLT1VUJywgJ0FERFJFTU9URSddLFxuICB9KTtcblxuICBjb25zdCBwdXNoUGlwZWxpbmUgPSBwaXBlbGluZU1hbmFnZXIuZ2V0UGlwZWxpbmUocGlwZWxpbmVNYW5hZ2VyLmFjdGlvbktleXMuUFVTSCk7XG4gIHB1c2hQaXBlbGluZS5hZGRNaWRkbGV3YXJlKCdjb25maXJtLWZvcmNlLXB1c2gnLCBhc3luYyAobmV4dCwgcmVwb3NpdG9yeSwgYnJhbmNoTmFtZSwgb3B0aW9ucykgPT4ge1xuICAgIGlmIChvcHRpb25zLmZvcmNlKSB7XG4gICAgICBjb25zdCBjaG9pY2UgPSBjb25maXJtKHtcbiAgICAgICAgbWVzc2FnZTogJ0FyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBmb3JjZSBwdXNoPycsXG4gICAgICAgIGRldGFpbGVkTWVzc2FnZTogJ1RoaXMgb3BlcmF0aW9uIGNvdWxkIHJlc3VsdCBpbiBsb3NpbmcgZGF0YSBvbiB0aGUgcmVtb3RlLicsXG4gICAgICAgIGJ1dHRvbnM6IFsnRm9yY2UgUHVzaCcsICdDYW5jZWwnXSxcbiAgICAgIH0pO1xuICAgICAgaWYgKGNob2ljZSAhPT0gMCkgeyAvKiBkbyBub3RoaW5nICovIH0gZWxzZSB7IGF3YWl0IG5leHQoKTsgfVxuICAgIH0gZWxzZSB7XG4gICAgICBhd2FpdCBuZXh0KCk7XG4gICAgfVxuICB9KTtcbiAgcHVzaFBpcGVsaW5lLmFkZE1pZGRsZXdhcmUoJ3NldC1wdXNoLWluLXByb2dyZXNzJywgYXN5bmMgKG5leHQsIHJlcG9zaXRvcnksIGJyYW5jaE5hbWUsIG9wdGlvbnMpID0+IHtcbiAgICByZXBvc2l0b3J5LmdldE9wZXJhdGlvblN0YXRlcygpLnNldFB1c2hJblByb2dyZXNzKHRydWUpO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBuZXh0KCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHJlcG9zaXRvcnkuZ2V0T3BlcmF0aW9uU3RhdGVzKCkuc2V0UHVzaEluUHJvZ3Jlc3MoZmFsc2UpO1xuICAgIH1cbiAgfSk7XG4gIHB1c2hQaXBlbGluZS5hZGRNaWRkbGV3YXJlKCdmYWlsZWQtdG8tcHVzaC1lcnJvcicsIGFzeW5jIChuZXh0LCByZXBvc2l0b3J5LCBicmFuY2hOYW1lLCBvcHRpb25zKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG5leHQoKTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEdpdEVycm9yKSB7XG4gICAgICAgIGlmICgvcmVqZWN0ZWRbXFxzXFxTXSpmYWlsZWQgdG8gcHVzaC8udGVzdChlcnJvci5zdGRFcnIpKSB7XG4gICAgICAgICAgbm90aWZpY2F0aW9uTWFuYWdlci5hZGRFcnJvcignUHVzaCByZWplY3RlZCcsIHtcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnVGhlIHRpcCBvZiB5b3VyIGN1cnJlbnQgYnJhbmNoIGlzIGJlaGluZCBpdHMgcmVtb3RlIGNvdW50ZXJwYXJ0LicgK1xuICAgICAgICAgICAgJyBUcnkgcHVsbGluZyBiZWZvcmUgcHVzaGluZy48YnIgLz5UbyBmb3JjZSBwdXNoLCBob2xkIGBjbWRgIG9yIGBjdHJsYCB3aGlsZSBjbGlja2luZy4nLFxuICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbm90aWZpY2F0aW9uTWFuYWdlci5hZGRFcnJvcignVW5hYmxlIHRvIHB1c2gnLCB7XG4gICAgICAgICAgICBkZXRhaWw6IGVycm9yLnN0ZEVycixcbiAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH0pO1xuXG4gIGNvbnN0IHB1bGxQaXBlbGluZSA9IHBpcGVsaW5lTWFuYWdlci5nZXRQaXBlbGluZShwaXBlbGluZU1hbmFnZXIuYWN0aW9uS2V5cy5QVUxMKTtcbiAgcHVsbFBpcGVsaW5lLmFkZE1pZGRsZXdhcmUoJ3NldC1wdWxsLWluLXByb2dyZXNzJywgYXN5bmMgKG5leHQsIHJlcG9zaXRvcnksIGJyYW5jaE5hbWUpID0+IHtcbiAgICByZXBvc2l0b3J5LmdldE9wZXJhdGlvblN0YXRlcygpLnNldFB1bGxJblByb2dyZXNzKHRydWUpO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBuZXh0KCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHJlcG9zaXRvcnkuZ2V0T3BlcmF0aW9uU3RhdGVzKCkuc2V0UHVsbEluUHJvZ3Jlc3MoZmFsc2UpO1xuICAgIH1cbiAgfSk7XG4gIHB1bGxQaXBlbGluZS5hZGRNaWRkbGV3YXJlKCdmYWlsZWQtdG8tcHVsbC1lcnJvcicsIGFzeW5jIChuZXh0LCByZXBvc2l0b3J5LCBicmFuY2hOYW1lKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG5leHQoKTtcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEdpdEVycm9yKSB7XG4gICAgICAgIHJlcG9zaXRvcnkuZGlkUHVsbEVycm9yKCk7XG4gICAgICAgIGlmICgvZXJyb3I6IFlvdXIgbG9jYWwgY2hhbmdlcyB0byB0aGUgZm9sbG93aW5nIGZpbGVzIHdvdWxkIGJlIG92ZXJ3cml0dGVuIGJ5IG1lcmdlLy50ZXN0KGVycm9yLnN0ZEVycikpIHtcbiAgICAgICAgICBjb25zdCBsaW5lcyA9IGVycm9yLnN0ZEVyci5zcGxpdCgnXFxuJyk7XG4gICAgICAgICAgY29uc3QgZmlsZXMgPSBsaW5lcy5zbGljZSgzLCBsaW5lcy5sZW5ndGggLSAzKS5tYXAobCA9PiBgXFxgJHtsLnRyaW0oKX1cXGBgKS5qb2luKCdcXG4nKTtcbiAgICAgICAgICBub3RpZmljYXRpb25NYW5hZ2VyLmFkZEVycm9yKCdQdWxsIGFib3J0ZWQnLCB7XG4gICAgICAgICAgICBkZXNjcmlwdGlvbjpcbiAgICAgICAgICAgICAgJ0xvY2FsIGNoYW5nZXMgdG8gdGhlIGZvbGxvd2luZyB3b3VsZCBiZSBvdmVyd3JpdHRlbiBieSBtZXJnZTo8YnIvPicgKyBmaWxlcyArXG4gICAgICAgICAgICAgICc8YnIvPlBsZWFzZSBjb21taXQgeW91ciBjaGFuZ2VzIG9yIHN0YXNoIHRoZW0gYmVmb3JlIHlvdSBtZXJnZS4nLFxuICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoL0F1dG9tYXRpYyBtZXJnZSBmYWlsZWQ7IGZpeCBjb25mbGljdHMgYW5kIHRoZW4gY29tbWl0IHRoZSByZXN1bHQuLy50ZXN0KGVycm9yLnN0ZE91dCkpIHtcbiAgICAgICAgICBub3RpZmljYXRpb25NYW5hZ2VyLmFkZFdhcm5pbmcoJ01lcmdlIGNvbmZsaWN0cycsIHtcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBgWW91ciBsb2NhbCBjaGFuZ2VzIGNvbmZsaWN0ZWQgd2l0aCBjaGFuZ2VzIG1hZGUgb24gdGhlIHJlbW90ZSBicmFuY2guIFJlc29sdmUgdGhlIGNvbmZsaWN0c1xuICAgICAgICAgICAgICB3aXRoIHRoZSBHaXQgcGFuZWwgYW5kIGNvbW1pdCB0byBjb250aW51ZS5gLFxuICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSBpZiAoL2ZhdGFsOiBOb3QgcG9zc2libGUgdG8gZmFzdC1mb3J3YXJkLCBhYm9ydGluZy4vLnRlc3QoZXJyb3Iuc3RkRXJyKSkge1xuICAgICAgICAgIG5vdGlmaWNhdGlvbk1hbmFnZXIuYWRkV2FybmluZygnVW5tZXJnZWQgY2hhbmdlcycsIHtcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOlxuICAgICAgICAgICAgICAnWW91ciBsb2NhbCBicmFuY2ggaGFzIGRpdmVyZ2VkIGZyb20gaXRzIHJlbW90ZSBjb3VudGVycGFydC48YnIvPicgK1xuICAgICAgICAgICAgICAnTWVyZ2Ugb3IgcmViYXNlIHlvdXIgbG9jYWwgd29yayB0byBjb250aW51ZS4nLFxuICAgICAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbm90aWZpY2F0aW9uTWFuYWdlci5hZGRFcnJvcignVW5hYmxlIHRvIHB1bGwnLCB7XG4gICAgICAgICAgICBkZXRhaWw6IGVycm9yLnN0ZEVycixcbiAgICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH0pO1xuXG4gIGNvbnN0IGZldGNoUGlwZWxpbmUgPSBwaXBlbGluZU1hbmFnZXIuZ2V0UGlwZWxpbmUocGlwZWxpbmVNYW5hZ2VyLmFjdGlvbktleXMuRkVUQ0gpO1xuICBmZXRjaFBpcGVsaW5lLmFkZE1pZGRsZXdhcmUoJ3NldC1mZXRjaC1pbi1wcm9ncmVzcycsIGFzeW5jIChuZXh0LCByZXBvc2l0b3J5KSA9PiB7XG4gICAgcmVwb3NpdG9yeS5nZXRPcGVyYXRpb25TdGF0ZXMoKS5zZXRGZXRjaEluUHJvZ3Jlc3ModHJ1ZSk7XG4gICAgdHJ5IHtcbiAgICAgIGF3YWl0IG5leHQoKTtcbiAgICB9IGZpbmFsbHkge1xuICAgICAgcmVwb3NpdG9yeS5nZXRPcGVyYXRpb25TdGF0ZXMoKS5zZXRGZXRjaEluUHJvZ3Jlc3MoZmFsc2UpO1xuICAgIH1cbiAgfSk7XG4gIGZldGNoUGlwZWxpbmUuYWRkTWlkZGxld2FyZSgnZmFpbGVkLXRvLWZldGNoLWVycm9yJywgYXN5bmMgKG5leHQsIHJlcG9zaXRvcnkpID0+IHtcbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgbmV4dCgpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgR2l0RXJyb3IpIHtcbiAgICAgICAgbm90aWZpY2F0aW9uTWFuYWdlci5hZGRFcnJvcignVW5hYmxlIHRvIGZldGNoJywge1xuICAgICAgICAgIGRldGFpbDogZXJyb3Iuc3RkRXJyLFxuICAgICAgICAgIGRpc21pc3NhYmxlOiB0cnVlLFxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfSk7XG5cbiAgY29uc3QgY2hlY2tvdXRQaXBlbGluZSA9IHBpcGVsaW5lTWFuYWdlci5nZXRQaXBlbGluZShwaXBlbGluZU1hbmFnZXIuYWN0aW9uS2V5cy5DSEVDS09VVCk7XG4gIGNoZWNrb3V0UGlwZWxpbmUuYWRkTWlkZGxld2FyZSgnc2V0LWNoZWNrb3V0LWluLXByb2dyZXNzJywgYXN5bmMgKG5leHQsIHJlcG9zaXRvcnksIGJyYW5jaE5hbWUpID0+IHtcbiAgICByZXBvc2l0b3J5LmdldE9wZXJhdGlvblN0YXRlcygpLnNldENoZWNrb3V0SW5Qcm9ncmVzcyh0cnVlKTtcbiAgICB0cnkge1xuICAgICAgYXdhaXQgbmV4dCgpO1xuICAgIH0gZmluYWxseSB7XG4gICAgICByZXBvc2l0b3J5LmdldE9wZXJhdGlvblN0YXRlcygpLnNldENoZWNrb3V0SW5Qcm9ncmVzcyhmYWxzZSk7XG4gICAgfVxuICB9KTtcbiAgY2hlY2tvdXRQaXBlbGluZS5hZGRNaWRkbGV3YXJlKCdmYWlsZWQtdG8tY2hlY2tvdXQtZXJyb3InLCBhc3luYyAobmV4dCwgcmVwb3NpdG9yeSwgYnJhbmNoTmFtZSwgb3B0aW9ucykgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBuZXh0KCk7XG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBpZiAoZXJyb3IgaW5zdGFuY2VvZiBHaXRFcnJvcikge1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gb3B0aW9ucy5jcmVhdGVOZXcgPyAnQ2Fubm90IGNyZWF0ZSBicmFuY2gnIDogJ0NoZWNrb3V0IGFib3J0ZWQnO1xuICAgICAgICBsZXQgZGV0YWlsID0gdW5kZWZpbmVkO1xuICAgICAgICBsZXQgZGVzY3JpcHRpb24gPSB1bmRlZmluZWQ7XG5cbiAgICAgICAgaWYgKGVycm9yLnN0ZEVyci5tYXRjaCgvbG9jYWwgY2hhbmdlcy4qd291bGQgYmUgb3ZlcndyaXR0ZW4vKSkge1xuICAgICAgICAgIGNvbnN0IGZpbGVzID0gZXJyb3Iuc3RkRXJyLnNwbGl0KC9cXHI/XFxuLykuZmlsdGVyKGwgPT4gbC5zdGFydHNXaXRoKCdcXHQnKSlcbiAgICAgICAgICAgIC5tYXAobCA9PiBgXFxgJHtsLnRyaW0oKX1cXGBgKS5qb2luKCc8YnIvPicpO1xuICAgICAgICAgIGRlc2NyaXB0aW9uID1cbiAgICAgICAgICAgICAnTG9jYWwgY2hhbmdlcyB0byB0aGUgZm9sbG93aW5nIHdvdWxkIGJlIG92ZXJ3cml0dGVuOjxici8+JyArIGZpbGVzICtcbiAgICAgICAgICAgICAnPGJyLz5QbGVhc2UgY29tbWl0IHlvdXIgY2hhbmdlcyBvciBzdGFzaCB0aGVtLic7XG4gICAgICAgIH0gZWxzZSBpZiAoZXJyb3Iuc3RkRXJyLm1hdGNoKC9icmFuY2guKmFscmVhZHkgZXhpc3RzLykpIHtcbiAgICAgICAgICBkZXNjcmlwdGlvbiA9IGBcXGAke2JyYW5jaE5hbWV9XFxgIGFscmVhZHkgZXhpc3RzLiBDaG9vc2UgYW5vdGhlciBicmFuY2ggbmFtZS5gO1xuICAgICAgICB9IGVsc2UgaWYgKGVycm9yLnN0ZEVyci5tYXRjaCgvZXJyb3I6IHlvdSBuZWVkIHRvIHJlc29sdmUgeW91ciBjdXJyZW50IGluZGV4IGZpcnN0LykpIHtcbiAgICAgICAgICBkZXNjcmlwdGlvbiA9ICdZb3UgbXVzdCBmaXJzdCByZXNvbHZlIG1lcmdlIGNvbmZsaWN0cy4nO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGRlc2NyaXB0aW9uID09PSB1bmRlZmluZWQgJiYgZGV0YWlsID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBkZXRhaWwgPSBlcnJvci5zdGRFcnI7XG4gICAgICAgIH1cbiAgICAgICAgbm90aWZpY2F0aW9uTWFuYWdlci5hZGRFcnJvcihtZXNzYWdlLCB7ZGVzY3JpcHRpb24sIGRldGFpbCwgZGlzbWlzc2FibGU6IHRydWV9KTtcbiAgICAgIH1cbiAgICAgIHRocm93IGVycm9yO1xuICAgIH1cbiAgfSk7XG5cbiAgY29uc3QgY29tbWl0UGlwZWxpbmUgPSBwaXBlbGluZU1hbmFnZXIuZ2V0UGlwZWxpbmUocGlwZWxpbmVNYW5hZ2VyLmFjdGlvbktleXMuQ09NTUlUKTtcbiAgY29tbWl0UGlwZWxpbmUuYWRkTWlkZGxld2FyZSgnY29uZmlybS1jb21taXQnLCBhc3luYyAobmV4dCwgcmVwb3NpdG9yeSkgPT4ge1xuICAgIGZ1bmN0aW9uIGNvbmZpcm1Db21taXQoKSB7XG4gICAgICBjb25zdCBjaG9pY2UgPSBjb25maXJtKHtcbiAgICAgICAgbWVzc2FnZTogJ09uZSBvciBtb3JlIHRleHQgZWRpdG9ycyBmb3IgdGhlIGNvbW1pdCBtZXNzYWdlIGFyZSB1bnNhdmVkLicsXG4gICAgICAgIGRldGFpbGVkTWVzc2FnZTogJ0RvIHlvdSB3YW50IHRvIGNvbW1pdCBhbmQgY2xvc2UgYWxsIG9wZW4gY29tbWl0IG1lc3NhZ2UgZWRpdG9ycz8nLFxuICAgICAgICBidXR0b25zOiBbJ0NvbW1pdCcsICdDYW5jZWwnXSxcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIGNob2ljZSA9PT0gMDtcbiAgICB9XG5cbiAgICBjb25zdCBjb21taXRNZXNzYWdlRWRpdG9ycyA9IGdldENvbW1pdE1lc3NhZ2VFZGl0b3JzKHJlcG9zaXRvcnksIHdvcmtzcGFjZSk7XG4gICAgaWYgKGNvbW1pdE1lc3NhZ2VFZGl0b3JzLmxlbmd0aCA+IDApIHtcbiAgICAgIGlmICghY29tbWl0TWVzc2FnZUVkaXRvcnMuc29tZShlID0+IGUuaXNNb2RpZmllZCgpKSB8fCBjb25maXJtQ29tbWl0KCkpIHtcbiAgICAgICAgYXdhaXQgbmV4dCgpO1xuICAgICAgICBjb21taXRNZXNzYWdlRWRpdG9ycy5mb3JFYWNoKGVkaXRvciA9PiBlZGl0b3IuZGVzdHJveSgpKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgYXdhaXQgbmV4dCgpO1xuICAgIH1cbiAgfSk7XG4gIGNvbW1pdFBpcGVsaW5lLmFkZE1pZGRsZXdhcmUoJ2NsZWFuLXVwLWRpc2stY29tbWl0LW1zZycsIGFzeW5jIChuZXh0LCByZXBvc2l0b3J5KSA9PiB7XG4gICAgYXdhaXQgbmV4dCgpO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBmcy5yZW1vdmUoZ2V0Q29tbWl0TWVzc2FnZVBhdGgocmVwb3NpdG9yeSkpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAvLyBkbyBub3RoaW5nXG4gICAgfVxuICB9KTtcbiAgY29tbWl0UGlwZWxpbmUuYWRkTWlkZGxld2FyZSgnc2V0LWNvbW1pdC1pbi1wcm9ncmVzcycsIGFzeW5jIChuZXh0LCByZXBvc2l0b3J5KSA9PiB7XG4gICAgcmVwb3NpdG9yeS5nZXRPcGVyYXRpb25TdGF0ZXMoKS5zZXRDb21taXRJblByb2dyZXNzKHRydWUpO1xuICAgIHRyeSB7XG4gICAgICBhd2FpdCBuZXh0KCk7XG4gICAgfSBmaW5hbGx5IHtcbiAgICAgIHJlcG9zaXRvcnkuZ2V0T3BlcmF0aW9uU3RhdGVzKCkuc2V0Q29tbWl0SW5Qcm9ncmVzcyhmYWxzZSk7XG4gICAgfVxuICB9KTtcbiAgY29tbWl0UGlwZWxpbmUuYWRkTWlkZGxld2FyZSgnZmFpbGVkLXRvLWNvbW1pdC1lcnJvcicsIGFzeW5jIChuZXh0LCByZXBvc2l0b3J5KSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3VsdCA9IGF3YWl0IG5leHQoKTtcbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gYXdhaXQgcmVwb3NpdG9yeS5mZXRjaENvbW1pdE1lc3NhZ2VUZW1wbGF0ZSgpO1xuICAgICAgcmVwb3NpdG9yeS5zZXRDb21taXRNZXNzYWdlKHRlbXBsYXRlIHx8ICcnKTtcbiAgICAgIGRlc3Ryb3lGaWxlUGF0Y2hQYW5lSXRlbXMoe29ubHlTdGFnZWQ6IHRydWV9LCB3b3Jrc3BhY2UpO1xuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgR2l0RXJyb3IpIHtcbiAgICAgICAgbm90aWZpY2F0aW9uTWFuYWdlci5hZGRFcnJvcignVW5hYmxlIHRvIGNvbW1pdCcsIHtcbiAgICAgICAgICBkZXRhaWw6IGVycm9yLnN0ZEVycixcbiAgICAgICAgICBkaXNtaXNzYWJsZTogdHJ1ZSxcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH0pO1xuXG4gIGNvbnN0IGFkZFJlbW90ZVBpcGVsaW5lID0gcGlwZWxpbmVNYW5hZ2VyLmdldFBpcGVsaW5lKHBpcGVsaW5lTWFuYWdlci5hY3Rpb25LZXlzLkFERFJFTU9URSk7XG4gIGFkZFJlbW90ZVBpcGVsaW5lLmFkZE1pZGRsZXdhcmUoJ2ZhaWxlZC10by1hZGQtcmVtb3RlJywgYXN5bmMgKG5leHQsIHJlcG9zaXRvcnksIHJlbW90ZU5hbWUpID0+IHtcbiAgICB0cnkge1xuICAgICAgcmV0dXJuIGF3YWl0IG5leHQoKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgR2l0RXJyb3IpIHtcbiAgICAgICAgbGV0IGRldGFpbCA9IGVycm9yLnN0ZEVycjtcbiAgICAgICAgaWYgKGVycm9yLnN0ZEVyci5tYXRjaCgvXmZhdGFsOiByZW1vdGUgLiogYWxyZWFkeSBleGlzdHNcXC4vKSkge1xuICAgICAgICAgIGRldGFpbCA9IGBUaGUgcmVwb3NpdG9yeSBhbHJlYWR5IGNvbnRhaW5zIGEgcmVtb3RlIG5hbWVkICR7cmVtb3RlTmFtZX0uYDtcbiAgICAgICAgfVxuICAgICAgICBub3RpZmljYXRpb25NYW5hZ2VyLmFkZEVycm9yKCdDYW5ub3QgY3JlYXRlIHJlbW90ZScsIHtcbiAgICAgICAgICBkZXRhaWwsXG4gICAgICAgICAgZGlzbWlzc2FibGU6IHRydWUsXG4gICAgICAgIH0pO1xuICAgICAgfVxuXG4gICAgICB0aHJvdyBlcnJvcjtcbiAgICB9XG4gIH0pO1xuXG4gIHJldHVybiBwaXBlbGluZU1hbmFnZXI7XG59XG4iXX0=