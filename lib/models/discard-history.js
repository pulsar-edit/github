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
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJlbXB0eUZpbGVQYXRoIiwicGF0aCIsImpvaW4iLCJvcyIsInRtcGRpciIsImVtcHR5RmlsZVByb21pc2UiLCJmcyIsIndyaXRlRmlsZSIsIkRpc2NhcmRIaXN0b3J5IiwiY29uc3RydWN0b3IiLCJjcmVhdGVCbG9iIiwiZXhwYW5kQmxvYlRvRmlsZSIsIm1lcmdlRmlsZSIsIndvcmtkaXJQYXRoIiwibWF4SGlzdG9yeUxlbmd0aCIsInBhcnRpYWxGaWxlSGlzdG9yeSIsIlBhcnRpYWxGaWxlRGlzY2FyZEhpc3RvcnkiLCJ3aG9sZUZpbGVIaXN0b3J5IiwiV2hvbGVGaWxlRGlzY2FyZEhpc3RvcnkiLCJnZXRMYXN0U25hcHNob3RzIiwicGFydGlhbERpc2NhcmRGaWxlUGF0aCIsImdldExhc3RTbmFwc2hvdHNGb3JQYXRoIiwiZ2V0SGlzdG9yeSIsImdldEhpc3RvcnlGb3JQYXRoIiwiaGFzSGlzdG9yeSIsImhpc3RvcnkiLCJsZW5ndGgiLCJwb3BIaXN0b3J5IiwicG9wSGlzdG9yeUZvclBhdGgiLCJjbGVhckhpc3RvcnkiLCJjbGVhckhpc3RvcnlGb3JQYXRoIiwidXBkYXRlSGlzdG9yeSIsInNldEhpc3RvcnkiLCJjcmVhdGVIaXN0b3J5QmxvYiIsImhpc3RvcmllcyIsImhpc3RvcnlTaGEiLCJzdGRpbiIsIkpTT04iLCJzdHJpbmdpZnkiLCJzdG9yZUJlZm9yZUFuZEFmdGVyQmxvYnMiLCJmaWxlUGF0aHMiLCJpc1NhZmUiLCJkZXN0cnVjdGl2ZUFjdGlvbiIsInN0b3JlQmxvYnNGb3JQYXJ0aWFsRmlsZUhpc3RvcnkiLCJzdG9yZUJsb2JzRm9yV2hvbGVGaWxlSGlzdG9yeSIsImZpbGVQYXRoIiwiYmVmb3JlU2hhIiwiaXNOb3RTYWZlIiwiYWZ0ZXJTaGEiLCJzbmFwc2hvdHMiLCJhZGRIaXN0b3J5Iiwic25hcHNob3RzQnlQYXRoIiwiYmVmb3JlUHJvbWlzZXMiLCJtYXAiLCJQcm9taXNlIiwiYWxsIiwiYWZ0ZXJQcm9taXNlcyIsInJlc3RvcmVMYXN0RGlzY2FyZEluVGVtcEZpbGVzIiwibGFzdERpc2NhcmRTbmFwc2hvdHMiLCJ0ZW1wRm9sZGVyUGF0aHMiLCJleHBhbmRCbG9ic1RvRmlsZXNJblRlbXBGb2xkZXIiLCJtZXJnZUZpbGVzIiwidGVtcEZvbGRlclBhdGgiLCJnZXRUZW1wRGlyIiwicHJlZml4IiwicGF0aFByb21pc2VzIiwiZGlyIiwiZGlybmFtZSIsIm1rZGlycCIsInRoZWlyc1BhdGgiLCJjb21tb25CYXNlUGF0aCIsInJlc3VsdFBhdGgiLCJiYXNlbmFtZSIsInRoZWlyc1NoYSIsImNvbW1vbkJhc2VTaGEiLCJtZXJnZUZpbGVQcm9taXNlcyIsImZpbGVQYXRoSW5mbyIsImkiLCJjdXJyZW50U2hhIiwibWVyZ2VSZXN1bHQiLCJvdXJzU2hhIiwiZGVsZXRlZCIsImNvbmZsaWN0IiwiY29weSIsImZpbGVEb2VzRXhpc3QiLCJmaWxlRXhpc3RzIiwiRXJyb3IiXSwic291cmNlcyI6WyJkaXNjYXJkLWhpc3RvcnkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgb3MgZnJvbSAnb3MnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJztcblxuaW1wb3J0IG1rZGlycCBmcm9tICdta2RpcnAnO1xuXG5pbXBvcnQge1BhcnRpYWxGaWxlRGlzY2FyZEhpc3RvcnksIFdob2xlRmlsZURpc2NhcmRIaXN0b3J5fSBmcm9tICcuL2Rpc2NhcmQtaGlzdG9yeS1zdG9yZXMnO1xuXG5pbXBvcnQge2dldFRlbXBEaXIsIGZpbGVFeGlzdHN9IGZyb20gJy4uL2hlbHBlcnMnO1xuXG5jb25zdCBlbXB0eUZpbGVQYXRoID0gcGF0aC5qb2luKG9zLnRtcGRpcigpLCAnZW1wdHktZmlsZS50eHQnKTtcbmNvbnN0IGVtcHR5RmlsZVByb21pc2UgPSBmcy53cml0ZUZpbGUoZW1wdHlGaWxlUGF0aCwgJycpO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEaXNjYXJkSGlzdG9yeSB7XG4gIGNvbnN0cnVjdG9yKGNyZWF0ZUJsb2IsIGV4cGFuZEJsb2JUb0ZpbGUsIG1lcmdlRmlsZSwgd29ya2RpclBhdGgsIHttYXhIaXN0b3J5TGVuZ3RofSA9IHt9KSB7XG4gICAgdGhpcy5jcmVhdGVCbG9iID0gY3JlYXRlQmxvYjtcbiAgICB0aGlzLmV4cGFuZEJsb2JUb0ZpbGUgPSBleHBhbmRCbG9iVG9GaWxlO1xuICAgIHRoaXMubWVyZ2VGaWxlID0gbWVyZ2VGaWxlO1xuICAgIHRoaXMud29ya2RpclBhdGggPSB3b3JrZGlyUGF0aDtcbiAgICB0aGlzLnBhcnRpYWxGaWxlSGlzdG9yeSA9IG5ldyBQYXJ0aWFsRmlsZURpc2NhcmRIaXN0b3J5KG1heEhpc3RvcnlMZW5ndGgpO1xuICAgIHRoaXMud2hvbGVGaWxlSGlzdG9yeSA9IG5ldyBXaG9sZUZpbGVEaXNjYXJkSGlzdG9yeShtYXhIaXN0b3J5TGVuZ3RoKTtcbiAgfVxuXG4gIGdldExhc3RTbmFwc2hvdHMocGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICBpZiAocGFydGlhbERpc2NhcmRGaWxlUGF0aCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFydGlhbEZpbGVIaXN0b3J5LmdldExhc3RTbmFwc2hvdHNGb3JQYXRoKHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy53aG9sZUZpbGVIaXN0b3J5LmdldExhc3RTbmFwc2hvdHMoKTtcbiAgICB9XG4gIH1cblxuICBnZXRIaXN0b3J5KHBhcnRpYWxEaXNjYXJkRmlsZVBhdGggPSBudWxsKSB7XG4gICAgaWYgKHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgpIHtcbiAgICAgIHJldHVybiB0aGlzLnBhcnRpYWxGaWxlSGlzdG9yeS5nZXRIaXN0b3J5Rm9yUGF0aChwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMud2hvbGVGaWxlSGlzdG9yeS5nZXRIaXN0b3J5KCk7XG4gICAgfVxuICB9XG5cbiAgaGFzSGlzdG9yeShwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoID0gbnVsbCkge1xuICAgIGNvbnN0IGhpc3RvcnkgPSB0aGlzLmdldEhpc3RvcnkocGFydGlhbERpc2NhcmRGaWxlUGF0aCk7XG4gICAgcmV0dXJuIGhpc3RvcnkubGVuZ3RoID4gMDtcbiAgfVxuXG4gIHBvcEhpc3RvcnkocGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICBpZiAocGFydGlhbERpc2NhcmRGaWxlUGF0aCkge1xuICAgICAgcmV0dXJuIHRoaXMucGFydGlhbEZpbGVIaXN0b3J5LnBvcEhpc3RvcnlGb3JQYXRoKHBhcnRpYWxEaXNjYXJkRmlsZVBhdGgpO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy53aG9sZUZpbGVIaXN0b3J5LnBvcEhpc3RvcnkoKTtcbiAgICB9XG4gIH1cblxuICBjbGVhckhpc3RvcnkocGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICBpZiAocGFydGlhbERpc2NhcmRGaWxlUGF0aCkge1xuICAgICAgdGhpcy5wYXJ0aWFsRmlsZUhpc3RvcnkuY2xlYXJIaXN0b3J5Rm9yUGF0aChwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy53aG9sZUZpbGVIaXN0b3J5LmNsZWFySGlzdG9yeSgpO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZUhpc3RvcnkoaGlzdG9yeSkge1xuICAgIHRoaXMucGFydGlhbEZpbGVIaXN0b3J5LnNldEhpc3RvcnkoaGlzdG9yeS5wYXJ0aWFsRmlsZUhpc3RvcnkgfHwge30pO1xuICAgIHRoaXMud2hvbGVGaWxlSGlzdG9yeS5zZXRIaXN0b3J5KGhpc3Rvcnkud2hvbGVGaWxlSGlzdG9yeSB8fCBbXSk7XG4gIH1cblxuICBhc3luYyBjcmVhdGVIaXN0b3J5QmxvYigpIHtcbiAgICBjb25zdCBoaXN0b3JpZXMgPSB7XG4gICAgICB3aG9sZUZpbGVIaXN0b3J5OiB0aGlzLndob2xlRmlsZUhpc3RvcnkuZ2V0SGlzdG9yeSgpLFxuICAgICAgcGFydGlhbEZpbGVIaXN0b3J5OiB0aGlzLnBhcnRpYWxGaWxlSGlzdG9yeS5nZXRIaXN0b3J5KCksXG4gICAgfTtcbiAgICBjb25zdCBoaXN0b3J5U2hhID0gYXdhaXQgdGhpcy5jcmVhdGVCbG9iKHtzdGRpbjogSlNPTi5zdHJpbmdpZnkoaGlzdG9yaWVzKX0pO1xuICAgIHJldHVybiBoaXN0b3J5U2hhO1xuICB9XG5cbiAgYXN5bmMgc3RvcmVCZWZvcmVBbmRBZnRlckJsb2JzKGZpbGVQYXRocywgaXNTYWZlLCBkZXN0cnVjdGl2ZUFjdGlvbiwgcGFydGlhbERpc2NhcmRGaWxlUGF0aCA9IG51bGwpIHtcbiAgICBpZiAocGFydGlhbERpc2NhcmRGaWxlUGF0aCkge1xuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuc3RvcmVCbG9ic0ZvclBhcnRpYWxGaWxlSGlzdG9yeShwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoLCBpc1NhZmUsIGRlc3RydWN0aXZlQWN0aW9uKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGF3YWl0IHRoaXMuc3RvcmVCbG9ic0Zvcldob2xlRmlsZUhpc3RvcnkoZmlsZVBhdGhzLCBpc1NhZmUsIGRlc3RydWN0aXZlQWN0aW9uKTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBzdG9yZUJsb2JzRm9yUGFydGlhbEZpbGVIaXN0b3J5KGZpbGVQYXRoLCBpc1NhZmUsIGRlc3RydWN0aXZlQWN0aW9uKSB7XG4gICAgY29uc3QgYmVmb3JlU2hhID0gYXdhaXQgdGhpcy5jcmVhdGVCbG9iKHtmaWxlUGF0aH0pO1xuICAgIGNvbnN0IGlzTm90U2FmZSA9ICEoYXdhaXQgaXNTYWZlKCkpO1xuICAgIGlmIChpc05vdFNhZmUpIHsgcmV0dXJuIG51bGw7IH1cbiAgICBhd2FpdCBkZXN0cnVjdGl2ZUFjdGlvbigpO1xuICAgIGNvbnN0IGFmdGVyU2hhID0gYXdhaXQgdGhpcy5jcmVhdGVCbG9iKHtmaWxlUGF0aH0pO1xuICAgIGNvbnN0IHNuYXBzaG90cyA9IHtiZWZvcmVTaGEsIGFmdGVyU2hhfTtcbiAgICB0aGlzLnBhcnRpYWxGaWxlSGlzdG9yeS5hZGRIaXN0b3J5KGZpbGVQYXRoLCBzbmFwc2hvdHMpO1xuICAgIHJldHVybiBzbmFwc2hvdHM7XG4gIH1cblxuICBhc3luYyBzdG9yZUJsb2JzRm9yV2hvbGVGaWxlSGlzdG9yeShmaWxlUGF0aHMsIGlzU2FmZSwgZGVzdHJ1Y3RpdmVBY3Rpb24pIHtcbiAgICBjb25zdCBzbmFwc2hvdHNCeVBhdGggPSB7fTtcbiAgICBjb25zdCBiZWZvcmVQcm9taXNlcyA9IGZpbGVQYXRocy5tYXAoYXN5bmMgZmlsZVBhdGggPT4ge1xuICAgICAgc25hcHNob3RzQnlQYXRoW2ZpbGVQYXRoXSA9IHtiZWZvcmVTaGE6IGF3YWl0IHRoaXMuY3JlYXRlQmxvYih7ZmlsZVBhdGh9KX07XG4gICAgfSk7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoYmVmb3JlUHJvbWlzZXMpO1xuICAgIGNvbnN0IGlzTm90U2FmZSA9ICEoYXdhaXQgaXNTYWZlKCkpO1xuICAgIGlmIChpc05vdFNhZmUpIHsgcmV0dXJuIG51bGw7IH1cbiAgICBhd2FpdCBkZXN0cnVjdGl2ZUFjdGlvbigpO1xuICAgIGNvbnN0IGFmdGVyUHJvbWlzZXMgPSBmaWxlUGF0aHMubWFwKGFzeW5jIGZpbGVQYXRoID0+IHtcbiAgICAgIHNuYXBzaG90c0J5UGF0aFtmaWxlUGF0aF0uYWZ0ZXJTaGEgPSBhd2FpdCB0aGlzLmNyZWF0ZUJsb2Ioe2ZpbGVQYXRofSk7XG4gICAgfSk7XG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoYWZ0ZXJQcm9taXNlcyk7XG4gICAgdGhpcy53aG9sZUZpbGVIaXN0b3J5LmFkZEhpc3Rvcnkoc25hcHNob3RzQnlQYXRoKTtcbiAgICByZXR1cm4gc25hcHNob3RzQnlQYXRoO1xuICB9XG5cbiAgYXN5bmMgcmVzdG9yZUxhc3REaXNjYXJkSW5UZW1wRmlsZXMoaXNTYWZlLCBwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoID0gbnVsbCkge1xuICAgIGxldCBsYXN0RGlzY2FyZFNuYXBzaG90cyA9IHRoaXMuZ2V0TGFzdFNuYXBzaG90cyhwYXJ0aWFsRGlzY2FyZEZpbGVQYXRoKTtcbiAgICBpZiAocGFydGlhbERpc2NhcmRGaWxlUGF0aCkge1xuICAgICAgbGFzdERpc2NhcmRTbmFwc2hvdHMgPSBsYXN0RGlzY2FyZFNuYXBzaG90cyA/IFtsYXN0RGlzY2FyZFNuYXBzaG90c10gOiBbXTtcbiAgICB9XG4gICAgY29uc3QgdGVtcEZvbGRlclBhdGhzID0gYXdhaXQgdGhpcy5leHBhbmRCbG9ic1RvRmlsZXNJblRlbXBGb2xkZXIobGFzdERpc2NhcmRTbmFwc2hvdHMpO1xuICAgIGlmICghaXNTYWZlKCkpIHsgcmV0dXJuIFtdOyB9XG4gICAgcmV0dXJuIGF3YWl0IHRoaXMubWVyZ2VGaWxlcyh0ZW1wRm9sZGVyUGF0aHMpO1xuICB9XG5cbiAgYXN5bmMgZXhwYW5kQmxvYnNUb0ZpbGVzSW5UZW1wRm9sZGVyKHNuYXBzaG90cykge1xuICAgIGNvbnN0IHRlbXBGb2xkZXJQYXRoID0gYXdhaXQgZ2V0VGVtcERpcih7cHJlZml4OiAnZ2l0aHViLWRpc2NhcmQtaGlzdG9yeS0nfSk7XG4gICAgY29uc3QgcGF0aFByb21pc2VzID0gc25hcHNob3RzLm1hcChhc3luYyAoe2ZpbGVQYXRoLCBiZWZvcmVTaGEsIGFmdGVyU2hhfSkgPT4ge1xuICAgICAgY29uc3QgZGlyID0gcGF0aC5kaXJuYW1lKHBhdGguam9pbih0ZW1wRm9sZGVyUGF0aCwgZmlsZVBhdGgpKTtcbiAgICAgIGF3YWl0IG1rZGlycChkaXIpO1xuICAgICAgY29uc3QgdGhlaXJzUGF0aCA9ICFiZWZvcmVTaGEgPyBudWxsIDpcbiAgICAgICAgYXdhaXQgdGhpcy5leHBhbmRCbG9iVG9GaWxlKHBhdGguam9pbih0ZW1wRm9sZGVyUGF0aCwgYCR7ZmlsZVBhdGh9LWJlZm9yZS1kaXNjYXJkYCksIGJlZm9yZVNoYSk7XG4gICAgICBjb25zdCBjb21tb25CYXNlUGF0aCA9ICFhZnRlclNoYSA/IG51bGwgOlxuICAgICAgICBhd2FpdCB0aGlzLmV4cGFuZEJsb2JUb0ZpbGUocGF0aC5qb2luKHRlbXBGb2xkZXJQYXRoLCBgJHtmaWxlUGF0aH0tYWZ0ZXItZGlzY2FyZGApLCBhZnRlclNoYSk7XG4gICAgICBjb25zdCByZXN1bHRQYXRoID0gcGF0aC5qb2luKGRpciwgYH4ke3BhdGguYmFzZW5hbWUoZmlsZVBhdGgpfS1tZXJnZS1yZXN1bHRgKTtcbiAgICAgIHJldHVybiB7ZmlsZVBhdGgsIGNvbW1vbkJhc2VQYXRoLCB0aGVpcnNQYXRoLCByZXN1bHRQYXRoLCB0aGVpcnNTaGE6IGJlZm9yZVNoYSwgY29tbW9uQmFzZVNoYTogYWZ0ZXJTaGF9O1xuICAgIH0pO1xuICAgIHJldHVybiBhd2FpdCBQcm9taXNlLmFsbChwYXRoUHJvbWlzZXMpO1xuICB9XG5cbiAgYXN5bmMgbWVyZ2VGaWxlcyhmaWxlUGF0aHMpIHtcbiAgICBjb25zdCBtZXJnZUZpbGVQcm9taXNlcyA9IGZpbGVQYXRocy5tYXAoYXN5bmMgKGZpbGVQYXRoSW5mbywgaSkgPT4ge1xuICAgICAgY29uc3Qge2ZpbGVQYXRoLCBjb21tb25CYXNlUGF0aCwgdGhlaXJzUGF0aCwgcmVzdWx0UGF0aCwgdGhlaXJzU2hhLCBjb21tb25CYXNlU2hhfSA9IGZpbGVQYXRoSW5mbztcbiAgICAgIGNvbnN0IGN1cnJlbnRTaGEgPSBhd2FpdCB0aGlzLmNyZWF0ZUJsb2Ioe2ZpbGVQYXRofSk7XG4gICAgICBsZXQgbWVyZ2VSZXN1bHQ7XG4gICAgICBpZiAodGhlaXJzUGF0aCAmJiBjb21tb25CYXNlUGF0aCkge1xuICAgICAgICBtZXJnZVJlc3VsdCA9IGF3YWl0IHRoaXMubWVyZ2VGaWxlKGZpbGVQYXRoLCBjb21tb25CYXNlUGF0aCwgdGhlaXJzUGF0aCwgcmVzdWx0UGF0aCk7XG4gICAgICB9IGVsc2UgaWYgKCF0aGVpcnNQYXRoICYmIGNvbW1vbkJhc2VQYXRoKSB7IC8vIGRlbGV0ZWQgZmlsZVxuICAgICAgICBjb25zdCBvdXJzU2hhID0gYXdhaXQgdGhpcy5jcmVhdGVCbG9iKHtmaWxlUGF0aH0pO1xuICAgICAgICBpZiAob3Vyc1NoYSA9PT0gY29tbW9uQmFzZVNoYSkgeyAvLyBubyBjaGFuZ2VzIHNpbmNlIGRpc2NhcmQsIG1hcmsgZmlsZSB0byBiZSBkZWxldGVkXG4gICAgICAgICAgbWVyZ2VSZXN1bHQgPSB7ZmlsZVBhdGgsIHJlc3VsdFBhdGg6IG51bGwsIGRlbGV0ZWQ6IHRydWUsIGNvbmZsaWN0OiBmYWxzZX07XG4gICAgICAgIH0gZWxzZSB7IC8vIGNoYW5nZXMgc2luY2UgZGlzY2FyZCByZXN1bHQgaW4gY29uZmxpY3RcbiAgICAgICAgICBhd2FpdCBmcy5jb3B5KHBhdGguam9pbih0aGlzLndvcmtkaXJQYXRoLCBmaWxlUGF0aCksIHJlc3VsdFBhdGgpO1xuICAgICAgICAgIG1lcmdlUmVzdWx0ID0ge2ZpbGVQYXRoLCByZXN1bHRQYXRoLCBjb25mbGljdDogdHJ1ZX07XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGhlaXJzUGF0aCAmJiAhY29tbW9uQmFzZVBhdGgpIHsgLy8gYWRkZWQgZmlsZVxuICAgICAgICBjb25zdCBmaWxlRG9lc0V4aXN0ID0gYXdhaXQgZmlsZUV4aXN0cyhwYXRoLmpvaW4odGhpcy53b3JrZGlyUGF0aCwgZmlsZVBhdGgpKTtcbiAgICAgICAgaWYgKCFmaWxlRG9lc0V4aXN0KSB7XG4gICAgICAgICAgYXdhaXQgZnMuY29weSh0aGVpcnNQYXRoLCByZXN1bHRQYXRoKTtcbiAgICAgICAgICBtZXJnZVJlc3VsdCA9IHtmaWxlUGF0aCwgcmVzdWx0UGF0aCwgY29uZmxpY3Q6IGZhbHNlfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBhd2FpdCBlbXB0eUZpbGVQcm9taXNlO1xuICAgICAgICAgIG1lcmdlUmVzdWx0ID0gYXdhaXQgdGhpcy5tZXJnZUZpbGUoZmlsZVBhdGgsIGVtcHR5RmlsZVBhdGgsIHRoZWlyc1BhdGgsIHJlc3VsdFBhdGgpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ09uZSBvZiB0aGUgZm9sbG93aW5nIG11c3QgYmUgZGVmaW5lZCAtIHRoZWlyc1BhdGg6JyArXG4gICAgICAgICAgYCR7dGhlaXJzUGF0aH0gb3IgY29tbW9uQmFzZVBhdGg6ICR7Y29tbW9uQmFzZVBhdGh9YCk7XG4gICAgICB9XG4gICAgICByZXR1cm4gey4uLm1lcmdlUmVzdWx0LCB0aGVpcnNTaGEsIGNvbW1vbkJhc2VTaGEsIGN1cnJlbnRTaGF9O1xuICAgIH0pO1xuICAgIHJldHVybiBhd2FpdCBQcm9taXNlLmFsbChtZXJnZUZpbGVQcm9taXNlcyk7XG4gIH1cbn1cbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUE7QUFDQTtBQUNBO0FBRUE7QUFFQTtBQUVBO0FBQWtEO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUVsRCxNQUFNQSxhQUFhLEdBQUdDLGFBQUksQ0FBQ0MsSUFBSSxDQUFDQyxXQUFFLENBQUNDLE1BQU0sRUFBRSxFQUFFLGdCQUFnQixDQUFDO0FBQzlELE1BQU1DLGdCQUFnQixHQUFHQyxnQkFBRSxDQUFDQyxTQUFTLENBQUNQLGFBQWEsRUFBRSxFQUFFLENBQUM7QUFFekMsTUFBTVEsY0FBYyxDQUFDO0VBQ2xDQyxXQUFXLENBQUNDLFVBQVUsRUFBRUMsZ0JBQWdCLEVBQUVDLFNBQVMsRUFBRUMsV0FBVyxFQUFFO0lBQUNDO0VBQWdCLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRTtJQUN6RixJQUFJLENBQUNKLFVBQVUsR0FBR0EsVUFBVTtJQUM1QixJQUFJLENBQUNDLGdCQUFnQixHQUFHQSxnQkFBZ0I7SUFDeEMsSUFBSSxDQUFDQyxTQUFTLEdBQUdBLFNBQVM7SUFDMUIsSUFBSSxDQUFDQyxXQUFXLEdBQUdBLFdBQVc7SUFDOUIsSUFBSSxDQUFDRSxrQkFBa0IsR0FBRyxJQUFJQywrQ0FBeUIsQ0FBQ0YsZ0JBQWdCLENBQUM7SUFDekUsSUFBSSxDQUFDRyxnQkFBZ0IsR0FBRyxJQUFJQyw2Q0FBdUIsQ0FBQ0osZ0JB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