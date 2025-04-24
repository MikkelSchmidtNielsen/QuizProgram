using Services;
using Domain.Interfaces;
using DataAccessLayer;
using QuizProgram.Components;
using Microsoft.EntityFrameworkCore;

namespace QuizProgram;

public class Program
{
	public static void Main(string[] args)
	{
		var builder = WebApplication.CreateBuilder(args);

		// Add services to the container.
		builder.Services.AddRazorComponents()
			.AddInteractiveServerComponents();
		builder.Services.AddHttpClient();
		builder.Services.AddServerSideBlazor()
			.AddCircuitOptions(options => { options.DetailedErrors = true; });

		//Entity Framework
		builder.Services.AddDbContext<DatabaseContext>(options => options.UseSqlServer("Data Source=localhost;Initial Catalog='QuizDB';Integrated Security=SSPI;TrustServerCertificate=true",
			builder => builder.MigrationsAssembly("DataAccessLayer")));

		//BLL services
		builder.Services.AddTransient<IQuizService, QuizService>();
		builder.Services.AddTransient<IQuestionService, QuestionService>();
		builder.Services.AddTransient<IGameService, GameService>();
		builder.Services.AddSingleton<IQuizContainer, QuizContainer>();
		builder.Services.AddSingleton<IGameStateContainer, GameStateContainer>();
		builder.Services.AddSingleton<IQuizAPIService, QuizAPIService>();

		//DAL services
		builder.Services.AddTransient<IQuizRepository, QuizRepository>();
		builder.Services.AddTransient<IQuestionRepository, QuestionRepository>();

		var app = builder.Build();

		// Configure the HTTP request pipeline.
		if (!app.Environment.IsDevelopment())
		{
			app.UseExceptionHandler("/Error");
			// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
			app.UseHsts();
		}

		app.UseHttpsRedirection();

		app.UseStaticFiles();
		app.UseAntiforgery();

		app.MapRazorComponents<App>()
			.AddInteractiveServerRenderMode();

		app.Run();
	}
}
