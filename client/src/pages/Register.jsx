import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { registerUser } from '../redux/action';
const Register = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailError, setEmailError] = useState("")
    const [passwordError, setPasswordError] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading, error } = useSelector(state => state.auth)

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
        const ok = await dispatch(registerUser({ name, email, password }))
        if (ok) {
            navigate('/')
        }
    }
    return (
        <>
            <div className="container my-3 py-3">
                <h1 className="text-center">Register</h1>
                <hr />
                <div className="row my-4 h-100">
                    <div className="col-md-4 col-lg-4 col-sm-8 mx-auto">
                        <form onSubmit={onSubmit}>
                            <div className="form my-3">
                                <label htmlFor="regName">Full Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="regName"
                                    placeholder="Enter Your Name"
                                    value={name}
                                    onChange={(e)=>setName(e.target.value)}
                                    
                                />
                            </div>
                            <div className="form my-3">
                                <label htmlFor="regEmail">Email address</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="regEmail"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e)=>setEmail(e.target.value)}
                                    required
                                />
                                {emailError && <small className="text-danger">{emailError}</small>}
                            </div>
                            <div className="form  my-3">
                                <label htmlFor="regPassword">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="regPassword"
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
                                <p>Already has an account? <Link to="/login" className="text-decoration-underline text-info">Login</Link> </p>
                            </div>
                            <div className="text-center">
                                <button className="my-2 mx-auto btn btn-dark" type="submit" disabled={loading}>
                                    Register
                                </button>
                                {error && <div className="mt-2 text-danger">{error}</div>}
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register