import { useEffect, useState } from "react";
import {
    Container,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    CssBaseline,
    ThemeProvider,
    createTheme, Stack
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import * as apiClient from "../services/apiClient";
import { useApiBaseUrl, fetchProjects, createProject, updateProject, deleteProject } from "../services/configService";

// Create a theme with a white background and black text
const theme = createTheme({
    palette: {
        mode: "light",
        background: {
            default: "#fff",
            paper: "#fff",
        },
        text: {
            primary: "#000",
        },
    },
});

const App = () => {
    const apiBaseUrl = useApiBaseUrl();
    const [projects, setProjects] = useState<apiClient.Project[]>([]);
    const [formData, setFormData] = useState(new apiClient.Project());
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (apiBaseUrl) {
            loadProjects();
        }
    }, [apiBaseUrl]); // Ensure apiBaseUrl is available


    const loadProjects = async () => {
        const data = await fetchProjects(apiBaseUrl);
        setProjects(data);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => Object.assign(new apiClient.Project(), prev, { [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (isEditing) {
            await updateProject(apiBaseUrl, formData);
        } else {
            const newProject = Object.assign(new apiClient.Project(), formData);
            newProject.id = undefined; // Ensure ID is not sent for creation
            await createProject(apiBaseUrl, newProject);
        }

        setFormData(new apiClient.Project()); // Reset form using a new instance
        setIsEditing(false);
        loadProjects();
    };

    const handleEdit = (project: apiClient.Project) => {
        setFormData(Object.assign(new apiClient.Project(), project));
        setIsEditing(true);
    };

    const handleDelete = async (id?: number) => {
        if (id !== undefined) {
            await deleteProject(apiBaseUrl, id);
            loadProjects();
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container>
                <h2>Project Management</h2>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Project Name"
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        InputLabelProps={{ shrink: true }} 
                    />
                    <TextField
                        label="Difficulty"
                        name="difficulty"
                        value={formData.difficulty}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        InputLabelProps={{ shrink: true }} 
                    />
                    <TextField
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                        InputLabelProps={{ shrink: true }} 
                    />

                    <Stack direction="row" spacing={2} mt={2}>
                        <Button type="submit" variant="contained" color="primary">
                            {isEditing ? "Update" : "Create"}
                        </Button>
                        <Button
                            type="button"
                            variant="contained"
                            color="secondary"
                            onClick={() => {
                                setFormData({
                                    projectName: "",
                                    difficulty: "",
                                    description: "",
                                } as apiClient.Project); // Reset form fields explicitly
                                setIsEditing(false); // Exit editing mode
                            }}
                        > Reset
                        </Button>
                    </Stack>
                </form>

                <TableContainer component={Paper} sx={{ marginTop: 3 }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Name</TableCell>
                                <TableCell>Difficulty</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {projects.map((project) => (
                                <TableRow key={project.id}>
                                    <TableCell>{project.id}</TableCell>
                                    <TableCell>{project.projectName}</TableCell>
                                    <TableCell>{project.difficulty}</TableCell>
                                    <TableCell>{project.description}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleEdit(project)} color="primary">
                                            <Edit />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(project.id)} color="secondary">
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </ThemeProvider>
    );
};

export default App;
