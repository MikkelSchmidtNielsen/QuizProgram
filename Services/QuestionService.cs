using Domain.Interfaces;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace Services
{
    public class QuestionService : IQuestionService
    {
        private readonly IQuestionRepository _questionRepository;
        public QuestionService(IQuestionRepository questionRepository)
        {
            _questionRepository = questionRepository;
		}
        public void CreateQuestion(Question question)
        {
            _questionRepository.CreateQuestion(question);
        }

        public bool DeleteQuestion(Question question)
        {
            var result = _questionRepository.DeleteQuestion(question);

            return result;
        }

        public bool UpdateQuestion(Question question)
        {
            var result = _questionRepository.UpdateQuestion(question);

            return result;
        }
    }
}
