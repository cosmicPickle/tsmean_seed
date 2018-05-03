/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading wasm modules
/******/ 	var installedWasmModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// object with all compiled WebAssembly.Modules
/******/ 	__webpack_require__.w = {};
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./server/src/App.ts":
/*!***************************!*\
  !*** ./server/src/App.ts ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const express = __webpack_require__(/*! express */ "express");
const AppRoutesRegistry_1 = __webpack_require__(/*! ./core/routing/AppRoutesRegistry */ "./server/src/core/routing/AppRoutesRegistry.ts");
const middlewaresConfig_1 = __webpack_require__(/*! ./configuration/middlewares/middlewaresConfig */ "./server/src/configuration/middlewares/middlewaresConfig.ts");
class App {
    constructor() {
        this.express = express();
    }
    init() {
        this.mountGlobalMiddlewares();
        this.mountRoutes();
        return this;
    }
    mountGlobalMiddlewares() {
        const routeMiddlewares = middlewaresConfig_1.default._;
        routeMiddlewares && this.express.use(routeMiddlewares);
    }
    mountRoutes() {
        const routesRegistry = new AppRoutesRegistry_1.default(express.Router());
        this.express.use('/', routesRegistry.getRouter());
    }
}
exports.App = App;
exports.default = new App().init().express;


/***/ }),

/***/ "./server/src/configuration/db/mongo.ts":
/*!**********************************************!*\
  !*** ./server/src/configuration/db/mongo.ts ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoConfig = {
    host: 'ds223019.mlab.com:23019/test_seed',
    user: 'cosmicSeed',
    password: 'csmsd123'
};
exports.default = exports.mongoConfig;


/***/ }),

/***/ "./server/src/configuration/errors/errorsConfig.ts":
/*!*********************************************************!*\
  !*** ./server/src/configuration/errors/errorsConfig.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AppGeneralError_1 = __webpack_require__(/*! ./../../core/errors/AppGeneralError */ "./server/src/core/errors/AppGeneralError.ts");
const AppInvalidRouteError_1 = __webpack_require__(/*! ./../../core/errors/AppInvalidRouteError */ "./server/src/core/errors/AppInvalidRouteError.ts");
const AppAuthorizationError_1 = __webpack_require__(/*! ./../../core/errors/AppAuthorizationError */ "./server/src/core/errors/AppAuthorizationError.ts");
const AppRouteValidationError_1 = __webpack_require__(/*! ./../../core/errors/AppRouteValidationError */ "./server/src/core/errors/AppRouteValidationError.ts");
const AppMongoError_1 = __webpack_require__(/*! ./../../core/errors/AppMongoError */ "./server/src/core/errors/AppMongoError.ts");
const AppUnknownUserError_1 = __webpack_require__(/*! ./../../core/errors/AppUnknownUserError */ "./server/src/core/errors/AppUnknownUserError.ts");
const AppUnknownGroupError_1 = __webpack_require__(/*! ./../../core/errors/AppUnknownGroupError */ "./server/src/core/errors/AppUnknownGroupError.ts");
exports.appGeneralError = new AppGeneralError_1.AppGeneralError(1000);
exports.appInvalidRouteError = new AppInvalidRouteError_1.AppInvalidRouteError(1001);
exports.appAuthorizationError = new AppAuthorizationError_1.AppAuthorizationError(1002);
exports.appRouteValidationError = new AppRouteValidationError_1.AppRouteValidationError(1003);
exports.appMongoError = new AppMongoError_1.AppMongoError(1004);
exports.appUnknownUserError = new AppUnknownUserError_1.AppUnknownUserError(1005);
exports.appUnknownGroupError = new AppUnknownGroupError_1.AppUnknownGroupError(1006);


/***/ }),

/***/ "./server/src/configuration/middlewares/middlewaresConfig.ts":
/*!*******************************************************************!*\
  !*** ./server/src/configuration/middlewares/middlewaresConfig.ts ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = __webpack_require__(/*! body-parser */ "body-parser");
const AppLoggerMiddleware_1 = __webpack_require__(/*! ./../../core/middlewares/AppLoggerMiddleware */ "./server/src/core/middlewares/AppLoggerMiddleware.ts");
const UserRouteValidatorMiddleware_1 = __webpack_require__(/*! ./../../middlewares/validation/request/UserRouteValidatorMiddleware */ "./server/src/middlewares/validation/request/UserRouteValidatorMiddleware.ts");
const GroupRouteValidatorMiddleware_1 = __webpack_require__(/*! ../../middlewares/validation/request/GroupRouteValidatorMiddleware */ "./server/src/middlewares/validation/request/GroupRouteValidatorMiddleware.ts");
exports.middlewares = {
    _: [
        bodyParser.urlencoded({ extended: true }),
        bodyParser.json({ strict: false }),
        AppLoggerMiddleware_1.appLoggerMiddleware.log
    ],
    '/user/:name?': {
        get: [
            UserRouteValidatorMiddleware_1.userRouteValidatorMiddleware.get,
        ]
    },
    '/group/:name?': {
        get: [
            GroupRouteValidatorMiddleware_1.groupRouteValidatorMiddleware.get
        ]
    }
};
exports.default = exports.middlewares;


