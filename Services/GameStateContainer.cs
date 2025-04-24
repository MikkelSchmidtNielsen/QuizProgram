using Domain.Interfaces;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
	public class GameStateContainer : IGameStateContainer
	{
		public GameState GameState { get; set; } = null!;
	}
}
