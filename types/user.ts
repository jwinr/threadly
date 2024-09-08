export interface Customer {
  customer_id: number
  first_name: string
  last_name: string
  account_status: string
  created_at: string
  email?: string // Optional, since it’s stored as bytea in the DB
  cognito_sub?: string // Optional, since it’s stored as bytea
  stripe_customer_id?: string // Optional, since it’s stored as bytea
  user_uuid: string
}

export interface Notification {
  notification_id: number
  customer_id: number
  notification_type: string
  message: string
  read_status: boolean
  sent_at: string // Timestamp as a string
}