/***/ }),

/***/ "./server/src/configuration/routes/routesConfig.ts":
/*!*********************************************************!*\
  !*** ./server/src/configuration/routes/routesConfig.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const UserRoute_1 = __webpack_require__(/*! ./../../routes/UserRoute */ "./server/src/routes/UserRoute.ts");
const GroupRoute_1 = __webpack_require__(/*! ./../../routes/GroupRoute */ "./server/src/routes/GroupRoute.ts");
const DefaultRoute_1 = __webpack_require__(/*! ./../../core/routing/DefaultRoute */ "./server/src/core/routing/DefaultRoute.ts");
exports.routesConfig = [
    DefaultRoute_1.defaultRoute,
    UserRoute_1.userRoute,
    GroupRoute_1.groupRoute
];
exports.default = exports.routesConfig;


/***/ }),

/***/ "./server/src/core/errors/AppAuthorizationError.ts":
/*!*********************************************************!*\
  !*** ./server/src/core/errors/AppAuthorizationError.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __webpack_require__(/*! ./AppError */ "./server/src/core/errors/AppError.ts");
class AppAuthorizationError extends AppError_1.AppError {
    constructor() {
        super(...arguments);
        this.message = "not_authorized";
    }
}
exports.AppAuthorizationError = AppAuthorizationError;


/***/ }),

/***/ "./server/src/core/errors/AppError.ts":
/*!********************************************!*\
  !*** ./server/src/core/errors/AppError.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class AppError {
    constructor(code) {
        this.code = code;
    }
    get() {
        return {
            code: this.code,
            message: this.message,
            payload: this.payload
        };
    }
}
exports.AppError = AppError;
exports.default = AppError;


/***/ }),

/***/ "./server/src/core/errors/AppGeneralError.ts":
/*!***************************************************!*\
  !*** ./server/src/core/errors/AppGeneralError.ts ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __webpack_require__(/*! ./AppError */ "./server/src/core/errors/AppError.ts");
class AppGeneralError extends AppError_1.AppError {
    constructor() {
        super(...arguments);
        this.message = "unexpected_error";
    }
}
exports.AppGeneralError = AppGeneralError;


/***/ }),

/***/ "./server/src/core/errors/AppInvalidRouteError.ts":
/*!********************************************************!*\
  !*** ./server/src/core/errors/AppInvalidRouteError.ts ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __webpack_require__(/*! ./AppError */ "./server/src/core/errors/AppError.ts");
class AppInvalidRouteError extends AppError_1.AppError {
    constructor() {
        super(...arguments);
        this.message = "invalid_route";
    }
}
exports.AppInvalidRouteError = AppInvalidRouteError;


/***/ }),

/***/ "./server/src/core/errors/AppMongoError.ts":
/*!*************************************************!*\
  !*** ./server/src/core/errors/AppMongoError.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __webpack_require__(/*! ./AppError */ "./server/src/core/errors/AppError.ts");
class AppMongoError extends AppError_1.AppError {
    constructor() {
        super(...arguments);
        this.code = 1001;
        this.message = "";
    }
    parse(err) {
        if (err.errors) {
            this.message = "mongoose_validation_error";
            this.payload = {
                invalid: Object.keys(err.errors).map((key) => {
                    const e = err.errors[key];
                    return {
                        kind: e.kind,
                        path: e.path,
                        message: e.message,
                        value: e.value
                    };
                })
            };
        }
        else if (err.message.indexOf('duplicate key error') !== -1) {
            this.message = "mongoose_duplicate_key_error";
        }
        else {
            this.message = "mongoose_error";
            if (true) {
                this.payload = {
                    debug: err.message
                };
            }
        }
        return this;
    }
}
exports.AppMongoError = AppMongoError;


/***/ }),

/***/ "./server/src/core/errors/AppRouteValidationError.ts":
/*!***********************************************************!*\
  !*** ./server/src/core/errors/AppRouteValidationError.ts ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __webpack_require__(/*! ./AppError */ "./server/src/core/errors/AppError.ts");
