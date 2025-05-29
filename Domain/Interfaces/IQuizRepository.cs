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
        Task<bool> CreateQuizAsync(Quiz quiz);

        Task<IEnumerable<Quiz>> GetAllQuizSummariesAsync();

        Task<bool> DeleteQuizAsync(Quiz quiz);
    }
}
