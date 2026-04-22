namespace TFL.Application.DTOs;

public record PushSubscribeRequest(string Endpoint, PushKeysDto Keys);

public record PushKeysDto(string P256dh, string Auth);

public record PushUnsubscribeRequest(string Endpoint);
