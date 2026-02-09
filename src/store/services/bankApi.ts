import  {API } from "../../config/axios";

export const getBanksApi = () => API.get("/bank/");