class AppRouteValidationError extends AppError_1.AppError {
    constructor() {
        super(...arguments);
        this.message = "invalid_route_params";
    }
    parse(error) {
        this.payload = {
            errors: [],
            invalid: error._object
        };
        error.details.forEach((e) => {
            this.payload.errors.push({
                path: e.path,
                type: e.type,
                context: e.context
            });
        });
        return this;
    }
}
exports.AppRouteValidationError = AppRouteValidationError;


/***/ }),

/***/ "./server/src/core/errors/AppUnknownGroupError.ts":
/*!********************************************************!*\
  !*** ./server/src/core/errors/AppUnknownGroupError.ts ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __webpack_require__(/*! ./AppError */ "./server/src/core/errors/AppError.ts");
class AppUnknownGroupError extends AppError_1.AppError {
    constructor() {
        super(...arguments);
        this.code = 1005;
        this.message = "Unknown group";
    }
}
exports.AppUnknownGroupError = AppUnknownGroupError;


/***/ }),

/***/ "./server/src/core/errors/AppUnknownUserError.ts":
/*!*******************************************************!*\
  !*** ./server/src/core/errors/AppUnknownUserError.ts ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __webpack_require__(/*! ./AppError */ "./server/src/core/errors/AppError.ts");
class AppUnknownUserError extends AppError_1.AppError {
    constructor() {
        super(...arguments);
        this.message = "unknown_user";
    }
}
exports.AppUnknownUserError = AppUnknownUserError;


/***/ }),

/***/ "./server/src/core/lib/AppLogger.ts":
/*!******************************************!*\
  !*** ./server/src/core/lib/AppLogger.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const winston = __webpack_require__(/*! winston */ "winston");
class AppLogger {
    constructor() {
        this.__transportsDev = [
            new winston.transports.Console({
                level: 'debug',
                colorize: true,
                handleExceptions: true,
                humanReadableUnhandledException: true
            }),
            new winston.transports.File({
                filename: './logs/app.log',
                maxsize: 1024 * 1024,
                level: 'error'
            })
        ];
        this.__transportsProd = [
            new winston.transports.File({
                filename: './logs/app.log',
                maxsize: 1024 * 1024,
                level: 'info',
                handleExceptions: true,
                humanReadableUnhandledException: true
            })
        ];
        this.__loggerOptions = {
            exitOnError: false
        };
        if (true)
            this.__loggerOptions.transports = this.__transportsDev;
        else
            {}
        this.__winston = new winston.Logger(this.__loggerOptions);
    }
    /**
     * logger
     */
    logger() {
        return this.__winston;
    }
}
exports.AppLogger = AppLogger;
exports.logger = new AppLogger().logger();


/***/ }),

/***/ "./server/src/core/lib/AppMongooseModelManager.ts":
/*!********************************************************!*\
  !*** ./server/src/core/lib/AppMongooseModelManager.ts ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const connection_1 = __webpack_require__(/*! ./../models/db/mongo/connection */ "./server/src/core/models/db/mongo/connection.ts");
const AppLogger_1 = __webpack_require__(/*! ./AppLogger */ "./server/src/core/lib/AppLogger.ts");
class AppMongooseModelManager {
    constructor() {
        this.__models = [];
        this.__indexesCreated = [];
    }
    waitIndexesCreated() {
        AppLogger_1.logger.info("Waiting for MongoDB Indexes to be created.");
        const modelNames = connection_1.mongoose.connection.modelNames();
        modelNames.forEach((name) => {
            this.__models.push(connection_1.mongoose.connection.model(name));
            let model = this.__models[this.__models.length - 1];
            this.__indexesCreated.push(model.waitIndexesCreated());
        });
        return Promise.all(this.__indexesCreated).then((value) => {
            AppLogger_1.logger.info('MongoDB Indexes Created.');
            return value;
        }, (err) => {
            AppLogger_1.logger.error(err);
            return err;
        });
    }
}
exports.AppMongooseModelManager = AppMongooseModelManager;
exports.appMongooseModelManager = new AppMongooseModelManager();
exports.default = exports.appMongooseModelManager;


/***/ }),

/***/ "./server/src/core/lib/Q.ts":
/*!**********************************!*\
  !*** ./server/src/core/lib/Q.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class Q {
    defer() {
        let resolve;
        let reject;
        let promise = new Promise(function () {
            resolve = arguments[0];
            reject = arguments[1];
        });
        return {
            resolve: resolve,
            reject: reject,
            promise: promise
        };
    }
}
exports.Q = Q;


/***/ }),

/***/ "./server/src/core/middlewares/AppLoggerMiddleware.ts":
/*!************************************************************!*\
  !*** ./server/src/core/middlewares/AppLoggerMiddleware.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AppLogger_1 = __webpack_require__(/*! ../lib/AppLogger */ "./server/src/core/lib/AppLogger.ts");
