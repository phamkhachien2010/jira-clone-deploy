import { baseService } from "./baseService";

export class UserService extends baseService {

    constructor() {
        super();
    }

    getUser = (keyWord) => {
        return this.get(`Users/getUser?keyword=${keyWord}`);
    }


    assignUserProject = (userProject) => {
        return this.post(`Project/assignUserProject`, userProject);
    }


    deleteUserFromProject = (userProject) => {
        return this.post(`Project/removeUserFromProject`, userProject);
    }


    getUserByProjectId = (idProject) => {
        return this.get(`Users/getUserByProjectId?idProject=${idProject}`)
    }

    signUpUser = (userSignUp) => {
        return this.post(`Users/signup`, userSignUp)
    }

    //service get all user
    getAllUser = () => {
        return this.get(`Users/getUser`);
    }

    //service delete user
    deleteUser = (userId) => {
        return this.delete(`Users/deleteUser?id=${userId}`)
    }

    editUser = (userEdit) => {
        return this.put(`Users/editUser`, userEdit)
    }
}


export const userService = new UserService();