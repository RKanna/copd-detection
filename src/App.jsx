import React, { useState, useEffect } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBF5b7YimfHhbcl2jHlT3P7TpRDU4nxMbE",
  authDomain: "copd-61c11.firebaseapp.com",
  projectId: "copd-61c11",
  storageBucket: "copd-61c11.appspot.com",
  messagingSenderId: "301350173161",
  appId: "1:301350173161:web:418cb989c222ed29a3f378",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const App = () => {
  // const [patientName, setPatientName] = useState("");
  // const [age, setAge] = useState("");
  // const [isSmoking, setIsSmoking] = useState(false);
  // const [smokingYears, setSmokingYears] = useState("");
  // const [cigarettesPerDay, setCigarettesPerDay] = useState("");
  // const [copdRisk, setCopdRisk] = useState("");
  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    isSmoking: false,
    smokingYears: "",
    cigarettesPerDay: "",
    copdRisk: "",
  });
  const [records, setRecords] = useState([]);
  const [showRecords, setShowRecords] = useState(false);

  useEffect(() => {
    const fetchRecords = async () => {
      const snapshot = await db.collection("patients").get();
      const recordsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRecords(recordsData);
    };

    fetchRecords();
  }, []);

  const calculateCOPDSeverity = (risk) => {
    if (risk >= 0.8) return "Very Severe";
    else if (risk >= 0.5) return "Severe";
    else if (risk >= 0.3) return "Intermediate";
    else return "Low";
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const { patientName, age, isSmoking, smokingYears, cigarettesPerDay } =
      formData;

    if (
      !patientName ||
      !age ||
      (isSmoking && (!smokingYears || !cigarettesPerDay))
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    let risk = "No";

    if (isSmoking) {
      const years = parseInt(smokingYears, 10);
      const cigarettes = parseInt(cigarettesPerDay, 10);
      risk = ((years * cigarettes) / age).toFixed(2);
    }

    await db.collection("patients").add({
      patientName,
      age: parseInt(age, 10),
      isSmoking,
      smokingYears: parseInt(smokingYears, 10),
      cigarettesPerDay: parseInt(cigarettesPerDay, 10),
      copdRisk: risk,
    });
    setFormData({ ...formData, copdRisk: risk });
    // setCopdRisk(risk);
  };

  const handleViewRecords = () => {
    setShowRecords(true);
  };

  const handleClearForm = () => {
    // setPatientName("");
    // setAge("");
    // setIsSmoking(false);
    // setSmokingYears("");
    // setCigarettesPerDay("");
    // setCopdRisk("");

    setFormData({
      patientName: "",
      age: "",
      isSmoking: false,
      smokingYears: "",
      cigarettesPerDay: "",
      copdRisk: "",
    });
  };

  return (
    <section>
      <div className="max-w-md p-6 mx-auto mt-10 bg-gray-100 rounded-lg shadow-xl">
        <h2 className="mb-4 text-2xl font-bold">Patient Information Form</h2>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Patient Name:</label>
            <input
              className="block w-full px-4 py-2 border rounded-md"
              type="text"
              // value={patientName}
              // onChange={(e) => setPatientName(e.target.value)}
              value={formData.patientName}
              onChange={(e) =>
                setFormData({ ...formData, patientName: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Age:</label>
            <input
              className="block w-full px-4 py-2 border rounded-md"
              type="number"
              // value={age}
              // onChange={(e) => setAge(e.target.value)}
              value={formData.age}
              onChange={(e) =>
                setFormData({ ...formData, age: e.target.value })
              }
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Is Smoking:</label>
            <input
              type="radio"
              // checked={isSmoking}
              // onChange={() => setIsSmoking(true)}
              checked={formData.isSmoking}
              onChange={() => setFormData({ ...formData, isSmoking: true })}
              className="mr-2"
            />
            Yes
            <input
              type="radio"
              // checked={!isSmoking}
              // onChange={() => setIsSmoking(false)}
              checked={!formData.isSmoking}
              onChange={() => setFormData({ ...formData, isSmoking: false })}
              className="ml-4 mr-2"
            />
            No
          </div>
          {formData.isSmoking && (
            <>
              <div className="mb-4">
                <label className="block mb-2">Smoking Years:</label>
                <input
                  className="block w-full px-4 py-2 border rounded-md"
                  type="number"
                  value={formData.smokingYears}
                  // onChange={(e) => setSmokingYears(e.target.value)}
                  onChange={(e) =>
                    setFormData({ ...formData, smokingYears: e.target.value })
                  }
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2">Cigarettes Per Day:</label>
                <input
                  className="block w-full px-4 py-2 border rounded-md"
                  type="number"
                  value={formData.cigarettesPerDay}
                  // onChange={(e) => setCigarettesPerDay(e.target.value)}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cigarettesPerDay: e.target.value,
                    })
                  }
                />
              </div>
            </>
          )}
          <div className="flex gap-4">
            <button
              type="submit"
              className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
            >
              Submit
            </button>
            <button
              type="button"
              className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
              onClick={handleClearForm}
            >
              Clear
            </button>
          </div>
        </form>
        {/* {copdRisk && (
          <p className="mt-4">
            COPD Risk: {copdRisk} - Severity:{" "}
            {calculateCOPDSeverity(parseFloat(copdRisk))}
          </p>
        )} */}
        {formData.copdRisk && (
          <p className="mt-4">
            COPD Risk: {formData.copdRisk} - Severity:{" "}
            {calculateCOPDSeverity(parseFloat(formData.copdRisk))}
          </p>
        )}
      </div>
      <div className="flex justify-center mt-4">
        <button
          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          onClick={handleViewRecords}
        >
          View Earlier Records
        </button>
      </div>
      {/* {showRecords && (
        <div className="mt-4">
          <h3 className="mb-2 text-xl font-bold">Earlier Records:</h3>
          <ul>
            {records.map((record) => (
              <li key={record.id}>
                {record.patientName} - Age: {record.age} - Smoking:{" "}
                {record.isSmoking ? "Yes" : "No"} - COPD Risk: {record.copdRisk}{" "}
                - Severity: {calculateCOPDSeverity(parseFloat(record.copdRisk))}
              </li>
            ))} */}
      {showRecords && (
        <div className="mt-4">
          <ul className="divide-y divide-gray-200">
            {showRecords && (
              <div className="mt-4">
                <h3 className="mb-2 text-xl font-bold text-center">
                  Earlier Records:
                </h3>
                <div className="flex justify-center">
                  <div className="w-full max-w-lg overflow-x-auto">
                    <table className="w-full border border-collapse border-gray-800 table-auto">
                      <thead className="bg-gray-200">
                        <tr>
                          <th className="px-4 py-2 border border-gray-800">
                            Name
                          </th>
                          <th className="px-4 py-2 border border-gray-800">
                            Age
                          </th>
                          <th className="px-4 py-2 border border-gray-800">
                            Smoking
                          </th>
                          <th className="px-4 py-2 border border-gray-800">
                            COPD Risk
                          </th>
                          <th className="px-4 py-2 border border-gray-800">
                            Severity
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {records.map((record) => (
                          <tr key={record.id} className="text-center">
                            <td className="px-4 py-2 border border-gray-800">
                              {record.patientName}
                            </td>
                            <td className="px-4 py-2 border border-gray-800">
                              {record.age}
                            </td>
                            <td className="px-4 py-2 border border-gray-800">
                              {record.isSmoking ? "Yes" : "No"}
                            </td>
                            <td className="px-4 py-2 border border-gray-800">
                              {record.copdRisk}
                            </td>
                            <td className="px-4 py-2 border border-gray-800">
                              {calculateCOPDSeverity(
                                parseFloat(record.copdRisk)
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </ul>
        </div>
      )}
    </section>
  );
};

export default App;
