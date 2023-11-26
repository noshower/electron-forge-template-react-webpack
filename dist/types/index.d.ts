import { ForgeListrTaskDefinition, InitTemplateOptions } from "@electron-forge/shared-types";
import { BaseTemplate } from "@electron-forge/template-base";
declare class ReactWebapackTemplate extends BaseTemplate {
    templateDir: string;
    requiredForgeVersion: string;
    copy(source: string, target: string): Promise<void>;
    get devDependencies(): string[];
    get dependencies(): string[];
    initializeTemplate(directory: string, { copyCIFiles }: InitTemplateOptions): Promise<ForgeListrTaskDefinition[]>;
}
declare const _default: ReactWebapackTemplate;
export default _default;
