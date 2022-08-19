"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.nullAuthor = exports.default = exports.NO_REPLY_GITHUB_EMAIL = void 0;
const NEW = Symbol('new');
const NO_REPLY_GITHUB_EMAIL = 'noreply@github.com';
exports.NO_REPLY_GITHUB_EMAIL = NO_REPLY_GITHUB_EMAIL;

class Author {
  constructor(email, fullName, login = null, isNew = null, avatarUrl = null) {
    if (avatarUrl == null) {
      const match = (email || '').match(/^(\d+)\+[^@]+@users.noreply.github.com$/);

      if (match) {
        avatarUrl = 'https://avatars.githubusercontent.com/u/' + match[1] + '?s=32';
      } else if (email && email !== '') {
        avatarUrl = 'https://avatars.githubusercontent.com/u/e?email=' + encodeURIComponent(email) + '&s=32';
      } else {
        avatarUrl = '';
      }
    }

    this.email = email;
    this.fullName = fullName;
    this.login = login;
    this.new = isNew === NEW;
    this.avatarUrl = avatarUrl;
  }

  static createNew(email, fullName) {
    return new this(email, fullName, null, NEW);
  }

  getEmail() {
    return this.email;
  }

  getAvatarUrl() {
    return this.avatarUrl;
  }

  getFullName() {
    return this.fullName;
  }

  getLogin() {
    return this.login;
  }

  isNoReply() {
    return this.email === NO_REPLY_GITHUB_EMAIL;
  }

  hasLogin() {
    return this.login !== null;
  }

  isNew() {
    return this.new;
  }

  isPresent() {
    return true;
  }

  matches(other) {
    return this.getEmail() === other.getEmail();
  }

  toString() {
    let s = `${this.fullName} <${this.email}>`;

    if (this.hasLogin()) {
      s += ` @${this.login}`;
    }

    return s;
  }

  static compare(a, b) {
    if (a.getFullName() < b.getFullName()) {
      return -1;
    }

    if (a.getFullName() > b.getFullName()) {
      return 1;
    }

    return 0;
  }

}

