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
exports.middlewares = {
    _: [
        bodyParser.urlencoded({ extended: true }),
        bodyParser.json({ strict: false })
    ],
    '/user/:name?': {
        get: [
            AppLoggerMiddleware_1.appLoggerMiddleware.log,
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

/***/ "./server/src/core/errors/AppError.ts":
/*!********************************************!*\
  !*** ./server/src/core/errors/AppError.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class AppError {
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
        this.code = 1004;
        this.message = "Invalid Route";
    }
}
exports.AppInvalidRouteError = AppInvalidRouteError;
exports.appInvalidRouteError = new AppInvalidRouteError();


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
exports.appMongoError = new AppMongoError();


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
exports.appUnknownGroupError = new AppUnknownGroupError;


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
        this.code = 1002;
        this.message = "Unknown user";
    }
}
exports.AppUnknownUserError = AppUnknownUserError;
exports.appUnknownUserError = new AppUnknownUserError;


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
class BaseDocument {
    constructor() {
        this.__indexesCreated = (new Q_1.Q).defer();
    }
    __waitIndexesCreated() {
        return this.__indexesCreated.promise;
    }
    model() {
        this.__schema = new mongoose_1.Schema(this.schema);
        this.__schema.methods = this.methods || {};
        this.__schema.statics = this.statics || {};
        this.__schema.static('waitIndexesCreated', () => {
            return this.__waitIndexesCreated();
        });
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
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const BaseDocument_1 = __webpack_require__(/*! ./BaseDocument */ "./server/src/core/models/db/mongo/BaseDocument.ts");
const UserUsernameValidator_1 = __webpack_require__(/*! ./validators/UserUsernameValidator */ "./server/src/core/models/db/mongo/validators/UserUsernameValidator.ts");
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
            group: {
                type: mongoose_1.Schema.Types.ObjectId,
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
        return (/^([a-zA-z])*$/).test(v);
    }
}
exports.UserUsernameValidator = UserUsernameValidator;
exports.userUsernameValidator = new UserUsernameValidator();


/***/ }),

/***/ "./server/src/core/routing/AppRoute.ts":
/*!*********************************************!*\
  !*** ./server/src/core/routing/AppRoute.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AppInvalidRouteError_1 = __webpack_require__(/*! ./../errors/AppInvalidRouteError */ "./server/src/core/errors/AppInvalidRouteError.ts");
const middlewaresConfig_1 = __webpack_require__(/*! ./../../configuration/middlewares/middlewaresConfig */ "./server/src/configuration/middlewares/middlewaresConfig.ts");
class AppRoute {
    constructor() { }
    get(req, res) {
        res.json(AppInvalidRouteError_1.appInvalidRouteError.get());
    }
    post(req, res) {
        res.json(AppInvalidRouteError_1.appInvalidRouteError.get());
    }
    put(req, res) {
        res.json(AppInvalidRouteError_1.appInvalidRouteError.get());
    }
    delete(req, res) {
        res.json(AppInvalidRouteError_1.appInvalidRouteError.get());
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
const AppMongoError_1 = __webpack_require__(/*! ./../core/errors/AppMongoError */ "./server/src/core/errors/AppMongoError.ts");
class GroupRoute extends AppRoute_1.default {
    constructor() {
        super(...arguments);
        this.path = '/group/:id?';
    }
    post(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
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
                return res.json(AppMongoError_1.appMongoError.parse(err).get());
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
const AppMongoError_1 = __webpack_require__(/*! ./../core/errors/AppMongoError */ "./server/src/core/errors/AppMongoError.ts");
const AppUnknownUserError_1 = __webpack_require__(/*! ./../core/errors/AppUnknownUserError */ "./server/src/core/errors/AppUnknownUserError.ts");
const AppUnknownGroupError_1 = __webpack_require__(/*! ./../core/errors/AppUnknownGroupError */ "./server/src/core/errors/AppUnknownGroupError.ts");
const GroupDocument_1 = __webpack_require__(/*! ../core/models/db/mongo/GroupDocument */ "./server/src/core/models/db/mongo/GroupDocument.ts");
class UserRoute extends AppRoute_1.default {
    constructor() {
        super(...arguments);
        this.path = '/user/:name?';
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield UserDocument_1.User.findOne({
                    username: req.params.name || ''
                }).populate('group').exec();
                if (!user)
                    return res.json(AppUnknownUserError_1.appUnknownUserError.get());
                else {
                    return res.json({
                        handshake: 'Hi, ' + user.username,
                        group: user.group.name,
                        status: 'ok'
                    });
                }
            }
            catch (err) {
                return res.json(AppMongoError_1.appMongoError.parse(err).get());
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
                    return res.json(AppUnknownGroupError_1.appUnknownGroupError.get());
                let user = new UserDocument_1.User();
                user.username = req.body.username;
                user.password = req.body.password;
                user.group = group._id;
                yield user.save();
                return res.json({
                    handshake: 'Hi, ' + user.username + ' welcome aboard',
                    status: 'ok'
                });
            }
            catch (err) {
                return res.json(AppMongoError_1.appMongoError.parse(err).get());
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