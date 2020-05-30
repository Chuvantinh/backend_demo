task conf

"SYSTEM_SCHEDULE_REQUEST_DESTRUCTION"
  Attached to: Request
  Condition: User creates buddy request
  Delay: 48h
  Run: Once
  Reschedule: Never

"PUSH_NOTIFY_NEW_CHAT_MESSAGE"
  Attached to: Chat and receiving user
  Condition: Chat message send
  Delay: 10s
  Run: Once
  Reschedule: Never

"BOT_WELCOME_MESSAGE"
  Attached to: Chat
  Condition: Buddy Match -> Chat Created
  Run: Once
  Reschedule: Never
  Delay: 10s

"BOT_INTRODUCTION_CREATE_ACTIVITIES_TIME"
  Attached to: Chat
  Condition: No Chat Msg after 6min
  Run: Once
  Reschedule: Never
  Delay: 6min
  
"BOT_INTRODUCTION_CREATE_ACTIVITIES_COUNT"
  Attached to: Chat
  Condition: No Calendar Entry after 20 Chat Messages
  Delay: none
  Run: Once
  Reschedule: Never

"BOT_PLANNED_ACTIVITIES_LOW"
  Attached to: Chat
  Condition: planned activity < activeMinutesPerWeek
  Delay: on Thursdays
  Run: Repeat
  Reschedule: Always

"BOT_REMIND_TO_CHAT"
  Attached to: Chat
  Condition: No Chat message
  Delay: 8d
  Run: Once
  Reschedule: On Chat Message
  
"PUSH_NOTIFY_IPAQ_REMINDER"
  Attached to:
  Condition: 
  Delay:  
  Run: 
  Reschedule: 

"PUSH_NOTIFY_IPAQ_REMINDER_FOLLOWUP"
  Attached to:
  Condition: 
  Delay:  
  Run: 
  Reschedule: 
"PUSH_NOTIFY_PHQ_REMINDER"
Attached to:
  Condition: 
  Delay:  
  Run: 
  Reschedule: 
"PUSH_NOTIFY_PHQ_REMINDER_FOLLOWUP"
Attached to:
  Condition: 
  Delay:  
  Run: 
  Reschedule: 
"PUSH_NOTIFY_INCOMING_BUDDY_REQUEST"
  Attached to:
  Condition: 
  Delay:  
  Run: 
  Reschedule: 
"PUSH_NOTIFY_BUDDY_REQUEST_DENIED"
  Attached to:
  Condition: 
  Delay:  
  Run: 
  Reschedule: 
"PUSH_NOTIFY_NOT_ENOUGH_ACTIVITIES_USER"
  Attached to: User
  Condition: nextWeek: planned activity < activeMinutesPerWeek
  Delay: on Thursdays
  Run: Repeat
  Reschedule: Always

"PUSH_NOTIFY_NOT_ENOUGH_ACTIVITIES_BUDDY"
  Attached to:
  Condition: 
  Delay:  
  Run: 
  Reschedule: 
"PUSH_NOTIFY_TO_MUCH_ACTIVITIES_USER"
  Attached to:
  Condition: 
  Delay:  
  Run: 
  Reschedule: 
"PUSH_NOTIFY_TO_MUCH_ACTIVITIES_BUDDY"
  Attached to:
  Condition: 
  Delay:  
  Run: 
  Reschedule: 
"PUSH_NOTIFY_MISSED_ACTIVITY_BUDDY"
  Attached to:
  Condition: 
  Delay:  
  Run: 
  Reschedule: 
