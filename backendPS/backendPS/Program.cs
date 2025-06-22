using backendPS;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Hub = backendPS.Hub;

var builder = WebApplication.CreateBuilder(args);

// Adaugă SignalR și serviciul de socket
builder.Services.AddSignalR();
builder.Services.AddHostedService<SocketListenerService>();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});
builder.WebHost.UseUrls("http://localhost:5195");

var app = builder.Build();

app.UseCors();
app.MapHub<Hub>("/hub");
app.MapGet("/", () => "Backend is running");

app.Run();