exports.default = Author;
const nullAuthor = {
  getEmail() {
    return '';
  },

  getAvatarUrl() {
    return '';
  },

  getFullName() {
    return '';
  },

  getLogin() {
    return null;
  },

  isNoReply() {
    return false;
  },

  hasLogin() {
    return false;
  },

  isNew() {
    return false;
  },

  isPresent() {
    return false;
  },

  matches(other) {
    return other === this;
  },

  toString() {
    return 'null author';
  }

};
exports.nullAuthor = nullAuthor;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9tb2RlbHMvYXV0aG9yLmpzIl0sIm5hbWVzIjpbIk5FVyIsIlN5bWJvbCIsIk5PX1JFUExZX0dJVEhVQl9FTUFJTCIsIkF1dGhvciIsImNvbnN0cnVjdG9yIiwiZW1haWwiLCJmdWxsTmFtZSIsImxvZ2luIiwiaXNOZXciLCJhdmF0YXJVcmwiLCJtYXRjaCIsImVuY29kZVVSSUNvbXBvbmVudCIsIm5ldyIsImNyZWF0ZU5ldyIsImdldEVtYWlsIiwiZ2V0QXZhdGFyVXJsIiwiZ2V0RnVsbE5hbWUiLCJnZXRMb2dpbiIsImlzTm9SZXBseSIsImhhc0xvZ2luIiwiaXNQcmVzZW50IiwibWF0Y2hlcyIsIm90aGVyIiwidG9TdHJpbmciLCJzIiwiY29tcGFyZSIsImEiLCJiIiwibnVsbEF1dGhvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7O0FBQUEsTUFBTUEsR0FBRyxHQUFHQyxNQUFNLENBQUMsS0FBRCxDQUFsQjtBQUVPLE1BQU1DLHFCQUFxQixHQUFHLG9CQUE5Qjs7O0FBRVEsTUFBTUMsTUFBTixDQUFhO0FBQzFCQyxFQUFBQSxXQUFXLENBQUNDLEtBQUQsRUFBUUMsUUFBUixFQUFrQkMsS0FBSyxHQUFHLElBQTFCLEVBQWdDQyxLQUFLLEdBQUcsSUFBeEMsRUFBOENDLFNBQVMsR0FBRyxJQUExRCxFQUFnRTtBQUN6RSxRQUFJQSxTQUFTLElBQUksSUFBakIsRUFBdUI7QUFDckIsWUFBTUMsS0FBSyxHQUFHLENBQUNMLEtBQUssSUFBSSxFQUFWLEVBQWNLLEtBQWQsQ0FBb0IseUNBQXBCLENBQWQ7O0FBRUEsVUFBSUEsS0FBSixFQUFXO0FBQ1RELFFBQUFBLFNBQVMsR0FBRyw2Q0FBNkNDLEtBQUssQ0FBQyxDQUFELENBQWxELEdBQXdELE9BQXBFO0FBQ0QsT0FGRCxNQUVPLElBQUlMLEtBQUssSUFBSUEsS0FBSyxLQUFLLEVBQXZCLEVBQTJCO0FBQ2hDSSxRQUFBQSxTQUFTLEdBQUcscURBQXFERSxrQkFBa0IsQ0FBQ04sS0FBRCxDQUF2RSxH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QUEsUUFBUSxHQUFHO0FBQ1QsV0FBTyxhQUFQO0FBQ0Q7O0FBdkN1QixDQUFuQiIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IE5FVyA9IFN5bWJvbCgnbmV3Jyk7XG5cbmV4cG9ydCBjb25zdCBOT19SRVBMWV9HSVRIVUJfRU1BSUwgPSAnbm9yZXBseUBnaXRodWIuY29tJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXV0aG9yIHtcbiAgY29uc3RydWN0b3IoZW1haWwsIGZ1bGxOYW1lLCBsb2dpbiA9IG51bGwsIGlzTmV3ID0gbnVsbCwgYXZhdGFyVXJsID0gbnVsbCkge1xuICAgIGlmIChhdmF0YXJVcmwgPT0gbnVsbCkge1xuICAgICAgY29uc3QgbWF0Y2ggPSAoZW1haWwgfHwgJycpLm1hdGNoKC9eKFxcZCspXFwrW15AXStAdXNlcnMubm9yZXBseS5naXRodWIuY29tJC8pO1xuXG4gICAgICBpZiAobWF0Y2gpIHtcbiAgICAgICAgYXZhdGFyVXJsID0gJ2h0dHBzOi8vYXZhdGFycy5naXRodWJ1c2VyY29udGVudC5jb20vdS8nICsgbWF0Y2hbMV0gKyAnP3M9MzInO1xuICAgICAgfSBlbHNlIGlmIChlbWFpbCAmJiBlbWFpbCAhPT0gJycpIHtcbiAgICAgICAgYXZhdGFyVXJsID0gJ2h0dHBzOi8vYXZhdGFycy5naXRodWJ1c2VyY29udGVudC5jb20vdS9lP2VtYWlsPScgKyBlbmNvZGVVUklDb21wb25lbnQoZW1haWwpICsgJyZzPTMyJztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGF2YXRhclVybCA9ICcnO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMuZW1haWwgPSBlbWFpbDtcbiAgICB0aGlzLmZ1bGxOYW1lID0gZnVsbE5hbWU7XG4gICAgdGhpcy5sb2dpbiA9IGxvZ2luO1xuICAgIHRoaXMubmV3ID0gaXNOZXcgPT09IE5FVztcbiAgICB0aGlzLmF2YXRhclVybCA9IGF2YXRhclVybDtcbiAgfVxuXG4gIHN0YXRpYyBjcmVhdGVOZXcoZW1haWwsIGZ1bGxOYW1lKSB7XG4gICAgcmV0dXJuIG5ldyB0aGlzKGVtYWlsLCBmdWxsTmFtZSwgbnVsbCwgTkVXKTtcbiAgfVxuXG4gIGdldEVtYWlsKCkge1xuICAgIHJldHVybiB0aGlzLmVtYWlsO1xuICB9XG5cbiAgZ2V0QXZhdGFyVXJsKCkge1xuICAgIHJldHVybiB0aGlzLmF2YXRhclVybDtcbiAgfVxuXG4gIGdldEZ1bGxOYW1lKCkge1xuICAgIHJldHVybiB0aGlzLmZ1bGxOYW1lO1xuICB9XG5cbiAgZ2V0TG9naW4oKSB7XG4gICAgcmV0dXJuIHRoaXMubG9naW47XG4gIH1cblxuICBpc05vUmVwbHkoKSB7XG4gICAgcmV0dXJuIHRoaXMuZW1haWwgPT09IE5PX1JFUExZX0dJVEhVQl9FTUFJTDtcbiAgfVxuXG4gIGhhc0xvZ2luKCkge1xuICAgIHJldHVybiB0aGlzLmxvZ2luICE9PSBudWxsO1xuICB9XG5cbiAgaXNOZXcoKSB7XG4gICAgcmV0dXJuIHRoaXMubmV3O1xuICB9XG5cbiAgaXNQcmVzZW50KCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgbWF0Y2hlcyhvdGhlcikge1xuICAgIHJldHVybiB0aGlzLmdldEVtYWlsKCkgPT09IG90aGVyLmdldEVtYWlsKCk7XG4gIH1cblxuICB0b1N0cmluZygpIHtcbiAgICBsZXQgcyA9IGAke3RoaXMuZnVsbE5hbWV9IDwke3RoaXMuZW1haWx9PmA7XG4gICAgaWYgKHRoaXMuaGFzTG9naW4oKSkge1xuICAgICAgcyArPSBgIEAke3RoaXMubG9naW59YDtcbiAgICB9XG4gICAgcmV0dXJuIHM7XG4gIH1cblxuICBzdGF0aWMgY29tcGFyZShhLCBiKSB7XG4gICAgaWYgKGEuZ2V0RnVsbE5hbWUoKSA8IGIuZ2V0RnVsbE5hbWUoKSkgeyByZXR1cm4gLTE7IH1cbiAgICBpZiAoYS5nZXRGdWxsTmFtZSgpID4gYi5nZXRGdWxsTmFtZSgpKSB7IHJldHVybiAxOyB9XG4gICAgcmV0dXJuIDA7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IG51bGxBdXRob3IgPSB7XG4gIGdldEVtYWlsKCkge1xuICAgIHJldHVybiAnJztcbiAgfSxcblxuICBnZXRBdmF0YXJVcmwoKSB7XG4gICAgcmV0dXJuICcnO1xuICB9LFxuXG4gIGdldEZ1bGxOYW1lKCkge1xuICAgIHJldHVybiAnJztcbiAgfSxcblxuICBnZXRMb2dpbigpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfSxcblxuICBpc05vUmVwbHkoKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9LFxuXG4gIGhhc0xvZ2luKCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcblxuICBpc05ldygpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG5cbiAgaXNQcmVzZW50KCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfSxcblxuICBtYXRjaGVzKG90aGVyKSB7XG4gICAgcmV0dXJuIG90aGVyID09PSB0aGlzO1xuICB9LFxuXG4gIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiAnbnVsbCBhdXRob3InO1xuICB9LFxufTtcbiJdfQ==