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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJfcGF0aCIsIl9pbnRlcm9wUmVxdWlyZURlZmF1bHQiLCJyZXF1aXJlIiwiX2ZzRXh0cmEiLCJfb3MiLCJfdGVtcCIsIl9yZWZIb2xkZXIiLCJfYXV0aG9yIiwib2JqIiwiX19lc01vZHVsZSIsImRlZmF1bHQiLCJvd25LZXlzIiwib2JqZWN0IiwiZW51bWVyYWJsZU9ubHkiLCJrZXlzIiwiT2JqZWN0IiwiZ2V0T3duUHJvcGVydHlTeW1ib2xzIiwic3ltYm9scyIsImZpbHRlciIsInN5bSIsImdldE93blByb3BlcnR5RGVzY3JpcHRvciIsImVudW1lcmFibGUiLCJwdXNoIiwiYXBwbHkiLCJfb2JqZWN0U3ByZWFkIiwidGFyZ2V0IiwiaSIsImFyZ3VtZW50cyIsImxlbmd0aCIsInNvdXJjZSIsImZvckVhY2giLCJrZXkiLCJfZGVmaW5lUHJvcGVydHkiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzIiwiZGVmaW5lUHJvcGVydGllcyIsImRlZmluZVByb3BlcnR5IiwidmFsdWUiLCJfdG9Qcm9wZXJ0eUtleSIsImNvbmZpZ3VyYWJsZSIsIndyaXRhYmxlIiwiYXJnIiwiX3RvUHJpbWl0aXZlIiwiU3RyaW5nIiwiaW5wdXQiLCJoaW50IiwicHJpbSIsIlN5bWJvbCIsInRvUHJpbWl0aXZlIiwidW5kZWZpbmVkIiwicmVzIiwiY2FsbCIsIlR5cGVFcnJvciIsIk51bWJlciIsIkxJTkVfRU5ESU5HX1JFR0VYIiwiZXhwb3J0cyIsIkNPX0FVVEhPUl9SRUdFWCIsIlBBR0VfU0laRSIsIlBBR0lOQVRJT05fV0FJVF9USU1FX01TIiwiQ0hFQ0tfU1VJVEVfUEFHRV9TSVpFIiwiQ0hFQ0tfUlVOX1BBR0VfU0laRSIsImF1dG9iaW5kIiwic2VsZiIsIm1ldGhvZHMiLCJtZXRob2QiLCJFcnJvciIsImJpbmQiLCJleHRyYWN0UHJvcHMiLCJwcm9wcyIsInByb3BUeXBlcyIsIm5hbWVNYXAiLCJyZWR1Y2UiLCJvcHRzIiwicHJvcE5hbWUiLCJkZXN0UHJvcE5hbWUiLCJ1bnVzZWRQcm9wcyIsImdldFBhY2thZ2VSb290IiwicmVzb3VyY2VQYXRoIiwiYXRvbSIsImdldExvYWRTZXR0aW5ncyIsImN1cnJlbnRGaWxlV2FzUmVxdWlyZWRGcm9tU25hcHNob3QiLCJwYXRoIiwiaXNBYnNvbHV0ZSIsIl9fZGlybmFtZSIsImpvaW4iLCJwYWNrYWdlUm9vdCIsInJlc29sdmUiLCJleHRuYW1lIiwiaW5kZXhPZiIsImdldEF0b21BcHBOYW1lIiwiYnJhbmRpbmciLCJuYW1lIiwiZ2V0QXRvbUhlbHBlclBhdGgiLCJwcm9jZXNzIiwicGxhdGZvcm0iLCJhcHBOYW1lIiwicmVzb3VyY2VzUGF0aCIsImV4ZWNQYXRoIiwiRFVHSVRFX1BBVEgiLCJnZXREdWdpdGVQYXRoIiwiU0hBUkVEX01PRFVMRV9QQVRIUyIsIk1hcCIsImdldFNoYXJlZE1vZHVsZVBhdGgiLCJyZWxQYXRoIiwibW9kdWxlUGF0aCIsImdldCIsInNldCIsImlzQmluYXJ5IiwiZGF0YSIsImNvZGUiLCJjaGFyQ29kZUF0IiwiZGVzY3JpcHRvcnNGcm9tUHJvdG8iLCJwcm90byIsImdldE93blByb3BlcnR5TmFtZXMiLCJhY2MiLCJhc3NpZ24iLCJSZWZsZWN0IiwiZmlyc3RJbXBsZW1lbnRlciIsInRhcmdldHMiLCJQcm94eSIsIl9faW1wbGVtZW50YXRpb25zIiwiaGFzIiwiZmlyc3RWYWxpZFRhcmdldCIsImZpbmQiLCJ0Iiwic29tZSIsImNvbXBvc2l0ZU93blByb3BlcnR5RGVzY3JpcHRvciIsImdldFByb3RvdHlwZU9mIiwicmVkdWNlUmlnaHQiLCJjcmVhdGUiLCJwcm90b3R5cGUiLCJpc1Jvb3QiLCJkaXIiLCJpc1ZhbGlkV29ya2RpciIsIm9zIiwiaG9tZWRpciIsImZpbGVFeGlzdHMiLCJhYnNvbHV0ZUZpbGVQYXRoIiwiZnMiLCJhY2Nlc3MiLCJlIiwiZ2V0VGVtcERpciIsIm9wdGlvbnMiLCJ0ZW1wIiwidHJhY2siLCJQcm9taXNlIiwicmVqZWN0IiwibWtkaXIiLCJ0ZW1wRXJyb3IiLCJmb2xkZXIiLCJzeW1saW5rT2siLCJyZWFscGF0aCIsInJlYWxFcnJvciIsInJwYXRoIiwiaXNGaWxlRXhlY3V0YWJsZSIsInN0YXQiLCJtb2RlIiwiY29uc3RhbnRzIiwiU19JWFVTUiIsImlzRmlsZVN5bWxpbmsiLCJsc3RhdCIsImlzU3ltYm9saWNMaW5rIiwic2hvcnRlblNoYSIsInNoYSIsInNsaWNlIiwiY2xhc3NOYW1lRm9yU3RhdHVzIiwiYWRkZWQiLCJkZWxldGVkIiwibW9kaWZpZWQiLCJ0eXBlY2hhbmdlIiwiZXF1aXZhbGVudCIsIm5vcm1hbGl6ZUdpdEhlbHBlclBhdGgiLCJpblBhdGgiLCJyZXBsYWNlIiwidG9OYXRpdmVQYXRoU2VwIiwicmF3UGF0aCIsInNwbGl0Iiwic2VwIiwidG9HaXRQYXRoU2VwIiwiZmlsZVBhdGhFbmRzV2l0aCIsImZpbGVQYXRoIiwic2VnbWVudHMiLCJlbmRzV2l0aCIsInRvU2VudGVuY2UiLCJhcnJheSIsImxlbiIsIml0ZW0iLCJpZHgiLCJwdXNoQXRLZXkiLCJtYXAiLCJleGlzdGluZyIsImdldENvbW1pdE1lc3NhZ2VQYXRoIiwicmVwb3NpdG9yeSIsImdldEdpdERpcmVjdG9yeVBhdGgiLCJnZXRDb21taXRNZXNzYWdlRWRpdG9ycyIsIndvcmtzcGFjZSIsImlzUHJlc2VudCIsImdldFRleHRFZGl0b3JzIiwiZWRpdG9yIiwiZ2V0UGF0aCIsIkNoYW5nZWRGaWxlSXRlbSIsImdldEZpbGVQYXRjaFBhbmVJdGVtcyIsIm9ubHlTdGFnZWQiLCJlbXB0eSIsImdldFBhbmVJdGVtcyIsImlzRmlsZVBhdGNoSXRlbSIsImdldFJlYWxJdGVtIiwic3RhZ2luZ1N0YXR1cyIsImlzRW1wdHkiLCJkZXN0cm95RmlsZVBhdGNoUGFuZUl0ZW1zIiwiaXRlbXNUb0Rlc3Ryb3kiLCJkZXN0cm95IiwiZGVzdHJveUVtcHR5RmlsZVBhdGNoUGFuZUl0ZW1zIiwiZXh0cmFjdENvQXV0aG9yc0FuZFJhd0NvbW1pdE1lc3NhZ2UiLCJjb21taXRNZXNzYWdlIiwibWVzc2FnZUxpbmVzIiwiY29BdXRob3JzIiwibGluZSIsIm1hdGNoIiwiXyIsImVtYWlsIiwiQXV0aG9yIiwibWVzc2FnZSIsImNyZWF0ZUl0ZW0iLCJub2RlIiwiY29tcG9uZW50SG9sZGVyIiwidXJpIiwiZXh0cmEiLCJob2xkZXIiLCJSZWZIb2xkZXIiLCJvdmVycmlkZSIsImdldEVsZW1lbnQiLCJnZXRPciIsImdldFJlYWxJdGVtUHJvbWlzZSIsImdldFByb21pc2UiLCJnZXRVUkkiLCJjb21wb25lbnQiLCJlcXVhbFNldHMiLCJsZWZ0IiwicmlnaHQiLCJzaXplIiwiZWFjaCIsIk5CU1BfQ0hBUkFDVEVSIiwiYmxhbmtMYWJlbCIsInJlYWN0aW9uVHlwZVRvRW1vamkiLCJUSFVNQlNfVVAiLCJUSFVNQlNfRE9XTiIsIkxBVUdIIiwiSE9PUkFZIiwiQ09ORlVTRUQiLCJIRUFSVCIsIlJPQ0tFVCIsIkVZRVMiLCJtYXJrZWQiLCJkb21QdXJpZnkiLCJyZW5kZXJNYXJrZG93biIsIm1kIiwiY3JlYXRlRE9NUHVyaWZ5Iiwic2V0T3B0aW9ucyIsInNpbGVudCIsInNhbml0aXplIiwic2FuaXRpemVyIiwiaHRtbCIsIkdIT1NUX1VTRVIiLCJsb2dpbiIsImF2YXRhclVybCIsInVybCJdLCJzb3VyY2VzIjpbImhlbHBlcnMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IG9zIGZyb20gJ29zJztcbmltcG9ydCB0ZW1wIGZyb20gJ3RlbXAnO1xuXG5pbXBvcnQgUmVmSG9sZGVyIGZyb20gJy4vbW9kZWxzL3JlZi1ob2xkZXInO1xuaW1wb3J0IEF1dGhvciBmcm9tICcuL21vZGVscy9hdXRob3InO1xuXG5leHBvcnQgY29uc3QgTElORV9FTkRJTkdfUkVHRVggPSAvXFxyP1xcbi87XG5leHBvcnQgY29uc3QgQ09fQVVUSE9SX1JFR0VYID0gL15jby1hdXRob3JlZC1ieS4gKC4rPykgPCguKz8pPiQvaTtcbmV4cG9ydCBjb25zdCBQQUdFX1NJWkUgPSA1MDtcbmV4cG9ydCBjb25zdCBQQUdJTkFUSU9OX1dBSVRfVElNRV9NUyA9IDEwMDtcbmV4cG9ydCBjb25zdCBDSEVDS19TVUlURV9QQUdFX1NJWkUgPSAxMDtcbmV4cG9ydCBjb25zdCBDSEVDS19SVU5fUEFHRV9TSVpFID0gMjA7XG5cbmV4cG9ydCBmdW5jdGlvbiBhdXRvYmluZChzZWxmLCAuLi5tZXRob2RzKSB7XG4gIGZvciAoY29uc3QgbWV0aG9kIG9mIG1ldGhvZHMpIHtcbiAgICBpZiAodHlwZW9mIHNlbGZbbWV0aG9kXSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gYXV0b2JpbmQgbWV0aG9kICR7bWV0aG9kfWApO1xuICAgIH1cbiAgICBzZWxmW21ldGhvZF0gPSBzZWxmW21ldGhvZF0uYmluZChzZWxmKTtcbiAgfVxufVxuXG4vLyBFeHRyYWN0IGEgc3Vic2V0IG9mIHByb3BzIGNob3NlbiBmcm9tIGEgcHJvcFR5cGVzIG9iamVjdCBmcm9tIGEgY29tcG9uZW50J3MgcHJvcHMgdG8gcGFzcyB0byBhIGRpZmZlcmVudCBBUEkuXG4vL1xuLy8gVXNhZ2U6XG4vL1xuLy8gYGBganNcbi8vIGNvbnN0IGFwaVByb3BzID0ge1xuLy8gICB6ZXJvOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4vLyAgIG9uZTogUHJvcFR5cGVzLnN0cmluZyxcbi8vICAgdHdvOiBQcm9wVHlwZXMub2JqZWN0LFxuLy8gfTtcbi8vXG4vLyBjbGFzcyBDb21wb25lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuLy8gICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuLy8gICAgIC4uLmFwaVByb3BzLFxuLy8gICAgIGV4dHJhOiBQcm9wVHlwZXMuZnVuYyxcbi8vICAgfVxuLy9cbi8vICAgYWN0aW9uKCkge1xuLy8gICAgIGNvbnN0IG9wdGlvbnMgPSBleHRyYWN0UHJvcHModGhpcy5wcm9wcywgYXBpUHJvcHMpO1xuLy8gICAgIC8vIG9wdGlvbnMgY29udGFpbnMgemVybywgb25lLCBhbmQgdHdvLCBidXQgbm90IGV4dHJhXG4vLyAgIH1cbi8vIH1cbi8vIGBgYFxuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RQcm9wcyhwcm9wcywgcHJvcFR5cGVzLCBuYW1lTWFwID0ge30pIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHByb3BUeXBlcykucmVkdWNlKChvcHRzLCBwcm9wTmFtZSkgPT4ge1xuICAgIGlmIChwcm9wc1twcm9wTmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgZGVzdFByb3BOYW1lID0gbmFtZU1hcFtwcm9wTmFtZV0gfHwgcHJvcE5hbWU7XG4gICAgICBvcHRzW2Rlc3RQcm9wTmFtZV0gPSBwcm9wc1twcm9wTmFtZV07XG4gICAgfVxuICAgIHJldHVybiBvcHRzO1xuICB9LCB7fSk7XG59XG5cbi8vIFRoZSBvcHBvc2l0ZSBvZiBleHRyYWN0UHJvcHMuIFJldHVybiBhIHN1YnNldCBvZiBwcm9wcyB0aGF0IGRvICpub3QqIGFwcGVhciBpbiBhIGNvbXBvbmVudCdzIHByb3AgdHlwZXMuXG5leHBvcnQgZnVuY3Rpb24gdW51c2VkUHJvcHMocHJvcHMsIHByb3BUeXBlcykge1xuICByZXR1cm4gT2JqZWN0LmtleXMocHJvcHMpLnJlZHVjZSgob3B0cywgcHJvcE5hbWUpID0+IHtcbiAgICBpZiAocHJvcFR5cGVzW3Byb3BOYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBvcHRzW3Byb3BOYW1lXSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICB9XG4gICAgcmV0dXJuIG9wdHM7XG4gIH0sIHt9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBhY2thZ2VSb290KCkge1xuICBjb25zdCB7cmVzb3VyY2VQYXRofSA9IGF0b20uZ2V0TG9hZFNldHRpbmdzKCk7XG4gIGNvbnN0IGN1cnJlbnRGaWxlV2FzUmVxdWlyZWRGcm9tU25hcHNob3QgPSAhcGF0aC5pc0Fic29sdXRlKF9fZGlybmFtZSk7XG4gIGlmIChjdXJyZW50RmlsZVdhc1JlcXVpcmVkRnJvbVNuYXBzaG90KSB7XG4gICAgcmV0dXJuIHBhdGguam9pbihyZXNvdXJjZVBhdGgsICdub2RlX21vZHVsZXMnLCAnZ2l0aHViJyk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgcGFja2FnZVJvb3QgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4nKTtcbiAgICBpZiAocGF0aC5leHRuYW1lKHJlc291cmNlUGF0aCkgPT09ICcuYXNhcicpIHtcbiAgICAgIGlmIChwYWNrYWdlUm9vdC5pbmRleE9mKHJlc291cmNlUGF0aCkgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHBhdGguam9pbihgJHtyZXNvdXJjZVBhdGh9LnVucGFja2VkYCwgJ25vZGVfbW9kdWxlcycsICdnaXRodWInKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhY2thZ2VSb290O1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldEF0b21BcHBOYW1lKCkge1xuICAvKlxuICAvLyBPbGQgQXRvbSBsb2dpYyAocmVzdG9yZSB0aGlzIGlmIHdlIG1ha2UgcmVsZWFzZSBjaGFubmVsIHNwZWNpZmljIGJpbmFyaWVzKVxuICBjb25zdCBtYXRjaCA9IGF0b20uZ2V0VmVyc2lvbigpLm1hdGNoKC8tKFtBLVphLXpdKykoXFxkK3wtKS8pO1xuICBpZiAobWF0Y2gpIHtcbiAgICBjb25zdCBjaGFubmVsID0gbWF0Y2hbMV07XG4gICAgcmV0dXJuIGBQdWxzYXIgJHtjaGFubmVsLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgY2hhbm5lbC5zbGljZSgxKX0gSGVscGVyYDtcbiAgfVxuXG4gIHJldHVybiAnUHVsc2FyIEhlbHBlcic7XG4gICovXG5cbiAgcmV0dXJuIGAke2F0b20/LmJyYW5kaW5nPy5uYW1lID8/ICdQdWxzYXInfSBIZWxwZXJgO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QXRvbUhlbHBlclBhdGgoKSB7XG4gIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnZGFyd2luJykge1xuICAgIGNvbnN0IGFwcE5hbWUgPSBnZXRBdG9tQXBwTmFtZSgpO1xuICAgIHJldHVybiBwYXRoLnJlc29sdmUocHJvY2Vzcy5yZXNvdXJjZXNQYXRoLCAnLi4nLCAnRnJhbWV3b3JrcycsXG4gICAgICBgJHthcHBOYW1lfS5hcHBgLCAnQ29udGVudHMnLCAnTWFjT1MnLCBhcHBOYW1lKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcHJvY2Vzcy5leGVjUGF0aDtcbiAgfVxufVxuXG5sZXQgRFVHSVRFX1BBVEg7XG5leHBvcnQgZnVuY3Rpb24gZ2V0RHVnaXRlUGF0aCgpIHtcbiAgaWYgKCFEVUdJVEVfUEFUSCkge1xuICAgIERVR0lURV9QQVRIID0gcmVxdWlyZS5yZXNvbHZlKCdkdWdpdGUnKTtcbiAgICBpZiAoIXBhdGguaXNBYnNvbHV0ZShEVUdJVEVfUEFUSCkpIHtcbiAgICAgIC8vIEFzc3VtZSB3ZSdyZSBzbmFwc2hvdHRlZFxuICAgICAgY29uc3Qge3Jlc291cmNlUGF0aH0gPSBhdG9tLmdldExvYWRTZXR0aW5ncygpO1xuICAgICAgaWYgKHBhdGguZXh0bmFtZShyZXNvdXJjZVBhdGgpID09PSAnLmFzYXInKSB7XG4gICAgICAgIERVR0lURV9QQVRIID0gcGF0aC5qb2luKGAke3Jlc291cmNlUGF0aH0udW5wYWNrZWRgLCAnbm9kZV9tb2R1bGVzJywgJ2R1Z2l0ZScpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgRFVHSVRFX1BBVEggPSBwYXRoLmpvaW4ocmVzb3VyY2VQYXRoLCAnbm9kZV9tb2R1bGVzJywgJ2R1Z2l0ZScpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBEVUdJVEVfUEFUSDtcbn1cblxuY29uc3QgU0hBUkVEX01PRFVMRV9QQVRIUyA9IG5ldyBNYXAoKTtcbmV4cG9ydCBmdW5jdGlvbiBnZXRTaGFyZWRNb2R1bGVQYXRoKHJlbFBhdGgpIHtcbiAgbGV0IG1vZHVsZVBhdGggPSBTSEFSRURfTU9EVUxFX1BBVEhTLmdldChyZWxQYXRoKTtcbiAgaWYgKCFtb2R1bGVQYXRoKSB7XG4gICAgbW9kdWxlUGF0aCA9IHJlcXVpcmUucmVzb2x2ZShwYXRoLmpvaW4oX19kaXJuYW1lLCAnc2hhcmVkJywgcmVsUGF0aCkpO1xuICAgIGlmICghcGF0aC5pc0Fic29sdXRlKG1vZHVsZVBhdGgpKSB7XG4gICAgICAvLyBBc3N1bWUgd2UncmUgc25hcHNob3R0ZWRcbiAgICAgIGNvbnN0IHtyZXNvdXJjZVBhdGh9ID0gYXRvbS5nZXRMb2FkU2V0dGluZ3MoKTtcbiAgICAgIG1vZHVsZVBhdGggPSBwYXRoLmpvaW4ocmVzb3VyY2VQYXRoLCBtb2R1bGVQYXRoKTtcbiAgICB9XG5cbiAgICBTSEFSRURfTU9EVUxFX1BBVEhTLnNldChyZWxQYXRoLCBtb2R1bGVQYXRoKTtcbiAgfVxuXG4gIHJldHVybiBtb2R1bGVQYXRoO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNCaW5hcnkoZGF0YSkge1xuICBmb3IgKGxldCBpID0gMDsgaSA8IDUwOyBpKyspIHtcbiAgICBjb25zdCBjb2RlID0gZGF0YS5jaGFyQ29kZUF0KGkpO1xuICAgIC8vIENoYXIgY29kZSA2NTUzMyBpcyB0aGUgXCJyZXBsYWNlbWVudCBjaGFyYWN0ZXJcIjtcbiAgICAvLyA4IGFuZCBiZWxvdyBhcmUgY29udHJvbCBjaGFyYWN0ZXJzLlxuICAgIGlmIChjb2RlID09PSA2NTUzMyB8fCBjb2RlIDwgOSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5mdW5jdGlvbiBkZXNjcmlwdG9yc0Zyb21Qcm90byhwcm90bykge1xuICByZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMocHJvdG8pLnJlZHVjZSgoYWNjLCBuYW1lKSA9PiB7XG4gICAgT2JqZWN0LmFzc2lnbihhY2MsIHtcbiAgICAgIFtuYW1lXTogUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocHJvdG8sIG5hbWUpLFxuICAgIH0pO1xuICAgIHJldHVybiBhY2M7XG4gIH0sIHt9KTtcbn1cblxuLyoqXG4gKiBUYWtlcyBhbiBhcnJheSBvZiB0YXJnZXRzIGFuZCByZXR1cm5zIGEgcHJveHkuIFRoZSBwcm94eSBpbnRlcmNlcHRzIHByb3BlcnR5IGFjY2Vzc29yIGNhbGxzIGFuZFxuICogcmV0dXJucyB0aGUgdmFsdWUgb2YgdGhhdCBwcm9wZXJ0eSBvbiB0aGUgZmlyc3Qgb2JqZWN0IGluIGB0YXJnZXRzYCB3aGVyZSB0aGUgdGFyZ2V0IGltcGxlbWVudHMgdGhhdCBwcm9wZXJ0eS5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZpcnN0SW1wbGVtZW50ZXIoLi4udGFyZ2V0cykge1xuICByZXR1cm4gbmV3IFByb3h5KHtfX2ltcGxlbWVudGF0aW9uczogdGFyZ2V0c30sIHtcbiAgICBnZXQodGFyZ2V0LCBuYW1lKSB7XG4gICAgICBpZiAobmFtZSA9PT0gJ2dldEltcGxlbWVudGVycycpIHtcbiAgICAgICAgcmV0dXJuICgpID0+IHRhcmdldHM7XG4gICAgICB9XG5cbiAgICAgIGlmIChSZWZsZWN0Lmhhcyh0YXJnZXQsIG5hbWUpKSB7XG4gICAgICAgIHJldHVybiB0YXJnZXRbbmFtZV07XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IGZpcnN0VmFsaWRUYXJnZXQgPSB0YXJnZXRzLmZpbmQodCA9PiBSZWZsZWN0Lmhhcyh0LCBuYW1lKSk7XG4gICAgICBpZiAoZmlyc3RWYWxpZFRhcmdldCkge1xuICAgICAgICByZXR1cm4gZmlyc3RWYWxpZFRhcmdldFtuYW1lXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfSxcblxuICAgIHNldCh0YXJnZXQsIG5hbWUsIHZhbHVlKSB7XG4gICAgICBjb25zdCBmaXJzdFZhbGlkVGFyZ2V0ID0gdGFyZ2V0cy5maW5kKHQgPT4gUmVmbGVjdC5oYXModCwgbmFtZSkpO1xuICAgICAgaWYgKGZpcnN0VmFsaWRUYXJnZXQpIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJldHVybi1hc3NpZ25cbiAgICAgICAgcmV0dXJuIGZpcnN0VmFsaWRUYXJnZXRbbmFtZV0gPSB2YWx1ZTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXR1cm4tYXNzaWduXG4gICAgICAgIHJldHVybiB0YXJnZXRbbmFtZV0gPSB2YWx1ZTtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gVXNlZCBieSBzaW5vblxuICAgIGhhcyh0YXJnZXQsIG5hbWUpIHtcbiAgICAgIGlmIChuYW1lID09PSAnZ2V0SW1wbGVtZW50ZXJzJykge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHRhcmdldHMuc29tZSh0ID0+IFJlZmxlY3QuaGFzKHQsIG5hbWUpKTtcbiAgICB9LFxuXG4gICAgLy8gVXNlZCBieSBzaW5vblxuICAgIGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIG5hbWUpIHtcbiAgICAgIGNvbnN0IGZpcnN0VmFsaWRUYXJnZXQgPSB0YXJnZXRzLmZpbmQodCA9PiBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LCBuYW1lKSk7XG4gICAgICBjb25zdCBjb21wb3NpdGVPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIG5hbWUpO1xuICAgICAgaWYgKGZpcnN0VmFsaWRUYXJnZXQpIHtcbiAgICAgICAgcmV0dXJuIFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGZpcnN0VmFsaWRUYXJnZXQsIG5hbWUpO1xuICAgICAgfSBlbHNlIGlmIChjb21wb3NpdGVPd25Qcm9wZXJ0eURlc2NyaXB0b3IpIHtcbiAgICAgICAgcmV0dXJuIGNvbXBvc2l0ZU93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIFVzZWQgYnkgc2lub25cbiAgICBnZXRQcm90b3R5cGVPZih0YXJnZXQpIHtcbiAgICAgIHJldHVybiB0YXJnZXRzLnJlZHVjZVJpZ2h0KChhY2MsIHQpID0+IHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5jcmVhdGUoYWNjLCBkZXNjcmlwdG9yc0Zyb21Qcm90byhPYmplY3QuZ2V0UHJvdG90eXBlT2YodCkpKTtcbiAgICAgIH0sIE9iamVjdC5wcm90b3R5cGUpO1xuICAgIH0sXG4gIH0pO1xufVxuXG5mdW5jdGlvbiBpc1Jvb3QoZGlyKSB7XG4gIHJldHVybiBwYXRoLnJlc29sdmUoZGlyLCAnLi4nKSA9PT0gZGlyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNWYWxpZFdvcmtkaXIoZGlyKSB7XG4gIHJldHVybiBkaXIgIT09IG9zLmhvbWVkaXIoKSAmJiAhaXNSb290KGRpcik7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBmaWxlRXhpc3RzKGFic29sdXRlRmlsZVBhdGgpIHtcbiAgdHJ5IHtcbiAgICBhd2FpdCBmcy5hY2Nlc3MoYWJzb2x1dGVGaWxlUGF0aCk7XG4gICAgcmV0dXJuIHRydWU7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBpZiAoZS5jb2RlID09PSAnRU5PRU5UJykge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHRocm93IGU7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRlbXBEaXIob3B0aW9ucyA9IHt9KSB7XG4gIHRlbXAudHJhY2soKTtcblxuICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgIHRlbXAubWtkaXIob3B0aW9ucywgKHRlbXBFcnJvciwgZm9sZGVyKSA9PiB7XG4gICAgICBpZiAodGVtcEVycm9yKSB7XG4gICAgICAgIHJlamVjdCh0ZW1wRXJyb3IpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLnN5bWxpbmtPaykge1xuICAgICAgICByZXNvbHZlKGZvbGRlcik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBmcy5yZWFscGF0aChmb2xkZXIsIChyZWFsRXJyb3IsIHJwYXRoKSA9PiAocmVhbEVycm9yID8gcmVqZWN0KHJlYWxFcnJvcikgOiByZXNvbHZlKHJwYXRoKSkpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGlzRmlsZUV4ZWN1dGFibGUoYWJzb2x1dGVGaWxlUGF0aCkge1xuICBjb25zdCBzdGF0ID0gYXdhaXQgZnMuc3RhdChhYnNvbHV0ZUZpbGVQYXRoKTtcbiAgcmV0dXJuIHN0YXQubW9kZSAmIGZzLmNvbnN0YW50cy5TX0lYVVNSOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWJpdHdpc2Vcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGlzRmlsZVN5bWxpbmsoYWJzb2x1dGVGaWxlUGF0aCkge1xuICBjb25zdCBzdGF0ID0gYXdhaXQgZnMubHN0YXQoYWJzb2x1dGVGaWxlUGF0aCk7XG4gIHJldHVybiBzdGF0LmlzU3ltYm9saWNMaW5rKCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzaG9ydGVuU2hhKHNoYSkge1xuICByZXR1cm4gc2hhLnNsaWNlKDAsIDgpO1xufVxuXG5leHBvcnQgY29uc3QgY2xhc3NOYW1lRm9yU3RhdHVzID0ge1xuICBhZGRlZDogJ2FkZGVkJyxcbiAgZGVsZXRlZDogJ3JlbW92ZWQnLFxuICBtb2RpZmllZDogJ21vZGlmaWVkJyxcbiAgdHlwZWNoYW5nZTogJ21vZGlmaWVkJyxcbiAgZXF1aXZhbGVudDogJ2lnbm9yZWQnLFxufTtcblxuLypcbiAqIEFwcGx5IGFueSBwbGF0Zm9ybS1zcGVjaWZpYyBtdW5naW5nIHRvIGEgcGF0aCBiZWZvcmUgcHJlc2VudGluZyBpdCBhc1xuICogYSBnaXQgZW52aXJvbm1lbnQgdmFyaWFibGUgb3Igb3B0aW9uLlxuICpcbiAqIENvbnZlcnQgYSBXaW5kb3dzLXN0eWxlIFwiQzpcXGZvb1xcYmFyXFxiYXpcIiBwYXRoIHRvIGEgXCIvYy9mb28vYmFyL2JhelwiIFVOSVgteVxuICogcGF0aCB0aGF0IHRoZSBzaC5leGUgdXNlZCB0byBleGVjdXRlIGdpdCdzIGNyZWRlbnRpYWwgaGVscGVycyB3aWxsXG4gKiB1bmRlcnN0YW5kLlxuICovXG5leHBvcnQgZnVuY3Rpb24gbm9ybWFsaXplR2l0SGVscGVyUGF0aChpblBhdGgpIHtcbiAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICd3aW4zMicpIHtcbiAgICByZXR1cm4gaW5QYXRoLnJlcGxhY2UoL1xcXFwvZywgJy8nKS5yZXBsYWNlKC9eKFteOl0rKTovLCAnLyQxJyk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGluUGF0aDtcbiAgfVxufVxuXG4vKlxuICogT24gV2luZG93cywgZ2l0IGNvbW1hbmRzIHJlcG9ydCBwYXRocyB3aXRoIC8gZGVsaW1pdGVycy4gQ29udmVydCB0aGVtIHRvIFxcLWRlbGltaXRlZCBwYXRoc1xuICogc28gdGhhdCBBdG9tIHVuaWZyb21seSB0cmVhdHMgcGF0aHMgd2l0aCBuYXRpdmUgcGF0aCBzZXBhcmF0b3JzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9OYXRpdmVQYXRoU2VwKHJhd1BhdGgpIHtcbiAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICd3aW4zMicpIHtcbiAgICByZXR1cm4gcmF3UGF0aDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcmF3UGF0aC5zcGxpdCgnLycpLmpvaW4ocGF0aC5zZXApO1xuICB9XG59XG5cbi8qXG4gKiBDb252ZXJ0IFdpbmRvd3MgcGF0aHMgYmFjayB0byAvLWRlbGltaXRlZCBwYXRocyB0byBiZSBwcmVzZW50ZWQgdG8gZ2l0LlxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9HaXRQYXRoU2VwKHJhd1BhdGgpIHtcbiAgaWYgKHByb2Nlc3MucGxhdGZvcm0gIT09ICd3aW4zMicpIHtcbiAgICByZXR1cm4gcmF3UGF0aDtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gcmF3UGF0aC5zcGxpdChwYXRoLnNlcCkuam9pbignLycpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmaWxlUGF0aEVuZHNXaXRoKGZpbGVQYXRoLCAuLi5zZWdtZW50cykge1xuICByZXR1cm4gZmlsZVBhdGguZW5kc1dpdGgocGF0aC5qb2luKC4uLnNlZ21lbnRzKSk7XG59XG5cbi8qKlxuICogVHVybnMgYW4gYXJyYXkgb2YgdGhpbmdzIEBrdXljaGFjbyBjYW5ub3QgZWF0XG4gKiBpbnRvIGEgc2VudGVuY2UgY29udGFpbmluZyB0aGluZ3MgQGt1eWNoYWNvIGNhbm5vdCBlYXRcbiAqXG4gKiBbJ3RvYXN0J10gPT4gJ3RvYXN0J1xuICogWyd0b2FzdCcsICdlZ2dzJ10gPT4gJ3RvYXN0IGFuZCBlZ2dzJ1xuICogWyd0b2FzdCcsICdlZ2dzJywgJ2NoZWVzZSddID0+ICd0b2FzdCwgZWdncywgYW5kIGNoZWVzZSdcbiAqXG4gKiBPeGZvcmQgY29tbWEgaW5jbHVkZWQgYmVjYXVzZSB5b3UncmUgd3JvbmcsIHNodXQgdXAuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b1NlbnRlbmNlKGFycmF5KSB7XG4gIGNvbnN0IGxlbiA9IGFycmF5Lmxlbmd0aDtcbiAgaWYgKGxlbiA9PT0gMSkge1xuICAgIHJldHVybiBgJHthcnJheVswXX1gO1xuICB9IGVsc2UgaWYgKGxlbiA9PT0gMikge1xuICAgIHJldHVybiBgJHthcnJheVswXX0gYW5kICR7YXJyYXlbMV19YDtcbiAgfVxuXG4gIHJldHVybiBhcnJheS5yZWR1Y2UoKGFjYywgaXRlbSwgaWR4KSA9PiB7XG4gICAgaWYgKGlkeCA9PT0gMCkge1xuICAgICAgcmV0dXJuIGAke2l0ZW19YDtcbiAgICB9IGVsc2UgaWYgKGlkeCA9PT0gbGVuIC0gMSkge1xuICAgICAgcmV0dXJuIGAke2FjY30sIGFuZCAke2l0ZW19YDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGAke2FjY30sICR7aXRlbX1gO1xuICAgIH1cbiAgfSwgJycpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHVzaEF0S2V5KG1hcCwga2V5LCB2YWx1ZSkge1xuICBsZXQgZXhpc3RpbmcgPSBtYXAuZ2V0KGtleSk7XG4gIGlmICghZXhpc3RpbmcpIHtcbiAgICBleGlzdGluZyA9IFtdO1xuICAgIG1hcC5zZXQoa2V5LCBleGlzdGluZyk7XG4gIH1cbiAgZXhpc3RpbmcucHVzaCh2YWx1ZSk7XG59XG5cbi8vIFJlcG9zaXRvcnkgYW5kIHdvcmtzcGFjZSBoZWxwZXJzXG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21taXRNZXNzYWdlUGF0aChyZXBvc2l0b3J5KSB7XG4gIHJldHVybiBwYXRoLmpvaW4ocmVwb3NpdG9yeS5nZXRHaXREaXJlY3RvcnlQYXRoKCksICdBVE9NX0NPTU1JVF9FRElUTVNHJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb21taXRNZXNzYWdlRWRpdG9ycyhyZXBvc2l0b3J5LCB3b3Jrc3BhY2UpIHtcbiAgaWYgKCFyZXBvc2l0b3J5LmlzUHJlc2VudCgpKSB7XG4gICAgcmV0dXJuIFtdO1xuICB9XG4gIHJldHVybiB3b3Jrc3BhY2UuZ2V0VGV4dEVkaXRvcnMoKS5maWx0ZXIoZWRpdG9yID0+IGVkaXRvci5nZXRQYXRoKCkgPT09IGdldENvbW1pdE1lc3NhZ2VQYXRoKHJlcG9zaXRvcnkpKTtcbn1cblxubGV0IENoYW5nZWRGaWxlSXRlbSA9IG51bGw7XG5leHBvcnQgZnVuY3Rpb24gZ2V0RmlsZVBhdGNoUGFuZUl0ZW1zKHtvbmx5U3RhZ2VkLCBlbXB0eX0gPSB7fSwgd29ya3NwYWNlKSB7XG4gIGlmIChDaGFuZ2VkRmlsZUl0ZW0gPT09IG51bGwpIHtcbiAgICBDaGFuZ2VkRmlsZUl0ZW0gPSByZXF1aXJlKCcuL2l0ZW1zL2NoYW5nZWQtZmlsZS1pdGVtJykuZGVmYXVsdDtcbiAgfVxuXG4gIHJldHVybiB3b3Jrc3BhY2UuZ2V0UGFuZUl0ZW1zKCkuZmlsdGVyKGl0ZW0gPT4ge1xuICAgIGNvbnN0IGlzRmlsZVBhdGNoSXRlbSA9IGl0ZW0gJiYgaXRlbS5nZXRSZWFsSXRlbSAmJiBpdGVtLmdldFJlYWxJdGVtKCkgaW5zdGFuY2VvZiBDaGFuZ2VkRmlsZUl0ZW07XG4gICAgaWYgKG9ubHlTdGFnZWQpIHtcbiAgICAgIHJldHVybiBpc0ZpbGVQYXRjaEl0ZW0gJiYgaXRlbS5zdGFnaW5nU3RhdHVzID09PSAnc3RhZ2VkJztcbiAgICB9IGVsc2UgaWYgKGVtcHR5KSB7XG4gICAgICByZXR1cm4gaXNGaWxlUGF0Y2hJdGVtID8gaXRlbS5pc0VtcHR5KCkgOiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGlzRmlsZVBhdGNoSXRlbTtcbiAgICB9XG4gIH0pO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVzdHJveUZpbGVQYXRjaFBhbmVJdGVtcyh7b25seVN0YWdlZH0gPSB7fSwgd29ya3NwYWNlKSB7XG4gIGNvbnN0IGl0ZW1zVG9EZXN0cm95ID0gZ2V0RmlsZVBhdGNoUGFuZUl0ZW1zKHtvbmx5U3RhZ2VkfSwgd29ya3NwYWNlKTtcbiAgaXRlbXNUb0Rlc3Ryb3kuZm9yRWFjaChpdGVtID0+IGl0ZW0uZGVzdHJveSgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlc3Ryb3lFbXB0eUZpbGVQYXRjaFBhbmVJdGVtcyh3b3Jrc3BhY2UpIHtcbiAgY29uc3QgaXRlbXNUb0Rlc3Ryb3kgPSBnZXRGaWxlUGF0Y2hQYW5lSXRlbXMoe2VtcHR5OiB0cnVlfSwgd29ya3NwYWNlKTtcbiAgaXRlbXNUb0Rlc3Ryb3kuZm9yRWFjaChpdGVtID0+IGl0ZW0uZGVzdHJveSgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RDb0F1dGhvcnNBbmRSYXdDb21taXRNZXNzYWdlKGNvbW1pdE1lc3NhZ2UpIHtcbiAgY29uc3QgbWVzc2FnZUxpbmVzID0gW107XG4gIGNvbnN0IGNvQXV0aG9ycyA9IFtdO1xuXG4gIGZvciAoY29uc3QgbGluZSBvZiBjb21taXRNZXNzYWdlLnNwbGl0KExJTkVfRU5ESU5HX1JFR0VYKSkge1xuICAgIGNvbnN0IG1hdGNoID0gbGluZS5tYXRjaChDT19BVVRIT1JfUkVHRVgpO1xuICAgIGlmIChtYXRjaCkge1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVudXNlZC12YXJzXG4gICAgICBjb25zdCBbXywgbmFtZSwgZW1haWxdID0gbWF0Y2g7XG4gICAgICBjb0F1dGhvcnMucHVzaChuZXcgQXV0aG9yKGVtYWlsLCBuYW1lKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1lc3NhZ2VMaW5lcy5wdXNoKGxpbmUpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7bWVzc2FnZTogbWVzc2FnZUxpbmVzLmpvaW4oJ1xcbicpLCBjb0F1dGhvcnN9O1xufVxuXG4vLyBBdG9tIEFQSSBwYW5lIGl0ZW0gbWFuaXB1bGF0aW9uXG5cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVJdGVtKG5vZGUsIGNvbXBvbmVudEhvbGRlciA9IG51bGwsIHVyaSA9IG51bGwsIGV4dHJhID0ge30pIHtcbiAgY29uc3QgaG9sZGVyID0gY29tcG9uZW50SG9sZGVyIHx8IG5ldyBSZWZIb2xkZXIoKTtcblxuICBjb25zdCBvdmVycmlkZSA9IHtcbiAgICBnZXRFbGVtZW50OiAoKSA9PiBub2RlLFxuXG4gICAgZ2V0UmVhbEl0ZW06ICgpID0+IGhvbGRlci5nZXRPcihudWxsKSxcblxuICAgIGdldFJlYWxJdGVtUHJvbWlzZTogKCkgPT4gaG9sZGVyLmdldFByb21pc2UoKSxcblxuICAgIC4uLmV4dHJhLFxuICB9O1xuXG4gIGlmICh1cmkpIHtcbiAgICBvdmVycmlkZS5nZXRVUkkgPSAoKSA9PiB1cmk7XG4gIH1cblxuICBpZiAoY29tcG9uZW50SG9sZGVyKSB7XG4gICAgcmV0dXJuIG5ldyBQcm94eShvdmVycmlkZSwge1xuICAgICAgZ2V0KHRhcmdldCwgbmFtZSkge1xuICAgICAgICBpZiAoUmVmbGVjdC5oYXModGFyZ2V0LCBuYW1lKSkge1xuICAgICAgICAgIHJldHVybiB0YXJnZXRbbmFtZV07XG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUge3ZhbHVlOiAuLi59IHdyYXBwZXIgcHJldmVudHMgLm1hcCgpIGZyb20gZmxhdHRlbmluZyBhIHJldHVybmVkIFJlZkhvbGRlci5cbiAgICAgICAgLy8gSWYgY29tcG9uZW50W25hbWVdIGlzIGEgUmVmSG9sZGVyLCB3ZSB3YW50IHRvIHJldHVybiB0aGF0IFJlZkhvbGRlciBhcy1pcy5cbiAgICAgICAgY29uc3Qge3ZhbHVlfSA9IGhvbGRlci5tYXAoY29tcG9uZW50ID0+ICh7dmFsdWU6IGNvbXBvbmVudFtuYW1lXX0pKS5nZXRPcih7dmFsdWU6IHVuZGVmaW5lZH0pO1xuICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICB9LFxuXG4gICAgICBzZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSkge1xuICAgICAgICByZXR1cm4gaG9sZGVyLm1hcChjb21wb25lbnQgPT4ge1xuICAgICAgICAgIGNvbXBvbmVudFtuYW1lXSA9IHZhbHVlO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9KS5nZXRPcih0cnVlKTtcbiAgICAgIH0sXG5cbiAgICAgIGhhcyh0YXJnZXQsIG5hbWUpIHtcbiAgICAgICAgcmV0dXJuIGhvbGRlci5tYXAoY29tcG9uZW50ID0+IFJlZmxlY3QuaGFzKGNvbXBvbmVudCwgbmFtZSkpLmdldE9yKGZhbHNlKSB8fCBSZWZsZWN0Lmhhcyh0YXJnZXQsIG5hbWUpO1xuICAgICAgfSxcbiAgICB9KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gb3ZlcnJpZGU7XG4gIH1cbn1cblxuLy8gU2V0IGZ1bmN0aW9uc1xuXG5leHBvcnQgZnVuY3Rpb24gZXF1YWxTZXRzKGxlZnQsIHJpZ2h0KSB7XG4gIGlmIChsZWZ0LnNpemUgIT09IHJpZ2h0LnNpemUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBmb3IgKGNvbnN0IGVhY2ggb2YgbGVmdCkge1xuICAgIGlmICghcmlnaHQuaGFzKGVhY2gpKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8vIENvbnN0YW50c1xuXG5leHBvcnQgY29uc3QgTkJTUF9DSEFSQUNURVIgPSAnXFx1MDBhMCc7XG5cbmV4cG9ydCBmdW5jdGlvbiBibGFua0xhYmVsKCkge1xuICByZXR1cm4gTkJTUF9DSEFSQUNURVI7XG59XG5cbmV4cG9ydCBjb25zdCByZWFjdGlvblR5cGVUb0Vtb2ppID0ge1xuICBUSFVNQlNfVVA6ICfwn5GNJyxcbiAgVEhVTUJTX0RPV046ICfwn5GOJyxcbiAgTEFVR0g6ICfwn5iGJyxcbiAgSE9PUkFZOiAn8J+OiScsXG4gIENPTkZVU0VEOiAn8J+YlScsXG4gIEhFQVJUOiAn4p2k77iPJyxcbiAgUk9DS0VUOiAn8J+agCcsXG4gIEVZRVM6ICfwn5GAJyxcbn07XG5cbi8vIE1hcmtkb3duXG5cbmxldCBtYXJrZWQgPSBudWxsO1xubGV0IGRvbVB1cmlmeSA9IG51bGw7XG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJNYXJrZG93bihtZCkge1xuICBpZiAobWFya2VkID09PSBudWxsKSB7XG4gICAgbWFya2VkID0gcmVxdWlyZSgnbWFya2VkJyk7XG5cbiAgICBpZiAoZG9tUHVyaWZ5ID09PSBudWxsKSB7XG4gICAgICBjb25zdCBjcmVhdGVET01QdXJpZnkgPSByZXF1aXJlKCdkb21wdXJpZnknKTtcbiAgICAgIGRvbVB1cmlmeSA9IGNyZWF0ZURPTVB1cmlmeSgpO1xuICAgIH1cblxuICAgIG1hcmtlZC5zZXRPcHRpb25zKHtcbiAgICAgIHNpbGVudDogdHJ1ZSxcbiAgICAgIHNhbml0aXplOiB0cnVlLFxuICAgICAgc2FuaXRpemVyOiBodG1sID0+IGRvbVB1cmlmeS5zYW5pdGl6ZShodG1sKSxcbiAgICB9KTtcbiAgfVxuXG4gIHJldHVybiBtYXJrZWQobWQpO1xufVxuXG5leHBvcnQgY29uc3QgR0hPU1RfVVNFUiA9IHtcbiAgbG9naW46ICdnaG9zdCcsXG4gIGF2YXRhclVybDogJ2h0dHBzOi8vYXZhdGFyczEuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3UvMTAxMzc/dj00JyxcbiAgdXJsOiAnaHR0cHM6Ly9naXRodWIuY29tL2dob3N0Jyxcbn07XG4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSxJQUFBQSxLQUFBLEdBQUFDLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBQyxRQUFBLEdBQUFGLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBRSxHQUFBLEdBQUFILHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBRyxLQUFBLEdBQUFKLHNCQUFBLENBQUFDLE9BQUE7QUFFQSxJQUFBSSxVQUFBLEdBQUFMLHNCQUFBLENBQUFDLE9BQUE7QUFDQSxJQUFBSyxPQUFBLEdBQUFOLHNCQUFBLENBQUFDLE9BQUE7QUFBcUMsU0FBQUQsdUJBQUFPLEdBQUEsV0FBQUEsR0FBQSxJQUFBQSxHQUFBLENBQUFDLFVBQUEsR0FBQUQsR0FBQSxLQUFBRSxPQUFBLEVBQUFGLEdBQUE7QUFBQSxTQUFBRyxRQUFBQyxNQUFBLEVBQUFDLGNBQUEsUUFBQUMsSUFBQSxHQUFBQyxNQUFBLENBQUFELElBQUEsQ0FBQUYsTUFBQSxPQUFBRyxNQUFBLENBQUFDLHFCQUFBLFFBQUFDLE9BQUEsR0FBQUYsTUFBQSxDQUFBQyxxQkFBQSxDQUFBSixNQUFBLEdBQUFDLGNBQUEsS0FBQUksT0FBQSxHQUFBQSxPQUFBLENBQUFDLE1BQUEsV0FBQUMsR0FBQSxXQUFBSixNQUFBLENBQUFLLHdCQUFBLENBQUFSLE1BQUEsRUFBQU8sR0FBQSxFQUFBRSxVQUFBLE9BQUFQLElBQUEsQ0FBQVEsSUFBQSxDQUFBQyxLQUFBLENBQUFULElBQUEsRUFBQUcsT0FBQSxZQUFBSCxJQUFBO0FBQUEsU0FBQVUsY0FBQUMsTUFBQSxhQUFBQyxDQUFBLE1BQUFBLENBQUEsR0FBQUMsU0FBQSxDQUFBQyxNQUFBLEVBQUFGLENBQUEsVUFBQUcsTUFBQSxXQUFBRixTQUFBLENBQUFELENBQUEsSUFBQUMsU0FBQSxDQUFBRCxDQUFBLFFBQUFBLENB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