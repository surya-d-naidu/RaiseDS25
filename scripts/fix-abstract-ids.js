"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var db_1 = require("../server/db");
var schema_1 = require("../shared/schema");
var drizzle_orm_1 = require("drizzle-orm");
// Inline category code map (same as in db-storage)
var categoryCodeMap = {
    "Actuarial Statistics": "AS",
    "Agricultural Statistics": "AG",
    "AI & Machine Learning": "ML",
    "Applied Mathematics": "AM",
    "Applied Statistics": "AP",
    "Bayesian and Fuzzy Statistics": "BF",
    "Bio-Statistics": "BS",
    "Data Science Techniques": "DS",
    "Distribution Theory": "DT",
    "Econometrics": "EC",
    "Environmental Statistics": "ES",
    "Mathematical Modelling": "MM",
    "Multi-Disciplinary Research": "MD",
    "Multivariate Analysis": "MV",
    "Official Statistics": "OS",
    "Operations Research": "OR",
    "Planning and Experimental Designs": "PE",
    "Population Studies": "PS",
    "Probability Theory": "PT",
    "Reliability and Survival Analysis": "RS",
    "Spatial Statistics": "SP",
    "Statistical Inference": "SI",
    "Statistical Quality Control": "SQ",
    "Statistics in Management": "SM",
    "Stochastic Modelling": "ST",
    "Survey Sampling": "SS",
    "Time Series Analysis": "TS",
    "Other": "OT"
};
function getCategoryCode(category) {
    return categoryCodeMap[category] || "XX";
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var all, grouped, _i, all_1, abs, code, _a, _b, _c, _d, code, idx, abs, newRef;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, db_1.db.select().from(schema_1.abstracts).orderBy((0, drizzle_orm_1.asc)(schema_1.abstracts.createdAt))];
                case 1:
                    all = _e.sent();
                    grouped = {};
                    for (_i = 0, all_1 = all; _i < all_1.length; _i++) {
                        abs = all_1[_i];
                        code = getCategoryCode(abs.category);
                        if (!grouped[code])
                            grouped[code] = [];
                        grouped[code].push(abs);
                    }
                    _a = grouped;
                    _b = [];
                    for (_c in _a)
                        _b.push(_c);
                    _d = 0;
                    _e.label = 2;
                case 2:
                    if (!(_d < _b.length)) return [3 /*break*/, 7];
                    _c = _b[_d];
                    if (!(_c in _a)) return [3 /*break*/, 6];
                    code = _c;
                    idx = 0;
                    _e.label = 3;
                case 3:
                    if (!(idx < grouped[code].length)) return [3 /*break*/, 6];
                    abs = grouped[code][idx];
                    newRef = "".concat(code, "-").concat(String(idx + 1).padStart(4, '0'));
                    return [4 /*yield*/, db_1.db.update(schema_1.abstracts).set({ referenceId: newRef }).where((0, drizzle_orm_1.eq)(schema_1.abstracts.id, abs.id))];
                case 4:
                    _e.sent();
                    console.log("Updated abstract ".concat(abs.id, " to ").concat(newRef));
                    _e.label = 5;
                case 5:
                    idx++;
                    return [3 /*break*/, 3];
                case 6:
                    _d++;
                    return [3 /*break*/, 2];
                case 7:
                    console.log('Done.');
                    return [2 /*return*/];
            }
        });
    });
}
main().catch(console.error);
