using Domain.Interfaces;
using Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;

namespace Services
{
	public class QuizAPIService : IQuizAPIService
	{
		private readonly HttpClient _httpClient;

		public QuizAPIService(HttpClient httpClient)
		{
			_httpClient = httpClient;
		}

		public async Task<SpeechToTextResult> ConvertSpeechToTextAsync(byte[] audioFile)
		{
			var formData = new MultipartFormDataContent();
			formData.Add(new ByteArrayContent(audioFile), "file", "audio.wav");

			var response = await _httpClient.PostAsync("https://localhost:7167/speech-to-text/", formData);

			if (response.IsSuccessStatusCode)
			{
				var result = await response.Content.ReadFromJsonAsync<SpeechToTextResult>();

				if (result != null)
				{
					return result;
				}
			}

			throw new Exception("Failed to convert speech to text");
		}
	}
}
