using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IQuizRepository
    {
        bool CreateQuiz(Quiz quiz);

        IEnumerable<Quiz> GetAllQuizzes();

        bool DeleteQuiz(Quiz quiz);
    }
}
