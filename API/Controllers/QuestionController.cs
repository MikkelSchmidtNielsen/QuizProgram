using Domain.Interfaces;
using Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionController : Controller
    {
        private readonly IQuestionService _questionService;

		public QuestionController(IQuestionService questionService)
		{
			_questionService = questionService;
		}

        [HttpPost]
        public IActionResult Create([FromBody] Question question)
        {
            _questionService.CreateQuestion(question);
            return Ok();
        }
    }
}
