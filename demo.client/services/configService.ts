import { useEffect, useState } from "react";
import * as apiClient from "./apiClient";

export const fetchConfig = async (): Promise<string> => {
    try {
        const response = await fetch("/config.json");
        if (!response.ok) throw new Error("Failed to load config.json");
        const config = await response.json();
        return config.API_BASE_URL;
    } catch (error) {
        console.error("Error loading API config:", error);
        return "";
    }
};

export const useApiBaseUrl = () => {
    const [apiBaseUrl, setApiBaseUrl] = useState<string>("");

    useEffect(() => {
        fetchConfig().then(setApiBaseUrl);
    }, []);

    return apiBaseUrl;
};


export const fetchProjects = async (apiBaseUrl: string): Promise<apiClient.Project[]> => {
    if (!apiBaseUrl) return [];

    try {
        const response = await fetch(`${apiBaseUrl}/Task/get-all-projects`);
        if (!response.ok) throw new Error("Failed to fetch projects");
        return await response.json();
    } catch (error) {
        console.error("Error fetching projects:", error);
        return [];
    }
};

export const createProject = async (apiBaseUrl: string, project: Omit<apiClient.Project, "id">): Promise<void> => {
    if (!apiBaseUrl) return;

    try {
        const response = await fetch(`${apiBaseUrl}/Task/create-project`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(project),
        });

        if (!response.ok) throw new Error("Failed to create project");
    } catch (error) {
        console.error("Error creating project:", error);
    }
};

export const updateProject = async (apiBaseUrl: string, project: apiClient.Project): Promise<void> => {
    if (!apiBaseUrl) return;

    try {
        const response = await fetch(`${apiBaseUrl}/Task/update-project/${project.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(project),
        });

        if (!response.ok) throw new Error("Failed to update project");
    } catch (error) {
        console.error("Error updating project:", error);
    }
};

export const deleteProject = async (apiBaseUrl: string, projectId: number): Promise<void> => {
    if (!apiBaseUrl) return;

    try {
        const response = await fetch(`${apiBaseUrl}/Task/delete-project/${projectId}`, {
            method: "DELETE",
        });

        if (!response.ok) throw new Error("Failed to delete project");
    } catch (error) {
        console.error("Error deleting project:", error);
    }
};