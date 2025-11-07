const axios = require('axios');
const moment = require('moment');

// HKJC GraphQL API integration
class HKJCGraphQLAPI {
  constructor() {
    this.baseURL = 'https://info.cld.hkjc.com/graphql/base/';
    this.query = `fragment lotteryDrawsFragment on LotteryDraw {
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
  }

  // Generate 3-month date ranges from 1993-01-01 to now
  generateThreeMonthDateRanges() {
    const ranges = [];
    const startDate = moment('1993-01-01');
    const endDate = moment(); // Current date
    
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

  // Fetch data for a specific date range
  async fetchDateRange(startDate, endDate) {
    try {
      const payload = {
        operationName: "marksixResult",
        query: this.query,
        variables: {
          lastNDraw: null,
          startDate: startDate,
          endDate: endDate,
          drawType: "All"
        }
      };

      console.log(`Fetching HKJC data from ${startDate} to ${endDate}...`);

      const response = await axios.post(this.baseURL, payload, {
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
        console.log(`✓ Successfully fetched ${draws.length} draws from HKJC GraphQL API`);
        return this.formatDrawData(draws);
      } else {
        console.log('✗ No data found in GraphQL response');
        return [];
      }

    } catch (error) {
      console.log(`✗ GraphQL fetch failed for ${startDate}-${endDate}:`, error.message);
      return [];
    }
  }

  // Format the raw GraphQL data to our standard format
  formatDrawData(rawDraws) {
    return rawDraws.map(draw => {
      // Extract the main numbers and extra number
      const mainNumbers = draw.drawResult?.drawnNo || [];
      const extraNumber = draw.drawResult?.xDrawnNo || null;
      
      // Format the date
      const drawDate = moment(draw.drawDate).format('YYYY-MM-DD');
      
      // Create draw number in format "YY/NNN"
      const drawNo = `${draw.year}/${String(draw.no).padStart(3, '0')}`;
      
      return {
        drawDate: drawDate,
        numbers: mainNumbers.sort((a, b) => a - b), // Sort numbers
        extraNumber: extraNumber,
        drawNo: drawNo,
        // Additional metadata from HKJC
        status: draw.status,
        snowball: draw.snowballName_en || null,
        jackpot: draw.lotteryPool?.jackpot || null,
        totalInvestment: draw.lotteryPool?.totalInvestment || null
      };
    }).filter(draw => 
      // Only include draws with complete data
      draw.numbers.length === 6 && 
      draw.extraNumber !== null &&
      draw.drawDate
    );
  }

  // Fetch ALL historical data using 3-month chunks
  async fetchAllHistoricalData() {
    const allResults = [];
    
    try {
      console.log('🚀 Starting comprehensive HKJC data fetch via GraphQL API...');
      
      // Generate all 3-month date ranges from 1993 to now
      const dateRanges = this.generateThreeMonthDateRanges();
      console.log(`📅 Generated ${dateRanges.length} three-month date ranges to process`);
      
      // Show first few ranges
      console.log('Sample date ranges:');
      dateRanges.slice(0, 5).forEach((range, index) => {
        console.log(`  ${index + 1}: ${range.startDisplay} to ${range.endDisplay}`);
      });
      console.log(`  ... and ${dateRanges.length - 5} more ranges`);
      
      let totalFetched = 0;
      
      for (const range of dateRanges) {
        try {
          const results = await this.fetchDateRange(range.start, range.end);
          
          if (results.length > 0) {
            allResults.push(...results);
            totalFetched += results.length;
            console.log(`✓ Range ${range.startDisplay} to ${range.endDisplay}: ${results.length} draws (Total: ${totalFetched})`);
          } else {
            console.log(`⚪ Range ${range.startDisplay} to ${range.endDisplay}: No data`);
          }
          
          // Add delay to be respectful to the server
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          console.log(`✗ Range ${range.startDisplay} to ${range.endDisplay}: Failed - ${error.message}`);
          continue;
        }
      }
      
      if (allResults.length === 0) {
        throw new Error("No data could be fetched from HKJC GraphQL API");
      }
      
      // Remove duplicates and sort
      const uniqueResults = this.removeDuplicates(allResults);
      const sortedResults = uniqueResults.sort((a, b) => moment(b.drawDate).valueOf() - moment(a.drawDate).valueOf());
      
      console.log(`🎉 Successfully fetched ${sortedResults.length} unique Mark Six draws via GraphQL API`);
      console.log(`📊 Date range: ${sortedResults[sortedResults.length - 1]?.drawDate} to ${sortedResults[0]?.drawDate}`);
      
      return sortedResults;
      
    } catch (error) {
      console.log(`❌ GraphQL comprehensive fetch failed: ${error.message}`);
      throw error;
    }
  }

  // Fetch recent draws (last N draws)
  async fetchRecentDraws(count = 50) {
    try {
      const payload = {
        operationName: "marksixResult",
        query: this.query,
        variables: {
          lastNDraw: count,
          startDate: null,
          endDate: null,
          drawType: "All"
        }
      };

      console.log(`Fetching last ${count} draws from HKJC GraphQL API...`);

      const response = await axios.post(this.baseURL, payload, {
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
          'Origin': 'https://bet.hkjc.com',
          'Referer': 'https://bet.hkjc.com/',
        },
        timeout: 15000
      });

      if (response.data && response.data.data && response.data.data.lotteryDraws) {
        const draws = response.data.data.lotteryDraws;
        console.log(`✓ Successfully fetched ${draws.length} recent draws`);
        return this.formatDrawData(draws);
      } else {
        console.log('✗ No recent data found');
        return [];
      }

    } catch (error) {
      console.log(`✗ Recent draws fetch failed:`, error.message);
      return [];
    }
  }

  // Remove duplicate draws
  removeDuplicates(draws) {
    const seen = new Set();
    return draws.filter(draw => {
      const key = `${draw.drawDate}-${draw.numbers.join(',')}-${draw.extraNumber}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
  }
}

module.exports = HKJCGraphQLAPI;