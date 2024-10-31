import React, { useState } from 'react';
import axios from 'axios'; 
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export interface Patient {
    id?: number;
    firstName: string;
    surName: string;
    middleName: string;
    dateOfBirth: Date;
    homeAddress: string;
    dateOfRegistration: Date;
}

const CreatePatient: React.FC = () => {
    const [state, setState] = useState<Patient>({
        firstName: '',
        surName: '',
        middleName: '',
        dateOfBirth: new Date(),
        homeAddress: '',
        dateOfRegistration: new Date(),
    });

    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); 
        
        const newPatient: Patient = {
            firstName: state.firstName,
            surName: state.surName,
            middleName: state.middleName,
            dateOfBirth: state.dateOfBirth || new Date(), 
            homeAddress: state.homeAddress,
            dateOfRegistration: state.dateOfRegistration|| new Date(), 
        };

        try {
            console.log(newPatient)
            const response = await axios.post('http://localhost:3000/patients/create', newPatient);
            const createdPatient = response.data;
            toast.success(`Patient ${createdPatient.firstName} ${createdPatient.surName} has been successfully created`, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } catch (error) {
            console.error('Error creating patient:', error);
            setErrorMessage('Failed to create patient. Please try again.');
            toast.error('Failed to create patient. Please try again.', {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    return (
        <div className="flex h-screen w-screen">
            <ToastContainer />
            <div className="w-1/3 bg-green-100 flex items-center justify-center text-black">
                <h2 className="font-sans font-bold text-center text-4xl p-10">
                    Creating Patient...
                </h2>
            </div>
            
            <div className="w-2/3 bg-white flex items-center justify-center p-10">
                <form onSubmit={handleSubmit} className="w-full max-w-lg bg-green-50 p-8 rounded-lg shadow-lg">
                    <h2 className="text-3xl font-bold mb-6 text-green-700">Create Patient</h2>
                    <div className="mb-4">
                        <label className="block text-gray-700">First Name:</label>
                        <input
                            type="text"
                            value={state.firstName}
                            onChange={(e) => setState({ ...state, firstName: e.target.value })}
                            className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:border-green-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Last Name:</label>
                        <input
                            type="text"
                            value={state.surName}
                            onChange={(e) => setState({ ...state, surName: e.target.value })}
                            className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:border-green-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Middle Name:</label>
                        <input
                            type="text"
                            value={state.middleName}
                            onChange={(e) => setState({ ...state, middleName: e.target.value })}
                            className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:border-green-500"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Date of Birth:</label>
                        <input
                            type="date"
                            value={state.dateOfBirth ? state.dateOfBirth.toISOString().substr(0, 10) : ''}
                            onChange={(e) => setState({ ...state, dateOfBirth: new Date(e.target.value) })}
                            className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:border-green-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Home Address:</label>
                        <input
                            type="text"
                            value={state.homeAddress}
                            onChange={(e) => setState({ ...state, homeAddress: e.target.value })}
                            className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:border-green-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700">Registration Date:</label>
                        <input
                            type="date"
                            value={state.dateOfRegistration ? state.dateOfRegistration.toISOString().substr(0, 10) : ''}
                            onChange={(e) => setState({ ...state, dateOfRegistration: new Date(e.target.value) })}
                            className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:border-green-500"
                            required
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                            Create Patient
                        </button>
                        <Link to="/">
                            <button type="button" className="bg-white text-green-500 border border-green-500 px-4 py-2 rounded hover:bg-green-100">
                                Go to Home Page
                            </button>
                        </Link>
                    </div>
                    {errorMessage && <p className="mt-4 text-red-700">{errorMessage}</p>}
                </form>
            </div>
        </div>
    );
};

export default CreatePatient;
