using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IQuestionService
    {
        void CreateQuestion(Question question);
        bool DeleteQuestion(Question question);
        bool UpdateQuestion(Question question);
        IEnumerable<Question> SortBy(IEnumerable<Question> questions, string sortCategory, bool descending);
    }
}
