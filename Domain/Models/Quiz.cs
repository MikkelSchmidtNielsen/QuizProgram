using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class Quiz
    {
        public int QuizId { get; set; }
		public string QuizName { get; set; } = null!;
		public List<Question> Questions { get; set; } = new();

		public Quiz() {} // EF der kan lave en quiz uden spørgsmål

		public Quiz(string quizName, List<Question> questions)
		{
			QuizName = quizName;
			Questions = questions;
		}
	}
}
