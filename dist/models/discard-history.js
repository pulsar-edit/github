"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _os = _interopRequireDefault(require("os"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _mkdirp = _interopRequireDefault(require("mkdirp"));

var _discardHistoryStores = require("./discard-history-stores");

var _helpers = require("../helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const emptyFilePath = _path.default.join(_os.default.tmpdir(), 'empty-file.txt');

const emptyFilePromise = _fsExtra.default.writeFile(emptyFilePath, '');

class DiscardHistory {
  constructor(createBlob, expandBlobToFile, mergeFile, workdirPath, {
    maxHistoryLength
  } = {}) {
    this.createBlob = createBlob;
    this.expandBlobToFile = expandBlobToFile;
    this.mergeFile = mergeFile;
    this.workdirPath = workdirPath;
    this.partialFileHistory = new _discardHistoryStores.PartialFileDiscardHistory(maxHistoryLength);
    this.wholeFileHistory = new _discardHistoryStores.WholeFileDiscardHistory(maxHistoryLength);
  }

  getLastSnapshots(partialDiscardFilePath = null) {
    if (partialDiscardFilePath) {
      return this.partialFileHistory.getLastSnapshotsForPath(partialDiscardFilePath);
    } else {
      return this.wholeFileHistory.getLastSnapshots();
    }
  }

  getHistory(partialDiscardFilePath = null) {
    if (partialDiscardFilePath) {
      return this.partialFileHistory.getHistoryForPath(partialDiscardFilePath);
    } else {
      return this.wholeFileHistory.getHistory();
    }
  }

  hasHistory(partialDiscardFilePath = null) {
    const history = this.getHistory(partialDiscardFilePath);
    return history.length > 0;
  }

  popHistory(partialDiscardFilePath = null) {
    if (partialDiscardFilePath) {
      return this.partialFileHistory.popHistoryForPath(partialDiscardFilePath);
    } else {
      return this.wholeFileHistory.popHistory();
    }
  }

  clearHistory(partialDiscardFilePath = null) {
    if (partialDiscardFilePath) {
      this.partialFileHistory.clearHistoryForPath(partialDiscardFilePath);
    } else {
      this.wholeFileHistory.clearHistory();
    }
  }

  updateHistory(history) {
    this.partialFileHistory.setHistory(history.partialFileHistory || {});
    this.wholeFileHistory.setHistory(history.wholeFileHistory || []);
  }

  async createHistoryBlob() {
    const histories = {
      wholeFileHistory: this.wholeFileHistory.getHistory(),
      partialFileHistory: this.partialFileHistory.getHistory()
    };
    const historySha = await this.createBlob({
      stdin: JSON.stringify(histories)
    });
    return historySha;
  }

  async storeBeforeAndAfterBlobs(filePaths, isSafe, destructiveAction, partialDiscardFilePath = null) {
    if (partialDiscardFilePath) {
      return await this.storeBlobsForPartialFileHistory(partialDiscardFilePath, isSafe, destructiveAction);
    } else {
      return await this.storeBlobsForWholeFileHistory(filePaths, isSafe, destructiveAction);
    }
  }

  async storeBlobsForPartialFileHistory(filePath, isSafe, destructiveAction) {
    const beforeSha = await this.createBlob({
      filePath
    });
    const isNotSafe = !(await isSafe());

    if (isNotSafe) {
      return null;
    }

    await destructiveAction();
    const afterSha = await this.createBlob({
      filePath
    });
    const snapshots = {
      beforeSha,
      afterSha
    };
    this.partialFileHistory.addHistory(filePath, snapshots);
    return snapshots;
  }

  async storeBlobsForWholeFileHistory(filePaths, isSafe, destructiveAction) {
    const snapshotsByPath = {};
    const beforePromises = filePaths.map(async filePath => {
      snapshotsByPath[filePath] = {
        beforeSha: await this.createBlob({
          filePath
        })
      };
    });
    await Promise.all(beforePromises);
    const isNotSafe = !(await isSafe());

    if (isNotSafe) {
      return null;
    }

    await destructiveAction();
    const afterPromises = filePaths.map(async filePath => {
      snapshotsByPath[filePath].afterSha = await this.createBlob({
        filePath
      });
    });
    await Promise.all(afterPromises);
    this.wholeFileHistory.addHistory(snapshotsByPath);
    return snapshotsByPath;
  }

  async restoreLastDiscardInTempFiles(isSafe, partialDiscardFilePath = null) {
    let lastDiscardSnapshots = this.getLastSnapshots(partialDiscardFilePath);

    if (partialDiscardFilePath) {
      lastDiscardSnapshots = lastDiscardSnapshots ? [lastDiscardSnapshots] : [];
    }

    const tempFolderPaths = await this.expandBlobsToFilesInTempFolder(lastDiscardSnapshots);

    if (!isSafe()) {
      return [];
    }

    return await this.mergeFiles(tempFolderPaths);
  }

  async expandBlobsToFilesInTempFolder(snapshots) {
    const tempFolderPath = await (0, _helpers.getTempDir)({
      prefix: 'github-discard-history-'
    });
    const pathPromises = snapshots.map(async ({
      filePath,
      beforeSha,
      afterSha
    }) => {
      const dir = _path.default.dirname(_path.default.join(tempFolderPath, filePath));

      await (0, _mkdirp.default)(dir);
      const theirsPath = !beforeSha ? null : await this.expandBlobToFile(_path.default.join(tempFolderPath, `${filePath}-before-discard`), beforeSha);
      const commonBasePath = !afterSha ? null : await this.expandBlobToFile(_path.default.join(tempFolderPath, `${filePath}-after-discard`), afterSha);

      const resultPath = _path.default.join(dir, `~${_path.default.basename(filePath)}-merge-result`);

      return {
        filePath,
        commonBasePath,
        theirsPath,
        resultPath,
        theirsSha: beforeSha,
        commonBaseSha: afterSha
      };
    });
    return await Promise.all(pathPromises);
  }

  async mergeFiles(filePaths) {
    const mergeFilePromises = filePaths.map(async (filePathInfo, i) => {
      const {
        filePath,
        commonBasePath,
        theirsPath,
        resultPath,
        theirsSha,
        commonBaseSha
      } = filePathInfo;
      const currentSha = await this.createBlob({
        filePath
      });
      let mergeResult;

      if (theirsPath && commonBasePath) {
        mergeResult = await this.mergeFile(filePath, commonBasePath, theirsPath, resultPath);
      } else if (!theirsPath && commonBasePath) {
        // deleted file
        const oursSha = await this.createBlob({
          filePath
        });

        if (oursSha === commonBaseSha) {
          // no changes since discard, mark file to be deleted
          mergeResult = {
            filePath,
            resultPath: null,
            deleted: true,
            conflict: false
          };
        } else {
          // changes since discard result in conflict
          await _fsExtra.default.copy(_path.default.join(this.workdirPath, filePath), resultPath);
          mergeResult = {
            filePath,
            resultPath,
            conflict: true
          };
        }
      } else if (theirsPath && !commonBasePath) {
        // added file
        const fileDoesExist = await (0, _helpers.fileExists)(_path.default.join(this.workdirPath, filePath));

        if (!fileDoesExist) {
          await _fsExtra.default.copy(theirsPath, resultPath);
          mergeResult = {
            filePath,
            resultPath,
            conflict: false
          };
        } else {
          await emptyFilePromise;
          mergeResult = await this.mergeFile(filePath, emptyFilePath, theirsPath, resultPath);
        }
      } else {
        throw new Error('One of the following must be defined - theirsPath:' + `${theirsPath} or commonBasePath: ${commonBasePath}`);
      }

      return _objectSpread({}, mergeResult, {
        theirsSha,
        commonBaseSha,
        currentSha
      });
    });
    return await Promise.all(mergeFilePromises);
  }

}

exports.default = DiscardHistory;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9tb2RlbHMvZGlzY2FyZC1oaXN0b3J5LmpzIl0sIm5hbWVzIjpbImVtcHR5RmlsZVBhdGgiLCJwYXRoIiwiam9pbiIsIm9zIiwidG1wZGlyIiwiZW1wdHlGaWxlUHJvbWlzZSIsImZzIiwid3JpdGVGaWxlIiwiRGlzY2FyZEhpc3RvcnkiLCJjb25zdHJ1Y3RvciIsImNyZWF0ZUJsb2IiLCJleHBhbmRCbG9iVG9GaWxlIiwibWVyZ2VGaWxlIiwid29ya2RpclBhdGgiLCJtYXhIaXN0b3J5TGVuZ3RoIiwicGFydGlhbEZpbGVIaXN0b3J5IiwiUGFydGlhbEZpbGVEaXNjYXJkSGlzdG9yeSIsIndob2xlRmlsZUhpc3RvcnkiLCJXaG9sZUZpbGVEaXNjYXJkSGlzdG9yeSIsImdldExhc3RTbmFwc2hvdHMiLCJwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoIiwiZ2V0TGFzdFNuYXBzaG90c0ZvclBhdGgiLCJnZXRIaXN0b3J5IiwiZ2V0SGlzdG9yeUZvclBhdGgiLCJoYXNIaXN0b3J5IiwiaGlzdG9yeSIsImxlbmd0aCIsInBvcEhpc3RvcnkiLCJwb3BIaXN0b3J5Rm9yUGF0aCIsImNsZWFySGlzdG9yeSIsImNsZWFySGlzdG9yeUZvclBhdGgiLCJ1cGRhdGVIaXN0b3J5Iiwic2V0SGlzdG9yeSIsImNyZWF0ZUhpc3RvcnlCbG9iIiwiaGlzdG9yaWVzIiwiaGlzdG9yeVNoYSIsInN0ZGluIiwiSlNPTiIsInN0cmluZ2lmeSIsInN0b3JlQmVmb3JlQW5kQWZ0ZXJCbG9icyIsImZpbGVQYXRocyIsImlzU2FmZSIsImRlc3RydWN0aXZlQWN0aW9uIiwic3RvcmVCbG9ic0ZvclBhcnRpYWxGaWxlSGlzdG9yeSIsInN0b3JlQmxvYnNGb3JXaG9sZUZpbGVIaXN0b3J5IiwiZmlsZVBhdGgiLCJiZWZvcmVTaGEiLCJpc05vdFNhZmUiLCJhZnRlclNoYSIsInNuYXBzaG90cyIsImFkZEhpc3RvcnkiLCJzbmFwc2hvdHNCeVBhdGgiLCJiZWZvcmVQcm9taXNlcyIsIm1hcCIsIlByb21pc2UiLCJhbGwiLCJhZnRlclByb21pc2VzIiwicmVzdG9yZUxhc3REaXNjYXJkSW5UZW1wRmlsZXMiLCJsYXN0RGlzY2FyZFNuYXBzaG90cyIsInRlbXBGb2xkZXJQYXRocyIsImV4cGFuZEJsb2JzVG9GaWxlc0luVGVtcEZvbGRlciIsIm1lcmdlRmlsZXMiLCJ0ZW1wRm9sZGVyUGF0aCIsInByZWZpeCIsInBhdGhQcm9taXNlcyIsImRpciIsImRpcm5hbWUiLCJ0aGVpcnNQYXRoIiwiY29tbW9uQmFzZVBhdGgiLCJyZXN1bHRQYXRoIiwiYmFzZW5hbWUiLCJ0aGVpcnNTaGEiLCJjb21tb25CYXNlU2hhIiwibWVyZ2VGaWxlUHJvbWlzZXMiLCJmaWxlUGF0aEluZm8iLCJpIiwiY3VycmVudFNoYSIsIm1lcmdlUmVzdWx0Iiwib3Vyc1NoYSIsImRlbGV0ZWQiLCJjb25mbGljdCIsImNvcHkiLCJmaWxlRG9lc0V4aXN0IiwiRXJyb3IiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFFQTs7QUFFQTs7Ozs7Ozs7OztBQUVBLE1BQU1BLGFBQWEsR0FBR0MsY0FBS0MsSUFBTCxDQUFVQyxZQUFHQyxNQUFILEVBQVYsRUFBdUIsZ0JBQXZCLENBQXRCOztBQUNBLE1BQU1DLGdCQUFnQixHQUFHQyxpQkFBR0MsU0FBSCxDQUFhUCxhQUFiLEVBQTRCLEVBQTVCLENBQXpCOztBQUVlLE1BQU1RLGNBQU4sQ0FBcUI7QUFDbENDLEVBQUFBLFdBQVcsQ0FBQ0MsVUFBRCxFQUFhQyxnQkFBYixFQUErQkMsU0FBL0IsRUFBMENDLFdBQTFDLEVBQXVEO0FBQUNDLElBQUFBO0FBQUQsTUFBcUIsRUFBNUUsRUFBZ0Y7QUFDekYsU0FBS0osVUFBTCxHQUFrQkEsVUFBbEI7QUFDQSxTQUFLQyxnQkFBTCxHQUF3QkEsZ0JBQXhCO0FBQ0EsU0FBS0MsU0FBTCxHQUFpQkEsU0FBakI7QUFDQSxTQUFLQyxXQUFMLEdBQW1CQSxXQUFuQjtBQUNBLFNBQUtFLGtCQUFMLEdBQTBC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QUtXLFdBQWYsRUFBNEJnQyxRQUE1QixDQUFYLENBQTVCOztBQUNBLFlBQUksQ0FBQ3FDLGFBQUwsRUFBb0I7QUFDbEIsZ0JBQU01RSxpQkFBRzJFLElBQUgsQ0FBUWQsVUFBUixFQUFvQkUsVUFBcEIsQ0FBTjtBQUNBUSxVQUFBQSxXQUFXLEdBQUc7QUFBQ2hDLFlBQUFBLFFBQUQ7QUFBV3dCLFlBQUFBLFVBQVg7QUFBdUJXLFlBQUFBLFFBQVEsRUFBRTtBQUFqQyxXQUFkO0FBQ0QsU0FIRCxNQUdPO0FBQ0wsZ0JBQU0zRSxnQkFBTjtBQUNBd0UsVUFBQUEsV0FBVyxHQUFHLE1BQU0sS0FBS2pFLFNBQUwsQ0FBZWlDLFFBQWYsRUFBeUI3QyxhQUF6QixFQUF3Q21FLFVBQXhDLEVBQW9ERSxVQUFwRCxDQUFwQjtBQUNEO0FBQ0YsT0FUTSxNQVNBO0FBQ0wsY0FBTSxJQUFJYyxLQUFKLENBQVUsdURBQ2IsR0FBRWhCLFVBQVcsdUJBQXNCQyxjQUFlLEVBRC9DLENBQU47QUFFRDs7QUFDRCwrQkFBV1MsV0FBWDtBQUF3Qk4sUUFBQUEsU0FBeEI7QUFBbUNDLFFBQUFBLGFBQW5DO0FBQWtESSxRQUFBQTtBQUFsRDtBQUNELEtBNUJ5QixDQUExQjtBQTZCQSxXQUFPLE1BQU10QixPQUFPLENBQUNDLEdBQVIsQ0FBWWtCLGlCQUFaLENBQWI7QUFDRDs7QUF6SmlDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgb3MgZnJvbSAnb3MnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJztcblxuaW1wb3J0IG1rZGlycCBmcm9tICdta2RpcnAnO1xuXG5pbXBvcnQge1BhcnRpYWxGaWxlRGlzY2FyZEhpc3RvcnksIFdob2xlRmlsZURpc2NhcmRIaXN0b3J5fSBmcm9tICcuL2Rpc2NhcmQtaGlzdG9yeS1zdG9yZXMnO1xuXG5pbXBvcnQge2dldFRlbXBEaXIsIGZpbGVFeGlzdHN9IGZyb20gJy4uL2hlbHBlcnMnO1xuXG5jb25zdCBlbXB0eUZpbGVQYXRoID0gcGF0aC5qb2luKG9zLnRtcGRpcigpLCAnZW1wdHktZmlsZS50eHQnKTtcbmNvbnN0IGVtcHR5RmlsZVByb21pc2UgPSBmcy53cml0ZUZpbGUoZW1wdHlGaWxlUGF0aCwgJycpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEaXNjYXJkSGlzdG9yeSB7XG4gIGNvbnN0cnVjdG9yKGNyZWF0ZUJsb2IsIGV4cGFuZEJsb2JUb0ZpbGUsIG1lcmdlRmlsZSwgd29ya2RpclBhdGgsIHttYXhIaXN0b3J5TGVuZ3RofSA9IHt9KSB7XG4gICAgdGhpcy5jcmVhdGVCbG9iID0gY3JlYXRlQmxvYjtcbiAgICB0aGlzLmV4cGFuZEJsb2JUb0ZpbGUgPSBleHBhbmRCbG9iVG9GaWxlO1xuICAgIHRoaXMubWVyZ2VGaWxlID0gbWVyZ2VGaWxlO1xuICAgIHRoaXMud29ya2RpclBhdGggPSB3b3JrZGlyUGF0aDtcbiAgICB0aGlzLnBhcnRpYWxGaWxlSGlzdG9yeSA9IG5ldyBQYXJ0aWFsRmlsZURpc2NhcmRIaXN0b3J5KG1heEhpc3RvcnlMZW5ndGgpO1xuICAgIHRoaXMud2hvbGVGaWxlSGlzdG9yeSA9IG5ldyBXaG9sZUZpbGVEaXNjYXJkSGlzdG9yeShtYXhIaXN0b3J5TGVuZ3RoKTtcbiAgfVxuXG4gIGdldExhc3RTbmFwc2hvdHMocGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICBpZiAocGFydGlhbERpc2NhcmRGaWxlUGF0aCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFydGlhbEZpbGVIaXN0b3J5LmdldExhc3RTbmFwc2hvdHNGb3JQYXRoKHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy53aG9sZUZpbGVIaXN0b3J5LmdldExhc3RTbmFwc2hvdHMoKTtcbiAgICB9XG4gIH1cblxuICBnZXRIaXN0b3J5KHBhcnRpYWxEaXNjYXJkRmlsZVBhdGggPSBudWxsKSB7XG4gICAgaWYgKHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcnRpYWxGaWxlSGlzdG9yeS5nZXRIaXN0b3J5Rm9yUGF0aChwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMud2hvbGVGaWxlSGlzdG9yeS5nZXRIaXN0b3J5KCk7XG4gICAgfVxuICB9XG5cbiAgaGFzSGlzdG9yeShwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoID0gbnVsbCkge1xuICAgIGNvbnN0IGhpc3RvcnkgPSB0aGlzLmdldEhpc3RvcnkocGFydGlhbERpc2NhcmRGaWxlUGF0aCk7XG4gICAgcmV0dXJuIGhpc3RvcnkubGVuZ3RoID4gMDtcbiAgfVxuXG4gIHBvcEhpc3RvcnkocGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICBpZiAocGFydGlhbERpc2NhcmRGaWxlUGF0aCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFydGlhbEZpbGVIaXN0b3J5LnBvcEhpc3RvcnlGb3JQYXRoKHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy53aG9sZUZpbGVIaXN0b3J5LnBvcEhpc3RvcnkoKTtcbiAgICB9XG4gIH1cblxuICBjbGVhckhpc3RvcnkocGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICBpZiAocGFydGlhbERpc2NhcmRGaWxlUGF0aCkge1xuICAgICAgdGhpcy5wYXJ0aWFsRmlsZUhpc3RvcnkuY2xlYXJIaXN0b3J5Rm9yUGF0aChwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy53aG9sZUZpbGVIaXN0b3J5LmNsZWFySGlzdG9yeSgpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUhpc3RvcnkoaGlzdG9yeSkge1xuICAgIHRoaXMucGFydGlhbEZpbGVIaXN0b3J5LnNldEhpc3RvcnkoaGlzdG9yeS5wYXJ0aWFsRmlsZUhpc3RvcnkgfHwge30pO1xuICAgIHRoaXMud2hvbGVGaWxlSGlzdG9yeS5zZXRIaXN0b3J5KGhpc3Rvcnkud2hvbGVGaWxlSGlzdG9yeSB8fCBbXSk7XG4gIH1cblxuICBhc3luYyBjcmVhdGVIaXN0b3J5QmxvYigpIHtcbiAgICBjb25zdCBoaXN0b3JpZXMgPSB7XG4gICAgICB3aG9sZUZpbGVIaXN0b3J5OiB0aGlzLndob2xlRmlsZUhpc3RvcnkuZ2V0SGlzdG9yeSgpLFxuICAgICAgcGFydGlhbEZpbGVIaXN0b3J5OiB0aGlzLnBhcnRpYWxGaWxlSGlzdG9yeS5nZXRIaXN0b3J5KCksXG4gICAgfTtcbiAgICBjb25zdCBoaXN0b3J5U2hhID0gYXdhaXQgdGhpcy5jcmVhdGVCbG9iKHtzdGRpbjogSlNPTi5zdHJpbmdpZnkoaGlzdG9yaWVzKX0pO1xuICAgIHJldHVybiBoaXN0b3J5U2hhO1xuICB9XG5cbiAgYXN5bmMgc3RvcmVCZWZvcmVBbmRBZnRlckJsb2JzKGZpbGVQYXRocywgaXNTYWZlLCBkZXN0cnVjdGl2ZUFjdGlvbiwgcGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICBpZiAocGFydGlhbERpc2NhcmRGaWxlUGF0aCkge1xuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuc3RvcmVCbG9ic0ZvclBhcnRpYWxGaWxlSGlzdG9yeShwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoLCBpc1NhZmUsIGRlc3RydWN0aXZlQWN0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuc3RvcmVCbG9ic0Zvcldob2xlRmlsZUhpc3RvcnkoZmlsZVBhdGhzLCBpc1NhZmUsIGRlc3RydWN0aXZlQWN0aW9uKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBzdG9yZUJsb2JzRm9yUGFydGlhbEZpbGVIaXN0b3J5KGZpbGVQYXRoLCBpc1NhZmUsIGRlc3RydWN0aXZlQWN0aW9uKSB7XG4gICAgY29uc3QgYmVmb3JlU2hhID0gYXdhaXQgdGhpcy5jcmVhdGVCbG9iKHtmaWxlUGF0aH0pO1xuICAgIGNvbnN0IGlzTm90U2FmZSA9ICEoYXdhaXQgaXNTYWZlKCkpO1xuICAgIGlmIChpc05vdFNhZmUpIHsgcmV0dXJuIG51bGw7IH1cbiAgICBhd2FpdCBkZXN0cnVjdGl2ZUFjdGlvbigpO1xuICAgIGNvbnN0IGFmdGVyU2hhID0gYXdhaXQgdGhpcy5jcmVhdGVCbG9iKHtmaWxlUGF0aH0pO1xuICAgIGNvbnN0IHNuYXBzaG90cyA9IHtiZWZvcmVTaGEsIGFmdGVyU2hhfTtcbiAgICB0aGlzLnBhcnRpYWxGaWxlSGlzdG9yeS5hZGRIaXN0b3J5KGZpbGVQYXRoLCBzbmFwc2hvdHMpO1xuICAgIHJldHVybiBzbmFwc2hvdHM7XG4gIH1cblxuICBhc3luYyBzdG9yZUJsb2JzRm9yV2hvbGVGaWxlSGlzdG9yeShmaWxlUGF0aHMsIGlzU2FmZSwgZGVzdHJ1Y3RpdmVBY3Rpb24pIHtcbiAgICBjb25zdCBzbmFwc2hvdHNCeVBhdGggPSB7fTtcbiAgICBjb25zdCBiZWZvcmVQcm9taXNlcyA9IGZpbGVQYXRocy5tYXAoYXN5bmMgZmlsZVBhdGggPT4ge1xuICAgICAgc25hcHNob3RzQnlQYXRoW2ZpbGVQYXRoXSA9IHtiZWZvcmVTaGE6IGF3YWl0IHRoaXMuY3JlYXRlQmxvYih7ZmlsZVBhdGh9KX07XG4gICAgfSk7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoYmVmb3JlUHJvbWlzZXMpO1xuICAgIGNvbnN0IGlzTm90U2FmZSA9ICEoYXdhaXQgaXNTYWZlKCkpO1xuICAgIGlmIChpc05vdFNhZmUpIHsgcmV0dXJuIG51bGw7IH1cbiAgICBhd2FpdCBkZXN0cnVjdGl2ZUFjdGlvbigpO1xuICAgIGNvbnN0IGFmdGVyUHJvbWlzZXMgPSBmaWxlUGF0aHMubWFwKGFzeW5jIGZpbGVQYXRoID0+IHtcbiAgICAgIHNuYXBzaG90c0J5UGF0aFtmaWxlUGF0aF0uYWZ0ZXJTaGEgPSBhd2FpdCB0aGlzLmNyZWF0ZUJsb2Ioe2ZpbGVQYXRofSk7XG4gICAgfSk7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoYWZ0ZXJQcm9taXNlcyk7XG4gICAgdGhpcy53aG9sZUZpbGVIaXN0b3J5LmFkZEhpc3Rvcnkoc25hcHNob3RzQnlQYXRoKTtcbiAgICByZXR1cm4gc25hcHNob3RzQnlQYXRoO1xuICB9XG5cbiAgYXN5bmMgcmVzdG9yZUxhc3REaXNjYXJkSW5UZW1wRmlsZXMoaXNTYWZlLCBwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoID0gbnVsbCkge1xuICAgIGxldCBsYXN0RGlzY2FyZFNuYXBzaG90cyA9IHRoaXMuZ2V0TGFzdFNuYXBzaG90cyhwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKTtcbiAgICBpZiAocGFydGlhbERpc2NhcmRGaWxlUGF0aCkge1xuICAgICAgbGFzdERpc2NhcmRTbmFwc2hvdHMgPSBsYXN0RGlzY2FyZFNuYXBzaG90cyA/IFtsYXN0RGlzY2FyZFNuYXBzaG90c10gOiBbXTtcbiAgICB9XG4gICAgY29uc3QgdGVtcEZvbGRlclBhdGhzID0gYXdhaXQgdGhpcy5leHBhbmRCbG9ic1RvRmlsZXNJblRlbXBGb2xkZXIobGFzdERpc2NhcmRTbmFwc2hvdHMpO1xuICAgIGlmICghaXNTYWZlKCkpIHsgcmV0dXJuIFtdOyB9XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMubWVyZ2VGaWxlcyh0ZW1wRm9sZGVyUGF0aHMpO1xuICB9XG5cbiAgYXN5bmMgZXhwYW5kQmxvYnNUb0ZpbGVzSW5UZW1wRm9sZGVyKHNuYXBzaG90cykge1xuICAgIGNvbnN0IHRlbXBGb2xkZXJQYXRoID0gYXdhaXQgZ2V0VGVtcERpcih7cHJlZml4OiAnZ2l0aHViLWRpc2NhcmQtaGlzdG9yeS0nfSk7XG4gICAgY29uc3QgcGF0aFByb21pc2VzID0gc25hcHNob3RzLm1hcChhc3luYyAoe2ZpbGVQYXRoLCBiZWZvcmVTaGEsIGFmdGVyU2hhfSkgPT4ge1xuICAgICAgY29uc3QgZGlyID0gcGF0aC5kaXJuYW1lKHBhdGguam9pbih0ZW1wRm9sZGVyUGF0aCwgZmlsZVBhdGgpKTtcbiAgICAgIGF3YWl0IG1rZGlycChkaXIpO1xuICAgICAgY29uc3QgdGhlaXJzUGF0aCA9ICFiZWZvcmVTaGEgPyBudWxsIDpcbiAgICAgICAgYXdhaXQgdGhpcy5leHBhbmRCbG9iVG9GaWxlKHBhdGguam9pbih0ZW1wRm9sZGVyUGF0aCwgYCR7ZmlsZVBhdGh9LWJlZm9yZS1kaXNjYXJkYCksIGJlZm9yZVNoYSk7XG4gICAgICBjb25zdCBjb21tb25CYXNlUGF0aCA9ICFhZnRlclNoYSA/IG51bGwgOlxuICAgICAgICBhd2FpdCB0aGlzLmV4cGFuZEJsb2JUb0ZpbGUocGF0aC5qb2luKHRlbXBGb2xkZXJQYXRoLCBgJHtmaWxlUGF0aH0tYWZ0ZXItZGlzY2FyZGApLCBhZnRlclNoYSk7XG4gICAgICBjb25zdCByZXN1bHRQYXRoID0gcGF0aC5qb2luKGRpciwgYH4ke3BhdGguYmFzZW5hbWUoZmlsZVBhdGgpfS1tZXJnZS1yZXN1bHRgKTtcbiAgICAgIHJldHVybiB7ZmlsZVBhdGgsIGNvbW1vbkJhc2VQYXRoLCB0aGVpcnNQYXRoLCByZXN1bHRQYXRoLCB0aGVpcnNTaGE6IGJlZm9yZVNoYSwgY29tbW9uQmFzZVNoYTogYWZ0ZXJTaGF9O1xuICAgIH0pO1xuICAgIHJldHVybiBhd2FpdCBQcm9taXNlLmFsbChwYXRoUHJvbWlzZXMpO1xuICB9XG5cbiAgYXN5bmMgbWVyZ2VGaWxlcyhmaWxlUGF0aHMpIHtcbiAgICBjb25zdCBtZXJnZUZpbGVQcm9taXNlcyA9IGZpbGVQYXRocy5tYXAoYXN5bmMgKGZpbGVQYXRoSW5mbywgaSkgPT4ge1xuICAgICAgY29uc3Qge2ZpbGVQYXRoLCBjb21tb25CYXNlUGF0aCwgdGhlaXJzUGF0aCwgcmVzdWx0UGF0aCwgdGhlaXJzU2hhLCBjb21tb25CYXNlU2hhfSA9IGZpbGVQYXRoSW5mbztcbiAgICAgIGNvbnN0IGN1cnJlbnRTaGEgPSBhd2FpdCB0aGlzLmNyZWF0ZUJsb2Ioe2ZpbGVQYXRofSk7XG4gICAgICBsZXQgbWVyZ2VSZXN1bHQ7XG4gICAgICBpZiAodGhlaXJzUGF0aCAmJiBjb21tb25CYXNlUGF0aCkge1xuICAgICAgICBtZXJnZVJlc3VsdCA9IGF3YWl0IHRoaXMubWVyZ2VGaWxlKGZpbGVQYXRoLCBjb21tb25CYXNlUGF0aCwgdGhlaXJzUGF0aCwgcmVzdWx0UGF0aCk7XG4gICAgICB9IGVsc2UgaWYgKCF0aGVpcnNQYXRoICYmIGNvbW1vbkJhc2VQYXRoKSB7IC8vIGRlbGV0ZWQgZmlsZVxuICAgICAgICBjb25zdCBvdXJzU2hhID0gYXdhaXQgdGhpcy5jcmVhdGVCbG9iKHtmaWxlUGF0aH0pO1xuICAgICAgICBpZiAob3Vyc1NoYSA9PT0gY29tbW9uQmFzZVNoYSkgeyAvLyBubyBjaGFuZ2VzIHNpbmNlIGRpc2NhcmQsIG1hcmsgZmlsZSB0byBiZSBkZWxldGVkXG4gICAgICAgICAgbWVyZ2VSZXN1bHQgPSB7ZmlsZVBhdGgsIHJlc3VsdFBhdGg6IG51bGwsIGRlbGV0ZWQ6IHRydWUsIGNvbmZsaWN0OiBmYWxzZX07XG4gICAgICAgIH0gZWxzZSB7IC8vIGNoYW5nZXMgc2luY2UgZGlzY2FyZCByZXN1bHQgaW4gY29uZmxpY3RcbiAgICAgICAgICBhd2FpdCBmcy5jb3B5KHBhdGguam9pbih0aGlzLndvcmtkaXJQYXRoLCBmaWxlUGF0aCksIHJlc3VsdFBhdGgpO1xuICAgICAgICAgIG1lcmdlUmVzdWx0ID0ge2ZpbGVQYXRoLCByZXN1bHRQYXRoLCBjb25mbGljdDogdHJ1ZX07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhlaXJzUGF0aCAmJiAhY29tbW9uQmFzZVBhdGgpIHsgLy8gYWRkZWQgZmlsZVxuICAgICAgICBjb25zdCBmaWxlRG9lc0V4aXN0ID0gYXdhaXQgZmlsZUV4aXN0cyhwYXRoLmpvaW4odGhpcy53b3JrZGlyUGF0aCwgZmlsZVBhdGgpKTtcbiAgICAgICAgaWYgKCFmaWxlRG9lc0V4aXN0KSB7XG4gICAgICAgICAgYXdhaXQgZnMuY29weSh0aGVpcnNQYXRoLCByZXN1bHRQYXRoKTtcbiAgICAgICAgICBtZXJnZVJlc3VsdCA9IHtmaWxlUGF0aCwgcmVzdWx0UGF0aCwgY29uZmxpY3Q6IGZhbHNlfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhd2FpdCBlbXB0eUZpbGVQcm9taXNlO1xuICAgICAgICAgIG1lcmdlUmVzdWx0ID0gYXdhaXQgdGhpcy5tZXJnZUZpbGUoZmlsZVBhdGgsIGVtcHR5RmlsZVBhdGgsIHRoZWlyc1BhdGgsIHJlc3VsdFBhdGgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ09uZSBvZiB0aGUgZm9sbG93aW5nIG11c3QgYmUgZGVmaW5lZCAtIHRoZWlyc1BhdGg6JyArXG4gICAgICAgICAgYCR7dGhlaXJzUGF0aH0gb3IgY29tbW9uQmFzZVBhdGg6ICR7Y29tbW9uQmFzZVBhdGh9YCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gey4uLm1lcmdlUmVzdWx0LCB0aGVpcnNTaGEsIGNvbW1vbkJhc2VTaGEsIGN1cnJlbnRTaGF9O1xuICAgIH0pO1xuICAgIHJldHVybiBhd2FpdCBQcm9taXNlLmFsbChtZXJnZUZpbGVQcm9taXNlcyk7XG4gIH1cbn1cbiJdfQ==