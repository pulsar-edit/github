"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.ActionPipeline = void 0;
exports.getNullActionPipelineManager = getNullActionPipelineManager;

function partial(fn, ...args) {
  return function wrapped() {
    return fn(...args);
  };
}

class ActionPipeline {
  constructor(actionKey) {
    this.actionKey = actionKey;
    this.middleware = [];
  }

  run(fn, repository, ...args) {
    const pipelineFn = this.middleware.map(middleware => middleware.fn).reduceRight((acc, nextFn) => partial(nextFn, acc, repository, ...args), partial(fn, ...args));
    return pipelineFn(...args);
  }

  addMiddleware(name, fn) {
    if (!name) {
      throw new Error('Middleware must be registered with a unique middleware name');
    }

    if (this.middleware.find(middleware => middleware.name === name)) {
      throw new Error(`A middleware with the name ${name} is already registered`);
    }

    this.middleware.push({
      name,
      fn
    });
  }

}

exports.ActionPipeline = ActionPipeline;

class ActionPipelineManager {
  constructor({
    actionNames
  } = {
    actionNames: []
  }) {
    this.pipelines = new Map();
    this.actionKeys = {};
    actionNames.forEach(actionName => {
      const actionKey = Symbol(actionName);
      this.actionKeys[actionName] = actionKey;
      this.pipelines.set(actionKey, new ActionPipeline(actionKey));
    });
  }

  getPipeline(actionKey) {
    const pipeline = this.pipelines.get(actionKey);

    if (actionKey && pipeline) {
      return pipeline;
    } else {
      throw new Error(`${actionKey} is not a known action`);
    }
  }

}

exports.default = ActionPipelineManager;

class NullActionPipeline extends ActionPipeline {
  run(fn, repository, ...args) {
    return fn(...args);
  }

  addMiddleware() {
    throw new Error('Cannot add middleware to a null pipeline');
  }

}

const nullPipeline = new NullActionPipeline();

class NullActionPipelineManager extends ActionPipelineManager {
  getPipeline() {
    return nullPipeline;
  }

}

const nullActionPipelineManager = new NullActionPipelineManager();

