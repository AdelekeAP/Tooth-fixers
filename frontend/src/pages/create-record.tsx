import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

interface ClinicalRecord {
  clinicDate: Date;
  natureOfAilment: string;
  medicinePrescribed?: string;
  procedureUndertaken: string;
  dateOfNextAppointment?: Date;
  patientId?: null;
}

const CreateClinicalRecord: React.FC = () => {
  const [state, setState] = useState<ClinicalRecord>({
    clinicDate: new Date(),
    natureOfAilment: '',
    medicinePrescribed: '',
    procedureUndertaken: '',
    dateOfNextAppointment: new Date(),
    patientId: null
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const newClinicalRecord= {
      clinicDate: state.clinicDate || new Date(),
      natureOfAilment: state.natureOfAilment,
      medicinePrescribed: state.medicinePrescribed,
      procedureUndertaken: state.procedureUndertaken,
      dateOfNextAppointment: state.dateOfNextAppointment || new Date(),
      patientId : null
    };

    try {
      console.log(newClinicalRecord)
      const response = await axios.post('http://localhost:3000/clinical-records/create', newClinicalRecord);
      const createdRecord = response.data;
      setSuccessMessage(`Clinical record created on ${createdRecord.clinicDate}`);
      // Clear form after successful submission
      setState({
        clinicDate: new Date(),
        natureOfAilment: '',
        medicinePrescribed: '',
        procedureUndertaken: '',
        dateOfNextAppointment: new Date()
      });
    } catch (error) {
      console.error('Error creating clinical record:', error);
      setErrorMessage('Failed to create clinical record. Please try again.');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Panel - Placeholder */}
      <div className="w-1/3 bg-green-100 flex items-center justify-center text-black">
        <h2 className="font-sans font-bold text-center text-4xl p-10">
          Creating Clinical Record...
        </h2>
      </div>
      
      {/* Right Panel - Form */}
      <div className="w-2/3 bg-white flex items-center justify-center p-10">
        <form onSubmit={handleSubmit} className="w-full max-w-lg bg-green-50 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-green-700">Create Clinical Record</h2>

          {/* Clinic Date input */}
          <div className="mb-4">
            <label className="block text-gray-700">Clinic Date:</label>
            <input
              type="date"
              className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:border-green-500"
              value={state.clinicDate ? state.clinicDate.toISOString().substr(0,10) : ''}
              onChange={(e) => setState({...state, clinicDate: new Date(e.target.value)})}
              required
            />
          </div>

          {/* Ailment input */}
          <div className="mb-4">
            <label className="block text-gray-700">Ailment:</label>
            <input
              type="text"
              className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:border-green-500"
              value={state.natureOfAilment}
              onChange={(e) => setState({...state, natureOfAilment: e.target.value})}
              required
            />
          </div>

          {/* Medicine Prescribed input */}
          <div className="mb-4">
            <label className="block text-gray-700">Medicine Prescribed:</label>
            <input
              type="text"
              className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:border-green-500"
              value={state.medicinePrescribed || ''}
              onChange={(e) => setState({...state, medicinePrescribed: e.target.value})}
            />
          </div>

          {/* Procedure Undertaken input */}
          <div className="mb-4">
            <label className="block text-gray-700">Procedure Undertaken:</label>
            <textarea
              className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:border-green-500"
              value={state.procedureUndertaken}
              onChange={(e) => setState({...state, procedureUndertaken: e.target.value})}
              required
            />
          </div>

          {/* Date of Next Appointment input */}
          <div className="mb-4">
            <label className="block text-gray-700">Date of Next Appointment:</label>
            <input
              type="date"
              className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:border-green-500"
              value={state.dateOfNextAppointment ? state.dateOfNextAppointment.toISOString().substr(0,10) : ''}
              onChange={(e) => setState({...state, dateOfNextAppointment: new Date(e.target.value)})}
            />
          </div>

          {/* Submit button */}
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Create Clinical Record
            </button>
            <Link to="/">
              <button
                className="bg-white text-green-500 border border-green-500 px-4 py-2 rounded hover:bg-green-100"
              >
                Go to Homepage
              </button>
            </Link>
          </div>

          {/* Success and Error Messages */}
          {successMessage && <p className="mt-4 text-green-700">{successMessage}</p>}
          {errorMessage && <p className="mt-4 text-red-700">{errorMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreateClinicalRecord;