class AppLoggerMiddleware {
    constructor() {
        this.log = (req, res, next) => {
            AppLogger_1.logger.debug(`Request ${req.method.toUpperCase()} ${req.path}: ${JSON.stringify(req.params)}`);
            next();
        };
    }
}
exports.AppLoggerMiddleware = AppLoggerMiddleware;
exports.appLoggerMiddleware = new AppLoggerMiddleware();


/***/ }),

/***/ "./server/src/core/models/db/mongo/BaseDocument.ts":
/*!*********************************************************!*\
  !*** ./server/src/core/models/db/mongo/BaseDocument.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const connection_1 = __webpack_require__(/*! ./connection */ "./server/src/core/models/db/mongo/connection.ts");
const Q_1 = __webpack_require__(/*! ./../../../lib/Q */ "./server/src/core/lib/Q.ts");
const AppLogger_1 = __webpack_require__(/*! ../../../lib/AppLogger */ "./server/src/core/lib/AppLogger.ts");
class BaseSchema extends mongoose_1.Schema {
}
exports.BaseSchema = BaseSchema;
class BaseDocument {
    constructor() {
        this.config = {
            resultsPerPage: 3
        };
        this.__methods = {};
        this.__statics = {
            waitIndexesCreated: () => {
                return this.__indexesCreated.promise;
            }
        };
        this.__query = {
            sortAndPaginate: (() => {
                const config = this.config;
                return function (req) {
                    const q = this;
                    if (req.query.sort && req.query.order) {
                        const sort = {};
                        sort[req.query.sort] = req.query.order;
                        q.sort(sort);
                    }
                    if (config.resultsPerPage > 0) {
                        const p = req.query.page >= 1 ? req.query.page : 1;
                        const skip = (p - 1) * config.resultsPerPage;
                        q.skip(skip);
                        q.limit(config.resultsPerPage);
                    }
                    return q;
                };
            })()
        };
        this.__indexesCreated = (new Q_1.Q).defer();
    }
    model() {
        const _this = this;
        this.__schema = new BaseSchema(this.schema);
        this.__schema.methods = this.methods ? Object.assign({}, this.methods, this.__methods) : Object.assign({}, this.__methods);
        this.__schema.statics = this.statics ? Object.assign({}, this.statics, this.__statics) : Object.assign({}, this.__statics);
        this.__schema.query = this.query ? Object.assign({}, this.query, this.__query) : Object.assign({}, this.__query);
        AppLogger_1.logger.debug(`creating model ${this.name}`);
        let model = connection_1.mongoose.model(this.name, this.__schema);
        model.ensureIndexes((err) => {
            if (err) {
                this.__indexesCreated.reject(err);
            }
            else {
                this.__indexesCreated.resolve();
            }
        });
        return model;
    }
}
exports.BaseDocument = BaseDocument;
exports.default = BaseDocument;


/***/ }),

/***/ "./server/src/core/models/db/mongo/GroupDocument.ts":
/*!**********************************************************!*\
  !*** ./server/src/core/models/db/mongo/GroupDocument.ts ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BaseDocument_1 = __webpack_require__(/*! ./BaseDocument */ "./server/src/core/models/db/mongo/BaseDocument.ts");
class GroupDocument extends BaseDocument_1.BaseDocument {
    constructor() {
        super(...arguments);
        this.name = 'Group';
        this.schema = {
            name: {
                type: String,
                required: true,
                unique: true
            },
            allowedServices: {
                type: [{
                        method: String,
                        path: String
                    }]
            },
            allowedRoutes: {
                type: [String]
            }
        };
        this.methods = {};
    }
}
exports.Group = ((new GroupDocument()).model());
exports.default = exports.Group;


/***/ }),

/***/ "./server/src/core/models/db/mongo/UserDocument.ts":
/*!*********************************************************!*\
  !*** ./server/src/core/models/db/mongo/UserDocument.ts ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BaseDocument_1 = __webpack_require__(/*! ./BaseDocument */ "./server/src/core/models/db/mongo/BaseDocument.ts");
const UserUsernameValidator_1 = __webpack_require__(/*! ./validators/UserUsernameValidator */ "./server/src/core/models/db/mongo/validators/UserUsernameValidator.ts");
const connection_1 = __webpack_require__(/*! ./connection */ "./server/src/core/models/db/mongo/connection.ts");
class UserDocument extends BaseDocument_1.BaseDocument {
    constructor() {
        super(...arguments);
        this.name = 'User';
        this.schema = {
            username: {
                type: String,
                required: true,
                unique: true,
                validate: UserUsernameValidator_1.userUsernameValidator.use()
            },
            password: {
                type: String,
                required: true
            },
            country: {
                type: String,
                required: true
            },
            group: {
                type: connection_1.mongoose.Schema.Types.ObjectId,
                ref: 'Group',
                required: true,
            },
            allowedServices: {
                type: [{
                        method: String,
                        path: String
                    }]
            },
            allowedRoutes: {
                type: [String]
            }
        };
        this.methods = {};
        this.statics = {};
        this.query = {
            filter(country) {
                return this.find({
                    country: country
                });
            }
        };
    }
}
exports.User = ((new UserDocument()).model());
exports.default = exports.User;


