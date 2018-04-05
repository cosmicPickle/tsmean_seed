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

/***/ "./src/App.ts":
/*!********************!*\
  !*** ./src/App.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const express = __webpack_require__(/*! express */ "express");
const AppRoutesRegistry_1 = __webpack_require__(/*! ./core/routing/AppRoutesRegistry */ "./src/core/routing/AppRoutesRegistry.ts");
const middlewaresConfig_1 = __webpack_require__(/*! ./configuration/middlewares/middlewaresConfig */ "./src/configuration/middlewares/middlewaresConfig.ts");
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

/***/ "./src/configuration/db/mongo.ts":
/*!***************************************!*\
  !*** ./src/configuration/db/mongo.ts ***!
  \***************************************/
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

/***/ "./src/configuration/middlewares/middlewaresConfig.ts":
/*!************************************************************!*\
  !*** ./src/configuration/middlewares/middlewaresConfig.ts ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = __webpack_require__(/*! body-parser */ "body-parser");
const AppLoggerMiddleware_1 = __webpack_require__(/*! ./../../middlewares/AppLoggerMiddleware */ "./src/middlewares/AppLoggerMiddleware.ts");
exports.middlewares = {
    _: [
        bodyParser.urlencoded({ extended: false }),
        bodyParser.json(),
        AppLoggerMiddleware_1.appLoggerMiddleware.log
    ],
    '/user/:name?': {
        get: [AppLoggerMiddleware_1.appLoggerMiddleware.log]
    }
};
exports.default = exports.middlewares;


/***/ }),

/***/ "./src/configuration/routes/routesConfig.ts":
/*!**************************************************!*\
  !*** ./src/configuration/routes/routesConfig.ts ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const UserRoute_1 = __webpack_require__(/*! ./../../routes/UserRoute */ "./src/routes/UserRoute.ts");
const DefaultRoute_1 = __webpack_require__(/*! ./../../routes/DefaultRoute */ "./src/routes/DefaultRoute.ts");
exports.routesConfig = [
    DefaultRoute_1.defaultRoute,
    UserRoute_1.userRoute
];
exports.default = exports.routesConfig;


/***/ }),

/***/ "./src/core/db/mongo/BaseModel.ts":
/*!****************************************!*\
  !*** ./src/core/db/mongo/BaseModel.ts ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __webpack_require__(/*! mongoose */ "mongoose");
const connection_1 = __webpack_require__(/*! ./connection */ "./src/core/db/mongo/connection.ts");
class BaseModel {
    model() {
        this.schema = new mongoose_1.Schema(this._schema);
        this.schema.methods = this._methods;
        return connection_1.mongoose.model(this._name, this.schema);
    }
}
exports.BaseModel = BaseModel;
exports.default = BaseModel;


/***/ }),

/***/ "./src/core/db/mongo/connection.ts":
/*!*****************************************!*\
  !*** ./src/core/db/mongo/connection.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = __webpack_require__(/*! mongoose */ "mongoose");
exports.mongoose = mongoose;
const mongo_1 = __webpack_require__(/*! ./../../../configuration/db/mongo */ "./src/configuration/db/mongo.ts");
const connect = `mongodb://${mongo_1.mongoConfig.user}:${mongo_1.mongoConfig.password}@${mongo_1.mongoConfig.host}`;
mongoose.connect(connect);


/***/ }),

/***/ "./src/core/db/mongo/validators/BaseValidator.ts":
/*!*******************************************************!*\
  !*** ./src/core/db/mongo/validators/BaseValidator.ts ***!
  \*******************************************************/
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

/***/ "./src/core/errors/AppError.ts":
/*!*************************************!*\
  !*** ./src/core/errors/AppError.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class AppError {
    get() {
        return {
            code: this.code,
            message: this.message
        };
    }
}
exports.AppError = AppError;
exports.default = AppError;


/***/ }),

/***/ "./src/core/routing/AppRoute.ts":
/*!**************************************!*\
  !*** ./src/core/routing/AppRoute.ts ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AppInvalidRouteError_1 = __webpack_require__(/*! ./../../errors/AppInvalidRouteError */ "./src/errors/AppInvalidRouteError.ts");
const middlewaresConfig_1 = __webpack_require__(/*! ./../../configuration/middlewares/middlewaresConfig */ "./src/configuration/middlewares/middlewaresConfig.ts");
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

/***/ "./src/core/routing/AppRoutesRegistry.ts":
/*!***********************************************!*\
  !*** ./src/core/routing/AppRoutesRegistry.ts ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const routesConfig_1 = __webpack_require__(/*! ./../../configuration/routes/routesConfig */ "./src/configuration/routes/routesConfig.ts");
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

/***/ "./src/errors/AppInvalidRouteError.ts":
/*!********************************************!*\
  !*** ./src/errors/AppInvalidRouteError.ts ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __webpack_require__(/*! ../core/errors/AppError */ "./src/core/errors/AppError.ts");
class AppInvalidRouteError extends AppError_1.AppError {
    constructor() {
        super(...arguments);
        this.code = 1000;
        this.message = "Invalid Route";
    }
}
exports.AppInvalidRouteError = AppInvalidRouteError;
exports.appInvalidRouteError = new AppInvalidRouteError();


