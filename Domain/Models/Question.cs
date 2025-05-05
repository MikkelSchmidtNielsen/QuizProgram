using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class Question
    {
		public int QuestionId { get; set; }
		public int QuizId { get; set; }
		public string Category { get; set; }
		public string Text { get; set; }
		public string FirstAnswer { get; set; }
		public string SecondAnswer { get; set; }
		public string ThirdAnswer { get; set; }
		public string FourthAnswer { get; set; }
		public int CorrectAnswer { get; set; }
		public int Seconds { get; set; }
		public int Difficulty { get; set; }
		[NotMapped]
		public bool IsEditing { get; set; } = false;
		public Quiz Quiz { get; set; }
	}
}