/***/ }),

/***/ "./server/src/core/models/db/mongo/connection.ts":
/*!*******************************************************!*\
  !*** ./server/src/core/models/db/mongo/connection.ts ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __webpack_require__(/*! mongoose */ "mongoose");
exports.mongoose = mongoose;
const mongo_1 = __webpack_require__(/*! ./../../../../configuration/db/mongo */ "./server/src/configuration/db/mongo.ts");
const connect = `mongodb://${mongo_1.mongoConfig.user}:${mongo_1.mongoConfig.password}@${mongo_1.mongoConfig.host}`;
const options = { autoIndex: false };
const db = mongoose.connect(connect, options);


/***/ }),

/***/ "./server/src/core/models/db/mongo/validators/BaseValidator.ts":
/*!*********************************************************************!*\
  !*** ./server/src/core/models/db/mongo/validators/BaseValidator.ts ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class BaseValidator {
    constructor() {
        this.message = 'BaseValidator default message. Should not be seeing this.';
    }
    validator(v) {
        return true;
    }
    use() {
        let v = {
            validator: this.validator,
            message: this.message
        };
        return v;
    }
}
exports.default = BaseValidator;


/***/ }),

/***/ "./server/src/core/models/db/mongo/validators/UserUsernameValidator.ts":
/*!*****************************************************************************!*\
  !*** ./server/src/core/models/db/mongo/validators/UserUsernameValidator.ts ***!
  \*****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BaseValidator_1 = __webpack_require__(/*! ./BaseValidator */ "./server/src/core/models/db/mongo/validators/BaseValidator.ts");
class UserUsernameValidator extends BaseValidator_1.default {
    constructor() {
        super(...arguments);
        this.message = "error_validation_user_username";
    }
    validator(v) {
        return (/^([a-zA-z0-9])*$/).test(v);
    }
}
exports.UserUsernameValidator = UserUsernameValidator;
exports.userUsernameValidator = new UserUsernameValidator();


/***/ }),

/***/ "./server/src/core/models/routing/request/AppBaseRequestValidator.ts":
/*!***************************************************************************!*\
  !*** ./server/src/core/models/routing/request/AppBaseRequestValidator.ts ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Joi = __webpack_require__(/*! joi */ "joi");
class AppBaseQuerySchema {
    constructor() {
        this.__sortSchema = Joi.string();
        this.__orderSchema = Joi.number().valid(-1, 1);
        this.__pageSchema = Joi.number().min(0);
        this.getSchema = () => {
            let _schema = Joi.object();
            let keys = {};
            if (this.__filtersSchema) {
                Object.keys(this.__filtersSchema).forEach((val) => {
                    keys[val] = this.__filtersSchema[val];
                });
            }
            keys.sort = this.__sortSchema;
            keys.order = this.__orderSchema;
            keys.page = this.__pageSchema;
            return _schema.keys(keys);
        };
    }
    set sort(val) {
        this.__sortSchema = val;
    }
    set order(val) {
        this.__orderSchema = val;
    }
    set page(val) {
        this.__pageSchema = val;
    }
    set filters(val) {
        this.__filtersSchema = val;
    }
}
exports.AppBaseQuerySchema = AppBaseQuerySchema;
class AppBaseBodySchema {
    constructor() {
        this.__uuidSchema = Joi.string();
        this.getSchema = () => {
            let _schema = Joi.object();
            let keys = {};
            if (this.__dataSchema) {
                Object.keys(this.__dataSchema).forEach((val) => {
                    keys[val] = this.__dataSchema[val];
                });
            }
            keys.uuid = this.__uuidSchema;
            return _schema.keys(keys);
        };
    }
    set uuid(val) {
        this.__uuidSchema = val;
    }
    set data(val) {
        this.__dataSchema = val;
    }
}
exports.AppBaseBodySchema = AppBaseBodySchema;
class AppBaseRequestValidator {
    constructor(querySchema, bodySchema) {
        this.validateQuery = (query) => {
            return new Promise((resolve, reject) => {
                if (!this.__querySchema) {
                    resolve(true);
                    return;
                }
                try {
                    const { error, value } = Joi.validate(query, this.__querySchema);
                    if (error)
                        throw error;
                    resolve(true);
                }
                catch (e) {
                    throw e;
                }
            });
        };
        this.validateBody = (body) => {
            return new Promise((resolve, reject) => {
                if (!this.__bodySchema) {
                    resolve(true);
                    return;
                }
                try {
                    const { error, value } = Joi.validate(body, this.__bodySchema);
                    if (error)
                        throw error;
                    resolve(true);
                }
                catch (e) {
                    throw e;
                }
            });
        };
        this.validate = (req) => {
            return Promise.all([
                this.validateQuery(req.query),
                this.validateBody(req.body)
            ]);
        };
        this.__querySchema = querySchema.getSchema();
        this.__bodySchema = bodySchema.getSchema();
    }
}
exports.AppBaseRequestValidator = AppBaseRequestValidator;


