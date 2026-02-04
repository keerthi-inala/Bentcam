import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { loginUser } from "../redux/action";

const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error, currentUser } = useSelector(state => state.auth)

  // If already logged in as admin, skip login screen
  useEffect(() => {
    const role = typeof currentUser?.role === 'string' ? currentUser.role.trim().toLowerCase() : ''
    if (role === 'admin') {
      navigate('/admin', { replace: true })
    }
  }, [currentUser, navigate])

  const validateEmail = (val) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(val)
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const isEmailValid = validateEmail(email)
    const isPasswordValid = password.length >= 6
    setEmailError(isEmailValid ? "" : "Enter a valid email")
    setPasswordError(isPasswordValid ? "" : "Password must be at least 6 characters")
    if (!isEmailValid || !isPasswordValid) return
    const result = await dispatch(loginUser({ email, password }))
    if (result && result.user) {
      const role = typeof result.user.role === 'string' ? result.user.role.trim().toLowerCase() : ''
      if (role === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    }
  }
  return (
    <>
      <div className="container my-3 py-3">
        <h1 className="text-center">Login</h1>
        <hr />
        <div className="row my-4 h-100">
          <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
            <form onSubmit={onSubmit}>
              <div className="my-3">
                <label htmlFor="loginEmail">Email address</label>
                <input
                  type="email"
                  className="form-control"
                  id="loginEmail"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e)=>setEmail(e.target.value)}
                  required
                />
                {emailError && <small className="text-danger">{emailError}</small>}
              </div>
              <div className="my-3">
                <label htmlFor="loginPassword">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="loginPassword"
                  placeholder="Password"
                  value={password}
                  onChange={(e)=>setPassword(e.target.value)}
                  minLength={6}
                  required
                />
                <small className="text-muted">Minimum 6 characters</small>
                {passwordError && <small className="text-danger d-block">{passwordError}</small>}
              </div>
              <div className="my-3">
                <p>New Here? <Link to="/register" className="text-decoration-underline text-info">Register</Link> </p>
              </div>
              <div className="text-center">
                <button className="my-2 mx-auto btn btn-dark" type="submit" disabled={loading}>
                  Login
                </button>
                {error && <div className="mt-2 text-danger">{error}</div>}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
