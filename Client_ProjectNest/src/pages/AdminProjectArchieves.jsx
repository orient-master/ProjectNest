import React, { useState, useEffect } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";

function Archives() {
  const [archived, setArchived] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchArchiveProjects() {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found");
        setLoading(false);
        return;
      }

      try {
        const projectResponse = await axios.get(
          "https://projectnest-w2tf.onrender.com/api/v2/project?status=completed",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setArchived(projectResponse.data.data.projects);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchArchiveProjects();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen bg-backgroundlight flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error) {
    if (loading) {
      return (
        <div className="w-full h-screen bg-backgroundlight flex items-center justify-center">
          <h1>Something went wrong!</h1>
        </div>
      );
    }
  }

  return (
    <div>
      <h1 className="text-center text-2xl">Project Archives</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {archived.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ project }) {
  return (
    <div className=" mt-12  mr-10 bg-slate-800 shadow-md rounded p-4 cursor-pointer ">
      <h2 className="text-xl font-bold mb-2  capitalize">{project.title}</h2>

      <h3 className="text-gray-600 text-lg">Members</h3>
      {project.members.map((member, i) => (
        <span key={i}>
          {member.firstName} {i <= member.length ? "," : ""}
        </span>
      ))}
      <h3 className="mt-2 text-gray-600 text-lg">Supervisor</h3>
      <p>
        {project.supervisor.firstName} {project.supervisor.lastName}
      </p>
      <p className="text-sm text-gray-600 mt-2">
        {" "}
        Semester: {project.semester}
      </p>
      <div className=" mt-10  hover:text-slate-950">
        <a
          href={`https://projectnest-w2tf.onrender.com/public/projectproposals/${project.proposalFile}`}
          target="_blank"
        >
          <span>Final Report: </span>
          Click to view Report
        </a>
      </div>
    </div>
  );
}

export default Archives;
