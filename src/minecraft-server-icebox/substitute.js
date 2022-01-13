/* minecraft-server-icebox/substitute.js
 *
 * A Substitute is the server subbed in when the real server isn't running,
 * named after the pokemon move of the same name. This standin is low effort,
 * and will reply to handshake requests from other clients/servers as though
 * the server were still running.
 *
 */

const MSI    = {};
MSI.Log      = require('./log.js');
MSI.Protocol = require('minecraft-protocol');

class Substitute {
  constructor(options) {
    this.options = options;
    MSI.Log.Substitute.info(`Launching SUBSTITUTE server: ${this.options.motd}`);
    this.protocol = MSI.Protocol.createServer({
      // TODO remove hardcoded values
      'encryption':  options.encryption,
      'host':        options.host,
      'maxPlayers':  options.maxPlayers,
      'motd':        options.motd,
      'online-mode': options.onlineMode,
      'port':        options.port,
      'version':     options.version,
      // TODO enable the favicon
      //beforePing: (reponse) => {
      //  reponse.favicon = this.settings.favIcon ?? DefaultFavIconString;
      //}
    }); // MSI.Protocol.createServer
  } // Substitute#constructor()
}; // class Substitute

module.exports = Substitute;
