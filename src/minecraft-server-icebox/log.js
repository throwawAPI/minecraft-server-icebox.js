const COLOR_RESET = '\x1b[0m';

const Log = {
  COLOR: {
    ICEBOX_CODE:     '\x1b[36m', // cyan by default
    SERVER_CODE:     '\x1b[33m', // yellow by default
    SUBSTITUTE_CODE: '\x1b[35m', // magenta by default
    ICEBOX: function (str) {
      return Log.COLOR.ICEBOX_CODE + str + COLOR_RESET;
    },
    SERVER: function (str) {
      return Log.COLOR.SERVER_CODE + str + COLOR_RESET;
    },
    SUBSTITUTE: function (str) {
      return Log.COLOR.SUBSTITUTE_CODE + str + COLOR_RESET;
    }, // SUBSTITUTE()
  }, // COLOR

  Icebox: {
    info: function () {
      const time = new Date();
      console.info(
        Log.COLOR.ICEBOX('[ICEBOX    ]'),
        `[${time.toLocaleTimeString('en-US', { hourCycle: 'h23' })}]`, // hacky way to get 24hr time
        Array.from(arguments).join(' ')
      );
    }, // function info()
  }, // Icebox

  Substitute: {
    info: function () {
      const time = new Date();
      console.info(
        Log.COLOR.SUBSTITUTE('[SUBSTITUTE]'),
        `[${time.toLocaleTimeString('en-US', { hourCycle: 'h23' })}]`, // hacky way to get 24hr time
        Array.from(arguments).join(' ')
      );
    }, // function info()
  }, // icebox

  Server: {
    info: function () {
      for (const arg of arguments) {
        console.info(
          Log.COLOR.SERVER('[SERVER    ]'),
          arg.trimEnd().split('\n').join('\n' + Log.COLOR.SERVER('[SERVER    ] '))
        );
      } // for arg of arguments
    }, // function info()
    withTime: {
      info: function () {
        const time = new Date();
        console.info(
          Log.COLOR.SERVER('[SERVER    ]'),
          `[${time.toLocaleTimeString('en-US', { hourCycle: 'h23' })}]`, // hacky way to get 24hr time
          Array.from(arguments).join(' ')
        );
      }, // function info()
    }, // withTime
  }, // server
}; // Log

module.exports = Log;
