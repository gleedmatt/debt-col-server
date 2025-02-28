const buildOptions = (method, payload) => {
  const options = {
    method,
    headers: {
      authorization: process.env.BLAND_API_KEY,
      'Content-Type': 'application/json',
    },
  }

  if (payload) {
    options.body = JSON.stringify(payload)
  }

  return options
}

const buildBatchCallsData = (payload) => {
  const callData = payload.map((contact) => ({
    phone_number: contact.phoneNumber,
    person_name: contact.personName,
    company_name: contact.companyName,
    balance_outstanding: contact.balanceOutstanding,
  }))

  const batchCallsData = {
    base_prompt:
      'You are calling {{company_name}} to inform {{person_name}} about their outstanding balance of {{balance_outstanding}}.',
    call_data: callData,
    voice: '95bd81a6-4e9e-4d8d-b7d6-29b7af2fffa0', // 'Cailee',
    background_track: 'office',
    wait_for_greeting: true,
    pathway_id: process.env.PATHWAY_ID,
  }

  return batchCallsData
}

module.exports = { buildOptions, buildBatchCallsData }
