"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validUpdateUserKeys = exports.validLoginKeys = exports.validRegisterKeys = void 0;
const mockUser_1 = require("mocks/mockUser");
const { name, email, password, timezoneGMT } = mockUser_1.mockUser;
exports.validRegisterKeys = Object.keys(mockUser_1.mockUser);
exports.validLoginKeys = Object.keys({ email, password });
exports.validUpdateUserKeys = Object.keys({ name, email, timezoneGMT });
//# sourceMappingURL=user.js.map