/***/ }),

/***/ "./src/errors/AppMongoError.ts":
/*!*************************************!*\
  !*** ./src/errors/AppMongoError.ts ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __webpack_require__(/*! ../core/errors/AppError */ "./src/core/errors/AppError.ts");
class AppMongoError extends AppError_1.AppError {
    constructor() {
        super(...arguments);
        this.code = 1001;
        this.message = "Mongo Error";
    }
}
exports.AppMongoError = AppMongoError;
exports.appMongoError = new AppMongoError();


/***/ }),

/***/ "./src/errors/AppUnknownUserError.ts":
/*!*******************************************!*\
  !*** ./src/errors/AppUnknownUserError.ts ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __webpack_require__(/*! ../core/errors/AppError */ "./src/core/errors/AppError.ts");
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

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = __webpack_require__(/*! ./App */ "./src/App.ts");
const http = __webpack_require__(/*! http */ "http");
const port = process.env.PORT || 3000;
http.createServer(App_1.default).listen(port, (err) => {
    if (err) {
        return console.log(err);
    }
    return console.log(`server is listening on ${port}`);
});
exports.server = App_1.default;


/***/ }),

/***/ "./src/middlewares/AppLoggerMiddleware.ts":
/*!************************************************!*\
  !*** ./src/middlewares/AppLoggerMiddleware.ts ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class AppLoggerMiddleware {
    constructor() {
        this.log = (req, res, next) => {
            console.log(`Request ${req.method.toUpperCase()} ${req.path}: ${JSON.stringify(req.params)}`);
            next();
        };
    }
}
exports.AppLoggerMiddleware = AppLoggerMiddleware;
exports.appLoggerMiddleware = new AppLoggerMiddleware();


/***/ }),

/***/ "./src/models/db/mongo/UserModel.ts":
/*!******************************************!*\
  !*** ./src/models/db/mongo/UserModel.ts ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BaseModel_1 = __webpack_require__(/*! ../../../core/db/mongo/BaseModel */ "./src/core/db/mongo/BaseModel.ts");
const UserUsernameValidator_1 = __webpack_require__(/*! ./validators/UserUsernameValidator */ "./src/models/db/mongo/validators/UserUsernameValidator.ts");
class UserModel extends BaseModel_1.BaseModel {
    constructor() {
        super(...arguments);
        this._name = 'User';
        this._schema = {
            username: {
                type: String,
                required: true,
                validate: UserUsernameValidator_1.userUsernameValidator.use()
            },
            password: {
                type: String,
                required: true
            },
            permissions: {
                type: Number
            }
        };
        this._methods = {
            hasPermission: function (threshold) {
                return this.permissions <= threshold;
            }
        };
    }
}
exports.User = ((new UserModel()).model());
exports.default = exports.User;


/***/ }),

/***/ "./src/models/db/mongo/validators/UserUsernameValidator.ts":
/*!*****************************************************************!*\
  !*** ./src/models/db/mongo/validators/UserUsernameValidator.ts ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const BaseValidator_1 = __webpack_require__(/*! ../../../../core/db/mongo/validators/BaseValidator */ "./src/core/db/mongo/validators/BaseValidator.ts");
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

/***/ "./src/routes/DefaultRoute.ts":
/*!************************************!*\
  !*** ./src/routes/DefaultRoute.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const AppRoute_1 = __webpack_require__(/*! ./../core/routing/AppRoute */ "./src/core/routing/AppRoute.ts");
class DefaultRoute extends AppRoute_1.default {
    constructor() {
        super(...arguments);
        this.path = '/';
    }
}
exports.DefaultRoute = DefaultRoute;
exports.defaultRoute = new DefaultRoute();


/***/ }),

/***/ "./src/routes/UserRoute.ts":
/*!*********************************!*\
  !*** ./src/routes/UserRoute.ts ***!
  \*********************************/
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
const AppRoute_1 = __webpack_require__(/*! ./../core/routing/AppRoute */ "./src/core/routing/AppRoute.ts");
const UserModel_1 = __webpack_require__(/*! ./../models/db/mongo/UserModel */ "./src/models/db/mongo/UserModel.ts");
const AppMongoError_1 = __webpack_require__(/*! ./../errors/AppMongoError */ "./src/errors/AppMongoError.ts");
const AppUnknownUserError_1 = __webpack_require__(/*! ./../errors/AppUnknownUserError */ "./src/errors/AppUnknownUserError.ts");
class UserRoute extends AppRoute_1.default {
    constructor() {
        super(...arguments);
        this.path = '/user/:name?';
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield UserModel_1.User.findOne({
                    username: req.params.name || ''
                });
                if (!user)
                    return res.json(AppUnknownUserError_1.appUnknownUserError.get());
                else {
                    return res.json({
                        handshake: 'Hi, ' + user.username,
                        hasPermission: user.hasPermission(1),
                        status: 'ok'
                    });
                }
            }
            catch (err) {
                return res.json(AppMongoError_1.appMongoError.get());
            }
        });
    }
}
exports.UserRoute = UserRoute;
exports.userRoute = new UserRoute();


/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/index.ts ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./src/index.ts */"./src/index.ts");


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

/***/ })

/******/ });
//# sourceMappingURL=index.js.map