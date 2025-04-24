using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IQuizContainer
    {
        Quiz Quiz { get; }
        int CurrentQuestion { get; set; }
        int ComboCount { get; set; }
        void SetSelectedQuiz(Quiz quiz);
        void ClearSelectedQuiz();
    }
}
