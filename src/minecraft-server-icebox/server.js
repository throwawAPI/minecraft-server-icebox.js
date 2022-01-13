/* minecraft-server-icebox/server.js
 *
 * TODO
 *
 */

const MSI = {};
MSI.Log   = require('./log.js');

const { spawn } = require('child_process');

class Server {
  constructor(options) {
    this.options = options;
    this.thaw();
  } // Server#constructor()

  thaw() {
    this.state   = 'thawing';
    MSI.Log.Server.withTime.info(`Starting SERVER: ${this.options.command}`);
    MSI.Log.Server.withTime.info(`SERVER directory: ${this.options.directory}`);

    // split the command into arguments and pluck the first one for spawn()
    const args    = this.options.command.split(' ');
    const command = args.shift();

    this.protocol = spawn(command, args, {
      cwd: this.options.directory,
    }); // spawn

    // record how long it took for the server to boot
    this.protocol.stdout.setEncoding('utf8');
    this.timeStart        = new Date();
    this.timeLastOccupied = this.protocol.timeStart;

    this.protocol.stdout.on('data', (function (data) {
      MSI.Log.Server.info(data);
      // TODO change to enums
      switch (this.state) {
        case 'thawing':
          // thawing means we're waiting on the `Done` message from the process
          // after this has happened, we will be able to interact on stdin
          if (data.indexOf('[Server thread/INFO]: Done') === 11) {
            let timeCurrent = this.timeLastOccupied = new Date();
            let timeStartup = ((timeCurrent - this.timeStart) / 1000).toFixed(3);
            MSI.Log.Icebox.info(`SERVER started in ${timeStartup} seconds`);
            this.state = 'running';
            this.sendCommand_List();
            // TODO these frequencies are hardcoded
            setInterval((function () { this.sendCommand_List() }).bind(this), 60_000); // ms
            setInterval((function () { this.shutdownIfEmpty()  }).bind(this),  1_000); // ms
          } // if `Done`
          break;

        case 'running':
        case 'countdown':
          let matchData = data.match(/\[Server thread\/INFO\]: There are (\d+) of a max of/);
          if (matchData !== null) {
            if (matchData[1] === '0') { // server is empty
              this.state = 'countdown';
              this.protocol.stdin.write(`say Server shutting down in ${this.timeRemaining(1)} seconds...\n`);
            } else { // server is occupied
              this.state = 'running';
              this.timeLastOccupied = new Date(); // reset countdown
            }
          } // if match
          break;

        case 'stopping': // do nothing
          break;
        default:
          throw new Error(`Unknown SERVER state: ${this.state}`);
      } // switch
    }).bind(this)); // this.protocol.stdout.on data
  } // Server#thaw()

  sendCommand_List() {
    switch (this.state) {
      case 'running':
      case 'countdown':
        this.protocol.stdin.write('list\n');
    } // switch
  } // Server#sendCommand_List()

  shutdownIfEmpty() {
    if (this.state === 'countdown') {
      if (this.timeRemaining() < 0) {
        this.protocol.stdin.write('stop\n');
        this.state = 'stopping';
      } // if timeRemaining < 0
    } // if state === countdown
  } // Server#shutdownIfEmpty()

  timeRemaining(decimals=0) {
    let exact = Math.round((this.options.timeout * 1_000 - (new Date() - this.timeLastOccupied)) / 1_000);
    return Math.round(exact / Math.pow(10, decimals)) * Math.pow(10, decimals);
  } // Server#timeRemaining()
} // class Server

module.exports = Server;