/***/ }),

/***/ "./server/src/core/routing/AppRoute.ts":
/*!*********************************************!*\
  !*** ./server/src/core/routing/AppRoute.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const errorsConfig_1 = __webpack_require__(/*! ./../../configuration/errors/errorsConfig */ "./server/src/configuration/errors/errorsConfig.ts");
const middlewaresConfig_1 = __webpack_require__(/*! ./../../configuration/middlewares/middlewaresConfig */ "./server/src/configuration/middlewares/middlewaresConfig.ts");
class AppRoute {
    constructor() { }
    get(req, res) {
        res.json(errorsConfig_1.appInvalidRouteError.get());
    }
    post(req, res) {
        res.json(errorsConfig_1.appInvalidRouteError.get());
    }
    put(req, res) {
        res.json(errorsConfig_1.appInvalidRouteError.get());
    }
    delete(req, res) {
        res.json(errorsConfig_1.appInvalidRouteError.get());
    }
    mountMiddlewares(router) {
        const routeMiddlewares = middlewaresConfig_1.default[this.path];
        if (routeMiddlewares === undefined)
            return;
        routeMiddlewares._ && router.use(this.path, routeMiddlewares._);
        routeMiddlewares.get && router.get(this.path, routeMiddlewares.get);
        routeMiddlewares.post && router.post(this.path, routeMiddlewares.post);
        routeMiddlewares.put && router.put(this.path, routeMiddlewares.put);
        routeMiddlewares.delete && router.delete(this.path, routeMiddlewares.delete);
    }
    mount(router) {
        this.mountMiddlewares(router);
        router.get(this.path, this.get);
        router.post(this.path, this.post);
        router.put(this.path, this.put);
        router.delete(this.path, this.delete);
    }
}
exports.AppRoute = AppRoute;
exports.default = AppRoute;


/***/ }),

/***/ "./server/src/core/routing/AppRoutesRegistry.ts":
/*!******************************************************!*\
  !*** ./server/src/core/routing/AppRoutesRegistry.ts ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const routesConfig_1 = __webpack_require__(/*! ./../../configuration/routes/routesConfig */ "./server/src/configuration/routes/routesConfig.ts");
class AppRoutesRegistry {
    constructor(router) {
        this.router = router;
        this.routes = routesConfig_1.default;
        this.routes.forEach((route) => {
            route.mount(this.router);
        });
    }
    getRouter() {
        return this.router;
    }
}
exports.AppRoutesRegistry = AppRoutesRegistry;
exports.default = AppRoutesRegistry;


/***/ }),

/***/ "./server/src/core/routing/DefaultRoute.ts":
/*!*************************************************!*\
  !*** ./server/src/core/routing/DefaultRoute.ts ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AppRoute_1 = __webpack_require__(/*! ./AppRoute */ "./server/src/core/routing/AppRoute.ts");
class DefaultRoute extends AppRoute_1.default {
    constructor() {
        super(...arguments);
        this.path = '/';
    }
}
exports.DefaultRoute = DefaultRoute;
exports.defaultRoute = new DefaultRoute();


/***/ }),

/***/ "./server/src/index.ts":
/*!*****************************!*\
  !*** ./server/src/index.ts ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = __webpack_require__(/*! ./App */ "./server/src/App.ts");
const http = __webpack_require__(/*! http */ "http");
const AppLogger_1 = __webpack_require__(/*! ./core/lib/AppLogger */ "./server/src/core/lib/AppLogger.ts");
const AppMongooseModelManager_1 = __webpack_require__(/*! ./core/lib/AppMongooseModelManager */ "./server/src/core/lib/AppMongooseModelManager.ts");
const port = process.env.PORT || 3000;
let start = () => __awaiter(this, void 0, void 0, function* () {
    try {
        //Bootstrapping server
        yield AppMongooseModelManager_1.appMongooseModelManager.waitIndexesCreated();
        http.createServer(App_1.default).listen(port, (err) => {
            if (err) {
                return AppLogger_1.logger.error(err);
            }
            return AppLogger_1.logger.info(`server is listening on ${port} ${"development"}`);
        });
    }
    catch (err) {
        AppLogger_1.logger.error(err);
    }
    return App_1.default;
});
exports.server = start();


