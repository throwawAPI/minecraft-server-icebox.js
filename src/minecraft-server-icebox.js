const MSI = require('./minecraft-server-icebox/container.js');

new MSI({
  'online-mode':  true,
  'encryption':   true,
  'host':         '0.0.0.0',
  'port':         25565,
  'version':      '1.17.1',
  'maxPlayers':   10,
  'motd':         'SERVER NAME',
  'loginMessage': 'Thawing server... Please reconnect.',
  'command': 'java -Xms2048M -jar server.jar nogui', // set your command here
  // set directory to match your .jar location
  // on Windows, this looks like 'C:\\Users\\[Username]\\Minecraft Server'
  // on Mac or Linux, this looks like '/opt/minecraft/servers/server_folder'
  'directory': '.',
  'timeout': 120, // seconds
});
