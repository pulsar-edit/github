"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PAGINATION_WAIT_TIME_MS = exports.PAGE_SIZE = exports.NBSP_CHARACTER = exports.LINE_ENDING_REGEX = exports.GHOST_USER = exports.CO_AUTHOR_REGEX = exports.CHECK_SUITE_PAGE_SIZE = exports.CHECK_RUN_PAGE_SIZE = void 0;
exports.autobind = autobind;
exports.blankLabel = blankLabel;
exports.classNameForStatus = void 0;
exports.createItem = createItem;
exports.destroyEmptyFilePatchPaneItems = destroyEmptyFilePatchPaneItems;
exports.destroyFilePatchPaneItems = destroyFilePatchPaneItems;
exports.equalSets = equalSets;
exports.extractCoAuthorsAndRawCommitMessage = extractCoAuthorsAndRawCommitMessage;
exports.extractProps = extractProps;
exports.fileExists = fileExists;
exports.filePathEndsWith = filePathEndsWith;
exports.firstImplementer = firstImplementer;
exports.getAtomHelperPath = getAtomHelperPath;
exports.getCommitMessageEditors = getCommitMessageEditors;
exports.getCommitMessagePath = getCommitMessagePath;
exports.getDugitePath = getDugitePath;
exports.getFilePatchPaneItems = getFilePatchPaneItems;
exports.getPackageRoot = getPackageRoot;
exports.getSharedModulePath = getSharedModulePath;
exports.getTempDir = getTempDir;
exports.isBinary = isBinary;
exports.isFileExecutable = isFileExecutable;
exports.isFileSymlink = isFileSymlink;
exports.isValidWorkdir = isValidWorkdir;
exports.normalizeGitHelperPath = normalizeGitHelperPath;
exports.pushAtKey = pushAtKey;
exports.reactionTypeToEmoji = void 0;
exports.renderMarkdown = renderMarkdown;
exports.shortenSha = shortenSha;
exports.toGitPathSep = toGitPathSep;
exports.toNativePathSep = toNativePathSep;
exports.toSentence = toSentence;
exports.unusedProps = unusedProps;

var _path = _interopRequireDefault(require("path"));

var _fsExtra = _interopRequireDefault(require("fs-extra"));

var _os = _interopRequireDefault(require("os"));

var _temp = _interopRequireDefault(require("temp"));

var _refHolder = _interopRequireDefault(require("./models/ref-holder"));

