import fs from 'fs';
import path from 'path';

const appDirectory = fs.realpathSync(process.cwd());

export const resolveApp = (relativePath: string): string => {
  return path.resolve(appDirectory, relativePath);
};

export const appSrcPath = resolveApp('./src');
