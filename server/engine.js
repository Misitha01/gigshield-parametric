/**
 * GIGSHIELD PARAMETRIC ENGINE (MOCK)
 * This logic validates the disruption and processes payouts.
 */

const VALIDATE_PAYOUT = (riderData, weatherData) => {
    const RAIN_THRESHOLD = 20; // Parametric trigger in mm
    
    console.log(`Checking Status for Rider: ${riderData.id}`);
    
    // 1. Check Parametric Trigger
    if (weatherData.rainfall < RAIN_THRESHOLD) {
        return { status: "REJECTED", reason: "Rainfall below threshold." };
    }

    // 2. AI Fraud Check (Mocked GPS Validation)
    if (!riderData.isActiveInZone) {
        return { status: "REJECTED", reason: "Rider not active in disruption zone." };
    }

    // 3. Success
    return {
        status: "APPROVED",
        payoutAmount: 500,
        transactionId: "TXN_" + Math.random().toString(36).substr(2, 9),
        message: "Instant payout triggered by environmental sensor data."
    };
};

// Demo Test
const demoRider = { id: "ZEPTO_99", isActiveInZone: true };
const demoWeather = { rainfall: 28 };
console.log(VALIDATE_PAYOUT(demoRider, demoWeather));