"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _compareSets = _interopRequireDefault(require("compare-sets"));

var _eventKit = require("event-kit");

var _workdirContext = _interopRequireDefault(require("./workdir-context"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * Manage a WorkdirContext for each open directory.
 */
class WorkdirContextPool {
  /**
   * Options will be passed to each `WorkdirContext` as it is created.
   */
  constructor(options = {}) {
    this.options = options;
    this.contexts = new Map();
    this.emitter = new _eventKit.Emitter();
  }

  size() {
    return this.contexts.size;
  }
  /**
   * Access the context mapped to a known directory.
   */


  getContext(directory) {
    const {
      pipelineManager
    } = this.options;
    return this.contexts.get(directory) || _workdirContext.default.absent({
      pipelineManager
    });
  }
  /**
   * Return a WorkdirContext whose Repository has at least one remote configured to push to the named GitHub repository.
   * Returns a null context if zero or more than one contexts match.
   */


  async getMatchingContext(host, owner, repo) {
    const matches = await Promise.all(this.withResidentContexts(async (_workdir, context) => {
      const match = await context.getRepository().hasGitHubRemote(host, owner, repo);
      return match ? context : null;
    }));
    const filtered = matches.filter(Boolean);
    return filtered.length === 1 ? filtered[0] : _workdirContext.default.absent(_objectSpread({}, this.options));
  }

  add(directory, options = {}, silenceEmitter = false) {
    if (this.contexts.has(directory)) {
      return this.getContext(directory);
    }

    const context = new _workdirContext.default(directory, _objectSpread({}, this.options, {}, options));
    this.contexts.set(directory, context);
    const disposable = context.subs;

    const forwardEvent = (subMethod, emitEventName) => {
      const emit = () => this.emitter.emit(emitEventName, context);

      disposable.add(context[subMethod](emit));
    };

    forwardEvent('onDidStartObserver', 'did-start-observer');
    forwardEvent('onDidChangeWorkdirOrHead', 'did-change-workdir-or-head');
    forwardEvent('onDidChangeRepositoryState', 'did-change-repository-state');
    forwardEvent('onDidUpdateRepository', 'did-update-repository');
    forwardEvent('onDidDestroyRepository', 'did-destroy-repository'); // Propagate global cache invalidations across all resident contexts

    disposable.add(context.getRepository().onDidGloballyInvalidate(spec => {
      this.withResidentContexts((_workdir, eachContext) => {
        if (eachContext !== context) {
          eachContext.getRepository().acceptInvalidation(spec);
        }
      });
    }));

    if (!silenceEmitter) {
      this.emitter.emit('did-change-contexts', {
        added: new Set([directory])
      });
    }

    return context;
  }

  replace(directory, options = {}, silenceEmitter = false) {
    this.remove(directory, true);
    this.add(directory, options, true);

    if (!silenceEmitter) {
      this.emitter.emit('did-change-contexts', {
        altered: new Set([directory])
      });
    }
  }

  remove(directory, silenceEmitter = false) {
    const existing = this.contexts.get(directory);
    this.contexts.delete(directory);

    if (existing) {
      existing.destroy();

      if (!silenceEmitter) {
        this.emitter.emit('did-change-contexts', {
          removed: new Set([directory])
        });
      }
    }
  }

  set(directories, options = {}) {
    const previous = new Set(this.contexts.keys());
    const {
      added,
      removed
    } = (0, _compareSets.default)(previous, directories);

    for (const directory of added) {
      this.add(directory, options, true);
    }

    for (const directory of removed) {
      this.remove(directory, true);
    }

    if (added.size !== 0 || removed.size !== 0) {
      this.emitter.emit('did-change-contexts', {
        added,
        removed
      });
    }
  }

  getCurrentWorkDirs() {
    return this.contexts.keys();
  }

  withResidentContexts(callback) {
    const results = [];

    for (const [workdir, context] of this.contexts) {
      results.push(callback(workdir, context));
    }

    return results;
  }

  onDidStartObserver(callback) {
    return this.emitter.on('did-start-observer', callback);
  }

  onDidChangePoolContexts(callback) {
    return this.emitter.on('did-change-contexts', callback);
  }

  onDidChangeWorkdirOrHead(callback) {
    return this.emitter.on('did-change-workdir-or-head', callback);
  }

  onDidChangeRepositoryState(callback) {
    return this.emitter.on('did-change-repository-state', callback);
  }

  onDidUpdateRepository(callback) {
    return this.emitter.on('did-update-repository', callback);
  }

  onDidDestroyRepository(callback) {
    return this.emitter.on('did-destroy-repository', callback);
  }

  clear() {
    const workdirs = new Set();
    this.withResidentContexts(workdir => {
      this.remove(workdir, true);
      workdirs.add(workdir);
    });

    _workdirContext.default.destroyAbsent();

    if (workdirs.size !== 0) {
      this.emitter.emit('did-change-contexts', {
        removed: workdirs
      });
    }
  }

}

exports.default = WorkdirContextPool;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9tb2RlbHMvd29ya2Rpci1jb250ZXh0LXBvb2wuanMiXSwibmFtZXMiOlsiV29ya2RpckNvbnRleHRQb29sIiwiY29uc3RydWN0b3IiLCJvcHRpb25zIiwiY29udGV4dHMiLCJNYXAiLCJlbWl0dGVyIiwiRW1pdHRlciIsInNpemUiLCJnZXRDb250ZXh0IiwiZGlyZWN0b3J5IiwicGlwZWxpbmVNYW5hZ2VyIiwiZ2V0IiwiV29ya2RpckNvbnRleHQiLCJhYnNlbnQiLCJnZXRNYXRjaGluZ0NvbnRleHQiLCJob3N0Iiwib3duZXIiLCJyZXBvIiwibWF0Y2hlcyIsIlByb21pc2UiLCJhbGwiLCJ3aXRoUmVzaWRlbnRDb250ZXh0cyIsIl93b3JrZGlyIiwiY29udGV4dCIsIm1hdGNoIiwiZ2V0UmVwb3NpdG9yeSIsImhhc0dpdEh1YlJlbW90ZSIsImZpbHRlcmVkIiwiZmlsdGVyIiwiQm9vbGVhbiIsImxlbmd0aCIsImFkZCIsInNpbGVuY2VFbWl0dGVyIiwiaGFzIiwic2V0IiwiZGlzcG9zYWJsZSIsInN1YnMiLCJmb3J3YXJkRXZlbnQiLCJzdWJNZXRob2QiLCJlbWl0RXZlbnROYW1lIiwiZW1pdCIsIm9uRGlkR2xvYmFsbHlJbnZhbGlkYXRlIiwic3BlYyIsImVhY2hDb250ZXh0IiwiYWNjZXB0SW52YWxpZGF0aW9uIiwiYWRkZWQiLCJTZXQiLCJyZXBsYWNlIiwicmVtb3ZlIiwiYWx0ZXJlZCIsImV4aXN0aW5nIiwiZGVsZXRlIiwiZGVzdHJveSIsInJlbW92ZWQiLCJkaXJlY3RvcmllcyIsInByZXZpb3VzIiwia2V5cyIsImdldEN1cnJlbnRXb3JrRGlycyIsImNhbGxiYWNrIiwicmVzdWx0cyIsIndvcmtkaXIiLCJwdXNoIiwib25EaWRTdGFydE9ic2VydmVyIiwib24iLCJvbkRpZENoYW5nZVBvb2xDb250ZXh0cyIsIm9uRGlkQ2hhbmdlV29ya2Rpck9ySGVhZCIsIm9uRGlkQ2hhbmdlUmVwb3NpdG9yeVN0YXRlIiwib25EaWRVcGRhdGVSZXBvc2l0b3J5Iiwib25EaWREZXN0cm95UmVwb3NpdG9yeSIsImNsZWFyIiwid29ya2RpcnMiLCJkZXN0cm95QWJzZW50Il0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7O0FBRUE7O0FBQ0E7Ozs7Ozs7Ozs7QUFFQTtBQUNBO0FBQ0E7QUFDZSxNQUFNQSxrQkFBTixDQUF5QjtBQUV0QztBQUNGO0FBQ0E7QUFDRUMsRUFBQUEsV0FBVyxDQUFDQyxPQUFPLEdBQUcsRUFBWCxFQUFlO0FBQ3hCLFNBQUtBLE9BQUwsR0FBZUEsT0FBZjtBQUVBLFNBQUtDLFFBQUwsR0FBZ0IsSUFBSUMsR0FBSixFQUFoQjtBQUNBLFNBQUtDLE9BQUwsR0FBZSxJQUFJQyxpQkFBSixFQUFmO0FBQ0Q7O0FBRURDLEVBQUFBLElBQUksR0FBRztBQUNMLFdBQU8sS0FBS0osUUFBTCxDQUFjSSxJQUFyQjtBQUNEO0FBRUQ7QUFDRjtBQUNBOzs7QUFDRUMsRUFBQUEsVUFBVSxDQUFDQyxTQUFELEVBQVk7QUFDcEIsVUFBTTtBQUFDQyxNQUFBQTtBQUFELFFBQW9CLEtBQUtSLE9BQS9CO0FBQ0EsV0FBTyxLQUFLQyxRQUFMLENBQWNRLEdBQWQsQ0FBa0JGLFNBQWxCLEtBQWdDRyx3QkFBZUMsTUFBZixDQUFzQjtBQUFDSCxNQUFBQTtBQUFELEtBQXRCLENBQXZDO0FBQ0Q7QUFFRDtBQUNGO0FBQ0E7QUFDQTs7O0FBQzBCLFFBQWxCSSxrQkFBa0IsQ0FBQ0MsSUFBRCxFQUFPQyxLQUFQLEVBQWNDLElBQWQsRUFBb0I7QUFDMUMsVUFBTUMsT0FBTyxHQUFHLE1BQU1DLE9BQU8sQ0FBQ0MsR0FBUixDQUNwQixLQUFLQyxvQkFBTCxDQUEwQixPQUFPQyxRQUFQLEVBQWlCQyxPQUFqQixLQUE2QjtBQUNyRCxZQUFNQyxLQUFLLEdBQUcsTUFBTUQsT0FBTyxDQUFDRSxhQUFSLEdBQXdCQyxlQUF4QixDQUF3Q1gsSUFBeEMsRUFBOENDLEtBQTlDLEVBQXFEQyxJQUFyRCxDQUFwQjtBQUNBLGFBQU9PLEtBQUssR0FBR0QsT0FBSCxHQUFhLElBQXpCO0FBQ0QsS0FIRCxDQURvQixDQUF0QjtBQU1BLFVBQU1JLFFBQVEsR0FBR1QsT0FBTyxDQUFDVSxNQUFSLENBQWVDLE9BQWYsQ0FBakI7QUFFQSxXQUFPRixRQUFRLENBQUNHLE1BQVQsS0FBb0IsQ0FBcEIsR0FBd0JILFFBQVEsQ0FBQyxDQUFELENBQWhDLEdBQXNDZix3QkFBZUMsTUFBZixtQkFBMEIsS0FBS1gsT0FBL0IsRUFBN0M7QUFDRDs7QUFFRDZCLEVBQUFBLEdBQUcsQ0FBQ3RCLFNBQUQsRUFBWVAsT0FBTyxHQUFHLEVBQXRCLEVBQTBCOEIsY0FBYyxHQUFHLEtBQTNDLEVBQWtEO0FBQ25ELFFBQUksS0FBSzdCLFFBQUwsQ0FBYzhCLEdBQWQsQ0FBa0J4QixTQUFsQixDQUFKLEVBQWtDO0FBQ2hDLGFBQU8sS0FBS0QsVUFBTCxDQUFnQkMsU0FBaEIsQ0FBUDtBQUNEOztBQUVELFVBQU1jLE9BQU8sR0FBRyxJQUFJWCx1QkFBSixDQUFtQkgsU0FBbkIsb0JBQWtDLEtBQUtQLE9BQXZDLE1BQW1EQSxPQUFuRCxFQUFoQjtBQUNBLFNBQUtDLFFBQUwsQ0FBYytCLEdBQWQsQ0FBa0J6QixTQUFsQixFQUE2QmMsT0FBN0I7QUFFQSxVQUFNWSxVQUFVLEdBQUdaLE9BQU8sQ0FBQ2EsSUFBM0I7O0FBRUEsVUFBTUMsWUFBWSxHQUFHLENBQUNDLFNBQUQsRUFBWUMsYUFBWixLQUE4QjtBQUNqRCxZQUFNQyxJQUFJLEdBQUcsTUFBTSxLQUFLbkMsT0FBTCxDQUFhbUMsSUFBYixDQUFrQkQsYUFBbEIsRUFBaUNoQixPQUFqQyxDQUFuQjs7QUFDQVksTUFBQUEsVUFBVSxDQUFDSixHQUFYLENBQWVSLE9BQU8sQ0FBQ2UsU0FBRCxDQUFQLENBQW1CRSxJQUFuQixDQUFmO0FBQ0QsS0FIRDs7QUFLQUgsSUFBQUEsWUFBWSxDQUFDLG9CQUFELEVBQXVCLG9CQUF2QixDQUFaO0FBQ0FBLElBQUFBLFlBQVksQ0FBQywwQkFBRCxFQUE2Qiw0QkFBN0IsQ0FBWjtBQUNBQSxJQUFBQSxZQUFZLENBQUMsNEJBQUQsRUFBK0IsNkJBQS9CLENBQVo7QUFDQUEsSUFBQUEsWUFBWSxDQUFDLHVCQUFELEVBQTBCLHVCQUExQixDQUFaO0FBQ0FBLElBQUFBLFlBQVksQ0FBQyx3QkFBRCxFQUEyQix3QkFBM0IsQ0FBWixDQW5CbUQsQ0FxQm5EOztBQUNBRixJQUFBQSxVQUFVLENBQUNKLEdBQVgsQ0FBZVIsT0FBTyxDQUFDRSxhQUFSLEdBQXdCZ0IsdUJBQXhCLENBQWdEQyxJQUFJLElBQUk7QUFDckUsV0FBS3JCLG9CQUFMLENBQTBCLENBQUNDLFFBQUQsRUFBV3FCLFdBQVgsS0FBMkI7QUFDbkQsWUFBSUEsV0FBVyxLQUFLcEIsT0FBcEIsRUFBNkI7QUFDM0JvQixVQUFBQSxXQUFXLENBQUNsQixhQUFaLEdBQTRCbUIsa0JBQTVCLENBQStDRixJQUEvQztBQUNEO0FBQ0YsT0FKRDtBQUtELEtBTmMsQ0FBZjs7QUFRQSxRQUFJLENBQUNWLGNBQUwsRUFBcUI7QUFDbkIsV0FBSzNCLE9BQUwsQ0FBYW1DLElBQWIsQ0FBa0IscUJBQWxCLEVBQXlDO0FBQUNLLFFBQUFBLEtBQUssRUFBRSxJQUFJQyxHQUFKLENBQVEsQ0FBQ3JDLFNBQUQsQ0FBUjtBQUFSLE9BQXpDO0FBQ0Q7O0FBRUQsV0FBT2MsT0FBUDtBQUNEOztBQUVEd0IsRUFBQUEsT0FBTyxDQUFDdEMsU0FBRCxFQUFZUCxPQUFPLEdBQUcsRUFBdEIsRUFBMEI4QixjQUFjLEdBQUcsS0FBM0MsRUFBa0Q7QUFDdkQsU0FBS2dCLE1BQUwsQ0FBWXZDLFNBQVosRUFBdUIsSUFBdkI7QUFDQSxTQUFLc0IsR0FBTCxDQUFTdEIsU0FBVCxFQUFvQlAsT0FBcEIsRUFBNkIsSUFBN0I7O0FBRUEsUUFBSSxDQUFDOEIsY0FBTCxFQUFxQjtBQUNuQixXQUFLM0IsT0FBTCxDQUFhbUMsSUFBYixDQUFrQixxQkFBbEIsRUFBeUM7QUFBQ1MsUUFBQUEsT0FBTyxFQUFFLElBQUlILEdBQUosQ0FBUSxDQUFDckMsU0FBRCxDQUFSO0FBQVYsT0FBekM7QUFDRDtBQUNGOztBQUVEdUMsRUFBQUEsTUFBTSxDQUFDdkMsU0FBRCxFQUFZdUIsY0FBYyxHQUFHLEtBQTdCLEVBQW9DO0FBQ3hDLFVBQU1rQixRQUFRLEdBQUcsS0FBSy9DLFFBQUwsQ0FBY1EsR0FBZCxDQUFrQkYsU0FBbEIsQ0FBakI7QUFDQSxTQUFLTixRQUFMLENBQWNnRCxNQUFkLENBQXFCMUMsU0FBckI7O0FBRUEsUUFBSXlDLFFBQUosRUFBYztBQUNaQSxNQUFBQSxRQUFRLENBQUNFLE9BQVQ7O0FBRUEsVUFBSSxDQUFDcEIsY0FBTCxFQUFxQjtBQUNuQixhQUFLM0IsT0FBTCxDQUFhbUMsSUFBYixDQUFrQixxQkFBbEIsRUFBeUM7QUFBQ2EsVUFBQUEsT0FBTyxFQUFFLElBQUlQLEdBQUosQ0FBUSxDQUFDckMsU0FBRCxDQUFSO0FBQVYsU0FBekM7QUFDRDtBQUNGO0FBQ0Y7O0FBRUR5QixFQUFBQSxHQUFHLENBQUNvQixXQUFELEVBQWNwRCxPQUFPLEdBQUcsRUFBeEIsRUFBNEI7QUFDN0IsVUFBTXFELFFBQVEsR0FBRyxJQUFJVCxHQUFKLENBQVEsS0FBSzNDLFFBQUwsQ0FBY3FELElBQWQsRUFBUixDQUFqQjtBQUNBLFVBQU07QUFBQ1gsTUFBQUEsS0FBRDtBQUFRUSxNQUFBQTtBQUFSLFFBQW1CLDBCQUFZRSxRQUFaLEVBQXNCRCxXQUF0QixDQUF6Qjs7QUFFQSxTQUFLLE1BQU03QyxTQUFYLElBQXdCb0MsS0FBeEIsRUFBK0I7QUFDN0IsV0FBS2QsR0FBTCxDQUFTdEIsU0FBVCxFQUFvQlAsT0FBcEIsRUFBNkIsSUFBN0I7QUFDRDs7QUFDRCxTQUFLLE1BQU1PLFNBQVgsSUFBd0I0QyxPQUF4QixFQUFpQztBQUMvQixXQUFLTCxNQUFMLENBQVl2QyxTQUFaLEVBQXVCLElBQXZCO0FBQ0Q7O0FBRUQsUUFBSW9DLEtBQUssQ0FBQ3RDLElBQU4sS0FBZSxDQUFmLElBQW9COEMsT0FBTyxDQUFDOUMsSUFBUixLQUFpQixDQUF6QyxFQUE0QztBQUMxQyxXQUFLRixPQUFMLENBQWFtQyxJQUFiLENBQWtCLHFCQUFsQixFQUF5QztBQUFDSyxRQUFBQSxLQUFEO0FBQVFRLFFBQUFBO0FBQVIsT0FBekM7QUFDRDtBQUNGOztBQUVESSxFQUFBQSxrQkFBa0IsR0FBRztBQUNuQixXQUFPLEtBQUt0RCxRQUFMLENBQWNxRCxJQUFkLEVBQVA7QUFDRDs7QUFFRG5DLEVBQUFBLG9CQUFvQixDQUFDcUMsUUFBRCxFQUFXO0FBQzdCLFVBQU1DLE9BQU8sR0FBRyxFQUFoQjs7QUFDQSxTQUFLLE1BQU0sQ0FBQ0MsT0FBRCxFQUFVckMsT0FBVixDQUFYLElBQWlDLEtBQUtwQixRQUF0QyxFQUFnRDtBQUM5Q3dELE1BQUFBLE9BQU8sQ0FBQ0UsSUFBUixDQUFhSCxRQUFRLENBQUNFLE9BQUQsRUFBVXJDLE9BQVYsQ0FBckI7QUFDRDs7QUFDRCxXQUFPb0MsT0FBUDtBQUNEOztBQUVERyxFQUFBQSxrQkFBa0IsQ0FBQ0osUUFBRCxFQUFXO0FBQzNCLFdBQU8sS0FBS3JELE9BQUwsQ0FBYTBELEVBQWIsQ0FBZ0Isb0JBQWhCLEVBQXNDTCxRQUF0QyxDQUFQO0FBQ0Q7O0FBRURNLEVBQUFBLHVCQUF1QixDQUFDTixRQUFELEVBQVc7QUFDaEMsV0FBTyxLQUFLckQsT0FBTCxDQUFhMEQsRUFBYixDQUFnQixxQkFBaEIsRUFBdUNMLFFBQXZDLENBQVA7QUFDRDs7QUFFRE8sRUFBQUEsd0JBQXdCLENBQUNQLFFBQUQsRUFBVztBQUNqQyxXQUFPLEtBQUtyRCxPQUFMLENBQWEwRCxFQUFiLENBQWdCLDRCQUFoQixFQUE4Q0wsUUFBOUMsQ0FBUDtBQUNEOztBQUVEUSxFQUFBQSwwQkFBMEIsQ0FBQ1IsUUFBRCxFQUFXO0FBQ25DLFdBQU8sS0FBS3JELE9BQUwsQ0FBYTBELEVBQWIsQ0FBZ0IsNkJBQWhCLEVBQStDTCxRQUEvQyxDQUFQO0FBQ0Q7O0FBRURTLEVBQUFBLHFCQUFxQixDQUFDVCxRQUFELEVBQVc7QUFDOUIsV0FBTyxLQUFLckQsT0FBTCxDQUFhMEQsRUFBYixDQUFnQix1QkFBaEIsRUFBeUNMLFFBQXpDLENBQVA7QUFDRDs7QUFFRFUsRUFBQUEsc0JBQXNCLENBQUNWLFFBQUQsRUFBVztBQUMvQixXQUFPLEtBQUtyRCxPQUFMLENBQWEwRCxFQUFiLENBQWdCLHdCQUFoQixFQUEwQ0wsUUFBMUMsQ0FBUDtBQUNEOztBQUVEVyxFQUFBQSxLQUFLLEdBQUc7QUFDTixVQUFNQyxRQUFRLEdBQUcsSUFBSXhCLEdBQUosRUFBakI7QUFFQSxTQUFLekIsb0JBQUwsQ0FBMEJ1QyxPQUFPLElBQUk7QUFDbkMsV0FBS1osTUFBTCxDQUFZWSxPQUFaLEVBQXFCLElBQXJCO0FBQ0FVLE1BQUFBLFFBQVEsQ0FBQ3ZDLEdBQVQsQ0FBYTZCLE9BQWI7QUFDRCxLQUhEOztBQUtBaEQsNEJBQWUyRCxhQUFmOztBQUVBLFFBQUlELFFBQVEsQ0FBQy9ELElBQVQsS0FBa0IsQ0FBdEIsRUFBeUI7QUFDdkIsV0FBS0YsT0FBTCxDQUFhbUMsSUFBYixDQUFrQixxQkFBbEIsRUFBeUM7QUFBQ2EsUUFBQUEsT0FBTyxFQUFFaUI7QUFBVixPQUF6QztBQUNEO0FBQ0Y7O0FBcEtxQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBjb21wYXJlU2V0cyBmcm9tICdjb21wYXJlLXNldHMnO1xuXG5pbXBvcnQge0VtaXR0ZXJ9IGZyb20gJ2V2ZW50LWtpdCc7XG5pbXBvcnQgV29ya2RpckNvbnRleHQgZnJvbSAnLi93b3JrZGlyLWNvbnRleHQnO1xuXG4vKipcbiAqIE1hbmFnZSBhIFdvcmtkaXJDb250ZXh0IGZvciBlYWNoIG9wZW4gZGlyZWN0b3J5LlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBXb3JrZGlyQ29udGV4dFBvb2wge1xuXG4gIC8qKlxuICAgKiBPcHRpb25zIHdpbGwgYmUgcGFzc2VkIHRvIGVhY2ggYFdvcmtkaXJDb250ZXh0YCBhcyBpdCBpcyBjcmVhdGVkLlxuICAgKi9cbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5vcHRpb25zID0gb3B0aW9ucztcblxuICAgIHRoaXMuY29udGV4dHMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5lbWl0dGVyID0gbmV3IEVtaXR0ZXIoKTtcbiAgfVxuXG4gIHNpemUoKSB7XG4gICAgcmV0dXJuIHRoaXMuY29udGV4dHMuc2l6ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBY2Nlc3MgdGhlIGNvbnRleHQgbWFwcGVkIHRvIGEga25vd24gZGlyZWN0b3J5LlxuICAgKi9cbiAgZ2V0Q29udGV4dChkaXJlY3RvcnkpIHtcbiAgICBjb25zdCB7cGlwZWxpbmVNYW5hZ2VyfSA9IHRoaXMub3B0aW9ucztcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0cy5nZXQoZGlyZWN0b3J5KSB8fCBXb3JrZGlyQ29udGV4dC5hYnNlbnQoe3BpcGVsaW5lTWFuYWdlcn0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiBhIFdvcmtkaXJDb250ZXh0IHdob3NlIFJlcG9zaXRvcnkgaGFzIGF0IGxlYXN0IG9uZSByZW1vdGUgY29uZmlndXJlZCB0byBwdXNoIHRvIHRoZSBuYW1lZCBHaXRIdWIgcmVwb3NpdG9yeS5cbiAgICogUmV0dXJucyBhIG51bGwgY29udGV4dCBpZiB6ZXJvIG9yIG1vcmUgdGhhbiBvbmUgY29udGV4dHMgbWF0Y2guXG4gICAqL1xuICBhc3luYyBnZXRNYXRjaGluZ0NvbnRleHQoaG9zdCwgb3duZXIsIHJlcG8pIHtcbiAgICBjb25zdCBtYXRjaGVzID0gYXdhaXQgUHJvbWlzZS5hbGwoXG4gICAgICB0aGlzLndpdGhSZXNpZGVudENvbnRleHRzKGFzeW5jIChfd29ya2RpciwgY29udGV4dCkgPT4ge1xuICAgICAgICBjb25zdCBtYXRjaCA9IGF3YWl0IGNvbnRleHQuZ2V0UmVwb3NpdG9yeSgpLmhhc0dpdEh1YlJlbW90ZShob3N0LCBvd25lciwgcmVwbyk7XG4gICAgICAgIHJldHVybiBtYXRjaCA/IGNvbnRleHQgOiBudWxsO1xuICAgICAgfSksXG4gICAgKTtcbiAgICBjb25zdCBmaWx0ZXJlZCA9IG1hdGNoZXMuZmlsdGVyKEJvb2xlYW4pO1xuXG4gICAgcmV0dXJuIGZpbHRlcmVkLmxlbmd0aCA9PT0gMSA/IGZpbHRlcmVkWzBdIDogV29ya2RpckNvbnRleHQuYWJzZW50KHsuLi50aGlzLm9wdGlvbnN9KTtcbiAgfVxuXG4gIGFkZChkaXJlY3RvcnksIG9wdGlvbnMgPSB7fSwgc2lsZW5jZUVtaXR0ZXIgPSBmYWxzZSkge1xuICAgIGlmICh0aGlzLmNvbnRleHRzLmhhcyhkaXJlY3RvcnkpKSB7XG4gICAgICByZXR1cm4gdGhpcy5nZXRDb250ZXh0KGRpcmVjdG9yeSk7XG4gICAgfVxuXG4gICAgY29uc3QgY29udGV4dCA9IG5ldyBXb3JrZGlyQ29udGV4dChkaXJlY3RvcnksIHsuLi50aGlzLm9wdGlvbnMsIC4uLm9wdGlvbnN9KTtcbiAgICB0aGlzLmNvbnRleHRzLnNldChkaXJlY3RvcnksIGNvbnRleHQpO1xuXG4gICAgY29uc3QgZGlzcG9zYWJsZSA9IGNvbnRleHQuc3VicztcblxuICAgIGNvbnN0IGZvcndhcmRFdmVudCA9IChzdWJNZXRob2QsIGVtaXRFdmVudE5hbWUpID0+IHtcbiAgICAgIGNvbnN0IGVtaXQgPSAoKSA9PiB0aGlzLmVtaXR0ZXIuZW1pdChlbWl0RXZlbnROYW1lLCBjb250ZXh0KTtcbiAgICAgIGRpc3Bvc2FibGUuYWRkKGNvbnRleHRbc3ViTWV0aG9kXShlbWl0KSk7XG4gICAgfTtcblxuICAgIGZvcndhcmRFdmVudCgnb25EaWRTdGFydE9ic2VydmVyJywgJ2RpZC1zdGFydC1vYnNlcnZlcicpO1xuICAgIGZvcndhcmRFdmVudCgnb25EaWRDaGFuZ2VXb3JrZGlyT3JIZWFkJywgJ2RpZC1jaGFuZ2Utd29ya2Rpci1vci1oZWFkJyk7XG4gICAgZm9yd2FyZEV2ZW50KCdvbkRpZENoYW5nZVJlcG9zaXRvcnlTdGF0ZScsICdkaWQtY2hhbmdlLXJlcG9zaXRvcnktc3RhdGUnKTtcbiAgICBmb3J3YXJkRXZlbnQoJ29uRGlkVXBkYXRlUmVwb3NpdG9yeScsICdkaWQtdXBkYXRlLXJlcG9zaXRvcnknKTtcbiAgICBmb3J3YXJkRXZlbnQoJ29uRGlkRGVzdHJveVJlcG9zaXRvcnknLCAnZGlkLWRlc3Ryb3ktcmVwb3NpdG9yeScpO1xuXG4gICAgLy8gUHJvcGFnYXRlIGdsb2JhbCBjYWNoZSBpbnZhbGlkYXRpb25zIGFjcm9zcyBhbGwgcmVzaWRlbnQgY29udGV4dHNcbiAgICBkaXNwb3NhYmxlLmFkZChjb250ZXh0LmdldFJlcG9zaXRvcnkoKS5vbkRpZEdsb2JhbGx5SW52YWxpZGF0ZShzcGVjID0+IHtcbiAgICAgIHRoaXMud2l0aFJlc2lkZW50Q29udGV4dHMoKF93b3JrZGlyLCBlYWNoQ29udGV4dCkgPT4ge1xuICAgICAgICBpZiAoZWFjaENvbnRleHQgIT09IGNvbnRleHQpIHtcbiAgICAgICAgICBlYWNoQ29udGV4dC5nZXRSZXBvc2l0b3J5KCkuYWNjZXB0SW52YWxpZGF0aW9uKHNwZWMpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KSk7XG5cbiAgICBpZiAoIXNpbGVuY2VFbWl0dGVyKSB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1jb250ZXh0cycsIHthZGRlZDogbmV3IFNldChbZGlyZWN0b3J5XSl9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gY29udGV4dDtcbiAgfVxuXG4gIHJlcGxhY2UoZGlyZWN0b3J5LCBvcHRpb25zID0ge30sIHNpbGVuY2VFbWl0dGVyID0gZmFsc2UpIHtcbiAgICB0aGlzLnJlbW92ZShkaXJlY3RvcnksIHRydWUpO1xuICAgIHRoaXMuYWRkKGRpcmVjdG9yeSwgb3B0aW9ucywgdHJ1ZSk7XG5cbiAgICBpZiAoIXNpbGVuY2VFbWl0dGVyKSB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1jb250ZXh0cycsIHthbHRlcmVkOiBuZXcgU2V0KFtkaXJlY3RvcnldKX0pO1xuICAgIH1cbiAgfVxuXG4gIHJlbW92ZShkaXJlY3RvcnksIHNpbGVuY2VFbWl0dGVyID0gZmFsc2UpIHtcbiAgICBjb25zdCBleGlzdGluZyA9IHRoaXMuY29udGV4dHMuZ2V0KGRpcmVjdG9yeSk7XG4gICAgdGhpcy5jb250ZXh0cy5kZWxldGUoZGlyZWN0b3J5KTtcblxuICAgIGlmIChleGlzdGluZykge1xuICAgICAgZXhpc3RpbmcuZGVzdHJveSgpO1xuXG4gICAgICBpZiAoIXNpbGVuY2VFbWl0dGVyKSB7XG4gICAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWNvbnRleHRzJywge3JlbW92ZWQ6IG5ldyBTZXQoW2RpcmVjdG9yeV0pfSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgc2V0KGRpcmVjdG9yaWVzLCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBwcmV2aW91cyA9IG5ldyBTZXQodGhpcy5jb250ZXh0cy5rZXlzKCkpO1xuICAgIGNvbnN0IHthZGRlZCwgcmVtb3ZlZH0gPSBjb21wYXJlU2V0cyhwcmV2aW91cywgZGlyZWN0b3JpZXMpO1xuXG4gICAgZm9yIChjb25zdCBkaXJlY3Rvcnkgb2YgYWRkZWQpIHtcbiAgICAgIHRoaXMuYWRkKGRpcmVjdG9yeSwgb3B0aW9ucywgdHJ1ZSk7XG4gICAgfVxuICAgIGZvciAoY29uc3QgZGlyZWN0b3J5IG9mIHJlbW92ZWQpIHtcbiAgICAgIHRoaXMucmVtb3ZlKGRpcmVjdG9yeSwgdHJ1ZSk7XG4gICAgfVxuXG4gICAgaWYgKGFkZGVkLnNpemUgIT09IDAgfHwgcmVtb3ZlZC5zaXplICE9PSAwKSB7XG4gICAgICB0aGlzLmVtaXR0ZXIuZW1pdCgnZGlkLWNoYW5nZS1jb250ZXh0cycsIHthZGRlZCwgcmVtb3ZlZH0pO1xuICAgIH1cbiAgfVxuXG4gIGdldEN1cnJlbnRXb3JrRGlycygpIHtcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0cy5rZXlzKCk7XG4gIH1cblxuICB3aXRoUmVzaWRlbnRDb250ZXh0cyhjYWxsYmFjaykge1xuICAgIGNvbnN0IHJlc3VsdHMgPSBbXTtcbiAgICBmb3IgKGNvbnN0IFt3b3JrZGlyLCBjb250ZXh0XSBvZiB0aGlzLmNvbnRleHRzKSB7XG4gICAgICByZXN1bHRzLnB1c2goY2FsbGJhY2sod29ya2RpciwgY29udGV4dCkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0cztcbiAgfVxuXG4gIG9uRGlkU3RhcnRPYnNlcnZlcihjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1zdGFydC1vYnNlcnZlcicsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9uRGlkQ2hhbmdlUG9vbENvbnRleHRzKGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWNoYW5nZS1jb250ZXh0cycsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIG9uRGlkQ2hhbmdlV29ya2Rpck9ySGVhZChjYWxsYmFjaykge1xuICAgIHJldHVybiB0aGlzLmVtaXR0ZXIub24oJ2RpZC1jaGFuZ2Utd29ya2Rpci1vci1oZWFkJywgY2FsbGJhY2spO1xuICB9XG5cbiAgb25EaWRDaGFuZ2VSZXBvc2l0b3J5U3RhdGUoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtY2hhbmdlLXJlcG9zaXRvcnktc3RhdGUnLCBjYWxsYmFjayk7XG4gIH1cblxuICBvbkRpZFVwZGF0ZVJlcG9zaXRvcnkoY2FsbGJhY2spIHtcbiAgICByZXR1cm4gdGhpcy5lbWl0dGVyLm9uKCdkaWQtdXBkYXRlLXJlcG9zaXRvcnknLCBjYWxsYmFjayk7XG4gIH1cblxuICBvbkRpZERlc3Ryb3lSZXBvc2l0b3J5KGNhbGxiYWNrKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1pdHRlci5vbignZGlkLWRlc3Ryb3ktcmVwb3NpdG9yeScsIGNhbGxiYWNrKTtcbiAgfVxuXG4gIGNsZWFyKCkge1xuICAgIGNvbnN0IHdvcmtkaXJzID0gbmV3IFNldCgpO1xuXG4gICAgdGhpcy53aXRoUmVzaWRlbnRDb250ZXh0cyh3b3JrZGlyID0+IHtcbiAgICAgIHRoaXMucmVtb3ZlKHdvcmtkaXIsIHRydWUpO1xuICAgICAgd29ya2RpcnMuYWRkKHdvcmtkaXIpO1xuICAgIH0pO1xuXG4gICAgV29ya2RpckNvbnRleHQuZGVzdHJveUFic2VudCgpO1xuXG4gICAgaWYgKHdvcmtkaXJzLnNpemUgIT09IDApIHtcbiAgICAgIHRoaXMuZW1pdHRlci5lbWl0KCdkaWQtY2hhbmdlLWNvbnRleHRzJywge3JlbW92ZWQ6IHdvcmtkaXJzfSk7XG4gICAgfVxuICB9XG59XG4iXX0=