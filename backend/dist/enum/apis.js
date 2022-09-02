"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiQueryParamsEnum = exports.ApiStatusOptions = exports.ApiSortOptions = exports.ApiMonitoringOptions = exports.ApiHostOptions = void 0;
var ApiHostOptions;
(function (ApiHostOptions) {
    ApiHostOptions["AWS"] = "AWS";
    ApiHostOptions["GCP"] = "GCP";
    ApiHostOptions["AZURE"] = "Azure";
    ApiHostOptions["HEROKU"] = "Heroku";
    ApiHostOptions["DIGITALOCEAN"] = "DigitalOcean";
    ApiHostOptions["VERCEL"] = "Vercel";
    ApiHostOptions["NETLIFY"] = "Netlify";
    ApiHostOptions["OTHER"] = "Other";
})(ApiHostOptions = exports.ApiHostOptions || (exports.ApiHostOptions = {}));
var ApiMonitoringOptions;
(function (ApiMonitoringOptions) {
    ApiMonitoringOptions["ON"] = "on";
    ApiMonitoringOptions["OFF"] = "off";
})(ApiMonitoringOptions = exports.ApiMonitoringOptions || (exports.ApiMonitoringOptions = {}));
var ApiSortOptions;
(function (ApiSortOptions) {
    ApiSortOptions["LATEST"] = "Latest";
    ApiSortOptions["OLDEST"] = "Oldest";
    ApiSortOptions["A_Z"] = "A-Z";
    ApiSortOptions["Z_A"] = "Z-A";
})(ApiSortOptions = exports.ApiSortOptions || (exports.ApiSortOptions = {}));
var ApiStatusOptions;
(function (ApiStatusOptions) {
    ApiStatusOptions["HEALTHY"] = "healthy";
    ApiStatusOptions["UNHEALTHY"] = "unhealthy";
    ApiStatusOptions["PENDING"] = "pending";
})(ApiStatusOptions = exports.ApiStatusOptions || (exports.ApiStatusOptions = {}));
var ApiQueryParamsEnum;
(function (ApiQueryParamsEnum) {
    ApiQueryParamsEnum["STATUS"] = "status";
    ApiQueryParamsEnum["MONITORING"] = "monitoring";
    ApiQueryParamsEnum["SORT"] = "sort";
    ApiQueryParamsEnum["SEARCH"] = "search";
    ApiQueryParamsEnum["PAGE"] = "page";
    ApiQueryParamsEnum["LIMIT"] = "limit";
    ApiQueryParamsEnum["HOST"] = "host";
})(ApiQueryParamsEnum = exports.ApiQueryParamsEnum || (exports.ApiQueryParamsEnum = {}));
//# sourceMappingURL=apis.js.map