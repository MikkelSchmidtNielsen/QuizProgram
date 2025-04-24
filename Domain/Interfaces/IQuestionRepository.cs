using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Interfaces
{
    public interface IQuestionRepository
    {
		bool CreateQuestion(Question question);
		bool DeleteQuestion(Question question);
		bool UpdateQuestion(Question question);
	}
}
