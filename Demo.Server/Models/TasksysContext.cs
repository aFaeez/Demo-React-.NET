using Microsoft.Data.SqlClient;
using System.Data;
using Microsoft.EntityFrameworkCore;

namespace Demo.Server.Models;

public partial class TasksysContext : DbContext
{
    public TasksysContext()
    {
    }

    public TasksysContext(DbContextOptions<TasksysContext> options)
        : base(options)
    {
    }

    // Stored procedure
    public async Task<List<Dictionary<string, object>>> ExecuteStoredProcedureAsync(
        string storedProcName,
        params SqlParameter[] parameters)
    {
        var resultList = new List<Dictionary<string, object>>();

        // Open connection
        await Database.OpenConnectionAsync();

        using (var command = Database.GetDbConnection().CreateCommand())
        {
            command.CommandText = storedProcName;
            command.CommandType = CommandType.StoredProcedure;

            if (parameters != null)
            {
                foreach (var parameter in parameters)
                {
                    command.Parameters.Add(parameter);
                }
            }

            using (var reader = await command.ExecuteReaderAsync())
            {
                while (await reader.ReadAsync())
                {
                    var row = new Dictionary<string, object>();
                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        row[reader.GetName(i)] = reader.GetValue(i);
                    }
                    resultList.Add(row);
                }
            }
        }

        // Close connection
        await Database.CloseConnectionAsync();
        return resultList;
    }


    // Entity Framework
    public virtual DbSet<Dcandidate> Dcandidates { get; set; }

    public virtual DbSet<Project> Projects { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer("server=localhost;database=TASKSYS;uid=sa;password=2770;MAX POOL SIZE=500;Timeout=999999;Pooling=false;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Dcandidate>(entity =>
        {
            entity.ToTable("DCandidates");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Address)
                .HasMaxLength(100)
                .HasColumnName("address");
            entity.Property(e => e.Age).HasColumnName("age");
            entity.Property(e => e.BloodGroup)
                .HasMaxLength(3)
                .HasColumnName("bloodGroup");
            entity.Property(e => e.Email)
                .HasMaxLength(100)
                .HasColumnName("email");
            entity.Property(e => e.FullName)
                .HasMaxLength(100)
                .HasColumnName("fullName");
            entity.Property(e => e.Mobile)
                .HasMaxLength(16)
                .HasColumnName("mobile");
        });

        modelBuilder.Entity<Project>(entity =>
        {
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Description)
                .HasMaxLength(100)
                .HasColumnName("description");
            entity.Property(e => e.Difficulty)
                .HasMaxLength(10)
                .HasColumnName("difficulty");
            entity.Property(e => e.ProjectName)
                .HasMaxLength(100)
                .HasColumnName("projectName");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
