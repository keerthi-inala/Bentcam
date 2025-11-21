import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../redux/action';
const Register = () => {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const onSubmit = (e) => {
        e.preventDefault()
        if (!name || !email || !password) return
        dispatch(registerUser({ name, email, password }))
        navigate('/')
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
                                    required
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
                                    required
                                />
                            </div>
                            <div className="my-3">
                                <p>Already has an account? <Link to="/login" className="text-decoration-underline text-info">Login</Link> </p>
                            </div>
                            <div className="text-center">
                                <button className="my-2 mx-auto btn btn-dark" type="submit">
                                    Register
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Register