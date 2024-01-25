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
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcGF0aCIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX2ZzRXh0cmEiLCJfb3MiLCJfdGVtcCIsIl9yZWZIb2xkZXIiLCJfYXV0aG9yIiwib2JqIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJvd25LZXlzIiwiZSIsInIiLCJ0IiwiT2JqZWN0Iiwia2V5cyIsImdldE93blByb3BlcnR5U3ltYm9scyIsIm8iLCJmaWx0ZXIiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJlbnVtZXJhYmxlIiwicHVzaCIsImFwcGx5IiwiX29iamVjdFNwcmVhZCIsImFyZ3VtZW50cyIsImxlbmd0aCIsImZvckVhY2giLCJfZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzIiwiZGVmaW5lUHJvcGVydGllcyIsImRlZmluZVByb3BlcnR5Iiwia2V5IiwidmFsdWUiLCJfdG9Qcm9wZXJ0eUtleSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiaSIsIl90b1ByaW1pdGl2ZSIsIlN0cmluZyIsIlN5bWJvbCIsInRvUHJpbWl0aXZlIiwiY2FsbCIsIlR5cGVFcnJvciIsIk51bWJlciIsIkxJTkVfRU5ESU5HX1JFR0VYIiwiZXhwb3J0cyIsIkNPX0FVVEhPUl9SRUdFWCIsIlBBR0VfU0laRSIsIlBBR0lOQVRJT05fV0FJVF9USU1FX01TIiwiQ0hFQ0tfU1VJVEVfUEFHRV9TSVpFIiwiQ0hFQ0tfUlVOX1BBR0VfU0laRSIsImF1dG9iaW5kIiwic2VsZiIsIm1ldGhvZHMiLCJtZXRob2QiLCJFcnJvciIsImJpbmQiLCJleHRyYWN0UHJvcHMiLCJwcm9wcyIsInByb3BUeXBlcyIsIm5hbWVNYXAiLCJyZWR1Y2UiLCJvcHRzIiwicHJvcE5hbWUiLCJ1bmRlZmluZWQiLCJkZXN0UHJvcE5hbWUiLCJ1bnVzZWRQcm9wcyIsImdldFBhY2thZ2VSb290IiwicmVzb3VyY2VQYXRoIiwiYXRvbSIsImdldExvYWRTZXR0aW5ncyIsImN1cnJlbnRGaWxlV2FzUmVxdWlyZWRGcm9tU25hcHNob3QiLCJwYXRoIiwiaXNBYnNvbHV0ZSIsIl9fZGlybmFtZSIsImpvaW4iLCJwYWNrYWdlUm9vdCIsInJlc29sdmUiLCJleHRuYW1lIiwiaW5kZXhPZiIsImdldEF0b21BcHBOYW1lIiwiYnJhbmRpbmciLCJuYW1lIiwiZ2V0QXRvbUhlbHBlclBhdGgiLCJwcm9jZXNzIiwicGxhdGZvcm0iLCJhcHBOYW1lIiwicmVzb3VyY2VzUGF0aCIsImV4ZWNQYXRoIiwiRFVHSVRFX1BBVEgiLCJnZXREdWdpdGVQYXRoIiwiU0hBUkVEX01PRFVMRV9QQVRIUyIsIk1hcCIsImdldFNoYXJlZE1vZHVsZVBhdGgiLCJyZWxQYXRoIiwibW9kdWxlUGF0aCIsImdldCIsInNldCIsImlzQmluYXJ5IiwiZGF0YSIsImNvZGUiLCJjaGFyQ29kZUF0IiwiZGVzY3JpcHRvcnNGcm9tUHJvdG8iLCJwcm90byIsImdldE93blByb3BlcnR5TmFtZXMiLCJhY2MiLCJhc3NpZ24iLCJSZWZsZWN0IiwiZmlyc3RJbXBsZW1lbnRlciIsInRhcmdldHMiLCJQcm94eSIsIl9faW1wbGVtZW50YXRpb25zIiwidGFyZ2V0IiwiaGFzIiwiZmlyc3RWYWxpZFRhcmdldCIsImZpbmQiLCJzb21lIiwiY29tcG9zaXRlT3duUHJvcGVydHlEZXNjcmlwdG9yIiwiZ2V0UHJvdG90eXBlT2YiLCJyZWR1Y2VSaWdodCIsImNyZWF0ZSIsInByb3RvdHlwZSIsImlzUm9vdCIsImRpciIsImlzVmFsaWRXb3JrZGlyIiwib3MiLCJob21lZGlyIiwiZmlsZUV4aXN0cyIsImFic29sdXRlRmlsZVBhdGgiLCJmcyIsImFjY2VzcyIsImdldFRlbXBEaXIiLCJvcHRpb25zIiwidGVtcCIsInRyYWNrIiwiUHJvbWlzZSIsInJlamVjdCIsIm1rZGlyIiwidGVtcEVycm9yIiwiZm9sZGVyIiwic3ltbGlua09rIiwicmVhbHBhdGgiLCJyZWFsRXJyb3IiLCJycGF0aCIsImlzRmlsZUV4ZWN1dGFibGUiLCJzdGF0IiwibW9kZSIsImNvbnN0YW50cyIsIlNfSVhVU1IiLCJpc0ZpbGVTeW1saW5rIiwibHN0YXQiLCJpc1N5bWJvbGljTGluayIsInNob3J0ZW5TaGEiLCJzaGEiLCJzbGljZSIsImNsYXNzTmFtZUZvclN0YXR1cyIsImFkZGVkIiwiZGVsZXRlZCIsIm1vZGlmaWVkIiwidHlwZWNoYW5nZSIsImVxdWl2YWxlbnQiLCJub3JtYWxpemVHaXRIZWxwZXJQYXRoIiwiaW5QYXRoIiwicmVwbGFjZSIsInRvTmF0aXZlUGF0aFNlcCIsInJhd1BhdGgiLCJzcGxpdCIsInNlcCIsInRvR2l0UGF0aFNlcCIsImZpbGVQYXRoRW5kc1dpdGgiLCJmaWxlUGF0aCIsInNlZ21lbnRzIiwiZW5kc1dpdGgiLCJ0b1NlbnRlbmNlIiwiYXJyYXkiLCJsZW4iLCJpdGVtIiwiaWR4IiwicHVzaEF0S2V5IiwibWFwIiwiZXhpc3RpbmciLCJnZXRDb21taXRNZXNzYWdlUGF0aCIsInJlcG9zaXRvcnkiLCJnZXRHaXREaXJlY3RvcnlQYXRoIiwiZ2V0Q29tbWl0TWVzc2FnZUVkaXRvcnMiLCJ3b3Jrc3BhY2UiLCJpc1ByZXNlbnQiLCJnZXRUZXh0RWRpdG9ycyIsImVkaXRvciIsImdldFBhdGgiLCJDaGFuZ2VkRmlsZUl0ZW0iLCJnZXRGaWxlUGF0Y2hQYW5lSXRlbXMiLCJvbmx5U3RhZ2VkIiwiZW1wdHkiLCJnZXRQYW5lSXRlbXMiLCJpc0ZpbGVQYXRjaEl0ZW0iLCJnZXRSZWFsSXRlbSIsInN0YWdpbmdTdGF0dXMiLCJpc0VtcHR5IiwiZGVzdHJveUZpbGVQYXRjaFBhbmVJdGVtcyIsIml0ZW1zVG9EZXN0cm95IiwiZGVzdHJveSIsImRlc3Ryb3lFbXB0eUZpbGVQYXRjaFBhbmVJdGVtcyIsImV4dHJhY3RDb0F1dGhvcnNBbmRSYXdDb21taXRNZXNzYWdlIiwiY29tbWl0TWVzc2FnZSIsIm1lc3NhZ2VMaW5lcyIsImNvQXV0aG9ycyIsImxpbmUiLCJtYXRjaCIsIl8iLCJlbWFpbCIsIkF1dGhvciIsIm1lc3NhZ2UiLCJjcmVhdGVJdGVtIiwibm9kZSIsImNvbXBvbmVudEhvbGRlciIsInVyaSIsImV4dHJhIiwiaG9sZGVyIiwiUmVmSG9sZGVyIiwib3ZlcnJpZGUiLCJnZXRFbGVtZW50IiwiZ2V0T3IiLCJnZXRSZWFsSXRlbVByb21pc2UiLCJnZXRQcm9taXNlIiwiZ2V0VVJJIiwiY29tcG9uZW50IiwiZXF1YWxTZXRzIiwibGVmdCIsInJpZ2h0Iiwic2l6ZSIsImVhY2giLCJOQlNQX0NIQVJBQ1RFUiIsImJsYW5rTGFiZWwiLCJyZWFjdGlvblR5cGVUb0Vtb2ppIiwiVEhVTUJTX1VQIiwiVEhVTUJTX0RPV04iLCJMQVVHSCIsIkhPT1JBWSIsIkNPTkZVU0VEIiwiSEVBUlQiLCJST0NLRVQiLCJFWUVTIiwibWFya2VkIiwiZG9tUHVyaWZ5IiwicmVuZGVyTWFya2Rvd24iLCJtZCIsImNyZWF0ZURPTVB1cmlmeSIsInNldE9wdGlvbnMiLCJzaWxlbnQiLCJzYW5pdGl6ZSIsInNhbml0aXplciIsImh0bWwiLCJHSE9TVF9VU0VSIiwibG9naW4iLCJhdmF0YXJVcmwiLCJ1cmwiXSwic291cmNlcyI6WyJoZWxwZXJzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCBvcyBmcm9tICdvcyc7XG5pbXBvcnQgdGVtcCBmcm9tICd0ZW1wJztcblxuaW1wb3J0IFJlZkhvbGRlciBmcm9tICcuL21vZGVscy9yZWYtaG9sZGVyJztcbmltcG9ydCBBdXRob3IgZnJvbSAnLi9tb2RlbHMvYXV0aG9yJztcblxuZXhwb3J0IGNvbnN0IExJTkVfRU5ESU5HX1JFR0VYID0gL1xccj9cXG4vO1xuZXhwb3J0IGNvbnN0IENPX0FVVEhPUl9SRUdFWCA9IC9eY28tYXV0aG9yZWQtYnkuICguKz8pIDwoLis/KT4kL2k7XG5leHBvcnQgY29uc3QgUEFHRV9TSVpFID0gNTA7XG5leHBvcnQgY29uc3QgUEFHSU5BVElPTl9XQUlUX1RJTUVfTVMgPSAxMDA7XG5leHBvcnQgY29uc3QgQ0hFQ0tfU1VJVEVfUEFHRV9TSVpFID0gMTA7XG5leHBvcnQgY29uc3QgQ0hFQ0tfUlVOX1BBR0VfU0laRSA9IDIwO1xuXG5leHBvcnQgZnVuY3Rpb24gYXV0b2JpbmQoc2VsZiwgLi4ubWV0aG9kcykge1xuICBmb3IgKGNvbnN0IG1ldGhvZCBvZiBtZXRob2RzKSB7XG4gICAgaWYgKHR5cGVvZiBzZWxmW21ldGhvZF0gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGF1dG9iaW5kIG1ldGhvZCAke21ldGhvZH1gKTtcbiAgICB9XG4gICAgc2VsZlttZXRob2RdID0gc2VsZlttZXRob2RdLmJpbmQoc2VsZik7XG4gIH1cbn1cblxuLy8gRXh0cmFjdCBhIHN1YnNldCBvZiBwcm9wcyBjaG9zZW4gZnJvbSBhIHByb3BUeXBlcyBvYmplY3QgZnJvbSBhIGNvbXBvbmVudCdzIHByb3BzIHRvIHBhc3MgdG8gYSBkaWZmZXJlbnQgQVBJLlxuLy9cbi8vIFVzYWdlOlxuLy9cbi8vIGBgYGpzXG4vLyBjb25zdCBhcGlQcm9wcyA9IHtcbi8vICAgemVybzogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuLy8gICBvbmU6IFByb3BUeXBlcy5zdHJpbmcsXG4vLyAgIHR3bzogUHJvcFR5cGVzLm9iamVjdCxcbi8vIH07XG4vL1xuLy8gY2xhc3MgQ29tcG9uZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbi8vICAgc3RhdGljIHByb3BUeXBlcyA9IHtcbi8vICAgICAuLi5hcGlQcm9wcyxcbi8vICAgICBleHRyYTogUHJvcFR5cGVzLmZ1bmMsXG4vLyAgIH1cbi8vXG4vLyAgIGFjdGlvbigpIHtcbi8vICAgICBjb25zdCBvcHRpb25zID0gZXh0cmFjdFByb3BzKHRoaXMucHJvcHMsIGFwaVByb3BzKTtcbi8vICAgICAvLyBvcHRpb25zIGNvbnRhaW5zIHplcm8sIG9uZSwgYW5kIHR3bywgYnV0IG5vdCBleHRyYVxuLy8gICB9XG4vLyB9XG4vLyBgYGBcbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0UHJvcHMocHJvcHMsIHByb3BUeXBlcywgbmFtZU1hcCA9IHt9KSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhwcm9wVHlwZXMpLnJlZHVjZSgob3B0cywgcHJvcE5hbWUpID0+IHtcbiAgICBpZiAocHJvcHNbcHJvcE5hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IGRlc3RQcm9wTmFtZSA9IG5hbWVNYXBbcHJvcE5hbWVdIHx8IHByb3BOYW1lO1xuICAgICAgb3B0c1tkZXN0UHJvcE5hbWVdID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgIH1cbiAgICByZXR1cm4gb3B0cztcbiAgfSwge30pO1xufVxuXG4vLyBUaGUgb3Bwb3NpdGUgb2YgZXh0cmFjdFByb3BzLiBSZXR1cm4gYSBzdWJzZXQgb2YgcHJvcHMgdGhhdCBkbyAqbm90KiBhcHBlYXIgaW4gYSBjb21wb25lbnQncyBwcm9wIHR5cGVzLlxuZXhwb3J0IGZ1bmN0aW9uIHVudXNlZFByb3BzKHByb3BzLCBwcm9wVHlwZXMpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHByb3BzKS5yZWR1Y2UoKG9wdHMsIHByb3BOYW1lKSA9PiB7XG4gICAgaWYgKHByb3BUeXBlc1twcm9wTmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgb3B0c1twcm9wTmFtZV0gPSBwcm9wc1twcm9wTmFtZV07XG4gICAgfVxuICAgIHJldHVybiBvcHRzO1xuICB9LCB7fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQYWNrYWdlUm9vdCgpIHtcbiAgY29uc3Qge3Jlc291cmNlUGF0aH0gPSBhdG9tLmdldExvYWRTZXR0aW5ncygpO1xuICBjb25zdCBjdXJyZW50RmlsZVdhc1JlcXVpcmVkRnJvbVNuYXBzaG90ID0gIXBhdGguaXNBYnNvbHV0ZShfX2Rpcm5hbWUpO1xuICBpZiAoY3VycmVudEZpbGVXYXNSZXF1aXJlZEZyb21TbmFwc2hvdCkge1xuICAgIHJldHVybiBwYXRoLmpvaW4ocmVzb3VyY2VQYXRoLCAnbm9kZV9tb2R1bGVzJywgJ2dpdGh1YicpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHBhY2thZ2VSb290ID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uJyk7XG4gICAgaWYgKHBhdGguZXh0bmFtZShyZXNvdXJjZVBhdGgpID09PSAnLmFzYXInKSB7XG4gICAgICBpZiAocGFja2FnZVJvb3QuaW5kZXhPZihyZXNvdXJjZVBhdGgpID09PSAwKSB7XG4gICAgICAgIHJldHVybiBwYXRoLmpvaW4oYCR7cmVzb3VyY2VQYXRofS51bnBhY2tlZGAsICdub2RlX21vZHVsZXMnLCAnZ2l0aHViJyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwYWNrYWdlUm9vdDtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRBdG9tQXBwTmFtZSgpIHtcbiAgLypcbiAgLy8gT2xkIEF0b20gbG9naWMgKHJlc3RvcmUgdGhpcyBpZiB3ZSBtYWtlIHJlbGVhc2UgY2hhbm5lbCBzcGVjaWZpYyBiaW5hcmllcylcbiAgY29uc3QgbWF0Y2ggPSBhdG9tLmdldFZlcnNpb24oKS5tYXRjaCgvLShbQS1aYS16XSspKFxcZCt8LSkvKTtcbiAgaWYgKG1hdGNoKSB7XG4gICAgY29uc3QgY2hhbm5lbCA9IG1hdGNoWzFdO1xuICAgIHJldHVybiBgUHVsc2FyICR7Y2hhbm5lbC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGNoYW5uZWwuc2xpY2UoMSl9IEhlbHBlcmA7XG4gIH1cblxuICByZXR1cm4gJ1B1bHNhciBIZWxwZXInO1xuICAqL1xuXG4gIHJldHVybiBgJHthdG9tPy5icmFuZGluZz8ubmFtZSA/PyAnUHVsc2FyJ30gSGVscGVyYDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEF0b21IZWxwZXJQYXRoKCkge1xuICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2RhcndpbicpIHtcbiAgICBjb25zdCBhcHBOYW1lID0gZ2V0QXRvbUFwcE5hbWUoKTtcbiAgICByZXR1cm4gcGF0aC5yZXNvbHZlKHByb2Nlc3MucmVzb3VyY2VzUGF0aCwgJy4uJywgJ0ZyYW1ld29ya3MnLFxuICAgICAgYCR7YXBwTmFtZX0uYXBwYCwgJ0NvbnRlbnRzJywgJ01hY09TJywgYXBwTmFtZSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHByb2Nlc3MuZXhlY1BhdGg7XG4gIH1cbn1cblxubGV0IERVR0lURV9QQVRIO1xuZXhwb3J0IGZ1bmN0aW9uIGdldER1Z2l0ZVBhdGgoKSB7XG4gIGlmICghRFVHSVRFX1BBVEgpIHtcbiAgICBEVUdJVEVfUEFUSCA9IHJlcXVpcmUucmVzb2x2ZSgnZHVnaXRlJyk7XG4gICAgaWYgKCFwYXRoLmlzQWJzb2x1dGUoRFVHSVRFX1BBVEgpKSB7XG4gICAgICAvLyBBc3N1bWUgd2UncmUgc25hcHNob3R0ZWRcbiAgICAgIGNvbnN0IHtyZXNvdXJjZVBhdGh9ID0gYXRvbS5nZXRMb2FkU2V0dGluZ3MoKTtcbiAgICAgIGlmIChwYXRoLmV4dG5hbWUocmVzb3VyY2VQYXRoKSA9PT0gJy5hc2FyJykge1xuICAgICAgICBEVUdJVEVfUEFUSCA9IHBhdGguam9pbihgJHtyZXNvdXJjZVBhdGh9LnVucGFja2VkYCwgJ25vZGVfbW9kdWxlcycsICdkdWdpdGUnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERVR0lURV9QQVRIID0gcGF0aC5qb2luKHJlc291cmNlUGF0aCwgJ25vZGVfbW9kdWxlcycsICdkdWdpdGUnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gRFVHSVRFX1BBVEg7XG59XG5cbmNvbnN0IFNIQVJFRF9NT0RVTEVfUEFUSFMgPSBuZXcgTWFwKCk7XG5leHBvcnQgZnVuY3Rpb24gZ2V0U2hhcmVkTW9kdWxlUGF0aChyZWxQYXRoKSB7XG4gIGxldCBtb2R1bGVQYXRoID0gU0hBUkVEX01PRFVMRV9QQVRIUy5nZXQocmVsUGF0aCk7XG4gIGlmICghbW9kdWxlUGF0aCkge1xuICAgIG1vZHVsZVBhdGggPSByZXF1aXJlLnJlc29sdmUocGF0aC5qb2luKF9fZGlybmFtZSwgJ3NoYXJlZCcsIHJlbFBhdGgpKTtcbiAgICBpZiAoIXBhdGguaXNBYnNvbHV0ZShtb2R1bGVQYXRoKSkge1xuICAgICAgLy8gQXNzdW1lIHdlJ3JlIHNuYXBzaG90dGVkXG4gICAgICBjb25zdCB7cmVzb3VyY2VQYXRofSA9IGF0b20uZ2V0TG9hZFNldHRpbmdzKCk7XG4gICAgICBtb2R1bGVQYXRoID0gcGF0aC5qb2luKHJlc291cmNlUGF0aCwgbW9kdWxlUGF0aCk7XG4gICAgfVxuXG4gICAgU0hBUkVEX01PRFVMRV9QQVRIUy5zZXQocmVsUGF0aCwgbW9kdWxlUGF0aCk7XG4gIH1cblxuICByZXR1cm4gbW9kdWxlUGF0aDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQmluYXJ5KGRhdGEpIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCA1MDsgaSsrKSB7XG4gICAgY29uc3QgY29kZSA9IGRhdGEuY2hhckNvZGVBdChpKTtcbiAgICAvLyBDaGFyIGNvZGUgNjU1MzMgaXMgdGhlIFwicmVwbGFjZW1lbnQgY2hhcmFjdGVyXCI7XG4gICAgLy8gOCBhbmQgYmVsb3cgYXJlIGNvbnRyb2wgY2hhcmFjdGVycy5cbiAgICBpZiAoY29kZSA9PT0gNjU1MzMgfHwgY29kZSA8IDkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gZGVzY3JpcHRvcnNGcm9tUHJvdG8ocHJvdG8pIHtcbiAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHByb3RvKS5yZWR1Y2UoKGFjYywgbmFtZSkgPT4ge1xuICAgIE9iamVjdC5hc3NpZ24oYWNjLCB7XG4gICAgICBbbmFtZV06IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvLCBuYW1lKSxcbiAgICB9KTtcbiAgICByZXR1cm4gYWNjO1xuICB9LCB7fSk7XG59XG5cbi8qKlxuICogVGFrZXMgYW4gYXJyYXkgb2YgdGFyZ2V0cyBhbmQgcmV0dXJucyBhIHByb3h5LiBUaGUgcHJveHkgaW50ZXJjZXB0cyBwcm9wZXJ0eSBhY2Nlc3NvciBjYWxscyBhbmRcbiAqIHJldHVybnMgdGhlIHZhbHVlIG9mIHRoYXQgcHJvcGVydHkgb24gdGhlIGZpcnN0IG9iamVjdCBpbiBgdGFyZ2V0c2Agd2hlcmUgdGhlIHRhcmdldCBpbXBsZW1lbnRzIHRoYXQgcHJvcGVydHkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaXJzdEltcGxlbWVudGVyKC4uLnRhcmdldHMpIHtcbiAgcmV0dXJuIG5ldyBQcm94eSh7X19pbXBsZW1lbnRhdGlvbnM6IHRhcmdldHN9LCB7XG4gICAgZ2V0KHRhcmdldCwgbmFtZSkge1xuICAgICAgaWYgKG5hbWUgPT09ICdnZXRJbXBsZW1lbnRlcnMnKSB7XG4gICAgICAgIHJldHVybiAoKSA9PiB0YXJnZXRzO1xuICAgICAgfVxuXG4gICAgICBpZiAoUmVmbGVjdC5oYXModGFyZ2V0LCBuYW1lKSkge1xuICAgICAgICByZXR1cm4gdGFyZ2V0W25hbWVdO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmaXJzdFZhbGlkVGFyZ2V0ID0gdGFyZ2V0cy5maW5kKHQgPT4gUmVmbGVjdC5oYXModCwgbmFtZSkpO1xuICAgICAgaWYgKGZpcnN0VmFsaWRUYXJnZXQpIHtcbiAgICAgICAgcmV0dXJuIGZpcnN0VmFsaWRUYXJnZXRbbmFtZV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBzZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSkge1xuICAgICAgY29uc3QgZmlyc3RWYWxpZFRhcmdldCA9IHRhcmdldHMuZmluZCh0ID0+IFJlZmxlY3QuaGFzKHQsIG5hbWUpKTtcbiAgICAgIGlmIChmaXJzdFZhbGlkVGFyZ2V0KSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXR1cm4tYXNzaWduXG4gICAgICAgIHJldHVybiBmaXJzdFZhbGlkVGFyZ2V0W25hbWVdID0gdmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmV0dXJuLWFzc2lnblxuICAgICAgICByZXR1cm4gdGFyZ2V0W25hbWVdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIFVzZWQgYnkgc2lub25cbiAgICBoYXModGFyZ2V0LCBuYW1lKSB7XG4gICAgICBpZiAobmFtZSA9PT0gJ2dldEltcGxlbWVudGVycycpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0YXJnZXRzLnNvbWUodCA9PiBSZWZsZWN0Lmhhcyh0LCBuYW1lKSk7XG4gICAgfSxcblxuICAgIC8vIFVzZWQgYnkgc2lub25cbiAgICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBuYW1lKSB7XG4gICAgICBjb25zdCBmaXJzdFZhbGlkVGFyZ2V0ID0gdGFyZ2V0cy5maW5kKHQgPT4gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodCwgbmFtZSkpO1xuICAgICAgY29uc3QgY29tcG9zaXRlT3duUHJvcGVydHlEZXNjcmlwdG9yID0gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBuYW1lKTtcbiAgICAgIGlmIChmaXJzdFZhbGlkVGFyZ2V0KSB7XG4gICAgICAgIHJldHVybiBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihmaXJzdFZhbGlkVGFyZ2V0LCBuYW1lKTtcbiAgICAgIH0gZWxzZSBpZiAoY29tcG9zaXRlT3duUHJvcGVydHlEZXNjcmlwdG9yKSB7XG4gICAgICAgIHJldHVybiBjb21wb3NpdGVPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBVc2VkIGJ5IHNpbm9uXG4gICAgZ2V0UHJvdG90eXBlT2YodGFyZ2V0KSB7XG4gICAgICByZXR1cm4gdGFyZ2V0cy5yZWR1Y2VSaWdodCgoYWNjLCB0KSA9PiB7XG4gICAgICAgIHJldHVybiBPYmplY3QuY3JlYXRlKGFjYywgZGVzY3JpcHRvcnNGcm9tUHJvdG8oT2JqZWN0LmdldFByb3RvdHlwZU9mKHQpKSk7XG4gICAgICB9LCBPYmplY3QucHJvdG90eXBlKTtcbiAgICB9LFxuICB9KTtcbn1cblxuZnVuY3Rpb24gaXNSb290KGRpcikge1xuICByZXR1cm4gcGF0aC5yZXNvbHZlKGRpciwgJy4uJykgPT09IGRpcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWRXb3JrZGlyKGRpcikge1xuICByZXR1cm4gZGlyICE9PSBvcy5ob21lZGlyKCkgJiYgIWlzUm9vdChkaXIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmlsZUV4aXN0cyhhYnNvbHV0ZUZpbGVQYXRoKSB7XG4gIHRyeSB7XG4gICAgYXdhaXQgZnMuYWNjZXNzKGFic29sdXRlRmlsZVBhdGgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9IGNhdGNoIChlKSB7XG4gICAgaWYgKGUuY29kZSA9PT0gJ0VOT0VOVCcpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0aHJvdyBlO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUZW1wRGlyKG9wdGlvbnMgPSB7fSkge1xuICB0ZW1wLnRyYWNrKCk7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB0ZW1wLm1rZGlyKG9wdGlvbnMsICh0ZW1wRXJyb3IsIGZvbGRlcikgPT4ge1xuICAgICAgaWYgKHRlbXBFcnJvcikge1xuICAgICAgICByZWplY3QodGVtcEVycm9yKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5zeW1saW5rT2spIHtcbiAgICAgICAgcmVzb2x2ZShmb2xkZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMucmVhbHBhdGgoZm9sZGVyLCAocmVhbEVycm9yLCBycGF0aCkgPT4gKHJlYWxFcnJvciA/IHJlamVjdChyZWFsRXJyb3IpIDogcmVzb2x2ZShycGF0aCkpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpc0ZpbGVFeGVjdXRhYmxlKGFic29sdXRlRmlsZVBhdGgpIHtcbiAgY29uc3Qgc3RhdCA9IGF3YWl0IGZzLnN0YXQoYWJzb2x1dGVGaWxlUGF0aCk7XG4gIHJldHVybiBzdGF0Lm1vZGUgJiBmcy5jb25zdGFudHMuU19JWFVTUjsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1iaXR3aXNlXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpc0ZpbGVTeW1saW5rKGFic29sdXRlRmlsZVBhdGgpIHtcbiAgY29uc3Qgc3RhdCA9IGF3YWl0IGZzLmxzdGF0KGFic29sdXRlRmlsZVBhdGgpO1xuICByZXR1cm4gc3RhdC5pc1N5bWJvbGljTGluaygpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2hvcnRlblNoYShzaGEpIHtcbiAgcmV0dXJuIHNoYS5zbGljZSgwLCA4KTtcbn1cblxuZXhwb3J0IGNvbnN0IGNsYXNzTmFtZUZvclN0YXR1cyA9IHtcbiAgYWRkZWQ6ICdhZGRlZCcsXG4gIGRlbGV0ZWQ6ICdyZW1vdmVkJyxcbiAgbW9kaWZpZWQ6ICdtb2RpZmllZCcsXG4gIHR5cGVjaGFuZ2U6ICdtb2RpZmllZCcsXG4gIGVxdWl2YWxlbnQ6ICdpZ25vcmVkJyxcbn07XG5cbi8qXG4gKiBBcHBseSBhbnkgcGxhdGZvcm0tc3BlY2lmaWMgbXVuZ2luZyB0byBhIHBhdGggYmVmb3JlIHByZXNlbnRpbmcgaXQgYXNcbiAqIGEgZ2l0IGVudmlyb25tZW50IHZhcmlhYmxlIG9yIG9wdGlvbi5cbiAqXG4gKiBDb252ZXJ0IGEgV2luZG93cy1zdHlsZSBcIkM6XFxmb29cXGJhclxcYmF6XCIgcGF0aCB0byBhIFwiL2MvZm9vL2Jhci9iYXpcIiBVTklYLXlcbiAqIHBhdGggdGhhdCB0aGUgc2guZXhlIHVzZWQgdG8gZXhlY3V0ZSBnaXQncyBjcmVkZW50aWFsIGhlbHBlcnMgd2lsbFxuICogdW5kZXJzdGFuZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUdpdEhlbHBlclBhdGgoaW5QYXRoKSB7XG4gIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG4gICAgcmV0dXJuIGluUGF0aC5yZXBsYWNlKC9cXFxcL2csICcvJykucmVwbGFjZSgvXihbXjpdKyk6LywgJy8kMScpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBpblBhdGg7XG4gIH1cbn1cblxuLypcbiAqIE9uIFdpbmRvd3MsIGdpdCBjb21tYW5kcyByZXBvcnQgcGF0aHMgd2l0aCAvIGRlbGltaXRlcnMuIENvbnZlcnQgdGhlbSB0byBcXC1kZWxpbWl0ZWQgcGF0aHNcbiAqIHNvIHRoYXQgQXRvbSB1bmlmcm9tbHkgdHJlYXRzIHBhdGhzIHdpdGggbmF0aXZlIHBhdGggc2VwYXJhdG9ycy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvTmF0aXZlUGF0aFNlcChyYXdQYXRoKSB7XG4gIGlmIChwcm9jZXNzLnBsYXRmb3JtICE9PSAnd2luMzInKSB7XG4gICAgcmV0dXJuIHJhd1BhdGg7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHJhd1BhdGguc3BsaXQoJy8nKS5qb2luKHBhdGguc2VwKTtcbiAgfVxufVxuXG4vKlxuICogQ29udmVydCBXaW5kb3dzIHBhdGhzIGJhY2sgdG8gLy1kZWxpbWl0ZWQgcGF0aHMgdG8gYmUgcHJlc2VudGVkIHRvIGdpdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvR2l0UGF0aFNlcChyYXdQYXRoKSB7XG4gIGlmIChwcm9jZXNzLnBsYXRmb3JtICE9PSAnd2luMzInKSB7XG4gICAgcmV0dXJuIHJhd1BhdGg7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHJhd1BhdGguc3BsaXQocGF0aC5zZXApLmpvaW4oJy8nKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlsZVBhdGhFbmRzV2l0aChmaWxlUGF0aCwgLi4uc2VnbWVudHMpIHtcbiAgcmV0dXJuIGZpbGVQYXRoLmVuZHNXaXRoKHBhdGguam9pbiguLi5zZWdtZW50cykpO1xufVxuXG4vKipcbiAqIFR1cm5zIGFuIGFycmF5IG9mIHRoaW5ncyBAa3V5Y2hhY28gY2Fubm90IGVhdFxuICogaW50byBhIHNlbnRlbmNlIGNvbnRhaW5pbmcgdGhpbmdzIEBrdXljaGFjbyBjYW5ub3QgZWF0XG4gKlxuICogWyd0b2FzdCddID0+ICd0b2FzdCdcbiAqIFsndG9hc3QnLCAnZWdncyddID0+ICd0b2FzdCBhbmQgZWdncydcbiAqIFsndG9hc3QnLCAnZWdncycsICdjaGVlc2UnXSA9PiAndG9hc3QsIGVnZ3MsIGFuZCBjaGVlc2UnXG4gKlxuICogT3hmb3JkIGNvbW1hIGluY2x1ZGVkIGJlY2F1c2UgeW91J3JlIHdyb25nLCBzaHV0IHVwLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9TZW50ZW5jZShhcnJheSkge1xuICBjb25zdCBsZW4gPSBhcnJheS5sZW5ndGg7XG4gIGlmIChsZW4gPT09IDEpIHtcbiAgICByZXR1cm4gYCR7YXJyYXlbMF19YDtcbiAgfSBlbHNlIGlmIChsZW4gPT09IDIpIHtcbiAgICByZXR1cm4gYCR7YXJyYXlbMF19IGFuZCAke2FycmF5WzFdfWA7XG4gIH1cblxuICByZXR1cm4gYXJyYXkucmVkdWNlKChhY2MsIGl0ZW0sIGlkeCkgPT4ge1xuICAgIGlmIChpZHggPT09IDApIHtcbiAgICAgIHJldHVybiBgJHtpdGVtfWA7XG4gICAgfSBlbHNlIGlmIChpZHggPT09IGxlbiAtIDEpIHtcbiAgICAgIHJldHVybiBgJHthY2N9LCBhbmQgJHtpdGVtfWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBgJHthY2N9LCAke2l0ZW19YDtcbiAgICB9XG4gIH0sICcnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHB1c2hBdEtleShtYXAsIGtleSwgdmFsdWUpIHtcbiAgbGV0IGV4aXN0aW5nID0gbWFwLmdldChrZXkpO1xuICBpZiAoIWV4aXN0aW5nKSB7XG4gICAgZXhpc3RpbmcgPSBbXTtcbiAgICBtYXAuc2V0KGtleSwgZXhpc3RpbmcpO1xuICB9XG4gIGV4aXN0aW5nLnB1c2godmFsdWUpO1xufVxuXG4vLyBSZXBvc2l0b3J5IGFuZCB3b3Jrc3BhY2UgaGVscGVyc1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29tbWl0TWVzc2FnZVBhdGgocmVwb3NpdG9yeSkge1xuICByZXR1cm4gcGF0aC5qb2luKHJlcG9zaXRvcnkuZ2V0R2l0RGlyZWN0b3J5UGF0aCgpLCAnQVRPTV9DT01NSVRfRURJVE1TRycpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29tbWl0TWVzc2FnZUVkaXRvcnMocmVwb3NpdG9yeSwgd29ya3NwYWNlKSB7XG4gIGlmICghcmVwb3NpdG9yeS5pc1ByZXNlbnQoKSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICByZXR1cm4gd29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCkuZmlsdGVyKGVkaXRvciA9PiBlZGl0b3IuZ2V0UGF0aCgpID09PSBnZXRDb21taXRNZXNzYWdlUGF0aChyZXBvc2l0b3J5KSk7XG59XG5cbmxldCBDaGFuZ2VkRmlsZUl0ZW0gPSBudWxsO1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZpbGVQYXRjaFBhbmVJdGVtcyh7b25seVN0YWdlZCwgZW1wdHl9ID0ge30sIHdvcmtzcGFjZSkge1xuICBpZiAoQ2hhbmdlZEZpbGVJdGVtID09PSBudWxsKSB7XG4gICAgQ2hhbmdlZEZpbGVJdGVtID0gcmVxdWlyZSgnLi9pdGVtcy9jaGFuZ2VkLWZpbGUtaXRlbScpLmRlZmF1bHQ7XG4gIH1cblxuICByZXR1cm4gd29ya3NwYWNlLmdldFBhbmVJdGVtcygpLmZpbHRlcihpdGVtID0+IHtcbiAgICBjb25zdCBpc0ZpbGVQYXRjaEl0ZW0gPSBpdGVtICYmIGl0ZW0uZ2V0UmVhbEl0ZW0gJiYgaXRlbS5nZXRSZWFsSXRlbSgpIGluc3RhbmNlb2YgQ2hhbmdlZEZpbGVJdGVtO1xuICAgIGlmIChvbmx5U3RhZ2VkKSB7XG4gICAgICByZXR1cm4gaXNGaWxlUGF0Y2hJdGVtICYmIGl0ZW0uc3RhZ2luZ1N0YXR1cyA9PT0gJ3N0YWdlZCc7XG4gICAgfSBlbHNlIGlmIChlbXB0eSkge1xuICAgICAgcmV0dXJuIGlzRmlsZVBhdGNoSXRlbSA/IGl0ZW0uaXNFbXB0eSgpIDogZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBpc0ZpbGVQYXRjaEl0ZW07XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlc3Ryb3lGaWxlUGF0Y2hQYW5lSXRlbXMoe29ubHlTdGFnZWR9ID0ge30sIHdvcmtzcGFjZSkge1xuICBjb25zdCBpdGVtc1RvRGVzdHJveSA9IGdldEZpbGVQYXRjaFBhbmVJdGVtcyh7b25seVN0YWdlZH0sIHdvcmtzcGFjZSk7XG4gIGl0ZW1zVG9EZXN0cm95LmZvckVhY2goaXRlbSA9PiBpdGVtLmRlc3Ryb3koKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXN0cm95RW1wdHlGaWxlUGF0Y2hQYW5lSXRlbXMod29ya3NwYWNlKSB7XG4gIGNvbnN0IGl0ZW1zVG9EZXN0cm95ID0gZ2V0RmlsZVBhdGNoUGFuZUl0ZW1zKHtlbXB0eTogdHJ1ZX0sIHdvcmtzcGFjZSk7XG4gIGl0ZW1zVG9EZXN0cm95LmZvckVhY2goaXRlbSA9PiBpdGVtLmRlc3Ryb3koKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0Q29BdXRob3JzQW5kUmF3Q29tbWl0TWVzc2FnZShjb21taXRNZXNzYWdlKSB7XG4gIGNvbnN0IG1lc3NhZ2VMaW5lcyA9IFtdO1xuICBjb25zdCBjb0F1dGhvcnMgPSBbXTtcblxuICBmb3IgKGNvbnN0IGxpbmUgb2YgY29tbWl0TWVzc2FnZS5zcGxpdChMSU5FX0VORElOR19SRUdFWCkpIHtcbiAgICBjb25zdCBtYXRjaCA9IGxpbmUubWF0Y2goQ09fQVVUSE9SX1JFR0VYKTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgY29uc3QgW18sIG5hbWUsIGVtYWlsXSA9IG1hdGNoO1xuICAgICAgY29BdXRob3JzLnB1c2gobmV3IEF1dGhvcihlbWFpbCwgbmFtZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBtZXNzYWdlTGluZXMucHVzaChsaW5lKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge21lc3NhZ2U6IG1lc3NhZ2VMaW5lcy5qb2luKCdcXG4nKSwgY29BdXRob3JzfTtcbn1cblxuLy8gQXRvbSBBUEkgcGFuZSBpdGVtIG1hbmlwdWxhdGlvblxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlSXRlbShub2RlLCBjb21wb25lbnRIb2xkZXIgPSBudWxsLCB1cmkgPSBudWxsLCBleHRyYSA9IHt9KSB7XG4gIGNvbnN0IGhvbGRlciA9IGNvbXBvbmVudEhvbGRlciB8fCBuZXcgUmVmSG9sZGVyKCk7XG5cbiAgY29uc3Qgb3ZlcnJpZGUgPSB7XG4gICAgZ2V0RWxlbWVudDogKCkgPT4gbm9kZSxcblxuICAgIGdldFJlYWxJdGVtOiAoKSA9PiBob2xkZXIuZ2V0T3IobnVsbCksXG5cbiAgICBnZXRSZWFsSXRlbVByb21pc2U6ICgpID0+IGhvbGRlci5nZXRQcm9taXNlKCksXG5cbiAgICAuLi5leHRyYSxcbiAgfTtcblxuICBpZiAodXJpKSB7XG4gICAgb3ZlcnJpZGUuZ2V0VVJJID0gKCkgPT4gdXJpO1xuICB9XG5cbiAgaWYgKGNvbXBvbmVudEhvbGRlcikge1xuICAgIHJldHVybiBuZXcgUHJveHkob3ZlcnJpZGUsIHtcbiAgICAgIGdldCh0YXJnZXQsIG5hbWUpIHtcbiAgICAgICAgaWYgKFJlZmxlY3QuaGFzKHRhcmdldCwgbmFtZSkpIHtcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0W25hbWVdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIHt2YWx1ZTogLi4ufSB3cmFwcGVyIHByZXZlbnRzIC5tYXAoKSBmcm9tIGZsYXR0ZW5pbmcgYSByZXR1cm5lZCBSZWZIb2xkZXIuXG4gICAgICAgIC8vIElmIGNvbXBvbmVudFtuYW1lXSBpcyBhIFJlZkhvbGRlciwgd2Ugd2FudCB0byByZXR1cm4gdGhhdCBSZWZIb2xkZXIgYXMtaXMuXG4gICAgICAgIGNvbnN0IHt2YWx1ZX0gPSBob2xkZXIubWFwKGNvbXBvbmVudCA9PiAoe3ZhbHVlOiBjb21wb25lbnRbbmFtZV19KSkuZ2V0T3Ioe3ZhbHVlOiB1bmRlZmluZWR9KTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfSxcblxuICAgICAgc2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGhvbGRlci5tYXAoY29tcG9uZW50ID0+IHtcbiAgICAgICAgICBjb21wb25lbnRbbmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSkuZ2V0T3IodHJ1ZSk7XG4gICAgICB9LFxuXG4gICAgICBoYXModGFyZ2V0LCBuYW1lKSB7XG4gICAgICAgIHJldHVybiBob2xkZXIubWFwKGNvbXBvbmVudCA9PiBSZWZsZWN0Lmhhcyhjb21wb25lbnQsIG5hbWUpKS5nZXRPcihmYWxzZSkgfHwgUmVmbGVjdC5oYXModGFyZ2V0LCBuYW1lKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG92ZXJyaWRlO1xuICB9XG59XG5cbi8vIFNldCBmdW5jdGlvbnNcblxuZXhwb3J0IGZ1bmN0aW9uIGVxdWFsU2V0cyhsZWZ0LCByaWdodCkge1xuICBpZiAobGVmdC5zaXplICE9PSByaWdodC5zaXplKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZm9yIChjb25zdCBlYWNoIG9mIGxlZnQpIHtcbiAgICBpZiAoIXJpZ2h0LmhhcyhlYWNoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyBDb25zdGFudHNcblxuZXhwb3J0IGNvbnN0IE5CU1BfQ0hBUkFDVEVSID0gJ1xcdTAwYTAnO1xuXG5leHBvcnQgZnVuY3Rpb24gYmxhbmtMYWJlbCgpIHtcbiAgcmV0dXJuIE5CU1BfQ0hBUkFDVEVSO1xufVxuXG5leHBvcnQgY29uc3QgcmVhY3Rpb25UeXBlVG9FbW9qaSA9IHtcbiAgVEhVTUJTX1VQOiAn8J+RjScsXG4gIFRIVU1CU19ET1dOOiAn8J+RjicsXG4gIExBVUdIOiAn8J+YhicsXG4gIEhPT1JBWTogJ/CfjoknLFxuICBDT05GVVNFRDogJ/CfmJUnLFxuICBIRUFSVDogJ+KdpO+4jycsXG4gIFJPQ0tFVDogJ/CfmoAnLFxuICBFWUVTOiAn8J+RgCcsXG59O1xuXG4vLyBNYXJrZG93blxuXG5sZXQgbWFya2VkID0gbnVsbDtcbmxldCBkb21QdXJpZnkgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyTWFya2Rvd24obWQpIHtcbiAgaWYgKG1hcmtlZCA9PT0gbnVsbCkge1xuICAgIG1hcmtlZCA9IHJlcXVpcmUoJ21hcmtlZCcpO1xuXG4gICAgaWYgKGRvbVB1cmlmeSA9PT0gbnVsbCkge1xuICAgICAgY29uc3QgY3JlYXRlRE9NUHVyaWZ5ID0gcmVxdWlyZSgnZG9tcHVyaWZ5Jyk7XG4gICAgICBkb21QdXJpZnkgPSBjcmVhdGVET01QdXJpZnkoKTtcbiAgICB9XG5cbiAgICBtYXJrZWQuc2V0T3B0aW9ucyh7XG4gICAgICBzaWxlbnQ6IHRydWUsXG4gICAgICBzYW5pdGl6ZTogdHJ1ZSxcbiAgICAgIHNhbml0aXplcjogaHRtbCA9PiBkb21QdXJpZnkuc2FuaXRpemUoaHRtbCksXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gbWFya2VkKG1kKTtcbn1cblxuZXhwb3J0IGNvbnN0IEdIT1NUX1VTRVIgPSB7XG4gIGxvZ2luOiAnZ2hvc3QnLFxuICBhdmF0YXJVcmw6ICdodHRwczovL2F2YXRhcnMxLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzEwMTM3P3Y9NCcsXG4gIHVybDogJ2h0dHBzOi8vZ2l0aHViLmNvbS9naG9zdCcsXG59O1xuIl0sIm1hcHBpbmdzIjoi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