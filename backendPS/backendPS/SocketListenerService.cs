using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.SignalR;

namespace backendPS;

public class SocketListenerService : BackgroundService
{
    private readonly IHubContext<Hub> _hubContext;

    public SocketListenerService(IHubContext<Hub> hubContext)
    {
        _hubContext = hubContext;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var listener = new TcpListener(IPAddress.Loopback, 5000);
        listener.Start();
        Console.WriteLine("✅ Socket listener pornit pe portul 5000...");

        while (!stoppingToken.IsCancellationRequested)
        {
            var client = await listener.AcceptTcpClientAsync(stoppingToken);
            _ = HandleClient(client, stoppingToken);
        }
    }

    private async Task HandleClient(TcpClient client, CancellationToken token)
    {
        using var stream = client.GetStream();
        var buffer = new byte[4096];
        var byteCount = await stream.ReadAsync(buffer, token);

        var json = Encoding.UTF8.GetString(buffer, 0, byteCount);

        try
        {
            var data = JsonSerializer.Deserialize<Dictionary<string, object>>(json);
            Console.WriteLine("📦 Date primite:");
            foreach (var pair in data!)
                Console.WriteLine($" - {pair.Key}: {pair.Value}");

            // Trimite către toți clienții conectați la SignalR
            await _hubContext.Clients.All.SendAsync("ReceiveUpdate", data);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Eroare JSON: {ex.Message}");
        }
    }
}