/***/ }),

/***/ "./server/src/middlewares/validation/request/GroupRouteValidatorMiddleware.ts":
/*!************************************************************************************!*\
  !*** ./server/src/middlewares/validation/request/GroupRouteValidatorMiddleware.ts ***!
  \************************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorsConfig_1 = __webpack_require__(/*! ./../../../configuration/errors/errorsConfig */ "./server/src/configuration/errors/errorsConfig.ts");
const GroupRouteRequestValidator_1 = __webpack_require__(/*! ./../../../models/routing/request/GroupRouteRequestValidator */ "./server/src/models/routing/request/GroupRouteRequestValidator.ts");
class GroupRouteValidatorMiddleware {
    constructor() {
        this.getValidator = GroupRouteRequestValidator_1.groupRouteGetValidator;
        this.get = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.getValidator.validateQuery(req.query);
                next();
            }
            catch (e) {
                res.json(errorsConfig_1.appRouteValidationError.parse(e).get());
            }
        });
    }
}
exports.GroupRouteValidatorMiddleware = GroupRouteValidatorMiddleware;
exports.groupRouteValidatorMiddleware = new GroupRouteValidatorMiddleware();


/***/ }),

/***/ "./server/src/middlewares/validation/request/UserRouteValidatorMiddleware.ts":
/*!***********************************************************************************!*\
  !*** ./server/src/middlewares/validation/request/UserRouteValidatorMiddleware.ts ***!
  \***********************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorsConfig_1 = __webpack_require__(/*! ./../../../configuration/errors/errorsConfig */ "./server/src/configuration/errors/errorsConfig.ts");
const UserRouteRequestValidator_1 = __webpack_require__(/*! ./../../../models/routing/request/UserRouteRequestValidator */ "./server/src/models/routing/request/UserRouteRequestValidator.ts");
class UserRouteValidatorMiddleware {
    constructor() {
        this.getValidator = UserRouteRequestValidator_1.userRouteGetValidator;
        this.get = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.getValidator.validateQuery(req.query);
                next();
            }
            catch (e) {
                res.json(errorsConfig_1.appRouteValidationError.parse(e).get());
            }
        });
    }
}
exports.UserRouteValidatorMiddleware = UserRouteValidatorMiddleware;
exports.userRouteValidatorMiddleware = new UserRouteValidatorMiddleware();


/***/ }),

/***/ "./server/src/models/routing/request/GroupRouteRequestValidator.ts":
/*!*************************************************************************!*\
  !*** ./server/src/models/routing/request/GroupRouteRequestValidator.ts ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AppBaseRequestValidator_1 = __webpack_require__(/*! ./../../../core/models/routing/request/AppBaseRequestValidator */ "./server/src/core/models/routing/request/AppBaseRequestValidator.ts");
class GroupRouteGetQuerySchema extends AppBaseRequestValidator_1.AppBaseQuerySchema {
}
exports.GroupRouteGetQuerySchema = GroupRouteGetQuerySchema;
class GroupRoutePostBodySchema extends AppBaseRequestValidator_1.AppBaseBodySchema {
}
exports.GroupRoutePostBodySchema = GroupRoutePostBodySchema;
exports.groupRouteGetValidator = new AppBaseRequestValidator_1.AppBaseRequestValidator(new GroupRouteGetQuerySchema(), new AppBaseRequestValidator_1.AppBaseBodySchema());
exports.groupRoutePostValidator = new AppBaseRequestValidator_1.AppBaseRequestValidator(new AppBaseRequestValidator_1.AppBaseQuerySchema(), new GroupRoutePostBodySchema());


/***/ }),

/***/ "./server/src/models/routing/request/UserRouteRequestValidator.ts":
/*!************************************************************************!*\
  !*** ./server/src/models/routing/request/UserRouteRequestValidator.ts ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AppBaseRequestValidator_1 = __webpack_require__(/*! ./../../../core/models/routing/request/AppBaseRequestValidator */ "./server/src/core/models/routing/request/AppBaseRequestValidator.ts");
const Joi = __webpack_require__(/*! joi */ "joi");
class UserRouteGetQuerySchema extends AppBaseRequestValidator_1.AppBaseQuerySchema {
    constructor() {
        super(...arguments);
        this.sort = Joi.string().valid('age', 'level');
        this.filters = {
            country: Joi.string().min(2).max(2)
        };
    }
}
exports.UserRouteGetQuerySchema = UserRouteGetQuerySchema;
exports.userRouteGetValidator = new AppBaseRequestValidator_1.AppBaseRequestValidator(new UserRouteGetQuerySchema(), new AppBaseRequestValidator_1.AppBaseBodySchema());


