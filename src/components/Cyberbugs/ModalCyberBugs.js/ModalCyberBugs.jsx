import React, { Fragment, useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import ReactHtmlParser from "react-html-parser";
// import parse from 'html-react-parser';
import { GET_ALL_STATUS_SAGA } from '../../../redux/constants/Cyberbugs/StatusConstant';
import { GET_ALL_PRIORITY_SAGA } from '../../../redux/constants/Cyberbugs/PriorityConstants';
import { CHANGE_ASSIGNESS, CHANGE_TASK_MODAL, HANDLE_CHANGE_POST_API_SAGA, REMOVE_USER_ASSIGN, UPDATE_STATUS_TASK_SAGA } from '../../../redux/constants/Cyberbugs/TaskConstants';
import { GET_ALL_TASK_TYPE_SAGA } from '../../../redux/constants/Cyberbugs/TaskTypeConstants';
import { Editor } from '@tinymce/tinymce-react'
import { Select } from 'antd';
import { DELETE_COMMENT_API, GET_ALL_COMMENT_API, INSERT_COMMENT_API, UPDATE_COMMENT_API } from '../../../redux/constants/Cyberbugs/CommentConst';

const { Option } = Select;


export default function ModalCyberBugs(props) {

    const { taskDetailModal } = useSelector(state => state.TaskReducer);
    const { arrStatus } = useSelector(state => state.StatusReducer);
    const { arrPriority } = useSelector(state => state.PriorityReducer);
    const { arrTaskType } = useSelector(state => state.TaskTypeReducer);
    const { userLogin } = useSelector(state => state.UserLoginCyberBugsReducer);
    // console.log(userLogin);

    const { projectDetail } = useSelector(state => state.ProjectReducer)
    const [visibleEditor, setVisibleEditor] = useState(false);
    const [historyContent, setHistoryContent] = useState(taskDetailModal.description);
    const [content, setContent] = useState(taskDetailModal.description);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch({ type: GET_ALL_STATUS_SAGA });
        dispatch({ type: GET_ALL_PRIORITY_SAGA });
        dispatch({ type: GET_ALL_TASK_TYPE_SAGA });
    }, [])


    // console.log('taskDetailModal', taskDetailModal)


    const renderDescription = () => {
        const jsxDescription = ReactHtmlParser(taskDetailModal.description);
        return <div>
            {visibleEditor ? <div> <Editor
                name="description"
                initialValue={taskDetailModal.description}
                init={{
                    selector: 'textarea#myTextArea',
                    height: 500,
                    menubar: false,
                    plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                    ],
                    toolbar:
                        'undo redo | formatselect | bold italic backcolor | \
                            alignleft aligncenter alignright alignjustify | \
                            bullist numlist outdent indent | removeformat | help'
                }}
                onEditorChange={(content, editor) => {
                    setContent(content);
                }}
            />

                <button className="btn btn-primary m-2" onClick={() => {
                    dispatch({
                        type: HANDLE_CHANGE_POST_API_SAGA,
                        actionType: CHANGE_TASK_MODAL,
                        name: 'description',
                        value: content
                    })
                    setVisibleEditor(false);
                }}>Save</button>
                <button className="btn btn-primary m-2" onClick={() => {
                    dispatch({
                        type: HANDLE_CHANGE_POST_API_SAGA,
                        actionType: CHANGE_TASK_MODAL,
                        name: 'description',
                        value: historyContent
                    })

                    //    dispatch({
                    //         type: CHANGE_TASK_MODAL,
                    //         name: 'description',
                    //         value: historyContent
                    //     })
                    setVisibleEditor(false)
                }}>Close</button>
            </div> : <div onClick={() => {

                setHistoryContent(taskDetailModal.description);
                setVisibleEditor(!visibleEditor);

            }}>{jsxDescription}</div>}


        </div>
    }

    const handleChangeTaskInfo = (e) => {
        const { name, value } = e.target;


        dispatch({
            type: HANDLE_CHANGE_POST_API_SAGA,
            actionType: CHANGE_TASK_MODAL,
            name,
            value
        })

        // dispatch({
        //     type: CHANGE_TASK_MODAL,
        //     name,
        //     value
        // });


    }
    const renderTimeTracking = () => {

        const { timeTrackingSpent, timeTrackingRemaining } = taskDetailModal;

        const max = Number(timeTrackingSpent) + Number(timeTrackingRemaining);
        const percent = Math.round(Number(timeTrackingSpent) / max * 100)

        return <div>
            <div style={{ display: 'flex' }}>
                <i className="fa fa-clock" />
                <div style={{ width: '100%' }}>

                    <div className="progress">
                        <div className="progress-bar" role="progressbar" style={{ width: `${percent}%` }} aria-valuenow={Number(timeTrackingSpent)} aria-valuemin={Number(timeTrackingRemaining)} aria-valuemax={max} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <p className="logged">{Number(timeTrackingRemaining)}h logged</p>
                        <p className="estimate-time">{Number(timeTrackingRemaining)}h remaining</p>
                    </div>
                </div>


            </div>
            <div className="row">

                <div className="col-6">
                    <input className="form-control" name="timeTrackingSpent" onChange={handleChangeTaskInfo} />
                </div>
                <div className="col-6">
                    <input className="form-control" name="timeTrackingRemaining" onChange={handleChangeTaskInfo} />
                </div>
            </div>
        </div>
    }

    //COMMENT
    const commentRef = useRef(null);
    const commentEditRef = useRef(null)
    const [visibleEditComment, setVisibleEditComment] = useState(-1)

    const renderListComment = () => {
        return taskDetailModal.lstComment?.map((comment, index) => {
            // console.log('comment', comment);
            return <div className="lastest-comment" key={index}>
                <div className="comment-item">
                    <div className="display-comment" style={{ display: 'flex' }}>
                        <div className="avatar">
                            <img src={userLogin.avatar} alt='xyz' />
                        </div>
                        <div>
                            <p style={{ marginBottom: 5, fontWeight: 'bold' }}>{comment.name}</p>
                            {visibleEditComment === comment.id ? <Fragment>
                                <Editor
                                    name='comment'
                                    onInit={(evt, editor) => commentEditRef.current = editor}
                                    initialValue={comment.commentContent}
                                    init={{
                                        height: 120,
                                        menubar: false,
                                        plugins: [
                                            'advlist autolink lists link image charmap print preview anchor',
                                            'searchreplace visualblocks code fullscreen',
                                            'insertdatetime media table paste code help wordcount'
                                        ],
                                        toolbar: 'undo redo | formatselect | ' +
                                            'bold italic backcolor | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'removeformat | help',
                                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                                    }}
                                // onEditorChange={}
                                />
                                <div>
                                    <span style={{ color: '#929398', cursor: 'pointer' }} onClick={() => {
                                        dispatch({
                                            type: UPDATE_COMMENT_API,
                                            commentUpdate:{
                                                id: comment.id,
                                                contentComment:commentEditRef.current.getContent()
                                            },
                                            taskId: taskDetailModal.taskId
                                        })
                                        setVisibleEditComment(-1)
                                    }}>Post</span>
                                    •
                                    <span style={{ color: '#929398', cursor: 'pointer' }} onClick={() => {
                                        setVisibleEditComment(-1)
                                    }}>Cancel</span>
                                </div>
                            </Fragment> : <Fragment> <p style={{ marginBottom: 5 }}>{ReactHtmlParser(comment.commentContent)}</p>
                                <div>
                                    <span style={{ color: '#929398', cursor: 'pointer' }} onClick={() => {
                                        setVisibleEditComment(comment.id)
                                    }}>Edit</span>
                                    •
                                    <span style={{ color: '#929398', cursor: 'pointer' }} onClick={() => {
                                        dispatch({
                                            type: DELETE_COMMENT_API,
                                            idComment: comment.id,
                                            taskId: taskDetailModal.taskId
                                        })
                                    }}>Delete</span>
                                </div>
                            </Fragment>
                            }


                        </div>
                    </div>
                </div>
            </div>
        })
    }


    return (
        <div className="modal fade" id="infoModal" tabIndex={-1} role="dialog" aria-labelledby="infoModal" aria-hidden="true">
            <div className="modal-dialog modal-info">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="task-title">
                            <i className="fa fa-bookmark" />
                            <select name="typeId" value={taskDetailModal.typeId} onChange={handleChangeTaskInfo}>
                                {arrTaskType.map((tp, index) => {
                                    return <option key={index} value={tp.id}>{tp.taskType}</option>
                                })}
                            </select>

                            <span>{taskDetailModal.taskName}</span>
                        </div>
                        <div style={{ display: 'flex' }} className="task-click">
                            <div>
                                <i className="fab fa-telegram-plane" />
                                <span style={{ paddingRight: 20 }}>Give feedback</span>
                            </div>
                            <div>
                                <i className="fa fa-link" />
                                <span style={{ paddingRight: 20 }}>Copy link</span>
                            </div>
                            <i className="fa fa-trash-alt='xyz'" style={{ cursor: 'pointer' }} />
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                <span aria-hidden="true">×</span>
                            </button>
                        </div>
                    </div>
                    <div className="modal-body">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-8">
                                    <p className="issue">This is an issue of type: Task.</p>
                                    <div className="description">
                                        <p>Description</p>
                                        {renderDescription()}
                                    </div>
                                    <div className="comment">
                                        <h6>Comment</h6>
                                        <div className="block-comment" style={{ display: 'flex' }}>
                                            <div className="avatar">
                                                <img src={userLogin.avatar} alt='xyz' />
                                            </div>
                                            <div className="input-comment">
                                                <Editor
                                                    onInit={(evt, editor) => commentRef.current = editor}
                                                    name="comment"
                                                    initialValue='Add comment'
                                                    init={{
                                                        selector: 'textarea#myTextArea',
                                                        height: 200,
                                                        menubar: false,
                                                        plugins: [
                                                            'advlist autolink lists link image charmap print preview anchor',
                                                            'searchreplace visualblocks code fullscreen',
                                                            'insertdatetime media table paste code help wordcount'
                                                        ],
                                                        toolbar:
                                                            'undo redo | formatselect | bold italic backcolor | \
                                                            alignleft aligncenter alignright alignjustify | \
                                                            bullist numlist outdent indent | removeformat | help'
                                                    }}
                                                // onEditorChange={(content, editor) => {
                                                //     setContent(content);
                                                // }}
                                                />
                                                <button className='btn btn-primary' onClick={() => {
                                                    dispatch({
                                                        type: INSERT_COMMENT_API,
                                                        comment: {
                                                            taskId: taskDetailModal.taskId,
                                                            contentComment: commentRef.current.getContent()
                                                        }
                                                    })
                                                }}>Comment</button>
                                            </div>
                                        </div>
                                        {renderListComment()}
                                    </div>
                                </div>
                                <div className="col-4">
                                    <div className="status">
                                        <h6>STATUS</h6>
                                        <select name="statusId" className="custom-select" value={taskDetailModal.statusId} onChange={(e) => {

                                            handleChangeTaskInfo(e)

                                            // const action = {
                                            //     type:UPDATE_STATUS_TASK_SAGA,
                                            //     taskUpdateStatus: {
                                            //         taskId:taskDetailModal.taskId,
                                            //         statusId:e.target.value,
                                            //         projectId:taskDetailModal.projectId

                                            //     }
                                            // }

                                            // // // console.log('action',action);
                                            // console.log('taskupdatestatus',{
                                            //     taskId:taskDetailModal.taskId,
                                            //     statusId:e.target.value
                                            // })

                                            // dispatch(action)


                                        }}>
                                            {arrStatus.map((status, index) => {
                                                return <option value={status.statusId} key={index}>{status.statusName}</option>
                                            })}
                                        </select>
                                    </div>
                                    <div className="assignees">
                                        <h6>ASSIGNEES</h6>
                                        <div className="row">
                                            {
                                                taskDetailModal.assigness?.map((user, index) => {
                                                    return <div className="col-6  mt-2 mb-2" key={index}>
                                                        <div key={index} style={{ display: 'flex' }} className="item">


                                                            <div className="avatar">
                                                                <img src={user.avatar} alt={user.avatar} />
                                                            </div>
                                                            <p className="name mt-1 ml-1">
                                                                {user.name}
                                                                <i className="fa fa-times" style={{ marginLeft: 5, cursor: 'pointer' }} onClick={() => {

                                                                    dispatch({
                                                                        type: HANDLE_CHANGE_POST_API_SAGA,
                                                                        actionType: REMOVE_USER_ASSIGN,
                                                                        userId: user.id
                                                                    })

                                                                    // dispatch({
                                                                    //     type:REMOVE_USER_ASSIGN,
                                                                    //     userId:user.id
                                                                    // })
                                                                }} />
                                                            </p>
                                                        </div>
                                                    </div>
                                                })
                                            }

                                            <div className="col-6  mt-2 mb-2">

                                                <Select
                                                    options={projectDetail.members?.filter(mem => {
                                                        let index = taskDetailModal.assigness?.findIndex(us => us.id === mem.userId);
                                                        if (index !== -1) {
                                                            return false;
                                                        }
                                                        return true;
                                                    }).map((mem, index) => {
                                                        return { value: mem.userId, label: mem.name };
                                                    })}
                                                    optionFilterProp="label"
                                                    style={{ width: '100%' }}
                                                    name="lstUser"
                                                    value="+ Add more"
                                                    className="form-control"
                                                    onSelect={(value) => {
                                                        if (value == '0') {
                                                            return;
                                                        }
                                                        let userSelected = projectDetail.members.find(mem => mem.userId == value);
                                                        userSelected = { ...userSelected, id: userSelected.userId };

                                                        dispatch({
                                                            type: HANDLE_CHANGE_POST_API_SAGA,
                                                            actionType: CHANGE_ASSIGNESS,
                                                            userSelected
                                                        })

                                                        //dispatchReducer
                                                        // dispatch({
                                                        //     type: CHANGE_ASSIGNESS,
                                                        //     userSelected
                                                        // })
                                                    }}>


                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="reporter">
                                        <h6>REPORTER</h6>
                                        <div style={{ display: 'flex' }} className="item">
                                            <div className="avatar">
                                                <img src={require("../../../assets/img/download (1).jfif")} alt='xyz' />
                                            </div>
                                            <p className="name">
                                                Pickle Rick
                    <i className="fa fa-times" style={{ marginLeft: 5 }} />
                                            </p>
                                        </div>
                                    </div> */}
                                    <div className="priority" style={{ marginBottom: 20 }}>
                                        <h6>PRIORITY</h6>
                                        <select name="priorityId" className="form-control" value={taskDetailModal.priorityId} onChange={(e) => {
                                            handleChangeTaskInfo(e);
                                        }}>
                                            {arrPriority.map((item, index) => {
                                                return <option key={index} value={item.priorityId}>{item.priority}</option>
                                            })}


                                        </select>
                                    </div>
                                    <div className="estimate">
                                        <h6>ORIGINAL ESTIMATE (HOURS)</h6>
                                        <input name="originalEstimate" type="text" className="estimate-hours" value={taskDetailModal.originalEstimate} onChange={(e) => {
                                            handleChangeTaskInfo(e);
                                        }} />
                                    </div>
                                    <div className="time-tracking">
                                        <h6>TIME TRACKING</h6>
                                        {
                                            renderTimeTracking()
                                        }

                                    </div>
                                    <div style={{ color: '#929398' }}>Create at a month ago</div>
                                    <div style={{ color: '#929398' }}>Update at a few seconds ago</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
