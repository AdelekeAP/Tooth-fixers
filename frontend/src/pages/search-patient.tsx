import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Patient } from './create-patient';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const PatientDetails: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [updateForm, setUpdateForm] = useState<Partial<Patient>>({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:3000/patients');
        setPatients(response.data);
      } catch (error) {
        setError('Error fetching patients');
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdateForm({
      ...updateForm,
      [name]: value,
    });
  };

  const handleUpdatePatient = async (id: number | undefined) => {
    try {
      const response = await axios.patch(`http://localhost:3000/patients/${id}`, updateForm);
      console.log('Patient updated successfully:', response.data);

      setPatients(prevPatients =>
        prevPatients.map(patient =>
          patient.id === id ? { ...patient, ...response.data } : patient
        )
      );

      setSelectedPatient(null);
      setError(null);
      toast.success('Patient updated successfully');
    } catch (error) {
      console.error('Error updating patient:', error);
      setError('Error updating patient');
      toast.error('Error updating patient');
    }
  };

  const handleDeletePatient = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/patients/${id}`);
      console.log('Patient deleted successfully');
      setPatients(prevPatients => prevPatients.filter(patient => patient.id !== id));
      toast.success('Patient deleted successfully');
    } catch (error) {
      console.error('Error deleting patient:', error);
      setError('Error deleting patient');
      toast.error('Error deleting patient');
    }
  };

  const filteredPatients = patients.filter(patient =>
    `${patient.firstName} ${patient.surName} ${patient.middleName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen">{error}</div>;
  }

  return (
    <div className="flex flex-col h-screen w-screen">
      <ToastContainer />

      {/* Header */}
      <div className="bg-green-100 flex justify-between items-center p-6 text-black">
        <h2 className="font-sans font-bold text-4xl">Patient Details...</h2>
        <button
          onClick={() => navigate('/')}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Return to Homepage
        </button>
      </div>

      <div className="flex h-full">
        {/* Left Panel */}
        <div className="w-1/3 bg-green-100 flex flex-col items-center text-black p-10">
          <div className="text-center">
            <h2 className="font-sans font-bold text-3xl mb-6">Search Patient</h2>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name..."
              className="w-full pl-4 pr-2 py-2 border rounded-lg focus:outline-none focus:border-green-500"
            />
          </div>
        </div>

        {/* Right Panel */}
        <div className="w-2/3 bg-white flex flex-col items-center justify-center p-10 overflow-y-auto">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full">
            {filteredPatients.map((patient) => (
              <div key={patient.id} className="bg-white shadow-lg rounded-lg p-6 border border-green-200">
                <div className="mb-2">
                  <strong className="text-green-800">ID:</strong> {patient.id}
                </div>
                <div className="mb-2">
                  <strong className="text-green-800">First Name:</strong> {patient.firstName}
                </div>
                <div className="mb-2">
                  <strong className="text-green-800">Last Name:</strong> {patient.surName}
                </div>
                <div className="mb-2">
                  <strong className="text-green-800">Middle Name:</strong> {patient.middleName}
                </div>
                <div className="mb-2">
                  <strong className="text-green-800">Date of Birth:</strong> {new Date(patient.dateOfBirth).toLocaleDateString()}
                </div>
                <div className="mb-2">
                  <strong className="text-green-800">Address:</strong> {patient.homeAddress}
                </div>
                <div className="mb-2">
                  <strong className="text-green-800">Registration Date:</strong> {new Date(patient.dateOfRegistration).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => {
                      setSelectedPatient(patient);
                      setUpdateForm({
                        firstName: patient.firstName,
                        surName: patient.surName,
                        middleName: patient.middleName,
                        dateOfBirth: patient.dateOfBirth,
                        homeAddress: patient.homeAddress,
                        dateOfRegistration: patient.dateOfRegistration,
                      });
                    }}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => {
                      if (patient.id !== undefined) handleDeletePatient(patient.id);
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {selectedPatient && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-green-800">Update Patient</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (selectedPatient.id !== undefined) handleUpdatePatient(selectedPatient.id);
              }}
            >
              <div className="mb-4">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={updateForm.firstName || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="surName" className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  id="surName"
                  name="surName"
                  value={updateForm.surName || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="middleName" className="block text-sm font-medium text-gray-700">Middle Name</label>
                <input
                  type="text"
                  id="middleName"
                  name="middleName"
                  value={updateForm.middleName || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">Date of Birth</label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={updateForm.dateOfBirth ? new Date(updateForm.dateOfBirth).toISOString().substr(0, 10) : ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="homeAddress" className="block text-sm font-medium text-gray-700">Home Address</label>
                <input
                  type="text"
                  id="homeAddress"
                  name="homeAddress"
                  value={updateForm.homeAddress || ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="dateOfRegistration" className="block text-sm font-medium text-gray-700">Registration Date</label>
                <input
                  type="date"
                  id="dateOfRegistration"
                  name="dateOfRegistration"
                  value={updateForm.dateOfRegistration ? new Date(updateForm.dateOfRegistration).toISOString().substr(0, 10) : ''}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded-lg focus:outline-none focus:border-green-500"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedPatient(null)}
                  className="bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDetails;
