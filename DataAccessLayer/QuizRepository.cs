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

		public bool CreateQuiz(Quiz quiz)
		{
			// Check if the quiz already exist in DB
			var existingQuiz = _db.Quiz
				.FirstOrDefault(q => q.QuizName == quiz.QuizName);

			if (existingQuiz == null) // Add to DB
			{
				_db.Quiz.Add(quiz);
				_db.SaveChanges();
				return true;
			}
			else // If hit return and dont add to DB
			{
				return false;
			}
		}

		public IEnumerable<Quiz> GetAllQuizzes()
		{
			var quizzes = _db.Quiz
				.Include(q => q.Questions)
				.ToList();

			return quizzes;
		}

		public bool DeleteQuiz(Quiz quiz)
		{

			var quizToRemove = _db.Quiz
				.FirstOrDefault(q => q.QuizName == quiz.QuizName);

			if (quizToRemove == null)
			{
				throw new Exception("Quiz not found");
			}

			_db.Quiz.Remove(quizToRemove);
			_db.SaveChanges();

			return true;
		}
	}
}
