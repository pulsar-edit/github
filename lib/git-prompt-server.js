"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _net = _interopRequireDefault(require("net"));

var _eventKit = require("event-kit");

var _helpers = require("./helpers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class GitPromptServer {
  constructor(gitTempDir) {
    this.emitter = new _eventKit.Emitter();
    this.gitTempDir = gitTempDir;
    this.address = null;
  }

  async start(promptForInput) {
    this.promptForInput = promptForInput;
    await this.gitTempDir.ensure();
    this.server = await this.startListening(this.gitTempDir.getSocketOptions());
  }

  getAddress() {
    /* istanbul ignore if */
    if (!this.address) {
      throw new Error('Server is not listening');
    } else if (this.address.port) {
      // TCP socket
      return `tcp:${this.address.port}`;
    } else {
      // Unix domain socket
      return `unix:${(0, _helpers.normalizeGitHelperPath)(this.address)}`;
    }
  }

  startListening(socketOptions) {
    return new Promise(resolve => {
      const server = _net.default.createServer({
        allowHalfOpen: true
      }, connection => {
        connection.setEncoding('utf8');
        let payload = '';
        connection.on('data', data => {
          payload += data;
        });
        connection.on('end', () => {
          this.handleData(connection, payload);
        });
      });

      server.listen(socketOptions, () => {
        this.address = server.address();
        resolve(server);
      });
    });
  }

  async handleData(connection, data) {
    let query;

    try {
      query = JSON.parse(data);
      const answer = await this.promptForInput(query);
      await new Promise(resolve => {
        connection.end(JSON.stringify(answer), 'utf8', resolve);
      });
    } catch (e) {
      this.emitter.emit('did-cancel', query.pid ? {
        handlerPid: query.pid
      } : undefined);
    }
  }

  onDidCancel(cb) {
    return this.emitter.on('did-cancel', cb);
  }

  async terminate() {
    await new Promise(resolve => this.server.close(resolve));
    this.emitter.dispose();
  }

}

exports.default = GitPromptServer;