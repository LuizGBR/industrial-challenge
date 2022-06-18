import api from "./api";

export async function getToken(){
    const response = await api.post('/Login', {
        userName: "usuario2@teste.com",
        password: "222222"
      });
      
    const {token} = response.data;

    return token;
}