using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using NotificationApp.Hubs;

namespace NotificationApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotificationsController : ControllerBase
    {
        private readonly IHubContext<NotificationHub> _hubContext;

        public NotificationsController(IHubContext<NotificationHub> hubContext)
        {
            _hubContext = hubContext;
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Notification notification)
        {
            await _hubContext.Clients.All.SendAsync("ReceiveNotification", notification.User, notification.Message);
            return Ok();
        }
    }

    public class Notification
    {
        public string User { get; set; }
        public string Message { get; set; }
    }
}
