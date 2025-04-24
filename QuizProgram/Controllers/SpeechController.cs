using Domain.Models;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace QuizProgram.Controllers
{
	[ApiController]
	[Microsoft.AspNetCore.Components.Route("api/speech-to-text")]
	public class SpeechController : ControllerBase
	{
		[HttpPost]
		public async Task<IActionResult> ConvertSpeechToText([FromForm] IFormFile file)
		{
			if (file == null || file.Length == 0)
			{
				return BadRequest("No file uploaded");
			}

			var result = new SpeechToTextResult
			{
				Text = "This is a test"
			};

			return Ok(result);
		}
	}
}
