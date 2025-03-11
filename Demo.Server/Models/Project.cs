using System;
using System.Collections.Generic;

namespace Demo.Server.Models;

public partial class Project
{
    public int Id { get; set; }

    public string ProjectName { get; set; } = null!;

    public string Difficulty { get; set; } = null!;

    public string Description { get; set; } = null!;
}