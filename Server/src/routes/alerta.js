import axios from "axios";

export const sendAlert = async ({ message, channelRef }) => {
    try {
        const response = await axios.post(
            "https://api.alerta.encrisoft.com/v2/telegram/send",
            { message, channelRef },
            {
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": process.env.ALERTA_API_KEY,
                    "x-api-secret": process.env.ALERTA_API_SECRET,
                },
            }
        );

        return response.data;
    } catch (err) {
        console.error("Alerta Error:", err.response?.data || err.message);
        throw err;
    }
};