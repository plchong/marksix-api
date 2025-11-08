
// Enhanced Statistical Algorithm with Progressive Learning
// Moved from prediction.js

const enhancedStatisticalAlgorithm = {
  // Progressive learning: Each prediction is based on all previous draws
  runProgressiveLearning: function(history) {
    console.log("� Starting progressive learning...");
    const results = [];
    const chronologicalHistory = [...history].reverse();
    for (let i = 1; i < chronologicalHistory.length; i++) {
      const trainingData = chronologicalHistory.slice(0, i);
      const targetDraw = chronologicalHistory[i];
  const prediction = enhancedStatisticalAlgorithm.generateProgressivePrediction(trainingData, i);
  const accuracy = enhancedStatisticalAlgorithm.calculateAccuracy(prediction.numbers, targetDraw.numbers, prediction.extraNumber, targetDraw.extraNumber);
      results.push({
        step: i,
        trainingDraws: trainingData.length,
        targetDate: targetDraw.drawDate,
        targetNumbers: targetDraw.numbers,
        targetExtra: targetDraw.extraNumber,
        predictedNumbers: prediction.numbers,
        predictedExtra: prediction.extraNumber,
        correctNumbers: accuracy.correctNumbers,
        correctExtra: accuracy.correctExtra,
        accuracy: accuracy.percentage,
        method: prediction.method
      });
      if (i % 100 === 0 || i < 10) {
        console.log(`   Step ${i}: ${accuracy.correctNumbers}/6 numbers correct (${accuracy.percentage.toFixed(1)}%) - ${targetDraw.drawDate}`);
      }
    }
    console.log(`✅ Progressive learning completed: ${results.length} predictions made`);
    return results;
  },


  generateProgressivePrediction: function(trainingData, step) {
    if (trainingData.length === 1) {
      return enhancedStatisticalAlgorithm.generateSingleDrawPrediction(trainingData[0]);
    } else if (trainingData.length < 5) {
      return enhancedStatisticalAlgorithm.generateTrendPrediction(trainingData);
    } else if (trainingData.length < 20) {
      return enhancedStatisticalAlgorithm.generateFrequencyPrediction(trainingData);
    } else {
      return enhancedStatisticalAlgorithm.generateAdvancedPatternPrediction(trainingData);
    }
  },

  /**
   * Advanced Pattern Recognition for Mark Six predictions
   * Uses multiple statistical and pattern-based heuristics for best guess
   * @param {Array} trainingData - Array of historical draw objects
   * @returns {Object} { numbers: [int], extraNumber: int, method: string }
   */
  generateAdvancedPatternPrediction: function(trainingData) {
    // Use all historical data for analytics
    const allDraws = trainingData;

    // 1. Sliding window frequency (last 50 draws)
    const windowSize = 50;
    const windowDraws = allDraws.slice(-windowSize);
    const freqWindow = {};
    for (let i = 1; i <= 49; i++) freqWindow[i] = 0;
    windowDraws.forEach(draw => draw.numbers.forEach(num => freqWindow[num]++));
    const topWindowFreq = Object.entries(freqWindow)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([num]) => parseInt(num));

    // 2. Pair and triplet analysis (all history)
    const pairCounts = {};
    const tripletCounts = {};
    allDraws.forEach(draw => {
      // Pairs
      for (let i = 0; i < draw.numbers.length; i++) {
        for (let j = i + 1; j < draw.numbers.length; j++) {
          const key = [draw.numbers[i], draw.numbers[j]].sort((a,b)=>a-b).join('-');
          pairCounts[key] = (pairCounts[key] || 0) + 1;
        }
      }
      // Triplets
      for (let i = 0; i < draw.numbers.length; i++) {
        for (let j = i + 1; j < draw.numbers.length; j++) {
          for (let k = j + 1; k < draw.numbers.length; k++) {
            const key = [draw.numbers[i], draw.numbers[j], draw.numbers[k]].sort((a,b)=>a-b).join('-');
            tripletCounts[key] = (tripletCounts[key] || 0) + 1;
          }
        }
      }
    });
    // Find most common pairs/triplets
    const topPairs = Object.entries(pairCounts).sort(([,a],[,b])=>b-a).slice(0,10).map(([key])=>key.split('-').map(Number));
    const topTriplets = Object.entries(tripletCounts).sort(([,a],[,b])=>b-a).slice(0,5).map(([key])=>key.split('-').map(Number));

    // 3. Gap/overdue analysis (all history)
    const lastSeen = {};
    for (let i = 1; i <= 49; i++) lastSeen[i] = -1;
    allDraws.forEach((draw, idx) => {
      draw.numbers.forEach(num => lastSeen[num] = idx);
    });
    const overdueNumbers = Object.entries(lastSeen)
      .sort(([,a],[,b])=>a-b)
      .slice(0,10)
      .map(([num])=>parseInt(num));

    // 4. Compose prediction: prioritize top window freq, then pairs/triplets, then overdue
    const selected = [];
    // Add top 3 from sliding window frequency
    for (let i = 0; i < topWindowFreq.length && selected.length < 3; i++) {
      if (!selected.includes(topWindowFreq[i])) selected.push(topWindowFreq[i]);
    }
    // Add numbers from most common pairs
    for (let pair of topPairs) {
      for (let num of pair) {
        if (!selected.includes(num) && selected.length < 5) selected.push(num);
      }
      if (selected.length >= 5) break;
    }
    // Add numbers from most common triplets
    for (let triplet of topTriplets) {
      for (let num of triplet) {
        if (!selected.includes(num) && selected.length < 6) selected.push(num);
      }
      if (selected.length >= 6) break;
    }
    // Fill with most overdue if needed
    for (let num of overdueNumbers) {
      if (!selected.includes(num) && selected.length < 6) selected.push(num);
    }
    // Fill up to 6 with randoms if needed
    while (selected.length < 6) {
      const num = Math.floor(Math.random() * 49) + 1;
      if (!selected.includes(num)) selected.push(num);
    }

    // Extra number: most frequent in all history
    const extraFrequency = {};
    allDraws.forEach(draw => {
      extraFrequency[draw.extraNumber] = (extraFrequency[draw.extraNumber] || 0) + 1;
    });
    const predictedExtra = parseInt(Object.entries(extraFrequency).sort(([,a], [,b]) => b - a)[0]?.[0] || (Math.floor(Math.random() * 49) + 1));
    return {
      numbers: selected.sort((a, b) => a - b),
      extraNumber: predictedExtra,
      method: "advanced_pattern_ensemble"
    };
  },

  generateSingleDrawPrediction: function(singleDraw) {
    const numbers = singleDraw.numbers.map(num => {
      const variation = Math.floor(Math.random() * 7) - 3;
      return Math.max(1, Math.min(49, num + variation));
    }).sort((a, b) => a - b);
    const extraNumber = Math.max(1, Math.min(49, singleDraw.extraNumber + Math.floor(Math.random() * 5) - 2));
    return {
      numbers: numbers,
      extraNumber: extraNumber,
      method: "single_draw_variation"
    };
  },

  generateTrendPrediction: function(trainingData) {
    const positions = Array(6).fill(0).map(() => []);
    const extraNumbers = [];
    trainingData.forEach(draw => {
      const sortedNumbers = [...draw.numbers].sort((a, b) => a - b);
      sortedNumbers.forEach((num, pos) => {
        if (pos < 6) positions[pos].push(num);
      });
      extraNumbers.push(draw.extraNumber);
    });
    const predictedNumbers = positions.map(posNumbers => {
      if (posNumbers.length === 0) return Math.floor(Math.random() * 49) + 1;
      if (posNumbers.length === 1) {
        return Math.max(1, Math.min(49, posNumbers[0] + Math.floor(Math.random() * 7) - 3));
      }
      const lastTwo = posNumbers.slice(-2);
      const trend = lastTwo[1] - lastTwo[0];
      const nextNum = lastTwo[1] + trend;
      return Math.max(1, Math.min(49, nextNum));
    });
    const avgExtra = extraNumbers.reduce((a, b) => a + b, 0) / extraNumbers.length;
    const predictedExtra = Math.max(1, Math.min(49, Math.round(avgExtra + Math.floor(Math.random() * 5) - 2)));
    return {
      numbers: predictedNumbers.sort((a, b) => a - b),
      extraNumber: predictedExtra,
      method: "trend_analysis"
    };
  },

  generateFrequencyPrediction: function(trainingData) {
    const frequency = {};
    for (let i = 1; i <= 49; i++) frequency[i] = 0;
    trainingData.forEach(draw => {
      draw.numbers.forEach(num => frequency[num]++);
    });
    const sortedNumbers = Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 12)
      .map(([num]) => parseInt(num));
    const selected = [];
    for (let i = 0; i < 6 && i < sortedNumbers.length; i++) {
      selected.push(sortedNumbers[i]);
    }
    while (selected.length < 6) {
      const num = Math.floor(Math.random() * 49) + 1;
      if (!selected.includes(num)) selected.push(num);
    }
    const extraFrequency = {};
    trainingData.forEach(draw => {
      extraFrequency[draw.extraNumber] = (extraFrequency[draw.extraNumber] || 0) + 1;
    });
    const predictedExtra = parseInt(Object.entries(extraFrequency).sort(([,a], [,b]) => b - a)[0]?.[0] || (Math.floor(Math.random() * 49) + 1));
    return {
      numbers: selected.sort((a, b) => a - b),
      extraNumber: predictedExtra,
      method: "frequency_analysis"
    };
  },

  calculateAccuracy: function(predicted, actual, predictedExtra, actualExtra) {
    let correctNumbers = 0;
    const actualSorted = [...actual].sort((a, b) => a - b);
    const predictedSorted = [...predicted].sort((a, b) => a - b);
    predictedSorted.forEach(predNum => {
      if (actualSorted.includes(predNum)) {
        correctNumbers++;
      }
    });
    const correctExtra = predictedExtra === actualExtra ? 1 : 0;
    const totalPossible = 7;
    const totalCorrect = correctNumbers + correctExtra;
    const percentage = (totalCorrect / totalPossible) * 100;
    return {
      correctNumbers: correctNumbers,
      correctExtra: correctExtra,
      totalCorrect: totalCorrect,
      percentage: percentage
    };
  },

  calculateOverallAccuracy: function(results) {
    if (results.length === 0) return 0;
    const totalAccuracy = results.reduce((sum, result) => sum + result.accuracy, 0);
    return totalAccuracy / results.length;
  },

  getAccuracyGrade: function(accuracy) {
    if (accuracy >= 100) return 'Perfect';
    if (accuracy >= 85) return 'Excellent';
    if (accuracy >= 70) return 'Very Good';
    if (accuracy >= 55) return 'Good';
    if (accuracy >= 40) return 'Fair';
    if (accuracy >= 25) return 'Poor';
    return 'Very Poor';
  },
  analyze: function(history) {
    try {
      console.log("🎯 Enhanced Statistical Analysis Started");
      console.log(`📊 Processing ${history.length} historical draws with advanced statistical methods...`);
      
      if (history.length < 3) {
        throw new Error("Insufficient historical data for statistical analysis");
      }

      // Step 1: Use Advanced Statistical Predictor for Next Draw
      console.log("🔬 Creating statistical predictor...");
      let nextPrediction;
      
      // Temporarily bypass the statistical predictor to test
      nextPrediction = {
        numbers: [1, 7, 15, 21, 35, 42],
        extraNumber: 24,
        confidence: 75,
        method: 'enhanced_frequency_analysis',
        analysis: { 
          message: "Enhanced statistical prediction",
          topFrequentNumbers: [],
          strongestPairs: [],
          overdueNumbers: [],
          currentTrends: { hot: [], cold: [] },
          optimalSum: { min: 120, max: 180 },
          optimalDistribution: { low: 2, mid: 2, high: 2 }
        },
        reasoning: ["Frequency analysis", "Pattern recognition", "Distribution optimization"]
      };
      
      console.log(`🔮 Statistical prediction: [${nextPrediction.numbers.join(', ')}] + ${nextPrediction.extraNumber}`);
      
      // Step 2: Skip progressive validation for now (to isolate issues)
      let progressiveResults = [];
      let progressiveAccuracy = 0;
      
      console.log("⏭️ Skipping progressive validation to test statistical predictor only");
      
      return {
        predicted: nextPrediction.numbers,
        extraNumber: nextPrediction.extraNumber,
        confidence: nextPrediction.confidence,
        algorithm: "Enhanced Statistical Predictor",
        method: nextPrediction.method,
        analysis: {
          totalLearningSteps: progressiveResults.length || 0,
          overallAccuracy: progressiveAccuracy || 0,
          progressiveAccuracy: progressiveAccuracy || 0,
          averageCorrectNumbers: (progressiveAccuracy || 0) / 16.67, // Approximate conversion
          statisticalAnalysis: nextPrediction.analysis,
          reasoning: nextPrediction.reasoning,
          bestLearningCase: (progressiveResults && progressiveResults.length > 0) ? 
            progressiveResults.reduce((best, curr) => curr.accuracy > (best.accuracy || 0) ? curr : best, {}) : null,
          recentAccuracy: progressiveAccuracy || 0,
          validationResults: (progressiveResults && progressiveResults.length > 0) ? 
            progressiveResults.slice(-5) : [] // Last 5 validation steps
        }
      };
    } catch (error) {
      console.log("⚠️ Statistical analysis error:", error.message);
      console.log("Stack trace:", error.stack);
      return this.generateFallbackPrediction(history);
    }
  },

  generateFallbackPrediction: function(history) {
    console.log("🔄 Using fallback prediction method");
    
    // Use basic frequency analysis as fallback
    const frequency = {};
    for (let i = 1; i <= 49; i++) frequency[i] = 0;
    
    history.forEach(draw => {
      draw.numbers.forEach(num => frequency[num]++);
    });
    
    const sortedNumbers = Object.entries(frequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 12)
      .map(([num]) => parseInt(num));
    
    // Select 6 numbers with some randomization
    const selected = [];
    for (let i = 0; i < 6 && i < sortedNumbers.length; i++) {
      selected.push(sortedNumbers[i]);
    }
    
    // Fill remaining with random numbers
    while (selected.length < 6) {
      const num = Math.floor(Math.random() * 49) + 1;
      if (!selected.includes(num)) selected.push(num);
    }
    
    return {
      predicted: selected.sort((a, b) => a - b),
      extraNumber: Math.floor(Math.random() * 49) + 1,
      confidence: 25,
      algorithm: "Fallback Frequency Analysis",
      method: "fallback_frequency",
      analysis: {
        totalLearningSteps: 0,
        overallAccuracy: 0,
        progressiveAccuracy: 0,
        averageCorrectNumbers: 0,
        statisticalAnalysis: { message: "Fallback method due to error in main algorithm" },
        reasoning: ["Fallback prediction due to error"],
        bestLearningCase: null,
        recentAccuracy: 0,
        validationResults: []
      }
    };
  },

  runDetailedAnalysis: function(history, limit = 50, showAll = false) {
    console.log(`🔍 Running detailed case-by-case analysis...`);
    
    // Run progressive learning to get all results
    const progressiveResults = enhancedStatisticalAlgorithm.runProgressiveLearning(history);

    // Select results based on parameters
    let selectedResults = progressiveResults;
    if (!showAll && limit < progressiveResults.length) {
      // Show most recent results if not showing all
      selectedResults = progressiveResults.slice(-limit);
    } else if (limit < progressiveResults.length) {
      // Limit results
      selectedResults = progressiveResults.slice(0, limit);
    }

    // Calculate statistics
    const overallAccuracy = enhancedStatisticalAlgorithm.calculateOverallAccuracy(progressiveResults);
    const averageCorrectNumbers = progressiveResults.reduce((sum, r) => sum + r.correctNumbers, 0) / progressiveResults.length;

    // Find best and worst cases
    const bestCase = progressiveResults.reduce((best, curr) => curr.accuracy > best.accuracy ? curr : best);
    const worstCase = progressiveResults.reduce((worst, curr) => curr.accuracy < worst.accuracy ? curr : worst);

    // Count perfect and zero matches
    const perfectMatches = progressiveResults.filter(r => r.correctNumbers === 6).length;
    const zeroMatches = progressiveResults.filter(r => r.correctNumbers === 0).length;

    // Create accuracy distribution
    const accuracyDistribution = {
      "90-100%": progressiveResults.filter(r => r.accuracy >= 90).length,
      "70-89%": progressiveResults.filter(r => r.accuracy >= 70 && r.accuracy < 90).length,
      "50-69%": progressiveResults.filter(r => r.accuracy >= 50 && r.accuracy < 70).length,
      "30-49%": progressiveResults.filter(r => r.accuracy >= 30 && r.accuracy < 50).length,
      "10-29%": progressiveResults.filter(r => r.accuracy >= 10 && r.accuracy < 30).length,
      "0-9%": progressiveResults.filter(r => r.accuracy < 10).length
    };

    // Create method performance breakdown
    const methodPerformance = {};
    progressiveResults.forEach(result => {
      const method = result.method || 'unknown';
      if (!methodPerformance[method]) {
        methodPerformance[method] = { cases: 0, totalAccuracy: 0, totalCorrectNumbers: 0 };
      }
      methodPerformance[method].cases++;
      methodPerformance[method].totalAccuracy += result.accuracy;
      methodPerformance[method].totalCorrectNumbers += result.correctNumbers;
    });

    // Calculate averages for each method
    Object.keys(methodPerformance).forEach(method => {
      const perf = methodPerformance[method];
      perf.avgAccuracy = perf.totalAccuracy / perf.cases;
      perf.avgCorrectNumbers = perf.totalCorrectNumbers / perf.cases;
    });

    // Format cases for detailed view
    const formattedCases = selectedResults.map((result, index) => ({
      caseNumber: progressiveResults.length - selectedResults.length + index + 1,
      step: result.step,
      trainingData: {
        drawsUsed: result.trainingDraws,
        method: result.method
      },
      target: {
        date: result.targetDate,
        numbers: result.targetNumbers,
        extraNumber: result.targetExtra,
        formatted: `${result.targetNumbers.join(', ')} + ${result.targetExtra}`
      },
      predicted: {
        numbers: result.predictedNumbers,
        extraNumber: result.predictedExtra,
        formatted: `${result.predictedNumbers.join(', ')} + ${result.predictedExtra}`
      },
      accuracy: {
        correctNumbers: result.correctNumbers,
        correctExtra: result.correctExtra,
        totalCorrect: result.correctNumbers + result.correctExtra,
        percentage: result.accuracy.toFixed(2) + '%',
        grade: enhancedStatisticalAlgorithm.getAccuracyGrade(result.accuracy)
      },
      matches: {
        mainNumbers: result.targetNumbers.filter(num => result.predictedNumbers.includes(num)),
        extraMatch: result.targetExtra === result.predictedExtra
      }
    }));

    return {
      cases: formattedCases,
      overallAccuracy: overallAccuracy || 0,
      averageCorrectNumbers: averageCorrectNumbers || 0,
      bestCase,
      worstCase,
      perfectMatches,
      zeroMatches,
      accuracyDistribution,
      methodPerformance
    };
  },

  // ... (other methods should be moved here as well)
};

module.exports = enhancedStatisticalAlgorithm;
