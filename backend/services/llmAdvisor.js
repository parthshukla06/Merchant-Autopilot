const OpenAI = require("openai");

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1"
});

async function generateBusinessAdvice(result) {
    const prompt = `
You are Merchant Autopilot, an AI business advisor.

Analyze this what-if business scenario and give concise practical advice.

CURRENT:
Revenue: ₹${result.current.revenue}
Profit: ₹${result.current.profit}
Orders: ${result.current.orders}

SCENARIO:
Revenue: ₹${result.scenario.revenue}
Profit: ₹${result.scenario.profit}
Orders: ${result.scenario.orders}

IMPACT:
Revenue change: ₹${result.impact.revenueChange}
Profit change: ₹${result.impact.profitChange}
Additional orders: ${result.impact.additionalOrders}
Discount cost: ₹${result.impact.discountCost}

Return exactly these 5 sections:

SUMMARY:
FINANCIAL IMPACT:
RECOMMENDATION:
EXPLANATION:
NEXT STEP:

Keep the answer concise and business-focused.
`;

    const response = await client.chat.completions.create({
        model: "openai/gpt-oss-20b",
        messages: [
            {
                role: "user",
                content: prompt
            }
        ],
        temperature: 0.3
    });

    const text = response.choices[0].message.content;

    return {
        aiGenerated: true,
        advice: text
    };
}

module.exports = generateBusinessAdvice;