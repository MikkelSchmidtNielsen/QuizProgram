using Domain.Interfaces;
using Domain.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer
{
	public class QuizRepository : IQuizRepository
	{
		private readonly DatabaseContext _db;

		public QuizRepository(DatabaseContext db)
		{
			_db = db;
		}

		public async Task<bool> CreateQuizAsync(Quiz quiz)
		{
			// Check if the quiz already exist in DB
			var existingQuiz = await _db.Quiz
				.AsNoTracking()
				.FirstOrDefaultAsync(q => q.QuizName == quiz.QuizName);

			if (existingQuiz == null) // Add to DB
			{
				await _db.Quiz.AddAsync(quiz);
				await _db.SaveChangesAsync();
				return true;
			}
			else // If hit return and dont add to DB
			{
				return false;
			}
		}

		public async Task<IEnumerable<Quiz>> GetAllQuizSummariesAsync()
		{
			var quizzes = await _db.Quiz
				.AsNoTracking()
				.ToListAsync();

			return quizzes;
		}

		public async Task<Quiz> GetQuizQuestionsAsync(Quiz quiz)
		{
			Quiz quizWithQuest = await _db.Quiz
				.Where(quest => quest.QuizId == quiz.QuizId)
				.Include(q => q.Questions)
				.SingleAsync();

			return quizWithQuest;
		}

		public async Task<bool> DeleteQuizAsync(Quiz quiz)
		{

			var quizToRemove = await _db.Quiz
				.FindAsync(quiz.QuizId);

			if (quizToRemove == null)
			{
				throw new Exception("Quiz not found");
			}

			_db.Quiz.Remove(quizToRemove);
			await _db.SaveChangesAsync();

			return true;
		}
	}
}
