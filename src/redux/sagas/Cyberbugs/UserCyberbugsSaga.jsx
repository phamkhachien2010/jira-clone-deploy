import Axios from 'axios';
import { call, delay, fork, take, takeEvery, takeLatest, put, select } from 'redux-saga/effects';
import { cyberbugsService } from '../../../services/CyberbugsService';
import { DELETE_USER_API, EDIT_USER_API, GET_ALL_USER, GET_ALL_USER_API, SIGN_UP_USER, SIGN_UP_USER_API, USER_SIGNIN_API, USLOGIN } from '../../constants/Cyberbugs/Cyberbugs';
import { DISPLAY_LOADING, HIDE_LOADING } from '../../constants/LoadingConst';
import { STATUS_CODE, TOKEN, USER_LOGIN } from '../../../util/constants/settingSystem'

import { history } from '../../../util/history';
import { userService } from '../../../services/UserService';
import { GET_USER_BY_PROJECT_ID, GET_USER_BY_PROJECT_ID_SAGA } from '../../constants/Cyberbugs/UserConstatnts';
import { array } from 'yup';
import { notifiFunction } from '../../../util/Notification/notificationCyberbugs';

//Quản lý các action saga
function* signinSaga(action) {
    // console.log(action);
    yield put({
        type: DISPLAY_LOADING
    })
    yield delay(500);

    //Gọi api 
    try {
        const { data, status } = yield call(() => cyberbugsService.signinCyberBugs(action.userLogin));

        //Lưu vào localstorage khi đăng nhập thành công
        localStorage.setItem(TOKEN, data.content.accessToken);
        localStorage.setItem(USER_LOGIN, JSON.stringify(data.content));


        yield put({
            type: USLOGIN,
            userLogin: data.content
        })

        // let history = yield select(state=> state.HistoryReducer.history)

        history.push('/projectmanagement');

    } catch (err) {
        console.log(err.response.data)
    }


    yield put({
        type: HIDE_LOADING
    })

}


export function* theoDoiSignin() {
    yield takeLatest(USER_SIGNIN_API, signinSaga);
}




//Quản lý các action saga
function* getUserSaga(action) {

    //action.keyWord
    // console.log("keyword", action.keyWord);
    //Gọi api 
    try {
        const { data, status } = yield call(() => userService.getUser(action.keyWord));

        yield put({
            type: GET_ALL_USER,
            arrAllUser: data.content
        })

        yield put({
            type: 'GET_USER_SEARCH',
            lstUserSearch: data.content
        })
        console.log("data", data);

    } catch (err) {
        console.log(err.response.data)
    }
}



export function* theoDoiGetUser() {
    yield takeLatest("GET_USER_API", getUserSaga);
}





//Quản lý các action saga
function* addUserProjectSaga(action) {


    try {
        const { data, status } = yield call(() => userService.assignUserProject(action.userProject));

        yield put({
            type: 'GET_LIST_PROJECT_SAGA'
        })

    } catch (err) {
        console.log(err.response.data)
    }
}



export function* theoDoiAddUserProject() {
    yield takeLatest("ADD_USER_PROJECT_API", addUserProjectSaga);
}






//Quản lý các action saga
function* removeUserProjectSaga(action) {


    try {
        const { data, status } = yield call(() => userService.deleteUserFromProject(action.userProject));

        yield put({
            type: 'GET_LIST_PROJECT_SAGA'
        })

    } catch (err) {
        console.log(err.response.data)
    }
}



export function* theoDoiRemoveUserProject() {
    yield takeLatest("REMOVE_USER_PROJECT_API", removeUserProjectSaga);
}




function* getUserByProjectIdSaga(action) {
    const { idProject } = action;
    console.log('action', idProject)

    try {
        const { data, status } = yield call(() => userService.getUserByProjectId(idProject));
        console.log('checkdata', data);

        if (status === STATUS_CODE.SUCCESS) {
            yield put({
                type: GET_USER_BY_PROJECT_ID,
                arrUser: data.content
            })
        }

    } catch (err) {
        console.log(err);
        console.log(err.response?.data);
        if (err.response?.data.statusCode === STATUS_CODE.NOT_FOUND) {
            yield put({
                type: GET_USER_BY_PROJECT_ID,
                arrUser: []
            })
        }
    }
}



export function* theoDoiGetUserByProjectIdSaga() {
    yield takeLatest(GET_USER_BY_PROJECT_ID_SAGA, getUserByProjectIdSaga)
}

/**
 * saga theo dõi sign up
 * Hiền code ngày 3/4/2022
 * version 1.0
 */

function* signUpUser(action) {
    yield put({
        type: DISPLAY_LOADING
    })
    yield delay(500);

    try {
        const { data, status } = yield call(() => userService.signUpUser(action.userSignUp))
        if (status === STATUS_CODE.SUCCESS) {
            notifiFunction('success', 'Create a user successfully !')
            history.push('/login')
        } else if (status === STATUS_CODE.NOT_FOUND) {
            notifiFunction('error', 'Email is already exist !')
        } else {
            notifiFunction('error', 'Create a user fail !')
        }

    } catch (error) {
        notifiFunction('error', 'Create a user fail !')
    }
    yield put({
        type: HIDE_LOADING
    })
}

export function* theoDoiSignUpUser() {
    yield takeLatest(SIGN_UP_USER_API, signUpUser)
}

/**
 * saga theo dõi get all user
 * Hiền code ngày 3/4/2022
 * version 1.0
 */
// function* getAllUserSaga(action) {
//     try {
//         const { data, status } = yield call(() => userService.getAllUser())
//         if (status === STATUS_CODE.SUCCESS) {
//             yield put({
//                 type: GET_ALL_USER,
//                 arrAllUser: data.content
//             })
//         }
//     } catch (error) {

//     }
// }

// export function* theoDoiGetAllUserSaga() {
//     yield takeLatest(GET_ALL_USER_API, getAllUserSaga)
// }

/**
 * saga theo dõi delete user
 * Hiền code ngày 3/4/2022
 * version 1.0
 */
function* deleteUserSaga(action) {
    yield put({
        type: DISPLAY_LOADING
    })
    yield delay(500)
    try {
        const { data, status } = yield call(() => userService.deleteUser(action.userId))
        if (status === STATUS_CODE.SUCCESS) {
            yield put({
                type: 'GET_USER_API',
                keyWord: ''
            })
            notifiFunction('success', 'Delete user successfully !')
        } else {
            notifiFunction('error', 'Delete user fail !')
        }
    } catch (error) {
        notifiFunction('error', 'Delete user fail !')
    }
    yield put({ type: HIDE_LOADING })
}

export function* theoDoiDeleteUserSaga() {
    yield takeLatest(DELETE_USER_API, deleteUserSaga)
}

/**
 * saga theo dõi edit user
 * Hiền code ngày 3/4/2022
 * version 1.0
 */
function* editUserSaga(action) {
    yield put({ type: DISPLAY_LOADING })
    yield delay(500)
    try {
        yield call(() => userService.editUser(action.userEdit))
        yield put({
            type: 'GET_USER_API',
            keyWord: ''
        })
        yield put({
            type: 'CLOSE_DRAWER'
        })
    } catch (error) {

    }
    yield put({ type: HIDE_LOADING })
}

export function* theoDoiEditUserSaga() {
    yield takeLatest(EDIT_USER_API, editUserSaga)
}