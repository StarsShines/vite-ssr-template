import { createPinia } from 'pinia';
import useUserStore from './user';

export default () => {
  const pinia = createPinia();
  return pinia;
};

export const registerPinia = (pinia: any) => {
  useUserStore(pinia);
};
