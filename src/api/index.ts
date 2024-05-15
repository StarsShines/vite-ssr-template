import http from '@/common/js/http';
import { DataRes } from './index.d';

//日志录入
export const setVuelog = (params: any): Promise<DataRes> => http.post('/vuelog', params).then((res) => res);
//获取记录
export const getXX = (params: any): Promise<DataRes> => http.get('/api/xx', params).then((res) => res);

export const postYY = (params: any): Promise<DataRes> => http.post('/api/yy', params).then((res) => res);
