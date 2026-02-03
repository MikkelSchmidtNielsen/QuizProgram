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

		public async Task CreateQuizAsync(string quizName)
		{
			Quiz quiz = new(quizName, new List<Question>());

			await _quizRepository.CreateQuizAsync(quiz);
		}

		public async Task<List<Quiz>> GetAllQuizSummariesAsync()
		{
			IEnumerable<Quiz> quizzes = await _quizRepository.GetAllQuizSummariesAsync();

			var list = quizzes.ToList();

			return list;
		}

		public async Task<Quiz> GetQuizQuestionsAsync(Quiz quiz)
		{
			Quiz quizWithQuest = await _quizRepository.GetQuizQuestionsAsync(quiz);

			return quizWithQuest;
		}

		public async Task<bool> DeleteQuizAsync(Quiz selectedQuiz)
		{
			bool result = await _quizRepository.DeleteQuizAsync(selectedQuiz);

			return result;
		}
	}
}
