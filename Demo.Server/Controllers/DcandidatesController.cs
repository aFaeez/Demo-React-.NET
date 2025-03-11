using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Demo.Server.Models;

namespace Demo.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DcandidatesController : Controller
    {
        private readonly TasksysContext _context;

        public DcandidatesController(TasksysContext context)
        {
            _context = context;
        }

        // Get all projects
        [HttpGet("get-all-Dcandidates")]
        public async Task<ActionResult<IEnumerable<Dcandidate>>> GetAllProjects()
        {
            return await _context.Dcandidates.ToListAsync();
        }
    }
}
