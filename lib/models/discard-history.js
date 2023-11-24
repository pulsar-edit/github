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