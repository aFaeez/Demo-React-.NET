using Demo.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace Demo.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProjectSPController : Controller
    {
        private readonly TasksysContext _context;

        public ProjectSPController(TasksysContext context)
        {
            _context = context;
        }

        // STORED PROCEDURE

        [HttpPost("create-project-sp")]
        public async Task<IActionResult> CreateProjectUsingSP([FromBody] Project project)
        {
            if (project == null)
                return BadRequest("Invalid data");

            var newId = new SqlParameter("@NewId", System.Data.SqlDbType.Int) { Direction = System.Data.ParameterDirection.Output };

            await _context.Database.ExecuteSqlRawAsync(
                "EXEC [dbo].[CRUD_INSERT] @ProjectName, @Difficulty, @Description, @NewId OUTPUT",
                new SqlParameter("@ProjectName", project.ProjectName),
                new SqlParameter("@Difficulty", project.Difficulty),
                new SqlParameter("@Description", project.Description),
                newId
            );

            return Ok($"Project created successfully with ID: {newId.Value}");
        }

        [HttpGet("get-project-sp")]
        public async Task<IActionResult> GetProjectUsingSP()
        {
            var projects = await _context.Projects
                .FromSqlRaw("EXEC [dbo].[CRUD_GET]")
                .ToListAsync();

            if (projects == null || projects.Count == 0)
                return NotFound("No projects found");

            return Ok(projects);
        }


        [HttpPut("update-project-sp")]
        public async Task<IActionResult> UpdateProjectUsingSP([FromBody] Project project)
        {
            if (project == null)
                return BadRequest("Invalid data");

            var result = await _context.Database.ExecuteSqlRawAsync(
                "EXEC [dbo].[CRUD_UPDATE] @Id, @ProjectName, @Difficulty, @Description",
                new SqlParameter("@Id", project.Id),
                new SqlParameter("@ProjectName", project.ProjectName),
                new SqlParameter("@Difficulty", project.Difficulty),
                new SqlParameter("@Description", project.Description)
            );

            if (result == 0)
                return NotFound("Project not found or update failed");

            return Ok("Project updated successfully using stored procedure");
        }


        [HttpDelete("delete-project-sp/{id}")]
        public async Task<IActionResult> DeleteProjectUsingSP(int id)
        {
            var result = await _context.Database.ExecuteSqlRawAsync(
                "EXEC [dbo].[CRUD_DELETE] @Id",
                new SqlParameter("@Id", id)
            );

            if (result == 0)
                return NotFound("Project not found or delete failed");

            return Ok("Project deleted successfully using stored procedure");
        }

    }
}
