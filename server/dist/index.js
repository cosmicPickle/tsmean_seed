/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
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
    password: 'csmsd123',
    db: 'test_seed'
};
const connect = `mongodb://${exports.mongoConfig.user}:${exports.mongoConfig.password}@${exports.mongoConfig.host}`;
exports.connect = connect;


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
const UserRouteValidatorMiddleware_1 = __webpack_require__(/*! ./../../core/middlewares/validation/request/UserRouteValidatorMiddleware */ "./server/src/core/middlewares/validation/request/UserRouteValidatorMiddleware.ts");
exports.middlewares = {
    _: [
        bodyParser.urlencoded({ extended: true }),
        bodyParser.json({ strict: false }),
        AppLoggerMiddleware_1.appLoggerMiddleware.log
    ],
    '/user/:name?': {
        get: [
            UserRouteValidatorMiddleware_1.userRouteValidatorMiddleware.get,
        ],
        post: [
            UserRouteValidatorMiddleware_1.userRouteValidatorMiddleware.post
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
const UserRoute_1 = __webpack_require__(/*! ./../../core/routing/UserRoute */ "./server/src/core/routing/UserRoute.ts");
const GroupRoute_1 = __webpack_require__(/*! ./../../core/routing/GroupRoute */ "./server/src/core/routing/GroupRoute.ts");
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
        this.message = "invalid_request";
    }
    parse(error) {
        this.payload = {
            errors: [],
            invalid: error._object
        };
        console.log(error);
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

/***/ "./server/src/core/lib/AppMongoDriver.ts":
/*!***********************************************!*\
  !*** ./server/src/core/lib/AppMongoDriver.ts ***!
  \***********************************************/
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
const mongodb = __webpack_require__(/*! mongodb */ "mongodb");
const mongo_1 = __webpack_require__(/*! ./../../configuration/db/mongo */ "./server/src/configuration/db/mongo.ts");
const AppLogger_1 = __webpack_require__(/*! ./AppLogger */ "./server/src/core/lib/AppLogger.ts");
class AppMongoDriver {
    constructor() {
        this._client = null;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            AppLogger_1.logger.info(`Connecting to mongodb`);
            this._client = yield mongodb.MongoClient.connect(mongo_1.connect);
            this._db = this._client.db(mongo_1.mongoConfig.db);
        });
    }
    db() {
        return this._db;
    }
}
exports.mongo = new AppMongoDriver();


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

/***/ "./server/src/core/middlewares/validation/request/UserRouteValidatorMiddleware.ts":
/*!****************************************************************************************!*\
  !*** ./server/src/core/middlewares/validation/request/UserRouteValidatorMiddleware.ts ***!
  \****************************************************************************************/
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
const UserValidationSchema_1 = __webpack_require__(/*! ./../../../models/resource/user/UserValidationSchema */ "./server/src/core/models/resource/user/UserValidationSchema.ts");
const errorsConfig_1 = __webpack_require__(/*! ./../../../../configuration/errors/errorsConfig */ "./server/src/configuration/errors/errorsConfig.ts");
class UserRouteValidatorMiddleware {
    constructor() {
        this.get = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield UserValidationSchema_1.userGetQuerySchema.validate(req.query);
                next();
            }
            catch (e) {
                res.json(errorsConfig_1.appRouteValidationError.parse(e).get());
            }
        });
        this.post = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield UserValidationSchema_1.userPostBodySchema.validate(req.body);
                next();
            }
            catch (e) {
                console.log(e);
                res.json(errorsConfig_1.appRouteValidationError.parse(e).get());
            }
        });
    }
}
exports.UserRouteValidatorMiddleware = UserRouteValidatorMiddleware;
exports.userRouteValidatorMiddleware = new UserRouteValidatorMiddleware();


/***/ }),

/***/ "./server/src/core/models/resource/base/BaseMongoModel.ts":
/*!****************************************************************!*\
  !*** ./server/src/core/models/resource/base/BaseMongoModel.ts ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AppMongoDriver_1 = __webpack_require__(/*! ./../../../lib/AppMongoDriver */ "./server/src/core/lib/AppMongoDriver.ts");
class BaseMongoModel {
    constructor() {
    }
    get() {
        if (this.collection)
            return this.collection;
        if (!this.name) {
            throw new Error(`Can't make collection '${this.constructor.prototype}': 'name' not set`);
        }
        this.collection = AppMongoDriver_1.mongo.db().collection(this.name);
        return this.collection;
    }
}
exports.BaseMongoModel = BaseMongoModel;


