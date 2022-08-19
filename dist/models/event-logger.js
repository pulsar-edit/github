"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _electron = require("electron");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let headless = null;

class EventLogger {
  constructor(kind) {
    this.kind = kind;
    this.directory = '<unknown>';
    this.shortDirectory = '<unknown>';

    if (headless === null) {
      headless = !_electron.remote.getCurrentWindow().isVisible();
    }
  }

  showStarted(directory, implementation) {
    this.directory = directory;
    this.shortDirectory = directory.split(_path.default.sep).slice(-2).join(_path.default.sep);

    if (!this.isEnabled()) {
      return;
    }

    this.shortLog(`${implementation} watcher started`);
  }

  showEvents(events) {
    if (!this.isEnabled()) {
      return;
    }

    const uniqueRelativeNames = new Set(events.map(event => {
      return _path.default.relative(this.directory, event.path);
    }));
    const fileNames = Array.from(uniqueRelativeNames).slice(0, 3);
    const elipses = uniqueRelativeNames.size > 3 ? '...' : '';
    const summary = `${this.getShortName()}: ${fileNames.join(', ')}${elipses}`;
    /* eslint-disable no-console */

    if (headless) {
      const eventText = events.map(event => {
        if (event.action === 'renamed') {
          return `  ${event.oldPath} => ${event.path} (${event.action})\n`;
        } else {
          return `  ${event.path} (${event.action})\n`;
        }
      }).join('\n');
      console.log(summary + '\n' + eventText);
    } else {
      console.groupCollapsed(summary);
      console.table(events, ['action', 'path', 'oldPath']);
      console.groupEnd();
    }
    /* eslint-enable no-console */

  }

  showFocusEvent() {
    if (!this.isEnabled()) {
      return;
    }

    this.shortLog('focus triggered');
  }

  showWorkdirOrHeadEvents() {
    if (!this.isEnabled()) {
      return;
    }

    this.shortLog('working directory or HEAD change');
  }

  showStopped() {
    if (!this.isEnabled()) {
      return;
    }

    this.shortLog('stopped');
  }

  isEnabled() {
    return process.env.ATOM_GITHUB_FS_EVENT_LOG || atom.config.get('github.filesystemEventDiagnostics');
  }

  getShortName() {
    return `${this.kind} @ ${this.shortDirectory}`;
  }

  shortLog(line) {
    if (headless) {
      // eslint-disable-next-line no-console
      console.log(`${this.getShortName()}: ${line}`);
      return;
    } // eslint-disable-next-line no-console


    console.log('%c%s%c: %s', 'font-weight: bold; color: blue;', this.getShortName(), 'font-weight: normal; color: black;', line);
  }

}

