using Domain.Interfaces;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer
{
	public class QuestionRepository : IQuestionRepository
	{
		private readonly DatabaseContext _db;

		public QuestionRepository(DatabaseContext db)
		{
			_db = db;
		}

		public bool CreateQuestion(Question question)
		{
			// Check if the question already exists
			var existingQuestion = _db.Question
				.FirstOrDefault(quest => quest.Text == question.Text);

			if (existingQuestion == null)
			{
				_db.Question.Add(question);
				_db.SaveChanges();
				return true;
			}
			else
			{
				return false;
			}
		}

		public bool DeleteQuestion(Question question)
		{
			var questionToRemove = _db.Question
					.FirstOrDefault(q => q.QuestionId == question.QuestionId);

			if (questionToRemove == null)
			{
				throw new Exception("Quiz not found");
			}

			_db.Question.Remove(questionToRemove);
			_db.SaveChanges();


			return true;
		}

		public bool UpdateQuestion(Question updatedQuestion)
		{
			var existingQuestion = _db.Question.FirstOrDefault(q => q.QuestionId == updatedQuestion.QuestionId);

			if (existingQuestion != null)
			{
				existingQuestion.Text = updatedQuestion.Text;
				existingQuestion.FirstAnswer = updatedQuestion.FirstAnswer;
				existingQuestion.SecondAnswer = updatedQuestion.SecondAnswer;
				existingQuestion.ThirdAnswer = updatedQuestion.ThirdAnswer;
				existingQuestion.FourthAnswer = updatedQuestion.FourthAnswer;
				existingQuestion.CorrectAnswer = updatedQuestion.CorrectAnswer;
				existingQuestion.Seconds = updatedQuestion.Seconds;
				existingQuestion.Difficulty = updatedQuestion.Difficulty;

				_db.SaveChanges();
				return true;
			}
			else
			{
				return false;
			}
		}
	}
}
