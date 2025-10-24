# Gratitude App FCM Notifications

## 📘 Overview

This repository contains two Firebase Cloud Functions that work together to schedule and send FCM topic notifications.

### 1. FCMNotificationSender

#### Purpose:

Sends an FCM message to all subscribers of a specific topic.

#### Details:

- Triggered automatically by the scheduler (see below).
- Sends notifications to one of the following FCM topics:
  - americas
  - europe
  - west_asia
  - east_asia
- Uses Firebase Admin SDK to communicate with the FCM API.

### 2. FCMNotificationSenderScheduler

#### Purpose:

Schedules when the FCMNotificationSender function should run.

#### How it works:

- Runs once per day at 00:00 (midnight) UTC.
- Each run schedules notifications two days in advance.
- Scheduling two days ahead ensures notifications in the earliest time zones (e.g., East Asia) aren’t missed —
for example, an 8 AM local notification in East Asia corresponds to 11 PM UTC the previous day,
which would otherwise be considered “in the past” if only scheduling one day ahead.

### 🧭 Summary of Flow
1. FCMNotificationSenderScheduler runs daily at midnight UTC.
2. It reads the schedule JSON file and creates Cloud Tasks for notifications two days ahead.
3. At the scheduled times, those tasks trigger FCMNotificationSender, which sends notifications to the correct FCM topic.

## Deploy

### Create Queue for FCMNotificationSender

### Deploy Functions

Install necessary dependencies: `npm install`

#### 1. FCMNotificationSender

`firebase deploy --only functions:fcmNotificationSender`

#### 2. FCMNotificationSenderScheduler

`firebase deploy --only functions:fcmNotificationSenderScheduler`
