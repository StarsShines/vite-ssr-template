import { defineStore } from 'pinia';

const useUserStore = defineStore('user', {
  state: () => {
    return {
      name: '张三',
      age: 20,
      list: [] as any[]
    };
  },
  actions: {
    updateName(name: string) {
      this.name = name;
    },
    updateAge(age: number) {
      this.age = age;
    },
    updateList(list: any[]) {
      this.list = list;
    }
  }
});
export default useUserStore;
