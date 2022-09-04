"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validApiSortOptions = exports.validApiSearchParams = exports.validUpdateApiKeys = exports.validCreateApiKeys = void 0;
const apis_1 = require("enum/apis");
const mockApi_1 = require("mocks/mockApi");
exports.validCreateApiKeys = Object.keys(mockApi_1.mockApi);
exports.validUpdateApiKeys = exports.validCreateApiKeys;
exports.validApiSearchParams = [
    apis_1.ApiQueryParams.STATUS,
    apis_1.ApiQueryParams.MONITORING,
    apis_1.ApiQueryParams.SORT,
    apis_1.ApiQueryParams.SEARCH,
    apis_1.ApiQueryParams.PAGE,
    apis_1.ApiQueryParams.LIMIT,
];
exports.validApiSortOptions = Object.keys(apis_1.ApiSortOptions);
console.log("hello");
console.log(exports.validApiSortOptions);
//# sourceMappingURL=test3.js.map