using Domain.Interfaces;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
	public class QuizService : IQuizService
	{
		private readonly IQuizRepository _quizRepository;

		public QuizService(IQuizRepository quizRepository)
		{
			_quizRepository = quizRepository;
		}

		public void CreateQuiz(string quizName)
		{
			Quiz quiz = new(quizName, new List<Question>());
			_quizRepository.CreateQuiz(quiz);
		}

		public Task<List<Quiz>> GetAllQuizzes()
		{
			var quizzes = _quizRepository.GetAllQuizzes();
			var list = quizzes.ToList();

			return Task.FromResult(list);
		}

		public bool DeleteQuiz(Quiz selectedQuiz)
		{
			var result = _quizRepository.DeleteQuiz(selectedQuiz);

			return result;
		}
	}
}
