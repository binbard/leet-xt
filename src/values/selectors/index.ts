import lc from './lc';
import Config from '@/values/config';

export const css_selectors = {
  lc,
}

function createSelfProxy(target: any, currentPath = Config.Strings.CSS_PREFIX): typeof css_selectors {

  const stringObj = new String(target.self || currentPath);

  //@ts-ignore
  return new Proxy(stringObj, {
    get(_, prop: any) {
      // Handle native props
      if (prop in stringObj) {
        return stringObj[prop];
      }

      // Forward property access to the target object
      const value = target[prop];

      if (typeof value === 'string' && value === '') {
        return `${currentPath}-${prop}`;        // # here
      }

      // Recursively proxy nested objects
      if (value && typeof value === 'object') {
        return createSelfProxy(value, `${currentPath}-${prop}`);
      }

      return value;
    }
  });
}


const Selectors = createSelfProxy(css_selectors);

export default Selectors;