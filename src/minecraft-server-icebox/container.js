class MinecraftServerIcebox {
  static Log        = require('./log.js');
  static Protocol   = require('minecraft-protocol');
  static Server     = require('./server.js');
  static Substitute = require('./substitute.js');

  constructor(options) {
    this.options = options;
    this.state   = 'freezing';
    this.freeze();
  } // MinecraftServerIcebox#constructor()

  async freeze() {
    MinecraftServerIcebox.Log.Icebox.info('Freezing SERVER...');
    this.substitute = new MinecraftServerIcebox.Substitute(this.options);

    // triggered when the substitute server is initialized
    this.substitute.protocol.on('listening', (function () {
      this.state = 'frozen';
      MinecraftServerIcebox.Log.Substitute.info('Listening for connections...');
    }).bind(this)); // causes `this` to retain its meaning

    // triggered when a client attempts to connect to the substitute
    this.substitute.protocol.on('login', (function (client) {
      MinecraftServerIcebox.Log.Substitute.info(`Client connection from ${client.username}`);
      client.on('end', function() {
        MinecraftServerIcebox.Log.Substitute.info(`Connection ended to ${client.username}`);
      });
      client.end(this.options.loginMessage);
      switch (this.state) {
        case 'frozen':
          this.state = 'thawing';
          this.substitute.protocol.close();
          delete this.substitute;
          this.thaw();
          break;
        case 'thawing':
          MinecraftServerIcebox.Log.Icebox.info(`SERVER is already thawing... ignoring ${client.username}`)
          break;
        default:
          throw new Error(`Unknown ICEBOX state: ${this.state}`);
      }
    }).bind(this)); // causes `this` to retain its meaning
  } // MinecraftServerIcebox#freeze()

  async thaw() {
    MinecraftServerIcebox.Log.Icebox.info('Thawing SERVER...');
    this.server = new MinecraftServerIcebox.Server(this.options);
    this.server.protocol.on('close', (function (exitCode) {
      MinecraftServerIcebox.Log.Icebox.info('SERVER closed');
      delete this.server;
      this.freeze();
    }).bind(this));
  } // MinecraftServerIcebox#thaw()
} // class MinecraftServerIcebox

module.exports = MinecraftServerIcebox;
