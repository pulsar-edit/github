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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2xpYi9oZWxwZXJzLmpzIl0sIm5hbWVzIjpbIkxJTkVfRU5ESU5HX1JFR0VYIiwiQ09fQVVUSE9SX1JFR0VYIiwiUEFHRV9TSVpFIiwiUEFHSU5BVElPTl9XQUlUX1RJTUVfTVMiLCJDSEVDS19TVUlURV9QQUdFX1NJWkUiLCJDSEVDS19SVU5fUEFHRV9TSVpFIiwiYXV0b2JpbmQiLCJzZWxmIiwibWV0aG9kcyIsIm1ldGhvZCIsIkVycm9yIiwiYmluZCIsImV4dHJhY3RQcm9wcyIsInByb3BzIiwicHJvcFR5cGVzIiwibmFtZU1hcCIsIk9iamVjdCIsImtleXMiLCJyZWR1Y2UiLCJvcHRzIiwicHJvcE5hbWUiLCJ1bmRlZmluZWQiLCJkZXN0UHJvcE5hbWUiLCJ1bnVzZWRQcm9wcyIsImdldFBhY2thZ2VSb290IiwicmVzb3VyY2VQYXRoIiwiYXRvbSIsImdldExvYWRTZXR0aW5ncyIsImN1cnJlbnRGaWxlV2FzUmVxdWlyZWRGcm9tU25hcHNob3QiLCJwYXRoIiwiaXNBYnNvbHV0ZSIsIl9fZGlybmFtZSIsImpvaW4iLCJwYWNrYWdlUm9vdCIsInJlc29sdmUiLCJleHRuYW1lIiwiaW5kZXhPZiIsImdldEF0b21BcHBOYW1lIiwibWF0Y2giLCJnZXRWZXJzaW9uIiwiY2hhbm5lbCIsImNoYXJBdCIsInRvVXBwZXJDYXNlIiwic2xpY2UiLCJnZXRBdG9tSGVscGVyUGF0aCIsInByb2Nlc3MiLCJwbGF0Zm9ybSIsImFwcE5hbWUiLCJyZXNvdXJjZXNQYXRoIiwiZXhlY1BhdGgiLCJEVUdJVEVfUEFUSCIsImdldER1Z2l0ZVBhdGgiLCJyZXF1aXJlIiwiU0hBUkVEX01PRFVMRV9QQVRIUyIsIk1hcCIsImdldFNoYXJlZE1vZHVsZVBhdGgiLCJyZWxQYXRoIiwibW9kdWxlUGF0aCIsImdldCIsInNldCIsImlzQmluYXJ5IiwiZGF0YSIsImkiLCJjb2RlIiwiY2hhckNvZGVBdCIsImRlc2NyaXB0b3JzRnJvbVByb3RvIiwicHJvdG8iLCJnZXRPd25Qcm9wZXJ0eU5hbWVzIiwiYWNjIiwibmFtZSIsImFzc2lnbiIsIlJlZmxlY3QiLCJnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJmaXJzdEltcGxlbWVudGVyIiwidGFyZ2V0cyIsIlByb3h5IiwiX19pbXBsZW1lbnRhdGlvbnMiLCJ0YXJnZXQiLCJoYXMiLCJmaXJzdFZhbGlkVGFyZ2V0IiwiZmluZCIsInQiLCJ2YWx1ZSIsInNvbWUiLCJjb21wb3NpdGVPd25Qcm9wZXJ0eURlc2NyaXB0b3IiLCJnZXRQcm90b3R5cGVPZiIsInJlZHVjZVJpZ2h0IiwiY3JlYXRlIiwicHJvdG90eXBlIiwiaXNSb290IiwiZGlyIiwiaXNWYWxpZFdvcmtkaXIiLCJvcyIsImhvbWVkaXIiLCJmaWxlRXhpc3RzIiwiYWJzb2x1dGVGaWxlUGF0aCIsImZzIiwiYWNjZXNzIiwiZSIsImdldFRlbXBEaXIiLCJvcHRpb25zIiwidGVtcCIsInRyYWNrIiwiUHJvbWlzZSIsInJlamVjdCIsIm1rZGlyIiwidGVtcEVycm9yIiwiZm9sZGVyIiwic3ltbGlua09rIiwicmVhbHBhdGgiLCJyZWFsRXJyb3IiLCJycGF0aCIsImlzRmlsZUV4ZWN1dGFibGUiLCJzdGF0IiwibW9kZSIsImNvbnN0YW50cyIsIlNfSVhVU1IiLCJpc0ZpbGVTeW1saW5rIiwibHN0YXQiLCJpc1N5bWJvbGljTGluayIsInNob3J0ZW5TaGEiLCJzaGEiLCJjbGFzc05hbWVGb3JTdGF0dXMiLCJhZGRlZCIsImRlbGV0ZWQiLCJtb2RpZmllZCIsInR5cGVjaGFuZ2UiLCJlcXVpdmFsZW50Iiwibm9ybWFsaXplR2l0SGVscGVyUGF0aCIsImluUGF0aCIsInJlcGxhY2UiLCJ0b05hdGl2ZVBhdGhTZXAiLCJyYXdQYXRoIiwic3BsaXQiLCJzZXAiLCJ0b0dpdFBhdGhTZXAiLCJmaWxlUGF0aEVuZHNXaXRoIiwiZmlsZVBhdGgiLCJzZWdtZW50cyIsImVuZHNXaXRoIiwidG9TZW50ZW5jZSIsImFycmF5IiwibGVuIiwibGVuZ3RoIiwiaXRlbSIsImlkeCIsInB1c2hBdEtleSIsIm1hcCIsImtleSIsImV4aXN0aW5nIiwicHVzaCIsImdldENvbW1pdE1lc3NhZ2VQYXRoIiwicmVwb3NpdG9yeSIsImdldEdpdERpcmVjdG9yeVBhdGgiLCJnZXRDb21taXRNZXNzYWdlRWRpdG9ycyIsIndvcmtzcGFjZSIsImlzUHJlc2VudCIsImdldFRleHRFZGl0b3JzIiwiZmlsdGVyIiwiZWRpdG9yIiwiZ2V0UGF0aCIsIkNoYW5nZWRGaWxlSXRlbSIsImdldEZpbGVQYXRjaFBhbmVJdGVtcyIsIm9ubHlTdGFnZWQiLCJlbXB0eSIsImRlZmF1bHQiLCJnZXRQYW5lSXRlbXMiLCJpc0ZpbGVQYXRjaEl0ZW0iLCJnZXRSZWFsSXRlbSIsInN0YWdpbmdTdGF0dXMiLCJpc0VtcHR5IiwiZGVzdHJveUZpbGVQYXRjaFBhbmVJdGVtcyIsIml0ZW1zVG9EZXN0cm95IiwiZm9yRWFjaCIsImRlc3Ryb3kiLCJkZXN0cm95RW1wdHlGaWxlUGF0Y2hQYW5lSXRlbXMiLCJleHRyYWN0Q29BdXRob3JzQW5kUmF3Q29tbWl0TWVzc2FnZSIsImNvbW1pdE1lc3NhZ2UiLCJtZXNzYWdlTGluZXMiLCJjb0F1dGhvcnMiLCJsaW5lIiwiXyIsImVtYWlsIiwiQXV0aG9yIiwibWVzc2FnZSIsImNyZWF0ZUl0ZW0iLCJub2RlIiwiY29tcG9uZW50SG9sZGVyIiwidXJpIiwiZXh0cmEiLCJob2xkZXIiLCJSZWZIb2xkZXIiLCJvdmVycmlkZSIsImdldEVsZW1lbnQiLCJnZXRPciIsImdldFJlYWxJdGVtUHJvbWlzZSIsImdldFByb21pc2UiLCJnZXRVUkkiLCJjb21wb25lbnQiLCJlcXVhbFNldHMiLCJsZWZ0IiwicmlnaHQiLCJzaXplIiwiZWFjaCIsIk5CU1BfQ0hBUkFDVEVSIiwiYmxhbmtMYWJlbCIsInJlYWN0aW9uVHlwZVRvRW1vamkiLCJUSFVNQlNfVVAiLCJUSFVNQlNfRE9XTiIsIkxBVUdIIiwiSE9PUkFZIiwiQ09ORlVTRUQiLCJIRUFSVCIsIlJPQ0tFVCIsIkVZRVMiLCJtYXJrZWQiLCJkb21QdXJpZnkiLCJyZW5kZXJNYXJrZG93biIsIm1kIiwiY3JlYXRlRE9NUHVyaWZ5Iiwic2V0T3B0aW9ucyIsInNpbGVudCIsInNhbml0aXplIiwic2FuaXRpemVyIiwiaHRtbCIsIkdIT1NUX1VTRVIiLCJsb2dpbiIsImF2YXRhclVybCIsInVybCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFFQTs7QUFDQTs7Ozs7Ozs7OztBQUVPLE1BQU1BLGlCQUFpQixHQUFHLE9BQTFCOztBQUNBLE1BQU1DLGVBQWUsR0FBRyxrQ0FBeEI7O0FBQ0EsTUFBTUMsU0FBUyxHQUFHLEVBQWxCOztBQUNBLE1BQU1DLHVCQUF1QixHQUFHLEdBQWhDOztBQUNBLE1BQU1DLHFCQUFxQixHQUFHLEVBQTlCOztBQUNBLE1BQU1DLG1CQUFtQixHQUFHLEVBQTVCOzs7QUFFQSxTQUFTQyxRQUFULENBQWtCQyxJQUFsQixFQUF3QixHQUFHQyxPQUEzQixFQUFvQztBQUN6QyxPQUFLLE1BQU1DLE1BQVgsSUFBcUJELE9BQXJCLEVBQThCO0FBQzVCLFFBQUksT0FBT0QsSUFBSSxDQUFDRSxNQUFELENBQVgsS0FBd0IsVUFBNUIsRUFBd0M7QUFDdEMsWUFBTSxJQUFJQyxLQUFKLENBQVcsNkJBQTRCRCxNQUFPLEVBQTlDLENBQU47QUFDRDs7QUFDREYsSUFBQUEsSUFBSSxDQUFDRSxNQUFELENBQUosR0FBZUYsSUFBSSxDQUFDRSxNQUFELENBQUosQ0FBYUUsSUFBYixDQUFrQkosSUFBbEIsQ0FBZjtBQUNEO0FBQ0YsQyxDQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQUNPLFNBQVNLLFlBQVQsQ0FBc0JDLEtBQXRCLEVBQTZCQyxTQUE3QixFQUF3Q0MsT0FBTyxHQUFHLEVBQWxELEVBQXNE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dkssT0FBTyxDQUFDLFdBQUQsQ0FBL0I7O0FBQ0FvSyxNQUFBQSxTQUFTLEdBQUdHLGVBQWUsRUFBM0I7QUFDRDs7QUFFREosSUFBQUEsTUFBTSxDQUFDSyxVQUFQLENBQWtCO0FBQ2hCQyxNQUFBQSxNQUFNLEVBQUUsSUFEUTtBQUVoQkMsTUFBQUEsUUFBUSxFQUFFLElBRk07QUFHaEJDLE1BQUFBLFNBQVMsRUFBRUMsSUFBSSxJQUFJUixTQUFTLENBQUNNLFFBQVYsQ0FBbUJFLElBQW5CO0FBSEgsS0FBbEI7QUFLRDs7QUFFRCxTQUFPVCxNQUFNLENBQUNHLEVBQUQsQ0FBYjtBQUNEOztBQUVNLE1BQU1PLFVBQVUsR0FBRztBQUN4QkMsRUFBQUEsS0FBSyxFQUFFLE9BRGlCO0FBRXhCQyxFQUFBQSxTQUFTLEVBQUUsb0RBRmE7QUFHeEJDLEVBQUFBLEdBQUcsRUFBRTtBQUhtQixDQUFuQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuaW1wb3J0IGZzIGZyb20gJ2ZzLWV4dHJhJztcbmltcG9ydCBvcyBmcm9tICdvcyc7XG5pbXBvcnQgdGVtcCBmcm9tICd0ZW1wJztcblxuaW1wb3J0IFJlZkhvbGRlciBmcm9tICcuL21vZGVscy9yZWYtaG9sZGVyJztcbmltcG9ydCBBdXRob3IgZnJvbSAnLi9tb2RlbHMvYXV0aG9yJztcblxuZXhwb3J0IGNvbnN0IExJTkVfRU5ESU5HX1JFR0VYID0gL1xccj9cXG4vO1xuZXhwb3J0IGNvbnN0IENPX0FVVEhPUl9SRUdFWCA9IC9eY28tYXV0aG9yZWQtYnkuICguKz8pIDwoLis/KT4kL2k7XG5leHBvcnQgY29uc3QgUEFHRV9TSVpFID0gNTA7XG5leHBvcnQgY29uc3QgUEFHSU5BVElPTl9XQUlUX1RJTUVfTVMgPSAxMDA7XG5leHBvcnQgY29uc3QgQ0hFQ0tfU1VJVEVfUEFHRV9TSVpFID0gMTA7XG5leHBvcnQgY29uc3QgQ0hFQ0tfUlVOX1BBR0VfU0laRSA9IDIwO1xuXG5leHBvcnQgZnVuY3Rpb24gYXV0b2JpbmQoc2VsZiwgLi4ubWV0aG9kcykge1xuICBmb3IgKGNvbnN0IG1ldGhvZCBvZiBtZXRob2RzKSB7XG4gICAgaWYgKHR5cGVvZiBzZWxmW21ldGhvZF0gIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgVW5hYmxlIHRvIGF1dG9iaW5kIG1ldGhvZCAke21ldGhvZH1gKTtcbiAgICB9XG4gICAgc2VsZlttZXRob2RdID0gc2VsZlttZXRob2RdLmJpbmQoc2VsZik7XG4gIH1cbn1cblxuLy8gRXh0cmFjdCBhIHN1YnNldCBvZiBwcm9wcyBjaG9zZW4gZnJvbSBhIHByb3BUeXBlcyBvYmplY3QgZnJvbSBhIGNvbXBvbmVudCdzIHByb3BzIHRvIHBhc3MgdG8gYSBkaWZmZXJlbnQgQVBJLlxuLy9cbi8vIFVzYWdlOlxuLy9cbi8vIGBgYGpzXG4vLyBjb25zdCBhcGlQcm9wcyA9IHtcbi8vICAgemVybzogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuLy8gICBvbmU6IFByb3BUeXBlcy5zdHJpbmcsXG4vLyAgIHR3bzogUHJvcFR5cGVzLm9iamVjdCxcbi8vIH07XG4vL1xuLy8gY2xhc3MgQ29tcG9uZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50IHtcbi8vICAgc3RhdGljIHByb3BUeXBlcyA9IHtcbi8vICAgICAuLi5hcGlQcm9wcyxcbi8vICAgICBleHRyYTogUHJvcFR5cGVzLmZ1bmMsXG4vLyAgIH1cbi8vXG4vLyAgIGFjdGlvbigpIHtcbi8vICAgICBjb25zdCBvcHRpb25zID0gZXh0cmFjdFByb3BzKHRoaXMucHJvcHMsIGFwaVByb3BzKTtcbi8vICAgICAvLyBvcHRpb25zIGNvbnRhaW5zIHplcm8sIG9uZSwgYW5kIHR3bywgYnV0IG5vdCBleHRyYVxuLy8gICB9XG4vLyB9XG4vLyBgYGBcbmV4cG9ydCBmdW5jdGlvbiBleHRyYWN0UHJvcHMocHJvcHMsIHByb3BUeXBlcywgbmFtZU1hcCA9IHt9KSB7XG4gIHJldHVybiBPYmplY3Qua2V5cyhwcm9wVHlwZXMpLnJlZHVjZSgob3B0cywgcHJvcE5hbWUpID0+IHtcbiAgICBpZiAocHJvcHNbcHJvcE5hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IGRlc3RQcm9wTmFtZSA9IG5hbWVNYXBbcHJvcE5hbWVdIHx8IHByb3BOYW1lO1xuICAgICAgb3B0c1tkZXN0UHJvcE5hbWVdID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgIH1cbiAgICByZXR1cm4gb3B0cztcbiAgfSwge30pO1xufVxuXG4vLyBUaGUgb3Bwb3NpdGUgb2YgZXh0cmFjdFByb3BzLiBSZXR1cm4gYSBzdWJzZXQgb2YgcHJvcHMgdGhhdCBkbyAqbm90KiBhcHBlYXIgaW4gYSBjb21wb25lbnQncyBwcm9wIHR5cGVzLlxuZXhwb3J0IGZ1bmN0aW9uIHVudXNlZFByb3BzKHByb3BzLCBwcm9wVHlwZXMpIHtcbiAgcmV0dXJuIE9iamVjdC5rZXlzKHByb3BzKS5yZWR1Y2UoKG9wdHMsIHByb3BOYW1lKSA9PiB7XG4gICAgaWYgKHByb3BUeXBlc1twcm9wTmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgb3B0c1twcm9wTmFtZV0gPSBwcm9wc1twcm9wTmFtZV07XG4gICAgfVxuICAgIHJldHVybiBvcHRzO1xuICB9LCB7fSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRQYWNrYWdlUm9vdCgpIHtcbiAgY29uc3Qge3Jlc291cmNlUGF0aH0gPSBhdG9tLmdldExvYWRTZXR0aW5ncygpO1xuICBjb25zdCBjdXJyZW50RmlsZVdhc1JlcXVpcmVkRnJvbVNuYXBzaG90ID0gIXBhdGguaXNBYnNvbHV0ZShfX2Rpcm5hbWUpO1xuICBpZiAoY3VycmVudEZpbGVXYXNSZXF1aXJlZEZyb21TbmFwc2hvdCkge1xuICAgIHJldHVybiBwYXRoLmpvaW4ocmVzb3VyY2VQYXRoLCAnbm9kZV9tb2R1bGVzJywgJ2dpdGh1YicpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHBhY2thZ2VSb290ID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uJyk7XG4gICAgaWYgKHBhdGguZXh0bmFtZShyZXNvdXJjZVBhdGgpID09PSAnLmFzYXInKSB7XG4gICAgICBpZiAocGFja2FnZVJvb3QuaW5kZXhPZihyZXNvdXJjZVBhdGgpID09PSAwKSB7XG4gICAgICAgIHJldHVybiBwYXRoLmpvaW4oYCR7cmVzb3VyY2VQYXRofS51bnBhY2tlZGAsICdub2RlX21vZHVsZXMnLCAnZ2l0aHViJyk7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBwYWNrYWdlUm9vdDtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRBdG9tQXBwTmFtZSgpIHtcbiAgY29uc3QgbWF0Y2ggPSBhdG9tLmdldFZlcnNpb24oKS5tYXRjaCgvLShbQS1aYS16XSspKFxcZCt8LSkvKTtcbiAgaWYgKG1hdGNoKSB7XG4gICAgY29uc3QgY2hhbm5lbCA9IG1hdGNoWzFdO1xuICAgIHJldHVybiBgQXRvbSAke2NoYW5uZWwuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyBjaGFubmVsLnNsaWNlKDEpfSBIZWxwZXJgO1xuICB9XG5cbiAgcmV0dXJuICdBdG9tIEhlbHBlcic7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRBdG9tSGVscGVyUGF0aCgpIHtcbiAgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09ICdkYXJ3aW4nKSB7XG4gICAgY29uc3QgYXBwTmFtZSA9IGdldEF0b21BcHBOYW1lKCk7XG4gICAgcmV0dXJuIHBhdGgucmVzb2x2ZShwcm9jZXNzLnJlc291cmNlc1BhdGgsICcuLicsICdGcmFtZXdvcmtzJyxcbiAgICAgIGAke2FwcE5hbWV9LmFwcGAsICdDb250ZW50cycsICdNYWNPUycsIGFwcE5hbWUpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBwcm9jZXNzLmV4ZWNQYXRoO1xuICB9XG59XG5cbmxldCBEVUdJVEVfUEFUSDtcbmV4cG9ydCBmdW5jdGlvbiBnZXREdWdpdGVQYXRoKCkge1xuICBpZiAoIURVR0lURV9QQVRIKSB7XG4gICAgRFVHSVRFX1BBVEggPSByZXF1aXJlLnJlc29sdmUoJ2R1Z2l0ZScpO1xuICAgIGlmICghcGF0aC5pc0Fic29sdXRlKERVR0lURV9QQVRIKSkge1xuICAgICAgLy8gQXNzdW1lIHdlJ3JlIHNuYXBzaG90dGVkXG4gICAgICBjb25zdCB7cmVzb3VyY2VQYXRofSA9IGF0b20uZ2V0TG9hZFNldHRpbmdzKCk7XG4gICAgICBpZiAocGF0aC5leHRuYW1lKHJlc291cmNlUGF0aCkgPT09ICcuYXNhcicpIHtcbiAgICAgICAgRFVHSVRFX1BBVEggPSBwYXRoLmpvaW4oYCR7cmVzb3VyY2VQYXRofS51bnBhY2tlZGAsICdub2RlX21vZHVsZXMnLCAnZHVnaXRlJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBEVUdJVEVfUEFUSCA9IHBhdGguam9pbihyZXNvdXJjZVBhdGgsICdub2RlX21vZHVsZXMnLCAnZHVnaXRlJyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIERVR0lURV9QQVRIO1xufVxuXG5jb25zdCBTSEFSRURfTU9EVUxFX1BBVEhTID0gbmV3IE1hcCgpO1xuZXhwb3J0IGZ1bmN0aW9uIGdldFNoYXJlZE1vZHVsZVBhdGgocmVsUGF0aCkge1xuICBsZXQgbW9kdWxlUGF0aCA9IFNIQVJFRF9NT0RVTEVfUEFUSFMuZ2V0KHJlbFBhdGgpO1xuICBpZiAoIW1vZHVsZVBhdGgpIHtcbiAgICBtb2R1bGVQYXRoID0gcmVxdWlyZS5yZXNvbHZlKHBhdGguam9pbihfX2Rpcm5hbWUsICdzaGFyZWQnLCByZWxQYXRoKSk7XG4gICAgaWYgKCFwYXRoLmlzQWJzb2x1dGUobW9kdWxlUGF0aCkpIHtcbiAgICAgIC8vIEFzc3VtZSB3ZSdyZSBzbmFwc2hvdHRlZFxuICAgICAgY29uc3Qge3Jlc291cmNlUGF0aH0gPSBhdG9tLmdldExvYWRTZXR0aW5ncygpO1xuICAgICAgbW9kdWxlUGF0aCA9IHBhdGguam9pbihyZXNvdXJjZVBhdGgsIG1vZHVsZVBhdGgpO1xuICAgIH1cblxuICAgIFNIQVJFRF9NT0RVTEVfUEFUSFMuc2V0KHJlbFBhdGgsIG1vZHVsZVBhdGgpO1xuICB9XG5cbiAgcmV0dXJuIG1vZHVsZVBhdGg7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0JpbmFyeShkYXRhKSB7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgNTA7IGkrKykge1xuICAgIGNvbnN0IGNvZGUgPSBkYXRhLmNoYXJDb2RlQXQoaSk7XG4gICAgLy8gQ2hhciBjb2RlIDY1NTMzIGlzIHRoZSBcInJlcGxhY2VtZW50IGNoYXJhY3RlclwiO1xuICAgIC8vIDggYW5kIGJlbG93IGFyZSBjb250cm9sIGNoYXJhY3RlcnMuXG4gICAgaWYgKGNvZGUgPT09IDY1NTMzIHx8IGNvZGUgPCA5KSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZmFsc2U7XG59XG5cbmZ1bmN0aW9uIGRlc2NyaXB0b3JzRnJvbVByb3RvKHByb3RvKSB7XG4gIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhwcm90bykucmVkdWNlKChhY2MsIG5hbWUpID0+IHtcbiAgICBPYmplY3QuYXNzaWduKGFjYywge1xuICAgICAgW25hbWVdOiBSZWZsZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihwcm90bywgbmFtZSksXG4gICAgfSk7XG4gICAgcmV0dXJuIGFjYztcbiAgfSwge30pO1xufVxuXG4vKipcbiAqIFRha2VzIGFuIGFycmF5IG9mIHRhcmdldHMgYW5kIHJldHVybnMgYSBwcm94eS4gVGhlIHByb3h5IGludGVyY2VwdHMgcHJvcGVydHkgYWNjZXNzb3IgY2FsbHMgYW5kXG4gKiByZXR1cm5zIHRoZSB2YWx1ZSBvZiB0aGF0IHByb3BlcnR5IG9uIHRoZSBmaXJzdCBvYmplY3QgaW4gYHRhcmdldHNgIHdoZXJlIHRoZSB0YXJnZXQgaW1wbGVtZW50cyB0aGF0IHByb3BlcnR5LlxuICovXG5leHBvcnQgZnVuY3Rpb24gZmlyc3RJbXBsZW1lbnRlciguLi50YXJnZXRzKSB7XG4gIHJldHVybiBuZXcgUHJveHkoe19faW1wbGVtZW50YXRpb25zOiB0YXJnZXRzfSwge1xuICAgIGdldCh0YXJnZXQsIG5hbWUpIHtcbiAgICAgIGlmIChuYW1lID09PSAnZ2V0SW1wbGVtZW50ZXJzJykge1xuICAgICAgICByZXR1cm4gKCkgPT4gdGFyZ2V0cztcbiAgICAgIH1cblxuICAgICAgaWYgKFJlZmxlY3QuaGFzKHRhcmdldCwgbmFtZSkpIHtcbiAgICAgICAgcmV0dXJuIHRhcmdldFtuYW1lXTtcbiAgICAgIH1cblxuICAgICAgY29uc3QgZmlyc3RWYWxpZFRhcmdldCA9IHRhcmdldHMuZmluZCh0ID0+IFJlZmxlY3QuaGFzKHQsIG5hbWUpKTtcbiAgICAgIGlmIChmaXJzdFZhbGlkVGFyZ2V0KSB7XG4gICAgICAgIHJldHVybiBmaXJzdFZhbGlkVGFyZ2V0W25hbWVdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgc2V0KHRhcmdldCwgbmFtZSwgdmFsdWUpIHtcbiAgICAgIGNvbnN0IGZpcnN0VmFsaWRUYXJnZXQgPSB0YXJnZXRzLmZpbmQodCA9PiBSZWZsZWN0Lmhhcyh0LCBuYW1lKSk7XG4gICAgICBpZiAoZmlyc3RWYWxpZFRhcmdldCkge1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmV0dXJuLWFzc2lnblxuICAgICAgICByZXR1cm4gZmlyc3RWYWxpZFRhcmdldFtuYW1lXSA9IHZhbHVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJldHVybi1hc3NpZ25cbiAgICAgICAgcmV0dXJuIHRhcmdldFtuYW1lXSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH0sXG5cbiAgICAvLyBVc2VkIGJ5IHNpbm9uXG4gICAgaGFzKHRhcmdldCwgbmFtZSkge1xuICAgICAgaWYgKG5hbWUgPT09ICdnZXRJbXBsZW1lbnRlcnMnKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gdGFyZ2V0cy5zb21lKHQgPT4gUmVmbGVjdC5oYXModCwgbmFtZSkpO1xuICAgIH0sXG5cbiAgICAvLyBVc2VkIGJ5IHNpbm9uXG4gICAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgbmFtZSkge1xuICAgICAgY29uc3QgZmlyc3RWYWxpZFRhcmdldCA9IHRhcmdldHMuZmluZCh0ID0+IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQsIG5hbWUpKTtcbiAgICAgIGNvbnN0IGNvbXBvc2l0ZU93blByb3BlcnR5RGVzY3JpcHRvciA9IFJlZmxlY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRhcmdldCwgbmFtZSk7XG4gICAgICBpZiAoZmlyc3RWYWxpZFRhcmdldCkge1xuICAgICAgICByZXR1cm4gUmVmbGVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoZmlyc3RWYWxpZFRhcmdldCwgbmFtZSk7XG4gICAgICB9IGVsc2UgaWYgKGNvbXBvc2l0ZU93blByb3BlcnR5RGVzY3JpcHRvcikge1xuICAgICAgICByZXR1cm4gY29tcG9zaXRlT3duUHJvcGVydHlEZXNjcmlwdG9yO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cbiAgICB9LFxuXG4gICAgLy8gVXNlZCBieSBzaW5vblxuICAgIGdldFByb3RvdHlwZU9mKHRhcmdldCkge1xuICAgICAgcmV0dXJuIHRhcmdldHMucmVkdWNlUmlnaHQoKGFjYywgdCkgPT4ge1xuICAgICAgICByZXR1cm4gT2JqZWN0LmNyZWF0ZShhY2MsIGRlc2NyaXB0b3JzRnJvbVByb3RvKE9iamVjdC5nZXRQcm90b3R5cGVPZih0KSkpO1xuICAgICAgfSwgT2JqZWN0LnByb3RvdHlwZSk7XG4gICAgfSxcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGlzUm9vdChkaXIpIHtcbiAgcmV0dXJuIHBhdGgucmVzb2x2ZShkaXIsICcuLicpID09PSBkaXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkV29ya2RpcihkaXIpIHtcbiAgcmV0dXJuIGRpciAhPT0gb3MuaG9tZWRpcigpICYmICFpc1Jvb3QoZGlyKTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZpbGVFeGlzdHMoYWJzb2x1dGVGaWxlUGF0aCkge1xuICB0cnkge1xuICAgIGF3YWl0IGZzLmFjY2VzcyhhYnNvbHV0ZUZpbGVQYXRoKTtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGlmIChlLmNvZGUgPT09ICdFTk9FTlQnKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdGhyb3cgZTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGVtcERpcihvcHRpb25zID0ge30pIHtcbiAgdGVtcC50cmFjaygpO1xuXG4gIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgdGVtcC5ta2RpcihvcHRpb25zLCAodGVtcEVycm9yLCBmb2xkZXIpID0+IHtcbiAgICAgIGlmICh0ZW1wRXJyb3IpIHtcbiAgICAgICAgcmVqZWN0KHRlbXBFcnJvcik7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMuc3ltbGlua09rKSB7XG4gICAgICAgIHJlc29sdmUoZm9sZGVyKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGZzLnJlYWxwYXRoKGZvbGRlciwgKHJlYWxFcnJvciwgcnBhdGgpID0+IChyZWFsRXJyb3IgPyByZWplY3QocmVhbEVycm9yKSA6IHJlc29sdmUocnBhdGgpKSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaXNGaWxlRXhlY3V0YWJsZShhYnNvbHV0ZUZpbGVQYXRoKSB7XG4gIGNvbnN0IHN0YXQgPSBhd2FpdCBmcy5zdGF0KGFic29sdXRlRmlsZVBhdGgpO1xuICByZXR1cm4gc3RhdC5tb2RlICYgZnMuY29uc3RhbnRzLlNfSVhVU1I7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tYml0d2lzZVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaXNGaWxlU3ltbGluayhhYnNvbHV0ZUZpbGVQYXRoKSB7XG4gIGNvbnN0IHN0YXQgPSBhd2FpdCBmcy5sc3RhdChhYnNvbHV0ZUZpbGVQYXRoKTtcbiAgcmV0dXJuIHN0YXQuaXNTeW1ib2xpY0xpbmsoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNob3J0ZW5TaGEoc2hhKSB7XG4gIHJldHVybiBzaGEuc2xpY2UoMCwgOCk7XG59XG5cbmV4cG9ydCBjb25zdCBjbGFzc05hbWVGb3JTdGF0dXMgPSB7XG4gIGFkZGVkOiAnYWRkZWQnLFxuICBkZWxldGVkOiAncmVtb3ZlZCcsXG4gIG1vZGlmaWVkOiAnbW9kaWZpZWQnLFxuICB0eXBlY2hhbmdlOiAnbW9kaWZpZWQnLFxuICBlcXVpdmFsZW50OiAnaWdub3JlZCcsXG59O1xuXG4vKlxuICogQXBwbHkgYW55IHBsYXRmb3JtLXNwZWNpZmljIG11bmdpbmcgdG8gYSBwYXRoIGJlZm9yZSBwcmVzZW50aW5nIGl0IGFzXG4gKiBhIGdpdCBlbnZpcm9ubWVudCB2YXJpYWJsZSBvciBvcHRpb24uXG4gKlxuICogQ29udmVydCBhIFdpbmRvd3Mtc3R5bGUgXCJDOlxcZm9vXFxiYXJcXGJhelwiIHBhdGggdG8gYSBcIi9jL2Zvby9iYXIvYmF6XCIgVU5JWC15XG4gKiBwYXRoIHRoYXQgdGhlIHNoLmV4ZSB1c2VkIHRvIGV4ZWN1dGUgZ2l0J3MgY3JlZGVudGlhbCBoZWxwZXJzIHdpbGxcbiAqIHVuZGVyc3RhbmQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVHaXRIZWxwZXJQYXRoKGluUGF0aCkge1xuICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gJ3dpbjMyJykge1xuICAgIHJldHVybiBpblBhdGgucmVwbGFjZSgvXFxcXC9nLCAnLycpLnJlcGxhY2UoL14oW146XSspOi8sICcvJDEnKTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gaW5QYXRoO1xuICB9XG59XG5cbi8qXG4gKiBPbiBXaW5kb3dzLCBnaXQgY29tbWFuZHMgcmVwb3J0IHBhdGhzIHdpdGggLyBkZWxpbWl0ZXJzLiBDb252ZXJ0IHRoZW0gdG8gXFwtZGVsaW1pdGVkIHBhdGhzXG4gKiBzbyB0aGF0IEF0b20gdW5pZnJvbWx5IHRyZWF0cyBwYXRocyB3aXRoIG5hdGl2ZSBwYXRoIHNlcGFyYXRvcnMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b05hdGl2ZVBhdGhTZXAocmF3UGF0aCkge1xuICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSAhPT0gJ3dpbjMyJykge1xuICAgIHJldHVybiByYXdQYXRoO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiByYXdQYXRoLnNwbGl0KCcvJykuam9pbihwYXRoLnNlcCk7XG4gIH1cbn1cblxuLypcbiAqIENvbnZlcnQgV2luZG93cyBwYXRocyBiYWNrIHRvIC8tZGVsaW1pdGVkIHBhdGhzIHRvIGJlIHByZXNlbnRlZCB0byBnaXQuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB0b0dpdFBhdGhTZXAocmF3UGF0aCkge1xuICBpZiAocHJvY2Vzcy5wbGF0Zm9ybSAhPT0gJ3dpbjMyJykge1xuICAgIHJldHVybiByYXdQYXRoO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiByYXdQYXRoLnNwbGl0KHBhdGguc2VwKS5qb2luKCcvJyk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZpbGVQYXRoRW5kc1dpdGgoZmlsZVBhdGgsIC4uLnNlZ21lbnRzKSB7XG4gIHJldHVybiBmaWxlUGF0aC5lbmRzV2l0aChwYXRoLmpvaW4oLi4uc2VnbWVudHMpKTtcbn1cblxuLyoqXG4gKiBUdXJucyBhbiBhcnJheSBvZiB0aGluZ3MgQGt1eWNoYWNvIGNhbm5vdCBlYXRcbiAqIGludG8gYSBzZW50ZW5jZSBjb250YWluaW5nIHRoaW5ncyBAa3V5Y2hhY28gY2Fubm90IGVhdFxuICpcbiAqIFsndG9hc3QnXSA9PiAndG9hc3QnXG4gKiBbJ3RvYXN0JywgJ2VnZ3MnXSA9PiAndG9hc3QgYW5kIGVnZ3MnXG4gKiBbJ3RvYXN0JywgJ2VnZ3MnLCAnY2hlZXNlJ10gPT4gJ3RvYXN0LCBlZ2dzLCBhbmQgY2hlZXNlJ1xuICpcbiAqIE94Zm9yZCBjb21tYSBpbmNsdWRlZCBiZWNhdXNlIHlvdSdyZSB3cm9uZywgc2h1dCB1cC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRvU2VudGVuY2UoYXJyYXkpIHtcbiAgY29uc3QgbGVuID0gYXJyYXkubGVuZ3RoO1xuICBpZiAobGVuID09PSAxKSB7XG4gICAgcmV0dXJuIGAke2FycmF5WzBdfWA7XG4gIH0gZWxzZSBpZiAobGVuID09PSAyKSB7XG4gICAgcmV0dXJuIGAke2FycmF5WzBdfSBhbmQgJHthcnJheVsxXX1gO1xuICB9XG5cbiAgcmV0dXJuIGFycmF5LnJlZHVjZSgoYWNjLCBpdGVtLCBpZHgpID0+IHtcbiAgICBpZiAoaWR4ID09PSAwKSB7XG4gICAgICByZXR1cm4gYCR7aXRlbX1gO1xuICAgIH0gZWxzZSBpZiAoaWR4ID09PSBsZW4gLSAxKSB7XG4gICAgICByZXR1cm4gYCR7YWNjfSwgYW5kICR7aXRlbX1gO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gYCR7YWNjfSwgJHtpdGVtfWA7XG4gICAgfVxuICB9LCAnJyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwdXNoQXRLZXkobWFwLCBrZXksIHZhbHVlKSB7XG4gIGxldCBleGlzdGluZyA9IG1hcC5nZXQoa2V5KTtcbiAgaWYgKCFleGlzdGluZykge1xuICAgIGV4aXN0aW5nID0gW107XG4gICAgbWFwLnNldChrZXksIGV4aXN0aW5nKTtcbiAgfVxuICBleGlzdGluZy5wdXNoKHZhbHVlKTtcbn1cblxuLy8gUmVwb3NpdG9yeSBhbmQgd29ya3NwYWNlIGhlbHBlcnNcblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbW1pdE1lc3NhZ2VQYXRoKHJlcG9zaXRvcnkpIHtcbiAgcmV0dXJuIHBhdGguam9pbihyZXBvc2l0b3J5LmdldEdpdERpcmVjdG9yeVBhdGgoKSwgJ0FUT01fQ09NTUlUX0VESVRNU0cnKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldENvbW1pdE1lc3NhZ2VFZGl0b3JzKHJlcG9zaXRvcnksIHdvcmtzcGFjZSkge1xuICBpZiAoIXJlcG9zaXRvcnkuaXNQcmVzZW50KCkpIHtcbiAgICByZXR1cm4gW107XG4gIH1cbiAgcmV0dXJuIHdvcmtzcGFjZS5nZXRUZXh0RWRpdG9ycygpLmZpbHRlcihlZGl0b3IgPT4gZWRpdG9yLmdldFBhdGgoKSA9PT0gZ2V0Q29tbWl0TWVzc2FnZVBhdGgocmVwb3NpdG9yeSkpO1xufVxuXG5sZXQgQ2hhbmdlZEZpbGVJdGVtID0gbnVsbDtcbmV4cG9ydCBmdW5jdGlvbiBnZXRGaWxlUGF0Y2hQYW5lSXRlbXMoe29ubHlTdGFnZWQsIGVtcHR5fSA9IHt9LCB3b3Jrc3BhY2UpIHtcbiAgaWYgKENoYW5nZWRGaWxlSXRlbSA9PT0gbnVsbCkge1xuICAgIENoYW5nZWRGaWxlSXRlbSA9IHJlcXVpcmUoJy4vaXRlbXMvY2hhbmdlZC1maWxlLWl0ZW0nKS5kZWZhdWx0O1xuICB9XG5cbiAgcmV0dXJuIHdvcmtzcGFjZS5nZXRQYW5lSXRlbXMoKS5maWx0ZXIoaXRlbSA9PiB7XG4gICAgY29uc3QgaXNGaWxlUGF0Y2hJdGVtID0gaXRlbSAmJiBpdGVtLmdldFJlYWxJdGVtICYmIGl0ZW0uZ2V0UmVhbEl0ZW0oKSBpbnN0YW5jZW9mIENoYW5nZWRGaWxlSXRlbTtcbiAgICBpZiAob25seVN0YWdlZCkge1xuICAgICAgcmV0dXJuIGlzRmlsZVBhdGNoSXRlbSAmJiBpdGVtLnN0YWdpbmdTdGF0dXMgPT09ICdzdGFnZWQnO1xuICAgIH0gZWxzZSBpZiAoZW1wdHkpIHtcbiAgICAgIHJldHVybiBpc0ZpbGVQYXRjaEl0ZW0gPyBpdGVtLmlzRW1wdHkoKSA6IGZhbHNlO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gaXNGaWxlUGF0Y2hJdGVtO1xuICAgIH1cbiAgfSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkZXN0cm95RmlsZVBhdGNoUGFuZUl0ZW1zKHtvbmx5U3RhZ2VkfSA9IHt9LCB3b3Jrc3BhY2UpIHtcbiAgY29uc3QgaXRlbXNUb0Rlc3Ryb3kgPSBnZXRGaWxlUGF0Y2hQYW5lSXRlbXMoe29ubHlTdGFnZWR9LCB3b3Jrc3BhY2UpO1xuICBpdGVtc1RvRGVzdHJveS5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5kZXN0cm95KCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVzdHJveUVtcHR5RmlsZVBhdGNoUGFuZUl0ZW1zKHdvcmtzcGFjZSkge1xuICBjb25zdCBpdGVtc1RvRGVzdHJveSA9IGdldEZpbGVQYXRjaFBhbmVJdGVtcyh7ZW1wdHk6IHRydWV9LCB3b3Jrc3BhY2UpO1xuICBpdGVtc1RvRGVzdHJveS5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5kZXN0cm95KCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXh0cmFjdENvQXV0aG9yc0FuZFJhd0NvbW1pdE1lc3NhZ2UoY29tbWl0TWVzc2FnZSkge1xuICBjb25zdCBtZXNzYWdlTGluZXMgPSBbXTtcbiAgY29uc3QgY29BdXRob3JzID0gW107XG5cbiAgZm9yIChjb25zdCBsaW5lIG9mIGNvbW1pdE1lc3NhZ2Uuc3BsaXQoTElORV9FTkRJTkdfUkVHRVgpKSB7XG4gICAgY29uc3QgbWF0Y2ggPSBsaW5lLm1hdGNoKENPX0FVVEhPUl9SRUdFWCk7XG4gICAgaWYgKG1hdGNoKSB7XG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgICAgIGNvbnN0IFtfLCBuYW1lLCBlbWFpbF0gPSBtYXRjaDtcbiAgICAgIGNvQXV0aG9ycy5wdXNoKG5ldyBBdXRob3IoZW1haWwsIG5hbWUpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWVzc2FnZUxpbmVzLnB1c2gobGluZSk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHttZXNzYWdlOiBtZXNzYWdlTGluZXMuam9pbignXFxuJyksIGNvQXV0aG9yc307XG59XG5cbi8vIEF0b20gQVBJIHBhbmUgaXRlbSBtYW5pcHVsYXRpb25cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUl0ZW0obm9kZSwgY29tcG9uZW50SG9sZGVyID0gbnVsbCwgdXJpID0gbnVsbCwgZXh0cmEgPSB7fSkge1xuICBjb25zdCBob2xkZXIgPSBjb21wb25lbnRIb2xkZXIgfHwgbmV3IFJlZkhvbGRlcigpO1xuXG4gIGNvbnN0IG92ZXJyaWRlID0ge1xuICAgIGdldEVsZW1lbnQ6ICgpID0+IG5vZGUsXG5cbiAgICBnZXRSZWFsSXRlbTogKCkgPT4gaG9sZGVyLmdldE9yKG51bGwpLFxuXG4gICAgZ2V0UmVhbEl0ZW1Qcm9taXNlOiAoKSA9PiBob2xkZXIuZ2V0UHJvbWlzZSgpLFxuXG4gICAgLi4uZXh0cmEsXG4gIH07XG5cbiAgaWYgKHVyaSkge1xuICAgIG92ZXJyaWRlLmdldFVSSSA9ICgpID0+IHVyaTtcbiAgfVxuXG4gIGlmIChjb21wb25lbnRIb2xkZXIpIHtcbiAgICByZXR1cm4gbmV3IFByb3h5KG92ZXJyaWRlLCB7XG4gICAgICBnZXQodGFyZ2V0LCBuYW1lKSB7XG4gICAgICAgIGlmIChSZWZsZWN0Lmhhcyh0YXJnZXQsIG5hbWUpKSB7XG4gICAgICAgICAgcmV0dXJuIHRhcmdldFtuYW1lXTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZSB7dmFsdWU6IC4uLn0gd3JhcHBlciBwcmV2ZW50cyAubWFwKCkgZnJvbSBmbGF0dGVuaW5nIGEgcmV0dXJuZWQgUmVmSG9sZGVyLlxuICAgICAgICAvLyBJZiBjb21wb25lbnRbbmFtZV0gaXMgYSBSZWZIb2xkZXIsIHdlIHdhbnQgdG8gcmV0dXJuIHRoYXQgUmVmSG9sZGVyIGFzLWlzLlxuICAgICAgICBjb25zdCB7dmFsdWV9ID0gaG9sZGVyLm1hcChjb21wb25lbnQgPT4gKHt2YWx1ZTogY29tcG9uZW50W25hbWVdfSkpLmdldE9yKHt2YWx1ZTogdW5kZWZpbmVkfSk7XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgIH0sXG5cbiAgICAgIHNldCh0YXJnZXQsIG5hbWUsIHZhbHVlKSB7XG4gICAgICAgIHJldHVybiBob2xkZXIubWFwKGNvbXBvbmVudCA9PiB7XG4gICAgICAgICAgY29tcG9uZW50W25hbWVdID0gdmFsdWU7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0pLmdldE9yKHRydWUpO1xuICAgICAgfSxcblxuICAgICAgaGFzKHRhcmdldCwgbmFtZSkge1xuICAgICAgICByZXR1cm4gaG9sZGVyLm1hcChjb21wb25lbnQgPT4gUmVmbGVjdC5oYXMoY29tcG9uZW50LCBuYW1lKSkuZ2V0T3IoZmFsc2UpIHx8IFJlZmxlY3QuaGFzKHRhcmdldCwgbmFtZSk7XG4gICAgICB9LFxuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBvdmVycmlkZTtcbiAgfVxufVxuXG4vLyBTZXQgZnVuY3Rpb25zXG5cbmV4cG9ydCBmdW5jdGlvbiBlcXVhbFNldHMobGVmdCwgcmlnaHQpIHtcbiAgaWYgKGxlZnQuc2l6ZSAhPT0gcmlnaHQuc2l6ZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIGZvciAoY29uc3QgZWFjaCBvZiBsZWZ0KSB7XG4gICAgaWYgKCFyaWdodC5oYXMoZWFjaCkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLy8gQ29uc3RhbnRzXG5cbmV4cG9ydCBjb25zdCBOQlNQX0NIQVJBQ1RFUiA9ICdcXHUwMGEwJztcblxuZXhwb3J0IGZ1bmN0aW9uIGJsYW5rTGFiZWwoKSB7XG4gIHJldHVybiBOQlNQX0NIQVJBQ1RFUjtcbn1cblxuZXhwb3J0IGNvbnN0IHJlYWN0aW9uVHlwZVRvRW1vamkgPSB7XG4gIFRIVU1CU19VUDogJ/CfkY0nLFxuICBUSFVNQlNfRE9XTjogJ/CfkY4nLFxuICBMQVVHSDogJ/CfmIYnLFxuICBIT09SQVk6ICfwn46JJyxcbiAgQ09ORlVTRUQ6ICfwn5iVJyxcbiAgSEVBUlQ6ICfinaTvuI8nLFxuICBST0NLRVQ6ICfwn5qAJyxcbiAgRVlFUzogJ/CfkYAnLFxufTtcblxuLy8gTWFya2Rvd25cblxubGV0IG1hcmtlZCA9IG51bGw7XG5sZXQgZG9tUHVyaWZ5ID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlck1hcmtkb3duKG1kKSB7XG4gIGlmIChtYXJrZWQgPT09IG51bGwpIHtcbiAgICBtYXJrZWQgPSByZXF1aXJlKCdtYXJrZWQnKTtcblxuICAgIGlmIChkb21QdXJpZnkgPT09IG51bGwpIHtcbiAgICAgIGNvbnN0IGNyZWF0ZURPTVB1cmlmeSA9IHJlcXVpcmUoJ2RvbXB1cmlmeScpO1xuICAgICAgZG9tUHVyaWZ5ID0gY3JlYXRlRE9NUHVyaWZ5KCk7XG4gICAgfVxuXG4gICAgbWFya2VkLnNldE9wdGlvbnMoe1xuICAgICAgc2lsZW50OiB0cnVlLFxuICAgICAgc2FuaXRpemU6IHRydWUsXG4gICAgICBzYW5pdGl6ZXI6IGh0bWwgPT4gZG9tUHVyaWZ5LnNhbml0aXplKGh0bWwpLFxuICAgIH0pO1xuICB9XG5cbiAgcmV0dXJuIG1hcmtlZChtZCk7XG59XG5cbmV4cG9ydCBjb25zdCBHSE9TVF9VU0VSID0ge1xuICBsb2dpbjogJ2dob3N0JyxcbiAgYXZhdGFyVXJsOiAnaHR0cHM6Ly9hdmF0YXJzMS5naXRodWJ1c2VyY29udGVudC5jb20vdS8xMDEzNz92PTQnLFxuICB1cmw6ICdodHRwczovL2dpdGh1Yi5jb20vZ2hvc3QnLFxufTtcbiJdfQ==