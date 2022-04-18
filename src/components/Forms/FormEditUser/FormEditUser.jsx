import React, { useEffect } from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import { withFormik } from 'formik'
import * as Yup from 'yup'
import { EDIT_USER_API, GET_ALL_USER_API } from '../../../redux/constants/Cyberbugs/Cyberbugs'

function FormEditUser(props) {

  const dispatch = useDispatch()

  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    setFieldValue
  } = props;


  useEffect(() => {

    dispatch({
      type: GET_ALL_USER_API
    })

    dispatch({
      type: 'SET_SUBMIT_EDIT_USER',
      submitFunction: handleSubmit
    });

  }, [])


  return (
    <div className='container'>
      <form onSubmit={handleSubmit}>

        <div className='form-group'>
          <p>User id</p>
          <input value={values.userId} disabled type="text" name="userId" className='form-control' />
        </div>

        <div className='form-group'>
          <p>Email</p>
          <input value={values.email} onChange={handleChange} type="email" name="email" className='form-control' />
        </div>

        <div className='form-group'>
          <p>Name</p>
          <input value={values.name} onChange={handleChange} type="text" name="name" className='form-control' />
        </div>

        <div className='form-group'>
          <p>password</p>
          <input value={values.passWord} onChange={handleChange} type="password" name="passWord" className='form-control' />
        </div>

        <div className='form-group'>
          <p>Phone Number</p>
          <input value={values.phoneNumber} onChange={handleChange} type="text" name="phoneNumber" className='form-control' />
        </div>

      </form>
    </div>
  )
}

const FormEditUserWithFormik = withFormik({
  enableReinitialize: true,
  mapPropsToValues: (props) => {
    const { userEdit } = props
    return {
      userId: userEdit?.userId,
      email: userEdit?.email,
      name: userEdit?.name,
      phoneNumber: userEdit?.phoneNumber,
      passWord: ''
    }

  },
  validationSchema: Yup.object().shape({


  }),
  handleSubmit: (values, { props, setSubmitting }) => {
    const id = values.userId;
    const { passWord, email, name, phoneNumber } = values

    props.dispatch({
      type: EDIT_USER_API,
      userEdit: {
        id, passWord, email, name, phoneNumber
      }
    })

  },
  displayName: 'EditProjectForm',
})(FormEditUser);

const mapStateToProps = (state) => ({

  userEdit: state.UserLoginCyberBugsReducer.userEdit

})



export default connect(mapStateToProps)(FormEditUserWithFormik);