using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IQuizService
    {
        Task CreateQuizAsync(string quizName);

        Task<List<Quiz>> GetAllQuizSummariesAsync();

        Task<Quiz> GetQuizQuestionsAsync(Quiz quiz);

		Task<bool> DeleteQuizAsync(Quiz quiz);
    }
}
