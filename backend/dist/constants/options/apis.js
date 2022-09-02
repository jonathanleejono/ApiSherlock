"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validApiHostOptions = exports.validApiMonitoringOptions = exports.validApiStatusOptions = exports.validApiSortOptions = exports.validApiSearchParams = exports.validUpdateApiKeys = exports.validCreateApiKeys = void 0;
const apis_1 = require("enum/apis");
const mockApi_1 = require("mocks/mockApi");
exports.validCreateApiKeys = Object.keys(mockApi_1.mockApi);
exports.validUpdateApiKeys = exports.validCreateApiKeys;
exports.validApiSearchParams = Object.values(apis_1.ApiQueryParamsEnum);
exports.validApiSortOptions = Object.values(apis_1.ApiSortOptions);
exports.validApiStatusOptions = Object.values(apis_1.ApiStatusOptions);
exports.validApiMonitoringOptions = Object.values(apis_1.ApiMonitoringOptions);
exports.validApiHostOptions = Object.values(apis_1.ApiHostOptions);
//# sourceMappingURL=apis.js.map