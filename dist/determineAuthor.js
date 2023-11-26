"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const cross_spawn_promise_1 = require("@malept/cross-spawn-promise");
const debug_1 = tslib_1.__importDefault(require("debug"));
const username_1 = tslib_1.__importDefault(require("username"));
const d = (0, debug_1.default)("electron-forge:determine-author");
async function getGitConfig(name, cwd) {
    const value = await (0, cross_spawn_promise_1.spawn)("git", ["config", "--get", name], { cwd });
    return value.trim();
}
const getAuthorFromGitConfig = async (dir) => {
    try {
        const name = await getGitConfig("user.name", dir);
        const email = await getGitConfig("user.email", dir);
        return { name, email };
    }
    catch (err) {
        d("Error when getting git config:", err);
        return undefined;
    }
};
exports.default = async (dir) => (await getAuthorFromGitConfig(dir)) || (0, username_1.default)();