/***/ }),

/***/ "./server/src/routes/GroupRoute.ts":
/*!*****************************************!*\
  !*** ./server/src/routes/GroupRoute.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppRoute_1 = __webpack_require__(/*! ./../core/routing/AppRoute */ "./server/src/core/routing/AppRoute.ts");
const GroupDocument_1 = __webpack_require__(/*! ./../core/models/db/mongo/GroupDocument */ "./server/src/core/models/db/mongo/GroupDocument.ts");
const errorsConfig_1 = __webpack_require__(/*! ./../configuration/errors/errorsConfig */ "./server/src/configuration/errors/errorsConfig.ts");
class GroupRoute extends AppRoute_1.default {
    constructor() {
        super(...arguments);
        this.path = '/group/:id?';
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                req.body;
                let group = new GroupDocument_1.Group();
                group.name = req.body.name;
                group.allowedRoutes = req.body.allowedRoutes;
                group.allowedServices = req.body.allowedServices;
                yield group.save();
                return res.json({
                    success: 'Group Saved',
                    status: 'ok'
                });
            }
            catch (err) {
                return res.json(errorsConfig_1.appMongoError.parse(err).get());
            }
        });
    }
}
exports.GroupRoute = GroupRoute;
exports.groupRoute = new GroupRoute();


/***/ }),

/***/ "./server/src/routes/UserRoute.ts":
/*!****************************************!*\
  !*** ./server/src/routes/UserRoute.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppRoute_1 = __webpack_require__(/*! ./../core/routing/AppRoute */ "./server/src/core/routing/AppRoute.ts");
const UserDocument_1 = __webpack_require__(/*! ./../core/models/db/mongo/UserDocument */ "./server/src/core/models/db/mongo/UserDocument.ts");
const errorsConfig_1 = __webpack_require__(/*! ./../configuration/errors/errorsConfig */ "./server/src/configuration/errors/errorsConfig.ts");
const errorsConfig_2 = __webpack_require__(/*! ./../configuration/errors/errorsConfig */ "./server/src/configuration/errors/errorsConfig.ts");
const errorsConfig_3 = __webpack_require__(/*! ./../configuration/errors/errorsConfig */ "./server/src/configuration/errors/errorsConfig.ts");
const GroupDocument_1 = __webpack_require__(/*! ../core/models/db/mongo/GroupDocument */ "./server/src/core/models/db/mongo/GroupDocument.ts");
class UserRoute extends AppRoute_1.default {
    constructor() {
        super(...arguments);
        this.path = '/user/:name?';
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.params.name) {
                try {
                    const user = yield UserDocument_1.User.findOne({
                        username: req.params.name
                    }).populate('group').exec();
                    if (!user)
                        return res.json(errorsConfig_2.appUnknownUserError.get());
                    return res.json({
                        user: user.username,
                        group: user.group.name
                    });
                }
                catch (err) {
                    return res.json(errorsConfig_1.appMongoError.parse(err).get());
                }
            }
            else {
                let query = UserDocument_1.User.find();
                if (req.query.country)
                    query.filter(req.query.country);
                const userCollection = yield query.sortAndPaginate(req)
                    .populate('group')
                    .exec();
                if (!userCollection)
                    return res.json(errorsConfig_2.appUnknownUserError.get());
                return res.json(userCollection.map((user) => {
                    return {
                        user: user.username,
                        group: user.group.name,
                        country: user.country
                    };
                }));
            }
        });
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const group = yield GroupDocument_1.Group.findOne({
                    name: req.body.group
                });
                if (!group)
                    return res.json(errorsConfig_3.appUnknownGroupError.get());
                let user = new UserDocument_1.User();
                user.username = req.body.username;
                user.password = req.body.password;
                user.country = req.body.country;
                user.group = group._id;
                yield user.save();
                return res.json({
                    handshake: 'Hi, ' + user.username + ' welcome aboard',
                    status: 'ok'
                });
            }
            catch (err) {
                return res.json(errorsConfig_1.appMongoError.parse(err).get());
            }
        });
    }
}
exports.UserRoute = UserRoute;
exports.userRoute = new UserRoute();


/***/ }),

/***/ 0:
/*!***********************************!*\
  !*** multi ./server/src/index.ts ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./server/src/index.ts */"./server/src/index.ts");


/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("http");

/***/ }),

/***/ "joi":
/*!**********************!*\
  !*** external "joi" ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("joi");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),

/***/ "winston":
/*!**************************!*\
  !*** external "winston" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("winston");

/***/ })

/******/ });
//# sourceMappingURL=index.js.map