/***/ }),

/***/ "./server/src/core/models/resource/base/BaseValidationSchema.ts":
/*!**********************************************************************!*\
  !*** ./server/src/core/models/resource/base/BaseValidationSchema.ts ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const Joi = __webpack_require__(/*! joi */ "joi");
var SchemaHelpers;
(function (SchemaHelpers) {
    SchemaHelpers.lt = {
        lt: Joi.number().integer().min(Joi.ref('gt'))
    };
    SchemaHelpers.gt = {
        gt: Joi.number().integer()
    };
    SchemaHelpers.range = {
        gt: Joi.number().integer(),
        lt: Joi.number().integer().min(Joi.ref('gt'))
    };
    SchemaHelpers.$in = {
        in: Joi.array()
    };
})(SchemaHelpers = exports.SchemaHelpers || (exports.SchemaHelpers = {}));
class BaseValidationSchema {
    validate(obj) {
        return new Promise((resolve, reject) => {
            let _schema = Joi.object();
            let keys = {};
            Object.keys(this).forEach((k) => {
                return keys[k] = this[k];
            });
            if (!keys) {
                resolve(true);
                return;
            }
            try {
                _schema = _schema.keys(keys);
                const { error, value } = Joi.validate(obj, _schema);
                if (error)
                    throw error;
                resolve(true);
            }
            catch (e) {
                throw e;
            }
        });
    }
}
exports.BaseValidationSchema = BaseValidationSchema;
class AppBaseQuerySchema extends BaseValidationSchema {
    constructor() {
        super(...arguments);
        this.sort = Joi.string().regex(/^(\-|[a-zA-Z0-9\_])/);
        this.page = Joi.number().min(0);
    }
}
exports.AppBaseQuerySchema = AppBaseQuerySchema;
class AppBaseBodySchema extends BaseValidationSchema {
}
exports.AppBaseBodySchema = AppBaseBodySchema;


/***/ }),

/***/ "./server/src/core/models/resource/user/UserMongoModel.ts":
/*!****************************************************************!*\
  !*** ./server/src/core/models/resource/user/UserMongoModel.ts ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BaseMongoModel_1 = __webpack_require__(/*! ./../base/BaseMongoModel */ "./server/src/core/models/resource/base/BaseMongoModel.ts");
class UserMongoModel extends BaseMongoModel_1.BaseMongoModel {
    constructor() {
        super(...arguments);
        this.name = 'users';
    }
}
exports.UserMongoModel = UserMongoModel;
exports.User = new UserMongoModel().get();


/***/ }),

/***/ "./server/src/core/models/resource/user/UserValidationSchema.ts":
/*!**********************************************************************!*\
  !*** ./server/src/core/models/resource/user/UserValidationSchema.ts ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BaseValidationSchema_1 = __webpack_require__(/*! ./../base/BaseValidationSchema */ "./server/src/core/models/resource/base/BaseValidationSchema.ts");
const Joi = __webpack_require__(/*! joi */ "joi");
class UserGetQuerySchema extends BaseValidationSchema_1.AppBaseQuerySchema {
    constructor() {
        super(...arguments);
        this.sort = Joi.string().valid('age', '-age');
        this.country = Joi.string().min(2).max(2);
        this.age = Joi.object().keys(BaseValidationSchema_1.SchemaHelpers.range);
    }
}
exports.UserGetQuerySchema = UserGetQuerySchema;
class UserPostBodySchema extends BaseValidationSchema_1.AppBaseBodySchema {
    constructor() {
        super(...arguments);
        this.username = Joi.string().required().valid('cosmic22', 'cosmic33');
        this.password = Joi.string().required();
        this.age = Joi.number().required();
        this.country = Joi.string().min(2).max(2).required();
        this.group = Joi.string().required();
        this.allowedServices = Joi.array().items(Joi.object().optional().keys({
            method: Joi.string().required(),
            path: Joi.string().required()
        }));
        this.allowedRoutes = Joi.array().items(Joi.string()).optional();
    }
}
exports.UserPostBodySchema = UserPostBodySchema;
exports.userGetQuerySchema = new UserGetQuerySchema();
exports.userPostBodySchema = new UserPostBodySchema();


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

