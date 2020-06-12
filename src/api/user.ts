import ajax, {BASE_URL} from "./ajax.js";

export const login = (user: string, password: string) => ajax(BASE_URL + '/user/login', {user, password}, 'POST');
export const getUserInfo = (id: string) => ajax(BASE_URL + '/user/get/' + id);
