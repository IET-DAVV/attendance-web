import { constantsServices, studentServices } from "@/utils/api/services";
import { useState } from "react";

export default function CsvReader() {
  const [csvFile, setCsvFile] = useState<any>();
  const [csvArray, setCsvArray] = useState([]);
  // [{name: "", age: 0, rank: ""},{name: "", age: 0, rank: ""}]

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
    addingStudents(newArray);
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
              <th>Age</th>
              <th>Rank</th>
            </thead>
            <tbody>
              {csvArray.map((item: any, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>{item.age}</td>
                  <td>{item.rank}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      ) : null}
    </form>
  );
}

function addingStudents(newArray: Array<any>) {
  let branches: any = {};
  function getBranch(rno: string) {
    if (rno?.includes("I")) {
      return "IT";
    }
    if (rno?.includes("C")) {
      return "CS";
    }
    if (rno?.includes("E")) {
      return "EI";
    }
    if (rno?.includes("M")) {
      return "ME";
    }
    if (rno?.includes("A")) {
      return "AS";
    }
    if (rno?.includes("T")) {
      return "ETC";
    }
    if (rno?.includes("V")) {
      return "CIV";
    }
  }
  function generateEmail(rno: string) {
    const year = rno?.slice(0, 2);
    const branch = getBranch(rno);
    const last3 = rno?.slice(4);
    return `${year}b${branch?.toLowerCase()}${last3}@ietdavv.edu.in`;
  }
  newArray.forEach((item: any) => {
    const branchID: any = getBranch(item.roll_no);
    const enrollmentYear = parseInt("20" + item.roll_no?.slice(0, 2));
    const section = item.roll_no.slice(4)[0] === "0" ? "A" : "B";
    if (!branches[branchID]) {
      branches[branchID] = {
        branchID,
        enrollmentYear,
        students: {
          [item.enroll_no]: {
            rollID: item.roll_no,
            name: item.name,
            email: generateEmail(item.roll_no),
            enrollmentYear,
            enrollmentID: item.enroll_no,
            section,
          },
        },
      };
    } else {
      branches[branchID].students[item.enroll_no] = {
        rollID: item.roll_no,
        name: item.name,
        email: generateEmail(item.roll_no),
        enrollmentYear,
        enrollmentID: item.enroll_no,
        section,
      };
    }
  });
  console.log(branches);
  async function addStudents(data: any) {
    const res = await studentServices.addNewStudentsMultiple(data);
    console.log(res);
  }
  addStudents(Object.values(branches));
}

function addingBranch(newArray: Array<any>) {
  async function addBranches(data: any) {
    const res = await constantsServices.addNewBranchMultiple(data);
    console.log(res);
  }

  let branches: any = {};
  const branchIDs: any = {
    "Mechanical Engineering": "ME",
    "Computer Engineering": "CS",
    "Civil Engineering": "CIV",
    "Electronics & Instrumentation": "EI",
    "Electronics & Telecommunication": "ETC",
    "Information Technology": "IT",
    "Applied Science": "AS",
  };
  newArray.forEach((item: any) => {
    const branchID = branchIDs[item.branch];
    if (!branches[branchID]) {
      branches[branchID] = {
        branchID,
        branchName: item.branch?.trim(),
        course: item.course?.trim(),
        subjects: {
          [item.subject_code]: {
            subjectCode: item.subject_code?.trim(),
            subjectName: item.subject_name?.trim(),
            sem: parseInt(item.semester),
          },
        },
      };
    } else {
      branches[branchID].subjects[item.subject_code] = {
        subjectCode: item.subject_code?.trim(),
        subjectName: item.subject_name?.trim(),
        sem: parseInt(item.semester),
      };
    }
  });
  console.log(branches);
  addBranches(branches);
}
