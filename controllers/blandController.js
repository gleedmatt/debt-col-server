const { buildOptions, buildBatchCallsData } = require('../utils/bland')
const { getContactsMock } = require('../mocks/contacts')

const getCalls = async (req, res) => {
  try {
    const response = await fetch(
      'https://api.bland.ai/v1/calls',
      buildOptions('GET')
    )
    const data = await response.json()
    res.send(data)
  } catch (err) {
    console.error(err)
  }
};

const sendBatchCall = async (req, res) => {
  try {
    const mockPayload = getContactsMock()
    const payload = buildBatchCallsData(mockPayload) // req.body

    // Log the payload to check if PATHWAY_ID is included
    console.log("Payload being sent to Bland AI:", JSON.stringify(payload, null, 2))

    const response = await fetch(
      'https://api.bland.ai/v1/batches',
      buildOptions('POST', payload)
    )
    const data = await response.json()
    res.send(data)
  } catch (err) {
    console.error(err)
  }
};

const getCallDetails = async (req, res) => {
  try {
    const { callId } = req.params
    console.log("Fetching details for call:", callId)

    const response = await fetch(`https://api.bland.ai/v1/calls/${callId}`, buildOptions("GET"))

    if (!response.ok) {
      console.error("Bland AI API error:", response.status, response.statusText)
      return res.status(response.status).send(`Error from Bland AI: ${response.statusText}`)
    }

    const data = await response.json()
    console.log("Call details response:", JSON.stringify(data, null, 2))

    // Extract relevant information based on the API documentation
    const {
      transcripts,
      call_id,
      call_length,
      to,
      from,
      completed,
      inbound,
      created_at,
      started_at,
      end_at,
      queue_status,
      max_duration,
      variables,
      answered_by,
      record,
      recording_url,
      metadata,
      summary,
      price,
      call_ended_by,
      concatenated_transcript,
      status,
      corrected_duration,
    } = data

    // Construct a response object with the extracted data
    const callDetails = {
      callId: call_id,
      transcripts,
      callLength: call_length,
      to,
      from,
      completed,
      inbound,
      createdAt: created_at,
      startedAt: started_at,
      endAt: end_at,
      queueStatus: queue_status,
      maxDuration: max_duration,
      variables,
      answeredBy: answered_by,
      recorded: record,
      recordingUrl: recording_url,
      metadata,
      summary,
      price,
      callEndedBy: call_ended_by,
      concatenatedTranscript: concatenated_transcript,
      status,
      correctedDuration: corrected_duration,
    }

    res.json(callDetails)
  } catch (err) {
    console.error("Error in getCallDetails:", err)
    res.status(500).send("Error fetching call details")
  }
};

const getCallStatistics = async (req, res) => {
  try {
    // Fetch all calls using existing getCalls logic
    const response = await fetch(
      'https://api.bland.ai/v1/calls',
      buildOptions('GET')
    );

    if (!response.ok) {
      console.error("Bland AI API error:", response.status, response.statusText);
      return res.status(response.status).json({ status: "error", message: "Failed to fetch call data" });
    }

    const data = await response.json();
    const calls = data.calls || [];

    // Objects to store aggregated data
    const callCounts = {}; // Total calls per date
    const ptpCounts = {}; // Calls where ptp_flag = true per date
    const totalCallLengths = {}; // Sum of call lengths for answered calls per date
    const answeredCallCounts = {}; // Number of answered calls per date
    const unansweredCallCounts = {}; // Number of unanswered calls per date

    let totalCallLengthOverall = 0; // Total call length for all dates
    let totalAnsweredCallsOverall = 0; // Total answered calls count for all dates
    let totalUnansweredCallsOverall = 0; // Total unanswered calls count
    let totalCallsOverall = 0; // Total number of calls
    let totalPtpFlags = 0; // Total number of PTP flags

    // Count of calls per "status"
    const callStatusCounts = {
      Answered: 0,
      Unanswered: 0
    };

    calls.forEach(call => {
      const createdAt = call.created_at || null;
      const callLength = call.call_length || 0; // Default to 0 if missing
      const callStatus = call.status || ""; // Call status (e.g., "completed", "no-answer")
      const variables = call.variables || {};
      const ptpFlag = variables.ptp_flag || false;

      if (createdAt) {
        const date = createdAt.split("T")[0]; // Extract YYYY-MM-DD

        // Count total calls per date
        callCounts[date] = (callCounts[date] || 0) + 1;
        totalCallsOverall += 1;

        // Count PTP flags per date
        if (ptpFlag === true) {
          ptpCounts[date] = (ptpCounts[date] || 0) + 1;
          totalPtpFlags += 1;
        }

        // Categorize call status
        if (callStatus === "completed") {
          callStatusCounts.Answered += 1;
          answeredCallCounts[date] = (answeredCallCounts[date] || 0) + 1;
          totalCallLengths[date] = (totalCallLengths[date] || 0) + callLength;
          totalAnsweredCallsOverall += 1;
        } else if (callStatus === "no-answer") {
          callStatusCounts.Unanswered += 1;
          unansweredCallCounts[date] = (unansweredCallCounts[date] || 0) + 1;
          totalUnansweredCallsOverall += 1;
        }
      }
    });

    // Compute average call length per date
    const avgCallLengthPerDate = {};
    Object.keys(answeredCallCounts).forEach(date => {
      avgCallLengthPerDate[date] = totalCallLengths[date] / answeredCallCounts[date];
    });

    // Compute overall average call length
    const overallAvgCallLength = totalAnsweredCallsOverall > 0
      ? totalCallLengthOverall / totalAnsweredCallsOverall
      : 0; // Prevent division by zero

    // Compute commitment rate
    const commitmentRate = totalCallsOverall > 0
      ? totalPtpFlags / totalCallsOverall
      : 0; // Prevent division by zero

    // Return JSON response
    res.json({
      status: "success",
      total_calls_per_date: callCounts,
      ptp_flag_counts_per_date: ptpCounts,
      avg_call_length_per_date: avgCallLengthPerDate,
      overall_avg_call_length: overallAvgCallLength,
      call_status_distribution: callStatusCounts, // Answered vs Unanswered counts
      total_calls: totalCallsOverall, // ✅ New: Total Calls
      commitment_rate: commitmentRate, // ✅ New: Commitment Rate
      answered_calls_per_date: answeredCallCounts, // ✅ New: Answered Calls by Date
      unanswered_calls_per_date: unansweredCallCounts // ✅ New: Unanswered Calls by Date
    });

  } catch (err) {
    console.error("Error fetching or processing call data:", err);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
  }
};


module.exports = {getCalls, sendBatchCall, getCallDetails, getCallStatistics}
