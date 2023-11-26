"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = tslib_1.__importDefault(require("path"));
const template_base_1 = require("@electron-forge/template-base");
const fs_extra_1 = tslib_1.__importDefault(require("fs-extra"));
const debug_1 = tslib_1.__importDefault(require("debug"));
const determineAuthor_1 = tslib_1.__importDefault(require("./determineAuthor"));
const d = (0, debug_1.default)("electron-forge:template:base");
const tmplDir = path_1.default.resolve(__dirname, "../tmpl");
class ReactWebapackTemplate extends template_base_1.BaseTemplate {
    constructor() {
        super(...arguments);
        this.templateDir = path_1.default.resolve(__dirname, "..", "tmpl");
        this.requiredForgeVersion = "^7.0.0";
    }
    async copy(source, target) {
        d(`copying "${source}" --> "${target}"`);
        await fs_extra_1.default.copy(source, target);
    }
    // 需要安装的 devDependencies
    get devDependencies() {
        const packageJSONPath = path_1.default.join(this.templateDir, "package.json");
        if (fs_extra_1.default.pathExistsSync(packageJSONPath)) {
            const packageDevDeps = fs_extra_1.default.readJsonSync(packageJSONPath).devDependencies;
            if (packageDevDeps) {
                return Object.entries(packageDevDeps).map(([packageName, version]) => {
                    if (packageName.startsWith("@electron-forge/")) {
                        version = `${this.requiredForgeVersion}`;
                    }
                    return `${packageName}@${version}`;
                });
            }
        }
        return [];
    }
    // 需要安装的 dependencies
    get dependencies() {
        const packageJSONPath = path_1.default.join(this.templateDir, "package.json");
        if (fs_extra_1.default.pathExistsSync(packageJSONPath)) {
            const dependencies = fs_extra_1.default.readJsonSync(packageJSONPath).dependencies;
            if (dependencies) {
                return Object.entries(dependencies).map(([packageName, version]) => {
                    return `${packageName}@${version}`;
                });
            }
        }
        return [];
    }
    // 初始化模板，复制文件
    async initializeTemplate(directory, { copyCIFiles }) {
        return [
            {
                title: "Copying starter files",
                task: async () => {
                    if (copyCIFiles) {
                        d(`Copying CI files is currently not supported - this will be updated in a later version of Forge`);
                    }
                    const sources = [
                        ".vscode",
                        "configs",
                        "src",
                        "_gitignore",
                        "_npmrc",
                        "forge.config.ts",
                        "index.html",
                        "tsconfig.json",
                    ];
                    for (const file of sources) {
                        await this.copy(path_1.default.resolve(tmplDir, file), path_1.default.resolve(directory, file.replace(/^_/, ".")));
                    }
                },
            },
            {
                title: "Initializing package.json",
                task: async () => {
                    const packageJSON = await fs_extra_1.default.readJson(path_1.default.resolve(__dirname, "../tmpl/package.json"));
                    packageJSON.productName = packageJSON.name = path_1.default
                        .basename(directory)
                        .toLowerCase();
                    packageJSON.author = await (0, determineAuthor_1.default)(directory);
                    await fs_extra_1.default.writeJson(path_1.default.resolve(directory, "package.json"), packageJSON, { spaces: 2 });
                },
            },
        ];
    }
}
exports.default = new ReactWebapackTemplate();
