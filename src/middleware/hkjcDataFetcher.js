const moment = require("moment");
const axios = require('axios');

// HKJC GraphQL API configuration
const HKJC_GRAPHQL_URL = 'https://info.cld.hkjc.com/graphql/base/';
const HKJC_GRAPHQL_QUERY = `fragment lotteryDrawsFragment on LotteryDraw {
  id
  year
  no
  openDate
  closeDate
  drawDate
  status
  snowballCode
  snowballName_en
  snowballName_ch
  lotteryPool {
    sell
    status
    totalInvestment
    jackpot
    unitBet
    estimatedPrize
    derivedFirstPrizeDiv
    lotteryPrizes {
      type
      winningUnit
      dividend
    }
  }
  drawResult {
    drawnNo
    xDrawnNo
  }
}

query marksixResult($lastNDraw: Int, $startDate: String, $endDate: String, $drawType: LotteryDrawType) {
  lotteryDraws(
    lastNDraw: $lastNDraw
    startDate: $startDate
    endDate: $endDate
    drawType: $drawType
  ) {
    ...lotteryDrawsFragment
  }
}`;

// Fetch ALL historical data from HKJC GraphQL API using 3-month date ranges
async function fetchHKJCChineseData() {
  try {
    console.log('🚀 Fetching ALL historical data from HKJC GraphQL API using 3-month date ranges...');
    
    // Generate 3-month date ranges from 1993-01-05 to now
    const dateRanges = generateThreeMonthDateRangesForGraphQL();
    console.log(`📅 Generated ${dateRanges.length} three-month date ranges`);
    
    const allResults = [];
    let totalFetched = 0;
    
    // Log first few ranges
    console.log('Sample date ranges:');
    dateRanges.slice(0, 5).forEach((range, index) => {
      console.log(`  ${index + 1}: ${range.startDisplay} to ${range.endDisplay}`);
    });
    console.log(`  ... and ${dateRanges.length - 5} more ranges`);
    
    for (const range of dateRanges) {
      try {
        const results = await fetchHKJCGraphQLForDateRange(range.start, range.end);
        if (results.length > 0) {
          allResults.push(...results);
          totalFetched += results.length;
          console.log(`✅ ${range.startDisplay}-${range.endDisplay}: ${results.length} draws (Total: ${totalFetched})`);
        }
        
        // Add delay to be respectful to the server
        await new Promise(resolve => setTimeout(resolve, 500));
        
      } catch (error) {
        console.log(`❌ Failed: ${error.message}`);
        continue;
      }
    }
    
    if (allResults.length === 0) {
      throw new Error("No data could be fetched from HKJC GraphQL API");
    }
    
    // Remove duplicates and sort
    const uniqueResults = removeDuplicateResults(allResults);
    const sortedResults = uniqueResults.sort((a, b) => moment(b.drawDate).valueOf() - moment(a.drawDate).valueOf());
    
    console.log(`🎉 Successfully fetched ${sortedResults.length} unique records via GraphQL API`);
    return sortedResults;
    
  } catch (error) {
    console.log(`❌ HKJC GraphQL fetch failed: ${error.message}`);
    throw new Error("No real data available from HKJC GraphQL API - only real data allowed");
  }
}

// Generate 3-month date ranges for GraphQL (YYYYMMDD format)
function generateThreeMonthDateRangesForGraphQL() {
  const ranges = [];
  const startDate = moment('1993-01-01'); // Mark Six lottery data from January 1, 1993
  const endDate = moment(); // Current date - fetch ALL historical data
  
  let currentStart = startDate.clone();
  
  while (currentStart.isBefore(endDate)) {
    const currentEnd = currentStart.clone().add(3, 'months').subtract(1, 'day');
    
    // If the end date goes beyond now, cap it at current date
    if (currentEnd.isAfter(endDate)) {
      currentEnd.set({
        year: endDate.year(),
        month: endDate.month(),
        date: endDate.date()
      });
    }
    
    ranges.push({
      start: currentStart.format('YYYYMMDD'),
      end: currentEnd.format('YYYYMMDD'),
      startDisplay: currentStart.format('DD/MM/YYYY'),
      endDisplay: currentEnd.format('DD/MM/YYYY')
    });
    
    // Move to next 3-month period
    currentStart.add(3, 'months');
    
    // Break if we've reached or passed the current date
    if (currentStart.isAfter(endDate)) {
      break;
    }
  }
  
  return ranges;
}

