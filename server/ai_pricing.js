// Dynamic Pricing Logic based on Hyper-local Risk
const calculateDynamicPremium = (zoneData) => {
    const baseRate = 49;
    let adjustment = 0;

    // Hyper-local Risk Factors
    if (zoneData.floodHistory === 'High') adjustment += 5;
    if (zoneData.infrastructureQuality === 'Poor') adjustment += 3;
    if (zoneData.isSafeZone) adjustment -= 4; // Safety discount

    const finalPremium = baseRate + adjustment;
    
    return {
        premium: finalPremium,
        riskLevel: finalPremium > 50 ? "High Risk" : "Standard",
        reason: zoneData.isSafeZone ? "Safe-Zone Discount Applied" : "Flood-Risk Surcharge Applied"
    };
};

// Demo for Video:
console.log(calculateDynamicPremium({ floodHistory: 'High', isSafeZone: false }));