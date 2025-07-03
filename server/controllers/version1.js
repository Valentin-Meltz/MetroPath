import * as script from '../models/version1.js';

export const getShorterPath = async (req, res) => {
    const depart = req.params.depart;
    const arrivee = req.params.arrivee;
    console.log(`Request for shorter path from ${depart} to ${arrivee}`);

    try {
        const result = await script.shorterPath(depart, arrivee);
        console.log(result);
        res.status(200).json({ result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
};

export const getAllStations = (req, res) => {
    try {
        const stations = script.getAllStations();
        res.status(200).json({ stations });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the stations.' });
    }
}