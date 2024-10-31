import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

Modal.setAppElement('#root'); // Set the root element for accessibility

interface ClinicalRecord {
  id: number;
  clinicDate: string; // Change to string to handle date inputs
  natureOfAilment: string;
  medicinePrescribed?: string;
  procedureUndertaken: string;
  dateOfNextAppointment?: string; // Change to string to handle date inputs
}

const SearchClinicalRecord: React.FC = () => {
  const [searchId, setSearchId] = useState('');
  const [records, setRecords] = useState<ClinicalRecord[]>([]);
  const [record, setRecord] = useState<ClinicalRecord | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Modal state
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [formData, setFormData] = useState<ClinicalRecord | null>(null);

  useEffect(() => {
    if (id) {
      setSearchId(id);
      fetchRecord(id);
    } else {
      fetchAllRecords();
    }
  }, [id]);

  const fetchRecord = async (recordId: string) => {
    try {
      const response = await axios.get(`http://localhost:3000/clinical-records/${recordId}`);
      setRecord(response.data);
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching clinical record:', error);
      setErrorMessage('Failed to fetch clinical record. Please try again.');
      setRecord(null);
    }
  };

  const fetchAllRecords = async () => {
    try {
      const response = await axios.get('http://localhost:3000/clinical-records');
      setRecords(response.data);
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching clinical records:', error);
      setErrorMessage('Failed to fetch clinical records. Please try again.');
    }
  };

  const handleDelete = async (recordId: number) => {
    try {
      await axios.delete(`http://localhost:3000/clinical-records/${recordId}`);
      setRecords(records.filter(record => record.id !== recordId));
      setErrorMessage('');
      toast.success('Record deleted successfully', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error('Error deleting clinical record:', error);
      setErrorMessage('Failed to delete clinical record. Please try again.');
    }
  };

  const handleUpdate = (record: ClinicalRecord) => {
    setFormData({ ...record });
    setModalIsOpen(true);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId) {
      fetchRecord(searchId);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevFormData => prevFormData ? { ...prevFormData, [name]: value } : null);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      try {
        const response = await axios.patch(`http://localhost:3000/clinical-records/${formData.id}`, formData);
        console.log('Clinical record updated successfully:', response.data);
        
        // Update the state with the new data
        setRecords(prevRecords =>
          prevRecords.map(record =>
            record.id === formData.id ? { ...record, ...response.data } : record
          )
        );

        // Close the modal and clear any previous errors if the update is successful
        setModalIsOpen(false);
        setErrorMessage('');
        toast.success('Record updated successfully', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } catch (error) {
        console.error('Error updating clinical record:', error);
        setErrorMessage('Failed to update clinical record. Please try again.');
      }
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <ToastContainer />
      {/* Left Panel */}
      <div className="w-1/3 bg-green-100 flex items-center justify-center text-black">
        <h2 className="font-sans font-bold text-center text-4xl p-10">
          Search Clinical Record...
        </h2>
      </div>

      {/* Right Panel */}
      <div className="w-2/3 bg-white flex items-center justify-center p-10">
        <form onSubmit={handleSearch} className="w-full max-w-lg bg-green-50 p-8 rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold mb-6 text-green-700">Search Clinical Record</h2>
          <div className="mb-4">
            <label className="block text-gray-700">Record ID:</label>
            <input
              type="text"
              className="w-full p-2 mt-2 border rounded-lg focus:outline-none focus:border-green-500"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Search
            </button>
            <Link to="/">
              <button
                type="button"
                className="bg-white text-green-500 border border-green-500 px-4 py-2 rounded hover:bg-green-100"
              >
                Go to Home Page
              </button>
            </Link>
          </div>
          {errorMessage && <p className="mt-4 text-red-700">{errorMessage}</p>}
        </form>
        {record && (
          <div className="mt-8 w-full max-w-lg bg-green-50 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-green-700">Clinical Record Details</h2>
            <div>
              <p>ID: {record.id}</p>
              <p>Clinic Date: {new Date(record.clinicDate).toDateString()}</p>
              <p>Ailment: {record.natureOfAilment}</p>
              <p>Medicine Prescribed: {record.medicinePrescribed || 'N/A'}</p>
              <p>Procedure Undertaken: {record.procedureUndertaken}</p>
              <p>Date of Next Appointment: {record.dateOfNextAppointment ? new Date(record.dateOfNextAppointment).toDateString() : 'N/A'}</p>
            </div>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => handleUpdate(record)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(record.id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </div>

      {/* List of Clinical Records */}
      <div className="p-10 w-full">
        <h2 className="text-3xl font-bold mb-6 text-green-700">Clinical Records</h2>
        <ul>
          {records.map(record => (
            <li key={record.id} className="border-b border-gray-300 py-4">
              <div className="flex justify-between items-center">
                <div>
                  <p>ID: {record.id}</p>
                  <p>Clinic Date: {new Date(record.clinicDate).toDateString()}</p>
                  <p>Ailment: {record.natureOfAilment}</p>
                  <p>Medicine Prescribed: {record.medicinePrescribed || 'N/A'}</p>
                  <p>Procedure Undertaken: {record.procedureUndertaken}</p>
                  <p>Date of Next Appointment: {record.dateOfNextAppointment ? new Date(record.dateOfNextAppointment).toDateString() : 'N/A'}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleUpdate(record)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Update Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75 z-50"
        overlayClassName="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-75 z-50"
      >
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h2 className="text-2xl font-bold mb-4">Update Clinical Record</h2>
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <label htmlFor="clinicDate" className="block text-sm font-medium text-gray-700">Clinic Date</label>
              <input
                type="date"
                id="clinicDate"
                name="clinicDate"
                value={formData?.clinicDate ? new Date(formData.clinicDate).toISOString().substr(0, 10) : ''}
                onChange={handleFormChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="natureOfAilment" className="block text-sm font-medium text-gray-700">Ailment</label>
              <input
                type="text"
                id="natureOfAilment"
                name="natureOfAilment"
                value={formData?.natureOfAilment || ''}
                onChange={handleFormChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="medicinePrescribed" className="block text-sm font-medium text-gray-700">Medicine Prescribed</label>
              <input
                type="text"
                id="medicinePrescribed"
                name="medicinePrescribed"
                value={formData?.medicinePrescribed || ''}
                onChange={handleFormChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="procedureUndertaken" className="block text-sm font-medium text-gray-700">Procedure Undertaken</label>
              <input
                type="text"
                id="procedureUndertaken"
                name="procedureUndertaken"
                value={formData?.procedureUndertaken || ''}
                onChange={handleFormChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="dateOfNextAppointment" className="block text-sm font-medium text-gray-700">Date of Next Appointment</label>
              <input
                type="date"
                id="dateOfNextAppointment"
                name="dateOfNextAppointment"
                value={formData?.dateOfNextAppointment ? new Date(formData.dateOfNextAppointment).toISOString().substr(0, 10) : ''}
                onChange={handleFormChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:border-green-500"
              />
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setModalIsOpen(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default SearchClinicalRecord;
