using Domain.Interfaces;
using Domain.Models;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class GameController : Controller
    {
        private readonly IGameService _gameService;

        public GameController(IGameService gameService) 
        {
            _gameService = gameService;
        }

        [HttpPost("submit-answer")]
        public ActionResult<GameState> SubmitAnswer([FromBody] int answer)
        {
            GameState state = _gameService.SubmitAnswer(answer);

            return Ok(state);
        }
    }
}