exports.default = EventLogger;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9tb2RlbHMvZXZlbnQtbG9nZ2VyLmpzIl0sIm5hbWVzIjpbImhlYWRsZXNzIiwiRXZlbnRMb2dnZXIiLCJjb25zdHJ1Y3RvciIsImtpbmQiLCJkaXJlY3RvcnkiLCJzaG9ydERpcmVjdG9yeSIsInJlbW90ZSIsImdldEN1cnJlbnRXaW5kb3ciLCJpc1Zpc2libGUiLCJzaG93U3RhcnRlZCIsImltcGxlbWVudGF0aW9uIiwic3BsaXQiLCJwYXRoIiwic2VwIiwic2xpY2UiLCJqb2luIiwiaXNFbmFibGVkIiwic2hvcnRMb2ciLCJzaG93RXZlbnRzIiwiZXZlbnRzIiwidW5pcXVlUmVsYXRpdmVOYW1lcyIsIlNldCIsIm1hcCIsImV2ZW50IiwicmVsYXRpdmUiLCJmaWxlTmFtZXMiLCJBcnJheSIsImZyb20iLCJlbGlwc2VzIiwic2l6ZSIsInN1bW1hcnkiLCJnZXRTaG9ydE5hbWUiLCJldmVudFRleHQiLCJhY3Rpb24iLCJvbGRQYXRoIiwiY29uc29sZSIsImxvZyIsImdyb3VwQ29sbGFwc2VkIiwidGFibGUiLCJncm91cEVuZCIsInNob3dGb2N1c0V2ZW50Iiwic2hvd1dvcmtkaXJPckhlYWRFdmVudHMiLCJzaG93U3RvcHBlZCIsInByb2Nlc3MiLCJlbnYiLCJBVE9NX0dJVEhVQl9GU19FVkVOVF9MT0ciLCJhdG9tIiwiY29uZmlnIiwiZ2V0IiwibGluZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOzs7O0FBRUEsSUFBSUEsUUFBUSxHQUFHLElBQWY7O0FBRWUsTUFBTUMsV0FBTixDQUFrQjtBQUMvQkMsRUFBQUEsV0FBVyxDQUFDQyxJQUFELEVBQU87QUFDaEIsU0FBS0EsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsU0FBS0MsU0FBTCxHQUFpQixXQUFqQjtBQUNBLFNBQUtDLGNBQUwsR0FBc0IsV0FBdEI7O0FBRUEsUUFBSUwsUUFBUSxLQUFLLElBQWpCLEVBQXVCO0FBQ3JCQSxNQUFBQSxRQUFRLEdBQUcsQ0FBQ00saUJBQU9DLGdCQUFQLEdBQTBCQyxTQUExQixFQUFaO0FBQ0Q7QUFDRjs7QUFFREMsRUFBQUEsV0FBVyxDQUFDTCxTQUFELEVBQVlNLGNBQVosRUFBNEI7QUFDckMsU0FBS04sU0FBTCxHQUFpQkEsU0FBakI7QUFDQSxTQUFLQyxjQUFMLEdBQXNCRCxTQUFTLENBQUNPLEtBQVYsQ0FBZ0JDLGNBQUtDLEdBQXJCLEVBQTBCQyxLQUExQixDQUFnQyxDQUFDLENBQWpDLEVBQW9DQyxJQUFwQyxDQUF5Q0gsY0FBS0MsR0FBOUMsQ0FBdEI7O0FBRUEsUUFBSSxDQUFDLEtBQUtHLFNBQUwsRUFBTCxFQUF1QjtBQUNyQjtBQUNEOztBQUVELFNBQUtDLFFBQUwsQ0FBZSxHQUFFUCxjQUFlLGtCQUFoQztBQUNEOztBQUVEUSxFQUFBQSxVQUFVLENBQUNDLE1BQUQsRUFBUztBQUNqQixRQUFJLENBQUMsS0FBS0gsU0FBTCxFQUFMLEVBQXVCO0FBQ3JCO0FBQ0Q7O0FBRUQsVUFBTUksbUJBQW1CLEdBQUcsSUFBSUMsR0FBSixDQUFRRixNQUFNLENBQUNHLEdBQVAsQ0FBV0MsS0FBSyxJQUFJO0FBQ3RELGFBQU9YLGNBQUtZLFFBQUwsQ0FBYyxLQUFLcEIsU0FBbkIsRUFBOEJtQixLQUFLLENBQUNYLElBQXBDLENBQVA7QUFDRCxLQUZtQyxDQUFSLENBQTVCO0FBSUEsVUFBTWEsU0FBUyxHQUFHQyxLQUFLLENBQUNDLElBQU4sQ0FBV1AsbUJBQVgsRUFBZ0NOLEtBQWhDLENBQXNDLENBQXRDLEVBQXlDLENBQXpDLENBQWxCO0FBQ0EsVUFBTWMsT0FBTyxHQUFHUixtQkFBbUIsQ0FBQ1MsSUFBcEIsR0FBMkIsQ0FBM0IsR0FBK0IsS0FBL0IsR0FBdUMsRUFBdkQ7QUFDQSxVQUFNQyxPQUFPLEdBQUksR0FBRSxLQUFLQyxZQUFMLEVBQW9CLEtBQUlOLFNBQVMsQ0FBQ1YsSUFBVixDQUFlLElBQWYsQ0FBcUIsR0FBRWEsT0FBUSxFQUExRTtBQUVBOztBQUNBLFFBQUk1QixRQUFKLEVBQWM7QUFDWixZQUFNZ0MsU0FBUyxHQUFHYixNQUFNLENBQUNHLEdBQVAsQ0FBV0MsS0FBSyxJQUFJO0FBQ3BDLFlBQUlBLEtBQUssQ0FBQ1UsTUFBTixLQUFpQixTQUFyQixFQUFnQztBQUM5QixpQkFBUSxLQUFJVixLQUFLLENBQUNXLE9BQVEsT0FBTVgsS0FBSyxDQUFDWCxJQUFLLEtBQUlXLEtBQUssQ0FBQ1UsTUFBTyxLQUE1RDtBQUNELFNBRkQsTUFFTztBQUNMLGlCQUFRLEtBQUlWLEtBQUssQ0FBQ1gsSUFBSyxLQUFJVyxLQUFLLENBQUNVLE1BQU8sS0FBeEM7QUFDRDtBQUNGLE9BTmlCLEVBTWZsQixJQU5lLENBTVYsSUFOVSxDQUFsQjtBQU9Bb0IsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQVlOLE9BQU8sR0FBRyxJQUFWLEdBQWlCRSxTQUE3QjtBQUNELEtBVEQsTUFTTztBQUNMRyxNQUFBQSxPQUFPLENBQUNFLGNBQVIsQ0FBdUJQLE9BQXZCO0FBQ0FLLE1BQUFBLE9BQU8sQ0FBQ0csS0FBUixDQUFjbkIsTUFBZCxFQUFzQixDQUFDLFFBQUQsRUFBVyxNQUFYLEVBQW1CLFNBQW5CLENBQXRCO0FBQ0FnQixNQUFBQSxPQUFPLENBQUNJLFFBQVI7QUFDRDtBQUNEOztBQUNEOztBQUVEQyxFQUFBQSxjQUFjLEdBQUc7QUFDZixRQUFJLENBQUMsS0FBS3hCLFNBQUwsRUFBTCxFQUF1QjtBQUNyQjtBQUNEOztBQUVELFNBQUtDLFFBQUwsQ0FBYyxpQkFBZDtBQUNEOztBQUVEd0IsRUFBQUEsdUJBQXVCLEdBQUc7QUFDeEIsUUFBSSxDQUFDLEtBQUt6QixTQUFMLEVBQUwsRUFBdUI7QUFDckI7QUFDRDs7QUFFRCxTQUFLQyxRQUFMLENBQWMsa0NBQWQ7QUFDRDs7QUFFRHlCLEVBQUFBLFdBQVcsR0FBRztBQUNaLFFBQUksQ0FBQyxLQUFLMUIsU0FBTCxFQUFMLEVBQXVCO0FBQ3JCO0FBQ0Q7O0FBRUQsU0FBS0MsUUFBTCxDQUFjLFNBQWQ7QUFDRDs7QUFFREQsRUFBQUEsU0FBUyxHQUFHO0FBQ1YsV0FBTzJCLE9BQU8sQ0FBQ0MsR0FBUixDQUFZQyx3QkFBWixJQUF3Q0MsSUFBSSxDQUFDQyxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsbUNBQWhCLENBQS9DO0FBQ0Q7O0FBRURqQixFQUFBQSxZQUFZLEdBQUc7QUFDYixXQUFRLEdBQUUsS0FBSzVCLElBQUssTUFBSyxLQUFLRSxjQUFlLEVBQTdDO0FBQ0Q7O0FBRURZLEVBQUFBLFFBQVEsQ0FBQ2dDLElBQUQsRUFBTztBQUNiLFFBQUlqRCxRQUFKLEVBQWM7QUFDWjtBQUNBbUMsTUFBQUEsT0FBTyxDQUFDQyxHQUFSLENBQWEsR0FBRSxLQUFLTCxZQUFMLEVBQW9CLEtBQUlrQixJQUFLLEVBQTVDO0FBQ0E7QUFDRCxLQUxZLENBT2I7OztBQUNBZCxJQUFBQSxPQUFPLENBQUNDLEdBQVIsQ0FBWSxZQUFaLEVBQ0UsaUNBREYsRUFFRSxLQUFLTCxZQUFMLEVBRkYsRUFHRSxvQ0FIRixFQUlFa0IsSUFKRjtBQU1EOztBQW5HOEIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCB7cmVtb3RlfSBmcm9tICdlbGVjdHJvbic7XG5cbmxldCBoZWFkbGVzcyA9IG51bGw7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50TG9nZ2VyIHtcbiAgY29uc3RydWN0b3Ioa2luZCkge1xuICAgIHRoaXMua2luZCA9IGtpbmQ7XG4gICAgdGhpcy5kaXJlY3RvcnkgPSAnPHVua25vd24+JztcbiAgICB0aGlzLnNob3J0RGlyZWN0b3J5ID0gJzx1bmtub3duPic7XG5cbiAgICBpZiAoaGVhZGxlc3MgPT09IG51bGwpIHtcbiAgICAgIGhlYWRsZXNzID0gIXJlbW90ZS5nZXRDdXJyZW50V2luZG93KCkuaXNWaXNpYmxlKCk7XG4gICAgfVxuICB9XG5cbiAgc2hvd1N0YXJ0ZWQoZGlyZWN0b3J5LCBpbXBsZW1lbnRhdGlvbikge1xuICAgIHRoaXMuZGlyZWN0b3J5ID0gZGlyZWN0b3J5O1xuICAgIHRoaXMuc2hvcnREaXJlY3RvcnkgPSBkaXJlY3Rvcnkuc3BsaXQocGF0aC5zZXApLnNsaWNlKC0yKS5qb2luKHBhdGguc2VwKTtcblxuICAgIGlmICghdGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2hvcnRMb2coYCR7aW1wbGVtZW50YXRpb259IHdhdGNoZXIgc3RhcnRlZGApO1xuICB9XG5cbiAgc2hvd0V2ZW50cyhldmVudHMpIHtcbiAgICBpZiAoIXRoaXMuaXNFbmFibGVkKCkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB1bmlxdWVSZWxhdGl2ZU5hbWVzID0gbmV3IFNldChldmVudHMubWFwKGV2ZW50ID0+IHtcbiAgICAgIHJldHVybiBwYXRoLnJlbGF0aXZlKHRoaXMuZGlyZWN0b3J5LCBldmVudC5wYXRoKTtcbiAgICB9KSk7XG5cbiAgICBjb25zdCBmaWxlTmFtZXMgPSBBcnJheS5mcm9tKHVuaXF1ZVJlbGF0aXZlTmFtZXMpLnNsaWNlKDAsIDMpO1xuICAgIGNvbnN0IGVsaXBzZXMgPSB1bmlxdWVSZWxhdGl2ZU5hbWVzLnNpemUgPiAzID8gJy4uLicgOiAnJztcbiAgICBjb25zdCBzdW1tYXJ5ID0gYCR7dGhpcy5nZXRTaG9ydE5hbWUoKX06ICR7ZmlsZU5hbWVzLmpvaW4oJywgJyl9JHtlbGlwc2VzfWA7XG5cbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG4gICAgaWYgKGhlYWRsZXNzKSB7XG4gICAgICBjb25zdCBldmVudFRleHQgPSBldmVudHMubWFwKGV2ZW50ID0+IHtcbiAgICAgICAgaWYgKGV2ZW50LmFjdGlvbiA9PT0gJ3JlbmFtZWQnKSB7XG4gICAgICAgICAgcmV0dXJuIGAgICR7ZXZlbnQub2xkUGF0aH0gPT4gJHtldmVudC5wYXRofSAoJHtldmVudC5hY3Rpb259KVxcbmA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGAgICR7ZXZlbnQucGF0aH0gKCR7ZXZlbnQuYWN0aW9ufSlcXG5gO1xuICAgICAgICB9XG4gICAgICB9KS5qb2luKCdcXG4nKTtcbiAgICAgIGNvbnNvbGUubG9nKHN1bW1hcnkgKyAnXFxuJyArIGV2ZW50VGV4dCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQoc3VtbWFyeSk7XG4gICAgICBjb25zb2xlLnRhYmxlKGV2ZW50cywgWydhY3Rpb24nLCAncGF0aCcsICdvbGRQYXRoJ10pO1xuICAgICAgY29uc29sZS5ncm91cEVuZCgpO1xuICAgIH1cbiAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLWNvbnNvbGUgKi9cbiAgfVxuXG4gIHNob3dGb2N1c0V2ZW50KCkge1xuICAgIGlmICghdGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2hvcnRMb2coJ2ZvY3VzIHRyaWdnZXJlZCcpO1xuICB9XG5cbiAgc2hvd1dvcmtkaXJPckhlYWRFdmVudHMoKSB7XG4gICAgaWYgKCF0aGlzLmlzRW5hYmxlZCgpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5zaG9ydExvZygnd29ya2luZyBkaXJlY3Rvcnkgb3IgSEVBRCBjaGFuZ2UnKTtcbiAgfVxuXG4gIHNob3dTdG9wcGVkKCkge1xuICAgIGlmICghdGhpcy5pc0VuYWJsZWQoKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuc2hvcnRMb2coJ3N0b3BwZWQnKTtcbiAgfVxuXG4gIGlzRW5hYmxlZCgpIHtcbiAgICByZXR1cm4gcHJvY2Vzcy5lbnYuQVRPTV9HSVRIVUJfRlNfRVZFTlRfTE9HIHx8IGF0b20uY29uZmlnLmdldCgnZ2l0aHViLmZpbGVzeXN0ZW1FdmVudERpYWdub3N0aWNzJyk7XG4gIH1cblxuICBnZXRTaG9ydE5hbWUoKSB7XG4gICAgcmV0dXJuIGAke3RoaXMua2luZH0gQCAke3RoaXMuc2hvcnREaXJlY3Rvcnl9YDtcbiAgfVxuXG4gIHNob3J0TG9nKGxpbmUpIHtcbiAgICBpZiAoaGVhZGxlc3MpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICBjb25zb2xlLmxvZyhgJHt0aGlzLmdldFNob3J0TmFtZSgpfTogJHtsaW5lfWApO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgY29uc29sZS5sb2coJyVjJXMlYzogJXMnLFxuICAgICAgJ2ZvbnQtd2VpZ2h0OiBib2xkOyBjb2xvcjogYmx1ZTsnLFxuICAgICAgdGhpcy5nZXRTaG9ydE5hbWUoKSxcbiAgICAgICdmb250LXdlaWdodDogbm9ybWFsOyBjb2xvcjogYmxhY2s7JyxcbiAgICAgIGxpbmUsXG4gICAgKTtcbiAgfVxufVxuIl19