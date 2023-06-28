import { ENABLE_LOG, ENV } from '@/common/constants';
import * as Sentry from "@sentry/browser";

class Logger {
  ENV = "";
  ENABLE_LOG = true;
  ENABLE_SENTRY = true;
  SENTRY_DSN_KEY = "";

  /**
   * @param {string} env - 현재 서버
   * @param {string} enableLog - 로그 사용 여부
   * @param {string} enableSentry - Sentry 사용 여부
   * @param {string} dsnKey - Sentry DSN Key
   */
  constructor({
    env,
    enableLog,
    enableSentry,
    dsnKey,
  }: {
    env: string;
    enableLog: boolean;
    enableSentry: boolean;
    dsnKey: string;
  }) {
    this.ENABLE_LOG = enableLog;
    this.ENABLE_SENTRY = enableSentry;
    this.SENTRY_DSN_KEY = dsnKey;
    this.ENV = env;
    Sentry.init({
      dsn: this.ENABLE_SENTRY ? this.SENTRY_DSN_KEY : undefined,
      enabled: this.ENABLE_SENTRY ? true : false,
      integrations: [
        new Sentry.BrowserTracing(),
        new Sentry.Integrations.Breadcrumbs({
          console: false,
        }),
      ],
      beforeSend(event, hint) {
        if (
          event.exception?.values &&
          (event.exception?.values[0].type === "AxiosError" ||
            event.exception?.values[0].type === "TypeError")
        ) {
          return null;
        }
        return event;
      },
      tracesSampleRate: 0.7,
      ignoreErrors: [/TypeError.*/, /AxiosError.*/],
      environment: this.ENV,
    });
  }

  debug = (msg?: any, ...optionalParams: any[]) => {
    this.ENABLE_LOG && console.debug(msg, ...optionalParams);
  };
  info = (msg?: any, ...optionalParams: any[]) => {
    this.ENABLE_LOG && console.info(msg, ...optionalParams);
  };
  log = (msg?: any, ...optionalParams: any[]) => {
    this.ENABLE_LOG && console.log(msg, ...optionalParams);
  };
  error = (msg?: any, ...optionalParams: any[]) => {
    this.ENABLE_LOG && console.error(msg, ...optionalParams);
    this.ENABLE_SENTRY && Sentry.captureMessage(msg, "error");
  };
  exception = (err?: any, ...optionalParams: any[]) => {
    this.ENABLE_LOG && console.error("[EXCEPTION]: ", err, ...optionalParams);
    this.ENABLE_SENTRY && Sentry.captureException(err);
  };
  fatal = (msg?: any, ...optionalParams: any[]) => {
    this.ENABLE_LOG && console.error("[FATAL ERROR]: ", msg, ...optionalParams);
  };
  enable = () => (this.ENABLE_LOG = true);
  disable = () => (this.ENABLE_LOG = false);
}

// export { Logger as default };  // 다른 파일에서 init 할 시 사용
export const logger = new Logger({
  env: ENV,
  enableLog: ENABLE_LOG,
  enableSentry: false,
  dsnKey: '',
});

//사용 예시
// export const logger = new Logger({
//   env: ENV,
//   enableLog: ENABLE_LOG,
//   enableSentry: false,
//   dsnKey: '',
// });

/**
//enableSentry value는 함수로 빼서 현재 서버랑 비교해서 live가 아닐 때만 사용(default)
const handleEnableSentry = (bool: boolean) => {
  return bool && ENV === 'LIVE';
};

export const testObj = new Logger({
  env: ENV,
  enableSentry: handleEnableSentry(false),
  enableLog: true,
  dsnKey: SENTRY_DSN_KEY,
});
*/


/** -------------- 다른 방법 예시 (Drhong) */
// import { LogColor } from '../types';

// const LOG = (function () {
// 	let colorSet = '';
// 	let isOn = false;
// 	function changeBy(isBoolean: boolean) {
// 		isOn = isBoolean;
// 	}

// 	return {
// 		info: function (name: string, msg: string, color: LogColor) {
// 			switch (color) {
// 				case 'success':
// 					colorSet = 'Green';
// 					break;
// 				case 'info':
// 					colorSet = 'Blue';
// 					break;
// 				case 'error':
// 					colorSet = 'Red';
// 					break;
// 				case 'warning':
// 					colorSet = 'Orange';
// 					break;
// 				default:
// 					colorSet = 'black';
// 			}

// 			if (isOn) console.log('%c>>>>' + name + '::> %c' + msg, 'font-weight:bold;color:' + colorSet, 'color:black');
// 		},

// 		warn: function () {
// 			var args = Array.prototype.slice.call(arguments);
// 			args.unshift('[CLV:warn]');
// 			if (isOn) window.console.log.apply(window.console, args);
// 		},

// 		error: function () {
// 			var args = Array.prototype.slice.call(arguments);
// 			args.unshift('[CLV:error]');
// 			if (isOn) {
// 				window.console.log.apply(window.console, args);
// 				throw new Error('[CLV:error]');
// 			}
// 		},

// 		// console on / off function

// 		on: function () {
// 			changeBy(true);
// 			return 'log is enable';
// 		},
// 		off: function () {
// 			changeBy(false);
// 			return 'log is disable';
// 		},
// 		get: function () {
// 			return isOn;
// 		},
// 	};
// })();

// if (typeof window !== 'undefined') window.LOG = LOG;

