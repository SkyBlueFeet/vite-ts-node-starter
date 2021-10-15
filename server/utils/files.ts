import { readFile, writeFile } from 'fs';
import { promisify } from 'util';
import { isString } from 'lodash';
import YAML from 'yaml';

export async function loadText(path: string): Promise<string> {
  return promisify(readFile)(path)
    .then((content) => {
      return content.toString();
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export async function saveText(path: string, str: string): Promise<void> {
  return promisify(writeFile)(path, str);
}

export async function loadJson<T = any>(path: string): Promise<T> {
  return loadText(path)
    .then((content) => {
      const obj = JSON.parse(content);
      return obj;
    })
    .catch((error) => {
      return Promise.reject(error);
    });
}

export async function saveJson(path: string, obj: object): Promise<void> {
  const str = JSON.stringify(obj);

  return promisify(writeFile)(path, str);
}

export async function loadConfig(path: string) {
  return loadText(path).then((str) => {
    return YAML.parse(str);
  });
}

/**
 * 当配置文件不存在时使用默认配置创建文件
 * @param path 读取路径
 * @param defConf 默认配置
 * @returns
 */
export async function verifyConfigFile<T>(
  path: string,
  defConf: T,
  format: 'yaml' | 'json'
): Promise<T> {
  return promisify(readFile)(path)
    .then((content) => {
      const obj = JSON.parse(content.toString());
      return obj;
    })
    .catch(async (error) => {
      if (error.code === 'ENOENT') {
        await promisify(writeFile)(
          path,
          isString(defConf) ? defConf : JSON.stringify(isString(defConf))
        );
        return defConf;
      } else {
        return Promise.reject(error);
      }
    });
}
