using Microsoft.EntityFrameworkCore;
using Domain.Models;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace DataAccessLayer
{
	public class DatabaseContext : DbContext
	{
		public DatabaseContext(DbContextOptions options) : base(options)
		{
		}

		public DbSet<Quiz> Quiz { get; set; }
		public DbSet<Question> Question { get; set; }
		public DbSet<Player> Player { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			// Primary keys
			modelBuilder.Entity<Quiz>()
				.HasKey(quiz => quiz.QuizId);

			modelBuilder.Entity<Question>()
				.HasKey(question => question.QuestionId);

			modelBuilder.Entity<Player>()
				.HasKey(player => player.PlayerId);

			// Relations
			modelBuilder.Entity<Quiz>()
				.HasMany(question => question.Questions)
				.WithOne(quiz => quiz.Quiz)
				.OnDelete(DeleteBehavior.Cascade);

			modelBuilder.Entity<Question>()
				.HasOne(quiz => quiz.Quiz)
				.WithMany(question => question.Questions)
				.HasForeignKey(quiz => quiz.QuizId)
				.OnDelete(DeleteBehavior.Cascade);
		}
	}
}
