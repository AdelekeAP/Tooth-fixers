import React from 'react';
import { Link } from 'react-router-dom';

const Homepage: React.FC = () => {
    return (
        <div className="flex flex-col h-screen w-screen bg-white">
            <header className="bg-green-600 text-white shadow-lg">
                <div className="container mx-auto flex justify-between items-center py-4 px-6">
                    <div className="flex items-center space-x-4">
                        <img src={"./logo.png"} alt="Logo" className="h-10 w-10" />
                        <h1 className="text-2xl font-bold">ToothFixers</h1>
                    </div>
                </div>
            </header>

            <main className="flex-grow flex justify-center items-center">
                <div className="text-center space-y-8 p-8 rounded-lg shadow-lg bg-green-50">
                    <h1 className="text-5xl font-bold text-green-700">Welcome to ToothFixers</h1>
                    <p className="text-xl font-medium text-green-600">Bringing Smiles to Life</p>
                    <div className="space-y-4">
                        <Link to="/patients/create" className="block w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300">
                            Create Patient
                        </Link>
                        <Link to="/clinical-records/create" className="block w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300">
                            Create Clinic Record
                        </Link>
                        <Link to="/patients" className="block w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300">
                            Patient Management
                        </Link>
                        <Link to="/clinical-records" className="block w-full py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition duration-300">
                            Clinical Records Management
                        </Link>
                    </div>
                </div>
            </main>

            <footer className="bg-green-600 text-white py-4 text-center">
                <p>&copy; 2024 ToothFixers. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Homepage;



