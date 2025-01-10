const fetch = require("node-fetch");

exports.handler = async (event) => {
    const address = event.queryStringParameters.address;
    const DOORDASH_API_KEY = "c6b30377-3bbe-4ab3-b2d6-0fd3d9e352db";

    if (!address) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: "Address is required" }),
        };
    }

    const apiUrl = `https://api.doordash.com/drive/v2/stores/nearby?address=${encodeURIComponent(address)}`;
    try {
        const response = await fetch(apiUrl, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${DOORDASH_API_KEY}`,
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch data from DoorDash API" }),
        };
    }
};
