"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Keys = void 0;

class CacheKey {
  constructor(primary, groups = []) {
    this.primary = primary;
    this.groups = groups;
  }

  getPrimary() {
    return this.primary;
  }

  getGroups() {
    return this.groups;
  }

  removeFromCache(cache, withoutGroup = null) {
    cache.removePrimary(this.getPrimary());
    const groups = this.getGroups();

    for (let i = 0; i < groups.length; i++) {
      const group = groups[i];

      if (group === withoutGroup) {
        continue;
      }

      cache.removeFromGroup(group, this);
    }
  }
  /* istanbul ignore next */


  toString() {
    return `CacheKey(${this.primary})`;
  }

}

class GroupKey {
  constructor(group) {
    this.group = group;
  }

  removeFromCache(cache) {
    for (const matchingKey of cache.keysInGroup(this.group)) {
      matchingKey.removeFromCache(cache, this.group);
    }
  }
  /* istanbul ignore next */


  toString() {
    return `GroupKey(${this.group})`;
  }

}

const Keys = {
  statusBundle: new CacheKey('status-bundle'),
  stagedChanges: new CacheKey('staged-changes'),
  filePatch: {
    _optKey: ({
      staged
    }) => staged ? 's' : 'u',
    oneWith: (fileName, options) => {
      // <-- Keys.filePatch
      const optKey = Keys.filePatch._optKey(options);

      const baseCommit = options.baseCommit || 'head';
      const extraGroups = [];

      if (options.baseCommit) {
        extraGroups.push(`file-patch:base-nonhead:path-${fileName}`);
        extraGroups.push('file-patch:base-nonhead');
      } else {
        extraGroups.push('file-patch:base-head');
      }

      return new CacheKey(`file-patch:${optKey}:${baseCommit}:${fileName}`, ['file-patch', `file-patch:opt-${optKey}`, `file-patch:opt-${optKey}:path-${fileName}`, ...extraGroups]);
    },
    eachWithFileOpts: (fileNames, opts) => {
      const keys = [];

      for (let i = 0; i < fileNames.length; i++) {
        for (let j = 0; j < opts.length; j++) {
          keys.push(new GroupKey(`file-patch:opt-${Keys.filePatch._optKey(opts[j])}:path-${fileNames[i]}`));
        }
      }

      return keys;
    },
    eachNonHeadWithFiles: fileNames => {
      return fileNames.map(fileName => new GroupKey(`file-patch:base-nonhead:path-${fileName}`));
    },
    allAgainstNonHead: new GroupKey('file-patch:base-nonhead'),
    eachWithOpts: (...opts) => opts.map(opt => new GroupKey(`file-patch:opt-${Keys.filePatch._optKey(opt)}`)),
    all: new GroupKey('file-patch')
  },
  index: {
    oneWith: fileName => new CacheKey(`index:${fileName}`, ['index']),
    all: new GroupKey('index')
  },
  lastCommit: new CacheKey('last-commit'),
  recentCommits: new CacheKey('recent-commits'),
  authors: new CacheKey('authors'),
  branches: new CacheKey('branches'),
  headDescription: new CacheKey('head-description'),
  remotes: new CacheKey('remotes'),
  config: {
    _optKey: options => options.local ? 'l' : '',
    oneWith: (setting, options) => {
      const optKey = Keys.config._optKey(options);

      return new CacheKey(`config:${optKey}:${setting}`, ['config', `config:${optKey}`]);
    },
    eachWithSetting: setting => [Keys.config.oneWith(setting, {
      local: true
    }), Keys.config.oneWith(setting, {
      local: false
    })],
    all: new GroupKey('config')
  },
  blob: {
    oneWith: sha => new CacheKey(`blob:${sha}`, ['blob'])
  },
  // Common collections of keys and patterns for use with invalidate().
  workdirOperationKeys: fileNames => [Keys.statusBundle, ...Keys.filePatch.eachWithFileOpts(fileNames, [{
    staged: false
  }])],
  cacheOperationKeys: fileNames => [...Keys.workdirOperationKeys(fileNames), ...Keys.filePatch.eachWithFileOpts(fileNames, [{
    staged: true
  }]), ...fileNames.map(Keys.index.oneWith), Keys.stagedChanges],
  headOperationKeys: () => [Keys.headDescription, Keys.branches, ...Keys.filePatch.eachWithOpts({
    staged: true
  }), Keys.filePatch.allAgainstNonHead, Keys.stagedChanges, Keys.lastCommit, Keys.recentCommits, Keys.authors, Keys.statusBundle]
};
exports.Keys = Keys;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9tb2RlbHMvcmVwb3NpdG9yeS1zdGF0ZXMvY2FjaGUva2V5cy5qcyJdLCJuYW1lcyI6WyJDYWNoZUtleSIsImNvbnN0cnVjdG9yIiwicHJpbWFyeSIsImdyb3VwcyIsImdldFByaW1hcnkiLCJnZXRHcm91cHMiLCJyZW1vdmVGcm9tQ2FjaGUiLCJjYWNoZSIsIndpdGhvdXRHcm91cCIsInJlbW92ZVByaW1hcnkiLCJpIiwibGVuZ3RoIiwiZ3JvdXAiLCJyZW1vdmVGcm9tR3JvdXAiLCJ0b1N0cmluZyIsIkdyb3VwS2V5IiwibWF0Y2hpbmdLZXkiLCJrZXlzSW5Hcm91cCIsIktleXMiLCJzdGF0dXNCdW5kbGUiLCJzdGFnZWRDaGFuZ2VzIiwiZmlsZVBhdGNoIiwiX29wdEtleSIsInN0YWdlZCIsIm9uZVdpdGgiLCJmaWxlTmFtZSIsIm9wdGlvbnMiLCJvcHRLZXkiLCJiYXNlQ29tbWl0IiwiZXh0cmFHcm91cHMiLCJwdXNoIiwiZWFjaFdpdGhGaWxlT3B0cyIsImZpbGVOYW1lcyIsIm9wdHMiLCJrZXlzIiwiaiIsImVhY2hOb25IZWFkV2l0aEZpbGVzIiwibWFwIiwiYWxsQWdhaW5zdE5vbkhlYWQiLCJlYWNoV2l0aE9wdHMiLCJvcHQiLCJhbGwiLCJpbmRleCIsImxhc3RDb21taXQiLCJyZWNlbnRDb21taXRzIiwiYXV0aG9ycyIsImJyYW5jaGVzIiwiaGVhZERlc2NyaXB0aW9uIiwicmVtb3RlcyIsImNvbmZpZyIsImxvY2FsIiwic2V0dGluZyIsImVhY2hXaXRoU2V0dGluZyIsImJsb2IiLCJzaGEiLCJ3b3JrZGlyT3BlcmF0aW9uS2V5cyIsImNhY2hlT3BlcmF0aW9uS2V5cyIsImhlYWRPcGVyYXRpb25LZXlzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUEsTUFBTUEsUUFBTixDQUFlO0FBQ2JDLEVBQUFBLFdBQVcsQ0FBQ0MsT0FBRCxFQUFVQyxNQUFNLEdBQUcsRUFBbkIsRUFBdUI7QUFDaEMsU0FBS0QsT0FBTCxHQUFl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Q2hCLElBQUFBLE1BQU0sRUFBRTtBQUFULEdBQTVCLENBSG9CLEVBSXZCTCxJQUFJLENBQUNHLFNBQUwsQ0FBZWlCLGlCQUpRLEVBS3ZCcEIsSUFBSSxDQUFDRSxhQUxrQixFQU12QkYsSUFBSSxDQUFDeUIsVUFOa0IsRUFPdkJ6QixJQUFJLENBQUMwQixhQVBrQixFQVF2QjFCLElBQUksQ0FBQzJCLE9BUmtCLEVBU3ZCM0IsSUFBSSxDQUFDQyxZQVRrQjtBQXJHUCxDQUFiIiwic291cmNlc0NvbnRlbnQiOlsiY2xhc3MgQ2FjaGVLZXkge1xuICBjb25zdHJ1Y3RvcihwcmltYXJ5LCBncm91cHMgPSBbXSkge1xuICAgIHRoaXMucHJpbWFyeSA9IHByaW1hcnk7XG4gICAgdGhpcy5ncm91cHMgPSBncm91cHM7XG4gIH1cblxuICBnZXRQcmltYXJ5KCkge1xuICAgIHJldHVybiB0aGlzLnByaW1hcnk7XG4gIH1cblxuICBnZXRHcm91cHMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ3JvdXBzO1xuICB9XG5cbiAgcmVtb3ZlRnJvbUNhY2hlKGNhY2hlLCB3aXRob3V0R3JvdXAgPSBudWxsKSB7XG4gICAgY2FjaGUucmVtb3ZlUHJpbWFyeSh0aGlzLmdldFByaW1hcnkoKSk7XG5cbiAgICBjb25zdCBncm91cHMgPSB0aGlzLmdldEdyb3VwcygpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JvdXBzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBncm91cCA9IGdyb3Vwc1tpXTtcbiAgICAgIGlmIChncm91cCA9PT0gd2l0aG91dEdyb3VwKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuXG4gICAgICBjYWNoZS5yZW1vdmVGcm9tR3JvdXAoZ3JvdXAsIHRoaXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiBgQ2FjaGVLZXkoJHt0aGlzLnByaW1hcnl9KWA7XG4gIH1cbn1cblxuY2xhc3MgR3JvdXBLZXkge1xuICBjb25zdHJ1Y3Rvcihncm91cCkge1xuICAgIHRoaXMuZ3JvdXAgPSBncm91cDtcbiAgfVxuXG4gIHJlbW92ZUZyb21DYWNoZShjYWNoZSkge1xuICAgIGZvciAoY29uc3QgbWF0Y2hpbmdLZXkgb2YgY2FjaGUua2V5c0luR3JvdXAodGhpcy5ncm91cCkpIHtcbiAgICAgIG1hdGNoaW5nS2V5LnJlbW92ZUZyb21DYWNoZShjYWNoZSwgdGhpcy5ncm91cCk7XG4gICAgfVxuICB9XG5cbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIGBHcm91cEtleSgke3RoaXMuZ3JvdXB9KWA7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IEtleXMgPSB7XG4gIHN0YXR1c0J1bmRsZTogbmV3IENhY2hlS2V5KCdzdGF0dXMtYnVuZGxlJyksXG5cbiAgc3RhZ2VkQ2hhbmdlczogbmV3IENhY2hlS2V5KCdzdGFnZWQtY2hhbmdlcycpLFxuXG4gIGZpbGVQYXRjaDoge1xuICAgIF9vcHRLZXk6ICh7c3RhZ2VkfSkgPT4gKHN0YWdlZCA/ICdzJyA6ICd1JyksXG5cbiAgICBvbmVXaXRoOiAoZmlsZU5hbWUsIG9wdGlvbnMpID0+IHsgLy8gPC0tIEtleXMuZmlsZVBhdGNoXG4gICAgICBjb25zdCBvcHRLZXkgPSBLZXlzLmZpbGVQYXRjaC5fb3B0S2V5KG9wdGlvbnMpO1xuICAgICAgY29uc3QgYmFzZUNvbW1pdCA9IG9wdGlvbnMuYmFzZUNvbW1pdCB8fCAnaGVhZCc7XG5cbiAgICAgIGNvbnN0IGV4dHJhR3JvdXBzID0gW107XG4gICAgICBpZiAob3B0aW9ucy5iYXNlQ29tbWl0KSB7XG4gICAgICAgIGV4dHJhR3JvdXBzLnB1c2goYGZpbGUtcGF0Y2g6YmFzZS1ub25oZWFkOnBhdGgtJHtmaWxlTmFtZX1gKTtcbiAgICAgICAgZXh0cmFHcm91cHMucHVzaCgnZmlsZS1wYXRjaDpiYXNlLW5vbmhlYWQnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGV4dHJhR3JvdXBzLnB1c2goJ2ZpbGUtcGF0Y2g6YmFzZS1oZWFkJyk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBuZXcgQ2FjaGVLZXkoYGZpbGUtcGF0Y2g6JHtvcHRLZXl9OiR7YmFzZUNvbW1pdH06JHtmaWxlTmFtZX1gLCBbXG4gICAgICAgICdmaWxlLXBhdGNoJyxcbiAgICAgICAgYGZpbGUtcGF0Y2g6b3B0LSR7b3B0S2V5fWAsXG4gICAgICAgIGBmaWxlLXBhdGNoOm9wdC0ke29wdEtleX06cGF0aC0ke2ZpbGVOYW1lfWAsXG4gICAgICAgIC4uLmV4dHJhR3JvdXBzLFxuICAgICAgXSk7XG4gICAgfSxcblxuICAgIGVhY2hXaXRoRmlsZU9wdHM6IChmaWxlTmFtZXMsIG9wdHMpID0+IHtcbiAgICAgIGNvbnN0IGtleXMgPSBbXTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZmlsZU5hbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgb3B0cy5sZW5ndGg7IGorKykge1xuICAgICAgICAgIGtleXMucHVzaChuZXcgR3JvdXBLZXkoYGZpbGUtcGF0Y2g6b3B0LSR7S2V5cy5maWxlUGF0Y2guX29wdEtleShvcHRzW2pdKX06cGF0aC0ke2ZpbGVOYW1lc1tpXX1gKSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBrZXlzO1xuICAgIH0sXG5cbiAgICBlYWNoTm9uSGVhZFdpdGhGaWxlczogZmlsZU5hbWVzID0+IHtcbiAgICAgIHJldHVybiBmaWxlTmFtZXMubWFwKGZpbGVOYW1lID0+IG5ldyBHcm91cEtleShgZmlsZS1wYXRjaDpiYXNlLW5vbmhlYWQ6cGF0aC0ke2ZpbGVOYW1lfWApKTtcbiAgICB9LFxuXG4gICAgYWxsQWdhaW5zdE5vbkhlYWQ6IG5ldyBHcm91cEtleSgnZmlsZS1wYXRjaDpiYXNlLW5vbmhlYWQnKSxcblxuICAgIGVhY2hXaXRoT3B0czogKC4uLm9wdHMpID0+IG9wdHMubWFwKG9wdCA9PiBuZXcgR3JvdXBLZXkoYGZpbGUtcGF0Y2g6b3B0LSR7S2V5cy5maWxlUGF0Y2guX29wdEtleShvcHQpfWApKSxcblxuICAgIGFsbDogbmV3IEdyb3VwS2V5KCdmaWxlLXBhdGNoJyksXG4gIH0sXG5cbiAgaW5kZXg6IHtcbiAgICBvbmVXaXRoOiBmaWxlTmFtZSA9PiBuZXcgQ2FjaGVLZXkoYGluZGV4OiR7ZmlsZU5hbWV9YCwgWydpbmRleCddKSxcblxuICAgIGFsbDogbmV3IEdyb3VwS2V5KCdpbmRleCcpLFxuICB9LFxuXG4gIGxhc3RDb21taXQ6IG5ldyBDYWNoZUtleSgnbGFzdC1jb21taXQnKSxcblxuICByZWNlbnRDb21taXRzOiBuZXcgQ2FjaGVLZXkoJ3JlY2VudC1jb21taXRzJyksXG5cbiAgYXV0aG9yczogbmV3IENhY2hlS2V5KCdhdXRob3JzJyksXG5cbiAgYnJhbmNoZXM6IG5ldyBDYWNoZUtleSgnYnJhbmNoZXMnKSxcblxuICBoZWFkRGVzY3JpcHRpb246IG5ldyBDYWNoZUtleSgnaGVhZC1kZXNjcmlwdGlvbicpLFxuXG4gIHJlbW90ZXM6IG5ldyBDYWNoZUtleSgncmVtb3RlcycpLFxuXG4gIGNvbmZpZzoge1xuICAgIF9vcHRLZXk6IG9wdGlvbnMgPT4gKG9wdGlvbnMubG9jYWwgPyAnbCcgOiAnJyksXG5cbiAgICBvbmVXaXRoOiAoc2V0dGluZywgb3B0aW9ucykgPT4ge1xuICAgICAgY29uc3Qgb3B0S2V5ID0gS2V5cy5jb25maWcuX29wdEtleShvcHRpb25zKTtcbiAgICAgIHJldHVybiBuZXcgQ2FjaGVLZXkoYGNvbmZpZzoke29wdEtleX06JHtzZXR0aW5nfWAsIFsnY29uZmlnJywgYGNvbmZpZzoke29wdEtleX1gXSk7XG4gICAgfSxcblxuICAgIGVhY2hXaXRoU2V0dGluZzogc2V0dGluZyA9PiBbXG4gICAgICBLZXlzLmNvbmZpZy5vbmVXaXRoKHNldHRpbmcsIHtsb2NhbDogdHJ1ZX0pLFxuICAgICAgS2V5cy5jb25maWcub25lV2l0aChzZXR0aW5nLCB7bG9jYWw6IGZhbHNlfSksXG4gICAgXSxcblxuICAgIGFsbDogbmV3IEdyb3VwS2V5KCdjb25maWcnKSxcbiAgfSxcblxuICBibG9iOiB7XG4gICAgb25lV2l0aDogc2hhID0+IG5ldyBDYWNoZUtleShgYmxvYjoke3NoYX1gLCBbJ2Jsb2InXSksXG4gIH0sXG5cbiAgLy8gQ29tbW9uIGNvbGxlY3Rpb25zIG9mIGtleXMgYW5kIHBhdHRlcm5zIGZvciB1c2Ugd2l0aCBpbnZhbGlkYXRlKCkuXG5cbiAgd29ya2Rpck9wZXJhdGlvbktleXM6IGZpbGVOYW1lcyA9PiBbXG4gICAgS2V5cy5zdGF0dXNCdW5kbGUsXG4gICAgLi4uS2V5cy5maWxlUGF0Y2guZWFjaFdpdGhGaWxlT3B0cyhmaWxlTmFtZXMsIFt7c3RhZ2VkOiBmYWxzZX1dKSxcbiAgXSxcblxuICBjYWNoZU9wZXJhdGlvbktleXM6IGZpbGVOYW1lcyA9PiBbXG4gICAgLi4uS2V5cy53b3JrZGlyT3BlcmF0aW9uS2V5cyhmaWxlTmFtZXMpLFxuICAgIC4uLktleXMuZmlsZVBhdGNoLmVhY2hXaXRoRmlsZU9wdHMoZmlsZU5hbWVzLCBbe3N0YWdlZDogdHJ1ZX1dKSxcbiAgICAuLi5maWxlTmFtZXMubWFwKEtleXMuaW5kZXgub25lV2l0aCksXG4gICAgS2V5cy5zdGFnZWRDaGFuZ2VzLFxuICBdLFxuXG4gIGhlYWRPcGVyYXRpb25LZXlzOiAoKSA9PiBbXG4gICAgS2V5cy5oZWFkRGVzY3JpcHRpb24sXG4gICAgS2V5cy5icmFuY2hlcyxcbiAgICAuLi5LZXlzLmZpbGVQYXRjaC5lYWNoV2l0aE9wdHMoe3N0YWdlZDogdHJ1ZX0pLFxuICAgIEtleXMuZmlsZVBhdGNoLmFsbEFnYWluc3ROb25IZWFkLFxuICAgIEtleXMuc3RhZ2VkQ2hhbmdlcyxcbiAgICBLZXlzLmxhc3RDb21taXQsXG4gICAgS2V5cy5yZWNlbnRDb21taXRzLFxuICAgIEtleXMuYXV0aG9ycyxcbiAgICBLZXlzLnN0YXR1c0J1bmRsZSxcbiAgXSxcbn07XG4iXX0=