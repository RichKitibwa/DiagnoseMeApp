import React, {useState} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import { USER_ROLE, USER_STATUS } from '../utils/Constants';

const VerifyOTP = ({ handleLogin }) => {
    const [otp, setOTP] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const userId = location.state.userId;
    const role = location.state.role;

    const [isLoading, setIsLoading] = useState(false);

    const handleOTPVerification = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            console.log("Verifying with:", { userId, otp, role }); 
            const response = await axios.post('/auth/verify-otp', {user_id: userId, otp, role});

            console.log("Verify OTP response:", response.data);

            const userStatus = response.data.status;
            const message = response.data.message;
            const token = response.data.token;

            console.log('role', role);
            console.log('user status: ', userStatus);

            localStorage.setItem('role', role);

            if (role === USER_ROLE.DOCTOR && userStatus === USER_STATUS.ACTIVE) { 
                handleLogin(role, token);
                navigate('/doctor');
            
            } else if (role === USER_ROLE.PATIENT && userStatus === USER_STATUS.ACTIVE) {
                handleLogin(role, token);
                navigate('/patient');
            }
        } catch(error) {
            console.log("role", role);
            setError('Invalid OTP');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-4">
                    <div className="text-center">
                        <h3>Verify OTP</h3>
                    </div> 
                    <div className="card">
                           
                        <div className="card-body">
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="otp" className="form-label">Enter OTP sent to your Email</label>
                                    <input
                                        type='text'
                                        className="form-control"
                                        id="otp"
                                        placeholder='OTP'
                                        value={otp}
                                        onChange={(e) => setOTP(e.target.value)}
                                    />
                                </div>    
                                <button type="button" className="btn btn-primary w-100" disabled={isLoading}onClick={handleOTPVerification}>
                                    {isLoading ? 'Verifying OTP...' : 'Verify OTP'}
                                </button>
                                {error && <div className='error'>{error}</div>}
                            </form>
                        </div>
                    </div> 
                </div>
            </div>                   
        </div>
    );
};

export default VerifyOTP;