// Fetch data from HKJC GraphQL API for a specific date range
async function fetchHKJCGraphQLForDateRange(startDate, endDate) {
  try {
    const payload = {
      operationName: "marksixResult",
      query: HKJC_GRAPHQL_QUERY,
      variables: {
        lastNDraw: null,
        startDate: startDate,
        endDate: endDate,
        drawType: "All"
      }
    };

    const response = await axios.post(HKJC_GRAPHQL_URL, payload, {
      headers: {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Origin': 'https://bet.hkjc.com',
        'Referer': 'https://bet.hkjc.com/',
      },
      timeout: 15000
    });

    if (response.data && response.data.data && response.data.data.lotteryDraws) {
      const draws = response.data.data.lotteryDraws;
      return formatGraphQLDrawData(draws);
    } else {
      return [];
    }

  } catch (error) {
    throw new Error(`GraphQL fetch failed: ${error.message}`);
  }
}

// Format GraphQL data to our standard format
function formatGraphQLDrawData(rawDraws) {
  return rawDraws.map(draw => {
    // Extract the main numbers and extra number
    const mainNumbers = draw.drawResult?.drawnNo || [];
    const extraNumber = draw.drawResult?.xDrawnNo || null;
    
    // Format the date with proper timezone handling
    let drawDate = null;
    if (draw.drawDate) {
      // Handle timezone format like "1993-03-30+08:00"
      let dateString = draw.drawDate;
      
      // Remove timezone info properly - look for +HH:MM or -HH:MM at the end
      if (dateString.match(/[+-]\d{2}:\d{2}$/)) {
        // Extract date part before timezone (e.g., "1993-03-30+08:00" -> "1993-03-30")
        dateString = dateString.replace(/[+-]\d{2}:\d{2}$/, '');
      }
      
      const parsedDate = moment(dateString);
      if (parsedDate.isValid()) {
        drawDate = parsedDate.format('YYYY-MM-DD');
      } else {
        console.log(`⚠️ Invalid date format for draw ${draw.year}/${draw.no}: ${draw.drawDate}`);
        // Skip this draw - no date generation, only use real HKJC data
        drawDate = null;
      }
    }
    
    // Skip this draw if we couldn't get a valid date
    if (!drawDate || drawDate === 'Invalid date') {
      console.log(`❌ Skipping draw ${draw.year}/${draw.no} due to invalid date`);
      return null;
    }
    
    // Create draw number in format "YY/NNN"
    const drawNo = `${draw.year}/${String(draw.no).padStart(3, '0')}`;
    
    return {
      drawDate: drawDate,
      numbers: mainNumbers.sort((a, b) => a - b), // Sort numbers
      extraNumber: extraNumber,
      drawNo: drawNo
    };
  }).filter(draw => 
    // Only include draws with complete data and valid dates
    draw !== null &&
    draw.numbers.length === 6 && 
    draw.extraNumber !== null &&
    draw.drawDate &&
    draw.drawDate !== 'Invalid date'
  );
}

// Remove duplicates based on drawDate, numbers, and extraNumber
function removeDuplicateResults(results) {
  const seen = new Set();
  return results.filter(result => {
    // Skip invalid results
    if (!result || !result.drawDate || !result.numbers || !Array.isArray(result.numbers) || result.extraNumber === null || result.extraNumber === undefined) {
      console.log(`⚠️ Skipping invalid result:`, result);
      return false;
    }
    
    const key = `${result.drawDate}-${result.numbers.join(',')}-${result.extraNumber}`;
    if (seen.has(key)) {
      console.log(`🔄 Removing duplicate: ${result.drawDate} ${result.drawNo}`);
      return false;
    }
    seen.add(key);
    return true;
  });
}

module.exports = {
  fetchHKJCChineseData,
  removeDuplicateResults,
  generateThreeMonthDateRangesForGraphQL,
  fetchHKJCGraphQLForDateRange,
  formatGraphQLDrawData
};