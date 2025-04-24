using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Models
{
    [NotMapped]
    public class GameState
    {
        public Quiz Quiz { get; set; }
        public int CurrentQuestionIndex { get; set; }
        public decimal Points { get; set; }
        public int ComboCount { get; set; }
    }
}
