import { baseService } from "./baseService";

export class CommentService extends baseService {
    constructor() {
        super();
    }

    getAllComment = (taskId) => {
        return this.get(`Comment/getAll?taskId=${taskId}`)
    }

    insertComment = (comment) => {
        return this.post(`Comment/insertComment`,comment)
    }

    updateComment = (commentUpdate) => {
        return this.put(`Comment/updateComment?id=${commentUpdate.id}&contentComment=${commentUpdate.contentComment}`)
    }

    deleteComment = (idComment) => {
        return this.delete(`Comment/deleteComment?idComment=${idComment}`)
    }

}

export const commentService = new CommentService();