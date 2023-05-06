import facultyServices from "@/utils/api/services/faculties";
import { useState } from "react";

export default function CsvReader() {
  const [csvFile, setCsvFile] = useState<any>();
  const [csvArray, setCsvArray] = useState([]);

  const processCSV = (str: any, delim = ",") => {
    const headers = str.slice(0, str.indexOf("\n")).split(delim);
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");

    const newArray = rows.map((row: any) => {
      const values = row.split(delim);
      const eachObject = headers.reduce((obj: any, header: any, i: any) => {
        obj[header] = values[i];
        return obj;
      }, {});
      return eachObject;
    });
    setCsvArray(newArray);
    addingFaculty(newArray);
  };

  const submit = () => {
    const file = csvFile;
    const reader = new FileReader();

    reader.onload = function (e: any) {
      const text = e.target.result;
      console.log(text);
      processCSV(text);
    };

    reader.readAsText(file);
  };

  return (
    <form id="csv-form">
      <input
        placeholder="UPload"
        type="file"
        accept=".csv"
        id="csvFile"
        onChange={(e: any) => {
          setCsvFile(e.target.files[0]);
        }}
      ></input>
      <br />
      <button
        onClick={(e) => {
          e.preventDefault();
          if (csvFile) submit();
        }}
      >
        Submit
      </button>
      <br />
      <br />
      {csvArray.length > 0 ? (
        <>
          <table>
            <thead>
              <th>Name</th>
              <th>Email</th>
              <th>Branch ID</th>
              <th>Designation</th>
              <th>Faculty Type</th>
            </thead>
            <tbody>
              {csvArray.map((item: any, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.branchID}</td>
                  <td>{item.designation}</td>
                  <td>{item.facultyType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}
    </form>
  );
}

function removePrefix(name: string): string {
  const prefixes = [
    "MR.",
    "MS.",
    "Dr.",
    "Dr",
    "DR.",
    "PROF.",
    "MRS.",
    "Miss",
    "MR",
    "MS",
  ];
  let newName = name.trim();

  prefixes.forEach((prefix) => {
    if (newName.toUpperCase().startsWith(prefix.toUpperCase())) {
      newName = newName.substring(prefix.length).trim();
    }
  });

  return newName;
}

function getBranchID(branchName: string): string {
  const branchMap: Record<string, string> = {
    "Computer Engineering": "CS",
    "Electronic & Telecommunication": "ETC",
    "Information Technology": "IT",
    "Civil Engineering": "CIV",
    Civil: "CIV",
    "Electronics & Telecommunication": "ETC",
    "Applied Science": "AS",
    "Electronics & Instrumentation": "EI",
    "Elec. & Instru.": "EI",
    "Mechanical Engineering": "ME",
  };

  return branchMap[branchName.trim()] || "";
}

function addingFaculty(newArray: Array<any>) {
  async function addFaculty(data: any) {
    const res = await facultyServices.addNewFacultyMultiple(data);
    console.log(res);
  }

  const facultyList = newArray.map((item: any) => {
    const cleanName = removePrefix(item.name);
    const branchID = getBranchID(item.branch);
    return {
      name: cleanName,
      email: item.email,
      branchID: branchID,
      designation: item.designation,
      facultyType: "Regular",
    };
  });

  console.log(facultyList);
  addFaculty(facultyList);
}
