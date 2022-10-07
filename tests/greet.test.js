"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const greet_1 = __importDefault(require("../src/greet"));
describe('greet', () => {
    test('should say hello to Pram.', () => {
        const response = (0, greet_1.default)('Pram');
        expect(response).toBe('Hello, Pram!');
    });
});
