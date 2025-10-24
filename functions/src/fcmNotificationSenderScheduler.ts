import {onSchedule} from "firebase-functions/v2/scheduler";
import {CloudTasksClient, protos} from "@google-cloud/tasks";
import notificationTimes from "./constants/notification_times.json";
import {getTomorrowAsIso8601Date} from "./util/DateTimeUtil";
import {
  FIREBASE_CLOUD_TASKS_QUEUE_NAME,
  FIREBASE_REGION,
  NotificationTimesDict,
  regions,
} from "./constants/Constants";
import {FCMNotificationSenderRequestBody} from "./fcmNotificationSender";

const client = new CloudTasksClient();
const project = process.env.GCLOUD_PROJECT;
if (!project) throw new Error("No project found in environment");

export const fcmNotificationSenderScheduler = onSchedule(
  "0 0 * * *", // schedule every day at 00:00 (midnight) UTC
  async () => {
    // schedule notifications for tomorrow (not today) see README
    const tomorrow = getTomorrowAsIso8601Date();

    const schedule = (notificationTimes as NotificationTimesDict)[tomorrow];
    if (!schedule) throw new Error(`No schedule for ${tomorrow}`);

    for (const region of regions) {
      const notificationTime = new Date(schedule[region]);

      const requestBody: FCMNotificationSenderRequestBody = {
        region,
        postingWindowDate: tomorrow,
      };

      const task: protos.google.cloud.tasks.v2.ITask = {
        httpRequest: {
          httpMethod: protos.google.cloud.tasks.v2.HttpMethod.POST,
          url: `https://${FIREBASE_REGION}-${project}`+
            ".cloudfunctions.net/fcmNotificationSender",
          headers: {"Content-Type": "application/json"},
          body: Buffer.from(JSON.stringify(requestBody)).toString("base64"),
          oidcToken: {
            serviceAccountEmail: `${project}@appspot.gserviceaccount.com`,
          },
        },
        scheduleTime: {
          seconds: Math.floor(notificationTime.getTime() / 1000),
        },
      };

      await client.createTask({
        parent: client.queuePath(
          project,
          FIREBASE_REGION,
          FIREBASE_CLOUD_TASKS_QUEUE_NAME
        ),
        task: task,
      });
      console.log(`Scheduled ${region} for ${notificationTime}`);
    }
  });
