using Domain.Interfaces;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Python.Runtime;
using System.Collections;

namespace Services
{
    public class GameService : IGameService
    {
        public IQuizContainer _quizContainer;

        public GameService(IQuizContainer quizContainer)
        {
            _quizContainer = quizContainer;
        }

        public GameState SubmitAnswer(int answer)
        {
            if (answer == 0)
            {
                return new GameState
                {
                    Quiz = _quizContainer.Quiz,
                    CurrentQuestionIndex = _quizContainer.CurrentQuestion,
                    Points = 0,
                    ComboCount = _quizContainer.ComboCount
                };
            }
            
            int points = 0;

            if (answer == _quizContainer.Quiz.Questions[_quizContainer.CurrentQuestion].CorrectAnswer)
            {
                points += 500;
				_quizContainer.CurrentQuestion++;
                _quizContainer.ComboCount++;

                if (_quizContainer.ComboCount >= 3)
                {
                    points += 250;
                }
			}
            else
            {
				_quizContainer.CurrentQuestion++;
                _quizContainer.ComboCount = 0;
			}

            var state = new GameState();
            
            if (_quizContainer.CurrentQuestion >= _quizContainer.Quiz.Questions.Count)
            {
                var endOfQuizQuestion = new Question
                {
                    Text = "NO MORE"
                };

                _quizContainer.Quiz.Questions.Add(endOfQuizQuestion);
                state.Quiz = _quizContainer.Quiz;
                state.CurrentQuestionIndex = _quizContainer.CurrentQuestion;
                state.Points = points;
            }
            else
            {
				state.Quiz = _quizContainer.Quiz;
				state.CurrentQuestionIndex = _quizContainer.CurrentQuestion;
				state.Points = points;
                state.ComboCount = _quizContainer.ComboCount;
			}

            return state;
        }
    }
}
