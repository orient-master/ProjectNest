import React, { useState, useEffect } from "react";
import axios from "axios";
import { createColumnHelper } from "@tanstack/react-table";
import CreateTable from "../components/Admin/AddProject/CreateTable";
import Spinner from "../components/Spinner";

function ProjectRequests() {
  const [projectreq, setProjectreq] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSupervisors, setSelectedSupervisors] = useState({});

  function handleSupervisorChange(projectId, supervisorId) {
    setSelectedSupervisors((prevState) => ({
      ...prevState,
      [projectId]: supervisorId,
    }));
  }

  async function handleapproveRequest(project_id) {
    const token = localStorage.getItem("token");
    const supervisorId = selectedSupervisors[project_id];

    const data = await axios.patch(
      `https://projectnest-w2tf.onrender.com/api/v2/projectreq/${project_id}/accept-proposal`,
      {
        supervisor: supervisorId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setProjectreq((prev) => prev.filter((proj) => proj._id !== project_id));
  }

  async function handlerejectRequest(project_id) {
    const token = localStorage.getItem("token");
    const data = await axios.patch(
      `https://projectnest-w2tf.onrender.com/api/v2/projectreq/${project_id}/reject-proposal`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setProjectreq((prev) => prev.filter((proj) => proj._id !== project_id));
  }

  useEffect(() => {
    async function fetchProjectReq() {
      const token = localStorage.getItem("token");
      setLoading(true);
      const data = await axios.get(
        "https://projectnest-w2tf.onrender.com/api/v2/projectreq/proposals",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const supervisor = await axios.get(
        "https://projectnest-w2tf.onrender.com/api/v2/user?role=supervisor",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);

      setProjectreq(data.data.proposals);
      setSupervisors(supervisor.data.data.users);
    }
    fetchProjectReq();
  }, []);

  const columnHelper = createColumnHelper();
  const columns = [
    columnHelper.accessor("", {
      id: "S.No",
      cell: (info) => <span>{info.row.index + 1}</span>,
      header: "S.No",
    }),
    columnHelper.accessor("title", {
      id: "title",
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Project Name",
    }),
    columnHelper.accessor("problemStatement", {
      id: "problemStatement",
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Problem Statement",
    }),
    columnHelper.accessor("solution", {
      id: "solution",
      cell: (info) => <span>{info.getValue()}</span>,
      header: "Solution",
    }),
    columnHelper.accessor("proposalPDF", {
      id: "proposal",
      cell: (info) => (
        <a
          href={`https://projectnest-w2tf.onrender.com/public/projectproposals/${info.getValue()}`}
          target="_blank"
        >
          <span className=" text-blue-600 hover:text-red-200">View </span>
        </a>
      ),
      header: "Proposal",
    }),
    columnHelper.accessor("Supervisor", {
      id: "Supervisor",
      cell: (info) => (
        <select
          className="h-full w-full rounded-[7px] text-black px-2 "
          onChange={(e) =>
            handleSupervisorChange(info.cell.row.original._id, e.target.value)
          }
          value={selectedSupervisors[info.cell.row.original._id] || ""}
        >
          <option>Select Here</option>
          {supervisors.map((supervisor) => (
            <option key={supervisor._id} value={supervisor._id}>
              {supervisor.firstName}
            </option>
          ))}
        </select>
      ),
      header: "Allocate Supervisor",
    }),
    columnHelper.accessor("registered", {
      id: "registered",
      cell: (info) => (
        <div className="flex gap-2">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleapproveRequest(info.cell.row.original._id)}
          >
            Approve
          </button>
          <button
            className="bg-red-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handlerejectRequest(info.cell.row.original._id)}
          >
            Reject
          </button>
        </div>
      ),
      header: "Registration Action",
    }),
  ];

  const [columnFilters, setColumnFilters] = useState([]);
  if (loading) {
    return (
      <div className="w-full h-screen bg-backgroundlight flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full">
      <h1 className="text-center text-2xl">Project Requests</h1>

      <CreateTable
        columns={columns}
        data={projectreq}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
        supervisors={supervisors}
      />
    </div>
  );
}

export default ProjectRequests;
