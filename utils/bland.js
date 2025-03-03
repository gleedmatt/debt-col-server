const buildOptions = (method, payload) => {
  console.log("BLAND_API_KEY:", process.env.BLAND_API_KEY); // Debugging

  const options = {
    method,
    headers: {
      authorization: process.env.BLAND_API_KEY, // Ensure this is set
      'Content-Type': 'application/json',
    },
  }

  if (payload) {
    options.body = JSON.stringify(payload);
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
    call_data: callData,
    voice: 'Cailee', // 'Cailee',
    background_track: 'office',
    pathway_id: process.env.PATHWAY_ID,
  }

  return batchCallsData
}

module.exports = { buildOptions, buildBatchCallsData }