/***/ "./server/src/core/routing/GroupRoute.ts":
/*!***********************************************!*\
  !*** ./server/src/core/routing/GroupRoute.ts ***!
  \***********************************************/
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
const AppRoute_1 = __webpack_require__(/*! ./AppRoute */ "./server/src/core/routing/AppRoute.ts");
class GroupRoute extends AppRoute_1.default {
    constructor() {
        super(...arguments);
        this.path = '/group/:id?';
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.json({ placeholder: true });
            // try {
            //     let group = new Group();
            //     group.name = req.body.name;
            //     group.allowedRoutes = req.body.allowedRoutes;
            //     group.allowedServices = req.body.allowedServices;
            //     await group.save();
            //     return res.json({
            //         success: 'Group Saved',
            //         status: 'ok'
            //     })
            // } catch(err) {
            //     return res.json(appMongoError.parse(err).get());
            // }
        });
    }
}
exports.GroupRoute = GroupRoute;
exports.groupRoute = new GroupRoute();


/***/ }),

/***/ "./server/src/core/routing/UserRoute.ts":
/*!**********************************************!*\
  !*** ./server/src/core/routing/UserRoute.ts ***!
  \**********************************************/
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
const AppRoute_1 = __webpack_require__(/*! ./AppRoute */ "./server/src/core/routing/AppRoute.ts");
const UserMongoModel_1 = __webpack_require__(/*! ./../models/resource/user/UserMongoModel */ "./server/src/core/models/resource/user/UserMongoModel.ts");
class UserRoute extends AppRoute_1.AppRoute {
    constructor() {
        super(...arguments);
        this.path = '/user/:name?';
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield UserMongoModel_1.User.findOne({
                    username: req.params.name
                });
                res.json(user);
            }
            catch (e) {
                res.json(e);
            }
            // if(req.params.name) {
            //     try {
            //         const user = await User.findOne({
            //             username: req.params.name
            //         }).populate('group').exec();
            //         if(!user)
            //             return res.json(appUnknownUserError.get());
            //         return res.json({
            //             user: user.username,
            //             group: user.group.name
            //         });
            //     } catch(err) {
            //         return res.json(appMongoError.parse(err).get());
            //     }
            // } else {
            //     let query = User.find();
            //     if(req.query.country)
            //         query.where('country', req.query.country);
            //     if(req.query.age)
            //         query.where('age').gt(req.query.age.gt).lt(req.query.age.lt);
            //     let userCollection = await (query as IUserDocumentQuery).sortAndPaginate(req)
            //                                                   .populate('group')
            //                                                   .exec();
            //     if(!userCollection)
            //         return res.json(appUnknownUserError.get());
            //     return res.json(userCollection.map((user) => {
            //         return {
            //             user: user.username,
            //             group: user.group.name,
            //             country: user.country,
            //             age: user.age
            //         }
            //     }))
            // }
        });
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            res.json({ placeholder: true });
            // let group: IGroup;
            // try {
            //     group = await Group.findOne({
            //         name: req.body.group
            //     });
            // } catch(err) {
            //     return res.json(appMongoError.parse(err).get());
            // }
            // if(!group) 
            //     return res.json(appUnknownGroupError.get())
            // try {
            //     req.body.group = group;
            //     await User.create(req.body);   
            // } catch(err) {
            //     return res.json(appMongoError.parse(err).get());
            // }
            // return res.json({
            //     handshake: 'Hi, ' + req.body.username + ' welcome aboard',
            //     status: 'ok'
            // })
        });
    }
}
exports.UserRoute = UserRoute;
exports.userRoute = new UserRoute();


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
const http = __webpack_require__(/*! http */ "http");
const AppLogger_1 = __webpack_require__(/*! ./core/lib/AppLogger */ "./server/src/core/lib/AppLogger.ts");
const AppMongoDriver_1 = __webpack_require__(/*! ./core/lib/AppMongoDriver */ "./server/src/core/lib/AppMongoDriver.ts");
const port = process.env.PORT || 3000;
let start = () => __awaiter(this, void 0, void 0, function* () {
    let app;
    try {
        //Executing async boot operations
        yield AppMongoDriver_1.mongo.connect();
        //Loading App
        const App = __webpack_require__(/*! ./App */ "./server/src/App.ts");
        app = App.default;
        //Bootstrapping server
        http.createServer(app).listen(port, (err) => {
            if (err) {
                return AppLogger_1.logger.error(err);
            }
            return AppLogger_1.logger.info(`server is listening on ${port} ${"development"}`);
        });
    }
    catch (err) {
        AppLogger_1.logger.error(err);
    }
    return app;
});
exports.server = start();


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

/***/ "mongodb":
/*!**************************!*\
  !*** external "mongodb" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("mongodb");

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