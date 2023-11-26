import path from "path";

import {
  ForgeListrTaskDefinition,
  InitTemplateOptions,
} from "@electron-forge/shared-types";
import { BaseTemplate } from "@electron-forge/template-base";
import fs from "fs-extra";
import debug from "debug";
import determineAuthor from "./determineAuthor";

const d = debug("electron-forge:template:base");
const tmplDir = path.resolve(__dirname, "../tmpl");

class ReactWebapackTemplate extends BaseTemplate {
  public templateDir = path.resolve(__dirname, "..", "tmpl");

  public requiredForgeVersion = "^7.0.0";

  async copy(source: string, target: string): Promise<void> {
    d(`copying "${source}" --> "${target}"`);
    await fs.copy(source, target);
  }

  // 需要安装的 devDependencies
  get devDependencies(): string[] {
    const packageJSONPath = path.join(this.templateDir, "package.json");
    if (fs.pathExistsSync(packageJSONPath)) {
      const packageDevDeps = fs.readJsonSync(packageJSONPath).devDependencies;
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
  get dependencies(): string[] {
    const packageJSONPath = path.join(this.templateDir, "package.json");
    if (fs.pathExistsSync(packageJSONPath)) {
      const dependencies = fs.readJsonSync(packageJSONPath).dependencies;
      if (dependencies) {
        return Object.entries(dependencies).map(([packageName, version]) => {
          return `${packageName}@${version}`;
        });
      }
    }
    return [];
  }

  // 初始化模板，复制文件
  async initializeTemplate(
    directory: string,
    { copyCIFiles }: InitTemplateOptions
  ): Promise<ForgeListrTaskDefinition[]> {
    return [
      {
        title: "Copying starter files",
        task: async () => {
          if (copyCIFiles) {
            d(
              `Copying CI files is currently not supported - this will be updated in a later version of Forge`
            );
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
            await this.copy(
              path.resolve(tmplDir, file),
              path.resolve(directory, file.replace(/^_/, "."))
            );
          }
        },
      },
      {
        title: "Initializing package.json",
        task: async () => {
          const packageJSON = await fs.readJson(
            path.resolve(__dirname, "../tmpl/package.json")
          );
          packageJSON.productName = packageJSON.name = path
            .basename(directory)
            .toLowerCase();
          packageJSON.author = await determineAuthor(directory);
          await fs.writeJson(
            path.resolve(directory, "package.json"),
            packageJSON,
            { spaces: 2 }
          );
        },
      },
    ];
  }
}

export default new ReactWebapackTemplate();
