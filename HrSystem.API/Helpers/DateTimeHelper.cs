using System;

namespace HrSystem.API.Helpers;

public static class DateTimeHelper
{
    // UAE Time Zone (UTC+4) - Gulf Standard Time
    private static TimeZoneInfo GetUaeTimeZone()
    {
        try
        {
            // Try different time zone IDs for UAE/Gulf time
            var timeZoneIds = new[]
            {
                "Arabian Standard Time",
                "Asia/Dubai",
                "Gulf Standard Time"
            };

            foreach (var id in timeZoneIds)
            {
                try
                {
                    var tz = TimeZoneInfo.FindSystemTimeZoneById(id);
                    if (tz != null)
                        return tz;
                }
                catch { }
            }

            // Fallback: Create custom time zone for UAE (UTC+4)
            return TimeZoneInfo.CreateCustomTimeZone(
                "UAE",
                TimeSpan.FromHours(4),
                "UAE Time",
                "UAE Time");
        }
        catch
        {
            // Final fallback
            return TimeZoneInfo.CreateCustomTimeZone(
                "UAE",
                TimeSpan.FromHours(4),
                "UAE Time",
                "UAE Time");
        }
    }

    private static readonly TimeZoneInfo uaeTimeZone = GetUaeTimeZone();

    public static DateTime GetUaeNow()
    {
        return TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, uaeTimeZone);
    }

    public static DateTime GetUaeDate()
    {
        return GetUaeNow().Date;
    }

    public static DateTime? ConvertToUae(DateTime? utcDateTime)
    {
        if (!utcDateTime.HasValue)
            return null;

        return TimeZoneInfo.ConvertTimeFromUtc(utcDateTime.Value, uaeTimeZone);
    }

    public static DateTime ConvertToUae(DateTime utcDateTime)
    {
        return TimeZoneInfo.ConvertTimeFromUtc(utcDateTime, uaeTimeZone);
    }
}

