import React, { createContext, useContext, useState, useCallback } from "react";
import axios from "axios";

const ProjectContext = createContext();

export function ProjectProvider({ children }) {
  const [projectDetails, setProjectDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProjectData = useCallback(async (projectId) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `https://projectnest-w2tf.onrender.com/api/v2/project/my-projects/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProjectDetails(res.data);
    } catch (error) {
      console.error("There was some error loading the data:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return (
    <ProjectContext.Provider
      value={{ projectDetails, isLoading, error, fetchProjectData }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);
  if (context === undefined)
    throw new Error("useProject must be used within a ProjectProvider");
  return context;
}
