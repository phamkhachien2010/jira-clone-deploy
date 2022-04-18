import React, { useEffect, useState } from 'react'
import { Button, Input, Popconfirm, Table } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DELETE_USER_API, EDIT_USER, GET_ALL_USER_API } from '../../../redux/constants/Cyberbugs/Cyberbugs';
import { FormOutlined, DeleteOutlined } from '@ant-design/icons'
import FormEditUser from '../../../components/Forms/FormEditUser/FormEditUser';

const { Search } = Input;

export default function UserManager(props) {

  const { arrAllUser } = useSelector(state => state.UserLoginCyberBugsReducer)
  const dispatch = useDispatch()


  useEffect(() => {
    dispatch({
      type: 'GET_USER_API',
      keyWord: ''
    })

  }, [])


  const columns = [
    {
      title: 'id',
      dataIndex: 'userId',
      key: 'id',
      sorter: (item2, item1) => {
        return item2.userId - item1.userId;
      },
      sortDirections: ['descend'],

    },
    {
      title: 'email',
      dataIndex: 'email',
      key: 'email',

    },
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name',
      sorter: (item2, item1) => {
        let name1 = item1.name?.trim().toLowerCase();
        let name2 = item2.name?.trim().toLowerCase();
        if (name2 < name1) {
          return -1;
        }
        return 1;
      },

    },
    {
      title: 'phone',
      dataIndex: 'phoneNumber',
      key: 'phoneNumber',

    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'action',
      render: (text, record, index) => {
        // console.log('record', record.userId);
        return <div>
          <button className='btn btn-primary mr-2' onClick={() => {
            dispatch({
              type: 'OPEN_FORM_EDIT_USER',
              title: 'Edit User',
              Component: <FormEditUser />
            })

            dispatch({
              type: EDIT_USER,
              userEdit: record
            })



          }}>
            <FormOutlined style={{ fontSize: 17 }} />
          </button>

          <Popconfirm
            title="Are you sure to delete this project?"
            onConfirm={() => {
              dispatch({
                type: DELETE_USER_API,
                userId: record.userId
              })
            }}

            okText="Yes"
            cancelText="No"
          >
            <button className='btn btn-danger'>
              <DeleteOutlined style={{ fontSize: 17 }} />
            </button>
          </Popconfirm>
        </div>
      }
    }
  ];


  return (
    <div className='container-fluid m-5'>

      <h1>User Management</h1>

      {/* <Input placeholder="Search user" className='mb-3' allowClear /> */}

      <Search placeholder="input search text" onChange={(e) => {
        const value = e.target.value
        setTimeout(() => {
          dispatch({
            type: 'GET_USER_API',
            keyWord: value
          })
        }, 300)
      }}
        enterButton />

      <Table columns={columns} dataSource={arrAllUser} />
    </div>
  )
}
