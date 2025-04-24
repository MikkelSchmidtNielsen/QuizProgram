using Domain.Interfaces;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
    public class QuizContainer : IQuizContainer
    {
        public Quiz Quiz { get; set; } = null!;

        public int CurrentQuestion { get; set; } = 0;

        public int ComboCount { get; set; } = 0;

		public void SetSelectedQuiz(Quiz quiz)
        {
            Quiz = quiz;
        }

        public void ClearSelectedQuiz()
        {
            Quiz = null!;
        }
    }
}