function getNullActionPipelineManager() {
  return nullActionPipelineManager;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9hY3Rpb24tcGlwZWxpbmUuanMiXSwibmFtZXMiOlsicGFydGlhbCIsImZuIiwiYXJncyIsIndyYXBwZWQiLCJBY3Rpb25QaXBlbGluZSIsImNvbnN0cnVjdG9yIiwiYWN0aW9uS2V5IiwibWlkZGxld2FyZSIsInJ1biIsInJlcG9zaXRvcnkiLCJwaXBlbGluZUZuIiwibWFwIiwicmVkdWNlUmlnaHQiLCJhY2MiLCJuZXh0Rm4iLCJhZGRNaWRkbGV3YXJlIiwibmFtZSIsIkVycm9yIiwiZmluZCIsInB1c2giLCJBY3Rpb25QaXBlbGluZU1hbmFnZXIiLCJhY3Rpb25OYW1lcyIsInBpcGVsaW5lcyIsIk1hcCIsImFjdGlvbktleXMiLCJmb3JFYWNoIiwiYWN0aW9uTmFtZSIsIlN5bWJvbCIsInNldCIsImdldFBpcGVsaW5lIiwicGlwZWxpbmUiLCJnZXQiLCJOdWxsQWN0aW9uUGlwZWxpbmUiLCJudWxsUGlwZWxpbmUiLCJOdWxsQWN0aW9uUGlwZWxpbmVNYW5hZ2VyIiwibnVsbEFjdGlvblBpcGVsaW5lTWFuYWdlciIsImdldE51bGxBY3Rpb25QaXBlbGluZU1hbmFnZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7O0FBQUEsU0FBU0EsT0FBVCxDQUFpQkMsRUFBakIsRUFBcUIsR0FBR0MsSUFBeEIsRUFBOEI7QUFDNUIsU0FBTyxTQUFTQyxPQUFULEdBQW1CO0FBQ3hCLFdBQU9GLEVBQUUsQ0FBQyxHQUFHQyxJQUFKLENBQVQ7QUFDRCxHQUZEO0FBR0Q7O0FBRU0sTUFBTUUsY0FBTixDQUFxQjtBQUMxQkMsRUFBQUEsV0FBVyxDQUFDQyxTQUFELEVBQVk7QUFDckIsU0FBS0EsU0FBTCxHQUFpQkEsU0FBakI7QUFDQSxTQUFLQyxVQUFMLEdBQWtCLEVBQWxCO0FBQ0Q7O0FBRURDLEVBQUFBLEdBQUcsQ0FBQ1AsRUFBRCxFQUFLUSxVQUFMLEVBQWlCLEdBQUdQLElBQXBCLEVBQTBCO0FBQzNCLFVBQU1RLFVBQVUsR0FBRyxLQUFLSCxVQUFMLENBQ2hCSSxHQURnQixDQUNaSixVQUFVLElBQUlBLFVBQVUsQ0FBQ04sRUFEYixFQUVoQlcsV0FGZ0IsQ0FFSixDQUFDQyxHQUFELEVBQU1DLE1BQU4sS0FBaUJkLE9BQU8sQ0FBQ2MsTUFBRCxFQUFTRCxHQUFULEVBQWNKLFVBQWQsRUFBMEIsR0FBR1AsSUFBN0IsQ0FGcEIsRUFFd0RGLE9BQU8sQ0FBQ0MsRUFBRCxFQUFLLEdBQUdDLElBQVIsQ0FGL0QsQ0FBbkI7QUFHQSxXQUFPUSxVQUFVLENBQUMsR0FBR1IsSUFBSixDQUFqQjtBQUNEOztBQUVEYSxFQUFBQSxhQUFhLENBQUNDLElBQUQsRUFBT2YsRUFBUCxFQUFXO0FBQ3RCLFFBQUksQ0FBQ2UsSUFBTCxFQUFXO0FBQ1QsWUFBTSxJQUFJQyxLQUFKLENBQVUsNkRBQVYsQ0FBTjtBQUNEOztBQUVELFFBQUksS0FBS1YsVUFBTCxDQUFnQlcsSUFBaEIsQ0FBcUJYLFVBQVUsSUFBSUEsVUFBVSxDQUFDUyxJQUFYLEtBQW9CQSxJQUF2RCxDQUFKLEVBQWtFO0FBQ2hFLFlBQU0sSUFBSUMsS0FBSixDQUFXLDhCQUE2QkQsSUFBSyx3QkFBN0MsQ0FBTjtBQUNEOztBQUVELFNBQUtULFVBQUwsQ0FBZ0JZLElBQWhCLENBQXFCO0FBQUNILE1BQUFBLElBQUQ7QUFBT2YsTUFBQUE7QUFBUCxLQUFyQjtBQUNEOztBQXZCeUI7Ozs7QUEwQmIsTUFBTW1CLHFCQUFOLENBQTRCO0FBQ3pDZixFQUFBQSxXQUFXLENBQUM7QUFBQ2dCLElBQUFBO0FBQUQsTUFBZ0I7QUFBQ0EsSUFBQUEsV0FBVyxFQUFFO0FBQWQsR0FBakIsRUFBb0M7QUFDN0MsU0FBS0MsU0FBTCxHQUFpQixJQUFJQyxHQUFKLEVBQWpCO0FBQ0EsU0FBS0MsVUFBTCxHQUFrQixFQUFsQjtBQUNBSCxJQUFBQSxXQUFXLENBQUNJLE9BQVosQ0FBb0JDLFVBQVUsSUFBSTtBQUNoQyxZQUFNcEIsU0FBUyxHQUFHcUIsTUFBTSxDQUFDRCxVQUFELENBQXhCO0FBQ0EsV0FBS0YsVUFBTCxDQUFnQkUsVUFBaEIsSUFBOEJwQixTQUE5QjtBQUNBLFdBQUtnQixTQUFMLENBQWVNLEdBQWYsQ0FBbUJ0QixTQUFuQixFQUE4QixJQUFJRixjQUFKLENBQW1CRSxTQUFuQixDQUE5QjtBQUNELEtBSkQ7QUFLRDs7QUFFRHVCLEVBQUFBLFdBQVcsQ0FBQ3ZCLFNBQUQsRUFBWTtBQUNyQixVQUFNd0IsUUFBUSxHQUFHLEtBQUtSLFNBQUwsQ0FBZVMsR0FBZixDQUFtQnpCLFNBQW5CLENBQWpCOztBQUNBLFFBQUlBLFNBQVMsSUFBSXdCLFFBQWpCLEVBQTJCO0FBQ3pCLGFBQU9BLFFBQVA7QUFDRCxLQUZELE1BRU87QUFDTCxZQUFNLElBQUliLEtBQUosQ0FBVyxHQUFFWCxTQUFVLHdCQUF2QixDQUFOO0FBQ0Q7QUFDRjs7QUFsQndDOzs7O0FBc0IzQyxNQUFNMEIsa0JBQU4sU0FBaUM1QixjQUFqQyxDQUFnRDtBQUM5Q0ksRUFBQUEsR0FBRyxDQUFDUCxFQUFELEVBQUtRLFVBQUwsRUFBaUIsR0FBR1AsSUFBcEIsRUFBMEI7QUFDM0IsV0FBT0QsRUFBRSxDQUFDLEdBQUdDLElBQUosQ0FBVDtBQUNEOztBQUVEYSxFQUFBQSxhQUFhLEdBQUc7QUFDZCxVQUFNLElBQUlFLEtBQUosQ0FBVSwwQ0FBVixDQUFOO0FBQ0Q7O0FBUDZDOztBQVVoRCxNQUFNZ0IsWUFBWSxHQUFHLElBQUlELGtCQUFKLEVBQXJCOztBQUVBLE1BQU1FLHlCQUFOLFNBQXdDZCxxQkFBeEMsQ0FBOEQ7QUFDNURTLEVBQUFBLFdBQVcsR0FBRztBQUNaLFdBQU9JLFlBQVA7QUFDRDs7QUFIMkQ7O0FBTTlELE1BQU1FLHlCQUF5QixHQUFHLElBQUlELHlCQUFKLEVBQWxDOztBQUNPLFNBQVNFLDRCQUFULEdBQXdDO0FBQzdDLFNBQU9ELHlCQUFQO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBwYXJ0aWFsKGZuLCAuLi5hcmdzKSB7XG4gIHJldHVybiBmdW5jdGlvbiB3cmFwcGVkKCkge1xuICAgIHJldHVybiBmbiguLi5hcmdzKTtcbiAgfTtcbn1cblxuZXhwb3J0IGNsYXNzIEFjdGlvblBpcGVsaW5lIHtcbiAgY29uc3RydWN0b3IoYWN0aW9uS2V5KSB7XG4gICAgdGhpcy5hY3Rpb25LZXkgPSBhY3Rpb25LZXk7XG4gICAgdGhpcy5taWRkbGV3YXJlID0gW107XG4gIH1cblxuICBydW4oZm4sIHJlcG9zaXRvcnksIC4uLmFyZ3MpIHtcbiAgICBjb25zdCBwaXBlbGluZUZuID0gdGhpcy5taWRkbGV3YXJlXG4gICAgICAubWFwKG1pZGRsZXdhcmUgPT4gbWlkZGxld2FyZS5mbilcbiAgICAgIC5yZWR1Y2VSaWdodCgoYWNjLCBuZXh0Rm4pID0+IHBhcnRpYWwobmV4dEZuLCBhY2MsIHJlcG9zaXRvcnksIC4uLmFyZ3MpLCBwYXJ0aWFsKGZuLCAuLi5hcmdzKSk7XG4gICAgcmV0dXJuIHBpcGVsaW5lRm4oLi4uYXJncyk7XG4gIH1cblxuICBhZGRNaWRkbGV3YXJlKG5hbWUsIGZuKSB7XG4gICAgaWYgKCFuYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ01pZGRsZXdhcmUgbXVzdCBiZSByZWdpc3RlcmVkIHdpdGggYSB1bmlxdWUgbWlkZGxld2FyZSBuYW1lJyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubWlkZGxld2FyZS5maW5kKG1pZGRsZXdhcmUgPT4gbWlkZGxld2FyZS5uYW1lID09PSBuYW1lKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBIG1pZGRsZXdhcmUgd2l0aCB0aGUgbmFtZSAke25hbWV9IGlzIGFscmVhZHkgcmVnaXN0ZXJlZGApO1xuICAgIH1cblxuICAgIHRoaXMubWlkZGxld2FyZS5wdXNoKHtuYW1lLCBmbn0pO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFjdGlvblBpcGVsaW5lTWFuYWdlciB7XG4gIGNvbnN0cnVjdG9yKHthY3Rpb25OYW1lc30gPSB7YWN0aW9uTmFtZXM6IFtdfSkge1xuICAgIHRoaXMucGlwZWxpbmVzID0gbmV3IE1hcCgpO1xuICAgIHRoaXMuYWN0aW9uS2V5cyA9IHt9O1xuICAgIGFjdGlvbk5hbWVzLmZvckVhY2goYWN0aW9uTmFtZSA9PiB7XG4gICAgICBjb25zdCBhY3Rpb25LZXkgPSBTeW1ib2woYWN0aW9uTmFtZSk7XG4gICAgICB0aGlzLmFjdGlvbktleXNbYWN0aW9uTmFtZV0gPSBhY3Rpb25LZXk7XG4gICAgICB0aGlzLnBpcGVsaW5lcy5zZXQoYWN0aW9uS2V5LCBuZXcgQWN0aW9uUGlwZWxpbmUoYWN0aW9uS2V5KSk7XG4gICAgfSk7XG4gIH1cblxuICBnZXRQaXBlbGluZShhY3Rpb25LZXkpIHtcbiAgICBjb25zdCBwaXBlbGluZSA9IHRoaXMucGlwZWxpbmVzLmdldChhY3Rpb25LZXkpO1xuICAgIGlmIChhY3Rpb25LZXkgJiYgcGlwZWxpbmUpIHtcbiAgICAgIHJldHVybiBwaXBlbGluZTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGAke2FjdGlvbktleX0gaXMgbm90IGEga25vd24gYWN0aW9uYCk7XG4gICAgfVxuICB9XG59XG5cblxuY2xhc3MgTnVsbEFjdGlvblBpcGVsaW5lIGV4dGVuZHMgQWN0aW9uUGlwZWxpbmUge1xuICBydW4oZm4sIHJlcG9zaXRvcnksIC4uLmFyZ3MpIHtcbiAgICByZXR1cm4gZm4oLi4uYXJncyk7XG4gIH1cblxuICBhZGRNaWRkbGV3YXJlKCkge1xuICAgIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGFkZCBtaWRkbGV3YXJlIHRvIGEgbnVsbCBwaXBlbGluZScpO1xuICB9XG59XG5cbmNvbnN0IG51bGxQaXBlbGluZSA9IG5ldyBOdWxsQWN0aW9uUGlwZWxpbmUoKTtcblxuY2xhc3MgTnVsbEFjdGlvblBpcGVsaW5lTWFuYWdlciBleHRlbmRzIEFjdGlvblBpcGVsaW5lTWFuYWdlciB7XG4gIGdldFBpcGVsaW5lKCkge1xuICAgIHJldHVybiBudWxsUGlwZWxpbmU7XG4gIH1cbn1cblxuY29uc3QgbnVsbEFjdGlvblBpcGVsaW5lTWFuYWdlciA9IG5ldyBOdWxsQWN0aW9uUGlwZWxpbmVNYW5hZ2VyKCk7XG5leHBvcnQgZnVuY3Rpb24gZ2V0TnVsbEFjdGlvblBpcGVsaW5lTWFuYWdlcigpIHtcbiAgcmV0dXJuIG51bGxBY3Rpb25QaXBlbGluZU1hbmFnZXI7XG59XG4iXX0=