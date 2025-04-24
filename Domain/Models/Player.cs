using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    public class Player
    {
        public int PlayerId { get; set; }
        public string Username { get; set; }
        public int Points { get; set; }

		public Player(string username, int points)
		{
			Username = username;
			Points = points;
		}
	}
}
