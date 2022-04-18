import React from 'react'
import { Button, Input } from 'antd';
import { UserOutlined, LockOutlined, PhoneOutlined, TwitterOutlined, GooglePlusOutlined } from '@ant-design/icons';
import { withFormik, Formik } from 'formik'
import * as Yup from 'yup';
import { connect } from 'react-redux';
import { SIGN_UP_USER_API, USER_SIGNIN_API } from '../../../redux/constants/Cyberbugs/Cyberbugs';
import { singinCyberbugAction } from '../../../redux/actions/CyberBugsActions';
function signUp(props) {



  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
  } = props;

  return (
    <form onSubmit={handleSubmit} className="container" style={{ height: window.innerHeight }} >
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: window.innerHeight }} >
        <h2 className="text-center" style={{ fontSize: 35 }}>Sign Up</h2>
        <div className="d-flex mt-3" >
          <Input onChange={handleChange} style={{ width: '100%', minWidth: 300 }} name="email" size="large" placeholder="Email" prefix={<GooglePlusOutlined />} />
        </div>
        <div className="text-danger">{errors.email}</div>
        <div className="d-flex mt-3">
          <Input onChange={handleChange} style={{ width: '100%', minWidth: 300 }} type="password" name="password" size="large" placeholder="Password" prefix={<LockOutlined />} />
        </div>
        <div className="text-danger">{errors.password}</div>
        <div className="d-flex mt-3">
          <Input onChange={handleChange} style={{ width: '100%', minWidth: 300 }} type="text" name="phoneNumber" size="large" placeholder="Phone Number" prefix={<PhoneOutlined />} />
        </div>
        <div className="text-danger">{errors.phoneNumber}</div>
        <div className="d-flex mt-3">
          <Input onChange={handleChange} style={{ width: '100%', minWidth: 300 }} type="text" name="name" size="large" placeholder="Name" prefix={<UserOutlined />} />
        </div>
        <div className="text-danger">{errors.name}</div>

        <Button htmlType="submit" size="large" style={{ minWidth: 300, backgroundColor: 'rgb(102,117,223)', color: '#fff' }} className="mt-5">Sign Up</Button>


        <div className="social mt-3 d-flex">
          <Button style={{ backgroundColor: 'rgb(102,117,223)' }} shape="circle" size={"large"}>
            <span className="font-weight-bold" ><i className="fab fa-facebook-f"></i></span>
          </Button>
          <Button type="primary ml-3" shape="circle" icon={<TwitterOutlined />} size={"large"}>

          </Button>
        </div>
      </div>

    </form>
  )
}

const SignUpWithFormik = withFormik({
  mapPropsToValues: () => ({
    email: '',
    password: '',
    phoneNumber:'',
    name:''
  }),
  validationSchema: Yup.object().shape({
    email: Yup.string().required('Email is required!').email('email is invalid!'),
    password: Yup.string().required('PassWord is required!').min(6, 'password must have min 6 characters').max(32, 'password  have max 32 characters'),
    phoneNumber: Yup.number().min(6).required('PhoneNumber is requied!'),
    name: Yup.string().required('Name is requied!')

  }),
  handleSubmit: (values, { props, setSubmitting }) => {
    const{email, password, phoneNumber, name} = values;
    props.dispatch({
      type: SIGN_UP_USER_API,
      userSignUp:{
        email, password, phoneNumber, name
      }
    })

  },
  displayName: 'signUp',
})(signUp);




export default connect()(SignUpWithFormik);