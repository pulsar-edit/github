"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.autobind = autobind;
exports.extractProps = extractProps;
exports.unusedProps = unusedProps;
exports.getPackageRoot = getPackageRoot;
exports.getAtomHelperPath = getAtomHelperPath;
exports.getDugitePath = getDugitePath;
exports.getSharedModulePath = getSharedModulePath;
exports.isBinary = isBinary;
exports.firstImplementer = firstImplementer;
exports.isValidWorkdir = isValidWorkdir;
exports.fileExists = fileExists;
exports.getTempDir = getTempDir;
exports.isFileExecutable = isFileExecutable;
exports.isFileSymlink = isFileSymlink;
exports.shortenSha = shortenSha;
exports.normalizeGitHelperPath = normalizeGitHelperPath;
exports.toNativePathSep = toNativePathSep;
exports.toGitPathSep = toGitPathSep;
exports.filePathEndsWith = filePathEndsWith;
exports.toSentence = toSentence;
exports.pushAtKey = pushAtKey;
exports.getCommitMessagePath = getCommitMessagePath;
exports.getCommitMessageEditors = getCommitMessageEditors;
exports.getFilePatchPaneItems = getFilePatchPaneItems;
exports.destroyFilePatchPaneItems = destroyFilePatchPaneItems;
exports.destroyEmptyFilePatchPaneItems = destroyEmptyFilePatchPaneItems;
exports.extractCoAuthorsAndRawCommitMessage = extractCoAuthorsAndRawCommitMessage;
exports.createItem = createItem;
exports.equalSets = equalSets;
exports.blankLabel = blankLabel;
exports.renderMarkdown = renderMarkdown;
exports.GHOST_USER = exports.reactionTypeToEmoji = exports.NBSP_CHARACTER = exports.classNameForStatus = exports.CHECK_RUN_PAGE_SIZE = exports.CHECK_SUITE_PAGE_SIZE = exports.PAGINATION_WAIT_TIME_MS = exports.PAGE_SIZE = exports.CO_AUTHOR_REGEX = exports.LINE_ENDING_REGEX = void 0;
var _path = _interopRequireDefault(require("path"));
var _fsExtra = _interopRequireDefault(require("fs-extra"));
var _os = _interopRequireDefault(require("os"));
var _temp = _interopRequireDefault(require("temp"));
var _refHolder = _interopRequireDefault(require("./models/ref-holder"));
var _author = _interopRequireDefault(require("./models/author"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
const LINE_ENDING_REGEX = /\r?\n/;
exports.LINE_ENDING_REGEX = LINE_ENDING_REGEX;
const CO_AUTHOR_REGEX = /^co-authored-by. (.+?) <(.+?)>$/i;
exports.CO_AUTHOR_REGEX = CO_AUTHOR_REGEX;
const PAGE_SIZE = 50;
exports.PAGE_SIZE = PAGE_SIZE;
const PAGINATION_WAIT_TIME_MS = 100;
exports.PAGINATION_WAIT_TIME_MS = PAGINATION_WAIT_TIME_MS;
const CHECK_SUITE_PAGE_SIZE = 10;
exports.CHECK_SUITE_PAGE_SIZE = CHECK_SUITE_PAGE_SIZE;
const CHECK_RUN_PAGE_SIZE = 20;
exports.CHECK_RUN_PAGE_SIZE = CHECK_RUN_PAGE_SIZE;
function autobind(self, ...methods) {
  for (const method of methods) {
    if (typeof self[method] !== 'function') {
      throw new Error(`Unable to autobind method ${method}`);
    }
    self[method] = self[method].bind(self);
  }
}

// Extract a subset of props chosen from a propTypes object from a component's props to pass to a different API.
//
// Usage:
//
// ```js
// const apiProps = {
//   zero: PropTypes.number.isRequired,
//   one: PropTypes.string,
//   two: PropTypes.object,
// };
//
// class Component extends React.Component {
//   static propTypes = {
//     ...apiProps,
//     extra: PropTypes.func,
//   }
//
//   action() {
//     const options = extractProps(this.props, apiProps);
//     // options contains zero, one, and two, but not extra
//   }
// }
// ```
function extractProps(props, propTypes, nameMap = {}) {
  return Object.keys(propTypes).reduce((opts, propName) => {
    if (props[propName] !== undefined) {
      const destPropName = nameMap[propName] || propName;
      opts[destPropName] = props[propName];
    }
    return opts;
  }, {});
}

// The opposite of extractProps. Return a subset of props that do *not* appear in a component's prop types.
function unusedProps(props, propTypes) {
  return Object.keys(props).reduce((opts, propName) => {
    if (propTypes[propName] === undefined) {
      opts[propName] = props[propName];
    }
    return opts;
  }, {});
}
function getPackageRoot() {
  const {
    resourcePath
  } = atom.getLoadSettings();
  const currentFileWasRequiredFromSnapshot = !_path.default.isAbsolute(__dirname);
  if (currentFileWasRequiredFromSnapshot) {
    return _path.default.join(resourcePath, 'node_modules', 'github');
  } else {
    const packageRoot = _path.default.resolve(__dirname, '..');
    if (_path.default.extname(resourcePath) === '.asar') {
      if (packageRoot.indexOf(resourcePath) === 0) {
        return _path.default.join(`${resourcePath}.unpacked`, 'node_modules', 'github');
      }
    }
    return packageRoot;
  }
}
function getAtomAppName() {
  /*
  // Old Atom logic (restore this if we make release channel specific binaries)
  const match = atom.getVersion().match(/-([A-Za-z]+)(\d+|-)/);
  if (match) {
    const channel = match[1];
    return `Pulsar ${channel.charAt(0).toUpperCase() + channel.slice(1)} Helper`;
  }
   return 'Pulsar Helper';
  */

  return `${atom?.branding?.name ?? 'Pulsar'} Helper`;
}
function getAtomHelperPath() {
  if (process.platform === 'darwin') {
    const appName = getAtomAppName();
    return _path.default.resolve(process.resourcesPath, '..', 'Frameworks', `${appName}.app`, 'Contents', 'MacOS', appName);
  } else {
    return process.execPath;
  }
}
let DUGITE_PATH;
function getDugitePath() {
  if (!DUGITE_PATH) {
    DUGITE_PATH = require.resolve('dugite');
    if (!_path.default.isAbsolute(DUGITE_PATH)) {
      // Assume we're snapshotted
      const {
        resourcePath
      } = atom.getLoadSettings();
      if (_path.default.extname(resourcePath) === '.asar') {
        DUGITE_PATH = _path.default.join(`${resourcePath}.unpacked`, 'node_modules', 'dugite');
      } else {
        DUGITE_PATH = _path.default.join(resourcePath, 'node_modules', 'dugite');
      }
    }
  }
  return DUGITE_PATH;
}
const SHARED_MODULE_PATHS = new Map();
function getSharedModulePath(relPath) {
  let modulePath = SHARED_MODULE_PATHS.get(relPath);
  if (!modulePath) {
    modulePath = require.resolve(_path.default.join(__dirname, 'shared', relPath));
    if (!_path.default.isAbsolute(modulePath)) {
      // Assume we're snapshotted
      const {
        resourcePath
      } = atom.getLoadSettings();
      modulePath = _path.default.join(resourcePath, modulePath);
    }
    SHARED_MODULE_PATHS.set(relPath, modulePath);
  }
  return modulePath;
}
function isBinary(data) {
  for (let i = 0; i < 50; i++) {
    const code = data.charCodeAt(i);
    // Char code 65533 is the "replacement character";
    // 8 and below are control characters.
    if (code === 65533 || code < 9) {
      return true;
    }
  }
  return false;
}
function descriptorsFromProto(proto) {
  return Object.getOwnPropertyNames(proto).reduce((acc, name) => {
    Object.assign(acc, {
      [name]: Reflect.getOwnPropertyDescriptor(proto, name)
    });
    return acc;
  }, {});
}

/**
 * Takes an array of targets and returns a proxy. The proxy intercepts property accessor calls and
 * returns the value of that property on the first object in `targets` where the target implements that property.
 */
function firstImplementer(...targets) {
  return new Proxy({
    __implementations: targets
  }, {
    get(target, name) {
      if (name === 'getImplementers') {
        return () => targets;
      }
      if (Reflect.has(target, name)) {
        return target[name];
      }
      const firstValidTarget = targets.find(t => Reflect.has(t, name));
      if (firstValidTarget) {
        return firstValidTarget[name];
      } else {
        return undefined;
      }
    },
    set(target, name, value) {
      const firstValidTarget = targets.find(t => Reflect.has(t, name));
      if (firstValidTarget) {
        // eslint-disable-next-line no-return-assign
        return firstValidTarget[name] = value;
      } else {
        // eslint-disable-next-line no-return-assign
        return target[name] = value;
      }
    },
    // Used by sinon
    has(target, name) {
      if (name === 'getImplementers') {
        return true;
      }
      return targets.some(t => Reflect.has(t, name));
    },
    // Used by sinon
    getOwnPropertyDescriptor(target, name) {
      const firstValidTarget = targets.find(t => Reflect.getOwnPropertyDescriptor(t, name));
      const compositeOwnPropertyDescriptor = Reflect.getOwnPropertyDescriptor(target, name);
      if (firstValidTarget) {
        return Reflect.getOwnPropertyDescriptor(firstValidTarget, name);
      } else if (compositeOwnPropertyDescriptor) {
        return compositeOwnPropertyDescriptor;
      } else {
        return undefined;
      }
    },
    // Used by sinon
    getPrototypeOf(target) {
      return targets.reduceRight((acc, t) => {
        return Object.create(acc, descriptorsFromProto(Object.getPrototypeOf(t)));
      }, Object.prototype);
    }
  });
}
function isRoot(dir) {
  return _path.default.resolve(dir, '..') === dir;
}
function isValidWorkdir(dir) {
  return dir !== _os.default.homedir() && !isRoot(dir);
}
async function fileExists(absoluteFilePath) {
  try {
    await _fsExtra.default.access(absoluteFilePath);
    return true;
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false;
    }
    throw e;
  }
}
function getTempDir(options = {}) {
  _temp.default.track();
  return new Promise((resolve, reject) => {
    _temp.default.mkdir(options, (tempError, folder) => {
      if (tempError) {
        reject(tempError);
        return;
      }
      if (options.symlinkOk) {
        resolve(folder);
      } else {
        _fsExtra.default.realpath(folder, (realError, rpath) => realError ? reject(realError) : resolve(rpath));
      }
    });
  });
}
async function isFileExecutable(absoluteFilePath) {
  const stat = await _fsExtra.default.stat(absoluteFilePath);
  return stat.mode & _fsExtra.default.constants.S_IXUSR; // eslint-disable-line no-bitwise
}

async function isFileSymlink(absoluteFilePath) {
  const stat = await _fsExtra.default.lstat(absoluteFilePath);
  return stat.isSymbolicLink();
}
function shortenSha(sha) {
  return sha.slice(0, 8);
}
const classNameForStatus = {
  added: 'added',
  deleted: 'removed',
  modified: 'modified',
  typechange: 'modified',
  equivalent: 'ignored'
};

/*
 * Apply any platform-specific munging to a path before presenting it as
 * a git environment variable or option.
 *
 * Convert a Windows-style "C:\foo\bar\baz" path to a "/c/foo/bar/baz" UNIX-y
 * path that the sh.exe used to execute git's credential helpers will
 * understand.
 */
exports.classNameForStatus = classNameForStatus;
function normalizeGitHelperPath(inPath) {
  if (process.platform === 'win32') {
    return inPath.replace(/\\/g, '/').replace(/^([^:]+):/, '/$1');
  } else {
    return inPath;
  }
}

/*
 * On Windows, git commands report paths with / delimiters. Convert them to \-delimited paths
 * so that Atom unifromly treats paths with native path separators.
 */
function toNativePathSep(rawPath) {
  if (process.platform !== 'win32') {
    return rawPath;
  } else {
    return rawPath.split('/').join(_path.default.sep);
  }
}

/*
 * Convert Windows paths back to /-delimited paths to be presented to git.
 */
function toGitPathSep(rawPath) {
  if (process.platform !== 'win32') {
    return rawPath;
  } else {
    return rawPath.split(_path.default.sep).join('/');
  }
}
function filePathEndsWith(filePath, ...segments) {
  return filePath.endsWith(_path.default.join(...segments));
}

/**
 * Turns an array of things @kuychaco cannot eat
 * into a sentence containing things @kuychaco cannot eat
 *
 * ['toast'] => 'toast'
 * ['toast', 'eggs'] => 'toast and eggs'
 * ['toast', 'eggs', 'cheese'] => 'toast, eggs, and cheese'
 *
 * Oxford comma included because you're wrong, shut up.
 */
function toSentence(array) {
  const len = array.length;
  if (len === 1) {
    return `${array[0]}`;
  } else if (len === 2) {
    return `${array[0]} and ${array[1]}`;
  }
  return array.reduce((acc, item, idx) => {
    if (idx === 0) {
      return `${item}`;
    } else if (idx === len - 1) {
      return `${acc}, and ${item}`;
    } else {
      return `${acc}, ${item}`;
    }
  }, '');
}
function pushAtKey(map, key, value) {
  let existing = map.get(key);
  if (!existing) {
    existing = [];
    map.set(key, existing);
  }
  existing.push(value);
}

// Repository and workspace helpers

function getCommitMessagePath(repository) {
  return _path.default.join(repository.getGitDirectoryPath(), 'ATOM_COMMIT_EDITMSG');
}
function getCommitMessageEditors(repository, workspace) {
  if (!repository.isPresent()) {
    return [];
  }
  return workspace.getTextEditors().filter(editor => editor.getPath() === getCommitMessagePath(repository));
}
let ChangedFileItem = null;
function getFilePatchPaneItems({
  onlyStaged,
  empty
} = {}, workspace) {
  if (ChangedFileItem === null) {
    ChangedFileItem = require('./items/changed-file-item').default;
  }
  return workspace.getPaneItems().filter(item => {
    const isFilePatchItem = item && item.getRealItem && item.getRealItem() instanceof ChangedFileItem;
    if (onlyStaged) {
      return isFilePatchItem && item.stagingStatus === 'staged';
    } else if (empty) {
      return isFilePatchItem ? item.isEmpty() : false;
    } else {
      return isFilePatchItem;
    }
  });
}
function destroyFilePatchPaneItems({
  onlyStaged
} = {}, workspace) {
  const itemsToDestroy = getFilePatchPaneItems({
    onlyStaged
  }, workspace);
  itemsToDestroy.forEach(item => item.destroy());
}
function destroyEmptyFilePatchPaneItems(workspace) {
  const itemsToDestroy = getFilePatchPaneItems({
    empty: true
  }, workspace);
  itemsToDestroy.forEach(item => item.destroy());
}
function extractCoAuthorsAndRawCommitMessage(commitMessage) {
  const messageLines = [];
  const coAuthors = [];
  for (const line of commitMessage.split(LINE_ENDING_REGEX)) {
    const match = line.match(CO_AUTHOR_REGEX);
    if (match) {
      // eslint-disable-next-line no-unused-vars
      const [_, name, email] = match;
      coAuthors.push(new _author.default(email, name));
    } else {
      messageLines.push(line);
    }
  }
  return {
    message: messageLines.join('\n'),
    coAuthors
  };
}

// Atom API pane item manipulation

function createItem(node, componentHolder = null, uri = null, extra = {}) {
  const holder = componentHolder || new _refHolder.default();
  const override = _objectSpread({
    getElement: () => node,
    getRealItem: () => holder.getOr(null),
    getRealItemPromise: () => holder.getPromise()
  }, extra);
  if (uri) {
    override.getURI = () => uri;
  }
  if (componentHolder) {
    return new Proxy(override, {
      get(target, name) {
        if (Reflect.has(target, name)) {
          return target[name];
        }

        // The {value: ...} wrapper prevents .map() from flattening a returned RefHolder.
        // If component[name] is a RefHolder, we want to return that RefHolder as-is.
        const {
          value
        } = holder.map(component => ({
          value: component[name]
        })).getOr({
          value: undefined
        });
        return value;
      },
      set(target, name, value) {
        return holder.map(component => {
          component[name] = value;
          return true;
        }).getOr(true);
      },
      has(target, name) {
        return holder.map(component => Reflect.has(component, name)).getOr(false) || Reflect.has(target, name);
      }
    });
  } else {
    return override;
  }
}

// Set functions

function equalSets(left, right) {
  if (left.size !== right.size) {
    return false;
  }
  for (const each of left) {
    if (!right.has(each)) {
      return false;
    }
  }
  return true;
}

// Constants

const NBSP_CHARACTER = '\u00a0';
exports.NBSP_CHARACTER = NBSP_CHARACTER;
function blankLabel() {
  return NBSP_CHARACTER;
}
const reactionTypeToEmoji = {
  THUMBS_UP: '👍',
  THUMBS_DOWN: '👎',
  LAUGH: '😆',
  HOORAY: '🎉',
  CONFUSED: '😕',
  HEART: '❤️',
  ROCKET: '🚀',
  EYES: '👀'
};

// Markdown
exports.reactionTypeToEmoji = reactionTypeToEmoji;
let marked = null;
let domPurify = null;
function renderMarkdown(md) {
  if (marked === null) {
    marked = require('marked');
    if (domPurify === null) {
      const createDOMPurify = require('dompurify');
      domPurify = createDOMPurify();
    }
    marked.setOptions({
      silent: true,
      sanitize: true,
      sanitizer: html => domPurify.sanitize(html)
    });
  }
  return marked(md);
}
const GHOST_USER = {
  login: 'ghost',
  avatarUrl: 'https://avatars1.githubusercontent.com/u/10137?v=4',
  url: 'https://github.com/ghost'
};
exports.GHOST_USER = GHOST_USER;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcGF0aCIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX2ZzRXh0cmEiLCJfb3MiLCJfdGVtcCIsIl9yZWZIb2xkZXIiLCJfYXV0aG9yIiwib2JqIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJvd25LZXlzIiwiZSIsInIiLCJ0IiwiT2JqZWN0Iiwia2V5cyIsImdldE93blByb3BlcnR5U3ltYm9scyIsIm8iLCJmaWx0ZXIiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJlbnVtZXJhYmxlIiwicHVzaCIsImFwcGx5IiwiX29iamVjdFNwcmVhZCIsImFyZ3VtZW50cyIsImxlbmd0aCIsImZvckVhY2giLCJfZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzIiwiZGVmaW5lUHJvcGVydGllcyIsImRlZmluZVByb3BlcnR5Iiwia2V5IiwidmFsdWUiLCJfdG9Qcm9wZXJ0eUtleSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiYXJnIiwiX3RvUHJpbWl0aXZlIiwiU3RyaW5nIiwiaW5wdXQiLCJoaW50IiwicHJpbSIsIlN5bWJvbCIsInRvUHJpbWl0aXZlIiwidW5kZWZpbmVkIiwicmVzIiwiY2FsbCIsIlR5cGVFcnJvciIsIk51bWJlciIsIkxJTkVfRU5ESU5HX1JFR0VYIiwiZXhwb3J0cyIsIkNPX0FVVEhPUl9SRUdFWCIsIlBBR0VfU0laRSIsIlBBR0lOQVRJT05fV0FJVF9USU1FX01TIiwiQ0hFQ0tfU1VJVEVfUEFHRV9TSVpFIiwiQ0hFQ0tfUlVOX1BBR0VfU0laRSIsImF1dG9iaW5kIiwic2VsZiIsIm1ldGhvZHMiLCJtZXRob2QiLCJFcnJvciIsImJpbmQiLCJleHRyYWN0UHJvcHMiLCJwcm9wcyIsInByb3BUeXBlcyIsIm5hbWVNYXAiLCJyZWR1Y2UiLCJvcHRzIiwicHJvcE5hbWUiLCJkZXN0UHJvcE5hbWUiLCJ1bnVzZWRQcm9wcyIsImdldFBhY2thZ2VSb290IiwicmVzb3VyY2VQYXRoIiwiYXRvbSIsImdldExvYWRTZXR0aW5ncyIsImN1cnJlbnRGaWxlV2FzUmVxdWlyZWRGcm9tU25hcHNob3QiLCJwYXRoIiwiaXNBYnNvbHV0ZSIsIl9fZGlybmFtZSIsImpvaW4iLCJwYWNrYWdlUm9vdCIsInJlc29sdmUiLCJleHRuYW1lIiwiaW5kZXhPZiIsImdldEF0b21BcHBOYW1lIiwiYnJhbmRpbmciLCJuYW1lIiwiZ2V0QXRvbUhlbHBlclBhdGgiLCJwcm9jZXNzIiwicGxhdGZvcm0iLCJhcHBOYW1lIiwicmVzb3VyY2VzUGF0aCIsImV4ZWNQYXRoIiwiRFVHSVRFX1BBVEgiLCJnZXREdWdpdGVQYXRoIiwiU0hBUkVEX01PRFVMRV9QQVRIUyIsIk1hcCIsImdldFNoYXJlZE1vZHVsZVBhdGgiLCJyZWxQYXRoIiwibW9kdWxlUGF0aCIsImdldCIsInNldCIsImlzQmluYXJ5IiwiZGF0YSIsImkiLCJjb2RlIiwiY2hhckNvZGVBdCIsImRlc2NyaXB0b3JzRnJvbVByb3RvIiwicHJvdG8iLCJnZXRPd25Qcm9wZXJ0eU5hbWVzIiwiYWNjIiwiYXNzaWduIiwiUmVmbGVjdCIsImZpcnN0SW1wbGVtZW50ZXIiLCJ0YXJnZXRzIiwiUHJveHkiLCJfX2ltcGxlbWVudGF0aW9ucyIsInRhcmdldCIsImhhcyIsImZpcnN0VmFsaWRUYXJnZXQiLCJmaW5kIiwic29tZSIsImNvbXBvc2l0ZU93blByb3BlcnR5RGVzY3JpcHRvciIsImdldFByb3RvdHlwZU9mIiwicmVkdWNlUmlnaHQiLCJjcmVhdGUiLCJwcm90b3R5cGUiLCJpc1Jvb3QiLCJkaXIiLCJpc1ZhbGlkV29ya2RpciIsIm9zIiwiaG9tZWRpciIsImZpbGVFeGlzdHMiLCJhYnNvbHV0ZUZpbGVQYXRoIiwiZnMiLCJhY2Nlc3MiLCJnZXRUZW1wRGlyIiwib3B0aW9ucyIsInRlbXAiLCJ0cmFjayIsIlByb21pc2UiLCJyZWplY3QiLCJta2RpciIsInRlbXBFcnJvciIsImZvbGRlciIsInN5bWxpbmtPayIsInJlYWxwYXRoIiwicmVhbEVycm9yIiwicnBhdGgiLCJpc0ZpbGVFeGVjdXRhYmxlIiwic3RhdCIsIm1vZGUiLCJjb25zdGFudHMiLCJTX0lYVVNSIiwiaXNGaWxlU3ltbGluayIsImxzdGF0IiwiaXNTeW1ib2xpY0xpbmsiLCJzaG9ydGVuU2hhIiwic2hhIiwic2xpY2UiLCJjbGFzc05hbWVGb3JTdGF0dXMiLCJhZGRlZCIsImRlbGV0ZWQiLCJtb2RpZmllZCIsInR5cGVjaGFuZ2UiLCJlcXVpdmFsZW50Iiwibm9ybWFsaXplR2l0SGVscGVyUGF0aCIsImluUGF0aCIsInJlcGxhY2UiLCJ0b05hdGl2ZVBhdGhTZXAiLCJyYXdQYXRoIiwic3BsaXQiLCJzZXAiLCJ0b0dpdFBhdGhTZXAiLCJmaWxlUGF0aEVuZHNXaXRoIiwiZmlsZVBhdGgiLCJzZWdtZW50cyIsImVuZHNXaXRoIiwidG9TZW50ZW5jZSIsImFycmF5IiwibGVuIiwiaXRlbSIsImlkeCIsInB1c2hBdEtleSIsIm1hcCIsImV4aXN0aW5nIiwiZ2V0Q29tbWl0TWVzc2FnZVBhdGgiLCJyZXBvc2l0b3J5IiwiZ2V0R2l0RGlyZWN0b3J5UGF0aCIsImdldENvbW1pdE1lc3NhZ2VFZGl0b3JzIiwid29ya3NwYWNlIiwiaXNQcmVzZW50IiwiZ2V0VGV4dEVkaXRvcnMiLCJlZGl0b3IiLCJnZXRQYXRoIiwiQ2hhbmdlZEZpbGVJdGVtIiwiZ2V0RmlsZVBhdGNoUGFuZUl0ZW1zIiwib25seVN0YWdlZCIsImVtcHR5IiwiZ2V0UGFuZUl0ZW1zIiwiaXNGaWxlUGF0Y2hJdGVtIiwiZ2V0UmVhbEl0ZW0iLCJzdGFnaW5nU3RhdHVzIiwiaXNFbXB0eSIsImRlc3Ryb3lGaWxlUGF0Y2hQYW5lSXRlbXMiLCJpdGVtc1RvRGVzdHJveSIsImRlc3Ryb3kiLCJkZXN0cm95RW1wdHlGaWxlUGF0Y2hQYW5lSXRlbXMiLCJleHRyYWN0Q29BdXRob3JzQW5kUmF3Q29tbWl0TWVzc2FnZSIsImNvbW1pdE1lc3NhZ2UiLCJtZXNzYWdlTGluZXMiLCJjb0F1dGhvcnMiLCJsaW5lIiwibWF0Y2giLCJfIiwiZW1haWwiLCJBdXRob3IiLCJtZXNzYWdlIiwiY3JlYXRlSXRlbSIsIm5vZGUiLCJjb21wb25lbnRIb2xkZXIiLCJ1cmkiLCJleHRyYSIsImhvbGRlciIsIlJlZkhvbGRlciIsIm92ZXJyaWRlIiwiZ2V0RWxlbWVudCIsImdldE9yIiwiZ2V0UmVhbEl0ZW1Qcm9taXNlIiwiZ2V0UHJvbWlzZSIsImdldFVSSSIsImNvbXBvbmVudCIsImVxdWFsU2V0cyIsImxlZnQiLCJyaWdodCIsInNpemUiLCJlYWNoIiwiTkJTUF9DSEFSQUNURVIiLCJibGFua0xhYmVsIiwicmVhY3Rpb25UeXBlVG9FbW9qaSIsIlRIVU1CU19VUCIsIlRIVU1CU19ET1dOIiwiTEFVR0giLCJIT09SQVkiLCJDT05GVVNFRCIsIkhFQVJUIiwiUk9DS0VUIiwiRVlFUyIsIm1hcmtlZCIsImRvbVB1cmlmeSIsInJlbmRlck1hcmtkb3duIiwibWQiLCJjcmVhdGVET01QdXJpZnkiLCJzZXRPcHRpb25zIiwic2lsZW50Iiwic2FuaXRpemUiLCJzYW5pdGl6ZXIiLCJodG1sIiwiR0hPU1RfVVNFUiIsImxvZ2luIiwiYXZhdGFyVXJsIiwidXJsIl0sInNvdXJjZXMiOlsiaGVscGVycy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBmcyBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgb3MgZnJvbSAnb3MnO1xuaW1wb3J0IHRlbXAgZnJvbSAndGVtcCc7XG5cbmltcG9ydCBSZWZIb2xkZXIgZnJvbSAnLi9tb2RlbHMvcmVmLWhvbGRlcic7XG5pbXBvcnQgQXV0aG9yIGZyb20gJy4vbW9kZWxzL2F1dGhvcic7XG5cbmV4cG9ydCBjb25zdCBMSU5FX0VORElOR19SRUdFWCA9IC9cXHI/XFxuLztcbmV4cG9ydCBjb25zdCBDT19BVVRIT1JfUkVHRVggPSAvXmNvLWF1dGhvcmVkLWJ5LiAoLis/KSA8KC4rPyk+JC9pO1xuZXhwb3J0IGNvbnN0IFBBR0VfU0laRSA9IDUwO1xuZXhwb3J0IGNvbnN0IFBBR0lOQVRJT05fV0FJVF9USU1FX01TID0gMTAwO1xuZXhwb3J0IGNvbnN0IENIRUNLX1NVSVRFX1BBR0VfU0laRSA9IDEwO1xuZXhwb3J0IGNvbnN0IENIRUNLX1JVTl9QQUdFX1NJWkUgPSAyMDtcblxuZXhwb3J0IGZ1bmN0aW9uIGF1dG9iaW5kKHNlbGYsIC4uLm1ldGhvZHMpIHtcbiAgZm9yIChjb25zdCBtZXRob2Qgb2YgbWV0aG9kcykge1xuICAgIGlmICh0eXBlb2Ygc2VsZlttZXRob2RdICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBhdXRvYmluZCBtZXRob2QgJHttZXRob2R9YCk7XG4gICAgfVxuICAgIHNlbGZbbWV0aG9kXSA9IHNlbGZbbWV0aG9kXS5iaW5kKHNlbGYpO1xuICB9XG59XG5cbi8vIEV4dHJhY3QgYSBzdWJzZXQgb2YgcHJvcHMgY2hvc2VuIGZyb20gYSBwcm9wVHlwZXMgb2JqZWN0IGZyb20gYSBjb21wb25lbnQncyBwcm9wcyB0byBwYXNzIHRvIGEgZGlmZmVyZW50IEFQSS5cbi8vXG4vLyBVc2FnZTpcbi8vXG4vLyBgYGBqc1xuLy8gY29uc3QgYXBpUHJvcHMgPSB7XG4vLyAgIHplcm86IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbi8vICAgb25lOiBQcm9wVHlwZXMuc3RyaW5nLFxuLy8gICB0d286IFByb3BUeXBlcy5vYmplY3QsXG4vLyB9O1xuLy9cbi8vIGNsYXNzIENvbXBvbmVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4vLyAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4vLyAgICAgLi4uYXBpUHJvcHMsXG4vLyAgICAgZXh0cmE6IFByb3BUeXBlcy5mdW5jLFxuLy8gICB9XG4vL1xuLy8gICBhY3Rpb24oKSB7XG4vLyAgICAgY29uc3Qgb3B0aW9ucyA9IGV4dHJhY3RQcm9wcyh0aGlzLnByb3BzLCBhcGlQcm9wcyk7XG4vLyAgICAgLy8gb3B0aW9ucyBjb250YWlucyB6ZXJvLCBvbmUsIGFuZCB0d28sIGJ1dCBub3QgZXh0cmFcbi8vICAgfVxuLy8gfVxuLy8gYGBgXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdFByb3BzKHByb3BzLCBwcm9wVHlwZXMsIG5hbWVNYXAgPSB7fSkge1xuICByZXR1cm4gT2JqZWN0LmtleXMocHJvcFR5cGVzKS5yZWR1Y2UoKG9wdHMsIHByb3BOYW1lKSA9PiB7XG4gICAgaWYgKHByb3BzW3Byb3BOYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBkZXN0UHJvcE5hbWUgPSBuYW1lTWFwW3Byb3BOYW1lXSB8fCBwcm9wTmFtZTtcbiAgICAgIG9wdHNbZGVzdFByb3BOYW1lXSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICB9XG4gICAgcmV0dXJuIG9wdHM7XG4gIH0sIHt9KTtcbn1cblxuLy8gVGhlIG9wcG9zaXRlIG9mIGV4dHJhY3RQcm9wcy4gUmV0dXJuIGEgc3Vic2V0IG9mIHByb3BzIHRoYXQgZG8gKm5vdCogYXBwZWFyIGluIGEgY29tcG9uZW50J3MgcHJvcCB0eXBlcy5cbmV4cG9ydCBmdW5jdGlvbiB1bnVzZWRQcm9wcyhwcm9wcywgcHJvcFR5cGVzKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhwcm9wcykucmVkdWNlKChvcHRzLCBwcm9wTmFtZSkgPT4ge1xuICAgIGlmIChwcm9wVHlwZXNbcHJvcE5hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG9wdHNbcHJvcE5hbWVdID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgIH1cbiAgICByZXR1cm4gb3B0cztcbiAgfSwge30pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFja2FnZVJvb3QoKSB7XG4gIGNvbnN0IHtyZXNvdXJjZVBhdGh9ID0gYXRvbS5nZXRMb2FkU2V0dGluZ3MoKTtcbiAgY29uc3QgY3VycmVudEZpbGVXYXNSZXF1aXJlZEZyb21TbmFwc2hvdCA9ICFwYXRoLmlzQWJzb2x1dGUoX19kaXJuYW1lKTtcbiAgaWYgKGN1cnJlbnRGaWxlV2FzUmVxdWlyZWRGcm9tU25hcHNob3QpIHtcbiAgICByZXR1cm4gcGF0aC5qb2luKHJlc291cmNlUGF0aCwgJ25vZGVfbW9kdWxlcycsICdnaXRodWInKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBwYWNrYWdlUm9vdCA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLicpO1xuICAgIGlmIChwYXRoLmV4dG5hbWUocmVzb3VyY2VQYXRoKSA9PT0gJy5hc2FyJykge1xuICAgICAgaWYgKHBhY2thZ2VSb290LmluZGV4T2YocmVzb3VyY2VQYXRoKSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gcGF0aC5qb2luKGAke3Jlc291cmNlUGF0aH0udW5wYWNrZWRgLCAnbm9kZV9tb2R1bGVzJywgJ2dpdGh1YicpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcGFja2FnZVJvb3Q7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0QXRvbUFwcE5hbWUoKSB7XG4gIC8qXG4gIC8vIE9sZCBBdG9tIGxvZ2ljIChyZXN0b3JlIHRoaXMgaWYgd2UgbWFrZSByZWxlYXNlIGNoYW5uZWwgc3BlY2lmaWMgYmluYXJpZXMpXG4gIGNvbnN0IG1hdGNoID0gYXRvbS5nZXRWZXJzaW9uKCkubWF0Y2goLy0oW0EtWmEtel0rKShcXGQrfC0pLyk7XG4gIGlmIChtYXRjaCkge1xuICAgIGNvbnN0IGNoYW5uZWwgPSBtYXRjaFsxXTtcbiAgICByZXR1cm4gYFB1bHNhciAke2NoYW5uZWwuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBjaGFubmVsLnNsaWNlKDEpfSBIZWxwZXJgO1xuICB9XG5cbiAgcmV0dXJuICdQdWxzYXIgSGVscGVyJztcbiAgKi9cblxuICByZXR1cm4gYCR7YXRvbT8uYnJhbmRpbmc/Lm5hbWUgPz8gJ1B1bHNhcid9IEhlbHBlcmA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBdG9tSGVscGVyUGF0aCgpIHtcbiAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICdkYXJ3aW4nKSB7XG4gICAgY29uc3QgYXBwTmFtZSA9IGdldEF0b21BcHBOYW1lKCk7XG4gICAgcmV0dXJuIHBhdGgucmVzb2x2ZShwcm9jZXNzLnJlc291cmNlc1BhdGgsICcuLicsICdGcmFtZXdvcmtzJyxcbiAgICAgIGAke2FwcE5hbWV9LmFwcGAsICdDb250ZW50cycsICdNYWNPUycsIGFwcE5hbWUpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBwcm9jZXNzLmV4ZWNQYXRoO1xuICB9XG59XG5cbmxldCBEVUdJVEVfUEFUSDtcbmV4cG9ydCBmdW5jdGlvbiBnZXREdWdpdGVQYXRoKCkge1xuICBpZiAoIURVR0lURV9QQVRIKSB7XG4gICAgRFVHSVRFX1BBVEggPSByZXF1aXJlLnJlc29sdmUoJ2R1Z2l0ZScpO1xuICAgIGlmICghcGF0aC5pc0Fic29sdXRlKERVR0lURV9QQVRIKSkge1xuICAgICAgLy8gQXNzdW1lIHdlJ3JlIHNuYXBzaG90dGVkXG4gICAgICBjb25zdCB7cmVzb3VyY2VQYXRofSA9IGF0b20uZ2V0TG9hZFNldHRpbmdzKCk7XG4gICAgICBpZiAocGF0aC5leHRuYW1lKHJlc291cmNlUGF0aCkgPT09ICcuYXNhcicpIHtcbiAgICAgICAgRFVHSVRFX1BBVEggPSBwYXRoLmpvaW4oYCR7cmVzb3VyY2VQYXRofS51bnBhY2tlZGAsICdub2RlX21vZHVsZXMnLCAnZHVnaXRlJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEVUdJVEVfUEFUSCA9IHBhdGguam9pbihyZXNvdXJjZVBhdGgsICdub2RlX21vZHVsZXMnLCAnZHVnaXRlJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIERVR0lURV9QQVRIO1xufVxuXG5jb25zdCBTSEFSRURfTU9EVUxFX1BBVEhTID0gbmV3IE1hcCgpO1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNoYXJlZE1vZHVsZVBhdGgocmVsUGF0aCkge1xuICBsZXQgbW9kdWxlUGF0aCA9IFNIQVJFRF9NT0RVTEVfUEFUSFMuZ2V0KHJlbFBhdGgpO1xuICBpZiAoIW1vZHVsZVBhdGgpIHtcbiAgICBtb2R1bGVQYXRoID0gcmVxdWlyZS5yZXNvbHZlKHBhdGguam9pbihfX2Rpcm5hbWUsICdzaGFyZWQnLCByZWxQYXRoKSk7XG4gICAgaWYgKCFwYXRoLmlzQWJzb2x1dGUobW9kdWxlUGF0aCkpIHtcbiAgICAgIC8vIEFzc3VtZSB3ZSdyZSBzbmFwc2hvdHRlZFxuICAgICAgY29uc3Qge3Jlc291cmNlUGF0aH0gPSBhdG9tLmdldExvYWRTZXR0aW5ncygpO1xuICAgICAgbW9kdWxlUGF0aCA9IHBhdGguam9pbihyZXNvdXJjZVBhdGgsIG1vZHVsZVBhdGgpO1xuICAgIH1cblxuICAgIFNIQVJFRF9NT0RVTEVfUEFUSFMuc2V0KHJlbFBhdGgsIG1vZHVsZVBhdGgpO1xuICB9XG5cbiAgcmV0dXJuIG1vZHVsZVBhdGg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0JpbmFyeShkYXRhKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgNTA7IGkrKykge1xuICAgIGNvbnN0IGNvZGUgPSBkYXRhLmNoYXJDb2RlQXQoaSk7XG4gICAgLy8gQ2hhciBjb2RlIDY1NTMzIGlzIHRoZSBcInJlcGxhY2VtZW50IGNoYXJhY3RlclwiO1xuICAgIC8vIDggYW5kIGJlbG93IGFyZSBjb250cm9sIGNoYXJhY3RlcnMuXG4gICAgaWYgKGNvZGUgPT09IDY1NTMzIHx8IGNvZGUgPCA5KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGRlc2NyaXB0b3JzRnJvbVByb3RvKHByb3RvKSB7XG4gIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhwcm90bykucmVkdWNlKChhY2MsIG5hbWUpID0+IHtcbiAgICBPYmplY3QuYXNzaWduKGFjYywge1xuICAgICAgW25hbWVdOiBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90bywgbmFtZSksXG4gICAgfSk7XG4gICAgcmV0dXJuIGFjYztcbiAgfSwge30pO1xufVxuXG4vKipcbiAqIFRha2VzIGFuIGFycmF5IG9mIHRhcmdldHMgYW5kIHJldHVybnMgYSBwcm94eS4gVGhlIHByb3h5IGludGVyY2VwdHMgcHJvcGVydHkgYWNjZXNzb3IgY2FsbHMgYW5kXG4gKiByZXR1cm5zIHRoZSB2YWx1ZSBvZiB0aGF0IHByb3BlcnR5IG9uIHRoZSBmaXJzdCBvYmplY3QgaW4gYHRhcmdldHNgIHdoZXJlIHRoZSB0YXJnZXQgaW1wbGVtZW50cyB0aGF0IHByb3BlcnR5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmlyc3RJbXBsZW1lbnRlciguLi50YXJnZXRzKSB7XG4gIHJldHVybiBuZXcgUHJveHkoe19faW1wbGVtZW50YXRpb25zOiB0YXJnZXRzfSwge1xuICAgIGdldCh0YXJnZXQsIG5hbWUpIHtcbiAgICAgIGlmIChuYW1lID09PSAnZ2V0SW1wbGVtZW50ZXJzJykge1xuICAgICAgICByZXR1cm4gKCkgPT4gdGFyZ2V0cztcbiAgICAgIH1cblxuICAgICAgaWYgKFJlZmxlY3QuaGFzKHRhcmdldCwgbmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIHRhcmdldFtuYW1lXTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmlyc3RWYWxpZFRhcmdldCA9IHRhcmdldHMuZmluZCh0ID0+IFJlZmxlY3QuaGFzKHQsIG5hbWUpKTtcbiAgICAgIGlmIChmaXJzdFZhbGlkVGFyZ2V0KSB7XG4gICAgICAgIHJldHVybiBmaXJzdFZhbGlkVGFyZ2V0W25hbWVdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcbiAgICAgIGNvbnN0IGZpcnN0VmFsaWRUYXJnZXQgPSB0YXJnZXRzLmZpbmQodCA9PiBSZWZsZWN0Lmhhcyh0LCBuYW1lKSk7XG4gICAgICBpZiAoZmlyc3RWYWxpZFRhcmdldCkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmV0dXJuLWFzc2lnblxuICAgICAgICByZXR1cm4gZmlyc3RWYWxpZFRhcmdldFtuYW1lXSA9IHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJldHVybi1hc3NpZ25cbiAgICAgICAgcmV0dXJuIHRhcmdldFtuYW1lXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBVc2VkIGJ5IHNpbm9uXG4gICAgaGFzKHRhcmdldCwgbmFtZSkge1xuICAgICAgaWYgKG5hbWUgPT09ICdnZXRJbXBsZW1lbnRlcnMnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGFyZ2V0cy5zb21lKHQgPT4gUmVmbGVjdC5oYXModCwgbmFtZSkpO1xuICAgIH0sXG5cbiAgICAvLyBVc2VkIGJ5IHNpbm9uXG4gICAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgbmFtZSkge1xuICAgICAgY29uc3QgZmlyc3RWYWxpZFRhcmdldCA9IHRhcmdldHMuZmluZCh0ID0+IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQsIG5hbWUpKTtcbiAgICAgIGNvbnN0IGNvbXBvc2l0ZU93blByb3BlcnR5RGVzY3JpcHRvciA9IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgbmFtZSk7XG4gICAgICBpZiAoZmlyc3RWYWxpZFRhcmdldCkge1xuICAgICAgICByZXR1cm4gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoZmlyc3RWYWxpZFRhcmdldCwgbmFtZSk7XG4gICAgICB9IGVsc2UgaWYgKGNvbXBvc2l0ZU93blByb3BlcnR5RGVzY3JpcHRvcikge1xuICAgICAgICByZXR1cm4gY29tcG9zaXRlT3duUHJvcGVydHlEZXNjcmlwdG9yO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gVXNlZCBieSBzaW5vblxuICAgIGdldFByb3RvdHlwZU9mKHRhcmdldCkge1xuICAgICAgcmV0dXJuIHRhcmdldHMucmVkdWNlUmlnaHQoKGFjYywgdCkgPT4ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShhY2MsIGRlc2NyaXB0b3JzRnJvbVByb3RvKE9iamVjdC5nZXRQcm90b3R5cGVPZih0KSkpO1xuICAgICAgfSwgT2JqZWN0LnByb3RvdHlwZSk7XG4gICAgfSxcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGlzUm9vdChkaXIpIHtcbiAgcmV0dXJuIHBhdGgucmVzb2x2ZShkaXIsICcuLicpID09PSBkaXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkV29ya2RpcihkaXIpIHtcbiAgcmV0dXJuIGRpciAhPT0gb3MuaG9tZWRpcigpICYmICFpc1Jvb3QoZGlyKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZpbGVFeGlzdHMoYWJzb2x1dGVGaWxlUGF0aCkge1xuICB0cnkge1xuICAgIGF3YWl0IGZzLmFjY2VzcyhhYnNvbHV0ZUZpbGVQYXRoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChlLmNvZGUgPT09ICdFTk9FTlQnKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhyb3cgZTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGVtcERpcihvcHRpb25zID0ge30pIHtcbiAgdGVtcC50cmFjaygpO1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgdGVtcC5ta2RpcihvcHRpb25zLCAodGVtcEVycm9yLCBmb2xkZXIpID0+IHtcbiAgICAgIGlmICh0ZW1wRXJyb3IpIHtcbiAgICAgICAgcmVqZWN0KHRlbXBFcnJvcik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMuc3ltbGlua09rKSB7XG4gICAgICAgIHJlc29sdmUoZm9sZGVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnJlYWxwYXRoKGZvbGRlciwgKHJlYWxFcnJvciwgcnBhdGgpID0+IChyZWFsRXJyb3IgPyByZWplY3QocmVhbEVycm9yKSA6IHJlc29sdmUocnBhdGgpKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaXNGaWxlRXhlY3V0YWJsZShhYnNvbHV0ZUZpbGVQYXRoKSB7XG4gIGNvbnN0IHN0YXQgPSBhd2FpdCBmcy5zdGF0KGFic29sdXRlRmlsZVBhdGgpO1xuICByZXR1cm4gc3RhdC5tb2RlICYgZnMuY29uc3RhbnRzLlNfSVhVU1I7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tYml0d2lzZVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaXNGaWxlU3ltbGluayhhYnNvbHV0ZUZpbGVQYXRoKSB7XG4gIGNvbnN0IHN0YXQgPSBhd2FpdCBmcy5sc3RhdChhYnNvbHV0ZUZpbGVQYXRoKTtcbiAgcmV0dXJuIHN0YXQuaXNTeW1ib2xpY0xpbmsoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNob3J0ZW5TaGEoc2hhKSB7XG4gIHJldHVybiBzaGEuc2xpY2UoMCwgOCk7XG59XG5cbmV4cG9ydCBjb25zdCBjbGFzc05hbWVGb3JTdGF0dXMgPSB7XG4gIGFkZGVkOiAnYWRkZWQnLFxuICBkZWxldGVkOiAncmVtb3ZlZCcsXG4gIG1vZGlmaWVkOiAnbW9kaWZpZWQnLFxuICB0eXBlY2hhbmdlOiAnbW9kaWZpZWQnLFxuICBlcXVpdmFsZW50OiAnaWdub3JlZCcsXG59O1xuXG4vKlxuICogQXBwbHkgYW55IHBsYXRmb3JtLXNwZWNpZmljIG11bmdpbmcgdG8gYSBwYXRoIGJlZm9yZSBwcmVzZW50aW5nIGl0IGFzXG4gKiBhIGdpdCBlbnZpcm9ubWVudCB2YXJpYWJsZSBvciBvcHRpb24uXG4gKlxuICogQ29udmVydCBhIFdpbmRvd3Mtc3R5bGUgXCJDOlxcZm9vXFxiYXJcXGJhelwiIHBhdGggdG8gYSBcIi9jL2Zvby9iYXIvYmF6XCIgVU5JWC15XG4gKiBwYXRoIHRoYXQgdGhlIHNoLmV4ZSB1c2VkIHRvIGV4ZWN1dGUgZ2l0J3MgY3JlZGVudGlhbCBoZWxwZXJzIHdpbGxcbiAqIHVuZGVyc3RhbmQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVHaXRIZWxwZXJQYXRoKGluUGF0aCkge1xuICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJykge1xuICAgIHJldHVybiBpblBhdGgucmVwbGFjZSgvXFxcXC9nLCAnLycpLnJlcGxhY2UoL14oW146XSspOi8sICcvJDEnKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gaW5QYXRoO1xuICB9XG59XG5cbi8qXG4gKiBPbiBXaW5kb3dzLCBnaXQgY29tbWFuZHMgcmVwb3J0IHBhdGhzIHdpdGggLyBkZWxpbWl0ZXJzLiBDb252ZXJ0IHRoZW0gdG8gXFwtZGVsaW1pdGVkIHBhdGhzXG4gKiBzbyB0aGF0IEF0b20gdW5pZnJvbWx5IHRyZWF0cyBwYXRocyB3aXRoIG5hdGl2ZSBwYXRoIHNlcGFyYXRvcnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b05hdGl2ZVBhdGhTZXAocmF3UGF0aCkge1xuICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSAhPT0gJ3dpbjMyJykge1xuICAgIHJldHVybiByYXdQYXRoO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiByYXdQYXRoLnNwbGl0KCcvJykuam9pbihwYXRoLnNlcCk7XG4gIH1cbn1cblxuLypcbiAqIENvbnZlcnQgV2luZG93cyBwYXRocyBiYWNrIHRvIC8tZGVsaW1pdGVkIHBhdGhzIHRvIGJlIHByZXNlbnRlZCB0byBnaXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b0dpdFBhdGhTZXAocmF3UGF0aCkge1xuICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSAhPT0gJ3dpbjMyJykge1xuICAgIHJldHVybiByYXdQYXRoO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiByYXdQYXRoLnNwbGl0KHBhdGguc2VwKS5qb2luKCcvJyk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbGVQYXRoRW5kc1dpdGgoZmlsZVBhdGgsIC4uLnNlZ21lbnRzKSB7XG4gIHJldHVybiBmaWxlUGF0aC5lbmRzV2l0aChwYXRoLmpvaW4oLi4uc2VnbWVudHMpKTtcbn1cblxuLyoqXG4gKiBUdXJucyBhbiBhcnJheSBvZiB0aGluZ3MgQGt1eWNoYWNvIGNhbm5vdCBlYXRcbiAqIGludG8gYSBzZW50ZW5jZSBjb250YWluaW5nIHRoaW5ncyBAa3V5Y2hhY28gY2Fubm90IGVhdFxuICpcbiAqIFsndG9hc3QnXSA9PiAndG9hc3QnXG4gKiBbJ3RvYXN0JywgJ2VnZ3MnXSA9PiAndG9hc3QgYW5kIGVnZ3MnXG4gKiBbJ3RvYXN0JywgJ2VnZ3MnLCAnY2hlZXNlJ10gPT4gJ3RvYXN0LCBlZ2dzLCBhbmQgY2hlZXNlJ1xuICpcbiAqIE94Zm9yZCBjb21tYSBpbmNsdWRlZCBiZWNhdXNlIHlvdSdyZSB3cm9uZywgc2h1dCB1cC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvU2VudGVuY2UoYXJyYXkpIHtcbiAgY29uc3QgbGVuID0gYXJyYXkubGVuZ3RoO1xuICBpZiAobGVuID09PSAxKSB7XG4gICAgcmV0dXJuIGAke2FycmF5WzBdfWA7XG4gIH0gZWxzZSBpZiAobGVuID09PSAyKSB7XG4gICAgcmV0dXJuIGAke2FycmF5WzBdfSBhbmQgJHthcnJheVsxXX1gO1xuICB9XG5cbiAgcmV0dXJuIGFycmF5LnJlZHVjZSgoYWNjLCBpdGVtLCBpZHgpID0+IHtcbiAgICBpZiAoaWR4ID09PSAwKSB7XG4gICAgICByZXR1cm4gYCR7aXRlbX1gO1xuICAgIH0gZWxzZSBpZiAoaWR4ID09PSBsZW4gLSAxKSB7XG4gICAgICByZXR1cm4gYCR7YWNjfSwgYW5kICR7aXRlbX1gO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYCR7YWNjfSwgJHtpdGVtfWA7XG4gICAgfVxuICB9LCAnJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwdXNoQXRLZXkobWFwLCBrZXksIHZhbHVlKSB7XG4gIGxldCBleGlzdGluZyA9IG1hcC5nZXQoa2V5KTtcbiAgaWYgKCFleGlzdGluZykge1xuICAgIGV4aXN0aW5nID0gW107XG4gICAgbWFwLnNldChrZXksIGV4aXN0aW5nKTtcbiAgfVxuICBleGlzdGluZy5wdXNoKHZhbHVlKTtcbn1cblxuLy8gUmVwb3NpdG9yeSBhbmQgd29ya3NwYWNlIGhlbHBlcnNcblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbW1pdE1lc3NhZ2VQYXRoKHJlcG9zaXRvcnkpIHtcbiAgcmV0dXJuIHBhdGguam9pbihyZXBvc2l0b3J5LmdldEdpdERpcmVjdG9yeVBhdGgoKSwgJ0FUT01fQ09NTUlUX0VESVRNU0cnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbW1pdE1lc3NhZ2VFZGl0b3JzKHJlcG9zaXRvcnksIHdvcmtzcGFjZSkge1xuICBpZiAoIXJlcG9zaXRvcnkuaXNQcmVzZW50KCkpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgcmV0dXJuIHdvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpLmZpbHRlcihlZGl0b3IgPT4gZWRpdG9yLmdldFBhdGgoKSA9PT0gZ2V0Q29tbWl0TWVzc2FnZVBhdGgocmVwb3NpdG9yeSkpO1xufVxuXG5sZXQgQ2hhbmdlZEZpbGVJdGVtID0gbnVsbDtcbmV4cG9ydCBmdW5jdGlvbiBnZXRGaWxlUGF0Y2hQYW5lSXRlbXMoe29ubHlTdGFnZWQsIGVtcHR5fSA9IHt9LCB3b3Jrc3BhY2UpIHtcbiAgaWYgKENoYW5nZWRGaWxlSXRlbSA9PT0gbnVsbCkge1xuICAgIENoYW5nZWRGaWxlSXRlbSA9IHJlcXVpcmUoJy4vaXRlbXMvY2hhbmdlZC1maWxlLWl0ZW0nKS5kZWZhdWx0O1xuICB9XG5cbiAgcmV0dXJuIHdvcmtzcGFjZS5nZXRQYW5lSXRlbXMoKS5maWx0ZXIoaXRlbSA9PiB7XG4gICAgY29uc3QgaXNGaWxlUGF0Y2hJdGVtID0gaXRlbSAmJiBpdGVtLmdldFJlYWxJdGVtICYmIGl0ZW0uZ2V0UmVhbEl0ZW0oKSBpbnN0YW5jZW9mIENoYW5nZWRGaWxlSXRlbTtcbiAgICBpZiAob25seVN0YWdlZCkge1xuICAgICAgcmV0dXJuIGlzRmlsZVBhdGNoSXRlbSAmJiBpdGVtLnN0YWdpbmdTdGF0dXMgPT09ICdzdGFnZWQnO1xuICAgIH0gZWxzZSBpZiAoZW1wdHkpIHtcbiAgICAgIHJldHVybiBpc0ZpbGVQYXRjaEl0ZW0gPyBpdGVtLmlzRW1wdHkoKSA6IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gaXNGaWxlUGF0Y2hJdGVtO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXN0cm95RmlsZVBhdGNoUGFuZUl0ZW1zKHtvbmx5U3RhZ2VkfSA9IHt9LCB3b3Jrc3BhY2UpIHtcbiAgY29uc3QgaXRlbXNUb0Rlc3Ryb3kgPSBnZXRGaWxlUGF0Y2hQYW5lSXRlbXMoe29ubHlTdGFnZWR9LCB3b3Jrc3BhY2UpO1xuICBpdGVtc1RvRGVzdHJveS5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5kZXN0cm95KCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVzdHJveUVtcHR5RmlsZVBhdGNoUGFuZUl0ZW1zKHdvcmtzcGFjZSkge1xuICBjb25zdCBpdGVtc1RvRGVzdHJveSA9IGdldEZpbGVQYXRjaFBhbmVJdGVtcyh7ZW1wdHk6IHRydWV9LCB3b3Jrc3BhY2UpO1xuICBpdGVtc1RvRGVzdHJveS5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5kZXN0cm95KCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdENvQXV0aG9yc0FuZFJhd0NvbW1pdE1lc3NhZ2UoY29tbWl0TWVzc2FnZSkge1xuICBjb25zdCBtZXNzYWdlTGluZXMgPSBbXTtcbiAgY29uc3QgY29BdXRob3JzID0gW107XG5cbiAgZm9yIChjb25zdCBsaW5lIG9mIGNvbW1pdE1lc3NhZ2Uuc3BsaXQoTElORV9FTkRJTkdfUkVHRVgpKSB7XG4gICAgY29uc3QgbWF0Y2ggPSBsaW5lLm1hdGNoKENPX0FVVEhPUl9SRUdFWCk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgIGNvbnN0IFtfLCBuYW1lLCBlbWFpbF0gPSBtYXRjaDtcbiAgICAgIGNvQXV0aG9ycy5wdXNoKG5ldyBBdXRob3IoZW1haWwsIG5hbWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWVzc2FnZUxpbmVzLnB1c2gobGluZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHttZXNzYWdlOiBtZXNzYWdlTGluZXMuam9pbignXFxuJyksIGNvQXV0aG9yc307XG59XG5cbi8vIEF0b20gQVBJIHBhbmUgaXRlbSBtYW5pcHVsYXRpb25cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUl0ZW0obm9kZSwgY29tcG9uZW50SG9sZGVyID0gbnVsbCwgdXJpID0gbnVsbCwgZXh0cmEgPSB7fSkge1xuICBjb25zdCBob2xkZXIgPSBjb21wb25lbnRIb2xkZXIgfHwgbmV3IFJlZkhvbGRlcigpO1xuXG4gIGNvbnN0IG92ZXJyaWRlID0ge1xuICAgIGdldEVsZW1lbnQ6ICgpID0+IG5vZGUsXG5cbiAgICBnZXRSZWFsSXRlbTogKCkgPT4gaG9sZGVyLmdldE9yKG51bGwpLFxuXG4gICAgZ2V0UmVhbEl0ZW1Qcm9taXNlOiAoKSA9PiBob2xkZXIuZ2V0UHJvbWlzZSgpLFxuXG4gICAgLi4uZXh0cmEsXG4gIH07XG5cbiAgaWYgKHVyaSkge1xuICAgIG92ZXJyaWRlLmdldFVSSSA9ICgpID0+IHVyaTtcbiAgfVxuXG4gIGlmIChjb21wb25lbnRIb2xkZXIpIHtcbiAgICByZXR1cm4gbmV3IFByb3h5KG92ZXJyaWRlLCB7XG4gICAgICBnZXQodGFyZ2V0LCBuYW1lKSB7XG4gICAgICAgIGlmIChSZWZsZWN0Lmhhcyh0YXJnZXQsIG5hbWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHRhcmdldFtuYW1lXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZSB7dmFsdWU6IC4uLn0gd3JhcHBlciBwcmV2ZW50cyAubWFwKCkgZnJvbSBmbGF0dGVuaW5nIGEgcmV0dXJuZWQgUmVmSG9sZGVyLlxuICAgICAgICAvLyBJZiBjb21wb25lbnRbbmFtZV0gaXMgYSBSZWZIb2xkZXIsIHdlIHdhbnQgdG8gcmV0dXJuIHRoYXQgUmVmSG9sZGVyIGFzLWlzLlxuICAgICAgICBjb25zdCB7dmFsdWV9ID0gaG9sZGVyLm1hcChjb21wb25lbnQgPT4gKHt2YWx1ZTogY29tcG9uZW50W25hbWVdfSkpLmdldE9yKHt2YWx1ZTogdW5kZWZpbmVkfSk7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH0sXG5cbiAgICAgIHNldCh0YXJnZXQsIG5hbWUsIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBob2xkZXIubWFwKGNvbXBvbmVudCA9PiB7XG4gICAgICAgICAgY29tcG9uZW50W25hbWVdID0gdmFsdWU7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pLmdldE9yKHRydWUpO1xuICAgICAgfSxcblxuICAgICAgaGFzKHRhcmdldCwgbmFtZSkge1xuICAgICAgICByZXR1cm4gaG9sZGVyLm1hcChjb21wb25lbnQgPT4gUmVmbGVjdC5oYXMoY29tcG9uZW50LCBuYW1lKSkuZ2V0T3IoZmFsc2UpIHx8IFJlZmxlY3QuaGFzKHRhcmdldCwgbmFtZSk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBvdmVycmlkZTtcbiAgfVxufVxuXG4vLyBTZXQgZnVuY3Rpb25zXG5cbmV4cG9ydCBmdW5jdGlvbiBlcXVhbFNldHMobGVmdCwgcmlnaHQpIHtcbiAgaWYgKGxlZnQuc2l6ZSAhPT0gcmlnaHQuc2l6ZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZvciAoY29uc3QgZWFjaCBvZiBsZWZ0KSB7XG4gICAgaWYgKCFyaWdodC5oYXMoZWFjaCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gQ29uc3RhbnRzXG5cbmV4cG9ydCBjb25zdCBOQlNQX0NIQVJBQ1RFUiA9ICdcXHUwMGEwJztcblxuZXhwb3J0IGZ1bmN0aW9uIGJsYW5rTGFiZWwoKSB7XG4gIHJldHVybiBOQlNQX0NIQVJBQ1RFUjtcbn1cblxuZXhwb3J0IGNvbnN0IHJlYWN0aW9uVHlwZVRvRW1vamkgPSB7XG4gIFRIVU1CU19VUDogJ/CfkY0nLFxuICBUSFVNQlNfRE9XTjogJ/CfkY4nLFxuICBMQVVHSDogJ/CfmIYnLFxuICBIT09SQVk6ICfwn46JJyxcbiAgQ09ORlVTRUQ6ICfwn5iVJyxcbiAgSEVBUlQ6ICfinaTvuI8nLFxuICBST0NLRVQ6ICfwn5qAJyxcbiAgRVlFUzogJ/CfkYAnLFxufTtcblxuLy8gTWFya2Rvd25cblxubGV0IG1hcmtlZCA9IG51bGw7XG5sZXQgZG9tUHVyaWZ5ID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlck1hcmtkb3duKG1kKSB7XG4gIGlmIChtYXJrZWQgPT09IG51bGwpIHtcbiAgICBtYXJrZWQgPSByZXF1aXJlKCdtYXJrZWQnKTtcblxuICAgIGlmIChkb21QdXJpZnkgPT09IG51bGwpIHtcbiAgICAgIGNvbnN0IGNyZWF0ZURPTVB1cmlmeSA9IHJlcXVpcmUoJ2RvbXB1cmlmeScpO1xuICAgICAgZG9tUHVyaWZ5ID0gY3JlYXRlRE9NUHVyaWZ5KCk7XG4gICAgfVxuXG4gICAgbWFya2VkLnNldE9wdGlvbnMoe1xuICAgICAgc2lsZW50OiB0cnVlLFxuICAgICAgc2FuaXRpemU6IHRydWUsXG4gICAgICBzYW5pdGl6ZXI6IGh0bWwgPT4gZG9tUHVyaWZ5LnNhbml0aXplKGh0bWwpLFxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIG1hcmtlZChtZCk7XG59XG5cbmV4cG9ydCBjb25zdCBHSE9TVF9VU0VSID0ge1xuICBsb2dpbjogJ2dob3N0JyxcbiAgYXZhdGFyVXJsOiAnaHR0cHM6Ly9hdmF0YXJzMS5naXRodWJ1c2VyY29udGVudC5jb20vdS8xMDEzNz92PTQnLFxuICB1cmw6ICdodHRwczovL2dpdGh1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