var _author = _interopRequireDefault(require("./models/author"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
} // Extract a subset of props chosen from a propTypes object from a component's props to pass to a different API.
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
} // The opposite of extractProps. Return a subset of props that do *not* appear in a component's prop types.


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
  const match = atom.getVersion().match(/-([A-Za-z]+)(\d+|-)/);

  if (match) {
    const channel = match[1];
    return `Atom ${channel.charAt(0).toUpperCase() + channel.slice(1)} Helper`;
  }

  return 'Atom Helper';
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
    const code = data.charCodeAt(i); // Char code 65533 is the "replacement character";
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
} // Repository and workspace helpers


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
} // Atom API pane item manipulation


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
        } // The {value: ...} wrapper prevents .map() from flattening a returned RefHolder.
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
} // Set functions


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
} // Constants


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
}; // Markdown

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9oZWxwZXJzLmpzIl0sIm5hbWVzIjpbIkxJTkVfRU5ESU5HX1JFR0VYIiwiQ09fQVVUSE9SX1JFR0VYIiwiUEFHRV9TSVpFIiwiUEFHSU5BVElPTl9XQUlUX1RJTUVfTVMiLCJDSEVDS19TVUlURV9QQUdFX1NJWkUiLCJDSEVDS19SVU5fUEFHRV9TSVpFIiwiYXV0b2JpbmQiLCJzZWxmIiwibWV0aG9kcyIsIm1ldGhvZCIsIkVycm9yIiwiYmluZCIsImV4dHJhY3RQcm9wcyIsInByb3BzIiwicHJvcFR5cGVzIiwibmFtZU1hcCIsIk9iamVjdCIsImtleXMiLCJyZWR1Y2UiLCJvcHRzIiwicHJvcE5hbWUiLCJ1bmRlZmluZWQiLCJkZXN0UHJvcE5hbWUiLCJ1bnVzZWRQcm9wcyIsImdldFBhY2thZ2VSb290IiwicmVzb3VyY2VQYXRoIiwiYXRvbSIsImdldExvYWRTZXR0aW5ncyIsImN1cnJlbnRGaWxlV2FzUmVxdWlyZWRGcm9tU25hcHNob3QiLCJwYXRoIiwiaXNBYnNvbHV0ZSIsIl9fZGlybmFtZSIsImpvaW4iLCJwYWNrYWdlUm9vdCIsInJlc29sdmUiLCJleHRuYW1lIiwiaW5kZXhPZiIsImdldEF0b21BcHBOYW1lIiwibWF0Y2giLCJnZXRWZXJzaW9uIiwiY2hhbm5lbCIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJnZXRBdG9tSGVscGVyUGF0aCIsInByb2Nlc3MiLCJwbGF0Zm9ybSIsImFwcE5hbWUiLCJyZXNvdXJjZXNQYXRoIiwiZXhlY1BhdGgiLCJEVUdJVEVfUEFUSCIsImdldER1Z2l0ZVBhdGgiLCJyZXF1aXJlIiwiU0hBUkVEX01PRFVMRV9QQVRIUyIsIk1hcCIsImdldFNoYXJlZE1vZHVsZVBhdGgiLCJyZWxQYXRoIiwibW9kdWxlUGF0aCIsImdldCIsInNldCIsImlzQmluYXJ5IiwiZGF0YSIsImkiLCJjb2RlIiwiY2hhckNvZGVBdCIsImRlc2NyaXB0b3JzRnJvbVByb3RvIiwicHJvdG8iLCJnZXRPd25Qcm9wZXJ0eU5hbWVzIiwiYWNjIiwibmFtZSIsImFzc2lnbiIsIlJlZmxlY3QiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJmaXJzdEltcGxlbWVudGVyIiwidGFyZ2V0cyIsIlByb3h5IiwiX19pbXBsZW1lbnRhdGlvbnMiLCJ0YXJnZXQiLCJoYXMiLCJmaXJzdFZhbGlkVGFyZ2V0IiwiZmluZCIsInQiLCJ2YWx1ZSIsInNvbWUiLCJjb21wb3NpdGVPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJnZXRQcm90b3R5cGVPZiIsInJlZHVjZVJpZ2h0IiwiY3JlYXRlIiwicHJvdG90eXBlIiwiaXNSb290IiwiZGlyIiwiaXNWYWxpZFdvcmtkaXIiLCJvcyIsImhvbWVkaXIiLCJmaWxlRXhpc3RzIiwiYWJzb2x1dGVGaWxlUGF0aCIsImZzIiwiYWNjZXNzIiwiZSIsImdldFRlbXBEaXIiLCJvcHRpb25zIiwidGVtcCIsInRyYWNrIiwiUHJvbWlzZSIsInJlamVjdCIsIm1rZGlyIiwidGVtcEVycm9yIiwiZm9sZGVyIiwic3ltbGlua09rIiwicmVhbHBhdGgiLCJyZWFsRXJyb3IiLCJycGF0aCIsImlzRmlsZUV4ZWN1dGFibGUiLCJzdGF0IiwibW9kZSIsImNvbnN0YW50cyIsIlNfSVhVU1IiLCJpc0ZpbGVTeW1saW5rIiwibHN0YXQiLCJpc1N5bWJvbGljTGluayIsInNob3J0ZW5TaGEiLCJzaGEiLCJjbGFzc05hbWVGb3JTdGF0dXMiLCJhZGRlZCIsImRlbGV0ZWQiLCJtb2RpZmllZCIsInR5cGVjaGFuZ2UiLCJlcXVpdmFsZW50Iiwibm9ybWFsaXplR2l0SGVscGVyUGF0aCIsImluUGF0aCIsInJlcGxhY2UiLCJ0b05hdGl2ZVBhdGhTZXAiLCJyYXdQYXRoIiwic3BsaXQiLCJzZXAiLCJ0b0dpdFBhdGhTZXAiLCJmaWxlUGF0aEVuZHNXaXRoIiwiZmlsZVBhdGgiLCJzZWdtZW50cyIsImVuZHNXaXRoIiwidG9TZW50ZW5jZSIsImFycmF5IiwibGVuIiwibGVuZ3RoIiwiaXRlbSIsImlkeCIsInB1c2hBdEtleSIsIm1hcCIsImtleSIsImV4aXN0aW5nIiwicHVzaCIsImdldENvbW1pdE1lc3NhZ2VQYXRoIiwicmVwb3NpdG9yeSIsImdldEdpdERpcmVjdG9yeVBhdGgiLCJnZXRDb21taXRNZXNzYWdlRWRpdG9ycyIsIndvcmtzcGFjZSIsImlzUHJlc2VudCIsImdldFRleHRFZGl0b3JzIiwiZmlsdGVyIiwiZWRpdG9yIiwiZ2V0UGF0aCIsIkNoYW5nZWRGaWxlSXRlbSIsImdldEZpbGVQYXRjaFBhbmVJdGVtcyIsIm9ubHlTdGFnZWQiLCJlbXB0eSIsImRlZmF1bHQiLCJnZXRQYW5lSXRlbXMiLCJpc0ZpbGVQYXRjaEl0ZW0iLCJnZXRSZWFsSXRlbSIsInN0YWdpbmdTdGF0dXMiLCJpc0VtcHR5IiwiZGVzdHJveUZpbGVQYXRjaFBhbmVJdGVtcyIsIml0ZW1zVG9EZXN0cm95IiwiZm9yRWFjaCIsImRlc3Ryb3kiLCJkZXN0cm95RW1wdHlGaWxlUGF0Y2hQYW5lSXRlbXMiLCJleHRyYWN0Q29BdXRob3JzQW5kUmF3Q29tbWl0TWVzc2FnZSIsImNvbW1pdE1lc3NhZ2UiLCJtZXNzYWdlTGluZXMiLCJjb0F1dGhvcnMiLCJsaW5lIiwiXyIsImVtYWlsIiwiQXV0aG9yIiwibWVzc2FnZSIsImNyZWF0ZUl0ZW0iLCJub2RlIiwiY29tcG9uZW50SG9sZGVyIiwidXJpIiwiZXh0cmEiLCJob2xkZXIiLCJSZWZIb2xkZXIiLCJvdmVycmlkZSIsImdldEVsZW1lbnQiLCJnZXRPciIsImdldFJlYWxJdGVtUHJvbWlzZSIsImdldFByb21pc2UiLCJnZXRVUkkiLCJjb21wb25lbnQiLCJlcXVhbFNldHMiLCJsZWZ0IiwicmlnaHQiLCJzaXplIiwiZWFjaCIsIk5CU1BfQ0hBUkFDVEVSIiwiYmxhbmtMYWJlbCIsInJlYWN0aW9uVHlwZVRvRW1vamkiLCJUSFVNQlNfVVAiLCJUSFVNQlNfRE9XTiIsIkxBVUdIIiwiSE9PUkFZIiwiQ09ORlVTRUQiLCJIRUFSVCIsIlJPQ0tFVCIsIkVZRVMiLCJtYXJrZWQiLCJkb21QdXJpZnkiLCJyZW5kZXJNYXJrZG93biIsIm1kIiwiY3JlYXRlRE9NUHVyaWZ5Iiwic2V0T3B0aW9ucyIsInNpbGVudCIsInNhbml0aXplIiwic2FuaXRpemVyIiwiaHRtbCIsIkdIT1NUX1VTRVIiLCJsb2dpbiIsImF2YXRhclVybCIsInVybCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOztBQUVBOztBQUNBOzs7Ozs7Ozs7O0FBRU8sTUFBTUEsaUJBQWlCLEdBQUcsT0FBMUI7O0FBQ0EsTUFBTUMsZUFBZSxHQUFHLGtDQUF4Qjs7QUFDQSxNQUFNQyxTQUFTLEdBQUcsRUFBbEI7O0FBQ0EsTUFBTUMsdUJBQXVCLEdBQUcsR0FBaEM7O0FBQ0EsTUFBTUMscUJBQXFCLEdBQUcsRUFBOUI7O0FBQ0EsTUFBTUMsbUJBQW1CLEdBQUcsRUFBNUI7OztBQUVBLFNBQVNDLFFBQVQsQ0FBa0JDLElBQWxCLEVBQXdCLEdBQUdDLE9BQTNCLEVBQW9DO0FBQ3pDLE9BQUssTUFBTUMsTUFBWCxJQUFxQkQsT0FBckIsRUFBOEI7QUFDNUIsUUFBSSxPQUFPRCxJQUFJLENBQUNFLE1BQUQsQ0FBWCxLQUF3QixVQUE1QixFQUF3QztBQUN0QyxZQUFNLElBQUlDLEtBQUosQ0FBVyw2QkFBNEJELE1BQU8sRUFBOUMsQ0FBTjtBQUNEOztBQUNERixJQUFBQSxJQUFJLENBQUNFLE1BQUQsQ0FBSixHQUFlRixJQUFJLENBQUNFLE1BQUQsQ0FBSixDQUFhRSxJQUFiLENBQWtCSixJQUFsQixDQUFmO0FBQ0Q7QUFDRixDLENBRUQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBQ08sU0FBU0ssWUFBVCxDQUFzQkMsS0FBdEIsRUFBNkJDLFNBQTdCLEVBQXdDQyxPQUFPLEdBQUcsRUFBbEQsRUFB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QUd2SyxPQUFPLENBQUMsV0FBRCxDQUEvQjs7QUFDQW9LLE1BQUFBLFNBQVMsR0FBR0csZUFBZSxFQUEzQjtBQUNEOztBQUVESixJQUFBQSxNQUFNLENBQUNLLFVBQVAsQ0FBa0I7QUFDaEJDLE1BQUFBLE1BQU0sRUFBRSxJQURRO0FBRWhCQyxNQUFBQSxRQUFRLEVBQUUsSUFGTTtBQUdoQkMsTUFBQUEsU0FBUyxFQUFFQyxJQUFJLElBQUlSLFNBQVMsQ0FBQ00sUUFBVixDQUFtQkUsSUFBbkI7QUFISCxLQUFsQjtBQUtEOztBQUVELFNBQU9ULE1BQU0sQ0FBQ0csRUFBRCxDQUFiO0FBQ0Q7O0FBRU0sTUFBTU8sVUFBVSxHQUFHO0FBQ3hCQyxFQUFBQSxLQUFLLEVBQUUsT0FEaUI7QUFFeEJDLEVBQUFBLFNBQVMsRUFBRSxvREFGYTtBQUd4QkMsRUFBQUEsR0FBRyxFQUFFO0FBSG1CLENBQW5CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgZnMgZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IG9zIGZyb20gJ29zJztcbmltcG9ydCB0ZW1wIGZyb20gJ3RlbXAnO1xuXG5pbXBvcnQgUmVmSG9sZGVyIGZyb20gJy4vbW9kZWxzL3JlZi1ob2xkZXInO1xuaW1wb3J0IEF1dGhvciBmcm9tICcuL21vZGVscy9hdXRob3InO1xuXG5leHBvcnQgY29uc3QgTElORV9FTkRJTkdfUkVHRVggPSAvXFxyP1xcbi87XG5leHBvcnQgY29uc3QgQ09fQVVUSE9SX1JFR0VYID0gL15jby1hdXRob3JlZC1ieS4gKC4rPykgPCguKz8pPiQvaTtcbmV4cG9ydCBjb25zdCBQQUdFX1NJWkUgPSA1MDtcbmV4cG9ydCBjb25zdCBQQUdJTkFUSU9OX1dBSVRfVElNRV9NUyA9IDEwMDtcbmV4cG9ydCBjb25zdCBDSEVDS19TVUlURV9QQUdFX1NJWkUgPSAxMDtcbmV4cG9ydCBjb25zdCBDSEVDS19SVU5fUEFHRV9TSVpFID0gMjA7XG5cbmV4cG9ydCBmdW5jdGlvbiBhdXRvYmluZChzZWxmLCAuLi5tZXRob2RzKSB7XG4gIGZvciAoY29uc3QgbWV0aG9kIG9mIG1ldGhvZHMpIHtcbiAgICBpZiAodHlwZW9mIHNlbGZbbWV0aG9kXSAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmFibGUgdG8gYXV0b2JpbmQgbWV0aG9kICR7bWV0aG9kfWApO1xuICAgIH1cbiAgICBzZWxmW21ldGhvZF0gPSBzZWxmW21ldGhvZF0uYmluZChzZWxmKTtcbiAgfVxufVxuXG4vLyBFeHRyYWN0IGEgc3Vic2V0IG9mIHByb3BzIGNob3NlbiBmcm9tIGEgcHJvcFR5cGVzIG9iamVjdCBmcm9tIGEgY29tcG9uZW50J3MgcHJvcHMgdG8gcGFzcyB0byBhIGRpZmZlcmVudCBBUEkuXG4vL1xuLy8gVXNhZ2U6XG4vL1xuLy8gYGBganNcbi8vIGNvbnN0IGFwaVByb3BzID0ge1xuLy8gICB6ZXJvOiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4vLyAgIG9uZTogUHJvcFR5cGVzLnN0cmluZyxcbi8vICAgdHdvOiBQcm9wVHlwZXMub2JqZWN0LFxuLy8gfTtcbi8vXG4vLyBjbGFzcyBDb21wb25lbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQge1xuLy8gICBzdGF0aWMgcHJvcFR5cGVzID0ge1xuLy8gICAgIC4uLmFwaVByb3BzLFxuLy8gICAgIGV4dHJhOiBQcm9wVHlwZXMuZnVuYyxcbi8vICAgfVxuLy9cbi8vICAgYWN0aW9uKCkge1xuLy8gICAgIGNvbnN0IG9wdGlvbnMgPSBleHRyYWN0UHJvcHModGhpcy5wcm9wcywgYXBpUHJvcHMpO1xuLy8gICAgIC8vIG9wdGlvbnMgY29udGFpbnMgemVybywgb25lLCBhbmQgdHdvLCBidXQgbm90IGV4dHJhXG4vLyAgIH1cbi8vIH1cbi8vIGBgYFxuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RQcm9wcyhwcm9wcywgcHJvcFR5cGVzLCBuYW1lTWFwID0ge30pIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHByb3BUeXBlcykucmVkdWNlKChvcHRzLCBwcm9wTmFtZSkgPT4ge1xuICAgIGlmIChwcm9wc1twcm9wTmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgY29uc3QgZGVzdFByb3BOYW1lID0gbmFtZU1hcFtwcm9wTmFtZV0gfHwgcHJvcE5hbWU7XG4gICAgICBvcHRzW2Rlc3RQcm9wTmFtZV0gPSBwcm9wc1twcm9wTmFtZV07XG4gICAgfVxuICAgIHJldHVybiBvcHRzO1xuICB9LCB7fSk7XG59XG5cbi8vIFRoZSBvcHBvc2l0ZSBvZiBleHRyYWN0UHJvcHMuIFJldHVybiBhIHN1YnNldCBvZiBwcm9wcyB0aGF0IGRvICpub3QqIGFwcGVhciBpbiBhIGNvbXBvbmVudCdzIHByb3AgdHlwZXMuXG5leHBvcnQgZnVuY3Rpb24gdW51c2VkUHJvcHMocHJvcHMsIHByb3BUeXBlcykge1xuICByZXR1cm4gT2JqZWN0LmtleXMocHJvcHMpLnJlZHVjZSgob3B0cywgcHJvcE5hbWUpID0+IHtcbiAgICBpZiAocHJvcFR5cGVzW3Byb3BOYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBvcHRzW3Byb3BOYW1lXSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICB9XG4gICAgcmV0dXJuIG9wdHM7XG4gIH0sIHt9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFBhY2thZ2VSb290KCkge1xuICBjb25zdCB7cmVzb3VyY2VQYXRofSA9IGF0b20uZ2V0TG9hZFNldHRpbmdzKCk7XG4gIGNvbnN0IGN1cnJlbnRGaWxlV2FzUmVxdWlyZWRGcm9tU25hcHNob3QgPSAhcGF0aC5pc0Fic29sdXRlKF9fZGlybmFtZSk7XG4gIGlmIChjdXJyZW50RmlsZVdhc1JlcXVpcmVkRnJvbVNuYXBzaG90KSB7XG4gICAgcmV0dXJuIHBhdGguam9pbihyZXNvdXJjZVBhdGgsICdub2RlX21vZHVsZXMnLCAnZ2l0aHViJyk7XG4gIH0gZWxzZSB7XG4gICAgY29uc3QgcGFja2FnZVJvb3QgPSBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi4nKTtcbiAgICBpZiAocGF0aC5leHRuYW1lKHJlc291cmNlUGF0aCkgPT09ICcuYXNhcicpIHtcbiAgICAgIGlmIChwYWNrYWdlUm9vdC5pbmRleE9mKHJlc291cmNlUGF0aCkgPT09IDApIHtcbiAgICAgICAgcmV0dXJuIHBhdGguam9pbihgJHtyZXNvdXJjZVBhdGh9LnVucGFja2VkYCwgJ25vZGVfbW9kdWxlcycsICdnaXRodWInKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHBhY2thZ2VSb290O1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldEF0b21BcHBOYW1lKCkge1xuICBjb25zdCBtYXRjaCA9IGF0b20uZ2V0VmVyc2lvbigpLm1hdGNoKC8tKFtBLVphLXpdKykoXFxkK3wtKS8pO1xuICBpZiAobWF0Y2gpIHtcbiAgICBjb25zdCBjaGFubmVsID0gbWF0Y2hbMV07XG4gICAgcmV0dXJuIGBBdG9tICR7Y2hhbm5lbC5jaGFyQXQoMCkudG9VcHBlckNhc2UoKSArIGNoYW5uZWwuc2xpY2UoMSl9IEhlbHBlcmA7XG4gIH1cblxuICByZXR1cm4gJ0F0b20gSGVscGVyJztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldEF0b21IZWxwZXJQYXRoKCkge1xuICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ2RhcndpbicpIHtcbiAgICBjb25zdCBhcHBOYW1lID0gZ2V0QXRvbUFwcE5hbWUoKTtcbiAgICByZXR1cm4gcGF0aC5yZXNvbHZlKHByb2Nlc3MucmVzb3VyY2VzUGF0aCwgJy4uJywgJ0ZyYW1ld29ya3MnLFxuICAgICAgYCR7YXBwTmFtZX0uYXBwYCwgJ0NvbnRlbnRzJywgJ01hY09TJywgYXBwTmFtZSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHByb2Nlc3MuZXhlY1BhdGg7XG4gIH1cbn1cblxubGV0IERVR0lURV9QQVRIO1xuZXhwb3J0IGZ1bmN0aW9uIGdldER1Z2l0ZVBhdGgoKSB7XG4gIGlmICghRFVHSVRFX1BBVEgpIHtcbiAgICBEVUdJVEVfUEFUSCA9IHJlcXVpcmUucmVzb2x2ZSgnZHVnaXRlJyk7XG4gICAgaWYgKCFwYXRoLmlzQWJzb2x1dGUoRFVHSVRFX1BBVEgpKSB7XG4gICAgICAvLyBBc3N1bWUgd2UncmUgc25hcHNob3R0ZWRcbiAgICAgIGNvbnN0IHtyZXNvdXJjZVBhdGh9ID0gYXRvbS5nZXRMb2FkU2V0dGluZ3MoKTtcbiAgICAgIGlmIChwYXRoLmV4dG5hbWUocmVzb3VyY2VQYXRoKSA9PT0gJy5hc2FyJykge1xuICAgICAgICBEVUdJVEVfUEFUSCA9IHBhdGguam9pbihgJHtyZXNvdXJjZVBhdGh9LnVucGFja2VkYCwgJ25vZGVfbW9kdWxlcycsICdkdWdpdGUnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIERVR0lURV9QQVRIID0gcGF0aC5qb2luKHJlc291cmNlUGF0aCwgJ25vZGVfbW9kdWxlcycsICdkdWdpdGUnKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gRFVHSVRFX1BBVEg7XG59XG5cbmNvbnN0IFNIQVJFRF9NT0RVTEVfUEFUSFMgPSBuZXcgTWFwKCk7XG5leHBvcnQgZnVuY3Rpb24gZ2V0U2hhcmVkTW9kdWxlUGF0aChyZWxQYXRoKSB7XG4gIGxldCBtb2R1bGVQYXRoID0gU0hBUkVEX01PRFVMRV9QQVRIUy5nZXQocmVsUGF0aCk7XG4gIGlmICghbW9kdWxlUGF0aCkge1xuICAgIG1vZHVsZVBhdGggPSByZXF1aXJlLnJlc29sdmUocGF0aC5qb2luKF9fZGlybmFtZSwgJ3NoYXJlZCcsIHJlbFBhdGgpKTtcbiAgICBpZiAoIXBhdGguaXNBYnNvbHV0ZShtb2R1bGVQYXRoKSkge1xuICAgICAgLy8gQXNzdW1lIHdlJ3JlIHNuYXBzaG90dGVkXG4gICAgICBjb25zdCB7cmVzb3VyY2VQYXRofSA9IGF0b20uZ2V0TG9hZFNldHRpbmdzKCk7XG4gICAgICBtb2R1bGVQYXRoID0gcGF0aC5qb2luKHJlc291cmNlUGF0aCwgbW9kdWxlUGF0aCk7XG4gICAgfVxuXG4gICAgU0hBUkVEX01PRFVMRV9QQVRIUy5zZXQocmVsUGF0aCwgbW9kdWxlUGF0aCk7XG4gIH1cblxuICByZXR1cm4gbW9kdWxlUGF0aDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzQmluYXJ5KGRhdGEpIHtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCA1MDsgaSsrKSB7XG4gICAgY29uc3QgY29kZSA9IGRhdGEuY2hhckNvZGVBdChpKTtcbiAgICAvLyBDaGFyIGNvZGUgNjU1MzMgaXMgdGhlIFwicmVwbGFjZW1lbnQgY2hhcmFjdGVyXCI7XG4gICAgLy8gOCBhbmQgYmVsb3cgYXJlIGNvbnRyb2wgY2hhcmFjdGVycy5cbiAgICBpZiAoY29kZSA9PT0gNjU1MzMgfHwgY29kZSA8IDkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmYWxzZTtcbn1cblxuZnVuY3Rpb24gZGVzY3JpcHRvcnNGcm9tUHJvdG8ocHJvdG8pIHtcbiAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHByb3RvKS5yZWR1Y2UoKGFjYywgbmFtZSkgPT4ge1xuICAgIE9iamVjdC5hc3NpZ24oYWNjLCB7XG4gICAgICBbbmFtZV06IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHByb3RvLCBuYW1lKSxcbiAgICB9KTtcbiAgICByZXR1cm4gYWNjO1xuICB9LCB7fSk7XG59XG5cbi8qKlxuICogVGFrZXMgYW4gYXJyYXkgb2YgdGFyZ2V0cyBhbmQgcmV0dXJucyBhIHByb3h5LiBUaGUgcHJveHkgaW50ZXJjZXB0cyBwcm9wZXJ0eSBhY2Nlc3NvciBjYWxscyBhbmRcbiAqIHJldHVybnMgdGhlIHZhbHVlIG9mIHRoYXQgcHJvcGVydHkgb24gdGhlIGZpcnN0IG9iamVjdCBpbiBgdGFyZ2V0c2Agd2hlcmUgdGhlIHRhcmdldCBpbXBsZW1lbnRzIHRoYXQgcHJvcGVydHkuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBmaXJzdEltcGxlbWVudGVyKC4uLnRhcmdldHMpIHtcbiAgcmV0dXJuIG5ldyBQcm94eSh7X19pbXBsZW1lbnRhdGlvbnM6IHRhcmdldHN9LCB7XG4gICAgZ2V0KHRhcmdldCwgbmFtZSkge1xuICAgICAgaWYgKG5hbWUgPT09ICdnZXRJbXBsZW1lbnRlcnMnKSB7XG4gICAgICAgIHJldHVybiAoKSA9PiB0YXJnZXRzO1xuICAgICAgfVxuXG4gICAgICBpZiAoUmVmbGVjdC5oYXModGFyZ2V0LCBuYW1lKSkge1xuICAgICAgICByZXR1cm4gdGFyZ2V0W25hbWVdO1xuICAgICAgfVxuXG4gICAgICBjb25zdCBmaXJzdFZhbGlkVGFyZ2V0ID0gdGFyZ2V0cy5maW5kKHQgPT4gUmVmbGVjdC5oYXModCwgbmFtZSkpO1xuICAgICAgaWYgKGZpcnN0VmFsaWRUYXJnZXQpIHtcbiAgICAgICAgcmV0dXJuIGZpcnN0VmFsaWRUYXJnZXRbbmFtZV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICBzZXQodGFyZ2V0LCBuYW1lLCB2YWx1ZSkge1xuICAgICAgY29uc3QgZmlyc3RWYWxpZFRhcmdldCA9IHRhcmdldHMuZmluZCh0ID0+IFJlZmxlY3QuaGFzKHQsIG5hbWUpKTtcbiAgICAgIGlmIChmaXJzdFZhbGlkVGFyZ2V0KSB7XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1yZXR1cm4tYXNzaWduXG4gICAgICAgIHJldHVybiBmaXJzdFZhbGlkVGFyZ2V0W25hbWVdID0gdmFsdWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmV0dXJuLWFzc2lnblxuICAgICAgICByZXR1cm4gdGFyZ2V0W25hbWVdID0gdmFsdWU7XG4gICAgICB9XG4gICAgfSxcblxuICAgIC8vIFVzZWQgYnkgc2lub25cbiAgICBoYXModGFyZ2V0LCBuYW1lKSB7XG4gICAgICBpZiAobmFtZSA9PT0gJ2dldEltcGxlbWVudGVycycpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0YXJnZXRzLnNvbWUodCA9PiBSZWZsZWN0Lmhhcyh0LCBuYW1lKSk7XG4gICAgfSxcblxuICAgIC8vIFVzZWQgYnkgc2lub25cbiAgICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBuYW1lKSB7XG4gICAgICBjb25zdCBmaXJzdFZhbGlkVGFyZ2V0ID0gdGFyZ2V0cy5maW5kKHQgPT4gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodCwgbmFtZSkpO1xuICAgICAgY29uc3QgY29tcG9zaXRlT3duUHJvcGVydHlEZXNjcmlwdG9yID0gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodGFyZ2V0LCBuYW1lKTtcbiAgICAgIGlmIChmaXJzdFZhbGlkVGFyZ2V0KSB7XG4gICAgICAgIHJldHVybiBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihmaXJzdFZhbGlkVGFyZ2V0LCBuYW1lKTtcbiAgICAgIH0gZWxzZSBpZiAoY29tcG9zaXRlT3duUHJvcGVydHlEZXNjcmlwdG9yKSB7XG4gICAgICAgIHJldHVybiBjb21wb3NpdGVPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBVc2VkIGJ5IHNpbm9uXG4gICAgZ2V0UHJvdG90eXBlT2YodGFyZ2V0KSB7XG4gICAgICByZXR1cm4gdGFyZ2V0cy5yZWR1Y2VSaWdodCgoYWNjLCB0KSA9PiB7XG4gICAgICAgIHJldHVybiBPYmplY3QuY3JlYXRlKGFjYywgZGVzY3JpcHRvcnNGcm9tUHJvdG8oT2JqZWN0LmdldFByb3RvdHlwZU9mKHQpKSk7XG4gICAgICB9LCBPYmplY3QucHJvdG90eXBlKTtcbiAgICB9LFxuICB9KTtcbn1cblxuZnVuY3Rpb24gaXNSb290KGRpcikge1xuICByZXR1cm4gcGF0aC5yZXNvbHZlKGRpciwgJy4uJykgPT09IGRpcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzVmFsaWRXb3JrZGlyKGRpcikge1xuICByZXR1cm4gZGlyICE9PSBvcy5ob21lZGlyKCkgJiYgIWlzUm9vdChkaXIpO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmlsZUV4aXN0cyhhYnNvbHV0ZUZpbGVQYXRoKSB7XG4gIHRyeSB7XG4gICAgYXdhaXQgZnMuYWNjZXNzKGFic29sdXRlRmlsZVBhdGgpO1xuICAgIHJldHVybiB0cnVlO1xuICB9IGNhdGNoIChlKSB7XG4gICAgaWYgKGUuY29kZSA9PT0gJ0VOT0VOVCcpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB0aHJvdyBlO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRUZW1wRGlyKG9wdGlvbnMgPSB7fSkge1xuICB0ZW1wLnRyYWNrKCk7XG5cbiAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICB0ZW1wLm1rZGlyKG9wdGlvbnMsICh0ZW1wRXJyb3IsIGZvbGRlcikgPT4ge1xuICAgICAgaWYgKHRlbXBFcnJvcikge1xuICAgICAgICByZWplY3QodGVtcEVycm9yKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5zeW1saW5rT2spIHtcbiAgICAgICAgcmVzb2x2ZShmb2xkZXIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZnMucmVhbHBhdGgoZm9sZGVyLCAocmVhbEVycm9yLCBycGF0aCkgPT4gKHJlYWxFcnJvciA/IHJlamVjdChyZWFsRXJyb3IpIDogcmVzb2x2ZShycGF0aCkpKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpc0ZpbGVFeGVjdXRhYmxlKGFic29sdXRlRmlsZVBhdGgpIHtcbiAgY29uc3Qgc3RhdCA9IGF3YWl0IGZzLnN0YXQoYWJzb2x1dGVGaWxlUGF0aCk7XG4gIHJldHVybiBzdGF0Lm1vZGUgJiBmcy5jb25zdGFudHMuU19JWFVTUjsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1iaXR3aXNlXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpc0ZpbGVTeW1saW5rKGFic29sdXRlRmlsZVBhdGgpIHtcbiAgY29uc3Qgc3RhdCA9IGF3YWl0IGZzLmxzdGF0KGFic29sdXRlRmlsZVBhdGgpO1xuICByZXR1cm4gc3RhdC5pc1N5bWJvbGljTGluaygpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2hvcnRlblNoYShzaGEpIHtcbiAgcmV0dXJuIHNoYS5zbGljZSgwLCA4KTtcbn1cblxuZXhwb3J0IGNvbnN0IGNsYXNzTmFtZUZvclN0YXR1cyA9IHtcbiAgYWRkZWQ6ICdhZGRlZCcsXG4gIGRlbGV0ZWQ6ICdyZW1vdmVkJyxcbiAgbW9kaWZpZWQ6ICdtb2RpZmllZCcsXG4gIHR5cGVjaGFuZ2U6ICdtb2RpZmllZCcsXG4gIGVxdWl2YWxlbnQ6ICdpZ25vcmVkJyxcbn07XG5cbi8qXG4gKiBBcHBseSBhbnkgcGxhdGZvcm0tc3BlY2lmaWMgbXVuZ2luZyB0byBhIHBhdGggYmVmb3JlIHByZXNlbnRpbmcgaXQgYXNcbiAqIGEgZ2l0IGVudmlyb25tZW50IHZhcmlhYmxlIG9yIG9wdGlvbi5cbiAqXG4gKiBDb252ZXJ0IGEgV2luZG93cy1zdHlsZSBcIkM6XFxmb29cXGJhclxcYmF6XCIgcGF0aCB0byBhIFwiL2MvZm9vL2Jhci9iYXpcIiBVTklYLXlcbiAqIHBhdGggdGhhdCB0aGUgc2guZXhlIHVzZWQgdG8gZXhlY3V0ZSBnaXQncyBjcmVkZW50aWFsIGhlbHBlcnMgd2lsbFxuICogdW5kZXJzdGFuZC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUdpdEhlbHBlclBhdGgoaW5QYXRoKSB7XG4gIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSAnd2luMzInKSB7XG4gICAgcmV0dXJuIGluUGF0aC5yZXBsYWNlKC9cXFxcL2csICcvJykucmVwbGFjZSgvXihbXjpdKyk6LywgJy8kMScpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBpblBhdGg7XG4gIH1cbn1cblxuLypcbiAqIE9uIFdpbmRvd3MsIGdpdCBjb21tYW5kcyByZXBvcnQgcGF0aHMgd2l0aCAvIGRlbGltaXRlcnMuIENvbnZlcnQgdGhlbSB0byBcXC1kZWxpbWl0ZWQgcGF0aHNcbiAqIHNvIHRoYXQgQXRvbSB1bmlmcm9tbHkgdHJlYXRzIHBhdGhzIHdpdGggbmF0aXZlIHBhdGggc2VwYXJhdG9ycy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvTmF0aXZlUGF0aFNlcChyYXdQYXRoKSB7XG4gIGlmIChwcm9jZXNzLnBsYXRmb3JtICE9PSAnd2luMzInKSB7XG4gICAgcmV0dXJuIHJhd1BhdGg7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHJhd1BhdGguc3BsaXQoJy8nKS5qb2luKHBhdGguc2VwKTtcbiAgfVxufVxuXG4vKlxuICogQ29udmVydCBXaW5kb3dzIHBhdGhzIGJhY2sgdG8gLy1kZWxpbWl0ZWQgcGF0aHMgdG8gYmUgcHJlc2VudGVkIHRvIGdpdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvR2l0UGF0aFNlcChyYXdQYXRoKSB7XG4gIGlmIChwcm9jZXNzLnBsYXRmb3JtICE9PSAnd2luMzInKSB7XG4gICAgcmV0dXJuIHJhd1BhdGg7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIHJhd1BhdGguc3BsaXQocGF0aC5zZXApLmpvaW4oJy8nKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZmlsZVBhdGhFbmRzV2l0aChmaWxlUGF0aCwgLi4uc2VnbWVudHMpIHtcbiAgcmV0dXJuIGZpbGVQYXRoLmVuZHNXaXRoKHBhdGguam9pbiguLi5zZWdtZW50cykpO1xufVxuXG4vKipcbiAqIFR1cm5zIGFuIGFycmF5IG9mIHRoaW5ncyBAa3V5Y2hhY28gY2Fubm90IGVhdFxuICogaW50byBhIHNlbnRlbmNlIGNvbnRhaW5pbmcgdGhpbmdzIEBrdXljaGFjbyBjYW5ub3QgZWF0XG4gKlxuICogWyd0b2FzdCddID0+ICd0b2FzdCdcbiAqIFsndG9hc3QnLCAnZWdncyddID0+ICd0b2FzdCBhbmQgZWdncydcbiAqIFsndG9hc3QnLCAnZWdncycsICdjaGVlc2UnXSA9PiAndG9hc3QsIGVnZ3MsIGFuZCBjaGVlc2UnXG4gKlxuICogT3hmb3JkIGNvbW1hIGluY2x1ZGVkIGJlY2F1c2UgeW91J3JlIHdyb25nLCBzaHV0IHVwLlxuICovXG5leHBvcnQgZnVuY3Rpb24gdG9TZW50ZW5jZShhcnJheSkge1xuICBjb25zdCBsZW4gPSBhcnJheS5sZW5ndGg7XG4gIGlmIChsZW4gPT09IDEpIHtcbiAgICByZXR1cm4gYCR7YXJyYXlbMF19YDtcbiAgfSBlbHNlIGlmIChsZW4gPT09IDIpIHtcbiAgICByZXR1cm4gYCR7YXJyYXlbMF19IGFuZCAke2FycmF5WzFdfWA7XG4gIH1cblxuICByZXR1cm4gYXJyYXkucmVkdWNlKChhY2MsIGl0ZW0sIGlkeCkgPT4ge1xuICAgIGlmIChpZHggPT09IDApIHtcbiAgICAgIHJldHVybiBgJHtpdGVtfWA7XG4gICAgfSBlbHNlIGlmIChpZHggPT09IGxlbiAtIDEpIHtcbiAgICAgIHJldHVybiBgJHthY2N9LCBhbmQgJHtpdGVtfWA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBgJHthY2N9LCAke2l0ZW19YDtcbiAgICB9XG4gIH0sICcnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHB1c2hBdEtleShtYXAsIGtleSwgdmFsdWUpIHtcbiAgbGV0IGV4aXN0aW5nID0gbWFwLmdldChrZXkpO1xuICBpZiAoIWV4aXN0aW5nKSB7XG4gICAgZXhpc3RpbmcgPSBbXTtcbiAgICBtYXAuc2V0KGtleSwgZXhpc3RpbmcpO1xuICB9XG4gIGV4aXN0aW5nLnB1c2godmFsdWUpO1xufVxuXG4vLyBSZXBvc2l0b3J5IGFuZCB3b3Jrc3BhY2UgaGVscGVyc1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29tbWl0TWVzc2FnZVBhdGgocmVwb3NpdG9yeSkge1xuICByZXR1cm4gcGF0aC5qb2luKHJlcG9zaXRvcnkuZ2V0R2l0RGlyZWN0b3J5UGF0aCgpLCAnQVRPTV9DT01NSVRfRURJVE1TRycpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0Q29tbWl0TWVzc2FnZUVkaXRvcnMocmVwb3NpdG9yeSwgd29ya3NwYWNlKSB7XG4gIGlmICghcmVwb3NpdG9yeS5pc1ByZXNlbnQoKSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICByZXR1cm4gd29ya3NwYWNlLmdldFRleHRFZGl0b3JzKCkuZmlsdGVyKGVkaXRvciA9PiBlZGl0b3IuZ2V0UGF0aCgpID09PSBnZXRDb21taXRNZXNzYWdlUGF0aChyZXBvc2l0b3J5KSk7XG59XG5cbmxldCBDaGFuZ2VkRmlsZUl0ZW0gPSBudWxsO1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZpbGVQYXRjaFBhbmVJdGVtcyh7b25seVN0YWdlZCwgZW1wdHl9ID0ge30sIHdvcmtzcGFjZSkge1xuICBpZiAoQ2hhbmdlZEZpbGVJdGVtID09PSBudWxsKSB7XG4gICAgQ2hhbmdlZEZpbGVJdGVtID0gcmVxdWlyZSgnLi9pdGVtcy9jaGFuZ2VkLWZpbGUtaXRlbScpLmRlZmF1bHQ7XG4gIH1cblxuICByZXR1cm4gd29ya3NwYWNlLmdldFBhbmVJdGVtcygpLmZpbHRlcihpdGVtID0+IHtcbiAgICBjb25zdCBpc0ZpbGVQYXRjaEl0ZW0gPSBpdGVtICYmIGl0ZW0uZ2V0UmVhbEl0ZW0gJiYgaXRlbS5nZXRSZWFsSXRlbSgpIGluc3RhbmNlb2YgQ2hhbmdlZEZpbGVJdGVtO1xuICAgIGlmIChvbmx5U3RhZ2VkKSB7XG4gICAgICByZXR1cm4gaXNGaWxlUGF0Y2hJdGVtICYmIGl0ZW0uc3RhZ2luZ1N0YXR1cyA9PT0gJ3N0YWdlZCc7XG4gICAgfSBlbHNlIGlmIChlbXB0eSkge1xuICAgICAgcmV0dXJuIGlzRmlsZVBhdGNoSXRlbSA/IGl0ZW0uaXNFbXB0eSgpIDogZmFsc2U7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBpc0ZpbGVQYXRjaEl0ZW07XG4gICAgfVxuICB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRlc3Ryb3lGaWxlUGF0Y2hQYW5lSXRlbXMoe29ubHlTdGFnZWR9ID0ge30sIHdvcmtzcGFjZSkge1xuICBjb25zdCBpdGVtc1RvRGVzdHJveSA9IGdldEZpbGVQYXRjaFBhbmVJdGVtcyh7b25seVN0YWdlZH0sIHdvcmtzcGFjZSk7XG4gIGl0ZW1zVG9EZXN0cm95LmZvckVhY2goaXRlbSA9PiBpdGVtLmRlc3Ryb3koKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXN0cm95RW1wdHlGaWxlUGF0Y2hQYW5lSXRlbXMod29ya3NwYWNlKSB7XG4gIGNvbnN0IGl0ZW1zVG9EZXN0cm95ID0gZ2V0RmlsZVBhdGNoUGFuZUl0ZW1zKHtlbXB0eTogdHJ1ZX0sIHdvcmtzcGFjZSk7XG4gIGl0ZW1zVG9EZXN0cm95LmZvckVhY2goaXRlbSA9PiBpdGVtLmRlc3Ryb3koKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0Q29BdXRob3JzQW5kUmF3Q29tbWl0TWVzc2FnZShjb21taXRNZXNzYWdlKSB7XG4gIGNvbnN0IG1lc3NhZ2VMaW5lcyA9IFtdO1xuICBjb25zdCBjb0F1dGhvcnMgPSBbXTtcblxuICBmb3IgKGNvbnN0IGxpbmUgb2YgY29tbWl0TWVzc2FnZS5zcGxpdChMSU5FX0VORElOR19SRUdFWCkpIHtcbiAgICBjb25zdCBtYXRjaCA9IGxpbmUubWF0Y2goQ09fQVVUSE9SX1JFR0VYKTtcbiAgICBpZiAobWF0Y2gpIHtcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bnVzZWQtdmFyc1xuICAgICAgY29uc3QgW18sIG5hbWUsIGVtYWlsXSA9IG1hdGNoO1xuICAgICAgY29BdXRob3JzLnB1c2gobmV3IEF1dGhvcihlbWFpbCwgbmFtZSkpO1xuICAgIH0gZWxzZSB7XG4gICAgICBtZXNzYWdlTGluZXMucHVzaChsaW5lKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4ge21lc3NhZ2U6IG1lc3NhZ2VMaW5lcy5qb2luKCdcXG4nKSwgY29BdXRob3JzfTtcbn1cblxuLy8gQXRvbSBBUEkgcGFuZSBpdGVtIG1hbmlwdWxhdGlvblxuXG5leHBvcnQgZnVuY3Rpb24gY3JlYXRlSXRlbShub2RlLCBjb21wb25lbnRIb2xkZXIgPSBudWxsLCB1cmkgPSBudWxsLCBleHRyYSA9IHt9KSB7XG4gIGNvbnN0IGhvbGRlciA9IGNvbXBvbmVudEhvbGRlciB8fCBuZXcgUmVmSG9sZGVyKCk7XG5cbiAgY29uc3Qgb3ZlcnJpZGUgPSB7XG4gICAgZ2V0RWxlbWVudDogKCkgPT4gbm9kZSxcblxuICAgIGdldFJlYWxJdGVtOiAoKSA9PiBob2xkZXIuZ2V0T3IobnVsbCksXG5cbiAgICBnZXRSZWFsSXRlbVByb21pc2U6ICgpID0+IGhvbGRlci5nZXRQcm9taXNlKCksXG5cbiAgICAuLi5leHRyYSxcbiAgfTtcblxuICBpZiAodXJpKSB7XG4gICAgb3ZlcnJpZGUuZ2V0VVJJID0gKCkgPT4gdXJpO1xuICB9XG5cbiAgaWYgKGNvbXBvbmVudEhvbGRlcikge1xuICAgIHJldHVybiBuZXcgUHJveHkob3ZlcnJpZGUsIHtcbiAgICAgIGdldCh0YXJnZXQsIG5hbWUpIHtcbiAgICAgICAgaWYgKFJlZmxlY3QuaGFzKHRhcmdldCwgbmFtZSkpIHtcbiAgICAgICAgICByZXR1cm4gdGFyZ2V0W25hbWVdO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gVGhlIHt2YWx1ZTogLi4ufSB3cmFwcGVyIHByZXZlbnRzIC5tYXAoKSBmcm9tIGZsYXR0ZW5pbmcgYSByZXR1cm5lZCBSZWZIb2xkZXIuXG4gICAgICAgIC8vIElmIGNvbXBvbmVudFtuYW1lXSBpcyBhIFJlZkhvbGRlciwgd2Ugd2FudCB0byByZXR1cm4gdGhhdCBSZWZIb2xkZXIgYXMtaXMuXG4gICAgICAgIGNvbnN0IHt2YWx1ZX0gPSBob2xkZXIubWFwKGNvbXBvbmVudCA9PiAoe3ZhbHVlOiBjb21wb25lbnRbbmFtZV19KSkuZ2V0T3Ioe3ZhbHVlOiB1bmRlZmluZWR9KTtcbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgfSxcblxuICAgICAgc2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIGhvbGRlci5tYXAoY29tcG9uZW50ID0+IHtcbiAgICAgICAgICBjb21wb25lbnRbbmFtZV0gPSB2YWx1ZTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSkuZ2V0T3IodHJ1ZSk7XG4gICAgICB9LFxuXG4gICAgICBoYXModGFyZ2V0LCBuYW1lKSB7XG4gICAgICAgIHJldHVybiBob2xkZXIubWFwKGNvbXBvbmVudCA9PiBSZWZsZWN0Lmhhcyhjb21wb25lbnQsIG5hbWUpKS5nZXRPcihmYWxzZSkgfHwgUmVmbGVjdC5oYXModGFyZ2V0LCBuYW1lKTtcbiAgICAgIH0sXG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG92ZXJyaWRlO1xuICB9XG59XG5cbi8vIFNldCBmdW5jdGlvbnNcblxuZXhwb3J0IGZ1bmN0aW9uIGVxdWFsU2V0cyhsZWZ0LCByaWdodCkge1xuICBpZiAobGVmdC5zaXplICE9PSByaWdodC5zaXplKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgZm9yIChjb25zdCBlYWNoIG9mIGxlZnQpIHtcbiAgICBpZiAoIXJpZ2h0LmhhcyhlYWNoKSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufVxuXG4vLyBDb25zdGFudHNcblxuZXhwb3J0IGNvbnN0IE5CU1BfQ0hBUkFDVEVSID0gJ1xcdTAwYTAnO1xuXG5leHBvcnQgZnVuY3Rpb24gYmxhbmtMYWJlbCgpIHtcbiAgcmV0dXJuIE5CU1BfQ0hBUkFDVEVSO1xufVxuXG5leHBvcnQgY29uc3QgcmVhY3Rpb25UeXBlVG9FbW9qaSA9IHtcbiAgVEhVTUJTX1VQOiAn8J+RjScsXG4gIFRIVU1CU19ET1dOOiAn8J+RjicsXG4gIExBVUdIOiAn8J+YhicsXG4gIEhPT1JBWTogJ/CfjoknLFxuICBDT05GVVNFRDogJ/CfmJUnLFxuICBIRUFSVDogJ+KdpO+4jycsXG4gIFJPQ0tFVDogJ/CfmoAnLFxuICBFWUVTOiAn8J+RgCcsXG59O1xuXG4vLyBNYXJrZG93blxuXG5sZXQgbWFya2VkID0gbnVsbDtcbmxldCBkb21QdXJpZnkgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyTWFya2Rvd24obWQpIHtcbiAgaWYgKG1hcmtlZCA9PT0gbnVsbCkge1xuICAgIG1hcmtlZCA9IHJlcXVpcmUoJ21hcmtlZCcpO1xuXG4gICAgaWYgKGRvbVB1cmlmeSA9PT0gbnVsbCkge1xuICAgICAgY29uc3QgY3JlYXRlRE9NUHVyaWZ5ID0gcmVxdWlyZSgnZG9tcHVyaWZ5Jyk7XG4gICAgICBkb21QdXJpZnkgPSBjcmVhdGVET01QdXJpZnkoKTtcbiAgICB9XG5cbiAgICBtYXJrZWQuc2V0T3B0aW9ucyh7XG4gICAgICBzaWxlbnQ6IHRydWUsXG4gICAgICBzYW5pdGl6ZTogdHJ1ZSxcbiAgICAgIHNhbml0aXplcjogaHRtbCA9PiBkb21QdXJpZnkuc2FuaXRpemUoaHRtbCksXG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gbWFya2VkKG1kKTtcbn1cblxuZXhwb3J0IGNvbnN0IEdIT1NUX1VTRVIgPSB7XG4gIGxvZ2luOiAnZ2hvc3QnLFxuICBhdmF0YXJVcmw6ICdodHRwczovL2F2YXRhcnMxLmdpdGh1YnVzZXJjb250ZW50LmNvbS91LzEwMTM3P3Y9NCcsXG4gIHVybDogJ2h0dHBzOi8vZ2l0aHViLmNvbS9naG9zdCcsXG59O1xuIl19