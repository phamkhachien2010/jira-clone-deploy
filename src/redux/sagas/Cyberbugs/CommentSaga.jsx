import { takeLatest, call, put } from 'redux-saga/effects'
import { commentService } from '../../../services/CommentService'
import { DELETE_COMMENT_API, GET_ALL_COMMENT, GET_ALL_COMMENT_API, INSERT_COMMENT_API, UPDATE_COMMENT_API } from '../../constants/Cyberbugs/CommentConst'
import { GET_TASK_DETAIL_SAGA } from '../../constants/Cyberbugs/TaskConstants'
import { DISPLAY_LOADING, HIDE_LOADING } from '../../constants/LoadingConst'

/**
 * saga theo dõi getAll comment
 * version 1.0
 * Hiền code ngày 2/4/2022
 */
function* getAllCommentSaga(action) {

    try {
        const { data, status } = yield call(() => commentService.getAllComment(action.taskId))

        yield put({
            type: GET_ALL_COMMENT,
            listComment: data.content
        })

    } catch (error) {

    }
}

export function* theoDoiGetAllCommentSaga() {
    yield takeLatest(GET_ALL_COMMENT_API, getAllCommentSaga)
}

/**
 * saga theo dõi insert comment
 * version 1.0
 * Hiền code ngày 2/4/2022
 */
function* insertCommentSaga(action) {
    try {
        yield call(() => commentService.insertComment(action.comment))

        yield put({
            type: GET_TASK_DETAIL_SAGA,
            taskId: action.comment.taskId
        })

    } catch (error) {

    }
}

export function* theoDoiInsertCommentSaga() {
    yield takeLatest(INSERT_COMMENT_API, insertCommentSaga)
}

/**
 * saga theo dõi update comment
 * version 1.0
 * Hiền code ngày 2/4/2022
 */
function* updateCommentSaga(action) {
    try {
        yield call(() => commentService.updateComment(action.commentUpdate))

        yield put({
            type: GET_TASK_DETAIL_SAGA,
            taskId: action.taskId
        })
    } catch (error) {

    }
}

export function* theoDoiUpdateCommentSaga() {
    yield takeLatest(UPDATE_COMMENT_API, updateCommentSaga)
}

/**
 * saga theo dõi delete comment
 * version 1.0
 * Hiền code ngày 2/4/2022
 */
function* deleteCommentSaga(action) {
    try {
        yield put({
            type: DISPLAY_LOADING
        })
        yield call(() => commentService.deleteComment(action.idComment))

        yield put({
            type: GET_TASK_DETAIL_SAGA,
            taskId: action.taskId
        })

    } catch (error) {

    }
    yield put({ type: HIDE_LOADING })
}

export function* theoDoiDeleteCommentApi() {
    yield takeLatest(DELETE_COMMENT_API, deleteCommentSaga)
}

