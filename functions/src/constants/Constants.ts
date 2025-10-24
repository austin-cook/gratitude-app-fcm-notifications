/**
 * Firebase Constants
 */

export const FIREBASE_REGION = "us-central1";
export const FIREBASE_CLOUD_TASKS_QUEUE_NAME =
  "gratitude-app-notification-sender-queue";

/**
 * Time Zone Constants
 */

export const regions = [
  "americas",
  "europe",
  "west_asia",
  "east_asia",
] as const;
export type Region = typeof regions[number];

/**
 * Notification Constants
 */
export interface NotificationTimes {
  utc: string;
  americas: string;
  europe: string;
  west_asia: string;
  east_asia: string;
}
export type NotificationTimesDict = Record<string, NotificationTimes>;
export const NotificationRegionTopics = [
  "daily_reminder_americas",
  "daily_reminder_europe",
  "daily_reminder_west_asia",
  "daily_reminder_east_asia",
] as const;
export type NotificationRegionTopic = (typeof NotificationRegionTopics)[number];

export const getNotificationReionTopic =
  (region: Region): NotificationRegionTopic => {
    switch (region) {
    case "americas":
      return "daily_reminder_americas";
    case "europe":
      return "daily_reminder_europe";
    case "west_asia":
      return "daily_reminder_west_asia";
    case "east_asia":
      return "daily_reminder_east_asia";
    }
  };
