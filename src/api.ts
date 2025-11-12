import RealtimeRegisterAPI from '@realtimeregister/api'

if (!process.env.API_KEY) throw new Error('API_KEY is not set')
if (!process.env.CUSTOMER) throw new Error('CUSTOMER is not set')

export const rtr = new RealtimeRegisterAPI({
  apiKey: process.env.API_KEY,
  customer: process.env.CUSTOMER,
  ote: process.env.OTE ? Boolean(process.env.OTE) : false
})
