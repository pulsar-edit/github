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
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJMSU5FX0VORElOR19SRUdFWCIsIkNPX0FVVEhPUl9SRUdFWCIsIlBBR0VfU0laRSIsIlBBR0lOQVRJT05fV0FJVF9USU1FX01TIiwiQ0hFQ0tfU1VJVEVfUEFHRV9TSVpFIiwiQ0hFQ0tfUlVOX1BBR0VfU0laRSIsImF1dG9iaW5kIiwic2VsZiIsIm1ldGhvZHMiLCJtZXRob2QiLCJFcnJvciIsImJpbmQiLCJleHRyYWN0UHJvcHMiLCJwcm9wcyIsInByb3BUeXBlcyIsIm5hbWVNYXAiLCJPYmplY3QiLCJrZXlzIiwicmVkdWNlIiwib3B0cyIsInByb3BOYW1lIiwidW5kZWZpbmVkIiwiZGVzdFByb3BOYW1lIiwidW51c2VkUHJvcHMiLCJnZXRQYWNrYWdlUm9vdCIsInJlc291cmNlUGF0aCIsImF0b20iLCJnZXRMb2FkU2V0dGluZ3MiLCJjdXJyZW50RmlsZVdhc1JlcXVpcmVkRnJvbVNuYXBzaG90IiwicGF0aCIsImlzQWJzb2x1dGUiLCJfX2Rpcm5hbWUiLCJqb2luIiwicGFja2FnZVJvb3QiLCJyZXNvbHZlIiwiZXh0bmFtZSIsImluZGV4T2YiLCJnZXRBdG9tQXBwTmFtZSIsImJyYW5kaW5nIiwibmFtZSIsImdldEF0b21IZWxwZXJQYXRoIiwicHJvY2VzcyIsInBsYXRmb3JtIiwiYXBwTmFtZSIsInJlc291cmNlc1BhdGgiLCJleGVjUGF0aCIsIkRVR0lURV9QQVRIIiwiZ2V0RHVnaXRlUGF0aCIsInJlcXVpcmUiLCJTSEFSRURfTU9EVUxFX1BBVEhTIiwiTWFwIiwiZ2V0U2hhcmVkTW9kdWxlUGF0aCIsInJlbFBhdGgiLCJtb2R1bGVQYXRoIiwiZ2V0Iiwic2V0IiwiaXNCaW5hcnkiLCJkYXRhIiwiaSIsImNvZGUiLCJjaGFyQ29kZUF0IiwiZGVzY3JpcHRvcnNGcm9tUHJvdG8iLCJwcm90byIsImdldE93blByb3BlcnR5TmFtZXMiLCJhY2MiLCJhc3NpZ24iLCJSZWZsZWN0IiwiZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yIiwiZmlyc3RJbXBsZW1lbnRlciIsInRhcmdldHMiLCJQcm94eSIsIl9faW1wbGVtZW50YXRpb25zIiwidGFyZ2V0IiwiaGFzIiwiZmlyc3RWYWxpZFRhcmdldCIsImZpbmQiLCJ0IiwidmFsdWUiLCJzb21lIiwiY29tcG9zaXRlT3duUHJvcGVydHlEZXNjcmlwdG9yIiwiZ2V0UHJvdG90eXBlT2YiLCJyZWR1Y2VSaWdodCIsImNyZWF0ZSIsInByb3RvdHlwZSIsImlzUm9vdCIsImRpciIsImlzVmFsaWRXb3JrZGlyIiwib3MiLCJob21lZGlyIiwiZmlsZUV4aXN0cyIsImFic29sdXRlRmlsZVBhdGgiLCJmcyIsImFjY2VzcyIsImUiLCJnZXRUZW1wRGlyIiwib3B0aW9ucyIsInRlbXAiLCJ0cmFjayIsIlByb21pc2UiLCJyZWplY3QiLCJta2RpciIsInRlbXBFcnJvciIsImZvbGRlciIsInN5bWxpbmtPayIsInJlYWxwYXRoIiwicmVhbEVycm9yIiwicnBhdGgiLCJpc0ZpbGVFeGVjdXRhYmxlIiwic3RhdCIsIm1vZGUiLCJjb25zdGFudHMiLCJTX0lYVVNSIiwiaXNGaWxlU3ltbGluayIsImxzdGF0IiwiaXNTeW1ib2xpY0xpbmsiLCJzaG9ydGVuU2hhIiwic2hhIiwic2xpY2UiLCJjbGFzc05hbWVGb3JTdGF0dXMiLCJhZGRlZCIsImRlbGV0ZWQiLCJtb2RpZmllZCIsInR5cGVjaGFuZ2UiLCJlcXVpdmFsZW50Iiwibm9ybWFsaXplR2l0SGVscGVyUGF0aCIsImluUGF0aCIsInJlcGxhY2UiLCJ0b05hdGl2ZVBhdGhTZXAiLCJyYXdQYXRoIiwic3BsaXQiLCJzZXAiLCJ0b0dpdFBhdGhTZXAiLCJmaWxlUGF0aEVuZHNXaXRoIiwiZmlsZVBhdGgiLCJzZWdtZW50cyIsImVuZHNXaXRoIiwidG9TZW50ZW5jZSIsImFycmF5IiwibGVuIiwibGVuZ3RoIiwiaXRlbSIsImlkeCIsInB1c2hBdEtleSIsIm1hcCIsImtleSIsImV4aXN0aW5nIiwicHVzaCIsImdldENvbW1pdE1lc3NhZ2VQYXRoIiwicmVwb3NpdG9yeSIsImdldEdpdERpcmVjdG9yeVBhdGgiLCJnZXRDb21taXRNZXNzYWdlRWRpdG9ycyIsIndvcmtzcGFjZSIsImlzUHJlc2VudCIsImdldFRleHRFZGl0b3JzIiwiZmlsdGVyIiwiZWRpdG9yIiwiZ2V0UGF0aCIsIkNoYW5nZWRGaWxlSXRlbSIsImdldEZpbGVQYXRjaFBhbmVJdGVtcyIsIm9ubHlTdGFnZWQiLCJlbXB0eSIsImRlZmF1bHQiLCJnZXRQYW5lSXRlbXMiLCJpc0ZpbGVQYXRjaEl0ZW0iLCJnZXRSZWFsSXRlbSIsInN0YWdpbmdTdGF0dXMiLCJpc0VtcHR5IiwiZGVzdHJveUZpbGVQYXRjaFBhbmVJdGVtcyIsIml0ZW1zVG9EZXN0cm95IiwiZm9yRWFjaCIsImRlc3Ryb3kiLCJkZXN0cm95RW1wdHlGaWxlUGF0Y2hQYW5lSXRlbXMiLCJleHRyYWN0Q29BdXRob3JzQW5kUmF3Q29tbWl0TWVzc2FnZSIsImNvbW1pdE1lc3NhZ2UiLCJtZXNzYWdlTGluZXMiLCJjb0F1dGhvcnMiLCJsaW5lIiwibWF0Y2giLCJfIiwiZW1haWwiLCJBdXRob3IiLCJtZXNzYWdlIiwiY3JlYXRlSXRlbSIsIm5vZGUiLCJjb21wb25lbnRIb2xkZXIiLCJ1cmkiLCJleHRyYSIsImhvbGRlciIsIlJlZkhvbGRlciIsIm92ZXJyaWRlIiwiZ2V0RWxlbWVudCIsImdldE9yIiwiZ2V0UmVhbEl0ZW1Qcm9taXNlIiwiZ2V0UHJvbWlzZSIsImdldFVSSSIsImNvbXBvbmVudCIsImVxdWFsU2V0cyIsImxlZnQiLCJyaWdodCIsInNpemUiLCJlYWNoIiwiTkJTUF9DSEFSQUNURVIiLCJibGFua0xhYmVsIiwicmVhY3Rpb25UeXBlVG9FbW9qaSIsIlRIVU1CU19VUCIsIlRIVU1CU19ET1dOIiwiTEFVR0giLCJIT09SQVkiLCJDT05GVVNFRCIsIkhFQVJUIiwiUk9DS0VUIiwiRVlFUyIsIm1hcmtlZCIsImRvbVB1cmlmeSIsInJlbmRlck1hcmtkb3duIiwibWQiLCJjcmVhdGVET01QdXJpZnkiLCJzZXRPcHRpb25zIiwic2lsZW50Iiwic2FuaXRpemUiLCJzYW5pdGl6ZXIiLCJodG1sIiwiR0hPU1RfVVNFUiIsImxvZ2luIiwiYXZhdGFyVXJsIiwidXJsIl0sInNvdXJjZXMiOlsiaGVscGVycy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCBmcyBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgb3MgZnJvbSAnb3MnO1xuaW1wb3J0IHRlbXAgZnJvbSAndGVtcCc7XG5cbmltcG9ydCBSZWZIb2xkZXIgZnJvbSAnLi9tb2RlbHMvcmVmLWhvbGRlcic7XG5pbXBvcnQgQXV0aG9yIGZyb20gJy4vbW9kZWxzL2F1dGhvcic7XG5cbmV4cG9ydCBjb25zdCBMSU5FX0VORElOR19SRUdFWCA9IC9cXHI/XFxuLztcbmV4cG9ydCBjb25zdCBDT19BVVRIT1JfUkVHRVggPSAvXmNvLWF1dGhvcmVkLWJ5LiAoLis/KSA8KC4rPyk+JC9pO1xuZXhwb3J0IGNvbnN0IFBBR0VfU0laRSA9IDUwO1xuZXhwb3J0IGNvbnN0IFBBR0lOQVRJT05fV0FJVF9USU1FX01TID0gMTAwO1xuZXhwb3J0IGNvbnN0IENIRUNLX1NVSVRFX1BBR0VfU0laRSA9IDEwO1xuZXhwb3J0IGNvbnN0IENIRUNLX1JVTl9QQUdFX1NJWkUgPSAyMDtcblxuZXhwb3J0IGZ1bmN0aW9uIGF1dG9iaW5kKHNlbGYsIC4uLm1ldGhvZHMpIHtcbiAgZm9yIChjb25zdCBtZXRob2Qgb2YgbWV0aG9kcykge1xuICAgIGlmICh0eXBlb2Ygc2VsZlttZXRob2RdICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVuYWJsZSB0byBhdXRvYmluZCBtZXRob2QgJHttZXRob2R9YCk7XG4gICAgfVxuICAgIHNlbGZbbWV0aG9kXSA9IHNlbGZbbWV0aG9kXS5iaW5kKHNlbGYpO1xuICB9XG59XG5cbi8vIEV4dHJhY3QgYSBzdWJzZXQgb2YgcHJvcHMgY2hvc2VuIGZyb20gYSBwcm9wVHlwZXMgb2JqZWN0IGZyb20gYSBjb21wb25lbnQncyBwcm9wcyB0byBwYXNzIHRvIGEgZGlmZmVyZW50IEFQSS5cbi8vXG4vLyBVc2FnZTpcbi8vXG4vLyBgYGBqc1xuLy8gY29uc3QgYXBpUHJvcHMgPSB7XG4vLyAgIHplcm86IFByb3BUeXBlcy5udW1iZXIuaXNSZXF1aXJlZCxcbi8vICAgb25lOiBQcm9wVHlwZXMuc3RyaW5nLFxuLy8gICB0d286IFByb3BUeXBlcy5vYmplY3QsXG4vLyB9O1xuLy9cbi8vIGNsYXNzIENvbXBvbmVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudCB7XG4vLyAgIHN0YXRpYyBwcm9wVHlwZXMgPSB7XG4vLyAgICAgLi4uYXBpUHJvcHMsXG4vLyAgICAgZXh0cmE6IFByb3BUeXBlcy5mdW5jLFxuLy8gICB9XG4vL1xuLy8gICBhY3Rpb24oKSB7XG4vLyAgICAgY29uc3Qgb3B0aW9ucyA9IGV4dHJhY3RQcm9wcyh0aGlzLnByb3BzLCBhcGlQcm9wcyk7XG4vLyAgICAgLy8gb3B0aW9ucyBjb250YWlucyB6ZXJvLCBvbmUsIGFuZCB0d28sIGJ1dCBub3QgZXh0cmFcbi8vICAgfVxuLy8gfVxuLy8gYGBgXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdFByb3BzKHByb3BzLCBwcm9wVHlwZXMsIG5hbWVNYXAgPSB7fSkge1xuICByZXR1cm4gT2JqZWN0LmtleXMocHJvcFR5cGVzKS5yZWR1Y2UoKG9wdHMsIHByb3BOYW1lKSA9PiB7XG4gICAgaWYgKHByb3BzW3Byb3BOYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjb25zdCBkZXN0UHJvcE5hbWUgPSBuYW1lTWFwW3Byb3BOYW1lXSB8fCBwcm9wTmFtZTtcbiAgICAgIG9wdHNbZGVzdFByb3BOYW1lXSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICB9XG4gICAgcmV0dXJuIG9wdHM7XG4gIH0sIHt9KTtcbn1cblxuLy8gVGhlIG9wcG9zaXRlIG9mIGV4dHJhY3RQcm9wcy4gUmV0dXJuIGEgc3Vic2V0IG9mIHByb3BzIHRoYXQgZG8gKm5vdCogYXBwZWFyIGluIGEgY29tcG9uZW50J3MgcHJvcCB0eXBlcy5cbmV4cG9ydCBmdW5jdGlvbiB1bnVzZWRQcm9wcyhwcm9wcywgcHJvcFR5cGVzKSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhwcm9wcykucmVkdWNlKChvcHRzLCBwcm9wTmFtZSkgPT4ge1xuICAgIGlmIChwcm9wVHlwZXNbcHJvcE5hbWVdID09PSB1bmRlZmluZWQpIHtcbiAgICAgIG9wdHNbcHJvcE5hbWVdID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgIH1cbiAgICByZXR1cm4gb3B0cztcbiAgfSwge30pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UGFja2FnZVJvb3QoKSB7XG4gIGNvbnN0IHtyZXNvdXJjZVBhdGh9ID0gYXRvbS5nZXRMb2FkU2V0dGluZ3MoKTtcbiAgY29uc3QgY3VycmVudEZpbGVXYXNSZXF1aXJlZEZyb21TbmFwc2hvdCA9ICFwYXRoLmlzQWJzb2x1dGUoX19kaXJuYW1lKTtcbiAgaWYgKGN1cnJlbnRGaWxlV2FzUmVxdWlyZWRGcm9tU25hcHNob3QpIHtcbiAgICByZXR1cm4gcGF0aC5qb2luKHJlc291cmNlUGF0aCwgJ25vZGVfbW9kdWxlcycsICdnaXRodWInKTtcbiAgfSBlbHNlIHtcbiAgICBjb25zdCBwYWNrYWdlUm9vdCA9IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuLicpO1xuICAgIGlmIChwYXRoLmV4dG5hbWUocmVzb3VyY2VQYXRoKSA9PT0gJy5hc2FyJykge1xuICAgICAgaWYgKHBhY2thZ2VSb290LmluZGV4T2YocmVzb3VyY2VQYXRoKSA9PT0gMCkge1xuICAgICAgICByZXR1cm4gcGF0aC5qb2luKGAke3Jlc291cmNlUGF0aH0udW5wYWNrZWRgLCAnbm9kZV9tb2R1bGVzJywgJ2dpdGh1YicpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcGFja2FnZVJvb3Q7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0QXRvbUFwcE5hbWUoKSB7XG4gIC8qXG4gIC8vIE9sZCBBdG9tIGxvZ2ljIChyZXN0b3JlIHRoaXMgaWYgd2UgbWFrZSByZWxlYXNlIGNoYW5uZWwgc3BlY2lmaWMgYmluYXJpZXMpXG4gIGNvbnN0IG1hdGNoID0gYXRvbS5nZXRWZXJzaW9uKCkubWF0Y2goLy0oW0EtWmEtel0rKShcXGQrfC0pLyk7XG4gIGlmIChtYXRjaCkge1xuICAgIGNvbnN0IGNoYW5uZWwgPSBtYXRjaFsxXTtcbiAgICByZXR1cm4gYFB1bHNhciAke2NoYW5uZWwuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBjaGFubmVsLnNsaWNlKDEpfSBIZWxwZXJgO1xuICB9XG5cbiAgcmV0dXJuICdQdWxzYXIgSGVscGVyJztcbiAgKi9cblxuICByZXR1cm4gYCR7YXRvbT8uYnJhbmRpbmc/Lm5hbWUgPz8gJ1B1bHNhcid9IEhlbHBlcmA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBdG9tSGVscGVyUGF0aCgpIHtcbiAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICdkYXJ3aW4nKSB7XG4gICAgY29uc3QgYXBwTmFtZSA9IGdldEF0b21BcHBOYW1lKCk7XG4gICAgcmV0dXJuIHBhdGgucmVzb2x2ZShwcm9jZXNzLnJlc291cmNlc1BhdGgsICcuLicsICdGcmFtZXdvcmtzJyxcbiAgICAgIGAke2FwcE5hbWV9LmFwcGAsICdDb250ZW50cycsICdNYWNPUycsIGFwcE5hbWUpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBwcm9jZXNzLmV4ZWNQYXRoO1xuICB9XG59XG5cbmxldCBEVUdJVEVfUEFUSDtcbmV4cG9ydCBmdW5jdGlvbiBnZXREdWdpdGVQYXRoKCkge1xuICBpZiAoIURVR0lURV9QQVRIKSB7XG4gICAgRFVHSVRFX1BBVEggPSByZXF1aXJlLnJlc29sdmUoJ2R1Z2l0ZScpO1xuICAgIGlmICghcGF0aC5pc0Fic29sdXRlKERVR0lURV9QQVRIKSkge1xuICAgICAgLy8gQXNzdW1lIHdlJ3JlIHNuYXBzaG90dGVkXG4gICAgICBjb25zdCB7cmVzb3VyY2VQYXRofSA9IGF0b20uZ2V0TG9hZFNldHRpbmdzKCk7XG4gICAgICBpZiAocGF0aC5leHRuYW1lKHJlc291cmNlUGF0aCkgPT09ICcuYXNhcicpIHtcbiAgICAgICAgRFVHSVRFX1BBVEggPSBwYXRoLmpvaW4oYCR7cmVzb3VyY2VQYXRofS51bnBhY2tlZGAsICdub2RlX21vZHVsZXMnLCAnZHVnaXRlJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEVUdJVEVfUEFUSCA9IHBhdGguam9pbihyZXNvdXJjZVBhdGgsICdub2RlX21vZHVsZXMnLCAnZHVnaXRlJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIERVR0lURV9QQVRIO1xufVxuXG5jb25zdCBTSEFSRURfTU9EVUxFX1BBVEhTID0gbmV3IE1hcCgpO1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNoYXJlZE1vZHVsZVBhdGgocmVsUGF0aCkge1xuICBsZXQgbW9kdWxlUGF0aCA9IFNIQVJFRF9NT0RVTEVfUEFUSFMuZ2V0KHJlbFBhdGgpO1xuICBpZiAoIW1vZHVsZVBhdGgpIHtcbiAgICBtb2R1bGVQYXRoID0gcmVxdWlyZS5yZXNvbHZlKHBhdGguam9pbihfX2Rpcm5hbWUsICdzaGFyZWQnLCByZWxQYXRoKSk7XG4gICAgaWYgKCFwYXRoLmlzQWJzb2x1dGUobW9kdWxlUGF0aCkpIHtcbiAgICAgIC8vIEFzc3VtZSB3ZSdyZSBzbmFwc2hvdHRlZFxuICAgICAgY29uc3Qge3Jlc291cmNlUGF0aH0gPSBhdG9tLmdldExvYWRTZXR0aW5ncygpO1xuICAgICAgbW9kdWxlUGF0aCA9IHBhdGguam9pbihyZXNvdXJjZVBhdGgsIG1vZHVsZVBhdGgpO1xuICAgIH1cblxuICAgIFNIQVJFRF9NT0RVTEVfUEFUSFMuc2V0KHJlbFBhdGgsIG1vZHVsZVBhdGgpO1xuICB9XG5cbiAgcmV0dXJuIG1vZHVsZVBhdGg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0JpbmFyeShkYXRhKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgNTA7IGkrKykge1xuICAgIGNvbnN0IGNvZGUgPSBkYXRhLmNoYXJDb2RlQXQoaSk7XG4gICAgLy8gQ2hhciBjb2RlIDY1NTMzIGlzIHRoZSBcInJlcGxhY2VtZW50IGNoYXJhY3RlclwiO1xuICAgIC8vIDggYW5kIGJlbG93IGFyZSBjb250cm9sIGNoYXJhY3RlcnMuXG4gICAgaWYgKGNvZGUgPT09IDY1NTMzIHx8IGNvZGUgPCA5KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGRlc2NyaXB0b3JzRnJvbVByb3RvKHByb3RvKSB7XG4gIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhwcm90bykucmVkdWNlKChhY2MsIG5hbWUpID0+IHtcbiAgICBPYmplY3QuYXNzaWduKGFjYywge1xuICAgICAgW25hbWVdOiBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90bywgbmFtZSksXG4gICAgfSk7XG4gICAgcmV0dXJuIGFjYztcbiAgfSwge30pO1xufVxuXG4vKipcbiAqIFRha2VzIGFuIGFycmF5IG9mIHRhcmdldHMgYW5kIHJldHVybnMgYSBwcm94eS4gVGhlIHByb3h5IGludGVyY2VwdHMgcHJvcGVydHkgYWNjZXNzb3IgY2FsbHMgYW5kXG4gKiByZXR1cm5zIHRoZSB2YWx1ZSBvZiB0aGF0IHByb3BlcnR5IG9uIHRoZSBmaXJzdCBvYmplY3QgaW4gYHRhcmdldHNgIHdoZXJlIHRoZSB0YXJnZXQgaW1wbGVtZW50cyB0aGF0IHByb3BlcnR5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmlyc3RJbXBsZW1lbnRlciguLi50YXJnZXRzKSB7XG4gIHJldHVybiBuZXcgUHJveHkoe19faW1wbGVtZW50YXRpb25zOiB0YXJnZXRzfSwge1xuICAgIGdldCh0YXJnZXQsIG5hbWUpIHtcbiAgICAgIGlmIChuYW1lID09PSAnZ2V0SW1wbGVtZW50ZXJzJykge1xuICAgICAgICByZXR1cm4gKCkgPT4gdGFyZ2V0cztcbiAgICAgIH1cblxuICAgICAgaWYgKFJlZmxlY3QuaGFzKHRhcmdldCwgbmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIHRhcmdldFtuYW1lXTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmlyc3RWYWxpZFRhcmdldCA9IHRhcmdldHMuZmluZCh0ID0+IFJlZmxlY3QuaGFzKHQsIG5hbWUpKTtcbiAgICAgIGlmIChmaXJzdFZhbGlkVGFyZ2V0KSB7XG4gICAgICAgIHJldHVybiBmaXJzdFZhbGlkVGFyZ2V0W25hbWVdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcbiAgICAgIGNvbnN0IGZpcnN0VmFsaWRUYXJnZXQgPSB0YXJnZXRzLmZpbmQodCA9PiBSZWZsZWN0Lmhhcyh0LCBuYW1lKSk7XG4gICAgICBpZiAoZmlyc3RWYWxpZFRhcmdldCkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmV0dXJuLWFzc2lnblxuICAgICAgICByZXR1cm4gZmlyc3RWYWxpZFRhcmdldFtuYW1lXSA9IHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJldHVybi1hc3NpZ25cbiAgICAgICAgcmV0dXJuIHRhcmdldFtuYW1lXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBVc2VkIGJ5IHNpbm9uXG4gICAgaGFzKHRhcmdldCwgbmFtZSkge1xuICAgICAgaWYgKG5hbWUgPT09ICdnZXRJbXBsZW1lbnRlcnMnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGFyZ2V0cy5zb21lKHQgPT4gUmVmbGVjdC5oYXModCwgbmFtZSkpO1xuICAgIH0sXG5cbiAgICAvLyBVc2VkIGJ5IHNpbm9uXG4gICAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgbmFtZSkge1xuICAgICAgY29uc3QgZmlyc3RWYWxpZFRhcmdldCA9IHRhcmdldHMuZmluZCh0ID0+IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQsIG5hbWUpKTtcbiAgICAgIGNvbnN0IGNvbXBvc2l0ZU93blByb3BlcnR5RGVzY3JpcHRvciA9IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgbmFtZSk7XG4gICAgICBpZiAoZmlyc3RWYWxpZFRhcmdldCkge1xuICAgICAgICByZXR1cm4gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoZmlyc3RWYWxpZFRhcmdldCwgbmFtZSk7XG4gICAgICB9IGVsc2UgaWYgKGNvbXBvc2l0ZU93blByb3BlcnR5RGVzY3JpcHRvcikge1xuICAgICAgICByZXR1cm4gY29tcG9zaXRlT3duUHJvcGVydHlEZXNjcmlwdG9yO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gVXNlZCBieSBzaW5vblxuICAgIGdldFByb3RvdHlwZU9mKHRhcmdldCkge1xuICAgICAgcmV0dXJuIHRhcmdldHMucmVkdWNlUmlnaHQoKGFjYywgdCkgPT4ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShhY2MsIGRlc2NyaXB0b3JzRnJvbVByb3RvKE9iamVjdC5nZXRQcm90b3R5cGVPZih0KSkpO1xuICAgICAgfSwgT2JqZWN0LnByb3RvdHlwZSk7XG4gICAgfSxcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGlzUm9vdChkaXIpIHtcbiAgcmV0dXJuIHBhdGgucmVzb2x2ZShkaXIsICcuLicpID09PSBkaXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkV29ya2RpcihkaXIpIHtcbiAgcmV0dXJuIGRpciAhPT0gb3MuaG9tZWRpcigpICYmICFpc1Jvb3QoZGlyKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZpbGVFeGlzdHMoYWJzb2x1dGVGaWxlUGF0aCkge1xuICB0cnkge1xuICAgIGF3YWl0IGZzLmFjY2VzcyhhYnNvbHV0ZUZpbGVQYXRoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChlLmNvZGUgPT09ICdFTk9FTlQnKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhyb3cgZTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGVtcERpcihvcHRpb25zID0ge30pIHtcbiAgdGVtcC50cmFjaygpO1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgdGVtcC5ta2RpcihvcHRpb25zLCAodGVtcEVycm9yLCBmb2xkZXIpID0+IHtcbiAgICAgIGlmICh0ZW1wRXJyb3IpIHtcbiAgICAgICAgcmVqZWN0KHRlbXBFcnJvcik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMuc3ltbGlua09rKSB7XG4gICAgICAgIHJlc29sdmUoZm9sZGVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnJlYWxwYXRoKGZvbGRlciwgKHJlYWxFcnJvciwgcnBhdGgpID0+IChyZWFsRXJyb3IgPyByZWplY3QocmVhbEVycm9yKSA6IHJlc29sdmUocnBhdGgpKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaXNGaWxlRXhlY3V0YWJsZShhYnNvbHV0ZUZpbGVQYXRoKSB7XG4gIGNvbnN0IHN0YXQgPSBhd2FpdCBmcy5zdGF0KGFic29sdXRlRmlsZVBhdGgpO1xuICByZXR1cm4gc3RhdC5tb2RlICYgZnMuY29uc3RhbnRzLlNfSVhVU1I7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tYml0d2lzZVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaXNGaWxlU3ltbGluayhhYnNvbHV0ZUZpbGVQYXRoKSB7XG4gIGNvbnN0IHN0YXQgPSBhd2FpdCBmcy5sc3RhdChhYnNvbHV0ZUZpbGVQYXRoKTtcbiAgcmV0dXJuIHN0YXQuaXNTeW1ib2xpY0xpbmsoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNob3J0ZW5TaGEoc2hhKSB7XG4gIHJldHVybiBzaGEuc2xpY2UoMCwgOCk7XG59XG5cbmV4cG9ydCBjb25zdCBjbGFzc05hbWVGb3JTdGF0dXMgPSB7XG4gIGFkZGVkOiAnYWRkZWQnLFxuICBkZWxldGVkOiAncmVtb3ZlZCcsXG4gIG1vZGlmaWVkOiAnbW9kaWZpZWQnLFxuICB0eXBlY2hhbmdlOiAnbW9kaWZpZWQnLFxuICBlcXVpdmFsZW50OiAnaWdub3JlZCcsXG59O1xuXG4vKlxuICogQXBwbHkgYW55IHBsYXRmb3JtLXNwZWNpZmljIG11bmdpbmcgdG8gYSBwYXRoIGJlZm9yZSBwcmVzZW50aW5nIGl0IGFzXG4gKiBhIGdpdCBlbnZpcm9ubWVudCB2YXJpYWJsZSBvciBvcHRpb24uXG4gKlxuICogQ29udmVydCBhIFdpbmRvd3Mtc3R5bGUgXCJDOlxcZm9vXFxiYXJcXGJhelwiIHBhdGggdG8gYSBcIi9jL2Zvby9iYXIvYmF6XCIgVU5JWC15XG4gKiBwYXRoIHRoYXQgdGhlIHNoLmV4ZSB1c2VkIHRvIGV4ZWN1dGUgZ2l0J3MgY3JlZGVudGlhbCBoZWxwZXJzIHdpbGxcbiAqIHVuZGVyc3RhbmQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVHaXRIZWxwZXJQYXRoKGluUGF0aCkge1xuICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJykge1xuICAgIHJldHVybiBpblBhdGgucmVwbGFjZSgvXFxcXC9nLCAnLycpLnJlcGxhY2UoL14oW146XSspOi8sICcvJDEnKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gaW5QYXRoO1xuICB9XG59XG5cbi8qXG4gKiBPbiBXaW5kb3dzLCBnaXQgY29tbWFuZHMgcmVwb3J0IHBhdGhzIHdpdGggLyBkZWxpbWl0ZXJzLiBDb252ZXJ0IHRoZW0gdG8gXFwtZGVsaW1pdGVkIHBhdGhzXG4gKiBzbyB0aGF0IEF0b20gdW5pZnJvbWx5IHRyZWF0cyBwYXRocyB3aXRoIG5hdGl2ZSBwYXRoIHNlcGFyYXRvcnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b05hdGl2ZVBhdGhTZXAocmF3UGF0aCkge1xuICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSAhPT0gJ3dpbjMyJykge1xuICAgIHJldHVybiByYXdQYXRoO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiByYXdQYXRoLnNwbGl0KCcvJykuam9pbihwYXRoLnNlcCk7XG4gIH1cbn1cblxuLypcbiAqIENvbnZlcnQgV2luZG93cyBwYXRocyBiYWNrIHRvIC8tZGVsaW1pdGVkIHBhdGhzIHRvIGJlIHByZXNlbnRlZCB0byBnaXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b0dpdFBhdGhTZXAocmF3UGF0aCkge1xuICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSAhPT0gJ3dpbjMyJykge1xuICAgIHJldHVybiByYXdQYXRoO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiByYXdQYXRoLnNwbGl0KHBhdGguc2VwKS5qb2luKCcvJyk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbGVQYXRoRW5kc1dpdGgoZmlsZVBhdGgsIC4uLnNlZ21lbnRzKSB7XG4gIHJldHVybiBmaWxlUGF0aC5lbmRzV2l0aChwYXRoLmpvaW4oLi4uc2VnbWVudHMpKTtcbn1cblxuLyoqXG4gKiBUdXJucyBhbiBhcnJheSBvZiB0aGluZ3MgQGt1eWNoYWNvIGNhbm5vdCBlYXRcbiAqIGludG8gYSBzZW50ZW5jZSBjb250YWluaW5nIHRoaW5ncyBAa3V5Y2hhY28gY2Fubm90IGVhdFxuICpcbiAqIFsndG9hc3QnXSA9PiAndG9hc3QnXG4gKiBbJ3RvYXN0JywgJ2VnZ3MnXSA9PiAndG9hc3QgYW5kIGVnZ3MnXG4gKiBbJ3RvYXN0JywgJ2VnZ3MnLCAnY2hlZXNlJ10gPT4gJ3RvYXN0LCBlZ2dzLCBhbmQgY2hlZXNlJ1xuICpcbiAqIE94Zm9yZCBjb21tYSBpbmNsdWRlZCBiZWNhdXNlIHlvdSdyZSB3cm9uZywgc2h1dCB1cC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvU2VudGVuY2UoYXJyYXkpIHtcbiAgY29uc3QgbGVuID0gYXJyYXkubGVuZ3RoO1xuICBpZiAobGVuID09PSAxKSB7XG4gICAgcmV0dXJuIGAke2FycmF5WzBdfWA7XG4gIH0gZWxzZSBpZiAobGVuID09PSAyKSB7XG4gICAgcmV0dXJuIGAke2FycmF5WzBdfSBhbmQgJHthcnJheVsxXX1gO1xuICB9XG5cbiAgcmV0dXJuIGFycmF5LnJlZHVjZSgoYWNjLCBpdGVtLCBpZHgpID0+IHtcbiAgICBpZiAoaWR4ID09PSAwKSB7XG4gICAgICByZXR1cm4gYCR7aXRlbX1gO1xuICAgIH0gZWxzZSBpZiAoaWR4ID09PSBsZW4gLSAxKSB7XG4gICAgICByZXR1cm4gYCR7YWNjfSwgYW5kICR7aXRlbX1gO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYCR7YWNjfSwgJHtpdGVtfWA7XG4gICAgfVxuICB9LCAnJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwdXNoQXRLZXkobWFwLCBrZXksIHZhbHVlKSB7XG4gIGxldCBleGlzdGluZyA9IG1hcC5nZXQoa2V5KTtcbiAgaWYgKCFleGlzdGluZykge1xuICAgIGV4aXN0aW5nID0gW107XG4gICAgbWFwLnNldChrZXksIGV4aXN0aW5nKTtcbiAgfVxuICBleGlzdGluZy5wdXNoKHZhbHVlKTtcbn1cblxuLy8gUmVwb3NpdG9yeSBhbmQgd29ya3NwYWNlIGhlbHBlcnNcblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbW1pdE1lc3NhZ2VQYXRoKHJlcG9zaXRvcnkpIHtcbiAgcmV0dXJuIHBhdGguam9pbihyZXBvc2l0b3J5LmdldEdpdERpcmVjdG9yeVBhdGgoKSwgJ0FUT01fQ09NTUlUX0VESVRNU0cnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbW1pdE1lc3NhZ2VFZGl0b3JzKHJlcG9zaXRvcnksIHdvcmtzcGFjZSkge1xuICBpZiAoIXJlcG9zaXRvcnkuaXNQcmVzZW50KCkpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgcmV0dXJuIHdvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpLmZpbHRlcihlZGl0b3IgPT4gZWRpdG9yLmdldFBhdGgoKSA9PT0gZ2V0Q29tbWl0TWVzc2FnZVBhdGgocmVwb3NpdG9yeSkpO1xufVxuXG5sZXQgQ2hhbmdlZEZpbGVJdGVtID0gbnVsbDtcbmV4cG9ydCBmdW5jdGlvbiBnZXRGaWxlUGF0Y2hQYW5lSXRlbXMoe29ubHlTdGFnZWQsIGVtcHR5fSA9IHt9LCB3b3Jrc3BhY2UpIHtcbiAgaWYgKENoYW5nZWRGaWxlSXRlbSA9PT0gbnVsbCkge1xuICAgIENoYW5nZWRGaWxlSXRlbSA9IHJlcXVpcmUoJy4vaXRlbXMvY2hhbmdlZC1maWxlLWl0ZW0nKS5kZWZhdWx0O1xuICB9XG5cbiAgcmV0dXJuIHdvcmtzcGFjZS5nZXRQYW5lSXRlbXMoKS5maWx0ZXIoaXRlbSA9PiB7XG4gICAgY29uc3QgaXNGaWxlUGF0Y2hJdGVtID0gaXRlbSAmJiBpdGVtLmdldFJlYWxJdGVtICYmIGl0ZW0uZ2V0UmVhbEl0ZW0oKSBpbnN0YW5jZW9mIENoYW5nZWRGaWxlSXRlbTtcbiAgICBpZiAob25seVN0YWdlZCkge1xuICAgICAgcmV0dXJuIGlzRmlsZVBhdGNoSXRlbSAmJiBpdGVtLnN0YWdpbmdTdGF0dXMgPT09ICdzdGFnZWQnO1xuICAgIH0gZWxzZSBpZiAoZW1wdHkpIHtcbiAgICAgIHJldHVybiBpc0ZpbGVQYXRjaEl0ZW0gPyBpdGVtLmlzRW1wdHkoKSA6IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gaXNGaWxlUGF0Y2hJdGVtO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXN0cm95RmlsZVBhdGNoUGFuZUl0ZW1zKHtvbmx5U3RhZ2VkfSA9IHt9LCB3b3Jrc3BhY2UpIHtcbiAgY29uc3QgaXRlbXNUb0Rlc3Ryb3kgPSBnZXRGaWxlUGF0Y2hQYW5lSXRlbXMoe29ubHlTdGFnZWR9LCB3b3Jrc3BhY2UpO1xuICBpdGVtc1RvRGVzdHJveS5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5kZXN0cm95KCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVzdHJveUVtcHR5RmlsZVBhdGNoUGFuZUl0ZW1zKHdvcmtzcGFjZSkge1xuICBjb25zdCBpdGVtc1RvRGVzdHJveSA9IGdldEZpbGVQYXRjaFBhbmVJdGVtcyh7ZW1wdHk6IHRydWV9LCB3b3Jrc3BhY2UpO1xuICBpdGVtc1RvRGVzdHJveS5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5kZXN0cm95KCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdENvQXV0aG9yc0FuZFJhd0NvbW1pdE1lc3NhZ2UoY29tbWl0TWVzc2FnZSkge1xuICBjb25zdCBtZXNzYWdlTGluZXMgPSBbXTtcbiAgY29uc3QgY29BdXRob3JzID0gW107XG5cbiAgZm9yIChjb25zdCBsaW5lIG9mIGNvbW1pdE1lc3NhZ2Uuc3BsaXQoTElORV9FTkRJTkdfUkVHRVgpKSB7XG4gICAgY29uc3QgbWF0Y2ggPSBsaW5lLm1hdGNoKENPX0FVVEhPUl9SRUdFWCk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgIGNvbnN0IFtfLCBuYW1lLCBlbWFpbF0gPSBtYXRjaDtcbiAgICAgIGNvQXV0aG9ycy5wdXNoKG5ldyBBdXRob3IoZW1haWwsIG5hbWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWVzc2FnZUxpbmVzLnB1c2gobGluZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHttZXNzYWdlOiBtZXNzYWdlTGluZXMuam9pbignXFxuJyksIGNvQXV0aG9yc307XG59XG5cbi8vIEF0b20gQVBJIHBhbmUgaXRlbSBtYW5pcHVsYXRpb25cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUl0ZW0obm9kZSwgY29tcG9uZW50SG9sZGVyID0gbnVsbCwgdXJpID0gbnVsbCwgZXh0cmEgPSB7fSkge1xuICBjb25zdCBob2xkZXIgPSBjb21wb25lbnRIb2xkZXIgfHwgbmV3IFJlZkhvbGRlcigpO1xuXG4gIGNvbnN0IG92ZXJyaWRlID0ge1xuICAgIGdldEVsZW1lbnQ6ICgpID0+IG5vZGUsXG5cbiAgICBnZXRSZWFsSXRlbTogKCkgPT4gaG9sZGVyLmdldE9yKG51bGwpLFxuXG4gICAgZ2V0UmVhbEl0ZW1Qcm9taXNlOiAoKSA9PiBob2xkZXIuZ2V0UHJvbWlzZSgpLFxuXG4gICAgLi4uZXh0cmEsXG4gIH07XG5cbiAgaWYgKHVyaSkge1xuICAgIG92ZXJyaWRlLmdldFVSSSA9ICgpID0+IHVyaTtcbiAgfVxuXG4gIGlmIChjb21wb25lbnRIb2xkZXIpIHtcbiAgICByZXR1cm4gbmV3IFByb3h5KG92ZXJyaWRlLCB7XG4gICAgICBnZXQodGFyZ2V0LCBuYW1lKSB7XG4gICAgICAgIGlmIChSZWZsZWN0Lmhhcyh0YXJnZXQsIG5hbWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHRhcmdldFtuYW1lXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZSB7dmFsdWU6IC4uLn0gd3JhcHBlciBwcmV2ZW50cyAubWFwKCkgZnJvbSBmbGF0dGVuaW5nIGEgcmV0dXJuZWQgUmVmSG9sZGVyLlxuICAgICAgICAvLyBJZiBjb21wb25lbnRbbmFtZV0gaXMgYSBSZWZIb2xkZXIsIHdlIHdhbnQgdG8gcmV0dXJuIHRoYXQgUmVmSG9sZGVyIGFzLWlzLlxuICAgICAgICBjb25zdCB7dmFsdWV9ID0gaG9sZGVyLm1hcChjb21wb25lbnQgPT4gKHt2YWx1ZTogY29tcG9uZW50W25hbWVdfSkpLmdldE9yKHt2YWx1ZTogdW5kZWZpbmVkfSk7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH0sXG5cbiAgICAgIHNldCh0YXJnZXQsIG5hbWUsIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBob2xkZXIubWFwKGNvbXBvbmVudCA9PiB7XG4gICAgICAgICAgY29tcG9uZW50W25hbWVdID0gdmFsdWU7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pLmdldE9yKHRydWUpO1xuICAgICAgfSxcblxuICAgICAgaGFzKHRhcmdldCwgbmFtZSkge1xuICAgICAgICByZXR1cm4gaG9sZGVyLm1hcChjb21wb25lbnQgPT4gUmVmbGVjdC5oYXMoY29tcG9uZW50LCBuYW1lKSkuZ2V0T3IoZmFsc2UpIHx8IFJlZmxlY3QuaGFzKHRhcmdldCwgbmFtZSk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBvdmVycmlkZTtcbiAgfVxufVxuXG4vLyBTZXQgZnVuY3Rpb25zXG5cbmV4cG9ydCBmdW5jdGlvbiBlcXVhbFNldHMobGVmdCwgcmlnaHQpIHtcbiAgaWYgKGxlZnQuc2l6ZSAhPT0gcmlnaHQuc2l6ZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZvciAoY29uc3QgZWFjaCBvZiBsZWZ0KSB7XG4gICAgaWYgKCFyaWdodC5oYXMoZWFjaCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gQ29uc3RhbnRzXG5cbmV4cG9ydCBjb25zdCBOQlNQX0NIQVJBQ1RFUiA9ICdcXHUwMGEwJztcblxuZXhwb3J0IGZ1bmN0aW9uIGJsYW5rTGFiZWwoKSB7XG4gIHJldHVybiBOQlNQX0NIQVJBQ1RFUjtcbn1cblxuZXhwb3J0IGNvbnN0IHJlYWN0aW9uVHlwZVRvRW1vamkgPSB7XG4gIFRIVU1CU19VUDogJ/CfkY0nLFxuICBUSFVNQlNfRE9XTjogJ/CfkY4nLFxuICBMQVVHSDogJ/CfmIYnLFxuICBIT09SQVk6ICfwn46JJyxcbiAgQ09ORlVTRUQ6ICfwn5iVJyxcbiAgSEVBUlQ6ICfinaTvuI8nLFxuICBST0NLRVQ6ICfwn5qAJyxcbiAgRVlFUzogJ/CfkYAnLFxufTtcblxuLy8gTWFya2Rvd25cblxubGV0IG1hcmtlZCA9IG51bGw7XG5sZXQgZG9tUHVyaWZ5ID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlck1hcmtkb3duKG1kKSB7XG4gIGlmIChtYXJrZWQgPT09IG51bGwpIHtcbiAgICBtYXJrZWQgPSByZXF1aXJlKCdtYXJrZWQnKTtcblxuICAgIGlmIChkb21QdXJpZnkgPT09IG51bGwpIHtcbiAgICAgIGNvbnN0IGNyZWF0ZURPTVB1cmlmeSA9IHJlcXVpcmUoJ2RvbXB1cmlmeScpO1xuICAgICAgZG9tUHVyaWZ5ID0gY3JlYXRlRE9NUHVyaWZ5KCk7XG4gICAgfVxuXG4gICAgbWFya2VkLnNldE9wdGlvbnMoe1xuICAgICAgc2lsZW50OiB0cnVlLFxuICAgICAgc2FuaXRpemU6IHRydWUsXG4gICAgICBzYW5pdGl6ZXI6IGh0bWwgPT4gZG9tUHVyaWZ5LnNhbml0aXplKGh0bWwpLFxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIG1hcmtlZChtZCk7XG59XG5cbmV4cG9ydCBjb25zdCBHSE9TVF9VU0VSID0ge1xuICBsb2dpbjogJ2dob3N0JyxcbiAgYXZhdGFyVXJsOiAnaHR0cHM6Ly9hdmF0YXJzMS5naXRodWJ1c2VyY29udGVudC5jb20vdS8xMDEzNz92PTQnLFxuICB1cmw6ICdodHRwczovL2dpdGh1Yi5jb20vZ2hvc3QnLFxufTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUFxQztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFFOUIsTUFBTUEsaUJBQWlCLEdBQUcsT0FBTztBQUFDO0FBQ2xDLE1BQU1DLGVBQWUsR0FBRyxrQ0FBa0M7QUFBQztBQUMzRCxNQUFNQyxTQUFTLEdBQUcsRUFBRTtBQUFDO0FBQ3JCLE1BQU1DLHVCQUF1QixHQUFHLEdBQUc7QUFBQztBQUNwQyxNQUFNQyxxQkFBcUIsR0FBRyxFQUFFO0FBQUM7QUFDakMsTUFBTUMsbUJBQW1CLEdBQUcsRUFBRTtBQUFDO0FBRS9CLFNBQVNDLFFBQVEsQ0FBQ0MsSUFBSSxFQUFFLEdBQUdDLE9BQU8sRUFBRTtFQUN6QyxLQUFLLE1BQU1DLE1BQU0sSUFBSUQsT0FBTyxFQUFFO0lBQzVCLElBQUksT0FB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