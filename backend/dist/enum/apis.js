"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiQueryParams = exports.ApiStatusOptions = exports.ApiSortOptions = exports.ApiMonitoringOptions = exports.ApiHostOptions = void 0;
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
var ApiQueryParams;
(function (ApiQueryParams) {
    ApiQueryParams["STATUS"] = "status";
    ApiQueryParams["MONITORING"] = "monitoring";
    ApiQueryParams["SORT"] = "sort";
    ApiQueryParams["SEARCH"] = "search";
    ApiQueryParams["PAGE"] = "page";
    ApiQueryParams["LIMIT"] = "limit";
    ApiQueryParams["HOST"] = "host";
})(ApiQueryParams = exports.ApiQueryParams || (exports.ApiQueryParams = {}));
//# sourceMappingURL=apis.js.map